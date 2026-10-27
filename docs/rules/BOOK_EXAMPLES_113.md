# 第113–115轮：同令恢复、复合弹药、协调黑客

2026-10-27，本地 Chrome http://localhost:4173/ 实际操作，未同步 GitHub。

## 官方依据

- https://infinitythewiki.com/Order_Expenditure_Sequence ：同时结算中先应用正面效果，再应用负面效果。
- https://infinitythewiki.com/Doctor ：同目标恢复资格与结算。
- https://infinitythewiki.com/Coordinated_Orders ：同程序和同一目标，先锋B减半向上取整，其他成员B1；FAQ保留对应SD。

## 浏览器已完成

| 场景 | 操作和结果 |
| --- | --- |
| recoveryUC113 | 工程师修复UCII至1，再遭EXP模板，两次过保失败后回到UCII；恢复前的俯卧/模板资格保留。 |
| recoveryNWI113 | 恢复后同令再次受伤至0，选择NWI，不触发Explode。 |
| recoveryExplode113 | 远程Gizmo命中→PH恢复→敌方模板伤害→拒绝NWI→两波Explode逐次过保和移除来源，最后一个模型昏迷。 |
| splitImmune114 | AP+EXP B4分2+2，SD分给第二目标并弃骰；AP免疫目标按完整ARM，EXP免疫目标保留AP；每个目标独立暴击与过保。 |
| impactContinuous114 | 圆模板主目标连续伤害免疫，副目标暴击免疫；主目标暴击2次过保，副目标普通命中，只有副目标进入持续伤害下一轮。 |
| coordHack115 | 两名KHD Trinity，同目标Reset一枚骰独立对抗；先锋B2、成员B1，BS用SD不误用于黑客。 |
| coordHackRange115 | 成员超出自身黑客区域，成员待机，先锋正常结算。 |
| coordHackStun115 | 眩晕成员待机，先锋正常结算。 |
| coordCyber115 | 逐成员宣告网络伪装整令，两人分别检查且进入IMP-2；没有第二项技能。 |
| coordCyberBlocked115 | 眩晕成员自动待机，仅先锋网络伪装生效。 |

## 修复

1. 恢复前冻结被恢复目标的攻击资格和几何快照，伤害仍施加于恢复后的实际生命。避免恢复起身反过来取消同令已经成立的模板覆盖。
2. 黑客分支接入协调命令B修正及预留射数限制，修复两名黑客都掷完整B3。
3. 协调支援程序逐成员声明和检查；有目标程序限制同程序、同目标。ARO仍按各程序自身权限。

## 边界

这是以上明确病例的验收，不是任意组合全覆盖。协调黑客“不同目标”违反规则，应拒绝；不能按功能要求放宽。第116轮完整军表对局正在进行；跨层区域、隐匿占位与多形态仍需后续验收。
