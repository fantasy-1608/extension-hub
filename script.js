/* Lucian UX/UI Prompt (#002, #008, #039, #044, #046, #050, #070, #076, #212, #213, #216, #219, #226, #243)
 * MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/
 * Interactive controller for Trung Anh - Extension Hub
 */

(function () {
  'use strict';

  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');

  var EXTENSIONS = [
    {
      id: 'card-nurse',
      name: 'Điều dưỡng VNPT HIS',
      category: 'Hỗ trợ Lâm sàng',
      url: 'https://chromewebstore.google.com/detail/điều-dưỡng-vnpt-his/akcmgmclnmojmbpegjiifpoaiamdjilp?authuser=0&hl=vi&pli=1',
      color: 'linear-gradient(135deg,#0369A1,#075985)'
    },
    {
      id: 'card-camsync',
      name: 'HIS CamSync',
      category: 'Chẩn đoán hình ảnh',
      url: 'https://chromewebstore.google.com/detail/his-camsync-đồng-bộ-ảnh-e/mklhfnnomdpgjjnnknblaeihbnekibmd?authuser=0&hl=vi',
      color: 'linear-gradient(135deg,#047857,#065F46)'
    },
    {
      id: 'card-aladinn',
      name: 'Aladinn',
      category: 'Tiện ích cá nhân',
      url: 'https://chromewebstore.google.com/detail/aladinn/koghdldeojlfbkcgehgdppjafbpklbei?authuser=0&hl=vi',
      color: 'linear-gradient(135deg,#B45309,#92400E)'
    }
  ];

  /* Normalize Vietnamese accents for effortless searching */
  function foldVi(str) {
    return (str || '')
      .normalize('NFC')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');
  }

  function fallbackCopyText(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      ta.remove();
      return Boolean(ok);
    } catch (err) {
      /* Clipboard fallback blocked by browser */
      return false;
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () {
          /* Clipboard API permission denied; fall back to execCommand */
          return fallbackCopyText(text);
        }
      );
    }
    return Promise.resolve(fallbackCopyText(text));
  }

  /* Update shortcut labels for Windows/Linux vs Mac */
  var shortcutLabel = isMac ? '⌘K' : 'Ctrl K';
  ['header-shortcut-kbd', 'hero-shortcut-kbd'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = shortcutLabel;
  });
  var openCmdBtn = document.getElementById('open-cmd-btn');
  if (openCmdBtn) openCmdBtn.setAttribute('data-k', shortcutLabel);

  /* ========================================================================
     1. #070 Stacking Toasts
     ======================================================================== */
  var toastZone = document.getElementById('toast-zone');
  var toastLive = document.getElementById('toast-live');
  var toastList = [];
  var toastExpanded = false;
  var TOAST_DURATION = 3800;

  var TOAST_ICONS = {
    ok: '<svg viewBox="0 0 18 18"><path d="M4 9.4l3.2 3.2L14 5.6"/></svg>',
    info: '<svg viewBox="0 0 18 18"><circle cx="9" cy="9" r="6.5"/><path d="M9 8v4M9 5.8h.01"/></svg>'
  };

  function layoutToasts() {
    var offset = 0;
    toastList.forEach(function (item, idx) {
      var el = item.el;
      el.classList.toggle('back', !toastExpanded && idx > 0);
      if (toastExpanded) {
        el.style.setProperty('--y', -offset + 'px');
        el.style.setProperty('--s', '1');
        el.style.setProperty('--o', '1');
        offset += el.offsetHeight + 8;
      } else {
        el.style.setProperty('--y', -(idx * 12) + 'px');
        el.style.setProperty('--s', (1 - idx * 0.05).toFixed(2));
        el.style.setProperty('--o', idx > 2 ? '0' : '1');
      }
      el.style.zIndex = String(90 - idx);
      el.inert = !toastExpanded && idx > 0;
    });
  }

  function removeToast(item, dir) {
    var idx = toastList.indexOf(item);
    if (idx < 0) return;
    toastList.splice(idx, 1);
    item.el.classList.add('leave');
    if (dir) {
      item.el.style.setProperty('--dir', String(dir));
      item.el.classList.add('side');
    }
    setTimeout(function () { item.el.remove(); }, 420);
    layoutToasts();
  }

  function pushToast(title, subtitle, kind) {
    var k = kind || 'ok';
    var color = k === 'ok' ? 'var(--ux-mint)' : 'var(--ux-accent)';
    var el = document.createElement('div');
    el.className = 'u070-t enter';
    el.style.setProperty('--c', color);
    el.setAttribute('role', 'status');
    el.innerHTML =
      '<span class="u070-ic" aria-hidden="true">' + (TOAST_ICONS[k] || TOAST_ICONS.ok) + '</span>' +
      '<span class="u070-tx"><b></b><small></small></span>' +
      '<button class="u070-x" type="button" aria-label="Đóng thông báo"><svg viewBox="0 0 14 14"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7"/></svg></button>' +
      '<span class="u070-bar" aria-hidden="true"></span>';

    el.querySelector('b').textContent = title;
    el.querySelector('small').textContent = subtitle || '';

    var item = { el: el, left: TOAST_DURATION };
    toastZone.appendChild(el);
    toastList.unshift(item);
    void el.offsetWidth;
    el.classList.remove('enter');
    layoutToasts();
    if (toastLive) toastLive.textContent = title + (subtitle ? ' — ' + subtitle : '');

    el.querySelector('.u070-x').addEventListener('click', function () {
      removeToast(item);
    });

    /* Swipe sideways to dismiss */
    var sx = 0, dx = 0, dragging = false;
    el.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      dragging = true;
      sx = e.clientX;
      dx = 0;
      el.setPointerCapture(e.pointerId);
      el.classList.add('drag');
    });
    el.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dx = e.clientX - sx;
      el.style.setProperty('--dx', dx + 'px');
      el.style.setProperty('--o', String(Math.max(0.2, 1 - Math.abs(dx) / 240)));
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('drag');
      if (Math.abs(dx) > 85) {
        removeToast(item, dx > 0 ? 1 : -1);
      } else {
        el.style.setProperty('--dx', '0px');
        layoutToasts();
      }
    }
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);

    ensureToastLoop();
  }

  var toastRaf = 0, toastLast = 0;
  function toastFrame(now) {
    toastRaf = 0;
    if (!toastList.length) return;
    var dt = Math.min(64, now - toastLast);
    toastLast = now;
    if (!toastExpanded) {
      var front = toastList[0];
      if (front) {
        front.left -= dt;
        front.el.style.setProperty('--left', Math.max(0, front.left / TOAST_DURATION).toFixed(3));
        if (front.left <= 0) removeToast(front);
      }
    }
    if (toastList.length) toastRaf = requestAnimationFrame(toastFrame);
  }
  function ensureToastLoop() {
    if (!toastRaf) {
      toastLast = performance.now();
      toastRaf = requestAnimationFrame(toastFrame);
    }
  }

  toastZone.addEventListener('pointerenter', function (e) {
    if (e.pointerType === 'mouse') { toastExpanded = true; layoutToasts(); }
  });
  toastZone.addEventListener('pointerleave', function (e) {
    if (e.pointerType === 'mouse') { toastExpanded = false; layoutToasts(); }
  });

  /* ========================================================================
     2. #219 Circular-Reveal Light / Dark Mode Switch
     ======================================================================== */
  var themeToggle = document.getElementById('theme-toggle');
  var themeIcon = document.getElementById('theme-icon');

  var SVG_SUN = '<circle cx="9" cy="9" r="3.4" fill="currentColor"/><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M9 1.6v1.7M9 14.7v1.7M1.6 9h1.7M14.7 9h1.7M3.8 3.8l1.2 1.2M13 13l1.2 1.2M3.8 14.2L5 13M13 5l1.2-1.2"/></g>';
  var SVG_MOON = '<path d="M15.2 10.9A6.4 6.4 0 0 1 7.1 2.8a6.4 6.4 0 1 0 8.1 8.1z" fill="currentColor"/>';

  function isDarkActive() {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function renderThemeButton() {
    var dark = isDarkActive();
    themeIcon.innerHTML = dark ? SVG_SUN : SVG_MOON;
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('aria-label', dark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối');
  }

  function toggleTheme(originEl) {
    var nextDark = !isDarkActive();
    var nextVal = nextDark ? 'dark' : 'light';

    var applyTheme = function () {
      document.documentElement.setAttribute('data-theme', nextVal);
      try {
        localStorage.setItem('eh_theme', nextVal);
      } catch (e) {
        /* localStorage unavailable */
      }
      renderThemeButton();
    };

    if (!document.startViewTransition || reducedMotionQuery.matches || !originEl) {
      applyTheme();
      return;
    }

    var rect = originEl.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var endRadius = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));

    var vt = document.startViewTransition(applyTheme);
    vt.ready.then(function () {
      document.documentElement.animate(
        {
          clipPath: [
            'circle(0px at ' + cx.toFixed(0) + 'px ' + cy.toFixed(0) + 'px)',
            'circle(' + endRadius.toFixed(0) + 'px at ' + cx.toFixed(0) + 'px ' + cy.toFixed(0) + 'px)'
          ]
        },
        {
          duration: 560,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    }).catch(function () {
      /* ViewTransition skipped or interrupted */
    });
  }

  renderThemeButton();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', renderThemeButton);
  themeToggle.addEventListener('click', function () {
    toggleTheme(themeToggle);
  });

  /* ========================================================================
     3. #212 Pinned Top Header + Reading Progress Bar
     ======================================================================== */
  var header = document.getElementById('site-header');
  var scrollProgress = document.getElementById('scroll-progress');

  function syncHeaderOnScroll() {
    var y = Math.max(0, window.scrollY);
    header.classList.toggle('is-solid', y > 12);
    var docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollProgress.style.width = Math.min(100, (y / docHeight) * 100).toFixed(1) + '%';
  }

  syncHeaderOnScroll();
  window.addEventListener('scroll', syncHeaderOnScroll, { passive: true });
  window.addEventListener('resize', syncHeaderOnScroll, { passive: true });

  /* ========================================================================
     4. #216 Staggered Hero Word Reveal + #226 Grid-Beam Canvas + #002 Magnetic CTA
     ======================================================================== */
  var heroSection = document.getElementById('hero-section');
  var heroHeadline = document.getElementById('hero-headline');

  (function initHeroWords() {
    var fullTitle = 'Tiện ích Chrome tinh gọn cho lâm sàng và công việc.';
    var lines = [
      ['Tiện', 'ích', 'Chrome', 'tinh', 'gọn'],
      ['cho', 'lâm', 'sàng', 'và', 'công', 'việc.']
    ];
    heroHeadline.textContent = '';

    var srSpan = document.createElement('span');
    srSpan.className = 'sr-only';
    srSpan.textContent = fullTitle;
    heroHeadline.appendChild(srSpan);

    var delay = 140;
    lines.forEach(function (words, lineIdx) {
      var ln = document.createElement('span');
      ln.className = 'u216-ln';
      ln.setAttribute('aria-hidden', 'true');
      words.forEach(function (word, idx) {
        var box = document.createElement('span');
        var inner = document.createElement('span');
        box.className = 'u216-w';
        if (lineIdx === 1 && (word === 'lâm' || word === 'sàng')) {
          inner.className = 'accent-word';
        }
        inner.textContent = word;
        inner.style.setProperty('--d', String(delay));
        delay += 42;
        box.appendChild(inner);
        ln.appendChild(box);
        if (idx < words.length - 1) ln.appendChild(document.createTextNode(' '));
      });
      heroHeadline.appendChild(ln);
    });

    requestAnimationFrame(function () {
      heroSection.classList.add('is-in');
    });
  })();

  /* #226 Grid-Beam Canvas */
  (function initHeroBeams() {
    var cv = document.getElementById('hero-canvas');
    if (!cv || !cv.getContext) return;
    var cx = cv.getContext('2d');
    var CELL = 44;
    var W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    var beams = [], acc = 0, raf = 0, last = 0, visible = true;
    var COLORS = ['2,132,199', '14,165,233', '5,150,105'];

    function resize() {
      var r = heroSection.getBoundingClientRect();
      W = Math.max(320, Math.round(r.width));
      H = Math.max(320, Math.round(r.height));
      cv.width = W * dpr;
      cv.height = H * dpr;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnBeam() {
      var vert = Math.random() < 0.45;
      var maxLines = Math.max(2, Math.floor((vert ? W : H) / CELL));
      var line = (1 + Math.floor(Math.random() * (maxLines - 1))) * CELL - 1;
      var dir = Math.random() < 0.5 ? 1 : -1;
      beams.push({
        v: vert,
        l: line,
        p: dir > 0 ? -80 : (vert ? H : W) + 80,
        d: dir,
        sp: 95 + Math.random() * 80,
        len: 64 + Math.random() * 56,
        c: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }

    function drawBeams() {
      cx.clearRect(0, 0, W, H);
      beams.forEach(function (b) {
        var x0 = b.v ? b.l : b.p - b.d * b.len;
        var y0 = b.v ? b.p - b.d * b.len : b.l;
        var x1 = b.v ? b.l : b.p;
        var y1 = b.v ? b.p : b.l;
        var grad = cx.createLinearGradient(x0, y0, x1, y1);
        grad.addColorStop(0, 'rgba(' + b.c + ',0)');
        grad.addColorStop(1, 'rgba(' + b.c + ',0.65)');
        cx.strokeStyle = grad;
        cx.lineWidth = 1.5;
        cx.beginPath();
        cx.moveTo(x0 + 0.5, y0 + 0.5);
        cx.lineTo(x1 + 0.5, y1 + 0.5);
        cx.stroke();
      });
    }

    function frame(now) {
      raf = 0;
      if (!visible || reducedMotionQuery.matches) return;
      var dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      acc += dt;
      if (acc > 0.65 && beams.length < 7) {
        acc = 0;
        spawnBeam();
      }
      beams.forEach(function (b) { b.p += b.d * b.sp * dt; });
      beams = beams.filter(function (b) {
        var lim = (b.v ? H : W) + 90;
        return b.d > 0 ? b.p < lim : b.p > -90;
      });
      drawBeams();
      raf = requestAnimationFrame(frame);
    }

    function run() {
      if (!raf && visible && !reducedMotionQuery.matches) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) run();
      }).observe(heroSection);
    }

    heroSection.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = heroSection.getBoundingClientRect();
      heroSection.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
      heroSection.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
    });
    heroSection.addEventListener('pointerleave', function () {
      heroSection.style.setProperty('--mx', '-300px');
      heroSection.style.setProperty('--my', '-300px');
    });

    run();
  })();

  /* #002 Magnetic Arrow Button */
  (function initMagneticButton() {
    var wrap = document.getElementById('hero-magnetic-wrap');
    if (!wrap) return;
    var btn = wrap.querySelector('.u002-btn');
    var mag = wrap.querySelector('.u002-mag');
    var txt = wrap.querySelector('.u002-txt');
    var orb = wrap.querySelector('.u002-orb');
    var resetTimer = 0;

    wrap.addEventListener('pointermove', function (e) {
      if (reducedMotionQuery.matches || e.pointerType === 'touch') return;
      var r = btn.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      var pull = Math.max(0, 1 - Math.hypot(dx, dy) / 220);
      mag.style.translate = (dx * 0.12 * pull).toFixed(1) + 'px ' + (dy * 0.2 * pull).toFixed(1) + 'px';
      txt.style.translate = (dx * 0.05 * pull).toFixed(1) + 'px ' + (dy * 0.08 * pull).toFixed(1) + 'px';
      orb.style.translate = (dx * 0.1 * pull).toFixed(1) + 'px ' + (dy * 0.14 * pull).toFixed(1) + 'px';
    });

    wrap.addEventListener('pointerleave', function () {
      mag.style.translate = txt.style.translate = orb.style.translate = '0px 0px';
    });

    btn.addEventListener('click', function () {
      clearTimeout(resetTimer);
      wrap.dataset.state = 'idle';
      void btn.offsetWidth;
      wrap.dataset.state = 'go';
      resetTimer = setTimeout(function () { wrap.dataset.state = 'idle'; }, 1600);
    });
  })();

  /* ========================================================================
     5. #213 Auto-Advancing Preview Deck
     ======================================================================== */
  (function initPreviewDeck() {
    var deck = document.getElementById('preview-deck');
    if (!deck) return;
    var tabs = Array.prototype.slice.call(deck.querySelectorAll('.u213-tb'));
    var panels = Array.prototype.slice.call(deck.querySelectorAll('.u213-pn'));
    var viewport = deck.querySelector('.u213-pv');
    var DUR = 4600;
    var cur = 0, acc = 0, last = 0, paused = false, inView = true, raf = 0;

    tabs.forEach(function (t, i) {
      t.id = 'deck-tab-' + i;
      panels[i].id = 'deck-panel-' + i;
      t.setAttribute('aria-controls', panels[i].id);
      panels[i].setAttribute('aria-labelledby', t.id);
      t.tabIndex = i === 0 ? 0 : -1;
    });

    function selectTab(idx) {
      cur = idx;
      acc = 0;
      tabs.forEach(function (t, k) {
        var on = k === idx;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        t.querySelector('b').style.transform = 'scaleX(' + (on && reducedMotionQuery.matches ? 1 : 0) + ')';
      });
      panels.forEach(function (p, k) {
        var on = k === idx;
        p.classList.toggle('is-on', on);
        p.setAttribute('aria-hidden', String(!on));
        p.classList.remove('is-play');
        if (on) {
          void p.offsetWidth;
          p.classList.add('is-play');
        }
      });
    }

    function tick(now) {
      raf = 0;
      if (reducedMotionQuery.matches || !inView) return;
      if (!paused) acc += Math.min(64, now - last);
      last = now;
      var p = Math.min(1, acc / DUR);
      tabs[cur].querySelector('b').style.transform = 'scaleX(' + p.toFixed(3) + ')';
      if (p >= 1) selectTab((cur + 1) % tabs.length);
      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (!raf && !reducedMotionQuery.matches && inView) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { selectTab(i); start(); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) {
          e.preventDefault();
          var next = (i + d + tabs.length) % tabs.length;
          selectTab(next);
          tabs[next].focus();
        }
      });
    });

    viewport.addEventListener('pointerenter', function () { paused = true; });
    viewport.addEventListener('pointerleave', function () { paused = false; });
    deck.addEventListener('focusin', function () { paused = true; });
    deck.addEventListener('focusout', function () { paused = false; });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        inView = es[0].isIntersecting;
        if (inView) start();
      }).observe(deck);
    }

    selectTab(0);
    start();
  })();

  /* ========================================================================
     6. #039 Sliding Pill Filter + #050 Spotlight Cards + #008 Check-Morph Copy
     ======================================================================== */
  (function initDirectory() {
    var tabWrap = document.getElementById('filter-tabs');
    var pill = document.getElementById('filter-pill');
    var countEl = document.getElementById('directory-count');
    var tabs = Array.prototype.slice.call(tabWrap.querySelectorAll('.u039-tab'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('#ext-grid .u050'));
    var curIdx = 0;

    function syncPill(animate) {
      var activeTab = tabs[curIdx];
      if (!activeTab) return;
      if (!animate) pill.style.transition = 'none';
      pill.style.setProperty('--x', activeTab.offsetLeft + 'px');
      pill.style.setProperty('--w', activeTab.offsetWidth + 'px');
      if (!animate) {
        void pill.offsetWidth;
        pill.style.transition = '';
      }
    }

    function applyFilter(idx, focusTab) {
      curIdx = idx;
      var filter = tabs[idx].getAttribute('data-filter');
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', String(k === idx));
        t.tabIndex = k === idx ? 0 : -1;
      });
      if (focusTab) tabs[idx].focus();
      if (typeof tabs[idx].scrollIntoView === 'function') {
        tabs[idx].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      syncPill(true);

      var visibleCount = 0;
      cards.forEach(function (card) {
        var cat = card.getAttribute('data-cat');
        var show = filter === 'all' || cat === filter;
        card.classList.toggle('is-filtered-out', !show);
        if (show) {
          visibleCount++;
          if (!reducedMotionQuery.matches && card.animate) {
            card.animate(
              [{ opacity: 0, transform: 'translateY(12px) scale(0.98)' }, { opacity: 1, transform: 'none' }],
              { duration: 360, delay: (visibleCount - 1) * 45, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'backwards' }
            );
          }
        }
      });

      countEl.textContent = 'Đang hiển thị ' + visibleCount + ' tiện ích';
    }

    tabs.forEach(function (t, i) {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener('click', function () {
        if (curIdx !== i) applyFilter(i, false);
      });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) {
          e.preventDefault();
          applyFilter((i + d + tabs.length) % tabs.length, true);
        }
      });
    });

    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { syncPill(false); }).observe(tabWrap);
    }
    syncPill(false);

    /* #050 Spotlight-Tilt Card hover physics */
    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        card.classList.add('is-live');
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        if (!reducedMotionQuery.matches) {
          card.style.setProperty('--ry', ((x - 0.5) * 6).toFixed(2) + 'deg');
          card.style.setProperty('--rx', ((0.5 - y) * 5).toFixed(2) + 'deg');
        }
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('is-live');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    /* #008 Check-Morph Copy Buttons */
    document.querySelectorAll('.btn-copy').forEach(function (btn) {
      var timer = 0;
      var labelEl = btn.querySelector('.u008-label');
      var defaultLabel = labelEl ? labelEl.textContent : 'Sao chép';

      btn.addEventListener('click', function () {
        var url = btn.getAttribute('data-url');
        var name = btn.getAttribute('data-name') || 'tiện ích';
        if (!url) return;

        copyText(url).then(function (copied) {
          if (!copied) {
            pushToast('Không thể sao chép tự động', 'Vui lòng mở Web Store để lấy liên kết', 'info');
            return;
          }
          clearTimeout(timer);
          btn.classList.remove('is-copied');
          void btn.offsetWidth;
          btn.classList.add('is-copied');
          if (labelEl) labelEl.textContent = 'Đã chép';

          pushToast('Đã sao chép liên kết', name, 'ok');

          timer = setTimeout(function () {
            btn.classList.remove('is-copied');
            if (labelEl) labelEl.textContent = defaultLabel;
          }, 1800);
        });
      });
    });
  })();

  /* ========================================================================
     7. Modal Focus Isolation
     ======================================================================== */
  var cmdModal = document.getElementById('cmd-modal');
  var pageShellNodes = [
    document.getElementById('site-header'),
    document.getElementById('top'),
    document.querySelector('.site-footer')
  ];

  function syncBackgroundInert() {
    var modalOpen = Boolean(cmdModal && cmdModal.classList.contains('is-open'));
    pageShellNodes.forEach(function (node) {
      if (node) node.inert = modalOpen;
    });
    document.body.style.overflow = modalOpen ? 'hidden' : '';
  }

  function trapFocusInModal(e, modalEl) {
    if (e.key !== 'Tab') return;
    var focusable = Array.prototype.slice.call(
      modalEl.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) {
      return !el.hidden && el.offsetParent !== null;
    });
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (!modalEl.contains(document.activeElement)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
      return;
    }
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ========================================================================
     8. #243 Tap-to-Verify Security Badges + #044 FAQ Accordion
     ======================================================================== */
  (function initSecurityBadges() {
    var grid = document.getElementById('security-grid');
    if (!grid) return;

    var BADGES = [
      ['Zero-PHI', 'Bảo mật bệnh án', 'Không thu thập, không lưu trữ và không truyền dữ liệu bệnh nhân ra ngoài.', '#0369A1'],
      ['Web Store', 'Chính chủ Google', 'Phân phối qua cửa hàng Chrome chính thức, tự động kiểm duyệt an toàn.', '#047857'],
      ['WebRTC P2P', 'Truyền ảnh trực tiếp', 'Ảnh cận lâm sàng truyền thẳng giữa điện thoại và máy tính nội bộ.', '#0F766E'],
      ['BVDLCN 2025', 'Tuân thủ pháp lý', 'Thiết kế nghiêm ngặt theo quy định bảo vệ dữ liệu cá nhân Việt Nam.', '#1D4ED8']
    ];

    var SHIELD =
      '<svg viewBox="0 0 42 46" aria-hidden="true">' +
      '<path d="M21 3l15 5.5v11.5c0 11-6.6 18.8-15 22.5C12.6 38.8 6 31 6 20V8.5z" fill="color-mix(in srgb,currentColor 14%,transparent)" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M14.5 22.5l4.5 4.5 9-9.5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';

    BADGES.forEach(function (item, idx) {
      var card = document.createElement('div');
      card.className = 'u243-bg';
      card.style.setProperty('--c', item[3]);
      card.style.setProperty('--d', (idx * 1.2) + 's');

      card.innerHTML =
        '<button type="button" class="u243-f">' +
          '<span class="u243-sd">' + SHIELD + '</span>' +
          '<b></b><small></small>' +
        '</button>' +
        '<div class="u243-b">' +
          '<div class="u243-b-head"><b></b><button type="button" class="u243-back" aria-label="Lật lại mặt trước">↺</button></div>' +
          '<span></span>' +
          '<button type="button" class="u243-vf"><i aria-hidden="true"></i><em style="font-style:normal">Kiểm tra</em></button>' +
        '</div>';

      var frontBtn = card.querySelector('.u243-f');
      var backFace = card.querySelector('.u243-b');
      var backBtn = card.querySelector('.u243-back');
      var vfBtn = card.querySelector('.u243-vf');
      var vfLabel = vfBtn.querySelector('em');

      frontBtn.setAttribute('aria-label', item[0] + ' — ' + item[1] + '. Bấm để xem chi tiết');
      frontBtn.querySelector('b').textContent = item[0];
      frontBtn.querySelector('small').textContent = item[1];
      backFace.querySelector('b').textContent = item[0];
      backFace.querySelector('span').textContent = item[2];
      backFace.inert = true;

      function setFlipped(on, moveFocus) {
        card.classList.toggle('is-flip', on);
        frontBtn.inert = on;
        backFace.inert = !on;
        if (moveFocus) {
          (on ? vfBtn : frontBtn).focus({ preventScroll: true });
        }
      }

      frontBtn.addEventListener('click', function (e) {
        setFlipped(true, e.detail === 0);
      });

      backBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        setFlipped(false, e.detail === 0);
      });

      backFace.addEventListener('click', function (e) {
        if (e.target.closest('.u243-vf') || e.target.closest('.u243-back')) return;
        setFlipped(false, false);
      });

      vfBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (vfBtn.classList.contains('is-busy') || vfBtn.classList.contains('is-ok')) return;
        vfBtn.classList.add('is-busy');
        vfLabel.textContent = 'Đang kiểm...';
        setTimeout(function () {
          vfBtn.classList.remove('is-busy');
          vfBtn.classList.add('is-ok');
          vfLabel.textContent = 'Đạt chuẩn an toàn';
        }, reducedMotionQuery.matches ? 0 : 650);
      });

      grid.appendChild(card);
    });
  })();

  /* #044 FAQ Accordion */
  (function initAccordion() {
    var root = document.getElementById('faq-accordion');
    if (!root) return;
    var items = Array.prototype.slice.call(root.querySelectorAll('.u044-it'));
    var triggers = items.map(function (it) { return it.querySelector('.u044-q'); });

    items.forEach(function (it, idx) {
      var q = triggers[idx];
      var body = it.querySelector('.u044-body');
      q.id = 'faq-q-' + idx;
      body.id = 'faq-a-' + idx;
      q.setAttribute('aria-controls', body.id);
      body.setAttribute('aria-labelledby', q.id);

      q.addEventListener('click', function () {
        var willOpen = !it.classList.contains('open');
        items.forEach(function (other) {
          other.classList.remove('open');
          other.querySelector('.u044-q').setAttribute('aria-expanded', 'false');
        });
        if (willOpen) {
          it.classList.add('open');
          q.setAttribute('aria-expanded', 'true');
        }
      });

      q.addEventListener('keydown', function (e) {
        var next = e.key === 'ArrowDown' ? idx + 1 : e.key === 'ArrowUp' ? idx - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? triggers.length - 1 : -99;
        if (next === -99) return;
        e.preventDefault();
        triggers[(next + triggers.length) % triggers.length].focus();
      });
    });
  })();

  /* ========================================================================
     9. #046 Command Palette (⌘K / Ctrl+K)
     ======================================================================== */
  var cmdInput = document.getElementById('cmd-input');
  var cmdList = document.getElementById('cmd-list');
  var cmdHl = document.getElementById('cmd-hl');
  var cmdBody = document.getElementById('cmd-body');
  var cmdOpener = null;
  var cmdActiveIdx = 0;
  var cmdFiltered = [];

  var CMD_ICONS = {
    dl: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    cp: '<rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>',
    theme: '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>'
  };

  var COMMANDS = [
    { g: 'Cài đặt từ Chrome Web Store', n: 'Cài đặt: Điều dưỡng VNPT HIS', ic: 'dl', c: EXTENSIONS[0].color, run: function () { window.open(EXTENSIONS[0].url, '_blank', 'noopener,noreferrer'); } },
    { g: 'Cài đặt từ Chrome Web Store', n: 'Cài đặt: HIS CamSync', ic: 'dl', c: EXTENSIONS[1].color, run: function () { window.open(EXTENSIONS[1].url, '_blank', 'noopener,noreferrer'); } },
    { g: 'Cài đặt từ Chrome Web Store', n: 'Cài đặt: Aladinn', ic: 'dl', c: EXTENSIONS[2].color, run: function () { window.open(EXTENSIONS[2].url, '_blank', 'noopener,noreferrer'); } },
    { g: 'Chia sẻ cho đồng nghiệp', n: 'Sao chép liên kết: Điều dưỡng VNPT HIS', ic: 'cp', run: function () { copyText(EXTENSIONS[0].url).then(function (ok) { if (ok) pushToast('Đã sao chép liên kết', EXTENSIONS[0].name, 'ok'); }); } },
    { g: 'Chia sẻ cho đồng nghiệp', n: 'Sao chép liên kết: HIS CamSync', ic: 'cp', run: function () { copyText(EXTENSIONS[1].url).then(function (ok) { if (ok) pushToast('Đã sao chép liên kết', EXTENSIONS[1].name, 'ok'); }); } },
    { g: 'Chia sẻ cho đồng nghiệp', n: 'Sao chép liên kết: Aladinn', ic: 'cp', run: function () { copyText(EXTENSIONS[2].url).then(function (ok) { if (ok) pushToast('Đã sao chép liên kết', EXTENSIONS[2].name, 'ok'); }); } },
    { g: 'Giao diện', n: 'Đổi giao diện Sáng / Tối', ic: 'theme', run: function () { toggleTheme(themeToggle); } }
  ];

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function highlightMatch(label, rawQuery) {
    var cleanLabel = (label || '').normalize('NFC');
    if (!rawQuery) return escapeHtml(cleanLabel);
    var cleanQuery = rawQuery.normalize('NFC');
    var foldedLabel = foldVi(cleanLabel);
    var foldedQuery = foldVi(cleanQuery);
    if (!foldedQuery) return escapeHtml(cleanLabel);
    var idx = foldedLabel.indexOf(foldedQuery);
    if (idx < 0) return escapeHtml(cleanLabel);
    return (
      escapeHtml(cleanLabel.slice(0, idx)) +
      '<mark>' + escapeHtml(cleanLabel.slice(idx, idx + foldedQuery.length)) + '</mark>' +
      escapeHtml(cleanLabel.slice(idx + foldedQuery.length))
    );
  }

  function markCmdOption(idx, instant) {
    var options = Array.prototype.slice.call(cmdList.querySelectorAll('.u046-op'));
    if (!options.length) {
      cmdInput.removeAttribute('aria-activedescendant');
      cmdHl.style.opacity = '0';
      return;
    }
    cmdActiveIdx = (idx + options.length) % options.length;
    options.forEach(function (opt, k) {
      opt.setAttribute('aria-selected', String(k === cmdActiveIdx));
    });
    var activeEl = options[cmdActiveIdx];
    cmdInput.setAttribute('aria-activedescendant', activeEl.id);
    cmdHl.style.opacity = '1';
    if (instant) cmdHl.style.transition = 'none';
    var top = activeEl.offsetTop + 8;
    cmdHl.style.setProperty('--y', top + 'px');
    if (instant) {
      void cmdHl.offsetWidth;
      cmdHl.style.transition = '';
    }
    if (top + activeEl.offsetHeight > cmdBody.scrollTop + cmdBody.clientHeight) {
      cmdBody.scrollTo({ top: top + activeEl.offsetHeight - cmdBody.clientHeight + 8, behavior: instant ? 'auto' : 'smooth' });
    } else if (top < cmdBody.scrollTop + 28) {
      cmdBody.scrollTo({ top: cmdActiveIdx === 0 ? 0 : top - 28, behavior: instant ? 'auto' : 'smooth' });
    }
  }

  function renderCmdList() {
    var q = cmdInput.value.trim();
    var fq = foldVi(q);
    cmdFiltered = COMMANDS.filter(function (c) {
      return !fq || foldVi(c.n).indexOf(fq) >= 0 || foldVi(c.g).indexOf(fq) >= 0;
    });

    var html = '', curGroup = '';
    cmdFiltered.forEach(function (item, idx) {
      if (item.g !== curGroup) {
        curGroup = item.g;
        html += '<li class="u046-g" role="presentation">' + escapeHtml(curGroup) + '</li>';
      }
      html +=
        '<li class="u046-op" role="option" id="cmd-opt-' + idx + '" aria-selected="false">' +
        '<span class="u046-ic' + (item.c ? '' : ' plain') + '"' + (item.c ? ' style="--c:' + item.c + '"' : '') + ' aria-hidden="true">' +
        '<svg viewBox="0 0 24 24">' + CMD_ICONS[item.ic] + '</svg></span>' +
        '<span>' + highlightMatch(item.n, q) + '</span>' +
        '</li>';
    });

    if (!cmdFiltered.length) {
      html = '<li class="u046-empty" role="presentation"><b>Không tìm thấy kết quả cho “' + escapeHtml(q) + '”</b>Thử gõ tên tiện ích như Điều dưỡng, CamSync hoặc Aladinn</li>';
    }

    cmdList.innerHTML = html;
    Array.prototype.slice.call(cmdList.querySelectorAll('.u046-op')).forEach(function (opt, idx) {
      opt.addEventListener('pointermove', function () {
        if (cmdActiveIdx !== idx) markCmdOption(idx, false);
      });
      opt.addEventListener('click', function () {
        markCmdOption(idx, true);
        executeCmd();
      });
    });

    markCmdOption(0, true);
  }

  function openCmdModal(opener) {
    cmdOpener = opener || document.activeElement;
    cmdModal.classList.add('is-open');
    cmdModal.setAttribute('aria-hidden', 'false');
    cmdInput.setAttribute('aria-expanded', 'true');
    syncBackgroundInert();
    cmdInput.value = '';
    renderCmdList();
    setTimeout(function () { cmdInput.focus({ preventScroll: true }); }, 30);
  }

  function closeCmdModal() {
    if (!cmdModal.classList.contains('is-open')) return;
    cmdModal.classList.remove('is-open');
    cmdModal.setAttribute('aria-hidden', 'true');
    cmdInput.setAttribute('aria-expanded', 'false');
    syncBackgroundInert();
    if (cmdOpener && typeof cmdOpener.focus === 'function') {
      cmdOpener.focus({ preventScroll: true });
    }
  }

  function executeCmd() {
    var chosen = cmdFiltered[cmdActiveIdx];
    if (!chosen) return;
    var savedOpener = cmdOpener;
    closeCmdModal();
    chosen.run(savedOpener);
  }

  openCmdBtn.addEventListener('click', function () { openCmdModal(openCmdBtn); });
  document.getElementById('hero-cmd-btn').addEventListener('click', function (e) { openCmdModal(e.currentTarget); });
  cmdModal.addEventListener('click', function (e) {
    if (e.target === cmdModal) closeCmdModal();
  });
  cmdInput.addEventListener('input', renderCmdList);
  cmdInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      markCmdOption(cmdActiveIdx + (e.key === 'ArrowDown' ? 1 : -1), false);
    } else if (e.key === 'Enter' && !e.isComposing) {
      e.preventDefault();
      executeCmd();
    }
  });

  /* Global keyboard shortcuts (⌘K / Ctrl+K, Escape, Tab trap) */
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (cmdModal.classList.contains('is-open')) closeCmdModal();
      else openCmdModal(document.activeElement);
      return;
    }

    if (e.key === 'Tab' && cmdModal.classList.contains('is-open')) {
      trapFocusInModal(e, cmdModal);
      return;
    }

    if (e.key === 'Escape' && cmdModal.classList.contains('is-open')) {
      e.preventDefault();
      closeCmdModal();
    }
  });

  /* ========================================================================
     10. #076 Gliding Tooltip (Strict 300ms Enter Delay / 0ms Instant Dismiss)
     ======================================================================== */
  (function initGlidingTooltip() {
    var tip = document.getElementById('global-tooltip');
    if (!tip) return;
    var labelEl = tip.querySelector('span');
    var kbdEl = tip.querySelector('kbd');
    var targets = Array.prototype.slice.call(document.querySelectorAll('[data-t]'));
    var showTimer = 0;
    var currentTarget = null;

    function positionTooltip(el, glide) {
      labelEl.textContent = el.getAttribute('data-t') || '';
      kbdEl.textContent = el.getAttribute('data-k') || '';

      var r = el.getBoundingClientRect();
      var tw = tip.offsetWidth;
      var th = tip.offsetHeight;
      var cx = r.left + r.width / 2;
      var x = Math.max(10, Math.min(window.innerWidth - tw - 10, cx - tw / 2));
      var below = r.top < 80;
      var y = below ? r.bottom + 9 : r.top - th - 9;

      tip.classList.toggle('glide', glide);
      tip.style.setProperty('--x', x.toFixed(0) + 'px');
      tip.style.setProperty('--y', y.toFixed(0) + 'px');
    }

    function bindDescribedBy(el) {
      if (currentTarget && currentTarget !== el) {
        currentTarget.removeAttribute('aria-describedby');
      }
      currentTarget = el;
      el.setAttribute('aria-describedby', 'global-tooltip');
    }

    function scheduleShow(el) {
      clearTimeout(showTimer);
      var alreadyVisible = tip.classList.contains('on');
      if (alreadyVisible) {
        bindDescribedBy(el);
        positionTooltip(el, true);
        return;
      }
      /* Mandatory 300ms hover delay per Quiet Clinical / DESIGN.md standard */
      showTimer = setTimeout(function () {
        bindDescribedBy(el);
        positionTooltip(el, false);
        tip.classList.add('on');
      }, 300);
    }

    /* Mandatory 0ms immediate dismissal on leave, click, scroll, or Escape */
    function hideImmediate() {
      clearTimeout(showTimer);
      showTimer = 0;
      if (currentTarget) {
        currentTarget.removeAttribute('aria-describedby');
        currentTarget = null;
      }
      tip.classList.remove('on', 'glide');
    }

    targets.forEach(function (el) {
      el.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'mouse') scheduleShow(el);
      });
      el.addEventListener('focus', function () {
        if (el.matches(':focus-visible')) scheduleShow(el);
      });
      el.addEventListener('pointerleave', hideImmediate);
      el.addEventListener('click', hideImmediate);
      el.addEventListener('blur', hideImmediate);
    });

    window.addEventListener('scroll', hideImmediate, { passive: true });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && currentTarget) hideImmediate();
    });
  })();
})();
