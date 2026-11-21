/* স্টেজিং চিহ্ন: শুধু chaatro.com-এর বাইরের (vercel.app / staging.*) ঠিকানায় দেখায়; লাইভ সাইটে কিছুই দেখায় না */
(function () {
  var h = location.hostname;
  if (!(/\.vercel\.app$/.test(h) || /^staging\./.test(h))) return;
  var m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex,nofollow'; document.head.appendChild(m);
  var b = document.createElement('div');
  b.textContent = 'STAGING — টেস্ট সাইট, এটা লাইভ নয়';
  b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#f59e0b;color:#111;font:600 12px/1.6 system-ui,sans-serif;text-align:center;padding:2px 8px;pointer-events:none';
  (document.body ? Promise.resolve() : new Promise(function (r) { addEventListener('DOMContentLoaded', r); })).then(function () { document.body.appendChild(b); });
})();
