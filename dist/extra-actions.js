// N5.3 equipment actions. Declare without measuring; measure only in resolution.
import * as E from './engine.js?v=36';
import * as S from './states.js?v=36';
import * as K from './skills.js?v=36';
import {cancellableStates,passed} from './support-actions.js?v=36';

export const SOURCES=['https://infinitythewiki.com/MediKit','https://infinitythewiki.com/GizmoKit','https://infinitythewiki.com/Deactivator','https://infinitythewiki.com/Forward_Observer','https://infinitythewiki.com/Tech-Recovery'];
export const LABELS={medikit:'医疗包',gizmokit:'维修包',deactivator:'拆除器',forwardObserver:'前线观测'};
const kit=k=>k==='medikit'||k==='gizmokit';
const usable=a=>a&&S.active(a)&&S.onTable(a)&&!['immA','immB','engaged','disconnected','sepsitorized'].some(s=>S.has(a,s))&&(!a.wall||a.climbingPlus);
const owns=(a,k)=>!!a?.[k];
const lof=(a,t,terrain)=>E.front(a,t)&&E.visibility(a,t,terrain).visible;
const rangedMod=(k,d)=>k==='forwardObserver'?(d<=24?0:d<=48?-3:d<=96?-6:null):d<=8?(k==='deactivator'?6:3):d<=16?(k==='deactivator'?3:0):d<=24?-6:null;
export function availableActions(actor,{reactive=false}={}){
 if(!usable(actor))return [];
 return Object.keys(LABELS).filter(k=>owns(actor,k)&&(!reactive||k==='forwardObserver')&&(!(k==='forwardObserver'||k==='deactivator')||!S.has(actor,'stunned')));
}
export function modes(actor,target,action){
 if(!owns(actor,action))return [];
 return kit(action)?[{id:'ranged',name:'远程投射'},{id:'contact',name:'轮廓接触'}]:[{id:'ranged',name:LABELS[action]}];
}
export function validate(actor,target,action,{reactive=false,mode='ranged',terrain=[],measure=false,recovery='wounds'}={}){
 let reason=!owns(actor,action)?'该配置没有对应技能或装备':!availableActions(actor,{reactive}).includes(action)?reactive&&action!=='forwardObserver'?'该行动只能在主动轮使用':'当前状态不能宣告该行动':!target||!S.onTable(target)?'目标不在桌面上':K.marker(target)?'不能直接选择未揭露的迷彩标记':'';
 if(!reason&&kit(action)){
  const compatible=action==='medikit'?['VITA','W'].includes(target.attribute):target.attribute==='STR';
  if(target.team!==actor.team)reason='只能选择友军';
  else if(!(compatible||target.technorganic&&S.unconscious(target)||action==='gizmokit'&&target.techRecovery&&recovery==='states'))reason='目标属性不符合装备要求';
  else if(S.has(target,'dogged'))reason='顽强状态不能接受治疗';
  else if(action==='medikit'&&!S.unconscious(target)&&!S.has(target,'nwi'))reason='医疗包只能救治昏迷目标';
  else if(recovery==='states'&&(action!=='gizmokit'||!target.techRecovery||S.unconscious(target)||!cancellableStates(target,'engineer').length))reason='需要技术恢复技能及可解除的状态；昏迷须先恢复';
  else if(action==='gizmokit'&&recovery!=='states'&&target.hp>=target.maxhp)reason='目标没有损伤';
  else if(!['contact','ranged'].includes(mode))reason='请选择接触或远程模式';
 }else if(!reason&&action==='deactivator'){
  if(target.team===actor.team||!target.isDeployable)reason='只能拆除敌方已部署的武器或装备';
 }else if(!reason&&action==='forwardObserver'&&target.team===actor.team)reason='只能标记敌方目标';
 if(!reason&&mode==='contact'&&measure&&actor.id!==target.id&&E.edgeDistance(actor,target)>.025)reason='需要与目标轮廓接触';
 if(!reason&&mode!=='contact'&&action!=='deactivator'&&!lof(actor,target,terrain))reason='没有所需视线';
 // ZoC and range are checked in Resolution, never to reveal distance at declaration.
 if(!reason&&measure&&action==='deactivator'&&!lof(actor,target,terrain)&&E.edgeDistance(actor,target)>8)reason='目标既无视线，也不在控制区';
 if(!reason&&measure&&mode!=='contact'&&rangedMod(action,E.edgeDistance(actor,target))===null)reason='目标超出射程，行动视为待机';
 return {can:!reason,reason};
}
export function spec(actor,target,action,options={}){
 const opts={mode:'ranged',terrain:[],measure:true,...options},check=validate(actor,target,action,opts);
 if(!opts.measure)return {...check,action,mode:opts.mode,targetId:target?.id};
 if(!target)return {...check,action};
 const contact=kit(action)&&opts.mode==='contact',d=E.edgeDistance(actor,target),rm=contact?0:rangedMod(action,d),cov=!contact&&action!=='deactivator'&&E.cover(actor,target,opts.terrain);
 const mods=contact?[]:action==='deactivator'?[['距离',rm??0]]:K.attackMods(actor,target,{kind:'bs',attribute:action==='forwardObserver'?'wip':'bs'},{rm:rm??0,cov});
 const base=action==='deactivator'||action==='forwardObserver'?actor.wip:actor.bs;
 return {...check,action,mode:opts.mode,targetId:target.id,d,rm,cov,mods,automatic:contact,sv:Math.max(0,(base||0)+E.clamp(mods.reduce((n,m)=>n+m[1],0),-12,12)),burst:contact?1:action==='deactivator'?1:opts.reactive?(actor.totalReaction||actor.neurocinetics?2+(actor.neurocinetics?actor.bsBurstBonus||0:0):1):actor.neurocinetics?1:(action==='forwardObserver'?2:1)+(actor.bsBurstBonus||0)+(action==='gizmokit'?(actor.gizmokitBurstBonus||0):0),sd:contact||action==='deactivator'?0:K.specialDice(actor,{kind:'bs'}),normal:action!=='forwardObserver',ph:(target[action+'PH']??target.ph)+(action==='gizmokit'?(target.tagcomGizmo||0):0),recovery:opts.recovery||'wounds'};
}
// Inputs are already rolled dice. FO accepts opposedDice/opposedSV for its Face to Face.
// Kits return needsPH before any mutation; integrator displays the separate PH stage.
export function resolve(actor,target,action,{attackDice=[],phDice=[],opposedDice=[],opposedSV=0,...options}={}){
 const info=spec(actor,target,action,options);
 if(!info.can)return {...info,applied:false};
 const valid=ds=>ds.every(d=>Number.isInteger(d)&&d>=1&&d<=20);
 if(!valid(attackDice)||!valid(phDice)||!valid(opposedDice))return {...info,can:false,reason:'需要有效的 D20 结果',applied:false};
 if(!info.automatic&&attackDice.length!==info.burst+info.sd)return {...info,applied:false,needsAttack:true};
 if(info.sd){const disc=Array.isArray(options.discard)?options.discard:[options.discard];if(disc.length!==info.sd||disc.some(i=>!Number.isInteger(i)||i<0||i>=attackDice.length)||new Set(disc).size!==disc.length)return {...info,applied:false,needsDiscard:true};attackDice=attackDice.filter((_,i)=>!disc.includes(i));}
 const hits=info.automatic?1:action==='forwardObserver'&&opposedDice.length?E.resolveDice(attackDice,info.sv,opposedDice,opposedSV).a.length:attackDice.filter(d=>passed(d,info.sv)).length;
 if(kit(action)&&hits&&phDice.length!==hits)return {...info,applied:false,hits,needsPH:true,phCount:hits,attackDice};
 const next={...target,states:[...(target.states||[])]};
 let success=hits>0,damage=0,removedStates=[];
 if(kit(action)&&hits){
  success=phDice.some(d=>passed(d,info.ph));
  if(info.recovery==='states'){
   if(success){removedStates=cancellableStates(next,'engineer');next.states=next.states.filter(s=>!removedStates.includes(s));}
  }else if(success){next.hp=Math.min(next.maxhp,action==='gizmokit'&&next.remotePresence&&S.unconscious(next)?1:next.hp+1);S.health(next);}
  else if(action==='medikit'){next.hp=-(next.attribute==='STR'&&next.remotePresence?2:1);S.health(next);}
  else{damage=1;S.apply(next,damage);}
 }else if(hits&&action==='forwardObserver')next.states=[...new Set([...next.states,'targeted'])];
 else if(hits&&action==='deactivator'){next.hp=0;next.states=[...new Set([...next.states,'dead'])];}
 return {...info,applied:true,target:next,success,hits,attackDice,phDice,damage,recovered:Math.max(0,next.hp-target.hp),removed:S.has(next,'dead'),removedStates,preserveCurrentOrderTrigger:action==='deactivator',savingRolls:0};
}
