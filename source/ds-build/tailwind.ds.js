// DS 版：額外掃描元件預覽檔的 class
import base from '../tailwind.config.js';
export default { ...base, content: [...base.content, process.env.DS_PREVIEWS + '/**/*.html'] };
