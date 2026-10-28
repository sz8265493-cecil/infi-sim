import test from 'node:test';
import assert from 'node:assert/strict';
import * as K from '../dist/skills.js?v=122';
import * as F from '../dist/combat.js?v=122';
const unit=(id,team,extra={})=>({id,team,name:id,x:20,y:team?20:28,z:0,s:2,facing:team?90:-90,hp:3,maxhp:3,bs:12,wip:13,ph:10,arm:0,bts:0,loadout:['combi','cc'],states:[],...extra});
test('Hidden Deployment qualification is frozen before reveal, and not reused next order',()=>{
 const a=unit('a',0,{states:['hiddenDeployment'],surpriseAttack:3}),b=unit('b',1,{bs:11});
 const start=K.attackStart(a);K.reveal(a);assert.equal(start.startedMarker,true);assert.equal(K.attackStart(a).startedMarker,false);
 const args={active:a,attackPoint:a,mainTarget:b.id,weapon:'combi',modeId:'hit',path:[a],units:[a,b],terrain:[],reactions:{b:{id:'b',action:'attack',weapon:'combi',modeId:'hit',point:a,lof:true}},...start};
 assert.equal(F.preparePools(args,()=>.2).reactions.b.sv,11);
 assert.equal(F.preparePools({...args,...K.attackStart(a)},()=>.2).reactions.b.sv,14);
});
test('coordinated members retain separate hidden/marker and biometric source snapshots',()=>{
 const a=unit('a',0,{states:['hiddenDeployment']}),b=unit('b',0,{states:['holoecho']}),c=unit('c',0);
 const starts=Object.fromEntries([a,b,c].map(u=>[u.id,K.attackStart(u)]));[a,b,c].forEach(K.reveal);
 assert.deepEqual([starts.a.startedMarker,starts.b.startedMarker,starts.c.startedMarker],[true,true,false]);
 assert.equal(starts.a.surpriseSource,null);assert.equal(starts.b.surpriseSource,'holo');
 assert.equal(JSON.parse(JSON.stringify(starts)).a.startedMarker,true);
});
