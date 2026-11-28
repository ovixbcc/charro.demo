/* ব্রাউজারের জন্য পাবলিক Supabase সেটিং (URL + anon key)। anon key পাবলিক; সিক্রেট নয়। */
const ev = n => String(process.env[n] || '').trim().replace(/^["']|["']$/g, '').trim();
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const url = ev('SUPABASE_URL'), key = ev('SUPABASE_ANON_KEY');
  res.status(200).json({ ok: !!(url && key), url: url || null, anonKey: key || null });
};
