const E = require('../_eps');
const SB = require('../_sb');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const txn = String((req.query || {}).txn || '').replace(/[^A-Za-z0-9_-]/g, ''); if (!txn) { res.status(400).json({ ok: false, error: 'Missing transaction id' }); return; }
  const c = E.cfg(), miss = E.missing(c); if (miss.length) { res.status(503).json({ ok: false, error: 'EPS is not configured' }); return; }
  try { const token = await E.getToken(c), d = await E.check(c, token, txn); await SB.updateOrder(txn, { status: E.statusOf(d) }); res.status(200).json({ ok: true, txn, status: E.statusOf(d), amount: E.amountOf(d) }); }
  catch (e) { res.status(502).json({ ok: false, error: String(e.message || e) }); }
};
