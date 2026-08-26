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

function installDynamicRelationData(data){
  const structureNames = Object.fromEntries((data.structures || []).map(item => [item.id, item.name]));
  const refsByRelationship = new Map();
  (data.references || []).forEach(ref => {
    if (!refsByRelationship.has(ref.relationship_id)) refsByRelationship.set(ref.relationship_id, []);
    refsByRelationship.get(ref.relationship_id).push(ref.reference_text);
  });
  (data.relationships || []).slice(0, 6).forEach((relationship, index) => {
    const key = `e${index + 1}`;
    const source = structureNames[relationship.source_structure_id] || relationship.source_structure_id;
    const target = structureNames[relationship.target_structure_id] || relationship.target_structure_id;
    const references = refsByRelationship.get(relationship.id) || [];
    relations[key] = {
      label: `${source} → ${target}`,
      quote: relationship.description || references[0] || "Relación cargada desde Supabase.",
      page: references.length ? "Referencias POT cargadas desde Supabase" : "Relación cargada desde Supabase"
    };
  });
}
if (window.rapotData?.ready){
  window.rapotData.ready.then(installDynamicRelationData).catch(() => {
    /* Los textos originales del diagrama permanecen como respaldo */
  });
}
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
        { id:"humedales",   label:["Humedales"],                         icon:"fa-droplet",               x:449, y:272, r:58, primary:true, boost:1.55 },
        { id:"parquesmnt",  label:["Parques","ecológicos","de montaña"],  icon:"fa-mountain",              x:705, y:248, r:40 },
        { id:"paramos",     label:["Complejos de","páramos"],             icon:"fa-mountain",              x:96,  y:463, r:32 },
        { id:"coberturas",  label:["Coberturas","vegetales"],             icon:"fa-seedling",              x:228, y:429, r:50, primary:true },
        { id:"parquesborde",label:["Parques","de borde"],                 icon:"fa-house-chimney",         x:373, y:483, r:30 },
        { id:"reservas",    label:["Reservas","forestales"],              icon:"fa-tree",                  x:606, y:392, r:38 },
        { id:"paisajes",    label:["Paisajes","sostenibles"],             icon:"fa-hands-holding-circle",  x:236, y:559, r:34 }
      ],
      // edges verificadas contra la tabla de sustento del POT que compartiste
      // (se excluyen "Bosques urbanos → Áreas protegidas" y "Paisajes sostenibles → Áreas
      // protegidas": la propia tabla dice "no la pondría" por falta de sustento textual)
      edges: [
        { from:"humedales",  to:"rios",         kind:"soporte", sustento:{ pagina:"p. 22", tipoLabel:"Soporte", parcial:true,
          cita:"El POT presenta el sistema hídrico y señala que los humedales hacen parte de las estructuras que aseguran el abastecimiento…" } },
        { from:"humedales",  to:"cerros",       kind:"soporte", sustento:{ pagina:"p. 59", tipoLabel:"Soporte", parcial:true,
          cita:"El POT identifica un conector \"Cerros Orientales-río Bogotá\" y señala que los conectores incluyen los humedales y…" } },
        { from:"corredores", to:"rios",         kind:"directa", directed:false, sustento:{ pagina:"p. 22", tipoLabel:"Sin dirección", parcial:true,
          cita:"El POT incluye conjuntamente \"los complejos de páramos, los corredores montañosos, las reservas forestales, los…\"" } },
        { from:"paramos",    to:"rios",         kind:"directa", directed:false, sustento:{ pagina:"p. 22", tipoLabel:"Sin dirección", parcial:true,
          cita:"El POT los integra al sistema que \"aseguran el abastecimiento hídrico y la provisión de bienes y servicios ecosistémicos\". No…" } },
        { from:"reservas",   to:"rios",         kind:"directa", directed:false, sustento:{ pagina:"p. 22", tipoLabel:"Sin dirección", parcial:true,
          cita:"El POT incluye reservas forestales y ríos dentro de la…" } },
        { from:"resiliencia",to:"coberturas",   kind:"resiliencia", sustento:{ pagina:"p. 59", tipoLabel:"Resiliencia", parcial:true,
          cita:"El POT señala que las áreas de resiliencia \"deben contar con intervenciones en coberturas\" para optimizar las condiciones…" } },
        { from:"coberturas", to:"protegidas",   kind:"soporte", sustento:{ pagina:"p. 59", tipoLabel:"Soporte", parcial:false,
          cita:"El POT señala que se priorizan \"coberturas vegetales que conecten entre sí las áreas protegidas\"." } },
        { from:"parquesmnt", to:"coberturas",   kind:"soporte", sustento:{ pagina:"p. 54", tipoLabel:"Soporte", parcial:true,
          cita:"El POT muestra el caso del Parque Distrital Ecológico de Montaña Soratama, donde \"se priorizan las coberturas vegetales que…\"" } },
        { from:"parquesborde",to:"coberturas",  kind:"soporte", sustento:{ pagina:"p. 54", tipoLabel:"Soporte", parcial:true,
          cita:"El POT incluye los parques de borde dentro de la estrategia…" } },
        { from:"quebradas",  to:"rios",         kind:"directa", directed:false, sustento:{ pagina:null, tipoLabel:"Sin dirección", parcial:true,
          cita:"Ambos pertenecen al sistema hídrico, pero con los conceptos de tu red no encontré una frase que permita afirmar Quebradas →…" } },
        { from:"cerros",     to:"rios",         kind:"directa", directed:false, sustento:{ pagina:"p. 59", tipoLabel:"Sin dirección", parcial:true,
          cita:"El POT sí identifica el conector \"Cerros Orientales-río Bogotá\", pero eso demuestra conectividad, no que exista una…" } }
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
      // edges verificadas contra tus tablas de sustento (Distrito, Servicios empresariales,
      // Ecosistema de educación superior, Zonas industriales). "Corredores inteligentes de
      // turismo" aparece en tu tabla pero todavía no existe como nodo en este diagrama.
      edges: [
        { from:"financier", to:"empresa",   kind:"directa", bidirectional:true, sustento:{ pagina:"p. 92", tipoLabel:"Directa",
          cita:"\"Los centros financieros y de servicios empresariales: Centro Internacional, Chapinero, Teleport y otros\". (SDP)" } },
        { from:"distrito",  to:"educacion", kind:"directa", sustento:{ pagina:"p. 158", tipoLabel:"Directa",
          cita:"\"El corazón del campus comprende un área de 247 hectáreas en el centro de la ciudad articulada con las aeZibo y Reencuentro. Conecta la principal aglomeración de conocimiento del país con las zonas empresariales del occidente y norte de la ciudad\". (Bogotá.gov.co)" } },
        { from:"distrito",  to:"industria", kind:"directa", sustento:{ pagina:"p. 158", tipoLabel:"Directa",
          cita:"\"El corazón del campus comprende un área de 247 hectáreas en el centro de la ciudad articulada con las aeZibo y Reencuentro\". (Bogotá.gov.co)" } },
        { from:"distrito",  to:"empresa",   kind:"directa", sustento:{ pagina:"p. 158", tipoLabel:"Directa",
          cita:"\"Conecta la principal aglomeración de conocimiento del país con las zonas empresariales del occidente y norte de la ciudad\". (Bogotá.gov.co)" } },
        { from:"turismo",   to:"plazas",    kind:"directa", sustento:{ pagina:"p. 92", tipoLabel:"Directa",
          cita:"\"Cluster Hotelero y Zonas de Interés Turístico, incluyendo los Corredores inteligentes de turismo (COINT) y los elementos de las Estructuras Ecológica Principal e Integradora de Patrimonios, Cables, Plazas de Mercado y otras infraestructuras con especial vocación turística\". (Scribd)" } },
        { from:"abastec",   to:"artesanal", kind:"indirecta", dashed:true, sustento:{ pagina:"p. 92", tipoLabel:"Indirecta (punteada)",
          cita:"\"Economías de aglomeración con énfasis de especialización – Corazones productivos de escala urbana- compuestas por: […] Centros de Abasto Mayorista\". (pdfcoffee.com)" } },
        { from:"educacion", to:"empresa",   kind:"soporte", sustento:{ pagina:"p. 30", tipoLabel:"Soporte · Directa",
          cita:"\"los programas de becas de educación universitaria como Jóvenes a la U y de formación para el trabajo como Todos a la U se han enfocado en esas mismas habilidades y tipos de carreras para encuadrar con las necesidades y ofertas de trabajo y emprendimiento presentes y futuras de la ciudad\"." } },
        { from:"educacion", to:"industria", kind:"soporte", sustento:{ pagina:"p. 30", tipoLabel:"Soporte · Directa",
          cita:"\"La inversión y ejecución sostenida del pot, el pmss y la inversión en esa educación con calidad y pertinencia, desde la básica hasta la superior, lograrán en conjunto, en la próxima década, el mayor crecimiento en productividad, empleabilidad de calidad y competitividad que haya tenido Bogotá\"." } },
        { from:"industria", to:"artesanal", kind:"soporte", sustento:{ pagina:"p. 30", tipoLabel:"Soporte · Directa",
          cita:"\"Por eso el pot promueve la permanencia de las industrias tradicionales en el tejido urbano y promueve nuevas implantaciones económicas generadoras de empleo formal, articuladas a los entornos urbanos donde se aglomeran saberes y talentos, y en particular aquellos que dan lugar a aglomeraciones especializadas de producción tradicional e industrias creativas, culturales, verdes, digitales y tecnológicas\"." } },
        { from:"educacion", to:"artesanal", kind:"soporte", dashed:true, sustento:{ pagina:"p. 30", tipoLabel:"Soporte · Indirecta",
          cita:"\"la inversión en educación pública de calidad ha asegurado que desde los colegios se mejoren las habilidades en ciencias, matemáticas, bilingüismo, ingenierías y tecnologías, y los programas de becas de educación universitaria […] se han enfocado en esas mismas habilidades y tipos de carreras para encuadrar con las necesidades y ofertas de trabajo y emprendimiento presentes y futuras de la ciudad\"." } },
        { from:"industria", to:"empresa",   kind:"soporte", sustento:{ pagina:"p. 30", tipoLabel:"Soporte · Directa",
          cita:"\"El pot protege a las zonas productivas históricas de la expulsión […] y potencia la oferta de suelo para la localización de nuevas empresas, en especial en la categoría de suelo para grandes servicios metropolitanos\"." } }
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
      // edges tomadas literalmente de tu tabla "Concepto 1 / Concepto 2 / Página / Frase exacta"
      edges: [
        { from:"material",     to:"inmaterial", kind:"soporte", sustento:{ pagina:"p. 196", tipoLabel:"Soporte · Directa",
          cita:"\"la EIP inscribe y precisa un sistema de relaciones del patrimonio cultural material, inmaterial y natural en el territorio\"." } },
        { from:"material",     to:"natural",    kind:"soporte", sustento:{ pagina:"p. 196", tipoLabel:"Soporte · Directa",
          cita:"\"la EIP inscribe y precisa un sistema de relaciones del patrimonio cultural material, inmaterial y natural en el territorio\"." } },
        { from:"inmaterial",   to:"natural",    kind:"soporte", sustento:{ pagina:"p. 196", tipoLabel:"Soporte · Directa",
          cita:"\"la EIP inscribe y precisa un sistema de relaciones del patrimonio cultural material, inmaterial y natural en el territorio\"." } },
        { from:"arqueologico", to:"natural",    kind:"resiliencia", sustento:{ pagina:"p. 198", tipoLabel:"Resiliencia · Directa",
          cita:"\"hoy pueden ser referentes de procesos adaptativos y que revelan prácticas de integralidad de la cultura con la naturaleza\"." } },
        { from:"arqueologico", to:"material",   kind:"soporte", sustento:{ pagina:"p. 198", tipoLabel:"Soporte · Directa",
          cita:"\"Este patrimonio cultural se convirtió en un referente de movilización\"." } },
        { from:"sagrados",     to:"inmaterial", kind:"soporte", sustento:{ pagina:"p. 186", tipoLabel:"Soporte · Directa",
          cita:"\"son el testimonio de complejas estrategias de cómo interpretamos y valoramos las huellas del territorio que hoy habitamos\"." } }
      ]
    }
    };

  // ===================== RED GLOBAL (39 CATEGORÍAS) =====================
  // Se construye a partir de los mismos 39 nodos originales. Los identificadores
  // se conservan para que el clic siga llegando al popup dinámico de Supabase.
  const GLOBAL_STRUCTURE_META = {
    green:  { title: "Ecológica Principal", color: "#3fd0bf", x: 500,  y: 470,  subtitle: "EEP" },
    yellow: { title: "Socioeconómica, Creativa e Innovación", color: "#f5c26b", x: 1130, y: 330,  subtitle: "ESECI" },
    blue:   { title: "Funcional y del Cuidado", color: "#f5a45f", x: 1640, y: 900,  subtitle: "EFC" },
    purple: { title: "Integradora de Patrimonios", color: "#ef6f6f", x: 1130, y: 1160, subtitle: "EIP" }
  };
  const GLOBAL_NODE_TRANSFORMS = {
    green:  { ox: 120,  oy: 135, sx: 1.22, sy: 1.13, minX: 96, minY: 37 },
    yellow: { ox: 790,  oy: 90,  sx: 1.18, sy: 1.10, minX: 88, minY: 96 },
    blue:   { ox: 1240, oy: 650, sx: 1.22, sy: 1.18, minX: 93, minY: 76 },
    purple: { ox: 880,  oy: 880, sx: 1.10, sy: 1.55, minX: 159, minY: 161 }
  };
  const GLOBAL_CLUSTER_BOXES = {
    green:  { x: 70,  y: 80,  width: 840, height: 720, rx: 190 },
    yellow: { x: 720, y: 55,  width: 850, height: 640, rx: 190 },
    blue:   { x: 1120, y: 590, width: 960, height: 720, rx: 210 },
    purple: { x: 770, y: 820, width: 770, height: 570, rx: 190 }
  };

  function globalLabelLines(lines){
    return Array.isArray(lines) ? lines : labelLines(lines, 18);
  }

  function buildGlobalNetwork(){
    const nodes = [];
    const nodeById = new Map();
    Object.entries(NETWORKS).forEach(([colorKey, network]) => {
      const transform = GLOBAL_NODE_TRANSFORMS[colorKey];
      network.nodes.forEach((sourceNode) => {
        const node = { ...sourceNode, label: globalLabelLines(sourceNode.label), accent: colorKey };
        node.x = transform.ox + (sourceNode.x - transform.minX) * transform.sx;
        node.y = transform.oy + (sourceNode.y - transform.minY) * transform.sy;
        const longestLine = Math.max(...node.label.map(line => String(line).length), 1);
        const lineBasedRadius = 25 + longestLine * 2.25 + node.label.length * 4;
        node.r = Math.max(39, Math.min(70, lineBasedRadius, (sourceNode.r || 36) * 1.13));
        node.primary = Boolean(sourceNode.primary);
        nodes.push(node);
        nodeById.set(node.id, node);
      });
    });

    const edges = [];
    const seenEdges = new Set();
    Object.entries(NETWORKS).forEach(([colorKey, network]) => {
      network.edges.forEach((edge, index) => {
        const key = [edge.from, edge.to].sort().join("|");
        if (!nodeById.has(edge.from) || !nodeById.has(edge.to) || seenEdges.has(`${colorKey}:${key}`)) return;
        seenEdges.add(`${colorKey}:${key}`);
        edges.push({
          ...edge,
          from: edge.from,
          to: edge.to,
          structure: colorKey,
          routeIndex: index,
          crossStructure: false
        });
      });
    });

    // Las seis relaciones entre estructuras se trazan entre nodos ancla ya existentes;
    // no se agregan nodos artificiales y por eso el total sigue siendo exactamente 39.
    const crossRelations = [
      { from: "humedales", to: "educacion", kind: "soporte", structure: "green", relation: "EEP → ESECI", bow: -130 },
      { from: "natural", to: "humedales", kind: "soporte", structure: "purple", relation: "EIP → EEP", bow: 95 },
      { from: "vivienda", to: "humedales", kind: "soporte", structure: "blue", relation: "EFC → EEP", bow: -115 },
      { from: "vivienda", to: "educacion", kind: "soporte", structure: "blue", relation: "EFC → ESECI", bow: 120 },
      { from: "natural", to: "vivienda", kind: "directa", structure: "purple", relation: "EIP → EFC", bow: -145 },
      { from: "natural", to: "educacion", kind: "soporte", structure: "purple", relation: "EIP → ESECI", bow: 135 }
    ];
    crossRelations.forEach((edge, index) => {
      const sourceRelation = Object.values(relations).find(item => item.label === edge.relation);
      edges.push({
        ...edge,
        routeIndex: index,
        crossStructure: true,
        directed: true,
        sustento: sourceRelation
          ? { pagina: sourceRelation.page, tipoLabel: edge.kind === "directa" ? "Directa" : "Soporte", cita: sourceRelation.quote }
          : { pagina: null, tipoLabel: "Relación estructural", cita: "Relación entre estructuras del modelo POT." }
      });
    });

    return {
      title: "Red completa del POT",
      count: nodes.length,
      groupCount: 4,
      nodes,
      edges,
      nodeById,
      source: "global"
    };
  }

  function initGlobalNetwork(){
    const overlay = document.getElementById("global-network-modal-overlay");
    const openButton = document.getElementById("open-global-network");
    const closeButton = document.getElementById("global-network-close");
    const canvas = document.getElementById("global-network-canvas");
    const svg = document.getElementById("global-network-svg");
    const linksG = document.getElementById("global-network-links");
    const nodesG = document.getElementById("global-network-nodes");
    const labelsG = document.getElementById("global-network-cluster-labels");
    const zoomOutput = document.getElementById("global-network-zoom-level");
    if (!overlay || !openButton || !closeButton || !canvas || !svg || !linksG || !nodesG || !labelsG) return;

    const SVG_NS_GLOBAL = "http://www.w3.org/2000/svg";
    const BASE_WIDTH = 2200;
    const BASE_HEIGHT = 1500;
    const DEFAULT_ZOOM = 1.2;
    const MIN_ZOOM = 0.78;
    const MAX_ZOOM = 1.7;
    let zoom = DEFAULT_ZOOM;
    let panState = null;

    function svgEl(tag, attrs = {}){
      const node = document.createElementNS(SVG_NS_GLOBAL, tag);
      Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
      return node;
    }

    function pointOnGlobalCircle(node, target){
      const dx = target.x - node.x;
      const dy = target.y - node.y;
      const distance = Math.hypot(dx, dy) || 1;
      return { x: node.x + dx / distance * node.r, y: node.y + dy / distance * node.r };
    }

    function routedPath(a, b, bow = 0){
      const start = pointOnGlobalCircle(a, b);
      const end = pointOnGlobalCircle(b, a);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distance = Math.hypot(dx, dy) || 1;
      const normal = { x: -dy / distance, y: dx / distance };
      const midpoint = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
      const control = { x: midpoint.x + normal.x * bow, y: midpoint.y + normal.y * bow };
      return {
        d: `M${start.x.toFixed(1)},${start.y.toFixed(1)} Q${control.x.toFixed(1)},${control.y.toFixed(1)} ${end.x.toFixed(1)},${end.y.toFixed(1)}`,
        start,
        end,
        control
      };
    }

    function updateZoom(){
      const percent = Math.round(zoom * 100);
      zoomOutput.textContent = `${percent}%`;
      svg.style.width = `${Math.round(BASE_WIDTH * zoom)}px`;
      svg.style.height = `${Math.round(BASE_HEIGHT * zoom)}px`;
    }

    function centerGlobalNetwork(){
      requestAnimationFrame(() => {
        canvas.scrollLeft = Math.max(0, (canvas.scrollWidth - canvas.clientWidth) / 2);
        canvas.scrollTop = Math.max(0, (canvas.scrollHeight - canvas.clientHeight) / 2);
      });
    }

    function setZoom(nextZoom, preserveCenter = true){
      const oldZoom = zoom;
      const centerX = canvas.scrollLeft + canvas.clientWidth / 2;
      const centerY = canvas.scrollTop + canvas.clientHeight / 2;
      zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
      updateZoom();
      if (preserveCenter && oldZoom){
        requestAnimationFrame(() => {
          canvas.scrollLeft = Math.max(0, centerX * (zoom / oldZoom) - canvas.clientWidth / 2);
          canvas.scrollTop = Math.max(0, centerY * (zoom / oldZoom) - canvas.clientHeight / 2);
        });
      }
    }

    function renderGlobalNetwork(){
      const net = buildGlobalNetwork();
      const byId = net.nodeById;
      linksG.innerHTML = "";
      nodesG.innerHTML = "";
      labelsG.innerHTML = "";

      Object.entries(GLOBAL_CLUSTER_BOXES).forEach(([colorKey, box]) => {
        const meta = GLOBAL_STRUCTURE_META[colorKey];
        const rect = svgEl("rect", {
          class: "global-network-cluster-box",
          x: box.x, y: box.y, width: box.width, height: box.height, rx: box.rx,
          fill: meta.color, "fill-opacity": "0.025", stroke: meta.color, "stroke-opacity": "0.17", "stroke-width": "2", "stroke-dasharray": "5 12"
        });
        labelsG.appendChild(rect);
        const clusterCenterX = box.x + box.width / 2;
        const title = svgEl("text", { x: clusterCenterX, y: box.y + 38, fill: meta.color });
        title.textContent = meta.title;
        labelsG.appendChild(title);
        const subtitle = svgEl("text", { class: "cluster-subtitle", x: clusterCenterX, y: box.y + 62, fill: meta.color });
        subtitle.textContent = `${meta.subtitle} · ${NETWORKS[colorKey].nodes.length} categorías`;
        labelsG.appendChild(subtitle);
      });

      net.edges.forEach((edge, index) => {
        const a = byId.get(edge.from);
        const b = byId.get(edge.to);
        if (!a || !b) return;
        const bow = edge.crossStructure ? edge.bow : ((index % 3) - 1) * 30;
        const route = routedPath(a, b, bow);
        const group = svgEl("g", {
          class: `global-network-edge${edge.crossStructure ? " cross-structure" : ""}`,
          tabindex: "0",
          role: "button",
          "aria-label": `Relación ${a.label.join(" ")} - ${b.label.join(" ")}`
        });
        const hit = svgEl("path", { class: "global-network-edge-hit", d: route.d });
        const line = svgEl("path", { class: "global-network-edge-line", d: route.d });
        group.appendChild(hit);
        group.appendChild(line);
        if (edge.directed !== false){
          const angle = Math.atan2(route.end.y - route.control.y, route.end.x - route.control.x) * 180 / Math.PI;
          const arrow = svgEl("path", {
            class: "global-network-edge-arrow",
            d: "M-12,-5 L0,0 L-12,5 Z",
            transform: `translate(${route.end.x.toFixed(1)},${route.end.y.toFixed(1)}) rotate(${angle.toFixed(1)})`,
            "marker-end": "url(#global-network-arrow)"
          });
          group.appendChild(arrow);
        }
        const relationLabel = edge.relation || `${a.label.join(" ")} → ${b.label.join(" ")}`;
        group.addEventListener("click", (event) => {
          event.stopPropagation();
          openSustentoPopup(relationLabel, edge.sustento, event.clientX, event.clientY);
        });
        group.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          const rect = group.getBoundingClientRect();
          openSustentoPopup(relationLabel, edge.sustento, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
        linksG.appendChild(group);
      });

      net.nodes.forEach((node, index) => {
        const group = svgEl("g", {
          class: "global-network-node",
          "data-node-id": node.id,
          "data-accent": node.accent,
          tabindex: "0",
          role: "button",
          "aria-label": `${node.label.join(" ")} (abrir datos)` ,
          transform: `translate(${node.x.toFixed(1)},${node.y.toFixed(1)})`
        });
        const radius = node.r;
        const circle = svgEl("circle", { r: radius });
        group.appendChild(circle);
        const iconSize = Math.max(21, Math.min(31, radius * .48));
        const iconFo = svgEl("foreignObject", {
          class: "global-network-node-icon-fo",
          x: -iconSize / 2,
          y: -radius * .59,
          width: iconSize,
          height: iconSize
        });
        const icon = document.createElement("div");
        icon.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        icon.className = "global-network-node-icon";
        icon.innerHTML = `<i class="fa-solid ${node.icon || "fa-circle-nodes"}"></i>`;
        iconFo.appendChild(icon);
        group.appendChild(iconFo);
        const textStart = node.label.length >= 3 ? 1 : node.label.length === 2 ? 5 : 11;
        const text = svgEl("text", { y: textStart });
        node.label.forEach((line, lineIndex) => {
          const tspan = svgEl("tspan", { x: 0, dy: lineIndex === 0 ? 0 : 14 });
          tspan.textContent = line;
          text.appendChild(tspan);
        });
        group.appendChild(text);
        const openCategory = (event) => {
          event.stopPropagation();
          if (window.rapotItems){
            if (node.categoryChildren?.length) window.rapotItems.openCategoryMenu(node, net);
            else window.rapotItems.open(node, net);
          }
        };
        group.addEventListener("click", openCategory);
        group.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          openCategory(event);
        });
        nodesG.appendChild(group);
      });

      const subtitle = document.getElementById("global-network-subtitle");
      if (subtitle) subtitle.textContent = `39 categorías · ${net.edges.length} conexiones · datos POT dinámicos desde Supabase`;
      zoom = DEFAULT_ZOOM;
      updateZoom();
    }

    function openGlobalNetwork(){
      overlay.hidden = false;
      document.body.style.overflow = "hidden";
      renderGlobalNetwork();
      centerGlobalNetwork();
      // Si el usuario abre la red antes de que termine Supabase, se vuelve a pintar
      // al finalizar la carga para que cada nodo conserve su hoja/filtro correcto.
      if (window.rapotData?.ready?.then){
        window.rapotData.ready.then(() => {
          if (!overlay.hidden){
            renderGlobalNetwork();
            centerGlobalNetwork();
          }
        }).catch(() => { /* el respaldo local ya quedó pintado */ });
      }
    }

    function closeGlobalNetwork(){
      overlay.hidden = true;
      document.body.style.overflow = "";
      panState = null;
      canvas.classList.remove("is-panning");
    }

    openButton.addEventListener("click", openGlobalNetwork);
    closeButton.addEventListener("click", closeGlobalNetwork);
    document.getElementById("global-network-zoom-in")?.addEventListener("click", () => setZoom(zoom + .1));
    document.getElementById("global-network-zoom-out")?.addEventListener("click", () => setZoom(zoom - .1));
    document.getElementById("global-network-zoom-reset")?.addEventListener("click", () => {
      zoom = DEFAULT_ZOOM;
      updateZoom();
      centerGlobalNetwork();
    });
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeGlobalNetwork();
    });
    canvas.addEventListener("wheel", (event) => {
      if (!event.ctrlKey && Math.abs(event.deltaY) < 2) return;
      event.preventDefault();
      setZoom(zoom + (event.deltaY < 0 ? .06 : -.06));
    }, { passive: false });
    canvas.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".global-network-node, .global-network-edge")) return;
      panState = { x: event.clientX, y: event.clientY, scrollLeft: canvas.scrollLeft, scrollTop: canvas.scrollTop };
      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add("is-panning");
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!panState) return;
      canvas.scrollLeft = panState.scrollLeft - (event.clientX - panState.x);
      canvas.scrollTop = panState.scrollTop - (event.clientY - panState.y);
    });
    const stopPan = (event) => {
      if (!panState) return;
      panState = null;
      canvas.classList.remove("is-panning");
      try { canvas.releasePointerCapture(event.pointerId); } catch (error) { /* noop */ }
    };
    canvas.addEventListener("pointerup", stopPan);
    canvas.addEventListener("pointercancel", stopPan);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) closeGlobalNetwork();
    });
  }

  initGlobalNetwork();

  // ===================== DATOS DINÁMICOS DESDE SUPABASE =====================
  const STRUCTURE_BY_COLOR = { green: "EEP", blue: "EFC", purple: "EIP", yellow: "ESECI" };
  const ICON_BY_GROUP = {
    "Sistema Hídrico": "fa-water",
    "Coberturas Vegetales": "fa-seedling",
    "Áreas Protegidas": "fa-shield-halved",
    "Conectividad Ecosistémica": "fa-leaf",
    "Red Vial Completa": "fa-road",
    "Transporte Sostenible": "fa-bus",
    "Equipamientos y Servicios": "fa-building",
    "Espacio Público": "fa-tree",
    "Patrimonio Natural": "fa-tree",
    "Patrimonio Cultural Material": "fa-landmark",
    "Patrimonio Inmaterial": "fa-masks-theater",
    "Sitios Sagrados": "fa-place-of-worship",
    "Zonas Productivas": "fa-industry",
    "Educación y Conocimiento": "fa-graduation-cap",
    "Comercio y Servicios": "fa-store",
    "Vivienda": "fa-house"
  };

  function labelLines(value, maxLength = 18){
    const words = String(value || "Concepto").split(/\s+/).filter(Boolean);
    const lines = [];
    let current = "";
    words.forEach(word => {
      if (!current) current = word;
      else if ((current + " " + word).length <= maxLength) current += " " + word;
      else { lines.push(current); current = word; }
    });
    if (current) lines.push(current);
    return lines.slice(0, 3);
  }

  function buildDynamicNetwork(colorKey, data){
    const structureId = STRUCTURE_BY_COLOR[colorKey];
    const structure = data.structures.find(item => item.id === structureId);
    const groups = data.groups
      .filter(group => group.structure_id === structureId)
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
    const groupIds = new Set(groups.map(group => group.id));
    const concepts = data.concepts.filter(concept => groupIds.has(concept.group_id));
    const categoryNodes = (data.categoryNodes || [])
      .filter(category => category.structure_id === structureId && category.active !== false)
      .sort((a, b) => (a.sort_order - b.sort_order) || a.name.localeCompare(b.name, "es"));
    if (!structure || (!groups.length && !categoryNodes.length)) return null;

    // Las categorías se separan en nodos de primer nivel. Los registros se consultan
    // únicamente al hacer clic, evitando que cientos de elementos saturen el grafo.
    const categories = categoryNodes.length ? categoryNodes : groups.map(group => ({
      id: group.id,
      parent_group_id: group.id,
      name: group.name,
      item_sheets: group.name === "Red Vial Completa" ? ["Vías Arteriales", "Ciclorutas"] : [],
      icon: ICON_BY_GROUP[group.name] || "fa-circle-nodes",
      color: null,
      sort_order: 0,
      item_count: null
    }));
    const center = { x: 400, y: 300 };
    const radiusX = categories.length <= 4 ? 190 : 255;
    const radiusY = categories.length <= 4 ? 180 : 205;
    const nodes = categories.map((category, index) => {
      const angle = (index / categories.length) * Math.PI * 2 - Math.PI / 2;
      const itemSheets = Array.isArray(category.item_sheets) ? category.item_sheets : [];
      const fallbackGroup = groups.find(group => group.id === category.parent_group_id || group.name === category.name);
      const groupConcepts = fallbackGroup ? concepts.filter(concept => concept.group_id === fallbackGroup.id) : [];
      const itemCount = Number.isFinite(Number(category.item_count)) && category.item_count !== null
        ? Number(category.item_count)
        : itemSheets.length
          ? data.potItems.filter(item => itemSheets.includes(item.source_sheet)).length
          : groupConcepts.length;
      return {
        id: `db-category-${category.id}`,
        label: labelLines(category.name, categories.length > 6 ? 18 : 21),
        icon: category.icon || ICON_BY_GROUP[category.name] || "fa-circle-nodes",
        color: category.color || null,
        x: center.x + radiusX * Math.cos(angle),
        y: center.y + radiusY * Math.sin(angle),
        r: itemCount > 100 ? 48 : itemCount > 70 ? 44 : 40,
        groupId: category.parent_group_id || fallbackGroup?.id,
        groupName: category.name,
        itemSheets,
        itemCount,
        source: "supabase"
      };
    });

    // Compatibilidad para instalaciones antiguas: Humedales se conserva como nodo directo
    // solo si aún no existe el registro específico en rapot_category_nodes.
    if (!categoryNodes.length && colorKey === "green"){
      const wetlandConcept = concepts.find(concept => concept.name.toLocaleLowerCase("es") === "humedales");
      if (wetlandConcept){
        nodes.push({
          id: `db-concept-${wetlandConcept.id}`,
          label: ["Humedales"], icon: "fa-droplet", color: "#3fd0bf",
          x: 400, y: 500, r: 48, groupId: wetlandConcept.group_id,
          groupName: "Humedales", itemSheets: ["Humedales"],
          itemCount: data.potItems.filter(item => item.source_sheet === "Humedales").length,
          source: "supabase"
        });
      }
    }

    const edges = [];
    for (let i = 1; i < nodes.length; i++){
      edges.push({
        from: nodes[i - 1].id, to: nodes[i].id, kind: "soporte", directed: false, dashed: true,
        sustento: {
          tipoLabel: "Relación de categorías",
          cita: `Categorías cargadas dinámicamente desde Supabase para ${structure.name}.`,
          pagina: null
        }
      });
    }

    return {
      title: structure.name, count: nodes.length,
      groupCount: categories.length, accent: colorKey, nodes, edges, source: "supabase"
    };
  }

  const CHILDREN_PARENT_NODES = {
    blue: {
      "Equipamientos y Servicios": ["equipamient"],
      "Red Vial Completa": ["redvial"]
    }
  };

  const DIRECT_CATEGORY_SHEETS = {
    green: {
      "corredores": [], "cerros": [], "protegidas": [],
      "rios": ["Sistema Hídrico"], "quebradas": ["Sistema Hídrico"], "humedales": ["Humedales"],
      "parquesmnt": [], "paramos": [], "coberturas": [], "bosques": [], "resiliencia": [],
      "parquesborde": ["Parques"], "reservas": [], "paisajes": []
    },
    blue: {
      "cuidado": ["Cuidado"], "equipamient": ["Educación", "Salud", "Cultura", "Deporte", "Cuidado"],
      "servpub": [], "ciclorrutas": ["Ciclorutas"], "servsoc": [], "vivienda": [],
      "transporte": ["Vías Arteriales", "Ciclorutas"], "parques": ["Parques"],
      "redvial": ["Vías Arteriales", "Ciclorutas"], "manzanas": [], "corredoresv": []
    },
    purple: {
      "sagrados": [], "arqueologico": [], "inmaterial": [], "material": [], "natural": []
    },
    yellow: {
      "distrito": [], "abastec": [], "empresa": [], "plazas": [], "industria": [],
      "educacion": [], "turismo": [], "financier": [], "artesanal": []
    }
  };

  const DIRECT_CATEGORY_FILTERS = {
    green: {
      "rios": "river", "quebradas": "stream", "parquesborde": "border_parks"
    }
  };

  const DIRECT_CATEGORY_NO_DATA = {
    green: ["corredores", "cerros", "protegidas", "parquesmnt", "paramos", "coberturas", "bosques", "resiliencia", "reservas", "paisajes"],
    blue: ["servpub", "servsoc", "vivienda", "manzanas", "corredoresv"],
    purple: ["sagrados", "arqueologico", "inmaterial", "material", "natural"],
    yellow: ["distrito", "abastec", "empresa", "plazas", "industria", "educacion", "turismo", "financier", "artesanal"]
  };

  function installDynamicNetworks(data){
    // Conserva las categorías originales de NETWORKS y solo añade las categorías
    // hijas provenientes de Supabase a los nodos padres saturados.
    const groupsById = new Map((data.groups || []).map(group => [group.id, group.name]));
    const categoryNodes = (data.categoryNodes || []).filter(category => category.active !== false);
    Object.entries(DIRECT_CATEGORY_SHEETS).forEach(([colorKey, nodeSheets]) => {
      const network = NETWORKS[colorKey];
      if (!network) return;
      network.nodes.forEach(node => {
        const sheets = nodeSheets[node.id];
        if (!sheets) return;
        node.itemSheets = sheets;
        node.itemFilterKey = DIRECT_CATEGORY_FILTERS[colorKey]?.[node.id] || null;
        node.noData = DIRECT_CATEGORY_NO_DATA[colorKey]?.includes(node.id) || false;
        node.groupName = node.groupName || node.label?.join(" ") || node.id;
      });
    });
    Object.entries(CHILDREN_PARENT_NODES).forEach(([colorKey, parents]) => {
      const network = NETWORKS[colorKey];
      if (!network) return;
      Object.entries(parents).forEach(([parentGroupName, nodeIds]) => {
        const children = categoryNodes
          .filter(category => groupsById.get(category.parent_group_id) === parentGroupName)
          .sort((a, b) => (a.sort_order - b.sort_order) || a.name.localeCompare(b.name, "es"));
        if (!children.length) return;
        nodeIds.forEach(nodeId => {
          const node = network.nodes.find(candidate => candidate.id === nodeId);
          if (node){
            node.categoryChildren = children;
            node.groupName = node.groupName || parentGroupName;
          }
        });
      });
    });
  }

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

  // ---------- nodos principales = los que tienen más conexiones ----------
  // Calcula el grado (nº de relaciones) de cada nodo y usa eso para decidir
  // tamaño del círculo y cuáles se marcan como "principales".
  function applyDegreeSizing(net){
    const MIN_R = 27, MAX_R = 60;
    const deg = {};
    net.nodes.forEach((n) => { deg[n.id] = 0; });
    net.edges.forEach((e) => {
      if (deg[e.from] !== undefined) deg[e.from]++;
      if (deg[e.to]   !== undefined) deg[e.to]++;
    });
    const degrees = net.nodes.map((n) => deg[n.id] || 0);
    const maxDeg = Math.max(...degrees);
    const minDeg = Math.min(...degrees);
    // umbral: los "principales" son los que están en el grupo de mayor conexión
    const distinctDesc = Array.from(new Set(degrees)).sort((a, b) => b - a);
    const k = Math.max(1, Math.round(net.nodes.length / 5));
    const threshold = distinctDesc[Math.min(k, distinctDesc.length) - 1];

    net.nodes.forEach((n) => {
      const d = deg[n.id] || 0;
      n.degree = d;
      let r = maxDeg === minDeg
        ? (MIN_R + MAX_R) / 2
        : Math.round((MIN_R + (MAX_R - MIN_R) * ((d - minDeg) / (maxDeg - minDeg))) * 10) / 10;
      // algunos nodos (ej. Humedales) llevan un refuerzo manual de tamaño aunque su
      // grado de conexión no sea el más alto, porque conceptualmente son un nodo central
      if (n.boost){
        r = Math.min(MAX_R * 1.3, Math.round(r * n.boost * 10) / 10);
      }
      n.r = r;
      n.primary = d >= threshold || !!n.boost;
    });
  }

  function renderNetwork(net){
    applyDegreeSizing(net);

    titleEl.textContent = net.title;
    titleEl.style.color = getComputedColor(net.accent);
    subtitleEl.textContent = net.groupCount
      ? `Datos de Supabase // ${net.groupCount} grupos · ${net.count} conceptos`
      : `Modo Analítico // Nodos = ${net.count}`;

    edgesG.innerHTML = "";
    nodesG.innerHTML = "";

    const byId = {};
    net.nodes.forEach((n) => { byId[n.id] = n; });

    // guarda, por id de nodo, qué elementos <g> de conexión lo tocan,
    // para poder apagarlos junto con el nodo al hacer click en él
    const edgesByNode = {};
    function linkEdgeToNode(nodeId, edgeEl){
      if (!edgesByNode[nodeId]) edgesByNode[nodeId] = [];
      edgesByNode[nodeId].push(edgeEl);
    }

    net.edges.forEach((e) => {
      const a = byId[e.from], b = byId[e.to];
      if (!a || !b) return;
      const p0 = pointOnCircle(a.x, a.y, a.r, b.x, b.y);
      const p1 = pointOnCircle(b.x, b.y, b.r, a.x, a.y);

      const g = el("g", {
        class: `redes-edge redes-edge-${e.kind}${e.dashed ? " is-dashed" : ""}`,
        tabindex: "0",
        role: "button",
        "aria-label": `Relación ${a.label.join(" ")} - ${b.label.join(" ")}`
      });
      const d = `M${p0.x.toFixed(1)},${p0.y.toFixed(1)} L${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;

      // "blob" orgánico difuminado detrás de la línea: para que la conexión no sea solo
      // un trazo, sino una mancha suave de color que une los dos nodos (como en la referencia)
      const blob = el("path", { class: `redes-edge-blob redes-edge-blob-${e.kind}`, d, filter: "url(#blob-blur)" });
      g.appendChild(blob);

      // trazo invisible más ancho, para que sea fácil hacer click en la línea
      const hit = el("path", { class: "redes-edge-hit", d });
      g.appendChild(hit);

      const line = el("path", { class: "redes-edge-line", d });
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
      if (e.bidirectional){
        const angleBack = Math.atan2(p0.y - p1.y, p0.x - p1.x) * 180 / Math.PI;
        const arrowBack = el("path", {
          class: "redes-edge-arrow",
          d: "M-9,-4 L0,0 L-9,4 Z",
          transform: `translate(${p0.x.toFixed(1)},${p0.y.toFixed(1)}) rotate(${angleBack.toFixed(1)})`
        });
        g.appendChild(arrowBack);
      }

      // click / Enter -> popup con el sustento de esta relación (tabla del POT)
      const relationLabel = `${a.label.join(" ")} → ${b.label.join(" ")}`;
      g.addEventListener("click", (ev) => {
        ev.stopPropagation();
        openSustentoPopup(relationLabel, e.sustento, ev.clientX, ev.clientY);
      });
      g.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " "){
          ev.preventDefault();
          const box = g.getBoundingClientRect();
          openSustentoPopup(relationLabel, e.sustento, box.left + box.width / 2, box.top + box.height / 2);
        }
      });

      edgesG.appendChild(g);
      linkEdgeToNode(e.from, g);
      linkEdgeToNode(e.to, g);
    });

    net.nodes.forEach((n, i) => {
      const g = el("g", {
        class: `redes-node${n.primary ? " is-primary" : ""}`,
        "data-accent": net.accent,
        "data-node-id": n.id,
        "data-category-color": n.color || "",
        tabindex: "0",
        role: "button",
        "aria-label": `${n.label.join(" ")} (click para atenuar)`,
        transform: `translate(${n.x},${n.y})`
      });

      // grupo interno: solo este flota con CSS, el externo mantiene la posición real del nodo
      const float = el("g", { class: "redes-node-float" });
      float.style.animationDuration = (4.4 + (i % 5) * 0.35).toFixed(2) + "s";
      float.style.animationDelay = (-(i % 7) * 0.5).toFixed(2) + "s";
      g.appendChild(float);

      const circle = el("circle", { r: n.r });
      if (n.color) circle.style.stroke = n.color;
      float.appendChild(circle);

      const iconSize = Math.max(16, n.r * 0.5);
      const fo = el("foreignObject", {
        class: "redes-node-icon-fo",
        x: -iconSize/2, y: -(n.r*0.62), width: iconSize, height: iconSize
      });
      const div = document.createElement("div");
      div.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
      div.className = "redes-node-icon";
      if (n.color) div.style.color = n.color;
      div.innerHTML = `<i class="fa-solid ${n.icon}"></i>`;
      fo.appendChild(div);
      float.appendChild(fo);

      const text = el("text", { class: "redes-node-label", y: -(n.r*0.62) + iconSize + 2 });
      n.label.forEach((line, i) => {
        const tspan = el("tspan", { x: 0, dy: i === 0 ? 10 : 11 });
        tspan.textContent = line;
        text.appendChild(tspan);
      });
      float.appendChild(text);

      // indica si este nodo puede expandirse (coarse graining)
      const expandableNodes = ["redvial", "parques", "equipamient"];
      const isExpandable = expandableNodes.includes(n.id);
      if (isExpandable){
        g.classList.add("is-expandable");
        g.style.cursor = "pointer";
      }

      // click en el nodo -> se atenúa junto con las líneas que lo conectan (click de nuevo lo restaura)
      // o si es expandible, expande el coarse graining
      function toggleDim(ev){
        ev.stopPropagation();
        // Cada categoría abre un segundo diálogo dedicado al listado completo.
        // El modal de la red permanece intacto detrás, evitando mezclar grafo y registros.
        const hasCategoryData = Boolean(n.groupName) || isExpandable || (n.categoryChildren && n.categoryChildren.length);
        if (window.rapotItems && hasCategoryData){
          if (n.categoryChildren?.length) window.rapotItems.openCategoryMenu(n, net);
          else window.rapotItems.open(n, net);
          return;
        }
        const dimmed = g.classList.toggle("is-dimmed");
        (edgesByNode[n.id] || []).forEach((edgeEl) => {
          edgeEl.classList.toggle("is-dimmed", dimmed);
        });
      }
      g.addEventListener("click", toggleDim);
      g.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " "){
          ev.preventDefault();
          toggleDim(ev);
        }
      });

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
      case "green":  return "#3fd0bf";
      case "purple": return "#ff8f8f";
      case "blue":   return "#f5a45f";
      case "yellow": return "#f5c26b";
      default: return "#3fd0bf";
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

  // ---------- popup de sustento: se abre al hacer click en una línea de relación ----------
  function tipoBadgeClass(tipoLabel){
    const t = (tipoLabel || "").toLowerCase();
    if (t.includes("soporte")) return "sustento-tipo-soporte";
    if (t.includes("resiliencia")) return "sustento-tipo-resiliencia";
    if (t.includes("indirecta")) return "sustento-tipo-indirecta";
    if (t.includes("directa")) return "sustento-tipo-directa";
    return "sustento-tipo-generico";
  }

  function closeSustentoPopup(){
    const existing = document.querySelector(".sustento-popup");
    if (existing) existing.remove();
    document.removeEventListener("click", onOutsideSustentoClick, true);
  }
  function onOutsideSustentoClick(e){
    const popup = document.querySelector(".sustento-popup");
    if (popup && !popup.contains(e.target) && !e.target.closest(".redes-edge")) {
      closeSustentoPopup();
    }
  }

  function openSustentoPopup(relationLabel, sustento, x, y){
    closeSustentoPopup();
    const popup = document.createElement("div");
    popup.className = "sustento-popup";

    if (sustento){
      const badgeClass = tipoBadgeClass(sustento.tipoLabel);
      popup.innerHTML = `
        <button class="pot-popup-close" aria-label="Cerrar">✕</button>
        <div class="sustento-relation">${relationLabel}</div>
        <span class="sustento-tipo-badge ${badgeClass}">${sustento.tipoLabel || "Relación"}</span>
        <div class="pot-quote">&ldquo;${sustento.cita}&rdquo;</div>
        <div class="pot-page">${sustento.pagina ? sustento.pagina + " del POT" : "Página del POT pendiente de confirmar"}</div>
      `;
    } else {
      popup.innerHTML = `
        <button class="pot-popup-close" aria-label="Cerrar">✕</button>
        <div class="sustento-relation">${relationLabel}</div>
        <div class="pot-quote">Todavía no tengo el sustento documentado de esta relación en la tabla del POT.</div>
        <div class="pot-page">Compárteme la fila de la tabla y la agrego aquí.</div>
      `;
    }

    document.body.appendChild(popup);
    const rect = popup.getBoundingClientRect();
    const margin = 16;
    let left = x + 16;
    let top = y + 16;
    if (left + rect.width + margin > window.innerWidth) left = x - rect.width - 16;
    if (top + rect.height + margin > window.innerHeight) top = window.innerHeight - rect.height - margin;
    if (left < margin) left = margin;
    if (top < margin) top = margin;
    popup.style.left = left + "px";
    popup.style.top = top + "px";

    popup.querySelector(".pot-popup-close").addEventListener("click", (ev) => {
      ev.stopPropagation();
      closeSustentoPopup();
    });
    setTimeout(() => document.addEventListener("click", onOutsideSustentoClick, true), 0);
  }

  closeBtn.addEventListener("click", () => { closeSustentoPopup(); closeModal(); });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) { closeSustentoPopup(); closeModal(); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape"){
      closeSustentoPopup();
      if (!overlay.hidden) closeModal();
    }
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

  // ---------- coarse graining: expandir nodos agrupados para mostrar sub-elementos ----------
  let coarseGrainingState = {};
  let currentNetworkState = null;

  async function loadCoarseGrainingData(){
    try {
      if (window.rapotData){
        const items = await window.rapotData.getPotItems();
        const bySheet = {};
        items.forEach(item => {
          const sheet = item.source_sheet || "Otros";
          if (!bySheet[sheet]) bySheet[sheet] = [];
          if (item.name) bySheet[sheet].push(item.name);
        });
        const roads = ["Vías Arteriales", "Ciclorutas"].flatMap(sheet => bySheet[sheet] || []);
        const parks = bySheet["Parques"] || [];
        const equipmentSheets = ["Educación", "Salud", "Cultura", "Deporte", "Cuidado"];
        const equipment = equipmentSheets.flatMap(sheet => bySheet[sheet] || []);
        return {
          red_vial: Object.fromEntries(Object.entries(bySheet).map(([sheet, names]) => [sheet, { vias: names }]))
          ,coarse: { roads, parks, equipment }
          ,source: "supabase"
        };
      }
      const response = await fetch('./data/vias_bogota.json');
      const data = await response.json();
      return { ...data, source: "local" };
    } catch (err){
      console.error("Error cargando datos POT desde Supabase/local:", err);
      return null;
    }
  }

  function generateSubNodesLayout(parentNode, subElements, count){
    const radius = 200;
    const centerX = parentNode.x;
    const centerY = parentNode.y;
    const nodes = [];

    subElements.forEach((elem, i) => {
      const angle = (i / count) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      nodes.push({
        id: `${parentNode.id}-${i}`,
        label: Array.isArray(elem) ? elem : [elem],
        icon: parentNode.icon,
        x, y,
        r: Math.max(12, parentNode.r * 0.6),
        parentId: parentNode.id,
        isCoarseGrained: true,
        primary: false
      });
    });
    return nodes;
  }

  window.toggleCoarseGraining = function(nodeId, net, viasData){
    if (!coarseGrainingState[nodeId]){
      coarseGrainingState[nodeId] = { expanded: false, originalNodes: null };
    }

    if (coarseGrainingState[nodeId].expanded){
      // collapse
      coarseGrainingState[nodeId].expanded = false;
      net.nodes = coarseGrainingState[nodeId].originalNodes.map(n => ({...n}));
      renderNetwork(net);
      return;
    }

    // expand
    let subElements = [];

    if (nodeId === "redvial" && viasData){
      const todasLasVias = viasData.coarse?.roads || [];
      if (todasLasVias.length){
        subElements = todasLasVias.slice(0, 120);
      } else if (viasData.red_vial){
        Object.values(viasData.red_vial).forEach(categoria => {
          if (categoria && categoria.vias && Array.isArray(categoria.vias)) subElements.push(...categoria.vias);
        });
      }
    } else if (nodeId === "parques" && viasData){
      subElements = (viasData.coarse?.parks || []).slice(0, 60);
    } else if (nodeId === "equipamient" && viasData){
      subElements = (viasData.coarse?.equipment || []).slice(0, 60);
    }

    if (subElements.length > 0){
      const parentNode = net.nodes.find(n => n.id === nodeId);
      if (parentNode){
        // guardar estado original
        coarseGrainingState[nodeId].originalNodes = JSON.parse(JSON.stringify(net.nodes));
        coarseGrainingState[nodeId].expanded = true;

        // generar nodos sub-elementos
        const subNodes = generateSubNodesLayout(parentNode, subElements, subElements.length);

        // quitar nodo padre y agregar sub-nodos
        net.nodes = net.nodes.filter(n => n.id !== nodeId);
        net.nodes.push(...subNodes);

        // actualizar título con contador
        net.count = net.nodes.length;

        renderNetwork(net);
      }
    }
  };

  let viasData = null;
  loadCoarseGrainingData().then(data => {
    window.viasData = data;
  });

  if (window.rapotData?.ready){
    window.rapotData.ready
      .then(data => installDynamicNetworks(data))
      .catch(() => { /* se mantienen las redes locales como respaldo */ });
  }

})();