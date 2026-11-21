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
  const divOf = d => (DIV.find(v => DIS[v[0]].some(x => x[0] === d)) || [''])[0];
  const disOpts = (div, cur) => [['', T('জেলা বেছে নিন', 'Select district')]].concat((DIS[div] || []).map(x => [x[0], lb(x)]));
  PX.DISTRICTS = DIS;

  DB.prof = DB.prof || {};
  const rec = (key, base) => DB.prof[key] || (DB.prof[key] = Object.assign({ photo: '', dob: '', father: '', mother: '', fnid: '', mnid: '', emName: '', emPhone: '', addr: '', division: divOf(base.district), district: base.district || '', inst: base.inst || '', name: base.name || '', phone: base.phone || '', email: base.email || '' }, {}));

  const form = (key, role, base, instLabel) => {
    const r = rec(key, base), photo = r.photo ? `<img src="${r.photo}" alt="">` : `<span>${esc((r.name || '?').trim().charAt(0))}</span>`;
    return UI.card(T('আমার তথ্য', 'My details'), `<form data-pf="myprof" data-key="${key}" data-role="${role}" class="fgrid prof-f">
      <div class="fld ph-wrap"><div class="ph-prev" id="ph-prev">${photo}</div>
        <div><label class="btn btn-o btn-sm upl">${ic('upload')} ${T('ছবি বদলান', 'Change photo')}<input type="file" name="photo" data-pc="phpick" accept="image/png,image/jpeg,image/webp" hidden></label><small class="hint">${T('JPG, PNG বা WebP, সর্বোচ্চ ২ এমবি', 'JPG, PNG or WebP, up to 2 MB')}</small></div></div>
      ${UI.fi({ name: 'name', label: T('পুরো নাম', 'Full name'), val: r.name, half: 1, req: 1 })}
      ${UI.fi({ name: 'dob', label: T('জন্ম তারিখ', 'Date of birth'), type: 'date', val: r.dob, half: 1 })}
      ${UI.fi({ name: 'phone', label: T('মোবাইল নম্বর', 'Mobile number'), val: r.phone, half: 1, ph: '01XXXXXXXXX' })}
      ${UI.fi({ name: 'email', label: T('ইমেইল', 'Email'), type: 'email', val: r.email, half: 1 })}
      ${UI.fi({ name: 'father', label: T('বাবার নাম', "Father's name"), val: r.father, half: 1 })}
      ${UI.fi({ name: 'fnid', label: T('বাবার এনআইডি', "Father's NID"), val: r.fnid, half: 1, ph: T('১০, ১৩ বা ১৭ অঙ্ক', '10, 13 or 17 digits') })}
      ${UI.fi({ name: 'mother', label: T('মায়ের নাম', "Mother's name"), val: r.mother, half: 1 })}
      ${UI.fi({ name: 'mnid', label: T('মায়ের এনআইডি', "Mother's NID"), val: r.mnid, half: 1, ph: T('১০, ১৩ বা ১৭ অঙ্ক', '10, 13 or 17 digits') })}
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
    if (!nid(d.fnid) || !nid(d.mnid)) return bad(T('এনআইডি ১০, ১৩ বা ১৭ অঙ্কের হতে হবে', 'NID must be 10, 13 or 17 digits'));
    if (d.dob && d.dob > PX.TODAY) return bad(T('জন্ম তারিখ ভবিষ্যতের হতে পারে না', 'Date of birth cannot be in the future'));
    if (d.district && d.division && !(DIS[d.division] || []).some(x => x[0] === d.district)) return bad(T('জেলাটি এই বিভাগের নয়', 'District does not belong to this division'));
    const r = DB.prof[f.dataset.key], file = f.elements.photo.files[0];
    ['name', 'dob', 'phone', 'email', 'father', 'mother', 'fnid', 'mnid', 'emName', 'emPhone', 'addr', 'division', 'district', 'inst'].forEach(k => { r[k] = (d[k] || '').trim(); });
    if (file) r.photo = URL.createObjectURL(file);
    if (f.dataset.role === 's') { const u = DB.me; Object.assign(u, { name: r.name, phone: r.phone, email: r.email, district: r.district }); u.guardian = { name: r.emName, phone: r.emPhone }; }
    PX.toast(T('প্রোফাইল সংরক্ষিত', 'Profile saved')); PX.refresh();
  };

  const head = (r, role, sub) => UI.card(T('আমার প্রোফাইল', 'My profile'), `<div class="prof"><div class="ph-prev ph-lg">${r.photo ? `<img src="${r.photo}" alt="">` : `<span>${esc((r.name || '?').trim().charAt(0))}</span>`}</div><div><h3>${esc(r.name)}</h3><p>${esc(sub)}</p></div></div>`);

  /* স্টুডেন্ট */
  PX.sec.s.profile = () => { const u = DB.me, r = rec('u1', { name: u.name, phone: u.phone, email: u.email, district: u.district, inst: '' }); return head(r, 's', r.inst || T('প্রতিষ্ঠান যোগ করুন', 'Add your institution')) + form('u1', 's', u, T('বর্তমান শিক্ষাপ্রতিষ্ঠান', 'Current institution')); };
  /* টিচার */
  const oldT = PX.sec.t.profile;
  PX.sec.t.profile = () => { const t = TEACH('t01'), r = rec('t01', { name: t.n.bn, phone: '01711000002', email: 'teacher@chaatro.com', district: '', inst: L(t.inst) }); return head(r, 't', r.inst) + form('t01', 't', {}, T('বর্তমান প্রতিষ্ঠান / বিশ্ববিদ্যালয়', 'Current institution / university')) + oldT().replace(/^<section[^>]*>.*?<\/section>/s, ''); };
  /* অ্যাডমিন */
  PX.sec.a.profile = () => { const r = rec('admin', { name: 'Sobuj K Mandal', phone: '', email: 'admin@chaatro.com', district: '', inst: 'Chaatro.com' }); return head(r, 'a', T('অ্যাডমিন', 'Administrator')) + form('admin', 'a', {}, T('বর্তমান প্রতিষ্ঠান', 'Current institution')); };
  const navA = PX.nav.a; PX.nav.a = () => navA().concat([{ k: 'profile', l: T('আমার প্রোফাইল', 'My profile'), i: 'user', also: [], badge: '' }]);
})();
