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


  /* ── Zone 2: unified scroll gallery — flat list, all brands mixed,
     no per-brand filtering. Each entry carries a short caption (title +
     one supporting line) and is laid out on a dense bento grid so cell
     sizes vary instead of sitting in a uniform row/column grid. ────── */
  const GALLERY_IMAGES = [
    { src: 'images/projects/suzao/hero.png',        alt: 'Studio Suzao — full card set',    title: 'Studio Suzao — Card Set',        sub: 'Spot UV, soft-touch finish' },
    { src: 'images/projects/matiere/hero.png',       alt: 'MATIÈRE — No. 07 Vétiver',        title: 'MATIÈRE — No. 07 Vétiver',       sub: 'Blind deboss, gold foil' },
    { src: 'images/projects/inlook/hero.png',        alt: 'IN LOOK — hang tag',              title: 'IN LOOK — Hangtag',              sub: 'Foil print, waxed cord' },
    { src: 'images/projects/r/wine-bag-cream.png',   alt: 'R. — wine bag, cream',            title: 'R. — Wine Bag, Cream',           sub: 'Die-cut handle, foil print' },
    { src: 'images/projects/suzao/card-front.png',   alt: 'Studio Suzao — card front',       title: 'Studio Suzao — Card Front',      sub: 'Brand identity print' },
    { src: 'images/projects/matiere/matiere.jpeg',   alt: 'MATIÈRE — full fragrance set',    title: 'MATIÈRE — Fragrance Set',        sub: 'Matte box, tonal palette' },
    { src: 'images/projects/inlook/multi.png',       alt: 'IN LOOK — tag colorways',         title: 'IN LOOK — Tag Colorways',        sub: 'Three-way foil variant' },
    { src: 'images/projects/r/wine-bag-black.png',   alt: 'R. — wine bag, black',            title: 'R. — Wine Bag, Black',           sub: 'Gold foil on matte black' },
    { src: 'images/projects/suzao/card-back.png',    alt: 'Studio Suzao — card back',        title: 'Studio Suzao — Card Back',       sub: 'Brand identity print' },
    { src: 'images/projects/suzao/tag.png',          alt: 'Studio Suzao — hang tag',         title: 'Studio Suzao — Hangtag',         sub: 'Foil-stamped, die-cut' },
    { src: 'images/projects/inlook/teami.png',       alt: 'IN LOOK — Teami collection tag',  title: 'IN LOOK — Teami Collection',     sub: 'Textured stock, die-cut window' },
    { src: 'images/projects/r/lifestyle.jpeg',       alt: 'R. — bottle and bag',             title: 'R. — Bottle & Bag',              sub: 'Full packaging system' }
  ];

  // repeating size pattern -> the asymmetric/bento rhythm (see CSS .size-*).
  // Column spans sum to 4 within each group of 3 so rows fill cleanly:
  // lg+sm+tall=4, sm+lg+sm=4, tall+md+sm=4, lg+tall+sm=4.
  const GALLERY_SIZE_PATTERN = ['lg', 'sm', 'tall', 'sm', 'lg', 'sm', 'tall', 'md', 'sm', 'lg', 'tall', 'sm'];

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

    // web fonts (Syne) load async and can reflow the giant wordmark/list
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
