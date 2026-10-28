import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as F from '../dist/combat.js?v=122';
import * as E from '../dist/engine.js?v=122';
import * as M from '../dist/movement.js?v=122';
import * as U from '../dist/support-actions.js?v=122';
import * as X from '../dist/extra-actions.js?v=122';
import * as S from '../dist/states.js?v=122';
import * as V from '../dist/saves.js?v=122';
import {applyMineAttacks} from '../dist/mine-resolution.js?v=122';
import {LESSONS} from '../dist/lessons.js?v=122';
import {skillResultsHTML} from '../dist/skill-roll-ui.js?v=122';

const unit=(id,team,p,mods={})=>({id,team,name:id,type:'LI',s:2,x:p[0],y:p[1],z:p[2]||0,facing:team?90:-90,bs:11,cc:15,ph:10,wip:13,mov:4,mov2:4,arm:1,bts:0,attribute:'VITA',hp:1,maxhp:1,states:[],loadout:['combi','cc'],...mods});
const scene=key=>{const l=LESSONS[key];return {l,units:[unit('a0',0,l.positions[0],l.overrides[0]),unit('b0',1,l.positions[1],l.overrides[1]),...(l.extras||[]).map(v=>unit(v.id,v.team,[v.x,v.y,v.z],v))]};};
const templates=JSON.parse(readFileSync(new URL('../dist/templates.json',import.meta.url),'utf8'));

for(const key of ['auditSmoke66','auditSmoke66Fail'])test(`${key}: smoke only opposes intersected non-MSV shooters, all relevant duels govern persistence`,()=>{
 const {l,units}=scene(key),[active,side,front,msv]=units;
 active.loadout=['combi','smokeGrenade'];
 const args={active,attackPoint:active,weapon:'combi',modeId:'hit',path:[active],units,terrain:[],idle:true,activeSkill:'targetless',targetless:{weapon:'smokeGrenade',point:{x:20,y:24,z:0},actorPoint:active,burst:1},reactions:Object.fromEntries([side,front,msv].map(u=>[u.id,{id:u.id,action:'attack',weapon:'combi',modeId:'hit',point:active,lof:true}]))};
 let i=0;const pools=F.preparePools(args,()=>(l.dice[i++]-.5)/20),r=F.resolveOrder({...args,pools,deferSaves:true});
 assert.equal(r.details.find(d=>d.id===side.id).opposed,false);
 assert.equal(r.details.find(d=>d.id===front.id).opposed,true);
 assert.equal(r.details.find(d=>d.id===msv.id).opposed,key==='auditSmoke66Fail');
 assert.equal(r.zoneResults[0].success,key==='auditSmoke66');
 assert.equal(V.allPlans(r).reduce((n,p)=>n+p.initialCount,0),2);
});

for(const [key,sv,canMove,saves] of [['auditMine80',8,false,1],['auditMine80Success',6,true,0]])test(`${key}: the one Dodge die separately resolves gunfire and a mine`,()=>{
 const {l,units}=scene(key),[active,target,mine]=units;
 const args={active,attackPoint:active,mainTarget:target.id,weapon:'combi',modeId:'hit',path:[active],units,terrain:[],reactions:{[target.id]:{id:target.id,action:'dodge',lof:true}}};
 let i=0;const pools=F.preparePools(args,()=>(l.dice[i++]-.5)/20);
 assert.deepEqual(pools.reactions[target.id].dice,[sv]);
 let r=F.resolveOrder({...args,pools,deferSaves:true});
 assert.equal(r.details[0].incoming.initialCount,0);
 r=applyMineAttacks(r,[{mineId:mine.id,hits:[target.id],attacker:mine,ammo:'SHOCK',ps:7}],units,pools,active.id);
 assert.equal(r.extraPlans[0].dodgeSV,7);
 assert.equal(r.extraPlans[0].initialCount,saves);
 assert.equal(r.dodgers.includes(target.id),canMove);
});

test('Tech-Recovery is a later separate kit use and never grants an additional wound repair',()=>{
 const {units:[actor,patient]}=scene('auditTechRecovery115');
 assert.equal(X.validate(actor,patient,'gizmokit',{recovery:'states'}).can,true);
 const healed=X.resolve(actor,patient,'gizmokit',{attackDice:[7],phDice:[7]});
 assert.equal(healed.target.hp,1);assert.equal(S.unconscious(healed.target),false);
 assert.deepEqual(healed.target.states,['immA','isolated']);
 const second=X.resolve(actor,healed.target,'gizmokit',{recovery:'states',attackDice:[7],phDice:[7]});
 assert.equal(second.target.hp,1);assert.deepEqual(second.target.states,[]);
 const failed=X.resolve(actor,healed.target,'gizmokit',{recovery:'states',attackDice:[7],phDice:[20]});
 assert.equal(failed.target.hp,1);assert.deepEqual(failed.target.states,['immA','isolated']);
 assert.equal(failed.savingRolls,0);
});

test('active Aerial blocks contact kits in either direction but unconscious Aerial permits treatment',()=>{
 const a=unit('a',0,[10,10],{gizmokit:true}),p=unit('p',0,[10+25/25.4,10],{aerial:true,attribute:'STR',hp:1,maxhp:2});
 assert.match(X.validate(a,p,'gizmokit',{mode:'contact'}).reason,/Aerial/);
 assert.equal(X.validate(a,p,'gizmokit',{mode:'ranged'}).can,true);
 assert.equal(X.validate(a,{...p,hp:0,states:['unconscious']},'gizmokit',{mode:'contact',measure:true}).can,true);
 assert.match(X.validate({...a,aerial:true},{...p,aerial:false},'gizmokit',{mode:'contact'}).reason,/Aerial/);
 assert.equal(X.validate({...p,gizmokit:true},{...p,gizmokit:true},'gizmokit',{mode:'contact'}).can,true);
});

