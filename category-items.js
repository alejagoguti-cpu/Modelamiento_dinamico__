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
  const backButton = document.getElementById("items-modal-back");

  let activeItems = [];
  let activeTitle = "Elementos de la categoría";
  let activeSheets = [];
  let currentView = "network";
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let sceneWidth = 760;
  let sceneHeight = 520;
  let dragState = null;
  let parentContext = null;
  let activeChildCategories = [];

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

  function normalizeSheet(value){
    return Array.from(String(value || "").trim().normalize("NFD")).filter(char => {
      const code = char.charCodeAt(0);
      return code < 768 || code > 879;
    }).join("").toLocaleLowerCase("es");
  }

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

  function applySceneSize(width, height){
    sceneWidth = Math.max(760, Math.ceil(width));
    sceneHeight = Math.max(520, Math.ceil(height));
    networkSvg.setAttribute("viewBox", `0 0 ${sceneWidth} ${sceneHeight}`);
    networkSvg.style.width = `${Math.ceil(sceneWidth * zoom)}px`;
    networkSvg.style.height = `${Math.ceil(sceneHeight * zoom)}px`;
  }

  function applyViewport(){
    // El zoom se aplica al tamaño físico del SVG: así la red crece de verdad,
    // aparecen barras de desplazamiento y cada etiqueta se puede leer al acercar.
    const maxPanX = Math.max(180, sceneWidth * 0.42);
    const maxPanY = Math.max(130, sceneHeight * 0.42);
    panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
    panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
    networkScene.setAttribute("transform", `translate(${panX.toFixed(1)} ${panY.toFixed(1)})`);
    networkSvg.style.width = `${Math.ceil(sceneWidth * zoom)}px`;
    networkSvg.style.height = `${Math.ceil(sceneHeight * zoom)}px`;
    zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
  }

  function resetViewport(){
    zoom = 1;
    panX = 0;
    panY = 0;
    applyViewport();
  }

  function changeZoom(delta){
    const previousZoom = zoom;
    const centerX = networkCanvas.scrollLeft + networkCanvas.clientWidth / 2;
    const centerY = networkCanvas.scrollTop + networkCanvas.clientHeight / 2;
    zoom = Math.max(0.65, Math.min(6, Number((zoom + delta).toFixed(2))));
    applyViewport();
    requestAnimationFrame(() => {
      const ratio = zoom / previousZoom;
      networkCanvas.scrollLeft = Math.max(0, centerX * ratio - networkCanvas.clientWidth / 2);
      networkCanvas.scrollTop = Math.max(0, centerY * ratio - networkCanvas.clientHeight / 2);
    });
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
    if (currentView === "network"){
      if (activeChildCategories.length) renderCategoryMenuNetwork();
      else renderNetwork();
    }
  }

  function filteredChildCategories(){
    const term = search.value.trim().toLocaleLowerCase("es");
    if (!term) return activeChildCategories;
    return activeChildCategories.filter(category => [category.name, ...(category.item_sheets || [])].join(" ").toLocaleLowerCase("es").includes(term));
  }

  const ICON_CODE_BY_CATEGORY = {
    "fa-graduation-cap": 0xf19d, "fa-heart-pulse": 0xf21e, "fa-masks-theater": 0xf630,
    "fa-futbol": 0xf1e3, "fa-hand-holding-heart": 0xf4be, "fa-tree": 0xf1bb,
    "fa-road": 0xf018, "fa-bicycle": 0xf206, "fa-water": 0xf773, "fa-droplet": 0xf043,
    "fa-landmark": 0xf66f, "fa-store": 0xf54e, "fa-location-dot": 0xf3c5
  };

  function renderCategoryMenuNetwork(){
    networkLinks.innerHTML = "";
    networkNodes.innerHTML = "";
    const categories = filteredChildCategories();
    if (!categories.length){
      const message = svgElement("text", { x: "380", y: "260", class: "category-network-empty" });
      message.textContent = "No se encontraron subcategorías";
      networkNodes.appendChild(message);
      return;
    }
    const categoryRadii = categories.map(category => category.item_count > 100 ? 38 : category.item_count > 70 ? 34 : 31);
    const layout = organicLayout(categories.length, categoryRadii);
    const positions = layout.positions;
    applySceneSize(layout.width, layout.height);
    for (let index = 1; index < categories.length; index++){
      const geometry = edgeGeometry(positions[index - 1], positions[index], categoryRadii[index - 1], categoryRadii[index], "subcategory", index, positions.map((position, nodeIndex) => ({ ...position, radius: categoryRadii[nodeIndex] })).filter((_, nodeIndex) => nodeIndex !== index - 1 && nodeIndex !== index));
      const edge = svgElement(geometry.type === "path" ? "path" : "line", {
        ...(geometry.type === "path" ? { d: geometry.d } : { x1: geometry.x1, y1: geometry.y1, x2: geometry.x2, y2: geometry.y2 }),
        class: "category-network-edge category-network-edge-subcategory"
      });
      networkLinks.appendChild(edge);
    }
    categories.forEach((category, index) => {
      const radius = categoryRadii[index];
      const position = positions[index];
      const node = svgElement("g", {
        class: "category-network-node category-network-node-subcategory",
        transform: `translate(${position.x.toFixed(1)},${position.y.toFixed(1)})`,
        tabindex: "0", role: "button", "aria-label": `${category.name} · ${category.item_count} elementos`
      });
      const circle = svgElement("circle", { r: radius, class: "category-network-node-circle" });
      if (category.color) circle.style.stroke = category.color;
      const icon = svgElement("text", { class: "category-network-icon", x: "0", y: "-7" });
      icon.textContent = String.fromCodePoint(ICON_CODE_BY_CATEGORY[category.icon] || 0xf1b9);
      if (category.color) icon.style.fill = category.color;
      const label = svgElement("text", { class: "category-network-label", x: "0", y: "7" });
        wrapFullNodeLabel(category.name, categories.length > 6 ? 12 : 15).forEach((line, lineIndex) => {
        const tspan = svgElement("tspan", { x: "0", dy: lineIndex === 0 ? "0" : "9" });
        tspan.textContent = line;
        label.appendChild(tspan);
      });
      node.append(circle, icon, label);
      const openChild = event => {
        event.preventDefault();
        event.stopPropagation();
        open(category, parentContext?.network);
      };
      node.addEventListener("click", openChild);
      node.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") openChild(event);
      });
      networkNodes.appendChild(node);
    });
    applyViewport();
    centerCanvas();
  }

  function renderCategoryMenuTable(){
    const categories = filteredChildCategories();
    if (!categories.length){
      list.innerHTML = `<tr><td class="items-list-empty-cell" colspan="4">No se encontraron subcategorías.</td></tr>`;
      return;
    }
    list.innerHTML = categories.map((category, index) => `
      <tr class="items-table-row items-category-row" data-child-index="${index}" tabindex="0">
        <td class="items-table-index">${String(index + 1).padStart(2, "0")}</td>
        <td class="items-table-name"><span class="items-category-color" style="--category-color:${escapeHtml(category.color || "#3fd0bf")}"></span>${escapeHtml(category.name)}</td>
        <td>${escapeHtml((category.item_sheets || []).join(" + ") || "—")}</td>
        <td>${Number(category.item_count || 0)} elementos</td>
      </tr>
    `).join("");
    list.querySelectorAll("[data-child-index]").forEach((row, index) => {
      const openChild = event => {
        event.preventDefault();
        event.stopPropagation();
        open(categories[index], parentContext?.network);
      };
      row.addEventListener("click", openChild);
      row.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") openChild(event);
      });
    });
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

  function organicLayout(total, radii = []){
    // Semilla determinista tipo phyllotaxis: nunca se convierte en una cuadrícula.
    // El lienzo aumenta según el volumen para conservar un nodo visible por elemento.
    const maxRadius = Math.max(24, ...(radii.length ? radii : [30]));
    const gap = total > 500 ? 12 : total > 180 ? 16 : total > 72 ? 22 : 30;
    const step = Math.max(maxRadius * 2 + gap, total > 500 ? 68 : total > 180 ? 74 : 86);
    const radialExtent = Math.max(0, Math.sqrt(Math.max(total - 1, 0)) * step * 0.82);
    const width = Math.max(900, Math.ceil(radialExtent * 2.2 + maxRadius * 2 + 90));
    const height = Math.max(640, Math.ceil(radialExtent * 1.62 + maxRadius * 2 + 90));
    const center = { x: width / 2, y: height / 2 };
    const positions = Array.from({ length: total }, (_, index) => {
      const angle = -Math.PI / 2 + index * 2.3999632297;
      const ratio = total <= 1 ? 0 : Math.sqrt(index / (total - 1));
      const spread = radialExtent * ratio;
      return {
        x: center.x + Math.cos(angle) * spread * 1.03,
        y: center.y + Math.sin(angle) * spread * 0.75
      };
    });
    const bounds = {
      left: maxRadius + 34,
      right: width - maxRadius - 34,
      top: maxRadius + 34,
      bottom: height - maxRadius - 34
    };
    const iterations = total > 500 ? 6 : total > 180 ? 14 : total > 72 ? 32 : 72;
    for (let iteration = 0; iteration < iterations; iteration++){
      for (let a = 0; a < positions.length; a++){
        for (let b = a + 1; b < positions.length; b++){
          const dx = positions[b].x - positions[a].x;
          const dy = positions[b].y - positions[a].y;
          const distance = Math.max(Math.hypot(dx, dy), 0.01);
          const minimum = (radii[a] || maxRadius) + (radii[b] || maxRadius) + gap;
          if (distance >= minimum) continue;
          const push = (minimum - distance) * (total > 180 ? 0.12 : 0.10);
          const ux = dx / distance;
          const uy = dy / distance;
          positions[a].x -= ux * push;
          positions[a].y -= uy * push;
          positions[b].x += ux * push;
          positions[b].y += uy * push;
        }
      }
      positions.forEach((position, index) => {
        const radius = radii[index] || maxRadius;
        position.x = Math.max(bounds.left + radius - maxRadius, Math.min(bounds.right - radius + maxRadius, position.x));
        position.y = Math.max(bounds.top + radius - maxRadius, Math.min(bounds.bottom - radius + maxRadius, position.y));
      });
    }
    return { positions, width, height };
  }

  function wrapFullNodeLabel(value, maxChars = 13){
    const words = String(value || "Elemento").split(/\s+/).filter(Boolean);
    const lines = [];
    let current = "";
    const pushWord = word => {
      if (word.length <= maxChars){
        if (!current || `${current} ${word}`.length <= maxChars) current = current ? `${current} ${word}` : word;
        else { lines.push(current); current = word; }
        return;
      }
      if (current) { lines.push(current); current = ""; }
      for (let offset = 0; offset < word.length; offset += maxChars) lines.push(word.slice(offset, offset + maxChars));
    };
    words.forEach(pushWord);
    if (current) lines.push(current);
    return lines.length ? lines : ["Elemento"];
  }

  function centerCanvas(){
    requestAnimationFrame(() => {
      networkCanvas.scrollLeft = Math.max(0, (networkCanvas.scrollWidth - networkCanvas.clientWidth) / 2);
      networkCanvas.scrollTop = Math.max(0, (networkCanvas.scrollHeight - networkCanvas.clientHeight) / 2);
    });
  }

  function itemNodeSpec(item, total){
    const fontSize = total <= 24 ? 10 : total <= 72 ? 9.2 : total <= 180 ? 8.4 : total <= 400 ? 7.8 : 7.2;
    const maxChars = total <= 24 ? 15 : total <= 72 ? 14 : total <= 180 ? 13 : total <= 400 ? 12 : 11;
    const lines = wrapFullNodeLabel(item.name, maxChars);
    const lineHeight = fontSize + 2.4;
    const textHeight = lines.length * lineHeight;
    const radius = Math.max(total <= 24 ? 31 : total <= 72 ? 25 : total <= 180 ? 23 : 21, Math.ceil((textHeight + fontSize + 18) / 2));
    return { lines, radius, fontSize, iconSize: fontSize + 5 };
  }

  function networkEdges(items, positions = []){
    const edges = [];
    const seen = new Set();
    const add = (from, to, kind = "related") => {
      if (from === to) return;
      const key = `${Math.min(from, to)}-${Math.max(from, to)}`;
      if (seen.has(key)) return;
      seen.add(key);
      edges.push({ from, to, kind });
    };
    // Cada nodo se une al vecino anterior más cercano. Así la red sigue siendo
    // orgánica y conectada, pero no produce diagonales largas que crucen el mapa.
    const dense = items.length > 72;
    for (let index = 1; index < items.length; index++){
      const nearest = positions.slice(0, index)
        .map((position, candidateIndex) => ({ candidateIndex, distance: Math.hypot(position.x - positions[index].x, position.y - positions[index].y) }))
        .sort((a, b) => a.distance - b.distance);
      if (nearest[0]) add(index, nearest[0].candidateIndex, "sequence");
      if (!dense && index % 3 === 0 && nearest[1]) add(index, nearest[1].candidateIndex, "related");
      if (item.subcategory && index % (dense ? 9 : 4) === 0){
        const sameSubcategory = nearest.find(candidate => items[candidate.candidateIndex].subcategory && items[candidate.candidateIndex].subcategory === item.subcategory);
        if (sameSubcategory) add(index, sameSubcategory.candidateIndex, "subcategory");
      }
    }
    return edges;
  }

  function lineSamples(start, end, count = 24){
    return Array.from({ length: count + 1 }, (_, sampleIndex) => {
      const t = sampleIndex / count;
      return { x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t };
    });
  }

  function curveSamples(start, control, end, count = 28){
    return Array.from({ length: count + 1 }, (_, sampleIndex) => {
      const t = sampleIndex / count;
      const inverse = 1 - t;
      return {
        x: inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * end.x,
        y: inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * end.y
      };
    });
  }

  function routeHitsNode(samples, obstacles, clearance = 3){
    return obstacles.some(obstacle => samples.some(point => Math.hypot(point.x - obstacle.x, point.y - obstacle.y) < obstacle.radius + clearance));
  }

  function edgeGeometry(from, to, fromRadius, toRadius, kind, index, obstacles = []){
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.max(Math.hypot(dx, dy), 0.01);
    const ux = dx / distance;
    const uy = dy / distance;
    const inset = 6;
    const start = { x: from.x + ux * (fromRadius + inset), y: from.y + uy * (fromRadius + inset) };
    const end = { x: to.x - ux * (toRadius + inset), y: to.y - uy * (toRadius + inset) };
    const candidates = [0, 1, -1, 2, -2, 3, -3, 4, -4];
    const bendBase = Math.min(150, Math.max(28, distance * (kind === "subcategory" ? 0.20 : 0.14)));
    const orderedCandidates = candidates.sort((a, b) => {
      const aScore = Math.abs(a - (index % 2 === 0 ? 1 : -1));
      const bScore = Math.abs(b - (index % 2 === 0 ? 1 : -1));
      return aScore - bScore;
    });
    let best = null;
    orderedCandidates.forEach(multiplier => {
      const midpoint = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
      const bend = multiplier * bendBase;
      const control = { x: midpoint.x - uy * bend, y: midpoint.y + ux * bend };
      const samples = multiplier === 0 ? lineSamples(start, end) : curveSamples(start, control, end);
      const hitCount = obstacles.reduce((count, obstacle) => count + (samples.some(point => Math.hypot(point.x - obstacle.x, point.y - obstacle.y) < obstacle.radius + 3) ? 1 : 0), 0);
      const score = hitCount * 1000 + Math.abs(multiplier) * 0.8 + (multiplier === 0 ? 0 : 1);
      if (!best || score < best.score) best = { multiplier, control, hitCount, score };
    });
    if (best?.multiplier === 0 && best.hitCount === 0) return { type: "line", x1: start.x, y1: start.y, x2: end.x, y2: end.y };
    const control = best?.control || { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    return { type: "path", d: `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${control.x.toFixed(1)} ${control.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}` };
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

    const specs = filtered.map(item => itemNodeSpec(item, total));
    const layout = organicLayout(total, specs.map(spec => spec.radius));
    const positions = layout.positions;
    applySceneSize(layout.width, layout.height);
    networkEdges(filtered, positions).forEach(({ from, to, kind }, edgeIndex) => {
      const geometry = edgeGeometry(positions[from], positions[to], specs[from].radius, specs[to].radius, kind, edgeIndex, positions.map((position, nodeIndex) => ({ ...position, radius: specs[nodeIndex].radius })).filter((_, nodeIndex) => nodeIndex !== from && nodeIndex !== to));
      const edge = svgElement(geometry.type === "path" ? "path" : "line", {
        ...(geometry.type === "path" ? { d: geometry.d } : { x1: geometry.x1, y1: geometry.y1, x2: geometry.x2, y2: geometry.y2 }),
        class: `category-network-edge category-network-edge-${kind}`
      });
      networkLinks.appendChild(edge);
    });

    filtered.forEach((item, index) => {
      const position = positions[index];
      const spec = specs[index];
      const sheetClass = String(item.source_sheet || "pot").toLocaleLowerCase("es").replace(/[^a-z0-9]+/g, "-");
      const node = svgElement("g", {
        class: `category-network-node category-network-node-${sheetClass}`,
        transform: `translate(${position.x.toFixed(1)},${position.y.toFixed(1)})`,
        tabindex: "0",
        role: "img",
        "aria-label": itemLabel(item)
      });
      const circle = svgElement("circle", { r: spec.radius, class: "category-network-node-circle" });
      const tooltip = svgElement("title");
      tooltip.textContent = itemLabel(item);
      node.appendChild(tooltip);
      node.appendChild(circle);

      // Cada elemento mantiene su identidad aun en redes de 1.000 nodos.
      // El zoom físico del SVG permite leer estas etiquetas sin descartarlas.
      const icon = svgElement("text", { class: "category-network-icon", x: "0", y: `${-(spec.lines.length * (spec.fontSize + 2.4)) / 2 - 2}`, style: `font-size:${spec.iconSize}px` });
      icon.textContent = iconForItem(item);
      node.appendChild(icon);
      const label = svgElement("text", { class: "category-network-label", x: "0", y: `${-(spec.lines.length * (spec.fontSize + 2.4)) / 2 + spec.fontSize + 4}`, style: `font-size:${spec.fontSize}px` });
      spec.lines.forEach((line, lineIndex) => {
        const tspan = svgElement("tspan", { x: "0", dy: lineIndex === 0 ? "0" : `${spec.fontSize + 2.4}` });
        tspan.textContent = line;
        label.appendChild(tspan);
      });
      node.appendChild(label);
      networkNodes.appendChild(node);
    });
    applyViewport();
    centerCanvas();
  }

  function getFilteredItems(){
    const term = search.value.trim().toLocaleLowerCase("es");
    if (!term) return activeItems;
    return activeItems.filter(item => itemLabel(item).toLocaleLowerCase("es").includes(term));
  }

  function renderDataViews(){
    if (activeChildCategories.length){
      const categories = filteredChildCategories();
      count.textContent = `${categories.length} subcategoría${categories.length === 1 ? "" : "s"}`;
      renderCategoryMenuTable();
      renderCategoryMenuNetwork();
      return;
    }
    const filtered = getFilteredItems();
    count.textContent = `${filtered.length} elemento${filtered.length === 1 ? "" : "s"}`;
    renderTable(filtered);
    renderNetwork();
  }

  function openCategoryMenu(node, network){
    parentContext = { node, network };
    activeChildCategories = Array.isArray(node.categoryChildren) ? node.categoryChildren : [];
    activeItems = [];
    activeSheets = [];
    activeTitle = node.groupName || node.label?.join(" ") || "Categorías";
    title.textContent = activeTitle;
    subtitle.textContent = "Selecciona una subcategoría para explorar sus datos exclusivos de Supabase.";
    count.textContent = `${activeChildCategories.length} subcategorías`;
    list.innerHTML = "";
    search.value = "";
    backButton.hidden = true;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    resetViewport();
    setView("network");
    search.focus({ preventScroll: true });
  }

  async function open(node, network){
    const category = resolveCategory(node, network);
    activeTitle = category.title;
    activeSheets = category.sheets;
    title.textContent = activeTitle;
    subtitle.textContent = "Cargando registros desde Supabase…";
    activeChildCategories = [];
    backButton.hidden = !parentContext;
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
      const allowedSheets = new Set(activeSheets.map(normalizeSheet));
      activeItems = activeSheets.length
        ? items.filter(item => allowedSheets.has(normalizeSheet(item.source_sheet)))
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
    parentContext = null;
    activeChildCategories = [];
  }

  backButton?.addEventListener("click", event => {
    event.preventDefault();
    if (parentContext) openCategoryMenu(parentContext.node, parentContext.network);
  });

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

  window.rapotItems = { open, openCategoryMenu, close, setView };
})();
