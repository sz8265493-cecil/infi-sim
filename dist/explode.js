import * as E from './engine.js?v=117';
import * as S from './states.js?v=109';
import * as F from './combat.js?v=117';
import * as D from './deployables.js?v=84';
import {applyMineAttacks} from './mine-resolution.js?v=79';
import * as V from './saves.js?v=109';
// Trigger only on a transition this Order, never on a pre-existing unconscious model.
export const pending=units=>units.filter(u=>u.pendingExplode&&u.explode&&S.onTable(u)&&S.unconscious(u)&&!S.pendingSurvival(u).length);
export function wave(units,terrain,pools,templates,options={}){
 const sources=pending(units),result={details:[],extraPlans:[],dodgers:[],explodeChecks:[],mineAttacks:[]};
 for(const a of sources){const shape={kind:'circle',origin:{x:a.x,y:a.y,z:a.z||0},r:(templates?.circle?.diameter??4.7)/2},hits=units.filter(u=>u.id!==a.id&&S.onTable(u)&&E.templateHits(shape,u,terrain)),cancelled=hits.some(u=>u.team===a.team||u.team<0);
 result.explodeChecks.push({sourceId:a.id,actorName:a.name,cancelled,shape,targets:hits.map(u=>u.id)});
 if(cancelled)continue;
 for(const u of hits){const pool=[...F.activePools(pools),...Object.values(pools.reactions||{})].find(p=>p?.id===u.id&&p.skill==='dodge'),dice=F.kept(pool),avoided=!!pool&&dice.some(n=>n<=pool.sv),p=V.planSaves(u,avoided?[]:[-1],0,{kind:'direct',template:'circle',ps:7,ammo:'SHOCK'},false);
 Object.assign(p,{attacker:structuredClone(a),explodeSource:a.id,explodeDodge:pool?{dice,sv:pool.sv,avoided}:null});result.extraPlans.push(p);
 }}
 // Rules-derived interaction: Explode executes an Automatic Skill. Mine checks
 // happen before this wave removes any sources; canceled blasts still execute.
 // Damage to a mine alone is not a trigger, and a mine can trigger only once.
 for(const mine of units.filter(u=>D.isTriggerWeapon(u.deployableKind)&&S.onTable(u)&&u.hp>0)){
  for(const source of sources){
   const hit=D.mineTrigger(mine,source,{units,terrain,templates,orderId:options.orderId});
   if(!hit)continue;
   result.mineAttacks.push({...hit,triggerId:source.id,attacker:structuredClone(mine)});
   break;
  }
 }
 applyMineAttacks(result,result.mineAttacks,units,pools);
 return V.aggregate(result);
}
export function applyWave(result,units){
 V.aggregate(result);
 for(const u of units)S.apply(u,result.losses[u.id]||0,result.effects[u.id]||[]);
 for(const hit of result.mineAttacks||[]){const mine=units.find(u=>u.id===hit.mineId);if(mine){mine.hp=0;mine.states=(mine.states||[]).filter(s=>s!=='camouflaged');S.health(mine);}}
 // Simultaneous sources are removed only after every save in this wave.
 for(const c of result.explodeChecks){const u=units.find(u=>u.id===c.sourceId);if(!u)continue;u.hp=-(u.attribute==='STR'&&u.remotePresence?2:1);u.states=(u.states||[]).filter(s=>!['nwi','dogged'].includes(s));S.health(u);delete u.pendingExplode;delete u.pendingChoice;}
 return units;
}
