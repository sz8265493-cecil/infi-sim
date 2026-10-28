import * as E from './engine.js?v=122';
import * as S from './states.js?v=122';
// Nearest legal point on the recorded horizontal surface. Candidate boundaries
// are circles (bases/rounded corners) and lines (table/building edges).
export function position(u,units,terrain=[]){
 const origin={x:u.x,y:u.y,z:u.z||0},r=E.radius(u),others=units.filter(v=>v.id!==u.id&&S.onTable(v)),occupants=others.filter(v=>Math.min(origin.z+E.height(u),(v.z||0)+E.height(v))>Math.max(origin.z,v.z||0)+.001&&E.dist(u,v)<r+E.radius(v)-.001);
 if(!occupants.length)return {point:origin,moved:false};
 const clear=p=>!E.validPosition(u,p,units,terrain)&&!others.some(v=>E.inContact({...u,...p},v,terrain));
 const circles=others.filter(v=>Math.abs((v.z||0)-origin.z)<Math.max(E.height(v),E.height(u))).map(v=>({x:v.x,y:v.y,r:r+E.radius(v)+.026})),lines=[{axis:'x',v:r},{axis:'x',v:48-r},{axis:'y',v:r},{axis:'y',v:48-r}],candidates=[];
 for(const t of terrain.flatMap(E.terrainParts)){if(Math.abs(E.terrainHeight(t)-origin.z)<.02){for(const x of [t.x+r,t.x+t.w-r])lines.push({axis:'x',v:x});for(const y of [t.y+r,t.y+t.h-r])lines.push({axis:'y',v:y});}if(!E.overlapsAltitude(u,origin,t))continue;for(const x of [t.x,t.x+t.w])for(const y of [t.y,t.y+t.h])circles.push({x,y,r:r+.002});for(const x of [t.x-r-.002,t.x+t.w+r+.002])lines.push({axis:'x',v:x});for(const y of [t.y-r-.002,t.y+t.h+r+.002])lines.push({axis:'y',v:y});}
 const add=(x,y)=>{if(Number.isFinite(x)&&Number.isFinite(y))candidates.push({x,y,z:origin.z});};
 for(const c of circles){const d=E.dist(origin,c);if(d>1e-8)add(c.x+(origin.x-c.x)*c.r/d,c.y+(origin.y-c.y)*c.r/d);else for(let i=0;i<8;i++)add(c.x+c.r*Math.cos(i*Math.PI/4),c.y+c.r*Math.sin(i*Math.PI/4));}
 for(const l of lines)add(l.axis==='x'?l.v:origin.x,l.axis==='y'?l.v:origin.y);
 for(let i=0;i<circles.length;i++)for(let j=i+1;j<circles.length;j++){const a=circles[i],b=circles[j],d=E.dist(a,b);if(d<1e-8||d>a.r+b.r||d<Math.abs(a.r-b.r))continue;const k=(a.r*a.r-b.r*b.r+d*d)/(2*d),h=Math.sqrt(Math.max(0,a.r*a.r-k*k)),dx=(b.x-a.x)/d,dy=(b.y-a.y)/d;for(const sign of [-1,1])add(a.x+k*dx-sign*h*dy,a.y+k*dy+sign*h*dx);}
 for(const l of lines)for(const c of circles){const d=l.v-c[l.axis];if(Math.abs(d)>c.r)continue;const q=Math.sqrt(Math.max(0,c.r*c.r-d*d));for(const sign of [-1,1])add(l.axis==='x'?l.v:c.x+sign*q,l.axis==='y'?l.v:c.y+sign*q);}
 for(const a of lines.filter(l=>l.axis==='x'))for(const b of lines.filter(l=>l.axis==='y'))add(a.v,b.v);
 candidates.sort((a,b)=>E.dist(origin,a)-E.dist(origin,b)||a.x-b.x||a.y-b.y);
 const point=candidates.find(clear);return point?{point,moved:true,origin,distance:E.dist(origin,point)}:{error:'隐匿位置被占，当前水平面没有合法揭露位置；不能重叠或接触占位模型'};
}
