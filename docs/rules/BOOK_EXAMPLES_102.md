# 第102轮：Cyberplug双配置与附属模型部署

2026-10-25，来源为官方 [Peripheral（含Cyberplug示例1–5）](https://infinitythewiki.com/Peripheral)、[Cyberplug](https://infinitythewiki.com/Cyberplug) 与 [Initiative and Deployment](https://infinitythewiki.com/Initiative_and_Deployment)。核对页面为N5.3、FAQ v0.1。仅本地修改和真实Chrome操作，未同步GitHub。

## 实现

- 必须提供精确的Connected/Autonomous两份配置，切换时同步属性、武器、装备及专属技能，保留位置、伤口和状态；不使用另一兵种代替缺失配置。
- 连接模型与控制者消耗同一命令；控制者执行Idle，Doctor/Engineer例外。自主模型独立使用本组命令池和ARO，不额外供令。
- ARO宣告前可交换配置，首个实际ARO宣告后锁定。使用切换后的视野、技能和武器重新检查资格；控制者可选择正常ARO并让两附属全部自主。
- 控制者孤立/失能在命令结束令附属全部自主；恢复后在命令末明确选择一名重连。远程救治使用控制者WIP及连接模型的接触位置。
- 非Ancillary附属与控制者同阶段部署；保留控制者携带整组，计一个名额，每个模型仍须单独确认合法落点。Ancillary仍局中放置，不因这次修复出现在部署表。

## 真实网页操作

通过教学选择器、按钮及模型点击完成，没有向运行时注入状态。

| 场景 | 实际结果 |
| --- | --- |
| cyberConnected102 | 甲连接Move0，控制者Idle，乙不激活。甲Combi B3/SV17骰9/10/20对6，2命中；另一敌人8对控制者为普通命中，控制者0攻击骰。3次过保均1，再依次勇气与Alert结束。 |
| cyberAutonomous102 | 改全部自主后点乙，以本组正规命令激活。Idle→敌放弃→只有自主手枪B2/SV11，骰8/20；1命中、PS9/保1通过，勇气/Alert后池3→2。控制者、甲不激活。 |
| cyberAROSwap102 | 蓝方Idle后把甲连接换成乙连接。甲自主PH9闪避、乙连接Combi SV17射击，控制者Idle。各骰8，1次过保1；只有甲有闪避移动，选择原地后完成勇气。首个ARO后切换器锁定。 |
| cyberAROIndependent102 | 蓝方Idle后选择全部自主。控制者Dodge SV10、甲Pistol SV11、乙Reset SV9可分别宣告，不强制同技能。各骰8，1次过保1，控制者原地闪避、蓝方坚守后结束。 |
| cyberNull102 | 敌人8命中控制者，保20令其昏迷；命令结束甲乙全部自主，没有Disconnected。随后实际选择乙，用剩余公共命令Idle+Idle结束，池2→1。 |
| cyberDoctor102 | 连接甲往返2.00/6寸后接触伤员，控制者Idle，观察者放弃。第二项Doctor显示控制者WIP14，骰8成功，伤员恢复1/1；没有过保。修复教学MOV字段后重新完整操作。 |
| cyberRecovery102 | 起始控制者孤立、两附属自主。工程师Idle→Engineer解除孤立，WIP14骰8成功。命令末必须选择重连，点乙后甲BS8自主、乙BS14连接；控制者命令来源正确。 |
| cyberProfileLoF102 | 乙自主时敌人在其背后10寸，没有ARO。宣告前切到本例明确带360目镜的连接配置，重新获得LoF与Combi ARO。乙骰8、敌保1，勇气结束。此为技能组合测试，非官方原图。 |
| cyberDeploy102 | 部署选择乙连接、甲自主；部署选择器无全部自主选项。保留控制者，红主要0/0→蓝主要1/1→红保留控制者和两附属逐个3/3→蓝保留0/0。双方跳过Speedball后开局，红正规1、蓝正规1；乙仍BS14/Combi、甲BS8/Pistol。 |

实操发现并修复部署工作台只列控制者的问题。另修复教学MOV误用数组，以及配置切换前视野导致漏掉合法ARO的问题。

## 边界

九个场景为明确标注的教学双配置，不能据此声称官方军表中所有多模型条目均已完成映射；缺少精确资料仍拒绝导入。所有特殊装备、状态、三维接触和多方任务组合未穷举。第101轮记录的无详情异步日志尚不能归因；不宣称控制台完全无错误。
