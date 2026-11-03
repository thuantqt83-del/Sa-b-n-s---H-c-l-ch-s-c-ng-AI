/* Tiện ích dùng chung: DOM, ngẫu nhiên có hạt giống, nhiễu, băm, chuẩn hoá văn bản để đọc */
(function () {
  'use strict';
  const SBS = (window.SBS = window.SBS || {});

  const U = {};

  /* ---------- DOM ---------- */
  U.$ = (s, el) => (el || document).querySelector(s);
  U.$$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  U.h = function (tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (k === 'style' && typeof v === 'object') { for (const sk in v) { if (sk.startsWith('--')) el.style.setProperty(sk, v[sk]); else el.style[sk] = v[sk]; } }
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.appendChild(typeof kid === 'string' || typeof kid === 'number' ? document.createTextNode(kid) : kid);
    }
    return el;
  };
  U.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Toán ---------- */
  U.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  U.lerp = (a, b, t) => a + (b - a) * t;
  U.smoothstep = (e0, e1, x) => {
    const t = U.clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };
  U.rad = (d) => (d * Math.PI) / 180;
  U.ease = {
    linear: (t) => t,
    inOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    out: (t) => 1 - Math.pow(1 - t, 3),
    in: (t) => t * t * t,
  };

  /* ---------- Ngẫu nhiên có hạt giống ---------- */
  U.rng = function (seed) {
    let a = seed >>> 0;
    const f = function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.range = (a, b) => a + (b - a) * f();
    f.int = (a, b) => Math.floor(a + (b - a + 1) * f());
    f.pick = (arr) => arr[Math.floor(f() * arr.length)];
    return f;
  };
  U.shuffle = function (arr, rnd) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /* ---------- Nhiễu giá trị 2D (fbm) ---------- */
  U.makeNoise = function (seed) {
    const r = U.rng(seed);
    const N = 256;
    const perm = new Uint8Array(N * 2);
    const vals = new Float32Array(N);
    for (let i = 0; i < N; i++) { perm[i] = i; vals[i] = r(); }
    for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
    for (let i = 0; i < N; i++) perm[i + N] = perm[i];
    const fade = (t) => t * t * (3 - 2 * t);
    const v = (ix, iz) => vals[perm[(perm[ix & 255] + iz) & 255 + 0] & 255];
    function noise(x, z) {
      const ix = Math.floor(x), iz = Math.floor(z);
      const fx = fade(x - ix), fz = fade(z - iz);
      const a = vals[perm[(perm[ix & 255] + (iz & 255)) & 511]];
      const b = vals[perm[(perm[(ix + 1) & 255] + (iz & 255)) & 511]];
      const c = vals[perm[(perm[ix & 255] + ((iz + 1) & 255)) & 511]];
      const d = vals[perm[(perm[(ix + 1) & 255] + ((iz + 1) & 255)) & 511]];
      return U.lerp(U.lerp(a, b, fx), U.lerp(c, d, fx), fz);
    }
    noise.fbm = function (x, z, oct) {
      let amp = 0.5, f = 1, s = 0, n = 0;
      for (let i = 0; i < (oct || 4); i++) { s += amp * noise(x * f, z * f); n += amp; amp *= 0.5; f *= 2.03; }
      return s / n;
    };
    return noise;
  };

  /* ---------- Băm FNV-1a trên UTF-8 (dùng cả ở trình duyệt lẫn Node) ---------- */
  U.hash = function (str) {
    const bytes = new TextEncoder().encode(str);
    let h = 0x811c9dc5;
    for (let i = 0; i < bytes.length; i++) {
      h ^= bytes[i];
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  };

  /* ---------- Chuẩn hoá văn bản để giọng đọc đọc tự nhiên ---------- */
  const SPOKEN = [
    [/B-?52/g, 'B năm mươi hai'], [/T-?54/g, 'T năm mươi tư'], [/M-?113/g, 'M một trăm mười ba'],
    [/SAM-?2/g, 'Xam hai'], [/MiG-?21/g, 'Mích hai mươi mốt'], [/F-?111/g, 'Ép một trăm mười một'],
    [/F-?4/g, 'Ép bốn'], [/AK-?47/g, 'A ca bốn bảy'], [/(\d+)\s*km/g, '$1 ki-lô-mét'], [/\bTP\.?\s/g, 'thành phố '],
    [/\bQĐ\s?(\d)/g, 'Quân đoàn $1'], [/\bBCT\b/g, 'Bộ Chính trị'], [/\bĐCS\b/g, 'Đảng Cộng sản'],
  ];
  U.speakable = function (text) {
    let t = String(text);
    t = t.replace(/<[^>]+>/g, '');
    t = t.replace(/[★☆✔✘✓✗▶◀●•→←↑↓⚑🧠🎯🔊🔈]/g, ' ');
    for (const [re, to] of SPOKEN) t = t.replace(re, to);
    t = t.replace(/(\d)\s*[–—]\s*(\d)/g, '$1 đến $2');
    t = t.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g, 'ngày $1 tháng $2 năm $3');
    t = t.replace(/(\d{1,2})\/(\d{4})/g, 'tháng $1 năm $2');
    t = t.replace(/(\d{1,2})\/(\d{1,2})(?![\d\/])/g, '$1 tháng $2');
    t = t.replace(/≈/g, 'khoảng ');
    t = t.replace(/(\d{1,2})h(\d{2})/g, '$1 giờ $2 phút');
    t = t.replace(/(\d{1,2})h\b/g, '$1 giờ');
    t = t.replace(/(\d)\.(\d{3})/g, '$1$2'); // 12.000 -> 12000
    t = t.replace(/%/g, ' phần trăm');
    t = t.replace(/&/g, ' và ');
    t = t.replace(/\s[–—-]\s/g, ', ');
    t = t.replace(/[“”"]/g, '');
    t = t.replace(/\s+/g, ' ').trim();
    return t;
  };

  /* ---------- Định dạng ---------- */
  U.pad2 = (n) => String(n).padStart(2, '0');
  U.fmtDate = (ts) => {
    const d = new Date(ts);
    return `${U.pad2(d.getDate())}/${U.pad2(d.getMonth() + 1)}/${d.getFullYear()} ${U.pad2(d.getHours())}:${U.pad2(d.getMinutes())}`;
  };
  U.fmtClock = (sec) => `${U.pad2(Math.floor(sec / 60))}:${U.pad2(Math.floor(sec % 60))}`;
  U.round1 = (n) => Math.round(n * 10) / 10;
  U.round2 = (n) => Math.round(n * 100) / 100;
  U.uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

  /* ---------- Bỏ dấu tiếng Việt (tra cứu) ---------- */
  U.fold = (s) =>
    String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  SBS.util = U;
  SBS.battles = SBS.battles || [];
  if (typeof module !== 'undefined') module.exports = U;
})();
