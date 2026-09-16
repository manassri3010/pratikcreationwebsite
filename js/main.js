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


  /* ── 8. SAMPLE FORM ────────────────────────────────────────── */
  const sampleForm = document.querySelector('.sample-form');
  if (sampleForm) {
    sampleForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = sampleForm.querySelector('.sample-form__submit');
      btn.textContent = 'Request received ✓';
      btn.style.background = '#1C2B1E';
      btn.style.borderColor = '#1C2B1E';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Send me the sample kit →';
        btn.style.background = ''; btn.style.borderColor = '';
        btn.disabled = false; sampleForm.reset();
      }, 4000);
    });
  }


  /* ── 9. FOOTER YEAR ────────────────────────────────────────── */
  const yearEl = document.querySelector('.footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
