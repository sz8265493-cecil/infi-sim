import {critical} from './engine.js?v=34';
import * as S from './states.js?v=34';
export const AMMO={CYBER:'电子地雷 · 非致命通讯攻击',N:'普通 N',AP:'穿甲 AP',DA:'双重 DA',EXP:'爆炸 EXP',EM:'电磁 E/M',PARA:'麻痹 PARA',SHOCK:'休克 Shock',STUN:'眩晕 Stun',T2:'T2',PLASMA:'等离子 ARM＋BTS',VIRAL:'病毒 Viral',BREAKER:'破盾 Breaker',MONO:'单分子',K1:'K1'};
export function ammoOf(m){return m.ammo||(m.saves===3?(m.ap?'AP+EXP':'EXP'):m.ap?'AP':'N');}
function rule(target,m){let ammo=ammoOf(m),stat=m.saveAttribute||'ARM',parts=ammo.split('+'),immune=(target.immunities||[]),traits=true;
if(ammo==='PLASMA')return {ammo,parts:['N'],stat:'ARM+BTS',traits:true};
if(ammo==='VIRAL'){parts=target.attribute==='STR'?['N']:['DA','SHOCK'];stat='BTS';}
if(ammo==='BREAKER'){parts=['AP'];stat='BTS';}
if(parts.includes('EM')||parts.includes('STUN'))stat='BTS';
if(parts.includes('PARA'))stat='PH';
const enhanced=immune.includes('Enhanced')&&!(ammo==='VIRAL'&&target.vulnerableViral);
if(stat!=='PH'&&(enhanced||immune.includes(stat))){parts=['N'];traits=false;}
else parts=parts.map(k=>immune.includes(k)?'N':k);
return {ammo,parts,stat,traits};}
export function planSaves(target,hits,sv,m,cov){const r=rule(target,m),parts=r.parts,raw=ammoOf(m).split('+'),nonlethal=raw.includes('PARA')||raw.includes('EM')&&!raw.includes('N')||raw.includes('STUN')||m.nonlethal;
const count=parts.includes('EXP')?3:parts.includes('DA')||parts.includes('EM')?2:1,task=(critical,hit,stat=r.stat)=>{let base=stat==='PH'?target.ph:(target[stat.toLowerCase()]||0),mod=m.srMod||0,rawBase=base;if(stat==='PH')mod-=6;else if(parts.includes('AP')||parts.includes('EM'))base=Math.ceil(base/2);if(parts.includes('MONO')||parts.includes('K1'))base=0;
const cover=stat!=='PH'&&cov&&!m.template?3:0,ps=stat==='PH'?0:m.ps;
return {hit,critical,stat,base,rawBase,reduction:parts.includes('AP')||parts.includes('EM')?'half':parts.includes('MONO')||parts.includes('K1')?'zero':'',ps,cover,mod,sv:ps+base+cover+mod,wounds:nonlethal?0:parts.includes('T2')&&!critical?2:1,continuous:!!m.continuous&&r.traits&&!critical,effects:[...(m.effects||[]),...(parts.includes('EM')?['isolated',...(['HI','TAG','REM','VH'].includes(target.type)?['immB']:[])]:[]),...(parts.includes('PARA')?['immA']:[]),...(raw.includes('STUN')||m.stun?['stunned']:[]),...(parts.includes('SHOCK')?['shock']:[]),...(parts.includes('MONO')?['dead']:[])]};};
const tasks=[];hits.forEach((h,i)=>{if(r.stat==='ARM+BTS')tasks.push(task(false,i,'ARM'),task(false,i,'BTS'));else for(let j=0;j<count;j++)tasks.push(task(false,i));if(critical(h,sv)&&!(target.immunities||[]).includes('Critical'))tasks.push(task(true,i,r.stat==='ARM+BTS'?'ARM':r.stat));});
return {targetId:target.id,targetName:target.name||target.id,target:structuredClone(target),ammo:r.ammo,hits:hits.length,criticals:hits.filter(h=>critical(h,sv)).length,initialCount:tasks.length,pending:tasks,saves:[],damage:0,effects:[],round:0};}
export function rollRound(plan,roll){const round=++plan.round,tasks=plan.pending;plan.pending=[];for(const task of tasks){const die=roll(),fail=die>task.sv;const rec={...task,die,fail,round};plan.saves.push(rec);if(!fail)continue;plan.damage+=task.wounds;for(const e of task.effects){if((plan.target.stateImmunities||[]).includes(e))continue;if(e==='shock'&&plan.target.shockImmune)continue;if(e==='dead'){plan.damage=Math.max(plan.damage,plan.target.hp+(plan.target.remotePresence&&plan.target.attribute==='STR'?2:1));}else if(!plan.effects.includes(e))plan.effects.push(e);}
const copy=structuredClone(plan.target);S.apply(copy,plan.damage,plan.effects);if(task.continuous&&!S.has(copy,'dead'))plan.pending.push({...task});}
// Independent failed Continuous Damage saves produce their own repeated save.
const final=structuredClone(plan.target);S.apply(final,plan.damage,plan.effects);if(S.has(final,'dead'))plan.pending=[];return plan;}
export function finishSaves(plan,roll){while(plan.pending.length)rollRound(plan,roll);return plan;}
export function allPlans(result){return [...result.details.flatMap(d=>[d.incoming,d.outgoing]),...(result.extraPlans||[])].filter(p=>p.targetId);}
export function aggregate(result){result.losses={};result.effects={};for(const p of allPlans(result)){result.losses[p.targetId]=(result.losses[p.targetId]||0)+p.damage;result.effects[p.targetId]=[...new Set([...(result.effects[p.targetId]||[]),...p.effects])];}for(const id of Object.keys(result.losses)){const plans=allPlans(result).filter(p=>p.targetId===id),target=structuredClone(plans[0].target);S.apply(target,result.losses[id],result.effects[id]);if(S.has(target,'dead'))for(const p of plans)p.pending=[];}return result;}
