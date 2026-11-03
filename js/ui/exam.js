/* Luyện đề: 20 đề đúng cấu trúc thi tốt nghiệp THPT môn Lịch sử (24 câu trắc nghiệm + 4 câu Đúng/Sai, 50 phút, thang 10) */
(function () {
  'use strict';
  const SBS = window.SBS;
  const U = SBS.util;
  const { h } = U;
  const AI = SBS.ai;

  const EXAMS = 20, SECS = 50 * 60;
  const QUOTA = { B7: { 1: 4, 2: 4, 3: 3 }, B8: { 1: 6, 2: 4, 3: 3 } }; // 11 + 13 = 24 câu trắc nghiệm
  const TF_PTS = [0, 0.1, 0.25, 0.5, 1];

  /* ---------- Dựng đề (cố định theo số đề) ---------- */
  const pools = {};
  function pool(key, list, seed) {
    return pools[key] || (pools[key] = U.shuffle(list, U.rng(seed)));
  }
  function take(arr, k, n) {
    const L = arr.length, off = (n - 1) * k, start = (off + Math.floor(off / L)) % L, out = [];
    for (let i = 0; i < k && i < L; i++) out.push(arr[(start + i) % L]);
    return out;
  }
  SBS.buildExam = function (n) {
    const rnd = U.rng(n * 7919 + 13);
    const mc = [];
    ['B7', 'B8'].forEach((l, li) => {
      [1, 2, 3].forEach((lv) => {
        const p = pool(l + lv, SBS.questions.MC.filter((q) => q.l === l && q.lv === lv), li * 31 + lv * 7 + 5);
        take(p, QUOTA[l][lv], n).forEach((q) => mc.push({ q, lv, l }));
      });
    });
    const items = mc.map(({ q }) => {
      const idx = U.shuffle([0, 1, 2, 3], rnd);
      return { id: q.id, l: q.l, t: q.t, lv: q.lv, q: q.q, o: idx.map((i) => q.o[i]), a: idx.indexOf(q.a), w: q.w };
    });
    const tf = [];
    ['B7', 'B8'].forEach((l, li) => {
      const p = pool('tf' + l, SBS.questions.TF.filter((q) => q.l === l), 91 + li);
      const off = (n - 1) * (li ? 5 : 2) + (li ? 0 : Math.floor((n - 1) / 8));
      for (let i = 0; i < 2; i++) tf.push(p[(off + i) % p.length]);
    });
    const tfItems = tf.map((s) => ({ id: s.id, l: s.l, t: s.t, lv: s.lv, src: s.src, stem: s.stem, items: U.shuffle(s.items, rnd) }));
    return { n, mc: items, tf: tfItems };
  };

  function grade(ex, mcAns, tfAns) {
    let p1 = 0, p2 = 0, right = 0, total = 0;
    const topics = {}, qs = [];
    const bump = (t, ok, n) => { topics[t] = topics[t] || [0, 0]; topics[t][0] += ok; topics[t][1] += n; };
    ex.mc.forEach((q, i) => {
      const ok = mcAns[i] === q.a;
      if (ok) { p1 += 0.25; right++; }
      total++;
      bump(q.t, ok ? 1 : 0, 1);
      qs.push({ id: q.id, ok: ok ? 1 : 0 });
    });
    ex.tf.forEach((s, j) => {
      let c = 0;
      s.items.forEach((it, k) => { const a = tfAns[j][k]; if (a === it.v) c++; bump(s.t, a === it.v ? 1 : 0, 1); });
      p2 += TF_PTS[c];
      qs.push({ id: s.id, ok: c / 4 });
    });
    return { p1: U.round2(p1), p2: U.round2(p2), score: U.round2(p1 + p2), right, total, topics, qs };
  }

  /* ---------- Màn hình ---------- */
  let view = null;
  SBS.screens.exam = {
    enter(root, params) {
      if (params[0] && /^\d+$/.test(params[0])) { view = new ExamRun(root, parseInt(params[0], 10)); return; }
      renderList(root);
    },
    leave() { if (view) view.destroy(); view = null; },
  };
  SBS.buildExamAll = () => Array.from({ length: EXAMS }, (_, i) => SBS.buildExam(i + 1));
  SBS.examGrade = grade;

  function renderList(root) {
    const p = SBS.store.current();
    const best = {};
    (p ? p.exams : []).forEach((e) => { best[e.id] = Math.max(best[e.id] || 0, e.score); });
    const done = Object.keys(best).length;
    const avg = p && p.exams.length ? U.round1(p.exams.reduce((s, e) => s + e.score, 0) / p.exams.length) : '—';
    root.appendChild(h('div', { class: 'page' }, h('div', { class: 'wrap' },
      h('div', { class: 'pagehead' }, h('div', null, h('h2', null, 'Luyện đề thi tốt nghiệp THPT – Lịch sử'), h('p', null, 'Nội dung kháng chiến chống Pháp và kháng chiến chống Mỹ, cứu nước. Chấm điểm thang 10.')),
        h('div', { class: 'toolbar' }, h('span', { class: 'chip green' }, `Đã làm ${done}/${EXAMS} đề`), h('span', { class: 'chip gold' }, 'Điểm trung bình: ' + avg))),
      h('div', { class: 'grid g3', style: { marginBottom: '18px' } },
        h('div', { class: 'card' }, h('h3', null, 'Cấu trúc mỗi đề'), h('p', { class: 'muted' }, 'Thời gian 50 phút, tổng 28 câu.'), h('p', null, h('b', null, 'Phần I: '), '24 câu trắc nghiệm nhiều phương án lựa chọn, mỗi câu 0,25 điểm (tối đa 6 điểm).'), h('p', null, h('b', null, 'Phần II: '), '4 câu Đúng/Sai, mỗi câu 4 ý (tối đa 4 điểm).')),
        h('div', { class: 'card' }, h('h3', null, 'Cách chấm Phần II'), h('p', { class: 'muted' }, 'Mỗi câu có 4 ý a, b, c, d.'), h('p', null, 'Đúng 1 ý: 0,1 điểm · Đúng 2 ý: 0,25 điểm'), h('p', null, 'Đúng 3 ý: 0,5 điểm · Đúng 4 ý: 1 điểm')),
        h('div', { class: 'card' }, h('h3', null, 'AI phân tích sau khi nộp'), h('p', null, 'Xem đáp án và giải thích từng câu; AI thống kê điểm mạnh – điểm yếu theo từng chủ đề: bối cảnh, diễn biến, nguyên nhân, ý nghĩa, mốc thời gian…')),
      ),
      h('div', { class: 'examgrid' }, Array.from({ length: EXAMS }, (_, i) => {
        const n = i + 1, b = best[n];
        return h('div', { class: 'examtile' + (b != null ? ' done' : ''), onclick: () => SBS.go('exam/' + n) }, h('b', null, 'Đề số ' + U.pad2(n)), h('div', { class: 'sc' }, b != null ? 'Điểm cao nhất: ' + b : 'Chưa làm'));
      })),
    )));
  }

  /* ---------- Làm bài ---------- */
  class ExamRun {
    constructor(root, n) {
      this.root = root; this.n = Math.min(EXAMS, Math.max(1, n));
      this.ex = SBS.buildExam(this.n);
      this.mcAns = this.ex.mc.map(() => null);
      this.tfAns = this.ex.tf.map((s) => s.items.map(() => null));
      this.marks = new Set();
      this.cur = 0; // 0..23 trắc nghiệm, 24..27 đúng/sai
      this.left = SECS; this.t0 = Date.now(); this.done = false; this.res = null;
      this.total = this.ex.mc.length + this.ex.tf.length;
      this.timer = setInterval(() => this.tick(), 1000);
      this.render();
    }
    destroy() { clearInterval(this.timer); SBS.audio.narrator.stop(); }
    tick() {
      if (this.done) return;
      this.left = Math.max(0, SECS - Math.floor((Date.now() - this.t0) / 1000));
      const t = this.el && this.el.timer;
      if (t) { t.textContent = U.fmtClock(this.left); t.classList.toggle('low', this.left < 300); }
      if (this.left <= 0) this.submit(true);
    }
    isAnswered(i) { return i < this.ex.mc.length ? this.mcAns[i] != null : this.tfAns[i - this.ex.mc.length].every((x) => x != null); }
    partial(i) { return i >= this.ex.mc.length && this.tfAns[i - this.ex.mc.length].some((x) => x != null); }

    render() {
      const el = (this.el = {});
      el.timer = h('div', { class: 'timer' }, U.fmtClock(this.left));
      el.grid = h('div', { class: 'qgrid' });
      el.main = h('div', { class: 'card qcard' });
      this.root.innerHTML = '';
      this.root.appendChild(h('div', { class: 'page' }, h('div', { class: 'wrap' },
        h('div', { class: 'pagehead' }, h('div', null, h('h2', null, 'Đề số ' + U.pad2(this.n)), h('p', null, '24 câu trắc nghiệm + 4 câu Đúng/Sai')), h('button', { class: 'btn ghost', onclick: () => SBS.confirm('Thoát khỏi đề?', 'Bài làm hiện tại sẽ không được lưu.', 'Thoát').then((ok) => ok && SBS.go('exam')) }, '✕ Thoát')),
        h('div', { class: 'exam-layout' },
          h('div', { class: 'card qnav' }, el.timer, h('div', { class: 'muted', style: { textAlign: 'center', fontSize: '12.5px' } }, 'Thời gian còn lại'), el.grid,
            h('div', { class: 'muted', style: { fontSize: '12.5px' } }, 'Xanh: đã làm · Viền cam: đánh dấu'),
            h('button', { class: 'btn primary', style: { width: '100%', marginTop: '12px' }, onclick: () => this.confirmSubmit() }, 'Nộp bài')),
          el.main))));
      this.draw();
    }

    draw() {
      const { el, ex } = this;
      el.grid.innerHTML = '';
      for (let i = 0; i < this.total; i++) {
        const lab = i < ex.mc.length ? i + 1 : 'Đ' + (i - ex.mc.length + 1);
        el.grid.appendChild(h('button', { class: (this.isAnswered(i) ? 'ans ' : this.partial(i) ? 'ans ' : '') + (i === this.cur ? 'cur ' : '') + (this.marks.has(i) ? 'mark' : ''), onclick: () => { this.cur = i; this.draw(); } }, lab));
      }
      el.main.innerHTML = '';
      const i = this.cur;
      if (i < ex.mc.length) {
        const q = ex.mc[i];
        el.main.append(h('div', { class: 'qno' }, `Phần I · Câu ${i + 1}/${ex.mc.length}`), h('div', { class: 'stem' }, q.q),
          h('div', { class: 'opts' }, q.o.map((t, k) => h('div', { class: 'opt' + (this.mcAns[i] === k ? ' sel' : ''), onclick: () => { this.mcAns[i] = k; this.draw(); } }, h('div', { class: 'k' }, 'ABCD'[k]), h('div', null, t)))));
      } else {
        const j = i - ex.mc.length, s = ex.tf[j];
        el.main.append(h('div', { class: 'qno' }, `Phần II · Câu ${j + 1}/${ex.tf.length} (Đúng/Sai)`), h('div', { class: 'stem' }, s.stem), h('div', { class: 'src' }, s.src),
          ...s.items.map((it, k) => h('div', { class: 'tfrow' }, h('div', { class: 'tx' }, h('b', null, 'abcd'[k] + ') '), it.s),
            h('div', { class: 'tfb' }, h('button', { class: this.tfAns[j][k] === true ? 'sel' : '', onclick: () => { this.tfAns[j][k] = true; this.draw(); } }, 'Đúng'), h('button', { class: this.tfAns[j][k] === false ? 'sel' : '', onclick: () => { this.tfAns[j][k] = false; this.draw(); } }, 'Sai')))));
      }
      el.main.append(h('div', { class: 'toolbar', style: { justifyContent: 'space-between', marginTop: '16px' } },
        h('button', { class: 'btn', disabled: i === 0 || null, onclick: () => { this.cur--; this.draw(); } }, '◀ Câu trước'),
        h('button', { class: 'btn ghost', onclick: () => { this.marks.has(i) ? this.marks.delete(i) : this.marks.add(i); this.draw(); } }, this.marks.has(i) ? '⚑ Bỏ đánh dấu' : '⚐ Đánh dấu xem lại'),
        h('button', { class: 'btn primary', onclick: () => { if (i < this.total - 1) { this.cur++; this.draw(); } else this.confirmSubmit(); } }, i < this.total - 1 ? 'Câu sau ▶' : 'Nộp bài')));
    }

    confirmSubmit() {
      const left = []; for (let i = 0; i < this.total; i++) if (!this.isAnswered(i)) left.push(i);
      SBS.confirm('Nộp bài?', left.length ? `Em còn ${left.length} câu chưa làm xong. Vẫn nộp bài chứ?` : 'Em đã làm hết các câu. Nộp bài để xem điểm nhé?', 'Nộp bài').then((ok) => ok && this.submit(false));
    }

    submit(auto) {
      if (this.done) return;
      this.done = true; clearInterval(this.timer);
      const g = grade(this.ex, this.mcAns, this.tfAns);
      const secs = Math.min(SECS, Math.floor((Date.now() - this.t0) / 1000));
      this.res = { id: this.n, ts: Date.now(), secs, score: g.score, p1: g.p1, p2: g.p2, right: g.right, total: g.total, topics: g.topics, qs: g.qs };
      SBS.store.addExam(this.res);
      SBS.audio.sfx('star');
      if (auto) SBS.toast('Hết giờ! Bài làm đã được nộp tự động.', 'warn');
      this.renderResult();
    }

    renderResult() {
      const r = this.res, ex = this.ex, rep = AI.examReport(r);
      SBS.audio.music.setMood(r.score >= 6.5 ? 'victory' : 'study');
      let only = false;
      const review = h('div');
      const drawReview = () => {
        review.innerHTML = '';
        ex.mc.forEach((q, i) => {
          const ok = this.mcAns[i] === q.a;
          if (only && ok) return;
          review.appendChild(h('div', { class: 'card', style: { marginBottom: '12px' } },
            h('div', { class: 'qno', style: { color: ok ? 'var(--green)' : '#ff7b85', fontWeight: 800 } }, `Câu ${i + 1} · ${ok ? '✔ Đúng' : '✘ Sai'} · ${SBS.topics[q.t]}`), h('div', { class: 'stem', style: { fontSize: '16px' } }, q.q),
            h('div', { class: 'opts' }, q.o.map((t, k) => h('div', { class: 'opt' + (k === q.a ? ' good' : this.mcAns[i] === k ? ' bad' : '') }, h('div', { class: 'k' }, 'ABCD'[k]), h('div', null, t)))),
            h('div', { class: 'expl' }, h('b', null, 'Giải thích: '), q.w, this.mcAns[i] == null ? ' (Em chưa chọn đáp án.)' : '')));
        });
        ex.tf.forEach((s, j) => {
          const c = s.items.filter((it, k) => this.tfAns[j][k] === it.v).length;
          if (only && c === 4) return;
          review.appendChild(h('div', { class: 'card', style: { marginBottom: '12px' } },
            h('div', { class: 'qno', style: { color: c === 4 ? 'var(--green)' : 'var(--amber)', fontWeight: 800 } }, `Phần II · Câu ${j + 1} · đúng ${c}/4 ý → ${TF_PTS[c]} điểm`), h('div', { class: 'src' }, s.src),
            s.items.map((it, k) => {
              const a = this.tfAns[j][k], okk = a === it.v;
              return h('div', { class: 'tfrow' }, h('div', { class: 'tx' }, h('b', null, 'abcd'[k] + ') '), it.s, h('div', { class: 'muted', style: { fontSize: '13.5px', marginTop: '4px' } }, (okk ? '✔ ' : '✘ ') + 'Đáp án: ' + (it.v ? 'Đúng' : 'Sai') + '. ' + it.w)),
                h('div', { class: 'tfb' }, h('button', { class: it.v ? 'right' : '' }, 'Đúng'), h('button', { class: !it.v ? 'right' : (a === false ? 'wrongsel' : '') }, 'Sai')));
            })));
        });
      };
      drawReview();
      const bars = rep.rows.map((x) => h('div', { class: 'rowbar' }, h('span', null, x.name), h('div', { class: 'bar' + (x.pct < 0.5 ? ' red' : x.pct < 0.75 ? ' gold' : '') }, h('i', { style: { width: Math.round(x.pct * 100) + '%' } })), h('span', { class: 'muted' }, `${x.r}/${x.n}`)));
      this.root.innerHTML = '';
      this.root.appendChild(h('div', { class: 'page' }, h('div', { class: 'wrap' },
        h('div', { class: 'pagehead' }, h('div', null, h('h2', null, `Kết quả · Đề số ${U.pad2(this.n)}`), h('p', null, `Thời gian làm bài: ${U.fmtClock(r.secs)}`)),
          h('div', { class: 'toolbar' }, h('button', { class: 'btn', onclick: () => SBS.go('exam') }, 'Danh sách đề'), h('button', { class: 'btn primary', onclick: () => { SBS.go('exam'); setTimeout(() => SBS.go('exam/' + this.n), 0); } }, '🔁 Làm lại đề này'))),
        h('div', { class: 'result-top' },
          h('div', { class: 'card bigscore' }, h('div', { class: 'muted' }, 'Điểm của em'), h('div', { class: 'n' }, r.score.toFixed(2).replace('.', ',')), h('div', { class: 'chip gold' }, AI.classify(r.score)),
            h('p', { style: { marginTop: '12px' } }, `Phần I: ${r.p1.toFixed(2).replace('.', ',')}/6 · Phần II: ${r.p2.toFixed(2).replace('.', ',')}/4`), h('p', { class: 'muted' }, `Đúng ${r.right}/24 câu trắc nghiệm`)),
          h('div', { class: 'card' }, h('h3', null, SBS.aiIcon(24), ' AI phân tích điểm mạnh – điểm yếu'), bars, h('ul', { class: 'keys' }, rep.advice.map((a) => h('li', null, a))))),
        h('div', { class: 'toolbar', style: { marginTop: '20px' } }, h('h3', { style: { margin: 0, flex: 1 } }, 'Đáp án và giải thích'), h('label', { class: 'muted' }, h('input', { type: 'checkbox', onchange: (e) => { only = e.target.checked; drawReview(); } }), ' Chỉ hiện câu em làm sai')),
        review)));
    }
  }
})();
