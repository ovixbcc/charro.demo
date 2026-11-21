/* ব্লগ: স্টুডেন্ট / টিচার / অ্যাডমিন সবাই লিখতে পারবে; স্টুডেন্ট-টিচারের লেখা অ্যাডমিনের কাছে রিকোয়েস্ট হিসেবে যায়, অ্যাডমিন পাবলিশ করলে সাইটের ব্লগে আসে */
(function () {
  const PX = window.PX, { T, n, esc, ic, TODAY } = PX, DB = PX.DB, UI = PX.ui, L = CH.L;
  const MAX = 1.5 * 1048576;
  const CATS = [
    ['admission', 'ভর্তি প্রস্তুতি', 'Admission prep'], ['study', 'পড়ার কৌশল', 'Study tips'], ['exam', 'পরীক্ষা গাইড', 'Exam guide'],
    ['career', 'ক্যারিয়ার', 'Career'], ['parent', 'অভিভাবকদের জন্য', 'For parents'], ['tech', 'প্রযুক্তি', 'Technology'],
    ['story', 'সাফল্যের গল্প', 'Success story'], ['other', 'অন্যান্য', 'Other'],
  ];
  const catL = k => { const c = CATS.find(x => x[0] === k) || CATS[7]; return T(c[1], c[2]); };
  const bi = s => ({ bn: s, en: s });
  const nm = r => r === 's' ? DB.me.name : r === 't' ? CH.L(CH.byId(TEACHERS, 't01').n) : T('অ্যাডমিন', 'Admin');
  DB.blogReq = DB.blogReq || [
    { id: 'br1', by: 't', author: 'Teacher', status: 'pending', date: '2026-11-19', title: 'Five habits of students who score well in math', cat: 'study',
      topic: 'Small daily habits that raise math scores before cadet admission tests.', cover: '', note: '',
      blocks: [{ h: 'Why habits beat cramming', sub: 'Consistency compounds', p: 'Twenty focused minutes a day beats a three-hour session the night before the test.', img: '' },
        { h: 'The five habits', sub: 'Start with just one', p: 'Practise one topic daily.\nReview mistakes weekly.\nSolve timed sets on weekends.', img: '' }] },
  ];
  const mine = r => DB.blogReq.filter(x => x.by === r);
  const canW = () => DB.levels[PX.S.level].perms.content >= 2;
  const st = x => x.status === 'withdrawn' ? UI.chip(T('প্রত্যাহৃত', 'Withdrawn'), '') : x.status === 'draft' ? UI.chip(T('ড্রাফট', 'Draft'), '') : x.status === 'published' ? UI.chip(T('প্রকাশিত', 'Published'), 'ok') : x.status === 'rejected' ? UI.chip(T('বাতিল', 'Rejected'), 'bad') : UI.chip(T('অপেক্ষমাণ', 'Pending review'), 'warn');
  const S = PX.S.blog = PX.S.blog || { mode: 'list', id: null, f: 'pending' };
  const role = () => PX.S.role;

  /* ---------- ছবি ফিল্ড ---------- */
  const imgBox = (name, cur, label) => `<div class="thf bl-img"><div class="thf-prev" data-thp>${cur ? `<img src="${esc(cur)}" alt="">` : T('ছবি', 'Image')}</div>
    <div><label class="btn btn-o btn-sm upl">${ic('upload')} ${label || T('ছবি বাছুন', 'Choose image')}<input type="file" accept="image/png,image/jpeg,image/webp" data-pc="blogimg" hidden></label>
      <button type="button" class="btn btn-o btn-sm" data-pa="blogimgx">${T('সরান', 'Remove')}</button><small class="err" data-the role="alert"></small>
      <input type="hidden" name="${name}" value="${cur ? esc(cur) : ''}"></div></div>`;
  PX.CHG.blogimg = el => {
    const f = el.files[0], box = el.closest('.thf'), er = box.querySelector('[data-the]'); if (!f) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(f.type) || f.size > MAX) { el.value = ''; er.textContent = T('১.৫ এমবির মধ্যে JPG/PNG/WebP ছবি দিন', 'Choose a JPG/PNG/WebP under 1.5 MB'); return; }
    er.textContent = ''; const r = new FileReader();
    r.onload = () => { box.querySelector('input[type=hidden]').value = r.result; box.querySelector('[data-thp]').innerHTML = `<img src="${r.result}" alt="">`; };
    r.readAsDataURL(f);
  };
  PX.ACT.blogimgx = a => { const box = a.closest('.thf'); box.querySelector('input[type=hidden]').value = ''; box.querySelector('[data-thp]').textContent = T('ছবি', 'Image'); };

  /* ---------- সেকশন ব্লক ---------- */
  const secBlock = (b, i) => `<div class="bl-sec"><div class="bl-sh"><b>${T('সেকশন', 'Section')} <span data-bln>${n(i + 1)}</span></b><button type="button" class="btn btn-o btn-sm" data-pa="blgdel">${ic('close')} ${T('সরান', 'Remove')}</button></div>
    <div class="fgrid"><div class="fld"><label>${T('হেডিং', 'Heading')}</label><input data-k="h" value="${esc(b.h || '')}" maxlength="120" autocomplete="off"></div>
    <div class="fld"><label>${T('সাবহেডিং', 'Subheading')}</label><input data-k="sub" value="${esc(b.sub || '')}" maxlength="140" autocomplete="off"></div>
    <div class="fld full"><label>${T('লেখা', 'Text')}</label><textarea data-k="p" rows="5" placeholder="${T('অনুচ্ছেদ আলাদা করতে নতুন লাইনে লিখুন', 'Use a new line for each paragraph')}">${esc(b.p || '')}</textarea></div>
    <div class="fld full"><label>${T('এই সেকশনের ছবি (ঐচ্ছিক)', 'Section image (optional)')}</label>${imgBox('', b.img || '')}</div></div></div>`;
  PX.ACT.blgadd = a => { const box = a.closest('form').querySelector('#bl-secs'); const d = document.createElement('div'); d.innerHTML = secBlock({}, box.children.length); box.appendChild(d.firstChild); };
  PX.ACT.blgdel = a => { const box = a.closest('#bl-secs'); if (box.children.length <= 1) return; a.closest('.bl-sec').remove(); Array.from(box.querySelectorAll('[data-bln]')).forEach((s, i) => { s.textContent = n(i + 1); }); };

  /* ---------- এডিটর ---------- */
  const editor = rec => {
    const r = role(), bl = rec && rec.blocks.length ? rec.blocks : [{}, {}];
    const direct = r === 'a';
    return UI.card(rec ? T('লেখা সম্পাদনা', 'Edit post') : T('নতুন ব্লগ লিখুন', 'Write a new blog post'),
      `<form data-pf="blogsave" class="fgrid" novalidate><input type="hidden" name="id" value="${rec ? rec.id : ''}">
      ${rec && rec.note && rec.status === 'rejected' ? `<div class="alert warn full">${ic('shield')}<div><b>${T('অ্যাডমিনের মন্তব্য', 'Admin note')}</b><p>${esc(rec.note)}</p></div></div>` : ''}
      <div class="fld full"><label>${T('ব্লগের শিরোনাম', 'Blog title')}<b class="rq"> *</b></label><input name="title" value="${esc(rec ? rec.title : '')}" maxlength="140" autocomplete="off"></div>
      <div class="fld"><label>${T('ক্যাটাগরি', 'Category')}</label><select name="cat">${CATS.map(c => `<option value="${c[0]}"${rec && rec.cat === c[0] ? ' selected' : ''}>${T(c[1], c[2])}</option>`).join('')}</select></div>
      <div class="fld"><label>${T('টপিক', 'Topic')}<b class="rq"> *</b></label><input name="topic" value="${esc(rec ? rec.topic : '')}" maxlength="200" placeholder="${T('এক লাইনে লেখার বিষয়', 'One-line summary of the subject')}" autocomplete="off"></div>
      <div class="fld full"><label>${T('কভার ইমেজ', 'Cover image')}</label>${imgBox('cover', rec ? rec.cover : '')}</div>
      <div class="full"><h4 class="bl-h">${T('লেখার অংশ', 'Content sections')}</h4><div id="bl-secs">${bl.map(secBlock).join('')}</div>
        <button type="button" class="btn btn-o btn-sm" data-pa="blgadd">${ic('plus')} ${T('আরেকটি সেকশন', 'Add another section')}</button></div>
      <p class="err full" id="bl-err" role="alert"></p>
      <div class="full bl-btns"><button class="btn btn-p" name="go" value="${direct ? 'pub' : 'sub'}">${direct ? T('প্রকাশ করুন', 'Publish now') : T('অ্যাডমিনের কাছে পাঠান', 'Submit for review')}</button>
        ${direct ? `<button class="btn btn-o" name="go" value="draft">${T('ড্রাফট রাখুন', 'Save as draft')}</button>` : ''}
        <button type="button" class="btn btn-o" data-pa="blgback">${T('বাতিল', 'Cancel')}</button></div></form>`);
  };

  let LASTGO = ''; document.addEventListener('click', e => { const b = e.target.closest('button[name=go]'); if (b) LASTGO = b.value; });
  const readF = f => ({
    cover: f.querySelector('input[name=cover]').value,
    blocks: Array.from(f.querySelectorAll('.bl-sec')).map(s => ({ h: s.querySelector('[data-k=h]').value.trim(), sub: s.querySelector('[data-k=sub]').value.trim(), p: s.querySelector('[data-k=p]').value.trim(), img: s.querySelector('.bl-img input[type=hidden]').value }))
      .filter(b => b.h || b.sub || b.p || b.img),
  });
  const pubPost = r => {
    const words = r.blocks.map(b => b.p).join(' ').split(/\s+/).filter(Boolean).length, c = CATS.find(x => x[0] === r.cat) || CATS[7];
    const id = 'bp' + (r.id || Date.now());
    if (BLOG.some(x => x.id === id)) return id;
    BLOG.unshift({ id, date: TODAY, color: '#8C52FF', min: Math.max(1, Math.ceil(words / 180)), tag: { bn: c[1], en: c[2] }, title: bi(r.title), ex: bi(r.topic), body: r.blocks.map(b => bi(b.p)).filter(x => x.bn),
      blocks: r.blocks, cover: r.cover, author: r.author, authorRole: r.by });
    return id;
  };
  PX.FORMS.blogsave = (f, d) => {
    const er = f.querySelector('#bl-err'), r = role(), x = readF(f), act = LASTGO;
    if (!(d.title || '').trim() || !(d.topic || '').trim()) { er.textContent = T('শিরোনাম ও টপিক লিখুন', 'Enter a title and a topic'); return; }
    if (!x.blocks.some(b => b.p)) { er.textContent = T('অন্তত একটি সেকশনে লেখা দিন', 'Add text to at least one section'); return; }
    if (r === 'a' && !canW()) { er.textContent = T('আপনার লেখার অ্যাক্সেস নেই', 'You do not have write access'); return; }
    let rec = d.id && DB.blogReq.find(q => q.id === d.id);
    if (!rec) { rec = { id: 'br' + (Date.now() % 1e7), by: r, author: nm(r), date: TODAY, note: '' }; DB.blogReq.unshift(rec); }
    Object.assign(rec, { title: d.title.trim(), cat: d.cat, topic: d.topic.trim(), cover: x.cover, blocks: x.blocks, date: TODAY });
    if (r === 'a') {
      if (act === 'draft') { rec.status = 'draft'; PX.toast(T('ড্রাফট সংরক্ষিত', 'Draft saved')); }
      else { rec.status = 'published'; rec.postId = pubPost(rec); PX.toast(T('ব্লগ প্রকাশিত হয়েছে', 'Blog published')); }
    } else { rec.status = 'pending'; rec.note = ''; PX.toast(T('অ্যাডমিনের কাছে পাঠানো হয়েছে', 'Sent to admin for review')); }
    S.mode = 'list'; PX.refresh();
  };
  PX.ACT.blgnew = () => { S.mode = 'edit'; S.id = null; PX.refresh(); };
  PX.ACT.blgedit = a => { S.mode = 'edit'; S.id = a.dataset.id; PX.refresh(); };
  PX.ACT.blgback = () => { S.mode = 'list'; PX.refresh(); };
  PX.ACT.blgf = a => { S.f = a.dataset.f; PX.refresh(); };
  PX.ACT.blgrm = a => {
    const i = DB.blogReq.findIndex(q => q.id === a.dataset.id), q = DB.blogReq[i]; if (!q) return;
    if (role() === 'a' && !canW()) return; if (role() !== 'a' && (q.by !== role() || q.status === 'published')) return;
    if (q.postId) { const j = BLOG.findIndex(b => b.id === q.postId); if (j >= 0) BLOG.splice(j, 1); }
    DB.blogReq.splice(i, 1); PX.toast(T('মুছে ফেলা হয়েছে', 'Deleted')); PX.refresh();
  };
  PX.ACT.blgwd = a => { const q = DB.blogReq.find(x => x.id === a.dataset.id && x.by === role() && x.status === 'pending'); if (!q) return; q.status = 'withdrawn'; PX.toast(T('রিকোয়েস্ট প্রত্যাহার হয়েছে', 'Request withdrawn')); PX.refresh(); };
  PX.ACT.blgpub = a => {
    if (!canW()) return; const q = DB.blogReq.find(x => x.id === a.dataset.id); if (!q) return;
    q.status = 'published'; q.note = ''; q.postId = pubPost(q); PX.closeModal(); PX.toast(T('ব্লগ প্রকাশিত হয়েছে', 'Blog published')); PX.refresh();
  };
  PX.ACT.blgunpub = a => {
    if (!canW()) return; const q = DB.blogReq.find(x => x.id === a.dataset.id); if (!q) return;
    const j = BLOG.findIndex(b => b.id === q.postId); if (j >= 0) BLOG.splice(j, 1);
    q.status = q.by === 'a' ? 'draft' : 'pending'; q.postId = ''; PX.toast(T('প্রকাশ তুলে নেওয়া হয়েছে', 'Unpublished')); PX.refresh();
  };
  PX.ACT.blgrej = a => {
    if (!canW()) return;
    PX.modal(T('লেখাটি বাতিল করুন', 'Reject this post'), `<form data-pf="blgrej" class="fgrid"><input type="hidden" name="id" value="${a.dataset.id}">
      <div class="fld full"><label>${T('লেখককে কারণ জানান', 'Reason for the author')}</label><textarea name="note" rows="3" required></textarea></div>
      <p class="err full" id="br-err" role="alert"></p><div class="full"><button class="btn btn-p">${T('বাতিল করুন', 'Reject')}</button></div></form>`);
  };
  PX.FORMS.blgrej = (f, d) => {
    if (!canW()) return; if (!(d.note || '').trim()) { f.querySelector('#br-err').textContent = T('কারণ লিখুন', 'Write a reason'); return; }
    const q = DB.blogReq.find(x => x.id === d.id); if (!q) return; q.status = 'rejected'; q.note = d.note.trim();
    PX.closeModal(); PX.toast(T('বাতিল করা হয়েছে', 'Rejected')); PX.refresh();
  };
  const article = q => `<article class="prose post bl-prev">${q.cover ? `<img class="bl-cover" src="${esc(q.cover)}" alt="">` : ''}<p class="mute">${esc(catL(q.cat))} · ${esc(q.author)} · ${CH.fdate(q.date)}</p><h2>${esc(q.title)}</h2><p><i>${esc(q.topic)}</i></p>
    ${q.blocks.map(b => `${b.h ? `<h3>${esc(b.h)}</h3>` : ''}${b.sub ? `<h4>${esc(b.sub)}</h4>` : ''}${b.img ? `<img class="bl-pi" src="${esc(b.img)}" alt="">` : ''}${(b.p || '').split(/\n+/).filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('')}`).join('')}</article>`;
  PX.ACT.blgview = a => {
    const q = DB.blogReq.find(x => x.id === a.dataset.id); if (!q) return;
    const adm = role() === 'a' && canW() && q.status !== 'published';
    PX.modal(T('প্রিভিউ', 'Preview'), article(q) + (adm ? `<div class="bl-btns"><button class="btn btn-p" data-pa="blgpub" data-id="${q.id}">${T('প্রকাশ করুন', 'Publish')}</button> <button class="btn btn-o" data-pa="blgrej" data-id="${q.id}">${T('বাতিল', 'Reject')}</button></div>` : ''), true);
  };

  /* ---------- তালিকা ---------- */
  const list = () => {
    const r = role(), adm = r === 'a';
    let rows = adm ? DB.blogReq.slice() : mine(r);
    const cnt = k => DB.blogReq.filter(x => k === 'all' || x.status === k).length;
    const tabs = adm ? `<div class="seg bl-tabs">${[['pending', T('অপেক্ষমাণ', 'Pending')], ['published', T('প্রকাশিত', 'Published')], ['rejected', T('বাতিল', 'Rejected')], ['draft', T('ড্রাফট', 'Drafts')], ['all', T('সব', 'All')]]
      .map(t => `<button class="${S.f === t[0] ? 'on' : ''}" data-pa="blgf" data-f="${t[0]}">${t[1]} (${n(cnt(t[0]))})</button>`).join('')}</div>` : '';
    if (adm && S.f !== 'all') rows = rows.filter(x => x.status === S.f);
    const wr = adm ? canW() : true;
    const tb = UI.tbl([T('শিরোনাম', 'Title'), T('ক্যাটাগরি', 'Category'), ...(adm ? [T('লেখক', 'Author')] : []), T('তারিখ', 'Date'), T('অবস্থা', 'Status'), ''],
      rows.map(q => [`<b>${esc(q.title)}</b><br><small class="mute">${esc(q.topic)}</small>`, esc(catL(q.cat)), ...(adm ? [esc(q.author) + ' · ' + (q.by === 's' ? T('স্টুডেন্ট', 'Student') : q.by === 't' ? T('টিচার', 'Teacher') : T('অ্যাডমিন', 'Admin'))] : []), CH.fdate(q.date), st(q) + (q.status === 'rejected' && q.note && !adm ? `<br><small class="mute">${esc(q.note)}</small>` : ''),
        `<button class="btn btn-o btn-sm" data-pa="blgview" data-id="${q.id}">${T('দেখুন', 'View')}</button>` +
        (wr && (adm || q.status !== 'published') ? ` <button class="btn btn-o btn-sm" data-pa="blgedit" data-id="${q.id}">${T('এডিট', 'Edit')}</button>` : '') +
        (adm && wr && q.status !== 'published' ? ` <button class="btn btn-p btn-sm" data-pa="blgpub" data-id="${q.id}">${T('প্রকাশ', 'Publish')}</button>` : '') +
        (!adm && q.status === 'pending' ? ` <button class="btn btn-o btn-sm danger" data-pa="blgwd" data-id="${q.id}">${T('প্রত্যাহার', 'Withdraw')}</button>` : '') + (adm && wr && q.status === 'pending' ? ` <button class="btn btn-o btn-sm" data-pa="blgrej" data-id="${q.id}">${T('বাতিল', 'Reject')}</button>` : '') +
        (adm && wr && q.status === 'published' ? ` <button class="btn btn-o btn-sm" data-pa="blgunpub" data-id="${q.id}">${T('প্রকাশ তুলুন', 'Unpublish')}</button>` : '') +
        (wr && (adm || q.status !== 'published') ? ` <button class="btn btn-o btn-sm" data-pa="blgrm" data-id="${q.id}" aria-label="${T('মুছুন', 'Delete')}">${ic('close')}</button>` : '')]));
    const intro = adm ? '' : `<p class="soft">${T('আপনার লেখা অ্যাডমিন দেখে প্রকাশ করলে সাইটের ব্লগে আসবে।', 'Your post goes to the admin; once approved it appears on the site blog.')}</p>`;
    return UI.card(T('ব্লগ', 'Blog'), intro + (wr ? `<p><button class="btn btn-p btn-sm" data-pa="blgnew">${ic('plus')} ${T('নতুন ব্লগ লিখুন', 'Write a new blog post')}</button></p>` : '') + tabs + tb);
  };
  const view = r => () => { PX.S.role = r; if (S.mode === 'edit') { const rec = S.id && DB.blogReq.find(x => x.id === S.id); if (!(rec && (r === 'a' || (rec.by === r && rec.status !== 'published'))) && S.id) { S.mode = 'list'; return list(); } return editor(rec || null); } return list(); };
  PX.sec.s.blog = view('s'); PX.sec.t.blog = view('t'); PX.sec.a.blog = view('a');
  window.addEventListener('hashchange', () => { S.mode = 'list'; });

  /* ---------- মেনু ---------- */
  const ins = (key, after, item) => { const p = PX.nav[key]; PX.nav[key] = () => { const l = p(), i = l.findIndex(x => x.k === after); l.splice(i < 0 ? l.length : i + 1, 0, item()); return l; }; };
  ins('s', 'messages', () => ({ k: 'blog', l: T('ব্লগ লিখুন', 'Write a blog'), i: 'file', badge: '' }));
  ins('t', 'students', () => ({ k: 'blog', l: T('ব্লগ লিখুন', 'Write a blog'), i: 'file', badge: '' }));
  const pa = PX.nav.a; PX.nav.a = () => { const l = pa(); if (!DB.levels[PX.S.level].perms.content) return l; const c = DB.blogReq.filter(x => x.status === 'pending').length, i = l.findIndex(x => x.k === 'reviews');
    l.splice(i < 0 ? l.length : i + 1, 0, { k: 'blog', l: T('ব্লগ', 'Blog'), i: 'file', also: [], badge: c ? n(c) : '' }); return l; };
})();
