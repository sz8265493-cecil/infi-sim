import * as FT from './fireteams.js?v=36';
import {partners as originalPartners} from './peripherals.js?v=36';
import * as Z from './targetless.js?v=36';
import * as H from './hacking.js?v=36';
import * as K from './skills.js?v=36';
import * as E from './engine.js?v=36';
import * as S from './states.js?v=36';
import * as V from './saves.js?v=36';
const peripheralPartners=(u,units)=>[...new Map([...originalPartners(u,units),...FT.partners(u,units)].map(v=>[v.id,v])).values()];
// Chinese terminology follows Infinity ARMY 7 汉化 11.9.0, 乐神局文史部.
const mode=(id,name,kind,b,ps,bands=[],extra={})=>({id,name,kind,b,ps,bands,saves:1,...extra});
export const ARMS={
 combi:{name:'复合步枪',en:'Combi Rifle',modes:[mode('hit','直射','bs',3,7,[[16,3],[32,-3],[48,-6]])]},
 spitfire:{name:'轻机枪',en:'Spitfire',modes:[mode('hit','直射','bs',4,6,[[8,0],[24,3],[32,-3],[48,-6]])]},
 hmg:{name:'重机枪',en:'Heavy Machine Gun',modes:[mode('hit','直射','bs',4,5,[[8,-3],[16,0],[32,3],[48,-3]])]},
 lightFlame:{name:'轻型火焰喷射器',en:'Light Flamethrower',modes:[mode('template','直射模板 · 小泪滴','direct',1,7,[],{template:'small',continuous:true})]},
 heavyFlame:{name:'重型火焰喷射器',en:'Heavy Flamethrower',modes:[mode('template','直射模板 · 大泪滴','direct',1,6,[],{template:'large',continuous:true})]},
 missile:{name:'导弹发射器',en:'Missile Launcher',modes:[mode('blast','爆破模式 · 圆形冲击模板','impact',1,6,[[8,-3],[24,0],[40,3],[96,-3]],{template:'circle',saves:3}),mode('hit','命中模式 · 穿甲＋爆炸','bs',1,6,[[8,-3],[24,0],[40,3],[96,-3]],{saves:3,ap:true})]},
 cc:{name:'近战武器',en:'CC Weapon',modes:[mode('cc','近战攻击','cc',1,8)]}
};
ARMS.lab={name:'弹药实验器（训练）',en:'SAVING ROLL LAB · synthetic B1 / PS8',modes:Object.entries(V.AMMO).map(([ammo,name])=>mode(ammo,name,'bs',1,8,[[16,3],[32,-3]],{ammo}))};
ARMS.lab.modes.push(mode('AP+EXP','穿甲＋爆炸 AP＋EXP','bs',1,8,[[16,3],[32,-3]],{ammo:'AP+EXP'}),mode('N+EM','普通＋电磁 N＋E/M','bs',1,8,[[16,3],[32,-3]],{ammo:'N+EM'}),mode('continuous','持续伤害（训练）','bs',1,8,[[16,3],[32,-3]],{continuous:true}));
ARMS.pistol={name:'手枪',en:'Pistol',modes:[mode('hit','射击','bs',2,9,[[8,3],[16,0],[24,-6]]),mode('cc','近战','cc',1,9)]};
ARMS.forwardObserver={name:'前线观测',en:'Forward Observer · WIP',modes:[mode('mark','标记目标 · 无过保','bs',2,0,[[24,0],[48,-3],[96,-6]],{attribute:'wip',noSavingRoll:true,effects:['targeted'],nonlethal:true,requiresSkill:'forwardObserver'})]};
ARMS.flash={name:'闪光脉冲',en:'Flash Pulse · WIP',modes:[mode('hit','眩晕 · WIP','bs',1,7,[[8,0],[24,3],[48,-3],[96,-6]],{ammo:'STUN',attribute:'wip'})]};
ARMS.paraCC={name:'麻痹近战武器（−3）',en:'PARA CC Weapon (-3)',modes:[mode('cc','麻痹近战','cc',1,0,[],{ammo:'PARA',opponentMod:-3})]};
ARMS.apSpitfire={name:'穿甲轻机枪',en:'AP Spitfire',modes:ARMS.spitfire.modes.map(m=>({...m,ammo:'AP'}))};
ARMS.multiHmg={name:'多功能重机枪',en:'MULTI HMG',modes:[mode('AP','穿甲 AP','bs',4,5,ARMS.hmg.modes[0].bands,{ammo:'AP'}),mode('SHOCK','休克 Shock','bs',4,5,ARMS.hmg.modes[0].bands,{ammo:'SHOCK'}),mode('EXP','反器材 EXP','bs',1,5,ARMS.hmg.modes[0].bands,{ammo:'EXP'})]};
ARMS.panzerfaust={name:'铁拳火箭筒',en:'Panzerfaust · Disposable (2)',disposable:2,modes:[mode('hit','穿甲＋爆炸','bs',1,6,[[8,-3],[16,0],[32,3],[48,-3]],{ammo:'AP+EXP'})]};
for(const ps of [3,5])ARMS['daCC'+ps]={name:'双重近战武器（PS '+ps+'）',en:'DA CC Weapon',modes:[mode('cc','双重 DA','cc',1,ps,[],{ammo:'DA'})]};
for(const [id,p] of Object.entries(H.PROGRAMS))if(p.supported&&!p.utility)ARMS['hack_'+id]={name:p.name,en:'Hacking Program',modes:[H.asWeaponMode(id)]};
ARMS.turretMarksman={name:'射手步枪',modes:[{id:'hit',name:'标准模式',kind:'bs',b:3,ps:7,ammo:'N',bands:[[8,-3],[24,3],[40,-3],[48,-6]]}]};
ARMS.turretPara={name:'麻痹近战武器（−3）',modes:[{id:'cc',name:'近战',kind:'cc',b:1,ps:0,ammo:'PARA',opponentMod:-3,bands:[]}]};
export function addGuidedModes(w){if(w.modes.some(m=>m.guided))return;const eligible=w.modes.filter(m=>!m.sf&&['bs','impact'].includes(m.kind)&&!m.attribute),blast=eligible.filter(m=>m.template==='circle');for(const m of (blast.length?blast:eligible))w.modes.push({...m,id:'guided_'+m.id,name:m.name+' · 制导',kind:'impact',template:'circle',guided:true,b:1});}
ARMS.guidedTraining={name:'制导导弹（规则教学靶机）',en:'Guided training fixture',modes:[{id:'guided',name:'爆炸模式 · 制导',kind:'impact',template:'circle',guided:true,b:1,ps:6,ammo:'EXP',bands:[[8,-3],[24,0],[40,3],[96,-3]]}]};
export function availableWeapons(u){return [...new Set([...(u.loadout||[]),...(u.forwardObserver?['forwardObserver']:[]),...H.availablePrograms(u).filter(p=>!p.utility).map(p=>'hack_'+p.id)])].filter(k=>ARMS[k]&&(k!=='forwardObserver'||u.forwardObserver)&&(!ARMS[k].disposable||(u.spentWeapons?.[k]||0)<ARMS[k].disposable));}
export function ownsMode(u,key,id){return availableWeapons(u).includes(key)&&ARMS[key].modes.some(m=>m.id===id);}
export function spendWeapon(u,key){if(ARMS[key]?.disposable){u.spentWeapons??={};u.spentWeapons[key]=(u.spentWeapons[key]||0)+1;}}
const revealedActor=u=>S.has(u,'hiddenDeployment')?{...u,states:u.states.filter(k=>k!=='hiddenDeployment')}:u;
const zeroSpec=(u,reactive=false)=>H.supportSpec(revealedActor(u),'zeroPain',{reactive,aroEligible:reactive});
function validateEquipment(args){
 for(const [id,r] of Object.entries(args.reactions||{})){const u=args.units.find(u=>u.id===(r.id||id));if(!['','none','delay'].includes(r.action)&&(!u||u.offTable||u.noARO||u.isDecoy))throw Error('该单位不能宣告 ARO');}
 if(args.activeSkill==='zeroPain'&&!zeroSpec(args.active).can)throw Error('该单位不能宣告零痛');
 for(const [id,r] of Object.entries(args.reactions||{}))if(r.action==='zeroPain'&&!zeroSpec(args.units.find(u=>u.id===(r.id||id)),true).can)throw Error('反应单位不能宣告零痛');
 if(!args.idle&&args.activeSkill!=='dodge'&&args.activeSkill!=='reset'&&args.activeSkill!=='zeroPain'&&args.active.loadout&&!ownsMode(args.active,args.weapon,args.modeId)&&!(args.active.reservedWeapon===args.weapon&&args.active.reservedShots>0&&args.active.loadout.includes(args.weapon)))throw Error('单位未携带该武器或模式不可用');
 for(const [id,r] of Object.entries(args.reactions||{})){const u=args.units.find(u=>u.id===(r.id||id));if(r.action==='attack'&&u?.loadout&&!ownsMode(u,r.weapon,r.modeId)&&!(r.reservedShots>0&&u.loadout.includes(r.weapon)))throw Error('反应单位未携带该武器或模式不可用');}
}

