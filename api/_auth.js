/* Server-side roles. The role is ALWAYS read from the database (profiles.role) for the user behind a verified token.
   Nothing the browser sends about roles is trusted. Roles are changed only by the owner in the Supabase dashboard (see supabase/phase1-roles.sql). */
const SB = require('./_sb');
const ROLES = ['student', 'teacher', 'admin', 'institution'];
const LEVELS = ['super', 'accounts', 'academic', 'dev'];

const bearer = req => { const m = /^Bearer\s+(\S+)/.exec(String((req.headers && req.headers.authorization) || '')); return m ? m[1] : ''; };

/* -> { user, role, level, ok:true } | { ok:false, status, code }.  A user without a profile row (or an unknown value) is a plain student: least privilege. */
async function identify(req) {
  const tk = bearer(req); if (!tk) return { ok: false, status: 401, code: 'AUTH_REQUIRED' };
  const user = await SB.verifyUser(tk); if (!user) return { ok: false, status: 401, code: 'AUTH_INVALID' };
  const rows = await SB.rest('profiles?id=eq.' + encodeURIComponent(user.id) + '&select=role,admin_level');
  if (rows === null) return { ok: false, status: 503, code: 'ROLE_LOOKUP_FAILED' };   /* never guess a higher role when the lookup fails */
  const p = Array.isArray(rows) && rows[0] ? rows[0] : {};
  const role = ROLES.includes(p.role) ? p.role : 'student';
  const level = role === 'admin' && LEVELS.includes(p.admin_level) ? p.admin_level : null;
  return { ok: true, user, role, level };
}

/* Use at the top of any endpoint that changes or reveals protected data:
     const who = await requireRole(req, res, ['admin']); if (!who) return;
   Optional `levels` further limits admins (e.g. ['super','accounts']).  Sends the error response itself and returns null. */
async function requireRole(req, res, roles, levels) {
  const w = await identify(req);
  if (!w.ok) { res.status(w.status).json({ ok: false, code: w.code }); return null; }
  if (!roles.includes(w.role) || (levels && w.role === 'admin' && !levels.includes(w.level))) { res.status(403).json({ ok: false, code: 'FORBIDDEN' }); return null; }
  return w;
}
module.exports = { identify, requireRole, ROLES, LEVELS };
