/* টিচারের পেআউট মেথড: ব্যাংক অ্যাকাউন্ট বা মোবাইল ওয়ালেট (বিকাশ / নগদ / জিপে (GPay)) */
(function () {
  'use strict';
  const PX = window.PX, { T, n, mny, esc, fd, ic, TODAY } = PX, UI = PX.ui, DB = PX.DB;
  const TID = 't01';
  const WAL = [['bkash', 'bKash', 'বিকাশ', 1.85], ['nagad', 'Nagad', 'নগদ', 1.99], ['gpay', 'GPay', 'জিপে', 1.85]];
  const wl = k => { const w = WAL.find(x => x[0] === k); return w ? T(w[2], w[1]) : '—'; };
  PX.cashRate = k => (WAL.find(x => x[0] === k) || [0, 0, 0, 0])[3];
  DB.payAcc = DB.payAcc || {};
  /* ডেমো পেমেন্ট তথ্য: পেআউট টেস্টের জন্য */
  const B = (bankName, accName, accNo, routing, branch) => ({ bankName, accName, accNo, routing, branch });
  Object.assign(DB.payAcc, {
    t01: { pref: 'wallet', bank: null, wallet: { type: 'bkash', phone: '01711001001' } },
    t02: { pref: 'bank', bank: B('Dutch-Bangla Bank', 'Farhana Islam', '1051234567890', '090261234', 'Mohakhali'), wallet: null },
    t03: { pref: 'wallet', bank: null, wallet: { type: 'nagad', phone: '01822334455' } },
    t04: { pref: 'bank', bank: B('BRAC Bank', 'Nusrat Jahan', '1501203456001', '060261726', 'Dhanmondi'), wallet: { type: 'bkash', phone: '01933445566' } },
    t05: { pref: 'bank', bank: B('City Bank', 'Rakibul Hasan', '3101456789012', '225261234', 'Gulshan'), wallet: null },
    t06: { pref: 'wallet', bank: null, wallet: { type: 'gpay', phone: '01644556677' } },
    t07: { pref: 'wallet', bank: B('Islami Bank Bangladesh', 'Ariful Islam', '20501234567890', '125261234', 'Mirpur'), wallet: { type: 'bkash', phone: '01555667788' } }
  });
  const acc = tid => DB.payAcc[tid] || (DB.payAcc[tid] = { pref: '', bank: null, wallet: null });
  const mask = s => String(s).length > 4 ? '••••' + String(s).slice(-4) : s;
  const prefOf = a => (a.pref === 'wallet' && a.wallet) ? 'wallet' : (a.pref === 'bank' && a.bank) ? 'bank' : a.wallet ? 'wallet' : a.bank ? 'bank' : '';
  /* অ্যাডমিন ও টিচার দুজনেই ব্যবহার করে */
  PX.payMethod = tid => {
    const a = acc(tid), k = prefOf(a); if (!k) return null;
    if (k === 'bank') return { kind: 'bank', rate: 0, label: `${a.bank.bankName} · ${mask(a.bank.accNo)}`, a: a.bank };
    return { kind: 'wallet', rate: PX.cashRate(a.wallet.type), label: `${wl(a.wallet.type)} · ${a.wallet.phone}`, a: a.wallet };
  };
  PX.payCharge = (tid, amount) => { const m = PX.payMethod(tid); return m ? Math.round(amount * m.rate / 100) : 0; };

  const bankForm = b => `<form data-pf="paybank" class="fgrid">
    ${UI.fi({ name: 'bankName', label: T('ব্যাংকের নাম', 'Bank name'), val: b && b.bankName, half: 1, req: 1 })}
    ${UI.fi({ name: 'accName', label: T('অ্যাকাউন্টের নাম', 'Account name'), val: b && b.accName, half: 1, req: 1 })}
    ${UI.fi({ name: 'accNo', label: T('অ্যাকাউন্ট নম্বর', 'Account number'), val: b && b.accNo, half: 1, req: 1 })}
    ${UI.fi({ name: 'routing', label: T('রাউটিং নম্বর', 'Routing number'), val: b && b.routing, half: 1, req: 1, hint: T('৯ অঙ্ক', '9 digits') })}
    ${UI.fi({ name: 'branch', label: T('ব্রাঞ্চ', 'Branch'), val: b && b.branch, req: 1 })}
    <div class="fld"><small class="err" id="pb-err" role="alert"></small><button class="btn btn-p">${T('ব্যাংক সংরক্ষণ', 'Save bank account')}</button></div></form>`;
  const walForm = w => `<form data-pf="paywal" class="fgrid">
    ${UI.fi({ name: 'type', label: T('ওয়ালেটের ধরন', 'Wallet type'), val: w && w.type, half: 1, req: 1, opts: WAL.map(x => [x[0], T(x[2], x[1])]) })}
    ${UI.fi({ name: 'phone', label: T('ওয়ালেট নম্বর', 'Wallet number'), val: w && w.phone, half: 1, req: 1, ph: '01XXXXXXXXX', hint: T('শুধু একটি নম্বর', 'One number only') })}
    <div class="fld"><small class="err" id="pw-err" role="alert"></small><button class="btn btn-p">${T('ওয়ালেট সংরক্ষণ', 'Save wallet')}</button></div></form>`;

  PX.sec.t.payout = () => {
    const a = acc(TID), cur = prefOf(a), e = PX.teacherEarn(TID), m = PX.payMethod(TID), ch = m ? PX.payCharge(TID, e.due) : 0;
    const saved = (a.bank || a.wallet) ? UI.card(T('সংরক্ষিত পেআউট মেথড', 'Saved payout methods'), `<div class="pm-g">
      ${a.bank ? `<div class="pm ${cur === 'bank' ? 'on' : ''}"><b>${ic('award')} ${T('ব্যাংক', 'Bank')}</b><p>${esc(a.bank.bankName)} · ${esc(a.bank.branch)}</p><p>${esc(a.bank.accName)} · ${esc(mask(a.bank.accNo))}</p><p class="soft">${T('রাউটিং', 'Routing')}: ${esc(a.bank.routing)}</p><div class="pm-a">${cur === 'bank' ? UI.chip(T('প্রধান', 'Preferred'), 'ok') : `<button class="btn btn-o btn-sm" data-pa="paypref" data-k="bank">${T('প্রধান করুন', 'Make preferred')}</button>`}<button class="btn btn-o btn-sm" data-pa="paydel" data-k="bank">${T('মুছুন', 'Remove')}</button></div></div>` : ''}
      ${a.wallet ? `<div class="pm ${cur === 'wallet' ? 'on' : ''}"><b>${ic('phone')} ${T('ওয়ালেট', 'Wallet')}</b><p>${wl(a.wallet.type)}</p><p>${esc(a.wallet.phone)}</p><p class="soft">${T('ক্যাশ-আউট চার্জ', 'Cash-out charge')}: ${n(PX.cashRate(a.wallet.type))}%</p><div class="pm-a">${cur === 'wallet' ? UI.chip(T('প্রধান', 'Preferred'), 'ok') : `<button class="btn btn-o btn-sm" data-pa="paypref" data-k="wallet">${T('প্রধান করুন', 'Make preferred')}</button>`}<button class="btn btn-o btn-sm" data-pa="paydel" data-k="wallet">${T('মুছুন', 'Remove')}</button></div></div>` : ''}</div>`) : UI.card(T('পেআউট মেথড', 'Payout method'), `<div class="alert warn">${ic('shield')}<div><b>${T('এখনো কোনো ব্যাংক বা ওয়ালেট যোগ করা হয়নি', 'No bank or wallet added yet')}</b><p>${T('পেআউট পেতে নিচে অন্তত একটি যোগ করুন।', 'Add at least one below to receive payouts.')}</p></div></div>`);
    const calc = m ? UI.card(T('পরবর্তী পেআউটের হিসাব', 'Next payout estimate'), `<dl class="sum"><div><dt>${T('পাওনা', 'Payable')}</dt><dd>${mny(e.due)}</dd></div><div><dt>${T('ক্যাশ-আউট চার্জ (আপনার)', 'Cash-out charge (yours)')}</dt><dd>− ${mny(ch)}</dd></div><div class="tot"><dt>${T('আপনি পাবেন', 'You receive')}</dt><dd>${mny(e.due - ch)}</dd></div></dl><p class="soft">${esc(m.label)}</p>`) : '';
    return saved + calc +
      UI.card(T('ব্যাংক অ্যাকাউন্ট', 'Bank account'), bankForm(a.bank)) +
      UI.card(T('মোবাইল ওয়ালেট', 'Mobile wallet'), walForm(a.wallet) + `<div class="alert info">${ic('check')}<div><p>${T('ওয়ালেটে পেআউট নিলে ক্যাশ-আউট চার্জ টিচারের। পেআউটের পরিমাণ থেকে চার্জ কেটে বাকিটা পাঠানো হবে। হার নমুনা, চূড়ান্ত হার অপারেটর অনুযায়ী বদলাতে পারে।', 'With wallet payouts the cash-out charge is borne by the teacher and deducted from the payout. Rates shown are samples and may change per operator.')}</p><p class="soft">${WAL.map(x => `${T(x[2], x[1])} ${n(x[3])}%`).join(' · ')}</p></div></div>`);
  };

  const F = PX.FORMS, A = PX.ACT;
  F.paybank = (f, d) => {
    const err = f.querySelector('#pb-err'), v = k => (d[k] || '').trim();
    if (!/^\d{6,20}$/.test(v('accNo').replace(/\s/g, ''))) { err.textContent = T('অ্যাকাউন্ট নম্বরে ৬–২০ অঙ্ক দিন', 'Account number: 6–20 digits'); return; }
    if (!/^\d{9}$/.test(v('routing'))) { err.textContent = T('রাউটিং নম্বর ৯ অঙ্কের হতে হবে', 'Routing number must be 9 digits'); return; }
    const a = acc(TID); a.bank = { bankName: v('bankName'), accName: v('accName'), accNo: v('accNo').replace(/\s/g, ''), routing: v('routing'), branch: v('branch') };
    if (!a.pref) a.pref = 'bank'; PX.toast(T('ব্যাংক অ্যাকাউন্ট সংরক্ষিত', 'Bank account saved')); PX.refresh();
  };
  F.paywal = (f, d) => {
    const err = f.querySelector('#pw-err'), ph = (d.phone || '').replace(/[\s-]/g, '');
    if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(ph)) { err.textContent = T('সঠিক মোবাইল নম্বর দিন', 'Enter a valid mobile number'); return; }
    const a = acc(TID); a.wallet = { type: d.type, phone: ph }; if (!a.pref) a.pref = 'wallet'; PX.toast(T('ওয়ালেট সংরক্ষিত', 'Wallet saved')); PX.refresh();
  };
  A.paypref = a => { acc(TID).pref = a.dataset.k; PX.toast(T('প্রধান মেথড বদলানো হয়েছে', 'Preferred method updated')); PX.refresh(); };
  A.paydel = a => { const x = acc(TID); x[a.dataset.k] = null; if (x.pref === a.dataset.k) x.pref = ''; PX.toast(T('মুছে ফেলা হয়েছে', 'Removed')); PX.refresh(); };

  const navT = PX.nav.t; PX.nav.t = () => { const l = navT(), i = l.findIndex(x => x.k === 'earnings'); l.splice(i + 1, 0, { k: 'export', l: T('ডাটা ডাউনলোড', 'Data export'), i: 'download' }, { k: 'payout', l: T('পেআউট মেথড', 'Payout method'), i: 'award' }); return l; };

})();
