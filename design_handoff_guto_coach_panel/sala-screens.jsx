// GUTO Sala de Controle — Screens
// Hoje · Empresas · Alunos · Coaches · Treinos · Dietas · Aprovações · Arena · Logs

const { useState: useSc, useMemo: useMSc, useContext: useCtxSc } = React;

/* ── Risk pill helpers ───────────────────────────────────────────────────── */
function RiskPill({ student }) {
  const r = calcRisk(student);
  const map = {
    ok:        { tone:"ok",      label:"EM DIA"    },
    atencao:   { tone:"warn",    label:"ATENÇÃO"   },
    critico:   { tone:"bad",     label:"CRÍTICO"   },
    "sem-sinal":{ tone:"mute",   label:"SEM SINAL" },
    pausado:   { tone:"neutral", label:"PAUSADO"   },
  };
  const { tone, label } = map[r] ?? map.pausado;
  return <Pill tone={tone}>{label}</Pill>;
}
function SubPill({ status }) {
  const map = { active:"ok", paused:"mute", overdue:"bad", cancelled:"neutral", trial:"warn" };
  return <Pill tone={map[status]??'neutral'}>{subLabel(status)}</Pill>;
}

/* ── StatCard ────────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, tone="cyan", onClick }) {
  const colors = { cyan:T.cyan, ok:T.ok, warn:T.warn, bad:T.bad };
  const softs  = { cyan:T.cyanSoft, ok:T.okS, warn:T.warnS, bad:T.badS };
  const c = colors[tone], s = softs[tone];
  return (
    <button onClick={onClick} style={{
      background: s, border:`1px solid ${c}28`,
      borderRadius:16, padding:"18px 18px 16px",
      textAlign:"left", cursor: onClick ? "pointer" : "default",
      flex:1, minWidth:160,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, color:`${c}99`, marginBottom:10 }}>
        {icon}
        <span style={{ fontFamily:T.mono, fontSize:9, fontWeight:900, letterSpacing:"0.24em", textTransform:"uppercase" }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily:T.mono, fontSize:32, fontWeight:900, color:c, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontFamily:T.mono, fontSize:10, color:`${c}70`, marginTop:6 }}>{sub}</div>}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOJE
══════════════════════════════════════════════════════════════════════════ */
function HojeScreen() {
  const ctx = useCtxSc(window.PanelCtx);
  const today = new Date().toISOString().split("T")[0];
  const stats = useMSc(() => {
    const ativos = MOCK_STUDENTS.filter(s=>s.active && !s.archived);
    return {
      ativos,
      validatedToday: ativos.filter(s=>s.lastValidationAt?.startsWith(today)),
      criticos: ativos.filter(s=>calcRisk(s)==="critico"),
      atencao:  ativos.filter(s=>calcRisk(s)==="atencao"),
      semSinal: ativos.filter(s=>calcRisk(s)==="sem-sinal"),
    };
  }, [today]);
  const priority = useMSc(() => [...stats.criticos, ...stats.atencao, ...stats.semSinal].slice(0, 8), [stats]);
  const empresasAtivas = MOCK_EMPRESAS.filter(e=>e.status==="active" || e.status==="trial");

  return (
    <div style={{ padding:"24px 28px", display:"flex", flexDirection:"column", gap:24 }}>
      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
        <StatCard icon={<IBuilding size={14}/>} label="Empresas" value={empresasAtivas.length} sub={`${MOCK_EMPRESAS.length} cadastradas`} tone="cyan" onClick={()=>ctx.setActiveScreen("empresas")}/>
        <StatCard icon={<IUsers size={14}/>}    label="Ativos"   value={stats.ativos.length} sub="alunos com acesso" tone="cyan" onClick={()=>ctx.setActiveScreen("alunos")}/>
        <StatCard icon={<ICheck size={14}/>}    label="Treinos hoje" value={stats.validatedToday.length} sub="validações no dia" tone="ok"/>
        <StatCard icon={<IZap size={14}/>}      label="Críticos" value={stats.criticos.length} sub="7+ dias parado" tone="bad" onClick={()=>ctx.setActiveScreen("alunos")}/>
        <StatCard icon={<IGavel size={14}/>}    label="Pendentes" value={SYS_TELEMETRY.pendingTotal} sub="exercícios + alimentos" tone="warn" onClick={()=>ctx.setActiveScreen("aprovacoes")}/>
      </div>

      {/* Two columns: priority + empresas */}
      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:18 }}>
        <div>
          <SectionTitle action={priority.length > 6 &&
            <Btn ghost sm onClick={()=>ctx.setActiveScreen("alunos")}>Ver todos</Btn>}>
            ALUNOS QUE PRECISAM DE ATENÇÃO
          </SectionTitle>
          {priority.length === 0 ? (
            <Plate style={{ padding:"48px 24px", textAlign:"center" }}>
              <ICheck size={28} style={{ color:T.ok, margin:"0 auto 12px" }}/>
              <div style={{ fontFamily:T.mono, fontSize:12, color:T.fg2 }}>Todos em dia.</div>
            </Plate>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {priority.map(s=>(
                <button key={s.id} onClick={()=>ctx.openStudent(s)}
                  style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    gap:12, padding:"12px 16px",
                    background:T.panel, border:`1px solid ${T.border}`,
                    borderRadius:10, cursor:"pointer", textAlign:"left",
                  }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:T.mono, fontSize:12, fontWeight:700, color:T.fg, marginBottom:3 }}>{s.name}</div>
                    <div style={{ fontFamily:T.mono, fontSize:9, color:T.fg3 }}>
                      {s.lastValidationAt ? `último treino ${relativeTime(s.lastValidationAt)}` : "sem sinal"}
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                    <span style={{ fontFamily:T.mono, fontSize:10, color:T.fg3 }}>{s.weeklyXp} XP</span>
                    <RiskPill student={s}/>
                    <IChevR size={14} style={{ color:T.fg4 }}/>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <SectionTitle action={<Btn ghost sm onClick={()=>ctx.setActiveScreen("empresas")}>Ver todas</Btn>}>
            EMPRESAS ATIVAS
          </SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {empresasAtivas.slice(0,5).map(e=>(
              <button key={e.id} onClick={()=>ctx.openEmpresa(e)}
                style={{
                  display:"grid", gridTemplateColumns:"1fr auto auto",
                  alignItems:"center", gap:12, padding:"12px 16px",
                  background:T.panel, border:`1px solid ${T.border}`,
                  borderRadius:10, cursor:"pointer", textAlign:"left",
                }}>
                <div>
                  <div style={{ fontFamily:T.mono, fontSize:12, fontWeight:700, color:T.fg, marginBottom:2 }}>{e.name}</div>
                  <div style={{ fontFamily:T.mono, fontSize:9, color:T.fg3 }}>
                    {e.usage.students}/{e.maxStudents} alunos · {e.usage.coaches}/{e.maxCoaches} coaches
                  </div>
                </div>
                <Pill tone={empresaStatusTone(e.status)}>{empresaStatusLabel(e.status)}</Pill>
                <IChevR size={14} style={{ color:T.fg4 }}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EMPRESAS
══════════════════════════════════════════════════════════════════════════ */
function EmpresasScreen() {
  const ctx = useCtxSc(window.PanelCtx);
  const [search, setSearch] = useSc("");
  const [filter, setFilter] = useSc("todas");

  const list = useMSc(()=>{
    let l = [...MOCK_EMPRESAS];
    if (filter !== "todas") l = l.filter(e=>e.status === filter);
    if (search) {
      const q = search.toLowerCase();
      l = l.filter(e=>e.name.toLowerCase().includes(q)||e.responsible.toLowerCase().includes(q));
    }
    return l;
  }, [search, filter]);

  const FILTERS = [
    { id:"todas",   label:"Todas" },
    { id:"active",  label:"Ativas" },
    { id:"trial",   label:"Teste" },
    { id:"paused",  label:"Pausadas" },
    { id:"overdue", label:"Vencidas" },
  ];

  return (
    <div style={{ padding:"24px 28px" }}>
      <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap", marginBottom:18 }}>
        <SearchBox value={search} onChange={setSearch} placeholder="Buscar empresa…"/>
        <div style={{ display:"flex", gap:6 }}>
          {FILTERS.map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{
              height:34, padding:"0 14px", borderRadius:999,
              border: filter===f.id ? `1px solid ${T.cyan}` : `1px solid ${T.border}`,
              background: filter===f.id ? T.cyan : "transparent",
              color: filter===f.id ? "#04131e" : T.fg3,
              fontFamily:T.mono, fontSize:9, fontWeight:900, letterSpacing:"0.18em",
              textTransform:"uppercase", cursor:"pointer",
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Header row */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"minmax(180px,2fr) 110px 80px 90px 90px 110px auto",
        gap:14, padding:"0 18px 8px",
        fontFamily:T.mono, fontSize:8, color:T.fg4,
        letterSpacing:"0.24em", textTransform:"uppercase",
      }}>
        <span>EMPRESA / RESPONSÁVEL</span>
        <span>STATUS</span>
        <span>PLANO</span>
        <span>ALUNOS</span>
        <span>COACHES</span>
        <span>ÚLT. ATIV.</span>
        <span></span>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {list.map(e=>(
          <button key={e.id} onClick={()=>ctx.openEmpresa(e)}
            style={{
              display:"grid",
              gridTemplateColumns:"minmax(180px,2fr) 110px 80px 90px 90px 110px auto",
              alignItems:"center", gap:14, padding:"14px 18px",
              background:T.panel, border:`1px solid ${T.border}`,
              borderRadius:12, cursor:"pointer", textAlign:"left",
            }}>
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:T.mono, fontSize:13, fontWeight:700, color:T.fg, marginBottom:3,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {e.name}
              </div>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.fg3,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {e.responsible} · {e.country}
              </div>
            </div>
            <Pill tone={empresaStatusTone(e.status)}>{empresaStatusLabel(e.status)}</Pill>
            <span style={{ fontFamily:T.mono, fontSize:10, color:T.fg2, fontWeight:900, letterSpacing:"0.16em" }}>
              {planLabel(e.plan)}
            </span>
            <UsageBar value={e.usage.students} max={e.maxStudents}/>
            <UsageBar value={e.usage.coaches}  max={e.maxCoaches}/>
            <span style={{ fontFamily:T.mono, fontSize:10, color:T.fg3 }}>{relativeTime(e.lastActivityAt)}</span>
            <span style={{
              padding:"6px 10px", borderRadius:8,
              border:`1px solid ${T.cyanLine}`, background:T.cyanSoft,
              fontFamily:T.mono, fontSize:9, fontWeight:900, letterSpacing:"0.18em",
              color:T.cyan, textTransform:"uppercase",
            }}>Abrir ›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function UsageBar({ value, max }) {
  const pct = Math.min(100, max ? (value/max)*100 : 0);
  const tone = pct >= 95 ? T.bad : pct >= 80 ? T.warn : T.cyan;
  return (
    <div>
      <div style={{ fontFamily:T.mono, fontSize:11, fontWeight:700, color:T.fg, marginBottom:4 }}>
        {value}<span style={{ color:T.fg4 }}>/{max}</span>
      </div>
      <div style={{ height:3, background:"rgba(0,0,0,0.4)", borderRadius:99, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:tone, boxShadow:`0 0 6px ${tone}` }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ALUNOS
══════════════════════════════════════════════════════════════════════════ */
function AlunosScreen() {
  const ctx = useCtxSc(window.PanelCtx);
  const [search, setSearch] = useSc("");
  const [filter, setFilter] = useSc("ativos");
  const [coachF, setCoachF] = useSc("");
  const [empF, setEmpF]     = useSc("");

  const list = useMSc(()=>{
    let s = [...MOCK_STUDENTS];
    if (filter==="ativos")    s = s.filter(x=>x.active && !x.archived);
    if (filter==="pausados")  s = s.filter(x=>!x.active && !x.archived);
    if (filter==="arquivados")s = s.filter(x=>x.archived);
    if (coachF) s = s.filter(x=>x.coachId===coachF);
    if (empF) {
      const ids = new Set(studentsForEmpresa(empF).map(x=>x.id));
      s = s.filter(x=>ids.has(x.id));
    }
    if (search) {
      const q = search.toLowerCase();
      s = s.filter(x=>x.name.toLowerCase().includes(q)||x.email.toLowerCase().includes(q));
    }
    return s;
  }, [search, filter, coachF, empF]);

  return (
    <div style={{ padding:"24px 28px" }}>
      <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:16 }}>
        <SearchBox value={search} onChange={setSearch}/>
        <div style={{ display:"flex", gap:6 }}>
          {["ativos","pausados","arquivados","todos"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              height:34, padding:"0 14px", borderRadius:999,
              border: filter===f ? `1px solid ${T.cyan}` : `1px solid ${T.border}`,
              background: filter===f ? T.cyan : "transparent",
              color: filter===f ? "#04131e" : T.fg3,
              fontFamily:T.mono, fontSize:9, fontWeight:900, letterSpacing:"0.18em",
              textTransform:"uppercase", cursor:"pointer",
            }}>{f}</button>
          ))}
        </div>
        <SelectInput value={empF} onChange={setEmpF}>
          <option value="">Todas as empresas</option>
          {MOCK_EMPRESAS.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
        </SelectInput>
        <SelectInput value={coachF} onChange={setCoachF}>
          <option value="">Todos os coaches</option>
          {MOCK_COACHES.map(c=><option key={c.userId} value={c.userId}>{c.name}</option>)}
        </SelectInput>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {list.map(s=>(
          <button key={s.id} onClick={()=>ctx.openStudent(s)}
            style={{
              display:"grid",
              gridTemplateColumns:"minmax(180px,2fr) 100px 110px 90px 80px 80px 80px auto",
              alignItems:"center", gap:14, padding:"14px 18px",
              background:T.panel, border:`1px solid ${T.border}`,
              borderRadius:12, cursor:"pointer", textAlign:"left",
            }}>
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:T.mono, fontSize:13, fontWeight:700, color:T.fg,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginBottom:2 }}>{s.name}</div>
              <div style={{ fontFamily:T.mono, fontSize:10, color:T.fg3,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.email}</div>
            </div>
            <RiskPill student={s}/>
            <div style={{ fontFamily:T.mono, fontSize:10, color:T.fg2, whiteSpace:"nowrap" }}>{coachName(s.coachId)}</div>
            <div style={{ fontFamily:T.mono, fontSize:11, color:T.cyan, fontWeight:700 }}>{s.weeklyXp} XP</div>
            <div style={{ fontFamily:T.mono, fontSize:10, color:T.fg3 }}>{relativeTime(s.lastValidationAt)}</div>
            <SubPill status={s.subscriptionStatus}/>
            <div style={{ fontFamily:T.mono, fontSize:11, color:T.fg3 }}>{avatarLabel(s.avatarStage)}</div>
            <IChevR size={14} style={{ color:T.fg4 }}/>
          </button>
        ))}
        {!list.length && (
          <Plate style={{ padding:"48px 24px", textAlign:"center" }}>
            <div style={{ fontFamily:T.mono, fontSize:12, color:T.fg3 }}>Nenhum aluno encontrado.</div>
          </Plate>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COACHES
══════════════════════════════════════════════════════════════════════════ */
function CoachesScreen() {
  const ctx = useCtxSc(window.PanelCtx);
  return (
    <div style={{ padding:"24px 28px", display:"flex", flexDirection:"column", gap:10 }}>
      {/* Permissions matrix banner */}
      <Plate dp style={{ padding:"16px 20px", marginBottom:6 }}>
        <Kicker cyan style={{ display:"block", marginBottom:10 }}>PERMISSÕES DO COACH (OPERADOR LIMITADO)</Kicker>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8,
          fontFamily:T.mono, fontSize:10, color:T.fg2 }}>
          <PermLine ok>Ver alunos atribuídos</PermLine>
          <PermLine ok>Sugerir exercício / alimento</PermLine>
          <PermLine ok>Ajustar treino / dieta (se permitido)</PermLine>
          <PermLine no>Aprovar exercício / alimento</PermLine>
          <PermLine no>Criar empresa</PermLine>
          <PermLine no>Controlar outros coaches</PermLine>
        </div>
      </Plate>

      {MOCK_COACHES.map(coach=>{
        const empName = MOCK_EMPRESAS.find(e=>coachesForEmpresa(e.id).some(c=>c.userId===coach.userId))?.name ?? "—";
        const stCount = MOCK_STUDENTS.filter(s=>s.coachId===coach.userId).length;
        return (
          <Plate key={coach.userId} style={{ padding:"16px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, flex:1, minWidth:0 }}>
                <div style={{
                  width:40, height:40, borderRadius:10,
                  background:T.cyanSoft, border:`1px solid ${T.cyanLine}`,
                  display:"grid", placeItems:"center", color:T.cyan,
                  flexShrink:0,
                }}><IShield size={16}/></div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:T.mono, fontSize:13, fontWeight:900, color:T.fg, marginBottom:3 }}>
                    {coach.name}
                  </div>
                  <div style={{ fontFamily:T.mono, fontSize:10, color:T.fg3 }}>
                    {coach.email} · {empName}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:T.mono, fontSize:9, color:T.fg4, letterSpacing:"0.20em" }}>ALUNOS</div>
                  <div style={{ fontFamily:T.mono, fontSize:14, fontWeight:900, color:T.cyan }}>{stCount}</div>
                </div>
                <Pill tone={coach.active ? "ok" : "mute"}>{coach.active ? "ATIVO" : "PAUSADO"}</Pill>
                <Btn ghost sm onClick={()=>{}}>{coach.active ? "Pausar" : "Ativar"}</Btn>
                <Btn danger sm onClick={()=>{}}><ITrash size={12}/></Btn>
              </div>
            </div>
          </Plate>
        );
      })}
    </div>
  );
}

function PermLine({ children, ok, no }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <span style={{
        width:14, height:14, borderRadius:4, display:"grid", placeItems:"center",
        background: ok ? T.okS : T.badS,
        color: ok ? T.ok : T.bad,
        border:`1px solid ${ok ? "rgba(74,222,128,0.30)" : "rgba(248,113,113,0.30)"}`,
      }}>{ok ? <ICheck size={9}/> : <IX size={9}/>}</span>
      <span style={{ color: no ? T.fg3 : T.fg2, textDecoration: no ? "line-through" : "none" }}>{children}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TREINOS / DIETAS — fila editorial
══════════════════════════════════════════════════════════════════════════ */
function QueueScreen({ mode }) {
  const ctx = useCtxSc(window.PanelCtx);
  const [qf, setQf] = useSc("todos");
  const ativos = useMSc(()=>MOCK_STUDENTS.filter(s=>s.active && !s.archived), []);
  const sorted = useMSc(()=>{
    const order = { critico:0, atencao:1, "sem-sinal":2, ok:3, pausado:4 };
    const list = qf==="todos" ? ativos : ativos.filter(s=>calcRisk(s)===qf);
    return [...list].sort((a,b)=>(order[calcRisk(a)]??9)-(order[calcRisk(b)]??9));
  }, [ativos, qf]);
  const counts = useMSc(()=>({
    critico:   ativos.filter(s=>calcRisk(s)==="critico").length,
    atencao:   ativos.filter(s=>calcRisk(s)==="atencao").length,
    "sem-sinal":ativos.filter(s=>calcRisk(s)==="sem-sinal").length,
  }), [ativos]);
  const FILTERS = [
    { id:"todos", label:"Todos" },
    { id:"critico",   label:"Críticos",  count:counts.critico },
    { id:"atencao",   label:"Atenção",   count:counts.atencao },
    { id:"sem-sinal", label:"Sem sinal", count:counts["sem-sinal"] },
  ];
  const tab = mode === "treino" ? "treino" : "dieta";
  const actionLabel = mode === "treino" ? "Editar treino" : "Editar dieta";

  return (
    <div style={{ padding:"24px 28px" }}>
      <p style={{ fontFamily:T.mono, fontSize:11, color:T.fg3, marginBottom:14 }}>
        Alunos ordenados por urgência. Super admin pode editar direto. GUTO pode gerar/atualizar.
      </p>
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        {FILTERS.map(({ id, label, count })=>(
          <button key={id} onClick={()=>setQf(id)} style={{
            height:32, padding:"0 14px", borderRadius:999, cursor:"pointer",
            border: qf===id ? `1px solid ${T.cyan}` : `1px solid ${T.border}`,
            background: qf===id ? T.cyan : "transparent",
            color: qf===id ? "#04131e" : T.fg3,
            fontFamily:T.mono, fontSize:9, fontWeight:900, letterSpacing:"0.18em", textTransform:"uppercase",
            display:"flex", alignItems:"center", gap:6,
          }}>
            {label}
            {count>0 && <span style={{
              background: qf===id ? "rgba(4,19,30,0.3)" : T.cyanSoft,
              color: qf===id ? "#04131e" : T.cyan,
              borderRadius:999, padding:"1px 6px", fontSize:8,
            }}>{count}</span>}
          </button>
        ))}
        <div style={{ flex:1 }}/>
        <Btn ghost sm onClick={()=>{}}><IBolt size={12}/>Gerar com GUTO</Btn>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {sorted.map(s=>(
          <button key={s.id} onClick={()=>ctx.openStudent(s, tab)}
            style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              gap:16, padding:"14px 18px",
              background:T.panel, border:`1px solid ${T.border}`,
              borderRadius:12, cursor:"pointer", textAlign:"left",
            }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <span style={{ fontFamily:T.mono, fontSize:13, fontWeight:700, color:T.fg }}>{s.name}</span>
                <RiskPill student={s}/>
              </div>
              <span style={{ fontFamily:T.mono, fontSize:10, color:T.fg3 }}>
                {s.lastValidationAt ? `última validação ${relativeTime(s.lastValidationAt)}` : "sem sinal"}
                {" · "}{coachName(s.coachId)}
              </span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
              <span style={{ fontFamily:T.mono, fontSize:10, color:T.fg3 }}>
                {mode==="treino" ? s.weeklyXp : s.monthlyXp} XP
              </span>
              <span style={{
                padding:"6px 12px", borderRadius:8,
                border:`1px solid ${T.cyanLine}`, background:T.cyanSoft,
                fontFamily:T.mono, fontSize:9, fontWeight:900, letterSpacing:"0.18em",
                color:T.cyan, textTransform:"uppercase",
              }}>{actionLabel} ›</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   APROVAÇÕES — exercícios + alimentos
══════════════════════════════════════════════════════════════════════════ */
function AprovacoesScreen() {
  const [tab, setTab] = useSc("ex");
  const [items, setItems] = useSc({ ex: MOCK_EX_PENDING, fd: MOCK_FOOD_PENDING });
  const [toast, setToast] = useSc(null);

  function decide(kind, id, decision) {
    setItems(prev => ({
      ...prev,
      [kind]: prev[kind].map(it => it.id === id ? { ...it, status: decision } : it),
    }));
    setToast({ kind, decision });
    setTimeout(()=>setToast(null), 2400);
  }

  const exPending = items.ex.filter(i=>i.status==="pendente").length;
  const fdPending = items.fd.filter(i=>i.status==="pendente").length;

  return (
    <div style={{ padding:"24px 28px" }}>
      <Plate dp style={{ padding:"14px 18px", marginBottom:18,
        background:"linear-gradient(90deg, rgba(82,231,255,0.08) 0%, rgba(82,231,255,0.02) 60%)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ color:T.cyan }}><IGavel size={18}/></span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:T.mono, fontSize:11, fontWeight:900, color:T.fg, marginBottom:3 }}>
              Apenas o super admin aprova. Coaches só sugerem.
            </div>
            <div style={{ fontFamily:T.mono, fontSize:10, color:T.fg3 }}>
              Itens aprovados entram no catálogo do GUTO e podem ser usados em treinos / dietas futuros.
            </div>
          </div>
        </div>
      </Plate>

      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        {[
          { id:"ex", label:"Exercícios pendentes", count:exPending },
          { id:"fd", label:"Alimentos pendentes",  count:fdPending },
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            height:38, padding:"0 16px", borderRadius:10, cursor:"pointer",
            background: tab===t.id ? T.cyanSoft : "transparent",
            border:`1px solid ${tab===t.id ? T.cyanLine : T.border}`,
            color: tab===t.id ? T.cyan : T.fg2,
            fontFamily:T.mono, fontSize:10, fontWeight:900, letterSpacing:"0.18em", textTransform:"uppercase",
            display:"flex", alignItems:"center", gap:8,
          }}>
            {t.label}
            <span style={{
              background: tab===t.id ? T.cyan : "rgba(232,244,255,0.10)",
              color: tab===t.id ? "#04131e" : T.fg2,
              borderRadius:999, padding:"1px 7px", fontSize:9, fontWeight:900,
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "ex" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {items.ex.map(it=><ExerciseCard key={it.id} item={it} onDecide={(d)=>decide("ex", it.id, d)}/>)}
        </div>
      )}
      {tab === "fd" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {items.fd.map(it=><FoodCard key={it.id} item={it} onDecide={(d)=>decide("fd", it.id, d)}/>)}
        </div>
      )}

      {toast && (
        <div style={{
          position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
          padding:"12px 18px", borderRadius:999,
          background: toast.decision==="aprovado" ? T.okS : T.badS,
          border:`1px solid ${toast.decision==="aprovado" ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.4)"}`,
          color: toast.decision==="aprovado" ? T.ok : T.bad,
          fontFamily:T.mono, fontSize:10, fontWeight:900, letterSpacing:"0.18em", textTransform:"uppercase",
          display:"flex", alignItems:"center", gap:10, zIndex:80,
          backdropFilter:"blur(10px)",
        }}>
          {toast.decision==="aprovado" ? <ICheck size={14}/> : <IX size={14}/>}
          {toast.decision==="aprovado"
            ? `${toast.kind==="ex"?"Exercício":"Alimento"} entrou no catálogo do GUTO`
            : `${toast.kind==="ex"?"Exercício":"Alimento"} rejeitado`}
        </div>
      )}
    </div>
  );
}

function StatusStamp({ status }) {
  if (status === "aprovado") return (
    <div style={{ display:"flex", alignItems:"center", gap:6,
      color:T.ok, fontFamily:T.mono, fontSize:9, fontWeight:900,
      letterSpacing:"0.20em", textTransform:"uppercase",
    }}>
      <ICheck size={11}/>NO CATÁLOGO GUTO
    </div>
  );
  if (status === "rejeitado") return <Pill tone="bad">REJEITADO</Pill>;
  return <Pill tone="warn">PENDENTE</Pill>;
}

function ExerciseCard({ item, onDecide }) {
  const decided = item.status !== "pendente";
  return (
    <Plate style={{
      padding:"18px 20px", opacity: decided ? 0.7 : 1,
      borderColor: item.status==="aprovado" ? "rgba(74,222,128,0.25)"
                : item.status==="rejeitado" ? "rgba(248,113,113,0.25)" : T.border,
    }}>
      <div style={{ display:"grid", gridTemplateColumns:"180px 1fr auto", gap:18, alignItems:"flex-start" }}>
        {/* Video preview */}
        <div style={{
          width:180, height:120, borderRadius:10, position:"relative",
          background: "linear-gradient(135deg, rgba(82,231,255,0.10) 0%, rgba(82,231,255,0.02) 100%)",
          border:`1px solid ${T.border}`,
          overflow:"hidden",
          backgroundImage: "repeating-linear-gradient(45deg, rgba(82,231,255,0.04) 0 8px, transparent 8px 16px)",
        }}>
          <div style={{
            position:"absolute", inset:0, display:"grid", placeItems:"center",
            color:T.cyan,
          }}>
            <div style={{
              width:46, height:46, borderRadius:999,
              background:T.cyanSoft, border:`1px solid ${T.cyanLine}`,
              display:"grid", placeItems:"center",
              boxShadow:"0 0 18px rgba(82,231,255,0.4)",
            }}><IPlay size={16}/></div>
          </div>
          <div style={{
            position:"absolute", bottom:6, right:6,
            padding:"2px 6px", borderRadius:4,
            background:"rgba(0,0,0,0.7)",
            fontFamily:T.mono, fontSize:9, color:T.fg, fontWeight:900,
          }}>{item.durationSec}s</div>
          <div style={{
            position:"absolute", top:6, left:6,
            padding:"2px 6px", borderRadius:4,
            background:"rgba(0,0,0,0.7)",
            fontFamily:T.mono, fontSize:8, color:T.fg3, fontWeight:900,
            letterSpacing:"0.20em",
          }}>720P · MP4 · MUTE</div>
        </div>

        {/* Meta */}
        <div style={{ minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <span style={{ fontFamily:T.mono, fontSize:14, fontWeight:900, color:T.fg }}>{item.name}</span>
            <StatusStamp status={item.status}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:10 }}>
            <Mini label="Grupo"      value={item.muscle}/>
            <Mini label="Equipam."   value={item.equipment}/>
            <Mini label="Local"      value={locationLabel(item.location)}/>
            <Mini label="Submetido"  value={`${relativeTime(item.submittedAt)} · ${coachName(item.submittedBy)}`}/>
          </div>
          <div style={{
            fontFamily:T.mono, fontSize:9, color:T.fg3,
            background:"rgba(0,0,0,0.30)", border:`1px solid ${T.border}`,
            borderRadius:8, padding:"8px 12px", letterSpacing:"0.10em",
          }}>
            <span style={{ color:T.fg4 }}>ARQUIVO ›</span> {item.filename} · {item.sizeMb.toFixed(1)}MB · sem áudio · ≤15s · ≤720p · ≤12MB · slug-lower-case
          </div>
        </div>

        {/* Actions */}
        {!decided && (
          <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:140 }}>
            <Btn cyan sm onClick={()=>onDecide("aprovado")}><ICheck size={11}/>Aprovar</Btn>
            <Btn ghost sm onClick={()=>{}}>Editar antes</Btn>
            <Btn danger sm onClick={()=>onDecide("rejeitado")}><IX size={11}/>Rejeitar</Btn>
          </div>
        )}
        {decided && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", minWidth:140 }}>
            <Btn ghost sm onClick={()=>{}}>Reabrir</Btn>
          </div>
        )}
      </div>
    </Plate>
  );
}

function Mini({ label, value }) {
  return (
    <div style={{ background:"rgba(0,0,0,0.20)", borderRadius:8, padding:"8px 10px", minWidth:0 }}>
      <div style={{ fontFamily:T.mono, fontSize:8, color:T.fg4, letterSpacing:"0.22em",
        textTransform:"uppercase", marginBottom:3 }}>{label}</div>
      <div style={{ fontFamily:T.mono, fontSize:11, color:T.fg, fontWeight:700,
        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{value}</div>
    </div>
  );
}

function FoodCard({ item, onDecide }) {
  const decided = item.status !== "pendente";
  return (
    <Plate style={{
      padding:"18px 20px", opacity: decided ? 0.7 : 1,
      borderColor: item.status==="aprovado" ? "rgba(74,222,128,0.25)"
                : item.status==="rejeitado" ? "rgba(248,113,113,0.25)" : T.border,
    }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:18, alignItems:"flex-start" }}>
        <div style={{ minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <span style={{ fontFamily:T.mono, fontSize:14, fontWeight:900, color:T.fg }}>{item.pt}</span>
            <Pill tone="cyan">{item.country}</Pill>
            <span style={{ fontFamily:T.mono, fontSize:10, color:T.fg3 }}>· {item.category}</span>
            <StatusStamp status={item.status}/>
          </div>

          {/* Multilang */}
          <div style={{
            display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:10,
          }}>
            {[["PT",item.pt],["IT",item.it],["EN",item.en],["ES",item.es]].map(([lang,name])=>(
              <div key={lang} style={{
                background:"rgba(0,0,0,0.20)", borderRadius:8, padding:"7px 10px",
                display:"flex", flexDirection:"column", gap:2,
              }}>
                <span style={{ fontFamily:T.mono, fontSize:8, color:T.cyan,
                  letterSpacing:"0.30em", fontWeight:900 }}>{lang}</span>
                <span style={{ fontFamily:T.mono, fontSize:11, color:T.fg, fontWeight:700,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{name}</span>
              </div>
            ))}
          </div>

          {/* Macros */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:10 }}>
            <Mini label="Kcal" value={item.macros.kcal}/>
            <Mini label="Proteína" value={`${item.macros.p}g`}/>
            <Mini label="Carbo" value={`${item.macros.c}g`}/>
            <Mini label="Gordura" value={`${item.macros.f}g`}/>
          </div>

          {/* Tags */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {item.allergens.length > 0 && (
              <>
                <span style={{ fontFamily:T.mono, fontSize:8, color:T.fg4, letterSpacing:"0.22em",
                  alignSelf:"center", textTransform:"uppercase" }}>Alergênicos:</span>
                {item.allergens.map(a=><Pill key={a} tone="warn">{a}</Pill>)}
              </>
            )}
            {item.restrictions.length > 0 && (
              <>
                <span style={{ fontFamily:T.mono, fontSize:8, color:T.fg4, letterSpacing:"0.22em",
                  alignSelf:"center", textTransform:"uppercase", marginLeft:8 }}>Restrições:</span>
                {item.restrictions.map(r=><Pill key={r} tone="ok">{r}</Pill>)}
              </>
            )}
          </div>
        </div>

        {!decided && (
          <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:140 }}>
            <Btn cyan sm onClick={()=>onDecide("aprovado")}><ICheck size={11}/>Aprovar</Btn>
            <Btn ghost sm onClick={()=>{}}>Editar antes</Btn>
            <Btn danger sm onClick={()=>onDecide("rejeitado")}><IX size={11}/>Rejeitar</Btn>
          </div>
        )}
        {decided && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", minWidth:140 }}>
            <Btn ghost sm onClick={()=>{}}>Reabrir</Btn>
          </div>
        )}
      </div>
    </Plate>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ARENA
══════════════════════════════════════════════════════════════════════════ */
function ArenaScreen() {
  const sections = [
    { title:"RANKING SEMANAL",  items:MOCK_RANKINGS.weekly  },
    { title:"RANKING MENSAL",   items:MOCK_RANKINGS.monthly },
    { title:"RANKING GERAL",    items:MOCK_RANKINGS.total   },
  ];
  return (
    <div style={{ padding:"24px 28px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
      {sections.map(({ title, items })=>(
        <Plate key={title} style={{ padding:"18px" }}>
          <Kicker cyan style={{ display:"block", marginBottom:14 }}>{title}</Kicker>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {items.map(item=>(
              <div key={item.userId} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                background:"rgba(0,0,0,0.20)", borderRadius:10, padding:"10px 14px",
              }}>
                <div>
                  <div style={{ fontFamily:T.mono, fontSize:12, fontWeight:700, color:T.fg }}>
                    {item.position}º {item.pairName}
                  </div>
                  <div style={{ fontFamily:T.mono, fontSize:9, color:T.fg3, marginTop:2 }}>
                    {avatarLabel(item.avatarStage)}
                    {item.currentStreak ? ` · ${item.currentStreak}d streak` : ""}
                  </div>
                </div>
                <div style={{ fontFamily:T.mono, fontSize:13, fontWeight:900, color:T.cyan }}>
                  {item.xp.toLocaleString("pt-BR")} XP
                </div>
              </div>
            ))}
          </div>
        </Plate>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOGS
══════════════════════════════════════════════════════════════════════════ */
function LogsScreen() {
  return (
    <div style={{ padding:"24px 28px", display:"flex", flexDirection:"column", gap:6 }}>
      <Plate dp style={{ padding:"14px 18px", marginBottom:8 }}>
        <Kicker cyan style={{ display:"block", marginBottom:6 }}>AUDITORIA DO SISTEMA</Kicker>
        <div style={{ fontFamily:T.mono, fontSize:10, color:T.fg3, lineHeight:1.6 }}>
          Logs ficam aqui no sistema. Não substituem o histórico individual do aluno (acessado pelo drawer do aluno › aba Histórico).
        </div>
      </Plate>
      {MOCK_LOGS.map(log=>(
        <Plate key={log.id} dp style={{ padding:"12px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{
                width:24, height:24, borderRadius:6, display:"grid", placeItems:"center",
                background: log.actorRole==="admin" ? T.cyanSoft : log.actorRole==="system" ? "rgba(167,139,250,0.16)" : T.okS,
                color:      log.actorRole==="admin" ? T.cyan     : log.actorRole==="system" ? "#a78bfa" : T.ok,
                border:`1px solid ${T.border}`,
              }}>{log.actorRole==="admin" ? <IShield size={11}/> : log.actorRole==="system" ? <IBolt size={11}/> : <IUsers size={11}/>}</span>
              <div>
                <div style={{ fontFamily:T.mono, fontSize:11, fontWeight:900, color:T.fg,
                  letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:3 }}>{log.action}</div>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.fg3 }}>
                  {log.actorRole} · {log.actorUserId}
                  {log.targetUserId && <span style={{ color:T.fg4 }}> → {log.targetUserId}</span>}
                </div>
              </div>
            </div>
            <div style={{ fontFamily:T.mono, fontSize:9, color:T.fg4, flexShrink:0, letterSpacing:"0.10em" }}>
              {new Date(log.timestamp).toLocaleString("pt-BR")}
            </div>
          </div>
        </Plate>
      ))}
    </div>
  );
}

/* ── ActiveScreen router ─────────────────────────────────────────────────── */
function ActiveScreen() {
  const ctx = useCtxSc(window.PanelCtx);
  switch(ctx.activeScreen) {
    case "hoje":       return <HojeScreen/>;
    case "empresas":   return <EmpresasScreen/>;
    case "alunos":     return <AlunosScreen/>;
    case "coaches":    return <CoachesScreen/>;
    case "treinos":    return <QueueScreen mode="treino"/>;
    case "dietas":     return <QueueScreen mode="dieta"/>;
    case "aprovacoes": return <AprovacoesScreen/>;
    case "arena":      return <ArenaScreen/>;
    case "logs":       return <LogsScreen/>;
    default:           return null;
  }
}

Object.assign(window, {
  HojeScreen, EmpresasScreen, AlunosScreen, CoachesScreen, QueueScreen,
  AprovacoesScreen, ArenaScreen, LogsScreen, ActiveScreen,
  RiskPill, SubPill,
});
