import {resolveDice,radius} from './engine.js?v=117';
// N5.3 Initiative and Deployment. The UI owns drawing and placement validation.
export const SOURCES=['https://infinitythewiki.com/Initiative_and_Deployment','https://infinitythewiki.com/Strategos','https://infinitythewiki.com/Infiltration','https://infinitythewiki.com/Forward_Deployment'];
const troops=(s,t)=>s.units.filter(u=>u.team===t&&!u.isDeployable&&!u.isDecoy&&!u.peripheral);
const assert=(ok,message)=>{if(!ok)throw new Error(message);};
const team=t=>t===0||t===1;
export function readiness(s,{requireImported=true}={}){const errors=[];for(const t of [0,1]){if(requireImported&&!s.armyLists?.[t])errors.push(`${t===0?'红':'蓝'}方尚未导入军表`);const us=troops(s,t),lts=us.filter(u=>u.lieutenant);if(!us.length)errors.push('双方必须有单位');if(lts.length!==1)errors.push(`${t===0?'红':'蓝'}方必须有且仅有一名尉官`);else if(!Number.isFinite(lts[0].wip)||lts[0].wip<1)errors.push('尉官 WIP 无效');}return errors;}
export function initialize(s,{requireImported=true}={}){s.phase='pregame';s.order=null;s.pregame={stage:'import',requireImported,rolls:[],winner:null,initiativeOwner:null,deploymentOwner:null,firstTurn:null,firstDeployment:null,sides:{0:'south',1:'north'},step:0,reserves:{0:[],1:[]}};for(const u of s.units){u.deploymentPending=true;u.deploymentLocked=false;}return s.pregame;}
export function prepareRoll(s){const p=s.pregame;assert(p&&['import','initiative'].includes(p.stage),'当前不能进行先后手检定');const errors=readiness(s,{requireImported:p.requireImported});assert(!errors.length,errors.join('；'));p.stage='initiative';return p;}
export function rollInitiative(s,dice){const p=prepareRoll(s),wip=[0,1].map(t=>troops(s,t).find(u=>u.lieutenant).wip);const ds=dice||[1+Math.floor(Math.random()*20),1+Math.floor(Math.random()*20)];assert(ds.length===2&&ds.every(x=>Number.isInteger(x)&&x>=1&&x<=20),'需要双方各一枚 D20');const result=resolveDice([ds[0]],wip[0],[ds[1]],wip[1]),winner=result.a.length?0:result.b.length?1:null;const record={dice:[...ds],wip,winner,reroll:winner===null};p.rolls.push(record);if(winner!==null){p.winner=winner;p.stage='choice';}return record;}
export function chooseRight(s,t,right){const p=s.pregame;assert(p.stage==='choice'&&p.winner===t,'只有先后手检定胜方能选择权利');assert(['initiative','deployment'].includes(right),'请选择先手权或部署权');p.initiativeOwner=right==='initiative'?t:1-t;p.deploymentOwner=1-p.initiativeOwner;p.stage='decisions';}
export function chooseInitiative(s,t,firstTurn){const p=s.pregame;assert(p.stage==='decisions'&&p.initiativeOwner===t,'只有先手权拥有者能选择回合顺序');assert(team(firstTurn),'无效阵营');p.firstTurn=firstTurn;}
export function chooseDeployment(s,t,{firstDeployment,side}){const p=s.pregame;assert(p.stage==='decisions'&&p.deploymentOwner===t,'只有部署权拥有者能选择部署顺序及区域');assert(team(firstDeployment)&&['north','south'].includes(side),'请选择部署方及己方区域');p.firstDeployment=firstDeployment;p.sides[t]=side;p.sides[1-t]=side==='north'?'south':'north';}
export function reserveLimit(s,t){return Math.min(troops(s,t).length,troops(s,t).some(u=>u.lieutenant&&Number(u.strategos)>=1)?2:1);}
export function deploymentTeam(s){const p=s.pregame;return p?.stage==='deploy'?(p.step%2===0?p.firstDeployment:1-p.firstDeployment):null;}
export function reserveStep(s){return s.pregame?.stage==='deploy'&&s.pregame.step>=2;}
export const reserveOwner=u=>u.peripheral&&u.peripheral!=='ancillary'?u.controllerId:u.id;
export function editable(s,u){const p=s.pregame;if(p?.stage!=='deploy'||deploymentTeam(s)!==u.team||u.deploymentLocked)return false;const reserved=p.reserves[u.team].includes(reserveOwner(u));return reserveStep(s)?reserved:!reserved;}
function activateStep(s){for(const u of s.units)if(editable(s,u))u.deploymentPending=false;}
export function beginDeployment(s){const p=s.pregame;assert(p.stage==='decisions'&&team(p.firstTurn)&&team(p.firstDeployment),'双方必须完成先手和部署选择');p.stage='deploy';p.step=0;s.phase='deploy';for(const t of [0,1])p.reserves[t]=troops(s,t).slice(-reserveLimit(s,t)).map(u=>u.id);for(const u of s.units){u.deploymentSide=p.sides[u.team];u.deploymentPending=true;u.deploymentLocked=false;u.deploymentReviewed=false;}activateStep(s);return deploymentTeam(s);}
export function setReserves(s,t,ids){const p=s.pregame;assert(p.stage==='deploy'&&!reserveStep(s)&&deploymentTeam(s)===t,'只能在本方主要部署阶段选择保留模型');assert(new Set(ids).size===ids.length&&ids.length>=1&&ids.length<=reserveLimit(s,t),'保留模型数量无效');const us=troops(s,t);assert(ids.every(id=>us.some(u=>u.id===id&&!u.deploymentLocked)),'不可保留不存在或已固定的模型');p.reserves[t]=[...ids];for(const u of s.units.filter(v=>v.team===t&&!v.isDeployable&&!v.isDecoy))u.deploymentPending=ids.includes(reserveOwner(u));activateStep(s);}
export function finishDeploymentStep(s,validate=()=> ''){const p=s.pregame;assert(p.stage==='deploy','当前不是部署阶段');const t=deploymentTeam(s),us=s.units.filter(u=>u.team===t&&(reserveStep(s)?p.reserves[t].includes(reserveOwner(u)):!p.reserves[t].includes(reserveOwner(u))));for(const u of us){if(p.requireReview&&!u.isDeployable&&!u.isDecoy&&u.peripheral!=='ancillary')assert(u.deploymentReviewed,`${u.name||u.id}：请先确认此单位的部署`);const error=validate(u);assert(!error,`${u.name||u.id}：${error}`);}if(p.requireReview&&s.hvts?.length&&!reserveStep(s))assert(p.hvtReviewed?.[t],'请先确认本方 HVT 部署');for(const u of us){u.deploymentPending=false;u.deploymentLocked=true;}p.step++;if(p.step===4)p.stage='ready';else activateStep(s);return p.stage;}
export function start(s){const p=s.pregame;assert(p?.stage==='ready','请先按顺序完成双方部署与保留模型部署');assert(!s.speedballLogistics?.some(v=>v===null),'请先完成双方Speedball后勤选择');assert(!s.units.some(u=>u.deploymentPending),'仍有单位尚未部署');s.phase='play';s.team=p.firstTurn;s.firstTeam=p.firstTurn;s.round=1;p.stage='complete';return s.team;}
export function deploymentBounds(u,{depth=12,enemyDepth=12,attemptInfiltration=false}={}){const side=u.deploymentSide||(u.team===0?'south':'north');depth=u.deploymentDepth??depth;enemyDepth=u.enemyDeploymentDepth??enemyDepth;let reach=depth+Math.max(0,u.forwardDeployment||0);if(u.impersonation&&!u.infiltrationFailed)reach=attemptInfiltration?48:48-enemyDepth;else if(u.infiltration&&!u.infiltrationFailed)reach=attemptInfiltration?48-enemyDepth:Math.max(reach,24);return side==='north'?{min:0,max:reach}:{min:48-reach,max:48};}
export function inDeployment(u,p,options){const b=deploymentBounds(u,options),r=radius(u);return p.y-r>=b.min-1e-6&&p.y+r<=b.max+1e-6&&!(u.deploymentExclusions||[]).some(z=>p.x+r>z.x&&p.x-r<z.x+z.w&&p.y+r>z.y&&p.y-r<z.y+z.h);}
export function needsInfiltrationRoll(u,p){if((!u.infiltration&&!u.impersonation)||u.infiltrationFailed)return false;if(u.impersonation){const north=(u.deploymentSide||(u.team===0?'south':'north'))==='north',depth=u.enemyDeploymentDepth??12;return north?p.y+radius(u)>48-depth:p.y-radius(u)<depth;}return (u.deploymentSide||(u.team===0?'south':'north'))==='south'?p.y-radius(u)<24:p.y+radius(u)>24;}
export function infiltrationSV(u){return u.impersonation?u.wip:Math.max(0,(u.infiltrationPH??u.ph)-3);}
// Deployment roll state is persisted before any optional reroll decision.
// A failed first roll with ReRoll PH=X does not remove the deployed items yet.
export function resolveInfiltration(u,die,{reroll=false,acceptFailure=false}={}){
 assert(!u.infiltrationResolved,'前沿部署检定已完成');
 const pending=u.infiltrationPendingRoll;
 assert(!(reroll&&acceptFailure),'不能同时重掷和接受失败');
 if(reroll||acceptFailure)assert(pending,'没有待处理的潜入失败');
 else assert(!pending,'请先决定是否重掷');
 if(reroll)assert(!u.impersonation&&u.infiltrationRerollPH>0,'该配置没有潜入重掷');
 if(acceptFailure)die=pending.die;
 assert(Number.isInteger(die)&&die>=1&&die<=20,'需要有效D20');
 const sv=acceptFailure?pending.sv:reroll?Math.max(0,u.infiltrationRerollPH-3):infiltrationSV(u),success=die<=sv;
 const result={die,sv,success,reroll,accepted:acceptFailure};
 if(!acceptFailure)(u.infiltrationRolls??=[]).push(result);
 u.deploymentLocked=true;
 if(!success&&!reroll&&!acceptFailure&&!u.impersonation&&u.infiltrationRerollPH>0){u.infiltrationPendingRoll={die,sv};return {...result,pending:true};}
 delete u.infiltrationPendingRoll;u.infiltrationResolved=true;
 if(!success){u.infiltrationFailed=true;u.infiltrationAttempt=false;u.deploymentLocked=false;u.deploymentReviewed=false;u.deploymentReason='前沿部署失败，须回到己方桌边';u.states=(u.states||[]).filter(k=>!['camouflaged','hiddenDeployment','impersonation1','impersonation2','holomask'].includes(k));}
 return {...result,pending:false};
}
