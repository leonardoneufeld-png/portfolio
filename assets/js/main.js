import { pickLang, applyLang, safeStorage, t } from './i18n.js';
import { STRINGS } from './strings.js';

const toggle = document.querySelector('.lang-toggle');
let lang = pickLang(safeStorage.get('lang'), navigator.languages || [navigator.language]);

const render = () => {
  applyLang(document, STRINGS, lang);
  // applyLang doesn't cover meta tags; <title> already goes through data-i18n
  document.querySelectorAll('[data-i18n-content]').forEach((m) => {
    m.setAttribute('content', t(STRINGS, m.getAttribute('data-i18n-content'), lang));
  });
  // the toggle means "German": pressed exactly while DE is active
  if (toggle) toggle.setAttribute('aria-pressed', String(lang === 'de'));
  document.querySelectorAll('[data-cv]').forEach((a) => {
    a.href = `assets/cv/leo-neufeld-cv-${lang}.pdf`;
    a.hreflang = lang;
  });
};

if (toggle) {
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    lang = lang === 'de' ? 'en' : 'de';
    safeStorage.set('lang', lang);
    render();
  });
}
render();

// fade-in on scroll; no-JS, no-IO and reduced-motion users get static, fully visible content
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const items = document.querySelectorAll('.reveal');
if (!reduce && 'IntersectionObserver' in window && items.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  // already on screen at load: show at once, so the first paint (and LCP) never waits on a fade
  items.forEach((el) => (el.getBoundingClientRect().top < innerHeight ? el.classList.add('is-in') : io.observe(el)));
  document.documentElement.classList.add('motion');
}
