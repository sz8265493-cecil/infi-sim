import * as E from './engine.js?v=122';
import * as S from './states.js?v=122';
import {passed} from './support-actions.js?v=122';
export const SOURCES=['https://infinitythewiki.com/Combat_Jump','https://infinitythewiki.com/Parachutist','https://infinitythewiki.com/Super-Jump'];
export const LABELS={combatJump:'战斗空降',parachutist:'伞降'};
export const ownOrder=u=>!!u.offTable&&u.airborneOrderAvailable!==false&&S.active(u)&&(u.combatJump||u.parachutist);
export function availableActions(u,{reactive=false}={}){return !reactive&&ownOrder(u)?Object.keys(LABELS).filter(k=>u[k]):[];}
const side=u=>u.deploymentSide||(u.team===0?'south':'north');
const edge=(u,p)=>Math.min(p.x-E.radius(u),p.y-E.radius(u),48-p.x-E.radius(u),48-p.y-E.radius(u))<=.025;
const ownDZ=(u,p)=>side(u)==='south'?p.y-E.radius(u)>=36-.001:p.y+E.radius(u)<=12+.001;
const enemyDZ=(u,p)=>side(u)==='south'?p.y-E.radius(u)<12-.001:p.y+E.radius(u)>36+.001;
export function validateLanding(u,p,action,{units=[],terrain=[],objectives=[],failed=false,reactive=false}={}){
 let reason=!availableActions(u,{reactive}).includes(action)?'只有桌外且尚有自身命令的对应单位可在主动轮入场':!p||![p.x,p.y,p.z??0].every(Number.isFinite)?'请选择有效落点':p.prone?'空降入场不能俯卧':'';
 if(reason)return {can:false,reason};
 const landed={...u,...p,offTable:false,prone:false},tableUnits=units.filter(v=>!v.offTable&&!v.deploymentPending&&S.onTable(v));
 reason=E.validPosition(landed,p,tableUnits,terrain);
 if(!reason&&tableUnits.some(v=>v.id!==u.id&&v.team!==u.team&&E.edgeDistance(landed,v)<=.025))reason='不能接触敌方或中立模型、标记';
 if(!reason&&objectives.some(v=>E.dist(p,v)<=E.radius(u)+(v.r??v.radius??.5)+.025))reason='不能接触任务目标';
 if(!reason&&(failed||action==='parachutist')&&!edge(u,p))reason='底盘必须接触桌边';
 if(!reason&&failed&&!ownDZ(u,p))reason='失败后必须放在己方部署区桌边';
 if(!reason&&!failed&&action==='parachutist'&&!u.parachutistDZ&&enemyDZ(u,p))reason='普通伞降不能进入敌方部署区';
 if(!reason&&!failed&&action==='combatJump'){
  if(terrain.some(t=>(t.enclosed||t.objectiveRoom)&&E.inside(p,t)))reason='不能空降到封闭建筑内部';
  if(E.visibilityZones(terrain).some(z=>z.visibility!==false&&(z.w!==undefined?E.pointRect(p,z)<=E.radius(u):E.dist(p,z)<=E.radius(u)+(z.r||0))))reason='不能空降到可见度限制区内或与其接触';
 }
 return {can:!reason,reason};
}
export function explosion(u,units,terrain=[],templates){
 const shape={kind:'circle',origin:{x:u.x,y:u.y,z:u.z||0},r:(templates?.circle?.diameter??4.6833)/2};
 if(!u.combatJumpExplosion||u.combatJumpExplosionUsed)return null;
 const touched=units.filter(v=>v.id!==u.id&&!v.offTable&&S.onTable(v)&&E.templateHits(shape,v,terrain));
 const cancelledFriendly=touched.some(v=>v.team===u.team||v.team===-1);
 return {shape,ps:8,ammo:'N',saveAttribute:'ARM',saves:1,direct:true,cancelledFriendly,hits:cancelledFriendly?[]:touched.map(v=>v.id),touched:touched.map(v=>v.id)};
}
// Failure location is an explicit player decision. A missing fallback never auto-deploys.
// Parent commits the returned unit, then asks for AROs before resolving explosion saves.
export function resolve(u,landing,action,{die,controlledJumpMod=0,fallback,units=[],terrain=[],objectives=[],templates,...options}={}){
 const check=validateLanding(u,landing,action,{units,terrain,objectives,...options});
 if(!check.can)return {...check,applied:false};
 const sv=(u.combatJumpPH??u.ph)+controlledJumpMod;
 if(action==='combatJump'&&(!Number.isInteger(die)||die<1||die>20))return {...check,applied:false,needsRoll:true,sv};
 const success=action==='parachutist'||passed(die,sv),final=success?landing:fallback;
 if(!success&&!fallback)return {can:true,applied:false,success,sv,die,fallbackPending:true};
 if(!success){const bad=validateLanding(u,fallback,action,{units,terrain,objectives,failed:true});if(!bad.can)return {...bad,applied:false,success,sv,die,fallbackPending:true};}
 const next={...u,...final,prone:false,wall:null,offTable:false,airborneOrderAvailable:false,noCover:true,states:[...(u.states||[])]};
 if(!success)next.states=next.states.filter(s=>!['camouflaged','holoecho','impersonation1','impersonation2'].includes(s));
 const blast=action==='combatJump'?explosion(next,units,terrain,templates):null;
 if(blast)next.combatJumpExplosionUsed=true;
 return {can:true,applied:true,unit:next,success,sv,die,explosion:blast,removeAccompanyingDeployables:!success,loseDecoys:!success,declareARO:true,longSkill:true,clearNoCoverAfterOrder:true};
}
