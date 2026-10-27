import * as E from './engine.js?v=117';
import * as M from './movement.js?v=88';

export function movementRange(unit,plan,{distance=2,label='移动',turnOnly=false}={}){
 if(!unit||turnOnly)return null;
 const path=plan?.path?.length?plan.path:[unit],cost=plan?.cost??E.pathLength(path);
 const total=M.budget(unit,{...plan,moveKind:'move',path,distance});
 return {start:path[0],end:path.at(-1),total,remaining:Math.max(0,total-cost),cost,label};
}
export function rangeSVG(r,color){
 if(!r)return '';
 const {start,end,total,remaining,cost,label}=r;
 return `<g class="postMoveRange" pointer-events="none" role="img" aria-label="${label}移动范围，剩余${remaining.toFixed(2)}英寸，总距离${total.toFixed(2)}英寸" data-total="${total}" data-remaining="${remaining}">${cost>.001?`<circle cx="${start.x}" cy="${start.y}" r="${total}" fill="none" stroke="${color}" stroke-opacity=".45" stroke-width=".09" stroke-dasharray=".15 .2"/>`:''}<circle cx="${end.x}" cy="${end.y}" r="${remaining}" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-width=".18" stroke-dasharray=".35 .15"/><text x="${end.x}" y="${end.y-remaining-.45}" text-anchor="middle" font-size=".52" font-family="monospace" fill="${color}" paint-order="stroke" stroke="#101619" stroke-width=".16">${label} · 剩余 ${remaining.toFixed(2)}″ / ${total.toFixed(2)}″</text></g>`;
}
