/* Bảng thống kê giáo viên: kết quả cả lớp, phân tích lỗi tư duy & chủ đề yếu, kiểm tra app, đề & đáp án, dữ liệu */
(function () {
  'use strict';
  const SBS = window.SBS;
  const U = SBS.util;
  const { h } = U;
  let unlocked = false;

  const scCls = (v, max) => (v == null ? '' : v / max >= 0.8 ? 'sc-good' : v / max >= 0.5 ? 'sc-mid' : 'sc-low');
  const num = (v, d) => (v == null || isNaN(v) ? '—' : String(U.round1(v)).replace('.', ','));

  /* ---------- Tổng hợp số liệu một học sinh ---------- */
  function rowOf(p) {
    const battles = SBS.battleList();
    const b = {};
    let bt = 0, played = 0, stars = 0, plays = 0;
    battles.forEach((x) => {
      const r = p.battles[x.id];
      b[x.id] = r && r.best ? r.best.score : null;
      if (r && r.best) { bt += r.best.score; played++; stars += r.best.stars; plays += r.attempts.length; }
    });
    const ex = p.exams || [];
    const exAvg = ex.length ? ex.reduce((s, e) => s + e.score, 0) / ex.length : null;
    const exMax = ex.length ? Math.max(...ex.map((e) => e.score)) : null;
    const ms = SBS.milestones.filter((m) => p.ms[m.id] && p.ms[m.id].mastered).length;
    const tags = Object.keys(p.tags || {}).sort((a, c) => p.tags[c] - p.tags[a]);
    return { p, name: p.name, cls: p.cls || '', b, bt, played, stars, plays, exN: ex.length, exD: new Set(ex.map((e) => e.id)).size, exAvg, exMax, ms, topTag: tags[0] ? SBS.ai.tag(tags[0]).name + ' (' + p.tags[tags[0]] + ')' : '—', last: p.last };
  }

  SBS.screens.teacher = {
    enter(root, params) {
      const page = h('div', { class: 'page' }), wrap = h('div', { class: 'wrap' });
      page.appendChild(wrap); root.appendChild(page);
      if (!unlocked) return gate(wrap, () => SBS.go('teacher'));
      let tab = params[0] || 'bang';
      const tabs = [['bang', '📊 Bảng thống kê'], ['phantich', '📈 Phân tích lớp'], ['kiemtra', '✅ Kiểm tra app'], ['dapan', '📝 Đề & đáp án'], ['dulieu', '💾 Dữ liệu']];
      wrap.append(
        h('div', { class: 'pagehead' }, h('div', null, h('h2', null, 'Bảng thống kê giáo viên'), h('p', null, 'Theo dõi kết quả học tập của học sinh trên máy này và các file kết quả học sinh nộp.')),
          h('button', { class: 'btn ghost', onclick: () => { unlocked = false; SBS.go('home'); } }, '🔒 Khóa')),
        h('div', { class: 'tabs' }, tabs.map(([k, t]) => h('button', { class: tab === k ? 'on' : '', onclick: () => SBS.go('teacher/' + k) }, t))));
      const body = h('div');
      wrap.appendChild(body);
      ({ bang: tableTab, phantich: analysisTab, kiemtra: checkTab, dapan: keysTab, dulieu: dataTab }[tab] || tableTab)(body);
    },
  };

  function gate(wrap, ok) {
    const saved = SBS.store.settings.teacherPin; // chưa đặt PIN thì saved rỗng: lần đầu sẽ đặt mã mới
    const pin = h('input', { type: 'password', placeholder: saved ? 'Mã PIN giáo viên' : 'Mã PIN mới (4 – 12 kí tự)', maxlength: 12, onkeydown: (e) => { if (e.key === 'Enter') go(); } });
    const go = () => {
      if (!saved) {
        if (pin.value.length < 4) return SBS.toast('Mã PIN cần ít nhất 4 kí tự.', 'warn');
        SBS.store.set('teacherPin', pin.value); unlocked = true; return ok();
      }
      if (pin.value === String(saved)) { unlocked = true; ok(); }
      else { SBS.toast('Mã PIN chưa đúng.', 'warn'); pin.value = ''; }
    };
    wrap.appendChild(h('div', { class: 'card', style: { maxWidth: '440px', margin: '40px auto' } },
      h('h3', null, '🔒 Khu vực giáo viên'),
      h('p', { class: 'muted' }, saved ? 'Nhập mã PIN để xem bảng thống kê. Giáo viên có thể đổi mã ở thẻ “Dữ liệu”.' : 'Lần đầu dùng: hãy đặt mã PIN cho giáo viên. Mã chỉ lưu trên máy này, không có trong mã nguồn.'),
      h('div', { class: 'field' }, pin), h('button', { class: 'btn primary', onclick: go }, saved ? 'Mở bảng thống kê' : 'Đặt mã PIN và mở')));
    setTimeout(() => pin.focus(), 50);
  }

  /* ================= 1. BẢNG THỐNG KÊ ================= */
  function tableTab(body) {
    const battles = SBS.battleList();
    const all = SBS.store.profiles().map(rowOf);
    const classes = [...new Set(all.map((r) => r.cls).filter(Boolean))].sort();
    let fCls = '', q = '', sortK = 'name', dir = 1;
    const kpis = h('div', { class: 'kpis' });
    const tw = h('div', { class: 'tablewrap' });
    const cols = [
      ['name', 'Học sinh'], ['cls', 'Lớp'],
      ...battles.map((b) => ['b:' + b.id, b.short.replace(/\s*\d{4}$/, '').replace('“', '').replace('”', '')]),
      ['bt', 'Tổng sa bàn /180'], ['stars', 'Sao'], ['ms', 'Mốc vững /' + SBS.milestones.length], ['exD', 'Số đề'], ['exAvg', 'Điểm đề TB'], ['exMax', 'Điểm đề cao nhất'], ['topTag', 'Lỗi tư duy nổi bật'], ['last', 'Hoạt động gần nhất'],
    ];
    const val = (r, k) => (k.startsWith('b:') ? r.b[k.slice(2)] : r[k]);
    const filtered = () => all.filter((r) => (!fCls || r.cls === fCls) && (!q || U.fold(r.name).includes(U.fold(q))));
    function draw() {
      const rows = filtered().sort((a, b) => {
        const x = val(a, sortK), y = val(b, sortK);
        if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
        return (typeof x === 'string' ? x.localeCompare(y, 'vi') : x - y) * dir;
      });
      const n = rows.length;
      const avgOf = (k) => { const v = rows.map((r) => val(r, k)).filter((x) => x != null); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };
      const plays = rows.reduce((s, r) => s + r.plays, 0), exN = rows.reduce((s, r) => s + r.exN, 0);
      kpis.innerHTML = '';
      [[n, 'Học sinh'], [plays, 'Lượt chơi sa bàn'], [num(avgOf('bt')), 'Tổng sa bàn TB (/180)'], [exN, 'Lượt luyện đề'], [num(avgOf('exAvg')), 'Điểm luyện đề TB (/10)'], [num(avgOf('ms')), 'Mốc vững TB (/' + SBS.milestones.length + ')']]
        .forEach(([v, t]) => kpis.appendChild(h('div', { class: 'kpi' }, h('b', null, String(v)), h('span', null, t))));
      tw.innerHTML = '';
      if (!all.length) { tw.appendChild(h('p', { style: { padding: '16px' } }, 'Chưa có dữ liệu học sinh. Học sinh học trên máy này sẽ tự xuất hiện; hoặc nhập file kết quả ở thẻ “Dữ liệu”.')); return; }
      const thead = h('tr', null, h('th', { class: 'num' }, 'STT'), cols.map(([k, t]) => h('th', { class: k === 'name' || k === 'topTag' ? '' : 'num', onclick: () => { if (sortK === k) dir = -dir; else { sortK = k; dir = k === 'name' || k === 'cls' ? 1 : -1; } draw(); } }, t + (sortK === k ? (dir > 0 ? ' ▲' : ' ▼') : ''))));
      const tb = h('tbody');
      rows.forEach((r, i) => tb.appendChild(h('tr', { style: { cursor: 'pointer' }, onclick: () => detail(r.p) },
        h('td', { class: 'num' }, i + 1), h('td', null, h('b', null, r.name)), h('td', { class: 'num' }, r.cls || '—'),
        battles.map((b) => h('td', { class: 'num ' + scCls(r.b[b.id], 30) }, r.b[b.id] == null ? '—' : r.b[b.id])),
        h('td', { class: 'num ' + scCls(r.bt, 180) }, r.bt), h('td', { class: 'num' }, '★' + r.stars), h('td', { class: 'num' }, r.ms), h('td', { class: 'num' }, r.exD),
        h('td', { class: 'num ' + scCls(r.exAvg, 10) }, num(r.exAvg)), h('td', { class: 'num ' + scCls(r.exMax, 10) }, num(r.exMax)), h('td', null, r.topTag), h('td', { class: 'num' }, U.fmtDate(r.last)))));
      tb.appendChild(h('tr', { class: 'avg' }, h('td'), h('td', null, 'Trung bình'), h('td'), battles.map((b) => h('td', { class: 'num' }, num(avgOf('b:' + b.id)))), h('td', { class: 'num' }, num(avgOf('bt'))), h('td', { class: 'num' }, num(avgOf('stars'))), h('td', { class: 'num' }, num(avgOf('ms'))), h('td', { class: 'num' }, num(avgOf('exD'))), h('td', { class: 'num' }, num(avgOf('exAvg'))), h('td', { class: 'num' }, num(avgOf('exMax'))), h('td'), h('td')));
      tw.appendChild(h('table', { class: 't' }, h('thead', null, thead), tb));
    }
    const csv = () => {
      const rows = filtered();
      const head = ['STT', 'Học sinh', 'Lớp', ...battles.map((b) => b.short + ' (/30)'), 'Tổng sa bàn (/180)', 'Số sao', 'Mốc vững', 'Số đề đã làm', 'Lượt luyện đề', 'Điểm đề TB', 'Điểm đề cao nhất', 'Lỗi tư duy nổi bật', 'Hoạt động gần nhất'];
      const lines = [head].concat(rows.map((r, i) => [i + 1, r.name, r.cls, ...battles.map((b) => (r.b[b.id] == null ? '' : r.b[b.id])), r.bt, r.stars, r.ms, r.exD, r.exN, r.exAvg == null ? '' : U.round2(r.exAvg), r.exMax == null ? '' : r.exMax, r.topTag, U.fmtDate(r.last)]));
      const text = '﻿' + lines.map((l) => l.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\r\n');
      SBS.download('bang_thong_ke_sa_ban_so.csv', text, 'text/csv;charset=utf-8');
    };
    const clsSel = h('select', { onchange: () => { fCls = clsSel.value; draw(); } }, h('option', { value: '' }, 'Tất cả các lớp'), classes.map((c) => h('option', { value: c }, 'Lớp ' + c)));
    const search = h('input', { placeholder: 'Tìm tên học sinh…', oninput: () => { q = search.value; draw(); } });
    body.append(kpis, h('div', { class: 'toolbar' }, clsSel, search, h('span', { style: { flex: 1 } }),
      h('button', { class: 'btn', onclick: csv }, '⬇ Xuất Excel (CSV)'), h('button', { class: 'btn', onclick: () => window.print() }, '🖨 In bảng')),
      h('p', { class: 'muted', style: { fontSize: '13px' } }, 'Bấm vào tiêu đề cột để sắp xếp; bấm vào một học sinh để xem chi tiết. Điểm mỗi trận là điểm cao nhất (tối đa 30).'), tw);
    draw();
  }

  function detail(p) {
    const S = SBS.store;
    const battles = SBS.battleList();
    const body = h('div', null,
      h('p', { class: 'muted' }, (p.cls ? 'Lớp ' + p.cls + ' · ' : '') + 'Bắt đầu: ' + U.fmtDate(p.created) + ' · Gần nhất: ' + U.fmtDate(p.last)),
      h('div', { class: 'card', style: { margin: '10px 0' } }, h('h3', null, SBS.aiIcon(24), ' AI nhận xét'), h('ul', { class: 'keys' }, SBS.ai.profileReport(p).map((x) => h('li', null, x)))),
      h('div', { class: 'grid g2' },
        h('div', null, h('h3', null, 'Sa bàn – các lần chơi'), battles.map((b) => {
          const r = p.battles[b.id];
          return h('div', { class: 'di', style: { display: 'block', background: 'rgba(255,255,255,.05)', borderRadius: '10px', padding: '8px 11px', margin: '6px 0' } }, h('b', null, b.short), ' ',
            r ? h('span', { class: 'muted' }, r.attempts.map((a) => `${a.score}đ`).join(' → ')) : h('span', { class: 'muted' }, 'chưa chơi'));
        })),
        h('div', null, h('h3', null, 'Lỗi tư duy'), SBS.tagBars(p.tags))),
      h('h3', { style: { marginTop: '14px' } }, 'Luyện đề'),
      p.exams.length ? h('div', { class: 'tablewrap' }, h('table', { class: 't' }, h('thead', null, h('tr', null, ['Thời gian', 'Đề', 'Điểm', 'Phần I', 'Phần II', 'Đúng TN', 'Thời gian làm'].map((x) => h('th', null, x)))),
        h('tbody', null, p.exams.slice().sort((a, b) => b.ts - a.ts).map((e) => h('tr', null, h('td', null, U.fmtDate(e.ts)), h('td', null, 'Đề ' + U.pad2(e.id)), h('td', { class: scCls(e.score, 10) }, e.score), h('td', null, e.p1), h('td', null, e.p2), h('td', null, e.right + '/24'), h('td', null, U.fmtClock(e.secs))))))) : h('p', { class: 'muted' }, 'Chưa làm đề nào.'));
    SBS.modal({ title: p.name, body, wide: true, buttons: [
      { label: 'Xuất hồ sơ', onClick: () => { SBS.download(`ketqua_${SBS.safeName(p.name)}.json`, S.exportProfile(p.id)); return false; } },
      { label: 'Xóa học sinh', cls: 'red', onClick: (close) => { SBS.confirm('Xóa học sinh?', `Xóa toàn bộ dữ liệu của ${p.name} trên máy này?`, 'Xóa').then((ok) => { if (ok) { S.deleteProfile(p.id); close(); SBS.go('teacher/bang'); } }); return false; } },
      { label: 'Đóng', cls: 'primary' },
    ] });
  }

  /* ================= 2. PHÂN TÍCH LỚP ================= */
  function analysisTab(body) {
    const ps = SBS.store.profiles();
    const tags = {};
    ps.forEach((p) => Object.keys(p.tags || {}).forEach((k) => (tags[k] = (tags[k] || 0) + p.tags[k])));
    const topics = {}, qstat = {};
    ps.forEach((p) => (p.exams || []).forEach((e) => {
      Object.keys(e.topics || {}).forEach((k) => { topics[k] = topics[k] || [0, 0]; topics[k][0] += e.topics[k][0]; topics[k][1] += e.topics[k][1]; });
      (e.qs || []).forEach((x) => { qstat[x.id] = qstat[x.id] || [0, 0]; qstat[x.id][0] += x.ok; qstat[x.id][1] += 1; });
    }));
    const qText = (id) => { const m = SBS.questions.MC.find((q) => q.id === id); if (m) return m.q; const t = SBS.questions.TF.find((q) => q.id === id); return t ? 'Đúng/Sai: ' + t.stem + ' ' + t.src.slice(0, 90) + '…' : id; };
    const hard = Object.keys(qstat).filter((k) => qstat[k][1] >= 1).sort((a, b) => qstat[a][0] / qstat[a][1] - qstat[b][0] / qstat[b][1]).slice(0, 10);
    // độ khó từng quyết định
    const dec = [];
    SBS.battleList().forEach((b) => b.steps.filter((s) => s.decision).forEach((s) => {
      let n = 0, tries = 0, first = 0, hints = 0;
      ps.forEach((p) => { const r = p.battles[b.id]; if (!r) return; r.attempts.forEach((a) => { const d = a.ds.find((x) => x.id === s.decision.id); if (d) { n++; tries += d.tries; if (d.tries === 1) first++; if (d.hints || d.h1 || d.h2) hints++; } }); });
      dec.push({ b: b.short, t: s.decision.title, n, avg: n ? tries / n : null, first: n ? first / n : null, hints: n ? hints / n : null });
    }));
    body.append(
      h('div', { class: 'grid g2' },
        h('div', { class: 'card' }, h('h3', null, 'Lỗi tư duy phổ biến của lớp'), h('p', { class: 'muted' }, 'Tổng số lần AI ghi nhận ở các quyết định sai trên sa bàn.'), SBS.tagBars(tags)),
        h('div', { class: 'card' }, h('h3', null, 'Tỉ lệ đúng theo chủ đề (luyện đề)'), Object.keys(topics).length ? Object.keys(topics).sort((a, b) => topics[a][0] / topics[a][1] - topics[b][0] / topics[b][1]).map((k) => {
          const pct = topics[k][0] / topics[k][1];
          return h('div', { class: 'rowbar' }, h('span', null, SBS.topics[k] || k), h('div', { class: 'bar' + (pct < 0.5 ? ' red' : pct < 0.75 ? ' gold' : '') }, h('i', { style: { width: Math.round(pct * 100) + '%' } })), h('span', { class: 'muted' }, Math.round(pct * 100) + '%'));
        }) : h('p', { class: 'muted' }, 'Chưa có dữ liệu luyện đề.'))),
      h('div', { class: 'card', style: { marginTop: '16px' } }, h('h3', null, 'Độ khó các quyết định trên sa bàn'),
        h('div', { class: 'tablewrap' }, h('table', { class: 't' }, h('thead', null, h('tr', null, ['Trận', 'Quyết định', 'Lượt', 'Số lần chọn TB', 'Đúng ngay lần đầu', 'Có dùng gợi ý'].map((x) => h('th', null, x)))),
          h('tbody', null, dec.map((d) => h('tr', null, h('td', null, d.b), h('td', null, d.t), h('td', { class: 'num' }, d.n), h('td', { class: 'num' }, num(d.avg)), h('td', { class: 'num' }, d.first == null ? '—' : Math.round(d.first * 100) + '%'), h('td', { class: 'num' }, d.hints == null ? '—' : Math.round(d.hints * 100) + '%'))))))),
      h('div', { class: 'card', style: { marginTop: '16px' } }, h('h3', null, '10 câu hỏi học sinh làm sai nhiều nhất'),
        hard.length ? h('ol', { class: 'keys' }, hard.map((id) => h('li', null, qText(id), ' ', h('span', { class: 'chip red' }, `đúng ${Math.round((qstat[id][0] / qstat[id][1]) * 100)}% · ${qstat[id][1]} lượt`)))) : h('p', { class: 'muted' }, 'Chưa có dữ liệu luyện đề.')),
    );
  }

  /* ================= 3. KIỂM TRA APP ================= */
  SBS.runChecks = function () {
    const out = [];
    const add = (ok, title, detail) => out.push({ ok, title, detail });
    // đồ họa
    try { const gl = SBS.sb.renderer.getContext(); add(gl ? 'ok' : 'no', 'Đồ họa 3D (WebGL)', `Three.js r${THREE.REVISION}, ${gl && gl.getParameter ? 'đang hoạt động' : 'không có ngữ cảnh'}`); } catch (e) { add('no', 'Đồ họa 3D (WebGL)', String(e)); }
    // trận đánh
    const KNOWN = ['spawn', 'move', 'fly', 'remove', 'arrow', 'ring', 'boom', 'smoke', 'fire', 'tracer', 'shell', 'sam', 'down', 'pulse', 'flag', 'mark', 'para', 'shake', 'clear', 'cam'];
    const bl = SBS.battleList();
    add(bl.length === 6 ? 'ok' : 'no', 'Số chiến dịch trên sa bàn', `${bl.length} trận: ${bl.map((b) => b.short).join(', ')}`);
    bl.forEach((b) => {
      const errs = [];
      const P = b.map.places;
      const ref = (r, where) => { if (typeof r === 'string' && !P[r]) errs.push(`${where}: không có địa danh “${r}”`); };
      const decs = b.steps.filter((s) => s.decision);
      const allIds = new Set(b.steps.flatMap((st) => (st.acts || []).filter((x) => (x.t === 'spawn' || x.t === 'fly') && x.id).map((x) => x.id)));
      if (decs.length !== 3) errs.push(`có ${decs.length} quyết định (cần 3)`);
      if (!SBS.homeIntro) errs.push('thiếu phim mở đầu trang chủ');
      b.steps.forEach((s, i) => {
        if (s.decision) {
          const d = s.decision, ok = d.options.filter((o) => o.ok);
          if (ok.length !== 1) errs.push(`${d.id}: có ${ok.length} phương án đúng`);
          if (d.options.length !== 3) errs.push(`${d.id}: có ${d.options.length} phương án (cần 3)`);
          if (!d.hints || !d.hints.dia || !d.hints.luc || !d.hints.co) errs.push(`${d.id}: thiếu gợi ý 3 bậc (địa hình, lực lượng, thời cơ)`);
          if (!d.threat || !d.threat.length) errs.push(`${d.id}: thiếu mũi tên âm mưu của địch`);
          (d.threat || []).forEach((a) => { (a.path || [a.from, a.to]).forEach((x) => ref(x, d.id + '/threat')); });
          d.options.forEach((o) => { if (!o.short || !o.show || !o.show.length) errs.push(`${d.id}/${o.k}: thiếu nhãn ngắn hoặc mũi tên phương án`); (o.show || []).forEach((a) => { if (a.t === 'ring') ref(a.at, d.id); }); });
          d.options.forEach((o) => { if (!o.ok && !SBS.errorTags[o.tag]) errs.push(`${d.id}/${o.k}: thiếu nhãn lỗi tư duy`); if (!o.ok && !o.why) errs.push(`${d.id}/${o.k}: thiếu phân tích`); if (o.ok && !o.fact) errs.push(`${d.id}: thiếu thực tế lịch sử`); (o.show || []).forEach((a) => { ref(a.from, d.id); ref(a.to, d.id); (a.path || []).forEach((x) => ref(x, d.id)); }); });
          (d.pulse || []).forEach((x) => ref(x, d.id)); if (d.cam && d.cam.at) ref(d.cam.at, d.id);
        } else {
          if (s.cam && s.cam.at) ref(s.cam.at, s.id);
          const ids = allIds; // tên đơn vị (vd. khẩu pháo) cũng dùng được làm điểm bắn
          (s.acts || []).forEach((a) => {
            if (!KNOWN.includes(a.t)) errs.push(`${s.id}: hành động lạ “${a.t}”`);
            ['at', 'from', 'to', 'face'].forEach((k) => { if (k === 'at' && (a.t === 'sam' || a.t === 'down')) return; if (k === 'from' && ids.has(a[k])) return; ref(a[k], s.id); });
            (a.path || []).forEach((x) => ref(x, s.id));
          });
        }
      });
      add(errs.length ? 'no' : 'ok', 'Trận: ' + b.title, errs.length ? errs.join('; ') : `${b.steps.length} bước, 3 quyết định, ${Object.keys(P).length} địa danh – hợp lệ`);
    });
    // mốc sự kiện
    const msBad = SBS.milestones.filter((m) => !m.q || m.q.o.length !== 4 || m.q.a < 0 || m.q.a > 3);
    add(msBad.length ? 'no' : 'ok', 'Mốc sự kiện', `${SBS.milestones.length} mốc, mỗi mốc 1 câu hỏi của AI${msBad.length ? ' – lỗi: ' + msBad.map((m) => m.id).join(', ') : ''}`);
    // ngân hàng câu hỏi
    const Q = SBS.questions;
    const mcBad = Q.MC.filter((q) => q.o.length !== 4 || q.a < 0 || q.a > 3 || new Set(q.o).size !== 4);
    const tfBad = Q.TF.filter((q) => q.items.length !== 4);
    const cnt = (l, lv) => Q.MC.filter((q) => q.l === l && q.lv === lv).length;
    add(mcBad.length || tfBad.length ? 'no' : 'ok', 'Ngân hàng câu hỏi', `${Q.MC.length} câu trắc nghiệm (Chống Pháp: ${cnt('B7', 1)}/${cnt('B7', 2)}/${cnt('B7', 3)}; Chống Mỹ: ${cnt('B8', 1)}/${cnt('B8', 2)}/${cnt('B8', 3)} theo mức NB/TH/VD), ${Q.TF.length} câu Đúng/Sai${mcBad.length ? ' – lỗi: ' + mcBad.map((q) => q.id).join(',') : ''}`);
    // 20 đề
    const exams = SBS.buildExamAll();
    const issues = [];
    const sig = new Set();
    exams.forEach((e) => {
      if (e.mc.length !== 24) issues.push(`Đề ${e.n}: ${e.mc.length} câu TN`);
      if (e.tf.length !== 4) issues.push(`Đề ${e.n}: ${e.tf.length} câu Đ/S`);
      if (new Set(e.mc.map((q) => q.id)).size !== e.mc.length) issues.push(`Đề ${e.n}: trùng câu`);
      if (new Set(e.tf.map((q) => q.id)).size !== e.tf.length) issues.push(`Đề ${e.n}: trùng câu Đ/S`);
      sig.add(e.mc.map((q) => q.id).sort().join() + '|' + e.tf.map((q) => q.id).sort().join());
      const full = SBS.examGrade(e, e.mc.map((q) => q.a), e.tf.map((s) => s.items.map((it) => it.v)));
      if (Math.abs(full.score - 10) > 1e-9) issues.push(`Đề ${e.n}: điểm tối đa ${full.score}`);
    });
    if (sig.size !== exams.length) issues.push(`chỉ có ${sig.size} đề khác nhau`);
    add(issues.length ? 'no' : 'ok', '20 đề luyện thi', issues.length ? issues.join('; ') : '20 đề khác nhau, mỗi đề 24 câu trắc nghiệm + 4 câu Đúng/Sai, làm đúng hết được 10 điểm – hợp lệ');
    // âm thanh
    const A = SBS.audio;
    add(A.music.ctx ? (A.music.ctx.state === 'running' ? 'ok' : 'wn') : 'wn', 'Nhạc nền (WebAudio)', A.music.ctx ? `Trạng thái: ${A.music.ctx.state}; tâm trạng hiện tại: ${A.music.mood}` : 'Chưa khởi động – bấm vào bất kỳ chỗ nào trên app rồi kiểm tra lại');
    add(A.fx && A.music.ctx ? 'ok' : 'wn', 'Tiếng pháo, xe tăng, máy bay', A.fx && A.music.ctx ? `Đã bật, âm lượng ${Math.round((SBS.store.settings.sfx || 0) * 100)}% – khớp theo lời kể từng bước` : 'Chưa khởi động – bấm vào bất kỳ chỗ nào trên app rồi kiểm tra lại');
    const need = [...new Set(SBS.ai.voiceTexts().map((t) => U.hash(U.speakable(t))))];
    const have = need.filter((k) => SBS.VO_INDEX && SBS.VO_INDEX[k]).length;
    add(have === need.length ? 'ok' : have > 0 ? 'wn' : 'no', 'Giọng kể nam (file ghi sẵn)', `${have}/${need.length} đoạn lời kể đã có file giọng đọc${have < need.length ? ' – đoạn thiếu sẽ dùng giọng của trình duyệt' : ''}`);
    const vs = A.narrator.voices();
    add(vs.length ? 'ok' : 'wn', 'Giọng tiếng Việt của trình duyệt (dự phòng)', vs.length ? vs.map((v) => v.name).join('; ') : 'Không có – nên mở app bằng Microsoft Edge');
    add(SBS.store.memoryOnly ? 'no' : 'ok', 'Lưu trữ kết quả', SBS.store.memoryOnly ? 'Trình duyệt chặn bộ nhớ – kết quả sẽ mất khi tắt' : 'Kết quả lưu trong trình duyệt của máy này');
    return out;
  };

  function checkTab(body) {
    const list = h('div');
    const run = () => {
      list.innerHTML = '';
      SBS.runChecks().forEach((c) => list.appendChild(h('div', { class: 'chk' }, h('div', { class: 's ' + c.ok }, c.ok === 'ok' ? '✔' : c.ok === 'wn' ? '!' : '✘'), h('div', null, h('b', null, c.title), h('div', { class: 'muted', style: { fontSize: '13.5px' } }, c.detail)))));
    };
    body.append(h('div', { class: 'card' }, h('h3', null, 'Kiểm tra app'), h('p', { class: 'muted' }, 'Tự động rà soát dữ liệu 6 trận đánh, mốc sự kiện, ngân hàng câu hỏi, 20 đề, âm thanh và giọng đọc.'),
      h('div', { class: 'toolbar' }, h('button', { class: 'btn primary', onclick: run }, '▶ Chạy kiểm tra lại'),
        h('button', { class: 'btn', onclick: () => { SBS.audio.music.unlock(); SBS.audio.narrator.speak('Xin chào các em. Đây là giọng kể của sa bàn số.'); } }, '🔊 Thử giọng kể'),
        h('button', { class: 'btn', onclick: () => { SBS.audio.music.unlock(); SBS.audio.music.setMood('victory'); SBS.toast('Đang phát nhạc nền “chiến thắng”.'); } }, '🎵 Thử nhạc nền')), list));
    run();
  }

  /* ================= 4. ĐỀ & ĐÁP ÁN ================= */
  function keysTab(body) {
    const exams = SBS.buildExamAll();
    body.append(h('div', { class: 'toolbar' }, h('span', { class: 'muted' }, 'Đáp án 20 đề luyện thi (thứ tự đáp án đã được trộn cố định theo từng đề).'), h('span', { style: { flex: 1 } }), h('button', { class: 'btn', onclick: () => window.print() }, '🖨 In đáp án')),
      h('div', { class: 'tablewrap' }, h('table', { class: 't' }, h('thead', null, h('tr', null, ['Đề', 'Phần I (câu 1 – 24)', 'Phần II (a b c d)'].map((x) => h('th', null, x)))),
        h('tbody', null, exams.map((e) => h('tr', null, h('td', null, h('a', { onclick: () => SBS.go('exam/' + e.n), style: { cursor: 'pointer' } }, 'Đề ' + U.pad2(e.n))),
          h('td', { style: { whiteSpace: 'normal', fontFamily: 'Consolas, monospace' } }, e.mc.map((q, i) => `${i + 1}${'ABCD'[q.a]}`).join(' ')),
          h('td', { style: { whiteSpace: 'normal', fontFamily: 'Consolas, monospace' } }, e.tf.map((s, j) => `C${j + 1}: ${s.items.map((it) => (it.v ? 'Đ' : 'S')).join('')}`).join(' · '))))))));
  }

  /* ================= 5. DỮ LIỆU ================= */
  function dataTab(body) {
    const S = SBS.store;
    const file = h('input', { type: 'file', accept: '.json,application/json', multiple: true, onchange: async () => {
      let a = 0, u = 0, bad = 0;
      for (const f of file.files) { try { const r = S.importProfiles(await f.text()); a += r.added; u += r.updated; } catch (e) { bad++; } }
      SBS.toast(`Đã nhập: ${a} học sinh mới, cập nhật ${u}${bad ? `, ${bad} file lỗi` : ''}.`, bad ? 'warn' : 'ok');
      file.value = '';
    } });
    const pin = h('input', { placeholder: 'Mã PIN mới (4 – 12 kí tự)', maxlength: 12 });
    body.append(h('div', { class: 'grid g2' },
      h('div', { class: 'card' }, h('h3', null, '📥 Nhập kết quả học sinh'), h('p', { class: 'muted' }, 'Học sinh học trên máy khác bấm “Nộp kết quả cho giáo viên” ở trang Hồ sơ để tải file .json, rồi gửi cho giáo viên. Chọn một hoặc nhiều file để gộp vào bảng thống kê.'), file),
      h('div', { class: 'card' }, h('h3', null, '📤 Sao lưu toàn bộ'), h('p', { class: 'muted' }, 'Tải về một file chứa dữ liệu của tất cả học sinh trên máy này (có thể nhập lại ở máy khác).'), h('button', { class: 'btn', onclick: () => SBS.download('sao_luu_sa_ban_so.json', S.exportAll()) }, 'Tải file sao lưu')),
      h('div', { class: 'card' }, h('h3', null, '🔑 Đổi mã PIN giáo viên'), h('div', { class: 'field' }, pin), h('button', { class: 'btn', onclick: () => { if (pin.value.length < 4) return SBS.toast('Mã PIN cần ít nhất 4 kí tự.', 'warn'); S.set('teacherPin', pin.value); pin.value = ''; SBS.toast('Đã đổi mã PIN.', 'ok'); } }, 'Lưu mã PIN')),
      h('div', { class: 'card' }, h('h3', null, '🗑 Xóa dữ liệu'), h('p', { class: 'muted' }, 'Xóa toàn bộ hồ sơ và kết quả của học sinh trên máy này (không thể hoàn tác). Nên sao lưu trước.'), h('button', { class: 'btn red', onclick: () => SBS.confirm('Xóa toàn bộ dữ liệu?', 'Mọi hồ sơ học sinh trên máy này sẽ bị xóa.', 'Xóa hết').then((ok) => { if (ok) { S.clearAll(); SBS.refreshTop(); SBS.toast('Đã xóa dữ liệu.'); } }) }, 'Xóa toàn bộ'))));
  }
})();
