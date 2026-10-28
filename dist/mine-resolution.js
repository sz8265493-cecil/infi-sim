import {kept,activePools} from './combat.js?v=122';
import * as E from './engine.js?v=122';
import * as V from './saves.js?v=122';
import * as S from './states.js?v=122';
import * as K from './skills.js?v=122';
// Reuse the declared Dodge die, but assess the mine separately at PH -3.
// The no-LoF and Deployable -3 circumstances do not stack with each other.
export function applyMineAttacks(result,attacks,units,pools,actorId){
 for(const hit of attacks){for(const id of hit.hits){const u=units.find(v=>v.id===id);if(!u||!S.present(u))continue;const pool=activePools(pools).find(p=>p?.id===id)||(id===actorId?pools.active:pools.reactions[id]),dodge=pool?.skill==='dodge',reset=pool?.skill==='reset',defends=hit.cyber?reset:dodge,sv=hit.cyber?Math.max(0,(u.wip||0)+E.clamp(S.resetMod(u)-3,-12,12)):K.dodgeSV(u,{noLof:true}),dice=kept(pool),avoided=defends&&dice.some(n=>n<=sv);const p=V.planSaves(u,avoided?[]:[-1],0,{kind:'direct',template:hit.boost?undefined:'small',ps:hit.ps,ammo:hit.ammo||'SHOCK',...(hit.cyber?{saveAttribute:'BTS',nonlethal:true,effects:[u.hackable||u.hacker||u.hackingDevice||['HI','TAG','REM','VH'].includes(u.type)?'immB':'stunned']}: {})},false);if(hit.cyber)p.ammo='CYBER';Object.assign(p,{attacker:hit.attacker,mine:true,boost:!!hit.boost,dodgeSV:!hit.cyber&&dodge?sv:null,dodgeDice:!hit.cyber&&dodge?dice:[],resetSV:hit.cyber&&reset?sv:null,cyber:!!hit.cyber,avoided});result.extraPlans??=[];result.extraPlans.push(p);if(dodge&&!hit.cyber&&!avoided)result.dodgers=result.dodgers.filter(n=>n!==id);}}
 return V.aggregate(result);
}
