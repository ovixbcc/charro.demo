/* Supabase সার্ভার-সাইড হেল্পার (REST). SUPABASE_SERVICE_ROLE_KEY শুধু Vercel Environment Variables-এ থাকে।
   কী না থাকলে চুপচাপ বাদ যায়, যাতে পেমেন্ট ফ্লো না ভাঙে। */
const ev = n => String(process.env[n] || '').trim().replace(/^["']|["']$/g, '').trim();
const on = () => !!(ev('SUPABASE_URL') && ev('SUPABASE_SERVICE_ROLE_KEY'));
const call = async (method, path, body, prefer) => {
  if (!on()) return null;
  try {
    const r = await fetch(ev('SUPABASE_URL').replace(/\/$/, '') + '/rest/v1/' + path, { method, headers: { apikey: ev('SUPABASE_SERVICE_ROLE_KEY'), Authorization: 'Bearer ' + ev('SUPABASE_SERVICE_ROLE_KEY'), 'Content-Type': 'application/json', Prefer: prefer || 'return=minimal' }, body: body ? JSON.stringify(body) : undefined });
    if (!r.ok) console.error('Supabase', method, path, r.status, (await r.text()).slice(0, 200));
    return r.ok;
  } catch (e) { console.error('Supabase error', String(e.message || e)); return false; }
};
const insertOrder = row => call('POST', 'orders', row);
const updateOrder = (txn, patch) => call('PATCH', 'orders?txn=eq.' + encodeURIComponent(txn), Object.assign({ updated_at: new Date().toISOString() }, patch));
module.exports = { on, insertOrder, updateOrder, ev };
