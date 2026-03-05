# MetaHeroes Project Context

## Project Overview
MetaHeroesの公式ウェブサイト（HP）制作プロジェクトです。
ユーザーに没入感を与えるモダンで視覚的に魅力的なウェブサイトを構築します。

## Core Instructions
- **Language**: 常に**日本語**で回答してください。
- **Tone**: プロフェッショナルかつ簡潔に。

## Tech Stack
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Language**: TypeScript
- **Deployment**: Vercel (想定)

## Design System (MetaHeroes Brand)
- **Colors**:
  - **Primary Gradient**: Blue-600 to Cyan-500 (ヒーローセクションや主要ボタンに使用)
  - **Backgrounds**: Clean White (#ffffff) or very light gray for sections.
  - **Text**: High contrast dark gray/black for main text.
- **Typography**:
  - Font Family: `Inter`, `Noto Sans JP`, sans-serif.
  - Headings: Bold, distinct.
  - English Text: Wide tracking (letter-spacing) for a modern feel.
- **UI Patterns**:
  - **Header**: Sticky header. Transparent at top, turns white on scroll. Dual navigation labels (Japanese + English).
  - **Cards**: Rounded corners (medium/large), hover zoom effects, soft large shadows (`shadow-lg`, `shadow-xl`).
  - **Buttons**: Rounded-full (pill shape), gradient borders or backgrounds, smooth hover animations.
  - **Animations**: Fade-ins (`opacity-0` to `1`), Slide-ups (`y: 20` to `0`) using Framer Motion.

## File Structure & Organization
- `src/components/`: 再利用可能なUIコンポーネント
- `src/pages/`: ページコンポーネント
- `src/assets/`: 画像、アイコン、フォント
- `src/hooks/`: カスタムHooks
- `src/types/`: TypeScript型定義

## Development Rules
1.  **Code Style**:
    - Functional Components + Hooks を使用する。
    - TypeScriptの型定義を厳格に行う (`any` は避ける)。
    - Tailwind CSSのクラスは整理して記述する (必要に応じて `clsx` や `tailwind-merge` を使用)。
2.  **Immutability**:
    - オブジェクトや配列は直接変更せず、スプレッド構文などを使用して新しい参照を作成する。
3.  **Clean Code**:
    - コンポーネントは小さく保つ (1ファイル 200-400行を目安)。
    - 複雑なロジックはカスタムフックに切り出す。

## Available Tools & Agents (via .gemini/)
このプロジェクトには `.gemini/` フォルダ内に高度なエージェント設定が含まれています。必要に応じて以下を活用します。
- **planner**: 新機能の実装計画やリファクタリング計画。
- **code-reviewer**: コード品質とセキュリティのレビュー。
- **tdd-guide**: テスト駆動開発のガイド。
- **architect**: システム設計や構造の決定。

---
*このファイルはプロジェクトのコンテキスト定義です。AIエージェントはこの内容に従って振る舞います。*
