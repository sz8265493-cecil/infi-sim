# 第101轮：受限控制者联动与眩晕勇气时点

2026-10-25，本地Chrome逐项实际操作，未同步GitHub。来源：官方 [Peripheral FAQ v0.1](https://infinitythewiki.com/Peripheral)、[Stunned State](https://infinitythewiki.com/Stunned_State)、[Guts Roll](https://infinitythewiki.com/Guts_Roll)。均为当前N5.3页面。

## 改动与判定

- 控制者IMM或眩晕不把同组附属的合法技能禁用。控制者面板新增“通过附属操作本组”，选择当前能行动的模型作为界面焦点；仍是控制者的一枚命令、全组同技能、各自检查要求，不能执行者Idle。本轮不扩展为反应轮可任意声明不同技能。
- 强制Idle的联动移动面板禁用姿态与朝向，不能借零距离联动绕过状态限制。
- 勇气WIP检定纳入眩晕−3，并在UI与记录显示实际SV。
- 强制败勇气来自本次命令的眩晕弹药过保失败，按实际过保记录进入队列；不能仅根据已有stunned状态推断。保留Courage与Religious例外；后续连锁向已有勇气队列追加时保留失败标记。

## 浏览器实际验收

| 场景 | 操作与结果 |
| --- | --- |
| peripheralImm101 | 从IMM-B控制者面板切到Ancillary操作，Move0→控制者强制Idle。两个敌人分别射控制者/附属；附属B3骰9/10/20对右敌8，2命中；控制者0攻击骰，左敌6独立命中控制者1次。3过保均1，右敌勇气坚守，控制者IMM不进行勇气。命令池3→2；控制者仍IMM-B。 |
| peripheralStun101 | 同样由附属操作；眩晕控制者允许Move0，第二项攻击强制Idle。附属仍SV15完整B3，控制者眩晕修正不施加给附属。独立2+1次过保通过，双方受击者依次Courage坚守，控制者保留眩晕。 |
| 强制Idle面板修复复验 | 刷新后重进peripheralImm101，控制者联动0/0寸且姿态/朝向控件均disabled；其余模型可正常操作。敌方放弃，第二项Idle，无骰直接完成一条命令。 |
| existingStunGuts101 | 已有眩晕单位Idle+Idle，敌Combi ARO骰8命中，ARM保1成功。勇气未被直接判失败，显示WIP13−3=SV10；点击掷骰得到11，失败后无合法掩体撤离路线，确认俯卧完成。 |
| newStunGuts101 | 原本正常单位Idle+Idle，敌Flash Pulse ARO8命中，BTS保20失败进入眩晕。直接进入强制败勇气，不再掷WIP；确认无路线后俯卧。 |
| newStunCourage101 | 同样本次Stun保失败，但Courage保留自动成功按钮；点坚守后不移动、不俯卧，命令结束且眩晕保留。 |
| newStunReligious101 | 同样本次Stun保失败，Religious无自动失败选项；申请撤离骰11/SV10失败，确认结果后坚守，不移动、不俯卧。 |

六个独立教学场景，加一次修复后重跑。固定骰例由界面复选框开启，不改运行时状态。截图：`/Users/bytedance/Documents/tt/infi-guts-stunned101.png`。

## 检查与边界

98–101累计新增20个教学场景均已手动走完相应流程。最终493/493回归通过，64个dist JavaScript语法检查通过。本轮仍未完成覆盖矩阵全部组合；Cyberplug双配置、Control非攻击目标技能及后续链中即时替换、全部弹药/免疫和任意三维几何仍保留待办。

浏览器历史日志出现若干没有堆栈的“Uncaught (in promise)”。临时监听仅得到undefined拒绝原因，尚不能归因于应用或浏览器环境；上述流程均到达终态，不能据此声称控制台完全无错误。临时诊断脚本已移除，未吞掉或隐藏异常。
