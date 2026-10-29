// Independent static-site loader: collections stay separate and failed loads are retryable.
// Only validated data is cached; the cache lives in memory, not in a visitor's army save.
const sources=new Map([[201,'./assets/army-yujing.json?v=121'],[103,'./assets/army-103.json?v=121']]);
export function validateCatalog(data,id){
 if(!data||data.factionId!==id)throw Error('资料阵营不匹配，未使用其他阵营替代');
 if(typeof data.version!=='string'||!data.version||typeof data.accessed!=='string')throw Error('资料缺少版本信息');
 for(const key of ['entries','weapons','ammunitions','types'])if(!Array.isArray(data[key])||!data[key].length)throw Error('资料集合不完整：'+key);
 for(const entry of [...data.entries,...(data.auxiliaryEntries||[])]){
  if(!['unitId','groupId','optionId'].every(k=>Number.isInteger(entry[k])&&entry[k]>0)||(!entry.ambiguousProfiles&&(!entry.stats||!['weapons','skills','equip','chars','orders'].every(k=>Array.isArray(entry[k])))))throw Error('单位配置资料不完整，未写入缓存');
 }
 return data;
}
export function createCatalogLoader(fetcher=(...args)=>fetch(...args),{timeoutMs=15000}={}){
 const cached=new Map(),pending=new Map();
 return function load(id){
  if(!sources.has(id))return Promise.reject(Error('当前资料库不支持该阵营'));
  if(cached.has(id))return Promise.resolve(cached.get(id));
  if(pending.has(id))return pending.get(id);
  const controller=new AbortController();let timer;
  const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('资料下载超时，请重试'));},timeoutMs);});
  const task=Promise.race([Promise.resolve().then(()=>fetcher(sources.get(id),{signal:controller.signal})).then(r=>{if(!r.ok)throw Error('资料下载失败（HTTP '+r.status+'）');return r.json();}).then(data=>validateCatalog(data,id)),timeout]).then(data=>{cached.set(id,data);return data;}).finally(()=>{clearTimeout(timer);pending.delete(id);});
  pending.set(id,task);return task;
 };
}
