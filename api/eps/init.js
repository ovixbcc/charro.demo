const E = require('../_eps');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'Method not allowed' }); return; }
  const c = E.cfg(), miss = E.missing(c);
  if (miss.length) { res.status(503).json({ ok: false, code: 'NOT_CONFIGURED', error: 'EPS is not configured on the server. Missing: ' + miss.join(', ') }); return; }
  let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } } b = b || {};
  const amount = Math.round(Number(b.amount) * 100) / 100, phone = String(b.phone || '').replace(/\D/g, '').replace(/^88/, '');
  if (!(amount > 0) || amount > 500000) { res.status(400).json({ ok: false, error: 'Invalid amount' }); return; }
  if (!/^01\d{9}$/.test(phone)) { res.status(400).json({ ok: false, error: 'Enter a valid mobile number (01XXXXXXXXX)' }); return; }
  const name = String(b.name || '').trim().slice(0, 80); if (!name) { res.status(400).json({ ok: false, error: 'Name is required' }); return; }
  const txn = String(Date.now()) + String(Math.floor(100 + Math.random() * 900)), o = E.origin(req);
  try {
    const token = await E.getToken(c);
    const d = await E.initialize(c, token, txn, {
      merchantId: c.mid, storeId: c.sid, CustomerOrderId: String(b.orderId || 'CHT-' + txn.slice(-6)).slice(0, 40), merchantTransactionId: txn, transactionTypeId: 1, totalAmount: amount,
      successUrl: o + '/api/eps/return', failUrl: o + '/api/eps/return', cancelUrl: o + '/api/eps/return',
      customerName: name, customerEmail: String(b.email || '').trim() || 'customer@chaatro.com', customerAddress: String(b.address || 'Dhaka').slice(0, 120), customerCity: 'Dhaka', customerState: 'Dhaka', customerPostcode: '1200', customerCountry: 'BD', customerPhone: phone,
      productName: String(b.product || 'Chaatro course').slice(0, 100), productProfile: 'general', productCategory: 'Education',
    });
    const url = d.RedirectURL || d.redirectURL || d.redirectUrl;
    if (!url) { res.status(502).json({ ok: false, error: 'EPS could not start the payment' + (d.ErrorMessage || d.errorMessage ? ': ' + (d.ErrorMessage || d.errorMessage) : '') }); return; }
    res.status(200).json({ ok: true, txn, redirectUrl: url });
  } catch (e) { res.status(502).json({ ok: false, error: String(e.message || e) }); }
};
