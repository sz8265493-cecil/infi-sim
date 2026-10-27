# 第104轮：Control逐成员非攻击行动（2026-10-25，仅本地）

核对官方当前 N5.3 / FAQ v0.1。规则依据：[Peripheral](https://infinitythewiki.com/Peripheral)、[Sensor](https://infinitythewiki.com/Sensor)、[Place Deployable](https://infinitythewiki.com/Place_Deployable)、[Reload](https://infinitythewiki.com/Reload)、[Doctor](https://infinitythewiki.com/Doctor)、[Engineer](https://infinitythewiki.com/Engineer)。

## 规则与实现

Control在主动轮宣告需要目标的技能时，只有控制者与本命令先锋执行；其他成员按待机处理。每名执行者必须有自己的技能或装备、自己的合法目标和使用位置。此限制不适用于ARO。技能具有Attack标签，并不意味着它需要指定目标：Sensor、贴身放置部署物与Reload分别处理。外围单位仍遵守同一技能的要求；任务交互的“激活控制台”和“拿取信标”不能混成同一技能。

新增宣告队列保留原命令操作者，逐成员选择自己的目标、模式、移动路径使用点或部署位置，全部锁定后才进入后续ARO。控制者没有Engineer而先锋具备时仍能选择该行动，控制者按待机处理。结算前显示完整成员摘要及待机原因。首项Discover与第二项Discover都走此流程；首项过程中不能跳回第二项行动菜单。Sensor每名使用者各掷一次，对该使用者覆盖的多个标记复用自己的骰子，不共享其他成员的骰子。Reload可选择受益者，仍限制每令每方一名。

## 实际浏览器验收

Chrome，http://localhost:4173/。以下均通过页面下拉、按钮及地图点击完成，检定/结算后返回无待结命令；不是直接调用引擎函数或修改浏览器状态。所有额外技能是明确教学覆写，不改变正式导入配置。

| 场景键 | 实际操作与结果 |
|---|---|
| controlDoctor104 | Idle→逐成员Doctor→控制者救左伤员、先锋救另一个伤员。各用WIP14/12，骰8/9，分别恢复；有Doctor的非先锋待机。公共命令3→2。 |
| controlEngineer104 | 控制者无Engineer，菜单仍允许由先锋执行。控制者待机，先锋WIP12/骰8，把相邻STR遥控存在昏迷II修复至1；非先锋待机。 |
| controlDiscover104 | 分别完整执行首项Discover+Idle、Idle+第二项Discover。控制者和先锋各选一个迷彩，WIP14/12与骰8/9成功；拥有者确认揭露朝向后结束。 |
| controlSensor104 | 控制者、先锋、非先锋三次确认。骰8/9/10，SV20/18/18；先锋覆盖两个标记，两项记录均使用其9，没有第四颗骰。 |
| controlDeploy104 | 地图分别点击(20,29)、(24,29)、(28,29)，控制者中继器、先锋地雷、非先锋中继器。各扣自身一次，命令末放置三枚，无骰/过保。 |
| controlReload104 | 控制者未消耗装备而待机；从待宣告成员中选择乙受益。乙补足中继器，甲保留已用两次的地雷，日志明确一人限制。 |
| controlDeployARO104 | 蓝Idle；红控制者背对敌人仅ZoC，菜单没有放置；甲/非先锋乙有LoF，分别选择地雷/中继器并点击自己的接触位置。蓝Idle后两枚命令末放置。Doctor/Engineer没有ARO入口。 |
| controlDiscoverARO104 | 蓝迷彩Idle；甲与非先锋乙各宣告Discover，控制者放弃。各WIP12、骰8/9；蓝Idle后揭露并确认朝向。非先锋没有被主动轮限制误删。 |
| controlReloadARO104 | 教学从蓝方主动轮开始，三名红方均只有ZoC无LoF。甲可宣告装填；再尝试让乙装填被“本命令已有友方单位宣告装填”拒绝。乙/控制者放弃，蓝Idle后只有甲补足。 |
| controlMedikit104 | 两位执行者各选接触伤员；目标PH12/10分别掷8/9，通过两次装备恢复流程，不进入伤害过保；两人恢复，乙待机。 |
| controlGizmo104 | 控制者修复昏迷II遥控机；先锋选择另一目标的技术恢复，解除IMM-B/孤立。两目标PH12/10，骰8/9分别生效；地图状态已清除。 |
| controlDeactivator104 | 分别选择两个敌方中继器；控制者SV20/骰8、先锋SV18/骰9，两次独立普通检定后移除部署物，无过保。 |
| controlSpeedball104 | 控制者生命包、先锋自动维修包分别救治接触VITA/STR伤员；无骰，消耗各自补给；非先锋不使用。 |
| controlMission104 | 使用Hardlock控制台接触/WIP机制的教学位置。控制者激活西控制台、具备明确Specialist教学技能的先锋激活中央台；WIP14/12、骰8/9成功。首人锁定激活后，后人的拿信标按钮禁用，不能混用技能。 |

14个新增场景已完成，Discover包含首项和第二项两条完整流程；相关修复后重跑了任务交互和首项Discover。截图：`/Users/bytedance/Documents/tt/infi-control-doctor104.png`、`/Users/bytedance/Documents/tt/infi-control-declarations104.png`。

## 边界

本轮验收以上行动，不扩大为所有Peripheral类型的所有非攻击技能均已完成。Control的黑客支援程序逐成员组合、其他外围类型的完整非攻击联动、任意目标同一时刻竞争同一任务物件等仍需专项验收。任务教学只验证当前Hardlock交互，不能代替全部ITS任务例外。精确多附属军表映射未匹配时仍拒绝导入。

最终自动回归与生存组合验收见第105轮。未提交、推送或部署GitHub。
