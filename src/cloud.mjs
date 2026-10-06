import {DurableObject} from 'cloudflare:workers';
import {handle,authorize,json} from './api.mjs';
import {durableSql} from './durable-sql.mjs';
import {schema} from './schema.mjs';
import staticWorker from './worker.mjs';

// This object is reachable only through the STUDIO_DATABASE binding, never a public URL.
export class StudioDatabase extends DurableObject {
 constructor(ctx,env){super(ctx,env);ctx.storage.sql.exec(schema);this.appEnv={...env,DB:durableSql(ctx.storage)};}
 async fetch(request){const email=request.headers.get('x-studio-verified-email');return handle(request,this.appEnv,email?{access:{getIdentity:async()=>({email})}}:{});}
}
export default {async fetch(request,env,ctx){
 if(!new URL(request.url).pathname.startsWith('/api/'))return staticWorker.fetch(request,env,ctx);
 try{const actor=await authorize(request,env,ctx);const headers=new Headers(request.headers);headers.delete('x-studio-verified-email');if(actor.email)headers.set('x-studio-verified-email',actor.email);const internal=new Request(request,{headers});return env.STUDIO_DATABASE.get(env.STUDIO_DATABASE.idFromName('owner-workspace')).fetch(internal);}catch(e){return json({error:e.message||'Request failed.'},e.status||500);}
}};
