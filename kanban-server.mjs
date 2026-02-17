import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = process.cwd();
const BOARD_FILE = path.join(ROOT, "KANBAN-STATUS.md");
const HTML_FILE = path.join(ROOT, "kanban-daily-tracker.html");

const seedCards = [
  ["ST-001", "App shell layout", "Eng A", "P1", "in_progress"],
  ["ST-002", "Theme tokens + primitives", "Eng A", "P1", "backlog"],
  ["ST-003", "Responsive navigation model", "Eng A", "P1", "backlog"],
  ["ST-004", "Accessibility baseline", "Eng A", "P2", "backlog"],
  ["ST-005", "Monaco editor integration", "Eng B", "P1", "in_progress"],
  ["ST-006", "Sandbox runtime executor", "Eng B", "P1", "backlog"],
  ["ST-007", "Run/reset flow", "Eng B", "P2", "backlog"],
  ["ST-008", "Lesson schema loader", "Eng B", "P1", "backlog"],
  ["ST-009", "Render timeline component", "Eng D", "P1", "backlog"],
  ["ST-010", "Dependency diff inspector", "Eng D", "P1", "backlog"],
  ["ST-011", "Hook call-order tracker", "Eng D", "P2", "backlog"],
  ["ST-012", "Visualizer adapter API", "Eng D", "P1", "backlog"],
  ["ST-013", "Check runner contract", "Eng C", "P1", "in_progress"],
  ["ST-014", "Gate state machine", "Eng C", "P1", "backlog"],
  ["ST-015", "Retry policy", "Eng C", "P1", "backlog"],
  ["ST-016", "Hint ladder unlock", "Eng C", "P1", "backlog"],
  ["ST-017", "Multiple valid solutions rules", "Eng C", "P2", "backlog"],
  ["ST-018", "Progress local persistence", "Eng C", "P2", "backlog"],
  ["ST-019", "Completion ledger", "Eng C", "P2", "backlog"],
  ["ST-020", "Proficiency validator", "Eng C", "P1", "backlog"],
  ["ST-021", "Badge issuance UI", "Eng C/A", "P2", "backlog"],
  ["ST-022", "Module 1 content + gate", "Eng B", "P2", "backlog"],
  ["ST-023", "Module 2 content + gate", "Eng B", "P2", "backlog"],
  ["ST-024", "Module 3 content + gate", "Eng B", "P1", "backlog"],
  ["ST-025", "Module 4 content + gate", "Eng B", "P2", "backlog"],
  ["ST-026", "Debug labs content", "Eng B", "P1", "backlog"],
  ["ST-027", "Capstone rubric + tests", "Eng C/B", "P1", "backlog"],
  ["ST-028", "Final assessment flow", "Eng B", "P1", "backlog"],
  ["ST-029", "Telemetry schema", "Eng D", "P2", "backlog"],
  ["ST-030", "Telemetry dispatcher", "Eng D", "P2", "backlog"],
  ["ST-031", "Analytics adapters", "Eng D", "P3", "backlog"],
  ["ST-032", "Failure classifier", "Eng D", "P3", "backlog"],
  ["ST-033", "E2E gate tests", "Shared", "P1", "backlog"],
  ["ST-034", "Cross-device QA", "Shared", "P1", "backlog"],
  ["ST-035", "Performance checks", "Shared", "P2", "backlog"],
  ["ST-036", "Pilot + release checklist", "Shared", "P2", "backlog"]
];

function seedState() {
  return seedCards.map((row, index) => ({
    id: row[0],
    title: row[1],
    owner: row[2],
    priority: row[3],
    status: row[4],
    notes: "",
    order: index + 1
  }));
}

function markdownFromCards(cards) {
  const now = new Date().toISOString();
  const json = JSON.stringify(cards, null, 2);
  return `# Kanban Status\n\nLast updated: ${now}\n\nThis file is the source of truth for the daily kanban board.\n\n\`\`\`json\n${json}\n\`\`\`\n`;
}

function parseCardsFromMarkdown(content) {
  const match = content.match(/```json\n([\s\S]*?)\n```/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1]);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function ensureBoardFile() {
  try {
    const raw = await fs.readFile(BOARD_FILE, "utf8");
    const cards = parseCardsFromMarkdown(raw);
    if (cards) return cards;
  } catch {}
  const cards = seedState();
  await fs.writeFile(BOARD_FILE, markdownFromCards(cards), "utf8");
  return cards;
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/kanban-daily-tracker.html")) {
    const html = await fs.readFile(HTML_FILE, "utf8");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/board") {
    try {
      const cards = await ensureBoardFile();
      const stat = await fs.stat(BOARD_FILE);
      sendJson(res, 200, { cards, updatedAt: stat.mtime.toISOString(), file: path.basename(BOARD_FILE) });
    } catch (error) {
      sendJson(res, 500, { error: String(error) });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/board") {
    try {
      const body = await parseBody(req);
      if (!body || !Array.isArray(body.cards)) {
        sendJson(res, 400, { error: "body.cards must be an array" });
        return;
      }
      await fs.writeFile(BOARD_FILE, markdownFromCards(body.cards), "utf8");
      const stat = await fs.stat(BOARD_FILE);
      sendJson(res, 200, { ok: true, updatedAt: stat.mtime.toISOString(), file: path.basename(BOARD_FILE) });
    } catch (error) {
      sendJson(res, 500, { error: String(error) });
    }
    return;
  }

  sendJson(res, 404, { error: "not found" });
});

server.listen(PORT, HOST, () => {
  console.log(`Kanban server listening on http://${HOST}:${PORT}`);
});
