/* ব্রাউজার ট্যাবের আইকন: পোর্টালে (অ্যাডমিন/টিচার/স্টুডেন্ট) সাদা ব্যাকগ্রাউন্ডে পার্পল আইকন; পাবলিক সাইটে আগের মতোই */
(function () {
  const MAP = { '32x32': 'img/favicon-portal-32.png', '64x64': 'img/favicon-portal-64.png', '180': 'img/favicon-portal-180.png' };
  const key = l => l.rel === 'apple-touch-icon' ? '180' : l.getAttribute('sizes');
  const upd = () => {
    const inPortal = /^#[ast]-/.test(location.hash), custom = window.SITE && SITE.data && SITE.data.brand && SITE.data.brand.favicon;
    document.querySelectorAll('link[rel="icon"],link[rel="apple-touch-icon"]').forEach(l => {
      if (!l.dataset.pfOrig) l.dataset.pfOrig = (l.dataset.orig || l.getAttribute('href'));
      const href = custom ? custom : (inPortal && MAP[key(l)] ? MAP[key(l)] : l.dataset.pfOrig);
      if (l.getAttribute('href') !== href) l.setAttribute('href', href);
    });
  };
  window.addEventListener('hashchange', upd); window.addEventListener('load', upd); upd();
  if (window.SITE && SITE.apply) { const ap = SITE.apply; SITE.apply = function () { const r = ap.apply(this, arguments); upd(); return r; }; }
})();
