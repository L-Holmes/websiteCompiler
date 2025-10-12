// Minimal approach: no `declare global` to avoid augmentation restrictions.
// We cast to `any` when assigning to window so inline onclick can call the functions.

const PARAM_BIG = 'big_text';
const PARAM_DYS = 'dyslexia_font';
const PARAM_LANG = 'lang';

function getParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

function setParam(key: string, on: boolean) {
  const params = getParams();
  if (on) params.set(key, '1');
  else params.delete(key);
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}${window.location.hash}`;
	console.log(`new url: ${newUrl}`);
  window.history.replaceState({}, '', newUrl);
}

function paramsHas(key: string): boolean {
  return getParams().get(key) === '1';
}

function applySettingsFromParams() {
  console.log("--> Called toggle dyslexia font");
  const big = paramsHas(PARAM_BIG);
  const dys = paramsHas(PARAM_DYS);

  if (big) document.documentElement.classList.add('big-font');
  else document.documentElement.classList.remove('big-font');

  if (dys) document.body.classList.add('font-dyslexia');
  else document.body.classList.remove('font-dyslexia');
}

function appendParamsToInternalLinks() {
  console.log("--> Called applying params to internal links");
  const params = getParams();
  if (![...params].length) return;

  const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href]');
  anchors.forEach(a => {
    try {
      const href = a.getAttribute('href') ?? '';
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      // Absolute same-origin
      if (/^(https?:)?\/\//i.test(href)) {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        const up = new URL(url.toString());
        params.forEach((v, k) => up.searchParams.set(k, v));
        a.href = up.toString();
        return;
      }

      // Relative link
      const base = window.location.origin;
      const url = new URL(href, base + window.location.pathname);
      params.forEach((v, k) => url.searchParams.set(k, v));
      // keep relative-ish form
      a.href = url.pathname + url.search + url.hash;
    } catch (_) { /* ignore malformed */ }
  });
}

function applyLanguagePrefixToLinks() {
  const currentLang = getCurrentLanguage();
  if (!currentLang) return;
  
  console.log(`--> Applying language prefix: ${currentLang}`);
  
  const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href]');
  anchors.forEach(a => {
    try {
      const href = a.getAttribute('href') ?? '';
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      
      // Check if it's a relative link to an HTML file
      if (!/^(https?:)?\/\//i.test(href) && href.match(/\.html?$/i)) {
        const filename = href.substring(href.lastIndexOf('/') + 1);
        // If it doesn't already have a language prefix, add it
        if (!filename.match(/^[a-z]{2}-/)) {
          const newHref = href.replace(filename, `${currentLang}-${filename}`);
          a.href = newHref;
        }
      }
    } catch (_) { /* ignore malformed */ }
  });
}


function getCurrentLanguage(): string | null {
  // Extract language from filename (e.g., 'en-index.html' -> 'en')
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1);
  const match = filename.match(/^([a-z]{2})-/);
  return match ? match[1] : null;
}

function toggleBigFont() {
  console.log("==> Called toggle big font");
  const isBig = document.documentElement.classList.toggle('big-font');
  setParam(PARAM_BIG, isBig);
  appendParamsToInternalLinks();
	applyLanguagePrefixToLinks();
}

function toggleDyslexiaFont() {
  console.log("==> Called toggle dyslexia font");
  const isOn = document.body.classList.toggle('font-dyslexia');
  setParam(PARAM_DYS, isOn);
  appendParamsToInternalLinks();
	applyLanguagePrefixToLinks();
}


// Make functions available for inline onclick handlers
;(window as any).toggleBigFont = toggleBigFont;
;(window as any).toggleDyslexiaFont = toggleDyslexiaFont;



document.addEventListener('DOMContentLoaded', () => {
  applySettingsFromParams();
  appendParamsToInternalLinks();

  // this must be last
  applyLanguagePrefixToLinks();  
});



