// =====================================================
// THE DIVINE PARADOX - Main Logic
// =====================================================

// Elements
const btn = document.getElementById("generateBtn");
const resultContainer = document.getElementById("result");
const resultText = document.getElementById("resultText");
const resultActions = document.getElementById("resultActions");
const copyBtn = document.getElementById("copyBtn");
const dismissBtn = document.getElementById("dismissBtn");
const langSelect = document.getElementById("langSelect");
const title = document.getElementById("title");
const desc = document.getElementById("desc");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const godEntity = document.querySelector(".god-entity");
const loadingContainer = document.getElementById("loadingContainer");
const loadingText = document.getElementById("loadingText");

// Modal elements
const privacyModal = document.getElementById("privacyModal");
const privacyLink = document.getElementById("privacyLink");
const closePrivacy = document.getElementById("closePrivacy");

// Stats elements
const generatedCount = document.getElementById("generatedCount");
const generatedLabel = document.getElementById("generatedLabel");
const comboCount = document.getElementById("comboCount");
const attitudeDisplay = document.getElementById("attitudeDisplay");
const dailyIndicator = document.getElementById("dailyIndicator");

// State
let busy = false;
let currentResult = "";
let currentRarity = "";
let generatedTotal = parseInt(localStorage.getItem("divine_generatedTotal") || "0");
let hasGenerated = false;

// =====================================================
// LOCAL STORAGE - Recent Abilities & User Behavior Tracking
// =====================================================
const RECENT_ABILITIES_KEY = "divine_recentAbilities";
const LIKED_ABILITIES_KEY = "divine_likedAbilities";
const SKIPPED_ABILITIES_KEY = "divine_skippedAbilities";
const MAX_RECENT = 20;
const MAX_PREFERENCES = 50;

// =====================================================
// GAME SYSTEMS - Combo, Achievements, Treasury, Daily, Attitude
// =====================================================
const COMBO_KEY = "divine_combo";
const ACHIEVEMENTS_KEY = "divine_achievements";
const TREASURY_KEY = "divine_treasury";
const DAILY_KEY = "divine_daily";
const ATTITUDE_KEY = "divine_attitude";
const DAILY_STREAK_KEY = "divine_dailyStreak";

// Rarity tiers
const RARITY = {
  COMMON: { name: "common", color: "#ffffff", weight: 60 },
  RARE: { name: "rare", color: "#4a9eff", weight: 25 },
  EPIC: { name: "epic", color: "#a855f7", weight: 12 },
  LEGENDARY: { name: "legendary", color: "#f59e0b", weight: 3 },
};

// Achievements definition
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

// =====================================================
// COMBO SYSTEM
// =====================================================
function getCombo() {
  try {
    return parseInt(localStorage.getItem(COMBO_KEY) || "0");
  } catch {
    return 0;
  }
}

function setCombo(count) {
  try {
    localStorage.setItem(COMBO_KEY, count.toString());
  } catch (e) {
    console.warn("Could not save combo:", e);
  }
}

function incrementCombo() {
  const current = getCombo();
  const newCombo = current + 1;
  setCombo(newCombo);
  updateComboDisplay();
  return newCombo;
}

function resetCombo() {
  setCombo(0);
  updateComboDisplay();
}

function updateComboDisplay() {
  const combo = getCombo();
  const comboElement = document.getElementById("comboCount");
  if (comboElement) {
    comboElement.textContent = combo > 0 ? `${combo}x` : "";
  }

  // Update god entity visual based on combo
  if (godEntity) {
    godEntity.classList.remove("combo-low", "combo-medium", "combo-high", "combo-divine");
    if (combo >= 20) {
      godEntity.classList.add("combo-divine");
    } else if (combo >= 10) {
      godEntity.classList.add("combo-high");
    } else if (combo >= 5) {
      godEntity.classList.add("combo-medium");
    } else if (combo >= 3) {
      godEntity.classList.add("combo-low");
    }
  }
}

