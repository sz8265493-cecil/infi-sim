# 官方示例第三轮：交叉规则与失败分支

核对日期：2026-10-22。基准：用户提供的 N5 V5.3 规则书、FAQ V0.1，并与官方 Wiki 当前标注的 N5.3 条目核对。沿用用户的本地验证要求；本轮没有提交、推送或修改 GitHub 设置。

在 `http://127.0.0.1:4173/` 通过真实页面控件、地图点击和分阶段骰子窗口操作。教学场景仅配置单位、地形、装备和可选固定骰，不为特定示例改写结算结果。下列记录包含二十多条完整命令及额外的拒绝操作、重置重跑；不把自动测试数量当作全部规则书例图通过的证明。

## 实际操作记录

| 示例／场景 | 网页操作与观察到的结果 |
| --- | --- |
| p80：Dodge 同骰不同阈值 | 主动步枪 SV15 骰 2/3/20；反应 PH10 骰 8，避开枪击。但部署地雷要求 PH−3=7，同一颗 8 未通过：仅地雷产生一次过保。ARM1+PS7=SV8，过保 1 成功，目标仍 3HP。仍不进入闪避移动，按顺序进入勇气，Courage 自动坚守。地雷消耗。 |
| p80：同时躲枪与地雷 | 将同一闪避骰改为 6，两种阈值都通过；没有过保，进入闪避移动。实际点击约 1″ 终点并确认，没有额外命令消耗或新增 ARO。 |
| p66：三敌烟雾成功 | 投掷至 (20,24)，PH13 骰10；正面普通射手骰5与烟雾拼骰，侧翼骰6、MSV2骰8各自普通检定。两次独立命中、两次过保20失败；投掷手4HP→2HP，Courage坚守，烟区仍留场。 |
| p66：烟雾输一组即消失 | 第二名正面普通射手替代MSV2，骰12；烟雾10赢第一名5，但输给12，因此不留烟区。侧翼6仍独立命中；两次过保后2HP，结束地图没有SMOKE。 |
| p56–62：隔墙友方中继器 | 黑客与目标相距20″、被9″楼隔开。主动Spotlight经有效友方中继器选择目标，目标在后续ARO宣告Reset。主动WIP13骰10/8对抗6，两次命中；BTS3穿甲后2+PS5=7，两次20失败：仅Targeted、不扣STR。完成勇气并坚守。 |
| p56–62：无LoF的黑客ARO | 主动REM待机；隔墙黑客可经中继器宣告Oblivion，不能选择需要LoF的普通射击/Look Out。主动第二项Reset6，对方WIP13骰10命中；BTS穿甲后2+PS4=6，过保20失败，只孤立、不扣STR；完成勇气。 |
| p115：Tech-Recovery连续两令 | 昏迷+IMM-A+孤立的Aerial目标，第一令GizmoKit远程命中7、PH12骰7，恢复到1/2STR，仅清除昏迷；初次界面误将昏迷时的解除其他状态选项禁用，复核条文后已修正；官方示例的先救醒顺序保留为一种可选操作。第二令选择技术恢复，命中7/PH7成功，清除IMM-A与孤立，STR仍为1。修复界面后从头重跑过两令。 |
| 技术恢复在Null状态仍有效 | 新增反向顺序并实际完成两令：昏迷+IMM-A+孤立目标先选技术恢复，命中7/PH7成功，仅留下昏迷和0STR；下一令普通维修包命中7/PH7，才恢复1STR。此模式不同时救醒或加STR；没有可解除其他状态时才禁用。 |
| 技术恢复失败与Aerial接触限制 | 对清醒Aerial目标尝试接触维修包，被明确拒绝；尝试工程师接触解除状态同样被拒绝。仍可在本令选择远程GizmoKit：命中7、PH20失败，目标保留1STR、IMM-A和孤立，没有过保或额外伤口。 |
| 维修包+SD | 命中骰20/7，选弃20；只产生一次PH检定，7成功。Remote Presence目标从Unconscious II恢复至1STR。最终战报显示“7（弃骰：20）/SV14”及单独PH7/SV12，不把SD变成第二次命中。 |
| Doctor指挥令重掷 | 初始WIP13骰20失败，选择指挥令重掷；7成功，目标恢复1VITA并清除昏迷/俯卧。正规命令3→2，指挥令4→3。修改记录显示后再次跑通：最终战报保留20失败、所选重掷方式和费用、7成功。 |
| Doctor技能重掷与放弃重掷 | 独立重跑两分支：免费技能重掷按WIP12掷7成功，指挥令仍4；另一轮在20失败后直接确认，不重掷，目标进入Dead并从地图移除，名册保留“已移除”记录。 |
| Engineer两令修复 | 第一令修复Remote Presence的Unconscious II，WIP13骰7成功到1STR；IMM-B与孤立保留。第二令选择解除状态，7成功清除两项，不额外加STR。 |
| Engineer失败的不同后果 | 修复Unconscious II掷20，不重掷：追加一伤，模型移除。另起场景选择解除状态掷20，不重掷：保留Unconscious II、孤立、IMM-B与原伤数，仍俯卧，不移除。 |
| Engineer与PARA同令 | 蓝方重型镇暴喷射器ARO覆盖工程师与其友军。工程师先以WIP7成功清除友军旧IMM-A，然后两人分别做一次PH10−6=4过保。两颗20失败重新施加IMM-A，两人VITA均保持1。无错误伤口、无错误拼骰。 |
| Reload主动与ARO | 同一令蓝方装填ARO，蓝方辎重放弃；主动第二项也选装填。红方铁拳0/2、蓝方1/2均补至2/2。没有骰子/过保弹窗；红方命令3→2，蓝方公共命令池不因ARO扣除。 |
| Guided/ECM/Reset | 使用明确标注的制导教学靶机与真实炽天使配置：B1，BS8−射程3+标记3−ECM6=SV2；目标Reset WIP13−标记3=10。固定骰4失败、3成功：无命中，不进过保，Targeted清除。另有一次随机11/11均失败，Targeted保留；不据此推断随机分布。 |
| p33：9″楼分两令Climb | MOV4+2=6，第一次实际点楼房，攀至Z6并挂墙；结算后第一技能下拉仅Climb。第二令再次点同楼，3.98″到完整底盘登顶Z9，停止在屋顶边缘，不继续走到点击的中央，不进入第二项行动。命令3→1。 |
| 攀爬无掩体及反应轮限制 | 相同楼房，附近敌人对第一令攀爬宣告步枪ARO，SV14，没有掩体−3；20未中。换到蓝方主动轮，蓝方附近待机，挂墙者没有合法ARO；完成待机后仍挂墙，第一技能仅Climb，没有跳跃快捷按钮。 |

