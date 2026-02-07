// =====================================================
// THE DIVINE PARADOX - Main Logic
// =====================================================

// Elements
const btn = document.getElementById("generateBtn");
const resultContainer = document.getElementById("result");
const resultText = document.getElementById("resultText");
const resultActions = document.getElementById("resultActions");
const copyBtn = document.getElementById("copyBtn");
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

// State
let busy = false;
let currentResult = "";
let generatedTotal = parseInt(localStorage.getItem("divine_generatedTotal") || "0");

// =====================================================
// LOCAL STORAGE - Recent Abilities Tracking
// =====================================================
const RECENT_ABILITIES_KEY = "divine_recentAbilities";
const MAX_RECENT = 10;

function getRecentAbilities() {
  try {
    const stored = localStorage.getItem(RECENT_ABILITIES_KEY);
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
  btn.querySelector(".btn-text").textContent = t.btn;
  copyBtn.textContent = t.copy;
  generatedLabel.textContent = t.generated;
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

  // Get recent abilities for variety
  const recentAbilities = getRecentAbilities();

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang, recentAbilities }),
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

      // Focus button for quick repeat
      setTimeout(() => {
        btn.focus();
      }, 100);

      resultActions.hidden = false;

      // Update localStorage
      addRecentAbility(currentResult);

      // Update stats
      generatedTotal++;
      updateStats();
      saveStats();
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

    // Keep focus on button for repeat
    btn.focus();
  } catch (e) {
    const lang = langSelect.value;
    const t = UI_TEXT[lang] || UI_TEXT.en;
    alert(t.copyError);
  }
});

// =====================================================
// LANGUAGE CHANGE
// =====================================================
langSelect.addEventListener("change", () => {
  applyLang(langSelect.value);
  // Refocus button on language change
  btn.focus();
});

// =====================================================
// KEYBOARD SHORTCUTS
// =====================================================
document.addEventListener("keydown", (e) => {
  // ESC to close modal or clear result
  if (e.key === "Escape") {
    if (privacyModal.classList.contains("show")) {
      privacyModal.classList.remove("show");
    } else if (currentResult) {
      // Clear result and focus button for repeat
      currentResult = "";
      resultText.innerHTML = "";
      resultText.classList.remove("show", "reveal");
      resultContainer.classList.remove("has-result");
      resultActions.hidden = true;
      btn.focus();
    }
  }

  // Enter to generate (if not typing in an input)
  if (e.key === "Enter" && !e.target.matches("input, textarea, select")) {
    e.preventDefault();
    btn.click();
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
// INITIALIZE
// =====================================================
detectLanguage();
applyLang(langSelect.value);
updateStats();

// Set focus on button on load for immediate use
setTimeout(() => btn.focus(), 100);
