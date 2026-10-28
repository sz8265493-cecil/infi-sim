import * as HP from './hidden-placement.js?v=122';
import * as E from './engine.js?v=122';
import * as S from './states.js?v=122';
import * as P from './pregame.js?v=122';
const has=u=>S.has(u,'holoecho');
export const bearer=(units,u)=>u?.holoOwnerId?units.find(v=>v.id===u.holoOwnerId):u;
export const echoes=(units,u)=>units.filter(v=>v.holoOwnerId===u.id&&S.present(v));
export const projected=(units,u)=>!!u&&(has(bearer(units,u))||has(u)&&!u.holoOwnerId);
export function partners(units,u){return u.holoprojector&&(has(u)||u.holoCancelled)?echoes(units,u):[];}
export function canEnter(u,units,terrain){return !!u.holoprojector&&!has(u)&&S.allowed(u,'holoecho')&&S.onTable(u)&&!u.impetuous&&!S.has(u,'retreat')&&!units.some(v=>v.team!==u.team&&S.onTable(v)&&S.active(v)&&!S.has(v,'disconnected')&&E.front(v,u)&&E.visibility(v,u,terrain).visible);}
export function cancel(u){if(!has(u))return;u.holoCancelled=true;u.states=u.states.filter(k=>k!=='holoecho');}
export function coherent(group,u){return group.some(v=>v.id!==u.id&&E.edgeDistance(u,v)<=8+.001);}
export function check(units,u,{start=false}={}){const group=[u,...echoes(units,u)];if(!has(u))return [];const bad=group.filter(v=>!coherent(group,v));for(const v of bad){if(v===u)cancel(u);else{v.hp=-1;v.states=['dead'];}}if(!echoes(units,u).length)cancel(u);if(start&&u.holoCancelled)finish(units,u);return bad.map(v=>v.id);}
export function finish(units,u){delete u.maskCancelled;if(u.holoCancelled){for(const v of echoes(units,u)){v.hp=-1;v.states=['dead'];}delete u.holoCancelled;}}
export function contact(units,u,terrain=[]){if(!has(u))return;if(units.some(v=>v.team!==u.team&&S.onTable(v)&&!S.has(v,'camouflaged')&&!S.has(v,'impersonation1')&&!S.has(v,'impersonation2')&&E.inContact(u,v,terrain))){if(u.isHoloDecoy){u.hp=-1;u.states=['dead'];}else cancel(u);}}
export function conclude(units){for(const u of units)delete u.maskCancelled;for(const u of units.filter(v=>v.holoprojector)){if(u.impetuous||S.has(u,'retreat')||!S.active(u))cancel(u);check(units,u);finish(units,u);}}
export function create(state,u,points,{terrain=[],deployment=false}={}){if(!u.holoprojector||has(u)||points.length<1||points.length>2)return {error:'选择1或2个新回声位置'};if(!deployment&&!canEnter(u,state.units,terrain))return {error:'需要处于有效敌方模型与标记视线外'};const generation=(u.holoGeneration||0)+1;
 const entities=points.map((p,i)=>({...structuredClone(u),...p,id:'holo-'+u.id+'-'+generation+'-'+i,name:(u.holoAppearance?.name||u.name)+' · 回声'+(i+1),holoOwnerId:u.id,isHoloDecoy:true,isDecoy:true,holoprojector:false,decoyOwnerId:null,noOrders:true,noARO:true,lieutenant:false,regularOrderCount:0,irregularTroop:false,tacticalAwareness:false,decoy:0,minelayer:0,combatJump:false,parachutist:false,hiddenDeployment:false,peripheral:false,controllerId:null,ancillaryProfiles:[],points:0,loadout:[],armyWeapons:{},deployableItems:[],hackingDevice:null,repeater:false,symbioMate:null,symbioBomb:null,transmutation:null,proxyGroup:null,states:[...(u.states||[]).filter(k=>!['camouflaged','impersonation1','impersonation2','holoecho'].includes(k)),'holoecho'],hp:1,maxhp:1,attribute:'VITA',remotePresence:false,nwi:false,dogged:false,explode:false,ftLevel:0,ftId:null,deploymentPending:false,deploymentLocked:true}));
 for(let i=0;i<entities.length;i++){const v=entities[i],shown=n=>({...n,states:(n.states||[]).filter(k=>k!=='hiddenDeployment')}),bad=E.validPosition(shown(v),v,[...state.units,...entities.slice(0,i)].map(n=>n.id===u.id||n.holoOwnerId===u.id?shown(n):n),terrain);if(bad)return {error:bad};if(deployment&&!P.inDeployment(u,v,{attemptInfiltration:!!u.infiltrationAttempt}))return {error:'回声超出真实模型获准部署区'};if(!deployment&&E.edgeDistance(u,v)>.025)return {error:'重新进入时，新回声须与真实模型轮廓接触'};if(state.units.some(n=>n.team!==u.team&&S.onTable(n)&&E.edgeDistance(v,n)<=.025)||(state.objectives||[]).some(n=>E.dist(v,n)<=E.radius(v)+(n.r||0)+.025))return {error:'不能放置接触敌人或任务目标'};}
 const group=[u,...entities];if(group.some(v=>!coherent(group,v)))return {error:'每个回声必须与至少另一个保持8寸一致性'};u.holoPublic=false;delete u.holoMarkerId;u.holoGeneration=generation;u.markerGeneration=(u.markerGeneration||0)+1;u.states=[...new Set([...(u.states||[]),'holoecho'])];delete u.holoCancelled;if(deployment)u.deploymentLocked=true;state.units.push(...entities);return {entities};}
