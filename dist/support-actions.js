// N5.3: Doctor / Engineer. Effects are committed only after optional rerolls.
import * as S from './states.js?v=122';
import {edgeDistance} from './engine.js?v=122';

export const SOURCES=['https://infinitythewiki.com/Doctor','https://infinitythewiki.com/Engineer','https://infinitythewiki.com/Stunned_State','https://infinitythewiki.com/Technorganic','https://infinitythewiki.com/Command_Tokens'];
export const LABELS={doctor:'医生',engineer:'工程师'};
const config=(u,skill)=>typeof u?.[skill]==='object'?u[skill]:{};
const hasSkill=(u,skill)=>['doctor','engineer'].includes(skill)&&!!u?.[skill];
const vitality=u=>u.attribute==='VITA'||u.attribute==='W';
const nullState=u=>!S.active(u)||['disconnected','sepsitorized'].some(s=>S.has(u,s));
export function availableActions(actor,{reactive=false}={}){
 if(reactive||!actor||nullState(actor)||actor.wall&&!actor.climbingPlus||['immA','immB','engaged'].some(s=>S.has(actor,s)))return [];
 return ['doctor','engineer'].filter(skill=>hasSkill(actor,skill));
}
export function cancellableStates(target,skill){
 if(!target)return [];
 if(skill==='doctor')return vitality(target)&&S.has(target,'stunned')?['stunned']:[];
 if(skill!=='engineer')return [];
 return (target.states||[]).filter(s=>['immA','immB','isolated','targeted','disconnected'].includes(s)&&!(s==='immA'&&target.immAFromSpace)||s==='stunned'&&target.attribute==='STR');
}
export function modes(actor,target,skill){
 if(!hasSkill(actor,skill)||!target||!S.onTable(target)||S.has(target,'dogged'))return [];
 const out=[];
 if(skill==='doctor'&&(S.unconscious(target)||S.has(target,'nwi'))&&(vitality(target)||target.technorganic))out.push({id:'heal',name:'救治昏迷',description:'成功恢复；最终失败移除目标'});
 if(skill==='engineer'&&target.hp<target.maxhp&&(target.attribute==='STR'||target.technorganic&&(S.unconscious(target)||S.has(target,'nwi'))))out.push({id:'repair',name:'修复损伤',description:'成功恢复；最终失败增加 1 点伤害'});
 const states=cancellableStates(target,skill);
 if(states.length)out.push({id:'states',name:'解除状态',states,description:'成功解除列出的状态；失败不造成额外伤害'});
 return out;
}
export function validate(actor,target,skill,mode,{reactive=false,measure=true}={}){
 const reason=!hasSkill(actor,skill)?'该单位没有对应技能':reactive?'医生和工程师只能在主动轮作为短技能宣告':
 !availableActions(actor).includes(skill)?'当前状态不能宣告该技能':
 !target||!S.onTable(target)?'目标不在桌面上':
 !modes(actor,target,skill).some(m=>m.id===mode)?'目标不符合此技能模式的要求':
 actor.id!==target.id&&[actor,target].some(u=>u.aerial&&S.active(u))?'有效Aerial单位不能轮廓接触，不能使用接触救治':
 actor.id!==target.id&&measure&&edgeDistance(actor,target)>.025&&!(actor.remoteContactPoints||[]).some(v=>S.active(v)&&S.onTable(v)&&!v.aerial&&edgeDistance(v,target)<=.025)?'必须与目标轮廓接触':'';
 return {can:!reason,reason};
}
export function spec(actor,target,skill,mode,options={}){
 const check=validate(actor,target,skill,mode,options),c=config(actor,skill);
 const base=Number(actor?.wip)||0,mod=(Number(c.wipMod)||0)+S.rollMod(actor);
 return {...check,skill,mode,targetId:target?.id,base,mod,sv:Math.max(0,base+mod),normal:true,burst:1,states:mode==='states'?cancellableStates(target,skill):[]};
}
// Pass the last die's failed status, not an already-applied failure result.
export function rerollOptions(actor,target,skill,{failed=true,skillUsed=false,commandTokens=0,reactive=false}={}){
 if(!failed||reactive||!hasSkill(actor,skill))return [];
 const c=config(actor,skill),out=[],mod=(Number(c.wipMod)||0)+S.rollMod(actor);
 if(!skillUsed&&Number.isFinite(c.rerollWip))out.push({id:'skill',name:'技能重掷',sv:Math.max(0,c.rerollWip+mod),cost:0});
 if(commandTokens>0&&(skill==='doctor'?target?.cube:target?.remotePresence))out.push({id:'command',name:'指挥令重掷',sv:Math.max(0,(actor.wip||0)+mod),cost:1});
 return out;
}
export const passed=(die,sv)=>Number.isInteger(die)&&die>=1&&die<=20&&sv>0&&die+Math.max(0,sv-20)<=sv;
// Does not mutate actor/target. Integrator applies result.target before hostile effects
// from the same Order (official positive-before-negative ordering).
export function resolve(actor,target,skill,mode,{die,sv,...options}={}){
 const info=spec(actor,target,skill,mode,options);
 if(!info.can)return {...info,applied:false};
 if(!Number.isInteger(die)||die<1||die>20)return {...info,can:false,reason:'需要有效的 D20 结果',applied:false};
 const next={...target,states:[...(target.states||[])]},success=passed(die,sv??info.sv),beforeHp=target.hp;
 let removedStates=[],damage=0,removed=false;
 if(mode==='states'){
  if(success){removedStates=cancellableStates(next,skill);next.states=next.states.filter(s=>!removedStates.includes(s));}
 }else if(success){
  const recovery=skill==='doctor'?Math.max(1,Number(config(actor,skill).wounds)||1):1;
  next.hp=Math.min(next.maxhp,S.has(next,'nwi')?1:skill==='engineer'&&next.remotePresence&&(S.unconscious(next)||S.has(next,'nwi'))?1:next.hp+recovery);
  S.health(next);
  removedStates=(target.states||[]).filter(s=>!next.states.includes(s));
 }else if(skill==='doctor'){
  next.states=next.states.filter(k=>!['nwi','dogged'].includes(k));next.hp=-(next.attribute==='STR'&&next.remotePresence?2:1);S.health(next);removed=true;
 }else{damage=1;S.apply(next,1);removed=S.has(next,'dead');}
 return {...info,applied:true,die,sv:sv??info.sv,success,target:next,recovered:Math.max(0,next.hp-beforeHp),damage,removed,removedStates};
}

