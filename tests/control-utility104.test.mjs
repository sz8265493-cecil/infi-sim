import test from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../dist/peripherals.js?v=104';
import * as D from '../dist/deployables.js?v=79';
import * as S from '../dist/states.js?v=102';
import * as X from '../dist/extra-actions.js?v=41';
import * as U from '../dist/support-actions.js?v=99';
const make=(id,extra={})=>({id,name:id,team:0,x:20,y:20,z:0,s:2,hp:1,maxhp:1,attribute:'VITA',states:[],wip:13,...extra});
const c=make('c',{controlSpearheadId:'a'}),a=make('a',{peripheral:'control',controllerId:'c'}),b=make('b',{peripheral:'control',controllerId:'c'}),all=[c,a,b];
test('Control restricts targeted utility only in Active Turn, independently of Attack label',()=>{
 for(const kind of ['doctor','engineer','discover','medikit','gizmokit','deactivator','speedballUse','mission']){assert.equal(P.utilityRestriction(c,all,kind),'');assert.equal(P.utilityRestriction(a,all,kind),'');assert.match(P.utilityRestriction(b,all,kind),/先锋/);}
 for(const kind of ['sensor','reload','deployable'])assert.equal(P.utilityRestriction(b,all,kind),'');
 assert.equal(P.utilityRestriction(b,all,'discover',{reactive:true}),'');
});
test('Short-only skill ownership never creates a reactive action; deployment ARO needs LoF',()=>{
 const u={...b,doctor:true,engineer:true,medikit:true,gizmokit:true,deactivator:true,deployableItems:['shockMine']};
 assert.deepEqual(U.availableActions(u,{reactive:true}),[]);assert.deepEqual(X.availableActions(u,{reactive:true}),[]);
 assert.equal(D.declaration(u,'shockMine',{reactive:true,lof:false}).can,false);assert.equal(D.declaration(u,'shockMine',{reactive:true,lof:true}).can,true);
 assert.notEqual(P.utilityRestriction(u,all,'sensor',{reactive:true}),'');
});
test('Control declarations spend each member own inventory once, never inherit equipment',()=>{
 const x={...a,deployableItems:['shockMine']},y={...b,deployableItems:['deployableRepeater']};
 const rx=D.consume(x,'shockMine',{token:'order:active'}),ry=D.consume(y,'deployableRepeater',{token:'order:active'});
 assert.equal(D.remaining(rx.unit,'shockMine'),2);assert.equal(D.remaining(ry.unit,'deployableRepeater'),2);assert.ok(D.consume(y,'shockMine').error);
 assert.equal(D.remaining(D.consume(rx.unit,'shockMine',{token:'order:active'}).unit,'shockMine'),2);
});
test('Choosing NWI preserves a Control Spearhead, declining requires replacement',()=>{
 for(const choice of ['nwi','dogged',null]){const units=structuredClone(all),spear=units[1];Object.assign(spear,{nwi:true,dogged:true,explode:true});S.apply(spear,1);assert.deepEqual(S.pendingSurvival(spear),['nwi','dogged']);S.chooseSurvival(spear,choice);assert.equal(!!P.pendingSpearhead(units),choice===null);assert.equal(!!spear.pendingExplode,choice===null);}
});
