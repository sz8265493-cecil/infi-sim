# 第68轮：空降／地雷／多源Explode、NWI与Remote Presence

日期2026-10-22，仅本地开发与真实浏览器操作；不提交、推送或部署GitHub。

## 规则依据

本轮打开并核对官方Wiki，页面均标示N5.3与FAQ v0.1：
- https://infinitythewiki.com/Explode
- https://infinitythewiki.com/Combat_Jump
- https://infinitythewiki.com/Mines
- https://infinitythewiki.com/No_Wound_Incapacitation
- https://infinitythewiki.com/Shock_Ammunition
- https://infinitythewiki.com/Immunity
- https://infinitythewiki.com/Remote_Presence

特别区分：空降爆炸为PS8 N；地雷按自身武器参数，本例休克地雷PS7 Shock；昏迷Explode为PS7 Shock，来源在本波完成后移除。它们不共享伤害记录，也不互相冒充。

Remote Presence仅对STR提供两级昏迷。正常状态一次受到足够伤害直接进入二级昏迷，可在此时选择NWI；已经昏迷再受伤不能重新选择NWI。NWI再次受伤直接Dead。休克免疫按普通弹药处理，仍需过保、仍会受伤，不等于免伤。

## 已完成的真实网页操作

在localhost:4173，通过教学下拉选择、实际宣告、地图落点、ARO、掷骰动画与过保按钮执行。场景是明确标注的教学技能组合，不修改真实军表配置。

| 场景 | 操作和结果 |
| --- | --- |
| airMineChain68 | 单人空降至约(20,25)，PH7成功。落地触发蓝方地雷，蓝方两单位放弃ARO。地雷对空降者1次PS7 Shock过保1成功；空降PS8 N对蓝源20失败、末端1成功。命令末蓝源Explode使红源过保20昏迷；再下一波红源Explode使末端20受1伤。地雷和两自爆源最终均移除；末端勇气、Alert后结束。 |
| multiMine68 | 红方待机；蓝甲Dodge触发红地雷，蓝乙放弃；红方第二项待机。Dodge20在PH10和地雷PH7均失败。地雷同时命中蓝甲乙，两次20使其昏迷；随后同一波两源各命中一名红方靶机，分别过保20、各受1伤。两源在同波过保全部结束后移除，两名幸存者各自勇气后结束。 |

| nwi68 | 步枪5/20/20命中1次、过保20受伤；选择NWI后无自爆，正确进入勇气。下一命令再次命中受伤，直接移除，无再次NWI或Explode。 |
| shockNwi68 | 实验Shock一发命中，过保20失败：1VITA直接移除，无NWI选择，无Explode阶段。 |
| immuneNwi68 | 相同Shock但军表字段SHOCK免疫：仍受1伤，出现NWI选择。分别重开演练选择启用（保留、勇气）和不启用（PS7 Shock自爆，射手过保1成功，自爆源移除，射手勇气）。 |
| unconsciousTwo68 | 步枪5/6/20两次命中、两次过保20，1STR遥控存在直接进入昏迷II。分别演练启用NWI（勇气、无自爆）和不启用（自爆一发、射手过保1成功，来源移除）。 |

| unconsciousExisting68 | 初始昏迷I的STR遥控存在受1伤进入昏迷II，未出现NWI按钮；下一命令再受1伤，模型移除。两次均通过实际射击、过保按钮完成。 |

| multiCancel68 | 两名自爆体相距2寸，蓝甲Dodge20触发地雷，两次过保20均昏迷。随后两名Explode均覆盖昏迷友军，攻击分别取消、两源都移除；未弹出额外过保窗口，红方均未受伤。 |

## 本轮修复

- 统一休克免疫字段大小写：军表SHOCK与显示名称Shock均按普通弹药处理；状态应用亦采用同样归一规则。
- 地雷读取实际主动成员骰池，并使用公共kept函数排除所有弃骰（包括SD数组）；继续按每个目标自身PH−3判断。
- 生存技能选择后重新加入当前伤害的勇气队列，避免初次伤害时处于昏迷、随后选择NWI/Dogged的幸存者漏掉勇气流程。


## 验证结论与边界

403/403自动回归通过；54个dist JavaScript文件语法检查通过。以上8个教学场景均在真实本地网页通过按钮、下拉、地图落点执行；NWI/免疫/二级昏迷多分支分别重开演练。固定教学骰用于稳定复现边界，正常游戏仍使用随机骰。

截图：/Users/bytedance/Documents/tt/infi-nwi-uc2-68.png。
本轮覆盖空降与地雷同令结算后引发多波Explode、单雷触发多源及友军取消；不据此宣称所有任意组合已验收。自动Explode是否另行触发尚未触发的地雷、任意开放楼板/俯仰的三维组合仍未在本轮验收。

本轮只保留本地改动，没有提交、推送、同步或部署GitHub。
