# N5 Token 图册索引

来源：infinity-tokens-n5.pdf，9页，全部逐页视觉核对。不同大小、编号、颜色或重复印制不等于不同规则；此表按用途分类。

| PDF页 | 主要内容 | 模拟器映射要点 |
| --- | --- | --- |
| 1 | Regular/Lieutenant；IMM-A/B、Prone、Wound1/2、Unconscious、Disconnected、Power-Up、CAMO变体、Shasvastii Embryo、Unloaded、Targeted | 命令、伤数和状态分别建模；迷彩编号/大小/拟态等级分开；Unconscious不用再用大Prone图标遮住单位 |
| 2 | Shock/Cyber/E/M/AP/Monofilament/Viral/PARA地雷；Regeneration、REMDriver、Irregular/Tactical/Impetuous、Transmuted、Repeater、POS、IMP1/2、支援程序、Isolated、Stunned、Dogged | 部署物不是单位附加状态；程序有效期/范围须有来源；Impetuous激活和命令池不同 |
| 3 | Dogged、NWI、Sepsitorized、Suppression Fire、Active Proxy、Spearhead、Seed-Embryo、Decoy、Foxhole、Dazer、Holoecho、TinBot、Retreat、Core/Haris/Duo队长、任务/补给/独特机器人、Disco Ball A/B | 多人激活类型不能混用；代理/先锋/队长各有规则；部分专名模型有独立实体而非状态 |
| 4 | Disco Ball失活、Deployable Cover(Cutting Foam/Vitae Coral)、较大Holoecho/CAMO、Command Tokens、Consoles、Objectives | 状态变化保留部署物实体；Command Token不是正规命令；任务物/地形独立建模 |
| 5 | Antenna、较大CAMO、Motorcycle、Droppod、圆形区域模板 | 任务标记尺寸按任务；模型/标记与面积模板区分 |
| 6 | 圆形面积模板及泪滴模板 | 用原PDF物理尺寸/路径校验，不能按渲染截图像素直接推导游戏英寸 |
| 7 | 区域模板、Holoecho、Speedball A/B、S1–S5轮廓板 | 轮廓与token不同；Speedball使用规则书5.3流程，不能仅显示图案 |
| 8 | 圆形/泪滴模板、S6/S7轮廓板 | S6/S7分别40/55和55/67毫米（底径/高度） |
| 9 | 区域模板、S8、Narrow/Wide Gate | S8底径/高度70/70毫米；门通行类型按规则，不是装饰图标 |

## 轮廓尺寸（图册pp7–9，规则书p18复核）

| S | 底盘直径mm | 轮廓高度mm |
| --- | ---: | ---: |
| S1 | 25 | 25 |
| S2 | 25 | 40 |
| S3 | 40 | 32 |
| S4 | 55 | 32 |
| S5 | 40 | 45 |
| S6 | 40 | 55 |
| S7 | 55 | 67 |
| S8 | 70 | 70 |

规则书另外定义S0为25mm/3mm；Prone使用SX，即保留自身底径、3mm高度，不是把任何单位底盘都缩成25mm。

当前引擎BASE/HEIGHT具备S0–S7，S8缺项需修复。本轮只登记，没有声称几何代码已改。

## 图标展示原则

- 原图案含语义，保留官方图形与编号含义；阵营用外框/队伍UI区分，避免覆盖伤数和状态颜色。
- 地图图标应紧凑、不拦截模型/路径点击，完整名称/规则来源可悬停展示；这是已有用户界面要求，不是PDF规定。
- Unconscious II通常由对应额外昏迷规则与标记组合表达，不把图册不存在的“独立II图案”伪装成官方素材。
- Dead是规则状态但模型移除；Normal/Engaged等界面辅助图形应清楚标明辅助性质，不冒充图册官方token。
- 此轮渲染用于阅读，没有据截图生成替代素材，也没有将原PDF整份上传到网站或仓库。