export const weaponMode=(weapon,id)=>ARMS[weapon]?.modes.find(m=>m.id===id)||ARMS[weapon]?.modes[0];
export const coupDeGrace=(a,b,m)=>m?.kind==='cc'&&b&&S.unconscious(b)&&S.present(b)&&E.edgeDistance(a,b)<.026;
export const canSee=(a,b,terrain)=>E.engagedContact(a,b,terrain)||E.front(a,b)&&E.visibility(a,b,terrain).visible;
export function eligibility(active,path,units,terrain,affected=[]){const points=E.samplePath(path);return units.filter(u=>(!u.isDeployable||u.armedTurret)&&u.team>=0&&u.team!==active.team&&S.active(u)&&!u.offTable&&!u.noARO&&!u.isDecoy&&!S.has(u,'disconnected')).map(u=>{const visible=points.filter(p=>(canSee(u,{...active,...p},terrain)||(affected.includes(u.id)&&K.sixth(u)&&E.visibility(u,{...active,...p},terrain).visible))),zoc=points.some(p=>E.edgeDistance(u,{...active,...p})<=8),contact=points.some(p=>E.inContact(u,{...active,...p},terrain));const hackArea=H.availablePrograms(revealedActor(u)).length&&points.some(p=>H.hackingArea(u,{...active,...p},{repeaters:u.hackingRepeaters||[],route:{kind:'autoFriendly'}}).inArea);return {id:u.id,lof:visible.length>0,zoc:zoc||!!hackArea,contact,affected:affected.includes(u.id),points:visible};}).filter(r=>(!units.find(u=>u.id===r.id).armedTurret||!K.marker(active)&&(r.lof||r.contact))&&(r.lof||r.affected||r.contact||(r.zoc&&(!active.stealthSilent||K.sixth(units.find(u=>u.id===r.id))||units.find(u=>u.id===r.id).combatInstinct))));}
export function attackSpec(a,b,m,terrain,{moving=false,reactive=false,manualCover='auto',allowMarker=false,triangulated=false,respondingAttack=false,coordinated=false,spearhead=true,saturation=false}={}){
 if(m.guided&&(reactive||!a.guided||!S.has(b,'targeted')||(a.guidedAttacksTurn||0)>=5||b.enclosedRoom))return {can:false,reason:'制导仅限主动轮、具备制导技能、已被标记且不在封闭房间的目标；每回合最多五次',m,sv:0,base:0,mods:[],cov:false};
 if(a.armedTurret&&(!reactive||K.marker(b)||!['cc','bs'].includes(m.kind)))return {can:false,reason:'炮塔只能对主动敌方模型宣告射击或近战 ARO',m,sv:0,base:0,mods:[],cov:false};
 if(m.sf&&(!reactive||!a.suppressive||a.suppressive.weapon!==m.sfKey||a.suppressive.modeId!==m.id))return {can:false,reason:'压制模式只限已进入该武器压制状态的 ARO',m,sv:0,base:0,mods:[],cov:false};
 if(reactive)a=revealedActor(a);
 if(b.offTable||!S.present(b)||S.has(b,'hiddenDeployment')||reactive&&(a.noARO||a.isDecoy))return {can:false,reason:'目标离场或单位不能宣告 ARO',m,sv:0,base:0,mods:[],cov:false};
 if(m.kind==='hack')return H.spec(a,b,m.hackingProgram,{reactive,repeaters:a.hackingRepeaters||[],route:{kind:'autoFriendly'},wipMod:-Math.abs(b.ecmHacking||0)});
 if(respondingAttack)a={...a,zoneReturnFire:true};
 const d=E.edgeDistance(a,b),rawRange=m.bands.find(([n])=>d<=n+1e-8)?.[1]??null,rm=a.xVisor&&rawRange<0?Math.min(0,rawRange+3):rawRange,cov=['bs','impact'].includes(m.kind)&&(manualCover==='auto'?E.cover(a,b,terrain):manualCover==='yes'),directMarker=K.marker(b)&&a.msv===3&&!reactive;
 let reason='';if(m.requiresSkill&&!a[m.requiresSkill])reason='该配置没有对应技能';else if(!S.allowed(a,'attack'))reason='当前状态不能攻击';else if(!S.present(b)||S.has(b,'hiddenDeployment'))reason='目标不在场';else if(K.marker(b)&&!allowMarker&&!directMarker)reason='先发现迷彩标记，或声明发现＋攻击';else if(m.kind==='cc'){if(!E.inContact(a,b,terrain))reason='近战需要轮廓接触，不能隔着实体墙攻击';}else if(d<.02)reason='已接触敌人，请选择近战武器';else if(!m.guided&&(!E.visibility(a,b,terrain).visible||(!moving&&!E.front(a,b)&&!(respondingAttack&&K.sixth(a)))))reason='没有合法视线';else if(m.kind!=='direct'&&rm===null)reason='超出射程';
 const mods=m.guided?[['射程',rm||0],['被标记',3],['ECM 制导',-Math.abs(b.ecmGuided||0)]]:K.attackMods(a,b,m,{rm,cov,triangulated,directMarker}),base=m.kind==='cc'?(a.cc||14):m.attribute==='wip'?(a.wip||13):a.bs;
 const zoneMod=E.visibilityMod(a,b,terrain,{respondingAttack});if(m.kind!=='cc'&&!m.guided&&zoneMod&&!(respondingAttack&&K.sixth(a)))mods.push(['能见度区域',zoneMod]);
 const cc=m.kind==='cc',fullBurst=reactive?(!cc&&(a.totalReaction||a.neurocinetics)):!(a.neurocinetics&&!cc),bonus=cc?(!reactive?K.martial(a).burst+(a.ccBurstBonus||0):0):((a.neurocinetics?reactive:!reactive)?(a.bsBurstBonus||0)+(reactive&&a.neurocinetics?a.neuroBurstBonus||0:0):0),burst=adjustBurst(reactive&&a.aroBurst?Math.min(6,a.aroBurst):fullBurst?Math.min(6,m.b+bonus):1,{coordinated:!reactive&&coordinated,spearhead,saturation});
 return {can:!reason,reason,d,rm,cov:m.guided?false:cov,base,mods,sv:m.kind==='direct'?0:Math.max(0,base+E.clamp(mods.reduce((n,v)=>n+v[1],0),-12,12)),m:{...K.attackMode(a,m),b:m.kind==='cc'?Math.min(6,burst+(a.ccSupport||0)):m.guided?1:m.sf?3:a.reservedShots?Math.min(burst,a.reservedShots):burst}};
}
export function affectedBy(shape,u,a,m,terrain){return E.templateHits(shape,u,terrain)&&(m.kind!=='direct'||E.visibility(a,u,terrain).visible);}
export function makeTemplate(a,point,m,templates){if(!m.template||!point)return null;if(m.template==='circle')return {kind:'circle',origin:{x:point.x,y:point.y,z:point.z||0},r:templates.circle.diameter/2};const angle=Math.atan2(point.y-a.y,point.x-a.x),r=E.radius(a);return E.teardrop({x:a.x+r*Math.cos(angle),y:a.y+r*Math.sin(angle),z:a.z||0},angle,templates[m.template].length,templates[m.template].width,templates[m.template].poly);}
// Declaration choices must not query range bands or template coverage.
export function declarationSpec(a,b,m,terrain,options={}){
 if(m.kind==='hack')return H.spec(a,b,m.hackingProgram,{reactive:options.reactive,declaration:true});
 return attackSpec(a,b,m.kind==='cc'?m:{...m,bands:[[Infinity,0]]},terrain,options);
}
export function declarationPoints(v,a,path,terrain,weapon,modeId){
 const m=weaponMode(weapon,modeId);if(!m||!ownsMode(v,weapon,m.id))return [];
 return (m.kind==='cc'?[a]:E.samplePath(path,.15)).filter(p=>declarationSpec(v,{...a,...p},m,terrain,{reactive:true,respondingAttack:(a.attackingTarget===v.id||a.attackingTargets?.includes(v.id))}).can).map(p=>({...p,z:p.z||0}));
}
export function templateFailure(shape,a,main,m,terrain,units=[]){
 if(!m?.template)return '';
 if(!shape||!main||!affectedBy(shape,main,a,m,terrain))return '模板未覆盖主目标：攻击失败';
 if(units.some(n=>n.id!==a.id&&S.present(n)&&(n.team===a.team||n.team===-1)&&affectedBy(shape,n,a,m,terrain)))return '模板覆盖友军或 HVT：攻击取消';
 return '';
}
export function reactionTemplate(v,a,m,terrain,templates,units=[]){
 if(!m.template)return null;if(!templates||Math.abs((v.z||0)-(a.z||0))>.12)return null;
 const shape=makeTemplate(v,a,m,templates);if(!affectedBy(shape,a,v,m,terrain))return null;
 if(units.some(n=>n.id!==v.id&&n.id!==a.id&&S.present(n)&&(n.team===v.team||n.team===-1)&&affectedBy(shape,n,v,m,terrain)))return null;
 return shape;
}
export function bestReaction(v,a,path,terrain,weapon=v.weapon,modeId,templates,units=[]){const m=weaponMode(weapon,modeId);if((v.loadout&&!ownsMode(v,weapon,m?.id))||!m)return null;const points=m.kind==='cc'?[a]:E.samplePath(path,.15).map(p=>({...a,...p}));let best=null;for(const p of points){const spec=attackSpec(v,p,m,terrain,{reactive:true,respondingAttack:(a.attackingTarget===v.id||a.attackingTargets?.includes(v.id))}),shape=m.template?reactionTemplate(v,p,m,terrain,templates,units):null;if(m.template&&!shape)continue;if(spec.can&&(!best||spec.sv>best.spec.sv||spec.sv===best.spec.sv&&spec.d<best.spec.d))best={point:{...p,z:p.z||0},spec,shape};}return best;}
export function attackSavePlan(target,hits,sv,m,cov){if(!m.noSavingRoll)return {...V.planSaves(target,hits,sv,m,cov),hackingProgram:m.hackingProgram};return {targetId:target.id,targetName:target.name||target.id,target:structuredClone(target),ammo:'无过保',hits:hits.length,criticals:hits.filter(d=>E.critical(d,sv)).length,initialCount:0,pending:[],saves:[],damage:0,effects:hits.length?(m.effects||[]).filter(e=>!(target.stateImmunities||[]).includes(e)):[],round:0};}
export function saveHits(target,hits,sv,m,cov,roll){return V.finishSaves(attackSavePlan(target,hits,sv,m,cov),roll);}
export const specialDice=(u,m,options={})=>K.specialDice(u,m,options)+(options.longSkill||!m||['direct','hack'].includes(m.kind)?0:Math.max(0,Number(m.sd)||0));
// A single shared active roll is opposed separately by each affected reactor.
// All losses are applied after every attack has resolved, preserving simultaneous AROs.
export function resolveOrder({active,attackPoint,mainTarget,weapon,modeId,shape,path,reactions,units,terrain,manualCover='auto',idle=false,activeSkill='attack',pools=null,deferSaves=false,triangulated=false,startedMarker=false,neutralUnits=[],targetless=null,allocations=null,sdTarget=null,sdTargets=null},rng=Math.random){if(allocations?.length&&!pools)pools=preparePools({active,attackPoint,mainTarget,weapon,modeId,shape,path,reactions,units,terrain,manualCover,idle,activeSkill,triangulated,startedMarker,neutralUnits,targetless,allocations,sdTarget,sdTargets},rng);if(!pools&&(activeSkill==='zeroPain'||Object.values(reactions).some(r=>r.action==='zeroPain')))pools=preparePools({active,attackPoint,mainTarget,weapon,modeId,shape,path,reactions,units,terrain,manualCover,idle,activeSkill,triangulated,startedMarker,neutralUnits,targetless},rng);validateEquipment({active,weapon,modeId,reactions,units,idle,activeSkill});const roll=()=>1+Math.floor(rng()*20),a={...active,...attackPoint},m=weaponMode(weapon,modeId),main=units.find(v=>v.id===mainTarget),moving=E.pathLength(path)>0,mainSpec=!idle&&main?attackSpec(a,main,m,terrain,{moving,manualCover,triangulated}):null,valid=!idle&&mainSpec?.can&&!templateFailure(shape,a,main,m,terrain,[...units,...neutralUnits]),ad=pools?kept(pools.active):(valid&&m.kind!=='direct'&&!coupDeGrace(a,main,m)?Array.from({length:mainSpec.m.b},roll):[]),losses={},details=[],dodgers=[],zoneResults=[];const add=(id,n)=>losses[id]=(losses[id]||0)+n;
if(mainSpec&&pools)mainSpec.sv=pools.active.sv;
let targetlessSuccess=!!targetless&&ad.some(d=>d<=pools.active.sv);
let activeResetOK=activeSkill==='reset'&&ad.some(d=>d<=(pools?.active.sv||0));
const linkedSuccess=new Map(peripheralPartners(active,units).filter(u=>S.allowed(u,activeSkill)).map(u=>{const p=pools?.reactions[u.id];return [u.id,!!p&&kept(p).some(d=>d<=p.sv)];}));
let activeDodgeOK=activeSkill==='dodge'&&ad.some(d=>d<=pools?.active.sv);
const primarySpec=mainSpec,primaryDice=ad;
const affected=allocations?.length?allocations.map(n=>units.find(v=>v.id===n.targetId)).filter(v=>v&&attackSpec(a,v,m,terrain,{moving,manualCover,triangulated}).can):valid?(shape?units.filter(v=>v.id!==a.id&&S.onTable(v)&&!v.offTable&&affectedBy(shape,v,a,m,terrain)):[main]):[];
if(affected.some(v=>v.team===a.team))throw Error('模板覆盖友军，不能宣告该攻击');
for(const v of units.filter(v=>v.team!==a.team&&S.present(v)&&!v.offTable&&(!S.has(v,'hiddenDeployment')||reactions[v.id]))){const activePool=pools?.activeTargets?.[v.id],ad=activePool?kept(activePool):allocations?.length?[]:primaryDice,mainSpec=allocations?.length?attackSpec(a,v,m,terrain,{moving,manualCover,triangulated}):primarySpec;const hit=affected.some(t=>t.id===v.id),r=reactions[v.id],reactionTarget=units.find(n=>n.id===r?.targetId)||active,otherTarget=reactionTarget.id!==active.id,action=r?.action||'none',rm=r?.weapon?weaponMode(r.weapon,r.modeId):null;let spec=null;if(action==='attack'&&rm){const point={...(units.find(n=>n.id===r.targetId)||active),...r.point};spec=attackSpec({...v,reservedShots:r.reservedShots},point,rm,terrain,{reactive:true,respondingAttack:hit});if(templateFailure(r.shape,v,point,rm,terrain,[...units,...neutralUnits]))spec=null;}
const dodgeSV=K.dodgeSV(v,{noLof:!!r&&!r.lof}),bSV=pools?.reactions[v.id]?.sv??(action==='dodge'?dodgeSV:action==='reset'?K.resetSV(v):spec?.can?spec.sv:0),bd=pools?.reactions[v.id]?kept(pools.reactions[v.id]):bSV>0?Array.from({length:spec?.can?spec.m.b:1},roll):[];let ah=[],bh=[],dodged=false;const duelASV=pools?.reactions[v.id]?.activeSV??activePool?.sv??mainSpec?.sv??pools?.active.sv??0;
if(hit&&(m.kind==='direct'||rm?.kind==='direct')){dodged=action==='dodge'&&bd[0]<=bSV;ah=m.kind==='direct'?(dodged?[]:[-1]):ad.filter(d=>d<=duelASV);bh=spec?.can?bd.filter(d=>d<=bSV):[];}
else if(hit&&otherTarget&&action==='attack'){ah=ad.filter(d=>d<=duelASV);bh=spec?.can?bd.filter(d=>d<=bSV):[];}
else if(hit){const resolved=(['reset','zeroPain'].includes(action)&&m.kind!=='hack'&&!m.guided)||(action==='dodge'&&m.kind==='hack')?{a:ad.filter(d=>d<=duelASV),b:bd.filter(d=>d<=bSV)}:E.resolveDice(ad,duelASV,bd,bSV);ah=resolved.a;bh=spec?.can?resolved.b:[];dodged=action==='dodge'&&resolved.b.length>0;}
else{bh=spec?.can?bd.filter(d=>d<=bSV):[];dodged=action==='dodge'&&bd[0]<=bSV;}
if(spec?.can&&rm?.kind==='direct'){const pd=otherTarget?kept(pools?.reactions[reactionTarget.id]||{dice:[]}):ad,psv=otherTarget?pools?.reactions[reactionTarget.id]?.sv||0:duelASV;const avoided=activeSkill==='dodge'&&pd.some(d=>d<=psv);bh=avoided?[]:[-1];if(activeSkill==='dodge'){if(otherTarget)linkedSuccess.set(reactionTarget.id,linkedSuccess.get(reactionTarget.id)&&avoided);else activeDodgeOK=activeDodgeOK&&avoided;}}
if((activeSkill==='dodge'&&rm?.kind!=='hack'||['reset','zeroPain'].includes(activeSkill)&&rm?.kind==='hack')&&spec?.can&&rm?.kind!=='direct'){const pd=otherTarget?kept(pools?.reactions[reactionTarget.id]||{dice:[]}):ad,psv=otherTarget?pools?.reactions[reactionTarget.id]?.sv||0:duelASV;const opposed=E.resolveDice(pd,psv,bd,bSV);bh=opposed.b;if(otherTarget)linkedSuccess.set(reactionTarget.id,linkedSuccess.get(reactionTarget.id)&&opposed.a.length>0);else{if(activeSkill==='reset')activeResetOK=activeResetOK&&opposed.a.length>0;activeDodgeOK=activeDodgeOK&&opposed.a.length>0;}}
if(rm?.template&&(!r.shape||!affectedBy(r.shape,{...(units.find(n=>n.id===r.targetId)||active),...r.point},v,rm,terrain))){spec=null;bh=[];}
let zoneOpposed=false,zoneA=[],zoneB=[];
if(targetless&&spec?.can&&Z.opposes(targetless,v,{...(units.find(n=>n.id===r.targetId)||active),...r.point},rm,terrain)){
 const z=E.resolveDice(ad,pools.reactions[v.id]?.activeSV??pools.active.sv,bd,bSV);bh=z.b;zoneA=z.a;zoneOpposed=true;targetlessSuccess=targetlessSuccess&&z.a.length>0;
}
if(r?.targetless){const rz=r.targetless,zsv=pools?.reactions[v.id]?.sv||0;let ok=bd.some(d=>d<=zsv);zoneB=bd.filter(d=>d<=zsv);
 if(hit&&Z.opposes(rz,a,v,m,terrain)){const z=E.resolveDice(ad,duelASV,bd,zsv);ah=z.a;zoneB=z.b;ok=z.b.length>0;zoneOpposed=true;}
 zoneResults.push({actorId:v.id,declaration:rz,success:ok,dice:bd,sv:zsv});
}
if(!hit&&!r)continue;
const make=(t,h,s,w,c)=>deferSaves?attackSavePlan(t,h,s,w,c):saveHits(t,h,s,w,c,roll);const incoming=make(v,ah,duelASV,mainSpec?.m||m,hit&&m.kind==='bs'?mainSpec.cov:false),outgoing=spec?make(reactionTarget,bh,bSV,spec.m,spec.cov):{damage:0,saves:[],effects:[]};if(hit&&coupDeGrace(a,v,m)){Object.assign(incoming,{hits:1,initialCount:0,pending:[],saves:[],damage:v.hp+(v.remotePresence&&v.attribute==='STR'?2:1),execution:true});}if(incoming.targetId)incoming.attacker={...a,hackingArea:m.kind==='hack'};if(outgoing.targetId)outgoing.attacker={...v,hackingArea:rm?.kind==='hack'};add(v.id,incoming.damage);add(reactionTarget.id,outgoing.damage);if(dodged)dodgers.push(v.id);details.push({activePoolId:activePool?.id,zoneOpposed,zoneA,zoneB,id:v.id,hit,action,bSV,bd,ah,bh,incoming,outgoing,dodged,opposed:!otherTarget&&(zoneOpposed||(hit&&m.kind!=='direct'&&rm?.kind!=='direct'&&((action==='dodge'&&m.kind!=='hack')||(['reset','zeroPain'].includes(action)&&(m.kind==='hack'||m.guided&&action==='reset'))||!!spec?.can))||((activeSkill==='dodge'&&rm?.kind!=='hack'||['reset','zeroPain'].includes(activeSkill)&&rm?.kind==='hack')&&!!spec?.can&&rm?.kind!=='direct')),aSV:duelASV,resetSuccess:action==='reset'&&(hit&&(m.kind==='hack'||m.guided)?E.resolveDice(ad,duelASV,bd,bSV).b.length>0:bd.some(d=>d<=bSV)),activeDodge:activeSkill==='dodge'});}

const extraPlans=[];for(const r of Object.values(reactions)){if(r.action!=='attack'||!r.shape)continue;const v=units.find(n=>n.id===r.id),rm=weaponMode(r.weapon,r.modeId),d=details.find(n=>n.id===v.id);if(!d||templateFailure(r.shape,v,{...(units.find(n=>n.id===r.targetId)||active),...r.point},rm,terrain,[...units,...neutralUnits]))continue;const hits=rm.kind==='direct'?[-1]:d.bd.filter(n=>n<=d.bSV);for(const n of units.filter(n=>n.id!==(r.targetId||active.id)&&n.id!==v.id&&S.onTable(n)&&!n.offTable&&affectedBy(r.shape,n,v,rm,terrain))){if(n.team===v.team||n.team===-1)throw Error('模板覆盖友军或中立单位');let nh=hits;if(activeSkill==='dodge'&&(n.id===active.id||linkedSuccess.has(n.id))){const p=n.id===active.id?pools?.active:pools?.reactions[n.id],sv=K.dodgeSV(n,{noLof:!canSee(n,v,terrain)}),pd=kept(p),opposed=rm.kind==='direct'?null:E.resolveDice(pd,sv,d.bd,d.bSV),avoided=rm.kind==='direct'?pd.some(x=>x<=sv):opposed.a.length>0;nh=rm.kind==='direct'?(avoided?[]:[-1]):opposed.b;if(n.id===active.id)activeDodgeOK=activeDodgeOK&&avoided;else linkedSuccess.set(n.id,linkedSuccess.get(n.id)&&avoided);}const plan=deferSaves?V.planSaves(n,nh,d.bSV,K.attackMode(v,rm),false):saveHits(n,nh,d.bSV,K.attackMode(v,rm),false,roll);plan.attacker={...v};extraPlans.push(plan);}}
if(activeDodgeOK)dodgers.unshift(a.id);if(activeSkill==='dodge')for(const [id,ok] of linkedSuccess)if(ok)dodgers.push(id);
if(targetless)zoneResults.unshift({actorId:a.id,declaration:targetless,success:targetlessSuccess,dice:ad,sv:pools?.active.sv});
return V.aggregate({linkedResetIds:activeSkill==='reset'?[...linkedSuccess].filter(([id,ok])=>ok).map(([id])=>id):[],zoneResults,activeResetOK,ad,sv:pools?.active.sv??mainSpec?.sv,activeSkill,losses,details,extraPlans,dodgers,valid:allocations?.length?affected.length>0:valid,reason:mainSpec?.reason||templateFailure(shape,a,main,m,terrain,[...units,...neutralUnits])});}
export function previewOdds(a,b,m,spec,reaction,terrain){if(m.noSavingRoll||m.kind==='hack'||reaction?.weapon?.startsWith('hack_'))return null;if(spec?.sv>20||a.bsAttackNegative||b.bsAttackNegative||a.msv||b.msv||a.surpriseAttack||a.triangulated||m.ammo||m.saveAttribute||S.labels(a).length||S.labels(b).length)return null;if((a.ftLevel||0)>=2||(b.ftLevel||0)>=2)return null;if(!spec?.can||m.kind==='direct'||m.continuous||m.saves!==1||m.ap)return null;const r=reaction;let rs=null;if(r?.action==='attack')rs=attackSpec(b,{...a,...r.point},weaponMode(r.weapon,r.modeId),terrain,{reactive:true});if(rs&&(rs.m.saves!==1||rs.m.ap||rs.m.continuous))return null;return E.odds({can:true,aSV:spec.sv,bSV:r?.action==='dodge'?E.clamp(b.ph-(r.lof?0:3),0,20):rs?.can?rs.sv:0,bDamage:!!rs?.can,w:m,rw:rs?.m||m,bc:spec.cov,ac:rs?.cov||false},a,b);}

