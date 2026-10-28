import * as S from './states.js?v=122';
import * as V from './saves.js?v=122';
// Resolve healing before simultaneous incoming damage, as specified by Protheion.
export function settle(result,units){const gains=new Map(),victims=new Map();for(const p of V.allPlans(result)){
 const a=units.find(u=>u.id===p.attacker?.id),t=p.target;
 if(!a?.protheion||a.protheionEnabled===false||p.weaponKind!=='cc'||!t||t.attribute==='STR')continue;
 let copy=victims.get(t.id);if(!copy){copy=structuredClone(t);victims.set(t.id,copy);}let gain=0;
 if(p.execution&&!S.has(copy,'dead')){gain=1;S.apply(copy,Math.max(0,copy.hp+1));}
 else for(const save of p.saves||[]){if(!save.fail||S.has(copy,'dead'))continue;const wounds=Math.min(save.wounds||0,Math.max(0,copy.hp+1));gain+=wounds;S.apply(copy,save.wounds||0,save.effects||[]);}
 if(gain)gains.set(a.id,(gains.get(a.id)||0)+gain);
 }
 const records=[];for(const [id,count]of gains){const u=units.find(u=>u.id===id);u.protheionBase??=u.maxhp;const oldHP=u.hp,oldMax=u.maxhp,heal=Math.min(count,Math.max(0,u.maxhp-u.hp)),boost=Math.min(count-heal,Math.max(0,u.protheionBase+2-u.maxhp));u.maxhp+=boost;u.hp+=heal+boost;u.powerUp=u.maxhp-u.protheionBase;S.health(u);records.push({id,name:u.name,count,heal,boost,oldHP,oldMax,hp:u.hp,maxhp:u.maxhp});}result.protheion=records;return records;}
export function choiceHTML(u,locked=false){return (u?.bangbomb?`<label class=field><input type=checkbox data-bangbomb="${u.id}" ${u.bangbombEnabled!==false?'checked':''} ${locked?'disabled':''}>使用 Bangbomb +${u.bangbomb}（非模板攻击）</label>`:'')+(u?.protheion?`<label class="field"><input type="checkbox" data-protheion="${u.id}" ${u.protheionEnabled!==false?'checked':''} ${locked?'disabled':''}>使用 Protheion · 近战吸取${u.protheionMod?' / 对手 '+u.protheionMod:''}</label>`:'');}
export function bind(root,units,render){for(const el of root.querySelectorAll('[data-bangbomb]'))el.onchange=()=>{units.find(u=>u.id===el.dataset.bangbomb).bangbombEnabled=el.checked;render();};for(const el of root.querySelectorAll('[data-protheion]'))el.onchange=()=>{units.find(u=>u.id===el.dataset.protheion).protheionEnabled=el.checked;render();};}
