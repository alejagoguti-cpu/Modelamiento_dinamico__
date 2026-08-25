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
  const networkLinks = document.getElementById("category-network-links");
  const networkNodes = document.getElementById("category-network-nodes");
  const viewButtons = [...overlay.querySelectorAll("[data-category-view]")];

  let activeItems = [];
  let activeTitle = "Elementos de la categoría";
  let activeSheets = [];
  let currentView = "network";

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
    "Sistema Hídrico": { title: "Sistema hídrico y humedales", sheets: ["Sistema Hídrico", "Humedales"] },
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

  function layoutPosition(index, total){
    // Para conjuntos pequeños, el patrón radial hace visible la red de Humedales.
    if (total <= 36){
      const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
      const radius = total <= 18 ? 178 : 214;
      return { x: 380 + radius * Math.cos(angle), y: 260 + radius * Math.sin(angle) };
    }
    // Para categorías grandes, todos los elementos siguen presentes en una malla legible.
    const columns = total > 180 ? 24 : 18;
    const column = index % columns;
    const row = Math.floor(index / columns);
    return { x: 24 + column * (712 / Math.max(columns - 1, 1)), y: 24 + row * 18 };
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

    const positions = filtered.map((_, index) => layoutPosition(index, total));
    const center = { x: 380, y: 260 };
    const hub = svgElement("circle", { cx: center.x, cy: center.y, r: total <= 36 ? 32 : 16, class: "category-network-hub" });
    networkNodes.appendChild(hub);

    filtered.forEach((item, index) => {
      const position = positions[index];
      const radius = total <= 36 ? Math.max(17, 27 - total * 0.25) : 5.5;
      const edge = svgElement("line", {
        x1: center.x, y1: center.y, x2: position.x, y2: position.y,
        class: "category-network-edge"
      });
      networkLinks.appendChild(edge);

      const node = svgElement("g", {
        class: "category-network-node",
        transform: `translate(${position.x.toFixed(1)},${position.y.toFixed(1)})`,
        tabindex: "0",
        role: "img",
        "aria-label": itemLabel(item)
      });
      const circle = svgElement("circle", { r: radius });
      const tooltip = svgElement("title");
      tooltip.textContent = itemLabel(item);
      node.appendChild(tooltip);
      node.appendChild(circle);
      if (total <= 36){
        const text = svgElement("text", { class: "category-network-label", y: radius + 15 });
        text.textContent = item.name;
        node.appendChild(text);
      }
      networkNodes.appendChild(node);
    });

    if (total <= 36){
      const hubLabel = svgElement("text", { x: center.x, y: center.y + 4, class: "category-network-hub-label" });
      hubLabel.textContent = total;
      networkNodes.appendChild(hubLabel);
    }
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
  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !overlay.hidden) close(); });

  window.rapotItems = { open, close, setView };
})();
