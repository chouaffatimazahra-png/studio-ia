/* =========================================================
   لوحة التحكم — STUDIO·IA
   - تبان غير لصاحبة الموقع (Owner) على claude.ai
   - محليا (localhost): زيدي ?admin=1 فالرابط باش تجربيها
   - الحفظ: الموقع يعاود ينشر روحو بالمعلومات الجديدة (كل الناس يشوفو الجديد)
   ========================================================= */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const hasClaude = !!(window.claude && window.claude.use);

  let artifact = null, assets = null, user = null;
  let D = null;            // données en cours d'édition (copie complète)
  let dirty = false;
  let tab = "models";

  const CATS = () => CATEGORIES.map((c) => ({ id: c.id, label: (I18N.ar["cat." + c.id] || c.label) }));
  const LOC_TYPES = [["studio", "استوديو"], ["interieur", "ديكور داخلي"], ["produit", "للمنتجات"], ["exterieur", "برا"]];
  const QUALITIES = [["", "—"], ["standard", "Standard"], ["pro", "Pro"], ["ultra", "Ultra"]];
  const VIEWS = [["all", "الكل مع بعض"], ["category", "حسب الكاتيغوري"], ["quality", "حسب الكاليتي"], ["type", "صور وحدهم / فيديوهات وحدهم"]];

  /* ---------- démarrage : qui est-ce ? ---------- */
  async function boot() {
    if (hasClaude) {
      [artifact, assets, user] = await Promise.all([
        window.claude.use("artifact").catch(() => null),
        window.claude.use("assets").catch(() => null),
        window.claude.use("user").catch(() => null),
      ]);
      const owner = user ? ((await user.isOwner().catch(() => false)) || (await user.canEdit().catch(() => false))) : false;
      if (owner && artifact) showButton();
    } else if (isLocal && new URLSearchParams(location.search).has("admin")) {
      showButton();
    }
  }

  function showButton() {
    const b = document.createElement("button");
    b.id = "adminBtn"; b.type = "button"; b.textContent = "⚙️ لوحة التحكم";
    b.addEventListener("click", open);
    document.body.appendChild(b);
  }

  /* ---------- ouvrir / fermer ---------- */
  function open() {
    D = JSON.parse(JSON.stringify(window.SITE_FULL));
    dirty = false;
    let p = $("#adminPanel");
    if (!p) {
      p = document.createElement("div");
      p.id = "adminPanel"; p.dir = "rtl"; p.lang = "ar";
      document.body.appendChild(p);
      p.addEventListener("click", onClick);
      p.addEventListener("input", onInput);
      p.addEventListener("change", onChange);
    }
    p.hidden = false;
    document.documentElement.classList.add("admin-open");
    render();
  }
  function close() {
    $("#adminPanel").hidden = true;
    document.documentElement.classList.remove("admin-open");
  }

  /* ---------- rendu ---------- */
  const thumb = (it) => {
    const src = it.face || it.img || (it.sheet || "");
    if (it.video && !it.img) return `<video class="a-thumb" src="${esc(it.video)}" muted preload="metadata"></video>`;
    if (!src) return `<span class="a-thumb a-empty">؟</span>`;
    if (it.sheet && !it.face) {
      const n = it.frames || 1;
      return `<span class="a-thumb" style="background:url('${esc(src)}') 0 0 / ${n * 100}% 100% no-repeat"></span>`;
    }
    return `<img class="a-thumb" src="${esc(src)}" alt="" loading="lazy">`;
  };
  const opts = (list, cur) => list.map(([v, l]) => `<option value="${esc(v)}" ${v === cur ? "selected" : ""}>${esc(l)}</option>`).join("");
  const rowBtns = (kind, i, it) => `
    <div class="a-acts">
      <button data-act="up" data-kind="${kind}" data-i="${i}" title="طلّعها">▲</button>
      <button data-act="down" data-kind="${kind}" data-i="${i}" title="هبّطها">▼</button>
      <button data-act="hide" data-kind="${kind}" data-i="${i}" class="${it.hidden ? "on" : ""}" title="خبّيها / ورّيها">${it.hidden ? "🙈 مخبية" : "👁️ ظاهرة"}</button>
      <button data-act="media" data-kind="${kind}" data-i="${i}" title="بدّلي الصورة ولا الفيديو">🖼️ بدّلي</button>
      <button data-act="del" data-kind="${kind}" data-i="${i}" class="danger">🗑️</button>
    </div>`;

  function render() {
    const p = $("#adminPanel");
    const tabs = [["models", "🧍 المانكانات"], ["locs", "📍 الأماكن"], ["port", "🖼️ البورتفوليو"], ["shop", "💰 الأسعار والتواصل"]];
    p.innerHTML = `
      <div class="a-top">
        <strong>لوحة التحكم</strong>
        <span class="a-status" id="aStatus">${dirty ? "فيه تبديلات ما تحفظوش" : "كلش محفوظ"}</span>
        <button data-act="save" class="a-save" ${dirty ? "" : "disabled"}>💾 احفظي وانشري</button>
        <button data-act="close" class="a-close">✕</button>
      </div>
      <nav class="a-tabs">${tabs.map(([k, l]) => `<button data-act="tab" data-tab="${k}" class="${tab === k ? "on" : ""}">${l}</button>`).join("")}</nav>
      <div class="a-body">${tab === "models" ? models() : tab === "locs" ? locs() : tab === "port" ? port() : shop()}</div>
      <input type="file" id="aFile" hidden accept="image/*,video/*">`;
  }

  function models() {
    const bySize = (c) => D.models.map((m, i) => [m, i]).filter(([m]) => m.cat === c);
    return `
      <div class="a-add">
        <h3>➕ زيدي مانكان</h3>
        <p>صورة وحدة (من قدام) ولا صورة فيها بزاف وجهات جنب بعض (باش تدور 360°). الأحسن تكون <b>بلا خلفية (PNG)</b>.</p>
        <div class="a-grid">
          <label>الاسم<input id="nmName" placeholder="مثلا: Sara"></label>
          <label>الفئة<select id="nmCat">${opts(CATS().map((c) => [c.id, c.label]), "femmes")}</select></label>
          <label>المقاس<select id="nmSize">${opts(SIZES.map((s) => [s, s]), "M")}</select></label>
          <label>شحال من وجهة فالصورة<select id="nmFrames">${opts([["1", "1 (صورة عادية)"], ["2", "2"], ["3", "3"], ["4", "4"]], "1")}</select></label>
        </div>
        <button data-act="pick" data-target="newModel" class="a-primary">📤 اختاري الصورة وزيديها</button>
      </div>
      ${CATS().map((c) => {
        const rows = bySize(c.id);
        return `<details class="a-group" ${c.id === "femmes" ? "open" : ""}><summary>${esc(c.label)} <small>${rows.length}</small></summary>
          ${rows.map(([m, i]) => `
            <div class="a-row ${m.hidden ? "is-hidden" : ""}">
              ${thumb(m)}
              <div class="a-fields">
                <input data-kind="models" data-i="${i}" data-f="name" value="${esc(m.name)}" aria-label="الاسم">
                <select data-kind="models" data-i="${i}" data-f="cat" aria-label="الفئة">${opts(CATS().map((x) => [x.id, x.label]), m.cat)}</select>
                <select data-kind="models" data-i="${i}" data-f="size" aria-label="المقاس">${opts(SIZES.map((s) => [s, s]), m.size)}</select>
              </div>
              ${rowBtns("models", i, m)}
            </div>`).join("")}
        </details>`;
      }).join("")}`;
  }

  function locs() {
    return `
      <div class="a-add">
        <h3>➕ زيدي بلاصة (ستوديو، ديكور، برا)</h3>
        <p>تقدري تحطي <b>صورة</b> ولا <b>فيديو</b> (mp4).</p>
        <div class="a-grid">
          <label>الاسم<input id="nlName" placeholder="مثلا: Studio rose"></label>
          <label>النوع<select id="nlType">${opts(LOC_TYPES, "studio")}</select></label>
        </div>
        <button data-act="pick" data-target="newLoc" class="a-primary">📤 اختاري الصورة / الفيديو</button>
      </div>
      ${LOC_TYPES.map(([t, label]) => {
        const rows = D.locations.map((l, i) => [l, i]).filter(([l]) => l.type === t);
        return `<details class="a-group" ${t === "studio" ? "open" : ""}><summary>${label} <small>${rows.length}</small></summary>
          ${rows.map(([l, i]) => `
            <div class="a-row ${l.hidden ? "is-hidden" : ""}">
              ${thumb(l)}
              <div class="a-fields">
                <input data-kind="locations" data-i="${i}" data-f="name" value="${esc(l.name)}" aria-label="الاسم">
                <select data-kind="locations" data-i="${i}" data-f="type" aria-label="النوع">${opts(LOC_TYPES, l.type)}</select>
                ${l.video ? `<span class="a-chip">🎬 فيديو</span>` : l.img ? "" : `<span class="a-chip">قريبا</span>`}
              </div>
              ${rowBtns("locations", i, l)}
            </div>`).join("")}
        </details>`;
      }).join("")}`;
  }

  function port() {
    return `
      <div class="a-add">
        <h3>🗂️ كيفاش يبان البورتفوليو فالموقع</h3>
        <div class="a-views">${VIEWS.map(([v, l]) => `<label class="a-radio"><input type="radio" name="pview" value="${v}" ${D.portfolioView === v ? "checked" : ""}> ${l}</label>`).join("")}</div>
      </div>
      <div class="a-add">
        <h3>➕ زيدي خدمة للبورتفوليو</h3>
        <div class="a-grid">
          <label>العنوان<input id="npTitle" placeholder="مثلا: Caftan mariage"></label>
          <label>الكاتيغوري<input id="npTag" list="aTags" placeholder="Mode · Traditionnel"></label>
          <label>الكاليتي<select id="npQ">${opts(QUALITIES, "pro")}</select></label>
        </div>
        <datalist id="aTags">${[...new Set(D.portfolio.map((p) => p.tag).filter(Boolean))].map((t) => `<option value="${esc(t)}">`).join("")}</datalist>
        <button data-act="pick" data-target="newPort" class="a-primary">📤 اختاري الصورة / الفيديو</button>
      </div>
      <div class="a-group a-flat">
        ${D.portfolio.map((p, i) => `
          <div class="a-row ${p.hidden ? "is-hidden" : ""}">
            ${thumb(p)}
            <div class="a-fields">
              <input data-kind="portfolio" data-i="${i}" data-f="title" value="${esc(p.title)}" aria-label="العنوان">
              <input data-kind="portfolio" data-i="${i}" data-f="tag" value="${esc(p.tag)}" list="aTags" aria-label="الكاتيغوري">
              <select data-kind="portfolio" data-i="${i}" data-f="quality" aria-label="الكاليتي">${opts(QUALITIES, p.quality || "")}</select>
              <span class="a-chip">${p.video ? "🎬 فيديو" : "📷 صورة"}</span>
            </div>
            ${rowBtns("portfolio", i, p)}
          </div>`).join("")}
      </div>`;
  }

  function shop() {
    D.site.social = D.site.social || {};
    const SOC = [["instagram", "Instagram"], ["tiktok", "TikTok"], ["facebook", "Facebook"], ["linkedin", "LinkedIn"], ["higgsfield", "Higgsfield"]];
    return `
      <div class="a-add">
        <h3>👤 الاسم والحسابات (يبانو لتحت فالموقع)</h3>
        <p>الأيقونة تبان غير كي تحطي الرابط تاعها كامل (يبدا بـ <b>https://</b>).</p>
        <div class="a-grid">
          <label>الاسم الكامل<input data-kind="site" data-f="owner" value="${esc(D.site.owner)}" placeholder="الاسم واللقب"></label>
          ${SOC.map(([k, l]) => `<label>${l}<input data-kind="social" data-f="${k}" value="${esc(D.site.social[k])}" placeholder="https://…" inputmode="url" dir="ltr"></label>`).join("")}
        </div>
      </div>
      <div class="a-add">
        <h3>📞 التواصل</h3>
        <div class="a-grid">
          <label>رقم الواتساب (بلا +، مثلا 213667526459)<input data-kind="site" data-f="whatsapp" value="${esc(D.site.whatsapp)}" inputmode="numeric"></label>
          <label>الإيميل (يبان زر الإيميل كي تحطيه)<input data-kind="site" data-f="email" value="${esc(D.site.email)}" type="email"></label>
          <label>العملة<input data-kind="site" data-f="currency" value="${esc(D.site.currency)}"></label>
        </div>
      </div>
      <div class="a-add">
        <h3>💰 أسعار الباقات</h3>
        <p>خلي الخانة فارغة ولا "—" باش يبان <b>"Sur devis"</b>.</p>
        <div class="a-grid">
          ${D.packs.map((p, i) => `<label>${esc(p.name)}<input data-kind="packs" data-i="${i}" data-f="price" value="${esc(p.price === "—" ? "" : p.price)}" placeholder="Sur devis" inputmode="numeric"></label>`).join("")}
        </div>
      </div>`;
  }

  /* ---------- événements ---------- */
  function setDirty() {
    dirty = true;
    const s = $("#aStatus"); if (s) s.textContent = "فيه تبديلات ما تحفظوش";
    const b = $("#adminPanel .a-save"); if (b) b.disabled = false;
  }

  function onInput(e) {
    const el = e.target, k = el.dataset.kind, f = el.dataset.f;
    if (!k || !f) return;
    if (k === "site") D.site[f] = el.value.trim();
    else if (k === "social") { D.site.social = D.site.social || {}; D.site.social[f] = el.value.trim(); }
    else D[k][+el.dataset.i][f] = el.value;
    setDirty();
  }
  function onChange(e) {
    if (e.target.name === "pview") { D.portfolioView = e.target.value; setDirty(); return; }
    if (e.target.id === "aFile") return handleFile(e.target);
    if (e.target.tagName === "SELECT" && e.target.dataset.kind) { onInput(e); if (e.target.dataset.f === "cat" || e.target.dataset.f === "type") render(); }
  }

  let pickFor = null, delArm = null;
  function onClick(e) {
    const b = e.target.closest("button"); if (!b) return;
    const act = b.dataset.act, kind = b.dataset.kind, i = +b.dataset.i;
    if (act === "close") {
      if (dirty && !b.classList.contains("armed")) { b.classList.add("armed"); b.textContent = "خرجي بلا حفظ؟"; return; }
      return close();
    }
    if (act === "tab") { tab = b.dataset.tab; return render(); }
    if (act === "save") return save(b);
    if (act === "pick") { pickFor = { target: b.dataset.target }; return $("#aFile").click(); }
    if (act === "media") { pickFor = { target: "replace", kind, i }; return $("#aFile").click(); }
    const list = D[kind]; if (!list) return;
    if (act === "up" && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
    else if (act === "down" && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
    else if (act === "hide") list[i].hidden = !list[i].hidden;
    else if (act === "del") {
      // confirmation dans la page : 2e clic dans les 4 s
      const key = kind + i;
      if (delArm !== key) { delArm = key; b.textContent = "متأكدة؟"; setTimeout(() => { if (delArm === key) { delArm = null; b.textContent = "🗑️"; } }, 4000); return; }
      delArm = null; list.splice(i, 1);
    } else return;
    setDirty(); render();
  }

  /* ---------- envoi de fichiers ---------- */
  async function upload(file) {
    if (assets) {
      const r = await assets.upload(file);
      return r.url || ("/_blob/" + r.id);
    }
    if (isLocal) return URL.createObjectURL(file); // aperçu local seulement
    throw { code: "not_granted" };
  }

  async function handleFile(input) {
    const file = input.files && input.files[0]; input.value = "";
    if (!file || !pickFor) return;
    const isVideo = file.type.startsWith("video/");
    const status = $("#aStatus"); status.textContent = "⏳ راهي تتحمل…";
    let url;
    try { url = await upload(file); }
    catch (err) { status.textContent = err && err.code === "too_large" ? "❌ الملف كبير بزاف (أقل من 20 MB)" : "❌ ما قدرتش نحمّل الملف هنا"; return; }
    const t = pickFor.target;
    if (t === "newModel") {
      const frames = +$("#nmFrames").value || 1;
      const m = { id: "u" + Date.now(), name: $("#nmName").value.trim() || "Nouveau", cat: $("#nmCat").value, size: $("#nmSize").value, hero: false };
      if (frames > 1) { m.sheet = url; m.frames = frames; } else m.img = url;
      D.models.unshift(m); tab = "models";
    } else if (t === "newLoc") {
      const l = { id: "u" + Date.now(), name: $("#nlName").value.trim() || "Nouveau lieu", type: $("#nlType").value };
      if (isVideo) l.video = url; else l.img = url;
      D.locations.unshift(l); tab = "locs";
    } else if (t === "newPort") {
      const p = { title: $("#npTitle").value.trim() || "Nouveau", tag: $("#npTag").value.trim(), quality: $("#npQ").value };
      if (isVideo) p.video = url; else p.img = url;
      D.portfolio.unshift(p); tab = "port";
    } else if (t === "replace") {
      const it = D[pickFor.kind][pickFor.i];
      delete it.img; delete it.video; delete it.sheet; delete it.face; delete it.frames;
      if (isVideo) it.video = url; else it.img = url;
    }
    pickFor = null; setDirty(); render();
  }

  /* ---------- sauvegarde : la page se republie avec les nouvelles données ---------- */
  async function save(btn) {
    const status = $("#aStatus");
    const json = JSON.stringify(D).replace(/</g, "\\u003c");
    btn.disabled = true; status.textContent = "⏳ راهو يتحفظ…";
    if (!artifact) {
      // local : on télécharge le fichier de données pour le test
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      a.download = "site-data.json"; a.click();
      status.textContent = "✅ (تجربة محلية) تحمّل site-data.json"; dirty = false; return;
    }
    try {
      const re = /(<script id="site-data" type="application\/json">)([\s\S]*?)(<\/script>)/;
      let src = "";
      for (const u of ["index.html", "./", location.href.split("#")[0]]) {
        try { const r = await fetch(u, { cache: "no-store" }); if (r.ok) { src = await r.text(); if (re.test(src) && /^\s*<!doctype/i.test(src)) break; } } catch (_) {}
        src = "";
      }
      if (!src) throw { code: "source_unavailable" };
      const html = src.replace(re, (_, a, __, c) => a + json + c);
      try { sessionStorage.setItem("adminTab", tab); } catch (_) {}
      await artifact.publish(html);
      status.textContent = "✅ تحفظ! الموقع راهو يتجدد…";
    } catch (err) {
      btn.disabled = false;
      const c = err && err.code;
      status.textContent =
        c === "conflict" ? "⚠️ كاين نسخة جديدة، الصفحة راهي تتجدد. عاودي التبديل." :
        c === "not_writer" || c === "not_granted" ? "🔒 ما عندكش الحق تحفظي من هنا." :
        c === "capability_disabled" ? "🔒 الحفظ ما يخدمش فهاد العرض (مثلا رابط عمومي). حلّي الموقع من حسابك." :
        c === "rate_limited" ? "⏳ حفظتي بزاف فوقت قصير، استناي شوية وعاودي." :
        c === "too_large" ? "❌ المعلومات كبار بزاف." :
        c === "source_unavailable" ? "❌ ما قدرتش نقرا الصفحة باش نحفظ. قولي لـ Claude." : "❌ ما تحفظش، عاودي بعد شوية.";
    }
  }

  // revenir sur le même onglet après la recharge qui suit une sauvegarde
  try { const t = sessionStorage.getItem("adminTab"); if (t) { tab = t; sessionStorage.removeItem("adminTab"); } } catch (_) {}

  boot();
})();
