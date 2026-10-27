import test from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../dist/states.js?v=102';
import * as U from '../dist/state-ui.js?v=98';
import * as R from '../dist/support-actions.js?v=99';
const unit=(extra={})=>({id:'a',name:'a',team:0,x:1,y:1,z:0,s:2,hp:1,maxhp:1,attribute:'VITA',type:'LI',wip:13,states:[],prone:false,ftLevel:3,...extra});
test('NWI decision occurs once at damage boundary; restores original posture and ignores Null',()=>{
 const u=unit({nwi:true});S.apply(u,1);
 assert.deepEqual(S.pendingSurvival(u),['nwi']);assert.equal(S.unconscious(u),true);assert.equal(u.prone,true);
 assert.equal(S.chooseSurvival(u,'nwi'),true);assert.equal(u.hp,0);assert.equal(S.active(u),true);assert.equal(S.isProne(u),false);assert.equal(u.ftLevel,3);
 S.apply(u,0);assert.equal(S.active(u),true);assert.deepEqual(S.pendingSurvival(u),[]);assert.equal(U.tokens(u)[0].key,'nwi');
 S.apply(u,1);assert.equal(S.present(u),false);assert.equal(S.has(u,'nwi'),false);
});
test('declining survival is final for that unconscious episode, including STR second level',()=>{
 const u=unit({nwi:true,remotePresence:true,attribute:'STR'});S.apply(u,1);S.chooseSurvival(u,null);S.apply(u,0);assert.deepEqual(S.pendingSurvival(u),[]);
 S.apply(u,1);assert.equal(S.has(u,'unconscious2'),true);assert.deepEqual(S.pendingSurvival(u),[]);
 const v=unit({nwi:true,remotePresence:true,attribute:'STR'});S.apply(v,2);assert.deepEqual(S.pendingSurvival(v),['nwi']);S.chooseSurvival(v,'nwi');assert.equal(S.active(v),true);S.apply(v,1);assert.equal(S.present(v),false);
});
test('Dogged preserves existing prone posture, prohibits healing and expires in States Phase',()=>{
 const u=unit({dogged:true,prone:true,doctor:true});S.apply(u,1);S.chooseSurvival(u,'dogged');assert.equal(S.active(u),true);assert.equal(u.prone,true);
 assert.deepEqual(R.modes(u,u,'doctor'),[]);S.statesPhase([u]);assert.equal(S.present(u),false);
});
test('Shock bypasses survival while Shock immunity retains optional choice',()=>{
 const u=unit({nwi:true,dogged:true});S.apply(u,1,['shock']);assert.equal(S.present(u),false);assert.deepEqual(S.pendingSurvival(u),[]);
 const v=unit({nwi:true,immunities:['Shock']});S.apply(v,1,['shock']);assert.deepEqual(S.pendingSurvival(v),['nwi']);
});
test('NWI doctor may heal self in active turn; failure removes and ARO is illegal',()=>{
 const u=unit({nwi:true,doctor:true});S.apply(u,1);S.chooseSurvival(u,'nwi');assert.equal(R.validate(u,u,'doctor','heal').can,true);assert.equal(R.validate(u,u,'doctor','heal',{reactive:true}).can,false);
 const good=R.resolve(u,u,'doctor','heal',{die:1});assert.equal(good.target.hp,1);assert.equal(S.has(good.target,'nwi'),false);
 const bad=R.resolve(u,u,'doctor','heal',{die:20});assert.equal(S.present(bad.target),false);
});
