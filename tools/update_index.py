# -*- coding: utf-8 -*-
"""Cập nhật js/data/vo_index.js theo các file mp3 hiện có trong audio/nam (không cần mạng)."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
items = json.load(open(os.path.join(ROOT, 'tools', 'vo_manifest.json'), encoding='utf-8'))
have = [it['key'] for it in items if os.path.exists(os.path.join(ROOT, 'audio', 'nam', it['key'] + '.mp3')) and os.path.getsize(os.path.join(ROOT, 'audio', 'nam', it['key'] + '.mp3')) > 2000]
with open(os.path.join(ROOT, 'js', 'data', 'vo_index.js'), 'w', encoding='utf-8') as f:
    f.write('/* Danh sách lời kể đã có file giọng đọc (sinh tự động bởi tools/make_vo.py) */\n')
    f.write('(window.SBS = window.SBS || {}).VO_INDEX = ' + json.dumps({k: 1 for k in have}) + ';\n')
print(f'Đã ghi js/data/vo_index.js: {len(have)}/{len(items)} đoạn có giọng đọc.')
