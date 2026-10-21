import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import * as F from '../dist/combat.js';
import * as M from '../dist/movement.js';
const unit=(v={})=>({id:'a',s:2,x:17,y:23,z:0,team:0,hp:1,maxhp:1,states:[],cc:14,bs:11,ph:10,mov:4,mov2:4,facing:-90,loadout:['combi','cc'],weapon:'combi',...v});
for(const kind of ['smoke','eclipse','whiteNoise'])test(`${kind}: CC, ARO and contact sight ignore visibility conditions but distant fire does not`,()=>{
 const a=unit({msv:kind==='whiteNoise'?1:0}),b=unit({id:'b',team:1,y:23-25/25.4,facing:-90,msv:kind==='whiteNoise'?1:0});
 const terrain=[];terrain.zones=[{x:17,y:22,r:3,z:0,kind}];
 assert.equal(E.inContact(a,b,terrain),true);assert.equal(F.canSee(b,a,terrain),true);
 for(const reactive of [false,true]){const spec=F.attackSpec(a,b,F.weaponMode('cc'),terrain,{reactive,respondingAttack:reactive});assert.equal(spec.can,true);assert.equal(spec.sv,14);assert.equal(spec.mods.some(m=>m[0]==='能见度区域'),false);}
 const distant={...b,y:19};assert.equal(F.attackSpec(a,distant,F.weaponMode('combi'),terrain).can,false);
 assert.equal(F.eligibility(a,[a],[a,b],terrain)[0].lof,true);
 assert.equal(F.declarationPoints(b,a,[a],terrain,'cc','cc').length,1);
});
test('a solid wall cannot create close combat even if centers are less than a base apart',()=>{
 const a=unit({x:10,y:10}),b=unit({id:'b',team:1,x:10.99,y:10});
 const wall=[{x:10.49,y:9,w:.01,h:2,height:4}];
 assert.equal(E.inContact(a,b,wall),false);assert.equal(F.attackSpec(a,b,F.weaponMode('cc'),wall).can,false);
});
function passage(gap=12.5/25.4){return [{id:'l',kind:'building',x:13,y:20,w:4-gap/2,h:2,height:4},{id:'r',kind:'building',x:17+gap/2,y:20,w:4,h:2,height:4}];}
test('draft waypoint inside exact 12.5mm corridor can extend to a full-base endpoint',()=>{
 const a=unit(),terrain=passage(),o={moveKind:'move',path:[a],cost:0};
 const snap=M.snapPassage(a,{x:17.12,y:21.4,z:0},terrain);assert.ok(Math.abs(snap.x-17)<1e-8);
 const first=M.nearestReachable(a,o,snap,[a],terrain,{finish:false});assert.equal(first.error,'');assert.equal(first.end.y,21.4);
 assert.match(M.validate(a,{...o,...first},[a],terrain),/重叠/);
 const exit=M.snapPassage(a,{x:16.985,y:19.3,z:0},terrain);assert.equal(exit.x,17);const second=M.nearestReachable(a,{...o,...first},exit,[a],terrain,{finish:false});assert.equal(second.error,'');assert.equal(M.validate(a,{...o,...second},[a],terrain),'');assert.ok(Math.abs(second.cost-3.7)<1e-8);
});
test('too-small corridors, enemies and single solid corners still block transit',()=>{
 const a=unit(),path=[a,{x:17,y:19.3,z:0}];
 assert.notEqual(E.validPath(a,path,[a],passage(12/25.4),4),'');
 const b=unit({id:'b',team:1,x:17,y:21});assert.notEqual(E.validPath(a,path,[a,b],passage(),4),'');
 assert.notEqual(E.validPath(unit({x:4.7,y:1}),[{x:4.7,y:1},{x:4.7,y:3}],[a],[{x:5,y:2,w:7,h:6,height:4}],4,false),'');
});
