import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 單檔輸出：方便以單一 HTML 預覽與分享原型
export default defineConfig({ base: './', plugins: [react(), viteSingleFile()] });
