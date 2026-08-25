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

// ===================== COARSE GRAINING: expansión dinámica de nodos =====================
let potData = null;

// Cargar datos del POT con todos los nodos
async function loadPOTData() {
  try {
    const response = await fetch('./data/pot_nodos_completos.json');
    potData = await response.json();
    console.log('POT data loaded:', potData.metadata);
  } catch (error) {
    console.warn('Could not load POT data:', error);
  }
}

// Llamar la carga de datos al iniciar
loadPOTData();

// Mapeo de nodos expandibles: solo elementos FÍSICOS Y MEDURABLES del territorio
// NO incluye conceptos legislativos como "Programas", "Actuaciones Estratégicas", "Proximidad"
// Mapeado por nodeId para detección automática en las redes
const EXPANDABLE_NODES = {
  // Estructura Ecológica Principal - elementos naturales físicos
  'rios': {
    label: 'Sistema Hídrico',
    dataPath: ['estructuras_territoriales', 'EEP', 'componentes', 'sistema_hídrico', 'elementos'],
    icon: 'fa-water',
    color: 'verde'
  },
  'humedales': {
    label: 'Humedales',
    dataPath: ['estructuras_territoriales', 'EEP', 'componentes', 'humedales', 'elementos'],
    icon: 'fa-droplet',
    color: 'verde'
  },
  'cerros': {
    label: 'Cerros Orientales',
    dataPath: ['estructuras_territoriales', 'EEP', 'componentes', 'cerros_orientales', 'elementos'],
    icon: 'fa-mountain',
    color: 'verde'
  },
  'paramos': {
    label: 'Complejos de Páramo',
    dataPath: ['estructuras_territoriales', 'EEP', 'componentes', 'cerros_orientales', 'elementos'],
    icon: 'fa-mountain',
    color: 'verde'
  },

  // Estructura Integradora de Patrimonios - patrimonio material medible
  'material': {
    label: 'Patrimonio Material',
    dataPath: ['estructuras_territoriales', 'EIP', 'componentes', 'patrimonio_material'],
    quantity: 50,
    icon: 'fa-landmark',
    color: 'purpura'
  },

  // Estructura Funcional y del Cuidado - infraestructura física
  'redvial': {
    label: 'Red Vial',
    dataPath: ['estructuras_territoriales', 'EFC', 'componentes', 'sistema_viario'],
    quantity: 500,
    icon: 'fa-road',
    color: 'azul'
  },
  'transporte': {
    label: 'Transporte Público',
    dataPath: ['estructuras_territoriales', 'EFC', 'componentes', 'transporte_publico'],
    quantity: 30,
    icon: 'fa-bus',
    color: 'azul'
  },
  'parques': {
    label: 'Espacio Público',
    dataPath: ['estructuras_territoriales', 'EFC', 'componentes', 'espacio_publico'],
    quantity: 150,
    icon: 'fa-tree',
    color: 'azul'
  },
  'equipamient': {
    label: 'Equipamientos',
    dataPath: ['estructuras_territoriales', 'EFC', 'componentes', 'equipamientos'],
    quantity: 200,
    icon: 'fa-building',
    color: 'azul'
  },

  // Estructura Socioeconómica - zonas productivas física medibles
  'industria': {
    label: 'Zonas Industriales',
    dataPath: ['estructuras_territoriales', 'ESECI', 'componentes', 'zonas_productivas'],
    quantity: 80,
    icon: 'fa-industry',
    color: 'amarillo'
  }
};

// Estado del coarse graining: track expandidos
const coarseGrainingState = {};

// Obtener elementos expandibles de los datos del POT
function getExpandableElements(nodeKey) {
  if (!potData || !EXPANDABLE_NODES[nodeKey]) return [];

  const nodeDef = EXPANDABLE_NODES[nodeKey];
  let data = potData;

  // Navegar por dataPath
  for (const key of nodeDef.dataPath) {
    data = data?.[key];
    if (!data) return [];
  }

  // Extraer elementos dependiendo de la estructura
  if (Array.isArray(data)) {
    return data.slice(0, 50); // Limitar a 50 para no saturar la visualización
  } else if (data?.elementos && Array.isArray(data.elementos)) {
    return data.elementos.slice(0, 50);
  } else if (data?.categorias) {
    // Para categorías, extraer ejemplos o cantidad
    const items = [];
    for (const [key, cat] of Object.entries(data.categorias)) {
      if (cat.ejemplo && Array.isArray(cat.ejemplo)) {
        items.push(...cat.ejemplo.slice(0, 10));
      } else if (typeof cat === 'number' || cat.cantidad) {
        items.push(`${key}: ${cat.cantidad || cat} items`);
      }
    }
    return items.slice(0, 50);
  }

  return [];
}

