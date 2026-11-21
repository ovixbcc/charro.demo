/* স্টুডেন্ট পোর্টাল */
(function () {
  'use strict';
  const PX = window.PX, { T, n, mny, esc, fd, ic, COURSE, TEACH, TODAY, DB } = Object.assign({}, PX, { DB: PX.DB }), UI = PX.ui, L = CH.L;
  const S = PX.sec.s, ME = () => DB.me;
  const bn = o => esc(L(o));
  const ctitle = cid => bn(COURSE(cid).title);
  const tname = cid => esc(TEACH(COURSE(cid).teacher).n.bn);
  const myCids = () => DB.enr.map(e => e.cid);
  const nextOf = cid => PX.sessions(cid).find(s => s.date >= TODAY && PX.sstate(s) !== 'cancelled');
  const blockedEnr = cid => { const e = PX.myEnr(cid); return !!e && e.state === 'overdue'; };
  const dueDays = d => Math.round((new Date(d + 'T00:00:00Z') - new Date(TODAY + 'T00:00:00Z')) / 864e5);

  PX.nav.s = () => {
    const od = DB.enr.filter(e => e.state === 'overdue').length;
    return [
      { k: 'home', l: T('ড্যাশবোর্ড', 'Dashboard'), i: 'home' },
      { k: 'courses', l: T('আমার কোর্স', 'My courses'), i: 'book', also: ['course', 'class'] },
      { k: 'schedule', l: T('ক্যালেন্ডার', 'Calendar'), i: 'calendar' },
      { k: 'attendance', l: T('উপস্থিতি', 'Attendance'), i: 'check' },
      { k: 'notices', l: T('নোটিশ ও রেজাল্ট', 'Notices & results'), i: 'file' },
      { k: 'messages', l: T('মেসেজ', 'Messages'), i: 'chat' },
      { k: 'explore', l: T('আরও কোর্স', 'Explore'), i: 'search' },
      { k: 'pay', l: T('পেমেন্ট', 'Payments'), i: 'award', badge: od ? n(od) : '' },
      { k: 'refer', l: T('রেফারেল ও কুপন', 'Referral & coupons'), i: 'users' },
      { k: 'support', l: T('সাপোর্ট', 'Support'), i: 'phone' },
      { k: 'policies', l: T('পলিসি', 'Policies'), i: 'shield' },
      { k: 'profile', l: T('প্রোফাইল', 'Profile'), i: 'user' },
    ];
  };

  /* কনফার্ম পেমেন্ট (অ্যাডমিন ব্যবহার করে) */
  PX.confirmPay = pid => {
    const p = DB.pays.find(x => x.id === pid); if (!p) return;
    p.status = 'confirmed';
    if (p.sid === 'u1') {
      const e = PX.myEnr(p.cid);
      if (e) { e.state = 'active'; e.paid++; if (e.m > 0) { const d = new Date((e.nextDue || TODAY) + 'T00:00:00Z'); d.setUTCMonth(d.getUTCMonth() + e.m); e.nextDue = d.toISOString().slice(0, 10); } }
    }
  };

  function joinBtn(s, big) {
    const st = PX.sstate(s), cid = s.cid, e = PX.myEnr(cid);
    if (st === 'cancelled') return UI.chip(T('ক্লাস বাতিল', 'Cancelled'), 'bad');
    if (st === 'done') return '';
    if (e && e.state === 'overdue') return `<button class="btn btn-p ${big ? '' : 'btn-sm'}" data-pa="paynow" data-cid="${cid}">${T('এখনই সাবস্ক্রিপশন দিন', 'Pay subscription now')}</button>`;
    const nx = nextOf(cid);
    const ok = st === 'today' || (nx && nx.id === s.id);
    return ok ? `<button class="btn btn-p ${big ? '' : 'btn-sm'}" data-pa="join" data-sid="${s.id}">${ic('video')} ${T('ক্লাসে যোগ দিন', 'Join class')}</button>` : `<span class="soft">${T('জয়েন লিংক ক্লাসের আগে চালু হবে', 'Join opens before class')}</span>`;
  }

  /* ---------- ড্যাশবোর্ড ---------- */
  S.home = () => {
    const rem = DB.enr.filter(e => e.m > 0 && e.state === 'active' && e.nextDue && dueDays(e.nextDue) <= 10).map(e => `<div class="alert warn">${ic('clock')}<div><b>${T('সাবস্ক্রিপশন রিমাইন্ডার', 'Subscription reminder')}</b><p>${ctitle(e.cid)} — ${T(`${fd(e.nextDue)} তারিখের মধ্যে ${mny(e.per)} পরিশোধ করুন। মাসের শেষ দিনে পরিশোধ না হলে পরের ক্লাসে যোগ দেওয়া যাবে না।`, `Please pay ${mny(e.per)} by ${fd(e.nextDue)}. Unpaid subscriptions block the next class.`)}</p></div><button class="btn btn-o btn-sm" data-pa="paynow" data-cid="${e.cid}">${T('এখনই পরিশোধ', 'Pay now')}</button></div>`).join('');
    const od = DB.enr.filter(e => e.state === 'overdue').map(e => `<div class="alert bad">${ic('shield')}<div><b>${T('সাবস্ক্রিপশন বকেয়া', 'Subscription overdue')}</b><p>${ctitle(e.cid)} — ${T('বকেয়া পরিশোধ না করা পর্যন্ত পরের ক্লাস বন্ধ থাকবে।', 'Next classes are blocked until you pay.')}</p></div><button class="btn btn-p btn-sm" data-pa="paynow" data-cid="${e.cid}">${T('এখনই সাবস্ক্রিপশন দিন', 'Pay subscription now')}</button></div>`).join('');
    const up = DB.enr.map(e => nextOf(e.cid)).filter(Boolean).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const att = Math.round(DB.enr.reduce((a, e) => a + PX.attPct(e.cid, 'u1'), 0) / DB.enr.length);
    const pend = DB.enr.flatMap(e => PX.quizzesOf(e.cid)).filter(q => !DB.scores[q.id] && q.date <= TODAY).length;
    const kp = `<div class="kpis">${UI.kpi(T('এনরোল্ড কোর্স', 'Enrolled'), n(DB.enr.length))}${UI.kpi(T('গড় উপস্থিতি', 'Avg attendance'), n(att) + '%', '', att >= 75 ? 'ok' : 'warn')}${UI.kpi(T('বাকি কুইজ', 'Quizzes due'), n(pend))}${UI.kpi(T('বকেয়া', 'Overdue'), n(DB.enr.filter(e => e.state === 'overdue').length), '', DB.enr.some(e => e.state === 'overdue') ? 'bad' : 'ok')}</div>`;
    const ups = UI.card(T('পরবর্তী ক্লাস', 'Next classes'), up.slice(0, 4).map(s => `<div class="row-i"><div><b>${ctitle(s.cid)}</b><small>${fd(s.date)} · ${esc(s.time)} · ${esc(L(s.topic))}</small></div>${joinBtn(s)}</div>`).join('') || UI.empty(T('কোনো আসন্ন ক্লাস নেই', 'No upcoming classes')));
    const mine = UI.card(T('আমার কোর্স', 'My courses'), `<div class="mc-g">${DB.enr.map(e => { const c = COURSE(e.cid); return `<a class="mc" href="#s-course-${e.cid}"><b>${ctitle(e.cid)}</b><small>${tname(e.cid)} · ${e.fmt === 'one' ? T('১-টু-১', '1-to-1') : CH.L(ctype(e.fmt))}</small><div class="bar"><i style="width:${PX.attPct(e.cid, 'u1')}%"></i></div><small>${T('উপস্থিতি', 'Attendance')} ${n(PX.attPct(e.cid, 'u1'))}%</small>${e.state === 'overdue' ? UI.chip(T('বকেয়া', 'Overdue'), 'bad') : ''}</a>`; }).join('')}</div>`, `<a class="lnk" href="#s-courses">${T('সব দেখুন', 'View all')}</a>`);
    const others = UI.card(T('আরও কোর্স ও ফ্রি কোর্স', 'More courses & free courses'), `<h4 class="sub">${T('ফ্রি কোর্স', 'Free courses')}</h4><div class="fc-g">${DB.free.slice(0, 3).map(f => freeCard(f)).join('')}</div><h4 class="sub">${T('আপনার জন্য কোর্স', 'Recommended')}</h4><div class="fc-g">${COURSES.filter(c => !myCids().includes(c.id)).slice(0, 3).map(c => `<a class="fc" href="#course-${c.id}"><b>${bn(c.title)}</b><small>${esc(TEACH(c.teacher).n.bn)}</small><span>${T('মাসিক', 'From')} ${mny(pricingFor(c).group.perD)}</span></a>`).join('')}</div>`, `<a class="lnk" href="#s-explore">${T('আরও', 'More')}</a>`);
    return UI.announcements('student') + od + rem + kp + `<div class="g2">${ups}${UI.card(T('সাম্প্রতিক নোটিশ', 'Recent notices'), recentPosts(), `<a class="lnk" href="#s-notices">${T('সব', 'All')}</a>`)}</div>` + mine + others;
  };
  function recentPosts() {
    const l = DB.enr.flatMap(e => PX.posts(e.cid)).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
    return l.map(p => `<div class="row-i"><div><b>${esc(p.title)}</b><small>${ctitle(p.cid)} · ${fd(p.date)}</small></div>${p.type === 'result' ? UI.chip(T('রেজাল্ট', 'Result'), 'info') : UI.chip(T('নোটিশ', 'Notice'), '')}</div>`).join('') || UI.empty('—');
  }
  function freeCard(f) {
    const on = DB.freeIn.includes(f.id);
    return `<div class="fc"><b>${esc(f.title)}</b><small>${esc(TEACH(f.by).n.bn)} · ${n(f.lessons)} ${T('টি পাঠ', 'lessons')}</small><p>${esc(f.d)}</p>${on ? UI.chip(T('এনরোল্ড', 'Enrolled'), 'ok') : `<button class="btn btn-o btn-sm" data-pa="freein" data-id="${f.id}">${T('ফ্রি এনরোল', 'Enroll free')}</button>`}</div>`;
  }

  /* ---------- আমার কোর্স ---------- */
  S.courses = () => UI.card('', `<div class="mc-g">${DB.enr.map(e => `<a class="mc" href="#s-course-${e.cid}"><b>${ctitle(e.cid)}</b><small>${tname(e.cid)}</small><small>${e.m ? T(`প্রতি ${n(e.m)} মাসে ${mny(e.per)}`, `${mny(e.per)} every ${e.m} mo`) : T('একবারে পরিশোধিত', 'Paid in full')}</small>${UI.stChip(e.state)}</a>`).join('')}</div>`) + (DB.freeIn.length ? UI.card(T('আমার ফ্রি কোর্স', 'My free courses'), DB.freeIn.map(id => { const f = DB.free.find(x => x.id === id); return `<div class="row-i"><div><b>${esc(f.title)}</b><small>${n(f.lessons)} ${T('টি পাঠ', 'lessons')}</small></div>${UI.chip(T('চালু', 'Active'), 'ok')}</div>`; }).join('')) : '');

  S.course = cid => {
    const e = PX.myEnr(cid); if (!e) return UI.card('', UI.empty(T('এই কোর্সে এনরোল করা নেই', 'Not enrolled')));
    const c = COURSE(cid), tab = PX.S.tab['sc' + cid] || 'classes', k = 'sc' + cid;
    const list = [['classes', T('ক্লাস', 'Classes')], ['files', T('ফাইল', 'Files')], ['chat', T('চ্যাট', 'Chat')], ['board', T('লিডারবোর্ড', 'Leaderboard')], ['quiz', T('কুইজ', 'Quizzes')], ['posts', T('নোটিশ ও রেজাল্ট', 'Notices')], ['recs', T('রেকর্ডিং', 'Recordings')], ['att', T('উপস্থিতি', 'Attendance')]];
    const head = `<div class="ch"><div><h2>${bn(c.title)}</h2><p>${tname(cid)} · ${esc(L(c.time))} · ${c.days.map(d => esc(L(DAYS[d]))).join(', ')}</p></div><div>${UI.stChip(e.state)}${e.state === 'overdue' ? `<button class="btn btn-p btn-sm" data-pa="paynow" data-cid="${cid}">${T('এখনই সাবস্ক্রিপশন দিন', 'Pay subscription now')}</button>` : ''}</div></div>`;
    let body = '';
    if (tab === 'classes') {
      const ss = PX.sessions(cid), nx = nextOf(cid);
      body = UI.card(T('ক্লাস তালিকা', 'Classes'), UI.tbl(['#', T('বিষয়', 'Topic'), T('তারিখ', 'Date'), T('সময়', 'Time'), T('অবস্থা', 'Status'), ''], ss.slice(0, 40).map(s => [n(s.n), `<a href="#s-class-${s.id}">${esc(L(s.topic))}</a>`, fd(s.date), esc(s.time), UI.stChip(PX.sstate(s)), PX.sstate(s) === 'done' ? `<a class="btn btn-o btn-sm" href="#s-class-${s.id}">${T('নোট ও রিভিউ', 'Notes & review')}</a>` : joinBtn(s)])));
      if (nx) body = UI.card(T('পরবর্তী ক্লাস', 'Next class'), `<div class="row-i"><div><b>${esc(L(nx.topic))}</b><small>${fd(nx.date)} · ${esc(nx.time)}</small></div>${joinBtn(nx, true)}</div>`) + body;
    }
    if (tab === 'files') body = UI.card(T('ফাইল শেয়ারিং', 'Shared files'), `<label class="btn btn-o btn-sm upl">${ic('upload')} ${T('ফাইল পাঠান', 'Share a file')}<input type="file" data-pc="upfile" data-cid="${cid}" data-role="s" multiple hidden></label>` + UI.tbl([T('ফাইল', 'File'), T('কে দিয়েছেন', 'By'), T('সাইজ', 'Size'), T('তারিখ', 'Date')], PX.files(cid).map(f => [`${ic('file')} ${esc(f.name)}`, `${esc(f.by)} ${f.role === 't' ? UI.chip(T('টিচার', 'Teacher'), 'info') : ''}`, UI.sizeTxt(f.size), fd(f.date)])));
    if (tab === 'chat') body = UI.card(e.fmt === 'one' ? T('১-টু-১ চ্যাট', '1-to-1 chat') : T('ব্যাচ গ্রুপ চ্যাট', 'Batch group chat'), chatBox(cid, 's'));
    if (tab === 'board') body = UI.card(T('ক্লাস লিডারবোর্ড', 'Class leaderboard'), `<p class="soft">${T('পয়েন্ট আসে কুইজ, উপস্থিতি ও অংশগ্রহণ থেকে।', 'Points come from quizzes, attendance and participation.')}</p>` + UI.tbl([T('অবস্থান', 'Rank'), T('নাম', 'Name'), T('পয়েন্ট', 'Points')], PX.board(cid).map((r, i) => [n(i + 1) + (i === 0 ? ' 🥇' : i === 1 ? ' 🥈' : i === 2 ? ' 🥉' : ''), r.u.id === 'u1' ? `<b>${esc(r.u.name)} (${T('আপনি', 'You')})</b>` : esc(r.u.name), n(r.p)])));
    if (tab === 'quiz') body = UI.card(T('কুইজ', 'Quizzes'), PX.quizzesOf(cid).map(q => { const sc = DB.scores[q.id]; return `<div class="row-i"><div><b>${esc(q.title)}</b><small>${fd(q.date)} · ${n(q.dur)} ${T('মিনিট', 'min')}</small></div>${sc ? UI.chip(`${n(sc.s)}/${n(sc.t)}`, 'ok') : q.date <= TODAY ? `<button class="btn btn-p btn-sm" data-pa="quiz" data-id="${q.id}">${T('কুইজ দিন', 'Take quiz')}</button>` : UI.chip(T('শুরু হবে ', 'Starts ') + fd(q.date), 'info')}</div>`; }).join('')) + UI.card(T('এই কোর্সের ক্যালেন্ডার', 'Course calendar'), PX.calendar([cid], 's'));
    if (tab === 'posts') body = UI.card(T('টিচারের নোটিশ, রেজাল্ট ও ফাইল', 'Notices, results and files'), PX.posts(cid).map(postHtml).join(''));
    if (tab === 'recs') body = UI.card(T('গুরুত্বপূর্ণ রেকর্ডিং', 'Important recordings'), `<p class="soft">${T('লাইভ ক্লাস রেকর্ড করা হয় না। শুধু টিচারের নির্বাচিত গুরুত্বপূর্ণ অংশ এখানে থাকে।', 'Live classes are not recorded. Only selected important recordings appear here.')}</p>` + PX.recs(cid).map(r => `<div class="row-i"><div><b>${ic('play')} ${esc(r.title)}</b><small>${esc(r.dur)} · ${fd(r.date)}</small></div><button class="btn btn-o btn-sm" data-pa="play">${T('দেখুন', 'Watch')}</button></div>`).join(''));
    if (tab === 'att') body = attTable(cid);
    return head + UI.tabs(k, list, tab) + body;
  };
  function postHtml(p) { return `<article class="post"><header><b>${esc(p.title)}</b>${p.type === 'result' ? UI.chip(T('রেজাল্ট', 'Result'), 'info') : UI.chip(T('নোটিশ', 'Notice'), '')}</header><p>${esc(p.body)}</p><div class="post-f">${(p.files || []).map(f => `<span class="fchip">${ic('file')} ${esc(f)}</span>`).join('')}<small>${esc(p.by)} · ${fd(p.date)}</small></div></article>`; }
  PX.postHtml = postHtml;
  function chatBox(cid, role) {
    const l = PX.chat(cid);
    return `<div class="chat-log">${l.map(m => `<div class="msg ${m.role === role ? 'me' : ''}"><small>${esc(m.from)} ${m.role === 't' ? '· ' + T('টিচার', 'Teacher') : ''} · ${esc(m.at)}</small><p>${esc(m.text)}</p></div>`).join('')}</div>
    <form class="chat-f" data-pf="chat" data-cid="${cid}" data-role="${role}"><input id="chat-in" name="text" required placeholder="${T('মেসেজ লিখুন…', 'Type a message…')}" autocomplete="off"><button class="btn btn-p btn-sm">${T('পাঠান', 'Send')}</button></form>`;
  }
  PX.chatBox = chatBox;
  function attTable(cid) {
    const done = PX.sessions(cid).filter(s => PX.sstate(s) === 'done');
    const p = done.filter(s => PX.attOf(s.id, 'u1')).length;
    return `<div class="kpis">${UI.kpi(T('উপস্থিত', 'Present'), n(p), '', 'ok')}${UI.kpi(T('অনুপস্থিত', 'Absent'), n(done.length - p), '', 'bad')}${UI.kpi(T('শতকরা', 'Percent'), n(PX.attPct(cid, 'u1')) + '%')}</div>` + UI.card(T('উপস্থিতির ইতিহাস', 'Attendance history'), UI.tbl([T('তারিখ', 'Date'), T('বিষয়', 'Topic'), T('অবস্থা', 'Status')], done.slice().reverse().map(s => [fd(s.date), `<a href="#s-class-${s.id}">${esc(L(s.topic))}</a>`, PX.attOf(s.id, 'u1') ? UI.chip(T('উপস্থিত', 'Present'), 'ok') : UI.chip(T('অনুপস্থিত', 'Absent'), 'bad')])));
  }
  S.attendance = () => DB.enr.map(e => UI.card(ctitle(e.cid), attTable(e.cid).replace(/<div class="kpis">/, '<div class="kpis sm">'))).join('');

  /* ---------- ক্লাস ডিটেইল ---------- */
  S.class = sid => {
    const s = PX.session(sid || ''); if (!s) return UI.card('', UI.empty(T('ক্লাস পাওয়া যায়নি', 'Class not found')));
    const st = PX.sstate(s), rv = DB.reviews.find(r => r.sid === sid && r.uid === 'u1');
    return `<a class="lnk back" href="#s-course-${s.cid}">${ic('left')} ${ctitle(s.cid)}</a>` + UI.card(esc(L(s.topic)), `<div class="row-i"><div><b>${fd(s.date)} · ${esc(s.time)}</b><small>${tname(s.cid)} · ${esc(L(s.sub))}</small></div><div>${UI.stChip(st)} ${joinBtn(s)}</div></div>`) +
      UI.card(T('ক্লাস নোট ও ম্যাটেরিয়াল', 'Class notes & materials'), s.notes.length ? UI.tbl([T('ফাইল', 'File'), T('সাইজ', 'Size')], s.notes.map(f => [`${ic('file')} ${esc(f.name)}`, UI.sizeTxt(f.size)])) : UI.empty(st === 'done' ? T('এই ক্লাসের নোট এখনো যোগ হয়নি', 'No notes yet') : T('ক্লাসের পর টিচার নোট যোগ করবেন', 'Teacher will add notes after the class'))) +
      (st === 'done' ? UI.card(T('উপস্থিতি ও রিভিউ', 'Attendance & review'), `<div class="row-i"><div>${PX.attOf(sid, 'u1') ? UI.chip(T('আপনি উপস্থিত ছিলেন', 'You were present'), 'ok') : UI.chip(T('আপনি অনুপস্থিত ছিলেন', 'You were absent'), 'bad')}</div>${rv ? `<div>${UI.chip(T('রিভিউ দেওয়া হয়েছে', 'Reviewed') + ' ★' + n(rv.overall), 'ok')}</div>` : `<button class="btn btn-p btn-sm" data-pa="review" data-sid="${sid}">${ic('award')} ${T('রিভিউ দিন', 'Review this class')}</button>`}</div>`) : '');
  };

  S.schedule = () => UI.card(T('ক্লাস ও কুইজের ক্যালেন্ডার', 'Class & quiz calendar'), PX.calendar(myCids(), 's'));

  S.notices = () => UI.card(T('টিচারদের নোটিশ, রেজাল্ট ও ফাইল', 'Notices, results & files'), DB.enr.map(e => `<h4 class="sub">${ctitle(e.cid)}</h4>` + PX.posts(e.cid).map(postHtml).join('')).join(''));

  /* ---------- মেসেজ (টিচার + অভিভাবক) ---------- */
  DB.dm = DB.dm || {};
  PX.dm = tid => DB.dm[tid] || (DB.dm[tid] = [{ from: 't', text: 'If you have any questions, ask here. Your guardian will be kept informed if needed.', at: '18 Nov', cc: false }]);
  S.messages = () => {
    const tids = [...new Set(DB.enr.map(e => COURSE(e.cid).teacher))], cur = PX.S.tab.dm || tids[0];
    const l = PX.dm(cur);
    return UI.tabs('dm', tids.map(t => [t, TEACH(t).n.bn]), cur) + UI.card(T('টিচারের সাথে মেসেজ', 'Message teacher'), `<div class="chat-log">${l.map(m => `<div class="msg ${m.from === 's' ? 'me' : ''}"><small>${m.from === 's' ? esc(ME().name) : esc(TEACH(cur).n.bn)} · ${esc(m.at)} ${m.cc ? '· ' + T('অভিভাবককে অনুলিপি', 'Parent copied') : ''}</small><p>${esc(m.text)}</p></div>`).join('')}</div>
      <form class="chat-f col" data-pf="dm" data-tid="${cur}" data-role="s"><input id="chat-in" name="text" required placeholder="${T('মেসেজ লিখুন…', 'Type a message…')}" autocomplete="off"><label class="ck"><input type="checkbox" name="cc"><span>${T('অভিভাবককে (' + esc(ME().guardian.name) + ') অনুলিপি পাঠান', 'Copy guardian (' + esc(ME().guardian.name) + ')')}</span></label><button class="btn btn-p btn-sm">${T('পাঠান', 'Send')}</button></form>`);
  };

  /* ---------- এক্সপ্লোর ---------- */
  S.explore = () => UI.card(T('ফ্রি কোর্স', 'Free courses'), `<div class="fc-g">${DB.free.map(freeCard).join('')}</div>`) +
    UI.card(T('অন্যান্য কোর্স', 'Other courses'), `<div class="fc-g">${COURSES.filter(c => !myCids().includes(c.id)).map(c => `<div class="fc"><b>${bn(c.title)}</b><small>${esc(TEACH(c.teacher).n.bn)} · ${n(c.rating)} ★</small><span>${T('গ্রুপ', 'Group')} ${mny(pricingFor(c).group.perD)} / ${T('মাস', 'mo')}</span><a class="btn btn-o btn-sm" href="#course-${c.id}">${T('বিস্তারিত ও এনরোল', 'Details & enroll')}</a></div>`).join('')}</div>`);

  /* ---------- পেমেন্ট ---------- */
  S.pay = () => {
    const my = DB.pays.filter(p => p.sid === 'u1').sort((a, b) => b.date.localeCompare(a.date));
    const subs = UI.card(T('আমার সাবস্ক্রিপশন', 'My subscriptions'), UI.tbl([T('কোর্স', 'Course'), T('প্ল্যান', 'Plan'), T('পরবর্তী ডিউ', 'Next due'), T('অবস্থা', 'Status'), ''], DB.enr.map(e => [ctitle(e.cid), e.m ? T(`প্রতি ${n(e.m)} মাসে ${mny(e.per)}`, `${mny(e.per)} / ${e.m} mo`) : T('একবারে', 'One-time'), e.nextDue ? fd(e.nextDue) : '—', UI.stChip(e.state), e.m ? `<button class="btn ${e.state === 'overdue' ? 'btn-p' : 'btn-o'} btn-sm" data-pa="paynow" data-cid="${e.cid}">${e.state === 'overdue' ? T('এখনই সাবস্ক্রিপশন দিন', 'Pay subscription now') : T('আগাম পরিশোধ', 'Pay early')}</button>` : '']))) + `<p class="soft">${T('মাসিক সাবস্ক্রিপশনের রিমাইন্ডার প্রতি মাসের শেষ দিনে আসে। বকেয়া থাকলে পরের ক্লাসে প্রবেশ বন্ধ থাকে।', 'Reminders arrive on the last day of each month. Overdue plans block the next class.')}</p>`;
    return subs + UI.card(T('পেমেন্ট ইতিহাস', 'Payment history'), UI.tbl([T('তারিখ', 'Date'), T('কোর্স', 'Course'), T('মাধ্যম', 'Method'), T('পরিমাণ', 'Amount'), T('অবস্থা', 'Status'), T('রিসিট', 'Receipt')], my.map(p => [fd(p.date), ctitle(p.cid), p.ch === 'cash' ? T('ক্যাশ', 'Cash') : esc(p.ch), mny(p.amount), UI.stChip(p.status), `<button class="btn btn-o btn-sm" data-pa="rcpt" data-id="${p.id}">${ic('download')} PDF</button>`])));
  };

  /* ---------- রেফারেল ও কুপন ---------- */
  S.refer = () => {
    const r = DB.settings.refS, rt = r.type === 'pct' ? n(r.v) + '%' : mny(r.v), tot = DB.refS.reduce((a, x) => a + x.bonus, 0);
    return `<div class="kpis">${UI.kpi(T('আমার রেফারেল কোড', 'My code'), 'TASNIM-7A2K')}${UI.kpi(T('রেফার করা', 'Referred'), n(DB.refS.length))}${UI.kpi(T('মোট বোনাস', 'Total bonus'), mny(tot), '', 'ok')}</div>` + UI.card(T('রেফারেল প্রোগ্রাম', 'Referral program'), `<p>${T(`বন্ধুকে রেফার করলে তার প্রথম পেমেন্টে আপনি পাবেন ${rt} বোনাস।`, `Earn ${rt} bonus on your friend's first payment.`)}</p><button class="btn btn-o btn-sm" data-pa="copy">${T('কোড কপি করুন', 'Copy code')}</button>`) +
      UI.card(T('রেফারেল তালিকা', 'Referral list'), UI.tbl([T('নাম', 'Name'), T('তারিখ', 'Date'), T('অবস্থা', 'Status'), T('বোনাস', 'Bonus')], DB.refS.map(x => [esc(x.name), fd(x.date), x.status === 'enrolled' ? UI.chip(T('এনরোল করেছে', 'Enrolled'), 'ok') : UI.chip(T('যুক্ত হয়েছে', 'Joined'), 'warn'), mny(x.bonus)]))) +
      UI.card(T('কুপন কোড', 'Coupon codes'), UI.tbl([T('কোড', 'Code'), T('ছাড়', 'Off'), T('প্রযোজ্য', 'Applies to'), T('মেয়াদ', 'Expiry')], DB.coupons.filter(c => c.active).map(c => [`<b>${esc(c.code)}</b>`, c.type === 'pct' ? n(c.v) + '%' : mny(c.v), esc(PX.scopeLabel(c.scope)), fd(c.expiry)])));
  };

  /* ---------- সাপোর্ট / পলিসি / প্রোফাইল ---------- */
  /* সাপোর্টে ফাইল আপলোড */
  const ATT_MAX = 5, ATT_MB = 5, ATT_OK = /\.(jpe?g|png|webp|pdf|docx?|xlsx?|txt)$/i;
  PX.attPick = (label) => `<label class="btn btn-o btn-sm upl att-pick" title="${T('ফাইল যুক্ত করুন', 'Attach files')}">${ic('upload')} <span>${label || T('ফাইল', 'Attach')}</span><input type="file" name="files" data-pc="attpick" multiple accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt" hidden></label>`;
  PX.CHG.attpick = el => { const sp = el.parentElement.querySelector('span'), n = el.files.length; sp.textContent = n ? (n + ' ' + T('টি ফাইল', 'file(s)')) : T('ফাইল', 'Attach'); const out = el.closest('form').querySelector('[data-pick-out]'); if (out) out.textContent = Array.from(el.files).map(f => f.name).join(', '); };
  PX.readFiles = f => {
    const inp = f.elements.files, list = inp ? Array.from(inp.files) : [];
    if (list.length > ATT_MAX) return { err: T(`একসাথে সর্বোচ্চ ${n(ATT_MAX)}টি ফাইল`, `Max ${ATT_MAX} files at a time`) };
    const bad = list.find(x => !ATT_OK.test(x.name)); if (bad) return { err: T('শুধু ছবি, PDF, Word, Excel বা টেক্সট ফাইল দিন: ', 'Only images, PDF, Word, Excel or text: ') + bad.name };
    const big = list.find(x => x.size > ATT_MB * 1048576); if (big) return { err: T(`প্রতিটি ফাইল ${n(ATT_MB)} এমবির মধ্যে হতে হবে: `, `Each file must be under ${ATT_MB} MB: `) + big.name };
    return { files: list.map(x => ({ name: x.name, size: Math.max(1, Math.round(x.size / 1024)), url: URL.createObjectURL(x), img: /^image\//.test(x.type) })) };
  };
  PX.attList = a => a && a.length ? `<div class="atts">${a.map(x => `<a class="att" href="${x.url}" target="_blank" rel="noopener" download="${esc(x.name)}">${x.img ? `<img src="${x.url}" alt="">` : ic('file')}<span><b>${esc(x.name)}</b><small>${n(x.size)} KB</small></span></a>`).join('')}</div>` : '';
  PX.ticketUI = (uid, role) => {
    const my = DB.tickets.filter(t => t.uid === uid);
    return UI.card(T('নতুন টিকিট', 'New ticket'), `<form data-pf="ticket" data-uid="${uid}" data-role="${role}" class="fgrid">${UI.fi({ name: 'cat', label: T('বিভাগ', 'Category'), half: 1, opts: ['Payment', 'Class', 'Technical', 'Other'].map(x => [x, x]) })}${UI.fi({ name: 'subject', label: T('বিষয়', 'Subject'), req: 1, half: 1 })}${UI.fi({ name: 'msg', label: T('বিস্তারিত', 'Details'), rows: 3, req: 1 })}<div class="fld"><label>${T('ফাইল যুক্ত করুন (স্ক্রিনশট, রসিদ, PDF)', 'Attach files (screenshot, receipt, PDF)')}</label>${PX.attPick(T('ফাইল বেছে নিন', 'Choose files'))}<small class="hint" data-pick-out></small><small class="hint">${T(`সর্বোচ্চ ${n(ATT_MAX)}টি, প্রতিটি ${n(ATT_MB)} এমবি পর্যন্ত`, `Up to ${ATT_MAX} files, ${ATT_MB} MB each`)}</small></div><div class="fld"><button class="btn btn-p">${T('টিকিট খুলুন', 'Open ticket')}</button></div></form>`) +
      UI.card(T('আমার টিকিট', 'My tickets'), my.map(t => `<div class="tk"><header><b>#${PX.tno(t)} · ${esc(t.subject)}</b>${UI.stChip(t.status)}<small>${esc(t.cat)} · ${fd(t.date)}</small></header>${t.msgs.map(m => `<div class="msg ${m.from === 'u' ? 'me' : ''}"><small>${m.from === 'u' ? T('আপনি', 'You') : T('সাপোর্ট', 'Support')} · ${fd(m.at)}</small>${m.text ? `<p>${esc(m.text)}</p>` : ''}${PX.attList(m.files)}</div>`).join('')}${t.status === 'closed' ? '' : `<form class="chat-f" data-pf="tkreply" data-id="${t.id}" data-from="u"><input name="text" placeholder="${T('উত্তর লিখুন…', 'Reply…')}">${PX.attPick()}<button class="btn btn-o btn-sm">${T('পাঠান', 'Send')}</button></form>`}</div>`).join('') || UI.empty(T('কোনো টিকিট নেই', 'No tickets')));
  };
  S.support = () => PX.ticketUI('u1', 's');
  PX.policyUI = aud => UI.card(T('পলিসি ও নীতিমালা', 'Policies'), DB.policies.filter(p => p.aud.includes(aud)).map(p => `<details class="pol"><summary>${esc(p.title)}</summary><p>${esc(p.body)}</p><small>${T('সর্বশেষ হালনাগাদ', 'Updated')}: ${fd(p.date)}</small></details>`).join(''));
  S.policies = () => PX.policyUI('student');
  S.profile = () => { const u = ME(); return UI.card(T('আমার প্রোফাইল', 'My profile'), `<form data-pf="profile" class="fgrid">${UI.fi({ name: 'name', label: T('নাম', 'Name'), val: u.name, half: 1, req: 1 })}${UI.fi({ name: 'phone', label: T('ফোন', 'Phone'), val: u.phone, half: 1 })}${UI.fi({ name: 'email', label: T('ইমেইল', 'Email'), val: u.email, half: 1 })}${UI.fi({ name: 'district', label: T('জেলা', 'District'), val: u.district, half: 1 })}${UI.fi({ name: 'gname', label: T('অভিভাবকের নাম', 'Guardian name'), val: u.guardian.name, half: 1 })}${UI.fi({ name: 'gphone', label: T('অভিভাবকের ফোন', 'Guardian phone'), val: u.guardian.phone, half: 1 })}<div class="fld"><button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></div></form>`); };

  /* ---------- অ্যাকশন ---------- */
  const A = PX.ACT, F = PX.FORMS;
  A.join = a => { const s = PX.session(a.dataset.sid); PX.modal(T('ক্লাসে যুক্ত হচ্ছেন', 'Joining class'), `<p>${esc(UI.sessLine(s))}</p><p class="soft">${T('ডেমোতে আসল ভিডিও কল চালু হবে না। বাস্তবে এখানে ক্লিক করলেই লাইভ ক্লাস রুম খুলবে।', 'In this demo no real video call opens. In production this opens the live class room.')}</p><button class="btn btn-p" data-pa="close">${T('ঠিক আছে', 'OK')}</button>`); };
  A.play = () => PX.toast(T('ডেমো: ভিডিও প্লেয়ার এখানে চালু হবে', 'Demo: video player opens here'));
  A.copy = () => PX.toast(T('কোড কপি হয়েছে', 'Code copied'));
  A.freein = a => { if (!DB.freeIn.includes(a.dataset.id)) DB.freeIn.push(a.dataset.id); PX.toast(T('ফ্রি কোর্সে এনরোল হয়েছে', 'Enrolled')); PX.refresh(); };
  A.paynow = a => {
    const e = PX.myEnr(a.dataset.cid), st = DB.settings.channels, pend = DB.pays.find(p => p.sid === 'u1' && p.cid === e.cid && p.status === 'pending');
    PX.modal(T('সাবস্ক্রিপশন পরিশোধ', 'Pay subscription'), `<p><b>${ctitle(e.cid)}</b> — ${mny(e.per)}</p>${pend ? `<div class="alert warn">${ic('clock')}<div><b>${T('ক্যাশ পেমেন্টের অনুরোধ জমা আছে', 'Cash request pending')}</b><p>${T('অ্যাডমিন নিশ্চিত করলেই ক্লাস আবার চালু হবে।', 'Classes resume once admin confirms.')}</p></div></div>` : `<div class="paybox"><label class="po dis"><input type="radio" disabled><span>${T('অনলাইন পেমেন্ট (বিকাশ/কার্ড)', 'Online payment (bKash/card)')} <em>${T('এখন অবৈধ/অনুপলব্ধ', 'Currently unavailable')}</em></span></label><label class="po"><input type="radio" checked><span>${T('ক্যাশ পেমেন্ট', 'Cash payment')}</span></label></div><form data-pf="cash" data-cid="${e.cid}"><button class="btn btn-p">${T('ক্যাশ পেমেন্টের অনুরোধ পাঠান', 'Send cash payment request')}</button></form>`}`);
  };
  F.cash = (f) => { const cid = f.dataset.cid, e = PX.myEnr(cid); DB.pays.unshift({ id: 'p' + DB.nextPid++, sid: 'u1', cid, amount: e.per, ch: 'cash', status: 'pending', date: TODAY, note: 'ক্যাশ অনুরোধ' }); PX.closeModal(); PX.toast(T('অনুরোধ জমা হয়েছে, অ্যাডমিন নিশ্চিত করবে', 'Request submitted')); PX.refresh(); };
  F.chat = (f, d) => { PX.chat(f.dataset.cid).push({ from: f.dataset.role === 't' ? TEACH('t01').n.bn : ME().name, role: f.dataset.role, text: d.text, at: T('এইমাত্র', 'now') }); PX.S.focusChat = true; PX.refresh(); };
  F.dm = (f, d) => { const l = PX.dm(f.dataset.tid); l.push({ from: 's', text: d.text, at: T('এইমাত্র', 'now'), cc: !!(d.cc && d.cc.length) }); l.push({ from: 't', text: T('ধন্যবাদ, আমি দেখে উত্তর দিচ্ছি।', 'Thanks, I will reply soon.'), at: T('এইমাত্র', 'now') }); PX.S.focusChat = true; PX.refresh(); };
  F.ticket = (f, d) => { const r = PX.readFiles(f); if (r.err) { PX.toast(r.err); return; } DB.tickets.unshift({ id: 'tk' + (DB.tickets.length + 1), by: f.dataset.role, uid: f.dataset.uid, name: f.dataset.role === 's' ? ME().name : TEACH('t01').n.bn, cat: d.cat, subject: d.subject, status: 'open', date: TODAY, msgs: [{ from: 'u', text: d.msg, at: TODAY, files: r.files }] }); PX.toast(T('টিকিট খোলা হয়েছে', 'Ticket opened')); PX.refresh(); };
  F.tkreply = (f, d) => { const r = PX.readFiles(f); if (r.err) { PX.toast(r.err); return; } if (!(d.text || '').trim() && !r.files.length) { PX.toast(T('লিখুন বা ফাইল যুক্ত করুন', 'Write something or attach a file')); return; } const t = DB.tickets.find(x => x.id === f.dataset.id); t.msgs.push({ from: f.dataset.from, text: (d.text || '').trim(), at: TODAY, files: r.files }); if (f.dataset.from === 's') t.status = 'progress'; else if (t.status === 'open') t.status = 'progress'; PX.refresh(); };
  F.profile = (f, d) => { const u = ME(); Object.assign(u, { name: d.name, phone: d.phone, email: d.email, district: d.district }); u.guardian = { name: d.gname, phone: d.gphone }; PX.toast(T('প্রোফাইল সংরক্ষিত', 'Saved')); PX.refresh(); };
  A.quiz = a => {
    const q = DB.quizzes.find(x => x.id === a.dataset.id), c = COURSE(q.cid), bank = PX.QB[c.subject] || PX.QB.combined;
    PX.modal(esc(q.title), `<form data-pf="quizsub" data-id="${q.id}"><p class="soft">${n(q.dur)} ${T('মিনিট', 'min')}</p>${bank.map((x, i) => `<fieldset class="qz"><legend>${n(i + 1)}. ${esc(x[0])}</legend>${x[1].map((o, j) => `<label class="ck"><input type="radio" name="q${i}" value="${j}"><span>${esc(o)}</span></label>`).join('')}</fieldset>`).join('')}<button class="btn btn-p">${T('জমা দিন', 'Submit')}</button></form>`, true);
  };
  F.quizsub = (f, d) => { const q = DB.quizzes.find(x => x.id === f.dataset.id), c = COURSE(q.cid), bank = PX.QB[c.subject] || PX.QB.combined; let s = 0; bank.forEach((x, i) => { if (+d['q' + i] === x[2]) s++; }); DB.scores[q.id] = { s, t: bank.length }; DB.extra[q.cid] = DB.extra[q.cid] || {}; DB.extra[q.cid].u1 = (DB.extra[q.cid].u1 || 0) + s * 2; PX.closeModal(); PX.toast(T(`আপনার স্কোর ${n(s)}/${n(bank.length)}`, `Score ${s}/${bank.length}`)); PX.refresh(); };
  const ISS = () => [['att', T('টিচার ক্লাসে দেরিতে/অনুপস্থিত ছিলেন', 'Teacher late/absent')], ['beh', T('টিচারের আচরণ ভালো ছিল না', 'Teacher behaviour')], ['cont', T('পড়ানোর কনটেন্ট মানসম্মত ছিল না', 'Teaching content')], ['net', T('টিচারের ইন্টারনেট/অডিও সমস্যা', 'Teacher internet/audio')], ['time', T('সময় ঠিকমতো মানা হয়নি', 'Time not followed')], ['other', T('অন্যান্য', 'Other')]];
  A.review = a => {
    const s = PX.session(a.dataset.sid);
    PX.modal(T('ক্লাস রিভিউ', 'Review class'), `<form data-pf="review" data-sid="${s.id}"><p>${esc(UI.sessLine(s))}</p><div class="fld"><label>${T('সামগ্রিক রেটিং', 'Overall rating')}</label>${UI.stars('overall', 0)}</div><div class="issues" hidden><div class="alert warn"><div><b>${T('কী সমস্যা হয়েছিল?', 'What went wrong?')}</b></div></div>${UI.checks('issues', ISS(), [], '')}</div>${UI.fi({ name: 'comment', label: T('মন্তব্য', 'Comment'), rows: 3 })}<button class="btn btn-p">${T('রিভিউ জমা দিন', 'Submit review')}</button></form>`);
  };
  F.review = (f, d) => { if (!d.overall) { PX.toast(T('রেটিং দিন', 'Please rate')); return; } const s = PX.session(f.dataset.sid); DB.reviews.push({ sid: s.id, cid: s.cid, uid: 'u1', name: ME().name, overall: +d.overall, issues: +d.overall <= 3 ? (d.issues || []) : [], comment: d.comment, date: TODAY }); PX.closeModal(); PX.toast(T('রিভিউয়ের জন্য ধন্যবাদ', 'Thanks for your review')); PX.refresh(); };
  PX.ISS = ISS;
})();
