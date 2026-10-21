// Official N5.3 States index, checked 2026-10-19. Icons retain original Wiki assets.
export const CATALOG=[
  {
    "id": "camouflaged",
    "en": "Camouflaged",
    "zh": "迷彩",
    "alias": "伪装",
    "token": true,
    "effect": "以 CAMO 标记代替模型，通常须先发现才能攻击，标记有 360° 视线。",
    "source": "https://infinitythewiki.com/Camouflaged_State",
    "icons": [
      "assets/states/camo_amarillo_40mm-530.jpg",
      "assets/states/camo_verde_40mm-560.jpg",
      "assets/states/camo_azul_40mm-620.jpg"
    ],
    "automatic": false,
    "official": true
  },
  {
    "id": "dead",
    "en": "Dead",
    "zh": "已移除（Dead）",
    "token": false,
    "effect": "从战场及战斗组移除，不再供令；通常无法解除。",
    "source": "https://infinitythewiki.com/Dead_State",
    "icons": [
      "assets/states/ui-dead.svg"
    ],
    "automatic": true,
    "official": false
  },
  {
    "id": "decoy",
    "en": "Decoy",
    "zh": "诱饵",
    "token": true,
    "effect": "部署真实单位及最多两个静止副本，私下记录真实位置；揭露后移除副本。",
    "source": "https://infinitythewiki.com/Decoy_State",
    "icons": [
      "assets/states/decoy-10.jpg",
      "assets/states/decoy-20.jpg"
    ],
    "automatic": false,
    "official": true
  },
  {
    "id": "disconnected",
    "en": "Disconnected",
    "zh": "断连",
    "token": true,
    "effect": "附属单位无法激活或声明命令、ARO；多数自动技能及装备停用。",
    "source": "https://infinitythewiki.com/Disconnected_State",
    "icons": [
      "assets/states/eng-disconnected.jpg"
    ],
    "automatic": false,
    "official": true
  },
  {
    "id": "engaged",
    "en": "Engaged",
    "zh": "交战",
    "token": false,
    "effect": "与敌方轮廓接触而进入近战，仅能声明近战允许的技能，不能向交战外建立视线。",
    "source": "https://infinitythewiki.com/Engaged_State",
    "icons": [
      "assets/states/ui-engaged.svg"
    ],
    "automatic": true,
    "official": false
  },
  {
    "id": "foxhole",
    "en": "Foxhole",
    "zh": "散兵坑",
    "token": true,
    "effect": "固定位置获得全方向部分掩体、拟态−3与勇气，轮廓至少 S3；状态中不能移动。",
    "source": "https://infinitythewiki.com/Foxhole_State",
    "icons": [
      "assets/states/fox_hole0.jpg"
    ],
    "automatic": false,
    "official": true
  },
  {
    "id": "hiddenDeployment",
    "en": "Hidden Deployment",
    "zh": "隐匿部署",
    "token": false,
    "effect": "私下记录位置，不在战场放置模型或标记；按记录位置判断可否宣告 ARO，揭露后无法再次隐匿部署。",
    "source": "https://infinitythewiki.com/Hidden_Deployment_State",
    "icons": [
      "assets/states/ui-hiddenDeployment.svg"
    ],
    "automatic": false,
    "official": false
  },
  {
    "id": "holoecho",
    "en": "Holoecho",
    "zh": "全息回声",
    "token": true,
    "effect": "真实单位和全息副本同步行动、维持一致性，真实身份保密。",
    "source": "https://infinitythewiki.com/Holoecho_State",
    "icons": [
      "assets/states/holoecho1-550.jpg",
      "assets/states/holoecho2_550.jpg"
    ],
    "automatic": false,
    "official": true
  },
  {
    "id": "holomask",
    "en": "HoloMask",
    "zh": "全息伪装",
    "token": false,
    "effect": "以同阵营同轮廓的另一单位外观代替本体，但仍使用本体属性。",
    "source": "https://infinitythewiki.com/HoloMask_State",
    "icons": [
      "assets/states/ui-holomask.svg"
    ],
    "automatic": false,
    "official": false
  },
  {
    "id": "immA",
    "en": "Immobilized-A",
    "zh": "不可移动 A",
    "alias": "固定 A",
    "token": true,
    "effect": "只能声明 Dodge−6；成功闪避或工程师可按条件解除。",
    "source": "https://infinitythewiki.com/Immobilized-A_State",
    "icons": [
      "assets/states/eng-imm-a.jpg"
    ],
    "automatic": true,
    "official": true
  },
  {
    "id": "immB",
    "en": "Immobilized-B",
    "zh": "不可移动 B",
    "alias": "固定 B",
    "token": true,
    "effect": "只能声明 Reset−3；成功重置或工程师可按条件解除。",
    "source": "https://infinitythewiki.com/Immobilized-B_State",
    "icons": [
      "assets/states/eng-imm-b.jpg"
    ],
    "automatic": true,
    "official": true
  },
  {
    "id": "impersonation",
    "en": "Impersonation",
    "zh": "伪装身份",
    "alias": "伪装",
    "token": true,
    "effect": "IMP-1/2 标记被视为友军，先发现才能揭露；IMP-1 的发现−3，成功变为 IMP-2。",
    "source": "https://infinitythewiki.com/Impersonation_State",
    "icons": [
      "assets/states/impersonation-state-1.jpg",
      "assets/states/impersonation-state-2.jpg"
    ],
    "automatic": false,
    "official": true
  },
  {
    "id": "isolated",
    "en": "Isolated",
    "zh": "孤立",
    "token": true,
    "effect": "不能使用公共命令池，通讯装备与黑客程序停用；后续自己回合按非正规供令。",
    "source": "https://infinitythewiki.com/Isolated_State",
    "icons": [
      "assets/states/isolated0.jpg"
    ],
    "automatic": true,
    "official": true
  },
  {
    "id": "normal",
    "en": "Normal",
    "zh": "正常",
    "token": false,
    "effect": "通常供一枚命令且计入胜利点；进入 Null 等指定条件时取消，可与其他非 Null 状态并存。",
    "source": "https://infinitythewiki.com/Normal_State",
    "icons": [
      "assets/states/ui-normal.svg"
    ],
    "automatic": true,
    "official": false
  },
  {
    "id": "prone",
    "en": "Prone",
    "zh": "俯卧",
    "alias": "卧倒",
    "token": true,
    "effect": "轮廓降低至底盘大小，移动标签技能的移动距离减半。",
    "source": "https://infinitythewiki.com/Prone_State",
    "icons": [
      "assets/states/eng-prone.jpg"
    ],
    "automatic": true,
    "official": true
  },
  {
    "id": "possessed",
    "en": "Possessed",
    "zh": "被控制",
    "token": true,
    "effect": "敌我关系反转，由施加者对应战斗组供令，使用专用被控制属性，不为双方供令。",
    "source": "https://infinitythewiki.com/Possessed_State",
    "icons": [
      "assets/states/poss0.jpg"
    ],
    "automatic": false,
    "official": true
  },
  {
    "id": "retreat",
    "en": "Retreat!",
    "zh": "撤退",
    "token": true,
    "effect": "仅可声明基础短技能、谨慎移动、闪避、重置或明确允许的技能；可花指挥点解除。",
    "source": "https://infinitythewiki.com/Retreat_State",
    "icons": [
      "assets/states/retreat_0.jpg"
    ],
    "automatic": false,
    "official": true
  },
  {
    "id": "sepsitorized",
    "en": "Sepsitorized",
    "zh": "被腐化",
    "token": true,
    "effect": "离开原战斗组并受敌方控制，可使用施加者战斗组命令，不为双方供令。",
    "source": "https://infinitythewiki.com/Sepsitorized_State",
    "icons": [
      "assets/states/sepsitorized0.jpg"
    ],
    "automatic": false,
    "official": true
  },
  {
    "id": "stunned",
    "en": "Stunned",
    "zh": "眩晕",
    "alias": "震慑",
    "token": true,
    "effect": "不能攻击，除过保外检定−3；造成该状态的玩家回合进入状态阶段时解除。",
    "source": "https://infinitythewiki.com/Stunned_State",
    "icons": [
      "assets/states/stunned0.jpg"
    ],
    "automatic": true,
    "official": true
  },
  {
    "id": "suppressiveFire",
    "en": "Suppressive Fire",
    "zh": "压制射击",
    "token": true,
    "effect": "改用 24 寸内的压制档案，ARO 可用 B3 对单一目标；范围内对手与其拼骰−3。",
    "source": "https://infinitythewiki.com/Suppressive_Fire_State",
    "icons": [
      "assets/states/suppression_fire0.jpg"
    ],
    "automatic": false,
    "official": true
  },
  {
    "id": "targeted",
    "en": "Targeted",
    "zh": "被标记",
    "alias": "标定",
    "token": true,
    "effect": "对其射击、通讯攻击、发现+3；自身 Reset−3，不能谨慎移动或使用隐秘。",
    "source": "https://infinitythewiki.com/Targeted_State",
    "icons": [
      "assets/states/eng-targeted.jpg"
    ],
    "automatic": true,
    "official": true
  },
  {
    "id": "unconscious",
    "en": "Unconscious",
    "zh": "昏迷",
    "token": true,
    "effect": "无法命令或 ARO、不供令，不计胜利点，通常自动俯卧；移除足够伤口可解除。",
    "source": "https://infinitythewiki.com/Unconscious_State",
    "icons": [
      "assets/states/eng-unconscious.jpg"
    ],
    "automatic": true,
    "official": true
  },
  {
    "id": "unloaded",
    "en": "Unloaded",
    "zh": "弹药耗尽",
    "token": true,
    "effect": "指定有限使用次数的武器/装备耗尽，不能继续使用；可按补给、Reload 与任务规则恢复。",
    "source": "https://infinitythewiki.com/Unloaded_State",
    "icons": [
      "assets/states/eng-unloaded.jpg"
    ],
    "automatic": false,
    "official": true
  }
];
export const BY_ID=Object.fromEntries(CATALOG.map(s=>[s.id,s]));
