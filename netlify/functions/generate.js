exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { lang = "en" } = JSON.parse(event.body || "{}");

    const languageMap = {
      ko: "Korean",
      ja: "Japanese",
      zh: "Chinese",
      en: "English",
    };
    const outputLanguage = languageMap[lang] || "English";

    const SYSTEM_PROMPT = `
You generate ONE short anime-style sentence.
The sentence must describe:
- a powerful ability
- a serious cost or limitation

Do not write a story.
Do not include names.
Keep it natural and concise.
`;

    const USER_PROMPT = `
Write the sentence in ${outputLanguage}.

Example:
"Can stop time, but loses a year of life each time the power is used."

Now write a new sentence.
`;

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
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
    });

    const raw = await res.json();

    let text = "";

    const output = Array.isArray(raw?.output) ? raw.output : [];
    for (const item of output) {
      if (item?.type === "message" && Array.isArray(item.content)) {
        text = item.content
          .filter((c) => c.type === "output_text")
          .map((c) => c.text)
          .join("");
        if (text.trim()) break;
      }
    }

    if (!text.trim()) {
      throw new Error("Empty OpenAI output");
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: text.trim() }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
