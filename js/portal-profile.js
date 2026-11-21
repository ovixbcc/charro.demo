/* সবার প্রোফাইল: ছবি, জন্মদিন, বাবা-মা, এনআইডি, জরুরি যোগাযোগ, ঠিকানা, বিভাগ, জেলা, প্রতিষ্ঠান */
(function () {
  'use strict';
  const PX = window.PX, { T, n, esc, ic, TEACH } = PX, UI = PX.ui, DB = PX.DB, L = CH.L;
  const DIV = [['ঢাকা', 'Dhaka'], ['চট্টগ্রাম', 'Chattogram'], ['রাজশাহী', 'Rajshahi'], ['খুলনা', 'Khulna'], ['বরিশাল', 'Barishal'], ['সিলেট', 'Sylhet'], ['রংপুর', 'Rangpur'], ['ময়মনসিংহ', 'Mymensingh']];
  const DIS = {
    'ঢাকা': [['ঢাকা', 'Dhaka'], ['ফরিদপুর', 'Faridpur'], ['গাজীপুর', 'Gazipur'], ['গোপালগঞ্জ', 'Gopalganj'], ['কিশোরগঞ্জ', 'Kishoreganj'], ['মাদারীপুর', 'Madaripur'], ['মানিকগঞ্জ', 'Manikganj'], ['মুন্সিগঞ্জ', 'Munshiganj'], ['নারায়ণগঞ্জ', 'Narayanganj'], ['নরসিংদী', 'Narsingdi'], ['রাজবাড়ী', 'Rajbari'], ['শরীয়তপুর', 'Shariatpur'], ['টাঙ্গাইল', 'Tangail']],
    'চট্টগ্রাম': [['বান্দরবান', 'Bandarban'], ['ব্রাহ্মণবাড়িয়া', 'Brahmanbaria'], ['চাঁদপুর', 'Chandpur'], ['চট্টগ্রাম', 'Chattogram'], ['কুমিল্লা', 'Cumilla'], ['কক্সবাজার', "Cox's Bazar"], ['ফেনী', 'Feni'], ['খাগড়াছড়ি', 'Khagrachhari'], ['লক্ষ্মীপুর', 'Lakshmipur'], ['নোয়াখালী', 'Noakhali'], ['রাঙ্গামাটি', 'Rangamati']],
    'রাজশাহী': [['বগুড়া', 'Bogura'], ['জয়পুরহাট', 'Joypurhat'], ['নওগাঁ', 'Naogaon'], ['নাটোর', 'Natore'], ['চাঁপাইনবাবগঞ্জ', 'Chapainawabganj'], ['পাবনা', 'Pabna'], ['রাজশাহী', 'Rajshahi'], ['সিরাজগঞ্জ', 'Sirajganj']],
    'খুলনা': [['বাগেরহাট', 'Bagerhat'], ['চুয়াডাঙ্গা', 'Chuadanga'], ['যশোর', 'Jashore'], ['ঝিনাইদহ', 'Jhenaidah'], ['খুলনা', 'Khulna'], ['কুষ্টিয়া', 'Kushtia'], ['মাগুরা', 'Magura'], ['মেহেরপুর', 'Meherpur'], ['নড়াইল', 'Narail'], ['সাতক্ষীরা', 'Satkhira']],
    'বরিশাল': [['বরগুনা', 'Barguna'], ['বরিশাল', 'Barishal'], ['ভোলা', 'Bhola'], ['ঝালকাঠি', 'Jhalokathi'], ['পটুয়াখালী', 'Patuakhali'], ['পিরোজপুর', 'Pirojpur']],
    'সিলেট': [['হবিগঞ্জ', 'Habiganj'], ['মৌলভীবাজার', 'Moulvibazar'], ['সুনামগঞ্জ', 'Sunamganj'], ['সিলেট', 'Sylhet']],
    'রংপুর': [['দিনাজপুর', 'Dinajpur'], ['গাইবান্ধা', 'Gaibandha'], ['কুড়িগ্রাম', 'Kurigram'], ['লালমনিরহাট', 'Lalmonirhat'], ['নীলফামারী', 'Nilphamari'], ['পঞ্চগড়', 'Panchagarh'], ['রংপুর', 'Rangpur'], ['ঠাকুরগাঁও', 'Thakurgaon']],
    'ময়মনসিংহ': [['জামালপুর', 'Jamalpur'], ['ময়মনসিংহ', 'Mymensingh'], ['নেত্রকোণা', 'Netrokona'], ['শেরপুর', 'Sherpur']]
  };
  const lb = p => T(p[0], p[1]);
  const divOf = d => (DIV.find(v => DIS[v[0]].some(x => x[0] === d || x[1] === d)) || [''])[0];
  const disOpts = (div, cur) => [['', T('জেলা বেছে নিন', 'Select district')]].concat((DIS[div] || []).map(x => [x[1], lb(x)]));
  PX.DISTRICTS = DIS;

  DB.prof = DB.prof || {};
  const rec = (key, base) => DB.prof[key] || (DB.prof[key] = Object.assign({ photo: '', dob: '', father: '', mother: '', fnid: '', mnid: '', nid: '', emName: '', emPhone: '', addr: '', division: divOf(base.district), district: base.district || '', inst: base.inst || '', name: base.name || '', phone: base.phone || '', email: base.email || '' }, {}));

  const form = (key, role, base, instLabel) => {
    const tch = role === 't', r = rec(key, base), photo = r.photo ? `<img src="${r.photo}" alt="">` : `<span>${esc((r.name || '?').trim().charAt(0))}</span>`;
    return UI.card(tch ? T('সিস্টেম তথ্য (শুধু Chaatro ও অ্যাডমিন দেখবে)', 'System details (visible only to Chaatro & admin)') : T('আমার তথ্য', 'My details'), `<form data-pf="myprof" data-key="${key}" data-role="${role}" class="fgrid prof-f">
      <div class="fld ph-wrap"><div class="ph-prev" id="ph-prev">${photo}</div>
        <div><label class="btn btn-o btn-sm upl">${ic('upload')} ${T('ছবি বদলান', 'Change photo')}<input type="file" name="photo" data-pc="phpick" accept="image/png,image/jpeg,image/webp" hidden></label><small class="hint">${T('JPG, PNG বা WebP, সর্বোচ্চ ২ এমবি', 'JPG, PNG or WebP, up to 2 MB')}</small></div></div>
      ${UI.fi({ name: 'name', label: T('পুরো নাম', 'Full name'), val: r.name, half: 1, req: 1 })}
      ${UI.fi({ name: 'dob', label: T('জন্ম তারিখ', 'Date of birth'), type: 'date', val: r.dob, half: 1 })}
      ${UI.fi({ name: 'phone', label: T('মোবাইল নম্বর', 'Mobile number'), val: r.phone, half: 1, ph: '01XXXXXXXXX', req: tch ? 1 : 0 })}
      ${UI.fi({ name: 'email', label: T('ইমেইল', 'Email'), type: 'email', val: r.email, half: 1, req: tch ? 1 : 0 })}
      ${tch ? UI.fi({ name: 'nid', label: T('নিজের এনআইডি নম্বর', 'Your NID number'), val: r.nid, half: 1, req: 1, ph: T('১০, ১৩ বা ১৭ অঙ্ক', '10, 13 or 17 digits') }) : ''}
      ${tch ? '' : `      ${UI.fi({ name: 'father', label: T('বাবার নাম', "Father's name"), val: r.father, half: 1 })}
      ${UI.fi({ name: 'fnid', label: T('বাবার এনআইডি', "Father's NID"), val: r.fnid, half: 1, ph: T('১০, ১৩ বা ১৭ অঙ্ক', '10, 13 or 17 digits') })}
      ${UI.fi({ name: 'mother', label: T('মায়ের নাম', "Mother's name"), val: r.mother, half: 1 })}
      ${UI.fi({ name: 'mnid', label: T('মায়ের এনআইডি', "Mother's NID"), val: r.mnid, half: 1, ph: T('১০, ১৩ বা ১৭ অঙ্ক', '10, 13 or 17 digits') })}`}
      ${UI.fi({ name: 'emName', label: T('জরুরি যোগাযোগের নাম', 'Emergency contact name'), val: r.emName, half: 1 })}
      ${UI.fi({ name: 'emPhone', label: T('জরুরি যোগাযোগের নম্বর', 'Emergency contact number'), val: r.emPhone, half: 1, ph: '01XXXXXXXXX' })}
      ${UI.fi({ name: 'addr', label: T('যোগাযোগের ঠিকানা', 'Contact address'), rows: 2, val: r.addr })}
      ${UI.fi({ name: 'division', label: T('বিভাগ', 'Division'), val: r.division, half: 1, opts: [['', T('বিভাগ বেছে নিন', 'Select division')]].concat(DIV.map(v => [v[0], lb(v)])) })}
      ${UI.fi({ name: 'district', label: T('জেলা', 'District'), val: r.district, half: 1, opts: disOpts(r.division, r.district) })}
      ${UI.fi({ name: 'inst', label: instLabel, val: r.inst, hint: T('বর্তমানে যে প্রতিষ্ঠানে পড়ছেন/কাজ করছেন', 'Where you currently study or work') })}
      <div class="fld"><small class="err" id="pf-err" role="alert"></small><button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></div></form>`.replace('name="division"', 'name="division" data-pc="division"'));
  };

  PX.CHG.division = el => { const sel = el.form.elements.district; sel.innerHTML = disOpts(el.value).map(x => `<option value="${x[0]}">${esc(x[1])}</option>`).join(''); };
  PX.CHG.phpick = el => {
    const f = el.files[0], err = el.form.querySelector('#pf-err'); if (!f) return;
    if (!/^image\//.test(f.type) || f.size > 2 * 1048576) { el.value = ''; err.textContent = T('২ এমবির মধ্যে একটি ছবি দিন', 'Choose an image under 2 MB'); return; }
    err.textContent = ''; document.getElementById('ph-prev').innerHTML = `<img src="${URL.createObjectURL(f)}" alt="">`;
  };
  PX.FORMS.myprof = (f, d) => {
    const err = f.querySelector('#pf-err'), bad = m => { err.textContent = m; };
    const nid = v => !v || /^(\d{10}|\d{13}|\d{17})$/.test(v.replace(/\s/g, '')), ph = v => !v || /^(?:\+?88)?01[3-9]\d{8}$/.test(v.replace(/[\s-]/g, ''));
    if (!ph(d.phone)) return bad(T('মোবাইল নম্বর ঠিক নয়', 'Invalid mobile number'));
    if (!ph(d.emPhone)) return bad(T('জরুরি নম্বর ঠিক নয়', 'Invalid emergency number'));
    if (f.dataset.role !== 't' && (!nid(d.fnid) || !nid(d.mnid))) return bad(T('এনআইডি ১০, ১৩ বা ১৭ অঙ্কের হতে হবে', 'NID must be 10, 13 or 17 digits'));
    if (d.dob && d.dob > PX.TODAY) return bad(T('জন্ম তারিখ ভবিষ্যতের হতে পারে না', 'Date of birth cannot be in the future'));
    if (d.district && d.division && !(DIS[d.division] || []).some(x => x[1] === d.district || x[0] === d.district)) return bad(T('জেলাটি এই বিভাগের নয়', 'District does not belong to this division'));
    if (f.dataset.role === 't') {
      if (!(d.phone || '').trim() || !(d.email || '').trim() || !(d.nid || '').trim()) return bad(T('মোবাইল নম্বর, ইমেইল ও নিজের এনআইডি আবশ্যক', 'Mobile number, email and your NID are required'));
      if (!/^\S+@\S+\.\S+$/.test(d.email.trim())) return bad(T('ইমেইল ঠিক নয়', 'Invalid email'));
      if (!nid(d.nid)) return bad(T('এনআইডি ১০, ১৩ বা ১৭ অঙ্কের হতে হবে', 'NID must be 10, 13 or 17 digits'));
    }
    const r = DB.prof[f.dataset.key], file = f.elements.photo.files[0];
    ['name', 'dob', 'phone', 'email', 'nid', 'father', 'mother', 'fnid', 'mnid', 'emName', 'emPhone', 'addr', 'division', 'district', 'inst'].forEach(k => { r[k] = (d[k] === undefined ? (r[k] || '') : (d[k] || '').trim()); });
    if (file) r.photo = URL.createObjectURL(file);
    if (f.dataset.role === 's') { const u = DB.me; Object.assign(u, { name: r.name, phone: r.phone, email: r.email, district: r.district }); u.guardian = { name: r.emName, phone: r.emPhone }; }
    PX.toast(T('প্রোফাইল সংরক্ষিত', 'Profile saved')); PX.refresh();
  };

  const head = (r, role, sub) => UI.card(T('আমার প্রোফাইল', 'My profile'), `<div class="prof"><div class="ph-prev ph-lg">${r.photo ? `<img src="${r.photo}" alt="">` : `<span>${esc((r.name || '?').trim().charAt(0))}</span>`}</div><div><h3>${esc(r.name)}</h3><p>${esc(sub)}</p></div></div>`);


  /* টিচারের পাবলিক প্রোফাইল: টিচার নিজে সম্পাদনা করে, সাইটের টিচার পেজে সঙ্গে সঙ্গে দেখায় */
  const SUBJ = () => SUBJECTS.map(s => [s.id, L(s)]);
  const lines = arr => (arr || []).map(x => L(x)).join('\n');
  const setL = (o, k, v) => { v = (v || '').trim(); if (v !== L(o[k] || {})) o[k] = { bn: v, en: v }; };
  const toL = (txt, old) => (txt || '').split(/\n/).map(s => s.trim()).filter(Boolean).map(s => (old || []).find(x => L(x) === s) || { bn: s, en: s });
  const part = x => L(x).split(',')[0].trim();
  const featOpts = tc => { const o = []; if (L(tc.inst)) o.push(['u', T('বিশ্ববিদ্যালয়', 'University'), L(tc.inst)]); if (L(tc.hsc)) o.push(['h', T('এইচএসসি কলেজ', 'HSC college'), part(tc.hsc)]); (tc.more || []).forEach((m, i) => o.push(['m' + i, T('অন্যান্য', 'Other'), L(m)])); return o; };
  const featCur = tc => { const o = featOpts(tc), f = L(tc.feat || {}); if (tc.featKey && o.some(x => x[0] === tc.featKey)) return tc.featKey; return (o.find(x => x[2] === f || (x[0] === 'u' && f === L(tc.inst))) || [''])[0]; };
  const pubForm = tc => {
    const fk = featCur(tc);
    return UI.card(T('ওয়েব প্রোফাইল (ওয়েবসাইটে স্টুডেন্টরা যা দেখে)', 'Web profile (what students see on the website)'), `<form data-pf="tpub" class="fgrid prof-f">
      <div class="fld ph-wrap"><div class="ph-prev" id="pub-prev">${tc.photo ? `<img src="${tc.photo}" alt="">` : CH.avatar(tc, 84)}</div>
        <div><label class="btn btn-o btn-sm upl">${ic('upload')} ${T('পাবলিক ছবি', 'Public photo')}<input type="file" name="pubphoto" data-pc="pubpick" accept="image/png,image/jpeg,image/webp" hidden></label><small class="hint">${T('টিচার পেজ ও কোর্স কার্ডে দেখাবে। সর্বোচ্চ ২ এমবি।', 'Shown on your teacher page and course cards. Up to 2 MB.')}</small></div></div>
      ${PX.ytField(tc.video, T('টিচারের পরিচিতি ভিডিও (ইউটিউব লিংক)', 'Teacher intro video (YouTube link)'))}
      ${UI.fi({ name: 'n', label: T('নাম', 'Name'), val: L(tc.n), half: 1, req: 1 })}
      ${UI.fi({ name: 'exp', label: T('শেখানোর অভিজ্ঞতা (বছর)', 'Teaching experience (years)'), type: 'number', val: tc.exp, half: 1, min: 0 })}
      ${UI.fi({ name: 'inst', label: T('বিশ্ববিদ্যালয় / প্রতিষ্ঠান', 'University / institution'), val: L(tc.inst), req: 1 })}
      ${UI.fi({ name: 'dept', label: T('বিভাগ', 'Department'), val: L(tc.dept), half: 1 })}
      ${UI.fi({ name: 'yr', label: T('বর্ষ', 'Year'), val: L(tc.yr), half: 1 })}
      ${UI.fi({ name: 'hsc', label: T('এইচএসসি (কলেজ, জিপিএ)', 'HSC (college, GPA)'), val: L(tc.hsc), half: 1 })}
      ${UI.fi({ name: 'ssc', label: T('এসএসসি (বোর্ড/স্কুল, জিপিএ)', 'SSC (board/school, GPA)'), val: L(tc.ssc), half: 1 })}
      ${UI.fi({ name: 'ik', label: T('টিচার তালিকার ফিল্টারে কোন গ্রুপে থাকবেন', 'Group in the teachers filter'), val: tc.ik, opts: INSTITUTIONS.map(i => [i.id, L(i)]).concat([['other', T('অন্যান্য', 'Other')]]) })}
      ${UI.fi({ name: 'more', label: T('অন্যান্য প্রতিষ্ঠান (প্রতি লাইনে একটি)', 'Other institutions (one per line)'), rows: 2, val: lines(tc.more), hint: T('যেমন: পূর্বের বা বর্তমান কোনো প্রতিষ্ঠান', 'e.g. a previous or current institution') })}
      <fieldset class="fld featsel"><legend>${T('ফিচার্ড প্রতিষ্ঠান', 'Featured institution')}</legend><p class="soft">${T('যে প্রতিষ্ঠানটি হাইলাইট করতে চান সেটি বেছে নিন। টিচারের নামের পাশে টিক চিহ্নসহ দেখাবে।', 'Pick the institution to highlight. It appears next to your name with a tick.')}</p>
        ${featOpts(tc).map(o => `<label class="opt ${fk === o[0] ? 'on' : ''}"><input type="radio" name="featsel" value="${o[0]}" ${fk === o[0] ? 'checked' : ''}><span><b>${esc(o[2])}</b><small>${o[1]}</small></span></label>`).join('')}</fieldset>
      ${UI.fi({ name: 'bio', label: T('পরিচিতি', 'About you'), rows: 3, val: L(tc.bio) })}
      ${UI.checks('subs', SUBJ(), tc.subs, T('পড়ানোর বিষয়', 'Subjects you teach'))}
      ${UI.fi({ name: 'certs', label: T('অর্জন ও সার্টিফিকেট (প্রতি লাইনে একটি)', 'Achievements & certificates (one per line)'), rows: 3, val: lines(tc.certs) })}
      ${UI.fi({ name: 'co', label: T('সহ-শিক্ষা কার্যক্রম (প্রতি লাইনে একটি)', 'Co-curricular activities (one per line)'), rows: 3, val: lines(tc.co) })}
      <div class="fld"><small class="err" id="tp-err" role="alert"></small><button class="btn btn-p">${T('পাবলিক প্রোফাইল সংরক্ষণ', 'Save public profile')}</button> <a class="btn btn-o" href="#teacher-${tc.id}">${T('সাইটে দেখুন', 'View on site')}</a></div></form>`);
  };
  PX.CHG.pubpick = el => {
    const f = el.files[0], er = el.form.querySelector('#tp-err'); if (!f) return;
    if (!/^image\//.test(f.type) || f.size > 2 * 1048576) { el.value = ''; er.textContent = T('২ এমবির মধ্যে একটি ছবি দিন', 'Choose an image under 2 MB'); return; }
    er.textContent = ''; document.getElementById('pub-prev').innerHTML = `<img src="${URL.createObjectURL(f)}" alt="">`;
  };
  PX.FORMS.tpub = (f, d) => {
    const tc = TEACH('t01'), er = f.querySelector('#tp-err'), bad = m => { er.textContent = m; };
    if (!(d.n || '').trim() || !(d.inst || '').trim()) return bad(T('নাম ও প্রতিষ্ঠান দিতে হবে', 'Name and institution are required'));
    if (!(d.subs || []).length) return bad(T('অন্তত একটি বিষয় বেছে নিন', 'Pick at least one subject'));
    const ye = PX.ytCheck(d.video); if (ye) return bad(ye);
    const ex = +d.exp; if (d.exp !== '' && (!(ex >= 0) || ex > 60)) return bad(T('অভিজ্ঞতার বছর ঠিক নয়', 'Invalid years of experience'));
    setL(tc, 'n', d.n); setL(tc, 'inst', d.inst); setL(tc, 'dept', d.dept); setL(tc, 'yr', d.yr); setL(tc, 'hsc', d.hsc); setL(tc, 'ssc', d.ssc); setL(tc, 'bio', d.bio);
    tc.video = (d.video || '').trim(); tc.exp = d.exp === '' ? tc.exp : ex; tc.ik = d.ik; tc.subs = d.subs.slice();
    tc.more = toL(d.more, tc.more); tc.certs = toL(d.certs, tc.certs); tc.co = toL(d.co, tc.co);
    const opts = featOpts(tc), pick = opts.find(x => x[0] === d.featsel) || opts[0];
    if (pick) { tc.featKey = pick[0]; tc.feat = pick[0] === 'u' ? tc.inst : pick[0] === 'h' ? { bn: part(tc.hsc), en: part(tc.hsc) } : tc.more[+pick[0].slice(1)]; }
    const file = f.elements.pubphoto.files[0]; if (file) tc.photo = URL.createObjectURL(file);
    PX.toast(T('পাবলিক প্রোফাইল হালনাগাদ হয়েছে', 'Public profile updated')); PX.refresh();
  };

  /* স্টুডেন্ট */
  PX.sec.s.profile = () => { const u = DB.me, r = rec('u1', { name: u.name, phone: u.phone, email: u.email, district: u.district, inst: '' }); return head(r, 's', (r.inst || T('প্রতিষ্ঠান যোগ করুন', 'Add your institution')) + ' · ID ' + u.sid) + form('u1', 's', u, T('বর্তমান শিক্ষাপ্রতিষ্ঠান', 'Current institution')); };
  /* টিচার: পার্সোনাল (সিস্টেম) প্রোফাইল + ডকুমেন্ট; ওয়েব প্রোফাইল আলাদা সেকশন */
  const DOC_OK = /\.(jpe?g|png|webp|pdf)$/i, DOC_MB = 5;
  const tdocs = () => { const r = rec('t01', {}); if (!r.docs) { const ap = DB.apps.find(a => a.id === 'ap3'); r.docs = (ap ? ap.docs : []).map(d => ({ k: 'extra', label: d[0], name: d[1], url: '', st: 'ok' })); } return r.docs; };
  const have = k => tdocs().some(d => d.k === k);
  const docCard = () => {
    const docs = tdocs(), miss = [!have('nid') && T('এনআইডি কপি', 'NID copy'), !have('uni') && T('ভার্সিটি আইডি কার্ড', 'University ID card')].filter(Boolean);
    return UI.card(T('ডকুমেন্ট', 'Documents'),
      (miss.length ? `<p class="err" role="alert">${T('আবশ্যক ডকুমেন্ট বাকি: ', 'Required documents missing: ')}${miss.join(', ')}</p>` : `<p class="soft">${T('আবশ্যক ডকুমেন্ট জমা আছে।', 'Required documents are submitted.')}</p>`) +
      (docs.length ? UI.tbl([T('ডকুমেন্ট', 'Document'), T('ফাইল', 'File'), T('অবস্থা', 'Status')], docs.map(d => [esc(d.label), d.url ? `<a href="${d.url}" target="_blank" rel="noopener">${ic('file')} ${esc(d.name)}</a>` : `${ic('file')} ${esc(d.name)}`, d.st === 'ok' ? UI.chip(T('যাচাইকৃত', 'Verified'), 'ok') : UI.chip(T('যাচাই অপেক্ষায়', 'Pending review'), 'warn')])) : '') +
      `<form data-pf="tdocs" class="fgrid prof-f">
        <div class="fld"><label>${T('এনআইডি কার্ডের কপি *', 'NID card copy *')}</label><input type="file" name="nid" accept=".jpg,.jpeg,.png,.webp,.pdf"></div>
        <div class="fld"><label>${T('ভার্সিটি আইডি কার্ড *', 'University ID card *')}</label><input type="file" name="uni" accept=".jpg,.jpeg,.png,.webp,.pdf"></div>
        <div class="fld"><label>${T('অতিরিক্ত ডকুমেন্ট (সার্টিফিকেট, মার্কশিট ইত্যাদি)', 'Additional documents (certificates, marksheets etc.)')}</label><input type="file" name="extra" multiple accept=".jpg,.jpeg,.png,.webp,.pdf"><small class="hint">${T('JPG, PNG, WebP বা PDF; প্রতিটি সর্বোচ্চ ৫ এমবি', 'JPG, PNG, WebP or PDF; up to 5 MB each')}</small></div>
        <div class="fld"><small class="err" id="td-err" role="alert"></small><button class="btn btn-p">${T('ডকুমেন্ট জমা দিন', 'Submit documents')}</button></div></form>`);
  };
  PX.FORMS.tdocs = (f, d) => {
    const er = f.querySelector('#td-err'), bad = m => { er.textContent = m; };
    const pick = [['nid', T('এনআইডি কপি', 'NID copy'), 1], ['uni', T('ভার্সিটি আইডি কার্ড', 'University ID card'), 1], ['extra', T('অতিরিক্ত ডকুমেন্ট', 'Additional document'), 0]];
    const add = [];
    for (const [k, label, one] of pick) for (const fl of Array.from(f.elements[k].files)) {
      if (!DOC_OK.test(fl.name)) return bad(T('শুধু JPG, PNG, WebP বা PDF দিন: ', 'Only JPG, PNG, WebP or PDF: ') + fl.name);
      if (fl.size > DOC_MB * 1048576) return bad(T('ফাইল ৫ এমবির মধ্যে হতে হবে: ', 'File must be under 5 MB: ') + fl.name);
      add.push({ k, label, name: fl.name, url: URL.createObjectURL(fl), st: 'pending', one });
    }
    if (!add.length) return bad(T('অন্তত একটি ফাইল বেছে নিন', 'Choose at least one file'));
    const docs = tdocs();
    add.forEach(a => { if (a.one) { const i = docs.findIndex(x => x.k === a.k); if (i > -1) docs.splice(i, 1); } docs.push({ k: a.k, label: a.label, name: a.name, url: a.url, st: a.st }); });
    PX.toast(T('ডকুমেন্ট জমা হয়েছে, অ্যাডমিন যাচাই করবে', 'Uploaded; admin will verify')); PX.refresh();
  };
  const steps = () => UI.card(T('টিচার হওয়ার ধাপ', 'Onboarding steps'), `<ol class="steps">${[T('আবেদন ও ডকুমেন্ট জমা', 'Apply with documents'), T('অ্যাডমিন যাচাই ও অনুমোদন', 'Admin review & approval'), T('কোর্স তৈরি ও অনুমোদন', 'Create & approve courses'), T('কোর্স লাইভ ও ক্লাস শুরু', 'Go live')].map(x => `<li>${UI.chip('✓', 'ok')} ${x}</li>`).join('')}</ol>`);
  PX.sec.t.profile = () => { const t = TEACH('t01'), r = rec('t01', { name: t.n.bn, phone: t.phone, email: 'teacher@chaatro.com', district: '', inst: L(t.inst) }); return head(r, 't', r.inst + ' · ID ' + t.pid).replace(T('আমার প্রোফাইল', 'My profile'), T('পার্সোনাল প্রোফাইল', 'Personal profile')) + form('t01', 't', {}, T('বর্তমান প্রতিষ্ঠান / বিশ্ববিদ্যালয়', 'Current institution / university')) + docCard() + steps(); };
  PX.sec.t.webprofile = () => { const t = TEACH('t01'); return UI.card(T('ওয়েব প্রোফাইল', 'Web profile'), `<div class="prof">${CH.avatar(t, 72)}<div><h3>${esc(L(t.n))}</h3><p>${T('এই অংশের তথ্য ওয়েবসাইটে স্টুডেন্টদের কাছে দেখা যায়। নাম, ছবি, প্রতিষ্ঠান, অভিজ্ঞতা ও অর্জন এখান থেকে সম্পাদনা করুন।', 'Everything here is shown to students on the website: name, photo, institution, experience and achievements.')}</p></div></div>`) + pubForm(t); };
  /* অ্যাডমিন */
  PX.sec.a.profile = () => { const r = rec('admin', { name: 'Sobuj K Mandal', phone: '', email: 'admin@chaatro.com', district: '', inst: 'Chaatro.com' }); return head(r, 'a', T('অ্যাডমিন', 'Administrator')) + form('admin', 'a', {}, T('বর্তমান প্রতিষ্ঠান', 'Current institution')); };
  const navT = PX.nav.t; PX.nav.t = () => { const l = navT(), i = l.findIndex(x => x.k === 'profile'); if (i > -1) { l[i] = Object.assign({}, l[i], { l: T('পার্সোনাল প্রোফাইল', 'Personal profile') }); l.splice(i + 1, 0, { k: 'webprofile', l: T('ওয়েব প্রোফাইল', 'Web profile'), i: 'globe' }); } return l; };
  const navA = PX.nav.a; PX.nav.a = () => navA().concat([{ k: 'profile', l: T('আমার প্রোফাইল', 'My profile'), i: 'user', also: [], badge: '' }]);
})();
