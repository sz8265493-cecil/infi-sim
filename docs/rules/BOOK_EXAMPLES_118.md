# 第118轮：隐匿占位与全息模板

2026-10-27，真实Chrome，http://localhost:4173/；仅本地，未同步GitHub。

## 官方依据

- [Hidden Deployment State](https://infinitythewiki.com/Hidden_Deployment_State)：登记位置被其他模型占据时，在最近且不接触其他模型的位置放置；本回合不补回公共命令。
- [Surprise Attack](https://infinitythewiki.com/Surprise_Attack)：减值作用于对应面对面ARO，不能给直射模板对应的普通Dodge施加减值。
- [Holoecho State](https://infinitythewiki.com/Holoecho_State)：延后反应须等待真实持有者解除状态，假体不能变成延后反应的合法真身目标。

## 网页执行

| 场景 | 结果 |
|---|---|
| hiddenOccupied118 | 友军与隐匿位置重叠，隐匿保留命令Idle揭露；就近移开约1.01寸，不接触占位者，第二Idle完成。 |
| hiddenEnemy118 | 敌军占位同样就近移开；没有凭空进入近战；对手放弃ARO、第二Idle完成。 |
| hiddenARO118 | 主动模型在控制区内Idle；隐匿模型无LoF但能Reset ARO。显形避开登记位置上的模型，第二Idle；Reset SV13骰8成功，零命中，跳过过保。 |
| holoTemplate118 | Idle后三回声保持，防御者Delay；主动轻喷揭露后防御者选Dodge。记录明确Normal、SV12、骰10成功；无过保。闪避选择留在原地，结束后地图只剩a0/b0，假回声已移除。 |

最初hiddenARO测试夹具将主动模型放在控制区外且视线被占位模型阻挡，正确地没有ARO；已修正夹具位置到控制区内后重跑，不能将旧夹具没有ARO判作程序错误。

## 实现

新增hidden-placement.js，在记录高度上计算最近可放置位置，避开模型接触、地形实体、桌边及无支撑位置。主动显形与反应显形共用。没有合法位置时保留隐匿并显示错误。隐藏模型不再被重叠模型误判为Engaged。

## 尚未完成的精确配置能力

本地army-yujing.json/army-103.json的ambiguousProfiles条目没有完整多形态属性。向官方Army接口请求补齐数据返回HTTP403；未使用推测属性替换。混合Synchronized+Ancillary的includes数据虽有部分原始配置，导入器仍只支持现有Ancillary子流程；多附属数量、部署时点、计分拆分及UI需要整体接入，不能仅生成模型后宣称完成。

仍需验证隐匿直接激活时的Surprise资格保留，以及多个隐藏回声同时被占位、找不到合法点时的整组原子显形。现有四个病例不能外推这些边界。
