/* POST /api/forms  — saves the public forms (teacher application, contact, institution application).
   Body: { type: 'teacher'|'contact'|'institution', data: {...}, files: [{key,name,size,type}] }
   Returns { ok:true, ref, uploads:[{key,url}] } only after the row is really saved; otherwise { ok:false, error }.
   Needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (already set for payments) and supabase/forms.sql applied. */
const SB = require('./_sb');
const BUCKET = 'form-files';
const MAXB = 5 * 1048576;
const PHONE = /^(?:\+?88)?01[3-9]\d{8}$/, EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FILE_RULES = {
  teacher: { cv: /\.(pdf|docx?)$/i, idDoc: /\.(pdf|jpe?g|png)$/i, certs: /\.(pdf|jpe?g|png)$/i, photo: /\.(jpe?g|png)$/i },
  institution: { logo: /\.(jpe?g|png)$/i },
  contact: {},
};
const MIME = { pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };
const str = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n);
const list = (v, n, m) => (Array.isArray(v) ? v : []).slice(0, m).map(x => str(x, n)).filter(Boolean);
const code = p => p + String(10000 + Math.floor(Math.random() * 89999));
const bad = (res, status, error) => res.status(status).json({ ok: false, error });

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return bad(res, 405, 'METHOD');
  if (!SB.on()) return bad(res, 503, 'NOT_CONFIGURED');
  let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = null; } }
  if (!b || typeof b !== 'object') return bad(res, 400, 'BAD_BODY');
  const type = b.type, d = b.data && typeof b.data === 'object' ? b.data : {};
  if (!FILE_RULES[type]) return bad(res, 400, 'BAD_TYPE');
  if (d.website) return res.status(200).json({ ok: true, ref: 'CHT-X-00000', uploads: [] }); /* honeypot: bots fill the hidden field; pretend success, save nothing */

  /* optional login: attach user id only if the token verifies (never trust an id from the browser) */
  const auth = String(req.headers.authorization || ''); const u = /^Bearer\s+\S+/.test(auth) ? await SB.verifyUser(auth.replace(/^Bearer\s+/, '')) : null;
  const uid = u ? u.id : null;

  let row, table, ref = null;
  if (type === 'contact') {
    row = { name: str(d.name, 120), phone: str(d.phone, 20), topic: str(d.topic, 20), message: str(d.message, 3000), user_id: uid };
    if (row.name.length < 2 || !PHONE.test(row.phone.replace(/[\s-]/g, '')) || row.message.length < 3) return bad(res, 400, 'INVALID');
    table = 'contact_messages';
  } else if (type === 'teacher') {
    ref = code('CHT-T-');
    const exp = d.experience_years === '' || d.experience_years == null ? null : Number(d.experience_years);
    row = { ref, full_name: str(d.fullName, 120), phone: str(d.phone, 20), email: str(d.email, 160), district: str(d.district, 60), institution: str(d.institution, 160), dept: str(d.dept, 120), status: str(d.status, 20), year: str(d.year, 40),
      subjects: list(d.subjects, 40, 30), programs: list(d.programs, 40, 30), formats: list(d.formats, 40, 10), experience_years: exp != null && isFinite(exp) && exp >= 0 && exp <= 60 ? exp : null,
      video_url: str(d.video, 300), bio: str(d.bio, 3000), referral: str(d.referral, 40), user_id: uid };
    if (row.full_name.length < 3 || !PHONE.test(row.phone.replace(/[\s-]/g, '')) || !EMAIL.test(row.email) || !row.subjects.length || row.bio.length < 30) return bad(res, 400, 'INVALID');
    if (row.video_url && !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(row.video_url)) return bad(res, 400, 'INVALID');
    table = 'teacher_applications';
  } else {
    ref = code('CHT-I-');
    const est = parseInt(d.est, 10);
    row = { ref, name: str(d.name, 160), type: str(d.type, 20), est_students: isFinite(est) && est >= 0 && est < 1e6 ? est : null, address: str(d.address, 300), contact_person: str(d.contact, 120), designation: str(d.desig, 80), phone: str(d.phone, 20), email: str(d.email, 160), requirements: str(d.msg, 3000), user_id: uid };
    if (row.name.length < 3 || !row.address || !row.contact_person || !PHONE.test(row.phone.replace(/[\s-]/g, '')) || !EMAIL.test(row.email)) return bad(res, 400, 'INVALID');
    table = 'institution_applications';
  }

  /* files: validate names/sizes/types, build storage paths (server-chosen; client names are only stored as labels) */
  const rules = FILE_RULES[type], files = [], uploads = [];
  const fin = (Array.isArray(b.files) ? b.files : []).slice(0, 8);
  const folder = (type === 'teacher' ? 'teacher/' : 'inst/') + (ref || 'x') + '/';
  for (const f of fin) {
    const key = str(f && f.key, 12), name = str(f && f.name, 120), size = Number(f && f.size), ext = (name.split('.').pop() || '').toLowerCase();
    if (!rules[key] || !rules[key].test(name) || !(size > 0 && size <= MAXB) || !MIME[ext]) return bad(res, 400, 'BAD_FILE');
    files.push({ key, name, size, path: folder + key + '-' + files.length + '.' + ext, mime: MIME[ext] });
  }
  if (type !== 'contact') row.files = files.map(f => ({ key: f.key, path: f.path, name: f.name, size: f.size }));

  const ok = await SB.insertRow(table, row);
  if (ok !== true) return bad(res, 503, 'SAVE_FAILED');
  for (const f of files) {
    const url = await SB.signUpload(BUCKET, f.path);
    uploads.push({ key: f.key, url: url || '', mime: f.mime });
  }
  res.status(200).json({ ok: true, ref, uploads });
};
