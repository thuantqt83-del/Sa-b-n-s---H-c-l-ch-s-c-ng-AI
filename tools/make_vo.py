# -*- coding: utf-8 -*-
"""Dựng giọng kể nam (Microsoft Edge Neural: vi-VN-NamMinhNeural) cho các lời kể trong app.

Cách dùng:
    node tools/build_vo.mjs        # trích lời kể -> tools/vo_manifest.json
    python tools/make_vo.py        # tạo file mp3 vào audio/nam/ và cập nhật js/data/vo_index.js

Đoạn nào đã có file mp3 thì bỏ qua (chạy lại an toàn). Cần có mạng và: pip install edge-tts
"""
import asyncio, json, os, sys

try:
    import edge_tts
except ImportError:
    sys.exit('Chưa cài edge-tts. Chạy: pip install edge-tts')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE = 'vi-VN-NamMinhNeural'   # giọng nam
RATE = '-4%'                    # đọc chậm hơn một chút cho dễ nghe
OUT = os.path.join(ROOT, 'audio', 'nam')
CONCURRENCY = 4
os.makedirs(OUT, exist_ok=True)

items = json.load(open(os.path.join(ROOT, 'tools', 'vo_manifest.json'), encoding='utf-8'))
if len(sys.argv) > 1 and sys.argv[1] == 'reverse':   # chạy song song với một tiến trình khác để nhanh hơn
    items = items[::-1]


async def one(sem, it, stats):
    path = os.path.join(OUT, it['key'] + '.mp3')
    if os.path.exists(path) and os.path.getsize(path) > 2000:
        stats['skip'] += 1
        return
    async with sem:
        if os.path.exists(path) and os.path.getsize(path) > 2000:   # tiến trình khác vừa tạo xong
            stats['skip'] += 1
            return
        for attempt in range(4):
            try:
                com = edge_tts.Communicate(it['text'], VOICE, rate=RATE)
                part = f'{path}.part{os.getpid()}'
                await com.save(part)
                os.replace(part, path)
                stats['ok'] += 1
                if stats['ok'] % 10 == 0:
                    print(f"  ... đã tạo {stats['ok']} file", flush=True)
                return
            except Exception as e:  # noqa
                await asyncio.sleep(2 + attempt * 2)
        stats['fail'] += 1
        print('  LỖI:', it['key'], it['text'][:50], flush=True)


async def main():
    sem = asyncio.Semaphore(CONCURRENCY)
    stats = {'ok': 0, 'skip': 0, 'fail': 0}
    await asyncio.gather(*(one(sem, it, stats) for it in items))
    print(f"Xong: tạo mới {stats['ok']}, đã có sẵn {stats['skip']}, lỗi {stats['fail']}")
    have = [it['key'] for it in items if os.path.exists(os.path.join(OUT, it['key'] + '.mp3')) and os.path.getsize(os.path.join(OUT, it['key'] + '.mp3')) > 2000]
    with open(os.path.join(ROOT, 'js', 'data', 'vo_index.js'), 'w', encoding='utf-8') as f:
        f.write('/* Danh sách lời kể đã có file giọng đọc (sinh tự động bởi tools/make_vo.py) */\n')
        f.write('(window.SBS = window.SBS || {}).VO_INDEX = ' + json.dumps({k: 1 for k in have}) + ';\n')
    print(f'Đã ghi js/data/vo_index.js với {len(have)} đoạn.')


asyncio.run(main())
