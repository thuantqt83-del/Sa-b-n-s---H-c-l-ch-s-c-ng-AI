/* Phim sa bàn mở đầu ở trang chủ: mũi tên xanh = âm mưu của địch, mũi tên đỏ = hướng đánh của ta.
   Lời kể và mũi tên được đồng bộ: mũi tên chạm tới địa danh nào thì giọng kể nhắc tên địa danh đó. */
(function () {
  'use strict';
  const SBS = window.SBS;
  SBS.homeIntro = {
    map: 'dienbienphu',
    text: 'Điện Biên Phủ, năm 1954. Pháp dồn quân xây tập đoàn cứ điểm, tiếp tế bằng máy bay xuống sân bay Mường Thanh: mũi tên xanh là âm mưu của địch. Quân ta tiến công từ ba phía: Him Lam, Độc Lập, Bản Kéo, rồi siết chặt các đồi phía đông và đánh vào trung tâm: mũi tên đỏ là hướng đánh của ta. Em hãy cùng AI đưa ra quyết định!',
    cam: { x: 2, z: 2, d: 96, yaw: 12, pitch: 52 },
    acts: [
      { t: 'arrow', path: [[-44, 34], 'sanbay'], side: 'fr', air: 6, label: 'Tiếp tế đường không', dur: 3 },
      { t: 'arrow', path: ['hongcum', 'muongthanh'], side: 'fr', label: 'Tiếp viện', sync: 'mũi tên xanh', dur: 2.6, follow: false },
      { t: 'arrow', from: [30, -16], to: 'himlam', side: 'vn', dur: 2.6 },
      { t: 'arrow', from: [4, -38], to: 'doclap', side: 'vn', dur: 2.6, follow: false },
      { t: 'arrow', from: [-28, -20], to: 'bankeo', side: 'vn', dur: 2.6, follow: false },
      { t: 'arrow', path: ['phao', 'c1', 'a1'], side: 'vn', sync: 'các đồi phía đông', dur: 2.8, follow: false },
      { t: 'arrow', path: [[32, -6], 'a1', 'a3', 'muongthanh'], side: 'vn', sync: 'trung tâm', dur: 3, follow: false },
    ],
  };
})();
