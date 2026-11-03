/* Bảng phân loại LỖI TƯ DUY – AI dùng để chẩn đoán khi học sinh chọn sai quyết định */
(function () {
  'use strict';
  const SBS = window.SBS;
  SBS.errorTags = {
    'nong-voi': { lure: 'Đánh nhanh, thắng nhanh nghe rất hấp dẫn.', name: 'Nóng vội, muốn thắng nhanh', icon: '⚡', color: '#f59e0b', tip: 'Khi lực lượng chưa đủ hoặc địch còn mạnh, phải chuẩn bị chắc chắn rồi mới đánh. Nguyên tắc của ta là chỉ đánh khi có chắc thắng.' },
    'chu-quan': { lure: 'Nghĩ địch yếu nên cứ đánh thẳng nghe rất dễ dàng.', name: 'Chủ quan, coi thường đối phương', icon: '😌', color: '#f97316', tip: 'Luôn đánh giá đúng sức mạnh và âm mưu của đối phương. Thắng một trận chưa có nghĩa là cuộc chiến đã kết thúc.' },
    'bi-dong': { lure: 'Chờ thêm cho chắc chắn nghe có vẻ an toàn.', name: 'Bị động, chờ đợi', icon: '⏳', color: '#64748b', tip: 'Phải giành và giữ thế chủ động: tự mình chọn nơi đánh, thời điểm đánh, thay vì chờ địch hay chờ điều kiện tự đến.' },
    'ne-tranh': { lure: 'Tránh đụng độ để giữ sức nghe có vẻ khôn ngoan.', name: 'Né tránh, thiếu quyết tâm', icon: '🏃', color: '#6366f1', tip: 'Quyết tâm chiến đấu để bảo vệ độc lập, tự do là điều kiện đầu tiên của thắng lợi. Lùi bước chỉ nhường thế cho địch.' },
    'doi-dau': { lure: 'Đánh thẳng vào nơi địch mạnh nhất nghe rất oai hùng.', name: 'Đối đầu nơi địch mạnh nhất', icon: '🧱', color: '#ef4444', tip: 'Chọn đánh vào chỗ yếu, chỗ hở của địch; tránh húc thẳng vào nơi địch mạnh nhất. Gỡ dần từng bộ phận, rồi mới đến đầu não.' },
    'dan-trai': { lure: 'Đánh khắp nơi cùng lúc nghe như tạo được thế áp đảo.', name: 'Dàn trải lực lượng', icon: '🕸️', color: '#a855f7', tip: 'Tập trung ưu thế lực lượng vào hướng chủ yếu, nơi quyết định. Đánh khắp nơi cùng lúc sẽ yếu ở mọi nơi.' },
    'lieu-linh': { lure: 'Hành động táo bạo bất chấp nghe rất khí thế.', name: 'Liều lĩnh, vượt quá khả năng', icon: '🎲', color: '#dc2626', tip: 'Táo bạo phải đi cùng tính toán. Hành động vượt quá điều kiện thực tế chỉ gây tổn thất vô ích.' },
    'rap-khuon': { lure: 'Làm theo cách quen thuộc nghe rất yên tâm.', name: 'Rập khuôn, máy móc', icon: '📋', color: '#0ea5e9', tip: 'Mỗi trận đánh có hoàn cảnh riêng. Kinh nghiệm cũ chỉ đúng khi điều kiện giống nhau; phải vận dụng linh hoạt, sáng tạo.' },
    'bo-hau-phuong': { lure: 'Chỉ lo mặt trận phía trước nghe có vẻ gọn gàng.', name: 'Bỏ quên nhân dân và hậu phương', icon: '🌾', color: '#16a34a', tip: 'Sức mạnh của ta là sức mạnh toàn dân. Hậu phương, dân công, lương thực, đạn dược là điều kiện sống còn của mặt trận.' },
    'don-luc': { lure: 'Chỉ dựa vào súng đạn nghe có vẻ trực tiếp và nhanh gọn.', name: 'Chỉ nhìn một mặt (quân sự)', icon: '🎯', color: '#0d9488', tip: 'Kháng chiến là cuộc đấu tranh toàn diện: quân sự, chính trị, ngoại giao phải kết hợp chặt chẽ.' },
    'vu-khi': { lure: 'Có vũ khí hiện đại hơn nghe rất yên tâm.', name: 'Tuyệt đối hóa vũ khí, kĩ thuật', icon: '🛩️', color: '#7c3aed', tip: 'Vũ khí quan trọng nhưng con người, nghệ thuật chiến tranh nhân dân và thế trận mới quyết định thắng lợi.' },
    'lo-thoi-co': { lure: 'Chần chừ thêm một chút nghe có vẻ thận trọng.', name: 'Chậm trễ, bỏ lỡ thời cơ', icon: '⌛', color: '#b45309', tip: 'Thời cơ đến phải nắm bắt kịp thời, hành động thần tốc, táo bạo. Chần chừ sẽ để địch kịp củng cố.' },
    'nham-lan': { lure: 'Nhớ lại thông tin quen thuộc nghe rất đúng.', name: 'Nhầm lẫn kiến thức', icon: '❓', color: '#475569', tip: 'Hãy gắn sự kiện với đúng thời gian, địa điểm và lực lượng tham gia; lập sơ đồ mốc thời gian để khỏi nhầm.' },
    'ngoai-vien': { lure: 'Trông chờ sự giúp đỡ từ bên ngoài nghe rất thuận lợi.', name: 'Ỷ lại bên ngoài', icon: '🤝', color: '#0891b2', tip: 'Sự giúp đỡ quốc tế rất quý, nhưng thắng lợi trước hết dựa vào đường lối độc lập, tự chủ và sức mạnh của chính mình.' },
  };
})();
