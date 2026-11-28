/* Supabase সার্ভার-সাইড হেল্পার (REST). SUPABASE_SERVICE_ROLE_KEY শুধু Vercel Environment Variables-এ থাকে।
   কী না থাকলে চুপচাপ বাদ যায়, যাতে পেমেন্ট ফ্লো না ভাঙে। */
const ev = n => String(process.env[n] || '').trim().replace(/^["']|["']$/g, '').trim();
const skey = () => ev('SUPABASE_SERVICE_ROLE_KEY') || ev('SUPABASE_SERVICE_KEY');
const on = () => !!(ev('SUPABASE_URL') && skey());
const call = async (method, path, body, prefer) => {
  if (!on()) return null;
  try {
    const r = await fetch(ev('SUPABASE_URL').replace(/\/$/, '') + '/rest/v1/' + path, { method, headers: { apikey: skey(), Authorization: 'Bearer ' + skey(), 'Content-Type': 'application/json', Prefer: prefer || 'return=minimal' }, body: body ? JSON.stringify(body) : undefined });
    if (!r.ok) console.error('Supabase', method, path, r.status, (await r.text()).slice(0, 200));
    return r.ok;
  } catch (e) { console.error('Supabase error', String(e.message || e)); return false; }
};
const EXTRA = ['kind', 'cid', 'fmt', 'plan'];
/* kind/cid/fmt/plan need the 4 new columns; if the SQL has not been applied yet, save the order without them so payments never break */
const insertOrder = async row => {
  const ok = await call('POST', 'orders', row);
  if (ok === false && EXTRA.some(k => k in row)) { const r2 = Object.assign({}, row); EXTRA.forEach(k => delete r2[k]); return call('POST', 'orders', r2); }
  return ok;
};
const updateOrder = (txn, patch) => call('PATCH', 'orders?txn=eq.' + encodeURIComponent(txn), Object.assign({ updated_at: new Date().toISOString() }, patch));
/* ব্রাউজারের পাঠানো access token Supabase-এ যাচাই করে আসল ব্যবহারকারী ফেরত দেয়। ব্রাউজারের পাঠানো কোনো user id বিশ্বাস করা হয় না। */
const verifyUser = async token => {
  if (!token || !ev('SUPABASE_URL')) return null;
  try {
    const r = await fetch(ev('SUPABASE_URL').replace(/\/$/, '') + '/auth/v1/user', { headers: { apikey: ev('SUPABASE_ANON_KEY') || skey(), Authorization: 'Bearer ' + token } });
    if (!r.ok) return null;
    const u = await r.json();
    return u && /^[0-9a-f-]{36}$/i.test(u.id || '') ? { id: u.id, email: u.email || '', name: (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || '' } : null;
  } catch (e) { return null; }
};
module.exports = { on, insertOrder, updateOrder, verifyUser, ev };
