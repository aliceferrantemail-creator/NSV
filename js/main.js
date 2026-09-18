document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var slideshow = document.querySelector('.hero-slideshow');
  if (slideshow && !reduceMotion) {
    var slides = slideshow.querySelectorAll('.hero-slide');
    var interval = parseInt(slideshow.dataset.interval, 10) || 400;
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, interval);
  }

  // Overlay nav: picks up the glass once past the hero, and rides the scroll.
  //
  // The bar is dragged 1:1 by the scroll delta (clamped to its own height) so it
  // feels physically attached, then a spring chases that target so it lags and
  // overshoots slightly instead of snapping. Pulling past the top stretches it
  // downward on a second, looser spring. When scrolling stops it settles to
  // whichever end it is nearest, so it never rests half-open.
  var overlayNav = document.querySelector('.nav-overlay');
  if (overlayNav) {
    var setGlass = function () {
      overlayNav.classList.toggle('scrolled', window.scrollY > 80);
    };
    setGlass();

    if (reduceMotion) {
      window.addEventListener('scroll', setGlass, { passive: true });
    } else {
      var navInner = overlayNav.querySelector('.nav-inner');
      var basePad  = parseFloat(getComputedStyle(navInner).paddingBottom) || 20;

      var navH     = overlayNav.offsetHeight || 72;
      var lastY    = Math.max(0, window.scrollY);
      var target   = 0;   // where the bar wants to be
      var offset   = 0;   // where it actually is
      var vel      = 0;
      var pull     = 0;   // overscroll stretch
      var pullVel  = 0;
      var frame    = null;
      var idleTimer = null;

      var STIFFNESS = 0.16, DAMPING = 0.76;   // main spring: quick, slight overshoot
      var PULL_K    = 0.10, PULL_D  = 0.80;   // stretch spring: looser, slower return

      var run = function () { if (!frame) frame = requestAnimationFrame(tick); };

      function tick() {
        vel += (target - offset) * STIFFNESS;
        vel *= DAMPING;
        offset += vel;

        pullVel += (0 - pull) * PULL_K;
        pullVel *= PULL_D;
        pull += pullVel;

        // The bar is pinned to top:0, so translating it *down* would open a gap
        // above it. Spend that overshoot on stretching the glass taller instead —
        // it keeps the elastic feel and the top edge stays welded to the viewport.
        var over = 0;
        if (offset > 0) { over = offset; offset = 0; vel = 0; }
        var stretch = over + Math.max(0, pull);

        overlayNav.style.transform  = 'translate3d(0,' + offset.toFixed(2) + 'px,0)';
        navInner.style.paddingBottom = (basePad + stretch).toFixed(2) + 'px';

        var atRest = Math.abs(target - offset) < 0.08 && Math.abs(vel) < 0.08 &&
                     Math.abs(pull) < 0.08 && Math.abs(pullVel) < 0.08 && stretch < 0.08;

        if (atRest) {
          overlayNav.style.transform  = 'translate3d(0,' + target + 'px,0)';
          navInner.style.paddingBottom = '';
          frame = null;
        } else {
          frame = requestAnimationFrame(tick);
        }
      }

      // settle to the nearer end once the gesture stops
      function scheduleSettle() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(function () {
          if (window.scrollY <= 80) { target = 0; }
          else { target = (target > -navH / 2) ? 0 : -navH; }
          run();
        }, 160);
      }

      window.addEventListener('scroll', function () {
        var y  = Math.max(0, window.scrollY);
        var dy = y - lastY;
        lastY  = y;

        setGlass();

        if (y <= 80) {
          target = 0;                       // always open at the top
        } else {
          target -= dy;                     // drag with the scroll
          if (target < -navH) target = -navH;
          if (target > 0) target = 0;
        }

        scheduleSettle();
        run();
      }, { passive: true });

      // pulling past the top of the page stretches the bar down
      window.addEventListener('wheel', function (e) {
        if (window.scrollY <= 0 && e.deltaY < 0) {
          pull = Math.min(pull + (-e.deltaY) * 0.30, 32);
          run();
        }
      }, { passive: true });

      // same gesture on touch
      var touchY = null;
      window.addEventListener('touchstart', function (e) {
        touchY = e.touches[0].clientY;
      }, { passive: true });

      window.addEventListener('touchmove', function (e) {
        if (touchY === null) return;
        var dy = e.touches[0].clientY - touchY;
        touchY = e.touches[0].clientY;
        if (window.scrollY <= 0 && dy > 0) {
          pull = Math.min(pull + dy * 0.34, 32);
          run();
        }
      }, { passive: true });

      window.addEventListener('touchend', function () { touchY = null; }, { passive: true });

      // Breakpoints change the nav's resting padding and height, so re-read both
      // (with the inline override cleared) or the spring settles to a stale base.
      window.addEventListener('resize', function () {
        navInner.style.paddingBottom = '';
        basePad = parseFloat(getComputedStyle(navInner).paddingBottom) || basePad;
        navH = overlayNav.offsetHeight || navH;
      });
    }
  }

  // Fade sections in as they enter the viewport
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(function (el) { observer.observe(el); });
    }
  }

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var galleryImgs = document.querySelectorAll('.gallery-grid img, .grid-photos img');
  var lightbox = document.querySelector('.lightbox');
  if (galleryImgs.length && lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    galleryImgs.forEach(function (img) {
      img.addEventListener('click', function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('open');
      }
    });
  }

  var forms = document.querySelectorAll('form[data-fake-submit]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if (note) note.classList.add('show');
      form.reset();
    });
  });
});
