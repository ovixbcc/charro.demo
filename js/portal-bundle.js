/* অ্যাডমিন: বান্ডেল কোর্স তৈরি (সুপার অ্যাডমিন ও একাডেমিক) */
(function () {
  'use strict';
  const PX = window.PX, { T, n, mny, esc, fd, ic, TODAY } = PX, UI = PX.ui, DB = PX.DB, L = CH.L;
  const can = () => !!DB.levels[PX.S.level].perms.courses;
  const price = c => pricingFor(c)[c.formats[0]].fullD;
  const calcSel = (ids, disc) => { const cs = ids.map(id => COURSES.find(c => c.id === id)).filter(Boolean), total = cs.reduce((s, c) => s + price(c), 0), p = round50(total * (100 - disc) / 100); return { cs, total, p, save: total - p }; };
  const prevHtml = (ids, disc) => {
    if (ids.length < 2) return `<p class="soft">${T('কমপক্ষে ২টি কোর্স বেছে নিন।', 'Pick at least 2 courses.')}</p>`;
    const k = calcSel(ids, disc);
    return `<dl class="sum"><div><dt>${T('কোর্স', 'Courses')}</dt><dd>${n(k.cs.length)}</dd></div><div><dt>${T('আলাদা কিনলে', 'Separately')}</dt><dd>${mny(k.total)}</dd></div><div class="ok"><dt>${T('ছাড়', 'Discount')} (${n(disc)}%)</dt><dd>− ${mny(k.save)}</dd></div><div class="tot"><dt>${T('বান্ডেল দাম', 'Bundle price')}</dt><dd>${mny(k.p)}</dd></div></dl>`;
  };
  const statusChip = b => b.active ? UI.chip(T('চালু', 'Live'), 'ok') : UI.chip(T('বন্ধ', 'Off'));
  const byL = b => b.by === 'admin' || !DB.levels[b.by] ? T('অ্যাডমিন', 'Admin') : DB.levels[b.by].label;

  PX.sec.a.bundles = () => {
    if (!can()) return UI.card('', `<div class="alert bad">${ic('shield')}<div><b>${T('এই লেভেলে অ্যাক্সেস নেই', 'No access at this level')}</b></div></div>`);
    const items = COURSES.map(c => [c.id, `${L(c.title)} — ${L(PX.TEACH(c.teacher).n)} · #${c.pid || ''} · ${mny(price(c))}`]);
    const form = `<form data-pf="bundle" class="fgrid bd-f">
      ${UI.fi({ name: 'title', label: T('বান্ডেলের নাম', 'Bundle name'), req: 1 })}
      ${UI.fi({ name: 'desc', label: T('সংক্ষিপ্ত বিবরণ', 'Short description'), rows: 2 })}
      ${UI.fi({ name: 'disc', label: T('বান্ডেল ছাড় (%)', 'Bundle discount (%)'), type: 'number', val: 10, min: 1, half: 1, req: 1, hint: T('১–৭০; সব কোর্সের দামের যোগফল থেকে কাটা হবে', '1–70; taken off the sum of course prices') })}
      <div class="fld bd-srch"><label for="bdq">${T('টিচার বা কোর্সের নাম / আইডি দিয়ে খুঁজুন', 'Search by teacher or course name / ID')}</label><div class="bd-srow"><input id="bdq" type="search" data-pi="bdq" placeholder="${T('যেমন: তানভীর, গণিত, 3001', 'e.g. Tanvir, Math, 3001')}" autocomplete="off"><button type="button" class="btn btn-o btn-sm" data-pa="bdall">${T('দেখানো সবগুলো বেছে নিন', 'Select all shown')}</button></div><small class="hint" id="bdq-n"></small></div>
      ${UI.checks('cs', items, [], T('কোর্স বেছে নিন (৩টি, ৪টি বা যত খুশি)', 'Pick courses (3, 4 or as many as you like)')).replace(/name="cs"/g, 'name="cs" data-pc="bdpick"')}
      <div class="fld"><div id="bd-prev">${prevHtml([], 10)}</div><small class="err" id="bd-err" role="alert"></small><button class="btn btn-p">${T('বান্ডেল তৈরি করুন', 'Create bundle')}</button></div></form>`.replace('name="disc"', 'name="disc" data-pc="bdpick"');
    const rows = BUNDLES.map(b => { const k = bundleCalc(b); return [`<b>${esc(L(b.title))}</b><small class="soft">${k.cs.map(c => esc(L(c.title))).join(' + ')}</small>`, n(k.cs.length), `${mny(k.price)} <s>${mny(k.total)}</s>`, n(b.disc) + '%', esc(byL(b)), statusChip(b), `<button class="btn btn-o btn-sm" data-pa="bdtoggle" data-id="${b.id}">${b.active ? T('বন্ধ করুন', 'Disable') : T('চালু করুন', 'Enable')}</button> <button class="btn btn-o btn-sm" data-pa="bddel" data-id="${b.id}">${T('মুছুন', 'Delete')}</button>`]; });
    return UI.card(T('নতুন বান্ডেল অফার', 'New bundle offer'), form) +
      UI.card(T('সব বান্ডেল', 'All bundles'), rows.length ? UI.tbl([T('বান্ডেল', 'Bundle'), T('কোর্স', 'Courses'), T('দাম', 'Price'), T('ছাড়', 'Off'), T('কে বানিয়েছেন', 'Created by'), T('অবস্থা', 'Status'), ''], rows) : UI.empty(T('এখনো কোনো বান্ডেল নেই', 'No bundles yet'))) +
      `<p class="soft">${T('চালু বান্ডেল হোম পেজে ও ', 'Live bundles show on the home page and at ')}<a href="#bundles">/#bundles</a>${T(' পেজে দেখায়।', '.')}</p>`;
  };
  PX.CHG.bdq = el => {
    const q = el.value.toLowerCase().trim(), f = el.form; let shown = 0;
    f.querySelectorAll('.ck-g .ck').forEach(l => { const ok = !q || l.textContent.toLowerCase().includes(q); l.hidden = !ok; if (ok) shown++; });
    const h = document.getElementById('bdq-n'); if (h) h.textContent = q ? T(shown + 'টি কোর্স পাওয়া গেছে', shown + ' course(s) found') : '';
  };
  PX.ACT.bdall = a => { const f = a.closest('form'); f.querySelectorAll('.ck-g .ck:not([hidden]) input').forEach(i => { i.checked = true; }); PX.CHG.bdpick(f.querySelector('[name=cs]')); };
  PX.CHG.bdpick = el => {
    const f = el.form, ids = Array.from(f.querySelectorAll('[name=cs]:checked')).map(x => x.value), disc = Math.min(70, Math.max(1, +f.elements.disc.value || 0));
    document.getElementById('bd-prev').innerHTML = prevHtml(ids, disc);
  };
  PX.FORMS.bundle = (f, d) => {
    const er = f.querySelector('#bd-err'), bad = m => { er.textContent = m; }, ids = d.cs || [], disc = +d.disc;
    if (!can()) return bad(T('অনুমতি নেই', 'Not allowed'));
    if (!(d.title || '').trim()) return bad(T('বান্ডেলের নাম দিন', 'Enter a bundle name'));
    if (ids.length < 2) return bad(T('কমপক্ষে ২টি কোর্স বেছে নিন', 'Pick at least 2 courses'));
    if (ids.length > 12) return bad(T('সর্বোচ্চ ১২টি কোর্স', 'At most 12 courses'));
    if (!(disc >= 1 && disc <= 70)) return bad(T('ছাড় ১–৭০% এর মধ্যে হতে হবে', 'Discount must be 1–70%'));
    const t = d.title.trim(), ds = (d.desc || '').trim();
    BUNDLES.unshift({ id: 'b' + String(Date.now()).slice(-6), courses: ids.slice(), disc, active: true, by: PX.S.level, title: { bn: t, en: t }, desc: ds ? { bn: ds, en: ds } : null });
    PX.toast(T('বান্ডেল তৈরি হয়েছে এবং সাইটে লাইভ', 'Bundle created and live on the site')); PX.refresh();
  };
  PX.ACT.bdtoggle = a => { const b = BUNDLES.find(x => x.id === a.dataset.id); if (b) b.active = !b.active; PX.refresh(); };
  PX.ACT.bddel = a => { const i = BUNDLES.findIndex(x => x.id === a.dataset.id); if (i >= 0) BUNDLES.splice(i, 1); PX.toast(T('বান্ডেল মুছে ফেলা হয়েছে', 'Bundle deleted')); PX.refresh(); };

  const navA = PX.nav.a;
  PX.nav.a = () => { const l = navA(); if (!can()) return l; const i = l.findIndex(x => x.k === 'courses'); l.splice(i < 0 ? l.length : i + 1, 0, { k: 'bundles', l: T('বান্ডেল কোর্স', 'Bundle courses'), i: 'plus', also: [], badge: '' }); return l; };
})();
