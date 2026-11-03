/* Học cùng AI qua các mốc sự kiện: dòng thời gian, kể chuyện, AI hỏi nhanh, trò chơi sắp xếp mốc, tra cứu */
(function () {
  'use strict';
  const SBS = window.SBS;
  const U = SBS.util;
  const { h } = U;
  const A = SBS.audio;

  SBS.screens.milestones = {
    enter(root, params) {
      const L = SBS.milestones;
      const S = SBS.store;
      let sel = params[0] ? L.findIndex((m) => m.id === params[0]) : -1;
      if (sel < 0) sel = Math.max(0, L.findIndex((m) => !S.msGet(m.id).mastered));
      let tab = 'learn';

      const page = h('div', { class: 'page' });
      const wrap = h('div', { class: 'wrap' });
      page.appendChild(wrap);
      root.appendChild(page);

      const mastered = () => L.filter((m) => S.msGet(m.id).mastered).length;

      function draw() {
        wrap.innerHTML = '';
        const answers = h('div');
        const input = h('input', { placeholder: 'Hỏi AI: ví dụ “Vì sao chiến dịch Điện Biên Phủ quan trọng?”', onkeydown: (e) => { if (e.key === 'Enter') ask(); } });
        const ask = () => {
          const res = SBS.ai.ask(input.value);
          answers.innerHTML = '';
          if (!res.length) { answers.appendChild(h('div', { class: 'bubble' }, h('div', { class: 'av' }, SBS.aiIcon(34)), h('div', { class: 'tx' }, h('b', { class: 'who' }, 'Tham mưu AI'), 'AI chưa tìm thấy nội dung phù hợp. Em thử hỏi bằng từ khóa như “Việt Bắc”, “Mậu Thân”, “Hiệp định Pa-ri”…'))); return; }
          res.forEach((r) => answers.appendChild(h('div', { class: 'bubble' }, h('div', { class: 'av' }, SBS.aiIcon(34)), h('div', { class: 'tx' }, h('b', { class: 'who' }, 'AI tìm thấy: ' + r.title), r.text.length > 330 ? r.text.slice(0, 330) + '…' : r.text,
            h('div', { style: { marginTop: '6px' } }, r.kind === 'moc' ? h('button', { class: 'btn small', onclick: () => { sel = L.findIndex((m) => m.id === r.id); tab = 'learn'; draw(); } }, 'Mở mốc này') : h('button', { class: 'btn small', onclick: () => SBS.go('battle/' + r.id) }, 'Vào sa bàn trận này'))))));
        };
        wrap.append(
          h('div', { class: 'pagehead' }, h('div', null, h('h2', null, 'Học cùng AI qua các mốc sự kiện'), h('p', null, 'Từ 1945 đến 1975 — nghe kể, trả lời câu hỏi của AI, rồi thử sắp xếp mốc thời gian.')), h('span', { class: 'chip green' }, `Đã vững ${mastered()}/${L.length} mốc`)),
          h('div', { class: 'tabs' }, [['learn', '📅 Học theo mốc'], ['sort', '🔀 Sắp xếp mốc thời gian'], ['ask', '💬 Hỏi AI']].map(([k, t]) => h('button', { class: tab === k ? 'on' : '', onclick: () => { tab = k; A.narrator.stop(); draw(); } }, t))),
        );
        if (tab === 'learn') wrap.appendChild(learn());
        else if (tab === 'sort') wrap.appendChild(sorter());
        else wrap.appendChild(h('div', { class: 'card' }, h('h3', null, 'Tra cứu thông minh'), h('p', { class: 'muted' }, 'Gõ câu hỏi hoặc từ khóa, AI tìm trong các mốc sự kiện và trận đánh em đã học.'), h('div', { class: 'askbox' }, input, h('button', { class: 'btn primary', onclick: ask }, 'Hỏi')), answers));
      }

      /* ---------- Học theo mốc ---------- */
      function learn() {
        const eras = [['phap', 'Kháng chiến chống thực dân Pháp (1945 – 1954)'], ['my', 'Kháng chiến chống Mỹ, cứu nước (1954 – 1975)']];
        const tl = h('div', { class: 'tl' }, eras.map(([e, t]) => h('div', null, h('h4', null, t), L.map((m, i) => ({ m, i })).filter((x) => x.m.era === e).map(({ m, i }) => {
          const st = S.msGet(m.id);
          return h('div', { class: 'tli' + (i === sel ? ' on' : ''), id: 'tli' + i, onclick: () => { sel = i; draw(); } }, h('div', { class: 'dot' + (st.mastered ? ' mastered' : st.seen ? ' seen' : '') }), h('div', null, h('small', null, m.date), h('span', null, m.title)));
        }))));
        const m = L[sel];
        S.msSeen(m.id);
        const st = S.msGet(m.id);
        const quiz = h('div', { class: 'quiz' });
        const fb = h('div');
        let answered = false;
        const order = U.shuffle(m.q.o.map((t, i) => ({ t, i })), U.rng(sel * 13 + 5 + st.right + st.wrong));
        quiz.append(h('div', { class: 'bubble' }, h('div', { class: 'av' }, SBS.aiIcon(34)), h('div', { class: 'tx' }, h('b', { class: 'who' }, 'AI hỏi nhanh'), m.q.q)));
        const opts = h('div', { class: 'opts' });
        order.forEach((o, k) => {
          const el = h('div', { class: 'opt', onclick: () => {
            if (answered) return;
            const ok = o.i === m.q.a;
            if (ok) answered = true;
            S.msAnswer(m.id, ok);
            el.classList.add(ok ? 'good' : 'bad');
            if (!ok) el.style.pointerEvents = 'none';
            A.sfx(ok ? 'ok' : 'bad');
            fb.innerHTML = '';
            fb.appendChild(h('div', { class: 'analysis' + (ok ? ' ok' : '') }, h('h4', null, ok ? '✔ Chính xác!' : '✘ Chưa đúng, em thử lại nhé'), h('div', { class: 'row' }, ok ? m.q.why : 'AI gợi ý: hãy đọc lại phần tóm tắt và ý nghĩa của mốc này, rồi chọn lại.')));
            if (ok) { const d = document.querySelector('#tli' + sel + ' .dot'); if (d) d.className = 'dot mastered'; }
          } }, h('div', { class: 'k' }, 'ABCD'[k]), h('div', null, o.t));
          opts.appendChild(el);
        });
        quiz.append(opts, fb);
        const slide = h('div', { class: 'card slide' },
          h('div', { class: 'toolbar', style: { justifyContent: 'space-between', margin: 0 } }, h('span', { class: 'chip ' + (m.era === 'phap' ? 'blue' : 'red') }, m.era === 'phap' ? 'Chống Pháp' : 'Chống Mỹ'), h('span', { class: 'chip' }, SBS.topics[m.topic] || '')),
          h('div', { class: 'bigdate' }, m.date), h('h2', null, m.title),
          h('div', { class: 'blk' }, h('h4', null, 'Nội dung chính'), m.summary),
          m.meaning ? h('div', { class: 'blk' }, h('h4', null, 'Ý nghĩa – kết quả'), m.meaning) : null,
          h('div', { class: 'toolbar' },
            h('button', { class: 'btn', onclick: () => { A.music.unlock(); A.narrator.speak(m.story); } }, '🔊 Nghe kể'),
            h('button', { class: 'btn ghost', onclick: () => A.narrator.stop() }, '⏹ Dừng'),
            m.battle ? h('button', { class: 'btn primary', onclick: () => SBS.go('battle/' + m.battle) }, '🗺️ Vào sa bàn trận này') : null),
          quiz,
          );
        setTimeout(() => { const t = document.querySelector('#tli' + sel); if (t && t.scrollIntoView) t.scrollIntoView({ block: 'nearest' }); }, 30);
        return h('div', { class: 'ms-layout' }, tl, slide);
      }

      /* ---------- Sắp xếp mốc ---------- */
      function sorter() {
        const rnd = U.rng(Date.now() & 0xfffffff);
        const pick = [];
        const pool = U.shuffle(L, rnd);
        for (const m of pool) { if (pick.length >= 5) break; if (!pick.some((p) => Math.abs(p.k - m.k) < 8000)) pick.push(m); }
        const order = []; // chỉ số được chọn theo thứ tự
        let checked = false;
        const box = h('div');
        const result = h('div');
        const correct = pick.slice().sort((a, b) => a.k - b.k);
        const render = () => {
          box.innerHTML = '';
          const list = h('div', { class: 'sortlist' });
          pick.forEach((m, i) => {
            const pos = order.indexOf(i);
            const cls = 'sortitem' + (pos >= 0 ? ' picked' : '') + (checked ? (correct.indexOf(m) === pos ? ' right' : ' wrong') : '');
            list.appendChild(h('div', { class: cls, onclick: () => { if (checked) return; if (pos >= 0) order.splice(pos, 1); else order.push(i); A.sfx('click'); render(); } }, h('div', { class: 'n' }, pos >= 0 ? pos + 1 : '·'), h('div', null, m.title, checked ? h('div', { class: 'muted', style: { fontSize: '13px' } }, m.date) : null)));
          });
          box.appendChild(list);
          box.appendChild(h('div', { class: 'toolbar' },
            h('button', { class: 'btn primary', disabled: checked || order.length < pick.length || null, onclick: check }, 'Kiểm tra'),
            h('button', { class: 'btn', onclick: () => { tab = 'sort'; draw(); } }, '🔀 Ván mới'),
            h('span', { class: 'muted' }, 'Bấm lần lượt các sự kiện từ SỚM nhất đến MUỘN nhất.')));
        };
        const check = () => {
          checked = true;
          const right = order.filter((idx, pos) => correct.indexOf(pick[idx]) === pos).length;
          render();
          A.sfx(right === pick.length ? 'star' : 'bad');
          result.innerHTML = '';
          result.appendChild(h('div', { class: 'analysis' + (right === pick.length ? ' ok' : '') },
            h('h4', null, right === pick.length ? '✔ Tuyệt vời! Em sắp xếp đúng cả 5 mốc.' : `Em đúng ${right}/5 vị trí`),
            h('div', { class: 'row' }, h('b', null, 'Thứ tự đúng: ')), h('ol', { class: 'keys' }, correct.map((m) => h('li', null, `${m.date} – ${m.title}`)))));
        };
        render();
        return h('div', { class: 'card' }, h('h3', null, 'Sắp xếp các mốc theo thứ tự thời gian'), box, result);
      }
      SBS.deck.hook = {
        next: () => { if (tab === 'learn' && sel < L.length - 1) { sel++; A.narrator.stop(); draw(); return true; } return false; },
        prev: () => { if (tab === 'learn' && sel > 0) { sel--; A.narrator.stop(); draw(); return true; } return false; },
      };
      draw();
    },
    leave() { A.narrator.stop(); },
  };
})();
