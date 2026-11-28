/* সার্ভার-সাইড দাম হিসাব। ব্রাউজারের পাঠানো amount বিশ্বাস করা হয় না।
   js/data.js (কোর্স, বান্ডেল, কুপন, দামের ফাংশন) একবার লোড করে এখানে একই নিয়মে দাম বের করা হয়। */
const fs = require('fs'), path = require('path'), vm = require('vm');
let cat = null;
const catalog = () => {
  if (cat) return cat;
  const src = fs.readFileSync(path.join(process.cwd(), 'js', 'data.js'), 'utf8');
  cat = vm.runInContext(src + '\n;({ COURSES, BUNDLES, COUPONS, pricingFor, planTotal, bundleCalc })', vm.createContext({}), { timeout: 2000 });
  return cat;
};
const planOptions = (C, c, fmt) => {
  if (c.plans && c.plans[fmt]) return c.plans[fmt];
  const p = C.pricingFor(c)[fmt];
  return [{ key: 'full', m: 0, actual: p.fullA, disc: p.fullD }, { key: 'month', m: 1, actual: p.perA, disc: p.perD }];
};
const firstOf = o => (o.m === 0 ? o.disc : (o.first != null ? o.first : o.disc));
const cut = (cp, base) => (cp ? (cp.type === 'pct' ? Math.round(base * cp.v / 100) : Math.min(cp.v, base)) : 0);
const bad = (error, code) => Object.assign(new Error(error), { status: 400, code });

/* b = অনুরোধের body. ফেরত: { amount, product } অথবা error ছোঁড়ে */
const price = b => {
  let C; try { C = catalog(); } catch (e) { throw Object.assign(new Error('Price catalog is unavailable'), { status: 503, code: 'NO_CATALOG' }); }
  const kind = String(b.kind || '');
  if (kind === 'course') {
    const c = C.COURSES.find(x => x.id === String(b.cid || '')); if (!c) throw bad('Unknown course');
    const fmt = c.formats.includes(b.fmt) ? b.fmt : null; if (!fmt) throw bad('Unknown class format');
    const opts = planOptions(C, c, fmt), o = opts.find(x => x.key === b.plan) || opts[0];
    const tt = C.planTotal(c, o), cp = C.COUPONS[String(b.code || '')], ok = cp && cp.active !== false && (!cp.scope || cp.scope === c.id || cp.scope === 't:' + c.teacher || cp.scope === c.id.split('-')[0]);
    const cu = ok ? cut(cp, tt.d) : 0, f = firstOf(o);
    return { amount: Math.max(0, f - Math.round(cu * f / Math.max(1, tt.d))), course: c };
  }
  if (kind === 'sub') {
    const c = C.COURSES.find(x => x.id === String(b.cid || '')); if (!c) throw bad('Unknown course');
    const fmt = c.formats.includes(b.fmt) ? b.fmt : c.formats[0], opts = planOptions(C, c, fmt), o = opts.find(x => x.key === b.plan) || opts[0];
    return { amount: o.disc, course: c };
  }
  if (kind === 'bundle') {
    const bd = C.BUNDLES.find(x => x.id === String(b.bid || '')); if (!bd || !bd.active) throw bad('Unknown bundle');
    const k = C.bundleCalc(bd), cp = C.COUPONS[String(b.code || '')], ok = cp && cp.active !== false && (cp.scope === 'bundles' || cp.scope === 'b:' + bd.id);
    return { amount: k.price - (ok ? cut(cp, k.price) : 0), bundle: bd };
  }
  if (kind === 'p2p') {
    /* P2P-র দাম টিচারের সঙ্গে ঠিক হয় এবং এখনো শুধু ব্রাউজারে থাকে (ডাটাবেসে নেই), তাই সার্ভার যাচাই করতে পারে না — শুধু সীমা বসানো হয়। */
    const a = Math.round(Number(b.amount) * 100) / 100; if (!(a >= 100 && a <= 100000)) throw bad('Invalid amount');
    return { amount: a, unverified: true };
  }
  throw bad('Unknown order type');
};
module.exports = { price };
