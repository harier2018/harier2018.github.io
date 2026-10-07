(() => {
  'use strict';

  const body = document.body;
  const loader = document.getElementById('loader');
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primary-nav');

  // ----- Loading screen -----
  let loaderClosed = false;

  function closeLoader() {
    if (loaderClosed) return;
    loaderClosed = true;

    body.classList.remove('is-loading');

    if (!loader) return;
    loader.classList.add('hide');
    loader.setAttribute('aria-hidden', 'true');

    window.setTimeout(() => loader.remove(), 700);
  }

  // DOMContentLoaded is intentionally used instead of waiting indefinitely for
  // third-party resources such as web fonts. A safety timeout prevents a stuck loader.
  const loaderStart = performance.now();
  const finishLoading = () => {
    const elapsed = performance.now() - loaderStart;
    window.setTimeout(closeLoader, Math.max(350, 650 - elapsed));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', finishLoading, { once: true });
  } else {
    finishLoading();
  }

  window.setTimeout(closeLoader, 3500);

  // ----- Mobile navigation -----
  if (navToggle && primaryNav) {
    const closeMenu = () => {
      primaryNav.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
      body.classList.remove('menu-open');
    };

    const openMenu = () => {
      primaryNav.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close navigation menu');
      body.classList.add('menu-open');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.contains('active');
      isOpen ? closeMenu() : openMenu();
    });

    primaryNav.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('click', event => {
      if (
        primaryNav.classList.contains('active') &&
        !primaryNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && primaryNav.classList.contains('active')) {
        closeMenu();
        navToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) closeMenu();
    });
  }

  // ----- Smooth in-page navigation with reliable offset -----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });

      history.replaceState(null, '', targetId);
    });
  });

  // ----- Scroll reveal -----
  const revealTargets = document.querySelectorAll('.section, .contact, .hero-card');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('show'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealTargets.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }
})();
