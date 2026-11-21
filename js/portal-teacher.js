/* টিচার পোর্টাল (ডেমো টিচার: তানভীর আহমেদ — t01) */
(function () {
  'use strict';
  const PX = window.PX, { T, n, mny, esc, fd, ic, COURSE, TEACH, TODAY } = PX, DB = PX.DB, UI = PX.ui, L = CH.L, S = PX.sec.t, TID = 't01';
  const bn = o => esc(L(o));
  const mineLive = () => COURSES.filter(c => c.teacher === TID);
  const mineNew = () => DB.newCourses.filter(c => c.tid === TID);
  const dayTxt = days => days.map(d => esc(L(DAYS[d]))).join(', ');

  PX.nav.t = () => [
    { k: 'home', l: T('ড্যাশবোর্ড', 'Dashboard'), i: 'home' },
    { k: 'courses', l: T('আমার কোর্স', 'My courses'), i: 'book', also: ['course', 'class'] },
    { k: 'new', l: T('নতুন কোর্স তৈরি', 'Create course'), i: 'plus', also: ['edit'] },
    { k: 'schedule', l: T('শিডিউল', 'Schedule'), i: 'calendar' },
    { k: 'students', l: T('স্টুডেন্ট', 'Students'), i: 'users' },
    { k: 'notices', l: T('নোটিশ ও রেজাল্ট', 'Notices & results'), i: 'file' },
    { k: 'earnings', l: T('আয়', 'Earnings'), i: 'award' },
    { k: 'coupons', l: T('কুপন ও রেফারেল', 'Coupons & referral'), i: 'users' },
    { k: 'reviews', l: T('রিভিউ', 'Reviews'), i: 'check' },
    { k: 'support', l: T('সাপোর্ট', 'Support'), i: 'phone' },
    { k: 'policies', l: T('পলিসি', 'Policies'), i: 'shield' },
    { k: 'profile', l: T('প্রোফাইল ও ভেরিফিকেশন', 'Profile & verification'), i: 'user' },
  ];

  const rosterOf = () => [...new Set(mineLive().flatMap(c => PX.roster(c.id).map(u => u.id)))].map(id => DB.crm.find(u => u.id === id));
  const nextAll = () => mineLive().flatMap(c => PX.sessions(c.id)).filter(s => s.date >= TODAY && PX.sstate(s) !== 'cancelled').sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const altTxt = (r, s0) => { const s = s0 || PX.session(r.sid) || {}, cd = r.curDate || s.date, ct = r.curTime || s.time; return `${T('বর্তমান', 'Current')}: ${fd(cd)} · ${esc(ct || '')} ➜ ${T('বিকল্প ১', 'Alt 1')}: <b>${fd(r.newDate)} · ${esc(r.newTime)}</b>${r.alt2Date ? ` · ${T('বিকল্প ২', 'Alt 2')}: <b>${fd(r.alt2Date)} · ${esc(r.alt2Time || r.newTime)}</b>` : ''}`; };
  PX.altTxt = altTxt;
  S.home = () => {
    const e = PX.teacherEarn(TID), pend = DB.resched.filter(r => r.tid === TID && r.status === 'pending').length, rv = DB.newCourses.filter(c => c.tid === TID && c.status === 'review').length;
    const nx = nextAll().slice(0, 5), tk = DB.tickets.filter(t => t.uid === TID && t.status !== 'closed').length;
    return UI.announcements('teacher') + `<div class="kpis">${UI.kpi(T('লাইভ কোর্স', 'Live courses'), n(mineLive().length))}${UI.kpi(T('মোট স্টুডেন্ট', 'Students'), n(rosterOf().length))}${UI.kpi(T('আপনার আয় (মোট)', 'Your earnings'), mny(e.mine), T('কোম্পানি শেয়ার বাদে', 'after company share'), 'ok')}${UI.kpi(T('পাওনা', 'Payable'), mny(e.due), '', e.due ? 'warn' : '')}</div>` +
      (rv ? `<div class="alert warn">${ic('clock')}<div><b>${T('অ্যাডমিন রিভিউয়ের অপেক্ষায়', 'Awaiting admin review')}</b><p>${T(`${n(rv)}টি নতুন কোর্স অনুমোদনের অপেক্ষায় আছে।`, `${rv} course(s) pending approval.`)}</p></div><a class="btn btn-o btn-sm" href="#t-courses">${T('দেখুন', 'View')}</a></div>` : '') +
      (pend ? `<div class="alert warn">${ic('calendar')}<div><b>${T('শিডিউল পরিবর্তনের অনুরোধ', 'Schedule change requests')}</b><p>${T(`${n(pend)}টি অনুরোধ অ্যাডমিনের অনুমোদনের অপেক্ষায়।`, `${pend} request(s) pending admin approval.`)}</p></div></div>` : '') +
      `<div class="g2">${UI.card(T('আসন্ন ক্লাস', 'Upcoming classes'), nx.map(s => `<div class="row-i"><div><b>${bn(COURSE(s.cid).title)}</b><small>${fd(s.date)} · ${esc(s.time)} · ${esc(L(s.topic))}</small></div><div><button class="btn btn-p btn-sm" data-pa="tjoin" data-sid="${s.id}">${ic('video')} ${T('ক্লাস শুরু', 'Start')}</button> <a class="btn btn-o btn-sm" href="#t-class-${s.id}">${T('ম্যানেজ', 'Manage')}</a></div></div>`).join('') || UI.empty('—'))}${UI.card(T('দ্রুত কাজ', 'Quick actions'), `<div class="qa"><a class="btn btn-p" href="#t-new">${ic('plus')} ${T('নতুন কোর্স তৈরি', 'Create course')}</a><a class="btn btn-o" href="#t-schedule">${T('শিডিউল/ক্লাস ব্লক', 'Schedule / block class')}</a><a class="btn btn-o" href="#t-notices">${T('নোটিশ দিন', 'Post notice')}</a><a class="btn btn-o" href="#t-coupons">${T('কুপন তৈরি', 'Create coupon')}</a></div><p class="soft">${T('খোলা সাপোর্ট টিকিট', 'Open tickets')}: ${n(tk)}</p>`)}</div>`;
  };

  /* ---------- কোর্স তালিকা ---------- */
  S.courses = () => UI.card(T('লাইভ কোর্স', 'Live courses'), `<div class="mc-g">${mineLive().map(c => `<a class="mc" href="#t-course-${c.id}"><b>${bn(c.title)}</b><small>${dayTxt(c.days)} · ${esc(L(c.time))}</small><small>${n(PX.roster(c.id).length)} ${T('জন স্টুডেন্ট', 'students')}</small>${UI.stChip(DB.off[c.id] ? 'off' : 'live')}</a>`).join('')}</div>`, `<a class="btn btn-p btn-sm" href="#t-new">${ic('plus')} ${T('নতুন কোর্স', 'New course')}</a>`) +
    UI.card(T('অনুমোদনের অপেক্ষায় / খসড়া / বাতিল', 'In review / drafts / rejected'), UI.tbl([T('কোর্স', 'Course'), T('তারিখ', 'Date'), T('অবস্থা', 'Status'), ''], mineNew().map(c => [esc(c.title), fd(c.date), UI.stChip(c.status) + (c.reason ? `<small class="soft"> ${esc(c.reason)}</small>` : ''), c.status === 'draft' || c.status === 'rejected' ? `<a class="btn btn-o btn-sm" href="#t-edit-${c.id}">${T('সম্পাদনা', 'Edit')}</a>` : ''])));

  /* ---------- কোর্স ওয়ার্কস্পেস ---------- */
  S.course = cid => {
    const c = COURSE(cid); if (!c || c.teacher !== TID) return UI.card('', UI.empty(T('কোর্স পাওয়া যায়নি', 'Not found')));
    const k = 'tc' + cid, tab = PX.S.tab[k] || 'classes';
    const list = [['classes', T('ক্লাস', 'Classes')], ['students', T('স্টুডেন্ট', 'Students')], ['files', T('ফাইল', 'Files')], ['chat', T('চ্যাট', 'Chat')], ['posts', T('নোটিশ/রেজাল্ট', 'Notices')], ['quiz', T('কুইজ', 'Quizzes')], ['board', T('লিডারবোর্ড', 'Leaderboard')], ['recs', T('রেকর্ডিং', 'Recordings')]];
    let b = '';
    const ss = PX.sessions(cid);
    if (tab === 'classes') b = UI.card(T('ক্লাস তালিকা', 'Classes'), UI.tbl(['#', T('বিষয়', 'Topic'), T('তারিখ', 'Date'), T('অবস্থা', 'Status'), ''], ss.slice(0, 40).map(s => [n(s.n), esc(L(s.topic)), fd(s.date), UI.stChip(PX.sstate(s)), `<a class="btn btn-o btn-sm" href="#t-class-${s.id}">${T('ম্যানেজ', 'Manage')}</a>`])));
    if (tab === 'students') b = UI.card(T('স্টুডেন্ট তালিকা', 'Students'), UI.tbl([T('নাম', 'Name'), T('উপস্থিতি', 'Attendance'), T('পয়েন্ট', 'Points'), T('অভিভাবক', 'Guardian'), ''], PX.roster(cid).map(u => [esc(u.name), n(PX.attPct(cid, u.id)) + '%', n(PX.points(cid, u.id)), `${esc(u.guardian.name)} · ${esc(u.guardian.phone)}`, `<button class="btn btn-o btn-sm" data-pa="msgstu" data-uid="${u.id}">${T('মেসেজ', 'Message')}</button>`])));
    if (tab === 'files') b = UI.card(T('ফাইল শেয়ারিং', 'Files'), `<label class="btn btn-o btn-sm upl">${ic('upload')} ${T('ফাইল আপলোড', 'Upload')}<input type="file" data-pc="upfile" data-cid="${cid}" data-role="t" multiple hidden></label>` + UI.tbl([T('ফাইল', 'File'), T('কে', 'By'), T('সাইজ', 'Size'), T('তারিখ', 'Date')], PX.files(cid).map(f => [`${ic('file')} ${esc(f.name)}`, esc(f.by), UI.sizeTxt(f.size), fd(f.date)])));
    if (tab === 'chat') b = UI.card(T('ব্যাচ চ্যাট', 'Batch chat'), PX.chatBox(cid, 't'));
    if (tab === 'posts') b = postForm(cid) + UI.card(T('প্রকাশিত', 'Published'), PX.posts(cid).map(PX.postHtml).join(''));
    if (tab === 'quiz') b = UI.card(T('কুইজ', 'Quizzes'), `<form data-pf="tquiz" data-cid="${cid}" class="fgrid">${UI.fi({ name: 'title', label: T('কুইজের নাম', 'Title'), req: 1, half: 1 })}${UI.fi({ name: 'date', label: T('তারিখ', 'Date'), type: 'date', req: 1, half: 1, val: TODAY })}${UI.fi({ name: 'dur', label: T('সময় (মিনিট)', 'Minutes'), type: 'number', val: 15, half: 1, min: 5 })}<div class="fld"><button class="btn btn-p btn-sm">${T('কুইজ যোগ', 'Add quiz')}</button></div></form>` + UI.tbl([T('কুইজ', 'Quiz'), T('তারিখ', 'Date'), T('জমা', 'Submissions')], PX.quizzesOf(cid).map(q => [esc(q.title), fd(q.date), q.date <= TODAY ? n(PX.roster(cid).length - 1 + (DB.scores[q.id] ? 1 : 0)) : '—'])));
    if (tab === 'board') b = UI.card(T('লিডারবোর্ড', 'Leaderboard'), UI.tbl([T('অবস্থান', 'Rank'), T('নাম', 'Name'), T('পয়েন্ট', 'Points'), ''], PX.board(cid).map((r, i) => [n(i + 1), esc(r.u.name), n(r.p), `<button class="btn btn-o btn-sm" data-pa="bonus" data-cid="${cid}" data-uid="${r.u.id}">+৫ ${T('পয়েন্ট', 'pts')}</button>`])));
    if (tab === 'recs') b = UI.card(T('গুরুত্বপূর্ণ রেকর্ডিং', 'Important recordings'), `<p class="soft">${T('লাইভ ক্লাস রেকর্ড হয় না। শুধু গুরুত্বপূর্ণ অংশের লিংক এখানে যোগ করুন।', 'Live classes are not recorded. Add links for important parts only.')}</p><form data-pf="trec" data-cid="${cid}" class="fgrid">${UI.fi({ name: 'title', label: T('শিরোনাম', 'Title'), req: 1, half: 1 })}${UI.fi({ name: 'dur', label: T('সময়কাল', 'Duration'), half: 1, ph: '৪০ মিনিট' })}<div class="fld"><button class="btn btn-p btn-sm">${T('যোগ করুন', 'Add')}</button></div></form>` + PX.recs(cid).map(r => `<div class="row-i"><div><b>${ic('play')} ${esc(r.title)}</b><small>${esc(r.dur)} · ${fd(r.date)}</small></div></div>`).join(''));
    return `<div class="ch"><div><h2>${bn(c.title)}</h2><p>${dayTxt(c.days)} · ${esc(L(c.time))} · ${n(PX.roster(cid).length)} ${T('জন', 'students')}</p></div></div>` + UI.tabs(k, list, tab) + b;
  };
  function postForm(cid) {
    return UI.card(T('নতুন নোটিশ / রেজাল্ট', 'New notice / result'), `<form data-pf="tpost" data-cid="${cid}" class="fgrid">${UI.fi({ name: 'type', label: T('ধরন', 'Type'), half: 1, opts: [['announcement', T('নোটিশ', 'Notice')], ['result', T('রেজাল্ট', 'Result')]] })}${UI.fi({ name: 'title', label: T('শিরোনাম', 'Title'), req: 1, half: 1 })}${UI.fi({ name: 'body', label: T('বিস্তারিত', 'Body'), rows: 3, req: 1 })}<div class="fld"><label>${T('ফাইল সংযুক্ত করুন', 'Attach files')}</label><input type="file" name="files" multiple></div><div class="fld"><button class="btn btn-p btn-sm">${T('প্রকাশ করুন', 'Publish')}</button></div></form>`);
  }
  S.notices = () => mineLive().map(c => UI.card(bn(c.title), PX.posts(c.id).slice(0, 2).map(PX.postHtml).join('') + `<a class="lnk" href="#t-course-${c.id}" data-pa="goposts" data-cid="${c.id}">${T('নতুন নোটিশ দিন', 'Post new')}</a>`)).join('');

  /* ---------- ক্লাস ম্যানেজ ---------- */
  S.class = sid => {
    const s = PX.session(sid || ''); if (!s) return UI.card('', UI.empty('—'));
    const st = PX.sstate(s), r = PX.roster(s.cid), rq = DB.resched.find(x => x.sid === sid && x.status === 'pending');
    let b = `<a class="lnk back" href="#t-course-${s.cid}">${ic('left')} ${bn(COURSE(s.cid).title)}</a>` + UI.card(esc(L(s.topic)), `<div class="row-i"><div><b>${fd(s.date)} · ${esc(s.time)}</b><small>${esc(L(s.sub))}</small></div><div>${UI.stChip(st)} ${st === 'today' || st === 'upcoming' ? `<button class="btn btn-p btn-sm" data-pa="tjoin" data-sid="${sid}">${ic('video')} ${T('ক্লাস শুরু', 'Start')}</button>` : ''}</div></div>`);
    if (st === 'upcoming' || st === 'today') b += UI.card(T('শিডিউল ও ব্লক', 'Reschedule / block'), (rq ? `<div class="alert warn">${ic('clock')}<div><b>${T('পরিবর্তনের অনুরোধ অ্যাডমিনের অপেক্ষায়', 'Change request pending')}</b><p>${altTxt(rq, s)}</p></div></div>` : `<div class="alert info">${ic('calendar')}<div><b>${T('রিশিডিউলের আগে বিকল্প (অল্টারনেটিভ) শিডিউল দিন', 'Give an alternative schedule before rescheduling')}</b><p>${T('বর্তমান ক্লাস: ', 'Current class: ')}<b>${fd(s.date)} · ${esc(s.time)}</b>. ${T('এর জায়গায় কোন তারিখ ও সময়ে ক্লাস নেবেন তা নির্ধারণ করে অনুরোধ পাঠান। অ্যাডমিন অনুমোদন দিলে তবেই ক্লাসের সময় বদলাবে।', 'Choose the date and time you will teach instead, then send the request. The class moves only after admin approves.')}</p></div></div><form data-pf="resched" data-sid="${sid}" class="fgrid"><h4 class="sub fld full">${T('অল্টারনেটিভ শিডিউল ১ (আবশ্যক)', 'Alternative schedule 1 (required)')}</h4>${UI.fi({ name: 'newDate', label: T('বিকল্প তারিখ', 'Alternative date'), type: 'date', req: 1, half: 1, val: '' })}${UI.fi({ name: 'newTime', label: T('বিকল্প সময়', 'Alternative time'), half: 1, req: 1, val: s.time })}<h4 class="sub fld full">${T('অল্টারনেটিভ শিডিউল ২ (ঐচ্ছিক, অ্যাডমিনকে বেছে নিতে সুবিধা দেয়)', 'Alternative schedule 2 (optional — gives admin a choice)')}</h4>${UI.fi({ name: 'alt2Date', label: T('২য় বিকল্প তারিখ', '2nd alternative date'), type: 'date', half: 1 })}${UI.fi({ name: 'alt2Time', label: T('২য় বিকল্প সময়', '2nd alternative time'), half: 1 })}${UI.fi({ name: 'reason', label: T('রিশিডিউলের কারণ', 'Reason for rescheduling'), req: 1 })}<div class="fld"><small class="err" id="rs-err" role="alert"></small><button class="btn btn-o btn-sm">${T('অল্টারনেটিভ শিডিউলসহ অনুরোধ পাঠান', 'Send request with alternative schedule')}</button></div></form>`) + `<hr>` + (st === 'cancelled' ? '' : `<button class="btn btn-o btn-sm danger" data-pa="blockcls" data-sid="${sid}">${ic('close')} ${T('এই ক্লাস আগেই বন্ধ/ব্লক করুন', 'Block / cancel this class')}</button>`));
    if (st === 'cancelled') b += UI.card('', `<div class="alert bad">${ic('close')}<div><b>${T('ক্লাসটি বাতিল', 'Class cancelled')}</b></div></div><button class="btn btn-o btn-sm" data-pa="unblockcls" data-sid="${sid}">${T('আবার চালু করুন', 'Restore')}</button>`);
    b += UI.card(T('ক্লাস নোট ও ম্যাটেরিয়াল', 'Notes & materials'), `<label class="btn btn-o btn-sm upl">${ic('upload')} ${T('নোট আপলোড', 'Upload note')}<input type="file" data-pc="upnote" data-sid="${sid}" multiple hidden></label>` + (s.notes.length ? UI.tbl([T('ফাইল', 'File'), T('সাইজ', 'Size')], s.notes.map(f => [`${ic('file')} ${esc(f.name)}`, UI.sizeTxt(f.size)])) : UI.empty('—')));
    if (st === 'done' || st === 'today') b += UI.card(T('উপস্থিতি নিন', 'Mark attendance'), `<form data-pf="att" data-sid="${sid}">${UI.tbl([T('স্টুডেন্ট', 'Student'), T('উপস্থিত', 'Present')], r.map(u => [esc(u.name), `<label class="ck"><input type="checkbox" name="p" value="${u.id}" ${PX.attOf(sid, u.id) ? 'checked' : ''}><span>${T('উপস্থিত', 'Present')}</span></label>`]))}<button class="btn btn-p btn-sm">${T('সংরক্ষণ', 'Save')}</button></form>`);
    const rv = DB.reviews.filter(x => x.sid === sid);
    if (rv.length) b += UI.card(T('এই ক্লাসের রিভিউ', 'Reviews for this class'), reviewRows(rv));
    return b;
  };
  PX.reviewRows = reviewRows;
  function reviewRows(l) {
    const map = Object.fromEntries(PX.ISS());
    return l.map(r => `<div class="row-i"><div><b>★${n(r.overall)} · ${esc(r.name)}</b><small>${fd(r.date)} · ${bn(COURSE(r.cid).title)}</small>${r.issues && r.issues.length ? `<div class="issl">${r.issues.map(i => UI.chip(esc(map[i] || i), 'bad')).join(' ')}</div>` : ''}${r.comment ? `<p>${esc(r.comment)}</p>` : ''}</div></div>`).join('') || UI.empty(T('এখনো রিভিউ নেই', 'No reviews yet'));
  }
  S.reviews = () => {
    const ids = mineLive().map(c => c.id), l = DB.reviews.filter(r => ids.includes(r.cid));
    const avg = l.length ? (l.reduce((a, r) => a + r.overall, 0) / l.length).toFixed(1) : '—';
    return `<div class="kpis">${UI.kpi(T('রিভিউ সংখ্যা', 'Reviews'), n(l.length))}${UI.kpi(T('গড় রেটিং', 'Average'), n(avg))}${UI.kpi(T('নেগেটিভ', 'Negative'), n(l.filter(r => r.overall <= 3).length), '', 'bad')}</div>` + UI.card(T('স্টুডেন্টদের রিভিউ', 'Student reviews'), reviewRows(l));
  };

  S.schedule = () => UI.card(T('ক্লাস ক্যালেন্ডার', 'Class calendar'), PX.calendar(mineLive().map(c => c.id), 't')) + UI.card(T('শিডিউল পরিবর্তনের অনুরোধ', 'Change requests'), UI.tbl([T('ক্লাস', 'Class'), T('বর্তমান ➜ অল্টারনেটিভ শিডিউল', 'Current ➜ Alternative schedule'), T('কারণ', 'Reason'), T('অবস্থা', 'Status')], DB.resched.filter(r => r.tid === TID).map(r => [bn(COURSE(r.cid).title), altTxt(r), esc(r.reason), UI.stChip(r.status)]))) + UI.card(T('বন্ধ করা ক্লাস', 'Blocked classes'), UI.tbl([T('ক্লাস', 'Class'), T('তারিখ', 'Date')], DB.blocked.filter(b => COURSE(b.cid).teacher === TID).map(b => [bn(COURSE(b.cid).title), fd(PX.session(b.sid).date)])));

  S.students = () => UI.card(T('আমার সব স্টুডেন্ট', 'All my students'), UI.tbl([T('নাম', 'Name'), T('জেলা', 'District'), T('কোর্স', 'Courses'), T('অভিভাবক', 'Guardian'), ''], rosterOf().map(u => [esc(u.name), esc(u.district), mineLive().filter(c => u.courses.includes(c.id)).map(c => esc(c.program.toUpperCase())).join(', '), esc(u.guardian.phone), `<button class="btn btn-o btn-sm" data-pa="msgstu" data-uid="${u.id}">${T('মেসেজ', 'Message')}</button>`])));

  /* ---------- আয় ---------- */
  S.earnings = () => {
    const e = PX.teacherEarn(TID), cs = mineLive().map(c => c.id), pays = DB.pays.filter(p => cs.includes(p.cid) && p.status === 'confirmed').sort((a, b) => b.date.localeCompare(a.date));
    return `<div class="kpis">${UI.kpi(T('মোট কালেকশন', 'Gross collected'), mny(e.gross))}${UI.kpi(T(`কোম্পানি শেয়ার (${n(e.share)}%)`, `Company share (${e.share}%)`), mny(e.company))}${UI.kpi(T('আপনার শেয়ার', 'Your share'), mny(e.mine), '', 'ok')}${UI.kpi(T('পরিশোধিত', 'Paid out'), mny(e.paid))}${UI.kpi(T('পাওনা', 'Payable'), mny(e.due), '', e.due ? 'warn' : '')}</div>` +
      UI.card(T('কোর্সভিত্তিক আয়', 'Earnings by course'), UI.tbl([T('কোর্স', 'Course'), T('কালেকশন', 'Collected'), T('কোম্পানি', 'Company'), T('আপনি', 'You')], mineLive().map(c => { const g = DB.pays.filter(p => p.cid === c.id && p.status === 'confirmed').reduce((a, p) => a + p.amount, 0), my = Math.round(g * (100 - e.share) / 100); return [bn(c.title), mny(g), mny(g - my), mny(my)]; }))) +
      UI.card(T('পেআউট ইতিহাস', 'Payout history'), UI.tbl([T('তারিখ', 'Date'), T('পরিমাণ', 'Amount'), T('ক্যাশ-আউট চার্জ', 'Cash-out charge'), T('আপনি পেয়েছেন', 'Received'), T('মেথড', 'Method')], DB.payouts.filter(p => p.tid === TID).map(p => [fd(p.date), mny(p.amount), mny(p.charge || 0), mny(p.amount - (p.charge || 0)), esc(p.method || p.note)])) + `<p class="soft"><a href="#t-payout">${T('পেআউট মেথড যোগ/বদলান', 'Add or change payout method')}</a></p>`) +
      UI.card(T('সাম্প্রতিক পেমেন্ট', 'Recent payments'), UI.tbl([T('তারিখ', 'Date'), T('স্টুডেন্ট', 'Student'), T('কোর্স', 'Course'), T('পরিমাণ', 'Amount')], pays.slice(0, 12).map(p => [fd(p.date), esc(DB.crm.find(u => u.id === p.sid).name), bn(COURSE(p.cid).title), mny(p.amount)]))) + `<p class="soft">${T('শেয়ারের হার নমুনা মাত্র; চূড়ান্ত হার অ্যাডমিন নির্ধারণ করবে।', 'Share % is a sample; admin sets the final rate.')}</p>`;
  };

  /* ---------- কুপন ও রেফারেল ---------- */
  S.coupons = () => {
    const mine = DB.coupons.filter(c => c.by === TID), r = DB.settings.refT;
    return UI.card(T('নতুন কুপন', 'New coupon'), `<form data-pf="coupon" data-by="${TID}" class="fgrid">${UI.fi({ name: 'code', label: T('কোড', 'Code'), req: 1, half: 1, ph: 'TANVIR20' })}${UI.fi({ name: 'type', label: T('ধরন', 'Type'), half: 1, opts: [['pct', T('শতকরা %', 'Percent')], ['flat', T('ফিক্সড ৳', 'Fixed ৳')]] })}${UI.fi({ name: 'v', label: T('পরিমাণ', 'Value'), type: 'number', req: 1, half: 1, min: 1 })}${UI.fi({ name: 'scope', label: T('প্রযোজ্য', 'Applies to'), half: 1, opts: PX.scopeOpts(TID) })}${UI.fi({ name: 'limit', label: T('সর্বোচ্চ ব্যবহার', 'Max uses'), type: 'number', val: 50, half: 1, min: 1 })}${UI.fi({ name: 'expiry', label: T('মেয়াদ', 'Expiry'), type: 'date', val: '2026-12-31', half: 1 })}<div class="fld"><button class="btn btn-p btn-sm">${T('কুপন তৈরি', 'Create')}</button></div></form>`) +
      UI.card(T('আমার কুপন', 'My coupons'), couponTbl(mine)) +
      UI.card(T('টিচার রেফারেল', 'Teacher referral'), `<p>${T(`অন্য টিচারকে রেফার করলে অনুমোদনের পর পাবেন ${r.type === 'pct' ? n(r.v) + '%' : mny(r.v)} বোনাস। কোড: `, 'Bonus per approved teacher: ')}<b>TANVIR-T9</b></p>` + UI.tbl([T('নাম', 'Name'), T('তারিখ', 'Date'), T('অবস্থা', 'Status'), T('বোনাস', 'Bonus')], DB.refT.map(x => [esc(x.name), fd(x.date), x.status === 'approved' ? UI.chip(T('অনুমোদিত', 'Approved'), 'ok') : UI.chip(T('আবেদন করেছে', 'Applied'), 'warn'), mny(x.bonus)])));
  };
  function couponTbl(l, showBy) {
    const byL = c => c.by === 'admin' ? T('অ্যাডমিন', 'Admin') : esc(L(TEACH(c.by).n));
    return UI.tbl([T('কোড', 'Code'), T('ছাড়', 'Off'), T('প্রযোজ্য', 'Applies to')].concat(showBy ? [T('কে বানিয়েছেন', 'Created by')] : [], [T('ব্যবহার', 'Used'), T('মেয়াদ', 'Expiry'), T('অবস্থা', 'Status'), '']), l.map(c => [`<b>${esc(c.code)}</b>`, c.type === 'pct' ? n(c.v) + '%' : mny(c.v), esc(PX.scopeLabel(c.scope))].concat(showBy ? [byL(c)] : [], [`${n(c.uses)}/${n(c.limit)}`, fd(c.expiry), c.active ? UI.chip(T('চালু', 'Active'), 'ok') : UI.chip(T('বন্ধ', 'Off')), `<button class="btn btn-o btn-sm" data-pa="cptoggle" data-code="${esc(c.code)}">${c.active ? T('বন্ধ করুন', 'Disable') : T('চালু করুন', 'Enable')}</button>`])));
  }
  PX.couponTbl = couponTbl;

  S.support = () => PX.ticketUI(TID, 't');
  S.policies = () => PX.policyUI('teacher');
  S.profile = () => {
    const t = TEACH(TID), ap = DB.apps.find(a => a.id === 'ap3');
    return UI.card(T('আমার প্রোফাইল', 'My profile'), `<div class="prof">${CH.avatar(t, 72)}<div><h3>${esc(t.n.bn)}</h3><p>${esc(L(t.inst))} · ${esc(L(t.dept))}</p><p>${UI.chip(T('আইডি ভেরিফাইড', 'ID verified'), 'ok')} ${UI.chip(T('ডকুমেন্ট ভেরিফাইড', 'Docs verified'), 'ok')} ${UI.chip(T('অ্যাডমিন অনুমোদিত', 'Admin approved'), 'ok')}</p></div></div>`) +
      UI.card(T('ডকুমেন্ট', 'Documents'), UI.tbl([T('ডকুমেন্ট', 'Document'), T('ফাইল', 'File'), T('অবস্থা', 'Status')], ap.docs.map(d => [esc(d[0]), `${ic('file')} ${esc(d[1])}`, UI.chip(T('যাচাইকৃত', 'Verified'), 'ok')])) + `<label class="btn btn-o btn-sm upl">${ic('upload')} ${T('নতুন ডকুমেন্ট', 'Upload')}<input type="file" data-pc="tdoc" hidden></label>`) +
      UI.card(T('টিচার হওয়ার ধাপ', 'Onboarding steps'), `<ol class="steps">${[T('আবেদন ও ডকুমেন্ট জমা', 'Apply with documents'), T('অ্যাডমিন যাচাই ও অনুমোদন', 'Admin review & approval'), T('কোর্স তৈরি ও অনুমোদন', 'Create & approve courses'), T('কোর্স লাইভ ও ক্লাস শুরু', 'Go live')].map(x => `<li>${UI.chip('✓', 'ok')} ${x}</li>`).join('')}</ol>`);
  };

  /* ---------- কোর্স তৈরি/সম্পাদনা ফর্ম ---------- */
  const TEN = [[0, () => T('একবারে (পুরো কোর্স)', 'One-time (full course)')], [1, () => T('প্রতি ১ মাসে', 'Every 1 month')], [3, () => T('প্রতি ৩ মাসে', 'Every 3 months')], [6, () => T('প্রতি ৬ মাসে', 'Every 6 months')], [12, () => T('প্রতি ১২ মাসে', 'Every 12 months')]];
  PX.courseForm = (c, admin) => {
    c = c || { program: 'cadet', subject: 'math', kind: 'regular', weeks: 12, cpw: 2, days: [], time: '', formats: ['group'], plans: {}, tid: TID, title: '', desc: '', video: '' };
    const pl = (f, m) => (c.plans[f] || []).find(x => x.m === m) || null;
    const fmt = f => `<div class="pf"><h4 class="sub">${esc(L(ctype(f)))} — ${T('মূল্য', 'pricing')}</h4><p class="soft">${T('যে মেয়াদ চালু রাখতে চান তাতে টিক দিন। স্টুডেন্ট এনরোলের সময় এগুলো থেকে বেছে নেবে। “প্রথম পেমেন্ট” ঘরে প্রথম মাসের আলাদা দাম দিতে পারেন।', 'Tick the tenures to offer. Students choose at enrollment. Use “first payment” for a different first-period price.')}</p>${UI.tbl([T('চালু', 'On'), T('মেয়াদ', 'Tenure'), T('আসল দাম ৳', 'Actual ৳'), T('ছাড়ের দাম ৳', 'Discounted ৳'), T('প্রথম পেমেন্ট ৳ (ঐচ্ছিক)', 'First payment ৳ (optional)')], TEN.map(([m, lb]) => { const p = pl(f, m), k = `p_${f}_${m}`; return [`<input type="checkbox" name="${k}_on" ${p ? 'checked' : ''}>`, lb(), `<input type="number" min="0" name="${k}_a" value="${p ? p.actual : ''}">`, `<input type="number" min="0" name="${k}_d" value="${p ? p.disc : ''}">`, m ? `<input type="number" min="0" name="${k}_f" value="${p && p.first != null ? p.first : ''}">` : '—']; }))}</div>`;
    return `<form data-pf="newcourse" data-id="${c.id || ''}" data-admin="${admin ? 1 : ''}" class="fgrid">
      ${admin ? UI.fi({ name: 'tid', label: T('টিচার', 'Teacher'), half: 1, req: 1, opts: TEACHERS.map(t => [t.id, t.n.bn]), val: c.tid }) : ''}
      ${UI.fi({ name: 'title', label: T('কোর্সের নাম', 'Course title'), req: 1, val: c.title, half: !admin })}
      ${UI.fi({ name: 'program', label: T('প্রোগ্রাম', 'Program'), half: 1, opts: PROGRAMS.filter(p => !p.hidden || p.id === c.program).map(p => [p.id, L(p)]), val: c.program })}
      ${UI.fi({ name: 'subject', label: T('বিষয়', 'Subject'), half: 1, opts: SUBJECTS.map(s => [s.id, L(s)]), val: c.subject })}
      ${UI.fi({ name: 'kind', label: T('ধরন', 'Kind'), half: 1, opts: [['regular', T('রেগুলার', 'Regular')], ['crash', T('ক্র্যাশ কোর্স', 'Crash course')]], val: c.kind })}
      ${UI.fi({ name: 'weeks', label: T('মোট সপ্তাহ', 'Total weeks'), type: 'number', min: 1, half: 1, req: 1, val: c.weeks })}
      ${UI.fi({ name: 'cpw', label: T('সপ্তাহে ক্লাস', 'Classes / week'), type: 'number', min: 1, half: 1, req: 1, val: c.cpw })}
      ${UI.fi({ name: 'time', label: T('ক্লাসের সময়', 'Class time'), req: 1, half: 1, val: c.time, ph: 'রাত ৯:০০' })}
      ${UI.checks('days', Object.keys(DAYS).map(d => [d, L(DAYS[d])]), c.days, T('ক্লাসের দিন', 'Class days'))}
      ${UI.checks('formats', CTYPES.filter(x => x.on || c.formats.includes(x.id)).map(x => [x.id, L(x) + (x.seats > 1 ? ' (' + T('সর্বোচ্চ ', 'max ') + n(x.seats) + ')' : '')]), c.formats, T('ক্লাসের ধরন', 'Class types'))}
      ${UI.fi({ name: 'desc', label: T('কোর্সের বিবরণ', 'Description'), rows: 3, val: c.desc })}
      ${UI.fi({ name: 'video', label: T('পরিচিতি ভিডিও লিংক', 'Intro video link'), val: c.video, ph: 'https://' })}
      <div class="fld full">${CTYPES.filter(x => x.on || c.formats.includes(x.id)).map(x => fmt(x.id)).join('')}</div>
      ${admin ? UI.fi({ name: 'status', label: T('অবস্থা', 'Status'), half: 1, opts: [['live', T('সরাসরি লাইভ', 'Go live')], ['draft', T('খসড়া', 'Draft')]] }) : UI.fi({ name: 'status', label: T('এখন কী করবেন?', 'Action'), half: 1, opts: [['review', T('অ্যাডমিন রিভিউয়ে জমা দিন', 'Submit for admin review')], ['draft', T('খসড়া হিসেবে রাখুন', 'Save as draft')]] })}
      <div class="fld"><button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></div></form>`;
  };
  S.new = () => UI.card(T('নতুন কোর্স তৈরি', 'Create a course'), `<p class="soft">${T('জমা দেওয়ার পর অ্যাডমিন অনুমোদন দিলে কোর্স সাইটে লাইভ হবে।', 'Once admin approves, the course goes live on the site.')}</p>` + PX.courseForm(null, false));
  S.edit = id => { const c = DB.newCourses.find(x => x.id === id); return c ? UI.card(T('কোর্স সম্পাদনা', 'Edit course'), PX.courseForm(c, false)) : UI.card('', UI.empty('—')); };

  PX.buildPlans = d => {
    const out = {};
    CTYPES.map(x => x.id).forEach(f => {
      if (!(d.formats || []).includes(f)) return;
      const l = [];
      [0, 1, 3, 6, 12].forEach(m => { const k = `p_${f}_${m}`; if (d[k + '_on'] && +d[k + '_a'] > 0) { const disc = +d[k + '_d'] > 0 ? +d[k + '_d'] : +d[k + '_a']; const o = { key: m ? 'm' + m : 'full', m, actual: +d[k + '_a'], disc }; if (m && d[k + '_f'] !== '' && d[k + '_f'] != null && +d[k + '_f'] > 0) o.first = +d[k + '_f']; l.push(o); } });
      if (l.length) out[f] = l;
    });
    return out;
  };
  PX.publishCourse = nc => {
    const months = Math.max(1, Math.ceil(nc.weeks / 4)), made = [];
    nc.formats.forEach(f => {
      const id = 'c' + String(COURSES.length + 1).padStart(2, '0') + (f === 'group' ? '' : '-' + (f === 'one' ? '1on1' : f)), g = (nc.plans[f] || nc.plans.group || nc.plans.one || Object.values(nc.plans)[0])[0];
      const ct = ctype(f), sx = [' · ' + ct.bn, ' · ' + ct.en];
      const live = { id, pid: nextCoursePid(), program: nc.program, subject: nc.subject, kind: nc.kind, teacher: nc.tid, base: g.actual, months, cpw: nc.cpw, weeks: nc.weeks, start: '2026-12-05', seats: ctSeats(f), formats: [f], rating: 4.5, reviews: 0, enrolled: 0, featured: false, days: nc.days, time: { bn: nc.time, en: nc.time }, title: { bn: nc.title + sx[0], en: nc.title + sx[1] }, short: { bn: nc.desc || nc.title, en: nc.desc || nc.title }, plans: { [f]: nc.plans[f] } };
      COURSES.push(live); made.push(live);
    });
    nc.liveId = made[0].id; nc.status = 'live'; return made[0];
  };
  PX.FORMS.newcourse = (f, d) => {
    const plans = PX.buildPlans(d);
    if (!(d.days || []).length || !(d.formats || []).length) { PX.toast(T('ক্লাসের দিন ও ধরন বেছে নিন', 'Pick class days and types')); return; }
    if (!(d.formats || []).every(x => plans[x])) { PX.toast(T('প্রতিটি ধরনের জন্য অন্তত একটি মেয়াদের দাম দিন', 'Add at least one priced tenure per class type')); return; }
    const admin = !!f.dataset.admin, tid = admin ? d.tid : TID;
    const rec = { id: f.dataset.id || 'n' + (DB.newCourses.length + 1), tid, title: d.title, program: d.program, subject: d.subject, kind: d.kind, weeks: +d.weeks, cpw: +d.cpw, days: d.days, time: d.time, formats: d.formats, desc: d.desc, video: d.video, plans, date: TODAY, status: d.status, reason: '' };
    const ex = DB.newCourses.findIndex(x => x.id === rec.id); if (ex >= 0) DB.newCourses[ex] = rec; else DB.newCourses.push(rec);
    if (admin && d.status === 'live') PX.publishCourse(rec);
    PX.toast(admin ? (d.status === 'live' ? T('কোর্স লাইভ হয়েছে', 'Course is live') : T('খসড়া সংরক্ষিত', 'Saved')) : (d.status === 'review' ? T('অ্যাডমিন রিভিউয়ে জমা হয়েছে', 'Submitted for review') : T('খসড়া সংরক্ষিত', 'Draft saved')));
    location.hash = admin ? '#a-courses' : '#t-courses';
  };

  /* ---------- অ্যাকশন ---------- */
  const A = PX.ACT, F = PX.FORMS;
  A.tjoin = a => { const s = PX.session(a.dataset.sid); PX.modal(T('ক্লাস শুরু হচ্ছে', 'Starting class'), `<p>${esc(UI.sessLine(s))}</p><p class="soft">${T('ডেমোতে আসল ভিডিও কল নেই; বাস্তবে এখান থেকে লাইভ ক্লাস রুম খুলবে।', 'No real call in the demo.')}</p><button class="btn btn-p" data-pa="close">OK</button>`); };
  A.goposts = a => { PX.S.tab['tc' + a.dataset.cid] = 'posts'; location.hash = '#t-course-' + a.dataset.cid; PX.refresh(); };
  A.bonus = a => { const m = DB.extra[a.dataset.cid] = DB.extra[a.dataset.cid] || {}; m[a.dataset.uid] = (m[a.dataset.uid] || 0) + 5; PX.refresh(); };
  A.blockcls = a => { const s = PX.session(a.dataset.sid); DB.blocked.push({ sid: s.id, cid: s.cid }); PX.toast(T('ক্লাস ব্লক হয়েছে; স্টুডেন্টরা নোটিশ পাবে', 'Class blocked; students notified')); PX.refresh(); };
  A.unblockcls = a => { DB.blocked = DB.blocked.filter(b => b.sid !== a.dataset.sid); PX.refresh(); };
  A.cptoggle = a => { const c = DB.coupons.find(x => x.code === a.dataset.code); c.active = !c.active; PX.refresh(); };
  A.msgstu = a => { const u = DB.crm.find(x => x.id === a.dataset.uid); PX.modal(T('মেসেজ — ', 'Message — ') + esc(u.name), `<form data-pf="tmsg" data-uid="${u.id}">${UI.fi({ name: 'text', label: T('বার্তা', 'Message'), rows: 3, req: 1 })}<label class="ck"><input type="checkbox" name="cc"><span>${T('অভিভাবককে (' + esc(u.guardian.name) + ') অনুলিপি', 'Copy guardian (' + esc(u.guardian.name) + ')')}</span></label><button class="btn btn-p btn-sm">${T('পাঠান', 'Send')}</button></form>`); };
  F.tmsg = () => { PX.closeModal(); PX.toast(T('বার্তা পাঠানো হয়েছে', 'Message sent')); };
  F.tpost = (f, d) => { PX.posts(f.dataset.cid); DB.posts.push({ id: 'po' + Date.now(), cid: f.dataset.cid, type: d.type, title: d.title, body: d.body, files: (d.files || []).map(x => x.name), date: TODAY, by: TEACH(TID).n.bn }); PX.toast(T('প্রকাশিত হয়েছে', 'Published')); PX.refresh(); };
  F.tquiz = (f, d) => { PX.quizzesOf(f.dataset.cid); DB.quizzes.push({ id: 'q' + Date.now(), cid: f.dataset.cid, title: d.title, date: d.date, dur: +d.dur || 15, type: COURSE(f.dataset.cid).subject, done: false }); PX.refresh(); };
  F.trec = (f, d) => { PX.recs(f.dataset.cid).unshift({ id: 'r' + Date.now(), title: d.title, dur: d.dur || '—', date: TODAY }); PX.refresh(); };
  F.resched = (f, d) => {
    const s = PX.session(f.dataset.sid), er = f.querySelector('#rs-err'), bad = m => { er.textContent = m; };
    const taken = (dt, tm) => mineLive().some(c => PX.sessions(c.id).some(x => x.id !== s.id && x.date === dt && String(x.time).trim() === String(tm).trim() && PX.sstate(x) !== 'cancelled'));
    const chk = (dt, tm, lab) => {
      if (!dt || !(tm || '').trim()) return T(lab + ': তারিখ ও সময় দিন', lab + ': enter date and time');
      if (dt < TODAY) return T(lab + ': তারিখ আজকের বা পরের হতে হবে', lab + ': date must be today or later');
      if (dt === s.date && String(tm).trim() === String(s.time).trim()) return T(lab + ': বর্তমান শিডিউলের মতোই', lab + ': same as the current schedule');
      if (taken(dt, tm)) return T(lab + ': ওই সময়ে আপনার আরেকটি ক্লাস আছে', lab + ': you already have a class at that time');
      return '';
    };
    let m = chk(d.newDate, d.newTime, T('অল্টারনেটিভ ১', 'Alternative 1')); if (m) return bad(m);
    const has2 = d.alt2Date || (d.alt2Time || '').trim();
    if (has2) { m = chk(d.alt2Date, d.alt2Time, T('অল্টারনেটিভ ২', 'Alternative 2')); if (m) return bad(m); if (d.alt2Date === d.newDate && String(d.alt2Time).trim() === String(d.newTime).trim()) return bad(T('দুটি বিকল্প একই', 'The two alternatives are identical')); }
    if (!(d.reason || '').trim()) return bad(T('কারণ লিখুন', 'Enter a reason'));
    DB.resched.push({ id: 'rq' + (DB.resched.length + 1), sid: s.id, cid: s.cid, tid: TID, curDate: s.date, curTime: s.time, newDate: d.newDate, newTime: d.newTime.trim(), alt2Date: has2 ? d.alt2Date : '', alt2Time: has2 ? d.alt2Time.trim() : '', reason: d.reason.trim(), status: 'pending', date: TODAY });
    PX.toast(T('অল্টারনেটিভ শিডিউলসহ অনুরোধ অ্যাডমিনের কাছে গেছে', 'Request with alternative schedule sent to admin')); PX.refresh();
  };
  F.att = (f, d) => { const s = f.dataset.sid; DB.att[s] = {}; PX.roster(PX.session(s).cid).forEach(u => { DB.att[s][u.id] = (d.p || []).includes(u.id); }); PX.toast(T('উপস্থিতি সংরক্ষিত', 'Saved')); PX.refresh(); };
  F.coupon = (f, d) => {
    const code = d.code.trim().toUpperCase(); if (DB.coupons.some(c => c.code === code)) { PX.toast(T('এই কোড আগে থেকেই আছে', 'Code exists')); return; }
    const by = f.dataset.by, ok = PX.scopeOpts(by === 'admin' ? '' : by).some(x => x[0] === (d.scope || ''));
    if (!ok) { PX.toast(T('এই কোর্স/স্কোপে কুপন দেওয়ার অনুমতি নেই', 'Not allowed for this scope')); return; }
    if (!(+d.v > 0) || (d.type === 'pct' && +d.v > 100)) { PX.toast(T('ছাড়ের পরিমাণ ঠিক নয় (শতকরা ১–১০০)', 'Invalid value (percent must be 1–100)')); return; }
    if (!d.expiry || d.expiry < PX.TODAY) { PX.toast(T('মেয়াদ আজকের পরে হতে হবে', 'Expiry must be in the future')); return; }
    DB.coupons.unshift({ code, type: d.type, v: +d.v, scope: d.scope || '', by: f.dataset.by, active: true, uses: 0, limit: +d.limit || 50, expiry: d.expiry }); PX.toast(T('কুপন তৈরি হয়েছে', 'Coupon created')); PX.refresh();
  };
  PX.CHG.upnote = el => { const s = PX.session(el.dataset.sid); Array.from(el.files).forEach(f => s.notes.push({ name: f.name, size: Math.max(1, Math.round(f.size / 1024)) })); PX.toast(T('নোট যোগ হয়েছে', 'Note added')); PX.refresh(); };
  PX.CHG.tdoc = () => PX.toast(T('ডকুমেন্ট জমা হয়েছে, অ্যাডমিন যাচাই করবে', 'Uploaded; admin will verify'));
})();
