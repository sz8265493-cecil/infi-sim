# 第81轮：伪装两层、重新伪装与部署

仅本地开发，2026-10-23。规则来源：[Impersonation State](https://infinitythewiki.com/Impersonation_State)、[Impersonation](https://infinitythewiki.com/Impersonation)、[Biometric Visor](https://infinitythewiki.com/Biometric_Visor)，页面标明 N5.3 / FAQ v0.1。

已实际操作：
- impMulti81：IMP-1待机，两人发现（SV13，8/9成功）、第三人延后；第二次待机后延后失效。两个成功只变IMP-2；下一令再次发现成功揭露。最初发现朝向界面被技能弹窗覆盖，已修复并在下一场景实测。
- impBio81：生物识别目镜忽略IMP-1−3，SV16骰8直接揭露；在专用朝向窗口将朝向改为−180°并完成命令。
- impHidden81：隐匿模型不阻止宣告重新伪装；揭露后射击ARO骰8，主动单位ARM过保1成功。执行重新伪装不满足视线要求，按待机，命令3→2。
- impRegain81：隔墙整令恢复IMP-1，无骰、无过保。
- impDeploy81：敌部署区启用IMP-1部署，WIP13骰20失败；取消标记，回到(0.49,47.51)己方桌边。修复部署固定骰误引用不存在的命令数据。

规则防护还覆盖：IMP禁止直觉攻击/普通攻击，IMP-2仅允许先发现后攻击，MSV3不能跳过伪装发现；Sensor不发现IMP；模板覆盖IMP按友军取消；失败发现按标记世代和玩家回合锁定；主动整令重新伪装不能作为ARO。对应4项回归，完整445项通过。

仍需专项：模板误伤IMP的浏览器场景、失败部署物移除/成功敌部署区场景、全部Surprise交叉组合。以上不作为已经实际操作的证据。
