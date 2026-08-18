# AIリスキリングサイト デザインコンセプト

## 3つのスタイルアプローチ

### アプローチ A: Editorial Precision（確率: 0.05）
スイスタイポグラフィを基盤に、厳格なグリッドと大胆な見出し組みで「信頼できる専門機関」を表現。ネイビー×ホワイトの清潔感に、アクセントとしてパープルを差し込む。

### アプローチ B: Enterprise Depth（確率: 0.08）
ダークネイビーを基調に、3Dレイヤー・グラスモーフィズム・パースペクティブ変換で「最先端テクノロジー企業の奥行き」を演出。BtoBの安心感と先進性を同時に実現する。

### アプローチ C: Kinetic Authority（確率: 0.03）
大きなタイポグラフィが動的に現れるモーション中心のデザイン。スクロールに連動してテキストが変容し、AIの変革力を体感させる。

---

## 選択: アプローチ B — Enterprise Depth

### Design Movement
Premium Enterprise SaaS × Editorial Tech × Swiss Typography。ゲームサイト的なネオン・サイバーパンクを避け、Fortune 500企業のITサービスサイトに近い上品な奥行きを目指す。

### Core Principles
1. **信頼と先進性の共存** — ダークネイビーの重厚感が「任せられる」安心感を、3D・モーションが「最新技術」の先進性を同時に語る
2. **業務・成果を主語に** — AI用語より「仕事が変わる」「時間が戻る」「外注が内製化できる」を前面に
3. **視線誘導の明確性** — ピンク/パープルはCTA・重要数字・アクティブ状態のみに限定し、迷いなく次の行動へ導く
4. **奥行きで差別化** — フラットデザインの対極として、layered blur・perspective transform・depth shadowで空間的な深みを作る

### Color Philosophy
- **Dark Navy #172554**: 背景・重厚な基盤。「信頼・安定・深さ」
- **Navy #243B72**: セクション区切り・カード背景
- **Accent Purple #A3377B**: CTA・重要数字・ホバー状態のみ。「行動・変革・先進性」
- **Light BG #F7F8FC**: ライトセクション背景
- **Text #111827**: 本文テキスト
- **Muted #64748B**: サブテキスト・注記
- ピンク/パープルは「視線を引く武器」として節約して使う

### Layout Paradigm
非対称レイアウト。ヒーローは左寄せテキスト＋右側3Dビジュアル。セクションごとにダーク/ライトを交互に切り替え、単調さを排除。カードは3Dチルト対応のグリッド。

### Signature Elements
1. **Glassmorphism Cards** — backdrop-blur + 半透明ボーダーで浮遊感のあるカード
2. **Layered Hero** — 3層パラレックス（背景グラデーション・中層3Dオブジェクト・前景UIカード）
3. **Numbered Steps** — 大きなアウトライン数字（#172554の輪郭のみ）でステップを視覚化

### Interaction Philosophy
マウス追従で3Dオブジェクトが微動する。スクロールでカードがstaggerで現れる。CTAボタンはscale + glow effectでクリックを誘う。

### Animation
- scroll reveal: opacity 0→1 + translateY 20px→0、duration 600ms、ease-out
- stagger: 業種・職種カードは80ms間隔で順次表示
- mouse tracking: ヒーロー3Dオブジェクトがマウス移動量の1/20で傾く
- counter animation: 数値（15,000名・98%・50件）がスクロール到達でカウントアップ
- 3D card tilt: カードホバーでperspective 1000px、rotateX/Y ±5deg
- prefers-reduced-motion: 全アニメーション無効化

### Typography System
- **Display**: Noto Sans JP 700/900 — 日本語見出し
- **Body**: Noto Sans JP 400/500 — 本文
- **Accent Numbers**: Inter 700 — 実績数値
- 見出しサイズ: 3.5rem（hero）→ 2.25rem（section）→ 1.5rem（card）

### Brand Essence
「業務から逆算するAI研修で、仕事の成果を変える — 中小企業・DX推進担当者のための実践型パートナー」
キーワード: **実践的・信頼できる・変革的**

### Brand Voice
- 専門用語を使わず、仕事の成果で語る
- 例: 「AIを学ぶ」ではなく「提案の速度が上がる」
- 例: 「生成AIリスキリング」ではなく「あなたの業界にAIを入れると、仕事はここまで変わる」
- 禁止: "Welcome to our website" / "まずはお気軽に" 的な汎用フレーズ

### Wordmark & Logo
「MH」をモノグラム化した幾何学シンボル。ネイビー地にパープルのアクセントライン。

### Signature Brand Color
**#A3377B** — Meta Heroes Purple。CTAと重要数字にのみ使用。

## Style Decisions
- ダークセクションとライトセクションを交互に配置し、視覚的リズムを作る
- 3Dビジュアルはenterprise感を保つため、過度な光沢・反射を避ける
- 助成金ページは特に「煽り感」を排除し、情報の正確性と信頼性を最優先
