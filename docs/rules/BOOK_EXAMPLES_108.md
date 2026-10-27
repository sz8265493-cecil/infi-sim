# 第108轮：NWI与Number 2手动接任（2026-10-27，仅本地）

规则来源：[Number 2](https://infinitythewiki.com/Number_2)、[NWI](https://infinitythewiki.com/No_Wound_Incapacitation)。Number 2为可选技能，不能自动选第一人。

队长进入Null/孤立后，先完成同波生存选择，再判断是否需接任。选择任一合法Number 2或放弃；放弃即解散。失能候选不能接任。选择未完成时不能开始新命令或结束回合；选择完成再继续后续结算。

真实Chrome逐项完成：
- fireteamNWI108：队长受伤选择NWI并完成勇气，仍为五人Core L3队长。
- fireteamSuccession108：拒绝NWI，显示两名Number 2；选择乙，最终乙为四人Core L2队长。实测中发现按钮值错误，已修复并重新验收。
- fireteamDecline108：拒绝NWI、放弃Number 2，火力组立即解散，完成命令。

最终515个自动测试、65个dist JS语法检查通过。网页13个新增场景及Servant治疗回归完成。保留无详情异步日志待定位，不宣称浏览器零错误。

仅本轮列出的流程已验收，不代表任意组合全覆盖。未同步GitHub。
