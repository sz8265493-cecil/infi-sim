// Official Army wire-format reader. Independent browser implementation.
// Protocol evidence: inspected Tactical_Helper codec and official Army fixtures.
// Only ordinary V0/V1 lists; no speculative repair, Spec-Ops, or reinforcement.
export function normalizeCode(input){
 let s=String(input||'').trim();if(!s||s.length>16000)throw Error('请输入有效的官方军表代码（最多 16000 字符）');
 if(/^https?:/i.test(s)){const url=new URL(s);if(!['infinityuniverse.com','www.infinityuniverse.com'].includes(url.hostname))throw Error('只接受官方 Infinity Army 链接');s=url.search.match(/[?&](?:code|armyCode)=([^&]+)/)?.[1]||url.pathname.split('/army/list/')[1]||'';}
 try{s=decodeURIComponent(s);}catch{throw Error('代码的 URL 编码损坏');}
 s=s.replace(/\s/g,'').replace(/-/g,'+').replace(/_/g,'/');
 if(!/^[A-Za-z0-9+/]+={0,2}$/.test(s)||s.replace(/=+$/,'').length%4===1)throw Error('军表代码不是有效 Base64');
 s=s.replace(/=+$/,'');return s+'='.repeat((4-s.length%4)%4);
}
export function decodeArmyCode(input){
 const code=normalizeCode(input);let bytes;try{bytes=Uint8Array.from(atob(code),c=>c.charCodeAt(0));}catch{throw Error('军表代码不是有效 Base64');}
 let pos=0;const read=()=>{if(pos>=bytes.length)throw Error('军表代码被截断');const x=bytes[pos++];if(x<128)return x;if(pos>=bytes.length)throw Error('军表代码被截断');return (x&127)*256+bytes[pos++];};
 const text=()=>{const n=read();if(n>512||pos+n>bytes.length)throw Error('军表名称长度无效');const s=new TextDecoder('utf-8',{fatal:true}).decode(bytes.slice(pos,pos+n));pos+=n;return s;};
 const factionId=read(),factionName=text(),name=text(),pointsLimit=read(),count=read();
 if(count<1||count>2||pointsLimit<1||pointsLimit>1000)throw Error('仅支持 1–2 个普通战斗组的军表');
 const start=pos,solutions=[];
 // Layout alternatives describe observed V0/V1 padding, never profile fallbacks.
 function parseGroups(index,groups){
  if(index===count){if(pos===bytes.length)solutions.push(groups);return;}
  const begin=pos;
  for(const padding of [1,2,3]){
   pos=begin;try{
    const groupId=read(),version=read();if(groupId!==index+1||![0,1].includes(version))continue;
    if(version===1&&read()!==0)continue;
    const size=read();if(size<1||size>10)continue;
    const members=[];
    for(let i=0;i<size;i++){
     const counter=read();if(counter!==0&&counter!==i+1)throw Error('unsupported counter');
     const unitId=read(),profileGroupId=read(),optionId=read();if(!unitId||!profileGroupId||!optionId)throw Error('invalid ID');
     members.push({unitId,groupId:profileGroupId,optionId});
     for(let j=0;j<padding;j++)if(read()!==0)throw Error('customization or unsupported format');
    }
    parseGroups(index+1,[...groups,{id:groupId,members}]);
   }catch{/* reject this exact layout */}
  }
  pos=begin;
 }
 pos=start;parseGroups(0,[]);
 const unique=[...new Map(solutions.map(s=>[JSON.stringify(s),s])).values()];
 if(unique.length!==1)throw Error('无法完整识别军表格式；不支持增援、Spec-Ops 自定义或损坏的代码。请从官方 Army 重新导出普通军表。');
 return {factionId,factionName,name,pointsLimit,groups:unique[0]};
}
// Deterministic ordinary-list encoder for fixtures and the built-in import example.
export function encodeArmyCode(list){
 const bytes=[],put=n=>{if(!Number.isInteger(n)||n<0||n>32767)throw Error('Invalid Army ID');if(n>127)bytes.push((n>>8)|128,n&255);else bytes.push(n);},str=s=>{const b=new TextEncoder().encode(s);put(b.length);bytes.push(...b);};
 put(list.factionId);str(list.factionName||'yu-jing');str(list.name||'');put(list.pointsLimit||300);put(list.groups.length);
 for(const g of list.groups){put(g.id);put(0);put(g.members.length);g.members.forEach((m,i)=>{put(i+1);put(m.unitId);put(m.groupId);put(m.optionId);put(0);});}
 return btoa(String.fromCharCode(...bytes));
}
