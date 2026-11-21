/* P2P সমস্যা সমাধান: স্টুডেন্ট নিজের সমস্যা + বাজেট পোস্ট করে, টিচাররা অ্যাপ্লাই/বিড করে, স্টুডেন্ট বেছে নিয়ে পেমেন্ট করে */
(function () {
  'use strict';
  const PX = window.PX, { T, n, mny, esc, fd, ic, TODAY, TEACH, COURSE } = PX, UI = PX.ui, DB = PX.DB, L = CH.L, F = PX.FORMS, A = PX.ACT;
  const TID = 't01', ME = () => DB.me;
  const crm = i => (DB.crm[i] || {});
  const tp = (id, k) => { const x = (TOPICS[id] || TOPICS.combined || [])[k]; return x ? x.t : { bn: '', en: '' }; };
  DB.p2p = DB.p2p || [
    { id: 'pp1', no: 8001, sid: 'u1', subject: 'math', program: 'buet', cid: '', topics: ['Algebra', 'Trigonometry'], problem: 'I keep getting exponent and logarithm problems wrong in past BUET papers. I want to understand step by step.', classes: 3, budget: 1500, pref: 'Sat/Tue 9 PM', date: '2026-11-17', status: 'open', tid: '', price: 0,
      bids: [{ tid: 't01', price: 1400, msg: 'I work on BUET maths questions regularly. I can sort out logs and exponents in three classes.', at: '2026-11-18', st: 'pending' }, { tid: 't05', price: 1500, msg: 'We will go through the last 10 years of BUET questions.', at: '2026-11-19', st: 'pending' }] },
    { id: 'pp2', no: 8002, sid: 'u1', subject: 'english', program: 'cadet', cid: '', topics: ['Grammar'], problem: 'I want to overcome my fear of transformation of sentences and tag questions.', classes: 2, budget: 800, pref: '', date: '2026-11-10', status: 'paid', tid: 't06', price: 900, paidAt: '2026-11-12', ch: 'bkash',
      bids: [{ tid: 't06', price: 900, msg: 'I will cover it with practice in two classes.', at: '2026-11-11', st: 'accepted' }] },
    { id: 'pp3', no: 8003, sid: crm(4).id || 'u5', subject: 'math', program: 'cadet', cid: '', topics: ['Geometry'], problem: 'I cannot remember geometry proofs. I want to learn how to think about them.', classes: 4, budget: 2000, pref: 'Any afternoon', date: '2026-11-20', status: 'open', tid: '', price: 0, bids: [] },
    { id: 'pp4', no: 8004, sid: crm(5).id || 'u6', subject: 'math', program: '', cid: '', topics: ['Arithmetic'], problem: 'I want to get faster at percentage and ratio problems.', classes: 1, budget: 500, pref: '', date: '2026-11-21', status: 'open', tid: '', price: 0, bids: [] },
  ];
  const stuOf = sid => DB.crm.find(u => u.id === sid) || (sid === 'u1' ? ME() : { name: '—', sid: '', phone: '' });
  const SUBS = () => SUBJECTS.map(s => [s.id, L(s)]);
  const topicList = sub => (TOPICS[sub] || TOPICS.combined || []).map(x => [L(x.t), L(x.t)]);
  const stChip = s => ({ open: UI.chip(T('খোলা — টিচারদের আবেদন চলছে', 'Open — teachers applying'), 'info'), accepted: UI.chip(T('টিচার বাছাই হয়েছে — পেমেন্ট বাকি', 'Teacher chosen — payment due'), 'warn'), paid: UI.chip(T('পেমেন্ট হয়েছে — ক্লাস চলছে', 'Paid — in progress'), 'ok'), done: UI.chip(T('সম্পন্ন', 'Completed'), 'ok'), closed: UI.chip(T('বন্ধ', 'Closed')) })[s] || '';
  const subjName = id => L(SUBJECTS.find(s => s.id === id) || {});
  const progName = id => { const p = PROGRAMS.find(x => x.id === id); return p ? L(p.s) : ''; };
  const matches = (p, tid) => { const t = TEACH(tid); return (t.subs || []).includes(p.subject) || (p.cid && COURSE(p.cid) && COURSE(p.cid).teacher === tid); };
  const myBid = (p, tid) => p.bids.find(b => b.tid === tid);

  /* ===== স্টুডেন্ট ===== */
  const mine = () => DB.p2p.filter(p => p.sid === 'u1');
  const topicBox = sub => UI.checks('topics', topicList(sub), [], T('টপিক বেছে নিন (একাধিক হতে পারে)', 'Pick topics (one or more)'));
  const postForm = () => `<form data-pf="p2ppost" class="fgrid">
    ${UI.fi({ name: 'program', label: T('কোর্স টাইপ (প্রোগ্রাম)', 'Course type (program)'), half: 1, opts: [['', T('যেকোনো / নির্দিষ্ট না', 'Any / not specific')]].concat(PROGRAMS.filter(p => !p.hidden).map(p => [p.id, L(p.s)])) })}
    ${UI.fi({ name: 'subject', label: T('বিষয়', 'Subject'), half: 1, req: 1, opts: SUBS(), val: 'math' }).replace('name="subject"', 'name="subject" data-pc="p2psub"')}
    ${UI.fi({ name: 'cid', label: T('কোন কোর্স (থাকলে)', 'Which course (optional)'), opts: [['', T('কোনো নির্দিষ্ট কোর্স নয়', 'Not tied to a course')]].concat(liveCourses().map(c => [c.id, L(c.title)])) })}
    <div id="p2p-topics" class="fld full">${topicBox('math')}</div>
    ${UI.fi({ name: 'problem', label: T('আপনার সমস্যাটি লিখুন', 'Describe the problem you want solved'), rows: 4, req: 1, ph: T('কোন জায়গায় আটকে যাচ্ছেন, কী বুঝতে পারছেন না…', 'Where you get stuck, what you do not understand…') })}
    ${UI.fi({ name: 'classes', label: T('কয়টি ক্লাস চান', 'How many classes'), type: 'number', min: 1, val: 2, half: 1, req: 1 })}
    ${UI.fi({ name: 'budget', label: T('মোট বাজেট (৳)', 'Total budget (৳)'), type: 'number', min: 100, val: 1000, half: 1, req: 1 })}
    <div class="fld"><div class="bud-q">${[500, 1000, 2000].map(v => `<button type="button" class="btn btn-o btn-sm" data-pa="p2pbud" data-v="${v}">${mny(v)}</button>`).join('')}</div></div>
    ${UI.fi({ name: 'pref', label: T('পছন্দের সময় (ঐচ্ছিক)', 'Preferred time (optional)'), val: '' })}
    <div class="fld"><small class="hint">${T('এটি একজন টিচারের সঙ্গে আলাদা ১-টু-১ P2P সমস্যা সমাধান। পোস্টটি ওই বিষয় বা কোর্সের টিচারদের কাছে যাবে, তারা আবেদন করবেন, আপনি একজনকে বেছে পেমেন্ট করবেন।', 'This is a separate 1-to-1 P2P problem-solving session. Your post goes to teachers of that subject/course; they apply, you pick one and pay.')}</small><small class="err" id="pp-err" role="alert"></small><button class="btn btn-p">${T('পোস্ট করুন', 'Post request')}</button></div></form>`;
  const postCard = p => {
    const tc = p.tid ? TEACH(p.tid) : null;
    const bids = p.bids.map(b => { const t = TEACH(b.tid), acc = b.st === 'accepted';
      return `<div class="bid ${acc ? 'on' : ''}"><div class="bid-h">${CH.avatar(t, 34)}<span><b><a href="#teacher-${t.id}">${esc(L(t.n))}</a></b><small>${esc(L(t.feat || t.inst))} · ★ ${t.rating}</small></span><em>${mny(b.price)}</em></div><p>${esc(b.msg || '')}</p>${p.status === 'open' ? `<button class="btn btn-p btn-sm" data-pa="p2pacc" data-id="${p.id}" data-tid="${b.tid}">${T('এঁকে বেছে নিন', 'Choose this teacher')}</button>` : acc ? UI.chip(T('বাছাই করা', 'Chosen'), 'ok') : UI.chip(T('বাদ', 'Not chosen'))}</div>`; }).join('');
    return `<div class="p2pc"><header><b>#P${p.no} · ${esc(subjName(p.subject))}${p.program ? ' · ' + esc(progName(p.program)) : ''}</b>${stChip(p.status)}<small>${fd(p.date)}</small></header>
      <p class="tpc">${p.topics.map(x => `<span class="tag">${esc(x)}</span>`).join(' ')}</p><p>${esc(p.problem)}</p>
      <p class="soft">${T('ক্লাস', 'Classes')}: ${n(p.classes)} · ${T('বাজেট', 'Budget')}: ${mny(p.budget)}${p.pref ? ' · ' + esc(p.pref) : ''}${p.cid ? ' · ' + esc(L(COURSE(p.cid).title)) : ''}</p>
      ${p.status === 'open' ? `<h4 class="sub">${T('টিচারদের আবেদন', 'Teacher applications')} (${n(p.bids.length)})</h4>${bids || `<p class="soft">${T('এখনো কেউ আবেদন করেননি।', 'No applications yet.')}</p>`}<button class="btn btn-o btn-sm" data-pa="p2pclose" data-id="${p.id}">${T('রিকোয়েস্ট প্রত্যাহার', 'Withdraw request')}</button>` : ''}
      ${p.status === 'accepted' ? `<div class="alert warn">${ic('clock')}<div><b>${T('টিচার: ', 'Teacher: ')}${esc(L(tc.n))} · ${mny(p.price)}</b><p>${T('পেমেন্ট করলেই আপনার ও টিচারের ব্যক্তিগত P2P ক্লাস শুরু হবে।', 'Once you pay, your private P2P classes with this teacher begin.')}</p></div></div><button class="btn btn-p" data-pa="p2ppay" data-id="${p.id}">${T('পেমেন্ট করুন', 'Pay now')} ${mny(p.price)}</button>` : ''}
      ${p.status === 'paid' || p.status === 'done' ? `<div class="alert ok">${ic('check')}<div><b>${T('টিচার: ', 'Teacher: ')}<a href="#teacher-${tc.id}">${esc(L(tc.n))}</a> · ${mny(p.price)} ${T('পরিশোধিত', 'paid')} (${fd(p.paidAt)})</b><p>${T('টিচার আপনার সঙ্গে যোগাযোগ করে ক্লাসের সময় ঠিক করবেন। ফোন: ', 'The teacher will contact you to fix class times. Phone: ')}${esc(tc.phone || '')}</p></div></div>${p.status === 'paid' ? `<button class="btn btn-o btn-sm" data-pa="p2pdone" data-id="${p.id}">${T('সমাধান সম্পন্ন', 'Mark as solved')}</button>` : ''}` : ''}
    </div>`;
  };
  PX.sec.s.p2p = () => {
    const l = mine(), bids = l.filter(p => p.status === 'open').reduce((a, p) => a + p.bids.length, 0), tch = new Set(l.filter(p => p.tid).map(p => p.tid)).size;
    return `<div class="kpis">${UI.kpi(T('আমার পোস্ট', 'My posts'), n(l.length))}${UI.kpi(T('খোলা পোস্টে আবেদন', 'Applications on open posts'), n(bids), '', bids ? 'warn' : '')}${UI.kpi(T('যে টিচারদের কাছ থেকে নিচ্ছি', 'Teachers I learn from'), n(tch), '', 'ok')}</div>` +
      UI.card(T('নতুন P2P সমস্যা পোস্ট', 'Post a new P2P problem'), postForm()) +
      UI.card(T('আমার P2P পোস্ট', 'My P2P posts'), l.length ? l.map(postCard).join('') : UI.empty(T('এখনো কোনো পোস্ট নেই।', 'No posts yet.')));
  };
  PX.CHG.p2psub = el => { document.getElementById('p2p-topics').innerHTML = topicBox(el.value); };
  A.p2pbud = a => { const i = a.closest('form').elements.budget; i.value = a.dataset.v; };
  F.p2ppost = (f, d) => {
    const er = f.querySelector('#pp-err'), bad = m => { er.textContent = m; }, cl = Math.round(+d.classes), bg = Math.round(+d.budget);
    if (!(d.problem || '').trim()) return bad(T('সমস্যাটি লিখুন', 'Describe the problem'));
    if (!(d.topics || []).length) return bad(T('অন্তত একটি টপিক বেছে নিন', 'Pick at least one topic'));
    if (!(cl >= 1 && cl <= 30)) return bad(T('ক্লাস ১–৩০ এর মধ্যে হতে হবে', 'Classes must be 1–30'));
    if (!(bg >= 100)) return bad(T('বাজেট কমপক্ষে ১০০ ৳', 'Budget must be at least ৳100'));
    DB.p2p.unshift({ id: 'pp' + (DB.p2p.length + 1), no: 8000 + DB.p2p.length + 1, sid: 'u1', subject: d.subject, program: d.program || '', cid: d.cid || '', topics: d.topics.slice(), problem: d.problem.trim(), classes: cl, budget: bg, pref: (d.pref || '').trim(), date: TODAY, status: 'open', tid: '', price: 0, bids: [] });
    PX.toast(T('পোস্ট হয়েছে — সংশ্লিষ্ট টিচাররা দেখতে পাবেন', 'Posted — matching teachers can now see it')); PX.refresh();
  };
  A.p2pclose = a => { const p = DB.p2p.find(x => x.id === a.dataset.id); if (p) { p.status = 'withdrawn'; PX.toast(T('রিকোয়েস্ট প্রত্যাহার হয়েছে', 'Request withdrawn')); } PX.refresh(); };
  A.p2pacc = a => { const p = DB.p2p.find(x => x.id === a.dataset.id), b = p && p.bids.find(x => x.tid === a.dataset.tid); if (!b) return; p.bids.forEach(x => { x.st = x === b ? 'accepted' : 'declined'; }); p.tid = b.tid; p.price = b.price; p.status = 'accepted'; PX.toast(T('টিচার বাছাই হয়েছে। এখন পেমেন্ট করুন', 'Teacher chosen. Now pay')); PX.refresh(); };
  const epsOn = () => !!(window.PGW && PGW.epsOn());
  A.p2ppay = a => {
    const p = DB.p2p.find(x => x.id === a.dataset.id), t = TEACH(p.tid), on = epsOn(), ge = (window.PGW && PGW.get().eps) || {};
    const sum = `<dl class="sum"><div><dt>${T('টিচার', 'Teacher')}</dt><dd>${esc(L(t.n))}</dd></div><div><dt>${T('ক্লাস', 'Classes')}</dt><dd>${n(p.classes)}</dd></div><div class="tot"><dt>${T('মোট', 'Total')}</dt><dd>${mny(p.price)}</dd></div></dl>`;
    if (on) { PX.modal(T('P2P পেমেন্ট', 'P2P payment'), sum + `<form data-pf="p2peps" data-id="${p.id}" class="fgrid"><div class="fld"><div class="paybox"><label class="po"><input type="radio" checked disabled><span>${esc(T(ge.bn || 'অনলাইন পেমেন্ট (EPS)', ge.en || 'Online payment (EPS)'))} <em>${T('বিকাশ, নগদ, কার্ড ও ব্যাংকিং', 'bKash, Nagad, cards & banking')}</em></span></label></div><small class="hint">${T('পেমেন্ট সম্পন্ন হলেই টিচারের সঙ্গে P2P ক্লাসে যুক্ত হবেন।', 'You join the P2P class as soon as payment is complete.')}</small><p class="err" id="eps-p2p-err" style="color:#c0392b"></p><button class="btn btn-p">${T('পেমেন্ট করুন', 'Pay now')} ${mny(p.price)}</button></div></form>`); return; }
    PX.modal(T('P2P পেমেন্ট', 'P2P payment'), sum + `
      <form data-pf="p2ppaid" data-id="${p.id}" class="fgrid">${UI.fi({ name: 'ch', label: T('পেমেন্ট চ্যানেল', 'Payment channel'), opts: [['bkash', 'bKash'], ['nagad', 'Nagad'], ['cash', T('ক্যাশ (অফিসে)', 'Cash (office)')]] })}<div class="fld"><small class="hint">${T('ডেমোতে আসল পেমেন্ট হয় না।', 'No real payment in the demo.')}</small><button class="btn btn-p">${T('পেমেন্ট নিশ্চিত', 'Confirm payment')} ${mny(p.price)}</button></div></form>`);
  };
  F.p2peps = async f => {
    const p = DB.p2p.find(x => x.id === f.dataset.id); if (!p || p.status !== 'accepted') return;
    const er = f.querySelector('#eps-p2p-err'), btn = f.querySelector('button'), me = ME(), lbl = btn.innerHTML, oid = 'P2P-' + p.no;
    er.textContent = ''; btn.disabled = true; btn.textContent = T('EPS-এ নেওয়া হচ্ছে…', 'Redirecting to EPS…');
    try {
      const r = await fetch('/api/eps/init', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: p.price, orderId: oid, name: me.name, phone: me.phone, email: me.email || '', product: 'P2P #' + p.no }) });
      const j = await r.json().catch(() => ({}));
      if (!j.ok) throw new Error(j.code === 'NOT_CONFIGURED' ? T('অনলাইন পেমেন্ট এখনও চালু হয়নি। অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন।', 'Online payment is not set up yet. Please contact support.') : (j.error || 'Payment could not start'));
      try { localStorage.setItem('chaatro_eps_pending', JSON.stringify({ kind: 'p2p', txn: j.txn, pid: p.id, amount: p.price, oid, snap: JSON.parse(JSON.stringify(p)), name: me.name, phone: me.phone, at: Date.now() })); } catch (x) {}
      location.href = j.redirectUrl;
    } catch (x) { er.textContent = x.message; btn.disabled = false; btn.innerHTML = lbl; }
  };
  F.p2ppaid = (f, d) => { const p = DB.p2p.find(x => x.id === f.dataset.id); p.status = 'paid'; p.paidAt = TODAY; p.ch = d.ch; PX.closeModal(); PX.toast(T('পেমেন্ট সম্পন্ন — P2P ক্লাস শুরু', 'Payment done — P2P classes begin')); PX.refresh(); };
  A.p2pdone = a => { const p = DB.p2p.find(x => x.id === a.dataset.id); if (p) p.status = 'done'; PX.toast(T('সমাধান সম্পন্ন', 'Marked as solved')); PX.refresh(); };

  /* ===== টিচার ===== */
  const tOpen = () => DB.p2p.filter(p => p.status === 'open' && matches(p, TID) && !myBid(p, TID));
  const tBids = () => DB.p2p.filter(p => myBid(p, TID) && (p.status === 'open' || myBid(p, TID).st === 'declined' || (p.tid !== TID && p.status !== 'open')));
  const tActive = () => DB.p2p.filter(p => p.tid === TID && p.status !== 'open');
  const reqCard = (p, mode) => { const s = stuOf(p.sid), b = myBid(p, TID);
    return `<div class="p2pc"><header><b>#P${p.no} · ${esc(subjName(p.subject))}${p.program ? ' · ' + esc(progName(p.program)) : ''}</b>${mode === 'open' ? UI.chip(T('নতুন', 'New'), 'info') : b ? UI.chip(b.st === 'accepted' ? T('বাছাই হয়েছে', 'Chosen') : b.st === 'declined' ? T('বাদ', 'Not chosen') : T('আবেদন করা হয়েছে', 'Applied'), b.st === 'accepted' ? 'ok' : b.st === 'declined' ? '' : 'warn') : ''}<small>${fd(p.date)}</small></header>
      <p class="tpc">${p.topics.map(x => `<span class="tag">${esc(x)}</span>`).join(' ')}</p><p>${esc(p.problem)}</p>
      <p class="soft">${esc((s.name || '').split(' ')[0])} · ${T('ক্লাস', 'Classes')}: ${n(p.classes)} · ${T('বাজেট', 'Budget')}: <b>${mny(p.budget)}</b>${p.pref ? ' · ' + esc(p.pref) : ''} · ${n(p.bids.length)} ${T('আবেদন', 'applications')}</p>
      ${mode === 'open' ? `<button class="btn btn-p btn-sm" data-pa="p2pbid" data-id="${p.id}">${T('আবেদন / বিড করুন', 'Apply / bid')}</button>` : ''}
      ${mode === 'bids' && p.status === 'open' && b && b.st === 'pending' ? `<p>${T('আপনার অফার', 'Your offer')}: <b>${mny(b.price)}</b> — ${esc(b.msg || '')}</p><button class="btn btn-o btn-sm" data-pa="p2pbid" data-id="${p.id}">${T('অফার বদলান', 'Edit offer')}</button> <button class="btn btn-o btn-sm" data-pa="p2pwd" data-id="${p.id}">${T('প্রত্যাহার', 'Withdraw')}</button>` : ''}
      ${mode === 'bids' && b && b.st === 'declined' ? `<p class="soft">${T('আপনার অফার: ', 'Your offer: ')}${mny(b.price)}</p>` : ''}
      ${mode === 'active' ? `<p>${p.status === 'accepted' ? UI.chip(T('স্টুডেন্টের পেমেন্টের অপেক্ষায়', 'Waiting for student payment'), 'warn') : p.status === 'paid' ? UI.chip(T('পেমেন্ট হয়েছে — ক্লাস নিন', 'Paid — start classes'), 'ok') : UI.chip(T('সম্পন্ন', 'Completed'), 'ok')} ${T('মূল্য', 'Price')}: <b>${mny(p.price)}</b>${p.status !== 'accepted' ? ` · ${T('স্টুডেন্টের ফোন', 'Student phone')}: ${esc(s.phone || '')}` : ''}</p>` : ''}
    </div>`; };
  PX.sec.t.p2p = () => {
    const k = PX.S.tab.p2pt || 'open', op = tOpen(), bd = tBids(), ac = tActive(), served = new Set(DB.p2p.filter(p => p.tid === TID && (p.status === 'paid' || p.status === 'done')).map(p => p.sid)).size;
    const list = k === 'open' ? op : k === 'bids' ? bd : ac;
    return `<div class="kpis">${UI.kpi(T('আমার জন্য খোলা পোস্ট', 'Open posts for me'), n(op.length), '', op.length ? 'warn' : '')}${UI.kpi(T('আমার আবেদন', 'My applications'), n(DB.p2p.filter(p => myBid(p, TID)).length))}${UI.kpi(T('সক্রিয়/বাছাই', 'Chosen / active'), n(ac.length), '', 'ok')}${UI.kpi(T('যত স্টুডেন্টকে সমাধান দিচ্ছি', 'Students I solve for'), n(served))}</div>` +
      UI.tabs('p2pt', [['open', T('নতুন পোস্ট', 'New posts') + ' (' + op.length + ')'], ['bids', T('আমার আবেদন', 'My applications') + ' (' + bd.length + ')'], ['active', T('বাছাই / সক্রিয়', 'Chosen / active') + ' (' + ac.length + ')']], k) +
      UI.card(k === 'open' ? T('স্টুডেন্টদের P2P সমস্যা (আপনার বিষয়ের)', 'Student P2P problems (your subjects)') : k === 'bids' ? T('আমার আবেদন', 'My applications') : T('বাছাই / সক্রিয়', 'Chosen / active'), list.length ? list.map(p => reqCard(p, k)).join('') : UI.empty(T('এখানে কিছু নেই।', 'Nothing here.'))) +
      `<p class="soft">${T('P2P পেমেন্টেও আপনার গ্রুপের প্ল্যাটফর্ম ফি প্রযোজ্য। স্টুডেন্ট আপনাকে বাছাই ও পেমেন্ট করলে এটি আপনার আয়ে যুক্ত হয়।', 'Your group platform-fee terms also apply to P2P. When a student picks you and pays, it is added to your earnings.')}</p>`;
  };
  A.p2pbid = a => {
    const p = DB.p2p.find(x => x.id === a.dataset.id), b = myBid(p, TID);
    PX.modal(`${T('আবেদন', 'Apply')} — #P${p.no}`, `<p class="soft">${esc(p.problem)}</p><p>${T('স্টুডেন্টের বাজেট', 'Student budget')}: <b>${mny(p.budget)}</b> · ${n(p.classes)} ${T('ক্লাস', 'classes')}</p>
      <form data-pf="p2pbid" data-id="${p.id}" class="fgrid">${UI.fi({ name: 'price', label: T('আপনার মোট অফার (৳)', 'Your total offer (৳)'), type: 'number', min: 100, val: b ? b.price : p.budget, req: 1 })}${UI.fi({ name: 'msg', label: T('স্টুডেন্টকে বার্তা', 'Message to the student'), rows: 3, val: b ? b.msg : '', req: 1, ph: T('কীভাবে সাহায্য করবেন, অভিজ্ঞতা…', 'How you will help, your experience…') })}<div class="fld"><small class="err" id="pb2-err" role="alert"></small><button class="btn btn-p">${T('সাবমিট', 'Submit')}</button></div></form>`);
  };
  F.p2pbid = (f, d) => {
    const p = DB.p2p.find(x => x.id === f.dataset.id), er = f.querySelector('#pb2-err'), pr = Math.round(+d.price);
    if (p.status !== 'open') { er.textContent = T('পোস্টটি আর খোলা নেই', 'This post is no longer open'); return; }
    if (!(pr >= 100)) { er.textContent = T('অফার কমপক্ষে ১০০ ৳', 'Offer must be at least ৳100'); return; }
    if (!(d.msg || '').trim()) { er.textContent = T('বার্তা লিখুন', 'Write a message'); return; }
    const b = myBid(p, TID); if (b) { b.price = pr; b.msg = d.msg.trim(); b.at = TODAY; } else p.bids.push({ tid: TID, price: pr, msg: d.msg.trim(), at: TODAY, st: 'pending' });
    PX.closeModal(); PX.toast(T('আবেদন জমা হয়েছে — স্টুডেন্ট দেখতে পাবেন', 'Application sent — the student can see it')); PX.refresh();
  };
  A.p2pwd = a => { const p = DB.p2p.find(x => x.id === a.dataset.id); p.bids = p.bids.filter(b => b.tid !== TID); PX.toast(T('আবেদন প্রত্যাহার করা হয়েছে', 'Application withdrawn')); PX.refresh(); };

  /* ===== অ্যাডমিন (দেখার জন্য) ===== */
  PX.sec.a.p2p = () => UI.card(T('P2P সমস্যা সমাধান', 'P2P problem solving'), UI.tbl([T('আইডি', 'ID'), T('স্টুডেন্ট', 'Student'), T('বিষয় / টপিক', 'Subject / topics'), T('বাজেট', 'Budget'), T('আবেদন', 'Bids'), T('অবস্থা', 'Status'), T('টিচার', 'Teacher'), T('মূল্য', 'Price'), T('প্ল্যাটফর্ম ফি', 'Platform fee')], DB.p2p.map(p => { const s = stuOf(p.sid); return [`#P${p.no}`, `${esc(s.name)}`, `${esc(subjName(p.subject))}<small>${esc(p.topics.join(', '))}</small>`, mny(p.budget), n(p.bids.length), stChip(p.status), p.tid ? esc(L(TEACH(p.tid).n)) : '—', p.tid ? mny(p.price) : '—', p.tid && (p.status === 'paid' || p.status === 'done') ? mny(PX.feeFor(p.tid, null, p.price)) : '—']; })));

  /* নেভ + হোম */
  const navS = PX.nav.s; PX.nav.s = () => { const l = navS(), i = l.findIndex(x => x.k === 'explore'), op = mine().filter(p => p.status === 'open').reduce((a, p) => a + p.bids.length, 0); l.splice(i + 1, 0, { k: 'p2p', l: T('P2P সমস্যা সমাধান', 'P2P problem solving'), i: 'chat', badge: op ? n(op) : '' }); return l; };
  const navT = PX.nav.t; PX.nav.t = () => { const l = navT(), i = l.findIndex(x => x.k === 'students'), c = tOpen().length; l.splice(i + 1, 0, { k: 'p2p', l: T('P2P সমস্যা সমাধান', 'P2P problem solving'), i: 'chat', badge: c ? n(c) : '' }); return l; };
  const navA = PX.nav.a; PX.nav.a = () => { const l = navA(); if (!DB.levels[PX.S.level].perms.students) return l; const i = l.findIndex(x => x.k === 'students'); l.splice(i + 1, 0, { k: 'p2p', l: T('P2P সমস্যা সমাধান', 'P2P problem solving'), i: 'chat', also: [], badge: '' }); return l; };
  const homeT = PX.sec.t.home; PX.sec.t.home = (...a) => { const c = tOpen().length, h = homeT(...a); return c ? `<div class="alert info">${ic('chat')}<div><b>${T(`${n(c)}টি নতুন P2P সমস্যা আপনার বিষয়ে পোস্ট হয়েছে`, `${c} new P2P problem(s) posted in your subjects`)}</b><p><a href="#t-p2p">${T('দেখুন ও আবেদন করুন', 'View and apply')}</a></p></div></div>` + h : h; };
  /* সফল EPS P2P পেমেন্ট (লোকাল রেকর্ড) ডেমো ডেটায় প্রয়োগ */
  try {
    (JSON.parse(localStorage.getItem('chaatro_eps_paid_p2p') || '[]') || []).forEach(r => {
      if (!r.snap || !r.snap.tid) return;
      let p = DB.p2p.find(x => x.id === r.pid);
      if (!p) { p = {}; DB.p2p.unshift(p); }
      Object.assign(p, r.snap, { status: 'paid', paidAt: r.date, ch: 'EPS', txn: r.txn });
    });
  } catch (e) {}
})();
