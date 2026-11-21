/* ছাত্র.com পোর্টাল — কোর: মক ডেটাবেজ, শেল, ইউআই হেল্পার, ইভেন্ট।
   এটি ডেমো: সব তথ্য ব্রাউজারের মেমরিতে থাকে, রিফ্রেশ করলে প্রথম অবস্থায় ফিরে যায়। */
(function () {
  'use strict';
  const PX = window.PX = { ACT: {}, FORMS: {}, CHG: {}, sec: { s: {}, t: {}, a: {} }, nav: {}, S: { tab: {}, level: 'super', side: false, cal: { y: 2026, mo: 10 } } };
  const T = (bn, en) => (CH.lang() === 'bn' ? bn : en);
  const n = x => CH.num(x), mny = x => CH.money(x), esc = x => CH.esc(x), fd = d => CH.fdate(d), ic = (a, b) => CH.ic(a, b);
  const H = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  const COURSE = id => CH.byId(COURSES, id);
  const TEACH = id => CH.byId(TEACHERS, id);
  const TODAY = '2026-11-21';
  Object.assign(PX, { T, n, mny, esc, fd, ic, H, COURSE, TEACH, TODAY });

  /* ============ মক ডেটাবেজ ============ */
  const NAMES = ['Tasnim Jahan', 'Arif Hossain', 'Sumaiya Rahman', 'Naim Islam', 'Fatima Akter', 'Rafi Ahmed', 'Mim Sultana', 'Imran Khan', 'Jannat Ferdous', 'Tanvir Rahman', 'Lamia Haque', 'Sakib Hasan'];
  const DISTR = ['Netrokona', 'Kurigram', 'Barishal', 'Rangpur', 'Sylhet', 'Cox\'s Bazar', 'Rajshahi', 'Mymensingh', 'Khulna', 'Dhaka', 'Cumilla', 'Jashore'];
  const LEVELS = ['Admission candidate', 'Class 6', 'Class 7', 'HSC'];
  const crm = NAMES.map((nm, i) => ({
    id: 'u' + (i + 1), sid: 20001 + i, name: nm, phone: '017' + String(10000000 + H(nm) % 89999999), email: 'student' + (i + 1) + '@example.com', district: DISTR[i], level: LEVELS[i % 4],
    joined: '2026-10-' + String(3 + i * 2).padStart(2, '0'), courses: [], notes: [], blocked: false, ref: i % 3 === 0 ? 'TASNIM-7A2K' : '',
    guardian: { name: 'Guardian ' + nm.split(' ')[1], phone: '018' + String(10000000 + H(nm + 'g') % 89999999) },
  }));
  crm[0].courses = ['c06', 'c04', 'c10'];
  crm.slice(1).forEach((u, i) => { [COURSES[(i * 3 + 1) % COURSES.length].id, COURSES[(i * 5 + 3) % COURSES.length].id].forEach(c => { if (!u.courses.includes(c)) u.courses.push(c); }); });
  COURSES.forEach((c, k) => { let cnt = crm.filter(u => u.courses.includes(c.id)).length; for (let j = 1; cnt < 3 && j < crm.length; j++) { const u = crm[(k + j) % crm.length]; if (!u.courses.includes(c.id)) { u.courses.push(c.id); cnt++; } } });

  const pg = (cid, f = 'group') => pricingFor(COURSE(cid))[f];
  const PAYS = []; let pid = 1;
  crm.forEach(u => { if (u.id === 'u1') return; u.courses.forEach(cid => { const k = H(u.id + cid); PAYS.push({ id: 'p' + pid++, sid: u.id, cid, amount: pg(cid).perD, ch: ['cash', 'bkash', 'ssl'][k % 3], status: k % 9 === 0 ? 'pending' : 'confirmed', date: '2026-11-' + String(1 + k % 20).padStart(2, '0'), note: '' }); }); });
  PAYS.push({ id: 'p' + pid++, sid: 'u1', cid: 'c06', amount: pg('c06').perD, ch: 'cash', status: 'confirmed', date: '2026-10-30', note: '' });
  PAYS.push({ id: 'p' + pid++, sid: 'u1', cid: 'c04', amount: pg('c04').perD, ch: 'cash', status: 'confirmed', date: '2026-10-25', note: '' });
  PAYS.push({ id: 'p' + pid++, sid: 'u1', cid: 'c10', amount: pg('c10').fullD, ch: 'cash', status: 'confirmed', date: '2026-11-02', note: '' });

  const DB = PX.DB = {
    me: crm[0], crm, pays: PAYS, nextPid: pid,
    enr: [
      { id: 'e1', cid: 'c06', fmt: 'group', plan: 'month', m: 1, per: pg('c06').perD, cycles: 2, paid: 1, nextDue: '2026-11-30', state: 'active' },
      { id: 'e2', cid: 'c04', fmt: 'group', plan: 'month', m: 1, per: pg('c04').perD, cycles: 3, paid: 1, nextDue: '2026-11-20', state: 'overdue' },
      { id: 'e3', cid: 'c10', fmt: 'group', plan: 'full', m: 0, per: pg('c10').fullD, cycles: 1, paid: 1, nextDue: null, state: 'active' },
    ],
    free: [
      { id: 'f1', title: 'Cadet Admission Orientation', by: 't07', lessons: 6, hrs: 3, d: 'A starter course on the exam format, syllabus and a preparation routine.' },
      { id: 'f2', title: 'English Grammar Basics', by: 't06', lessons: 8, hrs: 4, d: 'Tense, voice and narration with simple examples.' },
      { id: 'f3', title: 'Mental Math & Tricks (Basic)', by: 't01', lessons: 5, hrs: 2, d: 'A few techniques for quick calculation.' },
      { id: 'f4', title: 'Bangla Spelling: Easy Rules', by: 't02', lessons: 6, hrs: 3, d: 'The key rules of standard spelling.' },
    ],
    freeIn: [],
    sess: {}, blocked: [], att: {}, reviews: [], quizzes: [], scores: {}, extra: {}, recs: {}, files: {}, chats: {}, posts: [],
    resched: [{ id: 'rq1', sid: 'c04-20261123', cid: 'c04', tid: 't01', curDate: '2026-11-23', curTime: '8:00 PM', newDate: '2026-11-25', newTime: '9:00 PM', alt2Date: '2026-11-26', alt2Time: '8:30 PM', reason: 'Teacher has an academic exam', status: 'pending', date: '2026-11-20' }],
    announcements: [
      { id: 'an1', title: 'New crash course batches start in December', body: 'New batches for DU Ka, Kha, Ga, Gha units, BUP and BUET start in the first two weeks of December.', aud: 'all', active: true, date: '2026-11-19' },
      { id: 'an2', title: 'Monthly subscription reminder', body: 'Students on a monthly plan get a subscription reminder on the last day of each month. With dues pending, you cannot join the next class.', aud: 'student', active: true, date: '2026-11-18' },
      { id: 'an3', title: 'Class schedule changes need admin approval', body: 'When a teacher sends a schedule change request it takes effect only after admin approval. If a class will not run, block it in advance.', aud: 'teacher', active: true, date: '2026-11-17' },
    ],
    policies: [
      { id: 'pl1', title: 'Payment Policy', aud: ['student'], body: 'The full course fee can be paid at once or on the teacher\'s plan (every 1, 3, 6 or 12 months). With dues on a monthly plan, access to the next class is blocked. (Draft)', date: '2026-11-14' },
      { id: 'pl2', title: 'Refund & Return Policy', aud: ['student'], body: 'Refund conditions and timelines will be published here once finalised. (Draft)', date: '2026-11-14' },
      { id: 'pl3', title: 'Terms of Use', aud: ['student', 'teacher'], body: 'Classes are live and online. Students can watch important recordings when the teacher uploads them separately. (Draft)', date: '2026-11-14' },
      { id: 'pl4', title: 'Code of Conduct', aud: ['student', 'teacher'], body: 'Everyone must behave respectfully in class. Stricter conduct rules will be added here once finalised. (Draft)', date: '2026-11-14' },
      { id: 'pl5', title: 'Teacher Recruitment Policy', aud: ['teacher'], body: 'The steps for application, document verification, admin approval, profile publishing and course approval will be listed here. Updated once strict terms are finalised. (Draft)', date: '2026-11-14' },
      { id: 'pl6', title: 'Payout & Earnings Policy', aud: ['teacher'], body: 'Teacher and company share rates and the payout schedule will be published here once finalised. (Draft)', date: '2026-11-14' },
      { id: 'pl7', title: 'Privacy Policy', aud: ['student', 'teacher'], body: 'Your information is used only to run your account, classes and payments. (Draft)', date: '2026-11-14' },
    ],
    newCourses: [
      { id: 'n1', tid: 't01', title: 'Cadet Admission — Advanced Mathematics', program: 'cadet', subject: 'math', kind: 'regular', weeks: 12, cpw: 3, days: ['sun', 'tue', 'thu'], time: '9:00 PM', formats: ['group', 'one'], status: 'review', date: '2026-11-19', video: 'https://youtube.com/', desc: 'A separate advanced batch for harder maths.', plans: { group: [{ key: 'full', m: 0, actual: 3200, disc: 2800 }, { key: 'm1', m: 1, actual: 1200, disc: 1050, first: 800 }], one: [{ key: 'full', m: 0, actual: 8600, disc: 7800 }] } },
      { id: 'n2', tid: 't06', title: 'DU Ka Unit — English Focus', program: 'du-ka', subject: 'english', kind: 'regular', weeks: 8, cpw: 2, days: ['mon', 'thu'], time: '8:00 PM', formats: ['group'], status: 'review', date: '2026-11-20', video: 'https://youtube.com/', desc: 'A separate preparation batch for the English section.', plans: { group: [{ key: 'full', m: 0, actual: 3000, disc: 2600 }] } },
      { id: 'n3', tid: 't01', title: 'BUET Admission — Physics & Maths Mix', program: 'buet', subject: 'math', kind: 'crash', weeks: 8, cpw: 2, days: ['fri', 'sun'], time: '10:00 AM', formats: ['group'], status: 'draft', date: '2026-11-21', video: '', desc: '', plans: { group: [{ key: 'full', m: 0, actual: 4800, disc: 4200 }] } },
    ],
    apps: [
      { id: 'ap1', name: 'Riyad Hasan', inst: 'BUET', dept: 'Mechanical Engineering', year: '3rd year', subjects: ['math'], phone: '01711000111', email: 'riyad@example.com', district: 'Dhaka', date: '2026-11-18', status: 'pending', badges: { id: false, pay: false, doc: false }, docs: [['CV', 'riyad-cv.pdf', '210 KB'], ['ID', 'buet-id.jpg', '480 KB'], ['Certificate', 'hsc-cert.pdf', '320 KB']], note: '' },
      { id: 'ap2', name: 'Mahmuda Khatun', inst: 'University of Dhaka', dept: 'Department of English', year: '4th year', subjects: ['english'], phone: '01722000222', email: 'mahmuda@example.com', district: 'Rajshahi', date: '2026-11-19', status: 'pending', badges: { id: false, pay: false, doc: false }, docs: [['CV', 'mahmuda-cv.pdf', '190 KB'], ['ID', 'du-id.png', '510 KB']], note: '' },
      { id: 'ap3', name: 'Asif Iqbal', inst: 'Jahangirnagar University', dept: 'Department of Mathematics', year: '3rd year', subjects: ['math'], phone: '01733000333', email: 'asif@example.com', district: 'Savar', date: '2026-11-08', status: 'approved', badges: { id: true, pay: true, doc: true }, docs: [['CV', 'asif-cv.pdf', '200 KB'], ['ID', 'ju-id.jpg', '450 KB'], ['Certificate', 'ssc-cert.pdf', '280 KB']], note: 'Documents are in order.' },
      { id: 'ap4', name: 'Shahriar Nafiz', inst: 'Other', dept: 'Commerce', year: 'Graduate', subjects: ['gk'], phone: '01744000444', email: 'shahriar@example.com', district: 'Chattogram', date: '2026-11-05', status: 'rejected', badges: { id: false, pay: false, doc: false }, docs: [['CV', 'cv.pdf', '150 KB']], note: 'ID document not submitted.' },
    ],
    banned: {}, payouts: [{ id: 'po1', tid: 't01', amount: 6000, date: '2026-11-10', note: 'October payout' }, { id: 'po2', tid: 't05', amount: 5000, date: '2026-11-10', note: 'October payout' }],
    settings: { share: 30, shareTid: {}, channels: { ssl: false, bkash: false, cash: true }, refS: { type: 'pct', v: 5 }, refT: { type: 'fixed', v: 500 }, reminderDay: 'last' },
    classTypes: CTYPES,
    coupons: [
      { code: 'CHAATRO10', type: 'pct', v: 10, scope: '', by: 'admin', active: true, uses: 14, limit: 200, expiry: '2026-12-31' },
      { code: 'FIRST200', type: 'flat', v: 200, scope: '', by: 'admin', active: true, uses: 9, limit: 100, expiry: '2026-12-31' },
      { code: 'TANVIR15', type: 'pct', v: 15, scope: 'c04', by: 't01', active: true, uses: 3, limit: 30, expiry: '2026-12-15' },
    ],
    refS: [{ name: 'Imran Khan', date: '2026-11-05', status: 'enrolled', bonus: 200 }, { name: 'Lamia Haque', date: '2026-11-11', status: 'enrolled', bonus: 200 }, { name: 'Sakib Hasan', date: '2026-11-16', status: 'joined', bonus: 0 }],
    refT: [{ name: 'Riyad Hasan', date: '2026-11-18', status: 'applied', bonus: 0 }, { name: 'Asif Iqbal', date: '2026-11-08', status: 'approved', bonus: 500 }],
    tickets: [
      { id: 'tk1', by: 's', uid: 'u1', name: 'Tasnim Jahan', cat: 'Payment', subject: 'Need a receipt for my cash payment', status: 'progress', date: '2026-11-19', msgs: [{ from: 'u', text: 'I paid cash on 25 October but did not receive a receipt.', at: '2026-11-19' }, { from: 's', text: 'We have informed the accounts team; the receipt will be sent shortly.', at: '2026-11-20' }] },
      { id: 'tk2', by: 't', uid: 't01', name: 'Tanvir Ahmed', cat: 'Payout', subject: 'Want to know the November payout date', status: 'open', date: '2026-11-20', msgs: [{ from: 'u', text: 'When will the November payout be made?', at: '2026-11-20' }] },
      { id: 'tk3', by: 's', uid: 'u4', name: 'Naim Islam', cat: 'Class', subject: 'Join link is not working', status: 'closed', date: '2026-11-12', msgs: [{ from: 'u', text: 'I cannot enter through the join link.', at: '2026-11-12' }, { from: 's', text: 'The link has been fixed.', at: '2026-11-12' }] },
    ],
    employees: [
      { id: 'em1', name: 'Sobuj K Mandal', role: 'CEO', level: 'super', email: 'ceo@example.com', active: true },
      { id: 'em2', name: 'Rajib Islam', role: 'Accounts', level: 'accounts', email: 'accounts@example.com', active: true },
      { id: 'em3', name: 'Mita Das', role: 'Academic Coordinator', level: 'academic', email: 'academic@example.com', active: true },
      { id: 'em4', name: 'Sadil Ahmed', role: 'Developer', level: 'dev', email: 'dev@example.com', active: true },
    ],
    levels: {
      super: { label: 'Super Admin', perms: { applications: 1, teachers: 1, courses: 1, students: 1, payments: 1, payouts: 1, subs: 1, schedule: 1, content: 1, pricing: 1, support: 1, policies: 1, staff: 1, reviews: 1, settings: 1 } },
      accounts: { label: 'Accounts', perms: { applications: 0, teachers: 0, courses: 0, students: 1, payments: 1, payouts: 1, subs: 1, schedule: 0, content: 0, pricing: 0, support: 1, policies: 0, staff: 0, reviews: 0, settings: 0 } },
      academic: { label: 'Academic', perms: { applications: 1, teachers: 1, courses: 1, students: 1, payments: 0, payouts: 0, subs: 0, schedule: 1, content: 0, pricing: 0, support: 1, policies: 0, staff: 0, reviews: 1, settings: 0 } },
      dev: { label: 'Development', perms: { applications: 0, teachers: 0, courses: 0, students: 0, payments: 0, payouts: 0, subs: 0, schedule: 0, content: 1, pricing: 1, support: 0, policies: 1, staff: 0, reviews: 0, settings: 1 } },
    },
    featured: { courses: COURSES.filter(c => c.featured).map(c => c.id), teachers: ['t01', 't02', 't08'] },
    off: {}, notes: {},
  };

  /* কুইজ ব্যাংক */
  PX.QB = {
    math: [['১২ এর ২৫% কত?', ['২', '৩', '৪', '৬'], 1], ['আয়তের দৈর্ঘ্য ৮ ও প্রস্থ ৫ হলে ক্ষেত্রফল কত?', ['১৩', '২৬', '৪০', '৪৫'], 2], ['x + 7 = 15 হলে x = ?', ['৬', '৭', '৮', '৯'], 2], ['৫০ এর ৪০% কত?', ['১০', '২০', '২৫', '৩০'], 1]],
    bangla: [['‘বিদ্যালয়’ শব্দের সন্ধি বিচ্ছেদ কোনটি?', ['বিদ্যা + আলয়', 'বিদ্য + আলয়', 'বিদ + আলয়', 'বিদ্যা + লয়'], 0], ['‘অগ্নিবীণা’ কাব্যের রচয়িতা কে?', ['রবীন্দ্রনাথ ঠাকুর', 'কাজী নজরুল ইসলাম', 'জীবনানন্দ দাশ', 'সুকান্ত ভট্টাচার্য'], 1], ['‘ঊষা’ শব্দের বিপরীত শব্দ কোনটি?', ['সন্ধ্যা', 'প্রভাত', 'রাত', 'দুপুর'], 0], ['বাংলা বর্ণমালায় স্বরবর্ণ কয়টি?', ['৯', '১০', '১১', '১২'], 2]],
    english: [['She ___ to school every day.', ['go', 'goes', 'going', 'gone'], 1], ['Synonym of "rapid":', ['slow', 'quick', 'weak', 'late'], 1], ['Antonym of "ancient":', ['old', 'modern', 'huge', 'tiny'], 1], ['He has lived here ___ 2020.', ['for', 'since', 'from', 'by'], 1]],
    gk: [['বাংলাদেশের রাজধানী কোনটি?', ['Chattogram', 'Dhaka', 'Sylhet', 'Rajshahi'], 1], ['বাংলাদেশের জাতীয় ফুল কোনটি?', ['গোলাপ', 'শাপলা', 'জবা', 'বেলি'], 1], ['বাংলাদেশ স্বাধীন হয় কত সালে?', ['১৯৭০', '১৯৭১', '১৯৭২', '১৯৭৩'], 1], ['পানির রাসায়নিক সংকেত কী?', ['CO₂', 'H₂O', 'O₂', 'NaCl'], 1]],
  };
  PX.QB.combined = [PX.QB.math[0], PX.QB.bangla[1], PX.QB.english[1], PX.QB.gk[1]];

  /* সেশন তৈরি */
  const DM = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
  PX.sessions = cid => {
    if (DB.sess[cid]) return DB.sess[cid];
    const c = COURSE(cid), out = [], tp = TOPICS[c.kind === 'crash' ? 'crash' : c.subject] || TOPICS.combined;
    let i = 0;
    for (let d = new Date('2026-10-24T00:00:00Z'); d <= new Date('2027-01-10T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      if (c.days.some(x => DM[x] === d.getUTCDay())) { const t = tp[i % tp.length]; out.push({ id: cid + '-' + key.replace(/-/g, ''), cid, date: key, time: CH.L(c.time), topic: t.t, sub: t.p, n: i + 1, notes: [] }); i++; }
    }
    out.forEach(s => { if (s.date < TODAY) s.notes = [{ name: 'ক্লাস নোট — ' + s.topic.bn + '.pdf', size: 180 + H(s.id) % 400 }, ...(H(s.id) % 3 === 0 ? [{ name: 'অনুশীলনী ও সমাধান.pdf', size: 120 + H(s.id) % 200 }] : [])]; });
    return (DB.sess[cid] = out);
  };
  PX.session = id => { const cid = id.split('-')[0]; return PX.sessions(cid).find(s => s.id === id); };
  PX.sstate = s => (DB.blocked.some(b => b.sid === s.id) ? 'cancelled' : s.date < TODAY ? 'done' : s.date === TODAY ? 'today' : 'upcoming');
  PX.roster = cid => crm.filter(u => u.courses.includes(cid));
  PX.attOf = (sid, uid) => { const m = DB.att[sid]; if (m && uid in m) return m[uid]; return H(sid + uid) % 6 !== 0; };
  PX.attPct = (cid, uid) => { const l = PX.sessions(cid).filter(s => PX.sstate(s) === 'done'); if (!l.length) return 100; return Math.round(100 * l.filter(s => PX.attOf(s.id, uid)).length / l.length); };
  PX.points = (cid, uid) => 55 + H(cid + uid) % 40 + ((DB.extra[cid] || {})[uid] || 0);
  PX.board = cid => PX.roster(cid).map(u => ({ u, p: PX.points(cid, u.id) })).sort((a, b) => b.p - a.p);
  PX.myEnr = cid => DB.enr.find(e => e.cid === cid);
  PX.files = cid => DB.files[cid] || (DB.files[cid] = [{ id: 'f' + cid + '1', name: 'কোর্স সিলেবাস.pdf', size: 320, by: COURSE(cid) ? TEACH(COURSE(cid).teacher).n.bn : '', role: 't', date: '2026-10-28' }, { id: 'f' + cid + '2', name: 'সূত্র ও টিপস.pdf', size: 210, by: TEACH(COURSE(cid).teacher).n.bn, role: 't', date: '2026-11-04' }]);
  PX.chat = cid => DB.chats[cid] || (DB.chats[cid] = (() => { const tc = TEACH(COURSE(cid).teacher), r = PX.roster(cid); return [{ from: tc.n.bn, role: 't', text: 'সবাইকে স্বাগতম! এই গ্রুপে প্রশ্ন ও ফাইল শেয়ার করতে পারবে।', at: '২৮ অক্টোবর' }, { from: (r[1] || r[0]).name, role: 's', text: 'ধন্যবাদ স্যার/ম্যাম, আজকের ক্লাসের নোট কি পাওয়া যাবে?', at: '৪ নভেম্বর' }, { from: tc.n.bn, role: 't', text: 'হ্যাঁ, ক্লাস নোট ফাইল সেকশনে দিয়ে দিয়েছি।', at: '৪ নভেম্বর' }]; })());
  PX.posts = cid => { if (!DB.posts.some(p => p.cid === cid)) { const tc = TEACH(COURSE(cid).teacher); DB.posts.push({ id: 'po' + cid + 1, cid, type: 'announcement', title: 'Weekly test schedule', body: 'A short test will be held this week. Please revise the topics from earlier classes.', files: ['schedule.pdf'], date: '2026-11-15', by: tc.n.bn }, { id: 'po' + cid + 2, cid, type: 'result', title: 'Model test results', body: 'Results of the last model test are attached. Questions answered wrongly will be discussed in class.', files: ['results.pdf'], date: '2026-11-18', by: tc.n.bn }); } return DB.posts.filter(p => p.cid === cid).sort((a, b) => b.date.localeCompare(a.date)); };
  PX.quizzesOf = cid => { if (!DB.quizzes.some(q => q.cid === cid)) { const c = COURSE(cid), nx = PX.sessions(cid).find(s => s.date > TODAY); DB.quizzes.push({ id: 'q' + cid + 1, cid, title: 'সাপ্তাহিক কুইজ ১', date: nx ? nx.date : '2026-11-27', dur: 15, type: c.subject, done: false }, { id: 'q' + cid + 0, cid, title: 'পূর্ববর্তী কুইজ', date: '2026-11-14', dur: 15, type: c.subject, done: true }); } return DB.quizzes.filter(q => q.cid === cid).sort((a, b) => a.date.localeCompare(b.date)); };
  PX.recs = cid => DB.recs[cid] || (DB.recs[cid] = [{ id: 'r' + cid + 1, title: 'গুরুত্বপূর্ণ রিভিশন: ' + (TOPICS[COURSE(cid).kind === 'crash' ? 'crash' : COURSE(cid).subject] || TOPICS.combined)[0].t.bn, dur: '৪২ মিনিট', date: '2026-11-10' }, { id: 'r' + cid + 2, title: 'মডেল টেস্ট ব্যাখ্যা (বাছাই করা অংশ)', dur: '৫৫ মিনিট', date: '2026-11-16' }]);
  PX.teacherEarn = tid => {
    const cs = COURSES.filter(c => c.teacher === tid).map(c => c.id);
    const gross = DB.pays.filter(p => p.status === 'confirmed' && cs.includes(p.cid)).reduce((s, p) => s + p.amount, 0);
    const sh = tid in DB.settings.shareTid ? DB.settings.shareTid[tid] : DB.settings.share;
    const paid = DB.payouts.filter(p => p.tid === tid).reduce((s, p) => s + p.amount, 0);
    const mine = Math.round(gross * (100 - sh) / 100);
    return { gross, share: sh, company: gross - mine, mine, paid, due: Math.max(0, mine - paid) };
  };

  /* ============ ইউআই হেল্পার ============ */
  const UI = PX.ui = {};
  UI.card = (title, body, extra = '', cls = '') => `<section class="pc ${cls}">${title || extra ? `<header><h3>${title || ''}</h3>${extra}</header>` : ''}<div class="pc-b">${body}</div></section>`;
  UI.kpi = (label, val, sub = '', tone = '') => `<div class="kpi ${tone}"><small>${label}</small><b>${val}</b>${sub ? `<span>${sub}</span>` : ''}</div>`;
  UI.chip = (txt, kind = '') => `<span class="pchip ${kind}">${txt}</span>`;
  UI.empty = m => `<p class="pempty">${m}</p>`;
  UI.tbl = (heads, rows) => `<div class="tbl-w"><table class="ptbl"><thead><tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${heads.length}">${UI.empty(T('কিছু নেই', 'Nothing here'))}</td></tr>`}</tbody></table></div>`;
  UI.tabs = (key, list, cur) => `<div class="ptabs" role="tablist">${list.map(x => `<button role="tab" aria-selected="${x[0] === cur}" data-pa="tab" data-k="${key}" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>`;
  UI.btn = (txt, act, attrs = '', cls = 'btn-o btn-sm') => `<button class="btn ${cls}" data-pa="${act}" ${attrs}>${txt}</button>`;
  UI.fi = o => {
    const id = 'pf-' + o.name, req = o.req ? 'required' : '', lab = `<label for="${id}">${o.label}${o.req ? '<b class="rq"> *</b>' : ''}</label>`;
    let inp;
    if (o.opts) inp = `<select id="${id}" name="${o.name}" ${req}>${o.opts.map(x => `<option value="${x[0]}"${String(x[0]) === String(o.val == null ? '' : o.val) ? ' selected' : ''}>${esc(x[1])}</option>`).join('')}</select>`;
    else if (o.rows) inp = `<textarea id="${id}" name="${o.name}" rows="${o.rows}" ${req} placeholder="${esc(o.ph || '')}">${esc(o.val || '')}</textarea>`;
    else inp = `<input id="${id}" name="${o.name}" type="${o.type || 'text'}" ${req} value="${esc(o.val == null ? '' : o.val)}" placeholder="${esc(o.ph || '')}" ${o.min != null ? `min="${o.min}"` : ''} autocomplete="off">`;
    return `<div class="fld ${o.half ? 'half' : ''}">${lab}${inp}${o.hint ? `<small class="hint">${o.hint}</small>` : ''}</div>`;
  };
  UI.checks = (name, items, sel = [], label = '') => `<fieldset class="fld cks"><legend>${label}</legend><div class="ck-g">${items.map(x => `<label class="ck"><input type="checkbox" name="${name}" value="${x[0]}" ${sel.includes(x[0]) ? 'checked' : ''}><span>${esc(x[1])}</span></label>`).join('')}</div></fieldset>`;
  UI.stars = (k, v = 0) => `<div class="starin" role="radiogroup">${[5, 4, 3, 2, 1].map(i => `<input type="radio" id="${k}${i}" name="${k}" value="${i}" ${v === i ? 'checked' : ''} data-pc="rate"><label for="${k}${i}" title="${i}">${CH.ic('award')}</label>`).join('')}</div>`;
  UI.dayName = i => [T('শনি', 'Sat'), T('রবি', 'Sun'), T('সোম', 'Mon'), T('মঙ্গল', 'Tue'), T('বুধ', 'Wed'), T('বৃহ', 'Thu'), T('শুক্র', 'Fri')][i];
  UI.sizeTxt = k => (k > 1024 ? n((k / 1024).toFixed(1)) + ' MB' : n(k) + ' KB');
  UI.stChip = s => ({ active: UI.chip(T('চালু', 'Active'), 'ok'), overdue: UI.chip(T('বকেয়া', 'Overdue'), 'bad'), pending: UI.chip(T('অপেক্ষমাণ', 'Pending'), 'warn'), confirmed: UI.chip(T('নিশ্চিত', 'Confirmed'), 'ok'), review: UI.chip(T('অনুমোদনের অপেক্ষায়', 'In review'), 'warn'), live: UI.chip(T('লাইভ', 'Live'), 'ok'), draft: UI.chip(T('খসড়া', 'Draft'), ''), rejected: UI.chip(T('বাতিল', 'Rejected'), 'bad'), approved: UI.chip(T('অনুমোদিত', 'Approved'), 'ok'), open: UI.chip(T('খোলা', 'Open'), 'warn'), progress: UI.chip(T('চলমান', 'In progress'), 'info'), closed: UI.chip(T('সমাধান', 'Closed'), 'ok'), cancelled: UI.chip(T('বাতিল', 'Cancelled'), 'bad'), done: UI.chip(T('সম্পন্ন', 'Done'), ''), today: UI.chip(T('আজ', 'Today'), 'info'), upcoming: UI.chip(T('আসন্ন', 'Upcoming'), 'info'), off: UI.chip(T('বন্ধ', 'Off'), '') }[s] || UI.chip(s));
  UI.announcements = aud => {
    const l = DB.announcements.filter(a => a.active && (a.aud === 'all' || a.aud === aud));
    return l.length ? `<div class="banners">${l.map(a => `<div class="banner-a">${ic('chat')}<div><b>${esc(a.title)}</b><p>${esc(a.body)}</p></div></div>`).join('')}</div>` : '';
  };
  UI.sessLine = s => { const c = COURSE(s.cid), st = PX.sstate(s); return `${esc(c.title.bn)} · ${fd(s.date)} · ${esc(s.time)}`; };

  PX.modal = (title, html, wide) => {
    PX.closeModal();
    const m = document.createElement('div'); m.className = 'modal'; m.id = 'pmodal';
    m.innerHTML = `<div class="m-bg" data-pa="close"></div><div class="m-box ${wide ? 'm-wide' : ''}" role="dialog" aria-modal="true" tabindex="-1"><button class="m-x" data-pa="close" aria-label="${T('বন্ধ', 'Close')}">${ic('close')}</button><h3>${title}</h3>${html}</div>`;
    document.body.appendChild(m); document.body.classList.add('noscroll'); m.querySelector('.m-box').focus();
  };
  PX.closeModal = () => { const m = document.getElementById('pmodal'); if (m) m.remove(); document.body.classList.remove('noscroll'); };
  PX.toast = msg => { const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 3200); };
  PX.refresh = () => CH.rerender();

  /* ============ ক্যালেন্ডার ============ */
  PX.calendar = (cids, role) => {
    const m = PX.S.cal, first = new Date(Date.UTC(m.y, m.mo, 1)), lead = (first.getUTCDay() + 1) % 7, dim = new Date(Date.UTC(m.y, m.mo + 1, 0)).getUTCDate();
    const base = role === 's' ? '#s-class-' : '#t-class-', cells = [];
    for (let i = 0; i < lead; i++) cells.push('<div class="cal-c off"></div>');
    for (let d = 1; d <= dim; d++) {
      const key = `${m.y}-${String(m.mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const ss = cids.flatMap(c => PX.sessions(c)).filter(s => s.date === key);
      const qq = cids.flatMap(c => PX.quizzesOf(c)).filter(q => q.date === key);
      cells.push(`<div class="cal-c ${key === TODAY ? 'today' : ''}"><span class="cal-d">${n(d)}</span>${ss.map(s => { const st = PX.sstate(s); return `<a class="cal-e ${st}" href="${base}${s.id}" title="${esc(UI.sessLine(s))}">${esc(COURSE(s.cid).program.toUpperCase().slice(0, 6))} · ${esc(s.time)}</a>`; }).join('')}${qq.map(q => `<span class="cal-e quiz">${T('কুইজ', 'Quiz')}</span>`).join('')}</div>`);
    }
    const label = CH.lang() === 'bn' ? ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'][m.mo] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m.mo];
    return `<div class="cal"><div class="cal-h"><button class="btn btn-o btn-sm" data-pa="calp" aria-label="prev">${ic('left')}</button><b>${label} ${n(m.y)}</b><button class="btn btn-o btn-sm" data-pa="caln" aria-label="next">${ic('right')}</button></div>
      <div class="cal-g">${[0, 1, 2, 3, 4, 5, 6].map(i => `<div class="cal-w">${UI.dayName(i)}</div>`).join('')}${cells.join('')}</div>
      <div class="cal-key"><span class="cal-e upcoming">${T('আসন্ন ক্লাস', 'Upcoming')}</span><span class="cal-e done">${T('সম্পন্ন', 'Done')}</span><span class="cal-e cancelled">${T('বাতিল', 'Cancelled')}</span><span class="cal-e quiz">${T('কুইজ', 'Quiz')}</span></div></div>`;
  };
  PX.ACT.calp = () => { const c = PX.S.cal; c.mo--; if (c.mo < 0) { c.mo = 11; c.y--; } PX.refresh(); };
  PX.ACT.caln = () => { const c = PX.S.cal; c.mo++; if (c.mo > 11) { c.mo = 0; c.y++; } PX.refresh(); };

  /* ============ শেল ও রাউটার ============ */
  const ROLE = { s: { bn: 'স্টুডেন্ট পোর্টাল', en: 'Student portal' }, t: { bn: 'টিচার পোর্টাল', en: 'Teacher portal' }, a: { bn: 'অ্যাডমিন প্যানেল', en: 'Admin panel' } };
  function hub() {
    const c = (r, h, d, i) => `<a class="hub-c" href="${h}">${ic(i)}<b>${T(ROLE[r].bn, ROLE[r].en)}</b><span>${d}</span></a>`;
    return `<div class="hub"><div class="hub-in"><a class="logo" href="#home"><img src="img/logo.png" alt="Chaatro.com" width="400" height="120"></a><h1>${T('পোর্টাল বেছে নিন', 'Choose a portal')}</h1><p>${T('ডেমো: লগইন ছাড়াই তিনটি পোর্টাল ঘুরে দেখুন।', 'Demo: explore the three portals without logging in.')}</p>
      <div class="hub-g">${c('s', '#s-home', T('কোর্স, লাইভ ক্লাস, কুইজ, পেমেন্ট ও রেফারেল', 'Courses, live classes, quizzes, payments and referrals'), 'user')}${c('t', '#t-home', T('কোর্স তৈরি, শিডিউল, অ্যাটেন্ডেন্স ও আয়', 'Create courses, schedule, attendance and earnings'), 'award')}${c('a', '#a-home', T('অ্যাপ্রুভাল, CRM, পেমেন্ট, কনটেন্ট ও পলিসি', 'Approvals, CRM, payments, content and policies'), 'shield')}</div>
      <a class="btn btn-o" href="#home">${T('সাইটে ফিরুন', 'Back to site')}</a></div></div>`;
  }
  /* কুপনের প্রযোজ্যতা: '' = সব কোর্স, 't:<টিচার>' = ওই টিচারের সব কোর্স, অন্যথায় নির্দিষ্ট কোর্স */
  PX.scopeLabel = s => { if (!s) return T('সব কোর্স', 'All courses'); if (s === 'bundles') return T('সব বান্ডেল কোর্স', 'All bundles'); if (s.startsWith('b:')) { const b = CH.byId(BUNDLES, s.slice(2)); return T('বান্ডেল: ', 'Bundle: ') + (b ? CH.L(b.title) : s.slice(2)); } if (s.startsWith('t:')) { const t = TEACH(s.slice(2)); return T('সব কোর্স: ', 'All courses: ') + (t ? CH.L(t.n) : s.slice(2)); } const c = COURSE(s) || COURSE(s + '-1on1'); return c ? CH.L(c.title) : s; };
  PX.scopeOpts = tid => tid
    ? [['t:' + tid, T('আমার সব কোর্স', 'All my courses')]].concat(COURSES.filter(c => c.teacher === tid).map(c => [c.id, CH.L(c.title)]))
    : [['', T('সব কোর্স (পুরো সাইট)', 'All courses (whole site)')]].concat(TEACHERS.map(t => ['t:' + t.id, T('সব কোর্স: ', 'All courses: ') + CH.L(t.n)]), COURSES.map(c => [c.id, CH.L(c.title)]), [['bundles', T('সব বান্ডেল কোর্স', 'All bundles')]], BUNDLES.map(b => ['b:' + b.id, T('বান্ডেল: ', 'Bundle: ') + CH.L(b.title)]));
  PX.syncCoupons = () => { Object.keys(COUPONS).forEach(k => { if (!DB.coupons.some(c => c.code === k)) delete COUPONS[k]; }); DB.coupons.forEach(c => { COUPONS[c.code] = Object.assign(COUPONS[c.code] || {}, { type: c.type, v: c.v, scope: c.scope || '', active: c.active, bn: c.type === 'pct' ? CH.num(c.v) + '% ছাড়' : '৳' + CH.num(c.v) + ' ছাড়', en: c.type === 'pct' ? c.v + '% off' : '৳' + c.v + ' off' }); }); };
  PX.view = (role, sec, arg) => {
    PX.syncCoupons();
    if (!role) return hub();
    sec = sec || 'home';
    PX.S.role = role; PX.S.sec = sec; PX.S.arg = arg;
    const secs = PX.sec[role], nav = PX.nav[role]();
    const fn = secs[sec];
    const body = fn ? fn(arg) : UI.card('', UI.empty(T('পেজটি পাওয়া যায়নি', 'Page not found')));
    const cur = nav.find(x => x.k === sec || (x.also || []).includes(sec));
    PX.S.title = cur ? cur.l : '';
    const user = role === 's' ? { n: DB.me.name, av: '' } : role === 't' ? { n: TEACH('t01').n.bn, av: CH.avatar(TEACH('t01'), 32) } : { n: T('অ্যাডমিন', 'Admin'), av: '' };
    const lvSel = role === 'a' ? `<label class="lvsel"><span>${T('অ্যাক্সেস লেভেল (ডেমো)', 'Access level (demo)')}</span><select data-pc="level">${Object.keys(DB.levels).map(k => `<option value="${k}" ${PX.S.level === k ? 'selected' : ''}>${DB.levels[k].label}</option>`).join('')}</select></label>` : '';
    return `<div class="pt pt-${role} ${PX.S.collapsed ? 'pt-collapsed' : ''}"><aside class="pt-side ${PX.S.side ? 'open' : ''}" id="pt-side">
      <a class="pt-logo" href="#home"><img src="img/logo.png" alt="Chaatro.com" width="400" height="120"></a>
      <div class="pt-role">${T(ROLE[role].bn, ROLE[role].en)}</div>
      <nav aria-label="portal">${nav.map(x => `<a href="#${role}-${x.k}" ${x === cur ? 'aria-current="page"' : ''}>${ic(x.i)}<span>${x.l}</span>${x.badge ? `<em>${x.badge}</em>` : ''}</a>`).join('')}</nav>
      <div class="pt-foot"><a href="#portal">${T('পোর্টাল বদলান', 'Switch portal')}</a><a href="#home">${T('সাইটে ফিরুন', 'Back to site')}</a></div></aside>
      <div class="pt-main"><header class="pt-top"><button class="burger pt-burger" data-pa="side" aria-label="menu">${ic('menu')}</button><h1>${esc(PX.S.title)}</h1><div class="pt-tools"><label class="tsrch">${ic('search')}<input type="search" data-rs placeholder="${T('খুঁজুন…', 'Search…')}" autocomplete="off" aria-label="${T('এই পেজের টেবিলে খুঁজুন', 'Search this page')}"></label>${lvSel}<button class="lang" data-act="lang">${ic('globe')}<span>${CH.lang() === 'bn' ? 'EN' : 'বাংলা'}</span></button><span class="pt-user">${user.av || `<span class="av" style="--s:32px;--c:#8C52FF">${esc(user.n.slice(0, 1))}</span>`}<b>${esc(user.n)}</b></span></div></header>
      <div class="pt-body">${body}</div></div>${PX.S.side ? '<div class="pt-scrim" data-pa="side"></div>' : ''}</div>`;
  };
  PX.title = () => PX.S.title || '';
  PX.after = () => {
    const log = document.querySelector('.chat-log'); if (log) log.scrollTop = log.scrollHeight;
    if (PX.S.focusChat) { const i = document.getElementById('chat-in'); if (i) i.focus(); PX.S.focusChat = false; }
  };

  /* ============ ইভেন্ট ============ */
  const fdata = f => {
    const o = {};
    Array.from(f.elements).forEach(el => {
      if (!el.name) return;
      if (el.type === 'checkbox') { (o[el.name] = o[el.name] || []); if (el.checked) o[el.name].push(el.value); }
      else if (el.type === 'radio') { if (el.checked) o[el.name] = el.value; }
      else if (el.type === 'file') o[el.name] = Array.from(el.files || []).map(x => ({ name: x.name, size: Math.max(1, Math.round(x.size / 1024)) }));
      else o[el.name] = el.value;
    });
    return o;
  };
  PX.fdata = fdata;
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-pa]'); if (!a) return;
    const fn = PX.ACT[a.dataset.pa];
    if (fn) { e.preventDefault(); fn(a, e); }
  });
  document.addEventListener('submit', e => {
    const f = e.target.closest('form[data-pf]'); if (!f) return;
    e.preventDefault();
    const fn = PX.FORMS[f.dataset.pf]; if (fn) fn(f, fdata(f));
  });
  document.addEventListener('input', e => { const el = e.target.closest && e.target.closest('[data-pi]'); if (el && PX.CHG[el.dataset.pi]) PX.CHG[el.dataset.pi](el); });
  document.addEventListener('change', e => {
    const el = e.target.closest('[data-pc]'); if (!el) return;
    const fn = PX.CHG[el.dataset.pc]; if (fn) fn(el, e);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') PX.closeModal(); });
  Object.assign(PX.ACT, {
    close: () => PX.closeModal(),
    side: () => { if (window.innerWidth > 900) PX.S.collapsed = !PX.S.collapsed; else PX.S.side = !PX.S.side; PX.refresh(); },
    tab: a => { PX.S.tab[a.dataset.k] = a.dataset.v; PX.refresh(); },
    go: a => { PX.closeModal(); location.hash = a.dataset.h; },
  });
  PX.CHG.level = el => { PX.S.level = el.value; const ok = PX.nav.a().some(x => x.k === PX.S.sec || (x.also || []).includes(PX.S.sec)); if (!ok) location.hash = '#a-home'; else PX.refresh(); };
  PX.CHG.rate = el => { const box = document.querySelector('.issues'); if (box) box.hidden = +el.value > 3; };
  PX.CHG.upfile = el => {
    const cid = el.dataset.cid, role = el.dataset.role;
    Array.from(el.files).forEach(f => PX.files(cid).unshift({ id: 'f' + Date.now() + Math.random(), name: f.name, size: Math.max(1, Math.round(f.size / 1024)), by: role === 't' ? TEACH('t01').n.bn : DB.me.name, role, date: TODAY }));
    el.value = ''; PX.toast(T('ফাইল শেয়ার হয়েছে', 'File shared')); PX.refresh();
  };
})();
