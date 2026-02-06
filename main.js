const btn = document.getElementById("generateBtn");
const resultDiv = document.getElementById("result");
const resultText = document.getElementById("resultText");
const resultActions = document.getElementById("resultActions");
const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");
const langSelect = document.getElementById("langSelect");
const title = document.getElementById("title");
const desc = document.getElementById("desc");

const UI_TEXT = {
  en: {
    title: "Ability Paradox Generator",
    desc: "Generate a single sentence describing a powerful anime-style ability and its unavoidable debuff.",
    btn: "Generate",
    loading: "Generating...",
    copy: "Copy",
    share: "Share",
    copied: "Copied!",
    copyError: "Copy failed",
  },
  ko: {
    title: "능력 패러독스 생성기",
    desc: "강력한 애니 능력과 피할 수 없는 디버프를 한 문장으로 생성합니다.",
    btn: "생성하기",
    loading: "생성 중...",
    copy: "복사",
    share: "공유",
    copied: "복사됨!",
    copyError: "복사 실패",
  },
  ja: {
    title: "能力パラドックス生成器",
    desc: "強力なアニメ能力と致命的な制約を一文で生成します。",
    btn: "生成する",
    loading: "生成中...",
    copy: "コピー",
    share: "共有",
    copied: "コピーしました！",
    copyError: "コピー失敗",
  },
  zh: {
    title: "能力悖论生成器",
    desc: "生成一句包含强大能力与致命代价的动漫风格设定。",
    btn: "生成",
    loading: "生成中...",
    copy: "复制",
    share: "分享",
    copied: "已复制！",
    copyError: "复制失败",
  },
};

function applyLang(lang) {
  const t = UI_TEXT[lang] || UI_TEXT.en;
  title.textContent = t.title;
  desc.textContent = t.desc;
  btn.textContent = t.btn;
  copyBtn.textContent = "📋 " + t.copy;
  shareBtn.textContent = "🔗 " + t.share;
}

// Detect browser language and set default
function detectLanguage() {
  const browserLang = navigator.language || navigator.languages?.[0] || "en";
  const langCode = browserLang.split("-")[0]; // Extract "ko" from "ko-KR"

  // Check if detected language is supported
  if (["en", "ko", "ja", "zh"].includes(langCode)) {
    langSelect.value = langCode;
  }
}

detectLanguage();

langSelect.addEventListener("change", () => {
  applyLang(langSelect.value);
});

applyLang(langSelect.value);

let busy = false;

btn.addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  btn.disabled = true;

  const lang = langSelect.value;
  const loadingText = (UI_TEXT[lang] || UI_TEXT.en).loading;
  resultText.textContent = loadingText;
  resultActions.hidden = true;

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lang, debug: true }),
    });

    if (!res.ok) throw new Error("Request failed");
    const data = await res.json();
    resultText.textContent = data.result || "";
    resultActions.hidden = !data.result;
  } catch (e) {
    resultText.textContent = "Error. Please try again.";
    resultActions.hidden = true;
  } finally {
    busy = false;
    btn.disabled = false;
  }
});

// Copy to clipboard
copyBtn.addEventListener("click", async () => {
  const text = resultText.textContent;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    const lang = langSelect.value;
    const t = UI_TEXT[lang] || UI_TEXT.en;
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "✓ " + t.copied;
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  } catch (e) {
    const lang = langSelect.value;
    const t = UI_TEXT[lang] || UI_TEXT.en;
    alert(t.copyError);
  }
});

// Share
shareBtn.addEventListener("click", async () => {
  const text = resultText.textContent;
  if (!text) return;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Ability Paradox",
        text: text,
      });
    } catch (e) {
      // User cancelled or share failed
    }
  } else {
    // Fallback: copy to clipboard
    copyBtn.click();
  }
});
