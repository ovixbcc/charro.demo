/* লাইভ ক্লাস রিশিডিউল: টিচার বিকল্প শিডিউল পোস্ট করে → ক্লাসের সব স্টুডেন্টকে অনুমোদন করতে হয় → তবেই রিশিডিউল।
   একজন না মানলে ক্লাস আগের সময়েই থাকে। শুধু সুপার/একাডেমিক অ্যাডমিন সরাসরি রিশিডিউল করতে পারেন। */
(function () {
  'use strict';
  const PX = window.PX, { T, n, esc, fd, ic, TODAY, TEACH, COURSE } = PX, UI = PX.ui, DB = PX.DB, F = PX.FORMS, A = PX.ACT, L = CH.L;
  const ME = () => DB.me.id;
  PX.canResched = () => ['super', 'academic'].includes(PX.S.level);
  const need = r => { if (!r.need) r.need = PX.roster(r.cid).map(u => u.id); if (!r.votes) r.votes = {}; return r.need; };
  const apply = (r, alt, via) => {
    const s = PX.session(r.sid); r.status = 'approved'; r.chosen = alt; r.via = via;
    if (!r.curDate && s) { r.curDate = s.date; r.curTime = s.time; }
    if (s) { s.date = alt === 2 ? r.alt2Date : r.newDate; s.time = alt === 2 ? (r.alt2Time || r.newTime) : r.newTime; }
  };
  /* সবাই সাড়া দিলে সিদ্ধান্ত: সব স্টুডেন্টের মানা কোনো একটি বিকল্প থাকলে রিশিডিউল, নইলে বাতিল */
  const evalRq = r => {
    need(r); if (r.status !== 'pending' || !r.need.length || !r.need.every(id => r.votes[id])) return;
    const ok = [1].concat(r.alt2Date ? [2] : []).find(a => r.need.every(id => r.votes[id].includes(a)));
    if (ok) apply(r, ok, 'students'); else { r.status = 'rejected'; r.via = 'students'; }
  };
  PX.rqProg = (r, adm) => {
    const ids = need(r), got = ids.filter(id => r.votes[id]).length;
    if (r.status === 'pending') {
      const det = adm ? `<details><summary>${T('স্টুডেন্টদের সাড়া', 'Student responses')}</summary>${ids.map(id => { const u = DB.crm.find(x => x.id === id), v = r.votes[id]; return `<small>${esc(u ? u.name : id)}: ${v ? (v.length ? T('বিকল্প ' + v.join(', '), 'Alt ' + v.join(', ')) : T('কোনোটি নয়', 'None works')) : '…'}</small>`; }).join('<br>')}</details>` : '';
      return `<small>${n(got)}/${n(ids.length)} ${T('স্টুডেন্ট সাড়া দিয়েছেন', 'students responded')}</small>${det}`;
    }
    return r.via === 'students' ? `<small>${r.status === 'approved' ? T('সব স্টুডেন্ট অনুমোদন দিয়েছেন', 'Approved by all students') : T('সব স্টুডেন্ট রাজি হননি — ক্লাস আগের সময়েই', 'Not all students agreed — class unchanged')}</small>` : r.via === 'admin' ? `<small>${T('অ্যাডমিন সিদ্ধান্ত', 'Decided by admin')}</small>` : '';
  };
  const f0 = F.resched; F.resched = (f, d) => { const k = DB.resched.length; f0(f, d); if (DB.resched.length > k) need(DB.resched[DB.resched.length - 1]); };

  /* ===== স্টুডেন্ট ===== */
  const myRq = () => DB.resched.filter(r => r.status === 'pending' && need(r).includes(ME()) && !r.votes[ME()]);
  const rqCard = r => { const s = PX.session(r.sid) || {}, alts = [[1, r.newDate, r.newTime]].concat(r.alt2Date ? [[2, r.alt2Date, r.alt2Time || r.newTime]] : []);
    return `<div class="p2pc"><header><b>${esc(L(COURSE(r.cid).title))}</b><small>${esc(TEACH(r.tid).n.bn)}</small></header>
      <p>${T('বর্তমান ক্লাস', 'Current class')}: <b>${fd(r.curDate || s.date)} · ${esc(r.curTime || s.time || '')}</b></p><p class="soft">${T('কারণ', 'Reason')}: ${esc(r.reason)}</p>
      <form data-pf="rqvote" data-id="${r.id}" class="fgrid">${UI.checks('alt', alts.map(a => [String(a[0]), `${T('বিকল্প', 'Alt')} ${a[0]}: ${fd(a[1])} · ${a[2]}`]), [], T('যে সময়ে আসতে পারবেন তা টিক দিন', 'Tick the times you can attend'))}
      <div class="fld"><small class="hint">${T('কোনোটি না পারলে কিছু টিক না দিয়েই সাবমিট করুন। ক্লাসের সবাই রাজি হলে তবেই সময় বদলাবে; একজনও না মানলে ক্লাস আগের সময়েই থাকবে।', 'Submit with nothing ticked if none works. The class moves only if EVERY student agrees; if anyone declines it stays as is.')}</small><button class="btn btn-p">${T('সাড়া দিন', 'Submit response')}</button></div></form><p class="soft">${PX.rqProg(r)}</p></div>`; };
  F.rqvote = (f, d) => {
    const r = DB.resched.find(x => x.id === f.dataset.id); if (!r || r.status !== 'pending') return; need(r);
    r.votes[ME()] = (d.alt || []).map(Number); evalRq(r);
    PX.toast(r.status === 'approved' ? T('সবাই রাজি — ক্লাস রিশিডিউল হয়েছে', 'Everyone agreed — class rescheduled') : r.status === 'rejected' ? T('সবাই রাজি নয় — ক্লাস আগের সময়েই থাকছে', 'Not everyone agreed — the class stays') : T('আপনার সাড়া জমা হয়েছে', 'Your response is saved')); PX.refresh();
  };
  const sch = PX.sec.s.schedule; PX.sec.s.schedule = (...a) => { const l = myRq(); return (l.length ? UI.card(T('রিশিডিউলের অনুরোধ — আপনার অনুমোদন দরকার', 'Reschedule requests — your approval needed'), l.map(rqCard).join('')) : '') + sch(...a); };
  const home = PX.sec.s.home; PX.sec.s.home = (...a) => { const c = myRq().length, h = home(...a); return c ? `<div class="alert warn">${ic('calendar')}<div><b>${T(`${n(c)}টি ক্লাস রিশিডিউলের অনুরোধে আপনার অনুমোদন দরকার`, `${n(c)} class reschedule request(s) need your approval`)}</b><p><a class="lnk" href="#s-schedule">${T('দেখুন ও সাড়া দিন', 'Review and respond')}</a></p></div></div>` + h : h; };
  const navS = PX.nav.s; PX.nav.s = () => navS().map(x => x.k === 'schedule' && myRq().length ? Object.assign({}, x, { badge: n(myRq().length) }) : x);

  /* ===== অ্যাডমিন: টিচারের হয়ে সরাসরি রিশিডিউল ===== */
  const tm12 = t => { const [h, m] = (t || '00:00').split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
  PX.admReschedCard = () => {
    if (!PX.canResched()) return UI.card(T('সরাসরি রিশিডিউল', 'Direct reschedule'), `<p class="soft">${T('শুধু সুপার ও একাডেমিক অ্যাডমিন।', 'Super and Academic admins only.')}</p>`);
    const opts = [['', T('— ক্লাস বেছে নিন —', '— choose a class —')]];
    COURSES.forEach(c => { PX.sessions(c.id).filter(s => s.date >= TODAY && PX.sstate(s) !== 'cancelled').slice(0, 3).forEach(s => opts.push([s.id, `${L(c.title)} · ${s.date} · ${s.time}`])); });
    return UI.card(T('টিচারের হয়ে ক্লাস রিশিডিউল (সরাসরি)', 'Reschedule a class on the teacher’s behalf (direct)'), `<p class="soft">${T('এখানে স্টুডেন্টদের অনুমোদন লাগে না — তাই কারণ স্পষ্ট লিখুন। স্টুডেন্টরা নতুন সময় দেখবে।', 'No student approval is needed here, so state the reason clearly. Students will see the new time.')}</p><form data-pf="admresched" class="fgrid">${UI.fi({ name: 'sid', label: T('ক্লাস', 'Class'), opts, req: 1 })}${UI.fi({ name: 'newDate', label: T('নতুন তারিখ', 'New date'), type: 'date', min: TODAY, req: 1, half: 1 })}${UI.fi({ name: 'newTime', label: T('নতুন সময়', 'New time'), type: 'time', req: 1, half: 1 })}${UI.fi({ name: 'reason', label: T('কারণ', 'Reason'), rows: 2, req: 1 })}<div class="fld"><small class="err" id="ar-err" role="alert"></small><button class="btn btn-p">${T('রিশিডিউল করুন', 'Reschedule now')}</button></div></form>`);
  };
  F.admresched = (f, d) => {
    if (!PX.canResched()) return; const er = f.querySelector('#ar-err'), bad = m => { er.textContent = m; }, s = d.sid && PX.session(d.sid); if (!s) return bad(T('ক্লাস বেছে নিন', 'Choose a class'));
    const tm = tm12(d.newTime), tid = COURSE(s.cid).teacher;
    if (!d.newDate || d.newDate < TODAY) return bad(T('আজ বা পরের তারিখ দিন', 'Pick today or a later date'));
    if (d.newDate === s.date && tm === String(s.time).trim()) return bad(T('বর্তমান সময়ের মতোই', 'Same as the current time'));
    if (COURSES.filter(c => c.teacher === tid).some(c => PX.sessions(c.id).some(x => x.id !== s.id && x.date === d.newDate && String(x.time).trim() === tm && PX.sstate(x) !== 'cancelled'))) return bad(T('ওই সময়ে টিচারের আরেকটি ক্লাস আছে', 'The teacher already has a class then'));
    if (!(d.reason || '').trim()) return bad(T('কারণ লিখুন', 'Enter a reason'));
    DB.resched.push({ id: 'rq' + (DB.resched.length + 1), sid: s.id, cid: s.cid, tid, curDate: s.date, curTime: s.time, newDate: d.newDate, newTime: tm, alt2Date: '', alt2Time: '', reason: d.reason.trim(), status: 'approved', chosen: 1, via: 'admin', date: TODAY });
    s.date = d.newDate; s.time = tm; PX.toast(T('ক্লাস রিশিডিউল হয়েছে', 'Class rescheduled')); PX.refresh();
  };
})();
