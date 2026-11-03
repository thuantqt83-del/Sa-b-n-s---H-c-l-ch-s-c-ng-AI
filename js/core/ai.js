/* AI tham mưu: gợi ý, chấm quyết định, chẩn đoán lỗi tư duy, báo cáo, tra cứu.
   Nội dung phân tích được biên soạn sẵn – chạy ngay trên máy, không cần mạng. */
(function () {
  'use strict';
  const SBS = window.SBS;
  const U = SBS.util;

  SBS.topics = {
    boicanh: 'Bối cảnh lịch sử',
    dienbien: 'Diễn biến, kết quả',
    moc: 'Mốc thời gian – sự kiện',
    duongloi: 'Đường lối, chủ trương của Đảng',
    nguyennhan: 'Nguyên nhân thắng lợi',
    ynghia: 'Ý nghĩa lịch sử',
    vandung: 'Vận dụng, liên hệ',
  };

  const tagOf = (id) => SBS.errorTags[id] || { name: 'Lỗi khác', icon: '❓', color: '#64748b', tip: 'Hãy đọc lại bối cảnh và mục tiêu của trận đánh.' };

  const AI = {
    tag: tagOf,
    name: 'Tham mưu AI',
    HEADS: [
      'Xuất sắc! Em ra quyết định như một vị tướng thực thụ.',
      'Khá tốt! Em nắm được phần lớn diễn biến, còn vài chỗ cần vững hơn.',
      'Em đã hoàn thành trận đánh. Hãy xem lại các điểm yếu dưới đây rồi thử lại để đạt điểm cao hơn.',
    ],

    /* ----- Lời nói ----- */
    /* ba bậc gợi ý của AI (không đưa đáp án) */
    TIERS: [
      { k: 'dia', name: 'Địa hình', icon: '⛰️' },
      { k: 'luc', name: 'Tương quan lực lượng', icon: '⚖️' },
      { k: 'co', name: 'Thời cơ', icon: '⏳' },
    ],
    briefSpeech: (b) => { const r = b.brief; return `Âm mưu của địch. ${r.plot} Tương quan lực lượng. Lực lượng ta: ${r.ta.join('; ')}. Lực lượng địch: ${r.dich.join('; ')}. ${r.ratio}`; },
    winSpeech: (b) => `Yếu tố thắng lợi của ta. ${b.brief.win.join(' ')}`,
    optionSpeech: (o) => o.text, // đọc nội dung phương án khi học sinh bấm chọn
    letterSpeech: (i) => `Phương án ${'ABC'[i]}.`,
    decisionSpeech: (d) => `${d.situation} Em hãy đưa ra quyết định.`,
    hintSpeech: (d, i) => `${AI.TIERS[i].name}. ${d.hints[AI.TIERS[i].k]}`,
    analysisSpeech(opt) {
      const t = tagOf(opt.tag);
      return `Chưa đúng. Lỗi tư duy: ${t.name}. ${opt.why} Cách nghĩ đúng: ${t.tip}`;
    },
    correctSpeech: (opt) => `Chính xác. ${opt.fact}`,

    /* ----- Điểm ----- */
    scoreDecision(tries, hints) {
      const wrong = Math.max(0, tries - 1);
      return Math.max(2, 10 - wrong * 3 - (hints || 0));
    },
    starsFor: (total) => (total >= 26 ? 3 : total >= 18 ? 2 : 1),

    /* ----- Phân tích lỗi trong một lần chọn sai (kèm nhận diện "thói quen") ----- */
    pattern(opt, profile, resultSoFar) {
      const t = tagOf(opt.tag);
      const prior = (profile && profile.tags && profile.tags[opt.tag]) || 0;
      const here = (resultSoFar || []).filter((x) => x === opt.tag).length;
      if (here >= 2) return `Trong trận này em đã ${here} lần mắc lỗi “${t.name}”. AI ghi nhận đây đang là thói quen tư duy cần chỉnh.`;
      if (prior >= 2) return `Lỗi “${t.name}” đã xuất hiện ${prior} lần trong hồ sơ của em ở các trận trước. Hãy đọc kĩ phần “Cách nghĩ đúng” bên dưới nhé.`;
      return '';
    },

    /* ----- Báo cáo cuối trận ----- */
    battleReport(battle, res) {
      const tags = {};
      res.ds.forEach((d) => d.tags.forEach((t) => (tags[t] = (tags[t] || 0) + 1)));
      const total = res.score;
      const head = total >= 26 ? AI.HEADS[0] : total >= 18 ? AI.HEADS[1] : AI.HEADS[2];
      const strengths = res.ds.filter((d) => d.tries === 1 && !d.hints).map((d) => d.title);
      const weak = Object.keys(tags).sort((a, b) => tags[b] - tags[a]).map((t) => ({ id: t, n: tags[t], ...tagOf(t) }));
      const hints = res.ds.reduce((s, d) => s + (d.hints || 0), 0);
      const advice = [];
      if (weak.length) advice.push(`Lỗi hay gặp nhất: “${weak[0].name}”. ${weak[0].tip}`);
      if (hints >= 4) advice.push('Em dùng khá nhiều gợi ý. Lần sau hãy thử tự phân tích địa hình – tương quan lực lượng – thời cơ trước, rồi mới xin AI tham mưu.');
      if (!weak.length && !hints) advice.push('Em không sai quyết định nào và không cần gợi ý. Hãy thử thách mình ở trận tiếp theo!');
      advice.push(`Ôn lại trận “${battle.short}” để nhớ chắc diễn biến và ý nghĩa.`);
      return { head, strengths, weak, advice };
    },

    /* ----- Báo cáo tổng hợp hồ sơ ----- */
    profileReport(p) {
      const tags = Object.keys(p.tags || {}).sort((a, b) => p.tags[b] - p.tags[a]);
      const lines = [];
      if (tags.length) {
        const t = tagOf(tags[0]);
        lines.push(`Kiểu lỗi tư duy em hay gặp nhất là “${t.name}” (${p.tags[tags[0]]} lần). ${t.tip}`);
        if (tags[1]) lines.push(`Kiểu lỗi đứng thứ hai: “${tagOf(tags[1]).name}” (${p.tags[tags[1]]} lần).`);
      } else lines.push('Chưa có dữ liệu lỗi tư duy – hãy chơi vài trận sa bàn để AI phân tích.');
      const topics = AI.topicStats(p);
      const weak = Object.keys(topics).filter((k) => topics[k][1] >= 3).sort((a, b) => topics[a][0] / topics[a][1] - topics[b][0] / topics[b][1]);
      if (weak.length) lines.push(`Trong luyện đề, phần em cần củng cố nhất: “${SBS.topics[weak[0]] || weak[0]}” (đúng ${Math.round((topics[weak[0]][0] / topics[weak[0]][1]) * 100)}%).`);
      return lines;
    },
    topicStats(p) {
      const out = {};
      (p.exams || []).forEach((e) => Object.keys(e.topics || {}).forEach((k) => {
        out[k] = out[k] || [0, 0];
        out[k][0] += e.topics[k][0]; out[k][1] += e.topics[k][1];
      }));
      return out;
    },
    examReport(res) {
      const t = res.topics || {};
      const rows = Object.keys(t).map((k) => ({ k, name: SBS.topics[k] || k, r: t[k][0], n: t[k][1], pct: t[k][1] ? t[k][0] / t[k][1] : 0 })).sort((a, b) => a.pct - b.pct);
      const advice = [];
      const weak = rows.filter((x) => x.n >= 2 && x.pct < 0.6);
      if (weak.length) advice.push(`Cần ôn lại: ${weak.slice(0, 3).map((x) => x.name).join('; ')}. Hãy vào mục “Học theo mốc sự kiện” hoặc chơi lại sa bàn tương ứng.`);
      if (res.score >= 8) advice.push('Kết quả rất tốt! Hãy thử sức với đề khó hơn và chú ý các câu vận dụng.');
      else if (res.score >= 5) advice.push('Em đã đạt mức trung bình khá. Hãy xem lại phần giải thích các câu sai, nhất là câu Đúng/Sai (cần đúng cả 4 ý mới được điểm tối đa).');
      else advice.push('Em nên học lại diễn biến chính của hai cuộc kháng chiến theo từng mốc thời gian, rồi làm lại đề.');
      return { rows, advice };
    },
    classify: (s) => (s >= 8 ? 'Giỏi' : s >= 6.5 ? 'Khá' : s >= 5 ? 'Trung bình' : 'Cần cố gắng'),

    /* ----- Tra cứu thông minh (không cần mạng) ----- */
    _kb: null,
    _buildKB() {
      const kb = [];
      (SBS.milestones || []).forEach((m) => kb.push({ kind: 'moc', id: m.id, title: `${m.date} – ${m.title}`, text: `${m.summary} ${m.meaning || ''}`, key: U.fold(`${m.title} ${m.summary} ${m.meaning || ''} ${(m.kw || []).join(' ')}`) }));
      SBS.battles.forEach((b) => kb.push({ kind: 'tran', id: b.id, title: b.title, text: `${b.brief.context} ${b.keys.join(' ')}`, key: U.fold(`${b.title} ${b.brief.context} ${b.keys.join(' ')} ${b.place}`) }));
      this._kb = kb;
    },
    ask(q) {
      if (!this._kb) this._buildKB();
      const stop = new Set(['la', 'cua', 'va', 'the', 'nao', 'gi', 'nhu', 'trong', 'cho', 'co', 'khong', 'mot', 'cac', 'nhung', 'duoc', 'em', 'hay', 'vi', 'sao', 'o', 'ra', 'bai', 'khi']);
      const toks = U.fold(q).split(' ').filter((t) => t.length > 1 && !stop.has(t));
      if (!toks.length) return [];
      return this._kb
        .map((e) => {
          let s = 0;
          toks.forEach((t) => { if (e.key.includes(' ' + t) || e.key.startsWith(t)) s += 2; else if (e.key.includes(t)) s += 1; });
          for (let i = 0; i < toks.length - 1; i++) if (e.key.includes(toks[i] + ' ' + toks[i + 1])) s += 4;
          if (U.fold(e.title).includes(toks.join(' '))) s += 6;
          return { e, s };
        })
        .filter((x) => x.s > 1)
        .sort((a, b) => b.s - a.s)
        .slice(0, 3)
        .map((x) => x.e);
    },

    /* ----- Danh sách lời cần thu giọng (dùng cho công cụ dựng giọng đọc) ----- */
    voiceTexts() {
      const out = [];
      SBS.battles.forEach((b) => {
        out.push(AI.briefSpeech(b), AI.winSpeech(b));
        [0, 1, 2].forEach((i) => out.push(AI.letterSpeech(i)));
        b.steps.forEach((s) => {
          if (!s.decision) { out.push(s.text); return; }
          const d = s.decision;
          out.push(AI.decisionSpeech(d), AI.hintSpeech(d, 0), AI.hintSpeech(d, 1), AI.hintSpeech(d, 2));
          d.options.forEach((o) => out.push(AI.optionSpeech(o), o.ok ? AI.correctSpeech(o) : AI.analysisSpeech(o)));
        });
      });
      (SBS.milestones || []).forEach((m) => out.push(m.story));
      AI.HEADS.forEach((x) => out.push(x));
      if (SBS.homeIntro) out.push(SBS.homeIntro.text);
      return out.filter(Boolean);
    },
  };

  SBS.ai = AI;
})();
