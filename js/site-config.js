/* পাবলিক ওয়েবসাইটের সেটিংস: লোগো, ব্যানার, মেনু, লেখা, রং। অ্যাডমিন "Website settings" থেকে বদলানো যায়।
   ডেমোতে ব্রাউজারে (localStorage) জমা থাকে; আসল সিস্টেমে এই একই কাঠামো ব্যাকএন্ড/ডেটাবেজ থেকে আসবে। */
(function () {
  const KEY = 'chaatro_site_v1';
  const def = () => ({ brand: { name: '', logo: '', logoFooter: '', favicon: '', color: '', copyright: '' }, bar: { on: false, text: { bn: '', en: '' }, link: '', bg: '#8C52FF' }, slides: {}, nav: { hidden: {} }, texts: { bn: {}, en: {} } });
  let S = def();
  try { const raw = localStorage.getItem(KEY); if (raw) { const o = JSON.parse(raw); S = Object.assign(def(), o, { brand: Object.assign(def().brand, o.brand), bar: Object.assign(def().bar, o.bar), nav: Object.assign(def().nav, o.nav), texts: Object.assign(def().texts, o.texts) }); } } catch (e) { /* ignore */ }
  const mix = (hex, to, a) => { const h = hex.replace('#', ''), n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16), r = [n >> 16 & 255, n >> 8 & 255, n & 255].map(v => Math.round(v + (to - v) * a)); return '#' + r.map(v => v.toString(16).padStart(2, '0')).join(''); };
  const SITE = window.SITE = {
    data: S,
    save() { try { localStorage.setItem(KEY, JSON.stringify(S)); return true; } catch (e) { return false; } },
    reset() { S = def(); SITE.data = S; try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } SITE.apply(); },
    replace(o) { S = Object.assign(def(), o); SITE.data = S; SITE.save(); SITE.apply(); },
    /* রং, ফেভিকন ও ট্যাব-টাইটেল প্রয়োগ */
    apply() {
      const r = document.documentElement.style, c = S.brand.color;
      if (/^#[0-9a-f]{6}$/i.test(c || '')) { r.setProperty('--p', c); r.setProperty('--pd', mix(c, 0, .28)); r.setProperty('--pl', mix(c, 255, .9)); r.setProperty('--pxl', mix(c, 255, .96)); } else ['--p', '--pd', '--pl', '--pxl'].forEach(k => r.removeProperty(k));
      document.querySelectorAll('link[rel="icon"]').forEach(l => { if (!l.dataset.orig) l.dataset.orig = l.getAttribute('href'); l.setAttribute('href', S.brand.favicon || l.dataset.orig); });
    },
  };
  SITE.apply();
})();
