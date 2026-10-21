import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ARMY_EXAMPLES} from '../dist/army-examples.js';
import {decodeArmyCode,encodeArmyCode} from '../dist/army-code.js';
import {previewArmy,registerWeapons} from '../dist/army-import.js';
import * as F from '../dist/combat.js?v=36';
import * as O from '../dist/orders.js';
import * as P from '../dist/pregame.js';
const previews=ARMY_EXAMPLES.map(e=>previewArmy(e.code,JSON.parse(fs.readFileSync(new URL(`../dist/assets/army-${e.factionId===201?'yujing':'103'}.json`,import.meta.url)))));
const triples=[[[34,1,2],[935,1,2],[1560,1,3],[1561,1,3],[24,1,5],[771,1,4],[1587,1,3],[38,1,2],[1588,1,2],[19,1,1],[30,1,1],[30,1,5],[28,1,5],[1527,1,5]],[[1841,1,4],[1841,1,4],[1492,1,3],[1570,1,5],[126,1,6],[1275,1,4],[1838,1,3],[139,1,2],[142,1,1],[1537,1,3],[1537,1,3],[143,1,5],[128,1,2],[1248,1,4],[136,1,1]]];
for(let i=0;i<2;i++)test(`user army ${i+1}: exact official configurations and group boundaries survive codec`,()=>{
 const d=decodeArmyCode(ARMY_EXAMPLES[i].code);
 assert.equal(d.factionId,ARMY_EXAMPLES[i].factionId);
 assert.deepEqual(d.groups.map(g=>g.members.length),i?[9,6]:[10,4]);
 assert.deepEqual(d.groups.flatMap(g=>g.members.map(m=>[m.unitId,m.groupId,m.optionId])),triples[i]);
 assert.deepEqual(decodeArmyCode(encodeArmyCode(d)),d);
 assert.deepEqual(previews[i].errors,[]);
 assert.equal(previews[i].units.length,i?15:14);
 assert.equal(previews[i].points,i?300:299);
 assert.equal(previews[i].swc,i?5.5:5);
});
test('user armies keep duplicate units and exact loadouts without granting demo weapons',()=>{
 for(const p of previews){registerWeapons(p.units);for(const u of p.units){assert.equal(u.armyLocked,true);assert.equal(u.lieutenant,!!u.lieutenant);assert.equal(F.ownsMode(u,'heavyFlame','template'),false);}}
 assert.equal(previews[0].units.filter(u=>u.en==='TEUTONIC KNIGHT').length,2);
 assert.equal(previews[1].units.filter(u=>u.en==='GŪDǍN').length,2);
 assert.ok(previews[1].units.find(u=>u.en==='SHAOLIN').loadout.includes('smokeGrenade'));
 assert.ok(!previews[0].units.find(u=>u.en==='RAVENEYE').loadout.includes('emMine'));
 assert.equal(previews[0].units.filter(u=>u.en==='FUGAZI DRONBOT').length,1);
});
test('real Yu Jing group 2 expenditure never consumes group 1 orders',()=>{
 const units=structuredClone(previews[1].units).map((u,i)=>({...u,id:`yj-${i}`,team:0}));
 const s={units,orders:[0,0],lieutenantOrders:[0,0]};O.refresh(s,0);
 const u=units.find(u=>u.en==='YĀN HUǑ'),before={...s.groupOrders[0]};
 assert.ok(O.spend(s,u,'regular'));
 assert.equal(s.groupOrders[0][1],before[1]);assert.equal(s.groupOrders[0][2],before[2]-1);
 assert.equal(units.find(u=>u.lieutenant).combatGroup,2);
 assert.equal(units.find(u=>u.lieutenant).strategos,2);
});
test('both user armies must finish initiative and four deployment steps before play',()=>{
 const s={units:previews.flatMap((p,team)=>structuredClone(p.units).map((u,i)=>({...u,id:`${team}-${i}`,team}))),armyLists:{0:{name:'MO'},1:{name:'Yu Jing'}}};
 P.initialize(s);assert.throws(()=>P.start(s));
 const lt=s.units.find(u=>u.team===0&&u.lieutenant);assert.equal(P.rollInitiative(s,[lt.wip,20]).winner,0);
 P.chooseRight(s,0,'deployment');P.chooseInitiative(s,1,1);P.chooseDeployment(s,0,{firstDeployment:0,side:'north'});P.beginDeployment(s);
 assert.equal(P.reserveLimit(s,1),2);
 for(let i=0;i<4;i++){assert.throws(()=>P.start(s));P.finishDeploymentStep(s);}
 assert.equal(P.start(s),1);assert.equal(s.phase,'play');
});

test('corrected MO roster includes Seraph and preserves its off-table Ancillary profile',()=>{
 const c=JSON.parse(fs.readFileSync(new URL('../dist/assets/army-103.json',import.meta.url)));
 const entries=triples[0].map(([u,g,o])=>c.entries.find(e=>e.unitId===u&&e.groupId===g&&e.optionId===o));
 assert.ok(entries.every(Boolean));assert.equal(entries.reduce((n,e)=>n+Number(e.points),0),299);assert.equal(entries.reduce((n,e)=>n+Number(e.swc),0),5);
 assert.deepEqual(previews[0].errors,[]);assert.equal(previews[0].units[0].ancillaryProfiles[0].en,'CRABBOT');
});
