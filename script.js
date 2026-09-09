const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Cookie consent — gates Meta Pixel init/track (GDPR: EU/PT/ES traffic)
const PIXEL_ID = '1540166894464352';
const CONSENT_KEY = 'sn_cookie_consent';

function initPixel() {
  if (typeof fbq !== 'function') return;
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');
}

function showCookieBanner() {
  if (document.getElementById('cookieBanner')) return;
  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p>Usamos cookies para melhorar sua experiência e medir o desempenho de campanhas. Você pode aceitar ou recusar cookies não essenciais. <a href="/privacidade.html">Saiba mais</a>.</p>
    <div class="cookie-actions">
      <button type="button" class="btn btn-outline btn-sm" id="cookieDecline">Recusar</button>
      <button type="button" class="btn btn-primary btn-sm" id="cookieAccept">Aceitar</button>
    </div>`;
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add('visible'));

  document.getElementById('cookieAccept').addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    initPixel();
    hideCookieBanner();
  });
  document.getElementById('cookieDecline').addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    hideCookieBanner();
  });
}

function hideCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  banner.classList.remove('visible');
  setTimeout(() => banner.remove(), 300);
}

(function initCookieConsent() {
  let consent;
  try { consent = localStorage.getItem(CONSENT_KEY); } catch (e) { consent = null; }
  if (consent === 'granted') initPixel();
  else if (consent !== 'denied') showCookieBanner();
})();

// Footer link to reopen cookie preferences
document.querySelectorAll('[data-cookie-settings]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showCookieBanner();
  });
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// Testimonial carousel
(function () {
  const track = document.getElementById('testiTrack');
  const prev = document.getElementById('testiPrev');
  const next = document.getElementById('testiNext');
  const dotsWrap = document.getElementById('testiDots');
  if (!track || !prev || !next || !dotsWrap) return;

  const cards = Array.from(track.children);
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Ir para depoimento ' + (i + 1));
    dot.addEventListener('click', () => cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' }));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function cardsPerView() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    return Math.max(1, Math.round(track.getBoundingClientRect().width / cardWidth));
  }

  function scrollByCards(dir) {
    const amount = cards[0].getBoundingClientRect().width + 20; // gap
    track.scrollBy({ left: dir * amount * cardsPerView(), behavior: 'smooth' });
  }

  prev.addEventListener('click', () => scrollByCards(-1));
  next.addEventListener('click', () => scrollByCards(1));

  track.addEventListener('scroll', () => {
    const index = Math.round(track.scrollLeft / (cards[0].getBoundingClientRect().width + 20));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  });
})();

// Meta Pixel: track WhatsApp CTA clicks as Contact events
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
  link.addEventListener('click', () => {
    if (typeof fbq === 'function') fbq('track', 'Contact');
  });
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    const open = links.style.display === 'flex';
    links.style.display = open ? 'none' : 'flex';
    links.style.cssText = open ? '' : 'display:flex;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:#FBF9F5;padding:20px 28px;gap:16px;border-bottom:1px solid #E4DDCF;';
  });
}
