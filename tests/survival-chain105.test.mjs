import test from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../dist/states.js?v=102';
import * as EX from '../dist/explode.js?v=79';
import * as V from '../dist/saves.js?v=75';
const unit=(id,team,x,y,extra={})=>({id,name:id,team,x,y,z:0,s:2,hp:1,maxhp:1,arm:0,bts:0,attribute:'VITA',states:[],nwi:true,dogged:true,shockImmune:true,explode:true,...extra});
test('Three simultaneous survival decisions suppress own explosions; later wound kills NWI without recursion',()=>{
 const left=unit('left',1,12,22),spear=unit('spear',0,32,28),source=unit('source',1,32,26),units=[left,spear,source];
 for(const u of units)S.apply(u,1);assert.equal(units.filter(u=>S.pendingSurvival(u).length).length,3);assert.deepEqual(EX.pending(units),[]);
 S.chooseSurvival(left,'nwi');S.chooseSurvival(spear,'nwi');assert.deepEqual(EX.pending(units),[]);S.chooseSurvival(source,null);assert.deepEqual(EX.pending(units).map(u=>u.id),['source']);
 const wave=EX.wave(units,[],{active:{dice:[]},reactions:{}},{circle:{diameter:4.7}});for(const p of V.allPlans(wave))if(p.pending.length)V.rollRound(p,()=>20);EX.applyWave(wave,units);
 assert.equal(S.onTable(spear),false);assert.equal(S.onTable(source),false);assert.equal(S.active(left),true);assert.deepEqual(EX.pending(units),[]);
});
test('Dogged expires in the current Player Turn and never activates Explode on direct removal',()=>{const u=unit('u',1,20,20);S.apply(u,1);S.chooseSurvival(u,'dogged');assert.equal(S.active(u),true);S.statesPhase([u]);assert.equal(S.onTable(u),false);assert.deepEqual(EX.pending([u]),[]);});
test('Remote Presence can choose survival on direct unconscious II, not on a later I to II wound',()=>{const u=unit('u',0,20,20,{attribute:'STR',remotePresence:true});S.apply(u,2);assert.equal(S.has(u,'unconscious2'),true);assert.deepEqual(S.pendingSurvival(u),['nwi','dogged']);S.chooseSurvival(u,'nwi');assert.equal(S.active(u),true);const v=unit('v',0,20,20,{attribute:'STR',remotePresence:true});S.apply(v,1);S.chooseSurvival(v,null);S.apply(v,1);assert.equal(S.has(v,'unconscious2'),true);assert.deepEqual(S.pendingSurvival(v),[]);});
