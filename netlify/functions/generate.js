// =====================================================
// THE DIVINE PARADOX - Generation Logic
// =====================================================

const FALLBACKS = {
  en: [
    "Can rewrite reality itself, but each alteration permanently erases one of your own memories.",
    "Wields absolute time manipulation, but ages 10 years for every minute you freeze time.",
    "Possesses the power of resurrection, but can only bring back those who died by your own hand.",
    "Can grant any wish, but the cost is always paid by someone you love.",
    "Has complete invulnerability, but loses the ability to feel any physical sensation forever.",
    "Can read every mind in existence, but hears their darkest thoughts as an endless screaming chorus.",
    "Commands the elements of nature, but your own body slowly turns into inorganic matter.",
    "Wields infinite knowledge, but are paralyzed by the weight of knowing every future tragedy.",
    "Can travel anywhere instantly, but leave a trail of corrupted space that eventually consumes everything.",
    "Has the power to heal any wound, but transfers the injury to your own body permanently.",
  ],
  ko: [
    "현실 자체를 재작성할 수 있지만,每一次변경 때마다 자신의 기억 하나가 영구히 사라진다.",
    "절대적인 시간 조종 능력을 지니지만, 시간을 멈출 때마다 10년씩 늙어간다.",
    "부활의 힘을 지니지만, 자신의 손에 죽은 자만 되살릴 수 있다.",
    "모든 소원을 이룰 수 있지만, 그 대가는 항상 당신이 사랑하는 누군가가 치른다.",
    "완전한 무적의 육체를 지니지만, 어떤 물리적 감각도 영원히 느낄 수 없다.",
    "존재하는 모든 마음을 읽을 수 있지만, 가장 어두운 생각들이 끊임없이 울리는 합창처럼 들린다.",
    "자연의 원소를 지배하지만, 자신의 몸이 서서히 무기질로 변해간다.",
    "무한한 지식을 지니지만, 닥쳐올 모든 비극을 아는 무게에 마비된다.",
    "어디든 순간이동할 수 있지만, 지나온 공간이 서서히 부패하여 결국 모든 것을 집어삼킨다.",
    "모든 상처를 치유할 수 있지만, 부상을 자신의 몸으로 영구히 옮겨받는다.",
  ],
  ja: [
    "現実そのものを書き換えられるが、毎回の変更で自分の記憶が一つ永遠に消える。",
    "絶対的な時間操作能力を持つが、時間を止めるたびに10年ずつ老化する。",
    "復活の力を持つが、自分の手で死んだ者しか蘇らせることができない。",
    "あらゆる願いを叶えられるが、その代償は常にあなたが愛する誰かが払う。",
    "完全な無敵の肉体を持つが、どのような物理的感覚も永遠に感じることができない。",
    "存在する全ての心を読めるが、最も暗い思考が終わりない叫びの合唱のように聞こえる。",
    "自然の要素を支配するが、自分の体が徐々に無機質に変わっていく。",
    "無限な知識を持つが、訪れる全ての悲劇を知っている重さで麻痺する。",
    "どこへでも瞬間移動できるが、通過した空間が徐々に腐敗し、最終的に全てを飲み込む。",
    "あらゆる傷を治癒できるが、その傷を自分の体に永遠に移す。",
  ],
  zh: [
    "能改写现实本身，但每次改变都会永久抹去你的一段记忆。",
    "拥有绝对的时间操控能力，但每暂停一秒时间你就会衰老十年。",
    "拥有复活的力量，但只能复活死于你自己之手的人。",
    "能实现任何愿望，但代价总是由你爱的人来支付。",
    "拥有完全的刀枪不入，但永远失去任何触觉。",
    "能读取所有存在的思想，但最黑暗的想法会像无尽的尖叫合唱一样在你脑中回响。",
    "能掌控自然元素，但你的身体会慢慢变成无机物质。",
    "拥有无穷的知识，但被预见所有悲剧的重量所麻痹。",
    "能瞬间传送到任何地方，但留下的扭曲空间最终会吞噬一切。",
    "能治愈任何伤口，但伤害会永久转移到你自己的身体上。",
  ],
};

// Ability categories for variety
const ABILITY_CATEGORIES = [
  "time manipulation",
  "reality warping",
  "mind control",
  "elemental power",
  "teleportation",
  "immortality",
  "precognition",
  "telekinesis",
  "shapeshifting",
  "energy manipulation",
  "soul manipulation",
  "dimension travel",
  "healing",
  "summoning",
  " curse bestowal",
];

