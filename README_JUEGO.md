# 🐝 Abejas & Humedal - Juego Ecológico

Un juego educativo interactivo que simula la dinámica ecológica entre las abejas y un humedal a lo largo del tiempo.

## 🎮 Descripción del Juego

El juego modela la relación compleja entre las abejas polinizadoras y el ecosistema del humedal. Observa cómo:

- **Las abejas** buscan flores para polinizar y obtener comida
- **Las flores** dependen del agua del humedal y se reproducen cuando son polinizadas
- **La calidad del agua** afecta la supervivencia de las plantas
- **Las estaciones** cambian los ciclos de reproducción y disponibilidad de recursos

## 🎯 Cómo Jugar

### Instalación
```bash
pip install -r requirements.txt
python bees_wetland_game.py
```

### Controles
- **ESPACIO**: Pausar/Reanudar
- **R**: Reiniciar el juego
- **Q**: Salir

## 📊 Elementos del Juego

### Parte Visual (Superior)
- **Puntos Amarillos**: Abejas con buena energía
- **Puntos Naranjas**: Abejas con baja energía
- **Puntos Verdes**: Flores sin polinizar
- **Puntos Verde Oscuro**: Flores polinizadas
- **Puntos Rojos (con borde negro)**: Especies invasoras
- **Círculos Azul Claro (con borde negro grueso)**: Aves - Depredadores/Nectarívoros

### Panel de Información (Inferior)
| Métrica | Significado |
|---------|------------|
| **Día** | Progresión del tiempo |
| **Estación** | Primavera, Verano, Otoño, Invierno |
| **Abejas** | Población actual de abejas |
| **Flores** | Población actual de flores |
| **Clorofila** | Índice de vegetación (salud de las plantas) |
| **Calidad del Agua** | Porcentaje de salubridad del recurso hídrico |
| **Calidad del Aire** | Porcentaje de pureza del aire |
| **Capacidad del Humedal** | Porcentaje de uso de la capacidad máxima |
| **Comida** | Recursos disponibles del ecosistema |

## 🌍 Dinámicas Ecológicas

### Métricas Ambientales Clave

#### 🌱 Clorofila (Índice de Vegetación)
- Mide la salud y vitalidad de la vegetación del humedal
- **Basada en**:
  - Cantidad de flores presentes (>70% = mucha vegetación)
  - Calidad del agua (recursos para las plantas)
- **Afecta**:
  - Disponibilidad de alimento para las abejas
  - Producción de oxígeno en el humedal
  - Capacidad de filtración del agua

#### 💧 Calidad del Agua
- Índice de pureza y nutrientes del humedal
- Sube lentamente (+0.15% diario) si no hay contaminación
- **Disminuye por**:
  - Contaminación aleatoria (representa derrames, escorrentía)
  - Sobrepoblación de biomasa
- **Afecta**:
  - Supervivencia de flores y plantas acuáticas
  - Disponibilidad de agua para beber de las abejas
  - Reproducción de la vida acuática

#### 🌫️ Contaminación del Aire
- Mide la pureza del aire alrededor del humedal
- Sube naturalmente pero se contamina por eventos aleatorios
- **Impacto en abejas**:
  - A menor calidad de aire, las abejas pierden más energía
  - Menor ganancia de energía al polinizar
  - Mayor dificultad para encontrar flores

#### 🏞️ Capacidad del Humedal
- Porcentaje de uso de los recursos máximos disponibles
- Calculada como: (Abejas + Flores) / Capacidad Máxima
- **Indica**:
  - Si el ecosistema está sobrecargado (>80% = peligro)
  - Disponibilidad de espacio y recursos
  - Sostenibilidad del actual nivel de biodiversidad

#### 🚨 Especies Invasoras
- Organismos no nativos que colonizan el humedal
- **Aparecen cuando**:
  - La calidad del agua disminuye (oportunidad de establecerse)
  - De manera aleatoria en el ecosistema
  - Más frecuentemente en ecosistemas degradados
- **Impacto negativo**:
  - **Compiten con flores nativas** por espacio y recursos
  - **No son polinizadas por abejas** (no sirven como alimento)
  - **Ocupan espacio en el humedal** (aumentan capacidad)
  - **Alteran el equilibrio ecológico**
  - Cuando abundan (>20), comienzan a **matar flores nativas**
- **Indicadores de invasión**:
  - Color ROJO en el contador si hay más de 30 (crítico)
  - Color NARANJA si hay entre 10-30 (alerta)
  - Disminución de flores nativas coincide con invasoras

