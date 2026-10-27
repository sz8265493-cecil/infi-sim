# 第77轮：G:Jumper（仅本地）

官方：[G:Jumper](https://infinitythewiki.com/G:_Jumper)，2026-10-23核对N5.3。

已接通每组只供一个正规命令、主动选择代理体、ARO只允许一个正常反应者、其他代理体仅Dodge/Reset、失能后的标记转移，以及主动代理体图标。状态/伤口/弹药仍逐模型记录，切换标记不会自行揭露伪装。

本地Chrome实操：

- `proxyARO77`：红方Idle，选择Mk2为主动Proxy；Mk2可选武器，Mk5只能Dodge/Reset。Mk2射击骰8/SV16、Mk5闪避10/SV13分别成功。目标过保1，Mk5进入2寸闪避阶段后选择留在原地。下一蓝方回合两个Proxy合计1正规命令。
- `proxyActive77`：Mk2完成一条Idle+Idle，再选择Mk5完成另一条。主动代理体标识随激活移动，未同时激活两个模型。
- `proxyLost77`：Mk2为主动Proxy并放弃ARO，N命中8、过保20，进入昏迷。命令末明确选择Mk5接过标记，下一蓝方回合仍提供1正规命令。

自动测试另验证全部Proxy空状态/孤立时不供令，以及整组改变combatGroup。**战斗组转移尚未完成专门网页UI验收；官方Combat Jump原图的空降+两Proxy联动仍待独立验收。** 精确多Proxy军表配置不足仍拒绝导入，未猜配。

截图：`/Users/bytedance/Documents/tt/infi-proxy-77.png`。未同步GitHub。
