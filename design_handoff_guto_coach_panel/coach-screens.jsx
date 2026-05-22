// GUTO — Coach Portal screens (scoped to one coach)
// Início · Meus Alunos · Treinos · Dietas · Arena

const { useState: useCP, useMemo: useMCP, useContext: useCCP } = React;

function getMyCoach() {
  const id = localStorage.getItem("guto-coach-id") || "c001";
  return MOCK_COACHES.find(c => c.userId === id) || MOCK_COACHES[0];
}

/* ── shared mini-components ─────────────────────────────────────────── */
function CPRiskPill({ student }) {
  const r = calcRisk(student);
  const lk = { ok:"risk.em_dia", atencao:"risk.atencao", critico:"risk.critico",
    "sem-sinal":"risk.sem_sinal", pausado:"risk.pausado" };
  const tone = { ok:"ok", atencao:"warn", critico:"bad", "sem-sinal":"mute", pausado:"mute" };
  return <Pill tone={tone[r]??'mute'} dot>{t(lk[r]??'risk.pausado')}</Pill>;
}
function CPAvatar({ name, size=34 }) {
  const initials = (name||"").split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase();
  const hash = [...(name||"")].reduce((a,c)=>a+c.charCodeAt(0),0);
  const palettes = [
    { bg:"#ECFEFF", fg:"#0E7490" },{ bg:"#F0F9FF", fg:"#0369A1" },
    { bg:"#F5F3FF", fg:"#6D28D9" },{ bg:"#FDF2F8", fg:"#BE185D" },
    { bg:"#FEF3C7", fg:"#A16207" },{ bg:"#ECFDF5", fg:"#047857" },
    { bg:"#FEF2F2", fg:"#B91C1C" },
  ];
  const p = palettes[hash % palettes.length];
  return (
    <div style={{ width:size, height:size, borderRadius:999,
      background:p.bg, color:p.fg, display:"grid", placeItems:"center",
      fontFamily:T.ui, fontSize:size>34?13:11.5, fontWeight:600, flexShrink:0 }}>
      {initials||"?"}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   INÍCIO
════════════════════════════════════════════════════════════════════════ */
function CPInicioScreen() {
  const ctx = useCCP(window.PanelCtx);
  const coach = getMyCoach();
  const myStudents = useMCP(() =>
    MOCK_STUDENTS.filter(s=>s.coachId===coach.userId && s.active && !s.archived)
  , [coach.userId]);
  const criticos  = useMCP(() => myStudents.filter(s=>calcRisk(s)==="critico"), [myStudents]);
  const atencao   = useMCP(() => myStudents.filter(s=>calcRisk(s)==="atencao"), [myStudents]);
  const emDia     = useMCP(() => myStudents.filter(s=>calcRisk(s)==="ok"), [myStudents]);
  const priority  = useMCP(() => [...criticos,...atencao], [criticos, atencao]);
  const today     = new Date().toISOString().split("T")[0];
  const treinoHoje = useMCP(() =>
    myStudents.filter(s=>s.lastValidationAt?.startsWith(today))
  , [myStudents, today]);

  return (
    <div style={{ padding:"28px 32px", display:"flex", flexDirection:"column", gap:24 }}>
      {/* Coach banner */}
      <Card style={{ padding:"16px 20px",
        background:`linear-gradient(135deg,${T.brandSoft} 0%,${T.surface} 60%)`,
        border:`1px solid ${T.brandLine}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <CPAvatar name={coach.name} size={44}/>
          <div>
            <div style={{ fontFamily:T.ui, fontSize:16, fontWeight:600, color:T.fg,
              letterSpacing:"-0.01em" }}>{coach.name}</div>
            <div style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3, marginTop:2 }}>
              {coach.email}
            </div>
          </div>
          <div style={{ marginLeft:"auto" }}>
            <Pill tone="brand">{t("footer.coach")}</Pill>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[
          { icon:<IUsers size={15}/>, label:t("kpi.alunos_ativos"),  value:myStudents.length, tone:"brand" },
          { icon:<ICheck size={15}/>, label:t("kpi.treinos_hoje"),   value:treinoHoje.length, tone:"ok", sub:t("kpi.validacoes") },
          { icon:<IZap size={15}/>,   label:t("kpi.em_dia"),         value:emDia.length, tone:"ok" },
          { icon:<IZap size={15}/>,   label:t("kpi.criticos"),       value:criticos.length, tone:criticos.length>0?"bad":"brand", sub:t("kpi.7dias") },
        ].map((k,i) => (
          <div key={i} style={{ background:T.surface, border:`1px solid ${T.border}`,
            borderRadius:12, padding:"18px 18px 16px", boxShadow:T.shadow1 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <span style={{ fontFamily:T.ui, fontSize:13, color:T.fg2, fontWeight:500 }}>{k.label}</span>
              <span style={{
                width:30, height:30, borderRadius:8,
                background: k.tone==="bad" ? T.badSoft : k.tone==="ok" ? T.okSoft : T.brandSoft,
                color: k.tone==="bad" ? T.bad : k.tone==="ok" ? T.ok : T.brand,
                display:"grid", placeItems:"center",
              }}>{k.icon}</span>
            </div>
            <div style={{ fontFamily:T.ui, fontSize:28, fontWeight:600, color:T.fg,
              lineHeight:1.05, letterSpacing:"-0.02em" }}>{k.value}</div>
            {k.sub && <div style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3, marginTop:6 }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Priority list */}
      <Card>
        <div style={{ padding:"16px 20px 12px", borderBottom:`1px solid ${T.borderSoft}` }}>
          <SectionHeader title={t("misc.alunos_atencao")}
            subtitle={priority.length > 0 ? `${priority.length} ${t("misc.alunos_fora_ritmo")}` : ""}
            action={priority.length > 5 &&
              <Btn ghost sm onClick={()=>ctx.setActiveScreen("meus_alunos")}>
                {t("btn.ver_todos")}<IChevR size={13}/></Btn>}/>
        </div>
        {priority.length === 0 ? (
          <div style={{ padding:"48px 24px", textAlign:"center" }}>
            <div style={{ width:42, height:42, borderRadius:999, background:T.okSoft,
              display:"grid", placeItems:"center", color:T.ok, margin:"0 auto 12px" }}>
              <ICheck size={20}/></div>
            <div style={{ fontFamily:T.ui, fontSize:13.5, color:T.fg2 }}>{t("misc.sem_risco")}</div>
          </div>
        ) : priority.map((s,i) => (
          <button key={s.id} onClick={()=>ctx.openStudent(s)}
            style={{ width:"100%", display:"grid",
              gridTemplateColumns:"auto 1fr auto auto auto",
              alignItems:"center", gap:14, padding:"12px 20px",
              background:T.surface, border:"none",
              borderBottom:i===priority.length-1?"none":`1px solid ${T.borderSoft}`,
              cursor:"pointer", textAlign:"left", transition:"background 120ms ease" }}
            onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
            onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
            <CPAvatar name={s.name}/>
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
              <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, marginTop:2 }}>
                {s.lastValidationAt ? relativeTime(s.lastValidationAt) : "—"}
              </div>
            </div>
            <Num c={T.fg2}>{s.weeklyXp} XP</Num>
            <CPRiskPill student={s}/>
            <IChevR size={14} style={{ color:T.fg4 }}/>
          </button>
        ))}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MEUS ALUNOS
════════════════════════════════════════════════════════════════════════ */
function CPAlunosScreen() {
  const ctx = useCCP(window.PanelCtx);
  const coach = getMyCoach();
  const [search, setSearch] = useCP("");
  const [filter, setFilter] = useCP("ativos");
  const allMine = useMCP(() => MOCK_STUDENTS.filter(s=>s.coachId===coach.userId), [coach.userId]);
  const list = useMCP(() => {
    let s = filter==="ativos"  ? allMine.filter(x=>x.active&&!x.archived)
           : filter==="pausados" ? allMine.filter(x=>!x.active&&!x.archived)
           : allMine;
    if (search) { const q=search.toLowerCase(); s=s.filter(x=>x.name.toLowerCase().includes(q)||x.email.toLowerCase().includes(q)); }
    return s;
  }, [allMine, filter, search]);

  const FILT = [
    { id:"ativos",   label:t("filter.ativos"),   count:allMine.filter(s=>s.active&&!s.archived).length },
    { id:"pausados", label:t("filter.pausados"),  count:allMine.filter(s=>!s.active&&!s.archived).length },
    { id:"todos",    label:t("filter.todos"),     count:allMine.length },
  ];

  return (
    <div style={{ padding:"28px 32px" }}>
      <Card>
        <div style={{ display:"flex", gap:6, padding:"12px 14px",
          borderBottom:`1px solid ${T.borderSoft}`, flexWrap:"wrap", alignItems:"center" }}>
          {FILT.map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{
              height:32, padding:"0 12px", borderRadius:8, cursor:"pointer", border:"none",
              background: filter===f.id ? T.brandSoft : "transparent",
              color: filter===f.id ? T.brandDeep : T.fg2,
              fontFamily:T.ui, fontSize:13, fontWeight: filter===f.id ? 600 : 500,
              display:"inline-flex", alignItems:"center", gap:8,
            }}>
              {f.label}
              <span style={{ fontFamily:T.ui, fontSize:11.5,
                color: filter===f.id ? T.brand : T.fg4,
                background: filter===f.id ? T.surface : T.muteSoft,
                borderRadius:999, padding:"1px 7px" }}>{f.count}</span>
            </button>
          ))}
          <div style={{ flex:1 }}/>
          <SearchBox value={search} onChange={setSearch} placeholder={t("search.aluno")}/>
        </div>
        <div style={{ display:"grid",
          gridTemplateColumns:"minmax(200px,2fr) 110px 80px 90px 100px 80px 32px",
          gap:14, padding:"12px 22px", borderBottom:`1px solid ${T.borderSoft}`,
          background:T.surfaceAlt, fontFamily:T.ui, fontSize:11.5,
          fontWeight:600, letterSpacing:"0.04em", color:T.fg3 }}>
          <span>{t("th.aluno")}</span>
          <span>{t("th.status")}</span>
          <span>{t("th.xp_sem")}</span>
          <span>{t("th.ultima_ativ")}</span>
          <span>{t("th.assinatura")}</span>
          <span>{t("th.avatar")}</span>
          <span></span>
        </div>
        {list.map((s,i) => (
          <button key={s.id} onClick={()=>ctx.openStudent(s)}
            style={{ width:"100%", display:"grid",
              gridTemplateColumns:"minmax(200px,2fr) 110px 80px 90px 100px 80px 32px",
              alignItems:"center", gap:14, padding:"12px 22px",
              background:T.surface, border:"none",
              borderBottom:i===list.length-1?"none":`1px solid ${T.borderSoft}`,
              cursor:"pointer", textAlign:"left", transition:"background 120ms ease" }}
            onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
            onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
            <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
              <CPAvatar name={s.name}/>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, marginTop:2,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.email}</div>
              </div>
            </div>
            <CPRiskPill student={s}/>
            <Num c={T.fg}>{s.weeklyXp}</Num>
            <span style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3 }}>{relativeTime(s.lastValidationAt)}</span>
            <Pill tone={s.subscriptionStatus==="active"?"ok":s.subscriptionStatus==="overdue"?"bad":"mute"} dot>
              {t(`sub.${s.subscriptionStatus}`) || s.subscriptionStatus}
            </Pill>
            <span style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg2, textTransform:"capitalize" }}>
              {t(`avatar.${s.avatarStage}`).toLowerCase()}
            </span>
            <IChevR size={14} style={{ color:T.fg4 }}/>
          </button>
        ))}
        {!list.length && (
          <div style={{ padding:"48px 24px", textAlign:"center" }}>
            <div style={{ fontFamily:T.ui, fontSize:13.5, color:T.fg3 }}>{t("misc.nenhum_aluno")}</div>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   TREINOS / DIETAS (coach-scoped)
════════════════════════════════════════════════════════════════════════ */
function CPQueueScreen({ mode }) {
  const ctx = useCCP(window.PanelCtx);
  const coach = getMyCoach();
  const [qf, setQf] = useCP("todos");
  const mine = MOCK_STUDENTS.filter(s=>s.coachId===coach.userId && s.active && !s.archived);
  const sorted = useMCP(() => {
    const order = { critico:0, atencao:1, "sem-sinal":2, ok:3 };
    const list = qf==="todos" ? mine : mine.filter(s=>calcRisk(s)===qf);
    return [...list].sort((a,b)=>(order[calcRisk(a)]??9)-(order[calcRisk(b)]??9));
  }, [mine, qf]);
  const counts = useMCP(() => ({
    critico:   mine.filter(s=>calcRisk(s)==="critico").length,
    atencao:   mine.filter(s=>calcRisk(s)==="atencao").length,
    "sem-sinal":mine.filter(s=>calcRisk(s)==="sem-sinal").length,
  }), [mine]);
  const FILT = [
    { id:"todos",     label:t("filter.todos"),     count:mine.length },
    { id:"critico",   label:t("filter.criticos"),  count:counts.critico },
    { id:"atencao",   label:t("filter.atencao"),   count:counts.atencao },
    { id:"sem-sinal", label:t("filter.sem_sinal"), count:counts["sem-sinal"] },
  ];
  const actionLabel = mode==="treino" ? t("btn.editar_treino") : t("btn.editar_dieta");

  return (
    <div style={{ padding:"28px 32px" }}>
      <Card>
        <div style={{ display:"flex", gap:6, padding:"12px 14px",
          borderBottom:`1px solid ${T.borderSoft}` }}>
          {FILT.map(f=>(
            <button key={f.id} onClick={()=>setQf(f.id)} style={{
              height:32, padding:"0 12px", borderRadius:8, cursor:"pointer", border:"none",
              background: qf===f.id ? T.brandSoft : "transparent",
              color: qf===f.id ? T.brandDeep : T.fg2,
              fontFamily:T.ui, fontSize:13, fontWeight: qf===f.id ? 600 : 500,
              display:"inline-flex", alignItems:"center", gap:8,
            }}>
              {f.label}
              <span style={{ fontFamily:T.ui, fontSize:11.5,
                color:qf===f.id?T.brand:T.fg4,
                background:qf===f.id?T.surface:T.muteSoft,
                borderRadius:999, padding:"1px 7px" }}>{f.count}</span>
            </button>
          ))}
        </div>
        {sorted.map((s,i)=>(
          <button key={s.id} onClick={()=>ctx.openStudent(s, mode)}
            style={{ width:"100%", display:"grid", gridTemplateColumns:"auto 1fr auto auto",
              alignItems:"center", gap:14, padding:"14px 22px",
              background:T.surface, border:"none",
              borderBottom:i===sorted.length-1?"none":`1px solid ${T.borderSoft}`,
              cursor:"pointer", textAlign:"left", transition:"background 120ms ease" }}
            onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
            onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
            <CPAvatar name={s.name}/>
            <div style={{ minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:2 }}>
                <span style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg }}>{s.name}</span>
                <CPRiskPill student={s}/>
              </div>
              <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3 }}>
                {s.lastValidationAt ? relativeTime(s.lastValidationAt) : "—"}
              </div>
            </div>
            <Num c={T.fg2}>{mode==="treino"?s.weeklyXp:s.monthlyXp} XP</Num>
            <Btn ghost sm>{actionLabel}<IChevR size={13}/></Btn>
          </button>
        ))}
        {!sorted.length && (
          <div style={{ padding:"32px 24px", textAlign:"center" }}>
            <div style={{ fontFamily:T.ui, fontSize:13.5, color:T.fg3 }}>{t("misc.nenhum_aluno")}</div>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ARENA (coach-scoped) — apenas semanal + mensal dos seus alunos
════════════════════════════════════════════════════════════════════════ */
function CPArenaScreen() {
  const coach = getMyCoach();
  const mine = MOCK_STUDENTS.filter(s=>s.coachId===coach.userId);
  const weekly   = useMCP(()=>[...mine].sort((a,b)=>b.weeklyXp-a.weeklyXp).map((s,i)=>({...s,pos:i+1})), [mine]);
  const monthly  = useMCP(()=>[...mine].sort((a,b)=>b.monthlyXp-a.monthlyXp).map((s,i)=>({...s,pos:i+1})), [mine]);

  function RCol({ title, items, xpKey }) {
    return (
      <Card>
        <div style={{ padding:"16px 20px 12px", borderBottom:`1px solid ${T.borderSoft}` }}>
          <div style={{ fontFamily:T.ui, fontSize:14, fontWeight:600, color:T.fg }}>{title}</div>
        </div>
        {items.map((s,i) => {
          const medal = s.pos===1?"#FEF3C7":s.pos===2?"#E2E8F0":s.pos===3?"#FED7AA":T.muteSoft;
          const medalFg = s.pos===1?"#A16207":s.pos===2?"#475569":s.pos===3?"#C2410C":T.fg3;
          return (
            <div key={s.id} style={{ display:"grid", gridTemplateColumns:"28px auto 1fr auto",
              alignItems:"center", gap:12, padding:"12px 20px",
              borderBottom:i===items.length-1?"none":`1px solid ${T.borderSoft}` }}>
              <span style={{ width:24, height:24, borderRadius:999, background:medal,
                color:medalFg, display:"grid", placeItems:"center",
                fontFamily:T.ui, fontSize:11.5, fontWeight:700 }}>{s.pos}</span>
              <CPAvatar name={s.name} size={28}/>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:T.ui, fontSize:13, fontWeight:500, color:T.fg,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                <div style={{ fontFamily:T.ui, fontSize:11, color:T.fg4 }}>
                  {t(`avatar.${s.avatarStage}`).toLowerCase()}
                  {s.currentStreak ? ` · ${s.currentStreak} ${t("rank.streak")}` : ""}
                </div>
              </div>
              <Num style={{ fontSize:14, fontWeight:600 }}>{s[xpKey].toLocaleString("pt-BR")}</Num>
            </div>
          );
        })}
      </Card>
    );
  }

  return (
    <div style={{ padding:"28px 32px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
      <RCol title={t("rank.semanal")} items={weekly}  xpKey="weeklyXp"/>
      <RCol title={t("rank.mensal")}  items={monthly} xpKey="monthlyXp"/>
    </div>
  );
}

/* ── Router ──────────────────────────────────────────────────────────── */
function CPActiveScreen() {
  const ctx = useCCP(window.PanelCtx);
  switch(ctx.activeScreen) {
    case "inicio":      return <CPInicioScreen/>;
    case "meus_alunos": return <CPAlunosScreen/>;
    case "treinos":     return <CPQueueScreen mode="treino"/>;
    case "dietas":      return <CPQueueScreen mode="dieta"/>;
    case "arena":       return <CPArenaScreen/>;
    default:            return <CPInicioScreen/>;
  }
}

Object.assign(window, { CPActiveScreen, CPRiskPill, CPAvatar, getMyCoach });
