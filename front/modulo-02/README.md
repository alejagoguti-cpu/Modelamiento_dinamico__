# Módulo 02 - Ingeniería Inversa POT

## Una ciudad que no cabe en el POT

Visualización interactiva de red para el análisis de relaciones dinámicas en el POT (Plan de Ordenamiento Territorial) de Bogotá.

## 📁 Estructura del proyecto

```
modulo-02/
├── index.html                    # Página principal
├── assets/
│   ├── css/
│   │   ├── modulo-02.css        # Estilos específicos del módulo
│   │   ├── site-theme.css       # Tema global del sitio
│   │   └── navigation-unified.css # Navegación unificada
│   └── js/
│       └── modulo-02.js         # Lógica interactiva
└── README.md                      # Este archivo
```

## 🚀 Uso

1. Abre `index.html` en tu navegador
2. Explora la visualización de red interactiva
3. Usa los filtros para analizar diferentes tipos de relaciones

## 📋 Dependencias externas

El HTML carga automáticamente desde CDN:
- **Font Awesome 6.4.0** - Iconos
- **Google Fonts** - Tipografía (Inter, Space Grotesk)
- **D3.js** - Visualización de redes

## 🎯 Características principales

✅ Visualización interactiva de red  
✅ Filtrado dinámico por tipo de relación  
✅ Overlay de Humedales - Vista ampliada  
✅ Overlay de Movilidad - Análisis de transporte  
✅ Paneles informativos con detalles  
✅ Zoom y pan interactivo  
✅ Responsive design  

## 🎨 Paleta de colores

- **Teal (#2fd4c8)** - Primario, ecología
- **Naranja (#f5a623)** - Soporte/relaciones
- **Azul (#5b8def)** - Resiliencia
- **Fondo (#0a0a0a)** - Dark mode

## 🔧 Funciones JS principales

- `initNetworkVisualization()` - Inicia la visualización
- `filterNetwork(type)` - Filtra por tipo de relación
- `showNodeInfo(node)` - Muestra información de nodo
- `showEdgeInfo(edge)` - Muestra información de arista
- `zoomIntoHumedales()` - Zoom a humedales
- `pan()` - Desplazamiento del mapa

## 📱 Responsive breakpoints

- **Tablet:** `max-width: 1100px`
- **Mobile:** `max-width: 700px`

---

**Versión:** 1.0  
**Última actualización:** Agosto 2026  
**Equipo:** POT Reverse Engineering
