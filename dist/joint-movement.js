// N5.3 Super-Jump / Climbing Plus multi-trooper examples.
export function choices(u,declared,{second=false,spent=false}={}){
 if(second)return spent?['idle']:['move'];
 if(['jump','superjump','superlong'].includes(declared))return u.superJump?['superjump','superlong','idle']:['jump','idle'];
 if(['climb','climbplus'].includes(declared))return u.climbingPlus?['climbplus','climb','idle']:['climb','idle'];
 return [declared];
}
export const whole=k=>['jump','superlong','climb'].includes(k);
export const secondAllowed=(o,id)=>!whole(o.memberFirst?.[id]);
export function hasSecond(o,ids){return ids.some(id=>secondAllowed(o,id));}
