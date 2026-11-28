/* Real (Supabase) session -> student portal identity.
   Rules: a Google user is a STUDENT only. Teacher / admin / institution portals are never opened from
   client-side data for a real-session user; those stay demo logins until server-side roles exist. */
(function () {
  'use strict';
  const A = window.CHAUTH; if (!A || !window.PX) return;
  const T = (b, e) => (window.CH && CH.lang() === 'bn' ? b : e);
  const me = () => (PX.DB && PX.DB.me) || null;
  let demo = null;

  const apply = () => {
    const m = me(); if (!m) return;
    if (!demo) demo = { name: m.name, email: m.email, phone: m.phone, district: m.district, sid: m.sid };
    if (A.user) { blank(); m.name = A.user.name || A.user.email; m.email = A.user.email; m.phone = ''; m.district = ''; m.realId = A.user.id; }
    else if (demo) { Object.assign(m, demo); delete m.realId; }
  };
  /* A real student starts with an EMPTY dashboard: no sample enrolments, payments, tickets, notices, referrals or chats. */
  let blanked = false;
  const blank = () => {
    const D = PX.DB; if (blanked || !D) return; blanked = true;
    ['enr', 'refS', 'free', 'freeIn', 'announcements', 'resched', 'posts', 'reviews'].forEach(k => { if (Array.isArray(D[k])) D[k].length = 0; });
    for (let i = D.pays.length - 1; i >= 0; i--) if (D.pays[i].sid === 'u1') D.pays.splice(i, 1);
    if (Array.isArray(D.tickets)) D.tickets = D.tickets.filter(t => t.uid !== 'u1');
    if (Array.isArray(D.p2p)) for (let i = D.p2p.length - 1; i >= 0; i--) if (D.p2p[i].sid === 'u1') D.p2p.splice(i, 1);
    D.dm = {}; PX.dm = tid => D.dm[tid] || (D.dm[tid] = []);
    const m = D.me; Object.assign(m, { courses: [], notes: [], ref: '', level: '', sid: '', guardian: { name: '', phone: '' }, joined: new Date().toISOString().slice(0, 10) });
  };
  apply();
  window.addEventListener('chauth', () => { apply(); });

  /* Build "My courses" + "Payment history" from the student's real PAID orders (Supabase orders table). */
  let synced = '', syncing = false, tries = 0, loaded = false;
  setTimeout(() => { if (!loaded) { loaded = true; if (PX.refresh && /^#s-/.test(location.hash)) PX.refresh(); } }, 6000);   /* never hang on the loading card */
  const addMonths = (d, m) => { const x = new Date(d + 'T00:00:00Z'); x.setUTCMonth(x.getUTCMonth() + m); return x.toISOString().slice(0, 10); };
  /* a paid bundle order (orders.cid = bundle id) enrols the student in every course of that bundle, paid in full */
  const addBundle = (D, r) => {
    const b = BUNDLES.find(x => x.id === r.cid); if (!b) return;
    const cs = b.courses.map(id => COURSES.find(c => c.id === id)).filter(Boolean); if (!cs.length) return;
    const date = String(r.created_at || '').slice(0, 10) || new Date().toISOString().slice(0, 10);
    cs.forEach(c => {
      let e = D.enr.find(x => x.cid === c.id);
      if (!e) { e = { id: 'e' + (D.enr.length + 1), cid: c.id, fmt: c.formats[0], paid: 0 }; D.enr.push(e); }
      Object.assign(e, { plan: 'full', m: 0, per: 0, cycles: 1, nextDue: null, state: 'active' }); e.paid++;
    });
    D.pays.unshift({ id: 'p' + D.nextPid++, sid: 'u1', cid: cs[0].id, bundle: b.id, title: b.title, amount: Number(r.amount), ch: 'EPS', status: 'confirmed', date, note: 'EPS ' + r.txn, txn: r.txn });
  };
  const sync = async () => {
    const D = PX.DB; if (!A.user || A.provisional || !D || syncing) return; syncing = true;
    try {
      const rows = await A.orders(); const key = A.user.id + ':' + rows.map(r => r.txn).join(',');
      if (key === synced) return; synced = key;
      D.enr.length = 0; for (let i = D.pays.length - 1; i >= 0; i--) if (D.pays[i].sid === 'u1') D.pays.splice(i, 1);
      rows.forEach(r => {
        if (r.kind === 'bundle') { addBundle(D, r); return; }
        const cid = r.cid; if (!cid || !(r.kind === 'course' || r.kind === 'sub') || !COURSES.some(c => c.id === cid)) return;
        const date = String(r.created_at || '').slice(0, 10) || new Date().toISOString().slice(0, 10);
        let e = D.enr.find(x => x.cid === cid);
        if (!e) { const m = window.CHEPS ? CHEPS.planM(cid, r.fmt, r.plan) : (r.plan === 'full' ? 0 : 1); e = { id: 'e' + (D.enr.length + 1), cid, fmt: r.fmt || 'group', plan: r.plan || 'full', m, per: Number(r.amount), cycles: m ? 12 : 1, paid: 0, nextDue: m ? date : null, state: 'active' }; D.enr.push(e); }
        e.paid++; if (e.m > 0) e.nextDue = addMonths(e.nextDue || date, e.m);
        D.pays.unshift({ id: 'p' + D.nextPid++, sid: 'u1', cid, amount: Number(r.amount), ch: 'EPS', status: 'confirmed', date, note: 'EPS ' + r.txn, txn: r.txn });
      });
      if (/^#s-/.test(location.hash) && PX.refresh) PX.refresh();
      if (!rows.length && tries < 3) { tries++; synced = ''; setTimeout(sync, tries * 2500); }   /* first query can run before the new session is attached: try again */
    } finally { syncing = false; if (!loaded) { loaded = true; if (/^#s-/.test(location.hash) && PX.refresh) PX.refresh(); } }
  };
  window.addEventListener('chauth', () => { if (A.user) sync(); });
  if (A.ready) A.ready.then(() => { if (A.user) sync(); });
  window.addEventListener('hashchange', () => { if (A.user && /^#eps-return|^#s-/.test(location.hash)) sync(); });

  /* Class schedule, attendance, notices, quizzes and chats are still sample data generated per course. A real student must not see them:
     they stay empty until a teacher really publishes them. */
  ['sessions', 'posts', 'quizzesOf'].forEach(k => { const f0 = PX[k]; if (typeof f0 === 'function') PX[k] = function () { return A.user ? [] : f0.apply(this, arguments); }; });
  const chat0 = PX.chat; if (typeof chat0 === 'function') PX.chat = function () { return A.user ? [] : chat0.apply(this, arguments); };
  const attOf0 = PX.attOf; if (typeof attOf0 === 'function') PX.attOf = function () { return A.user ? false : attOf0.apply(this, arguments); };

  const view = PX.view;
  PX.view = function (role, sec, arg) {
    apply();
    if (A.user && role === 's' && !loaded) return `<div class="card" style="max-width:560px;margin:48px auto;padding:24px;text-align:center">${T('আপনার কোর্স লোড হচ্ছে…', 'Loading your courses…')}</div>`;
    if (A.user && role && role !== 's') {
      return `<div class="card" style="max-width:560px;margin:48px auto;padding:24px"><h3>${T('এই পোর্টালে প্রবেশাধিকার নেই', 'No access to this portal')}</h3><p>${T('আপনি Google অ্যাকাউন্ট দিয়ে লগইন করেছেন — এটি শুধু শিক্ষার্থী পোর্টালের জন্য।', 'You are signed in with Google — this account can only use the student portal.')}</p><p><a class="btn btn-p" href="#s-home">${T('শিক্ষার্থী পোর্টাল', 'Student portal')}</a></p></div>`;
    }
    let h = view.apply(this, arguments);
    if (A.user && role === 's' && PX.DB.enr.length && ['home', 'schedule', 'notices', 'attendance', 'messages'].includes(sec || 'home')) {
      const note = `<div class="alert warn"><div><b>${T('ক্লাসের সময়সূচি এখনও প্রকাশিত হয়নি', 'Your class schedule is not published yet')}</b><p>${T('টিচার ক্লাস, নোটিশ ও কুইজ প্রকাশ করলে এখানে দেখা যাবে।', 'Classes, notices and quizzes will appear here once your teacher publishes them.')}</p></div></div>`;
      h = h.replace(/(<div class="pt-body"[^>]*>|<main[^>]*class="pt-main"[^>]*>)/, '$1' + note);
    }
    return h;
  };
})();
