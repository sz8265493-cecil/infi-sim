import test from 'node:test';
import assert from 'node:assert/strict';
import * as F from '../dist/combat.js?v=36';
const unit=(id,team,x,extra={})=>({id,name:id,team,x,y:10,z:0,s:2,facing:team?180:0,hp:1,maxhp:1,states:[],wip:13,bs:12,ph:12,arm:0,bts:0,type:'LI',hackingDevice:'HD',hackingUpgrades:['zeroPain'],...extra});
const fixture=(activeSkill='attack',reaction='zeroPain',weapon='hack_carbonite')=>{const a=unit('a',0,10),b=unit('b',1,14);return {active:a,attackPoint:a,mainTarget:b.id,weapon,modeId:F.weaponMode(weapon).id,path:[a],reactions:{b:{id:'b',action:reaction,weapon:'hack_carbonite',modeId:'carbonite',point:a,lof:true}},units:[a,b],terrain:[],idle:activeSkill==='zeroPain',activeSkill,deferSaves:true};};
test('Zero Pain ARO shares two animated dice, imposes -3 and cancels incoming hacking with no counter-damage',()=>{
 const args=fixture(),pool=F.preparePools(args);assert.equal(pool.reactions.b.dice.length,2);assert.equal(pool.active.sv,10);assert.equal(pool.reactions.b.sv,13);
 pool.active.dice=[9,20];pool.reactions.b.dice=[10,20];const result=F.resolveOrder({...args,pools:pool});assert.equal(result.details[0].opposed,true);assert.deepEqual(result.details[0].ah,[]);assert.equal(result.details[0].outgoing.damage,0);
});
test('Zero Pain active roll opposes each hacking ARO, never BS attacks',()=>{
 const args=fixture('zeroPain','attack'),c=unit('c',1,16);
 args.units.push(c);args.reactions.c={id:'c',action:'attack',weapon:'combi',modeId:'hit',point:args.active,lof:true};
 const pool=F.preparePools(args);assert.equal(pool.active.dice.length,2);assert.equal(pool.reactions.b.sv,10);assert.equal(pool.reactions.c.sv,15);
 pool.active.dice=[11,20];pool.reactions.b.dice=[9];pool.reactions.c.dice=[9];const result=F.resolveOrder({...args,pools:pool});
 assert.deepEqual(result.details.find(d=>d.id==='b').bh,[]);assert.equal(result.details.find(d=>d.id==='b').opposed,true);assert.deepEqual(result.details.find(d=>d.id==='c').bh,[9]);assert.equal(result.details.find(d=>d.id==='c').opposed,false);
});
test('Zero Pain cannot defend against a normal BS attack or be used without equipped program',()=>{
 const args=fixture('attack','zeroPain','combi'),pool=F.preparePools(args);assert.equal(pool.active.sv,15);pool.active.dice=[9,20,20];pool.reactions.b.dice=[13,13];const result=F.resolveOrder({...args,pools:pool});assert.deepEqual(result.details[0].ah,[9]);assert.equal(result.details[0].opposed,false);
 args.units[1].hackingUpgrades=[];assert.throws(()=>F.preparePools(args),/零痛/);
});
test('Enhanced Reaction grants B2 in ARO only, hidden units may declare ARO and off-table/decoy/noARO cannot',()=>{
 const a=unit('a',0,10),b=unit('b',1,14,{aroBurst:2}),m=F.weaponMode('combi');assert.equal(F.attackSpec(b,a,m,[],{reactive:true}).m.b,2);assert.equal(F.attackSpec(b,a,m,[]).m.b,3);
 b.states=['hiddenDeployment'];assert.equal(F.eligibility(a,[a],[a,b],[]).length,1);assert.equal(F.attackSpec(b,a,m,[],{reactive:true}).can,true);
 for(const field of ['offTable','noARO','isDecoy'])assert.equal(F.eligibility(a,[a],[a,{...b,[field]:true}],[]).length,0);
 assert.equal(F.attackSpec(a,{...b,states:[],offTable:true},m,[]).can,false);
});
