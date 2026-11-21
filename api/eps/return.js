/* EPS এখানে ফেরত পাঠায় (success/fail/cancel); স্ট্যাটাস এই URL-এর ওপর ভরসা না করে সার্ভার থেকে যাচাই হয় (/api/eps/verify) */
module.exports = (req, res) => {
  const q = req.query || {}, txn = String(q.MerchantTransactionId || q.merchantTransactionId || q.merchantTransactionID || '').replace(/[^A-Za-z0-9_-]/g, '');
  res.setHeader('Cache-Control', 'no-store'); res.statusCode = 302; res.setHeader('Location', '/#eps-return' + (txn ? '-' + txn : '')); res.end();
};
