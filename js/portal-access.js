/* অ্যাডমিন অ্যাক্সেস কন্ট্রোল: সেগমেন্ট অনুযায়ী ভাগ, রিড ও রাইট আলাদা (০ = নেই, ১ = শুধু রিড, ২ = রিড ও রাইট) */
(function () {
  'use strict';
  const PX = window.PX, { T, n, esc, ic } = PX, UI = PX.ui, DB = PX.DB;
  const SEGS = [
    { k: 'people', bn: 'টিচার, কোর্স ও কনটেন্ট', en: 'Teachers, courses & content', mods: [['applications', 'টিচার আবেদন', 'Teacher applications'], ['teachers', 'টিচার CRM', 'Teachers CRM'], ['courses', 'কোর্স ও বান্ডেল', 'Courses & bundles'], ['schedule', 'শিডিউল অনুরোধ', 'Schedule requests'], ['content', 'কনটেন্ট ও ঘোষণা', 'Content & banners'], ['reviews', 'রিভিউ', 'Reviews'], ['policies', 'পলিসি', 'Policies']] },
    { k: 'learners', bn: 'স্টুডেন্ট ও সাপোর্ট', en: 'Students & support', mods: [['students', 'স্টুডেন্ট CRM', 'Students CRM'], ['subs', 'সাবস্ক্রিপশন', 'Subscriptions'], ['support', 'সাপোর্ট টিকিট', 'Support tickets']] },
    { k: 'money', bn: 'অর্থ ও মূল্য', en: 'Finance & pricing', mods: [['payments', 'পেমেন্ট', 'Payments'], ['payouts', 'পেআউট ও আয়', 'Payouts & earnings'], ['pricing', 'কুপন, রেফারেল ও প্রাইসিং', 'Coupons, referral & pricing']] },
    { k: 'admin', bn: 'প্রশাসন', en: 'Administration', mods: [['staff', 'কর্মী ও অ্যাক্সেস', 'Staff & access'], ['settings', 'সেটিংস', 'Settings']] },
  ];
  const ALL = SEGS.flatMap(s => s.mods.map(m => m[0]));
  const LV = { none: 0, read: 1, write: 2 };
  const setL = (k, o) => { const p = {}; ALL.forEach(m => { p[m] = o[m] || 0; }); DB.levels[k].perms = p; };
  const all2 = () => { const o = {}; ALL.forEach(m => { o[m] = 2; }); return o; };
  setL('super', all2());
  setL('accounts', { students: 1, payments: 2, payouts: 2, subs: 2, support: 1, pricing: 1 });
  setL('academic', { applications: 2, teachers: 2, courses: 2, students: 1, schedule: 2, support: 2, reviews: 2, content: 1 });
  setL('dev', { content: 2, pricing: 1, policies: 2, settings: 2 });

  const PERM_OF = { home: null, profile: null, newcourse: 'courses', bundles: 'courses', referral: 'pricing' };
  const permKey = sec => sec in PERM_OF ? PERM_OF[sec] : sec;
  const lvl = k => (k ? (DB.levels[PX.S.level].perms[k] || 0) : 2);
  const curSec = () => { const m = location.hash.match(/^#a-([a-z0-9]+)/); return m ? m[1] : null; };
  const lab = v => v === 2 ? T('রিড ও রাইট', 'Read & write') : v === 1 ? T('শুধু রিড', 'Read only') : T('নেই', 'No access');
  const sel = (v, attrs, off) => `<select ${attrs} ${off ? 'disabled' : ''} aria-label="${T('অ্যাক্সেস', 'Access')}">${[[0, T('নেই', 'None')], [1, T('রিড', 'Read')], [2, T('রিড + রাইট', 'Read + Write')]].map(o => `<option value="${o[0]}" ${o[0] === v ? 'selected' : ''}>${o[1]}</option>`).join('')}</select>`;

  PX.accessUI = () => {
    const ks = Object.keys(DB.levels), head = `<thead><tr><th></th>${ks.map(k => `<th>${esc(DB.levels[k].label)}</th>`).join('')}</tr></thead>`;
    const intro = UI.card(T('অ্যাক্সেস কন্ট্রোল', 'Access control'), `<p>${T('প্রতিটি লেভেলের জন্য প্রতিটি মডিউলে আলাদাভাবে ঠিক করুন: কিছুই দেখবে না, শুধু দেখবে (রিড), অথবা দেখবে ও বদলাতে পারবে (রিড + রাইট)।', 'For each level and module choose: no access, read only, or read + write.')}</p>
      <div class="acc-key">${UI.chip(T('নেই', 'None'), '')} ${UI.chip(T('রিড: দেখা যাবে, বদলানো যাবে না', 'Read: view only'), 'warn')} ${UI.chip(T('রিড + রাইট: দেখা ও বদলানো', 'Read + Write: view and change'), 'ok')}</div>
      <p class="soft">${T('সুপার অ্যাডমিনের সব মডিউলে সবসময় রিড + রাইট, এটা বদলানো যায় না। উপরের বারের “অ্যাক্সেস লেভেল (ডেমো)” বদলে কোন লেভেলে কী দেখা ও করা যায় যাচাই করুন।', 'Super admin always has read + write everywhere. Use the demo access level in the top bar to test a level.')}</p>`);
    const segs = SEGS.map(s => UI.card(T(s.bn, s.en), `<div class="tbl-w"><table class="ptbl mx acc">${head}<tbody>
      <tr class="seg-all"><td><b>${T('এই সেগমেন্টের সবকিছু', 'Whole segment')}</b></td>${ks.map(k => k === 'super' ? `<td>${UI.chip(lab(2), 'ok')}</td>` : `<td><select data-pc="permseg" data-k="${k}" data-seg="${s.k}" aria-label="${T('সবকিছু', 'All')}"><option value="">${T('একসাথে সেট…', 'Set all…')}</option><option value="0">${T('নেই', 'None')}</option><option value="1">${T('রিড', 'Read')}</option><option value="2">${T('রিড + রাইট', 'Read + Write')}</option></select></td>`).join('')}</tr>
      ${s.mods.map(m => `<tr><td>${T(m[1], m[2])}</td>${ks.map(k => k === 'super' ? `<td>${UI.chip(lab(2), 'ok')}</td>` : `<td>${sel(DB.levels[k].perms[m[0]] || 0, `data-pc="perm2" data-k="${k}" data-p="${m[0]}"`)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`)).join('');
    return intro + segs;
  };
  PX.CHG.perm2 = el => { if (el.dataset.k === 'super') return; DB.levels[el.dataset.k].perms[el.dataset.p] = +el.value; PX.toast(T('অ্যাক্সেস হালনাগাদ হয়েছে', 'Access updated')); PX.refresh(); };
  PX.CHG.permseg = el => {
    if (el.value === '' || el.dataset.k === 'super') return;
    SEGS.find(s => s.k === el.dataset.seg).mods.forEach(m => { DB.levels[el.dataset.k].perms[m[0]] = +el.value; });
    PX.toast(T('সেগমেন্টের অ্যাক্সেস হালনাগাদ হয়েছে', 'Segment access updated')); PX.refresh();
  };

  /* রিড-অনলি ব্যানার ও মেনুতে চিহ্ন */
  Object.keys(PX.sec.a).forEach(sec => {
    const k = permKey(sec), fn = PX.sec.a[sec]; if (!k) return;
    PX.sec.a[sec] = (...a) => { const h = fn(...a); return lvl(k) === 1 ? `<div class="alert warn ro-b">${ic('shield')}<div><b>${T('রিড-অনলি অ্যাক্সেস', 'Read-only access')}</b><p>${T('আপনি এই অংশটি দেখতে পারবেন, কিন্তু কিছু বদলাতে পারবেন না।', 'You can view this section but not change anything.')}</p></div></div>` + h : h; };
  });
  const navA = PX.nav.a;
  PX.nav.a = () => navA().map(x => { const k = permKey(x.k); return k && lvl(k) === 1 ? Object.assign({}, x, { l: x.l + ' · ' + T('রিড', 'read') }) : x; });

  /* রাইট আটকানো: রিড-অনলি লেভেলে বদলানোর কাজগুলো চলবে না */
  const ACTW = { ban: 'teachers', coff: 'courses', con: 'courses', bdtoggle: 'courses', bddel: 'courses', stublock: 'students', payok: 'payments', paynout: 'payouts', refpay: 'pricing', remind: 'subs', subtoggle: 'subs', rqok: 'schedule', rqno: 'schedule', antog: 'content', andel: 'content', poldel: 'policies', emtog: 'staff', tkclose: 'support', cptoggle: 'pricing' };
  const FRMW = { apdec: 'applications', cdec: 'courses', bundle: 'courses', enroll: 'students', stunote: 'students', newstu: 'students', manpay: 'payments', manpayout: 'payouts', ann: 'content', feat: 'content', coupon: 'pricing', refcfg: 'pricing', pol: 'policies', emp: 'staff', setf: 'settings', tkreply: 'support' };
  const CHGW = { share: 'teachers', perm2: 'staff', permseg: 'staff' };
  const deny = () => PX.toast(T('রিড-অনলি অ্যাক্সেস: এই কাজের অনুমতি নেই', 'Read-only access: you cannot make this change'));
  const wrap = (store, map) => Object.keys(map).forEach(name => {
    const fn = store[name]; if (!fn) return;
    store[name] = function () { if (/^#a-/.test(location.hash) && lvl(map[name]) < 2) { deny(); return; } return fn.apply(this, arguments); };
  });
  wrap(PX.ACT, ACTW); wrap(PX.FORMS, FRMW); wrap(PX.CHG, CHGW);
  PX.canWrite = k => lvl(k) >= 2;
})();
