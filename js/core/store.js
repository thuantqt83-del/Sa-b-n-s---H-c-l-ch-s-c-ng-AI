/* Kho lưu trữ: cài đặt, hồ sơ học sinh, kết quả (localStorage). Giáo viên đọc từ đây để thống kê. */
(function () {
  'use strict';
  const SBS = window.SBS;
  const U = SBS.util;
  const KEY = 'sabanso.v1';

  const DEFAULT_SETTINGS = {
    music: 0.5, // âm lượng nhạc nền 0..1
    sfx: 0.8, // âm lượng tiếng pháo, xe tăng, máy bay
    voice: 1, // âm lượng giọng kể
    rate: 1, // tốc độ đọc
    narrator: true, // bật giọng kể
    quality: 'high', // high | low
    voiceName: '', // giọng dự phòng của trình duyệt
    advisor: true, // bật cố vấn AI gợi ý 3 bậc
    teacherPin: '1954',
  };

  let db = { v: 1, settings: { ...DEFAULT_SETTINGS }, current: null, profiles: {} };
  const listeners = [];
  let memoryOnly = false;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const o = JSON.parse(raw);
        db = Object.assign(db, o);
        db.settings = Object.assign({}, DEFAULT_SETTINGS, o.settings || {});
      }
    } catch (e) {
      memoryOnly = true;
    }
  }
  function save() {
    if (memoryOnly) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch (e) {
      memoryOnly = true;
    }
  }
  function emit(what) {
    listeners.forEach((f) => f(what));
  }

  function newProfile(name, cls) {
    return { id: 'p_' + U.uid(), name: name.trim(), cls: (cls || '').trim(), created: Date.now(), last: Date.now(), battles: {}, ms: {}, exams: [], tags: {} };
  }

  const S = {
    load,
    save,
    on: (f) => listeners.push(f),
    get settings() { return db.settings; },
    set(k, v) { db.settings[k] = v; save(); emit('settings'); },
    get memoryOnly() { return memoryOnly; },

    /* ----- Hồ sơ ----- */
    profiles: () => Object.values(db.profiles),
    current() { return db.current ? db.profiles[db.current] || null : null; },
    createProfile(name, cls) {
      const p = newProfile(name, cls);
      db.profiles[p.id] = p;
      db.current = p.id;
      save(); emit('profile');
      return p;
    },
    switchProfile(id) { if (db.profiles[id]) { db.current = id; save(); emit('profile'); } },
    deleteProfile(id) {
      delete db.profiles[id];
      if (db.current === id) db.current = null;
      save(); emit('profile');
    },
    touch() { const p = S.current(); if (p) { p.last = Date.now(); save(); } },

    /* ----- Sa bàn ----- */
    addBattle(battleId, res) {
      const p = S.current(); if (!p) return;
      const b = (p.battles[battleId] = p.battles[battleId] || { best: null, attempts: [] });
      b.attempts.push(res);
      if (!b.best || res.score > b.best.score) b.best = { score: res.score, stars: res.stars, ts: res.ts };
      res.ds.forEach((d) => d.tags.forEach((t) => { p.tags[t] = (p.tags[t] || 0) + 1; }));
      p.last = Date.now();
      save(); emit('battle');
    },
    battleBest(battleId) {
      const p = S.current();
      return p && p.battles[battleId] ? p.battles[battleId].best : null;
    },

    /* ----- Mốc sự kiện ----- */
    msGet(id) { const p = S.current(); return (p && p.ms[id]) || { seen: false, right: 0, wrong: 0, mastered: false }; },
    msSeen(id) {
      const p = S.current(); if (!p) return;
      const m = (p.ms[id] = p.ms[id] || { seen: false, right: 0, wrong: 0, mastered: false });
      m.seen = true; save(); emit('ms');
    },
    msAnswer(id, ok) {
      const p = S.current(); if (!p) return;
      const m = (p.ms[id] = p.ms[id] || { seen: true, right: 0, wrong: 0, mastered: false });
      m.seen = true;
      if (ok) { m.right++; if (m.right >= 1 && m.wrong <= m.right) m.mastered = true; } else { m.wrong++; m.mastered = false; }
      save(); emit('ms');
    },

    /* ----- Luyện đề ----- */
    addExam(res) {
      const p = S.current(); if (!p) return;
      p.exams.push(res); p.last = Date.now();
      save(); emit('exam');
    },

    /* ----- Xuất / nhập cho giáo viên ----- */
    exportProfile(id) {
      const p = db.profiles[id || db.current];
      return p ? JSON.stringify({ app: 'sabanso', v: 1, exported: Date.now(), profile: p }) : null;
    },
    importProfiles(jsonText) {
      const o = JSON.parse(jsonText);
      const list = o.profiles ? o.profiles : o.profile ? [o.profile] : [];
      let added = 0, updated = 0;
      list.forEach((p) => {
        if (!p || !p.id || !p.name) return;
        const cur = db.profiles[p.id];
        if (!cur) { db.profiles[p.id] = p; added++; }
        else if ((p.last || 0) > (cur.last || 0)) { db.profiles[p.id] = p; updated++; }
      });
      save(); emit('import');
      return { added, updated };
    },
    exportAll() { return JSON.stringify({ app: 'sabanso', v: 1, exported: Date.now(), profiles: Object.values(db.profiles) }); },
    clearAll() {
      db = { v: 1, settings: { ...db.settings }, current: null, profiles: {} };
      save(); emit('clear');
    },
  };

  load();
  SBS.store = S;
})();
