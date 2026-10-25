/* Shared: portfolio navigation destinations, visual scroll state and compact menu.
   Page-specific section jumps remain local; data attributes own the rendered nav state. */
(() => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const destinations = [
    ['Nyme', '/nyme.html'], ['Kaizen', '/kaizen.html'],
    ['How I work', '/how-i-work.html'], ['Technical', '/build/']
  ];
  const links = (items) => items.map(([label, href]) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    if (location.pathname === href) a.setAttribute('aria-current', 'page');
    return a;
  });
  const primary = nav.querySelector('.nav__links');
  if (primary) primary.replaceChildren(...links(destinations));
  const contact = nav.querySelector('.nav__cta');
  if (contact) contact.replaceChildren(...links([['Contact', '/contact.html']]));
  nav.dataset.portfolioNav = '';
  const inkAtTop = document.body.classList.contains('home-photo') || document.documentElement.dataset.navTheme === 'ink';
  nav.dataset.ink = String(inkAtTop);
  let lastY = scrollY, upward = 0, navFrame = 0;
  const updateNav = () => {
    navFrame = 0;
    const y = Math.max(0, scrollY), delta = y - lastY;
    if (delta !== 0) upward = delta < 0 ? upward - delta : 0;
    const homeHero = document.body.classList.contains('home-photo') && document.querySelector('#hero');
    const heroVisible = homeHero && homeHero.getBoundingClientRect().bottom > 12;
    nav.dataset.glass = String(homeHero ? !heroVisible : y > 40);
    if (y <= 40 || upward >= 120 || nav.contains(document.activeElement) || nav.classList.contains('is-menu-open')) nav.dataset.hidden = 'false';
    else if (delta > 0) nav.dataset.hidden = 'true';
    lastY = y;
    document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight}px`);
  };
  const scheduleNav = () => { if (!navFrame) navFrame = requestAnimationFrame(updateNav); };
  addEventListener('scroll', scheduleNav, { passive: true });
  addEventListener('resize', scheduleNav);
  nav.addEventListener('focusin', scheduleNav);
  nav.addEventListener('focusout', scheduleNav);
  new ResizeObserver(scheduleNav).observe(nav);
  updateNav();
  if (nav.dataset.variant !== 'compact') return;


  const toggle = document.createElement('button');
  toggle.className = 'portfolio-menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.setAttribute('aria-expanded', 'false');
  const menuCells = [...nav.querySelectorAll('.nav__links, .nav__jumps, .nav__cta')];
  menuCells.forEach((cell, i) => { cell.id = `portfolio-menu-cell-${i}`; });
  toggle.setAttribute('aria-controls', menuCells.map(cell => cell.id).join(' '));
  toggle.innerHTML = '<span></span><span></span>';
  nav.append(toggle);

  // Expand the existing four-column navigation in place; no separate modal/menu tree.
  const setOpen = (open, restoreFocus = false) => {
    nav.classList.toggle('is-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) nav.dataset.hidden = 'false';
    if (restoreFocus) toggle.focus({ preventScroll: true });
    scheduleNav();
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
    if (open && primary) primary.querySelector('a')?.focus({ preventScroll: true });
  });
  nav.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-menu-open')) {
      event.preventDefault();
      setOpen(false, true);
    }
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  nav.addEventListener('focusout', event => {
    if (event.relatedTarget && !nav.contains(event.relatedTarget)) setOpen(false);
  });
  document.addEventListener('pointerdown', event => {
    if (!nav.contains(event.target)) setOpen(false);
  });
  // Compact navigation belongs to the 3D journey, not the rest of the page.
  const scene = document.querySelector('#hero');
  const studio = document.querySelector('#studio-root');
  let frame = 0;
  const updateVariant = () => {
    frame = 0;
    const bounds = scene?.getBoundingClientRect();
    const compact = Boolean(bounds && bounds.bottom > 80 && bounds.top < innerHeight && studio?.dataset.mode !== 'static');
    if (!compact) setOpen(false);
    nav.classList.toggle('has-compact-menu', compact);
    toggle.hidden = !compact;
  };
  const scheduleVariant = () => { if (!frame) frame = requestAnimationFrame(updateVariant); };
  addEventListener('scroll', scheduleVariant, { passive: true });
  addEventListener('resize', scheduleVariant);
  if (studio) new MutationObserver(scheduleVariant).observe(studio, { attributes: true, attributeFilter: ['data-mode'] });
  updateVariant();
})();
