import test from 'node:test';
import assert from 'node:assert/strict';
import * as EX from '../dist/explode.js?v=122';
import * as PER from '../dist/peripherals.js?v=122';
import * as V from '../dist/saves.js?v=122';
import * as S from '../dist/states.js?v=122';

const unit=(id,team,x,y,extra={})=>({id,name:id,team,x,y,z:0,s:2,hp:1,maxhp:1,states:[],arm:0,bts:0,attribute:'VITA',...extra});
function fixture(immune){const c=unit('c',0,12,32,{controlSpearheadId:'b'}),a=unit('a',0,24,24,{controllerId:'c',peripheral:'control'}),b=unit('b',0,30,24,{controllerId:'c',peripheral:'control',explode:true,shockImmune:true}),first=unit('first',1,30,22,{explode:true,hp:0,states:['unconscious'],pendingExplode:true}),last=unit('last',1,32.5,24,{explode:true,shockImmune:immune});return {c,a,b,first,last,units:[c,a,b,first,last]};}
function resolve(units){const r=EX.wave(units,[],{active:{dice:[]},reactions:{}},{circle:{diameter:4.7}});for(const p of V.allPlans(r))if(p.pending.length)V.rollRound(p,()=>20);EX.applyWave(r,units);return r;}
for(const immune of [false,true])test(`Control replacement after secondary damage; final Shock immunity ${immune}`,()=>{const {c,a,b,last,units}=fixture(immune);resolve(units);assert.equal(S.unconscious(b),true);assert.deepEqual(PER.pendingSpearhead(units).candidates.map(v=>v.id),['a']);assert.deepEqual(EX.pending(units).map(v=>v.id),['b']);assert.equal(PER.select(c,units,'control',a.id),true);resolve(units);assert.equal(c.controlSpearheadId,'a');assert.equal(PER.pendingSpearhead(units),null);if(immune){assert.equal(S.unconscious(last),true);assert.deepEqual(EX.pending(units).map(v=>v.id),['last']);const r=resolve(units);assert.equal(V.allPlans(r).length,0);}else{assert.equal(S.onTable(last),false);assert.deepEqual(EX.pending(units),[]);}assert.deepEqual(EX.pending(units),[]);});
