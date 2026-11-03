/* Màn hình một chiến dịch: bối cảnh → diễn biến (giọng kể + mũi tên) → 3 quyết định (3 phương án ngay trên sa bàn,
   AI gợi ý 3 bậc: địa hình – tương quan lực lượng – thời cơ) → tổng kết */
(function () {
  'use strict';
  const SBS = window.SBS;
  const U = SBS.util;
  const { h, $ } = U;
  const A = SBS.audio;
  const AI = SBS.ai;
  let view = null;

  SBS.screens.battle = {
    enter(root, params) {
      const b = SBS.battleById(params[0]);
      if (!b) { SBS.go('home'); return; }
      view = new BattleView(root, b);
    },
    leave() { if (view) view.destroy(); view = null; },
  };

  class BattleView {
    constructor(root, b) {
      this.root = root; this.b = b; this.steps = b.steps;
      this.sb = SBS.sb; this.idx = -1; this.mode = 'brief'; this.playMode = 'command';
      this.ds = []; this.solved = {}; this.orders = {}; this.visited = new Set(); this.dec = null;
      this.timers = []; this.dead = false; this.tok = 0; this.labelsOn = true; this.advOpen = true;
      this.nDec = this.steps.filter((s) => s.decision).length;
      this.build();
      this.showBrief();
    }

    destroy() {
      this.dead = true;
      this.timers.forEach(clearTimeout); clearInterval(this.subTimer);
      A.narrator.stop();
      const sb = this.sb;
      sb.autoRotate = 0; sb.followOn = false; sb.focusOrd = null; sb.onArrowClick = null;
      sb.layer.style.display = '';
      sb.resetActors();
    }
    later(fn, ms) { const t = setTimeout(() => { if (!this.dead) fn(); }, ms); this.timers.push(t); }
    speak(text) { return A.narrator.speak(text); }
    btn(label, cls, fn) { return h('button', { class: 'btn ' + (cls || ''), onclick: fn }, label); }
    spk(text) { return h('button', { class: 'spk', title: 'Nghe', onclick: () => { A.music.unlock(); this.speak(text); } }, '🔊'); }

    /* ---------- Khung giao diện ---------- */
    build() {
      const el = (this.el = {});
      el.title = h('h3', null, this.b.title);
      el.body = h('div', { class: 'side-body' });
      el.foot = h('div', { class: 'side-foot' });
      el.side = h('div', { class: 'side' }, h('div', { class: 'side-head' }, el.title), el.body, el.foot);
      this.root.append(el.side);
      el.score = h('div', { class: 'hudscore' }, h('b', null, '0'), h('small', null, 'điểm /30'));
      el.tl = h('div', { class: 'timeline' });
      el.tools = h('div', { class: 'stage-tools' },
        h('button', { class: 'btn small', onclick: () => this.sb.overview() }, '🎥 Toàn cảnh'),
        h('button', { class: 'btn small', onclick: () => { this.labelsOn = !this.labelsOn; this.sb.layer.style.display = this.labelsOn ? '' : 'none'; } }, '🏷 Nhãn'));
      $('#stage-ui').append(h('div', { class: 'legend mini' }, h('span', null, h('i', { class: 'b' }), 'Âm mưu của địch'), h('span', null, h('i', { class: 'r' }), 'Hướng đánh của ta')), el.score, el.tools); // chú thích mũi tên nhỏ ở mép trái trong sa bàn
      // dưới sa bàn: chú thích mũi tên (bên trái) và thanh tiến độ
      this.root.append(h('div', { class: 'stagebar' }, el.tl));
      SBS.setCrumb(`<b>${U.esc(this.b.short)}</b> · ${U.esc(this.b.date)}`);
      this.sb.onArrowClick = (rec) => this.onArrow(rec);
      SBS.deck.hook = { next: () => this.deckNext(), prev: () => this.deckPrev() };
    }

    /* thanh các cảnh dưới sa bàn + trạng thái ở thanh dưới */
    chrome() {
      const n = this.steps.length, total = n + 2, pos = this.idx + 1; // 0 = mở đầu, n+1 = kết quả
      const tl = this.el.tl; tl.innerHTML = '';
      const nodes = [{ i: -1, lab: 'Mở đầu', t: '★' }];
      let sceneNo = 0, decNo = 0;
      this.steps.forEach((s, i) => nodes.push(s.decision ? { i, dec: true, lab: 'QĐ' + ++decNo, t: String(decNo) } : { i, lab: String(i + 1), t: String(++sceneNo) }));
      nodes.push({ i: n, lab: 'Kết quả', t: '🏁' });
      nodes.forEach((nd) => {
        const cur = nd.i === this.idx, done = nd.i < this.idx, ok = this.playMode === 'watch' || this.visited.has(nd.i) || nd.i === -1 || cur;
        tl.appendChild(h('button', { class: 'tn' + (nd.dec ? ' dec' : '') + (cur ? ' cur' : '') + (done ? ' done' : ''), disabled: ok ? null : true, title: nd.lab, onclick: () => this.jump(nd.i) }, h('span', { class: 'nd' }, h('span', null, nd.t)), h('span', null, nd.dec ? nd.lab : nd.i === -1 || nd.i === n ? nd.lab : '')));
      });
      tl.style.setProperty('--pg', Math.max(0, (pos / (total - 1)) * 100) + '%');
      // thanh dưới
      const dots = h('span', { class: 'sdots' }, nodes.map((nd) => h('i', { class: (nd.dec ? 'dec ' : '') + (nd.i < this.idx ? 'done ' : '') + (nd.i === this.idx ? 'cur' : '') })));
      const di = this.steps.slice(0, Math.max(0, this.idx + 1)).filter((s) => s.decision).length;
      SBS.deck.setStatus([h('span', null, `Bước ${pos + 1}/${total}`), dots, h('span', null, `Quyết định ${Math.min(this.nDec, this.mode === 'decision' ? di : this.mode === 'summary' ? this.nDec : di)}/${this.nDec}`), h('span', { class: 'muted' }, 'Bấm ▶ hoặc phím → để đi tiếp, ◀ để quay lại')]);
      this.el.score.firstChild.textContent = this.ds.reduce((s, x) => s + x.pts, 0);
    }
    jump(i) {
      if (i === -1) return this.showBrief();
      if (i >= this.steps.length) return this.showSummary();
      if (this.playMode === 'watch' || this.visited.has(i)) this.go(i);
    }

    /* ---------- Điều khiển ◀ ▶ ---------- */
    deckNext() {
      if (this.mode === 'brief') { this.start('command'); return true; }
      if (this.mode === 'summary') return false;
      if (this.mode === 'decision' && !(this.dec && this.dec.solved)) { SBS.toast('Em hãy chọn một phương án rồi bấm “Chốt hướng đánh”.', 'warn'); return true; }
      this.next(); return true;
    }
    deckPrev() {
      if (this.mode === 'brief') return false;
      if (this.mode === 'summary') { this.go(this.steps.length - 1); return true; }
      if (this.idx <= 0) { this.showBrief(); return true; }
      this.go(this.idx - 1); return true;
    }
    onArrow(rec) {
      const sb = this.sb;
      if (rec.opt) { this.select(rec.opt); sb.focusArrow(rec); return; }
      if (this.mode === 'step') { sb.focusArrow(rec); this.go(this.idx, { focusOrd: rec.ord }); return; }
      sb.focusArrow(rec);
    }

    /* ---------- Bối cảnh ---------- */
    showBrief() {
      this.mode = 'brief'; this.idx = -1; this.tok++;
      A.narrator.stop(); clearInterval(this.subTimer);
      const b = this.b, sb = this.sb, br = b.brief;
      if (sb.map !== b.map) sb.load(b.map); else sb.resetActors();
      sb.setCam(b.map.cam || { x: 0, z: 0, d: 112, yaw: 0, pitch: 55 }, true);
      this.camNow = b.map.cam;
      A.music.setMood('brief');
      const body = this.el.body; body.innerHTML = '';
      const sec = (cls, title, ...kids) => h('div', { class: 'bsec ' + cls }, h('h4', null, title), ...kids);
      body.append(
        h('span', { class: 'chip gold step-date' }, b.date + ' · ' + b.place),
        sec('plot', '🔵 Âm mưu của địch', h('p', null, br.plot)),
        sec('tq', '⚖️ Tương quan lực lượng',
          h('div', { class: 'forces' },
            h('div', { class: 'ta' }, h('h4', null, 'Lực lượng ta'), h('ul', null, br.ta.map((x) => h('li', null, x)))),
            h('div', { class: 'dich' }, h('h4', null, 'Lực lượng địch'), h('ul', null, br.dich.map((x) => h('li', null, x))))),
          h('p', { class: 'ratio' }, br.ratio)),
        h('div', { class: 'tipline' }, `Trận này có ${this.nDec} quyết định. Mỗi quyết định có 3 phương án hiện ngay trên sa bàn; AI gợi ý theo 3 bậc: địa hình, tương quan lực lượng, thời cơ.`));
      this.foot(this.btn('👁 Xem diễn biến', '', () => this.start('watch')), this.btn('🔊', 'ghost small', () => this.speak(AI.briefSpeech(b))), this.btn('Bắt đầu ▶', 'primary', () => this.start('command')));
      this.chrome();
      this.speak(AI.briefSpeech(b));
    }
    foot(...btns) { this.el.foot.innerHTML = ''; btns.flat().filter(Boolean).forEach((x) => this.el.foot.appendChild(x)); }

    start(mode) {
      this.playMode = mode; this.ds = []; this.solved = {}; this.orders = {}; this.visited = new Set();
      this.go(0);
    }

    /* ---------- Chuyển bước ---------- */
    go(i, opt) {
      A.narrator.stop(); clearInterval(this.subTimer);
      this.timers.forEach(clearTimeout); this.timers = [];
      const tok = ++this.tok;
      if (i >= this.steps.length) return this.showSummary();
      this.idx = i; this.visited.add(i);
      const s = this.steps[i];
      this.sb.seek(this.steps, i);
      if (s.decision) { if (this.playMode === 'watch') this.showWatchDecision(s.decision); else this.showDecision(s.decision); }
      else this.showStep(s, tok, opt || {});
      this.chrome();
    }
    next() { this.go(this.idx + 1); }

    /* ---------- Diễn biến (mũi tên khớp với lời kể) ---------- */
    showStep(s, tok, opt) {
      this.mode = 'step';
      A.music.setMood(s.mood || (this.idx === 0 ? 'brief' : 'battle'));
      this.camNow = s.cam;
      A.sfx('step');
      const sens = s.text.match(/[^.!?]+[.!?]?/g).map((x) => x.trim()).filter(Boolean);
      const spans = sens.map((x) => h('span', { class: 'sen' }, x + ' '));
      const body = this.el.body; body.innerHTML = '';
      body.append(h('span', { class: 'chip gold step-date' }, s.date || ''), h('div', { class: 'step-title' }, s.title), h('div', { class: 'narr' }, spans),
        h('div', { class: 'tipline' }, '➤ Bấm vào một mũi tên trên sa bàn để xem lại cảnh, camera sẽ xoay và phóng to theo mũi tên đó.'));
      const nextStep = this.steps[this.idx + 1];
      this.foot(this.btn('🔁 Xem lại', 'ghost small', () => this.go(this.idx)), this.btn('🔊', 'ghost small', () => this.speak(s.text)),
        this.btn(!nextStep ? 'Kết quả ▶' : nextStep.decision ? 'Đến quyết định ▶' : 'Tiếp tục ▶', 'primary', () => this.next()));
      A.narrator.prepare(s.text).then((dur) => {
        if (this.dead || tok !== this.tok) return;
        this.sb.runStep(s, false, { text: s.text, dur, focusOrd: opt.focusOrd });
        const tot = sens.reduce((a, x) => a + x.length, 0);
        this.subTimer = setInterval(() => {
          const pr = A.narrator.progress();
          if (pr == null) return;
          let acc = 0, idx = sens.length - 1;
          for (let k = 0; k < sens.length; k++) { acc += sens[k].length; if (pr * tot <= acc) { idx = k; break; } }
          spans.forEach((sp, k) => sp.classList.toggle('now', k === idx));
        }, 200);
        this.speak(s.text).then((ok) => {
          clearInterval(this.subTimer); spans.forEach((sp) => sp.classList.remove('now'));
          if (ok && this.playMode === 'watch' && tok === this.tok) this.later(() => this.next(), 1600);
        });
      });
    }

    /* ---------- Chế độ xem: đọc quyết định đúng ---------- */
    showWatchDecision(d) {
      this.mode = 'step';
      A.music.setMood('decision');
      const sb = this.sb, ok = d.options.find((o) => o.ok);
      sb.setCam(d.cam); this.camNow = d.cam; sb.highlight(d.pulse || []);
      sb.threat(d.threat);
      sb.optionArrows([{ k: ok.k, letter: '✔', short: ok.short, acts: ok.show }]);
      sb.selectOption(ok.k);
      const body = this.el.body; body.innerHTML = '';
      body.append(h('span', { class: 'chip gold step-date' }, 'Quyết định của ta'), h('div', { class: 'step-title' }, d.title), h('div', { class: 'sit' }, d.situation),
        h('div', { class: 'analysis ok' }, h('h4', null, '✔ Quyết định đã chọn'), h('div', { class: 'row' }, ok.text), h('div', { class: 'row' }, h('b', null, 'Thực tế lịch sử: '), ok.fact)));
      this.foot(this.btn('Tiếp tục ▶', 'primary', () => this.next()));
      const tok = this.tok;
      this.speak(AI.decisionSpeech(d)).then((a) => { if (!a || this.dead || tok !== this.tok) return; return this.speak(AI.correctSpeech(ok)); }).then((a) => { if (a && this.playMode === 'watch' && tok === this.tok) this.later(() => this.next(), 1500); });
    }

    /* ---------- Quyết định: 3 phương án trên sa bàn + cố vấn AI 3 bậc ---------- */
    showDecision(d) {
      this.mode = 'decision';
      A.music.setMood('decision');
      const sb = this.sb, tok = this.tok;
      sb.setCam(d.cam); this.camNow = d.cam;
      sb.highlight(d.pulse || []);
      (d.pulse || []).slice(0, 2).forEach((k) => sb.pulse({ at: k, color: 0xffd23f, r: 7 }));
      if (!this.orders[d.id]) this.orders[d.id] = U.shuffle(d.options, U.rng((Date.now() & 0xffffff) + this.idx));
      const order = this.orders[d.id];
      const done = this.solved[d.id];
      this.dec = { d, order, tries: done ? done.tries : 0, hints: done ? done.hints : 0, tiers: done ? (done.tiers || [0, 1, 2].map((i) => i < done.hints)) : [false, false, false], wrong: [], sel: null, fb: null, solved: !!done, tags: done ? done.tags : [], opened: false };
      this.decNo = this.steps.slice(0, this.idx + 1).filter((s) => s.decision).length;
      if (done) {
        const ok = d.options.find((o) => o.ok);
        this.dec.sel = ok.k;
        this.dec.fb = this.feedbackOk(ok, done.pts, true);
      }
      this.renderDec();
      const text = AI.decisionSpeech(d);
      A.narrator.prepare(text).then((dur) => {
        if (this.dead || tok !== this.tok) return;
        sb.threat(d.threat, { text, dur });
        this.later(() => this.drawOptions(), done ? 0 : 900);
        if (!done && !this.dec.sel) this.speak(text); // học sinh đã chọn rồi thì không đọc lời dẫn đè lên
      });
      if (done) this.later(() => this.drawOptions(), 300);
    }

    drawOptions() {
      const D = this.dec; if (!D || D.opened) return;
      D.opened = true;
      const list = D.order.map((o, i) => ({ k: o.k, letter: 'ABC'[i], short: o.short, acts: o.show }));
      this.sb.optionArrows(list, (k) => this.select(k));
      D.wrong.forEach((k) => this.sb.markOption(k, 'bad'));
      if (D.solved) this.sb.keepOnly(D.d.options.find((o) => o.ok).k), this.sb.markOption(D.d.options.find((o) => o.ok).k, 'good');
      else if (D.sel) this.sb.selectOption(D.sel);
    }
    select(k) {
      const D = this.dec; if (!D || D.solved || D.wrong.includes(k)) return;
      this.drawOptions();
      D.sel = k; this.sb.selectOption(k); A.sfx('click');
      this.renderDec();
      const o = D.d.options.find((x) => x.k === k), li = D.order.findIndex((x) => x.k === k);
      if (o) this.speak(AI.letterSpeech(li)).then((done) => { if (done && !this.dead && this.dec === D && D.sel === k) this.speak(AI.optionSpeech(o)); }); // đọc "Phương án A." rồi nội dung phương án vừa chọn
    }

    /* phần đầu bảng của cố vấn AI: biểu tượng AI 3D, tiêu đề, nút Nghe */
    aipHead(title, text, pts) {
      return h('div', { class: 'aip-head' }, SBS.aiIcon(42), h('div', { class: 'aip-title' }, title, pts != null ? h('span', { class: 'pts' }, '+' + pts + ' điểm') : null),
        h('button', { class: 'aip-listen', title: 'Nghe', onclick: () => { A.music.unlock(); this.speak(text); } }, h('span', null, '🔊'), h('span', null, 'Nghe')));
    }
    feedbackOk(o, pts, review) {
      const D = this.dec, tagName = (x) => AI.tag(x.tag).name, plain = (t) => String(t || '').replace(/[?？]\s*$/, '');
      return h('div', { class: 'aipanel ok' },
        this.aipHead(review ? 'Cố vấn AI: em đã làm đúng' : 'Cố vấn AI nhận xét lựa chọn của em', AI.correctSpeech(o), pts),
        h('div', { class: 'aip-card hist' }, h('div', { class: 'aip-h' }, '📜 Lịch sử đã chọn: ' + plain(o.short)), h('p', null, o.fact)),
        h('div', { class: 'aip-cmp-title' }, 'So sánh các hướng đánh:'),
        D.order.map((x, i) => h('div', { class: 'aip-cmp' }, h('div', { class: 'mk ' + (x.ok ? 'ok' : 'no') }, x.ok ? '✔' : '✘'),
          h('div', null, h('b', null, 'ABC'[i] + '. ' + plain(x.short)), ' ', h('span', { class: 'nt' }, x.ok ? '— hợp với địa hình, lực lượng, thời cơ' : '— lỗi tư duy: ' + tagName(x) + (D.wrong.includes(x.k) ? ' (em đã chọn)' : ''))))));
    }

    renderDec() {
      const D = this.dec, d = D.d, body = this.el.body, prev = body.scrollTop, S = SBS.store;
      body.innerHTML = '';
      const advOn = S.settings.advisor !== false;
      body.append(
        h('div', { class: 'dec-head' }, h('div', { class: 'dec-num' }, this.decNo), h('div', null, h('div', { class: 'muted', style: { fontSize: '12px' } }, `QUYẾT ĐỊNH ${this.decNo}/${this.nDec}`), h('div', { class: 'step-title', style: { margin: 0, fontSize: '19px' } }, d.title))),
        h('div', { class: 'sit' }, d.situation, h('span', { class: 'spk-wrap' }, ' ', this.spk(AI.decisionSpeech(d)))),
        h('div', { class: 'askbanner' }, h('div', null, h('b', null, 'Em hãy đưa ra quyết định'), h('span', null, d.ask + ' Chọn một trong 3 phương án A, B, C trên sa bàn.'))));
      const list = h('div', { class: 'optlist' });
      D.order.forEach((o, i) => {
        const bad = D.wrong.includes(o.k);
        const cls = 'opt' + (D.sel === o.k && !D.solved ? ' sel' : '') + (bad ? ' bad' : '') + (D.solved && o.ok ? ' good' : '');
        list.appendChild(h('div', { class: cls, onclick: () => this.select(o.k) }, h('div', { class: 'k' }, bad ? '✘' : D.solved && o.ok ? '✔' : 'ABC'[i]), h('div', null, o.text)));
      });
      body.appendChild(list);
      if (D.fb) body.appendChild(D.fb);
      if (!D.solved) body.appendChild(this.advisor(advOn));
      body.scrollTop = prev;
      if (D.solved) this.foot(h('span', { class: 'pts' }, '+' + (this.solved[d.id] ? this.solved[d.id].pts : 0) + ' điểm'), this.btn(this.idx + 1 >= this.steps.length ? 'Kết quả ▶' : 'Tiếp tục ▶', 'primary', () => this.next()));
      else this.foot(this.btn('🔊', 'ghost small', () => this.speak(AI.decisionSpeech(d))), this.btn(D.wrong.length ? 'Chốt lại ▶' : 'Chốt hướng đánh ▶', 'primary' + (D.sel ? '' : ' disabled'), () => D.sel && this.submit()));
      this.chrome();
    }

    /* cố vấn AI: 3 bậc gợi ý, có nút tắt/mở và lên/xuống */
    advisor(on) {
      const D = this.dec, d = D.d, S = SBS.store;
      const box = h('div', { class: 'advisor' + (on ? '' : ' off') });
      const sw = h('button', { class: 'sw' + (on ? ' on' : ''), title: on ? 'Tắt cố vấn AI' : 'Mở cố vấn AI', onclick: () => { S.set('advisor', !on); if (on) A.narrator.stop(); this.renderDec(); } });
      const chev = h('button', { class: 'rbtn', title: this.advOpen ? 'Thu gọn' : 'Mở rộng', onclick: () => { this.advOpen = !this.advOpen; this.renderDec(); } }, this.advOpen ? '▲' : '▼');
      box.appendChild(h('div', { class: 'adv-head' }, h('div', { class: 'av' }, SBS.aiIcon(34)), h('div', { class: 'tt' }, h('b', null, 'Tham mưu AI · gợi ý 3 bậc'), h('small', null, on ? `Bấm bậc để xem · −1 điểm/gợi ý` : 'Đang tắt – em tự quyết định')), sw, on ? chev : null));
      if (on && this.advOpen) {
        const bodyEl = h('div', { class: 'adv-body' });
        bodyEl.appendChild(h('div', { class: 'adv-chips' }, AI.TIERS.map((t, i) => h('button', { class: 'adv-chip ' + t.k + (D.tiers[i] ? ' open' : ''), title: D.tiers[i] ? 'Nghe lại gợi ý này' : 'Bấm để xem gợi ý này (trừ 1 điểm)', onclick: () => this.askHint(i) }, t.icon + ' ' + ({ dia: 'Địa hình', luc: 'Lực lượng', co: 'Thời cơ' }[t.k] || t.name)))));
        AI.TIERS.forEach((t, i) => {
          if (D.tiers[i]) bodyEl.appendChild(h('div', { class: 'tier ' + t.k }, h('div', { class: 'ti' }, t.icon), h('div', null, h('b', null, t.name + ': '), d.hints[t.k]), this.spk(AI.hintSpeech(d, i))));
        });
        box.appendChild(bodyEl);
      }
      return box;
    }
    askHint(i) {
      const D = this.dec;
      if (i == null) i = D.tiers.indexOf(false);
      if (i < 0) return;
      if (D.tiers[i]) { A.music.unlock(); this.speak(AI.hintSpeech(D.d, i)); return; } // đã mở: chỉ đọc lại, không trừ điểm
      D.tiers[i] = true; D.hints++;
      A.sfx('step');
      this.renderDec();
      this.speak(AI.hintSpeech(D.d, i));
    }

    submit() {
      const D = this.dec, d = D.d, o = d.options.find((x) => x.k === D.sel);
      if (!o) return;
      D.tries++;
      const sb = this.sb, focus = (d.pulse || [])[0];
      if (o.ok) {
        const pts = AI.scoreDecision(D.tries, D.hints);
        D.solved = true;
        const rec = { id: d.id, title: d.title, tries: D.tries, hints: D.hints, tiers: D.tiers.slice(), h1: D.hints > 0, h2: D.hints > 1, tags: D.tags.slice(), pts };
        this.ds.push(rec); this.solved[d.id] = rec;
        sb.keepOnly(o.k); sb.markOption(o.k, 'good'); sb.okFx(focus); A.sfx('ok');
        D.fb = this.feedbackOk(o, pts, false);
        this.speak(AI.correctSpeech(o));
      } else {
        const t = AI.tag(o.tag);
        D.wrong.push(o.k); D.tags.push(o.tag); D.sel = null;
        sb.markOption(o.k, 'bad'); sb.selectOption(null); sb.failFx(focus); A.sfx('bad');
        const note = AI.pattern(o, SBS.store.current(), this.ds.flatMap((x) => x.tags).concat(D.tags));
        D.fb = h('div', { class: 'aipanel' },
          this.aipHead('Cố vấn AI phân tích lựa chọn của em', AI.analysisSpeech(o)),
          h('div', { class: 'aip-card lure' }, h('div', { class: 'aip-h' }, '🤔 Điểm hấp dẫn của lựa chọn'), h('p', null, o.lure || t.lure || 'Lựa chọn này nghe có vẻ hợp lí.')),
          h('div', { class: 'aip-card err' }, h('div', { class: 'aip-h' }, '⚠️ Lỗi tư duy: ' + t.name), h('p', null, o.why), h('p', { class: 'aip-tip' }, 'Cách nghĩ đúng: ' + t.tip)),
          note ? h('div', { class: 'aip-note' }, '📌 ' + note) : null,
          h('div', { class: 'aip-foot' }, 'Em hãy chọn lại phương án khác (mỗi lần sai trừ 3 điểm).'));
        this.speak(AI.analysisSpeech(o));
      }
      this.renderDec();
    }

    /* ---------- Tổng kết ---------- */
    showSummary() {
      this.mode = 'summary'; this.idx = this.steps.length; this.tok++;
      A.narrator.stop(); clearInterval(this.subTimer);
      const b = this.b, sb = this.sb;
      const body = this.el.body; body.innerHTML = '';
      sb.seek(this.steps, this.steps.length);
      sb.setCam(b.map.cam || { d: 112, pitch: 55 });
      if (this.playMode === 'watch') {
        A.music.setMood('victory');
        body.append(h('div', { class: 'step-title' }, 'Em vừa xem lại toàn bộ diễn biến'), h('p', { class: 'muted' }, 'Giờ hãy tự đưa ra quyết định ở từng bước để AI chấm điểm và phân tích tư duy.'),
            h('div', { class: 'step-title', style: { fontSize: '17px' } }, 'Ghi nhớ'), h('ul', { class: 'keys' }, b.keys.map((k) => h('li', null, k))));
        this.foot(this.btn('Bắt đầu ▶', 'primary', () => this.start('command')));
        this.chrome();
        return;
      }
      const total = this.ds.reduce((s, x) => s + x.pts, 0), stars = AI.starsFor(total);
      const res = { ts: Date.now(), score: total, stars, ds: this.ds };
      SBS.store.addBattle(b.id, res);
      SBS.deck.render(); SBS.deck.mark();
      const rep = AI.battleReport(b, res);
      A.music.setMood(stars >= 2 ? 'victory' : 'study');
      A.sfx('star');
      body.append(
        h('div', { class: 'sum-big' }, h('div', { class: 'score' }, total + '/30'), h('div', { class: 'stars' }, [1, 2, 3].map((i) => h('span', { class: i <= stars ? 'on' : '', style: { color: i <= stars ? 'var(--gold)' : '#b3bfd6' } }, '★'))), h('div', { class: 'muted' }, 'Kết quả ' + b.short)),
        h('div', { class: 'bubble' }, h('div', { class: 'av' }, SBS.aiIcon(34)), h('div', { class: 'tx' }, h('b', { class: 'who' }, 'Tham mưu AI nhận xét'), rep.head)),
        h('div', { class: 'bsec win' }, h('h4', null, '🏆 Yếu tố thắng lợi của ta'), h('ul', null, b.brief.win.map((x) => h('li', null, x)))),
        h('div', { class: 'dlist' }, this.ds.map((d) => h('div', { class: 'di' }, h('span', { class: d.tries === 1 ? 'chip green' : 'chip red' }, d.tries === 1 ? 'Đúng ngay' : d.tries + ' lần chọn'), h('span', { style: { flex: 1 } }, d.title), h('span', { class: 'pts' }, d.pts)))),
        rep.weak.length ? h('div', null, h('div', { class: 'step-title', style: { fontSize: '16px' } }, 'Lỗi tư duy AI ghi nhận'), h('div', { class: 'dlist' }, rep.weak.map((w) => h('div', { class: 'di' }, h('span', { class: 'tagbadge', style: { border: '1px solid ' + w.color } }, w.icon + ' ' + w.name), h('span', { class: 'muted' }, '× ' + w.n))))) : h('p', { class: 'muted' }, '✔ Không có lỗi tư duy nào trong trận này.'),
        h('div', { class: 'step-title', style: { fontSize: '16px' } }, 'Lời khuyên của AI'), h('ul', { class: 'keys' }, rep.advice.map((a) => h('li', null, a))),
        h('div', { class: 'step-title', style: { fontSize: '16px' } }, 'Ghi nhớ'), h('ul', { class: 'keys' }, b.keys.map((k) => h('li', null, k))),
      );
      const list = SBS.battleList(), i = list.findIndex((x) => x.id === b.id), nextB = list[i + 1];
      this.foot(this.btn('🔁 Chơi lại', '', () => this.start('command')), nextB ? this.btn('Chiến dịch tiếp ▶', 'primary', () => SBS.go('battle/' + nextB.id)) : this.btn('Học cùng AI ▶', 'primary', () => SBS.go('milestones')));
      this.chrome();
      this.speak(rep.head).then((ok) => { if (ok && !this.dead && this.mode === 'summary') this.speak(AI.winSpeech(b)); });
    }
  }
})();
