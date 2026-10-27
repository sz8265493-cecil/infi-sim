# 第117轮：跨层区域与区域叠加

2026-10-27，真实 Chrome，http://localhost:4173/。教学入口选择场景，手动开启固定骰，逐项宣告和结算；没有注入对局状态。仅本地，未同步 GitHub。

## 官方依据

- [Smoke Ammunition](https://infinitythewiki.com/Smoke_Ammunition)：无限高区域仍受实体地形截断。
- [Visibility Conditions](https://infinitythewiki.com/Visibility_Conditions)：最严重能见度修正，不累加；Dodge 不受该减值。
- [Saturation](https://infinitythewiki.com/Saturation)：分配目标后每目标减1B，至少1B，重叠不叠加。

## 网页执行证据

| 场景 | 实际操作和结果 |
|---|---|
| smokeDeck117 | 地面烟雾、上层两模型，封闭楼板；Idle→射击，MSV1的SV15，没有错误减6，完成结算。 |
| smokeOpening117 | 楼板开口透烟；相同流程SV9，完成结算。 |
| eclipseDeck117 | 封闭楼板截断Eclipse；楼上SV15，完成结算。 |
| eclipseOpening117 | 开口透Eclipse；无合法视线，攻击按钮不可用；返回第二技能，Idle结束命令。 |
| terrainStack117 | B4分2+2，SD分给乙；两个叠加能见度区域只取−6，两层饱和每目标各减1B。甲骰5，乙骰6/20弃20，SV8；两目标过保1/1。 |
| terrainStack117移动回归 | 重置后Move可用3寸（MOV4减困难地形1）；点击范围外目标裁剪为3寸。第二技能Dodge，PH10无能见度减值，骰1成功；闪避仍2寸，选择留在原地完成。 |

## 修复

区域查询统一包含场景terrainAreas，支持矩形能见度/饱和区。烟雾修正与阻断检查使用考虑楼板的实际视线。普通分枪先分配B，再按目标扣饱和；不会先把总B减1再分配，也不会扣掉SD。纯能见度区域可通过difficult:false避免意外降低MOV。

## 边界

上述矩形楼板/开口和区域组合已验证，不代表任意曲面或斜桥的精确体积运算。显式逐模板分配的饱和组合仍待单独验证；本轮分枪病例是普通BS武器。射线采样仍有几何近似。
