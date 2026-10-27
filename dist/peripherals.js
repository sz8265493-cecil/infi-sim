import * as CP from './cyberplug.js?v=102';
import * as S from './states.js?v=109';
import * as H from './hacking.js?v=82';
export const source='https://infinitythewiki.com/Peripheral';
export const controller=(u,units)=>u.peripheral?units.find(v=>v.id===u.controllerId):u;
export const members=(c,units,type)=>units.filter(v=>v.controllerId===c?.id&&(!type||v.peripheral===type)&&S.onTable(v));
export function choice(c,units,type){const key=type==='servant'?'activeServantId':'controlSpearheadId';return members(c,units,type).find(v=>v.id===c?.[key]&&S.active(v))||members(c,units,type).find(v=>S.active(v));}
export function activated(u,units){if(CP.independent(u))return S.active(u)?[u]:[];const c=controller(u,units);if(!c)return [];const servant=choice(c,units,'servant');return [c,...members(c,units)].filter(v=>S.active(v)&&!S.has(v,'disconnected')&&(v.peripheral!=='servant'||v.id===servant?.id)&&(!CP.isCyber(v)||v.cyberplugMode==='connected'));}
export function partners(u,units){return activated(u,units).filter(v=>v.id!==u.id);}
export function performsTargeted(u,units){if(u.cyberplugIdle)return false;if(u.peripheral!=='control')return true;const c=controller(u,units);return choice(c,units,'control')?.id===u.id;}
export function select(c,units,type,id){const v=members(c,units,type).find(v=>v.id===id&&S.active(v));if(!v)return false;c[type==='servant'?'activeServantId':'controlSpearheadId']=v.id;return true;}
export function pendingSpearhead(units){for(const c of units.filter(v=>members(v,units,'control').length)){const all=members(c,units,'control'),old=all.find(v=>v.id===c.controlSpearheadId);if(c.controlSpearheadId&&(!old||!S.active(old))&&all.some(v=>S.active(v)))return {controller:c,candidates:all.filter(v=>S.active(v))};}return null;}
export function servantActor(u,units,point=u){const cyber=CP.supportActor(u,units,point);if(cyber)return cyber;const c=controller(u,units);if(!c||!activated(u,units).some(v=>v.id===c.id))return point;const servant=choice(c,units,'servant');if(!servant)return point;return {...c,...(u.id===c.id?point:{}),remoteContactPoints:[{...servant}]};}
// Check only at declared coherency windows, never while plotting intermediate points.
// Keep external Disconnected separate from the automatic reasons we can cancel.
export function check(units,{start=false,team}={}){const events=[];for(const u of units.filter(v=>v.peripheral&&v.peripheral!=='cyberplug'&&(team===undefined||v.team===team))){
 const c=controller(u,units),previous=(u.disconnectionCauses||(S.has(u,'disconnected')?['external']:[])).filter(k=>k!=='external'||S.has(u,'disconnected')),causes=[];
 if(!c||!S.onTable(c)||!S.active(c)||S.has(c,'isolated')||S.has(c,'possessed'))causes.push('controller');
 if(S.has(u,'isolated'))causes.push('isolated');
 let anchor=null;if(u.peripheral==='synchronized')anchor=c;
 if(u.peripheral==='control')anchor=units.find(v=>v.id===c?.controlSpearheadId)||units.find(v=>v.controllerId===c?.id&&v.peripheral==='control'&&S.active(v));
 if(anchor&&!H.inZone(anchor,u))causes.push('coherency');
 if(causes.length){if(!S.has(u,'disconnected')){u.states=[...(u.states||[]),'disconnected'];events.push(u.name+' 断连：'+causes.map(k=>({controller:'控制者失能／孤立',isolated:'自身孤立',coherency:'超出一致性'}[k])).join('、'));}u.disconnectionCauses=[...new Set([...previous.filter(k=>!['controller','isolated','coherency'].includes(k)),...causes])];}
 else if(previous.length||u.disconnectionCauses?.length){u.disconnectionCauses=previous.filter(k=>!['controller','isolated','coherency'].includes(k));if(!u.disconnectionCauses.length&&S.has(u,'disconnected')){u.states=u.states.filter(k=>k!=='disconnected');events.push(u.name+' 自动恢复连接'+(start?'（起始一致性）':'（命令结束）'));}}
 }return events;}
export function conclude(units){const events=[...CP.conclude(units),...check(units)];for(const u of units.filter(u=>u.peripheral==='ancillary')){const c=controller(u,units);if(c&&S.active(u)&&!S.has(u,'disconnected')){c.ftLevel=0;c.ftId=null;}}return events;}
export function apportionedPoints(u,units){return u.peripheral?u.points:Math.max(0,u.points-units.filter(v=>v.controllerId===u.id).reduce((s,v)=>s+v.points,0));}

export function description(u,units){const type={ancillary:'Ancillary',servant:'Servant',synchronized:'Synchronized',control:'Control',cyberplug:'Cyberplug'}[u.peripheral]||u.peripheral,c=controller(u,units);return 'Peripheral ('+type+') · 控制者 '+(c?.name||'未关联')+'。'+(u.peripheral==='synchronized'?'须保持控制者8寸控制区一致性。':u.peripheral==='control'?'须保持控制单元先锋8寸控制区一致性。':'无运行距离上限。')+(u.peripheral==='cyberplug'?'当前'+(CP.independent(u)?'自主配置，独立使用本组公共命令和ARO。':'连接配置，与控制者同一命令，控制者待机（医生/工程师除外）。'):'使用控制者命令，不产生额外命令；武器和技能以本模型配置为准。');}

// The target restriction belongs to Active Turn Control, not to the Attack label.
export const utilityKinds=['discover','sensor','doctor','engineer','medikit','gizmokit','deactivator','speedballUse','deployable','reload','mission'];
export const requiresTarget=kind=>!['sensor','deployable','reload'].includes(kind);
export function utilityRestriction(u,units,kind,{reactive=false}={}){
 if(u.cyberplugIdle&&!['doctor','engineer'].includes(kind))return '连接配置的控制者执行待机';
 if(reactive&&['doctor','engineer','medikit','gizmokit','deactivator','speedballUse','sensor','mission'].includes(kind))return '该行动只能在主动轮宣告';
 if(!reactive&&requiresTarget(kind)&&!performsTargeted(u,units))return '主动轮有目标技能：仅控制者与指定先锋执行';
 return '';
}

// A support program's own target column determines the Control restriction.
export function programRestriction(u,units,id,{reactive=false}={}){
 if(!H.supportActions(u,{reactive,aroEligible:reactive}).some(p=>p.id===id))return '没有该程序，或当前状态／阶段不允许使用';
 if(!reactive&&['assistedFire','enhancedReaction','fairyDust'].includes(id)&&!performsTargeted(u,units))return '主动轮有目标程序：仅控制者与指定先锋执行';
 if(u.cyberplugIdle)return '连接配置的控制者执行待机';
 return '';
}
