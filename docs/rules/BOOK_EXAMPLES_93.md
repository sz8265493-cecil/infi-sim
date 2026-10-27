# 第93轮：射击放置类的占位FAQ

2026-10-23，官方N5.3 [Place Deployable FAQ](https://infinitythewiki.com/Place_Deployable)明确包含Pitcher、Drop Bears及Disco Baller。三个新增教学均在真实Chrome逐项操作，不修改通用结算。

共同顺序：Idle→敌Dodge ARO→主动投射至约(21.3,28)→双方8普通成功→无伤害而直接闪避→敌实际移动1.98寸占原落点→命令末出现重新放置→点击(20.1,26.8)后确认。无需重掷或重复消费。
- pitcherOccupied93：改放后生成可部署中继器，下条命令起生效。
- dropBearsOccupied93：改放后生成明置地雷，地图显示M而非迷彩。
- discoBallerOccupied93：改放后生成球及Eclipse；携带者显示剩余1/2。

第一遍Pitcher用约20.99贴边落点，实际鼠标舍入与发射者重叠，因原宣告位置非法而直接失败；未将其算作占位FAQ通过，留出明确净距从头重跑后得到正确改放流程。

468回归与64JS检查通过。证据`/Users/bytedance/Documents/tt/infi-deploy-occupied-93.png`。仅本地，未同步GitHub。此轮不声称遍历任意双发/三维落点组合。
