import test from 'node:test';import assert from 'node:assert/strict';
import * as E from '../dist/engine.js?v=122';import * as F from '../dist/combat.js?v=122';import * as M from '../dist/terrain-rules.js?v=122';import {LESSONS} from '../dist/lessons.js?v=122';
const unit=(id,team,extra={})=>({id,team,name:id,s:2,x:20,y:team?20:28,z:4,facing:team?90:-90,bs:12,ph:12,hp:5,maxhp:5,states:[],...extra});
for(const id of ['smokeDeck117','smokeOpening117','eclipseDeck117','eclipseOpening117'])test(id+' applies the same floor geometry to visibility and modifiers',()=>{const l=LESSONS[id],t=structuredClone(l.terrain);t.zones=l.zones;const a=unit('a',0,{msv:1}),b=unit('b',1);const sp=F.attackSpec(a,b,F.weaponMode('combi','hit'),t);assert.equal(sp.can,id!=='eclipseOpening117');if(sp.can)assert.equal(sp.sv,id==='smokeOpening117'?9:15);});
test('saturation reduces each allocated burst after 2+2, preserves SD and does not stack',()=>{
 const a=unit('a',0,{z:0,y:30,weapon:'hmg',loadout:['hmg'],bsSpecialDice:1}),b=unit('b',1,{z:0}),c=unit('c',1,{z:0,x:25}),terrain=[];terrain.areas=LESSONS.terrainStack117.terrainAreas;
 const args={active:a,attackPoint:a,mainTarget:'b',units:[a,b,c],terrain,weapon:'hmg',modeId:'hit',path:[a],reactions:{},allocations:[{targetId:'b',burst:2},{targetId:'c',burst:2}],sdTargets:['c']};
 assert.equal(F.burstLimit(a,b,F.weaponMode('hmg','hit'),terrain,'hmg'),4);
 const p=F.preparePools(args,()=>.2);assert.deepEqual(F.activePools(p).map(p=>p.dice.length),[1,2]);assert.equal(F.activePools(p)[0].sv,6);
 assert.equal(F.attackSpec(a,b,F.weaponMode('hmg','hit'),terrain,{reactive:true}).m.b,1);
 assert.equal(M.modifier({...a,terrainAreas:terrain.areas}),-1);
 assert.equal(M.modifier({...a,terrainTypes:['Jungle'],terrainAreas:terrain.areas}),1);
});
