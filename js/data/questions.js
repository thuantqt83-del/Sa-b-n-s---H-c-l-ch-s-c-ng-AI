/* Ngân hàng câu hỏi luyện thi tốt nghiệp – kháng chiến chống Pháp và chống Mỹ
   MC: mc(bài, chủ đề, mức, câu hỏi, [4 đáp án], chỉ số đúng, giải thích)   mức: 1 nhận biết, 2 thông hiểu, 3 vận dụng
   TF: tf(bài, mức, tư liệu, [[ý, đúng/sai, giải thích] × 4]) */
(function () {
  'use strict';
  const SBS = window.SBS;
  const MC = [], TF = [];
  const mc = (l, t, lv, q, o, a, w) => MC.push({ id: 'Q' + (MC.length + 1), l, t, lv, q, o, a, w });
  const tf = (l, lv, topic, src, stem, items) => TF.push({ id: 'T' + (TF.length + 1), l, lv, t: topic, src, stem, items: items.map((x) => ({ s: x[0], v: x[1], w: x[2] })) });

  /* ====================== BÀI 7 – TRẮC NGHIỆM ====================== */
  // --- Nhận biết ---
  mc('B7', 'moc', 1, 'Cuộc chiến tranh xâm lược Việt Nam lần thứ hai của thực dân Pháp mở đầu bằng sự kiện nào?', ['Pháp đánh úp trụ sở Ủy ban hành chính Nam Bộ ở Sài Gòn (rạng sáng 23/9/1945)', 'Pháp nổ súng ở khu vực Bắc Bộ Phủ ngày 19/12/1946', 'Pháp tấn công lên Việt Bắc tháng 10/1947', 'Pháp xây dựng tập đoàn cứ điểm Điện Biên Phủ'], 0, 'Rạng sáng 23/9/1945 Pháp đánh úp Sài Gòn, mở đầu cuộc chiến tranh xâm lược Việt Nam lần thứ hai.');
  mc('B7', 'moc', 1, 'Hiệp định Sơ bộ giữa Chính phủ Việt Nam Dân chủ Cộng hòa và Pháp được kí vào ngày nào?', ['28/2/1946', '6/3/1946', '19/12/1946', '2/9/1945'], 1, 'Hiệp định Sơ bộ được kí ngày 6/3/1946; ngày 28/2/1946 là Hiệp ước Hoa – Pháp.');
  mc('B7', 'moc', 1, 'Chủ tịch Hồ Chí Minh ra Lời kêu gọi toàn quốc kháng chiến vào ngày nào?', ['6/3/1946', '23/9/1945', '19/12/1946', '7/5/1954'], 2, 'Lời kêu gọi được ra ngày 19/12/1946.');
  mc('B7', 'duongloi', 1, 'Đường lối kháng chiến chống thực dân Pháp của Đảng ta là gì?', ['Toàn dân, toàn diện, trường kì, tự lực cánh sinh và tranh thủ sự ủng hộ của quốc tế', 'Chỉ dựa vào quân đội chính quy, đánh nhanh thắng nhanh', 'Chờ viện trợ nước ngoài rồi mới tiến công', 'Chỉ đấu tranh ngoại giao, không dùng vũ lực'], 0, 'Đó là đường lối kháng chiến toàn dân, toàn diện, trường kì, tự lực cánh sinh và tranh thủ sự ủng hộ quốc tế.');
  mc('B7', 'dienbien', 1, 'Chiến dịch phản công lớn đầu tiên của quân đội ta trong kháng chiến chống Pháp là', ['Chiến dịch Việt Bắc thu – đông 1947', 'Chiến dịch Biên giới thu – đông 1950', 'Chiến dịch Hòa Bình đông – xuân 1951 – 1952', 'Chiến dịch Điện Biên Phủ 1954'], 0, 'Chiến dịch Việt Bắc 1947 là chiến dịch phản công lớn đầu tiên.');
  mc('B7', 'dienbien', 1, 'Chiến dịch tiến công lớn đầu tiên của bộ đội chủ lực Việt Nam trong kháng chiến chống Pháp là', ['Chiến dịch Việt Bắc thu – đông 1947', 'Chiến dịch Biên giới thu – đông 1950', 'Chiến dịch Thượng Lào năm 1953', 'Chiến dịch Tây Bắc thu – đông 1952'], 1, 'Chiến dịch Biên giới 1950 là chiến dịch tiến công lớn đầu tiên của bộ đội chủ lực.');
  mc('B7', 'dienbien', 1, 'Trong chiến dịch Biên giới thu – đông 1950, quân ta tấn công cứ điểm nào để mở màn?', ['Cao Bằng', 'Đông Khê', 'Lạng Sơn', 'Hòa Bình'], 1, 'Quân đội ta tấn công cứ điểm Đông Khê trên Đường số 4.');
  mc('B7', 'dienbien', 1, 'Chiến dịch Biên giới thu – đông 1950 đã làm phá sản kế hoạch nào của thực dân Pháp?', ['Kế hoạch Na-va', 'Kế hoạch Rơ-ve', 'Kế hoạch Xta-lây – Tay-lo', 'Kế hoạch Đờ Lát đờ Tát-xi-nhi'], 1, 'Chiến dịch Biên giới làm phá sản Kế hoạch Rơ-ve của Pháp.');
  mc('B7', 'moc', 1, 'Đại hội đại biểu lần thứ II của Đảng Cộng sản Đông Dương (2/1951) họp tại đâu?', ['Pác Bó (Cao Bằng)', 'Chiêm Hóa (Tuyên Quang)', 'Tân Trào (Tuyên Quang)', 'Thủ đô Hà Nội'], 1, 'Đại hội II họp ở Chiêm Hóa, Tuyên Quang.');
  mc('B7', 'duongloi', 1, 'Tại Đại hội II (2/1951), Đảng Cộng sản Đông Dương quyết định đổi tên thành', ['Đảng Cộng sản Việt Nam', 'Đảng Lao động Việt Nam', 'Đảng Dân chủ Việt Nam', 'Đảng Nhân dân Việt Nam'], 1, 'Đại hội II đổi tên Đảng thành Đảng Lao động Việt Nam.');
  mc('B7', 'moc', 1, 'Kế hoạch Na-va được thực dân Pháp đề ra vào thời gian nào?', ['Tháng 7/1953', 'Tháng 12/1953', 'Tháng 3/1954', 'Tháng 10/1950'], 0, 'Tháng 7/1953, được sự thỏa thuận của Mỹ, Pháp đề ra Kế hoạch Na-va.');
  mc('B7', 'dienbien', 1, 'Chiến dịch Điện Biên Phủ trải qua bao nhiêu ngày đêm?', ['30 ngày đêm', '45 ngày đêm', '56 ngày đêm', '75 ngày đêm'], 2, 'Chiến dịch trải qua 56 ngày đêm (13/3 – 7/5/1954).');
  mc('B7', 'dienbien', 1, 'Tập đoàn cứ điểm Điện Biên Phủ được chia thành các phân khu nào?', ['Phân khu Đông, Tây, Nam', 'Phân khu Bắc, Trung tâm, Nam', 'Phân khu Bắc, Đông, Tây', 'Phân khu Trung tâm, Đông, Tây'], 1, 'Gồm ba phân khu: Bắc, Trung tâm và Nam.');
  mc('B7', 'dienbien', 1, 'Trong đợt 1 của chiến dịch Điện Biên Phủ (13 – 17/3/1954), quân ta tiến công', ['Cụm cứ điểm Him Lam và đồi Độc Lập, bức hàng Bản Kéo', 'Các cứ điểm phía đông phân khu Trung tâm', 'Sân bay Mường Thanh và phân khu Nam', 'Sở chỉ huy của Đờ Ca-xtơ-ri'], 0, 'Đợt 1: tiến công Him Lam, đồi Độc Lập, bức hàng Bản Kéo.');
  mc('B7', 'moc', 1, 'Tướng Đờ Ca-xtơ-ri cùng toàn bộ Bộ Tham mưu của Pháp ở Điện Biên Phủ đầu hàng vào thời điểm nào?', ['17 giờ 30 phút ngày 7/5/1954', '11 giờ 30 phút ngày 7/5/1954', '17 giờ ngày 13/3/1954', '8 giờ ngày 21/7/1954'], 0, 'Đến 17 giờ 30 phút ngày 7/5/1954, Đờ Ca-xtơ-ri cùng toàn bộ Bộ Tham mưu đầu hàng.');
  mc('B7', 'moc', 1, 'Hiệp định Giơ-ne-vơ về chấm dứt chiến tranh, lập lại hòa bình ở Đông Dương được kí vào ngày', ['7/5/1954', '21/7/1954', '27/1/1973', '30/4/1975'], 1, 'Hiệp định Giơ-ne-vơ kí ngày 21/7/1954.');
  mc('B7', 'boicanh', 1, 'Chính phủ Pháp cử ai làm Cao ủy Đông Dương khi quyết định thành lập đạo quân viễn chinh xâm lược Việt Nam lần nữa?', ['Đác-giăng-li-ơ', 'Na-va', 'Rơ-ve', 'Đờ Ca-xtơ-ri'], 0, 'Chính phủ Pháp cử Đác-giăng-li-ơ làm Cao ủy Đông Dương.');
  mc('B7', 'boicanh', 1, 'Sự kiện nào sau đây thuộc bối cảnh thế giới tác động lớn đến cuộc kháng chiến chống Pháp?', ['Sự hình thành Trật tự thế giới hai cực I-an-ta và tình trạng chiến tranh lạnh', 'Chủ nghĩa đế quốc thống trị toàn bộ thế giới', 'Phong trào giải phóng dân tộc ở các nước thuộc địa suy yếu', 'Hệ thống xã hội chủ nghĩa tan rã'], 0, 'Trật tự I-an-ta, chiến tranh lạnh, hệ thống xã hội chủ nghĩa hình thành và phong trào giải phóng dân tộc dâng cao tác động lớn đến Việt Nam.');
  mc('B7', 'nguyennhan', 1, 'Nguyên nhân chủ quan quan trọng hàng đầu dẫn đến thắng lợi của kháng chiến chống Pháp là', ['Sự giúp đỡ của Trung Quốc và Liên Xô', 'Sự lãnh đạo sáng suốt của Đảng, đứng đầu là Chủ tịch Hồ Chí Minh với đường lối kháng chiến đúng đắn, sáng tạo', 'Sự ủng hộ của nhân dân Pháp', 'Sự liên minh Việt – Miên – Lào'], 1, 'Sự lãnh đạo của Đảng và Chủ tịch Hồ Chí Minh là nguyên nhân chủ quan hàng đầu; các ý còn lại là nguyên nhân khách quan.');
  mc('B7', 'nguyennhan', 1, 'Nguyên nhân khách quan nào góp phần vào thắng lợi của cuộc kháng chiến chống Pháp?', ['Đường lối kháng chiến đúng đắn của Đảng', 'Sự liên minh chiến đấu Việt – Miên – Lào và sự ủng hộ của Trung Quốc, Liên Xô', 'Tinh thần yêu nước của toàn dân', 'Hậu phương rộng lớn, vững chắc'], 1, 'Liên minh nhân dân ba nước và sự ủng hộ quốc tế là nguyên nhân khách quan.');
  mc('B7', 'ynghia', 1, 'Thắng lợi của cuộc kháng chiến chống thực dân Pháp (1945 – 1954) đã', ['Chấm dứt chiến tranh xâm lược và ách thống trị của thực dân Pháp trên đất nước ta', 'Hoàn thành thống nhất đất nước', 'Xóa bỏ hoàn toàn chế độ phong kiến', 'Giải phóng toàn bộ miền Nam'], 0, 'Thắng lợi chấm dứt chiến tranh xâm lược và ách thống trị của Pháp; miền Nam chưa được giải phóng.');
  mc('B7', 'moc', 1, 'Mặt trận Liên Việt ra đời vào ngày nào?', ['3/3/1951', '19/12/1946', '6/3/1946', '7/5/1954'], 0, 'Mặt trận Liên Việt ra đời ngày 3/3/1951.');
  mc('B7', 'dienbien', 1, 'Chiến dịch Hòa Bình của quân đội ta diễn ra vào thời gian nào?', ['Thu – đông 1947', 'Đông – xuân 1951 – 1952', 'Thu – đông 1952', 'Xuân – hè 1953'], 1, 'Chiến dịch Hòa Bình: đông – xuân 1951 – 1952; Tây Bắc: thu – đông 1952; Thượng Lào: xuân – hè 1953.');
  mc('B7', 'dienbien', 1, 'Cuộc Tiến công chiến lược Đông – Xuân 1953 – 1954 của ta đã', ['Làm phá sản bước đầu Kế hoạch Na-va', 'Làm phá sản Kế hoạch Rơ-ve', 'Kết thúc cuộc kháng chiến chống Pháp', 'Giải phóng hoàn toàn Tây Bắc'], 0, 'Tiến công chiến lược Đông – Xuân 1953 – 1954 làm phá sản bước đầu Kế hoạch Na-va.');
  // --- Thông hiểu ---
  mc('B7', 'dienbien', 2, 'Ý nghĩa của cuộc chiến đấu ở các đô thị phía bắc vĩ tuyến 16 (19/12/1946 – 17/2/1947) là', ['Tiêu diệt hoàn toàn lực lượng Pháp ở Bắc Bộ', 'Làm thất bại một bước kế hoạch “đánh nhanh, thắng nhanh”; có thêm thời gian di chuyển cơ quan kháng chiến, cơ sở vật chất lên chiến khu', 'Giải phóng Hà Nội và các thành phố lớn', 'Buộc Pháp kí hiệp định đình chiến'], 1, 'Cuộc chiến đấu giam chân địch, bảo vệ lực lượng và tạo thời gian chuẩn bị kháng chiến lâu dài.');
  mc('B7', 'dienbien', 2, 'Kết quả của chiến dịch Việt Bắc thu – đông 1947 là', ['Quân ta giải phóng Hà Nội', 'Đại bộ phận quân Pháp phải rút chạy khỏi Việt Bắc; cơ quan đầu não của cuộc kháng chiến được bảo vệ an toàn', 'Pháp phải kí hiệp định đình chiến', 'Quân ta tiêu diệt toàn bộ quân Pháp ở Đông Dương'], 1, 'Sau hai tháng, đại bộ phận quân Pháp rút chạy; đầu não kháng chiến được bảo vệ.');
  mc('B7', 'dienbien', 2, 'Kết quả nổi bật của chiến dịch Biên giới thu – đông 1950 là', ['Giải phóng khu vực biên giới rộng lớn, mở đường liên lạc quốc tế, chọc thủng Hành lang Đông – Tây', 'Giải phóng toàn bộ Bắc Bộ', 'Buộc Pháp rút khỏi Đông Dương', 'Tiêu diệt tập đoàn cứ điểm Điện Biên Phủ'], 0, 'Chiến dịch giải phóng biên giới, mở đường liên lạc quốc tế, làm phá sản Kế hoạch Rơ-ve.');
  mc('B7', 'dienbien', 2, 'Cuộc tấn công của Pháp lên Việt Bắc thu – đông 1947 nằm trong chiến lược nào?', ['“Đánh nhanh, thắng nhanh”', '“Chiến tranh đặc biệt”', '“Việt Nam hóa chiến tranh”', '“Chiến tranh cục bộ”'], 0, 'Pháp tiến công Việt Bắc nhằm kết thúc nhanh chiến tranh theo chiến lược “đánh nhanh, thắng nhanh”.');
  mc('B7', 'dienbien', 2, 'Nội dung nào đúng với đợt 2 của chiến dịch Điện Biên Phủ (30/3 – 26/4/1954)?', ['Tấn công các cứ điểm phía đông phân khu Trung tâm, tấn công và kiểm soát sân bay Mường Thanh', 'Đồng loạt tấn công phân khu Trung tâm và phân khu Nam', 'Bức hàng cứ điểm Bản Kéo', 'Tấn công cụm cứ điểm Him Lam và đồi Độc Lập'], 0, 'Đợt 2: tấn công các cứ điểm phía đông Trung tâm và kiểm soát sân bay, hạn chế tiếp viện của Pháp.');
  mc('B7', 'dienbien', 2, 'Nội dung nào đúng với đợt 3 của chiến dịch Điện Biên Phủ (1 – 7/5/1954)?', ['Quân ta đồng loạt tấn công phân khu Trung tâm và phân khu Nam', 'Quân ta chỉ tấn công phân khu Bắc', 'Quân ta kiểm soát sân bay Mường Thanh', 'Quân ta bức hàng Bản Kéo'], 0, 'Đợt 3 đồng loạt tấn công phân khu Trung tâm và phân khu Nam, kết thúc bằng thắng lợi hoàn toàn.');
  mc('B7', 'duongloi', 2, 'Nhiệm vụ cơ bản của cách mạng Việt Nam được Đại hội II (2/1951) xác định là', ['Chỉ đánh đuổi đế quốc xâm lược', 'Đánh đuổi đế quốc xâm lược, xóa bỏ tàn tích phong kiến và nửa phong kiến, gây dựng cơ sở cho chủ nghĩa xã hội', 'Xây dựng ngay chủ nghĩa xã hội trên cả nước', 'Chỉ cải cách ruộng đất'], 1, 'Nhiệm vụ gồm phản đế, phản phong kiến và gây dựng cơ sở cho chủ nghĩa xã hội.');
  mc('B7', 'boicanh', 2, 'Khó khăn nào KHÔNG đúng với nước Việt Nam Dân chủ Cộng hòa sau Cách mạng tháng Tám?', ['Chính quyền và lực lượng vũ trang cách mạng còn non trẻ', 'Kinh tế nghèo nàn, lạc hậu, lại bị chiến tranh tàn phá', 'Khoảng sáu vạn quân Nhật còn chờ giải giáp trên đất nước', 'Đã có nền kinh tế vững mạnh và lực lượng vũ trang hùng hậu'], 3, 'Chính quyền non trẻ, kinh tế nghèo nàn là khó khăn; không thể nói ta đã có kinh tế vững mạnh.');
  mc('B7', 'duongloi', 2, 'Câu “Ai có súng dùng súng, ai có gươm dùng gươm, không có gươm thì dùng cuốc, thuổng, gậy gộc” thể hiện điều gì?', ['Chủ trương kháng chiến toàn dân', 'Chủ trương chỉ dựa vào quân đội chính quy', 'Chủ trương chờ viện trợ', 'Chủ trương đánh nhanh thắng nhanh'], 0, 'Câu nói kêu gọi mọi người dân đều tham gia kháng chiến.');
  mc('B7', 'nguyennhan', 2, 'Yếu tố nào tạo nên sức mạnh của hậu phương trong kháng chiến chống Pháp?', ['Hệ thống chính quyền dân chủ nhân dân, mặt trận dân tộc thống nhất, lực lượng vũ trang lớn mạnh, hậu phương rộng lớn, vững chắc', 'Viện trợ của Mỹ', 'Sự ủng hộ của quân Nhật', 'Chính quyền tay sai của Pháp'], 0, 'Chính quyền dân chủ nhân dân, mặt trận thống nhất, lực lượng vũ trang và hậu phương vững chắc là sức mạnh chủ quan.');
  mc('B7', 'ynghia', 2, 'Ý nghĩa quốc tế của thắng lợi trong kháng chiến chống Pháp là', ['Cùng nhân dân Lào, Cam-pu-chia đập tan ách thống trị của Pháp trên bán đảo Đông Dương, góp phần làm tan rã hệ thống thuộc địa', 'Làm sụp đổ chủ nghĩa thực dân mới', 'Chấm dứt Chiến tranh lạnh', 'Làm tan rã hệ thống xã hội chủ nghĩa'], 0, 'Thắng lợi góp phần làm tan rã hệ thống thuộc địa của chủ nghĩa đế quốc và cổ vũ phong trào giải phóng dân tộc.');
  mc('B7', 'ynghia', 2, 'Ý nghĩa đối với cách mạng Việt Nam của thắng lợi kháng chiến chống Pháp là', ['Bảo vệ và phát triển thành quả Cách mạng tháng Tám, đưa cách mạng chuyển sang thời kì mới: miền Bắc giải phóng, tiến lên xây dựng chủ nghĩa xã hội', 'Hoàn thành thống nhất đất nước', 'Chấm dứt mọi hình thức xâm lược nước ngoài', 'Chấm dứt chiến tranh trên cả hai miền'], 0, 'Miền Bắc hoàn toàn giải phóng, chuyển sang xây dựng chủ nghĩa xã hội; miền Nam còn phải tiếp tục đấu tranh.');
  mc('B7', 'dienbien', 2, 'Chiến dịch Việt Bắc thu – đông 1947 có ý nghĩa gì?', ['Là chiến dịch phản công lớn đầu tiên, làm thất bại hoàn toàn chiến lược “đánh nhanh, thắng nhanh” của Pháp', 'Là chiến dịch tiến công lớn đầu tiên của bộ đội chủ lực', 'Buộc Pháp kí Hiệp định Giơ-ne-vơ', 'Giải phóng vùng biên giới Việt – Trung'], 0, 'Việt Bắc 1947 là chiến dịch phản công lớn đầu tiên.');
  mc('B7', 'dienbien', 2, 'Ý nghĩa của chiến dịch Biên giới thu – đông 1950 là', ['Giành thế chủ động trên chiến trường chính (Bắc Bộ), mở ra bước phát triển mới của cuộc kháng chiến', 'Làm thất bại hoàn toàn chiến lược “đánh nhanh, thắng nhanh”', 'Buộc Pháp rút khỏi Đông Dương', 'Kết thúc chiến tranh'], 0, 'Từ đây quân đội ta giành thế chủ động trên chiến trường chính Bắc Bộ.');
  mc('B7', 'dienbien', 2, 'Thắng lợi của chiến dịch Điện Biên Phủ đã', ['Tạo cơ sở cho việc đàm phán và kí Hiệp định Giơ-ne-vơ', 'Làm phá sản Kế hoạch Rơ-ve', 'Giải phóng hoàn toàn miền Nam', 'Kết thúc chiến tranh phá hoại của Mỹ'], 0, 'Điện Biên Phủ tạo cơ sở cho đàm phán và kí Hiệp định Giơ-ne-vơ.');
  mc('B7', 'dienbien', 2, 'Cuộc chiến đấu của nhân dân Nam Bộ năm 1945 có tác dụng gì?', ['Làm thất bại bước đầu âm mưu “đánh nhanh, thắng nhanh”, tạo điều kiện chuẩn bị cho kháng chiến trường kì', 'Giải phóng hoàn toàn Nam Bộ', 'Buộc Pháp công nhận độc lập của Việt Nam', 'Kết thúc chiến tranh ở Đông Dương'], 0, 'Cuộc chiến đấu ở Nam Bộ làm thất bại âm mưu “đánh nhanh, thắng nhanh” của Pháp.');
  mc('B7', 'duongloi', 2, 'Việc Chính phủ ta kí Hiệp định Sơ bộ (6/3/1946) thể hiện điều gì?', ['Thiện chí hòa bình của Việt Nam, dù Pháp sau đó vẫn tìm cách phá hoại', 'Việt Nam từ bỏ chủ quyền', 'Việt Nam chấp nhận Pháp tái chiếm', 'Việt Nam chỉ muốn kéo dài chiến tranh'], 0, 'Chính phủ ta luôn tỏ rõ thiện chí hòa bình nhưng Pháp luôn tìm cách phá hoại.');
  mc('B7', 'dienbien', 2, 'Cuối năm 1950 đến giữa năm 1951, quân đội ta mở các chiến dịch nào?', ['Trần Hưng Đạo, Hoàng Hoa Thám, Quang Trung', 'Hòa Bình, Tây Bắc, Thượng Lào', 'Việt Bắc, Biên giới, Điện Biên Phủ', 'Đường 9, Đường 14, Quảng Trị'], 0, 'Ba chiến dịch: Trần Hưng Đạo (Trung du), Hoàng Hoa Thám (Đường 18), Quang Trung (Hà – Nam – Ninh).');
  // --- Vận dụng ---
  mc('B7', 'vandung', 3, 'Điểm giống nhau của chiến dịch Việt Bắc thu – đông 1947 và Biên giới thu – đông 1950 là', ['Đều làm thất bại âm mưu của Pháp và bảo vệ căn cứ địa Việt Bắc', 'Đều là chiến dịch tiến công lớn đầu tiên của bộ đội chủ lực', 'Đều kết thúc chiến tranh', 'Đều diễn ra ở Tây Bắc'], 0, 'Cả hai chiến dịch đều làm thất bại kế hoạch của Pháp và bảo vệ căn cứ địa Việt Bắc.');
  mc('B7', 'vandung', 3, 'Sắp xếp theo trình tự thời gian: (1) Chiến dịch Việt Bắc; (2) Chiến dịch Biên giới; (3) Chiến dịch Điện Biên Phủ; (4) Lời kêu gọi toàn quốc kháng chiến.', ['(4), (1), (2), (3)', '(1), (4), (2), (3)', '(4), (2), (1), (3)', '(2), (1), (4), (3)'], 0, 'Lời kêu gọi (12/1946) → Việt Bắc (1947) → Biên giới (1950) → Điện Biên Phủ (1954).');
  mc('B7', 'vandung', 3, 'Sắp xếp theo trình tự thời gian: (1) Đại hội II của Đảng; (2) Hiệp định Sơ bộ; (3) Kế hoạch Na-va; (4) Hiệp định Giơ-ne-vơ.', ['(2), (1), (3), (4)', '(1), (2), (3), (4)', '(2), (3), (1), (4)', '(1), (3), (2), (4)'], 0, 'Hiệp định Sơ bộ (3/1946) → Đại hội II (2/1951) → Kế hoạch Na-va (7/1953) → Giơ-ne-vơ (7/1954).');
  mc('B7', 'vandung', 3, 'Việc hàng chục vạn dân công dùng xe đạp thồ phục vụ chiến dịch Điện Biên Phủ chứng tỏ điều gì?', ['Sức mạnh to lớn của hậu phương toàn dân trong kháng chiến', 'Quân đội ta đã có đủ xe cơ giới hiện đại', 'Chiến dịch không cần quân chính quy', 'Pháp không kiểm soát được đường giao thông'], 0, 'Dân công xe đạp thồ thể hiện sức mạnh hậu phương và tinh thần toàn dân kháng chiến.');
  mc('B7', 'vandung', 3, 'Nhận định “Lần đầu tiên trong lịch sử, một nước thuộc địa nhỏ yếu đã đánh thắng một nước thực dân hùng mạnh” (Hồ Chí Minh) nhằm khẳng định', ['Tầm vóc lịch sử và ý nghĩa quốc tế to lớn của thắng lợi trong kháng chiến chống Pháp', 'Việt Nam mạnh hơn Pháp về quân sự', 'Việt Nam không cần sự ủng hộ quốc tế', 'Chiến tranh đã kết thúc trên toàn Đông Dương'], 0, 'Câu nói nhấn mạnh thắng lợi vẻ vang và ý nghĩa với phong trào hòa bình, dân chủ, xã hội chủ nghĩa.');
  mc('B7', 'vandung', 3, 'Điểm chung giữa cuộc chiến đấu ở Nam Bộ (1945) và ở các đô thị phía bắc vĩ tuyến 16 (1946 – 1947) là', ['Đều làm thất bại một bước kế hoạch “đánh nhanh, thắng nhanh”, giành thời gian chuẩn bị kháng chiến lâu dài', 'Đều giải phóng hoàn toàn các thành phố', 'Đều có sự giúp đỡ trực tiếp của quân đội Liên Xô', 'Đều do quân Pháp tiến hành ở Việt Bắc'], 0, 'Cả hai đều giam chân địch, tạo thời gian chuẩn bị cho kháng chiến lâu dài.');
  mc('B7', 'vandung', 3, 'Vì sao nói chiến dịch Điện Biên Phủ có ý nghĩa quyết định đối với kết cục cuộc kháng chiến chống Pháp?', ['Vì nó làm phá sản Kế hoạch Na-va và tạo cơ sở để ta giành thắng lợi trên bàn đàm phán Giơ-ne-vơ', 'Vì sau chiến dịch Pháp mới bắt đầu xâm lược', 'Vì chiến dịch giải phóng hoàn toàn đất nước', 'Vì Mỹ lập tức công nhận độc lập của Việt Nam'], 0, 'Điện Biên Phủ làm phá sản Kế hoạch Na-va, giáng đòn quyết định vào ý chí xâm lược của Pháp.');
  mc('B7', 'vandung', 3, 'Việc mở thông đường liên lạc quốc tế sau chiến dịch Biên giới 1950 có tác dụng gì?', ['Nối liền căn cứ địa Việt Bắc với Trung Quốc, Liên Xô và các nước xã hội chủ nghĩa, thuận lợi tiếp nhận sự giúp đỡ', 'Giúp Pháp tiếp tế cho các cứ điểm', 'Cô lập hoàn toàn Việt Bắc', 'Chấm dứt viện trợ của các nước bạn'], 0, 'Đường liên lạc quốc tế giúp ta nhận được sự ủng hộ, giúp đỡ từ bên ngoài.');
  mc('B7', 'vandung', 3, 'Bài học nào từ kháng chiến chống Pháp vẫn có giá trị đối với sự nghiệp bảo vệ Tổ quốc hiện nay?', ['Kiên định độc lập, tự chủ và phát huy sức mạnh đại đoàn kết toàn dân', 'Chỉ dựa vào viện trợ của nước ngoài', 'Chỉ tập trung phát triển quân sự, bỏ qua kinh tế', 'Tránh mọi hình thức hợp tác quốc tế'], 0, 'Độc lập, tự chủ kết hợp đại đoàn kết toàn dân là bài học còn nguyên giá trị.');
  mc('B7', 'vandung', 3, 'Theo lược đồ diễn biến chiến dịch Điện Biên Phủ, ta tấn công và kiểm soát sân bay Mường Thanh trong đợt nào?', ['Đợt 1', 'Đợt 2', 'Đợt 3', 'Không đợt nào'], 1, 'Đợt 2 (30/3 – 26/4/1954) ta tấn công, kiểm soát sân bay Mường Thanh.');
  mc('B7', 'vandung', 3, 'Nội dung nào thể hiện tính sáng tạo của đường lối kháng chiến chống Pháp?', ['Kết hợp chiến đấu với xây dựng hậu phương, dựa vào sức mình là chính và tranh thủ sự ủng hộ quốc tế', 'Chỉ cầu viện nước ngoài', 'Chờ địch suy yếu rồi mới đánh', 'Từ bỏ lực lượng vũ trang'], 0, 'Đường lối toàn dân, toàn diện, trường kì, tự lực cánh sinh, kết hợp tranh thủ quốc tế rất sáng tạo.');
  mc('B7', 'vandung', 3, 'Nguyên nhân nào được coi là quyết định nhất dẫn đến thắng lợi của cuộc kháng chiến chống Pháp?', ['Sự lãnh đạo của Đảng với đường lối kháng chiến đúng đắn', 'Viện trợ của các nước xã hội chủ nghĩa', 'Sự thất bại nội bộ của Pháp', 'Sự giúp đỡ của nhân dân Pháp'], 0, 'Nguyên nhân chủ quan, trước hết là sự lãnh đạo của Đảng, mang tính quyết định.');
  mc('B7', 'vandung', 3, 'Điểm khác nhau căn bản giữa Kế hoạch Rơ-ve (1949) và Kế hoạch Na-va (1953) là', ['Rơ-ve nhằm khóa chặt biên giới Việt – Trung, Na-va nhằm tìm thắng lợi quân sự quyết định trong 18 tháng', 'Rơ-ve do Mỹ đề ra, Na-va do Pháp đề ra', 'Rơ-ve thành công, Na-va thất bại', 'Rơ-ve diễn ra ở Nam Bộ, Na-va ở Bắc Bộ'], 0, 'Kế hoạch Rơ-ve bị phá sản bởi chiến dịch Biên giới; Kế hoạch Na-va bị phá sản bởi Đông – Xuân 1953 – 1954 và Điện Biên Phủ.');

  /* ====================== BÀI 8 – TRẮC NGHIỆM ====================== */
  // --- Nhận biết ---
  mc('B8', 'boicanh', 1, 'Sau Hiệp định Giơ-ne-vơ, Mỹ thay chân Pháp và dựng lên chính quyền tay sai đứng đầu là', ['Ngô Đình Diệm', 'Nguyễn Văn Thiệu', 'Bảo Đại', 'Dương Văn Minh'], 0, 'Mỹ dựng chính quyền Ngô Đình Diệm ở miền Nam Việt Nam.');
  mc('B8', 'boicanh', 1, 'Âm mưu của Mỹ ở miền Nam Việt Nam sau năm 1954 là', ['Chia cắt Việt Nam, biến miền Nam thành thuộc địa kiểu mới và căn cứ quân sự của Mỹ ở Đông Nam Á', 'Giúp miền Nam xây dựng nền kinh tế độc lập', 'Thực hiện tổng tuyển cử thống nhất đất nước', 'Rút hết quân khỏi Đông Dương'], 0, 'Mỹ muốn chia cắt Việt Nam, biến miền Nam thành thuộc địa kiểu mới và căn cứ quân sự.');
  mc('B8', 'duongloi', 1, 'Nghị quyết Hội nghị Trung ương lần thứ 15 (1/1959) khẳng định nhân dân miền Nam', ['Chỉ có thể đấu tranh chính trị hòa bình', 'Không còn con đường nào khác ngoài con đường sử dụng bạo lực cách mạng', 'Chờ Tổng tuyển cử theo Hiệp định Giơ-ne-vơ', 'Cần nhờ Liên hợp quốc can thiệp'], 1, 'Hội nghị 15 khẳng định con đường bạo lực cách mạng, thổi bùng phong trào Đồng khởi.');
  mc('B8', 'dienbien', 1, 'Cuộc Đồng khởi tiêu biểu nhất trong phong trào Đồng khởi (1959 – 1960) diễn ra ở', ['Vĩnh Thạnh (Bình Định)', 'Trà Bồng (Quảng Ngãi)', 'Bến Tre', 'Bắc Ái (Ninh Thuận)'], 2, 'Cuộc Đồng khởi ở Bến Tre (1/1960) là tiêu biểu, nơi ra đời “Đội quân tóc dài”.');
  mc('B8', 'moc', 1, 'Mặt trận Dân tộc giải phóng miền Nam Việt Nam được thành lập vào ngày', ['20/12/1960', '15/2/1961', '6/6/1969', '27/1/1973'], 0, 'Ngày 20/12/1960 Mặt trận Dân tộc giải phóng miền Nam Việt Nam ra đời.');
  mc('B8', 'moc', 1, 'Đại hội đại biểu toàn quốc lần thứ III của Đảng Lao động Việt Nam được tổ chức vào', ['Tháng 2/1951', 'Tháng 9/1960', 'Tháng 1/1959', 'Tháng 7/1973'], 1, 'Đại hội III họp tháng 9/1960 tại Hà Nội.');
  mc('B8', 'moc', 1, 'Quân Giải phóng miền Nam Việt Nam được thành lập vào ngày', ['15/2/1961', '20/12/1960', '6/6/1969', '30/4/1975'], 0, 'Ngày 15/2/1961 các lực lượng vũ trang cách mạng thống nhất thành Quân Giải phóng miền Nam.');
  mc('B8', 'boicanh', 1, '“Chiến tranh đặc biệt” của Mỹ được thực hiện ở miền Nam Việt Nam trong giai đoạn', ['1954 – 1960', '1961 – 1965', '1965 – 1968', '1969 – 1973'], 1, '“Chiến tranh đặc biệt” diễn ra từ 1961 đến 1965.');
  mc('B8', 'boicanh', 1, 'Kế hoạch nhằm bình định miền Nam trong vòng 18 tháng mà Mỹ đề ra trong “Chiến tranh đặc biệt” là', ['Kế hoạch Rơ-ve', 'Kế hoạch Na-va', 'Kế hoạch Xta-lây – Tay-lo', 'Kế hoạch Giôn-xơn – Mác Na-ma-ra'], 2, 'Mỹ đề ra Kế hoạch Xta-lây – Tay-lo bình định miền Nam trong 18 tháng.');
  mc('B8', 'dienbien', 1, 'Chiến thắng quân sự nào mở ra khả năng đánh bại chiến thuật “trực thăng vận, thiết xa vận” của Mỹ?', ['Ấp Bắc (1/1963)', 'Vạn Tường (8/1965)', 'Bình Giã (1964)', 'Đường 9 – Nam Lào (1971)'], 0, 'Chiến thắng Ấp Bắc (Mỹ Tho, 1/1963).');
  mc('B8', 'dienbien', 1, 'Phong trào “Thi đua Ấp Bắc, giết giặc lập công” dấy lên khắp miền Nam sau chiến thắng nào?', ['Ấp Bắc', 'Vạn Tường', 'Đồng Xoài', 'Phước Long'], 0, 'Sau chiến thắng Ấp Bắc, phong trào thi đua dấy lên khắp miền Nam.');
  mc('B8', 'boicanh', 1, '“Chiến tranh cục bộ” (1965 – 1968) được tiến hành bằng lực lượng nào?', ['Quân đội Sài Gòn là chủ yếu', 'Quân đội Mỹ, quân đồng minh của Mỹ và quân đội Sài Gòn', 'Chỉ quân đồng minh của Mỹ', 'Lực lượng cố vấn Mỹ'], 1, '“Chiến tranh cục bộ” sử dụng quân Mỹ, quân đồng minh và quân đội Sài Gòn.');
  mc('B8', 'dienbien', 1, 'Chiến thắng Vạn Tường (18/8/1965) diễn ra ở tỉnh nào?', ['Quảng Ngãi', 'Mỹ Tho', 'Bình Định', 'Bình Phước'], 0, 'Vạn Tường thuộc Quảng Ngãi, mở ra khả năng đánh thắng Mỹ trong “Chiến tranh cục bộ”.');
  mc('B8', 'dienbien', 1, 'Cuộc Tổng tiến công và nổi dậy năm 1968 của quân dân ta còn được gọi là', ['Xuân Kỉ Dậu', 'Xuân Mậu Thân', 'Xuân Giáp Thìn', 'Xuân Ất Mão'], 1, 'Cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968.');
  mc('B8', 'boicanh', 1, 'Chiến lược “Việt Nam hóa chiến tranh” của Mỹ được thực hiện trong giai đoạn', ['1961 – 1965', '1965 – 1968', '1969 – 1973', '1973 – 1975'], 2, '“Việt Nam hóa chiến tranh” diễn ra từ 1969 đến 1973.');
  mc('B8', 'moc', 1, 'Chính phủ Cách mạng lâm thời Cộng hòa miền Nam Việt Nam ra đời vào ngày', ['6/6/1969', '20/12/1960', '27/1/1973', '30/4/1975'], 0, 'Chính phủ cách mạng lâm thời ra đời ngày 6/6/1969.');
  mc('B8', 'dienbien', 1, 'Chiến dịch Đường 9 – Nam Lào của quân ta diễn ra vào thời gian nào?', ['Tháng 2 – 3/1971', 'Tháng 4/1970', 'Tháng 3/1972', 'Tháng 12/1972'], 0, 'Chiến dịch Đường 9 – Nam Lào diễn ra từ tháng 2 đến tháng 3/1971.');
  mc('B8', 'dienbien', 1, 'Cuộc tập kích chiến lược bằng máy bay B-52 của Mỹ vào Hà Nội, Hải Phòng bị đánh bại sau bao nhiêu ngày đêm?', ['7 ngày đêm', '12 ngày đêm', '30 ngày đêm', '56 ngày đêm'], 1, 'Trận “Điện Biên Phủ trên không” kéo dài 12 ngày đêm (18 – 29/12/1972).');
  mc('B8', 'ynghia', 1, 'Thắng lợi của cuộc chiến đấu bảo vệ Hà Nội, Hải Phòng (12/1972) đã buộc Mỹ', ['Trở lại bàn hội nghị và kí Hiệp định Pa-ri', 'Tăng thêm quân vào miền Nam', 'Tuyên bố mở rộng chiến tranh', 'Rút khỏi Liên hợp quốc'], 0, 'Mỹ phải trở lại bàn hội nghị và kí Hiệp định Pa-ri năm 1973.');
  mc('B8', 'moc', 1, 'Chiến dịch Tây Nguyên (1975) diễn ra từ ngày nào đến ngày nào?', ['10/3 đến 24/3/1975', '26/3 đến 29/3/1975', '1/4 đến 25/4/1975', '26/4 đến 30/4/1975'], 0, 'Chiến dịch Tây Nguyên diễn ra từ ngày 10/3 đến ngày 24/3/1975.');
  mc('B8', 'moc', 1, 'Lá cờ cách mạng tung bay trên nóc Dinh Độc Lập vào lúc nào?', ['11 giờ 30 phút ngày 30/4/1975', '17 giờ ngày 26/4/1975', '8 giờ ngày 29/4/1975', '12 giờ ngày 1/5/1975'], 0, 'Lúc 11 giờ 30 phút ngày 30/4/1975.');
  mc('B8', 'nguyennhan', 1, 'Nguyên nhân hàng đầu dẫn đến thắng lợi của cuộc kháng chiến chống Mỹ, cứu nước là', ['Sự lãnh đạo sáng suốt của Đảng, đứng đầu là Chủ tịch Hồ Chí Minh với đường lối chính trị, quân sự độc lập, tự chủ, đúng đắn, sáng tạo', 'Sự viện trợ của Liên Xô', 'Sự suy yếu của kinh tế Mỹ', 'Phong trào phản chiến ở Mỹ'], 0, 'Đường lối độc lập, tự chủ của Đảng là nguyên nhân quan trọng hàng đầu.');
  mc('B8', 'ynghia', 1, 'Thắng lợi của cuộc kháng chiến chống Mỹ, cứu nước đã kết thúc', ['21 năm chiến đấu chống đế quốc Mỹ xâm lược, 30 năm chiến tranh cách mạng', '9 năm kháng chiến chống Pháp', '5 năm chiến tranh phá hoại', '15 năm đấu tranh chính trị'], 0, 'Thắng lợi kết thúc 21 năm chống Mỹ, 30 năm chiến tranh cách mạng.');
  // --- Thông hiểu ---
  mc('B8', 'dienbien', 2, 'Thành tựu nổi bật của miền Bắc trong giai đoạn 1954 – 1960 là', ['Hoàn thành cải cách ruộng đất với khẩu hiệu “Người cày có ruộng”, khôi phục kinh tế', 'Giải phóng toàn bộ miền Nam', 'Hoàn thành công nghiệp hóa', 'Chấm dứt chiến tranh phá hoại'], 0, 'Miền Bắc hoàn thành cải cách ruộng đất, khôi phục kinh tế, hàn gắn vết thương chiến tranh.');
  mc('B8', 'ynghia', 2, 'Ý nghĩa quan trọng nhất của phong trào Đồng khởi (1959 – 1960) là', ['Giáng đòn nặng nề vào chính sách thực dân mới của Mỹ, chuyển cách mạng miền Nam từ thế giữ gìn lực lượng sang thế tiến công', 'Kết thúc hoàn toàn “Chiến tranh đặc biệt”', 'Giải phóng toàn bộ miền Nam', 'Buộc Mỹ kí Hiệp định Pa-ri'], 0, 'Đồng khởi làm lung lay chính quyền Ngô Đình Diệm và đánh dấu bước nhảy vọt của cách mạng miền Nam.');
  mc('B8', 'duongloi', 2, 'Đại hội III của Đảng (9/1960) xác định vai trò của cách mạng hai miền như thế nào?', ['Cách mạng miền Bắc có vai trò quyết định nhất; cách mạng miền Nam có vai trò quyết định trực tiếp đối với giải phóng miền Nam', 'Cách mạng miền Nam quyết định nhất đối với cả nước', 'Hai miền độc lập, không liên quan', 'Cách mạng miền Bắc chỉ có vai trò hậu phương thứ yếu'], 0, 'Hai cuộc cách mạng có quan hệ mật thiết, thúc đẩy lẫn nhau.');
  mc('B8', 'boicanh', 2, 'Âm mưu cơ bản của “Chiến tranh đặc biệt” là', ['Dùng người Việt đánh người Việt', 'Dùng quân Mỹ trực tiếp chiến đấu', 'Rút dần quân Mỹ để giảm xương máu', 'Mở rộng chiến tranh sang Trung Quốc'], 0, 'Âm mưu cơ bản là dùng người Việt đánh người Việt.');
  mc('B8', 'dienbien', 2, 'Mỹ thực hiện chiến thuật “trực thăng vận, thiết xa vận” trong chiến lược nào?', ['Chiến tranh đặc biệt', 'Chiến tranh cục bộ', 'Việt Nam hóa chiến tranh', 'Chiến tranh phá hoại lần thứ hai'], 0, '“Trực thăng vận, thiết xa vận” là chiến thuật mới trong “Chiến tranh đặc biệt”.');
  mc('B8', 'dienbien', 2, 'Các chiến thắng Bình Giã, An Lão, Ba Gia, Đồng Xoài (1964 – 1965) có ý nghĩa gì?', ['Làm phá sản hoàn toàn chiến lược “Chiến tranh đặc biệt” của Mỹ', 'Làm phá sản “Chiến tranh cục bộ”', 'Làm phá sản “Việt Nam hóa chiến tranh”', 'Buộc Mỹ rút hết quân'], 0, 'Những thắng lợi này làm phá sản “Chiến tranh đặc biệt”, buộc Mỹ chuyển sang “Chiến tranh cục bộ”.');
  mc('B8', 'ynghia', 2, 'Cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968 có ý nghĩa như thế nào?', ['Mở ra bước ngoặt của cuộc kháng chiến chống Mỹ, buộc Mỹ “phi Mỹ hóa” chiến tranh, chấp nhận đàm phán ở Pa-ri', 'Kết thúc hoàn toàn cuộc kháng chiến', 'Làm phá sản chiến lược “Chiến tranh đặc biệt”', 'Giải phóng Sài Gòn'], 0, 'Cuộc Tổng tiến công làm lung lay ý chí xâm lược của Mỹ và mở ra bước ngoặt.');
  mc('B8', 'dienbien', 2, 'Trong hơn 4 năm (từ 8/1964) chống chiến tranh phá hoại lần thứ nhất, miền Bắc đã bắn rơi, phá hủy bao nhiêu máy bay Mỹ?', ['3.243 chiếc', '1.243 chiếc', '5.243 chiếc', '2.143 chiếc'], 0, 'Miền Bắc bắn rơi, phá hủy 3.243 máy bay, trong đó có 6 chiếc B-52.');
  mc('B8', 'dienbien', 2, 'Cuộc Tiến công chiến lược năm 1972 của quân đội ta đã chọc thủng ba phòng tuyến của địch ở', ['Quảng Trị, Tây Nguyên và Đông Nam Bộ', 'Huế, Đà Nẵng và Sài Gòn', 'Bến Tre, Cà Mau và Cần Thơ', 'Đường 9, Đường 14 và Đường 19'], 0, 'Ba phòng tuyến: Quảng Trị, Tây Nguyên và Đông Nam Bộ.');
  mc('B8', 'boicanh', 2, 'Đặc điểm của chiến lược “Việt Nam hóa chiến tranh” là', ['Quân đội Sài Gòn là lực lượng chủ yếu, Mỹ rút dần quân nhưng vẫn viện trợ và chỉ huy qua cố vấn', 'Quân Mỹ tăng cường chiến đấu trực tiếp', 'Chỉ dùng lực lượng biệt kích', 'Chấm dứt viện trợ cho chính quyền Sài Gòn'], 0, 'Quân đội Sài Gòn là chủ yếu, Mỹ giảm xương máu nhưng vẫn do cố vấn Mỹ chỉ huy.');
  mc('B8', 'dienbien', 2, 'Hiệp định Pa-ri (1973) tạo ra thay đổi gì đối với cách mạng Việt Nam?', ['Mỹ phải rút hết quân về nước, so sánh lực lượng thay đổi có lợi cho cách mạng Việt Nam', 'Mỹ được ở lại miền Nam', 'Việt Nam bị chia cắt vĩnh viễn', 'Chính quyền Sài Gòn mạnh lên'], 0, 'Sau Hiệp định, Mỹ rút hết quân; so sánh lực lượng thay đổi có lợi cho ta.');
  mc('B8', 'duongloi', 2, 'Hội nghị Trung ương lần thứ 21 (7/1973) nhấn mạnh điều gì?', ['Tiếp tục con đường bạo lực cách mạng, nắm vững chiến lược tiến công, đấu tranh trên ba mặt trận: quân sự, chính trị, ngoại giao', 'Chỉ đấu tranh chính trị', 'Tạm ngừng chiến đấu chờ Mỹ tôn trọng Hiệp định', 'Chuyển hẳn sang xây dựng kinh tế'], 0, 'Hội nghị 21 nhấn mạnh bạo lực cách mạng và đấu tranh trên ba mặt trận.');
  mc('B8', 'dienbien', 2, 'Cuộc Tổng tiến công và nổi dậy Xuân 1975 trải qua những chiến dịch lớn nào?', ['Tây Nguyên, Huế – Đà Nẵng, giải phóng Sài Gòn – Gia Định (Hồ Chí Minh)', 'Việt Bắc, Biên giới, Điện Biên Phủ', 'Ấp Bắc, Vạn Tường, Đồng Xoài', 'Đường 9, Đường 14, Quảng Trị'], 0, 'Ba chiến dịch lớn: Tây Nguyên, Huế – Đà Nẵng và Hồ Chí Minh.');
  mc('B8', 'dienbien', 2, 'Chiến thắng Đường 14 – Phước Long (cuối 1974, đầu 1975) cho thấy', ['Sức mạnh và khả năng thắng lớn của quân ta, sự suy yếu của quân Sài Gòn, khả năng can thiệp quân sự trở lại của Mỹ rất hạn chế', 'Mỹ sắp quay trở lại bằng quân đội', 'Quân đội Sài Gòn còn rất mạnh', 'Cần hoãn Tổng tiến công'], 0, 'Chiến thắng củng cố quyết tâm mở cuộc Tổng tiến công và nổi dậy.');
  mc('B8', 'nguyennhan', 2, 'Vai trò của hậu phương miền Bắc trong kháng chiến chống Mỹ là', ['Không ngừng lớn mạnh, đáp ứng kịp thời yêu cầu của cuộc chiến đấu ở hai miền', 'Chỉ có vai trò tinh thần', 'Không chi viện cho miền Nam', 'Chỉ phục vụ chiến trường Lào'], 0, 'Hậu phương miền Bắc đáp ứng kịp thời yêu cầu chiến đấu ở hai miền.');
  mc('B8', 'nguyennhan', 2, 'Sự giúp đỡ quốc tế đối với cuộc kháng chiến chống Mỹ thể hiện qua điều nào sau đây?', ['Liên Xô viện trợ kinh tế, kĩ thuật trị giá khoảng 2,1 tỉ rúp và nhiều vũ khí cho Việt Nam (1955 – 1975)', 'Liên Xô trực tiếp đưa quân vào miền Nam', 'Mỹ viện trợ vũ khí cho Việt Nam', 'Các nước phương Tây ủng hộ Việt Nam đánh Mỹ'], 0, 'Trong những năm 1955 – 1975, Liên Xô viện trợ khoảng 2,1 tỉ rúp và nhiều vũ khí, phương tiện.');
  mc('B8', 'ynghia', 2, 'Ý nghĩa đối với dân tộc của thắng lợi kháng chiến chống Mỹ, cứu nước là', ['Kết thúc cuộc cách mạng dân tộc dân chủ nhân dân trên phạm vi cả nước; mở ra kỉ nguyên hòa bình, độc lập, thống nhất, đi lên chủ nghĩa xã hội', 'Chỉ giải phóng miền Nam', 'Kết thúc cuộc chiến tranh chống Pháp', 'Hoàn thành công nghiệp hóa'], 0, 'Cả nước hòa bình, độc lập, thống nhất, đi lên chủ nghĩa xã hội.');
  mc('B8', 'ynghia', 2, 'Ý nghĩa quốc tế của thắng lợi kháng chiến chống Mỹ, cứu nước là', ['Góp phần làm sụp đổ chủ nghĩa thực dân mới, cổ vũ phong trào giải phóng dân tộc và đấu tranh vì hòa bình, dân chủ, chủ nghĩa xã hội', 'Chấm dứt Chiến tranh lạnh', 'Làm tan rã Liên Xô', 'Chỉ có ý nghĩa với Đông Nam Á'], 0, 'Thắng lợi góp phần làm sụp đổ chủ nghĩa thực dân mới và cổ vũ phong trào cách mạng thế giới.');
  mc('B8', 'dienbien', 2, 'Sau Hiệp định Pa-ri, chính quyền Sài Gòn đã', ['Ngang nhiên phá hoại Hiệp định', 'Nghiêm chỉnh thực hiện Hiệp định', 'Tuyên bố giải thể', 'Chuyển giao quyền lực cho Mặt trận Dân tộc giải phóng'], 0, 'Chính quyền Sài Gòn ngang nhiên phá hoại Hiệp định Pa-ri, nên ta tiếp tục đấu tranh.');
  // --- Vận dụng ---
  mc('B8', 'vandung', 3, 'Sắp xếp theo trình tự thời gian: (1) Phong trào Đồng khởi; (2) Chiến thắng Ấp Bắc; (3) Tổng tiến công và nổi dậy Xuân Mậu Thân; (4) Hiệp định Pa-ri.', ['(1), (2), (3), (4)', '(2), (1), (3), (4)', '(1), (3), (2), (4)', '(1), (2), (4), (3)'], 0, 'Đồng khởi (1959 – 1960) → Ấp Bắc (1/1963) → Mậu Thân (1968) → Pa-ri (1973).');
  mc('B8', 'vandung', 3, 'Sắp xếp các chiến lược chiến tranh của Mỹ ở miền Nam theo thứ tự thời gian: (1) Việt Nam hóa chiến tranh; (2) Chiến tranh đặc biệt; (3) Chiến tranh cục bộ.', ['(2), (3), (1)', '(3), (2), (1)', '(2), (1), (3)', '(1), (2), (3)'], 0, 'Chiến tranh đặc biệt (1961 – 1965) → Chiến tranh cục bộ (1965 – 1968) → Việt Nam hóa chiến tranh (1969 – 1973).');
  mc('B8', 'vandung', 3, 'Điểm tương đồng giữa chiến thắng Ấp Bắc (1963) và chiến thắng Vạn Tường (1965) là', ['Đều mở ra khả năng đánh bại một chiến lược chiến tranh của Mỹ ở miền Nam', 'Đều diễn ra ở Quảng Ngãi', 'Đều đánh bại “Việt Nam hóa chiến tranh”', 'Đều do quân đồng minh của Mỹ tiến hành'], 0, 'Ấp Bắc mở ra khả năng đánh bại “Chiến tranh đặc biệt”; Vạn Tường mở ra khả năng đánh thắng Mỹ trong “Chiến tranh cục bộ”.');
  mc('B8', 'vandung', 3, 'Điểm tương đồng giữa chiến thắng “Điện Biên Phủ trên không” (1972) và Điện Biên Phủ (1954) là', ['Đều buộc đối phương phải kí hiệp định chấm dứt chiến tranh', 'Đều diễn ra trong 56 ngày đêm', 'Đều đánh bại Kế hoạch Na-va', 'Đều diễn ra ở Tây Bắc'], 0, 'Điện Biên Phủ dẫn tới Hiệp định Giơ-ne-vơ; “Điện Biên Phủ trên không” dẫn tới Hiệp định Pa-ri.');
  mc('B8', 'vandung', 3, 'Mệnh lệnh “Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa” (7/4/1975) thể hiện điều gì?', ['Quyết tâm nắm bắt thời cơ, hành động nhanh chóng, táo bạo để giải phóng miền Nam', 'Chủ trương đánh chắc, tiến chắc', 'Chủ trương trường kì kháng chiến', 'Chủ trương chờ thời cơ'], 0, 'Mệnh lệnh thúc giục các cánh quân tận dụng thời cơ, thần tốc tiến vào giải phóng miền Nam.');
  mc('B8', 'vandung', 3, 'Nhận định “…một trong những trang chói lọi nhất, một biểu tượng sáng ngời về sự toàn thắng của chủ nghĩa anh hùng cách mạng và trí tuệ con người” nói về', ['Thắng lợi của cuộc kháng chiến chống Mỹ, cứu nước', 'Thắng lợi của Cách mạng tháng Tám', 'Thắng lợi của cuộc kháng chiến chống Pháp', 'Thắng lợi của công cuộc Đổi mới'], 0, 'Đó là đánh giá của Đảng về thắng lợi của cuộc kháng chiến chống Mỹ, cứu nước.');
  mc('B8', 'vandung', 3, 'Điểm khác nhau về lực lượng tiến hành giữa “Chiến tranh cục bộ” và “Việt Nam hóa chiến tranh” là', ['Chiến tranh cục bộ dùng quân Mỹ là chủ yếu, Việt Nam hóa chiến tranh dùng quân đội Sài Gòn là chủ yếu', 'Chiến tranh cục bộ chỉ dùng quân Sài Gòn', 'Cả hai đều chỉ dùng quân Mỹ', 'Cả hai đều chỉ dùng quân Sài Gòn'], 0, 'Lực lượng chủ yếu: quân Mỹ (cục bộ) so với quân Sài Gòn (Việt Nam hóa).');
  mc('B8', 'vandung', 3, 'Vì sao Tổng tiến công và nổi dậy Xuân Mậu Thân 1968 được coi là bước ngoặt của cuộc kháng chiến chống Mỹ?', ['Vì làm lung lay ý chí xâm lược của Mỹ, buộc Mỹ “phi Mỹ hóa” chiến tranh và chấp nhận đàm phán ở Pa-ri', 'Vì kết thúc chiến tranh', 'Vì Mỹ rút hết quân ngay năm 1968', 'Vì miền Nam đã được giải phóng'], 0, 'Cuộc tổng tiến công buộc Mỹ thay đổi chiến lược và chấp nhận đàm phán.');
  mc('B8', 'vandung', 3, 'Việc kết hợp đấu tranh quân sự, chính trị, ngoại giao thể hiện rõ nhất qua sự kiện nào?', ['Từ Tổng tiến công Mậu Thân (1968) đến đàm phán và kí Hiệp định Pa-ri (1973)', 'Chỉ chiến thắng Ấp Bắc', 'Chỉ chiến dịch Tây Nguyên', 'Chỉ phong trào Đồng khởi'], 0, 'Thắng lợi quân sự (Mậu Thân, 12 ngày đêm) đi cùng đấu tranh ngoại giao dẫn tới Hiệp định Pa-ri.');
  mc('B8', 'vandung', 3, 'Việc Đảng đồng thời tiến hành cách mạng xã hội chủ nghĩa ở miền Bắc và cách mạng dân tộc dân chủ nhân dân ở miền Nam thể hiện', ['Đường lối chính trị, quân sự độc lập, tự chủ, đúng đắn và sáng tạo', 'Sự phụ thuộc vào nước ngoài', 'Sự thiếu thống nhất trong lãnh đạo', 'Sự chia rẽ hai miền'], 0, 'Đó là đường lối đồng thời tiến hành hai chiến lược cách mạng ở hai miền.');
  mc('B8', 'vandung', 3, 'Từ phong trào Đồng khởi đến việc thành lập Mặt trận Dân tộc giải phóng miền Nam (1960) cho thấy', ['Cách mạng miền Nam chuyển từ thế giữ gìn lực lượng sang thế tiến công', 'Cách mạng miền Nam đã giành thắng lợi hoàn toàn', 'Mỹ đã rút khỏi miền Nam', 'Cách mạng miền Nam chỉ đấu tranh chính trị'], 0, 'Đồng khởi và sự ra đời của Mặt trận đánh dấu bước phát triển nhảy vọt, chuyển sang thế tiến công.');
  mc('B8', 'vandung', 3, 'Hành động nào thể hiện lòng biết ơn đối với thương binh, liệt sĩ và những người có công trong kháng chiến chống Mỹ?', ['Tham gia chăm sóc nghĩa trang liệt sĩ, thăm hỏi gia đình thương binh, liệt sĩ và các hoạt động đền ơn đáp nghĩa ở địa phương', 'Chỉ nhớ đến vào ngày lễ rồi thôi', 'Không quan tâm vì chiến tranh đã qua', 'Chỉ chia sẻ hình ảnh trên mạng mà không làm gì khác'], 0, 'Biết ơn cần thể hiện bằng hành động thiết thực, tham gia công tác đền ơn đáp nghĩa.');
  mc('B8', 'vandung', 3, 'So với Hiệp định Giơ-ne-vơ (1954), Hiệp định Pa-ri (1973) có điểm mới là', ['Quy định Mỹ phải rút hết quân về nước', 'Pháp rút quân về nước', 'Chia cắt Việt Nam làm hai miền', 'Công nhận chính quyền Sài Gòn là hợp pháp duy nhất'], 0, 'Hiệp định Pa-ri buộc Mỹ rút hết quân về nước, thay đổi so sánh lực lượng có lợi cho cách mạng.');
  mc('B8', 'vandung', 3, 'Thắng lợi ngày 30/4/1975 gắn với bài học nào về nghệ thuật chỉ đạo chiến tranh của Đảng?', ['Kết hợp đúng đắn sức mạnh dân tộc với sức mạnh thời đại', 'Chỉ dựa vào vũ khí hiện đại', 'Chờ viện trợ nước ngoài để quyết định', 'Tách đấu tranh quân sự khỏi đấu tranh chính trị'], 0, 'Đảng kết hợp sức mạnh dân tộc với sức mạnh thời đại và các mặt trận quân sự, chính trị, ngoại giao.');

  /* ====================== BÀI 7 – ĐÚNG / SAI ====================== */
  tf('B7', 1, 'duongloi', 'Lời kêu gọi toàn quốc kháng chiến (19/12/1946): “…Hỡi đồng bào! Chúng ta phải đứng lên! Bất kì đàn ông, đàn bà, bất kì người già, người trẻ, không chia tôn giáo, đảng phái, dân tộc. Hễ là người Việt Nam thì phải đứng lên đánh thực dân Pháp để cứu Tổ quốc. Ai có súng dùng súng. Ai có gươm dùng gươm, không có gươm thì dùng cuốc, thuổng, gậy gộc. Ai cũng phải ra sức chống thực dân Pháp cứu nước…”',
    'Cho đoạn tư liệu sau. Xét tính đúng sai của các nhận định:', [
      ['Văn bản trên là Lời kêu gọi toàn quốc kháng chiến của Chủ tịch Hồ Chí Minh ngày 19/12/1946.', true, 'Đúng. Đây là trích Lời kêu gọi toàn quốc kháng chiến.'],
      ['Lời kêu gọi chỉ hướng tới những người trong quân đội.', false, 'Sai. Lời kêu gọi hướng tới mọi người dân, bất kể giới tính, tuổi tác, tôn giáo, đảng phái, dân tộc.'],
      ['Tư liệu thể hiện đường lối kháng chiến toàn dân.', true, 'Đúng. “Hễ là người Việt Nam thì phải đứng lên đánh thực dân Pháp”.'],
      ['Tư liệu chủ trương chờ viện trợ nước ngoài rồi mới kháng chiến.', false, 'Sai. Tư liệu nhấn mạnh tự lực: không có gươm thì dùng cuốc, thuổng, gậy gộc.'],
    ]);
  tf('B7', 2, 'duongloi', 'Đại hội đại biểu lần thứ II của Đảng (2/1951): “Vậy nhiệm vụ cơ bản của cách mạng Việt Nam là gì? Là: a. Đánh đuổi bọn đế quốc xâm lược, làm cho Việt Nam hoàn toàn thống nhất và độc lập (phản đế); b. Xoá bỏ những di tích phong kiến và nửa phong kiến, làm cho người cày có ruộng, phát triển chế độ dân chủ nhân dân (phản phong kiến); c. Gây dựng cơ sở cho chủ nghĩa xã hội.”',
    'Cho đoạn tư liệu sau. Xét tính đúng sai của các nhận định:', [
      ['Tư liệu nêu nhiệm vụ cơ bản của cách mạng Việt Nam tại Đại hội II (2/1951).', true, 'Đúng.'],
      ['Nhiệm vụ phản đế nhằm đánh đuổi đế quốc xâm lược, giành độc lập, thống nhất.', true, 'Đúng theo nội dung tư liệu.'],
      ['Nhiệm vụ phản phong kiến nhằm xóa bỏ tàn tích phong kiến, làm cho người cày có ruộng.', true, 'Đúng theo nội dung tư liệu.'],
      ['Đại hội chủ trương dừng kháng chiến để xây dựng ngay chủ nghĩa xã hội.', false, 'Sai. Đại hội xác định nhiệm vụ đánh đuổi đế quốc xâm lược trước và chỉ “gây dựng cơ sở” cho chủ nghĩa xã hội.'],
    ]);
  tf('B7', 3, 'ynghia', 'Chủ tịch Hồ Chí Minh nhận định: “Lần đầu tiên trong lịch sử, một nước thuộc địa nhỏ yếu đã đánh thắng một nước thực dân hùng mạnh. Đó là một thắng lợi vẻ vang của nhân dân Việt Nam, đồng thời cũng là một thắng lợi của các lực lượng hoà bình, dân chủ và xã hội chủ nghĩa trên thế giới.”',
    'Cho đoạn tư liệu sau. Xét tính đúng sai của các nhận định:', [
      ['Tư liệu đánh giá thắng lợi của cuộc kháng chiến chống thực dân Pháp.', true, 'Đúng.'],
      ['Thắng lợi chỉ có ý nghĩa đối với nhân dân Việt Nam, không liên quan đến thế giới.', false, 'Sai. Tư liệu khẳng định đó cũng là thắng lợi của lực lượng hòa bình, dân chủ và xã hội chủ nghĩa trên thế giới.'],
      ['Tư liệu khẳng định tầm vóc quốc tế của thắng lợi.', true, 'Đúng.'],
      ['Thắng lợi đã chấm dứt hoàn toàn ách thống trị của thực dân Pháp trên đất nước ta.', true, 'Đúng với diễn biến lịch sử.'],
    ]);
  tf('B7', 1, 'dienbien', 'Chiến dịch Điện Biên Phủ trải qua 56 ngày đêm (13/3 – 7/5/1954) với ba đợt.',
    'Xét tính đúng sai của các nhận định về chiến dịch Điện Biên Phủ:', [
      ['Đợt 1 (13 – 17/3/1954), ta tiến công cụm cứ điểm Him Lam và đồi Độc Lập, bức hàng cứ điểm Bản Kéo.', true, 'Đúng.'],
      ['Đợt 2 (30/3 – 26/4/1954), ta tấn công các cứ điểm phía đông phân khu Trung tâm và kiểm soát sân bay Mường Thanh.', true, 'Đúng.'],
      ['Đợt 3 (1 – 7/5/1954), ta chỉ tấn công phân khu Nam.', false, 'Sai. Đợt 3 ta đồng loạt tấn công cả phân khu Trung tâm và phân khu Nam.'],
      ['Ngày 7/5/1954, tướng Đờ Ca-xtơ-ri cùng toàn bộ Bộ Tham mưu của Pháp đầu hàng.', true, 'Đúng, lúc 17 giờ 30 phút.'],
    ]);
  tf('B7', 2, 'boicanh', 'Sau Cách mạng tháng Tám, nước Việt Nam Dân chủ Cộng hòa đứng trước thế “ngàn cân treo sợi tóc”.',
    'Xét tính đúng sai của các nhận định về bối cảnh Việt Nam:', [
      ['Nhân dân đã giành quyền làm chủ, bước đầu hưởng quyền lợi do chế độ mới mang lại nên đồng lòng ủng hộ cách mạng.', true, 'Đúng, đây là thuận lợi cơ bản.'],
      ['Quân đội các nước đế quốc dưới danh nghĩa Đồng minh kéo vào Việt Nam.', true, 'Đúng.'],
      ['Khi đó trên đất nước không còn quân Nhật.', false, 'Sai. Còn khoảng sáu vạn quân Nhật chờ giải giáp.'],
      ['Chính quyền và lực lượng vũ trang cách mạng còn non trẻ; kinh tế nghèo nàn, lạc hậu, lại bị chiến tranh tàn phá.', true, 'Đúng.'],
    ]);
  tf('B7', 2, 'dienbien', 'Chiến dịch Việt Bắc thu – đông 1947.',
    'Xét tính đúng sai của các nhận định:', [
      ['Chiến dịch diễn ra từ tháng 10 đến tháng 12/1947.', true, 'Đúng.'],
      ['Quân ta bị động, để Pháp chiếm được cơ quan đầu não của cuộc kháng chiến.', false, 'Sai. Cơ quan đầu não được bảo vệ an toàn.'],
      ['Quân ta đẩy lùi quân Pháp khỏi các vị trí như Chợ Đồn, Chợ Rã, Đoan Hùng.', true, 'Đúng.'],
      ['Đây là chiến dịch phản công lớn đầu tiên, làm thất bại hoàn toàn chiến lược “đánh nhanh, thắng nhanh” của Pháp.', true, 'Đúng.'],
    ]);
  tf('B7', 2, 'dienbien', 'Chiến dịch Biên giới thu – đông 1950 diễn ra ở khu vực biên giới Việt – Trung.',
    'Xét tính đúng sai của các nhận định:', [
      ['Quân ta tấn công cứ điểm Đông Khê, chặn đánh quân Pháp trên Đường số 4.', true, 'Đúng.'],
      ['Chiến dịch làm phá sản Kế hoạch Na-va.', false, 'Sai. Chiến dịch làm phá sản Kế hoạch Rơ-ve.'],
      ['Ta chọc thủng Hành lang Đông – Tây, mở đường liên lạc quốc tế.', true, 'Đúng.'],
      ['Là chiến dịch tiến công lớn đầu tiên của bộ đội chủ lực, giành thế chủ động ở chiến trường chính Bắc Bộ.', true, 'Đúng.'],
    ]);
  tf('B7', 1, 'nguyennhan', 'Nguyên nhân thắng lợi của cuộc kháng chiến chống thực dân Pháp (1945 – 1954).',
    'Xét tính đúng sai của các nhận định:', [
      ['Sự lãnh đạo sáng suốt của Đảng, đứng đầu là Chủ tịch Hồ Chí Minh, là nguyên nhân chủ quan hàng đầu.', true, 'Đúng.'],
      ['Sự giúp đỡ của Trung Quốc và Liên Xô là nguyên nhân chủ quan.', false, 'Sai. Đó là nguyên nhân khách quan.'],
      ['Hậu phương rộng lớn, vững chắc về mọi mặt góp phần quan trọng vào thắng lợi.', true, 'Đúng.'],
      ['Liên minh nhân dân Việt – Miên – Lào là nguyên nhân khách quan.', true, 'Đúng.'],
    ]);
  tf('B7', 1, 'ynghia', 'Ý nghĩa lịch sử của cuộc kháng chiến chống thực dân Pháp (1945 – 1954).',
    'Xét tính đúng sai của các nhận định:', [
      ['Chấm dứt chiến tranh xâm lược và ách thống trị của thực dân Pháp trên đất nước ta.', true, 'Đúng.'],
      ['Miền Bắc được giải phóng, tiến lên xây dựng chủ nghĩa xã hội.', true, 'Đúng.'],
      ['Cùng nhân dân Lào, Cam-pu-chia đập tan ách thống trị của Pháp trên toàn bán đảo Đông Dương.', true, 'Đúng.'],
      ['Chỉ cổ vũ phong trào giải phóng dân tộc ở châu Âu.', false, 'Sai. Cổ vũ phong trào ở châu Á, châu Phi và khu vực Mỹ Latinh.'],
    ]);
  tf('B7', 2, 'dienbien', 'Cuộc chiến đấu ở các đô thị phía bắc vĩ tuyến 16 (19/12/1946 – 17/2/1947).',
    'Xét tính đúng sai của các nhận định:', [
      ['Cuộc chiến đấu diễn ra ở Nam Định, Vinh, đặc biệt ở Hà Nội.', true, 'Đúng.'],
      ['Ở Hà Nội có các trận đánh ác liệt tại Bắc Bộ Phủ, Bưu điện Bờ Hồ, ga Hàng Cỏ, phố Khâm Thiên.', true, 'Đúng.'],
      ['Ta đã tiêu diệt hoàn toàn quân Pháp ở các thành phố.', false, 'Sai. Ta giam chân địch rồi chủ động rút lui an toàn.'],
      ['Lực lượng chủ lực rút ra căn cứ an toàn, có thêm thời gian chuẩn bị kháng chiến lâu dài.', true, 'Đúng.'],
    ]);
  tf('B7', 2, 'duongloi', 'Giai đoạn 1951 – 1953 của cuộc kháng chiến chống Pháp.',
    'Xét tính đúng sai của các nhận định:', [
      ['Tháng 2/1951, Đại hội II quyết định đổi tên Đảng thành Đảng Lao động Việt Nam.', true, 'Đúng.'],
      ['Mặt trận Liên Việt ra đời ngày 3/3/1951.', true, 'Đúng.'],
      ['Năm 1952, cuộc vận động sản xuất và tiết kiệm trở thành phong trào quần chúng sôi nổi.', true, 'Đúng.'],
      ['Tháng 12/1953, Quốc hội thông qua Luật Cải cách ruộng đất và tiến hành cải cách ruộng đất ở vùng tạm chiếm.', false, 'Sai. Cải cách ruộng đất tiến hành ở vùng tự do.'],
    ]);
  tf('B7', 1, 'boicanh', 'Kế hoạch Na-va của thực dân Pháp.',
    'Xét tính đúng sai của các nhận định:', [
      ['Được sự thỏa thuận của Mỹ, Pháp đề ra Kế hoạch Na-va vào tháng 7/1953.', true, 'Đúng.'],
      ['Pháp hi vọng trong 18 tháng giành thắng lợi quân sự quyết định để kết thúc chiến tranh trong danh dự.', true, 'Đúng.'],
      ['Cuộc Tiến công chiến lược Đông – Xuân 1953 – 1954 làm phá sản bước đầu kế hoạch này.', true, 'Đúng.'],
      ['Kế hoạch bị phá sản hoàn toàn ngay từ năm 1950.', false, 'Sai. Kế hoạch ra đời năm 1953 nên không thể phá sản từ 1950.'],
    ]);
  tf('B7', 2, 'ynghia', 'Hiệp định Giơ-ne-vơ về Đông Dương (21/7/1954).',
    'Xét tính đúng sai của các nhận định:', [
      ['Hiệp định được kí ngày 21/7/1954.', true, 'Đúng.'],
      ['Hiệp định chấm dứt chiến tranh, lập lại hòa bình ở Đông Dương.', true, 'Đúng.'],
      ['Sau hiệp định, Pháp buộc phải rút quân về nước.', true, 'Đúng.'],
      ['Sau hiệp định, miền Nam hoàn toàn được giải phóng.', false, 'Sai. Sau hiệp định miền Bắc được hoàn toàn giải phóng; miền Nam còn phải tiếp tục đấu tranh.'],
    ]);
  tf('B7', 2, 'moc', 'Hiệp ước Hoa – Pháp và Hiệp định Sơ bộ (năm 1946).',
    'Xét tính đúng sai của các nhận định:', [
      ['Hiệp ước Hoa – Pháp được kí ngày 28/2/1946 giữa Pháp và Chính phủ Trung Hoa Dân quốc.', true, 'Đúng.'],
      ['Hiệp định Sơ bộ do Chủ tịch Hồ Chí Minh thay mặt Chính phủ Việt Nam kí ngày 6/3/1946.', true, 'Đúng.'],
      ['Sau khi kí, thực dân Pháp tôn trọng đầy đủ các điều đã kí.', false, 'Sai. Pháp luôn tìm cách phá hoại những điều đã kí, đẩy mạnh xâm lược.'],
      ['Chính phủ Việt Nam luôn tỏ rõ thiện chí hòa bình.', true, 'Đúng.'],
    ]);
  tf('B7', 2, 'dienbien', 'Cuộc chiến đấu của nhân dân Nam Bộ chống Pháp xâm lược trở lại (1945).',
    'Xét tính đúng sai của các nhận định:', [
      ['Ngày 2/9/1945, Pháp xả súng vào cuộc mít tinh mừng độc lập ở Sài Gòn – Chợ Lớn.', true, 'Đúng.'],
      ['Rạng sáng 23/9/1945, Pháp đánh úp trụ sở Ủy ban hành chính Nam Bộ, mở đầu chiến tranh xâm lược lần thứ hai.', true, 'Đúng.'],
      ['Ủy ban kháng chiến Nam Bộ được thành lập ngày 23/9/1945.', true, 'Đúng.'],
      ['Cuộc chiến đấu ở Nam Bộ làm thất bại hoàn toàn kế hoạch xâm lược của Pháp trên cả nước.', false, 'Sai. Chỉ làm thất bại bước đầu âm mưu “đánh nhanh, thắng nhanh”.'],
    ]);
  tf('B7', 1, 'dienbien', 'Một số chiến dịch tiến công của quân đội ta giai đoạn 1950 – 1953.',
    'Xét tính đúng sai của các nhận định:', [
      ['Từ cuối 1950 đến giữa 1951: các chiến dịch Trần Hưng Đạo, Hoàng Hoa Thám, Quang Trung.', true, 'Đúng.'],
      ['Chiến dịch Hòa Bình diễn ra vào đông – xuân 1951 – 1952.', true, 'Đúng.'],
      ['Chiến dịch Tây Bắc diễn ra vào thu – đông 1952.', true, 'Đúng.'],
      ['Chiến dịch Thượng Lào diễn ra vào xuân – hè 1951.', false, 'Sai. Chiến dịch Thượng Lào diễn ra vào xuân – hè 1953.'],
    ]);

  /* ====================== BÀI 8 – ĐÚNG / SAI ====================== */
  tf('B8', 3, 'duongloi', 'Mệnh lệnh ngày 7/4/1975: “Đại tướng Võ Nguyên Giáp thay mặt Quân ủy Trung ương và Bộ Tổng Tư lệnh ra mệnh lệnh cho các cánh quân: Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa, tranh thủ từng giờ, từng phút xốc tới mặt trận, giải phóng miền Nam. Quyết chiến và toàn thắng…”',
    'Cho đoạn tư liệu sau. Xét tính đúng sai của các nhận định:', [
      ['Mệnh lệnh nhằm thúc giục các cánh quân nhanh chóng tiến vào giải phóng miền Nam.', true, 'Đúng.'],
      ['Nội dung nhấn mạnh phương châm thần tốc, táo bạo.', true, 'Đúng.'],
      ['Mệnh lệnh được ban ra sau khi chiến dịch Hồ Chí Minh đã kết thúc.', false, 'Sai. Mệnh lệnh ngày 7/4/1975, trước khi chiến dịch Hồ Chí Minh mở màn.'],
      ['Quân ủy Trung ương và Bộ Tổng Tư lệnh là cơ quan ra mệnh lệnh.', true, 'Đúng.'],
    ]);
  tf('B8', 3, 'ynghia', 'Văn kiện Đảng: “Năm tháng sẽ trôi qua nhưng thắng lợi của nhân dân ta trong sự nghiệp kháng chiến chống Mỹ, cứu nước mãi mãi được ghi vào lịch sử dân tộc ta như một trong những trang chói lọi nhất, một biểu tượng sáng ngời về sự toàn thắng của chủ nghĩa anh hùng cách mạng và trí tuệ con người và đi vào lịch sử thế giới như một chiến công vĩ đại của thế kỉ XX…”',
    'Cho đoạn tư liệu sau. Xét tính đúng sai của các nhận định:', [
      ['Tư liệu đánh giá cao ý nghĩa dân tộc và quốc tế của thắng lợi.', true, 'Đúng.'],
      ['Thắng lợi chỉ có giá trị trong khuôn khổ khu vực Đông Nam Á.', false, 'Sai. Tư liệu khẳng định thắng lợi đi vào lịch sử thế giới.'],
      ['Tư liệu khẳng định chủ nghĩa anh hùng cách mạng và trí tuệ con người.', true, 'Đúng.'],
      ['Thắng lợi được coi là một chiến công vĩ đại của thế kỉ XX.', true, 'Đúng.'],
    ]);
  tf('B8', 1, 'boicanh', 'Bối cảnh lịch sử của cuộc kháng chiến chống Mỹ, cứu nước (1954 – 1975).',
    'Xét tính đúng sai của các nhận định:', [
      ['Sau Hiệp định Giơ-ne-vơ, Mỹ thay chân Pháp, dựng lên chính quyền Ngô Đình Diệm.', true, 'Đúng.'],
      ['Miền Bắc hoàn toàn giải phóng, tiến lên xây dựng chủ nghĩa xã hội.', true, 'Đúng.'],
      ['Miền Nam phải tiếp tục cách mạng dân tộc dân chủ nhân dân, thực hiện hòa bình, thống nhất nước nhà.', true, 'Đúng.'],
      ['Chiến tranh lạnh không có tác động gì đến cuộc kháng chiến của nhân dân Việt Nam.', false, 'Sai. Sự đối đầu hai phe và Chiến tranh lạnh tác động rất lớn.'],
    ]);
  tf('B8', 2, 'dienbien', 'Cách mạng hai miền giai đoạn 1954 – 1960.',
    'Xét tính đúng sai của các nhận định:', [
      ['Miền Bắc hoàn thành cải cách ruộng đất với khẩu hiệu “Người cày có ruộng”.', true, 'Đúng.'],
      ['Hội nghị Trung ương lần thứ 15 (1/1959) khẳng định con đường bạo lực cách mạng ở miền Nam.', true, 'Đúng.'],
      ['Phong trào Đồng khởi chỉ diễn ra ở Bến Tre.', false, 'Sai. Phong trào bắt đầu từ Vĩnh Thạnh, Bắc Ái, Trà Bồng… rồi lan khắp miền Nam; Bến Tre là tiêu biểu.'],
      ['Thắng lợi Đồng khởi dẫn đến việc thành lập Mặt trận Dân tộc giải phóng miền Nam Việt Nam ngày 20/12/1960.', true, 'Đúng.'],
    ]);
  tf('B8', 2, 'dienbien', 'Giai đoạn 1961 – 1965.',
    'Xét tính đúng sai của các nhận định:', [
      ['Đại hội III của Đảng họp tháng 9/1960 tại Hà Nội.', true, 'Đúng.'],
      ['Ngày 15/2/1961, các lực lượng vũ trang thống nhất thành Quân Giải phóng miền Nam.', true, 'Đúng.'],
      ['Âm mưu cơ bản của “Chiến tranh đặc biệt” là dùng người Việt đánh người Việt.', true, 'Đúng.'],
      ['Kế hoạch Xta-lây – Tay-lo nhằm bình định miền Nam trong vòng 5 năm.', false, 'Sai. Kế hoạch này nhằm bình định miền Nam trong vòng 18 tháng.'],
    ]);
  tf('B8', 2, 'dienbien', 'Chiến thắng Ấp Bắc (Mỹ Tho, 1/1963).',
    'Xét tính đúng sai của các nhận định:', [
      ['Chiến thắng Ấp Bắc diễn ra tại Mỹ Tho vào tháng 1/1963.', true, 'Đúng.'],
      ['Chiến thắng mở ra khả năng đánh bại chiến thuật “trực thăng vận, thiết xa vận”.', true, 'Đúng.'],
      ['Sau chiến thắng, phong trào “Thi đua Ấp Bắc, giết giặc lập công” dấy lên khắp miền Nam.', true, 'Đúng.'],
      ['Chiến thắng này chứng tỏ ta không thể đánh bại “Chiến tranh đặc biệt”.', false, 'Sai. Ấp Bắc chứng minh ta có thể đánh bại “Chiến tranh đặc biệt”.'],
    ]);
  tf('B8', 2, 'dienbien', 'Chiến lược “Chiến tranh cục bộ” (1965 – 1968).',
    'Xét tính đúng sai của các nhận định:', [
      ['Bắt đầu từ giữa năm 1965, tiến hành bằng quân Mỹ, quân đồng minh và quân Sài Gòn.', true, 'Đúng.'],
      ['Chiến thắng Vạn Tường (18/8/1965) mở ra khả năng đánh thắng Mỹ trong “Chiến tranh cục bộ”.', true, 'Đúng.'],
      ['Cuộc Tổng tiến công Xuân Mậu Thân 1968 buộc Mỹ phải “phi Mỹ hóa” chiến tranh.', true, 'Đúng.'],
      ['Sau Mậu Thân, Mỹ mở rộng ném bom miền Bắc không điều kiện.', false, 'Sai. Mỹ buộc phải chấm dứt không điều kiện chiến tranh phá hoại miền Bắc.'],
    ]);
  tf('B8', 3, 'dienbien', 'Trong hơn 4 năm (1964 – 1968), miền Bắc bắn rơi, phá hủy 3.243 máy bay Mỹ, trong đó có 6 máy bay B-52, bắn cháy và chìm 143 tàu chiến. Hơn 30 vạn cán bộ, chiến sĩ cùng hàng chục vạn tấn vũ khí… từ miền Bắc chuyển vào miền Nam, tăng gấp 10 lần so với giai đoạn trước.',
    'Cho đoạn tư liệu sau. Xét tính đúng sai của các nhận định:', [
      ['Miền Bắc bắn rơi, phá hủy 3.243 máy bay Mỹ trong thời gian này.', true, 'Đúng.'],
      ['Trong số đó có 6 máy bay B-52.', true, 'Đúng.'],
      ['Số cán bộ, chiến sĩ chi viện vào miền Nam giảm so với giai đoạn trước.', false, 'Sai. Tăng gấp 10 lần.'],
      ['Miền Bắc vừa chiến đấu chống chiến tranh phá hoại, vừa phát triển kinh tế – xã hội và làm nghĩa vụ hậu phương.', true, 'Đúng.'],
    ]);
  tf('B8', 2, 'dienbien', 'Chiến lược “Việt Nam hóa chiến tranh” (1969 – 1973).',
    'Xét tính đúng sai của các nhận định:', [
      ['Chiến lược được thực hiện trong những năm 1969 – 1973.', true, 'Đúng.'],
      ['Quân đội Sài Gòn là lực lượng chủ yếu, có sự phối hợp hỏa lực, không quân, hậu cần của Mỹ.', true, 'Đúng.'],
      ['Ngày 6/6/1969, Chính phủ cách mạng lâm thời Cộng hòa miền Nam Việt Nam ra đời.', true, 'Đúng.'],
      ['Mỹ tăng quân ồ ạt để trực tiếp tham chiến trong chiến lược này.', false, 'Sai. Mỹ rút dần quân để giảm xương máu.'],
    ]);
  tf('B8', 2, 'dienbien', 'Chiến thắng của nhân dân ba nước Đông Dương giai đoạn 1970 – 1972.',
    'Xét tính đúng sai của các nhận định:', [
      ['Tháng 4/1970, Hội nghị cấp cao ba nước Việt Nam – Lào – Cam-pu-chia được tổ chức.', true, 'Đúng.'],
      ['Từ 30/4 đến 30/6/1970, quân ta đập tan cuộc hành quân xâm lược của 10 vạn quân Mỹ và quân Sài Gòn.', true, 'Đúng.'],
      ['Chiến dịch Đường 9 – Nam Lào diễn ra vào tháng 2 – 3/1971.', true, 'Đúng.'],
      ['Cuộc Tiến công chiến lược 1972 mở đầu ở Cà Mau.', false, 'Sai. Cuộc tiến công mở đầu ở Quảng Trị rồi phát triển rộng khắp.'],
    ]);
  tf('B8', 1, 'dienbien', 'Cuộc chiến đấu bảo vệ Hà Nội, Hải Phòng cuối năm 1972.',
    'Xét tính đúng sai của các nhận định:', [
      ['Diễn ra trong 12 ngày đêm, từ 18 đến 29/12/1972.', true, 'Đúng.'],
      ['Mỹ dùng máy bay B-52 tập kích chiến lược vào Hà Nội, Hải Phòng.', true, 'Đúng.'],
      ['Thắng lợi được coi là một trận “Điện Biên Phủ trên không”.', true, 'Đúng.'],
      ['Sau thất bại, Mỹ vẫn từ chối trở lại bàn đàm phán.', false, 'Sai. Mỹ buộc phải trở lại bàn hội nghị và kí Hiệp định Pa-ri.'],
    ]);
  tf('B8', 2, 'dienbien', 'Giai đoạn 1973 – 1974.',
    'Xét tính đúng sai của các nhận định:', [
      ['Hiệp định Pa-ri (1973) buộc Mỹ phải rút hết quân về nước.', true, 'Đúng.'],
      ['Hội nghị Trung ương lần thứ 21 (7/1973) nhấn mạnh tiếp tục con đường bạo lực cách mạng.', true, 'Đúng.'],
      ['Chính quyền Sài Gòn nghiêm chỉnh thực hiện Hiệp định Pa-ri.', false, 'Sai. Chính quyền Sài Gòn ngang nhiên phá hoại Hiệp định.'],
      ['Trong hai năm 1973 – 1974, miền Bắc chi viện cho các chiến trường gần 20 vạn bộ đội.', true, 'Đúng.'],
    ]);
  tf('B8', 1, 'dienbien', 'Cuộc Tổng tiến công và nổi dậy Xuân 1975.',
    'Xét tính đúng sai của các nhận định:', [
      ['Trải qua ba chiến dịch lớn: Tây Nguyên, Huế – Đà Nẵng, giải phóng Sài Gòn – Gia Định.', true, 'Đúng.'],
      ['Chiến dịch Tây Nguyên diễn ra từ 10/3 đến 24/3/1975.', true, 'Đúng.'],
      ['Huế được giải phóng ngày 26/3, Đà Nẵng ngày 29/3/1975.', true, 'Đúng.'],
      ['Chiến dịch Hồ Chí Minh mở màn trước chiến dịch Tây Nguyên.', false, 'Sai. Chiến dịch Tây Nguyên mở màn trước.'],
    ]);
  tf('B8', 2, 'moc', 'Chiến dịch Hồ Chí Minh lịch sử (4/1975).',
    'Xét tính đúng sai của các nhận định:', [
      ['Lúc 5 giờ chiều ngày 26/4/1975, năm cánh quân cùng tiến vào trung tâm thành phố.', true, 'Đúng.'],
      ['Lúc 11 giờ 30 phút ngày 30/4/1975, lá cờ cách mạng tung bay trên nóc Dinh Độc Lập.', true, 'Đúng.'],
      ['Trước đó, quân ta đã tiêu diệt căn cứ phòng thủ Xuân Lộc và Phan Rang.', true, 'Đúng.'],
      ['Chiến dịch Hồ Chí Minh kết thúc vào giữa tháng 4/1975.', false, 'Sai. Chiến dịch kết thúc ngày 30/4/1975.'],
    ]);
  tf('B8', 1, 'nguyennhan', 'Nguyên nhân thắng lợi của cuộc kháng chiến chống Mỹ, cứu nước.',
    'Xét tính đúng sai của các nhận định:', [
      ['Sự lãnh đạo sáng suốt của Đảng, đứng đầu là Chủ tịch Hồ Chí Minh, là nhân tố hàng đầu.', true, 'Đúng.'],
      ['Nghệ thuật chiến tranh nhân dân phát triển không ngừng, kết hợp đấu tranh quân sự – chính trị – ngoại giao.', true, 'Đúng.'],
      ['Trong những năm 1955 – 1975, Liên Xô viện trợ khoảng 2,1 tỉ rúp và nhiều vũ khí cho Việt Nam.', true, 'Đúng.'],
      ['Thắng lợi hoàn toàn do Mỹ tự rút lui, không phụ thuộc vào sức mạnh của ta.', false, 'Sai. Thắng lợi có được nhờ đường lối đúng đắn, sức mạnh toàn dân tộc và sự ủng hộ quốc tế.'],
    ]);
  tf('B8', 1, 'ynghia', 'Ý nghĩa lịch sử của cuộc kháng chiến chống Mỹ, cứu nước.',
    'Xét tính đúng sai của các nhận định:', [
      ['Kết thúc 21 năm chiến đấu chống đế quốc Mỹ xâm lược, 30 năm chiến tranh cách mạng.', true, 'Đúng.'],
      ['Chấm dứt ách thống trị của chủ nghĩa đế quốc trên đất nước Việt Nam.', true, 'Đúng.'],
      ['Mở ra kỉ nguyên cả nước hòa bình, độc lập, thống nhất, đi lên chủ nghĩa xã hội.', true, 'Đúng.'],
      ['Chỉ có ý nghĩa với khu vực Đông Nam Á, không ảnh hưởng đến thế giới.', false, 'Sai. Thắng lợi góp phần làm sụp đổ chủ nghĩa thực dân mới và cổ vũ phong trào giải phóng dân tộc thế giới.'],
    ]);

  SBS.questions = { MC, TF };
})();
