module.exports = function handler(req, res) {
  res.status(200).json({
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
};
