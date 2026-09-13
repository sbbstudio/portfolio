import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

// Original Kai GLB and lighting from kaizenstudio.no/assets/cyan/src/cyan-runtime.js.
// Capture keeps the approved portrait. The card uses its driving pose in side view.
export async function createKai(host, { capture = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: capture });
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1.6, 1.6, 1.6, -1.6, .1, 40);
  camera.position.set(2.3, 3.57, 8);
  camera.quaternion.set(-.135802, .1382, .019134, .980863).normalize();
  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  scene.environmentIntensity = .45;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xf1f6ff, 0xc5c0ac, .7));
  const key = new THREE.DirectionalLight(0xfff9ef, 2.8);
  key.position.set(-3, 6, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0xdcefff, .9);
  fill.position.set(4, 3, -3); scene.add(fill);
  let model;
  function dispose() {
    model?.traverse(o => {
      if (o.isMesh) { o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); }
    });
    environment.dispose(); renderer.dispose(); renderer.domElement.remove();
  }
  try {
    const response = await fetch('assets/kai/kai.glb', { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('Kai model unavailable');
    model = (await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(await response.arrayBuffer(), '')).scene;
    scene.add(model);
    const roles = new Map();
    model.traverse(o => { if (o.userData.cyanRole) roles.set(o.userData.cyanRole, o); });
    const head = roles.get('CyanHead');
    head.quaternion.set(.001063, .040577, .026155, .998833).normalize();
    roles.get('CyanWheelL').quaternion.set(-.846342, 0, 0, .532641).normalize();
    roles.get('CyanWheelR').quaternion.set(.591722, 0, 0, .806142).normalize();
    const restHead = head.quaternion.clone();
    const root = roles.get('CyanRoot');
    const wheels = ['L', 'R'].map(side => roles.get('CyanWheel' + side));
    if (!capture) {
      // Evaluated rotations at 1.4s in the approved Blender entrance.
      const driving = {
        CyanBalance: [.032211, 0, 0, .999481],
        CyanShoulderL: [-.10298, -.003596, .034715, .994071],
        CyanShoulderR: [-.106513, .00372, -.034702, .993699],
        CyanElbowL: [-.107202, 0, 0, .994237], CyanElbowR: [-.107202, 0, 0, .994237],
        CyanHandL: [.037584, 0, 0, .999293], CyanHandR: [.037584, 0, 0, .999294],
      };
      Object.entries(driving).forEach(([role, q]) => roles.get(role).quaternion.fromArray(q).normalize());
      root.rotation.y = Math.PI / 2;
      head.quaternion.identity();
      camera.position.set(0, 1.45, 8);
      camera.lookAt(0, 1.45, 0);
    }
    // Measure the tyre's Y extent in its unrotated axle space: no guessed spin rate.
    const wheelRest = wheels[0].quaternion.clone();
    wheels[0].quaternion.identity();
    const wheelBounds = new THREE.Box3().setFromObject(wheels[0], true);
    wheels[0].quaternion.copy(wheelRest);
    const wheelRadius = (wheelBounds.max.y - wheelBounds.min.y) / 2;
    let halfWidth = 1.6;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.append(renderer.domElement);
    function resize() {
      const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
      // Supersample even at DPR1 for clean moving silhouettes; honour mobile
      // retina density within a hard two-million-pixel drawing-buffer budget.
      const desiredRatio = Math.max(2, Math.min(3, devicePixelRatio));
      const ratio = capture ? 2 : Math.min(desiredRatio, Math.sqrt(2000000 / (width * height)));
      renderer.setPixelRatio(ratio);
      renderer.setSize(width, height, false);
      host.dataset.renderRatio = ratio.toFixed(3);
      if (!capture) {
        const halfHeight = 1.45;
        halfWidth = halfHeight * width / height;
        camera.left = -halfWidth; camera.right = halfWidth;
        camera.top = halfHeight; camera.bottom = -halfHeight;
        camera.updateProjectionMatrix();
      }
    }
    resize();
    return {
      resize, dispose,
      render(seconds = 0) {
        if (capture) head.quaternion.copy(restHead);
        else {
          const margin = 1.4, speed = .95;
          const route = 2 * (halfWidth + margin);
          const distance = (seconds * speed) % route;
          root.position.x = -halfWidth - margin + distance;
          // Local +X axle becomes world -Z with yaw +PI/2. Positive spin
          // gives the bottom contact point -X velocity, cancelling travel +X.
          const angle = distance / wheelRadius;
          wheels.forEach(wheel => wheel.rotation.x = angle);
          host.dataset.x = root.position.x.toFixed(4);
          host.dataset.wheelAngle = angle.toFixed(4);
          host.dataset.wheelRadius = wheelRadius.toFixed(4);
          host.dataset.seconds = seconds.toFixed(3);
        }
        renderer.render(scene, camera);
        host.dataset.frames = String(Number(host.dataset.frames || 0) + 1);
      },
      poster() { return renderer.domElement.toDataURL('image/webp', .93); },
    };
  } catch (error) { dispose(); throw error; }
}
