/* Trang chủ: phim sa bàn mở đầu (mũi tên xanh = âm mưu địch, đỏ = hướng đánh của ta) + thẻ các chiến dịch */
(function () {
  'use strict';
  const SBS = window.SBS;
  const U = SBS.util;
  const { h, $ } = U;
  const A = SBS.audio;

  SBS.battleById = (id) => SBS.battles.find((b) => b.id === id);
  SBS.battleList = () => SBS.battles.slice().sort((a, b) => a.order - b.order);

  const ACCENT = { vietbac1947: '#4ade80', bienGioi1950: '#fb923c', dienbienphu: '#f87171', apbac1963: '#2dd4bf', dbptrenkhong1972: '#60a5fa', xuan1975: '#fbbf24' };

  /* pha màu với trắng: k = tỉ lệ giữ lại màu gốc */
  const tint = (hex, k) => { const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k + 255 * (1 - k))); return `rgb(${c.join(',')})`; };

  /* ---------- Tranh minh hoạ cho thẻ (tự vẽ bằng SVG) ---------- */
  function thumb(kind, ac) {
    const W = 100, H = 190;
    const tri = (x, y, w, hgt, c, o) => `<polygon points="${x},${y} ${x + w / 2},${y - hgt} ${x + w},${y}" fill="${c}" opacity="${o || 1}"/>`;
    const pines = (n, y0, c) => Array.from({ length: n }, (_, i) => { const x = 8 + ((i * 97) % 84); const y = y0 + ((i * 13) % 12); return `<polygon points="${x},${y} ${x + 4},${y - 12} ${x + 8},${y}" fill="${c}"/>`; }).join('');
    let sky, body;
    if (kind === 'forest') {
      sky = ['#0b3d2e', '#14532d', '#031a12'];
      body = `<circle cx="70" cy="48" r="16" fill="#d9f99d" opacity=".22"/>` + tri(-10, 150, 70, 80, '#0f3d2a') + tri(30, 160, 80, 95, '#14532d') + tri(-20, 190, 90, 70, '#0a2a1c') + pines(14, 165, '#052e1b') + `<path d="M0 182 Q40 170 100 184" stroke="#86efac" stroke-width="2" fill="none" opacity=".5"/>`;
    } else if (kind === 'karst') {
      sky = ['#7c2d12', '#c2410c', '#2a0e05'];
      body = `<circle cx="30" cy="60" r="20" fill="#fde68a" opacity=".35"/>` + [10, 36, 60, 80].map((x, i) => `<path d="M${x} 190 L${x + 6} ${96 + i * 12} Q${x + 14} ${86 + i * 10} ${x + 22} 190Z" fill="${i % 2 ? '#431407' : '#5b1d0a'}"/>`).join('') + `<path d="M0 178 Q30 168 56 176 T100 168" stroke="#fed7aa" stroke-width="1.5" stroke-dasharray="3 3" fill="none"/>`;
    } else if (kind === 'valley') {
      sky = ['#7f1d1d', '#b91c1c', '#2b0707'];
      body = tri(-20, 150, 70, 70, '#450a0a') + tri(50, 150, 70, 80, '#3b0a0a') + `<path d="M0 190 Q50 140 100 190Z" fill="#1f0505"/>` + `<g fill="#fca5a5"><circle cx="30" cy="172" r="3"/><circle cx="48" cy="166" r="3"/><circle cx="66" cy="172" r="3"/></g><polygon points="50,150 50,132 62,138 50,144" fill="#ffcf4a"/><rect x="49" y="132" width="1.6" height="20" fill="#fde68a"/>`;
    } else if (kind === 'delta') {
      sky = ['#0e7490', '#0891b2', '#042f2e'];
      body = `<rect x="0" y="120" width="100" height="70" fill="#14532d"/>` + [0, 1, 2, 3, 4].map((i) => `<polygon points="0,${190 - i * 14} 100,${190 - i * 14} 100,${182 - i * 14} 0,${182 - i * 14}" fill="${i % 2 ? '#65a30d' : '#4d7c0f'}" opacity=".85"/>`).join('') + `<path d="M0 150 Q50 140 100 154" stroke="#67e8f9" stroke-width="3" fill="none" opacity=".7"/>` + [18, 70].map((x) => `<line x1="${x}" y1="150" x2="${x + 2}" y2="118" stroke="#3f2d14" stroke-width="2"/><path d="M${x + 2} 118 q-12 -4 -14 6 M${x + 2} 118 q12 -4 14 6 M${x + 2} 118 q-8 -10 -12 -2 M${x + 2} 118 q8 -10 12 -2" stroke="#4ade80" stroke-width="2" fill="none"/>`).join('');
    } else if (kind === 'city') {
      sky = ['#0b1230', '#1e2a5a', '#04060f'];
      body = [8, 22, 36, 52, 68, 82].map((x, i) => `<rect x="${x}" y="${150 - (i % 3) * 14 - 10}" width="12" height="${60 + (i % 3) * 14}" fill="#0a1024"/>`).join('') + `<path d="M30 190 L44 40 L52 40 L66 190Z" fill="#fde68a" opacity=".16"/><path d="M60 190 L72 60 L80 60 L90 190Z" fill="#fde68a" opacity=".12"/>` + `<g fill="#cbd5e1"><path d="M20 60 l16 4 l16 -4 l-16 12z"/><path d="M58 92 l12 3 l12 -3 l-12 9z" opacity=".8"/></g><circle cx="76" cy="30" r="1.5" fill="#fff"/><circle cx="20" cy="40" r="1.2" fill="#fff"/><circle cx="50" cy="22" r="1" fill="#fff"/>`;
    } else {
      sky = ['#78350f', '#d97706', '#2a1404'];
      body = `<circle cx="50" cy="70" r="26" fill="#fde68a" opacity=".32"/><rect x="14" y="148" width="72" height="9" fill="#e7e5e4"/><rect x="22" y="136" width="56" height="12" fill="#f5f5f4"/><rect x="38" y="124" width="24" height="12" fill="#fafaf9"/><rect x="49" y="100" width="1.6" height="24" fill="#e5e5e5"/><polygon points="50.6,100 66,106 50.6,112" fill="#ef4444"/><rect x="0" y="157" width="100" height="33" fill="#431407"/><path d="M6 176 L40 176" stroke="#ffd23f" stroke-width="3"/><polygon points="40,171 52,176 40,181" fill="#ffd23f"/>`;
    }
    const id = 'g' + kind;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset=".55" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>${body}</svg>`;
  }

  /* ---------- Trang chủ ---------- */
  let st = { tok: 0, timer: null };
  const stars = (n) => h('span', { class: 'stars' }, [1, 2, 3].map((i) => h('span', { class: i <= n ? 'on' : '' }, '★')));

  SBS.screens.home = {
    enter(root) {
      const sb = SBS.sb, S = SBS.store, intro = SBS.homeIntro;
      const map = SBS.battleById(intro.map).map;
      if (sb.map !== map) sb.load(map);
      sb.resetActors();
      sb.autoRotate = 0.12; // trang chủ: sa bàn luôn xoay vòng 360° (khoảng 52 giây một vòng)
      sb.setCam(intro.cam, true);
      sb.layer.style.display = '';
      SBS.setCrumb('<b>Trang chủ</b>');
      const list = SBS.battleList();
      const done = list.filter((b) => S.battleBest(b.id)).length;
      const msDone = SBS.milestones.filter((m) => S.msGet(m.id).mastered).length;
      const p = S.current();
      const exams = p ? new Set(p.exams.map((e) => e.id)).size : 0;
      const chip = (cls, ic, tx) => h('div', { class: 'fchip ' + (cls || '') }, h('div', { class: 'ic' }, ic), h('div', null, tx));

      let cardsEl;
      root.append(
        h('section', { class: 'hero' },
          h('div', { class: 'badge' }, 'KHÁNG CHIẾN 1945 – 1975'),
          h('h1', null, 'HỌC LỊCH SỬ ', h('br'), 'CÙNG AI'),
          h('p', { class: 'sub' }, 'Bằng sa bàn số: em hãy đưa ra quyết định – ', h('b', null, 'vì sao ta chiến thắng'), '.'),
          h('div', { class: 'chips6' },
            chip('', '🗺️', 'Sa bàn 3D xoay 360°'),
            chip('r', '➤', 'Hướng đánh của ta'),
            chip('b', '➤', 'Âm mưu của địch'),
            chip('', '🎯', 'Mỗi trận 3 quyết định'),
            chip('', SBS.aiIcon(26), 'AI gợi ý 3 bậc'),
            chip('', '📝', '20 đề tốt nghiệp')),
          h('div', { class: 'hero-cta' },
            h('button', { class: 'btn primary big', onclick: () => SBS.go('battle/' + list[0].id) }, '▶ Bắt đầu'),
            h('button', { class: 'btn big', onclick: () => playIntro() }, '▶ Diễn biến')),
          h('div', { class: 'hero-prog' }, h('span', { class: 'chip gold' }, `Sa bàn ${done}/6`), h('span', { class: 'chip blue' }, `Mốc vững ${msDone}/${SBS.milestones.length}`), h('span', { class: 'chip green' }, `Đề đã làm ${exams}/20`))),
        (cardsEl = h('section', { class: 'cards' }, list.map((b, i) => {
          const best = S.battleBest(b.id), nScene = b.steps.filter((s) => !s.decision).length;
          const ac = ACCENT[b.id] || '#ffcf4a';
          const year = (b.date.match(/\d{4}/g) || []).pop();
          return h('div', { class: 'ccard', title: b.title + ' – ' + b.tagline, style: { '--ac': ac, '--bg1': tint(ac, 0.62), '--bg2': tint(ac, 0.2) }, onclick: () => SBS.go('battle/' + b.id) },
            h('div', { class: 'th', html: thumb(b.thumb, ac) + '' }, h('div', { class: 'no' }, b.order)),
            h('div', { class: 'bd' }, h('h4', null, SBS.tabName(b)), h('div', { class: 'meta' }, h('span', { class: 'chip' }, year), stars(best ? best.stars : 0))));
        }))),
      );
      // lớp phủ trên sa bàn
      const ui = $('#stage-ui');
      st.sub = h('div'); // không còn thanh chú thích chữ trên sa bàn
      st.btn = h('button', { class: 'btn small', onclick: () => (st.playing ? stopIntro() : playIntro()) }, '▶ Diễn biến');
      ui.append(h('div', { class: 'legend mini' }, h('span', null, h('i', { class: 'b' }), 'Âm mưu của địch'), h('span', null, h('i', { class: 'r' }), 'Hướng đánh của ta')), h('div', { class: 'stage-play' }, st.btn)); // chú thích nhỏ ở mép trái trong sa bàn
      sb.onArrowClick = (rec) => { if (rec.opt) { SBS.go('battle/dienbienphu'); return; } sb.focusArrow(rec); playIntro(rec.ord); };
      SBS.deck.hook = { next: () => false, prev: () => false };
      if (SBS.started && !SBS._introPlayed) { SBS._introPlayed = true; setTimeout(() => playIntro(), 500); }
      else if (!SBS.started) {
        // vừa mở app: hiện sa bàn sẵn; lần bấm đầu tiên ở chỗ trống sẽ mở âm thanh và chạy phần diễn biến, bấm vào nút/thẻ thì chỉ mở âm thanh
        showStatic();
        SBS.onEnter = (onControl) => { SBS.onEnter = null; SBS._introPlayed = true; if (!onControl && document.body.classList.contains('screen-home')) playIntro(); };
      } else showStatic();
    },
    leave() { SBS.onEnter = null; stopIntro(true); SBS.sb.autoRotate = 0; SBS.sb.onArrowClick = null; SBS.sb.followOn = false; SBS.sb.focusOrd = null; },
  };

  /* 3 lựa chọn của một quyết định hiện ngay trên sa bàn trang chủ (bấm vào để vào trận) */
  function showOptions() {
    const b = SBS.battleById('dienbienphu'), d = b && b.steps.find((x) => x.decision);
    if (!d) return;
    SBS.sb.optionArrows(d.decision.options.map((o, i) => ({ k: o.k, letter: 'ABC'[i], short: o.short, acts: o.show })), () => SBS.go('battle/dienbienphu'));
  }
  function showStatic() {
    const sb = SBS.sb, intro = SBS.homeIntro;
    sb.resetActors(); sb.setCam(intro.cam, true);
    sb.runStep({ acts: intro.acts, cam: intro.cam }, true);
    sb.followOn = false;
    showOptions();
  }
  function stopIntro(quiet) {
    st.tok++; st.playing = false;
    clearInterval(st.timer);
    A.narrator.stop();
    if (SBS.sb) { SBS.sb.followOn = false; SBS.sb.focusOrd = null; }
    if (!quiet && st.btn) st.btn.textContent = '▶ Diễn biến';
  }
  async function playIntro(focusOrd) {
    const sb = SBS.sb, intro = SBS.homeIntro;
    stopIntro(true);
    const tok = ++st.tok;
    st.playing = true;
    if (st.btn) st.btn.textContent = '⏸ Dừng';
    A.music.unlock();
    sb.resetActors();
    sb.setCam(intro.cam, false);
    const dur = await A.narrator.prepare(intro.text);
    if (tok !== st.tok) return;
    sb.runStep({ acts: intro.acts, cam: intro.cam }, false, { text: intro.text, dur, focusOrd });
    showOptions();
    // phụ đề chạy theo giọng kể
    const shown = (x) => x.replace(/mũi tên (xanh|đỏ) là /gi, 'đây là '); // phụ đề không ghi màu; lời kể giữ nguyên
    const sens = intro.text.match(/[^.!?:]+[.!?:]?/g).map((x) => x.trim()).filter(Boolean);
    const tot = sens.reduce((s, x) => s + x.length, 0);
    st.timer = setInterval(() => {
      const pr = A.narrator.progress();
      if (pr == null) return;
      let acc = 0, idx = sens.length - 1;
      for (let i = 0; i < sens.length; i++) { acc += sens[i].length; if (pr * tot <= acc) { idx = i; break; } }
      st.sub.innerHTML = sens.map((x, i) => (i === idx ? `<b>${U.esc(shown(x))}</b>` : '')).join('');
    }, 200);
    A.narrator.speak(intro.text).then((ok) => {
      if (tok !== st.tok) return;
      clearInterval(st.timer);
      st.playing = false; sb.followOn = false; sb.focusOrd = null; // kể xong: sa bàn lại tự xoay
      if (st.btn) st.btn.textContent = '▶ Diễn biến';
      st.sub.textContent = 'Bấm vào mũi tên trên sa bàn để xem cảnh – camera sẽ xoay theo.';
    });
  }
})();
