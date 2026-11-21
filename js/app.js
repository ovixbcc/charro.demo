/* ছাত্র.com — ফ্রন্টএন্ড (পাবলিক ওয়েবসাইট)। ভ্যানিলা JS, হ্যাশ-রাউটিং। */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  let lang = 'en';
  try { const v = localStorage.getItem('chaatro-lang'); if (v === 'en' || v === 'bn') lang = v; } catch (e) { /* ignore */ }

  const t = k => (I[lang] && I[lang][k] != null ? I[lang][k] : (I.bn[k] != null ? I.bn[k] : k));
  const L = o => (o ? (o[lang] || o.bn || '') : '');
  const BNUM = '০১২৩৪৫৬৭৮৯';
  const num = x => { const s = String(x); return lang === 'bn' ? s.replace(/\d/g, d => BNUM[d]) : s; };
  const money = x => '৳' + num(Math.round(x).toLocaleString('en-US'));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const MON = {
    bn: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  };
  const fdate = iso => { const [y, m, d] = iso.split('-').map(Number); return num(d) + ' ' + MON[lang][m - 1] + (lang === 'bn' ? ' ' : ', ') + num(y); };
  const byId = (arr, id) => arr.find(x => x.id === id);
  const PCOLOR = { cadet: '#8C52FF', 'du-ka': '#0E0B16', 'du-kha': '#241545', 'du-ga': '#4A2BA8', 'du-gha': '#6B34E0', bup: '#7A3FF0', buet: '#17102B' };
  const tx = (bn, en) => lang === 'bn' ? bn : en;
  const ctName = f => L(ctype(f)), isOneF = f => f === 'one';
  const fmtDesc = f => isOneF(f) ? t('one_fmt_d') : tx(`ব্যাচে সর্বোচ্চ ${num(ctSeats(f))} জন`, `Batch of up to ${ctSeats(f)}`);
  const grpNote = f => tx(`ব্যাচে সর্বোচ্চ ${num(ctSeats(f))} জন। সিট ভরে গেলে ভর্তি বন্ধ হবে।`, `Max ${ctSeats(f)} per batch. Enrolment closes when seats are full.`);
  const progColor = id => PCOLOR[id] || '#8C52FF';

  const IC = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.5a3.5 3.5 0 010 7M18 14.5c2 .6 3.5 2.3 3.5 5.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    upload: '<path d="M12 16V4M6.5 9.5L12 4l5.5 5.5M4 20h16"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/>',
    download: '<path d="M12 4v11"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10.5l5-3v9l-5-3"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    book: '<path d="M5 4h9a4 4 0 014 4v12H9a4 4 0 01-4-4z"/><path d="M5 16a4 4 0 014-4h9"/>',
    play: '<path d="M8 5l11 7-11 7z"/>',
    trash: '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    award: '<circle cx="12" cy="9" r="5"/><path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    home: '<path d="M4 11l8-7 8 7v9H4z"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    repeat: '<path d="M4 12a8 8 0 0114-5.3L20 9M20 4v5h-5M20 12a8 8 0 01-14 5.3L4 15M4 20v-5h5"/>',
  };
  const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;
  const star = '<svg class="ic star" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.8l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.7 6.1 20.8l1.2-6.5L2.5 9.7l6.6-.9z"/></svg>';
  const rate = r => `<span class="rate" aria-label="${num(r)} / ${num(5)}">${star}<b>${num(r.toFixed ? r.toFixed(1) : r)}</b></span>`;

  const initials = n => {
    const s = L(n).trim().split(/\s+/); return lang === 'bn' ? (s[0] || '').slice(0, 1) + (s[1] ? s[1].slice(0, 1) : '') : (s[0] || '').slice(0, 1) + (s[1] ? s[1].slice(0, 1) : '');
  };
  const LOOK = {
    t01: { g: 'm', skin: '#E8B48A', hair: '#1B1424', shirt: '#8C52FF', gl: 1 },
    t02: { g: 'f', skin: '#E3A87C', hair: '#241545', shirt: '#0E0B16' },
    t03: { g: 'm', skin: '#D99A6C', hair: '#3A2418', shirt: '#0E0B16' },
    t04: { g: 'h', skin: '#EDBF9A', hair: '#6B34E0', shirt: '#B794FF' },
    t05: { g: 'm', skin: '#D99A6C', hair: '#1B1424', shirt: '#6B34E0', gl: 1 },
    t06: { g: 'f', skin: '#E8B48A', hair: '#3A2418', shirt: '#8C52FF' },
    t07: { g: 'm', skin: '#E3A87C', hair: '#1B1424', shirt: '#4A2BA8' },
    t08: { g: 'h', skin: '#E8B48A', hair: '#17102B', shirt: '#8C52FF' },
    t09: { g: 'm', skin: '#EDBF9A', hair: '#3A2418', shirt: '#17102B' },
    t10: { g: 'f', skin: '#D99A6C', hair: '#1B1424', shirt: '#B794FF', gl: 1 },
    t11: { g: 'm', skin: '#E3A87C', hair: '#241545', shirt: '#8C52FF', gl: 1 },
  };
  function cartoon(l) {
    const back = l.g === 'f' ? `<path d="M26 50 Q22 18 50 18 Q78 18 74 50 L77 80 Q64 83 62 70 L38 70 Q36 83 23 80Z" fill="${l.hair}"/>` :
      l.g === 'h' ? `<path d="M25 52 Q24 16 50 16 Q76 16 75 52 Q76 78 50 84 Q24 78 25 52Z" fill="${l.hair}"/>` : '';
    const front = l.g === 'm' ? `<path d="M30.5 45 Q27 20 50 20 Q73 20 69.5 45 Q64 32 50 32 Q36 32 30.5 45Z" fill="${l.hair}"/>` :
      l.g === 'f' ? `<path d="M31 44 Q33 25 50 25 Q67 25 69 44 Q58 34 50 34 Q42 34 31 44Z" fill="${l.hair}"/>` : '';
    const gl = l.gl ? `<g fill="none" stroke="#0E0B16" stroke-width="1.6"><circle cx="42.5" cy="48" r="6"/><circle cx="57.5" cy="48" r="6"/><path d="M48.5 48h3"/></g>` : '';
    const face = l.g === 'h' ? `<ellipse cx="50" cy="48" rx="15.5" ry="19" fill="${l.skin}"/>` : `<ellipse cx="50" cy="47" rx="19" ry="22" fill="${l.skin}"/>`;
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" fill="#EFE7FF"/><path d="M14 100Q14 73 50 73Q86 73 86 100Z" fill="${l.shirt}"/><rect x="44" y="62" width="12" height="15" rx="4" fill="${l.skin}" opacity=".9"/>${back}${face}${l.g === 'h' ? '' : `<circle cx="31" cy="48" r="3.4" fill="${l.skin}"/><circle cx="69" cy="48" r="3.4" fill="${l.skin}"/>`}${front}<circle cx="43" cy="49" r="2.1" fill="#0E0B16"/><circle cx="57" cy="49" r="2.1" fill="#0E0B16"/>${gl}<path d="M44.5 58 Q50 63 55.5 58" fill="none" stroke="#7A3B2E" stroke-width="2" stroke-linecap="round"/><circle cx="38" cy="56" r="3" fill="#FF8FA3" opacity=".35"/><circle cx="62" cy="56" r="3" fill="#FF8FA3" opacity=".35"/></svg>`;
  }
  /* YouTube: লিংক থেকে আইডি, থাম্বনেল ও ক্লিক-করলে-চলা প্লেয়ার */
  const ytId = u => { const m = String(u || '').trim().match(/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#/].*)?$/); return m ? m[1] : ''; };
  const player = (url, thumb, title) => {
    const id = ytId(url);
    if (!id) return thumb ? `<div class="vp vp-img"><img src="${thumb}" alt="${esc(title || '')}"></div>` : '';
    return `<div class="vp" data-act="ytplay" data-yt="${id}" role="button" tabindex="0" aria-label="${esc(title || 'Play video')}"><img src="${thumb || 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg'}" alt="" loading="lazy" onerror="this.style.display='none'"><span class="vp-b">${ic('play')}</span>${title ? `<span class="vp-t">${esc(title)}</span>` : ''}</div>`;
  };
  /* পেমেন্ট রিসিট: চেকআউটের পরে ডাউনলোড (প্রিন্ট → Save as PDF) */
  let LASTRC = null;
  const fv = (f, n) => (f && f.elements && f.elements[n] ? f.elements[n].value.trim() : '');
  const mkRc = (f, oid, lines, amount) => { LASTRC = { heading: t('rc_title'), no: oid, date: new Date().toISOString().slice(0, 10), lines: [[t('f_name'), fv(f, 'en_name')], [t('f_phone'), fv(f, 'en_phone')], [t('f_email'), fv(f, 'en_email')]].filter(x => x[1]).concat(lines, [[t('rc_method'), t('rc_cash')]]), amount, status: t('ck_status'), note: t('rc_note') }; };
  const avatar = (tc, size = 44) => tc.photo
    ? `<span class="av av-img av-photo" style="--s:${size}px" aria-hidden="true"><img src="${tc.photo}" alt=""></span>`
    : LOOK[tc.id]
    ? `<span class="av av-img" style="--s:${size}px" aria-hidden="true">${cartoon(LOOK[tc.id])}</span>`
    : `<span class="av" style="--s:${size}px;--c:${tc.color}" aria-hidden="true">${esc(initials(tc.n))}</span>`;

  /* ---------- filter state ---------- */
  const startPrice = (c, fmt) => {
    const pr = pricingFor(c); const f = fmt && fmt !== 'all' && c.formats.includes(fmt) ? fmt : c.formats[0];
    return pr[f] ? pr[f].fullD : pr[c.formats[0]].fullD;
  };
  const MAXP = Math.ceil(Math.max(...COURSES.flatMap(c => c.formats.map(f => pricingFor(c)[f].fullD))) / 500) * 500;
  const F0 = { q: '', program: 'all', subject: 'all', kind: 'all', format: 'all', teacher: 'all', max: MAXP, sort: 'rec' };
  let F = Object.assign({}, F0);
  let TF = { q: '', inst: 'all', subject: 'all' };

  function matchesQ(c, q) {
    if (!q) return true; q = q.toLowerCase().trim();
    const tc = byId(TEACHERS, c.teacher), p = byId(PROGRAMS, c.program), s = byId(SUBJECTS, c.subject);
    return [c.title.bn, c.title.en, tc.n.bn, tc.n.en, p.bn, p.en, p.s.bn, p.s.en, s.bn, s.en].join(' ').toLowerCase().includes(q);
  }
  function filtered() {
    let l = liveCourses().filter(c =>
      matchesQ(c, F.q) &&
      (F.program === 'all' || c.program === F.program) &&
      (F.subject === 'all' || c.subject === F.subject) &&
      (F.kind === 'all' || c.kind === F.kind) &&
      (F.format === 'all' || c.formats.includes(F.format)) &&
      (F.teacher === 'all' || c.teacher === F.teacher) &&
      startPrice(c, F.format) <= F.max);
    const s = F.sort;
    l.sort((a, b) => {
      if (s === 'pa') return startPrice(a, F.format) - startPrice(b, F.format);
      if (s === 'pd') return startPrice(b, F.format) - startPrice(a, F.format);
      if (s === 'rt') return b.rating - a.rating;
      if (s === 'dt') return a.start.localeCompare(b.start);
      return (b.featured - a.featured) || (b.enrolled - a.enrolled);
    });
    return l;
  }
  const isFiltered = () => Object.keys(F0).some(k => k !== 'sort' && F[k] !== F0[k]);

  /* ---------- small components ---------- */
  const kindTag = c => `<span class="tag ${c.kind === 'crash' ? 'tag-p' : ''}">${t(c.kind === 'crash' ? 'crash' : 'regular')}</span>`;
  const schedule = c => c.days.map(d => L(DAYS[d])).join(' · ') + ' · ' + L(c.time);

  const fmtTag = c => c.formats[0] === 'one' ? `<span class="tag tag-one">${t('fmt_tag_one')}</span>` : `<span class="tag tag-grp">${esc(ctName(c.formats[0]))}</span>`;
  function courseCard(c) {
    const tc = byId(TEACHERS, c.teacher), pr = pricingFor(c), prog = byId(PROGRAMS, c.program), sub = byId(SUBJECTS, c.subject);
    const gf = c.formats.find(f => f !== 'one'), g = gf ? pr[gf] : null, one = c.formats.includes('one') ? pr.one : null;
    const seats = g ? Math.max(0, c.seats) : null;
    return `<article class="cc" style="--cc:${progColor(c.program)}">
      <a class="cc-top" href="#course-${c.id}" aria-label="${esc(L(c.title))}">
        ${c.thumb ? `<img class="cc-thumb" src="${c.thumb}" alt="">` : courseArt(c.program)}<span class="cc-shade"></span>
        <span class="cc-code">${esc(prog.code)}</span>
        <span class="cc-prog">${esc(L(prog.s))}</span>
        ${c.featured ? `<span class="cc-feat">${t('featured')}</span>` : ''}
        <span class="cc-emb">${subjArt(c.subject)}${c.kind === 'crash' ? '<i class="cc-bolt">⚡</i>' : ''}</span>
      </a>
      <div class="cc-body">
        <div class="tags">${fmtTag(c)}${kindTag(c)}<span class="tag">${esc(L(sub))}</span></div>
        <h3 class="cc-title"><a href="#course-${c.id}">${esc(L(c.title))}</a></h3>
        <a class="cc-teacher" href="#teacher-${tc.id}">${avatar(tc, 30)}<span><b>${esc(L(tc.n))}</b><small>${esc(L(tc.feat || tc.inst))}</small></span></a>
        <ul class="meta">
          <li>${ic('calendar')}${num(c.cpw)} ${t('cls_week')}</li>
          <li>${ic('clock')}${num(c.weeks)} ${t('weeks')}</li>
          <li>${rate(c.rating)}<span class="mute">(${num(c.reviews)})</span></li>
        </ul>
        <p class="cc-start">${ic('play')}${t(g ? 'starts' : 'starts_one')} <b>${fdate(c.start)}</b>${seats != null ? ` · <span class="${seats <= 3 ? 'warn' : ''}">${t('seats_left')} ${num(seats)}/${num(ctSeats(gf))}</span>` : ''}</p>
        <div class="cc-price">
          ${g ? `<div><small>${esc(ctName(gf))}</small><b>${money(g.fullD)}</b> <s>${money(g.fullA)}</s></div>` : ''}
          ${one ? `<div><small>${esc(ctName('one'))}</small><b>${money(one.fullD)}</b> <s>${money(one.fullA)}</s></div>` : ''}
        </div>
        <a class="btn btn-p btn-block" href="#course-${c.id}">${t('details')}${ic('arrow')}</a>
      </div>
    </article>`;
  }

  function teacherCard(tc) {
    const cs = liveCourses().filter(c => c.teacher === tc.id);
    return `<article class="tcard">
      <a href="#teacher-${tc.id}" class="tc-head">${avatar(tc, 64)}
        <span><h3>${esc(L(tc.n))}</h3><small>${esc(L(tc.inst))}</small></span></a>
      <p class="tc-dept">${esc(L(tc.dept))} · ${esc(L(tc.yr))}</p>
      <div class="tags">${tc.subs.map(s => `<span class="tag">${esc(L(byId(SUBJECTS, s)))}</span>`).join('')}</div>
      <ul class="meta">
        <li>${rate(tc.rating)}</li>
        <li>${ic('users')}${num(tc.stu)} ${t('students')}</li>
        <li>${ic('book')}${num(cs.length)} ${t('courses_n')}</li>
      </ul>
      <div class="vbadges">${verBadges(tc, true)}</div>
      <a class="btn btn-o btn-block" href="#teacher-${tc.id}">${t('view_profile')}</a>
    </article>`;
  }

  function verBadges(tc, compact) {
    const b = tc.badges;
    const it = (ok, k) => `<span class="vb ${ok ? 'ok' : 'wait'}">${ic(ok ? 'shield' : 'clock')}${t(k)}${ok ? '' : ' · ' + t('pending')}</span>`;
    return it(b.id, 'v_id') + it(b.pay, 'v_pay') + it(b.doc, 'v_doc');
  }

  const sec = (cls, head, body) => `<section class="sec ${cls || ''}"><div class="wrap">${head || ''}${body}</div></section>`;
  const sechead = (title, sub, extra = '') => `<header class="sec-h"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>${extra}</header>`;
  const pagehead = (title, sub, crumbs) => `<div class="phead"><div class="wrap"><nav class="crumbs" aria-label="breadcrumb"><a href="#home">${t('nav_home')}</a>${crumbs || ''}</nav><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div></div>`;

  /* ---------- header / footer ---------- */
  const LOGO = `<a class="logo" href="#home" aria-label="Chaatro.com"><img src="img/logo.png" alt="Chaatro.com" width="400" height="120"></a>`;
  let menuOpen = false;

  function header(r) {
    const act = n => (r.name === n || (n === 'courses' && r.name === 'course') || (n === 'teachers' && r.name === 'teacher') || (n === 'blog' && r.name === 'post')) ? ' aria-current="page"' : '';
    return `<div class="wrap hd-in">
      ${LOGO}
      <nav class="nav ${menuOpen ? 'open' : ''}" id="nav" aria-label="main">
        <a href="#home"${act('home')}>${t('nav_home')}</a>
        <a href="#courses"${act('courses')}>${t('nav_courses')}</a>
        <a href="#teachers"${act('teachers')}>${t('nav_teachers')}</a>
        <a href="#how-it-works"${act('how-it-works')}>${t('nav_how')}</a>
        <a href="#blog"${act('blog')}>${t('nav_blog')}</a>
        <a href="#contact"${act('contact')}>${t('nav_contact')}</a>
        <div class="nav-end">
          <a class="btn btn-o btn-sm" href="#login"${act('login')}>${t('login')}</a>
          <a class="btn btn-p btn-sm becomet" href="#become-teacher"${act('become-teacher')}>${ic('award')}${t('nav_become')}</a>
        </div>
      </nav>
      <div class="hd-tools">
        <button class="lang" data-act="lang" aria-label="${t('lang_label')}">${ic('globe')}<span>${lang === 'bn' ? 'EN' : 'বাংলা'}</span></button>
        <button class="burger" data-act="menu" aria-expanded="${menuOpen}" aria-controls="nav" aria-label="${t('menu')}">${ic(menuOpen ? 'close' : 'menu')}</button>
      </div>
    </div>`;
  }

  function footer() {
    const lk = (h, k) => `<a href="#${h}">${t(k)}</a>`;
    return `<div class="wrap">
      <div class="ft-top"><a class="logo" href="#home" aria-label="Chaatro.com"><img src="img/logo-footer.png" alt="Chaatro.com" width="800" height="240"></a><p>${t('ft_short')}</p></div>
      <nav class="ft-links" aria-label="footer">${lk('about', 'nav_about')}${lk('how-it-works', 'nav_how')}${lk('blog', 'nav_blog')}${lk('faq', 'nav_faq')}${lk('become-teacher', 'nav_become')}${lk('contact', 'nav_contact')}</nav>
      <nav class="ft-pol" aria-label="policies">${lk('policy-payment', 'p_payment')}${lk('policy-refund', 'p_refund')}${lk('policy-cookie', 'p_cookie')}${lk('policy-terms', 'p_terms')}${lk('policy-privacy', 'p_privacy')}</nav>
      <div class="ft-bot"><span>© ${num(2026)} ছাত্র.com · ${t('ft_rights')}</span><span>${t('ft_demo')}</span></div>
    </div>`;
  }

  /* ---------- filter bar ---------- */
  function sel(name, label, opts, val) {
    return `<label class="sel" for="f-${name}"><span>${label}</span><select id="f-${name}" data-f="${name}">${opts.map(o => `<option value="${o[0]}"${String(o[0]) === String(val) ? ' selected' : ''}>${esc(o[1])}</option>`).join('')}</select></label>`;
  }
  function chips() {
    const cnt = id => liveCourses().filter(c => c.program === id).length;
    return `<button class="chip" data-pick="program" data-val="all" aria-pressed="${F.program === 'all'}">${t('all')}<em>${num(liveCourses().length)}</em></button>` +
      PROGRAMS.filter(p => !p.hidden).map(p => `<button class="chip" data-pick="program" data-val="${p.id}" aria-pressed="${F.program === p.id}">${esc(L(p.s))}<em>${num(cnt(p.id))}</em></button>`).join('');
  }
  function filterBar(simple) {
    if (simple) { Object.assign(F, { q: '', kind: 'all', teacher: 'all', sort: 'rec' }); return `<div class="fb fb-s" id="filter" role="search">
      <div class="chips" id="chips" role="group" aria-label="${t('f_program')}">${chips()}</div>
      <div class="fb-row">
        ${sel('subject', t('f_subject'), [['all', t('all')]].concat(SUBJECTS.map(s => [s.id, L(s)])), F.subject)}
        ${sel('format', t('f_format'), [['all', t('all')]].concat(CTYPES.filter(x => x.on).map(x => [x.id, L(x)])), F.format)}
        <label class="rng" for="f-max"><span>${t('f_price')} <b id="maxv">${money(F.max)}</b></span><input id="f-max" data-f="max" type="range" min="1500" max="${MAXP}" step="50" value="${F.max}"></label>
      </div>
    </div>
    <div class="rhead" aria-live="polite"><b id="rcount"></b></div>`; }
    return `<div class="fb" id="filter" role="search">
      <div class="fb-top">
        <label class="srch" for="f-q">${ic('search')}<input id="f-q" data-f="q" type="search" value="${esc(F.q)}" placeholder="${t('f_ph')}" autocomplete="off"></label>
        <button class="btn btn-g" data-act="reset">${ic('repeat')}${t('f_reset')}</button>
      </div>
      <div class="chips" id="chips" role="group" aria-label="${t('f_program')}">${chips()}</div>
      <div class="fb-row">
        ${sel('subject', t('f_subject'), [['all', t('all')]].concat(SUBJECTS.map(s => [s.id, L(s)])), F.subject)}
        ${sel('kind', t('f_kind'), [['all', t('all')], ['regular', t('regular')], ['crash', t('crash')]], F.kind)}
        ${sel('format', t('f_format'), [['all', t('all')]].concat(CTYPES.filter(x => x.on).map(x => [x.id, L(x)])), F.format)}
        ${sel('teacher', t('f_teacher'), [['all', t('all')]].concat(TEACHERS.map(x => [x.id, L(x.n)])), F.teacher)}
        ${sel('sort', t('f_sort'), [['rec', t('s_rec')], ['pa', t('s_pa')], ['pd', t('s_pd')], ['rt', t('s_rt')], ['dt', t('s_dt')]], F.sort)}
        <label class="rng" for="f-max"><span>${t('f_price')} <b id="maxv">${money(F.max)}</b></span><input id="f-max" data-f="max" type="range" min="1500" max="${MAXP}" step="50" value="${F.max}"></label>
      </div>
    </div>
    <div class="rhead" aria-live="polite"><b id="rcount"></b></div>`;
  }
  function results() {
    const list = filtered();
    const rc = $('#rcount'); if (rc) rc.textContent = num(list.length) + ' ' + t('found');
    const box = $('#results'); if (!box) return;
    box.innerHTML = list.length ? list.map(courseCard).join('') :
      `<div class="empty"><h3>${t('empty_t')}</h3><p>${t('empty_d')}</p><button class="btn btn-p" data-act="reset">${t('f_reset')}</button></div>`;
  }

  /* ---------- views ---------- */
  const SLIDES = [
    { k: 's1', cls: 'sl-1', href: '#courses' },
    { k: 's2', cls: 'sl-2', href: '#courses', pick: 'crash' },
    { k: 's3', cls: 'sl-3', href: '#courses', prog: 'cadet' },
  ];
  let slide = 0, timer = null;

  const SART = {
    bangla: ['#FF8A5B', '#FFD6A5', '<path d="M40 150 L120 128 L200 150 L200 70 L120 48 L40 70Z" fill="#fff" opacity=".95"/><path d="M120 48 V128" stroke="#E8590C" stroke-width="3"/><text x="78" y="112" font-size="44" font-weight="800" fill="#E8590C" text-anchor="middle" font-family="sans-serif">অ</text><text x="162" y="112" font-size="44" font-weight="800" fill="#8C52FF" text-anchor="middle" font-family="sans-serif">আ</text>'],
    english: ['#5B8CFF', '#C7D9FF', '<rect x="48" y="44" width="144" height="96" rx="12" fill="#fff" opacity=".95"/><text x="96" y="112" font-size="52" font-weight="800" fill="#2F5BE0" text-anchor="middle" font-family="Georgia,serif">A</text><text x="146" y="112" font-size="40" font-weight="700" fill="#8C52FF" text-anchor="middle" font-family="Georgia,serif">a</text><path d="M168 36 L196 64 L176 74 L158 56Z" fill="#FFC53D"/><path d="M158 56 L176 74 L152 80Z" fill="#0E0B16"/>'],
    gk: ['#22B8A0', '#BFF2E8', '<circle cx="120" cy="92" r="52" fill="#fff" opacity=".95"/><ellipse cx="120" cy="92" rx="22" ry="52" fill="none" stroke="#12907C" stroke-width="3"/><path d="M68 92 H172 M76 66 H164 M76 118 H164" stroke="#12907C" stroke-width="3"/><path d="M96 70 q14 -8 22 4 q-6 14 -20 10z M124 100 q16 -6 22 8 q-8 14 -22 6z" fill="#34C38F"/><rect x="104" y="144" width="32" height="8" rx="4" fill="#0E0B16" opacity=".6"/>'],
    math: ['#9B5CFF', '#DCC8FF', '<rect x="44" y="40" width="152" height="104" rx="12" fill="#fff" opacity=".95"/><text x="76" y="92" font-size="34" font-weight="800" fill="#6B34E0" text-anchor="middle" font-family="sans-serif">π</text><text x="126" y="92" font-size="30" font-weight="800" fill="#E8590C" text-anchor="middle" font-family="sans-serif">∑</text><text x="170" y="92" font-size="30" font-weight="800" fill="#12907C" text-anchor="middle" font-family="sans-serif">√x</text><text x="120" y="128" font-size="26" font-weight="700" fill="#0E0B16" text-anchor="middle" font-family="sans-serif">x² + y² = r²</text>'],
    combined: ['#FF5BA7', '#FFD0E6', '<rect x="56" y="104" width="128" height="22" rx="5" fill="#8C52FF"/><rect x="68" y="80" width="112" height="22" rx="5" fill="#FFC53D"/><rect x="50" y="56" width="120" height="22" rx="5" fill="#22B8A0"/><rect x="62" y="132" width="116" height="20" rx="5" fill="#2F5BE0"/><path d="M110 56 l10 -22 l10 22z" fill="#fff"/><path d="M96 36 l24 -10 l24 10 l-24 10z" fill="#0E0B16"/>'],
  };
  const subjArt = id => { const a = SART[id] || SART.combined; return `<svg class="sc-art" viewBox="0 0 240 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a[0]}"/><stop offset="1" stop-color="${a[1]}"/></linearGradient></defs><rect width="240" height="160" fill="url(#g-${id})"/><circle cx="26" cy="26" r="40" fill="#fff" opacity=".18"/><circle cx="220" cy="150" r="50" fill="#fff" opacity=".15"/>${a[2]}</svg>`; };
  const RLOOK = [
    { g: 'h', skin: '#E3A87C', hair: '#1B1424', shirt: '#8C52FF' }, { g: 'f', skin: '#E8B48A', hair: '#241545', shirt: '#B794FF', gl: 1 },
    { g: 'f', skin: '#D99A6C', hair: '#1B1424', shirt: '#0E0B16' }, { g: 'm', skin: '#E8B48A', hair: '#3A2418', shirt: '#6B34E0' },
    { g: 'f', skin: '#EDBF9A', hair: '#3A2418', shirt: '#8C52FF' }, { g: 'm', skin: '#D99A6C', hair: '#1B1424', shirt: '#17102B', gl: 1 },
    { g: 'f', skin: '#E3A87C', hair: '#6B34E0', shirt: '#4A2BA8' }, { g: 'm', skin: '#E8B48A', hair: '#241545', shirt: '#B794FF' },
  ];
  const scroller = (inner, id) => `<div class="scr" data-scr="${id}"><button class="scr-b l" data-act="scr" data-dir="-1" aria-label="${t('prev')}">${ic('left')}</button><div class="scr-t" tabindex="0">${inner}</div><button class="scr-b r" data-act="scr" data-dir="1" aria-label="${t('next')}">${ic('right')}</button></div>`;

  /* প্রোগ্রাম কার্ডের ইলাস্ট্রেশন */
  const trees = c => `<g fill="${c}"><circle cx="30" cy="212" r="16"/><rect x="28" y="214" width="4" height="22" fill="#4a3b2a"/><circle cx="292" cy="208" r="18"/><rect x="290" y="212" width="4" height="26" fill="#4a3b2a"/></g>`;
  const arches = (wall, dark, n0) => Array.from({ length: n0 }, (_, i) => { const x = 62 + i * (196 / n0), w = 196 / n0 - 8; return `<path d="M${x} 226 V196 a${w / 2} ${w / 2} 0 0 1 ${w} 0 V226Z" fill="${dark}"/>`; }).join('');
  const PSCENE = {
    cadet: () => `<defs><linearGradient id="pg-cadet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B2FD0"/><stop offset=".6" stop-color="#FF9A6B"/><stop offset="1" stop-color="#FFD7A8"/></linearGradient></defs><rect width="320" height="260" fill="url(#pg-cadet)"/><circle cx="250" cy="70" r="30" fill="#FFE9B8" opacity=".9"/><rect y="226" width="320" height="34" fill="#2F7D4F"/><rect x="40" y="170" width="240" height="58" fill="#F4E9D8"/><rect x="132" y="120" width="56" height="108" fill="#FFF6E8"/><path d="M124 120 L160 90 L196 120Z" fill="#B5473A"/><path d="M160 90 V60" stroke="#fff" stroke-width="3"/><path d="M160 60 h26 l-6 8 l6 8 h-26z" fill="#E03131"/>${arches('#F4E9D8', '#6B4E8F', 6)}<rect x="148" y="196" width="24" height="32" rx="12" fill="#3B2A5C"/>${trees('#1F6B3E')}`,
    du: (a, b, wall) => `<defs><linearGradient id="pg-${a}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="320" height="260" fill="url(#pg-${a})"/><circle cx="60" cy="60" r="24" fill="#fff" opacity=".35"/><rect y="228" width="320" height="32" fill="#1F4D36"/><rect x="36" y="168" width="248" height="62" fill="${wall}"/><rect x="36" y="162" width="248" height="8" fill="#9C3D2E"/><path d="M118 168 V120 a42 42 0 0 1 84 0 V168Z" fill="${wall}"/><path d="M130 120 a30 30 0 0 1 60 0Z" fill="#B7472F"/><circle cx="160" cy="84" r="9" fill="#B7472F"/><path d="M160 75 v-18" stroke="#fff" stroke-width="2.5"/><g fill="#B7472F"><path d="M60 162 a16 16 0 0 1 32 0Z"/><path d="M228 162 a16 16 0 0 1 32 0Z"/></g>${arches(wall, '#7A2F22', 7)}<path d="M150 228 V190 a10 10 0 0 1 20 0 V228Z" fill="#4A1D16"/>${trees('#2E7D4F')}`,
    bup: () => `<defs><linearGradient id="pg-bup" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2B1B73"/><stop offset="1" stop-color="#7A3FF0"/></linearGradient></defs><rect width="320" height="260" fill="url(#pg-bup)"/><g fill="#fff" opacity=".8"><circle cx="50" cy="44" r="2"/><circle cx="120" cy="30" r="1.6"/><circle cx="270" cy="60" r="2"/><circle cx="220" cy="24" r="1.6"/></g><rect y="230" width="320" height="30" fill="#17102B"/><rect x="70" y="86" width="110" height="146" fill="#CFE0FF"/><rect x="180" y="126" width="80" height="106" fill="#A9C4F5"/><g stroke="#4A6FB5" stroke-width="2">${[0, 1, 2, 3, 4].map(i => `<path d="M70 ${112 + i * 24} H180"/>`).join('')}${[0, 1, 2].map(i => `<path d="M${97 + i * 27} 86 V232"/>`).join('')}${[0, 1, 2].map(i => `<path d="M180 ${150 + i * 26} H260"/>`).join('')}</g><path d="M125 86 L125 60" stroke="#fff" stroke-width="3"/><path d="M125 60 h28 l-6 8 l6 8 h-28z" fill="#FFC53D"/><circle cx="262" cy="70" r="26" fill="#FFC53D"/><path d="M262 54 l22 10 l-22 10 l-22 -10z" fill="#17102B"/><path d="M250 74 v10 q12 8 24 0 v-10" fill="none" stroke="#17102B" stroke-width="3"/>`,
    buet: () => `<defs><linearGradient id="pg-buet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0E2A6B"/><stop offset="1" stop-color="#2F5BE0"/></linearGradient></defs><rect width="320" height="260" fill="url(#pg-buet)"/><g stroke="#fff" opacity=".12">${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 40} 0 V260"/>`).join('')}${Array.from({ length: 7 }, (_, i) => `<path d="M0 ${i * 40} H320"/>`).join('')}</g><g transform="translate(220 90)"><circle r="46" fill="none" stroke="#9CC0FF" stroke-width="16" stroke-dasharray="14 9.2"/><circle r="34" fill="#2F5BE0" stroke="#9CC0FF" stroke-width="5"/><circle r="12" fill="#9CC0FF"/></g><g transform="translate(120 160)"><circle r="30" fill="none" stroke="#FFC53D" stroke-width="12" stroke-dasharray="10 6.8"/><circle r="22" fill="#0E2A6B" stroke="#FFC53D" stroke-width="4"/><circle r="7" fill="#FFC53D"/></g><path d="M40 200 h50 l14 -24 l18 40 l16 -22 h60" fill="none" stroke="#7CFFB2" stroke-width="3"/><circle cx="40" cy="200" r="5" fill="#7CFFB2"/><path d="M60 40 L84 110" stroke="#fff" stroke-width="4"/><path d="M60 40 L36 110" stroke="#fff" stroke-width="4"/><circle cx="60" cy="38" r="7" fill="#fff"/><path d="M42 98 a26 26 0 0 0 36 0" fill="none" stroke="#FFC53D" stroke-width="3"/>`,
  };
  const progArt = id => `<svg class="pc-art" viewBox="0 0 320 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${id === 'cadet' ? PSCENE.cadet() : id === 'bup' ? PSCENE.bup() : id === 'buet' ? PSCENE.buet() : PSCENE.du(...(({ 'du-ka': ['#3B2A9C', '#9C7BFF', '#F2D9B8'], 'du-kha': ['#0F6B6B', '#7FE0CF', '#F4E3C3'], 'du-ga': ['#9C2F6B', '#FF9CC4', '#F6DDC8'], 'du-gha': ['#B26A00', '#FFD27A', '#F8E7C6'] })[id] || ['#5B3AC8', '#B794FF', '#F2E6D0']))}</svg>`;

  const courseArt = id => progArt(id).replace('viewBox="0 0 320 260"', 'viewBox="0 40 320 170"').replace('class="pc-art"', 'class="cc-art"');

  /* ব্যানার স্লাইডের ইলাস্ট্রেশন */
  const avs = (l, x, y, sz) => cartoon(l).replace('<svg viewBox="0 0 100 100" aria-hidden="true">', `<svg x="${x}" y="${y}" width="${sz}" height="${sz}" viewBox="0 0 100 100">`);
  const slideArt = k => {
    const T1 = LOOK.t01, T2 = LOOK.t02, st = i => RLOOK[i % RLOOK.length];
    if (k === 's1') return `<svg viewBox="0 0 480 340" aria-hidden="true"><circle cx="400" cy="60" r="90" fill="#fff" opacity=".12"/><circle cx="60" cy="300" r="70" fill="#fff" opacity=".1"/>
      <rect x="50" y="40" width="340" height="220" rx="18" fill="#fff"/><rect x="64" y="54" width="312" height="192" rx="10" fill="#F1E9FF"/>
      <rect x="76" y="68" width="172" height="118" rx="8" fill="#fff" stroke="#D8C6FB" stroke-width="2"/><text x="162" y="112" font-size="22" font-weight="800" fill="#6B34E0" text-anchor="middle" font-family="sans-serif">x² + y² = r²</text><path d="M104 168 L150 132 L196 168Z" fill="none" stroke="#FF8A5B" stroke-width="3"/><circle cx="222" cy="86" r="5" fill="#FFC53D"/>
      <rect x="76" y="74" width="46" height="18" rx="9" fill="#E03131"/><circle cx="88" cy="83" r="4" fill="#fff"/><text x="97" y="87" font-size="10" font-weight="800" fill="#fff" font-family="sans-serif">LIVE</text>
      ${avs(T1, 262, 66, 104)}<rect x="262" y="166" width="104" height="20" rx="10" fill="#8C52FF"/><text x="314" y="180" font-size="11" font-weight="700" fill="#fff" text-anchor="middle" font-family="sans-serif">Teacher</text>
      ${[0, 1, 2, 3].map(i => `<rect x="${76 + i * 74}" y="196" width="64" height="42" rx="8" fill="#fff" stroke="#D8C6FB" stroke-width="2"/>${avs(st(i + 1), 86 + i * 74, 198, 38)}`).join('')}
      <rect x="196" y="260" width="48" height="16" fill="#E8DEFF"/><rect x="150" y="274" width="140" height="12" rx="6" fill="#fff" opacity=".9"/>
      <g transform="translate(372 34)"><rect width="84" height="54" rx="16" fill="#fff"/><path d="M18 54 L10 72 L36 54Z" fill="#fff"/><circle cx="24" cy="27" r="5" fill="#8C52FF"/><circle cx="42" cy="27" r="5" fill="#8C52FF"/><circle cx="60" cy="27" r="5" fill="#8C52FF"/></g>
      <g transform="translate(350 232)"><rect width="96" height="14" rx="4" fill="#22B8A0"/><rect x="8" y="-16" width="84" height="14" rx="4" fill="#FFC53D"/><rect x="2" y="16" width="92" height="14" rx="4" fill="#2F5BE0"/><path d="M48 -34 l30 -10 l30 10 l-30 10z" fill="#17102B"/></g>
      <path d="M430 150 l6 14 l15 2 l-11 10 l3 15 l-13 -8 l-13 8 l3 -15 l-11 -10 l15 -2z" fill="#FFC53D"/></svg>`;
    if (k === 's2') return `<svg viewBox="0 0 480 340" aria-hidden="true"><circle cx="420" cy="50" r="80" fill="#8C52FF" opacity=".25"/>
      <rect x="24" y="30" width="340" height="250" rx="22" fill="#1E1638" stroke="#4A3B7A" stroke-width="2"/>
      <rect x="40" y="46" width="176" height="146" rx="12" fill="#EFE7FF"/>${avs(T2, 78, 52, 100)}<rect x="52" y="160" width="76" height="22" rx="11" fill="#8C52FF"/><text x="90" y="175" font-size="11" font-weight="700" fill="#fff" text-anchor="middle" font-family="sans-serif">Teacher</text><circle cx="196" cy="62" r="8" fill="#E03131"/>
      ${[0, 1].map(c => [0, 1, 2].map(r => `<rect x="${228 + c * 62}" y="${46 + r * 50}" width="56" height="44" rx="9" fill="#2A2050" stroke="#4A3B7A"/>${avs(st(c * 3 + r + 2), 232 + c * 62, 46 + r * 50 + 2, 40)}`).join('')).join('')}
      <rect x="40" y="200" width="76" height="46" rx="9" fill="#2A2050" stroke="#4A3B7A"/>${avs(st(7), 56, 202, 42)}
      ${[0, 1, 2].map(i => `<circle cx="${160 + i * 40}" cy="256" r="13" fill="${i === 2 ? '#E03131' : '#3B2F5C'}"/>`).join('')}<rect x="232" y="206" width="120" height="40" rx="9" fill="#2A2050"/><path d="M244 226 h20 m6 0 h20 m6 0 h20" stroke="#8C52FF" stroke-width="5" stroke-linecap="round"/>
      <rect x="290" y="8" width="96" height="36" rx="18" fill="#8C52FF"/><text x="338" y="32" font-size="19" font-weight="800" fill="#fff" text-anchor="middle" font-family="sans-serif">${num('1 : 7')}</text>
      <g transform="translate(318 196)"><rect width="152" height="112" rx="18" fill="#fff"/><rect x="8" y="8" width="136" height="68" rx="10" fill="#F1E9FF"/>${avs(T1, 16, 10, 60)}${avs(st(3), 78, 10, 60)}<path d="M72 44 h10" stroke="#8C52FF" stroke-width="3" stroke-dasharray="3 3"/><rect x="40" y="84" width="72" height="22" rx="11" fill="#17102B"/><text x="76" y="100" font-size="13" font-weight="800" fill="#fff" text-anchor="middle" font-family="sans-serif">${num('1 : 1')}</text></g></svg>`;
    return `<svg viewBox="0 0 480 340" aria-hidden="true"><defs><clipPath id="cl3"><rect x="60" y="30" width="330" height="250" rx="26"/></clipPath></defs><circle cx="420" cy="70" r="70" fill="#8C52FF" opacity=".15"/><circle cx="40" cy="290" r="60" fill="#8C52FF" opacity=".12"/>
      <rect x="52" y="38" width="330" height="250" rx="26" fill="#8C52FF" opacity=".25"/><g clip-path="url(#cl3)"><svg x="60" y="30" width="330" height="250" viewBox="0 0 320 260" preserveAspectRatio="xMidYMid slice">${PSCENE.cadet()}</svg></g>
      <circle cx="108" cy="236" r="62" fill="#fff"/>${avs(st(3), 52, 180, 112)}<path d="M62 190 l46 -20 l46 20 l-46 20z" fill="#17102B"/><path d="M82 200 v14 q26 14 52 0 v-14" fill="none" stroke="#17102B" stroke-width="5"/><path d="M154 190 v26" stroke="#FFC53D" stroke-width="3"/>
      <g transform="translate(372 176)"><path d="M-14 -4 L-22 40 L0 30 L22 40 L14 -4Z" fill="#E03131"/><circle r="34" fill="#FFC53D" stroke="#F2A900" stroke-width="5"/><path d="M0 -18 l6 13 l14 2 l-10 10 l3 14 l-13 -7 l-13 7 l3 -14 l-10 -10 l14 -2z" fill="#fff"/></g>
      <g transform="translate(366 20) rotate(8)"><rect width="84" height="104" rx="8" fill="#fff" stroke="#D8C6FB" stroke-width="2"/><text x="42" y="56" font-size="34" font-weight="800" fill="#E03131" text-anchor="middle" font-family="sans-serif">A+</text><path d="M14 74 h56 M14 86 h40" stroke="#D8C6FB" stroke-width="4" stroke-linecap="round"/></g>
      <g transform="translate(190 292) rotate(-8)"><rect width="110" height="14" rx="3" fill="#FFC53D"/><path d="M110 0 l16 7 l-16 7z" fill="#F2D9B8"/><rect x="-10" width="10" height="14" rx="3" fill="#E03131"/></g></svg>`;
  };


  /* ---------- বান্ডেল কোর্স ---------- */
  function bundleCard(b) {
    const k = bundleCalc(b), c0 = k.cs[0];
    return `<article class="cc cc-bd" style="--cc:${progColor(c0.program)}">
      <a class="cc-top" href="#bundle-${b.id}" aria-label="${esc(L(b.title))}">${courseArt(c0.program)}<span class="cc-shade"></span>
        <span class="cc-prog">${t('bd_tag')}</span><span class="cc-feat">${t('bd_save')} ${num(b.disc)}%</span><span class="cc-emb">${subjArt(c0.subject)}</span></a>
      <div class="cc-body"><div class="tags"><span class="tag tag-bd">${num(k.cs.length)} ${t('bd_n')}</span></div>
        <h3 class="cc-title"><a href="#bundle-${b.id}">${esc(L(b.title))}</a></h3>
        <ul class="bd-l">${k.cs.slice(0, 4).map(c => `<li>${ic('check')}${esc(L(c.title))}</li>`).join('')}${k.cs.length > 4 ? `<li class="mute">+ ${num(k.cs.length - 4)} ${t('bd_more')}</li>` : ''}</ul>
        <div class="cc-price"><div><small>${t('bd_price')}</small><b>${money(k.price)}</b> <s>${money(k.total)}</s></div><div><small>${t('bd_you_save')}</small><b class="okm">${money(k.save)}</b></div></div>
        <a class="btn btn-p btn-block" href="#bundle-${b.id}">${t('details')}${ic('arrow')}</a></div></article>`;
  }
  function viewBundles() {
    const l = BUNDLES.filter(b => b.active && bundleCourses(b).length > 1);
    return pagehead(t('bd_t'), t('bd_d'), `<span>/</span><span>${t('bd_t')}</span>`) + sec('', '', l.length ? `<div class="grid grid-c">${l.map(bundleCard).join('')}</div>` : `<p class="mute">${t('bd_none')}</p>`);
  }
  function viewBundle(id) {
    const b = byId(BUNDLES, id); if (!b || !b.active) return view404();
    const k = bundleCalc(b); if (k.cs.length < 2) return view404();
    return `<div class="phead phead-c" style="--cc:${progColor(k.cs[0].program)}"><div class="wrap">
      <nav class="crumbs"><a href="#home">${t('nav_home')}</a><span>/</span><a href="#bundles">${t('bd_t')}</a></nav>
      <div class="tags tags-w"><span class="tag">${t('bd_tag')}</span><span class="tag">${num(k.cs.length)} ${t('bd_n')}</span><span class="tag">${t('bd_save')} ${num(b.disc)}%</span></div>
      <h1>${esc(L(b.title))}</h1><p>${esc(L(b.desc || b.title))}</p></div></div>
    <div class="wrap cd"><div class="cd-main">
      <section class="blk"><h2>${t('bd_incl')}</h2><div class="grid grid-c2">${k.cs.map(courseCard).join('')}</div></section></div>
      <aside class="cd-side"><div class="checkout"><h3>${t('bd_summary')}</h3>
        <ul class="ck-l">${k.cs.map(c => `<li><span>${esc(L(c.title))}</span><b>${money(pricingFor(c)[c.formats[0]].fullD)}</b></li>`).join('')}</ul>
        <dl class="sum"><div><dt>${t('bd_sep')}</dt><dd><s>${money(k.total)}</s></dd></div><div class="ok"><dt>${t('bd_disc')} (${num(b.disc)}%)</dt><dd>− ${money(k.save)}</dd></div><div class="tot"><dt>${t('bd_price')}</dt><dd>${money(k.price)}</dd></div></dl>
        <a class="btn btn-p btn-block btn-lg" href="#bpay-${b.id}">${t('bd_enrol')}${ic('arrow')}</a><p class="co-note">${ic('video')}${t('bd_note')}</p></div></aside></div>`;
  }
  function viewBundlePay(id) {
    const b = byId(BUNDLES, id); if (!b || !b.active) return view404();
    const k = bundleCalc(b); if (k.cs.length < 2) return view404();
    return pagehead(t('ck_t'), t('ck_d'), `<span>/</span><a href="#bundle-${b.id}">${esc(L(b.title))}</a><span>/</span><span>${t('ck_t')}</span>`) +
      sec('', '', `<div class="ck-wrap" id="ck-wrap"><form class="bt-form" data-form="bcheckout" data-id="${b.id}" novalidate>
        <h3 class="fs-t">${t('ck_details')}</h3>
        <div class="row">${fld({ name: 'en_name', label: t('f_name'), req: true, auto: 'name' })}${fld({ name: 'en_phone', label: t('f_phone'), req: true, type: 'tel', ph: '01XXXXXXXXX', auto: 'tel' })}</div>
        <div class="row">${fld({ name: 'en_email', label: t('f_email'), type: 'email', auto: 'email' })}${fld({ name: 'en_ref', label: t('f_ref'), ph: 'CHAATRO-XXXX' })}</div>
        <h3 class="fs-t">${t('ck_pay')}</h3>
        <fieldset class="co-g pays"><label class="opt on"><input type="radio" name="bpay" value="cash" checked><span><b>${t('ck_cash')}</b><small>${t('ck_cash_d')}</small></span></label></fieldset>
        <p class="paynote ok">${ic('check')}${t('ck_cash_note')}</p>
        <button class="btn btn-p btn-lg btn-block" type="submit">${t('ck_place')}${ic('arrow')}</button><p class="mute sm center">${t('ck_demo')}</p></form>
        <aside class="checkout"><h3>${t('ck_summary')}</h3><div class="ck-c" style="--cc:${progColor(k.cs[0].program)}"><span class="ck-code">${t('bd_tag')}</span><span><b>${esc(L(b.title))}</b><small>${num(k.cs.length)} ${t('bd_n')}</small></span></div>
          <ul class="ck-l">${k.cs.map(c => `<li><span>${esc(L(c.title))}</span><b>${money(pricingFor(c)[c.formats[0]].fullD)}</b></li>`).join('')}</ul>
          <dl class="sum"><div><dt>${t('bd_sep')}</dt><dd><s>${money(k.total)}</s></dd></div><div class="ok"><dt>${t('bd_disc')}</dt><dd>− ${money(k.save)}</dd></div><div class="tot"><dt>${t('sum_total')}</dt><dd>${money(k.price)}</dd></div></dl>
          <a class="btn btn-o btn-block" href="#bundle-${b.id}">${t('ck_change')}</a><p class="co-note">${ic('video')}${t('bd_coupon_note')}</p></aside></div>`);
  }

  function viewHome() {
    const feat = liveCourses().filter(c => c.featured);
    const ftch = TEACHERS.filter(x => ['t01', 't02', 't08'].includes(x.id));
    const avg = (COURSES.reduce((s, c) => s + c.rating, 0) / COURSES.length).toFixed(1);
    const stu = COURSES.reduce((s, c) => s + c.enrolled, 0);
    return `
    <section class="banner"><div class="wrap">
      <div class="slides" role="region" aria-roledescription="carousel" aria-label="${t('banner_label')}">
        ${SLIDES.map((s, i) => `<div class="slide ${s.cls}" data-i="${i}" aria-hidden="${i !== 0}" ${i === 0 ? 'data-on="1"' : ''}>
          <div class="sl-txt"><span class="sl-eyebrow">${t(s.k + '_e')}</span><h1>${t(s.k + '_t')}</h1><p>${t(s.k + '_d')}</p>
          <div class="sl-cta"><button class="btn btn-w" data-go-filter="${s.pick || ''}" data-prog="${s.prog || ''}">${t(s.k + '_c')}${ic('arrow')}</button></div></div>
          <div class="sl-art" aria-hidden="true">${slideArt(s.k)}</div></div>`).join('')}
        <div class="sl-ctl"><button data-act="prev" aria-label="${t('prev')}">${ic('left')}</button>
          <div class="dots">${SLIDES.map((s, i) => `<button data-act="dot" data-i="${i}" aria-label="${num(i + 1)}" aria-current="${i === 0}"></button>`).join('')}</div>
          <button data-act="next" aria-label="${t('next')}">${ic('right')}</button></div>
      </div>
      <div class="thin">
        <a href="#become-teacher" class="tb">${ic('award')}<span>${t('tb1')}</span></a>
        <button class="tb" data-act="coupon-note">${ic('plus')}<span>${t('tb2')}</span></button>
        <a href="#how-it-works" class="tb">${ic('video')}<span>${t('tb3')}</span></a>
      </div>
    </div></section>

    ${sec('sec-soft', sechead(t('prog_t'), t('prog_d')), scroller(PROGRAMS.filter(p => !p.hidden).map(p => {
      const n = liveCourses().filter(c => c.program === p.id).length;
      return `<button class="scr-i pcard" data-pick="program" data-val="${p.id}" data-go="1">${p.thumb ? `<img class="pc-thumb" src="${p.thumb}" alt="">` : progArt(p.id)}<span class="pc-shade"></span><span class="pc-code">${esc(p.code)}</span><span class="pc-t">${esc(L(p))}</span><span class="pc-d">${esc(L(p.d))}</span><span class="pc-n">${num(n)} ${t('courses_n')}${ic('arrow')}</span></button>`;
    }).join(''), 'programs'))}

    ${sec('sec-filter', sechead(t('home_find_t'), t('home_find_d')), `${filterBar(true)}<div class="grid grid-c" id="results"></div>
      <div class="more"><a class="btn btn-o" href="#courses">${t('see_all_courses')}${ic('arrow')}</a></div>`)}

    ${sec('sec-soft', sechead(t('brt_t'), t('brt_d'), `<a class="btn btn-o" href="#teachers">${t('all_teachers')}${ic('arrow')}</a>`), scroller(TEACHERS.map(x => `<div class="scr-i scr-t1">${teacherCard(x)}</div>`).join(''), 'teachers'))}

    ${sec('', sechead(t('subj_t'), t('subj_d')), scroller(SUBJECTS.map(s => {
      const n = COURSES.filter(c => c.subject === s.id).length;
      return `<button class="scr-i scard sc-img" data-pick="subject" data-val="${s.id}" data-go="1">${subjArt(s.id)}<span class="sc-body"><b>${esc(L(s))}</b><small>${num(n)} ${t('courses_n')}</small></span></button>`;
    }).join(''), 'subjects'))}

    ${BUNDLES.some(b => b.active && bundleCourses(b).length > 1) ? sec('sec-soft', sechead(t('bd_t'), t('bd_d'), `<a class="btn btn-o" href="#bundles">${t('bd_all')}${ic('arrow')}</a>`), `<div class="grid grid-c">${BUNDLES.filter(b => b.active && bundleCourses(b).length > 1).map(bundleCard).join('')}</div>`) : ''}

    ${sec('sec-dark', sechead(t('fmt_t'), t('fmt_d')), `<div class="fmt">
      <div class="fmt-c"><span class="fmt-n">${num('1 : 1')}</span><h3>${t('one_fmt')}</h3><p>${t('fmt_one_d')}</p><ul><li>${ic('check')}${t('fmt_one_1')}</li><li>${ic('check')}${t('fmt_one_2')}</li><li>${ic('check')}${t('fmt_one_3')}</li></ul></div>
      <div class="fmt-c fmt-hi"><span class="fmt-n">${num('1 : 7')}</span><h3>${t('group_fmt')}</h3><p>${t('fmt_grp_d')}</p><ul><li>${ic('check')}${t('fmt_grp_1')}</li><li>${ic('check')}${t('fmt_grp_2')}</li><li>${ic('check')}${t('fmt_grp_3')}</li></ul></div>
    </div>`)}

    ${sec('', sechead(t('stats_t')), `<div class="stats">
      <div><b>${num(COURSES.length)}</b><span>${t('st_courses')}</span></div>
      <div><b>${num(TEACHERS.length)}</b><span>${t('st_teachers')}</span></div>
      <div><b>${num(stu)}+</b><span>${t('st_students')}</span></div>
      <div><b>${num(avg)}</b><span>${t('st_rating')}</span></div></div>`)}

    ${sec('sec-soft', sechead(t('rev_t'), t('rev_d')), scroller(REVIEWS.map(r => `<div class="scr-i scr-r">${reviewCard(r)}</div>`).join(''), 'reviews'))}

    ${sec('', sechead(t('blog_t'), t('blog_home_d'), `<a class="btn btn-o" href="#blog">${t('all_posts')}${ic('arrow')}</a>`), `<div class="grid grid-b">${BLOG.slice(0, 3).map(blogCard).join('')}</div>`)}

    ${sec('', '', `<div class="cta"><div><h2>${t('cta_t')}</h2><p>${t('cta_d')}</p></div><div class="cta-b"><a class="btn btn-w" href="#signup">${t('signup')}</a><a class="btn btn-ow" href="#become-teacher">${t('nav_become')}</a></div></div>`)}`;
  }

  function reviewCard(r) {
    const c = byId(COURSES, r.course);
    return `<figure class="rv"><div class="rv-s">${Array.from({ length: 5 }, (_, i) => `<span class="${i < r.rating ? 'on' : ''}">${star}</span>`).join('')}</div>
      <blockquote>${esc(L(r.text))}</blockquote>
      <figcaption class="rv-by"><span class="av av-img" style="--s:46px" aria-hidden="true">${cartoon(RLOOK[Math.max(0, REVIEWS.indexOf(r)) % RLOOK.length])}</span><div><b>${esc(L(r.name))}</b><small>${esc(L(r.from))}</small>${c ? `<a href="#course-${c.id}">${esc(L(c.title))}</a>` : ''}</div></figcaption></figure>`;
  }

  function viewCourses() {
    return pagehead(t('nav_courses'), t('courses_d'), `<span>/</span><span>${t('nav_courses')}</span>`) +
      sec('sec-filter', '', `${filterBar()}<div class="grid grid-c" id="results"></div>`);
  }

  /* ---------- course detail ---------- */
  let CO = null;
  function planOptions(c, fmt) {
    if (c.plans && c.plans[fmt]) return c.plans[fmt];
    const p = pricingFor(c)[fmt];
    return [{ key: 'full', m: 0, actual: p.fullA, disc: p.fullD }, { key: 'month', m: 1, actual: p.perA, disc: p.perD }];
  }
  const cyc = (c, o) => (o.m === 0 ? 1 : Math.max(1, Math.ceil(c.months / o.m)));
  const planLabel = o => (o.m === 0 ? t('plan_full') : (lang === 'bn' ? 'প্রতি ' + num(o.m) + ' মাস পর পর' : 'Every ' + o.m + (o.m === 1 ? ' month' : ' months')));
  const firstOf = o => (o.m === 0 ? o.disc : (o.first != null ? o.first : o.disc));
  function planSub(c, o) {
    if (o.m === 0) return `<s>${money(o.actual)}</s>`;
    const cy = cyc(c, o);
    if (o.first != null && cy > 1) return (lang === 'bn' ? `প্রথমবার ${money(o.first)}, পরে ${money(o.disc)}` : `First ${money(o.first)}, then ${money(o.disc)}`) + ` · ${num(cy)}×`;
    return `<s>${money(o.actual)}</s> · ${num(cy)}×`;
  }
  const couponFor = (c, code) => { const cp = COUPONS[code]; return cp && cp.active !== false && (!cp.scope || cp.scope === c.id || cp.scope === 't:' + c.teacher || cp.scope === c.id.split('-')[0]) ? cp : null; };
  function calc(c, st) {
    const opts = planOptions(c, st.fmt), o = opts.find(x => x.key === st.plan) || opts[0];
    const tt = planTotal(c, o), cp = couponFor(c, st.code);
    const cut = cp ? (cp.type === 'pct' ? Math.round(tt.d * cp.v / 100) : Math.min(cp.v, tt.d)) : 0;
    const f = firstOf(o);
    return { opt: o, cy: cyc(c, o), actual: tt.a, disc: tt.d, cut, total: tt.d - cut, one: o.m === 0, now: Math.max(0, f - Math.round(cut * f / Math.max(1, tt.d))) };
  }

  function checkoutCard(c) {
    const st = CO, pr = pricingFor(c), k = calc(c, st);
    const fmtOpt = f => `<label class="opt ${st.fmt === f ? 'on' : ''}"><input type="radio" name="fmt" value="${f}" data-co="fmt" ${st.fmt === f ? 'checked' : ''}>
      <span><b>${esc(ctName(f))}</b><small>${fmtDesc(f)}</small></span>
      <em>${money(pr[f].fullD)}</em></label>`;
    const planOpt = o => `<label class="opt ${k.opt.key === o.key ? 'on' : ''}"><input type="radio" name="plan" value="${o.key}" data-co="plan" ${k.opt.key === o.key ? 'checked' : ''}>
      <span><b>${planLabel(o)}</b><small>${planSub(c, o)}</small></span><em>${money(firstOf(o))}${o.m ? '<i> ' + t('sum_first') + '</i>' : ''}</em></label>`;
    const cp = couponFor(c, st.code);
    return `<div class="co-h"><h3>${t('co_title')}</h3></div>
      <div class="co-fmt">${fmtTag(c)}<small>${fmtDesc(st.fmt)} · ${money(pr[st.fmt].fullD)}</small></div>
      ${st.fmt === 'one' ? `<div class="coupon"><label for="pref">${t('pref_time')}</label><input id="pref" data-co="pref" type="text" value="${esc(st.pref || '')}" placeholder="${t('pref_ph')}" autocomplete="off"><small class="hint">${t('pref_hint')}</small></div>` : `<p class="co-note">${ic('users')}${grpNote(st.fmt)}</p>`}
      <fieldset class="co-g"><legend>${t('co_plan')}</legend>${planOptions(c, st.fmt).map(planOpt).join('')}</fieldset>
      <div class="coupon"><label for="cpn">${t('co_coupon')}</label>
        <div class="cp-row"><input id="cpn" type="text" value="${esc(st.input || '')}" placeholder="CHAATRO10" autocomplete="off" autocapitalize="characters"><button class="btn btn-o" data-act="apply">${t('apply')}</button></div>
        <small class="${cp ? 'okm' : st.err ? 'err' : 'hint'}" role="status">${cp ? '✓ ' + esc(L(cp)) : st.err ? t('cp_bad') : t('cp_hint')}</small></div>
      <dl class="sum">
        <div><dt>${t('sum_price')}</dt><dd>${money(k.disc)}</dd></div>
        ${k.cut ? `<div class="ok"><dt>${t('sum_cp')}</dt><dd>− ${money(k.cut)}</dd></div>` : ''}
        <div class="tot"><dt>${t('sum_total')}</dt><dd>${money(k.total)}</dd></div>
        <div class="now"><dt>${k.one ? t('sum_now') : t('sum_first')}</dt><dd>${money(k.now)}</dd></div>
      </dl>
      <button class="btn btn-p btn-block btn-lg" data-act="enroll">${t(st.fmt === 'one' ? 'enroll_one' : 'enroll_grp')}${ic('arrow')}</button>
      <p class="co-note">${ic('video')}${t('co_note')}</p>`;
  }

  function viewCourse(id) {
    const c = byId(COURSES, id); if (!c || !progOn(c.program)) return view404();
    const tc = byId(TEACHERS, c.teacher), prog = byId(PROGRAMS, c.program), sub = byId(SUBJECTS, c.subject);
    if (!CO || CO.id !== c.id) CO = { id: c.id, fmt: c.formats[0], plan: 'x', code: '', input: '', err: false };
    const topics = TOPICS[c.kind === 'crash' ? 'crash' : c.subject] || TOPICS.combined;
    const revs = REVIEWS.filter(r => r.course === c.id);
    const k = calc(c, CO);
    const sameT = liveCourses().filter(x => x.id !== c.id && (x.program === c.program || x.teacher === c.teacher)).slice(0, 3);
    const outcomes = c.kind === 'crash' ? ['out_c1', 'out_c2', 'out_c3', 'out_c4'] : ['out_r1', 'out_r2', 'out_r3', 'out_r4'];
    return `
    <div class="phead phead-c" style="--cc:${progColor(c.program)}"><div class="wrap">
      <nav class="crumbs"><a href="#home">${t('nav_home')}</a><span>/</span><a href="#courses">${t('nav_courses')}</a><span>/</span><span>${esc(L(prog.s))}</span></nav>
      <div class="tags tags-w">${fmtTag(c)}${kindTag(c)}<span class="tag">${esc(L(prog))}</span><span class="tag">${esc(L(sub))}</span><span class="tag">ID ${c.pid}</span></div>
      <h1>${esc(L(c.title))}</h1><p>${esc(L(c.short))}</p>
      <ul class="meta meta-w"><li>${rate(c.rating)}<span>(${num(c.reviews)} ${t('reviews')})</span></li><li>${ic('users')}${num(c.enrolled)} ${t('enrolled')}</li><li>${ic('calendar')}${num(c.cpw)} ${t('cls_week')}</li><li>${ic('clock')}${num(c.weeks)} ${t('weeks')}</li></ul>
    </div></div>
    <div class="wrap cd">
      <div class="cd-main">
        ${(c.video && ytId(c.video)) || c.thumb ? `<section class="blk">${player(c.video, c.thumb, L(c.title))}</section>` : `<section class="blk"><div class="video"><span class="vplay">${ic('play')}</span><div><b>${t('intro_video')}</b><small>${t('video_note')}</small></div></div></section>`}

        <section class="blk"><h2>${t('about_course')}</h2>
          <p>${esc(L(c.short))} ${t(c.kind === 'crash' ? 'crash_about' : 'reg_about')}</p>
          <ul class="outs">${outcomes.map(o => `<li>${ic('check')}${t(o)}</li>`).join('')}</ul></section>

        <section class="blk"><h2>${t('content')}</h2>
          <div class="acc">${topics.map((x, i) => `<details ${i === 0 ? 'open' : ''}><summary><span class="an">${num(i + 1)}</span>${esc(L(x.t))}</summary><p>${esc(L(x.p))}</p></details>`).join('')}</div></section>

        <section class="blk"><h2>${t('batch_sched')}</h2>
          <div class="info">
            <div>${ic('calendar')}<span><small>${t('starts')}</small><b>${fdate(c.start)}</b></span></div>
            <div>${ic('clock')}<span><small>${t('class_days')}</small><b>${esc(schedule(c))}</b></span></div>
            ${c.kind === 'crash' ? `<div>${ic('award')}<span><small>${t('model_tests')}</small><b>${t('mt_val')}</b></span></div>` : `<div>${ic('book')}<span><small>${t('duration')}</small><b>${num(c.weeks)} ${t('weeks')}</b></span></div>`}
            ${!c.formats.includes('one') ? `<div>${ic('users')}<span><small>${t('seats_left')}</small><b>${num(c.seats)} / ${num(ctSeats(c.formats[0]))}</b></span></div>` : `<div>${ic('users')}<span><small>${t('co_fmt')}</small><b>${t('priv_val')}</b></span></div>`}
          </div>
          <p class="mute sm">${t('sched_note')}</p></section>

        <section class="blk"><h2>${t('your_teacher')}</h2>
          <a class="thl" href="#teacher-${tc.id}">${avatar(tc, 72)}<span><b>${esc(L(tc.n))}</b><small>${esc(L(tc.inst))} · ${esc(L(tc.dept))}</small>
          <span class="meta"><span>${rate(tc.rating)}</span><span>${ic('users')}${num(tc.stu)} ${t('students')}</span><span>${ic('clock')}${num(tc.exp)} ${t('yrs_exp')}</span></span></span></a>
          <p>${esc(L(tc.bio))}</p><div class="vbadges">${verBadges(tc)}</div>
          <a class="btn btn-o" href="#teacher-${tc.id}">${t('view_profile')}${ic('arrow')}</a></section>

        <section class="blk"><h2>${t('reviews')}</h2>
          ${revs.length ? `<div class="grid grid-r2">${revs.map(reviewCard).join('')}</div>` : `<p class="mute">${t('no_reviews')}</p>`}</section>

        <section class="blk pol"><h2>${t('policies')}</h2>
          <div class="pol-g"><a href="#policy-refund">${t('p_refund')}${ic('arrow')}</a><a href="#policy-payment">${t('p_payment')}${ic('arrow')}</a><a href="#policy-terms">${t('p_terms')}${ic('arrow')}</a></div></section>

        ${sameT.length ? `<section class="blk"><h2>${t('related')}</h2><div class="grid grid-c2">${sameT.map(courseCard).join('')}</div></section>` : ''}
      </div>
      <aside class="cd-side"><div class="checkout" id="checkout">${checkoutCard(c)}</div></aside>
    </div>
    <div class="mbar"><div><small>${planLabel(k.opt)}</small><b id="mbar-p">${money(k.now)}</b></div><button class="btn btn-p" data-act="scroll-co">${t(c.formats[0] === 'one' ? 'enroll_one' : 'enroll_grp')}</button></div>`;
  }

  function refreshCheckout() {
    const c = byId(COURSES, CO.id); const box = $('#checkout'); if (!box) return;
    box.innerHTML = checkoutCard(c);
    const mb = $('#mbar-p'); if (mb) mb.textContent = money(calc(c, CO).now);
  }

  function openModal(html, cls = '') {
    closeModal();
    const m = document.createElement('div'); m.className = 'modal'; m.id = 'modal';
    m.innerHTML = `<div class="m-bg" data-act="close"></div><div class="m-box ${cls}" role="dialog" aria-modal="true" tabindex="-1">${html}</div>`;
    document.body.appendChild(m); document.body.classList.add('noscroll');
    const box = $('.m-box', m); box.focus();
  }
  function closeModal() { const m = $('#modal'); if (m) m.remove(); document.body.classList.remove('noscroll'); }

  function enrollModal() {
    const c = byId(COURSES, CO.id), k = calc(c, CO);
    const chans = [['bkash', t('ch_bkash')], ['ssl', t('ch_ssl')], ['cash', t('ch_cash')]];
    openModal(`<button class="m-x" data-act="close" aria-label="${t('close')}">${ic('close')}</button>
      <h3>${t('enroll_t')}</h3>
      <p class="mute sm">${esc(L(c.title))} · ${esc(ctName(CO.fmt))} · ${planLabel(k.opt)}</p>
      <form data-form="enroll" novalidate>
        ${fld({ name: 'en_name', label: t('f_name'), req: true, auto: 'name' })}
        ${fld({ name: 'en_phone', label: t('f_phone'), req: true, type: 'tel', ph: '01XXXXXXXXX', auto: 'tel' })}
        ${fld({ name: 'en_ref', label: t('f_ref'), ph: 'CHAATRO-XXXX' })}
        <fieldset class="co-g"><legend>${t('pay_channel')}</legend>${chans.map((x, i) => `<label class="opt ${i === 0 ? 'on' : ''}"><input type="radio" name="chan" value="${x[0]}" ${i === 0 ? 'checked' : ''}><span><b>${x[1]}</b></span></label>`).join('')}</fieldset>
        <dl class="sum"><div class="tot"><dt>${t('sum_total')}</dt><dd>${money(k.total)}</dd></div><div class="now"><dt>${k.one ? t('sum_now') : t('sum_first')}</dt><dd>${money(k.now)}</dd></div></dl>
        <button class="btn btn-p btn-block btn-lg" type="submit">${t('confirm_pay')}</button>
        <p class="co-note">${t('demo_pay')}</p>
      </form>`, 'm-sm');
  }

  /* ---------- teachers ---------- */
  function teachersFiltered() {
    const q = TF.q.toLowerCase().trim();
    return TEACHERS.filter(x => (TF.inst === 'all' || x.ik === TF.inst) && (TF.subject === 'all' || x.subs.includes(TF.subject)) &&
      (!q || [x.n.bn, x.n.en, x.inst.bn, x.inst.en, x.dept.bn, x.dept.en].join(' ').toLowerCase().includes(q)));
  }
  function teachersGrid() {
    const l = teachersFiltered(); const box = $('#tresults'); if (!box) return;
    $('#tcount').textContent = num(l.length) + ' ' + t('teachers_found');
    box.innerHTML = l.length ? l.map(teacherCard).join('') : `<div class="empty"><h3>${t('empty_t')}</h3><p>${t('empty_d')}</p></div>`;
  }
  function viewTeachers() {
    return pagehead(t('nav_teachers'), t('teachers_d'), `<span>/</span><span>${t('nav_teachers')}</span>`) +
      sec('sec-filter', '', `<div class="fb"><div class="fb-top"><label class="srch" for="t-q">${ic('search')}<input id="t-q" data-tf="q" type="search" value="${esc(TF.q)}" placeholder="${t('t_ph')}" autocomplete="off"></label></div>
      <div class="fb-row">
        ${sel('t-inst', t('t_inst'), [['all', t('all')]].concat(INSTITUTIONS.map(i => [i.id, L(i)])), TF.inst).replace('data-f="t-inst"', 'data-tf="inst"')}
        ${sel('t-subj', t('f_subject'), [['all', t('all')]].concat(SUBJECTS.map(s => [s.id, L(s)])), TF.subject).replace('data-f="t-subj"', 'data-tf="subject"')}
      </div></div><div class="rhead" aria-live="polite"><b id="tcount"></b></div><div class="grid grid-t" id="tresults"></div>`);
  }

  function viewTeacher(id) {
    const tc = byId(TEACHERS, id); if (!tc) return view404();
    const cs = liveCourses().filter(c => c.teacher === tc.id);
    const revs = REVIEWS.filter(r => cs.some(c => c.id === r.course));
    return `
    <div class="phead phead-t"><div class="wrap tp-h">
      <div class="tp-av">${avatar(tc, 132)}</div>
      <div><nav class="crumbs"><a href="#home">${t('nav_home')}</a><span>/</span><a href="#teachers">${t('nav_teachers')}</a></nav>
        <h1>${esc(L(tc.n))}</h1>
        <p class="tp-inst">${esc(L(tc.inst))} · ${esc(L(tc.dept))} · ${esc(L(tc.yr))}</p>
        ${tc.feat ? `<span class="featinst">${ic('check')}${t('featured_inst')}: <b>${esc(L(tc.feat))}</b></span>` : ''}
        <ul class="meta meta-w"><li>${rate(tc.rating)}</li><li>${ic('users')}${num(tc.stu)} ${t('students')}</li><li>${ic('clock')}${num(tc.exp)} ${t('yrs_exp')}</li><li>${ic('book')}${num(cs.length)} ${t('courses_n')}</li></ul>
        <div class="vbadges vb-w">${verBadges(tc)}</div></div>
    </div></div>
    <div class="wrap tp">
      <div class="tp-main">
        ${tc.video && ytId(tc.video) ? `<section class="blk"><h2>${t('intro2')}</h2>${player(tc.video, '', L(tc.n))}</section>` : `<section class="blk"><div class="video"><span class="vplay">${ic('play')}</span><div><b>${t('intro2')}</b><small>${t('video_note_t')}</small></div></div></section>`}
        <section class="blk"><h2>${t('about_teacher')}</h2><p>${esc(L(tc.bio))}</p>
          <div class="tags">${tc.subs.map(s => `<span class="tag">${esc(L(byId(SUBJECTS, s)))}</span>`).join('')}</div></section>
        <section class="blk"><h2>${t('education')}</h2><ol class="tl">
          <li><b>${esc(L(tc.inst))}</b><span>${esc(L(tc.dept))} · ${esc(L(tc.yr))}</span><em>${t('uni')}</em></li>
          <li><b>${t('hsc')}</b><span>${esc(L(tc.hsc))}</span></li>
          <li><b>${t('ssc')}</b><span>${esc(L(tc.ssc))}</span></li></ol></section>
        <section class="blk"><h2>${t('certs')}</h2><ul class="outs">${tc.certs.map(x => `<li>${ic('award')}${esc(L(x))}</li>`).join('')}</ul></section>
        <section class="blk"><h2>${t('cocur')}</h2><ul class="outs">${tc.co.map(x => `<li>${ic('check')}${esc(L(x))}</li>`).join('')}</ul></section>
        <section class="blk"><h2>${t('batches')}</h2><div class="bt">${cs.map(c => `<a href="#course-${c.id}"><span><b>${esc(L(c.title))}</b><small>${esc(schedule(c))}</small></span><span class="bt-r"><small>${t('upcoming')}</small><b>${fdate(c.start)}</b></span></a>`).join('')}</div></section>
        <section class="blk"><h2>${t('t_courses')}</h2><div class="grid grid-c2">${cs.map(courseCard).join('')}</div></section>
        ${revs.length ? `<section class="blk"><h2>${t('reviews')}</h2><div class="grid grid-r2">${revs.map(reviewCard).join('')}</div></section>` : ''}
      </div>
      <aside class="tp-side"><div class="checkout"><h3>${t('start_learning')}</h3><p class="mute sm">${t('start_learning_d')}</p>
        <a class="btn btn-p btn-block" href="#course-${cs[0].id}">${t('see_course')}${ic('arrow')}</a>
        <ul class="facts"><li><small>${t('feat_pending')}</small></li></ul></div></aside>
    </div>`;
  }

  /* ---------- forms ---------- */
  function fld(o) {
    return `<div class="fld ${o.half ? 'half' : ''}"><label for="${o.name}">${o.label}${o.req ? '<b class="rq" aria-hidden="true"> *</b>' : ''}</label>
      <input id="${o.name}" name="${o.name}" type="${o.type || 'text'}" ${o.req ? 'required aria-required="true"' : ''} placeholder="${esc(o.ph || '')}" autocomplete="${o.auto || 'off'}" aria-describedby="e-${o.name}">
      <small class="err" id="e-${o.name}" role="alert"></small>${o.hint ? `<small class="hint">${o.hint}</small>` : ''}</div>`;
  }
  function areaFld(o) {
    return `<div class="fld"><label for="${o.name}">${o.label}${o.req ? '<b class="rq" aria-hidden="true"> *</b>' : ''}</label>
      <textarea id="${o.name}" name="${o.name}" rows="${o.rows || 4}" ${o.req ? 'required' : ''} placeholder="${esc(o.ph || '')}" aria-describedby="e-${o.name}"></textarea>
      <small class="err" id="e-${o.name}" role="alert"></small>${o.hint ? `<small class="hint">${o.hint}</small>` : ''}</div>`;
  }
  function selFld(o) {
    return `<div class="fld ${o.half ? 'half' : ''}"><label for="${o.name}">${o.label}${o.req ? '<b class="rq" aria-hidden="true"> *</b>' : ''}</label>
      <select id="${o.name}" name="${o.name}" ${o.req ? 'required' : ''} aria-describedby="e-${o.name}">${o.opts.map(x => `<option value="${x[0]}">${esc(x[1])}</option>`).join('')}</select><small class="err" id="e-${o.name}" role="alert"></small></div>`;
  }
  function checks(name, items, label, req) {
    return `<fieldset class="fld cks" id="${name}"><legend>${label}${req ? '<b class="rq" aria-hidden="true"> *</b>' : ''}</legend><div class="ck-g">${items.map(x => `<label class="ck"><input type="checkbox" name="${name}" value="${x[0]}"><span>${esc(x[1])}</span></label>`).join('')}</div><small class="err" id="e-${name}" role="alert"></small></fieldset>`;
  }

  /* uploads */
  const UP = { cv: [], idDoc: [], certs: [], photo: [] };
  const UCFG = {
    cv: { accept: '.pdf,.doc,.docx', ext: /\.(pdf|docx?)$/i, max: 5, multiple: false },
    idDoc: { accept: '.pdf,.jpg,.jpeg,.png', ext: /\.(pdf|jpe?g|png)$/i, max: 5, multiple: false },
    certs: { accept: '.pdf,.jpg,.jpeg,.png', ext: /\.(pdf|jpe?g|png)$/i, max: 5, multiple: true },
    photo: { accept: '.jpg,.jpeg,.png', ext: /\.(jpe?g|png)$/i, max: 3, multiple: false },
  };
  const fsize = b => b > 1048576 ? num((b / 1048576).toFixed(1)) + ' MB' : num(Math.max(1, Math.round(b / 1024))) + ' KB';
  function fileList(k) {
    return UP[k].map((f, i) => `<li>${ic('file')}<span><b>${esc(f.name)}</b><small>${fsize(f.size)}</small></span><button type="button" data-act="rmfile" data-k="${k}" data-i="${i}" aria-label="${t('remove')}">${ic('trash')}</button></li>`).join('');
  }
  function dz(k, label, hint, req) {
    const c = UCFG[k];
    return `<div class="fld"><span class="lbl" id="l-${k}">${label}${req ? '<b class="rq" aria-hidden="true"> *</b>' : ''}</span>
      <div class="dz" data-dz="${k}"><input class="sr" type="file" id="u-${k}" data-up="${k}" accept="${c.accept}" ${c.multiple ? 'multiple' : ''} aria-labelledby="l-${k}">
        <label for="u-${k}" class="dz-box">${ic('upload')}<span><b>${t('dz_pick')}</b><small>${hint}</small></span></label>
        <ul class="fl" id="fl-${k}">${fileList(k)}</ul></div><small class="err" id="e-${k}" role="alert"></small></div>`;
  }
  function addFiles(k, files) {
    const c = UCFG[k], err = $('#e-' + k); let msg = '';
    Array.from(files).forEach(f => {
      if (!c.ext.test(f.name)) msg = t('err_type') + ' (' + c.accept.replace(/\./g, '').replace(/,/g, ', ').toUpperCase() + ')';
      else if (f.size > c.max * 1048576) msg = t('err_size') + ' ' + num(c.max) + ' MB';
      else { if (!c.multiple) UP[k] = []; if (UP[k].length < 6) UP[k].push({ name: f.name, size: f.size }); }
    });
    if (err) err.textContent = msg;
    const ul = $('#fl-' + k); if (ul) ul.innerHTML = fileList(k);
  }

  const SUBJ_OPTS = () => SUBJECTS.map(s => [s.id, L(s)]);
  const PROG_OPTS = () => PROGRAMS.filter(p => !p.hidden).map(p => [p.id, L(p.s)]);
  const DIST = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ', 'কুমিল্লা', 'অন্য জেলা'];
  const DIST_EN = ['Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh', 'Cumilla', 'Other district'];

  function viewBecome() {
    return `
    <div class="phead phead-bt"><div class="wrap bt-hero">
      <div><nav class="crumbs"><a href="#home">${t('nav_home')}</a><span>/</span><span>${t('nav_become')}</span></nav>
        <h1>${t('bt_t')}</h1><p>${t('bt_d')}</p>
        <button class="btn btn-w btn-lg" data-act="scroll-form">${t('bt_cta')}${ic('arrow')}</button></div>
      <ul class="bt-points"><li>${ic('users')}<span><b>${t('bt_p1t')}</b>${t('bt_p1d')}</span></li><li>${ic('calendar')}<span><b>${t('bt_p2t')}</b>${t('bt_p2d')}</span></li><li>${ic('shield')}<span><b>${t('bt_p3t')}</b>${t('bt_p3d')}</span></li></ul>
    </div></div>

    ${sec('', sechead(t('bt_steps_t'), t('bt_steps_d')), `<ol class="steps">${[1, 2, 3, 4, 5].map(i => `<li><span class="sn">${num(i)}</span><b>${t('bt_s' + i + 't')}</b><p>${t('bt_s' + i + 'd')}</p></li>`).join('')}</ol>`)}

    ${sec('sec-soft', '', `<div class="bt-wrap" id="apply">
      <div class="bt-side"><h2>${t('bt_form_t')}</h2><p>${t('bt_form_d')}</p>
        <h4>${t('bt_need')}</h4><ul class="outs"><li>${ic('file')}${t('bt_n1')}</li><li>${ic('file')}${t('bt_n2')}</li><li>${ic('file')}${t('bt_n3')}</li><li>${ic('file')}${t('bt_n4')}</li><li>${ic('phone')}${t('bt_n5')}</li></ul>
        <p class="mute sm">${t('bt_note')}</p></div>
      <div class="bt-form" id="bt-form-wrap"><form data-form="teacher" novalidate>
        <h3 class="fs-t">${t('fs_personal')}</h3>
        <div class="row">${fld({ name: 'fullName', label: t('f_name'), req: true, half: true, auto: 'name' })}${fld({ name: 'phone', label: t('f_phone'), req: true, half: true, type: 'tel', ph: '01XXXXXXXXX', auto: 'tel' })}</div>
        <div class="row">${fld({ name: 'email', label: t('f_email'), req: true, half: true, type: 'email', auto: 'email' })}${selFld({ name: 'district', label: t('f_district'), req: true, half: true, opts: [['', t('choose')]].concat(DIST.map((d, i) => [d, lang === 'bn' ? d : DIST_EN[i]])) })}</div>

        <h3 class="fs-t">${t('fs_edu')}</h3>
        <div class="row">${selFld({ name: 'institution', label: t('f_inst'), req: true, half: true, opts: [['', t('choose')]].concat(INSTITUTIONS.map(i => [i.id, L(i)])).concat([['other', t('other')]]) })}${fld({ name: 'dept', label: t('f_dept'), req: true, half: true })}</div>
        <div class="row">${selFld({ name: 'status', label: t('f_status'), req: true, half: true, opts: [['', t('choose')], ['student', t('st_student')], ['faculty', t('st_faculty')], ['grad', t('st_grad')]] })}${fld({ name: 'year', label: t('f_year'), half: true, ph: t('f_year_ph') })}</div>

        <h3 class="fs-t">${t('fs_teach')}</h3>
        ${checks('subjects', SUBJ_OPTS(), t('f_subjects'), true)}
        ${checks('programs', PROG_OPTS(), t('f_programs'), false)}
        ${checks('formats', CTYPES.filter(x => x.on).map(x => [x.id, L(x)]), t('f_formats'), false)}
        <div class="row">${selFld({ name: 'exp', label: t('f_exp'), half: true, opts: [['', t('choose')], ['0', t('exp0')], ['1', t('exp1')], ['3', t('exp3')]] })}${fld({ name: 'video', label: t('f_video'), half: true, type: 'url', ph: 'https://youtube.com/…', hint: t('f_video_h') })}</div>
        ${areaFld({ name: 'bio', label: t('f_bio'), req: true, ph: t('f_bio_ph'), rows: 4 })}

        <h3 class="fs-t">${t('fs_docs')}</h3>
        ${dz('cv', t('u_cv'), t('u_cv_h'), true)}
        ${dz('idDoc', t('u_id'), t('u_id_h'), true)}
        ${dz('certs', t('u_cert'), t('u_cert_h'), false)}
        ${dz('photo', t('u_photo'), t('u_photo_h'), true)}
        ${fld({ name: 'payAcc', label: t('f_pay'), ph: '01XXXXXXXXX', hint: t('f_pay_h'), type: 'tel' })}

        <h3 class="fs-t">${t('fs_ref')}</h3>
        ${fld({ name: 'referral', label: t('f_ref'), ph: 'CHAATRO-XXXX', hint: t('f_ref_h') })}

        <label class="ck agree"><input type="checkbox" name="agree" id="agree"><span>${t('agree')} <a href="#policy-terms">${t('p_terms')}</a></span></label>
        <small class="err" id="e-agree" role="alert"></small>
        <button class="btn btn-p btn-lg btn-block" type="submit">${t('submit_app')}${ic('arrow')}</button>
        <p class="mute sm center">${t('demo_form')}</p>
      </form></div></div>`)}`;
  }

  function teacherSubmit(form) {
    const v = n => (form.elements[n] ? form.elements[n].value.trim() : '');
    const errs = {};
    if (v('fullName').length < 3) errs.fullName = t('e_req');
    if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(v('phone').replace(/[\s-]/g, ''))) errs.phone = t('e_phone');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) errs.email = t('e_email');
    ['district', 'institution', 'dept', 'status'].forEach(n => { if (!v(n)) errs[n] = t('e_req'); });
    if (!$$('input[name=subjects]:checked', form).length) errs.subjects = t('e_subj');
    if (v('bio').length < 30) errs.bio = t('e_bio');
    if (v('video') && !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(v('video'))) errs.video = t('e_video');
    if (!UP.cv.length) errs.cv = t('e_file');
    if (!UP.idDoc.length) errs.idDoc = t('e_file');
    if (!UP.photo.length) errs.photo = t('e_file');
    if (v('payAcc') && !/^(?:\+?88)?01[3-9]\d{8}$/.test(v('payAcc').replace(/[\s-]/g, ''))) errs.payAcc = t('e_phone');
    if (!form.elements.agree.checked) errs.agree = t('e_agree');
    showErrors(form, errs);
    if (Object.keys(errs).length) return;
    const id = 'CHT-T-' + String(10000 + Math.floor(Math.random() * 89999));
    const subs = $$('input[name=subjects]:checked', form).map(x => L(byId(SUBJECTS, x.value))).join(', ');
    $('#bt-form-wrap').innerHTML = `<div class="done"><span class="done-i">${ic('check')}</span><h3>${t('done_t')}</h3><p>${t('done_d')}</p>
      <dl class="sum"><div><dt>${t('app_id')}</dt><dd>${id}</dd></div><div><dt>${t('f_name')}</dt><dd>${esc(v('fullName'))}</dd></div><div><dt>${t('f_subjects')}</dt><dd>${esc(subs)}</dd></div>
      <div><dt>${t('docs_n')}</dt><dd>${num(UP.cv.length + UP.idDoc.length + UP.certs.length + UP.photo.length)}</dd></div><div class="now"><dt>${t('status')}</dt><dd>${t('pending_v')}</dd></div></dl>
      <ol class="steps steps-s"><li><span class="sn">${num(1)}</span><b>${t('bt_s2t')}</b></li><li><span class="sn">${num(2)}</span><b>${t('bt_s3t')}</b></li><li><span class="sn">${num(3)}</span><b>${t('bt_s4t')}</b></li></ol>
      <a class="btn btn-o" href="#home">${t('back_home')}</a></div>`;
    UP.cv = []; UP.idDoc = []; UP.certs = []; UP.photo = [];
    $('#apply').scrollIntoView({ block: 'start' });
  }

  function showErrors(form, errs) {
    $$('.err', form).forEach(e => { if (!e.id.match(/^e-(cv|idDoc|certs|photo)$/) || errs[e.id.slice(2)]) e.textContent = errs[e.id.slice(2)] || ''; });
    $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));
    Object.keys(errs).forEach(n => { const el = form.elements[n] || document.getElementById(n); if (el && el.setAttribute && el.tagName !== 'FIELDSET') el.setAttribute('aria-invalid', 'true'); });
    const first = Object.keys(errs)[0];
    if (first) { const el = document.getElementById(first) || document.getElementById('u-' + first) || form.elements[first]; if (el) { el.scrollIntoView({ block: 'center' }); if (el.focus && el.tagName !== 'FIELDSET') el.focus({ preventScroll: true }); } }
  }

  /* ---------- blog ---------- */
  /* ব্লগ থাম্বনেইল */
  const BART = {
    b1: () => ['#7A3FF0', '#C7A8FF', `<rect x="70" y="34" width="190" height="130" rx="14" fill="#fff"/><rect x="70" y="34" width="190" height="28" rx="14" fill="#E03131"/><rect x="70" y="48" width="190" height="14" fill="#E03131"/><g font-family="sans-serif" font-weight="800" font-size="13" text-anchor="middle">${[['বা', '#FF8A5B'], ['En', '#2F5BE0'], ['∑', '#8C52FF'], ['GK', '#22B8A0']].map((x, i) => `<rect x="${82 + (i % 2) * 88}" y="${72 + Math.floor(i / 2) * 42}" width="80" height="34" rx="8" fill="${x[1]}"/><text x="${122 + (i % 2) * 88}" y="${94 + Math.floor(i / 2) * 42}" fill="#fff">${x[0]}</text>`).join('')}</g><circle cx="108" cy="34" r="5" fill="#fff"/><circle cx="222" cy="34" r="5" fill="#fff"/><g transform="translate(300 96)"><circle r="40" fill="#fff"/><circle r="34" fill="#FFF6D8" stroke="#FFC53D" stroke-width="5"/><path d="M0 -22 V0 L16 10" stroke="#17102B" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-26" cy="-38" r="10" fill="#FFC53D"/><circle cx="26" cy="-38" r="10" fill="#FFC53D"/></g><g transform="translate(40 150) rotate(-35)"><rect width="90" height="12" rx="3" fill="#FFC53D"/><path d="M90 0 l16 6 l-16 6z" fill="#F2D9B8"/><rect x="-10" width="10" height="12" rx="3" fill="#E03131"/></g>`],
    b2: () => ['#2F5BE0', '#A9C4FF', `<rect x="72" y="26" width="150" height="150" rx="10" fill="#fff"/><path d="M88 54 h118 M88 74 h118 M88 94 h90 M88 114 h118 M88 134 h70" stroke="#D3DEFB" stroke-width="5" stroke-linecap="round"/><g fill="none" stroke="#22B8A0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M92 50 l6 6 l10 -12"/><path d="M92 90 l6 6 l10 -12"/></g><path d="M94 112 l12 12 M106 112 l-12 12" stroke="#E03131" stroke-width="5" stroke-linecap="round"/><circle cx="196" cy="132" r="22" fill="#FFC53D"/><text x="196" y="140" font-size="22" font-weight="800" fill="#17102B" text-anchor="middle" font-family="sans-serif">A+</text><g transform="translate(300 100)"><rect x="-8" y="-62" width="16" height="12" rx="3" fill="#17102B"/><circle r="44" fill="#fff"/><circle r="36" fill="#EAF0FF" stroke="#2F5BE0" stroke-width="5"/><path d="M0 -26 V0 L18 12" stroke="#E03131" stroke-width="4" fill="none" stroke-linecap="round"/><g stroke="#2F5BE0" stroke-width="3">${[0, 90, 180, 270].map(a => `<path d="M0 -36 V-30" transform="rotate(${a})"/>`).join('')}</g></g>`],
    b3: () => ['#6B34E0', '#E0CCFF', `<rect x="24" y="30" width="160" height="140" rx="16" fill="#fff"/><rect x="216" y="30" width="160" height="140" rx="16" fill="#fff"/>${avs(LOOK.t02, 44, 44, 58)}${avs(RLOOK[3], 102, 90, 58)}<path d="M80 86 l30 20" stroke="#8C52FF" stroke-width="3" stroke-dasharray="4 4"/><text x="104" y="158" font-size="16" font-weight="800" fill="#6B34E0" text-anchor="middle" font-family="sans-serif">${num('1 : 1')}</text>${avs(LOOK.t01, 270, 40, 54)}${[0, 1, 2, 3, 4, 5].map(i => avs(RLOOK[i + 1], 228 + (i % 3) * 46, 94 + Math.floor(i / 3) * 30, 34)).join('')}<text x="296" y="168" font-size="16" font-weight="800" fill="#6B34E0" text-anchor="middle" font-family="sans-serif">${num('1 : 7')}</text><circle cx="200" cy="100" r="18" fill="#17102B"/><text x="200" y="106" font-size="14" font-weight="800" fill="#fff" text-anchor="middle" font-family="sans-serif">vs</text>`],
    b4: () => ['#12907C', '#BFF2E8', `<rect x="40" y="150" width="320" height="14" rx="7" fill="#fff" opacity=".9"/><rect x="100" y="52" width="150" height="96" rx="10" fill="#fff"/><rect x="110" y="62" width="130" height="76" rx="6" fill="#E3FBF5"/>${avs(LOOK.t06, 150, 66, 60)}<rect x="124" y="124" width="26" height="8" rx="4" fill="#22B8A0"/><rect x="60" y="148" width="210" height="6" fill="#fff"/><path d="M85 148 h180 l10 -4 h-200z" fill="#E3FBF5"/><g transform="translate(96 40)"><path d="M0 40 a30 30 0 0 1 60 0" fill="none" stroke="#17102B" stroke-width="7" stroke-linecap="round" transform="translate(24 -28) scale(.85)"/><rect x="14" y="-6" width="14" height="22" rx="6" fill="#17102B" transform="translate(4 0)"/><rect x="82" y="-6" width="14" height="22" rx="6" fill="#17102B"/></g><g transform="translate(300 86)"><rect width="46" height="82" rx="8" fill="#17102B"/><rect x="4" y="8" width="38" height="62" rx="3" fill="#fff"/><circle cx="23" cy="34" r="14" fill="#FFE3E3"/><path d="M13 44 L33 24" stroke="#E03131" stroke-width="4" stroke-linecap="round"/><path d="M17 26 a8 8 0 0 1 12 0 M15 38 h16" stroke="#E03131" stroke-width="3" fill="none"/></g><g transform="translate(46 100)"><path d="M0 50 q-8 -34 12 -40 q6 -22 22 -4 q22 -2 14 24 q4 14 -8 20z" fill="#34C38F"/><rect x="8" y="50" width="34" height="28" rx="5" fill="#FF8A5B"/></g>`],
    b5: () => ['#E8590C', '#FFD9B8', `<rect x="94" y="22" width="150" height="156" rx="10" fill="#fff"/><rect x="94" y="22" width="16" height="156" rx="6" fill="#E8590C"/><g stroke="#F2D9C4" stroke-width="3">${[48, 78, 108, 138].map(y => `<path d="M122 ${y} H230"/>`).join('')}</g><path d="M126 52 l14 14 M140 52 l-14 14" stroke="#E03131" stroke-width="5" stroke-linecap="round"/><path d="M152 59 h60" stroke="#E03131" stroke-width="3" opacity=".5"/><path d="M126 112 l9 9 l17 -19" stroke="#22B8A0" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M164 112 h50" stroke="#22B8A0" stroke-width="3" opacity=".6"/><g transform="translate(292 70)"><circle r="40" fill="#FFF6D8" stroke="#FFC53D" stroke-width="5"/><path d="M-12 14 h24 M-9 24 h18" stroke="#17102B" stroke-width="4" stroke-linecap="round"/><path d="M-14 8 q-12 -22 14 -30 q26 8 14 30z" fill="#FFC53D"/><g stroke="#FFC53D" stroke-width="4" stroke-linecap="round"><path d="M0 -56 v-10 M42 -40 l8 -6 M-42 -40 l-8 -6"/></g></g><g transform="translate(40 150) rotate(-30)"><rect width="84" height="12" rx="3" fill="#2F5BE0"/><path d="M84 0 l15 6 l-15 6z" fill="#F2D9B8"/><rect x="-14" width="14" height="12" rx="3" fill="#FF8FB1"/></g>`],
  };
  const blogArt = (id, cls = 'bc-art') => { const f = BART[id]; if (!f) return ''; const a = f(); return `<svg class="${cls}" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a[0]}"/><stop offset="1" stop-color="${a[1]}"/></linearGradient></defs><rect width="400" height="200" fill="url(#bg-${id})"/><circle cx="360" cy="20" r="70" fill="#fff" opacity=".16"/><circle cx="30" cy="190" r="60" fill="#fff" opacity=".12"/>${a[2]}</svg>`; };

  function blogCard(b) {
    return `<article class="bc"><a class="bc-top" href="#post-${b.id}" style="--cc:${b.color}">${blogArt(b.id)}<span>${esc(L(b.tag))}</span></a>
      <div class="bc-body"><div class="tags"><span class="tag">${esc(L(b.tag))}</span></div><small class="mute">${fdate(b.date)} · ${num(b.min)} ${t('min_read')}</small>
      <h3><a href="#post-${b.id}">${esc(L(b.title))}</a></h3><p>${esc(L(b.ex))}</p>
      <a class="more-l" href="#post-${b.id}">${t('read_more')}${ic('arrow')}</a></div></article>`;
  }
  function viewBlog() {
    return pagehead(t('blog_t'), t('blog_d'), `<span>/</span><span>${t('nav_blog')}</span>`) +
      sec('', '', `<div class="grid grid-b">${BLOG.map(blogCard).join('')}</div>`);
  }
  function viewPost(id) {
    const b = byId(BLOG, id); if (!b) return view404();
    return `<div class="phead phead-c" style="--cc:${b.color}">${blogArt(b.id, 'ph-art')}<div class="wrap">
      <nav class="crumbs"><a href="#home">${t('nav_home')}</a><span>/</span><a href="#blog">${t('nav_blog')}</a></nav>
      <div class="tags tags-w"><span class="tag">${esc(L(b.tag))}</span></div>
      <h1>${esc(L(b.title))}</h1><p>${t('by_team')} · ${fdate(b.date)} · ${num(b.min)} ${t('min_read')}</p></div></div>` +
      sec('', '', `<article class="prose narrow post">${b.body.map(x => `<p>${esc(L(x))}</p>`).join('')}
        <div class="cta cta-s"><div><h2>${t('post_cta')}</h2></div><div class="cta-b"><a class="btn btn-w" href="#courses">${t('nav_courses')}</a></div></div></article>`) +
      sec('sec-soft', sechead(t('more_posts')), `<div class="grid grid-b">${BLOG.filter(x => x.id !== b.id).slice(0, 3).map(blogCard).join('')}</div>`);
  }

  /* ---------- checkout ---------- */
  function payNote() {
    return CO.pay === 'cash' ? `<p class="paynote ok">${ic('check')}${t('ck_cash_note')}</p>` : `<p class="paynote bad">${ic('close')}${t('ck_online_err')}</p>`;
  }
  function viewCheckout(id) {
    const c = byId(COURSES, id); if (!c || !progOn(c.program)) return view404();
    if (!CO || CO.id !== c.id) CO = { id: c.id, fmt: c.formats[0], plan: 'x', code: '', input: '', err: false };
    if (!CO.pay) CO.pay = 'cash';
    const k = calc(c, CO), tc = byId(TEACHERS, c.teacher);
    const pay = (v, ti, de, on, soon) => `<label class="opt ${CO.pay === v ? 'on' : ''}"><input type="radio" name="pay" value="${v}" ${CO.pay === v ? 'checked' : ''}><span><b>${ti}</b><small>${de}</small></span>${soon ? `<em class="soon">${t('ck_soon')}</em>` : ''}</label>`;
    return pagehead(t('ck_t'), t('ck_d'), `<span>/</span><a href="#course-${c.id}">${esc(L(c.title))}</a><span>/</span><span>${t('ck_t')}</span>`) +
      sec('', '', `<div class="ck-wrap" id="ck-wrap">
      <form class="bt-form" data-form="checkout" novalidate>
        <h3 class="fs-t">${t('ck_details')}</h3>
        <div class="row">${fld({ name: 'en_name', label: t('f_name'), req: true, auto: 'name' })}${fld({ name: 'en_phone', label: t('f_phone'), req: true, type: 'tel', ph: '01XXXXXXXXX', auto: 'tel' })}</div>
        <div class="row">${fld({ name: 'en_email', label: t('f_email'), type: 'email', auto: 'email' })}${fld({ name: 'en_ref', label: t('f_ref'), ph: 'CHAATRO-XXXX' })}</div>
        <h3 class="fs-t">${t('ck_pay')}</h3>
        <fieldset class="co-g pays"><legend class="sr">${t('ck_pay')}</legend>
          ${pay('online', t('ck_online'), t('ck_online_d'), false, true)}
          ${pay('cash', t('ck_cash'), t('ck_cash_d'), true, false)}
        </fieldset>
        <div id="pay-note" aria-live="polite">${payNote()}</div>
        <small class="err" id="e-pay" role="alert"></small>
        <button class="btn btn-p btn-lg btn-block" type="submit">${t('ck_place')}${ic('arrow')}</button>
        <p class="mute sm center">${t('ck_demo')}</p>
      </form>
      <aside class="checkout"><h3>${t('ck_summary')}</h3>
        <div class="ck-c" style="--cc:${progColor(c.program)}"><span class="ck-code">${esc(byId(PROGRAMS, c.program).code)}</span><span><b>${esc(L(c.title))}</b><small>${avatar(tc, 20)} ${esc(L(tc.n))}</small></span></div>
        <ul class="ck-l"><li><span>${t('co_fmt')}</span><b>${esc(ctName(CO.fmt))}</b></li><li><span>${t('co_plan')}</span><b>${planLabel(k.opt)}</b></li><li><span>${t('starts')}</span><b>${fdate(c.start)}</b></li>${CO.fmt === 'one' ? `<li><span>${t('pref_time')}</span><b>${esc(CO.pref || t('pref_none'))}</b></li>` : `<li><span>${t('batch_l')}</span><b>${t('batch_v')}</b></li>`}</ul>
        <dl class="sum"><div><dt>${t('sum_price')}</dt><dd>${money(k.disc)}</dd></div>${k.cut ? `<div class="ok"><dt>${t('sum_cp')}</dt><dd>− ${money(k.cut)}</dd></div>` : ''}<div class="tot"><dt>${t('sum_total')}</dt><dd>${money(k.total)}</dd></div><div class="now"><dt>${k.one ? t('sum_now') : t('sum_first')}</dt><dd>${money(k.now)}</dd></div></dl>
        <a class="btn btn-o btn-block" href="#course-${c.id}">${t('ck_change')}</a>
        <p class="co-note">${ic('video')}${t('co_note')}</p></aside></div>`);
  }

  /* ---------- static pages ---------- */
  function viewHow() {
    const stu = [1, 2, 3, 4, 5].map(i => `<li><span class="sn">${num(i)}</span><b>${t('hw_s' + i + 't')}</b><p>${t('hw_s' + i + 'd')}</p></li>`).join('');
    return pagehead(t('nav_how'), t('hw_d'), `<span>/</span><span>${t('nav_how')}</span>`) +
      sec('', sechead(t('hw_student')), `<ol class="steps">${stu}</ol>`) +
      sec('sec-soft', sechead(t('hw_class')), `<div class="info info-4"><div>${ic('calendar')}<span><small>1</small><b>${t('hw_c1')}</b></span></div><div>${ic('video')}<span><small>2</small><b>${t('hw_c2')}</b></span></div><div>${ic('chat')}<span><small>3</small><b>${t('hw_c3')}</b></span></div><div>${ic('clock')}<span><small>4</small><b>${t('hw_c4')}</b></span></div></div>`) +
      sec('', sechead(t('fmt_t'), t('fmt_d')), `<div class="tbl-w"><table class="tbl"><thead><tr><th></th><th>${t('one_fmt')}</th><th>${t('group_fmt')}</th></tr></thead><tbody>
        <tr><th>${t('cmp_size')}</th><td>${num(1)}</td><td>${num(7)}</td></tr><tr><th>${t('cmp_cost')}</th><td>${t('cmp_high')}</td><td>${t('cmp_low')}</td></tr>
        <tr><th>${t('cmp_focus')}</th><td>${t('cmp_full')}</td><td>${t('cmp_share')}</td></tr><tr><th>${t('cmp_chat')}</th><td>${t('cmp_chat1')}</td><td>${t('cmp_chatg')}</td></tr>
        <tr><th>${t('cmp_rec')}</th><td colspan="2" class="c">${t('cmp_rec_v')}</td></tr></tbody></table></div>`);
  }

  function viewAbout() {
    return pagehead(t('nav_about'), t('ab_d'), `<span>/</span><span>${t('nav_about')}</span>`) +
      sec('', '', `<div class="two"><div class="prose"><h2>${t('ab_t1')}</h2><p>${t('ab_p1')}</p><h2>${t('ab_t2')}</h2><p>${t('ab_p2')}</p></div>
      <div class="info info-1"><div>${ic('pin')}<span><small>${t('ab_k1')}</small><b>${t('ab_v1')}</b></span></div><div>${ic('award')}<span><small>${t('ab_k2')}</small><b>${t('ab_v2')}</b></span></div><div>${ic('users')}<span><small>${t('ab_k3')}</small><b>${t('ab_v3')}</b></span></div><div>${ic('video')}<span><small>${t('ab_k4')}</small><b>${t('ab_v4')}</b></span></div></div></div>`) +
      sec('sec-soft', sechead(t('ab_t3')), `<div class="grid grid-3">${[1, 2, 3].map(i => `<div class="vcard"><h3>${t('ab_w' + i + 't')}</h3><p>${t('ab_w' + i + 'd')}</p></div>`).join('')}</div>`);
  }

  function viewFaq() {
    return pagehead(t('nav_faq'), t('faq_d'), `<span>/</span><span>${t('nav_faq')}</span>`) +
      sec('', '', `<div class="acc acc-w">${FAQS.map((f, i) => `<details ${i === 0 ? 'open' : ''}><summary>${esc(L(f.q))}</summary><p>${esc(L(f.a))}</p></details>`).join('')}</div>
      <div class="cta cta-s"><div><h2>${t('faq_more')}</h2><p>${t('faq_more_d')}</p></div><div class="cta-b"><a class="btn btn-w" href="#contact">${t('nav_contact')}</a></div></div>`);
  }

  function viewContact() {
    return pagehead(t('nav_contact'), t('ct_d'), `<span>/</span><span>${t('nav_contact')}</span>`) +
      sec('', '', `<div class="two"><div class="bt-form" id="ct-wrap"><form data-form="contact" novalidate>
        ${fld({ name: 'c_name', label: t('f_name'), req: true, auto: 'name' })}
        ${fld({ name: 'c_phone', label: t('f_phone'), req: true, type: 'tel', ph: '01XXXXXXXXX', auto: 'tel' })}
        ${selFld({ name: 'c_topic', label: t('ct_topic'), opts: [['s', t('ct_t1')], ['t', t('ct_t2')], ['p', t('ct_t3')], ['o', t('ct_t4')]] })}
        ${areaFld({ name: 'c_msg', label: t('ct_msg'), req: true, rows: 5 })}
        <button class="btn btn-p btn-lg btn-block" type="submit">${t('ct_send')}</button><p class="mute sm center">${t('demo_form')}</p></form></div>
        <div class="info info-1"><div>${ic('mail')}<span><small>${t('ct_email')}</small><b>support@chaatro.com</b><em class="mute sm">${t('ct_sample')}</em></span></div>
        <div>${ic('phone')}<span><small>${t('ct_phone')}</small><b>${t('ct_sample')}</b></span></div><div>${ic('chat')}<span><small>${t('ct_chat')}</small><b>${t('ct_chat_v')}</b></span></div><div>${ic('clock')}<span><small>${t('ct_hours')}</small><b>${t('ct_hours_v')}</b></span></div></div></div>`);
  }

  function viewAuth(mode) {
    const su = mode === 'signup';
    return `<section class="auth"><div class="wrap auth-in">
      <div class="auth-side"><h1>${su ? t('su_t') : t('li_t')}</h1><p>${su ? t('su_d') : t('li_d')}</p>
        <ul class="outs">${[1, 2, 3].map(i => `<li>${ic('check')}${t('au_p' + i)}</li>`).join('')}</ul></div>
      <div class="auth-card"><div class="seg" role="tablist"><a href="#login" role="tab" aria-selected="${!su}">${t('login')}</a><a href="#signup" role="tab" aria-selected="${su}">${t('signup')}</a></div>
        <form data-form="${mode}" novalidate id="auth-form">
          ${su ? fld({ name: 'a_name', label: t('f_name'), req: true, auto: 'name' }) : ''}
          ${fld({ name: 'a_id', label: su ? t('f_phone') : t('f_phone_or'), req: true, auto: 'username', ph: su ? '01XXXXXXXXX' : '' })}
          ${su ? selFld({ name: 'a_level', label: t('f_level'), opts: [['c6', t('lv6')], ['c7', t('lv7')], ['hsc', t('lvhsc')], ['adm', t('lvadm')]] }) : ''}
          ${fld({ name: 'a_pass', label: t('f_pass'), req: true, type: 'password', auto: su ? 'new-password' : 'current-password' })}
          ${su ? fld({ name: 'a_ref', label: t('f_ref'), ph: 'CHAATRO-XXXX' }) : ''}
          <button class="btn btn-p btn-lg btn-block" type="submit">${su ? t('signup') : t('login')}</button>
          <p class="mute sm center">${su ? `${t('have_acc')} <a href="#login">${t('login')}</a>` : `${t('no_acc')} <a href="#signup">${t('signup')}</a>`}</p>
          <p class="mute sm center">${t('teacher_q')} <a href="#become-teacher">${t('nav_become')}</a></p>
        </form>
        ${su ? '' : `<div class="demo-p demo-c"><b>${t('demo_cred')}</b><small>${t('demo_cred_d')}</small><ul>${DEMO_USERS.map(u => `<li><span>${t(u.role)}</span><code>${u.id}</code><code>${u.pass}</code></li>`).join('')}</ul></div>`}<div class="demo-p"><b>${t('demo_portal')}</b><small>${t('dp_note')}</small><div><a class="btn btn-o btn-sm" href="#s-home">${t('dp_student')}</a><a class="btn btn-o btn-sm" href="#t-home">${t('dp_teacher')}</a><a class="btn btn-o btn-sm" href="#a-home">${t('dp_admin')}</a></div></div></div></div></section>`;
  }

  const DEMO_USERS = [
    { role: 'dp_student', id: '01700000001', pass: 'student123', to: '#s-home' },
    { role: 'dp_teacher', id: '01700000002', pass: 'teacher123', to: '#t-home' },
    { role: 'dp_admin', id: 'admin@chaatro.com', pass: 'admin123', to: '#a-home' }
  ];
  const POLS = { payment: ['p_payment', 3], refund: ['p_refund', 3], cookie: ['p_cookie', 3], terms: ['p_terms', 4], privacy: ['p_privacy', 3] };
  function viewPolicy(slug) {
    const p = POLS[slug]; if (!p) return view404();
    return pagehead(t(p[0]), t('pol_draft'), `<span>/</span><span>${t(p[0])}</span>`) +
      sec('', '', `<div class="prose narrow"><p class="notice">${t('pol_draft_d')}</p>${Array.from({ length: p[1] }, (_, i) => `<h2>${t('pol_' + slug + '_h' + (i + 1))}</h2><p>${t('pol_' + slug + '_p' + (i + 1))}</p>`).join('')}
      <div class="pol-g"><a href="#policy-payment">${t('p_payment')}</a><a href="#policy-refund">${t('p_refund')}</a><a href="#policy-cookie">${t('p_cookie')}</a><a href="#policy-terms">${t('p_terms')}</a><a href="#policy-privacy">${t('p_privacy')}</a></div></div>`);
  }

  function view404() {
    return `<section class="sec"><div class="wrap center"><h1>${t('nf_t')}</h1><p class="mute">${t('nf_d')}</p><a class="btn btn-p" href="#home">${t('back_home')}</a></div></section>`;
  }

  /* ---------- router / render ---------- */
  function route() {
    const h = (location.hash || '#home').slice(1) || 'home';
    if (h === 'portal') return { name: 'portal', role: null };
    const pm = h.match(/^([sta])-([a-z0-9]+)(?:-(.+))?$/);
    if (pm) return { name: 'portal', role: pm[1], sec: pm[2], arg: pm[3] };
    const m = h.match(/^(course|teacher|policy|checkout|post|bundle|bpay)-(.+)$/);
    if (m) return { name: m[1], id: m[2] };
    return { name: h };
  }
  const TITLES = { home: 'nav_home', courses: 'nav_courses', teachers: 'nav_teachers', 'become-teacher': 'nav_become', 'how-it-works': 'nav_how', about: 'nav_about', faq: 'nav_faq', blog: 'nav_blog', contact: 'nav_contact', login: 'login', signup: 'signup' };

  function snapshot() {
    const snap = {};
    $$('#app input, #app textarea, #app select').forEach(el => {
      if (!el.name || el.type === 'file' || el.type === 'password') return;
      if (el.type === 'checkbox') { (snap[el.name] = snap[el.name] || []).push([el.value, el.checked]); }
      else if (el.type === 'radio') { if (el.checked) snap[el.name] = el.value; }
      else snap[el.name] = el.value;
    });
    return snap;
  }
  function restore(snap) {
    Object.keys(snap).forEach(n => {
      const v = snap[n];
      $$(`#app [name="${n}"]`).forEach(el => {
        if (el.type === 'checkbox') { const f = (v || []).find(x => x[0] === el.value); if (f) el.checked = f[1]; }
        else if (el.type === 'radio') el.checked = el.value === v;
        else el.value = v;
      });
    });
  }

  function render(keep) {
    stopSlides();
    const r = route();
    const snap = keep && r.name !== 'portal' ? snapshot() : null;
    const V = {
      home: viewHome, blog: viewBlog, post: () => viewPost(r.id), checkout: () => viewCheckout(r.id), bundles: viewBundles, bundle: () => viewBundle(r.id), bpay: () => viewBundlePay(r.id), courses: viewCourses, course: () => viewCourse(r.id), teachers: viewTeachers, teacher: () => viewTeacher(r.id),
      'become-teacher': viewBecome, 'how-it-works': viewHow, about: viewAbout, faq: viewFaq, contact: viewContact,
      login: () => viewAuth('login'), signup: () => viewAuth('signup'), policy: () => viewPolicy(r.id),
    };
    const fn = V[r.name] || view404;
    if (r.name === 'portal') {
      document.body.classList.add('in-portal');
      $('#hd').innerHTML = ''; $('#ft').innerHTML = '';
      $('#app').innerHTML = window.PX ? PX.view(r.role, r.sec, r.arg) : '';
      document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
      document.title = (window.PX && PX.title ? PX.title() + ' | ' : '') + 'ছাত্র.com';
      if (window.PX && PX.after) PX.after();
      if (!keep) window.scrollTo(0, 0);
      return;
    }
    document.body.classList.remove('in-portal');
    $('#hd').innerHTML = header(r);
    $('#app').innerHTML = fn();
    $('#ft').innerHTML = footer();
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
    let ttl = TITLES[r.name] ? t(TITLES[r.name]) : '';
    if (r.name === 'course') { const c = byId(COURSES, r.id); if (c) ttl = L(c.title); }
    if (r.name === 'teacher') { const x = byId(TEACHERS, r.id); if (x) ttl = L(x.n); }
    if (r.name === 'policy' && POLS[r.id]) ttl = t(POLS[r.id][0]);
    if (r.name === 'post') { const x = byId(BLOG, r.id); if (x) ttl = L(x.title); }
    if (r.name === 'checkout' || r.name === 'bpay') ttl = t('ck_t');
    if (r.name === 'bundles') ttl = t('bd_t');
    if (r.name === 'bundle') { const x = byId(BUNDLES, r.id); if (x) ttl = L(x.title); }
    document.title = (ttl ? ttl + ' | ' : '') + 'ছাত্র.com';
    if (r.name === 'home' || r.name === 'courses') results();
    if (r.name === 'teachers') teachersGrid();
    if (r.name === 'home') startSlides();
    if (snap) restore(snap);
    if (!keep) window.scrollTo(0, 0);
  }

  /* carousel */
  function showSlide(i) {
    const sl = $$('.slide'); if (!sl.length) return;
    slide = (i + sl.length) % sl.length;
    sl.forEach((s, j) => { s.dataset.on = j === slide ? '1' : ''; s.setAttribute('aria-hidden', j !== slide); });
    $$('.dots button').forEach((d, j) => d.setAttribute('aria-current', j === slide));
  }
  function startSlides() {
    slide = 0;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(() => showSlide(slide + 1), 6500);
  }
  function stopSlides() { if (timer) { clearInterval(timer); timer = null; } }

  /* ---------- events ---------- */
  function goFilter() {
    const here = route().name;
    if (here !== 'home' && here !== 'courses') { location.hash = '#courses'; return; }
    results();
    const f = $('#filter'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function setPick(k, v) { F[k] = v; const ch = $('#chips'); if (ch) ch.innerHTML = chips(); const s = $('#f-' + k); if (s) s.value = v; }

  document.addEventListener('click', e => {
    const gf = e.target.closest('[data-go-filter]');
    if (gf) {
      const k = gf.dataset.goFilter, pg = gf.dataset.prog;
      if (k) setPick('kind', k); if (pg) setPick('program', pg);
      goFilter(); return;
    }
    const pk = e.target.closest('[data-pick]');
    if (pk) {
      F = Object.assign({}, F0, { [pk.dataset.pick]: pk.dataset.val });
      if (pk.dataset.go) { const here = route().name; if (here === 'home' || here === 'courses') { render(true); goFilter(); } else location.hash = '#courses'; }
      else { setPick(pk.dataset.pick, pk.dataset.val); results(); }
      return;
    }
    const a = e.target.closest('[data-act]'); if (!a) return;
    const act = a.dataset.act;
    if (act === 'lang') { lang = lang === 'bn' ? 'en' : 'bn'; try { localStorage.setItem('chaatro-lang', lang); } catch (x) { /* ignore */ } closeModal(); render(true); }
    else if (act === 'scr') { const tr = a.parentElement.querySelector('.scr-t'); tr.scrollBy({ left: +a.dataset.dir * Math.max(240, tr.clientWidth * .85), behavior: 'smooth' }); }
    else if (act === 'menu') { menuOpen = !menuOpen; $('#hd').innerHTML = header(route()); }
    else if (act === 'reset') { F = Object.assign({}, F0); const keepScroll = window.scrollY; render(true); window.scrollTo(0, keepScroll); }
    else if (act === 'next') { showSlide(slide + 1); stopSlides(); }
    else if (act === 'prev') { showSlide(slide - 1); stopSlides(); }
    else if (act === 'dot') { showSlide(+a.dataset.i); stopSlides(); }
    else if (act === 'coupon-note') { location.hash = '#courses'; }
    else if (act === 'apply') {
      const code = ($('#cpn').value || '').trim().toUpperCase(); CO.input = code;
      if (couponFor(byId(COURSES, CO.id), code)) { CO.code = code; CO.err = false; } else { CO.code = ''; CO.err = !!code; }
      refreshCheckout();
    }
    else if (act === 'ytplay') { const id = a.dataset.yt; if (id) { a.outerHTML = `<div class="vp vp-on"><iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`; } }
    else if (act === 'receipt') { if (LASTRC && window.XL) XL.receipt(LASTRC); }
    else if (act === 'enroll') { location.hash = '#checkout-' + CO.id; }
    else if (act === 'scroll-co') { const c = $('#checkout'); if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    else if (act === 'scroll-form') { const c = $('#apply'); if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    else if (act === 'close') closeModal();
    else if (act === 'rmfile') { UP[a.dataset.k].splice(+a.dataset.i, 1); $('#fl-' + a.dataset.k).innerHTML = fileList(a.dataset.k); }
    if (menuOpen && e.target.closest('#nav a')) { menuOpen = false; }
  });

  const onFilter = e => {
    const el = e.target.closest('[data-f]');
    if (el) { F[el.dataset.f] = el.type === 'range' ? +el.value : el.value; if (el.dataset.f === 'max') $('#maxv').textContent = money(F.max); const ch = $('#chips'); results(); return; }
    const tf = e.target.closest('[data-tf]');
    if (tf) { TF[tf.dataset.tf] = tf.value; teachersGrid(); return; }
    const co = e.target.closest('[data-co]');
    if (co) { CO[co.dataset.co] = co.value; if (co.dataset.co === 'pref') return; if (co.dataset.co === 'fmt') CO.plan = 'x'; refreshCheckout(); return; }
    const up = e.target.closest('[data-up]');
    if (up && e.type === 'change') { addFiles(up.dataset.up, up.files); up.value = ''; }
    if (e.target.name === 'pay' && e.target.type === 'radio') {
      CO.pay = e.target.value; $$('.pays .opt').forEach(o => o.classList.toggle('on', o.contains(e.target)));
      const pn = $('#pay-note'); if (pn) pn.innerHTML = payNote(); const ep = $('#e-pay'); if (ep) ep.textContent = ''; return;
    }
    if (e.target.type === 'radio' && e.target.closest('.m-box')) { $$('.m-box .opt').forEach(o => o.classList.toggle('on', o.contains(e.target) && e.target.checked)); }
  };
  document.addEventListener('input', onFilter);
  document.addEventListener('change', onFilter);

  document.addEventListener('submit', e => {
    const f = e.target.closest('form[data-form]'); if (!f) return; e.preventDefault();
    const kind = f.dataset.form;
    if (kind === 'teacher') return teacherSubmit(f);
    const errs = {};
    $$('[required]', f).forEach(el => { if (!el.value.trim()) errs[el.name] = t('e_req'); });
    const ph = f.elements.en_phone || f.elements.c_phone; if (ph && ph.value && !/^(?:\+?88)?01[3-9]\d{8}$/.test(ph.value.replace(/[\s-]/g, ''))) errs[ph.name] = t('e_phone');
    let dest = null;
    if (kind === 'login' && !Object.keys(errs).length) {
      const u = f.elements.a_id.value.trim().toLowerCase(), p = f.elements.a_pass.value;
      const hit = DEMO_USERS.find(x => x.id.toLowerCase() === u && x.pass === p);
      if (hit) dest = hit.to; else errs.a_pass = t('e_login');
    }
    showErrors(f, errs); if (Object.keys(errs).length) return;
    if (dest) { location.hash = dest; return; }
    if (kind === 'bcheckout') {
      const b = byId(BUNDLES, f.dataset.id), k = bundleCalc(b), oid = 'CHT-' + String(100000 + Math.floor(Math.random() * 899999));
      mkRc(f, oid, [[t('bd_tag'), L(b.title)]].concat(k.cs.map(x => [t('nav_courses'), L(x.title)])), money(k.price));
      $('#ck-wrap').innerHTML = `<div class="bt-form done-w"><div class="done"><span class="done-i">${ic('check')}</span><h3>${t('ck_done_t')}</h3><p>${t('ck_done_d')}</p>
        <dl class="sum"><div><dt>${t('order_id')}</dt><dd>${oid}</dd></div><div><dt>${t('bd_tag')}</dt><dd>${esc(L(b.title))}</dd></div><div><dt>${t('bd_n')}</dt><dd>${num(k.cs.length)}</dd></div><div><dt>${t('sum_total')}</dt><dd>${money(k.price)}</dd></div><div><dt>${t('f_name')}</dt><dd>${esc(f.elements.en_name.value.trim())}</dd></div><div><dt>${t('status')}</dt><dd>${t('ck_status')}</dd></div></dl>
        <div class="btns"><button type="button" class="btn btn-p" data-act="receipt">${ic('download')} ${t('rc_btn')}</button> <a class="btn btn-o" href="#home">${t('back_home')}</a></div></div></div>`;
      window.scrollTo(0, 0); return;
    }
    if (kind === 'checkout' || kind === 'enroll') {
      const c0 = byId(COURSES, CO.id);
      if (c0 && !c0.formats.includes('one')) {
        if (c0.seats <= 0) { const e = $('#e-pay') || $('.m-box .err'); if (e) e.textContent = t('seats_full'); else alert(t('seats_full')); return; }
      }
    }
    if (kind === 'checkout') {
      if (CO.pay !== 'cash') { $('#e-pay').textContent = t('ck_online_err'); $('#pay-note').scrollIntoView({ block: 'center' }); return; }
      const c = byId(COURSES, CO.id), k = calc(c, CO), oid = 'CHT-' + String(100000 + Math.floor(Math.random() * 899999));
      mkRc(f, oid, [[t('nav_courses'), L(c.title)], [t('rc_teacher'), L(byId(TEACHERS, c.teacher).n)]], money(k.now));
      $('#ck-wrap').innerHTML = `<div class="bt-form done-w"><div class="done"><span class="done-i">${ic('check')}</span><h3>${t('ck_done_t')}</h3><p>${t('ck_done_d')}</p>
        <dl class="sum"><div><dt>${t('order_id')}</dt><dd>${oid}</dd></div><div><dt>${t('nav_courses')}</dt><dd>${esc(L(c.title))}</dd></div><div><dt>${t('f_name')}</dt><dd>${esc(f.elements.en_name.value.trim())}</dd></div>${CO.fmt === 'one' ? `<div><dt>${t('pref_time')}</dt><dd>${esc(CO.pref || t('pref_none'))}</dd></div>` : ''}<div><dt>${t('status')}</dt><dd>${t('ck_status')}</dd></div><div class="now"><dt>${k.one ? t('sum_now') : t('sum_first')}</dt><dd>${money(k.now)}</dd></div></dl>
        <h4>${t('ck_next')}</h4><ol class="steps steps-s"><li><span class="sn">${num(1)}</span><b>${t('ck_n1')}</b></li><li><span class="sn">${num(2)}</span><b>${t('ck_n2')}</b></li><li><span class="sn">${num(3)}</span><b>${t('ck_n3')}</b></li></ol>
        <div class="btns"><button type="button" class="btn btn-p" data-act="receipt">${ic('download')} ${t('rc_btn')}</button> <a class="btn btn-o" href="#home">${t('back_home')}</a></div></div></div>`;
      { const c1 = byId(COURSES, CO.id); if (!c1.formats.includes('one')) c1.seats = Math.max(0, c1.seats - 1); }
      window.scrollTo(0, 0); return;
    }
    if (kind === 'enroll') {
      { const c1 = byId(COURSES, CO.id); if (!c1.formats.includes('one')) c1.seats = Math.max(0, c1.seats - 1); }
      const c = byId(COURSES, CO.id), k = calc(c, CO), oid = 'CHT-' + String(100000 + Math.floor(Math.random() * 899999));
      mkRc(f, oid, [[t('nav_courses'), L(c.title)], [t('rc_teacher'), L(byId(TEACHERS, c.teacher).n)]], money(k.now));
      $('.m-box').innerHTML = `<button class="m-x" data-act="close" aria-label="${t('close')}">${ic('close')}</button><div class="done"><span class="done-i">${ic('check')}</span><h3>${t('order_t')}</h3><p>${t('order_d')}</p>
        <dl class="sum"><div><dt>${t('order_id')}</dt><dd>${oid}</dd></div><div><dt>${t('nav_courses')}</dt><dd>${esc(L(c.title))}</dd></div><div class="now"><dt>${t('sum_now')}</dt><dd>${money(k.now)}</dd></div></dl>
        <div class="btns"><button type="button" class="btn btn-p" data-act="receipt">${ic('download')} ${t('rc_btn')}</button> <button class="btn btn-o" data-act="close">${t('close')}</button></div></div>`;
    } else if (kind === 'contact') {
      $('#ct-wrap').innerHTML = `<div class="done"><span class="done-i">${ic('check')}</span><h3>${t('ct_done')}</h3><p>${t('ct_done_d')}</p></div>`;
    } else {
      location.hash = '#s-home';
    }
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  ['dragover', 'dragleave', 'drop'].forEach(ev => document.addEventListener(ev, e => {
    const z = e.target.closest && e.target.closest('[data-dz]'); if (!z) return;
    e.preventDefault();
    z.classList.toggle('over', ev === 'dragover');
    if (ev === 'drop' && e.dataTransfer) addFiles(z.dataset.dz, e.dataTransfer.files);
  }));

  window.CH = { ytId, player, lang: () => lang, num, money, esc, L, fdate, byId, ic, avatar, rate, PCOLOR, planOptions, planLabel, firstOf, cyc, couponFor, rerender: () => render(true), t };
  window.addEventListener('hashchange', () => { menuOpen = false; closeModal(); render(false); });
  document.addEventListener('DOMContentLoaded', () => render(false));
  if (document.readyState !== 'loading') render(false);
})();
