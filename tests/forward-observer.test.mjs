import test from 'node:test';
import assert from 'node:assert/strict';
import * as F from '../dist/combat.js';
const u=extra=>({id:'a',name:'观察员',team:0,x:10,y:10,z:0,s:2,hp:1,maxhp:1,attribute:'VITA',bs:11,wip:13,ph:10,arm:0,facing:0,states:[],loadout:['combi'],...extra});
const setup=()=>{const a=u({forwardObserver:true}),b=u({id:'b',team:1,x:15,facing:180});return {a,b,args:{active:a,attackPoint:a,mainTarget:'b',weapon:'forwardObserver',modeId:'mark',path:[a],reactions:{},units:[a,b],terrain:[]}};};
test('Forward Observer appears only with the skill, including forged loadout rejection',()=>{
 assert.ok(F.availableWeapons(u({forwardObserver:true})).includes('forwardObserver'));
 assert.ok(!F.availableWeapons(u({loadout:['forwardObserver']})).includes('forwardObserver'));
 const {b}=setup();assert.equal(F.attackSpec(u(),b,F.weaponMode('forwardObserver'),[]).can,false);
});
test('Forward Observer uses WIP and B2 active / B1 reactive',()=>{
 const {a,b}=setup(),m=F.weaponMode('forwardObserver');
 assert.equal(F.attackSpec(a,b,m,[]).base,13);assert.equal(F.attackSpec(a,b,m,[]).m.b,2);
 assert.equal(F.attackSpec(a,b,m,[],{reactive:true}).m.b,1);
});
test('successful observation hits apply Targeted without save stage, including critical',()=>{
 const {args}=setup();args.pools={active:{sv:13,dice:[13,20],discard:null},reactions:{}};
 const r=F.resolveOrder({...args,deferSaves:true},()=>{throw Error('No saves should be rolled');});
 assert.equal(r.losses.b,0);assert.deepEqual(r.effects.b,['targeted']);
 assert.equal(r.details[0].incoming.initialCount,0);assert.deepEqual(r.details[0].incoming.pending,[]);
});
test('Dodge opposes observation while Reset does not',()=>{
 const {args}=setup();
 args.reactions={b:{action:'dodge',lof:true}};
 args.pools={active:{sv:13,dice:[4,20]},reactions:{b:{sv:10,activeSV:13,dice:[8]}}};
 assert.deepEqual(F.resolveOrder(args).effects.b,[]);
 args.reactions.b.action='reset';assert.deepEqual(F.resolveOrder(args).effects.b,['targeted']);
});
test('observation ARO enters normal combat pipeline and targets active unit',()=>{
 const {a,b,args}=setup();b.forwardObserver=true;
 args.weapon='combi';args.modeId='hit';args.idle=true;
 args.reactions={b:{id:'b',action:'attack',weapon:'forwardObserver',modeId:'mark',point:a,lof:true}};
 args.pools={active:{sv:0,dice:[]},reactions:{b:{sv:13,activeSV:0,dice:[7]}}};
 const r=F.resolveOrder({...args,deferSaves:true});assert.deepEqual(r.effects.a,['targeted']);assert.equal(r.losses.a,0);
});
test('weapon +1 SD adds one die to pool with discard, not another damage hit',()=>{
 const {args}=setup();F.ARMS.sdTest={name:'测试导弹',modes:[{...F.weaponMode('combi'),id:'hit',b:1,sd:1}]};
 args.active.loadout=['sdTest'];args.weapon='sdTest';args.modeId='hit';
 const p=F.preparePools(args,()=>.2);assert.equal(p.active.dice.length,2);assert.equal(p.active.sd,1);
 p.active.discard=0;assert.equal(F.kept(p.active).length,1);
 assert.equal(F.specialDice(args.active,F.weaponMode('sdTest'),{longSkill:true}),0);
 delete F.ARMS.sdTest;
});
