// GUTO Sala de Controle — Light theme screens
// Hoje · Empresas · Alunos · Coaches · Treinos · Dietas · Aprovações · Arena · Logs

const { useState: useSc, useMemo: useMSc, useContext: useCtxSc } = React;

/* ── Risk helpers ────────────────────────────────────────────────────────── */
function RiskPill({ student }) {
  const r = calcRisk(student);
  const map = {
    ok:        { tone:"ok",    label:"Em dia"    },
    atencao:   { tone:"warn",  label:"Atenção"   },
    critico:   { tone:"bad",   label:"Crítico"   },
    "sem-sinal":{ tone:"mute", label:"Sem sinal" },
    pausado:   { tone:"mute",  label:"Pausado"   },
  };
  const { tone, label } = map[r] ?? map.pausado;
  return <Pill tone={tone} dot>{label}</Pill>;
}
function SubPill({ status }) {
  const map = { active:"ok", paused:"mute", overdue:"bad", cancelled:"mute", trial:"warn" };
  return <Pill tone={map[status]??'mute'} dot>{subLabel(status)}</Pill>;
}

/* ── KPI card ────────────────────────────────────────────────────────────── */
function KpiCard({ icon, label, value, sub, tone="brand", onClick }) {
  const tones = {
    brand: { bg:T.surface,   bd:T.border,    accent:T.brandDeep,  iconBg:T.brandSoft,  iconFg:T.brand   },
    ok:    { bg:T.surface,   bd:T.border,    accent:T.ok,         iconBg:T.okSoft,     iconFg:T.ok      },
    warn:  { bg:T.surface,   bd:T.border,    accent:T.warn,       iconBg:T.warnSoft,   iconFg:T.warn    },
    bad:   { bg:T.surface,   bd:T.border,    accent:T.bad,        iconBg:T.badSoft,    iconFg:T.bad     },
  };
  const c = tones[tone] ?? tones.brand;
  return (
    <button onClick={onClick} style={{
      background:c.bg, border:`1px solid ${c.bd}`, borderRadius:12,
      padding:"18px 18px 16px", textAlign:"left",
      cursor: onClick ? "pointer" : "default",
      boxShadow:T.shadow1,
      flex:1, minWidth:160,
      transition:"border-color 140ms ease, box-shadow 140ms ease",
    }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <span style={{ fontFamily:T.ui, fontSize:13, color:T.fg2, fontWeight:500 }}>{label}</span>
        <span style={{
          width:30, height:30, borderRadius:8,
          background:c.iconBg, color:c.iconFg,
          display:"grid", placeItems:"center", flexShrink:0,
        }}>{icon}</span>
      </div>
      <div style={{ fontFamily:T.ui, fontSize:28, fontWeight:600, color:T.fg, lineHeight:1.05, letterSpacing:"-0.02em",
        fontVariantNumeric:"tabular-nums" }}>{value}</div>
      {sub && <div style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3, marginTop:6 }}>{sub}</div>}
    </button>
  );
}

