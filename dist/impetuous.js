import * as E from './engine.js?v=36';
import * as S from './states.js?v=36';
export const SOURCES=['https://infinitythewiki.com/Impetuous','https://infinitythewiki.com/Frenzy','https://infinitythewiki.com/Counterintelligence'];
export const allowedSecond=['move','shoot','attack','cc','dodge','idle'];
export const allowedFirst=['move','jump','climb','superjump','superlong','climbplus','berserk','combatJump','parachutist'];
const side=u=>u.deploymentSide||(u.team===0?'south':'north');
const distanceDZ=(u,p)=>side(u)==='south'?Math.max(0,p.y+E.radius(u)-12):Math.max(0,36-p.y+E.radius(u));
const enemy=(u,v)=>v.team>=0&&v.team!==u.team&&!v.offTable&&S.onTable(v)&&!v.isDeployable;
export const eligible=(u,state)=>!!u.impetuous&&S.active(u)&&!u.isDeployable&&!S.has(u,'disconnected')&&(!state||u.team===state.team)&&(!u.offTable||u.combatJump||u.parachutist);
export function beginTurn(state){
 const retreat=!!(Array.isArray(state.retreat)?state.retreat[state.team]:state.retreat);
 for(const u of state.units)if(u.team===state.team)u.impetuousAvailable=!retreat&&eligible(u,state);
 state.impetuousPhase=!retreat&&state.units.some(u=>u.team===state.team&&u.impetuousAvailable);
 return state.impetuousPhase;
}
export function activate(u,state){
 if(!state.impetuousPhase||!eligible(u,state)||!u.impetuousAvailable)return {can:false,reason:'当前不能进行鲁莽激活'};
 u.impetuousAvailable=false;u.prone=false;
 return {can:true,source:'impetuous',spendRegular:0,requiresOwnAirborneOrder:!!u.offTable};
}
export function finish(state){for(const u of state.units)if(u.team===state.team)u.impetuousAvailable=false;state.impetuousPhase=false;}
export function validateCombination(first,second,u){
 if(!allowedFirst.includes(first))return '鲁莽激活不能选择此首项行动';
 if(['jump','climb','superlong','berserk','combatJump','parachutist'].includes(first))return second?'整令行动没有第二项行动':'';
 if(first==='superjump'&&!u.superJump||first==='climbplus'&&!u.climbingPlus)return '该配置没有对应技能';
 return second&&!allowedSecond.includes(second)?'鲁莽激活只允许移动、射击、近战、闪避或待机作为第二项行动':'';
}
// supplied alternatives may be legal routed paths from the map planner. Straight
// reachable enemy contacts and full-distance directions are also checked here.
// This is a path validator, not a claim of exhaustive global route optimization.
export function validatePath(u,path,units,terrain,{max=u.mov,cost=E.pathLength(path),kind='move',alternatives=[],terrainHindered=false}={}){
 if(!path?.length)return {can:false,reason:'必须声明移动路径'};
 if(path.some(p=>p.prone))return {can:false,reason:'鲁莽移动必须站立，且不能以俯卧结束'};
 const start=path[0],end=path.at(-1),standing={...u,prone:false},physical=kind==='move'?E.validPath(standing,path,units.filter(v=>!v.offTable),terrain,max):'';
 if(physical)return {can:false,reason:physical};
 if(cost>max+.025)return {can:false,reason:'超过本次移动距离'};
 const opponents=units.filter(v=>enemy(u,v)),contact=opponents.some(v=>E.edgeDistance({...standing,...end},v)<.026);
 if(contact)return {can:true,contact:true};
 if(cost<max-.05&&!terrainHindered)return {can:false,reason:'鲁莽移动必须用完对应 MOV，除非接敌或特殊地形阻碍'};
 const candidates=[...alternatives];
 if(kind==='move'){
  for(const v of opponents){const p=E.contactEnd({...standing,...start},v,[v]);if(!E.validPath(standing,[start,p],units.filter(v=>!v.offTable),terrain,max))candidates.push([start,p]);}
  for(let i=0;i<72;i++){const angle=i*Math.PI/36,p={...start,x:start.x+max*Math.cos(angle),y:start.y+max*Math.sin(angle)};if(!E.validPath(standing,[start,p],units.filter(v=>!v.offTable),terrain,max))candidates.push([start,p]);}
 }
 if(candidates.some(p=>opponents.some(v=>E.edgeDistance({...standing,...p.at(-1)},v)<.026)))return {can:false,reason:'存在本次移动可接触的敌人，必须优先接敌'};
 if(distanceDZ(u,start)===0)return {can:path.every(p=>distanceDZ(u,p)===0),reason:path.some(p=>distanceDZ(u,p)>0)?'进入敌方部署区后须留在区内':''};
 if(path.some(p=>distanceDZ(u,p)>distanceDZ(u,start)+.025))return {can:false,reason:'不能折返到比起点离敌方部署区更远的位置'};
 if(distanceDZ(u,end)>=distanceDZ(u,start)-.025)return {can:false,reason:'不能接近敌方部署区时应待机',mustIdle:true};
 if(candidates.some(p=>E.pathLength(p)>=max-.05&&distanceDZ(u,p.at(-1))<distanceDZ(u,end)-.08))return {can:false,reason:'有同等距离且更靠近敌方部署区的合法路径'};
 return {can:true,contact:false};
}
export function recordFrenzy(attacker,target,{damage=0,killed=false,deployable=false}={}){
 if(attacker.frenzy&&!attacker.impetuous&&target.team>=0&&target.team!==attacker.team&&!target.isDeployable&&!deployable&&!attacker.isDeployable&&(damage>0||killed))attacker.frenzyPending=true;
 return !!attacker.frenzyPending;
}
export function statesPhase(units){const activated=[];for(const u of units)if(u.frenzyPending){u.impetuous=true;u.limitedCover=true;u.frenzyPending=false;u.states=(u.states||[]).filter(s=>!['camouflaged','impersonation1','impersonation2','holoecho','holomask'].includes(s));activated.push(u.id);}return activated;}
export function counterintelligence(units,team,{use=true}={}){return use&&units.some(u=>u.team===team&&u.counterintelligence&&S.active(u));}
// Current Counterintelligence no longer requires its owner to be on table.
export function strategicEffect(units,team,choice,{useCounterintelligence=true}={}){
 const countered=counterintelligence(units,team,{use:useCounterintelligence});
 return choice==='removeOrders'?{countered,ordersRemoved:countered?1:2}:choice==='limitTokens'?{countered,commandTokenLimit:countered?2:1}:{countered:false,reason:'未知战略指挥令用途'};
}
