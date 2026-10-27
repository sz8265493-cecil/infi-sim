# 第74轮：共生装备分配与SymbioMate

2026-10-23，仅本地。官方依据：[Assignable标签](https://infinitythewiki.com/Labels)、[SymbioMate](https://infinitythewiki.com/SymbioMate)、[Immunity](https://infinitythewiki.com/Immunity)。

实际网页验证：

- `symbioAssign74`：拥有者部署面板只有已在场、同军、Transmutation(X)的模型可选。迷彩模型被排除。分配Mate和Bomb后持有者显示两枚紧凑标记，拥有者两类库存各从2降1；再分配同类无候选，按钮禁用。
- `symbioMate74`：AP+EXP命中后由3次半ARM变成1次ARM9，PS8得到SV17。过保20失败，受1伤；命令结束消耗。第二令再次射击，恢复3次ARM1减半向上取整，SV9，过保20/1/1受1伤。
- `symbioComms74`：聚光8/9成功，目标Reset20失败；两次BTS9减半=5、PS5、SV10，20/20失败。没有生命伤害，进入Targeted，装备在命令末消耗。

修复通用免疫此前错误影响通讯攻击的问题：Comms只接受状态免疫；Mate仍提供ARM/BTS9。PH过保不改变；消耗时机保留到命令末，后续同令自爆波可继续使用。自动测试覆盖这些规则。回归430/430通过（含后续共生战术核心测试）。

部署分配后的所有者死亡不会自动移除使用者未消耗的装备。未同步GitHub。
