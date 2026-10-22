# 推荐替换任务：ITS18 HARDLOCK
核验：2026-10-19。推荐中文显示“Hardlock · 信标封锁”（中文为说明性译名）。

## 选择原因
当前官方 ITS18 中，Annihilation、Battleground、Cutthroat、Superiority、Uplink Center 为无HVT/机密牌任务，不适合此次要求。Provisioning 使用对角部署和安全区搬箱子；B-Pong 有推移信标及每单位次数限制；Hardlock保留直观12寸部署、3控制台、2固定起点信标，仅激活与拿取两种交互，支持HVT与1张机密，适合三轮demo。

## 当前官方来源
- https://experience.corvusbelli.com/en/infinity/its （当前ITS18目录，链接到以下同一任务）
- https://experience.corvusbelli.com/en/game-content/4fdeacaa-ad46-4d37-aa5b-d5284f452653 （Hardlock，网页文本原始HTML已提取 /tmp/infi-hardlock-data.txt）
- 当前整册：https://experience.corvusbelli.com/en/resources/a83f2e78-2275-565b-bebb-be488d1267db?l=805f9388-9dbd-4602-b116-4a090c8a8d60
- 原始整册 /tmp/infi-its18.pdf；正文 /tmp/infi-its18.txt；Hardlock页49–52，HVT与机密通用页34–37。
- 当前令牌资源：https://experience.corvusbelli.com/en/resources/0591e0d3-e9f4-54ef-8832-a31310d01ae0?l=0e72d2f2-6c7f-41d5-81b5-451ce90e0105 （官网ITS18当前所链接的通用令牌PDF，文件本身制作于2021，为仍在用的资源不是引用旧版规则）。原件 /tmp/infi-its-tokens.pdf。
- https://infinitythewiki.com/Initiative_and_Deployment
- https://infinitythewiki.com/ITS_FAQ

**版本注意**：任务网页仍有旧的 TACTICAL SUPPORT OPTIONS:1 字样，但当前ITS18整册没有，赛季公告已停止Tactical Supports。实现以当前整册为准，不加战术支援，也不沿用Uplink的Operational Learning。

## 精确摆放：48×48英寸 /300分 /6SWC
原点左上，x向右y向下。PDF49页地图已视觉核对，网页表格/坐标也一致。
- A部署区：x=0..48,y=0..12；B部署区：x=0..48,y=36..48。
- 控制台3个：C1=(12,24), C2=(24,24), C3=(36,24)。直径40mm，半径20/25.4≈0.7874英寸。
- A信标=(24,12)，B信标=(24,36)，处于各自部署前边中点。用官方BEACON A/B token，**直径25mm**：Hardlock文字未明写直径，但官网当前通用Token PDF原件1页中Beacon与25mm小token同尺寸，控制台40mm；按PDF物理页面尺寸核对比值25:40，不能把B-Pong的特殊40mm Tracking Beacon混过来。若仅引用任务文本需承认尺寸来自官方令牌资源。
- 双方各部署1名HVT。其位置是玩家选，不是任务固定坐标。建议demo预设A HVT=(6,18)、B HVT=(42,30)，25mm底盘/S2，地面无建筑且可接近，距任何部署区的底盘边≥4英寸。
- 所有普通单位全底盘在己方部署区：A y+r≤12，B y−r≥36；x−r≥0,x+r≤48。不得与控制台/信标/HVT/敌单位接触。HVT自身按专用部署条款。
- 允许有合法高级部署技能的单位按技能部署，但默认预设可全部放区内避免越线。
- 固定地形布局不属于任务规定，可安排可通达路径，不要把控制台埋在障碍中。

## 两种交互
### 激活控制台 Activate Console
- 短技能，Attack/Scenario标签；仅Specialist、本人轮廓接触。
- 普通WIP检定；失败可再花短技能重试；成功改为己方激活（移除敌方激活）。
- Specialist：Hacker/Doctor/Engineer/Forward Observer/Paramedic/Chain of Command/Specialist Operative。
- Repeater、Peripheral(Servant)不能代替本人。
- **没有额外职业bonus、没有Operational Learning**；保持WIP本值及真正适用的单位技能修正。
### 拿取敌信标 Pick Up Beacon
- 短技能、Attack/Scenario；己方需至少有一个已激活控制台。
- 任意合格模型单位（不必Specialist）接触敌信标且无敌非Null单位接触，或接触正携带敌信标的友军Normal模型，可无骰拿取/交接。
- 每模型最多1（Baggage最多2）；只模型非Marker能携带，携带时不能进入Marker State（ITS FAQ）。
- 信标随携带者保持轮廓接触；携带者进入/处于Null时掉落，放到略离其接触的位置。信标不阻挡移动/LoF。
- 控制敌信标与拿起是分开的：仅要求至少己方1名非Null模型接触、无敌方有效模型接触即可控制，不需要已拿取；双方争夺则不控制。无需Specialist。

## 计分与结束（10分）
- 每Game Round结束控制敌信标：1分，最多三轮3分。
- 终局己方信标未被敌控制：1分。
- 终局比对方激活更多控制台：2分（平局无此分）。
- 终局每个己方激活控制台：1分，最多3分。
- Classified：1项、1分。
- 三Game Round结束；若以Retreat!开始Active Turn，则该玩家回合末提前结束。
- 在UI区分已锁定的逐轮分与终局预估，避免每次render重复加分。

## HVT和机密
- 每方部署开始时各放1 HVT；距**任何**部署区最少4寸，不得在建筑/地形里面或顶部，且位置必须可达。
- HVT为双方中立平民，不产生普通命令/ARO，不应可射击当敌军；当前ITS FAQ明确HVT不阻挡移动。
- 一项机密：按通用规则从自己的Classified Deck抽2选1，未达成前为私有信息，达成后展示；每项仅得分一次。
- Secure HVT可在**终局**替换该1项机密：己方非Null单位在敌HVT ZoC内，且己HVT ZoC内无敌非Null单位。达成给相同1分，不能和原机密叠加。
- Demo可以明确选择“机密教学：Secure HVT替代”，无需假造随机卡牌；若未实现全部官方机密卡，不要声称完整机密牌组。
- Hardlock没有INTELCOM条款，不实现它。
# ITS18 Classified Deck 核验与实现边界
核验日期2026-10-19。

## 已验证的当前规则（可以实际实现）
依据当前ITS18整册34–37页，原件 /tmp/infi-its18.pdf、文本 /tmp/infi-its18.txt：
- 每名玩家使用自己的Classified Deck，打乱后为每个任务名额抽2张、弃1张。完成这一步才为下一个名额抽卡。
- 抽卡在知道任务和敌军势力之后，但在选择提交的两份军表之一之前。
- 卡片在达成前是私有信息，达成后应可展示给对手核查；每项只计分一次。
- Hardlock每人一个名额，1分，不是1分乘重复达成次数。
- 终局可用Secure HVT替换一个机密，不是强制开局就替换。Hardlock没有INTELCOM。
- 只有当前Secure HVT完整要求有公开权威正文：己非Null单位在敌HVT的ZoC内，同时己HVT的ZoC内无敌非Null单位。值与被替换机密相同。
官方整册入口：https://experience.corvusbelli.com/en/resources/a83f2e78-2275-565b-bebb-be488d1267db?l=805f9388-9dbd-4602-b116-4a090c8a8d60

