import {decodeArmyCode,encodeArmyCode} from './army-code.js?v=36';
import * as F from './combat.js?v=36';
import * as D from './deployables.js?v=36';
import * as E from './engine.js?v=36';
import * as Q from './mission.js?v=36';
export const label=t=>t.name+(t.extras?.length?' ('+t.extras.map(x=>x.name).join(', ')+')':'');
const alias={'Combi Rifle':'复合步枪','Pistol':'手枪','CC Weapon':'近战武器','Heavy Machine Gun':'重机枪','Spitfire':'轻机枪','Light Flamethrower':'轻型喷火器','Heavy Flamethrower':'重型喷火器','Chain Rifle':'链式步枪','Boarding Shotgun':'登舰霰弹枪','Light Shotgun':'轻型霰弹枪','Flash Pulse':'闪光脉冲','PARA CC Weapon':'麻痹近战武器'};
const special={'Cybermine':'cyberMine','Smoke Grenades':'smokeGrenade','Smoke Grenade Launcher':'smokeLauncher','Eclipse Grenades':'eclipseGrenade','Eclipse Grenade Launcher':'eclipseLauncher','Disco Baller':'discoBaller','Drop Bears':'dropBears','Pitcher':'pitcher','Shock Mine':'shockMine','AP Mine':'apMine','E/M Mine':'emMine','PARA Mine':'paraMine','Monofilament Mine':'monoMine','Viral Mine':'viralMine','Deployable Repeater':'deployableRepeater'};
const basicSkills={'360º Visor':'visor360','Remote Presence':'remotePresence','Courage':'courage','Religious Troop':'religious','Camouflage':'camouflage','Stealth':'stealth','Sixth Sense':'sixthSense','Combat Instinct':'combatInstinct','Climbing Plus':'climbingPlus','Super-Jump':'superJump','Sensor':'sensor','Triangulated Fire':'triangulatedFire','Total Reaction':'totalReaction','Tactical Awareness':'tacticalAwareness','Marksmanship':'marksmanship','X Visor':'xVisor','Limited Cover':'limitedCover','No Cover':'skillNoCover','Warhorse':'warhorse','Natural Born Warrior':'naturalBornWarrior','Number 2':'number2','NCO':'nco','Baggage':'baggage','Repeater':'repeater','Specialist Operative':'specialist','Technorganic':'technorganic'};
function skill(u,t){
 const n=t.name.replaceAll('\u00a0',' '),ex=t.extras.map(e=>e.name.replaceAll('\u00a0',' ')),value=ex[0],num=Number(value);
 if(n==='Holomask'){u.holomask=true;return true;}
 if(n==='Impetuous'){u.impetuous=true;return true;}
 if(n==='Frenzy'){u.frenzy=true;return true;}
 if(n==='Counterintelligence'){u.counterintelligence=true;return true;}
 if(n==='Minelayer'){u.minelayer=ex.length?num:1;return true;}
 if(n==='Decoy'){u.decoy=num;return true;}
 if(n==='Albedo'&&[-3,-6].includes(num)){u.albedo=num;return true;}
 if(n==='Neurocinetics'){u.neurocinetics=true;u.neuroBurstBonus=/^\+\dB$/.test(value)?+value.slice(1,-1):0;return !ex.length||!!u.neuroBurstBonus;}
 if(n==='Forward Deployment'&&t.extras[0]?.type==='DISTANCE'){u.forwardDeployment=num/2.5;return true;}
 if(n==='Camouflage'&&value==='1 Use'){u.camouflage=true;u.camouflageUses=1;return true;}
 if(n==='Super-Jump'&&t.extras[0]?.type==='DISTANCE'){u.superJump=true;u.superJumpBonus=num/2.5;return true;}
 if(n==='Super-Jump'&&value==='Jet Propulsion'){u.superJump=true;u.jetPropulsion=true;return true;}
 if(n==='Combat Jump'){u.combatJump=true;for(const x of ex){if(x==='Explosion')u.combatJumpExplosion=true;else if(/^PH=\d+$/.test(x))u.combatJumpPH=+x.slice(3);else return false;}return true;}
 if(n==='Parachutist'){u.parachutist=true;return !ex.length;}
 if(n==='Terrain'&&ex.length===1&&value.split('/').every(x=>['Aquatic','Desert','Mountain','Jungle','Zero-G','Total'].includes(x))){u.terrainTypes=value.split('/');u.terrainChoice=u.terrainTypes[0];return true;}
 if(n==='Infiltration'){u.infiltration=true;for(const x of ex){if(/^PH=\d+$/.test(x))u.infiltrationPH=+x.slice(3);else return false;}return true;}
 if(n==='Hidden Deployment'){u.hiddenDeployment=true;return true;}
 if(n==='Strategos L2'&&!ex.length){u.strategos=2;return true;}
 if(n==='No Wound Incapacitation'){u.nwi=true;return true;}
 if(n==='Dogged'){u.dogged=true;return true;}
 if(n==='TAGCom'&&ex.join(', ')==='Dodge (PH+3), GizmoKit (PH+1)'){u.tagcom={dodge:3,gizmokit:1};return true;}
 if(n==='ECM: Guided'){u.ecmGuided=num;return true;}
 if(n==='BS Attack'&&value==='Guided'){u.guided=true;return true;}
 if(n==='ECM: Hacker'){u.ecmHacking=num;return true;}
 if(n==='TinBot: Firewall'){u.firewall=num;return true;}
 if(n==='Paramedic'){u.paramedic=true;u.specialist=true;return true;}
 if(n==='MediKit'){u.medikit=true;return true;}
 if(n==='GizmoKit'){u.gizmokit=true;u.gizmokitBurstBonus=/^\+\dB$/.test(value)?+value.slice(1,-1):0;return !ex.length||!!u.gizmokitBurstBonus;}
 if(n==='Gizmokit'&&/^PH=\d+$/.test(value)){u.gizmokitPH=+value.slice(3);return true;}
 if(n==='Deactivator'){u.deactivator=true;u.deactivatorReroll=value==='ReRoll';return !ex.length||u.deactivatorReroll;}
 if(n==='CC Attack'&&ex.length===1){if(num>0)u.ccAttackBonus=num;else if(num<0)u.ccAttackNegative=num;else if(/^\+\dB$/.test(value))u.ccBurstBonus=+value.slice(1,-1);else if(['AP','Shock','T2'].includes(value))u.ccAmmo=value.toUpperCase();else return false;return true;}
 if(basicSkills[n]&&!ex.length){u[basicSkills[n]]=true;return true;}
 if(/^Martial Arts L[1-5]$/.test(n)&&!ex.length){u.martialArts=+n.at(-1);return true;}
 if(/^Multispectral Visor L[1-3]$/.test(n)&&!ex.length){u.msv=+n.at(-1);return true;}
 if(n==='Mimetism'&&ex.length===1&&[-3,-6].includes(num)){u.mim=-num;return true;}
 if(n==='Surprise Attack'&&ex.length===1&&[-3,-6].includes(num)){u.surpriseAttack=-num;return true;}
 if(n==='Dodge'&&ex.length===1){if(/^PH=\d+$/.test(value))u.dodgePH=+value.slice(3);else if(t.extras[0].type==='DISTANCE')u.dodgeDistanceBonus=num/2.5;else if(Number.isFinite(num))u.dodgeBonus=num;else return false;return true;}
 if(n==='BS Attack'&&ex.length===1){if(['AP','Shock','T2'].includes(value))u.bsAmmo=value.toUpperCase();else if(value==='+1SD')u.bsSpecialDice=1;else if(value==='SR-1')u.bsSaveMod=-1;else if(/^\+\dB$/.test(value))u.bsBurstBonus=+value.slice(1,-1);else if([-3,-6].includes(num))u.bsAttackNegative=num;else return false;return true;}
 if(n==='Lieutenant'&&(!ex.length||value==='+1 Order')){u.lieutenant=true;u.lieutenantOrderCount=ex.length?2:1;return true;}
 if(n==='Forward Observer'&&!ex.length){u.forwardObserver=true;u.specialist=true;return true;}
 if(['Doctor','Engineer'].includes(n)){
  const cfg={};for(const x of ex){if(x==='ReRoll')cfg.rerollWip=u.wip;else if(/^\+\d+$/.test(x))cfg.wipMod=+x;else return false;}
  u[n.toLowerCase()]=ex.length?cfg:true;u.specialist=true;return true;
 }
 if(n==='Hacker'&&!ex.length){u.hacker=true;u.specialist=true;return true;}
 const device={'Hacking Device':'HD','Hacking Device Plus':'HDPlus','Killer Hacking Device':'KHD','EVO Hacking Device':'EVO'}[n];
 if(device){u.hackingDevice=device;u.hacker=true;u.specialist=true;for(const e of ex){if(/^Firewall -[36]$/.test(e))u.hackingFirewall=+e.split(' ')[1];else return false;}return ['HD','EVO'].includes(device);}// Other device families retain explicit coverage warnings
 if(n==='Immunity'&&ex.length&&ex.every(x=>['ARM','BTS','Enhanced','Critical','Shock'].includes(x))){u.immunities=ex.map(x=>x==='Shock'?'SHOCK':x);return true;}
 return false;
}
export function buildWeapon(t,catalog){
 if(t.name==='Armed Turret'&&t.extras.length===1&&t.extras[0].name==='Marksman Rifle')return {key:'armedTurret'};
 if(special[t.name]&&!t.extras.length)return {key:special[t.name]};
 const rows=catalog.weapons.filter(w=>w.id===t.id),key='army_'+t.id+'_'+t.extras.map(e=>e.id).join('_');
 if(t.id===17&&!t.extras.length)return {key,weapon:{name:t.zh||'爆破装药',en:'D-Charges',demolition:true,disposable:3,modes:[{id:'cc',name:'近战模式 · CC−6',kind:'cc',b:1,ps:6,bands:[],ammo:'AP+EXP',userMod:-6}]},warnings:[]};
 if(!rows.length)return {error:'缺少武器参数'};
 let bBonus=0,psOverride,opponentMod=0,sd=0;
 for(const e of t.extras){if(e.name==='+1SD')sd=1;else if(/^PS=\d+$/.test(e.name))psOverride=+e.name.slice(3);else if(/^\+\dB$/.test(e.name))bBonus=+e.name.slice(1,-1);else if(t.name==='PARA CC Weapon'&&['-3','-6'].includes(e.name))opponentMod=+e.name;else return {error:'武器附加规则未实现'};}
 const modes=[],warnings=[];let disposable=0;
 for(const [i,w] of rows.entries()){
  const props=w.properties||[],p=props.filter(x=>!(x==='[**]'&&[14,23,25,175].includes(t.id))).join('|'),cc=props.includes('CC'),direct=p.includes('Direct Template'),impact=p.includes('Impact Template');
  if(/Deployable|Targetless|Comms|Zone of Control|Perimeter|Boost|State: Sepsitorized|State: Targeted|State: Stunned \/|BS Weapon \(PH\)|Throwing Weapon|\[\*|Improvised|Silent|Double Shot|CC Attack/.test(p)){warnings.push((w.mode||w.name)+'：专属流程未实现');continue;}
  const ammoName=catalog.ammunitions.find(a=>a.id===w.ammunition)?.name;
  let ammo=ammoName?.toUpperCase().replaceAll('E/M','EM').replaceAll(' ','');
  if(p.includes('Bioweapon'))ammo='VIRAL';else if(w.saving==='ARM and BTS')ammo='PLASMA';else if(w.saving==='ARM=0')ammo=p.includes('State: Dead')?'MONO':'K1';else if(w.saving==='BTS/2'&&ammo==='AP')ammo='BREAKER';
  if(!ammo||!ammo.split('+').every(a=>['N','AP','DA','EXP','EM','PARA','SHOCK','STUN','T2','VIRAL','PLASMA','MONO','K1','BREAKER'].includes(a))){warnings.push((w.mode||w.name)+'：弹药未实现');continue;}
  const ps=psOverride??Number(w.damage==='-'?0:w.damage),b=Number(w.burst)+bBonus;
  const bands=Object.values(w.distance||{}).filter(Boolean).map(x=>[x.max/2.5,Number(x.mod)]).sort((a,b)=>a[0]-b[0]);
  if(!Number.isFinite(ps)||!Number.isFinite(b)||(!cc&&!direct&&!bands.length)){warnings.push((w.mode||w.name)+'：参数不完整');continue;}
  const template=direct?(p.includes('Large')?'large':'small'):impact?'circle':undefined;
  const m={id:'m'+i,name:w.mode||'标准模式',kind:cc?'cc':direct?'direct':impact?'impact':'bs',b,ps,bands,saves:1,ammo,sd,opponentMod,nonlethal:p.includes('Non-lethal'),continuous:p.includes('Continous Damage'),saveAttribute:w.saving?.startsWith('BTS')?'BTS':'ARM',...(template?{template}:{}),...(p.includes('BS Weapon (WIP)')||p.includes('Technical Weapon')?{attribute:'wip'}:{})};
  modes.push(m);if(/Pistol/.test(w.name)&&!cc)modes.push({...m,id:'cc'+i,name:(w.mode||'标准')+' · 近战',kind:'cc',b:1,bands:[]});
  const d=p.match(/Disposable \((\d+)\)/);if(d)disposable=+d[1];
  if(p.includes('Suppressive Fire'))modes.push({...m,id:'sf'+i,name:(w.mode||'标准')+' · 压制射击',b:3,bands:[[16,0],[24,-3]],sf:true,sfKey:key});
 }
 if(!modes.length)return {error:warnings.join('；')||'没有可用模式'};
 const weapon={name:t.zh||alias[t.name]||t.name,en:label(t),modes,...(disposable?{disposable}:{})};
 return {key,weapon,warnings:[...new Set(warnings)]};
}
function buildAncillaries(e,catalog){
 const units=[];if(!e.includes?.length&&!e.peripheral?.length)return {units};
 for(const inc of e.includes||[]){const a=(catalog.auxiliaryEntries||[]).find(x=>x.unitId===e.unitId&&x.groupId===inc.group&&x.optionId===inc.option);
 if(!a||a.ambiguousProfiles||!a.skills.some(t=>t.name==='Peripheral'&&t.extras.some(x=>x.name==='Ancillary')))return {units:[],error:true};
 const st=a.stats,u={name:a.zh||a.name,en:a.name,logo:a.logo,slug:a.slug,s:st.s,bs:st.bs,cc:st.cc,ph:st.ph,wip:st.wip,arm:st.arm,bts:st.bts,mov:st.move[0]/2.5,mov2:st.move[1]/2.5,hp:st.w,maxhp:st.w,attribute:st.str?'STR':'VITA',points:a.points,type:'REM',armyLocked:true,loadout:[],armyWeapons:{},states:[],officialAbilities:a.skills.map(label),unsupported:[],armyRef:{unitId:a.unitId,groupId:a.groupId,optionId:a.optionId,version:catalog.version}};
 for(const t of [...a.skills,...a.equip])if(t.name!=='Peripheral'&&!skill(u,t))u.unsupported.push(label(t));
 for(const t of a.weapons){const w=buildWeapon(t,catalog);if(w.error)return {units:[],error:true};u.loadout.push(w.key);if(w.weapon)u.armyWeapons[w.key]=w.weapon;}
 for(let i=0;i<(inc.q||1);i++)units.push(structuredClone(u));
 }return units.length?{units}:{units,error:true};
}
export function registerWeapons(units){for(const u of units)for(const [key,w] of Object.entries(u.armyWeapons||{})){F.addGuidedModes(w);F.ARMS[key]=w;if(w.disposable)D.ITEMS[key]={id:key,name:w.name,capacity:w.disposable};}}
export function previewArmy(code,catalog){
 const decoded=decodeArmyCode(code);if(decoded.factionId!==catalog.factionId||![201,103].includes(decoded.factionId))throw Error('军表阵营与官方资料不匹配；不会替换为其他阵营配置。');
 const errors=[],warnings=[],units=[];let points=0,swc=0,swcBonus=0;
 for(const g of decoded.groups)for(const [i,m] of g.members.entries()){
  const matches=catalog.entries.filter(e=>e.unitId===m.unitId&&e.groupId===m.groupId&&e.optionId===m.optionId),ref=`G${g.id} #${i+1} · ${m.unitId}/${m.groupId}/${m.optionId}`;
  if(matches.length!==1){errors.push(`${ref}：找不到唯一配置，未替换、未删除`);continue;}
  const e=matches[0];const ancillary=buildAncillaries(e,catalog);if(e.ambiguousProfiles||e.minis!==1||ancillary.error||e.chars?.includes('Peripheral')){errors.push(`${ref} ${e.name}：多形态／附属模型尚未支持，不能省略导入`);continue;}
  const a=e.stats;if(!E.BASE[a.s]||a.move.some(x=>!Number.isFinite(x)||x<0)||a.w<1){errors.push(`${ref}：属性／轮廓未支持`);continue;}
  const orders=e.orders||[],count=type=>orders.filter(o=>o.type===type).reduce((n,o)=>n+Number(o.total||0),0);
  const u={id:`import-${g.id}-${i}`,combatGroup:g.id,armyLocked:true,factionId:catalog.factionId,armyRef:{unitId:e.unitId,groupId:e.groupId,optionId:e.optionId,version:catalog.version},name:e.zh||e.name,en:e.name,slug:e.slug,logo:e.logo,bs:a.bs,cc:a.cc,ph:a.ph,wip:a.wip,arm:a.arm,bts:a.bts,s:a.s,mov:a.move[0]/2.5,mov2:a.move[1]/2.5,maxhp:a.w,hp:a.w,type:catalog.types.find(t=>t.id===a.type)?.name,attribute:a.str?'STR':'VITA',points:e.points,swc:e.swc,states:[],prone:false,z:0,ftLevel:0,loadout:[],armyWeapons:{},officialAbilities:[],unsupported:[],irregularTroop:count('IRREGULAR')>0,regularOrderCount:count('REGULAR'),lieutenantOrderCount:count('LIEUTENANT'),lieutenant:count('LIEUTENANT')>0,cube:e.chars.some(x=>x==='Cube'||x==='Cube 2.0'),hackable:e.chars.includes('Hackable'),nonHackable:e.chars.includes('Non Hackable'),impetuous:e.chars.includes('Impetuous')};
  
  for(const t of [...e.skills,...e.equip]){u.officialAbilities.push(label(t));if(special[t.name]&&!t.extras.length){u.loadout.push(special[t.name]);continue;}if(!skill(u,t))u.unsupported.push(label(t));}
  for(const t of e.weapons){const w=buildWeapon(t,catalog);if(w.error){u.unsupported.push(label(t)+'：'+w.error);continue;}u.loadout.push(w.key);if(w.weapon)u.armyWeapons[w.key]=w.weapon;for(const note of w.warnings||[])u.unsupported.push(label(t)+'：'+note);}
  if(ancillary.units.length){u.ancillaryProfiles=ancillary.units;u.deployableItems=[...(u.deployableItems||[]),'ancillary'];u.officialAbilities.push('Peripheral (Ancillary)：局中放置，部署阶段不登场');}
  if(u.holomask)u.holoOptions=catalog.entries.filter(x=>x.stats?.s===u.s&&x.stats.ava!==0&&!x.ambiguousProfiles).map(x=>({name:x.zh||x.name,en:x.name,logo:x.logo,ref:[x.unitId,x.groupId,x.optionId].join('/'),weapons:(x.weapons||[]).map(label).join(' / ')}));
  u.loadout=[...new Set(u.loadout)];u.weapon=u.loadout.find(k=>u.armyWeapons[k]||F.ARMS[k]);
  if(!u.weapon){errors.push(`${ref} ${e.name}：没有已实现的战斗武器，不能用默认武器代替`);continue;}
  u.unsupported=[...new Set(u.unsupported)];warnings.push(...u.unsupported.map(s=>`${e.name}：${s}`));units.push(u);points+=e.points;if(String(e.swc).startsWith('+'))swcBonus+=+e.swc;else swc+=+e.swc;
 }
 if(units.length>15)errors.push('超过普通军表 15 个单位上限');
 if(points>decoded.pointsLimit)errors.push(`点数 ${points} 超过 ${decoded.pointsLimit}`);
 if(swc>decoded.pointsLimit/50+swcBonus)errors.push(`SWC ${swc} 超过上限`);
 if(units.filter(u=>u.lieutenant).length!==1)errors.push('当前普通军表必须有且只有一个明确的尉官配置');
 const counts=new Map();for(const u of units){const e=catalog.entries.find(e=>e.unitId===u.armyRef.unitId&&e.groupId===u.armyRef.groupId&&e.optionId===u.armyRef.optionId),id=e.avaKey;counts.set(id,(counts.get(id)||0)+1);if(e.stats.ava>0&&counts.get(id)>e.stats.ava)errors.push(`${u.name}：超过 AVA ${e.stats.ava}`);}
 return {decoded,units,errors:[...new Set(errors)],warnings:[...new Set(warnings)],points,swc,version:catalog.version};
}
export function placeArmy(units,team,otherUnits,terrain){
 const placed=[];for(const [index,raw] of units.entries()){
  const u={...structuredClone(raw),id:raw.team!==undefined?raw.id:`${team?'b':'a'}-army-${index}`,team,facing:(raw.deploymentSide|| (team?'north':'south'))==='north'?90:-90},r=E.radius(u),candidates=[];
  // Prefer contact with actual terrain edges; then legal ground-space grid.
  for(const t of terrain)for(let q=.5;q<Math.max(t.w,t.h);q+=1.3){candidates.push({x:t.x-r-.01,y:t.y+Math.min(q,t.h),z:0},{x:t.x+t.w+r+.01,y:t.y+Math.min(q,t.h),z:0},{x:t.x+Math.min(q,t.w),y:t.y-r-.01,z:0},{x:t.x+Math.min(q,t.w),y:t.y+t.h+r+.01,z:0});}
  const north=u.deploymentSide?u.deploymentSide==='north':!!team;for(let y=north?1:37;y<(north?12:48);y+=1.3)for(let x=1;x<48;x+=1.3)candidates.push({x,y,z:0});
  const at=candidates.find(p=>!Q.deploymentError(u,p,[...otherUnits,...placed].map(v=>({...v,deploymentPending:false})),terrain));
  if(!at)throw Error('部署区没有足够空间容纳全部底盘；当前对局未改动');placed.push({...u,...at});
 }return placed;
}
export function exampleCode(catalog){
 const find=(slug,test=()=>true)=>{const e=catalog.entries.find(e=>e.slug===slug&&!e.ambiguousProfiles&&test(e));if(!e)throw Error('示例配置不存在');return {unitId:e.unitId,groupId:e.groupId,optionId:e.optionId};};
 return encodeArmyCode({factionId:201,name:'玉京 · 双战斗组导入示例',pointsLimit:300,groups:[{id:1,members:[find('zhanshi',e=>e.skills.some(s=>s.name==='Lieutenant')),find('zhanshi',e=>!e.skills.length&&e.weapons.some(w=>w.name==='Combi Rifle'))]},{id:2,members:[find('weibing-yaokong'),find('yaoxie-rui-shi')]}]});
}
