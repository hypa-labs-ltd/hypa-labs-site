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
