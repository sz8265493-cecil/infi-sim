import * as TR from './terrain-rules.js?v=36';
import * as E from './engine.js?v=36';
export const FIRST={remask:'重新全息伪装 HoloMask · 整令',suppressive:'压制射击 Suppressive Fire · 整令',speculative:'推测射击 Speculative Attack · 整令',intuitiveDeploy:'直觉放置地雷 · 整令',recamo:'重新迷彩 · 整令',triangulated:'三角射击 · 整令',move:'移动 Move · 基本短技能',idle:'待机 Idle · 基本短技能',discover:'发现 Discover · 基本短技能',jump:'跳跃 Jump · 整令',climb:'攀爬 Climb · 整令',superjump:'超级跳 Jump · 基本短技能',superlong:'超级跳 Jump · 整令',climbplus:'强化攀爬 Climb · 基本短技能'};
export const isLong=k=>String(k).startsWith('program:')||['remask','suppressive','airborne','jump','climb','superlong','recamo','triangulated','speculative','intuitiveDeploy'].includes(k);
export const isJump=k=>['jump','superjump','superlong'].includes(k);
export const isClimb=k=>['climb','climbplus'].includes(k);
export function budget(u,o){if(o.secondMove&&o.terrainStopped)return 0;const mod=TR.modifier(u,o.path?.[0]||u);u={...u,mov:Math.max(0,u.mov+mod),mov2:Math.max(0,(u.mov2??4)+Math.min(0,mod))};const k=o.moveKind||'move';if(o.distance!==undefined)return E.movementBudget(u,o.stance,Math.max(0,o.distance+Math.min(0,mod)));return isJump(k)?u.mov+(k==='superlong'||k==='jump'&&u.superJump?4:k==='superjump'?(u.superJumpBonus??u.jumpBonus??2):(u.jumpBonus??2)):isClimb(k)?E.movementBudget(u,o.stance,u.mov+(u.climbBonus??2)):E.movementBudget(u,o.stance,o.secondMove&&(!o.firstKind||['move','superjump'].includes(o.firstKind))?(u.mov2??4):u.mov);}
export function surfacePoint(p,id,terrain){const t=terrain.find(t=>t.id===id);return {...p,z:t?E.terrainHeight(t):0,wall:null};}
export function moveSegment(u,a,b,terrain){const r=E.radius(u),h=E.height(u);if(Math.abs(E.elevation(a)-E.elevation(b))>h+.001)return {error:'高度差超过轮廓，需攀爬或跳跃'};
const points=E.samplePath([{...a,z:0},{...b,z:0}],.12).map(p=>{const base=Math.min(E.elevation(a),E.elevation(b));const nearby=terrain.filter(t=>E.pointRect(p,t)<r-.001&&E.terrainHeight(t)>base+.001);let z=base;for(const t of nearby){if(E.terrainHeight(t)-Math.min(E.elevation(a),E.elevation(b))<=h+.001)z=Math.max(z,E.terrainHeight(t));}return {...p,z,wall:null,vault:z>base+.001};});
// Unsupported elevated space is not a bridge. Half-base overhang at an edge is allowed in transit.
if(points.some(p=>p.z>0&&!p.vault&&!terrain.some(t=>Math.abs(E.terrainHeight(t)-p.z)<.02&&E.inside(p,t))))return {error:'路径离开支撑面；不能在空中行走，请使用跳跃'};
return {points,cost:E.dist(a,b)};}
// Explicit straight segments, no ballistic curve or automatic arc-length inflation.
export function jumpPath(a,b,height=Math.max(E.elevation(a),E.elevation(b))){if(height<Math.max(E.elevation(a),E.elevation(b)))return {error:'途经高度不能低于起点或落点'};const route=[{...a,wall:null},{...a,z:height,wall:null},{...b,z:height,wall:null},{...b,wall:null}].filter((p,i,ps)=>!i||E.dist3(p,ps[i-1])>.000001);return {points:E.samplePath(route,.04),waypoints:route};}
// N5.3 Jet Propulsion: explicitly declared 3D waypoints can turn in mid-air.
// Only the final waypoint needs a supporting surface; every segment counts.
export function jetJumpPath(u,waypoints,units,terrain,max){
 if(!u.superJump||!u.jetPropulsion)return {error:'此配置没有超级跳（喷气推进）'};
 if(!Array.isArray(waypoints)||waypoints.length<2||waypoints.some(p=>![p.x,p.y,p.z??0].every(Number.isFinite)||(p.z||0)<0))return {error:'请指定完整的三维跳跃轨迹'};
 if(E.dist3(u,waypoints[0])>.01)return {error:'轨迹必须从单位当前位置开始'};
 const points=E.samplePath(waypoints.map(p=>({...p,wall:null,prone:false})),.04),cost=E.pathLength(points);
 const error=validJump({...u,prone:false},points,units,terrain,max);
 return error?{error}:{points,end:points.at(-1),cost,jetPropulsion:true};
}
// Infer a roof landing, then declare a vertical / horizontal / vertical
// polyline that clears known obstacles. Cost is only the sum of 3D segments.
export function autoJump(u,from,click,units,terrain,max){
 const roofs=terrain.filter(t=>E.inside(click,t));if(roofs.some(t=>!Number.isFinite(E.terrainHeight(t))))return {error:'不能降落在无限高地形上'};
 const end={...click,z:roofs.length?Math.max(...roofs.map(E.terrainHeight)):0,wall:null};
 const bad=E.validPosition({...u,prone:false},end,units,terrain);if(bad)return {error:bad};
 const projection=E.samplePath([{...from,z:0},{...end,z:0}],.04),r=E.radius(u),obstacles=terrain.filter(t=>projection.some(p=>E.pointRect(p,t)<r-.002));
 if(obstacles.some(t=>!Number.isFinite(E.terrainHeight(t))))return {error:'跳跃方向被无限高地形阻挡'};
 const height=Math.max(E.elevation(from),end.z,...obstacles.map(E.terrainHeight));
 const occupied=projection.map((p,i)=>obstacles.some(t=>E.pointRect(p,t)<r-.002)?i:-1).filter(i=>i>=0),first=projection[Math.max(0,(occupied[0]??0)-1)],last=projection[Math.min(projection.length-1,(occupied.at(-1)??projection.length-1)+1)];
 const routes=[[from,end],[from,{...first,z:height},{...last,z:height},end],jumpPath(from,end,height).waypoints];
 const plans=routes.map(route=>{const waypoints=route.map(p=>({...p,wall:null})).filter((p,i,ps)=>!i||E.dist3(p,ps[i-1])>.000001),points=E.samplePath(waypoints,.04);return {waypoints,points,end,cost:E.pathLength(points),error:validJump(u,points,units,terrain,Infinity)};}).filter(p=>!p.error).sort((a,b)=>a.cost-b.cost);
 const plan=plans[0];if(plan)delete plan.error;if(!plan)return {error:'没有能避开实体的直线分段路线；喷气推进可手动设置空中途经点'};
 return plan.cost>max+.001?{error:`跳跃路线 ${plan.cost.toFixed(2)}″，超过可用 ${max.toFixed(2)}″；按途经点之间的三维直线距离累计，请调整路线或落点。`}:plan;
}
export function planJump(u,o,click,units,terrain){
 const start=o.path[0],base=u.jetPropulsion?(o.jumpWaypoints||[start]):[start],max=budget(u,o);
 if(u.jetPropulsion&&o.jumpPointMode==='air'){
  const next={x:click.x,y:click.y,z:Number(o.jumpHeight??Math.max(4,E.elevation(base.at(-1)))),wall:null},waypoints=[...base,next],points=E.samplePath(waypoints,.04),error=validJump({...u,prone:false},points,units,terrain,max,{finish:false});
  return error?{error}:{points,waypoints,jumpWaypoints:waypoints,cost:E.pathLength(points),jumpHasLanding:false};
 }
 const used=E.pathLength(base),segment=autoJump(u,base.at(-1),click,units,terrain,max-used);if(segment.error)return segment;
 const waypoints=[...base,...segment.waypoints.slice(1)],points=E.samplePath(waypoints,.04),error=validJump({...u,prone:false},points,units,terrain,max);
 return error?{error}:{points,waypoints,cost:E.pathLength(points),jumpWaypoints:base,jumpHasLanding:true};
}
export function validJump(u,path,units,terrain,max,{finish=true}={}){if(!path?.length)return '请指定跳跃路线';if(path.some(p=>![p.x,p.y,p.z??0].every(Number.isFinite)||(p.z||0)<0))return '途经点坐标或高度无效';if(E.pathLength(path)>max+.001)return '跳跃三维路线超过可用距离';if(finish){const bad=E.validPosition({...u,prone:false},path.at(-1),units,terrain);if(bad)return bad;}if(!(u.superJump&&u.jetPropulsion)){let heading=null;for(let i=1;i<path.length;i++){const dx=path[i].x-path[i-1].x,dy=path[i].y-path[i-1].y,n=Math.hypot(dx,dy);if(n<.00001)continue;const d={x:dx/n,y:dy/n};if(heading&&(Math.abs(d.x*heading.y-d.y*heading.x)>.001||d.x*heading.x+d.y*heading.y<.999))return '普通跳跃不可在空中转向；只有超级跳（喷气推进）可以';heading=d;}}const r=E.radius(u);for(const q of E.samplePath(path,.04)){if(q.x<r||q.y<r||q.x>48-r||q.y>48-r)return '底座超出战场';if(terrain.some(t=>E.pointRect(q,t)<r-.002&&E.terrainHeight(t)>q.z+.01))return '跳跃路线穿过实体建筑，请提高途经点或选择其他落点';if(units.some(v=>v.id!==u.id&&!(v.hp<=0)&&!(v.states||[]).includes('dead')&&v.team!==u.team&&E.edgeDistance({...u,...q},v)<.001&&E.dist(q,v)<r+E.radius(v)-.001))return '跳跃路线穿过敌方轮廓';}return '';}
export function climbPath(u,t,max,down=false){if(!t||!Number.isFinite(E.terrainHeight(t)))return {error:'请选择有限高度楼房'};const r=E.radius(u),h=E.terrainHeight(t),z=E.elevation(u);let side=u.wallSide;
if(!side){const distances=[['left',Math.abs(u.x-t.x)],['right',Math.abs(u.x-t.x-t.w)],['top',Math.abs(u.y-t.y)],['bottom',Math.abs(u.y-t.y-t.h)]];side=distances.sort((a,b)=>a[1]-b[1])[0][0];}
const vertical=side==='left'||side==='right',at=side==='left'?t.x:side==='right'?t.x+t.w:side==='top'?t.y:t.y+t.h,sign=side==='left'||side==='top'?-1:1;
const along=vertical?u.y:u.x,mn=vertical?t.y:t.x,mx=mn+(vertical?t.h:t.w);if(along<mn+r||along>mx-r)return {error:'请先移动到能容纳完整底座的墙面中段'};
const coord=vertical?u.x:u.y;if(!u.wall&&Math.abs(coord-at)>r+.08)return {error:'普通攀爬必须先让底座接触墙面／屋顶边缘'};
const wallPoint={...u,[vertical?'x':'y']:at+sign*r,z,wall:t.id,wallSide:side};const targetZ=down?0:h,available=Math.max(0,max-E.dist3(u,wallPoint)),travel=Math.min(Math.abs(targetZ-z),available);const endZ=z+Math.sign(targetZ-z)*travel;let points=[{...u},wallPoint,{...wallPoint,z:endZ}],end=points.at(-1);if(Math.abs(endZ-targetZ)<.001){const landing={...end,[vertical?'x':'y']:at+(down?sign:-sign)*r,z:targetZ,wall:null,wallSide:null};if(E.pathLength([...points,landing])<=max+.001){points.push(landing);end=landing;}}
if(E.pathLength(points)>max+.001)return {error:'攀爬路径超过本次距离'};return {points,end};}
export function validate(u,o,units,terrain,finish=true){const terrainError=TR.pathError(u,o.path);if(terrainError)return terrainError;const original=u;u={...u,prone:isJump(o.moveKind)?false:o.stance==='proneStart'?true:o.stance==='standStart'?false:!!u.prone};if(isJump(o.moveKind)&&o.jumpHasLanding===false&&finish)return '请指定能容纳完整底盘的落点后再确认';if(isJump(o.moveKind))return validJump(u,o.path,units,terrain,budget(original,o),{finish});const cost=o.cost??E.pathLength(o.path);if(cost>budget(original,o)+.001)return '超过本次移动距离';if(finish){const bad=E.validPosition({...u,prone:E.endingProne(original,o.stance)},o.path.at(-1),units,terrain);if(bad)return bad;}const obstacles=isClimb(o.moveKind)?terrain:terrain.filter(t=>E.terrainHeight(t)>E.elevation(o.path[0])+E.height(u));return E.validPath(u,o.path,units,obstacles,Infinity,false);}
// Optional hollow objective-room teaching terrain, with explicitly declared 3-inch openings.
export function objectiveWalls(){const a=20,b=28,t=.3,g=2.5;return [{x:a,y:a,w:g,h:t},{x:a+5.5,y:a,w:g,h:t},{x:a,y:b-t,w:g,h:t},{x:a+5.5,y:b-t,w:g,h:t},{x:a,y:a,w:t,h:g},{x:a,y:a+5.5,w:t,h:g},{x:b-t,y:a,w:t,h:g},{x:b-t,y:a+5.5,w:t,h:g}].map((r,i)=>({...r,id:'room'+i,kind:'wall',height:Infinity,name:'OBJECTIVE WALL'}));}

