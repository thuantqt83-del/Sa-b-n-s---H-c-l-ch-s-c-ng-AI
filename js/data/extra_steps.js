/* Các cảnh diễn biến bổ sung: trước mỗi quyết định có thêm một cảnh nữa (máy bay, quân nhảy dù, pháo, xe tăng chuyển động).
   Hoạt cảnh tự khớp với lời kể: tiếng pháo, bom, máy bay… vang lên đúng lúc giọng kể nhắc tới. */
(function () {
  'use strict';
  const SBS = window.SBS;
  const put = (battleId, beforeDecision, step) => {
    const b = SBS.battles.find((x) => x.id === battleId);
    if (!b) return;
    const i = b.steps.findIndex((s) => s.decision && s.decision.id === beforeDecision);
    if (i >= 0) b.steps.splice(i, 0, Object.assign({ mood: 'battle' }, step));
  };

  /* ================= Việt Bắc 1947 ================= */
  put('vietbac1947', 'd1', {
    id: 'x0', title: 'Quân dù nhảy xuống Chợ Mới, Chợ Đồn', date: '7/10/1947',
    text: 'Rạng sáng ngày 7 tháng 10, máy bay vận tải Pháp bay qua Chợ Mới và Chợ Đồn, quân dù nhảy xuống đồng loạt. Chúng hòng bắt gọn cơ quan đầu não kháng chiến chỉ cách đó vài chục cây số. Cùng lúc, hai gọng kìm theo Đường số 4 và sông Lô đã bắt đầu xuất phát.',
    cap: 'Quân dù áp sát cơ quan đầu não', cam: { x: -8, z: -6, d: 74, yaw: -8, pitch: 52 },
    acts: [
      { t: 'para', at: 'chomoi', n: 8, spread: 6, delay: 1 },
      { t: 'para', at: 'chodon', n: 8, spread: 6, delay: 2.2 },
      { t: 'ring', at: 'atk', rx: 7, rz: 7, color: 0xffd23f, label: 'Cơ quan đầu não kháng chiến', side: 'vn', delay: 4 },
      { t: 'arrow', path: ['backan', 'atk'], side: 'fr', label: 'Quân dù áp sát', dur: 2.4, delay: 5 },
    ],
  });
  put('vietbac1947', 'd2', {
    id: 'x1', title: 'Hai gọng kìm tiến lên', date: 'Cuối 10/1947',
    text: 'Trong khi quân dù bị vây, hai cánh quân của địch vẫn cố tiến lên. Cánh bộ binh cơ giới, có xe thiết giáp và pháo, theo Đường số 4 từ Lạng Sơn lên Cao Bằng. Cánh thủy binh theo sông Lô tiến về Tuyên Quang, nhưng đường hẹp, núi cao hai bên.',
    cap: 'Hai gọng kìm của địch', cam: { x: 8, z: 4, d: 112, yaw: 0, pitch: 54 },
    acts: [
      { t: 'arrow', path: ['langson', 'bonglau', 'caobang'], side: 'fr', label: 'Cánh Đường số 4', dur: 2.6 },
      { t: 'arrow', path: ['hanoi', 'vietri', 'doanhung', 'tuyenquang'], side: 'fr', label: 'Cánh sông Lô', dur: 2.6, delay: 0.3 },
      { t: 'spawn', id: 'x1xe', kind: 'truck', side: 'fr', at: 'langson', n: 3, label: 'Xe cơ giới và pháo', delay: 0.5 },
      { t: 'move', id: 'x1xe', path: ['bonglau', [34, -28]], dur: 6, delay: 1 },
      { t: 'spawn', id: 'x1tau', kind: 'boat', side: 'fr', at: 'vietri', n: 2, label: 'Tàu chiến địch', delay: 0.8 },
      { t: 'move', id: 'x1tau', path: ['doanhung', 'tuyenquang'], dur: 6, delay: 1.5 },
      { t: 'remove', id: ['x1xe', 'x1tau'], delay: 9.5 },
    ],
  });
  put('vietbac1947', 'd3', {
    id: 'x2', title: 'Địch bị cắt tiếp tế, hoang mang', date: 'Tháng 11/1947',
    text: 'Bị đánh liên tiếp trên Đường số 4 và sông Lô, quân Pháp tổn thất nặng, tiếp tế bị cắt đứt. Máy bay địch phải thả dù tiếp tế nhưng bộ đội ta bắn trả. Quân Pháp ở Chợ Đồn, Chợ Rã, Bắc Kạn hoang mang, tìm đường rút.',
    cap: 'Địch tìm đường rút', cam: { x: -6, z: -12, d: 96, yaw: 6, pitch: 52 },
    acts: [
      { t: 'fly', id: 'x2dak', kind: 'dak', side: 'fr', path: [[-42, -30], [-12, -20], [22, -6]], dur: 8, alt: 10, delay: 1 },
      { t: 'para', at: 'chora', n: 6, spread: 5, plane: false, delay: 3 },
      { t: 'tracer', from: 'atk', to: [-12, -26], n: 10, delay: 5 },
      { t: 'arrow', path: ['chora', 'backan', 'thainguyen'], side: 'fr', label: 'Địch tìm đường rút', dur: 3, delay: 6 },
    ],
  });

  /* ================= Biên giới 1950 ================= */
  put('bienGioi1950', 'd1', {
    id: 'x0', title: 'Kéo pháo vào trận địa', date: 'Tháng 9/1950',
    text: 'Trước giờ nổ súng, bộ đội ta bí mật tập kết sau lưng Cao Bằng. Dân công gùi gạo, đạn dược vượt núi. Từng khẩu pháo được kéo bằng sức người lên các sườn đồi nhìn xuống Đông Khê, ngụy trang kĩ. Ta tìm đúng chỗ yếu của chuỗi cứ điểm để mở màn.',
    cap: 'Pháo vào trận địa', cam: { x: -24, z: -4, d: 76, yaw: -12, pitch: 52 },
    acts: [
      { t: 'arrow', path: [[-44, 26], 'atk', 'lang1'], side: 'vn', label: 'Dân công tiếp tế', dur: 3 },
      { t: 'spawn', id: 'phaoDK', kind: 'gun', side: 'vn', at: [-42, 12], n: 2, face: 'dongkhe', label: 'Pháo kéo bằng sức người', delay: 0.5 },
      { t: 'move', id: 'phaoDK', path: [[-32, -2], [-22, -12]], dur: 7, delay: 1 },
      { t: 'pulse', at: 'dongkhe', color: 0xffd23f, r: 6, n: 2, delay: 7 },
    ],
  });
  put('bienGioi1950', 'd2', {
    id: 'x1', title: 'Hai binh đoàn Pháp xuất phát', date: '3 – 4/10/1950',
    text: 'Mất Đông Khê, Pháp quyết định hành động. Binh đoàn từ Thất Khê, có xe cơ giới và pháo yểm trợ, tiến lên Đông Khê. Binh đoàn từ Cao Bằng rút xuống theo Đường số 4 để hội quân. Hai cánh hẹn gặp nhau, nhưng quân ta đã chuẩn bị sẵn.',
    cap: 'Hai binh đoàn tiến và rút', cam: { x: -8, z: -14, d: 98, yaw: 0, pitch: 54 },
    acts: [
      { t: 'spawn', id: 'x1a', kind: 'truck', side: 'fr', at: 'thatkhe', n: 3, label: 'Binh đoàn từ Thất Khê' },
      { t: 'move', id: 'x1a', path: [[8, -12], 'cocxa'], dur: 6, delay: 1 },
      { t: 'spawn', id: 'x1b', kind: 'truck', side: 'fr', at: 'caobang', n: 3, label: 'Binh đoàn từ Cao Bằng', delay: 0.3 },
      { t: 'move', id: 'x1b', path: [[-24, -26], 'dongkhe'], dur: 7, delay: 1.4 },
      { t: 'shell', from: 'thatkhe', to: 'dongkhe', n: 3, delay: 4 },
      { t: 'remove', id: ['x1a', 'x1b'], delay: 10 },
    ],
  });
  put('bienGioi1950', 'd3', {
    id: 'x2', title: 'Pháp rút chạy khỏi Thất Khê', date: 'Giữa 10/1950',
    text: 'Sau trận Cốc Xá, quân Pháp ở Thất Khê, Na Sầm hoảng sợ. Chúng đốt kho, phá cầu rồi dùng xe cơ giới rút chạy xuống Lạng Sơn. Dải biên giới gần như bỏ ngỏ, nhưng bộ đội ta đã chiến đấu liên tục gần một tháng.',
    cap: 'Địch rút chạy', cam: { x: 14, z: 2, d: 90, yaw: -8, pitch: 54 },
    acts: [
      { t: 'fire', at: 'thatkhe', delay: 0.8 },
      { t: 'boom', at: 'thatkhe', n: 3, spread: 3, size: 1.4, delay: 1.5 },
      { t: 'spawn', id: 'x2xe', kind: 'truck', side: 'fr', at: 'thatkhe', n: 4, label: 'Quân Pháp rút chạy', delay: 1 },
      { t: 'move', id: 'x2xe', path: ['nasam', 'langson'], dur: 7, delay: 2 },
      { t: 'arrow', path: ['thatkhe', 'nasam', 'langson', 'hanoi'], side: 'fr', label: 'Địch rút chạy', dur: 3, delay: 1 },
      { t: 'remove', id: 'x2xe', delay: 10.5 },
    ],
  });

  /* ================= Điện Biên Phủ 1954 ================= */
  put('dienbienphu', 'd1', {
    id: 'x0', title: 'Bộ đội hành quân lên Tây Bắc', date: '12/1953',
    text: 'Cuối năm 1953, Bộ Chính trị quyết định mở chiến dịch Điện Biên Phủ. Bộ đội chủ lực hành quân hàng trăm cây số lên Tây Bắc, sở chỉ huy chiến dịch đặt ở Mường Phăng. Trên trời, máy bay Pháp ngày đêm do thám, tìm kiếm trận địa của ta.',
    cap: 'Hành quân lên Tây Bắc', cam: { x: 14, z: -18, d: 86, yaw: -10, pitch: 52 },
    acts: [
      { t: 'arrow', path: [[46, -46], 'sck'], side: 'vn', label: 'Bộ đội hành quân', dur: 3 },
      { t: 'ring', at: 'sck', rx: 6, rz: 6, color: 0xffd23f, label: 'Sở chỉ huy chiến dịch', side: 'vn', delay: 3 },
      { t: 'fly', id: 'x0rc', kind: 'dak', side: 'fr', path: [[-40, 40], [0, 0], [40, -40]], dur: 9, alt: 10, delay: 2 },
    ],
  });
  put('dienbienphu', 'd2', {
    id: 'x1', title: 'Kéo pháo vào trận địa', date: '1 – 12/3/1954',
    text: 'Ngày 26 tháng 1, ta đổi sang phương châm đánh chắc, tiến chắc. Pháo binh được kéo ra, rồi lại kéo vào trận địa mới bằng sức người, giấu kín trong các hầm trên núi cao. Bộ đội đào giao thông hào, siết dần vòng vây. Chiều 13 tháng 3 sắp là giờ nổ súng.',
    cap: 'Pháo vào trận địa', cam: { x: 22, z: -10, d: 70, yaw: -14, pitch: 50 },
    acts: [
      { t: 'spawn', id: 'x1gun', kind: 'gun', side: 'vn', at: [46, -22], n: 3, face: 'himlam', label: 'Pháo kéo bằng sức người' },
      { t: 'move', id: 'x1gun', path: [[40, -16], 'phao'], dur: 7, delay: 1 },
      { t: 'ring', at: 'phao', rx: 5, rz: 5, color: 0xff3b4a, label: 'Trận địa pháo ngụy trang', side: 'vn', delay: 6 },
      { t: 'arrow', path: [[24, -2], [16, -8], 'himlam'], side: 'vn', label: 'Giao thông hào siết vòng vây', dur: 3, delay: 7 },
    ],
  });
  put('dienbienphu', 'd3', {
    id: 'x2', title: 'Địch củng cố, tiếp tế đường không', date: '18 – 29/3/1954',
    text: 'Sau đợt 1, Pháp co cụm vào phân khu Trung tâm, đắp thêm công sự trên các đồi phía đông. Máy bay vận tải ngày đêm thả dù tiếp tế xuống sân bay Mường Thanh. Pháo của ta trên các sườn núi khóa chặt đường băng, uy hiếp máy bay địch.',
    cap: 'Cầu hàng không Mường Thanh', cam: { x: 4, z: -2, d: 62, yaw: 8, pitch: 50 },
    acts: [
      { t: 'ring', at: 'd1', rx: 8, rz: 8, color: 0x3d8bff, label: 'Địch củng cố đồi phía đông', side: 'fr' },
      { t: 'fly', id: 'x2d1', kind: 'dak', side: 'fr', path: [[2, 46], 'hongcum', 'sanbay', [-30, -34]], dur: 10, alt: 9, delay: 1 },
      { t: 'para', at: 'sanbay', n: 6, spread: 5, plane: false, delay: 4 },
      { t: 'shell', from: 'phao', to: 'sanbay', n: 3, delay: 7 },
    ],
  });

  /* ================= Ấp Bắc 1963 ================= */
  put('apbac1963', 'd1', {
    id: 'x0', title: 'Địch chuẩn bị càn quét', date: 'Đêm 1/1/1963',
    text: 'Từ Mỹ Tho, địch chuẩn bị cuộc càn lớn vào Ấp Bắc để tìm diệt đại đội địa phương và bộ đội chủ lực của ta. Xe bọc thép M113, trực thăng và pháo được tập trung ở sân bay Mỹ Tho. Lực lượng ta chỉ khoảng ba trăm rưỡi người, nhưng đã nắm được ý định của địch.',
    cap: 'Địch tập trung ở Mỹ Tho', cam: { x: 14, z: 8, d: 78, yaw: -10, pitch: 52 },
    acts: [
      { t: 'spawn', id: 'x0apc', kind: 'apc', side: 'us', at: 'mytho', n: 3, label: 'Xe bọc thép M113' },
      { t: 'move', id: 'x0apc', path: [[26, 14], [16, 6]], dur: 6, delay: 1.5 },
      { t: 'arrow', path: ['mytho', 'apbac'], side: 'us', label: 'Địch chuẩn bị càn', dur: 2.6, delay: 1 },
      { t: 'ring', at: 'apbac', rx: 5, rz: 5, color: 0xff3b4a, label: 'Ta ≈ 350 người, hầm sau lũy tre', side: 'vn', delay: 5 },
      { t: 'remove', id: 'x0apc', delay: 9 },
    ],
  });
  put('apbac1963', 'd2', {
    id: 'x1', title: 'Đợt trực thăng thứ hai', date: 'Sáng 2/1/1963',
    text: 'Sáng ngày 2 tháng 1, từng tốp trực thăng bay thấp từ phía Mỹ Tho, tiếng động cơ vang khắp cánh đồng. Chúng hướng về các bãi trống phía bắc và phía tây Ấp Bắc để đổ quân. Bộ đội nấp trong hầm sau lũy tre, súng lên đạn, chờ lệnh.',
    cap: 'Trực thăng áp sát', cam: { x: 6, z: 2, d: 74, yaw: 14, pitch: 52 },
    acts: [
      { t: 'spawn', id: 'x1h1', kind: 'heli', side: 'us', at: 'heliport', alt: 2.4, n: 1 },
      { t: 'move', id: 'x1h1', path: [[10, 6], 'lzBac'], dur: 6, delay: 0.5 },
      { t: 'spawn', id: 'x1h2', kind: 'heli', side: 'us', at: 'heliport', alt: 2.4, n: 1, delay: 0.3 },
      { t: 'move', id: 'x1h2', path: [[8, 8], 'lzTay'], dur: 6.5, delay: 1 },
      { t: 'arrow', path: ['heliport', 'lzBac'], side: 'us', label: 'Trực thăng đổ quân', dur: 2.6, delay: 1 },
      { t: 'ring', at: 'apbac', rx: 5, rz: 5, color: 0xff3b4a, label: 'Bộ đội nấp sau lũy tre', side: 'vn', delay: 4 },
      { t: 'remove', id: ['x1h1', 'x1h2'], delay: 10 },
    ],
  });
  put('apbac1963', 'd3', {
    id: 'x2', title: 'Địch bắn pháo, dồn nhiều đợt', date: 'Chiều 2/1/1963',
    text: 'Chiều ngày 2 tháng 1, địch bắn pháo dữ dội vào xóm, trực thăng vũ trang bắn rốc két, rồi cho bộ binh tiến lên nhiều đợt. Tiếng súng ròng rã từ trưa đến chiều. Bộ đội ta thay nhau đánh trả, nhiều trận ở cự li rất gần.',
    cap: 'Địch tiến công nhiều đợt', cam: { x: 4, z: -4, d: 62, yaw: -8, pitch: 50 },
    acts: [
      { t: 'shell', from: 'mytho', to: 'apbac', n: 5, big: true, delay: 1 },
      { t: 'spawn', id: 'x2h', kind: 'heli', side: 'us', at: 'heliport', alt: 3 },
      { t: 'move', id: 'x2h', path: [[14, 6], [8, 2]], dur: 5, delay: 1 },
      { t: 'tracer', from: 'x2h', to: 'apbac', n: 12, delay: 4 },
      { t: 'arrow', path: ['tanthoi', 'apbac'], side: 'us', label: 'Bộ binh tiến lên', dur: 2.6, delay: 3 },
      { t: 'remove', id: 'x2h', delay: 10.5 },
    ],
  });

  /* ================= Điện Biên Phủ trên không 1972 ================= */
  put('dbptrenkhong1972', 'd1', {
    id: 'x0', title: 'Hà Nội sẵn sàng chiến đấu', date: 'Tháng 12/1972',
    text: 'Hà Nội, Hải Phòng đã chuẩn bị từ trước. Tên lửa, pháo cao xạ và tiêm kích được bố trí thành thế trận nhiều tầng quanh thành phố. Dân quân tự vệ trực chiến, nhân dân sơ tán. Cả thành phố chờ những chiếc B-52 đầu tiên.',
    cap: 'Thế trận phòng không nhiều tầng', cam: { x: 0, z: 0, d: 100, yaw: 0, pitch: 54 },
    acts: [
      { t: 'ring', at: 'hanoi', rx: 30, rz: 30, color: 0x35d07f, label: 'Thế trận nhiều tầng', side: 'vn' },
      { t: 'pulse', at: 'sam1', color: 0xffd23f, r: 5, n: 2, delay: 1 },
      { t: 'pulse', at: 'sam3', color: 0xffd23f, r: 5, n: 2, delay: 1.4 },
      { t: 'pulse', at: 'aaa4', color: 0xffd23f, r: 5, n: 2, delay: 1.8 },
      { t: 'fly', id: 'x0mig', kind: 'mig', side: 'vn', path: [[-32, -30], [0, 0], [36, 30]], dur: 7, alt: 9, delay: 3 },
    ],
  });
  put('dbptrenkhong1972', 'd2', {
    id: 'x1', title: 'Mỹ tăng số lượng, đổi cách đánh', date: 'Đêm 19 – 21/12/1972',
    text: 'Những đêm tiếp theo, Mỹ tăng số lượng B-52, đánh theo từng tốp, thay đổi hướng bay và độ cao. Máy bay gây nhiễu bay kèm để che mắt ra đa. Chúng rải bom cả vào khu dân cư, nhưng quân dân ta vẫn nổ súng đón đánh.',
    cap: 'Mỹ đổi cách đánh', cam: { x: 2, z: 2, d: 96, yaw: -14, pitch: 50 },
    acts: [
      { t: 'fly', id: 'x1b1', kind: 'b52', side: 'us', path: [[-48, 24], [-20, 10], [0, 2], [24, -12], [48, -30]], dur: 14, alt: 15, drop: [0.4, 0.62], label: 'B-52', delay: 1 },
      { t: 'fly', id: 'x1e', kind: 'f4', side: 'us', path: [[-48, 34], [-22, 18], [0, 8], [26, -6], [48, -22]], dur: 14, alt: 12, label: 'Máy bay gây nhiễu', delay: 1.6 },
      { t: 'sam', from: 'sam1', at: 'x1b1', delay: 7 },
      { t: 'tracer', from: 'aaa4', to: [-4, 0], n: 12, delay: 8 },
    ],
  });
  put('dbptrenkhong1972', 'd3', {
    id: 'x2', title: 'Mỹ thiệt hại nặng, dư luận phản đối', date: '28 – 29/12/1972',
    text: 'Sau nhiều đêm tập kích, Mỹ mất hàng chục máy bay, trong đó có nhiều B-52. Dư luận thế giới phản đối mạnh mẽ cuộc ném bom vào dân thường. Ngày 29 tháng 12, Mỹ phải tuyên bố ngừng ném bom miền Bắc và đề nghị đàm phán.',
    cap: 'Mỹ phải ngừng ném bom', cam: { x: 0, z: 2, d: 104, yaw: 0, pitch: 54 },
    acts: [
      { t: 'mark', at: 'hanoi', text: 'Hàng chục máy bay Mỹ bị bắn rơi', side: 'vn', lift: 6, delay: 1 },
      { t: 'fly', id: 'x2b', kind: 'b52', side: 'us', path: [[0, 0], [-24, 14], [-48, 28]], dur: 9, alt: 15, delay: 3 },
      { t: 'pulse', at: 'hanoi', color: 0xffd23f, r: 12, n: 2, delay: 6 },
    ],
  });

  /* ================= Tây Nguyên – Hồ Chí Minh 1975 ================= */
  put('xuan1975', 'd1', {
    id: 'x0', title: 'Chủ lực bí mật vào Tây Nguyên', date: 'Đầu 1975',
    text: 'Đầu năm 1975, các binh đoàn chủ lực, xe tăng và pháo binh bí mật hành quân vào Tây Nguyên theo đường Trường Sơn. Đường 14 được sửa gấp để vận chuyển. Ta nghi binh ở phía bắc để đánh lạc hướng địch, giữ kín ý định tiến công.',
    cap: 'Hành quân bí mật', cam: { x: -22, z: -26, d: 96, yaw: -8, pitch: 52 },
    acts: [
      { t: 'spawn', id: 'x0tk', kind: 'tank', side: 'vn', at: 'vnW', n: 3, label: 'Xe tăng ta' },
      { t: 'move', id: 'x0tk', path: [[-28, -24], [-18, -26]], dur: 6, delay: 1 },
      { t: 'spawn', id: 'x0gun', kind: 'gun', side: 'vn', at: [-44, -12], n: 2, face: 'bmt', label: 'Pháo binh ta', delay: 0.5 },
      { t: 'move', id: 'x0gun', path: [[-34, -18], [-26, -22]], dur: 7, delay: 1.5 },
      { t: 'arrow', path: ['vnW', [-24, -36], 'pleiku'], side: 'vn', label: 'Nghi binh phía bắc', dur: 3, delay: 3 },
      { t: 'remove', id: ['x0tk', 'x0gun'], delay: 11 },
    ],
  });
  put('xuan1975', 'd2', {
    id: 'x1', title: 'Địch quyết định rút bỏ Tây Nguyên', date: '14/3/1975',
    text: 'Sau khi mất Buôn Ma Thuột, Nguyễn Văn Thiệu quyết định rút bỏ Plei Ku, Kon Tum để co về giữ vùng ven biển. Đoàn xe, xe tăng và pháo của địch ùn ùn rút theo Đường số 7. Máy bay vận tải bay lượn, cuộc rút lui hỗn loạn.',
    cap: 'Rút lui hỗn loạn theo Đường số 7', cam: { x: 8, z: -32, d: 92, yaw: -8, pitch: 52 },
    acts: [
      { t: 'arrow', path: ['pleiku', 'cheoreo', 'tuyhoa'], side: 'sg', label: 'Địch rút theo Đường số 7', dur: 3, delay: 0.5 },
      { t: 'spawn', id: 'x1tr', kind: 'truck', side: 'sg', at: 'pleiku', n: 4, label: 'Đoàn xe rút chạy', delay: 0.5 },
      { t: 'move', id: 'x1tr', path: ['cheoreo', 'tuyhoa'], dur: 8, delay: 1 },
      { t: 'spawn', id: 'x1tk', kind: 'tank', side: 'sg', at: 'pleiku', n: 2, delay: 0.8 },
      { t: 'move', id: 'x1tk', path: ['cheoreo', 'tuyhoa'], dur: 9, delay: 1.5 },
      { t: 'fly', id: 'x1dak', kind: 'dak', side: 'sg', path: [[-20, -46], 'cheoreo', [46, -30]], dur: 9, alt: 10, delay: 2 },
      { t: 'remove', id: ['x1tr', 'x1tk'], delay: 11 },
    ],
  });
  put('xuan1975', 'd3', {
    id: 'x2', title: 'Bao vây Sài Gòn', date: 'Giữa 4/1975',
    text: 'Giữa tháng 4, Xuân Lộc bị diệt, Phan Rang được giải phóng. Các quân đoàn chủ lực, xe tăng và pháo binh áp sát Sài Gòn từ nhiều phía. Quanh thành phố địch vẫn còn lực lượng lớn, cần chọn cách đánh vào trung tâm sao cho nhanh và ít thiệt hại cho nhân dân.',
    cap: 'Vòng vây quanh Sài Gòn', cam: { x: 10, z: 24, d: 96, yaw: -10, pitch: 52 },
    acts: [
      { t: 'flag', at: 'xuanloc', kind: 'nlf', delay: 0.8 },
      { t: 'flag', at: 'phanrang', kind: 'nlf', delay: 1.4 },
      { t: 'spawn', id: 'x2tk', kind: 'tank', side: 'vn', at: 'xuanloc', n: 3, label: 'Xe tăng ta' },
      { t: 'move', id: 'x2tk', path: ['bienhoa', [8, 36]], dur: 7, delay: 2 },
      { t: 'spawn', id: 'x2g', kind: 'gun', side: 'vn', at: [26, 12], n: 3, face: 'bienhoa', delay: 0.5 },
      { t: 'shell', from: 'x2g', to: 'bienhoa', n: 3, delay: 5 },
      { t: 'ring', at: 'saigon', rx: 18, rz: 18, color: 0xff3b4a, label: 'Vòng vây quanh Sài Gòn', side: 'vn', delay: 6 },
      { t: 'remove', id: ['x2tk', 'x2g'], delay: 11.5 },
    ],
  });
})();
