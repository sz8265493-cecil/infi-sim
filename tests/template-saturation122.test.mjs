import test from 'node:test';
import assert from 'node:assert/strict';
import * as F from '../dist/combat.js?v=122';
import * as VO from '../dist/volley.js';
import * as V from '../dist/saves.js?v=122';
import templates from '../dist/templates.json' with {type:'json'};
const unit=(id,team,extra={})=>({id,name:id,team,x:20,y:team?25:30,z:0,s:2,facing:team?90:-90,bs:12,ph:12,wip:13,hp:5,maxhp:5,arm:0,bts:0,states:[],loadout:['lightFlame','missile','combi'],...extra});
function setup({weapon='lightFlame',bonus=1,sd=0}={}){
 const a=unit('a',0,{bsBurstBonus:bonus,bsSpecialDice:sd}),b=unit('b',1),c=unit('c',1,{x:24});
 const terrain=[];terrain.areas=[{x:15,y:24,w:15,h:3,saturation:true}];
 const modeId=weapon==='lightFlame'?'template':'blast';
 return {active:a,attackPoint:a,mainTarget:b.id,weapon,modeId,activeSkill:'attack',path:[a],units:[a,b,c],terrain,templates,reactions:{},declarations:[{actorId:'a',targetId:'b',weapon,modeId,origin:a,path:[a],shots:[{targetId:'b'},{targetId:'b'}]}]};
}
test('two explicitly aimed direct templates into saturation become one hit per affected target',()=>{
 const x=setup(),groups=VO.groups(x);assert.equal(groups.filter(g=>!g.idle).length,1);
 const p=VO.prepare(x,()=>.2),r=VO.resolve({...x,pools:p,deferSaves:true});
 assert.equal(V.allPlans(r).filter(p=>p.targetId==='b').reduce((n,p)=>n+p.hits,0),1);
 assert.ok(r.volleyNotices.some(s=>s.includes('饱和')));
});
test('saturation applies after allocation: B2 split 1+1 retains both direct templates',()=>{
 const x=setup();x.declarations[0].shots[1].targetId='c';
 assert.equal(VO.groups(x).filter(g=>!g.idle).length,2);
});
test('impact template saturation keeps the target SD when the original SD shot is removed',()=>{
 const x=setup({weapon:'missile',sd:1});x.declarations[0].sdShot=1;
 const p=VO.prepare(x,()=>.2),pools=Object.values(p.activeTargets);
 assert.deepEqual(pools.map(p=>p.dice.length),[2,0]);assert.deepEqual(pools.map(p=>p.sd),[1,0]);
 pools[0].discard=1;const r=VO.resolve({...x,pools:p,deferSaves:true});
 assert.equal(V.allPlans(r).filter(p=>p.targetId==='b').reduce((n,p)=>n+p.hits,0),1);
});
test('an explicit saturation discard chooses the retained template without moving the SD to another target',()=>{
 const x=setup({weapon:'missile',bonus:2,sd:1});x.declarations[0].shots.push({targetId:'c'});x.declarations[0].saturationDiscard={b:0};
 const p=VO.prepare(x,()=>.2);assert.deepEqual(Object.values(p.activeTargets).map(p=>p.dice.length),[0,2,1]);
});
test('a shared successful Dodge still evades all surviving direct templates',()=>{
 const x=setup();x.reactions.b={id:'b',action:'dodge',lof:true};
 const p=VO.prepare(x,()=>.2),r=VO.resolve({...x,pools:p,deferSaves:true});
 assert.equal(V.allPlans(r).some(p=>p.targetId==='b'),false);assert.ok(r.dodgers.includes('b'));
});
