import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as F from '../dist/combat.js';
const templates=JSON.parse(readFileSync(new URL('../dist/templates.json',import.meta.url)));
const unit=(extra={})=>({id:'a',name:'A',team:0,x:10,y:10,z:0,s:2,hp:2,maxhp:2,states:[],facing:0,bs:11,ph:10,arm:0,bts:0,loadout:['heavyFlame'],...extra});
test('declaration offers owned flame beyond reach and despite friendly overlap, but respects LoF',()=>{
 const a=unit(),b=unit({id:'b',team:1,x:30,facing:180}),friend=unit({id:'f',x:12});
 assert.equal(F.declarationPoints(a,b,[b],[],'heavyFlame','template').length,1);
 assert.equal(F.templateFailure(F.makeTemplate(a,b,F.weaponMode('heavyFlame'),templates),a,b,F.weaponMode('heavyFlame'),[],[a,b,friend]),'模板未覆盖主目标：攻击失败');
 b.x=14;assert.equal(F.declarationPoints(a,b,[b],[],'heavyFlame','template').length,1);
 assert.match(F.templateFailure(F.makeTemplate(a,b,F.weaponMode('heavyFlame'),templates),a,b,F.weaponMode('heavyFlame'),[],[a,b,friend]),/友军/);
 a.facing=180;assert.equal(F.declarationPoints(a,b,[b],[],'heavyFlame','template').length,0);
});
test('a missed active template cannot hit a closer secondary target',()=>{
 const a=unit(),b=unit({id:'b',team:1,x:30}),c=unit({id:'c',team:1,x:13});
 const args={active:a,attackPoint:a,mainTarget:b.id,weapon:'heavyFlame',modeId:'template',path:[a],shape:F.makeTemplate(a,b,F.weaponMode('heavyFlame'),templates),units:[a,b,c],reactions:{},terrain:[],deferSaves:true};
 const result=F.resolveOrder({...args,pools:F.preparePools(args)});assert.equal(result.valid,false);assert.equal(result.details.length,0);
});
test('missed ARO template cannot hit secondary models; friendly and HVT contact cancels safely',()=>{
 for(const kind of ['miss','friend','hvt']){
 const a=unit({x:kind==='miss'?30:14}),b=unit({id:'b',team:1,x:10}),c=unit({id:'c',team:kind==='friend'?1:kind==='hvt'?-1:0,x:12});
 const args={active:a,attackPoint:a,weapon:'heavyFlame',modeId:'template',path:[a],units:kind==='hvt'?[a,b]:[a,b,c],neutralUnits:kind==='hvt'?[c]:[],reactions:{b:{id:'b',action:'attack',weapon:'heavyFlame',modeId:'template',point:a,shape:F.makeTemplate(b,a,F.weaponMode('heavyFlame'),templates)}},terrain:[],idle:true,activeSkill:'idle',deferSaves:true};
 const result=F.resolveOrder({...args,pools:F.preparePools(args)});assert.equal(result.extraPlans.length,0);assert.deepEqual(result.details[0].bh,[]);
 }
});
test('ordinary shooting declaration does not precheck maximum range',()=>{
 const a=unit(),b=unit({id:'b',x:45});assert.equal(F.declarationSpec(a,b,F.weaponMode('pistol'),[]).can,true);assert.equal(F.attackSpec(a,b,F.weaponMode('pistol'),[]).can,false);
});
