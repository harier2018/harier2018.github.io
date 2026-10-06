// ===== Mobile Navigation =====
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primary-nav');
const body = document.body;

function openMenu() {
  primaryNav.classList.add('active');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Close navigation menu');
  body.style.overflow = 'hidden';
}

function closeMenu() {
  primaryNav.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation menu');
  body.style.overflow = '';
}

function toggleMenu() {
  if (primaryNav.classList.contains('active')) {
    closeMenu();
  } else {
    openMenu();
  }
}

navToggle.addEventListener('click', toggleMenu);

// Close on link click
primaryNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (
    primaryNav.classList.contains('active') &&
    !primaryNav.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    closeMenu();
  }
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && primaryNav.classList.contains('active')) {
    closeMenu();
    navToggle.focus();
  }
});


// ===== Loading Screen =====
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");

  // Let the first paint settle, then fade the loader away.
  requestAnimationFrame(() => {
    setTimeout(() => {
      loader.classList.add("hide");
      document.body.classList.remove("is-loading");

      // Remove loader from the accessibility tree after transition.
      setTimeout(() => {
        loader.setAttribute("aria-hidden", "true");
      }, 700);

    }, 300);
  });
});


// ===== Close menu when resizing to desktop =====
let resizeTimer;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    if (
      window.innerWidth > 768 &&
      primaryNav.classList.contains('active')
    ) {
      closeMenu();
    }
  }, 150);
});


// ===== Reveal Animation =====
const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {

  // Just show everything
  document
    .querySelectorAll('.section, .contact, .hero-card')
    .forEach(el => {
      el.classList.add('reveal', 'show');
    });

} else {

  const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }

    });

  }, { threshold: 0.08 });


  document
    .querySelectorAll('.section, .contact, .hero-card')
    .forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
}
