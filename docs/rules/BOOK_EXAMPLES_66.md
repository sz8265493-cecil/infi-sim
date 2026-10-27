# 多人空降爆炸/EVO与混合移动脱组、失能

2026-10-22；本地 http://127.0.0.1:4173/；app v66，fireteams v66。未提交、推送GitHub或外部部署。

## 最新官方依据

以下官方Wiki均标注N5.3与FAQ v0.1，本轮重新读取：

- [Combat Jump](https://infinitythewiki.com/Combat_Jump)：Explosion在PH及最终位置确定后使用圆形直射模板，PS8/N/ARM；失败回退后仍以实际位置处理。
- [Controlled Jump](https://infinitythewiki.com/Controlled_Jump)：宣告立即生效，敌−3/友+3，双方开启抵消；可选择等待普通ARO。
- [Dodge](https://infinitythewiki.com/Dodge)：共用一次闪避，对每种攻击分别应用修正；有未避开的模板不能获得闪避移动。
- [Coherency](https://infinitythewiki.com/Coherency)：开始与结束检查，结束检查在Conclusion和勇气等移动完成后；非逐路径点自动脱组。
- [Fireteam Integrity](https://infinitythewiki.com/Fireteam_Integrity)与[Fireteams in the Active Turn](https://infinitythewiki.com/Fireteams_in_the_Active_Turn)：Null/孤立等离组、混合技能及Number 2接任。
- [Order Expenditure Sequence](https://infinitythewiki.com/Order_Expenditure_Sequence)：双方宣告后统一结算，不能在首次ARO宣告时提前造成失能。

注意Combat Jump (Explosion)与昏迷触发的Explode是不同技能。本轮完成前者；不宣称后者所有连锁组合已验收。

## 实际网页操作记录

所有案例通过本地网页控件和地图点击操作；没有向浏览器注入游戏状态。教学配置与技能覆写在场景说明中公开。空降两成员均先锁定落点，再处理EVO和PH，最终统一进入一次ARO；各协调案例正规3→2、指挥令4→3。

| 场景/分支 | 实测链路与结果 |
| --- | --- |
| airExplosion66 | 双落点约(20.5,25)/(25.5,25)，敌EVO无视线全场反应。两名PH12均被−3修正，骰8/9在PH9成功；靶机只掷一颗10，对可见/背后爆炸分别SV12/9，一次避开、一次命中，只有一次ARM1+PS8=9过保。20失败损失1，未进入闪避移动，进入勇气并选择Courage坚守完成。已使用EVO反应不能再宣告普通ARO。 |
| airCancel66 | 友方EVO预先运行Controlled Jump，敌EVO宣告后相抵，两名均骰12/PH12成功。靶机同一颗7避开两张模板，无过保直接进入2寸闪避移动，选择留在原地完成。 |
| airFriendly66 | 两空降兵落点(20,25)/(22,25)，全体最终位置确定后两张模板均覆盖另一友军，全部取消。敌EVO选择等待，落地后普通ARO仍可选；靶机和EVO都放弃，无伤害无过保。修复了先落地者可能漏算随后出现的友军的问题。 |
| airFail66 | 敌EVO−3后先锋骰10/PH9失败，玩家实际选择己方左边缘约(.492,38)；后者骰8/PH9成功。回退先锋爆炸影响桌边靶机，成功者原位置爆炸无目标。靶机放弃，只有一次过保20失败，损失1，勇气坚守结束。 |
| jointBreak66 / 结束在外 | 队长强化攀爬4.98寸登4寸屋顶，其他成员Idle；第二项骑士移动3.00寸至约(9.5,22)。ARO2前仍全组L3；结算/Conclusion才检查，骑士脱组，其余Core L2。 |
| jointBreak66 / 返回 | 同样首项，第二项骑士先去约(10.6,22)，再回(12.5,22)，总3.74寸。结束仍一致，五人Core L3，没有因途经超距误脱组。 |
| jointNull66 | 队长短攀爬、骑士普通Climb整令登顶，其余Idle；敌遥控机射击队长，主动方仍先宣告第二项Idle，然后统一掷骰。7命中、20过保失败，队长昏迷，未获掩体（ARM1+PS7=8），没有Number 2时全组解散并清除加成。 |
| jointNumber266 | 同样混合攀爬，骑士教学覆写Number 2；FTO军士第二项Move从(14,27)走到约(15,30)，实测3.13寸。7命中、20过保失败，原队长昏迷，骑士接任。结束检查采用新队长，FTO军士保留；最终骑士、军士、黑衣修士和监护使Core L2，原队长无加成。最终版本重跑。 |

## 实现与回归

新增airborne-resolution.js统一最终爆炸检查、同骰逐攻击视线修正和独立过保，保留每张模板来源与结果。为爆炸过保记录补充攻击者，使勇气阶段知道实际攻击位置。加入逐成员有效PH与修正日志。

火力组在伤害/失能应用后即时同步；conclude先同步Null与Number 2接任，再进行最终一致性，避免以旧队长位置误踢合法成员。已有开始/结束一致性机制没有改成路径中每一点检查。

386/386回归通过。新增8项测试覆盖：最终友军取消、双模板同骰不同视线、一骰全避、EVO全场及抵消、失败回退爆炸、往返一致性、新队长参考点、Null队长/普通成员。全部dist JavaScript语法检查通过。

## 仍未据此宣称通过

- 跨层模板体积、复杂地形阻挡，以及3/4名空降兵、多个EVO和其他ARO的所有组合。
- Explode昏迷自爆与空降爆炸、地雷等完整连锁。
- 孤立/占据、多个Number 2同时失能、状态阶段重入、附属模型各种断连距离的全部网页分支。
- 普通非队长Null离组有自动回归，尚未在本轮独立网页场景重跑。

这些仍保留在覆盖矩阵和后续验证范围，不用上述8类结果代表全部规则组合。
