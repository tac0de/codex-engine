exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { lang } = JSON.parse(event.body);

    const languageMap = {
      ko: "Korean",
      ja: "Japanese",
      zh: "Chinese",
      en: "English",
    };

    const outputLanguage = languageMap[lang] || "English";

    const prompt = `
Create ONE sentence describing an anime-style character ability with a powerful strength and a critical debuff.

Rules:
- No character names
- No story or worldbuilding
- No explanations
- Only one sentence
- Focus on ability and its cost or limitation
- Tone: anime / dramatic / concise
- Output language: ${outputLanguage}
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        input: prompt,
        max_output_tokens: 60,
      }),
    });

    const data = await response.json();

    // 🔴 핵심: 모든 text 조각을 안전하게 합침
    let text = "";

    if (data.output && Array.isArray(data.output)) {
      for (const item of data.output) {
        if (item.content && Array.isArray(item.content)) {
          for (const c of item.content) {
            if (c.type === "output_text" && c.text) {
              text += c.text;
            }
          }
        }
      }
    }

    text = text.trim();

    if (!text) {
      throw new Error("Empty model output");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result: text }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
