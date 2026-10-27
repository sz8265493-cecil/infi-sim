import test from 'node:test';
import assert from 'node:assert/strict';
import * as AIR from '../dist/airborne.js';
import * as AR from '../dist/airborne-resolution.js';
import * as H from '../dist/hacking.js';
const unit=(id,x,team=0)=>({id,name:id,x,y:25,z:0,s:2,team,hp:3,maxhp:3,states:[],ph:12,arm:1,facing:180,combatJumpExplosion:true});
test('coordinated blasts include subsequently landed allies and cancel symmetrically',()=>{
 const a=unit('a',20),b=unit('b',22),t=unit('t',21,1),ds=[{actorId:'a',explosion:{}},{actorId:'b',explosion:{}}];
 AR.finalizeLandings(ds,[a,b,t],[]);assert.ok(ds.every(d=>d.explosion.cancelledFriendly));assert.ok(ds.every(d=>!d.explosion.hits.length));
});
test('shared dodge die resolves each blast LoF separately and failure denies movement',()=>{
 const us=[unit('a',20.5),unit('b',25.5),unit('t',23,1)],ds=[{actorId:'a',explosion:{}},{actorId:'b',explosion:{}}];AR.finalizeLandings(ds,us,[]);
 const r=AR.appendExplosions({details:[],extraPlans:[],dodgers:['t']},ds,us,[],{reactions:{t:{skill:'dodge',dice:[10]}}});
 assert.deepEqual(r.airborneChecks.map(c=>c.sv),[12,9]);assert.deepEqual(r.airborneChecks.map(c=>c.hits),[0,1]);assert.deepEqual(r.dodgers,[]);assert.equal(r.extraPlans.reduce((n,p)=>n+p.initialCount,0),1);
});
test('one successful dodge die avoids both blast templates without saves',()=>{
 const us=[unit('a',20.5),unit('b',25.5),unit('t',23,1)],ds=[{actorId:'a',explosion:{}},{actorId:'b',explosion:{}}];AR.finalizeLandings(ds,us,[]);
 const r=AR.appendExplosions({details:[],extraPlans:[],dodgers:['t']},ds,us,[],{reactions:{t:{skill:'dodge',dice:[7]}}});assert.equal(r.extraPlans.reduce((n,p)=>n+p.initialCount,0),0);assert.deepEqual(r.dodgers,['t']);
});
test('EVO immediate effect applies globally once and opposing supportware cancels',()=>{
 const a=unit('a',20),enemy={...unit('e',43,1),hackingDevice:'EVO'},ally={...unit('f',43),hackingDevice:'EVO',supportware:{id:'controlledJump',team:0}};
 const r=H.resolveSupport([a,enemy],enemy.id,'controlledJump',{reactive:true,trigger:'combatJump'});assert.equal(r.can,true);assert.equal(H.controlledJumpMod(a,r.units),-3);assert.equal(H.controlledJumpMod(a,[...r.units,ally]),0);
});
test('failed jump blast uses fallback not originally declared point',()=>{
 const a={...unit('a',0),offTable:true,combatJump:true},t={...unit('t',2.5,1),y:38},r=AIR.resolve(a,{x:20,y:25,z:0},'combatJump',{die:10,controlledJumpMod:-3,fallback:{x:25/25.4/2,y:38,z:0},units:[a,t],terrain:[]});assert.equal(r.applied,true);assert.equal(r.success,false);assert.deepEqual(r.explosion.hits,['t']);assert.equal(r.unit.combatJumpExplosionUsed,true);
});
