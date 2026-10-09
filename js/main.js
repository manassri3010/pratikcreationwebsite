/* ============================================================
   PRATIK CREATION — main.js
   All interactions: cursor, nav, hover reveal, scroll,
   page transitions, mobile menu, work filter.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. PAGE TRANSITION (fade in on load) ──────────────────── */
  const overlay = document.querySelector('.page-transition');
  if (overlay) {
    requestAnimationFrame(() => {
      overlay.style.transition = 'opacity 0.4s ease';
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.style.pointerEvents = 'none'; }, 400);
    });

    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('http')) {
        link.addEventListener('click', e => {
          e.preventDefault();
          overlay.style.pointerEvents = 'all';
          overlay.style.opacity = '1';
          setTimeout(() => { window.location.href = href; }, 320);
        });
      }
    });
  }


  /* ── 2. CUSTOM CURSOR ──────────────────────────────────────── */
  const cursor    = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor__dot');
  const cursorRing= document.querySelector('.cursor__ring');

  if (cursor && window.innerWidth > 900) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .project-row, .work-hero__item, .cap-item, .filter-btn, input, textarea')
      .forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
      });

    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
  }


  /* ── 2B. DOT FIELD BACKGROUND ───────────────────────────────── */
  /* a faint, sitewide dot grid, fixed to the viewport (a uniform
     grid looks identical whether it scrolls with the page or not,
     so pinning it to the viewport avoids tracking document height).
     On hover-capable pointers, dots near the cursor push outward
     and lerp back, like a very subtle liquid. Touch devices and
     prefers-reduced-motion get the plain static grid — no mousemove
     to react to on one, no motion wanted on the other. */
  const dotField = document.querySelector('.dot-field');
  if (dotField) {
    const ctx = dotField.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const SPACING   = 34;   // px between dots
    const RADIUS    = 1.15; // dot radius, px
    const ALPHA     = 0.085;
    const INFLUENCE = 130;  // px — cursor radius that displaces dots
    const MAX_PUSH  = 16;   // px — how far a dot can be pushed
    const EASE      = 0.14; // per-frame lerp toward target

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, dots = [];
    let mouseX = -9999, mouseY = -9999;
    let rafId = null;

    function buildGrid() {
      w = window.innerWidth;
      h = window.innerHeight;
      dotField.width  = Math.round(w * dpr);
      dotField.height = Math.round(h * dpr);
      dotField.style.width  = w + 'px';
      dotField.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;
      dots = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const baseX = i * SPACING;
          const baseY = j * SPACING;
          dots.push({ baseX, baseY, x: baseX, y: baseY });
        }
      }
    }

    function drawStatic() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(13, 13, 13, ${ALPHA})`;
      ctx.beginPath();
      dots.forEach(d => { ctx.moveTo(d.baseX + RADIUS, d.baseY); ctx.arc(d.baseX, d.baseY, RADIUS, 0, Math.PI * 2); });
      ctx.fill();
    }

    if (!canHover || reduceMotion) {
      // static grid only — no mouse tracking, no animation loop
      buildGrid();
      drawStatic();
      let resizeT;
      window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(() => { buildGrid(); drawStatic(); }, 150);
      });
    } else {
      buildGrid();

      document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
      document.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

      function tick() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = `rgba(13, 13, 13, ${ALPHA})`;
        ctx.beginPath();

        for (let k = 0; k < dots.length; k++) {
          const d = dots[k];
          const dx = d.baseX - mouseX;
          const dy = d.baseY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let targetX = d.baseX, targetY = d.baseY;
          if (dist < INFLUENCE) {
            const factor = 1 - dist / INFLUENCE;
            const push = factor * factor * MAX_PUSH;
            const nx = dist > 0.001 ? dx / dist : 0;
            const ny = dist > 0.001 ? dy / dist : 0;
            targetX = d.baseX + nx * push;
            targetY = d.baseY + ny * push;
          }

          d.x += (targetX - d.x) * EASE;
          d.y += (targetY - d.y) * EASE;

          ctx.moveTo(d.x + RADIUS, d.y);
          ctx.arc(d.x, d.y, RADIUS, 0, Math.PI * 2);
        }
        ctx.fill();
        rafId = requestAnimationFrame(tick);
      }
      rafId = requestAnimationFrame(tick);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(rafId); }
        else { rafId = requestAnimationFrame(tick); }
      });

      let resizeT;
      window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(buildGrid, 150);
      });
    }
  }


  /* ── 3. NAV — SCROLL BORDER ────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ── 4. MOBILE NAV ─────────────────────────────────────────── */
  const hamburger  = document.querySelector('.nav__hamburger');
  const navOverlay = document.querySelector('.nav-overlay');
  const navClose   = document.querySelector('.nav-overlay__close');

  if (hamburger && navOverlay) {
    hamburger.addEventListener('click', () => {
      navOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    const closeNav = () => {
      navOverlay.classList.remove('open');
      document.body.style.overflow = '';
    };
    if (navClose) navClose.addEventListener('click', closeNav);
    navOverlay.querySelectorAll('.nav-overlay__link').forEach(l => l.addEventListener('click', closeNav));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  }


  /* ── 5. PROJECT ROW — HOVER IMAGE REVEAL ───────────────────── */
  const hoverPanel = document.querySelector('.project-hover-image');

  if (hoverPanel && window.innerWidth > 1100) {
    const hoverImg         = hoverPanel.querySelector('img');
    const hoverPlaceholder = hoverPanel.querySelector('.placeholder');

    document.querySelectorAll('.project-row[data-image]').forEach(row => {
      row.addEventListener('mouseenter', () => {
        const src   = row.getAttribute('data-image');
        const color = row.getAttribute('data-color') || '#E8E4DE';
        const label = row.getAttribute('data-label') || '';

        if (hoverImg) {
          hoverImg.src = src;
          hoverImg.onerror = () => {
            hoverImg.style.display = 'none';
            hoverPanel.style.background = color;
            if (hoverPlaceholder) { hoverPlaceholder.textContent = label; hoverPlaceholder.style.display = 'flex'; }
          };
          hoverImg.onload = () => {
            hoverImg.style.display = 'block';
            if (hoverPlaceholder) hoverPlaceholder.style.display = 'none';
          };
        } else if (hoverPlaceholder) {
          hoverPanel.style.background = color;
          hoverPlaceholder.textContent = label;
        }
        hoverPanel.classList.add('visible');
      });

      row.addEventListener('mouseleave', () => hoverPanel.classList.remove('visible'));
    });
  }


  /* ── 6. SCROLL REVEAL ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    revealEls.forEach(el => obs.observe(el));
  }


  /* ── 7. STAT COUNT-UP ──────────────────────────────────────── */
  /* any element with data-count="<integer>" (optional data-suffix)
     counts up once, the first time it scrolls into view. Skipped
     entirely under prefers-reduced-motion — the final number is
     shown immediately instead. */
  const countEls = document.querySelectorAll('[data-count]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCount(el, duration = 1400) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';

    if (prefersReducedMotion || Number.isNaN(target)) {
      el.textContent = (Number.isNaN(target) ? el.dataset.count : target) + suffix;
      return;
    }

    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
  }

  if (countEls.length) {
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const group = entry.target.querySelectorAll('[data-count]');
        const els = group.length ? group : [entry.target];
        els.forEach((el, i) => setTimeout(() => animateCount(el), i * 120));
        countObs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    // observe shared ancestors once (so counters in the same row/strip
    // stagger together) rather than each element individually
    const countGroups = new Set();
    countEls.forEach(el => countGroups.add(el.closest('[data-count-group]') || el.parentElement.parentElement || el));
    countGroups.forEach(group => countObs.observe(group));
  }


  /* ── 8. ACCORDION ──────────────────────────────────────────── */
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    const item  = trigger.closest('.accordion__item');
    const panel = item.querySelector('.accordion__panel');
    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // close any open sibling in the same accordion (single-open UX)
      const parent = item.parentElement;
      parent.querySelectorAll('.accordion__item.open').forEach(sibling => {
        if (sibling !== item) {
          sibling.classList.remove('open');
          sibling.querySelector('.accordion__panel').style.maxHeight = '';
          sibling.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? '' : panel.scrollHeight + 'px';
    });
  });


  /* ── 9. DEV FLAGS ──────────────────────────────────────────── */
  /* [PROOF]/[CONFIRM] markers and "Photo coming" labels are hidden by
     default (see shared.css) and only switched on when this isn't the
     live production domain — fails safe toward "hidden" everywhere
     except known dev/preview hosts. */
  const LIVE_HOSTS = ['pratikcreation.co.in', 'www.pratikcreation.co.in'];
  if (!LIVE_HOSTS.includes(window.location.hostname)) {
    document.documentElement.classList.add('show-dev-flags');
  }


  /* ── 10. SAMPLE FORM — posts to Web3Forms so requests actually reach
     an inbox instead of vanishing; falls back to a real page POST
     (via the form's own action/method) if JS fails to run at all. ── */
  const sampleForm = document.querySelector('.sample-form');
  if (sampleForm) {
    const btn         = sampleForm.querySelector('.sample-form__submit');
    const btnDefault  = btn.textContent;
    const errorEl     = sampleForm.querySelector('.sample-form__error');
    const successEl   = sampleForm.querySelector('.sample-form__success');
    const noteEl      = sampleForm.querySelector('.sample-form__note');

    sampleForm.addEventListener('submit', async e => {
      e.preventDefault();

      if (!sampleForm.checkValidity()) {
        sampleForm.reportValidity();
        return;
      }

      if (errorEl) errorEl.hidden = true;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        const res = await fetch(sampleForm.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(sampleForm)
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Submission failed');

        btn.textContent = 'Request received ✓';
        btn.style.background = '#1C2B1E';
        btn.style.borderColor = '#1C2B1E';
        if (noteEl) noteEl.hidden = true;
        if (successEl) successEl.hidden = false;
        setTimeout(() => {
          btn.textContent = btnDefault;
          btn.style.background = ''; btn.style.borderColor = '';
          btn.disabled = false; sampleForm.reset();
          if (successEl) successEl.hidden = true;
          if (noteEl) noteEl.hidden = false;
        }, 5000);
      } catch (err) {
        btn.textContent = btnDefault;
        btn.disabled = false;
        if (errorEl) {
          errorEl.textContent = 'Something went wrong sending that — please email hello@pratikcreation.com instead.';
          errorEl.hidden = false;
        }
      }
    });
  }

});
