# 生成AIリスキリング研修LP — デプロイ手順

公開URL: https://meta-heroes.co.jp/services/ai-training/reskilling

## 仕組み

本体サイト（Vite + React Router のSPA / Vercel配信）とは別のアプリのため、
このLPは**静的ビルド済みファイル**として本体サイトの `public/` に同梱している。

```
ai-reskilling-site/            ← LPのソース（React 19 + wouter + Tailwind v4）
  └ dist/public/               ← pnpm run build の出力（Git管理外）
public/services/ai-training/reskilling/   ← 配信される実ファイル（Git管理）
```

- `vite.config.ts` の `base` を `/services/ai-training/reskilling/` に設定しているため、
  JS/CSSの参照パスがそのまま本番URLに一致する。
- アプリ内リンクは `client/src/lib/paths.ts` の `url()` / `asset()` を経由し、
  wouter の `<Router base>` と合わせて開発時（ルート）でも本番（サブパス）でも動作する。
- `vercel.json` に以下のrewriteを追加済み。本体SPAのcatch-allより**前**に置く必要がある。
  - `/services/ai-training/reskilling` → LPの `index.html`
  - `/services/ai-training/reskilling/(.*)` → LPの `index.html`（LP内のページ遷移用）

## LPを更新したとき

リポジトリのルートで次を実行し、生成された `public/services/ai-training/reskilling/` を
コミットする。

```bash
npm run build:reskilling-lp
```

（内部で `pnpm install` → `pnpm run build` → `node scripts/sync-reskilling-lp.mjs` を実行）

## 画像アセット

`client/public/images/` に配置したファイルが
`/services/ai-training/reskilling/images/<ファイル名>` として配信される。
必要なファイル名は `client/public/images/README.md` を参照。
