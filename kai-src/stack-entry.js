const section = document.querySelector('[data-kai-method]');
if (section) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 1023px)');
  let visible = false, loading = false, instance;
  async function load() {
    if (!visible || loading || instance || reduced.matches || narrow.matches) return;
    loading = true;
    try {
      const { mountMethod } = await import('./stack.js');
      instance = await mountMethod(section);
    } catch { section.dataset.methodState = 'fallback'; }
  }
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; load(); }, { rootMargin: '300px' }).observe(section);
  reduced.addEventListener('change', load);
  narrow.addEventListener('change', load);
}
