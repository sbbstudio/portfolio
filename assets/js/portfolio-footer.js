/* Shared: Back to top for all portfolio footers, including nested page URLs. */
(() => {
  document.querySelectorAll('.portfolio-footer__top').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const top = document.getElementById('top');
      if (top) {
        if (!top.hasAttribute('tabindex')) top.setAttribute('tabindex', '-1');
        top.focus({ preventScroll: true });
      }
      window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  });
})();
