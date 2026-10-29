/* Shared: portfolio navigation destinations, visual scroll state and compact menu.
   Page-specific section jumps remain local; data attributes own the rendered nav state. */
(() => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const destinations = [
    ['Nyme', '/work/nyme/'], ['Kaizen', '/work/kaizen/'],
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
  // Keyboard focus pins the header; touch/click focus must not disable scroll hiding.
  let keyboardNavigation = false;
  document.addEventListener('keydown', event => { if (event.key === 'Tab') keyboardNavigation = true; });
  document.addEventListener('pointerdown', () => { keyboardNavigation = false; });
  let lastY = scrollY, upward = 0, navFrame = 0;
  const updateNav = () => {
    navFrame = 0;
    const y = Math.max(0, scrollY), delta = y - lastY;
    if (delta !== 0) upward = delta < 0 ? upward - delta : 0;
    const homeHero = document.body.classList.contains('home-photo') && document.querySelector('#hero');
    const heroVisible = homeHero && homeHero.getBoundingClientRect().bottom > 12;
    nav.dataset.glass = String(homeHero ? !heroVisible : y > 40);
    if (y <= 40 || upward >= 120 || (keyboardNavigation && nav.contains(document.activeElement)) || nav.classList.contains('is-menu-open')) nav.dataset.hidden = 'false';
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
  const mobileMenu = matchMedia('(max-width: 1023px)');
  const sceneMenu = nav.dataset.variant === 'compact';


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
  // Capture intent before pointer focus can close the menu via focusout.
  // Otherwise the following click can reopen the menu instead of closing it.
  let pointerOpen = null;
  toggle.addEventListener('pointerdown', event => {
    if (event.button === 0) pointerOpen = toggle.getAttribute('aria-expanded') !== 'true';
  });
  toggle.addEventListener('pointercancel', () => { pointerOpen = null; });
  toggle.addEventListener('click', event => {
    const open = event.detail > 0 && pointerOpen !== null
      ? pointerOpen : toggle.getAttribute('aria-expanded') !== 'true';
    pointerOpen = null;
    setOpen(open, !open);
    if (open && primary) primary.querySelector('a')?.focus({ preventScroll: true });
  });
  nav.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-menu-open')) {
      event.preventDefault();
      keyboardNavigation = true;
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
  // Every mobile page uses the menu; desktop retains the scene-specific compact variant.
  const scene = document.querySelector('#hero');
  const studio = document.querySelector('#studio-root');
  let frame = 0;
  const updateVariant = () => {
    frame = 0;
    const bounds = scene?.getBoundingClientRect();
    const compact = mobileMenu.matches || Boolean(sceneMenu && bounds && bounds.bottom > 80 && bounds.top < innerHeight && studio?.dataset.mode !== 'static');
    if (!compact) setOpen(false);
    nav.classList.toggle('has-compact-menu', compact);
    toggle.hidden = !compact;
  };
  const scheduleVariant = () => { if (!frame) frame = requestAnimationFrame(updateVariant); };
  addEventListener('scroll', scheduleVariant, { passive: true });
  addEventListener('resize', scheduleVariant);
  if (studio) new MutationObserver(scheduleVariant).observe(studio, { attributes: true, attributeFilter: ['data-mode'] });
  mobileMenu.addEventListener('change', () => {
    setOpen(false);
    updateVariant();
    if (toggle.hidden && document.activeElement === toggle) nav.querySelector('.nav__name a')?.focus({ preventScroll: true });
  });
  updateVariant();
})();
