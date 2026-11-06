# 憶起照顧｜首頁原型

## 只想看畫面
直接打開網站：https://lucky777win.github.io/dementia/

> 注意：資料夾裡的 index.html 是開發用的原始檔，直接雙擊會是空白頁，這是正常的。

## 開發者
需要 Node.js 18 以上：
    npm install
    npm run dev      # 開發伺服器 http://localhost:5173
    npm run build    # 產出 dist/index.html（單一檔案，可直接開啟）

## 內容資料
- `src/data/content.json`：取自「憶起照顧雛型」的全部內容（照顧文章、認識失智症、找資源行動計畫、臺中市共照中心與據點、專線、喘口氣小語），原文未改寫。
- `src/data/content.ts`：型別與問題比對規則（安全分流 → 認識失智症 → 文章關鍵字 → 行動計畫）。
- 雛型註明「文章與導航規則尚未經專家與個管師覆核」，所以前台一律標示「尚未經專家覆核」或「規則初稿・待個管師確認」。

## 發布到 GitHub Pages
本 repository 以「Deploy from a branch」發布根目錄的 `index.html`。修改後執行 `npm run build`，把 `dist/index.html` 複製到根目錄覆蓋即可。
