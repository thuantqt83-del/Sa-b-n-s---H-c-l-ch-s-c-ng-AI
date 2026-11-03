/* Sa bàn 3D – diễn viên: quân, mũi tên (đỏ = ta, xanh = địch), vòng vây, nổ, khói, tên lửa, máy bay, cờ.
   Chạy theo "bước" (step); mũi tên nhấp nháy, có hạt sáng chạy dọc, chạm địa danh thì địa danh chớp sáng,
   camera chỉ xoay/phóng to theo mũi tên khi người dùng bấm hoặc khi đang kể diễn biến. */
(function () {
  'use strict';
  const SBS = window.SBS;
  const THREE = window.THREE;
  const U = SBS.util;
  const M = SBS.models;
  const P = SBS.Sandbox.prototype;

  const wrapPI = (a) => { a = (a + Math.PI) % (2 * Math.PI); if (a < 0) a += 2 * Math.PI; return a - Math.PI; };

  /* ---------- Kết cấu ảnh động ---------- */
  const texCache = {};
  function getTex(name) {
    if (texCache[name]) return texCache[name];
    const cv = document.createElement('canvas');
    cv.width = cv.height = 64;
    const g = cv.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 2, 32, 32, 31);
    if (name === 'fire') { grd.addColorStop(0, 'rgba(255,255,230,1)'); grd.addColorStop(0.25, 'rgba(255,200,70,0.95)'); grd.addColorStop(0.6, 'rgba(255,90,20,0.6)'); grd.addColorStop(1, 'rgba(120,20,0,0)'); }
    else if (name === 'smoke') { grd.addColorStop(0, 'rgba(70,70,70,0.85)'); grd.addColorStop(0.6, 'rgba(60,60,60,0.4)'); grd.addColorStop(1, 'rgba(50,50,50,0)'); }
    else if (name === 'spark') { grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.28, 'rgba(255,255,255,0.85)'); grd.addColorStop(0.6, 'rgba(255,255,255,0.25)'); grd.addColorStop(1, 'rgba(255,255,255,0)'); }
    else { grd.addColorStop(0, 'rgba(210,190,150,0.8)'); grd.addColorStop(1, 'rgba(190,170,130,0)'); }
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    return (texCache[name] = new THREE.CanvasTexture(cv));
  }
  const BLUE = 0x3d8bff, RED = 0xff3b4a;
  const SIDE_ARROW = { vn: RED, fr: BLUE, us: BLUE, sg: BLUE, ne: 0xffd23f, gold: 0xffd23f };
  const VEH = ['tank', 'apc', 'truck', 'jeep', 'gun', 'aaa', 'sam', 'boat', 'radar'];
  const PLANES = ['b52', 'mig', 'f4', 'dak'];
  const _white = new THREE.Color(0xffffff);

  /* ---------- Bộ chạy thời gian ---------- */
  P.at = function (delay, fn, instant) {
    if (instant || !(delay > 0)) fn();
    else this.timers.push({ t: this.time + delay, fn });
  };
  P.tween = function (dur, fn, done, ease, instant) {
    if (instant || !(dur > 0)) { fn(1, 1); if (done) done(); return; }
    this.tweens.push({ age: 0, dur, fn, done, ease: ease || U.ease.inOut });
  };
  P._runTimers = function () {
    const t = this.time;
    for (let i = 0; i < this.timers.length; i++) {
      const tm = this.timers[i];
      if (tm.t <= t) { this.timers.splice(i, 1); i--; tm.fn(); }
    }
  };
  P._runTweens = function (dt) {
    const L = this.tweens;
    for (let i = 0; i < L.length; i++) {
      const tw = L[i];
      tw.age += dt;
      const p = Math.min(1, tw.age / tw.dur);
      tw.fn(tw.ease(p), p);
      if (p >= 1) { const k = L.indexOf(tw); if (k >= 0) L.splice(k, 1); i = Math.min(i, L.length) - 1; if (tw.done) tw.done(); }
    }
  };
  P._runFx = function (dt) {
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const q = this.parts[i];
      q.age += dt;
      const t = q.age / q.life;
      if (t >= 1) { this.actors.remove(q.s); q.s.material.dispose(); this.parts.splice(i, 1); continue; }
      q.s.position.x += q.vx * dt; q.s.position.y += q.vy * dt; q.s.position.z += q.vz * dt;
      q.vy *= q.drag || 1;
      q.s.scale.setScalar(U.lerp(q.s0, q.s1, Math.sqrt(t)));
      q.s.material.opacity = q.a0 * Math.pow(1 - t, 1.3);
    }
    for (const e of this.emitters) {
      e.acc += dt * e.rate;
      while (e.acc >= 1) {
        e.acc -= 1;
        if (e.kind === 'fire') this.spawnPart('fire', e.x + (Math.random() - 0.5) * 0.6, e.y + 0.3, e.z + (Math.random() - 0.5) * 0.6, { vy: 1.4, s0: 0.9, s1: 0.2, life: 0.7, a: 0.9 });
        else this.spawnPart('smoke', e.x + (Math.random() - 0.5) * 0.8, e.y + 0.6, e.z + (Math.random() - 0.5) * 0.8, { vy: 1.5, vx: 0.35, s0: 1.2, s1: e.big ? 7 : 4.5, life: e.big ? 6 : 4, a: 0.62 });
      }
    }
    const t = this.time;
    for (const f of this.flags) f.userData.update(t);
    for (const f of this.aflags || []) f.userData.update(t);
    for (let i = this.anims.length - 1; i >= 0; i--) if (this.anims[i](dt, t) === false) this.anims.splice(i, 1);
  };

  P.spawnPart = function (kind, x, y, z, o) {
    if (this.parts.length > 360) return;
    o = o || {};
    const mat = new THREE.SpriteMaterial({ map: getTex(kind), transparent: true, depthWrite: false, blending: kind === 'fire' ? THREE.AdditiveBlending : THREE.NormalBlending, opacity: o.a || 0.9 });
    const s = new THREE.Sprite(mat);
    s.position.set(x, y, z);
    s.scale.setScalar(o.s0 || 1);
    this.actors.add(s);
    this.parts.push({ s, vx: o.vx || 0, vy: o.vy || 0, vz: o.vz || 0, life: o.life || 1.2, age: 0, s0: o.s0 || 1, s1: o.s1 || 3, a0: o.a || 0.9, drag: o.drag });
  };

  /* ---------- Đơn vị ---------- */
  P._makeUnit = function (a) {
    const side = a.side || 'vn', kind = a.kind || 'inf', n = a.n || 1, sc = a.sc || 1;
    const g = new THREE.Group();
    let ringR = 1.3, alt = a.alt != null ? a.alt : 0, anim = null;
    if (kind === 'inf') {
      const cols = Math.max(1, Math.ceil(Math.sqrt(n * 1.4))), rows = Math.ceil(n / cols), sp = 0.85 * sc;
      const im = new THREE.InstancedMesh(M.soldierGeo(side), M.mat, n), d = new THREE.Object3D(), rnd = U.rng(n * 7 + 3);
      for (let i = 0; i < n; i++) {
        const r = Math.floor(i / cols), c = i % cols;
        d.position.set((c - (cols - 1) / 2) * sp + (rnd() - 0.5) * 0.3, 0, (r - (rows - 1) / 2) * sp + (rnd() - 0.5) * 0.3);
        d.rotation.set(0, (rnd() - 0.5) * 0.5, 0);
        d.scale.setScalar(1.5 * sc);
        d.updateMatrix();
        im.setMatrixAt(i, d.matrix);
      }
      im.castShadow = this.quality === 'high';
      g.add(im);
      ringR = Math.max(1.3, (Math.max(cols, rows) * sp) / 1.5 + 0.5);
    } else if (VEH.includes(kind)) {
      const cols = Math.min(n, 4), sp = 2.4 * sc;
      for (let i = 0; i < n; i++) {
        const m = new THREE.Mesh(M.vehicleGeo(kind, side), M.mat);
        m.position.set(-(i % cols) * sp + ((cols - 1) * sp) / 2, 0, Math.floor(i / cols) * 1.6 * sc);
        m.scale.setScalar(1.15 * sc);
        m.castShadow = this.quality === 'high';
        g.add(m);
      }
      ringR = Math.max(1.5, (cols * sp) / 2 + 0.4);
    } else if (kind === 'bike') {
      for (let i = 0; i < n; i++) {
        const m = new THREE.Mesh(M.bikeGeo(), M.mat);
        m.position.set((i % 6) * 0.9 - 2, 0, Math.floor(i / 6) * 1.2);
        m.scale.setScalar(1.2 * sc);
        m.castShadow = this.quality === 'high';
        g.add(m);
      }
      ringR = 2.4;
    } else if (kind === 'heli') {
      const { body, rotor } = M.heliParts(side);
      const hb = new THREE.Mesh(body, M.mat), hr = new THREE.Mesh(rotor, M.mat);
      hb.scale.setScalar(1.3 * sc); hr.scale.setScalar(1.3 * sc);
      g.add(hb, hr);
      alt = a.alt != null ? a.alt : 3.2;
      anim = (dt) => { hr.rotation.y += dt * 32; return !g.userData.dead; };
      ringR = 0;
    } else if (PLANES.includes(kind)) {
      const m = new THREE.Mesh(M.planeGeo(kind), M.mat);
      m.scale.setScalar((kind === 'b52' ? 1.05 : kind === 'dak' ? 0.8 : 0.9) * sc);
      m.castShadow = this.quality === 'high';
      g.add(m);
      alt = a.alt != null ? a.alt : kind === 'b52' ? 14 : 9;
      ringR = 0;
    } else {
      g.add(new THREE.Mesh(M.vehicleGeo('x', side), M.mat));
    }
    if (ringR > 0 && a.ring !== false) {
      const col = (M.SIDE[side] || M.SIDE.ne).main;
      const disc = new THREE.Mesh(new THREE.CircleGeometry(ringR, 24), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.42, depthWrite: false }));
      disc.rotation.x = -Math.PI / 2; disc.position.y = 0.09;
      g.add(disc);
      const rim = new THREE.Mesh(new THREE.RingGeometry(ringR * 0.92, ringR, 24), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.95, depthWrite: false }));
      rim.rotation.x = -Math.PI / 2; rim.position.y = 0.1;
      g.add(rim);
    }
    return { g, alt, anim, ringR };
  };

  P.spawn = function (a, instant) {
    if (a.id && this.units[a.id]) this.removeUnit(a.id);
    const { g, alt, anim, ringR } = this._makeUnit(a);
    const [x, z] = this.xz(a.at);
    g.position.set(x, this.groundY(x, z) + alt, z);
    g.rotation.y = a.rot != null ? U.rad(a.rot) : 0;
    if (a.face) { const [fx, fz] = this.xz(a.face); g.rotation.y = Math.atan2(fx - x, fz - z); }
    this.actors.add(g);
    const u = { id: a.id || 'u' + Math.random().toString(36).slice(2, 7), group: g, kind: a.kind || 'inf', side: a.side || 'vn', alt, label: null };
    this.units[u.id] = u;
    if (!instant && u.kind === 'heli') this.sfx('heli', g.position, { dur: 5 });
    if (anim) this.anims.push(anim);
    if (a.label) u.label = this.addLabel({ unit: u, text: a.label, side: a.side || 'vn', imp: 2, lift: (alt ? 2.2 : 2.6) * (a.sc || 1) + (ringR ? 0 : 0.5) });
    if (!instant) {
      g.scale.setScalar(0.01);
      this.tween(0.55, (p) => g.scale.setScalar(Math.max(0.01, p)), null, U.ease.out);
    }
    return u;
  };
  /* tiếng binh khí: chia trái/phải theo vị trí trên màn hình, nhỏ dần khi xa camera */
  P.sfx = function (kind, p, o) {
    const fx = SBS.audio && SBS.audio.fx;
    if (!fx || this.paused || !p) return;
    const py = p.y != null ? p.y : 0, pv = new THREE.Vector3(p.x, py, p.z), v = pv.clone().project(this.camera);
    const off = Math.abs(v.x) > 1.3 || v.z > 1;
    const vol = U.clamp(1.4 - this.camera.position.distanceTo(pv) / 150, 0.5, 1) * (off ? 0.45 : 1);
    const opt = Object.assign({}, o);
    opt.pan = U.clamp(v.x * 0.8, -0.9, 0.9); opt.vol = vol * ((o && o.vol) || 1);
    fx.play(kind, opt);
  };
  /* vệt bụi sau xe, khói động cơ xe tăng, vệt khói máy bay, gió quạt trực thăng */
  P._trail = function (u, x, y, z, dx, dz) {
    const l = Math.hypot(dx, dz) || 1, fx = dx / l, fz = dz / l, k = u.kind;
    if (PLANES.includes(k)) {
      const offs = k === 'b52' ? [-1.4, 1.4] : [0];
      offs.forEach((o) => this.spawnPart('smoke', x - fx * 2.2 - fz * o, y, z - fz * 2.2 + fx * o, { s0: 0.7, s1: k === 'b52' ? 2.8 : 1.8, life: 1.4, a: 0.38 }));
      if (k === 'mig' || k === 'f4') this.spawnPart('fire', x - fx * 1.5, y, z - fz * 1.5, { s0: 0.8, s1: 0.1, life: 0.18, a: 0.9 });
    } else if (k === 'tank' || k === 'apc' || k === 'truck' || k === 'jeep') {
      this.spawnPart('dust', x - fx * 1.4, y + 0.2, z - fz * 1.4, { s0: 0.8, s1: 2.8, life: 1.0, vy: 0.35, a: 0.5 });
      if (k === 'tank' && Math.random() < 0.5) this.spawnPart('smoke', x - fx * 1.0, y + 0.9, z - fz * 1.0, { s0: 0.4, s1: 1.4, life: 0.9, vy: 0.8, a: 0.45 });
    } else if (k === 'gun' || k === 'aaa') {
      this.spawnPart('dust', x - fx * 1.0, y + 0.15, z - fz * 1.0, { s0: 0.6, s1: 1.9, life: 0.9, vy: 0.25, a: 0.4 });
    } else if (k === 'heli') {
      this.spawnPart('dust', x, this.groundY(x, z) + 0.3, z, { s0: 1.0, s1: 3.2, life: 0.9, vy: 0.2, a: 0.4 });
    }
  };
  P._recoil = function (g) {
    const bx = g.position.x, bz = g.position.z, sx = Math.sin(g.rotation.y), cz = Math.cos(g.rotation.y);
    this.tween(0.24, (p) => { const k = Math.sin(p * Math.PI) * 0.6; g.position.x = bx - sx * k; g.position.z = bz - cz * k; }, () => { g.position.x = bx; g.position.z = bz; }, U.ease.linear);
  };
  P.removeUnit = function (id) {
    const u = this.units[id];
    if (!u) return;
    u.group.userData.dead = true;
    this.actors.remove(u.group);
    if (u.label) this.removeLabel(u.label);
    delete this.units[id];
  };

  /* chuyển động theo đường gấp khúc */
  P.moveUnit = function (a, instant) {
    const u = this.units[a.id];
    if (!u) return;
    const g = u.group;
    const refs = a.path || [a.to];
    const pts = [[g.position.x, g.position.z]].concat(refs.map((r) => this.xz(r)));
    const lens = [0];
    for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = lens[lens.length - 1] || 1;
    const dur = a.dur || Math.max(2, total / 9);
    const flyer = u.alt > 0.5;
    let lastDrop = -9, lastTrail = -9;
    const drop = a.drop ? a.drop : null;
    if (!instant) {
      const p0 = { x: g.position.x, y: g.position.y, z: g.position.z };
      if (u.kind === 'tank' || u.kind === 'apc' || u.kind === 'truck' || u.kind === 'jeep') this.sfx('tank', p0, { dur, unit: u.kind });
      else if (PLANES.includes(u.kind)) this.sfx('jet', p0, { dur, unit: u.kind });
      else if (u.kind === 'heli') this.sfx('heli', p0, { dur });
      else if (u.kind === 'gun' || u.kind === 'aaa') this.sfx('haul', p0, { dur });
    }
    const upd = (p) => {
      if (u.falling || g.userData.dead) return;
      const d = p * total;
      let i = 1;
      while (i < lens.length - 1 && lens[i] < d) i++;
      const seg = lens[i] - lens[i - 1] || 1, k = U.clamp((d - lens[i - 1]) / seg, 0, 1);
      const x = U.lerp(pts[i - 1][0], pts[i][0], k), z = U.lerp(pts[i - 1][1], pts[i][1], k);
      const dx = pts[i][0] - pts[i - 1][0], dz = pts[i][1] - pts[i - 1][1];
      if (dx || dz) g.rotation.y = Math.atan2(dx, dz);
      const bob = u.kind === 'inf' ? Math.abs(Math.sin(this.time * 9)) * 0.14 : u.kind === 'bike' ? Math.abs(Math.sin(this.time * 7)) * 0.05 : 0;
      const rough = (u.kind === 'tank' || u.kind === 'apc' || u.kind === 'truck' || u.kind === 'jeep') ? Math.sin(this.time * 14) * 0.04 : u.kind === 'heli' ? Math.sin(this.time * 3) * 0.15 : 0;
      g.position.set(x, this.groundY(x, z) + u.alt + bob + rough, z);
      if (rough && u.kind !== 'heli') g.rotation.x = Math.sin(this.time * 9) * 0.03;
      if (u.kind === 'heli') g.rotation.x = -0.12;
      if (u.kind === 'boat') g.rotation.z = Math.sin(this.time * 2) * 0.05;
      if (!instant && this.time - lastTrail > 0.11) { lastTrail = this.time; this._trail(u, x, g.position.y, z, dx, dz); }
      if (flyer && (u.kind === 'b52' || u.kind === 'mig' || u.kind === 'f4')) g.rotation.z = Math.sin(p * 6.28) * 0.12;
      if (drop && p > drop[0] && p < drop[1] && this.time - lastDrop > 0.3 && !instant) { lastDrop = this.time; this._bomb(x, g.position.y, z); }
    };
    this.tween(dur, upd, () => { if (a.remove) this.removeUnit(a.id); }, a.ease === 'linear' || flyer ? U.ease.linear : U.ease.inOut, instant);
  };

  P._bomb = function (x, y, z) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.55, 5), new THREE.MeshBasicMaterial({ color: 0x222222 }));
    m.position.set(x, y - 0.5, z);
    this.actors.add(m);
    const gy = this.groundY(x, z);
    const y0 = y - 0.5;
    this.sfx('whistle', { x, y, z }, { dur: 0.8 });
    this.tween(0.8, (p) => { m.position.y = U.lerp(y0, gy, p * p); }, () => { this.actors.remove(m); m.geometry.dispose(); m.material.dispose(); this.boom(x + (Math.random() - 0.5) * 1.2, z + (Math.random() - 0.5) * 1.2, 1.1); }, U.ease.linear);
  };

  P.shootdown = function (u) {
    if (!u || u.falling) return;
    u.falling = true;
    this.sfx('down', u.group.position);
    const g = u.group, y0 = g.position.y, dir = (Math.random() - 0.5) * 2;
    this.tween(1.7, (p) => {
      g.position.y = U.lerp(y0, this.groundY(g.position.x, g.position.z) + 0.3, p * p);
      g.position.x += dir * 0.05; g.rotation.z += 0.12; g.rotation.x = p * 0.8;
      if (Math.random() < 0.7) { this.spawnPart('fire', g.position.x, g.position.y, g.position.z, { s0: 1.4, s1: 0.3, life: 0.5, a: 0.9 }); this.spawnPart('smoke', g.position.x, g.position.y, g.position.z, { s0: 1, s1: 4, life: 2.2, vy: 0.5, a: 0.6 }); }
    }, () => {
      this.boom(g.position.x, g.position.z, 2.2, 3);
      this.shake = Math.max(this.shake, 0.5);
      this.emitters.push({ x: g.position.x, y: this.groundY(g.position.x, g.position.z), z: g.position.z, kind: 'smoke', rate: 3, acc: 0 });
      this.removeUnit(u.id);
    }, U.ease.in);
  };

  /* ---------- Nổ, khói, đạn ---------- */
  P.boom = function (x, z, size, n) {
    size = size || 1;
    const y = this.groundY(x, z) + 0.5;
    this.sfx('boom', { x, y, z }, { size });
    for (let i = 0; i < (n || 1); i++) {
      const ox = i ? (Math.random() - 0.5) * 3 * size : 0, oz = i ? (Math.random() - 0.5) * 3 * size : 0;
      this.spawnPart('fire', x + ox, y, z + oz, { s0: 0.8 * size, s1: 4.2 * size, life: 0.65, a: 1, vy: 1.5 });
      for (let k = 0; k < 3; k++) this.spawnPart('smoke', x + ox + (Math.random() - 0.5), y + 0.4, z + oz + (Math.random() - 0.5), { s0: 1 * size, s1: 4.8 * size, life: 2.4 + Math.random(), vy: 1.2 + Math.random(), vx: (Math.random() - 0.5) * 0.8, a: 0.6 });
      this.spawnPart('dust', x + ox, y - 0.3, z + oz, { s0: 1.5 * size, s1: 6 * size, life: 1.3, vy: 0.2, a: 0.7 });
    }
    if (size >= 1.4) this.shake = Math.max(this.shake, Math.min(0.45, size * 0.12));
  };
  P.tracer = function (a, instant) {
    if (instant) return;
    const f = this.pos(a.from, 1.1), t = this.pos(a.to, 1.0), n = a.n || 8;
    this.sfx('mg', f, { n, gap: a.gap || 0.16 });
    for (let i = 0; i < n; i++) {
      this.at(i * (a.gap || 0.16) + Math.random() * 0.08, () => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.9), new THREE.MeshBasicMaterial({ color: 0xffe066 }));
        const s = f.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.5, Math.random() * 0.5, (Math.random() - 0.5) * 1.5));
        const e = t.clone().add(new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 0.6, (Math.random() - 0.5) * 3));
        m.position.copy(s); m.lookAt(e);
        this.actors.add(m);
        this.spawnPart('fire', s.x, s.y, s.z, { s0: 0.6, s1: 0.1, life: 0.2, a: 0.9 });
        this.tween(0.32, (p) => m.position.lerpVectors(s, e, p), () => { this.actors.remove(m); m.geometry.dispose(); m.material.dispose(); if (Math.random() < 0.4) this.spawnPart('dust', e.x, e.y, e.z, { s0: 0.6, s1: 1.8, life: 0.7, a: 0.6 }); }, U.ease.linear);
      });
    }
  };
  P.shell = function (a, instant) {
    if (instant) return;
    const f = this.pos(a.from, 1.0), t = this.pos(a.to, 0.2), n = a.n || 4;
    for (let i = 0; i < n; i++) {
      this.at(i * 0.45 + Math.random() * 0.2, () => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 5), new THREE.MeshBasicMaterial({ color: 0x222222 }));
        this.actors.add(m);
        const e = t.clone().add(new THREE.Vector3((Math.random() - 0.5) * 4, 0, (Math.random() - 0.5) * 4));
        this.spawnPart('fire', f.x, f.y, f.z, { s0: 1.2, s1: 0.2, life: 0.3, a: 1 });
        this.sfx('cannon', f);
        this.sfx('whistle', f, { dur: 0.9, delay: 0.15 });
        const gunU = this.units[a.from]; if (gunU) this._recoil(gunU.group);
        this.tween(1.1, (p) => { m.position.lerpVectors(f, e, p); m.position.y += Math.sin(p * Math.PI) * (a.arc || 9); }, () => { this.actors.remove(m); m.geometry.dispose(); m.material.dispose(); this.boom(e.x, e.z, 1.0 + (a.big ? 0.8 : 0)); }, U.ease.linear);
      });
    }
  };
  P.sam = function (a, instant) {
    if (instant) return;
    const tgt = this.units[a.at];
    if (!tgt) return;
    const f = this.pos(a.from, 1.6);
    const m = new THREE.Group();
    m.add(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 6), new THREE.MeshBasicMaterial({ color: 0xf2f2ee })));
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 6), new THREE.MeshBasicMaterial({ color: 0xc53030 }));
    tip.position.y = 0.9; m.add(tip);
    m.position.copy(f); this.actors.add(m);
    this.sfx('sam', f);
    this.boom(f.x, f.z, 0.9);
    const last = new THREE.Vector3();
    this.tween(a.dur || 2.0, (p) => {
      if (tgt && !tgt.group.userData.dead) last.copy(tgt.group.position);
      const prev = m.position.clone();
      m.position.lerpVectors(f, last, p);
      m.position.y += Math.sin(Math.min(p, 1) * 1.2) * 2.0 * (1 - p);
      const dir = m.position.clone().sub(prev);
      if (dir.lengthSq() > 1e-6) m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      this.spawnPart('smoke', m.position.x, m.position.y, m.position.z, { s0: 0.7, s1: 2.2, life: 1.4, a: 0.7 });
    }, () => {
      this.actors.remove(m);
      this.boom(last.x, last.z, 0.8);
      this.spawnPart('fire', last.x, last.y, last.z, { s0: 1.5, s1: 5, life: 0.5, a: 1 });
      if (a.hit !== false && tgt && !tgt.group.userData.dead) this.shootdown(tgt);
    }, U.ease.in);
  };

  /* ---------- Camera chạy theo mũi tên ---------- */
  /* đặt camera nhìn dọc theo mũi tên (từ đuôi tới đầu), vừa khung hình; chỉ gọi khi bấm mũi tên hoặc khi đang kể diễn biến */
  P.focusCurve = function (curve, len, o) {
    o = o || {};
    const p0 = curve.getPoint(0), p1 = curve.getPoint(1), pm = curve.getPoint(0.5);
    const g = this.goal;
    const tgt = Math.atan2(-(p1.x - p0.x), -(p1.z - p0.z));
    const diff = U.clamp(wrapPI(tgt - g.yaw), -(o.maxTurn || 1.2), o.maxTurn || 1.2);
    g.yaw = g.yaw + diff;
    g.d = U.clamp(len * 0.85 + 34, 46, 105);
    g.pitch = U.rad(o.pitch || 50);
    if (!o.keepTarget) { g.x = pm.x; g.z = pm.z; g.y = this.groundY(pm.x, pm.z); }
  };
  P.focusArrow = function (rec) { if (rec) this.focusCurve(rec.curve, rec.len, { maxTurn: 2.4 }); };

  /* ---------- Mũi tên (đỏ = ta, xanh = địch) ---------- */
  P.arrow = function (a, instant) {
    const refs = a.path || [a.from, a.to];
    const base = refs.map((r) => this.xz(r));
    const dense = [];
    for (let i = 0; i < base.length - 1; i++) {
      const [ax, az] = base[i], [bx, bz] = base[i + 1], d = Math.hypot(bx - ax, bz - az), k = Math.max(1, Math.round(d / 2.2));
      for (let j = 0; j < k; j++) dense.push([U.lerp(ax, bx, j / k), U.lerp(az, bz, j / k)]);
    }
    dense.push(base[base.length - 1]);
    const lift = a.lift != null ? a.lift : 1.5;
    // độ cao = điểm cao nhất lân cận để mũi tên không chìm vào sườn đồi
    const hs = dense.map(([x, z]) => Math.max(this.groundY(x, z), this.groundY(x + 1.2, z), this.groundY(x - 1.2, z), this.groundY(x, z + 1.2), this.groundY(x, z - 1.2)));
    const sm = hs.map((h, i) => Math.max(h, (hs[i - 1] || h) * 0.85, (hs[i + 1] || h) * 0.85));
    const air = a.air || 0;
    const pts = dense.map(([x, z], i) => new THREE.Vector3(x, sm[i] + lift + (air ? air * Math.sin(Math.PI * (i / Math.max(1, dense.length - 1))) + 0.4 * air : 0), z));
    if (pts.length < 2) return null;
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    const len = curve.getLength(), segs = Math.max(24, Math.floor(len * 1.1)), w = a.w || 1;
    const R = 0.35 * w; // bán kính thân mũi tên (chỉnh độ dày ở đây); đầu mũi tên và gạch trắng tự tỉ lệ theo
    const color = a.color != null ? a.color : SIDE_ARROW[a.side || 'vn'];
    const geo = new THREE.TubeGeometry(curve, segs, R, 8, false);
    const op = a.ghost ? 0.5 : 1;
    const tube = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op }));
    const head = new THREE.Mesh(new THREE.ConeGeometry(3.1 * R, 8 * R, 16), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op }));
    // ống vô hình, dày hơn, để dễ bấm trúng mũi tên
    const hit = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(12, segs >> 1), 1.25 * w, 4, false), new THREE.MeshBasicMaterial({ visible: false }));
    // quầng sáng mỏng cùng màu quanh thân (như ảnh mẫu), không làm mũi tên to thêm
    const glow = new THREE.Mesh(new THREE.TubeGeometry(curve, segs, 1.5 * R, 8, false), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: a.ghost ? 0.1 : 0.24, depthWrite: false }));
    const grp = new THREE.Group();
    grp.add(glow, tube, head, hit);
    this.actors.add(grp);
    const total = geo.index.count;
    const rec = { grp, ghost: !!a.ghost, id: a.id || null, label: null, opt: a.opt || null, kind: a.kind || null, color, base: op, dim: false, dead: false, tube, head, glow, hit, curve, wps: [], fired: new Set(), phase: Math.random() * 6.28, len, live: false, side: a.side || 'vn' };
    // các gạch sáng nằm dọc đường giữa thân mũi tên (như vạch kẻ đường), nhấp nháy lệch pha
    const crackCol = new THREE.Color(0xffffff); // gạch trắng nằm giữa thân đỏ / xanh liền một màu (như ảnh mẫu)
    const up3 = new THREE.Vector3(0, 1, 0), STEP = 4.5 * R, DLEN = 2.8 * R, endS = Math.max(0, len - 3 * R);
    const nSeg = Math.max(1, Math.floor((endS - 0.4) / STEP) + 1);
    const cv = [], cc = [], ci = [], grpOf = [], quadEnd = [];
    for (let i = 0; i < nSeg; i++) {
      const s0 = 0.4 + i * STEP, s1 = Math.min(s0 + DLEN, len - 0.01);
      const pa = curve.getPointAt(Math.min(1, s0 / len)), pb = curve.getPointAt(Math.min(1, s1 / len));
      pa.y += R + 0.06; pb.y += R + 0.06;
      const r = new THREE.Vector3().crossVectors(pb.clone().sub(pa), up3).normalize().multiplyScalar(0.36 * R), base = cv.length / 3;
      [pa.clone().sub(r), pa.clone().add(r), pb.clone().add(r), pb.clone().sub(r)].forEach((v) => { cv.push(v.x, v.y, v.z); cc.push(crackCol.r, crackCol.g, crackCol.b, 0); grpOf.push(i); });
      ci.push(base, base + 1, base + 2, base, base + 2, base + 3);
      quadEnd.push(i + 1);
    }
    const cgeo = new THREE.BufferGeometry();
    cgeo.setAttribute('position', new THREE.Float32BufferAttribute(cv, 3));
    cgeo.setAttribute('color', new THREE.Float32BufferAttribute(cc, 4));
    cgeo.setIndex(ci);
    const cmesh = new THREE.Mesh(cgeo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
    cmesh.frustumCulled = false;
    grp.add(cmesh);
    rec.crack = { geo: cgeo, grpOf, quadEnd, nSeg };
    rec.ord = this._ord = (this._ord == null ? 0 : this._ord + 1);
    this.arrows.push(rec);
    // địa danh dọc đường đi: mũi tên chạm tới thì địa danh chớp sáng
    refs.forEach((r) => {
      if (typeof r !== 'string' || !this.map.places[r] || !this.map.places[r].label) return;
      const [px, pz] = this.xz(r);
      let best = 0, bd = 1e9;
      for (let i = 0; i <= 64; i++) { const q = curve.getPoint(i / 64), d = (q.x - px) * (q.x - px) + (q.z - pz) * (q.z - pz); if (d < bd) { bd = d; best = i / 64; } }
      rec.wps.push({ key: r, u: best });
    });
    // camera chạy theo mũi tên khi đang kể (không chồng nhiều mũi tên cùng lúc)
    const follow = !instant && a.follow !== false && this.followOn && this.focusOrd == null && this.time - (this._lastFollow == null ? -99 : this._lastFollow) > 2.0;
    if (follow) { this._lastFollow = this.time; this.focusCurve(curve, len, { keepTarget: true, maxTurn: 0.95 }); }
    if (!instant && this.focusOrd != null && rec.ord === this.focusOrd) this.focusArrow(rec);
    const mid = curve.getPoint(0.5);
    const up = new THREE.Vector3(0, 1, 0);
    const place = (p) => {
      const cnt = Math.floor(p * segs) * 8 * 6; // 8 cạnh tròn × 6 chỉ số mỗi ô: vẽ đúng tới tận đầu mũi tên
      geo.setDrawRange(0, Math.min(total, Math.max(0, cnt)));
      glow.geometry.setDrawRange(0, Math.min(total, Math.max(0, cnt)));
      const pp = curve.getPoint(Math.min(1, p)), tg = curve.getTangent(Math.min(1, p));
      head.position.copy(pp).addScaledVector(tg, 2.6 * R);
      head.quaternion.setFromUnitVectors(up, tg);
      head.visible = glow.visible = p > 0.02;
      if (rec.crack) { const ck = rec.crack, k = Math.min(ck.nSeg - 1, Math.floor(p * ck.nSeg)); ck.geo.setDrawRange(0, p > 0.02 ? ck.quadEnd[k] * 6 : 0); }
      if (follow && !rec.dead) { this.goal.x = U.lerp(mid.x, pp.x, 0.75); this.goal.z = U.lerp(mid.z, pp.z, 0.75); this.goal.y = this.groundY(this.goal.x, this.goal.z); }
      if (!instant) rec.wps.forEach((wp) => { if (!rec.fired.has(wp.key) && p >= wp.u - 0.02) { rec.fired.add(wp.key); this.pingPlace(wp.key, color, true); } });
    };
    if (a.label) {
      const lp = curve.getPoint(0.3);
      rec.label = this.addLabel({ x: lp.x, z: lp.z, y: lp.y, lift: 1.9, text: a.label, side: a.side || 'vn', imp: 2, cls: 'alabel' + (color === BLUE ? ' blue' : '') });
      rec.label.el.style.opacity = '0';
    }
    this.anims.push((dt, t) => {
      if (rec.dead) return false;
      const dim = rec.dim;
      rec.tube.material.opacity = rec.head.material.opacity = rec.base * (dim ? 0.9 : 1); // thân đặc, liền một màu
      rec.glow.material.opacity = (rec.ghost ? 0.1 : 0.2 + 0.08 * Math.sin(t * 3.2 + rec.phase)) * (dim ? 0.4 : 1);
      const ck = rec.crack;
      if (ck) {
        const ca = ck.geo.attributes.color, arr = ca.array;
        for (let v = 0; v < ck.grpOf.length; v++) {
          const f = Math.pow(Math.max(0, Math.sin(t * 5 + ck.grpOf[v] * 1.1 + rec.phase)), 2); // gạch trắng sáng dần chạy dọc thân, không bao giờ tắt hẳn
          arr[v * 4 + 3] = (0.78 + 0.22 * f) * (dim ? 0.3 : 1) * (rec.ghost ? 0.5 : 1);
        }
        ca.needsUpdate = true;
      }
      return true;
    });
    this.tween(a.dur || 2.4, (p) => place(p), () => { place(1); rec.live = true; if (rec.label) rec.label.el.style.opacity = '1'; }, U.ease.inOut, instant);
    if (instant) rec.live = true;
    return rec;
  };
  /* địa danh chớp sáng khi mũi tên chạm tới */
  P.pingPlace = function (key, color, strong) {
    const lb = this.labels.find((l) => l.id === 'pl_' + key);
    if (lb) {
      const el = lb.el;
      el.style.setProperty('--pc', '#' + new THREE.Color(color).getHexString());
      el.classList.remove('ping'); void el.offsetWidth; el.classList.add('ping');
      clearTimeout(lb._pt);
      lb._pt = setTimeout(() => el.classList.remove('ping'), 1200);
    }
    if (strong) this.pulse({ at: key, color, r: 3.4, n: 1 });
  };
  P._killArrow = function (r) {
    r.dead = true;
    this.actors.remove(r.grp);
    r.grp.traverse((n) => { if (n.geometry) n.geometry.dispose(); if (n.material) n.material.dispose(); });
    if (r.label) this.removeLabel(r.label);
  };
  P.clearKind = function (kind, onlyGhost) {
    if (kind === 'arrows') {
      this.arrows = this.arrows.filter((r) => { if (onlyGhost && !r.ghost) return true; this._killArrow(r); return false; });
    } else if (kind === 'marks') {
      this.marks.forEach((l) => this.removeLabel(l));
      this.marks = [];
    } else if (kind === 'rings') {
      this.rings.forEach((r) => { this.actors.remove(r.grp); r.grp.traverse((n) => { if (n.geometry) n.geometry.dispose(); if (n.material) n.material.dispose(); }); if (r.label) this.removeLabel(r.label); });
      this.rings = [];
    }
  };
  P.ghost = function (acts) {
    this.clearKind('arrows', true);
    (acts || []).forEach((a) => this.arrow(Object.assign({}, a, { ghost: true, dur: 0.9 }), false));
  };

  /* bấm chuột vào mũi tên (tia từ camera) */
  P.pickArrow = function (clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    const rc = this._rc || (this._rc = new THREE.Raycaster());
    rc.setFromCamera(ndc, this.camera);
    const meshes = [];
    this.arrows.forEach((r) => { if (!r.dead) meshes.push(r.hit, r.head); });
    const hits = rc.intersectObjects(meshes, false);
    if (!hits.length) return null;
    const m = hits[0].object;
    return this.arrows.find((r) => r.hit === m || r.head === m) || null;
  };

  /* ---------- Quyết định trên sa bàn: mối đe doạ (xanh) và 3 phương án (đỏ) ---------- */
  P.threat = function (list, sync) {
    const acts = (list || []).map((a) => Object.assign({ t: 'arrow', side: 'fr', kind: 'threat', dur: 2.2 }, a));
    this.runActs(acts, false, sync);
  };
  P.clearOptions = function () {
    this.arrows = this.arrows.filter((r) => { if (!r.opt) return true; this._killArrow(r); return false; });
    this.rings = this.rings.filter((r) => {
      if (!r.opt) return true;
      this.actors.remove(r.grp); r.grp.traverse((n) => { if (n.geometry) n.geometry.dispose(); if (n.material) n.material.dispose(); });
      if (r.label) this.removeLabel(r.label);
      return false;
    });
    (this.optMarks || []).forEach((l) => this.removeLabel(l));
    this.optMarks = [];
  };
  /* list: [{k, letter, short, acts:[{from,to|path|t:'ring',...}]}] – vẽ cả ba phương án; nhãn tròn A/B/C kèm câu hỏi ngắn, bấm được */
  P.optionArrows = function (list, onPick) {
    this.clearOptions();
    list.forEach((o) => {
      let anchor = null;
      (o.acts || []).forEach((a) => {
        if (a.t === 'ring') {
          this.ring(Object.assign({ color: RED, fill: false, dur: 0.9, w: 1.1 }, a, { opt: o.k }));
          if (!anchor) { const [cx, cz] = this.xz(a.at); anchor = [cx + (a.rx || 6) * 0.7, cz - (a.rz || a.rx || 6) * 0.7]; }
        } else {
          this.arrow(Object.assign({ side: 'vn', dur: 1.5, follow: false }, a, { opt: o.k, delay: undefined }), false);
          if (!anchor) { const refs = a.path || [a.from, a.to]; anchor = this.xz(refs[refs.length - 1]); }
        }
      });
      if (!anchor) return;
      const y = this.groundY(anchor[0], anchor[1]);
      const lb = this.addLabel({ x: anchor[0], z: anchor[1], y, lift: 3.6, text: `<b>${o.letter}</b><span>${U.esc(String(o.short || '').replace(/\s*[?？]\s*$/, ''))} ?</span>`, html: true, imp: 3, cls: 'optmark', always: true });
      lb.el.dataset.k = o.k;
      lb.el.addEventListener('click', (e) => { e.stopPropagation(); if (onPick) onPick(o.k); });
      (this.optMarks = this.optMarks || []).push(lb);
    });
    this.selectOption(null);
  };
  P.selectOption = function (k) {
    this.arrows.forEach((r) => { if (r.opt) { r.dim = k != null && r.opt !== k; r.base = r.dim ? 0.26 : 0.95; } });
    this.rings.forEach((r) => { if (r.opt) r.grp.children.forEach((c) => { c.material.opacity = c.geometry.type === 'CircleGeometry' ? 0.12 : r.opt === k || k == null ? 0.95 : 0.25; }); });
    (this.optMarks || []).forEach((l) => { l.el.classList.toggle('sel', l.el.dataset.k === k); l.el.classList.toggle('dim', k != null && l.el.dataset.k !== k && !l.el.classList.contains('bad')); });
  };
  P.markOption = function (k, state) { // 'bad' | 'good'
    const lb = (this.optMarks || []).find((l) => l.el.dataset.k === k);
    if (lb) { lb.el.classList.remove('sel', 'dim'); lb.el.classList.add(state); const b = lb.el.querySelector('b'); if (b) b.textContent = state === 'bad' ? '✘' : '✔'; }
    if (state === 'bad') this.arrows.forEach((r) => { if (r.opt === k) { r.dim = true; r.base = 0.16; } });
  };
  P.keepOnly = function (k) {
    this.arrows = this.arrows.filter((r) => { if (r.opt && r.opt !== k) { this._killArrow(r); return false; } return true; });
    (this.optMarks || []).forEach((l) => { if (l.el.dataset.k !== k) l.el.style.display = 'none'; });
    this.selectOption(k);
  };

  /* ---------- Vòng vây / vùng ---------- */
  P.ring = function (a, instant) {
    const [cx, cz] = this.xz(a.at), rx = a.rx || 8, rz = a.rz || a.rx || 8, N = 48;
    const pts = [];
    for (let i = 0; i < N; i++) { const t = (i / N) * Math.PI * 2, x = cx + Math.cos(t) * rx, z = cz + Math.sin(t) * rz; pts.push(new THREE.Vector3(x, this.groundY(x, z) + 0.55, z)); }
    const curve = new THREE.CatmullRomCurve3(pts, true);
    const geo = new THREE.TubeGeometry(curve, 96, 0.17 * (a.w || 1), 5, true);
    const color = a.color != null ? a.color : 0x35d07f;
    const grp = new THREE.Group();
    grp.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 })));
    if (a.fill) {
      const disc = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, depthWrite: false }));
      disc.rotation.x = -Math.PI / 2; disc.position.set(cx, this.groundY(cx, cz) + 0.9, cz); disc.scale.set(rx, rz, 1);
      grp.add(disc);
    }
    this.actors.add(grp);
    const rec = { grp, label: null, id: a.id, opt: a.opt || null };
    if (a.label && !a.opt) rec.label = this.addLabel({ x: cx + rx * 0.7, z: cz - rz * 0.7, lift: 1.5, text: a.label, side: a.side || 'ne', imp: 2, cls: 'alabel' });
    if (a.id) this.rings = this.rings.filter((r) => { if (r.id === a.id) { this.actors.remove(r.grp); return false; } return true; });
    this.rings.push(rec);
    this.tween(a.dur || 1.4, (p) => { grp.children.forEach((c) => (c.material.opacity = (c.geometry.type === 'CircleGeometry' ? 0.16 : 0.95) * Math.min(1, p * 1.4))); }, null, U.ease.out, instant);
  };
  P.pulse = function (a, instant) {
    if (instant) return;
    const [x, z] = this.xz(a.at), y = this.groundY(x, z) + 0.7, color = a.color != null ? a.color : 0xffd23f, r = a.r || 6;
    for (let i = 0; i < (a.n || 3); i++) {
      this.at(i * 0.5, () => {
        const m = new THREE.Mesh(new THREE.RingGeometry(0.88, 1, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
        m.rotation.x = -Math.PI / 2; m.position.set(x, y, z);
        this.actors.add(m);
        this.tween(1.6, (p) => { m.scale.setScalar(0.4 + p * r); m.material.opacity = 0.9 * (1 - p); }, () => { this.actors.remove(m); m.geometry.dispose(); m.material.dispose(); }, U.ease.out);
      });
    }
  };

  /* ---------- Cờ, nhãn, dù ---------- */
  P.flag = function (a, instant) {
    const key = typeof a.at === 'string' ? a.at : null;
    const pl = key && this.map.places[key];
    if (pl && pl.type === 'palace' && this.palaceFlag) {
      this.palaceFlag.visible = true;
      this.palaceFlag.scale.setScalar(0.01);
      this.tween(1.6, (p) => this.palaceFlag.scale.setScalar(Math.max(0.01, p)), null, U.ease.out, instant);
      return;
    }
    const f = M.makeFlag(a.kind || 'vn', a.sc || 1);
    const p = this.pos(a.at);
    f.position.copy(p);
    this.actors.add(f);
    (this.aflags = this.aflags || []).push(f);
    this.tween(1.4, (t) => f.scale.set(1, Math.max(0.01, t), 1), null, U.ease.out, instant);
  };
  P.mark = function (a) {
    const [x, z] = this.xz(a.at);
    const lb = this.addLabel({ x, z, lift: a.lift || 5.5, text: a.text, side: a.side || 'ne', imp: 3, cls: 'mark' });
    this.marks.push(lb);
  };
  P.para = function (a, instant) {
    if (instant) return;
    const [cx, cz] = this.xz(a.at), n = a.n || 8;
    if (a.plane !== false) this.act({ t: 'fly', id: 'pp' + Math.random().toString(36).slice(2, 6), kind: a.plane || 'dak', side: a.side || 'fr', path: [[cx - 38, cz - 8], [cx, cz], [cx + 38, cz + 8]], dur: 5.2, alt: 11 }, false);
    for (let i = 0; i < n; i++) {
      this.at(2.4 + i * 0.18, () => {
        const g = new THREE.Group();
        g.add(new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: i % 2 ? 0xf4f4f0 : 0xb7c29a, side: THREE.DoubleSide })));
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 4), new THREE.MeshBasicMaterial({ color: 0x4d5a36 }));
        body.position.y = -0.8; g.add(body);
        const x = cx + (Math.random() - 0.5) * (a.spread || 7), z = cz + (Math.random() - 0.5) * (a.spread || 7), gy = this.groundY(x, z);
        g.position.set(x, gy + 15, z);
        this.actors.add(g);
        const sway = Math.random() * 6;
        this.tween(4.8 + Math.random(), (p) => { g.position.y = U.lerp(gy + 15, gy + 0.9, p); g.rotation.z = Math.sin(p * 9 + sway) * 0.2; }, () => { this.actors.remove(g); }, U.ease.linear);
      });
    }
  };

  /* ---------- Bộ điều phối hành động ---------- */
  P.act = function (a, instant) {
    switch (a.t) {
      case 'spawn': this.spawn(a, instant); break;
      case 'move': this.moveUnit(a, instant); break;
      case 'fly': {
        const path = a.path;
        const keep = a.remove === false;
        if (instant && !keep) break;
        const u = this.spawn(Object.assign({}, a, { at: path[0], kind: a.kind || 'b52', label: a.label }), true);
        if (path.length > 1) this.moveUnit({ id: u.id, path: path.slice(1), dur: a.dur || 8, drop: a.drop, remove: !keep, ease: 'linear' }, instant);
        break;
      }
      case 'remove': (Array.isArray(a.id) ? a.id : [a.id]).forEach((id) => { const u = this.units[id]; if (u && a.boom && !instant) this.boom(u.group.position.x, u.group.position.z, 1.2); this.removeUnit(id); }); break;
      case 'arrow': this.arrow(a, instant); break;
      case 'ring': this.ring(a, instant); break;
      case 'boom': if (!instant) { for (let i = 0; i < (a.n || 1); i++) this.at(i * (a.gap || 0.35), () => { const [x, z] = this.xz(a.at); this.boom(x + (Math.random() - 0.5) * (a.spread || 0), z + (Math.random() - 0.5) * (a.spread || 0), a.size || 1.2, 1); }); } break;
      case 'smoke': case 'fire': { const [x, z] = this.xz(a.at); this.emitters.push({ x, y: this.groundY(x, z), z, kind: a.t, rate: a.rate || (a.t === 'fire' ? 9 : 3), acc: 0, big: a.big }); break; }
      case 'tracer': this.tracer(a, instant); break;
      case 'shell': this.shell(a, instant); break;
      case 'sam': this.sam(a, instant); break;
      case 'down': if (!instant) this.shootdown(this.units[a.id]); break;
      case 'pulse': this.pulse(a, instant); break;
      case 'flag': this.flag(a, instant); break;
      case 'mark': this.mark(a); break;
      case 'para': this.para(a, instant); break;
      case 'shake': if (!instant) this.shake = a.amp || 0.6; break;
      case 'cam': this.setCam(a, instant); break;
      case 'clear': this.clearKind(a.what || 'arrows'); break;
      default: console.warn('Hành động lạ:', a);
    }
  };

  /* ---------- Đồng bộ hoạt cảnh với lời kể ---------- */
  /* Tính lại thời điểm các hành động: mũi tên tới địa danh nào thì đúng lúc giọng kể nhắc tên địa danh đó */
  P.syncActs = function (acts0, text, dur) {
    const acts = (acts0 || []).map((a) => Object.assign({}, a));
    if (!text || !dur || !acts.length) return acts;
    const ft = ' ' + U.fold(text) + ' ';
    const mention = (key) => {
      const p = this.map.places[key];
      if (!p) return -1;
      const names = [];
      if (p.say) names.push(...[].concat(p.say));
      if (p.label) {
        const w = U.fold(p.label.replace(/\(.*?\)/g, '').replace(/[←↑→]/g, '')).split(' ').filter(Boolean);
        for (let i = 0; i < w.length; i++) { const cand = w.slice(i).join(' '); if (w.length - i >= 2 || w.length === 1 ? cand.length >= 2 : cand.length >= 5) names.push(cand); }
      }
      for (const nm of names) { const i = ft.indexOf(' ' + U.fold(nm) + ' '); if (i >= 0) return i / ft.length; }
      return -1;
    };
    const phrase = (txt) => { const i = ft.indexOf(' ' + U.fold(txt) + ' '); return i >= 0 ? i / ft.length : -1; };
    const destOf = (a) => { if (a.sync) return 'S:' + a.sync; const r = a.t === 'arrow' ? (a.path || [a.from, a.to]).slice(-1)[0] : (typeof a.at === 'string' && a.at) || (typeof a.to === 'string' && a.to) || null; return typeof r === 'string' ? r : null; };
    const span = Math.max(1, ...acts.map((a) => (a.delay || 0) + (a.dur || 2)));
    const k = U.clamp((dur * 0.9) / span, 1, 3.2);
    const arr = {};
    acts.forEach((a) => {
      if (a.t !== 'arrow') return;
      const d = destOf(a);
      if (!d || arr[d]) return;
      const f = d.startsWith('S:') ? phrase(d.slice(2)) : mention(d);
      if (f >= 0) { const du = a.dur || 2.4; arr[d] = { old: (a.delay || 0) + du, nw: Math.max(du * 0.92, f * dur) }; }
    });
    /* Binh khí (pháo, súng, bom, tên lửa, máy bay, xe tăng…): nổ súng / xuất hiện đúng lúc giọng kể nhắc tới nó */
    const KIND = {};
    acts.forEach((a) => { if (a.t === 'spawn' && a.id) KIND[a.id] = a.kind || 'inf'; });
    const CUES = {
      shell: ['phao ta', 'phao binh', 'phao', 'no sung', 'ban'],
      tracer: ['cao xa', 'no sung', 'hoa luc', 'ban roi', 'ban'],
      boom: ['rai bom', 'bom', 'xoa so', 'tieu diet', 'danh chiem', 'no'],
      sam: ['ten lua', 'ban roi:2', 'boc chay:2'], // 'từ:lead' – tên lửa phải trúng đích đúng lúc giọng kể nhắc tới
      down: ['boc chay', 'ban chay', 'ban roi', 'roi xuong', 'roi'],
      fly: ['b 52', 'may bay', 'rai bom', 'khong quan', 'tiem kich', 'mig'],
      tank: ['xe tang', 'xe boc thep', 'tien vao', 'tien len'],
      heli: ['truc thang', 'do quan'],
      para: ['nhay du', 'quan du', 'du'],
      gun: ['keo phao', 'phao'],
      truck: ['xe', 'van tai', 'tiep te'],
    };
    const LEAD = { shell: 0.1, tracer: 0.1, boom: 0, sam: 0.2, down: 0.2, fly: 0.6, tank: 0.5, heli: 0.5, truck: 0.5, para: 2.4, gun: 0.3, S: 0 };
    const cueKey = (a) => {
      if (a.cue === false) return null;
      if (a.cue) return 'S';
      if (a.t === 'move') { const k = KIND[a.id]; return k === 'tank' || k === 'apc' ? 'tank' : k === 'heli' ? 'heli' : k === 'truck' || k === 'jeep' ? 'truck' : k === 'gun' || k === 'aaa' ? 'gun' : null; }
      return ['shell', 'tracer', 'boom', 'sam', 'down', 'fly', 'para'].includes(a.t) ? a.t : null;
    };
    /* mỗi loại binh khí: lần đầu xuất hiện khớp với từ khóa trong lời kể, các lần sau giữ nguyên khoảng cách so với lần đầu */
    const cueDelay = new Map(), groups = {};
    acts.forEach((a) => { const key = cueKey(a); if (key) (groups[key] = groups[key] || []).push(a); });
    Object.keys(groups).forEach((key) => {
      const list = groups[key].slice().sort((x, y) => (x.delay || 0) - (y.delay || 0));
      let f = -1, lead = LEAD[key];
      for (const w0 of key === 'S' ? [list[0].cue] : CUES[key]) {
        const [w, ld] = String(w0).split(':'), i = ft.indexOf(' ' + U.fold(w) + ' ');
        if (i < 0) continue;
        if (key === 'fly') { if (f < 0 || i / ft.length < f) f = i / ft.length; continue; } // máy bay: lấy từ nhắc sớm nhất
        f = i / ft.length; if (ld != null) lead = parseFloat(ld);
        break;
      }
      if (f < 0) return;
      const base = Math.max(0, f * dur - lead), d0 = list[0].delay || 0, span2 = Math.max(0, (list[list.length - 1].delay || 0) - d0);
      const m = span2 > 0 ? U.clamp((dur * 0.92 - base) / span2, 0.35, 1) : 1;
      list.forEach((a) => cueDelay.set(a, base + ((a.delay || 0) - d0) * m));
    });
    const stagger = {};
    acts.forEach((a) => {
      const d0 = a.delay || 0, d = destOf(a);
      let nd;
      if (cueDelay.has(a)) nd = cueDelay.get(a);
      else if (a.t === 'arrow' && d && arr[d]) { const n = (stagger[d] = (stagger[d] || 0) + 1) - 1; nd = arr[d].nw - (a.dur || 2.4) * 0.92 + n * 0.25; }
      else if (d && arr[d] && ['boom', 'flag', 'ring', 'shell', 'tracer', 'pulse', 'smoke', 'fire', 'mark', 'move'].includes(a.t) && d0 > 0) nd = arr[d].nw + (d0 - arr[d].old);
      else nd = d0 > 0 ? d0 * k : 0;
      a.delay = Math.max(0, nd);
    });
    /* tên lửa / máy bay trúng đạn chỉ có nghĩa khi máy bay đã xuất hiện */
    const made = {};
    acts.forEach((a) => { if ((a.t === 'spawn' || a.t === 'fly') && a.id) made[a.id] = a; });
    acts.forEach((a) => {
      const c = made[a.t === 'sam' ? a.at : a.t === 'down' ? a.id : null];
      if (c && a.delay < c.delay + 1.2) a.delay = c.delay + 1.2;
    });
    return acts;
  };
  P.runActs = function (acts, instant, sync) {
    const list = !instant && sync ? this.syncActs(acts, sync.text, sync.dur) : acts || [];
    list.forEach((a) => this.at(a.delay, () => this.act(a, instant), instant));
  };

  /* ---------- Chạy một bước ---------- */
  P.runStep = function (step, instant, sync) {
    if (!step.keepArrows) this.clearKind('arrows');
    this.clearKind('marks');
    if (step.cam) this.setCam(step.cam, instant);
    this.caption(step.cap || '');
    this.highlight(step.hl || []);
    this.followOn = !instant && !!sync; // camera chỉ tự chạy theo mũi tên khi đang kể diễn biến
    this.focusOrd = sync && sync.focusOrd != null ? sync.focusOrd : null; // bấm một mũi tên: camera bám mũi tên đó
    this._lastFollow = null;
    this._ord = -1;
    this.runActs(step.acts || [], instant, sync);
  };
  P.resetActors = function () { this.clearActors(); this.aflags = []; this.optMarks = []; this.followOn = false; };
  /* Đặt sa bàn ở trạng thái sau bước k (chạy nhanh các bước trước) */
  P.seek = function (steps, k) {
    this.resetActors();
    for (let i = 0; i < k; i++) if (!steps[i].decision) this.runStep(steps[i], true);
  };

  /* hiệu ứng khi chọn sai / đúng */
  P.failFx = function (at) {
    if (!at) return;
    this.pulse({ at, color: 0xff3b3b, r: 9, n: 3 });
    const [x, z] = this.xz(at);
    for (let i = 0; i < 3; i++) this.at(i * 0.3, () => this.boom(x + (Math.random() - 0.5) * 5, z + (Math.random() - 0.5) * 5, 1.4, 1));
    this.shake = 0.7;
  };
  P.okFx = function (at) {
    if (!at) return;
    this.pulse({ at, color: 0x3be08a, r: 9, n: 3 });
  };
})();
