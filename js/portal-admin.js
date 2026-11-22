/* অ্যাডমিন প্যানেল */
(function () {
  'use strict';
  const PX = window.PX, { T, n, mny, esc, fd, ic, COURSE, TEACH, TODAY } = PX, DB = PX.DB, UI = PX.ui, L = CH.L, S = PX.sec.a;
  const bn = o => esc(L(o));
  const A = PX.ACT, F = PX.FORMS;
  const stu = id => DB.crm.find(u => u.id === id);
  const idc = v => `<code class="idc">#${esc(v)}</code>`;
  PX.idc = idc;
  const perms = () => DB.levels[PX.S.level].perms;
  const NAV = [
    ['home', 'ড্যাশবোর্ড', 'Dashboard', 'home', null],
    ['applications', 'টিচার আবেদন', 'Teacher applications', 'file', 'applications'],
    ['teachers', 'টিচার CRM', 'Teachers CRM', 'users', 'teachers'],
    ['courses', 'কোর্স অনুমোদন', 'Courses', 'book', 'courses'],
    ['programs', 'প্রোগ্রাম ও কোর্স টাইপ', 'Programs & course types', 'book', 'courses'],
    ['students', 'স্টুডেন্ট CRM', 'Students CRM', 'user', 'students'],
    ['payments', 'পেমেন্ট', 'Payments', 'award', 'payments'],
    ['payouts', 'পেআউট ও আয়', 'Payouts & earnings', 'award', 'payouts'],
    ['subs', 'সাবস্ক্রিপশন', 'Subscriptions', 'repeat', 'subs'],
    ['schedule', 'শিডিউল অনুরোধ', 'Schedule requests', 'calendar', 'schedule'],
    ['content', 'কনটেন্ট ও ঘোষণা', 'Content & banners', 'chat', 'content'],
    ['pricing', 'কুপন, রেফারেল ও প্রাইসিং', 'Coupons, referral, pricing', 'plus', 'pricing'],
    ['referral', 'রেফারেল (স্টুডেন্ট ও টিচার)', 'Referral (students & teachers)', 'users', 'pricing'],
    ['reviews', 'রিভিউ', 'Reviews', 'check', 'reviews'],
    ['support', 'সাপোর্ট', 'Support', 'phone', 'support'],
    ['policies', 'পলিসি ম্যানেজার', 'Policies', 'shield', 'policies'],
    ['staff', 'কর্মী ও অ্যাক্সেস', 'Staff & access', 'users', 'staff'],
    ['export', 'ডাটা ডাউনলোড', 'Data export', 'download', null],
    ['settings', 'সেটিংস', 'Settings', 'menu', 'settings'],
    ['website', 'ওয়েবসাইট সেটিংস', 'Website settings', 'globe', 'settings'],
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
    return UI.tbl([T('আইডি', 'ID'), T('নাম', 'Name'), T('কালেকশন', 'Collected'), T('কোম্পানি', 'Company'), T('টিচার শেয়ার', 'Teacher'), T('পরিশোধিত', 'Paid'), T('পাওনা', 'Payable')], TEACHERS.map(t => { const e = PX.teacherEarn(t.id); return [idc(t.pid), `<b class="nm">${esc(t.n.bn)}</b>`, mny(e.gross), `${mny(e.company)} (${n(e.share)}%)`, mny(e.mine), mny(e.paid), e.due ? `<b>${mny(e.due)}</b>` : '—']; }));
  }

  /* ---------- টিচার আবেদন ---------- */
  def.applications = ['applications', () => {
    const f = PX.S.tab.apf || 'pending';
    return UI.tabs('apf', [['pending', T('অপেক্ষমাণ', 'Pending')], ['approved', T('অনুমোদিত', 'Approved')], ['rejected', T('বাতিল', 'Rejected')]], f) +
      UI.card(T('টিচার ভর্তি ও অনুমোদন', 'Teacher admission'), UI.tbl([T('আইডি', 'ID'), T('নাম', 'Name'), T('প্রতিষ্ঠান', 'Institution'), T('বিষয়', 'Subjects'), T('তারিখ', 'Date'), T('ব্যাজ', 'Badges'), ''], DB.apps.filter(a => a.status === f).map(a => [idc(a.id), `<b class="nm">${esc(a.name)}</b>`, `${esc(a.inst)} · ${esc(a.dept)}`, a.subjects.map(s => esc(L(SUBJECTS.find(x => x.id === s)))).join(', '), fd(a.date), `${a.badges.id ? '✓ID ' : ''}${a.badges.pay ? '✓Pay ' : ''}${a.badges.doc ? '✓Doc' : ''}` || '—', `<button class="btn btn-o btn-sm" data-pa="apview" data-id="${a.id}">${T('খুলুন', 'Open')}</button>`])));
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
    const rows = TEACHERS.map(t => { const e = PX.teacherEarn(t.id), bd = DB.banned[t.id]; return [idc(t.pid), `<b class="nm">${esc(t.n.bn)}</b>`, esc(L(t.inst)), esc(t.phone || '—'), groupChip(t.id), n(COURSES.filter(c => c.teacher === t.id).length), n(new Set(COURSES.filter(c => c.teacher === t.id).flatMap(c => PX.roster(c.id).map(u => u.id))).size), mny(e.gross), `<input class="sh" type="number" min="0" max="100" value="${e.share}" data-pc="share" data-tid="${t.id}"> %`, bd ? UI.chip(T('ব্যান', 'Banned'), 'bad') : UI.chip(T('সক্রিয়', 'Active'), 'ok'), `<button class="btn btn-p btn-sm" data-pa="profview" data-kind="t" data-id="${t.id}">${T('খুলুন', 'Open')}</button> <button class="btn btn-o btn-sm" data-pa="msgto" data-kind="t" data-id="${t.id}" title="${T('মেইল / মেসেজ', 'Mail / message')}">${ic('chat')}</button> <button class="btn btn-o btn-sm" data-pa="ban" data-tid="${t.id}">${bd ? T('আনব্যান', 'Unban') : T('ব্যান', 'Ban')}</button>`]; });
    const ap = DB.apps.filter(a => a.status === 'approved').map(a => ['—', `<b class="nm">${esc(a.name)}</b>`, esc(a.inst), esc(a.phone || '—'), '—', '0', '0', mny(0), '—', UI.chip(T('নতুন', 'New'), 'info'), '']);
    return UI.card(T('সব টিচার', 'All teachers'), PX.exportTop('a', 'teachers') + UI.tbl([T('আইডি', 'ID'), T('নাম', 'Name'), T('প্রতিষ্ঠান', 'Institution'), T('ফোন', 'Phone'), T('গ্রুপ', 'Group'), T('কোর্স', 'Courses'), T('স্টুডেন্ট', 'Students'), T('কালেকশন', 'Gross'), T('কোম্পানি শেয়ার', 'Company share'), T('অবস্থা', 'Status'), ''], rows.concat(ap))) + `<p class="soft">${T('“কোম্পানি শেয়ার” টিচারের গ্রুপের পেমেন্ট টার্ম অনুযায়ী হিসাব হয়। এখানে সংখ্যা বদলালে ওই টিচারের জন্য আলাদা ফিক্সড % চালু হয় (গ্রুপের নিয়ম বাদ দিয়ে)।', 'Company share follows the teacher\'s group payment terms. Typing a number here sets a custom fixed % for that teacher and overrides the group rule.')}</p>`;
  }];
  A.ban = a => { DB.banned[a.dataset.tid] = !DB.banned[a.dataset.tid]; PX.refresh(); };
  PX.CHG.share = el => { const v = Math.max(0, Math.min(100, +el.value || 0)); DB.settings.shareTid[el.dataset.tid] = v; PX.toast(T('শেয়ার হার হালনাগাদ', 'Share updated')); PX.refresh(); };

  /* ---------- কোর্স ---------- */
  def.courses = ['courses', () => {
    const rv = DB.newCourses.filter(c => c.status === 'review');
    return UI.card(T('অনুমোদনের অপেক্ষায়', 'Awaiting approval'), UI.tbl([T('কোর্স', 'Course'), T('টিচার', 'Teacher'), T('মূল্য (গ্রুপ)', 'Price (group)'), T('জমা', 'Submitted'), ''], rv.map(c => [esc(c.title), esc(TEACH(c.tid).n.bn), priceTxt(c), fd(c.date), `<button class="btn btn-o btn-sm" data-pa="cview" data-id="${c.id}">${T('রিভিউ', 'Review')}</button>`])), `<a class="btn btn-p btn-sm" href="#a-newcourse">${ic('plus')} ${T('যে কোনো টিচারের জন্য কোর্স তৈরি', 'Create course for any teacher')}</a>`) +
      UI.card(T('সব লাইভ কোর্স', 'All live courses'), PX.exportTop('a', 'courses') + UI.tbl([T('কোর্স', 'Course'), T('টিচার', 'Teacher'), T('স্টুডেন্ট', 'Students'), T('অবস্থা', 'Status'), ''], COURSES.map(c => [bn(c.title), esc(TEACH(c.teacher).n.bn), n(PX.roster(c.id).length), UI.stChip('live'), `<button class="btn btn-o btn-sm" data-pa="exhist" data-kind="cstu" data-id="${c.id}" data-fmt="xlsx" title="${T('স্টুডেন্ট ও পেমেন্ট — Excel', 'Students & payments — Excel')}">${ic('download')} Excel</button> <button class="btn btn-o btn-sm" data-pa="exhist" data-kind="cstu" data-id="${c.id}" data-fmt="pdf">${ic('download')} PDF</button> <button class="btn btn-o btn-sm" data-pa="coff" data-id="${c.id}">${T('সাইট থেকে বন্ধ', 'Take off site')}</button>`])) +
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

  def.export = [null, () => PX.exportUI('a')];
  def.website = ['settings', () => PX.siteUI()];
  /* ---------- স্টুডেন্ট CRM ---------- */
  def.students = ['students', () => {
    const q = (PX.S.q || '').toLowerCase();
    const l = DB.crm;
    return UI.card(T('স্টুডেন্ট তালিকা', 'Students'), `<div class="bar-t"><span class="bar-b">${PX.exportBtns('a', 'students')} <button class="btn btn-o btn-sm" data-pa="qenrol">${ic('plus')} ${T('আইডি দিয়ে এনরোল', 'Enrol by ID')}</button> <button class="btn btn-p btn-sm" data-pa="newstu">${ic('plus')} ${T('নতুন স্টুডেন্ট', 'New student')}</button></span></div>` +
      UI.tbl([T('আইডি', 'ID'), T('নাম', 'Name'), T('ফোন', 'Phone'), T('জেলা', 'District'), T('কোর্স', 'Courses'), T('অবস্থা', 'Status'), ''], l.map(u => [idc(u.sid), `<b class="nm">${esc(u.name)}</b>`, esc(u.phone), esc(u.district), n(u.courses.length), u.blocked ? UI.chip(T('ব্লক', 'Blocked'), 'bad') : UI.chip(T('সক্রিয়', 'Active'), 'ok'), `<button class="btn btn-p btn-sm" data-pa="stuview" data-id="${u.id}">${T('খুলুন', 'Open')}</button> <button class="btn btn-o btn-sm" data-pa="profview" data-kind="s" data-id="${u.id}">${T('প্রোফাইল', 'Profile')}</button> <button class="btn btn-o btn-sm" data-pa="msgto" data-kind="s" data-id="${u.id}" title="${T('মেইল / মেসেজ', 'Mail / message')}">${ic('chat')}</button>`])));
  }];
  PX.CHG.q = el => { PX.S.q = el.value; PX.S.qfocus = true; PX.refresh(); const i = document.querySelector('.srch'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } };
  A.stuview = a => {
    const u = stu(a.dataset.id), pays = DB.pays.filter(p => p.sid === u.id);
    PX.modal(esc(u.name), `<p class="soft">${esc(u.phone)} · ${esc(u.email)} · ${esc(u.district)} · ${esc(u.level)}<br>${T('অভিভাবক', 'Guardian')}: ${esc(u.guardian.name)} (${esc(u.guardian.phone)})</p><h4 class="sub">${T('এনরোল্ড কোর্স', 'Enrolled')}</h4>${u.courses.map(c => `<div class="row-i"><div>${bn(COURSE(c).title)}</div></div>`).join('') || '—'}<h4 class="sub">${T('পেমেন্ট', 'Payments')} <span class="bar-b"><button class="btn btn-o btn-sm" data-pa="exhist" data-kind="spay" data-id="${u.id}" data-fmt="xlsx">${ic('download')} Excel</button> <button class="btn btn-o btn-sm" data-pa="exhist" data-kind="spay" data-id="${u.id}" data-fmt="pdf">${ic('download')} PDF</button></span></h4>${UI.tbl([T('তারিখ', 'Date'), T('পরিমাণ', 'Amount'), T('অবস্থা', 'Status')], pays.map(p => [fd(p.date), mny(p.amount), UI.stChip(p.status)]))}
      <form data-pf="enroll" data-id="${u.id}" class="fgrid">${PX.idField('cq', T('কোর্সে এনরোল (কোর্স আইডি)', 'Enroll in course (course ID)'), 'c', true)}<div class="fld half"><label>&nbsp;</label><button class="btn btn-p btn-sm">${T('এনরোল', 'Enroll')}</button></div></form>
      <form data-pf="stunote" data-id="${u.id}">${UI.fi({ name: 'note', label: T('CRM নোট', 'CRM note'), rows: 2, val: (DB.notes[u.id] || '') })}<div class="btns"><button class="btn btn-o btn-sm">${T('নোট সংরক্ষণ', 'Save note')}</button> <button type="button" class="btn btn-o btn-sm danger" data-pa="stublock" data-id="${u.id}">${u.blocked ? T('আনব্লক', 'Unblock') : T('ব্লক', 'Block')}</button></div></form>`, true);
  };
  F.enroll = (f, d) => { const u = stu(f.dataset.id), r = PX.pick1('c', d.cq); if (r.err) { PX.toast(r.err); return; } const c = r.v; if (u.courses.includes(c.id)) { PX.toast(T('স্টুডেন্ট এই কোর্সে আগেই আছে', 'Already enrolled')); return; } if (!c.formats.includes('one')) { if (c.seats <= 0) { PX.toast(T('এই ব্যাচের সিট পূর্ণ', 'This batch is full')); return; } c.seats--; } u.courses.push(c.id); DB.pays.push({ id: 'p' + DB.nextPid++, sid: u.id, cid: c.id, amount: pricingFor(c)[c.formats[0]].perD, ch: 'cash', status: 'pending', date: TODAY, note: 'অ্যাডমিন এনরোল' }); PX.closeModal(); PX.toast(T('এনরোল করা হয়েছে: ', 'Enrolled: ') + L(c.title)); PX.refresh(); };
  F.stunote = (f, d) => { DB.notes[f.dataset.id] = d.note; PX.toast(T('নোট সংরক্ষিত', 'Saved')); };
  A.stublock = a => { const u = stu(a.dataset.id); u.blocked = !u.blocked; PX.closeModal(); PX.refresh(); };
  A.qenrol = () => PX.modal(T('আইডি দিয়ে ম্যানুয়াল এনরোল', 'Manual enrolment by ID'), `<form data-pf="qenrol" class="fgrid">${PX.idField('sq', T('স্টুডেন্ট (আইডি / ফোন / নাম)', 'Student (ID / phone / name)'), 's', true)}${PX.idField('cq', T('কোর্স আইডি', 'Course ID'), 'c', true)}<div class="fld"><button class="btn btn-p">${T('এনরোল করুন', 'Enrol')}</button></div></form>`);
  F.qenrol = (f, d) => { const s = PX.pick1('s', d.sq), c = PX.pick1('c', d.cq); if (s.err || c.err) { PX.toast(s.err || c.err); return; } const u = s.v; if (u.courses.includes(c.v.id)) { PX.toast(T('স্টুডেন্ট এই কোর্সে আগেই আছে', 'Already enrolled')); return; } if (!c.v.formats.includes('one')) { if (c.v.seats <= 0) { PX.toast(T('এই ব্যাচের সিট পূর্ণ', 'This batch is full')); return; } c.v.seats--; } u.courses.push(c.v.id); DB.pays.push({ id: 'p' + DB.nextPid++, sid: u.id, cid: c.v.id, amount: pricingFor(c.v)[c.v.formats[0]].perD, ch: 'cash', status: 'pending', date: TODAY, note: 'অ্যাডমিন এনরোল' }); PX.closeModal(); PX.toast(T('এনরোল করা হয়েছে: ', 'Enrolled: ') + u.name + ' → ' + L(c.v.title)); PX.refresh(); };
  A.newstu = () => PX.modal(T('নতুন স্টুডেন্ট', 'New student'), `<form data-pf="newstu" class="fgrid">${UI.fi({ name: 'name', label: T('নাম', 'Name'), req: 1, half: 1 })}${UI.fi({ name: 'phone', label: T('ফোন', 'Phone'), req: 1, half: 1 })}${UI.fi({ name: 'district', label: T('জেলা', 'District'), half: 1 })}${PX.idField('cq', T('কোর্স আইডি (ঐচ্ছিক)', 'Course ID (optional)'), 'c', false)}<div class="fld"><button class="btn btn-p">${T('তৈরি করুন', 'Create')}</button></div></form>`);
  F.newstu = (f, d) => { const id = 'u' + (DB.crm.length + 1), r = (d.cq || '').trim() ? PX.pick1('c', d.cq) : { v: null }; if (r.err) { PX.toast(r.err); return; } const sid = Math.max(20000, ...DB.crm.map(x => x.sid || 0)) + 1; DB.crm.push({ id, sid, name: d.name, phone: d.phone, email: id + '@example.com', district: d.district || '—', level: '—', joined: TODAY, courses: r.v ? [r.v.id] : [], notes: [], blocked: false, ref: '', guardian: { name: '—', phone: '—' } }); PX.closeModal(); PX.toast(T('স্টুডেন্ট তৈরি হয়েছে। আইডি: ', 'Student created. ID: ') + sid); PX.refresh(); };

  /* ---------- পেমেন্ট ---------- */
  def.payments = ['payments', () => {
    const f = PX.S.tab.pyf || 'all', l = DB.pays.filter(p => f === 'all' || p.status === f).sort((a, b) => b.date.localeCompare(a.date));
    const tot = DB.pays.filter(p => p.status === 'confirmed').reduce((a, p) => a + p.amount, 0);
    return `<div class="kpis">${UI.kpi(T('নিশ্চিত মোট', 'Confirmed'), mny(tot), '', 'ok')}${UI.kpi(T('অপেক্ষমাণ', 'Pending'), n(DB.pays.filter(p => p.status === 'pending').length), '', 'warn')}${UI.kpi(T('অনলাইন গেটওয়ে', 'Online gateway'), T('বন্ধ', 'Off'), T('ক্যাশ চালু', 'cash on'))}</div>` + UI.tabs('pyf', [['all', T('সব', 'All')], ['pending', T('অপেক্ষমাণ', 'Pending')], ['confirmed', T('নিশ্চিত', 'Confirmed')]], f) +
      UI.card(T('পেমেন্ট তালিকা', 'Payments'), PX.exportTop('a', 'payments') + UI.tbl([T('পেমেন্ট আইডি', 'Payment ID'), T('তারিখ', 'Date'), T('স্টুডেন্ট আইডি', 'Student ID'), T('স্টুডেন্ট', 'Student'), T('কোর্স', 'Course'), T('মাধ্যম', 'Method'), T('পরিমাণ', 'Amount'), T('অবস্থা', 'Status'), ''], l.slice(0, 60).map(p => [idc(String(p.id).toUpperCase()), fd(p.date), idc(stu(p.sid).sid), `<b class="nm">${esc(stu(p.sid).name)}</b>`, bn(COURSE(p.cid).title), chTxt(p.ch) + (p.ref ? `<small>${T('রেফ', 'Ref')}: ${esc(p.ref)}</small>` : ''), mny(p.amount) + (p.discount ? `<small>${T('ছাড়', 'Disc.')} −${mny(p.discount)}</small>` : ''), UI.stChip(p.status), `<button class="btn ${p.status === 'pending' ? 'btn-o' : 'btn-p'} btn-sm" data-pa="payview" data-id="${p.id}">${T('খুলুন', 'Open')}</button>` + (p.status === 'pending' ? ` <button class="btn btn-p btn-sm" data-pa="payok" data-id="${p.id}">${T('নিশ্চিত করুন', 'Confirm')}</button>` : '')])), `<button class="btn btn-o btn-sm" data-pa="manpay">${ic('plus')} ${T('ম্যানুয়াল এন্ট্রি', 'Manual entry')}</button>`);
  }];
  A.payview = a => {
    const p = DB.pays.find(x => x.id === a.dataset.id); if (!p) return; const u = stu(p.sid), c = COURSE(p.cid);
    PX.modal(`${T('পেমেন্ট', 'Payment')} ${esc(String(p.id).toUpperCase())}`, UI.tbl([T('বিষয়', 'Field'), T('তথ্য', 'Detail')], [
      [T('তারিখ', 'Date'), fd(p.date)], [T('স্টুডেন্ট', 'Student'), `${esc(u.name)} ${idc(u.sid)}`], [T('কোর্স', 'Course'), bn(c.title)], [T('মাধ্যম', 'Method'), chTxt(p.ch)], [T('রেফারেন্স', 'Reference'), esc(p.ref || '—')],
      [T('পরিমাণ', 'Amount'), mny(p.amount)], [T('ছাড়', 'Discount'), p.discount ? mny(p.discount) : '—'], [T('অবস্থা', 'Status'), UI.stChip(p.status)], [T('নোট', 'Note'), esc(p.note || '—')]]) +
      (p.status === 'pending' ? `<div class="btns"><button class="btn btn-p" data-pa="payok" data-id="${p.id}">${T('নিশ্চিত করুন', 'Confirm')}</button></div>` : ''));
  };
  const PM = [['bKash', 'বিকাশ', 'bKash'], ['Nagad', 'নগদ', 'Nagad'], ['Bank transfer', 'ব্যাংক ট্রান্সফার', 'Bank transfer'], ['Payment gateway', 'পেমেন্ট গেটওয়ে', 'Payment gateway'], ['cash', 'ক্যাশ', 'Cash']];
  const chTxt = ch => { const m = PM.find(x => x[0].toLowerCase() === String(ch).toLowerCase()); return m ? T(m[1], m[2]) : esc(ch); };
  PX.chTxt = chTxt;
  /* পেমেন্ট কনফার্ম পপআপ: মাধ্যম, পরিমাণ, ডিসকাউন্ট, রেফারেন্স আইডি */
  A.payok = a => {
    const p = DB.pays.find(x => x.id === a.dataset.id); if (!p) return; const u = stu(p.sid), c = COURSE(p.cid);
    PX.modal(T('পেমেন্ট কনফার্ম', 'Confirm payment'), `<p class="soft"><b>${esc(u.name)}</b> · ${bn(c.title)}</p>
      <form data-pf="payconfirm" data-id="${p.id}" data-list="${p.amount}" class="fgrid">
        ${UI.fi({ name: 'ch', label: T('পেমেন্ট মাধ্যম', 'Payment method'), req: 1, opts: PM.map(m => [m[0], T(m[1], m[2])]), val: PM.some(m => m[0] === p.ch) ? p.ch : 'bKash' })}
        <div class="fld half"><label>${T('কোর্সের মূল্য (৳)', 'Course price (BDT)')}</label><input name="list" type="number" min="1" value="${p.amount}" data-pi="pcdisc" required></div>
        ${UI.fi({ name: 'dtype', label: T('ডিসকাউন্ট', 'Discount'), half: 1, opts: [['none', T('নেই', 'None')], ['amt', T('নির্দিষ্ট টাকা (৳)', 'Fixed amount (BDT)')], ['pct', T('শতকরা (%)', 'Percent (%)')]], val: 'none' })}
        <div class="fld half"><label>${T('ডিসকাউন্টের পরিমাণ', 'Discount value')}</label><input name="dval" type="number" min="0" step="any" value="0" data-pi="pcdisc"></div>
        ${UI.fi({ name: 'dnote', label: T('ডিসকাউন্টের কারণ (ঐচ্ছিক)', 'Discount reason (optional)'), half: 1 })}
        <div class="fld full pc-tot"><span>${T('চূড়ান্ত পেমেন্ট', 'Final amount')}</span><b id="pc-final">${mny(p.amount)}</b></div>
        ${UI.fi({ name: 'ref', label: T('রেফারেন্স আইডি (ট্রানজ্যাকশন আইডি)', 'Reference ID (transaction ID)'), req: 1, ph: 'e.g. BKX7A92K41' })}
        <div class="fld"><small class="err" id="pc-err" role="alert"></small><button class="btn btn-p">${ic('check')} ${T('পেমেন্ট কনফার্ম করুন', 'Confirm payment')}</button></div></form>`);
    const dt = document.querySelector('#pmodal [name=dtype]'); if (dt) dt.dataset.pi = 'pcdisc';
  };
  const pcCalc = f => { const list = +f.elements.list.value || 0, t = f.elements.dtype.value, v = +f.elements.dval.value || 0, disc = t === 'amt' ? v : t === 'pct' ? Math.round(list * v / 100) : 0; return { list, disc, final: list - disc }; };
  PX.CHG.pcdisc = el => { const r = pcCalc(el.form), o = document.getElementById('pc-final'); if (o) o.textContent = mny(Math.max(0, r.final)); };
  PX.CHG.pcdtype = PX.CHG.pcdisc;
  F.payconfirm = (f, d) => {
    const p = DB.pays.find(x => x.id === f.dataset.id), er = f.querySelector('#pc-err'), bad = m => { er.textContent = m; };
    const r = pcCalc(f), ref = (d.ref || '').trim();
    if (!p) return;
    if (!(r.list > 0)) return bad(T('কোর্সের মূল্য দিন', 'Enter the course price'));
    if (d.dtype === 'pct' && (+d.dval < 0 || +d.dval > 100)) return bad(T('শতকরা ০–১০০ এর মধ্যে হতে হবে', 'Percent must be between 0 and 100'));
    if (r.disc < 0 || r.disc >= r.list) return bad(T('ডিসকাউন্ট মূল্যের চেয়ে কম হতে হবে', 'Discount must be less than the price'));
    if (ref.length < 4) return bad(T('রেফারেন্স আইডি দিন (কমপক্ষে ৪ অক্ষর)', 'Enter the reference ID (at least 4 characters)'));
    if (DB.pays.some(x => x.id !== p.id && x.ref && x.ref.toLowerCase() === ref.toLowerCase())) return bad(T('এই রেফারেন্স আইডি আগেই ব্যবহৃত', 'This reference ID is already used'));
    Object.assign(p, { ch: d.ch, listAmount: r.list, discount: r.disc, discountNote: (d.dnote || '').trim(), amount: r.final, ref, confirmedAt: TODAY });
    PX.confirmPay(p.id); PX.closeModal(); PX.toast(T('পেমেন্ট নিশ্চিত; স্টুডেন্টের ক্লাস আনব্লক', 'Confirmed; student unblocked')); PX.refresh();
  };
  A.manpay = () => PX.modal(T('ম্যানুয়াল পেমেন্ট এন্ট্রি', 'Manual payment'), `<form data-pf="manpay" class="fgrid">${PX.idField('sq', T('স্টুডেন্ট (আইডি / ফোন / নাম)', 'Student (ID / phone / name)'), 's', true)}${PX.idField('cq', T('কোর্স আইডি', 'Course ID'), 'c', true)}${UI.fi({ name: 'amount', label: T('পরিমাণ ৳', 'Amount'), type: 'number', req: 1, half: 1, min: 1 })}${UI.fi({ name: 'ch', label: T('মাধ্যম', 'Method'), half: 1, opts: [['cash', T('ক্যাশ', 'Cash')], ['bank', T('ব্যাংক', 'Bank')]] })}<div class="fld"><button class="btn btn-p">${T('যোগ করুন', 'Add')}</button></div></form>`);
  F.manpay = (f, d) => { const s = PX.pick1('s', d.sq), c = PX.pick1('c', d.cq); if (s.err || c.err) { PX.toast(s.err || c.err); return; } const id = 'p' + DB.nextPid++; DB.pays.unshift({ id, sid: s.v.id, cid: c.v.id, amount: +d.amount, ch: d.ch, status: 'pending', date: TODAY, note: 'Manual' }); if (!s.v.courses.includes(c.v.id)) s.v.courses.push(c.v.id); PX.confirmPay(id); PX.closeModal(); PX.toast(T('পেমেন্ট যোগ হয়েছে', 'Added')); PX.refresh(); };

  /* ---------- পেআউট ---------- */
  def.payouts = ['payouts', () => UI.card(T('টিচারভিত্তিক আয় ও পেআউট', 'Teacher earnings & payouts'), PX.exportTop('a', 'payouts') + UI.tbl([T('আইডি', 'ID'), T('নাম', 'Name'), T('কালেকশন', 'Collected'), T('কোম্পানি', 'Company'), T('টিচার', 'Teacher'), T('পরিশোধিত', 'Paid'), T('পাওনা', 'Payable'), T('পেআউট মেথড', 'Payout method'), T('চার্জ / নিট', 'Charge / net'), ''], TEACHERS.map(t => { const e = PX.teacherEarn(t.id), pm = PX.payMethod(t.id), chg = PX.payCharge(t.id, e.due); return [idc(t.pid), `<b class="nm">${esc(t.n.bn)}</b>`, mny(e.gross), `${mny(e.company)} (${n(e.share)}%)`, mny(e.mine), mny(e.paid), mny(e.due), pm ? esc((pm.kind === 'bank' ? T('ব্যাংক', 'Bank') : T('ওয়ালেট', 'Wallet')) + ': ' + pm.label) : UI.chip(T('যোগ করেননি', 'Not added'), 'warn'), pm ? `${mny(chg)} / ${mny(e.due - chg)}` : '—', e.due ? `<button class="btn btn-p btn-sm" data-pa="paynout" data-tid="${t.id}">${T('পেআউট', 'Pay out')}</button>` : '']; }))) + UI.card(T('পেআউট ইতিহাস', 'Payout history'), UI.tbl([T('তারিখ', 'Date'), T('টিচার আইডি', 'Teacher ID'), T('নাম', 'Name'), T('পরিমাণ', 'Amount'), T('চার্জ (টিচারের)', 'Charge (teacher)'), T('নিট', 'Net'), T('মেথড', 'Method'), T('রেফারেন্স', 'Reference'), T('নোট', 'Note')], DB.payouts.map(p => [fd(p.date), idc(TEACH(p.tid).pid), `<b class="nm">${esc(TEACH(p.tid).n.bn)}</b>`, mny(p.amount), mny(p.charge || 0), mny(p.amount - (p.charge || 0)), esc(p.method || '—'), esc(p.ref || '—'), esc(p.note || '')]))) + `<p class="soft">${T('কোম্পানির শেয়ার ডিফল্ট ' + n(DB.settings.share) + '% (সেটিংসে বদলানো যায়; প্রতি টিচারের আলাদা হারও দেওয়া যায়)।', 'Default company share ' + DB.settings.share + '% — editable in Settings and per teacher.')}</p>`];
  /* ---------- পেআউট পপআপ: ম্যানুয়াল / এপিআই ---------- */
  const PO_M = [['bank', 'ব্যাংক ট্রান্সফার', 'Bank transfer'], ['bkash', 'বিকাশ', 'bKash'], ['nagad', 'নগদ', 'Nagad'], ['gpay', 'জিপে (GPay)', 'GPay'], ['cash', 'নগদ টাকা / অন্যান্য', 'Cash / other']];
  const poName = k => { const m = PO_M.find(x => x[0] === k); return m ? T(m[1], m[2]) : k; };
  const poRate = k => (k === 'bkash' || k === 'nagad' || k === 'gpay') ? PX.cashRate(k) : 0;
  const poMask = x => String(x).length > 4 ? '••••' + String(x).slice(-4) : x;
  const poInfo = tid => {
    const a = (DB.payAcc || {})[tid] || {}, pm = PX.payMethod(tid), pref = pm ? pm.kind : '';
    if (!a.bank && !a.wallet) return `<div class="alert warn"><div><p>${T('এই টিচার এখনো কোনো পেমেন্ট তথ্য (ব্যাংক / ওয়ালেট) যোগ করেননি। ম্যানুয়াল পেআউটে মেথড ও রেফারেন্স হাতে লিখে দিতে পারবেন।', 'This teacher has not added any payment details (bank / wallet) yet. You can still record a manual payout with a method and reference.')}</p></div></div>`;
    return `<div class="pm-g">${a.bank ? `<div class="pm ${pref === 'bank' ? 'on' : ''}"><b>${T('ব্যাংক', 'Bank')}</b> ${pref === 'bank' ? UI.chip(T('প্রধান', 'Preferred'), 'ok') : ''}<p>${esc(a.bank.bankName)} · ${esc(a.bank.branch)}</p><p>${esc(a.bank.accName)}</p><p>${T('অ্যাকাউন্ট', 'Account')}: <b>${esc(a.bank.accNo)}</b></p><p class="soft">${T('রাউটিং', 'Routing')}: ${esc(a.bank.routing)}</p></div>` : ''}${a.wallet ? `<div class="pm ${pref === 'wallet' ? 'on' : ''}"><b>${T('ওয়ালেট', 'Wallet')}</b> ${pref === 'wallet' ? UI.chip(T('প্রধান', 'Preferred'), 'ok') : ''}<p>${poName(a.wallet.type)}</p><p>${T('নম্বর', 'Number')}: <b>${esc(a.wallet.phone)}</b></p><p class="soft">${T('ক্যাশ-আউট চার্জ (টিচারের)', 'Cash-out charge (teacher)')}: ${n(PX.cashRate(a.wallet.type))}%</p></div>` : ''}</div>`;
  };
  A.paynout = a => {
    const tid = a.dataset.tid, t = TEACH(tid), e = PX.teacherEarn(tid), pm = PX.payMethod(tid), a0 = (DB.payAcc || {})[tid] || {};
    const defM = pm ? (pm.kind === 'bank' ? 'bank' : a0.wallet.type) : 'bank';
    PX.modal(`${T('পেআউট', 'Pay out')} — ${esc(t.n.bn)} <small class="idt">#${t.pid}</small>`, `
      <dl class="sum"><div><dt>${T('মোট পাওনা', 'Total payable')}</dt><dd>${mny(e.due)}</dd></div><div><dt>${T('পরিশোধিত', 'Paid so far')}</dt><dd>${mny(e.paid)}</dd></div></dl>
      <div class="po-tabs" role="tablist"><button type="button" class="btn btn-p btn-sm" data-pa="pomode" data-m="manual" id="po-t-manual">${T('ম্যানুয়াল পেআউট', 'Manual payout')}</button><button type="button" class="btn btn-o btn-sm" data-pa="pomode" data-m="api" id="po-t-api">${T('এপিআই পেআউট', 'API payout')}</button></div>
      <div id="po-manual"><h4 class="sub">${T('টিচারের পেমেন্ট তথ্য — এখানে পেমেন্ট করুন', 'Teacher payment details — pay to this account')}</h4>${poInfo(tid)}
        <form data-pf="manpayout" data-tid="${tid}" class="fgrid">
          ${UI.fi({ name: 'date', label: T('পেআউট তারিখ', 'Payout date'), type: 'date', val: TODAY, half: 1, req: 1 })}
          ${UI.fi({ name: 'amount', label: T('পরিমাণ ৳', 'Amount ৳'), type: 'number', val: e.due, half: 1, req: 1, min: 1, hint: T('সর্বোচ্চ ' + n(e.due) + ' ৳', 'Max ৳' + e.due) })}
          ${UI.fi({ name: 'method', label: T('পেআউট মেথড', 'Payout method'), val: defM, half: 1, req: 1, opts: PO_M.map(x => [x[0], T(x[1], x[2])]) })}
          ${UI.fi({ name: 'ref', label: T('পেআউট রেফারেন্স', 'Payout reference'), half: 1, req: 1, ph: T('ট্রানজেকশন আইডি / রেফ নম্বর', 'Transaction ID / reference no.') })}
          ${UI.fi({ name: 'note', label: T('নোট (ঐচ্ছিক)', 'Note (optional)'), rows: 2 })}
          <div class="fld"><small class="err" id="po-err" role="alert"></small><button class="btn btn-p">${T('সাবমিট', 'Submit')}</button></div></form></div>
      <div id="po-api" hidden><div class="alert info"><div><p><b>${T('এপিআই পেআউট', 'API payout')}</b></p><p>${T('পেমেন্ট গেটওয়ে (bKash / ব্যাংক এপিআই) যুক্ত হলে এখান থেকে সরাসরি টিচারের অ্যাকাউন্টে পাঠানো যাবে। ডেমোতে এখনো যুক্ত নেই।', 'Once a payment gateway (bKash / bank API) is connected, you can send directly to the teacher account from here. Not connected in this demo.')}</p></div></div>${poInfo(tid)}<button class="btn btn-p" type="button" data-pa="poapi">${T('এপিআই দিয়ে পাঠান', 'Send via API')}</button></div>`, 1);
  };
  A.pomode = a => { const m = a.dataset.m; ['manual', 'api'].forEach(k => { document.getElementById('po-' + k).hidden = k !== m; const b = document.getElementById('po-t-' + k); b.className = 'btn btn-sm ' + (k === m ? 'btn-p' : 'btn-o'); }); };
  A.poapi = () => PX.toast(T('এপিআই পেআউট এখনো যুক্ত হয়নি — ম্যানুয়াল পেআউট ব্যবহার করুন', 'API payout is not connected yet — use manual payout'));
  F.manpayout = (f, d) => {
    const tid = f.dataset.tid, e = PX.teacherEarn(tid), er = f.querySelector('#po-err'), bad = m => { er.textContent = m; }, amt = Math.round(+d.amount);
    if (!d.date || d.date > TODAY) return bad(T('পেআউট তারিখ আজকের বা আগের হতে হবে', 'Payout date cannot be in the future'));
    if (!(amt >= 1) || amt > e.due) return bad(T('পরিমাণ ১ থেকে ' + n(e.due) + ' ৳ এর মধ্যে হতে হবে', 'Amount must be between 1 and ' + e.due));
    if (!(d.ref || '').trim()) return bad(T('পেআউট রেফারেন্স দিন', 'Enter the payout reference'));
    const charge = Math.round(amt * poRate(d.method) / 100);
    DB.payouts.unshift({ id: 'po' + (DB.payouts.length + 1), tid, amount: amt, charge, method: poName(d.method), ref: d.ref.trim(), mode: 'manual', date: d.date, note: (d.note || '').trim() });
    PX.closeModal(); PX.toast(T('ম্যানুয়াল পেআউট রেকর্ড হয়েছে', 'Manual payout recorded')); PX.refresh();
  };

  /* ---------- সাবস্ক্রিপশন ---------- */
  def.subs = ['subs', () => {
    const rows = [];
    DB.enr.forEach(e => rows.push([idc(DB.me.sid), `<b class="nm">${esc(DB.me.name)}</b>`, bn(COURSE(e.cid).title), e.m ? T(`প্রতি ${n(e.m)} মাসে ${mny(e.per)}`, `${mny(e.per)} / ${e.m} mo`) : T('একবারে', 'One-time'), e.nextDue ? fd(e.nextDue) : '—', UI.stChip(e.state), `<button class="btn btn-p btn-sm" data-pa="stuview" data-id="${DB.me.id}">${T('খুলুন', 'Open')}</button>` + (e.m ? ` <button class="btn btn-o btn-sm" data-pa="remind" data-name="${esc(DB.me.name)}">${T('রিমাইন্ডার', 'Remind')}</button> <button class="btn btn-o btn-sm" data-pa="subtoggle" data-cid="${e.cid}">${e.state === 'overdue' ? T('আনব্লক', 'Unblock') : T('ব্লক', 'Block')}</button>` : '')]));
    DB.crm.slice(1, 8).forEach(u => { const cid = u.courses[0], k = PX.H(u.id + cid), od = k % 5 === 0; rows.push([idc(u.sid), `<b class="nm">${esc(u.name)}</b>`, bn(COURSE(cid).title), T('মাসিক', 'Monthly'), fd(od ? '2026-11-15' : '2026-11-30'), UI.stChip(od ? 'overdue' : 'active'), `<button class="btn btn-p btn-sm" data-pa="stuview" data-id="${u.id}">${T('খুলুন', 'Open')}</button> <button class="btn btn-o btn-sm" data-pa="remind" data-name="${esc(u.name)}">${T('রিমাইন্ডার', 'Remind')}</button>`]); });
    return `<div class="alert warn">${ic('clock')}<div><b>${T('অটো রিমাইন্ডার', 'Auto reminders')}</b><p>${T('মাসিক প্ল্যানের স্টুডেন্টরা প্রতি মাসের শেষ দিনে রিমাইন্ডার পান। বকেয়া থাকলে পরের ক্লাসে যোগ দেওয়া বন্ধ থাকে এবং “এখনই সাবস্ক্রিপশন দিন” বাটন দেখায়।', 'Students on monthly plans are reminded on the last day of the month. Overdue plans block the next class.')}</p></div><button class="btn btn-o btn-sm" data-pa="remind" data-name="${T('সবাই', 'all')}">${T('সবাইকে পাঠান', 'Send to all')}</button></div>` + UI.card(T('সাবস্ক্রিপশন স্ট্যাটাস', 'Subscription status'), UI.tbl([T('স্টুডেন্ট আইডি', 'Student ID'), T('নাম', 'Name'), T('কোর্স', 'Course'), T('প্ল্যান', 'Plan'), T('পরবর্তী ডিউ', 'Next due'), T('অবস্থা', 'Status'), ''], rows));
  }];
  A.remind = a => PX.toast(T('রিমাইন্ডার পাঠানো হয়েছে: ', 'Reminder sent: ') + a.dataset.name);
  A.subtoggle = a => { const e = PX.myEnr(a.dataset.cid); e.state = e.state === 'overdue' ? 'active' : 'overdue'; PX.refresh(); };

  /* ---------- শিডিউল ---------- */
  def.schedule = ['schedule', () => UI.card(T('শিডিউল পরিবর্তনের অনুরোধ', 'Schedule change requests'), `<p class="soft">${T('টিচারকে রিশিডিউলের আগে অল্টারনেটিভ (বিকল্প) শিডিউল দিতে হয়। অনুমোদন দিলে ক্লাসের সময় ওই বিকল্পে বদলে যায় এবং স্টুডেন্টরা নতুন সময় দেখে।', 'A teacher must give an alternative schedule before rescheduling. On approval the class moves to the chosen alternative and students see the new time.')}</p>` + UI.tbl([T('টিচার', 'Teacher'), T('ক্লাস', 'Class'), T('বর্তমান শিডিউল', 'Current schedule'), T('অল্টারনেটিভ শিডিউল', 'Alternative schedule'), T('কারণ', 'Reason'), T('অবস্থা', 'Status'), ''], DB.resched.map(r => { const s0 = PX.session(r.sid) || {}; return [esc(TEACH(r.tid).n.bn), bn(COURSE(r.cid).title), `${fd(r.curDate || s0.date)} · ${esc(r.curTime || s0.time || '')}`, `<b>${T('১', '1')}. ${fd(r.newDate)} · ${esc(r.newTime)}</b>` + (r.alt2Date ? `<br><b>${T('২', '2')}. ${fd(r.alt2Date)} · ${esc(r.alt2Time || r.newTime)}</b>` : ''), esc(r.reason), UI.stChip(r.status) + (r.status === 'approved' && r.chosen ? `<small>${T('বিকল্প ' + r.chosen, 'Alt ' + r.chosen)}</small>` : ''), r.status === 'pending' ? `<button class="btn btn-p btn-sm" data-pa="rqok" data-id="${r.id}" data-alt="1">${r.alt2Date ? T('বিকল্প ১ অনুমোদন', 'Approve alt 1') : T('অনুমোদন', 'Approve')}</button>${r.alt2Date ? ` <button class="btn btn-p btn-sm" data-pa="rqok" data-id="${r.id}" data-alt="2">${T('বিকল্প ২ অনুমোদন', 'Approve alt 2')}</button>` : ''} <button class="btn btn-o btn-sm danger" data-pa="rqno" data-id="${r.id}">${T('বাতিল', 'Reject')}</button>` : '']; }))) + UI.card(T('বন্ধ করা ক্লাস', 'Blocked classes'), UI.tbl([T('টিচার', 'Teacher'), T('ক্লাস', 'Class'), T('তারিখ', 'Date')], DB.blocked.map(b => [esc(TEACH(COURSE(b.cid).teacher).n.bn), bn(COURSE(b.cid).title), fd(PX.session(b.sid).date)])))];
  A.rqok = a => { const r = DB.resched.find(x => x.id === a.dataset.id), alt2 = a.dataset.alt === '2' && r.alt2Date; r.status = 'approved'; r.chosen = alt2 ? 2 : 1; const s = PX.session(r.sid); if (!r.curDate && s) { r.curDate = s.date; r.curTime = s.time; } if (s) { s.date = alt2 ? r.alt2Date : r.newDate; s.time = alt2 ? (r.alt2Time || r.newTime) : r.newTime; } PX.toast(T('অনুমোদিত; ক্লাসের সময় বদলেছে', 'Approved; class rescheduled')); PX.refresh(); };
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
    return UI.card(T('কুপন তৈরি', 'Create coupon'), `<form data-pf="coupon" data-by="admin" class="fgrid">${UI.fi({ name: 'code', label: T('কোড', 'Code'), req: 1, half: 1 })}${UI.fi({ name: 'type', label: T('ধরন', 'Type'), half: 1, opts: [['pct', T('শতকরা %', 'Percent')], ['flat', T('ফিক্সড ৳', 'Fixed ৳')]] })}${UI.fi({ name: 'v', label: T('পরিমাণ', 'Value'), type: 'number', req: 1, half: 1, min: 1 })}${UI.fi({ name: 'scope', label: T('প্রযোজ্য (সব / টিচারের সব কোর্স / একটি কোর্স)', 'Applies to (all / a teacher\'s courses / one course)'), opts: PX.scopeOpts('') })}${UI.fi({ name: 'limit', label: T('সর্বোচ্চ ব্যবহার', 'Max uses'), type: 'number', val: 100, half: 1 })}${UI.fi({ name: 'expiry', label: T('মেয়াদ', 'Expiry'), type: 'date', val: '2026-12-31', half: 1 })}<div class="fld"><button class="btn btn-p btn-sm">${T('তৈরি', 'Create')}</button></div></form>`) +
      UI.card(T('সব কুপন (অ্যাডমিন ও টিচার)', 'All coupons'), PX.couponTbl(DB.coupons, true)) +
      `<div class="alert info">${ic('check')}<div><p>${T('রেফারেল বোনাস কনফিগ ও তালিকা এখন আলাদা “রেফারেল” মেনুতে — স্টুডেন্ট ও টিচারের জন্য আলাদা।', 'Referral bonus settings and lists moved to the separate “Referral” menu — separate for students and teachers.')} <a href="#a-referral">${T('রেফারেল খুলুন', 'Open referral')}</a></p></div></div>` +
      UI.card(T('ক্লাসের ধরন', 'Class types'), `<p class="soft">${T('কোর্স টাইপ (যেমন গ্রুপ অফ ৭), সর্বোচ্চ সিট ও নতুন টাইপ এখন আলাদা মেনুতে।', 'Course types (e.g. Group of 7), max seats and new types are managed in a separate menu.')} <a href="#a-programs">${T('প্রোগ্রাম ও কোর্স টাইপ খুলুন', 'Open Programs & course types')}</a></p><p class="soft">${T('মূল্য ও মেয়াদ (১/৩/৬/১২ মাস) টিচার কোর্স তৈরির সময় নির্ধারণ করে; অ্যাডমিন অনুমোদনের সময় যাচাই করে।', 'Tenure and price are set by teachers at course creation; admin reviews them.')}</p>`);
  }];
  /* ---------- রেফারেল: স্টুডেন্ট ও টিচার আলাদা ---------- */
  DB.refAll = DB.refAll || (() => {
    const me = DB.me || {}, crm = DB.crm || [];
    const st = (i) => crm[i] ? { n: crm[i].name, id: crm[i].sid } : { n: '—', id: '' };
    const s = DB.refS.map(x => Object.assign({ by: { n: me.name, id: me.sid } }, x, { paid: x.bonus > 0 }));
    s.push({ by: st(2), name: 'Nafisa Akter', date: '2026-11-12', status: 'enrolled', bonus: 200, paid: false }, { by: st(3), name: 'Fahim Reza', date: '2026-11-14', status: 'joined', bonus: 0, paid: false }, { by: st(4), name: 'Mahia Khan', date: '2026-11-19', status: 'enrolled', bonus: 200, paid: false });
    const tf = i => TEACHERS[i] ? { n: TEACHERS[i].n.bn, id: TEACHERS[i].pid } : { n: '—', id: '' };
    const t = DB.refT.map(x => Object.assign({ by: tf(0) }, x, { paid: x.bonus > 0 }));
    t.push({ by: tf(1), name: 'Shamim Ahmed', date: '2026-11-10', status: 'approved', bonus: 500, paid: false }, { by: tf(2), name: 'Tamanna Yasmin', date: '2026-11-17', status: 'applied', bonus: 0, paid: false });
    return { s, t };
  })();
  const RF_ST = { joined: ['warn', 'যুক্ত হয়েছে', 'Joined'], enrolled: ['ok', 'এনরোল করেছে', 'Enrolled'], applied: ['warn', 'আবেদন করেছে', 'Applied'], approved: ['ok', 'অনুমোদিত', 'Approved'] };
  const rfConv = x => x.status === 'enrolled' || x.status === 'approved';
  def.referral = ['pricing', () => {
    const k = PX.S.tab.rf || 's', st = k === 's', cfg = st ? DB.settings.refS : DB.settings.refT, rows = DB.refAll[k];
    const conv = rows.filter(rfConv), due = conv.filter(x => !x.paid).reduce((a, x) => a + x.bonus, 0), paid = rows.filter(x => x.paid).reduce((a, x) => a + x.bonus, 0);
    const rate = cfg.type === 'pct' ? n(cfg.v) + '%' : mny(cfg.v);
    return UI.tabs('rf', [['s', T('স্টুডেন্ট রেফারেল', 'Student referral')], ['t', T('টিচার রেফারেল', 'Teacher referral')]], k) +
      `<div class="kpis">${UI.kpi(T('মোট রেফারেল', 'Total referrals'), n(rows.length))}${UI.kpi(st ? T('এনরোল হয়েছে', 'Enrolled') : T('অনুমোদিত', 'Approved'), n(conv.length), '', 'ok')}${UI.kpi(T('বোনাস বাকি', 'Bonus due'), mny(due), '', due ? 'warn' : '')}${UI.kpi(T('বোনাস পরিশোধিত', 'Bonus paid'), mny(paid), '', 'ok')}</div>` +
      UI.card(st ? T('স্টুডেন্ট রেফারেল বোনাস কনফিগ', 'Student referral bonus config') : T('টিচার রেফারেল বোনাস কনফিগ', 'Teacher referral bonus config'), `<form data-pf="refcfg" data-k="${k}" class="fgrid">${UI.fi({ name: 'type', label: T('ধরন', 'Type'), half: 1, opts: [['pct', st ? T('শতকরা % (প্রথম পেমেন্টের)', 'Percent (of first payment)') : T('শতকরা %', 'Percent')], ['fixed', T('ফিক্সড ৳', 'Fixed ৳')]], val: cfg.type })}${UI.fi({ name: 'v', label: T('বোনাস', 'Bonus'), type: 'number', half: 1, val: cfg.v, min: 0, req: 1 })}<div class="fld"><p class="soft">${st ? T('বন্ধুকে রেফার করলে এনরোলমেন্টের পর স্টুডেন্ট পাবেন: ', 'A student earns this after the referred friend enrolls: ') : T('অন্য টিচারকে রেফার করলে অনুমোদনের পর টিচার পাবেন: ', 'A teacher earns this after the referred teacher is approved: ')}<b>${rate}</b></p><button class="btn btn-p btn-sm">${T('সংরক্ষণ', 'Save')}</button></div></form>`) +
      UI.card(st ? T('স্টুডেন্ট রেফারেল তালিকা', 'Student referral list') : T('টিচার রেফারেল তালিকা', 'Teacher referral list'), UI.tbl([st ? T('রেফারকারী স্টুডেন্ট', 'Referring student') : T('রেফারকারী টিচার', 'Referring teacher'), st ? T('রেফার করা স্টুডেন্ট', 'Referred student') : T('রেফার করা টিচার', 'Referred teacher'), T('তারিখ', 'Date'), T('অবস্থা', 'Status'), T('বোনাস', 'Bonus'), T('বোনাস অবস্থা', 'Bonus status'), ''], rows.map((x, i) => [`<b>${esc(x.by.n)}</b>`, esc(x.name), fd(x.date), UI.chip(T(RF_ST[x.status][1], RF_ST[x.status][2]), RF_ST[x.status][0]), x.bonus ? mny(x.bonus) : '—', !rfConv(x) ? '—' : x.paid ? UI.chip(T('পরিশোধিত', 'Paid'), 'ok') : UI.chip(T('বাকি', 'Due'), 'warn'), rfConv(x) && !x.paid ? `<button class="btn btn-p btn-sm" data-pa="refpay" data-k="${k}" data-i="${i}">${T('পরিশোধ', 'Mark paid')}</button>` : ''])));
  }];
  F.refcfg = (f, d) => { const k = f.dataset.k, v = +d.v; if (!(v >= 0) || (d.type === 'pct' && v > 100)) { PX.toast(T('বোনাসের পরিমাণ ঠিক নয়', 'Invalid bonus value')); return; } DB.settings[k === 's' ? 'refS' : 'refT'] = { type: d.type, v }; PX.toast(T('সংরক্ষিত', 'Saved')); PX.refresh(); };
  A.refpay = a => { const x = DB.refAll[a.dataset.k][+a.dataset.i]; if (!x) return; x.paid = true; PX.toast(T('বোনাস পরিশোধ হিসেবে চিহ্নিত', 'Bonus marked as paid')); PX.refresh(); };

  /* ---------- রিভিউ ---------- */
  def.reviews = ['reviews', () => {
    const by = TEACHERS.map(t => { const ids = COURSES.filter(c => c.teacher === t.id).map(c => c.id), l = DB.reviews.filter(r => ids.includes(r.cid)); return l.length ? [esc(t.n.bn), n(l.length), '★' + n((l.reduce((a, r) => a + r.overall, 0) / l.length).toFixed(1)), n(l.filter(r => r.overall <= 3).length)] : null; }).filter(Boolean);
    return UI.card(T('টিচারভিত্তিক সারাংশ', 'By teacher'), UI.tbl([T('টিচার', 'Teacher'), T('রিভিউ', 'Reviews'), T('গড়', 'Avg'), T('নেগেটিভ', 'Negative')], by)) + UI.card(T('কোর্স ও টিচার রিভিউ (পাবলিক সাইটে দেখায়)', 'Course & teacher reviews (shown on the public site)'), `<div class="bar-t"><span></span><span class="bar-b"><button class="btn btn-p btn-sm" data-pa="rvadd">${ic('plus')} ${T('রিভিউ যোগ করুন', 'Add review')}</button></span></div>` + UI.tbl([T('রিভিউয়ার', 'Reviewer'), T('টিচার', 'Teacher'), T('কোর্স', 'Course'), T('রেটিং', 'Rating'), T('রিভিউ', 'Review'), T('উৎস', 'Source'), ''], REVIEWS.map((r, i) => [`<b>${esc(L(r.name))}</b><small>${esc(L(r.from))}</small>`, r.teacher ? esc(TEACH(r.teacher).n.bn) : (COURSE(r.course) ? esc(TEACH(COURSE(r.course).teacher).n.bn) : '—'), COURSE(r.course) ? bn(COURSE(r.course).title) : '—', '★' + n(r.rating), esc(L(r.text).slice(0, 90)), r.by === 's' ? T('স্টুডেন্ট', 'Student') : r.by === 'a' ? T('অ্যাডমিন', 'Admin') : T('নমুনা', 'Sample'), `<button class="btn btn-o btn-sm danger" data-pa="rvdel" data-i="${i}">${T('মুছুন', 'Delete')}</button>`]))) + UI.card(T('ক্লাসভিত্তিক ফিডব্যাক', 'Class feedback'), PX.reviewRows(DB.reviews.slice().reverse()));
  }];
  A.rvadd = () => PX.modal(T('রিভিউ যোগ করুন', 'Add review'), `<form data-pf="rvadd" class="fgrid">
    ${UI.fi({ name: 'tid', label: T('টিচারের নাম', 'Teacher name'), req: 1, opts: TEACHERS.map(t => [t.id, t.n.bn + ' #' + t.pid]) })}
    ${UI.fi({ name: 'cid', label: T('কোর্স (ঐচ্ছিক)', 'Course (optional)'), opts: [['', T('শুধু টিচারের আন্ডারে', 'Under the teacher only')]].concat(COURSES.map(c => [c.id, L(c.title) + ' #' + c.pid])) })}
    ${UI.fi({ name: 'name', label: T('রিভিউয়ারের নাম', 'Reviewer name'), req: 1, half: 1 })}
    ${UI.fi({ name: 'from', label: T('পরিচয় (যেমন: অভিভাবক, ঢাকা)', 'Label (e.g. Parent, Dhaka)'), half: 1 })}
    ${UI.fi({ name: 'rating', label: T('রেটিং', 'Rating'), req: 1, half: 1, opts: [5, 4, 3, 2, 1].map(x => [x, '★'.repeat(x)]), val: 5 })}
    ${UI.fi({ name: 'text', label: T('রিভিউ', 'Review'), rows: 3, req: 1 })}
    ${PX.thumbField('', T('ছবি আপলোড (ঐচ্ছিক)', 'Photo (optional)'))}
    <div class="fld"><small class="err" id="rv-err" role="alert"></small><button class="btn btn-p">${T('রিভিউ যোগ করুন', 'Add review')}</button></div></form>`, 1);
  F.rvadd = (f, d) => {
    const er = f.querySelector('#rv-err'); if (!(d.name || '').trim() || !(d.text || '').trim()) { er.textContent = T('নাম ও রিভিউ লিখুন', 'Enter a name and a review'); return; }
    const c = d.cid ? COURSE(d.cid) : null; if (c && c.teacher !== d.tid) { er.textContent = T('কোর্সটি এই টিচারের নয়', 'This course does not belong to that teacher'); return; }
    REVIEWS.unshift({ id: 'rva' + (REVIEWS.length + 1), by: 'a', name: { bn: d.name.trim(), en: d.name.trim() }, from: { bn: (d.from || '').trim() || 'Student', en: (d.from || '').trim() || 'Student' }, course: d.cid || '', teacher: d.tid, rating: +d.rating, text: { bn: d.text.trim(), en: d.text.trim() }, date: TODAY, photo: d.thumb || '' });
    if (c) c.reviews = (c.reviews || 0) + 1;
    PX.closeModal(); PX.toast(T('রিভিউ যোগ হয়েছে', 'Review added')); PX.refresh();
  };
  A.rvdel = a => { REVIEWS.splice(+a.dataset.i, 1); PX.toast(T('রিভিউ মুছে ফেলা হয়েছে', 'Review deleted')); PX.refresh(); };

  /* ---------- সাপোর্ট ---------- */
  def.support = ['support', arg => arg ? tkDetail(arg) : tkList()];
  const tkWho = t => (t.by === 's' ? T('স্টুডেন্ট', 'Student') : T('টিচার', 'Teacher'));
  const tkLast = t => t.msgs.length ? t.msgs[t.msgs.length - 1].at : t.date;
  function tkList() {
    const f = PX.S.tab.tkf || 'all', cnt = s => DB.tickets.filter(t => s === 'all' || t.status === s).length, l = DB.tickets.filter(t => f === 'all' || t.status === f);
    return UI.tabs('tkf', [['all', T('সব', 'All') + ' (' + n(cnt('all')) + ')'], ['open', T('নতুন', 'Open') + ' (' + n(cnt('open')) + ')'], ['progress', T('চলমান', 'In progress') + ' (' + n(cnt('progress')) + ')'], ['closed', T('সমাধান', 'Closed') + ' (' + n(cnt('closed')) + ')']], f) +
      UI.card(T('সাপোর্ট টিকিট (স্টুডেন্ট ও টিচার)', 'Support tickets'), l.length ? UI.tbl([T('টিকিট আইডি', 'Ticket ID'), T('বিষয়', 'Subject'), T('কার কাছ থেকে', 'From'), T('বিভাগ', 'Category'), T('সর্বশেষ', 'Last update'), T('মেসেজ', 'Msgs'), T('অবস্থা', 'Status'), ''],
        l.map(t => [`<b>#${PX.tno(t)}</b>`, esc(t.subject), `${esc(t.name)} <small>${tkWho(t)}</small>`, esc(t.cat), fd(tkLast(t)), n(t.msgs.length), UI.stChip(t.status), `<a class="btn btn-o btn-sm" href="#a-support-${t.id}">${T('খুলুন', 'Open')}</a>`])) : UI.empty(T('কোনো টিকিট নেই', 'No tickets')));
  }
  function tkDetail(id) {
    const t = DB.tickets.find(x => x.id === id), back = `<p><a class="btn btn-o btn-sm" href="#a-support">← ${T('সব টিকিট', 'All tickets')}</a></p>`;
    if (!t) return back + UI.card('', UI.empty(T('টিকিট পাওয়া যায়নি', 'Ticket not found')));
    return back + UI.card(`#${PX.tno(t)} · ${esc(t.subject)}`, `<div class="tk-meta">${UI.stChip(t.status)} <span>${esc(t.name)} <small>${tkWho(t)}</small></span> · <span>${esc(t.cat)}</span> · <span>${fd(t.date)}</span></div>
      <div class="tk"><div class="msgs">${t.msgs.map(m => `<div class="msg ${m.from === 's' ? 'me' : ''}"><small>${m.from === 'u' ? esc(t.name) : T('সাপোর্ট', 'Support')} · ${fd(m.at)}</small>${m.text ? `<p>${esc(m.text)}</p>` : ''}${PX.attList(m.files)}</div>`).join('')}</div>
      <form class="chat-f" data-pf="tkreply" data-id="${t.id}" data-from="s"><input name="text" placeholder="${T('উত্তর দিন…', 'Reply…')}">${PX.attPick()}<button class="btn btn-p btn-sm">${T('পাঠান', 'Send')}</button>${t.status !== 'closed' ? `<button type="button" class="btn btn-o btn-sm" data-pa="tkclose" data-id="${t.id}">${T('সমাধান হয়েছে', 'Mark closed')}</button>` : `<button type="button" class="btn btn-o btn-sm" data-pa="tkreopen" data-id="${t.id}">${T('আবার খুলুন', 'Reopen')}</button>`}</form></div>`);
  }
  A.tkreopen = a => { DB.tickets.find(t => t.id === a.dataset.id).status = 'open'; PX.refresh(); };
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



  /* ---------- টিচার গ্রুপ ও পেমেন্ট টার্ম ---------- */
  DB.tgroups = DB.tgroups || [
    { id: 'g1', name: 'Premium teachers', kind: 'tier', first: 25, next: 20, members: ['t01', 't05'] },
    { id: 'g2', name: 'New teachers', kind: 'pct', pct: 35, members: ['t02', 't03'] },
    { id: 'g3', name: 'Fixed-fee teachers', kind: 'amt', amt: 300, members: ['t04'] },
  ];
  const groupOf = tid => DB.tgroups.find(g => g.members.includes(tid));
  const baseKey = id => String(id).replace(/-.*$/, '');
  const rankOf = (tid, cid) => { if (!cid) return 0; const keys = []; COURSES.filter(c => c.teacher === tid).forEach(c => { const k = baseKey(c.id); if (!keys.includes(k)) keys.push(k); }); return Math.max(0, keys.indexOf(baseKey(cid))); };
  PX.feeFor = (tid, cid, amt) => {
    if (tid in DB.settings.shareTid) return Math.round(amt * DB.settings.shareTid[tid] / 100);
    const g = groupOf(tid); if (!g) return Math.round(amt * DB.settings.share / 100);
    if (g.kind === 'pct') return Math.round(amt * g.pct / 100);
    if (g.kind === 'tier') return Math.round(amt * (rankOf(tid, cid) === 0 ? g.first : g.next) / 100);
    if (g.kind === 'amt') return Math.min(amt, g.amt);
    return Math.max(0, amt - g.tfix);
  };
  PX.teacherEarn = tid => {
    const cs = COURSES.filter(c => c.teacher === tid).map(c => c.id); let gross = 0, company = 0;
    DB.pays.filter(p => p.status === 'confirmed' && cs.includes(p.cid)).forEach(p => { gross += p.amount; company += PX.feeFor(tid, p.cid, p.amount); });
    (DB.p2p || []).forEach(x => { if (x.tid === tid && (x.status === 'paid' || x.status === 'done')) { gross += x.price; company += PX.feeFor(tid, null, x.price); } });
    const paid = DB.payouts.filter(p => p.tid === tid).reduce((a, p) => a + p.amount, 0), mine = gross - company;
    return { gross, share: gross ? Math.round(company / gross * 1000) / 10 : (tid in DB.settings.shareTid ? DB.settings.shareTid[tid] : DB.settings.share), company, mine, paid, due: Math.max(0, mine - paid) };
  };
  const KINDS = { pct: ['ফিক্সড শতাংশ (প্রতি পেমেন্টে প্ল্যাটফর্ম ফি %)', 'Fixed % (platform fee on every payment)'], tier: ['ভ্যারিয়েবল: প্রথম কোর্সে এক হার, পরের কোর্সে আরেক হার', 'Variable: one % on the first course, another on later courses'], amt: ['ফিক্সড টাকা (প্রতি পেমেন্টে প্ল্যাটফর্ম ফি ৳)', 'Fixed amount (platform fee ৳ per payment)'], tfix: ['ফিক্সড পেমেন্ট টিচারকে (প্রতি পেমেন্টে টিচার ৳, বাকিটা প্ল্যাটফর্ম ফি)', 'Fixed payment to teacher (teacher gets ৳ per payment, rest is platform fee)'] };
  const termTxt = g => g.kind === 'pct' ? T(`ফিক্সড ${n(g.pct)}% প্ল্যাটফর্ম ফি`, `Fixed ${g.pct}% platform fee`) : g.kind === 'tier' ? T(`প্রথম কোর্সে ${n(g.first)}%, পরের কোর্সে ${n(g.next)}% (ভ্যারিয়েবল)`, `${g.first}% on first course, ${g.next}% on later courses (variable)`) : g.kind === 'amt' ? T(`ফিক্সড ${mny(g.amt)} প্ল্যাটফর্ম ফি প্রতি পেমেন্টে`, `Fixed ${mny(g.amt)} platform fee per payment`) : T(`টিচার পান ফিক্সড ${mny(g.tfix)} প্রতি পেমেন্টে`, `Teacher gets fixed ${mny(g.tfix)} per payment`);
  const exTxt = g => { const a = 3000, fee = g.kind === 'pct' ? Math.round(a * g.pct / 100) : g.kind === 'tier' ? Math.round(a * g.first / 100) : g.kind === 'amt' ? Math.min(a, g.amt) : Math.max(0, a - g.tfix); return `${mny(a)} → ${T('প্ল্যাটফর্ম', 'platform')} ${mny(fee)} / ${T('টিচার', 'teacher')} ${mny(a - fee)}`; };
  const groupChip = tid => { const g = groupOf(tid); return tid in DB.settings.shareTid ? UI.chip(T('কাস্টম %', 'Custom %'), 'warn') : g ? UI.chip(esc(g.name), 'info') : `<small class="soft">${T('ডিফল্ট', 'Default')}</small>`; };
  const listUI = def.teachers[1];
  const groupsUI = () => UI.card(T('টিচার গ্রুপ ও পেমেন্ট টার্ম', 'Teacher groups & payment terms'), `<div class="pm-bar"><button class="btn btn-p btn-sm" data-pa="tgform">${ic('plus')} ${T('নতুন গ্রুপ', 'New group')}</button></div>` +
    UI.tbl([T('গ্রুপ', 'Group'), T('পেমেন্ট টার্ম', 'Payment terms'), T('৳৩,০০০ পেমেন্টে (প্রথম কোর্স)', 'On a ৳3,000 payment (first course)'), T('টিচার', 'Teachers'), ''], DB.tgroups.map(g => [`<b>${esc(g.name)}</b>`, termTxt(g), exTxt(g), g.members.length ? g.members.map(id => esc(L(TEACH(id).n))).join(', ') : '—', `<button class="btn btn-o btn-sm" data-pa="tgform" data-id="${g.id}">${T('এডিট', 'Edit')}</button> <button class="btn btn-o btn-sm" data-pa="tgdel" data-id="${g.id}">${T('মুছুন', 'Delete')}</button>`]).concat([[`<b>${T('ডিফল্ট (কোনো গ্রুপে নেই)', 'Default (no group)')}</b>`, T(`ফিক্সড ${n(DB.settings.share)}% প্ল্যাটফর্ম ফি`, `Fixed ${DB.settings.share}% platform fee`), '', TEACHERS.filter(t => !groupOf(t.id)).length + ' ' + T('জন', 'teachers'), `<small class="soft">${T('সেটিংসে বদলানো যায়', 'Editable in Settings')}</small>`]])) +
    `<p class="soft">${T('একজন টিচার একটি গ্রুপেই থাকতে পারেন। টিচারের নিজস্ব কাস্টম % থাকলে সেটা গ্রুপের নিয়মের চেয়ে অগ্রাধিকার পায়। “প্রথম কোর্স” মানে ওই টিচারের প্রথম তৈরি করা কোর্স (১-টু-১ ও গ্রুপ সংস্করণ একই কোর্স ধরা হয়)। P2P সমস্যা সমাধানের পেমেন্টও এই টার্ম মানে।', 'A teacher can be in one group. A teacher\'s custom % takes priority over the group rule. “First course” is the teacher\'s first created course (its 1-to-1 and group versions count as one). P2P problem-solving payments follow these terms too.')}</p>`);
  def.teachers = ['teachers', () => { const k = PX.S.tab.tg || 'list'; return UI.tabs('tg', [['list', T('সব টিচার', 'All teachers')], ['groups', T('গ্রুপ ও পেমেন্ট টার্ম', 'Groups & payment terms')]], k) + (k === 'groups' ? groupsUI() : listUI()); }];
  A.tgform = a => {
    const g = a.dataset.id ? DB.tgroups.find(x => x.id === a.dataset.id) : null, v = (k, d) => g && g[k] != null ? g[k] : d;
    const opt = (k, html) => `<div class="tg-opt" data-k="${k}" style="flex:1 1 100%" ${(g ? g.kind : 'pct') === k ? '' : 'hidden'}>${html}</div>`;
    PX.modal(g ? T('গ্রুপ এডিট', 'Edit group') : T('নতুন টিচার গ্রুপ', 'New teacher group'), `<form data-pf="tgroup" data-id="${g ? g.id : ''}" class="fgrid">
      ${UI.fi({ name: 'name', label: T('গ্রুপের নাম', 'Group name'), val: v('name', ''), req: 1 })}
      ${UI.fi({ name: 'kind', label: T('পেমেন্ট টার্মের ধরন', 'Payment term type'), val: g ? g.kind : 'pct', opts: Object.keys(KINDS).map(k => [k, T(KINDS[k][0], KINDS[k][1])]) }).replace('name="kind"', 'name="kind" data-pc="tgkind"')}
      ${opt('pct', UI.fi({ name: 'pct', label: T('প্ল্যাটফর্ম ফি (%)', 'Platform fee (%)'), type: 'number', min: 0, val: v('pct', 30) }))}
      ${opt('tier', UI.fi({ name: 'first', label: T('প্রথম কোর্সে প্ল্যাটফর্ম ফি (%)', 'Platform fee on first course (%)'), type: 'number', min: 0, val: v('first', 30), half: 1 }) + UI.fi({ name: 'next', label: T('পরের কোর্সগুলোতে প্ল্যাটফর্ম ফি (%)', 'Platform fee on later courses (%)'), type: 'number', min: 0, val: v('next', 20), half: 1 }))}
      ${opt('amt', UI.fi({ name: 'amt', label: T('প্রতি পেমেন্টে প্ল্যাটফর্ম ফি (৳)', 'Platform fee per payment (৳)'), type: 'number', min: 0, val: v('amt', 300) }))}
      ${opt('tfix', UI.fi({ name: 'tfix', label: T('প্রতি পেমেন্টে টিচার পাবেন (৳)', 'Teacher gets per payment (৳)'), type: 'number', min: 0, val: v('tfix', 2000) }))}
      <div class="fld bd-srch"><label for="tgq">${T('টিচার খুঁজে গ্রুপে যোগ করুন', 'Search teachers to add')}</label><input id="tgq" type="search" data-pi="tgq" placeholder="${T('নাম বা আইডি', 'Name or ID')}" autocomplete="off"></div>
      ${UI.checks('mem', TEACHERS.map(t => [t.id, `${L(t.n)} · #${t.pid}${groupOf(t.id) && (!g || groupOf(t.id).id !== g.id) ? ' (' + groupOf(t.id).name + ')' : ''}`]), g ? g.members : [], T('এই গ্রুপের টিচার', 'Teachers in this group'))}
      <div class="fld"><small class="err" id="tg-err" role="alert"></small><button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></div></form>`, 1);
  };
  PX.CHG.tgkind = el => el.form.querySelectorAll('.tg-opt').forEach(o => { o.hidden = o.dataset.k !== el.value; });
  PX.CHG.tgq = el => { const q = el.value.toLowerCase().trim(); el.form.querySelectorAll('.ck-g .ck').forEach(l => { l.hidden = !!q && !l.textContent.toLowerCase().includes(q); }); };
  F.tgroup = (f, d) => {
    const er = f.querySelector('#tg-err'), name = (d.name || '').trim(), kind = d.kind, num = k => Math.max(0, +d[k] || 0);
    if (!name) { er.textContent = T('গ্রুপের নাম দিন', 'Enter a group name'); return; }
    if (DB.tgroups.some(x => x.id !== f.dataset.id && x.name.toLowerCase() === name.toLowerCase())) { er.textContent = T('এই নামে গ্রুপ আছে', 'A group with this name exists'); return; }
    const rec = { id: f.dataset.id || 'g' + (Math.max(0, ...DB.tgroups.map(x => +x.id.slice(1))) + 1), name, kind, members: (d.mem || []).slice() };
    if (kind === 'pct') { rec.pct = num('pct'); if (rec.pct > 100) { er.textContent = T('% ১০০ এর বেশি হতে পারে না', '% cannot exceed 100'); return; } }
    if (kind === 'tier') { rec.first = num('first'); rec.next = num('next'); if (rec.first > 100 || rec.next > 100) { er.textContent = T('% ১০০ এর বেশি হতে পারে না', '% cannot exceed 100'); return; } }
    if (kind === 'amt') rec.amt = num('amt'); if (kind === 'tfix') rec.tfix = num('tfix');
    DB.tgroups.forEach(x => { x.members = x.members.filter(id => !rec.members.includes(id)); });
    const i = DB.tgroups.findIndex(x => x.id === rec.id); if (i >= 0) DB.tgroups[i] = rec; else DB.tgroups.push(rec);
    PX.closeModal(); PX.toast(T('গ্রুপ সংরক্ষিত', 'Group saved')); PX.refresh();
  };
  A.tgdel = a => { const i = DB.tgroups.findIndex(x => x.id === a.dataset.id); if (i >= 0) DB.tgroups.splice(i, 1); PX.toast(T('গ্রুপ মুছে ফেলা হয়েছে; টিচাররা ডিফল্ট টার্মে ফিরেছেন', 'Group deleted; teachers are back on default terms')); PX.refresh(); };

  /* ---------- প্রোগ্রাম ও কোর্স টাইপ ম্যানেজার ---------- */
  const PCOLS = ['#8C52FF', '#6B34E0', '#4A2BA8', '#241545', '#7A3FF0', '#17102B'];
  const bnDig = x => String(x).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
  const nCourses = (key, id) => COURSES.filter(c => key === 'p' ? c.program === id : c.formats[0] === id).length;
  def.programs = ['courses', () => {
    const progs = UI.card(T('প্রোগ্রাম', 'Programs'), `<div class="pm-bar"><button class="btn btn-p btn-sm" data-pa="progform">${ic('plus')} ${T('নতুন প্রোগ্রাম', 'New program')}</button></div>` +
      UI.tbl([T('কোড', 'Code'), T('নাম', 'Name'), T('সংক্ষিপ্ত', 'Short'), T('কোর্স', 'Courses'), T('সাইটে', 'On site'), ''], PROGRAMS.map(p => [`<b>${esc(p.code)}</b>`, esc(L(p)), esc(L(p.s)), n(nCourses('p', p.id)), p.hidden ? UI.chip(T('লুকানো', 'Hidden'), 'warn') : UI.chip(T('দেখাচ্ছে', 'Visible'), 'ok'), `<button class="btn btn-o btn-sm" data-pa="progform" data-id="${p.id}">${T('এডিট', 'Edit')}</button> <button class="btn btn-o btn-sm" data-pa="progtoggle" data-id="${p.id}">${p.hidden ? T('দেখান', 'Show') : T('লুকান', 'Hide')}</button>`])) +
      `<p class="soft">${T('লুকানো প্রোগ্রাম হোম পেজ, ফিল্টার ও টিচারের নতুন কোর্স ফর্ম থেকে সরে যায়, এবং ওই প্রোগ্রামের কোর্সগুলোও সাইটে দেখায় না। আবার “দেখান” দিলে ফিরে আসে।', 'A hidden program disappears from the home page, filters and the teacher course form, and its courses are not shown on the site. Click “Show” to bring it back.')}</p>`);
    const cts = UI.card(T('কোর্স টাইপ (ক্লাসের ধরন)', 'Course types'), `<div class="pm-bar"><button class="btn btn-p btn-sm" data-pa="ctform">${ic('plus')} ${T('নতুন কোর্স টাইপ', 'New course type')}</button></div>` +
      UI.tbl([T('নাম', 'Name'), T('সর্বোচ্চ স্টুডেন্ট', 'Max students'), T('কোর্স', 'Courses'), T('অবস্থা', 'Status'), ''], CTYPES.map(x => [`<b>${esc(L(x))}</b><small>${esc(T(x.en, x.bn))}</small>`, n(x.seats), n(nCourses('c', x.id)), x.on ? UI.chip(T('চালু', 'Active'), 'ok') : UI.chip(T('বন্ধ', 'Off'), 'warn'), `<button class="btn btn-o btn-sm" data-pa="ctform" data-id="${x.id}">${T('এডিট', 'Edit')}</button> <button class="btn btn-o btn-sm" data-pa="cttoggle" data-id="${x.id}">${x.on ? T('বন্ধ করুন', 'Turn off') : T('চালু করুন', 'Turn on')}</button>`])) +
      `<p class="soft">${T('“সর্বোচ্চ স্টুডেন্ট” হলো ওই টাইপের একটি ব্যাচে সর্বোচ্চ কতজন এনরোল হতে পারবে (যেমন গ্রুপ অফ ৭ = ৭ জন)। বন্ধ করা টাইপ টিচারের নতুন কোর্স ফর্মে ও সাইটের ফিল্টারে আসে না; আগের কোর্স আগের মতোই চলে।', '“Max students” is how many can enrol in one batch of that type (e.g. Group of 7 = 7). A turned-off type is not offered in the teacher course form or site filter; existing courses keep running.')}</p>`);
    return progs + cts;
  }];
  A.progform = a => {
    const p = a.dataset.id ? PROGRAMS.find(x => x.id === a.dataset.id) : null, g = (o, k) => (o && o[k]) || '';
    PX.modal(p ? T('প্রোগ্রাম এডিট', 'Edit program') : T('নতুন প্রোগ্রাম', 'New program'), `<form data-pf="prog" data-id="${p ? p.id : ''}" class="fgrid">
      ${UI.fi({ name: 'code', label: T('কোড (ছোট)', 'Code (short)'), val: p ? p.code : '', half: 1, req: 1, ph: 'IBA' })}
      ${UI.fi({ name: 'sbn', label: T('সংক্ষিপ্ত নাম (বাংলা)', 'Short name (Bangla)'), val: g(p && p.s, 'bn'), half: 1, req: 1 })}
      ${UI.fi({ name: 'sen', label: T('সংক্ষিপ্ত নাম (English)', 'Short name (English)'), val: g(p && p.s, 'en'), half: 1, req: 1 })}
      ${UI.fi({ name: 'bn', label: T('পুরো নাম (বাংলা)', 'Full name (Bangla)'), val: p ? p.bn : '', req: 1 })}
      ${UI.fi({ name: 'en', label: T('পুরো নাম (English)', 'Full name (English)'), val: p ? p.en : '', req: 1 })}
      ${UI.fi({ name: 'dbn', label: T('বিবরণ (বাংলা)', 'Description (Bangla)'), rows: 2, val: g(p && p.d, 'bn') })}
      ${UI.fi({ name: 'den', label: T('বিবরণ (English)', 'Description (English)'), rows: 2, val: g(p && p.d, 'en') })}
      ${PX.thumbField(p && p.thumb, T('প্রোগ্রামের থাম্বনেল', 'Program thumbnail'))}
      ${PX.ytField(p && p.video, T('প্রোগ্রাম পরিচিতি ভিডিও (ইউটিউব লিংক)', 'Program intro video (YouTube link)'))}
      <div class="fld"><small class="err" id="pg-err" role="alert"></small><button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></div></form>`, 1);
  };
  F.prog = (f, d) => {
    const v = k => (d[k] || '').trim(), er = f.querySelector('#pg-err');
    if (!v('code') || !v('bn') || !v('en') || !v('sbn') || !v('sen')) { er.textContent = T('কোড ও নামগুলো দিন', 'Fill in the code and names'); return; }
    const ex = f.dataset.id ? PROGRAMS.find(x => x.id === f.dataset.id) : null;
    if (PROGRAMS.some(x => x !== ex && x.code.toLowerCase() === v('code').toLowerCase())) { er.textContent = T('এই কোড আগে থেকেই আছে', 'This code already exists'); return; }
    const ye = PX.ytCheck(d.video); if (ye) { er.textContent = ye; return; }
    const desc = { bn: v('dbn') || v('bn'), en: v('den') || v('en') }, media = { thumb: d.thumb || '', video: v('video') };
    if (ex) Object.assign(ex, { code: v('code'), bn: v('bn'), en: v('en'), s: { bn: v('sbn'), en: v('sen') }, d: desc }, media);
    else { const id = 'pg' + (Math.max(0, ...PROGRAMS.map(x => +(String(x.id).match(/^pg(\d+)$/) || [0, 0])[1])) + 1); PROGRAMS.push(Object.assign({ id, code: v('code'), bn: v('bn'), en: v('en'), s: { bn: v('sbn'), en: v('sen') }, d: desc, hidden: false }, media)); CH.PCOLOR[id] = PCOLS[PROGRAMS.length % PCOLS.length]; }
    PX.closeModal(); PX.toast(T('প্রোগ্রাম সংরক্ষিত', 'Program saved')); PX.refresh();
  };
  A.progtoggle = a => { const p = PROGRAMS.find(x => x.id === a.dataset.id); if (!p) return; p.hidden = !p.hidden; PX.toast(p.hidden ? T('প্রোগ্রাম লুকানো হয়েছে', 'Program hidden') : T('প্রোগ্রাম দেখানো হচ্ছে', 'Program visible')); PX.refresh(); };
  A.ctform = a => {
    const x = a.dataset.id ? CTYPES.find(y => y.id === a.dataset.id) : null, one = x && x.id === 'one';
    PX.modal(x ? T('কোর্স টাইপ এডিট', 'Edit course type') : T('নতুন কোর্স টাইপ', 'New course type'), `<form data-pf="ctype" data-id="${x ? x.id : ''}" class="fgrid">
      ${UI.fi({ name: 'seats', label: T('সর্বোচ্চ স্টুডেন্ট (প্রতি ব্যাচে)', 'Max students (per batch)'), type: 'number', min: one ? 1 : 2, val: x ? x.seats : 10, half: 1, req: 1, hint: one ? T('১-টু-১ এ সবসময় ১', '1-to-1 is always 1') : T('২ থেকে ১০০', '2 to 100') })}
      ${UI.fi({ name: 'bn', label: T('নাম (বাংলা)', 'Name (Bangla)'), val: x ? x.bn : 'গ্রুপ অফ ১০', half: 1, req: 1 })}
      ${UI.fi({ name: 'en', label: T('নাম (English)', 'Name (English)'), val: x ? x.en : 'Group of 10', half: 1, req: 1 })}
      <div class="fld"><small class="hint">${T('নাম না বদলালে, সংখ্যা বদলালে “গ্রুপ অফ N” নামটি নিজে থেকে মিলে যাবে।', 'If you keep the default “Group of N” name, it follows the number automatically.')}</small><small class="err" id="ct-err" role="alert"></small><button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></div></form>`);
  };
  F.ctype = (f, d) => {
    const er = f.querySelector('#ct-err'), x = f.dataset.id ? CTYPES.find(y => y.id === f.dataset.id) : null, one = x && x.id === 'one', seats = one ? 1 : Math.round(+d.seats);
    let bn = (d.bn || '').trim(), en = (d.en || '').trim();
    if (!bn || !en) { er.textContent = T('দুই ভাষায় নাম দিন', 'Name is required in both languages'); return; }
    if (!one && !(seats >= 2 && seats <= 100)) { er.textContent = T('সর্বোচ্চ স্টুডেন্ট ২ থেকে ১০০ এর মধ্যে হতে হবে', 'Max students must be between 2 and 100'); return; }
    if (CTYPES.some(y => y !== x && (y.en.toLowerCase() === en.toLowerCase() || y.bn === bn))) { er.textContent = T('এই নামে আরেকটি টাইপ আছে', 'Another type has this name'); return; }
    if (x) {
      if (en === x.en && x.en === 'Group of ' + x.seats && seats !== x.seats) { en = 'Group of ' + seats; bn = 'গ্রুপ অফ ' + bnDig(seats); }
      COURSES.filter(c => c.formats[0] === x.id).forEach(c => {
        if (x.bn !== bn) c.title.bn = c.title.bn.endsWith(' · ' + x.bn) ? c.title.bn.slice(0, -x.bn.length) + bn : c.title.bn;
        if (x.en !== en) c.title.en = c.title.en.endsWith(' · ' + x.en) ? c.title.en.slice(0, -x.en.length) + en : c.title.en;
        if (!one && seats !== x.seats) c.seats = Math.max(0, seats - Math.max(0, x.seats - c.seats));
      });
      Object.assign(x, { bn, en, seats });
    } else {
      const id = 'ct' + (Math.max(0, ...CTYPES.map(y => +(String(y.id).match(/^ct(\d+)$/) || [0, 0])[1])) + 1);
      CTYPES.push({ id, bn, en, seats, on: true });
    }
    PX.closeModal(); PX.toast(T('কোর্স টাইপ সংরক্ষিত', 'Course type saved')); PX.refresh();
  };
  A.cttoggle = a => { const x = CTYPES.find(y => y.id === a.dataset.id); if (!x) return; if (x.on && CTYPES.filter(y => y.on).length < 2) { PX.toast(T('অন্তত একটি টাইপ চালু থাকতে হবে', 'At least one type must stay on')); return; } x.on = !x.on; PX.refresh(); };

  Object.keys(def).forEach(k => { S[k] = guard(def[k][0], def[k][1]); });
})();
