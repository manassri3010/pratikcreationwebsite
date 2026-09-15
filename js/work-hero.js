/* ============================================================
   PRATIK CREATION — work-hero.js
   Work page: staggered title-list reveal, hover/select-driven
   image crossfade + product showcase, scroll-triggered reveal,
   and the giant wordmark's bold-to-light scroll transition.
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


  /* ── cursor-following image reveal ─────────────────────────── */
  const cursorImg   = document.querySelector('.work-cursor-image');
  const ciLayers     = cursorImg ? cursorImg.querySelectorAll('.work-cursor-image__layer') : [];
  const ciPlaceholder = cursorImg ? cursorImg.querySelector('.work-cursor-image__placeholder') : null;
  let ciActiveIndex = 0;

  function crossfadeTo(src, color, label) {
    if (!cursorImg) return;
    const nextIndex = 1 - ciActiveIndex;
    const nextLayer = ciLayers[nextIndex];
    const curLayer  = ciLayers[ciActiveIndex];

    nextLayer.onload = () => {
      nextLayer.classList.add('visible');
      curLayer.classList.remove('visible');
      if (ciPlaceholder) ciPlaceholder.style.display = 'none';
      ciActiveIndex = nextIndex;
    };
    nextLayer.onerror = () => {
      nextLayer.classList.remove('visible');
      curLayer.classList.remove('visible');
      if (ciPlaceholder) { ciPlaceholder.textContent = label || ''; ciPlaceholder.style.display = 'flex'; }
    };
    nextLayer.src = src;
  }

  // position the panel near the cursor, offset so it doesn't sit under it
  const CI_OFFSET_X = 28;
  const CI_OFFSET_Y = -260;

  function moveCursorImage(e) {
    if (!cursorImg) return;
    let x = e.clientX + CI_OFFSET_X;
    let y = e.clientY + CI_OFFSET_Y;
    x = Math.min(Math.max(x, 16), window.innerWidth - 376);
    y = Math.max(y, 16);
    cursorImg.style.transform = `translate(${x}px, ${y}px)`;
  }

  if (cursorImg && window.innerWidth > 1100) {
    items.forEach(item => {
      item.addEventListener('mouseenter', e => {
        cursorImg.classList.add('visible');
        moveCursorImage(e);
      });
      item.addEventListener('mousemove', moveCursorImage);
      item.addEventListener('mouseleave', () => cursorImg.classList.remove('visible'));
    });
  }


  /* ── product showcase set switching ────────────────────────── */
  const showcaseSets  = document.querySelectorAll('.work-showcase__set');
  const showcaseLabel = document.querySelector('.work-showcase__label-name');

  function setActiveShowcase(project, label) {
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


  /* ── select a title: swap hero image, switch showcase set,
     mark it persistently active, point the visit button at it ── */
  const visitBtn = document.getElementById('workVisitBtn');

  function selectItem(item) {
    items.forEach(i => i.classList.toggle('is-active', i === item));
    crossfadeTo(item.getAttribute('data-image'), item.getAttribute('data-color'), item.getAttribute('data-label'));
    setActiveShowcase(item.getAttribute('data-project'), item.getAttribute('data-label'));
    const href = item.getAttribute('href');
    if (visitBtn && href) visitBtn.setAttribute('href', href);
  }

  items.forEach(item => {
    item.addEventListener('mouseenter', () => selectItem(item));

    // plain click/tap selects in place; modifier-click or middle-click
    // still opens the case study normally (native browser behavior)
    item.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      selectItem(item);
    });
  });

  /* select the first project by default */
  if (items[0]) selectItem(items[0]);


  /* ── cross-shaped cursor over showcase products ────────────── */
  const cursor = document.querySelector('.cursor');
  if (cursor && window.innerWidth > 900) {
    document.querySelectorAll('.work-showcase__item').forEach(item => {
      item.addEventListener('mouseenter', () => cursor.classList.add('cross'));
      item.addEventListener('mouseleave', () => cursor.classList.remove('cross'));
    });
  }


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

    // bold/near-solid by default, lightens (but stays clearly legible)
    // once the product showcase scrolls into view
    if (giant && showcase) {
      gsap.to(giant, {
        opacity: 0.14,
        ease: 'none',
        scrollTrigger: {
          trigger: showcase,
          start: 'top bottom',
          end: 'top 60%',
          scrub: 0.3
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
