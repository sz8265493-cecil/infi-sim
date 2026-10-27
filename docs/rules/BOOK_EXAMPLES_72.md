# 第72轮：Protheion

2026-10-23，本地开发与浏览器操作，未同步GitHub。依据 [Protheion N5.3 与 FAQ](https://infinitythewiki.com/Protheion)。

近战界面和 ARO 卡片提供可选开关；只有拥有此技能的单位出现。结算从实际 CC 伤害或处决统计吸取，VITA目标有效，STR目标无效。先治疗旧伤，再增加VITA，上限为原始值+2，最后应用本命令受到的伤害。超过Dead所需的失败不重复奖励。图标来自Wiki Power-Up 1/2原图。

已实际浏览器操作：

- `protheion72`：主动方CC20，Protheion−3让对方CC15变SV12。骰12对6，目标过保20受伤昏迷，主动方从1/1变2/2并显示强化+1。下一令处决，无骰/无过保，目标移除，主动方变3/3并显示强化+2。
- `protheionHeal72`：初始1/2，DA近战命中、两个20过保失败；治疗1、强化1，日志明确记录，最终3/3。

- `protheionARO72`：蓝方近战ARO，主动SV12骰6对蓝方SV20骰12，主动方过保20昏迷；反应方吸取1，VITA变2，日志与标记正确。

自动测试另覆盖STR不吸取、可选关闭、过量失败、休克直接Dead上限。第72轮回归423/423通过。

截图：`/Users/bytedance/Documents/tt/infi-protheion-72.png`。
