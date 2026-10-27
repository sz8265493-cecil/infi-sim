import * as AIR from './airborne.js?v=117';
import * as F from './combat.js?v=117';
import * as K from './skills.js?v=117';
import * as V from './saves.js?v=109';
// All coordinated landings are simultaneous: include every final friendly base.
export function finalizeLandings(results,units,terrain,templates){
 for(const d of results){const u=units.find(v=>v.id===d.actorId);if(!u||!d.explosion)continue;d.explosion=AIR.explosion({...u,combatJumpExplosionUsed:false},units,terrain,templates);}
 return results;
}
export function appendExplosions(result,results,units,terrain,pools){
 result.airborneChecks=[];const failed=new Set();
 for(const d of results){const a=units.find(u=>u.id===d.actorId),blast=d.explosion;if(!a||!blast)continue;
 if(blast.cancelledFriendly){result.airborneChecks.push({actorName:a.name,cancelled:true});continue;}
 for(const id of blast.hits){const u=units.find(v=>v.id===id),pool=pools?.reactions?.[id],sv=K.dodgeSV(u,{noLof:!F.canSee(u,a,terrain)}),dice=F.kept(pool),avoided=pool?.skill==='dodge'&&dice.some(n=>n<=sv);
 const p=V.planSaves(u,avoided?[]:[-1],0,{kind:'direct',template:'circle',ps:8,ammo:'N'},false);p.attacker={...a};p.airborneActorId=a.id;result.extraPlans??=[];result.extraPlans.push(p);
 result.airborneChecks.push({actorName:a.name,targetName:u.name,sv,dice:[...dice],dodging:pool?.skill==='dodge',avoided,hits:avoided?0:1});
 if(pool?.skill==='dodge'&&!avoided)failed.add(id);
 }}
 result.dodgers=(result.dodgers||[]).filter(id=>!failed.has(id));return V.aggregate(result);
}
