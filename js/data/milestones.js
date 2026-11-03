/* Các mốc sự kiện + câu hỏi của AI cho từng mốc */
(function () {
  'use strict';
  const SBS = window.SBS;
  /* m(id, era, k, date, title, summary, meaning, topic, kw, [câu hỏi, 4 đáp án, chỉ số đúng, giải thích], battle) */
  const L = [];
  const m = (id, era, k, date, title, summary, meaning, topic, kw, q, battle) => L.push({ id, era, k, date, title, summary, meaning, topic, kw, q: { q: q[0], o: q[1], a: q[2], why: q[3] }, battle });

  /* ======== KHÁNG CHIẾN CHỐNG THỰC DÂN PHÁP (1945 – 1954) ======== */
  m('m01', 'phap', 19450902, '2/9/1945', 'Pháp xả súng vào cuộc mít tinh ở Sài Gòn',
    'Ngày 2 tháng 9 năm 1945, trong khi nhân dân Sài Gòn – Chợ Lớn tổ chức mít tinh chào mừng ngày độc lập, quân Pháp đã bất ngờ xả súng vào đồng bào ta.',
    'Đây là hành động khiêu khích đầu tiên của thực dân Pháp khi trở lại xâm lược Việt Nam.', 'dienbien', ['phap', 'sai gon', 'mit tinh', 'doc lap'],
    ['Sự kiện ngày 2/9/1945 ở Sài Gòn – Chợ Lớn cho thấy điều gì?', ['Pháp chấp nhận công nhận nền độc lập của Việt Nam', 'Thực dân Pháp bắt đầu hành động khiêu khích, quay lại xâm lược', 'Quân Nhật đang giải giáp tại Sài Gòn', 'Nhân dân Nam Bộ đã giành thắng lợi hoàn toàn'], 1, 'Quân Pháp xả súng vào cuộc mít tinh chào mừng độc lập, mở đầu cho âm mưu xâm lược trở lại.']);

  m('m02', 'phap', 19450923, '23/9/1945', 'Pháp đánh úp Sài Gòn – Ủy ban kháng chiến Nam Bộ ra đời',
    'Đêm ngày 22, rạng sáng ngày 23 tháng 9 năm 1945, thực dân Pháp đánh úp trụ sở Ủy ban hành chính Nam Bộ và cơ quan tự vệ thành phố Sài Gòn, mở đầu cuộc chiến tranh xâm lược Việt Nam lần thứ hai. Ngay ngày 23 tháng 9, Ủy ban kháng chiến Nam Bộ được thành lập; quân dân Nam Bộ củng cố lực lượng vũ trang, kìm chân quân Pháp trong các thành phố, thị xã phía nam vĩ tuyến 16.',
    'Cuộc chiến đấu ở Nam Bộ làm thất bại âm mưu đánh nhanh, thắng nhanh của Pháp, tạo điều kiện cho cả nước chuẩn bị lực lượng kháng chiến trường kì.', 'dienbien', ['nam bo', 'kháng chiến', 'ủy ban kháng chiến', 'đánh nhanh thắng nhanh'],
    ['Cuộc kháng chiến ở Nam Bộ năm 1945 có ý nghĩa gì quan trọng?', ['Kết thúc chiến tranh ngay trong năm 1945', 'Làm thất bại bước đầu âm mưu “đánh nhanh, thắng nhanh” của Pháp', 'Giải phóng hoàn toàn miền Nam', 'Buộc Pháp kí Hiệp định Giơ-ne-vơ'], 1, 'Chiến đấu ở Nam Bộ làm thất bại âm mưu “đánh nhanh, thắng nhanh”, tạo điều kiện chuẩn bị cho kháng chiến lâu dài.']);

  m('m03', 'phap', 19460228, '28/2/1946', 'Hiệp ước Hoa – Pháp',
    'Ngày 28 tháng 2 năm 1946, Pháp và Chính phủ Trung Hoa Dân quốc kí Hiệp ước Hoa – Pháp, tạo điều kiện cho Pháp đưa quân ra miền Bắc.',
    'Tình thế buộc Chính phủ ta phải có đối sách khôn khéo để giữ hòa bình, chuẩn bị lực lượng.', 'boicanh', ['hoa phap', 'trung hoa dan quoc', '1946'],
    ['Hiệp ước Hoa – Pháp (28/2/1946) được kí giữa các bên nào?', ['Việt Nam và Pháp', 'Pháp và Chính phủ Trung Hoa Dân quốc', 'Việt Nam và Trung Hoa Dân quốc', 'Pháp và Liên Xô'], 1, 'Đây là hiệp ước giữa thực dân Pháp và Chính phủ Trung Hoa Dân quốc.']);

  m('m04', 'phap', 19460306, '6/3/1946', 'Hiệp định Sơ bộ Việt – Pháp',
    'Ngày 6 tháng 3 năm 1946, Chủ tịch Hồ Chí Minh thay mặt Chính phủ Việt Nam Dân chủ Cộng hòa kí với Pháp Hiệp định Sơ bộ. Chính phủ Việt Nam luôn tỏ rõ thiện chí hòa bình, nhưng thực dân Pháp luôn tìm cách phá hoại những điều đã kí kết, đẩy mạnh xâm lược cả nước ta.',
    'Thể hiện chủ trương hòa hoãn, tranh thủ thời gian chuẩn bị kháng chiến, đồng thời vạch rõ dã tâm xâm lược của Pháp.', 'duongloi', ['so bo', 'hoa binh', 'thien chi', 'ho chi minh'],
    ['Ai thay mặt Chính phủ Việt Nam Dân chủ Cộng hòa kí Hiệp định Sơ bộ ngày 6/3/1946?', ['Võ Nguyên Giáp', 'Chủ tịch Hồ Chí Minh', 'Phạm Văn Đồng', 'Trường Chinh'], 1, 'Chủ tịch Hồ Chí Minh thay mặt Chính phủ kí Hiệp định Sơ bộ với Pháp.']);

  m('m05', 'phap', 19461219, '19/12/1946', 'Lời kêu gọi toàn quốc kháng chiến',
    'Trước việc thực dân Pháp phá hoại những điều đã kí và đẩy mạnh xâm lược, ngày 19 tháng 12 năm 1946, Chủ tịch Hồ Chí Minh ra Lời kêu gọi toàn quốc kháng chiến: “Ai có súng dùng súng, ai có gươm dùng gươm, không có gươm thì dùng cuốc, thuổng, gậy gộc”. Đường lối kháng chiến là toàn dân, toàn diện, trường kì, tự lực cánh sinh và tranh thủ sự ủng hộ của quốc tế.',
    'Mở đầu cuộc kháng chiến toàn quốc chống thực dân Pháp xâm lược.', 'duongloi', ['loi keu goi', 'toan quoc khang chien', 'toan dan toan dien truong ki'],
    ['Đường lối kháng chiến chống Pháp của Đảng ta là gì?', ['Chỉ dựa vào quân đội chính quy', 'Toàn dân, toàn diện, trường kì, tự lực cánh sinh và tranh thủ sự ủng hộ quốc tế', 'Chờ viện trợ nước ngoài rồi mới tiến công', 'Đánh nhanh, thắng nhanh'], 1, 'Đó là đường lối kháng chiến toàn dân, toàn diện, trường kì, tự lực cánh sinh, tranh thủ sự ủng hộ của quốc tế.']);

  m('m06', 'phap', 19461220, '19/12/1946 đến 17/2/1947', 'Chiến đấu ở các đô thị phía bắc vĩ tuyến 16',
    'Từ ngày 19 tháng 12 năm 1946 đến ngày 17 tháng 2 năm 1947, quân dân ta chiến đấu ở các đô thị như Nam Định, Vinh, và đặc biệt ở Hà Nội với những trận đánh ác liệt tại khu vực Bắc Bộ Phủ, Bưu điện Bờ Hồ, ga Hàng Cỏ, phố Khâm Thiên. Ta đã giam chân quân Pháp ở Hà Nội, lực lượng chủ lực chủ động rút lui an toàn ra căn cứ kháng chiến.',
    'Làm thất bại một bước kế hoạch “đánh nhanh, thắng nhanh”; có thêm thời gian di chuyển cơ quan kháng chiến, cơ sở vật chất lên chiến khu; củng cố niềm tin của nhân dân.', 'dienbien', ['do thi', 'ha noi', 'bac bo phu', 'vi tuyen 16'],
    ['Kết quả lớn nhất của cuộc chiến đấu ở các đô thị phía bắc vĩ tuyến 16 là gì?', ['Tiêu diệt toàn bộ quân Pháp ở Bắc Bộ', 'Giam chân quân Pháp, bảo vệ lực lượng chủ lực rút lui an toàn, có thêm thời gian chuẩn bị', 'Giải phóng hoàn toàn Hà Nội', 'Buộc Pháp kí hiệp định đình chiến'], 1, 'Ta giam chân địch ở các đô thị và đưa lực lượng, cơ quan lên căn cứ kháng chiến an toàn.']);

  m('m07', 'phap', 19471007, 'Thu – đông 1947', 'Chiến dịch Việt Bắc',
    'Từ tháng 10 đến tháng 12 năm 1947, thực dân Pháp mở cuộc tấn công lên Việt Bắc. Quân đội ta chủ động bao vây, tiến công, đẩy lùi quân Pháp khỏi các vị trí quan trọng như Chợ Đồn, Chợ Rã, Đoan Hùng. Sau hai tháng, đại bộ phận quân Pháp phải rút chạy; cơ quan đầu não của cuộc kháng chiến được bảo vệ an toàn.',
    'Là chiến dịch phản công lớn đầu tiên, làm thất bại hoàn toàn chiến lược “đánh nhanh, thắng nhanh” của thực dân Pháp.', 'dienbien', ['viet bac', 'thu dong 1947', 'doan hung', 'cho don', 'phan cong'],
    ['Chiến dịch Việt Bắc thu – đông 1947 có ý nghĩa gì?', ['Là chiến dịch tiến công lớn đầu tiên của bộ đội chủ lực', 'Là chiến dịch phản công lớn đầu tiên, làm thất bại hoàn toàn chiến lược “đánh nhanh, thắng nhanh” của Pháp', 'Giải phóng hoàn toàn miền Bắc', 'Chấm dứt chiến tranh ở Đông Dương'], 1, 'Việt Bắc 1947 là chiến dịch phản công lớn đầu tiên; còn Biên giới 1950 mới là chiến dịch tiến công lớn đầu tiên.'], 'vietbac1947');

  m('m08', 'phap', 19500916, 'Thu – đông 1950', 'Chiến dịch Biên giới',
    'Từ tháng 9 đến tháng 10 năm 1950, ở khu vực biên giới Việt – Trung, quân đội ta tấn công cứ điểm Đông Khê, mai phục, chặn đánh quân Pháp ở nhiều nơi trên Đường số 4, buộc chúng phải rút chạy. Sau gần một tháng, ta giải phóng khu vực biên giới rộng lớn, mở đường liên lạc quốc tế, bảo vệ căn cứ địa Việt Bắc, chọc thủng Hành lang Đông – Tây, làm phá sản Kế hoạch Rơ-ve của Pháp.',
    'Là chiến dịch tiến công lớn đầu tiên của bộ đội chủ lực Việt Nam; từ đây ta giành thế chủ động trên chiến trường chính Bắc Bộ.', 'dienbien', ['bien gioi', 'dong khe', 'duong so 4', 'ro ve', 'thu dong 1950'],
    ['Chiến dịch Biên giới thu – đông 1950 làm phá sản kế hoạch nào của Pháp?', ['Kế hoạch Na-va', 'Kế hoạch Rơ-ve', 'Kế hoạch Xta-lây – Tay-lo', 'Kế hoạch Đờ Lát đờ Tát-xi-nhi'], 1, 'Chiến dịch Biên giới 1950 làm phá sản Kế hoạch Rơ-ve của thực dân Pháp.'], 'bienGioi1950');

  m('m09', 'phap', 19510201, 'Tháng 2/1951', 'Đại hội đại biểu lần thứ II của Đảng',
    'Tháng 2 năm 1951, Đại hội đại biểu lần thứ hai của Đảng Cộng sản Đông Dương họp ở Chiêm Hóa, Tuyên Quang. Đại hội quyết định đổi tên Đảng thành Đảng Lao động Việt Nam và khẳng định, bổ sung, hoàn chỉnh đường lối kháng chiến. Nhiệm vụ cơ bản của cách mạng Việt Nam là đánh đuổi đế quốc xâm lược, xóa bỏ tàn tích phong kiến và nửa phong kiến, gây dựng cơ sở cho chủ nghĩa xã hội.',
    'Nâng cao vai trò lãnh đạo của Đảng, thúc đẩy kháng chiến phát triển sang bước mới.', 'duongloi', ['dai hoi ii', 'dang lao dong', 'chiem hoa', '1951'],
    ['Tại Đại hội II (2/1951), Đảng Cộng sản Đông Dương quyết định đổi tên thành gì?', ['Đảng Cộng sản Việt Nam', 'Đảng Lao động Việt Nam', 'Đảng Dân chủ Việt Nam', 'Đảng Nhân dân cách mạng'], 1, 'Đại hội II quyết định đổi tên Đảng thành Đảng Lao động Việt Nam.']);

  m('m10', 'phap', 19510303, '3/3/1951', 'Mặt trận Liên Việt ra đời',
    'Ngày 3 tháng 3 năm 1951, Mặt trận Liên hiệp quốc dân Việt Nam, gọi tắt là Mặt trận Liên Việt, ra đời trên cơ sở hợp nhất Mặt trận Việt Minh và Hội Liên Việt.',
    'Củng cố và mở rộng khối đại đoàn kết toàn dân phục vụ kháng chiến.', 'duongloi', ['lien viet', 'mat tran', 'viet minh', 'doan ket'],
    ['Mặt trận Liên Việt ra đời trên cơ sở hợp nhất những tổ chức nào?', ['Việt Minh và Hội Liên Việt', 'Đảng Dân chủ và Việt Nam Quốc dân đảng', 'Công đoàn và Hội Nông dân', 'Đoàn Thanh niên và Hội Phụ nữ'], 0, 'Mặt trận Liên Việt (3/3/1951) hợp nhất Mặt trận Việt Minh và Hội Liên Việt.']);

  m('m11', 'phap', 19520101, 'Năm 1952', 'Phong trào thi đua yêu nước',
    'Năm 1952, cuộc vận động sản xuất và tiết kiệm được phát động, trở thành phong trào quần chúng sôi nổi lôi cuốn mọi ngành, mọi giới. Giữa lúc kháng chiến diễn ra quyết liệt, Đại hội chiến sĩ thi đua và cán bộ gương mẫu toàn quốc lần thứ nhất được tổ chức tại chiến khu Việt Bắc, tuyên dương những anh hùng đầu tiên. Chủ tịch Hồ Chí Minh khẳng định: “Thi đua là yêu nước, yêu nước thì phải thi đua”.',
    'Các ngành kinh tế cơ bản đáp ứng được yêu cầu của cuộc kháng chiến và đời sống nhân dân.', 'duongloi', ['thi dua', 'yeu nuoc', 'san xuat tiet kiem', '1952'],
    ['“Thi đua là yêu nước, yêu nước thì phải thi đua” là lời của ai?', ['Chủ tịch Hồ Chí Minh', 'Tổng Bí thư Trường Chinh', 'Đại tướng Võ Nguyên Giáp', 'Thủ tướng Phạm Văn Đồng'], 0, 'Đây là câu nói của Chủ tịch Hồ Chí Minh tại Đại hội chiến sĩ thi đua và cán bộ gương mẫu toàn quốc lần thứ nhất (1952).']);

  m('m12', 'phap', 19530701, 'Tháng 7/1953', 'Kế hoạch Na-va',
    'Được sự thỏa thuận của Mỹ, tháng 7 năm 1953, thực dân Pháp đề ra Kế hoạch Na-va với hi vọng trong vòng 18 tháng giành một thắng lợi quân sự quyết định để kết thúc chiến tranh trong danh dự.',
    'Cuộc Tiến công chiến lược Đông – Xuân 1953 – 1954 của ta đã làm phá sản bước đầu Kế hoạch Na-va.', 'boicanh', ['na va', 'ke hoach na va', '18 thang', '1953'],
    ['Kế hoạch Na-va được Pháp đề ra với hi vọng điều gì?', ['Giành thắng lợi quân sự quyết định trong vòng 18 tháng để kết thúc chiến tranh trong danh dự', 'Kí hiệp định hòa bình với Việt Nam', 'Rút quân khỏi Đông Dương ngay lập tức', 'Chuyển giao chiến tranh cho Mỹ'], 0, 'Pháp hi vọng trong 18 tháng giành thắng lợi quân sự quyết định để kết thúc chiến tranh trong danh dự.']);

  m('m13', 'phap', 19531201, 'Tháng 12/1953', 'Luật Cải cách ruộng đất và quyết định mở chiến dịch Điện Biên Phủ',
    'Đầu tháng 12 năm 1953, Bộ Chính trị Trung ương Đảng thông qua quyết định mở chiến dịch Điện Biên Phủ. Cũng trong tháng 12 năm 1953, Quốc hội thông qua Luật Cải cách ruộng đất và quyết định tiến hành cải cách ruộng đất ở vùng tự do.',
    'Chuẩn bị về vật chất và tinh thần, phát huy sức mạnh của hậu phương cho thắng lợi quyết định.', 'duongloi', ['cai cach ruong dat', 'bo chinh tri', 'quoc hoi', '12/1953'],
    ['Tháng 12/1953, Quốc hội thông qua đạo luật nào?', ['Luật Hôn nhân và gia đình', 'Luật Cải cách ruộng đất', 'Luật Lao động', 'Luật Giáo dục'], 1, 'Quốc hội thông qua Luật Cải cách ruộng đất và quyết định tiến hành cải cách ruộng đất ở vùng tự do.']);

  m('m14', 'phap', 19540313, 'Từ 13/3 đến 7/5/1954', 'Chiến dịch Điện Biên Phủ',
    'Chiến dịch Điện Biên Phủ trải qua 56 ngày đêm với ba đợt. Đợt 1, từ ngày 13 đến ngày 17 tháng 3, ta tiến công cụm cứ điểm Him Lam và đồi Độc Lập, bức hàng Bản Kéo. Đợt 2, từ ngày 30 tháng 3 đến ngày 26 tháng 4, ta tấn công các cứ điểm phía đông phân khu Trung tâm, kiểm soát sân bay Mường Thanh. Đợt 3, từ ngày 1 đến ngày 7 tháng 5, ta đồng loạt tấn công phân khu Trung tâm và phân khu Nam. Đến 17 giờ 30 phút ngày 7 tháng 5, tướng Đờ Ca-xtơ-ri cùng toàn bộ Bộ Tham mưu Pháp đầu hàng.',
    'Làm phá sản Kế hoạch Na-va, tạo cơ sở cho việc đàm phán và kí Hiệp định Giơ-ne-vơ.', 'dienbien', ['dien bien phu', 'muong thanh', 'him lam', 'do ca xtor ri', '56 ngay dem'],
    ['Chiến dịch Điện Biên Phủ kéo dài bao nhiêu ngày đêm và chia làm mấy đợt?', ['30 ngày đêm, 2 đợt', '56 ngày đêm, 3 đợt', '60 ngày đêm, 4 đợt', '45 ngày đêm, 3 đợt'], 1, 'Chiến dịch trải qua 56 ngày đêm (13/3 – 7/5/1954) với ba đợt.'], 'dienbienphu');

  m('m15', 'phap', 19540721, '21/7/1954', 'Hiệp định Giơ-ne-vơ',
    'Thắng lợi ở Điện Biên Phủ tạo cơ sở cho việc đàm phán và kí Hiệp định Giơ-ne-vơ về chấm dứt chiến tranh, lập lại hòa bình ở Đông Dương, ngày 21 tháng 7 năm 1954. Pháp buộc phải rút quân về nước, Mỹ thất bại trong âm mưu kéo dài, mở rộng chiến tranh xâm lược Đông Dương.',
    'Miền Bắc được hoàn toàn giải phóng, chuyển sang thời kì cách mạng xã hội chủ nghĩa.', 'ynghia', ['gio ne vo', 'hoa binh', 'dong duong', 'rut quan'],
    ['Hiệp định Giơ-ne-vơ về chấm dứt chiến tranh ở Đông Dương được kí vào ngày nào?', ['7/5/1954', '21/7/1954', '27/1/1973', '30/4/1975'], 1, 'Hiệp định Giơ-ne-vơ được kí ngày 21 tháng 7 năm 1954.']);

  /* ======== KHÁNG CHIẾN CHỐNG MỸ, CỨU NƯỚC (1954 – 1975) ======== */
  m('m16', 'my', 19540801, 'Sau tháng 7/1954', 'Mỹ thay chân Pháp, dựng chính quyền Ngô Đình Diệm',
    'Ngay sau Hiệp định Giơ-ne-vơ, Mỹ thay chân Pháp, dựng lên chính quyền tay sai đứng đầu là Ngô Đình Diệm ở miền Nam Việt Nam. Âm mưu của Mỹ là chia cắt Việt Nam, biến miền Nam thành thuộc địa kiểu mới và căn cứ quân sự của Mỹ ở Đông Nam Á, ngăn chặn chủ nghĩa cộng sản và phong trào giải phóng dân tộc.',
    'Việt Nam tạm bị chia cắt làm hai miền: miền Bắc xây dựng chủ nghĩa xã hội, miền Nam tiếp tục cách mạng dân tộc dân chủ nhân dân.', 'boicanh', ['my', 'ngo dinh diem', 'chia cat', 'thuoc dia kieu moi'],
    ['Âm mưu của Mỹ sau Hiệp định Giơ-ne-vơ là gì?', ['Công nhận độc lập, thống nhất của Việt Nam', 'Chia cắt Việt Nam, biến miền Nam thành thuộc địa kiểu mới và căn cứ quân sự', 'Giúp Pháp quay trở lại Đông Dương', 'Rút hoàn toàn khỏi Đông Nam Á'], 1, 'Mỹ muốn chia cắt Việt Nam, biến miền Nam thành thuộc địa kiểu mới và căn cứ quân sự ở Đông Nam Á.']);

  m('m17', 'my', 19590101, 'Tháng 1/1959', 'Hội nghị Trung ương lần thứ 15',
    'Tháng 1 năm 1959, Hội nghị Ban Chấp hành Trung ương lần thứ 15 của Đảng Lao động Việt Nam khẳng định: ngoài con đường sử dụng bạo lực cách mạng, nhân dân miền Nam không còn con đường nào khác. Nghị quyết đã thổi bùng lên phong trào Đồng khởi.',
    'Mở đường cho phong trào Đồng khởi, chuyển cách mạng miền Nam từ thế giữ gìn lực lượng sang thế tiến công.', 'duongloi', ['hoi nghi 15', 'bao luc cach mang', 'dong khoi', '1959'],
    ['Hội nghị Trung ương lần thứ 15 (1/1959) khẳng định con đường nào cho cách mạng miền Nam?', ['Đấu tranh nghị trường hòa bình', 'Sử dụng bạo lực cách mạng', 'Chờ tổng tuyển cử theo Hiệp định Giơ-ne-vơ', 'Nhờ Liên hợp quốc can thiệp'], 1, 'Hội nghị khẳng định ngoài con đường bạo lực cách mạng, nhân dân miền Nam không còn con đường nào khác.']);

  m('m18', 'my', 19590201, '1959 – 1960', 'Phong trào Đồng khởi',
    'Phong trào Đồng khởi bắt đầu từ các cuộc nổi dậy của nhân dân Vĩnh Thạnh (Bình Định) và Bắc Ái (Ninh Thuận) tháng 2 năm 1959, Trà Bồng (Quảng Ngãi) tháng 8 năm 1959, rồi lan khắp miền Nam, tiêu biểu là cuộc Đồng khởi ở Bến Tre tháng 1 năm 1960. “Đội quân tóc dài” ra đời từ phong trào này.',
    'Giáng đòn nặng nề vào chính sách thực dân mới của Mỹ, làm lung lay chính quyền Ngô Đình Diệm; đánh dấu bước phát triển nhảy vọt của cách mạng miền Nam.', 'dienbien', ['dong khoi', 'ben tre', 'doi quan toc dai', 'nguyen thi dinh'],
    ['Cuộc Đồng khởi tiêu biểu nhất, gắn với “Đội quân tóc dài”, diễn ra ở đâu?', ['Quảng Ngãi', 'Bến Tre', 'Bình Định', 'Ninh Thuận'], 1, 'Đồng khởi Bến Tre (tháng 1/1960), do bà Nguyễn Thị Định lãnh đạo, là cuộc Đồng khởi tiêu biểu.']);

  m('m19', 'my', 19600901, 'Tháng 9/1960', 'Đại hội đại biểu toàn quốc lần thứ III của Đảng',
    'Tháng 9 năm 1960, Đại hội đại biểu toàn quốc lần thứ ba của Đảng Lao động Việt Nam họp tại Hà Nội, xác định nhiệm vụ chiến lược của cách mạng cả nước. Cách mạng miền Bắc có vai trò quyết định nhất đối với sự phát triển của cách mạng cả nước; cách mạng dân tộc dân chủ nhân dân ở miền Nam có vai trò quyết định trực tiếp đối với sự nghiệp giải phóng miền Nam.',
    'Xác định rõ vai trò, vị trí của cách mạng từng miền và mối quan hệ mật thiết giữa cách mạng hai miền.', 'duongloi', ['dai hoi iii', 'chien luoc', 'cach mang hai mien', '1960'],
    ['Theo Đại hội III (1960), cách mạng miền Bắc có vai trò như thế nào đối với cả nước?', ['Quyết định trực tiếp việc giải phóng miền Nam', 'Quyết định nhất đối với sự phát triển của cách mạng cả nước', 'Chỉ có vai trò hậu phương thứ yếu', 'Không liên quan đến miền Nam'], 1, 'Cách mạng miền Bắc có vai trò quyết định nhất; cách mạng miền Nam có vai trò quyết định trực tiếp.']);

  m('m20', 'my', 19601220, '20/12/1960', 'Mặt trận Dân tộc giải phóng miền Nam Việt Nam ra đời',
    'Thắng lợi của phong trào Đồng khởi dẫn đến việc thành lập Mặt trận Dân tộc giải phóng miền Nam Việt Nam, ngày 20 tháng 12 năm 1960, thúc đẩy lực lượng vũ trang cách mạng phát triển.',
    'Tập hợp mọi lực lượng yêu nước ở miền Nam đấu tranh chống Mỹ và chính quyền Sài Gòn.', 'ynghia', ['mat tran dan toc giai phong', '1960', 'mien nam'],
    ['Mặt trận Dân tộc giải phóng miền Nam Việt Nam thành lập vào thời gian nào?', ['20/12/1960', '15/2/1961', '6/6/1969', '27/1/1973'], 0, 'Mặt trận được thành lập ngày 20 tháng 12 năm 1960.']);

  m('m21', 'my', 19610215, '15/2/1961', 'Thống nhất lực lượng vũ trang: Quân Giải phóng miền Nam',
    'Để đáp ứng yêu cầu của cuộc kháng chiến, ngày 15 tháng 2 năm 1961, các lực lượng vũ trang cách mạng thống nhất thành Quân Giải phóng miền Nam.',
    'Tăng cường sức mạnh quân sự để đánh bại chiến lược “Chiến tranh đặc biệt” của Mỹ.', 'dienbien', ['quan giai phong', '1961', 'luc luong vu trang'],
    ['Ngày 15/2/1961, các lực lượng vũ trang cách mạng ở miền Nam thống nhất thành tổ chức nào?', ['Quân Giải phóng miền Nam', 'Quân đội nhân dân Việt Nam', 'Dân quân tự vệ', 'Vệ quốc đoàn'], 0, 'Các lực lượng vũ trang thống nhất thành Quân Giải phóng miền Nam.']);

  m('m22', 'my', 19610301, '1961 – 1965', 'Chiến lược “Chiến tranh đặc biệt” của Mỹ',
    '“Chiến tranh đặc biệt” là loại hình chiến tranh xâm lược thực dân mới được tiến hành bằng lực lượng quân đội Sài Gòn dưới sự chỉ huy của cố vấn Mỹ, dựa vào vũ khí, trang bị kĩ thuật, phương tiện chiến tranh của Mỹ. Âm mưu cơ bản là dùng người Việt đánh người Việt. Mỹ đề ra kế hoạch Xta-lây – Tay-lo nhằm bình định miền Nam trong vòng 18 tháng, dồn dân lập “ấp chiến lược”, dùng chiến thuật “trực thăng vận”, “thiết xa vận”.',
    'Nhân dân miền Nam đánh bại “Chiến tranh đặc biệt” bằng đấu tranh chính trị kết hợp tiến công quân sự.', 'boicanh', ['chien tranh dac biet', 'ap chien luoc', 'xta lay tay lo', 'truc thang van'],
    ['Âm mưu cơ bản của chiến lược “Chiến tranh đặc biệt” là gì?', ['Dùng quân Mỹ trực tiếp đánh Việt Nam', 'Dùng người Việt đánh người Việt', 'Rút dần quân Mỹ để giảm xương máu', 'Mở rộng chiến tranh sang Lào'], 1, 'Âm mưu cơ bản của “Chiến tranh đặc biệt” là dùng người Việt đánh người Việt.']);

  m('m23', 'my', 19630102, '2/1/1963', 'Chiến thắng Ấp Bắc',
    'Tháng 1 năm 1963, chiến thắng Ấp Bắc (Mỹ Tho) đã mở ra khả năng đánh bại chiến thuật “trực thăng vận, thiết xa vận”, chứng minh khả năng quân dân Việt Nam có thể đánh bại chiến lược “Chiến tranh đặc biệt” của Mỹ. Sau chiến thắng này, phong trào “Thi đua Ấp Bắc, giết giặc lập công” dấy lên khắp miền Nam.',
    'Chứng minh quân dân miền Nam có thể đánh bại “Chiến tranh đặc biệt”.', 'dienbien', ['ap bac', 'my tho', 'truc thang van', 'thiet xa van', '1963'],
    ['Chiến thắng Ấp Bắc (1963) chứng minh điều gì?', ['Quân dân miền Nam có thể đánh bại “Chiến tranh đặc biệt” của Mỹ', 'Mỹ đã hoàn toàn rút quân', 'Chiến tranh cục bộ bị đánh bại', 'Miền Nam đã được giải phóng'], 0, 'Ấp Bắc mở ra khả năng đánh bại chiến thuật “trực thăng vận, thiết xa vận”, đánh bại “Chiến tranh đặc biệt”.'], 'apbac1963');

  m('m24', 'my', 19640801, 'Tháng 8/1964', 'Sự kiện “Vịnh Bắc Bộ”',
    'Sau khi dựng lên sự kiện “Vịnh Bắc Bộ” (tháng 8 năm 1964), Mỹ chính thức mở rộng chiến tranh bằng không quân và hải quân phá hoại miền Bắc lần thứ nhất. Quân dân miền Bắc kịp thời chuyển mọi hoạt động sang thời chiến, vừa chiến đấu vừa sản xuất, thực hiện nhiệm vụ hậu phương đối với tiền tuyến miền Nam.',
    'Cuộc chiến tranh phá hoại bắt đầu; hậu phương miền Bắc phải vừa chiến đấu vừa chi viện cho miền Nam.', 'boicanh', ['vinh bac bo', 'pha hoai mien bac', '1964'],
    ['Sau sự kiện “Vịnh Bắc Bộ” (8/1964), Mỹ làm gì?', ['Ngừng ném bom miền Bắc', 'Mở rộng chiến tranh bằng không quân và hải quân phá hoại miền Bắc lần thứ nhất', 'Kí hiệp định Pa-ri', 'Rút quân khỏi miền Nam'], 1, 'Mỹ mở rộng chiến tranh phá hoại miền Bắc lần thứ nhất bằng không quân và hải quân.']);

  m('m25', 'my', 19641201, '1964 – 1965', 'Các chiến thắng Bình Giã, An Lão, Ba Gia, Đồng Xoài',
    'Trong những năm 1964 – 1965, quân ta tiến công và thắng lợi ở Bình Giã (Bà Rịa – Vũng Tàu), An Lão (Bình Định), Ba Gia (Quảng Ngãi), Đồng Xoài (Bình Phước), làm phá sản hoàn toàn chiến lược “Chiến tranh đặc biệt” của Mỹ.',
    'Buộc Mỹ phải chuyển sang chiến lược “Chiến tranh cục bộ”.', 'dienbien', ['binh gia', 'an lao', 'ba gia', 'dong xoai'],
    ['Các chiến thắng Bình Giã, An Lão, Ba Gia, Đồng Xoài làm phá sản chiến lược nào của Mỹ?', ['Chiến tranh cục bộ', 'Chiến tranh đặc biệt', 'Việt Nam hóa chiến tranh', 'Kế hoạch Na-va'], 1, 'Những thắng lợi này làm phá sản hoàn toàn “Chiến tranh đặc biệt”.']);

  m('m26', 'my', 19650601, 'Giữa năm 1965', 'Chiến lược “Chiến tranh cục bộ” của Mỹ',
    'Sau thất bại của “Chiến tranh đặc biệt”, từ giữa năm 1965, Mỹ chuyển sang chiến lược “Chiến tranh cục bộ” ở miền Nam và mở rộng chiến tranh phá hoại miền Bắc. Đây là loại hình chiến tranh xâm lược thực dân mới được tiến hành bằng lực lượng quân đội Mỹ, quân đồng minh của Mỹ và quân đội Sài Gòn.',
    'Nhân dân hai miền Nam – Bắc trực tiếp chiến đấu chống Mỹ.', 'boicanh', ['chien tranh cuc bo', '1965', 'quan my', 'dong minh'],
    ['“Chiến tranh cục bộ” được tiến hành chủ yếu bằng lực lượng nào?', ['Chỉ quân đội Sài Gòn', 'Quân đội Mỹ, quân đồng minh của Mỹ và quân đội Sài Gòn', 'Chỉ quân đồng minh của Mỹ', 'Lực lượng biệt kích'], 1, '“Chiến tranh cục bộ” dùng quân Mỹ, quân đồng minh và quân đội Sài Gòn.']);

  m('m27', 'my', 19650818, '18/8/1965', 'Chiến thắng Vạn Tường',
    'Với ý chí “Quyết chiến quyết thắng giặc Mỹ xâm lược”, ngày 18 tháng 8 năm 1965, quân dân miền Nam đã anh dũng chiến đấu và giành thắng lợi ở Vạn Tường (Quảng Ngãi), mở ra khả năng đánh thắng Mỹ trong chiến lược “Chiến tranh cục bộ” về quân sự. Tiếp đó, ta đập tan cuộc phản công của quân Mỹ và đồng minh trong hai mùa khô 1965 – 1966 và 1966 – 1967.',
    'Là “Ấp Bắc” đối với quân Mỹ: khẳng định ta có thể đánh thắng quân Mỹ trong chiến tranh cục bộ.', 'dienbien', ['van tuong', 'quang ngai', '1965', 'mua kho'],
    ['Chiến thắng Vạn Tường (18/8/1965) diễn ra ở tỉnh nào?', ['Quảng Ngãi', 'Mỹ Tho', 'Bến Tre', 'Bình Phước'], 0, 'Vạn Tường thuộc tỉnh Quảng Ngãi.']);

  m('m28', 'my', 19680130, 'Xuân 1968', 'Tổng tiến công và nổi dậy Tết Mậu Thân',
    'Bước vào đầu năm 1968 (Xuân Mậu Thân), quân dân ta mở cuộc Tổng tiến công và nổi dậy trên toàn miền Nam, trọng tâm là ở các đô thị. Cuộc Tổng tiến công và nổi dậy đã mở ra bước ngoặt của cuộc kháng chiến chống Mỹ, cứu nước: làm lung lay ý chí xâm lược của Mỹ, buộc Mỹ phải “phi Mỹ hóa” chiến tranh xâm lược, chấm dứt không điều kiện chiến tranh phá hoại miền Bắc, chấp nhận đàm phán ở Pa-ri.',
    'Mở ra bước ngoặt của cuộc kháng chiến chống Mỹ, cứu nước.', 'ynghia', ['mau than', '1968', 'tong tien cong', 'phi my hoa', 'pa ri'],
    ['Cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968 có ý nghĩa gì?', ['Kết thúc hoàn toàn cuộc kháng chiến', 'Mở ra bước ngoặt, buộc Mỹ “phi Mỹ hóa” chiến tranh và chấp nhận đàm phán ở Pa-ri', 'Đánh bại chiến lược Chiến tranh đặc biệt', 'Giải phóng Sài Gòn'], 1, 'Tổng tiến công Mậu Thân làm lung lay ý chí xâm lược của Mỹ, buộc Mỹ “phi Mỹ hóa” chiến tranh và đàm phán ở Pa-ri.']);

  m('m29', 'my', 19690101, '1969 – 1973', 'Chiến lược “Việt Nam hóa chiến tranh”',
    'Sau thất bại của “Chiến tranh cục bộ”, Mỹ chuyển sang chiến lược “Việt Nam hóa chiến tranh” (1969 – 1973) ở miền Nam và mở rộng chiến tranh phá hoại miền Bắc lần thứ hai. Đây là loại hình chiến tranh xâm lược thực dân mới, tiến hành bằng lực lượng quân đội Sài Gòn là chủ yếu, có sự phối hợp về hỏa lực, không quân, hậu cần của Mỹ và vẫn do cố vấn Mỹ chỉ huy. Quân Mỹ rút dần để giảm xương máu, đồng thời mở rộng chiến tranh ra toàn Đông Dương.',
    'Quân dân ta tiếp tục chiến đấu và đánh bại chiến lược này.', 'boicanh', ['viet nam hoa chien tranh', '1969', 'rut quan', 'dong duong'],
    ['Đặc điểm của chiến lược “Việt Nam hóa chiến tranh” là gì?', ['Dùng quân đội Mỹ là lực lượng chủ yếu', 'Dùng quân đội Sài Gòn là chủ yếu, Mỹ rút dần quân nhưng vẫn viện trợ, chỉ huy', 'Chấm dứt mọi viện trợ cho Sài Gòn', 'Chỉ đánh bằng lực lượng biệt kích'], 1, 'Quân đội Sài Gòn là chủ yếu, Mỹ giảm xương máu và vẫn do cố vấn Mỹ chỉ huy.']);

  m('m30', 'my', 19690606, '6/6/1969', 'Chính phủ Cách mạng lâm thời Cộng hòa miền Nam Việt Nam',
    'Ngày 6 tháng 6 năm 1969, Chính phủ cách mạng lâm thời Cộng hòa miền Nam Việt Nam ra đời. Đây là chính phủ hợp pháp của nhân dân miền Nam.',
    'Nâng cao vị thế chính trị, ngoại giao của cách mạng miền Nam.', 'duongloi', ['chinh phu cach mang lam thoi', '1969'],
    ['Chính phủ Cách mạng lâm thời Cộng hòa miền Nam Việt Nam ra đời năm nào?', ['1960', '1965', '1969', '1973'], 2, 'Ngày 6/6/1969, Chính phủ cách mạng lâm thời ra đời.']);

  m('m31', 'my', 19700401, 'Tháng 4/1970', 'Hội nghị cấp cao ba nước Việt Nam – Lào – Cam-pu-chia',
    'Tháng 4 năm 1970, Hội nghị cấp cao ba nước Việt Nam, Lào, Cam-pu-chia được tổ chức, biểu thị quyết tâm chung chống Mỹ. Từ ngày 30 tháng 4 đến ngày 30 tháng 6 năm 1970, với sự hỗ trợ của quân Cam-pu-chia, quân đội Việt Nam đã đập tan cuộc hành quân xâm lược của 10 vạn quân Mỹ và quân đội Sài Gòn.',
    'Thể hiện tình đoàn kết chiến đấu của nhân dân ba nước Đông Dương.', 'nguyennhan', ['ba nuoc dong duong', 'lao', 'cam pu chia', '1970'],
    ['Hội nghị cấp cao ba nước (4/1970) thể hiện điều gì?', ['Sự bất đồng của ba nước Đông Dương', 'Quyết tâm đoàn kết chiến đấu chống Mỹ của nhân dân ba nước Việt Nam – Lào – Cam-pu-chia', 'Việc Mỹ rút khỏi Đông Dương', 'Sự kết thúc chiến tranh'], 1, 'Hội nghị biểu thị quyết tâm và đoàn kết chiến đấu chống Mỹ của nhân dân ba nước.']);

  m('m32', 'my', 19710201, 'Tháng 2 – 3/1971', 'Chiến dịch Đường 9 – Nam Lào',
    'Trong hơn một tháng, từ tháng 2 đến tháng 3 năm 1971, quân dân Việt Nam có sự phối hợp của quân đội Lào đã giành thắng lợi trong chiến dịch Đường 9 – Nam Lào, giữ vững hành lang chiến lược của cách mạng Đông Dương, trực tiếp mở ra thế tiến công mới cho cách mạng.',
    'Giữ vững hành lang chiến lược, mở thế tiến công mới.', 'dienbien', ['duong 9', 'nam lao', '1971', 'hanh lang chien luoc'],
    ['Chiến dịch Đường 9 – Nam Lào (1971) có ý nghĩa gì?', ['Giữ vững hành lang chiến lược của cách mạng Đông Dương, mở thế tiến công mới', 'Giải phóng Sài Gòn', 'Kết thúc chiến tranh phá hoại', 'Buộc Mỹ kí Hiệp định Pa-ri'], 0, 'Chiến thắng giữ vững hành lang chiến lược và mở ra thế tiến công mới.']);

  m('m33', 'my', 19720301, 'Từ tháng 3/1972', 'Tiến công chiến lược 1972',
    'Từ tháng 3 năm 1972, quân đội Việt Nam mở cuộc Tiến công chiến lược vào Quảng Trị rồi phát triển rộng khắp chiến trường miền Nam, chọc thủng ba phòng tuyến của địch ở Quảng Trị, Tây Nguyên và Đông Nam Bộ. Cuộc Tiến công chiến lược năm 1972 đã buộc Mỹ phải thừa nhận thất bại của chiến lược “Việt Nam hóa chiến tranh”.',
    'Đánh bại “Việt Nam hóa chiến tranh”.', 'ynghia', ['tien cong chien luoc', '1972', 'quang tri', 'tay nguyen', 'dong nam bo'],
    ['Cuộc Tiến công chiến lược năm 1972 buộc Mỹ thừa nhận thất bại của chiến lược nào?', ['Chiến tranh đặc biệt', 'Chiến tranh cục bộ', 'Việt Nam hóa chiến tranh', 'Kế hoạch Na-va'], 2, 'Cuộc Tiến công chiến lược 1972 buộc Mỹ thừa nhận thất bại của “Việt Nam hóa chiến tranh”.']);

  m('m34', 'my', 19721218, 'Từ 18 đến 29/12/1972', '“Điện Biên Phủ trên không”',
    'Trong 12 ngày đêm, từ ngày 18 đến ngày 29 tháng 12 năm 1972, quân dân miền Bắc đã đánh bại hoàn toàn cuộc tập kích chiến lược bằng máy bay B-52 của Mỹ vào Hà Nội, Hải Phòng và một số thành phố. Thắng lợi này được coi như một trận “Điện Biên Phủ trên không”, buộc Mỹ phải trở lại bàn hội nghị và kí Hiệp định Pa-ri về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam.',
    'Buộc Mỹ trở lại bàn đàm phán và kí Hiệp định Pa-ri.', 'dienbien', ['dien bien phu tren khong', 'b52', 'ha noi', '12 ngay dem', '1972'],
    ['Trận “Điện Biên Phủ trên không” kéo dài bao lâu?', ['7 ngày đêm', '12 ngày đêm', '56 ngày đêm', '30 ngày đêm'], 1, 'Trận “Điện Biên Phủ trên không” kéo dài 12 ngày đêm (18 – 29/12/1972).'], 'dbptrenkhong1972');

  m('m35', 'my', 19730127, '27/1/1973', 'Hiệp định Pa-ri về Việt Nam',
    'Hiệp định Pa-ri về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được kí năm 1973. Mỹ phải rút hết quân về nước, so sánh lực lượng thay đổi theo hướng có lợi cho cách mạng Việt Nam. Tuy vậy chính quyền Sài Gòn ngang nhiên phá hoại Hiệp định.',
    'Tạo điều kiện thuận lợi để nhân dân ta tiến lên giải phóng hoàn toàn miền Nam.', 'ynghia', ['hiep dinh pa ri', '1973', 'rut quan my'],
    ['Sau Hiệp định Pa-ri năm 1973, điều gì xảy ra với quân Mỹ?', ['Mỹ tăng thêm quân ở miền Nam', 'Mỹ phải rút hết quân về nước', 'Mỹ tiếp tục ném bom miền Bắc', 'Mỹ thành lập chính phủ liên hiệp'], 1, 'Mỹ phải rút hết quân về nước, so sánh lực lượng thay đổi có lợi cho cách mạng.']);

  m('m36', 'my', 19730701, 'Tháng 7/1973', 'Hội nghị Trung ương lần thứ 21',
    'Tháng 7 năm 1973, Hội nghị Ban Chấp hành Trung ương Đảng lần thứ 21 nhấn mạnh: trong bất cứ tình hình nào cũng phải tiếp tục con đường bạo lực cách mạng, phải nắm vững chiến lược tiến công, kiên quyết đấu tranh trên ba mặt trận: quân sự, chính trị, ngoại giao.',
    'Định hướng chiến lược để tiến tới giải phóng miền Nam.', 'duongloi', ['hoi nghi 21', 'ba mat tran', '1973', 'bao luc cach mang'],
    ['Hội nghị Trung ương 21 (7/1973) yêu cầu đấu tranh trên những mặt trận nào?', ['Quân sự, chính trị, ngoại giao', 'Chỉ quân sự', 'Kinh tế, văn hóa, giáo dục', 'Chỉ ngoại giao'], 0, 'Nghị quyết yêu cầu kiên quyết đấu tranh trên ba mặt trận: quân sự, chính trị, ngoại giao.']);

  m('m37', 'my', 19741215, 'Cuối 1974 – đầu 1975', 'Chiến dịch Đường 14 – Phước Long',
    'Cuối năm 1974, đầu năm 1975, quân dân miền Nam giành thắng lợi trong chiến dịch Đường 14 – Phước Long. Chiến thắng này cùng những phản ứng của Mỹ và chính quyền Sài Gòn sau đó cho thấy rõ sức mạnh lớn, khả năng thắng lớn của quân ta, sự suy yếu và bất lực của quân đội Sài Gòn, khả năng can thiệp bằng quân sự trở lại của Mỹ là rất hạn chế.',
    'Củng cố quyết tâm mở cuộc Tổng tiến công và nổi dậy Xuân 1975.', 'dienbien', ['duong 14', 'phuoc long', '1975'],
    ['Chiến dịch Đường 14 – Phước Long cho thấy điều gì?', ['Quân đội Sài Gòn còn rất mạnh', 'Sức mạnh lớn của quân ta, sự suy yếu của quân Sài Gòn và khả năng can thiệp của Mỹ rất hạn chế', 'Mỹ sắp quay lại bằng quân đội', 'Cần hoãn Tổng tiến công'], 1, 'Chiến thắng cho thấy khả năng thắng lớn của ta, sự suy yếu của quân Sài Gòn và khả năng can thiệp trở lại của Mỹ rất hạn chế.']);

  m('m38', 'my', 19750108, 'Tháng 1/1975', 'Bộ Chính trị họp Hội nghị mở rộng, quyết định kế hoạch giải phóng miền Nam',
    'Tháng 1 năm 1975, Bộ Chính trị họp Hội nghị mở rộng và quyết định kế hoạch giải phóng miền Nam. Kế hoạch được thực hiện thông qua cuộc Tổng tiến công và nổi dậy Xuân 1975, trải qua ba chiến dịch lớn: chiến dịch Tây Nguyên, chiến dịch Huế – Đà Nẵng và chiến dịch giải phóng Sài Gòn – Gia Định, tức chiến dịch Hồ Chí Minh.',
    'Định ra phương án giải phóng hoàn toàn miền Nam.', 'duongloi', ['bo chinh tri', 'ke hoach giai phong mien nam', '1975', 'tong tien cong va noi day'],
    ['Cuộc Tổng tiến công và nổi dậy Xuân 1975 trải qua ba chiến dịch lớn nào?', ['Tây Nguyên; Huế – Đà Nẵng; Hồ Chí Minh', 'Việt Bắc; Biên giới; Điện Biên Phủ', 'Ấp Bắc; Bình Giã; Vạn Tường', 'Đường 9; Đường 14; Quảng Trị'], 0, 'Ba chiến dịch lớn: Tây Nguyên, Huế – Đà Nẵng và giải phóng Sài Gòn – Gia Định (chiến dịch Hồ Chí Minh).']);

  m('m39', 'my', 19750310, 'Từ 10 đến 24/3/1975', 'Chiến dịch Tây Nguyên',
    'Chiến dịch Tây Nguyên diễn ra từ ngày 10 tháng 3, đến ngày 24 tháng 3 năm 1975 thì kết thúc thắng lợi. Ngày 26 tháng 3, thành phố Huế và toàn tỉnh Thừa Thiên được giải phóng. Đà Nẵng rơi vào thế cô lập và đến chiều ngày 29 tháng 3 cũng được hoàn toàn giải phóng.',
    'Mở đầu thắng lợi của cuộc Tổng tiến công và nổi dậy Xuân 1975.', 'dienbien', ['tay nguyen', 'buon ma thuot', 'hue', 'da nang', '1975'],
    ['Thành phố Đà Nẵng được giải phóng vào ngày nào?', ['24/3/1975', '26/3/1975', '29/3/1975', '30/4/1975'], 2, 'Huế giải phóng ngày 26/3; Đà Nẵng hoàn toàn giải phóng chiều ngày 29/3/1975.'], 'xuan1975');

  m('m40', 'my', 19750407, '7/4/1975', 'Mệnh lệnh “Thần tốc, thần tốc hơn nữa”',
    'Ngày 7 tháng 4 năm 1975, Đại tướng Võ Nguyên Giáp thay mặt Quân ủy Trung ương và Bộ Tổng Tư lệnh ra mệnh lệnh cho các cánh quân: “Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa, tranh thủ từng giờ, từng phút xốc tới mặt trận, giải phóng miền Nam. Quyết chiến và toàn thắng”.',
    'Thể hiện quyết tâm và phương châm thần tốc, táo bạo để nắm bắt thời cơ giải phóng Sài Gòn.', 'duongloi', ['than toc', 'tao bao', 'vo nguyen giap', '7/4/1975'],
    ['Mệnh lệnh ngày 7/4/1975 của Đại tướng Võ Nguyên Giáp nhấn mạnh phương châm nào?', ['Đánh chắc, tiến chắc', 'Thần tốc, táo bạo, tranh thủ từng giờ từng phút', 'Trường kì kháng chiến', 'Du kích chiến tranh'], 1, 'Mệnh lệnh yêu cầu: “Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa”.'], 'xuan1975');

  m('m41', 'my', 19750426, 'Từ 26 đến 30/4/1975', 'Chiến dịch Hồ Chí Minh lịch sử',
    'Sau khi tiêu diệt căn cứ phòng thủ Xuân Lộc và Phan Rang, năm giờ chiều ngày 26 tháng 4 năm 1975, năm cánh quân cùng lúc tiến vào trung tâm thành phố, đánh chiếm các cơ quan đầu não của chính quyền Sài Gòn. Mười một giờ 30 phút ngày 30 tháng 4, lá cờ cách mạng tung bay trên nóc Dinh Độc Lập, báo hiệu sự toàn thắng của chiến dịch Hồ Chí Minh lịch sử.',
    'Kết thúc 21 năm chiến đấu chống đế quốc Mỹ, 30 năm chiến tranh cách mạng; mở ra kỉ nguyên cả nước hòa bình, độc lập, thống nhất, đi lên chủ nghĩa xã hội.', 'ynghia', ['ho chi minh', 'sai gon', 'dinh doc lap', '30/4/1975', 'nam canh quan'],
    ['Lá cờ cách mạng tung bay trên nóc Dinh Độc Lập vào thời điểm nào?', ['17 giờ 30 phút ngày 26/4/1975', '11 giờ 30 phút ngày 30/4/1975', '12 giờ ngày 1/5/1975', '8 giờ ngày 29/4/1975'], 1, 'Lúc 11 giờ 30 phút ngày 30/4/1975, lá cờ cách mạng tung bay trên nóc Dinh Độc Lập.'], 'xuan1975');

  L.sort((a, b) => a.k - b.k);
  // lời kể ngắn: câu chính của phần nội dung + câu chính của phần ý nghĩa (tối đa ~55 từ)
  const first = (t) => { const m = String(t || '').match(/^.+?[.!?](?=\s+[A-ZÀ-Ỹ“]|$)/); return m ? m[0] : String(t || ''); };
  L.forEach((x) => {
    if (x.story) return;
    const words = (first(x.summary) + ' ' + first(x.meaning)).trim().split(/\s+/);
    x.story = words.slice(0, 58).join(' ');
    if (words.length > 58 && !/[.!?]$/.test(x.story)) x.story += '.';
  });
  SBS.milestones = L;
})();
