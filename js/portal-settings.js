/* অ্যাডমিন: সেটিংসের ভেতরে প্রোগ্রাম, কুপন/প্রাইসিং, রেফারেল, স্টাফ ও অ্যাক্সেস, পলিসি, ডাটা এক্সপোর্ট ও ওয়েবসাইট সেটিংস */
(function () {
  'use strict';
  const PX = window.PX, { T } = PX;
  const MOVED = [['settings', 'সাধারণ ও পেমেন্ট', 'General & payments'], ['website', 'ওয়েবসাইট সেটিংস', 'Website settings'], ['gateway', 'পেমেন্ট গেটওয়ে (EPS)', 'Payment gateway (EPS)'], ['badges', 'ব্যাজ', 'Badges'], ['declog', 'সিদ্ধান্তের লগ', 'Decision log'], ['programs', 'প্রোগ্রাম ও কোর্স টাইপ', 'Programs & course types'], ['pricing', 'কুপন, রেফারেল ও প্রাইসিং', 'Coupons, referral & pricing'], ['referral', 'রেফারেল (স্টুডেন্ট ও টিচার)', 'Referral (students & teachers)'], ['staff', 'কর্মী ও অ্যাক্সেস', 'Staff & access'], ['policies', 'পলিসি', 'Policies'], ['export', 'ডাটা এক্সপোর্ট', 'Data export']];
  const keys = MOVED.map(m => m[0]);
  const prevNav = PX.nav.a;
  const kids = () => { const have = new Set(prevNav().map(x => x.k)); return MOVED.filter(m => have.has(m[0])); };
  PX.nav.a = () => {
    const l = prevNav(), k = l.filter(x => keys.includes(x.k)), rest = l.filter(x => !keys.includes(x.k));
    if (!k.length) return rest;
    const first = k.find(x => x.k === 'settings') || k[0];
    rest.push({ k: first.k, l: T('সেটিংস', 'Settings'), i: 'menu', also: keys.filter(x => x !== first.k), badge: '' });
    return rest;
  };
  const bar = cur => `<nav class="snav" aria-label="${T('সেটিংস', 'Settings')}">${kids().map(m => `<a href="#a-${m[0]}"${m[0] === cur ? ' aria-current="page"' : ''}>${T(m[1], m[2])}</a>`).join('')}</nav>`;
  keys.forEach(k => { const fn = PX.sec.a[k]; if (fn) PX.sec.a[k] = (...a) => bar(k) + fn(...a); });
})();
