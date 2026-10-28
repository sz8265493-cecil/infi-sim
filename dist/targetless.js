// N5.3: Targetless, Smoke/Eclipse, Disco Baller, Drop Bears, Pitcher.
import * as E from './engine.js?v=122';
import * as H from './hacking.js?v=122';
import * as S from './states.js?v=122';
export const WEAPONS={
 symbioMirrorball:{name:'共生炸弹 · Mirrorball',attribute:'wip',bands:[[8,0]],zone:'eclipse',comms:true,noLof:true},
 smokeGrenade:{name:'烟雾手雷',attribute:'ph',bands:[[8,0],[16,-3]],zone:'smoke',speculative:true},
 eclipseGrenade:{name:'Eclipse 手雷',attribute:'ph',bands:[[8,0],[16,-3]],zone:'eclipse',speculative:true},
 eclipseLauncher:{name:'Eclipse 榴弹发射器',attribute:'bs',bands:[[24,0],[32,-3],[48,-6]],zone:'eclipse',speculative:true},
 smokeLauncher:{name:'烟雾榴弹发射器',attribute:'bs',bands:[[24,0],[32,-3],[48,-6]],zone:'smoke',speculative:true},
 discoBaller:{name:'迪斯科球发射器',attribute:'bs',bands:[[8,0],[16,3],[24,-3],[32,-6]],entity:'discoBall',capacity:2,speculative:true,doubleShot:true},
 dropBears:{name:'投掷地雷 Drop Bears',attribute:'ph',bands:[[8,3],[16,-3]],entity:'dropBears',capacity:3,speculative:true},
 pitcher:{name:'投射中继器 Pitcher',attribute:'bs',bands:[[16,0],[24,-3],[48,-6]],entity:'deployableRepeater',capacity:2,speculative:true},
 mineDispenser:{name:'地雷发射器（休克）',attribute:'bs',bands:[[8,0],[16,3],[24,-3],[48,-6]],entity:'shockMine',capacity:2,speculative:true,doubleShot:true}
};
export const owned=u=>[...new Set([...(u.loadout||[]),...(u.deployableItems||[]),...(u.symbioBomb?['symbioMirrorball']:[])])].filter(id=>WEAPONS[id]);
export function available(u,{reactive=false,lof=false}={}){return S.allowed(u,'attack')&&!u.isDeployable&&!(u.wall&&!u.climbingPlus)&&!u.engaged&&(!reactive||lof)?owned(u).filter(id=>!(WEAPONS[id].comms&&S.has(u,'isolated'))&&(!WEAPONS[id].capacity||(u.spentWeapons?.[id]||0)<WEAPONS[id].capacity)):[];}
export const pointModel=p=>({...p,s:0,baseRadius:0,hp:1,states:[],facing:0});
export function spec(u,d,terrain,{measure=true,reactive=false,lof=false}={}){
 const w=WEAPONS[d?.weapon];let reason='';
 if(!w||!owned(u).includes(d.weapon))reason='未携带该武器';
 else if(w.comms&&S.has(u,'isolated'))reason='孤立状态禁用通讯攻击';
 else if(!S.allowed(u,'attack')||u.wall&&!u.climbingPlus||u.engaged)reason='当前状态不能攻击';
 else if(reactive&&(!lof||d.speculative))reason='Targetless ARO 需要看到主动单位，不能推测射击';
 else if(d.speculative&&!w.speculative)reason='该武器没有推测攻击属性';
 else if(!d.point)reason='未选择落点';
 const p=d.point&&pointModel(d.point),a={...u,...d.actorPoint},distance=p?E.edgeDistance(a,p):0,rm=w?.bands.find(([r])=>distance<=r+1e-8)?.[1];
 if(!reason&&!d.speculative&&!w.noLof&&(!E.visibility(a,p,terrain).visible||!d.moving&&!E.front(a,p)))reason='普通射击必须看到落点；无视线需主动轮整令推测射击';
 if(!reason&&measure&&rm===undefined)reason='超过最大射程';
 if(!reason&&measure&&w?.entity){const h=E.validPosition({...p,baseRadius:25/25.4/2,id:'placement'},d.point,[],terrain);if(h)reason=h;}
 const range=measure?(rm??0):0,base=a[w?.attribute]||0,penalty=d.speculative?-6:0,burst=d.speculative||reactive&&!u.totalReaction?1:Math.min(d.burst||1,6);
 const mods=[['距离',range],['推测射击',penalty],['BS 修正',(a.bsMod||0)+(a.bsAttackBonus||0)],['火力组',(a.ftLevel||0)>=4?1:0],['状态',S.rollMod(a)],['能见度',d.speculative||w?.noLof?0:E.visibilityMod(a,p||a,terrain)]];return {can:!reason,reason,base,rm:range,sv:Math.max(0,base+E.clamp(mods.reduce((n,m)=>n+m[1],0),-12,12)),burst,mods,weapon:w};
}
export function shape(d,r=4.6833/2){return {kind:'circle',origin:d.point,r};}
export function zone(d,id,sourceId){return {id,kind:WEAPONS[d.weapon]?.zone||'eclipse',x:d.point.x,y:d.point.y,z:d.point.z||0,r:4.6833/2,sourceId};}
// Smoke only opposes attacks against its own user that require LoF and are obstructed.
export function opposes(d,shooter,defender,weapon,terrain){const w=WEAPONS[d?.weapon];if(!w?.zone||!['bs','impact'].includes(weapon?.kind)||w.zone==='smoke'&&shooter.msv)return false;const z=zone(d,'candidate');return E.zoneCrosses(shooter,defender,z)&&!E.visibility(shooter,defender,Object.assign([...terrain],{zones:[...(terrain.zones||[]),z]})).visible;}
export function expire(zones,units){for(const u of units)if(u.deployableKind==='discoBall')u.discoActive=false;return [];}

export const whiteNoiseAvailable=u=>S.allowed(u,'attack')&&!u.isDeployable&&H.availablePrograms(u,{includeUnsupported:true}).some(p=>p.id==='whiteNoise');
export function whiteNoiseSpec(u,p,repeaters=[]){const r=4.6833/2,nodes=[u,...repeaters.filter(n=>n.team===u.team&&n.repeater&&S.active(n)&&!S.has(n,'isolated'))].filter(n=>(p.z||0)>=(n.z||0)-8&&(p.z||0)<=(n.z||0)+E.height(n)+8);const full=nodes.some(n=>Math.hypot(n.x-p.x,n.y-p.y)+r<=8+E.radius(n));const points=[p,...Array.from({length:16},(_,j)=>Array.from({length:144},(_,i)=>({x:p.x+r*(j+1)/16*Math.cos(i*Math.PI/72),y:p.y+r*(j+1)/16*Math.sin(i*Math.PI/72)}))).flat()];const contained=full||points.every(q=>nodes.some(n=>E.dist(n,q)<=8+E.radius(n)));return {can:whiteNoiseAvailable(u)&&contained,sv:u.wip||0,reason:contained?'':'整个圆模板必须位于有效黑客控制区内'};}
