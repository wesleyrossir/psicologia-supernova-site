document.getElementById('year').textContent = new Date().getFullYear();

// Match the logo image width to the subtitle text width below it
function syncLogoWidth() {
  const logo = document.querySelector('.logo');
  const img = document.querySelector('.logo-img');
  const label = logo ? logo.querySelector('span') : null;
  if (!logo || !img || !label) return;
  const setWidth = () => { img.style.width = label.getBoundingClientRect().width + 'px'; };
  if (img.complete) setWidth(); else img.addEventListener('load', setWidth);
  window.addEventListener('resize', setWidth);
}
syncLogoWidth();

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
