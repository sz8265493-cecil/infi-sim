import test from 'node:test';
import assert from 'node:assert/strict';
import * as FT from '../dist/fireteams.js';
const model=(id,x,y=20)=>({id,name:id,team:0,s:2,x,y,z:0,hp:1,maxhp:1,states:[],ftManaged:true,slug:'test'});
const state=()=>({units:[model('a',20),model('b',26),model('c',27)],fireteams:[{id:'f',label:'CORE',type:'CORE',leaderId:'a',members:['a','b','c'],assignments:{}}]});
test('only an end check removes an out-of-zone moving member; returning retains membership',()=>{
 const s=state(),f=s.fireteams[0];FT.sync(s);s.units[2].x=31;FT.sync(s);assert.equal(f.members.length,3);s.units[2].x=27;FT.conclude(s);assert.equal(f.members.length,3);
 s.units[2].x=31;FT.conclude(s);assert.deepEqual(f.members,['a','b']);assert.equal(f.type,'CORE');
});
test('Number 2 replacement precedes final coherency check against the new leader',()=>{
 const s=state(),f=s.fireteams[0];s.units[1].number2=true;s.units[0].hp=0;s.units[0].states=['unconscious'];s.units[2].x=33;
 const events=FT.conclude(s);assert.equal(f.leaderId,null);assert.ok(FT.pendingSuccession(s));events.push(...FT.chooseSuccessor(s,'b'),...FT.conclude(s));assert.equal(f.leaderId,'b');assert.deepEqual(f.members,['b','c']);assert.ok(!f.cancelled);assert.ok(events.some(e=>e.includes('Number 2')));
});
test('null leader without Number 2 cancels bonuses while null nonleader only leaves',()=>{
 const s=state();FT.sync(s);s.units[2].hp=0;s.units[2].states=['unconscious'];FT.sync(s);assert.deepEqual(s.fireteams[0].members,['a','b']);assert.equal(s.units[2].ftLevel,0);
 s.units[0].hp=0;s.units[0].states=['unconscious'];FT.sync(s);assert.equal(s.fireteams[0].cancelled,true);assert.ok(s.units.every(u=>u.ftLevel===0));
});

test('Number 2 is optional and either eligible candidate can be selected',()=>{
 const s=state();s.units[1].number2=true;s.units[2].number2=true;s.units[0].hp=0;s.units[0].states=['unconscious'];FT.sync(s);
 assert.deepEqual(FT.pendingSuccession(s).candidates.map(u=>u.id),['b','c']);assert.throws(()=>FT.chooseSuccessor(s,'a'));FT.chooseSuccessor(s,'c');assert.equal(s.fireteams[0].leaderId,'c');assert.equal(FT.pendingSuccession(s),null);
 const t=state();t.units[1].number2=true;t.units[0].hp=0;t.units[0].states=['unconscious'];FT.sync(t);FT.chooseSuccessor(t,'decline');assert.ok(t.fireteams[0].cancelled);assert.ok(t.units.every(u=>!u.ftLevel));
});
test('simultaneously unconscious Number 2 cannot succeed the leader',()=>{
 const s=state();for(const u of s.units.slice(0,2)){u.hp=0;u.states=['unconscious'];}s.units[1].number2=true;FT.sync(s);assert.equal(FT.pendingSuccession(s),null);assert.ok(s.fireteams[0].cancelled);
});
