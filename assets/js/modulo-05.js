/* ==========================================================================
   MÓDULO 05 · Navegador multiescalar — Kennedy / POT (Decreto 555 de 2021)
   Todo el contenido de los 7 módulos vive en este archivo y se despliega
   dentro de la misma página: no hay navegación a archivos externos, así que
   ningún módulo puede terminar en un 404.
   ========================================================================== */
(function () {
  "use strict";

  /* ----------------------------------------------------------------- escalas */
  var SCALES = {
    metro: {
      label: "Metropolitana / regional",
      note: "Escala del río Bogotá, la sabana inundable del Tintal, el aeropuerto y el sistema de abastecimiento: aquí Kennedy no es una localidad, es una pieza de un metabolismo regional."
    },
    local: {
      label: "Localidad de Kennedy",
      note: "Escala de la localidad 8 completa: las cuatro actuaciones estratégicas, los tres humedales, Corabastos y la malla arterial que la parte en cuatro."
    },
    upl: {
      label: "UPL / UPZ",
      note: "Escala intermedia (Patio Bonito, Corabastos, Tintal Norte, Kennedy Central, Castilla, Carvajal, Américas…): aquí aparecen los déficits de soporte y los contrastes internos de la localidad."
    },
    manzana: {
      label: "Barrio – manzana",
      note: "Escala del andén, el paradero, la esquina y el patio: donde se comprueba si la proximidad, el cuidado y el reverdecimiento del POT existen o no."
    }
  };

  var FLAG = '<div class="m5-flag"><b>Verificar contra la fuente primaria</b>' +
    'Los códigos, nombres y delimitaciones de las actuaciones estratégicas y de las UPL deben ' +
    'contrastarse con el Decreto 555 de 2021 y sus anexos cartográficos antes de la entrega. ' +
    'Este navegador organiza el argumento; la cita textual y el plano oficial los pone el equipo.</div>';

  /* ----------------------------------------------------------------- módulos */
  var MODULES = [
    /* ============================================================ MÓDULO 01 */
    {
      id: "m1",
      num: "01",
      sesion: 1,
      title: "Red de macromodelos",
      kicker: "Sesión 1 · Nuestro modelo",
      summary: "Los paradigmas, ideas y supuestos que sostienen nuestra manera de comprender la ciudad, y las consecuencias de cada relación entre ellos.",
      scales: {
        metro: "Los macromodelos se enuncian a escala regional: ciudad-región, cuenca, metabolismo.",
        local: "Se prueban en Kennedy: ¿el supuesto explica lo que pasa en la localidad 8?",
        upl: "Se operacionalizan por UPL: cada supuesto pide un indicador observable.",
        manzana: "Se falsean en la manzana: si el supuesto no se ve en la esquina, es retórica."
      },
      main: [
        '<div class="m5-block">',
        '<h3>Qué pide el corte</h3>',
        '<p>Construir una red que explique los <strong>paradigmas, ideas y supuestos</strong> que sostienen ',
        'la manera en que comprendemos la ciudad —el modelo del corte pasado—, explicando cómo se ',
        'relacionan entre sí y <strong>qué consecuencias</strong> tiene cada relación.</p>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Los siete macromodelos</h3>',
        '<ol>',
        '<li><strong>Ciudad como sistema complejo adaptativo.</strong> No es un objeto que se diseña, es un proceso que se regula: tiene memoria, retardos y umbrales.</li>',
        '<li><strong>Territorio como metabolismo.</strong> La ciudad se explica por flujos —agua, alimento, residuo, energía, cuerpos— antes que por usos del suelo.</li>',
        '<li><strong>Relacionalidad.</strong> El POT se lee como red de relaciones entre componentes, no como un listado de normas y perímetros.</li>',
        '<li><strong>Escalas anidadas.</strong> Lo metropolitano se juega en la manzana; ninguna decisión pertenece a una sola escala.</li>',
        '<li><strong>Emergencia y autoorganización.</strong> Buena parte del orden urbano se produce sin poder central: mercados, acueductos vecinales, rutas informales.</li>',
        '<li><strong>Justicia socioespacial.</strong> La pregunta no es cuánto se construye sino <em>quién accede a qué, en cuánto tiempo y a qué costo</em>.</li>',
        '<li><strong>El agua como estructurante primario.</strong> En una llanura de inundación, la hidrología antecede y sobrevive a la norma.</li>',
        '</ol>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Red: relaciones y consecuencias</h3>',
        '<div class="m5-net">',
        '<svg viewBox="0 0 560 300" role="img" aria-label="Red de los siete macromodelos y sus relaciones">',
        '<g class="edges">',
        '<path class="edge" d="M280,42 C180,70 130,110 108,148"/>',
        '<path class="edge" d="M280,42 C380,70 430,110 452,148"/>',
        '<path class="edge" d="M108,148 C160,190 220,215 268,236"/>',
        '<path class="edge" d="M452,148 C400,190 340,215 292,236"/>',
        '<path class="edge edge-dashed" d="M108,148 C230,140 330,140 452,148"/>',
        '<path class="edge edge-dashed" d="M280,42 C300,120 300,180 280,236"/>',
        '<path class="edge" d="M268,236 C200,262 140,262 96,250"/>',
        '<path class="edge" d="M292,236 C360,262 420,262 464,250"/>',
        '</g>',
        '<g class="node"><circle cx="280" cy="42" r="34"/><text x="280" y="38">Sistema</text><text x="280" y="47">complejo</text></g>',
        '<g class="node n-amber"><circle cx="108" cy="148" r="34"/><text x="108" y="145">Metabolismo</text><text x="108" y="154">territorial</text></g>',
        '<g class="node n-coral"><circle cx="452" cy="148" r="34"/><text x="452" y="145">Relacionalidad</text><text x="452" y="154">(POT como red)</text></g>',
        '<g class="node"><circle cx="280" cy="236" r="34"/><text x="280" y="233">Escalas</text><text x="280" y="242">anidadas</text></g>',
        '<g class="node n-amber"><circle cx="96" cy="250" r="30"/><text x="96" y="247">Agua</text><text x="96" y="256">estructurante</text></g>',
        '<g class="node n-coral"><circle cx="464" cy="250" r="30"/><text x="464" y="247">Auto-</text><text x="464" y="256">organización</text></g>',
        '</svg>',
        '</div>',
        '<p class="m5-net-caption">Línea continua: relación de determinación. Línea punteada: relación de traducción metodológica. La justicia socioespacial no es un nodo: es el criterio con que se leen todas las aristas.</p>',
        '<div class="m5-table-wrap" style="margin-top:16px">',
        '<table class="m5-table">',
        '<thead><tr><th>Relación</th><th>Qué produce</th><th>Consecuencia para el análisis</th></tr></thead>',
        '<tbody>',
        '<tr><td>Sistema complejo → Metabolismo</td><td>La ciudad se mide por flujos y no por inventarios</td><td>Los indicadores dejan de ser de stock (m², km) y pasan a ser de flujo (tiempo, frecuencia, caudal)</td></tr>',
        '<tr><td>Metabolismo → Agua estructurante</td><td>El agua aparece como el flujo que ordena todos los demás</td><td>En Kennedy, cualquier decisión de suelo se evalúa primero contra la llanura de inundación</td></tr>',
        '<tr><td>Relacionalidad → Escalas anidadas</td><td>Ninguna relación se explica dentro de una sola escala</td><td>Obliga a la lectura multiescalar: metropolitana, local, UPL y manzana</td></tr>',
        '<tr><td>Escalas anidadas → Autoorganización</td><td>Lo que el plan no resuelve, el barrio lo resuelve solo</td><td>Hay que mapear actores no formales, no solo entidades</td></tr>',
        '<tr><td>Autoorganización → Sistema complejo</td><td>Retroalimentación: el orden emergente cambia el sistema</td><td>El modelo debe admitir que el POT es solo uno de los reguladores del territorio</td></tr>',
        '<tr><td>Relacionalidad ↔ Metabolismo</td><td>Traducción: la red se vuelve conectografía</td><td>Las redes deben espacializarse sobre cartografía real (módulo 05)</td></tr>',
        '</tbody></table></div>',
        '</div>'
      ].join(""),
      aside: [
        { title: "Entregable", html: "<ul><li><strong>1 red</strong> de macromodelos con nodos y aristas rotuladas</li><li><strong>1 tabla</strong> relación → consecuencia</li><li><strong>1 párrafo</strong> de supuesto dominante</li></ul>" },
        { title: "Trampa a evitar", html: "<ul><li>Enunciar paradigmas sin decir qué produce cada relación</li><li>Confundir macromodelo con tema (movilidad no es un paradigma)</li></ul>" }
      ],
      todos: [
        "Enunciar los supuestos del modelo del corte pasado",
        "Dibujar la red con aristas rotuladas",
        "Escribir la consecuencia de cada relación",
        "Marcar el supuesto que domina nuestra lectura"
      ]
    },

    /* ============================================================ MÓDULO 02 */
    {
      id: "m2",
      num: "02",
      sesion: 1,
      title: "El POT aterrizado en Kennedy",
      kicker: "Sesión 1 · Modelo territorial + 4 actuaciones estratégicas",
      summary: "Qué modelo territorial propone el Decreto 555 de 2021 para la localidad 8, y el mapeo obligatorio de AE09, AE15, AE16 y AE17.",
      scales: {
        metro: "Kennedy como pieza del borde occidental: río Bogotá, aeropuerto, corredor de abastecimiento y ciudad-región.",
        local: "El modelo territorial completo de la localidad: proximidad, reverdecimiento, revitalización y cuidado.",
        upl: "Las cuatro actuaciones estratégicas caen sobre UPL distintas y con capacidades de soporte muy desiguales.",
        manzana: "Qué cambia realmente en el predio: edificabilidad, cargas, obligaciones de espacio público y cesiones."
      },
      main: [
        '<div class="m5-block">',
        '<h3>Qué modelo territorial propone el POT para Kennedy</h3>',
        '<ul>',
        '<li><strong>Proximidad.</strong> La localidad se reorganiza para resolver la vida cotidiana en un radio corto de caminata, con equipamientos y servicios distribuidos.</li>',
        '<li><strong>Reverdecimiento.</strong> Estructura ecológica principal, humedales y canales pasan a leerse como soporte, con corredores verdes sobre la malla arterial.</li>',
        '<li><strong>Revitalización y densificación en corredores.</strong> Más suelo y más edificabilidad alrededor de los ejes de transporte masivo, con la promesa de soportes urbanos asociados.</li>',
        '<li><strong>Cuidado.</strong> El sistema del cuidado y del servicio social introduce infraestructura y tiempo de cuidado como asunto de ordenamiento.</li>',
        '<li><strong>Multimodalidad.</strong> Metro, troncales, cables y ciclorrutas como armadura de la movilidad, medida por infraestructura construida.</li>',
        '<li><strong>Borde de río y gestión del riesgo.</strong> El occidente de Kennedy queda definido por el río Bogotá y la llanura del Tintal.</li>',
        '</ul>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Mapeo obligatorio: las cuatro actuaciones estratégicas</h3>',
        '<div class="m5-ae">',
        '<span class="m5-ae-code">AE09</span>',
        '<h4>Distrito Aeroportuario Fontibón</h4>',
        '<p>Actuación de escala regional asociada a la operación aeroportuaria y su plataforma logística. Es la pieza que introduce en el borde noroccidental de Kennedy una lógica de flujos de carga y empleo que no obedece a la escala barrial.</p>',
        '<dl>',
        '<dt>Qué mapear</dt><dd>Perímetro, corredores de carga, empleo asociado y su relación con Corabastos.</dd>',
        '<dt>Pregunta crítica</dt><dd>¿La localidad recibe la carga (tráfico, ruido, presión de suelo) y captura los beneficios (empleo formal, renta)?</dd>',
        '</dl>',
        '</div>',
        '<div class="m5-ae">',
        '<span class="m5-ae-code">AE15</span>',
        '<h4>Eje Tintal</h4>',
        '<p>Actuación sobre el eje occidental de la localidad, en el suelo de la antigua llanura de inundación del río Bogotá, con la mayor capacidad de nuevo desarrollo y densificación de Kennedy.</p>',
        '<dl>',
        '<dt>Qué mapear</dt><dd>Áreas de desarrollo, canales (Cundinamarca, Tintal), soportes existentes vs. población proyectada.</dd>',
        '<dt>Pregunta crítica</dt><dd>¿Se densifica sobre suelo inundable antes de garantizar drenaje, espacio público y equipamientos?</dd>',
        '</dl>',
        '</div>',
        '<div class="m5-ae">',
        '<span class="m5-ae-code">AE16</span>',
        '<h4>Porvenir</h4>',
        '<p>Actuación de borde asociada al corredor de la avenida Villavicencio / El Porvenir, articulada al primer tramo del sistema metro y a los grandes desarrollos de vivienda del occidente.</p>',
        '<dl>',
        '<dt>Qué mapear</dt><dd>Corredor de transporte, vivienda de interés social, cesiones y déficit de soporte por UPL.</dd>',
        '<dt>Pregunta crítica</dt><dd>¿La proximidad prometida se traduce en tiempos de viaje reales o en más transbordos?</dd>',
        '</dl>',
        '</div>',
        '<div class="m5-ae">',
        '<span class="m5-ae-code">AE17</span>',
        '<h4>Chucua La Vaca</h4>',
        '<p>Actuación de carácter ambiental sobre el humedal La Vaca y su entorno, el caso donde la estructura ecológica principal, el riesgo y la ocupación informal se cruzan de manera más tensa en la localidad.</p>',
        '<dl>',
        '<dt>Qué mapear</dt><dd>Polígono del humedal, suelo de protección, ocupaciones en el borde y conexión con El Burro y Techo.</dd>',
        '<dt>Pregunta crítica</dt><dd>¿Se restaura un ecosistema o se produce un parque? ¿Quién queda dentro y quién queda fuera del borde?</dd>',
        '</dl>',
        '</div>',
        FLAG,
        '</div>',

        '<div class="m5-block">',
        '<h3>Cómo mapear (procedimiento mínimo)</h3>',
        '<ol>',
        '<li>Base: límite de la localidad + hidrografía (río Bogotá, Fucha, canales) + humedales + malla arterial.</li>',
        '<li>Encima: los cuatro polígonos de AE, con su código visible.</li>',
        '<li>Encima: los soportes existentes (equipamientos, espacio público efectivo, estaciones).</li>',
        '<li>Lectura: dónde <em>coincide</em> nueva edificabilidad con déficit de soporte. Ese cruce es el hallazgo, no el mapa.</li>',
        '</ol>',
        '</div>'
      ].join(""),
      aside: [
        { title: "Entregable", html: "<ul><li><strong>1 plano</strong> de la localidad con las 4 AE</li><li><strong>4 fichas</strong> (una por AE)</li><li><strong>1 lectura</strong> del modelo territorial propuesto</li></ul>" },
        { title: "Fuentes", html: "<ul><li>Decreto 555 de 2021 y anexos</li><li>Cartografía oficial de AE</li><li>Ficha de la localidad 8 (SDP)</li></ul>" }
      ],
      todos: [
        "Extraer del POT el modelo territorial para Kennedy",
        "Mapear AE09, AE15, AE16 y AE17",
        "Llenar la ficha crítica de cada AE",
        "Superponer edificabilidad nueva vs. déficit de soporte"
      ]
    },

    /* ============================================================ MÓDULO 03 */
    {
      id: "m3",
      num: "03",
      sesion: 1,
      title: "Problemas, indicadores y ODS",
      kicker: "Sesión 1 · POT vs. nuestro modelo",
      summary: "Los problemas que el POT ve en Kennedy, los que nuestro modelo revela y el POT ignora, cada uno con indicador y ODS.",
      scales: {
        metro: "Indicadores de cuenca y de sistema: calidad del río, abastecimiento alimentario, emisiones.",
        local: "Indicadores de localidad: espacio público efectivo por habitante, cobertura de equipamientos.",
        upl: "Indicadores comparados entre UPL: la desigualdad interna de Kennedy es el dato.",
        manzana: "Indicadores de experiencia: tiempo real a pie, transbordos, sombra, andén libre."
      },
      main: [
        '<div class="m5-block">',
        '<h3>Tabla comparada</h3>',
        '<div class="m5-table-wrap">',
        '<table class="m5-table">',
        '<thead><tr><th>Tema</th><th>Problema que ve el POT</th><th>Problema que revela nuestro modelo</th><th>Indicador</th><th>ODS</th></tr></thead>',
        '<tbody>',
        '<tr><td>Agua y riesgo</td><td>Suelo de protección por delimitar y humedales por recuperar</td><td>Se ordena sobre una llanura de inundación cuyo drenaje ya está saturado: el riesgo se produce, no se hereda</td><td>Hectáreas de humedal en restauración efectiva · % de área con drenaje al límite de capacidad</td><td><span class="m5-ods">ODS 6</span><span class="m5-ods">ODS 13</span><span class="m5-ods">ODS 15</span></td></tr>',
        '<tr><td>Espacio público</td><td>Déficit cuantitativo de espacio público y verde urbano</td><td>El déficit no es de metros sino de acceso: la malla arterial parte la localidad y el verde queda del otro lado de la avenida</td><td>m² de EP efectivo/habitante · % de población a ≤10 min a pie de un parque</td><td><span class="m5-ods">ODS 11</span><span class="m5-ods">ODS 3</span></td></tr>',
        '<tr><td>Movilidad</td><td>Falta de infraestructura multimodal (metro, troncales, cables, ciclorrutas)</td><td>El POT mide infraestructura construida, no el viaje cotidiano: transbordos, esperas y desigualdad de acceso</td><td>Tiempo puerta a puerta al empleo · nº de transbordos · % de viajes &gt;60 min</td><td><span class="m5-ods">ODS 11</span><span class="m5-ods">ODS 9</span></td></tr>',
        '<tr><td>Economía</td><td>Necesidad de suelo para actividad económica y empleo formal</td><td>La economía real de Kennedy es de abasto, informal y logística (Corabastos): el POT la regula como uso, no la reconoce como sistema</td><td>Tasa de informalidad laboral · empleos/1.000 hab. en la UPL · toneladas/día movidas por el nodo de abasto</td><td><span class="m5-ods">ODS 8</span><span class="m5-ods">ODS 12</span></td></tr>',
        '<tr><td>Cuidado</td><td>Déficit de equipamientos del sistema del cuidado</td><td>El tiempo de cuidado no se ordena: la distancia se resuelve con trabajo no pagado, mayoritariamente de mujeres</td><td>Tiempo de viaje al equipamiento de cuidado más cercano · horas semanales de trabajo de cuidado no remunerado</td><td><span class="m5-ods">ODS 5</span><span class="m5-ods">ODS 10</span></td></tr>',
        '<tr><td>Vivienda</td><td>Necesidad de vivienda nueva y de mejoramiento integral</td><td>Densificar el borde occidental sin soporte convierte la solución de vivienda en un problema de habitabilidad</td><td>Hogares en hacinamiento · viviendas nuevas por equipamiento disponible</td><td><span class="m5-ods">ODS 11</span><span class="m5-ods">ODS 1</span></td></tr>',
        '<tr><td>Gobernanza</td><td>Participación entendida como instancia formal de concertación</td><td>Las decisiones que cambian el territorio se toman a escala metropolitana; el barrio participa después del hecho</td><td>Nº de decisiones con incidencia local efectiva · tiempo entre decisión y consulta</td><td><span class="m5-ods">ODS 16</span><span class="m5-ods">ODS 11</span></td></tr>',
        '</tbody></table></div>',
        '<p style="margin-top:14px">Las tres primeras filas son el terreno común (el POT ve el problema pero lo mide mal). ',
        'Las tres últimas son el aporte propio: <strong>problemas que el modelo del POT no puede ver</strong> porque ',
        'no tiene variables de tiempo, de trabajo ni de decisión.</p>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Regla de construcción del indicador</h3>',
        '<ol>',
        '<li>El indicador debe poder <strong>bajar de escala</strong>: si no se puede medir en la UPL, no sirve para Kennedy.</li>',
        '<li>Debe ser de <strong>flujo o de acceso</strong>, no solo de stock.</li>',
        '<li>Debe tener <strong>fuente</strong>: DANE, SDP, Encuesta Multipropósito, Encuesta de Movilidad, IDECA.</li>',
        '<li>El ODS se empareja por <strong>meta</strong>, no por número: cita la meta específica.</li>',
        '</ol>',
        '</div>'
      ].join(""),
      aside: [
        { title: "Entregable", html: "<ul><li><strong>1 tabla</strong> problema–indicador–ODS</li><li><strong>3 problemas propios</strong> que el POT ignora</li><li><strong>Fuente</strong> por indicador</li></ul>" },
        { title: "Fuentes de dato", html: "<ul><li>Encuesta Multipropósito</li><li>Encuesta de Movilidad</li><li>IDECA / Mapas Bogotá</li><li>Observatorio de espacio público</li></ul>" }
      ],
      todos: [
        "Listar los problemas que el POT declara para Kennedy",
        "Listar los problemas que revela nuestro modelo",
        "Asignar indicador medible a cada problema",
        "Emparejar cada problema con la meta ODS"
      ]
    },

    /* ============================================================ MÓDULO 04 */
    {
      id: "m4",
      num: "04",
      sesion: 2,
      title: "Dinámicas, actores y macroproblema",
      kicker: "Sesión 2 · De los datos a las causas",
      summary: "Red que conecta los subproblemas hasta descubrir el macroproblema de Kennedy, más la red de actores y su poder de decisión.",
      scales: {
        metro: "Los bucles se cierran fuera de la localidad: la decisión de densificar y la de sanear el río no son locales.",
        local: "El macroproblema se enuncia a escala de localidad: es la síntesis del corte.",
        upl: "Cada bucle se verifica en una UPL concreta antes de generalizarlo.",
        manzana: "En la manzana se ve el efecto final del bucle: inundación, espera, hacinamiento."
      },
      main: [
        '<div class="m5-block">',
        '<h3>De subproblemas a bucles</h3>',
        '<ul>',
        '<li><strong>Bucle de refuerzo — urbanización del suelo inundable.</strong> Nueva edificabilidad en el Tintal → más superficie impermeable → menos capacidad de drenaje → más inundación → más obra hidráulica dura → más suelo habilitado para urbanizar. <em>Se refuerza solo.</em></li>',
        '<li><strong>Bucle de refuerzo — proximidad prometida.</strong> Densificación en corredores → aumento de demanda de servicios → soportes que no crecen al mismo ritmo → viajes más largos → más presión por infraestructura de transporte → más densificación del corredor.</li>',
        '<li><strong>Bucle de balance roto — cuidado.</strong> Déficit de equipamiento de cuidado → el tiempo lo absorbe el hogar → menos participación laboral y política → menos capacidad de exigir equipamiento. <em>El balance que debería corregir el sistema está desconectado.</em></li>',
        '<li><strong>Bucle de refuerzo — abasto.</strong> Concentración del abastecimiento en un solo nodo → economía informal en el entorno → deterioro del espacio público → intervención de renovación → desplazamiento de la economía que sostenía el nodo.</li>',
        '</ul>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Macroproblema propuesto</h3>',
        '<p><strong>Kennedy se ordena como suelo disponible y no como sistema de soporte.</strong> ',
        'El POT asigna a la localidad el papel de recibir densidad, vivienda y logística sobre la llanura ',
        'de inundación del río Bogotá, mientras mide su éxito en infraestructura construida y no en ',
        'capacidad de sostener la vida cotidiana. El resultado es un territorio que crece más rápido que ',
        'sus soportes ambientales y de cuidado, y que se sostiene gracias a economías y organizaciones ',
        'comunitarias que el propio plan no reconoce como parte del modelo.</p>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Red de actores y poder de decisión</h3>',
        '<div class="m5-net">',
        '<svg viewBox="0 0 560 320" role="img" aria-label="Red de actores de Kennedy y su poder de decisión">',
        '<g class="edges">',
        '<path class="edge" d="M280,40 C200,60 150,90 126,118"/>',
        '<path class="edge" d="M280,40 C360,60 410,90 434,118"/>',
        '<path class="edge" d="M126,118 C150,170 190,200 246,214"/>',
        '<path class="edge" d="M434,118 C410,170 370,200 314,214"/>',
        '<path class="edge edge-dashed" d="M246,214 C180,250 120,262 86,258"/>',
        '<path class="edge edge-dashed" d="M314,214 C380,250 440,262 474,258"/>',
        '<path class="edge edge-dashed" d="M86,258 C200,290 360,290 474,258"/>',
        '<path class="edge" d="M280,40 C300,110 300,170 280,214"/>',
        '</g>',
        '<g class="node"><circle cx="280" cy="40" r="32"/><text x="280" y="37">Distrito</text><text x="280" y="46">(SDP · SDA)</text></g>',
        '<g class="node n-amber"><circle cx="126" cy="118" r="32"/><text x="126" y="115">EAAB ·</text><text x="126" y="124">CAR</text></g>',
        '<g class="node n-amber"><circle cx="434" cy="118" r="32"/><text x="434" y="115">IDU · Metro</text><text x="434" y="124">TransMilenio</text></g>',
        '<g class="node"><circle cx="280" cy="214" r="32"/><text x="280" y="211">Alcaldía</text><text x="280" y="220">local</text></g>',
        '<g class="node n-coral"><circle cx="86" cy="258" r="30"/><text x="86" y="255">Mesas de</text><text x="86" y="264">humedal · JAC</text></g>',
        '<g class="node n-coral"><circle cx="474" cy="258" r="30"/><text x="474" y="252">Corabastos ·</text><text x="474" y="261">comercio</text><text x="474" y="270">informal</text></g>',
        '</svg>',
        '</div>',
        '<p class="m5-net-caption">Continua: relación con capacidad de decisión formal. Punteada: relación de incidencia sin poder de decisión. El hallazgo es la asimetría: quienes viven el efecto están en el borde de la red.</p>',
        '<div class="m5-table-wrap" style="margin-top:16px">',
        '<table class="m5-table">',
        '<thead><tr><th>Actor</th><th>Tipo</th><th>Poder de decisión</th><th>Qué defiende</th></tr></thead>',
        '<tbody>',
        '<tr><td>Secretaría Distrital de Planeación</td><td>Público distrital</td><td>Alto — define norma y actuaciones</td><td>El modelo de ordenamiento y su ejecución</td></tr>',
        '<tr><td>Secretaría de Ambiente · CAR</td><td>Público / regional</td><td>Medio-alto — determinantes ambientales</td><td>Suelo de protección y humedales</td></tr>',
        '<tr><td>EAAB</td><td>Empresa pública</td><td>Alto — habilita suelo con redes</td><td>Servicio, drenaje y saneamiento</td></tr>',
        '<tr><td>IDU · Metro · TransMilenio</td><td>Público / proyecto</td><td>Alto — fija corredores y plusvalías</td><td>Infraestructura y su cronograma</td></tr>',
        '<tr><td>Constructoras y curadurías</td><td>Privado</td><td>Alto de hecho — ritmo real de ocupación</td><td>Edificabilidad y renta del suelo</td></tr>',
        '<tr><td>Alcaldía local · JAL</td><td>Público local</td><td>Bajo — presupuesto y gestión menor</td><td>Obras locales y convivencia</td></tr>',
        '<tr><td>JAC, mesas ambientales de humedal</td><td>Comunitario</td><td>Bajo formal / alto simbólico</td><td>Humedal, borde y permanencia</td></tr>',
        '<tr><td>Corabastos, comerciantes, recicladores</td><td>Económico no formal</td><td>Bajo formal / alto operativo</td><td>Abasto diario y sustento</td></tr>',
        '</tbody></table></div>',
        '</div>'
      ].join(""),
      aside: [
        { title: "Entregable", html: "<ul><li><strong>1 red</strong> de dinámicas con bucles señalados</li><li><strong>1 enunciado</strong> de macroproblema</li><li><strong>1 red</strong> de actores con poder de decisión</li></ul>" },
        { title: "Cómo se lee un bucle", html: "<ul><li><strong>R</strong> refuerzo: la causa vuelve amplificada</li><li><strong>B</strong> balance: el sistema se autocorrige</li><li>Marcar el <strong>retardo</strong>: casi todo el daño está ahí</li></ul>" }
      ],
      todos: [
        "Conectar los subproblemas del módulo 03",
        "Identificar y rotular los bucles (R / B)",
        "Redactar el macroproblema en una frase",
        "Construir la red de actores y marcar quién decide"
      ]
    },

    /* ============================================================ MÓDULO 05 */
    {
      id: "m5",
      num: "05",
      sesion: 2,
      title: "Conectografías",
      kicker: "Sesión 2 · El mapa real",
      summary: "Espacializar las relaciones de las redes sobre la cartografía de Kennedy: causalidades, cruces y flujos físicos, no capas decorativas.",
      scales: {
        metro: "Conectografía de cuenca y de abasto: de dónde viene el agua y de dónde viene la comida.",
        local: "Conectografía de la localidad completa: las cuatro AE y los tres humedales en un solo plano.",
        upl: "Conectografía comparada entre UPL: mismo fenómeno, intensidades distintas.",
        manzana: "Conectografía de detalle: la esquina, el paradero y el borde del humedal."
      },
      main: [
        '<div class="m5-block">',
        '<h3>Advertencia del enunciado</h3>',
        '<p>No se piden capas gráficas decorativas. Cada conectografía debe mostrar <strong>causalidades, ',
        'cruces y flujos físicos sobre el mapa</strong>: si al quitarle los colores el plano deja de decir algo, ',
        'no es una conectografía.</p>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Capas base obligatorias</h3>',
        '<ul>',
        '<li>Hidrografía: río Bogotá, río Fucha, canal Cundinamarca, canal Tintal y red de drenaje.</li>',
        '<li>Estructura ecológica: humedales La Vaca, El Burro y Techo, suelo de protección.</li>',
        '<li>Malla arterial: Av. Ciudad de Cali, Av. Boyacá, Av. Las Américas, Av. Villavicencio, Av. Primero de Mayo.</li>',
        '<li>Transporte: troncales existentes, trazado y estaciones del sistema metro, ciclorrutas.</li>',
        '<li>Nodos económicos: Corabastos y la plataforma logística del occidente.</li>',
        '<li>Los cuatro polígonos de actuación estratégica: AE09, AE15, AE16, AE17.</li>',
        '</ul>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Las cuatro conectografías a dibujar</h3>',
        '<div class="m5-table-wrap">',
        '<table class="m5-table">',
        '<thead><tr><th>Conectografía</th><th>Qué flujo espacializa</th><th>Cruce que debe quedar visible</th></tr></thead>',
        '<tbody>',
        '<tr><td>Agua y riesgo</td><td>Escorrentía, drenaje y suelo impermeable</td><td>Nueva edificabilidad del AE15 sobre la llanura inundable y el borde del AE17</td></tr>',
        '<tr><td>Abasto</td><td>Alimento: ingreso regional, distribución y residuo</td><td>Corabastos como nodo único y su relación con el corredor logístico del AE09</td></tr>',
        '<tr><td>Cuidado y tiempo</td><td>Viajes cotidianos de cuidado, no de trabajo</td><td>Barrios donde el equipamiento más cercano queda al otro lado de una arteria</td></tr>',
        '<tr><td>Movilidad vivida</td><td>Transbordos, esperas y cobertura real</td><td>Corredor del AE16 frente a los tiempos reales puerta a puerta</td></tr>',
        '</tbody></table></div>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Convenciones gráficas mínimas</h3>',
        '<ul>',
        '<li><strong>Flecha</strong> = dirección del flujo. Sin flecha no hay causalidad, solo vecindad.</li>',
        '<li><strong>Grosor</strong> = intensidad del flujo, con su unidad declarada en la leyenda.</li>',
        '<li><strong>Punto de cruce</strong> = conflicto: se rotula con el nombre del conflicto, no con el del lugar.</li>',
        '<li><strong>Un solo mensaje por plano.</strong> Cuatro conectografías legibles antes que una ilegible.</li>',
        '</ul>',
        '</div>'
      ].join(""),
      aside: [
        { title: "Entregable", html: "<ul><li><strong>4 conectografías</strong> sobre cartografía real</li><li><strong>1 leyenda</strong> con unidades</li><li><strong>1 lista</strong> de cruces rotulados</li></ul>" },
        { title: "Base cartográfica", html: "<ul><li>IDECA / Mapas Bogotá</li><li>Cartografía del Decreto 555</li><li>OpenStreetMap para malla fina</li></ul>" }
      ],
      todos: [
        "Montar las capas base de Kennedy",
        "Dibujar la conectografía de agua y riesgo",
        "Dibujar la de abasto y la de cuidado",
        "Dibujar la de movilidad vivida",
        "Rotular cada punto de cruce con su conflicto"
      ]
    },

    /* ============================================================ MÓDULO 06 */
    {
      id: "m6",
      num: "06",
      sesion: 2,
      title: "Autoorganización y sostenibilidad",
      kicker: "Sesión 2 · Qué sostiene el sistema y qué lo puede colapsar",
      summary: "¿Existen en Kennedy dinámicas donde la gente se autoorganiza sin poder central? Qué sostiene el sistema y qué vulnerabilidades lo llevan al colapso.",
      scales: {
        metro: "Umbrales de sistema: capacidad del río, del relleno y del abastecimiento regional.",
        local: "Dinámicas de autoorganización que operan en toda la localidad.",
        upl: "Dónde la autoorganización sustituye de hecho al servicio público.",
        manzana: "La unidad real de la autoorganización: la cuadra, el salón comunal, el puesto de mercado."
      },
      main: [
        '<div class="m5-block">',
        '<h3>Dinámicas autoorganizadas identificadas</h3>',
        '<ul>',
        '<li><strong>Sistema de abasto de Corabastos.</strong> Miles de transacciones diarias coordinadas por precio, horario y confianza, sin un planificador que asigne puestos ni rutas. Es el caso más claro de orden emergente en la localidad.</li>',
        '<li><strong>Cadena de reciclaje.</strong> Recuperadores organizados por ruta y por material sostienen buena parte del manejo de residuos sin que el ordenamiento los reconozca como infraestructura.</li>',
        '<li><strong>Mesas ambientales de humedal.</strong> Grupos vecinales que vigilan, siembran y denuncian en La Vaca, El Burro y Techo: producen control territorial sin competencia formal.</li>',
        '<li><strong>Transporte de última milla.</strong> Bicitaxis y rutas informales que cubren el trayecto que el sistema formal no cubre, ajustándose solos a la demanda.</li>',
        '<li><strong>Economía de cuidado barrial.</strong> Redes de vecinas que cubren cuidado infantil y de mayores; es trabajo no pagado que hace de equipamiento faltante.</li>',
        '<li><strong>Obra colectiva y mejoramiento progresivo.</strong> Vivienda y espacio público construidos por etapas por los propios hogares, con lógica de necesidad y no de norma.</li>',
        '</ul>',
        '<p>Respuesta al enunciado: <strong>sí</strong>, y no son marginales. Son los sistemas que absorben el ',
        'desajuste entre lo que el plan promete y lo que el territorio recibe.</p>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Qué sostiene el sistema</h3>',
        '<ul>',
        '<li><strong>Redundancia social.</strong> Cuando falla el servicio, hay una red vecinal que lo reemplaza temporalmente.</li>',
        '<li><strong>Diversidad económica de baja escala.</strong> Muchos ingresos pequeños amortiguan mejor un choque que un solo empleador grande.</li>',
        '<li><strong>Memoria del agua.</strong> Los habitantes antiguos saben dónde se inunda: es información que no está en el plano.</li>',
        '<li><strong>Centralidad del abasto.</strong> Kennedy es indispensable para la comida de Bogotá, y eso le da poder de negociación.</li>',
        '</ul>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Vulnerabilidades y umbrales de colapso</h3>',
        '<div class="m5-table-wrap">',
        '<table class="m5-table">',
        '<thead><tr><th>Tipo</th><th>Vulnerabilidad</th><th>Umbral / señal de alarma</th></tr></thead>',
        '<tbody>',
        '<tr><td>Ecológico</td><td>Humedales reducidos y aislados entre sí; borde ocupado</td><td>Pérdida de conectividad entre La Vaca, El Burro y Techo: la fragmentación vuelve irreversible la pérdida de función</td></tr>',
        '<tr><td>Infraestructural</td><td>Drenaje al límite en la llanura del Tintal</td><td>Nueva impermeabilización aprobada sin ampliación de capacidad hidráulica</td></tr>',
        '<tr><td>Social</td><td>Renovación del corredor que desplaza la economía que sostiene el barrio</td><td>Aumento de renta del suelo por encima de la capacidad de pago local en el AE15 y el AE16</td></tr>',
        '<tr><td>Sistémico</td><td>Dependencia de un único nodo de abasto</td><td>Una interrupción prolongada en Corabastos afecta a toda la ciudad: no hay redundancia</td></tr>',
        '<tr><td>Institucional</td><td>Decisiones a escala metropolitana con participación local posterior</td><td>Actuaciones estratégicas adoptadas sin acuerdo con los actores del borde</td></tr>',
        '</tbody></table></div>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Lectura de sostenibilidad</h3>',
        '<p>El sistema no colapsa por falta de plan sino por <strong>desacople de velocidades</strong>: la ocupación ',
        'y la edificabilidad avanzan en años, el soporte ambiental y de cuidado en décadas, y la organización ',
        'comunitaria en días. Mientras la comunidad absorbe la diferencia, el sistema parece sostenible; ',
        'cuando esa capacidad se agota, el colapso aparece de golpe y localizado.</p>',
        '</div>'
      ].join(""),
      aside: [
        { title: "Entregable", html: "<ul><li><strong>Lista</strong> de dinámicas autoorganizadas con evidencia</li><li><strong>Tabla</strong> de vulnerabilidades y umbrales</li><li><strong>1 párrafo</strong> de lectura de sostenibilidad</li></ul>" },
        { title: "Criterio", html: "<ul><li>Autoorganización = orden <strong>sin</strong> coordinador central</li><li>No confundir con informalidad ni con abandono estatal</li></ul>" }
      ],
      todos: [
        "Documentar cada dinámica autoorganizada con evidencia",
        "Identificar qué dinámicas sostienen el sistema",
        "Definir umbrales de colapso por tipo",
        "Escribir la lectura de sostenibilidad"
      ]
    },

    /* ============================================================ MÓDULO 07 */
    {
      id: "m7",
      num: "07",
      sesion: 2,
      title: "Exposición: Çatalhöyük",
      kicker: "Sesión 2 · 10 a 12 minutos",
      summary: "Un asentamiento sin planificación centralizada como espejo crítico: metabolismo, emergencia y coevolución para cuestionar los supuestos del POT.",
      scales: {
        metro: "Çatalhöyük en su llanura aluvial de Konya: el asentamiento como respuesta a un régimen de agua.",
        local: "El asentamiento completo: aglomeración continua, sin calles, circulación por las cubiertas.",
        upl: "Los agrupamientos de casas: barrios de hecho, definidos por parentesco y por práctica.",
        manzana: "La casa: unidad de producción, entierro, almacenamiento y decisión. La escala donde todo se resuelve."
      },
      main: [
        '<div class="m5-block">',
        '<h3>Por qué este caso</h3>',
        '<p>Çatalhöyük (Anatolia, aprox. 7400–6000 a.C.) fue un asentamiento de miles de habitantes ',
        '<strong>sin plaza, sin templo monumental, sin calles y sin evidencia de una autoridad central ',
        'que lo planificara</strong>. Sirve para probar la afirmación central del corte: el orden urbano puede ',
        'emerger de reglas locales repetidas, no de un plan.</p>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Las tres preguntas generales</h3>',
        '<ol>',
        '<li><strong>Metabolismo.</strong> ¿Cómo entraban y salían los flujos? Agricultura y pastoreo en la llanura aluvial, almacenamiento <em>dentro</em> de cada casa, obsidiana traída de larga distancia, residuos y entierros gestionados en el espacio doméstico. El metabolismo estaba distribuido: cada casa era una unidad metabólica casi completa, sin infraestructura común de abasto. La consecuencia es dura para el POT: la resiliencia venía de la <strong>redundancia</strong>, no de la eficiencia de un nodo central.</li>',
        '<li><strong>Emergencia.</strong> ¿Cómo aparece la forma urbana sin plan? Por repetición de una regla local: construir pegado a la casa vecina, reconstruir sobre la propia casa, circular por las cubiertas y entrar por el techo. Nadie diseñó el conjunto; el conjunto es el resultado agregado de decisiones domésticas. El patrón es estable durante siglos precisamente porque no depende de un centro que pueda fallar.</li>',
        '<li><strong>Coevolución.</strong> ¿Cómo cambian juntos el asentamiento y su entorno? La práctica agrícola y ganadera transformó el suelo y la vegetación de la llanura; ese cambio modificó a su vez qué se podía cultivar y dónde convenía asentarse, y con ello la propia forma de la casa y del montículo. Sociedad y ecosistema se produjeron mutuamente: no hay un entorno dado sobre el que se instala una ciudad.</li>',
        '</ol>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Pregunta específica del enfoque temático</h3>',
        '<p>Además de las tres generales, el grupo responde la pregunta asignada a su enfoque. La estructura ',
        'de respuesta es siempre la misma, y conviene mantenerla:</p>',
        '<ol>',
        '<li>Qué se observa en Çatalhöyük (evidencia arqueológica, no interpretación).</li>',
        '<li>Qué mecanismo explica esa observación (regla local, flujo, retroalimentación).</li>',
        '<li>Qué supuesto del POT queda cuestionado por ese mecanismo.</li>',
        '<li>Qué corrección entra en <em>nuestro</em> modelo a partir de ahí.</li>',
        '</ol>',
        '<div class="m5-flag"><b>Antes de exponer</b>Confirmar en la guía cuál es la pregunta específica ' +
        'asignada a nuestro enfoque temático, y responderla explícitamente: es criterio de evaluación aparte ' +
        'de las tres generales.</div>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Guion de 10 a 12 minutos</h3>',
        '<div class="m5-table-wrap">',
        '<table class="m5-table">',
        '<thead><tr><th>Tiempo</th><th>Bloque</th><th>Qué se dice</th></tr></thead>',
        '<tbody>',
        '<tr><td>0:00 – 1:30</td><td>Encuadre</td><td>Qué es Çatalhöyük y por qué incomoda a la planificación contemporánea</td></tr>',
        '<tr><td>1:30 – 4:00</td><td>Metabolismo</td><td>Flujos distribuidos, almacenamiento doméstico, redundancia como resiliencia</td></tr>',
        '<tr><td>4:00 – 6:30</td><td>Emergencia</td><td>La regla local que produce la forma del conjunto</td></tr>',
        '<tr><td>6:30 – 8:30</td><td>Coevolución</td><td>Cómo se transforman juntos asentamiento y llanura</td></tr>',
        '<tr><td>8:30 – 10:30</td><td>Pregunta del enfoque</td><td>Respuesta específica con los cuatro pasos</td></tr>',
        '<tr><td>10:30 – 12:00</td><td>Retroalimentación</td><td>Qué cambia en nuestro modelo y en nuestra lectura de Kennedy</td></tr>',
        '</tbody></table></div>',
        '</div>',

        '<div class="m5-block">',
        '<h3>Retroalimentación al modelo propio</h3>',
        '<ul>',
        '<li>La resiliencia se construye con <strong>redundancia distribuida</strong>: en Kennedy, un solo nodo de abasto es una fragilidad, no una eficiencia.</li>',
        '<li>Una <strong>regla local repetida</strong> puede ordenar más territorio que un plano general: hay que buscar cuáles son las reglas locales que hoy producen Kennedy.</li>',
        '<li>El entorno <strong>no es el soporte pasivo</strong> del plan: la llanura del Tintal responde a lo que se construye sobre ella.</li>',
        '<li>Un asentamiento puede sostenerse siglos sin centro, pero <strong>no sin límite ecológico</strong>: el abandono llega cuando el metabolismo excede la llanura.</li>',
        '</ul>',
        '</div>'
      ].join(""),
      aside: [
        { title: "Entregable", html: "<ul><li><strong>Exposición</strong> de 10–12 min</li><li><strong>3 respuestas</strong> generales</li><li><strong>1 respuesta</strong> del enfoque</li><li><strong>4 correcciones</strong> al modelo propio</li></ul>" },
        { title: "Control de tiempo", html: "<ul><li>Máximo 2 min por bloque</li><li>Una imagen por bloque</li><li>El cierre es lo que se evalúa: no dejarlo sin tiempo</li></ul>" }
      ],
      todos: [
        "Investigar metabolismo, emergencia y coevolución",
        "Confirmar y responder la pregunta del enfoque",
        "Armar el guion cronometrado",
        "Escribir las correcciones al modelo propio",
        "Ensayar una vez completo con reloj"
      ]
    }
  ];

  /* -------------------------------------------------------------- utilidades */
  var STORE_DONE = "rapot.m05.done";
  var STORE_TODO = "rapot.m05.todo";

  function loadSet(key) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveSet(key, obj) {
    try {
      window.localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {
      /* modo privado o almacenamiento bloqueado: la página sigue funcionando */
    }
  }

  var done = loadSet(STORE_DONE);
  var todoState = loadSet(STORE_TODO);
  var currentScale = "metro";
  var openId = null;

  var list = document.getElementById("m5-list");
  var detail = document.getElementById("m5-detail");
  var detailKicker = document.getElementById("detail-kicker");
  var detailTitle = document.getElementById("detail-title");
  var detailMain = document.getElementById("detail-main");
  var detailAside = document.getElementById("detail-aside");
  var detailClose = document.getElementById("detail-close");
  var prevBtn = document.getElementById("detail-prev");
  var nextBtn = document.getElementById("detail-next");
  var scaleNote = document.getElementById("scale-note");
  var progressFill = document.getElementById("progress-fill");
  var progressLabel = document.getElementById("progress-label");

  /* ---------------------------------------------------------------- filas */
  function buildRows() {
    var html = MODULES.map(function (m) {
      return [
        '<div class="m5-row" id="row-', m.id, '" data-id="', m.id, '" role="button" tabindex="0"',
        ' aria-expanded="false" aria-label="Abrir m\u00f3dulo ', m.num, ': ', m.title, '">',
        '<span class="m5-row-num">', m.num, '</span>',
        '<span class="m5-row-title"><h3>', m.title, '</h3><p>', m.summary, '</p></span>',
        '<span class="m5-row-scale" data-scale-slot="', m.id, '"><b></b><span></span></span>',
        '<span class="m5-row-side">',
        '<span class="m5-tag" data-sesion="', m.sesion, '">Sesi\u00f3n ', m.sesion, '</span>',
        '<label class="m5-check">',
        '<input type="checkbox" data-done="', m.id, '" aria-label="Marcar m\u00f3dulo ', m.num, ' como listo">',
        'Listo</label>',
        '</span>',
        '<span class="m5-row-arrow" aria-hidden="true">&rarr;</span>',
        '</div>'
      ].join("");
    }).join("");
    list.innerHTML = html;

    MODULES.forEach(function (m) {
      var row = document.getElementById("row-" + m.id);
      var box = row.querySelector('input[data-done]');
      box.checked = !!done[m.id];
      row.classList.toggle("is-done", !!done[m.id]);

      box.addEventListener("change", function () {
        done[m.id] = box.checked;
        saveSet(STORE_DONE, done);
        row.classList.toggle("is-done", box.checked);
        renderProgress();
      });
      // el clic sobre la casilla no debe abrir el m\u00f3dulo
      row.querySelector(".m5-check").addEventListener("click", function (ev) {
        ev.stopPropagation();
      });
      row.addEventListener("click", function () { openModule(m.id); });
      row.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          openModule(m.id);
        }
      });
    });
  }

  function renderScale() {
    scaleNote.textContent = SCALES[currentScale].note;
    document.querySelectorAll(".m5-scale").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.scale === currentScale));
    });
    MODULES.forEach(function (m) {
      var slot = document.querySelector('[data-scale-slot="' + m.id + '"]');
      if (!slot) return;
      slot.querySelector("b").textContent = SCALES[currentScale].label;
      slot.querySelector("span").textContent = m.scales[currentScale];
    });
  }

  function renderProgress() {
    var n = MODULES.filter(function (m) { return done[m.id]; }).length;
    progressFill.style.width = (n / MODULES.length * 100) + "%";
    progressLabel.textContent = n + " / " + MODULES.length + " listos";
  }

  /* -------------------------------------------------------------- detalle */
  function moduleIndex(id) {
    for (var i = 0; i < MODULES.length; i++) {
      if (MODULES[i].id === id) return i;
    }
    return -1;
  }

  function openModule(id, skipScroll) {
    var i = moduleIndex(id);
    if (i < 0) return;
    var m = MODULES[i];
    openId = id;

    detailKicker.textContent = "Módulo " + m.num + " · " + m.kicker;
    detailTitle.textContent = m.title;
    detailMain.innerHTML = m.main;

    var asideHtml = m.aside.map(function (c) {
      return '<div class="m5-aside-card"><h4>' + c.title + "</h4>" + c.html + "</div>";
    }).join("");
    asideHtml += '<div class="m5-aside-card m5-todo"><h4>Lista de chequeo</h4>' +
      m.todos.map(function (t, k) {
        var key = m.id + ":" + k;
        var checked = todoState[key] ? " checked" : "";
        return '<label><input type="checkbox" data-todo="' + key + '"' + checked + '><span>' + t + "</span></label>";
      }).join("") + "</div>";
    detailAside.innerHTML = asideHtml;

    detailAside.querySelectorAll("input[data-todo]").forEach(function (box) {
      box.addEventListener("change", function () {
        todoState[box.dataset.todo] = box.checked;
        saveSet(STORE_TODO, todoState);
      });
    });

    var prev = MODULES[i - 1];
    var next = MODULES[i + 1];
    prevBtn.disabled = !prev;
    nextBtn.disabled = !next;
    prevBtn.querySelector("span").textContent = prev ? prev.num + " · " + prev.title : "—";
    nextBtn.querySelector("span").textContent = next ? next.num + " · " + next.title : "—";

    detail.hidden = false;
    document.querySelectorAll(".m5-row").forEach(function (c) {
      var isOpen = c.dataset.id === id;
      c.classList.toggle("is-open", isOpen);
      c.setAttribute("aria-expanded", String(isOpen));
    });

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#" + id);
    }
    if (!skipScroll) {
      detail.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function closeModule() {
    detail.hidden = true;
    openId = null;
    document.querySelectorAll(".m5-row").forEach(function (c) {
      c.classList.remove("is-open");
      c.setAttribute("aria-expanded", "false");
    });
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#modulos");
    }
  }

  /* ---------------------------------------------------------------- eventos */
  buildRows();
  renderScale();
  renderProgress();

  document.querySelectorAll(".m5-scale").forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentScale = btn.dataset.scale;
      renderScale();
    });
  });

  detailClose.addEventListener("click", closeModule);
  prevBtn.addEventListener("click", function () {
    var i = moduleIndex(openId);
    if (i > 0) openModule(MODULES[i - 1].id);
  });
  nextBtn.addEventListener("click", function () {
    var i = moduleIndex(openId);
    if (i > -1 && i < MODULES.length - 1) openModule(MODULES[i + 1].id);
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && !detail.hidden) closeModule();
  });

  // enlace profundo: modulo-05.html#m3 abre el módulo 03 directamente
  var hash = (window.location.hash || "").replace("#", "");
  if (moduleIndex(hash) > -1) {
    openModule(hash, true);
  }
  window.addEventListener("hashchange", function () {
    var h = (window.location.hash || "").replace("#", "");
    if (moduleIndex(h) > -1 && h !== openId) openModule(h);
  });
})();