// All requirements are checked against the same Resolution snapshot. Do not
// revalidate a later declaration after an earlier positive effect healed it.
export function resolveBatch(target, declarations, {coordinated=false}={}){
 const results=declarations.map(d=>({...d,result:resolve(d.actor,target,d.skill,d.mode,d.roll)}));
 let valid=results.filter(d=>d.result.applied),next=structuredClone(target);
 if(coordinated){const successes=valid.filter(d=>d.result.success);valid=successes.length?[successes.sort((a,b)=>b.result.recovered-a.result.recovered)[0]]:valid.slice(0,1);}
 for(const d of valid.filter(d=>d.result.success)){
  if(d.mode==='states')next.states=next.states.filter(s=>!d.result.removedStates.includes(s));
  else {const amount=d.skill==='doctor'?Math.max(1,Number(config(d.actor,d.skill).wounds)||1):1;
   next.hp=Math.min(next.maxhp,S.has(next,'nwi')?1:d.skill==='engineer'&&next.remotePresence&&S.unconscious(next)?1:next.hp+amount);S.health(next);}
 }
 for(const d of valid.filter(d=>!d.result.success&&d.mode!=='states')){
  if(d.skill==='doctor'){next.states=next.states.filter(s=>!['nwi','dogged'].includes(s));next.hp=-(next.attribute==='STR'&&next.remotePresence?2:1);S.health(next);}
  else S.apply(next,1);
 }
 return {target:next,results,coordinated};
}
