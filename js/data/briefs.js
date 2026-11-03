/* Màn mở đầu mỗi trận (ngắn gọn): âm mưu của địch · tương quan lực lượng · yếu tố thắng lợi của ta */
(function () {
  'use strict';
  const SBS = window.SBS;
  const X = {
    vietbac1947: {
      plot: 'Pháp muốn “đánh nhanh, thắng nhanh”: dùng khoảng 12.000 quân, tiến công Việt Bắc theo hai gọng kìm là Đường số 4 và sông Lô, hòng tiêu diệt cơ quan đầu não và bộ đội chủ lực của ta để kết thúc chiến tranh.',
      ratio: 'Địch hơn về vũ khí và cơ giới; ta có địa hình hiểm trở và được nhân dân che chở.',
      win: [
        'Đường lối kháng chiến đúng đắn, sự chỉ đạo sáng suốt của Đảng và Chủ tịch Hồ Chí Minh.',
        'Chủ động bao vây, phục kích đúng chỗ hiểm, bẻ gãy hai gọng kìm.',
        'Dựa vào địa hình rừng núi và sự che chở của nhân dân Việt Bắc.',
      ],
    },
    bienGioi1950: {
      plot: 'Theo Kế hoạch Rơ-ve, Pháp xây chuỗi cứ điểm dọc Đường số 4 từ Cao Bằng đến Lạng Sơn để khóa chặt biên giới Việt – Trung, cô lập căn cứ địa Việt Bắc.',
      ratio: 'Địch có xe cơ giới, pháo, máy bay; ta tập trung ưu thế quân số ở nơi quyết định.',
      win: [
        'Chọn đúng hướng đánh: đánh điểm Đông Khê để diệt viện trên Đường số 4.',
        'Tập trung ưu thế lực lượng, nghi binh và mai phục bất ngờ.',
        'Nhân dân, dân công Việt Bắc dốc sức; được bạn bè quốc tế ủng hộ.',
      ],
    },
    dienbienphu: {
      plot: 'Theo Kế hoạch Na-va, Pháp xây Điện Biên Phủ thành tập đoàn cứ điểm mạnh nhất Đông Dương, dụ chủ lực ta vào quyết chiến rồi tiêu diệt, tìm lối thoát “trong danh dự”.',
      ratio: 'Địch có khoảng 16.000 quân, 49 cứ điểm, tiếp tế đường không; ta có chủ lực, pháo binh và hậu phương dồn sức.',
      win: [
        'Quyết tâm chiến lược đúng đắn của Đảng; đổi sang “đánh chắc, tiến chắc”.',
        'Hậu phương vĩ đại: hàng chục vạn dân công, xe đạp thồ vượt đèo, lội suối tiếp tế.',
        'Bộ đội dũng cảm, kéo pháo ra – vào bằng sức người, siết chặt vòng vây.',
      ],
    },
    apbac1963: {
      plot: 'Mỹ – Sài Gòn thực hiện “Chiến tranh đặc biệt”: dồn dân lập ấp chiến lược, dùng trực thăng vận, thiết xa vận để càn quét, nhanh chóng dập tắt phong trào cách mạng miền Nam.',
      ratio: 'Địch đông gấp gần 6 lần, có trực thăng, M113, pháo; ta ít quân nhưng bố trí sẵn thế trận.',
      win: [
        'Nắm chắc chiến thuật trực thăng vận, thiết xa vận của địch, bố trí sẵn thế trận.',
        'Dựa vào dân và địa hình: lũy tre, ruộng nước, kênh rạch.',
        'Tinh thần bám trụ, dũng cảm, đánh trúng chỗ yếu của địch.',
      ],
    },
    dbptrenkhong1972: {
      plot: 'Mỹ muốn dùng sức mạnh B-52, “pháo đài bay”, đánh phá ồ ạt Hà Nội, Hải Phòng để ép ta nhượng bộ ở bàn đàm phán Pa-ri.',
      ratio: 'Địch có B-52, máy bay hộ tống, gây nhiễu; ta có tên lửa, cao xạ, tiêm kích và thế trận phòng không nhân dân.',
      win: [
        'Thế trận phòng không nhân dân: tên lửa, pháo cao xạ, không quân phối hợp chặt chẽ.',
        'Chuẩn bị chu đáo từ trước, sẵn sàng chiến đấu, nắm quy luật hoạt động của B-52.',
        'Tinh thần kiên cường của quân dân thủ đô, hậu phương lớn miền Bắc.',
      ],
    },
    xuan1975: {
      plot: 'Sau Hiệp định Pa-ri, chính quyền Sài Gòn vẫn phá hoại hiệp định, dựa vào viện trợ Mỹ; chúng dồn lực mạnh ở Plei Ku, Kon Tum, còn Buôn Ma Thuột phòng thủ sơ hở.',
      ratio: 'Quân đội Sài Gòn suy yếu, Mỹ khó can thiệp; ta có các binh đoàn chủ lực, xe tăng, pháo và hậu phương miền Bắc lớn mạnh.',
      win: [
        'Quyết tâm chiến lược đúng đắn của Bộ Chính trị; nghi binh, đánh điểm hiểm, phát triển thần tốc.',
        'Sức mạnh tổng hợp: binh đoàn chủ lực, xe tăng, pháo binh kết hợp quần chúng nổi dậy.',
        'Hậu phương miền Bắc chi viện lớn; tinh thần “thần tốc, táo bạo, quyết thắng”.',
      ],
    },
  };
  SBS.battles.forEach((b) => { if (X[b.id]) Object.assign(b.brief, X[b.id]); });
})();
