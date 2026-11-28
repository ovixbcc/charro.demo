/* Supabase login (Google) + session. Only the display identity lives in the browser.
   Roles/permissions never come from client-side data: a Google user is a student-portal user only. */
(function () {
  'use strict';
  const HINT = 'chaatro_auth_hint';            // display-only (name/email) so the header does not flash "Log in" on reload
  const A = window.CHAUTH = { user: null, provisional: false, error: '', ready: null, callback: false };
  const bn = () => { try { return window.CH && CH.lang() === 'bn'; } catch (e) { return false; } };
  const tx = (b, e) => (bn() ? b : e);
  const emit = () => { try { window.dispatchEvent(new CustomEvent('chauth')); } catch (e) {} };

  /* Did we just come back from Google? (tokens or an error arrive in the URL hash/query) */
  const raw = (location.hash || '').replace(/^#/, '') + '&' + (location.search || '').replace(/^\?/, '');
  const qp = new URLSearchParams(raw);
  A.callback = /(^|&)(access_token|refresh_token|error|error_description|error_code|code)=/.test(raw);
  A.cbError = qp.get('error_description') || qp.get('error') || '';

  try { const h = JSON.parse(localStorage.getItem(HINT) || 'null'); if (h && h.id) { A.user = h; A.provisional = true; } } catch (e) {}

  const mapUser = u => (u ? { id: u.id, email: u.email || '', name: (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || (u.email || '').split('@')[0] || '', avatar: (u.user_metadata && (u.user_metadata.avatar_url || u.user_metadata.picture)) || '' } : null);
  const setUser = u => {
    const m = mapUser(u); A.user = m; A.provisional = false;
    try { if (m) localStorage.setItem(HINT, JSON.stringify({ id: m.id, name: m.name, email: m.email })); else localStorage.removeItem(HINT); } catch (e) {}
    emit();
  };

  /* small message bar (sign-in failures etc.) */
  A.notify = (msg, bad) => {
    let el = document.getElementById('auth-msg');
    if (!el) { el = document.createElement('div'); el.id = 'auth-msg'; el.setAttribute('role', 'alert'); document.body.appendChild(el); }
    el.className = 'auth-msg ' + (bad === false ? 'ok' : 'bad'); el.innerHTML = '';
    const t = document.createElement('span'); t.textContent = msg; const x = document.createElement('button'); x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', 'close'); x.onclick = () => el.remove();
    el.append(t, x); clearTimeout(A._t); A._t = setTimeout(() => el.remove(), 9000);
  };

  let client = null, loading = null;
  const load = () => loading || (loading = (async () => {
    try {
      const c = await (await fetch('/api/config', { cache: 'no-store' })).json(); if (!c.ok) return null;
      if (!window.supabase) await new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
      client = window.supabase.createClient(c.url, c.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' } });
      window.SB = client;
      client.auth.onAuthStateChange((ev, s) => { if (ev === 'SIGNED_OUT') setUser(null); else if (s && s.user) setUser(s.user); });
      return client;
    } catch (e) { return null; }
  })());

  /* read the session once at start-up (supabase-js parses the callback tokens first), then open the portal after a Google return */
  A.ready = (async () => {
    const sb = await load();
    if (!sb) { if (A.provisional) { A.user = null; A.provisional = false; try { localStorage.removeItem(HINT); } catch (e) {} emit(); } if (A.callback) { A.notify(tx('Google লগইন এখন চালু নেই।', 'Google sign-in is not available right now.')); if (/access_token|error|code/.test(location.hash)) location.replace(location.pathname + '#login'); } return null; }
    let s = null, err = '';
    try { const r = await sb.auth.getSession(); s = r.data && r.data.session; err = r.error ? r.error.message : ''; } catch (e) { err = String(e.message || e); }
    setUser(s ? s.user : null);
    if (A.callback) {
      if (s && s.user) { location.replace(location.pathname + location.search.replace(/[?&](code|error[^&]*)=[^&]*/g, '') + '#s-home'); }
      else { A.notify(tx('Google লগইন সফল হয়নি: ', 'Google sign-in failed: ') + (A.cbError || err || tx('আবার চেষ্টা করুন।', 'please try again.')), true); location.replace(location.pathname + '#login'); }
    }
    return s ? A.user : null;
  })();

  /* a fresh access token (supabase-js refreshes it if it is about to expire); null when not logged in */
  A.token = async () => { const sb = await load(); if (!sb) return null; try { const { data } = await sb.auth.getSession(); return data && data.session ? data.session.access_token : null; } catch (e) { return null; } };

  /* the logged-in student's own PAID orders (RLS "orders read own" lets a user read only their own rows). Falls back if the new columns are not applied yet. */
  A.orders = async () => {
    const sb = await load(); if (!sb || !A.user) return [];
    try {
      let r = await sb.from('orders').select('txn,order_id,kind,cid,fmt,plan,amount,product,status,created_at').eq('status', 'SUCCESS').order('created_at', { ascending: true });
      if (r.error) r = await sb.from('orders').select('txn,order_id,amount,product,status,created_at').eq('status', 'SUCCESS').order('created_at', { ascending: true });
      return r.error ? [] : (r.data || []);
    } catch (e) { return []; }
  };

  A.signOut = async () => {
    const sb = await load();
    try { if (sb) await sb.auth.signOut(); } catch (e) { /* local session is cleared anyway */ }
    try { Object.keys(localStorage).filter(k => /^sb-.*-auth-token/.test(k)).forEach(k => localStorage.removeItem(k)); } catch (e) {}
    setUser(null);
  };

  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-google]'); if (!b) return; e.preventDefault();
    b.disabled = true;
    try {
      const sb = await load();
      if (!sb) { A.notify(tx('Google লগইন এখনও চালু হয়নি।', 'Google login is not set up yet.')); return; }
      const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + '/' } });
      if (error) A.notify(tx('Google লগইন শুরু করা যায়নি: ', 'Could not start Google sign-in: ') + error.message);
    } catch (x) { A.notify(tx('Google লগইন শুরু করা যায়নি: ', 'Could not start Google sign-in: ') + String(x.message || x)); }
    finally { b.disabled = false; }
  });
})();
