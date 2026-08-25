/* RAPOT · Cliente público de Supabase para GitHub Pages.
 * Solo contiene la clave publishable/anon, diseñada por Supabase para usarse en el navegador.
 * La protección real de escritura está en RLS: este sitio únicamente consulta datos.
 */
(function initRapotSupabase(){
  const SUPABASE_URL = "https://hduqkztwwvbgmttlmsle.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_V5PJfk7ZDr2frE8o-Ry8yQ_qSbFnjYR";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const cache = new Map();

  function queryString(params){
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") search.set(key, value);
    });
    const query = search.toString();
    return query ? `?${query}` : "";
  }

  async function restFetch(table, params = {}, options = {}){
    const url = `${REST_URL}/${table}${queryString(params)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        Accept: "application/json"
      },
      signal: options.signal
    });
    if (!response.ok){
      const detail = await response.text().catch(() => "");
      throw new Error(`Supabase ${response.status}: ${detail || response.statusText}`);
    }
    return response.json();
  }

  function cached(key, loader){
    if (!cache.has(key)) cache.set(key, Promise.resolve().then(loader));
    return cache.get(key);
  }

  const api = {
    url: SUPABASE_URL,
    async getStructures(){
      return cached("structures", () => restFetch("rapot_structures", {
        select: "id,name,color,description",
        order: "id.asc",
        limit: "100"
      }));
    },
    async getConceptGroups(){
      return cached("groups", () => restFetch("rapot_concept_groups", {
        select: "id,structure_id,name,mentions",
        order: "structure_id.asc,name.asc",
        limit: "100"
      }));
    },
    async getConcepts(){
      return cached("concepts", () => restFetch("rapot_concepts", {
        select: "id,group_id,name,detail",
        order: "name.asc",
        limit: "1000"
      }));
    },
    async getRelationships(){
      return cached("relationships", () => restFetch("rapot_relationships", {
        select: "id,source_structure_id,target_structure_id,relation_type,description",
        order: "source_structure_id.asc,target_structure_id.asc",
        limit: "100"
      }));
    },
    async getRelationshipReferences(){
      return cached("relationship-references", () => restFetch("rapot_relationship_references", {
        select: "relationship_id,reference_text",
        order: "relationship_id.asc",
        limit: "1000"
      }));
    },
    async getPotItems(){
      return cached("pot-items", () => restFetch("pot_decreto_555_items", {
        select: "source_sheet,source_header,subcategory,name,source_row",
        order: "source_sheet.asc,source_row.asc",
        limit: "1000"
      }));
    },
    async getPotSummary(){
      return cached("pot-summary", () => restFetch("pot_decreto_555_summary", {
        select: "source_sheet,element,quantity,source_row",
        order: "source_row.asc",
        limit: "100"
      }));
    },
    async getStructureDetail(structureId){
      const [structures, groups, concepts] = await Promise.all([
        api.getStructures(), api.getConceptGroups(), api.getConcepts()
      ]);
      const structure = structures.find(item => item.id === structureId);
      const structureGroups = groups.filter(group => group.structure_id === structureId);
      const groupIds = new Set(structureGroups.map(group => group.id));
      const conceptsByGroup = new Map();
      concepts.filter(concept => groupIds.has(concept.group_id)).forEach(concept => {
        if (!conceptsByGroup.has(concept.group_id)) conceptsByGroup.set(concept.group_id, []);
        conceptsByGroup.get(concept.group_id).push(concept);
      });
      return {
        structure,
        groups: structureGroups.map(group => ({
          ...group,
          concepts: conceptsByGroup.get(group.id) || []
        })),
        conceptCount: structureGroups.reduce((total, group) => total + (conceptsByGroup.get(group.id) || []).length, 0)
      };
    },
    async getDashboard(){
      const [structures, groups, concepts, relationships, references, potItems, potSummary] = await Promise.all([
        api.getStructures(), api.getConceptGroups(), api.getConcepts(), api.getRelationships(),
        api.getRelationshipReferences(), api.getPotItems(), api.getPotSummary()
      ]);
      return { structures, groups, concepts, relationships, references, potItems, potSummary };
    }
  };

  function setStatus(kind, text){
    const status = document.getElementById("supabase-status");
    if (!status) return;
    status.dataset.state = kind;
    status.querySelector(".supabase-status-dot")?.classList.toggle("is-error", kind === "error");
    const label = status.querySelector(".supabase-status-label");
    if (label) label.textContent = text;
  }

  api.ready = api.getDashboard()
    .then(data => {
      const sheetCount = new Set(data.potItems.map(item => item.source_sheet)).size;
      setStatus("connected", `Supabase conectado · ${data.structures.length} estructuras · ${data.concepts.length} conceptos · ${data.potItems.length} elementos POT · ${sheetCount} hojas`);
      window.dispatchEvent(new CustomEvent("rapot:supabase-ready", { detail: data }));
      return data;
    })
    .catch(error => {
      console.error("RAPOT: no fue posible cargar Supabase", error);
      setStatus("error", "Supabase no disponible · mostrando datos locales");
      window.dispatchEvent(new CustomEvent("rapot:supabase-error", { detail: error }));
      throw error;
    });

  window.rapotData = api;
})();
