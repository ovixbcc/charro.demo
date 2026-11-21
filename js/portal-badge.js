/* ব্যাজ: অ্যাডমিন সেটিংসে তৈরি/কাস্টমাইজ; শর্ত (মাইলস্টোন) পূরণ হলেই টিচার ও স্টুডেন্টের কাছে নিজে থেকে অ্যাসাইন হয় */
(function () {
  const PX = window.PX, { T, n, esc, ic } = PX, DB = PX.DB, UI = PX.ui;
  const TID = 't01';
  const MET = {
    student: [['courses', 'এনরোল করা কোর্স', 'Courses enrolled', 'courses'], ['quizzes', 'দেওয়া কুইজ', 'Quizzes taken', 'quizzes'], ['reviews', 'দেওয়া রিভিউ', 'Reviews given', 'reviews'], ['blogs', 'প্রকাশিত ব্লগ', 'Blogs published', 'blogs']],
    teacher: [['students', 'মোট স্টুডেন্ট', 'Total students', 'students'], ['rating', 'গড় রেটিং', 'Average rating', 'points'], ['exp', 'অভিজ্ঞতা (বছর)', 'Experience (years)', 'years'], ['courses', 'প্রকাশিত কোর্স', 'Courses published', 'courses'], ['reviews', 'পাওয়া রিভিউ', 'Reviews received', 'reviews'], ['blogs', 'প্রকাশিত ব্লগ', 'Blogs published', 'blogs']],
  };
  const ICONS = {
    star: '<path d="M12 5l2.1 4.4 4.9.6-3.6 3.4.9 4.8L12 15.8 7.7 18.2l.9-4.8L5 10l4.9-.6z" fill="#fff"/>',
    trophy: '<path d="M8 6h8v4a4 4 0 01-8 0zM8 7H5.5a2.5 2.5 0 002.5 3M16 7h2.5A2.5 2.5 0 0116 10M12 14v3M9 18h6" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
    book: '<path d="M6 6.5C8 5.5 10 5.6 12 7c2-1.4 4-1.5 6-.5V17c-2-1-4-.9-6 .5-2-1.4-4-1.5-6-.5z M12 7v10.5" stroke="#fff" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',
    heart: '<path d="M12 18s-5.5-3.4-5.5-7.2A3 3 0 0112 9a3 3 0 015.5 1.8C17.5 14.6 12 18 12 18z" fill="#fff"/>',
    bolt: '<path d="M13 5l-5 8h3.5L10.5 19l5.5-8h-3.6z" fill="#fff"/>',
    crown: '<path d="M6 16l-1-7 4 3 3-5 3 5 4-3-1 7z" fill="#fff"/>',
  };
  DB.badges = DB.badges || [
    { id: 'bd1', aud: 'student', name: 'First Step', desc: 'Enrolled in the first course', metric: 'courses', target: 1, color: '#8C52FF', icon: 'star', img: '', on: true },
    { id: 'bd2', aud: 'student', name: 'Multi-Learner', desc: 'Enrolled in 3 courses', metric: 'courses', target: 3, color: '#12907C', icon: 'book', img: '', on: true },
    { id: 'bd3', aud: 'student', name: 'Quiz Champion', desc: 'Took 3 quizzes', metric: 'quizzes', target: 3, color: '#E8590C', icon: 'bolt', img: '', on: true },
    { id: 'bd4', aud: 'teacher', name: '100+ Students', desc: 'Taught over 100 students', metric: 'students', target: 100, color: '#8C52FF', icon: 'crown', img: '', on: true },
    { id: 'bd5', aud: 'teacher', name: 'Top Rated', desc: 'Average rating 4.8 or above', metric: 'rating', target: 4.8, color: '#F59F00', icon: 'trophy', img: '', on: true },
    { id: 'bd6', aud: 'teacher', name: 'Experienced', desc: '3+ years of teaching', metric: 'exp', target: 3, color: '#1C7ED6', icon: 'heart', img: '', on: true },
    { id: 'bd7', aud: 'teacher', name: 'Course Builder', desc: 'Published 3 courses', metric: 'courses', target: 3, color: '#12907C', icon: 'book', img: '', on: true },
  ];
  /* মেট্রিক হিসাব */
  const blogsBy = r => (DB.blogReq || []).filter(x => x.by === r && x.status === 'published').length;
  const val = (aud, m, tc) => {
    if (aud === 'student') return m === 'courses' ? DB.enr.length : m === 'quizzes' ? Object.keys(DB.scores || {}).length : m === 'reviews' ? (DB.reviews || []).length : m === 'blogs' ? blogsBy('s') : 0;
    tc = tc || CH.byId(TEACHERS, TID);
    return m === 'students' ? tc.stu || 0 : m === 'rating' ? tc.rating || 0 : m === 'exp' ? tc.exp || 0 : m === 'courses' ? COURSES.filter(c => c.teacher === tc.id).length : m === 'reviews' ? REVIEWS.filter(r => r.teacher === tc.id).length : m === 'blogs' ? (tc.id === TID ? blogsBy('t') : 0) : 0;
  };
  const mlab = (aud, m) => { const x = MET[aud].find(k => k[0] === m); return x ? T(x[1], x[2]) : m; };
  const rule = b => `${mlab(b.aud, b.metric)} ≥ ${n(b.target)}`;
  const status = (b, tc) => { const v = val(b.aud, b.metric, tc); return { v, ok: v >= b.target, pct: Math.min(100, Math.round(v / b.target * 100)) }; };
  const earnedFor = (aud, tc) => DB.badges.filter(b => b.on && b.aud === aud && status(b, tc).ok);

  /* ব্যাজের ছবি */
  const art = (b, size, locked) => {
    const s = size || 64;
    if (b.img) return `<span class="bdg${locked ? ' lk' : ''}" style="--s:${s}px"><img src="${esc(b.img)}" alt="" loading="lazy"></span>`;
    return `<span class="bdg${locked ? ' lk' : ''}" style="--s:${s}px"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l8.5 3v6.4c0 5.2-3.4 8.9-8.5 11.1-5.1-2.2-8.5-5.9-8.5-11.1V4.5z" fill="${locked ? '#c9ccd3' : esc(b.color)}"/><path d="M12 1.5l8.5 3v6.4c0 5.2-3.4 8.9-8.5 11.1z" fill="#000" opacity=".12"/>${ICONS[b.icon] || ICONS.star}</svg></span>`;
  };
  const tile = (b, st) => `<div class="bdt${st.ok ? '' : ' lk'}">${art(b, 56, !st.ok)}<b>${esc(b.name)}</b><small>${esc(b.desc)}</small>${st.ok ? `<em class="ok">${T('অর্জিত', 'Earned')}</em>` : `<div class="bdp"><i style="width:${st.pct}%"></i></div><small>${n(st.v)} / ${n(b.target)}</small>`}</div>`;
  const myCard = aud => {
    const l = DB.badges.filter(b => b.on && b.aud === aud), got = l.filter(b => status(b).ok).length;
    return UI.card(T('আমার ব্যাজ', 'My badges'), `<p class="soft">${T('শর্ত পূরণ হলে ব্যাজ নিজে থেকেই পেয়ে যাবেন।', 'Badges are awarded automatically when you reach the milestone.')} <b>${n(got)} / ${n(l.length)}</b></p><div class="bdg-grid">${l.map(b => tile(b, status(b))).join('')}</div>`);
  };
  /* পাবলিক টিচার পেজে ছোট স্ট্রিপ */
  window.PXB = { strip: tc => { const l = earnedFor('teacher', tc); return l.length ? `<div class="bdg-strip">${l.map(b => `<span title="${esc(b.name + ' · ' + b.desc)}">${art(b, 34)}</span>`).join('')}</div>` : ''; } };

  /* ---------- অ্যাডমিন সেটিংস ---------- */
  const canW = () => DB.levels[PX.S.level].perms.settings >= 2;
  const holders = b => b.aud === 'student' ? (status(b).ok ? 1 : 0) + ' / 1' : TEACHERS.filter(t => status(b, t).ok).length + ' / ' + TEACHERS.length;
  PX.sec.a.badges = () => UI.card(T('ব্যাজ ম্যানেজার', 'Badge manager'),
    `<p class="soft">${T('টিচার ও স্টুডেন্টদের জন্য ব্যাজ বানান: কী অর্জন করলে ব্যাজ মিলবে (মাইলস্টোন) ঠিক করুন, ছবি কাস্টমাইজ করুন। শর্ত পূরণ হলেই ব্যাজ নিজে থেকে অ্যাসাইন হবে।', 'Create badges for teachers and students: set the milestone that earns it and customise its image. Badges are assigned automatically once the milestone is met.')}</p>` +
    (canW() ? `<p><button class="btn btn-p btn-sm" data-pa="bgxnew">${ic('plus')} ${T('নতুন ব্যাজ', 'New badge')}</button></p>` : '') +
    UI.tbl(['', T('নাম', 'Name'), T('কার জন্য', 'For'), T('মাইলস্টোন', 'Milestone'), T('অর্জনকারী', 'Earned by'), T('অবস্থা', 'Status'), ''],
      DB.badges.map(b => [art(b, 40), `<b>${esc(b.name)}</b><br><small class="mute">${esc(b.desc)}</small>`, b.aud === 'student' ? T('স্টুডেন্ট', 'Students') : T('টিচার', 'Teachers'), esc(rule(b)), holders(b),
        b.on ? UI.chip(T('চালু', 'Active'), 'ok') : UI.chip(T('বন্ধ', 'Off'), ''),
        canW() ? `<button class="btn btn-o btn-sm" data-pa="bgxedit" data-id="${b.id}">${T('এডিট', 'Edit')}</button> <button class="btn btn-o btn-sm" data-pa="bgxtog" data-id="${b.id}">${b.on ? T('বন্ধ করুন', 'Turn off') : T('চালু করুন', 'Turn on')}</button> <button class="btn btn-o btn-sm" data-pa="bgxdel" data-id="${b.id}" aria-label="${T('মুছুন', 'Delete')}">${ic('close')}</button>` : '']))); 
  const metOpts = (aud, cur) => MET[aud].map(m => `<option value="${m[0]}"${m[0] === cur ? ' selected' : ''}>${T(m[1], m[2])}</option>`).join('');
  const form = b => {
    b = b || { aud: 'student', name: '', desc: '', metric: 'courses', target: 1, color: '#8C52FF', icon: 'star', img: '', on: true };
    PX.modal(b.id ? T('ব্যাজ এডিট', 'Edit badge') : T('নতুন ব্যাজ', 'New badge'), `<form data-pf="bgxsave" class="fgrid"><input type="hidden" name="id" value="${b.id || ''}">
      <div class="fld"><label>${T('কার জন্য', 'Audience')}</label><select name="aud" data-pc="bgxaud"><option value="student"${b.aud === 'student' ? ' selected' : ''}>${T('স্টুডেন্ট', 'Students')}</option><option value="teacher"${b.aud === 'teacher' ? ' selected' : ''}>${T('টিচার', 'Teachers')}</option></select></div>
      <div class="fld"><label>${T('ব্যাজের নাম', 'Badge name')}<b class="rq"> *</b></label><input name="name" value="${esc(b.name)}" maxlength="40" autocomplete="off"></div>
      <div class="fld full"><label>${T('বিবরণ', 'Description')}</label><input name="desc" value="${esc(b.desc)}" maxlength="90" autocomplete="off"></div>
      <div class="fld"><label>${T('মাইলস্টোন: কীসের ওপর', 'Milestone: based on')}</label><select name="metric">${metOpts(b.aud, b.metric)}</select></div>
      <div class="fld"><label>${T('কমপক্ষে কত হলে', 'Reach at least')}<b class="rq"> *</b></label><input name="target" type="number" min="0.1" step="any" value="${b.target}"></div>
      <div class="fld"><label>${T('রং', 'Colour')}</label><input name="color" type="color" value="${esc(b.color)}"></div>
      <div class="fld"><label>${T('আইকন', 'Icon')}</label><div class="bdg-ic">${Object.keys(ICONS).map(k => `<label><input type="radio" name="icon" value="${k}"${b.icon === k ? ' checked' : ''}>${art({ color: b.color, icon: k }, 34)}</label>`).join('')}</div></div>
      <div class="fld full"><label>${T('নিজের ছবি আপলোড (দিলে আইকনের বদলে এটি দেখাবে)', 'Upload your own image (replaces the icon)')}</label><div class="thf bl-img"><div class="thf-prev" data-thp>${b.img ? `<img src="${esc(b.img)}" alt="">` : T('ছবি', 'Image')}</div>
        <div><label class="btn btn-o btn-sm upl">${ic('upload')} ${T('ছবি বাছুন', 'Choose image')}<input type="file" accept="image/png,image/jpeg,image/webp" data-pc="blogimg" hidden></label> <button type="button" class="btn btn-o btn-sm" data-pa="blogimgx">${T('সরান', 'Remove')}</button><small class="err" data-the role="alert"></small><input type="hidden" name="img" value="${b.img ? esc(b.img) : ''}"></div></div></div>
      <p class="err full" id="bd-err" role="alert"></p><div class="full"><button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></div></form>`);
  };
  PX.CHG.bgxaud = el => { el.closest('form').querySelector('[name=metric]').innerHTML = metOpts(el.value, ''); };
  PX.ACT.bgxnew = () => { if (canW()) form(); };
  PX.ACT.bgxedit = a => { if (canW()) form(DB.badges.find(x => x.id === a.dataset.id)); };
  PX.ACT.bgxtog = a => { if (!canW()) return; const b = DB.badges.find(x => x.id === a.dataset.id); if (b) { b.on = !b.on; PX.refresh(); } };
  PX.ACT.bgxdel = a => { if (!canW()) return; DB.badges = DB.badges.filter(x => x.id !== a.dataset.id); PX.toast(T('মুছে ফেলা হয়েছে', 'Deleted')); PX.refresh(); };
  PX.FORMS.bgxsave = (f, d) => {
    if (!canW()) return; const er = f.querySelector('#bd-err');
    if (!(d.name || '').trim()) { er.textContent = T('ব্যাজের নাম দিন', 'Enter a badge name'); return; }
    if (!(+d.target > 0)) { er.textContent = T('মাইলস্টোনের সংখ্যা দিন', 'Enter the milestone number'); return; }
    const o = { aud: d.aud, name: d.name.trim(), desc: (d.desc || '').trim(), metric: d.metric, target: +d.target, color: d.color, icon: d.icon || 'star', img: d.img || '' };
    const b = d.id && DB.badges.find(x => x.id === d.id);
    if (b) Object.assign(b, o); else DB.badges.push(Object.assign({ id: 'bd' + Date.now() % 1e7, on: true }, o));
    PX.closeModal(); PX.toast(T('ব্যাজ সংরক্ষিত', 'Badge saved')); PX.refresh();
  };
  const pn = PX.nav.a; PX.nav.a = () => { const l = pn(); if (DB.levels[PX.S.level].perms.settings) l.push({ k: 'badges', l: T('ব্যাজ', 'Badges'), i: 'award', also: [], badge: '' }); return l; };

  /* ---------- স্টুডেন্ট/টিচার পোর্টালে ---------- */
  const sh = PX.sec.s.home; PX.sec.s.home = (...a) => sh(...a) + myCard('student');
  PX.sec.s.profile = (p => (...a) => p(...a) + myCard('student'))(PX.sec.s.profile);

  /* ---------- টিচারের ভেরিফিকেশন গ্রাফিক ---------- */
  const step = (ok, icn, lbl) => `<div class="vs ${ok ? 'ok' : 'wait'}"><span class="vs-c">${ic(ok ? icn : 'clock')}${ok ? `<i>${ic('check')}</i>` : ''}</span><small>${lbl}</small></div>`;
  PX.verifyGraphic = (b) => { const k = [[b.id, 'user', T('আইডি', 'ID')], [b.doc, 'file', T('ডকুমেন্ট', 'Documents')], [b.pay, 'award', T('পেমেন্ট', 'Payment')]], got = k.filter(x => x[0]).length;
    return `<div class="vgraph" role="img" aria-label="${T('যাচাই', 'Verification')} ${got}/3"><div class="vg-ring" style="--p:${Math.round(got / 3 * 100)}"><b>${n(got)}/${n(3)}</b></div><div class="vg-steps">${k.map(x => step(x[0], x[1], x[2])).join('')}</div></div>`; };
  const tp = PX.sec.t.profile;
  PX.sec.t.profile = (...a) => {
    const h = tp(...a), t = CH.byId(TEACHERS, TID), g = UI.card(T('ভেরিফিকেশন', 'Verification'), PX.verifyGraphic(t.badges || {}) + `<p class="soft">${T('আইডি, ডকুমেন্ট ও পেমেন্ট যাচাই সম্পূর্ণ হলে আপনার প্রোফাইলে যাচাই করা চিহ্ন দেখায়।', 'The verified mark shows on your profile once ID, documents and payment are checked.')}</p>`);
    return g + h.replace(/<p><span class="pchip ok">[^]*?Admin approved<\/span><\/p>|<p>(?:<span class="pchip ok">[^<]*<\/span> ?){3}<\/p>/, '') + myCard('teacher');
  };
  const th = PX.sec.t.home; PX.sec.t.home = (...a) => th(...a) + myCard('teacher');
})();
