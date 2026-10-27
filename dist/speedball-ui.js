import * as SB from './speedball.js?v=48';
import * as E from './engine.js?v=117';
import * as S from './states.js?v=109';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const team=t=>t?'◆ 蓝方':'▲ 红方';
export function installSpeedballUI({getState,getTerrain,render,log,toast,checkpoint,roll}){
 const node=id=>document.getElementById(id);
 const run=fn=>()=>{try{fn();render();}catch(e){toast(e.message);}};
 function draw(){const s=getState(),t=SB.logisticsTeam(s);let el=node('speedballPanel');if(!el){el=document.createElement('section');el.id='speedballPanel';el.className='speedballPanel';node('toolbar').before(el);}let h='';
 if(s.pregame?.stage==='ready'){
  h='<h3>部署后后勤选择 · Speedball</h3>'+(t===null?'<p>双方后勤选择已完成，可以开始第一轮。</p>':`<p>${team(t)}按先手顺序选择：花1枚指挥令获得2枚补给标记，或跳过。</p><button id="sbBuy" ${(s.commandTokens[t]||0)<1?'disabled':''}>${team(t)} · 购买两枚补给标记（1指挥令）</button><button id="sbSkip">${team(t)} · 跳过后勤补给</button>`);
  if(node('pgStart'))node('pgStart').disabled=t!==null;
 }else if(s.phase==='play'){
  h=`<details ${s.speedballDrop?'open':''}><summary>地面补给 · ${team(s.team)} 剩余 ${s.speedballTokens?.[s.team]||0} 枚</summary>`;
  if(SB.canRequest(s))h+='<button id="sbRequest">请求 Speedball · 同时使用两枚标记</button>';
  const d=s.speedballDrop;
  if(d){const p=d.pods[d.index];h+=`<h3 class="stagePrompt">${team(d.team)} · 第${d.index+1}/2枚补给</h3><p>55mm标记，落地PH15。投放发生在命令之间，不消耗正规命令，不受跳跃控制影响。</p>`;
   if(d.stage==='chart')h+='<button id="sbChart">掷第二枚补给内容骰</button>';
   else if(d.stage==='rolled'){h+=`<div class="diceRow ${Date.now()-d.rollAt<800?'rolling':''}"><span class="die"><strong>${p.die}</strong><small>PH15 · ${p.die<=15?'成功':'失败'}</small></span></div><button id="sbConfirmRoll" ${Date.now()-d.rollAt<800?'disabled':''}>确认补给落地检定</button>`;if(Date.now()-d.rollAt<800)setTimeout(render,810-(Date.now()-d.rollAt));}
   else{if(d.index===0)h+=`<label>第一枚补给内容<select id="sbItem" ${p.die!==undefined?'disabled':''}>${Object.entries(SB.ITEMS).map(([id,v])=>`<option value="${id}" ${p.item===id?'selected':''}>${v.name}</option>`).join('')}</select></label>`;else h+=`<p>内容骰 ${p.chartDie}：${SB.ITEMS[p.item].name}</p>`;
    h+=`<p class="stagePrompt">${d.stage==='fallback'?'PH '+p.die+' 失败：点击己方部署区桌边选择回退位置':'点击地图选择落点，自动识别屋顶高度'}</p><p>${p.point?`落点 (${p.point.x.toFixed(2)}, ${p.point.y.toFixed(2)}, Z${p.point.z||0})`:'尚未选落点'}</p><button id="sbLand" ${!p.point?'disabled':''}>${d.stage==='fallback'?'确认补给回退位置':'掷补给落地PH骰'}</button>`;
   }
  }
  if(s.speedballNotice)h+='<p role="status">'+esc(s.speedballNotice)+'</p>';
  for(const u of s.units.filter(u=>u.speedballItem&&S.onTable(u))){const item=SB.ITEMS[u.speedballItem];h+=`<p>${esc(u.name)} · ${item.name}</p>`;if(['jetpack','overkill'].includes(u.speedballItem))h+=u.speedballItem==='jetpack'?`<button data-sb-unit="${u.id}" data-sb-mode="jetpack" ${u.s!==2?'disabled':''}>使用喷气背包 · ${esc(u.name)}</button>`:`<button data-sb-unit="${u.id}" data-sb-mode="attack">本命令BS过保−1 · ${esc(u.name)}</button><button data-sb-unit="${u.id}" data-sb-mode="reload">命令结束补充弹药 · ${esc(u.name)}</button>`;if(item.automatic)h+='<p class="micro">首次需要过保时自动使用，本命令全部过保+2。</p>';}h+='</details>';
 }
 el.hidden=!h;el.innerHTML=h;
 for(const [id,buy] of [['sbBuy',true],['sbSkip',false]])if(node(id))node(id).onclick=run(()=>{checkpoint();const c=SB.logistics(s,t,buy);if(!c.can)throw Error(c.reason);log(team(t)+(buy?'花1指挥令获得2枚Speedball':'跳过Speedball后勤选择'));});
 if(node('sbRequest'))node('sbRequest').onclick=run(()=>{checkpoint();SB.request(s);});
 if(node('sbItem'))node('sbItem').onchange=run(()=>{s.speedballDrop.pods[0].item=node('sbItem').value;});
 if(node('sbChart'))node('sbChart').onclick=run(()=>{const d=s.speedballDrop,p=d.pods[d.index];p.chartDie=roll(d);p.item=SB.chart(p.chartDie);d.stage='place';});
 if(node('sbLand'))node('sbLand').onclick=run(()=>{const d=s.speedballDrop,p=d.pods[d.index],check=SB.placement(s,p.point,getTerrain(),{failed:d.stage==='fallback'});if(!check.can)throw Error(check.reason);if(d.stage==='fallback'){SB.land(s,p.point,undefined,getTerrain());s.speedballNotice='Speedball按失败规则放至己方部署区桌边';log(s.speedballNotice);}else{p.die=roll(d);d.rollAt=Date.now();d.stage='rolled';}});
 if(node('sbConfirmRoll'))node('sbConfirmRoll').onclick=run(()=>{const d=s.speedballDrop,p=d.pods[d.index],r=SB.land(s,p.point,p.die,getTerrain());if(!r.can)throw Error(r.reason);s.speedballNotice=`${team(d.team)}第${d.index+(r.failed?1:0)}枚：PH15骰${p.die}，${r.failed?'失败，请选择回退位置':'落地成功'}`;log(s.speedballNotice);if(r.failed)p.point=null;});
 el.querySelectorAll('[data-sb-unit]').forEach(b=>b.onclick=run(()=>{const u=s.units.find(u=>u.id===b.dataset.sbUnit),r=SB.activate(s,u,b.dataset.sbMode);if(!r.can)throw Error(r.reason);log(u.name+' 使用Speedball：'+b.dataset.sbMode);}));
 }
 function click(point){const s=getState(),d=s.speedballDrop;if(!d||!['place','fallback'].includes(d.stage))return false;if(d.stage==='fallback'){point={...point};for(const key of ['x','y']){if(Math.abs(point[key]-SB.RADIUS)<.28)point[key]=SB.RADIUS;if(Math.abs(point[key]-(48-SB.RADIUS))<.28)point[key]=48-SB.RADIUS;}}const roofs=getTerrain().filter(t=>E.inside(point,t)),p={...point,z:roofs.length?Math.max(...roofs.map(E.terrainHeight)):0},c=SB.placement(s,p,getTerrain(),{failed:d.stage==='fallback'});if(!c.can)toast(c.reason);else d.pods[d.index].point=p;render();return true;}
 function map(){const s=getState(),draft=s.speedballDrop?.pods[s.speedballDrop.index]?.point;return [...(s.speedballs||[]),...(draft?[{...draft,id:'sb-draft',item:s.speedballDrop.pods[s.speedballDrop.index].item,team:s.speedballDrop.team}]:[])].map(p=>`<g role="img" aria-label="${esc(SB.ITEMS[p.item]?.name||'补给')}，55毫米"><circle cx="${p.x}" cy="${p.y}" r="${SB.RADIUS}" fill="#3d3654" stroke="${p.team?'#24d9ff':'#ff438a'}" stroke-width=".12" ${p.id==='sb-draft'?'stroke-dasharray=".2 .15"':''}/><text x="${p.x}" y="${p.y+.16}" text-anchor="middle" font-size=".42" fill="#ffe0a4">SB</text><text x="${p.x}" y="${p.y+1.65}" text-anchor="middle" font-size=".35" fill="#ffe0a4">${SB.ITEMS[p.item]?.name.split(' · ')[0]||''}</text></g>`).join('')+s.units.filter(u=>u.speedballItem&&S.onTable(u)).map(u=>`<text x="${u.x}" y="${u.y+E.radius(u)+2}" text-anchor="middle" font-size=".38" fill="#d9c1ff">SB · ${SB.ITEMS[u.speedballItem].name.split(' · ')[0]}</text>`).join('');}
 return {draw,click,map};
}
