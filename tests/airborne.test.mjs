import test from 'node:test';
import assert from 'node:assert/strict';
import * as A from '../dist/airborne.js';
import * as M from '../dist/movement.js';
const u=extra=>({id:'jump',team:0,x:5,y:40,z:0,s:2,hp:1,maxhp:1,ph:12,states:[],offTable:true,combatJump:true,parachutist:true,...extra});
const p={x:24,y:24,z:0};
test('airborne is active-only and spends a personal order',()=>{
 assert.equal(A.availableActions(u()).length,2);assert.equal(A.availableActions(u(),{reactive:true}).length,0);
 assert.equal(A.availableActions(u({offTable:false})).length,0);
 const r=A.resolve(u(),p,'combatJump',{die:1});assert.equal(r.unit.airborneOrderAvailable,false);assert.equal(r.unit.offTable,false);assert.equal(r.unit.noCover,true);assert.equal(r.declareARO,true);
});
test('failed jump waits for chosen own deployment edge and PH override applies',()=>{
 const a=u({combatJumpPH:14});
 assert.equal(A.resolve(a,p,'combatJump',{die:14}).success,true);
 assert.equal(A.resolve(a,p,'combatJump',{die:15}).fallbackPending,true);
 assert.equal(A.resolve(a,p,'combatJump',{die:15,fallback:{x:24,y:40}}).applied,false);
 const r=A.resolve(a,p,'combatJump',{die:15,fallback:{x:25/25.4/2,y:40}});
 assert.equal(r.applied,true);assert.equal(r.removeAccompanyingDeployables,true);
});
test('parachutist edge, enemy deployment restriction, no PH roll',()=>{
 const a=u(),edge={x:25/25.4/2,y:24};
 assert.equal(A.resolve(a,edge,'parachutist').applied,true);
 assert.equal(A.validateLanding(a,{...edge,y:5},'parachutist').can,false);
 assert.equal(A.validateLanding(u({parachutistDZ:true}),{...edge,y:5},'parachutist').can,true);
 assert.equal(A.validateLanding(a,p,'parachutist').can,false);
});
test('landing prohibits contact, prone, enclosed room and smoke',()=>{
 const a=u();assert.equal(A.validateLanding(a,{...p,prone:true},'combatJump').can,false);
 assert.equal(A.validateLanding(a,p,'combatJump',{units:[u({id:'e',team:1,offTable:false,x:25,y:24})]}).can,false);
 assert.equal(A.validateLanding(a,p,'combatJump',{terrain:[{x:20,y:20,w:8,h:8,height:0,enclosed:true}]}).can,false);
 const terrain=[];terrain.zones=[{...p,r:2.34,kind:'smoke'}];
 assert.equal(A.validateLanding(a,p,'combatJump',{terrain}).can,false);
});
test('explosion excludes self, hits circle, cancels if friendly touched, single use',()=>{
 const a=u({offTable:false,...p,combatJumpExplosion:true}),enemy=u({id:'e',team:1,offTable:false,x:26,y:24});
 const b=A.explosion(a,[a,enemy]);assert.deepEqual(b.hits,['e']);assert.equal(b.ps,8);
 assert.equal(A.explosion(a,[{...enemy,team:0}]).cancelledFriendly,true);
 assert.equal(A.explosion({...a,combatJumpExplosionUsed:true},[enemy]),null);
});
test('Jet Propulsion changes direction in mid-air and still charges full trajectory',()=>{
 const a=u({offTable:false,x:10,y:10,superJump:true,jetPropulsion:true});
 const path=[{x:10,y:10,z:0},{x:12,y:10,z:2},{x:10,y:10,z:0}];
 assert.equal(M.jetJumpPath(a,path,[],[],6).error,undefined);
 assert.ok(M.jetJumpPath(a,path,[],[],5).error);
 assert.ok(M.jetJumpPath({...a,jetPropulsion:false},path,[],[],6).error);
});