// Renderizar red visual de los elementos expandibles CON INTERACTIVIDAD
function renderCoarseGrainingNetwork(nodeId, nodeLabel, elements, svgContainer) {
  const svg = svgContainer.querySelector('svg') || svgContainer;
  const viewWidth = 800, viewHeight = 600;
  const centerX = viewWidth / 2, centerY = viewHeight / 2;
  const radius = Math.min(viewWidth, viewHeight) / 3;

  // Limpiar SVG
  const edgesG = svg.querySelector('.redes-edges');
  const nodesG = svg.querySelector('.redes-nodes');
  if (edgesG) edgesG.innerHTML = '';
  if (nodesG) nodesG.innerHTML = '';

  // Limitar elementos a mostrar para no saturar
  const displayElements = elements.slice(0, 30);
  const angle = Math.PI * 2 / displayElements.length;
  const MIN_NODE_R = 24, MAX_NODE_R = 48;

  // Contar conexiones por nodo (todos conectan al centro, pero algunos pueden conectarse entre sí)
  const nodeDegree = {};
  displayElements.forEach((_, idx) => {
    nodeDegree[idx] = 1; // Al menos conexión al centro
  });

  // Agregar conexiones dinámicas (ej: cada nodo se conecta con sus 2-3 vecinos más cercanos)
  displayElements.forEach((_, idx) => {
    const nextIdx = (idx + 1) % displayElements.length;
    const prevIdx = (idx - 1 + displayElements.length) % displayElements.length;
    nodeDegree[idx]++;
    nodeDegree[nextIdx]++;
    nodeDegree[prevIdx]++;
  });

  // Crear nodos periféricos CON TAMAÑO DINÁMICO
  const nodeElements = [];
  displayElements.forEach((item, idx) => {
    const itemAngle = angle * idx;
    const x = centerX + radius * Math.cos(itemAngle);
    const y = centerY + radius * Math.sin(itemAngle);

    // Tamaño basado en grado (hub si tiene muchas conexiones)
    const degree = nodeDegree[idx] || 1;
    const nodeRadius = MIN_NODE_R + (degree / 4) * (MAX_NODE_R - MIN_NODE_R);

    // Nodos vecinos para conectar
    const neighbors = [(idx - 1 + displayElements.length) % displayElements.length, (idx + 1) % displayElements.length];
    const connections = [{ from: idx, to: 'center' }, ...neighbors.map(n => ({ from: idx, to: n }))];

    // Guardar info del nodo
    nodeElements.push({ idx, x, y, nodeRadius, item, connections, degree });
  });

  // Dibujar conexiones
  if (edgesG) {
    nodeElements.forEach(({ idx, x, y, connections }) => {
      connections.forEach(conn => {
        if (conn.to === 'center') {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', centerX);
          line.setAttribute('y1', centerY);
          line.setAttribute('x2', x);
          line.setAttribute('y2', y);
          line.setAttribute('stroke', 'rgba(255,255,255,0.15)');
          line.setAttribute('stroke-width', '1.5');
          line.setAttribute('class', 'redes-edge');
          line.setAttribute('data-node', idx);
          edgesG.appendChild(line);
        } else if (conn.to > idx) {
          // Evitar duplicar líneas
          const neighbor = nodeElements[conn.to];
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', x);
          line.setAttribute('y1', y);
          line.setAttribute('x2', neighbor.x);
          line.setAttribute('y2', neighbor.y);
          line.setAttribute('stroke', 'rgba(255,255,255,0.08)');
          line.setAttribute('stroke-width', '1');
          line.setAttribute('class', 'redes-edge');
          line.setAttribute('data-node', `${idx},${conn.to}`);
          edgesG.appendChild(line);
        }
      });
    });
  }

  // Dibujar nodos con interactividad
  if (nodesG) {
    nodeElements.forEach(({ idx, x, y, nodeRadius, item }) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${x},${y})`);
      g.setAttribute('class', 'redes-node cg-animated');
      g.setAttribute('data-idx', idx);
      g.style.cursor = 'pointer';

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', nodeRadius);
      circle.setAttribute('fill', 'rgba(47, 212, 200, 0.1)');
      circle.setAttribute('stroke', 'rgba(47, 212, 200, 0.6)');
      circle.setAttribute('stroke-width', '2');
      g.appendChild(circle);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '0.3em');
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', 'rgba(255,255,255,0.7)');
      text.setAttribute('class', 'redes-node-label');

      const itemText = typeof item === 'object' ? (item.nombre || item.name || '?') : item;
      const truncated = itemText.substring(0, 12) + (itemText.length > 12 ? '...' : '');
      text.textContent = truncated;
      g.appendChild(text);

      // Interactividad: doble click = highlight, triple click = hide
      let clickCount = 0;
      let clickTimeout;

      g.addEventListener('click', (e) => {
        e.stopPropagation();
        clickCount++;

        if (clickCount === 1) {
          clickTimeout = setTimeout(() => {
            clickCount = 0;
          }, 300);
        } else if (clickCount === 2) {
          clearTimeout(clickTimeout);
          // DOBLE CLICK: Iluminar conexiones
          highlightNodeConnections(idx, edgesG, nodesG);
          clickCount = 0;
        } else if (clickCount === 3) {
          clearTimeout(clickTimeout);
          // TRIPLE CLICK: Desaparecer nodo
          g.classList.add('cg-hidden');
          // Ocultar conexiones asociadas
          document.querySelectorAll(`[data-node*="${idx}"]`).forEach(edge => {
            edge.style.opacity = '0';
          });
          clickCount = 0;
        }
      });

      nodesG.appendChild(g);
    });

    // Crear nodo central
    const centerG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    centerG.setAttribute('transform', `translate(${centerX},${centerY})`);
    centerG.setAttribute('class', 'redes-node is-primary cg-animated');
    centerG.style.cursor = 'pointer';

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', 48);
    circle.setAttribute('fill', 'rgba(47, 212, 200, 0.15)');
    circle.setAttribute('stroke', 'url(#grad-green)');
    circle.setAttribute('stroke-width', '3');
    centerG.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dy', '0.3em');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', 'rgba(255,255,255,0.9)');
    text.textContent = nodeLabel.substring(0, 16);
    centerG.appendChild(text);

    centerG.addEventListener('click', (e) => {
      e.stopPropagation();
      // Limpiar highlights al hacer click en centro
      document.querySelectorAll('.redes-node.cg-highlighted, .redes-edge.cg-highlighted').forEach(el => {
        el.classList.remove('cg-highlighted');
      });
    });

    nodesG.appendChild(centerG);
  }
}

// Resaltar conexiones de un nodo
function highlightNodeConnections(nodeIdx, edgesG, nodesG) {
  // Limpiar highlights anteriores
  document.querySelectorAll('.redes-node.cg-highlighted, .redes-edge.cg-highlighted').forEach(el => {
    el.classList.remove('cg-highlighted');
  });

  // Resaltar nodo actual
  const nodeEl = nodesG.querySelector(`[data-idx="${nodeIdx}"]`);
  if (nodeEl) {
    nodeEl.classList.add('cg-highlighted');
  }

  // Resaltar conexiones
  document.querySelectorAll(`.redes-edge[data-node*="${nodeIdx}"]`).forEach(edge => {
    edge.classList.add('cg-highlighted');
  });
}

// Abrir coarse graining modal: mostrar elementos en popup limpio y legible
function openCoarseGrainingModal(nodeId, nodeLabel) {
  if (!EXPANDABLE_NODES[nodeId]) return;

  const nodeDef = EXPANDABLE_NODES[nodeId];
  const elements = getExpandableElements(nodeId);

  if (!elements || elements.length === 0) {
    console.warn('No elements found for node:', nodeId);
    return;
  }

  // Obtener referencias al modal existente
  const overlay = document.getElementById('redes-modal-overlay');
  const modalBody = document.querySelector('.redes-modal-body');
  const titleEl = document.getElementById('redes-modal-title');
  const subtitleEl = document.querySelector('.redes-modal-subtitle');
  const sidePanel = modalBody.querySelector('.redes-side-panel');

  if (!overlay || !modalBody) return;

  // Actualizar título y subtítulo
  titleEl.textContent = nodeLabel;
  subtitleEl.textContent = `Elementos // Total = ${Math.min(elements.length, 50)}`;

  // Ocultar side panel para que la lista tenga todo el espacio
  if (sidePanel) {
    sidePanel.style.display = 'none';
  }

  // Limpiar SVG y crear lista en su lugar
  const svgContainer = modalBody.querySelector('.redes-network-svg');
  if (svgContainer) {
    svgContainer.style.display = 'none';
  }

  // Crear o actualizar contenedor de lista
  let listContainer = modalBody.querySelector('.coarse-graining-list');
  if (!listContainer) {
    listContainer = document.createElement('div');
    listContainer.className = 'coarse-graining-list';
    modalBody.insertBefore(listContainer, svgContainer);
  }

  // Llenar lista de elementos
  listContainer.innerHTML = '';
  const ul = document.createElement('ul');
  ul.className = 'coarse-graining-items';

  elements.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'coarse-graining-item';

    // Si es un objeto, mostrar nombre; si es string, mostrar directamente
    const text = typeof item === 'object' ? (item.nombre || item.name || JSON.stringify(item)) : item;
    li.innerHTML = `
      <span class="item-number">${String(idx + 1).padStart(3, '0')}</span>
      <span class="item-text">${text}</span>
    `;
    ul.appendChild(li);
  });

  listContainer.appendChild(ul);

  // Mostrar toggle de vista y configurar handlers
  const toggleDiv = document.getElementById('coarse-view-toggle');
  if (toggleDiv) {
    toggleDiv.hidden = false;

    // Guardar contexto actual para el toggle
    toggleDiv.dataset.nodeId = nodeId;
    toggleDiv.dataset.nodeLabel = nodeLabel;
    toggleDiv.dataset.elementCount = elements.length;

    // Configurar botones de toggle
    const listBtn = toggleDiv.querySelector('.toggle-list');
    const networkBtn = toggleDiv.querySelector('.toggle-network');

    if (listBtn && networkBtn) {
      listBtn.classList.add('is-active');
      networkBtn.classList.remove('is-active');

      listBtn.onclick = (e) => {
        e.preventDefault();
        listBtn.classList.add('is-active');
        networkBtn.classList.remove('is-active');
        listContainer.style.display = '';
        svgContainer.style.display = 'none';
      };

      networkBtn.onclick = (e) => {
        e.preventDefault();
        networkBtn.classList.add('is-active');
        listBtn.classList.remove('is-active');
        listContainer.style.display = 'none';
        svgContainer.style.display = '';
        renderCoarseGrainingNetwork(nodeId, nodeLabel, elements, svgContainer);
      };
    }
  }

  // Mostrar modal
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';

  console.log(`Opened coarse graining for ${nodeId}: ${elements.length} elements`);
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
    subtitleEl.textContent = `Modo Analítico // Nodos = ${net.count}`;

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
      const isExpandable = EXPANDABLE_NODES[n.id];
      const g = el("g", {
        class: `redes-node${n.primary ? " is-primary" : ""}${isExpandable ? " is-expandable" : ""}`,
        "data-accent": net.accent,
        "data-node-id": n.id,
        tabindex: "0",
        role: "button",
        "aria-label": `${n.label.join(" ")}${isExpandable ? " (click para expandir)" : " (click para atenuar)"}`,
        transform: `translate(${n.x},${n.y})`
      });

      // grupo interno: solo este flota con CSS, el externo mantiene la posición real del nodo
      const float = el("g", { class: "redes-node-float" });
      float.style.animationDuration = (4.4 + (i % 5) * 0.35).toFixed(2) + "s";
      float.style.animationDelay = (-(i % 7) * 0.5).toFixed(2) + "s";
      g.appendChild(float);

      const circle = el("circle", { r: n.r });
      float.appendChild(circle);

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
      float.appendChild(fo);

      const text = el("text", { class: "redes-node-label", y: -(n.r*0.62) + iconSize + 2 });
      n.label.forEach((line, i) => {
        const tspan = el("tspan", { x: 0, dy: i === 0 ? 10 : 11 });
        tspan.textContent = line;
        text.appendChild(tspan);
      });
      float.appendChild(text);

      // click en el nodo -> si es expandable, abrir modal con elementos; si no, atenuar
      function handleNodeClick(ev){
        ev.stopPropagation();
        if (isExpandable) {
          openCoarseGrainingModal(n.id, n.label.join(" "));
        } else {
          const dimmed = g.classList.toggle("is-dimmed");
          (edgesByNode[n.id] || []).forEach((edgeEl) => {
            edgeEl.classList.toggle("is-dimmed", dimmed);
          });
        }
      }
      g.addEventListener("click", handleNodeClick);
      g.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " "){
          ev.preventDefault();
          handleNodeClick(ev);
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

    // Restaurar SVG si estaba oculto por coarse graining
    const svgContainer = document.querySelector('.redes-modal-body .redes-network-svg');
    if (svgContainer) {
      svgContainer.style.display = '';
    }

    // Restaurar side panel si estaba oculto
    const sidePanel = document.querySelector('.redes-modal-body .redes-side-panel');
    if (sidePanel) {
      sidePanel.style.display = '';
    }

    // Limpiar lista de coarse graining
    const listContainer = document.querySelector('.coarse-graining-list');
    if (listContainer) {
      listContainer.innerHTML = '';
    }

    // Ocultar toggle de vista
    const toggleDiv = document.getElementById('coarse-view-toggle');
    if (toggleDiv) {
      toggleDiv.hidden = true;
    }
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

})();