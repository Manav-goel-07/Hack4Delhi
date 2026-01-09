export function assessRisk(text) {
  const riskyWords = ["always", "never", "abolish", "dictatorship"];
  const score = riskyWords.filter(w =>
    text.toLowerCase().includes(w)
  ).length;

  return score > 1 ? "⚠️ May require verification" : "✅ Informational";
}

const reply = await askBot(req.body.message);
const risk = assessRisk(req.body.message);

res.json({ reply, risk });