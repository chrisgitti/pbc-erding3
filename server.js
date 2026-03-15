const http = require("http");
const fs   = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = 3003;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".htm":  "text/html; charset=utf-8",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".json": "application/json",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".webp": "image/webp",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".mp3":  "audio/mpeg",
  ".pdf":  "application/pdf",
};

// ── Security Headers ───────────────────────────────────────────

function setSecurityHeaders(res) {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://cdn.jsdelivr.net; img-src 'self' data:; frame-ancestors 'none'");
}

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      setSecurityHeaders(res);
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }
    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || "application/octet-stream";
    setSecurityHeaders(res);
    res.writeHead(200, { "Content-Type": mime });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);

  // Dot-Verzeichnisse sperren (.git, .env usw.)
  if (url.split("/").some(p => p.startsWith("."))) {
    setSecurityHeaders(res);
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("403 Forbidden");
    return;
  }

  let filePath = path.join(ROOT, url);

  // Path-Traversal-Schutz: Pfad muss innerhalb ROOT bleiben
  const resolvedPath = path.resolve(filePath);
  const resolvedRoot = path.resolve(ROOT);
  if (!resolvedPath.startsWith(resolvedRoot + path.sep) && resolvedPath !== resolvedRoot) {
    setSecurityHeaders(res);
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("403 Forbidden");
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    for (const idx of ["index.html", "index.htm"]) {
      const candidate = path.join(filePath, idx);
      if (fs.existsSync(candidate)) { filePath = candidate; break; }
    }
  }

  serveFile(filePath, res);
});

server.listen(PORT, () => {
  console.log(`pbc-erding3 läuft auf http://localhost:${PORT}`);
});
