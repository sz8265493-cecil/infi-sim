import test from 'node:test';
import assert from 'node:assert/strict';
import * as J from '../dist/joint-movement.js';
import * as M from '../dist/movement.js';
import * as CO from '../dist/coordinated.js';
test('ordinary jump/climb participant chooses whole order or idle, neither gains the special skill',()=>{
 assert.deepEqual(J.choices({},'superjump'),['jump','idle']);assert.deepEqual(J.choices({},'climbplus'),['climb','idle']);
 assert.deepEqual(J.choices({superJump:true},'jump'),['superjump','superlong','idle']);
});
test('whole-order members have no second action while idle and special movement members retain it',()=>{
 const o={memberFirst:{a:'superjump',b:'jump',c:'idle',d:'climb'}};
 assert.equal(J.secondAllowed(o,'b'),false);assert.equal(J.secondAllowed(o,'c'),true);assert.equal(J.hasSecond(o,['b','d']),false);
 assert.deepEqual(J.choices({},'move',{second:true,spent:true}),['idle']);
});
test('Move after short Climb uses MOV2, Move after Idle uses MOV1',()=>{
 const u={mov:4,mov2:2};assert.equal(M.budget(u,{moveKind:'move',firstKind:'climbplus',secondMove:true}),2);assert.equal(M.budget(u,{moveKind:'move',firstKind:'idle',secondMove:true}),4);
});
test('Hidden/Airborne coordinated eligibility preserves same group restriction',()=>{
 const u={id:'a',team:0,hp:1,states:[],combatGroup:1},s={team:0,units:[u]};
 assert.equal(CO.memberReason(s,{...u,states:['hiddenDeployment']},u),'');assert.equal(CO.memberReason(s,{...u,offTable:true,combatJump:true},u),'');assert.match(CO.memberReason(s,{...u,offTable:true,combatJump:true,combatGroup:2},u),/同一战斗组/);
});

test('whole-order member has zero second Move budget even when selected as leader',()=>{
 assert.equal(M.budget({mov:4,mov2:4,wholeOrderSpent:true},{moveKind:'move',firstKind:'jump',secondMove:true}),0);
});
