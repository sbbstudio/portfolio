const host = document.querySelector('[data-kai-scene]');
if (host) {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const button = document.querySelector('[data-kai-toggle]');
  let scene, loading = false, failed = false, visible = false, paused = false, frame = 0, previous = 0, elapsed = 0;
  function stop() { cancelAnimationFrame(frame); frame = 0; previous = 0; }
  function draw(now) {
    frame = 0;
    if (!scene || !visible || paused || media.matches || document.hidden) return;
    // Follow display cadence: a 24fps threshold on a 60Hz display drops to
    // 20fps (three refreshes). Integrate time on every visible animation frame.
    elapsed += previous ? Math.min(.1, (now - previous) / 1000) : 0;
    previous = now;
    scene.render(elapsed);
    frame = requestAnimationFrame(draw);
  }
  async function sync() {
    stop();
    host.classList.toggle('is-ready', Boolean(scene) && !media.matches && !failed);
    button.hidden = !scene || media.matches || failed;
    if (!visible || document.hidden || media.matches || failed) return;
    if (!scene && !loading) {
      loading = true;
      try {
        const { createKai } = await import('./scene.js');
        scene = await createKai(host);
        scene.render();
        host.querySelector('canvas').addEventListener('webglcontextlost', event => {
          event.preventDefault(); failed = true; stop(); scene.dispose(); scene = null; sync();
        }, { once: true });
      } catch { failed = true; }
      loading = false;
      sync(); return;
    }
    if (scene && !paused) frame = requestAnimationFrame(draw);
  }
  button.addEventListener('click', () => {
    paused = !paused;
    button.textContent = paused ? 'Play Kai' : 'Pause Kai';
    button.setAttribute('aria-pressed', String(paused));
    sync();
  });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .01 }).observe(host);
  new ResizeObserver(() => { if (scene) { scene.resize(); if (visible && !document.hidden) scene.render(elapsed); } }).observe(host);
  media.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', sync);
}