## 本轮修复

1. **接通技术恢复界面。** 后端已有按PH解除状态的能力，但界面缺少恢复目的选择。现在明确区分普通损伤/昏迷恢复与Tech-Recovery解除状态，按目标同步选项；Tech-Recovery在Null状态仍有效，可以在保留昏迷的同时先清除其他状态；禁止的是用此模式同时救醒/修伤，而不是强制先救醒。官方示例采用的先救醒顺序同样可用。宣告与结算都保留所选目的。
2. **接触救治核对Aerial。** Doctor/Engineer和接触GizmoKit/MediKit拒绝与有效Aerial单位接触；昏迷后自动技能无效的例外保留。此处只验收治疗/维修模块，不声称已完成Aerial对全部地图碰撞、Guard、任务交互和Boost的适配。
3. **完善检定战报。** 维修包分开的命中骰与PH骰纳入战报；保留SD弃骰和有效骰的区别。Doctor/Engineer重掷保留失败尝试、原SV、所选重掷和指挥令费用。无攻击骰不再写成“自动命中”。
4. **修正受限单位快捷入口。** IMM、昏迷和普通挂墙等不能跳跃时，不再出现误导性的跳跃快捷按钮；不改变原本仅Dodge/Reset/Climb等状态限制。
5. **补入Heavy Riotstopper标准模式和教学配置。** 使用官方武器表的大泪滴/B1/PARA/PH−6规则，仅携带该武器的配置能够选择；不向其他单位自动增加武器。

烟雾、部署物Dodge、基本中继器、修复正负效果顺序和连续Climb在本轮复核场景中已经工作；没有把这些既有功能冒称为全部新实现。

## 核对中纠正的解释

曾将官方Tech-Recovery示例的“先救醒、下一令清状态”误作强制顺序。复读用户V5.3书p115与最新Wiki后，发现明确条款说明该技能在Null时仍有效。已撤销Unconscious禁用条件，增加反向两令的网页实操与回归；上表记录的是最终行为。此处没有援引旧版规则。

## 回归与证据

`tests/book-examples41.test.mjs`新增12项语义回归，覆盖三敌烟雾两分支、枪击/地雷同一Dodge骰、两令Tech-Recovery、Aerial治疗接触、Engineer+PARA结算顺序、连续Climb、SD与重掷战报。最终 `npm test`：350/350通过。JavaScript语法检查通过。

本地截图：

- `/Users/bytedance/Documents/tt/infi-mine80-no-dodge.png`
- `/Users/bytedance/Documents/tt/infi-smoke66-three-enemies.png`
- `/Users/bytedance/Documents/tt/infi-repeater56-targeted.png`
- `/Users/bytedance/Documents/tt/infi-tech-recovery115.png`
- `/Users/bytedance/Documents/tt/infi-tech-recovery-null46.png`
- `/Users/bytedance/Documents/tt/infi-engineer-simultaneous42.png`
- `/Users/bytedance/Documents/tt/infi-climb-wall-aro43.png`
- `/Users/bytedance/Documents/tt/infi-gizmokit-sd45.png`
- `/Users/bytedance/Documents/tt/infi-doctor-reroll45.png`

## 仍未被本轮证明完整的范围

- 中继器：敌方中继器路由、Firewall选择、私密信息等全部组合未逐一人工验收。
- 烟雾：复杂阳台/楼板截断、多个重叠区域、跨层模板不能因本轮通过就标为全部通过。
- 攀爬：本轮验证一座9″楼的向上分两令及挂墙限制；不同侧楼高、连续下攀、多人混合Climbing Plus仍需专项覆盖。
- Technorganic全属性组合、Doctor(2W)、多次指挥令接续重掷等仍未全部手动覆盖。
- Speedball完整流程、协调命令UI、多模板与多人近战等既有缺口保留在执行矩阵，不以图鉴条目代替实装。

## 官方依据

- [Dodge](https://infinitythewiki.com/Dodge)
- [Smoke Ammunition](https://infinitythewiki.com/Smoke_Ammunition)
- [Hacking Area](https://infinitythewiki.com/Hacking_Area)
- [BS Attack / Guided](https://infinitythewiki.com/BS_Attack)
- [Tech-Recovery](https://infinitythewiki.com/Tech-Recovery)
- [Aerial](https://infinitythewiki.com/Aerial)
- [Doctor](https://infinitythewiki.com/Doctor)
- [Engineer](https://infinitythewiki.com/Engineer)
- [Remote Presence](https://infinitythewiki.com/Remote_Presence)
- [Reload](https://infinitythewiki.com/Reload)
- [Climb](https://infinitythewiki.com/Climb)
- [Weapon Chart](https://infinitythewiki.com/Weapon_Chart)
