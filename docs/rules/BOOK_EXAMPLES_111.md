# 第111轮：远程医疗包、维修包、多命中与SD

日期：2026-10-27。官方Wiki标注N5.3及FAQ v0.1。只修改本地，未同步GitHub。

## 规则依据

- [MediKit](https://infinitythewiki.com/MediKit)：主动短技能；自己持有装备、合格友军、远程需LoF。每次命中接受者掷PH；同令多次使用任一成功仅恢复一次。
- [GizmoKit](https://infinitythewiki.com/GizmoKit)：命中后PH，不是过保；同令成功最多恢复一伤；Remote Presence昏迷II成功恢复至1STR。
- [Skills and Equipment Module](https://infinitythewiki.com/Skills_and_Equipment_Module)：SD增加待选择骰，不增加保留B，结算前弃足指定数量。

## 本地Chrome逐项实操

所有场景通过教学菜单载入，主动Idle→首次ARO→选择装备及目标/远程→后续ARO→命中→弃骰→PH→确认结算。使用明确标注的固定教学骰，未注入页面状态。B/SD是教学配置，不冒充特定官方军表。

| 场景ID | 实际结果 |
| --- | --- |
| medikitRanged111 | B2+1SD命中8/20/10，弃20，保留两命中，PH20/7；目标1/1正常。弃骰后刷新、继续上次教学，骰值及弃骰保持不变 |
| medikitMiss111 | 18/19/20弃20，SV14零命中；显示“未命中·无需PH检定”，直接确认，不进入PH/过保 |
| gizmokitRanged111 | 8/20/10弃20，PH8/9均成功，目标1/3→2/3，未恢复两伤 |
| gizmokitTwoSD111 | B1+2SD为20/8/19；只弃20时继续按钮禁用，补弃19后仅一命中、PH7；昏迷II→1/1 |
| gizmokitRange111 | 超24寸目标可宣告；结算显示超射程待机，无命中骰、PH或过保 |
| 两种装备ARO回归 | 切到蓝方，Idle产生红方有LoF的ARO；医疗包/维修包持有者菜单均无该装备，只有自身武器及合法反应。两条命令均完成 |

改动：分开标记命中骰、SD弃骰、接受者PH；弃骰立即保存；零命中不误报PH失败；装备自己的B/SD加成按装备读取。截图：`/Users/bytedance/Documents/tt/infi-ranged-recovery111.png`。

验证：连同112轮，537自动测试通过，65个dist JS语法通过。真实网页操作为上述限定分支，不等同全部装备/地形组合已验收。
