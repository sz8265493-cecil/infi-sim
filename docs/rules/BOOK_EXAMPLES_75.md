# 第75轮：SymbioBomb / Pheroware（仅本地）

2026-10-23，依据官方 [SymbioBomb](https://infinitythewiki.com/SymbioBomb)、[Weapon Chart](https://infinitythewiki.com/Weapon_Chart)、[Traits](https://infinitythewiki.com/Traits) 和 [Immunity](https://infinitythewiki.com/Immunity) 当前N5.3/FAQ v0.1页面。

已分配的SymbioBomb提供Endgame、Eraser及Mirrorball；本人ZoC，不借中继器。Endgame/Eraser只攻击VITA模型，给予对手面对面−3。Mirrorball为Targetless/NoLoF，ARO仍要求看见主动单位。命令末移除使用过的炸弹。

实际本地Chrome操作：

- `symbioBomb75`：待机→目标Reset→Endgame Double Shot主动B2；SV13骰8/9对Reset SV10骰20。2次AP BTS过保，BTS3/2向上=2，PS7，SV9；骰20/1，受1伤。完成勇气及命令后炸弹移除，行动菜单不再提供战术。
- `symbioEraserARO75`：隔墙控制区内可选Eraser/Endgame，不能选Mirrorball。主动待机→Eraser ARO→主动Reset。反应B1骰8对Reset SV10骰20；DA产生2次BTS过保，骰20/1，造成孤立，不扣生命。勇气骰20失败，确认无合法撤离后俯卧；命令末炸弹移除。
- `symbioMirrorball75`：主动待机→反应放弃→投掷/发射，选Mirrorball，点击墙另一侧目标位置。确认前仅定位十字；WIP13骰8成功，无过保，命令末生成Eclipse并移除炸弹。

同时修复Reset面对面原先遗漏对手负修正的问题。武器资格/范围/通讯例外有自动回归；以上是已完成的网页范围，未把全部特殊免疫及任意三维情况算作已测。

证据：`/Users/bytedance/Documents/tt/infi-symbiobomb-75.png`。未提交、推送或部署GitHub。
