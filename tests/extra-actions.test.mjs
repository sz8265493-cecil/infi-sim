import test from 'node:test';
import assert from 'node:assert/strict';
import * as X from '../dist/extra-actions.js';
const unit=(extra={})=>({id:'a',team:0,x:5,y:5,z:0,s:2,facing:0,hp:1,maxhp:1,attribute:'VITA',ph:11,bs:12,wip:13,states:[],...extra});
const patient=extra=>unit({id:'b',x:6,hp:0,states:['unconscious'],...extra});
test('equipment gated; only Forward Observer is an ARO',()=>{
 assert.deepEqual(X.availableActions(unit()),[]);
 const a=unit({medikit:true,gizmokit:true,deactivator:true,forwardObserver:true});
 assert.equal(X.availableActions(a).length,4);
 assert.deepEqual(X.availableActions(a,{reactive:true}),['forwardObserver']);
 assert.equal(X.validate(a,patient(),'medikit',{reactive:true}).can,false);
});
test('declaration does not reveal range or ZoC',()=>{
 const a=unit({deactivator:true}),t=unit({id:'m',team:1,x:45,isDeployable:true});
 assert.equal(X.validate(a,t,'deactivator').can,true);
 assert.equal(X.spec(a,t,'deactivator').can,false);
 assert.equal('d' in X.spec(a,t,'deactivator',{measure:false}),false);
});
test('medical kit has separate PH roll; failure removes the target, no saving roll',()=>{
 const a=unit({medikit:true}),t=patient();
 assert.equal(X.resolve(a,t,'medikit',{mode:'contact'}).needsPH,true);
 const ok=X.resolve(a,t,'medikit',{mode:'contact',phDice:[11]});
 assert.equal(ok.target.hp,1);assert.equal(ok.savingRolls,0);assert.equal(ok.target.states.includes('unconscious'),false);
 assert.equal(X.resolve(a,t,'medikit',{mode:'contact',phDice:[12]}).removed,true);
 assert.equal(t.hp,0);
});
test('ranged kit misses do not trigger PH; hit uses target specific PH',()=>{
 const a=unit({medikit:true}),t=patient({x:10,medikitPH:7});
 assert.equal(X.resolve(a,t,'medikit',{attackDice:[20]}).hits,0);
 assert.equal(X.resolve(a,t,'medikit',{attackDice:[1]}).ph,7);
 assert.equal(X.resolve(a,t,'medikit',{attackDice:[1],phDice:[8]}).removed,true);
});
test('GizmoKit restores remote unconscious II to 1; failure adds a wound',()=>{
 const a=unit({gizmokit:true}),t=patient({attribute:'STR',hp:-1,remotePresence:true,states:['unconscious2']});
 assert.equal(X.resolve(a,t,'gizmokit',{mode:'contact',phDice:[1]}).target.hp,1);
 assert.equal(X.resolve(a,t,'gizmokit',{mode:'contact',phDice:[20]}).removed,true);
});
test('kit target restrictions and Technorganic exception',()=>{
 const a=unit({medikit:true,gizmokit:true});
 assert.equal(X.validate(a,patient({team:1}),'medikit').can,false);
 assert.equal(X.validate(a,patient({attribute:'STR'}),'medikit').can,false);
 assert.equal(X.validate(a,patient({attribute:'STR',technorganic:true}),'medikit').can,true);
 assert.equal(X.validate(a,patient({hp:1,states:[]}),'medikit').can,false);
});
test('Tech-Recovery failure harmless; successful PH removes eligible states',()=>{
 const a=unit({gizmokit:true}),t=patient({hp:1,techRecovery:true,states:['isolated','targeted']});
 const opts={mode:'contact',recovery:'states'};
 assert.equal(X.resolve(a,t,'gizmokit',{...opts,phDice:[20]}).target.hp,1);
 assert.deepEqual(X.resolve(a,t,'gizmokit',{...opts,phDice:[1]}).target.states,[]);
});
test('Deactivator ignores cover/mimetism and preserves current mine trigger',()=>{
 const a=unit({deactivator:true}),t=unit({id:'m',team:1,x:10,isDeployable:true,mim:6});
 const r=X.resolve(a,t,'deactivator',{attackDice:[19]});
 assert.equal(r.sv,19);assert.equal(r.removed,true);assert.equal(r.preserveCurrentOrderTrigger,true);
 assert.equal(X.validate(a,{...t,states:['camouflaged']},'deactivator').can,false);
});
test('Forward Observer normal and opposed hits cause Targeted without damage/saves',()=>{
 const a=unit({forwardObserver:true}),t=unit({id:'b',team:1,x:10});
 assert.equal(X.spec(a,t,'forwardObserver').burst,2);
 assert.equal(X.spec(a,t,'forwardObserver',{reactive:true}).burst,1);
 const hit=X.resolve(a,t,'forwardObserver',{attackDice:[12,20],opposedDice:[10],opposedSV:12});
 assert.equal(hit.target.states.includes('targeted'),true);assert.equal(hit.target.hp,1);assert.equal(hit.savingRolls,0);
 const lost=X.resolve(a,t,'forwardObserver',{attackDice:[5,20],opposedDice:[10],opposedSV:12});
 assert.equal(lost.target.states.includes('targeted'),false);
});
