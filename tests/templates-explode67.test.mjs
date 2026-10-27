import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js?v=117';
import * as F from '../dist/combat.js?v=117';
import * as S from '../dist/states.js?v=102';
import * as X from '../dist/explode.js?v=79';
import * as V from '../dist/saves.js?v=75';
const u=(id,x,team=0,more={})=>({id,name:id,x,y:20,z:0,s:2,team,hp:1,maxhp:1,attribute:'STR',arm:0,states:[],explode:true,ph:12,...more});
const pools={active:{id:'shooter',dice:[],sv:0},reactions:{}};
test('circular volume includes vertical contact, rejects outside height, blocks solid scenery',()=>{
 const shape={kind:'circle',origin:{x:20,y:20,z:0},r:2.35};
 assert.ok(E.templateHits(shape,u('t',21,1,{z:2}),[]));
 assert.equal(E.templateHits(shape,u('t',21,1,{z:2.36}),[]),false);
 assert.equal(E.templateHits(shape,u('t',21,1,{z:2}),[{x:20.2,y:19,w:2,h:2,height:2}]),false);
 assert.ok(E.templateHits({...shape,origin:{x:20,y:20,z:4}},u('t',21,1,{z:2}),[]));
});
test('pitched teardrop reaches rooftop but cannot pass through a taller wall',()=>{
 const a=u('a',20,0,{y:29}),b=u('b',20,1,{y:23.5,z:4}),shape=F.makeTemplate(a,b,{template:'large'},{large:{length:10.2,width:4.7}}),roof={x:18,y:20,w:4,h:4,height:4};
 assert.ok(shape.pitch>0);assert.ok(E.templateHits(shape,b,[roof]));
 assert.equal(E.templateHits(shape,b,[roof,{x:18,y:25,w:4,h:.3,height:8}]),false);
});
test('Explode chains use PS7 Shock, remove sources after each simultaneous wave',()=>{
 const a=u('a',20),b=u('b',22,1),c=u('c',24,0,{hp:2,maxhp:2,explode:false}),units=[a,b,c];S.apply(a,1);let r=X.wave(units,[],pools);assert.equal(r.extraPlans.length,1);assert.equal(r.extraPlans[0].ammo,'SHOCK');V.finishSaves(r.extraPlans[0],()=>20);X.applyWave(r,units);assert.ok(S.has(a,'dead'));assert.ok(S.unconscious(b));assert.deepEqual(X.pending(units).map(u=>u.id),['b']);r=X.wave(units,[],pools);V.finishSaves(r.extraPlans[0],()=>20);X.applyWave(r,units);assert.ok(S.has(b,'dead'));assert.equal(c.hp,1);assert.equal(X.pending(units).length,0);
});
test('friend cancels damage but Explode source is removed, no saves',()=>{
 const a=u('a',20),friend=u('f',21),enemy=u('e',22,1),units=[a,friend,enemy];S.apply(a,1);const r=X.wave(units,[],pools);assert.ok(r.explodeChecks[0].cancelled);assert.equal(r.extraPlans.length,0);X.applyWave(r,units);assert.ok(S.has(a,'dead'));assert.equal(enemy.hp,1);
});
test('direct death, existing unconscious and chosen survival never trigger Explode',()=>{
 const dead=u('d',20);S.apply(dead,2);assert.equal(X.pending([dead]).length,0);
 const shock=u('s',20,0,{attribute:'VITA'});S.apply(shock,1,['shock']);assert.equal(X.pending([shock]).length,0);
 const old=u('o',20,0,{hp:0,states:['unconscious']});S.apply(old,0);assert.equal(X.pending([old]).length,0);
 for(const skill of ['dogged','nwi']){const n=u('n',20,0,{[skill]:true});S.apply(n,1);assert.equal(X.pending([n]).length,0);S.chooseSurvival(n,skill);assert.equal(X.pending([n]).length,0);}
});
test('successful existing Dodge PH die avoids Explode even if it lost an earlier face to face',()=>{
 const a=u('a',20),b=u('b',22,1,{hp:3,maxhp:3});S.apply(a,1);const r=X.wave([a,b],[],{...pools,reactions:{b:{id:'b',skill:'dodge',dice:[7],sv:12}}});assert.equal(r.extraPlans[0].hits,0);assert.equal(r.extraPlans[0].initialCount,0);
});
test('Shock removes one-Wound target and stops the chain; STR can enter unconscious',()=>{
 const a=u('a',20),b=u('b',22,1,{attribute:'VITA'});S.apply(a,1);const r=X.wave([a,b],[],pools);V.finishSaves(r.extraPlans[0],()=>20);X.applyWave(r,[a,b]);assert.ok(S.has(b,'dead'));assert.equal(X.pending([b]).length,0);
});

test('same horizontal placement: 1.5 inch platform exposes silhouette, 2 inch platform blocks it',()=>{
 const sh={kind:'circle',origin:{x:21.3,y:24,z:0},r:2.35},platform={x:22,y:21.5,w:2,h:2,height:1.5},target=u('t',22.5,1,{y:23,z:1.5});
 assert.ok(E.templateHits(sh,target,[platform]));assert.equal(E.templateHits(sh,{...target,z:2},[{...platform,height:2}]),false);
});
test('circular blast is blocked by roof slab when descending into a building',()=>{
 const sh={kind:'circle',origin:{x:20,y:20,z:4},r:2.35};
 assert.equal(E.templateHits(sh,u('t',20,1,{z:2}),[{x:19,y:19,w:2,h:2,height:4}]),false);
});
test('sphere tangent directly above an off-center point inside the base counts as contact',()=>{
 assert.ok(E.templateHits({kind:'circle',origin:{x:20.2,y:20,z:0},r:2.35},u('t',20,1,{z:2.35}),[]));
});