/* ── Avatar / Initial chip ───────────────────────────────────────────────── */
function Avatar({ name, size=34 }) {
  const initials = (name||"").split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase();
  const hash = [...(name||"")].reduce((a,c)=>a+c.charCodeAt(0),0);
  const palettes = [
    { bg:"#ECFEFF", fg:"#0E7490" },
    { bg:"#F0F9FF", fg:"#0369A1" },
    { bg:"#F5F3FF", fg:"#6D28D9" },
    { bg:"#FDF2F8", fg:"#BE185D" },
    { bg:"#FEF3C7", fg:"#A16207" },
    { bg:"#ECFDF5", fg:"#047857" },
    { bg:"#FEF2F2", fg:"#B91C1C" },
  ];
  const p = palettes[hash % palettes.length];
  return (
    <div style={{
      width:size, height:size, borderRadius:999,
      background:p.bg, color:p.fg,
      display:"grid", placeItems:"center",
      fontFamily:T.ui, fontSize: size>34 ? 13 : 11.5, fontWeight:600,
      flexShrink:0,
    }}>{initials || "?"}</div>
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
    };
  }, [today]);
  const priority = useMSc(()=>[...stats.criticos, ...stats.atencao].slice(0,8), [stats]);
  const empresasAtivas = MOCK_EMPRESAS.filter(e=>e.status==="active" || e.status==="trial");

  return (
    <div style={{ padding:"28px 32px", display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14 }}>
        <KpiCard icon={<IBuilding size={15}/>} label="Empresas ativas" value={empresasAtivas.length} sub={`${MOCK_EMPRESAS.length} cadastradas`} tone="brand" onClick={()=>ctx.setActiveScreen("empresas")}/>
        <KpiCard icon={<IUsers size={15}/>}    label="Alunos ativos"   value={stats.ativos.length}    sub="com acesso liberado" tone="brand" onClick={()=>ctx.setActiveScreen("alunos")}/>
        <KpiCard icon={<ICheck size={15}/>}    label="Treinos hoje"    value={stats.validatedToday.length} sub="validações no dia" tone="ok"/>
        <KpiCard icon={<IZap size={15}/>}      label="Críticos"        value={stats.criticos.length}  sub="7+ dias parado" tone="bad" onClick={()=>ctx.setActiveScreen("alunos")}/>
        <KpiCard icon={<IGavel size={15}/>}    label="Pendentes"       value={SYS_TELEMETRY.pendingTotal} sub="catálogo aguardando" tone="warn" onClick={()=>ctx.setActiveScreen("aprovacoes")}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:20 }}>
        <Card>
          <div style={{ padding:"16px 20px 12px", borderBottom:`1px solid ${T.borderSoft}` }}>
            <SectionHeader
              title="Alunos que precisam de atenção"
              subtitle={`${priority.length} aluno${priority.length===1?"":"s"} fora do ritmo`}
              action={priority.length > 6 &&
                <Btn ghost sm onClick={()=>ctx.setActiveScreen("alunos")}>Ver todos<IChevR size={13}/></Btn>}
            />
          </div>
          {priority.length === 0 ? (
            <div style={{ padding:"48px 24px", textAlign:"center" }}>
              <div style={{
                width:42, height:42, borderRadius:999, background:T.okSoft,
                display:"grid", placeItems:"center", color:T.ok, margin:"0 auto 12px",
              }}><ICheck size={20}/></div>
              <div style={{ fontFamily:T.ui, fontSize:13.5, color:T.fg2 }}>Todos em dia.</div>
            </div>
          ) : (
            <div>
              {priority.map((s,i)=>(
                <button key={s.id} onClick={()=>ctx.openStudent(s)}
                  style={{
                    width:"100%",
                    display:"grid", gridTemplateColumns:"auto 1fr auto auto auto",
                    alignItems:"center", gap:14, padding:"12px 20px",
                    background:T.surface, border:"none",
                    borderTop: i===0 ? "none" : `1px solid ${T.borderSoft}`,
                    cursor:"pointer", textAlign:"left",
                    transition:"background 120ms ease",
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background=T.surfaceHover}
                  onMouseLeave={e=>e.currentTarget.style.background=T.surface}>
                  <Avatar name={s.name}/>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg,
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                    <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, marginTop:2 }}>
                      {s.lastValidationAt ? `último treino ${relativeTime(s.lastValidationAt)}` : "sem sinal"}
                    </div>
                  </div>
                  <Num c={T.fg2}>{s.weeklyXp} XP</Num>
                  <RiskPill student={s}/>
                  <IChevR size={14} style={{ color:T.fg4 }}/>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div style={{ padding:"16px 20px 12px", borderBottom:`1px solid ${T.borderSoft}` }}>
            <SectionHeader
              title="Empresas ativas"
              subtitle={`${empresasAtivas.length} de ${MOCK_EMPRESAS.length} operando`}
              action={<Btn ghost sm onClick={()=>ctx.setActiveScreen("empresas")}>Ver todas<IChevR size={13}/></Btn>}
            />
          </div>
          <div>
            {empresasAtivas.slice(0,5).map((e,i)=>(
              <button key={e.id} onClick={()=>ctx.openEmpresa(e)}
                style={{
                  width:"100%",
                  display:"grid", gridTemplateColumns:"auto 1fr auto auto",
                  alignItems:"center", gap:14, padding:"12px 20px",
                  background:T.surface, border:"none",
                  borderTop: i===0 ? "none" : `1px solid ${T.borderSoft}`,
                  cursor:"pointer", textAlign:"left",
                }}
                onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
                onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
                <div style={{
                  width:34, height:34, borderRadius:8,
                  background:T.brandSoft, color:T.brand,
                  display:"grid", placeItems:"center", flexShrink:0,
                  border:`1px solid ${T.brandLine}`,
                }}><IBuilding size={15}/></div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg,
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.name}</div>
                  <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, marginTop:2 }}>
                    {e.usage.students}/{e.maxStudents} alunos · {e.usage.coaches}/{e.maxCoaches} coaches
                  </div>
                </div>
                <Pill tone={mapEmpTone(e.status)} dot>{empresaStatusPrettyLabel(e.status)}</Pill>
                <IChevR size={14} style={{ color:T.fg4 }}/>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function mapEmpTone(s) {
  return ({ active:"ok", trial:"warn", paused:"mute", overdue:"bad", archived:"mute" })[s] ?? "mute";
}
function empresaStatusPrettyLabel(s) {
  return ({ active:"Ativa", trial:"Teste", paused:"Pausada", overdue:"Vencida", archived:"Arquivada" })[s] ?? s;
}
function planPretty(p) {
  return ({ start:"Start", pro:"Pro", custom:"Custom" })[p] ?? p;
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
    { id:"todas",   label:"Todas",    count:MOCK_EMPRESAS.length },
    { id:"active",  label:"Ativas",   count:MOCK_EMPRESAS.filter(e=>e.status==="active").length },
    { id:"trial",   label:"Teste",    count:MOCK_EMPRESAS.filter(e=>e.status==="trial").length },
    { id:"paused",  label:"Pausadas", count:MOCK_EMPRESAS.filter(e=>e.status==="paused").length },
    { id:"overdue", label:"Vencidas", count:MOCK_EMPRESAS.filter(e=>e.status==="overdue").length },
  ];

  return (
    <div style={{ padding:"28px 32px" }}>
      <Card>
        {/* Filters */}
        <div style={{ display:"flex", gap:6, padding:"12px 14px",
          borderBottom:`1px solid ${T.borderSoft}`, overflowX:"auto" }}>
          {FILTERS.map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{
              height:32, padding:"0 12px", borderRadius:8, cursor:"pointer",
              border: "none",
              background: filter===f.id ? T.brandSoft : "transparent",
              color: filter===f.id ? T.brandDeep : T.fg2,
              fontFamily:T.ui, fontSize:13, fontWeight: filter===f.id ? 600 : 500,
              display:"inline-flex", alignItems:"center", gap:8, whiteSpace:"nowrap",
            }}>
              {f.label}
              <span style={{
                fontFamily:T.ui, fontSize:11.5, fontWeight:500,
                color: filter===f.id ? T.brand : T.fg4,
                background: filter===f.id ? T.surface : T.muteSoft,
                borderRadius:999, padding:"1px 7px",
              }}>{f.count}</span>
            </button>
          ))}
          <div style={{ flex:1 }}/>
          <SearchBox value={search} onChange={setSearch} placeholder="Buscar empresa…"/>
        </div>

        {/* Table */}
        <div>
          <div style={{
            display:"grid",
            gridTemplateColumns:"minmax(220px,2fr) 110px 80px 130px 130px 110px 32px",
            gap:14, padding:"12px 22px",
            borderBottom:`1px solid ${T.borderSoft}`,
            background:T.surfaceAlt,
            fontFamily:T.ui, fontSize:11.5, fontWeight:600,
            letterSpacing:"0.04em", color:T.fg3,
          }}>
            <span>Empresa</span>
            <span>Status</span>
            <span>Plano</span>
            <span>Alunos</span>
            <span>Coaches</span>
            <span>Atividade</span>
            <span></span>
          </div>
          {list.map((e,i)=>(
            <button key={e.id} onClick={()=>ctx.openEmpresa(e)}
              style={{
                width:"100%",
                display:"grid",
                gridTemplateColumns:"minmax(220px,2fr) 110px 80px 130px 130px 110px 32px",
                alignItems:"center", gap:14, padding:"14px 22px",
                background:T.surface, border:"none",
                borderBottom: i===list.length-1 ? "none" : `1px solid ${T.borderSoft}`,
                cursor:"pointer", textAlign:"left",
                transition:"background 120ms ease",
              }}
              onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
              onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
              <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
                <div style={{
                  width:34, height:34, borderRadius:8,
                  background:T.brandSoft, color:T.brand,
                  display:"grid", placeItems:"center", flexShrink:0,
                  border:`1px solid ${T.brandLine}`,
                }}><IBuilding size={15}/></div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg,
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.name}</div>
                  <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, marginTop:2,
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {e.responsible} · {e.country}
                  </div>
                </div>
              </div>
              <Pill tone={mapEmpTone(e.status)} dot>{empresaStatusPrettyLabel(e.status)}</Pill>
              <span style={{ fontFamily:T.ui, fontSize:13, color:T.fg2, fontWeight:500 }}>
                {planPretty(e.plan)}
              </span>
              <UsageBar value={e.usage.students} max={e.maxStudents}/>
              <UsageBar value={e.usage.coaches}  max={e.maxCoaches}/>
              <span style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3 }}>
                {relativeTime(e.lastActivityAt)}
              </span>
              <IChevR size={14} style={{ color:T.fg4 }}/>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function UsageBar({ value, max }) {
  const pct = Math.min(100, max ? (value/max)*100 : 0);
  const tone = pct >= 95 ? T.bad : pct >= 80 ? T.warn : T.brand;
  return (
    <div style={{ minWidth:0 }}>
      <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:5 }}>
        <Num style={{ fontSize:13 }}>{value}</Num>
        <span style={{ fontFamily:T.ui, fontSize:11.5, color:T.fg4 }}>/ {max}</span>
      </div>
      <div style={{ height:4, background:T.muteSoft, borderRadius:99, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:tone, transition:"width 200ms" }}/>
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
    if (filter==="ativos")     s = s.filter(x=>x.active && !x.archived);
    if (filter==="pausados")   s = s.filter(x=>!x.active && !x.archived);
    if (filter==="arquivados") s = s.filter(x=>x.archived);
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

  const FILTERS = [
    { id:"ativos",     label:"Ativos",     count:MOCK_STUDENTS.filter(s=>s.active && !s.archived).length },
    { id:"pausados",   label:"Pausados",   count:MOCK_STUDENTS.filter(s=>!s.active && !s.archived).length },
    { id:"arquivados", label:"Arquivados", count:MOCK_STUDENTS.filter(s=>s.archived).length },
    { id:"todos",      label:"Todos",      count:MOCK_STUDENTS.length },
  ];

  return (
    <div style={{ padding:"28px 32px" }}>
      <Card>
        <div style={{ display:"flex", gap:8, padding:"12px 14px", flexWrap:"wrap",
          borderBottom:`1px solid ${T.borderSoft}`, alignItems:"center" }}>
          {FILTERS.map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{
              height:32, padding:"0 12px", borderRadius:8, cursor:"pointer", border:"none",
              background: filter===f.id ? T.brandSoft : "transparent",
              color: filter===f.id ? T.brandDeep : T.fg2,
              fontFamily:T.ui, fontSize:13, fontWeight: filter===f.id ? 600 : 500,
              display:"inline-flex", alignItems:"center", gap:8,
            }}>
              {f.label}
              <span style={{
                fontFamily:T.ui, fontSize:11.5, fontWeight:500,
                color: filter===f.id ? T.brand : T.fg4,
                background: filter===f.id ? T.surface : T.muteSoft,
                borderRadius:999, padding:"1px 7px",
              }}>{f.count}</span>
            </button>
          ))}
          <div style={{ width:1, height:24, background:T.border, margin:"0 4px" }}/>
          <SelectInput value={empF} onChange={setEmpF} style={{ height:32, fontSize:13 }}>
            <option value="">Todas as empresas</option>
            {MOCK_EMPRESAS.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
          </SelectInput>
          <SelectInput value={coachF} onChange={setCoachF} style={{ height:32, fontSize:13 }}>
            <option value="">Todos os coaches</option>
            {MOCK_COACHES.map(c=><option key={c.userId} value={c.userId}>{c.name}</option>)}
          </SelectInput>
          <div style={{ flex:1 }}/>
          <SearchBox value={search} onChange={setSearch} placeholder="Buscar aluno…"/>
        </div>

        <div>
          <div style={{
            display:"grid",
            gridTemplateColumns:"minmax(220px,2fr) 110px 130px 80px 90px 100px 80px 32px",
            gap:14, padding:"12px 22px",
            borderBottom:`1px solid ${T.borderSoft}`,
            background:T.surfaceAlt,
            fontFamily:T.ui, fontSize:11.5, fontWeight:600,
            letterSpacing:"0.04em", color:T.fg3,
          }}>
            <span>Aluno</span>
            <span>Status</span>
            <span>Coach</span>
            <span>XP / sem</span>
            <span>Última atividade</span>
            <span>Assinatura</span>
            <span>Avatar</span>
            <span></span>
          </div>
          {list.map((s,i)=>(
            <button key={s.id} onClick={()=>ctx.openStudent(s)}
              style={{
                width:"100%",
                display:"grid",
                gridTemplateColumns:"minmax(220px,2fr) 110px 130px 80px 90px 100px 80px 32px",
                alignItems:"center", gap:14, padding:"12px 22px",
                background:T.surface, border:"none",
                borderBottom: i===list.length-1 ? "none" : `1px solid ${T.borderSoft}`,
                cursor:"pointer", textAlign:"left",
                transition:"background 120ms ease",
              }}
              onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
              onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
              <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
                <Avatar name={s.name}/>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg,
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                  <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, marginTop:2,
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.email}</div>
                </div>
              </div>
              <RiskPill student={s}/>
              <span style={{ fontFamily:T.ui, fontSize:13, color:T.fg2,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{coachName(s.coachId)}</span>
              <Num c={T.fg}>{s.weeklyXp}</Num>
              <span style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3 }}>
                {relativeTime(s.lastValidationAt)}
              </span>
              <SubPill status={s.subscriptionStatus}/>
              <span style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg2, textTransform:"capitalize" }}>
                {(avatarLabel(s.avatarStage)||"").toLowerCase()}
              </span>
              <IChevR size={14} style={{ color:T.fg4 }}/>
            </button>
          ))}
          {!list.length && (
            <div style={{ padding:"48px 24px", textAlign:"center" }}>
              <div style={{ fontFamily:T.ui, fontSize:13.5, color:T.fg3 }}>Nenhum aluno encontrado.</div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COACHES
══════════════════════════════════════════════════════════════════════════ */
function CoachesScreen() {
  return (
    <div style={{ padding:"28px 32px", display:"flex", flexDirection:"column", gap:16 }}>
      {/* Permissions explainer */}
      <Card accent style={{ padding:"16px 20px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:16, alignItems:"flex-start" }}>
          <div style={{
            width:36, height:36, borderRadius:8,
            background:T.brandSoft, color:T.brand,
            display:"grid", placeItems:"center",
            border:`1px solid ${T.brandLine}`,
          }}><IShield size={16}/></div>
          <div>
            <div style={{ fontFamily:T.ui, fontSize:14, fontWeight:600, color:T.fg, marginBottom:4 }}>
              Coaches são operadores limitados
            </div>
            <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg3, marginBottom:10 }}>
              Veem apenas seus alunos. Podem sugerir, mas só o super admin aprova catálogo, cria empresa ou controla outros coaches.
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginTop:8,
              fontFamily:T.ui, fontSize:12.5, color:T.fg2 }}>
              <PermLine ok>Ver alunos atribuídos</PermLine>
              <PermLine ok>Sugerir exercício / alimento</PermLine>
              <PermLine ok>Ajustar treino / dieta</PermLine>
              <PermLine no>Aprovar catálogo</PermLine>
              <PermLine no>Criar empresa</PermLine>
              <PermLine no>Controlar outros coaches</PermLine>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{
          display:"grid", gridTemplateColumns:"minmax(220px,2fr) 220px 120px 80px 100px",
          gap:14, padding:"12px 22px",
          borderBottom:`1px solid ${T.borderSoft}`,
          background:T.surfaceAlt,
          fontFamily:T.ui, fontSize:11.5, fontWeight:600, letterSpacing:"0.04em", color:T.fg3,
        }}>
          <span>Coach</span>
          <span>Empresa</span>
          <span>Alunos</span>
          <span>Status</span>
          <span style={{ textAlign:"right" }}>Ações</span>
        </div>
        {MOCK_COACHES.map((coach,i)=>{
          const empName = MOCK_EMPRESAS.find(e=>coachesForEmpresa(e.id).some(c=>c.userId===coach.userId))?.name ?? "—";
          const stCount = MOCK_STUDENTS.filter(s=>s.coachId===coach.userId).length;
          return (
            <div key={coach.userId} style={{
              display:"grid", gridTemplateColumns:"minmax(220px,2fr) 220px 120px 80px 100px",
              alignItems:"center", gap:14, padding:"14px 22px",
              borderBottom: i===MOCK_COACHES.length-1 ? "none" : `1px solid ${T.borderSoft}`,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
                <Avatar name={coach.name}/>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg }}>{coach.name}</div>
                  <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, marginTop:2,
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{coach.email}</div>
                </div>
              </div>
              <span style={{ fontFamily:T.ui, fontSize:13, color:T.fg2 }}>{empName}</span>
              <span><Num c={T.fg}>{stCount}</Num> <span style={{ fontFamily:T.ui, fontSize:12, color:T.fg4 }}>alunos</span></span>
              <Pill tone={coach.active ? "ok" : "mute"} dot>{coach.active ? "Ativo" : "Pausado"}</Pill>
              <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
                <Btn ghost sm onClick={()=>{}}>{coach.active ? "Pausar" : "Ativar"}</Btn>
                <Btn ghost sm danger onClick={()=>{}} style={{ width:32, padding:0 }}><ITrash size={14}/></Btn>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function PermLine({ children, ok, no }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <span style={{
        width:16, height:16, borderRadius:5, flexShrink:0,
        display:"grid", placeItems:"center",
        background: ok ? T.okSoft : T.badSoft,
        color: ok ? T.ok : T.bad,
        border:`1px solid ${ok ? T.okLine : T.badLine}`,
      }}>{ok ? <ICheck size={10} sw={3}/> : <IX size={10} sw={3}/>}</span>
      <span style={{ color: no ? T.fg3 : T.fg2 }}>{children}</span>
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
    { id:"todos", label:"Todos", count:ativos.length },
    { id:"critico",   label:"Críticos",  count:counts.critico },
    { id:"atencao",   label:"Atenção",   count:counts.atencao },
    { id:"sem-sinal", label:"Sem sinal", count:counts["sem-sinal"] },
  ];
  const tab = mode === "treino" ? "treino" : "dieta";
  const actionLabel = mode === "treino" ? "Editar treino" : "Editar dieta";

  return (
    <div style={{ padding:"28px 32px", display:"flex", flexDirection:"column", gap:16 }}>
      <Card style={{ padding:"14px 18px",
        background:`linear-gradient(135deg, ${T.brandSoft} 0%, ${T.surface} 60%)`,
        border:`1px solid ${T.brandLine}`,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
          <div style={{
            width:36, height:36, borderRadius:8,
            background:T.surface, color:T.brand,
            display:"grid", placeItems:"center",
            border:`1px solid ${T.brandLine}`, flexShrink:0,
          }}>{mode==="treino" ? <IDumbbell size={16}/> : <IFork size={16}/>}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:T.ui, fontSize:14, fontWeight:600, color:T.fg, marginBottom:2 }}>
              Fila editorial ordenada por urgência
            </div>
            <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg3 }}>
              Alunos críticos primeiro. Super admin pode editar; GUTO pode gerar ou atualizar.
            </div>
          </div>
          <Btn sm onClick={()=>{}}><IBolt size={13}/>Gerar com GUTO</Btn>
        </div>
      </Card>

      <Card>
        <div style={{ display:"flex", gap:6, padding:"12px 14px",
          borderBottom:`1px solid ${T.borderSoft}` }}>
          {FILTERS.map(({ id, label, count })=>(
            <button key={id} onClick={()=>setQf(id)} style={{
              height:32, padding:"0 12px", borderRadius:8, cursor:"pointer", border:"none",
              background: qf===id ? T.brandSoft : "transparent",
              color: qf===id ? T.brandDeep : T.fg2,
              fontFamily:T.ui, fontSize:13, fontWeight: qf===id ? 600 : 500,
              display:"inline-flex", alignItems:"center", gap:8,
            }}>
              {label}
              <span style={{
                fontFamily:T.ui, fontSize:11.5, fontWeight:500,
                color: qf===id ? T.brand : T.fg4,
                background: qf===id ? T.surface : T.muteSoft,
                borderRadius:999, padding:"1px 7px",
              }}>{count}</span>
            </button>
          ))}
        </div>

        <div>
          {sorted.map((s,i)=>(
            <button key={s.id} onClick={()=>ctx.openStudent(s, tab)}
              style={{
                width:"100%",
                display:"grid",
                gridTemplateColumns:"auto 1fr auto auto auto",
                alignItems:"center", gap:14, padding:"14px 22px",
                background:T.surface, border:"none",
                borderBottom: i===sorted.length-1 ? "none" : `1px solid ${T.borderSoft}`,
                cursor:"pointer", textAlign:"left",
                transition:"background 120ms ease",
              }}
              onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
              onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
              <Avatar name={s.name}/>
              <div style={{ minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:2 }}>
                  <span style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg }}>{s.name}</span>
                  <RiskPill student={s}/>
                </div>
                <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3 }}>
                  {s.lastValidationAt ? `última validação ${relativeTime(s.lastValidationAt)}` : "sem sinal"}
                  {" · "}{coachName(s.coachId)}
                </div>
              </div>
              <Num c={T.fg2}>{mode==="treino" ? s.weeklyXp : s.monthlyXp} XP</Num>
              <Btn ghost sm>{actionLabel}<IChevR size={13}/></Btn>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   APROVAÇÕES
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
    <div style={{ padding:"28px 32px", display:"flex", flexDirection:"column", gap:16 }}>
      <Card accent style={{ padding:"14px 20px",
        background:`linear-gradient(135deg, ${T.brandSoft} 0%, ${T.surface} 60%)` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{
            width:36, height:36, borderRadius:8,
            background:T.surface, color:T.brand,
            display:"grid", placeItems:"center",
            border:`1px solid ${T.brandLine}`,
          }}><IGavel size={16}/></div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:T.ui, fontSize:14, fontWeight:600, color:T.fg, marginBottom:2 }}>
              Apenas o super admin aprova. Coaches só sugerem.
            </div>
            <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg3 }}>
              Aprovados entram no catálogo do GUTO e ficam disponíveis em treinos e dietas futuros.
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display:"flex", gap:8 }}>
        {[
          { id:"ex", label:"Exercícios pendentes", count:exPending, Icon:IDumbbell },
          { id:"fd", label:"Alimentos pendentes",  count:fdPending, Icon:IFork     },
        ].map(t=>{
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:"0 0 auto", height:42, padding:"0 16px", borderRadius:10, cursor:"pointer",
              background: active ? T.surface : "transparent",
              border:`1px solid ${active ? T.brandLine : T.border}`,
              color: active ? T.brandDeep : T.fg2,
              fontFamily:T.ui, fontSize:13.5, fontWeight: active ? 600 : 500,
              display:"inline-flex", alignItems:"center", gap:9,
              boxShadow: active ? T.shadow1 : "none",
            }}>
              <t.Icon size={15}/>
              {t.label}
              <span style={{
                fontFamily:T.ui, fontSize:11.5, fontWeight:600,
                color: active ? T.brand : T.fg4,
                background: active ? T.brandSoft : T.muteSoft,
                borderRadius:999, padding:"1px 8px",
              }}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {tab === "ex" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {items.ex.map(it=><ExerciseCard key={it.id} item={it} onDecide={(d)=>decide("ex", it.id, d)}/>)}
        </div>
      )}
      {tab === "fd" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {items.fd.map(it=><FoodCard key={it.id} item={it} onDecide={(d)=>decide("fd", it.id, d)}/>)}
        </div>
      )}

      {toast && (
        <div style={{
          position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
          padding:"12px 18px", borderRadius:10,
          background: T.surface,
          border:`1px solid ${toast.decision==="aprovado" ? T.okLine : T.badLine}`,
          color: toast.decision==="aprovado" ? T.ok : T.bad,
          fontFamily:T.ui, fontSize:13, fontWeight:500,
          display:"flex", alignItems:"center", gap:10, zIndex:80,
          boxShadow: T.shadow3,
        }}>
          <span style={{
            width:24, height:24, borderRadius:999,
            background: toast.decision==="aprovado" ? T.okSoft : T.badSoft,
            display:"grid", placeItems:"center",
          }}>{toast.decision==="aprovado" ? <ICheck size={13} sw={3}/> : <IX size={13} sw={3}/>}</span>
          {toast.decision==="aprovado"
            ? `${toast.kind==="ex"?"Exercício":"Alimento"} adicionado ao catálogo GUTO.`
            : `${toast.kind==="ex"?"Exercício":"Alimento"} rejeitado.`}
        </div>
      )}
    </div>
  );
}

