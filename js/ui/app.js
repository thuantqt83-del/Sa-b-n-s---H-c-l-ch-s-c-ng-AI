/* Khung ứng dụng kiểu trình chiếu: định tuyến, thanh trên, thanh ◀ ▶ dưới đáy, hộp thoại, cài đặt */
(function () {
  'use strict';
  const SBS = window.SBS;
  const U = SBS.util;
  const { $, h } = U;

  SBS.screens = {};
  const STAGE_SCREENS = ['home', 'battle'];
  const MOOD = { home: 'home', milestones: 'study', exam: 'exam', profile: 'study', teacher: 'study' };
  let current = null;

  /* ---------- Thông báo & hộp thoại ---------- */
  SBS.toast = function (msg, kind) {
    const t = h('div', { class: 'toast ' + (kind || '') }, msg);
    $('#toasts').appendChild(t);
    setTimeout(() => t.remove(), 4200);
  };
  SBS.modal = function (o) {
    const root = $('#modal-root');
    const close = () => { bg.remove(); if (o.onClose) o.onClose(); };
    const foot = h('div', { class: 'mf' }, (o.buttons || [{ label: 'Đóng', cls: 'primary' }]).map((b) => h('button', { class: 'btn ' + (b.cls || ''), onclick: () => { if (b.onClick) { if (b.onClick(close) === false) return; } if (!b.keep) close(); } }, b.label)));
    const box = h('div', { class: 'modal' + (o.wide ? ' wide' : '') }, o.title ? h('h3', null, o.title) : null, typeof o.body === 'string' ? h('div', { html: o.body }) : o.body, foot);
    const bg = h('div', { class: 'modal-bg', onmousedown: (e) => { if (e.target === bg && !o.sticky) close(); } }, box);
    root.appendChild(bg);
    return { close, el: box };
  };
  SBS.confirm = (title, msg, okLabel) => new Promise((res) => {
    SBS.modal({ title, body: h('p', null, msg), sticky: true, buttons: [{ label: 'Hủy', onClick: () => res(false) }, { label: okLabel || 'Đồng ý', cls: 'primary', onClick: () => res(true) }] });
  });

  /* tên ngắn của 6 chiến dịch (thanh trên, thẻ trang chủ) */
  const SHORT = { vietbac1947: 'Việt Bắc', bienGioi1950: 'Biên giới', dienbienphu: 'Điện Biên Phủ', apbac1963: 'Ấp Bắc', dbptrenkhong1972: 'ĐBP trên không', xuan1975: 'Tây Nguyên – HCM' };
  SBS.tabName = (b) => SHORT[b.id] || b.short;

  /* ---------- Thứ tự các trang trình chiếu ---------- */
  const deck = (SBS.deck = {
    order: [],
    hook: null, // {next(): boolean, prev(): boolean} – màn hình có thể "nhận" nút ◀ ▶ trước
    build() {
      this.order = ['home'].concat(SBS.battleList().map((b) => 'battle/' + b.id), ['milestones', 'exam']);
    },
    index() { const r = location.hash.replace(/^#\/?/, '') || 'home'; const i = this.order.indexOf(r); return i >= 0 ? i : -1; },
    goto(i) { if (i >= 0 && i < this.order.length) SBS.go(this.order[i]); },
    next() { if (this.hook && this.hook.next && this.hook.next()) return; this.goto(Math.max(this.index(), 0) + 1); },
    prev() { if (this.hook && this.hook.prev && this.hook.prev()) return; this.goto(this.index() - 1); },
    setStatus(node) { const el = $('#deck .deck-status'); if (!el) return; el.innerHTML = ''; if (node) el.append(...[].concat(node)); },
    setNextDisabled(v) { const b = $('#deck .deck-btn.next'); if (b) b.disabled = !!v; },
    /* thanh trang nằm ở thanh trên: Trang chủ, 6 trận, Học cùng AI, Luyện đề */
    renderTabs() {
      const box = $('#topbar .deck-tabs');
      if (!box) return;
      box.innerHTML = '';
      // thanh trên: Trang chủ + đủ 6 chiến dịch (tên ngắn); "Học cùng AI", "Luyện đề" đã có nút riêng bên phải
      this.order.filter((r) => r === 'home' || r.startsWith('battle/')).forEach((r) => {
        const b = r.startsWith('battle/') ? SBS.battleById(r.slice(7)) : null;
        const done = b && SBS.store.battleBest(b.id);
        box.appendChild(h('a', { 'data-r': r, title: b ? b.title : 'Trang chủ', class: done ? 'done' : '', onclick: () => SBS.go(r) }, b ? SBS.tabName(b) : 'Trang chủ'));
      });
      this.mark();
    },
    render() {
      const bar = $('#deck');
      bar.innerHTML = '';
      bar.append(
        h('button', { class: 'deck-btn prev', title: 'Quay lại (←)', onclick: () => deck.prev() }, '◀'),
        h('div', { class: 'deck-mid' }, h('div', { class: 'deck-status' })),
        h('button', { class: 'deck-btn next', title: 'Đi tiếp (→)', onclick: () => deck.next() }, '▶'),
      );
      this.renderTabs();
      buildTools();
    },
    mark() {
      const r = location.hash.replace(/^#\/?/, '') || 'home';
      U.$$('#topbar .deck-tabs a').forEach((a) => a.classList.toggle('on', a.dataset.r === r));
      const on = $('#topbar .deck-tabs a.on');
      if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'center' });
    },
  });

  /* ---------- Định tuyến ---------- */
  SBS.go = (route) => { if (location.hash === '#/' + route) route_(); else location.hash = '#/' + route; };
  SBS.setCrumb = (html) => { const c = $('#topbar .crumb'); if (c) c.innerHTML = html || ''; };
  function route_() {
    let parts = (location.hash.replace(/^#\/?/, '') || 'home').split('/');
    if (parts[0] === 'campaign') parts = ['home'];
    const name = SBS.screens[parts[0]] ? parts[0] : 'home';
    if (current && SBS.screens[current.name].leave) SBS.screens[current.name].leave();
    deck.hook = null;
    SBS.audio.narrator.stop();
    const root = $('#screen');
    root.innerHTML = '';
    $('#stage-ui').innerHTML = '';
    current = { name, params: parts.slice(1) };
    const examRun = name === 'exam' && parts[1] && /^\d+$/.test(parts[1]);
    const noDeck = examRun;
    document.body.className = 'screen-' + name + (STAGE_SCREENS.includes(name) ? '' : ' nostage') + (noDeck ? ' deck-off' : '');
    if (STAGE_SCREENS.includes(name)) { SBS.sb.start(); SBS.sb.resize(); } else SBS.sb.stop();
    if (MOOD[name]) SBS.audio.music.setMood(MOOD[name]);
    deck.setStatus(null); deck.setNextDisabled(false);
    SBS.setCrumb('');
    SBS.screens[name].enter(root, parts.slice(1));
    deck.mark();
    refreshNav();
  }
  /* thanh công cụ ngay dưới thanh trên: Học cùng AI, Luyện đề, Thống kê, Giáo viên + chú thích mũi tên (nằm ở mép trên, không che sa bàn) */
  function buildTools() {
    const bar = $('#topbar .deck-tools');
    if (!bar) return;
    bar.innerHTML = '';
    const tool = (key, ico, label, cls) => h('button', { class: 'deck-tool ' + cls, 'data-nav': key, title: label, onclick: () => SBS.go(key) }, h('span', { class: 'ti' }, ico), h('span', { class: 'tl' }, label));
    bar.append(tool('milestones', SBS.aiIcon(22), 'Học cùng AI', 'c1'), tool('exam', '📝', 'Luyện đề', 'c2'), tool('profile', '📊', 'Thống kê', 'c3'), tool('teacher', '🎓', 'Giáo viên', 'c4'));
    refreshNav();
  }
  function refreshNav() {
    U.$$('#topbar [data-nav]').forEach((a) => a.classList.toggle('on', current && a.dataset.nav === current.name));
  }

  /* ---------- Thanh trên ---------- */
  function buildTop() {
    const top = $('#topbar');
    top.innerHTML = '';
    const S = SBS.store;
    const p = S.current();
    top.append(
      h('div', { class: 'logo', onclick: () => SBS.go('home') }, h('div', { class: 'mark' }, '★'), h('div', null, h('b', null, 'SA BÀN SỐ'), h('small', null, 'Học Lịch sử cùng AI'))),
      h('div', { class: 'crumb' }),
      h('div', { class: 'deck-tabs' }),
      h('div', { class: 'deck-tools' }),
      h('div', { class: 'top-r' },
        h('button', { class: 'iconbtn' + (S.settings.music <= 0.001 ? ' off' : ''), title: 'Bật/tắt nhạc nền', onclick: () => { S.set('music', S.settings.music > 0.001 ? 0 : 0.5); SBS.audio.music.applyVolume(); buildTop(); } }, '🎵'),
        h('button', { class: 'iconbtn' + (S.settings.narrator ? '' : ' off'), title: 'Bật/tắt giọng kể', onclick: () => { S.set('narrator', !S.settings.narrator); if (!S.settings.narrator) SBS.audio.narrator.stop(); buildTop(); } }, '🔊'),
        h('button', { class: 'iconbtn', title: 'Cài đặt', onclick: () => SBS.openSettings() }, '⚙'),
      ),
    );
    buildTools();
    deck.renderTabs();
  }
  SBS.refreshTop = buildTop;

  /* ---------- Tên học sinh: không bắt buộc ---------- */
  SBS.ensureProfile = function () {
    const S = SBS.store;
    if (!S.current()) {
      const ex = S.profiles().sort((a, b) => b.last - a.last)[0];
      if (ex) S.switchProfile(ex.id); else S.createProfile('Học sinh', '');
    }
  };
  SBS.openLogin = function () { // đổi tên / đổi học sinh (tùy chọn)
    const S = SBS.store, p = S.current();
    const name = h('input', { value: p ? p.name : '', maxlength: 40 });
    const cls = h('input', { value: p ? p.cls : '', placeholder: 'Ví dụ: 12A3 (không bắt buộc)', maxlength: 12 });
    const list = S.profiles().filter((x) => !p || x.id !== p.id).sort((a, b) => b.last - a.last);
    const body = h('div', null,
      h('p', { class: 'muted' }, 'Em không cần nhập tên để học. Nếu muốn giáo viên nhận ra bài của em, hãy ghi tên và lớp.'),
      h('div', { class: 'field' }, h('label', null, 'Tên hiển thị'), name),
      h('div', { class: 'field' }, h('label', null, 'Lớp'), cls),
      list.length ? h('div', { class: 'field' }, h('label', null, 'Hoặc chuyển sang hồ sơ khác trên máy này'), h('div', { class: 'dlist' }, list.slice(0, 6).map((x) => h('div', { class: 'di', style: { cursor: 'pointer' }, onclick: () => { S.switchProfile(x.id); m.close(); buildTop(); route_(); } }, h('b', null, x.name), h('span', { class: 'muted' }, x.cls || ''))))) : null,
      h('div', { class: 'toolbar' }, h('button', { class: 'btn small', onclick: () => { S.createProfile('Học sinh mới', ''); m.close(); buildTop(); route_(); } }, '＋ Hồ sơ mới')),
    );
    const m = SBS.modal({ title: 'Tên của em (không bắt buộc)', body, buttons: [{ label: 'Hủy' }, { label: 'Lưu', cls: 'primary', onClick: () => { if (p) { p.name = name.value.trim() || 'Học sinh'; p.cls = cls.value.trim(); S.save(); } buildTop(); route_(); } }] });
  };

  /* ---------- Cài đặt ---------- */
  SBS.openSettings = function () {
    const S = SBS.store, A = SBS.audio;
    const slider = (label, key, min, max, step, fmt, onch) => {
      const out = h('b', null, fmt(S.settings[key]));
      const r = h('input', { type: 'range', class: 'range', min, max, step, value: S.settings[key], oninput: () => { S.set(key, parseFloat(r.value)); out.textContent = fmt(S.settings[key]); if (onch) onch(); } });
      return h('div', { class: 'field' }, h('label', null, label + ': ', out), r);
    };
    const voices = A.narrator.voices();
    const sel = h('select', { onchange: () => S.set('voiceName', sel.value) }, h('option', { value: '' }, voices.length ? 'Tự chọn giọng nam' : 'Không tìm thấy giọng tiếng Việt của trình duyệt'), voices.map((v) => h('option', { value: v.name, selected: v.name === S.settings.voiceName }, v.name)));
    const q = h('select', { onchange: () => { S.set('quality', q.value); SBS.sb.setQuality(q.value); SBS.toast('Đã đổi chất lượng đồ họa. Hãy mở lại màn hình để áp dụng đầy đủ.'); } },
      h('option', { value: 'high', selected: S.settings.quality === 'high' }, 'Cao (có bóng đổ – máy khỏe)'), h('option', { value: 'low', selected: S.settings.quality === 'low' }, 'Thấp (mượt hơn trên máy yếu)'));
    const body = h('div', null,
      slider('Âm lượng nhạc nền', 'music', 0, 1, 0.05, (v) => Math.round(v * 100) + '%', () => A.music.applyVolume()),
      slider('Âm lượng tiếng pháo, xe tăng, máy bay', 'sfx', 0, 1, 0.05, (v) => Math.round(v * 100) + '%', () => A.fx.setVolume()),
      slider('Âm lượng giọng kể', 'voice', 0, 1, 0.05, (v) => Math.round(v * 100) + '%'),
      slider('Tốc độ giọng kể', 'rate', 0.7, 1.4, 0.05, (v) => v.toFixed(2) + '×'),
      h('div', { class: 'field' }, h('label', null, 'Giọng dự phòng của trình duyệt (khi lời kể chưa có file ghi sẵn)'), sel),
      h('div', { class: 'field' }, h('label', null, 'Chất lượng đồ họa 3D'), q),
      h('div', { class: 'toolbar' },
        h('button', { class: 'btn small', onclick: () => { A.music.unlock(); A.narrator.speak('Xin chào các em. Đây là giọng kể nam của sa bàn số.'); } }, '🔊 Thử giọng kể'),
        h('button', { class: 'btn small', onclick: () => { A.music.unlock(); A.sfx('ok'); } }, '🎵 Thử âm thanh'),
        h('button', { class: 'btn small', onclick: () => { A.music.unlock(); A.fx.last = {}; A.fx.play('cannon', { vol: 1 }); A.fx.play('boom', { vol: 1, delay: 0.7 }); A.fx.play('tank', { dur: 3, delay: 1.4 }); A.fx.play('jet', { dur: 3, delay: 1.4, unit: 'mig' }); } }, '💥 Thử tiếng pháo, xe, máy bay'),
      ),
    );
    SBS.modal({ title: 'Cài đặt âm thanh & đồ họa', body, buttons: [{ label: 'Xong', cls: 'primary', onClick: () => { buildTop(); } }] });
  };

  /* ---------- Khởi động ---------- */
  SBS.boot = function () {
    SBS.sb = new SBS.Sandbox($('#stage'));
    const S = SBS.store;
    SBS.ensureProfile();
    deck.build(); deck.render();
    buildTop();
    S.on((w) => { if (w === 'profile') buildTop(); if (w === 'battle') deck.render(); });
    window.addEventListener('hashchange', route_);
    // bàn phím / bút trình chiếu: → PageDown đi tiếp, ← PageUp quay lại
    window.addEventListener('keydown', (e) => {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if ($('#modal-root').children.length) return;
      if (document.body.classList.contains('deck-off')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); deck.next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); deck.prev(); }
    });
    /* Không còn trang chào. Trình duyệt chỉ cho phát tiếng sau thao tác đầu tiên của người dùng,
       nên lần bấm chuột / phím đầu tiên ở bất kỳ đâu sẽ mở âm thanh (nhạc nền, giọng kể, tiếng binh khí). */
    let started = false;
    const enter = (e) => {
      if (started) return;
      started = true;
      SBS.started = true;
      SBS.audio.music.unlock();
      const t = e && e.target;
      const onControl = !!(t && t.closest && t.closest('button, a, input, select, textarea, canvas, .ccard, .deck-tabs, .modal'));
      if (SBS.onEnter) SBS.onEnter(onControl);
    };
    ['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, enter, true));
    SBS.audio.music.mood = 'home';
    route_();
  };
})();
