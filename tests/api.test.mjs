import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {handle} from '../src/api.mjs';

function fixture() {
 const sql=new DatabaseSync(':memory:'); sql.exec(readFileSync(new URL('../schema.sql',import.meta.url),'utf8'));
 const DB={prepare(q){return {values:[],bind(...v){this.values=v;return this},async first(){return sql.prepare(q).get(...this.values)||null},async all(){return {results:sql.prepare(q).all(...this.values)}},async run(){const x=sql.prepare(q).run(...this.values);return {meta:{changes:Number(x.changes)}}}}},async batch(xs){sql.exec('BEGIN');try{const result=[];for(const x of xs)result.push(await x.run());sql.exec('COMMIT');return result}catch(e){sql.exec('ROLLBACK');throw e}}};
 const env={DB,OWNER_EMAILS:'owner@example.com',RUNNER_TOKEN:'test-runner-token-with-at-least-32-bytes'};
 const ctx={access:{getIdentity:async()=>({email:'owner@example.com'})}};
 async function req(path,body,options={}){const r=await handle(new Request('https://studio.example'+path,{method:options.method|| (body?'POST':'GET'),headers:{...(body?{'Content-Type':'application/json','Origin':'https://studio.example'}:{}),...options.headers},...(body?{body:JSON.stringify(body)}:{})}),env,options.ctx??ctx);return {status:r.status,data:await r.json()};}
 return {env,ctx,req,sql};
}
test('owner routes fail closed without verified identity and deny spoofed email headers',async()=>{const f=fixture();assert.equal((await f.req('/api/state',null,{ctx:{},headers:{'Cf-Access-Authenticated-User-Email':'owner@example.com'}})).status,401);});
test('cross-origin writes are rejected',async()=>{const f=fixture();assert.equal((await f.req('/api/projects',{name:'Wrong'},{headers:{Origin:'https://evil.example'}})).status,403);});
test('project/task/context persist and packets contain only explicitly selected same-project context',async()=>{
 const f=fixture();const p=(await f.req('/api/projects',{name:'Pilot',path:'modernization'})).data;
 const q=(await f.req('/api/projects',{name:'Separate',path:'research'})).data;
 const c=(await f.req('/api/contexts',{project_id:p.id,title:'Evidence',kind:'evidence',content:'Only this',source:'manual'})).data;
 const d=(await f.req('/api/contexts',{project_id:q.id,title:'Private other',kind:'decision',content:'Never attach'})).data;
 const task={project_id:p.id,title:'Fix a flow',goal:'Repair login',acceptance:'A login succeeds',scope:'src/login',context_ids:[c.id],assignments:[{role:'Builder',instruction:'Repair the flow'}]};
 assert.equal((await f.req('/api/tasks',{...task,context_ids:[d.id]})).status,400);
 const t=(await f.req('/api/tasks',task)).data;assert.ok(t.id);
 const packet=(await f.req(`/api/tasks/${t.id}/packet`)).data;assert.equal(packet.contexts.length,1);assert.equal(packet.contexts[0].content,'Only this');
 assert.equal((await f.req(`/api/tasks/${t.id}/queue`,{})).status,409);
 assert.equal((await f.req('/api/state')).data.tasks.length,1);
});
test('runner credential cannot access owner routes',async()=>{const f=fixture();assert.equal((await f.req('/api/state',null,{ctx:{},headers:{Authorization:'Bearer '+f.env.RUNNER_TOKEN}})).status,401);});
test('repo API removes initial token',async()=>{const f=fixture();f.env.ARTIFACTS={create:async(name)=>({name,token:'SECRET',remote:'https://acct.artifacts.cloudflare.net/git/studio/x.git',defaultBranch:'main'})};const x=await f.req('/api/repos',{name:'hello'});assert.equal(x.status,201);assert.equal(JSON.stringify(x).includes('SECRET'),false);});
test('claims are exclusive, stale receipts rejected, review binds exact head',async()=>{
 const f=fixture();const base='a'.repeat(40),head='b'.repeat(40);const repos=new Map([['pilot',{name:'pilot',remote:'https://acct.artifacts.cloudflare.net/git/studio/pilot.git',defaultBranch:'main'}]]);
 let unrelated=false;
 f.env.ARTIFACTS={list:async()=>({repos:[...repos.values()]}),get:async(name)=>({info:async()=>repos.get(name),log:async()=>name==='pilot'?[{hash:base}]:[{hash:head},...(unrelated?[]:[{hash:base}])],fork:async(n)=>{const r={name:n,remote:`https://acct.artifacts.cloudflare.net/git/studio/${n}.git`};repos.set(n,r);return r},createToken:async()=>({plaintext:'REPO_SECRET'}),readCommit:async(h)=>h===head?{hash:head}:null})};
 const p=(await f.req('/api/projects',{name:'Pilot',path:'modernization'})).data;f.sql.prepare('UPDATE projects SET repo_name=? WHERE id=?').run('pilot',p.id);
 const t=(await f.req('/api/tasks',{project_id:p.id,title:'Task',goal:'Goal',acceptance:'Works',scope:'src',context_ids:[],assignments:[{role:'Builder',instruction:'Implement'},{role:'Tester',instruction:'Test'}]})).data;
 const runner={ctx:{},headers:{Authorization:'Bearer '+f.env.RUNNER_TOKEN}};
 await f.req('/api/runner/heartbeat',{runner_id:'test'},runner);
 const queue=await f.req(`/api/tasks/${t.id}/queue`,{});assert.equal(queue.status,201);assert.equal(queue.data.runs.length,2);
 assert.equal((await f.req(`/api/tasks/${t.id}/queue`,{})).status,409);
 const claims=await Promise.all([f.req('/api/runner/claim',{runner_id:'test'},runner),f.req('/api/runner/claim',{runner_id:'test'},runner),f.req('/api/runner/claim',{runner_id:'test'},runner)]);
 const active=claims.map(c=>c.data).filter(c=>c.run);assert.equal(active.length,2);assert.notEqual(active[0].run.id,active[1].run.id);assert.equal(active[0].repo.token,'REPO_SECRET');
 const run=active[0].run;const report={attempt:run.attempt,lease_token:run.lease_token,status:'succeeded',head_commit:head,diff:'+ verified change',tests:{passed:true},summary:'Ready'};
 assert.equal((await f.req(`/api/runner/runs/${run.id}/report`,{...report,lease_token:'wrong'},runner)).status,409);
 unrelated=true;
 assert.equal((await f.req(`/api/runner/runs/${run.id}/report`,report,runner)).status,409);
 unrelated=false;
 assert.equal((await f.req(`/api/runner/runs/${run.id}/report`,report,runner)).status,200);
 assert.equal((await f.req(`/api/runner/runs/${run.id}/report`,report,runner)).status,409);
 assert.equal((await f.req(`/api/runs/${run.id}/review`,{decision:'accepted',expected_head:base})).status,409);
 assert.equal((await f.req(`/api/runs/${run.id}/review`,{decision:'accepted',expected_head:head})).data.status,'accepted');
 const state=(await f.req('/api/state')).data;assert.equal(JSON.stringify(state).includes('REPO_SECRET'),false);assert.equal(JSON.stringify(state).includes(run.lease_token),false);assert.equal(state.projects.find(x=>x.id===p.id).stage,'discovery');
});
