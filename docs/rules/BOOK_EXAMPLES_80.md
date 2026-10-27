# 第80轮：射入近战与误伤（仅本地）

依据官方N5.3 [Ballistic Skills](https://infinitythewiki.com/Ballistic_Skills)、[Engaged](https://infinitythewiki.com/Engaged_State) 与 [Close Combat](https://infinitythewiki.com/Close_Combat)，2026-10-23核对。

新增交战关联：每名交战友军−6，失败射击骰命中友军，多个友军时由玩家逐颗分配。额外骰已弃骰不计，成功但被拼骰抵消的骰不计误伤。模板波及交战中的一个模型会涉及整个交战，含友军时取消。交战中不向外画普通LoF，受攻击时的Sixth Sense例外仍保留。

本地Chrome实际 `friendlyFire80`：

1. 红方待机；目标已与两名红方友军近战，无向外LoF，反应菜单仅闪避/Reset/放弃。
2. Combi射击，BS14+3−12=SV5，B3骰3/8/20。3命中目标，8/20失败。
3. 独立误伤分配对话框，将8给友军甲，20给友军乙。
4. 敌方及两名友军各一次ARM过保，SV8，骰20/1/20。敌人受1伤、甲0伤、乙1伤。伤害与日志分别记录，完成命令。

已增加未弃骰、模板交战扩展和负修正的核心回归。主动多目标分枪及协调射击接入同一误伤收集器，但这两种与误伤的组合还没有独立网页记录，继续留作后续验收。

截图：`/Users/bytedance/Documents/tt/infi-friendly-fire-80.png`。未同步GitHub。
