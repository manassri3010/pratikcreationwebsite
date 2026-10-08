/* ============================================================
   PRATIK CREATION — concepts-hero.js
   Concepts page: same Zone 1 hero (brand list + fixed head-image
   panel) and Zone 2 (scroll-revealed unified gallery) mechanics as
   work-hero.js, re-pointed at the concept-render dataset. Selectors
   are unchanged from work-hero.js so shared.css / concepts.html's
   own inline styles (copied from work.html) keep applying as-is.
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
     swatch if a concept image fails to load) ────────────────── */
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


  /* ── select a concept: swap head image, mark it active ─────── */
  function selectItem(item) {
    items.forEach(i => i.classList.toggle('is-active', i === item));
    showPanel(item.getAttribute('data-image'), item.getAttribute('data-color'), item.getAttribute('data-label'));
  }

  items.forEach(item => {
    item.addEventListener('mouseenter', () => selectItem(item));
    item.addEventListener('click', () => selectItem(item));
  });

  /* Zone 1 default: first concept shown with no interaction required
     (also covers touch devices, which have no hover) */
  if (items[0]) selectItem(items[0]);


  /* ── Zone 2: unified scroll gallery — flat list, all 13 concept
     renders, no per-brand filtering. Each entry carries a short
     caption (title + one supporting line) and an always-visible
     "Concept" tag overlaid on the image itself (not hover-only, so
     it reads on touch devices too), laid out on the same dense
     bento grid as work.html. ─────────────────────────────────── */
  const GALLERY_IMAGES = [
    { src: 'images/concepts/good-hour.jpg',    w: 1024, h: 559,  alt: 'Good Hour — coffee cup carrier',        title: 'Good Hour — Coffee Carrier',   sub: 'Die-cut cardboard, bold type' },
    { src: 'images/concepts/loafer.jpg',       w: 1024, h: 559,  alt: 'Loafer — bakery box, two colorways',    title: 'Loafer — Bakery Box',          sub: 'Two-tone kraft, fresh-daily branding' },
    { src: 'images/concepts/good-measure.jpg', w: 1400, h: 764,  alt: 'Good Measure — sock bands, three colorways', title: 'Good Measure — Sock Bands', sub: 'Ribbed cotton, tonal colorways' },
    { src: 'images/concepts/amara.jpg',        w: 1400, h: 764,  alt: 'Amara — sparkling yerba mate can carrier', title: 'Amara — Can Carrier',        sub: 'Sparkling yerba mate, 6-pack' },
    { src: 'images/concepts/daybreak.jpg',     w: 921,  h: 1152, alt: 'Daybreak — cold brew shipper boxes',    title: 'Daybreak — Shipper Box',       sub: 'Cold brew subscription mailer' },
    { src: 'images/concepts/pace.jpg',         w: 1024, h: 1024, alt: 'Pace — mailer box die-line',            title: 'Pace — Mailer Die-Line',       sub: 'Two-tone kraft, bold interior print' },
    { src: 'images/concepts/ember.jpg',        w: 896,  h: 1195, alt: 'Ember — stacked clamshell takeout boxes', title: 'Ember — Clamshell Box',      sub: 'Stacked service-line packaging' },
    { src: 'images/concepts/eave.jpg',         w: 1400, h: 764,  alt: 'Eave — layered hang tag pair',          title: 'Eave — Hangtag Pair',          sub: 'Layered stock, translucent overlay' },
    { src: 'images/concepts/meridian.jpg',     w: 1400, h: 764,  alt: 'Meridian — glossy gift bag',            title: 'Meridian — Gift Bag',          sub: 'Gloss finish, minimal wordmark' },
    { src: 'images/concepts/nume.jpg',         w: 1400, h: 764,  alt: 'Nume — cream shopping bags with ribbon handles', title: 'Nume — Shopping Bag', sub: 'Ribbon handle, boutique-weight stock' },
    { src: 'images/concepts/glow.jpg',         w: 1400, h: 764,  alt: '[glow] — business card, front and back', title: '[glow] — Business Card',     sub: 'Spot color, front and back' },
    { src: 'images/concepts/drift.jpg',        w: 1400, h: 764,  alt: 'Drift — hand-lettered business cards',  title: 'Drift — Business Card',        sub: 'Hand-lettered, layered stock' },
    { src: 'images/concepts/slab.jpg',         w: 1400, h: 764,  alt: 'Slab — matte black gable box',          title: 'Slab — Gable Box',             sub: 'Matte black, single-color print' }
  ];

  // repeating size pattern -> the asymmetric/bento rhythm (see CSS .size-*).
  // Kept identical to work-hero.js: it cycles by index, so 13 items just
  // wrap back to 'lg' for the 13th — acceptable per spec.
  const GALLERY_SIZE_PATTERN = ['lg', 'sm', 'tall', 'sm', 'lg', 'sm', 'tall', 'md', 'sm', 'lg', 'tall', 'sm'];

  const gallery = document.getElementById('workGallery');
  if (gallery) {
    GALLERY_IMAGES.forEach(({ src, w, h, alt, title, sub }, i) => {
      const entry = document.createElement('div');
      entry.className = `work-gallery__entry size-${GALLERY_SIZE_PATTERN[i % GALLERY_SIZE_PATTERN.length]}`;

      const item = document.createElement('div');
      item.className = 'work-gallery__item';

      const tag = document.createElement('span');
      tag.className = 'work-gallery__item-tag';
      tag.textContent = 'Concept';
      item.appendChild(tag);

      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      img.loading = 'lazy';
      // intrinsic size so the browser reserves the right box before the
      // file has even started downloading — stops the gallery jumping
      // around as 13 photos load in, which is what reads as "slow".
      img.width = w;
      img.height = h;
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
      // explicit starting state: full dark on load, regardless of any
      // scroll position the browser restores on refresh — only fades
      // toward the background grey once the user actually scrolls down
      // into the gallery.
      gsap.set(giant, { opacity: 1 });
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
