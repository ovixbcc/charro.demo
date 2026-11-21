/* অ্যাডমিন প্যানেল */
(function () {
  'use strict';
  const PX = window.PX, { T, n, mny, esc, fd, ic, COURSE, TEACH, TODAY } = PX, DB = PX.DB, UI = PX.ui, L = CH.L, S = PX.sec.a;
  const bn = o => esc(L(o));
  const A = PX.ACT, F = PX.FORMS;
  const stu = id => DB.crm.find(u => u.id === id);
  const perms = () => DB.levels[PX.S.level].perms;
  const NAV = [
    ['home', 'ড্যাশবোর্ড', 'Dashboard', 'home', null],
    ['applications', 'টিচার আবেদন', 'Teacher applications', 'file', 'applications'],
    ['teachers', 'টিচার CRM', 'Teachers CRM', 'users', 'teachers'],
    ['courses', 'কোর্স অনুমোদন', 'Courses', 'book', 'courses'],
    ['students', 'স্টুডেন্ট CRM', 'Students CRM', 'user', 'students'],
    ['payments', 'পেমেন্ট', 'Payments', 'award', 'payments'],
    ['payouts', 'পেআউট ও আয়', 'Payouts & earnings', 'award', 'payouts'],
    ['subs', 'সাবস্ক্রিপশন', 'Subscriptions', 'repeat', 'subs'],
    ['schedule', 'শিডিউল অনুরোধ', 'Schedule requests', 'calendar', 'schedule'],
    ['content', 'কনটেন্ট ও ঘোষণা', 'Content & banners', 'chat', 'content'],
    ['pricing', 'কুপন, রেফারেল ও প্রাইসিং', 'Coupons, referral, pricing', 'plus', 'pricing'],
    ['reviews', 'রিভিউ', 'Reviews', 'check', 'reviews'],
    ['support', 'সাপোর্ট', 'Support', 'phone', 'support'],
    ['policies', 'পলিসি ম্যানেজার', 'Policies', 'shield', 'policies'],
    ['staff', 'কর্মী ও অ্যাক্সেস', 'Staff & access', 'users', 'staff'],
    ['settings', 'সেটিংস', 'Settings', 'menu', 'settings'],
  ];
  const ALSO = { courses: ['newcourse'] };
  const badge = {
    applications: () => DB.apps.filter(a => a.status === 'pending').length,
    courses: () => DB.newCourses.filter(c => c.status === 'review').length,
    schedule: () => DB.resched.filter(r => r.status === 'pending').length,
    payments: () => DB.pays.filter(p => p.status === 'pending').length,
    support: () => DB.tickets.filter(t => t.status === 'open').length,
  };
  PX.nav.a = () => NAV.filter(x => !x[4] || perms()[x[4]]).map(x => ({ k: x[0], l: T(x[1], x[2]), i: x[3], also: ALSO[x[0]] || [], badge: badge[x[0]] && badge[x[0]]() ? n(badge[x[0]]()) : '' }));
  // অ্যাক্সেস গার্ড
  Object.keys(S).length;
  const guard = (k, fn) => (...a) => (!k || perms()[k] ? fn(...a) : UI.card('', `<div class="alert bad">${ic('shield')}<div><b>${T('এই লেভেলে অ্যাক্সেস নেই', 'No access at this level')}</b><p>${T('সুপার অ্যাডমিনের কাছ থেকে অনুমতি নিন।', 'Ask a super admin for permission.')}</p></div></div>`));
  const def = {};

  /* ---------- ড্যাশবোর্ড ---------- */
  def.home = [null, () => {
    const conf = DB.pays.filter(p => p.status === 'confirmed'), rev = conf.reduce((a, p) => a + p.amount, 0), sh = DB.settings.share;
    const pend = DB.pays.filter(p => p.status === 'pending').length;
    return UI.announcements('all') + `<div class="kpis">${UI.kpi(T('মোট কালেকশন', 'Gross revenue'), mny(rev), T('নিশ্চিত পেমেন্ট', 'confirmed'), 'ok')}${UI.kpi(T('কোম্পানির শেয়ার', 'Company share'), mny(Math.round(rev * sh / 100)), n(sh) + '%')}${UI.kpi(T('স্টুডেন্ট', 'Students'), n(DB.crm.length))}${UI.kpi(T('লাইভ কোর্স', 'Live courses'), n(COURSES.length))}${UI.kpi(T('টিচার', 'Teachers'), n(TEACHERS.length + DB.apps.filter(a => a.status === 'approved').length))}</div>` +
      `<div class="g2">${UI.card(T('অপেক্ষমাণ কাজ', 'Pending work'), [[T('টিচার আবেদন', 'Applications'), DB.apps.filter(a => a.status === 'pending').length, 'applications'], [T('কোর্স অনুমোদন', 'Course approvals'), DB.newCourses.filter(c => c.status === 'review').length, 'courses'], [T('শিডিউল অনুরোধ', 'Schedule requests'), DB.resched.filter(r => r.status === 'pending').length, 'schedule'], [T('ক্যাশ পেমেন্ট নিশ্চিতকরণ', 'Cash confirmations'), pend, 'payments'], [T('খোলা টিকিট', 'Open tickets'), DB.tickets.filter(t => t.status === 'open').length, 'support']].map(r => `<div class="row-i"><div><b>${r[0]}</b></div><div>${UI.chip(n(r[1]), r[1] ? 'warn' : 'ok')} <a class="btn btn-o btn-sm" href="#a-${r[2]}">${T('খুলুন', 'Open')}</a></div></div>`).join(''))}
      ${UI.card(T('সাম্প্রতিক পেমেন্ট', 'Recent payments'), UI.tbl([T('স্টুডেন্ট', 'Student'), T('পরিমাণ', 'Amount'), T('অবস্থা', 'Status')], DB.pays.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map(p => [esc(stu(p.sid).name), mny(p.amount), UI.stChip(p.status)])))}</div>` +
      UI.card(T('টিচারভিত্তিক আয় (কোম্পানি বনাম টিচার)', 'Teacher-wise earnings (company vs teacher)'), earnTbl());
  }];
  function earnTbl() {
    return UI.tbl([T('টিচার', 'Teacher'), T('কালেকশন', 'Collected'), T('কোম্পানি', 'Company'), T('টিচার শেয়ার', 'Teacher'), T('পরিশোধিত', 'Paid'), T('পাওনা', 'Payable')], TEACHERS.map(t => { const e = PX.teacherEarn(t.id); return [esc(t.n.bn), mny(e.gross), `${mny(e.company)} (${n(e.share)}%)`, mny(e.mine), mny(e.paid), e.due ? `<b>${mny(e.due)}</b>` : '—']; }));
  }

  /* ---------- টিচার আবেদন ---------- */
  def.applications = ['applications', () => {
    const f = PX.S.tab.apf || 'pending';
    return UI.tabs('apf', [['pending', T('অপেক্ষমাণ', 'Pending')], ['approved', T('অনুমোদিত', 'Approved')], ['rejected', T('বাতিল', 'Rejected')]], f) +
      UI.card(T('টিচার ভর্তি ও অনুমোদন', 'Teacher admission'), UI.tbl([T('নাম', 'Name'), T('প্রতিষ্ঠান', 'Institution'), T('বিষয়', 'Subjects'), T('তারিখ', 'Date'), T('ব্যাজ', 'Badges'), ''], DB.apps.filter(a => a.status === f).map(a => [esc(a.name), `${esc(a.inst)} · ${esc(a.dept)}`, a.subjects.map(s => esc(L(SUBJECTS.find(x => x.id === s)))).join(', '), fd(a.date), `${a.badges.id ? '✓ID ' : ''}${a.badges.pay ? '✓Pay ' : ''}${a.badges.doc ? '✓Doc' : ''}` || '—', `<button class="btn btn-o btn-sm" data-pa="apview" data-id="${a.id}">${T('রিভিউ', 'Review')}</button>`])));
  }];
  A.apview = a => {
    const x = DB.apps.find(y => y.id === a.dataset.id);
    PX.modal(esc(x.name), `<p class="soft">${esc(x.inst)} · ${esc(x.dept)} · ${esc(x.year)}<br>${esc(x.phone)} · ${esc(x.email)} · ${esc(x.district)}</p>${UI.tbl([T('ডকুমেন্ট', 'Document'), T('ফাইল', 'File'), T('সাইজ', 'Size')], x.docs.map(d => [esc(d[0]), `${ic('file')} ${esc(d[1])}`, esc(d[2])]))}
      <form data-pf="apdec" data-id="${x.id}"><div class="ck-g">${[['id', T('আইডি ভেরিফাইড', 'ID verified')], ['pay', T('পেমেন্ট ভেরিফাইড', 'Payment verified')], ['doc', T('ডকুমেন্ট ভেরিফাইড', 'Docs verified')]].map(b => `<label class="ck"><input type="checkbox" name="b" value="${b[0]}" ${x.badges[b[0]] ? 'checked' : ''}><span>${b[1]}</span></label>`).join('')}</div>${UI.fi({ name: 'note', label: T('অ্যাডমিন নোট', 'Admin note'), rows: 2, val: x.note })}<div class="btns"><button class="btn btn-p" data-pa="decset" data-v="approved">${T('অনুমোদন', 'Approve')}</button><button class="btn btn-o danger" data-pa="decset" data-v="rejected">${T('বাতিল', 'Reject')}</button></div><input type="hidden" name="dec" value="approved"></form>`, true);
  };
  A.decset = a => { const f = a.closest('form'); f.elements.dec.value = a.dataset.v; f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); };
  F.apdec = (f, d) => { const x = DB.apps.find(y => y.id === f.dataset.id); x.status = d.dec; x.note = d.note; x.badges = { id: (d.b || []).includes('id'), pay: (d.b || []).includes('pay'), doc: (d.b || []).includes('doc') }; PX.closeModal(); PX.toast(d.dec === 'approved' ? T('টিচার অনুমোদিত — অ্যাকাউন্ট তৈরি হয়েছে', 'Approved — account created') : T('আবেদন বাতিল', 'Rejected')); PX.refresh(); };

  /* ---------- টিচার CRM ---------- */
  def.teachers = ['teachers', () => {
    const rows = TEACHERS.map(t => { const e = PX.teacherEarn(t.id), bd = DB.banned[t.id]; return [`<b>${esc(t.n.bn)}</b><small>${esc(L(t.inst))}</small>`, n(COURSES.filter(c => c.teacher === t.id).length), n(new Set(COURSES.filter(c => c.teacher === t.id).flatMap(c => PX.roster(c.id).map(u => u.id))).size), mny(e.gross), `<input class="sh" type="number" min="0" max="100" value="${e.share}" data-pc="share" data-tid="${t.id}"> %`, bd ? UI.chip(T('ব্যান', 'Banned'), 'bad') : UI.chip(T('সক্রিয়', 'Active'), 'ok'), `<button class="btn btn-o btn-sm" data-pa="ban" data-tid="${t.id}">${bd ? T('আনব্যান', 'Unban') : T('ব্যান', 'Ban')}</button>`]; });
    const ap = DB.apps.filter(a => a.status === 'approved').map(a => [`<b>${esc(a.name)}</b><small>${esc(a.inst)}</small>`, '0', '0', mny(0), '—', UI.chip(T('নতুন', 'New'), 'info'), '']);
    return UI.card(T('সব টিচার', 'All teachers'), UI.tbl([T('টিচার', 'Teacher'), T('কোর্স', 'Courses'), T('স্টুডেন্ট', 'Students'), T('কালেকশন', 'Gross'), T('কোম্পানি শেয়ার', 'Company share'), T('অবস্থা', 'Status'), ''], rows.concat(ap)));
  }];
  A.ban = a => { DB.banned[a.dataset.tid] = !DB.banned[a.dataset.tid]; PX.refresh(); };
  PX.CHG.share = el => { const v = Math.max(0, Math.min(100, +el.value || 0)); DB.settings.shareTid[el.dataset.tid] = v; PX.toast(T('শেয়ার হার হালনাগাদ', 'Share updated')); PX.refresh(); };

  /* ---------- কোর্স ---------- */
  def.courses = ['courses', () => {
    const rv = DB.newCourses.filter(c => c.status === 'review');
    return UI.card(T('অনুমোদনের অপেক্ষায়', 'Awaiting approval'), UI.tbl([T('কোর্স', 'Course'), T('টিচার', 'Teacher'), T('মূল্য (গ্রুপ)', 'Price (group)'), T('জমা', 'Submitted'), ''], rv.map(c => [esc(c.title), esc(TEACH(c.tid).n.bn), priceTxt(c), fd(c.date), `<button class="btn btn-o btn-sm" data-pa="cview" data-id="${c.id}">${T('রিভিউ', 'Review')}</button>`])), `<a class="btn btn-p btn-sm" href="#a-newcourse">${ic('plus')} ${T('যে কোনো টিচারের জন্য কোর্স তৈরি', 'Create course for any teacher')}</a>`) +
      UI.card(T('সব লাইভ কোর্স', 'All live courses'), UI.tbl([T('কোর্স', 'Course'), T('টিচার', 'Teacher'), T('স্টুডেন্ট', 'Students'), T('অবস্থা', 'Status'), ''], COURSES.map(c => [bn(c.title), esc(TEACH(c.teacher).n.bn), n(PX.roster(c.id).length), UI.stChip('live'), `<button class="btn btn-o btn-sm" data-pa="coff" data-id="${c.id}">${T('সাইট থেকে বন্ধ', 'Take off site')}</button>`])) +
        (DB.offList && DB.offList.length ? `<h4 class="sub">${T('বন্ধ কোর্স', 'Switched off')}</h4>` + UI.tbl([T('কোর্স', 'Course'), ''], DB.offList.map(c => [bn(c.title), `<button class="btn btn-o btn-sm" data-pa="con" data-id="${c.id}">${T('আবার চালু', 'Switch on')}</button>`])) : ''));
  }];
  const priceTxt = c => { const p = (c.plans.group || c.plans.one || [])[0]; return p ? mny(p.disc) + (p.m ? ' / ' + T(`${n(p.m)} মাস`, `${p.m} mo`) : '') : '—'; };
  def.newcourse = ['courses', () => UI.card(T('অ্যাডমিন: কোর্স তৈরি', 'Admin: create course'), `<p class="soft">${T('অ্যাডমিন যে কোর্স তৈরি করে সেটি সরাসরি লাইভ হতে পারে।', 'Courses created by admin can go live directly.')}</p>` + PX.courseForm(null, true))];
  A.cview = a => {
    const c = DB.newCourses.find(x => x.id === a.dataset.id), row = (f, l) => (c.plans[f] || []).map(p => `<tr><td>${l}</td><td>${p.m ? T(`প্রতি ${n(p.m)} মাস`, `every ${p.m} mo`) : T('একবারে', 'One-time')}</td><td>${mny(p.actual)}</td><td>${mny(p.disc)}</td><td>${p.first != null ? mny(p.first) : '—'}</td></tr>`).join('');
    PX.modal(esc(c.title), `<p class="soft">${esc(TEACH(c.tid).n.bn)} · ${n(c.weeks)} ${T('সপ্তাহ', 'weeks')} · ${n(c.cpw)} ${T('ক্লাস/সপ্তাহ', 'classes/wk')} · ${c.days.map(d => esc(L(DAYS[d]))).join(', ')} · ${esc(c.time)}</p><p>${esc(c.desc || '')}</p><div class="tbl-w"><table class="ptbl"><thead><tr><th>${T('ধরন', 'Type')}</th><th>${T('মেয়াদ', 'Tenure')}</th><th>${T('আসল', 'Actual')}</th><th>${T('ছাড়ের', 'Disc.')}</th><th>${T('প্রথম পেমেন্ট', 'First')}</th></tr></thead><tbody>${row('group', T('গ্রুপ', 'Group'))}${row('one', '১-টু-১')}</tbody></table></div>
      <form data-pf="cdec" data-id="${c.id}">${UI.fi({ name: 'reason', label: T('বাতিলের কারণ (বাতিল করলে)', 'Reason (if rejecting)') })}<input type="hidden" name="dec" value="approve"><div class="btns"><button class="btn btn-p" data-pa="cdecset" data-v="approve">${T('অনুমোদন ও লাইভ', 'Approve & go live')}</button><button class="btn btn-o danger" data-pa="cdecset" data-v="reject">${T('বাতিল', 'Reject')}</button></div></form>`, true);
  };
  A.cdecset = a => { const f = a.closest('form'); f.elements.dec.value = a.dataset.v; f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); };
  F.cdec = (f, d) => { const c = DB.newCourses.find(x => x.id === f.dataset.id); if (d.dec === 'approve') { PX.publishCourse(c); PX.toast(T('কোর্স অনুমোদিত — সাইটে লাইভ', 'Approved — live on the site')); } else { c.status = 'rejected'; c.reason = d.reason || ''; PX.toast(T('কোর্স বাতিল', 'Rejected')); } PX.closeModal(); PX.refresh(); };
  DB.offList = [];
  A.coff = a => { const i = COURSES.findIndex(c => c.id === a.dataset.id); DB.offList.push(COURSES.splice(i, 1)[0]); PX.refresh(); };
  A.con = a => { const i = DB.offList.findIndex(c => c.id === a.dataset.id); COURSES.push(DB.offList.splice(i, 1)[0]); PX.refresh(); };

  /* ---------- স্টুডেন্ট CRM ---------- */
  def.students = ['students', () => {
    const q = (PX.S.q || '').toLowerCase();
    const l = DB.crm.filter(u => !q || (u.name + u.phone + u.district).toLowerCase().includes(q));
    return UI.card(T('স্টুডেন্ট তালিকা', 'Students'), `<div class="bar-t"><input type="search" class="srch" placeholder="${T('নাম/ফোন/জেলা খুঁজুন', 'Search')}" value="${esc(PX.S.q || '')}" data-pc="q"><button class="btn btn-p btn-sm" data-pa="newstu">${ic('plus')} ${T('নতুন স্টুডেন্ট', 'New student')}</button></div>` +
      UI.tbl([T('নাম', 'Name'), T('ফোন', 'Phone'), T('জেলা', 'District'), T('কোর্স', 'Courses'), T('অবস্থা', 'Status'), ''], l.map(u => [`<b>${esc(u.name)}</b>`, esc(u.phone), esc(u.district), n(u.courses.length), u.blocked ? UI.chip(T('ব্লক', 'Blocked'), 'bad') : UI.chip(T('সক্রিয়', 'Active'), 'ok'), `<button class="btn btn-o btn-sm" data-pa="stuview" data-id="${u.id}">${T('বিস্তারিত', 'Open')}</button>`])));
  }];
  PX.CHG.q = el => { PX.S.q = el.value; PX.S.qfocus = true; PX.refresh(); const i = document.querySelector('.srch'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } };
  A.stuview = a => {
    const u = stu(a.dataset.id), pays = DB.pays.filter(p => p.sid === u.id);
    PX.modal(esc(u.name), `<p class="soft">${esc(u.phone)} · ${esc(u.email)} · ${esc(u.district)} · ${esc(u.level)}<br>${T('অভিভাবক', 'Guardian')}: ${esc(u.guardian.name)} (${esc(u.guardian.phone)})</p><h4 class="sub">${T('এনরোল্ড কোর্স', 'Enrolled')}</h4>${u.courses.map(c => `<div class="row-i"><div>${bn(COURSE(c).title)}</div></div>`).join('') || '—'}<h4 class="sub">${T('পেমেন্ট', 'Payments')}</h4>${UI.tbl([T('তারিখ', 'Date'), T('পরিমাণ', 'Amount'), T('অবস্থা', 'Status')], pays.map(p => [fd(p.date), mny(p.amount), UI.stChip(p.status)]))}
      <form data-pf="enroll" data-id="${u.id}" class="fgrid">${UI.fi({ name: 'cid', label: T('কোর্সে এনরোল করুন', 'Enroll in course'), half: 1, opts: COURSES.filter(c => !u.courses.includes(c.id)).map(c => [c.id, L(c.title)]) })}<div class="fld half"><label>&nbsp;</label><button class="btn btn-p btn-sm">${T('এনরোল', 'Enroll')}</button></div></form>
      <form data-pf="stunote" data-id="${u.id}">${UI.fi({ name: 'note', label: T('CRM নোট', 'CRM note'), rows: 2, val: (DB.notes[u.id] || '') })}<div class="btns"><button class="btn btn-o btn-sm">${T('নোট সংরক্ষণ', 'Save note')}</button> <button type="button" class="btn btn-o btn-sm danger" data-pa="stublock" data-id="${u.id}">${u.blocked ? T('আনব্লক', 'Unblock') : T('ব্লক', 'Block')}</button></div></form>`, true);
  };
  F.enroll = (f, d) => { const u = stu(f.dataset.id); if (!d.cid) return; u.courses.push(d.cid); DB.pays.push({ id: 'p' + DB.nextPid++, sid: u.id, cid: d.cid, amount: pricingFor(COURSE(d.cid)).group.perD, ch: 'cash', status: 'pending', date: TODAY, note: 'অ্যাডমিন এনরোল' }); PX.closeModal(); PX.toast(T('এনরোল করা হয়েছে', 'Enrolled')); PX.refresh(); };
  F.stunote = (f, d) => { DB.notes[f.dataset.id] = d.note; PX.toast(T('নোট সংরক্ষিত', 'Saved')); };
  A.stublock = a => { const u = stu(a.dataset.id); u.blocked = !u.blocked; PX.closeModal(); PX.refresh(); };
  A.newstu = () => PX.modal(T('নতুন স্টুডেন্ট', 'New student'), `<form data-pf="newstu" class="fgrid">${UI.fi({ name: 'name', label: T('নাম', 'Name'), req: 1, half: 1 })}${UI.fi({ name: 'phone', label: T('ফোন', 'Phone'), req: 1, half: 1 })}${UI.fi({ name: 'district', label: T('জেলা', 'District'), half: 1 })}${UI.fi({ name: 'cid', label: T('কোর্স (ঐচ্ছিক)', 'Course (optional)'), half: 1, opts: [['', '—']].concat(COURSES.map(c => [c.id, L(c.title)])) })}<div class="fld"><button class="btn btn-p">${T('তৈরি করুন', 'Create')}</button></div></form>`);
  F.newstu = (f, d) => { const id = 'u' + (DB.crm.length + 1); DB.crm.push({ id, name: d.name, phone: d.phone, email: id + '@example.com', district: d.district || '—', level: '—', joined: TODAY, courses: d.cid ? [d.cid] : [], notes: [], blocked: false, ref: '', guardian: { name: '—', phone: '—' } }); PX.closeModal(); PX.toast(T('স্টুডেন্ট তৈরি হয়েছে', 'Student created')); PX.refresh(); };

  /* ---------- পেমেন্ট ---------- */
  def.payments = ['payments', () => {
    const f = PX.S.tab.pyf || 'all', l = DB.pays.filter(p => f === 'all' || p.status === f).sort((a, b) => b.date.localeCompare(a.date));
    const tot = DB.pays.filter(p => p.status === 'confirmed').reduce((a, p) => a + p.amount, 0);
    return `<div class="kpis">${UI.kpi(T('নিশ্চিত মোট', 'Confirmed'), mny(tot), '', 'ok')}${UI.kpi(T('অপেক্ষমাণ', 'Pending'), n(DB.pays.filter(p => p.status === 'pending').length), '', 'warn')}${UI.kpi(T('অনলাইন গেটওয়ে', 'Online gateway'), T('বন্ধ', 'Off'), T('ক্যাশ চালু', 'cash on'))}</div>` + UI.tabs('pyf', [['all', T('সব', 'All')], ['pending', T('অপেক্ষমাণ', 'Pending')], ['confirmed', T('নিশ্চিত', 'Confirmed')]], f) +
      UI.card(T('পেমেন্ট তালিকা', 'Payments'), UI.tbl([T('তারিখ', 'Date'), T('স্টুডেন্ট', 'Student'), T('কোর্স', 'Course'), T('মাধ্যম', 'Method'), T('পরিমাণ', 'Amount'), T('অবস্থা', 'Status'), ''], l.slice(0, 60).map(p => [fd(p.date), esc(stu(p.sid).name), bn(COURSE(p.cid).title), p.ch === 'cash' ? T('ক্যাশ', 'Cash') : esc(p.ch), mny(p.amount), UI.stChip(p.status), p.status === 'pending' ? `<button class="btn btn-p btn-sm" data-pa="payok" data-id="${p.id}">${T('নিশ্চিত করুন', 'Confirm')}</button>` : ''])), `<button class="btn btn-o btn-sm" data-pa="manpay">${ic('plus')} ${T('ম্যানুয়াল এন্ট্রি', 'Manual entry')}</button>`);
  }];
  A.payok = a => { PX.confirmPay(a.dataset.id); PX.toast(T('পেমেন্ট নিশ্চিত; স্টুডেন্টের ক্লাস আনব্লক', 'Confirmed; student unblocked')); PX.refresh(); };
  A.manpay = () => PX.modal(T('ম্যানুয়াল পেমেন্ট এন্ট্রি', 'Manual payment'), `<form data-pf="manpay" class="fgrid">${UI.fi({ name: 'sid', label: T('স্টুডেন্ট', 'Student'), half: 1, opts: DB.crm.map(u => [u.id, u.name]) })}${UI.fi({ name: 'cid', label: T('কোর্স', 'Course'), half: 1, opts: COURSES.map(c => [c.id, L(c.title)]) })}${UI.fi({ name: 'amount', label: T('পরিমাণ ৳', 'Amount'), type: 'number', req: 1, half: 1, min: 1 })}${UI.fi({ name: 'ch', label: T('মাধ্যম', 'Method'), half: 1, opts: [['cash', T('ক্যাশ', 'Cash')], ['bank', T('ব্যাংক', 'Bank')]] })}<div class="fld"><button class="btn btn-p">${T('যোগ করুন', 'Add')}</button></div></form>`);
  F.manpay = (f, d) => { const id = 'p' + DB.nextPid++; DB.pays.unshift({ id, sid: d.sid, cid: d.cid, amount: +d.amount, ch: d.ch, status: 'pending', date: TODAY, note: 'ম্যানুয়াল' }); PX.confirmPay(id); PX.closeModal(); PX.toast(T('পেমেন্ট যোগ হয়েছে', 'Added')); PX.refresh(); };

  /* ---------- পেআউট ---------- */
  def.payouts = ['payouts', () => UI.card(T('টিচারভিত্তিক আয় ও পেআউট', 'Teacher earnings & payouts'), UI.tbl([T('টিচার', 'Teacher'), T('কালেকশন', 'Collected'), T('কোম্পানি', 'Company'), T('টিচার', 'Teacher'), T('পরিশোধিত', 'Paid'), T('পাওনা', 'Payable'), T('পেআউট মেথড', 'Payout method'), T('চার্জ / নিট', 'Charge / net'), ''], TEACHERS.map(t => { const e = PX.teacherEarn(t.id), pm = PX.payMethod(t.id), chg = PX.payCharge(t.id, e.due); return [esc(t.n.bn), mny(e.gross), `${mny(e.company)} (${n(e.share)}%)`, mny(e.mine), mny(e.paid), mny(e.due), pm ? esc((pm.kind === 'bank' ? T('ব্যাংক', 'Bank') : T('ওয়ালেট', 'Wallet')) + ': ' + pm.label) : UI.chip(T('যোগ করেননি', 'Not added'), 'warn'), pm ? `${mny(chg)} / ${mny(e.due - chg)}` : '—', e.due ? `<button class="btn btn-p btn-sm" data-pa="paynout" data-tid="${t.id}">${T('পেআউট', 'Pay out')}</button>` : '']; }))) + UI.card(T('পেআউট ইতিহাস', 'Payout history'), UI.tbl([T('তারিখ', 'Date'), T('টিচার', 'Teacher'), T('পরিমাণ', 'Amount'), T('চার্জ (টিচারের)', 'Charge (teacher)'), T('নিট', 'Net'), T('মেথড', 'Method')], DB.payouts.map(p => [fd(p.date), esc(TEACH(p.tid).n.bn), mny(p.amount), mny(p.charge || 0), mny(p.amount - (p.charge || 0)), esc(p.method || p.note)]))) + `<p class="soft">${T('কোম্পানির শেয়ার ডিফল্ট ' + n(DB.settings.share) + '% (সেটিংসে বদলানো যায়; প্রতি টিচারের আলাদা হারও দেওয়া যায়)।', 'Default company share ' + DB.settings.share + '% — editable in Settings and per teacher.')}</p>`];
  A.paynout = a => { const t = a.dataset.tid, e = PX.teacherEarn(t), pm = PX.payMethod(t); if (!pm) { PX.toast(T('টিচার এখনো ব্যাংক/ওয়ালেট যোগ করেননি', 'Teacher has not added a bank/wallet yet')); return; } DB.payouts.unshift({ id: 'po' + (DB.payouts.length + 1), tid: t, amount: e.due, charge: PX.payCharge(t, e.due), method: pm.label, date: TODAY, note: 'পেআউট' }); PX.toast(T('পেআউট রেকর্ড হয়েছে', 'Payout recorded')); PX.refresh(); };

  /* ---------- সাবস্ক্রিপশন ---------- */
  def.subs = ['subs', () => {
    const rows = [];
    DB.enr.forEach(e => rows.push([esc(DB.me.name), bn(COURSE(e.cid).title), e.m ? T(`প্রতি ${n(e.m)} মাসে ${mny(e.per)}`, `${mny(e.per)} / ${e.m} mo`) : T('একবারে', 'One-time'), e.nextDue ? fd(e.nextDue) : '—', UI.stChip(e.state), e.m ? `<button class="btn btn-o btn-sm" data-pa="remind" data-name="${esc(DB.me.name)}">${T('রিমাইন্ডার', 'Remind')}</button> <button class="btn btn-o btn-sm" data-pa="subtoggle" data-cid="${e.cid}">${e.state === 'overdue' ? T('আনব্লক', 'Unblock') : T('ব্লক', 'Block')}</button>` : '']));
    DB.crm.slice(1, 8).forEach(u => { const cid = u.courses[0], k = PX.H(u.id + cid), od = k % 5 === 0; rows.push([esc(u.name), bn(COURSE(cid).title), T('মাসিক', 'Monthly'), fd(od ? '2026-11-15' : '2026-11-30'), UI.stChip(od ? 'overdue' : 'active'), `<button class="btn btn-o btn-sm" data-pa="remind" data-name="${esc(u.name)}">${T('রিমাইন্ডার', 'Remind')}</button>`]); });
    return `<div class="alert warn">${ic('clock')}<div><b>${T('অটো রিমাইন্ডার', 'Auto reminders')}</b><p>${T('মাসিক প্ল্যানের স্টুডেন্টরা প্রতি মাসের শেষ দিনে রিমাইন্ডার পান। বকেয়া থাকলে পরের ক্লাসে যোগ দেওয়া বন্ধ থাকে এবং “এখনই সাবস্ক্রিপশন দিন” বাটন দেখায়।', 'Students on monthly plans are reminded on the last day of the month. Overdue plans block the next class.')}</p></div><button class="btn btn-o btn-sm" data-pa="remind" data-name="${T('সবাই', 'all')}">${T('সবাইকে পাঠান', 'Send to all')}</button></div>` + UI.card(T('সাবস্ক্রিপশন স্ট্যাটাস', 'Subscription status'), UI.tbl([T('স্টুডেন্ট', 'Student'), T('কোর্স', 'Course'), T('প্ল্যান', 'Plan'), T('পরবর্তী ডিউ', 'Next due'), T('অবস্থা', 'Status'), ''], rows));
  }];
  A.remind = a => PX.toast(T('রিমাইন্ডার পাঠানো হয়েছে: ', 'Reminder sent: ') + a.dataset.name);
  A.subtoggle = a => { const e = PX.myEnr(a.dataset.cid); e.state = e.state === 'overdue' ? 'active' : 'overdue'; PX.refresh(); };

  /* ---------- শিডিউল ---------- */
  def.schedule = ['schedule', () => UI.card(T('শিডিউল পরিবর্তনের অনুরোধ', 'Schedule change requests'), UI.tbl([T('টিচার', 'Teacher'), T('ক্লাস', 'Class'), T('প্রস্তাবিত সময়', 'Proposed'), T('কারণ', 'Reason'), T('অবস্থা', 'Status'), ''], DB.resched.map(r => [esc(TEACH(r.tid).n.bn), bn(COURSE(r.cid).title) + `<small>${fd(PX.session(r.sid).date)}</small>`, `${fd(r.newDate)} · ${esc(r.newTime)}`, esc(r.reason), UI.stChip(r.status), r.status === 'pending' ? `<button class="btn btn-p btn-sm" data-pa="rqok" data-id="${r.id}">${T('অনুমোদন', 'Approve')}</button> <button class="btn btn-o btn-sm danger" data-pa="rqno" data-id="${r.id}">${T('বাতিল', 'Reject')}</button>` : ''])) ) + UI.card(T('বন্ধ করা ক্লাস', 'Blocked classes'), UI.tbl([T('টিচার', 'Teacher'), T('ক্লাস', 'Class'), T('তারিখ', 'Date')], DB.blocked.map(b => [esc(TEACH(COURSE(b.cid).teacher).n.bn), bn(COURSE(b.cid).title), fd(PX.session(b.sid).date)])))];
  A.rqok = a => { const r = DB.resched.find(x => x.id === a.dataset.id); r.status = 'approved'; const s = PX.session(r.sid); if (s) { s.date = r.newDate; s.time = r.newTime; } PX.toast(T('অনুমোদিত; ক্লাসের সময় বদলেছে', 'Approved; class rescheduled')); PX.refresh(); };
  A.rqno = a => { DB.resched.find(x => x.id === a.dataset.id).status = 'rejected'; PX.refresh(); };

  /* ---------- কনটেন্ট ---------- */
  def.content = ['content', () => UI.card(T('ড্যাশবোর্ড ঘোষণা/ব্যানার', 'Dashboard announcements'), `<form data-pf="ann" class="fgrid">${UI.fi({ name: 'title', label: T('শিরোনাম', 'Title'), req: 1, half: 1 })}${UI.fi({ name: 'aud', label: T('কাদের জন্য', 'Audience'), half: 1, opts: [['all', T('সবাই', 'Everyone')], ['student', T('স্টুডেন্ট', 'Students')], ['teacher', T('টিচার', 'Teachers')]] })}${UI.fi({ name: 'body', label: T('বার্তা', 'Message'), rows: 2, req: 1 })}<div class="fld"><button class="btn btn-p btn-sm">${T('প্রকাশ করুন', 'Publish')}</button></div></form>`) +
    UI.card(T('সব ঘোষণা', 'All announcements'), UI.tbl([T('শিরোনাম', 'Title'), T('দর্শক', 'Audience'), T('তারিখ', 'Date'), T('অবস্থা', 'Status'), ''], DB.announcements.map(a => [`<b>${esc(a.title)}</b><small>${esc(a.body)}</small>`, esc({ all: T('সবাই', 'All'), student: T('স্টুডেন্ট', 'Students'), teacher: T('টিচার', 'Teachers') }[a.aud]), fd(a.date), a.active ? UI.chip(T('চালু', 'On'), 'ok') : UI.chip(T('বন্ধ', 'Off')), `<button class="btn btn-o btn-sm" data-pa="antog" data-id="${a.id}">${a.active ? T('বন্ধ করুন', 'Turn off') : T('চালু করুন', 'Turn on')}</button> <button class="btn btn-o btn-sm danger" data-pa="andel" data-id="${a.id}">${ic('trash')}</button>`]))) +
    UI.card(T('হোমপেজে ফিচার্ড কোর্স ও টিচার', 'Featured on homepage'), `<form data-pf="feat">${UI.checks('courses', COURSES.map(c => [c.id, L(c.title)]), COURSES.filter(c => c.featured).map(c => c.id), T('ফিচার্ড কোর্স', 'Featured courses'))}<button class="btn btn-p btn-sm">${T('সংরক্ষণ', 'Save')}</button></form>`)];
  F.ann = (f, d) => { DB.announcements.unshift({ id: 'an' + Date.now(), title: d.title, body: d.body, aud: d.aud, active: true, date: TODAY }); PX.toast(T('ঘোষণা প্রকাশিত', 'Published')); PX.refresh(); };
  A.antog = a => { const x = DB.announcements.find(y => y.id === a.dataset.id); x.active = !x.active; PX.refresh(); };
  A.andel = a => { DB.announcements = DB.announcements.filter(y => y.id !== a.dataset.id); PX.refresh(); };
  F.feat = (f, d) => { COURSES.forEach(c => { c.featured = (d.courses || []).includes(c.id); }); PX.toast(T('হোমপেজ হালনাগাদ হয়েছে', 'Homepage updated')); };

  /* ---------- প্রাইসিং, কুপন, রেফারেল ---------- */
  def.pricing = ['pricing', () => {
    const s = DB.settings, rs = s.refS, rt = s.refT;
    return UI.card(T('কুপন তৈরি', 'Create coupon'), `<form data-pf="coupon" data-by="admin" class="fgrid">${UI.fi({ name: 'code', label: T('কোড', 'Code'), req: 1, half: 1 })}${UI.fi({ name: 'type', label: T('ধরন', 'Type'), half: 1, opts: [['pct', T('শতকরা %', 'Percent')], ['flat', T('ফিক্সড ৳', 'Fixed ৳')]] })}${UI.fi({ name: 'v', label: T('পরিমাণ', 'Value'), type: 'number', req: 1, half: 1, min: 1 })}${UI.fi({ name: 'scope', label: T('প্রযোজ্য (সব / টিচারের সব কোর্স / একটি কোর্স)', 'Applies to (all / a teacher\'s courses / one course)'), opts: PX.scopeOpts('') })}${UI.fi({ name: 'limit', label: T('সর্বোচ্চ ব্যবহার', 'Max uses'), type: 'number', val: 100, half: 1 })}${UI.fi({ name: 'expiry', label: T('মেয়াদ', 'Expiry'), type: 'date', val: '2026-12-31', half: 1 })}<div class="fld"><button class="btn btn-p btn-sm">${T('তৈরি', 'Create')}</button></div></form>`) +
      UI.card(T('সব কুপন (অ্যাডমিন ও টিচার)', 'All coupons'), PX.couponTbl(DB.coupons, true)) +
      UI.card(T('রেফারেল বোনাস কনফিগ', 'Referral bonus config'), `<form data-pf="refcfg" class="fgrid">${UI.fi({ name: 'st', label: T('স্টুডেন্ট রেফারেল ধরন', 'Student type'), half: 1, opts: [['pct', T('শতকরা %', 'Percent')], ['fixed', T('ফিক্সড ৳', 'Fixed')]], val: rs.type })}${UI.fi({ name: 'sv', label: T('স্টুডেন্ট বোনাস', 'Student value'), type: 'number', half: 1, val: rs.v, min: 0 })}${UI.fi({ name: 'tt', label: T('টিচার রেফারেল ধরন', 'Teacher type'), half: 1, opts: [['pct', T('শতকরা %', 'Percent')], ['fixed', T('ফিক্সড ৳', 'Fixed')]], val: rt.type })}${UI.fi({ name: 'tv', label: T('টিচার বোনাস', 'Teacher value'), type: 'number', half: 1, val: rt.v, min: 0 })}<div class="fld"><button class="btn btn-p btn-sm">${T('সংরক্ষণ', 'Save')}</button></div></form>`) +
      UI.card(T('ক্লাসের ধরন', 'Class types'), UI.tbl([T('ধরন', 'Type'), T('সিট', 'Seats')], DB.classTypes.map(c => [esc(c.bn), n(c.seats)])) + `<p class="soft">${T('মূল্য ও মেয়াদ (১/৩/৬/১২ মাস) টিচার কোর্স তৈরির সময় নির্ধারণ করে; অ্যাডমিন অনুমোদনের সময় যাচাই করে।', 'Tenure and price are set by teachers at course creation; admin reviews them.')}</p>`);
  }];
  F.refcfg = (f, d) => { DB.settings.refS = { type: d.st, v: +d.sv }; DB.settings.refT = { type: d.tt, v: +d.tv }; PX.toast(T('সংরক্ষিত', 'Saved')); };

  /* ---------- রিভিউ ---------- */
  def.reviews = ['reviews', () => {
    const by = TEACHERS.map(t => { const ids = COURSES.filter(c => c.teacher === t.id).map(c => c.id), l = DB.reviews.filter(r => ids.includes(r.cid)); return l.length ? [esc(t.n.bn), n(l.length), '★' + n((l.reduce((a, r) => a + r.overall, 0) / l.length).toFixed(1)), n(l.filter(r => r.overall <= 3).length)] : null; }).filter(Boolean);
    return UI.card(T('টিচারভিত্তিক সারাংশ', 'By teacher'), UI.tbl([T('টিচার', 'Teacher'), T('রিভিউ', 'Reviews'), T('গড়', 'Avg'), T('নেগেটিভ', 'Negative')], by)) + UI.card(T('সব রিভিউ', 'All reviews'), PX.reviewRows(DB.reviews.slice().reverse()));
  }];

  /* ---------- সাপোর্ট ---------- */
  def.support = ['support', () => UI.card(T('সাপোর্ট টিকিট (স্টুডেন্ট ও টিচার)', 'Support tickets'), DB.tickets.map(t => `<div class="tk"><header><b>${esc(t.subject)}</b>${UI.stChip(t.status)}<small>${esc(t.name)} (${t.by === 's' ? T('স্টুডেন্ট', 'Student') : T('টিচার', 'Teacher')}) · ${esc(t.cat)} · ${fd(t.date)}</small></header>${t.msgs.map(m => `<div class="msg ${m.from === 's' ? 'me' : ''}"><small>${m.from === 'u' ? esc(t.name) : T('সাপোর্ট', 'Support')} · ${fd(m.at)}</small>${m.text ? `<p>${esc(m.text)}</p>` : ''}${PX.attList(m.files)}</div>`).join('')}<form class="chat-f" data-pf="tkreply" data-id="${t.id}" data-from="s"><input name="text" placeholder="${T('উত্তর দিন…', 'Reply…')}">${PX.attPick()}<button class="btn btn-o btn-sm">${T('পাঠান', 'Send')}</button>${t.status !== 'closed' ? `<button type="button" class="btn btn-p btn-sm" data-pa="tkclose" data-id="${t.id}">${T('সমাধান', 'Close')}</button>` : ''}</form></div>`).join(''))];
  A.tkclose = a => { DB.tickets.find(t => t.id === a.dataset.id).status = 'closed'; PX.refresh(); };

  /* ---------- পলিসি ---------- */
  const AUD = () => [['student', T('স্টুডেন্ট', 'Students')], ['teacher', T('টিচার', 'Teachers')]];
  def.policies = ['policies', () => UI.card(T('নতুন পলিসি', 'New policy'), polForm()) + UI.card(T('সব পলিসি', 'All policies'), DB.policies.map(p => `<details class="pol"><summary>${esc(p.title)} <small>${p.aud.map(a => a === 'student' ? T('স্টুডেন্ট', 'Student') : T('টিচার', 'Teacher')).join(' + ')}</small></summary>${polForm(p)}<button class="btn btn-o btn-sm danger" data-pa="poldel" data-id="${p.id}">${ic('trash')} ${T('মুছুন', 'Delete')}</button></details>`).join('')) + `<p class="soft">${T('এখানে বসানো লেখাগুলো খসড়া। চূড়ান্ত কঠোর পলিসি পেলে এখান থেকেই হালনাগাদ করা যাবে।', 'Texts here are placeholders — update them from here once final policies are ready.')}</p>`];
  function polForm(p) { return `<form data-pf="pol" data-id="${p ? p.id : ''}" class="fgrid">${UI.fi({ name: 'title', label: T('শিরোনাম', 'Title'), req: 1, val: p ? p.title : '' })}${UI.checks('aud', AUD(), p ? p.aud : ['student'], T('কারা দেখবে', 'Visible to'))}${UI.fi({ name: 'body', label: T('বিষয়বস্তু', 'Content'), rows: 4, req: 1, val: p ? p.body : '' })}<div class="fld"><button class="btn btn-p btn-sm">${p ? T('হালনাগাদ', 'Update') : T('যোগ করুন', 'Add')}</button></div></form>`; }
  F.pol = (f, d) => { const aud = d.aud && d.aud.length ? d.aud : ['student']; if (f.dataset.id) { Object.assign(DB.policies.find(x => x.id === f.dataset.id), { title: d.title, body: d.body, aud, date: TODAY }); } else DB.policies.push({ id: 'pl' + Date.now(), title: d.title, body: d.body, aud, date: TODAY }); PX.toast(T('পলিসি সংরক্ষিত', 'Saved')); PX.refresh(); };
  A.poldel = a => { DB.policies = DB.policies.filter(p => p.id !== a.dataset.id); PX.refresh(); };

  /* ---------- কর্মী ও অ্যাক্সেস ---------- */
  const PK = [['applications', 'টিচার আবেদন', 'Applications'], ['teachers', 'টিচার CRM', 'Teachers'], ['courses', 'কোর্স', 'Courses'], ['students', 'স্টুডেন্ট CRM', 'Students'], ['payments', 'পেমেন্ট', 'Payments'], ['payouts', 'পেআউট', 'Payouts'], ['subs', 'সাবস্ক্রিপশন', 'Subscriptions'], ['schedule', 'শিডিউল', 'Schedule'], ['content', 'কনটেন্ট', 'Content'], ['pricing', 'প্রাইসিং/কুপন', 'Pricing'], ['reviews', 'রিভিউ', 'Reviews'], ['support', 'সাপোর্ট', 'Support'], ['policies', 'পলিসি', 'Policies'], ['staff', 'কর্মী', 'Staff'], ['settings', 'সেটিংস', 'Settings']];
  def.staff = ['staff', () => UI.card(T('কর্মী', 'Employees'), UI.tbl([T('নাম', 'Name'), T('পদ', 'Role'), T('লেভেল', 'Level'), T('ইমেইল', 'Email'), T('অবস্থা', 'Status'), ''], DB.employees.map(e => [esc(e.name), esc(e.role), esc(DB.levels[e.level].label), esc(e.email), e.active ? UI.chip(T('সক্রিয়', 'Active'), 'ok') : UI.chip(T('নিষ্ক্রিয়', 'Off')), `<button class="btn btn-o btn-sm" data-pa="emtog" data-id="${e.id}">${e.active ? T('নিষ্ক্রিয়', 'Deactivate') : T('সক্রিয়', 'Activate')}</button>`])) + `<form data-pf="emp" class="fgrid">${UI.fi({ name: 'name', label: T('নাম', 'Name'), req: 1, half: 1 })}${UI.fi({ name: 'role', label: T('পদ', 'Role'), req: 1, half: 1 })}${UI.fi({ name: 'email', label: T('ইমেইল', 'Email'), type: 'email', req: 1, half: 1 })}${UI.fi({ name: 'level', label: T('অ্যাক্সেস লেভেল', 'Access level'), half: 1, opts: Object.keys(DB.levels).map(k => [k, DB.levels[k].label]) })}<div class="fld"><button class="btn btn-p btn-sm">${T('কর্মী যোগ', 'Add employee')}</button></div></form>`) +
    (PX.accessUI ? PX.accessUI() : '')];
  F.emp = (f, d) => { DB.employees.push({ id: 'em' + (DB.employees.length + 1), name: d.name, role: d.role, level: d.level, email: d.email, active: true }); PX.toast(T('কর্মী যোগ হয়েছে', 'Added')); PX.refresh(); };
  A.emtog = a => { const e = DB.employees.find(x => x.id === a.dataset.id); e.active = !e.active; PX.refresh(); };
  PX.CHG.perm = el => { DB.levels[el.dataset.k].perms[el.dataset.p] = el.checked ? 1 : 0; PX.refresh(); };

  /* ---------- সেটিংস ---------- */
  def.settings = ['settings', () => { const s = DB.settings; return UI.card(T('পেমেন্ট চ্যানেল', 'Payment channels'), `<form data-pf="setf" class="fgrid"><label class="ck"><input type="checkbox" name="cash" ${s.channels.cash ? 'checked' : ''}><span>${T('ক্যাশ পেমেন্ট', 'Cash')}</span></label><label class="ck"><input type="checkbox" name="bkash" ${s.channels.bkash ? 'checked' : ''}><span>${T('বিকাশ (অনলাইন) — ডেমোতে অবৈধ', 'bKash (online) — invalid in demo')}</span></label><label class="ck"><input type="checkbox" name="ssl" ${s.channels.ssl ? 'checked' : ''}><span>${T('কার্ড/গেটওয়ে — ডেমোতে অবৈধ', 'Card gateway — invalid in demo')}</span></label>${UI.fi({ name: 'share', label: T('ডিফল্ট কোম্পানি শেয়ার %', 'Default company share %'), type: 'number', min: 0, val: s.share, half: 1 })}<div class="fld"><button class="btn btn-p btn-sm">${T('সংরক্ষণ', 'Save')}</button></div></form><p class="soft">${T('কোম্পানি শেয়ারের হার নমুনা (৩০%); চূড়ান্ত হার BRD অনুযায়ী বসবে।', 'Company share is a sample (30%); final value per BRD.')}</p>`); }];
  F.setf = (f, d) => { const s = DB.settings; s.channels = { cash: !!d.cash, bkash: !!d.bkash, ssl: !!d.ssl }; s.share = Math.max(0, Math.min(100, +d.share || 0)); PX.toast(T('সেটিংস সংরক্ষিত', 'Saved')); PX.refresh(); };

  Object.keys(def).forEach(k => { S[k] = guard(def[k][0], def[k][1]); });
})();
