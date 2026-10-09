/* ============================================================
   PRATIK CREATION — work-hero.js
   Work page: Zone 1 hero (brand list + fixed head-image panel)
   and Zone 2 (scroll-revealed unified product gallery), plus the
   giant wordmark's bold-to-light scroll transition and the list's
   scroll-triggered shift/dim into the background.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const items = document.querySelectorAll('.work-hero__item');
  if (!items.length) return;


  /* ── staggered reveal on load ──────────────────────────────── */
  if (typeof gsap !== 'undefined') {
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.08,
      delay: 0.3
    });
  } else {
    items.forEach(item => {
      item.style.opacity = '1';
      item.style.transform = 'none';
    });
  }


  /* ── head-image panel crossfade (falls back to a color + name
     swatch when a brand has no real photo yet) ──────────────── */
  const panel     = document.querySelector('.work-hero__panel');
  const layers    = panel ? panel.querySelectorAll('.work-hero__panel-layer') : [];
  const fallback  = panel ? panel.querySelector('.work-hero__panel-fallback') : null;
  let panelActiveIndex = 0;

  function showPanel(src, color, label) {
    if (!panel) return;

    if (!src) {
      layers.forEach(l => l.classList.remove('visible'));
      if (fallback) {
        fallback.style.display = 'flex';
        fallback.style.background = color || 'var(--c-hover-bg)';
        fallback.textContent = label || '';
      }
      return;
    }

    const nextIndex = 1 - panelActiveIndex;
    const nextLayer = layers[nextIndex];
    const curLayer  = layers[panelActiveIndex];

    nextLayer.onload = () => {
      if (fallback) fallback.style.display = 'none';
      nextLayer.classList.add('visible');
      curLayer.classList.remove('visible');
      panelActiveIndex = nextIndex;
    };
    nextLayer.onerror = () => {
      nextLayer.classList.remove('visible');
      curLayer.classList.remove('visible');
      if (fallback) {
        fallback.style.display = 'flex';
        fallback.style.background = color || 'var(--c-hover-bg)';
        fallback.textContent = label || '';
      }
    };
    nextLayer.src = src;
  }


  /* ── select a brand: swap head image, mark it active ───────── */
  function selectItem(item) {
    items.forEach(i => i.classList.toggle('is-active', i === item));
    showPanel(item.getAttribute('data-image'), item.getAttribute('data-color'), item.getAttribute('data-label'));
  }

  items.forEach(item => {
    item.addEventListener('mouseenter', () => selectItem(item));
    item.addEventListener('click', () => selectItem(item));
  });

  /* Zone 1 default: first brand shown with no interaction required
     (also covers touch devices, which have no hover) */
  if (items[0]) selectItem(items[0]);


  /* ── Zone 2: unified scroll gallery. Only Inlook has confirmed, real
     product photography right now (see pratik-content.md's placeholder
     list — Cambridge Apparels, Teamo and the UK brand are still
     waiting on real photos, so they don't appear here; no AI-generated
     imagery is used to fill the gap). Each entry carries a short
     caption and is laid out on a dense bento grid so cell sizes vary
     instead of sitting in a uniform row/column grid. ───────────────── */
  const GALLERY_IMAGES = [
    { src: 'images/projects/inlook/hero.png',  alt: 'Inlook hang tag, foil-stamped branding on a floral pattern', title: 'Inlook — Hang Tag',        sub: 'Foil print, waxed cord' },
    { src: 'images/projects/inlook/multi.png', alt: 'Inlook hang tags in three colourways',                       title: 'Inlook — Tag Colourways',  sub: 'Three-way foil variant' },
    { src: 'images/projects/inlook/teami.png', alt: 'Inlook Teami collection tag, front and back',                title: 'Inlook — Teami Collection', sub: 'Textured stock, die-cut window' }
  ];

  // repeating size pattern -> the asymmetric/bento rhythm (see CSS .size-*).
  const GALLERY_SIZE_PATTERN = ['lg', 'sm', 'tall'];

  const gallery = document.getElementById('workGallery');
  if (gallery) {
    GALLERY_IMAGES.forEach(({ src, alt, title, sub }, i) => {
      const entry = document.createElement('div');
      entry.className = `work-gallery__entry size-${GALLERY_SIZE_PATTERN[i % GALLERY_SIZE_PATTERN.length]}`;

      const item = document.createElement('div');
      item.className = 'work-gallery__item';
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      img.loading = 'lazy';
      img.dataset.title = title;
      img.dataset.sub = sub;
      item.appendChild(img);

      const caption = document.createElement('div');
      caption.className = 'work-gallery__caption';
      caption.innerHTML = `
        <span class="work-gallery__caption-num">${String(i + 1).padStart(2, '0')}</span>
        <span>
          <p class="work-gallery__caption-title">${title}</p>
          <p class="work-gallery__caption-sub">${sub}</p>
        </span>
      `;

      entry.appendChild(item);
      entry.appendChild(caption);
      gallery.appendChild(entry);
    });
  }


  /* ── scroll-triggered reveal for gallery items and giant wordmark
     lighten. The brand list is sticky (see CSS) and stays fully
     visible the whole time, so it gets no scroll-driven effect. ─── */
  const galleryItems = document.querySelectorAll('.work-gallery__entry');
  const giant         = document.querySelector('.work-giant');
  const galleryWrap    = document.querySelector('.work-gallery-wrap');

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    galleryItems.forEach(item => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    if (giant && galleryWrap) {
      gsap.to(giant, {
        opacity: 0.14,
        ease: 'none',
        scrollTrigger: {
          trigger: galleryWrap,
          start: 'top bottom',
          end: 'top 60%',
          scrub: 0.3
        }
      });
    }

    // web fonts (Poppins) load async and can reflow the giant wordmark/list
    // after ScrollTrigger has already cached its trigger positions —
    // refresh once they're actually in so those positions stay accurate
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  } else {
    galleryItems.forEach(item => {
      item.style.opacity = '1';
      item.style.transform = 'none';
    });
  }

});
