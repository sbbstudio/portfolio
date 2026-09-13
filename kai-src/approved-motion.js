// Adapted verbatim in behaviour from KAIZEN's approved-motion.mjs.
import { Vector3, Quaternion } from 'three';
export function createApprovedMotion(data) {
  const p = new Vector3(), q = new Quaternion(), s = new Vector3();
  const p2 = new Vector3(), q2 = new Quaternion(), s2 = new Vector3();
  let a, b, blend;
  function transform(object, first, second) {
    p.fromArray(first).lerp(p2.fromArray(second), blend);
    q.fromArray(first, 3).slerp(q2.fromArray(second, 3), blend);
    s.fromArray(first, 7).lerp(s2.fromArray(second, 7), blend);
    object.position.copy(p); object.quaternion.copy(q); object.scale.copy(s);
  }
  return {
    seek(seconds) {
      const sample = Math.max(0, Math.min(data.frames.length - 1, seconds * data.fps));
      const index = Math.floor(sample);
      a = data.frames[index]; b = data.frames[Math.min(index + 1, data.frames.length - 1)]; blend = sample - index;
    },
    apply(roles) { data.roles.forEach((role, i) => transform(roles.get(role), a.rig[i], b.rig[i])); },
    camera(camera) { transform(camera, a.camera, b.camera); },
  };
}
