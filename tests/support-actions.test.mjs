import test from 'node:test';
import assert from 'node:assert/strict';
import * as A from '../dist/support-actions.js';
const unit=(extra={})=>({id:'a',x:4,y:4,z:0,s:2,team:0,hp:1,maxhp:1,attribute:'VITA',wip:13,states:[],...extra});
const patient=(extra={})=>unit({id:'b',x:4+25/25.4,hp:0,states:['unconscious'],...extra});
test('support requires the actual skill and is never an ARO',()=>{
 assert.deepEqual(A.availableActions(unit()),[]);
 assert.deepEqual(A.availableActions(unit({doctor:true,engineer:true})),['doctor','engineer']);
 assert.deepEqual(A.availableActions(unit({doctor:true}),{reactive:true}),[]);
 assert.equal(A.validate(unit({doctor:true}),patient(),'doctor','heal',{reactive:true}).can,false);
 assert.equal(A.validate(unit({doctor:true}),patient({x:9}),'doctor','heal').can,false);
});
test('doctor healing cannot repair conscious wounds, resurrect Dead, or ordinarily repair STR',()=>{
 const a=unit({doctor:true});
 for(const b of [patient({hp:1,maxhp:2,states:[]}),patient({hp:-1,states:['dead']}),patient({attribute:'STR'})])
  assert.equal(A.validate(a,b,'doctor','heal').can,false);
 const b=patient({attribute:'STR',technorganic:true});
 assert.equal(A.resolve(a,b,'doctor','heal',{die:10}).target.hp,1);
});
test('doctor 2W and final failure; resolve is immutable',()=>{
 const a=unit({doctor:{wounds:2}}),b=patient({maxhp:2});
 assert.equal(A.resolve(a,b,'doctor','heal',{die:12}).target.hp,2);
 assert.equal(A.resolve(a,b,'doctor','heal',{die:20}).removed,true);
 assert.deepEqual(b.states,['unconscious']);assert.equal(b.hp,0);
});
test('engineer recovers Remote Presence unconscious II to 1 HP in one success',()=>{
 const a=unit({engineer:true}),b=patient({attribute:'STR',hp:-1,maxhp:2,remotePresence:true,states:['unconscious2']});
 const result=A.resolve(a,b,'engineer','repair',{die:8});
 assert.equal(result.target.hp,1);assert.ok(!result.target.states.includes('unconscious2'));
 assert.equal(A.resolve(a,b,'engineer','repair',{die:20}).removed,true);
});
test('engineer repair and cancel states are separate; cancel failure never wounds',()=>{
 const a=unit({engineer:true}),b=patient({attribute:'STR',hp:1,maxhp:2,states:['immA','immB','isolated','targeted','stunned','possessed']});
 const fixed=A.resolve(a,b,'engineer','states',{die:7}).target;
 assert.equal(fixed.hp,1);assert.deepEqual(fixed.states,['possessed']);
 assert.equal(A.resolve(a,b,'engineer','states',{die:20}).target.hp,1);
 const repaired=A.resolve(a,b,'engineer','repair',{die:7}).target;
 assert.equal(repaired.hp,2);assert.ok(repaired.states.includes('immA'));
 assert.equal(A.resolve(a,b,'engineer','repair',{die:20}).target.hp,0);
});
test('self treatment allowed only when states permit; Stunned type restriction remains',()=>{
 const doctor=unit({doctor:true,states:['stunned']});
 const r=A.resolve(doctor,doctor,'doctor','states',{die:10});
 assert.equal(r.sv,10);assert.deepEqual(r.target.states,[]);
 assert.equal(A.validate(unit({engineer:true,states:['immB']}),patient({attribute:'STR'}),'engineer','repair').can,false);
 assert.deepEqual(A.cancellableStates(patient({attribute:'VITA',states:['stunned','isolated']}),'engineer'),['isolated']);
 assert.deepEqual(A.cancellableStates(patient({attribute:'STR',technorganic:true,states:['stunned']}),'doctor'),[]);
});
test('skill reroll uses configured WIP; command reroll uses ordinary WIP and requires Cube/Remote Presence',()=>{
 const a=unit({doctor:{rerollWip:8}}),b=patient({cube:true});
 assert.deepEqual(A.rerollOptions(a,b,'doctor',{commandTokens:1}).map(r=>[r.id,r.sv]),[['skill',8],['command',13]]);
 assert.deepEqual(A.rerollOptions(a,b,'doctor',{commandTokens:1,skillUsed:true}).map(r=>r.id),['command']);
 assert.deepEqual(A.rerollOptions(a,patient(),'doctor',{commandTokens:1,skillUsed:true}),[]);
 assert.deepEqual(A.rerollOptions(a,b,'doctor',{failed:false,commandTokens:1}),[]);
});
test('space-caused immobilization cannot be removed by engineer',()=>{
 const b=patient({hp:1,states:['immA'],immAFromSpace:true});
 assert.deepEqual(A.cancellableStates(b,'engineer'),[]);
});
