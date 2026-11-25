(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('nav-links');

  function setNav(open) {
    if (!navToggle || !navLinks) return;
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    navLinks.addEventListener('click', function (event) {
      if (event.target.closest('a')) setNav(false);
    });

    document.addEventListener('click', function (event) {
      if (!navToggle.contains(event.target) && !navLinks.contains(event.target)) setNav(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setNav(false);
    });
  }

  const filters = document.getElementById('filters');
  const filterButtons = filters ? Array.from(filters.querySelectorAll('.filter-button')) : [];
  const cards = Array.from(document.querySelectorAll('.archive-card[data-category]'));
  const filterStatus = document.getElementById('filter-status');

  function applyFilter(button) {
    if (!button || !filterStatus) return;
    const filter = button.getAttribute('data-filter');

    filterButtons.forEach(function (item) {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    let visible = 0;
    cards.forEach(function (card) {
      const show = filter === 'all' || card.getAttribute('data-category') === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });

    filterStatus.textContent = button.textContent.trim() + ': ' + visible + ' projects';
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyFilter(button);
    });
  });

  function initCursorEffects() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const canvas = document.getElementById('cursor-canvas');
    if (reducedMotion || !finePointer || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let points = [];
    let activeSurface = null;
    let width = 0;
    let height = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function clear() {
      points = [];
      if (activeSurface) activeSurface.classList.remove('is-cursor-active');
      activeSurface = null;
      context.clearRect(0, 0, width, height);
    }

    function moveLens(surface, event) {
      if (!surface) return;
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty('--lens-x', (event.clientX - rect.left) + 'px');
      surface.style.setProperty('--lens-y', (event.clientY - rect.top) + 'px');
    }

    function onPointerMove(event) {
      const now = performance.now();
      points.push({ x: event.clientX, y: event.clientY, time: now });
      if (points.length > 14) points.shift();

      const surface = event.target.closest('[data-cursor-surface]');
      if (surface !== activeSurface) {
        if (activeSurface) activeSurface.classList.remove('is-cursor-active');
        activeSurface = surface;
        if (activeSurface) activeSurface.classList.add('is-cursor-active');
      }
      moveLens(activeSurface, event);
    }

    function draw(now) {
      context.clearRect(0, 0, width, height);
      points = points.filter(function (point) {
        return now - point.time < 520;
      });

      for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1];
        const current = points[index];
        const age = (now - current.time) / 520;
        const strength = Math.max(0, 1 - age) * (index / points.length);
        const alpha = strength * 0.38;
        const lineWidth = 1 + strength * 3.6;

        context.beginPath();
        context.moveTo(previous.x, previous.y);
        context.lineTo(current.x, current.y);
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.strokeStyle = 'rgba(201, 255, 61, ' + alpha + ')';
        context.stroke();
      }

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clear();
    });
    document.addEventListener('mouseout', function (event) {
      if (!event.relatedTarget) clear();
    });
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    requestAnimationFrame(draw);
  }

  initCursorEffects();
})();
