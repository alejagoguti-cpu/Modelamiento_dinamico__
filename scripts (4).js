// ===================== DATOS DE LAS RELACIONES (tabla del POT) =====================
const relations = {
  e1: {
    label: "EEP → ESECI",
    quote: "la conservación del ambiente como formas de productividad, sustento y desarrollo sostenible.",
    page: "p. 31"
  },
  e2: {
    label: "EIP → EEP",
    quote: "Por eso promovemos la ciudad a que reconozca el patrimonio local, las dinámicas comunitarias, los sistemas cooperativos de producción sostenible como huertas productivas, bancos de semillas nativas y plantas de uso medicinal, entre otros.",
    page: "p. 31"
  },
  e3: {
    label: "EFC → EEP",
    quote: "En la ruralidad es urgente mejorar las condiciones habitacionales, desde los componentes de servicios públicos domiciliarios, accesibilidad y movilidad, con equipamientos que faciliten la economía campesina, familiar y comunitaria, el turismo responsable de naturaleza que vincule residentes y saberes del lugar y la conservación del ambiente como formas de productividad, sustento y desarrollo sostenible.",
    page: "p. 31"
  },
  e4: {
    label: "EFC → ESECI",
    quote: "Bajo la nueva visión del POT, la infraestructura social es compatible con otros usos y equipamientos, como centros deportivos, culturales y de recreación, entre otros. Esto propicia infraestructuras compartidas y multifuncionales que contribuyen a la interculturalidad, que estimulan la permanencia de los estudiantes en el sistema educativo y que promueven la generación de conocimiento.",
    page: "p. 126"
  },
  e5: {
    label: "EIP → EFC",
    quote: "El POT busca intervenir estratégicamente, vinculando las dinámicas patrimoniales, ambientales, sociales y culturales para proteger y garantizar la permanencia y calidad de vida de los pobladores originales de las zonas de renovación urbana y actuaciones estratégicas.",
    page: "p. 30"
  },
  e6: {
    label: "EIP → ESECI",
    quote: "El mismo planteamiento vincula patrimonio local, dinámicas comunitarias y producción sostenible, permitiendo analizar su relación con la dimensión socioeconómica.",
    page: "p. 35"
  }
};
// ===================== POPUP DE RELACIONES =====================
(function initRelationPopups(){
  const links = document.querySelectorAll(".link[data-relation]");
  function closePopup(){
    const existing = document.querySelector(".pot-popup");
    if (existing) existing.remove();
    document.removeEventListener("click", onOutsideClick, true);
  }
  function onOutsideClick(e){
    const popup = document.querySelector(".pot-popup");
    if (popup && !popup.contains(e.target) && !e.target.closest(".link")) {
      closePopup();
    }
  }
  function openPopup(relationId, x, y){
    closePopup();
    const data = relations[relationId];
    if (!data) return;
    const popup = document.createElement("div");
    popup.className = "pot-popup";
    popup.innerHTML = `
      <button class="pot-popup-close" aria-label="Cerrar">✕</button>
      <div class="pot-relation">${data.label}</div>
      <div class="pot-quote">&ldquo;${data.quote}&rdquo;</div>
      <div class="pot-page">${data.page}</div>
    `;
    document.body.appendChild(popup);
    // posicionar y ajustar para que no se salga de la pantalla
    const rect = popup.getBoundingClientRect();
    const margin = 16;
    let left = x + 16;
    let top = y + 16;
    if (left + rect.width + margin > window.innerWidth) {
      left = x - rect.width - 16;
    }
    if (top + rect.height + margin > window.innerHeight) {
      top = window.innerHeight - rect.height - margin;
    }
    if (left < margin) left = margin;
    if (top < margin) top = margin;
    popup.style.left = left + "px";
    popup.style.top = top + "px";
    popup.querySelector(".pot-popup-close").addEventListener("click", (ev) => {
      ev.stopPropagation();
      closePopup();
    });
    setTimeout(() => document.addEventListener("click", onOutsideClick, true), 0);
  }
  links.forEach((link) => {
    const relationId = link.getAttribute("data-relation");
    link.addEventListener("click", (e) => {
      e.stopPropagation();
      links.forEach((l) => l.classList.remove("link-active"));
      link.classList.add("link-active");
      openPopup(relationId, e.clientX, e.clientY);
    });
    // accesibilidad: abrir con teclado (Enter / espacio)
    link.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const box = link.getBoundingClientRect();
        links.forEach((l) => l.classList.remove("link-active"));
        link.classList.add("link-active");
        openPopup(relationId, box.left + box.width / 2, box.top + box.height / 2);
      }
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePopup();
  });
})();
// ===================== DIAGRAMA INTERACTIVO (arrastrar nodos, tipo imán) =====================
(function initDraggableDiagram(){
  const svg = document.getElementById("network-svg");
  if (!svg) return;
  // posiciones y radios base de cada nodo (deben coincidir con el transform inicial del HTML)
  const nodeDefs = {
    green:  { cx: 330, cy: 110, r: 62 },
    purple: { cx: 140, cy: 300, r: 58 },
    blue:   { cx: 500, cy: 300, r: 58 },
    yellow: { cx: 330, cy: 480, r: 64 }
  };
  // vector de "curvatura" fijo de cada relación (control - punto medio), tomado del diseño original
  const edgeDefs = [
    { id: "e1", from: "green",  to: "yellow", bow: { x: 30.1,  y: 1      } },
    { id: "e2", from: "purple", to: "green",  bow: { x: -25.6, y: -29.35 } },
    { id: "e3", from: "blue",   to: "green",  bow: { x: 24.1,  y: -29.5  } },
    { id: "e4", from: "blue",   to: "yellow", bow: { x: 23.05, y: 28.85  } },
    { id: "e5", from: "purple", to: "blue",   bow: { x: 0,     y: 67.9   } },
    { id: "e6", from: "purple", to: "yellow", bow: { x: -24.65,y: 28.8   } }
  ];
  const ids = Object.keys(nodeDefs);
  // estado físico: posición absoluta actual, velocidad, si se está arrastrando
  const state = {};
  ids.forEach((id) => {
    const n = nodeDefs[id];
    state[id] = { x: n.cx, y: n.cy, vx: 0, vy: 0, dragging: false };
  });
  // todos los pares de nodos (grafo completo) con su distancia original "de reposo".
  // esto es lo que hace el efecto imán: cada par intenta mantener su separación original.
  const pairs = [];
  for (let i = 0; i < ids.length; i++){
    for (let j = i + 1; j < ids.length; j++){
      const a = nodeDefs[ids[i]], b = nodeDefs[ids[j]];
      const rest = Math.hypot(b.cx - a.cx, b.cy - a.cy);
      pairs.push({ a: ids[i], b: ids[j], rest });
    }
  }
  const K_HOME = 16;   // qué tanto "recuerda" cada bolita su lugar original
  const K_EDGE = 42;   // fuerza del "imán" entre bolitas conectadas
  const DAMPING = 12;  // fricción, evita que oscile para siempre
  const SETTLE_EPS = 0.05;
  let rafId = null;
  let lastFrame = null;
  function toSvgPoint(evt){
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const ctm = svg.getScreenCTM();
    return pt.matrixTransform(ctm.inverse());
  }
  function updateNodeTransform(id){
    const g = svg.querySelector(`[data-node="${id}"]`);
    if (!g) return;
    const s = state[id];
    g.setAttribute("transform", `translate(${s.x.toFixed(2)},${s.y.toFixed(2)})`);
  }
  function updateEdge(edge){
    const g = svg.querySelector(`.link[data-relation="${edge.id}"]`);
    if (!g) return;
    const nA = nodeDefs[edge.from], nB = nodeDefs[edge.to];
    const A = state[edge.from], B = state[edge.to];
    let ux = B.x - A.x, uy = B.y - A.y;
    const dist = Math.hypot(ux, uy) || 1;
    ux /= dist; uy /= dist;
    const P0 = { x: A.x + ux * nA.r, y: A.y + uy * nA.r };
    const P1 = { x: B.x - ux * nB.r, y: B.y - uy * nB.r };
    const mid = { x: (P0.x + P1.x) / 2, y: (P0.y + P1.y) / 2 };
    const C = { x: mid.x + edge.bow.x, y: mid.y + edge.bow.y };
    const d = `M${P0.x.toFixed(1)},${P0.y.toFixed(1)} Q${C.x.toFixed(1)},${C.y.toFixed(1)} ${P1.x.toFixed(1)},${P1.y.toFixed(1)}`;
    const line = g.querySelector(".link-line");
    const hit = g.querySelector(".link-hit");
    const arrow = g.querySelector(".link-arrow");
    if (line) line.setAttribute("d", d);
    if (hit) hit.setAttribute("d", d);
    if (arrow){
      const dx2 = 2 * (P1.x - C.x), dy2 = 2 * (P1.y - C.y);
      const angle = Math.atan2(dy2, dx2) * 180 / Math.PI;
      arrow.setAttribute("transform", `translate(${P1.x.toFixed(1)},${P1.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
    }
  }
  function updateAllEdges(){
    edgeDefs.forEach(updateEdge);
  }
  function stepPhysics(dt){
    // fuerza acumulada sobre cada nodo este fotograma
    const forces = {};
    ids.forEach((id) => { forces[id] = { fx: 0, fy: 0 }; });
    // 1) resorte débil hacia la posición original de cada nodo
    ids.forEach((id) => {
      const n = nodeDefs[id], s = state[id];
      forces[id].fx += K_HOME * (n.cx - s.x);
      forces[id].fy += K_HOME * (n.cy - s.y);
    });
    // 2) "imán": cada par conectado intenta mantener su distancia original,
    //    así que si arrastras uno, jala a los demás detrás de él
    pairs.forEach(({ a, b, rest }) => {
      const sa = state[a], sb = state[b];
      const dx = sb.x - sa.x, dy = sb.y - sa.y;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist, uy = dy / dist;
      const stretch = dist - rest;
      const fx = K_EDGE * stretch * ux;
      const fy = K_EDGE * stretch * uy;
      forces[a].fx += fx; forces[a].fy += fy;
      forces[b].fx -= fx; forces[b].fy -= fy;
    });
    let anyMoving = false;
    ids.forEach((id) => {
      const s = state[id];
      if (s.dragging){ anyMoving = true; return; }
      const f = forces[id];
      const ax = f.fx - DAMPING * s.vx;
      const ay = f.fy - DAMPING * s.vy;
      s.vx += ax * dt;
      s.vy += ay * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const n = nodeDefs[id];
      const atHome = Math.abs(s.x - n.cx) < SETTLE_EPS && Math.abs(s.y - n.cy) < SETTLE_EPS;
      const atRest = Math.abs(s.vx) < SETTLE_EPS && Math.abs(s.vy) < SETTLE_EPS;
      if (atHome && atRest){
        s.x = n.cx; s.y = n.cy; s.vx = 0; s.vy = 0;
      } else {
        anyMoving = true;
      }
      updateNodeTransform(id);
    });
    updateAllEdges();
    return anyMoving;
  }
  function loop(ts){
    if (lastFrame === null) lastFrame = ts;
    const dt = Math.min((ts - lastFrame) / 1000, 0.032);
    lastFrame = ts;
    const draggingAny = ids.some((id) => state[id].dragging);
    const moving = stepPhysics(dt);
    if (moving || draggingAny){
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = null;
      lastFrame = null;
    }
  }
  function ensureLoop(){
    if (rafId === null){
      lastFrame = null;
      rafId = requestAnimationFrame(loop);
    }
  }
  function attachDrag(id){
    const g = svg.querySelector(`[data-node="${id}"]`);
    if (!g) return;
    const s = state[id];
    let startPoint = null;
    let startPos = null;
    let lastPoint = null;
    let lastTime = null;
    g.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      g.setPointerCapture(e.pointerId);
      g.classList.add("dragging");
      s.dragging = true;
      s.vx = 0; s.vy = 0;
      startPoint = toSvgPoint(e);
      startPos = { x: s.x, y: s.y };
      lastPoint = startPoint;
      lastTime = performance.now();
      ensureLoop();
    });
    g.addEventListener("pointermove", (e) => {
      if (!s.dragging) return;
      const p = toSvgPoint(e);
      s.x = startPos.x + (p.x - startPoint.x);
      s.y = startPos.y + (p.y - startPoint.y);
      const now = performance.now();
      const dt = Math.max(now - lastTime, 1) / 1000;
      s.vx = (p.x - lastPoint.x) / dt;
      s.vy = (p.y - lastPoint.y) / dt;
      lastPoint = p; lastTime = now;
      updateNodeTransform(id);
      ensureLoop();
    });
    function endDrag(e){
      if (!s.dragging) return;
      s.dragging = false;
      g.classList.remove("dragging");
      try { g.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
      ensureLoop();
    }
    g.addEventListener("pointerup", endDrag);
    g.addEventListener("pointercancel", endDrag);
  }
  ids.forEach(attachDrag);
  updateAllEdges();
})();
// ===================== POPUPS DE RED POR ESTRUCTURA (EEP / EFC / ESECI / EIP) =====================
// Archivo independiente de scripts.js: solo agrega la funcionalidad de "click en nodo -> ver su red".
(function initRedesPopup(){

  // ---------- datos de cada red (nodos e iconos aproximados a partir de las capturas) ----------
  const NETWORKS = {

    // -------- verde: Estructura Ecológica Principal --------
    green: {
      title: "Estructura Ecológica Principal",
      count: 14,
      accent: "green",
      nodes: [
        { id:"corredores",  label:["Corredores","montañosos"],            icon:"fa-mountain",              x:471, y:53,  r:34 },
        { id:"cerros",      label:["Cerros","Orientales"],                icon:"fa-mountain",              x:644, y:37,  r:34 },
        { id:"rios",        label:["Ríos"],                               icon:"fa-water",                 x:152, y:159, r:46, primary:true },
        { id:"quebradas",   label:["Quebradas"],                          icon:"fa-water",                 x:341, y:149, r:30 },
        { id:"protegidas",  label:["Áreas","protegidas"],                 icon:"fa-shield-halved",         x:605, y:152, r:38 },
        { id:"bosques",     label:["Bosques","urbanos"],                  icon:"fa-tree",                  x:156, y:285, r:34 },
        { id:"resiliencia", label:["Áreas de","resiliencia","climática"], icon:"fa-temperature-half",      x:269, y:289, r:36 },
        { id:"humedales",   label:["Humedales"],                         icon:"fa-droplet",               x:449, y:272, r:58, primary:true },
        { id:"parquesmnt",  label:["Parques","ecológicos","de montaña"],  icon:"fa-mountain",              x:705, y:248, r:40 },
        { id:"paramos",     label:["Complejos de","páramos"],             icon:"fa-mountain",              x:96,  y:463, r:32 },
        { id:"coberturas",  label:["Coberturas","vegetales"],             icon:"fa-seedling",              x:228, y:429, r:50, primary:true },
        { id:"parquesborde",label:["Parques","de borde"],                 icon:"fa-house-chimney",         x:373, y:483, r:30 },
        { id:"reservas",    label:["Reservas","forestales"],              icon:"fa-tree",                  x:606, y:392, r:38 },
        { id:"paisajes",    label:["Paisajes","sostenibles"],             icon:"fa-hands-holding-circle",  x:236, y:559, r:34 }
      ],
      edges: [
        { from:"corredores",  to:"rios",         kind:"soporte" },
        { from:"cerros",      to:"protegidas",   kind:"soporte" },
        { from:"cerros",      to:"humedales",    kind:"soporte" },
        { from:"quebradas",   to:"humedales",    kind:"soporte" },
        { from:"rios",        to:"humedales",    kind:"soporte" },
        { from:"bosques",     to:"rios",         kind:"soporte" },
        { from:"bosques",     to:"coberturas",   kind:"soporte" },
        { from:"paramos",     to:"rios",         kind:"soporte" },
        { from:"resiliencia", to:"coberturas",   kind:"resiliencia" },
        { from:"reservas",    to:"coberturas",   kind:"resiliencia" },
        { from:"paramos",     to:"paisajes",     kind:"soporte", dashed:true, directed:false },
        { from:"protegidas",  to:"parquesmnt",   kind:"soporte", dashed:true, directed:false },
        { from:"protegidas",  to:"humedales",    kind:"soporte", dashed:true, directed:false },
        { from:"humedales",   to:"reservas",     kind:"soporte", dashed:true, directed:false },
        { from:"humedales",   to:"parquesborde", kind:"soporte", dashed:true, directed:false },
        { from:"coberturas",  to:"parquesborde", kind:"soporte", dashed:true, directed:false }
      ]
    },

    // -------- azul: Estructura Funcional y del Cuidado --------
    blue: {
      title: "Estructura Funcional y del Cuidado",
      count: 16,
      accent: "blue",
      nodes: [
        { id:"cuidado",     label:["Servicios de","cuidado"],       icon:"fa-heart",              x:428, y:76,  r:34 },
        { id:"equipamient", label:["Equipamientos"],                icon:"fa-building",           x:688, y:83,  r:42 },
        { id:"servpub",     label:["Servicios","públicos"],         icon:"fa-bus",                x:148, y:144, r:32 },
        { id:"ciclorrutas", label:["Ciclorrutas"],                  icon:"fa-bicycle",            x:93,  y:173, r:34 },
        { id:"servsoc",     label:["Servicios","sociales"],         icon:"fa-hand-holding-heart", x:572, y:195, r:36 },
        { id:"vivienda",    label:["Vivienda"],                     icon:"fa-house",              x:428, y:275, r:58, primary:true },
        { id:"transporte",  label:["Transporte","público"],         icon:"fa-bus",                x:187, y:317, r:36 },
        { id:"parques",     label:["Parques"],                      icon:"fa-tree",               x:282, y:410, r:30 },
        { id:"redvial",     label:["Red vial"],                     icon:"fa-road",               x:688, y:373, r:34 },
        { id:"manzanas",    label:["Manzanas del","Cuidado"],       icon:"fa-border-all",         x:394, y:472, r:50, primary:true },
        { id:"corredoresv", label:["Corredores","verdes"],          icon:"fa-leaf",               x:162, y:500, r:34 }
      ],
      edges: [
        { from:"cuidado",     to:"equipamient", kind:"soporte", dashed:true, directed:false },
        { from:"servpub",     to:"vivienda",    kind:"soporte", dashed:true },
        { from:"ciclorrutas", to:"vivienda",    kind:"resiliencia", dashed:true },
        { from:"transporte",  to:"vivienda",    kind:"soporte", dashed:true },
        { from:"servsoc",     to:"equipamient", kind:"soporte", dashed:true, directed:false },
        { from:"equipamient", to:"vivienda",    kind:"soporte" },
        { from:"manzanas",    to:"equipamient", kind:"soporte" },
        { from:"redvial",     to:"equipamient", kind:"soporte" },
        { from:"corredoresv", to:"transporte",  kind:"soporte" },
        { from:"transporte",  to:"redvial",     kind:"soporte" },
        { from:"parques",     to:"manzanas",    kind:"directa", directed:false }
      ]
    },

    // -------- amarillo: Estructura Socioeconómica, Creativa y de Innovación --------
    yellow: {
      title: "Estructura Socioeconómica, Creativa y de Innovación",
      count: 10,
      accent: "yellow",
      nodes: [
        { id:"distrito",  label:["Distrito Centro","Tecnológico e","Innovación"], icon:"fa-diagram-project", x:320, y:114, r:38 },
        { id:"abastec",   label:["Centros de","abastecimiento"],                  icon:"fa-truck",           x:571, y:96,  r:32 },
        { id:"empresa",   label:["Servicios","empresariales"],                    icon:"fa-briefcase",       x:88,  y:184, r:50, primary:true },
        { id:"plazas",    label:["Plazas de","mercado"],                          icon:"fa-store",           x:267, y:258, r:32 },
        { id:"industria", label:["Zonas","industriales"],                        icon:"fa-industry",        x:678, y:245, r:52, primary:true },
        { id:"educacion", label:["Sistema de","educación"],                      icon:"fa-graduation-cap",  x:407, y:310, r:46, primary:true },
        { id:"turismo",   label:["Zonas interés","turístico"],                    icon:"fa-map",             x:676, y:386, r:34 },
        { id:"financier", label:["Centros","financieros"],                       icon:"fa-landmark",        x:97,  y:444, r:34 },
        { id:"artesanal", label:["Producción","artesanal"],                      icon:"fa-gem",             x:237, y:551, r:34 }
      ],
      edges: [
        { from:"empresa",   to:"distrito",  kind:"soporte" },
        { from:"empresa",   to:"plazas",    kind:"soporte" },
        { from:"empresa",   to:"educacion", kind:"soporte" },
        { from:"empresa",   to:"financier", kind:"soporte" },
        { from:"industria", to:"distrito",  kind:"soporte", dashed:true },
        { from:"industria", to:"plazas",    kind:"soporte" },
        { from:"industria", to:"educacion", kind:"soporte" },
        { from:"industria", to:"turismo",   kind:"soporte" },
        { from:"distrito",  to:"abastec",   kind:"indirecta", dashed:true, directed:false },
        { from:"educacion", to:"artesanal", kind:"soporte" },
        { from:"empresa",   to:"artesanal", kind:"soporte" }
      ]
    },

    // -------- morado: Estructura Integradora de Patrimonios --------
    purple: {
      title: "Estructura Integradora de Patrimonios",
      count: 6,
      accent: "purple",
      nodes: [
        { id:"sagrados",     label:["Sistema de","Sitios sagrados"], icon:"fa-place-of-worship", x:159, y:161, r:38 },
        { id:"arqueologico", label:["Patrimonio","arqueológico"],    icon:"fa-scroll",           x:441, y:164, r:36 },
        { id:"inmaterial",   label:["Patrimonio","inmaterial"],      icon:"fa-masks-theater",    x:656, y:213, r:38 },
        { id:"material",     label:["Patrimonio","material"],        icon:"fa-landmark",         x:515, y:368, r:38 },
        { id:"natural",      label:["Patrimonio","natural"],         icon:"fa-tree",             x:194, y:426, r:54, primary:true }
      ],
      edges: [
        { from:"arqueologico", to:"inmaterial", kind:"resiliencia" },
        { from:"arqueologico", to:"material",   kind:"resiliencia" },
        { from:"sagrados",     to:"natural",    kind:"soporte" },
        { from:"sagrados",     to:"material",   kind:"soporte" },
        { from:"arqueologico", to:"natural",    kind:"soporte" },
        { from:"inmaterial",   to:"natural",    kind:"soporte" },
        { from:"inmaterial",   to:"material",   kind:"soporte" },
        { from:"material",     to:"natural",    kind:"soporte", directed:false }
      ]
    }
  };

  const SVG_NS = "http://www.w3.org/2000/svg";
  const overlay   = document.getElementById("redes-modal-overlay");
  if (!overlay) return;
  const modal     = overlay.querySelector(".redes-modal");
  const titleEl   = overlay.querySelector("#redes-modal-title");
  const subtitleEl= overlay.querySelector(".redes-modal-subtitle");
  const svg       = overlay.querySelector(".redes-network-svg");
  const edgesG    = overlay.querySelector(".redes-edges");
  const nodesG    = overlay.querySelector(".redes-nodes");
  const closeBtn  = overlay.querySelector(".redes-modal-close");
  const toggleNodesBtn = overlay.querySelector('[data-toggle="nodes"]');
  const toggleEdgesBtn = overlay.querySelector('[data-toggle="edges"]');

  function el(tag, attrs){
    const node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach((k) => node.setAttribute(k, attrs[k]));
    return node;
  }

  function pointOnCircle(cx, cy, r, tx, ty){
    let ux = tx - cx, uy = ty - cy;
    const d = Math.hypot(ux, uy) || 1;
    ux /= d; uy /= d;
    return { x: cx + ux * r, y: cy + uy * r };
  }

  function renderNetwork(net){
    titleEl.textContent = net.title;
    titleEl.style.color = getComputedColor(net.accent);
    subtitleEl.textContent = `Modo Analítico // Nodos = ${net.count}`;

    edgesG.innerHTML = "";
    nodesG.innerHTML = "";

    const byId = {};
    net.nodes.forEach((n) => { byId[n.id] = n; });

    net.edges.forEach((e) => {
      const a = byId[e.from], b = byId[e.to];
      if (!a || !b) return;
      const p0 = pointOnCircle(a.x, a.y, a.r, b.x, b.y);
      const p1 = pointOnCircle(b.x, b.y, b.r, a.x, a.y);

      const g = el("g", { class: `redes-edge redes-edge-${e.kind}${e.dashed ? " is-dashed" : ""}` });
      const line = el("path", {
        class: "redes-edge-line",
        d: `M${p0.x.toFixed(1)},${p0.y.toFixed(1)} L${p1.x.toFixed(1)},${p1.y.toFixed(1)}`
      });
      g.appendChild(line);

      if (e.directed !== false){
        const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
        const arrow = el("path", {
          class: "redes-edge-arrow",
          d: "M-9,-4 L0,0 L-9,4 Z",
          transform: `translate(${p1.x.toFixed(1)},${p1.y.toFixed(1)}) rotate(${angle.toFixed(1)})`
        });
        g.appendChild(arrow);
      }
      edgesG.appendChild(g);
    });

    net.nodes.forEach((n) => {
      const g = el("g", {
        class: `redes-node${n.primary ? " is-primary" : ""}`,
        "data-accent": net.accent,
        transform: `translate(${n.x},${n.y})`
      });
      const circle = el("circle", { r: n.r });
      g.appendChild(circle);

      const iconSize = Math.max(16, n.r * 0.5);
      const fo = el("foreignObject", {
        class: "redes-node-icon-fo",
        x: -iconSize/2, y: -(n.r*0.62), width: iconSize, height: iconSize
      });
      const div = document.createElement("div");
      div.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
      div.className = "redes-node-icon";
      div.innerHTML = `<i class="fa-solid ${n.icon}"></i>`;
      fo.appendChild(div);
      g.appendChild(fo);

      const text = el("text", { class: "redes-node-label", y: -(n.r*0.62) + iconSize + 2 });
      n.label.forEach((line, i) => {
        const tspan = el("tspan", { x: 0, dy: i === 0 ? 10 : 11 });
        tspan.textContent = line;
        text.appendChild(tspan);
      });
      g.appendChild(text);

      nodesG.appendChild(g);
    });

    // reset toggles a "on" cada vez que se abre una red nueva
    setToggle(toggleNodesBtn, true);
    setToggle(toggleEdgesBtn, true);
    nodesG.classList.remove("dim-secondary");
    edgesG.classList.remove("is-hidden");
  }

  function getComputedColor(accent){
    switch (accent){
      case "green":  return "#34d399";
      case "purple": return "#b06bf7";
      case "blue":   return "#3b82f6";
      case "yellow": return "#f5c945";
      default: return "#34d399";
    }
  }

  function setToggle(btn, on){
    if (!btn) return;
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-checked", on ? "true" : "false");
  }

  function openNetwork(colorKey){
    const net = NETWORKS[colorKey];
    if (!net) return;
    renderNetwork(net);
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal(){
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) closeModal();
  });

  if (toggleNodesBtn){
    toggleNodesBtn.addEventListener("click", () => {
      const on = !toggleNodesBtn.classList.contains("is-on");
      setToggle(toggleNodesBtn, on);
      nodesG.classList.toggle("dim-secondary", !on);
    });
  }
  if (toggleEdgesBtn){
    toggleEdgesBtn.addEventListener("click", () => {
      const on = !toggleEdgesBtn.classList.contains("is-on");
      setToggle(toggleEdgesBtn, on);
      edgesG.classList.toggle("is-hidden", !on);
    });
  }

  // ---------- click en los 4 nodos del hero (distinguiendo click de arrastre) ----------
  const heroNodes = document.querySelectorAll("#network-svg .node[data-node]");
  heroNodes.forEach((node) => {
    const colorKey = node.getAttribute("data-node");
    let downPoint = null;
    let downTime = 0;

    node.addEventListener("pointerdown", (e) => {
      downPoint = { x: e.clientX, y: e.clientY };
      downTime = Date.now();
    });

    node.addEventListener("pointerup", (e) => {
      if (!downPoint) return;
      const dist = Math.hypot(e.clientX - downPoint.x, e.clientY - downPoint.y);
      const elapsed = Date.now() - downTime;
      downPoint = null;
      if (dist < 6 && elapsed < 500){
        openNetwork(colorKey);
      }
    });

    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " "){
        e.preventDefault();
        openNetwork(colorKey);
      }
    });
  });

})();
