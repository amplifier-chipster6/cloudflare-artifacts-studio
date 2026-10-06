import {handle,authorize,json} from './api.mjs';
import {assets} from './assets.mjs';
const headers={'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Cache-Control':'no-store'};
export default {async fetch(request,env,ctx){
 const path=new URL(request.url).pathname;
 if(path.startsWith('/api/'))return handle(request,env,ctx);
 try{await authorize(request,env,ctx);}catch(e){return json({error:e.message},e.status||401);}
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers});
 const asset=assets[path==='/'?'/index.html':path];if(!asset)return new Response('Not found',{status:404,headers});
 return new Response(request.method==='HEAD'?null:asset.content,{headers:{...headers,'content-type':asset.type}});
}};