## 当前卡牌正文的结果
**没有找到能验证为当前Operations Deck全部20张卡的公开官方正文。不能拿旧PDF冒充最新，也不能按记忆填写卡上次数/修正。**
- 当前官网商店列售 Operations Deck，官方SKU286100（语言产品族）；英文包装286103。官方产品链接：https://store.corvusbelli.com/en/organized-play/infinity/all/operations-deck
- 官方替换公告：https://infinityuniverse.com/en/news/new-order-its-15 明确：Operations Deck替换旧Classified Deck，新增5项目标并修订剩余卡。该公告仅用于确认版本沿革，不作为旧游戏规则的依据。
- 当前官方FAQ https://infinitythewiki.com/ITS_FAQ 的Classified Objectives条明确提到Telemetry与HVT:Designation：完成卡片要求数量的Spotlight成功检定即可，不需要让目标进入Targeted状态。但FAQ**没有给出卡上成功次数、其他资格、距离**，不足以完整实现两张牌。
- 当前ITS FAQ还提到Predator；仅说明Akial Interference特殊任务下抽到卡前的击杀不算，没有提供完整目标条文。
- 常见 https://downloads.corvusbelli.com/infinity/organized-play/classified-deck-en.pdf 是旧牌，仍含DataTracker、G:Servant等术语及旧Extreme版本；不可当当前牌。
- 旧N3规则网页/旧ITS16/博客牌表不作为替代依据。
- 官方Operations Deck广告原图仅有包装，没有可读卡面；已查。

## 诚实且有用的当前实施方案
不要把“机密卡”按钮变成只能Secure HVT，也不要随机造一个未验证旧卡库。
可以做真正的实体牌配合流程：
1. 每方有自己的机密卡槽与“抽2选1”步骤。
2. 用户从当前实体Operations Deck抽2张，输入两张卡名（可附卡面文字/自定义摘要）；选1张保留、另1弃置。保留记录且默认隐藏对手视角。
3. 对未自动实现的卡明确显示“依据当前实体牌，手动裁定”，提供“展示并记录达成”与撤销，终局最多1分。
4. 提供事件日志（WIP、修复、击杀、Spotlight成功数、目标）帮助核对，但不自动猜测条件。
5. Secure HVT为单独的终局替换选项，不覆盖原卡、不可和原卡双计。
6. 如果允许用户导入自己持有的当前20张牌规则JSON，可在本地进行真实洗牌抽2选1；不能预装未验证旧牌再标为现行。

若必须交付内置完整机密牌模拟，则缺的是当前卡面资料，而不是编码：需要用户提供当前牌面/规则（拍照或文件）后才能按其要求核实实现。可先把上面流程完成，再在最终简短说明此资料限制，不能声称已全自动支持。

## 2026-10-19：盖板宣告时机修正

依据 N5.3 Direct Template Weapons：宣告攻击时放置模板，检查主目标及受影响单位；未覆盖主目标则整次攻击失败。不能在选择武器阶段试探覆盖。

- 主动方选择武器、主目标、喷射方向时不生成模板；确认宣告后才显示并锁定选择。
- ARO 武器选项依据持有装备与视线等宣告条件，不再根据模板射程、友军覆盖或最优命中位置筛选。选择后还需确认宣告，确认时生成模板。
- 宣告后未覆盖主目标，不产生对次要目标的伤害；覆盖友军/HVT 时取消攻击，避免结算抛错。
- 实战宣告前关闭自由测距，隐藏目标面板和视线剖面的距离；移动规划仍按移动技能测量。
- 仍是二维教学模型：跨层倾斜盖板未实现；模板瞄准方向与完整路径覆盖需要继续对照官方例图审计，不能声称所有预量与宣告流程均已完全适配。

来源：https://infinitythewiki.com/Direct_Template_Weapons

## N5.3 官方演示与当前实现的流程审计（2026-10-19）

### 审计范围与方法

以官方 Wiki 当前标明的 N5.3／FAQ V0.1（Sep 2026）为准；不使用 N4 镜像或论坛历史解释。对照官方例图配套的逐步演示文字，并检查本地源码、浏览器交互及定点复现。部分官方原图请求超时，以下几何结论基于规则文字和代码，不能当成逐像素复刻原图后的验证。当前修正仅解决宣告前模板预览及相邻失败分支，下面的“待修”均未随之完成。

112 项现有回归测试通过，只表示已覆盖行为未回归；本次另用 `audits/rules-probes.mjs` 复现了 5 项未覆盖差异，输出在 `audits/rules-probes-output.txt`。复现脚本只打印实际结果，不将已知错误写成通过标准。

### 官方顺序与已吻合的部分

激活并消耗命令 → 首项基本短技能／整令 → 首次 ARO 检查及宣告 → 第二技能（如适用） → 新增 ARO → 结算时锁定目标位置、测量、计算修正、检定 → 效果（含过保和闪避移动）→ 结论（勇气、Alert!、凝聚等适用流程）。

- N5 的普通组合是“基本短＋基本短”“基本短＋短技能”或整令；不能套用旧版印象，把缺少“先射击再移动”判为错误。
- 沿路有视线就检查 ARO；移出墙角再回到原处，仍可交火，伤害在所宣告移动终点应用。当前实现保存整条路径并先落到终点，基本方向正确。
- 喷火与对方射击是独立普通检定／自动命中，不能靠枪骰抵消喷火。现有用例已覆盖。
- 无需过保时跳过过保界面；成功闪避后才规划移动，主动方先移动、反应方后移动，之后勇气。当前基本顺序正确。
- 闪避接触敌人可以进入近战，闪避移动不另开 ARO。当前具有相应路径与终点处理。
- 昏迷与移除分开；二级昏迷有遥控存在等条件，不是所有单位都有；昏迷俯卧仍应遵守不能俯卧的单位例外。

