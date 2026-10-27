/* Local, dependency-free coin study. A bevelled cylinder is rotated in 3D,
   lit and projected into a canvas. CSS positions each finished coin as one object.
   Angles are degrees; thickness is relative to diameter (0.09 = 9%). */
(() => {
  const coins = {
    left:   { tilt: 45, roll: 32, thickness: .13 },
    center: { tilt: 68, roll: -40, thickness: .14 },
    right:  { tilt: 32, roll: -24, thickness: .14 },
  };
  const rad = Math.PI / 180;
  // Shared face/rim palette keeps the bevel continuous with the flat face.
  const palette = {
    light: [244, 217, 229],
    mid: [233, 191, 210],
    shade: [205, 158, 182],
    edge: [174, 119, 145],
  };
  const rgb = values => `rgb(${values.join(',')})`;
  const normalize = v => {
    const length = Math.hypot(...v);
    return v.map(n => n / length);
  };
  const light = normalize([-.55, -.75, 1]);
  const dot = (a, b) => a.reduce((sum, n, i) => sum + n * b[i], 0);

  function draw(canvas) {
    const config = coins[canvas.dataset.coin];
    const size = Math.min(1800, Math.max(600,
      Math.ceil(canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 2))));
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const scale = size * .425;
    const tilt = config.tilt * rad;
    const roll = config.roll * rad;
    const rotate = ([x, y, z]) => {
      const tx = x * Math.cos(tilt) + z * Math.sin(tilt);
      const tz = -x * Math.sin(tilt) + z * Math.cos(tilt);
      return [tx * Math.cos(roll) - y * Math.sin(roll),
        tx * Math.sin(roll) + y * Math.cos(roll), tz];
    };
    const project = p => [size / 2 + p[0] * scale, size / 2 + p[1] * scale];
    const path = vertices => {
      ctx.beginPath();
      vertices.forEach((v, i) => {
        const [x, y] = project(v);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath();
    };

    // Rounded rim: a flat face, a quarter-round bevel, a solid cylindrical
    // wall, then the back bevel. These are actual separate 3D surfaces.
    const halfDepth = config.thickness;
    // A tighter bevel leaves a broader, clearly visible side wall.
    const bevel = .032;
    const rings = [];
    for (let i = 0; i <= 24; i++) {
      const a = i / 24 * Math.PI / 2;
      rings.push([1 - bevel + bevel * Math.sin(a),
        -halfDepth + bevel * (1 - Math.cos(a))]);
    }
    for (let i = 0; i <= 24; i++) {
      const a = i / 24 * Math.PI / 2;
      rings.push([1 - bevel + bevel * Math.cos(a),
        halfDepth - bevel + bevel * Math.sin(a)]);
    }
    const segments = 240;
    const point = ([r, z], angle) => rotate([r * Math.cos(angle), r * Math.sin(angle), z]);
    const faces = [];
    for (let band = 0; band < rings.length - 1; band++) {
      const a = rings[band], b = rings[band + 1];
      const dr = b[0] - a[0], dz = b[1] - a[1];
      for (let i = 0; i < segments; i++) {
        const t0 = i / segments * Math.PI * 2;
        const t1 = (i + 1) / segments * Math.PI * 2;
        const tm = (t0 + t1) / 2;
        const localNormal = normalize([dz * Math.cos(tm), dz * Math.sin(tm), -dr]);
        const normal = rotate(localNormal);
        if (normal[2] <= 0) continue;
        const vertices = [point(a, t0), point(a, t1), point(b, t1), point(b, t0)];
        const brightness = .48 + .56 * Math.max(0, dot(normal, light));
        const specular = 28 * Math.pow(Math.max(0, dot(normal, normalize([-.25, -.35, 1]))), 18);
        const center = vertices.reduce((sum, p) => sum.map((v, j) => v + p[j] / 4), [0, 0, 0]);
        const [px, py] = project(center).map(v => v / size);
        const t = Math.max(0, Math.min(1, ((px - .15) * .65 + (py - .12) * .73) / (.65 ** 2 + .73 ** 2)));
        const start = t < .45 ? palette.light : palette.mid;
        const end = t < .45 ? palette.mid : palette.shade;
        const blend = t < .45 ? t / .45 : (t - .45) / .55;
        const rimBlend = Math.max(0, localNormal[2]) ** 4;
        const color = palette.edge.map((c, j) => Math.round(Math.min(255,
          (c * brightness + specular) * (1 - rimBlend) + (start[j] + (end[j] - start[j]) * blend) * rimBlend)));
        faces.push({ vertices, depth: vertices.reduce((s, p) => s + p[2], 0) / 4,
          color: `rgb(${color.join(',')})` });
      }
    }
    // Painter's ordering is for the coin's physical surfaces. CSS z-index
    // only controls which complete coin sits in front of another.
    faces.sort((a, b) => a.depth - b.depth);
    for (const face of faces) {
      path(face.vertices);
      ctx.fillStyle = ctx.strokeStyle = face.color;
      ctx.lineWidth = .65;
      ctx.fill();
      ctx.stroke();
    }
    const front = Array.from({ length: segments }, (_, i) =>
      point(rings[rings.length - 1], i / segments * Math.PI * 2));
    path(front);
    const faceLight = ctx.createLinearGradient(size * .15, size * .12, size * .8, size * .85);
    faceLight.addColorStop(0, rgb(palette.light));
    faceLight.addColorStop(.45, rgb(palette.mid));
    faceLight.addColorStop(1, rgb(palette.shade));
    ctx.fillStyle = faceLight;
    ctx.fill();
  }
  const canvases = [...document.querySelectorAll('[data-coin]')];
  const resize = new ResizeObserver(entries => entries.forEach(entry => draw(entry.target)));
  canvases.forEach(canvas => { draw(canvas); resize.observe(canvas); });
})();