test('Doctor and Engineer cannot contact an active Aerial model, including an active Aerial healer',()=>{
 const a=unit('a',0,[10,10],{engineer:true,doctor:true}),p=unit('p',0,[10+25/25.4,10],{aerial:true,attribute:'STR',hp:1,maxhp:2});
 assert.match(U.validate(a,p,'engineer','repair').reason,/Aerial/);
 assert.equal(U.validate(a,{...p,hp:0,states:['unconscious']},'engineer','repair').can,true);
 assert.match(U.validate({...a,aerial:true},{...p,aerial:false,attribute:'VITA',hp:0,states:['unconscious']},'doctor','heal').reason,/Aerial/);
 assert.equal(U.validate({...p,engineer:true},{...p,engineer:true},'engineer','repair').can,true);
});

test('simultaneous Engineer and two-target Riotstopper: recovery is committed before separate PARA saves',()=>{
 const {units}=scene('auditEngineerPara'),[engineer,shooter,patient]=units;
 shooter.loadout=['heavyRiotstopper','cc'];
 Object.assign(patient,U.resolve(engineer,patient,'engineer','states',{die:7}).target);
 assert.equal(S.has(patient,'immA'),false);
 const m=F.weaponMode('heavyRiotstopper','template'),shape=F.makeTemplate(shooter,engineer,m,templates);
 const args={active:engineer,attackPoint:engineer,weapon:'combi',modeId:'hit',path:[engineer],units,terrain:[],idle:true,activeSkill:'engineer',reactions:{[shooter.id]:{id:shooter.id,action:'attack',weapon:'heavyRiotstopper',modeId:'template',point:engineer,shape,lof:true}}};
 const r=F.resolveOrder({...args,pools:F.preparePools(args),deferSaves:true});
 const hitPlans=V.allPlans(r).filter(p=>p.initialCount);
 assert.equal(hitPlans.length,2);
 for(const p of hitPlans){assert.equal(p.pending[0].stat,'PH');assert.equal(p.pending[0].sv,4);V.finishSaves(p,()=>20);}
 V.aggregate(r);
 for(const u of [engineer,patient]){S.apply(u,r.losses[u.id],r.effects[u.id]);assert.equal(u.hp,1);assert.equal(S.has(u,'immA'),true);}
 assert.deepEqual(F.availableWeapons(unit('unarmed',0,[1,1],{loadout:['cc']})),['cc']);
});

test('9-inch ordinary Climb persists at Z6 then completes with no horizontal rooftop travel',()=>{
 const {l,units:[u]}=scene('auditClimb33Tall'),roof=l.terrain[0],first=M.autoClimb(u,{x:24,y:24},6,l.terrain,[u]);
 assert.equal(first.end.z,6);assert.equal(first.end.wall,roof.id);assert.equal(first.cost,6);
 Object.assign(u,first.end);
 const second=M.autoClimb(u,{x:24,y:24},6,l.terrain,[u]);
 assert.equal(second.end.z,9);assert.equal(second.end.wall,null);
 assert.equal(second.end.x,roof.x+E.radius(u));assert.ok(second.cost<4.01);
 assert.equal(E.validPosition(u,second.end,[u],l.terrain),'');
});

test('GizmoKit SD is discarded before counting hits and the report identifies the discarded die',()=>{
 const {units:[actor,patient]}=scene('auditGizmoSD'),args={attackDice:[20,7],discard:[0]};
 assert.equal(X.resolve(actor,patient,'gizmokit',args).phCount,1);
 const r=X.resolve(actor,patient,'gizmokit',{...args,phDice:[7]});
 assert.equal(r.target.hp,1);assert.equal(S.unconscious(r.target),false);
 const html=skillResultsHTML([{name:actor.name,label:'维修包 · 命中',targetName:patient.name,dice:args.attackDice,discard:args.discard,sv:r.sv,success:true}]);
 assert.match(html,/：7（弃骰：20）/);assert.doesNotMatch(html,/：20, 7/);
});

test('skill battle records retain failed attempts and the selected reroll cost',()=>{
 const html=skillResultsHTML([{name:'Doctor',label:'救治',targetName:'Patient',dice:[7],sv:13,success:true,attempts:[{dice:[20],sv:13,reroll:'指挥令重掷 · WIP 13 · 消耗 1 指挥令'}]}]);
 assert.match(html,/此前检定：20 \/ SV 13/);assert.match(html,/消耗 1 指挥令/);assert.match(html,/：7 \/ SV 13/);
});

test('Tech-Recovery remains active in Null: clearing other states does not heal or cancel unconscious',()=>{
 const {units:[actor,patient]}=scene('auditTechRecoveryNull115');
 const r=X.resolve(actor,patient,'gizmokit',{recovery:'states',attackDice:[7],phDice:[7]});
 assert.equal(r.can,true);assert.equal(r.target.hp,0);assert.deepEqual(r.target.states,['unconscious']);
 const next=X.resolve(actor,r.target,'gizmokit',{attackDice:[7],phDice:[7]});
 assert.equal(next.target.hp,1);assert.deepEqual(next.target.states,[]);
 const failed=X.resolve(actor,patient,'gizmokit',{recovery:'states',attackDice:[7],phDice:[20]});
 assert.equal(failed.target.hp,0);assert.deepEqual(failed.target.states,patient.states);
});
