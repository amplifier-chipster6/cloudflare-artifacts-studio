import test from 'node:test';
import assert from 'node:assert/strict';
import {artifactsRest} from '../src/artifacts-rest.mjs';
test('REST adapter translates binding arguments and preserves cursor without exposing tokens in URLs',async()=>{
 const calls=[];const adapter=artifactsRest({account:'a'.repeat(32),namespace:'studio',token:'SECRET',fetcher:async(url,options)=>{calls.push({url,options});return Response.json({success:true,result:[],result_info:{cursor:'next'}})}});
 const page=await adapter.list({limit:50,cursor:'current'});assert.equal(page.cursor,'next');assert.deepEqual(page.repos,[]);assert.equal(calls[0].options.headers.Authorization,'Bearer SECRET');assert.ok(!calls[0].url.includes('SECRET'));
 await adapter.create('repo',{setDefaultBranch:'main',readOnly:false});const data=JSON.parse(calls[1].options.body);assert.equal(data.default_branch,'main');assert.equal(data.read_only,false);
});
test('REST adapter treats file bytes as bytes and API failures as failures',async()=>{const config={account:'a'.repeat(32),namespace:'studio',token:'SECRET'};const adapter=artifactsRest({...config,fetcher:async()=>new Response('hello')});assert.equal(await (await (await adapter.get('repo')).readFile({ref:'main',path:'README.md'})).text(),'hello');const bad=artifactsRest({...config,fetcher:async()=>Response.json({success:false,errors:[{message:'SECRET'}]},{status:403})});await assert.rejects(()=>bad.list(),e=>!e.message.includes('SECRET'));});
