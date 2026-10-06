// API-backed frontend smoke test with a deliberately minimal DOM harness.
// It checks rendered markup and real form payloads, not browser layout, native
// DOM events, keyboard behavior or accessibility. No browser package is needed.
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {once} from 'node:events';
const root=fileURLToPath(new URL('../',import.meta.url));
const port=Number(process.env.STUDIO_TEST_PORT||18791);
const origin=`http://127.0.0.1:${port}`;
const temporary=await mkdtemp(join(tmpdir(),'artifacts-ui-test-'));
const serverEnv={...process.env,PORT:String(port),STUDIO_DB:join(temporary,'studio.sqlite')};
// A verification run must never connect to the user's real Artifacts or runner.
delete serverEnv.CLOUDFLARE_API_TOKEN;
delete serverEnv.CLOUDFLARE_ACCOUNT_ID;
delete serverEnv.STUDIO_RUNNER_TOKEN;
execFileSync(process.execPath,['build.mjs'],{cwd:root,stdio:'pipe'});
const server=spawn(process.execPath,['server.mjs'],{cwd:root,env:serverEnv,stdio:['ignore','pipe','inherit']});
const stopOnExit=()=>server.kill('SIGTERM');
process.on('exit',stopOnExit);
try {
await new Promise((resolve,reject)=>{
  server.stdout.once('data',resolve);
  server.once('error',reject);
  server.once('exit',code=>reject(new Error(`Local server exited before startup (${code}).`)));
});
const elements=new Map();
function element(selector){if(!elements.has(selector))elements.set(selector,{innerHTML:'',textContent:'',hidden:false,disabled:false,open:false,querySelector:element,setAttribute(){},addEventListener(){},focus(){},scrollIntoView(){},classList:{remove(){},contains(){return false},toggle(){return false}},replaceChildren(){},showModal(){this.open=true},close(){this.open=false}});return elements.get(selector)}
const document={querySelector:element,addEventListener(){},createElement:()=>({remove(){},click(){}}),body:{append(){}}};
class FormDataStub{constructor(form){this.values=form.values}entries(){return this.values[Symbol.iterator]()}getAll(key){return this.values.filter(pair=>pair[0]===key).map(pair=>pair[1])}}
const calls=[];
const context={document,location:{hash:''},history:{replaceState(){}},window:{addEventListener(){},scrollTo(){}},fetch:async(path,options={})=>{calls.push({path,options});return fetch(origin+path,{...options,headers:{...options.headers,Origin:origin}})},FormData:FormDataStub,URL,URLSearchParams,Blob,requestAnimationFrame:fn=>fn(),setTimeout:()=>0,clearTimeout(){},console};
let source=await readFile(root+'/public/app.js','utf8');
source=source.replace("  refresh().then(() => { if (ui.section === 'repositories' && ui.loaded) loadRepos(); });",'');
source=source.replace(/\}\)\(\);\s*$/,'globalThis.test={state,ui,refresh,navigate,submitForm,scopedContexts,contextChecks,api,openTaskForm,openReviewForm,reviewDetail,loadRepos};})();');
vm.runInNewContext(source,context);
const test=context.test;
function form(id,values,dataset={}){return {id,values:Object.entries(values),dataset,querySelector:selector=>selector==='#form-error'?element('form-error'):element('submit')}}
await test.refresh();
assert.equal(test.state.projects.length,3);
assert.match(element('#main').innerHTML,/Good work starts here/);
const first=test.state.projects[0];
const other=test.state.projects[1];
await test.submitForm(form('project-form',{name:'UI test <img src=x onerror=alert(1)>',description:'Disposable test project',github_url:'',path:'research'}));
const created=test.state.projects.find(project=>project.name.startsWith('UI test'));
assert.ok(created);
assert.match(element('#main').innerHTML,/&lt;img src=x onerror=alert\(1\)&gt;/);
assert.doesNotMatch(element('#main').innerHTML,/<img src=x/);
await test.submitForm(form('context-form',{project_id:first.id,title:'Selected first project note',kind:'evidence',content:'Explicitly selected content',source:'local test'}));
await test.submitForm(form('context-form',{project_id:other.id,title:'Other project private note',kind:'decision',content:'Must not leak into task',source:''}));
const selected=test.state.contexts.find(item=>item.project_id===first.id);
const otherContext=test.state.contexts.find(item=>item.project_id===other.id);
assert.match(test.contextChecks(first.id),/Selected first project note/);
assert.doesNotMatch(test.contextChecks(first.id),/Other project private note/);
const taskForm=form('task-form',{project_id:first.id,title:'UI smoke task',goal:'Verify app and packet flow',acceptance:'Selected context only',scope:'Disposable local test data',role_1:'builder',instruction_1:'Inspect bounded files',role_2:'',instruction_2:''});
taskForm.values.push(['context_ids',selected.id],['context_ids',otherContext.id]);
await test.submitForm(taskForm);
const task=test.state.tasks.find(item=>item.title==='UI smoke task');
assert.ok(task);
assert.equal(task.context_ids.length,1);
assert.equal(task.context_ids[0],selected.id);
const packet=await test.api(`/api/tasks/${task.id}/packet`);
assert.equal(packet.contexts.length,1);
assert.equal(packet.contexts[0].id,selected.id);
assert.ok(!JSON.stringify(packet).includes('Must not leak'));
assert.match(element('#main').innerHTML,/data-action="queue-task"[^>]* disabled/);
for(const section of ['overview','projects','work','context','review','connections']){test.navigate(section);assert.ok(element('#main').innerHTML.length>100);assert.doesNotMatch(element('#main').innerHTML,/<img src=x/)}
test.navigate('repositories');await test.loadRepos();assert.match(element('#main').innerHTML,/Artifacts is not connected|unavailable/i);
const maliciousRun={id:'test-run',task_id:task.id,status:'review_ready',head_commit:'a'.repeat(40),summary:'<script>bad()</script>',diff:'<img src=x onerror=alert(1)>',tests:{passed:true},role:'builder'};
test.state.runs=[maliciousRun];test.openReviewForm('test-run','accepted');
assert.match(element('#dialog-content').innerHTML,new RegExp(`data-head="${'a'.repeat(40)}"`));
assert.match(test.reviewDetail(maliciousRun),/&lt;img src=x/);
assert.doesNotMatch(test.reviewDetail(maliciousRun),/<script>/);
const workspaceExport=await test.api('/api/export');assert.ok(workspaceExport);
console.log(JSON.stringify({checks:10,result:'PASS',coverage:['real state load','project form POST and escaped rendering','context form POST','project-only context choices','task form POST and context isolation','structured packet contents','disconnected queue disabled','seven view render paths','repo unavailable handling','exact-head review form and escaped evidence'],limitation:'Minimal DOM harness only. Does not verify browser rendering, native events, keyboard interaction or accessibility.'},null,2));

} finally {
  if (server.exitCode===null) {
    const exited=once(server,'exit');
    server.kill('SIGTERM');
    await exited;
  }
  process.off('exit',stopOnExit);
  await rm(temporary,{recursive:true,force:true});
}
