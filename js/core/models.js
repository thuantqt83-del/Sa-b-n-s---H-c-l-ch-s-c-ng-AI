/* Thư viện mô hình 3D low-poly cho sa bàn: nhà, cây, cứ điểm, binh khí, máy bay, cờ… */
(function () {
  'use strict';
  const SBS = window.SBS;
  const THREE = window.THREE;
  const U = SBS.util;
  const M = {};

  /* ---------- Màu theo phe ---------- */
  M.SIDE = {
    vn: { main: 0xd62839, uni: 0x5f7f3d, helm: 0x7d9b57 },
    fr: { main: 0x2d5fa8, uni: 0x6d7a99, helm: 0xb9b08a },
    us: { main: 0x1f7a8c, uni: 0x5d7a63, helm: 0x7a8c5a },
    sg: { main: 0x6c7a96, uni: 0x7c8aa6, helm: 0x9aa17a },
    ne: { main: 0xcfcfcf, uni: 0x9a9a9a, helm: 0xbbbbbb },
  };

  /* ---------- Hình học ghép ---------- */
  function paint(geo, hex) {
    const n = geo.attributes.position.count;
    const c = new THREE.Color(hex);
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
    geo.setAttribute('color', new THREE.BufferAttribute(a, 3));
    return geo;
  }
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
  function xf(geo, o) {
    o = o || {};
    _e.set(o.rx || 0, o.ry || 0, o.rz || 0);
    _q.setFromEuler(_e);
    _v.set(o.x || 0, o.y || 0, o.z || 0);
    const s = o.s || 1;
    _s.set(o.sx || s, o.sy || s, o.sz || s);
    _m.compose(_v, _q, _s);
    geo.applyMatrix4(_m);
    return geo;
  }
  function merge(list) {
    const parts = list.map((g) => (g.index ? g.toNonIndexed() : g));
    let total = 0;
    parts.forEach((g) => (total += g.attributes.position.count));
    const pos = new Float32Array(total * 3), nor = new Float32Array(total * 3), col = new Float32Array(total * 3);
    let o = 0;
    parts.forEach((g) => {
      pos.set(g.attributes.position.array, o * 3);
      nor.set(g.attributes.normal.array, o * 3);
      col.set(g.attributes.color.array, o * 3);
      o += g.attributes.position.count;
    });
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    out.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return out;
  }
  const box = (w, h, d, c, o) => xf(paint(new THREE.BoxGeometry(w, h, d), c), o);
  const cyl = (rt, rb, h, c, o, seg) => xf(paint(new THREE.CylinderGeometry(rt, rb, h, seg || 8), c), o);
  const cone = (r, h, c, o, seg) => xf(paint(new THREE.ConeGeometry(r, h, seg || 7), c), o);
  const sph = (r, c, o, ws, hs) => xf(paint(new THREE.SphereGeometry(r, ws || 8, hs || 6), c), o);
  const tor = (r, t, c, o, seg) => xf(paint(new THREE.TorusGeometry(r, t, 4, seg || 16), c), o);
  /* hình đa giác phẳng (cánh máy bay) nằm ngang: pts là (x, lùi-sau) */
  function slab(pts, thick, c, o) {
    const sh = new THREE.Shape();
    pts.forEach((p, i) => (i ? sh.lineTo(p[0], p[1]) : sh.moveTo(p[0], p[1])));
    const g = new THREE.ExtrudeGeometry(sh, { depth: thick, bevelEnabled: false });
    xf(g, { rx: -Math.PI / 2 });
    return xf(paint(g, c), o);
  }
  /* tô màu chuyển sắc theo độ cao (chân tối, ngọn sáng) cho tán lá */
  function tone(geo, lo, hi) {
    const p = geo.attributes.position, n = p.count, a = new Float32Array(n * 3);
    let y0 = 1e9, y1 = -1e9;
    for (let i = 0; i < n; i++) { const y = p.getY(i); if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const cl = new THREE.Color(lo), ch = new THREE.Color(hi), c = new THREE.Color();
    for (let i = 0; i < n; i++) { c.copy(cl).lerp(ch, (p.getY(i) - y0) / ((y1 - y0) || 1)); a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
    geo.setAttribute('color', new THREE.BufferAttribute(a, 3));
    return geo;
  }
  const lump = (r, lo, hi, o, ws, hs) => tone(xf(new THREE.SphereGeometry(r, ws || 7, hs || 5), o), lo, hi);
  const tier = (r, h, lo, hi, o, seg) => tone(xf(new THREE.ConeGeometry(r, h, seg || 8), o), lo, hi);
  /* mái nhà hai dốc: lăng trụ tam giác, đỉnh mái dọc theo trục x */
  function gable(w, h, d, c, o) {
    const sh = new THREE.Shape();
    sh.moveTo(-w / 2, 0); sh.lineTo(w / 2, 0); sh.lineTo(0, h); sh.lineTo(-w / 2, 0);
    const g = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false });
    xf(g, { z: -d / 2 });
    xf(g, { ry: Math.PI / 2 });
    return xf(paint(g, c), o);
  }
  M.mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  const cache = {};
  const memo = (k, f) => cache[k] || (cache[k] = f());

  /* ---------- Cây ---------- */
  M.treeGeo = function (kind) {
    return memo('tree:' + kind, () => {
      const trunk = 0x6b4a2b;
      if (kind === 'pine') // thông cao, thon
        return merge([cyl(0.1, 0.17, 1.1, trunk, { y: 0.55 }, 6),
          tier(1.0, 1.4, 0x1f4d2b, 0x2f6b3a, { y: 1.55 }, 8), tier(0.8, 1.3, 0x245a30, 0x3a7a42, { y: 2.25 }, 8),
          tier(0.6, 1.2, 0x2a6636, 0x468a4a, { y: 2.9 }, 8), tier(0.38, 1.0, 0x327540, 0x58a055, { y: 3.5 }, 8)]);
      if (kind === 'conifer') // cây lá kim vừa
        return merge([cyl(0.09, 0.14, 0.65, trunk, { y: 0.32 }, 5),
          tier(0.85, 1.15, 0x2b5f31, 0x3f7e43, { y: 1.1 }, 7), tier(0.62, 1.05, 0x336b38, 0x4c8c4a, { y: 1.65 }, 7), tier(0.38, 0.85, 0x3c7a41, 0x5ba058, { y: 2.15 }, 7)]);
      if (kind === 'tall') // cây gỗ cao, tán rộng
        return merge([cyl(0.12, 0.22, 2.1, 0x5e4126, { y: 1.05 }, 6), cyl(0.05, 0.08, 0.9, 0x5e4126, { x: 0.35, y: 2.1, rz: -0.9 }, 4), cyl(0.05, 0.08, 0.8, 0x5e4126, { x: -0.3, y: 2.0, rz: 0.9 }, 4),
          lump(0.95, 0x2b6a2f, 0x4f9444, { y: 2.55 }, 8, 6), lump(0.72, 0x2f7232, 0x58a04a, { x: 0.7, y: 2.4, z: 0.25 }, 7, 5),
          lump(0.68, 0x2c6c30, 0x54994a, { x: -0.65, y: 2.35, z: -0.3 }, 7, 5), lump(0.62, 0x357a37, 0x62ab52, { x: 0.05, y: 3.1, z: -0.05 }, 7, 5)]);
      if (kind === 'shrub') // bụi thấp
        return merge([lump(0.4, 0x3a7233, 0x62a44e, { y: 0.28 }, 7, 5), lump(0.3, 0x3f7a37, 0x6aae55, { x: 0.32, y: 0.22, z: 0.1 }, 6, 4), lump(0.28, 0x376f31, 0x5d9f4c, { x: -0.3, y: 0.2, z: -0.1 }, 6, 4)]);
      if (kind === 'palm')
        return merge([
          cyl(0.07, 0.11, 2.1, 0x8a6b43, { y: 1.05, rz: 0.08 }, 5),
          ...[0, 1, 2, 3, 4].map((i) => cone(0.16, 1.2, 0x4b9a3d, { x: 0.15, y: 2.15, rz: 1.7, ry: (i * Math.PI * 2) / 5 }, 3)),
        ]);
      if (kind === 'bamboo')
        return merge([cyl(0.04, 0.05, 2.0, 0x8aa84a, { x: -0.15, y: 1, rz: 0.1 }, 4), cyl(0.04, 0.05, 2.3, 0x7d9c42, { x: 0.1, y: 1.15, rz: -0.08 }, 4), cyl(0.04, 0.05, 1.8, 0x93b153, { z: 0.15, y: 0.9, rx: 0.1 }, 4), lump(0.55, 0x4f8a35, 0x78b24a, { y: 1.9, sy: 1.2 }, 6, 5)]);
      if (kind === 'reed') { // cây bông lau: thân mảnh cao, ngọn có chùm bông trắng xám xòe nhẹ
        const stalks = [[0, 0, 2.3, 0.26, 0.1], [0.12, 0.08, 2.0, -0.3, 0.2], [-0.1, 0.1, 2.55, -0.15, -0.3], [0.1, -0.12, 1.9, 0.36, -0.15], [-0.14, -0.06, 2.1, 0.05, 0.36], [0.02, 0.14, 1.7, -0.12, 0.3], [0.18, -0.02, 2.25, 0.45, 0.02]];
        const parts = [];
        stalks.forEach(([x, z, L, ox, oz]) => {
          const rz = -Math.asin(ox / L), rx = Math.asin(oz / L);
          parts.push(cyl(0.022, 0.04, L, 0x9c9f58, { x: x + ox / 2, y: L / 2, z: z + oz / 2, rx, rz }, 4));
          parts.push(lump(0.12, 0xcfc8b0, 0xf9f5ea, { x: x + ox * 1.03, y: L + 0.12, z: z + oz * 1.03, sy: 3.3, rx, rz }, 6, 5)); // chùm bông
        });
        [0, 1, 2, 3].forEach((i) => { const a = (i * Math.PI) / 2 + 0.4; parts.push(cone(0.07, 1.3, 0x8fa648, { x: Math.cos(a) * 0.2, y: 0.6, z: Math.sin(a) * 0.2, rz: -Math.cos(a) * 0.55, rx: Math.sin(a) * 0.55 }, 3)); }); // lá lau
        return merge(parts);
      }
      // 'broad': cây lá rộng thấp, tán xòe tròn
      return merge([cyl(0.1, 0.15, 0.75, trunk, { y: 0.37 }, 5),
        lump(0.66, 0x3a7a33, 0x62a64f, { y: 1.05 }, 7, 5), lump(0.5, 0x3f8036, 0x6bb055, { x: 0.45, y: 1.15, z: 0.12 }, 6, 5),
        lump(0.48, 0x377535, 0x5fa24d, { x: -0.4, y: 1.1, z: -0.2 }, 6, 5), lump(0.42, 0x448a3a, 0x72b85b, { x: 0.05, y: 1.6, z: -0.05 }, 6, 4)]);
    });
  };

  /* ---------- Bụi lúa (ruộng lúa xanh / lúa chín) ---------- */
  M.riceGeo = function (kind) {
    return memo('rice:' + kind, () => {
      const lo = kind === 'gold' ? 0xb9953a : 0x4f9f33, hi = kind === 'gold' ? 0xf2d86a : 0x9edc5a;
      const parts = [];
      [[0, 0, 0, 0], [0.1, 0.05, 0.28, 0.15], [-0.1, 0.06, -0.3, 0.18], [0.04, -0.1, 0.12, -0.3], [-0.06, -0.08, -0.2, -0.28]].forEach(([x, z, rz, rx]) => parts.push(tier(0.06, 0.62, lo, hi, { x, y: 0.31, z, rz, rx }, 3)));
      return merge(parts);
    });
  };

  /* ---------- Nhà ---------- */
  M.houseGeo = function (style) {
    return memo('house:' + style, () => {
      switch (style) {
        case 'thatch':
          return merge([box(1.5, 0.7, 1.1, 0xa98b5f, { y: 0.35 }), cone(1.25, 0.9, 0xc9a85a, { y: 1.15, ry: Math.PI / 4 }, 4)]);
        case 'stilt': {
          const wood = 0x8a5a33, dark = 0x5c3b20, wall = 0xc4905a, thatch = 0xb9954f, door = 0x4a2f18;
          const posts = [];
          [-0.95, 0, 0.95].forEach((x) => [-0.6, 0.6].forEach((z) => posts.push(cyl(0.065, 0.08, 0.98, dark, { x, z, y: 0.49 }, 5))));
          return merge([
            ...posts,
            box(2.5, 0.12, 1.7, wood, { y: 1.0 }), // sàn
            box(2.05, 0.8, 1.3, wall, { y: 1.46 }), // thân nhà (vách)
            box(0.36, 0.34, 0.05, door, { x: -0.55, y: 1.52, z: 0.66 }), box(0.36, 0.34, 0.05, door, { x: 0.6, y: 1.52, z: 0.66 }), // cửa sổ
            box(0.42, 0.66, 0.05, door, { x: 0.02, y: 1.38, z: 0.66 }), // cửa chính
            box(2.2, 0.07, 0.55, wood, { y: 1.0, z: 1.05 }), // sàn phơi trước nhà
            box(0.07, 0.4, 0.07, dark, { x: -1.05, y: 1.25, z: 1.3 }), box(0.07, 0.4, 0.07, dark, { x: 1.05, y: 1.25, z: 1.3 }),
            box(0.4, 0.05, 1.15, wood, { x: 0.55, y: 0.5, z: 1.55, rx: -0.78 }), // cầu thang
            gable(2.0, 1.0, 2.9, thatch, { y: 1.86 }), // mái dốc, lợp tranh
            box(2.95, 0.07, 0.1, 0x8f6f38, { y: 2.86 }), // nóc mái
            box(0.05, 0.55, 0.05, dark, { x: -1.5, y: 3.05, rz: 0.45 }), box(0.05, 0.55, 0.05, dark, { x: -1.5, y: 3.05, rz: -0.45 }), // khau cút
            box(0.05, 0.55, 0.05, dark, { x: 1.5, y: 3.05, rz: 0.45 }), box(0.05, 0.55, 0.05, dark, { x: 1.5, y: 3.05, rz: -0.45 }),
          ]);
        }
        case 'shop':
          return merge([box(1.1, 1.5, 1.1, 0xe8dcc0, { y: 0.75 }), box(1.25, 0.14, 1.25, 0xb8553a, { y: 1.55 }), box(0.5, 0.5, 0.05, 0x5b7fa3, { y: 0.9, z: 0.56 })]);
        case 'tower':
          return merge([box(1.3, 2.6, 1.3, 0xd9d6cc, { y: 1.3 }), box(1.4, 0.15, 1.4, 0x8d8a82, { y: 2.65 }), box(0.9, 0.12, 0.05, 0x3b4b63, { y: 1.8, z: 0.66 }), box(0.9, 0.12, 0.05, 0x3b4b63, { y: 1.0, z: 0.66 })]);
        case 'tent':
          return merge([cone(1.0, 1.1, 0x6f7d4a, { y: 0.55, ry: Math.PI / 4 }, 4)]);
        default: // ngói đỏ
          return merge([box(1.6, 0.9, 1.2, 0xe9dfc4, { y: 0.45 }), cone(1.3, 0.85, 0xa5442c, { y: 1.3, ry: Math.PI / 4, sz: 0.8 }, 4)]);
      }
    });
  };

  /* ---------- Cứ điểm / công sự ---------- */
  /* Cứ điểm trên đỉnh đồi: vài lô cốt thấp, gọn (không còn vòng bao cát hình bánh răng) */
  M.bunkerGeo = function (r) {
    return memo('bunker:' + r, () => {
      const k = r / 1.5;
      return merge([
        cyl(r * 0.78, r * 0.9, 0.22, 0x8a7650, { y: 0.11 }, 12), // nền đất đắp
        box(0.95 * k, 0.42, 0.7 * k, 0x9d9a8c, { y: 0.43, x: -0.25 * k }), // lô cốt chính
        box(1.0 * k, 0.1, 0.78 * k, 0x7f7c70, { y: 0.69, x: -0.25 * k }), // mái
        box(0.3 * k, 0.07, 0.08, 0x23201c, { y: 0.45, x: -0.25 * k, z: 0.36 * k }), // lỗ châu mai
        box(0.5 * k, 0.3, 0.4 * k, 0x93907f, { y: 0.37, x: 0.5 * k, z: -0.3 * k }), // lô cốt phụ
        box(0.55 * k, 0.08, 0.45 * k, 0x7a776b, { y: 0.55, x: 0.5 * k, z: -0.3 * k }),
        box(0.42 * k, 0.28, 0.34 * k, 0x93907f, { y: 0.36, x: 0.42 * k, z: 0.42 * k }),
        box(0.46 * k, 0.07, 0.38 * k, 0x7a776b, { y: 0.53, x: 0.42 * k, z: 0.42 * k }),
        cyl(0.03, 0.03, 1.0, 0x555555, { y: 0.9, x: -0.7 * k, z: -0.3 * k }, 4), // cột ăng-ten
      ]);
    });
  };
  M.trenchGeo = function (len) {
    return memo('trench:' + len, () => merge([box(len, 0.12, 0.5, 0x6b5a3c, { y: 0.06 }), box(len, 0.2, 0.12, 0x8a7650, { y: 0.14, z: 0.3 })]));
  };

  /* ---------- Quân ---------- */
  M.soldierGeo = function (side) {
    return memo('sol:' + side, () => {
      const c = M.SIDE[side] || M.SIDE.ne;
      return merge([
        cyl(0.13, 0.16, 0.5, c.uni, { y: 0.35 }, 5),
        sph(0.12, 0xe0b890, { y: 0.72 }, 5, 4),
        cone(0.17, 0.12, c.helm, { y: 0.85 }, 6),
        box(0.04, 0.04, 0.55, 0x2a2a2a, { x: 0.14, y: 0.45, z: 0.12 }),
      ]);
    });
  };
  M.bikeGeo = function () {
    return memo('bike', () =>
      merge([
        tor(0.2, 0.03, 0x222222, { y: 0.22, z: 0.3, ry: Math.PI / 2 }, 10),
        tor(0.2, 0.03, 0x222222, { y: 0.22, z: -0.3, ry: Math.PI / 2 }, 10),
        box(0.05, 0.05, 0.7, 0x444444, { y: 0.35 }),
        box(0.5, 0.45, 0.8, 0x7a6a3c, { y: 0.62 }),
        sph(0.18, 0x5f7f3d, { y: 0.98, z: 0.1 }, 5, 4),
        cone(0.26, 0.1, 0x6d8a47, { y: 1.12, z: 0.1 }, 7),
      ]),
    );
  };

  /* ---------- Binh khí ---------- */
  const OLIVE = 0x5c6b3a, DARK = 0x2e2e2e, GREY = 0x8a8f94;
  M.vehicleGeo = function (kind, side) {
    return memo('veh:' + kind + side, () => {
      const col = side === 'vn' ? OLIVE : side === 'fr' ? 0x6a7280 : side === 'us' ? 0x6d7765 : 0x74806a;
      switch (kind) {
        case 'tank':
          return merge([
            box(1.9, 0.5, 1.0, col, { y: 0.42 }), box(2.0, 0.25, 0.28, DARK, { y: 0.28, z: 0.58 }), box(2.0, 0.25, 0.28, DARK, { y: 0.28, z: -0.58 }),
            cyl(0.42, 0.46, 0.3, col, { y: 0.82 }, 10), cyl(0.07, 0.07, 1.5, 0x3a3a3a, { y: 0.84, x: 0.9, rz: Math.PI / 2 }, 6),
          ]);
        case 'apc':
          return merge([box(1.7, 0.7, 0.95, col, { y: 0.55 }), box(0.5, 0.45, 0.95, col, { y: 0.4, x: 1.0, rz: -0.35 }), box(1.8, 0.22, 0.2, DARK, { y: 0.2, z: 0.55 }), box(1.8, 0.22, 0.2, DARK, { y: 0.2, z: -0.55 }), cyl(0.05, 0.05, 0.45, 0x333333, { y: 1.05, x: -0.1, rz: 0.2 }, 5)]);
        case 'truck':
          return merge([
            box(0.7, 0.65, 0.9, col, { y: 0.7, x: 0.95 }), box(1.7, 0.5, 0.95, 0x7a6a3c, { y: 0.78, x: -0.2 }), box(1.7, 0.08, 0.9, 0x6b5a30, { y: 1.08, x: -0.2 }),
            ...[[0.95, 0.5], [0.95, -0.5], [-0.8, 0.5], [-0.8, -0.5]].map((p) => cyl(0.24, 0.24, 0.2, DARK, { x: p[0], z: p[1], y: 0.24, rx: Math.PI / 2 }, 8)),
          ]);
        case 'jeep':
          return merge([box(1.0, 0.4, 0.7, col, { y: 0.4 }), box(0.4, 0.3, 0.7, 0x4a4a4a, { y: 0.7, x: -0.1 }), ...[[0.35, 0.38], [0.35, -0.38], [-0.35, 0.38], [-0.35, -0.38]].map((p) => cyl(0.16, 0.16, 0.12, DARK, { x: p[0], z: p[1], y: 0.16, rx: Math.PI / 2 }, 8))]);
        case 'gun':
          return merge([cyl(0.09, 0.12, 1.8, 0x3d4a2c, { y: 0.7, x: 0.7, rz: Math.PI / 2 - 0.35 }, 6), box(0.5, 0.45, 0.8, col, { y: 0.4 }), cyl(0.28, 0.28, 0.08, DARK, { y: 0.28, z: 0.45, rx: Math.PI / 2 }, 8), cyl(0.28, 0.28, 0.08, DARK, { y: 0.28, z: -0.45, rx: Math.PI / 2 }, 8)]);
        case 'aaa':
          return merge([cyl(0.35, 0.4, 0.3, 0x4a5030, { y: 0.15 }, 8), box(0.5, 0.5, 0.5, col, { y: 0.55 }), cyl(0.05, 0.05, 1.5, 0x2a2a2a, { y: 1.1, x: 0.3, z: 0.14, rz: 0.9 }, 5), cyl(0.05, 0.05, 1.5, 0x2a2a2a, { y: 1.1, x: 0.3, z: -0.14, rz: 0.9 }, 5)]);
        case 'sam':
          return merge([
            box(1.2, 0.2, 1.2, 0x4a5030, { y: 0.1 }), box(0.35, 0.5, 0.35, col, { y: 0.45 }),
            cyl(0.1, 0.1, 2.6, 0xe9e9e4, { y: 1.1, x: 0.5, z: 0.18, rz: 1.15 }, 6), cone(0.1, 0.35, 0xc53030, { y: 1.88, x: 1.22, z: 0.18, rz: -0.42 }, 6),
            cyl(0.1, 0.1, 2.6, 0xe9e9e4, { y: 1.1, x: 0.5, z: -0.18, rz: 1.15 }, 6), cone(0.1, 0.35, 0xc53030, { y: 1.88, x: 1.22, z: -0.18, rz: -0.42 }, 6),
            box(0.9, 0.7, 0.08, 0x777777, { y: 0.9, x: -0.7, ry: 0.3 }),
          ]);
        case 'boat':
          return merge([box(2.2, 0.35, 0.8, col, { y: 0.25 }), cone(0.4, 0.8, col, { y: 0.25, x: 1.3, rz: -Math.PI / 2 }, 4), box(0.7, 0.45, 0.6, 0xb8b8b0, { y: 0.65, x: -0.2 }), cyl(0.03, 0.03, 0.6, 0x333333, { y: 1.1, x: -0.2 }, 4)]);
        case 'radar':
          return merge([box(0.5, 0.5, 0.5, col, { y: 0.25 }), cyl(0.06, 0.06, 0.5, 0x444444, { y: 0.7 }, 5), cone(0.55, 0.25, 0xbdbdbd, { y: 1.1, rx: Math.PI * 0.6 }, 12)]);
        default:
          return box(1, 0.5, 0.7, col, { y: 0.3 });
      }
    });
  };

  /* ---------- Máy bay (hướng mũi = +z) ---------- */
  M.planeGeo = function (kind) {
    return memo('plane:' + kind, () => {
      if (kind === 'b52') {
        const wing = [[0, -0.5], [6.2, 2.0], [6.2, 2.9], [0, 1.4]];
        const wingL = wing.map((p) => [-p[0], p[1]]);
        const tail = [[0, 3.0], [1.9, 3.9], [1.9, 4.3], [0, 4.0]];
        const tailL = tail.map((p) => [-p[0], p[1]]);
        return merge([
          cyl(0.34, 0.26, 8.2, 0xd2d2cc, { rx: Math.PI / 2 }, 8), cone(0.34, 0.8, 0xc4c4be, { z: 4.4, rx: Math.PI / 2 }, 8),
          slab(wing, 0.14, 0xb9bcc0, { y: 0.02 }), slab(wingL, 0.14, 0xb9bcc0, { y: 0.02 }),
          slab(tail, 0.1, 0xb9bcc0), slab(tailL, 0.1, 0xb9bcc0), box(0.1, 1.3, 1.0, 0xb4b7bb, { y: 0.65, z: -3.3 }),
          ...[-3.6, -2.2, 2.2, 3.6].map((x) => cyl(0.18, 0.18, 1.0, 0x6a6e72, { x, y: -0.22, z: x > 0 ? 0.6 + (x - 2.2) * 0.2 : 0.6 + (-x - 2.2) * 0.2 - 0.0, rx: Math.PI / 2 }, 6)),
        ]);
      }
      if (kind === 'mig') {
        const w = [[0, -0.3], [1.9, 1.5], [1.9, 1.9], [0, 1.5]];
        return merge([
          cyl(0.2, 0.17, 4.2, 0xa9aeb3, { rx: Math.PI / 2 }, 7), cone(0.2, 0.7, 0x8f969c, { z: 2.4, rx: Math.PI / 2 }, 7),
          slab(w, 0.08, 0xa0a6ac), slab(w.map((p) => [-p[0], p[1]]), 0.08, 0xa0a6ac), box(0.06, 0.7, 0.8, 0x969ca2, { y: 0.4, z: -1.8 }),
          sph(0.17, 0x3a5a7a, { y: 0.2, z: 0.6, sz: 1.8 }, 6, 4),
        ]);
      }
      if (kind === 'f4') {
        const w = [[0, -0.2], [2.2, 1.2], [2.2, 1.7], [0, 1.4]];
        return merge([
          cyl(0.25, 0.2, 4.6, 0x7d8a6a, { rx: Math.PI / 2 }, 7), cone(0.25, 0.8, 0x6d7a5a, { z: 2.6, rx: Math.PI / 2 }, 7),
          slab(w, 0.1, 0x6f7c5c, { y: 0.0 }), slab(w.map((p) => [-p[0], p[1]]), 0.1, 0x6f7c5c), box(0.07, 0.9, 0.9, 0x6a7757, { y: 0.5, z: -2.0 }),
        ]);
      }
      if (kind === 'dak') {
        const w = [[0, 0], [3.4, 0], [3.4, 0.9], [0, 1.1]];
        return merge([
          cyl(0.35, 0.22, 4.6, 0xb9bcc0, { rx: Math.PI / 2 }, 7), slab(w, 0.12, 0xa8acb0, { y: 0.05 }), slab(w.map((p) => [-p[0], p[1]]), 0.12, 0xa8acb0, { y: 0.05 }),
          cyl(0.2, 0.2, 0.6, 0x444444, { x: 1.4, z: 0.4, rx: Math.PI / 2 }, 6), cyl(0.2, 0.2, 0.6, 0x444444, { x: -1.4, z: 0.4, rx: Math.PI / 2 }, 6),
          box(0.08, 0.9, 0.8, 0x9a9ea2, { y: 0.5, z: -2.0 }), slab([[0, -2.2], [1.1, -2.0], [1.1, -1.6], [0, -1.6]], 0.08, 0xa8acb0), slab([[0, -2.2], [-1.1, -2.0], [-1.1, -1.6], [0, -1.6]], 0.08, 0xa8acb0),
        ]);
      }
      return box(1, 0.3, 2, 0x999999);
    });
  };
  M.heliParts = function (side) {
    const col = side === 'vn' ? OLIVE : 0x66705a;
    const body = merge([sph(0.5, col, { sx: 1.0, sy: 0.8, sz: 1.6, y: 0.5 }, 8, 6), cyl(0.07, 0.12, 1.7, col, { z: -1.5, y: 0.6, rx: Math.PI / 2 }, 5), box(0.04, 0.5, 0.25, col, { y: 0.8, z: -2.3 }), box(1.0, 0.05, 0.08, 0x333333, { y: 0.1, z: 0.3 }), box(1.0, 0.05, 0.08, 0x333333, { y: 0.1, z: -0.3 })]);
    const rotor = merge([box(3.4, 0.03, 0.14, 0x222222, { y: 0.97 }), box(0.14, 0.03, 3.4, 0x222222, { y: 0.97 }), cyl(0.06, 0.06, 0.15, 0x222222, { y: 0.9 }, 5)]);
    return { body, rotor };
  };

  /* ---------- Cờ ---------- */
  const flagTex = {};
  M.flagTexture = function (kind) {
    if (flagTex[kind]) return flagTex[kind];
    const cv = document.createElement('canvas');
    cv.width = 128; cv.height = 80;
    const g = cv.getContext('2d');
    const star = (cx, cy, r, col) => {
      g.fillStyle = col; g.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.4 : r;
        g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      g.closePath(); g.fill();
    };
    if (kind === 'vn') { g.fillStyle = '#da251d'; g.fillRect(0, 0, 128, 80); star(64, 42, 26, '#ffff00'); }
    else if (kind === 'nlf') { g.fillStyle = '#d32f2f'; g.fillRect(0, 0, 128, 40); g.fillStyle = '#1e5fb4'; g.fillRect(0, 40, 128, 40); star(64, 40, 22, '#ffe600'); }
    else if (kind === 'fr') { g.fillStyle = '#1f3f93'; g.fillRect(0, 0, 43, 80); g.fillStyle = '#f5f5f5'; g.fillRect(43, 0, 42, 80); g.fillStyle = '#d02a2a'; g.fillRect(85, 0, 43, 80); }
    else if (kind === 'sg') { g.fillStyle = '#ffd200'; g.fillRect(0, 0, 128, 80); g.fillStyle = '#d02a2a'; [20, 38, 56].forEach((y) => g.fillRect(8, y, 112, 6)); }
    else { g.fillStyle = '#f2f2f2'; g.fillRect(0, 0, 128, 80); g.fillStyle = '#b22234'; for (let i = 0; i < 7; i++) g.fillRect(0, i * 12, 128, 6); g.fillStyle = '#3c3b6e'; g.fillRect(0, 0, 56, 44); }
    const t = new THREE.CanvasTexture(cv);
    t.anisotropy = 4;
    flagTex[kind] = t;
    return t;
  };
  M.makeFlag = function (kind, scale) {
    const s = scale || 1;
    const g = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * s, 0.05 * s, 3.2 * s, 5), new THREE.MeshLambertMaterial({ color: 0xdddddd }));
    pole.position.y = 1.6 * s; g.add(pole);
    const geo = new THREE.PlaneGeometry(1.7 * s, 1.1 * s, 10, 4);
    const cloth = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: M.flagTexture(kind), side: THREE.DoubleSide }));
    cloth.position.set(0.86 * s, 2.65 * s, 0);
    g.add(cloth);
    g.userData.cloth = cloth;
    g.userData.base = geo.attributes.position.array.slice();
    g.userData.update = function (t) {
      const p = geo.attributes.position, b = g.userData.base;
      for (let i = 0; i < p.count; i++) {
        const x = b[i * 3] / (1.7 * s) + 0.5;
        p.setZ(i, Math.sin(t * 4 + x * 5) * 0.18 * s * x);
      }
      p.needsUpdate = true;
    };
    return g;
  };

  /* ---------- Công trình lớn ---------- */
  M.palaceGeo = function () {
    return memo('palace', () => {
      const parts = [
        box(6.0, 0.4, 3.0, 0xb9b4a6, { y: 0.2 }), box(5.4, 1.1, 2.5, 0xf1efe6, { y: 0.95 }), box(5.6, 0.12, 2.7, 0xcfcabb, { y: 1.55 }),
        box(4.6, 1.0, 2.1, 0xf6f4ec, { y: 2.1 }), box(4.8, 0.12, 2.3, 0xcfcabb, { y: 2.66 }), box(1.6, 0.9, 1.4, 0xfbfaf4, { y: 3.15 }), box(1.8, 0.1, 1.6, 0xb9b4a6, { y: 3.65 }),
      ];
      for (let i = 0; i < 9; i++) parts.push(cyl(0.07, 0.07, 1.0, 0xe2ded0, { x: -2.2 + i * 0.55, y: 1.0, z: 1.3 }, 5));
      for (let i = 0; i < 12; i++) parts.push(box(0.1, 0.9, 0.06, 0x8f8a7c, { x: -2.0 + i * 0.36, y: 2.1, z: 1.07 }));
      return merge(parts);
    });
  };
  M.hangarGeo = function () {
    return memo('hangar', () => merge([box(2.4, 0.9, 1.4, 0x9aa0a6, { y: 0.45 }), cyl(0.7, 0.7, 2.4, 0xaab0b6, { y: 0.9, rz: Math.PI / 2, sy: 1 }, 8)]));
  };
  M.craneGeo = function () {
    return memo('crane', () => merge([box(0.18, 2.0, 0.18, 0xd9a21a, { y: 1.0 }), box(1.8, 0.12, 0.12, 0xd9a21a, { y: 2.0, x: 0.6 }), box(0.04, 0.9, 0.04, 0x333333, { y: 1.5, x: 1.3 })]));
  };
  M.shipGeo = function () {
    return memo('ship', () => merge([box(4.2, 0.6, 1.2, 0x39455a, { y: 0.35 }), cone(0.6, 1.0, 0x39455a, { x: 2.5, y: 0.35, rz: -Math.PI / 2 }, 4), box(1.2, 0.9, 0.9, 0xe8e8e0, { y: 1.1, x: -1.0 }), box(0.5, 0.4, 0.6, 0xc9322b, { y: 1.8, x: -1.0 })]));
  };

  SBS.models = Object.assign(M, { paint, xf, merge, box, cyl, cone, sph, tor });
})();
