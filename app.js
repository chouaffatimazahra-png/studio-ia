/* STUDIO·IA — logique du site (contenu dans data.js, textes/langues dans i18n.js) */
/* Où sont les données modifiées par Zahra ?
   - sur claude.ai : dans la page (<script id="site-data">)
   - sur GitHub Pages : dans content/site.json (modifié avec Pages CMS) */
(function loadSiteData() {
  let embedded = null;
  try { const el = document.getElementById("site-data"); embedded = el ? JSON.parse(el.textContent || "null") : null; } catch (_) {}
  if (embedded) return startSite(embedded);
  fetch("content/site.json", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => startSite(j && j.models ? j : null))
    .catch(() => startSite(null));
})();

function startSite(savedData) {
  const $ = (s, r = document) => r.querySelector(s);
  const hueOf = (str) => [...str].reduce((a, c) => a + c.charCodeAt(0) * 7, 0) % 360;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  /* ---------- données enregistrées (admin) ----------
     data.js = valeurs de départ ; savedData = ce que Zahra a modifié */
  (function applySiteData() {
    const saved = savedData;
    const full = saved || {
      site: { whatsapp: SITE.whatsapp, email: SITE.email, currency: SITE.currency, owner: SITE.owner || "", social: { ...(SITE.social || {}) } },
      packs: PACKS.map((p) => ({ id: p.id, name: p.name, price: p.price })),
      models: MODELS, locations: LOCATIONS, portfolio: PORTFOLIO, portfolioView: "all",
    };
    window.SITE_FULL = JSON.parse(JSON.stringify(full));
    if (!saved) return;
    Object.assign(SITE, saved.site || {});
    (saved.packs || []).forEach((sp) => { const p = PACKS.find((x) => x.id === sp.id); if (p) p.price = sp.price || "—"; });
    const visible = (arr) => (arr || []).filter((x) => !x.hidden);
    MODELS.splice(0, MODELS.length, ...visible(saved.models));
    LOCATIONS.splice(0, LOCATIONS.length, ...visible(saved.locations));
    PORTFOLIO.splice(0, PORTFOLIO.length, ...visible(saved.portfolio));
  })();
  const PORT_VIEW = (window.SITE_FULL && window.SITE_FULL.portfolioView) || "all";

  const state = { cat: "femmes", size: "all", locType: "tous", models: new Set(), loc: null, customLoc: "", format: null, pack: null, port: "all" };
  let firstRender = true;

  /* media: planche 3D (sheet) / image / vidéo si dispo, sinon placeholder */
  function media(item, label) {
    if (item.sheet) {
      const n = item.frames || 4;
      return `<div class="spin" data-frames="${n}" data-turn="${item.turn || ""}">
        <div class="spin-img" data-bg="${item.sheet}" style="background-size:${n * 100}% 100%"></div>
        <span class="spin-hint">↔ 360°</span>
      </div>`;
    }
    if (item.video) return `<video class="lazy-vid" data-src="${item.video}"${item.poster ? ` poster="${item.poster}"` : ""} muted loop playsinline preload="none"></video>`;
    if (item.img) return `<img src="${item.img}" alt="${esc(item.name || item.title)}" loading="lazy"${item.pos ? ` style="object-position:${item.pos}"` : ""}>`;
    const name = item.name || item.title || "";
    return `<div class="ph" style="--h:${hueOf(name)}"><span class="ph-mono">${name.charAt(0)}</span><span class="ph-label">${label}</span></div>`;
  }

  /* brand */
  document.querySelectorAll("[data-brand]").forEach((el) => (el.textContent = SITE.brand));
  $("#year").textContent = new Date().getFullYear();

  /* hero video: un fichier ou une liste jouée à la suite, en boucle, avec fondu */
  const pick = (matchMedia("(max-width: 700px)").matches && SITE.heroVideoMobile && SITE.heroVideoMobile.length) ? SITE.heroVideoMobile : SITE.heroVideo;
  const clips = [].concat(pick || []).filter(Boolean);
  if (clips.length) {
    const bg = $("#heroBg");
    bg.classList.add("has-video");
    bg.insertAdjacentHTML("beforeend", '<div class="hero-film"></div>');
    // téléphones (iPhone surtout) : il faut les ATTRIBUTS muted + playsinline, sinon la vidéo reste noire
    const posters = [].concat(SITE.heroPoster || []);
    const players = [0, 1].map(() => {
      const v = document.createElement("video");
      v.muted = true; v.defaultMuted = true; v.playsInline = true; v.autoplay = true; v.preload = "auto";
      ["muted", "playsinline", "webkit-playsinline", "autoplay"].forEach((a) => v.setAttribute(a, ""));
      bg.appendChild(v);
      return v;
    });
    const setClip = (v, i) => { if (posters[i]) v.poster = posters[i]; v.src = clips[i]; };
    // si le navigateur bloque la lecture automatique : on relance au premier toucher de l'écran
    const kick = () => { players.forEach((p) => p.classList.contains("on") && p.play().catch(() => {})); };
    ["touchstart", "click", "scroll"].forEach((ev) => addEventListener(ev, kick, { once: true, passive: true }));
    let idx = 0, cur = 0;
    const show = (v) => { players.forEach((p) => p.classList.toggle("on", p === v)); };
    setClip(players[0], 0);
    players[0].play().catch(() => {});
    show(players[0]);
    if (clips.length === 1) players[0].loop = true;
    else {
      setClip(players[1], 1);
      players.forEach((p) => p.addEventListener("ended", () => {
        if (p !== players[cur]) return;
        idx = (idx + 1) % clips.length;
        const next = players[1 - cur];
        next.currentTime = 0;
        next.play().catch(() => {});
        show(next);
        cur = 1 - cur;
        setTimeout(() => { setClip(p, (idx + 1) % clips.length); p.load(); }, 900);
      }));
    }
  }

  /* rotating word (rebuilt when the language changes) */
  const rot = $("#rotator");
  let wi = 0, spans = [];
  const fit = () => { if (spans[wi]) rot.style.width = spans[wi].scrollWidth + "px"; };
  function buildRotator() {
    const words = t("hero.words");
    wi = 0;
    rot.innerHTML = words.map((w, i) => `<span class="${i === 0 ? "on" : ""}">${w}</span>`).join("");
    spans = [...rot.children];
    document.fonts.ready.then(fit); fit();
  }
  addEventListener("resize", fit);
  setInterval(() => {
    if (!spans.length) return;
    const prev = spans[wi];
    prev.classList.replace("on", "off");
    setTimeout(() => prev.classList.remove("off"), 700);
    wi = (wi + 1) % spans.length;
    spans[wi].classList.add("on");
    fit();
  }, 2600);

  /* chips helper */
  function chips(el, items, current, onPick) {
    el.innerHTML = items.map((i) => `<button class="chip ${i.id === current ? "active" : ""}" data-id="${i.id}" ${i.disabled ? "disabled" : ""}>${i.label}</button>`).join("");
    el.onclick = (e) => { const b = e.target.closest(".chip"); if (b && !b.disabled) onPick(b.dataset.id); };
  }

  /* 3D : la souris (ou le doigt) fait tourner le mannequin d'une vue à l'autre + léger tilt */
  // chargement paresseux : l'image d'un mannequin ne se télécharge que quand il devient visible
  const lazyBg = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const sp = e.target, img = sp.querySelector(".spin-img"), n = +sp.dataset.frames;
    lazyBg.unobserve(sp);
    const pic = new Image();
    pic.onload = () => { sp.style.setProperty("--ar", pic.naturalWidth / n / pic.naturalHeight); img.style.backgroundImage = `url('${img.dataset.bg}')`; sp.classList.add("loaded"); };
    pic.src = img.dataset.bg;
  }), { rootMargin: "300px" });

  // vidéos (portfolio, lieux) : chargées et jouées seulement quand elles sont visibles
  const lazyVid = new IntersectionObserver((entries) => entries.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) { if (!v.getAttribute("src")) v.src = v.dataset.src; v.play().catch(() => {}); }
    else if (!v.paused) v.pause();
  }), { rootMargin: "200px" });
  function initVideos(root) { (root || document).querySelectorAll("video.lazy-vid").forEach((v) => lazyVid.observe(v)); }

  function initSpins(root) {
    root.querySelectorAll(".spin").forEach((sp) => {
      const n = +sp.dataset.frames, img = sp.querySelector(".spin-img");
      lazyBg.observe(sp);
      const setFrame = (f) => { img.style.backgroundPosition = `${n > 1 ? (f / (n - 1)) * 100 : 0}% 0`; };
      const move = (clientX, clientY) => {
        const r = sp.getBoundingClientRect();
        const x = Math.min(Math.max((clientX - r.left) / r.width, 0), 0.999);
        const y = (clientY - r.top) / r.height;
        setFrame(Math.floor(x * n));
        sp.style.setProperty("--ry", `${(x - 0.5) * 14}deg`);
        sp.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
        sp.classList.add("active");
      };
      const leave = () => { setFrame(0); sp.style.setProperty("--ry", "0deg"); sp.style.setProperty("--rx", "0deg"); sp.classList.remove("active"); };
      sp.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") move(e.clientX, e.clientY); });
      sp.addEventListener("pointerleave", leave);
      // au doigt : un appui long (sans glisser la rangée) fait tourner
      sp.addEventListener("touchmove", (e) => { const tt = e.touches[0]; move(tt.clientX, tt.clientY); }, { passive: true });
      sp.addEventListener("touchend", leave);
      if (sp.dataset.turn) {
        const v = Object.assign(document.createElement("video"), { src: sp.dataset.turn, muted: true, loop: true, playsInline: true, preload: "none" });
        v.className = "spin-vid";
        sp.appendChild(v);
        sp.addEventListener("pointerenter", () => { v.play().catch(() => {}); sp.classList.add("vid"); });
        sp.addEventListener("pointerleave", () => { v.pause(); sp.classList.remove("vid"); });
      }
    });
  }

  /* MARQUEE (vrais mannequins "en l'air") */
  function renderMarquee() {
    const realModels = MODELS.filter((m) => m.sheet && m.hero !== false);
    const mq = realModels.length >= 6
      ? realModels.concat(realModels).map((m) => media(m, `${m.name} · ${m.size}`)).join("")
      : (typeof MARQUEE !== "undefined" && MARQUEE.length)
      ? MARQUEE.concat(MARQUEE).map((m) => `<figure class="mq-item"><img src="${m.img}" alt="" loading="lazy" style="object-position:${m.pos || "50% 50%"}"><figcaption>${m.label || ""}</figcaption></figure>`).join("")
      : "";
    $("#marquee").innerHTML = mq;
    $("#marquee").querySelectorAll(":scope > *").forEach((el) => el.classList.add("ph"));
    initSpins($("#marquee"));
  }

  /* CASTING — une seule rangée qu'on fait glisser */
  function renderCasting() {
    chips($("#catFilter"), CATEGORIES.map((c) => ({ id: c.id, label: `${t("cat." + c.id)} <small>${MODELS.filter((m) => m.cat === c.id).length}</small>` })), state.cat,
      (id) => { state.cat = id; state.size = "all"; renderCasting(); });
    const inCat = MODELS.filter((m) => m.cat === state.cat);
    const sizes = ["all", ...SIZES].map((s) => {
      const count = s === "all" ? inCat.length : inCat.filter((m) => m.size === s).length;
      return { id: s, label: `${s === "all" ? t("casting.all") : s}<small>${count}</small>`, disabled: !count };
    });
    chips($("#sizeFilter"), sizes, state.size, (id) => { state.size = id; renderCasting(); });
    $("#sizeFilter").insertAdjacentHTML("afterbegin", `<span class="ruler-label">${t("casting.size")}</span>`);
    const list = inCat.filter((m) => state.size === "all" || m.size === state.size);
    const row = $("#modelsGrid");
    row.innerHTML = list.length
      ? list.map((m, i) => `
        <button class="card ${state.models.has(m.id) ? "selected" : ""}" data-id="${m.id}" style="animation-delay:${Math.min(i, 8) * 50}ms">
          <div class="media">${media(m, t("casting.soon"))}${m.face ? `<img class="face" src="${m.face}" alt="${t("casting.face")} ${esc(m.name)}" loading="lazy">` : ""}
            <span class="zoom-btn" data-zoom="${m.id}" role="button" tabindex="0" aria-label="${t("casting.zoom")}">⤢</span></div>
          <span class="check">✓</span>
          <div class="meta"><span>${esc(m.name)}</span><small>${esc(m.size)}</small></div>
        </button>`).join("")
      : `<p class="empty">${t("casting.empty")}</p>`;
    row.scrollLeft = 0;
    initSpins(row);
    updateRowNav(row);
  }
  /* VUE AGRANDIE d'un mannequin : grande image, toujours en 3D (souris / doigt) */
  function openZoom(id) {
    const m = MODELS.find((x) => x.id === id); if (!m) return;
    const z = $("#zoom");
    const sel = state.models.has(m.id);
    $("#zoomBody").innerHTML = `
      <div class="zoom-stage">${media(m, "")}</div>
      <div class="zoom-side">
        ${m.face ? `<img class="zoom-face" src="${m.face}" alt="${t("casting.face")} ${esc(m.name)}">` : ""}
        <h3>${esc(m.name)}</h3>
        <p class="zoom-meta">${esc(t("cat." + m.cat))} · ${esc(m.size)}</p>
        <p class="zoom-hint">${t("casting.turn")}</p>
        <button type="button" class="btn ${sel ? "btn-ghost" : ""}" id="zoomPick">${sel ? t("casting.unpick") : t("casting.pick")}</button>
        <p class="zoom-exclu">✦ ${t("casting.exclu")}</p>
      </div>`;
    z.hidden = false; document.documentElement.classList.add("terms-open");
    initSpins($("#zoomBody"));
    $("#zoomPick").onclick = () => {
      state.models.has(m.id) ? state.models.delete(m.id) : state.models.add(m.id);
      document.querySelectorAll(`#modelsGrid .card[data-id="${m.id}"]`).forEach((c) => c.classList.toggle("selected", state.models.has(m.id)));
      update(); closeZoom();
    };
    $("#zoomClose").focus();
  }
  function closeZoom() { $("#zoom").hidden = true; document.documentElement.classList.remove("terms-open"); $("#zoomBody").innerHTML = ""; }
  $("#zoomClose").addEventListener("click", closeZoom);
  $("#zoom").addEventListener("click", (e) => { if (e.target.id === "zoom") closeZoom(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#zoom").hidden) closeZoom(); });

  $("#modelsGrid").onclick = (e) => {
    const zb = e.target.closest("[data-zoom]");
    if (zb) { e.stopPropagation(); return openZoom(zb.dataset.zoom); }
    const c = e.target.closest(".card"); if (!c) return;
    const id = c.dataset.id;
    state.models.has(id) ? state.models.delete(id) : state.models.add(id);
    c.classList.toggle("selected");
    update();
  };

  /* flèches de la rangée */
  function updateRowNav(row) {
    const wrap = row.closest(".row-wrap"); if (!wrap) return;
    const max = row.scrollWidth - row.clientWidth;
    const pos = Math.abs(row.scrollLeft);
    wrap.classList.toggle("can-prev", pos > 4);
    wrap.classList.toggle("can-next", pos < max - 4);
  }
  document.querySelectorAll(".row-nav").forEach((b) => b.addEventListener("click", () => {
    const row = document.getElementById(b.dataset.row);
    const dir = (b.classList.contains("next") ? 1 : -1) * (document.documentElement.dir === "rtl" ? -1 : 1);
    row.scrollBy({ left: dir * row.clientWidth * 0.85, behavior: "smooth" });
  }));
  document.querySelectorAll(".row").forEach((row) => row.addEventListener("scroll", () => updateRowNav(row), { passive: true }));
  addEventListener("resize", () => document.querySelectorAll(".row").forEach(updateRowNav));

  /* UNIVERS : l'objet flotte et s'incline vers la souris (3D) */
  document.querySelectorAll(".u-card").forEach((card) => {
    const obj = card.querySelector(".u-obj"); if (!obj) return;
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      obj.style.setProperty("--ry", `${x * 28}deg`);
      obj.style.setProperty("--rx", `${-y * 18}deg`);
    });
    card.addEventListener("pointerleave", () => { obj.style.setProperty("--ry", "0deg"); obj.style.setProperty("--rx", "0deg"); });
  });

  /* LOCATIONS */
  function renderLocs(keepScroll) {
    const types = ["tous", "studio", "interieur", "produit", "exterieur"].map((id) => ({
      id, label: `${t("loc." + id)} <small>${LOCATIONS.filter((l) => id === "tous" || l.type === id).length}</small>`,
    }));
    chips($("#locFilter"), types, state.locType, (id) => { state.locType = id; renderLocs(); });
    const list = LOCATIONS.filter((l) => state.locType === "tous" || l.type === state.locType);
    $("#locsGrid").innerHTML = list.map((l, i) => `
      <button class="card ${state.loc === l.id ? "selected" : ""}" data-id="${l.id}" style="animation-delay:${Math.min(i, 12) * 40}ms">
        <div class="media">${media(l, l.img ? t("type." + l.type) : t("loc.soonLong"))}</div>
        <span class="check">✓</span>
        <div class="meta"><span>${esc(l.name)}</span><small>${l.img ? t("type." + l.type) : t("loc.soon")}</small></div>
      </button>`).join("") + `
      <div class="card custom-loc ${state.loc === "custom" ? "selected" : ""}" data-id="custom" role="button" tabindex="0">
        <div class="media custom-media">
          <span class="custom-pin">📍</span>
          <strong>${t("custom.title")}</strong>
          <p>${t("custom.desc")}</p>
          <input type="text" id="customLoc" placeholder="${esc(t("custom.ph"))}" value="${esc(state.customLoc)}">
          <small>${t("custom.note")}</small>
        </div>
        <span class="check">✓</span>
        <div class="meta"><span>${t("custom.meta")}</span><small>${t("custom.any")}</small></div>
      </div>`;
    const row = $("#locsGrid");
    if (!keepScroll) row.scrollLeft = 0;
    updateRowNav(row);
    initVideos(row);
  }
  $("#locsGrid").onclick = (e) => {
    const c = e.target.closest(".card"); if (!c) return;
    if (c.dataset.id === "custom") {
      if (e.target.id !== "customLoc" && state.loc === "custom") state.loc = null;
      else state.loc = "custom";
      document.querySelectorAll("#locsGrid .card").forEach((x) => x.classList.toggle("selected", x.dataset.id === state.loc));
      if (state.loc === "custom" && e.target.id !== "customLoc") $("#customLoc").focus();
      update(); return;
    }
    state.loc = state.loc === c.dataset.id ? null : c.dataset.id;
    renderLocs(true); update();
  };
  $("#locsGrid").addEventListener("input", (e) => {
    if (e.target.id !== "customLoc") return;
    state.customLoc = e.target.value; state.loc = "custom";
    document.querySelectorAll("#locsGrid .card").forEach((x) => x.classList.toggle("selected", x.dataset.id === "custom"));
    update();
  });

  /* FORMATS */
  const FORMAT_KEY = { photos: "f.photos.t", pub: "f.pub.t", scenario: "f.scen.t" };
  $("#formats").onclick = (e) => {
    const c = e.target.closest(".f-card"); if (!c) return;
    state.format = state.format === c.dataset.format ? null : c.dataset.format;
    document.querySelectorAll(".f-card").forEach((f) => f.classList.toggle("selected", f.dataset.format === state.format));
    update();
  };

  /* PORTFOLIO */
  // filtres du portfolio selon le choix de Zahra (admin) : catégorie, qualité, ou photos/vidéos
  const QUALITY_LABEL = { standard: "Standard", pro: "Pro", ultra: "Ultra" };
  const portKey = (p) => PORT_VIEW === "category" ? (p.tag || "—") : PORT_VIEW === "quality" ? (QUALITY_LABEL[p.quality] || "—") : PORT_VIEW === "type" ? (p.video ? "video" : "photo") : "all";
  function renderPortfolio() {
    const filterEl = $("#portFilter");
    if (PORT_VIEW !== "all" && filterEl) {
      const keys = [...new Set(PORTFOLIO.map(portKey))];
      const label = (k) => k === "photo" ? t("port.photos") : k === "video" ? t("port.videos") : k;
      chips(filterEl, [{ id: "all", label: `${t("loc.tous")} <small>${PORTFOLIO.length}</small>` },
        ...keys.map((k) => ({ id: k, label: `${esc(label(k))} <small>${PORTFOLIO.filter((p) => portKey(p) === k).length}</small>` }))],
        state.port, (id) => { state.port = id; renderPortfolio(); });
      filterEl.hidden = false;
    } else if (filterEl) filterEl.hidden = true;
    const list = PORTFOLIO.filter((p) => state.port === "all" || portKey(p) === state.port);
    portList = list;
    $("#portGrid").innerHTML = list.map((p, i) => `
      <div class="card reveal ${firstRender ? "" : "in"}" data-i="${i}" role="button" tabindex="0" aria-label="${esc(t("port.open"))} : ${esc(p.title)}">
        <div class="media">${media(p, t("portfolio.soon"))}</div>
        <div class="meta"><span>${esc(p.title)}</span><small>${esc(p.tag || "")}</small></div>
      </div>`).join("");
    initVideos($("#portGrid"));
  }

  /* PORTFOLIO EN GRAND : clic → plein écran, flèches / clavier / glisser le doigt pour voir la suite */
  let portList = [], lbIndex = 0, lbResume = [];
  const lb = $("#lb"), lbStage = $("#lbStage");
  const isRtl = () => document.documentElement.dir === "rtl";
  function lbShow(i) {
    const n = portList.length; if (!n) return;
    lbIndex = ((i % n) + n) % n;
    const p = portList[lbIndex];
    lbStage.innerHTML = p.video
      ? `<video src="${p.video}"${p.poster ? ` poster="${p.poster}"` : ""} muted loop playsinline autoplay></video>`
      : p.img ? `<img src="${p.img}" alt="${esc(p.title)}">` : media(p, t("portfolio.soon"));
    const v = lbStage.querySelector("video");
    if (v) { v.muted = true; v.play().catch(() => {}); }
    $("#lbTitle").textContent = p.title || "";
    $("#lbTag").textContent = p.tag || "";
    $("#lbCount").textContent = `${lbIndex + 1} / ${n}`;
    [1, -1].forEach((d) => { const q = portList[(lbIndex + d + n) % n]; const src = q && (q.img || q.poster); if (src) new Image().src = src; });
  }
  function lbOpen(i) {
    $("#lbClose").setAttribute("aria-label", t("lb.close"));
    $("#lbPrev").setAttribute("aria-label", t("lb.prev"));
    $("#lbNext").setAttribute("aria-label", t("lb.next"));
    // on met en pause les vidéos de la grille derrière (économie de données)
    lbResume = [...document.querySelectorAll("#portGrid video")].filter((v) => !v.paused);
    lbResume.forEach((v) => v.pause());
    lb.hidden = false; document.documentElement.classList.add("terms-open");
    lbShow(i);
    $("#lbClose").focus();
  }
  function lbClose() {
    lb.hidden = true; document.documentElement.classList.remove("terms-open");
    lbStage.innerHTML = "";
    lbResume.forEach((v) => v.play().catch(() => {})); lbResume = [];
    const card = $(`#portGrid .card[data-i="${lbIndex}"]`);
    if (card) card.focus({ preventScroll: true });
  }
  $("#portGrid").addEventListener("click", (e) => { const c = e.target.closest(".card[data-i]"); if (c) lbOpen(+c.dataset.i); });
  $("#portGrid").addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".card[data-i]")) { e.preventDefault(); lbOpen(+e.target.dataset.i); }
  });
  $("#lbClose").addEventListener("click", lbClose);
  $("#lbPrev").addEventListener("click", () => lbShow(lbIndex - 1));
  $("#lbNext").addEventListener("click", () => lbShow(lbIndex + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.id === "lbFig" || e.target === lbStage) lbClose(); });
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") lbClose();
    else if (e.key === "ArrowRight") lbShow(lbIndex + (isRtl() ? -1 : 1));
    else if (e.key === "ArrowLeft") lbShow(lbIndex + (isRtl() ? 1 : -1));
  });
  let swipeX = null, swipeY = null;
  lb.addEventListener("touchstart", (e) => { const p0 = e.touches[0]; swipeX = p0.clientX; swipeY = p0.clientY; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (swipeX === null) return;
    const p1 = e.changedTouches[0], dx = p1.clientX - swipeX, dy = p1.clientY - swipeY;
    swipeX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) lbShow(lbIndex + ((dx < 0) !== isRtl() ? 1 : -1));
    else if (dy > 100 && Math.abs(dy) > Math.abs(dx) * 1.5) lbClose(); // glisser vers le bas = fermer
  }, { passive: true });

  /* PACKS */
  function renderPacks() {
    $("#packsGrid").innerHTML = PACKS.map((p) => {
      const feats = t(`pack.${p.id}.f`);
      return `
      <div class="pack reveal ${firstRender ? "" : "in"} ${p.featured ? "featured" : ""} ${state.pack === p.id ? "selected" : ""}" data-id="${p.id}">
        ${p.featured ? `<span class="badge">${t("packs.popular")}</span>` : ""}
        <h3>${p.name}</h3>
        <div class="price">${p.price && p.price !== "—"
          ? `${p.price} <small>${SITE.currency} ${t(p.period === "une fois" ? "period.once" : "period.month")}</small>`
          : `<span class="quote">${t("packs.quote")}</span>`}</div>
        <p class="desc">${t(`pack.${p.id}.desc`)}</p>
        <ul>${(Array.isArray(feats) ? feats : p.features).map((f) => `<li>${f}</li>`).join("")}</ul>
        <button class="btn ${p.featured ? "" : "btn-ghost"}" data-pick="${p.id}">${t("packs.choose")} ${p.name}</button>
      </div>`;
    }).join("");
  }
  $("#packsGrid").onclick = (e) => {
    const b = e.target.closest("[data-pick]"); if (!b) return;
    state.pack = b.dataset.pick;
    document.querySelectorAll(".pack").forEach((p) => p.classList.toggle("selected", p.dataset.id === state.pack));
    update();
    $("#commande").scrollIntoView();
  };

  /* SUMMARY + WHATSAPP */
  function update() {
    const models = MODELS.filter((m) => state.models.has(m.id)).map((m) => `${m.name} (${m.size})`);
    const locName = state.loc === "custom"
      ? t("custom.summary", { x: state.customLoc.trim() || t("custom.tbd") })
      : (LOCATIONS.find((l) => l.id === state.loc) || {}).name;
    const pack = PACKS.find((p) => p.id === state.pack);
    const rows = [
      [t("sum.models"), models.join(", ") || "—"],
      [t("sum.location"), locName || "—"],
      [t("sum.format"), state.format ? t(FORMAT_KEY[state.format]) : "—"],
      [t("sum.pack"), pack ? pack.name : "—"],
    ];
    // option « égérie exclusive » (6 ou 12 mois)
    if ($("#optExclu").checked) {
      const dur = (document.querySelector('input[name="exdur"]:checked') || {}).value;
      rows.push([t("sum.exclu"), t(dur === "12" ? "opt.12" : "opt.6")]);
    }
    $("#summary").innerHTML = rows.map(([k, v]) => `<li>${k} : <b>${esc(v)}</b></li>`).join("");

    const msg = `${t("msg.hello", { b: SITE.brand })}\n${t("msg.want")}\n` + rows.map(([k, v]) => `• ${k} : ${v}`).join("\n") + `\n\n${t("msg.preview")}`;
    $("#waBtn").href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
    // bouton « Je participe » (offre avant / après) → message WhatsApp déjà écrit
    $("#proofBtn").href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t("msg.proof", { b: SITE.brand }))}`;
    $("#mailBtn").hidden = !SITE.email || /exemple|example/.test(SITE.email); // caché tant que l'e-mail n'est pas le vrai
    $("#mailBtn").href = `mailto:${SITE.email}?subject=${encodeURIComponent(t("msg.subject") + " " + SITE.brand)}&body=${encodeURIComponent(msg)}`;

    const n = state.models.size + (locName ? 1 : 0) + (state.format ? 1 : 0) + (pack ? 1 : 0);
    $("#trayText").textContent = `${n} ${n > 1 ? t("tray.many") : t("tray.one")}`;
    $("#tray").classList.toggle("show", n > 0);
  }
  $("#optExclu").addEventListener("change", (e) => { $("#optDur").hidden = !e.target.checked; update(); });
  document.querySelectorAll('input[name="exdur"]').forEach((r) => r.addEventListener("change", update));

  /* PIED DE PAGE : nom de la propriétaire + réseaux sociaux (seulement ceux qui ont un lien https) */
  const ICONS = {
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M14 3c.4 2.6 2.2 4.4 5 4.7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8.9v3h2.6V21" fill="currentColor"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="9" width="3.4" height="11" fill="currentColor"/><circle cx="5.2" cy="5.3" r="2" fill="currentColor"/><path d="M10 9h3.2v1.6c.5-.9 1.7-1.9 3.6-1.9 3.4 0 4 2.2 4 5V20h-3.4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H10z" fill="currentColor"/></svg>',
    higgsfield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-2.2z" fill="currentColor"/><circle cx="18.5" cy="18.5" r="1.6" fill="currentColor"/></svg>',
  };
  const SOCIAL_NAMES = { instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook", linkedin: "LinkedIn", higgsfield: "Higgsfield" };
  function renderFooter() {
    const own = $("#footOwner");
    if (SITE.owner) { own.textContent = `${t("footer.by")} ${SITE.owner}`; own.hidden = false; } else own.hidden = true;
    const soc = SITE.social || {};
    $("#footSocial").innerHTML = Object.keys(SOCIAL_NAMES)
      .filter((k) => /^https:\/\//i.test(soc[k] || ""))
      .map((k) => `<a href="${esc(soc[k])}" target="_blank" rel="noopener" aria-label="${SOCIAL_NAMES[k]}" title="${SOCIAL_NAMES[k]}">${ICONS[k]}</a>`).join("");
  }

  /* CONDITIONS GÉNÉRALES (fenêtre) */
  function renderTerms() {
    const T = (typeof TERMS !== "undefined" && (TERMS[LANG] || TERMS.fr)) || null;
    if (!T) return;
    $("#termsBody").innerHTML = `<h2 id="termsTitle">${esc(T.title)}</h2><p class="terms-date">${esc(T.updated)}</p><p>${esc(T.intro)}</p>`
      + T.items.map(([h, p]) => `<h3>${esc(h)}</h3><p>${esc(p)}</p>`).join("")
      + `<p class="terms-accept">${esc(T.accept)}</p>`;
    $("#termsClose").setAttribute("aria-label", T.close);
  }
  const openTerms = () => { $("#terms").hidden = false; document.documentElement.classList.add("terms-open"); $("#termsClose").focus(); };
  const closeTerms = () => { $("#terms").hidden = true; document.documentElement.classList.remove("terms-open"); };
  document.addEventListener("click", (e) => { if (e.target.closest("#termsOpen, [data-open-terms]")) openTerms(); });
  $("#termsClose").addEventListener("click", closeTerms);
  $("#terms").addEventListener("click", (e) => { if (e.target.id === "terms") closeTerms(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#terms").hidden) closeTerms(); });

  /* LANGUE */
  function renderAll() {
    applyStaticI18n();
    document.title = `${SITE.brand} — ${t("doc.title")}`;
    buildRotator();
    renderCasting();
    renderLocs();
    renderPortfolio();
    renderPacks();
    renderFooter();
    renderTerms();
    update();
  }
  $("#langSwitch").addEventListener("click", (e) => {
    const b = e.target.closest("[data-lang]"); if (!b || b.dataset.lang === LANG) return;
    LANG = b.dataset.lang; localStorage.setItem("lang", LANG);
    renderAll();
  });

  renderMarquee();
  renderAll();
  firstRender = false;

  /* reveal on scroll */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 80}ms`; io.observe(el); });

  /* nav on scroll */
  const nav = $("#nav");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 30), { passive: true });
}
