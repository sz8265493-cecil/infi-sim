import test from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../dist/guts.js?v=118';
import * as V from '../dist/saves.js?v=75';
const unit={id:'target',name:'target',team:0,x:20,y:28,z:0,s:2,hp:3,maxhp:3,wip:13,bts:0,arm:0,states:['stunned']};
const queue=(ammo,die)=>{const p=V.planSaves(unit,[8],13,{kind:'bs',ammo,ps:7},false);V.rollRound(p,()=>die);return G.queue({details:[],extraPlans:[p]},[unit])[0];};
test('existing Stunned modifies the Guts WIP roll but normal ammo does not force failure',()=>{assert.equal(G.successValue(unit),10);assert.equal(G.successValue({...unit,states:[]}),13);const g=queue('N',1);assert.equal(g.failedStun,false);assert.equal(G.autoFail(unit,g),false);});
test('only this Order failed Stun save forces Guts, with Courage and Religious exceptions',()=>{const pass=queue('STUN',1),fail=queue('STUN',20);assert.equal(G.autoFail(unit,pass),false);assert.equal(G.autoFail(unit,fail),true);assert.equal(G.autoFail({...unit,courage:true},fail),false);assert.equal(G.autoFail({...unit,religious:true},fail),false);});
