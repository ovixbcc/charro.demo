/* থাম্বনেল আপলোড ও ইউটিউব ভিডিও লিংক: প্রোগ্রাম, কোর্স ও টিচার প্রোফাইলে ব্যবহৃত হয় */
(function () {
  const PX = window.PX, { T, esc } = PX, CHG = PX.CHG;
  const MAX = 1.5 * 1048576;
  /* থাম্বনেল ফিল্ড: ছবি বেছে নিলে লুকানো ইনপুটে সংরক্ষিত হয় (ডেমোতে ব্রাউজারের মেমরিতে) */
  PX.thumbField = (cur, label) => `<div class="fld full"><label>${label || T('থাম্বনেল ছবি', 'Thumbnail image')}</label>
    <div class="thf"><div class="thf-prev" data-thp>${cur ? `<img src="${cur}" alt="">` : T('১৬:৯ ছবি', '16:9 image')}</div>
      <div><label class="btn btn-o btn-sm upl">${PX.ic('upload')} ${T('ছবি বাছুন', 'Choose image')}<input type="file" accept="image/png,image/jpeg,image/webp" data-pc="thumbpick" hidden></label>
        ${cur ? ` <button type="button" class="btn btn-o btn-sm" data-pa="thumbclear">${T('সরান', 'Remove')}</button>` : ''}
        <small class="soft" style="display:block">${T('JPG/PNG/WebP, সর্বোচ্চ ১.৫ এমবি', 'JPG/PNG/WebP, max 1.5 MB')}</small><small class="err" data-the role="alert"></small>
        <input type="hidden" name="thumb" value="${cur ? esc(cur) : ''}"></div></div></div>`;
  CHG.thumbpick = el => {
    const f = el.files[0], box = el.closest('.thf'), er = box.querySelector('[data-the]'); if (!f) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(f.type) || f.size > MAX) { el.value = ''; er.textContent = T('১.৫ এমবির মধ্যে JPG/PNG/WebP ছবি দিন', 'Choose a JPG/PNG/WebP under 1.5 MB'); return; }
    er.textContent = '';
    const r = new FileReader();
    r.onload = () => { box.querySelector('input[name=thumb]').value = r.result; box.querySelector('[data-thp]').innerHTML = `<img src="${r.result}" alt="">`; };
    r.readAsDataURL(f);
  };
  PX.ACT.thumbclear = a => { const box = a.closest('.thf'); box.querySelector('input[name=thumb]').value = ''; box.querySelector('[data-thp]').textContent = T('১৬:৯ ছবি', '16:9 image'); a.remove(); };
  /* ইউটিউব লিংক ফিল্ড ও লাইভ প্রিভিউ */
  PX.ytField = (cur, label, name) => `<div class="fld full"><label>${label || T('ইউটিউব ভিডিও লিংক', 'YouTube video link')}</label>
    <input name="${name || 'video'}" value="${esc(cur || '')}" placeholder="https://www.youtube.com/watch?v=…" data-pi="ytprev" inputmode="url" autocomplete="off">
    <small class="soft">${T('ইউটিউব লিংক পেস্ট করুন; ভিডিওটি সাইটে প্লে হবে', 'Paste a YouTube link; the video will play on the site')}</small><small class="err" data-yte role="alert"></small>
    <div class="ytp" data-ytp>${CH_player(cur)}</div></div>`;
  const CH_player = u => (window.CH && CH.ytId(u) ? CH.player(u, '', '') : '');
  CHG.ytprev = el => { const box = el.closest('.fld'), v = el.value.trim(); box.querySelector('[data-ytp]').innerHTML = CH_player(v); box.querySelector('[data-yte]').textContent = !v || CH.ytId(v) ? '' : T('সঠিক ইউটিউব লিংক দিন', 'Enter a valid YouTube link'); };
  /* সাবমিটের সময় যাচাই: ফাঁকা হলে ঠিক আছে */
  PX.ytCheck = v => (!(v || '').trim() || CH.ytId(v)) ? '' : T('সঠিক ইউটিউব লিংক দিন (youtube.com বা youtu.be)', 'Enter a valid YouTube link (youtube.com or youtu.be)');
})();
