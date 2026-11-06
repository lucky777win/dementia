# 憶起照顧｜失智關懷與資源整合平台（原型）

從理解開始，讓照顧不再孤單。陪伴您認識失智症、了解照護方式，找到需要的資源與支持。

- 網站：<https://lucky777win.github.io/dementia/>
- 內容取自「憶起照顧雛型」：照顧文章與導航規則**尚未經專家與個管師覆核**，頁面上皆有標示。
- 照護資源地點：全台 22 縣市、728 個地點（共照中心、失智據點含權責型、團體家屋），由官方清冊清查合併；臺中市採衛生局 115 年 9 月 30 日版。清冊見 `source/data/照護資源地點清冊.csv`，處理方式見 `source/scripts/resources/`。
- 地圖位置依村里或鄉鎮市區中心估算，僅供看分布；底圖 © OpenStreetMap 貢獻者、© CARTO。

## 檔案結構
| 路徑 | 說明 |
| --- | --- |
| `index.html` | 已建置好的網站（單一檔案），GitHub Pages 直接發布這個檔案 |
| `source/` | 原始碼：React 18 + TypeScript + Tailwind CSS 3 + Vite 5 |
| `source/src/data/content.json` | 全部內容資料（文章、行動計畫、據點、專線） |

## 修改與更新
```bash
cd source
npm install
npm run dev     # 本機開發 http://localhost:5173
npm run build   # 產出 source/dist/index.html
```
把 `source/dist/index.html` 複製到 repository 根目錄覆蓋 `index.html` 後推送，網站就會更新。
