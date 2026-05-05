function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

var apiKeys = [
  { id: generateId(), name: "Production", prefix: "bol_sk_...xK4m", status: "active", created: "2026-04-12" },
  { id: generateId(), name: "Staging", prefix: "bol_sk_...pQ7n", status: "active", created: "2026-05-01" },
];

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(apiKeys.map(function (k) { return { id: k.id, name: k.name, prefix: k.prefix, status: k.status, created: k.created }; }));
  }
  if (req.method === "POST") {
    var name = req.body ? req.body.name : null;
    if (!name) return res.status(400).json({ error: "name required" });
    var fullKey = "bol_sk_" + generateId().replace(/-/g, "") + generateId().replace(/-/g, "");
    var entry = { id: generateId(), name: name, prefix: "bol_sk_..." + fullKey.slice(-4), fullKey: fullKey, status: "active", created: new Date().toISOString().split("T")[0] };
    apiKeys.push(entry);
    return res.status(200).json({ id: entry.id, name: entry.name, prefix: entry.prefix, fullKey: fullKey, status: entry.status, created: entry.created });
  }
  res.status(405).json({ error: "method not allowed" });
};
