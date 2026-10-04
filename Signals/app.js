/* =====================================================
   SignISL Website - Vanilla JS
   ===================================================== */

/* ─── SLIDESHOW ─── */
let current = 0;
let slideTimer;
const slides = () => document.querySelectorAll('.slide');
const dots   = () => document.querySelectorAll('.slide-dot');

function slideTo(n) {
  const sl = slides(), dt = dots();
  if (!sl.length) return;
  sl[current].classList.remove('active');
  dt[current].classList.remove('active');
  current = ((n % sl.length) + sl.length) % sl.length;
  sl[current].classList.add('active');
  dt[current].classList.add('active');
}

function slideNext() { slideTo(current + 1); resetSlideTimer(); }
function slidePrev() { slideTo(current - 1); resetSlideTimer(); }

function startSlideTimer() {
  slideTimer = setInterval(() => slideTo(current + 1), 4000);
}
function resetSlideTimer() {
  clearInterval(slideTimer);
  startSlideTimer();
}

document.addEventListener('DOMContentLoaded', () => {
  if (slides().length) { slideTo(0); startSlideTimer(); }
});

/* ─── DEMO SECTION ─── */
function setChip(text) {
  const ta = document.getElementById('demo-text');
  if (ta) ta.value = text;
}

function triggerTranslate() {
  const ta       = document.getElementById('demo-text');
  const caption  = document.getElementById('demo-caption');
  const indicator = document.getElementById('translating-indicator');
  const avatar   = document.getElementById('demo-avatar');
  if (!ta || !caption) return;

  const text = ta.value.trim() || 'Hello';
  const map = {
    'Hello 👋': 'नमस्ते · Hello',
    'My name is...': 'मेरा नाम है… · My name is…',
    'I need help 🙏': 'मुझे सहायता चाहिए · I need help',
    'hello': 'नमस्ते · Hello',
  };

  // Show translating state
  if (indicator) indicator.style.opacity = '1';
  if (avatar) avatar.style.opacity = '0.5';
  if (caption) caption.style.opacity = '0.4';

  setTimeout(() => {
    const lower = text.toLowerCase().replace(/[👋🙏]/g, '').trim();
    const result = map[text] || map[lower] || `"${text.substring(0, 20)}" → ISL`;
    if (caption) { caption.textContent = result; caption.style.opacity = '1'; }
    if (indicator) indicator.style.opacity = '0.5';
    if (avatar) avatar.style.opacity = '1';
  }, 900);
}

function setSpeed(btn) {
  document.querySelectorAll('.sp-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ─── SCROLL TO TOP ─── */
window.addEventListener('scroll', () => {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  if (window.scrollY > 400) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}, { passive: true });

/* ─── FORM SUBMIT ─── */
function submitForm(btn) {
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    const s = document.getElementById('form-success');
    if (s) s.style.display = 'block';
    btn.textContent = '✓ Submitted!';
    btn.style.background = '#00C9A7';
  }, 800);
}

/* ─── SMOOTH SCROLL for nav anchors (already handled by CSS scroll-behavior) ─── */
/* ─── Staggered card fade-in on scroll ─── */
(function () {
  const targets = document.querySelectorAll(
    '.problem-card, .sol-card, .ind-card, .deploy-card, .road-card, .testi-card, .stat-card'
  );
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.animation = `fadein 0.5s ease ${(i % 6) * 0.07}s both`;
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => io.observe(t));
})();