// Clip only the new segment: existing declared waypoints are never silently rerouted.
// Full-base endpoint checks are distinct from transit checks (allies may be crossed).
export function nearestReachable(u,o,target,units,terrain,{finish=true}={}){
 const base=o.path?.length?o.path:[{...u}],from=base.at(-1),used=o.cost??base.slice(1).reduce((n,p,i)=>n+E.dist(base[i],p),0),remaining=Math.max(0,budget(u,o)-used);
 const moving={...u,prone:o.stance==='proneStart'?true:o.stance==='standStart'?false:!!u.prone};
 const requested=E.contactEnd({...moving,...from},target,units),length=E.dist(from,requested),fraction=length?Math.min(1,remaining/length):1;
 const at=t=>{const p={...requested,x:from.x+(requested.x-from.x)*t,y:from.y+(requested.y-from.y)*t};if(t===1)return p;const surfaces=terrain.filter(b=>E.inside(p,b)&&Number.isFinite(E.terrainHeight(b))&&Math.abs(E.terrainHeight(b)-E.elevation(from))<=E.height(moving)+.001);p.z=surfaces.length?Math.max(...surfaces.map(E.terrainHeight)):E.elevation(from);return p;};
 const candidate=t=>{const seg=moveSegment(moving,from,at(t),terrain);if(seg.error)return {error:seg.error};const path=[...base,...seg.points.slice(1)],cost=used+seg.cost;return {path,cost,end:path.at(-1),error:validate(moving,{...o,path,cost},units,terrain,finish)};};
 let best=candidate(fraction);if(!best.error)return {...best,clipped:fraction<1||E.dist(requested,target)>.001};
 // Scan from the requested end back toward the current point; an invalid endpoint
 // may lie on an ally even though the path beyond that ally is legal.
 const n=Math.max(1,Math.ceil(length*fraction/.04));let upper=fraction;
 for(let i=1;i<=n;i++){const t=fraction*(1-i/n),c=candidate(t);if(!c.error){let lo=t,hi=upper;for(let j=0;j<12;j++){const mid=(lo+hi)/2,v=candidate(mid);if(v.error)hi=mid;else{lo=mid;best=v;}}if(best.error)best=c;return {...best,clipped:true};}upper=t;}
 return {error:best.error||'当前方向没有可停留的位置'};
}
// The clicked roof identifies the building; its known geometry supplies wall and height.
export function autoClimb(u,click,max,terrain,units=[],{down}={}){
 const candidates=terrain.filter(t=>Number.isFinite(E.terrainHeight(t))&&E.terrainHeight(t)>0&&(t.id===u.wall||E.pointRect(u,t)<=E.radius(u)+.08));
 candidates.sort((a,b)=>(a.id===u.wall?-1:b.id===u.wall?1:E.pointRect(click,a)-E.pointRect(click,b)));
 let error='先接触楼房墙面或屋顶边缘，再点击楼房进行攀爬';
 for(const t of candidates){const descend=down??(E.elevation(u)>=E.terrainHeight(t)-.01||!!u.wall&&E.pointRect(click,t)>.05);const plan=climbPath(u,t,max,descend);if(plan.error){error=plan.error;continue;}const bad=E.validPath(u,plan.points,units,terrain,Infinity,true);if(bad){error=bad;continue;}return {...plan,cost:E.pathLength(plan.points),building:t.id};}return {error};
}

