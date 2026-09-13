// Original KAIZEN stack-projection.mjs: affine HTML handoff, unchanged geometry.
import { Vector3 } from 'three';
export const LANDING_START = 9.1, LANDING_END = 10.25, PREVIEW_DURATION = 10.4;
export function landingProgress(seconds) {
  const t = Math.max(0, Math.min(1, (seconds - LANDING_START) / (LANDING_END - LANDING_START)));
  return Math.max(0, Math.min(1, t * t * t * (10 + t * (-15 + 6 * t))));
}
export function blendToLanding(matrix, target, progress) {
  const end = [1, 0, 0, 1, target.left, target.top];
  return matrix.map((n, i) => n + (end[i] - n) * progress);
}
export function screenPoint(point, camera, width, height) {
  const p = point.clone().project(camera);
  return { x: (p.x + 1) * width / 2, y: (1 - p.y) * height / 2 };
}
export function panelMatrix(origin, right, down, camera, viewport, element) {
  const a = screenPoint(origin, camera, viewport.width, viewport.height);
  const b = screenPoint(origin.clone().add(right), camera, viewport.width, viewport.height);
  const c = screenPoint(origin.clone().add(down), camera, viewport.width, viewport.height);
  return [(b.x - a.x) / element.width, (b.y - a.y) / element.width,
    (c.x - a.x) / element.height, (c.y - a.y) / element.height, a.x, a.y];
}
export function panelOrigin(position, layer = 0) { return position.clone().add(new Vector3(-1.5 - layer * .09, 2.375 + layer * .07, .066 - layer * .15)); }
export function gripPoint(position, side) { return position.clone().add(new Vector3(1.54, 1.22, side === 'L' ? -.36 : .36)); }
