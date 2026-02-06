const FALLBACKS = {
  en: [
    "Can rewrite memories, but forgets their own name each time.",
    "Can teleport anywhere, but arrives with a shattered bone.",
    "Can heal any wound, but takes the pain as permanent scars.",
    "Can see the future, but goes blind for a day after each vision.",
    "Can control metal, but their heart slowly turns to iron.",
  ],
  ko: [
    "기억을 바꿀 수 있지만, 사용할 때마다 자신의 이름을 잊는다.",
    "순간이동할 수 있지만, 도착할 때마다 뼈가 하나씩 부러진다.",
    "어떤 상처든 치유하지만, 그 고통이 영원한 흉터가 된다.",
    "미래를 볼 수 있지만, 매번 하루 동안 실명한다.",
    "금속을 지배하지만, 심장이 점점 철이 되어간다.",
  ],
  ja: [
    "記憶を改ざんできるが、使うたびに自分の名前を忘れる。",
    "どこへでも瞬間移動できるが、到着時に骨が一つ砕ける。",
    "あらゆる傷を癒せるが、その痛みが永遠の傷跡になる。",
    "未来が見えるが、見るたびに一日だけ失明する。",
    "金属を操れるが、心臓が少しずつ鉄になる。",
  ],
  zh: [
    "能改写记忆，但每次使用都会忘记自己的名字。",
    "能瞬间移动，但每次到达都会骨折一处。",
    "能治愈任何伤口，但痛苦会化作永久疤痕。",
    "能预见未来，但每次都会失明一天。",
    "能操控金属，但心脏会慢慢变成铁。",
  ],
};

function pickFallback(lang) {
  const list = FALLBACKS[lang] || FALLBACKS.en;
  return list[Math.floor(Math.random() * list.length)];
}

function extractText(raw) {
  let text = "";

  if (typeof raw?.output_text === "string") {
    text = raw.output_text;
  }

  if (!text && Array.isArray(raw?.output)) {
    for (const item of raw.output) {
      if (typeof item?.text === "string") {
        text += item.text;
        continue;
      }
      if (Array.isArray(item?.content)) {
        for (const c of item.content) {
          if (
            typeof c?.text === "string" &&
            (c.type === "output_text" || c.type === "text" || !c.type)
          ) {
            text += c.text;
          }
        }
      }
    }
  }

  if (!text && Array.isArray(raw?.choices)) {
    const choiceText = raw.choices[0]?.message?.content;
    if (typeof choiceText === "string") text = choiceText;
  }

  return text.trim();
}

function safeParseBody(body) {
  try {
    return JSON.parse(body || "{}");
  } catch {
    return {};
  }
}

function buildResponse(result, debug, debugInfo) {
  const body = debug
    ? { result, debug: debugInfo || {} }
    : { result };
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  const body = safeParseBody(event.body);
  const lang = body?.lang || "en";
  const debug =
    body?.debug === true ||
    event?.queryStringParameters?.debug === "1";
  const fallbackText = pickFallback(lang);
  const respond = (result, info) => buildResponse(result, debug, info);

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return respond(fallbackText, {
        source: "fallback",
        reason: "missing_api_key",
      });
    }

    const languageMap = {
      ko: "Korean",
      ja: "Japanese",
      zh: "Chinese",
      en: "English",
    };
    const outputLanguage = languageMap[lang] || "English";
    const model = process.env.OPENAI_MODEL || "gpt-5-nano";

    const SYSTEM_PROMPT = `
You generate ONE short anime-style sentence.
Describe a powerful ability and its serious drawback.
No names. No story. One sentence only.
`;

    const USER_PROMPT = `
Write it naturally in ${outputLanguage}.

Example:
"Can stop time, but loses a year of life each time the power is used."

Now write a new sentence.
`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        reasoning: { effort: "low" },
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: SYSTEM_PROMPT }],
          },
          {
            role: "user",
            content: [{ type: "input_text", text: USER_PROMPT }],
          },
        ],
        max_output_tokens: 80,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    const raw = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("OpenAI API error", res.status, raw);
      return respond(fallbackText, {
        source: "fallback",
        reason: "openai_error",
        status: res.status,
        error: raw?.error?.message,
      });
    }

    const text = extractText(raw) || fallbackText;

    return respond(text, {
      source: text === fallbackText ? "fallback" : "openai",
      model,
    });
  } catch (err) {
    console.error("Function error", err);
    return respond(fallbackText, {
      source: "fallback",
      reason: "exception",
      error: err?.message,
    });
  }
};
