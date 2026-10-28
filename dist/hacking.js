// N5.3 / FAQ 0.1 (September 2026). Declaration never measures a target.
// Source: https://infinitythewiki.com/Hacking_Device and each program's page.
import * as S from './states.js?v=122';
import {front,visibility,radius,height,resolveDice} from './engine.js?v=122';
import {planSaves,rollRound} from './saves.js?v=122';
const program=(id,name,ps,b,ammo,effect,target,mod=0)=>({id,name,ps,b,ammo,effect,target,mod,skill:'short',aro:true,supported:true});
export const PROGRAMS={
 spotlight:program('spotlight','聚光 Spotlight',5,2,'AP','targeted','model'),
 carbonite:program('carbonite','碳化 Carbonite',7,2,'DA','immB','hackable'),
 oblivion:program('oblivion','遗忘 Oblivion',4,2,'AP','isolated','hackable'),
 trinity:program('trinity','三位一体 Trinity',6,3,'N',null,'hacker',3),
 totalControl:program('totalControl','全面控制 Total Control',4,1,'DA','possessed','tag'),
 whiteNoise:{id:'whiteNoise',name:'白噪声 White Noise',supported:false,reason:'使用白噪声独立流程'},
 ...Object.fromEntries([['cybermask','网络伪装 Cybermask'],['assistedFire','辅助射击 Assisted Fire'],['enhancedReaction','强化反应 Enhanced Reaction'],['fairyDust','仙尘 Fairy Dust'],['controlledJump','跳跃控制 Controlled Jump'],['zeroPain','零痛 Zero Pain']].map(([id,name])=>[id,{id,name,supported:true,utility:true,skill:['controlledJump','zeroPain'].includes(id)?'short':'long',aro:['controlledJump','zeroPain'].includes(id),noRoll:id!=='zeroPain',supportware:['assistedFire','enhancedReaction','fairyDust','controlledJump'].includes(id)}]))
};
export const DEVICES={HD:['carbonite','spotlight','totalControl','oblivion'],HDPlus:['carbonite','spotlight','totalControl','oblivion','whiteNoise','cybermask'],KHD:['trinity','cybermask'],EVO:['assistedFire','enhancedReaction','fairyDust','controlledJump']};
const aliases={'Hacking Device':'HD','Hacking Device Plus':'HDPlus','Killer Hacking Device':'KHD','EVO Hacking Device':'EVO'};
const has=(u,s)=>(u.states||[]).includes(s);
export const isHacker=u=>!!u.hackingDevice||u.hacker===true;
const disabled=u=>!u||!S.active(u)||!S.onTable(u)||u.offTable||u.deployed===false||has(u,'isolated');
export function programFor(u,id){const p=PROGRAMS[id];if(!p)return null;const x=u.hackingProgramMods?.[id]||{};return {...p,...Object.fromEntries(['ps','ammo','mod','opponentMod','srMod'].filter(k=>x[k]!==undefined).map(k=>[k,x[k]])),b:Math.min(6,(p.b||0)+(x.burstBonus||0))};}
export function availablePrograms(u,{includeUnsupported=false}={}){
 if(!u.hackingDevice||disabled(u))return [];
 return [...new Set([...(DEVICES[aliases[u.hackingDevice]||u.hackingDevice]||[]),...(u.hackingUpgrades||[])])].map(id=>programFor(u,id)).filter(p=>p&&(includeUnsupported||p.supported));
}
// This function intentionally does not read coordinates, LoF, terrain or range.
export function declaration(u,target,id,{reactive=false}={}){
 const p=programFor(u,id);let reason='';
 if(!p||!availablePrograms(u,{includeUnsupported:true}).some(v=>v.id===id))reason='单位没有此黑客设备或程序';
 else if(!p.supported)reason=p.reason;
 else if(p.utility)reason='此程序使用独立辅助或防御流程';
 else if(reactive&&!p.aro)reason='此程序不能作为 ARO';
 else if(['immA','immB','stunned'].some(s=>has(u,s)))reason='当前状态不能宣告黑客攻击';
 else if(!target||target.team===-1||has(target,'dead')||has(target,'hiddenDeployment'))reason='不是合法模型目标';
 else if(['camouflaged','impersonation','impersonation1','impersonation2','holoecho'].some(s=>has(target,s))||target.marker)reason='黑客程序不能指定标记状态';
 else if(target.team===u.team&&!(id==='totalControl'&&has(target,'possessed')))reason='必须指定敌方目标';
 else if(target.nonHackable&&['hackable','tag'].includes(p.target)&&!isHacker(target))reason='目标具有不可黑客技能';
 else if(p.target==='hacker'&&!isHacker(target))reason='仅能指定敌方黑客';
 else if(p.target==='hackable'&&!target.hackable&&!isHacker(target)&&!['HI','REM','TAG','VH'].includes(target.type))reason='目标不具备可黑客特性';
 else if(p.target==='tag'&&target.type!=='TAG')reason='仅能指定 TAG';
 return {can:!reason,reason,program:p,burst:reactive?1:p?.b||0};
}
// Caller chooses the route BEFORE exposing measurements. Do not auto-pick a
// best firewall route. Repeater nodes need a silhouette (s) and live status.
export function inZone(a,b){return Math.hypot(a.x-b.x,a.y-b.y)-radius(a)-radius(b)<=8&&(b.z||0)<=((a.z||0)+height(a)+8)&&(b.z||0)+height(b)>=(a.z||0)-8;}
export function hackingArea(u,target,{repeaters=[],route={kind:'direct'}}={}){
 if(route.kind==='autoFriendly'){if(inZone(u,target))return {inArea:true,firewall:0};const r=repeaters.find(r=>r.team===u.team&&!disabled(r)&&r.repeater&&inZone(r,target));return {inArea:!!r,firewall:0,repeaterId:r?.id};}
 if(route.kind==='direct')return {inArea:inZone(u,target),firewall:0};
 const r=repeaters.find(n=>n.id===route.id&&!disabled(n)&&n.repeater!==false);
 if(!r)return {inArea:false,firewall:0,reason:'中继器不可用'};
 if(route.kind==='friendly'&&r.team===u.team)return {inArea:inZone(r,target),firewall:0};
 if(route.kind==='enemy'&&r.team!==u.team&&r.team>=0)return {inArea:inZone(u,r)&&isHacker(target)&&target.team===r.team,firewall:-3};
 return {inArea:false,firewall:0,reason:'中继路径无效'};
}
export function attackSpec(u,target,id,options={}){
 const d=declaration(u,target,id,options);if(!d.can)return {...d,sv:0};
 const area=hackingArea(u,target,options);
 // explicit firewall choice supplied by caller; no stacking. Device firewall
 // is unavailable when Isolated/Null; independent equipment can be supplied.
 const deviceFW=!disabled(target)?Number(target.hackingFirewall||0):0;
 const choices=firewalls(target,area.firewall),preferred=target.firewallChoices?.[u.id];const firewall=options.firewall??(choices.includes(preferred)?preferred:Math.min(...choices));
 const mods=d.program.mod+(has(target,'targeted')?3:0)+Math.min(0,firewall)+(options.wipMod||0);
 return {...d,can:area.inArea,reason:area.inArea?'':'目标不在所宣告路径的黑客范围内，转为待机',sv:Math.max(0,u.wip+Math.max(-12,Math.min(12,mods))),firewall,area};
}
// Roll pools are supplied by the shared dice/animation pipeline. Reset or an
// attack that directly affects this hacker is opposed; otherwise independent.
export function resolveAttack({user,target,program,dice,opposingDice=[],opposingSV=0,opposed=false,...options}){
 const spec=attackSpec(user,target,program,options);
 if(!spec.can)return {spec,hits:[],opposingHits:[],plan:null};
 if(dice.length>spec.burst||[...dice,...opposingDice].some(d=>!Number.isInteger(d)||d<1||d>20))throw Error('黑客骰池无效');
 const result=opposed?resolveDice(dice,spec.sv,opposingDice,opposingSV):{a:dice.filter(d=>d<=spec.sv),b:opposingDice.filter(d=>d<=opposingSV)};
 const p=spec.program,mode={kind:'hack',ps:p.ps,ammo:p.ammo,saveAttribute:'BTS',nonlethal:!!p.effect,srMod:(p.srMod||0)+(spec.firewall<0?3:0)};
 const plan=planSaves(target,result.a,spec.sv,mode,false);
 plan.hacking={program:p.id,effect:p.effect,cancelPossession:p.id==='totalControl'&&has(target,'possessed')};
 return {spec,hits:result.a,opposingHits:result.b,plan:plan.initialCount?plan:null};
}
// Separate save stage: no saving dice are consumed during resolveAttack.
// Returned effects are applied simultaneously by caller, never mutate target.
export function rollHackingSaves(plan,roll){
 rollRound(plan,roll);
 const info=plan.hacking;
 if(info?.effect&&plan.saves.some(s=>s.fail)&&!(plan.target.stateImmunities||[]).includes(info.effect)){
  if(info.cancelPossession)plan.removeEffects=['possessed'];
  else plan.effects=[...new Set([...plan.effects,info.effect])];
 }
 return plan;
}
export const LIMITATIONS=['Supportware、Cybermask 和 Zero Pain 通过独立 API 结算；调用方须连接宣告与动画流程','未自动枚举或测量中继网络；调用方须锁定中继路径','分配 Burst 时调用方须校验总骰数；此模块只结算单个目标','Possessed 的控制权、属性与取消时机由调用方处理','ARO 资格、Stealth 和同时结算由命令引擎处理'];
// Adapter for the existing combat/save pipeline. Saving effects are still
// committed only after a failed save; Total Control cancellation needs removal.
export function asWeaponMode(id){
 const p=typeof id==='string'?PROGRAMS[id]:id;if(!p?.supported||p.utility)return null;
 return {id:p.id,name:p.name,kind:'hack',attribute:'wip',b:p.b,ps:p.ps,saveAttribute:'BTS',ammo:p.ammo,nonlethal:!!p.effect,effects:p.effect?[p.effect]:[],hackingProgram:p.id,srMod:p.srMod||0,opponentMod:p.opponentMod||0};
}
export function spec(actor,target,programId,{declaration:declaring=false,...options}={}){
 const result=declaring?declaration(actor,target,programId,options):attackSpec(actor,target,programId,options);
 const m=asWeaponMode(result.program||programFor(actor,programId));
 if(m&&programId==='totalControl'&&has(target,'possessed')){m.effects=[];m.removeEffects=['possessed'];}
 if(m){m.b=result.burst;m.srMod=(m.srMod||0)+(result.firewall<0?3:0);}
 return {...result,m,base:actor.wip,mods:declaring?[]:[['程序',programFor(actor,programId)?.mod||0],['被标记',has(target,'targeted')?3:0],['防火墙',Math.min(0,result.firewall||0)],['其他 WIP 修正',options.wipMod||0]],cov:false};
}

