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

  const view = PX.view;
  PX.view = function (role, sec, arg) {
    apply();
    if (A.user && role && role !== 's') {
      return `<div class="card" style="max-width:560px;margin:48px auto;padding:24px"><h3>${T('এই পোর্টালে প্রবেশাধিকার নেই', 'No access to this portal')}</h3><p>${T('আপনি Google অ্যাকাউন্ট দিয়ে লগইন করেছেন — এটি শুধু শিক্ষার্থী পোর্টালের জন্য।', 'You are signed in with Google — this account can only use the student portal.')}</p><p><a class="btn btn-p" href="#s-home">${T('শিক্ষার্থী পোর্টাল', 'Student portal')}</a></p></div>`;
    }
    return view.apply(this, arguments);
  };
})();
