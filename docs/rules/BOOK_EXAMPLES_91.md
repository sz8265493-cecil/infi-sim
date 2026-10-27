# 第91轮：反应圆模板对多个主动成员

2026-10-23，仅本地。官方 [Impact Template Weapons](https://infinitythewiki.com/Impact_Template_Weapons)与[Template Weapons and Equipment](https://infinitythewiki.com/Template_Weapons_and_Equipment)，当前Wiki标记N5.3/FAQ v0.1。

修复：同一反应导弹波及多个协调成员时，各成员独立面对面；一人的成功不能取消另一人的命中。副目标比较时不视导弹成功值等值骰为暴击，亦不增加暴击过保。保留主目标的射程等攻击修正，反应骰只生成一次。单一攻击者作为副目标和沿成员路径检查亦加回归。

真实Chrome三条完整操作：
- coordImpact91：手动勾选两人协调，Idle→导弹对先锋圆模板ARO→两人步枪。先锋9/20、成员7、导弹8；先锋赢而成员输。反应者1次N过保，成员3次EXP过保，先锋无需过保；全部1通过，双方勇气结束。
- coordImpactCrit91：同样操作，先锋8/20、成员12、导弹11/SV11。先锋4次EXP过保，成员将11作为普通成功比较，12获胜不受击；反应者1次N过保，全部成功，勇气后结束。
- coordImpactDodge91：协调Idle→导弹模板→两人闪避。两人12/SV13对导弹11/SV11；先锋输给暴击需4保，成员胜过普通11。过保成功后只有成员进入闪避移动，实际点击向右0.98寸，确认后先锋勇气、命令结束。

466项回归、64个JS语法通过。截图 `/Users/bytedance/Documents/tt/infi-aro-impact-91.png`。未把复杂全部MOD、路径和其他模板组合标为通过，未同步GitHub。
