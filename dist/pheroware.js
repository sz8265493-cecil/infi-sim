import * as E from './engine.js?v=122';
import * as S from './states.js?v=122';
import * as K from './skills.js?v=122';
import {inZone,effectiveFirewall} from './hacking.js?v=122';
export const WEAPONS={symbioEndgame:{name:'共生炸弹 · Endgame',en:'SymbioBomb / PT: Endgame',modes:[{id:'endgame',name:'终局 Endgame',kind:'hack',pheroware:true,attribute:'wip',b:1,ps:7,ammo:'AP',saveAttribute:'BTS',opponentMod:-3,bands:[]},{id:'double',name:'终局 Endgame · Double Shot B2（仅主动）',kind:'hack',pheroware:true,doubleShot:true,attribute:'wip',b:2,ps:7,ammo:'AP',saveAttribute:'BTS',opponentMod:-3,bands:[]}]},symbioEraser:{name:'共生炸弹 · Eraser',en:'SymbioBomb / PT: Eraser',modes:[{id:'eraser',name:'抹除 Eraser · 孤立',kind:'hack',pheroware:true,attribute:'wip',b:2,ps:6,ammo:'DA',saveAttribute:'BTS',nonlethal:true,effects:['isolated'],opponentMod:-3,bands:[]}]}};
export function spec(a,b,m,{reactive=false,declaration=false,coordinated=false,spearhead=true}={}){
 let reason='';
 if(!a.symbioBomb)reason='没有已分配的SymbioBomb';
 else if(S.has(a,'isolated'))reason='孤立状态禁用通讯攻击';
 else if(!S.allowed(a,'attack')||a.wall&&!a.climbingPlus)reason='当前状态不能使用通讯攻击';
 else if(reactive&&m.doubleShot)reason='Double Shot只限主动轮';
 else if(!b||b.team===a.team||b.team<0||!S.onTable(b)||K.marker(b))reason='必须指定敌方模型';
 else if(b.attribute==='STR')reason='此共生战术只对VITA目标有效';
 else if(!declaration&&!inZone(a,b))reason='目标在使用者控制区之外，不能通过中继器延伸';
 const firewall=declaration?0:effectiveFirewall(a,b);
 const mods=[['防火墙',firewall],['射击修正',(a.bsMod||0)+(a.bsAttackBonus||0)],['状态',S.rollMod(a)],['火力组',(a.ftLevel||0)>=4?1:0]];
 const fullBurst=reactive?1:Math.min(6,m.b+(a.bsBurstBonus||0));
 // Coordinated Orders reduce every weapon/Equipment/Skill's Burst, but not SD.
 const coordinatedBurst=!reactive&&coordinated?(spearhead?Math.ceil(fullBurst/2):1):fullBurst;
 const burst=Math.min(a.reservedShots||6,coordinatedBurst);
 return {can:!reason,reason,base:a.wip,mods,sv:Math.max(0,a.wip+E.clamp(mods.reduce((n,x)=>n+x[1],0),-12,12)),cov:false,m:{...m,srMod:(m.srMod||0)+(firewall<0?3:0),b:burst}};
}
