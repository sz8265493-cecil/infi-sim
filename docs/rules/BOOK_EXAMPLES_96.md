# 第96轮：火力组黑客与武术L5（本地网页验收）

2026-10-23；规则基准N5.3 / FAQ v0.1。未提交、推送或部署GitHub。

官方来源：[Martial Arts](https://infinitythewiki.com/Martial_Arts)、[Fireteams: Basic Rules](https://infinitythewiki.com/Fireteams:_Basic_Rules)、[Fireteam Examples](https://infinitythewiki.com/Fireteam_Examples)。武术表的修正在双方回合生效；组内反应黑客允许使用不同程序；主动黑客只有队长执行。

## 修复

此前武术L4/L5的+1B仅加在主动轮，反应轮漏算。现在反应近战B1加武术+1B；一般配置的CC Attack(+B)仍只在主动轮应用。MA5额外SD保留为弃骰，不能当额外命中。新增两项回归，476/476通过，64个JS语法检查通过。

## 真实Chrome完整操作

- `fireteamCC96`：以合法三人Core编组载入（近战属性和武器明确教学覆写），三名S2在同一敌人周围接触。Idle→敌CC→主动队长CC。红方B3/SV17骰7、8、9；蓝方MA5的B2+1SD/SV23骰4、10、12，实际点击弃4。红方0命中，蓝方2命中；红方两次ARM过保1/1通过，命令结束。支援者未另掷骰。场景最初继承S3底盘，发现后改成S2并重置后完成本次验收。
- `fireteamHackActive96`：红组长Idle→蓝Reset→组长遗忘。只有组长两颗WIP骰10/11，无火力组射击SD；蓝Reset6失败，两次AP BTS过保1/1通过。蓝勇气自动成功，完整结束，另一名红黑客未进行攻击。
- `fireteamHack96`：先结束红回合；蓝Idle→红组长遗忘、另一黑客碳化、第三成员放弃→蓝Reset6。两名黑客10/11分别获胜，AP一保、DA两保均20失败。蓝方保持3/3，同时孤立+IMM-B；红组仍三人L3，没有因不同程序脱组。
- `fireteamHackMinority96`：相同反应，但第三红成员选择Dodge。确认ARO后立即脱组，两个黑客降为L2；脱组者闪避SV10，没有原L3的+1。蓝方Reset6，对两黑客10/11失败，三保1/1/1通过。红方Dodge8成功，实际移动0.98寸，之后蓝方勇气自动成功，完整结束。日志、名册和骰池均核实。

证据：`/Users/bytedance/Documents/tt/infi-fireteam-ma5-96.png`、`/Users/bytedance/Documents/tt/infi-fireteam-hacking-96.png`。

这次只覆盖上述流程；不将全部火力组13个示例、双队完整交战、任意SD分配和隐藏状态组合标为全覆盖。教学覆写不用于正式军表导入。