// Snap only the draft waypoint into a genuine half-base corridor. Final positions
// are still checked against the full footprint when the Move is confirmed.
export function snapPassage(u,p,terrain,threshold=.28){
 const r=E.radius(u),walls=terrain.filter(t=>E.terrainHeight(t)>E.elevation(p)+E.height(u)),candidates=[];
 for(const a of walls)for(const b of walls){if(a===b)continue;
  const gap=b.x-a.x-a.w,lo=Math.max(a.y,b.y),hi=Math.min(a.y+a.h,b.y+b.h);
  if(gap>=r-.002&&gap<2*r&&hi>lo&&p.y>=lo-2*r&&p.y<=hi+2*r){const q={...p,x:E.clamp(p.x,a.x+a.w+r/2,b.x-r/2)};if(E.dist(q,p)<=threshold)candidates.push(q);}
  const gy=b.y-a.y-a.h,lx=Math.max(a.x,b.x),hx=Math.min(a.x+a.w,b.x+b.w);
  if(gy>=r-.002&&gy<2*r&&hx>lx&&p.x>=lx-2*r&&p.x<=hx+2*r){const q={...p,y:E.clamp(p.y,a.y+a.h+r/2,b.y-r/2)};if(E.dist(q,p)<=threshold)candidates.push(q);}
 }
 return candidates.sort((a,b)=>E.dist(p,a)-E.dist(p,b))[0]||null;
}
