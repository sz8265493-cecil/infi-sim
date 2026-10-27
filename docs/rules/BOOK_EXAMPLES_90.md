# 第90轮：部署占位FAQ、迷彩与昏迷友军地雷

2026-10-23，仅本地。依据官方N5.3 [Place Deployable FAQ](https://infinitythewiki.com/Place_Deployable)与[Mines](https://infinitythewiki.com/Mines)。

真实Chrome操作：
- deployOccupied90：红方Idle，敌Dodge ARO，红第二项放中继器在相邻右侧。敌8/SV10成功，实际闪避1.98寸占据原位置。命令末要求改放；改本人上方成功，仍只消耗一次，库存2/3。
- deployLost90：三面厚墙槽内重复同样顺序。原相邻空位被占后，尝试上方被实体墙拒绝，选择损失；无新实体、库存2/3。首次场景净空太窄使鼠标落点先碰墙，未计为FAQ通过；加宽净空后从头重跑，确认原放置合法、确因后续闪避占位进入改放。
- mineCamo90：第一令迷彩Idle+Idle，敌延后失效，地雷仍在。第二令Idle、敌延后、主动BS揭露，立即触发地雷，敌放弃。主动8/20/20命中1，敌ARM1成功；自己地雷过保20失败受1伤，两人勇气后结束，地雷移除。
- mineFriendly90：昏迷蓝TAG处于地雷与红方之间，任何能覆盖红方的模板都覆盖该友军。红方Idle+Idle，无触发、无骰、无过保，地雷仍保持迷彩。

性能修复：最后一例首次操作发生多秒卡顿，原因是每个不可能命中的模板角度仍进行完整圆柱采样。现在先用球体/泪滴的保守包围范围排除完全不相交的轮廓，并给每个模板采样点加轮廓边界快速检查；不缩减原采样精度，不增加命中。修复后重新实际完成该例。64个JS语法、462项回归通过。

证据：`/Users/bytedance/Documents/tt/infi-deploy-lost-90.png`。射击放置类武器（Disco Baller/Pitcher/Drop Bears）的被占位分支还未在本轮重跑。未同步GitHub。
