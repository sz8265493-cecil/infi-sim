# 第95轮：附属模型的一致性与自动断连

2026-10-23。依据官方N5.3 [Peripheral](https://infinitythewiki.com/Peripheral)、[Disconnected](https://infinitythewiki.com/Disconnected_State)。

通用修复：同步型起始/结尾检查控制区；附属类型共同处理控制者Null/孤立、自身孤立。追踪自动断连原因，条件解除后取消；外部攻击造成的断连不会被距离检查误清。断连按Null排除行动与供令，所有附属不产生额外正规命令。起始主动与反应检查分别处理对应一方，避免把主动模型第一段移动后的暂时超距当作结尾。面板不再把所有附属硬写为炽天使的Ancillary，而显示实际类型、控制者与配置说明。

真实Chrome：
- syncStart95：控制者开始时附属超距，立即断连，不能跟随。控制者右移4寸、第二项Idle；结束恢复连接。
- syncEnd95：开始时合规，控制者左移3.93寸、附属原地，首项结束仍正常；第二项Idle结束才断连。下一令控制者右移3.92寸，结束恢复。
- servantNull95：15寸远Servant不因距离断连。控制者Idle+Idle，敌步枪8命中、过保20失败昏迷；未激活的救援医生完成Alert后，命令末仆从断连，按钮禁用。再用救援医生Idle+Doctor，8/SV13救醒控制者，结束仆从自动恢复，重新可用控制者命令。

474项回归和64JS语法通过。截图`/Users/bytedance/Documents/tt/infi-peripheral-reconnect-95.png`。Control先锋选择、Cyberplug双配置、多个Servant一次只激活一个及完整独立攻击仍须后续适配，不把本轮判为所有附属类型完成。无Git同步。
