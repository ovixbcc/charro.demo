/* ইনস্টিটিউশনাল সাবস্ক্রিপশন: অ্যাডমিন সেকশন + ইনস্টিটিউশন প্যানেল (role "i") + পাবলিক অনবোর্ডিংয়ের ডেটা।
   ডেমো ডেটা ব্রাউজারের localStorage-এ থাকে (chaatro_inst_v1); ডাটাবেস যুক্ত হলে সেখানে সরবে। */
(function () {
  'use strict';
  const PX = window.PX, { T, n, esc, ic, TODAY, COURSE } = PX, UI = PX.ui, DB = PX.DB, L = CH.L, F = PX.FORMS, A = PX.ACT, CHG = PX.CHG;
  const KEY = 'chaatro_inst_v1', SES = 'chaatro_inst_session';
  PX.sec.i = PX.sec.i || {};
  const TYPES = [['school', T('স্কুল', 'School'), 'School'], ['college', T('কলেজ', 'College'), 'College'], ['university', T('বিশ্ববিদ্যালয়', 'University'), 'University'], ['coaching', T('কোচিং সেন্টার', 'Coaching centre'), 'Coaching centre'], ['madrasa', T('মাদ্রাসা', 'Madrasa'), 'Madrasa'], ['other', T('অন্যান্য', 'Other'), 'Other']];
  const typeLbl = k => (TYPES.find(x => x[0] === k) || TYPES[5])[1];
  const typeEn = k => (TYPES.find(x => x[0] === k) || TYPES[5])[2];

  /* ---------- ডেটা ---------- */
  const me0 = DB.me || {};
  const SEED = () => [
    { id: 'INST-1001', status: 'active', name: 'Greenfield Model School (demo)', type: 'school', address: 'House 12, Road 4, Dhanmondi, Dhaka', contact: 'Mr. Rahim Uddin', desig: 'Headmaster', phone: '01711000001', email: 'head@greenfield.example', est: 400, msg: '', logo: '', pw: '', seats: 50, cids: ['c04', 'c06', 'c10'], at: '2026-11-10', apprAt: '2026-11-12',
      members: [{ id: 'm1', email: me0.email || 'student1@example.com', phone: me0.phone || '', sid: 'GF-0101', name: me0.name || '', cids: ['c04'], at: '2026-11-14' }, { id: 'm2', email: 'student2@example.com', phone: '', sid: 'GF-0102', name: '', cids: ['c04', 'c06'], at: '2026-11-14' }] },
    { id: 'INST-1002', status: 'pending', name: 'Sunrise Coaching Centre (demo)', type: 'coaching', address: 'Kazir Dewri, Chattogram', contact: 'Ms. Nasrin Akter', desig: 'Director', phone: '01811000002', email: 'info@sunrise.example', est: 150, msg: 'We want to give our admission-batch students access to your courses.', logo: '', pw: '', seats: 0, cids: [], at: '2026-11-20', apprAt: '', members: [] },
  ];
  let loaded = null; try { loaded = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* ignore */ }
  DB.inst = Array.isArray(loaded) ? loaded : SEED();
  const save = PX.instSave = () => { try { localStorage.setItem(KEY, JSON.stringify(DB.inst)); } catch (e) { PX.toast && PX.toast(T('ছবি বড় হওয়ায় সংরক্ষণ হয়নি', 'Could not save (image too large)')); } };
  const byId = id => DB.inst.find(x => x.id === id);
  const nextId = () => 'INST-' + (Math.max(1000, ...DB.inst.map(x => parseInt(String(x.id).replace(/\D/g, ''), 10) || 0)) + 1);
  const pw = () => { const a = 'abcdefghjkmnpqrstuvwxyz23456789'; let s = ''; for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)]; return s; };
  const nph = p => String(p || '').replace(/\D/g, '').replace(/^88/, '');
  const nem = e => String(e || '').trim().toLowerCase();
  const nsd = s => String(s || '').trim().toLowerCase();
  const same = (m, x) => (nem(m.email) && nem(m.email) === nem(x.email)) || (nph(m.phone) && nph(m.phone) === nph(x.phone)) || (nsd(m.sid) && nsd(m.sid) === nsd(x.sid));
  const ctitle = cid => { const c = COURSE(cid); return c ? L(c.title) : cid; };
  const used = i => i.members.length;
  const isPh = s => /^(?:\+?88)?01[3-9]\d{8}$/.test(String(s).replace(/[\s-]/g, ''));
  const isEm = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const stChip = s => ({ pending: UI.chip(T('অনুমোদনের অপেক্ষায়', 'Pending approval'), 'warn'), active: UI.chip(T('সক্রিয়', 'Active'), 'ok'), suspended: UI.chip(T('স্থগিত', 'Suspended'), 'bad'), rejected: UI.chip(T('বাতিল', 'Rejected'), 'bad') })[s] || '';
  const logo = (i, cls) => i.logo ? `<img class="inst-logo ${cls || ''}" src="${i.logo}" alt="">` : `<span class="inst-logo inst-ph ${cls || ''}">${esc((i.name || '?').trim().charAt(0).toUpperCase())}</span>`;
  const chips = cids => cids.length ? cids.map(c => `<span class="pchip info">${esc(ctitle(c))}</span>`).join(' ') : '<span class="soft">—</span>';
  const courseChecks = (sel, from) => UI.checks('cids', (from || COURSES.map(c => c.id)).map(id => [id, ctitle(id)]), sel || [], T('কোর্স', 'Courses'));
  const meter = i => { const u = used(i), t = i.seats || 0, p = t ? Math.min(100, Math.round(u * 100 / t)) : 0; return `<div class="imeter" title="${u}/${t}"><i style="width:${p}%"></i></div>`; };

  /* ছবি → ছোট করে data URL (লোগো) */
  PX.imgData = file => new Promise(res => {
    if (!file) return res('');
    const fr = new FileReader();
    fr.onload = () => { const im = new Image(); im.onload = () => { const m = 256, k = Math.min(1, m / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.max(1, Math.round(im.width * k)); c.height = Math.max(1, Math.round(im.height * k)); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); try { res(c.toDataURL('image/png')); } catch (e) { res(''); } }; im.onerror = () => res(''); im.src = fr.result; };
    fr.onerror = () => res(''); fr.readAsDataURL(file);
  });

  /* পাবলিক ফর্ম থেকে আবেদন */
  PX.instApply = d => { const i = { id: nextId(), status: 'pending', name: d.name, type: d.type, address: d.address, contact: d.contact, desig: d.desig || '', phone: d.phone, email: d.email, est: +d.est || 0, msg: d.msg || '', logo: d.logo || '', pw: '', seats: 0, cids: [], at: TODAY, apprAt: '', members: [] }; DB.inst.unshift(i); save(); return i; };

  /* ---------- স্টুডেন্টের কোর্স: ইনস্টিটিউশন যেগুলো দিয়েছে ---------- */
  PX.instSync = () => {
    for (let k = DB.enr.length - 1; k >= 0; k--) if (DB.enr[k].inst) DB.enr.splice(k, 1);
    const me = DB.me; if (!me) return;
    DB.inst.filter(i => i.status === 'active').forEach(i => i.members.forEach(m => {
      if (!same(m, me)) return;
      m.cids.forEach(cid => { if (!COURSE(cid) || !i.cids.includes(cid) || DB.enr.some(e => e.cid === cid)) return; DB.enr.push({ id: 'ei-' + i.id + '-' + cid, cid, fmt: 'group', plan: 'full', m: 0, per: 0, cycles: 1, paid: 1, nextDue: null, state: 'active', inst: i.id }); });
    }));
  };
  const view0 = PX.view; PX.view = (r, s, a) => { PX.instSync(); return view0(r, s, a); };

  /* ---------- লগইন ---------- */
  PX.instLogin = () => false; const instLoginOld = (id, pass) => { const i = byId(String(id).trim().toUpperCase()); if (!i || i.status !== 'active' || !i.pw || i.pw !== pass) return false; try { sessionStorage.setItem(SES, i.id); } catch (e) { PX.S.inst = i.id; } return true; };
  const curInst = () => { let id = ''; try { id = sessionStorage.getItem(SES) || ''; } catch (e) { /* ignore */ } id = id || PX.S.inst || ''; const i = byId(id); return i && i.status === 'active' ? i : null; };
  PX.instName = () => { const i = curInst(); return i ? i.name : T('ইনস্টিটিউশন', 'Institution'); };
  A.instout = () => { try { sessionStorage.removeItem(SES); } catch (e) { /* ignore */ } PX.S.inst = ''; location.hash = '#login'; };
  A.instview = a => { const i = byId(a.dataset.id); if (!i || i.status !== 'active') return; try { sessionStorage.setItem(SES, i.id); } catch (e) { /* ignore */ } PX.S.inst = i.id; location.hash = '#i-home'; };

  /* ---------- এক্সপোর্ট / PDF ---------- */
  const memHead = [T('ইমেইল', 'Email'), T('ফোন', 'Phone'), T('স্টুডেন্ট আইডি', 'Student ID'), T('কোর্স', 'Courses'), T('যোগ হয়েছে', 'Added')];
  const memRows = i => i.members.map(m => [m.email || '', m.phone || '', m.sid || '', m.cids.map(ctitle).join(' | '), m.at]);
  A.instexp = a => {
    const i = byId(a.dataset.id); if (!i) return; const hd = ['Email', 'Phone', 'Student ID', 'Courses', 'Added'];
    if (a.dataset.fmt === 'xlsx') XL.save(XL.xlsx([{ name: 'Students', head: hd, rows: memRows(i) }]), 'chaatro-' + i.id + '-students.xlsx');
    else XL.pdfTable(i.name + ' — students (' + i.id + ')', 'Generated ' + TODAY + ' · ' + i.members.length + '/' + i.seats + ' seats used', hd, memRows(i));
  };
  const loginUrl = () => location.origin.replace(/^file:.*/, 'https://chaatro.com') + '/#login';
  const sheet = (i, withPw) => {
    const pairs = [['Institution ID (login ID)', i.id], ['Institution name', i.name], ['Type', typeEn(i.type)], ['Address', i.address], ['Contact person', i.contact + (i.desig ? ' (' + i.desig + ')' : '')], ['Phone', i.phone], ['Email', i.email], ['Total subscriptions (seats)', String(i.seats)], ['Dashboard login', loginUrl()], ['Password', withPw ? (i.pw || '—') : '(shared separately)']];
    const cs = i.cids.map(c => '<tr><td>' + XL.esc(c) + '</td><td>' + XL.esc(ctitle(c)) + '</td></tr>').join('');
    const extra = (i.logo ? '<p><img src="' + i.logo + '" style="max-height:70px"></p>' : '') + '<h2 style="margin-top:22px">Courses offered to your institution</h2>' + (cs ? '<table><thead><tr><th>Code</th><th>Course</th></tr></thead><tbody>' + cs + '</tbody></table>' : '<p>No courses assigned yet.</p>') +
      '<h2 style="margin-top:22px">How to use</h2><p>1) Open the dashboard link and sign in with the Institution ID and password above. 2) Add your students by email, phone number or your own student ID, up to the seat limit, and choose their courses. 3) Students sign in on Chaatro.com with the same email or phone number and find the courses in their student portal.</p>';
    XL.pdfKV('Institution access sheet — ' + i.name, 'Chaatro.com · Generated ' + TODAY, pairs, extra);
  };
  A.instpdf = a => { const i = byId(a.dataset.id); if (i) sheet(i, a.dataset.pw === '1'); };

  /* ================= অ্যাডমিন ================= */
  const can = () => !!DB.levels[PX.S.level].perms.courses;
  const deny = () => UI.card('', UI.empty(T('এই সেকশনে আপনার অ্যাক্সেস নেই', 'You do not have access to this section')));
  const navA = PX.nav.a; PX.nav.a = () => { const l = navA(); if (!can()) return l; const i = l.findIndex(x => x.k === 'courses'), pend = DB.inst.filter(x => x.status === 'pending').length; l.splice(i < 0 ? l.length : i + 1, 0, { k: 'inst', l: T('ওআরজি সাবস্ক্রিপশন', 'Org subscription'), i: 'users', badge: pend ? n(pend) : '' }); return l; };

  const instForm = (i, pub) => `<div class="fgrid">${UI.fi({ name: 'name', label: T('ইনস্টিটিউশনের নাম', 'Institution name'), val: i.name, req: true })}${UI.fi({ name: 'type', label: T('ধরন', 'Type'), opts: TYPES.map(x => [x[0], x[1]]), val: i.type || 'school', half: true })}${UI.fi({ name: 'est', label: T('আনুমানিক স্টুডেন্ট', 'Approx. students'), type: 'number', val: i.est || '', min: 0, half: true })}${UI.fi({ name: 'address', label: T('ঠিকানা', 'Address'), val: i.address, req: true })}${UI.fi({ name: 'contact', label: T('যোগাযোগকারী ব্যক্তি', 'Contact person'), val: i.contact, req: true, half: true })}${UI.fi({ name: 'desig', label: T('পদবি', 'Designation'), val: i.desig, half: true })}${UI.fi({ name: 'phone', label: T('ফোন', 'Phone'), val: i.phone, req: true, half: true })}${UI.fi({ name: 'email', label: T('ইমেইল', 'Email'), type: 'email', val: i.email, req: true, half: true })}
    <div class="fld"><label>${T('লোগো', 'Logo')}</label><input type="file" accept="image/*" data-pc="instlogo"><small class="hint">${T('PNG/JPG, ছোট করে সংরক্ষণ হবে', 'PNG/JPG, will be resized')}</small><div id="il-prev">${i.logo ? logo(i, 'inst-lg') : ''}</div></div></div>`;
  const validate = d => { if (!d.name.trim() || !d.address.trim() || !d.contact.trim()) return T('নাম, ঠিকানা ও যোগাযোগকারীর নাম দিন', 'Enter name, address and contact person'); if (!isPh(d.phone)) return T('সঠিক ফোন নম্বর দিন', 'Enter a valid phone number'); if (!isEm(d.email)) return T('সঠিক ইমেইল দিন', 'Enter a valid email'); return ''; };
  CHG.instlogo = el => { PX.imgData(el.files[0]).then(u => { PX.S.tmpLogo = u; const p = document.getElementById('il-prev'); if (p) p.innerHTML = u ? `<img class="inst-logo inst-lg" src="${u}" alt="">` : ''; }); };

  A.instnew = () => { PX.S.tmpLogo = ''; PX.modal(T('নতুন ইনস্টিটিউশন অনবোর্ড', 'Onboard an institution'), `<form data-pf="instsave" data-id="">${instForm({})}<p class="err" id="inst-err" style="color:#c0392b"></p><button class="btn btn-p">${T('সংরক্ষণ করুন', 'Save')}</button></form>`, true); };
  A.instedit = a => { const i = byId(a.dataset.id); PX.S.tmpLogo = null; PX.modal(T('ইনস্টিটিউশন সম্পাদনা', 'Edit institution'), `<form data-pf="instsave" data-id="${i.id}">${instForm(i)}<p class="err" id="inst-err" style="color:#c0392b"></p><button class="btn btn-p">${T('সংরক্ষণ করুন', 'Save')}</button></form>`, true); };
  F.instsave = (f, d) => {
    const er = f.querySelector('#inst-err'), msg = validate(d); if (msg) { er.textContent = msg; return; }
    let i = byId(f.dataset.id);
    if (!i) { i = { id: nextId(), status: 'active', pw: pw(), seats: 0, cids: [], members: [], at: TODAY, apprAt: TODAY, msg: '', logo: '' }; DB.inst.unshift(i); }
    Object.assign(i, { name: d.name.trim(), type: d.type, address: d.address.trim(), contact: d.contact.trim(), desig: (d.desig || '').trim(), phone: d.phone.trim(), email: d.email.trim(), est: +d.est || 0 });
    if (PX.S.tmpLogo) i.logo = PX.S.tmpLogo; PX.S.tmpLogo = null; save(); PX.closeModal(); PX.toast(T('সংরক্ষণ হয়েছে', 'Saved')); location.hash = '#a-inst-' + i.id; PX.refresh();
  };
  A.instappr = a => { const i = byId(a.dataset.id); if (!i) return; i.status = 'active'; i.apprAt = TODAY; if (!i.pw) i.pw = pw(); save(); PX.S.tab.inst = 'seats'; PX.toast(T('অনুমোদিত। এখন সিট সংখ্যা ও কোর্স দিন', 'Approved. Now set seats and courses')); PX.refresh(); };
  A.instrej = a => PX.modal(T('আবেদন বাতিল', 'Reject application'), `<form data-pf="instrejdo" data-id="${a.dataset.id}">${UI.fi({ name: 'reason', label: T('কারণ (ইনস্টিটিউশনকে জানানো হবে)', 'Reason'), rows: 3, req: true })}<button class="btn btn-p">${T('বাতিল করুন', 'Reject')}</button></form>`);
  F.instrejdo = (f, d) => { const i = byId(f.dataset.id); i.status = 'rejected'; i.reason = d.reason; save(); PX.closeModal(); PX.toast(T('আবেদন বাতিল হয়েছে', 'Rejected')); PX.refresh(); };
  A.instsus = a => { const i = byId(a.dataset.id); i.status = i.status === 'active' ? 'suspended' : 'active'; save(); PX.toast(i.status === 'active' ? T('আবার সক্রিয়', 'Reactivated') : T('স্থগিত করা হয়েছে', 'Suspended')); PX.refresh(); };
  A.instpw = a => { const i = byId(a.dataset.id); i.pw = pw(); save(); PX.toast(T('নতুন পাসওয়ার্ড তৈরি হয়েছে', 'New password generated')); PX.refresh(); };
  F.instseats = (f, d) => {
    const i = byId(f.dataset.id), seats = parseInt(d.seats, 10), er = f.querySelector('#seat-err'), cids = d.cids || [];
    if (!(seats >= 0)) { er.textContent = T('সঠিক সংখ্যা দিন', 'Enter a valid number'); return; }
    if (seats < used(i)) { er.textContent = T('ইতিমধ্যে ' + n(used(i)) + 'জন স্টুডেন্ট যোগ আছে, এর কম দেওয়া যাবে না', used(i) + ' students already added; seats cannot be lower'); return; }
    i.seats = seats; i.cids = cids; i.members.forEach(m => { m.cids = m.cids.filter(c => cids.includes(c)); }); save(); PX.toast(T('সিট ও কোর্স সংরক্ষণ হয়েছে। এখন PDF ডাউনলোড করতে পারেন', 'Seats and courses saved. You can now download the PDF')); PX.refresh();
  };

  const adminDetail = id => {
    const i = byId(id); if (!i) return UI.card('', UI.empty(T('ইনস্টিটিউশন পাওয়া যায়নি', 'Institution not found')));
    if (PX.S.instLast !== id) { PX.S.instLast = id; PX.S.tab.inst = 'info'; }
    const tab = PX.S.tab.inst || 'info';
    const tabs = UI.tabs('inst', [['info', T('তথ্য', 'Details')], ['seats', T('সিট ও কোর্স', 'Seats & courses')], ['students', T('স্টুডেন্ট (' + n(used(i)) + ')', 'Students (' + used(i) + ')')], ['access', T('লগইন ও PDF', 'Access & PDF')]], tab);
    const dl = (k, v) => `<div><dt>${k}</dt><dd>${v || '—'}</dd></div>`;
    let body = '';
    if (tab === 'info') {
      const acts = i.status === 'pending' ? `<button class="btn btn-p btn-sm" data-pa="instappr" data-id="${i.id}">${ic('check')} ${T('অনুমোদন', 'Approve')}</button> <button class="btn btn-o btn-sm" data-pa="instrej" data-id="${i.id}">${T('বাতিল', 'Reject')}</button>` : (i.status === 'active' || i.status === 'suspended' ? `<button class="btn btn-o btn-sm" data-pa="instsus" data-id="${i.id}">${i.status === 'active' ? T('স্থগিত করুন', 'Suspend') : T('আবার সক্রিয় করুন', 'Reactivate')}</button>` : `<button class="btn btn-p btn-sm" data-pa="instappr" data-id="${i.id}">${T('আবার অনুমোদন', 'Approve again')}</button>`);
      body = UI.card(esc(i.name), `<div class="inst-head">${logo(i, 'inst-lg')}<div>${stChip(i.status)} <small class="soft">${esc(i.id)}</small></div></div><dl class="sum">${dl(T('ধরন', 'Type'), esc(typeLbl(i.type)))}${dl(T('ঠিকানা', 'Address'), esc(i.address))}${dl(T('যোগাযোগকারী', 'Contact person'), esc(i.contact) + (i.desig ? ' · ' + esc(i.desig) : ''))}${dl(T('ফোন', 'Phone'), esc(i.phone))}${dl(T('ইমেইল', 'Email'), esc(i.email))}${dl(T('আনুমানিক স্টুডেন্ট', 'Approx. students'), i.est ? n(i.est) : '')}${dl(T('আবেদনের তারিখ', 'Applied'), i.at)}${i.msg ? dl(T('বার্তা', 'Message'), esc(i.msg)) : ''}${i.reason ? dl(T('বাতিলের কারণ', 'Reason'), esc(i.reason)) : ''}</dl><div class="btns">${acts} <button class="btn btn-o btn-sm" data-pa="instedit" data-id="${i.id}">${T('সম্পাদনা', 'Edit')}</button></div>`);
    } else if (tab === 'seats') {
      body = i.status === 'pending' || i.status === 'rejected' ? UI.card('', UI.empty(T('আগে আবেদন অনুমোদন করুন', 'Approve the application first'))) : UI.card(T('সাবস্ক্রিপশন সিট ও কোর্স', 'Subscription seats & courses'), `<p>${T('ব্যবহৃত', 'Used')}: <b>${n(used(i))} / ${n(i.seats)}</b></p>${meter(i)}<form data-pf="instseats" data-id="${i.id}"><div class="fgrid">${UI.fi({ name: 'seats', label: T('মোট সাবস্ক্রিপশন (স্টুডেন্ট সিট)', 'Total subscriptions (student seats)'), type: 'number', val: i.seats, min: used(i), req: true, half: true })}</div>${courseChecks(i.cids)}<p class="err" id="seat-err" style="color:#c0392b"></p><div class="btns"><button class="btn btn-p">${T('সংরক্ষণ করুন', 'Save')}</button> <button type="button" class="btn btn-o" data-pa="instpdf" data-id="${i.id}" data-pw="1">${ic('download')} ${T('PDF ডাউনলোড', 'Download PDF')}</button></div></form>`);
    } else if (tab === 'students') {
      body = UI.card(T('স্টুডেন্ট তালিকা', 'Students'), UI.tbl(memHead, i.members.map(m => [esc(m.email) || '—', esc(m.phone) || '—', esc(m.sid) || '—', chips(m.cids), m.at])), `<span class="bar-b"><button class="btn btn-o btn-sm" data-pa="instexp" data-id="${i.id}" data-fmt="xlsx">${ic('download')} Excel</button> <button class="btn btn-o btn-sm" data-pa="instexp" data-id="${i.id}" data-fmt="pdf">${ic('download')} PDF</button></span>`);
    } else {
      body = UI.card(T('লগইন তথ্য ও PDF', 'Login details & PDF'), i.status !== 'active' ? UI.empty(T('অনুমোদিত ও সক্রিয় হলে লগইন তথ্য আসবে', 'Login details appear once the institution is active')) : `<dl class="sum">${dl(T('ইনস্টিটিউশন আইডি (লগইন আইডি)', 'Institution ID (login ID)'), `<code>${esc(i.id)}</code>`)}${dl(T('পাসওয়ার্ড', 'Password'), `<code>${esc(i.pw)}</code>`)}${dl(T('লগইন লিংক', 'Login link'), esc(loginUrl()))}</dl><div class="btns"><button class="btn btn-p" data-pa="instpdf" data-id="${i.id}" data-pw="1">${ic('download')} ${T('PDF ডাউনলোড (আইডি, পাসওয়ার্ড, কোর্স)', 'Download PDF (ID, password, courses)')}</button> <button class="btn btn-o" data-pa="instpw" data-id="${i.id}">${T('নতুন পাসওয়ার্ড', 'New password')}</button> <button class="btn btn-o" data-pa="instview" data-id="${i.id}">${T('ইনস্টিটিউশন প্যানেল খুলুন', 'Open institution panel')}</button></div><p class="soft">${T('PDF-এ ইনস্টিটিউশনের আইডি, পাসওয়ার্ড, সিট সংখ্যা ও কোর্সের তালিকা থাকে। এটি নিরাপদে ইনস্টিটিউশনকে দিন।', 'The PDF lists the institution ID, password, seats and courses. Share it securely.')}</p>`);
    }
    return `<p><a href="#a-inst">${T('← সব ইনস্টিটিউশন', '← All institutions')}</a></p>${tabs}${body}`;
  };

  PX.sec.a.inst = arg => {
    if (!can()) return deny();
    if (arg) return adminDetail(arg);
    const f = PX.S.tab.instf || 'all', all = DB.inst, rows = all.filter(i => f === 'all' || i.status === f);
    const tabs = UI.tabs('instf', [['all', T('সব', 'All') + ' (' + n(all.length) + ')'], ['pending', T('অপেক্ষমাণ', 'Pending') + ' (' + n(all.filter(i => i.status === 'pending').length) + ')'], ['active', T('সক্রিয়', 'Active')], ['suspended', T('স্থগিত', 'Suspended')], ['rejected', T('বাতিল', 'Rejected')]], f);
    const tot = all.filter(i => i.status === 'active');
    return `<div class="kpis">${UI.kpi(T('সক্রিয় ইনস্টিটিউশন', 'Active institutions'), n(tot.length), '', 'ok')}${UI.kpi(T('অপেক্ষমাণ আবেদন', 'Pending applications'), n(all.filter(i => i.status === 'pending').length), '', 'warn')}${UI.kpi(T('মোট সিট', 'Total seats'), n(tot.reduce((a, i) => a + i.seats, 0)))}${UI.kpi(T('ব্যবহৃত সিট', 'Seats used'), n(tot.reduce((a, i) => a + used(i), 0)))}</div>` +
      UI.card(T('ওআরজি (অর্গানাইজেশনাল) সাবস্ক্রিপশন', 'Organizational (Org) subscriptions'), tabs + UI.tbl([T('আইডি', 'ID'), T('ইনস্টিটিউশন', 'Institution'), T('যোগাযোগ', 'Contact'), T('সিট', 'Seats'), T('কোর্স', 'Courses'), T('স্ট্যাটাস', 'Status'), ''], rows.map(i => [`<code>${esc(i.id)}</code>`, `<span class="inst-row">${logo(i)}<b>${esc(i.name)}</b></span><small>${esc(typeLbl(i.type))}</small>`, `${esc(i.contact)}<small>${esc(i.phone)}</small>`, `${n(used(i))} / ${n(i.seats)}${meter(i)}`, n(i.cids.length), stChip(i.status), `<a class="btn btn-o btn-sm" href="#a-inst-${i.id}">${T('খুলুন', 'Open')}</a>`])), `<button class="btn btn-p btn-sm" data-pa="instnew">${ic('plus')} ${T('নতুন ইনস্টিটিউশন', 'New institution')}</button>`);
  };

  /* ================= ইনস্টিটিউশন প্যানেল (role i) ================= */
  const ROLE_I = () => curInst();
  const gate = () => UI.card(T('লগইন প্রয়োজন', 'Login required'), `<p>${T('ইনস্টিটিউশন আইডি ও পাসওয়ার্ড দিয়ে লগইন করুন।', 'Sign in with your institution ID and password.')}</p><div class="btns"><a class="btn btn-p" href="#login">${T('লগইন', 'Log in')}</a></div>`);
  const navI = () => { const i = ROLE_I(); return [{ k: 'home', l: T('ওভারভিউ', 'Overview'), i: 'home' }, { k: 'students', l: T('স্টুডেন্ট', 'Students'), i: 'users', badge: i ? n(used(i)) : '' }, { k: 'bulk', l: T('বাল্ক এনরোল', 'Bulk enrol'), i: 'upload' }, { k: 'courses', l: T('কোর্স', 'Courses'), i: 'book' }, { k: 'profile', l: T('প্রোফাইল', 'Profile'), i: 'user' }]; };
  PX.nav.i = navI;
  const wrap = fn => (...a) => { const i = ROLE_I(); return i ? fn(i, ...a) : gate(); };

  const kpis = i => `<div class="kpis">${UI.kpi(T('মোট সিট', 'Total seats'), n(i.seats))}${UI.kpi(T('ব্যবহৃত', 'Used'), n(used(i)), '', 'ok')}${UI.kpi(T('বাকি', 'Remaining'), n(Math.max(0, i.seats - used(i))), '', i.seats - used(i) <= 0 ? 'warn' : '')}${UI.kpi(T('কোর্স', 'Courses'), n(i.cids.length))}</div>`;
  PX.sec.i.home = wrap(i => `<div class="inst-head">${logo(i, 'inst-lg')}<div><h2>${esc(i.name)}</h2><small class="soft">${esc(i.id)} · ${esc(typeLbl(i.type))}</small></div></div>` + kpis(i) + meter(i) +
    UI.card(T('কোর্স অনুযায়ী এনরোলমেন্ট', 'Enrolment by course'), UI.tbl([T('কোর্স', 'Course'), T('এনরোল হয়েছে', 'Enrolled')], i.cids.map(c => [esc(ctitle(c)), n(i.members.filter(m => m.cids.includes(c)).length)]))) +
    (i.cids.length ? '' : `<div class="alert warn">${ic('clock')}<div><p>${T('এখনো কোনো কোর্স দেওয়া হয়নি। Chaatro.com টিম কোর্স যোগ করলে এখানে দেখা যাবে।', 'No courses assigned yet. They will appear once the Chaatro.com team assigns them.')}</p></div></div>`) + `<div class="btns"><button class="btn btn-o" data-pa="instout">${T('লগআউট', 'Log out')}</button></div>`);

  const stuForm = (i, m) => `<form data-pf="instaddst" data-id="${i.id}" data-mid="${m ? m.id : ''}"><div class="fgrid">${UI.fi({ name: 'email', label: T('ইমেইল', 'Email'), type: 'email', val: m ? m.email : '', half: true })}${UI.fi({ name: 'phone', label: T('ফোন নম্বর', 'Phone number'), val: m ? m.phone : '', half: true })}${UI.fi({ name: 'sid', label: T('আপনাদের স্টুডেন্ট আইডি', 'Your student ID'), val: m ? m.sid : '', half: true })}${UI.fi({ name: 'name', label: T('নাম (ঐচ্ছিক)', 'Name (optional)'), val: m ? m.name : '', half: true })}</div><small class="hint">${T('ইমেইল, ফোন বা স্টুডেন্ট আইডির অন্তত একটি দিন। স্টুডেন্ট Chaatro.com-এ একই ইমেইল/ফোন দিয়ে লগইন করলে কোর্স পাবে।', 'Give at least one of email, phone or student ID. The student signs in to Chaatro.com with the same email/phone to see the courses.')}</small>${courseChecks(m ? m.cids : [], i.cids)}<p class="err" id="st-err" style="color:#c0392b"></p><button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></form>`;
  A.instaddst = () => { const i = ROLE_I(); if (!i) return; if (!i.cids.length) { PX.toast(T('এখনো কোনো কোর্স দেওয়া হয়নি', 'No courses assigned yet')); return; } if (used(i) >= i.seats) { PX.toast(T('সব সিট ব্যবহৃত হয়ে গেছে', 'All seats are used')); return; } PX.modal(T('স্টুডেন্ট যোগ করুন', 'Add a student'), stuForm(i, null), true); };
  A.instmedit = a => { const i = ROLE_I(), m = i && i.members.find(x => x.id === a.dataset.mid); if (m) PX.modal(T('স্টুডেন্ট সম্পাদনা', 'Edit student'), stuForm(i, m), true); };
  F.instaddst = (f, d) => {
    const i = ROLE_I(), er = f.querySelector('#st-err'); if (!i) return;
    const x = { email: (d.email || '').trim(), phone: (d.phone || '').trim(), sid: (d.sid || '').trim(), name: (d.name || '').trim() }, cids = (d.cids || []).filter(c => i.cids.includes(c));
    if (!x.email && !x.phone && !x.sid) { er.textContent = T('ইমেইল, ফোন বা স্টুডেন্ট আইডি দিন', 'Enter an email, phone or student ID'); return; }
    if (x.email && !isEm(x.email)) { er.textContent = T('সঠিক ইমেইল দিন', 'Enter a valid email'); return; }
    if (x.phone && !isPh(x.phone)) { er.textContent = T('সঠিক ফোন নম্বর দিন', 'Enter a valid phone number'); return; }
    if (!cids.length) { er.textContent = T('অন্তত একটি কোর্স বাছুন', 'Choose at least one course'); return; }
    const mid = f.dataset.mid; let m = mid ? i.members.find(y => y.id === mid) : i.members.find(y => same(y, x));
    if (!m) { if (used(i) >= i.seats) { er.textContent = T('সিট শেষ', 'No seats left'); return; } m = { id: 'm' + Date.now() + Math.floor(Math.random() * 99), email: '', phone: '', sid: '', name: '', cids: [], at: TODAY }; i.members.push(m); }
    Object.assign(m, x, { cids }); save(); PX.closeModal(); PX.toast(T('সংরক্ষণ হয়েছে', 'Saved')); PX.refresh();
  };
  A.instmrm = a => { const i = ROLE_I(), m = i && i.members.find(x => x.id === a.dataset.mid); if (m) PX.modal(T('স্টুডেন্ট সরান', 'Remove student'), `<p>${esc(m.email || m.phone || m.sid)}</p><p class="soft">${T('সরালে একটি সিট ফাঁকা হবে এবং স্টুডেন্টের এই কোর্সগুলো বন্ধ হবে।', 'This frees a seat and removes the student\'s access.')}</p><button class="btn btn-p" data-pa="instmrmdo" data-mid="${m.id}">${T('হ্যাঁ, সরান', 'Yes, remove')}</button>`); };
  A.instmrmdo = a => { const i = ROLE_I(); if (!i) return; i.members = i.members.filter(x => x.id !== a.dataset.mid); save(); PX.closeModal(); PX.toast(T('সরানো হয়েছে', 'Removed')); PX.refresh(); };

  PX.sec.i.students = wrap(i => {
    const q = (PX.S.tab.instq || '').toLowerCase(), rows = i.members.filter(m => !q || [m.email, m.phone, m.sid, m.name].join(' ').toLowerCase().includes(q));
    return kpis(i) + UI.card(T('স্টুডেন্ট', 'Students'), `<label class="tsrch inst-q">${ic('search')}<input type="search" data-pc="instq" value="${esc(PX.S.tab.instq || '')}" placeholder="${T('ইমেইল / ফোন / আইডি', 'Email / phone / ID')}"></label>` + UI.tbl([T('ইমেইল', 'Email'), T('ফোন', 'Phone'), T('স্টুডেন্ট আইডি', 'Student ID'), T('কোর্স', 'Courses'), ''], rows.map(m => [esc(m.email) || '—', esc(m.phone) || '—', esc(m.sid) || '—', chips(m.cids), `<button class="btn btn-o btn-sm" data-pa="instmedit" data-mid="${m.id}">${T('কোর্স বদলান', 'Edit')}</button> <button class="btn btn-o btn-sm" data-pa="instmrm" data-mid="${m.id}">${T('সরান', 'Remove')}</button>`])),
      `<span class="bar-b"><button class="btn btn-p btn-sm" data-pa="instaddst">${ic('plus')} ${T('স্টুডেন্ট যোগ', 'Add student')}</button> <button class="btn btn-o btn-sm" data-pa="instexp" data-id="${i.id}" data-fmt="xlsx">${ic('download')} Excel</button> <button class="btn btn-o btn-sm" data-pa="instexp" data-id="${i.id}" data-fmt="pdf">${ic('download')} PDF</button></span>`);
  });
  CHG.instq = el => { PX.S.tab.instq = el.value; const pos = el.selectionStart; PX.refresh(); const e2 = document.querySelector('[data-pc=instq]'); if (e2) { e2.focus(); try { e2.setSelectionRange(pos, pos); } catch (x) { /* ignore */ } } };

  /* বাল্ক: টেক্সট/CSV */
  const parseBulk = txt => txt.split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => l.split(/[,\t;]/).map(s => s.trim()).filter(Boolean)).filter(p => !(p.length && /^(email|e-mail|phone|mobile|student)/i.test(p[0]) && !p[0].includes('@'))).map(p => { const x = { email: '', phone: '', sid: '' }; p.forEach(t => { if (t.includes('@')) x.email = t; else if (isPh(t)) x.phone = t; else if (!x.sid) x.sid = t; }); return x; });
  CHG.instbfile = el => { const f = el.files[0]; if (!f) return; const fr = new FileReader(); fr.onload = () => { const t = document.getElementById('ib-rows'); if (t) t.value = String(fr.result || ''); }; fr.readAsText(f); };
  PX.sec.i.bulk = wrap(i => kpis(i) + UI.card(T('বাল্ক এনরোল', 'Bulk enrol'), `<form data-pf="instbulk"><p class="soft">${T('প্রতি লাইনে একজন: ইমেইল, ফোন, স্টুডেন্ট আইডি (যেকোনো ক্রমে, কমা দিয়ে)। CSV ফাইলও দিতে পারেন।', 'One student per line: email, phone, student ID (any order, comma separated). You can also upload a CSV file.')}</p><div class="fld"><label>${T('তালিকা', 'List')}</label><textarea id="ib-rows" name="rows" rows="8" placeholder="a@school.edu, 01712345678, S-101&#10;b@school.edu"></textarea></div><div class="fld"><label>${T('অথবা CSV/টেক্সট ফাইল', 'Or CSV/text file')}</label><input type="file" accept=".csv,.txt,text/csv,text/plain" data-pc="instbfile"></div>${courseChecks([], i.cids)}<p class="err" id="bk-err" style="color:#c0392b"></p><button class="btn btn-p">${T('এনরোল করুন', 'Enrol')}</button></form>`));
  F.instbulk = (f, d) => {
    const i = ROLE_I(), er = f.querySelector('#bk-err'); if (!i) return; const cids = (d.cids || []).filter(c => i.cids.includes(c)), list = parseBulk(d.rows || '');
    if (!cids.length) { er.textContent = T('অন্তত একটি কোর্স বাছুন', 'Choose at least one course'); return; }
    if (!list.length) { er.textContent = T('তালিকা খালি', 'The list is empty'); return; }
    let add = 0, upd = 0; const skip = [];
    list.forEach(x => {
      const lbl = x.email || x.phone || x.sid; if (!lbl) { skip.push(T('অচেনা লাইন', 'Unrecognised line')); return; }
      let m = i.members.find(y => same(y, x));
      if (m) { const before = m.cids.length; m.cids = Array.from(new Set(m.cids.concat(cids))); Object.assign(m, { email: m.email || x.email, phone: m.phone || x.phone, sid: m.sid || x.sid }); if (m.cids.length > before) upd++; return; }
      if (used(i) >= i.seats) { skip.push(lbl + ' — ' + T('সিট শেষ', 'no seats left')); return; }
      i.members.push({ id: 'm' + Date.now() + Math.floor(Math.random() * 9999), email: x.email, phone: x.phone, sid: x.sid, name: '', cids: cids.slice(), at: TODAY }); add++;
    });
    save(); PX.modal(T('বাল্ক এনরোল সম্পন্ন', 'Bulk enrol done'), `<dl class="sum"><div><dt>${T('নতুন যোগ', 'Added')}</dt><dd>${n(add)}</dd></div><div><dt>${T('কোর্স যোগ (আগের স্টুডেন্ট)', 'Updated')}</dt><dd>${n(upd)}</dd></div><div><dt>${T('বাদ', 'Skipped')}</dt><dd>${n(skip.length)}</dd></div></dl>${skip.length ? `<ul class="soft">${skip.slice(0, 12).map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}`); PX.refresh();
  };
  PX.sec.i.courses = wrap(i => UI.card(T('আপনার ইনস্টিটিউশনের কোর্স', 'Courses for your institution'), UI.tbl([T('কোর্স', 'Course'), T('টিচার', 'Teacher'), T('এনরোল হয়েছে', 'Enrolled')], i.cids.map(c => { const co = COURSE(c), t = co && PX.TEACH(co.teacher); return [esc(ctitle(c)), t ? esc(L(t.n)) : '—', n(i.members.filter(m => m.cids.includes(c)).length)]; })) + `<p class="soft">${T('কোর্স যোগ বা বাদ দিতে Chaatro.com টিমের সঙ্গে যোগাযোগ করুন।', 'Contact the Chaatro.com team to add or remove courses.')}</p>`));
  PX.sec.i.profile = wrap(i => { const dl = (k, v) => `<div><dt>${k}</dt><dd>${v || '—'}</dd></div>`; return UI.card(esc(i.name), `<div class="inst-head">${logo(i, 'inst-lg')}<div>${stChip(i.status)} <small class="soft">${esc(i.id)}</small></div></div><dl class="sum">${dl(T('ধরন', 'Type'), esc(typeLbl(i.type)))}${dl(T('ঠিকানা', 'Address'), esc(i.address))}${dl(T('যোগাযোগকারী', 'Contact person'), esc(i.contact))}${dl(T('ফোন', 'Phone'), esc(i.phone))}${dl(T('ইমেইল', 'Email'), esc(i.email))}${dl(T('মোট সিট', 'Seats'), n(i.seats))}</dl><div class="btns"><button class="btn btn-o" data-pa="instpdf" data-id="${i.id}" data-pw="0">${ic('download')} ${T('তথ্য PDF', 'Info PDF')}</button></div>`) + UI.card(T('পাসওয়ার্ড বদলান', 'Change password'), `<form data-pf="instpwchg"><div class="fgrid">${UI.fi({ name: 'cur', label: T('বর্তমান পাসওয়ার্ড', 'Current password'), type: 'password', req: true, half: true })}${UI.fi({ name: 'nw', label: T('নতুন পাসওয়ার্ড (৬+ অক্ষর)', 'New password (6+ chars)'), type: 'password', req: true, half: true })}</div><p class="err" id="pw-err" style="color:#c0392b"></p><button class="btn btn-p">${T('বদলান', 'Change')}</button></form>`); });
  F.instpwchg = (f, d) => { const i = ROLE_I(), er = f.querySelector('#pw-err'); if (!i) return; if (d.cur !== i.pw) { er.textContent = T('বর্তমান পাসওয়ার্ড মেলেনি', 'Current password is wrong'); return; } if ((d.nw || '').length < 6) { er.textContent = T('অন্তত ৬ অক্ষর দিন', 'Use at least 6 characters'); return; } i.pw = d.nw; save(); f.reset(); PX.toast(T('পাসওয়ার্ড বদলেছে', 'Password changed')); };
})();
