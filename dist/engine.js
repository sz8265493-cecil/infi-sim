import {isProne,active as activeState,has as hasState,onTable,unconscious,survivalActive} from './states.js?v=122';
// All map coordinates are inches. A grid cell is 1 inch; bases retain their mm size.
export const BASE={0:25,1:25,2:25,3:40,4:55,5:40,6:40,7:55};
export const WEAPONS={combi:{name:'Combi Rifle',b:3,ps:7,bands:[[16,3],[32,-3],[48,-6]]},hmg:{name:'HMG',b:4,ps:5,bands:[[8,-3],[16,0],[32,3],[48,-3]]},spitfire:{name:'Spitfire',b:4,ps:6,bands:[[8,0],[24,3],[32,-3],[48,-6]]}};
export const radius=u=>u.baseRadius??BASE[u.s]/25.4/2;
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const HEIGHT={0:3,1:25,2:40,3:32,4:32,5:45,6:55,7:67};
export const height=u=>(isProne(u)?3:HEIGHT[u.s]||40)/25.4;
export const elevation=u=>u.z||0;
export const dist3=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,elevation(a)-elevation(b));
export const edgeDistance=(a,b)=>Math.hypot(Math.max(0,dist(a,b)-radius(a)-radius(b)),Math.max(0,elevation(a)-elevation(b)-height(b),elevation(b)-elevation(a)-height(a)));
export const terrainHeight=t=>t.height??(t.kind==='cover'?1.2:Infinity);
export const inside=(p,t,pad=0)=>p.x>=t.x+pad-1e-6&&p.x<=t.x+t.w-pad+1e-6&&p.y>=t.y+pad-1e-6&&p.y<=t.y+t.h-pad+1e-6;
// Explicit scene geometry: height is top altitude; bottom defaults to ground.
export const terrainBottom=t=>t.bottom??0;
export function terrainParts(t){
 let parts=[{...t,openings:undefined}];
 for(const hole of t.openings||[])parts=parts.flatMap(p=>{
  const x=Math.max(p.x,hole.x),y=Math.max(p.y,hole.y),r=Math.min(p.x+p.w,hole.x+hole.w),b=Math.min(p.y+p.h,hole.y+hole.h);
  if(x>=r||y>=b)return [p];
  return [{...p,w:x-p.x},{...p,x:r,w:p.x+p.w-r},{...p,x,w:r-x,h:y-p.y},{...p,x,y:b,w:r-x,h:p.y+p.h-b}].filter(q=>q.w>1e-8&&q.h>1e-8);
 });return parts;
}
export const supported=(p,t,r=0)=>inside(p,t,r)&&!(t.openings||[]).some(h=>r?pointRect(p,h)<r-1e-6:inside(p,h,-1e-6));
// Contact fraction of the circular base with the union of horizontal surfaces.
// A transit surface also needs half-base width; an endpoint needs the full footprint.
export function footprintSupport(u,p,terrain,{full=false}={}){const r=radius(u),z=elevation(p);if(z<.001)return true;const tops=terrain.filter(t=>Math.abs(terrainHeight(t)-z)<.02);if(tops.some(t=>supported(p,t,r)))return true;const parts=tops.flatMap(terrainParts).filter(t=>full||Math.min(t.w,t.h)>=r-.002);if(!parts.length)return false;let area=0,total=0;const n=120;for(let i=0;i<n;i++){const x=p.x-r+(i+.5)*2*r/n,d=Math.sqrt(Math.max(0,r*r-(x-p.x)**2)),lo=p.y-d,hi=p.y+d;total+=hi-lo;const spans=parts.filter(t=>x>=t.x-1e-8&&x<=t.x+t.w+1e-8).map(t=>[Math.max(lo,t.y),Math.min(hi,t.y+t.h)]).filter(([l,h])=>h>l).sort((a,b)=>a[0]-b[0]);let edge=lo;for(const [l,h] of spans){if(h<=edge)continue;area+=h-Math.max(edge,l);edge=h;}}return area/total>=(full?1-1e-7:.5-.002);}
export const overlapsAltitude=(u,p,t)=>terrainHeight(t)>elevation(p)+.001&&terrainBottom(t)<elevation(p)+height(u)-.001;
export const hitsTerrain=(u,p,t)=>overlapsAltitude(u,p,t)&&terrainParts(t).some(q=>pointRect(p,q)<radius(u)-.001);
export function surfaceAt(p,terrain,z){return terrain.find(t=>t.kind==='building'&&Number.isFinite(terrainHeight(t))&&supported(p,t)&& (z===undefined||Math.abs(terrainHeight(t)-z)<.01));}
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function rangeMod(w,d){return WEAPONS[w].bands.find(([max])=>d<=max+1e-8)?.[1]??null;}
export function pointRect(p,r){return Math.hypot(Math.max(r.x-p.x,0,p.x-r.x-r.w),Math.max(r.y-p.y,0,p.y-r.y-r.h));}
export function segmentRect(a,b,r,pad=0){let lo=0,hi=1;for(const [p,d,mn,mx] of [[a.x,b.x-a.x,r.x-pad,r.x+r.w+pad],[a.y,b.y-a.y,r.y-pad,r.y+r.h+pad]]){if(Math.abs(d)<1e-10){if(p<mn||p>mx)return false;}else{let t=(mn-p)/d,v=(mx-p)/d;if(t>v)[t,v]=[v,t];lo=Math.max(lo,t);hi=Math.min(hi,v);if(lo>hi)return false;}}return true;}
export function segmentDistance(p,a,b){const l=(b.x-a.x)**2+(b.y-a.y)**2;if(!l)return dist(p,a);const t=clamp(((p.x-a.x)*(b.x-a.x)+(p.y-a.y)*(b.y-a.y))/l,0,1);return dist(p,{x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y)});}
export function validPosition(u,p,units,terrain){units=units.filter(v=>!v.deploymentPending&&!v.offTable&&!(v.states||[]).includes('hiddenDeployment'));if(units.some(v=>v.team!==u.team&&(v.states||[]).includes('camouflaged')&&edgeDistance({...u,...p},v)<.025))return '不能主动接触未揭露的迷彩标记';const r=radius(u),z=elevation(p);if(p.x<r||p.y<r||p.x>48-r||p.y>48-r)return '底座超出战场';
if(z>0&&!p.wall&&!footprintSupport(u,p,terrain,{full:true}))return '终点需要容纳完整底座的水平屋顶';
if(terrain.some(t=>hitsTerrain(u,p,t)&&(!p.wall||t.id!==p.wall)))return '底座与地形重叠';
if(units.some(v=>v.id!==u.id&&!(v.states||[]).includes('dead')&&Math.min(z+height(u),elevation(v)+height(v))>Math.max(z,elevation(v))+.001&&dist(p,v)<r+radius(v)-.001))return '底座与其他单位重叠';const at={...u,...p};for(const v of units.filter(v=>v.id!==u.id&&!(v.states||[]).includes('dead')&&inContact(at,v,terrain))){const count=units.filter(n=>n.id!==u.id&&n.id!==v.id&&!(n.states||[]).includes('dead')&&inContact(n,v,terrain)).length;if(count>=(radius(v)<.7?4:6))return '超过目标底盘允许的轮廓接触模型数量';}return '';}
// N5: allies/neutral models may be crossed; stop positions still need a full base.
// Narrow terrain passage uses half base width during transit. Enemy clearance stays full width.
export function pathLength(path){return path.slice(1).reduce((n,p,i)=>n+dist3(path[i],p),0);}
export function samplePath(path,step=.08){return path.flatMap((p,i)=>{if(!i)return [p];const a=path[i-1],n=Math.max(1,Math.ceil(dist3(a,p)/step));return Array.from({length:n},(_,j)=>({x:a.x+(p.x-a.x)*(j+1)/n,y:a.y+(p.y-a.y)*(j+1)/n,z:elevation(a)+(elevation(p)-elevation(a))*(j+1)/n,wall:j===n-1?(p.wall||null):(p.wall||a.wall),prone:j===n-1?(p.prone??a.prone):a.prone,vaultTop:p.vaultTop===undefined?undefined:Math.max(elevation(a),p.vaultTop),vaultFrom:p.vaultFrom}));});}
// Hidden/off-table records never obstruct movement; NWI/Dogged remain conscious enemies.
export const blocksMovement=(u,v)=>v.id!==u.id&&v.team!==u.team&&v.team!==-1&&onTable(v)&&!unconscious(v)&&(!(v.hp<=0)||survivalActive(v));
export function contactEnd(u,to,units){let first=1;const dx=to.x-u.x,dy=to.y-u.y,A=dx*dx+dy*dy;if(!A)return {...to};for(const v of units){if(!blocksMovement(u,v)||Math.abs(elevation(v)-elevation(u))>height(u))continue;const R=radius(u)+radius(v),ox=u.x-v.x,oy=u.y-v.y,B=2*(ox*dx+oy*dy),D=B*B-4*A*(ox*ox+oy*oy-R*R);if(D<0)continue;const t=(-B-Math.sqrt(D))/(2*A);if((t>1e-7||(t>=-1e-7&&B<0))&&t<first)first=Math.max(0,t);}return {...to,x:u.x+dx*first,y:u.y+dy*first,z:elevation(u)+(elevation(to)-elevation(u))*first};}
// A narrow corridor is an explicit pair of facing walls, not permission to clip any corner.
export function narrowClearance(q,r,terrain){for(const a of terrain)for(const b of terrain){if(a===b)continue;const gap=b.y-(a.y+a.h),over=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x);if(gap>=r-0.002&&gap<2*r&&over>0&&q.x>=Math.max(a.x,b.x)-r&&q.x<=Math.min(a.x+a.w,b.x+b.w)+r&&q.y>=a.y+a.h+r/2-.001&&q.y<=b.y-r/2+.001)return true;const gx=b.x-a.x-a.w,oy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);if(gx>=r-.002&&gx<2*r&&oy>0&&q.y>=Math.max(a.y,b.y)-r&&q.y<=Math.min(a.y+a.h,b.y+b.h)+r&&q.x>=a.x+a.w+r/2-.001&&q.x<=b.x-r/2+.001)return true;}return false;}
export function validPath(u,path,units,terrain,max,finish=true){const end=path.at(-1),r=radius(u);if(pathLength(path)>max+1e-6)return '超过本次移动距离';if(finish){const bad=validPosition(u,end,units,terrain);if(bad)return bad;}
for(const q of samplePath(path,.04)){if(q.x<r||q.y<r||q.x>48-r||q.y>48-r)return '底座超出战场';
const walls=terrain.flatMap(terrainParts).filter(t=>overlapsAltitude(u,q,t)&&(!q.wall||t.id!==q.wall)&&!(q.vaultTop!==undefined&&q.vaultTop-q.vaultFrom<=height(u)+.002&&terrainHeight(t)<=q.vaultTop+.002)),touch=walls.filter(t=>pointRect(q,t)<r-.001);
if(touch.length&&!narrowClearance(q,r,walls))return '墙角须计入完整底座；通道至少半个底座宽';
if(touch.some(t=>pointRect(q,t)<r/2-.001))return '通道不足半个底座宽，无法通过';
for(const t of touch)for(const v of units.filter(v=>blocksMovement(u,v)&&Math.abs(elevation(v)-elevation(q))<height(v))){const near={x:clamp(v.x,t.x,t.x+t.w),y:clamp(v.y,t.y,t.y+t.h)};if(pointRect(v,t)-radius(v)<=2*r&&segmentDistance(q,near,v)<r/2)return '敌人与障碍之间必须留出完整底座宽';}}
for(const q of samplePath(path,.04))if(units.some(v=>blocksMovement(u,v)&&edgeDistance({...u,...q},v)<.001&&dist(q,v)<r+radius(v)-.001))return '不能穿过敌人；接触敌方轮廓时停止';return '';}
export function validMove(u,p,units,terrain,max){return validPath(u,[u,p],units,terrain,max);}
export function inDeployment(u,p){const r=radius(u);return u.team===0?p.y-r>=36:p.y+r<=12;}
export function front(a,b){if(a.visor360||(a.states||[]).includes('camouflaged'))return true;const rad=a.facing*Math.PI/180;return Math.cos(rad)*(b.x-a.x)+Math.sin(rad)*(b.y-a.y)>=-radius(b);}
function rayInterval(a,b,t){let lo=0,hi=1;for(const [v,d,mn,mx] of [[a.x,b.x-a.x,t.x,t.x+t.w],[a.y,b.y-a.y,t.y,t.y+t.h],[a.z,b.z-a.z,terrainBottom(t),terrainHeight(t)]]){if(Math.abs(d)<1e-10){if(v<=mn+1e-6||v>=mx-1e-6)return null;}else{let p=(mn-v)/d,q=(mx-v)/d;if(p>q)[p,q]=[q,p];lo=Math.max(lo,p);hi=Math.min(hi,q);if(lo>=hi-1e-6)return null;}}return hi>1e-6&&lo<1-1e-6?[lo,hi]:null;}
export function rayBox(a,b,t){const hit=rayInterval(a,b,t);if(!hit)return false;if(!t.openings?.length)return true;
 // Subtract opening intervals from the outer solid, avoiding artificial seams
 // created by the rectangular partition used for support and rendering.
 const holes=t.openings.map(h=>rayInterval(a,b,{...h,bottom:terrainBottom(t),height:terrainHeight(t)})).filter(Boolean).sort((a,b)=>a[0]-b[0]);let cursor=hit[0];
 for(const [lo,hi] of holes){if(hi<=cursor)continue;if(lo>cursor+1e-6)return true;cursor=Math.max(cursor,hi);if(cursor>=hit[1]-1e-6)return false;}return cursor<hit[1]-1e-6;
}
// Persistent visibility areas are separate from physical collision/cover terrain.
export function zoneCrosses(a,b,z){return Math.max(elevation(a)+height(a),elevation(b)+height(b))>=(z.z||0)&&segmentDistance(z,a,b)<z.r;}
export function zoneRay(a,b,z,terrain=[]){
 if(z.w!==undefined)return segmentRect(a,b,z)&&Math.max(a.z,b.z)>=(z.z||0)&&Math.min(a.z,b.z)<=(z.top??Infinity);
 const dx=b.x-a.x,dy=b.y-a.y,A=dx*dx+dy*dy,ox=a.x-z.x,oy=a.y-z.y;
 let lo=0,hi=1;if(A>1e-12){const B=2*(ox*dx+oy*dy),disc=B*B-4*A*(ox*ox+oy*oy-z.r*z.r);if(disc<=0)return false;lo=Math.max(0,(-B-Math.sqrt(disc))/(2*A));hi=Math.min(1,(-B+Math.sqrt(disc))/(2*A));if(lo>hi)return false;}else if(ox*ox+oy*oy>z.r*z.r)return false;
 const root={x:z.x,y:z.y,z:(z.z||0)+.01};
 for(let i=0;i<=12;i++){const t=lo+(hi-lo)*(i+.5)/13,q={x:a.x+dx*t,y:a.y+dy*t,z:a.z+(b.z-a.z)*t};if(q.z<(z.z||0))continue;const floor={x:q.x,y:q.y,z:root.z};if(!terrain.some(t=>rayBox(root,floor,t)||rayBox(floor,q,t)))return true;}return false;
}
export const visibilityZones=terrain=>[...(terrain.zones||[]),...(terrain.areas||[]).filter(a=>a.visibility).map(a=>({...a,kind:a.visibility}))];
export function zoneBlocks(a,z){return z.kind==='eclipse'||z.kind==='whiteNoise'&&(a.msv>0||a.marksmanship)||['smoke','zero'].includes(z.kind)&&!a.msv;}
// Physical silhouette contact is independent of smoke, Eclipse and facing.
export function inContact(a,b,terrain=[]){if(edgeDistance(a,b)>.025)return false;const low=Math.max(elevation(a),elevation(b)),high=Math.min(elevation(a)+height(a),elevation(b)+height(b));if(high<low-.001)return false;const z=(low+high)/2;return !terrain.some(t=>rayBox({...a,z},{...b,z},t));}
export const engagedContact=(a,b,terrain=[])=>a.team>=0&&b.team>=0&&a.team!==b.team&&!a.isDeployable&&!b.isDeployable&&activeState(a)&&activeState(b)&&![a,b].some(u=>hasState(u,'immA')||hasState(u,'immB'))&&inContact(a,b,terrain);
export function crossedZones(a,b,terrain,zones=visibilityZones(terrain)){const ray=visibility({...a,zoneReturnFire:true},b,terrain).ray;return ray?zones.filter(z=>zoneRay(ray.from,ray.to,z,terrain)):[];}
export function saturation(a,b,terrain){return crossedZones(a,b,terrain,(terrain.areas||[]).filter(z=>z.saturation)).length>0;}
export function visibilityMod(a,b,terrain,{respondingAttack=false}={}){if(engagedContact(a,b,terrain))return 0;return Math.min(0,...crossedZones(a,b,terrain).map(z=>zoneBlocks(a,z)?(respondingAttack?-6:0):['smoke','zero'].includes(z.kind)?(a.msv===1?-6:0):z.kind==='poor'?(a.msv>=2?0:a.msv===1?-3:-6):z.kind==='low'?(a.msv?0:-3):0));}
// Only stationary Models block LoF. Markers never do; templates still ignore Models.
export function lofBlockers(a,b,terrain){const moving=new Set(terrain.movingIds||[]);return (terrain.units||[]).filter(u=>u!==a&&u!==b&&!(u.id!=null&&(u.id===a.id||u.id===b.id))&&!moving.has(u.id)&&!u.offTable&&!u.deploymentPending&&!(u.states||[]).some(k=>['dead','hiddenDeployment','camouflaged','impersonation1','impersonation2','holoecho','decoy'].includes(k))&&(!u.isDecoy||u.holoAppearance));}
export function rayCylinder(a,b,u){const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,ox=a.x-u.x,oy=a.y-u.y,A=dx*dx+dy*dy,R=radius(u);let lo=0,hi=1;if(A<1e-12){if(ox*ox+oy*oy>=R*R-1e-8)return false;}else{const B=2*(ox*dx+oy*dy),C=ox*ox+oy*oy-R*R,D=B*B-4*A*C;if(D<=1e-10)return false;lo=Math.max(lo,(-B-Math.sqrt(D))/(2*A));hi=Math.min(hi,(-B+Math.sqrt(D))/(2*A));}const bottom=elevation(u),top=bottom+height(u);if(Math.abs(dz)<1e-12){if(a.z<=bottom+1e-6||a.z>=top-1e-6)return false;}else{let l=(bottom-a.z)/dz,h=(top-a.z)/dz;if(l>h)[l,h]=[h,l];lo=Math.max(lo,l);hi=Math.min(hi,h);}return Math.min(1-1e-6,hi)>Math.max(1e-6,lo)+1e-6;}
export function visibility(a,b,terrain){const angle=Math.atan2(b.y-a.y,b.x-a.x),perp={x:-Math.sin(angle),y:Math.cos(angle)},patch=b.baseRadius===0?0:3/25.4,ah=height(a),bh=height(b),contact=engagedContact(a,b,terrain),models=lofBlockers(a,b,terrain);
// Sample the full cylinder, including its forward/rear rim. Sampling only
// sideways points falsely hides a rooftop trooper from an enemy near the wall.
const along={x:Math.cos(angle),y:Math.sin(angle)},offset=(u,f,l)=>({x:u.x+along.x*f+perp.x*l,y:u.y+along.y*f+perp.y*l});
const footprint=[{x:a.x,y:a.y},...Array.from({length:12},(_,i)=>({x:a.x+Math.cos(i*Math.PI/6)*radius(a)*.98,y:a.y+Math.sin(i*Math.PI/6)*radius(a)*.98}))];
const origins=footprint.flatMap(p=>[Math.min(.5,ah/2),Math.max(.005,ah-.005)].map(z=>({...p,z:elevation(a)+z})));
const targets=[0,-.9,.9].flatMap(f=>[0,-.65,.65].map(l=>offset(b,f*radius(b),l*radius(b)))).filter(p=>[-1,1].every(k=>dist(b,{x:p.x+perp.x*k*patch/2,y:p.y+perp.y*k*patch/2})<=radius(b)+1e-6)).flatMap(p=>[patch/2,Math.max(patch/2,bh-patch/2)].map(z=>({...p,z:elevation(b)+z})));
let first=null,open=0;for(const p of targets){const corners=[-1,1].flatMap(x=>[-1,1].map(z=>({x:p.x+perp.x*x*patch/2,y:p.y+perp.y*x*patch/2,z:p.z+z*patch/2})));const origin=origins.find(o=>corners.every(c=>!terrain.some(t=>rayBox(o,c,t))&&!models.some(u=>rayCylinder(o,c,u))&&!(contact?[]:visibilityZones(terrain)).some(z=>zoneBlocks(a,z)&&!a.zoneReturnFire&&zoneRay(o,c,z,terrain))));if(origin){open++;first||={from:origin,to:p};}}
return {visible:open>0,partial:open<targets.length,ray:first};}
export function cover(a,b,terrain){if(b.noCover||b.skillNoCover||b.wall)return false;const vis=visibility(a,b,terrain);if(!vis.visible)return false;const roof=surfaceAt(b,terrain,elevation(b));if(roof&&elevation(b)>elevation(a)+height(a))return true;return terrain.flatMap(terrainParts).some(t=>overlapsAltitude(b,b,t)&&pointRect(b,t)<=radius(b)+.08&&segmentRect(a,b,t,radius(b)*.6))&&vis.partial;}
export function attackInfo(a,b,terrain,aro='shoot',manualCover='auto'){
 const d=edgeDistance(a,b),w=WEAPONS[a.weapon],rw=WEAPONS[b.weapon],v=visibility(a,b,terrain);const ac=cover(b,a,terrain),bc=manualCover==='auto'?cover(a,b,terrain):manualCover==='yes';const rm=rangeMod(a.weapon,d),rr=rangeMod(b.weapon,d);
 const can=v.visible&&front(a,b)&&rm!==null&&a.hp>0&&b.hp>0;
 const returnFire=aro==='shoot'&&visibility(b,a,terrain).visible&&front(b,a)&&rr!==null;
 const aMod=clamp((rm??-99)-(bc?3:0)-(b.mim||0),-12,12),bMod=clamp((rr??-99)-(ac?3:0)-(a.mim||0),-12,12);
 return {d,w,rw,ac,bc,rm,rr,can,returnFire,aSV:can?clamp(a.bs+aMod,0,20):0,bSV:aro==='dodge'?b.ph:returnFire?clamp(b.bs+bMod,0,20):0,bDamage:returnFire,reason:a.hp<=0?'射手已失能':b.hp<=0?'目标已失能':!v.visible?'建筑完全阻挡视线':!front(a,b)?'目标在射手后方，请调整朝向':rm===null?'超过武器最大射程':''};
}
export const critical=(die,sv)=>die>0&&die<=20&&sv>0&&(sv>20?(die===20||die<=sv-20):die===sv);
export function resolveDice(aDice,aSV,bDice,bSV,{aCritical=true,bCritical=true}={}){const a=aDice.filter(d=>d<=aSV),b=bDice.filter(d=>d<=bSV),ca=aCritical?a.filter(d=>critical(d,aSV)):[],cb=bCritical?b.filter(d=>critical(d,bSV)):[];if(ca.length&&cb.length)return {a:[],b:[],tie:true};if(cb.length)return {a:[],b:b.filter(d=>critical(d,bSV)||d>Math.max(0,...a)),tie:false};if(ca.length)return {a:a.filter(d=>critical(d,aSV)||d>Math.max(0,...b)),b:[],tie:false};return {a:a.filter(d=>d>Math.max(0,...b)),b:b.filter(d=>d>Math.max(0,...a)),tie:false};}
// Exact enumeration over one reactive d20; independence handles all active burst dice.
export function odds(info,a,b){if(!info.can)return {win:0,lose:0,tie:1,wound:0,risk:0};let win=0,lose=0,wound=0,risk=0;const B=info.w.b,q=clamp((info.w.ps+b.arm+(info.bc?3:0))/20,0,1),qr=clamp((info.rw.ps+a.arm+(info.ac?3:0))/20,0,1);for(let r=1;r<=20;r++){const enemy=r<=info.bSV,crit=enemy&&r===info.bSV;let good=0,norm=0,cr=0,lower=0;for(let d=1;d<=20;d++){const pass=d<=info.aSV,ac=pass&&d===info.aSV;if(!crit&&pass&&(ac||!enemy||d>r)){good++;if(ac)cr++;else norm++;}if(!pass||(!ac&&d<r))lower++;}
const aw=crit?0:1-(1-good/20)**B;const bw=enemy?(crit?(1-(info.aSV>0?1/20:0))**B:(lower/20)**B):0;win+=aw/20;lose+=bw/20;wound+=(crit?0:1-(1-norm/20*(1-q)-cr/20*(1-q*q))**B)/20;risk+=info.bDamage?bw*(1-qr**(crit?2:1))/20:0;}return {win,lose,tie:Math.max(0,1-win-lose),wound,risk};}
export function rollAttack(a,b,info,rng=Math.random){const roll=()=>1+Math.floor(rng()*20),ad=Array.from({length:info.w.b},roll),bd=info.bSV>0?[roll()]:[],out=resolveDice(ad,info.aSV,bd,info.bSV);const saves=(hits,sv,ps,target,cov)=>hits.flatMap(h=>Array.from({length:h===sv?2:1},()=>{const die=roll();return {die,sv:Math.min(20,ps+target.arm+(cov?3:0)),fail:die>ps+target.arm+(cov?3:0)};}));const bs=saves(out.a,info.aSV,info.w.ps,b,info.bc),as=info.bDamage?saves(out.b,info.bSV,info.rw.ps,a,info.ac):[];return {ad,bd,out,bs,as,aW:as.filter(x=>x.fail).length,bW:bs.filter(x=>x.fail).length};}
// Circle area between horizontal lines, to enforce 'more than half the base'.
export function circleAreaBelow(y,c,r){const z=clamp(y-c,-r,r);return z*Math.sqrt(Math.max(0,r*r-z*z))+r*r*Math.asin(z/r)+Math.PI*r*r/2;}
export function sectorOf(u){for(let i=0;i<3;i++){const lo=12+i*8,hi=lo+8,r=radius(u);if(circleAreaBelow(hi,u.y,r)-circleAreaBelow(lo,u.y,r)>Math.PI*r*r/2+1e-8)return i;}return -1;}
export function sectors(units){const out=Array.from({length:3},()=>[0,0]);for(const u of units)if(u.hp>0){const s=sectorOf(u);if(s>=0)out[s][u.team]+=u.points;}return out;}
export function score(units){return sectors(units).reduce((s,p,i)=>{if(p[0]>p[1])s[0]+=[5,3,2][i];else if(p[1]>p[0])s[1]+=[2,3,5][i];return s;},[0,0]);}
export function pointInPoly(p,poly){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)inside=!inside;}return inside;}
// Template solids: circular sphere and teardrop revolved about its long axis.
// Blast rays remain inside the convex solid; scenery uses its actual height.
export function templateContains(shape,p){
 const o=shape.origin,dx=p.x-o.x,dy=p.y-o.y,dz=(p.z||0)-(o.z||0);
 if(shape.kind==='circle')return dx*dx+dy*dy+dz*dz<=shape.r*shape.r+1e-7;
 const angle=shape.angle??Math.atan2(shape.poly[1].y-o.y,shape.poly[1].x-o.x),pitch=shape.pitch||0,c=Math.cos(angle),s=Math.sin(angle),cp=Math.cos(pitch),sp=Math.sin(pitch);
 const along=(dx*c+dy*s)*cp+dz*sp,side=-dx*s+dy*c,vertical=dz*cp-(dx*c+dy*s)*sp;const radial=Math.hypot(side,vertical),bounds=shape.bounds;if(bounds&&(along<bounds.minX-1e-6||along>bounds.maxX+1e-6||radial>bounds.maxY+1e-6))return false;
 const local=shape.outline||shape.poly.map(q=>({x:(q.x-o.x)*c+(q.y-o.y)*s,y:-(q.x-o.x)*s+(q.y-o.y)*c})),q={x:along,y:radial};
 return pointInPoly(q,local)||local.some((a,i)=>segmentDistance(q,a,local[(i+1)%local.length])<1e-6);
}
export function templateHits(shape,u,terrain=[]){
 if(!shape)return false;
 const r=radius(u),bottom=elevation(u),top=bottom+height(u),o={...shape.origin,z:shape.origin.z||0},near=Math.atan2(o.y-u.y,o.x-u.x);
 // Conservative bounds reject only cylinders wholly outside the template solid.
 if(shape.kind==='circle'&&Math.hypot(Math.max(0,dist(u,o)-r),o.z-clamp(o.z,bottom,top))>shape.r+1e-6)return false;
 if(shape.kind==='drop'&&!shape.pitch&&shape.bounds){const c=Math.cos(shape.angle),s=Math.sin(shape.angle),dx=u.x-o.x,dy=u.y-o.y,along=dx*c+dy*s,side=-dx*s+dy*c,b=shape.bounds;if(along+r<b.minX-1e-6||along-r>b.maxX+1e-6||Math.abs(side)-r>b.maxY+1e-6||bottom>o.z+b.maxY+1e-6||top<o.z-b.maxY-1e-6)return false;}
 // Include the exact nearest radial point and height for sphere tangencies, plus
 // cylinder surface/interior samples for partial exposure around terrain edges.
 const zs=new Set([bottom,top,clamp(o.z,bottom,top)]);
 for(let i=1;i<16;i++)zs.add(bottom+(top-bottom)*i/16);
 const d=dist(u,o),q=Math.min(1,r/(d||1));const xy=[u,{x:u.x+(o.x-u.x)*q,y:u.y+(o.y-u.y)*q}];for(const rr of [r*.5,r])for(let i=0;i<48;i++){const a=near+i*Math.PI/24;xy.push({x:u.x+rr*Math.cos(a),y:u.y+rr*Math.sin(a)});}
 for(const z of zs)for(const q of xy){const p={...q,z};if(!terrain.some(t=>rayBox({...o,z:o.z+1e-5},{...p,z:p.z+1e-5},t))&&templateContains(shape,p))return true;}
 return false;
}
export function teardrop(origin,angle,length,width,outline,pitch=0){const c=Math.cos(angle),s=Math.sin(angle);let local=outline;if(!local){const r=width/2,center=length-r,theta=Math.acos(-r/center);local=[{x:0,y:0},...Array.from({length:81},(_,i)=>{const a=-theta+2*theta*i/80;return {x:center+r*Math.cos(a),y:r*Math.sin(a)};})];}
 return {kind:'drop',origin,angle,pitch,length,width,bounds:{minX:Math.min(...local.map(p=>p.x)),maxX:Math.max(...local.map(p=>p.x)),maxY:Math.max(...local.map(p=>Math.abs(p.y)))},outline:local,poly:local.map(p=>({x:origin.x+p.x*Math.cos(pitch)*c-p.y*s,y:origin.y+p.x*Math.cos(pitch)*s+p.y*c}))};}
export function movementBudget(u,stance='keep',distance=u.mov){const prone=stance==='proneStart'?true:stance==='standStart'?false:!!u.prone;return distance/(prone?2:1);}
export function endingProne(u,stance='keep'){return stance.startsWith('prone')?true:stance.startsWith('stand')?false:!!u.prone;}
