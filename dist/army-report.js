// Self-use inspection report built from the same exact-match preview as the importer.
// Not a Courtesy List: identities, Lieutenant and hidden equipment remain visible.
export function armyInspectionReport(preview,catalog){
 const lines=['infi-sim · 军表核对报告（自用）','包含完整配置、尉官及私人信息；不是给对手的公开军表。',
  `军表：${preview.decoded.name||'未命名军表'}`,`阵营：${catalog.faction||catalog.factionId} (${catalog.factionId})`,
  `匹配资料：${catalog.version} · ${catalog.accessed}`,`来源：${catalog.source||'官方 Army'}`,
  `${preview.points} / ${preview.decoded.pointsLimit} PT · ${preview.swc} SWC`,
  `导入核对：${preview.errors.length?'存在错误，禁止导入':preview.warnings.length?'存在能力限制，须查看并确认':'通过当前模拟器导入检查'}`,
  '本报告不代替官方 Army、最新规则或赛事裁定。',''];
 for(const group of preview.decoded.groups){
  lines.push(`战斗组 ${group.id} · 原始条目 ${group.members.length}`);
  group.members.forEach((member,index)=>{
   const unit=preview.units.find(u=>u.id===`import-${group.id}-${index}`),ref=[member.unitId,member.groupId,member.optionId].join('/');
   if(!unit){lines.push(`  #${index+1} ${ref} · 未匹配或不支持；未自动替换`);return;}
   lines.push(`  #${index+1} ${unit.name}${unit.lieutenant?' · 尉官':''} · ${ref} · ${unit.points} PT · ${unit.swc} SWC`);
   lines.push('    武器：'+unit.loadout.map(key=>unit.armyWeapons[key]?.en||unit.armyWeapons[key]?.name||key).join(' / '));
   lines.push('    技能与装备：'+(unit.officialAbilities.join(' / ')||'无额外技能'));
   if(unit.unsupported.length)lines.push('    能力限制：'+unit.unsupported.join('；'));
   for(const child of unit.ancillaryProfiles||[])lines.push(`    附属：${child.name} · 局中按规则放置`);
  });
  lines.push('');
 }
 if(preview.errors.length)lines.push('导入错误',...preview.errors.map(x=>'  • '+x),'');
 if(preview.warnings.length)lines.push('模拟能力限制',...preview.warnings.map(x=>'  • '+x),'');
 return lines.join('\n');
}
