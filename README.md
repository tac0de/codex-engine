## OpenAI API Design (Responses API)

This project uses the **OpenAI Responses API** as a small, reliable “generation engine” behind a simple web UI.
The goal is not maximum complexity, but **predictable output** (one short sentence) with **strong guardrails** and **graceful failure**.

### High-Level Flow

1. Frontend sends a request with:
   - `lang` (output language)
   - `recentAbilities` (to avoid repetition)
   - `preferencePatterns` (light preference learning signals)
   - optional `debug`

2. A serverless function builds prompts and calls `POST https://api.openai.com/v1/responses`
3. The model returns **strict JSON**: `{"result":"..."}`
4. The function validates, parses, and returns `{ result }` (or a fallback sentence on failure)

This keeps the browser fully static and avoids exposing any API keys.

---

## Why Responses API (Not Chat Completions)

Responses provides a modern interface for structured outputs and consistent extraction.
This project takes advantage of:

- **Structured outputs** via `text.format` + `json_schema`
- A unified response shape that can be parsed and validated
- Clear handling for “incomplete output” and refusals

---

## Prompt Architecture

### 1) System Prompt = Rules & Identity

The system prompt defines the “Divine Entity” voice and hard constraints:

- Generate **ONE sentence**: (power) + (cost)
- **Max 25 words**
- No names, no stories, no explanations
- Connect power and cost with “but” (or equivalent)
- The power must feel divine; the cost must be personal and permanent

This enforces consistency even when user prompts vary.

### 2) User Prompt = Variation & Personalization

The user prompt injects controlled variety without breaking the rules:

- Output language guidance:
  - Korean: spacing guidance (띄어쓰기)
  - Japanese/Chinese: no spaces, natural punctuation

- **Cultural inspiration** per language (mythology / literary tone)
- “Preference learning” signals:
  - `combo` ramps up creativity and magnitude
  - `attitude` shifts benevolent vs ominous tone
  - `recentLiked` and `recentSkipped` bias toward/away from patterns

- Anti-repeat constraint:
  - `recentAbilities` list is explicitly marked as “do not repeat”

This creates novelty while keeping output short and well-formed.

---

## Structured Output (Strict JSON)

To make parsing reliable, the request uses a strict JSON schema:

- `text.format: { type: "json_schema", strict: true, schema: { result: string } }`

Expected model output:

```json
{ "result": "..." }
```

Benefits:

- The serverless function can safely `JSON.parse()` with minimal heuristics
- Failures become explicit (parse error vs provider error vs empty output)

---

## Reliability Strategy

### Multi-Attempt Token Budget

The function tries escalating `max_output_tokens`:

- 200 → 500 → 1000

This handles occasional “too short” or “incomplete” responses without overpaying upfront.

### Retry Policy (Server Errors Only)

A retry happens only when the error looks like a provider/server issue:

- HTTP 5xx
- `server_error` codes/types
- server_error text in the message

Delays are small and bounded:

- 0ms → 400ms → 900ms

If an error is not retryable, the function fails fast.

### Hard Failure Modes (No Infinite Loops)

The function treats these as terminal:

- `max_output_tokens` incomplete responses
- refusal content
- empty or unparsable output after attempts

This prevents runaway costs and avoids hanging requests.

---

## Extraction & Validation

Even though output is expected as strict JSON, the implementation is defensive:

- Detects provider errors (`raw.error.message`)
- Detects incomplete output (`status === "incomplete"`)
- Detects refusals inside `output[].content[].type === "refusal"`
- Extracts text from multiple possible shapes (robust parsing fallback)

Finally:

- Parses JSON and reads `result`
- If missing/empty, falls back cleanly

---

## Fallback & Graceful Degradation

If OpenAI is unavailable (missing key, downtime, parse issues), the user still gets a valid “gift” sentence.

Fallback sources:

1. (Optional) cached result (placeholder in this repo)
2. Language-specific curated fallback lists (`FALLBACKS[lang]`)
3. Default English fallback

This ensures the UI never “breaks” and user experience stays consistent.

---

## Debug Mode (Safe Observability)

Debug can be enabled via:

- Request body: `debug: true`
- Query string: `?debug=1`
- Env: `DEBUG_OPENAI=1`

When enabled, the API response includes:

- the source (`openai` / `fallback` / `cache`)
- model name
- error reasons when applicable

In normal mode, the response is minimal:

```json
{ "result": "..." }
```

---

## Privacy & Security Notes

- API keys live only in serverless environment variables
- The browser never sees credentials
- Inputs are intentionally small and non-sensitive
- Logging avoids leaking user data (only high-level counters and request IDs)

---

## Tuning Points (If You Fork This)

- Swap `OPENAI_MODEL` to trade quality vs cost
- Adjust token budgets (200/500/1000) based on observed truncation rate
- Expand fallback sets per language
- Add real caching (KV/Redis) if you want “recent best” reuse during outages