// =====================================================
// RARITY SYSTEM
// =====================================================
function generateRarity(combo = 0) {
  // Higher combo = better rarity chance
  const roll = Math.random() * 100;

  // Calculate legendary bonus from combo
  const legendaryBonus = Math.min(combo * 0.5, 10); // Max +10% at combo 20
  const epicBonus = Math.min(combo * 1, 20); // Max +20% at combo 20
  const rareBonus = Math.min(combo * 2, 30); // Max +30% at combo 20

  // Adjusted weights based on combo
  const legendaryThreshold = RARITY.LEGENDARY.weight + legendaryBonus;
  const epicThreshold = legendaryThreshold + RARITY.EPIC.weight + epicBonus;
  const rareThreshold = epicThreshold + RARITY.RARE.weight + rareBonus;

  if (roll < legendaryThreshold) {
    return RARITY.LEGENDARY;
  } else if (roll < epicThreshold) {
    return RARITY.EPIC;
  } else if (roll < rareThreshold) {
    return RARITY.RARE;
  } else {
    return RARITY.COMMON;
  }
}

function getRarityColor(rarityName) {
  const rarity = Object.values(RARITY).find(r => r.name === rarityName);
  return rarity ? rarity.color : RARITY.COMMON.color;
}

// =====================================================
// ACHIEVEMENT SYSTEM
// =====================================================
function getAchievements() {
  try {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function unlockAchievement(achievementId) {
  const achievements = getAchievements();
  if (achievements.includes(achievementId)) return false;

  achievements.push(achievementId);
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    return true;
  } catch (e) {
    console.warn("Could not save achievement:", e);
    return false;
  }
}

function checkAchievements(lang = "en") {
  const unlocked = getAchievements();
  const achievements = [];
  const liked = getLikedAbilities();
  const skipped = getSkippedAbilities();
  const treasury = getTreasury();
  const dailyStreak = getDailyStreak();
  const combo = getCombo();

  // Check each achievement
  for (const [key, def] of Object.entries(ACHIEVEMENTS_DEF)) {
    if (unlocked.includes(def.id)) {
      achievements.push({ ...def, unlocked: true });
      continue;
    }

    let meetsRequirement = false;
    switch (def.requirement.type) {
      case "generated":
        meetsRequirement = generatedTotal >= def.requirement.value;
        break;
      case "combo":
        meetsRequirement = combo >= def.requirement.value;
        break;
      case "treasury":
        meetsRequirement = treasury.length >= def.requirement.value;
        break;
      case "skipped":
        meetsRequirement = skipped.length >= def.requirement.value;
        break;
      case "dailyStreak":
        meetsRequirement = dailyStreak >= def.requirement.value;
        break;
      case "legendary":
        meetsRequirement = currentRarity === "legendary";
        break;
      case "firstSave":
        meetsRequirement = treasury.length >= 1;
        break;
    }

    if (meetsRequirement) {
      if (unlockAchievement(def.id)) {
        // Show achievement toast
        const name = def.name[lang] || def.name.en;
        showToast(`🏆 ${name}`, 3000);
      }
      achievements.push({ ...def, unlocked: true });
    } else {
      achievements.push({ ...def, unlocked: false });
    }
  }

  return achievements;
}

// =====================================================
// TREASURY/COLLECTION SYSTEM
// =====================================================
function getTreasury() {
  try {
    const stored = localStorage.getItem(TREASURY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addToTreasury(ability, rarity) {
  if (!ability || !ability.trim()) return false;

  const treasury = getTreasury();
  // Avoid duplicates
  if (treasury.find(item => item.ability === ability)) return false;

  treasury.unshift({
    ability,
    rarity,
    timestamp: Date.now(),
  });

  // Keep max 100 items
  const trimmed = treasury.slice(0, 100);

  try {
    localStorage.setItem(TREASURY_KEY, JSON.stringify(trimmed));
    return true;
  } catch (e) {
    console.warn("Could not save to treasury:", e);
    return false;
  }
}

function removeFromTreasury(ability) {
  const treasury = getTreasury();
  const filtered = treasury.filter(item => item.ability !== ability);
  try {
    localStorage.setItem(TREASURY_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.warn("Could not remove from treasury:", e);
    return false;
  }
}

// =====================================================
// DAILY BLESSING SYSTEM
// =====================================================
function getDailyData() {
  try {
    const stored = localStorage.getItem(DAILY_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setDailyData(data) {
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Could not save daily data:", e);
  }
}

function getDailyStreak() {
  try {
    return parseInt(localStorage.getItem(DAILY_STREAK_KEY) || "0");
  } catch {
    return 0;
  }
}

function setDailyStreak(count) {
  try {
    localStorage.setItem(DAILY_STREAK_KEY, count.toString());
  } catch (e) {
    console.warn("Could not save daily streak:", e);
  }
}

function isDailyAvailable() {
  const daily = getDailyData();
  if (!daily) return true;

  const today = new Date().toDateString();
  return daily.date !== today;
}

function claimDaily() {
  const today = new Date().toDateString();
  const daily = getDailyData();
  let streak = getDailyStreak();

  // Check if streak should continue
  if (daily) {
    const lastDate = new Date(daily.date);
    const currentDate = new Date(today);
    const diffDays = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      streak++;
    } else if (diffDays > 1) {
      // Streak broken
      streak = 1;
    }
    // If diffDays is 0, it's same day, don't increment
  } else {
    streak = 1;
  }

  setDailyData({
    date: today,
    claimed: true,
    ability: null, // Will be set after generation
  });
  setDailyStreak(streak);

  return streak;
}

function updateDailyDisplay() {
  const dailyAvailable = isDailyAvailable();
  const dailyElement = document.getElementById("dailyIndicator");
  if (dailyElement) {
    dailyElement.classList.toggle("available", dailyAvailable);
  }
}

// =====================================================
// GOD ENTITY ATTITUDE SYSTEM
// =====================================================
function getAttitude() {
  try {
    return parseInt(localStorage.getItem(ATTITUDE_KEY) || "50"); // 0-100 scale
  } catch {
    return 50;
  }
}

function setAttitude(value) {
  const clamped = Math.max(0, Math.min(100, value));
  try {
    localStorage.setItem(ATTITUDE_KEY, clamped.toString());
  } catch (e) {
    console.warn("Could not save attitude:", e);
  }
}

function adjustAttitude(delta) {
  const current = getAttitude();
  const newValue = current + delta;
  setAttitude(newValue);
  updateAttitudeDisplay();
}

function updateAttitudeDisplay() {
  const attitude = getAttitude();

  // Update god entity visual based on attitude
  if (godEntity) {
    godEntity.classList.remove("attitude-pleased", "attitude-neutral", "attitude-displeased");
    if (attitude >= 70) {
      godEntity.classList.add("attitude-pleased");
    } else if (attitude <= 30) {
      godEntity.classList.add("attitude-displeased");
    } else {
      godEntity.classList.add("attitude-neutral");
    }
  }
}

function getAttitudeLabel(lang = "en") {
  const attitude = getAttitude();
  const labels = {
    en: { pleased: "Pleased", neutral: "Indifferent", displeased: "Displeased" },
    ko: { pleased: "기쁨", neutral: "무관심", displeased: "불쾌" },
    ja: { pleased: "喜び", neutral: "無関心", displeased: "不快" },
    zh: { pleased: "愉悦", neutral: "冷漠", displeased: "不悦" },
  };
  const langLabels = labels[lang] || labels.en;

  if (attitude >= 70) return langLabels.pleased;
  if (attitude <= 30) return langLabels.displeased;
  return langLabels.neutral;
}

function getRecentAbilities() {
  try {
    const stored = localStorage.getItem(RECENT_ABILITIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getLikedAbilities() {
  try {
    const stored = localStorage.getItem(LIKED_ABILITIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getSkippedAbilities() {
  try {
    const stored = localStorage.getItem(SKIPPED_ABILITIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addRecentAbility(ability) {
  if (!ability || !ability.trim()) return;

  const recent = getRecentAbilities();
  // Avoid duplicates
  const filtered = recent.filter(a => a !== ability);
  // Add new ability at the start
  filtered.unshift(ability);
  // Keep only MAX_RECENT
  const trimmed = filtered.slice(0, MAX_RECENT);

  try {
    localStorage.setItem(RECENT_ABILITIES_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn("Could not save recent abilities:", e);
  }
}

// Track user preferences - liked abilities (copied)
function addLikedAbility(ability) {
  if (!ability || !ability.trim()) return;

  const liked = getLikedAbilities();
  // Avoid duplicates
  const filtered = liked.filter(a => a !== ability);
  filtered.unshift({ ability, timestamp: Date.now() });
  // Keep only MAX_PREFERENCES
  const trimmed = filtered.slice(0, MAX_PREFERENCES);

  try {
    localStorage.setItem(LIKED_ABILITIES_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn("Could not save liked abilities:", e);
  }
}

// Track user preferences - skipped abilities (ESC pressed)
function addSkippedAbility(ability) {
  if (!ability || !ability.trim()) return;

  const skipped = getSkippedAbilities();
  // Avoid duplicates
  const filtered = skipped.filter(a => a !== ability);
  filtered.unshift({ ability, timestamp: Date.now() });
  // Keep only MAX_PREFERENCES
  const trimmed = filtered.slice(0, MAX_PREFERENCES);

  try {
    localStorage.setItem(SKIPPED_ABILITIES_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn("Could not save skipped abilities:", e);
  }
}

// Get preference patterns for the API
function getPreferencePatterns() {
  const liked = getLikedAbilities();
  const skipped = getSkippedAbilities();

  // Extract patterns from liked abilities
  const likedAbilities = liked.map(item => item.ability);
  const skippedAbilities = skipped.map(item => item.ability);

  return {
    likedCount: liked.length,
    skippedCount: skipped.length,
    recentLiked: likedAbilities.slice(0, 5), // Last 5 liked
    recentSkipped: skippedAbilities.slice(0, 3), // Last 3 skipped to avoid
    totalGenerated: generatedTotal,
    combo: getCombo(),
    attitude: getAttitude(),
  };
}

// =====================================================
// TEXT REVEAL ANIMATION
// =====================================================
function revealText(text, element) {
  // Clear element
  element.innerHTML = "";
  element.classList.remove("reveal");

  // Split text into characters (preserving spaces)
  const chars = text.split("");

  // Create span for each character
  const fragment = document.createDocumentFragment();
  chars.forEach((char, index) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = char;
    span.dataset.index = index;

    // Apply dynamic delay based on position
    const baseDelay = 0.02;
    const staggerDelay = 0.015;
    span.style.animationDelay = `${baseDelay + (index * staggerDelay)}s`;

    fragment.appendChild(span);
  });

  element.appendChild(fragment);

  // Trigger animation
  requestAnimationFrame(() => {
    element.classList.add("reveal");
  });
}

// =====================================================
// BUTTON TEXT - Dynamic & Addictive
// =====================================================
const BUTTON_TEXT = {
  en: {
    initial: "Receive",
    after: [
      "Receive Another",
      "Seek More Power",
      "Ask Again",
      "Request Another Gift",
      "Challenge Fate",
      "Embrace Another Burden",
      "The Entity Waits",
      "Take Another",
    ],
  },
  ko: {
    initial: "받기",
    after: [
      "더 받기",
      "다시 요청",
      "또 다른 선물",
      "운명에 도전",
      "또 다른 짐을 짊어지세요",
      "신성한 존재가 기다립니다",
      "계속하세요",
    ],
  },
  ja: {
    initial: "受け取る",
    after: [
      "もう一度",
      "さらに力を",
      "再び問う",
      "別の贈り物を",
      "運命に挑む",
      "新たな重荷を",
      "神は待っている",
      "受け取り続ける",
    ],
  },
  zh: {
    initial: "接受",
    after: [
      "再接受一次",
      "寻求更多力量",
      "再次请求",
      "接受另一个恩赐",
      "挑战命运",
      "拥抱新的负担",
      "神在等待",
      "继续接受",
    ],
  },
};

function getRandomButtonText(lang) {
  const texts = BUTTON_TEXT[lang] || BUTTON_TEXT.en;
  const afterTexts = texts.after || texts.initial;
  return afterTexts[Math.floor(Math.random() * afterTexts.length)];
}

function updateButtonText(lang) {
  const texts = BUTTON_TEXT[lang] || BUTTON_TEXT.en;
  const btnText = btn.querySelector(".btn-text");
  if (btnText) {
    btnText.textContent = hasGenerated ? getRandomButtonText(lang) : texts.initial;
  }
}

// =====================================================
// UI TEXT TRANSLATIONS
// =====================================================
const UI_TEXT = {
  en: {
    title: "Receive Your Gift",
    desc: "The Divine Entity offers you power, but every blessing carries its burden.",
    btn: "Receive",
    loading: "The Divine Entity shifts...",
    copy: "Copy",
    copied: "Copied",
    copyError: "Copy failed",
    dismiss: "Dismiss",
    generated: "Gifts Received",
    emptyResult: "Your gift will appear here",
    error: "The Divine Entity is silent. Try again.",
  },
  ko: {
    title: "당신의 선물을 받으세요",
    desc: "신성한 존재가 당신에게 힘을 제안하지만, 모든 축복에는 짐이 따릅니다.",
    btn: "받기",
    loading: "신성한 존재가 변화합니다...",
    copy: "복사",
    copied: "복사됨",
    copyError: "복사 실패",
    dismiss: "무시하기",
    generated: "받은 선물",
    emptyResult: "당신의 선물이 여기에 나타납니다",
    error: "신성한 존재가 침묵합니다. 다시 시도하세요.",
  },
  ja: {
    title: "贈り物を受け取る",
    desc: "神聖な存在が力を捧げるが、全ての祝福には重荷が伴う。",
    btn: "受け取る",
    loading: "神聖な存在が移り変わる...",
    copy: "コピー",
    copied: "コピーしました",
    copyError: "コピー失敗",
    dismiss: "閉じる",
    generated: "受け取った贈り物",
    emptyResult: "あなたの贈り物がここに現れます",
    error: "神聖な存在が沈黙しています。もう一度試してください。",
  },
  zh: {
    title: "接受你的恩赐",
    desc: "神圣存在赐予你力量，但每个祝福都伴随着负担。",
    btn: "接受",
    loading: "神圣存在正在转变...",
    copy: "复制",
    copied: "已复制",
    copyError: "复制失败",
    dismiss: "关闭",
    generated: "已接收恩赐",
    emptyResult: "你的恩赐将出现在这里",
    error: "神圣存在保持沉默。请再试一次。",
  },
};

// =====================================================
// LANGUAGE
// =====================================================
function applyLang(lang) {
  const t = UI_TEXT[lang] || UI_TEXT.en;
  title.textContent = t.title;
  desc.textContent = t.desc;
  copyBtn.textContent = t.copy;
  const dismissBtn = document.getElementById("dismissBtn");
  if (dismissBtn) {
    dismissBtn.textContent = t.dismiss;
  }
  generatedLabel.textContent = t.generated;

  // Update button text based on state
  updateButtonText(lang);
}

function detectLanguage() {
  const browserLang = navigator.language || navigator.userLanguage || navigator.languages?.[0] || navigator.browserLanguage || "en";
  const langCode = browserLang.split("-")[0].toLowerCase();

  if (["en", "ko", "ja", "zh"].includes(langCode)) {
    langSelect.value = langCode;
  }
}

// =====================================================
// STATS
// =====================================================
function updateStats() {
  generatedCount.textContent = generatedTotal;
}

function saveStats() {
  localStorage.setItem("divine_generatedTotal", generatedTotal.toString());
}

// =====================================================
// TOAST NOTIFICATION
// =====================================================
function showToast(message, duration = 2000) {
  toastMessage.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// =====================================================
// GENERATE ABILITY
// =====================================================
btn.addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  btn.disabled = true;

  const lang = langSelect.value;
  const t = UI_TEXT[lang] || UI_TEXT.en;

  // Activate God entity visual
  if (godEntity) {
    godEntity.classList.add("active");
  }

  // Show loading UI
  loadingContainer.hidden = false;
  loadingText.textContent = t.loading;
  resultText.classList.remove("show");
  resultText.textContent = "";
  resultContainer.classList.remove("has-result");
  resultActions.hidden = true;

  // Remove button pulse during loading
  btn.classList.remove("ready");

  // Get recent abilities for variety
  const recentAbilities = getRecentAbilities();

  // Get preference patterns for better generation
  const preferencePatterns = getPreferencePatterns();

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang, recentAbilities, preferencePatterns }),
    });

    if (!res.ok) throw new Error("Request failed");
    const data = await res.json();

    currentResult = data.result || "";

    // Hide loading, show result
    loadingContainer.hidden = true;

    if (currentResult) {
      resultContainer.classList.add("has-result");

      // Use reveal animation
      revealText(currentResult, resultText);

      // Show the container
      resultText.classList.add("show");

      // Update button text to be addictive
      hasGenerated = true;
      updateButtonText(lang);

      // Add visual pulse to button
      btn.classList.add("ready");

      resultActions.hidden = false;

      // Update localStorage
      addRecentAbility(currentResult);

      // GAME SYSTEMS: Generate rarity based on combo
      const combo = incrementCombo();
      const rarity = generateRarity(combo);
      currentRarity = rarity.name;

      // Apply rarity visual effect
      const rarityColor = getRarityColor(rarity.name);
      resultContainer.style.borderColor = rarityColor;
      resultContainer.style.boxShadow = `0 0 20px ${rarityColor}40`;

      // Update stats
      generatedTotal++;
      updateStats();
      saveStats();

      // GAME SYSTEMS: Check and unlock achievements
      checkAchievements(lang);

      // GAME SYSTEMS: Update displays
      updateComboDisplay();
      updateAttitudeDisplay();
      updateDailyDisplay();
    } else {
      resultText.textContent = t.error;
      resultText.classList.add("show");
    }
  } catch (e) {
    loadingContainer.hidden = true;
    resultText.textContent = t.error;
    resultText.classList.add("show");
    resultActions.hidden = true;
  } finally {
    busy = false;
    btn.disabled = false;

    // Deactivate God entity visual
    if (godEntity) {
      godEntity.classList.remove("active");
    }
  }
});

// =====================================================
// COPY TO CLIPBOARD
// =====================================================
copyBtn.addEventListener("click", async () => {
  if (!currentResult) return;

  // Get the plain text (without spans)
  const textToCopy = currentResult;

  try {
    await navigator.clipboard.writeText(textToCopy);
    const lang = langSelect.value;
    const t = UI_TEXT[lang] || UI_TEXT.en;
    showToast(t.copied);

    // Track that user liked this ability
    addLikedAbility(currentResult);

    // GAME SYSTEMS: Increase attitude (pleases the God)
    adjustAttitude(3);

    // Check achievements (for collector achievements)
    checkAchievements(lang);
  } catch (e) {
    const lang = langSelect.value;
    const t = UI_TEXT[lang] || UI_TEXT.en;
    alert(t.copyError);
  }
});

// =====================================================
// DISMISS RESULT
// =====================================================
if (dismissBtn) {
  dismissBtn.addEventListener("click", () => {
    if (!currentResult) return;

    // Track that user skipped this ability
    addSkippedAbility(currentResult);

    // GAME SYSTEMS: Reset combo (dismiss breaks combo)
    resetCombo();

    // GAME SYSTEMS: Decrease attitude slightly (displeases the God)
    adjustAttitude(-5);

    // Clear result
    currentResult = "";
    currentRarity = "";
    resultText.innerHTML = "";
    resultText.classList.remove("show", "reveal");
    resultContainer.classList.remove("has-result");
    resultActions.hidden = true;
    resultContainer.style.borderColor = "";
    resultContainer.style.boxShadow = "";
  });
}

// =====================================================
// LANGUAGE CHANGE
// =====================================================
langSelect.addEventListener("change", () => {
  applyLang(langSelect.value);
});

// =====================================================
// KEYBOARD SHORTCUTS
// =====================================================
document.addEventListener("keydown", (e) => {
  // ESC to close modal or clear result
  if (e.key === "Escape") {
    // Close any open modals first
    if (privacyModal.classList.contains("show")) {
      privacyModal.classList.remove("show");
    } else if (achievementsModal && achievementsModal.classList.contains("show")) {
      achievementsModal.classList.remove("show");
    } else if (treasuryModal && treasuryModal.classList.contains("show")) {
      treasuryModal.classList.remove("show");
    } else if (currentResult) {
      // Track that user skipped this ability
      addSkippedAbility(currentResult);

      // GAME SYSTEMS: Reset combo (dismiss breaks combo)
      resetCombo();

      // GAME SYSTEMS: Decrease attitude slightly
      adjustAttitude(-5);

      // Clear result
      currentResult = "";
      currentRarity = "";
      resultText.innerHTML = "";
      resultText.classList.remove("show", "reveal");
      resultContainer.classList.remove("has-result");
      resultActions.hidden = true;
      resultContainer.style.borderColor = "";
      resultContainer.style.boxShadow = "";
    }
  }

  // Enter or Space to generate (if not typing in an input)
  if ((e.key === "Enter" || e.key === " ") && !e.target.matches("input, textarea, select")) {
    // Only trigger if not already busy
    if (!busy) {
      e.preventDefault();
      btn.click();
    }
  }
});

// =====================================================
// PRIVACY MODAL
// =====================================================
privacyLink.addEventListener("click", (e) => {
  e.preventDefault();
  privacyModal.classList.add("show");
});

closePrivacy.addEventListener("click", () => {
  privacyModal.classList.remove("show");
});

privacyModal.addEventListener("click", (e) => {
  if (e.target === privacyModal) {
    privacyModal.classList.remove("show");
  }
});

// =====================================================
// SAVE TO TREASURY
// =====================================================
const saveBtn = document.getElementById("saveBtn");
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    if (!currentResult) return;

    const saved = addToTreasury(currentResult, currentRarity);
    if (saved) {
      const lang = langSelect.value;
      const t = UI_TEXT[lang] || UI_TEXT.en;
      showToast("Saved to Treasury", 2000);

      // Check achievements (for collector achievements)
      checkAchievements(lang);
    } else {
      showToast("Already in Treasury", 2000);
    }
  });
}

// =====================================================
// ACHIEVEMENTS MODAL
// =====================================================
const achievementsBtn = document.getElementById("achievementsBtn");
const achievementsModal = document.getElementById("achievementsModal");
const closeAchievements = document.getElementById("closeAchievements");

if (achievementsBtn && achievementsModal) {
  achievementsBtn.addEventListener("click", () => {
    populateAchievements();
    achievementsModal.classList.add("show");
  });
}

if (closeAchievements) {
  closeAchievements.addEventListener("click", () => {
    achievementsModal.classList.remove("show");
  });
}

if (achievementsModal) {
  achievementsModal.addEventListener("click", (e) => {
    if (e.target === achievementsModal) {
      achievementsModal.classList.remove("show");
    }
  });
}

function populateAchievements() {
  const lang = langSelect.value;
  const achievementsList = document.getElementById("achievementsList");
  if (!achievementsList) return;

  const achievements = checkAchievements(lang);
  const unlocked = getAchievements();

  achievementsList.innerHTML = achievements.map(ach => {
    const isUnlocked = ach.unlocked;
    const icon = isUnlocked ? "🏆" : "🔒";
    const name = ach.name[lang] || ach.name.en;
    const desc = ach.desc[lang] || ach.desc.en;

    return `
      <div class="achievement-item ${isUnlocked ? 'unlocked' : ''}">
        <div class="achievement-icon">${icon}</div>
        <div class="achievement-info">
          <div class="achievement-name">${name}</div>
          <div class="achievement-desc">${desc}</div>
        </div>
      </div>
    `;
  }).join("");
}

// =====================================================
// TREASURY MODAL
// =====================================================
const treasuryBtn = document.getElementById("treasuryBtn");
const treasuryModal = document.getElementById("treasuryModal");
const closeTreasury = document.getElementById("closeTreasury");
const exportTreasuryBtn = document.getElementById("exportTreasury");
const clearTreasuryBtn = document.getElementById("clearTreasury");

if (treasuryBtn && treasuryModal) {
  treasuryBtn.addEventListener("click", () => {
    populateTreasury();
    treasuryModal.classList.add("show");
  });
}

if (closeTreasury) {
  closeTreasury.addEventListener("click", () => {
    treasuryModal.classList.remove("show");
  });
}

if (treasuryModal) {
  treasuryModal.addEventListener("click", (e) => {
    if (e.target === treasuryModal) {
      treasuryModal.classList.remove("show");
    }
  });
}

function populateTreasury() {
  const treasuryList = document.getElementById("treasuryList");
  if (!treasuryList) return;

  const treasury = getTreasury();

  if (treasury.length === 0) {
    treasuryList.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 40px;">
        <p>Your treasury is empty.</p>
        <p style="font-size: 13px; margin-top: 8px;">Save abilities to build your collection.</p>
      </div>
    `;
    return;
  }

  treasuryList.innerHTML = treasury.map((item, index) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    const rarityColor = getRarityColor(item.rarity);

    return `
      <div class="treasury-item rarity-${item.rarity}">
        <div class="treasury-ability">${item.ability}</div>
        <div class="treasury-meta">
          <span class="treasury-rarity" style="color: ${rarityColor}">${item.rarity}</span>
          <span>${date}</span>
          <button class="treasury-delete" onclick="deleteFromTreasury(${index})">×</button>
        </div>
      </div>
    `;
  }).join("");
}

// Global function for delete button
window.deleteFromTreasury = function(index) {
  const treasury = getTreasury();
  if (index >= 0 && index < treasury.length) {
    const item = treasury[index];
    removeFromTreasury(item.ability);
    populateTreasury();
    showToast("Removed from Treasury", 2000);
  }
};

if (exportTreasuryBtn) {
  exportTreasuryBtn.addEventListener("click", () => {
    const treasury = getTreasury();
    if (treasury.length === 0) {
      showToast("Treasury is empty", 2000);
      return;
    }

    const text = treasury.map(item => `[${item.rarity.toUpperCase()}] ${item.ability}`).join("\n\n");

    navigator.clipboard.writeText(text).then(() => {
      showToast("Collection exported to clipboard", 3000);
    }).catch(() => {
      showToast("Export failed", 2000);
    });
  });
}

if (clearTreasuryBtn) {
  clearTreasuryBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your entire treasury? This cannot be undone.")) {
      localStorage.setItem(TREASURY_KEY, JSON.stringify([]));
      populateTreasury();
      showToast("Treasury cleared", 2000);
    }
  });
}

// =====================================================
// DAILY BLESSING HANDLER
// =====================================================
if (dailyIndicator) {
  dailyIndicator.addEventListener("click", () => {
    if (isDailyAvailable()) {
      claimDaily();
      updateDailyDisplay();
      showToast("Daily Blessing claimed!", 3000);
      // Trigger generation
      btn.click();
    } else {
      const daily = getDailyData();
      if (daily && daily.ability) {
        showToast("Already claimed today. Come back tomorrow!", 3000);
      }
    }
  });
}

// =====================================================
// INITIALIZE
// =====================================================
detectLanguage();
applyLang(langSelect.value);
updateStats();

// Initialize game systems
updateComboDisplay();
updateAttitudeDisplay();
updateDailyDisplay();

// No auto-focus on load - let user discover naturally
