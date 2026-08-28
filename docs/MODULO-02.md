# MÓDULO 02 - Ingeniería Inversa POT
## Una ciudad que no cabe en el POT

### 📦 Contenido del módulo

```
modulo-02/
├── modulo-02.html          # Archivo principal HTML
├── modulo-02.css           # Estilos específicos del módulo 02
├── modulo-02.js            # Lógica interactiva (red, overlays, paneles)
├── site-theme.css          # Tema global del sitio
├── navigation-unified.css   # Navegación unificada
└── README.md               # Este archivo
```

### 🚀 Cómo usar

1. **Descarga los archivos** desde el ZIP
2. **Coloca todos los archivos en la misma carpeta**
3. **Abre `modulo-02.html` en tu navegador**

### 📋 Dependencias externas

El HTML carga automáticamente desde CDN:
- **Font Awesome 6.4.0** - Iconos
- **Google Fonts** - Tipografía (Inter, Space Grotesk)
- **D3.js** - Visualización de redes (cargado en el JS)

### 🎯 Características principales

✅ **Visualización interactiva de red** - POT como grafo dirigido
✅ **Filtrado dinámico** - Por tipo de relación y categorías
✅ **Overlay de Humedales** - Vista ampliada con hotspots
✅ **Overlay de Movilidad** - Análisis del sistema de transporte
✅ **Paneles informativos** - Detalles de nodos y aristas
✅ **Zoom y pan** - Exploración de la red completa
✅ **Responsive design** - Funciona en diferentes resoluciones

### 💡 Estructura del HTML

```html
<body>
  <div class="app">
    <!-- Sidebar de navegación -->
    <aside class="sidebar">...</aside>
    
    <!-- Contenido principal -->
    <main class="main">
      <!-- Topbar -->
      <div class="topbar">...</div>
      
      <!-- Sección de red -->
      <div class="network-section">
        <!-- Presentación -->
        <div class="welcome">...</div>
        
        <!-- Lienzo de red + leyenda -->
        <div class="network-body">
          <div class="network-canvas">
            <svg id="networkViz"></svg>
          </div>
          <aside class="network-legend">...</aside>
        </div>
        
        <!-- Análisis de conclusiones -->
        <section class="red-principal-reflexion">...</section>
      </div>
      
      <!-- Paneles informativos (flotantes) -->
      <div class="edge-info-panel"></div>
      <div class="node-info-panel"></div>
    </main>
  </div>
</body>
```

### 🎨 Colores principales

- **Teal (#2fd4c8)** - Primario, ecología
- **Naranja (#f5a623)** - Soporte/relaciones
- **Azul (#5b8def)** - Resiliencia
- **Fondo (#0a0a0a)** - Dark mode

### ⚙️ Variables CSS importantes

```css
:root {
  --bg: #0a0a0a;
  --panel: #121828;
  --text: #e7eaf2;
  --teal: #2fd4c8;
  --blue: #5b8def;
  /* ... más variables */
}
```

### 🔧 Funciones JS principales

- `initNetworkVisualization()` - Inicia la visualización
- `filterNetwork(type)` - Filtra por tipo de relación
- `showNodeInfo(node)` - Muestra panel de información de nodo
- `showEdgeInfo(edge)` - Muestra panel de información de arista
- `zoomIntoHumedales()` - Animación de zoom a humedales
- `setupHumedalesZoom()` - Control de zoom en overlay
- `pan()` - Capacidad de arrastrar el mapa

### 📱 Responsive breakpoints

```css
@media (max-width: 1100px) { /* Tablet */ }
@media (max-width: 700px) { /* Mobile */ }
```

### 🔗 Enlaces relacionados

- Módulo 01: Inicio
- Módulo 03: Discurso vs Realidad
- Módulo 04: Macromodelos
- Módulo 05: Navegador Multiescalar
- ...y más módulos

---

**Versión:** 1.0  
**Última actualización:** Agosto 2026  
**Autor:** Equipo POT Reverse Engineering
