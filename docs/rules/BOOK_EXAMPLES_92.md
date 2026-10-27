# 第92轮：主动模板闪避的无视线修正

2026-10-23，仅本地。依据官方N5.3 [Template Weapons and Equipment](https://infinitythewiki.com/Template_Weapons_and_Equipment)，没有视线时闪避模板为PH−3。

修复主动方原来仅直射模板计算该修正、圆形模板遗漏的问题；协调/火力组/附属联动者分别按自身视线计算成功值，保留各攻击者对应的值。补齐联动骰池修正资料，骰子UI兼容无mods记录，修复实际测试中抛错而打不开骰子面板的问题。

真实Chrome：
- impactBlind92：背向者Idle→敌圆模板ARO→主动闪避。PH13减3为SV10，骰12失败、敌8成功；3次EXP过保均1成功，无闪避移动，勇气后结束。
- impactLinkedBlind92：两名协调成员Idle→同一导弹→闪避，前向者12/SV13胜导弹8，背向者12/SV10失败，只有后者3次EXP过保；前向者获得移动资格并选择原地，后者勇气结束。面板首次报错后修复，刷新保留12/12/8，继续完成，未重掷替换。

468项自动回归通过。截图`/Users/bytedance/Documents/tt/infi-impact-dodge-92.png`。未同步GitHub，任意多来源MOD组合不因此视为全部人工验收。
