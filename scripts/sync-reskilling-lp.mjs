/**
 * ai-reskilling-site (生成AIリスキリング研修LP) のビルド成果物を
 * 本体サイトの public/services/ai-training/reskilling/ に同期する。
 *
 * 本体サイトは Vite の public/ をそのまま dist/ にコピーするため、
 * ここに置いたファイルが https://meta-heroes.co.jp/services/ai-training/reskilling/
 * として配信される。
 *
 * 使い方: npm run build:reskilling-lp
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "ai-reskilling-site", "dist", "public");
const DEST = path.join(ROOT, "public", "services", "ai-training", "reskilling");

// 開発用ツール(Manusプレビュー)や説明用ドキュメントは配信物に含めない
const EXCLUDE = new Set(["__manus__", "README.md"]);

if (!fs.existsSync(SRC)) {
  console.error(`ビルド成果物が見つかりません: ${SRC}\n先に ai-reskilling-site で pnpm run build を実行してください。`);
  process.exit(1);
}

fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(DEST, { recursive: true });

let count = 0;
function copyDir(from, to) {
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (EXCLUDE.has(entry.name)) continue;
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      copyDir(src, dest);
    } else {
      fs.copyFileSync(src, dest);
      count++;
    }
  }
}
copyDir(SRC, DEST);

console.log(`同期完了: ${count} ファイル → public/services/ai-training/reskilling/`);
