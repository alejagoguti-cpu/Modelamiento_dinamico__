/* RAPOT · Listado independiente de elementos por categoría.
 * Este módulo no reutiliza el SVG ni el modal de redes: abre un segundo diálogo
 * dedicado exclusivamente a mostrar todos los registros de la categoría seleccionada.
 */
(function initCategoryItems(){
  const overlay = document.getElementById("items-modal-overlay");
  if (!overlay) return;

  const modal = overlay.querySelector(".items-modal");
  const title = document.getElementById("items-modal-title");
  const subtitle = document.getElementById("items-modal-subtitle");
  const count = document.getElementById("items-modal-count");
  const list = document.getElementById("items-list");
  const search = document.getElementById("items-search");
  const closeButton = document.getElementById("items-modal-close");
  let activeItems = [];
  let activeTitle = "Elementos de la categoría";
  let activeSheets = [];

  // El Excel está organizado por hojas temáticas. Estas correspondencias permiten
  // que un nodo analítico como “Red Vial Completa” abra todas sus hojas relacionadas.
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

  function escapeHtml(value){
    return String(value ?? "").replace(/[&<>'"]/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[char]));
  }

  function resolveCategory(node, network){
    const explicit = SHEETS_BY_GROUP[node?.groupName];
    if (explicit) return explicit;
    const raw = [node?.groupName, ...(node?.label || []), node?.id, network?.title].filter(Boolean).join(" ");
    const normalized = raw.toLocaleLowerCase("es");
    const resolved = SHEETS_BY_CATEGORY.find(category => category.match.some(token => normalized.includes(token)));
    if (resolved) return resolved;
    return { title: node?.groupName || node?.label?.join(" ") || network?.title || "Elementos POT", sheets: [] };
  }

  function renderItems(){
    const term = search.value.trim().toLocaleLowerCase("es");
    const filtered = term
      ? activeItems.filter(item => [item.name, item.source_sheet, item.source_header, item.subcategory].filter(Boolean).join(" ").toLocaleLowerCase("es").includes(term))
      : activeItems;
    count.textContent = `${filtered.length} elemento${filtered.length === 1 ? "" : "s"}`;
    if (!filtered.length){
      list.innerHTML = `<div class="items-list-empty">No se encontraron elementos${term ? ` para “${escapeHtml(term)}”` : ""} en esta categoría.</div>`;
      return;
    }
    list.innerHTML = filtered.map((item, index) => `
      <article class="items-list-item">
        <span class="items-list-index">${String(index + 1).padStart(2, "0")}</span>
        <div class="items-list-name">
          ${escapeHtml(item.name)}
          <small class="items-list-meta">${escapeHtml(item.source_sheet)}${item.subcategory ? ` · ${escapeHtml(item.subcategory)}` : ""}</small>
        </div>
      </article>
    `).join("");
  }

  async function open(node, network){
    const category = resolveCategory(node, network);
    activeTitle = category.title;
    activeSheets = category.sheets;
    title.textContent = activeTitle;
    subtitle.textContent = "Cargando registros desde Supabase…";
    count.textContent = "…";
    list.innerHTML = `<div class="items-list-loading">Consultando los elementos de la categoría…</div>`;
    search.value = "";
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
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
      subtitle.textContent = `${sheetLabel} · consulta dinámica en Supabase`;
      renderItems();
    } catch (error){
      console.error("RAPOT: error cargando elementos de categoría", error);
      activeItems = [];
      subtitle.textContent = "No fue posible consultar Supabase";
      list.innerHTML = `<div class="items-list-empty">La consulta no respondió. Comprueba la conexión e inténtalo de nuevo.</div>`;
      count.textContent = "0 elementos";
    }
  }

  function close(){
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  search.addEventListener("input", renderItems);
  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !overlay.hidden) close(); });

  window.rapotItems = { open, close };
})();
