/* EPS returns here (success/fail/cancel). The URL is NOT trusted: the status is re-checked with EPS on the server and saved on the order,
   so the order becomes SUCCESS even if the student closes the browser right after paying. */
const E = require('../_eps');
const SB = require('../_sb');
module.exports = async (req, res) => {
  const q = req.query || {}, txn = String(q.MerchantTransactionId || q.merchantTransactionId || q.merchantTransactionID || '').replace(/[^A-Za-z0-9_-]/g, '');
  if (txn) { try { const c = E.cfg(); if (!E.missing(c).length) { const d = await E.check(c, await E.getToken(c), txn); await SB.updateOrder(txn, { status: E.statusOf(d) }); } } catch (e) { console.error('EPS return check failed', String(e.message || e)); } }
  res.setHeader('Cache-Control', 'no-store'); res.statusCode = 302; res.setHeader('Location', '/#eps-return' + (txn ? '-' + txn : '')); res.end();
};
