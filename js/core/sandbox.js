/* Sa bàn 3D – phần lõi: địa hình, sông, đường, rừng, địa danh, camera, vòng lặp */
(function () {
  'use strict';
  const SBS = window.SBS;
  const THREE = window.THREE;
  const U = SBS.util;
  const M = SBS.models;

  const C = (h) => new THREE.Color(h);
  const PAL = {
    forest: { low: C(0x4f7f3a), mid: C(0x3b6a2e), high: C(0x6d6a46), peak: C(0x9a9482), sand: C(0xc2b480), road: C(0xc4a977) },
    valley: { low: C(0x5c8d42), mid: C(0x417230), high: C(0x6a6544), peak: C(0x978f7e), sand: C(0xc2b480), road: C(0xc4a977) },
    delta: { low: C(0x70a244), mid: C(0x5e9139), high: C(0x5e9139), peak: C(0x5e9139), sand: C(0xc5b784), road: C(0xbfa97c), paddy: true },
    urban: { low: C(0x5f8a45), mid: C(0x4f7a3a), high: C(0x7a7852), peak: C(0x9a9482), sand: C(0xc2b480), road: C(0xb3a484) },
    highland: { low: C(0x60903f), mid: C(0x7a8c41), high: C(0x6c6044), peak: C(0x9a9482), sand: C(0xcdbe88), road: C(0xc4a977) },
  };
  const WATER_Y = 0.02;

  /* khoảng cách từ điểm tới đường gấp khúc */
  function distPoly(x, z, pts) {
    let best = 1e9;
    for (let i = 0; i < pts.length - 1; i++) {
      const ax = pts[i][0], az = pts[i][1], bx = pts[i + 1][0], bz = pts[i + 1][1];
      const dx = bx - ax, dz = bz - az;
      const l2 = dx * dx + dz * dz;
      let t = l2 ? ((x - ax) * dx + (z - az) * dz) / l2 : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const px = ax + dx * t - x, pz = az + dz * t - z;
      const d = px * px + pz * pz;
      if (d < best) best = d;
    }
    return Math.sqrt(best);
  }

  /* ruộng lúa: mỗi ô 5×5 một sắc xanh / vàng, có bờ ruộng; băm theo ô để màu nền và bụi lúa khớp nhau */
  const PLOT = 5;
  const plotHash = (cx, cz) => { const v = Math.sin(cx * 12.9898 + cz * 78.233) * 43758.5453; return v - Math.floor(v); };
  const plotKind = (f, cx, cz) => (f.kind === 'mix' ? (plotHash(cx, cz) > 0.5 ? 'gold' : 'green') : f.kind || 'green');
  const nearSettlement = (places, x, z, pad) => { for (let i = 0; i < places.length; i++) { const p = places[i]; if (Math.hypot(x - p.x, z - p.z) < (p.r || 3) + pad) return true; } return false; };

  class Sandbox {
    constructor(stage) {
      this.stage = stage;
      this.canvas = stage.querySelector('canvas');
      this.layer = stage.querySelector('.labels');
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(36, 1, 1, 700);
      this.hemi = new THREE.HemisphereLight(0xdde8ff, 0x5a4f3a, 0.52);
      this.sun = new THREE.DirectionalLight(0xfff0d0, 0.66);
      this.sun.position.set(45, 80, 35);
      const sc = this.sun.shadow.camera;
      sc.left = -75; sc.right = 75; sc.top = 75; sc.bottom = -75; sc.near = 10; sc.far = 260;
      this.sun.shadow.bias = -0.0006;
      this.scene.add(this.hemi, this.sun, this.sun.target);
      this.world = new THREE.Group();
      this.actors = new THREE.Group();
      this.scene.add(this.world, this.actors);

      this.cam = { x: 0, y: 0, z: 0, d: 110, yaw: 0, pitch: 0.95 };
      this.goal = { ...this.cam };
      this.time = 0;
      this.paused = false;
      this.running = false;
      this.autoRotate = 0;
      this.shake = 0;
      this.quality = 'high';
      this.dScale = 1;
      this.followOn = false;
      this.onArrowClick = null;
      this.map = null;
      this.size = 100;
      this.timers = []; this.tweens = []; this.units = {}; this.arrows = []; this.parts = []; this.emitters = [];
      this.flags = []; this.marks = []; this.labels = []; this.rings = []; this.pulses = []; this.misc = [];
      this.anims = [];

      this.capEl = U.h('div', { class: 'sb-cap' });
      this.compass = U.h('div', { class: 'compass', html: '<i></i><b>B</b>' });
      this.layer.append(this.capEl, this.compass);
      this._bindInput();
      this._ro = new ResizeObserver(() => this.resize());
      this._ro.observe(stage);
      this.setQuality(SBS.store ? SBS.store.settings.quality : 'high');
      this.resize();
    }

    /* ---------- cấu hình ---------- */
    setQuality(q) {
      this.quality = q;
      this.renderer.shadowMap.enabled = q === 'high';
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.sun.castShadow = q === 'high';
      if (q === 'high') this.sun.shadow.mapSize.set(2048, 2048);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q === 'high' ? 2 : 1));
      this.resize();
    }
    resize() {
      const w = this.stage.clientWidth, h = this.stage.clientHeight;
      if (!w || !h) return;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.w = w; this.h = h;
      this.dScale = U.clamp(1.5 / (w / h), 1, 1.9); // khung hình hẹp thì lùi camera để thấy đủ sa bàn
    }
    start() {
      if (this.running) return;
      this.running = true;
      this.last = performance.now();
      const loop = (now) => {
        if (!this.running) return;
        requestAnimationFrame(loop);
        const dt = Math.min(0.2, (now - this.last) / 1000); // thời gian chạy theo đồng hồ thật để mũi tên, tiếng binh khí luôn khớp lời kể kể cả máy chậm
        this.last = now;
        this.update(dt);
        this.renderer.render(this.scene, this.camera);
      };
      requestAnimationFrame(loop);
    }
    stop() { this.running = false; }

    /* ---------- chiều cao địa hình ---------- */
    _buildHeight(map) {
      const T = map.terrain || {};
      const noise = U.makeNoise(T.seed || 7);
      const S = map.size || 100;
      const blobs = (T.blobs || []).slice(), ridges = T.ridges || [], rivers = T.rivers || [];
      // mỗi cứ điểm (bunker) nằm trên một quả đồi: sườn dốc, đỉnh bằng
      const places = Object.values(map.places || {});
      this.hills = [];
      places.forEach((p) => {
        if (p.type === 'bunker' && p.hill !== false) {
          const hl = p.hill || [4.6, 2.6];
          blobs.push([p.x, p.z, hl[0], hl[1], true]);
          this.hills.push({ x: p.x, z: p.z, r: hl[0] });
          if (!p.flat) p.flat = (p.r || 1.5) * 1.35;
        }
      });
      const flats = places.filter((p) => p.flat);
      const base = T.base != null ? T.base : 0.6, rough = T.rough != null ? T.rough : 1.5, nf = T.nf || 0.045;
      const rel = T.relief || 1; // hệ số nhấn độ cao đồi núi
      const sea = T.sea;
      const H0 = (x, z) => {
        let h = base + (noise.fbm(x * nf + 31, z * nf + 17, 4) - 0.5) * 2 * rough * rel;
        for (let i = 0; i < blobs.length; i++) {
          const b = blobs[i], dx = x - b[0], dz = z - b[1], s = b[2] / 2;
          h += b[3] * (b[4] ? 1 : b[3] > 0 ? rel : 1) * Math.exp(-(dx * dx + dz * dz) / (2 * s * s));
        }
        for (let i = 0; i < ridges.length; i++) {
          const r = ridges[i], d = distPoly(x, z, r.pts), s = r.w / 2;
          h += r.h * rel * Math.exp(-(d * d) / (2 * s * s)) * (0.75 + 0.5 * noise(x * 0.12, z * 0.12));
        }
        if (sea) {
          const de = sea.edge === 'e' ? S / 2 - x : sea.edge === 'w' ? x + S / 2 : sea.edge === 'n' ? z + S / 2 : S / 2 - z;
          if (de < sea.w) h -= (sea.depth || 2.4) * (1 - U.smoothstep(0, sea.w, de));
        }
        return h;
      };
      flats.forEach((p) => (p._h = H0(p.x, p.z) + (p.up || 0)));
      const H = (x, z) => {
        let h = H0(x, z);
        for (let i = 0; i < flats.length; i++) {
          const p = flats[i], d = Math.hypot(x - p.x, z - p.z);
          if (d < p.flat * 1.9) h = U.lerp(h, p._h, 1 - U.smoothstep(p.flat, p.flat * 1.9, d));
        }
        for (let i = 0; i < rivers.length; i++) {
          const r = rivers[i], d = distPoly(x, z, r.pts);
          const k = 1 - U.smoothstep(r.w * 0.45, r.w * 1.9, d);
          if (k > 0) h = U.lerp(h, Math.min(h, -0.35), k);
        }
        return h;
      };
      return { H, noise };
    }

    groundY(x, z) {
      const S = this.size, n = this.seg, g = this.grid;
      if (!g) return 0;
      let u = ((x + S / 2) / S) * n, v = ((z + S / 2) / S) * n;
      u = U.clamp(u, 0, n - 0.001); v = U.clamp(v, 0, n - 0.001);
      const i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j, w = n + 1;
      const a = g[j * w + i], b = g[j * w + i + 1], c = g[(j + 1) * w + i], d = g[(j + 1) * w + i + 1];
      return U.lerp(U.lerp(a, b, fu), U.lerp(c, d, fu), fv);
    }
    xz(ref) {
      if (typeof ref === 'string') {
        const p = this.map.places[ref];
        const un = !p && this.units && this.units[ref]; // tên một đơn vị đang có trên sa bàn (vd. khẩu pháo)
        if (un) return [un.group.position.x, un.group.position.z];
        if (!p) { console.warn('Không có địa danh', ref); return [0, 0]; }
        return [p.x, p.z];
      }
      if (Array.isArray(ref)) return [ref[0], ref[1]];
      return [ref.x, ref.z];
    }
    pos(ref, lift) {
      const un = typeof ref === 'string' && !this.map.places[ref] && this.units && this.units[ref]; // đơn vị đang có trên sa bàn: lấy đúng độ cao của nó (vd. trực thăng)
      if (un) return new THREE.Vector3(un.group.position.x, un.group.position.y + (lift || 0), un.group.position.z);
      const [x, z] = this.xz(ref);
      return new THREE.Vector3(x, this.groundY(x, z) + (lift || 0), z);
    }

    /* ---------- nạp bản đồ ---------- */
    load(map) {
      this.clearAll();
      this.map = map;
      const S = (this.size = map.size || 100);
      const seg = (this.seg = this.quality === 'high' ? 150 : 100);
      const T = map.terrain || {};
      const { H, noise } = this._buildHeight(map);
      this.H = H;
      const pal = PAL[T.biome || 'forest'];
      const hmax = (T.hmax || 9) * (T.relief || 1);
      const roads = T.roads || [];
      const rivers = T.rivers || [];
      const cities = Object.values(map.places || {}).filter((p) => p.type === 'city' || p.type === 'town');
      const tints = T.tint || [];
      const fields = T.fields || [], builtUp = Object.values(map.places || {}).filter((p) => p.type && p.type !== 'pin');

      const geo = new THREE.PlaneGeometry(S, S, seg, seg);
      geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position, col = new Float32Array(pos.count * 3);
      this.grid = new Float32Array(pos.count);
      const tmp = new THREE.Color(), t2 = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), z = pos.getZ(i), h = H(x, z);
        pos.setY(i, h);
        this.grid[i] = h;
        // màu theo độ cao
        const t = U.clamp((h - 0.2) / hmax, 0, 1);
        if (t < 0.3) tmp.copy(pal.low).lerp(pal.mid, t / 0.3);
        else if (t < 0.7) tmp.copy(pal.mid).lerp(pal.high, (t - 0.3) / 0.4);
        else tmp.copy(pal.high).lerp(pal.peak, (t - 0.7) / 0.3);
        const n = noise.fbm(x * 0.13 + 5, z * 0.13 + 9, 3);
        tmp.multiplyScalar(0.9 + n * 0.2);
        if (pal.paddy) {
          // ruộng lúa chia ô, bờ ruộng sáng màu
          const cx = Math.floor(x / 7), cz = Math.floor(z / 7), hs = (Math.sin(cx * 12.9898 + cz * 78.233) * 43758.5453) % 1;
          tmp.multiplyScalar(0.9 + Math.abs(hs) * 0.22);
          if (hs > 0.5) tmp.lerp(C(0xd6c86a), 0.28);
          const fx = ((x % 7) + 7) % 7, fz = ((z % 7) + 7) % 7;
          if (fx < 0.28 || fz < 0.28) tmp.lerp(C(0xb7a66b), 0.55);
        }
        if (h < 0.35) tmp.lerp(pal.sand, U.clamp((0.35 - h) / 0.35, 0, 1));
        // đồi cứ điểm: sườn màu đất
        for (let k = 0; k < this.hills.length; k++) {
          const hl = this.hills[k], d = Math.hypot(x - hl.x, z - hl.z);
          if (d < hl.r * 1.25) tmp.lerp(C(0x8c7449), 0.62 * (1 - U.smoothstep(hl.r * 0.25, hl.r * 1.25, d)));
        }
        // đô thị
        for (let k = 0; k < cities.length; k++) {
          const p = cities[k], d = Math.hypot(x - p.x, z - p.z), r = (p.r || 5) * 1.2;
          if (d < r) tmp.lerp(C(0xa8a595), 0.7 * (1 - U.smoothstep(r * 0.5, r, d)));
        }
        for (let k = 0; k < tints.length; k++) {
          const q = tints[k];
          if (x > q.r[0] && x < q.r[2] && z > q.r[1] && z < q.r[3]) tmp.lerp(C(q.c), q.a == null ? 0.7 : q.a);
        }
        // ruộng lúa: ô xanh / vàng chia bởi bờ ruộng sáng màu (không phủ lên khu nhà)
        for (let k = 0; k < fields.length; k++) {
          const f = fields[k];
          if (x < f.r[0] || x > f.r[2] || z < f.r[1] || z > f.r[3] || h < 0.3 || nearSettlement(builtUp, x, z, 1.6)) continue;
          const u = x - f.r[0], v = z - f.r[1], cx = Math.floor(u / PLOT), cz = Math.floor(v / PLOT);
          t2.set(plotKind(f, cx, cz) === 'gold' ? 0xdcc24c : 0x7fcb43).multiplyScalar(0.9 + plotHash(cx + 7, cz + 3) * 0.2);
          tmp.lerp(t2, 0.86);
          if (u % PLOT < 0.38 || v % PLOT < 0.38 || x > f.r[2] - 0.38 || z > f.r[3] - 0.38) tmp.lerp(C(0xbfae72), 0.75);
        }
        // đường
        for (let k = 0; k < roads.length; k++) {
          const r = roads[k], d = distPoly(x, z, r.pts), w = r.w || 0.9;
          if (d < w * 0.95) tmp.lerp(r.c ? C(r.c) : pal.road, 1 - U.smoothstep(w * 0.3, w * 0.95, d));
        }
        // đáy sông
        for (let k = 0; k < rivers.length; k++) {
          const r = rivers[k], d = distPoly(x, z, r.pts);
          if (d < r.w * 2.2) tmp.lerp(C(0xb9aa7d), 0.45 * (1 - U.smoothstep(r.w * 0.6, r.w * 2.2, d)));
        }
        col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
      }
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geo.computeVertexNormals();
      const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
      const contour = T.contour || 1.1;
      mat.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vHt;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvHt = position.y;');
        sh.fragmentShader = sh.fragmentShader
          .replace('#include <common>', '#include <common>\nvarying float vHt;')
          .replace('#include <dithering_fragment>', `#include <dithering_fragment>
            float cf = vHt / ${contour.toFixed(2)};
            float cd = abs(fract(cf - 0.5) - 0.5) / max(fwidth(cf), 0.0001);
            float cl = 1.0 - min(cd, 1.0);
            if (vHt > 0.15) gl_FragColor.rgb *= 1.0 - 0.16 * cl;`);
      };
      this.terrain = new THREE.Mesh(geo, mat);
      this.terrain.receiveShadow = true;
      this.world.add(this.terrain);

      // mặt nước
      const water = new THREE.Mesh(new THREE.PlaneGeometry(S, S), new THREE.MeshLambertMaterial({ color: 0x3f8fc4, transparent: true, opacity: 0.82, depthWrite: false }));
      water.rotation.x = -Math.PI / 2; water.position.y = WATER_Y; water.renderOrder = 1;
      this.world.add(water);
      this.water = water;

      this._buildSkirt(S, seg);
      this._buildForest(map, noise, H, roads, rivers);
      this._buildFields(map, H, roads, rivers);
      this._buildReeds(map, H, roads, rivers);
      this._buildPlaces(map);
      this._buildLabelsForRoads(roads, rivers);

      this.sun.target.position.set(0, 0, 0);
      this.setCam(map.cam || { x: 0, z: 0, d: 112, yaw: 0, pitch: 0.95 }, true);
      this.updateCompass();
    }

    _buildSkirt(S, seg) {
      const levels = [-5, -3.6, -2.2, -0.8];
      const shade = [0x46361f, 0x56432a, 0x654f33, 0x745c3c];
      const pos = [], col = [];
      const w = seg + 1, g = this.grid, half = S / 2, step = S / seg;
      const edge = (get) => {
        for (let k = 0; k < seg; k++) {
          const a = get(k), b = get(k + 1);
          for (let l = 0; l < levels.length; l++) {
            const lo = levels[l], hi = l + 1 < levels.length ? levels[l + 1] : null;
            const ta = Math.max(a.h, WATER_Y), tb = Math.max(b.h, WATER_Y);
            const ua = hi == null ? ta : Math.min(ta, hi), ub = hi == null ? tb : Math.min(tb, hi);
            if (ua <= lo && ub <= lo) continue;
            const c = new THREE.Color(shade[l]);
            const quad = [[a.x, lo, a.z], [b.x, lo, b.z], [b.x, ub, b.z], [a.x, lo, a.z], [b.x, ub, b.z], [a.x, ua, a.z]];
            quad.forEach((p) => { pos.push(p[0], p[1], p[2]); col.push(c.r, c.g, c.b); });
          }
          // dải nước ở mép (nơi địa hình thấp hơn mặt nước)
          if (a.h < WATER_Y || b.h < WATER_Y) {
            const c = new THREE.Color(0x3f8fc4);
            const quad = [[a.x, a.h, a.z], [b.x, b.h, b.z], [b.x, WATER_Y, b.z], [a.x, a.h, a.z], [b.x, WATER_Y, b.z], [a.x, WATER_Y, a.z]];
            quad.forEach((p) => { pos.push(p[0], p[1], p[2]); col.push(c.r, c.g, c.b); });
          }
        }
      };
      edge((k) => ({ x: -half + k * step, z: -half, h: g[0 * w + k] }));
      edge((k) => ({ x: -half + k * step, z: half, h: g[seg * w + k] }));
      edge((k) => ({ x: -half, z: -half + k * step, h: g[k * w + 0] }));
      edge((k) => ({ x: half, z: -half + k * step, h: g[k * w + seg] }));
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }));
      this.world.add(m);
      // đế gỗ
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(S + 5, 1.2, S + 5), new THREE.MeshLambertMaterial({ color: 0x5b3a22 }));
      plinth.position.y = -5.6; plinth.receiveShadow = true;
      const plinth2 = new THREE.Mesh(new THREE.BoxGeometry(S + 9, 1.2, S + 9), new THREE.MeshLambertMaterial({ color: 0x3f2815 }));
      plinth2.position.y = -6.7;
      this.world.add(plinth, plinth2);
    }

    _buildForest(map, noise, H, roads, rivers) {
      const T = map.terrain || {};
      const F = T.forest;
      if (!F || !F.n) return;
      const S = this.size, rnd = U.rng((T.seed || 7) * 31 + 5);
      const n = Math.floor(F.n * (this.quality === 'high' ? 0.5 : 0.32));
      const kinds = F.kinds || ['conifer', 'broad'];
      const buckets = {};
      /* mỗi loại cây gốc được tách thành nhiều dáng: cây cao – cây thấp – bụi */
      const variant = (k) => {
        const r = rnd();
        if (k === 'conifer') return r < 0.45 ? 'pine' : 'conifer';
        if (k === 'broad') return r < 0.3 ? 'tall' : r < 0.78 ? 'broad' : 'shrub';
        return k;
      };
      const SC = { pine: [0.85, 1.25], tall: [0.85, 1.2], conifer: [0.8, 1.2], broad: [0.8, 1.25], shrub: [0.9, 1.5] };
      const places = Object.values(map.places || {});
      let tries = 0;
      while (tries++ < n * 8 && Object.values(buckets).reduce((a, b) => a + b.length, 0) < n) {
        const x = rnd.range(-S * 0.49, S * 0.49), z = rnd.range(-S * 0.49, S * 0.49), h = H(x, z);
        if (h < (F.hmin != null ? F.hmin : 0.45) || h > (F.hmax || 9)) continue;
        if (noise.fbm(x * 0.06 + 100, z * 0.06 + 50, 3) < (F.thr != null ? F.thr : 0.42)) continue;
        let bad = false;
        for (const p of places) { if (Math.hypot(x - p.x, z - p.z) < (p.r || 3) + 1.8) { bad = true; break; } }
        if (bad) continue;
        for (const r of roads) if (distPoly(x, z, r.pts) < (r.w || 0.9) * 1.6) { bad = true; break; }
        if (bad) continue;
        for (const r of rivers) if (distPoly(x, z, r.pts) < r.w * 1.8) { bad = true; break; }
        if (bad) continue;
        const vk = variant(rnd.pick(kinds)), sr = SC[vk] || [0.7, 1.35];
        (buckets[vk] = buckets[vk] || []).push([x, h, z, rnd.range(sr[0], sr[1]), rnd() * 6.28]);
      }
      const dummy = new THREE.Object3D(), tc = new THREE.Color();
      Object.keys(buckets).forEach((k) => {
        const list = buckets[k];
        if (!list.length) return;
        const im = new THREE.InstancedMesh(M.treeGeo(k), M.mat, list.length);
        list.forEach((t, i) => {
          dummy.position.set(t[0], t[1], t[2]);
          dummy.rotation.set(0, t[4], 0);
          dummy.scale.setScalar(t[3] * (F.scale || 1));
          dummy.updateMatrix();
          im.setMatrixAt(i, dummy.matrix);
          const v = 0.85 + rnd() * 0.3;
          tc.setRGB(v, v, v);
          im.setColorAt(i, tc);
        });
        im.castShadow = this.quality === 'high';
        im.receiveShadow = false;
        this.world.add(im);
      });
    }

    /* bụi lúa xếp hàng trong từng ô ruộng (tránh bờ ruộng, sông, đường và khu nhà) */
    _buildFields(map, H, roads, rivers) {
      const T = map.terrain || {}, fields = T.fields || [];
      if (!fields.length) return;
      const rnd = U.rng((T.seed || 7) * 53 + 11), places = Object.values(map.places || {}).filter((p) => p.type && p.type !== 'pin');
      const st = this.quality === 'high' ? 0.85 : 1.15, lists = { green: [], gold: [] };
      fields.forEach((f) => {
        for (let u = 0.7; u < f.r[2] - f.r[0] - 0.3; u += st) {
          const fu = u % PLOT; if (fu < 0.55 || fu > PLOT - 0.45) continue;
          for (let v = 0.7; v < f.r[3] - f.r[1] - 0.3; v += st) {
            const fv = v % PLOT; if (fv < 0.55 || fv > PLOT - 0.45) continue;
            const x = f.r[0] + u + (rnd() - 0.5) * 0.14, z = f.r[1] + v + (rnd() - 0.5) * 0.14, h = H(x, z);
            if (h < 0.32 || nearSettlement(places, x, z, 1.6)) continue;
            let bad = false;
            for (const r of roads) if (distPoly(x, z, r.pts) < (r.w || 0.9) * 1.3) { bad = true; break; }
            if (bad) continue;
            for (const r of rivers) if (distPoly(x, z, r.pts) < r.w * 1.8 + 0.4) { bad = true; break; }
            if (bad) continue;
            lists[plotKind(f, Math.floor(u / PLOT), Math.floor(v / PLOT))].push([x, h, z, 0.9 + rnd() * 0.35, rnd() * 6.28, 0.9 + rnd() * 0.2]);
          }
        }
      });
      const dummy = new THREE.Object3D(), tc = new THREE.Color();
      Object.keys(lists).forEach((k) => {
        const list = lists[k]; if (!list.length) return;
        const im = new THREE.InstancedMesh(M.riceGeo(k), M.mat, list.length);
        list.forEach((t, i) => { dummy.position.set(t[0], t[1], t[2]); dummy.rotation.set(0, t[4], 0); dummy.scale.setScalar(t[3]); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); tc.setRGB(t[5], t[5], t[5]); im.setColorAt(i, tc); });
        im.receiveShadow = false;
        this.world.add(im);
      });
    }

    /* cây bông lau mọc thành bụi dọc bờ sông, bờ kênh */
    _buildReeds(map, H, roads, rivers) {
      const T = map.terrain || {}, R = T.reeds;
      if (!R || !R.n || !rivers.length) return;
      const rnd = U.rng((T.seed || 7) * 97 + 3), fields = T.fields || [], places = Object.values(map.places || {}).filter((p) => p.type && p.type !== 'pin');
      const S = this.size, want = Math.floor(R.n * (this.quality === 'high' ? 1 : 0.6)), band = R.band || 3.4, list = [];
      for (let tries = 0; tries < want * 40 && list.length < want; tries++) {
        const x = rnd.range(-S * 0.49, S * 0.49), z = rnd.range(-S * 0.49, S * 0.49), h = H(x, z);
        if (h < 0.18 || h > 3.2) continue;
        let dr = 1e9;
        for (const r of rivers) dr = Math.min(dr, distPoly(x, z, r.pts) - r.w);
        if (dr < 0.9 || dr > band + 0.9) continue;
        if (nearSettlement(places, x, z, 1.4)) continue;
        let bad = false;
        for (const r of roads) if (distPoly(x, z, r.pts) < (r.w || 0.9) * 1.4) { bad = true; break; }
        if (bad) continue;
        for (const f of fields) if (x > f.r[0] - 0.8 && x < f.r[2] + 0.8 && z > f.r[1] - 0.8 && z < f.r[3] + 0.8) { bad = true; break; }
        if (bad) continue;
        list.push([x, h, z, 0.85 + rnd() * 0.7, rnd() * 6.28]);
      }
      if (!list.length) return;
      const dummy = new THREE.Object3D(), tc = new THREE.Color();
      const im = new THREE.InstancedMesh(M.treeGeo('reed'), M.mat, list.length);
      list.forEach((t, i) => { dummy.position.set(t[0], t[1], t[2]); dummy.rotation.set(0, t[4], 0); dummy.scale.setScalar(t[3]); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); const v = 0.88 + rnd() * 0.22; tc.setRGB(v, v, v); im.setColorAt(i, tc); });
      im.receiveShadow = false;
      this.world.add(im);
    }

    _buildPlaces(map) {
      const rnd = U.rng(((map.terrain && map.terrain.seed) || 3) * 17 + 1);
      this.placeObjs = {};
      Object.keys(map.places || {}).forEach((key) => {
        const p = map.places[key];
        const y = this.groundY(p.x, p.z);
        const g = new THREE.Group();
        g.position.set(p.x, y, p.z);
        g.rotation.y = p.rot || 0;
        this._placeProps(g, p, rnd);
        g.traverse((o) => { if (o.isMesh) { o.castShadow = this.quality === 'high'; o.receiveShadow = true; } });
        this.world.add(g);
        this.placeObjs[key] = g;
        if (p.label) {
          this.addLabel({ id: 'pl_' + key, x: p.x, z: p.z, lift: p.lh != null ? p.lh : p.type === 'palace' ? 5 : p.type === 'city' ? 4 : 3, text: p.label, side: p.side, imp: p.imp || 2 });
        }
      });
    }

    _placeProps(g, p, rnd) {
      const add = (geo, x, z, sc, ry) => {
        const m = new THREE.Mesh(geo, M.mat);
        const gy = this.groundY(p.x + x, p.z + z) - g.position.y;
        m.position.set(x, gy, z);
        m.scale.setScalar(sc || 1);
        m.rotation.y = ry || 0;
        g.add(m);
        return m;
      };
      const ring = (n, r, f, gap) => {
        const got = [];
        for (let i = 0; i < n; i++) {
          let x = 0, z = 0;
          for (let t = 0; t < (gap ? 14 : 1); t++) {
            const a = rnd() * 6.283, d = Math.sqrt(rnd()) * r;
            x = Math.cos(a) * d; z = Math.sin(a) * d;
            if (!gap || got.every((q) => Math.hypot(q[0] - x, q[1] - z) >= gap)) break;
          }
          got.push([x, z]);
          f(x, z, i);
        }
      };
      const sideCol = (M.SIDE[p.side] || M.SIDE.ne).main;
      switch (p.type) {
        case 'city': {
          const r = p.r || 5.5, n = p.n || 34;
          ring(n, r, (x, z, i) => {
            const d = Math.hypot(x, z) / r;
            const style = d < 0.45 && rnd() < 0.55 ? 'tower' : rnd() < 0.5 ? 'shop' : 'tile';
            add(M.houseGeo(style), x, z, (style === 'tower' ? 0.8 + rnd() * 0.7 : 0.8 + rnd() * 0.4) * (p.sc || 1), rnd() * 6.28);
          });
          ring(8, r * 1.1, (x, z) => add(M.treeGeo('broad'), x, z, 0.8));
          break;
        }
        case 'town': {
          const r = p.r || 3.6;
          ring(p.n || 12, r, (x, z) => add(M.houseGeo(rnd() < 0.7 ? 'tile' : 'shop'), x, z, 0.85 + rnd() * 0.35, rnd() * 6.28));
          ring(6, r * 1.2, (x, z) => add(M.treeGeo('broad'), x, z, 0.8));
          break;
        }
        case 'village': {
          const r = p.r || 2.8, style = p.style || 'tile';
          const big = style === 'stilt' ? 1.25 : 1;
          ring(p.n || 6, r * (big > 1 ? 1.8 : 1), (x, z) => add(M.houseGeo(style), x, z, (0.8 + rnd() * 0.4) * big, rnd() * 6.28), big > 1 ? 4.2 : 0);
          const tk = p.trees || (style === 'tile' ? 'palm' : 'bamboo');
          ring(p.nt || 9, r * 1.35 * (big > 1 ? 1.4 : 1), (x, z) => add(M.treeGeo(tk), x, z, 0.8 + rnd() * 0.5, rnd() * 6.28));
          break;
        }
        case 'hut': ring(p.n || 3, (p.r || 2) * 1.7, (x, z) => add(M.houseGeo('stilt'), x, z, 1.25, rnd() * 6.28), 4.2); break;
        case 'camp': {
          ring(p.n || 4, p.r || 2.4, (x, z) => add(M.houseGeo('tent'), x, z, 0.9, rnd() * 6.28));
          const f = M.makeFlag(p.side === 'vn' ? 'vn' : p.side === 'fr' ? 'fr' : 'sg', 0.8); f.position.set(0, 0, 0); g.add(f); this.flags.push(f);
          break;
        }
        case 'bunker': case 'hq': {
          const r = p.r || 1.5, m = add(M.bunkerGeo(r), 0, 0, 1, 0);
          // mép đỉnh đồi tô màu phe (xanh = địch, đỏ = ta) để dễ nhận biết
          const disc = new THREE.Mesh(new THREE.RingGeometry(r * 1.02, r * 1.3, 28), new THREE.MeshBasicMaterial({ color: sideCol, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
          disc.rotation.x = -Math.PI / 2; disc.position.y = 0.09; g.add(disc);
          if (p.type === 'hq') { const f = M.makeFlag(p.side === 'vn' ? 'vn' : p.side === 'fr' ? 'fr' : 'sg', 0.8); f.position.set(0, 0.6, 0); g.add(f); this.flags.push(f); }
          break;
        }
        case 'airfield': {
          const len = p.len || 12, run = new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, 1.9), new THREE.MeshLambertMaterial({ color: 0x55585e }));
          run.position.y = 0.1; g.add(run);
          const line = new THREE.Mesh(new THREE.BoxGeometry(len * 0.9, 0.02, 0.1), new THREE.MeshBasicMaterial({ color: 0xf0f0f0 }));
          line.position.y = 0.17; g.add(line);
          add(M.hangarGeo(), len * 0.3, 2.4, 1, 0);
          add(M.houseGeo('tower'), -len * 0.3, 2.2, 0.8, 0);
          if (p.planes) for (let i = 0; i < p.planes; i++) { const pl = new THREE.Mesh(M.planeGeo(p.planeKind || 'dak'), M.mat); pl.position.set(-len * 0.3 + i * 2.2, 0.35, -2.3); pl.scale.setScalar(0.5); pl.rotation.y = Math.PI / 2; g.add(pl); }
          break;
        }
        case 'palace': {
          const m = add(M.palaceGeo(), 0, 0, p.sc || 0.9, 0);
          const f = M.makeFlag('vn', 1.0); f.position.set(0, 3.7 * (p.sc || 0.9), 0); g.add(f); this.flags.push(f);
          f.visible = !!p.flag;
          this.palaceFlag = f;
          break;
        }
        case 'port': {
          for (let i = 0; i < 3; i++) add(M.craneGeo(), -3 + i * 1.6, 0, 0.9, 0);
          add(M.shipGeo(), 3.5, 2.5, 0.8, 0.3); add(M.shipGeo(), 4.5, -1.5, 0.7, -0.2);
          break;
        }
        case 'bridge': {
          const [tx, tz] = this.xz(p.to), dx = tx - p.x, dz = tz - p.z, len = Math.hypot(dx, dz);
          const deck = new THREE.Mesh(new THREE.BoxGeometry(len, 0.22, 1.1), new THREE.MeshLambertMaterial({ color: 0x8a8f96 }));
          deck.position.set(dx / 2, 0.55, dz / 2); deck.rotation.y = -Math.atan2(dz, dx); g.add(deck);
          for (let i = 0; i <= 4; i++) { const pier = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.4, 0.9), new THREE.MeshLambertMaterial({ color: 0x6f747b })); pier.position.set((dx * i) / 4, 0, (dz * i) / 4); g.add(pier); }
          break;
        }
        case 'sam': {
          const side = p.side || 'vn';
          ring(p.n || 3, 1.6, (x, z) => { const m = add(M.vehicleGeo('sam', side), x, z, 1, rnd() * 6.28); });
          add(M.vehicleGeo('radar', side), 2.4, 0, 1, 0);
          break;
        }
        case 'aaa': ring(p.n || 4, 1.5, (x, z) => add(M.vehicleGeo('aaa', p.side || 'vn'), x, z, 1, rnd() * 6.28)); break;
        case 'pass': {
          add(M.treeGeo('conifer'), -0.9, 0, 1.0, 0); add(M.treeGeo('conifer'), 0.9, 0.3, 1.2, 0);
          const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8, 0), new THREE.MeshLambertMaterial({ color: 0x8d8a80 })); rock.position.set(0, 0.4, -0.8); g.add(rock);
          break;
        }
        case 'hill': case 'pin': default: break;
      }
      if (p.flag) {
        const f = M.makeFlag(p.flag, 0.9); f.position.set(p.fx || 0, 0, p.fz || 0); g.add(f); this.flags.push(f);
      }
    }

    _buildLabelsForRoads(roads, rivers) {
      roads.forEach((r, i) => {
        if (!r.label) return;
        const mid = r.pts[Math.floor(r.pts.length / 2)];
        this.addLabel({ id: 'rd' + i, x: mid[0], z: mid[1], lift: 0.8, text: r.label, side: 'road', imp: 1 });
      });
      rivers.forEach((r, i) => {
        if (!r.label) return;
        const mid = r.pts[Math.floor(r.pts.length / 2)];
        this.addLabel({ id: 'rv' + i, x: mid[0], z: mid[1], lift: 0.6, text: r.label, side: 'water', imp: 1 });
      });
    }

    /* ---------- Nhãn HTML gắn vào toạ độ 3D ---------- */
    addLabel(o) {
      const el = U.h('div', { class: 'lbl ' + (o.side === 'vn' ? 'ta' : o.side === 'fr' || o.side === 'us' || o.side === 'sg' ? 'dich' : o.side === 'water' ? 'water' : o.side === 'road' ? 'road' : '') + (o.cls ? ' ' + o.cls : '') });
      if (o.html) el.innerHTML = o.text; else el.append(U.h('i'), U.h('span', null, o.text));
      this.layer.appendChild(el);
      const lb = { el, x: o.x, z: o.z, lift: o.lift || 3, imp: o.imp || 2, id: o.id, unit: o.unit || null, y: o.y };
      this.labels.push(lb);
      return lb;
    }
    removeLabel(lb) {
      if (!lb) return;
      lb.el.remove();
      const i = this.labels.indexOf(lb);
      if (i >= 0) this.labels.splice(i, 1);
    }
    highlight(keys) {
      const set = new Set((keys || []).map((k) => 'pl_' + k));
      this.labels.forEach((l) => l.el.classList.toggle('hl', set.has(l.id)));
    }
    _updateLabels() {
      const v = new THREE.Vector3(), cp = this.camera.position;
      const w = this.w, h = this.h;
      const shown = [];
      /* chữ nhỏ dần khi nhìn xa, to vừa khi phóng gần; nhãn A/B/C luôn đủ đọc */
      const ks = Math.max(0.8, Math.min(1, w / 640)); // sa bàn hẹp (điện thoại): chữ nhỏ thêm
      const kz = Math.max(0.74, Math.min(1, 0.82 + (112 - this.cam.d) / 330)) * ks;
      /* điểm trên màn hình dọc theo các mũi tên: nhãn nào đè lên mũi tên thì mờ đi để thấy rõ mũi tên */
      const ap = [], v2 = new THREE.Vector3();
      for (const r of this.arrows || []) {
        if (r.dead || !r.curve || (r.grp && r.grp.visible === false)) continue;
        for (let i = 0; i <= 14; i++) { v2.copy(r.curve.getPoint(i / 14)).project(this.camera); if (v2.z < 1) ap.push((v2.x * 0.5 + 0.5) * w, (-v2.y * 0.5 + 0.5) * h); }
      }
      for (const l of this.labels) {
        let x = l.x, z = l.z, y;
        if (l.unit) { const g = l.unit.group; x = g.position.x; z = g.position.z; y = g.position.y + l.lift; }
        else y = (l.y != null ? l.y : this.groundY(x, z)) + l.lift;
        v.set(x, y, z);
        const dist = cp.distanceTo(v);
        v.project(this.camera);
        const hl = l.el.classList.contains('hl');
        const vis = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1 && (l.imp >= 3 || (l.imp === 2 && dist < 160) || (l.imp === 1 && dist < 84) || hl || l.always);
        if (!vis) { if (l._v !== false) { l.el.style.display = 'none'; l.el.style.visibility = ''; l._v = false; l._o = false; } continue; }
        shown.push({ l, sx: (v.x * 0.5 + 0.5) * w, sy: (-v.y * 0.5 + 0.5) * h, pr: (hl ? 6 : 0) + (l.el.classList.contains('optmark') ? 8 : 0) + (l.el.classList.contains('mark') ? 5 : 0) + (l.el.classList.contains('alabel') ? 2 : 0) + l.imp });
      }
      // tránh chồng nhãn: nhãn quan trọng hơn được giữ, nhãn kém quan trọng bị ẩn nếu che nhau
      shown.sort((a, b) => b.pr - a.pr);
      const placed = [];
      for (const s of shown) {
        const l = s.l;
        if (l._v !== true) { l.el.style.display = ''; l._v = true; l._w = 0; }
        if (!l._w) { l._w = l.el.offsetWidth || 90; l._h = l.el.offsetHeight || 22; }
        const k = l.el.classList.contains('optmark') ? ks : kz, lw = l._w * k, lh = l._h * k;
        let r = { x0: s.sx - lw / 2, x1: s.sx + lw / 2, y0: s.sy - lh, y1: s.sy }, ox = 0, oy = 0;
        const shift = (q, dx, dy) => ({ x0: q.x0 + dx, x1: q.x1 + dx, y0: q.y0 + dy, y1: q.y1 + dy });
        const hit = (q) => placed.some((p) => q.x0 < p.x1 && q.x1 > p.x0 && q.y0 < p.y1 && q.y1 > p.y0);
        if (s.pr >= 5) { // nhãn quan trọng (A/B/C, ghi chú, đang chớp sáng): kéo vào trong khung nhìn
          if (r.x0 < 4) ox = 4 - r.x0; else if (r.x1 > w - 4) ox = w - 4 - r.x1;
          if (r.y0 < 4) oy = 4 - r.y0; else if (r.y1 > h - 4) oy = h - 4 - r.y1;
          r = shift(r, ox, oy);
        }
        let hide = false;
        if (hit(r)) {
          if (s.pr < 5) hide = true; // nhãn thường: ẩn nếu chồng lên nhãn quan trọng hơn
          else { // nhãn quan trọng: dời lên / xuống cho khỏi chồng nhau
            const gap = lh + 3;
            for (const m of [-1, 1, -2, 2, -3, 3, -4, 4]) { const q = shift(r, 0, m * gap); if (q.y0 >= 2 && q.y1 <= h - 2 && !hit(q)) { r = q; oy += m * gap; break; } }
          }
        }
        if (hide) { if (l._o !== true) { l.el.style.visibility = 'hidden'; l._o = true; } continue; }
        if (l._o) { l.el.style.visibility = ''; l._o = false; }
        placed.push(r);
        // nhãn thường đè lên mũi tên thì mờ đi (nhãn đang nhấp nháy theo lời kể, nhãn A/B/C, nhãn mũi tên thì giữ nguyên)
        let under = false;
        if (s.pr < 5 && !l.el.classList.contains('alabel') && !l.el.classList.contains('ping')) {
          for (let i = 0; i < ap.length; i += 2) { if (ap[i] > r.x0 - 4 && ap[i] < r.x1 + 4 && ap[i + 1] > r.y0 - 4 && ap[i + 1] < r.y1 + 4) { under = true; break; } }
        }
        if (l._u !== under) { l._u = under; l.el.classList.toggle('under', under); }
        l.el.style.transform = `translate(${(s.sx + ox).toFixed(1)}px, ${(s.sy + oy).toFixed(1)}px) translate(-50%, -100%) scale(${k.toFixed(2)})`;
      }
    }
    caption(html) {
      this.capEl.innerHTML = html || '';
      this.capEl.classList.toggle('on', !!html);
    }
    updateCompass() {
      const deg = (-this.cam.yaw * 180) / Math.PI;
      this.compass.firstChild.style.transform = `rotate(${deg}deg)`;
    }

    /* ---------- Camera ---------- */
    setCam(c, instant) {
      const g = this.goal;
      if (c.at) { const [x, z] = this.xz(c.at); g.x = x; g.z = z; }
      if (c.x != null) g.x = c.x;
      if (c.z != null) g.z = c.z;
      if (c.d != null) g.d = c.d;
      if (c.yaw != null) g.yaw = U.rad(c.yaw);
      if (c.yawRad != null) g.yaw = c.yawRad;
      if (c.pitch != null) g.pitch = U.rad(c.pitch);
      g.y = this.groundY(g.x, g.z);
      if (c.at == null && c.x == null && c.z == null) g.y = this.cam.y;
      if (instant) Object.assign(this.cam, g);
    }
    overview() { const m = this.map && this.map.cam; this.setCam(m || { x: 0, z: 0, d: 112, yaw: 0, pitch: 55 }); }
    _bindInput() {
      const cv = this.canvas;
      let drag = null;
      const pts = new Map();
      let pinch = 0;
      cv.addEventListener('contextmenu', (e) => e.preventDefault());
      cv.addEventListener('pointermove', (e) => { if (e.buttons) this.userTouched = performance.now(); });
      cv.addEventListener('wheel', () => { this.userTouched = performance.now(); }, { passive: true });
      let down = null, lastHover = 0;
      cv.addEventListener('pointerdown', (e) => {
        cv.setPointerCapture(e.pointerId);
        pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        drag = { x: e.clientX, y: e.clientY, pan: e.button === 2 || e.shiftKey };
        down = { x: e.clientX, y: e.clientY, t: performance.now() };
        this.userTouched = performance.now();
      });
      cv.addEventListener('pointermove', (e) => {
        if (!pts.has(e.pointerId)) {
          const now = performance.now();
          if (now - lastHover > 90 && this.arrows && this.arrows.length) { lastHover = now; cv.style.cursor = this.pickArrow(e.clientX, e.clientY) ? 'pointer' : ''; }
          return;
        }
        pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pts.size === 2) {
          const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (pinch) this.goal.d = U.clamp(this.goal.d * (pinch / d), 16, 175);
          pinch = d;
          return;
        }
        if (!drag) return;
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        drag.x = e.clientX; drag.y = e.clientY;
        const g = this.goal;
        if (drag.pan) {
          const k = g.d * 0.0018;
          g.x -= (Math.cos(g.yaw) * dx + Math.sin(g.yaw) * dy) * k;
          g.z -= (-Math.sin(g.yaw) * dx + Math.cos(g.yaw) * dy) * k;
          g.x = U.clamp(g.x, -this.size / 2, this.size / 2); g.z = U.clamp(g.z, -this.size / 2, this.size / 2);
          g.y = this.groundY(g.x, g.z);
        } else {
          g.yaw -= dx * 0.006;
          g.pitch = U.clamp(g.pitch + dy * 0.005, 0.2, 1.5);
        }
        this.userTouched = performance.now();
      });
      const up = (e) => {
        pts.delete(e.pointerId); pinch = 0; if (!pts.size) drag = null;
        // cú bấm (gần như không kéo) vào mũi tên -> báo cho giao diện
        if (down && e.type === 'pointerup' && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6 && performance.now() - down.t < 500 && this.onArrowClick) {
          const rec = this.pickArrow(e.clientX, e.clientY);
          if (rec) this.onArrowClick(rec);
        }
        down = null;
      };
      cv.addEventListener('pointerup', up);
      cv.addEventListener('pointercancel', up);
      cv.addEventListener('wheel', (e) => {
        e.preventDefault();
        this.goal.d = U.clamp(this.goal.d * Math.exp(e.deltaY * 0.0012), 16, 175);
        this.userTouched = performance.now();
      }, { passive: false });
    }

    /* ---------- Cập nhật mỗi khung hình ---------- */
    update(dt) {
      if (!this.paused) {
        this.time += dt;
        this._runTimers();
        this._runTweens(dt);
        this._runFx(dt);
      }
      const c = this.cam, g = this.goal;
      if (this.autoRotate && !this.followOn && this.focusOrd == null && performance.now() - (this.userTouched || 0) > 3000) {
        g.yaw += this.autoRotate * dt; // xoay vòng 360° liên tục (trang chủ)
        if (g.yaw > 60) { g.yaw -= 16 * Math.PI; c.yaw -= 16 * Math.PI; }
      }
      const k = 1 - Math.exp(-dt * 3.6);
      for (const key of ['x', 'y', 'z', 'd', 'pitch']) c[key] += (g[key] - c[key]) * k;
      let dy = (g.yaw - c.yaw) % (2 * Math.PI);
      if (dy > Math.PI) dy -= 2 * Math.PI; else if (dy < -Math.PI) dy += 2 * Math.PI;
      c.yaw += dy * k;
      const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
      let sx = 0, sy = 0;
      if (this.shake > 0.001) { sx = (Math.random() - 0.5) * this.shake; sy = (Math.random() - 0.5) * this.shake; this.shake *= Math.exp(-dt * 5); }
      const dd = c.d * this.dScale;
      this.camera.position.set(c.x + Math.sin(c.yaw) * cp * dd + sx, c.y + sp * dd + sy, c.z + Math.cos(c.yaw) * cp * dd);
      this.camera.lookAt(c.x, c.y, c.z);
      this.updateCompass();
      this._updateLabels();
    }

    /* ---------- Dọn dẹp ---------- */
    clearActors() {
      this.timers.length = 0; this.tweens.length = 0; this.emitters.length = 0; this.pulses.length = 0; this.anims.length = 0;
      this.labels.filter((l) => !String(l.id || '').startsWith('pl_') && !String(l.id || '').startsWith('rd') && !String(l.id || '').startsWith('rv')).forEach((l) => this.removeLabel(l));
      while (this.actors.children.length) {
        const o = this.actors.children.pop();
        o.traverse((n) => { if (n.geometry && !n.geometry.userData.shared) n.geometry.dispose(); if (n.material && n.material.dispose && !n.material.userData.shared) n.material.dispose(); });
      }
      this.units = {}; this.arrows = []; this.parts = []; this.rings = []; this.marks = []; this.misc = []; this.aflags = [];
      if (this.palaceFlag) this.palaceFlag.visible = false;
      this.caption('');
      this.highlight([]);
    }
    clearAll() {
      this.clearActors();
      this.labels.slice().forEach((l) => this.removeLabel(l));
      [this.world].forEach((grp) => {
        while (grp.children.length) {
          const o = grp.children.pop();
          o.traverse((n) => {
            if (n.geometry && !Object.values(SBS.models).includes(n.geometry)) { try { n.geometry.dispose(); } catch (e) {} }
            if (n.material && n.material.dispose && n.material !== M.mat) n.material.dispose();
          });
        }
      });
      this.flags = [];
      this.grid = null;
    }
  }

  SBS.Sandbox = Sandbox;
})();
