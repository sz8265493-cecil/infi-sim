import * as E from './engine.js?v=117';
import * as S from './states.js?v=109';
export const impLevel=u=>S.has(u,'impersonation1')?1:S.has(u,'impersonation2')?2:0;
export const marker=u=>!!u&&(S.has(u,'camouflaged')||!!impLevel(u));
export const delayable=u=>marker(u)||S.has(u,'holoecho');
export const discoverable=u=>delayable(u)||S.has(u,'holomask')||S.has(u,'hiddenDeployment');
export const sixth=u=>!!u.sixthSense||(u.ftLevel||0)>=5;
export const fullVision=u=>!!u.visor360||marker(u);
export const mimetism=(a,b,{discover=false,directMarker=false}={})=>(b.nfbWhiteNoise||b.nfbCybermask)?0:directMarker?Math.abs(b.mim||0):Math.max(0,Math.abs(b.mim||0)-(a.msv>=2?6:a.msv===1?3:0));
export const albedoMod=(a,b)=>!b.nfbWhiteNoise&&!b.nfbCybermask&&(a.msv||a.marksmanship)?-Math.abs(b.albedo||0):0;
export const specialDice=(u,m,{longSkill=false}={})=>longSkill||!m||['direct','hack'].includes(m.kind)?0:m.kind==='cc'?martial(u).sd+(u.ccSpecialDice||0):(['bs','impact'].includes(m.kind)?((u.ftLevel||0)>=2?1:0)+(u.bsSpecialDice||0):0);
export function attackMode(u,m){const cc=m.kind==='cc',bs=['bs','impact','direct'].includes(m.kind);if(!cc&&!bs)return {...m};const added=cc?u.ccAmmo:u.bsAmmo,ammo=[...new Set([...(m.ammo||(m.saves===3?(m.ap?'AP+EXP':'EXP'):m.ap?'AP':'N')).split('+'),...(Array.isArray(added)?added:added?[added]:[])])].join('+');return {...m,ammo,continuous:m.continuous||bs&&u.bsContinuous,srMod:(m.srMod||0)+(cc?u.ccSaveMod||0:u.bsSaveMod||0)};}
export const turnKey=state=>`${state.round}:${state.team}`;
export const markerKey=u=>`${u.id}:${u.markerGeneration||0}`;
export function reveal(u){if(!u)return;if(S.has(u,'hiddenDeployment'))u.hiddenRevealPending=true;if(S.has(u,'holomask'))u.maskCancelled=true;if(S.has(u,'holoecho'))u.holoCancelled=true;delete u.cybermask;delete u.nfbCybermask;if(marker(u)&&u.camouflageUses===1)u.camouflageUsed=true;if(u.isDeployable&&u.actualSilhouette!==undefined)u.s=u.actualSilhouette;u.states=(u.states||[]).filter(k=>!['camouflaged','hiddenDeployment','impersonation1','impersonation2','holomask','holoecho'].includes(k));}
export function enterCamo(u){if(u.camouflageUses===1&&u.camouflageUsed)return false;u.states=[...new Set([...(u.states||[]),'camouflaged'])];u.markerGeneration=(u.markerGeneration||0)+1;return true;}
export function canRecamo(u,units,terrain){if(u.camouflageUses===1&&u.camouflageUsed||marker(u)||u.carryingBeacon||!u.camouflage||!S.active(u))return false;return !units.some(v=>v.team!==u.team&&S.onTable(v)&&S.active(v)&&!S.has(v,'disconnected')&&((v.sensor&&E.edgeDistance(v,u)<=8)||(E.front(v,u)&&E.visibility(v,u,terrain).visible)));}
export function canReimp(u,units,terrain){return !!u.impersonation&&!marker(u)&&S.allowed(u,'reimp')&&!u.impetuous&&!S.has(u,'retreat')&&!units.some(v=>v.team!==u.team&&S.onTable(v)&&S.active(v)&&!S.has(v,'disconnected')&&E.front(v,u)&&E.visibility(v,u,terrain).visible);}
export function enterIMP(u){if(!u.impersonation)return false;reveal(u);u.states.push(u.impersonation===2?'impersonation2':'impersonation1');u.markerGeneration=(u.markerGeneration||0)+1;return true;}
export function applyDiscover(b,initialLayer,{biometric=false,holo=false}={}){if(holo||S.has(b,'holoecho')){reveal(b);return '回声取消';}if(initialLayer===1&&!biometric){if(impLevel(b)===1)b.states=b.states.map(k=>k==='impersonation1'?'impersonation2':k);return 'IMP-2';}reveal(b);b.revealFacingPending=true;return '模型';}
export function discoverSpec(a,b,terrain,{moving=false,turn='',sensor=false}={}){
 const d=E.edgeDistance(a,b),cov=!sensor&&E.cover(a,b,terrain),rm=d<=8?3:d<=32?0:d<=48?-3:d<=96?-6:null;
 let reason=!S.allowed(a,'discover')?'当前状态不能发现':!discoverable(b)?'目标不是未揭露标记':a.team===b.team?'不能发现己方':sensor?(impLevel(b)||S.has(b,'holoecho')||S.has(b,'holomask')?'Sensor不能发现伪装标记':!a.sensor?'没有 Sensor 技能':d>8?'目标不在 Sensor 8″ 区域':''):S.has(b,'hiddenDeployment')?'隐匿部署不能被普通发现':(!moving&&!E.front(a,b))||!E.visibility(a,b,terrain).visible?'没有发现所需视线':rm===null?'超出发现射程':a.discoverFailures?.[markerKey(b)]===turn?'本玩家回合已对该标记发现失败':'';
 const mods=sensor?[['Sensor',6]]:[['距离',a.xVisor&&rm<0?Math.min(0,rm+3):rm||0],['掩体',cov?-3:0],['拟态',impLevel(b)?0:-mimetism(a,b,{discover:true})],['伪装 IMP-1',impLevel(b)===1&&!a.biometricVisor?-3:0],['反照 Albedo',albedoMod(a,b)],['Sensor',a.sensor?6:0],['能见度区域',E.visibilityMod(a,b,terrain)],['火力组发现',(a.ftLevel||0)>=3?3:0],['状态',S.rollMod(a)]];
 return {can:!reason,reason,d,cov,mods,initialLayer:impLevel(b),holo:S.has(b,'holoecho'),biometric:!!a.biometricVisor,sv:Math.max(0,(a.wip||13)+E.clamp(mods.reduce((n,x)=>n+x[1],0),-12,12)),automatic:!sensor&&a.msv===3&&S.has(b,'camouflaged')};
}
export function discoverResult(a,b,spec,die,turn){const success=spec.can&&(spec.automatic||die<=spec.sv);if(success)applyDiscover(b,spec.initialLayer,{biometric:spec.biometric,holo:spec.holo});else if(spec.can){a.discoverFailures??={};a.discoverFailures[markerKey(b)]=turn;}return success;}
export function dodgeSV(u,{noLof=false,opposedMod=0}={}){const protectedMods=sixth(u);return Math.max(0,(u.dodgePH??u.ph)+E.clamp((u.dodgeBonus||0)+(u.tagcomDodge||0)+((u.ftLevel||0)>=3?1:0)+(S.has(u,'immA')?-6:0)+(protectedMods?Math.max(0,opposedMod):opposedMod+(noLof?-3:0)+S.rollMod(u)),-12,12));}
export function resetSV(u,opposedMod=0){return Math.max(0,(u.wip||13)+E.clamp((S.has(u,'immB')?-3:0)+(S.has(u,'isolated')?-9:0)+(sixth(u)?Math.max(0,opposedMod):opposedMod+S.rollMod(u)+(S.has(u,'targeted')?-3:0)),-12,12));}
export const dodgeDistance=u=>2+(u.dodgeDistanceBonus||0);
export const martial=u=>({attack:(u.martialArts||0)>=2?3:0,opponent:(u.martialArts||0)>=1?-3:0,sd:[3,5].includes(u.martialArts)?1:0,burst:(u.martialArts||0)>=4?1:0});
export function attackMods(a,b,m,{rm=0,cov=false,triangulated=false,directMarker=false}={}){
 if(triangulated)return [['三角射击：忽略所有骰值修正',0]];
 if(m.kind==='cc')return [['武器修正',m.userMod||0],['武术',martial(a).attack],['CC Attack 使用者修正',a.ccAttackBonus||0],['状态',S.rollMod(a)]];
 return [['距离',rm||0],['掩体',cov&&!a.marksmanship&&!b.limitedCover?-3:0],['拟态',-mimetism(a,b,{directMarker})],['反照 Albedo',m.noLof?0:albedoMod(a,b)],['BS 属性修正',m.attribute==='wip'?0:(a.bsMod||0)],['BS Attack 使用者修正',a.bsAttackBonus||0],['火力组',(a.ftLevel||0)>=4?1:0],['被标记',S.has(b,'targeted')?3:0],['状态',S.rollMod(a)]];
}
export function opposingMod(u,m,{surprise=false,target,lof=true}={}){const cc=m?.kind==='cc';return (m?.opponentMod||0)+(cc?martial(u).opponent+(u.ccAttackNegative||0)+(u.protheion&&u.protheionEnabled!==false?(u.protheionMod||0):0):(u.bsAttackNegative||0))+(surprise&&!target?.combatInstinct&&!(target?.msv===3&&(lof||cc))&&!(target?.biometricVisor&&['imp','holo'].includes(u.surpriseSource)&&(lof||cc))?-(u.surpriseAttack||0):0);}
export const SKILL_FIELDS={doctor:'医生（教学覆写）',engineer:'工程师（教学覆写）',baggage:'辎重（教学覆写）',cube:'Cube（教学覆写）',holoprojector:'全息投影器',impersonation:'伪装',biometricVisor:'生物识别目镜',visor360:'360°目镜',sixthSense:'第六感',combatInstinct:'战斗直觉',stealth:'潜行',camouflage:'迷彩',sensor:'传感器',triangulatedFire:'三角射击',forwardObserver:'前线观测员（专家资格）',courage:'勇敢 Courage',religious:'虔信部队 Religious Troop',tacticalAwareness:'战术意识',climbingPlus:'强化攀爬',superJump:'超级跳',specialist:'专家',lieutenant:'指挥官',xVisor:'X目镜',marksmanship:'神射手',limitedCover:'有限掩体',skillNoCover:'无掩体',totalReaction:'全反应',warhorse:'战马',naturalBornWarrior:'天生战士'};
export function summary(u){return [...Object.entries(SKILL_FIELDS).filter(([k])=>u[k]).map(([,v])=>v),...(u.mim?[`拟态 −${Math.abs(u.mim)}`]:[]),...(u.msv?[`多光谱 L${u.msv}`]:[]),...(u.bsAttackNegative?[`BS Attack(${u.bsAttackNegative})`]:[]),...(u.surpriseAttack?[`突袭 −${u.surpriseAttack}`]:[]),...(u.martialArts?[`武术 L${u.martialArts}`]:[])];}

export const masked=u=>S.has(u,'holomask')&&u.holoAppearance;
export const visibleName=u=>masked(u)?u.holoAppearance.name:u.name;
export function canRemask(u,units,terrain){return u.holomask&&!u.impetuous&&!S.has(u,'retreat')&&!masked(u)&&S.active(u)&&S.allowed(u,'remask')&&!units.some(v=>v.team!==u.team&&S.onTable(v)&&(S.active(v)||marker(v))&&(E.edgeDistance(u,v)<.025||E.front(v,u)&&E.visibility(v,u,terrain).visible));}
export function enterMask(u,ref){const appearance=u.holoOptions?.find(x=>x.ref===ref);if(!u.holomask||!appearance)return false;u.holoAppearance=appearance;u.states=[...new Set([...(u.states||[]),'holomask'])];return true;}

export function bangbombMod(u,enemy,mode,terrain){return u.bangbombEnabled!==false&&u.bangbomb&&enemy&&mode&&!mode.template&&(E.edgeDistance(u,enemy)<=8||E.front(u,enemy)&&E.visibility(u,enemy,terrain).visible)?Number(u.bangbomb):0;}
