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
     no per-brand filtering. Placeholder set repeats the two real
     head images we have until individual product photography and
     the IN LOOK / R. images are supplied. ─────────────────────── */
  const GALLERY_IMAGES = [
    { src: 'images/projects/suzao/hero.png',       alt: 'Studio Suzao — full card set' },
    { src: 'images/projects/suzao/card-front.png', alt: 'Studio Suzao — card front' },
    { src: 'images/projects/matiere/hero.png',     alt: 'MATIÈRE — No. 07 Vétiver' },
    { src: 'images/projects/suzao/card-back.png',  alt: 'Studio Suzao — card back' },
    { src: 'images/projects/matiere/hero.png',     alt: 'MATIÈRE — No. 07 Vétiver' },
    { src: 'images/projects/suzao/hero.png',       alt: 'Studio Suzao — full card set' }
  ];

  const gallery = document.getElementById('workGallery');
  if (gallery) {
    GALLERY_IMAGES.forEach(({ src, alt }) => {
      const item = document.createElement('div');
      item.className = 'work-gallery__item';
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      img.loading = 'lazy';
      item.appendChild(img);
      gallery.appendChild(item);
    });
  }


  /* ── scroll-triggered reveal for gallery items, giant wordmark
     lighten, and brand list shift/dim into the background ─────── */
  const galleryItems = document.querySelectorAll('.work-gallery__item');
  const giant         = document.querySelector('.work-giant');
  const galleryWrap    = document.querySelector('.work-gallery-wrap');
  const heroList       = document.getElementById('workHeroList');

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

    if (heroList && galleryWrap) {
      ScrollTrigger.create({
        trigger: galleryWrap,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
        onEnter: () => heroList.classList.add('is-dimmed'),
        onLeaveBack: () => heroList.classList.remove('is-dimmed')
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
