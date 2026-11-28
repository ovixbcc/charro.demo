const E = require('../_eps');
const SB = require('../_sb');
const P = require('../_price');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'Method not allowed' }); return; }
  const c = E.cfg(), miss = E.missing(c);
  if (miss.length) { res.status(503).json({ ok: false, code: 'NOT_CONFIGURED', error: 'EPS is not configured on the server. Missing: ' + miss.join(', ') }); return; }
  let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } } b = b || {};
  const phone = String(b.phone || '').replace(/\D/g, '').replace(/^88/, '');
  if (!/^01\d{9}$/.test(phone)) { res.status(400).json({ ok: false, error: 'Enter a valid mobile number (01XXXXXXXXX)' }); return; }
  /* লগইন করা থাকলে Authorization: Bearer <token>। token সার্ভারে যাচাই হয়; না থাকলে গেস্ট (user_id NULL)। */
  const m = /^Bearer\s+(.+)$/i.exec(String(req.headers.authorization || '')); let user = null;
  if (m && SB.on()) { user = await SB.verifyUser(m[1].trim()); if (!user) { res.status(401).json({ ok: false, code: 'AUTH_INVALID', error: 'Your login session has expired. Please log in again.' }); return; } }
  let pr; try { pr = P.price(b); } catch (e) { res.status(e.status || 400).json({ ok: false, code: e.code, error: e.message }); return; }
  const amount = Math.round(pr.amount * 100) / 100;
  if (!(amount > 0) || amount > 500000) { res.status(400).json({ ok: false, error: 'Invalid amount' }); return; }
  const name = String(b.name || (user && user.name) || '').trim().slice(0, 80); if (!name) { res.status(400).json({ ok: false, error: 'Name is required' }); return; }
  const txn = 'TXN' + Date.now() + Math.floor(100 + Math.random() * 900), o = E.origin(req);
  try {
    const token = await E.getToken(c);
    const d = await E.initialize(c, token, txn, {
      merchantId: c.mid, storeId: c.sid, CustomerOrderId: String(b.orderId || 'CHT-' + txn.slice(-6)).slice(0, 40), merchantTransactionId: txn, transactionTypeId: 1, totalAmount: amount,
      successUrl: o + '/api/eps/return', failUrl: o + '/api/eps/return', cancelUrl: o + '/api/eps/return',
      customerName: name, customerEmail: String(b.email || (user && user.email) || '').trim() || 'customer@chaatro.com', customerAddress: String(b.address || 'Dhaka').slice(0, 120), customerCity: 'Dhaka', customerState: 'Dhaka', customerPostcode: '1200', customerCountry: 'BD', customerPhone: phone,
      productName: String(b.product || 'Chaatro course').slice(0, 100), productProfile: 'general', productCategory: 'Education',
    });
    const url = d.RedirectURL || d.redirectURL || d.redirectUrl;
    if (!url) {
      const det = [d.ErrorCode || d.errorCode, d.ErrorMessage || d.errorMessage || d.message || d.title, d.raw].filter(Boolean).join(' · ') || JSON.stringify(d).slice(0, 300);
      console.error('EPS init failed', JSON.stringify(d).slice(0, 500));
      res.status(502).json({ ok: false, error: 'EPS could not start the payment: ' + det, detail: d }); return;
    }
    await SB.insertOrder({ order_id: String(b.orderId || '').slice(0, 40) || txn, txn, customer_name: name, customer_phone: phone, user_id: user ? user.id : null, customer_email: String(b.email || (user && user.email) || '').trim() || null, product: (String(b.product || '').slice(0, 90) + (pr.unverified ? ' [price not verified]' : '')).slice(0, 100), amount, sandbox: c.sandbox, status: 'PENDING' });
    res.status(200).json({ ok: true, txn, redirectUrl: url });
  } catch (e) { res.status(502).json({ ok: false, error: String(e.message || e) }); }
};
