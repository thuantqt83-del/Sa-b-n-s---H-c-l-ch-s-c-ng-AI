/* Hồ sơ của học sinh: tiến bộ, lỗi tư duy, AI nhận xét, nộp kết quả cho giáo viên */
(function () {
  'use strict';
  const SBS = window.SBS;
  const U = SBS.util;
  const { h } = U;

  SBS.download = function (name, text, type) {
    const blob = new Blob([text], { type: type || 'application/json;charset=utf-8' });
    const a = h('a', { href: URL.createObjectURL(blob), download: name });
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
  SBS.safeName = (s) => U.fold(s).replace(/\s+/g, '_') || 'hocsinh';

  SBS.tagBars = function (tags) {
    const keys = Object.keys(tags || {}).sort((a, b) => tags[b] - tags[a]);
    if (!keys.length) return h('p', { class: 'muted' }, 'Chưa có dữ liệu.');
    const max = tags[keys[0]];
    return h('div', null, keys.map((k) => {
      const t = SBS.ai.tag(k);
      return h('div', { class: 'hbar' }, h('span', null, t.icon + ' ' + t.name), h('div', { class: 'bar' }, h('i', { style: { width: Math.round((tags[k] / max) * 100) + '%', background: t.color } })), h('b', null, tags[k]));
    }));
  };

  SBS.screens.profile = {
    enter(root) {
      const S = SBS.store, p = S.current();
      const page = h('div', { class: 'page' }), wrap = h('div', { class: 'wrap' });
      page.appendChild(wrap); root.appendChild(page);
      if (!p) {
        wrap.appendChild(h('div', { class: 'card' }, h('h3', null, 'Chưa có hồ sơ'), h('button', { class: 'btn primary', onclick: () => { SBS.ensureProfile(); SBS.go('profile'); } }, 'Tạo hồ sơ')));
        return;
      }
      const battles = SBS.battleList();
      const L = SBS.milestones;
      const ms = L.filter((m) => S.msGet(m.id).mastered).length;
      const exams = p.exams.slice().sort((a, b) => b.ts - a.ts);
      const avg = exams.length ? U.round2(exams.reduce((s, e) => s + e.score, 0) / exams.length) : null;
      const total = battles.reduce((s, b) => s + ((p.battles[b.id] && p.battles[b.id].best && p.battles[b.id].best.score) || 0), 0);
      wrap.append(
        h('div', { class: 'pagehead' }, h('div', null, h('h2', null, 'Hồ sơ của ' + p.name), h('p', null, (p.cls ? 'Lớp ' + p.cls + ' · ' : '') + 'Bắt đầu học: ' + U.fmtDate(p.created))),
          h('div', { class: 'toolbar' },
            h('button', { class: 'btn', onclick: () => SBS.openLogin() }, '✏️ Tên & hồ sơ (không bắt buộc)'),
            h('button', { class: 'btn primary', onclick: () => { SBS.download(`ketqua_${SBS.safeName(p.name)}_${p.cls || ''}.json`, S.exportProfile()); SBS.toast('Đã tải file kết quả. Em gửi file này cho giáo viên nhé!', 'ok'); } }, '📤 Nộp kết quả cho giáo viên'))),
        h('div', { class: 'kpis' },
          h('div', { class: 'kpi' }, h('b', null, `${total}/180`), h('span', null, 'Tổng điểm sa bàn (6 trận)')),
          h('div', { class: 'kpi' }, h('b', null, `${ms}/${L.length}`), h('span', null, 'Mốc sự kiện đã vững')),
          h('div', { class: 'kpi' }, h('b', null, `${new Set(p.exams.map((e) => e.id)).size}/20`), h('span', null, 'Đề đã luyện')),
          h('div', { class: 'kpi' }, h('b', null, avg == null ? '—' : String(avg).replace('.', ',')), h('span', null, 'Điểm luyện đề trung bình'))),
        h('div', { class: 'grid g2' },
          h('div', { class: 'card' }, h('h3', null, SBS.aiIcon(24), ' AI nhận xét tổng hợp'), h('ul', { class: 'keys' }, SBS.ai.profileReport(p).map((x) => h('li', null, x)))),
          h('div', { class: 'card' }, h('h3', null, 'Lỗi tư duy AI ghi nhận'), SBS.tagBars(p.tags))),
        h('h3', { style: { margin: '22px 0 10px' } }, 'Sa bàn'),
        h('div', { class: 'grid g3' }, battles.map((b) => {
          const r = p.battles[b.id];
          return h('div', { class: 'card', style: { cursor: 'pointer' }, onclick: () => SBS.go('battle/' + b.id) }, h('b', null, b.short),
            h('div', { class: 'muted', style: { fontSize: '13px' } }, r ? `${r.attempts.length} lần chơi · cao nhất ${r.best.score}/30` : 'Chưa chơi'),
            h('div', { class: 'bar gold', style: { marginTop: '8px' } }, h('i', { style: { width: (r ? (r.best.score / 30) * 100 : 0) + '%' } })));
        })),
        h('h3', { style: { margin: '22px 0 10px' } }, 'Lịch sử luyện đề'),
        exams.length ? h('div', { class: 'tablewrap' }, h('table', { class: 't' }, h('thead', null, h('tr', null, ['Thời gian', 'Đề', 'Điểm', 'Phần I', 'Phần II', 'Thời gian làm'].map((x) => h('th', null, x)))),
          h('tbody', null, exams.map((e) => h('tr', null, h('td', null, U.fmtDate(e.ts)), h('td', null, 'Đề ' + U.pad2(e.id)), h('td', { class: e.score >= 8 ? 'sc-good' : e.score >= 5 ? 'sc-mid' : 'sc-low' }, String(e.score).replace('.', ',')), h('td', null, e.p1), h('td', null, e.p2), h('td', null, U.fmtClock(e.secs))))))) : h('p', { class: 'muted' }, 'Em chưa làm đề nào.'),
      );
    },
  };
})();
