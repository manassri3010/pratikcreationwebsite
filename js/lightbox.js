/* ============================================================
   PRATIK CREATION — lightbox.js
   Click-to-enlarge for product photography in the scroll gallery
   on both the Work and Concepts pages. Shared (not per-page)
   because the behaviour and markup are identical — only the
   gallery contents differ, and those are already read straight
   off the clicked image at open time.

   Uses one delegated click listener on document rather than
   binding to each .work-gallery__item img directly, since both
   pages build their gallery from a JS array after
   DOMContentLoaded — delegation means this file doesn't care
   whether it runs before or after that gallery is built.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML = `
    <button class="lightbox__close" aria-label="Close enlarged image">✕</button>
    <figure class="lightbox__figure">
      <img class="lightbox__img" src="" alt="">
      <figcaption class="lightbox__caption">
        <p class="lightbox__caption-title"></p>
        <p class="lightbox__caption-sub"></p>
      </figcaption>
    </figure>
  `;
  document.body.appendChild(overlay);

  const img       = overlay.querySelector('.lightbox__img');
  const captionEl = overlay.querySelector('.lightbox__caption');
  const titleEl   = overlay.querySelector('.lightbox__caption-title');
  const subEl     = overlay.querySelector('.lightbox__caption-sub');
  const closeBtn  = overlay.querySelector('.lightbox__close');

  function openLightbox(src, alt, title, sub) {
    if (!src) return;
    img.src = src;
    img.alt = alt || '';
    if (title || sub) {
      titleEl.textContent = title || '';
      subEl.textContent = sub || '';
      captionEl.hidden = false;
    } else {
      captionEl.hidden = true;
    }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', e => {
    const galleryImg = e.target.closest('.work-gallery__item img');
    if (!galleryImg) return;
    openLightbox(galleryImg.currentSrc || galleryImg.src, galleryImg.alt, galleryImg.dataset.title, galleryImg.dataset.sub);
  });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeLightbox();
  });

});
