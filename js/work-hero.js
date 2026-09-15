/* ============================================================
   PRATIK CREATION — work-hero.js
   Work page: staggered title-list reveal + hover image crossfade.
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


  /* ── hover image-stage crossfade ───────────────────────────── */
  const stage = document.querySelector('.work-hero__image-stage');
  if (!stage) return;

  const layers      = stage.querySelectorAll('.work-hero__image-stage-layer');
  const placeholder = stage.querySelector('.work-hero__image-placeholder');
  let activeIndex = 0;

  function crossfadeTo(src, color, label) {
    const nextIndex = 1 - activeIndex;
    const nextLayer = layers[nextIndex];
    const curLayer  = layers[activeIndex];

    nextLayer.onload = () => {
      nextLayer.classList.add('visible');
      curLayer.classList.remove('visible');
      if (placeholder) placeholder.style.display = 'none';
      activeIndex = nextIndex;
    };
    nextLayer.onerror = () => {
      nextLayer.classList.remove('visible');
      curLayer.classList.remove('visible');
      stage.style.background = color || 'var(--c-hover-bg)';
      if (placeholder) { placeholder.textContent = label || ''; placeholder.style.display = 'flex'; }
    };
    nextLayer.src = src;
  }

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      crossfadeTo(
        item.getAttribute('data-image'),
        item.getAttribute('data-color'),
        item.getAttribute('data-label')
      );
    });
  });

  /* show the first project by default */
  const first = items[0];
  if (first) {
    crossfadeTo(
      first.getAttribute('data-image'),
      first.getAttribute('data-color'),
      first.getAttribute('data-label')
    );
  }


  /* ── product showcase: tracks whichever title was last hovered ── */
  const showcaseSets  = document.querySelectorAll('.work-showcase__set');
  const showcaseLabel = document.querySelector('.work-showcase__label-name');

  function setActiveProject(project, label) {
    let changed = false;
    showcaseSets.forEach(set => {
      const isMatch = set.getAttribute('data-project') === project;
      if (isMatch && !set.classList.contains('is-active')) changed = true;
      set.classList.toggle('is-active', isMatch);
    });
    if (showcaseLabel && label) showcaseLabel.textContent = label;
    if (changed && typeof ScrollTrigger !== 'undefined') {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      setActiveProject(item.getAttribute('data-project'), item.getAttribute('data-label'));
    });
  });


  /* ── scroll-triggered reveal for showcase images + giant wordmark fade ── */
  const showcaseItems = document.querySelectorAll('.work-showcase__item');
  const giant          = document.querySelector('.work-giant');
  const showcase       = document.querySelector('.work-showcase');

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    showcaseItems.forEach(item => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    if (giant && showcase) {
      gsap.to(giant, {
        opacity: 0.015,
        ease: 'none',
        scrollTrigger: {
          trigger: showcase,
          start: 'top bottom',
          end: 'top center',
          scrub: true
        }
      });
    }
  } else {
    showcaseItems.forEach(item => {
      item.style.opacity = '1';
      item.style.transform = 'none';
    });
  }

});