function StatusStamp({ status }) {
  if (status === "aprovado") return <Pill tone="ok" dot>No catálogo</Pill>;
  if (status === "rejeitado") return <Pill tone="bad" dot>Rejeitado</Pill>;
  return <Pill tone="warn" dot>Pendente</Pill>;
}

function ExerciseCard({ item, onDecide }) {
  const decided = item.status !== "pendente";
  return (
    <Card style={{
      padding:"18px 20px",
      opacity: decided ? 0.7 : 1,
      borderColor: item.status==="aprovado" ? T.okLine
                : item.status==="rejeitado" ? T.badLine : T.border,
    }}>
      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr auto", gap:20, alignItems:"flex-start" }}>
        <div style={{
          width:200, height:130, borderRadius:10, position:"relative",
          background: `linear-gradient(135deg, ${T.brandSoft} 0%, ${T.surface} 100%)`,
          border:`1px solid ${T.brandLine}`,
          overflow:"hidden",
        }}>
          <div style={{
            position:"absolute", inset:0, display:"grid", placeItems:"center",
            color:T.brand,
          }}>
            <div style={{
              width:48, height:48, borderRadius:999,
              background:T.surface, border:`1px solid ${T.brandLine}`,
              display:"grid", placeItems:"center",
              boxShadow:T.shadow1,
            }}><IPlay size={16}/></div>
          </div>
          <div style={{
            position:"absolute", bottom:8, right:8,
            padding:"2px 7px", borderRadius:6,
            background:"rgba(15,23,42,0.85)",
            fontFamily:T.mono, fontSize:11, color:"#fff", fontWeight:500,
          }}>{item.durationSec}s</div>
        </div>

        <div style={{ minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, flexWrap:"wrap" }}>
            <span style={{ fontFamily:T.ui, fontSize:16, fontWeight:600, color:T.fg, letterSpacing:"-0.01em" }}>
              {item.name}
            </span>
            <StatusStamp status={item.status}/>
          </div>
          <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg3, marginBottom:14 }}>
            Submetido por {coachName(item.submittedBy)} · {relativeTime(item.submittedAt)}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:12 }}>
            <Mini label="Grupo"     value={item.muscle}/>
            <Mini label="Equipam."  value={item.equipment}/>
            <Mini label="Local"     value={locationPretty(item.location)}/>
            <Mini label="Arquivo"   value={`${item.sizeMb.toFixed(1)} MB`}/>
          </div>
          <div style={{
            fontFamily:T.mono, fontSize:11.5, color:T.fg3,
            background:T.surfaceAlt, border:`1px solid ${T.borderSoft}`,
            borderRadius:8, padding:"8px 12px",
          }}>
            <span style={{ color:T.fg4 }}>{item.filename}</span>
            <span style={{ color:T.fg5 }}>{"  "}·{"  "}</span>
            <span>MP4 · sem áudio · ≤15s · ≤720p · ≤12MB</span>
          </div>
        </div>

        {!decided && (
          <div style={{ display:"flex", flexDirection:"column", gap:8, minWidth:150 }}>
            <Btn primary sm onClick={()=>onDecide("aprovado")}><ICheck size={13}/>Aprovar</Btn>
            <Btn sm onClick={()=>{}}>Editar antes</Btn>
            <Btn danger sm onClick={()=>onDecide("rejeitado")}><IX size={13}/>Rejeitar</Btn>
          </div>
        )}
        {decided && (
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"flex-end", minWidth:150 }}>
            <Btn ghost sm onClick={()=>{}}>Reabrir</Btn>
          </div>
        )}
      </div>
    </Card>
  );
}

