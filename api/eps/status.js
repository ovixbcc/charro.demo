/* অ্যাডমিন প্যানেলের "কানেকশন টেস্ট" — কোনো সিক্রেট ফেরত দেয় না, শুধু কোনটা সেট আছে তা বলে */
const E = require('../_eps');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const c = E.cfg(), miss = E.missing(c), out = { ok: true, mode: c.sandbox ? 'sandbox' : 'live', missing: miss, configured: miss.length === 0, returnUrl: E.origin(req) + '/api/eps/return' };
  if ((req.query || {}).test === '1' && out.configured) { try { await E.getToken(c); out.auth = 'ok'; out.keyMode = c.keyMode; } catch (e) { out.auth = 'failed'; out.error = String(e.message || e); }
    out.diag = { endpoint: E.base(c), username: E.mask(c.user), password_len: c.pass.length, hashkey_len: c.key.length, merchant: E.mask(c.mid), store: E.mask(c.sid) }; }
  res.status(200).json(out);
};
