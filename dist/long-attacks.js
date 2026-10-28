import * as E from './engine.js?v=122';
import * as S from './states.js?v=122';
// Derived modes preserve ammunition/weapon effects; only the declaration and roll change.
export function addModes(w){for(const m of [...w.modes]){if(m.longAttack||m.guided||m.sf)continue;for(const [trait,kind,label] of [['intuitive','intuitiveAttack','直觉攻击 · WIP整令'],['speculative','speculativeDamage','推测射击 · 整令']])if(m[trait]&&!w.modes.some(n=>n.id===kind+'_'+m.id))w.modes.push({...m,id:kind+'_'+m.id,name:m.name+' · '+label,kind:'impact',b:1,longAttack:kind,attribute:kind==='intuitiveAttack'?'wip':m.attribute});}}
export function spec(a,b,m,terrain,{reactive=false,declaration=false}={}){
 const intuitive=m.longAttack==='intuitiveAttack',point=a.longImpact||b,empty={m:{...m,b:1},sv:0,base:0,mods:[],cov:false};let reason='';
 if(reactive||a.longAttack!==m.longAttack)reason='此模式必须在主动轮首项宣告整令，不能作为ARO或第二项短技能';
 else if(!S.allowed(a,'attack')||a.engaged||a.wall&&!a.climbingPlus)reason='当前状态不能宣告此攻击';
 else if(!b||!S.present(b)||b.offTable||S.has(b,'hiddenDeployment'))reason='目标不在场';
 else if(intuitive){const physical=E.visibility(a,b,[...terrain]).visible,visible=E.visibility(a,b,terrain).visible,marker=(b.states||[]).some(k=>['camouflaged','impersonation1','impersonation2','holoecho'].includes(k));
  if(a.intuitiveFailed?.[b.id]===a.ruleTurn)reason='本主动回合已经对该目标直觉攻击失败';
  else if(!a.longAccepted?.includes(b.id)&&!marker&&(visible||!physical))reason='直觉攻击须针对迷彩等标记，或被零能见度区域遮蔽的目标';
  else if(!physical||!E.front(a,b))reason='实体地形或朝向阻止攻击；直觉攻击不能穿墙';
 }else if((b.states||[]).some(k=>['camouflaged','impersonation1','impersonation2'].includes(k)))reason='伤害型推测射击仍须指定合法主目标';
 if(!intuitive&&!declaration){if(E.elevation(point)>0&&!E.surfaceAt(point,terrain,E.elevation(point)))reason='圆模板须放在地面或水平地形表面';if(!trajectory(a,point,terrain))reason='射手到落点之间不存在未穿过实体的投掷轨迹';}
 const d=E.edgeDistance(a,{...point,s:0,baseRadius:0}),rm=declaration?0:m.bands.find(([n])=>d<=n+1e-8)?.[1];if(!intuitive&&!declaration&&rm===undefined)reason='超出最大射程';
 const base=intuitive?(a.wip||0):(a[m.attribute||'bs']||0),mods=intuitive?[]:[['距离',rm||0],['推测射击',-6],['正向射击加成',Math.max(0,(a.bsMod||0)+(a.bsAttackBonus||0)+((a.ftLevel||0)>=4?1:0))]];
 return {...empty,can:!reason,reason,d,rm:rm||0,base,mods,sv:Math.max(0,base+mods.reduce((n,x)=>n+x[1],0))};
}
// Search a geometric throw path over finite scenery; no ballistic range bonus.
// Vertical legs cannot pass through ceilings, including a sealed objective room.
export function trajectory(a,p,terrain){const from={...a,z:E.elevation(a)+E.height(a)},to={...p,z:E.elevation(p)+1e-4};if(!terrain.some(t=>E.rayBox(from,to,t)))return true;
 const tops=[Math.max(from.z,to.z),...terrain.filter(t=>Number.isFinite(E.terrainHeight(t))).map(t=>E.terrainHeight(t)+.01)];
 return tops.some(z=>z>=from.z&&z>=to.z&&![ [from,{...from,z}], [{...from,z},{...to,z}], [{...to,z},to] ].some(([x,y])=>terrain.some(t=>E.rayBox(x,y,t))));
}
