// Infinity N5.3 Common Skills: Cautious Movement, Look Out!, Alert!.
// Geometry is checked after movement declaration; declaration menus never expose range.
import * as E from './engine.js?v=117';
import * as S from './states.js?v=109';
import * as K from './skills.js?v=117';
import * as H from './hacking.js?v=82';
export const SOURCES=['https://infinitythewiki.com/Cautious_Movement','https://infinitythewiki.com/Look_Out','https://infinitythewiki.com/Alert'];
const living=u=>u&&S.active(u)&&S.onTable(u)&&!S.has(u,'disconnected');
const trooper=u=>living(u)&&!u.isDeployable&&!u.isDecoy;
const engaged=(u,units=[],terrain=[])=>S.has(u,'engaged')||units.some(v=>v.id!==u.id&&S.onTable(v)&&E.engagedContact(u,v,terrain));
const canTurn=(u,units=[])=>trooper(u)&&S.allowed(u,'alert')&&!engaged(u,units)&&(!u.wall||u.climbingPlus);
const sees=(a,b,terrain)=>E.front(a,b)&&E.visibility(a,b,terrain).visible;
export function cautiousDeclaration(u,{reactive=false,impetuous=false,units=[],terrain=[]}={}){
 const reason=reactive?'谨慎移动是主动轮长技能，不能作为 ARO':!trooper(u)||!S.allowed(u,'move')?'当前单位或状态不能谨慎移动':['TAG','REM','VH'].includes(u.type)?'TAG、遥控机与载具不能谨慎移动':u.motorcycle?'摩托车不能谨慎移动':u.aerial?'空中单位不能谨慎移动':S.has(u,'targeted')?'被标记状态不能谨慎移动':engaged(u,units,terrain)?'近战接触中不能谨慎移动':u.wall&&!u.climbingPlus?'悬挂墙面时只能继续普通攀爬':impetuous?'鲁莽激活不能选择谨慎移动':'';
 return {can:!reason,reason};
}
export function cautiousSafety(u,path,units,terrain){
 const blockers=[];const enemies=units.filter(v=>v.team>=0&&v.team!==u.team&&living(v));
 const repeaters=units.filter(v=>v.repeater&&living(v)&&!S.has(v,'isolated'));
 for(const point of [path[0],path.at(-1)]){
  const a={...u,...point},model=!K.marker(a),hackable=model&&!a.nonHackable&&(a.hackable||H.isHacker(a)||['HI','TAG','REM','VH'].includes(a.type));
  for(const v of enemies){
   const silent=a.stealth&&!S.has(a,'targeted')&&!K.sixth(v)&&!v.combatInstinct;
   let why=sees(v,a,terrain)?'起点或终点在敌方视线内':!silent&&H.inZone(v,a)?'起点或终点在敌方控制区内':'';
   if(!why&&!silent&&hackable&&H.isHacker(v)&&!S.has(v,'isolated')&&H.hackingArea(v,a,{repeaters,route:{kind:'autoFriendly'}}).inArea)why='起点或终点在敌方黑客范围内';
   if(why&&!blockers.some(b=>b.id===v.id&&b.reason===why))blockers.push({id:v.id,name:v.name,reason:why});
  }
 }
 return {safe:!blockers.length,blockers};
}
export function lookOutDeclaration(u,active,path,terrain,{reactive=true,units=[]}={}){
 const reason=!reactive?'Look Out 只能作为 ARO':!trooper(u)||!S.allowed(u,'lookOut')||u.noARO?'当前状态不能宣告 Look Out':engaged(u,units,terrain)?'近战接触中不能宣告 Look Out':u.wall&&!u.climbingPlus?'普通攀爬悬挂时不能宣告 Look Out':!path.some(p=>sees(u,{...active,...p},terrain))?'宣告时需要看见执行命令的敌方模型或标记':'';
 return {can:!reason,reason};
}
export function lookOutRecipients(u,units,reactions){return units.filter(v=>v.id!==u.id&&v.team===u.team&&trooper(v)&&(!v.wall||v.climbingPlus)&&S.allowed(v,'dodge')&&!v.noARO&&!reactions[v.id]?.action);}
export function declareLookOut(u,ids,{active,path,units,terrain,reactions,wave}){
 const c=lookOutDeclaration(u,active,path,terrain,{units});if(!c.can)return c;
 const available=lookOutRecipients(u,units,reactions);if(new Set(ids).size!==ids.length||ids.some(id=>!available.some(v=>v.id===id)))return {can:false,reason:'受警告者必须为尚未宣告其他 ARO 的在场可行动友军'};
 for(const id of ids){const v=units.find(n=>n.id===id);reactions[id]={...(reactions[id]||{}),id,wave,action:'dodge',lookOut:true,lookOutSource:u.id,lof:path.some(p=>sees(v,{...active,...p},terrain)),point:null};}
 reactions[u.id].action='lookOut';return {can:true,ids};
}
// Store attacked silhouettes before simultaneous damage/removal. An attack that misses still counts.
export function alertCandidates(units,{activatedIds=[],attacks=[]}={}){
 const activated=new Set(activatedIds);
 return units.filter(v=>canTurn(v,units)&&!activated.has(v.id)&&attacks.some(t=>t.team===v.team&&(t.id===v.id||H.inZone(v,t))));
}