// Drawback categories
const DRAWBACK_CATEGORIES = [
  "memory loss",
  "physical transformation",
  "emotional damage",
  "reduced lifespan",
  "loss of sensation",
  "involuntary harm to loved ones",
  "gradual loss of humanity",
  "uncontrollable side effects",
  "cosmic balance payment",
  "eternal consequences",
];

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

function extractOutputText(raw) {
  if (raw?.error?.message) {
    throw new Error(`OpenAI error: ${raw.error.message}`);
  }
  if (
    raw?.status === "incomplete" &&
    raw?.incomplete_details?.reason === "max_output_tokens"
  ) {
    throw new Error("OpenAI response incomplete: max_output_tokens");
  }

  const output = Array.isArray(raw?.output) ? raw.output : [];
  for (const item of output) {
    if (item?.type === "message" && Array.isArray(item.content)) {
      const refusal = item.content.find((c) => c?.type === "refusal");
      if (refusal?.refusal) {
        throw new Error(`OpenAI refusal: ${refusal.refusal}`);
      }

      const text = item.content
        .filter((c) => c?.type === "output_text")
        .map((c) => c.text)
        .join("");
      if (text.trim()) return text;
    }

    if (item?.type === "output_text" && typeof item.text === "string") {
      if (item.text.trim()) return item.text;
    }
  }

  const fallback = extractText(raw);
  if (fallback) return fallback;

  throw new Error("Empty OpenAI response");
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryableError(err) {
  const status = err?.status;
  const code = err?.code;
  const type = err?.type;
  return (
    status >= 500 ||
    code === "server_error" ||
    type === "server_error" ||
    (typeof err?.message === "string" &&
      err.message.includes("server_error"))
  );
}

function getCachedResult(lang) {
  try {
    // This won't work in serverless, but frontend will send recent abilities
    return "";
  } catch {
    return "";
  }
}

// Generate a more varied system prompt
function generateSystemPrompt() {
  const introPhrases = [
    "You are a Divine Entity offering blessed gifts with inherent burdens.",
    "You represent the paradox of power - every ability carries its cost.",
    "You are the Voice of the Divine, bestowing cursed gifts upon mortals.",
  ];

  const intro = introPhrases[Math.floor(Math.random() * introPhrases.length)];

  return `${intro}

Generate ONE single sentence describing:
1. A powerful, supernatural ability (god-like, reality-altering, or beyond human comprehension)
2. Its terrible, unavoidable cost (a burden, curse, or consequence)

Rules:
- Maximum 25 words total
- No names, no stories, no explanations
- Start immediately with the ability
- Use "but" or similar to connect power and cost
- Make the cost deeply personal, permanent, or devastating
- Be creative and unexpected - avoid common tropes
- The power must feel divine, the cost must feel absolute`;
}

// Generate varied user prompt with context
function generateUserPrompt(lang, recentAbilities = []) {
  const languageMap = {
    ko: "Korean",
    ja: "Japanese",
    zh: "Chinese",
    en: "English",
  };
  const outputLanguage = languageMap[lang] || "English";

  let prompt = `Write in ${outputLanguage}.\n\n`;

  // Add variety based on attempt
  const varietyInstructions = [
    "Focus on TIME or FATE.",
    "Focus on BODY or MIND.",
    "Focus on REALITY or EXISTENCE.",
    "Focus on OTHERS or RELATIONSHIPS.",
    "Focus on KNOWLEDGE or PERCEPTION.",
    "Focus on LIFE or DEATH.",
  ];
  const focus = varietyInstructions[Math.floor(Math.random() * varietyInstructions.length)];
  prompt += `${focus}\n\n`;

  // Example format
  const examples = [
    '"Can rewrite reality itself, but each alteration permanently erases one of your own memories."',
    '"Wields absolute time manipulation, but ages 10 years for every minute you freeze time."',
    '"Possesses the power of resurrection, but can only bring back those who died by your own hand."',
    '"Can grant any wish, but the cost is always paid by someone you love."',
    '"Has complete invulnerability, but loses the ability to feel any physical sensation forever."',
  ];
  const example = examples[Math.floor(Math.random() * examples.length)];
  prompt += `Example format:\n${example}\n\n`;

  // Avoidance context if recent abilities provided
  if (recentAbilities && recentAbilities.length > 0) {
    prompt += `AVOID these recent gifts (do NOT repeat):\n`;
    recentAbilities.slice(0, 5).forEach((ability, i) => {
      prompt += `${i + 1}. "${ability}"\n`;
    });
    prompt += `\n`;
  }

  prompt += `Now generate a NEW, UNIQUE ability. Output ONLY valid JSON: {"result":"..."}`;

  return prompt;
}

exports.handler = async (event) => {
  const body = safeParseBody(event.body);
  const lang = body?.lang || "en";
  const recentAbilities = body?.recentAbilities || [];
  const debug =
    body?.debug === true ||
    event?.queryStringParameters?.debug === "1" ||
    process.env.DEBUG_OPENAI === "1";
  const fallbackText = pickFallback(lang);
  const respond = (result, info) => buildResponse(result, debug, info);
  const requestId =
    event?.headers?.["x-nf-request-id"] ||
    event?.headers?.["x-request-id"] ||
    null;

  console.log("generate:start", {
    requestId,
    method: event?.httpMethod,
    path: event?.path,
    debug,
    recentCount: recentAbilities.length,
  });

  try {
    const apiKey =
      process.env.OPENAI_API_KEY ||
      process.env.OPENAI_KEY ||
      process.env.OPENAI_API_TOKEN;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return respond(fallbackText, {
        source: "fallback",
        reason: "missing_api_key",
      });
    }

    const model = process.env.OPENAI_MODEL || "gpt-5-nano";

    const SYSTEM_PROMPT = generateSystemPrompt();
    const USER_PROMPT = generateUserPrompt(lang, recentAbilities);

    const responseFormat = {
      type: "json_schema",
      name: "ability_sentence",
      strict: true,
      schema: {
        type: "object",
        properties: {
          result: { type: "string" },
        },
        required: ["result"],
        additionalProperties: false,
      },
    };

    const requestOnce = async (maxTokens) => {
      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          reasoning: { effort: "low" },
          text: {
            format: responseFormat,
            verbosity: "low",
          },
          input: [
            {
              role: "system",
              content: [{ type: "input_text", text: SYSTEM_PROMPT }],
            },
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: USER_PROMPT,
                },
              ],
            },
          ],
          max_output_tokens: maxTokens,
        }),
      });

      if (!res.ok) {
        const raw = await res.json().catch(() => null);
        const message =
          raw?.error?.message || `OpenAI error: ${res.status}`;
        const error = new Error(message);
        error.status = res.status;
        error.code = raw?.error?.code;
        error.type = raw?.error?.type;
        error.request_id =
          raw?.error?.request_id ||
          raw?.error?.requestId ||
          null;
        throw error;
      }

      return res.json();
    };

    const tokenAttempts = [200, 500, 1000];
    const retryDelays = [0, 400, 900];
    let outputText = "";
    let lastError = null;

    for (const tokens of tokenAttempts) {
      for (let i = 0; i < retryDelays.length; i++) {
        try {
          if (retryDelays[i] > 0) await sleep(retryDelays[i]);
          const data = await requestOnce(tokens);
          outputText = extractOutputText(data);
          if (outputText.trim()) break;
        } catch (e) {
          lastError = e;
          const message = e instanceof Error ? e.message : String(e);
          const retryable = isRetryableError(e);
          const isMaxToken = message.includes("max_output_tokens");
          if (isMaxToken) {
            break;
          }
          if (!retryable || i === retryDelays.length - 1) {
            console.error("Raw OpenAI response error:", e);
          } else {
            console.warn("Retrying OpenAI request after server_error");
            continue;
          }
        }
      }
      if (outputText.trim()) break;
    }

    if (!outputText.trim()) {
      const message =
        lastError instanceof Error ? lastError.message : String(lastError);
      console.error("OpenAI response failed, using fallback:", message);
      const cached = getCachedResult(lang);
      if (cached) {
        return respond(cached, {
          source: "cache",
          reason: "openai_error",
          error: message,
        });
      }
      return respond(fallbackText, {
        source: "fallback",
        reason: "openai_error",
        error: message,
      });
    }

    let result = "";
    try {
      const parsed = JSON.parse(outputText);
      result = String(parsed?.result ?? "").trim();
    } catch (parseError) {
      console.error("OpenAI parse failed, using fallback:", parseError);
      return respond(fallbackText, {
        source: "fallback",
        reason: "parse_error",
      });
    }

    if (!result) {
      const cached = getCachedResult(lang);
      if (cached) {
        return respond(cached, {
          source: "cache",
          reason: "empty_result",
        });
      }
      return respond(fallbackText, {
        source: "fallback",
        reason: "empty_result",
      });
    }

    return respond(result, { source: "openai", model });
  } catch (err) {
    console.error("Function error", err);
    const cached = getCachedResult(lang);
    if (cached) {
      return respond(cached, {
        source: "cache",
        reason: "exception",
        error: err?.message,
      });
    }
    return respond(fallbackText, {
      source: "fallback",
      reason: "exception",
      error: err?.message,
    });
  }
};
