// GUTO Sala de Controle — Extended mock data
// Loaded after panel-data.jsx — adds Empresas, pending items, system telemetry.

const MOCK_EMPRESAS = [
  { id:"emp001", name:"Studio Vértice",     responsible:"Carolina Souza", email:"caro@vertice.fit",      country:"BR", plan:"pro",     status:"active",  maxStudents:60,  maxCoaches:5,  usage:{students:42,coaches:3}, lastActivityAt:"2026-05-09T09:00:00Z", createdAt:"2025-09-12" },
  { id:"emp002", name:"Forge Athletic",     responsible:"Diego Marques",  email:"diego@forge.com.br",    country:"BR", plan:"start",   status:"active",  maxStudents:25,  maxCoaches:2,  usage:{students:18,coaches:2}, lastActivityAt:"2026-05-08T16:30:00Z", createdAt:"2025-11-04" },
  { id:"emp003", name:"Casa Hipertrofia",   responsible:"Marina Prado",   email:"marina@casahipertrofia.it", country:"IT", plan:"custom",  status:"active",  maxStudents:120, maxCoaches:10, usage:{students:88,coaches:7}, lastActivityAt:"2026-05-09T07:14:00Z", createdAt:"2025-06-22" },
  { id:"emp004", name:"Pulse Coletivo",     responsible:"Lia Bertoni",    email:"lia@pulse.coach",       country:"PT", plan:"start",   status:"trial",   maxStudents:15,  maxCoaches:1,  usage:{students:6,coaches:1},  lastActivityAt:"2026-05-09T10:55:00Z", createdAt:"2026-04-18" },
  { id:"emp005", name:"Núcleo Sul",         responsible:"Pedro Ávila",    email:"pedro@nucleosul.fit",   country:"BR", plan:"pro",     status:"paused",  maxStudents:40,  maxCoaches:3,  usage:{students:0,coaches:2},  lastActivityAt:"2026-04-11T18:20:00Z", createdAt:"2025-08-01" },
  { id:"emp006", name:"Ferro Negro",        responsible:"Iara Coelho",    email:"iara@ferronegro.it",    country:"IT", plan:"pro",     status:"overdue", maxStudents:50,  maxCoaches:4,  usage:{students:31,coaches:3}, lastActivityAt:"2026-05-02T22:10:00Z", createdAt:"2025-07-15" },
];

// Pending exercises (nothing approved/rejected — just the queue)
const MOCK_EX_PENDING = [
  { id:"ex001", name:"Remada cavalinho unilateral",  muscle:"Costas",  equipment:"Barra T",        location:"academia", durationSec:11, sizeMb:7.4,  filename:"remada-cavalinho-unilateral.mp4", submittedBy:"c001", submittedAt:"2026-05-09T08:12:00Z", status:"pendente" },
  { id:"ex002", name:"Agachamento búlgaro com halter", muscle:"Pernas", equipment:"Halter",       location:"academia", durationSec:14, sizeMb:9.1,  filename:"agachamento-bulgaro.mp4",          submittedBy:"c003", submittedAt:"2026-05-09T07:40:00Z", status:"pendente" },
  { id:"ex003", name:"Flexão diamante",                muscle:"Tríceps",equipment:"Peso corporal", location:"casa",     durationSec:9,  sizeMb:5.8,  filename:"flexao-diamante.mp4",              submittedBy:"c002", submittedAt:"2026-05-08T19:02:00Z", status:"pendente" },
  { id:"ex004", name:"Sprint em escada",               muscle:"Cardio", equipment:"Nenhum",        location:"ar-livre", durationSec:13, sizeMb:10.2, filename:"sprint-escada.mp4",                submittedBy:"c001", submittedAt:"2026-05-08T11:21:00Z", status:"pendente" },
  { id:"ex005", name:"Crucifixo invertido na polia",   muscle:"Ombros", equipment:"Polia baixa",   location:"academia", durationSec:12, sizeMb:8.0,  filename:"crucifixo-invertido-polia.mp4",    submittedBy:"c002", submittedAt:"2026-05-07T17:45:00Z", status:"pendente" },
];

// Pending foods
const MOCK_FOOD_PENDING = [
  { id:"fd001", pt:"Pão de queijo", it:"Pane al formaggio brasiliano", en:"Brazilian cheese bread", es:"Pan de queso", country:"BR", category:"Lanche",
    macros:{ kcal:280, p:6, c:32, f:14 }, allergens:["leite","ovo","glúten"], restrictions:["vegetariano"], submittedBy:"c001", status:"pendente" },
  { id:"fd002", pt:"Tapioca com queijo", it:"Tapioca con formaggio", en:"Tapioca with cheese", es:"Tapioca con queso", country:"BR", category:"Café da manhã",
    macros:{ kcal:240, p:9, c:30, f:9 }, allergens:["leite"], restrictions:["sem glúten"], submittedBy:"c003", status:"pendente" },
  { id:"fd003", pt:"Bresaola com rúcula", it:"Bresaola con rucola", en:"Bresaola with arugula", es:"Bresaola con rúcula", country:"IT", category:"Pré-treino",
    macros:{ kcal:180, p:28, c:3, f:6 }, allergens:[], restrictions:["sem lactose","sem glúten"], submittedBy:"c002", status:"pendente" },
  { id:"fd004", pt:"Açaí natural sem açúcar", it:"Açaí naturale senza zucchero", en:"Unsweetened açaí", es:"Açaí natural sin azúcar", country:"BR", category:"Pós-treino",
    macros:{ kcal:160, p:2, c:18, f:9 }, allergens:[], restrictions:["vegano","sem glúten"], submittedBy:"c001", status:"pendente" },
];

// System telemetry (the "control room" stamps in the header)
const SYS_TELEMETRY = {
  build: "v0.42.7",
  region: "sa-east-1",
  uptimePct: 99.97,
  pendingTotal: MOCK_EX_PENDING.length + MOCK_FOOD_PENDING.length,
};

function empresaStatusTone(s) {
  return ({ active:"ok", trial:"warn", paused:"mute", overdue:"bad", archived:"neutral" })[s] ?? "neutral";
}
function empresaStatusLabel(s) {
  return ({ active:"ATIVA", trial:"TESTE", paused:"PAUSADA", overdue:"VENCIDA", archived:"ARQUIVADA" })[s] ?? s;
}
function planLabel(p) {
  return ({ start:"START", pro:"PRO", custom:"CUSTOM" })[p] ?? (p||"").toUpperCase();
}
function locationLabel(l) {
  return ({ academia:"ACADEMIA", casa:"CASA", "ar-livre":"AR LIVRE" })[l] ?? l;
}
function studentsForEmpresa(empId) {
  // Map mock students to companies in a stable way (3-2-2-1-1-1 split-ish)
  const map = { u001:"emp001", u002:"emp001", u003:"emp003", u004:"emp001", u005:"emp005",
                u006:"emp003", u007:"emp006", u008:"emp003", u009:"emp002", u010:"emp002" };
  return MOCK_STUDENTS.filter(s => map[s.id] === empId);
}
function coachesForEmpresa(empId) {
  const map = { c001:"emp001", c002:"emp003", c003:"emp002" };
  return MOCK_COACHES.filter(c => map[c.userId] === empId);
}

Object.assign(window, {
  MOCK_EMPRESAS, MOCK_EX_PENDING, MOCK_FOOD_PENDING, SYS_TELEMETRY,
  empresaStatusTone, empresaStatusLabel, planLabel, locationLabel,
  studentsForEmpresa, coachesForEmpresa,
});
