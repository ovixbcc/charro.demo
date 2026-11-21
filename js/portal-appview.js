/* টিচার আবেদনের রিভিউ: টিচারের পুরো প্রোফাইল + মন্তব্যসহ অনুমোদন / বাতিল */
(function () {
  const PX = window.PX, { T, esc, ic, fd } = PX, DB = PX.DB, UI = PX.ui, L = CH.L;
  const kv = rows => `<div class="kv2">${rows.map(r => `<div><small>${r[0]}</small><b>${esc(r[1] || '—')}</b></div>`).join('')}</div>`;
  const sub = (t, body) => `<h4 class="sub apv-h">${t}</h4>${body}`;
  const subj = x => x.subjects.map(s => { const o = SUBJECTS.find(k => k.id === s); return o ? L(o) : s; }).join(', ');
  PX.ACT.apview = a => {
    const x = DB.apps.find(y => y.id === a.dataset.id); if (!x) return;
    const r = PX.demoRec('ap:' + x.id, 't', { name: x.name, phone: x.phone, email: x.email, district: x.district, inst: x.inst });
    const docs = x.docs.map(d => [esc(d[0]), `${ic('file')} ${esc(d[1])}`, esc(d[2])]);
    const st = x.status === 'approved' ? UI.chip(T('অনুমোদিত', 'Approved'), 'ok') : x.status === 'rejected' ? UI.chip(T('বাতিল', 'Rejected'), 'bad') : UI.chip(T('অপেক্ষমাণ', 'Pending'), 'warn');
    PX.modal(esc(x.name), `<div class="prof apv-top"><span class="av" style="--s:64px;--c:#8C52FF">${esc(x.name.charAt(0))}</span><div><h3>${esc(x.name)} ${st}</h3><p class="soft">${T('আবেদনের তারিখ', 'Applied on')}: ${fd(x.date)} · ${esc(x.inst)} · ${esc(x.dept)}</p></div></div>
      ${sub(T('ব্যক্তিগত তথ্য', 'Personal details'), kv([[T('পুরো নাম', 'Full name'), x.name], [T('জন্ম তারিখ', 'Date of birth'), r.dob], [T('মোবাইল', 'Mobile'), x.phone], [T('ইমেইল', 'Email'), x.email], [T('জেলা', 'District'), x.district], [T('ঠিকানা', 'Address'), r.addr], [T('NID নম্বর', 'NID number'), r.nid], [T('জরুরি যোগাযোগ', 'Emergency contact'), r.emName + ' · ' + r.emPhone]]))}
      ${sub(T('শিক্ষাগত পরিচয়', 'Education'), kv([[T('বিশ্ববিদ্যালয়', 'University'), x.inst], [T('বিভাগ', 'Department'), x.dept], [T('বর্ষ', 'Year'), x.year], [T('ভার্সিটি আইডি', 'University ID'), 'ID ' + (1000 + (x.id.charCodeAt(2) * 37) % 9000)]]))}
      ${sub(T('পড়ানোর তথ্য', 'Teaching profile'), kv([[T('পড়াতে চান', 'Subjects'), subj(x)], [T('অভিজ্ঞতা', 'Experience'), x.exp || T('নতুন', 'New teacher')], [T('পরিচিতি', 'About'), x.bio || T('আবেদনপত্রে দেওয়া হয়নি', 'Not given in the application')], [T('ইন্ট্রো ভিডিও', 'Intro video'), x.video || T('দেওয়া হয়নি', 'Not given')]]))}
      ${sub(T('ডকুমেন্ট', 'Documents'), UI.tbl([T('ডকুমেন্ট', 'Document'), T('ফাইল', 'File'), T('সাইজ', 'Size')], docs))}
      ${x.note && x.status !== 'pending' ? `<div class="alert info">${ic('chat')}<div><b>${T('আগের মন্তব্য', 'Previous comment')}</b><p>${esc(x.note)}</p></div></div>` : ''}
      <form data-pf="apdec" data-id="${x.id}" class="apv-f"><h4 class="sub apv-h">${T('যাচাই ও সিদ্ধান্ত', 'Verification & decision')}</h4><div class="ck-g">${[['id', T('আইডি ভেরিফাইড', 'ID verified')], ['pay', T('পেমেন্ট ভেরিফাইড', 'Payment verified')], ['doc', T('ডকুমেন্ট ভেরিফাইড', 'Docs verified')]].map(b => `<label class="ck"><input type="checkbox" name="b" value="${b[0]}" ${x.badges[b[0]] ? 'checked' : ''}><span>${b[1]}</span></label>`).join('')}</div>
        ${UI.fi({ name: 'note', label: T('অনুমোদন / বাতিলের মন্তব্য', 'Approval / rejection comment'), rows: 3, ph: T('কেন অনুমোদন বা বাতিল করছেন লিখুন', 'Why are you approving or rejecting?'), req: 1 })}
        <p class="err" id="ap-err" role="alert"></p><div class="btns"><button type="button" class="btn btn-p" data-pa="decset" data-v="approved">${ic('check')} ${T('অনুমোদন', 'Approve')}</button><button type="button" class="btn btn-o danger" data-pa="decset" data-v="rejected">${ic('close')} ${T('বাতিল', 'Reject')}</button></div><input type="hidden" name="dec" value="approved"></form>`, true);
  };
})();
