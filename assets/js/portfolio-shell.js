/* Navigation, Hero parallax and contact remain independent of the optional 3D experience. */
(() => {
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('#hero');
  const sharedIntro = document.querySelector('.home-intro');
  let lastScroll = scrollY, upwardScroll = 0, frame = 0, initialized = false;
  const updateNav = () => {
    frame = 0;
    if (!nav || !hero) return;
    // Keep the shared photograph clear; direction-based return starts below it.
    const released = (sharedIntro || hero).getBoundingClientRect().bottom <= 12;
    const position = Math.max(0, scrollY);
    const delta = position - lastScroll;
    if (delta !== 0) upwardScroll = delta < 0 ? upwardScroll - delta : 0;
    if (sharedIntro && !released) nav.classList.toggle('is-hidden', position > 120);
    else if (!released || upwardScroll >= 120) nav.classList.remove('is-hidden');
    else if (delta > 0 || !initialized) nav.classList.add('is-hidden');
    const keyboardFocus = nav.querySelector(':focus-visible');
    nav.classList.toggle('is-paper', released || (position > 120 && Boolean(keyboardFocus)));
    document.documentElement.dataset.navTheme = 'light';
    lastScroll = position;
    initialized = true;
  };
  const scheduleNav = () => { if (!frame) frame = requestAnimationFrame(updateNav); };
  addEventListener('scroll', scheduleNav, { passive: true });
  addEventListener('resize', scheduleNav);
  nav?.addEventListener('focusin', scheduleNav);
  nav?.addEventListener('focusout', scheduleNav);
  updateNav();

  const heroPhoto = sharedIntro?.querySelector('.home-intro-photo');
  if (heroPhoto) {
    const parallaxEnabled = matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    let photoFrame = 0;
    let lastPhotoOffset = -1;
    const updateHeroPhoto = () => {
      photoFrame = 0;
      const bounds = sharedIntro.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height)));
      // Downward travel stays slower than scrolling, keeping the exposed top above the viewport.
      const offset = parallaxEnabled.matches ? progress * 40 : 0;
      if (offset === lastPhotoOffset) return;
      heroPhoto.style.setProperty('--hero-photo-offset', `${offset}px`);
      lastPhotoOffset = offset;
    };
    const scheduleHeroPhoto = () => {
      if (!photoFrame) photoFrame = requestAnimationFrame(updateHeroPhoto);
    };
    addEventListener('scroll', scheduleHeroPhoto, { passive: true });
    addEventListener('resize', scheduleHeroPhoto);
    parallaxEnabled.addEventListener('change', scheduleHeroPhoto);
    updateHeroPhoto();
  }

  const wrap = document.querySelector('.contact-reveal');
  if (!wrap) return;
  const contact = wrap.querySelector('.contact');
  const fog = contact.querySelector('.contact-bg');
  const lede = contact.querySelector('.contact__lede');
  const cta = contact.querySelector('.contact__cta');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let contactFrame = 0;
  const updateContact = () => {
    contactFrame = 0;
    const staticLayout = getComputedStyle(contact).position !== 'sticky' || reduced.matches;
    const p = staticLayout ? 1 : Math.max(0, Math.min(1, -wrap.getBoundingClientRect().top / (wrap.offsetHeight / 3)));
    fog.style.transform = `translate3d(0,${p * 100}%,0) scale(${1 - p * .5})`;
    const q = staticLayout ? 1 : Math.max(0, Math.min(1, (p - .86) / .14));
    for (const el of [lede, cta]) {
      el.style.opacity = String(q);
      el.style.transform = `translateY(${(1 - q) * 8}px)`;
    }
  };
  const scheduleContact = () => { if (!contactFrame) contactFrame = requestAnimationFrame(updateContact); };
  addEventListener('scroll', scheduleContact, { passive: true });
  addEventListener('resize', scheduleContact);
  reduced.addEventListener('change', scheduleContact);
  updateContact();
})();
