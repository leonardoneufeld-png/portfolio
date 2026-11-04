export const pickLang = (stored, navLangs = []) => {
  if (stored === 'en' || stored === 'de') return stored;
  return navLangs.some((l) => String(l).toLowerCase().startsWith('de')) ? 'de' : 'en';
};

export const t = (strings, key, lang) => {
  const e = strings[key];
  return e ? (lang === 'de' && e.de) || e.en : '';
};

// doc is injectable for tests; defaults to the global document at call time
export const applyLang = (root, strings, lang, doc = globalThis.document) => {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(strings, el.getAttribute('data-i18n'), lang);
  });
  root.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    el.setAttribute('alt', t(strings, el.getAttribute('data-i18n-alt'), lang));
  });
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(strings, el.getAttribute('data-i18n-aria'), lang));
  });
  if (doc) doc.documentElement.lang = lang;
};

export const createSafeStorage = (storage) => ({
  get(key) {
    try { return storage().getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { storage().setItem(key, value); } catch { /* blocked storage: session-only */ }
  },
});

// lazy lookup: accessing localStorage itself can throw (Safari private mode)
export const safeStorage = createSafeStorage(() => globalThis.localStorage);
