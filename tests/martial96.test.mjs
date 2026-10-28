import test from 'node:test';import assert from 'node:assert/strict';
import * as F from '../dist/combat.js?v=122';import * as K from '../dist/skills.js?v=122';
const a={id:'a',name:'a',team:0,x:20,y:20,s:2,cc:20,hp:3,states:[],facing:0},b={...a,id:'b',team:1,x:20+25/25.4,facing:180};
test('Martial Arts levels 4/5 retain their burst in ARO, profile +B does not',()=>{
 const m=F.weaponMode('cc','cc');
 for(const level of [0,1,2,3,4,5]){const u={...b,martialArts:level,ccBurstBonus:1};
 assert.equal(F.attackSpec(u,a,m,[],{reactive:true}).m.b,level>=4?2:1);
 assert.equal(F.attackSpec(u,a,m,[]).m.b,level>=4?3:2);
 assert.equal(K.specialDice(u,m),[3,5].includes(level)?1:0);}
});
test('Fireteam CC support gives B3 while reactive MA5 supplies B2 plus one discard',()=>{
 const leader={...a,ftLevel:3,ccSupport:2,loadout:['cc']},enemy={...b,martialArts:5,loadout:['cc']};
 const x={active:leader,attackPoint:leader,path:[leader],mainTarget:'b',weapon:'cc',modeId:'cc',activeSkill:'attack',reactions:{b:{id:'b',action:'attack',weapon:'cc',modeId:'cc',point:leader,targetId:'a',lof:true}},units:[leader,enemy],terrain:[]};
 const p=F.preparePools(x);assert.equal(p.active.dice.length,3);assert.equal(p.active.sd,0);assert.equal(p.reactions.b.dice.length,3);assert.equal(p.reactions.b.sd,1);
});
