/* RAPOT · Vistas sincronizadas por categoría.
 * La red y la tabla consumen exactamente el mismo arreglo activeItems.
 * No hay una segunda fuente de datos ni un recuadro reutilizado del grafo principal.
 */
(function initCategoryItems(){
  const overlay = document.getElementById("items-modal-overlay");
  if (!overlay) return;

  const title = document.getElementById("items-modal-title");
  const subtitle = document.getElementById("items-modal-subtitle");
  const count = document.getElementById("items-modal-count");
  const list = document.getElementById("items-list");
  const search = document.getElementById("items-search");
  const closeButton = document.getElementById("items-modal-close");
  const networkView = document.getElementById("category-network-view");
  const tableView = document.getElementById("category-table-view");
  const networkSvg = document.getElementById("category-network-svg");
  const networkCanvas = document.getElementById("category-network-canvas");
  const networkScene = document.getElementById("category-network-scene");
  const networkLinks = document.getElementById("category-network-links");
  const networkNodes = document.getElementById("category-network-nodes");
  const zoomLevel = document.getElementById("category-zoom-level");
  const zoomButtons = [...overlay.querySelectorAll("[data-zoom-action]")];
  const viewButtons = [...overlay.querySelectorAll("[data-category-view]")];

  let activeItems = [];
  let activeTitle = "Elementos de la categoría";
  let activeSheets = [];
  let currentView = "network";
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let dragState = null;

  // Correspondencia exacta entre los grupos analíticos y las hojas del Excel en Supabase.
  const SHEETS_BY_CATEGORY = [
    { match: ["red vial", "vial", "arterial", "cicloruta"], title: "Red vial y ciclorutas", sheets: ["Vías Arteriales", "Ciclorutas"] },
    { match: ["equipamiento", "cuidado", "salud", "educación", "cultura", "deporte"], title: "Equipamientos y servicios", sheets: ["Educación", "Salud", "Cultura", "Deporte", "Cuidado"] },
    { match: ["parque", "espacio público"], title: "Parques y espacio público", sheets: ["Parques"] },
    { match: ["hídrico", "humedal", "río", "quebrada"], title: "Sistema hídrico y humedales", sheets: ["Sistema Hídrico", "Humedales"] },
    { match: ["patrimonio cultural", "patrimonio material", "patrimonio inmaterial", "sitios sagrados"], title: "Patrimonio cultural", sheets: ["Cultura"] },
    { match: ["patrimonio natural", "cobertura", "área protegida", "conectividad ecosistémica"], title: "Patrimonio natural y estructura ecológica", sheets: ["Sistema Hídrico", "Humedales", "Parques"] },
    { match: ["productiva", "socioeconómica", "comercio", "vivienda", "innovación"], title: "Actividad socioeconómica y territorio", sheets: ["Comercio", "Localidades"] },
    { match: ["localidad", "unidad de planeamiento"], title: "Localidades y UPL", sheets: ["Localidades"] }
  ];

  const SHEETS_BY_GROUP = {
    "Humedales": { title: "Humedales", sheets: ["Humedales"] },
    "Sistema Hídrico": { title: "Sistema hídrico", sheets: ["Sistema Hídrico"] },
    "Parques": { title: "Parques", sheets: ["Parques"] },
    "Educación": { title: "Educación", sheets: ["Educación"] },
    "Salud": { title: "Salud", sheets: ["Salud"] },
    "Cultura": { title: "Cultura", sheets: ["Cultura"] },
    "Cultura Patrimonial": { title: "Cultura patrimonial", sheets: ["Cultura"] },
    "Deporte": { title: "Deporte", sheets: ["Deporte"] },
    "Cuidado": { title: "Cuidado", sheets: ["Cuidado"] },
    "Vías Arteriales": { title: "Vías arteriales", sheets: ["Vías Arteriales"] },
    "Ciclorutas": { title: "Ciclorutas", sheets: ["Ciclorutas"] },
    "Comercio": { title: "Comercio", sheets: ["Comercio"] },
    "Localidades": { title: "Localidades", sheets: ["Localidades"] },
    "Coberturas Vegetales": { title: "Coberturas vegetales y espacios naturales", sheets: ["Parques", "Humedales"] },
    "Áreas Protegidas": { title: "Áreas protegidas", sheets: ["Parques", "Humedales"] },
    "Conectividad Ecosistémica": { title: "Conectividad ecosistémica", sheets: ["Sistema Hídrico", "Humedales", "Parques", "Ciclorutas"] },
    "Red Vial Completa": { title: "Red vial y ciclorutas", sheets: ["Vías Arteriales", "Ciclorutas"] },
    "Transporte Sostenible": { title: "Movilidad sostenible", sheets: ["Vías Arteriales", "Ciclorutas"] },
    "Equipamientos y Servicios": { title: "Equipamientos y servicios", sheets: ["Educación", "Salud", "Cultura", "Deporte", "Cuidado"] },
    "Espacio Público": { title: "Parques y espacio público", sheets: ["Parques"] },
    "Patrimonio Natural": { title: "Patrimonio natural", sheets: ["Sistema Hídrico", "Humedales", "Parques"] },
    "Patrimonio Cultural Material": { title: "Patrimonio cultural material", sheets: ["Cultura"] },
    "Patrimonio Inmaterial": { title: "Patrimonio inmaterial", sheets: ["Cultura"] },
    "Sitios Sagrados": { title: "Sitios sagrados y patrimonio cultural", sheets: ["Cultura"] },
    "Zonas Productivas": { title: "Zonas productivas y comercio", sheets: ["Comercio", "Localidades"] },
    "Educación y Conocimiento": { title: "Educación y conocimiento", sheets: ["Educación"] },
    "Comercio y Servicios": { title: "Comercio y servicios", sheets: ["Comercio"] },
    "Vivienda": { title: "Vivienda y territorio", sheets: ["Localidades"] }
  };

  function resolveCategory(node, network){
    if (Array.isArray(node?.itemSheets) && node.itemSheets.length){
      return { title: node.groupName || "Elementos de la categoría", sheets: node.itemSheets };
    }
    const explicit = SHEETS_BY_GROUP[node?.groupName];
    if (explicit) return explicit;
    const raw = [node?.groupName, ...(node?.label || []), node?.id, network?.title].filter(Boolean).join(" ");
    const normalized = raw.toLocaleLowerCase("es");
    const resolved = SHEETS_BY_CATEGORY.find(category => category.match.some(token => normalized.includes(token)));
    if (resolved) return resolved;
    return { title: node?.groupName || node?.label?.join(" ") || network?.title || "Elementos POT", sheets: [] };
  }

  function escapeHtml(value){
    return String(value ?? "").replace(/[&<>'"]/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[char]));
  }

  function svgElement(tag, attrs = {}){
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  function itemLabel(item){
    return [item.name, item.subcategory, item.source_sheet].filter(Boolean).join(" · ");
  }

  function wrapNodeLabel(value, maxChars = 12, maxLines = 3){
    const words = String(value || "Elemento").split(/\s+/).filter(Boolean);
    const lines = [];
    let current = "";
    words.forEach(word => {
      if (!current || `${current} ${word}`.length <= maxChars) current = current ? `${current} ${word}` : word;
      else { lines.push(current); current = word; }
    });
    if (current) lines.push(current);
    if (lines.length <= maxLines) return lines;
    const compact = lines.slice(0, maxLines);
    compact[maxLines - 1] = `${compact[maxLines - 1].slice(0, Math.max(3, maxChars - 1))}…`;
    return compact;
  }

  const ICON_CODE_BY_SHEET = {
    "Humedales": 0xf043,
    "Sistema Hídrico": 0xf773,
    "Parques": 0xf1bb,
    "Ciclorutas": 0xf206,
    "Vías Arteriales": 0xf018,
    "Educación": 0xf19d,
    "Salud": 0xf0fa,
    "Cultura": 0xf1d8,
    "Deporte": 0xf1e3,
    "Cuidado": 0xf2b5,
    "Comercio": 0xf54e,
    "Localidades": 0xf1ad
  };

  function iconForItem(item){
    return String.fromCodePoint(ICON_CODE_BY_SHEET[item.source_sheet] || 0xf1b9);
  }

  function applyViewport(){
    networkScene.setAttribute("transform", `translate(${panX.toFixed(1)} ${panY.toFixed(1)}) scale(${zoom.toFixed(2)})`);
    zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
  }

  function resetViewport(){
    zoom = 1;
    panX = 0;
    panY = 0;
    applyViewport();
  }

  function changeZoom(delta){
    zoom = Math.max(0.65, Math.min(2.8, Number((zoom + delta).toFixed(2))));
    applyViewport();
  }

  function setView(view){
    currentView = view === "table" ? "table" : "network";
    networkView.hidden = currentView !== "network";
    tableView.hidden = currentView !== "table";
    viewButtons.forEach(button => {
      const active = button.dataset.categoryView === currentView;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (currentView === "network") renderNetwork();
  }

  function renderTable(filtered){
    if (!filtered.length){
      list.innerHTML = `<tr><td class="items-list-empty-cell" colspan="4">No se encontraron elementos${search.value.trim() ? ` para “${escapeHtml(search.value.trim())}”` : ""}.</td></tr>`;
      return;
    }
    list.innerHTML = filtered.map((item, index) => `
      <tr class="items-table-row">
        <td class="items-table-index">${String(index + 1).padStart(2, "0")}</td>
        <td class="items-table-name">${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.source_sheet || "—")}</td>
        <td>${escapeHtml(item.subcategory || item.source_header || "—")}</td>
      </tr>
    `).join("");
  }

  function organicPositions(total){
    // Semilla determinista: la composición cambia con el número de elementos,
    // pero nunca se convierte en una cuadrícula de filas y columnas.
    const positions = Array.from({ length: total }, (_, index) => {
      const angle = -Math.PI / 2 + index * 2.3999632297;
      const spread = total <= 24 ? 62 + Math.sqrt(index + 1) * 69 : 80 + Math.sqrt(index + 1) * 42;
      return {
        x: 380 + Math.cos(angle) * spread * 1.23,
        y: 260 + Math.sin(angle) * spread * 0.72
      };
    });
    const minDistance = total <= 24 ? 82 : total <= 72 ? 38 : 16;
    const bounds = { left: 38, right: 722, top: 46, bottom: 474 };
    for (let iteration = 0; iteration < 90; iteration++){
      for (let a = 0; a < positions.length; a++){
        for (let b = a + 1; b < positions.length; b++){
          const dx = positions[b].x - positions[a].x;
          const dy = positions[b].y - positions[a].y;
          const distance = Math.max(Math.hypot(dx, dy), 0.01);
          if (distance >= minDistance) continue;
          const push = (minDistance - distance) * 0.08;
          const ux = dx / distance;
          const uy = dy / distance;
          positions[a].x -= ux * push;
          positions[a].y -= uy * push;
          positions[b].x += ux * push;
          positions[b].y += uy * push;
        }
      }
      positions.forEach(position => {
        position.x = Math.max(bounds.left, Math.min(bounds.right, position.x));
        position.y = Math.max(bounds.top, Math.min(bounds.bottom, position.y));
      });
    }
    return positions;
  }

  function networkEdges(items){
    const edges = [];
    const seen = new Set();
    const add = (from, to, kind = "related") => {
      if (from === to) return;
      const key = `${Math.min(from, to)}-${Math.max(from, to)}`;
      if (seen.has(key)) return;
      seen.add(key);
      edges.push({ from, to, kind });
    };
    // Conexiones locales basadas en el orden de fila de la hoja y la subcategoría.
    items.forEach((item, index) => {
      if (index + 1 < items.length) add(index, index + 1, "sequence");
      if (index + 2 < items.length && (index % 2 === 0 || item.subcategory === items[index + 2].subcategory)) add(index, index + 2, "related");
      const nextSameSubcategory = items.findIndex((candidate, candidateIndex) => candidateIndex > index && candidate.subcategory && candidate.subcategory === item.subcategory);
      if (nextSameSubcategory >= 0 && nextSameSubcategory - index > 2) add(index, nextSameSubcategory, "subcategory");
    });
    if (items.length > 3) add(items.length - 1, 0, "sequence");
    return edges;
  }

  function renderNetwork(){
    networkLinks.innerHTML = "";
    networkNodes.innerHTML = "";
    const filtered = getFilteredItems();
    const total = filtered.length;
    if (!total){
      const message = svgElement("text", { x: "380", y: "260", class: "category-network-empty" });
      message.textContent = "No hay elementos para mostrar";
      networkNodes.appendChild(message);
      return;
    }

    const positions = organicPositions(total);
    networkEdges(filtered).forEach(({ from, to, kind }) => {
      const edge = svgElement("line", {
        x1: positions[from].x, y1: positions[from].y,
        x2: positions[to].x, y2: positions[to].y,
        class: `category-network-edge category-network-edge-${kind}`
      });
      networkLinks.appendChild(edge);
    });

    const radius = total <= 24 ? 31 : total <= 72 ? 8 : 5.5;
    filtered.forEach((item, index) => {
      const position = positions[index];
      const sheetClass = String(item.source_sheet || "pot").toLocaleLowerCase("es").replace(/[^a-z0-9]+/g, "-");
      const node = svgElement("g", {
        class: `category-network-node category-network-node-${sheetClass}`,
        transform: `translate(${position.x.toFixed(1)},${position.y.toFixed(1)})`,
        tabindex: "0",
        role: "img",
        "aria-label": itemLabel(item)
      });
      const circle = svgElement("circle", { r: radius, class: "category-network-node-circle" });
      const tooltip = svgElement("title");
      tooltip.textContent = itemLabel(item);
      node.appendChild(tooltip);
      node.appendChild(circle);
      if (total <= 24){
        const icon = svgElement("text", { class: "category-network-icon", x: "0", y: "-9" });
        icon.textContent = iconForItem(item);
        node.appendChild(icon);
        const label = svgElement("text", { class: "category-network-label", x: "0", y: "5" });
        wrapNodeLabel(item.name, total <= 18 ? 11 : 13, 3).forEach((line, lineIndex) => {
          const tspan = svgElement("tspan", { x: "0", dy: lineIndex === 0 ? "0" : "9" });
          tspan.textContent = line;
          label.appendChild(tspan);
        });
        node.appendChild(label);
      }
      networkNodes.appendChild(node);
    });
    applyViewport();
  }

  function getFilteredItems(){
    const term = search.value.trim().toLocaleLowerCase("es");
    if (!term) return activeItems;
    return activeItems.filter(item => itemLabel(item).toLocaleLowerCase("es").includes(term));
  }

  function renderDataViews(){
    const filtered = getFilteredItems();
    count.textContent = `${filtered.length} elemento${filtered.length === 1 ? "" : "s"}`;
    renderTable(filtered);
    renderNetwork();
  }

  async function open(node, network){
    const category = resolveCategory(node, network);
    activeTitle = category.title;
    activeSheets = category.sheets;
    title.textContent = activeTitle;
    subtitle.textContent = "Cargando registros desde Supabase…";
    count.textContent = "…";
    list.innerHTML = `<tr><td class="items-list-empty-cell" colspan="4">Consultando los elementos de la categoría…</td></tr>`;
    networkLinks.innerHTML = "";
    networkNodes.innerHTML = "";
    search.value = "";
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    resetViewport();
    setView("network");
    search.focus({ preventScroll: true });

    try {
      const items = await window.rapotData.getPotItems();
      activeItems = activeSheets.length
        ? items.filter(item => activeSheets.includes(item.source_sheet))
        : items.filter(item => {
            const haystack = [item.source_sheet, item.source_header, item.subcategory, item.name].filter(Boolean).join(" ").toLocaleLowerCase("es");
            return activeTitle.toLocaleLowerCase("es").split(/\s+/).some(token => token.length > 4 && haystack.includes(token));
          });
      const sheetLabel = activeSheets.length ? activeSheets.join(" + ") : "hojas POT";
      subtitle.textContent = `${sheetLabel} · red y tabla sincronizadas con Supabase`;
      renderDataViews();
    } catch (error){
      console.error("RAPOT: error cargando elementos de categoría", error);
      activeItems = [];
      subtitle.textContent = "No fue posible consultar Supabase";
      count.textContent = "0 elementos";
      list.innerHTML = `<tr><td class="items-list-empty-cell" colspan="4">La consulta no respondió. Comprueba la conexión e inténtalo de nuevo.</td></tr>`;
      networkNodes.innerHTML = "";
    }
  }

  function close(){
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  search.addEventListener("input", renderDataViews);
  viewButtons.forEach(button => button.addEventListener("click", () => setView(button.dataset.categoryView)));
  zoomButtons.forEach(button => button.addEventListener("click", () => {
    const action = button.dataset.zoomAction;
    if (action === "in") changeZoom(0.2);
    else if (action === "out") changeZoom(-0.2);
    else resetViewport();
  }));
  networkCanvas.addEventListener("wheel", event => {
    if (currentView !== "network") return;
    event.preventDefault();
    changeZoom(event.deltaY < 0 ? 0.12 : -0.12);
  }, { passive: false });
  networkCanvas.addEventListener("pointerdown", event => {
    if (event.target.closest?.(".category-network-node")) return;
    dragState = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    networkCanvas.classList.add("is-dragging");
    networkCanvas.setPointerCapture?.(event.pointerId);
  });
  networkCanvas.addEventListener("pointermove", event => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const bounds = networkCanvas.getBoundingClientRect();
    panX = Math.max(-440, Math.min(440, panX + ((event.clientX - dragState.x) * 760 / Math.max(bounds.width, 1))));
    panY = Math.max(-300, Math.min(300, panY + ((event.clientY - dragState.y) * 520 / Math.max(bounds.height, 1))));
    dragState.x = event.clientX;
    dragState.y = event.clientY;
    applyViewport();
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => networkCanvas.addEventListener(type, () => {
    dragState = null;
    networkCanvas.classList.remove("is-dragging");
  }));
  networkCanvas.addEventListener("dblclick", resetViewport);
  document.addEventListener("keydown", event => {
    if (overlay.hidden || currentView !== "network") return;
    if (event.key === "+" || event.key === "=") changeZoom(0.2);
    if (event.key === "-" || event.key === "_") changeZoom(-0.2);
    if (event.key === "0") resetViewport();
  });
  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !overlay.hidden) close(); });

  window.rapotItems = { open, close, setView };
})();
