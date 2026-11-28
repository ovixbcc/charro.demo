/* GET /api/me  (Authorization: Bearer <access token>)  ->  { ok, id, email, role, level }
   The browser uses this only to decide which portal to open; every protected API re-checks the role itself (api/_auth.js). */
const { identify } = require('./_auth');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ ok: false, code: 'METHOD' });
  const w = await identify(req);
  if (!w.ok) return res.status(w.status).json({ ok: false, code: w.code });
  res.status(200).json({ ok: true, id: w.user.id, email: w.user.email, role: w.role, level: w.level });
};