function locationPretty(l) {
  return ({ academia:"Academia", casa:"Casa", "ar-livre":"Ar livre" })[l] ?? l;
}

function Mini({ label, value }) {
  return (
    <div style={{ background:T.surfaceAlt, borderRadius:8, padding:"8px 11px",
      border:`1px solid ${T.borderSoft}`, minWidth:0 }}>
      <div style={{ fontFamily:T.ui, fontSize:11, color:T.fg4, fontWeight:500,
        marginBottom:2 }}>{label}</div>
      <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg, fontWeight:500,
        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{value}</div>
    </div>
  );
}

function FoodCard({ item, onDecide }) {
  const decided = item.status !== "pendente";
  return (
    <Card style={{
      padding:"18px 20px",
      opacity: decided ? 0.7 : 1,
      borderColor: item.status==="aprovado" ? T.okLine
                : item.status==="rejeitado" ? T.badLine : T.border,
    }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:20, alignItems:"flex-start" }}>
        <div style={{ minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, flexWrap:"wrap" }}>
            <span style={{ fontFamily:T.ui, fontSize:16, fontWeight:600, color:T.fg, letterSpacing:"-0.01em" }}>
              {item.pt}
            </span>
            <Pill tone="brand">{item.country}</Pill>
            <span style={{ fontFamily:T.ui, fontSize:13, color:T.fg3 }}>· {item.category}</span>
            <StatusStamp status={item.status}/>
          </div>
          <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg3, marginBottom:14 }}>
            Submetido por {coachName(item.submittedBy)}
          </div>

          <div style={{
            display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12,
          }}>
            {[["PT",item.pt],["IT",item.it],["EN",item.en],["ES",item.es]].map(([lang,name])=>(
              <div key={lang} style={{
                background:T.surfaceAlt, borderRadius:8, padding:"8px 11px",
                border:`1px solid ${T.borderSoft}`,
              }}>
                <span style={{ fontFamily:T.ui, fontSize:10.5, color:T.brand,
                  fontWeight:600, letterSpacing:"0.08em" }}>{lang}</span>
                <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg, fontWeight:500, marginTop:2,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{name}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12 }}>
            <Mini label="Kcal" value={item.macros.kcal}/>
            <Mini label="Proteína" value={`${item.macros.p} g`}/>
            <Mini label="Carbo" value={`${item.macros.c} g`}/>
            <Mini label="Gordura" value={`${item.macros.f} g`}/>
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
            {item.allergens.length > 0 && (
              <>
                <span style={{ fontFamily:T.ui, fontSize:12, color:T.fg4 }}>Alergênicos:</span>
                {item.allergens.map(a=><Pill key={a} tone="warn">{a}</Pill>)}
              </>
            )}
            {item.restrictions.length > 0 && (
              <>
                <span style={{ fontFamily:T.ui, fontSize:12, color:T.fg4, marginLeft:8 }}>Restrições:</span>
                {item.restrictions.map(r=><Pill key={r} tone="ok">{r}</Pill>)}
              </>
            )}
          </div>
        </div>

        {!decided && (
          <div style={{ display:"flex", flexDirection:"column", gap:8, minWidth:150 }}>
            <Btn primary sm onClick={()=>onDecide("aprovado")}><ICheck size={13}/>Aprovar</Btn>
            <Btn sm onClick={()=>{}}>Editar antes</Btn>
            <Btn danger sm onClick={()=>onDecide("rejeitado")}><IX size={13}/>Rejeitar</Btn>
          </div>
        )}
        {decided && (
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"flex-end", minWidth:150 }}>
            <Btn ghost sm onClick={()=>{}}>Reabrir</Btn>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ARENA
══════════════════════════════════════════════════════════════════════════ */
function ArenaScreen() {
  const sections = [
    { title:"Ranking semanal",  items:MOCK_RANKINGS.weekly  },
    { title:"Ranking mensal",   items:MOCK_RANKINGS.monthly },
    { title:"Ranking geral",    items:MOCK_RANKINGS.total   },
  ];
  return (
    <div style={{ padding:"28px 32px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
      {sections.map(({ title, items })=>(
        <Card key={title}>
          <div style={{ padding:"16px 20px 12px", borderBottom:`1px solid ${T.borderSoft}` }}>
            <div style={{ fontFamily:T.ui, fontSize:14, fontWeight:600, color:T.fg }}>{title}</div>
          </div>
          <div>
            {items.map((item,i)=>{
              const medalBg = item.position===1 ? "#FEF3C7" : item.position===2 ? "#E2E8F0" : item.position===3 ? "#FED7AA" : T.muteSoft;
              const medalFg = item.position===1 ? "#A16207" : item.position===2 ? "#475569" : item.position===3 ? "#C2410C" : T.fg3;
              return (
                <div key={item.userId} style={{
                  display:"grid", gridTemplateColumns:"28px 1fr auto",
                  alignItems:"center", gap:12, padding:"12px 20px",
                  borderBottom: i===items.length-1 ? "none" : `1px solid ${T.borderSoft}`,
                }}>
                  <span style={{
                    width:24, height:24, borderRadius:999,
                    background:medalBg, color:medalFg,
                    display:"grid", placeItems:"center",
                    fontFamily:T.ui, fontSize:11.5, fontWeight:700,
                  }}>{item.position}</span>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg,
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {item.pairName}
                    </div>
                    <div style={{ fontFamily:T.ui, fontSize:11.5, color:T.fg3, marginTop:1, textTransform:"capitalize" }}>
                      {(avatarLabel(item.avatarStage)||"").toLowerCase()}
                      {item.currentStreak ? ` · ${item.currentStreak} d` : ""}
                    </div>
                  </div>
                  <Num style={{ fontSize:14, fontWeight:600 }}>{item.xp.toLocaleString("pt-BR")}</Num>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOGS
══════════════════════════════════════════════════════════════════════════ */
function LogsScreen() {
  return (
    <div style={{ padding:"28px 32px", display:"flex", flexDirection:"column", gap:16 }}>
      <Card accent style={{ padding:"14px 20px",
        background:`linear-gradient(135deg, ${T.brandSoft} 0%, ${T.surface} 60%)` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{
            width:36, height:36, borderRadius:8,
            background:T.surface, color:T.brand,
            display:"grid", placeItems:"center",
            border:`1px solid ${T.brandLine}`,
          }}><ILog size={16}/></div>
          <div>
            <div style={{ fontFamily:T.ui, fontSize:14, fontWeight:600, color:T.fg, marginBottom:2 }}>
              Auditoria do sistema
            </div>
            <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg3 }}>
              Eventos administrativos. O histórico individual do aluno fica no drawer do aluno › aba Histórico.
            </div>
          </div>
        </div>
      </Card>

      <Card>
        {MOCK_LOGS.map((log,i)=>{
          const palette = log.actorRole==="admin"  ? { bg:T.brandSoft, fg:T.brand, Icon:IShield }
                         : log.actorRole==="system" ? { bg:T.infoSoft,  fg:T.info,  Icon:IBolt   }
                         :                             { bg:T.okSoft,    fg:T.ok,    Icon:IUser   };
          return (
            <div key={log.id} style={{
              display:"grid", gridTemplateColumns:"auto 1fr auto",
              alignItems:"center", gap:14, padding:"14px 22px",
              borderBottom: i===MOCK_LOGS.length-1 ? "none" : `1px solid ${T.borderSoft}`,
            }}>
              <span style={{
                width:32, height:32, borderRadius:8,
                background:palette.bg, color:palette.fg,
                display:"grid", placeItems:"center",
              }}><palette.Icon size={14}/></span>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg, marginBottom:2 }}>
                  {prettyAction(log.action)}
                </div>
                <div style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3 }}>
                  {log.actorRole} · <span style={{ fontFamily:T.mono, fontSize:12 }}>{log.actorUserId}</span>
                  {log.targetUserId && <> → <span style={{ fontFamily:T.mono, fontSize:12, color:T.fg4 }}>{log.targetUserId}</span></>}
                </div>
              </div>
              <span style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3 }}>
                {new Date(log.timestamp).toLocaleString("pt-BR")}
              </span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function prettyAction(a) {
  const map = {
    "student.workout.saved":      "Treino salvo",
    "student.diet.generated":     "Dieta gerada",
    "student.access.paused":      "Acesso pausado",
    "student.xp.weekly.reset":    "XP semanal resetado",
    "student.created":            "Aluno criado",
    "coach.created":              "Coach criado",
    "student.calibration.updated":"Calibragem atualizada",
    "student.workout.locked":     "Treino bloqueado",
    "team.plan.updated":          "Plano atualizado",
    "student.invite.regenerated": "Convite regerado",
  };
  return map[a] ?? a;
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
  RiskPill, SubPill, Avatar, KpiCard, Mini, mapEmpTone, empresaStatusPrettyLabel, planPretty,
});
