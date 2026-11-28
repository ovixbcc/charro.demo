/* ব্রাউজারের জন্য পাবলিক Supabase সেটিং (URL + anon key)। anon key পাবলিক; সিক্রেট নয়। */
const ev = n => String(process.env[n] || '').trim().replace(/^["']|["']$/g, '').trim();
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const url = ev('SUPABASE_URL'), key = ev('SUPABASE_ANON_KEY');
  const prod = ev('VERCEL_ENV') === 'production', sandbox = ev('EPS_SANDBOX').toLowerCase() === 'true';
  /* payBlocked: the live site must never take (or count) sandbox payments */
  res.status(200).json({ ok: !!(url && key), url: url || null, anonKey: key || null, env: ev('VERCEL_ENV') || 'unknown', payBlocked: prod && sandbox });
};
