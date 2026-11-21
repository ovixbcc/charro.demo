/* অ্যাডমিন সেটিংস → পেমেন্ট গেটওয়ে (EPS ডিফল্ট). সিক্রেট কী সার্ভারে (Vercel Environment Variables) থাকে; এখানে চালু/বন্ধ, ডিফল্ট, কানেকশন টেস্ট */
(function () {
  const PX = window.PX, { T, esc, ic } = PX, DB = PX.DB, UI = PX.ui;
  const canW = () => DB.levels[PX.S.level].perms.settings >= 2;
  const ENV = [
    ['EPS_USERNAME', T('EPS ইউজারনেম (ইমেইল)', 'EPS username (email)')], ['EPS_PASSWORD', T('EPS পাসওয়ার্ড', 'EPS password')], ['EPS_HASH_KEY', T('হ্যাশ কী (Hash Key)', 'Hash key')],
    ['EPS_MERCHANT_ID', T('মার্চেন্ট আইডি (UUID)', 'Merchant ID (UUID)')], ['EPS_STORE_ID', T('স্টোর আইডি (UUID)', 'Store ID (UUID)')], ['EPS_SANDBOX', T('true = স্যান্ডবক্স (টেস্ট), false বা ফাঁকা = লাইভ', 'true = sandbox (test), false or empty = live')],
  ];
  let ST = null;
  const stBox = () => {
    if (!ST) return `<p class="soft">${T('সার্ভারের অবস্থা দেখতে "কানেকশন চেক" চাপুন।', 'Press "Check connection" to see the server status.')}</p>`;
    if (ST.err) return `<div class="alert bad">${ic('close')}<div><b>${T('সার্ভারে পৌঁছানো যায়নি', 'Could not reach the server')}</b><p>${T('এই API শুধু Vercel-এ ডেপ্লয় করা সাইটে চলে। লোকাল ফাইল থেকে খুললে কাজ করবে না।', 'These APIs only run on the deployed Vercel site, not from a local file.')}</p></div></div>`;
    const miss = ST.missing || [];
    return `<div class="alert ${ST.configured ? 'ok' : 'warn'}">${ic(ST.configured ? 'check' : 'shield')}<div><b>${ST.configured ? T('সব কী সেট করা আছে', 'All keys are set') : T('কিছু কী বাকি', 'Some keys are missing')} · ${ST.mode === 'sandbox' ? T('স্যান্ডবক্স (টেস্ট) মোড', 'Sandbox (test) mode') : T('লাইভ মোড', 'Live mode')}</b>
      ${miss.length ? `<p>${T('বাকি আছে:', 'Missing:')} <code>${miss.join(', ')}</code></p>` : ''}${ST.auth ? `<p>${ST.auth === 'ok' ? T('EPS-এর সঙ্গে লগইন সফল ✔', 'EPS login successful ✔') : T('EPS লগইন ব্যর্থ: ', 'EPS login failed: ') + esc(ST.error || '')}</p>` : ''}${ST.keyMode ? `<p class="soft">${T('হ্যাশ কী মোড:', 'Hash key mode:')} <code>${esc(ST.keyMode)}</code></p>` : ''}${ST.diag ? `<p class="soft" style="word-break:break-all"><code>${esc(ST.diag.endpoint || '')}</code><br>${T('ইউজারনেম', 'Username')}: <code>${esc(ST.diag.username)}</code> · ${T('পাসওয়ার্ড দৈর্ঘ্য', 'Password length')}: <code>${ST.diag.password_len}</code> · ${T('হ্যাশ কী দৈর্ঘ্য', 'Hash key length')}: <code>${ST.diag.hashkey_len}</code><br>Merchant: <code>${esc(ST.diag.merchant)}</code> · Store: <code>${esc(ST.diag.store)}</code></p>` : ''}</div></div>`;
  };
  PX.sec.a.gateway = () => {
    const g = PGW.get().eps, w = canW();
    return UI.card(T('পেমেন্ট গেটওয়ে', 'Payment gateways'), `<p class="soft">${T('EPS (Easy Payment System) ডিফল্ট গেটওয়ে। স্টুডেন্ট চেকআউটে অনলাইন পেমেন্ট হিসেবে EPS দেখাবে।', 'EPS (Easy Payment System) is the default gateway. Students see it as the online payment option at checkout.')}</p>
      <div class="gw-h"><b>EPS</b> ${UI.chip(T('ডিফল্ট', 'Default'), 'ok')} ${g.on ? UI.chip(T('চালু', 'On'), 'ok') : UI.chip(T('বন্ধ', 'Off'), '')}</div>
      <form data-pf="gwsave" class="fgrid">
        <label class="ck full"><input type="checkbox" name="on" ${g.on ? 'checked' : ''} ${w ? '' : 'disabled'}><span>${T('চেকআউটে EPS চালু করুন', 'Enable EPS at checkout')}</span></label>
        <label class="ck full"><input type="checkbox" name="def" ${g.def ? 'checked' : ''} ${w ? '' : 'disabled'}><span>${T('ডিফল্ট হিসেবে আগে থেকে বাছাই থাকবে', 'Pre-select as the default method')}</span></label>
        ${UI.fi({ name: 'bn', label: T('চেকআউটে নাম (বাংলা)', 'Checkout label (Bangla)'), val: g.bn, half: 1 })}${UI.fi({ name: 'en', label: T('চেকআউটে নাম (ইংরেজি)', 'Checkout label (English)'), val: g.en, half: 1 })}
        ${w ? `<div class="fld"><button class="btn btn-p btn-sm">${T('সংরক্ষণ', 'Save')}</button></div>` : ''}</form>`) +
      UI.card(T('সার্ভার কানেকশন', 'Server connection'), `<div id="eps-st">${stBox()}</div><p><button class="btn btn-o btn-sm" data-pa="epscheck" data-t="0">${T('কানেকশন চেক', 'Check connection')}</button> <button class="btn btn-o btn-sm" data-pa="epscheck" data-t="1">${T('EPS লগইন টেস্ট', 'Test EPS login')}</button></p>
        <p class="soft">${T('রিটার্ন/কলব্যাক লিংক (সব সফল/ব্যর্থ/বাতিলে একই):', 'Return / callback URL (same for success / fail / cancel):')} <code>${esc(location.origin)}/api/eps/return</code></p>`) +
      UI.card(T('API কী বসানোর নিয়ম (লাইভ করতে)', 'How to add the API keys (go live)'), `<p class="soft">${T('নিরাপত্তার জন্য পাসওয়ার্ড ও হ্যাশ কী ব্রাউজারে বা এই প্যানেলে রাখা হয় না; সার্ভারে Environment Variable হিসেবে থাকে।', 'For security, the password and hash key are never kept in the browser or this panel; they live on the server as environment variables.')}</p>
        ${UI.tbl([T('ভেরিয়েবল', 'Variable'), T('কী দেবেন', 'What to enter')], ENV.map(e => [`<code>${e[0]}</code>`, e[1]]))}
        <ol class="gw-steps"><li>${T('Vercel → আপনার প্রজেক্ট → Settings → Environment Variables খুলুন।', 'Vercel → your project → Settings → Environment Variables.')}</li><li>${T('উপরের ৬টি ভেরিয়েবল বসান। প্রথমে EPS_SANDBOX = true দিয়ে EPS-এর স্যান্ডবক্স কী ব্যবহার করুন।', 'Add the 6 variables above. Start with EPS_SANDBOX = true and the sandbox keys from EPS.')}</li><li>${T('Deployments থেকে Redeploy করুন, তারপর এখানে "EPS লগইন টেস্ট" চাপুন।', 'Redeploy from Deployments, then press "Test EPS login" here.')}</li><li>${T('টেস্ট পেমেন্ট ঠিক হলে লাইভ কী বসিয়ে EPS_SANDBOX = false করুন, Redeploy করুন, আর উপরে "চেকআউটে EPS চালু করুন" টিক দিন।', 'When the test payment works, put the live keys, set EPS_SANDBOX = false, redeploy, and tick "Enable EPS at checkout" above.')}</li></ol>`);
  };
  PX.FORMS.gwsave = (f, d) => {
    if (!canW()) return; const c = PGW.get(); c.eps = Object.assign(c.eps, { on: !!(d.on || []).length, def: !!(d.def || []).length, bn: (d.bn || '').trim() || c.eps.bn, en: (d.en || '').trim() || c.eps.en });
    PGW.save(c); PX.toast(T('গেটওয়ে সেটিংস সংরক্ষিত', 'Gateway settings saved')); PX.refresh();
  };
  PX.ACT.epscheck = async a => {
    const box = document.getElementById('eps-st'), t = a.dataset.t === '1'; if (box) box.innerHTML = `<p class="soft">${T('চেক করা হচ্ছে…', 'Checking…')}</p>`;
    try { const r = await fetch('/api/eps/status' + (t ? '?test=1' : '')); ST = await r.json(); if (!ST || ST.ok !== true) ST = { err: 1 }; } catch (e) { ST = { err: 1 }; }
    const b = document.getElementById('eps-st'); if (b) b.innerHTML = stBox();
  };
  const pn = PX.nav.a; PX.nav.a = () => { const l = pn(); if (DB.levels[PX.S.level].perms.settings) l.push({ k: 'gateway', l: T('পেমেন্ট গেটওয়ে', 'Payment gateways'), i: 'award', also: [], badge: '' }); return l; };
})();
