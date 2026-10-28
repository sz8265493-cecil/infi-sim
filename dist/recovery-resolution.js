// Restore effects precede damage, but cannot rewrite this Order's attack checks.
export function captureRecoveryTargets(order,units){
 if(order.recoveryTargets)return;
 const ids=new Set((order.supports||[]).filter(d=>['doctor','engineer','medikit','gizmokit','speedballUse'].includes(d.kind)).map(d=>d.targetId));
 order.recoveryTargets=units.filter(u=>ids.has(u.id)).map(u=>structuredClone(u));
}
export function attackContext(order,units,terrain){
 const frozen=new Map((order.recoveryTargets||[]).map(u=>[u.id,u]));
 // LoF, posture and declaration eligibility use the pre-recovery snapshot.
 // Saving Rolls and lethal/continuous effects must use the restored model:
 // positive effects have already been applied before these negative effects.
 const checkedUnits=units.map(u=>frozen.has(u.id)?{...frozen.get(u.id),savingTarget:structuredClone(u)}:u);
 const checkedTerrain=[...terrain];
 checkedTerrain.zones=terrain.zones;
 checkedTerrain.areas=terrain.areas;
 Object.defineProperties(checkedTerrain,{units:{value:checkedUnits},movingIds:{value:terrain.movingIds}});
 return {units:checkedUnits,terrain:checkedTerrain};
}
