/* Supabase + Google লগইন। /api/config থেকে URL ও anon key নেয়; না থাকলে বাটন চুপচাপ কিছু করে না। */
(function () {
  let client = null, ready = null;
  const load = () => ready || (ready = (async () => {
    try {
      const c = await (await fetch('/api/config')).json(); if (!c.ok) return null;
      if (!window.supabase) await new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
      client = window.supabase.createClient(c.url, c.anonKey); window.SB = client; return client;
    } catch (e) { return null; }
  })());
  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-google]'); if (!b) return; e.preventDefault();
    const sb = await load(); if (!sb) { alert('Google login is not configured yet.'); return; }
    const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + '/#s-home' } });
    if (error) alert(error.message);
  });
  load();
})();
