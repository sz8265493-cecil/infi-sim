# FAQ V0.1 全文主题索引

来源：用户提供的eng-faqs-n5-v0-1.pdf。正文印刷页1–4（PDF页2–5）。按问答主题归并为以下37项；不是按问号计数。表中“已有算例/代码”不是本轮重新通过完整网页操作的证明。

| ID | 正文页 | 裁定要点 | 当前核对/适配状态 |
| --- | --- | --- | --- |
| F01 | 1 | 主部署阶段可重摆；涉及测量/掷骰后位置锁定，火力组一致性调整后成员锁定 | 部署模块有相关实现，须按全文例子核验 |
| F02 | 1 | Minelayer ZoC及Decoy/Holoecho一致性必须检查，对手回避私密测量 | 有部署逻辑；私密信息与本地双人UI需专项审查 |
| F03 | 1 | 技能细节宣告时指定；目标路径位置在结算、测范围前选择 | 已有算例，信息时点仍需端到端审查 |
| F04 | 1 | 带Movement标签可进入/取消Prone，Jump/Berserk除外 | 有姿态/预算逻辑，需检查所有行动例外 |
| F05 | 1 | 终点才Prone不减本次移动距离 | 已有教学例及相关测试 |
| F06 | 1 | Climb/Jump也适用vault规则 | 有部分移动几何，不能视作所有翻越图例通过 |
| F07 | 1 | BS Attack Roll/标签沿用对应BS修正；整令不适用SD | 部分已接，直觉/推测通用攻击未完整 |
| F08 | 1 | 直射模板不能拐角命中不在发射者LoF的副目标 | 有视线/模板逻辑，复杂几何待专项复现 |
| F09 | 1 | Controlled Jump不影响Speedball | Speedball流程缺失 |
| F10 | 1 | 设备Firewall对所有Comms Attack适用；设备被孤立/Null失效时不适用 | 已有规则函数算例 |
| F11 | 1 | 投射部署物必须完整受支撑，不能放竖直面 | 已有四类投射物算例 |
| F12 | 1–2 | 部署落点在结束阶段被模型占据，可按规则改放，无法放则丢失；投射部署物同理 | 已有改放流程，完整场景仍需核验 |
| F13 | 2 | 多人Surprise Attack不叠加到同一目标；每人分别适用 | 有修正逻辑；多人协同UI不足 |
| F14 | 2 | MSV1＋Sixth Sense受穿烟BS攻击时忽略−6 | 视线/修正有实现，需与普通MSV1分开测试 |
| F15 | 2 | 标记状态下使用会改变激活/限制ARO的自动技能装备须宣告，如Stealth | 需补明确宣告与私密信息审核 |
| F16 | 2 | Protheion不能从超过Dead所需的多余失败保获益 | 非本轮既有九项；待查实现/单独场景 |
| F17 | 2 | Camo(1Use)模型部署未消耗标记使用；以标记渗透失败已消耗 | 有部署/迷彩次数逻辑，需专门复现 |
| F18 | 2 | Aerial不能被Boost武器接触，因此不触发 | 待查Aerial/Boost组合 |
| F19 | 2 | 多人激活时ARO可指定Stealth者，但对方未宣告允许ARO技能则反应为Idle | 多人激活/Stealth待专项完整复现 |
| F20 | 2 | 控制者受限时同宣告、逐模型检查，附属可执行而控制者Idle | 已有核心算例 |
| F21 | 2 | 不能在Deployable Cover上放东西或结束移动 | Deployable Cover适配待查 |
| F22 | 2 | 协同命令不改变SD，SD继续适用 | 已有核心数学算例；协同完整UI缺失 |
| F23 | 2 | Disconnected/Unconscious不阻止敌方重新标记，也不破坏谨慎移动条件 | 迷彩部分有逻辑；谨慎移动缺失 |
| F24 | 2–3 | 迷彩标记被命中需保时揭露；实际模型全掩体则不被命中 | 已接入过保前揭露及算例 |
| F25 | 3 | Discover不享受火力组BS＋1或BS Attack＋1SD | 有Discover独立修正，应保留Level3 Discover＋3 |
| F26 | 3 | 减员不改变火力组类型，如Haris两人仍Haris | 已有核心算例 |
| F27 | 3 | 最低必选成员是组建要求，离组不自动取消已组队伍；FT Master例外 | 已有显式训练配置算例；真实导入特殊映射须查 |
| F28 | 3 | HVT等Neutral不阻塞经过移动 | 已允许经过，不允许终点重叠 |
| F29 | 3 | Telemetry/HVT Designation按成功Spotlight次数达成，不要求最终留Targeted | ITS/机密卡自动记分尚非全覆盖 |
| F30 | 3 | 携带任务物不能进入Marker状态 | 已有部分任务物逻辑，须核对所有任务类型 |
| F31 | 3 | Area of Interest：Oppose Activation专属ARO时机与WIP拼骰 | 非当前完整任务流程 |
| F32 | 3 | Crossing Lines：Superior Deployment对Netrod/Imetron例外 | 待接对应任务例外 |
| F33 | 3 | Akial Interference：发射失败的卡仍可再选，成功才消耗 | 对应任务未完整 |
| F34 | 3 | Akial Interference：Predator只计抽卡后击杀 | 对应任务未完整 |
| F35 | 3 | Akial Interference：已用卡的记录方法由玩家选择 | 对应任务需UI记录 |
| F36 | 4 | Crossing Lines鲁莽朝最近敌部署区；不确定可量 | 对应任务例外待接 |
| F37 | 4 | Ancillary从未部署不计Killed；已部署后Dead或终局Null才计 | 已有核心资格算例；全部ITS计分未覆盖 |

需补测的项目保持“待查/待复现”，不能因条目已收录而标成实现完成。原九项网页算例只覆盖此表部分主题。
