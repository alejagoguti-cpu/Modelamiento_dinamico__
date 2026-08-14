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
