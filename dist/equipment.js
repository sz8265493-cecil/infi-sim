import * as E from './engine.js?v=122';
import * as S from './states.js?v=122';
// TAGCom is automatic and optional. Isolated providers remain eligible: it is not Null.
export function syncTAGCom(units){
 for(const u of units){
  const providers=u.type==='TAG'?units.filter(p=>p.tagcom&&p.tagcomEnabled!==false&&p.team===u.team&&(p.combatGroup||1)===(u.combatGroup||1)&&S.onTable(p)&&S.active(p)):[];
  u.tagcomDodge=Math.max(0,...providers.map(p=>p.tagcom.dodge||0));
  u.tagcomGizmo=Math.max(0,...providers.map(p=>p.tagcom.gizmokit||0));
 }
}
export function possess(target,source){
 if(target.possession){release(target);return false;}
 target.possession={team:target.team,combatGroup:target.combatGroup,mov:target.mov,mov2:target.mov2,cc:target.cc,bs:target.bs,wip:target.wip,points:target.points,sourceId:source.id};
 Object.assign(target,{team:source.team,combatGroup:source.combatGroup||1,mov:4,mov2:4,cc:13,bs:12,wip:11,points:0,ftLevel:0,ftId:null,tacticalOrders:0,irregular:0});
 target.states=[...new Set([...(target.states||[]),'possessed'])];return true;
}
export function release(target){if(!target.possession)return false;const {sourceId,...original}=target.possession;Object.assign(target,original);delete target.possession;target.states=target.states.filter(s=>s!=='possessed');return true;}

export function cancelSuppressive(u){delete u.suppressive;u.states=(u.states||[]).filter(s=>s!=='suppressiveFire');}
export function syncSuppressive(units){for(const u of units)if(u.suppressive&&(!S.active(u)||units.some(v=>v.team!==u.team&&S.active(v)&&S.onTable(v)&&E.edgeDistance(u,v)<.025)||u.ftLevel||u.ftId||['immA','immB','isolated','retreat','possessed','engaged'].some(k=>S.has(u,k))))cancelSuppressive(u);}
