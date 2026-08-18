/**
 * ローカル確認用の簡易プレビューサーバ。
 *
 * `vite preview` は vercel.json の rewrites を解釈しないため、
 * 本番(Vercel)と同じルーティング(静的ファイル優先 → rewrites)を再現して
 * dist/ を配信する。リスキリングLP( /services/ai-training/reskilling )と
 * 本体SPAの両方をローカルで確認できる。
 *
 * 使い方:
 *   npm run build            # 本体サイト + public/ の同梱物をdist/へ
 *   npm run preview:vercel   # http://localhost:4173
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const PORT = Number(process.env.PORT || 4173);

if (!fs.existsSync(DIST)) {
  console.error("dist/ がありません。先に `npm run build` を実行してください。");
  process.exit(1);
}

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

// vercel.json の rewrites をそのまま使う(APIはローカルでは動かないので除外)
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf-8"));
const rewrites = (vercel.rewrites || [])
  .filter((r) => !r.source.startsWith("/api/"))
  .map((r) => ({
    re: new RegExp(`^${r.source.replace(/\/$/, "")}\\/?$`),
    destination: r.destination,
  }));

function resolveFile(urlPath) {
  const candidate = path.join(DIST, urlPath);
  if (!candidate.startsWith(DIST)) return null; // パストラバーサル防止
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  return null;
}

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);

    // 1. 静的ファイル優先(Vercelと同じ順序)
    let file = resolveFile(urlPath);

    // 2. rewrites
    if (!file) {
      for (const rule of rewrites) {
        if (rule.re.test(urlPath)) {
          file = resolveFile(rule.destination);
          break;
        }
      }
    }

    if (!file) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }

    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(fs.readFileSync(file));
  })
  .listen(PORT, () => {
    console.log(`\nプレビュー: http://localhost:${PORT}`);
    console.log(`リスキリングLP: http://localhost:${PORT}/services/ai-training/reskilling\n`);
  });
