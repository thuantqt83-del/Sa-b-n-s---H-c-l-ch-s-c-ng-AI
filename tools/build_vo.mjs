// Trích toàn bộ lời kể cần thu giọng từ dữ liệu app -> tools/vo_manifest.json
// Chạy:  node tools/build_vo.mjs
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {}, console, TextEncoder };
ctx.window.window = ctx.window;
vm.createContext(ctx);
const files = [
  'js/core/util.js', 'js/data/errors.js',
  'js/data/b1_vietbac.js', 'js/data/b2_bienGioi.js', 'js/data/b3_dienbienphu.js', 'js/data/b4_apbac.js', 'js/data/b5_dbptrenkhong.js', 'js/data/b6_xuan1975.js', 'js/data/briefs.js', 'js/data/extra_steps.js',
  'js/data/milestones.js', 'js/data/home_intro.js', 'js/core/ai.js',
];
for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
const SBS = ctx.window.SBS;
const U = SBS.util;

const seen = new Map();
for (const t of SBS.ai.voiceTexts()) {
  const spoken = U.speakable(t);
  const key = U.hash(spoken);
  if (!seen.has(key)) seen.set(key, spoken);
}
const list = [...seen].map(([key, text]) => ({ key, text }));
fs.writeFileSync(path.join(root, 'tools', 'vo_manifest.json'), JSON.stringify(list, null, 1), 'utf8');
const chars = list.reduce((s, x) => s + x.text.length, 0);
console.log(`Đã trích ${list.length} đoạn lời kể (${chars} kí tự, ước ${Math.round(chars / 14 / 60)} phút) -> tools/vo_manifest.json`);
