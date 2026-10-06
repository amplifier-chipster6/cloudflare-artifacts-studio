// Local-server adapter for the documented Cloudflare v4 API; Worker deployments use a native binding.
export function artifactsRest({account,namespace='artifacts-studio',token,fetcher=fetch}) {
 if(!/^[a-f0-9]{32}$/.test(account)||!/^[A-Za-z0-9][A-Za-z0-9._-]{0,61}[A-Za-z0-9._]$/.test(namespace)||!token)throw new Error('Invalid Artifacts account, namespace or token configuration.');
 const base=`https://api.cloudflare.com/client/v4/accounts/${account}/artifacts/namespaces/${encodeURIComponent(namespace)}`;
 async function request(path,{method='GET',data,query,raw=false}={}){const qs=new URLSearchParams();for(const [k,v] of Object.entries(query||{}))if(v!==undefined)qs.set(k,String(v));const response=await fetcher(base+path+(qs.size?'?'+qs:''),{method,headers:{Authorization:`Bearer ${token}`,...(data?{'Content-Type':'application/json'}:{})},...(data?{body:JSON.stringify(data)}:{}),redirect:'error',signal:AbortSignal.timeout(20000)});if(raw&&response.status===404)return null;if(!response.ok)throw new Error(`Artifacts request failed (HTTP ${response.status}).`);if(raw)return response.blob();const body=await response.json();if(body.success!==true)throw new Error('Artifacts API reported failure.');return body;}
 const result=async(path,options)=>(await request(path,options)).result;
 return {
  async list(opts={}){const r=await request('/repos',{query:opts});return {repos:r.result,cursor:r.result_info?.cursor||null}},
  create:(name,opts={})=>result('/repos',{method:'POST',data:{name,description:opts.description,default_branch:opts.setDefaultBranch,read_only:opts.readOnly}}),
  async get(name){const root='/repos/'+encodeURIComponent(name);return {
   info:()=>result(root),
   log:(opts)=>result(root+'/log',{query:opts}),
   readCommit:hash=>result(root+'/commit/'+encodeURIComponent(hash)),
   readFile:opts=>request(root+'/file',{query:opts,raw:true}),
   fork:(forkName,opts={})=>result(root+'/fork',{method:'POST',data:{name:forkName,description:opts.description,default_branch_only:opts.defaultBranchOnly,read_only:opts.readOnly}}),
   createToken:(scope,ttl)=>result('/tokens',{method:'POST',data:{repo:name,scope,ttl}}),
  }},
 };
}
