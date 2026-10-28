import * as S from './states.js?v=122';
export const key=u=>u.proxyGroup?u.team+':'+u.proxyGroup:null;
export const eligible=u=>S.active(u)&&!S.has(u,'isolated');
export const members=(units,u)=>u.proxyGroup?units.filter(v=>key(v)===key(u)):[u];
export function activate(units,u){if(!u.proxyGroup||!eligible(u))return false;for(const v of members(units,u))v.proxyActive=v.id===u.id;return true;}
export function contributors(units){const out=[],seen=new Set();for(const u of units){if(!u.proxyGroup){out.push(u);continue;}if(seen.has(key(u)))continue;seen.add(key(u));const ms=members(units,u),live=ms.find(v=>eligible(v)&&S.onTable(v));if(live)out.push({...live,lieutenant:ms.some(v=>v.lieutenant),regularOrderCount:1});}return out;}
export function reactiveGroups(state){const groups=new Map();for(const r of Object.values(state.order.reactions)){const u=state.units.find(v=>v.id===r.id);if(!u?.proxyGroup||!eligible(u))continue;if(!groups.has(key(u)))groups.set(key(u),[]);groups.get(key(u)).push(u);}return [...groups.values()];}
export function chooseReactive(state,id){const u=state.units.find(v=>v.id===id);if(!u?.proxyGroup||!eligible(u)||!state.order.reactions[id])return '代理体不能激活';const ms=members(state.units,u);if(ms.some(v=>{const r=state.order.reactions[v.id];return r?.action&&!['none','dodge','reset'].includes(r.action);}))return '本命令已经锁定主动代理体的反应';activate(state.units,u);state.order.proxyChoices??={};state.order.proxyChoices[key(u)]=u.id;for(const v of ms){const r=state.order.reactions[v.id];if(r&&!r.action)r.draft='';}return '';}
export function reactiveAllowed(state,u){if(!u.proxyGroup)return true;return state.order.proxyChoices?.[key(u)]===u.id&&eligible(u);}
export function awaitingReplacement(state){return state.units.find(u=>u.proxyGroup&&u.proxyActive&&!eligible(u)&&members(state.units,u).some(eligible));}
export function moveGroup(units,u,group){for(const v of members(units,u))v.combatGroup=group;}
export function html(state){return reactiveGroups(state).map(ms=>{const chosen=state.order.proxyChoices?.[key(ms[0])];return '<div class=stagePrompt><b>G:Jumper · 选择本命令主动代理体</b><p>其他代理体只能闪避或Reset；切换标记本身不揭露伪装。</p>'+ms.map(u=>'<button data-proxy-aro="'+u.id+'" '+(chosen===u.id?'disabled':'')+'>'+(chosen===u.id?'★ ':'')+u.name+'</button>').join('')+'</div>';}).join('');}
