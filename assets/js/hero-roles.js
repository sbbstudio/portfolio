/* Rotate the Hero roles with typing; preserve a static heading for reduced motion. */
(() => {
  const heading = document.querySelector('.hero-roles');
  if (!heading) return;
  const roles = Array.from(heading.children, el => el.textContent);
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  const current = document.createElement('span');
  current.className = 'hero-role-current';
  current.setAttribute('aria-hidden', 'true');
  let timer, role = 0, count = 0, deleting = false;
  const tick = () => {
    const title = roles[role];
    count += deleting ? -1 : 1;
    current.textContent = title.slice(0, count);
    let delay = deleting ? 35 : 65;
    if (!deleting && count === title.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && count === 0) {
      deleting = false;
      role = (role + 1) % roles.length;
      delay = 350;
    }
    timer = setTimeout(tick, delay);
  };
  const sync = () => {
    clearTimeout(timer);
    const enabled = motion.matches;
    heading.classList.toggle('is-typing', enabled);
    if (!enabled) {
      current.remove();
      role = 0; count = 0; deleting = false;
      current.textContent = '';
      return;
    }
    if (!current.isConnected) heading.append(current);
    // Pause in background tabs; the next visible frame continues from the same letter.
    if (!document.hidden) timer = setTimeout(tick, 350);
  };
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
