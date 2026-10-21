import * as E from './engine.js?v=34';
export const TYPES={Aquatic:'水域',Desert:'沙漠',Mountain:'山地',Jungle:'丛林','Zero-G':'零重力'};
export const matches=(u,a)=>u.terrainTypes?.includes('Total')||(u.terrainChoice||u.terrainTypes?.[0])===a.type;
export const touching=(u,p,a)=>E.pointRect(p,a)<=E.radius(u)+.001;
export function modifier(u,p=u){const areas=(u.terrainAreas||[]).filter(a=>touching(u,p,a));return areas.some(a=>!matches(u,a))?-1:areas.some(a=>matches(u,a))?1:0;}
export function stops(u,path){return (u.terrainAreas||[]).some(a=>!matches(u,a)&&!touching(u,path[0],a)&&path.some(p=>E.pointRect(p,a)<=E.radius(u)+.04));}
export function pathError(u,path){for(const a of u.terrainAreas||[]){if(matches(u,a)||touching(u,path[0],a))continue;const pts=E.samplePath(path,.025),i=pts.findIndex(p=>touching(u,p,a));if(i>=0&&E.pathLength(pts.slice(i))>.05)return '接触不匹配的困难地形后，本命令必须停止移动';}return '';}