export const kept=p=>p?.dice.filter((_,i)=>!(Array.isArray(p.discard)?p.discard:[p.discard]).includes(i))||[];
function prepareSinglePool(args,rng=Math.random){
 validateEquipment(args);
 const {active,attackPoint,mainTarget,weapon,modeId,path,reactions,units,terrain,idle=false,activeSkill='attack',triangulated=false,startedMarker=false}=args,a={...active,...attackPoint},m=weaponMode(weapon,modeId),target=units.find(v=>v.id===mainTarget),spec=target?attackSpec(a,target,m,terrain,{moving:E.pathLength(path)>0,triangulated}):null,roll=()=>1+Math.floor(rng()*20);
 const sd=!idle?(args.activeSD??specialDice(a,m,{longSkill:triangulated||args.longSkill})):0;
 const value=activeSkill==='zeroPain'?zeroSpec(active).sv:activeSkill==='dodge'?K.dodgeSV(active):activeSkill==='reset'?K.resetSV(active):spec?.sv||0,count=activeSkill==='zeroPain'?2:['dodge','reset'].includes(activeSkill)?1:!idle&&spec?.can&&!templateFailure(args.shape,a,target,m,terrain,[...units,...(args.neutralUnits||[])])&&m.kind!=='direct'&&!coupDeGrace(a,target,m)?(spec.m.b+sd):0;
 const pool={active:{id:active.id,name:active.name,team:active.team,sv:value,baseSV:value,mods:spec?.mods||[],dice:Array.from({length:count},roll),sd:count?sd:0,discard:null,skill:activeSkill},reactions:{}};
 if(['dodge','reset'].includes(activeSkill))for(const u of peripheralPartners(active,units).filter(u=>S.allowed(u,activeSkill))){const sv=activeSkill==='dodge'?K.dodgeSV(u):K.resetSV(u);pool.reactions[u.id]={id:u.id,name:u.name+' · 联动',team:u.team,sv,dice:[roll()],sd:0,skill:activeSkill};}
 const addZonePool=(u,d,p,reactive,lof)=>{const sp=Z.spec(u,d,terrain,{reactive,lof}),sd=K.specialDice(u,{kind:'bs'},{longSkill:!!d.speculative});Object.assign(p,{sv:sp.can?sp.sv:0,baseSV:sp.sv,mods:sp.mods,skill:'targetless',label:sp.weapon?.name,reason:sp.reason,sd:sp.can?sd:0,discard:null,dice:sp.can?Array.from({length:sp.burst+sd},roll):[]});};
 if(args.targetless)addZonePool(active,args.targetless,pool.active,false,true);
 const modified=(sp,delta,ignore=false)=>ignore?sp.sv:Math.max(0,sp.base+E.clamp(sp.mods.reduce((n,v)=>n+v[1],0)+delta,-12,12));
 for(const [id,r] of Object.entries(reactions)){
  const v=units.find(u=>u.id===(r.id||id)),rm=r.action==='attack'?weaponMode(r.weapon,r.modeId):null,hit=!idle&&(id===mainTarget||!!args.shape&&affectedBy(args.shape,v,a,m,terrain)),rs=rm&&!templateFailure(r.shape,v,{...(units.find(n=>n.id===r.targetId)||active),...r.point},rm,terrain,[...units,...(args.neutralUnits||[])])?attackSpec({...v,reservedShots:r.reservedShots},{...(units.find(n=>n.id===r.targetId)||active),...r.point},rm,terrain,{reactive:true,respondingAttack:hit}):null;
  const opposed=(!r.targetId||r.targetId===active.id)&&((hit&&m.kind!=='direct'&&rm?.kind!=='direct'&&(r.action==='attack'||r.action==='dodge'&&m.kind!=='hack'||['reset','zeroPain'].includes(r.action)&&(m.kind==='hack'||m.guided&&r.action==='reset')))||((activeSkill==='dodge'&&rm?.kind!=='hack'||['reset','zeroPain'].includes(activeSkill)&&rm?.kind==='hack')&&rs?.can&&rm?.kind!=='direct'));
  const attackPenalty=(opposed&&v.suppressive&&E.edgeDistance(v,a)<=24?-3:0)+(opposed&&rm?K.opposingMod(v,rm,{target:a}):0)+(r.action==='zeroPain'&&hit&&m.kind==='hack'?-3:0),reactPenalty=(opposed&&a.suppressive&&E.edgeDistance(a,v)<=24?-3:0)+(opposed&&hit?K.opposingMod(a,m,{surprise:startedMarker,target:v,lof:r.lof}):0)+(activeSkill==='zeroPain'&&rm?.kind==='hack'?-3:0);
  const aDelta=opposed&&a.naturalBornWarrior&&m.kind==='cc'&&rm?.kind==='cc'?Math.max(0,attackPenalty):opposed&&a.warhorse&&rm&&rm.kind!=='cc'?attackPenalty-(v.bsAttackNegative||0):attackPenalty,bDelta=opposed&&v.naturalBornWarrior&&rm?.kind==='cc'&&m.kind==='cc'?Math.max(0,reactPenalty):opposed&&hit&&v.warhorse&&m.kind!=='cc'?reactPenalty-(a.bsAttackNegative||0):reactPenalty;
  const activeSV=activeSkill==='zeroPain'?Math.max(0,zeroSpec(active).sv+aDelta):activeSkill==='dodge'?K.dodgeSV(active,{opposedMod:aDelta,noLof:rm?.kind==='direct'&&!E.front(a,v)}):activeSkill==='reset'?K.resetSV(active):spec&&m.kind!=='direct'?modified(spec,m.guided?Math.max(0,aDelta):aDelta,triangulated):value;
  const sv=r.action==='zeroPain'?Math.max(0,zeroSpec(v,true).sv+bDelta):r.action==='dodge'?K.dodgeSV(v,{noLof:!r.lof,opposedMod:bDelta}):r.action==='reset'?K.resetSV(v):rs?.can&&rm.kind!=='direct'?modified(rs,bDelta):0;
  const bonus=r.action==='attack'?specialDice(v,rm):0;
  const diceCount=sv>0?(r.action==='zeroPain'?2:r.action==='attack'?rs.m.b:1)+bonus:0;
  pool.reactions[v.id]={id:v.id,name:v.name,team:v.team,sv,activeSV,mods:rs?.mods||[],opposedMod:bDelta,activeOpposedMod:aDelta,dice:Array.from({length:diceCount},roll),sd:bonus,discard:null,skill:r.action};
  if(id===mainTarget)pool.active.sv=activeSV;else if(opposed&&['dodge','reset','zeroPain'].includes(activeSkill))pool.active.sv=Math.min(pool.active.sv,activeSV);
 }
 for(const [id,r] of Object.entries(reactions))if(r.targetless)addZonePool(units.find(u=>u.id===id),r.targetless,pool.reactions[id],true,r.lof);
 if(args.targetless)for(const rp of Object.values(pool.reactions))rp.activeSV=pool.active.sv;
 for(const [id,r] of Object.entries(reactions)){const v=units.find(n=>n.id===id),rp=pool.reactions[id],rm=r.action==='attack'?weaponMode(r.weapon,r.modeId):null;
 if(args.targetless&&rm&&Z.opposes(args.targetless,v,{...(units.find(n=>n.id===r.targetId)||active),...r.point},rm,terrain)){const as=Z.spec(active,args.targetless,terrain),rs=attackSpec({...v,reservedShots:r.reservedShots},{...(units.find(n=>n.id===r.targetId)||active),...r.point},rm,terrain,{reactive:true});rp.activeSV=Math.max(0,as.base+E.clamp(as.mods.reduce((n,m)=>n+m[1],0)+K.opposingMod(v,rm,{target:active}),-12,12));if(rs.can)rp.sv=Math.max(0,rs.base+E.clamp(rs.mods.reduce((n,m)=>n+m[1],0)+K.opposingMod(active,{kind:'bs'},{target:v}),-12,12));}
 if(r.targetless&&!idle&&id===mainTarget&&spec?.can&&Z.opposes(r.targetless,a,v,m,terrain)){const rs=Z.spec(v,r.targetless,terrain,{reactive:true,lof:r.lof});rp.sv=Math.max(0,rs.base+E.clamp(rs.mods.reduce((n,m)=>n+m[1],0)+K.opposingMod(a,m,{surprise:startedMarker,target:v,lof:r.lof}),-12,12));rp.activeSV=modified(spec,K.opposingMod(v,{kind:'bs'},{target:a}),triangulated);pool.active.sv=rp.activeSV;}
 }
 return pool;
}

