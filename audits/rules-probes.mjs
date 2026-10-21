// Read-only probes documenting known discrepancies, not assertions of correct behavior.
import * as F from '../dist/combat.js';
import * as E from '../dist/engine.js';
import {readFileSync} from 'node:fs';
const templates=JSON.parse(readFileSync(new URL('../dist/templates.json',import.meta.url)));
const u=(o={})=>({id:'a',name:'A',team:0,x:10,y:10,z:0,s:2,hp:3,maxhp:3,states:[],facing:0,bs:11,ph:10,arm:0,bts:0,...o});
const a=u(),b=u({id:'b',team:1,x:14,facing:180}),c=u({id:'c',team:1,x:14,y:11});
const m=F.weaponMode('missile','blast'),sv=F.attackSpec(a,b,m,[]).sv;
const args={active:a,attackPoint:a,mainTarget:'b',weapon:'missile',modeId:'blast',shape:F.makeTemplate(a,b,m,templates),path:[a],reactions:{},units:[a,b,c],terrain:[],deferSaves:true};
const result=F.resolveOrder({...args,pools:F.preparePools(args,()=>(sv-.5)/20)});
console.log('Impact critical SR counts (expected main=4, secondary=3):',result.details.map(d=>({id:d.id,saves:d.incoming.initialCount})));
a.bsBurstBonus=1;const flame=F.weaponMode('heavyFlame');const fargs={...args,weapon:'heavyFlame',modeId:'template',shape:F.makeTemplate(a,b,flame,templates)};
const fresult=F.resolveOrder({...fargs,pools:F.preparePools(fargs)});
console.log('Direct template B2 on same target (expected 2 hits):',{burst:F.attackSpec(a,b,flame,[]).m.b,hits:fresult.details.find(d=>d.id==='b').incoming.hits});
console.log('Impact partial-cover MOD (expected -3, manual cover=yes):',F.attackSpec(a,b,m,[],{manualCover:'yes'}).mods);
console.log('Circular AoE versus elevated silhouette (radius 2, z .5, expected intersects):',E.templateHits({kind:'circle',origin:{x:14,y:10,z:0},r:2},{...b,z:.5},[]));
const M=await import('../dist/movement.js');
console.log('Discover + first Move, MOV 6-4 (expected 6):',M.budget({...a,mov:6,mov2:4},{firstKind:'discover',moveKind:'move',secondMove:true,stance:'keep'}));
