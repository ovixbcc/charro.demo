/* পেমেন্ট গেটওয়ের নন-সিক্রেট সেটিংস (চালু/বন্ধ, ডিফল্ট, নাম) — সিক্রেট কী কখনও এখানে থাকে না, সেগুলো সার্ভারে (Vercel Environment Variables) */
(function () {
  const K = 'chaatro_pgw_v1', def = () => ({ eps: { on: false, def: true, bn: 'EPS — বিকাশ, নগদ, কার্ড ও ব্যাংক', en: 'EPS — bKash, Nagad, cards & banking' } });
  const load = () => { try { const s = JSON.parse(localStorage.getItem(K) || 'null'); return Object.assign(def(), s || {}); } catch (e) { return def(); } };
  window.PGW = { get: load, save: d => { try { localStorage.setItem(K, JSON.stringify(d)); } catch (e) {} }, epsOn: () => !!load().eps.on };
})();
