import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase} from '../src/sqlite.mjs';
import {handle} from '../src/api.mjs';

const base='a'.repeat(40);

function fixture(t){
 const DB=openDatabase(':memory:');
 t.after(()=>DB.close());
 const env={DB,OWNER_EMAILS:'owner@example.com',RUNNER_TOKEN:'test-runner-token-with-at-least-32-bytes'};
 const ctx={access:{getIdentity:async()=>({email:'owner@example.com'})}};
 async function request(path,data,{runner=false,method=data?'POST':'GET'}={}){
  const response=await handle(new Request('https://studio.example'+path,{
   method,
   headers:{'Content-Type':'application/json',Origin:'https://studio.example',...(runner?{Authorization:'Bearer '+env.RUNNER_TOKEN}:{})},
   ...(data?{body:JSON.stringify(data)}:{}),
  }),env,runner?{}:ctx);
  return {status:response.status,data:await response.json()};
 }
 async function prepareTask(){
  const project=(await request('/api/projects',{name:'Review regression'})).data;
  await DB.prepare('UPDATE projects SET repo_name=? WHERE id=?').bind('original-source',project.id).run();
  const task=(await request('/api/tasks',{
   project_id:project.id,title:'Bounded change',goal:'Improve the source',acceptance:'Checks pass',scope:'src',context_ids:[],
   assignments:[{role:'Builder',instruction:'Make the bounded change'}],
  })).data;
  assert.equal((await request('/api/runner/heartbeat',{runner_id:'test'},{runner:true})).status,200);
  return {project,task};
 }
 return {DB,env,request,prepareTask};
}

test('claim with a lease expired during provisioning never returns runnable credentials',async t=>{
 const f=fixture(t);
 let releaseToken,tokenEntered;
 const tokenBlocked=new Promise(resolve=>{releaseToken=resolve});
 const atToken=new Promise(resolve=>{tokenEntered=resolve});
 f.env.ARTIFACTS={
  list:async()=>({repos:[]}),
  get:async()=>({
   info:async()=>({defaultBranch:'main'}),
   log:async()=>[{hash:base}],
   fork:async name=>({name,remote:`https://artifacts.example/${name}.git`}),
   createToken:async()=>{tokenEntered();await tokenBlocked;return {plaintext:'SHOULD_NOT_BE_RETURNED'}},
  }),
 };
 const {task}=await f.prepareTask();
 assert.equal((await f.request(`/api/tasks/${task.id}/queue`,{})).status,201);
 const pendingClaim=f.request('/api/runner/claim',{runner_id:'test'},{runner:true});
 await atToken;
 await f.DB.prepare('UPDATE runs SET lease_until=0 WHERE task_id=?').bind(task.id).run();
 const state=await f.request('/api/state');
 assert.equal(state.data.runs.find(run=>run.task_id===task.id).status,'failed');
 releaseToken();
 const claim=await pendingClaim;
 assert.equal(claim.status,409);
 assert.equal(claim.data.repo,undefined);
 assert.equal(JSON.stringify(claim).includes('SHOULD_NOT_BE_RETURNED'),false);
});

test('project relink while queue reads its base cannot change the pinned fork source',async t=>{
 const f=fixture(t);
 let projectId;
 const forkSources=[];
 f.env.ARTIFACTS={
  list:async()=>({repos:[]}),
  get:async name=>({
   info:async()=>({defaultBranch:'main'}),
   log:async()=>{
    const relink=await f.request(`/api/projects/${projectId}`,{repo_name:'replacement-source'},{method:'PATCH'});
    assert.equal(relink.status,200);
    return [{hash:base}];
   },
   fork:async forkName=>{forkSources.push(name);return {name:forkName,remote:`https://artifacts.example/${forkName}.git`}},
   createToken:async()=>({plaintext:'SCOPED_REPO_TOKEN'}),
  }),
 };
 const {project,task}=await f.prepareTask();
 projectId=project.id;
 assert.equal((await f.request(`/api/tasks/${task.id}/queue`,{})).status,201);
 const claim=await f.request('/api/runner/claim',{runner_id:'test'},{runner:true});
 assert.equal(claim.status,200);
 assert.equal(claim.data.run.base_commit,base);
 assert.equal(claim.data.packet.project.repo_name,'original-source');
 assert.deepEqual(forkSources,['original-source']);
 const current=await f.DB.prepare('SELECT repo_name FROM projects WHERE id=?').bind(project.id).first();
 assert.equal(current.repo_name,'replacement-source');
});

test('queue failure after the task update rolls back the whole attempt and permits retry',async t=>{
 const f=fixture(t);
 f.env.ARTIFACTS={list:async()=>({repos:[]}),get:async()=>({info:async()=>({defaultBranch:'main'}),log:async()=>[{hash:base}]})};
 const {task}=await f.prepareTask();
 const prepare=f.DB.prepare.bind(f.DB);
 let failUpdateOnce=true;
 f.DB.prepare=sql=>{
  const statement=prepare(sql);
  if(sql.includes("UPDATE tasks SET status='queued'")){
   for(const method of ['run','syncRun']){
    if(typeof statement[method]!=='function')continue;
    const execute=statement[method];
    statement[method]=function(...args){
     const result=execute.apply(this,args);
     const maybeFail=value=>{
      if(failUpdateOnce){failUpdateOnce=false;throw new Error('Injected failure after task status write')}
      return value;
     };
     return result?.then?result.then(maybeFail):maybeFail(result);
    };
   }
  }
  return statement;
 };
 assert.equal((await f.request(`/api/tasks/${task.id}/queue`,{})).status,500);
 const state=await f.request('/api/state');
 assert.equal(state.data.tasks.find(item=>item.id===task.id).status,'draft');
 assert.equal(state.data.runs.filter(run=>run.task_id===task.id).length,0);
 const retry=await f.request(`/api/tasks/${task.id}/queue`,{});
 assert.equal(retry.status,201);
 assert.equal(retry.data.runs.length,1);
});
