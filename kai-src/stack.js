import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createApprovedMotion } from './approved-motion.js';
import { sampleMethodScroll } from './method-deck.js';
import { panelMatrix, panelOrigin, gripPoint, screenPoint, landingProgress, blendToLanding, PREVIEW_DURATION, LANDING_START } from './stack-projection.js';

export async function mountMethod(section) {
  const stage = section.querySelector('.method-stage');
  const host = section.querySelector('.method-canvas');
  const cards = [...section.querySelectorAll('.method-card')];
  const rail = section.querySelector('.method-rail');
  const deck = section.querySelector('.method-deck');
  const panels = [deck, ...['.back-one', '.back-two', '.back-three'].map(s => section.querySelector(s))];
  const pin = section.querySelector('.method-pin');
  const intro = section.querySelector('.method-intro');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 1023px)');
  let renderer, model, environment, shadowTexture, frame = 0, visible = false, failed = false;
  let seconds = 0, active = 0, width = 0, height = 0, cardWidth = 600, cardHeight = 454, cellWidth = 0, cellHeight = 0;
  let landingRect = { left: 0, top: 0 };
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3.9, 3.9, 2.3, -2.3, .1, 50);
  const stack = new THREE.Object3D();
  const roles = new Map([['Stack', stack]]);
  const occluders = [];
  const staticMode = () => failed || reduced.matches || narrow.matches;
  const stop = () => { cancelAnimationFrame(frame); frame = 0; };
  function disposeGPU() {
    scene.traverse(o => {
      o.geometry?.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
    });
    shadowTexture?.dispose(); environment?.dispose(); renderer?.dispose(); renderer?.domElement.remove();
  }
  function restoreCards() {
    cards.forEach(card => {
      card.removeAttribute('style'); card.removeAttribute('aria-hidden'); card.inert = false;
    });
    rail.style.removeProperty('transform');
    panels.forEach(panel => panel.removeAttribute('style'));
    delete stage.dataset.landed;
    intro.style.removeProperty('opacity');
  }
  function fail() {
    failed = true; stop(); section.classList.remove('is-animated');
    section.dataset.methodState = 'fallback';
    restoreCards(); disposeGPU();
  }
  try {
    const [modelResponse, motionResponse] = await Promise.all([
      fetch('assets/kai/kai.glb', { signal: AbortSignal.timeout(15000) }),
      fetch('assets/kai/stack-motion.json', { signal: AbortSignal.timeout(15000) }),
    ]);
    if (!modelResponse.ok || !motionResponse.ok) throw new Error('Kai method asset unavailable');
    const data = await motionResponse.json();
    model = (await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(await modelResponse.arrayBuffer(), '')).scene;
    model.traverse(o => { if (o.userData.cyanRole) roles.set(o.userData.cyanRole, o); });
    for (const role of data.roles) if (!roles.has(role)) throw new Error('Missing Kai pivot');
    scene.add(model);
    const motion = createApprovedMotion(data);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'default' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.setClearColor(0, 0);
    host.append(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); fail(); }, { once: true });
    const room = new RoomEnvironment(), pmrem = new THREE.PMREMGenerator(renderer);
    environment = pmrem.fromScene(room, .04); scene.environment = environment.texture; scene.environmentIntensity = .45;
    room.dispose(); pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xf1f6ff, 0xc5c0ac, .7));
    const key = new THREE.DirectionalLight(0xfff9ef, 2.8); key.position.set(-3, 6, 5); scene.add(key);
    const fill = new THREE.DirectionalLight(0xdcefff, .9); fill.position.set(4, 3, -3); scene.add(fill);
    // Original stack-runtime ground contact shadow, unchanged in geometry/alpha.
    const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64,64,4,64,64,63);
    gradient.addColorStop(0,'rgba(35,40,40,.23)'); gradient.addColorStop(.45,'rgba(35,40,40,.09)'); gradient.addColorStop(1,'rgba(35,40,40,0)');
    ctx.fillStyle = gradient; ctx.fillRect(0,0,128,128);
    shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.3,1.3),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,toneMapped:false}));
    shadow.rotation.x = -Math.PI / 2; scene.add(shadow);
    // Matching depth planes hide the model behind the real DOM card surfaces.
    for (let i = 0; i < 4; i++) {
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(3, 2.27), new THREE.MeshBasicMaterial({ colorWrite: false, side: THREE.DoubleSide }));
      plane.renderOrder = -1; scene.add(plane); occluders.push(plane);
    }
    function showCard(unfold) {
      cards.forEach((card, i) => {
        const hidden = !staticMode() && unfold === 0 && i !== 0;
        card.setAttribute('aria-hidden', String(hidden)); card.inert = hidden;
        card.style.zIndex = String(4 - i);
        card.style.transform = `translate(${i % 2 * cellWidth * unfold}px,${Math.floor(i / 2) * cellHeight * unfold}px)`;
      });
    }
    function draw() {
      frame = 0;
      if (failed || staticMode() || !visible || document.hidden) return;
      const scrollProgress = THREE.MathUtils.clamp(-section.getBoundingClientRect().top / (innerHeight * 3.6), 0, 1);
      const sampled = sampleMethodScroll(scrollProgress);
      seconds = sampled.time; active = 0;
      stage.dataset.scrollProgress = scrollProgress.toFixed(5);
      intro.style.opacity = String(1 - THREE.MathUtils.smoothstep(seconds, 0, .8));
      motion.seek(seconds); motion.apply(roles); motion.camera(camera);
      for (const side of ['L', 'R']) roles.get('CyanEye' + side).scale.y = 1;
      camera.position.x += .55;
      // Preserve the source view with enough vertical room on short laptops;
      // the original grip and DOM plane use this same camera, so they stay exact.
      const halfWidth = Math.max(3.9, 1.55 * width / height);
      camera.left = -halfWidth; camera.right = halfWidth; camera.top = halfWidth * height / width; camera.bottom = -camera.top;
      camera.updateProjectionMatrix(); camera.updateMatrixWorld(); model.updateMatrixWorld(true);
      const root = roles.get('CyanRoot');
      shadow.position.set(root.position.x,.005,root.position.z); shadow.rotation.y = root.rotation.y;
      // CEO grid landing: only the post-release HTML phase changes. The baked
      // pull remains untouched; unfold smoothly into cells 1,2,5,6 by 70%.
      const t = THREE.MathUtils.clamp((scrollProgress - LANDING_START / (2 * PREVIEW_DURATION)) / (.70 - LANDING_START / (2 * PREVIEW_DURATION)), 0, 1);
      const landing = t * t * t * (10 + t * (-15 + 6 * t));
      // Keep the approved 600:454 DOM/world-plane aspect during the pull.
      // Reflow the actual DOM dimensions during unfolding instead of stretching
      // cell-shaped text anisotropically onto the wide carried plane.
      cardWidth = 600 + (cellWidth - 600) * landing;
      cardHeight = 454 + (cellHeight - 454) * landing;
      panels.forEach(panel => { panel.style.width = `${cardWidth}px`; panel.style.height = `${cardHeight}px`; });
      stage.toggleAttribute('data-landed', landing === 1);
      showCard(landing);
      panels.forEach((panel, i) => {
        const projected = panelMatrix(panelOrigin(stack.position, i), new THREE.Vector3(3, 0, 0), new THREE.Vector3(0, -2.27, 0), camera, { width, height }, { width: cardWidth, height: cardHeight });
        const matrix = blendToLanding(projected, landingRect, landing);
        if (i === 0 && landing === 1) panel.style.removeProperty('transform');
        else panel.style.transform = `matrix(${matrix.join(',')})`;
        if (i > 0) panel.style.opacity = String(1 - landing);
      });
      occluders.forEach((plane, i) => {
        plane.visible = seconds <= LANDING_START;
        plane.position.copy(stack.position).add(new THREE.Vector3(-i * .09, 1.24 + i * .07, .066 - i * .15));
      });
      const a = screenPoint(gripPoint(stack.position, 'L'), camera, width, height);
      const b = screenPoint(gripPoint(stack.position, 'R'), camera, width, height);
      const bakedFrame = data.frames[Math.min(data.frames.length - 1, Math.round(seconds * data.fps))];
      rail.style.width = `${Math.hypot(b.x - a.x, b.y - a.y)}px`;
      rail.style.opacity = String(bakedFrame.rail);
      rail.style.transform = `translate(${a.x}px,${a.y - 3.5}px) rotate(${Math.atan2(b.y - a.y, b.x - a.x)}rad) scaleX(${bakedFrame.rail})`;
      if (seconds >= 2.95 && seconds <= 6.45) {
        let error = 0;
        for (const [side, sign] of [['L', -1], ['R', 1]]) {
          const palm = new THREE.Vector3(sign * .007, -.103, .061).applyMatrix4(roles.get('CyanHand' + side).matrixWorld);
          const actual = screenPoint(palm, camera, width, height), target = screenPoint(gripPoint(stack.position, side), camera, width, height);
          error = Math.max(error, Math.hypot(actual.x - target.x, actual.y - target.y));
        }
        stage.dataset.gripError = error.toFixed(3);
      } else delete stage.dataset.gripError;
      renderer.render(scene, camera);
      stage.dataset.time = seconds.toFixed(3); stage.dataset.active = landing === 1 ? 'all' : '1';
      stage.dataset.landing = landing.toFixed(4); stage.dataset.frames = String(Number(stage.dataset.frames || 0) + 1);
    }
    function request() {
      // Re-evaluate after a hash/viewport jump as sticky layout can change in
      // the same frame as the observer's initial pre-enhancement rectangle.
      const bounds = stage.getBoundingClientRect();
      visible = bounds.bottom > 0 && bounds.top < innerHeight;
      stage.dataset.visible = String(visible);
      if (!frame && !failed && !staticMode() && visible && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function measure() {
      if (failed) return;
      section.classList.toggle('is-animated', !staticMode());
      if (staticMode()) { stop(); restoreCards(); return; }
      // Preserve the source's 360svh scrub distance; only the final held pose
      // absorbs rounding to a whole portfolio module for following grid rows.
      const box = pin.offsetHeight;
      section.style.setProperty('--method-track-height', `${Math.ceil((box + innerHeight * 3.6) / box) * box}px`);
      width = host.clientWidth; height = host.clientHeight;
      cellWidth = width / 4; cellHeight = height / 2;
      landingRect = { left: 0, top: 0 };
      renderer.setPixelRatio(Math.min(Math.max(2, Math.min(3, devicePixelRatio)), Math.sqrt(2000000 / Math.max(1, width * height))));
      renderer.setSize(width, height, false); request();
    }
    window.addEventListener('scroll', request, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else request(); });
    window.addEventListener('pagehide', stop); window.addEventListener('pageshow', request);
    reduced.addEventListener('change', measure); narrow.addEventListener('change', measure);
    new ResizeObserver(measure).observe(stage);
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; stage.dataset.visible = String(visible); if (visible) request(); else stop(); }, { threshold: 0 }).observe(stage);
    section.dataset.methodState = 'ready'; stage.dataset.motionSource = data.sourceSha256;
    showCard(0);
    measure();
    return { fail };
  } catch (error) { fail(); throw error; }
}
