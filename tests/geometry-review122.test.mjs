import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js?v=122';
import * as M from '../dist/movement.js?v=122';
import * as HO from '../dist/holoecho.js?v=122';
import * as S from '../dist/states.js?v=122';

const unit=(id,extra={})=>({id,name:id,team:0,s:2,x:20,y:28,z:0,hp:1,maxhp:1,states:[],...extra});
const mover=()=>unit('moving',{x:18});
const destination={x:22,y:28,z:0};

for(const extra of [{states:['hiddenDeployment']},{offTable:true},{deploymentPending:true}]){
 test('off-table enemy record does not obstruct Move, contact clipping or Jump: '+JSON.stringify(extra),()=>{
  const a=mover(),b=unit('absent',{team:1,...extra}),units=[a,b];
  assert.deepEqual(E.contactEnd(a,destination,units),destination);
  assert.equal(E.validPath(a,[a,destination],units,[],4),'');
  assert.equal(M.validJump(a,[a,destination],units,[],4),'');
  assert.equal(E.validPosition(a,b,units,[]),'');
 });
}
for(const state of ['nwi','dogged'])test(state+' remains a conscious enemy blocker even at zero health',()=>{
 const a=mover(),b=unit('survivor',{team:1,hp:0,states:[state]}),units=[a,b],stop=E.contactEnd(a,destination,units);
 assert.ok(stop.x<b.x);
 assert.ok(E.inContact({...a,...stop},b));
 assert.match(E.validPath(a,[a,destination],units,[],4),/不能穿过敌人/);
 assert.match(M.validJump(a,[a,destination],units,[],4),/敌方轮廓/);
 assert.equal(E.validPath(a,[a,stop],units,[],4),'');
});
test('neutral models can be crossed by Jump but cannot be used as landing positions',()=>{
 const a=mover(),b=unit('hvt',{team:-1}),units=[a,b];
 assert.equal(M.validJump(a,[a,destination],units,[],4),'');
 assert.match(M.validJump(a,[a,{...b}],units,[],4),/重叠/);
});

function hiddenGroup(){
 const a=unit('bearer',{holoprojector:true,states:['hiddenDeployment','holoecho'],hiddenOrderAvailable:true});
 const b=unit('echo1',{x:24,z:4,holoOwnerId:a.id,isHoloDecoy:true,states:['hiddenDeployment','holoecho']});
 const c=unit('echo2',{x:28,holoOwnerId:a.id,isHoloDecoy:true,states:['hiddenDeployment','holoecho']});
 const occupant=unit('occupant',{x:b.x,y:b.y,z:4,team:1});
 const roof={id:'tiny-roof',x:23.5,y:27.5,w:1,h:1,height:4};
 return {a,b,c,units:[a,b,c,occupant],terrain:[roof]};
}
test('hidden group preflight is read-only and rejects an unplaceable later echo',()=>{
 const {a,b,units,terrain}=hiddenGroup(),before=structuredClone(units),plan=HO.planHiddenReveal(units,a,terrain);
 assert.equal(plan.can,false);assert.equal(plan.failedId,b.id);assert.match(plan.error,/合法揭露位置/);
 assert.deepEqual(units,before);
});
test('failed hidden group placement cannot leave its bearer and earlier echoes revealed',()=>{
 const {a,b,c,units,terrain}=hiddenGroup(),coords=units.map(({x,y,z})=>({x,y,z}));
 const result=HO.revealHidden(units,a,terrain);
 assert.match(result.error,/合法揭露位置/);
 assert.ok([a,b,c].every(n=>S.has(n,'hiddenDeployment')));
 assert.equal(a.hiddenOrderAvailable,true);
 assert.deepEqual(units.map(({x,y,z})=>({x,y,z})),coords);
});
test('successful hidden group planning reserves moved footprints before committing all members',()=>{
 const {a,b,c,units}=hiddenGroup();b.z=0;units.at(-1).z=0;
 const plan=HO.planHiddenReveal(units,a,[]);assert.equal(plan.can,true);
 assert.ok([a,b,c].every(n=>S.has(n,'hiddenDeployment')));
 assert.equal(HO.revealHidden(units,a,[]).error,undefined);
 assert.ok([a,b,c].every(n=>S.onTable(n)));
 assert.equal(E.validPosition(b,b,units,[]),'');
 assert.ok(!E.inContact(b,units.at(-1)));
 assert.equal(a.hiddenOrderAvailable,false);
});

test('explicit unconscious state always permits crossing even with a stale positive health value',()=>{
 for(const state of ['unconscious','unconscious2']){
  const a=mover(),b=unit('fallen',{team:1,hp:1,states:[state]}),units=[a,b];
  assert.equal(E.blocksMovement(a,b),false);
  assert.deepEqual(E.contactEnd(a,destination,units),destination);
  assert.equal(E.validPath(a,[a,destination],units,[],4),'');
  assert.equal(M.validJump(a,[a,destination],units,[],4),'');
  assert.match(E.validPosition(a,b,units,[]),/重叠/);
 }
});

test('revealing hidden deployment for delayed ARO preserves an existing Camouflaged marker',()=>{
 const hidden=unit('h',{states:['hiddenDeployment','camouflaged'],hiddenOrderAvailable:true});
 HO.revealHidden([hidden],hidden,[]);
 assert.equal(S.has(hidden,'hiddenDeployment'),false);
 assert.equal(S.has(hidden,'camouflaged'),true);
 assert.equal(hidden.hiddenOrderAvailable,false);
});
