// ===== Mobile Nav Toggle =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// ===== Spotlight cursor effect =====
const spotlight = document.querySelector('.spotlight');
if (spotlight) {
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX, y = e.clientY;
    spotlight.style.background = `radial-gradient(420px 420px at ${x}px ${y}px, rgba(162,89,255,.18), transparent 60%)`;
  });
}

// ===== 3D Tilt on hero card =====
const tilt = document.getElementById('heroTilt');
if (tilt) {
  const max = 10;
  const handle = (x, y, rect) => {
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = (x - cx) / rect.width;
    const dy = (y - cy) / rect.height;
    const rx = (dy * max).toFixed(2);
    const ry = (-dx * max).toFixed(2);
    tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  tilt.addEventListener('mousemove', (e)=> handle(e.clientX, e.clientY, tilt.getBoundingClientRect()));
  tilt.addEventListener('mouseleave', ()=> tilt.style.transform = 'rotateX(0) rotateY(0)');
}

// ===== Stepper reveal + progress =====


// ===== Project Modals via 'View more' buttons =====
const viewBtns = document.querySelectorAll('.view-more');
const modals = document.querySelectorAll('.modal');
const openModal = (id)=> document.getElementById(id)?.classList.add('show');
const closeModal = ()=> modals.forEach(m=> m.classList.remove('show'));
viewBtns.forEach(btn=> btn.addEventListener('click', ()=> openModal(btn.dataset.modal)));
modals.forEach(m=> m.addEventListener('click', (e)=>{ if (e.target.hasAttribute('data-close')) closeModal(); }));
modals.forEach(m=> m.querySelector('.modal-close')?.addEventListener('click', closeModal));
document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeModal(); });

// ===== Download PDF placeholders =====
document.querySelectorAll('[data-download]').forEach(btn=> btn.addEventListener('click', (e)=>{
  e.preventDefault();
  alert('PDF download placeholder — wire this to your actual PDF.');
}));

// ===== Resume button placeholder =====
const resumeBtn = document.getElementById('resumeBtn');
if (resumeBtn){ resumeBtn.addEventListener('click', (e)=> { e.preventDefault(); alert('Resume download placeholder.'); }); }

// ===== Lightbox for mock screens (case study pages) =====
/* Case-study: Screens lightbox + prototype link behavior */

/* Lightbox logic */
(function(){
  const screenBtns = Array.from(document.querySelectorAll('.screen-item'));
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImage');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  if (!screenBtns.length || !lightbox) return;

  let idx = 0;
  const setImage = (n) => {
    const btn = screenBtns[n];
    const src = btn?.dataset?.full;
    if (!src) return;
    lbImg.src = src;
    lbImg.alt = btn.querySelector('img')?.alt || 'Preview';
    idx = n;
  };

  const openLb = (n) => {
    setImage(n);
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLb = ()=> {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  screenBtns.forEach((b, i)=> b.addEventListener('click', ()=> openLb(i)));
  lbClose?.addEventListener('click', closeLb);
  lbPrev?.addEventListener('click', ()=> setImage((idx - 1 + screenBtns.length) % screenBtns.length));
  lbNext?.addEventListener('click', ()=> setImage((idx + 1) % screenBtns.length));

  // keyboard nav
  document.addEventListener('keydown', (e)=>{
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') setImage((idx - 1 + screenBtns.length) % screenBtns.length);
      if (e.key === 'ArrowRight') setImage((idx + 1) % screenBtns.length);
    }
  });

  // click backdrop to close
  lightbox.addEventListener('click', (ev)=>{
    if (ev.target === lightbox) closeLb();
  });

  // Prototype CTAs: you can replace '#' with your Figma URL
  const protoBtns = Array.from(document.querySelectorAll('#protoBtn, #protoBtnAside, #openFigma'));
  protoBtns.forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault();
    // replace the URL string below with real prototype link
    const figmaUrl = 'https://www.figma.com/proto/REPLACE_WITH_YOUR_LINK';
    window.open(figmaUrl, '_blank', 'noopener');
  }));

  // placeholder download
  const pdfBtn = document.getElementById('downloadPdf');
  if (pdfBtn) pdfBtn.addEventListener('click', (e)=> { e.preventDefault(); alert('Download PDF placeholder — replace link with your PDF.'); });
})();


//
// ===== Process Auto-Slider =====
(function(){
  const track = document.getElementById('processTrack');
  const progress = document.getElementById('processProgress');
  if (!track || !progress) return;

  const slides = track.querySelectorAll('.slide');
  let current = 0;
  const total = slides.length;
  const delay = 3500;

  function showSlide(i){
    current = i;
    track.style.transform = `translateX(-${100 * i}%)`;
    progress.style.width = `${((i+1)/total)*100}%`;
  }

  function nextSlide(){
    current = (current + 1) % total;
    showSlide(current);
  }

  setInterval(nextSlide, delay);
  showSlide(0);
})();


// Case-study action bar handlers (prototype open is normal link; this adds download fallback/analytics)
(function(){
  // download fallback: if browser blocks 'download', show placeholder alert
  document.querySelectorAll('.cs-download').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const href = btn.getAttribute('href');
      // If href is placeholder or not set, prevent and show message
      if (!href || href.includes('REPLACE_WITH_FILENAME')) {
        e.preventDefault();
        alert('PDF not found — please replace the href with the correct PDF filename in assets/pdfs/');
        return;
      }
      // Otherwise let the browser handle the download. Optionally, you can do analytics here.
    });
  });

  // Optional: add a small focus effect for keyboard users
  const actions = document.querySelector('.cs-actions');
  if (actions) {
    actions.addEventListener('focusin', ()=> actions.style.boxShadow = '0 20px 40px rgba(162,89,255,0.08)');
    actions.addEventListener('focusout', ()=> actions.style.boxShadow = '0 12px 30px rgba(16,17,20,0.06)');
  }
})();
