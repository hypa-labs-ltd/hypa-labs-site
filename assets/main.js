(function () {
  // Mobile menu (always on, independent of motion settings)
  var doc = document.documentElement;
  doc.classList.add('js');
  var btn = document.querySelector('.menu-btn');
  var panel = document.getElementById('mobile-menu');
  if (btn && panel) {
    function setOpen(open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open) { panel.hidden = false; requestAnimationFrame(function () { doc.classList.add('menu-open'); }); }
      else { doc.classList.remove('menu-open'); setTimeout(function () { if (!doc.classList.contains('menu-open')) panel.hidden = true; }, 250); }
    }
    btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 760) setOpen(false); });
  }
  // Header shadow once scrolled
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
})();

(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  doc.classList.add('anim');

  // Reveal on scroll
  var targets = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(function (t) { io.observe(t); });

  // Count-up stats
  var stats = document.querySelectorAll('.stat-num[data-count]');
  var so = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, end = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '';
      var start = performance.now(), dur = 1400;
      function tick(now) {
        var p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      so.unobserve(el);
    });
  }, { threshold: 0.6 });
  stats.forEach(function (s) { so.observe(s); });

  // Hero H parallax
  var h = document.querySelector('.hero-h');
  if (h) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 800);
        h.style.setProperty('--py', (y * 0.18) + 'px');
        ticking = false;
      });
    }, { passive: true });
  }
})();