export function snappedPoint(u,p,{deployment=false}={}){if(deployment)return p;const angle=Math.atan2(p.y-u.y,p.x-u.x),distance=2*E.radius(u)+.002;return {...p,x:u.x+Math.cos(angle)*distance,y:u.y+Math.sin(angle)*distance,z:u.z||0};}

// Public Holoecho notice is attached to a chosen model, never necessarily the bearer.
export function needsPublicMarker(u){return has(u)&&S.has(u,'holomask')&&!u.holoPublic;}
export function publish(units,u,id){if(!has(u))return false;if(u.holoPublic)return true;const group=[u,...echoes(units,u)];if(needsPublicMarker(u)&&!group.some(v=>v.id===id))return false;u.holoPublic=true;u.holoMarkerId=id||u.id;return true;}
export function appearance(u){return (S.has(u,'holomask')||u.maskCancelled)&&u.holoAppearance;}
export function publicTokens(u,units){const c=bearer(units,u);if(!c)return {hideHolo:false,showHolo:false};const combined=!!appearance(c);return {hideHolo:combined,showHolo:combined&&has(c)&&c.holoPublic&&c.holoMarkerId===u.id};}
// Plan every recorded position before making any of the hidden group public.
// The virtual table reserves earlier placements, so moved echoes cannot overlap.
export function planHiddenReveal(units,u,terrain=[]){
 const c=bearer(units,u);
 if(!c)return {can:false,error:'找不到隐匿全息的真实模型'};
 const group=[c,...echoes(units,c)].filter(n=>S.has(n,'hiddenDeployment')||n.hiddenRevealPending),ids=new Set(group.map(n=>n.id)),virtual=units.map(n=>({...n,states:ids.has(n.id)?[...new Set([...(n.states||[]),'hiddenDeployment'])]:[...(n.states||[])]})),placements=[];
 for(const n of group){
  const copy=virtual.find(v=>v.id===n.id),placement=HP.position(copy,virtual,terrain);
  if(placement.error)return {can:false,error:placement.error,failedId:n.id,groupIds:[...ids]};
  placements.push({id:n.id,...placement});Object.assign(copy,placement.point);copy.states=copy.states.filter(k=>k!=='hiddenDeployment');
 }
 return {can:true,placements,groupIds:[...ids]};
}
export function revealHidden(units,u,terrain=[]){
 if(!S.has(u,'hiddenDeployment')&&!u.hiddenRevealPending)return [];
 const c=bearer(units,u),plan=planHiddenReveal(units,u,terrain);
 if(!plan.can){for(const n of units.filter(n=>plan.groupIds?.includes(n.id))){n.hiddenPlacementError=plan.error;n.states=[...new Set([...(n.states||[]),'hiddenDeployment'])];}return Object.assign([],{error:plan.error});}
 for(const placement of plan.placements){const n=units.find(v=>v.id===placement.id);if(placement.moved){n.hiddenRecordedPosition=placement.origin;n.hiddenPlacementDistance=placement.distance;Object.assign(n,placement.point);}delete n.hiddenPlacementError;n.states=(n.states||[]).filter(k=>k!=='hiddenDeployment');n.hiddenOrderAvailable=false;delete n.hiddenRevealPending;}
 return check(units,c,{start:true});
}
export function syncHidden(units,terrain=[]){for(const u of units.filter(v=>v.hiddenRevealPending))revealHidden(units,u,terrain);}
