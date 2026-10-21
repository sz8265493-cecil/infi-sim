import * as E from './engine.js?v=34';
export const LEGACY_TERRAIN=[{x:5,y:5,w:7,h:6,kind:'building',name:'01 / STORAGE'},{x:20,y:4,w:8,h:4,kind:'building',name:'02 / DEPOT'},{x:36,y:5,w:7,h:6,kind:'building',name:'03 / TRANSIT'},{x:7,y:16,w:7,h:6,kind:'building',name:'04 / STACK'},{x:28,y:14,w:6,h:6,kind:'building',name:'05 / LAB'},{x:18,y:25,w:6,h:6,kind:'building',name:'06 / HUB'},{x:36,y:27,w:7,h:6,kind:'building',name:'07 / STORAGE'},{x:6,y:36,w:7,h:6,kind:'building',name:'08 / TRANSIT'},{x:24,y:38,w:7,h:5,kind:'building',name:'09 / HANGAR'},{x:17,y:16,w:4,h:.6,kind:'cover',name:'BARRIER'},{x:15,y:26,w:.6,h:4,kind:'cover',name:'BARRIER'},{x:28,y:29,w:4,h:.6,kind:'cover',name:'BARRIER'},{x:37,y:19,w:4,h:1.4,kind:'cover',name:'CARGO'},{x:5,y:27,w:4,h:1.4,kind:'cover',name:'CARGO'},{x:36,y:39,w:5,h:1.2,kind:'cover',name:'CARGO'}];
LEGACY_TERRAIN.forEach((t,i)=>Object.assign(t,{id:'t'+i,height:t.kind==='building'?[4,6,9,6,4,6,9,4,6][i]:1.2}));
LEGACY_TERRAIN[9].height=1.7;LEGACY_TERRAIN[10].height=.7;LEGACY_TERRAIN[11].height=.7;
// Footprints below are simulator design dimensions, not certified retail measurements.
// Official shape vocabulary: modular buildings, hoload panels, public consoles, blast barriers.
const north=[
 [5,6,4.5,4,4,'MODULE'],[16,5,5,4,6,'DEPOT'],[30,7,4,3.5,4,'KIOSK'],[39,4,4.5,5,9,'TOWER'],
 [8,17,5,4,6,'LAB'],[21,18,5,3.5,4,'MODULE'],[35,17,4,4,6,'RELAY'],[0,23,3.5,3,4,'UTILITY']
].map(([x,y,w,h,height,name])=>({x,y,w,h,height,kind:'building',name}));
const small=[
 [24,8,3.2,.3,.7,'BLAST WALL'],[11.5,11,2.5,.3,.7,'BLAST WALL'],[26,12,.3,2.5,1.7,'HOLOAD'],
 [4,13,2.8,1.4,2.4,'CARGO'],[17,12,2.4,.3,.7,'BLAST WALL'],[19.1,12,.3,1.4,.7,'RETURN WALL'],
 [31,14,2.5,.3,.7,'BLAST WALL'],[41,13,2.6,.35,1.7,'HOLOAD'],[16,21,2.8,1.4,2.4,'CARGO'],
 [3,20,.3,2.5,.7,'BLAST WALL'],[29,22,2.5,.3,.7,'BLAST WALL'],[44,17,.35,2.6,1.7,'HOLOAD']
].map(([x,y,w,h,height,name])=>({x,y,w,h,height,kind:'cover',name}));
const mirror=t=>({...t,x:48-t.x-t.w,y:48-t.y-t.h});
export const FIELD_TERRAIN=[...north,...north.map(mirror),...small,...small.map(mirror)].map((t,i)=>({...t,id:'field'+i}));
export function deploymentPosition(u,index){const r=E.radius(u),slots=[{x:6.8,y:6-r},{x:17.5,y:5-r},{x:31.6,y:7-r},{x:40.5,y:4-r},{x:25.6,y:8-r}],p=slots[index];return u.team===1?{...p,z:0}:{x:48-p.x,y:48-p.y,z:0};}
// Magnetism only proposes a nearby legal endpoint; it never supplies a path around an obstacle.
export function snapToCover(u,p,terrain,{enabled=true,threshold=.28,valid=()=>true}={}){
 if(!enabled||p.wall)return {point:p,terrainId:null};const r=E.radius(u),candidates=[];
 for(const t of terrain){if(E.terrainHeight(t)<=(p.z||0)+.01)continue;
  const q={x:E.clamp(p.x,t.x,t.x+t.w),y:E.clamp(p.y,t.y,t.y+t.h)},d=E.dist(p,q);let points;
  if(d>1e-9)points=[{x:q.x+(p.x-q.x)*r/d,y:q.y+(p.y-q.y)*r/d}];
  else points=[{x:t.x-r,y:p.y},{x:t.x+t.w+r,y:p.y},{x:p.x,y:t.y-r},{x:p.x,y:t.y+t.h+r}];
  for(const pt of points){const point={...p,...pt},delta=E.dist(p,point);if(delta<=threshold+1e-8)candidates.push({point,delta,terrainId:t.id});}
 }
 candidates.sort((a,b)=>a.delta-b.delta);
 return candidates.find(c=>valid(c.point))||{point:p,terrainId:null};
}
