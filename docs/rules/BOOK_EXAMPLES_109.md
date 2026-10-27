# 第109轮：同目标恢复竞争与弹药免疫（2026-10-27，仅本地）

## 规则依据

核对官方当前 N5.3 / FAQ v0.1：[命令执行顺序](https://infinitythewiki.com/Order_Expenditure_Sequence)、[协调命令](https://infinitythewiki.com/Coordinated_Orders)、[Doctor](https://infinitythewiki.com/Doctor)、[Engineer](https://infinitythewiki.com/Engineer)、[Immunity](https://infinitythewiki.com/Immunity)、[复合弹药](https://infinitythewiki.com/Combined_Ammunition)、[组合过保](https://infinitythewiki.com/Combined_Saving_Roll)、[SymbioMate](https://infinitythewiki.com/SymbioMate)。

普通Doctor/Engineer各次资格在同一结算快照检查。依“正面效果先于负面效果”，先恢复再应用失败；不能被前一人的结果取消后续合法宣告。协调命令有任一成功覆盖失败的专门规则。普通并发治疗的先后是依据以上规则组合的推导，不声称有同名官方FAQ。

免疫按指定弹药成分处理，再展开效果。通讯攻击不适用弹药/属性/暴击免疫，状态免疫除外。等离子双属性过保不会因增强免疫变成一保。SymbioMate通讯攻击仍有BTS9，原行为核对保留。

## 真实Chrome验收

所有场景通过页面选例、开始命令、首项Idle、逐个宣告、后续ARO、骰子/效果界面执行，无状态注入。固定骰仅是可见教学模式。

| 场景 | 页面核对结果 |
|---|---|
| doctorCompetition109 | 两名同步医生分别宣告同一昏迷目标，WIP14/12，20失败/8成功；无重掷，统一确认后目标移除，没有第一人先失败导致第二人待机。 |
| engineerCompetition109 | 共同目标STR昏迷II，20/8；先恢复到1，再失败受伤，最终0/1昏迷I，未提前移除。 |
| engineerDouble109 | 受伤目标1/3，8/9两次成功，最终3/3。 |
| coorddoctor57（回归） | 手动勾选先锋及第二恢复员，1正规+1指挥令，Idle、医生共同目标，20/7；协调成功覆盖失败，最终1/2。 |
| ammoAP109 | AP+EXP暴击对AP免疫，4次完整ARM5/SV13，20/1/1/1→1伤，勇敢坚守。 |
| ammoEXP109 | 同样暴击对EXP免疫，2次半ARM3/SV11，20/1→1伤。 |
| ammoPlasma109 | 增强免疫，暴击仍ARM5、BTS3、附加ARM5共3保；20/1/1→1伤。 |
| ammoMono109 | ARM免疫使单分子保留ARM5，暴击2保；20/1仅1伤，不直接移除3VITA目标。 |
| ammoViral109 | Viral命中，Shock免疫，仍2次BTS保；20/1导致1VITA昏迷，留在桌面。 |
| ammoStun109 | Enhanced目标，1次BTS保20失败，0伤，眩晕保留；勇敢坚守。 |
| ammoVulnerable109 | Enhanced+Viral易伤，仍双保；初次实操发现状态层重复屏蔽Shock，修复后重跑，20/1导致1VITA模型移除。 |
| ammoCritical109 | 仅Critical免疫，AP+EXP暴击仍3次半ARM保，无第四次附加；1伤。 |
| ammoComms109 | 显式合成通讯E/M测试器，Enhanced+Critical均不能减少3次半BTS保；20/1/1，状态免疫阻止孤立，HI仍IMM-B，0伤。此武器不代表合法军表配置。 |

病例中的额外技能和测试武器仅用于显式教学，不替换导入军表。上述10条弹药/免疫验收范围含110轮的持续伤害案例，不能外推为全部武器、暴击、装备组合穷举。

## 修改

- support-actions.resolveBatch：冻结资格，聚合成功，再应用失败；保留协调特例。
- saves：成分免疫、大小写规范化、通讯暴击免疫例外、按属性处理组合保与特性。
- states：Viral易伤的Shock结果传递到最终伤害，不被增强免疫二次抹掉；独立Shock免疫仍有效。

未同步GitHub。后续仍需不同恢复模式、恢复与伤害/模板/生存的更复杂组合，以及剩余武器表组合的逐项UI验收。
