const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const apiKeys = [
  { id: uuidv4(), name: "Production", prefix: "bol_sk_...xK4m", status: "active", created: "2026-04-12" },
  { id: uuidv4(), name: "Staging", prefix: "bol_sk_...pQ7n", status: "active", created: "2026-05-01" },
];

app.get("/api/keys", (req, res) => {
  res.json(apiKeys.map(k => ({ id: k.id, name: k.name, prefix: k.prefix, status: k.status, created: k.created })));
});

app.post("/api/keys", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  const fullKey = "bol_sk_" + uuidv4().replace(/-/g, "");
  const entry = { id: uuidv4(), name, prefix: "bol_sk_..." + fullKey.slice(-4), fullKey, status: "active", created: new Date().toISOString().split("T")[0] };
  apiKeys.push(entry);
  res.json({ id: entry.id, name: entry.name, prefix: entry.prefix, fullKey, status: entry.status, created: entry.created });
});

app.delete("/api/keys/:id", (req, res) => {
  const idx = apiKeys.findIndex(k => k.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "not found" });
  apiKeys[idx].status = "revoked";
  res.json({ ok: true });
});

app.get("/api/usage", (req, res) => {
  res.json({
    requestsToday: 1247,
    requestsLimit: 2000,
    tokensWeek: 4200000,
    costWeek: 21,
    avgTps: 312,
    p50Latency: 86,
    daily: [580, 720, 440, 910, 640, 1050, 840],
    models: [
      { name: "Qwen3-35B-A3B", tokens: 2800000, pct: 67 },
      { name: "DeepSeek-V3", tokens: 1100000, pct: 26 },
      { name: "GLM-4", tokens: 300000, pct: 7 },
    ],
  });
});

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bol.ai server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
