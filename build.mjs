import {readFile,writeFile,mkdir} from 'node:fs/promises';
const assets={};
for(const [name,type] of [['index.html','text/html; charset=utf-8'],['app.js','text/javascript; charset=utf-8'],['style.css','text/css; charset=utf-8']])assets['/'+name]={content:await readFile(new URL('public/'+name,import.meta.url),'utf8'),type};
await mkdir(new URL('src/',import.meta.url),{recursive:true});
await writeFile(new URL('src/assets.mjs',import.meta.url),'export const assets = '+JSON.stringify(assets)+';\n');
await writeFile(new URL('src/schema.mjs',import.meta.url),'export const schema = '+JSON.stringify(await readFile(new URL('schema.sql',import.meta.url),'utf8'))+';\n');
console.log('Bundled 3 local assets for Worker and local server. No third-party runtime dependencies.');
