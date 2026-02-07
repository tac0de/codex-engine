// Shared config/constants for reuse across micro-sites.
(function () {
  const STORAGE_KEYS = {
    generatedTotal: "divine_generatedTotal",
    recentAbilities: "divine_recentAbilities",
    likedAbilities: "divine_likedAbilities",
    skippedAbilities: "divine_skippedAbilities",
    combo: "divine_combo",
    achievements: "divine_achievements",
    treasury: "divine_treasury",
    daily: "divine_daily",
    attitude: "divine_attitude",
    dailyStreak: "divine_dailyStreak",
  };

  const LIMITS = {
    maxRecent: 20,
    maxPreferences: 50,
    maxTreasury: 100,
    generateCooldownMs: 1200,
  };

  const RARITY = {
    COMMON: { name: "common", color: "#ffffff", weight: 60 },
    RARE: { name: "rare", color: "#4a9eff", weight: 25 },
    EPIC: { name: "epic", color: "#a855f7", weight: 12 },
    LEGENDARY: { name: "legendary", color: "#f59e0b", weight: 3 },
  };

  const ACHIEVEMENTS_DEF = {
    first_gift: { id: "first_gift", name: { en: "Seeker", ko: "구도자", ja: "探求者", zh: "追寻者" }, desc: { en: "Receive your first gift", ko: "첫 선물 받기", ja: "最初の贈り物", zh: "接收第一份恩赐" }, requirement: { type: "generated", value: 1 } },
    ten_gifts: { id: "ten_gifts", name: { en: "Devoted", ko: "헌신자", ja: "献身者", zh: "虔诚者" }, desc: { en: "Receive 10 gifts", ko: "10개의 선물 받기", ja: "10個の贈り物", zh: "接收10份恩赐" }, requirement: { type: "generated", value: 10 } },
    fifty_gifts: { id: "fifty_gifts", name: { en: "Ascendant", ko: "승천자", ja: "昇天者", zh: "飞升者" }, desc: { en: "Receive 50 gifts", ko: "50개의 선물 받기", ja: "50個の贈り物", zh: "接收50份恩赐" }, requirement: { type: "generated", value: 50 } },
    hundred_gifts: { id: "hundred_gifts", name: { en: "Transcendent", ko: "초월자", ja: "超越者", zh: "超越者" }, desc: { en: "Receive 100 gifts", ko: "100개의 선물 받기", ja: "100個の贈り物", zh: "接收100份恩赐" }, requirement: { type: "generated", value: 100 } },
    combo_5: { id: "combo_5", name: { en: "Favored", ko: "축복받은 자", ja: "恵まれし者", zh: "受眷顾者" }, desc: { en: "Reach 5x combo", ko: "5콤보 달성", ja: "5コンボ達成", zh: "达成5连击" }, requirement: { type: "combo", value: 5 } },
    combo_10: { id: "combo_10", name: { en: "Blessed", ko: "강림자", ja: "降臨者", zh: "降临者" }, desc: { en: "Reach 10x combo", ko: "10콤보 달성", ja: "10コンボ達成", zh: "达成10连击" }, requirement: { type: "combo", value: 10 } },
    combo_20: { id: "combo_20", name: { en: "Divine", ko: "신성한 자", ja: "神聖なる者", zh: "神圣者" }, desc: { en: "Reach 20x combo", ko: "20콤보 달성", ja: "20コンボ達成", zh: "达成20连击" }, requirement: { type: "combo", value: 20 } },
    collector_5: { id: "collector_5", name: { en: "Hoarding", ko: "수집가", ja: "収集家", zh: "收藏家" }, desc: { en: "Save 5 abilities", ko: "5개 능력 저장", ja: "5個保存", zh: "保存5个能力" }, requirement: { type: "treasury", value: 5 } },
    collector_20: { id: "collector_20", name: { en: "Archivist", ko: "기록자", ja: "記録者", zh: "记录者" }, desc: { en: "Save 20 abilities", ko: "20개 능력 저장", ja: "20個保存", zh: "保存20个能力" }, requirement: { type: "treasury", value: 20 } },
    discerning: { id: "discerning", name: { en: "Discerning", ko: "식별자", ja: "識別者", zh: "辨别者" }, desc: { en: "Skip 5 abilities", ko: "5개 능력 무시", ja: "5個スキップ", zh: "跳过5个能力" }, requirement: { type: "skipped", value: 5 } },
    daily_streak_3: { id: "daily_streak_3", name: { en: "Pilgrim", ko: "순례자", ja: "巡礼者", zh: "朝圣者" }, desc: { en: "3 day daily streak", ko: "3일 연속", ja: "3日連続", zh: "连续3天" }, requirement: { type: "dailyStreak", value: 3 } },
    daily_streak_7: { id: "daily_streak_7", name: { en: "Faithful", ko: "신실한 자", ja: "忠実者", zh: "忠实者" }, desc: { en: "7 day daily streak", ko: "7일 연속", ja: "7日連続", zh: "连续7天" }, requirement: { type: "dailyStreak", value: 7 } },
    legendary_gift: { id: "legendary_gift", name: { en: "Chosen", ko: "선택받은 자", ja: "選ばれし者", zh: "天选者" }, desc: { en: "Receive a legendary gift", ko: "전설적 선물 받기", ja: "伝説的贈り物", zh: "接收传说恩赐" }, requirement: { type: "legendary", value: 1 } },
    first_save: { id: "first_save", name: { en: "Curator", ko: "관리인", ja: "管理人", zh: "管理者" }, desc: { en: "Save first ability", ko: "첫 능력 저장", ja: "最初保存", zh: "保存第一个能力" }, requirement: { type: "firstSave", value: 1 } },
  };

  window.DP_CONFIG = {
    API_ENDPOINT: "/api/generate",
    STORAGE_KEYS,
    LIMITS,
    RARITY,
    ACHIEVEMENTS_DEF,
  };
})();

