/* Âm thanh: nhạc nền tổng hợp (ngũ cung) theo từng màn hình + giọng kể nam (mp3 dựng sẵn trong audio/nam, dự phòng giọng trình duyệt) */
(function () {
  'use strict';
  const SBS = window.SBS;
  const U = SBS.util;
  const ST = () => SBS.store.settings;
  const VO_DIR = 'audio/nam/'; // giọng nam (vi-VN-NamMinhNeural)

  /* ======================= NHẠC NỀN ======================= */
  const SCALES = {
    minP: [0, 3, 5, 7, 10], // ngũ cung thứ – trang nghiêm, hào hùng
    majP: [0, 2, 4, 7, 9], // ngũ cung trưởng – chiến thắng, tươi sáng
    nam: [0, 2, 5, 7, 9], // điệu "Nam" – nhẹ, suy tư
  };
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  /* Nhạc nền TRỐNG TRẬN, tổng hợp bằng WebAudio: trống cái (trầm, vang) + trống con dồn nhịp + trống chầu (tom) + sênh phách,
     có đoạn rền trống cuối mỗi 4 nhịp. Giai điệu chỉ là tiếng đàn gảy trầm, ngắn; không có tiếng ngân dài (hú), không kèn, sáo, chuông. */
  const MOODS = {
    // lead: nhạc cụ giai điệu (pluck = đàn gảy trầm, tiếng ngắn) · arp: xác suất gảy rải · kick/tom/snare/hat: mẫu 16 phách · roll: rền trống cuối mỗi 4 nhịp
    home: { bpm: 108, scale: 'minP', root: 50, chords: [0, 3, 0, 4], motif: 'march', lead: 'pluck', oct: 0, lv: 0.9, str: 0.55, dv: 1, kick: 'x..x..x.x..x..x.', tom: '......x.......xx.', snare: '....x.......x.x.', hat: 'x.x.x.x.x.x.x.x.', arp: 0, ostinato: true, roll: true },
    brief: { bpm: 92, scale: 'minP', root: 48, chords: [0, 0, 3, 2], motif: 'solemn', lead: 'pluck', oct: 1, lv: 0.75, str: 0.6, dv: 0.9, kick: 'x.......x.....x.', tom: '..........x.....', snare: '..............x.', hat: '..x...x...x...x.', arp: 0 },
    battle: { bpm: 120, scale: 'minP', root: 50, chords: [0, 3, 0, 4], motif: 'march', lead: 'pluck', oct: 0, lv: 1, str: 0.5, dv: 1.1, kick: 'x..x..x.x..x..x.', tom: '..x...x...x...xx', snare: '....x.......x..x', hat: 'x.x.x.x.x.x.x.x.', arp: 0, ostinato: true, roll: true },
    decision: { bpm: 94, scale: 'minP', root: 48, chords: [0, 2, 0, 3], motif: 'tense', lead: 'pluck', oct: 1, lv: 0.7, str: 0.5, dv: 0.9, kick: 'x...x...x...x...', tom: '............x.x.', snare: '', hat: '..x...x...x...x.', arp: 0 },
    victory: { bpm: 126, scale: 'majP', root: 57, chords: [0, 4, 3, 2], motif: 'fanfare', lead: 'pluck', oct: 0, lv: 1, str: 0.6, dv: 1.1, kick: 'x..x..x.x..x..x.', tom: '..x...x...x.x.xx', snare: '....x.......x.x.', hat: 'x.x.x.x.x.x.x.x.', arp: 0, ostinato: true, roll: true },
    defeat: { bpm: 66, scale: 'minP', root: 53, chords: [0, 3, 1, 0], motif: 'lament', lead: 'pluck', oct: 0, lv: 0.8, str: 0.55, dv: 0.7, kick: 'x.......x.......', tom: '', snare: '', hat: '', arp: 0 },
    study: { bpm: 100, scale: 'majP', root: 55, chords: [0, 3, 4, 2], motif: 'hero', lead: 'pluck', oct: 0, lv: 0.85, str: 0.45, dv: 0.85, kick: 'x..x....x..x....', tom: '..........x...x.', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.', arp: 0 },
    exam: { bpm: 90, scale: 'majP', root: 52, chords: [0, 2, 3, 2], motif: 'calm', lead: 'pluck', oct: 0, lv: 0.7, str: 0.35, dv: 0.6, kick: 'x.......x.......', tom: '..............x.', snare: '', hat: '..x...x...x...x.', arp: 0 },
  };
  /* Mô-típ giai điệu: mỗi biến thể dài 32 bước (2 ô nhịp); [bậc ngũ cung, độ dài theo bước]; bậc null = nghỉ */
  const MOTIFS = {
    hero: [
      [[3, 4], [5, 4], [7, 8], [8, 6], [7, 2], [5, 8]],
      [[3, 4], [5, 4], [8, 8], [7, 4], [5, 4], [7, 4], [5, 4]],
    ],
    solemn: [[[0, 8], [2, 8], [3, 8], [2, 8]], [[0, 8], [3, 8], [2, 6], [1, 2], [0, 8]]],
    march: [
      [[0, 2], [0, 2], [2, 4], [3, 4], [2, 4], [0, 4], [2, 2], [3, 2], [5, 8]],
      [[0, 2], [0, 2], [3, 4], [5, 4], [3, 4], [2, 4], [3, 2], [2, 2], [0, 8]],
    ],
    tense: [[[0, 8], [null, 4], [2, 4], [1, 8], [null, 8]], [[null, 8], [0, 6], [1, 2], [0, 8], [null, 8]]],
    fanfare: [
      [[5, 2], [5, 2], [5, 4], [3, 4], [5, 4], [7, 8], [8, 4], [7, 2], [5, 2]],
      [[3, 2], [3, 2], [5, 4], [7, 4], [8, 4], [9, 8], [8, 4], [7, 2], [8, 2]],
    ],
    lament: [[[5, 6], [4, 2], [3, 8], [2, 6], [0, 10]]],
    calm: [[[3, 4], [5, 4], [4, 8], [2, 4], [3, 4], [0, 8]], [[5, 4], [4, 4], [3, 8], [2, 4], [0, 4], [2, 8]]],
  };

  const Music = {
    ctx: null,
    bus: null,
    duckGain: null,
    verb: null,
    noiseBuf: null,
    mood: null,
    cur: null, // {cfg, gain, step, next}
    timer: null,
    ducked: false,
    started: false,

    init() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = (this.ctx = new AC());
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4;
      this.bus = ctx.createGain();
      this.duckGain = ctx.createGain();
      this.comp = comp;
      this.bus.connect(this.duckGain); this.duckGain.connect(comp); comp.connect(ctx.destination);
      this.verb = ctx.createConvolver();
      this.verb.buffer = this._impulse(2.6);
      const vg = ctx.createGain(); vg.gain.value = 0.38;
      this.verb.connect(vg); vg.connect(this.bus);
      // nhiễu trắng 2 giây
      const n = ctx.sampleRate * 2, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      this.noiseBuf = b;
      this.applyVolume();
      document.addEventListener('visibilitychange', () => {
        if (!this.ctx) return;
        if (document.hidden) this.ctx.suspend(); else this.ctx.resume();
      });
    },
    _impulse(sec) {
      const ctx = this.ctx, n = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, n, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = b.getChannelData(c);
        for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6);
      }
      return b;
    },
    unlock() {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      this.started = true;
      if (this.mood && !this.cur) this.setMood(this.mood, true);
    },
    applyVolume() {
      if (!this.ctx) return;
      const v = ST().music;
      this.bus.gain.setTargetAtTime(v * 0.95, this.ctx.currentTime, 0.2);
    },
    duck(on) {
      this.ducked = on;
      if (!this.ctx) return;
      this.duckGain.gain.setTargetAtTime(on ? 0.3 : 1, this.ctx.currentTime, 0.25);
      if (SBS.audio && SBS.audio.fx) SBS.audio.fx.duck(on);
    },

    /* ----- Đổi tâm trạng (có chuyển mờ) ----- */
    setMood(name, force) {
      if (!MOODS[name]) return;
      if (this.mood === name && this.cur && !force) return;
      this.mood = name;
      if (!this.ctx || !this.started) return;
      const ctx = this.ctx, now = ctx.currentTime;
      if (this.cur) {
        const old = this.cur;
        old.gain.gain.cancelScheduledValues(now);
        old.gain.gain.setTargetAtTime(0, now, 0.5);
        setTimeout(() => { try { old.gain.disconnect(); } catch (e) {} }, 3500);
      }
      const g = ctx.createGain();
      g.gain.value = 0;
      g.gain.setTargetAtTime(1, now, 0.7);
      g.connect(this.bus);
      const cfg = MOODS[name];
      this.cur = { cfg, gain: g, step: 0, next: now + 0.15, rnd: U.rng((Math.random() * 1e9) | 0), deg: 4 };
      if (!this.timer) this.timer = setInterval(() => this._tick(), 60);
    },
    stop() {
      if (this.cur) { this.cur.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3); this.cur = null; }
    },

    _tick() {
      const c = this.cur;
      if (!c || !this.ctx || this.ctx.state !== 'running') return;
      if (ST().music <= 0.001) { c.next = this.ctx.currentTime + 0.2; return; }
      const sd = 60 / c.cfg.bpm / 4;
      while (c.next < this.ctx.currentTime + 0.3) {
        this._step(c, c.step, c.next);
        c.next += sd;
        c.step++;
      }
    },

    _pitch(cfg, deg, octShift) {
      const sc = SCALES[cfg.scale];
      const o = Math.floor(deg / 5), i = ((deg % 5) + 5) % 5;
      return mtof(cfg.root + sc[i] + 12 * (o + (octShift || 0)));
    },

    _step(c, s, t) {
      const cfg = c.cfg, pos = s % 16, bar = Math.floor(s / 16);
      const sd = 60 / cfg.bpm / 4;
      const root = cfg.chords[bar % cfg.chords.length];
      // nốt trầm gảy ngắn ở phách 1 và 3 của mỗi nhịp (không ngân dài)
      if (pos === 0 || pos === 8) this._bass(c, this._pitch(cfg, root, -1), t, (pos === 0 ? 1 : 0.7) * cfg.str * 0.12);
      // trống cái (trầm, vang), trống chầu, trống con, phách gõ nhịp
      const fill = cfg.roll && bar % 4 === 3 && pos >= 8; // rền trống cuối mỗi 4 nhịp
      if (cfg.kick && cfg.kick[pos] === 'x' && !(fill && pos > 11)) this._trong(c, t, (pos === 0 ? 1 : 0.72) * cfg.dv);
      if (cfg.tom && cfg.tom[pos] === 'x' && !fill) this._tom(c, t, 0.8 * cfg.dv, pos % 4 === 2 ? 150 : 195);
      if (fill) {
        const k = (pos - 8) / 8; // 0 -> 1
        if (pos % 2 === 0 || pos >= 12) this._snare(c, t, (0.5 + 0.7 * k) * cfg.dv);
        if (pos >= 12) this._tom(c, t, (0.5 + 0.5 * k) * cfg.dv, 215 - (pos - 12) * 22);
        if (pos === 15) this._trong(c, t + sd * 0.5, 1.15 * cfg.dv);
      } else if (cfg.snare && cfg.snare[pos] === 'x') this._snare(c, t, 0.7 * cfg.dv);
      if (cfg.hat && cfg.hat[pos] === 'x') this._hat(c, t, (pos % 4 === 0 ? 1 : 0.65) * cfg.dv);
      // đàn gảy rải trên hợp âm (mặc định tắt)
      if (cfg.arp && pos % (cfg.arpStep || 2) === 0 && c.rnd() < cfg.arp) {
        const seq = [0, 2, 4, 2, 1, 3, 4, 3];
        this._pluck(c, this._pitch(cfg, root + seq[(pos / (cfg.arpStep || 2) + bar) % seq.length], 0), t, 0.05);
      }
      // nhịp dây gảy dồn dập (hành quân)
      if (cfg.ostinato && pos % 2 === 0) this._stab(c, this._pitch(cfg, root + (pos % 8 === 6 ? 3 : 0), -1), t, pos % 4 === 0 ? 0.07 : 0.045);
      // giai điệu theo mô-típ, mỗi chu kì 32 bước
      if (s % 32 === 0) {
        const mt = MOTIFS[cfg.motif], v = mt[Math.floor(s / 32) % mt.length];
        c.sched = {};
        let off = 0;
        v.forEach(([deg, len]) => { if (deg != null) c.sched[off] = [deg, len]; off += len; });
      }
      const n = c.sched && c.sched[s % 32];
      if (n) {
        const f = this._pitch(cfg, n[0], cfg.oct), len = sd * n[1];
        if (cfg.lead === 'pluck') { this._pluck(c, f, t, 0.085 * cfg.lv); if (n[1] >= 6) this._pluck(c, f, t + sd * 3, 0.05 * cfg.lv); }
      }
    },

    /* ----- Nhạc cụ ----- */
    _env(g, t, a, d, v, rel) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(v, t + a);
      g.gain.setTargetAtTime(0.0001, t + a + d, rel / 3);
    },
    _out(c, node, send) {
      node.connect(c.gain);
      if (send) { const s = this.ctx.createGain(); s.gain.value = send; node.connect(s); s.connect(this.verb); }
    },
    /* nốt trầm gảy ngắn: tam giác qua bộ lọc thấp, tắt nhanh */
    _bass(c, f, t, v) {
      const ctx = this.ctx, g = ctx.createGain(), lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 420;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
      const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
      o.connect(lp); lp.connect(g); o.start(t); o.stop(t + 0.45); this._out(c, g, 0.12);
    },
    _stab(c, f, t, v) {
      const ctx = this.ctx, g = ctx.createGain(), lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 900;
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
      o.connect(lp); lp.connect(g); o.start(t); o.stop(t + 0.2); this._out(c, g, 0.15);
    },
    /* trống cái (trống trận): "bùm" trầm, rơi tần chậm, vang dài, kèm tiếng da trống */
    _trong(c, t, v) {
      const ctx = this.ctx, g = ctx.createGain(), o = ctx.createOscillator();
      o.type = 'sine'; o.frequency.setValueAtTime(128, t); o.frequency.exponentialRampToValueAtTime(46, t + 0.42);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.62 * v, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.15);
      o.connect(g); o.start(t); o.stop(t + 1.2); this._out(c, g, 0.45);
      const o2 = ctx.createOscillator(), g2 = ctx.createGain();
      o2.type = 'triangle'; o2.frequency.setValueAtTime(220, t); o2.frequency.exponentialRampToValueAtTime(90, t + 0.1);
      g2.gain.setValueAtTime(0.2 * v, t); g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o2.connect(g2); o2.start(t); o2.stop(t + 0.15); this._out(c, g2, 0.1);
      this._noise(c, t, 0.07, 0.16 * v, 420, 'lowpass');
    },
    /* trống chầu / trống con trầm: nốt giữa, ngắn, dùng đệm và rền */
    _tom(c, t, v, f) {
      const ctx = this.ctx, g = ctx.createGain(), o = ctx.createOscillator();
      o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.5, t + 0.22);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.34 * v, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g); o.start(t); o.stop(t + 0.55); this._out(c, g, 0.3);
      this._noise(c, t, 0.04, 0.09 * v, 900, 'lowpass');
    },
    _snare(c, t, v) {
      const ctx = this.ctx, g = ctx.createGain(), o = ctx.createOscillator();
      o.type = 'triangle'; o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(120, t + 0.1);
      g.gain.setValueAtTime(0.16 * v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o.connect(g); o.start(t); o.stop(t + 0.2); this._out(c, g, 0.15);
      this._noise(c, t, 0.15, 0.22 * v, 1500, 'highpass');
    },
    /* sênh phách: tiếng gõ khô, ngắn (nhiễu lọc cao), giữ nhịp dồn */
    _hat(c, t, v) { this._noise(c, t, 0.045, 0.07 * v, 6500, 'highpass'); },
    _crash(c, t, v) { this._noise(c, t, 2.2, v, 4800, 'highpass'); },
    _pluck(c, f, t, v) {
      // đàn tranh: tiếng gảy ngắn, tắt nhanh
      const ctx = this.ctx, g = ctx.createGain(), lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(3200, t); lp.frequency.exponentialRampToValueAtTime(500, t + 0.5);
      this._env(g, t, 0.004, 0.02, v, 0.9);
      const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
      const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 3; const g2 = ctx.createGain(); g2.gain.value = 0.15;
      o.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g);
      o.start(t); o2.start(t); o.stop(t + 1.4); o2.stop(t + 1.4);
      this._out(c, g, 0.5);
    },
    _drum(c, t, v, f0, f1) {
      const ctx = this.ctx, g = ctx.createGain(), o = ctx.createOscillator();
      o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + 0.28);
      g.gain.setValueAtTime(v * 0.55, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      o.connect(g); o.start(t); o.stop(t + 0.6); this._out(c, g, 0.25);
      this._noise(c, t, 0.05, 0.12, 700, 'lowpass');
    },
    _noise(c, t, dur, v, freq, type) {
      const ctx = this.ctx, src = ctx.createBufferSource(); src.buffer = this.noiseBuf;
      const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq;
      const g = ctx.createGain(); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); src.start(t, Math.random() * 1.5); src.stop(t + dur + 0.05); this._out(c, g, 0.15);
    },
    _tickSfx(c, t) {
      const ctx = this.ctx, g = ctx.createGain(), o = ctx.createOscillator();
      o.type = 'square'; o.frequency.value = 1400;
      g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
      o.connect(g); o.start(t); o.stop(t + 0.05); this._out(c, g, 0.1);
    },
  };

  /* ======================= HIỆU ỨNG NGẮN ======================= */
  function sfx(kind) {
    const ctx = Music.ctx;
    if (!ctx || ctx.state !== 'running' || ST().music <= 0.001) return;
    const t = ctx.currentTime, c = { gain: Music.duckGain || ctx.destination };
    const hit = (f, d, v) => Music._tom(c, t + d, v, f);
    const fx = {
      click: () => hit(300, 0, 0.5),
      ok: () => { hit(180, 0, 0.8); hit(240, 0.11, 0.9); Music._trong(c, t + 0.24, 0.9); },
      bad: () => { Music._trong(c, t, 0.9); hit(110, 0.16, 0.8); },
      step: () => hit(260, 0, 0.55),
      star: () => { for (let i = 0; i < 6; i++) hit(170 + i * 14, i * 0.06, 0.45 + i * 0.1); Music._trong(c, t + 0.4, 1.1); },
    };
    if (fx[kind]) fx[kind]();
  }

  /* ======================= GIỌNG KỂ ======================= */
  const Narrator = {
    _tok: 0,
    _audio: null,
    _resolve: null,
    _warned: false,
    voice: null,

    voices() {
      return window.speechSynthesis ? speechSynthesis.getVoices().filter((v) => /^vi/i.test(v.lang)) : [];
    },
    pickVoice() {
      const vs = this.voices();
      if (!vs.length) return null;
      const want = ST().voiceName;
      return (
        vs.find((v) => v.name === want) ||
        vs.find((v) => /namminh|nam minh/i.test(v.name)) ||
        vs.find((v) => /male|an|nam/i.test(v.name) && !/female/i.test(v.name)) ||
        vs.find((v) => !/hoaimy|hoài my|female|nữ|linh/i.test(v.name)) ||
        vs[0]
      );
    },
    hasVO(text) {
      return !!(SBS.VO_INDEX && SBS.VO_INDEX[U.hash(U.speakable(text))]);
    },

    /* Thời lượng (giây) sẽ đọc đoạn văn: lấy từ file mp3 nếu có, không thì ước lượng – dùng để đồng bộ mũi tên với lời kể */
    prepare(text) {
      const rate = ST().rate || 1;
      const spoken = U.speakable(text), key = U.hash(spoken);
      const est = () => Math.max(3, spoken.length / 15 / rate);
      if (!ST().narrator || !(SBS.VO_INDEX && SBS.VO_INDEX[key])) return Promise.resolve(est());
      return new Promise((res) => {
        const a = new Audio(); let done = false;
        const fin = (v) => { if (!done) { done = true; res(v); } };
        a.preload = 'metadata';
        a.onloadedmetadata = () => fin(isFinite(a.duration) && a.duration > 0 ? a.duration / rate : est());
        a.onerror = () => fin(est());
        setTimeout(() => fin(est()), 1500);
        a.src = VO_DIR + key + '.mp3';
      });
    },

    /* Đọc một đoạn. Trả về Promise<boolean>: true nếu đọc hết, false nếu bị ngắt. */
    speak(text) {
      this.stop();
      if (!ST().narrator || !text) return Promise.resolve(false);
      const tok = ++this._tok;
      this._t0 = performance.now(); this._est = Math.max(3, U.speakable(text).length / 15 / (ST().rate || 1));
      Music.duck(true);
      return new Promise((resolve) => {
        let finished = false;
        const done = (ok) => {
          if (finished) return;
          finished = true;
          if (tok === this._tok) { Music.duck(false); this._resolve = null; this._audio = null; }
          resolve(ok && tok === this._tok);
        };
        this._resolve = () => done(false);
        const spoken = U.speakable(text);
        const key = U.hash(spoken);
        if (SBS.VO_INDEX && SBS.VO_INDEX[key]) {
          const a = new Audio(VO_DIR + key + '.mp3');
          a.volume = U.clamp(ST().voice, 0, 1);
          a.playbackRate = ST().rate;
          this._audio = a;
          a.onended = () => done(true);
          a.onerror = () => this._tts(spoken, tok, done);
          a.play().catch(() => this._tts(spoken, tok, done));
        } else this._tts(spoken, tok, done);
      });
    },

    _tts(spoken, tok, done) {
      if (tok !== this._tok) return done(false);
      const synth = window.speechSynthesis;
      const v = this.pickVoice();
      if (!synth || !v) {
        if (!this._warned) { this._warned = true; SBS.toast && SBS.toast('Máy chưa có giọng đọc tiếng Việt – hãy mở bằng Microsoft Edge để nghe giọng đọc.', 'warn'); }
        const ms = Math.max(1800, spoken.split(' ').length * 330);
        const id = setTimeout(() => done(true), ms);
        this._resolve = () => { clearTimeout(id); done(false); };
        return;
      }
      const parts = spoken.match(/[^.!?;:]+[.!?;:]?/g) || [spoken];
      let i = 0;
      const next = () => {
        if (tok !== this._tok) return done(false);
        if (i >= parts.length) return done(true);
        const u = new SpeechSynthesisUtterance(parts[i++].trim());
        u.voice = v; u.lang = v.lang; u.rate = U.clamp(ST().rate * 0.95, 0.6, 1.6); u.pitch = 1.05; u.volume = U.clamp(ST().voice, 0, 1);
        u.onend = next; u.onerror = next;
        synth.speak(u);
      };
      synth.cancel();
      next();
    },

    /* tiến độ đọc 0..1 (để chạy phụ đề); null nếu không đọc */
    progress() {
      if (this._audio && this._audio.duration > 0) return U.clamp(this._audio.currentTime / this._audio.duration, 0, 1);
      if (this._t0 && this._est) return U.clamp((performance.now() - this._t0) / 1000 / this._est, 0, 1);
      return null;
    },
    stop() {
      this._t0 = 0;
      this._tok++;
      if (this._audio) { try { this._audio.pause(); } catch (e) {} this._audio = null; }
      if (window.speechSynthesis) speechSynthesis.cancel();
      const r = this._resolve; this._resolve = null;
      Music.duck(false);
      if (r) r();
    },
  };

  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => {};

  /* ======================= TIẾNG BINH KHÍ (pháo, xe tăng, máy bay…) =======================
     Tổng hợp bằng WebAudio, có chống dồn tiếng (giãn cách theo loại, tối đa vài tiếng cùng lúc) và chia trái/phải theo vị trí trên màn hình. */
  const Fx = {
    bus: null, verb: null, last: {}, live: [], ducked: false,
    GAP: { boom: 70, cannon: 90, whistle: 160, mg: 220, tank: 700, jet: 600, heli: 900, sam: 250, down: 500, haul: 800 },
    ok() { const c = Music.ctx; return !!c && c.state === 'running' && ST().sfx > 0.001; },
    level() { return ST().sfx * (this.ducked ? 0.55 : 1) * 0.9; },
    setVolume() { if (this.bus && Music.ctx) this.bus.gain.setTargetAtTime(this.level(), Music.ctx.currentTime, 0.1); },
    duck(on) { this.ducked = on; this.setVolume(); },
    _bus() {
      const c = Music.ctx;
      if (!this.bus) {
        this.bus = c.createGain(); this.bus.gain.value = this.level(); this.bus.connect(Music.comp || c.destination);
        this.verb = c.createConvolver(); this.verb.buffer = Music._impulse(1.8);
        const vg = c.createGain(); vg.gain.value = 0.5; this.verb.connect(vg); vg.connect(this.bus);
      }
      return this.bus;
    },
    /* nối một nút âm thanh ra loa: o.pan (-1..1), send = lượng vang */
    _out(node, o, send) {
      const c = Music.ctx; let n = node;
      if (c.createStereoPanner && o && o.pan) { const p = c.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, o.pan)); n.connect(p); n = p; }
      n.connect(this._bus());
      if (send) { const s = c.createGain(); s.gain.value = send; n.connect(s); s.connect(this.verb); }
    },
    _env(g, t, dur, v, opt) {
      const sw = opt && opt.swell;
      g.gain.setValueAtTime(0.0001, t);
      if (!sw) { g.gain.linearRampToValueAtTime(v, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); return; }
      const a = Math.min(sw, dur * 0.45), r = Math.min(opt.rel || a, dur * 0.45);
      g.gain.linearRampToValueAtTime(v, t + a); g.gain.setValueAtTime(v, t + dur - r); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    },
    /* nhiễu qua bộ lọc có quét tần số f0 -> f1 */
    _noise(t, dur, type, f0, f1, v, o, opt) {
      const c = Music.ctx, src = c.createBufferSource();
      src.buffer = Music.noiseBuf; src.loop = true;
      const f = c.createBiquadFilter(); f.type = type; f.Q.value = (opt && opt.q) || 0.8;
      f.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
      const g = c.createGain(); this._env(g, t, dur, v, opt);
      src.connect(f); f.connect(g); src.start(t, Math.random() * 1.5); src.stop(t + dur + 0.1);
      this._out(g, o, opt && opt.send);
    },
    _tone(t, dur, type, f0, f1, v, o, opt) {
      const c = Music.ctx, os = c.createOscillator(), g = c.createGain();
      os.type = type; os.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) os.frequency.exponentialRampToValueAtTime(f1, t + dur);
      this._env(g, t, dur, v, opt);
      os.connect(g); os.start(t); os.stop(t + dur + 0.1);
      this._out(g, o, opt && opt.send);
    },

    /* kind: boom | cannon | whistle | mg | tank | jet | heli | sam | down;  o: { pan, vol, dur, n, gap, size, delay, unit } */
    play(kind, o) {
      o = o || {};
      if (!this.ok() || !this['_' + kind]) return;
      const now = performance.now();
      if (now - (this.last[kind] || 0) < (this.GAP[kind] || 80)) return;
      this.live = this.live.filter((e) => e > now);
      if (this.live.length > 16) return;
      this.last[kind] = now;
      const t = Music.ctx.currentTime + (o.delay || 0);
      const d = this['_' + kind](t, o.vol == null ? 1 : o.vol, o) || 1;
      this.live.push(now + (d + (o.delay || 0)) * 1000);
    },

    _boom(t, v, o) {
      const s = o.size || 1, d = 0.6 + 0.5 * s;
      this._tone(t, d * 1.3, 'sine', 90, 30, 0.85 * v * Math.min(1.3, 0.7 + s * 0.3), o, { send: 0.4 });
      this._noise(t, d, 'lowpass', 1400, 150, 0.7 * v, o, { send: 0.35 });
      this._noise(t, 0.09, 'highpass', 2200, 2200, 0.35 * v, o);
      return d * 1.3;
    },
    _cannon(t, v, o) { // pháo bắn: tiếng "đoàng" gắt + dội trầm
      this._noise(t, 0.1, 'bandpass', 1800, 900, 0.6 * v, o, { q: 0.7 });
      this._tone(t, 0.4, 'sine', 150, 42, 0.8 * v, o, { send: 0.3 });
      this._noise(t, 0.45, 'lowpass', 700, 200, 0.5 * v, o, { send: 0.45 });
      return 0.6;
    },
    _whistle(t, v, o) { // đạn pháo rít trên không
      const d = o.dur || 1;
      this._noise(t, d, 'bandpass', 2800, 800, 0.7 * v, o, { swell: d * 0.4, rel: d * 0.35, q: 5 });
      return d;
    },
    _mg(t, v, o) { // súng máy, pháo cao xạ: loạt nổ dồn
      const n = Math.min(o.n || 8, 24), gap = o.gap || 0.16;
      for (let i = 0; i < n; i++) {
        const tt = t + i * gap + Math.random() * 0.03;
        this._noise(tt, 0.05, 'highpass', 1600, 1600, 0.4 * v, o);
        this._tone(tt, 0.07, 'square', 240, 90, 0.12 * v, o);
      }
      return n * gap + 0.1;
    },
    _tank(t, v, o) { // động cơ nổ "bành bạch" + xích sắt lạch cạch (xe tải nhẹ hơn, không xích)
      const c = Music.ctx, d = Math.max(1.5, o.dur || 4), light = o.unit === 'truck' || o.unit === 'jeep';
      const g = c.createGain(); this._env(g, t, d, 0.32 * v, { swell: 0.5, rel: 0.7 });
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = light ? 380 : 260;
      const os = c.createOscillator(); os.type = 'sawtooth'; os.frequency.value = light ? 62 : 44;
      const chug = c.createGain(); chug.gain.value = 0.65;
      const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = light ? 13 : 8; lg.gain.value = 0.35; lfo.connect(lg); lg.connect(chug.gain);
      os.connect(lp); lp.connect(chug); chug.connect(g);
      [os, lfo].forEach((x) => { x.start(t); x.stop(t + d + 0.1); });
      this._out(g, o, 0.15);
      if (!light) {
        const nz = c.createBufferSource(); nz.buffer = Music.noiseBuf; nz.loop = true;
        const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1100; bp.Q.value = 2.5;
        const cg = c.createGain(); cg.gain.value = 0.5;
        const l2 = c.createOscillator(), lg2 = c.createGain(); l2.type = 'square'; l2.frequency.value = 9; lg2.gain.value = 0.5; l2.connect(lg2); lg2.connect(cg.gain);
        const g2 = c.createGain(); this._env(g2, t, d, 0.12 * v, { swell: 0.6, rel: 0.7 });
        nz.connect(bp); bp.connect(cg); cg.connect(g2); nz.start(t, Math.random()); nz.stop(t + d + 0.1); l2.start(t); l2.stop(t + d + 0.1);
        this._out(g2, o);
      }
      return d;
    },
    _jet(t, v, o) { // máy bay bay qua: B-52 trầm nặng, máy bay cánh quạt, phản lực xé gió
      const d = Math.max(2.5, o.dur || 5), k = o.unit || 'mig';
      if (k === 'b52') {
        this._noise(t, d, 'lowpass', 520, 380, 0.95 * v, o, { swell: d * 0.35, rel: d * 0.35, send: 0.2 });
        this._tone(t, d, 'sawtooth', 58, 52, 0.2 * v, o, { swell: d * 0.35, rel: d * 0.35 });
      } else if (k === 'dak') {
        this._tone(t, d, 'sawtooth', 95, 86, 0.24 * v, o, { swell: d * 0.35, rel: d * 0.35 });
        this._noise(t, d, 'lowpass', 600, 400, 0.14 * v, o, { swell: d * 0.35, rel: d * 0.35 });
      } else {
        this._noise(t, d, 'bandpass', 1500, 520, 0.85 * v, o, { swell: d * 0.45, rel: d * 0.3, q: 1.2, send: 0.15 });
      }
      return d;
    },
    _heli(t, v, o) { // trực thăng: cánh quạt đập "phành phạch"
      const c = Music.ctx, d = Math.max(2, o.dur || 5);
      const nz = c.createBufferSource(); nz.buffer = Music.noiseBuf; nz.loop = true;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 320;
      const am = c.createGain(); am.gain.value = 0.5;
      const lfo = c.createOscillator(), lg = c.createGain(); lfo.type = 'square'; lfo.frequency.value = 14; lg.gain.value = 0.5; lfo.connect(lg); lg.connect(am.gain);
      const g = c.createGain(); this._env(g, t, d, 0.5 * v, { swell: 0.8, rel: 0.9 });
      nz.connect(lp); lp.connect(am); am.connect(g); nz.start(t, Math.random()); nz.stop(t + d + 0.1); lfo.start(t); lfo.stop(t + d + 0.1);
      this._out(g, o, 0.1);
      this._tone(t, d, 'sine', 68, 66, 0.14 * v, o, { swell: 0.8, rel: 0.9 });
      return d;
    },
    _haul(t, v, o) { // kéo pháo bằng sức người: bánh xe nghiến đất + nhịp bước chân nặng nề
      const d = Math.max(2, o.dur || 4);
      this._noise(t, d, 'bandpass', 380, 520, 0.2 * v, o, { swell: 0.6, rel: 0.8, q: 0.9 });
      for (let i = 0; i * 0.5 < d - 0.3; i++) this._tone(t + i * 0.5 + Math.random() * 0.04, 0.16, 'sine', 95, 55, 0.11 * v, o);
      return d;
    },
    _sam(t, v, o) { // tên lửa phóng: tiếng phụt lửa rít lên
      this._noise(t, 1.6, 'highpass', 500, 4200, 0.5 * v, o, { swell: 0.25, rel: 0.7, send: 0.3 });
      this._tone(t, 1.2, 'sine', 70, 55, 0.5 * v, o, { send: 0.2 });
      return 1.6;
    },
    _down(t, v, o) { // máy bay trúng đạn, lao xuống
      this._tone(t, 1.6, 'sine', 1100, 130, 0.2 * v, o, { swell: 0.1, rel: 0.5 });
      this._noise(t, 1.6, 'bandpass', 1800, 300, 0.25 * v, o, { swell: 0.2, rel: 0.6, q: 1.5 });
      return 1.7;
    },
  };

  SBS.audio = { music: Music, narrator: Narrator, sfx, fx: Fx, moods: Object.keys(MOODS) };
})();
