import test from 'node:test';
import assert from 'node:assert/strict';
import * as O from '../dist/orders.js';
import * as PT from '../dist/pheroware.js';
import * as Z from '../dist/targetless.js';
import * as F from '../dist/combat.js?v=122';
import * as FT from '../dist/fireteams.js';
import * as K from '../dist/skills.js';
import {effectiveFirewall} from '../dist/hacking.js?v=122';
const unit=(id,extra={})=>({id,name:id,team:0,x:20,y:20,z:0,s:2,facing:90,hp:1,maxhp:1,states:[],wip:13,combatGroup:1,...extra});
const enemy=()=>unit('enemy',{team:1,y:24,attribute:'VITA'});

test('coordinated Pheroware reduces Burst after bonuses and retains ARO B1',()=>{
 const a=unit('a',{symbioBomb:{},bsBurstBonus:1}),b=enemy(),m=PT.WEAPONS.symbioEraser.modes[0];
 assert.equal(F.attackSpec(a,b,m,[],{coordinated:true}).m.b,2);
 assert.equal(F.attackSpec(a,b,m,[],{coordinated:true,spearhead:false}).m.b,1);
 assert.equal(F.attackSpec({...a,reservedShots:1},b,m,[],{coordinated:true}).m.b,1);
 assert.equal(F.attackSpec(a,b,m,[],{reactive:true,coordinated:true}).m.b,1);
 const plain={...a,bsBurstBonus:0};
 assert.equal(F.attackSpec(plain,b,m,[],{coordinated:true}).m.b,1);
 assert.equal(F.attackSpec(plain,b,PT.WEAPONS.symbioEndgame.modes[1],[],{coordinated:true}).m.b,1);
});

test('isolated Tactical Awareness keeps personal tactical order while pool and NCO orders stay forbidden',()=>{
 const a=unit('a',{states:['isolated'],tacticalAwareness:true,nco:true}),b=unit('b',{lieutenant:true});
 const state={units:[a,b],orders:[0,0]};O.refresh(state,0);
 assert.equal(a.tacticalOrders,1);assert.equal(a.irregular,1);assert.equal(state.orders[0],1);
 assert.deepEqual(O.sources(state,a).map(([key])=>key),['irregular','tactical']);
 assert.equal(O.spend(state,a,'regular'),false);assert.equal(O.spend(state,a,'lieutenant'),false);
 assert.equal(O.spend(state,a,'tactical'),true);assert.equal(a.tacticalOrders,0);assert.equal(state.orders[0],1);
 a.states=[];a.tacticalOrders=1;a.states=['isolated'];
 assert.equal(O.spend(state,a,'tactical'),true,'isolation during a turn does not remove an already generated Tactical Order');
 a.hp=0;a.states=['unconscious'];O.refresh(state,0);assert.equal(a.tacticalOrders,0);
});

test('isolation disables all SymbioBomb Comms attacks in active turn and ARO, but not a smoke grenade',()=>{
 const a=unit('a',{states:['isolated'],symbioBomb:{},loadout:['smokeGrenade']}),b=enemy();
 for(const weapon of Object.values(PT.WEAPONS))for(const mode of weapon.modes)for(const reactive of [false,true]){
  const sp=PT.spec(a,b,mode,{reactive,declaration:true});assert.equal(sp.can,false);assert.match(sp.reason,/孤立/);
 }
 assert.ok(!F.availableWeapons(a).some(key=>key in PT.WEAPONS));
 assert.deepEqual(Z.available(a),['smokeGrenade']);
 assert.deepEqual(Z.available(a,{reactive:true,lof:true}),['smokeGrenade']);
 const d={weapon:'symbioMirrorball',point:{x:20,y:24,z:0}};
 for(const reactive of [false,true])assert.match(Z.spec(a,d,[],{reactive,lof:true}).reason,/孤立/);
 a.states=[];assert.ok(Z.available(a).includes('symbioMirrorball'));assert.equal(Z.spec(a,d,[]).can,true);
});

test('isolation disables a device Firewall but retains an independent Firewall',()=>{
 const attacker=unit('a'),defender=enemy();
 defender.hackingDevice='HD';defender.hackingFirewall=-3;
 assert.equal(effectiveFirewall(attacker,defender),-3);
 defender.states=['isolated'];assert.equal(effectiveFirewall(attacker,defender),0);
 defender.firewall=-6;assert.equal(effectiveFirewall(attacker,defender),-6);
});


test('Pheroware BS Weapon WIP keeps BS Special Dice, unlike Hacking Programs',()=>{
 const a=unit('a',{bsSpecialDice:1}),m=PT.WEAPONS.symbioEraser.modes[0];
 assert.equal(K.specialDice(a,m),1);
 assert.equal(K.specialDice({...a,ftLevel:2},m),2);
 assert.equal(K.specialDice(a,m,{longSkill:true}),0);
 assert.equal(K.specialDice({...a,ftLevel:2},{kind:'hack',hackingProgram:'trinity'}),0);
});

test('all on-table Peripheral controller types are excluded from fireteam membership',()=>{
 for(const type of ['servant','synchronized','control','ancillary','cyberplug']){
  const a=unit('a'),p=unit('p',{controllerId:'a',peripheral:type});
  assert.ok(FT.forbidden(a,[a,p]),type);
  assert.match(FT.unavailableReason(a,[a,p]),/控制者/,type);
  p.offTable=true;assert.equal(!!FT.forbidden(a,[a,p]),type!=='ancillary','only undeployed Ancillary has the controller exception');
 }
});

test('becoming a Peripheral controller immediately removes a fireteam member and disbands a leader team',()=>{
 for(const leader of [false,true]){
  const us=[unit('a'),unit('b'),unit('c')],f={id:'ft',team:0,members:us.map(u=>u.id),leaderId:leader?'a':'b',label:'CORE'},s={units:us,fireteams:[f]};
  FT.sync(s);assert.ok(us[0].ftId);
  s.units.push(unit('p',{controllerId:'a',peripheral:'servant'}));FT.sync(s);
  assert.equal(us[0].ftId,undefined);assert.equal(us[0].ftLevel,0);
  assert.equal(!!f.cancelled,leader);
  if(!leader)assert.deepEqual(f.members,['b','c']);
 }
});


test('Ancillary controller exception covers undeployed, Disconnected and Null without weakening ordinary Peripheral restrictions',async()=>{
 const CO=await import('../dist/coordinated.js?v=122');
 const a=unit('a'),other=unit('b');
 for(const extra of [{offTable:true},{states:['disconnected']},{hp:0,states:['unconscious']},{hp:-1,states:['dead']}]){
  const p=unit('p',{controllerId:'a',peripheral:'ancillary',...extra}),s={team:0,units:[a,other,p]};
  assert.equal(!!FT.forbidden(a,s.units),false);assert.equal(CO.memberReason(s,a,other),'');
 }
 const p=unit('p',{controllerId:'a',peripheral:'ancillary'}),s={team:0,units:[a,other,p]};
 assert.equal(!!FT.forbidden(a,s.units),true);assert.match(CO.memberReason(s,a,other),/控制者/);
 p.states=['unconscious'];p.hp=0;assert.equal(!!FT.forbidden(a,s.units),false);
 p.peripheral='servant';assert.equal(!!FT.forbidden(a,s.units),true);assert.match(CO.memberReason(s,a,other),/控制者/);
});