export function releaseDelayed(reactions,revealed){for(const r of Object.values(reactions)){if(r.action!=='delay')continue;Object.assign(r,{action:revealed?'':'none',draft:'',wave:2,wasDelayed:revealed,delayExpired:!revealed});}}

// FAQ 0.1: SD is not Burst. Apply Burst caps/reductions before adding SD dice.
export function adjustBurst(b,{coordinated=false,spearhead=true,saturation=false}={}){const n=coordinated?(spearhead?Math.ceil(b/2):1):b;return Math.max(1,n-(saturation?1:0));}
// Reveal only when an attack actually forces a save, then check the actual
// silhouette before generating saves for a concealed model behind total cover.
export function revealSavingTarget(plan,target,terrain){
 if(!plan.initialCount||!K.marker(target))return plan;
 K.reveal(target);plan.revealedTarget=true;plan.target=structuredClone(target);
 if(plan.attacker&&!E.visibility(plan.attacker,target,terrain).visible){Object.assign(plan,{hits:0,criticals:0,initialCount:0,pending:[],saves:[],damage:0,effects:[],notHitAfterReveal:true});}
 return plan;
}

// Burst is allocated at declaration. SD belongs to one target pool, never copied per target.
export function validateAllocations(args,{declaration=true}={}){
 const {active,attackPoint,weapon,modeId,units,terrain,allocations,sdTarget}=args,a={...active,...attackPoint},m=weaponMode(weapon,modeId);
 if(!allocations?.length)return {can:false,reason:'至少分配一发给一个目标'};
 if(m.kind!=='bs'||m.template||m.guided)return {can:false,reason:'此模式使用单目标或模板专用流程'};
 const first=units.find(u=>u.id===allocations[0].targetId);if(!first)return {can:false,reason:'目标不存在'};
 const total=burstLimit(a,first,m,terrain,weapon),ids=new Set();let used=0;
 for(const n of allocations){const v=units.find(u=>u.id===n.targetId);if(!Number.isInteger(n.burst)||n.burst<1||ids.has(n.targetId))return {can:false,reason:'每个目标须分配正整数B，目标不可重复'};ids.add(n.targetId);used+=n.burst;
 if(!v||v.team===a.team||v.team<0||!S.onTable(v))return {can:false,reason:'分枪目标必须是在场敌军'};
 const sp=(declaration?declarationSpec:attackSpec)(a,v,m,terrain,{moving:E.pathLength(args.path||[])>0,manualCover:args.manualCover,allowMarker:args.allowMarkers?.includes(v.id),triangulated:args.triangulated});if(declaration&&!sp.can)return {can:false,reason:v.name+'：'+sp.reason};}
 if(used>total)return {can:false,reason:'分配B总数超过可用B'+total};
 if(used<total)return {can:false,total,used,reason:'主动轮必须分配完整B：已分配 '+used+'/'+total+' B，还需分配 '+(total-used)+' B'};
 const sd=specialDice(a,m,{longSkill:args.triangulated||args.longSkill});const destinations=args.sdTargets||(sd===1?[sdTarget]:Array.from({length:sd},()=>sdTarget));if(sd&&(destinations.length!==sd||Array.from(destinations).some(id=>!ids.has(id))))return {can:false,reason:'须将每颗SD指定给一个已分配B的目标'};
 return {can:true,total,used,sd,sdTargets:destinations};
}
export function activePools(pools){return pools.activeTargets?Object.values(pools.activeTargets):[pools.active];}
export function preparePools(args,rng=Math.random){
 if(!args.allocations?.length)return prepareSinglePool(args,rng);
 const check=validateAllocations(args,{declaration:false});if(!check.can)throw Error(check.reason);
 const targets={},reactions={};
 for(const n of args.allocations){const p=prepareSinglePool({...args,allocations:null,mainTarget:n.targetId,active:{...args.active,reservedShots:n.burst},attackPoint:{...args.attackPoint,reservedShots:n.burst},activeSD:check.sdTargets.filter(id=>id===n.targetId).length},rng);
 const target=args.units.find(v=>v.id===n.targetId);Object.assign(p.active,{id:'active:'+n.targetId,targetId:n.targetId,allocatedB:n.burst,name:args.active.name+' → '+target.name,label:'分配 B'+n.burst,reason:p.active.dice.length?'':attackSpec({...args.active,...args.attackPoint},target,weaponMode(args.weapon,args.modeId),args.terrain).reason});targets[n.targetId]=p.active;
 // Only this defender opposes this target's dice. Other reactors are retained once below.
 if(p.reactions[n.targetId])reactions[n.targetId]=p.reactions[n.targetId];
 }
 const other=Object.fromEntries(Object.entries(args.reactions).filter(([id])=>!targets[id]));
 if(Object.keys(other).length)Object.assign(reactions,prepareSinglePool({...args,allocations:null,reactions:other,idle:true,activeSkill:'idle'},rng).reactions);
 return {active:{id:args.active.id,name:args.active.name,team:args.active.team,dice:[],sd:0,sv:0,skill:'attack'},activeTargets:targets,reactions};
}

export function burstLimit(a,target,m,terrain,weapon){const b=attackSpec(a,target,m,terrain).m.b;return ARMS[weapon]?.disposable&&!a.reservedShots?Math.min(b,Math.max(0,ARMS[weapon].disposable-(a.spentWeapons?.[weapon]||0))):b;}
