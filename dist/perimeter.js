import * as E from './engine.js?v=122';
import * as S from './states.js?v=122';
// Boost has no MOV budget. Find a collision-free route for the whole Silhouette,
// including above finite obstacles and beneath elevated slabs, never through solids.
export function route(model,start,ends,units,terrain){
 const r=E.radius(model),h=E.height(model),parts=terrain.flatMap(E.terrainParts),obstacles=units.filter(u=>u.id!==model.id&&S.onTable(u)&&S.active(u)&&u.team!==model.team);
 const clear=p=>p.x>=r&&p.y>=r&&p.x<=48-r&&p.y<=48-r&&p.z>=0&&!parts.some(t=>E.overlapsAltitude(model,p,t)&&E.pointRect(p,t)<r-.001)&&!obstacles.some(u=>E.dist(p,u)<r+E.radius(u)-.001&&p.z+h>(u.z||0)+.001&&(u.z||0)+E.height(u)>p.z+.001);
 const levels=[...new Set([start.z||0,...ends.map(e=>e.z||0),...parts.map(E.terrainHeight).filter(Number.isFinite)])];
 const xy=[start,...ends,...parts.flatMap(t=>[{x:t.x-r-.01,y:t.y-r-.01},{x:t.x+t.w+r+.01,y:t.y-r-.01},{x:t.x-r-.01,y:t.y+t.h+r+.01},{x:t.x+t.w+r+.01,y:t.y+t.h+r+.01}])];
 const nodes=[{...start,z:start.z||0},...levels.flatMap(z=>xy.map(p=>({x:p.x,y:p.y,z}))).filter(clear)],goals=new Set();
 for(let i=0;i<nodes.length;i++)if(ends.some(p=>E.dist3(p,nodes[i])<.005))goals.add(i);
 const seen=new Set([0]),queue=[0],previous=new Map();
 while(queue.length){const i=queue.shift(),a=nodes[i];if(goals.has(i)){const out=[];let k=i;while(k!==undefined){out.unshift(nodes[k]);k=previous.get(k);}return out;}
  for(let j=1;j<nodes.length;j++){if(seen.has(j))continue;const b=nodes[j];if(Math.abs(a.z-b.z)>.001&&E.dist(a,b)>.001)continue;if(!E.samplePath([a,b],.05).every(clear))continue;seen.add(j);previous.set(j,i);queue.push(j);}
 }
 return null;
}
export function contactRoute(weapon,target,units,terrain){const rr=E.radius(weapon)+E.radius(target)+.002,ends=Array.from({length:72},(_,i)=>({x:target.x+rr*Math.cos(i*Math.PI/36),y:target.y+rr*Math.sin(i*Math.PI/36),z:target.z||0}));return route(weapon,weapon,ends,units,terrain);}
export function trigger(weapon,target,item,{units=[],terrain=[],orderId,postResolution=false}={}){if(!item?.boost||!S.onTable(weapon)||weapon.hp<=0||orderId!==undefined&&weapon.placedOrderId===orderId||postResolution||target.isDeployable||target.team===weapon.team||target.team<0||!S.onTable(target)||target.aerial&&S.active(target)||['camouflaged','impersonation','impersonation1','impersonation2'].some(k=>S.has(target,k))||E.edgeDistance(weapon,target)>8+.001)return null;const path=contactRoute(weapon,target,units,terrain);return path?{mineId:weapon.id,hits:[target.id],ps:item.ps,ammo:item.ammo,boost:true,path,dodgeMod:-3}:null;}
