// Shared dice, per-shot templates and per-actor attacks. Never roll an ARO twice.
import * as F from './combat.js?v=117';
import * as E from './engine.js?v=117';
import * as K from './skills.js?v=117';
import * as S from './states.js?v=109';
import * as Z from './targetless.js?v=75';
import * as V from './saves.js?v=109';
const intersection=(a,b)=>{const bag=[...b];return a.filter(n=>{const i=bag.indexOf(n);if(i<0)return false;bag.splice(i,1);return true;});};
export function groups(args){
 const out=[];
 for(const d of args.declarations||[]){const a=args.units.find(u=>u.id===d.actorId),m=F.weaponMode(d.weapon,d.modeId);if(!a||!m)continue;
 const active={...a,...d.origin,reservedWeapon:d.weapon,reservedShots:d.reservedShots,ccSupport:d.ccSupport??a.ccSupport??0},target=args.units.find(v=>v.id===d.targetId),sp=target?F.attackSpec(active,target,m,args.terrain,{moving:E.pathLength(d.path||[])>0,coordinated:!!args.coordinated&&m.kind!=='cc',spearhead:a.id===args.active.id,ignoreSaturation:!m.template}):null;
 const b=d.burst??sp?.m.b??1,shots=d.shots?.length?d.shots:m.template?Array.from({length:b},()=>({targetId:d.targetId,aim:d.aim})):[{targetId:d.targetId,burst:b}];
 for(const [i,shot] of shots.entries()){const t=args.units.find(u=>u.id===shot.targetId),sh=m.template?F.makeTemplate(active,shot.aim||t,m,args.templates):null;
 out.push({id:'volley:'+a.id+':'+i,actorId:a.id,targetId:shot.targetId,weapon:d.weapon,modeId:d.modeId,m,active,origin:d.origin||a,path:d.path||[a],shape:sh,burst:shot.burst??(m.template?1:b),sd:shot.sd??(i===(d.sdShot||0)?F.specialDice(a,m):0),idle:!!d.idle||!t,startedMarker:!!d.startedMarker,targetless:d.targetless});}
 }
 if(!out.length)out.push({id:'volley:idle',actorId:args.active.id,active:args.active,origin:args.attackPoint,path:args.path,weapon:args.weapon,modeId:args.modeId,m:F.weaponMode(args.weapon,args.modeId),idle:true,burst:0,sd:0});
 return out;
}
function subArgs(args,g){const reactions={};for(const [id,r] of Object.entries(args.reactions)){if(r.action==='attack'&&(r.targetId||args.active.id)!==g.actorId){const source=args.units.find(u=>u.id===id),m=F.weaponMode(r.weapon,r.modeId),point=r.shape&&E.samplePath(g.path||[g.active],.08).find(p=>F.affectedBy(r.shape,{...g.active,...p},source,m,args.terrain));if(!point)continue;reactions[id]={...r,targetId:g.actorId,point,templateSecondary:true,templatePrimaryPoint:{...(args.units.find(u=>u.id===(r.targetId||args.active.id))||args.active),...r.point}};}else reactions[id]={...r,targetId:g.actorId};}
 return {...args,allocations:null,mainTarget:g.targetId,active:{...g.active,reservedShots:g.burst},attackPoint:{...g.active,reservedShots:g.burst},activeSD:g.sd,weapon:g.weapon,modeId:g.modeId,shape:g.shape,path:g.path,reactions,idle:g.idle,targetless:g.targetless||null,startedMarker:g.startedMarker};
}
export function prepare(args,rng=Math.random){const gs=groups(args),activeTargets={},reactions={},meta={};
 for(const g of gs){const a=subArgs(args,g),p=F.preparePools(a,()=>0),ap=p.active;ap.id=g.id;ap.name=g.active.name+' → '+(g.targetless?Z.WEAPONS[g.targetless.weapon].name:args.units.find(u=>u.id===g.targetId)?.name||'待机');ap.label=g.idle&&!g.targetless?'待机 · 不生成攻击骰':(g.targetless?'协调投掷':g.m.template?'独立模板':args.coordinated?'协调攻击':'联动攻击')+' · B'+g.burst;ap.reason=g.targetless?ap.reason:F.templateFailure(g.shape,g.active,args.units.find(u=>u.id===g.targetId),g.m,args.terrain,[...args.units,...(args.neutralUnits||[])])||(!g.idle?F.attackSpec(g.active,args.units.find(u=>u.id===g.targetId),g.m,args.terrain,{moving:E.pathLength(g.path)>0}).reason:'待机');ap.dice=Array.from({length:ap.dice.length},()=>1+Math.floor(rng()*20));activeTargets[g.id]=ap;meta[g.id]={activeSV:ap.sv,reactions:p.reactions};for(const [id,rp] of Object.entries(p.reactions))if(!reactions[id])reactions[id]={...rp,dice:[]};}
 // Generate each reactive pool once, even if it opposes several shots/participants.
 for(const [id,r] of Object.entries(args.reactions)){if(reactions[id]?.dice.length)continue;let rp=Object.values(meta).map(x=>x.reactions[id]).find(Boolean);if(!rp){const who=args.units.find(u=>u.id===(r.targetId||args.active.id))||args.active;rp=F.preparePools({...args,allocations:null,active:who,attackPoint:who,mainTarget:null,idle:true,activeSkill:'idle',reactions:{[id]:r}},()=>0).reactions[id];}if(rp)reactions[id]={...rp,dice:Array.from({length:rp.dice.length},()=>1+Math.floor(rng()*20))};}
 return {active:{...args.active,dice:[],sv:0,sd:0},activeTargets,reactions,volleyMeta:meta};
}
export function resolve(args,rng=Math.random){const pools=args.pools||prepare(args,rng),gs=groups(args),extraPlans=[],duels=[],rHits={},zones=new Map(),notices=[],dodge=new Map(),reset=new Map();
 for(const [id,r] of Object.entries(args.reactions)){const p=pools.reactions[id];if(r.action==='dodge')dodge.set(id,F.kept(p).some(n=>n<=p.sv));if(r.action==='reset')reset.set(id,F.kept(p).some(n=>n<=p.sv));}
 for(const g of gs){const sa=subArgs(args,g),meta=pools.volleyMeta[g.id],rp={};for(const [id,p] of Object.entries(meta.reactions))rp[id]={...p,dice:pools.reactions[id]?.dice||[],discard:pools.reactions[id]?.discard};
 if(pools.activeTargets[g.id].reason)notices.push(g.active.name+' → '+(args.units.find(u=>u.id===g.targetId)?.name||'无目标')+'：'+pools.activeTargets[g.id].reason);const r=F.resolveOrder({...sa,pools:{active:pools.activeTargets[g.id],reactions:rp},deferSaves:true},rng);
 for(const z of r.zoneResults||[]){const previous=zones.get(z.actorId);zones.set(z.actorId,{...z,success:z.success&&(previous?.success??true)});}for(const d of r.details){const target=args.units.find(u=>u.id===d.id);let incoming=d.incoming;
 // An impact critical affects only its primary target. Secondary targets get ordinary hits.
 if(g.m.template&&d.id!==g.targetId&&incoming.hits)incoming=F.attackSavePlan(target,d.ah,0,K.attackMode(g.active,g.m),false);
 if(incoming.targetId){incoming.attacker={...g.active};incoming.volleyId=g.id;if(incoming.hits||incoming.execution)extraPlans.push(incoming);}
 if(dodge.has(d.id)&&d.hit)dodge.set(d.id,dodge.get(d.id)&&d.dodged);
 if(reset.has(d.id)&&d.hit&&g.m.kind==='hack')reset.set(d.id,reset.get(d.id)&&d.resetSuccess);
 if(d.action==='attack'&&d.outgoing.targetId){const key=d.id+':'+g.actorId;rHits[key]=rHits[key]===undefined?d.bh:intersection(rHits[key],d.bh);}
 duels.push({...d,targetless:!!g.targetless,actorId:g.actorId,actorName:g.active.name,poolId:g.id,incoming,outgoing:{damage:0,saves:[],effects:[]}});
 }
 }
 // Resolve each ARO's damage once; its dice were compared with every attack against its chosen target.
 for(const [id,r] of Object.entries(args.reactions)){if(r.action!=='attack')continue;const actor=args.units.find(u=>u.id===id),target=args.units.find(u=>u.id===(r.targetId||args.active.id));if(!actor||!target)continue;const m=F.weaponMode(r.weapon,r.modeId),origin={...target,...r.point},sp=F.attackSpec({...actor,reservedShots:r.reservedShots},origin,m,args.terrain,{reactive:true,respondingAttack:gs.some(g=>g.targetId===id)});if(!sp.can||F.templateFailure(r.shape,actor,origin,m,args.terrain,[...args.units,...(args.neutralUnits||[])]))continue;
 const pool=pools.reactions[id],sv=pool?.sv??sp.sv,raw=F.kept(pool),base=m.kind==='direct'?Array.from({length:sp.m.b},()=>-1):raw.filter(n=>n<=sv);
 const victims=m.template?args.units.filter(u=>u.id!==id&&S.onTable(u)&&E.samplePath(gs.find(g=>g.actorId===u.id)?.path||[u.id===target.id?{...u,...r.point}:u],.08).some(point=>F.affectedBy(r.shape,{...u,...point},actor,m,args.terrain))):[target];
 for(const v of victims){let hits=rHits[id+':'+v.id]??base;
 if(m.kind==='direct')hits=base;
 const p=F.attackSavePlan(v,hits,m.template&&v.id!==target.id?0:sv,sp.m,m.kind==='bs'&&v.id===target.id?sp.cov:false);p.attacker={...actor};p.volleyId='aro:'+id;if(p.hits)extraPlans.push(p);}
 }
 const result=V.aggregate({details:[],batchDuels:duels,extraPlans,dodgers:[...dodge].filter(([,ok])=>ok).map(([id])=>id),linkedResetIds:[...reset].filter(([,ok])=>ok).map(([id])=>id),activeSkill:args.activeSkill,zoneResults:[...zones.values()],volleyNotices:notices,valid:true});
 if(!args.deferSaves)for(const p of extraPlans)V.finishSaves(p,()=>1+Math.floor(rng()*20));return V.aggregate(result);
}
