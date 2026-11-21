/* EPS (Easy Payment System) সার্ভার-সাইড হেল্পার — অফিশিয়াল EPS-PG/EPS_PHP স্যাম্পলের ফ্লো অনুযায়ী
   কী/পাসওয়ার্ড শুধু Vercel Environment Variables-এ থাকে; ব্রাউজারে কখনও যায় না */
const crypto = require('crypto');
/* Vercel-এ কপি-পেস্টের সময় আসা বাড়তি স্পেস, নতুন লাইন বা কোটেশন মুছে ফেলে */
const ev = n => String(process.env[n] || '').trim().replace(/^["']|["']$/g, '').trim();
const cfg = () => ({
  user: ev('EPS_USERNAME'), pass: ev('EPS_PASSWORD'), key: ev('EPS_HASH_KEY'),
  mid: ev('EPS_MERCHANT_ID'), sid: ev('EPS_STORE_ID'),
  sandbox: String(process.env.EPS_SANDBOX || '').toLowerCase() === 'true',
});
const missing = c => [['EPS_USERNAME', c.user], ['EPS_PASSWORD', c.pass], ['EPS_HASH_KEY', c.key], ['EPS_MERCHANT_ID', c.mid], ['EPS_STORE_ID', c.sid]].filter(x => !x[1]).map(x => x[0]);
const base = c => (c.sandbox ? 'https://sandboxpgapi.eps.com.bd/v1' : 'https://pgapi.eps.com.bd/v1');
/* HMAC-SHA512 (hash key UTF-8) → Base64 */
const hash = (value, key, kb) => crypto.createHmac('sha512', kb || Buffer.from(key, 'utf8')).update(String(value), 'utf8').digest('base64');
const hh = (c, v) => hash(v, c.key, c.kb);
const j = async r => { const t = await r.text(); try { return JSON.parse(t); } catch (e) { return { raw: t.slice(0, 300) }; } };
/* EPS ডকুমেন্টেশন: হ্যাশ কী UTF-8 ধরে HMAC-SHA512। কিছু অ্যাকাউন্টে কী Base64 ডিকোড করে লাগতে পারে, তাই ব্যর্থ হলে সেটাও চেষ্টা করি */
async function getToken(c) {
  const variants = [['utf8', Buffer.from(c.key, 'utf8')]]; try { const b = Buffer.from(c.key, 'base64'); if (b.length) variants.push(['base64', b]); } catch (e) {}
  let last = '';
  for (const [name, kb] of variants) {
    const r = await fetch(base(c) + '/Auth/GetToken', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-hash': hash(c.user, c.key, kb) }, body: JSON.stringify({ userName: c.user, password: c.pass }) });
    const d = await j(r);
    if (d.token) { c.kb = kb; c.keyMode = name; return d.token; }
    last = [d.errorCode || d.ErrorCode, d.errorMessage || d.ErrorMessage || d.message || d.raw].filter(Boolean).join(' · ') + ' [HTTP ' + r.status + ']';
  }
  const e = new Error('EPS token failed' + (last ? ': ' + last : '')); e.detail = last; throw e;
}
async function initialize(c, token, txn, body) {
  const r = await fetch(base(c) + '/EPSEngine/InitializeEPS', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-hash': hh(c, txn), Authorization: 'Bearer ' + token }, body: JSON.stringify(body) });
  return j(r);
}
async function check(c, token, txn) {
  const r = await fetch(base(c) + '/EPSEngine/CheckMerchantTransactionStatus?merchantTransactionId=' + encodeURIComponent(txn), { headers: { 'x-hash': hh(c, txn), Authorization: 'Bearer ' + token } });
  return j(r);
}
const pick = (o, ks) => { for (const k of ks) { if (o && o[k] != null && o[k] !== '') return o[k]; } return undefined; };
/* EPS-এর উত্তর থেকে স্ট্যাটাস: SUCCESS / FAILED / CANCEL / UNKNOWN */
const norm = v => { const s = String(v || '').toUpperCase(); return s === 'SUCCESS' || s === 'COMPLETED' ? 'SUCCESS' : s === 'FAILED' || s === 'FAILURE' ? 'FAILED' : s === 'CANCEL' || s === 'CANCELED' || s === 'CANCELLED' ? 'CANCEL' : s === 'PENDING' ? 'PENDING' : 'UNKNOWN'; };
const statusOf = d => { const x = (d && d.data) || d || {}; return norm(pick(d, ['transactionStatus', 'TransactionStatus', 'Status', 'status']) || pick(x, ['transactionStatus', 'TransactionStatus', 'Status', 'status'])); };
const amountOf = d => { const x = (d && d.data) || d || {}; const v = pick(d, ['totalAmount', 'TotalAmount']) ?? pick(x, ['totalAmount', 'TotalAmount']); return v == null ? null : Number(v); };
const origin = req => { const h = req.headers['x-forwarded-host'] || req.headers.host, p = (req.headers['x-forwarded-proto'] || 'https').split(',')[0]; return p + '://' + h; };
const mask = v => (v ? (v.length <= 4 ? '*'.repeat(v.length) : v.slice(0, 2) + '…' + v.slice(-3)) + ' (' + v.length + ')' : '—');
module.exports = { cfg, missing, mask, base, hash, getToken, initialize, check, statusOf, amountOf, origin };
