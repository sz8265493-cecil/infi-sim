# 第110轮：同目标多医疗包/维修包与特性免疫（2026-10-27，仅本地）

官方：[MediKit](https://infinitythewiki.com/MediKit)、[GizmoKit](https://infinitythewiki.com/GizmoKit)、[Immunity](https://infinitythewiki.com/Immunity)。核对当前N5.3/FAQ v0.1。

医疗包/维修包有同令多次使用的专门规则：任一PH成功，只应用一次恢复。不能套用普通Doctor/Engineer的多次恢复流程。资格采用结算快照，所有同目标检定结束后才统一修改目标；射击、接触模式仍分别要求LoF、射程或轮廓接触。两种装备仅主动短技能，不提供ARO。

| 场景 | 真实Chrome操作结果 |
|---|---|
| medikitCompetition110 | 两同步成员各选共同目标与轮廓接触，第一PH20失败后继续第二人的PH检定，8成功，最后1/1正常。没有提前移除或跳过第二人。 |
| gizmokitCompetition110 | 同样20/8，遥控存在目标昏迷II→1/1正常，没有额外失败伤害。 |
| gizmokitDouble110 | PH8/9均成功，1/3→2/3，只恢复一伤；与109普通双Engineer成功→3/3对照。 |
| ammoContinuous110 | 仅Continuous Damage免疫，普通命中8、过保20，仍受1伤，但不产生第二轮持续伤害过保；勇敢坚守并结束命令。 |

109–110合计16个新增场景，加1个协调医生回归，全部实际网页走完。自动回归528项通过；65个dist JS语法检查通过。未推送GitHub。

未穷举：医疗包/维修包混合远程多命中+SD、全部失败、技术恢复与修伤同目标并发的全部UI排列；相关既有基础规则保留，不把本轮结果外推为全部组合已验收。
