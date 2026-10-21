// N5.3 states. Kept separate from dice so all simultaneous effects apply together.
export const LABELS={nwi:'无伤失能 NWI',dogged:'顽强 Dogged',unloaded:'弹药耗尽',unconscious:'昏迷',unconscious2:'昏迷 II',dead:'已移除（Dead）',immA:'不可移动 A',immB:'不可移动 B',isolated:'孤立',stunned:'眩晕',targeted:'被标记'};
export const has=(u,k)=>(u.states||[]).includes(k);
export const unconscious=u=>has(u,'unconscious')||has(u,'unconscious2');
export const canProne=u=>u.type!=='TAG'&&u.type!=='VH'&&!u.motorcycle&&!u.aerial;
export const isProne=u=>unconscious(u)?canProne(u):!!u.prone;
export function syncPosture(u){if(unconscious(u))u.prone=canProne(u);}
export const survivalActive=u=>has(u,'nwi')||has(u,'dogged');
export const active=u=>(u.hp>0||survivalActive(u))&&!has(u,'dead')&&!has(u,'unconscious')&&!has(u,'unconscious2');
export const present=u=>!has(u,'dead');
export const onTable=u=>present(u)&&!u.offTable&&!u.deploymentPending&&!has(u,'hiddenDeployment');
export function allowed(u,skill){if(!active(u)||has(u,'disconnected'))return false;if(u.armedTurret)return skill==='attack';if(has(u,'immA'))return skill==='dodge';if(has(u,'immB'))return skill==='reset';if(has(u,'stunned')&&skill==='attack')return false;return true;}
export const rollMod=u=>has(u,'stunned')?-3:0;
export const dodgeMod=u=>rollMod(u)+(has(u,'immA')?-6:0);
export const resetMod=u=>rollMod(u)+(has(u,'immB')?-3:0)+(has(u,'isolated')?-9:0)+(has(u,'targeted')?-3:0);
export const labels=u=>(u.states||[]).map(k=>LABELS[k]||k);
// NWI and Dogged replace the effects of Unconscious; they are not extra Wounds.
const deathHp=u=>-(u.attribute==='STR'&&u.remotePresence?2:1);
export function health(u){
 const wasUnconscious=unconscious(u),surviving=survivalActive(u);
 u.states=(u.states||[]).filter(s=>!['unconscious','unconscious2','dead'].includes(s));
 if(u.hp>0){u.states=u.states.filter(s=>!['nwi','dogged'].includes(s));delete u.pendingChoice;if(wasUnconscious)u.prone=false;return;}
 if(surviving)return;
 if(u.isDeployable&&u.hp<=0){u.states.push('dead');delete u.pendingChoice;return;}
 const extra=u.attribute==='STR'&&u.remotePresence?1:0;
 if(u.hp<-extra){u.states.push('dead');delete u.pendingChoice;}else u.states.push(u.hp<0?'unconscious2':'unconscious');
 syncPosture(u);u.ftLevel=0;
}
export function pendingSurvival(u){return u.pendingChoice&&unconscious(u)&&present(u)?[...u.pendingChoice.options]:[];}
export function chooseSurvival(u,choice=null){
 const pending=u.pendingChoice;if(!pending||!pendingSurvival(u).length)return false;
 if(choice!==null&&!pending.options.includes(choice))return false;
 delete u.pendingChoice;
 if(choice){u.states=(u.states||[]).filter(s=>!['unconscious','unconscious2','nwi','dogged'].includes(s));u.states.push(choice);u.prone=!!pending.prone;u.ftLevel=has(u,'isolated')?0:pending.ftLevel;}
 return true;
}
export function apply(u,damage=0,effects=[]){
 const wasActive=active(u),wasSurviving=survivalActive(u),prior={prone:!!u.prone,ftLevel:u.ftLevel||0};
 u.hp-=damage;u.states=[...new Set([...(u.states||[]),...effects.filter(k=>k!=='shock')])];
 const shock=effects.includes('shock')&&!u.shockImmune&&!(u.immunities||[]).some(x=>['Shock','Enhanced'].includes(x));
 if(wasSurviving&&(damage>0||shock)||shock&&u.attribute!=='STR'&&(u.maxhp??u.maxHp)===1&&u.hp<=0){u.states=u.states.filter(s=>!['nwi','dogged'].includes(s));u.hp=deathHp(u);}
 health(u);
 if(wasActive&&!wasSurviving&&damage>0&&unconscious(u)){
  const options=[...(u.nwi?['nwi']:[]),...(u.dogged?['dogged']:[])];
  if(options.length)u.pendingChoice={options,...prior};
 }
 if(has(u,'isolated'))u.ftLevel=0;
}
export function recover(u,skill){if(skill==='dodge')u.states=(u.states||[]).filter(k=>k!=='immA');if(skill==='reset')u.states=(u.states||[]).filter(k=>!['immB','isolated','targeted'].includes(k));}
export function statesPhase(units){for(const u of units){u.states=(u.states||[]).filter(k=>k!=='stunned');if(has(u,'dogged')){u.states=u.states.filter(k=>k!=='dogged');u.hp=deathHp(u);health(u);}}}
