// Elements
const btn = document.getElementById("generateBtn");
const resultDiv = document.getElementById("result");
const resultText = document.getElementById("resultText");
const resultActions = document.getElementById("resultActions");
const copyBtn = document.getElementById("copyBtn");
const langSelect = document.getElementById("langSelect");
const title = document.getElementById("title");
const desc = document.getElementById("desc");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const themeToggle = document.getElementById("themeToggle");
const colorToggle = document.getElementById("colorToggle");

// Theme state
let currentTheme = localStorage.getItem("theme") || "dark";
let currentColor = localStorage.getItem("color") || "purple";

// Modal elements
const privacyModal = document.getElementById("privacyModal");
const privacyLink = document.getElementById("privacyLink");
const closePrivacy = document.getElementById("closePrivacy");

// Stats elements
const generatedCount = document.getElementById("generatedCount");
const generatedLabel = document.getElementById("generatedLabel");
const loadingContainer = document.getElementById("loadingContainer");
const loadingText = document.getElementById("loadingText");
const loadingSubtext = document.getElementById("loadingSubtext");

// State
let busy = false;
let currentResult = "";
let generatedTotal = parseInt(localStorage.getItem("generatedTotal") || "0");

// UI Text Translations
const UI_TEXT = {
  en: {
    title: "⚡ Anime Power Generator",
    desc: "Create unique anime abilities with a twist - every power comes with a cost.",
    btn: "✨ Generate",
    loading: "✨ Generating...",
    loadingSubtext: "Consulting the anime gods...",
    copy: "📋 Copy",
    copied: "✓ Copied!",
    copyError: "Copy failed",
    generated: "Generated",
  },
  ko: {
    title: "⚡ 애니 능력 생성기",
    desc: "독특한 애니 능력을 만들어보세요. 모든 능력에는 대가가 따릅니다.",
    btn: "✨ 생성하기",
    loading: "✨ 생성 중...",
    loadingSubtext: "애니 신들에게 자문 중...",
    copy: "📋 복사",
    copied: "✓ 복사됨!",
    copyError: "복사 실패",
    generated: "생성됨",
  },
  ja: {
    title: "⚡ アニメ能力生成器",
    desc: "ユニークなアニメの能力を作成。すべての能力には代償があります。",
    btn: "✨ 生成する",
    loading: "✨ 生成中...",
    loadingSubtext: "アニメの神々に相談中...",
    copy: "📋 コピー",
    copied: "✓ コピーしました！",
    copyError: "コピー失敗",
    generated: "生成数",
  },
  zh: {
    title: "⚡ 动漫能力生成器",
    desc: "创造独特的动漫能力——每个能力都有代价。",
    btn: "✨ 生成",
    loading: "✨ 生成中...",
    loadingSubtext: "向动漫神灵请教中...",
    copy: "📋 复制",
    copied: "✓ 已复制！",
    copyError: "复制失败",
    generated: "已生成",
  },
};

// Apply language
function applyLang(lang) {
  const t = UI_TEXT[lang] || UI_TEXT.en;
  title.textContent = t.title;
  desc.textContent = t.desc;
  btn.textContent = t.btn;
  copyBtn.textContent = t.copy;
  generatedLabel.textContent = t.generated;
}

// Theme functions
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  currentTheme = theme;
}

function applyColor(color) {
  if (color === "purple") {
    document.documentElement.removeAttribute("data-color");
  } else {
    document.documentElement.setAttribute("data-color", color);
  }
  localStorage.setItem("color", color);
  currentColor = color;
}

function toggleTheme() {
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  // Add flash effect to button
  themeToggle.classList.add("flash-effect");
  setTimeout(() => themeToggle.classList.remove("flash-effect"), 600);
}