来源：[命令顺序](https://infinitythewiki.com/Order_Expenditure_Sequence)、[激活](https://infinitythewiki.com/Trooper_Activation)、[Dodge](https://infinitythewiki.com/Dodge)、[通用移动例](https://infinitythewiki.com/General_Movement_Rules)。

### 已确认差异与优先级

**P1-01：结算前尚未形成“锁定选择 → 开放测量”的独立关卡（待修）。**

FAQ V0.1 允许在结算时、测距前选目标所在路径位置。当前 `reactionPositionsHTML` 可改瞄准点，但 `renderAction(resolve)` 同时显示命中/致伤概率，自由测距也在 resolve 开放。因此仍可获知测量结果后换点；`discoverReaction` 还自动挑最高 SV 的路径点并提前显示 WIP。需独立锁定所有目标点，再开放距离、MOD 与概率，发现 ARO 同样处理。固定 1″ 网格、坐标和可撤销演练也意味着当前不是真正的信息受限竞赛模式。

代码：dist/app.js 的 reactionPositionsHTML、discoverReaction、setMode、renderAction。
来源：[最新 FAQ](https://infinitythewiki.com/Order_Expenditure_Sequence#FAQs)、[距离与测量](https://infinitythewiki.com/Distances_and_Measurements)。

**P1-02：直接模板缺少 B>1 的分发与多模板命中（已复现，待修）。**

官方 Direct Template With Burst 2 演示逐发摆放两块模板。当前每个行动只有单个 shape；resolveOrder 固定生成一个自动命中。复现：赋予 +1 B 后，attackSpec 返回 B2，实际目标只有 1 次命中。应保存每一发的主目标、方向和覆盖结果，允许分别分发。
来源：[直接模板 B2 演示](https://infinitythewiki.com/Direct_Template_Weapons)。

**P1-03：冲击模板暴击错误扩散到次要目标（已复现，待修）。**

模板暴击只有主目标按暴击处理。当前对全部受影响目标传相同骰值及暴击阈值。复现：一发 EXP 模板暴击，主目标 4 次过保正确，次要目标也变成 4 次，应该是 3 次；次要目标的拼骰抵消也需区分普通成功与暴击。
代码：dist/combat.js resolveOrder；dist/saves.js planSaves。
来源：[模板暴击规则](https://infinitythewiki.com/Template_Weapons_and_Equipment)。

**P1-04：冲击模板漏算射击的部分掩体 −3（已复现，待修）。**

模板不享受过保 +3，并不等于所有命中掩体修正都取消。当前 attackSpec 的 cov 只认 kind==='bs'，impact 被排除。复现：强制 manualCover=yes 的导弹爆破模式，掩体 MOD 仍为 0。需分离“命中掩体修正”和“过保掩体加值”。
来源：[射击掩体](https://infinitythewiki.com/Ballistic_Skills#Cover)、[冲击模板](https://infinitythewiki.com/Impact_Template_Weapons)。

**P1-05：模板几何仍为同层二维近似（已复现，待修）。**

官方模板具有体积，Direct Template B2 的例子还区分站立与俯卧轮廓。当前 templateHits 把脚底高度差超过 .12″ 的模型直接排除，再使用二维遮挡；并没有真实半球/泪滴体积。复现：半径 2″ 的圆形模板中心正上方 .5″ 高模型被判不受影响。主动界面另直接拒绝跨层模板。需要模板体积、轮廓相交及模板内 Blast Focus 遮挡，而非只比脚底高度。
来源：[模板范围与高度](https://infinitythewiki.com/Template_Weapons_and_Equipment)、[直接模板例](https://infinitythewiki.com/Direct_Template_Weapons)。

**P1-06：先发现／待机再第一次 Move，距离用了 MOV 第二值（已复现，待修）。**

Move 的第二值适用于同一命令再次 Move。当前 budget 以 secondMove 标志选择第二值，该标志也用于发现后移动。复现：MOV 6-4 单位 Discover + Move 只有 4″；该 Move 是本命令第一次，应为 6″。应统计 Move 次数，不能用“第二技能”代替“第二次 Move”。
来源：[Move 及 Move+Move 演示](https://infinitythewiki.com/Move)。

**P1-07：ARO 模板没有检查主动模型整条命令轨迹（代码确认，待修）。**

官方允许以命令期间处于模板内的主动模型判定主目标。当前 ARO 固定 r.point，伤害只检查该点，未合并第二次移动新增的路径。需将已摆放模板保留，结算时对整条轨迹检查；不能把“模板方向”和“目标轨迹上的位置”绑成一个不可区分的参数。
来源：[直接模板 ARO](https://infinitythewiki.com/Direct_Template_Weapons)。

**P1-08：取消攻击与反应资格必须分开（本轮已修正基础分支，仍缺多发）。**

官方冲击模板演示中，碰到昏迷友军的那一发取消；被取消模板覆盖的反应单位仍可 ARO。当前本轮修正已保留这种覆盖引发的检查，并让失败攻击无伤害。仍因单 shape 数据结构不能实现“B2 一发取消、另一发继续”。不能将模板取消简单等同于整令待机。
来源：[友军/中立模板演示](https://infinitythewiki.com/Template_Weapons_and_Equipment)、[冲击模板演示](https://infinitythewiki.com/Impact_Template_Weapons)。

**P2-09：摆放模板的交互仍过于简化（待修）。**

本轮已做到选择时不显示、宣告后才显示。但主动方只能用中心到瞄准点的方向生成模板；ARO 只能选择路径点，缺少合法的边缘接触位置和放置姿态。下一版应显式分开“锁定武器/主目标/射击点”和“执行该次声明的盖板摆放”，保留宣告不可撤回，避免把合法的摆放也全部锁死。跨层倾斜另属几何实现问题。
来源：[直接模板放置例](https://infinitythewiki.com/Direct_Template_Weapons)。

**P2-10：闪避、勇气移动缺少完整姿态选择；勇气候选搜索不是规则裁判（代码确认，待修）。**

Dodge/Guts 移动可按通用规则在起止点改变俯卧姿态。当前 dodgePlan 固定 stance=keep，勇气只能点 .25″ 网格采样出的候选或被迫俯卧，缺少起身、起/终点俯卧、自由末朝向等操作；搜索没有找到路径不等于规则上不存在。需允许玩家规划合法路径并验证优先级，加入多层/强化攀爬候选或明确人工裁定。
来源：[姿态变更](https://infinitythewiki.com/General_Movement_Rules)、[勇气](https://infinitythewiki.com/Guts_Roll)。

**P2-11：多次闪避判定没有完整建模（部分支持，待补）。**

官方 Dodge and a Deployable Weapon 演示用同一颗骰分别对比枪击与地雷，存在躲开枪却没躲开雷、因而不能移动的结果。当前主动闪避对多个 ARO 有共享骰与部分独立修正，但地雷、触发区和同时多种模板威胁尚未实现，不能复现完整演示。每种威胁的“是否受伤”和最终“能否闪避移动”应独立汇总。
来源：[Dodge 演示](https://infinitythewiki.com/Dodge#Examples)。

**P2-12：火力组只有奖励，未实现官方组行动流程（缺失）。**

当前 ftLevel 是手填属性，order.actor 只有一人。官方 Fireteam Examples 3/4/8/12 所需的队长、成员路径、开始/结尾凝聚检查、成员各自闪避、敌方选择攻击成员、不同 ARO 脱组重算均无完整实现；普通 B3/B4 也不能分发目标。应先建组成员与逐目标攻击包，再复用骰子结算，而不是继续堆 ftLevel 条件。
来源：[火力组演示](https://infinitythewiki.com/Fireteam_Examples)、[基本规则](https://infinitythewiki.com/Fireteams:_Basic_Rules)。

**P2-13：完整玩家回合仍缺战术阶段与鲁莽阶段（缺失）。**

现有结束回合直接清理状态并刷新命令；未完整处理失去尉官、撤退、指挥令及鲁莽激活。虽然单位旁有鲁莽标记，orders.sources 不提供该激活流程；不能将可见标记理解为已实现规则。隐藏部署单位贡献命令、战斗组独立命令池也需进一步适配。
来源：[回合顺序](https://infinitythewiki.com/Game_Sequence)、[失去尉官](https://infinitythewiki.com/Loss_of_Lieutenant)。

**P2-14：移动地形与完整规则之间仍有近似（代码确认）。**

官方屋顶探身、半底盘支撑、多级翻越均不能等同于“忽略半径穿墙”。现有只识别成对轴对齐窄通道；moveSegment 按起止较低高度做翻越，不能完整复现累计超过轮廓高度但各台阶合法的例子。跳跃的低障碍翻越和接触第一落地面的终止也需专项验证。墙角争议不要引用旧论坛直接裁定，需用当前规则和明确地形模型验证。
来源：[通用移动演示](https://infinitythewiki.com/General_Movement_Rules)、[Move](https://infinitythewiki.com/Move)、[Jump 例 1–4](https://infinitythewiki.com/Jump)。

### 推荐修复顺序与验收场景

1. 先拆开“可宣告条件／锁定／测量／结算”，消除概率、发现自动选点和撤销造成的信息回流。
2. 修正模板结算：B2、逐发目标、主/次目标暴击、部分掩体、取消后保留 ARO、整段路径覆盖。
3. 修正 Move 次数和补齐闪避/勇气姿态，加入官方“探头后返回原处昏迷”和“闪避接战”的端到端用例。
4. 再实现模板体积、地雷、多层移动以及火力组／完整回合。

每个场景必须验证：玩家何时能看到哪些信息、何时选择被锁定、命令与弹药是否消耗、哪些单位获得 ARO、每个目标掷哪些骰、最终模型位置和状态。不要仅以动画播放成功作为验收。

## 第二项技能选择交互（2026-10-19）

第二项技能先展示移动、射击、近战、闪避、Reset、待机等动作。选择射击或近战后才展示该单位携带的对应武器及模式；手枪分别显示射击或近战模式。正式宣告前可以返回动作选择，返回会清空目标和瞄准方向，不额外消耗命令。三角射击整令保留专用流程。

验证：112 项既有测试通过；浏览器检查动作入口、近战/射击武器与模式过滤、返回重选及闪避分支。

## 2026-10-20：宣告、移动与结算修订

依据当前官方 N5 Wiki 核对，未采用旧版 MOV 两段之和的跳跃规则。

- 延后 ARO 只锁定“延后”。第二项行动揭露迷彩后才开放具体 ARO；不揭露则自动失去该反应。阶段栏明确标出主动轮首项行动、反应轮首次 ARO、主动轮第二项行动，当前阶段使用橙黄色。
- 普通 Jump / Climb 按整令处理，默认 MOV 第一值 + 2″，没有第二项行动。攀爬通过地图点击自动识别接触建筑及高度；强化攀爬、超级跳保留对应技能分支。墙上轮廓仍是圆柱近似。
- 超程点击沿已选路径方向截到可达且可容纳底盘的位置；这不是全地图自动寻路。昏迷单位允许穿越，禁止重叠落点。接触昏迷敌人选择 CC Attack 即处决，不掷命中或过保骰，移除模型。
- 反应喷火在宣告前只显示约 2″方向指示，可点地图改变方向。实际模板在确认宣告后才放置并锁定。
- 教学场景默认随机骰；固定教学骰例保留为显式开关，HUD 显示当前模式。相同随机结果仍可能自然出现。
- 闪避、败勇气移动区分开始/结束姿态；保持或开始俯卧时距离减半，结束才俯卧不倒扣此前距离。败勇气移动先规划再确认。候选落点为采样建议，未找到建议不代表数学上不存在合法路径。
- 普通部队允许自动败勇气；Courage 可自动成功；Religious Troop 自动成功，选择撤退须 WIP 成功。黑客攻击以黑客区而非视线判断脱离。
- 部分掩体计入射击命中 −3；普通射击过保 +3，模板无过保掩体加值。补上命中模板的射击 −3。仍以简化几何判断视线及遮挡。
- 搜索 Discover、Sensor、任务交互与其他第二项动作同层选择。Sensor 一次共享检定，空区域也可正常结算。
- 新增显式黑客教学场景及 Spotlight、Carbonite、Oblivion、Trinity，按实际装置限制可选程序，处理 Reset 对抗、BTS 过保和状态。普通单位不会凭空获得黑客装置。当前 UI 仅个人黑客区；中继器路线、Total Control、支援程序等尚未接入。部署物、装填、医生、工程师列出适配范围，尚未自动结算。

官方依据：[Jump](https://infinitythewiki.com/Jump)、[Climb](https://infinitythewiki.com/Climb)、[Camouflaged State](https://infinitythewiki.com/Camouflaged_State)、[CC Attack](https://infinitythewiki.com/CC_Attack)、[Prone State](https://infinitythewiki.com/Prone_State)、[Guts Roll](https://infinitythewiki.com/Guts_Roll)、[Courage](https://infinitythewiki.com/Courage)、[Religious Troop](https://infinitythewiki.com/Religious_Troop)、[Common Skills](https://infinitythewiki.com/Common_Skills)、[Hacking Area](https://infinitythewiki.com/Hacking_Area)。

验证包括延后反应揭露/未揭露两分支、整令攀爬、反应喷火方向锁定、闪避姿态与截断移动、黑客/Reset/过保/勇气浏览器流程，以及自动回归测试。本节修订覆盖此前审计中的对应问题，不代表此前全部未适配项已经完成。

## 2026-10-20：医生、工程师、部署物与装填

本节替代前文中这四类行动“尚未自动结算”的说明。依据 N5.3 Wiki，特别是 2026 年 9 月 Reload/Baggage 更新与 Place Deployable FAQ。

| 行动 | 主动轮 | ARO | 必要配置 |
|---|---|---|---|
| Doctor | 基本短技能后使用短技能 | 不可 | 本人 Doctor 技能 |
| Engineer | 基本短技能后使用短技能 | 不可 | 本人 Engineer 技能 |
| Place Deployable | 基本短技能后使用短技能 | 可，额外需看到主动单位 | 携带对应可部署装备，且有剩余次数 |
| Reload | 基本短技能后使用短技能 | 可，先有合法 ARO 机会 | 已消耗的可装填装备；有效友方 Baggage 控制区 |

N5 的组合必须按 Basic Short → Basic Short / Short，或单个 Long 的顺序宣告；没有“先 Doctor 再 Move”。不移动时先 Idle。菜单按实际配置和状态筛选，结算仍重新校验；不能接触等要求不满足时按 Idle 处理，无治疗骰、无失败杀伤。

- Doctor：昏迷 VITA 救治、2W 配置、Technorganic 例外、眩晕解除；救治最终失败移除目标。Engineer：STR 逐伤修复、遥控存在昏迷 II 一次成功恢复至 1 STR、修复失败增加一伤、解除状态失败无额外伤害。状态解除和伤口修复分别选择。合法自用与 Null 限制已处理。
- 重掷：支持档案 ReRoll WIP=X，每令一次；目标 Cube（Doctor）或 Remote Presence（Engineer）允许消耗指挥令重掷。失败结果在玩家结束重掷后才应用，指挥令重掷恢复通常 WIP。HUD 增加指挥令数量。仅 Doctor 解除眩晕失败采用该状态页“未取消状态”的处理，不套用昏迷救治失败移除。
- 同令正负效果：治疗、修复及解除状态先应用，再应用敌方伤害／状态；避免把同令新伤或新状态消除。
- 部署物：当前可用目录为休克地雷、可部署中继器；只有显式携带才显示。主动轮可沿移动路径放置，ARO 限本人接触。检查水平完整支撑、不重叠和迷彩触发区限制。宣告即扣次数，失败不退。命令结束才加入地图；若原位置在宣告后被占用（含后续移动、闪避），允许重新选合法位置，无法放置才损失。
- 地雷：以 CAMO S2 放置，揭露为 S0；之后的命令／ARO 检查触发，闪避和败勇气移动不触发。避开友军（含昏迷），休克小泪滴自动命中并接入过保。对地雷用同一闪避骰另算 −3，不与无视线重复叠加；没避开地雷不获得闪避移动。角度采用 1°采样，仍受二维模板近似限制。
- 部署物没有命令、ARO、勇气或任务控制资格，STR 归零直接移除。可部署中继器已扩展友方黑客范围；敌方中继器路线／Firewall 选择仍未开放。
- Reload：恢复所有可补充次数，每令每方仅一个受益单位；状态阶段自动补充友方辎重控制区内符合条件者。不可装填物品不会恢复，已在场部署物不受影响。铁拳与部署物共享现有 spentWeapons 库存系统，射击宣告时预扣并按剩余次数限制 Burst，避免最后一发结算时被误判无武器。
- 新增四个明确标为“教学覆写”的场景：医生、工程师、部署物、装填。现有正式配置不会自动获得新技能／装备。未接入的周界装备、附属单位、Drop Bear 投掷、MediKit/GizmoKit 不作为已完成项。

验证：浏览器实际走通 Doctor 指挥令重掷救回、Engineer 昏迷 II 修复、双方主动/ARO 装填免骰、主动/ARO 放置、下一命令地雷触发及过保。新增测试覆盖技能/状态/ARO 限制、重掷、同令恢复后受伤、库存、部署物不供令、不控点、地雷独立闪避成功值、友方中继器与辎重范围。

来源：[Doctor](https://infinitythewiki.com/Doctor)、[Engineer](https://infinitythewiki.com/Engineer)、[Stunned State](https://infinitythewiki.com/Stunned_State)、[Place Deployable](https://infinitythewiki.com/Place_Deployable)、[Reload](https://infinitythewiki.com/Reload)、[Baggage](https://infinitythewiki.com/Baggage)、[Mines](https://infinitythewiki.com/Mines)、[Dodge](https://infinitythewiki.com/Dodge)、[Deployable Repeater](https://infinitythewiki.com/Deployable_Repeater)、[Trooper Activation](https://infinitythewiki.com/Trooper_Activation)、[Order Expenditure Sequence](https://infinitythewiki.com/Order_Expenditure_Sequence)。

## 2026-10-20 · N5.3 部署武器与视线区域（v23）

核对来源：官网当前 N5.3 / FAQ 0.1。以下是实际实现范围，不能据此宣称已经覆盖整个武器表。

### 行动与装备条件

- `Place Deployable`：普通短技能或 ARO。只显示本单位携带、有剩余次数且状态允许的部署物。主动可贴沿路轮廓，反应只贴自身当前轮廓，**ARO 必须对主动单位有 LoF**。单位接战／普通悬墙时不开放。
- 常规地雷支持 Shock、AP、E/M、PARA、Monofilament、Viral；继承各弹药过保与状态。支持可部署中继器。普通地雷伪装 S2、实体 S0；Drop Bears 地面放置／投掷共享三次，落地公开 S0。
- `Targetless`：独立点选落点，不要求敌方主目标。普通投射需看见落点；ARO 还须看见主动单位，仅有 ZoC 反应机会不够。
- 支持 Drop Bears PH、Pitcher BS、Mine Dispenser（本次明确为 Shock 配置）、Disco Baller BS。普通投射与来袭攻击独立 Normal；成功后 Conclusion 放置，不会在放置当令触发。
- `Speculative Attack` 在第一行动选择为整令，B1，−6 加距离修正，不进入第二项技能。`Intuitive Attack` 对地雷放置为整令 WIP 检定，允许仅敌迷彩在触发区的情形；未通过也扣耗材。
- Disposable 在宣告确认时扣除，失败／待机不退款。Double Shot 仅主动、两次皆剩时选择；支持额外 Burst 与 SD（SD 不是额外耗材）。当前 B2 投射共享一个声明点；两件实体不能重叠，第一件占据该点后，第二件经 FAQ 重放界面指定另一个合法点。
- 水平落点要容纳完整底盘。FAQ 的后续占位允许重选，否则失去部署物；原本已被占据不作为合法重放理由。不能贴垂直面。

### Smoke / Eclipse

- Smoke、Eclipse 手雷 PH，0–8″ 修正 **0**，8–16″ −3；发射器 BS，0–24″ 0、24–32″ −3、32–48″ −6。
- 确认前仅十字落点、不展示整圆；确认锁定后展示待定圆模板，用于 ARO 和本命令拼骰关联，不能提前改变本命令 LoF。
- 仅与对自己且需要掷骰、需要 LoF、LoF 被该区阻断的来袭 BS Attack 拼骰。直喷、黑客、近战不因此被抵消。多个射手分别使用同组烟雾骰，全部相关对抗成功才保留烟雾。
- Smoke 不与任何 MSV 拼骰；Eclipse 可与 MSV 拼骰。烟雾不致伤、不要求过保；覆盖友军合法，对其 Dodge 为 Normal。
- 烟雾结果在 Effects 后成为持久区，参与后续 Dodge/Guts 视线计算；持续到 States Phase 开始。普通烟无 MSV 阻挡；MSV1 穿烟 −6；MSV2/3不受此修正。Eclipse 阻挡所有 MSV。
- 被穿零能见度区射击时可对该攻击者反击，按 Poor Visibility −6；符合条件的 Sixth Sense 忽略该修正。

### Disco Baller / Activate Disco Ball

- BS 距离：0–8″ 0，8–16″ +3，16–24″ −3，24–32″ −6。Disposable2，Double Shot 仅主动。**始终普通检定，不能拿球来拼掉本次枪击。**
- 成功 Conclusion 生成 S1 / STR1 / ARM0 / BTS0 的球，并开启 Eclipse。States Phase 只清区域，保留失活实体；球被摧毁则移除其区域。
- 具备 Deactivator 才出现“激活迪斯科球”；仅主动短技能，目标须友方球且在 LoF 或 ZoC。WIP+3 再叠消除器距离（8″ +6、16″ +3、24″ −6），成功 Conclusion 开启。

### White Noise

- 仅真正持 White Noise 程序（HDPlus 或 Upgrade）者可选，仅主动短技能，Normal WIP。普通 HD 不获得该能力。
- 指定落点后结算检查整个圆模板属于有效黑客区域，支持自身与友方有效中继器；成功 Conclusion 生效。只阻挡 MSV 或 Marksmanship，普通单位可穿透。
- 持续至 States Phase；期间施术者 `nfbWhiteNoise` 禁用已实现的 Mimetism。其他尚未实现的 NFB 能力没有因此宣称已支持。

### 已验证与边界

- 自动回归覆盖无 LoF ARO 拒绝、宣告不预量、最新距离、烟雾胜负及多射手、MSV 与 Eclipse、普通迪斯科、反应烟雾、耗材共享、水平落点、迷彩限制、白噪声与区域生命周期。
- 浏览器实测：主动烟雾胜出直接结束无需过保；投射球后清区保球、WIP重激活；白噪声；整令推测投掷和敌方 Targetless ARO。
- 几何仍是二维底盘与采样轮廓模型。烟雾区域按水平／竖直实体地形裁切视线，但圆形标识仍显示模板轮廓；复杂阳台、密闭室内抛射轨迹、非矩形建筑不作赛事裁判工具。跨多个中继器的整圆包含采用密集采样，单节点包含使用解析距离。
- **尚未开放** Cybermine 的专属 Reset−3、CrazyKoala／MadTrap 的 Boost 路径、WildParrot Perimeter、Armed Turret 自动 ARO、Ancillary、D-Charges、Deactivator 摧毁敌装置。它们没有以普通 Mine 假冒实现。当前 Mine Dispenser 仅 Shock 配置，其他弹种配置需另接入。

官方证据：
- https://infinitythewiki.com/Place_Deployable
- https://infinitythewiki.com/Traits
- https://infinitythewiki.com/Drop_Bears
- https://infinitythewiki.com/Pitcher
- https://infinitythewiki.com/Mine_Dispenser
- https://infinitythewiki.com/Mines
- https://infinitythewiki.com/Weapon_Chart
- https://infinitythewiki.com/Speculative_Attack
- https://infinitythewiki.com/Intuitive_Attack
- https://infinitythewiki.com/Smoke_Ammunition
- https://infinitythewiki.com/Eclipse
- https://infinitythewiki.com/Disco_Baller
- https://infinitythewiki.com/White_Noise
- https://infinitythewiki.com/Visibility_Conditions
- https://infinitythewiki.com/Multispectral_Visor


## v24 · 地图标记与自动跳跃（2026-10-20）

- 地图状态改为 0.68″ 小图标，最多每行四枚；鼠标靠近人物或标记隐藏，标记不接收点击。完整状态仍在侧栏显示。
- 跳跃点击落点后识别地面／屋顶高度，计算避开实体建筑的抛物线，不再手填弧高。使用实际三维轨迹预算，保留完整底座落点检查。当前仍是离散采样的圆柱模型与抛物线路径，不能等同实体模型的所有姿态或跨越特例。
- 普通攀爬重复点击会替换当前规划，避免无意累加登顶与下楼。
- 核对官方现行 N5.3：https://infinitythewiki.com/Climb 与 https://infinitythewiki.com/Jump 。普通两项均为 MOV 第一值 + 2″。Climb 必须起始贴墙，只允许垂直运动，全底座登顶即停；Example 2 分别使用命令接近、攀爬、在楼顶移动。Jump 按实际轨迹计距，接触落地表面即结束。因此不能将“4″ 高度 + 2″ 楼顶步行”作为普通 Jump，也不能将“.5″ 接近 + 4″ 攀爬 + 1.5″ 楼顶步行”作为普通 Climb。

## 2026-10-21：两份完整军表的技能与装备补齐（N5.3 / FAQ v0.1）

本次范围为 `army-examples.js` 的 Military Orders 299/5、Yu Jing 300/5.5 两个精确代码，按 unit/group/option 匹配；不把未匹配配置替换成相似兵种。所有新规则均提供“军表：…”教学入口，使用原军表配置；反制导场景的敌方明确标为教学靶机，因为这两份军表本身没有制导技能。

| 项目 | 主动与反应条件 | 本次浏览器实际操作证据 |
|---|---|---|
| TAGCom | 自动、同战斗组的 TAG；提供者在场且非 Null，不叠加 | 炽天使 Dodge PH12+3=15；专用 GizmoKit PH13+1=14，治疗成功 |
| Blitzen | 配置自带武器；主动 B1/ARO B1，独立 +1SD；Disposable 2 | 主动与 ARO 各掷两骰弃一；命中触发两次半 BTS 过保，失败造成孤立与 IMM-B，不扣生命 |
| Suppressive Fire | 进入状态为主动整令；已选模式 ARO B3、最大24寸，范围内对抗对手−3 | 先整令建立，再切换回合；反应方3骰，主动闪避 PH10−3=7；改用别的技能/状态失效会取消 |
| Total Control | 自带 HD 程序，主动与合法 ARO，目标 TAG/黑客范围 | 黑客成功占据炽天使，换队伍与战斗组，MOV4-4/CC13/BS12/WIP11；原所属方战术阶段花1指挥令恢复 |
| Controlled Jump | EVO 主动短技能/合法ARO；敌方战斗空降提供全场特殊ARO，PH前立即生效 | 无视线的远处 EVO 先宣告；虎战士按 PH12−3=9 掷骰；EVO不能再做落地反应 |
| EVO其余支援 | 辅助射击、强化反应、仙尘均主动整令；前两项限制友方REM及黑客范围 | 页面施放辅助射击获得神射手；替换为强化反应后神射手消失、ARO B2；仙尘选择REM获得Firewall−3 |
| Cybermine | 放置使用自带库存及正常 Place Deployable 条件；触发时只用Reset避免，附加−3 | 鸦眼放雷，切换回合条顿触发；Reset失败后两次BTS过保，IMM-B而不扣生命；Dodge不能避免电子地雷 |
| Armed Turret | Perimeter：完整在ZoC内且有可达放置路径；自身只可对主动敌方模型作射击/近战ARO | 监护使在3寸外放炮塔；换回合显示射手步枪B3，不能闪避、重置、攻击迷彩，不能装填 |
| D-Charges | 爆破为主动短技能，接触合法IMM/Null模型自动命中；近战可主动/ARO，CC−6；共享3次 | 爆破无需命中骰，AP+EXP三次半ARM过保；近战实际CC15−6−3=6对抗条顿 |
| Infiltration | 部署时己方半场免检定；敌方半场PH−3且不能进敌部署区，失败回己方桌边 | 两份完整军表的部署流程中，圣三一掷10对SV8失败；清除标记与关联部署物，返回桌边后完成部署 |
| Terrain | 匹配类型第一MOV+1；不匹配接触即停止本命令，下令在内移动−1；多类型部署时选一 | 孤胆山地第一段5寸、第二段4寸；条顿从外进入停边界、第二段预算0 |
| HoloMask | 部署自动可选；重新进入仅主动整令且敌视线外；不复制装备/黑客身份，不允许迷彩式延后 | 骑士指挥官伪装监护使，名册变外观、真实动作不变；宣告闪避解除 |
| ECM Guided−6 | 自动仅保护持有者；制导必须是攻击者自带技能、主动轮、Targeted目标、B1、每回合5次 | 明确标注的制导教学靶机攻击炽天使，BS8−3射程+3标记−6ECM=2；Reset WIP13−3=10，成功取消标记、无命中跳过过保 |

实际网页操作使用浏览器点击、选择、地图落点和掷骰动画，非仅单元测试。随机骰用作普通实测，固定骰仅在页面明确勾选后用于重现特定成功/失败分支。修复了 Reset 对抗平局的骰面显示，双方抵消不再显示为普通成功。

官方依据：
- https://infinitythewiki.com/TAGCom
- https://infinitythewiki.com/Suppressive_Fire_State
- https://infinitythewiki.com/Possessed_State
- https://infinitythewiki.com/Total_Control
- https://infinitythewiki.com/Controlled_Jump
- https://infinitythewiki.com/Supportware
- https://infinitythewiki.com/Cybermines
- https://infinitythewiki.com/Armed_Turret
- https://infinitythewiki.com/D-Charges
- https://infinitythewiki.com/Infiltration
- https://infinitythewiki.com/Terrain
- https://infinitythewiki.com/Difficult_Terrain
- https://infinitythewiki.com/HoloMask_State
- https://infinitythewiki.com/BS_Attack
- https://infinitythewiki.com/ECM

边界保留：共享本机教学屏幕不具备双账号私密信息隔离；普通 Hardlock 建筑没有任务指定的可破坏数值，爆破不会随意删除建筑。炮塔可达性当前使用同高度地面路径。制导对封闭空间依赖地形的 enclosedRoom 标记，当前默认室外地图无封闭房间。合法火力组完整编成与整队同步激活仍不是本次技能补齐的实现范围，现有火力组奖励实验不等于完整火力组系统。

最终完整军表网页回归：两份军表均无未匹配技能/装备提示。先攻第一次红17/WIP13、蓝18/WIP17，双方失败正确重掷；第二次红13暴击、蓝9成功，红方胜。红方保留先手，蓝方选北侧及红方先部署；依次完成红/蓝主要部署与红/蓝保留模型。进入第一轮后 MO G1=10、G2=4、Lt=2，YJ G1=7、G2=7、Lt=0。自动化回归另有275项通过，与以上人工网页操作分开记录。

## 2026-10-21：按任务与单位技能优化部署操作

当前任务仍为 ITS18 Hardlock：普通部署深度12寸，控制台与信标位置来自任务；单位的深入部署、潜入及桌外空降选择分别决定自己的合法范围。部署规则统一检查完整底盘、桌面边界、建筑支撑、任务目标接触、敌方/中立模型接触和 HVT。部署计算显式接收任务部署深度、敌方部署深度和禁部署区，当前 Hardlock 无额外禁部署区。

操作改进：
- 地图旁新增部署工作台：按战斗组选人，显示当前单位区域、状态、确认进度。部署方式、俯卧、朝向在同一位置调整。
- 普通、深入部署和潜入的区域分别高亮；虚线是底盘中心可用边界，悬停落点逐项校验。屋顶候选逐一检查整底盘支撑，与有无攀爬技能无关。
- 推荐预摆按控制台通路、角色、实际掩体边缘、同方模型间距分散站位。任务专家偏向控制台通路、远程火力及指挥/后场支援偏后场；这是可调整的初稿，并非自动战术决策。贴靠地形是否形成有效掩体仍取决于实际攻击方向和轮廓。
- 提供三处地面或屋顶候选；采用后仍需确认。支持“确认此单位→下一位”及“检查并采用本阶段全部当前落点”；未完成确认不能交接部署。
- 本方主要部署时可在地图调整 HVT，标出Y16–32寸允许带，确认完整底盘距部署区至少4寸、在地面且不与地形/模型重叠；主要部署交接也要求确认 HVT。
- 潜入开关、PH检定、失败返回己方桌边均在工作台可操作。敌方半场的落点在检定前不能确认；失败后只保留模型部署选项。
- 选桌外的空降兵不显示地图落点，不生成开局公共命令。附属模型继续按局中放置规则处理。

浏览器实际回归：重新导入MO及玉京→掷先攻→选择先手及北/南部署区→选择候选并确认炽天使→持杖廷卫部署4寸屋顶、俯卧并调整朝向→手动将红方HVT移至(5.9,21.9)并确认→玉京孤胆切换迷彩，显示0–16寸深入部署→虎战士选择桌外→圣三一保留模型扩展至敌方半场并选合法落点，PH−3掷10/SV8失败，界面阻止直接确认，返回己方桌边后通过→流星保留在桌外→完成四个部署步骤并开始游戏。最终MO G1=10/G2=4/Lt=2，YJ因虎战士和流星在桌外为G1=6/G2=6/Lt=0。另有279项自动化回归通过。

官方依据（当前wiki标注N5.3 / FAQ v0.1）：
- https://infinitythewiki.com/Initiative_and_Deployment
- https://infinitythewiki.com/Forward_Deployment
- https://infinitythewiki.com/Infiltration
- Hardlock官方任务来源仍见本文开头。

## 2026-10-21：真实军表火力组（N5.3 / FAQ v0.1）

使用官方 Army 当前 103 / 201 编组表及精确配置，不以训练属性或相似单位替代。保存编组表于 dist/fireteam-data.js，生成脚本同时保留后续数据更新入口。

- 用户确认时点：任一方花费下一条命令前，双方回合都能免费解散整组；执行命令中不提供自愿解散按钮。单人脱组按个人命令、不同 ARO、一致性和状态条件自动处理。
- 部署免费编组，须同战斗组、人数、必选成员、FTO 和数量上限均合法；测量一致性后锁定成员部署位置。局中仅本方主动轮命令间花1CT创建，每组独立计费。
- 一条正规命令激活全组，所选成员成为队长；按队长及每名成员分别规划首项移动，然后敌方首次ARO，再逐人第二项移动或队长攻击，再后续ARO，最后同时结算。NCO/战术意识按对应模型激活；个人尉官/非正规命令导致脱组。
- 首技能移动前检查一致性；不能首段移动中提前踢掉暂时离开控制区的成员。闪避、勇气移动完成后再作命令结束检查。Null/孤立等立即脱组；队长离组解散，符合条件的Number 2接任除外；等待Dogged/NWI选择时不抢先判Null。
- 加成按同单位及官方count-as成员数计算，不按总人数。L2为射击额外SD弃骰，不直接增加B；L3发现+3、闪避+1；L4射击使用属性+1；L5第六感。近战不套射击SD。
- ARO每人独立判断资格、武器、目标；同技能绝对多数决定组技能，无多数必须玩家选择。不同武器仍是BS Attack，不同黑客程序仍是Hacking。异议成员在掷骰前脱组；队长异议则全组解散，加成立即更新。主动方先弃SD，反应方后弃。
- 离组成员只在后续状态阶段、原组仍存在且资格及一致性满足时自动归队；已解散组不会复活。

### 两份完整军表与网页操作核验

MO：G1可随机创建5人Core（持杖廷卫、骑士指挥官、Order Sergeant FTO、黑衣修士、监护使），同源L3；G2两名条顿加Montesa FTO可创建3人Haris，同源L2。YJ测试军表没有合法组合，明确拒绝凑队。

已在localhost网页实际操作：完整两军导入、先手检定、四段部署、随机创建上述两组、检查部署锁定、进入游戏、Haris移动→移动仅消耗G2一条正规命令；无攻击直接结束不进入过保。实际射击演练显示队长B2+SD1共3颗，敌方可选其他被激活成员作为目标，命中后对实际目标过保，监护使昏迷立即离组。反应轮射击2人/闪避1人使异议成员脱组并更新L2；双方SD分别弃骰。无多数1:1在确认处阻止继续，选择射击而队长闪避则立即解散。对方主动轮免费解散已验证；局中再组Haris消耗1CT、正规池不变。

测试：290项全部通过，含真实编组、等级变化、一致性边界、自动归队、队长离组/Number2、反应多数及平票、全组闪避池、旧存档精确配置迁移、远程修复装备SD。

官方核对入口：
- https://infinitythewiki.com/General_Rules_of_Fireteams
- https://infinitythewiki.com/Fireteams_Chart
- https://infinitythewiki.com/Fireteams_in_the_Active_Turn
- https://infinitythewiki.com/Fireteams_in_the_Reactive_Turn
- https://infinitythewiki.com/Fireteam_Integrity
- https://infinitythewiki.com/Fireteam_Bonuses
- https://infinitythewiki.com/Coherency
- https://infinitythewiki.com/Number_2
- https://api.corvusbelli.com/army/units/en/103
- https://api.corvusbelli.com/army/units/en/201

## 2026-10-21：手动创建与重组

火力组管理新增军队、官方编组表/类型、成员复选框及队长选择。选择时只读预览人数、精确配置/状态/战斗组/数量/一致性、当前部署方或主动方、命令执行状态和CT余额，并显示加成与全部收集到的阻止原因。不改变现有编组或消费CT。

可选择已有组员重组；预览明确列出将解散的旧组及未选成员成为独立单位的后果。确认时以临时状态验证并创建，成功才提交，失败不解散旧组且不扣CT。部署免费，局中本方主动轮命令之间1CT，不能在ARO或命令中重组。确认后锁定部署模型；已有锁定模型不能被“靠拢所选成员”重新移动。靠拢是单独的部署调整操作，创建本身不会移动模型。

网页操作核验：真实MO五人Core手选三名同源成员，改骑士指挥官为队长；对方回合界面阻止重组，切回本方后实时L3预览正确，确认重组只扣1CT，原两名未选成员独立。重新导入两军、先手检定、进入部署，选三名Core成员时一致性超范围被阻止；调整靠拢后合法，免费创建成功，队长准确，指挥令保持4。自动测试293项通过。

## 2026-10-21：双入口与任务选择

首页划分“真实比赛”和“教学演示”。真实比赛先选择ITS18任务（Hardlock／Annihilation，当前48×48桌面、300点级），随后强制双方导入、先手检定、权利选择、主要/保留部署、火力组配置、开始游戏。导入任一军表保留任务选择。比赛及教学分开本地存档，首页可继续各自进度。

教学目录支持分类、关键词搜索、FAQ专题；每例固定单位/阵营/装备/起点。默认随机骰，可显式开启固定教学骰，独立重置。禁止在教学中导入军表覆盖固定配置，隐藏非任务教学的计分及HVT/目标，任务交互教学例外。

Annihilation核对2026-10-21官网ITS18当前链接整册（/tmp/infi-its18-current33.pdf，页125–128，官方文档内部Version2026.09.11）。官方目录https://experience.corvusbelli.com/en/infinity/its链接任务https://experience.corvusbelli.com/en/game-content/9c6c05c2-420e-4264-8a3e-ce9704dd5c98。无HVT/机密牌，不采用Retreat，第三轮结束。300点级击杀和己方存活点数各75–150计1分、151–250计3分、>250计4分；击杀敌尉官2分。Dead即时计已击杀；终局Null及未部署模型计被击杀。局中仅预估，附属/诱饵/部署物不重复计军表点数。

网页实测：首页两入口、任务选择、歼灭战导入MO后任务保留、FAQ目录筛选与固定场景加载/重置、教学隐藏导入及非任务计分、返回继续比赛保留任务/军表、Hardlock新局返回强制双军表门槛。测试295项通过。

## 2026-10-21：炽天使 Super-Jump（+3，喷气推进）修正

修复：Army已导入superJumpBonus=3但旧movement预算错误读取jumpBonus，导致MOV6短超级跳显示8而非9。N5.3短超级跳使用配置加值（本例6+3=9），整令超级跳仍6+4=10，后接Move使用MOV2=4。

删除自动抛物线及其近端除以4t(1−t)抬升公式；贴墙采样曾导致几何抬升和路线长度异常膨胀。改为明确的三维直线分段，按底盘参考点的欧氏距离逐段累计，自动候选包含直线、避开墙体的上升/水平/下降折线，展示并锁定整条路线供ARO判断。仍检查实体碰撞、预算及最终完整水平落点，不模拟弹道或重力。普通跳跃保持水平前进方向；只有配置带Jet Propulsion才开放空中转向点。

喷气推进UI可添加指定高度的空中点、在当前点垂直升降、最后指定自动识别高度的地面/屋顶落点。只有空中点不能确认；清除路径、0寸跳过、联动成员路径均同步处理。新固定场景“炽天使：9寸喷气超级跳”使用原MO军表真实Seraph配置及玉京卫兵遥控机。

官方边界：Jump接触落地表面即结束，之后另宣Move；普通Climb须先接触垂直面、完整底盘登顶即停止，不能把剩余Climb距离当屋顶Move。Climbing Plus沿墙Move与普通Climb不同。本次保留这些条件。

网页实测：真实配置9寸预算；4寸上升+5寸水平示例显示9.00/9、落在Z4并进入ARO；直接点击预算内屋顶落点正常；4寸升空后增加空中转向点、再选屋顶，总8.16/9并成功确认；未选落点时阻止确认；跳后第二项Move为4寸。普通Climb点击相接触4寸楼，4.98/6登顶Z4，确认ARO后直接整令结算而无第二项行动。测试300项通过，含截图位置的屋顶回归、真实配置加值、转向限制、草稿落点及距离累计。

来源（当前N5.3／FAQ0.1）：https://infinitythewiki.com/Super-Jump 、https://infinitythewiki.com/Jump 、https://infinitythewiki.com/Climb 。

## 2026-10-21：零能见度近战与半底盘窄通道修复

官方依据（本次在线核对 N5.3 Wiki）：
- https://infinitythewiki.com/CC_Attack ：近战要求对应近战武器与轮廓接触。
- https://infinitythewiki.com/Line_of_Fire 与 https://infinitythewiki.com/Engaged_State ：交战双方不受能见度条件或其他视线规则影响。烟雾/Eclipse 仍阻断未接触单位的普通视线。
- https://infinitythewiki.com/Disco_Baller ：迪斯科球产生 Eclipse 区域。
- https://infinitythewiki.com/Move ：经过表面至少半个底盘宽，结束时须容纳完整底盘；两次 Move 不能用第二次的合法终点补救第一次的非法终点。
- https://infinitythewiki.com/General_Movement_Rules ：绕行距离计入移动，敌人与障碍之间须留完整底盘宽。

实现：物理轮廓接触独立于区域视线判定，实体墙仍阻止近战；近战不再叠加区域 -6。合法交战接触恢复反应方的接触视线，避免错误无视线闪避惩罚。半宽窄道内允许添加路径途经点，确认每项移动仍执行完整终点检查；火力组/附属同步移动也使用相同逻辑。窄道及出口附近提供轻微中心吸附，防止像素点选偏差在精确 12.5 mm 通道中提前截断。孤立实心墙角继续保留完整底盘碰撞。

新增教学：smokeCC、eclipseCC、narrowPassage，均使用明确的场景配置。

本地网页人工验证：
- 烟雾：移动到接触，蓝方选择近战 ARO，主动方选择近战并选定蓝方，双方掷骰均为 SV15，实际完成拼骰、过保与返回结算。
- Eclipse：移动到接触，双方宣告近战，进入结算预览，主动 CC15 保持15，无区域惩罚。
- 25 mm 底盘 / 12.5 mm 窄道：实际点击内部途经点，尝试确认被终点重叠检查拒绝；继续点击出口，在约3.7寸内穿过并确认进入首次ARO。验证时还发现并修复出口微小横向点选偏差造成截断的问题。
- 回归测试：306项全部通过，包括烟雾/Eclipse/白噪声近战、区域外射击阻断、隔墙禁止近战、精确半宽通道、出口偏差、过窄通道与敌人阻挡。


## 2026-10-21：FAQ 0.1 与楼顶视线复现

官方目录：https://infinitythewiki.com/Category:N5_FAQ_0.1 。28 个关联页面去除重复问答后，本轮核对九项；不代表所有版本 FAQ 已完成。

教学目录新增「FAQ 0.1：九项规则算例核对」，进入 `faq.html` 可逐项或全部复现，显示预期、实际、通过状态与官方来源。

| 算例 | 本轮结果与范围 |
| --- | --- |
| 目标位置在结算时选择 | 路径点保留 Z 与姿态，核心算例通过 |
| 标记被命中后揭露 | 实际轮廓全掩体时取消命中与过保，已接入过保入口 |
| 协同／饱和与 SD | B 与 SD 分开计算；尚无完整多人协同 UI |
| 投射部署物表面 | Disco、Drop Bears、地雷与中继器拒绝垂直面及悬空，接受完整支撑屋顶 |
| 控制者与附属模型 | Stunned、IMM-A/B 分别检查行动资格，核心算例通过 |
| 必选成员离组 | 已组火力组保留；FT Master 指定成员限制为例外，使用显式训练配置 |
| Haris 减员 | 三人减至两人保留 Haris，减至一人解散 |
| 黑客设备防火墙 | 正常有效，孤立／Null 后设备提供的防火墙失效 |
| Ancillary 击杀资格 | 未部署不计击杀，已部署后 Null 在终局计入；未覆盖全部 ITS 自动计分 |

实际网页验证：点击运行全部九项，所有结果通过；页面无控制台错误。楼顶场景实际执行地面 Move、屋顶射击 ARO 宣告，剖面显示 Z4→0 与已选 ARO 路径点。修正视线只从横向采样的问题，现包含朝向目标的轮廓边缘；退后屋顶遮挡有独立回归算例。视线为有限采样，异形地形和模型遮挡仍有近似。

本地 `npm test`：318/318 通过。FAQ 网页算例属于规则函数复现，不能冒充九场完整比赛的端到端验证。


## 主动轮多目标分枪（2026-10-22）

依据官方 N5.3 BS Attack（https://infinitythewiki.com/BS_Attack）和 Weaponry（https://infinitythewiki.com/Weaponry）。普通无模板 BS 模式新增多目标分枪：宣告时分配正整数 B，合计不可超过当前实际 B／剩余使用次数；使用同一武器、模式、弹药与攻击位置。宣告后锁定。每个目标独立计算距离、掩体、拟态及拼骰修正，独立主动骰池、抵消、命中、过保；没有被分配射击的 ARO 不会被其他目标的骰子抵消。超射程时只使对应分配失效，不转移给其他目标。模板与制导仍走原专用流程，此次未扩展多枚模板分配。

SD逐颗指定目标，只在该目标骰池额外掷骰／弃骰；主动方先弃，再轮到反应方。SD不增加B，不增加Disposable消耗。多人分枪记录保留每组骰值、成功值、弃骰、拼骰和过保。

实际网页操作验证（本地服务）：
- 教学「主动轮分枪：B4分2＋2」：双方先宣告复合步枪ARO；红方重机枪对甲2B／乙2B，锁定分配。甲无拟态SV14，乙拟态−3 SV11。主动骰甲[8,10]、乙[20,6]，各对抗自己的ARO[3]／[2]，分别造成2／1次命中，分别2／1次ARM过保，最终甲受2伤移除、乙受1伤昏迷；记录4主动骰＋2反应骰。
- 教学「主动轮分枪：SD指定与弃骰」：未指定SD时宣告按钮禁用。将1SD指定给乙后，甲2骰／乙3骰；未弃骰时比较按钮禁用。从乙[20,6,9]弃20，甲骰不变；分别命中2／2次，独立过保与伤害。完整执行至最终战报，控制台无错误。
- 使用固定教学骰验证流程，普通模式默认仍为随机d20。

回归覆盖：2＋2独立修正／抵消、单组失败不影响另一组、SD专属弃骰、多SD分配、B超额／重复／友方目标拦截、宣告不预量、超射程局部失败、未被攻击的ARO正常检定、Disposable预算。具体测试结果以最新Actions为准。
