import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../dist/recovery-resolution.js';
import * as F from '../dist/combat.js?v=117';
import * as H from '../dist/hacking.js?v=82';
const u=(id,extra={})=>({id,name:id,team:0,x:20,y:20,z:0,s:2,facing:90,hp:1,maxhp:1,states:[],wip:13,...extra});
test('same-order recovery freezes attack qualification but leaves restored health available for damage',()=>{
 const patient=u('p',{hp:0,states:['unconscious'],prone:true}),other=u('x'),units=[patient,other],order={supports:[{kind:'gizmokit',targetId:'p'}]},terrain=[];terrain.zones=[{kind:'smoke',x:20,y:20,r:2}];terrain.movingIds=['x'];
 R.captureRecoveryTargets(order,units);patient.hp=1;patient.states=[];patient.prone=false;other.x=23;
 const checked=R.attackContext(order,units,terrain);
 assert.equal(checked.units[0].hp,0);assert.deepEqual(checked.units[0].states,['unconscious']);assert.equal(patient.hp,1);assert.equal(checked.units[1],other);assert.equal(checked.units[1].x,23);assert.equal(checked.terrain.units,checked.units);assert.equal(checked.terrain.zones,terrain.zones);
 R.captureRecoveryTargets(order,units);assert.equal(order.recoveryTargets[0].hp,0);
});
test('non-restorative actions do not freeze unrelated state changes',()=>{const units=[u('a')],order={supports:[{kind:'reload',targetId:'a'}]};R.captureRecoveryTargets(order,units);assert.deepEqual(order.recoveryTargets,[]);assert.equal(R.attackContext(order,units,[]).units[0],units[0]);});
test('coordinated Trinity reduces B3 to leader B2 and member B1, while ARO keeps program B',()=>{
 const a=u('a',{hackingDevice:'KHD'}),b=u('b',{team:1,y:24,hackingDevice:'HD'}),m={kind:'hack',hackingProgram:'trinity'};
 assert.equal(F.attackSpec(a,b,m,[],{coordinated:true}).m.b,2);
 assert.equal(F.attackSpec(a,b,m,[],{coordinated:true,spearhead:false}).m.b,1);
 assert.equal(F.attackSpec({...a,reservedShots:1},b,m,[],{coordinated:true}).m.b,1);
 assert.equal(F.attackSpec(a,b,m,[],{reactive:true,coordinated:true}).m.b,H.spec(a,b,'trinity',{reactive:true}).m.b);
 assert.equal(F.attackSpec({...a,x:40},b,m,[],{coordinated:true}).can,false);
 assert.equal(F.attackSpec({...a,states:['stunned']},b,m,[],{coordinated:true}).can,false);
});