function toggleColor() {
  const colors = ["purple", "blue", "green", "orange", "pink"];
  const currentIndex = colors.indexOf(currentColor);
  const nextIndex = (currentIndex + 1) % colors.length;
  const nextColor = colors[nextIndex];
  applyColor(nextColor);
  // Add flash effect to button
  colorToggle.classList.add("flash-effect");
  setTimeout(() => colorToggle.classList.remove("flash-effect"), 600);
}

// Initialize theme
applyTheme(currentTheme);
applyColor(currentColor);

// Theme toggle listeners
themeToggle.addEventListener("click", toggleTheme);
colorToggle.addEventListener("click", toggleColor);

// Detect browser language
function detectLanguage() {
  // Try multiple sources for browser language
  const browserLang = navigator.language || navigator.userLanguage || navigator.languages?.[0] || navigator.browserLanguage || "en";

  // Extract language code (e.g., "ko-KR" -> "ko")
  const langCode = browserLang.split("-")[0].toLowerCase();

  // Debug log (remove in production if needed)
  console.log("Detected browser language:", browserLang, "->", langCode);

  // Only set if supported
  if (["en", "ko", "ja", "zh"].includes(langCode)) {
    langSelect.value = langCode;
    console.log("Set language to:", langCode);
  } else {
    console.log("Language not supported, using default: en");
  }
}

// Toast notification
function showToast(message, duration = 2000) {
  toastMessage.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// Update stats display
function updateStats() {
  generatedCount.textContent = generatedTotal;
}

// Save to localStorage
function saveData() {
  localStorage.setItem("generatedTotal", generatedTotal.toString());
}

// Generate ability
btn.addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  btn.disabled = true;

  // Add flash effect to button
  btn.classList.add("flash-effect");
  setTimeout(() => btn.classList.remove("flash-effect"), 600);

  const lang = langSelect.value;
  const t = UI_TEXT[lang] || UI_TEXT.en;
  const loadingLabel = t.loading;

  // Show loading UI
  loadingContainer.hidden = false;
  loadingText.textContent = loadingLabel;
  loadingSubtext.textContent = t.loadingSubtext;
  resultText.classList.remove("show");
  resultActions.hidden = true;

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang }),
    });

    if (!res.ok) throw new Error("Request failed");
    const data = await res.json();

    currentResult = data.result || "";

    // Hide loading, show result
    loadingContainer.hidden = true;
    resultText.textContent = currentResult;

    // Show result with animation
    setTimeout(() => {
      resultText.classList.add("show");
      // Focus button for immediate Enter key repeat
      btn.focus();
    }, 50);

    resultActions.hidden = !currentResult;

    // Update stats
    if (currentResult) {
      generatedTotal++;
      updateStats();
      saveData();
    }
  } catch (e) {
    loadingContainer.hidden = true;
    resultText.textContent = "Error. Please try again.";
    resultText.classList.remove("loading");
    resultActions.hidden = true;
  } finally {
    busy = false;
    btn.disabled = false;
  }
});

// Copy to clipboard
copyBtn.addEventListener("click", async () => {
  if (!currentResult) return;

  try {
    await navigator.clipboard.writeText(currentResult);
    const lang = langSelect.value;
    const t = UI_TEXT[lang] || UI_TEXT.en;
    showToast(t.copied);
  } catch (e) {
    const lang = langSelect.value;
    const t = UI_TEXT[lang] || UI_TEXT.en;
    alert(t.copyError);
  }
});

// Language change
langSelect.addEventListener("change", () => {
  applyLang(langSelect.value);
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // ESC to close modal or clear result
  if (e.key === "Escape") {
    if (privacyModal.classList.contains("show")) {
      privacyModal.classList.remove("show");
    } else {
      currentResult = "";
      resultText.textContent = "";
      resultActions.hidden = true;
    }
  }

  // Enter to generate (if not typing in an input)
  if (e.key === "Enter" && !e.target.matches("input, textarea")) {
    e.preventDefault();
    btn.click();
  }
});

// Privacy modal
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

// Initialize
detectLanguage();
applyLang(langSelect.value);
updateStats();
