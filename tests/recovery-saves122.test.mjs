import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../dist/recovery-resolution.js';
import * as V from '../dist/saves.js';
import * as S from '../dist/states.js?v=122';
import * as U from '../dist/support-actions.js';
const patient=()=>({id:'p',name:'Patient',team:0,x:20,y:20,z:0,s:2,facing:90,hp:0,maxhp:1,states:['unconscious'],prone:true,attribute:'VITA',type:'LI',arm:0,bts:0,wip:13,ph:10});
function restored(){const p=patient(),units=[p],order={supports:[{kind:'doctor',targetId:'p'}]};R.captureRecoveryTargets(order,units);const doctor={...p,id:'d',hp:1,states:[],doctor:true};Object.assign(p,U.resolve(doctor,p,'doctor','heal',{die:1,measure:false}).target);return {p,frozen:R.attackContext(order,units,[]).units[0]};}
test('recovery keeps frozen attack silhouette but continuous damage uses restored vitality',()=>{
 const {p,frozen}=restored();assert.equal(frozen.hp,0);assert.equal(p.hp,1);
 const plan=V.planSaves(frozen,[5],12,{ammo:'N',ps:7,continuous:true},false);
 V.rollRound(plan,()=>20);assert.equal(plan.damage,1);assert.equal(plan.pending.length,1);
 V.rollRound(plan,()=>20);assert.equal(plan.damage,2);assert.equal(plan.pending.length,0);
 S.apply(p,plan.damage,plan.effects);assert.ok(S.has(p,'dead'));
});
test('monofilament still removes a target that was restored earlier in the same order',()=>{
 const {p,frozen}=restored(),plan=V.planSaves(frozen,[5],12,{ammo:'MONO',ps:8},false);
 V.rollRound(plan,()=>20);S.apply(p,plan.damage,plan.effects);assert.ok(S.has(p,'dead'));
});
test('combined continuous plans use healed vitality when deciding whether another save is needed',()=>{
 const {p,frozen}=restored();p.maxhp=2;p.hp=2;
 const order={recoveryTargets:[frozen]},target=R.attackContext(order,[p],[]).units[0];
 const plans=[0,1].map(()=>V.planSaves(target,[5],12,{ammo:'N',ps:7,continuous:true},false));
 plans.forEach(plan=>V.rollRound(plan,()=>20));V.aggregate({details:[],extraPlans:plans});
 assert.equal(plans.reduce((n,p)=>n+p.pending.length,0),2);
});
test('a saved mid-continuous result resumes without nesting snapshots or applying healing twice',()=>{
 const {p,frozen}=restored(),plan=V.planSaves(frozen,[5],12,{ammo:'N',ps:7,continuous:true},false);
 V.rollRound(plan,()=>20);
 const state=JSON.parse(JSON.stringify({units:[p],order:{recoveryTargets:[patient()],skillsApplied:true,supportPrepared:true,pendingBattle:{result:{details:[],extraPlans:[plan]}}}}));
 const hpBefore=state.units[0].hp,snapshotBefore=JSON.stringify(state.order.recoveryTargets);
 for(let i=0;i<3;i++){R.captureRecoveryTargets(state.order,state.units);const ctx=R.attackContext(state.order,state.units,[]);assert.equal(ctx.units[0].savingTarget.hp,hpBefore);assert.equal(ctx.units[0].savingTarget.savingTarget,undefined);}
 assert.equal(JSON.stringify(state.order.recoveryTargets),snapshotBefore);
 const savedPlan=state.order.pendingBattle.result.extraPlans[0];assert.equal(savedPlan.target.savingTarget,undefined);assert.equal(savedPlan.pending.length,1);
 V.rollRound(savedPlan,()=>1);const result=V.aggregate(state.order.pendingBattle.result);
 assert.equal(state.units[0].hp,1);S.apply(state.units[0],result.losses.p,result.effects.p);
 assert.equal(state.units[0].hp,0);assert.ok(S.has(state.units[0],'unconscious'));assert.equal(savedPlan.saves.length,2);
});
