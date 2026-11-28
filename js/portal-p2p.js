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
  const stChip = s => ({ open: UI.chip(T('খোলা — টিচারদের আবেদন চলছে', 'Open — teachers applying'), 'info'), accepted: UI.chip(T('টিচার বাছাই হয়েছে — পেমেন্ট বাকি', 'Teacher chosen — payment due'), 'warn'), paid: UI.chip(T('পেমেন্ট হয়েছে — ক্লাস চলছে', 'Paid — in progress'), 'ok'), done: UI.chip(T('সম্পন্ন', 'Completed'), 'ok'), closed: UI.chip(T('বন্ধ', 'Closed')), withdrawn: UI.chip(T('প্রত্যাহার করা', 'Withdrawn')) })[s] || '';
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
      ${p.status === 'accepted' ? `<div class="alert warn">${ic('clock')}<div><b>${CH.avatar(tc, 28)} ${T('টিচার: ', 'Teacher: ')}${esc(L(tc.n))} · ${mny(p.price)}</b><p>${T('পেমেন্ট করলেই আপনার ও টিচারের ব্যক্তিগত P2P ক্লাস শুরু হবে।', 'Once you pay, your private P2P classes with this teacher begin.')}</p></div></div><button class="btn btn-p" data-pa="p2ppay" data-id="${p.id}">${T('পেমেন্ট করুন', 'Pay now')} ${mny(p.price)}</button>` : ''}
      ${p.status === 'paid' || p.status === 'done' ? `<div class="alert ok">${ic('check')}<div><b>${CH.avatar(tc, 28)} ${T('টিচার: ', 'Teacher: ')}<a href="#teacher-${tc.id}">${esc(L(tc.n))}</a> · ${mny(p.price)} ${T('পরিশোধিত', 'paid')} (${fd(p.paidAt)})</b><p>${T('টিচার আপনার সঙ্গে যোগাযোগ করে ক্লাসের সময় ঠিক করবেন। ফোন: ', 'The teacher will contact you to fix class times. Phone: ')}${esc(tc.phone || '')}</p></div></div>${p.status === 'paid' ? `<button class="btn btn-o btn-sm" data-pa="p2pdone" data-id="${p.id}">${T('সমাধান সম্পন্ন', 'Mark as solved')}</button>` : ''}` : ''}
      ${p.tid && ['accepted', 'paid', 'done'].includes(p.status) && (p.status !== 'accepted' || schedOf(p).length) ? schedBlock(p, 's') : ''}
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


  /* ===== ক্লাস শিডিউল: টিচার/অ্যাডমিন প্রস্তাব করেন → স্টুডেন্ট গ্রহণ করেন ===== */
  function canEdit() { return ['super', 'academic'].includes(PX.S.level); }
  function schedOf(p) { return (p.sched = p.sched || []); }
  const tm12 = t => { const [h, m] = (t || '00:00').split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
  const sChip = s => ({ proposed: UI.chip(T('স্টুডেন্টের গ্রহণের অপেক্ষায়', 'Awaiting student'), 'warn'), accepted: UI.chip(T('নিশ্চিত', 'Confirmed'), 'ok'), declined: UI.chip(T('সময় বদলের অনুরোধ', 'Change requested'), 'bad'), done: UI.chip(T('সম্পন্ন', 'Done'), 'ok'), cancelled: UI.chip(T('বাতিল', 'Cancelled')) })[s.st] || '';
  function schedBlock(p, who) {
    const l = schedOf(p).slice().sort((a, b) => (a.at + a.time).localeCompare(b.at + b.time)), used = l.filter(x => x.st !== 'cancelled').length, ed = who === 'a' ? canEdit() : who === 't';
    const canAdd = ed && used < p.classes && (who === 't' ? p.status === 'paid' : ['accepted', 'paid'].includes(p.status));
    const d = (a, id, cls, txt, sid, extra = '') => `<button class="btn ${cls} btn-sm" data-pa="${a}" data-id="${id}" data-sid="${sid}" data-who="${who}" ${extra}>${txt}</button>`;
    const rsBtns = s => {
      if (who === 'a' || s.st !== 'accepted' || p.status === 'done') return '';
      const r = s.rs;
      if (r && r.st !== 'declined') return r.by !== who ? d('p2prsok', p.id, 'btn-p', T('অনুমোদন', 'Approve'), s.id) + d('p2prsno', p.id, 'btn-o', T('প্রত্যাখ্যান', 'Decline'), s.id) : d('p2prsdel', p.id, 'btn-o', T('অনুরোধ প্রত্যাহার', 'Withdraw request'), s.id);
      return d('p2prs', p.id, 'btn-o', T('রিশিডিউলের অনুরোধ', 'Request reschedule'), s.id);
    };
    const btns = s => {
      if (who === 's') return s.st === 'proposed' ? d('p2pschacc', p.id, 'btn-p', T('গ্রহণ করুন', 'Accept'), s.id) + d('p2pschno', p.id, 'btn-o', T('সময় বদলান', 'Ask to change'), s.id) : rsBtns(s);
      if (!ed || s.st === 'cancelled' || s.st === 'done') return '';
      return (s.st === 'accepted' && p.status === 'paid' ? d('p2pschdone', p.id, 'btn-p', T('সম্পন্ন', 'Mark done'), s.id) : '') + (who === 'a' && s.st !== 'accepted' ? d('p2pschacc', p.id, 'btn-o', T('স্টুডেন্টের পক্ষে গ্রহণ', 'Accept for student'), s.id) : '') + (who === 'a' || s.st !== 'accepted' ? d('p2psch', p.id, 'btn-o', who === 'a' && s.st === 'accepted' ? T('রিশিডিউল (অ্যাডমিন)', 'Reschedule (admin)') : T('বদলান', 'Edit'), s.id) : '') + rsBtns(s) + d('p2pschdel', p.id, 'btn-o', T('বাতিল', 'Cancel'), s.id);
    };
    const rsInfo = s => s.rs ? `<p class="soft rsn">${s.rs.st === 'declined' ? T('রিশিডিউল প্রত্যাখ্যাত — ক্লাস আগের সময়েই থাকছে', 'Reschedule declined — class stays as is') : `${T('রিশিডিউলের অনুরোধ', 'Reschedule requested')} (${s.rs.by === 't' ? T('টিচার', 'teacher') : T('স্টুডেন্ট', 'student')}) · ${T('অন্য পক্ষ অনুমোদন না করলে সময় বদলাবে না', 'the time does not change until the other side approves')}`}: <b>${fd(s.rs.at)} · ${tm12(s.rs.time)}</b>${s.rs.reason ? ' — ' + esc(s.rs.reason) : ''}</p>` : '';
    const rows = l.map(s => `<div class="sch ${s.st}"><div><b>${fd(s.at)} · ${tm12(s.time)}</b> <small>${n(s.dur)} ${T('মিনিট', 'min')}</small> ${sChip(s)}${s.note ? `<p class="soft">${esc(s.note)}</p>` : ''}${s.st === 'declined' && s.reason ? `<p class="soft">${T('স্টুডেন্টের কারণ', 'Student reason')}: ${esc(s.reason)}</p>` : ''}${rsInfo(s)}</div><div class="sch-a">${btns(s)}</div></div>`).join('');
    return `<h4 class="sub">${T('ক্লাসের সময়সূচি', 'Class schedule')} · ${n(used)}/${n(p.classes)}</h4>${rows || `<p class="soft">${who === 's' ? T('টিচার সময় প্রস্তাব করলে এখানে দেখাবে, আপনি গ্রহণ করবেন।', 'Times proposed by your teacher will appear here for you to accept.') : T('এখনো কোনো ক্লাসের সময় দেওয়া হয়নি।', 'No class time set yet.')}</p>`}${canAdd ? `<button class="btn btn-o btn-sm" data-pa="p2psch" data-id="${p.id}" data-who="${who}">+ ${T('ক্লাসের সময় যোগ করুন', 'Add class time')}</button>` : ''}`;
  }
  const findS = a => { const p = DB.p2p.find(x => x.id === a.dataset.id); return [p, p && schedOf(p).find(x => x.id === a.dataset.sid)]; };
  const denied = who => who === 'a' && !canEdit() ? (PX.toast(T('এই লেভেলে অনুমতি নেই', 'Not allowed at this level')), true) : false;
  A.p2psch = a => {
    const p = DB.p2p.find(x => x.id === a.dataset.id), s = a.dataset.sid ? schedOf(p).find(x => x.id === a.dataset.sid) : null, who = a.dataset.who; if (!p || denied(who)) return;
    PX.modal(`${s ? T('সময় বদলান', 'Edit class time') : T('ক্লাসের সময় যোগ', 'Add class time')} — #P${p.no}`, `<form data-pf="p2psch" data-id="${p.id}" data-sid="${s ? s.id : ''}" data-who="${who}" class="fgrid">
      ${UI.fi({ name: 'at', label: T('তারিখ', 'Date'), type: 'date', min: TODAY, val: s ? s.at : '', req: 1, half: 1 })}${UI.fi({ name: 'time', label: T('সময়', 'Time'), type: 'time', val: s ? s.time : '', req: 1, half: 1 })}
      ${UI.fi({ name: 'dur', label: T('সময়কাল', 'Duration'), opts: [30, 45, 60, 90, 120].map(m => [m, m + ' ' + T('মিনিট', 'min')]), val: s ? s.dur : 60, half: 1 })}${UI.fi({ name: 'note', label: T('নোট / টপিক (ঐচ্ছিক)', 'Note / topic (optional)'), val: s ? s.note : '', half: 1 })}
      <div class="fld"><small class="hint">${who === 's' ? '' : T('স্টুডেন্ট গ্রহণ করলে ক্লাসটি নিশ্চিত হবে।', 'The class is confirmed once the student accepts.')}</small><small class="err" id="sch-err" role="alert"></small><button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></div></form>`);
  };
  F.p2psch = (f, d) => {
    const p = DB.p2p.find(x => x.id === f.dataset.id), who = f.dataset.who, er = f.querySelector('#sch-err'); if (!p || denied(who)) return;
    const l = schedOf(p), cur = f.dataset.sid ? l.find(x => x.id === f.dataset.sid) : null, bad = m => { er.textContent = m; };
    if (!d.at || d.at < TODAY) return bad(T('আজ বা পরের তারিখ দিন', 'Pick today or a later date'));
    if (!d.time) return bad(T('সময় দিন', 'Pick a time'));
    if (l.some(x => x !== cur && x.st !== 'cancelled' && x.at === d.at && x.time === d.time)) return bad(T('এই সময়ে আগেই একটি ক্লাস আছে', 'A class already exists at this time'));
    if (!cur && l.filter(x => x.st !== 'cancelled').length >= p.classes) return bad(T('সব ক্লাসের সময় ইতোমধ্যে দেওয়া হয়েছে', 'All classes are already scheduled'));
    if (cur && cur.st === 'accepted' && who !== 'a') return bad(T('নিশ্চিত ক্লাস বদলাতে রিশিডিউলের অনুরোধ দিন', 'To move a confirmed class, send a reschedule request'));
    const o = { at: d.at, time: d.time, dur: +d.dur || 60, note: (d.note || '').trim(), st: cur && cur.st === 'accepted' ? 'accepted' : 'proposed', reason: '', by: who };
    if (cur) delete cur.rs;
    if (cur) Object.assign(cur, o); else l.push(Object.assign({ id: 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5) }, o));
    PX.closeModal(); PX.toast(o.st === 'accepted' ? T('অ্যাডমিন রিশিডিউল সম্পন্ন', 'Rescheduled by admin') : T('সময় প্রস্তাব করা হয়েছে — স্টুডেন্ট গ্রহণ করবেন', 'Time proposed — the student will accept')); PX.refresh();
  };
  A.p2pschacc = a => { const [p, s] = findS(a); if (!s || denied(a.dataset.who)) return; s.st = 'accepted'; s.reason = ''; PX.toast(T('ক্লাস নিশ্চিত হয়েছে', 'Class confirmed')); PX.refresh(); };
  A.p2pschno = a => { const [p, s] = findS(a); if (!s) return; PX.modal(T('অন্য সময় চান', 'Ask for another time'), `<p class="soft">${fd(s.at)} · ${tm12(s.time)}</p><form data-pf="p2pschno" data-id="${p.id}" data-sid="${s.id}" class="fgrid">${UI.fi({ name: 'reason', label: T('কেন বদলাতে চান / কোন সময় সুবিধা', 'Why / which time suits you'), rows: 3, req: 1 })}<div class="fld"><button class="btn btn-p">${T('অনুরোধ পাঠান', 'Send request')}</button></div></form>`); };
  F.p2pschno = (f, d) => { const p = DB.p2p.find(x => x.id === f.dataset.id), s = p && schedOf(p).find(x => x.id === f.dataset.sid); if (!s) return; s.st = 'declined'; s.reason = (d.reason || '').trim(); PX.closeModal(); PX.toast(T('টিচারকে জানানো হয়েছে', 'The teacher has been told')); PX.refresh(); };
  A.p2pschdone = a => { const [p, s] = findS(a); if (!s || denied(a.dataset.who)) return; s.st = 'done'; PX.toast(T('ক্লাস সম্পন্ন', 'Class marked done')); PX.refresh(); };
  A.p2pschdel = a => { const [p, s] = findS(a); if (!s || denied(a.dataset.who)) return; if (s.st === 'accepted') s.st = 'cancelled'; else p.sched = p.sched.filter(x => x !== s); PX.toast(T('ক্লাস বাতিল', 'Class cancelled')); PX.refresh(); };

  A.p2prs = a => {
    const [p, s] = findS(a), who = a.dataset.who; if (!s) return;
    PX.modal(`${T('রিশিডিউলের অনুরোধ', 'Request reschedule')} — #P${p.no}`, `<p class="soft">${T('বর্তমান', 'Current')}: <b>${fd(s.at)} · ${tm12(s.time)}</b>. ${who === 't' ? T('স্টুডেন্ট অনুমোদন দিলে তবেই সময় বদলাবে।', 'The time changes only after the student approves.') : T('টিচার অনুমোদন দিলে তবেই সময় বদলাবে।', 'The time changes only after the teacher approves.')}</p>
      <form data-pf="p2prs" data-id="${p.id}" data-sid="${s.id}" data-who="${who}" class="fgrid">${UI.fi({ name: 'at', label: T('নতুন তারিখ', 'New date'), type: 'date', min: TODAY, req: 1, half: 1 })}${UI.fi({ name: 'time', label: T('নতুন সময়', 'New time'), type: 'time', req: 1, half: 1 })}${UI.fi({ name: 'reason', label: T('কারণ', 'Reason'), rows: 2, req: 1 })}<div class="fld"><small class="err" id="rs-err" role="alert"></small><button class="btn btn-p">${T('অনুরোধ পাঠান', 'Send request')}</button></div></form>`);
  };
  F.p2prs = (f, d) => {
    const p = DB.p2p.find(x => x.id === f.dataset.id), s = p && schedOf(p).find(x => x.id === f.dataset.sid), er = f.querySelector('#rs-err'), bad = m => { er.textContent = m; }; if (!s || s.st !== 'accepted') return;
    if (!d.at || d.at < TODAY) return bad(T('আজ বা পরের তারিখ দিন', 'Pick today or a later date'));
    if (!d.time) return bad(T('সময় দিন', 'Pick a time'));
    if (d.at === s.at && d.time === s.time) return bad(T('বর্তমান সময়ের মতোই', 'Same as the current time'));
    if (schedOf(p).some(x => x !== s && x.st !== 'cancelled' && x.at === d.at && x.time === d.time)) return bad(T('এই সময়ে আগেই একটি ক্লাস আছে', 'A class already exists at this time'));
    if (!(d.reason || '').trim()) return bad(T('কারণ লিখুন', 'Enter a reason'));
    s.rs = { by: f.dataset.who, at: d.at, time: d.time, dur: s.dur, reason: d.reason.trim(), st: 'pending', on: TODAY };
    PX.closeModal(); PX.toast(T('অনুরোধ পাঠানো হয়েছে — অন্য পক্ষ অনুমোদন দিলে সময় বদলাবে', 'Request sent — the time changes once the other side approves')); PX.refresh();
  };
  A.p2prsok = a => { const [p, s] = findS(a); if (!s || !s.rs || s.rs.by === a.dataset.who) return; s.at = s.rs.at; s.time = s.rs.time; delete s.rs; PX.toast(T('ক্লাস রিশিডিউল হয়েছে', 'Class rescheduled')); PX.refresh(); };
  A.p2prsno = a => { const [p, s] = findS(a); if (!s || !s.rs || s.rs.by === a.dataset.who) return; s.rs.st = 'declined'; PX.toast(T('অনুরোধ প্রত্যাখ্যাত — ক্লাস আগের সময়েই', 'Declined — the class stays')); PX.refresh(); };
  A.p2prsdel = a => { const [p, s] = findS(a); if (!s) return; delete s.rs; PX.toast(T('অনুরোধ প্রত্যাহার হয়েছে', 'Request withdrawn')); PX.refresh(); };

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
      ${mode === 'active' && ['paid', 'done'].includes(p.status) ? schedBlock(p, 't') : ''}
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

  /* ===== অ্যাডমিন: দেখা, এডিট, টিচার অ্যাসাইন, শিডিউল (সুপার ও একাডেমিক অ্যাডমিন) ===== */
  const ST = ['open', 'accepted', 'paid', 'done', 'withdrawn'];
  const stName = s => ({ open: T('খোলা', 'Open'), accepted: T('টিচার বাছাই — পেমেন্ট বাকি', 'Teacher chosen — payment due'), paid: T('পেমেন্ট হয়েছে', 'Paid'), done: T('সম্পন্ন', 'Completed'), withdrawn: T('প্রত্যাহার', 'Withdrawn') })[s];
  const schedCnt = p => { const l = schedOf(p).filter(x => x.st !== 'cancelled'); return `${l.filter(x => x.st === 'accepted' || x.st === 'done').length}/${l.length}/${p.classes}`; };
  const assign = (p, tid, price, msg) => {
    const b = p.bids.find(x => x.tid === tid);
    p.bids.forEach(x => { x.st = x.tid === tid ? 'accepted' : 'declined'; });
    if (b) { b.price = price; } else p.bids.push({ tid, price, msg: msg || 'Assigned by admin', at: TODAY, st: 'accepted', admin: 1 });
    p.tid = tid; p.price = price; if (p.status === 'open') p.status = 'accepted';
  };
  const adminList = () => {
    const k = PX.S.tab.p2pa || 'all', all = DB.p2p, l = k === 'all' ? all : all.filter(p => p.status === k), cnt = s => all.filter(p => p.status === s).length;
    const pendSch = all.reduce((a, p) => a + schedOf(p).filter(x => x.st === 'proposed' || x.st === 'declined').length, 0);
    return `<div class="kpis">${UI.kpi(T('মোট পোস্ট', 'Total posts'), n(all.length))}${UI.kpi(T('খোলা', 'Open'), n(cnt('open')), '', cnt('open') ? 'warn' : '')}${UI.kpi(T('পেমেন্ট বাকি', 'Payment due'), n(cnt('accepted')), '', cnt('accepted') ? 'warn' : '')}${UI.kpi(T('সক্রিয় (পেইড)', 'Active (paid)'), n(cnt('paid')), '', 'ok')}${UI.kpi(T('শিডিউল অপেক্ষায়/বদলের অনুরোধ', 'Schedules pending / change asked'), n(pendSch), '', pendSch ? 'warn' : '')}</div>` +
      UI.tabs('p2pa', [['all', T('সব', 'All') + ' (' + all.length + ')']].concat(ST.map(s => [s, stName(s).split(' —')[0] + ' (' + cnt(s) + ')'])), k) +
      UI.card(T('P2P সমস্যা সমাধান', 'P2P problem solving'), UI.tbl([T('আইডি', 'ID'), T('স্টুডেন্ট আইডি', 'Student ID'), T('স্টুডেন্ট', 'Student'), T('বিষয়', 'Subject'), T('টপিক', 'Topics'), T('বাজেট', 'Budget'), T('আবেদন', 'Bids'), T('অবস্থা', 'Status'), T('টিচার আইডি', 'Teacher ID'), T('টিচার', 'Teacher'), T('মূল্য', 'Price'), T('প্ল্যাটফর্ম ফি', 'Platform fee'), T('ক্লাস (নিশ্চিত/দেওয়া/মোট)', 'Classes (confirmed/set/total)'), ''],
        l.map(p => { const s = stuOf(p.sid), t = p.tid ? TEACH(p.tid) : null; return [PX.idc ? PX.idc('P' + p.no) : '#P' + p.no, PX.idc ? PX.idc(s.sid || '—') : esc(s.sid || ''), `<b class="nm">${esc(s.name)}</b>`, esc(subjName(p.subject)), esc(p.topics.join(', ')), mny(p.budget), n(p.bids.length), stChip(p.status), t && PX.idc ? PX.idc(t.pid) : '—', t ? `<b class="nm">${esc(L(t.n))}</b>` : '—', t ? mny(p.price) : '—', t && (p.status === 'paid' || p.status === 'done') ? mny(PX.feeFor(p.tid, null, p.price)) : '—', t ? schedCnt(p) : '—', `<a class="btn btn-p btn-sm" href="#a-p2p-${p.id}">${T('খুলুন', 'Open')}</a>`]; })));
  };
  const adminDetail = id => {
    const p = DB.p2p.find(x => x.id === id); if (!p) return UI.card('', UI.empty(T('পোস্ট পাওয়া যায়নি', 'Post not found')));
    const s = stuOf(p.sid), ed = canEdit(), tc = p.tid ? TEACH(p.tid) : null, back = `<a class="btn btn-o btn-sm" href="#a-p2p">← ${T('তালিকায় ফিরুন', 'Back to list')}</a>`;
    const kv = UI.tbl([T('বিষয়', 'Field'), T('তথ্য', 'Detail')], [[T('স্টুডেন্ট', 'Student'), `<b class="nm">${esc(s.name)}</b> ${PX.idc ? PX.idc(s.sid || '') : ''} · ${esc(s.phone || '')}`], [T('পোস্টের তারিখ', 'Posted'), fd(p.date)], [T('অবস্থা', 'Status'), stChip(p.status)], [T('টিচার', 'Teacher'), tc ? `<b class="nm">${esc(L(tc.n))}</b> ${PX.idc ? PX.idc(tc.pid) : ''} · ${esc(tc.phone || '')}` : '—'], [T('মূল্য', 'Price'), tc ? mny(p.price) : '—'], [T('পেমেন্ট', 'Payment'), p.paidAt ? `${fd(p.paidAt)} · ${esc(p.ch || '')}${p.txn ? ' · ' + esc(p.txn) : ''}` : '—']]);
    const tOpts = [['', T('— টিচার বেছে নিন —', '— choose teacher —')]].concat(TEACHERS.slice().sort((a, b) => (matches(p, b.id) ? 1 : 0) - (matches(p, a.id) ? 1 : 0)).map(t => [t.id, `${L(t.n)} · #${t.pid}${matches(p, t.id) ? ' ★' : ''}`]));
    const editF = `<form data-pf="p2padm" data-id="${p.id}" class="fgrid">
      ${UI.fi({ name: 'program', label: T('কোর্স টাইপ', 'Course type'), half: 1, opts: [['', T('যেকোনো', 'Any')]].concat(PROGRAMS.filter(x => !x.hidden).map(x => [x.id, L(x.s)])), val: p.program })}${UI.fi({ name: 'subject', label: T('বিষয়', 'Subject'), half: 1, req: 1, opts: SUBS(), val: p.subject }).replace('name="subject"', 'name="subject" data-pc="p2psub"')}
      <div id="p2p-topics" class="fld full">${UI.checks('topics', topicList(p.subject).concat(p.topics.filter(x => !topicList(p.subject).some(y => y[0] === x)).map(x => [x, x])), p.topics, T('টপিক', 'Topics'))}</div>
      ${UI.fi({ name: 'problem', label: T('সমস্যা', 'Problem'), rows: 4, req: 1, val: p.problem })}
      ${UI.fi({ name: 'classes', label: T('ক্লাস সংখ্যা', 'Classes'), type: 'number', min: 1, val: p.classes, half: 1, req: 1 })}${UI.fi({ name: 'budget', label: T('বাজেট (৳)', 'Budget (৳)'), type: 'number', min: 100, val: p.budget, half: 1, req: 1 })}
      ${UI.fi({ name: 'pref', label: T('পছন্দের সময়', 'Preferred time'), val: p.pref, half: 1 })}${UI.fi({ name: 'status', label: T('অবস্থা', 'Status'), half: 1, opts: ST.map(x => [x, stName(x)]), val: p.status })}
      <div class="fld"><small class="err" id="pa-err" role="alert"></small><button class="btn btn-p">${T('পরিবর্তন সংরক্ষণ', 'Save changes')}</button></div></form>`;
    const bids = p.bids.map(b => { const t = TEACH(b.tid); return `<div class="bid ${b.st === 'accepted' ? 'on' : ''}"><div class="bid-h"><span><b>${esc(L(t.n))}</b><small>#${t.pid} · ★ ${t.rating}${b.admin ? ' · ' + T('অ্যাডমিন অ্যাসাইন', 'admin assigned') : ''}</small></span><em>${mny(b.price)}</em></div><p>${esc(b.msg || '')}</p>${b.st === 'accepted' ? UI.chip(T('বাছাই করা', 'Chosen'), 'ok') : ed && ['open', 'accepted'].includes(p.status) ? `<button class="btn btn-p btn-sm" data-pa="p2padmpick" data-id="${p.id}" data-tid="${b.tid}">${T('এঁকে অ্যাসাইন করুন', 'Assign this teacher')}</button>` : UI.chip(b.st === 'declined' ? T('বাদ', 'Not chosen') : T('অপেক্ষমাণ', 'Pending'))}</div>`; }).join('');
    const asg = `<form data-pf="p2passign" data-id="${p.id}" class="fgrid">${UI.fi({ name: 'tid', label: T('টিচার', 'Teacher'), opts: tOpts, val: p.tid, req: 1, half: 1 })}${UI.fi({ name: 'price', label: T('মোট মূল্য (৳)', 'Total price (৳)'), type: 'number', min: 100, val: p.price || p.budget, req: 1, half: 1 })}
      <div class="fld"><small class="hint">${p.status === 'paid' || p.status === 'done' ? T('সতর্কতা: পেমেন্ট হয়ে গেছে — টিচার বদলালে আয়ের হিসাব নতুন টিচারের নামে যাবে।', 'Warning: already paid — changing the teacher moves the earnings to the new teacher.') : T('অ্যাসাইনের পর স্টুডেন্ট EPS-এ পেমেন্ট করলে P2P ক্লাস শুরু হবে।', 'After assigning, the student pays via EPS and the P2P classes begin.')}</small><small class="err" id="as-err" role="alert"></small><button class="btn btn-p">${p.tid ? T('টিচার বদলান', 'Change teacher') : T('টিচার অ্যাসাইন', 'Assign teacher')}</button>${p.status === 'accepted' ? ` <button type="button" class="btn btn-o" data-pa="p2padmun" data-id="${p.id}">${T('অ্যাসাইন বাতিল (আবার খোলা)', 'Unassign (reopen)')}</button>` : ''}</div></form>`;
    return UI.card(`#P${p.no} · ${esc(subjName(p.subject))}`, kv, back) +
      (ed ? UI.card(T('পোস্ট এডিট', 'Edit post'), editF) + UI.card(T('টিচার অ্যাসাইন / বদল', 'Assign / change teacher'), asg) : `<div class="alert info">${ic('shield')}<div>${T('এডিটের অনুমতি শুধু সুপার ও একাডেমিক অ্যাডমিনের।', 'Only Super and Academic admins can edit.')}</div></div>`) +
      UI.card(`${T('টিচারদের আবেদন', 'Teacher applications')} (${n(p.bids.length)})`, bids || `<p class="soft">${T('কোনো আবেদন নেই।', 'No applications.')}</p>`) +
      UI.card(T('ক্লাসের সময়সূচি', 'Class schedule'), p.tid ? schedBlock(p, 'a') : `<p class="soft">${T('আগে টিচার অ্যাসাইন করুন।', 'Assign a teacher first.')}</p>`) +
      (ed && p.status !== 'withdrawn' && p.status !== 'done' ? `<div class="btns"><button class="btn btn-o" data-pa="p2padmclose" data-id="${p.id}">${T('পোস্ট প্রত্যাহার/বন্ধ করুন', 'Withdraw / close this post')}</button></div>` : '');
  };
  PX.sec.a.p2p = id => id ? adminDetail(id) : adminList();
  F.p2padm = (f, d) => {
    if (!canEdit()) return; const p = DB.p2p.find(x => x.id === f.dataset.id), er = f.querySelector('#pa-err'), bad = m => { er.textContent = m; }, cl = Math.round(+d.classes), bg = Math.round(+d.budget);
    if (!(d.problem || '').trim()) return bad(T('সমস্যাটি লিখুন', 'Describe the problem'));
    if (!(d.topics || []).length) return bad(T('অন্তত একটি টপিক বেছে নিন', 'Pick at least one topic'));
    if (!(cl >= 1 && cl <= 30)) return bad(T('ক্লাস ১–৩০ এর মধ্যে', 'Classes must be 1–30'));
    if (cl < schedOf(p).filter(x => x.st !== 'cancelled').length) return bad(T('ইতোমধ্যে এর চেয়ে বেশি ক্লাসের সময় দেওয়া আছে', 'More classes are already scheduled than this'));
    if (!(bg >= 100)) return bad(T('বাজেট কমপক্ষে ১০০ ৳', 'Budget must be at least ৳100'));
    if (d.status !== 'open' && d.status !== 'withdrawn' && !p.tid) return bad(T('এই অবস্থার জন্য আগে টিচার অ্যাসাইন করুন', 'Assign a teacher before using this status'));
    if (d.status === 'open' && p.tid) return bad(T('আবার খোলা করতে “অ্যাসাইন বাতিল” ব্যবহার করুন', 'Use “Unassign” to reopen'));
    Object.assign(p, { program: d.program || '', subject: d.subject, topics: d.topics.slice(), problem: d.problem.trim(), classes: cl, budget: bg, pref: (d.pref || '').trim() });
    if (d.status === 'paid' && !p.paidAt) { p.paidAt = TODAY; p.ch = 'Admin'; }
    p.status = d.status; PX.toast(T('পোস্ট হালনাগাদ হয়েছে', 'Post updated')); PX.refresh();
  };
  F.p2passign = (f, d) => {
    if (!canEdit()) return; const p = DB.p2p.find(x => x.id === f.dataset.id), er = f.querySelector('#as-err'), pr = Math.round(+d.price);
    if (!d.tid) { er.textContent = T('টিচার বেছে নিন', 'Choose a teacher'); return; }
    if (!(pr >= 100)) { er.textContent = T('মূল্য কমপক্ষে ১০০ ৳', 'Price must be at least ৳100'); return; }
    if (p.status === 'withdrawn' || p.status === 'done') { er.textContent = T('এই অবস্থায় অ্যাসাইন করা যায় না', 'Cannot assign in this status'); return; }
    assign(p, d.tid, pr); PX.toast(T('টিচার অ্যাসাইন হয়েছে', 'Teacher assigned')); PX.refresh();
  };
  A.p2padmpick = a => { if (!canEdit()) return; const p = DB.p2p.find(x => x.id === a.dataset.id), b = p.bids.find(x => x.tid === a.dataset.tid); if (!b) return; assign(p, b.tid, b.price); PX.toast(T('টিচার অ্যাসাইন হয়েছে', 'Teacher assigned')); PX.refresh(); };
  A.p2padmun = a => { if (!canEdit()) return; const p = DB.p2p.find(x => x.id === a.dataset.id); if (!p || p.status !== 'accepted') return; p.bids = p.bids.filter(b => !b.admin); p.bids.forEach(b => { b.st = 'pending'; }); p.tid = ''; p.price = 0; p.status = 'open'; PX.toast(T('পোস্ট আবার খোলা হয়েছে', 'Post reopened')); PX.refresh(); };
  A.p2padmclose = a => { if (!canEdit()) return; const p = DB.p2p.find(x => x.id === a.dataset.id); if (p) { p.status = 'withdrawn'; PX.toast(T('পোস্ট বন্ধ করা হয়েছে', 'Post closed')); } PX.refresh(); };

  /* নেভ + হোম */
  const navS = PX.nav.s; PX.nav.s = () => { const l = navS(), i = l.findIndex(x => x.k === 'explore'), op = mine().filter(p => p.status === 'open').reduce((a, p) => a + p.bids.length, 0) + mine().reduce((a, p) => a + schedOf(p).filter(x => x.st === 'proposed' || (x.rs && x.rs.st !== 'declined' && x.rs.by === 't')).length, 0); l.splice(i + 1, 0, { k: 'p2p', l: T('P2P সমস্যা সমাধান', 'P2P problem solving'), i: 'chat', badge: op ? n(op) : '' }); return l; };
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
