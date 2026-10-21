import test from 'node:test';
import assert from 'node:assert/strict';
import * as K from '../dist/skills.js?v=36';
import * as F from '../dist/combat.js?v=36';
const unit=(id,team,x,extra={})=>({id,name:id,team,x,y:10,z:0,s:2,facing:team?180:0,bs:12,cc:20,wip:13,ph:12,hp:1,maxHp:1,states:[],...extra});
const a=()=>unit('a',0,10), b=()=>unit('b',1,15);
const rifle={id:'test',kind:'bs',b:3,ps:7,bands:[[48,0]],ammo:'N'};
test('Albedo N5.3 affects MSV and Marksmanship BS/Discover, never CC or ordinary attackers',()=>{
 const target={...b(),albedo:-3,states:['camouflaged']};
 assert.equal(K.albedoMod(a(),target),0);
 for(const equipment of [{msv:1},{marksmanship:true}]){
  const actor={...a(),...equipment};
  assert.equal(K.attackMods(actor,target,rifle).find(x=>x[0].includes('Albedo'))[1],-3);
  assert.equal(K.discoverSpec(actor,target,[]).mods.find(x=>x[0].includes('Albedo'))[1],-3);
  assert.equal(K.attackMods(actor,target,{kind:'cc'}).some(x=>x[0].includes('Albedo')),false);
 }
});
test('Neurocinetics swaps burst and its bonuses; Total Reaction does not gain active-only burst bonuses',()=>{
 let actor={...a(),neurocinetics:true,bsBurstBonus:1};
 assert.equal(F.attackSpec(actor,b(),rifle,[]).m.b,1);
 assert.equal(F.attackSpec(actor,b(),rifle,[],{reactive:true}).m.b,4);
 assert.equal(F.attackSpec({...actor,neuroBurstBonus:1},b(),rifle,[],{reactive:true}).m.b,5);
 assert.equal(F.attackSpec({...actor,neuroBurstBonus:1},b(),rifle,[]).m.b,1);
 actor={...a(),totalReaction:true,bsBurstBonus:1};
 assert.equal(F.attackSpec(actor,b(),rifle,[]).m.b,4);
 assert.equal(F.attackSpec(actor,b(),rifle,[],{reactive:true}).m.b,3);
 assert.equal(F.attackSpec({...a(),ccBurstBonus:1},{...b(),x:10.99},{...rifle,kind:'cc'},[],{reactive:true}).m.b,1);
});
test('BS/CC ammo and save modifiers are isolated, direct templates receive BS effects',()=>{
 const actor={bsAmmo:['SHOCK'],bsSaveMod:-1,bsContinuous:true,ccAmmo:['AP'],ccSaveMod:-2};
 const ranged=K.attackMode(actor,{...rifle,ammo:'AP'});
 assert.equal(ranged.ammo,'AP+SHOCK');assert.equal(ranged.srMod,-1);assert.equal(ranged.continuous,true);
 const melee=K.attackMode(actor,{...rifle,kind:'cc',ammo:'DA'});
 assert.equal(melee.ammo,'DA+AP');assert.equal(melee.srMod,-2);assert.equal(!!melee.continuous,false);
 assert.equal(K.attackMode({}, {kind:'bs',ap:true,saves:3}).ammo,'AP+EXP');
 assert.equal(K.attackMode(actor,{...rifle,kind:'direct'}).srMod,-1);
});
test('Special dice stack with Fireteam but never apply to Long Skills or automatic direct hits',()=>{
 const actor={ftLevel:2,bsSpecialDice:1};
 assert.equal(K.specialDice(actor,rifle),2);
 assert.equal(K.specialDice(actor,rifle,{longSkill:true}),0);
 assert.equal(K.specialDice(actor,{kind:'direct'}),0);
 assert.deepEqual(F.kept({dice:[1,2,3,4],discard:[1,3]}),[1,3]);
});
test('One-use camouflage may first activate in game, but reveal exhausts its use',()=>{
 const actor={...a(),camouflage:true,camouflageUses:1};
 assert.equal(K.canRecamo(actor,[],[]),true);
 assert.equal(K.enterCamo(actor),true);K.reveal(actor);
 assert.equal(actor.camouflageUsed,true);assert.equal(K.canRecamo(actor,[],[]),false);assert.equal(K.enterCamo(actor),false);
});
test('ECM Hacking applies both turns and stacks with one Firewall; Firewall contributes SR +3',()=>{
 const hacker={...a(),hackingDevice:'HD'};const target={...b(),hackable:true,ecmHacking:-3,firewall:-3};
 const m=F.weaponMode('hack_carbonite');
 for(const reactive of [false,true]){const spec=F.attackSpec(hacker,target,m,[],{reactive});assert.equal(spec.sv,7);assert.equal(spec.m.srMod,3);}
});
