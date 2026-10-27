# 第76轮：形态替换与底径改变（仅本地）

官方依据：[Transmutation](https://infinitythewiki.com/Transmutation)、[Replacing Game Elements](https://infinitythewiki.com/Replacing_Game_Elements)，核对日期2026-10-23，N5.3/FAQ v0.1。

新增中心/内切边缘匹配、受限空间强制IMM-A、共享伤口/状态、X阈值与Escape System、Hatching、Auto及WIP触发流程。WIP尝试属于一次激活，主动方先支付命令，失败后必须继续这次激活，不能免费刷骰；同一次不重复扣令。恢复形态同样使用替换流程。

已真实Chrome操作：

- `transAuto76`：贴墙S2→S6中心位置非法，边缘180°合法，新中心20.30/28，显示MOV6；移动1.73寸。第二项Move开始切回S2，完成ARO与命令。
- `transCramped76`：N命中8，过保20失败；先出现勇气并选择Courage坚守，之后强制形态替换。1寸窄室容不下S6，确认后2/3VITA、IMM-A及已变形标识。自动回归另检验成功Dodge不解除这种IMM-A，空间恢复后才取消。
- `transEscape76`：DA命中8，过保20/20，S7→S2，VITA1/3；IMM-B与Stunned保留，产生Eclipse。
- `hatching76`：首项Move先孵化，S0/MOV0→S2/MOV4，完成命令。长技能不触发“第一短技能”孵化。
- `transWipARO76`：先WIP13−3骰8成功，再声明射击ARO；新BS15+3射程=SV18，骰9命中，过保1成功。勇气8成功，命令完成。结束玩家回合时恢复初始形态，面板BS10。
- `transWipFail76`：选择Idle后尝试WIP，20失败，命令3→2；继续本次Idle+Idle，命令仍2。结束后下次激活可再次尝试。
- `transDeploy76`：部署阶段选择Auto第二形态，S6/MOV6，仍使用任务部署校验。

尺寸替换几何目前用中心及1度间隔内切边缘候选判断是否存在可放位置；极狭窄的任意角度间隙不是解析穷尽。正式军表缺少精确多形态配置时继续明确拒绝导入，不猜造另一形态。以上教学配置验证通用规则，不代表全阵营配置库已完成。

证据：`/Users/bytedance/Documents/tt/infi-transmutation-76.png`。未同步GitHub。

补充网页实操 `hatchingARO76`：先用种胚PH10、骰8完成普通Dodge；成功后才出现强制S0→S2替换。替换后进入成熟形态2寸闪避阶段，选择留在原地完成命令。
