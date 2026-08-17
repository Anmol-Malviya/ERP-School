const BASE=(process.env.NEXT_PUBLIC_API_URL||'http://localhost:5000/api/v1').replace(/\/$/,'');
let accessToken:string|null=null;let refreshPromise:Promise<string|null>|null=null;const browser=()=>typeof window!=='undefined';
export type ApiEnvelope<T>={success:boolean;message:string;data:T;meta?:{total:number;page:number;limit:number;pages:number}};
export function setAccessToken(token:string|null){accessToken=token;if(browser()){if(token)sessionStorage.setItem('erp_access',token);else sessionStorage.removeItem('erp_access')}}
export function getAccessToken(){if(accessToken)return accessToken;if(browser())accessToken=sessionStorage.getItem('erp_access');return accessToken}
export function setActiveSchool(id:string|null){if(browser()){if(id)localStorage.setItem('erp_school',id);else localStorage.removeItem('erp_school')}}export function getActiveSchool(){return browser()?localStorage.getItem('erp_school'):null}
async function refresh(){if(refreshPromise)return refreshPromise;refreshPromise=(async()=>{try{const r=await fetch(`${BASE}/auth/refresh`,{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:'{}'});if(!r.ok){setAccessToken(null);return null}const j:ApiEnvelope<{accessToken:string}>=await r.json();setAccessToken(j.data.accessToken);return j.data.accessToken}catch{setAccessToken(null);return null}finally{refreshPromise=null}})();return refreshPromise}
async function request<T>(path:string,init:RequestInit={},retry=true):Promise<ApiEnvelope<T>>{const headers=new Headers(init.headers);if(!headers.has('content-type')&&init.body)headers.set('content-type','application/json');const token=getAccessToken();if(token)headers.set('authorization',`Bearer ${token}`);const school=getActiveSchool();if(school)headers.set('x-school-id',school);const r=await fetch(`${BASE}${path.startsWith('/')?path:`/${path}`}`,{...init,headers,credentials:'include'});if(r.status===401&&retry&&!path.startsWith('/auth/')){const t=await refresh();if(t)return request<T>(path,init,false)}const j=await r.json().catch(()=>({success:false,message:r.statusText,data:null}));if(!r.ok)throw new Error(j.message||`Request failed (${r.status})`);return j}
export const api={get:<T>(p:string)=>request<T>(p),post:<T>(p:string,b?:unknown)=>request<T>(p,{method:'POST',body:b===undefined?undefined:JSON.stringify(b)}),put:<T>(p:string,b?:unknown)=>request<T>(p,{method:'PUT',body:JSON.stringify(b)}),patch:<T>(p:string,b?:unknown)=>request<T>(p,{method:'PATCH',body:JSON.stringify(b)}),delete:<T>(p:string)=>request<T>(p,{method:'DELETE'}),login:<T>(email:string,password:string)=>request<T>('/auth/login',{method:'POST',body:JSON.stringify({email,password})},false),refresh};

type UploadSignature={provider:'cloudinary';uploadUrl:string;apiKey:string;timestamp:number;folder:string;signature:string;maxBytes:number;allowedMimeTypes:string[]};
type UploadedFile={url:string;provider:string;name:string;publicId?:string;size?:number;mimeType?:string};

export async function uploadFile(file:File):Promise<ApiEnvelope<UploadedFile>>{
  const signed=await api.post<UploadSignature>('/uploads/sign',{fileName:file.name,mimeType:file.type,size:file.size});
  const s=signed.data;
  if(file.size>s.maxBytes)throw new Error(`File exceeds ${Math.round(s.maxBytes/1048576)} MB limit`);
  if(!s.allowedMimeTypes.includes(file.type))throw new Error('Unsupported file type');

  const form=new FormData();
  form.append('file',file);
  form.append('api_key',s.apiKey);
  form.append('timestamp',String(s.timestamp));
  form.append('folder',s.folder);
  form.append('signature',s.signature);

  const response=await fetch(s.uploadUrl,{method:'POST',body:form});
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result?.error?.message||'Cloud upload failed');

  return {
    success:true,
    message:'File uploaded',
    data:{url:String(result.secure_url||result.url),provider:'cloudinary',name:file.name,publicId:result.public_id,size:result.bytes,mimeType:file.type}
  };
}
