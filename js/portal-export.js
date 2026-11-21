/* ডাটা এক্সপোর্ট (Excel / PDF), স্টুডেন্ট ও টিচারের প্রোফাইল ভিউ — অ্যাডমিন ও টিচার */
(function () {
  'use strict';
  const PX = window.PX, { T, n, mny, esc, fd, ic, COURSE, TEACH, TODAY } = PX, DB = PX.DB, UI = PX.ui, L = CH.L, A = PX.ACT;
  const tt = o => L(o);
  const stu = id => DB.crm.find(u => u.id === id) || { name: '—', sid: '', phone: '' };
  const H = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  const money = v => mny(v);
  const fmts = c => (c.formats || []).map(f => tt(ctype(f))).join(' / ');
  const prog = c => tt(PROGRAMS.find(p => p.id === c.program) || {});
  const pstat = p => ({ confirmed: 'Confirmed', pending: 'Pending' }[p.status] || p.status);
  const myCourses = tid => COURSES.filter(c => c.teacher === tid);

  /* ---------- ডেটাসেট ---------- */
  const adminSets = () => [
    { k: 'students', perm: 'students', bn: 'স্টুডেন্ট', en: 'Students', head: ['Student ID', 'Name', 'Phone', 'Email', 'District', 'Level', 'Joined', 'Courses', 'Guardian', 'Guardian phone', 'Status'],
      rows: () => DB.crm.map(u => [u.sid, u.name, u.phone, u.email, u.district, u.level, u.joined, u.courses.length, u.guardian.name, u.guardian.phone, u.blocked ? 'Blocked' : 'Active']) },
    { k: 'teachers', perm: 'teachers', bn: 'টিচার', en: 'Teachers', head: ['Teacher ID', 'Name', 'Institution', 'Phone', 'Courses', 'Students', 'Gross (BDT)', 'Company share (BDT)', 'Teacher earning (BDT)', 'Status'],
      rows: () => TEACHERS.map(t => { const e = PX.teacherEarn(t.id); return [t.pid, tt(t.n), tt(t.inst), t.phone, myCourses(t.id).length, new Set(myCourses(t.id).flatMap(c => PX.roster(c.id).map(u => u.id))).size, e.gross, e.company, e.mine, DB.banned[t.id] ? 'Banned' : 'Active']; }) },
    { k: 'courses', perm: 'courses', bn: 'কোর্স', en: 'Courses', head: ['Course ID', 'Title', 'Teacher', 'Program', 'Class type', 'Price (BDT)', 'Seats left', 'Enrolled', 'Start', 'Days / week'],
      rows: () => COURSES.map(c => [c.pid, tt(c.title), tt(TEACH(c.teacher).n), prog(c), fmts(c), c.base, c.seats, c.enrolled || PX.roster(c.id).length, c.start, c.cpw]) },
    { k: 'payments', perm: 'payments', bn: 'পেমেন্ট', en: 'Payments', head: ['Receipt no.', 'Date', 'Student ID', 'Student', 'Course ID', 'Course', 'Method', 'Amount (BDT)', 'Status'],
      rows: () => DB.pays.slice().sort((a, b) => b.date.localeCompare(a.date)).map(p => [p.id, p.date, stu(p.sid).sid, stu(p.sid).name, COURSE(p.cid).pid, tt(COURSE(p.cid).title), p.ch, p.amount, pstat(p)]) },
    { k: 'payouts', perm: 'payouts', bn: 'টিচার পেআউট', en: 'Teacher payouts', head: ['Teacher ID', 'Teacher', 'Gross (BDT)', 'Company share (BDT)', 'Teacher earning (BDT)', 'Paid (BDT)', 'Due (BDT)', 'Payout account'],
      rows: () => TEACHERS.map(t => { const e = PX.teacherEarn(t.id), a = DB.payAcc[t.id] || {}, w = a.wallet ? 'Wallet ' + a.wallet.type + ' ' + a.wallet.phone : a.bank ? 'Bank ' + a.bank.bankName : '—'; return [t.pid, tt(t.n), e.gross, e.company, e.mine, e.paid, e.due, w]; }) },
    { k: 'payoutlog', perm: 'payouts', bn: 'পেআউট ইতিহাস', en: 'Payout history', head: ['Payout ID', 'Date', 'Teacher ID', 'Teacher', 'Amount (BDT)', 'Reference / note'],
      rows: () => DB.payouts.map(p => [p.id, p.date, TEACH(p.tid).pid, tt(TEACH(p.tid).n), p.amount, p.note || p.ref || '']) },
    { k: 'applications', perm: 'applications', bn: 'টিচার আবেদন', en: 'Teacher applications', head: ['Name', 'Institution', 'Department', 'Year', 'Phone', 'Email', 'District', 'Applied', 'Status'],
      rows: () => DB.apps.map(a => [a.name, a.inst, a.dept, a.year, a.phone, a.email, a.district, a.date, a.status]) },
    { k: 'tickets', perm: 'support', bn: 'সাপোর্ট টিকেট', en: 'Support tickets', head: ['Ticket', 'Date', 'From', 'Role', 'Category', 'Subject', 'Status'],
      rows: () => DB.tickets.map(x => [x.id, x.date, x.name, x.by === 's' ? 'Student' : 'Teacher', x.cat, x.subject, x.status]) },
  ];
  const TID = 't01';
  const teacherSets = () => {
    const mine = myCourses(TID), ids = new Set(mine.map(c => c.id));
    return [
      { k: 'mystudents', bn: 'আমার স্টুডেন্ট', en: 'My students', head: ['Student ID', 'Name', 'Phone', 'District', 'Course ID', 'Course'],
        rows: () => mine.flatMap(c => PX.roster(c.id).map(u => [u.sid, u.name, u.phone, u.district, c.pid, tt(c.title)])) },
      { k: 'mycourses', bn: 'আমার কোর্স', en: 'My courses', head: ['Course ID', 'Title', 'Program', 'Class type', 'Price (BDT)', 'Seats left', 'Students', 'Start'],
        rows: () => mine.map(c => [c.pid, tt(c.title), prog(c), fmts(c), c.base, c.seats, PX.roster(c.id).length, c.start]) },
      { k: 'mypayments', bn: 'আমার কোর্সের পেমেন্ট', en: 'Payments for my courses', head: ['Receipt no.', 'Date', 'Student', 'Course', 'Method', 'Amount (BDT)', 'Status'],
        rows: () => DB.pays.filter(p => ids.has(p.cid)).sort((a, b) => b.date.localeCompare(a.date)).map(p => [p.id, p.date, stu(p.sid).name, tt(COURSE(p.cid).title), p.ch, p.amount, pstat(p)]) },
      { k: 'myearn', bn: 'আমার আয় ও পেআউট', en: 'My earnings & payouts', head: ['Item', 'Amount (BDT)'],
        rows: () => { const e = PX.teacherEarn(TID); return [['Gross collection', e.gross], ['Company share', e.company], ['My earning', e.mine], ['Paid out', e.paid], ['Due', e.due]].concat(DB.payouts.filter(p => p.tid === TID).map(p => ['Payout ' + p.date + (p.note ? ' — ' + p.note : ''), p.amount])); } },
    ];
  };
  const lvl = k => (k ? ((DB.levels[PX.S.level] || { perms: {} }).perms[k] || 0) : 2);
  const setsFor = role => role === 't' ? teacherSets() : adminSets().filter(s => lvl(s.perm) > 0);
  const lab = s => T(s.bn, s.en);
  const stamp = () => TODAY;
  const fname = (s, ext) => 'chaatro-' + s.k + '-' + stamp() + '.' + ext;

  /* ---------- ডাউনলোড ---------- */
  A.exdl = a => {
    const s = setsFor(a.dataset.role).find(x => x.k === a.dataset.k); if (!s) return;
    const rows = s.rows();
    if (a.dataset.fmt === 'xlsx') XL.save(XL.xlsx([{ name: s.en, head: s.head, rows }]), fname(s, 'xlsx'));
    else XL.pdfTable(s.en, 'Generated ' + stamp() + ' · ' + rows.length + ' rows', s.head, rows);
    PX.toast(a.dataset.fmt === 'xlsx' ? T('Excel ফাইল ডাউনলোড হচ্ছে', 'Downloading Excel file') : T('প্রিন্ট ডায়ালগে "Save as PDF" বেছে নিন', 'In the print dialog choose "Save as PDF"'));
  };
  A.exall = a => {
    const ss = setsFor(a.dataset.role); if (!ss.length) return;
    XL.save(XL.xlsx(ss.map(s => ({ name: s.en, head: s.head, rows: s.rows() }))), 'chaatro-all-data-' + stamp() + '.xlsx'); PX.toast(T('সব ডেটাসহ Excel ডাউনলোড হচ্ছে', 'Downloading workbook with all data'));
  };
  PX.exportUI = role => {
    const ss = setsFor(role);
    return `<div class="alert info">${ic('file')}<div><b>${T('Excel (.xlsx) ও PDF ডাউনলোড', 'Download as Excel (.xlsx) or PDF')}</b><p>${role === 't' ? T('এখানে শুধু আপনার নিজের কোর্স, স্টুডেন্ট ও আয়ের তথ্য পাবেন।', 'You get only your own courses, students and earnings.') : T('আপনার অ্যাক্সেস লেভেল অনুযায়ী ডেটাবেস দেখানো হচ্ছে।', 'Databases are listed according to your access level.')} ${T('PDF-এর জন্য প্রিন্ট ডায়ালগে "Save as PDF" বেছে নিন।', 'For PDF, choose "Save as PDF" in the print dialog.')}</p></div></div>` +
      UI.card(T('ডেটাবেস', 'Databases'), `<div class="btns" style="margin-bottom:.8rem"><button class="btn btn-p btn-sm" data-pa="exall" data-role="${role}">${ic('download')} ${T('সব ডেটা — একটি Excel ফাইলে', 'All data — one Excel workbook')}</button></div>` +
        UI.tbl([T('ডেটাবেস', 'Database'), T('সারি', 'Rows'), ''], ss.map(s => [`<b>${lab(s)}</b>`, n(s.rows().length), `<button class="btn btn-o btn-sm" data-pa="exdl" data-role="${role}" data-k="${s.k}" data-fmt="xlsx">${ic('download')} Excel</button> <button class="btn btn-o btn-sm" data-pa="exdl" data-role="${role}" data-k="${s.k}" data-fmt="pdf">${ic('download')} PDF</button>`])));
  };
  PX.exportBar = (role, k) => `<span class="bar-b"><button class="btn btn-o btn-sm" data-pa="exdl" data-role="${role}" data-k="${k}" data-fmt="xlsx">${ic('download')} Excel</button> <button class="btn btn-o btn-sm" data-pa="exdl" data-role="${role}" data-k="${k}" data-fmt="pdf">${ic('download')} PDF</button></span>`;

  /* ---------- প্রোফাইল ভিউ ---------- */
  const DISTS = ['Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Sylhet'], FM = ['Abdul', 'Rahim', 'Kamal', 'Jahid', 'Monir', 'Salam'], MM = ['Rokeya', 'Nasima', 'Salma', 'Jesmin', 'Shirin', 'Rina'];
  const nid = s => String(1000000000 + H(s) % 8999999999);
  const demo = (key, kind, base) => {
    const r = PX.profRec(key, base);
    if (!r.dob) {
      const h = H(key + kind), y = kind === 's' ? 2005 + h % 5 : 1998 + h % 5;
      Object.assign(r, { dob: y + '-' + String(1 + h % 12).padStart(2, '0') + '-' + String(1 + h % 27).padStart(2, '0'), addr: 'House ' + (1 + h % 90) + ', Road ' + (1 + h % 12) + ', ' + (r.district || DISTS[h % 5]), emName: kind === 's' ? ((base.guardian && base.guardian.name) || 'Guardian') : FM[h % 6] + ' ' + (base.name || '').split(' ').pop(), emPhone: kind === 's' ? ((base.guardian && base.guardian.phone) || '') : '018' + String(10000000 + h % 89999999) });
      if (kind === 's') Object.assign(r, { father: FM[h % 6] + ' ' + (base.name || '').split(' ').pop(), mother: MM[h % 6] + ' ' + (base.name || '').split(' ').pop() });
      else r.nid = nid(key);
    }
    if (kind === 't' && !r.docs) r.docs = [{ k: 'nid', label: 'NID copy', name: 'nid-' + key + '.pdf', st: 'ok' }, { k: 'uni', label: 'University ID card', name: 'university-id-' + key + '.jpg', st: 'ok' }];
    return r;
  };
  const kv = (rows) => `<div class="kv2">${rows.filter(r => r).map(r => `<div><small>${esc(r[0])}</small><b>${esc(r[1] || '—')}</b></div>`).join('')}</div>`;
  const photo = (r, nm) => r.photo ? `<img src="${r.photo}" alt="">` : `<span>${esc((nm || '?').trim().charAt(0))}</span>`;
  const stuData = u => { const r = demo(u.id, 's', u); return { r, pairs: [['Student ID', '#' + u.sid], ['Name', u.name], ['Phone', u.phone], ['Email', u.email], ['Date of birth', r.dob], ['District', u.district], ['Address', r.addr], ['Class / level', u.level], ['Joined', u.joined], ['Father', r.father], ['Mother', r.mother], ['Guardian / emergency', (r.emName || u.guardian.name) + ' · ' + (r.emPhone || u.guardian.phone)], ['Enrolled courses', u.courses.map(c => tt(COURSE(c).title)).join('; ') || '—'], ['Status', u.blocked ? 'Blocked' : 'Active']] }; };
  const tchData = t => { const r = demo(t.id, 't', { name: tt(t.n), phone: t.phone, email: t.id + '@chaatro.com', district: '', inst: tt(t.inst) }), a = DB.payAcc[t.id] || {}, e = PX.teacherEarn(t.id);
    return { r, pairs: [['Teacher ID', '#' + t.pid], ['Name', tt(t.n)], ['Phone', t.phone], ['Email', r.email], ['Date of birth', r.dob], ['NID number', r.nid], ['Institution', tt(t.inst)], ['Department', tt(t.dept || {})], ['Year', tt(t.yr || {})], ['Address', r.addr], ['Emergency contact', r.emName + ' · ' + r.emPhone], ['Documents', r.docs.map(d => d.label + ' (' + d.name + ')').join('; ')], ['Courses', myCourses(t.id).map(c => tt(c.title)).join('; ') || '—'], ['Earning / paid / due', money(e.mine) + ' / ' + money(e.paid) + ' / ' + money(e.due)], ['Payout account', a.wallet ? 'Wallet: ' + a.wallet.type + ' ' + a.wallet.phone : a.bank ? 'Bank: ' + a.bank.bankName : '—'], ['Intro video', t.video || '—'], ['Status', DB.banned[t.id] ? 'Banned' : 'Active']] }; };
  A.profexp = a => {
    const t = a.dataset.kind === 't', o = t ? TEACH(a.dataset.id) : stu(a.dataset.id), d = t ? tchData(o) : stuData(o), nm = t ? tt(o.n) : o.name;
    if (a.dataset.fmt === 'xlsx') XL.save(XL.xlsx([{ name: 'Profile', head: ['Field', 'Value'], rows: d.pairs }]), 'chaatro-profile-' + (t ? o.pid : o.sid) + '.xlsx');
    else XL.pdfKV((t ? 'Teacher' : 'Student') + ' profile — ' + nm, 'Generated ' + stamp(), d.pairs);
  };
  const profModal = (kind, id) => {
    const t = kind === 't', o = t ? TEACH(id) : stu(id), d = t ? tchData(o) : stuData(o), nm = t ? tt(o.n) : o.name, r = d.r;
    const web = t ? `<h4 class="sub">${T('ওয়েব প্রোফাইল (সাইটে যা দেখায়)', 'Web profile (as shown on the site)')}</h4><p class="soft">${esc(tt(o.bio || {}))}</p><p class="soft">${T('বিষয়', 'Subjects')}: ${(o.subs || []).map(s => esc(tt(SUBJECTS.find(x => x.id === s) || {}))).join(', ') || '—'} · <a class="lnk" href="#teacher-${o.id}" target="_blank">${T('পাবলিক পেজ', 'Public page')}</a></p>` : '';
    PX.modal(`${esc(nm)} <small class="idt">#${t ? o.pid : o.sid}</small>`, `<div class="prof"><div class="ph-prev ph-lg">${photo(r, nm)}</div><div><b>${esc(nm)}</b><br><span class="soft">${t ? T('টিচার প্রোফাইল (সিস্টেম)', 'Teacher profile (system)') : T('স্টুডেন্ট প্রোফাইল', 'Student profile')}</span></div></div>` + kv(d.pairs) + web +
      `<div class="btns"><button class="btn btn-p btn-sm" data-pa="profexp" data-kind="${kind}" data-id="${id}" data-fmt="pdf">${ic('download')} PDF</button> <button class="btn btn-o btn-sm" data-pa="profexp" data-kind="${kind}" data-id="${id}" data-fmt="xlsx">${ic('download')} Excel</button> <button class="btn btn-o btn-sm" data-pa="msgto" data-kind="${kind}" data-id="${id}">${ic('chat')} ${T('মেইল / মেসেজ', 'Mail / message')}</button></div>`, true);
  };
  A.profview = a => profModal(a.dataset.kind, a.dataset.id);
  /* স্টুডেন্টের পেমেন্ট রিসিট */
  A.rcpt = a => {
    const p = DB.pays.find(x => x.id === a.dataset.id); if (!p) return; const u = stu(p.sid), c = COURSE(p.cid), t = TEACH(c.teacher);
    XL.receipt({ heading: T('পেমেন্ট রিসিট', 'Payment receipt'), no: 'RCPT-' + p.id.toUpperCase(), date: p.date, lines: [[T('স্টুডেন্ট', 'Student'), u.name + ' (#' + u.sid + ')'], [T('ফোন', 'Phone'), u.phone], [T('কোর্স', 'Course'), tt(c.title) + ' (#' + c.pid + ')'], [T('টিচার', 'Teacher'), tt(t.n)], [T('পেমেন্ট মাধ্যম', 'Payment method'), p.ch === 'cash' ? T('ক্যাশ', 'Cash') : p.ch]], amount: mny(p.amount), status: p.status === 'confirmed' ? T('নিশ্চিত', 'Confirmed') : T('অপেক্ষমাণ', 'Pending'), note: p.status === 'confirmed' ? '' : T('অ্যাডমিন নিশ্চিত করলে পেমেন্ট চূড়ান্ত হবে।', 'Payment is final once admin confirms it.') });
  };
  window.addEventListener('hashchange', () => { if (PX.closeModal) PX.closeModal(); });
  PX.profModal = profModal;
  /* ---------- মেইল / মেসেজ পাঠানো (পপআপ, ফাইলসহ) ---------- */
  DB.outbox = DB.outbox || [];
  const FMAX = 5 * 1048576, FN = 5;
  const kb = b => b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
  const who = (kind, id) => kind === 't' ? (o => ({ name: tt(o.n), email: (PX.profRec(o.id, {}).email) || o.id + '@chaatro.com', phone: o.phone, tag: '#' + o.pid, role: T('টিচার', 'Teacher') }))(TEACH(id)) : (o => ({ name: o.name, email: o.email, phone: o.phone, tag: '#' + o.sid, role: T('স্টুডেন্ট', 'Student') }))(stu(id));
  const hist = (kind, id) => DB.outbox.filter(m => m.kind === kind && m.id === id).slice(0, 4);
  A.msgto = a => {
    const kind = a.dataset.kind, id = a.dataset.id, w = who(kind, id), sender = a.dataset.from || 'a';
    PX.modal(`${T('মেইল / মেসেজ', 'Mail / message')} — ${esc(w.name)} <small class="idt">${esc(w.tag)}</small>`, `<form data-pf="msgsend" data-kind="${kind}" data-id="${id}" data-from="${sender}" class="fgrid">
      <div class="fld full"><div class="seg" role="radiogroup"><label class="seg-i"><input type="radio" name="ch" value="mail" checked data-pc="msgch"> ${ic('mail')} ${T('মেইল', 'Email')} <small>${esc(w.email)}</small></label><label class="seg-i"><input type="radio" name="ch" value="msg" data-pc="msgch"> ${ic('chat')} ${T('মেসেজ (SMS)', 'Message (SMS)')} <small>${esc(w.phone)}</small></label></div></div>
      <div id="mg-subj">${UI.fi({ name: 'subject', label: T('বিষয়', 'Subject') })}</div>
      ${UI.fi({ name: 'body', label: T('বার্তা', 'Message'), rows: 5, req: 1 })}
      <div class="fld full"><label>${T('ফাইল সংযুক্ত করুন (ঐচ্ছিক)', 'Attach files (optional)')}</label><label class="btn btn-o btn-sm upl">${ic('upload')} ${T('ফাইল বাছুন', 'Choose files')}<input type="file" name="files" multiple hidden data-pc="msgfiles"></label><small class="soft" style="display:block">${T('সর্বোচ্চ ৫টি ফাইল, প্রতিটি ৫ এমবি পর্যন্ত', 'Up to 5 files, 5 MB each')}</small><div id="mg-files" class="soft"></div></div>
      <div class="fld full"><small class="err" id="mg-err" role="alert"></small><button class="btn btn-p">${ic('arrow')} ${T('পাঠান', 'Send')}</button></div></form>
      ${hist(kind, id).length ? `<h4 class="sub">${T('সাম্প্রতিক পাঠানো', 'Recently sent')}</h4>${hist(kind, id).map(m => `<div class="row-i"><div><b>${m.ch === 'mail' ? T('মেইল', 'Email') : T('মেসেজ', 'Message')}</b>${m.subject ? ' · ' + esc(m.subject) : ''}<small>${esc(m.body.slice(0, 80))}${m.files.length ? ' · 📎 ' + m.files.length : ''}</small></div><span class="soft">${fd(m.at)}</span></div>`).join('')}` : ''}`, true);
  };
  PX.CHG.msgch = el => { const f = el.form, mail = f.elements.ch.value === 'mail'; document.getElementById('mg-subj').style.display = mail ? '' : 'none'; };
  PX.CHG.msgfiles = el => {
    const fs = [...el.files], box = document.getElementById('mg-files'), er = document.getElementById('mg-err');
    er.textContent = fs.length > FN ? T('সর্বোচ্চ ৫টি ফাইল', 'Maximum 5 files') : (fs.find(x => x.size > FMAX) ? T('"' + fs.find(x => x.size > FMAX).name + '" ৫ এমবির বেশি', '"' + fs.find(x => x.size > FMAX).name + '" is over 5 MB') : '');
    box.innerHTML = fs.map(x => `<div>📎 ${esc(x.name)} <small>(${kb(x.size)})</small></div>`).join('');
  };
  PX.FORMS.msgsend = (f, d) => {
    const er = f.querySelector('#mg-err'), bad = m => { er.textContent = m; }, w = who(f.dataset.kind, f.dataset.id), mail = d.ch === 'mail', fs = [...(f.elements.files.files || [])];
    if (!(d.body || '').trim()) return bad(T('বার্তা লিখুন', 'Write a message'));
    if (mail && !(d.subject || '').trim()) return bad(T('মেইলের বিষয় লিখুন', 'Enter an email subject'));
    if (mail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(w.email || '')) return bad(T('এই ব্যক্তির সঠিক ইমেইল নেই', 'This person has no valid email'));
    if (!mail && !/^\+?\d{10,14}$/.test((w.phone || '').replace(/[\s-]/g, ''))) return bad(T('এই ব্যক্তির সঠিক ফোন নম্বর নেই', 'This person has no valid phone number'));
    if (!mail && fs.length) return bad(T('ফাইল পাঠাতে মেইল বেছে নিন (SMS-এ ফাইল যায় না)', 'Choose Email to send files (SMS cannot carry files)'));
    if (fs.length > FN) return bad(T('সর্বোচ্চ ৫টি ফাইল', 'Maximum 5 files'));
    const big = fs.find(x => x.size > FMAX); if (big) return bad(T('"' + big.name + '" ৫ এমবির বেশি', '"' + big.name + '" is over 5 MB'));
    DB.outbox.unshift({ no: 'ms' + (DB.outbox.length + 1), kind: f.dataset.kind, id: f.dataset.id, to: w.name, addr: mail ? w.email : w.phone, ch: d.ch, subject: mail ? d.subject.trim() : '', body: d.body.trim(), files: fs.map(x => ({ name: x.name, size: x.size })), at: TODAY, from: f.dataset.from });
    PX.closeModal(); PX.toast(mail ? T('মেইল পাঠানো হয়েছে (ডেমো — আসল মেইল যায় না)', 'Email queued (demo — no real email is sent)') : T('মেসেজ পাঠানো হয়েছে (ডেমো)', 'Message sent (demo)'));
  };
})();
