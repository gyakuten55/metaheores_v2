import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 画像アセットが読み込めない場合は壊れた画像アイコンを表示せず非表示にする
// (キャプチャフェーズで拾う。img の error はバブリングしないため)
document.addEventListener(
  "error",
  (event) => {
    const target = event.target;
    if (target instanceof HTMLImageElement) {
      target.style.display = "none";
    }
  },
  true,
);

createRoot(document.getElementById("root")!).render(<App />);
