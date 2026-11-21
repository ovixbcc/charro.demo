/* অ্যাডমিন → Website settings: পাবলিক ওয়েবসাইটের লোগো, ব্যানার, মেনু, লেখা ও রং */
(function () {
  'use strict';
  const PX = window.PX, { T, esc, ic } = PX, UI = PX.ui, A = PX.ACT, F = PX.FORMS, SD = () => SITE.data;
  const MAXKB = { logo: 600, logoFooter: 600, favicon: 150, img: 1200 };
  const done = (msg) => { const ok = SITE.save(); SITE.apply(); if (window.CH && CH.rerender) CH.rerender(); PX.toast(ok ? msg : T('সংরক্ষিত হয়েছে, কিন্তু ব্রাউজারে জায়গা কম — ছবি ছোট করুন', 'Applied, but browser storage is full — use smaller images')); PX.refresh(); };

  /* ---- ছবি আপলোড ফিল্ড ---- */
  const imgField = (name, cur, label, kind) => `<div class="fld full"><label>${label}</label><div class="thf"><div class="thf-prev" data-thp>${cur ? `<img src="${cur}" alt="">` : T('ছবি নেই (ডিফল্ট)', 'No image (default)')}</div>
    <div><label class="btn btn-o btn-sm upl">${ic('upload')} ${T('ছবি বাছুন', 'Choose image')}<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon" data-pc="siteimg" data-kind="${kind || 'img'}" hidden></label> <button type="button" class="btn btn-o btn-sm" data-pa="siteimgclear">${T('ডিফল্টে ফিরুন', 'Use default')}</button>
    <small class="soft" style="display:block">${T('সর্বোচ্চ ', 'Max ')}${MAXKB[kind || 'img']} KB</small><small class="err" data-the role="alert"></small><input type="hidden" name="${name}" value="${cur ? esc(cur) : ''}"></div></div></div>`;
  PX.CHG.siteimg = el => {
    const f = el.files[0], box = el.closest('.thf'), er = box.querySelector('[data-the]'), max = MAXKB[el.dataset.kind || 'img'] * 1024; if (!f) return;
    if (!/^image\//.test(f.type) || f.size > max) { el.value = ''; er.textContent = T('ছবির সাইজ সীমার মধ্যে রাখুন', 'Image is too large or not an image'); return; }
    er.textContent = ''; const r = new FileReader(); r.onload = () => { box.querySelector('input[type=hidden]').value = r.result; box.querySelector('[data-thp]').innerHTML = `<img src="${r.result}" alt="">`; }; r.readAsDataURL(f);
  };
  A.siteimgclear = a => { const box = a.closest('.thf'); box.querySelector('input[type=hidden]').value = ''; box.querySelector('[data-thp]').textContent = T('ছবি নেই (ডিফল্ট)', 'No image (default)'); };

  /* ---- লেখার এডিটর ---- */
  const GL = { nav: ['হেডার মেনু', 'Header menu'], ft: ['ফুটার', 'Footer'], p: ['নীতিমালার নাম', 'Policy names'], ct: ['যোগাযোগ পেজ', 'Contact page'], ab: ['আমাদের কথা', 'About us'], hw: ['কীভাবে কাজ করে', 'How it works'], bt: ['টিচার হোন (পেজ)', 'Become a teacher'], pol: ['নীতিমালার লেখা', 'Policy texts'], s1: ['স্লাইড ১', 'Slide 1'], s2: ['স্লাইড ২', 'Slide 2'], s3: ['স্লাইড ৩', 'Slide 3'], bd: ['বান্ডেল', 'Bundles'], ck: ['চেকআউট', 'Checkout'], f: ['ফিল্টার ও ফর্ম', 'Filters & forms'], faq: ['প্রশ্নোত্তর', 'FAQ'], blog: ['ব্লগ', 'Blog'], fmt: ['ক্লাসের ধরন', 'Class types'], cmp: ['তুলনা', 'Compare'] };
  const grpOf = k => k.split('_')[0];
  const ST = () => PX.S.site || (PX.S.site = { g: 'ft', q: '' });
  const keys = () => Object.keys(I.bn);
  const matches = () => { const s = ST(), q = s.q.trim().toLowerCase(); return keys().filter(k => (s.g === 'all' || grpOf(k) === s.g) && (!q || k.toLowerCase().includes(q) || (I.bn[k] || '').toLowerCase().includes(q) || (I.en[k] || '').toLowerCase().includes(q))); };
  const row = k => { const ob = SD().texts.bn[k], oe = SD().texts.en[k], ed = ob || oe;
    return `<form data-pf="sitetxt" data-k="${k}" class="sitetxt${ed ? ' ed' : ''}"><div class="sk"><code>${esc(k)}</code>${ed ? `<span class="chip chip-ok">${T('বদলানো', 'Edited')}</span>` : ''}</div>
      <div class="fgrid"><div class="fld half"><label>বাংলা</label><textarea name="bn" rows="2">${esc(ob || I.bn[k] || '')}</textarea></div><div class="fld half"><label>English</label><textarea name="en" rows="2">${esc(oe || I.en[k] || '')}</textarea></div></div>
      <div class="btns"><button class="btn btn-p btn-sm">${T('সংরক্ষণ', 'Save')}</button>${ed ? ` <button type="button" class="btn btn-o btn-sm" data-pa="sitetxtreset" data-k="${k}">${T('ডিফল্টে ফিরুন', 'Reset')}</button>` : ''}</div></form>`; };
  const listHtml = () => { const m = matches(), show = m.slice(0, 25); return `<p class="soft">${T('মিলেছে: ', 'Matches: ')}<b>${m.length}</b>${m.length > 25 ? T(' (প্রথম ২৫টি দেখানো হচ্ছে — সার্চ করে ছোট করুন)', ' (showing first 25 — narrow it with search)') : ''}</p>${show.map(row).join('') || UI.empty(T('কিছু মেলেনি', 'No match'))}`; };
  const textEditor = () => { const s = ST(), gs = [...new Set(keys().map(grpOf))].sort(); return `<div class="bar-t site-f"><select data-pc="sitegrp">${[['all', T('সব লেখা', 'All text')]].concat(gs.map(g => [g, (GL[g] ? T(GL[g][0], GL[g][1]) : g) + ' (' + keys().filter(k => grpOf(k) === g).length + ')'])).map(o => `<option value="${o[0]}"${o[0] === s.g ? ' selected' : ''}>${esc(o[1])}</option>`).join('')}</select><input type="search" class="srch" placeholder="${T('কী বা লেখা খুঁজুন', 'Search key or text')}" value="${esc(s.q)}" data-pi="sitefilter"></div><div id="site-list">${listHtml()}</div>`; };
  PX.CHG.sitefilter = el => { ST().q = el.value; document.getElementById('site-list').innerHTML = listHtml(); };
  PX.CHG.sitegrp = el => { ST().g = el.value; ST().q = ''; PX.refresh(); };
  F.sitetxt = (f, d) => { const k = f.dataset.k, tx = SD().texts; (d.bn || '').trim() && (d.bn.trim() !== I.bn[k]) ? tx.bn[k] = d.bn.trim() : delete tx.bn[k]; (d.en || '').trim() && (d.en.trim() !== I.en[k]) ? tx.en[k] = d.en.trim() : delete tx.en[k]; done(T('লেখা হালনাগাদ হয়েছে', 'Text updated')); };
  A.sitetxtreset = a => { delete SD().texts.bn[a.dataset.k]; delete SD().texts.en[a.dataset.k]; done(T('ডিফল্টে ফিরেছে', 'Reset to default')); };

  /* ---- ব্র্যান্ড ও লোগো ---- */
  const brand = () => { const b = SD().brand; return UI.card(T('ব্র্যান্ড, লোগো ও রং', 'Brand, logo & colour'), `<form data-pf="sitebrand" class="fgrid">
    ${UI.fi({ name: 'name', label: T('সাইটের নাম (ব্রাউজার ট্যাব ও লোগোর alt)', 'Site name (browser tab & logo alt)'), val: b.name, ph: 'ছাত্র.com' })}
    ${imgField('logo', b.logo, T('হেডার লোগো', 'Header logo'), 'logo')}
    ${imgField('logoFooter', b.logoFooter, T('ফুটার লোগো (ফাঁকা থাকলে হেডার লোগো)', 'Footer logo (blank = header logo)'), 'logoFooter')}
    ${imgField('favicon', b.favicon, T('ফেভিকন (ব্রাউজার ট্যাবের আইকন)', 'Favicon (browser tab icon)'), 'favicon')}
    <div class="fld half"><label>${T('প্রধান রং', 'Primary colour')}</label><div class="clr"><input type="color" name="colorpick" value="${/^#[0-9a-f]{6}$/i.test(b.color) ? b.color : '#8C52FF'}" data-pi="sitecolor"><input name="color" value="${esc(b.color)}" placeholder="#8C52FF" maxlength="7"></div><small class="soft">${T('ফাঁকা = ডিফল্ট বেগুনি', 'Blank = default purple')}</small></div>
    ${UI.fi({ name: 'copyright', label: T('ফুটারের কপিরাইট লাইন (ফাঁকা = ডিফল্ট)', 'Footer copyright line (blank = default)'), half: 1, val: b.copyright })}
    <div class="fld"><small class="err" id="sb-err" role="alert"></small><button class="btn btn-p">${T('সংরক্ষণ ও প্রয়োগ', 'Save & apply')}</button></div></form>`); };
  PX.CHG.sitecolor = el => { el.form.elements.color.value = el.value; };
  F.sitebrand = (f, d) => { const er = f.querySelector('#sb-err'), c = (d.color || '').trim(); if (c && !/^#[0-9a-f]{6}$/i.test(c)) { er.textContent = T('রং #RRGGBB ফরম্যাটে দিন', 'Colour must be like #8C52FF'); return; } Object.assign(SD().brand, { name: (d.name || '').trim(), logo: d.logo || '', logoFooter: d.logoFooter || '', favicon: d.favicon || '', color: c, copyright: (d.copyright || '').trim() }); done(T('ব্র্যান্ড সেটিংস প্রয়োগ হয়েছে', 'Brand settings applied')); };

  /* ---- ব্যানার ---- */
  const banners = () => { const b = SD().bar;
    const bar = UI.card(T('টপ অ্যানাউন্সমেন্ট বার (সব পেজের ওপরে)', 'Top announcement bar (above every page)'), `<form data-pf="sitebar" class="fgrid"><label class="ck full"><input type="checkbox" name="on" ${b.on ? 'checked' : ''}><span>${T('বারটি দেখান', 'Show the bar')}</span></label>
      ${UI.fi({ name: 'tbn', label: T('লেখা (বাংলা)', 'Text (Bangla)'), val: b.text.bn, half: 1 })}${UI.fi({ name: 'ten', label: T('লেখা (English)', 'Text (English)'), val: b.text.en, half: 1 })}
      ${UI.fi({ name: 'link', label: T('লিংক (ঐচ্ছিক, যেমন #courses)', 'Link (optional, e.g. #courses)'), val: b.link, half: 1 })}
      <div class="fld half"><label>${T('ব্যাকগ্রাউন্ড রং', 'Background colour')}</label><input type="color" name="bg" value="${esc(b.bg || '#8C52FF')}"></div>
      <div class="fld"><button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></div></form>`);
    const sl = CH.SLIDES.map(s => { const o = SD().slides[s.k] || {}, g = (sfx, l) => (SD().texts[l][s.k + sfx] || I[l][s.k + sfx] || '');
      return UI.card(T('হোম ব্যানার স্লাইড', 'Home banner slide') + ' — ' + s.k.toUpperCase(), `<form data-pf="siteslide" data-k="${s.k}" class="fgrid"><label class="ck full"><input type="checkbox" name="show" ${o.off ? '' : 'checked'}><span>${T('এই স্লাইড দেখান', 'Show this slide')}</span></label>
        ${imgField('img', o.img, T('ব্যানার ছবি (ফাঁকা = ডিফল্ট ইলাস্ট্রেশন)', 'Banner image (blank = default illustration)'), 'img')}
        ${[['e', T('ছোট শিরোনাম', 'Eyebrow')], ['t', T('মূল শিরোনাম', 'Headline')], ['d', T('বিবরণ', 'Description')], ['c', T('বাটনের লেখা', 'Button text')]].map(x => `${UI.fi({ name: x[0] + '_bn', label: x[1] + ' (বাংলা)', val: g('_' + x[0], 'bn'), half: 1 })}${UI.fi({ name: x[0] + '_en', label: x[1] + ' (English)', val: g('_' + x[0], 'en'), half: 1 })}`).join('')}
        <div class="fld"><button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></div></form>`); }).join('');
    return bar + sl; };
  F.sitebar = (f, d) => { Object.assign(SD().bar, { on: !!(d.on && d.on.length), text: { bn: (d.tbn || '').trim(), en: (d.ten || '').trim() }, link: (d.link || '').trim(), bg: d.bg || '#8C52FF' }); done(T('টপ বার সংরক্ষিত', 'Top bar saved')); };
  F.siteslide = (f, d) => { const k = f.dataset.k, tx = SD().texts; SD().slides[k] = { off: !(d.show && d.show.length), img: d.img || '' }; ['e', 't', 'd', 'c'].forEach(x => { ['bn', 'en'].forEach(l => { const v = (d[x + '_' + l] || '').trim(), key = k + '_' + x; if (v && v !== I[l][key]) tx[l][key] = v; else delete tx[l][key]; }); }); done(T('স্লাইড সংরক্ষিত', 'Slide saved')); };

  /* ---- হেডার ও মেনু ---- */
  const NAVK = [['home', 'nav_home'], ['courses', 'nav_courses'], ['teachers', 'nav_teachers'], ['how', 'nav_how'], ['blog', 'nav_blog'], ['contact', 'nav_contact'], ['become', 'nav_become']];
  const menu = () => UI.card(T('হেডার মেনু', 'Header menu'), `<p class="soft">${T('মেনুর নাম বদলান বা কোনো আইটেম লুকিয়ে রাখুন।', 'Rename menu items or hide any of them.')}</p><form data-pf="sitenav" class="fgrid">${NAVK.concat([['login', 'login'], ['signup', 'signup']]).map(([n, k]) => `<div class="fld full navrow"><label class="ck"><input type="checkbox" name="show_${n}" ${SD().nav.hidden[n] ? '' : 'checked'}><span><code>${n}</code></span></label><input name="bn_${k}" value="${esc(SD().texts.bn[k] || I.bn[k] || '')}" placeholder="বাংলা"><input name="en_${k}" value="${esc(SD().texts.en[k] || I.en[k] || '')}" placeholder="English"></div>`).join('')}<div class="fld"><button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></div></form>`);
  F.sitenav = (f, d) => { const tx = SD().texts; NAVK.concat([['login', 'login'], ['signup', 'signup']]).forEach(([n, k]) => { if (n !== 'login' && n !== 'signup') SD().nav.hidden[n] = !(d['show_' + n] && d['show_' + n].length); ['bn', 'en'].forEach(l => { const v = (d[l + '_' + k] || '').trim(); if (v && v !== I[l][k]) tx[l][k] = v; else delete tx[l][k]; }); }); done(T('মেনু সংরক্ষিত', 'Menu saved')); };

  /* ---- ব্যাকআপ / রিসেট ---- */
  A.siteexp = () => XL.save(new Blob([JSON.stringify(SD(), null, 2)], { type: 'application/json' }), 'chaatro-website-settings.json');
  PX.CHG.siteimp = el => { const f = el.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const o = JSON.parse(r.result); if (!o || typeof o !== 'object' || !o.brand || !o.texts) throw 0; SITE.replace(o); done(T('সেটিংস ইমপোর্ট হয়েছে', 'Settings imported')); } catch (e) { PX.toast(T('সঠিক সেটিংস ফাইল নয়', 'Not a valid settings file')); } }; r.readAsText(f); };
  A.sitereset = () => { if (!confirm(T('সব ওয়েবসাইট সেটিংস ডিফল্টে ফিরবে। নিশ্চিত?', 'Reset all website settings to default?'))) return; SITE.reset(); done(T('ডিফল্টে ফিরেছে', 'Reset to defaults')); };
  const backup = () => UI.card(T('ব্যাকআপ ও রিসেট', 'Backup & reset'), `<p class="soft">${T('ডেমোতে এই সেটিংস শুধু এই ব্রাউজারে জমা থাকে। আসল সিস্টেমে এই JSON ব্যাকএন্ডে সংরক্ষিত হবে।', 'In the demo these settings are kept in this browser only. In the real system this JSON is stored in the backend.')}</p><div class="btns"><button class="btn btn-o btn-sm" data-pa="siteexp">${ic('download')} ${T('JSON এক্সপোর্ট', 'Export JSON')}</button> <label class="btn btn-o btn-sm upl">${ic('upload')} ${T('JSON ইমপোর্ট', 'Import JSON')}<input type="file" accept="application/json" data-pc="siteimp" hidden></label> <button class="btn btn-o btn-sm danger" data-pa="sitereset">${T('সব ডিফল্টে ফেরান', 'Reset everything')}</button> <a class="btn btn-p btn-sm" href="#home" target="_blank" rel="noopener">${ic('arrow')} ${T('ওয়েবসাইট দেখুন', 'Open website')}</a></div>`);

  PX.siteUI = () => { const cur = PX.S.tab.site || 'brand', tabs = [['brand', T('ব্র্যান্ড ও লোগো', 'Brand & logo')], ['banners', T('ব্যানার', 'Banners')], ['menu', T('হেডার ও মেনু', 'Header & menu')], ['text', T('পেজের লেখা', 'Page content')]];
    return UI.tabs('site', tabs, cur) + (cur === 'brand' ? brand() : cur === 'banners' ? banners() : cur === 'menu' ? menu() : UI.card(T('ফুটার, যোগাযোগ ও সব লেখা', 'Footer, contact & all text'), textEditor())) + backup(); };
})();
