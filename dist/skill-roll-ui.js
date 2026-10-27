const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
// Rolls live in the order, so reloads and redraws never reroll an existing result.
export function skillRollDialog(order,tasks,{save,roll,onComplete,rerollOptions=()=>[],onReroll=()=>{}}){
 const el=document.getElementById('battle');order.skillRolls??=tasks.map(t=>({...t,dice:t.skipped?[]:null,discard:null}));
 const draw=()=>{const rows=order.skillRolls,unrolled=rows.some(t=>t.dice===null),pending=rows.find(t=>t.sd&&t.dice&&t.discard===null);
 el.innerHTML=`<div class="battleHeading"><small>SKILL CHECK / 技能检定</small><h2>${unrolled?'技能检定 · 先结算治疗、修复及其他技能':pending?'选择额外骰中的弃骰':'技能结果 · 确认或重掷'}</h2></div>${rows.map((t,i)=>`<section class="pool team-${t.team}"><h3>${t.team?'◆ 蓝队':'▲ 红队'} · ${esc(t.name)} → ${esc(t.targetName)}</h3><p>${esc(t.label)} · ${t.skipped?'要求未满足 → 待机':t.automatic?'自动成功':`WIP / SV ${t.sv}`}${t.sd?' · +1 SD：弃一颗':''}</p><p>${esc(t.modText||'')}</p><div class="diceRow">${t.dice===null?'尚未掷骰':t.skipped?'待机 · 无需掷骰':t.automatic?'✓ 无需掷骰':t.dice.map((n,j)=>`<button class="dieChoice" data-skill-die="${i}:${j}" ${pending!==t?'disabled':''}><span class="die ${j===t.discard?'discard':n<=t.sv?'hit':'fail'}"><strong>${n}</strong><small>${j===t.discard?'弃骰':n<=t.sv?'成功':'失败'}</small></span></button>`).join('')}</div>${t.dice!==null&&!t.automatic&&!t.skipped&&!t.dice.some((n,j)=>j!==t.discard&&n<=t.sv)?rerollOptions(t).map(r=>`<button data-reroll="${i}:${r.key}">${esc(r.label)}</button>`).join(''):''}</section>`).join('')}<button id="rollSkill" class="primary wide" ${pending?'disabled':''}>${unrolled?'掷技能骰':'确认结果 → 继续命令结算'}</button>`;
 el.querySelectorAll('[data-skill-die]').forEach(b=>b.onclick=()=>{const [i,j]=b.dataset.skillDie.split(':').map(Number);rows[i].discard=j;save();draw();});
 el.querySelectorAll('[data-reroll]').forEach(b=>b.onclick=()=>{const [i,key]=b.dataset.reroll.split(':');const t=rows[+i],option=rerollOptions(t).find(r=>r.key===key);if(!option)return;t.attempts??=[];t.attempts.push({dice:[...t.dice],sv:t.sv,discard:t.discard,reroll:option.label});onReroll(t,option);t.sv=option.sv;t.dice=[roll()];t.discard=null;save();draw();});
 document.getElementById('rollSkill').onclick=()=>{if(unrolled){const shared={};for(const t of rows)if(t.dice===null)t.dice=t.automatic?[]:t.group?(shared[t.group]??=[roll()]):Array.from({length:1+(t.sd||0)},roll);save();draw();}else{for(const t of rows)t.success=!t.skipped&&(t.automatic||t.dice.some((n,i)=>i!==t.discard&&n<=t.sv));onComplete(rows);}};
 };draw();if(!el.open)el.showModal();el.oncancel=e=>e.preventDefault();
}
function diceSummary(t){
 const indices=Array.isArray(t.discard)?t.discard:[t.discard],dice=t.dice||[];
 const kept=dice.filter((_,i)=>!indices.includes(i)),discarded=dice.filter((_,i)=>indices.includes(i));
 return (t.automatic?'自动':kept.join(', '))+(discarded.length?'（弃骰：'+discarded.join(', ')+'）':'');
}
export const skillResultsHTML=rows=>rows?.length?`<section class="skillResults"><h3>本命令技能检定</h3>${rows.map(t=>`<p>${esc(t.name)} · ${esc(t.label)} → ${esc(t.targetName)}：${diceSummary(t)} / SV ${t.sv} · <b>${t.skipped?'待机':t.success?'成功':'失败'}</b>${t.attempts?.length?'<br><small>此前检定：'+t.attempts.map(a=>diceSummary(a)+' / SV '+a.sv+(a.reroll?' → '+esc(a.reroll):'')).join('；')+'</small>':''}</p>`).join('')}</section>`:'';
