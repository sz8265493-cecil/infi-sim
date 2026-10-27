# 第106轮：附属模型逐成员支援程序（2026-10-27，仅本地）

规则来源：[Peripheral](https://infinitythewiki.com/Peripheral)、[Controlled Jump](https://infinitythewiki.com/Controlled_Jump)、[Enhanced Reaction](https://infinitythewiki.com/Enhanced_Reaction)、[Fairy Dust](https://infinitythewiki.com/Fairy_Dust)。当前官方 N5.3 / FAQ v0.1。

实现：各执行者按自身设备、Control角色及自身黑客范围分别选择程序和目标；无设备者待机。整令程序不能用于ARO；Controlled Jump可在合格ARO使用，并在宣告时立即生效，同方不叠加、双方抵消。单位卡显示维持程序。

真实Chrome逐项完成：
- controlSupport106：控制者与先锋分别强化两个REM，非先锋待机，两个目标ARO B2。
- controlSupportOnly106：仅先锋有EVO仍可发起，控制者待机。
- controlFairy106：两个执行者各选REM、HI，效果分别应用。
- controlJump106：三个有EVO成员逐一宣告无目标程序，立即更新，最终只有一名维持。
- controlSupportARO106：无LoF但有合法ARO时只能选Controlled Jump等合法反应，无整令程序；修正ARO摘要误写“放弃”。
- controlSupportRange106：远目标宣告不预量，结算按该执行者自己的范围失败，不能借控制者范围。

仅本轮列出的流程已验收，不代表任意组合全覆盖。未同步GitHub。
