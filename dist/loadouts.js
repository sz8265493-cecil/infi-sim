// Current Army 7.26246.158, group 1 / option 1. Evidence: assets/army-loadouts.json.
export const LOADOUTS={
 'zhanshi':['combi','pistol','cc'],
 'weibing-yaokong':['combi','flash','paraCC'],
 'yaoxie-rui-shi':['spitfire','paraCC'],
 'blue-wolf-mongol-cavalry':['apSpitfire','heavyFlame','panzerfaust','daCC5'],
 'guijia-squadrons':['multiHmg','heavyFlame','daCC3']
};
export function equipUnit(u,lesson=''){
 u.loadout=[...(LOADOUTS[u.slug]||[])];u.trainingWeapon=false;
 if(u.id==='a0'&&['saves','em','para'].includes(lesson)){u.loadout=['lab'];u.trainingWeapon=true;u.name='弹药测试靶机（教学）';u.en='AMMO LAB';}
 if(u.id==='a0'&&lesson==='dodge'){u.loadout=['lightFlame'];u.trainingWeapon=true;u.name='喷火测试靶机（教学）';u.en='TEMPLATE LAB';}
 if(u.id==='b0'&&lesson==='flamearo'){u.loadout=['heavyFlame'];u.trainingWeapon=true;u.name='喷火反应靶机（教学）';u.en='ARO FLAME LAB';}
 u.weapon=u.loadout[0];return u;
}
export function migrateEquipment(state){
 if(state.equipmentVersion===7)return state;
 // Roll back an unfinished legacy order before replacing its invalid declarations.
 if(state.order?.before)state=JSON.parse(state.order.before);
 delete state.order;
 state.units.forEach(u=>equipUnit(u,state.lesson));state.equipmentVersion=7;return state;
}
