/* আইডি সিস্টেম: স্টুডেন্ট (৫ অঙ্ক), টিচার (৪ অঙ্ক), কোর্স (৪ অঙ্ক), টিকিট (৪ অঙ্ক)। আইডি / নাম / ফোন দিয়ে খোঁজা ও নাম-এর পাশে আইডি দেখানো */
(function () {
  'use strict';
  const PX = window.PX, { T, n, esc, ic } = PX, UI = PX.ui, DB = PX.DB, L = CH.L;
  const norm = s => String(s == null ? '' : s).trim().replace(/^#/, '').toLowerCase();
  const digits = s => String(s || '').replace(/\D/g, '');
  const tail = s => { const d = digits(s).replace(/^88/, ''); return d.length >= 10 ? d.slice(-10) : ''; };
  PX.tno = t => 7000 + (+String(t.id).replace(/\D/g, '') || 0);
  const allCourses = () => COURSES.concat(DB.offList || []);

  const LAB = {
    s: u => `${u.name} (${u.sid})`,
    c: c => `${L(c.title)} (${c.pid})`,
    t: t => `${L(t.n)} (${t.pid})`
  };
  PX.find = (kind, raw) => {
    const q = norm(raw); if (!q) return [];
    let exact = [], part = [];
    if (kind === 's') {
      DB.crm.forEach(u => {
        if (String(u.sid) === q || u.id === q || (tail(q) && tail(u.phone) === tail(q)) || u.name.toLowerCase() === q) exact.push(u);
        else if (q.length >= 2 && u.name.toLowerCase().includes(q)) part.push(u);
      });
    } else if (kind === 'c') {
      allCourses().forEach(c => {
        const ts = [c.title.bn, c.title.en].map(x => x.toLowerCase());
        if (String(c.pid) === q || c.id === q || ts.includes(q)) exact.push(c);
        else if (q.length >= 3 && ts.some(x => x.includes(q))) part.push(c);
      });
    } else if (kind === 't') {
      TEACHERS.forEach(t => {
        const ns = [t.n.bn, t.n.en].map(x => x.toLowerCase());
        if (String(t.pid) === q || t.id === q || (tail(q) && tail(t.phone) === tail(q)) || ns.includes(q)) exact.push(t);
        else if (q.length >= 2 && ns.some(x => x.includes(q))) part.push(t);
      });
    }
    return exact.length ? exact : part;
  };
  PX.pick1 = (kind, raw) => {
    const q = norm(raw); if (!q) return { err: T('আইডি দিন', 'Enter an ID') };
    const l = PX.find(kind, q);
    if (l.length === 1) return { v: l[0] };
    if (!l.length) return { err: T('পাওয়া যায়নি: ', 'Not found: ') + q };
    return { err: T('একাধিক মিল, আইডি দিন: ', 'Several matches, use the ID: ') + l.slice(0, 3).map(LAB[kind]).join(', ') };
  };
  PX.idField = (name, label, kind, req) => `<div class="fld idf"><label for="idf-${name}">${label}${req ? '<b class="rq"> *</b>' : ''}</label>
    <input id="idf-${name}" name="${name}" data-idk="${kind}" ${req ? 'required' : ''} placeholder="${kind === 'c' ? T('যেমন 3004', 'e.g. 3004') : T('যেমন 20001 / 01712… / নাম', 'e.g. 20001 / 01712… / name')}" autocomplete="off"><small class="idres hint" aria-live="polite"></small></div>`;
  document.addEventListener('input', e => {
    const el = e.target.closest && e.target.closest('[data-idk]'); if (!el) return;
    const out = el.parentElement.querySelector('.idres'); if (!out) return;
    const q = norm(el.value); if (!q) { out.textContent = ''; out.className = 'idres hint'; return; }
    const l = PX.find(el.dataset.idk, q);
    if (l.length === 1) { out.textContent = '✓ ' + LAB[el.dataset.idk](l[0]); out.className = 'idres okm'; }
    else if (!l.length) { out.textContent = T('পাওয়া যায়নি', 'Not found'); out.className = 'idres err'; }
    else { out.textContent = n(l.length) + ' ' + T('টি মিল; আইডি দিন', 'matches; use the ID'); out.className = 'idres warn'; }
  });

  /* নামের পাশে আইডি ব্যাজ */
  const dict = role => {
    const m = new Map(), add = (name, id) => { if (name) m.set(esc(name), id); };
    DB.crm.forEach(u => add(u.name, u.sid));
    allCourses().forEach(c => { add(c.title.bn, c.pid); add(c.title.en, c.pid); });
    if (role === 'a') TEACHERS.forEach(t => { add(t.n.bn, t.pid); add(t.n.en, t.pid); });
    return m;
  };
  const badge = id => `<span class="idt" title="ID">#${id}</span>`;
  const decorate = (html, role) => {
    const m = dict(role), keep = [];
    html = html.replace(/<(option|textarea|script|style)[\s\S]*?<\/\1>|<b class="nm">[\s\S]*?<\/b>/g, s => { keep.push(s); return `\u0000${keep.length - 1}\u0000`; });
    html = html.replace(/>([^<>\u0000]+)</g, (all, txt) => { const k = txt.trim(); return m.has(k) ? `>${txt}${badge(m.get(k))}<` : all; });
    return html.replace(/\u0000(\d+)\u0000/g, (a, i) => keep[+i]);
  };
  const view0 = PX.view;
  PX.view = (r, s, a) => { const h = view0(r, s, a); return r === 'a' || r === 't' ? decorate(h, r) : h; };
  const modal0 = PX.modal;
  PX.modal = (title, html, wide) => { const role = (location.hash.match(/^#([at])-/) || [])[1]; if (!role) return modal0(title, html, wide); const id = dict(role).get(title); return modal0(id ? title + badge(id) : title, decorate(html, role), wide); };

  /* আইডি / নাম / ফোন দিয়ে সারি খোঁজা */
  const bar = () => `<div class="idsearch"><label class="srch">${ic('search')}<input type="search" data-rs placeholder="${T('আইডি / নাম / ফোন দিয়ে খুঁজুন (স্টুডেন্ট, টিচার, কোর্স, টিকিট)', 'Search by ID / name / phone (student, teacher, course, ticket)')}" autocomplete="off" aria-label="${T('খুঁজুন', 'Search')}"></label><small class="idsearch-n" aria-live="polite"></small></div>`;
  const wrapSearch = (role, skip) => Object.keys(PX.sec[role]).forEach(sec => {
    if (skip.includes(sec)) return; const fn = PX.sec[role][sec];
    PX.sec[role][sec] = (...a) => { const h = fn(...a); return h; };
  });
  wrapSearch('a', ['profile', 'settings', 'students', 'bundles']);
  wrapSearch('t', ['profile', 'payout', 'policies', 'support', 'home', 'new', 'edit', 'courses', 'schedule']);

  const entries = () => {
    const e = [];
    DB.crm.forEach(u => e.push([[u.name.toLowerCase()], [u.sid, u.phone, digits(u.phone), tail(u.phone), u.id].join(' ').toLowerCase()]));
    TEACHERS.forEach(t => e.push([[t.n.bn.toLowerCase(), t.n.en.toLowerCase()], [t.pid, t.phone, tail(t.phone), t.id].join(' ').toLowerCase()]));
    allCourses().forEach(c => e.push([[c.title.bn.toLowerCase(), c.title.en.toLowerCase()], [c.pid, c.id].join(' ').toLowerCase()]));
    return e;
  };
  const filter = el => {
    const q = norm(el.value), nd = digits(q).replace(/^88/, ''), numeric = /^[\d+\s-]+$/.test(q) && nd.length >= 3, ent = entries();
    const rows = Array.from(document.querySelectorAll('#app tbody tr, #app .tk, #app .row-i, #app details.pol')).filter(r => !r.closest('.acc, .idsearch, form, .modal'));
    let vis = 0;
    rows.forEach(r => {
      if (!q) { r.hidden = false; vis++; return; }
      const txt = (r.tagName === 'TR' ? Array.from(r.children).map(c => c.textContent).join(' ') : r.textContent).toLowerCase(); let idx = txt;
      ent.forEach(x => { if (x[0].some(nm => txt.includes(nm))) idx += ' ' + x[1]; });
      const idLike = /^\d{4,6}$/.test(q), toks = idx.split(/[^0-9a-z\u0980-\u09ff]+/);
      const hit = idLike ? toks.includes(q) : (idx.includes(q) || (numeric && idx.replace(/\D/g, ' ').includes(nd)) || (numeric && idx.includes(nd)));
      r.hidden = !hit; if (hit) vis++;
    });
    const c = document.querySelector('.idsearch-n'); if (c) c.textContent = q ? `${n(vis)} / ${n(rows.length)} ${T('টি মিল', 'matches')}` : '';
  };
  document.addEventListener('input', e => { const el = e.target.closest && e.target.closest('[data-rs]'); if (el) filter(el); });
})();