### Ciclo de las Abejas
1. Las abejas buscan flores automáticamente
2. Al encontrar una flor, obtienen energía y la polinizan
3. Si su energía llega a 0, mueren
4. Con suficiente alimento, se reproducen (más abejas)

### Ciclo de las Flores
1. Nacen flores en el humedal regularmente
2. Si una abeja las poliniza, pueden reproducirse
3. La calidad del agua afecta su supervivencia
4. Después de cierto tiempo, mueren naturalmente

### Estaciones
Cada estación (cada ~90 días) afecta:

- **🌸 Primavera**: Muchas flores, reproducción moderada de abejas
- **☀️ Verano**: Menos flores, máxima reproducción de abejas
- **🍂 Otoño**: Pocas flores, baja reproducción de abejas
- **❄️ Invierno**: Muy pocas flores, casi sin reproducción

### Calidad del Agua
- Se recupera lentamente cada día (+0.1%)
- Ocasionalmente disminuye por contaminación (-5 a -15%)
- Afecta la supervivencia de las flores y plantas

## 🎨 Interpretación de Colores

Los números en el panel se colorean según su estado:

- **🟢 Verde (>70%)**: Excelente estado, muy saludable
- **🟠 Naranja (40-70%)**: Estado medio, requiere atención
- **🔴 Rojo (<40%)**: Crítico, en peligro

## 📈 Objetivos de Aprendizaje

Este juego enseña:

✅ **Relaciones ecológicas**: Cómo dependen las especies una de la otra
✅ **Ciclos naturales**: Las estaciones y sus efectos en la biodiversidad
✅ **Equilibrio del ecosistema**: La importancia de mantener poblaciones saludables
✅ **Modelamiento dinámico**: Cómo los sistemas complejos evolucionan con el tiempo
✅ **Impacto ambiental**: Cómo la calidad del agua afecta todo el ecosistema

## 🔬 Interpretación de Resultados

### Ecosistema Saludable 🟢
✅ Abejas: 80+ individuos  
✅ Flores: 100+ plantas  
✅ Clorofila: >80% (vegetación abundante)  
✅ Calidad del Agua: >80% (muy puro)  
✅ Calidad del Aire: >80% (aire limpio)  
✅ Capacidad del Humedal: <60% (no saturado)  

### Ecosistema en Peligro 🔴
❌ Abejas: <20 individuos  
❌ Flores: <30 plantas  
❌ Clorofila: <40% (poca vegetación)  
❌ Calidad del Agua: <40% (contaminado)  
❌ Calidad del Aire: <40% (muy contaminado)  
❌ Capacidad del Humedal: >80% (sobrecargado)  

### Impacto de la Contaminación Ambiental
- **Alto nivel de contaminación del aire**: Las abejas pierden energía más rápido, tienen dificultad para polinizar
- **Agua contaminada**: Las flores tienen baja tasa de supervivencia y reproducción
- **Humedal sobrecargado**: Los recursos se agotan rápidamente, llevando al colapso
- **Baja clorofila**: Indicador de que el ecosistema no es capaz de sostener vida

### Cascada de Colapso Ecológico
1. **Contaminación del agua** → Mueren flores
2. **Menos flores** → Abejas pierden alimento
3. **Aire contaminado** → Abejas pierden energía rapidamente
4. **Abejas débiles** → No pueden polinizar
5. **Sin polinización** → Colapso total del humedal

## 💡 Sugerencias para Experimentar

1. **Prueba a pausar** y observa los patrones
2. **Reinicia varias veces** para ver diferentes resultados (los eventos son aleatorios)
3. **Observa las estaciones** y cómo cambian los números
4. **Piensa en**: ¿Qué pasaría si introducieras contaminación? ¿Y si hubiese sequía?

## 🔧 Características Técnicas

- Simulación en tiempo real con física y dinámica de poblaciones
- Generación procedural de eventos ambientales
- Interfaz gráfica interactiva con Pygame
- Sistema de comportamiento basado en agentes (abejas autónomas)
- Ciclo ecológico completo

## 📚 Conceptos Ecológicos Base

- **Polinización**: Transferencia de polen entre flores mediante insectos
- **Humedal**: Ecosistema con agua que alberga vida diversa
- **Biodiversidad**: Variedad de especies en un ecosistema
- **Equilibrio ecológico**: Estabilidad natural entre depredadores y presas
- **Ciclos estacionales**: Cambios periódicos en los ecosistemas

---

**¡Disfruta observando la dinámica de la naturaleza!** 🌍🐝🌸
