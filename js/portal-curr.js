/* কোর্স কারিকুলাম: টিচার মডিউল ও লেসন (ক্লাস/লেসন প্ল্যান) যোগ করে; কোর্স পেজে কেনার আগে ক্রেতা এটা দেখে।
   ডেমোতে বিদ্যমান কোর্সের কারিকুলাম localStorage-এ থাকে (chaatro_curr_v1)। */
(function () {
  'use strict';
  const PX = window.PX, { T, n, esc, ic, COURSE } = PX, UI = PX.ui, DB = PX.DB, L = CH.L, F = PX.FORMS, A = PX.ACT, TID = 't01';
  const KEY = 'chaatro_curr_v1', SEEDIDS = new Set(COURSES.map(c => c.id));
  let st = {}; try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { st = {}; }
  DB.curr = st;
  const save = () => { try { const o = {}; Object.keys(DB.curr).forEach(k => { if (SEEDIDS.has(k)) o[k] = DB.curr[k]; }); localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* ignore */ } };
  const get = k => DB.curr[k] || (DB.curr[k] = { modules: [] });
  PX.currOf = k => (DB.curr[k] && DB.curr[k].modules.length ? DB.curr[k] : null);
  PX.currCount = k => { const c = DB.curr[k]; return c ? [c.modules.length, c.modules.reduce((a, m) => a + m.lessons.length, 0)] : [0, 0]; };
  const uid = p => p + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
  const TYPES = [['live', T('লাইভ ক্লাস', 'Live class')], ['video', T('ভিডিও', 'Video')], ['notes', T('নোট / পিডিএফ', 'Notes / PDF')], ['quiz', T('কুইজ / মডেল টেস্ট', 'Quiz / model test')], ['assign', T('অ্যাসাইনমেন্ট', 'Assignment')]];
  const tlabel = k => (TYPES.find(x => x[0] === k) || TYPES[0])[1];

  /* নতুন কোর্স অনুমোদিত হয়ে লাইভ হলে কারিকুলামও লাইভ কোর্সে যায় */
  const pub0 = PX.publishCourse;
  PX.publishCourse = nc => { const r = pub0(nc), src = DB.curr[nc.id]; if (src && r) { DB.curr[r.id] = JSON.parse(JSON.stringify(src)); } return r; };

  /* কোন কোর্সগুলো এই টিচারের */
  const mine = () => COURSES.filter(c => c.teacher === TID).map(c => ({ key: c.id, title: L(c.title), status: 'live' })).concat(DB.newCourses.filter(c => c.tid === TID && c.status !== 'live').map(c => ({ key: c.id, title: c.title, status: c.status })));
  const info = k => mine().find(x => x.key === k);
  const stChip = s => ({ live: UI.chip(T('লাইভ', 'Live'), 'ok'), review: UI.chip(T('রিভিউয়ে', 'In review'), 'warn'), draft: UI.chip(T('খসড়া', 'Draft'), ''), rejected: UI.chip(T('বাতিল', 'Rejected'), 'bad') })[s] || '';

  const nt = PX.nav.t; PX.nav.t = () => { const l = nt(), i = l.findIndex(x => x.k === 'new'); l.splice(i < 0 ? 2 : i + 1, 0, { k: 'curr', l: T('কারিকুলাম ও লেসন প্ল্যান', 'Curriculum & lesson plans'), i: 'file' }); return l; };

  /* ---------- তালিকা + এডিটর ---------- */
  const lessonRow = (k, m, l, i, last) => `<tr><td>${n(i + 1)}</td><td><b>${esc(l.title)}</b>${l.plan ? `<small class="soft">${esc(l.plan.length > 110 ? l.plan.slice(0, 110) + '…' : l.plan)}</small>` : ''}${l.file ? `<small class="soft">${ic('file')} ${esc(l.file)}</small>` : ''}</td><td>${UI.chip(tlabel(l.type), 'info')}</td><td>${esc(l.when || '—')}${l.dur ? `<small>${n(l.dur)} ${T('মিনিট', 'min')}</small>` : ''}</td><td class="nw"><button class="btn btn-o btn-sm" data-pa="clmv" data-k="${k}" data-mid="${m.id}" data-lid="${l.id}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="up">↑</button> <button class="btn btn-o btn-sm" data-pa="clmv" data-k="${k}" data-mid="${m.id}" data-lid="${l.id}" data-d="1" ${last ? 'disabled' : ''} aria-label="down">↓</button> <button class="btn btn-o btn-sm" data-pa="cledit" data-k="${k}" data-mid="${m.id}" data-lid="${l.id}">${T('সম্পাদনা', 'Edit')}</button> <button class="btn btn-o btn-sm" data-pa="cldel" data-k="${k}" data-mid="${m.id}" data-lid="${l.id}">${T('মুছুন', 'Delete')}</button></td></tr>`;
  const moduleCard = (k, m, i, last) => `<section class="pc cm"><header><h3><span class="an">${n(i + 1)}</span> ${esc(m.title)}</h3><span class="bar-b"><button class="btn btn-o btn-sm" data-pa="cmmv" data-k="${k}" data-mid="${m.id}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="up">↑</button> <button class="btn btn-o btn-sm" data-pa="cmmv" data-k="${k}" data-mid="${m.id}" data-d="1" ${last ? 'disabled' : ''} aria-label="down">↓</button> <button class="btn btn-o btn-sm" data-pa="cmedit" data-k="${k}" data-mid="${m.id}">${T('মডিউল সম্পাদনা', 'Edit module')}</button> <button class="btn btn-o btn-sm" data-pa="cmdel" data-k="${k}" data-mid="${m.id}">${T('মডিউল মুছুন', 'Delete module')}</button></span></header><div class="pc-b">${m.desc ? `<p class="soft">${esc(m.desc)}</p>` : ''}${m.lessons.length ? `<div class="tbl-w"><table class="ptbl"><thead><tr><th>#</th><th>${T('লেসন', 'Lesson')}</th><th>${T('ধরন', 'Type')}</th><th>${T('কখন', 'When')}</th><th></th></tr></thead><tbody>${m.lessons.map((l, j) => lessonRow(k, m, l, j, j === m.lessons.length - 1)).join('')}</tbody></table></div>` : UI.empty(T('এই মডিউলে এখনো লেসন নেই', 'No lessons in this module yet'))}<div class="btns"><button class="btn btn-p btn-sm" data-pa="cladd" data-k="${k}" data-mid="${m.id}">${ic('plus')} ${T('লেসন / ক্লাস যোগ', 'Add lesson / class')}</button></div></div></section>`;

  PX.sec.t.curr = arg => {
    if (!arg) {
      return UI.card(T('কারিকুলাম ও লেসন প্ল্যান', 'Curriculum & lesson plans'), `<p class="soft">${T('প্রতিটি কোর্সের মডিউল, ক্লাস ও লেসন প্ল্যান এখানে যোগ করুন। স্টুডেন্ট কোর্স পেজে কেনার আগে এগুলো দেখতে পাবে। নতুন কোর্সের কারিকুলাম কোর্স অনুমোদনের সঙ্গে অ্যাডমিন দেখবেন।', 'Add modules, classes and lesson plans for each course. Students see them on the course page before buying. For a new course, admin reviews the curriculum along with the course.')}</p>` +
        UI.tbl([T('কোর্স', 'Course'), T('অবস্থা', 'Status'), T('মডিউল', 'Modules'), T('লেসন', 'Lessons'), ''], mine().map(c => { const [mc, lc] = PX.currCount(c.key); return [`<b>${esc(c.title)}</b>`, stChip(c.status), n(mc), n(lc), `<a class="btn btn-p btn-sm" href="#t-curr-${c.key}">${mc ? T('সম্পাদনা', 'Edit') : T('যোগ করুন', 'Add')}</a>`]; })));
    }
    const c = info(arg); if (!c) return UI.card('', UI.empty(T('কোর্স পাওয়া যায়নি', 'Course not found')));
    const d = get(arg), [mc, lc] = PX.currCount(arg);
    return `<p><a href="#t-curr">${T('← সব কোর্স', '← All courses')}</a></p>` + UI.card(esc(c.title), `<div class="kpis">${UI.kpi(T('মডিউল', 'Modules'), n(mc))}${UI.kpi(T('লেসন / ক্লাস', 'Lessons / classes'), n(lc))}${UI.kpi(T('অবস্থা', 'Status'), stChip(c.status))}</div><p class="soft">${c.status === 'live' ? T('এখানে করা পরিবর্তন সাথে সাথে কোর্স পেজে দেখা যাবে।', 'Changes appear on the course page straight away.') : T('কোর্স অনুমোদিত হলে এই কারিকুলাম কোর্স পেজে দেখা যাবে।', 'This curriculum appears on the course page once the course is approved.')}</p>`, `<button class="btn btn-p btn-sm" data-pa="cmadd" data-k="${arg}">${ic('plus')} ${T('নতুন মডিউল', 'New module')}</button>`) +
      (d.modules.length ? d.modules.map((m, i) => moduleCard(arg, m, i, i === d.modules.length - 1)).join('') : UI.card('', UI.empty(T('এখনো কোনো মডিউল নেই। "নতুন মডিউল" দিয়ে শুরু করুন, যেমন "মডিউল ১: বীজগণিত"।', 'No modules yet. Start with "New module", e.g. "Module 1: Algebra".'))));
  };

  /* ---------- মডিউল ---------- */
  const mform = (k, m) => `<form data-pf="cmsave" data-k="${k}" data-mid="${m ? m.id : ''}">${UI.fi({ name: 'title', label: T('মডিউলের নাম', 'Module title'), val: m ? m.title : '', req: true })}${UI.fi({ name: 'desc', label: T('সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)', 'Short description (optional)'), rows: 3, val: m ? m.desc : '' })}<button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></form>`;
  A.cmadd = a => PX.modal(T('নতুন মডিউল', 'New module'), mform(a.dataset.k, null));
  A.cmedit = a => { const m = get(a.dataset.k).modules.find(x => x.id === a.dataset.mid); if (m) PX.modal(T('মডিউল সম্পাদনা', 'Edit module'), mform(a.dataset.k, m)); };
  F.cmsave = (f, d) => { const k = f.dataset.k, t = (d.title || '').trim(); if (!t) return; const cu = get(k); let m = cu.modules.find(x => x.id === f.dataset.mid); if (!m) { m = { id: uid('mo'), title: '', desc: '', lessons: [] }; cu.modules.push(m); } m.title = t; m.desc = (d.desc || '').trim(); save(); PX.closeModal(); PX.toast(T('সংরক্ষণ হয়েছে', 'Saved')); PX.refresh(); };
  A.cmdel = a => PX.modal(T('মডিউল মুছুন', 'Delete module'), `<p>${T('মডিউল ও এর সব লেসন মুছে যাবে।', 'The module and all its lessons will be deleted.')}</p><button class="btn btn-p" data-pa="cmdeldo" data-k="${a.dataset.k}" data-mid="${a.dataset.mid}">${T('হ্যাঁ, মুছুন', 'Yes, delete')}</button>`);
  A.cmdeldo = a => { const cu = get(a.dataset.k); cu.modules = cu.modules.filter(x => x.id !== a.dataset.mid); save(); PX.closeModal(); PX.refresh(); };
  const mv = (arr, id, d) => { const i = arr.findIndex(x => x.id === id), j = i + d; if (i < 0 || j < 0 || j >= arr.length) return; const t = arr[i]; arr[i] = arr[j]; arr[j] = t; };
  A.cmmv = a => { mv(get(a.dataset.k).modules, a.dataset.mid, +a.dataset.d); save(); PX.refresh(); };

  /* ---------- লেসন ---------- */
  const lform = (k, mid, l) => `<form data-pf="clsave" data-k="${k}" data-mid="${mid}" data-lid="${l ? l.id : ''}" class="fgrid">${UI.fi({ name: 'title', label: T('লেসন / ক্লাসের নাম', 'Lesson / class title'), val: l ? l.title : '', req: true })}${UI.fi({ name: 'type', label: T('ধরন', 'Type'), opts: TYPES, val: l ? l.type : 'live', half: true })}${UI.fi({ name: 'when', label: T('কখন (যেমন: সপ্তাহ ১ · ক্লাস ২)', 'When (e.g. Week 1 · Class 2)'), val: l ? l.when : '', half: true })}${UI.fi({ name: 'dur', label: T('সময় (মিনিট)', 'Duration (minutes)'), type: 'number', min: 0, val: l ? l.dur : '', half: true })}${UI.fi({ name: 'plan', label: T('লেসন প্ল্যান (কী কী শেখানো হবে)', 'Lesson plan (what will be covered)'), rows: 5, val: l ? l.plan : '', ph: T('যেমন: সূচকের নিয়ম, ১০টি উদাহরণ, বাড়ির কাজ', 'e.g. Laws of exponents, 10 worked examples, homework') })}<div class="fld"><label>${T('লেসন প্ল্যানের ফাইল (ঐচ্ছিক)', 'Lesson plan file (optional)')}</label><input type="file" name="file"><small class="hint">${l && l.file ? esc(l.file) + ' · ' : ''}${T('ফাইলের নাম কোর্স পেজে দেখাবে; ডাউনলোড এনরোলমেন্টের পর', 'The file name shows on the course page; download after enrolment')}</small></div><div class="fld"><button class="btn btn-p">${T('সংরক্ষণ', 'Save')}</button></div></form>`;
  A.cladd = a => PX.modal(T('লেসন / ক্লাস যোগ', 'Add lesson / class'), lform(a.dataset.k, a.dataset.mid, null), true);
  A.cledit = a => { const m = get(a.dataset.k).modules.find(x => x.id === a.dataset.mid), l = m && m.lessons.find(x => x.id === a.dataset.lid); if (l) PX.modal(T('লেসন সম্পাদনা', 'Edit lesson'), lform(a.dataset.k, m.id, l), true); };
  F.clsave = (f, d) => {
    const m = get(f.dataset.k).modules.find(x => x.id === f.dataset.mid), t = (d.title || '').trim(); if (!m || !t) return;
    let l = m.lessons.find(x => x.id === f.dataset.lid); if (!l) { l = { id: uid('ls'), file: '' }; m.lessons.push(l); }
    Object.assign(l, { title: t, type: d.type, when: (d.when || '').trim(), dur: +d.dur || 0, plan: (d.plan || '').trim() }); if (d.file && d.file[0]) l.file = d.file[0].name;
    save(); PX.closeModal(); PX.toast(T('সংরক্ষণ হয়েছে', 'Saved')); PX.refresh();
  };
  A.cldel = a => PX.modal(T('লেসন মুছুন', 'Delete lesson'), `<p>${T('এই লেসনটি মুছে যাবে।', 'This lesson will be deleted.')}</p><button class="btn btn-p" data-pa="cldeldo" data-k="${a.dataset.k}" data-mid="${a.dataset.mid}" data-lid="${a.dataset.lid}">${T('হ্যাঁ, মুছুন', 'Yes, delete')}</button>`);
  A.cldeldo = a => { const m = get(a.dataset.k).modules.find(x => x.id === a.dataset.mid); if (m) m.lessons = m.lessons.filter(x => x.id !== a.dataset.lid); save(); PX.closeModal(); PX.refresh(); };
  A.clmv = a => { const m = get(a.dataset.k).modules.find(x => x.id === a.dataset.mid); if (m) mv(m.lessons, a.dataset.lid, +a.dataset.d); save(); PX.refresh(); };

  /* কোর্স তৈরির পর টিচারকে কারিকুলামের কথা মনে করানো; অ্যাডমিনের রিভিউয়ে কারিকুলাম দেখানো */
  const nc0 = F.newcourse; F.newcourse = (f, d) => { const before = DB.newCourses.length; nc0(f, d); if (!f.dataset.admin && DB.newCourses.length > before) { const c = DB.newCourses[DB.newCourses.length - 1]; PX.toast(T('এখন কারিকুলাম ও লেসন প্ল্যান যোগ করুন', 'Now add the curriculum & lesson plans')); location.hash = '#t-curr-' + c.id; } };
  const cv0 = A.cview; if (cv0) A.cview = a => {
    cv0(a); const k = a.dataset.id, box = document.querySelector('.m-box form[data-pf=cdec]'), cu = PX.currOf(k); if (!box) return;
    const html = `<h4 class="sub">${T('কারিকুলাম', 'Curriculum')}</h4>` + (cu ? cu.modules.map((m, i) => `<p><b>${n(i + 1)}. ${esc(m.title)}</b></p><ul>${m.lessons.map(l => `<li>${esc(l.title)} <small class="soft">· ${esc(tlabel(l.type))}${l.when ? ' · ' + esc(l.when) : ''}</small></li>`).join('') || `<li class="soft">${T('লেসন নেই', 'No lessons')}</li>`}</ul>`).join('') : `<p class="soft">${T('টিচার এখনো কারিকুলাম যোগ করেননি।', 'The teacher has not added a curriculum yet.')}</p>`);
    const w = document.createElement('div'); w.innerHTML = html; box.parentNode.insertBefore(w, box);
  };
})();
