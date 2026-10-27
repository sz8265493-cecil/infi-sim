// Restore effects precede damage, but cannot rewrite this Order's attack checks.
export function captureRecoveryTargets(order,units){
 if(order.recoveryTargets)return;
 const ids=new Set((order.supports||[]).filter(d=>['doctor','engineer','medikit','gizmokit','speedballUse'].includes(d.kind)).map(d=>d.targetId));
 order.recoveryTargets=units.filter(u=>ids.has(u.id)).map(u=>structuredClone(u));
}
export function attackContext(order,units,terrain){
 const frozen=new Map((order.recoveryTargets||[]).map(u=>[u.id,u]));
 const checkedUnits=units.map(u=>frozen.get(u.id)||u);
 const checkedTerrain=[...terrain];
 checkedTerrain.zones=terrain.zones;
 checkedTerrain.areas=terrain.areas;
 Object.defineProperties(checkedTerrain,{units:{value:checkedUnits},movingIds:{value:terrain.movingIds}});
 return {units:checkedUnits,terrain:checkedTerrain};
}
