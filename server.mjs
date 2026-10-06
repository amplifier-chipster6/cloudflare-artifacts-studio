import {createServer} from 'node:http';
import {resolve} from 'node:path';
import {openDatabase} from './src/sqlite.mjs';
import {artifactsRest} from './src/artifacts-rest.mjs';
import worker from './src/worker.mjs';
const port=Number(process.env.PORT||8787);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('PORT must be 1024–65535.');
const env={DB:openDatabase(resolve(process.env.STUDIO_DB||'data/studio.sqlite')),OWNER_EMAILS:'local@studio',RUNNER_TOKEN:process.env.STUDIO_RUNNER_TOKEN};
if(process.env.CLOUDFLARE_API_TOKEN&&process.env.CLOUDFLARE_ACCOUNT_ID)env.ARTIFACTS=artifactsRest({account:process.env.CLOUDFLARE_ACCOUNT_ID,namespace:process.env.ARTIFACTS_NAMESPACE||'artifacts-studio',token:process.env.CLOUDFLARE_API_TOKEN});
const ctx={access:{getIdentity:async()=>({email:'local@studio'})}};
const server=createServer(async(req,res)=>{try{
 if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(req.headers.host)){res.writeHead(403);res.end('Loopback host required.');return;}
 const chunks=[];let length=0;for await(const chunk of req){length+=chunk.length;if(length>524288){res.writeHead(413);res.end('Request too large');return;}chunks.push(chunk);}
 const data=Buffer.concat(chunks);const request=new Request(`http://${req.headers.host}${req.url}`,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)&&data.length?{body:data}:{})});
 const result=await worker.fetch(request,env,ctx);res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));
 }catch{res.writeHead(500);res.end('Local request failed.');}});
server.listen(port,'127.0.0.1',()=>console.log(`Artifacts Studio: http://127.0.0.1:${port} (local-only; data stored in SQLite)`));
process.on('SIGTERM',()=>server.close(()=>{env.DB.close();process.exit(0)}));
process.on('SIGINT',()=>server.close(()=>{env.DB.close();process.exit(0)}));