// Utility programs have their own declarations, never damage weapon modes.
export function supportActions(actor,{reactive=false,aroEligible=false,trigger=''}={}){
 if(disabled(actor)||['immA','immB','stunned'].some(k=>has(actor,k)))return [];
 return availablePrograms(actor).filter(p=>p.utility&&(!reactive||p.aro&&(aroEligible||p.id==='controlledJump'&&trigger==='combatJump')));
}
export function supportSpec(actor,id,{target=null,units=[],terrain=[],reactive=false,aroEligible=false,trigger='',troopType='',repeaters=[],route={kind:'autoFriendly'},measure=true}={}){
 const p=programFor(actor,id);let reason='';
 if(!supportActions(actor,{reactive,aroEligible,trigger}).some(p=>p.id===id))reason='没有该程序，或当前状态／主动反应阶段不允许使用';
 else if(id==='cybermask'&&measure&&units.some(v=>v.team!==actor.team&&v.team>=0&&S.onTable(v)&&!v.offTable&&(S.active(v)||has(v,'camouflaged')||has(v,'impersonation1')||has(v,'impersonation2'))&&front(v,actor)&&visibility(v,actor,terrain).visible))reason='网络伪装必须位于敌方模型及标记视线之外';
 else if(['assistedFire','enhancedReaction'].includes(id)){
  if(!target||target.team!==actor.team||target.type!=='REM'||!S.onTable(target)||target.offTable||['camouflaged','impersonation','impersonation1','impersonation2','holoecho'].some(k=>has(target,k)))reason='目标必须是同军表的 REM 模型';
  else if(measure&&!hackingArea(actor,target,{repeaters,route}).inArea)reason='目标不在黑客范围内';
 }else if(id==='fairyDust'&&!['HI','REM','TAG','VH'].includes(troopType))reason='选择 HI、REM、TAG 或 VH 类型';
 return {can:!reason,reason,program:p,id,actorId:actor.id,targetId:target?.id,troopType,noRoll:p?.noRoll,skill:p?.skill,immediate:id==='controlledJump',burst:id==='zeroPain'?2:0,sv:Math.max(0,(actor.wip||0)+S.rollMod(actor)),opponentMod:id==='zeroPain'?-3:0};
}
const recipients=(record,units)=>record.id==='fairyDust'?units.filter(u=>u.team===record.team&&u.type===record.troopType).map(u=>u.id):['assistedFire','enhancedReaction'].includes(record.id)?[record.targetId]:[];
export function liveSupportware(units){return units.filter(u=>!disabled(u)&&u.supportware).map(u=>({...u.supportware,actorId:u.id,team:u.team}));}
export function supportEffects(unit,units){
 const record=liveSupportware(units).find(r=>recipients(r,units).includes(unit.id));
 return !record?{}:record.id==='assistedFire'?{marksmanship:true}:record.id==='enhancedReaction'?{aroBurst:2}:record.id==='fairyDust'?{firewall:Math.min(-3,unit.firewall||0)}:{};
}
// Projection is reversible: intrinsic profile fields survive replacement/expiry.
export function syncSupportware(units){
 const next=structuredClone(units);
 for(const u of next){if(u.supportwareBase){for(const [key,v] of Object.entries(u.supportwareBase))if(v.present)u[key]=v.value;else delete u[key];delete u.supportwareBase;}if(disabled(u))delete u.supportware;}
 for(const u of next){const effects=supportEffects(u,next);if(Object.keys(effects).length){u.supportwareBase={};for(const [key,value] of Object.entries(effects)){u.supportwareBase[key]={present:Object.hasOwn(u,key),value:u[key]};u[key]=value;}}}
 return next;
}
export function cancelSupportware(units,actorId){const next=structuredClone(units);const actor=next.find(u=>u.id===actorId);if(actor)delete actor.supportware;return syncSupportware(next);}
export function declareProgram(units,actorId,id,{targetId,troopType}={}){let next=cancelSupportware(units,actorId);const actor=next.find(u=>u.id===actorId);if(PROGRAMS[id]?.supportware&&actor){const targets=recipients({id,targetId,troopType,team:actor.team},next);for(const u of next)if(u.supportware&&recipients({...u.supportware,team:u.team},next).some(n=>targets.includes(n)))delete u.supportware;}return syncSupportware(next);}
export function resolveSupport(units,actorId,id,options={}){
 const actor=units.find(u=>u.id===actorId);if(!actor)return {can:false,reason:'黑客不在军表中',units};
 const target=options.target||units.find(u=>u.id===options.targetId),spec=supportSpec(actor,id,{...options,target,units});
 if(!spec.can)return {...spec,units};
 if(id==='zeroPain')return {...spec,units:cancelSupportware(units,actorId),requiresRoll:true};
 let next=cancelSupportware(units,actorId),caster=next.find(u=>u.id===actorId);
 if(id==='cybermask'){caster.states=[...new Set([...(caster.states||[]).filter(k=>k!=='camouflaged'),'impersonation2'])];caster.cybermask=true;caster.nfbCybermask=true;return {...spec,units:next};}
 const record={id,targetId:target?.id,troopType:spec.troopType,team:actor.team},newTargets=recipients(record,next);
 for(const u of next)if(u.supportware&&(recipients({...u.supportware,team:u.team},next).some(id=>newTargets.includes(id))||id==='controlledJump'&&u.team===actor.team&&u.supportware.id==='controlledJump'))delete u.supportware;
 caster.supportware=record;return {...spec,units:syncSupportware(next)};
}
export function controlledJumpMod(unit,units){const teams=new Set(liveSupportware(units).filter(r=>r.id==='controlledJump').map(r=>r.team));if(!teams.size||teams.size>1)return 0;return teams.has(unit.team)?3:-3;}
// The same two defensive dice oppose every incoming Comms Attack independently.
export function resolveZeroPain(actor,dice,attacks=[],options={}){
 const spec=supportSpec(actor,'zeroPain',options);if(!spec.can)return {...spec,results:[]};
 if(dice.length!==2||dice.some(d=>!Number.isInteger(d)||d<1||d>20))throw Error('零痛需要两个 D20');
 return {...spec,dice,results:attacks.map(a=>{
  if(!a.comms)return {...a,opposed:false,avoided:false,hits:a.dice.filter(d=>d<=a.sv)};
  const sv=a.base===undefined?Math.max(0,a.sv-3):Math.max(0,a.base+Math.max(-12,Math.min(12,(a.mod||0)-3))),r=resolveDice(dice,spec.sv,a.dice,sv);
  return {...a,sv,opposed:true,avoided:r.a.length>0,hits:r.b,defensiveHits:r.a};
 })};
}

export function routes(u,repeaters=[]){return [{value:'autoFriendly',label:'自身／友方网络',route:{kind:'autoFriendly'}},{value:'direct',label:'仅自身控制区',route:{kind:'direct'}},...repeaters.filter(r=>!disabled(r)&&r.repeater!==false).map(r=>({value:(r.team===u.team?'friendly':'enemy')+':'+r.id,label:(r.team===u.team?'友方中继器 · ':'敌方中继器 · ')+(r.name||r.id),route:{kind:r.team===u.team?'friendly':'enemy',id:r.id}}))];}
export function anyArea(u,target,repeaters=[]){return routes(u,repeaters).some(x=>hackingArea(u,target,{repeaters,route:x.route}).inArea);}
export function firewalls(target,routeFirewall=0){const values=[routeFirewall,disabled(target)?0:Number(target.hackingFirewall||0),Number(target.firewall||0)].filter(v=>v<0);return [...new Set(values.length?values:[0])];}
export function effectiveFirewall(actor,target,routeFirewall=0){const choices=firewalls(target,routeFirewall),p=target.firewallChoices?.[actor.id];return choices.includes(p)?p:Math.min(...choices);}
