import * as S from './states.js?v=36';
export const source='https://infinitythewiki.com/Peripheral';
export const controller=(u,units)=>u.peripheral?units.find(v=>v.id===u.controllerId):u;
export function partners(u,units){const c=controller(u,units);return c?units.filter(v=>(v.id===c.id||v.controllerId===c.id)&&v.id!==u.id&&S.onTable(v)&&S.active(v)&&!S.has(v,'disconnected')):[];}
// Disconnection is applied only at the conclusion of an Order, never while
// simultaneously declared attacks are still being resolved.
export function conclude(units){for(const u of units.filter(u=>u.peripheral==='ancillary')){const c=controller(u,units);if(!c||!S.active(c)||S.has(c,'possessed')||S.has(c,'isolated')||S.has(u,'isolated'))u.states=[...new Set([...(u.states||[]),'disconnected'])];if(c&&S.active(u)&&!S.has(u,'disconnected')){c.ftLevel=0;c.ftId=null;}}}
export function apportionedPoints(u,units){return u.peripheral?u.points:Math.max(0,u.points-units.filter(v=>v.controllerId===u.id).reduce((s,v)=>s+v.points,0));}
