/* কনফার্ম পপ-আপ: টিচার/অ্যাডমিন যেকোনো অ্যাপ্রুভ, অ্যাকসেপ্ট, ডিলিট, আনডু করতে গেলে পপ-আপে নিশ্চিত করতে হবে; অ্যাপ্রুভ/রিজেক্টে কারণ লিখতে হবে। রিকোয়েস্ট উইথড্রও কনফার্ম হয়। সব সিদ্ধান্ত লগে থাকে */
(function () {
  const PX = window.PX, { T, esc, ic } = PX, DB = PX.DB, UI = PX.ui;
  DB.audit = DB.audit || [];
  const roleNow = () => (location.hash.match(/^#([ast])-/) || [])[1] || '';
  const K = {
    approve: { t: ['অনুমোদন করবেন?', 'Approve this?'], m: ['অনুমোদনের কারণ লিখে OK চাপুন।', 'Write the reason for approving, then click OK.'], reason: 'req', ok: ['OK', 'OK'] },
    reject: { t: ['বাতিল করবেন?', 'Reject this?'], m: ['বাতিলের কারণ লিখে OK চাপুন।', 'Write the reason for rejecting, then click OK.'], reason: 'req', ok: ['OK', 'OK'], danger: 1 },
    del: { t: ['মুছে ফেলবেন?', 'Delete this?'], m: ['এটি মুছে গেলে আর ফেরানো যাবে না।', 'Once deleted, this cannot be undone.'], reason: '', ok: ['হ্যাঁ, মুছুন', 'Yes, delete'], danger: 1 },
    undo: { t: ['পরিবর্তন করবেন?', 'Change this?'], m: ['আপনি কি নিশ্চিত?', 'Are you sure you want to do this?'], reason: '', ok: ['হ্যাঁ, নিশ্চিত', 'Yes, confirm'] },
    accept: { t: ['নিশ্চিত করবেন?', 'Confirm this?'], m: ['আপনি কি এটি গ্রহণ/নিশ্চিত করতে চান?', 'Do you want to accept / confirm this?'], reason: '', ok: ['হ্যাঁ, নিশ্চিত', 'Yes, confirm'] },
    wd: { t: ['রিকোয়েস্ট প্রত্যাহার করবেন?', 'Withdraw this request?'], m: ['প্রত্যাহার করলে রিকোয়েস্টটি আর বিবেচনায় থাকবে না।', 'Once withdrawn, the request will no longer be considered.'], reason: '', ok: ['হ্যাঁ, প্রত্যাহার', 'Yes, withdraw'], danger: 1 },
  };
  const ACTS = {
    approve: ['rqok', 'blgpub'], reject: ['rqno'],
    del: ['rvdel', 'andel', 'tgdel', 'poldel', 'bgxdel', 'bddel', 'blgrm', 'paydel', 'bdall'],
    undo: ['ban', 'coff', 'con', 'stublock', 'blgunpub', 'bgxtog', 'bdtoggle', 'cttoggle', 'progtoggle', 'emtog', 'antog', 'subtoggle', 'tkclose', 'tkreopen', 'blockcls', 'unblockcls', 'cptoggle'],
    accept: ['refpay', 'p2pdone'],
    wd: ['paywd', 'cwd', 'rqwd', 'blgwd', 'p2pclose', 'p2pwd'],
  };
  const KIND = {}; Object.keys(ACTS).forEach(k => ACTS[k].forEach(a => { KIND[a] = k; }));
  const log = (act, label, reason) => { DB.audit.unshift({ at: new Date().toISOString().slice(0, 16).replace('T', ' '), role: roleNow(), act, label, reason: reason || '' }); };

  const ask = (kind, label, cb) => {
    const k = K[kind], old = document.getElementById('pconfirm'); if (old) old.remove();
    const el = document.createElement('div'); el.id = 'pconfirm'; el.className = 'cf-ov';
    el.innerHTML = `<div class="cf-box" role="alertdialog" aria-modal="true" tabindex="-1"><h3>${T(k.t[0], k.t[1])}</h3>${label ? `<p class="cf-l">${esc(label)}</p>` : ''}<p>${T(k.m[0], k.m[1])}</p>
      ${k.reason ? `<textarea rows="3" placeholder="${T('কারণ লিখুন…', 'Write the reason…')}" aria-label="${T('কারণ', 'Reason')}"></textarea>` : ''}<small class="err" role="alert"></small>
      <div class="cf-b"><button type="button" class="btn btn-o" data-cf="no">${T('বাতিল', 'Cancel')}</button><button type="button" class="btn ${k.danger ? 'btn-p danger' : 'btn-p'}" data-cf="ok">${T(k.ok[0], k.ok[1])}</button></div></div>`;
    document.body.appendChild(el);
    const ta = el.querySelector('textarea'); (ta || el.querySelector('.cf-box')).focus();
    const close = () => el.remove();
    el.addEventListener('click', e => {
      if (e.target === el || e.target.dataset.cf === 'no') { close(); return; }
      if (e.target.dataset.cf === 'ok') {
        const v = ta ? ta.value.trim() : ''; if (k.reason === 'req' && v.length < 3) { el.querySelector('.err').textContent = T('কারণ লিখুন (কমপক্ষে ৩ অক্ষর)', 'Write a reason (at least 3 characters)'); ta.focus(); return; }
        close(); cb(v);
      }
    });
    el.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  };
  PX.confirm = ask;

  /* অ্যাকশন র‍্যাপ */
  Object.keys(KIND).forEach(name => {
    const orig = PX.ACT[name]; if (!orig) return;
    PX.ACT[name] = function (a, ...r) {
      if (PX._cfOk) return orig.call(this, a, ...r);
      const role = roleNow(), kind = KIND[name];
      if (role === 's' && kind !== 'wd') return orig.call(this, a, ...r);
      const label = (a.getAttribute('aria-label') || a.textContent || '').trim();
      ask(kind, label, reason => { PX._cfOk = true; try { orig.call(this, a, ...r); } finally { PX._cfOk = false; } log(name, label, reason); });
    };
  });

  /* ফর্ম-ভিত্তিক অনুমোদন */
  const wrapF = (name, kindOf) => {
    const orig = PX.FORMS[name]; if (!orig) return;
    PX.FORMS[name] = function (f, d) {
      if (PX._cfOk || !f.checkValidity()) return orig.call(this, f, d);
      const kind = kindOf(d); if (!kind) return orig.call(this, f, d);
      ask(kind, (f.closest('.m-box') || {}).querySelector ? ((f.closest('.m-box').querySelector('h3') || {}).textContent || '').trim() : '', reason => { PX._cfOk = true; try { orig.call(this, f, d); } finally { PX._cfOk = false; } log(name + ':' + (d.dec || ''), (f.closest('.m-box') && (f.closest('.m-box').querySelector('h3') || {}).textContent || '').trim(), reason); });
    };
  };
  wrapF('apdec', d => d.dec === 'approved' ? 'approve' : 'reject');
  wrapF('cdec', d => d.dec === 'approve' ? 'approve' : 'reject');
  wrapF('payconfirm', d => (d.ref || '').trim().length >= 4 ? 'approve' : '');
  wrapF('manpayout', () => 'accept');

  /* স্ট্যাটাস চিপ: প্রত্যাহৃত */
  const sc = UI.stChip; UI.stChip = s => s === 'withdrawn' ? UI.chip(T('প্রত্যাহৃত', 'Withdrawn'), '') : sc(s);

  /* সিদ্ধান্ত লগ (সেটিংসে) */
  PX.sec.a.declog = () => UI.card(T('সিদ্ধান্তের লগ', 'Decision log'), `<p class="soft">${T('অ্যাপ্রুভ, রিজেক্ট, ডিলিট, আনডু ও উইথড্র — কে কী করেছে ও কারণ।', 'Approvals, rejections, deletions, undo and withdrawals — who did what, and why.')}</p>` +
    UI.tbl([T('সময়', 'Time'), T('কে', 'By'), T('কাজ', 'Action'), T('কারণ', 'Reason')], DB.audit.map(x => [esc(x.at), x.role === 'a' ? T('অ্যাডমিন', 'Admin') : x.role === 't' ? T('টিচার', 'Teacher') : T('স্টুডেন্ট', 'Student'), `<b>${esc(x.label || x.act)}</b><br><small class="mute">${esc(x.act)}</small>`, esc(x.reason) || '—'])));
  const pn = PX.nav.a; PX.nav.a = () => { const l = pn(); if (DB.levels[PX.S.level].perms.settings) l.push({ k: 'declog', l: T('সিদ্ধান্তের লগ', 'Decision log'), i: 'file', also: [], badge: '' }); return l; };
})();
