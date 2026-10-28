# 第122轮：工程与 N5.3 规则复查

2026-10-28。工作目录 `infi-sim-github-live`；Chrome 真实页面 `http://localhost:4173/`。按用户要求仅本地修改，没有 commit、push、GitHub Actions 运行或外部发布。原有第121轮资源本地化修改保留。

## 官方版本与判定依据

实时查看官方资源入口及 Wiki，Wiki 标明已包含 **N5.3 / FAQ v0.1**。这次是针对发现问题的条文复核，没有声称重新逐行审读196页或覆盖全部组合。

- [Surprise Attack](https://infinitythewiki.com/Surprise_Attack)：资格取本命令开始时的 Marker／Hidden 状态；只作用于对应目标的面对面 ARO；多人突袭各自计算，不叠加。
- [Hidden Deployment State](https://infinitythewiki.com/Hidden_Deployment_State)：隐匿模型不在桌面；显形占位须就近放置且不接触占位者；宣告延后 ARO 也须取消隐匿，但可以保留合法标记状态。
- [General Movement Rules](https://infinitythewiki.com/General_Movement_Rules)、[NWI](https://infinitythewiki.com/No_Wound_Incapacitation)、[Dogged](https://infinitythewiki.com/Dogged)：隐匿记录不阻挡；忽略昏迷效果而继续行动的敌人仍阻挡移动。
- [Coordinated Orders](https://infinitythewiki.com/Coordinated_Orders)、[Saturation](https://infinitythewiki.com/Saturation)：协调先算加成再减B；SD不改变B而保留。饱和在分配各主目标后分别−1B，最低1。
- [Isolated State](https://infinitythewiki.com/Isolated_State)、[Tactical Awareness](https://infinitythewiki.com/Tactical_Awareness)、[Traits](https://infinitythewiki.com/Traits)：孤立禁公共池／NCO尉官令与通讯装备，但其他自动技能继续。BS Weapon (WIP) 的信息素武器适用BS特殊骰。
- [Peripheral（含Ancillary例外）](https://infinitythewiki.com/Peripheral)、[Fireteams: Basic Rules](https://infinitythewiki.com/Fireteams:_Basic_Rules)、[Integrity](https://infinitythewiki.com/Fireteam_Integrity)：附属模型及控制者不得入组；不再符合条件时立即脱组，队长离组则解散。
- [Order Expenditure Sequence](https://infinitythewiki.com/Order_Expenditure_Sequence)、[Continuous Damage](https://infinitythewiki.com/Continuous_Damage)：同令恢复先于伤害；持续伤害继续直到成功或模型被移除。

“全组放置先预检再提交”是避免应用半完成状态的工程保障，没有将它称为官方新增规则。

## 已修复与真实网页操作

下列23个 `review*122` 场景均在教学下拉框中实际选择并操作。会产生完整命令的场景走到结算、过保及必要的勇气／Alert结束；资格拒绝场景实际点击触发并检查页面反馈。没有在浏览器注入对局状态或调用规则函数代替按钮。

| 场景 | 操作与实际结果 |
|---|---|
| `reviewHiddenSurprise122` | 隐匿保留令Idle→蓝方步枪ARO→红方步枪。主动SV15，8/9/20；蓝SV11而非14，12失败。两次命中、两保1/1全过，勇敢坚守后命令完成。 |
| `reviewHiddenMove122` | 迷彩红方从18,28点击22,28，经过敌方20,28隐匿记录；实测3.98″（像素点击误差），最终坐标显示22.0,28.0。蓝方放弃、第二Idle无骰结束；红迷彩与蓝隐匿均保留。 |
| `reviewNWIMove122` | 同路径经过hp0的NWI敌人，自动停止于约19.02,28，实际移动1.02″，出现交战。双方Idle完成，没有穿过敌人。 |
| `reviewDoggedMove122` | 顽强hp0敌人同样接触停步1.02″，双方Idle完成。 |
| `reviewNWIJump122` | 普通整令Jump点击22,28，穿过NWI轮廓被拒绝，路径仍0；改18,31合法落地，反应放弃后直接整令结算，没有第二项技能。 |
| `reviewHoloBlocked122` | 第二回声在被模型占据的1×1、Z4小屋顶，无同高可放位置。点击开令显示无合法位置；全组三体仍隐藏，保留令未花，未生成命令。 |
| `reviewHoloBlockedARO122` | 蓝Idle，隐匿真身尝试步枪ARO失败，仍可重选；改Reset再次拒绝仍不锁定。放弃ARO，蓝Idle，命令完成；没有部分显形。 |
| `reviewHoloOccupied122` | 地面回声位置被敌模型占据，有就近合法点；开令三体同时出现，回声移开且不接触占位者。两名敌人均放弃，第二Idle无骰完成，三体保留。 |
| `reviewIsolatedTA122` | 以战术命令0初始化，战术阶段实际生成自身非正规1与TA1；没有公共／NCO尉官令选项。花TA执行Idle+Idle无骰结束，TA0、非正规仍1，公共池未扣。另旧TA1存档也走过同流程。 |
| `reviewIsolatedPT122` | 主动方非正规Idle后无通讯攻击入口；投掷页只有普通烟雾，没有Mirrorball。第二Idle结束并换回合，蓝Idle后红ARO只有步枪、普通烟雾等，没有Endgame/Eraser/Mirrorball；放弃并完成命令。 |
| `reviewCoordPT122` | 手动勾两人协调，Idle→同目标Reset→两人Eraser。先锋B1+1SD掷8/20弃20，成员B1骰9，Reset6/SV10；各自一命中，DA各两保，共4保全部1成功，勇气坚守结束。初始夹具成员意外继承SD，发现后显式改0并重跑；最终验收指重跑结果。 |
| `reviewSaturatedTemplate122` | 轻喷B2在宣告前仍能分配两模板。同目标，选择若饱和则取消模板1；结算仅一次自动命中、一项初始过保，1成功。勇气及Alert保持朝向后结束。 |
| `reviewSaturatedImpact122` | 导弹爆破圆模板B2，同目标；SD归模板2并选择饱和取消模板2。模板1仍2骰/SV12/+1SD，模板2零骰并显示饱和原因。8/20弃20后一次EXP命中、三保1/1/1，勇气和Alert结束。 |
| `reviewFireteamController122` | 打开手动编辑，勾控制者及另两名成员。页面明确控制者不得入组、创建按钮禁用。允许勾选以查看原因，但不能创建不合法组。 |
| `reviewFireteamLeader122` | 一致性夹具：先建立三人Core再加入队长名下仆从；页面日志实际显示队长脱组及Core解散，加成归零。不是任意生成仆从的新游戏行动。 |
| `reviewFireteamMember122` | 同类夹具给普通组员加入仆从，实际日志组员脱组；其余两人仍Core，等级L2，队长面板显示剩余加成。 |
| `reviewRecoveryFire122` | 医生Idle→蓝重喷覆盖医生与伤员→Doctor。WIP7先救醒，医生首保1成功，患者20失败后明确出现“持续伤害下一轮”；再次点击20失败，患者移除，医生勇气坚守后结束。 |
| `reviewRecoveryMono122` | 明确标注的合成MONO模板，仅隔离恢复时序。WIP7先恢复，医生保1、伤员保20；伤员立即移除，未只进入昏迷。完成医生勇气。 |
| `reviewAncillaryNull122` | 昏迷Ancillary控制者不显示禁组原因，勾三名红军后编组合法，实际点击创建并消耗1CT，Core L3成立。 |
| `reviewAncillaryDisconnected122` | 失联Ancillary的控制者及友军协调预览可用；取消后实际创建三人Core L3成功。 |
| `reviewAncillaryUndeployed122` | 未部署Ancillary不在地图，控制者参加两人协调Idle+Idle并完成，实际消耗1正规令与1CT。 |
| `reviewAncillaryActive122` | 正常且已部署的Ancillary使控制者成为受限队长；一致性夹具实际自动脱组并解散Core。 |
| `reviewHiddenDelay122` | 主动迷彩Idle，隐匿+迷彩防御者宣告Delay，立即上桌为迷彩标记。主动第二Idle不揭露，页面显示延后失效，无骰结束；双方迷彩仍保留。 |

## 工程修复

- `skills.attackStart` 在显形前冻结各成员起始资格；开令、协调及联动攻击读取各自快照。
- `holoecho.planHiddenReveal` 预检完整组；主动开令和ARO在扣费、消耗物品、锁定宣告前检查，失败保持原状。
- `engine.blocksMovement` 统一普通移动／接触截断／跳跃阻挡：隐匿及桌外不阻挡，NWI／顽强仍阻挡，明确昏迷状态优先于旧存档残留HP。
- `pheroware` 接通协调B与BS SD，孤立者的通讯攻击和Mirrorball在主动／ARO均被禁用；独立装置Firewall既有行为经回归确认未改。
- 火力组不再只识别Ancillary控制者，普通Servant／Synchronized／Control等关系也会检查。与协调命令共用资格：普通附属的控制关系保留限制；Ancillary明确保留未部署、Disconnected、Null的例外。收尾对照Peripheral新版条文纠正了最初修复过宽的问题，并新增四个网页场景验证。
- 显式模板先按主目标归组再减饱和，用户可声明取消哪一块；被取消模板的同目标SD移到保留池，不跨目标转移。
- 攻击资格仍冻结治疗前的LoF／姿态；过保计划独立使用恢复后的生命快照，持续伤害及单分子不再误用旧HP。
- 全部网页JS模块引用统一到v122，避免缓存的传递依赖加载旧战斗注册表。网页上确实出现过新MONO教学武器不在ARO列表；统一并刷新后正常出现，随后完成上述病例。新增版本一致性回归。
- 修正孤立命令说明、信息素攻击不能经中继器的说明。

## 自动回归与证据

**583/583测试通过，68个网页JS模块语法通过，`git diff --check`通过。** 基线552，本轮增加31项规则与工程回归。代码测试与真实网页操作分别记录，不能互相替代。

截图在仓库 [`artifacts/local-122/`](../../artifacts/local-122/)，包含突袭、显形失败、协调信息素、模板饱和、恢复后持续伤害、火力组拒绝及隐匿延后标记。

## 本轮仍未网页穷举

1. 多隐匿成员共同协调攻击时，各自突袭来源、不同目镜与生物识别组合：有快照模块回归，但本轮网页只完整做单个隐匿突袭。
2. Look Out同时唤出多个隐匿接收者、声明装备消耗与放置失败的全部组合；本轮网页做步枪／Reset失败保持可选。
3. 多模板1+1不同主目标、多个SD、暴击主副目标与饱和／跨层全部组合：部分自动回归通过，本轮网页实测的是同主目标的直射与冲击模板。
4. 新阻挡逻辑的HVT跳跃、桌外空降记录、旧存档昏迷却残留正HP、所有跨层轨迹：有模块回归，未逐项重做网页。
5. 恢复叠加多个独立治疗者、普通BS伤害、自疗开火点，以及更多连续伤害／免疫／自爆组合。中途保存持续保已模块验证，本轮未再做刷新网页验收。
6. 完整三回合、Retreat、任务特殊结束与机密任务、多形态精确军表和混合多附属导入仍是原矩阵缺口；没有因为本轮而改成完成。
7. 浏览器日志仍有既存无堆栈的 `Uncaught (in promise)`，本轮读取到5条，尚未定位来源。上表实际流程均到预期状态，但不能声称零运行错误。
