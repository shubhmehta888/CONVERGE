// Optional upgrade path: if ANTHROPIC_API_KEY is set, use Claude to parse
// the free-text query into structured intent instead of the keyword
// lexicon in parseQuery.js. Fully optional — everything works without it.

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

export const aiParsingEnabled = Boolean(API_KEY);

export async function parseQueryWithAI(rawQuery) {
  if (!API_KEY) return null;

  const system = `Extract structured search intent from a short natural-language
request for a hackathon teammate. Reply with ONLY minified JSON, no prose,
matching exactly this shape:
{"skills": string[], "roles": string[], "availability": string[]}
- skills: concrete technical/skill keywords mentioned or implied (e.g. "React", "Figma", "RAG")
- roles: broad category words from this fixed set only: frontend, backend, full-stack, mobile, design, ml, data, growth, infra
- availability: from this fixed set only: tonight, this-week, weekend, remote, late-night`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        system,
        messages: [{ role: "user", content: rawQuery }]
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = (data.content || [])
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim()
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    const parsed = JSON.parse(text);
    return {
      raw: rawQuery,
      skills: Array.isArray(parsed.skills) ? parsed.skills.map((s) => s.toLowerCase()) : [],
      roles: Array.isArray(parsed.roles) ? parsed.roles : [],
      availability: Array.isArray(parsed.availability) ? parsed.availability : []
    };
  } catch (err) {
    console.warn("AI parser failed, falling back to keyword parser:", err.message);
    return null;
  }
}
