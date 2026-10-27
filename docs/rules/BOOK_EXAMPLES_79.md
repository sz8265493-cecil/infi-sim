# 第79轮：外围部署与Boost（仅本地）

依据2026-10-23官方N5.3 [Perimeter Weapons](https://infinitythewiki.com/Perimeter_Weapons)、[Place Deployable](https://infinitythewiki.com/Place_Deployable)、[WildParrot](https://infinitythewiki.com/WildParrot)。不使用重定向页中缓存的旧版标头作为版本依据。

新增CrazyKoala、FastPanda、WildParrot的精确装备入口。Boost只命中一个触发模型，寻找完整轮廓可通过的路线，不套用泪滴范围；触发后不再以射击击毁取消攻击，只能普通Dodge避免，结算后移除。Aerial、伪装标记、部署物不触发。FastPanda使用外围部署与Indiscriminate，命令末才生效。WildParrot使用外围部署，放置后仍按E/M地雷结算。

实际Chrome操作：

- `boost79`：目标隔有限高墙宣告Idle，立即记录绕行路径并在地图标出。目标Dodge骰8，基础PH13，对部署武器SV10成功，无过保，装置结算移除，进入2寸闪避。
- `boostFail79`：Dodge20失败，产生1次Shock ARM过保，ARM1+PS5=SV6，20失败受1伤；不进入闪避移动，Courage坚守；地图确认Koala已移除。
- `boostSealed79`：四墙加实体屋顶的密闭室阻断路径。Idle+Idle无触发、无骰、无过保。
- `boostAerial79`：Aerial模型在ZoC宣告Idle+Idle，无触发；地图仍有Koala。
- `perimeterPlace79`：FastPanda选择20/23附近、与本人20/28不接触；敌方迷彩在附近不妨碍Indiscriminate。无掷骰，命令末生成FastPanda，库存0/1，显示弹药耗尽。

路径引擎使用矩形实体、完整圆柱以及地面/屋顶高度节点。有限高开放障碍可绕行或越过，封闭顶板不能穿透；不规则几何仍不在支持模型内。WildParrot已接通但独立网页命中分支仍待验收，不在上述通过项中。

截图：`/Users/bytedance/Documents/tt/infi-perimeter-79.png`。未同步GitHub。
