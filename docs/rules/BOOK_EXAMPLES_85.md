# 第85轮：模型轮廓遮挡视线（2026-10-23）

依据[官方Line of Fire](https://infinitythewiki.com/Line_of_Fire)。模型以实际轮廓圆柱遮挡采样视线；标记、离场模型以及本命令宣告移动的模型不阻挡。模板传播仍只受地形阻挡，模型不提供部分掩体。

真实Chrome、本地4173完成：

- modelLos85：后方S2(20,28)，目标(20,20)，中间静止S7(20,24)。Idle后蓝方只有无视线Dodge/Reset，主动射击显示“没有合法视线”、按钮禁用。取消演练后Move横移约2寸至(22,28)，蓝方恢复BS ARO；蓝方放弃，主动Combi 8/9/20产生两命中，ARM1+PS7=SV8，1/1过保成功。
- markerLos85：同位置S7换CAMO标记。红方Idle即有蓝方射击ARO；放弃后主动Combi同样两命中、SV8过保，没有模型掩体加成。
- movingLos85：手工选择后方S2与中间S7协调，Move+Move0寸逐人确认，S7本命令不再遮挡后方射手。蓝方放弃；后方B2/SV15骰8/9，中间B1/SV15骰20，目标两次过保1/1成功。消耗1正规+1指挥令。

新增3项几何回归，455/455通过。圆柱相交为解析计算，目标3×3mm可见区域仍按既有离散采样；不宣称任意切线零误差。证据：`/Users/bytedance/Documents/tt/infi-model-lof-85.png`。未同步GitHub。
