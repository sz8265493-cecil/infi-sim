import {restrictedController} from './peripherals.js?v=122';
import * as S from './states.js?v=122';
import * as O from './orders.js?v=122';
export function memberReason(s,u,leader){
 if(!u||u.team!==s.team)return '只能选择主动方单位';
 if(!S.active(u)||!S.onTable(u)&&!S.has(u,'hiddenDeployment')&&!(u.offTable&&(u.combatJump||u.parachutist)))return '须为可行动单位或可入场的隐匿／空降单位';
 if(u.peripheral||u.controllerId||restrictedController(u,s.units))return '附属模型及其控制者不能协调';
 if(u.ftId||s.fireteams?.some(f=>!f.cancelled&&f.members?.includes(u.id)))return '火力组成员须先脱组';
 if(u.isDeployable||u.noOrders||S.has(u,'isolated'))return '不能使用该战斗组公共命令';
 if(leader&&O.group(u)!==O.group(leader))return '必须属于同一战斗组';
 if(leader&&!!u.irregularTroop!==!!leader.irregularTroop)return '必须具有相同训练类型';
 return '';
}
export function check(s,ids,spearhead){
 const leader=s.units.find(u=>u.id===spearhead);
 let reason=s.phase!=='play'||s.order||s.impetuousPhase?'只能在主动轮正常命令阶段、命令之间宣告':!ids.length||ids.length>4?'选择1至4名单位':!ids.includes(spearhead)?'先锋必须是所选成员':(s.commandTokens?.[s.team]||0)<1?'需要1枚指挥令':!leader||O.regular(s,leader)<1?'该战斗组没有正规命令':'';
 for(const id of ids)reason||=memberReason(s,s.units.find(u=>u.id===id),leader);
 return {can:!reason,reason};
}
export function partners(s,u){return (s.order?.coordinatedIds||[]).filter(id=>id!==u.id).map(id=>s.units.find(v=>v.id===id)).filter(Boolean);}
