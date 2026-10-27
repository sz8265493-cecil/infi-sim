import test from 'node:test';
import assert from 'node:assert/strict';
import * as H from '../dist/hacking.js?v=82';
const unit=(id,team=0,extra={})=>({id,name:id,team,x:10,y:10,z:0,s:2,facing:0,hp:1,maxhp:1,states:[],wip:13,type:'LI',...extra});
const evo=()=>unit('e',0,{hackingDevice:'EVO'});
const rem=()=>unit('r',0,{x:14,type:'REM'});
test('support actions separate active Long Skills and eligible Controlled Jump ARO',()=>{
 assert.equal(H.supportActions(evo()).length,4);
 assert.equal(H.supportActions(evo(),{reactive:true}).length,0);
 assert.deepEqual(H.supportActions(evo(),{reactive:true,trigger:'combatJump'}).map(p=>p.id),['controlledJump']);
 assert.equal(H.supportSpec(evo(),'assistedFire',{target:rem(),reactive:true,aroEligible:true}).can,false);
 assert.equal(H.supportSpec(evo(),'assistedFire',{target:{...rem(),x:40}}).can,false);
 assert.equal(H.supportSpec(evo(),'assistedFire',{target:{...rem(),x:40},measure:false}).can,true);
 assert.equal(H.supportSpec(evo(),'assistedFire',{target:{...rem(),team:1}}).can,false);
});
test('supportware projects effects, persists beyond range and cancels on caster Isolation without losing intrinsic stats',()=>{
 let out=H.resolveSupport([evo(),rem()],'e','assistedFire',{targetId:'r'});assert.equal(out.can,true);assert.equal(out.units[1].marksmanship,true);
 out.units[1].x=40;out.units=H.syncSupportware(out.units);assert.equal(out.units[1].marksmanship,true);
 out.units[0].states=['isolated'];out.units=H.syncSupportware(out.units);assert.equal(out.units[1].marksmanship,undefined);
 const native={...rem(),marksmanship:true};out=H.resolveSupport([evo(),native],'e','assistedFire',{targetId:'r'});out.units[0].states=['unconscious'];out.units[0].hp=0;out.units=H.syncSupportware(out.units);assert.equal(out.units[1].marksmanship,true);
});
test('targeting one Fairy Dust recipient cancels whole Fairy Dust program',()=>{
 let out=H.resolveSupport([evo(),unit('e2',0,{hackingDevice:'EVO'}),rem(),{...rem(),id:'r2'}],'e','fairyDust',{troopType:'REM'});
 assert.equal(out.units[2].firewall,-3);assert.equal(out.units[3].firewall,-3);
 out=H.resolveSupport(out.units,'e2','enhancedReaction',{targetId:'r'});
 assert.equal(out.units[0].supportware,undefined);assert.equal(out.units[2].aroBurst,2);assert.equal(out.units[3].firewall,undefined);
});
test('Controlled Jump resolves immediately globally and opposing programs cancel modifiers',()=>{
 let out=H.resolveSupport([evo(),unit('enemy',1,{hackingDevice:'EVO'})],'e','controlledJump',{reactive:true,trigger:'combatJump'});
 assert.equal(out.immediate,true);assert.equal(H.controlledJumpMod(unit('jump'),out.units),3);assert.equal(H.controlledJumpMod(unit('jump',1),out.units),-3);
 out=H.resolveSupport(out.units,'enemy','controlledJump');assert.equal(H.controlledJumpMod(unit('jump'),out.units),0);
});
test('Cybermask is self-only no-roll long action outside enemy LoF, with NFB state flags',()=>{
 const khd=unit('k',0,{hackingDevice:'KHD'}),enemy=unit('enemy',1,{x:15,facing:180});
 assert.equal(H.resolveSupport([khd,enemy],'k','cybermask').can,false);
 const out=H.resolveSupport([khd],'k','cybermask');assert.equal(out.noRoll,true);assert.ok(out.units[0].states.includes('impersonation2'));assert.equal(out.units[0].nfbCybermask,true);
 assert.equal(H.supportSpec(khd,'cybermask',{reactive:true,aroEligible:true}).can,false);
});
test('Zero Pain always rolls two and only opposes Comms; upgraded access is exact',()=>{
 const actor=unit('a',0,{hackingDevice:'HD',hackingUpgrades:['zeroPain']});
 assert.equal(H.supportActions(actor,{reactive:true,aroEligible:true})[0].id,'zeroPain');
 const out=H.resolveZeroPain(actor,[10,20],[{id:'hack',comms:true,sv:13,dice:[9]},{id:'gun',comms:false,sv:13,dice:[9]}],{reactive:true,aroEligible:true});
 assert.equal(out.burst,2);assert.equal(out.results[0].sv,10);assert.equal(out.results[0].avoided,true);assert.deepEqual(out.results[0].hits,[]);assert.equal(out.results[1].opposed,false);assert.deepEqual(out.results[1].hits,[9]);
 assert.equal(H.supportSpec(unit('b',0,{hackingDevice:'HD'}),'zeroPain').can,false);
});
test('upgraded program values are unit-local and NWI hackers retain devices',()=>{
 const actor=unit('a',0,{hackingDevice:'HD',hackingProgramMods:{carbonite:{ps:6},totalControl:{burstBonus:1,srMod:-2}},hp:0,states:['nwi']});
 assert.equal(H.availablePrograms(actor).length,4);const sp=H.spec(actor,unit('b',1,{hackable:true}),'carbonite');assert.equal(sp.m.ps,6);assert.equal(H.PROGRAMS.carbonite.ps,7);
 assert.equal(H.programFor(actor,'totalControl').b,2);assert.equal(H.spec(actor,unit('t',1,{type:'TAG'}),'totalControl').m.srMod,-2);
 assert.deepEqual(H.availablePrograms({...actor,offTable:true}),[]);
});

test('enemy repeater route reaches remote Hacker only, Firewall choice never stacks',()=>{const a={id:'a',team:0,hp:1,states:[],s:2,x:10,y:10,wip:13,hackingDevice:'HD'},b={id:'b',team:1,hp:1,states:[],s:2,x:35,y:35,wip:13,hackingDevice:'HD',hackingFirewall:-6,firewallChoices:{a:-3}},r={id:'r',team:1,hp:1,states:[],s:0,x:12,y:10,repeater:true};const opts={repeaters:[r],route:{kind:'enemy',id:'r'}};const s=H.spec(a,b,'spotlight',opts);assert.equal(s.can,true);assert.equal(s.sv,10);assert.equal(s.m.srMod,3);assert.equal(H.spec(a,{...b,hackingDevice:null},'spotlight',opts).can,false);assert.equal(H.spec(a,b,'spotlight',{...opts,route:{kind:'direct'}}).can,false);});
