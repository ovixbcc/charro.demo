/* এক্সপোর্ট লাইব্রেরি: Excel (.xlsx) তৈরি, PDF (প্রিন্ট → Save as PDF) ও রিসিট। কোনো বাইরের লাইব্রেরি লাগে না। */
(function () {
  const enc = new TextEncoder();
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /* ---- ZIP (store, কম্প্রেশন ছাড়া) ---- */
  const CT = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CT[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  const zip = files => {
    const parts = [], cen = []; let off = 0;
    const u16 = v => [v & 255, (v >> 8) & 255], u32 = v => [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255];
    files.forEach(f => {
      const nm = enc.encode(f.name), d = typeof f.data === 'string' ? enc.encode(f.data) : f.data, c = crc(d);
      const lh = new Uint8Array([0x50, 0x4b, 3, 4, 20, 0, 0, 8, 0, 0, 0, 0, 0x21, 0, ...u32(c), ...u32(d.length), ...u32(d.length), ...u16(nm.length), 0, 0]);
      parts.push(lh, nm, d);
      cen.push(new Uint8Array([0x50, 0x4b, 1, 2, 20, 0, 20, 0, 0, 8, 0, 0, 0, 0, 0x21, 0, ...u32(c), ...u32(d.length), ...u32(d.length), ...u16(nm.length), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...u32(off)]), nm);
      off += lh.length + nm.length + d.length;
    });
    const cl = cen.reduce((a, x) => a + x.length, 0);
    const end = new Uint8Array([0x50, 0x4b, 5, 6, 0, 0, 0, 0, ...u16(files.length), ...u16(files.length), ...u32(cl), ...u32(off), 0, 0]);
    return new Blob([...parts, ...cen, end], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };
  const col = i => { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };
  const cell = (v, r, c, st) => {
    const ref = col(c) + (r + 1);
    if (typeof v === 'number' && isFinite(v)) return `<c r="${ref}"${st ? ` s="${st}"` : ''}><v>${v}</v></c>`;
    return `<c r="${ref}" t="inlineStr"${st ? ` s="${st}"` : ''}><is><t xml:space="preserve">${esc(String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ''))}</t></is></c>`;
  };
  /* sheets: [{ name, head:[...], rows:[[...]] }] */
  const xlsx = sheets => {
    const sn = (n, i) => (String(n || 'Sheet' + (i + 1)).replace(/[\\/?*\[\]:]/g, ' ').slice(0, 31) || 'Sheet' + (i + 1));
    const files = [
      { name: '[Content_Types].xml', data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>` },
      { name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
      { name: 'xl/workbook.xml', data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s, i) => `<sheet name="${esc(sn(s.name, i))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>` },
      { name: 'xl/_rels/workbook.xml.rels', data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>` },
      { name: 'xl/styles.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF8C52FF"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs></styleSheet>' },
    ];
    sheets.forEach((s, i) => {
      const all = [s.head].concat(s.rows), w = (s.head || []).map((h, c) => Math.min(48, Math.max(String(h).length, ...s.rows.slice(0, 200).map(r => String(r[c] == null ? '' : r[c]).length)) + 2));
      files.push({ name: `xl/worksheets/sheet${i + 1}.xml`, data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${w.map((x, c) => `<col min="${c + 1}" max="${c + 1}" width="${x}" customWidth="1"/>`).join('')}</cols><sheetData>${all.map((r, ri) => `<row r="${ri + 1}">${r.map((v, ci) => cell(v, ri, ci, ri === 0 ? 1 : 0)).join('')}</row>`).join('')}</sheetData></worksheet>` });
    });
    return zip(files);
  };
  const save = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href); }, 1500); };
  /* ---- PDF: প্রিন্ট ডায়ালগে Save as PDF ---- */
  const CSS = 'body{font-family:system-ui,-apple-system,"Segoe UI","Noto Sans Bengali",Arial,sans-serif;color:#1b1530;margin:24px}h1{font-size:20px;margin:0}.br{color:#8C52FF;font-weight:700;font-size:13px;letter-spacing:.3px}.sub{color:#6b6482;font-size:12px;margin:2px 0 14px}table{border-collapse:collapse;width:100%;font-size:11px}th{background:#8C52FF;color:#fff;text-align:left;padding:6px 8px}td{border-bottom:1px solid #e5def5;padding:5px 8px;vertical-align:top}tr:nth-child(even) td{background:#faf8ff}.kv{display:grid;grid-template-columns:170px 1fr;gap:6px 14px;font-size:13px;margin:10px 0}.kv b{color:#6b6482;font-weight:600}.rc{max-width:620px;margin:0 auto;border:2px solid #8C52FF;border-radius:14px;padding:26px}.rc h1{font-size:22px}.amt{font-size:26px;font-weight:800;color:#8C52FF;margin:12px 0}.ft{margin-top:20px;font-size:11px;color:#6b6482}.st{display:inline-block;padding:2px 10px;border-radius:99px;background:#efe8ff;color:#5a2fc2;font-weight:700;font-size:12px}@page{size:A4;margin:12mm}';
  const printHtml = (title, body) => {
    const fr = document.createElement('iframe'); fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden'; document.body.appendChild(fr);
    const d = fr.contentWindow.document; d.open(); d.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>${CSS}</style></head><body>${body}</body></html>`); d.close();
    const go = () => { try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch (e) { /* ignore */ } setTimeout(() => fr.remove(), 60000); };
    if (fr.contentWindow.document.readyState === 'complete') setTimeout(go, 150); else fr.onload = () => setTimeout(go, 150);
  };
  const pdfTable = (title, sub, head, rows) => printHtml(title, `<div class="br">Chaatro.com</div><h1>${esc(title)}</h1><div class="sub">${esc(sub || '')}</div><table><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(v => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
  const pdfKV = (title, sub, pairs, extra) => printHtml(title, `<div class="br">Chaatro.com</div><h1>${esc(title)}</h1><div class="sub">${esc(sub || '')}</div><div class="kv">${pairs.map(p => `<b>${esc(p[0])}</b><span>${esc(p[1] || '—')}</span>`).join('')}</div>${extra || ''}`);
  /* রিসিট: { no, date, name, phone, lines:[[label,value]], amount, status, note } */
  const receipt = r => printHtml('Receipt ' + r.no, `<div class="rc"><div class="br">Chaatro.com · ছাত্র.com</div><h1>${esc(r.heading || 'Payment receipt')}</h1><div class="sub">${esc(r.no)} · ${esc(r.date)}</div><div class="kv">${(r.lines || []).map(p => `<b>${esc(p[0])}</b><span>${esc(p[1] || '—')}</span>`).join('')}</div><div class="amt">${esc(r.amount)}</div><span class="st">${esc(r.status)}</span><div class="ft">${esc(r.note || 'This is a computer-generated receipt and needs no signature.')}</div></div>`);
  window.XL = { xlsx, save, pdfTable, pdfKV, receipt, esc };
})();
