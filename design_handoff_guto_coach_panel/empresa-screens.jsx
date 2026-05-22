// GUTO — Empresa Portal screens (scoped to one empresa)
// Visão Geral · Coaches · Alunos · Treinos · Dietas · Arena

const { useState: useEP, useMemo: useMEP, useContext: useCEP } = React;

// Demo: which empresa is "logged in" — read from localStorage or default first
function getMyEmpresa() {
  const id = localStorage.getItem("guto-empresa-id") || "emp001";
  return MOCK_EMPRESAS.find(e => e.id === id) || MOCK_EMPRESAS[0];
}

/* ── shared helpers ────────────────────────────────────────────────────── */
function EPRiskPill({ student }) {
  const r = calcRisk(student);
  const map = {
    ok:        { tone:"ok",   label:t("risk.em_dia")    },
    atencao:   { tone:"warn", label:t("risk.atencao")   },
    critico:   { tone:"bad",  label:t("risk.critico")   },
    "sem-sinal":{ tone:"mute",label:t("risk.sem_sinal") },
    pausado:   { tone:"mute", label:t("risk.pausado")   },
  };
  const { tone, label } = map[r] ?? map.pausado;
  return <Pill tone={tone} dot>{label}</Pill>;
}

function EPSubPill({ status }) {
  const map = { active:"ok", paused:"mute", overdue:"bad", cancelled:"mute", trial:"warn" };
  const labels = {
    active: t("sub.active"), paused: t("sub.paused"),
    overdue: t("sub.overdue"), cancelled: t("sub.cancelled"), trial: t("sub.trial"),
  };
  return <Pill tone={map[status]??'mute'} dot>{labels[status] ?? status}</Pill>;
}

function EPAvatar({ name, size=34 }) {
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
    <div style={{ width:size, height:size, borderRadius:999, background:p.bg, color:p.fg,
      display:"grid", placeItems:"center", fontFamily:T.ui, fontSize:size>34?13:11.5,
      fontWeight:600, flexShrink:0 }}>{initials||"?"}</div>
  );
}

function EPKpi({ icon, label, value, sub, tone="brand" }) {
  const tones = {
    brand: { iconBg:T.brandSoft, iconFg:T.brand },
    ok:    { iconBg:T.okSoft,    iconFg:T.ok    },
    warn:  { iconBg:T.warnSoft,  iconFg:T.warn  },
    bad:   { iconBg:T.badSoft,   iconFg:T.bad   },
  };
  const c = tones[tone] ?? tones.brand;
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12,
      padding:"18px 18px 16px", boxShadow:T.shadow1 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <span style={{ fontFamily:T.ui, fontSize:13, color:T.fg2, fontWeight:500 }}>{label}</span>
        <span style={{ width:30, height:30, borderRadius:8, background:c.iconBg, color:c.iconFg,
          display:"grid", placeItems:"center" }}>{icon}</span>
      </div>
      <div style={{ fontFamily:T.ui, fontSize:28, fontWeight:600, color:T.fg,
        lineHeight:1.05, letterSpacing:"-0.02em" }}>{value}</div>
      {sub && <div style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3, marginTop:6 }}>{sub}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   VISÃO GERAL
════════════════════════════════════════════════════════════════════════ */
function EPVisaoGeralScreen() {
  const ctx = useCEP(window.PanelCtx);
  const emp = getMyEmpresa();
  const myStudents = useMEP(() => studentsForEmpresa(emp.id), [emp.id]);
  const myCoaches  = useMEP(() => coachesForEmpresa(emp.id), [emp.id]);
  const ativos     = useMEP(() => myStudents.filter(s=>s.active && !s.archived), [myStudents]);
  const criticos   = useMEP(() => ativos.filter(s=>calcRisk(s)==="critico"), [ativos]);
  const emDia      = useMEP(() => ativos.filter(s=>calcRisk(s)==="ok"), [ativos]);
  const priority   = useMEP(() => ativos.filter(s=>["critico","atencao"].includes(calcRisk(s))).slice(0,6), [ativos]);

  return (
    <div style={{ padding:"28px 32px", display:"flex", flexDirection:"column", gap:24 }}>
      {/* Empresa banner */}
      <Card style={{ padding:"16px 20px",
        background:`linear-gradient(135deg,${T.brandSoft} 0%,${T.surface} 60%)`,
        border:`1px solid ${T.brandLine}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:42, height:42, borderRadius:10, background:T.surface,
            border:`1px solid ${T.brandLine}`, display:"grid", placeItems:"center",
            color:T.brand }}><IBuilding size={18}/></div>
          <div>
            <div style={{ fontFamily:T.ui, fontSize:16, fontWeight:600, color:T.fg,
              letterSpacing:"-0.01em" }}>{emp.name}</div>
            <div style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3, marginTop:2 }}>
              {emp.responsible} · {emp.country} · {t(`plan.${emp.plan}`)}
            </div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
            <Pill tone="ok" dot>{t("emp.active")}</Pill>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <EPKpi icon={<IShield size={15}/>} label={t("kpi.coaches_ativos")}
          value={myCoaches.length} sub={`${t("ep.ate")} ${emp.maxCoaches}`}/>
        <EPKpi icon={<IUsers size={15}/>}  label={t("kpi.alunos_ativos")}
          value={ativos.length} sub={`${t("ep.ate")} ${emp.maxStudents}`}/>
        <EPKpi icon={<ICheck size={15}/>}  label={t("kpi.em_dia")}
          value={emDia.length} tone="ok"/>
        <EPKpi icon={<IZap size={15}/>}    label={t("kpi.criticos")}
          value={criticos.length} sub={t("kpi.7dias")} tone={criticos.length>0?"bad":"brand"}/>
      </div>

      {/* Coaches + Priority */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:20 }}>
        <Card>
          <div style={{ padding:"16px 20px 12px", borderBottom:`1px solid ${T.borderSoft}` }}>
            <SectionHeader title={t("nav.coaches")}
              subtitle={`${myCoaches.length} ${t("th.coaches").toLowerCase()}`}
              action={<Btn ghost sm onClick={()=>ctx.setActiveScreen("coaches")}>{t("btn.ver_todos")}<IChevR size={13}/></Btn>}/>
          </div>
          {myCoaches.map((coach,i) => {
            const count = myStudents.filter(s=>s.coachId===coach.userId).length;
            return (
              <button key={coach.userId}
                onClick={()=>ctx.setActiveScreen("alunos")}
                style={{ width:"100%", display:"grid", gridTemplateColumns:"auto 1fr auto auto",
                  alignItems:"center", gap:12, padding:"12px 20px",
                  background:T.surface, border:"none",
                  borderBottom:i===myCoaches.length-1?"none":`1px solid ${T.borderSoft}`,
                  cursor:"pointer", textAlign:"left" }}
                onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
                onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
                <EPAvatar name={coach.name}/>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg }}>{coach.name}</div>
                  <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, marginTop:2 }}>{coach.email}</div>
                </div>
                <span style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3 }}>
                  <Num c={T.fg}>{count}</Num> {t("th.alunos").toLowerCase()}
                </span>
                <Pill tone={coach.active?"ok":"mute"} dot>{coach.active?t("sub.active"):t("sub.paused")}</Pill>
              </button>
            );
          })}
        </Card>

        <Card>
          <div style={{ padding:"16px 20px 12px", borderBottom:`1px solid ${T.borderSoft}` }}>
            <SectionHeader title={t("misc.alunos_atencao")}
              subtitle={`${priority.length} ${t("misc.alunos_fora_ritmo")}`}
              action={priority.length>4&&<Btn ghost sm onClick={()=>ctx.setActiveScreen("alunos")}>{t("btn.ver_todos")}<IChevR size={13}/></Btn>}/>
          </div>
          {priority.length===0 ? (
            <div style={{ padding:"48px 24px", textAlign:"center" }}>
              <div style={{ width:42, height:42, borderRadius:999, background:T.okSoft,
                display:"grid", placeItems:"center", color:T.ok, margin:"0 auto 12px" }}>
                <ICheck size={20}/></div>
              <div style={{ fontFamily:T.ui, fontSize:13.5, color:T.fg2 }}>{t("misc.todos_em_dia")}</div>
            </div>
          ) : priority.map((s,i)=>(
            <button key={s.id} onClick={()=>ctx.openStudent(s)}
              style={{ width:"100%", display:"grid",
                gridTemplateColumns:"auto 1fr auto auto auto",
                alignItems:"center", gap:12, padding:"12px 20px",
                background:T.surface, border:"none",
                borderBottom:i===priority.length-1?"none":`1px solid ${T.borderSoft}`,
                cursor:"pointer", textAlign:"left" }}
              onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
              onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
              <EPAvatar name={s.name}/>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, marginTop:2 }}>
                  {s.lastValidationAt?`${relativeTime(s.lastValidationAt)}`:"—"}
                </div>
              </div>
              <Num c={T.fg2}>{s.weeklyXp} XP</Num>
              <EPRiskPill student={s}/>
              <IChevR size={14} style={{ color:T.fg4 }}/>
            </button>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COACHES
════════════════════════════════════════════════════════════════════════ */
function EPCoachesScreen() {
  const ctx = useCEP(window.PanelCtx);
  const emp = getMyEmpresa();
  const coaches = coachesForEmpresa(emp.id);

  return (
    <div style={{ padding:"28px 32px" }}>
      <Card>
        <div style={{ display:"grid",
          gridTemplateColumns:"minmax(200px,2fr) 200px 120px 80px 100px",
          gap:14, padding:"12px 22px", borderBottom:`1px solid ${T.borderSoft}`,
          background:T.surfaceAlt, fontFamily:T.ui, fontSize:11.5,
          fontWeight:600, letterSpacing:"0.04em", color:T.fg3 }}>
          <span>{t("th.coach")}</span>
          <span>Email</span>
          <span>{t("th.alunos")}</span>
          <span>{t("th.status")}</span>
          <span style={{ textAlign:"right" }}>{t("th.acoes")}</span>
        </div>
        {coaches.map((coach,i) => {
          const count = studentsForEmpresa(emp.id).filter(s=>s.coachId===coach.userId).length;
          return (
            <div key={coach.userId} style={{ display:"grid",
              gridTemplateColumns:"minmax(200px,2fr) 200px 120px 80px 100px",
              alignItems:"center", gap:14, padding:"14px 22px",
              borderBottom:i===coaches.length-1?"none":`1px solid ${T.borderSoft}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
                <EPAvatar name={coach.name}/>
                <span style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg }}>
                  {coach.name}
                </span>
              </div>
              <span style={{ fontFamily:T.ui, fontSize:13, color:T.fg3,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {coach.email}
              </span>
              <span><Num c={T.fg}>{count}</Num></span>
              <Pill tone={coach.active?"ok":"mute"} dot>
                {coach.active?t("sub.active"):t("sub.paused")}
              </Pill>
              <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
                <Btn ghost sm onClick={()=>ctx.setActiveScreen("alunos")}>
                  {t("th.alunos")} <IChevR size={13}/>
                </Btn>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ALUNOS (empresa-scoped)
════════════════════════════════════════════════════════════════════════ */
function EPAlunosScreen() {
  const ctx = useCEP(window.PanelCtx);
  const emp = getMyEmpresa();
  const [search, setSearch] = useEP("");
  const [coachF, setCoachF] = useEP("");
  const allStudents = studentsForEmpresa(emp.id);
  const coaches = coachesForEmpresa(emp.id);

  const list = useMEP(() => {
    let s = [...allStudents];
    if (coachF) s = s.filter(x=>x.coachId===coachF);
    if (search) {
      const q = search.toLowerCase();
      s = s.filter(x=>x.name.toLowerCase().includes(q)||x.email.toLowerCase().includes(q));
    }
    return s;
  }, [allStudents, search, coachF]);

  return (
    <div style={{ padding:"28px 32px" }}>
      <Card>
        <div style={{ display:"flex", gap:8, padding:"12px 14px",
          borderBottom:`1px solid ${T.borderSoft}`, flexWrap:"wrap", alignItems:"center" }}>
          <SearchBox value={search} onChange={setSearch} placeholder={t("search.aluno")}/>
          <SelectInput value={coachF} onChange={setCoachF} style={{ height:32, fontSize:13 }}>
            <option value="">{t("filter.todos")} coaches</option>
            {coaches.map(c=><option key={c.userId} value={c.userId}>{c.name}</option>)}
          </SelectInput>
        </div>
        <div style={{ display:"grid",
          gridTemplateColumns:"minmax(200px,2fr) 110px 130px 80px 90px 100px 32px",
          gap:14, padding:"12px 22px", borderBottom:`1px solid ${T.borderSoft}`,
          background:T.surfaceAlt, fontFamily:T.ui, fontSize:11.5,
          fontWeight:600, letterSpacing:"0.04em", color:T.fg3 }}>
          <span>{t("th.aluno")}</span>
          <span>{t("th.status")}</span>
          <span>{t("th.coach")}</span>
          <span>{t("th.xp_sem")}</span>
          <span>{t("th.ultima_ativ")}</span>
          <span>{t("th.assinatura")}</span>
          <span></span>
        </div>
        {list.map((s,i) => (
          <button key={s.id} onClick={()=>ctx.openStudent(s)}
            style={{ width:"100%", display:"grid",
              gridTemplateColumns:"minmax(200px,2fr) 110px 130px 80px 90px 100px 32px",
              alignItems:"center", gap:14, padding:"12px 22px", background:T.surface,
              border:"none", borderBottom:i===list.length-1?"none":`1px solid ${T.borderSoft}`,
              cursor:"pointer", textAlign:"left", transition:"background 120ms ease" }}
            onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
            onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
            <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
              <EPAvatar name={s.name}/>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, marginTop:2,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.email}</div>
              </div>
            </div>
            <EPRiskPill student={s}/>
            <span style={{ fontFamily:T.ui, fontSize:13, color:T.fg2,
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {coachName(s.coachId)}
            </span>
            <Num c={T.fg}>{s.weeklyXp}</Num>
            <span style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3 }}>
              {relativeTime(s.lastValidationAt)}
            </span>
            <EPSubPill status={s.subscriptionStatus}/>
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
   TREINOS / DIETAS (empresa-scoped queue)
════════════════════════════════════════════════════════════════════════ */
function EPQueueScreen({ mode }) {
  const ctx = useCEP(window.PanelCtx);
  const emp = getMyEmpresa();
  const [qf, setQf] = useEP("todos");
  const myStudents = studentsForEmpresa(emp.id).filter(s=>s.active && !s.archived);
  const sorted = useMEP(() => {
    const order = { critico:0, atencao:1, "sem-sinal":2, ok:3 };
    const list = qf==="todos" ? myStudents : myStudents.filter(s=>calcRisk(s)===qf);
    return [...list].sort((a,b)=>(order[calcRisk(a)]??9)-(order[calcRisk(b)]??9));
  }, [myStudents, qf]);
  const counts = useMEP(() => ({
    critico:   myStudents.filter(s=>calcRisk(s)==="critico").length,
    atencao:   myStudents.filter(s=>calcRisk(s)==="atencao").length,
    "sem-sinal":myStudents.filter(s=>calcRisk(s)==="sem-sinal").length,
  }), [myStudents]);
  const FILT = [
    { id:"todos",     label:t("filter.todos"),     count:myStudents.length },
    { id:"critico",   label:t("filter.criticos"),  count:counts.critico },
    { id:"atencao",   label:t("filter.atencao"),   count:counts.atencao },
    { id:"sem-sinal", label:t("filter.sem_sinal"), count:counts["sem-sinal"] },
  ];
  const actionLabel = mode==="treino" ? t("btn.editar_treino") : t("btn.editar_dieta");
  const tab = mode;

  return (
    <div style={{ padding:"28px 32px", display:"flex", flexDirection:"column", gap:14 }}>
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
              <span style={{
                fontFamily:T.ui, fontSize:11.5,
                color: qf===f.id ? T.brand : T.fg4,
                background: qf===f.id ? T.surface : T.muteSoft,
                borderRadius:999, padding:"1px 7px",
              }}>{f.count}</span>
            </button>
          ))}
        </div>
        {sorted.map((s,i)=>(
          <button key={s.id} onClick={()=>ctx.openStudent(s, tab)}
            style={{ width:"100%", display:"grid",
              gridTemplateColumns:"auto 1fr auto auto",
              alignItems:"center", gap:14, padding:"14px 22px",
              background:T.surface, border:"none",
              borderBottom:i===sorted.length-1?"none":`1px solid ${T.borderSoft}`,
              cursor:"pointer", textAlign:"left", transition:"background 120ms ease" }}
            onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
            onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
            <EPAvatar name={s.name}/>
            <div style={{ minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:2 }}>
                <span style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg }}>{s.name}</span>
                <EPRiskPill student={s}/>
              </div>
              <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3 }}>
                {coachName(s.coachId)}
              </div>
            </div>
            <Num c={T.fg2}>{mode==="treino"?s.weeklyXp:s.monthlyXp} XP</Num>
            <Btn ghost sm>{actionLabel}<IChevR size={13}/></Btn>
          </button>
        ))}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ARENA (empresa-scoped)
   · Semanal + Mensal → alunos da empresa
   · Geral → todos os alunos do sistema
════════════════════════════════════════════════════════════════════════ */
function EPArenaScreen() {
  const emp = getMyEmpresa();
  const myStudents  = studentsForEmpresa(emp.id);
  const allStudents = MOCK_STUDENTS;

  const weeklyRanked  = useMEP(() =>
    [...myStudents].sort((a,b)=>b.weeklyXp-a.weeklyXp).map((s,i)=>({ ...s, pos:i+1 }))
  , [myStudents]);
  const monthlyRanked = useMEP(() =>
    [...myStudents].sort((a,b)=>b.monthlyXp-a.monthlyXp).map((s,i)=>({ ...s, pos:i+1 }))
  , [myStudents]);
  const geralRanked   = useMEP(() =>
    [...allStudents].sort((a,b)=>b.totalXp-a.totalXp).map((s,i)=>({ ...s, pos:i+1 }))
  , [allStudents]);

  function RankCol({ title, subtitle, items, xpKey, coachCol=false }) {
    return (
      <Card>
        <div style={{ padding:"16px 20px 12px", borderBottom:`1px solid ${T.borderSoft}` }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
            <div style={{ fontFamily:T.ui, fontSize:14, fontWeight:600, color:T.fg }}>{title}</div>
            {subtitle && <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg4 }}>{subtitle}</div>}
          </div>
        </div>
        {items.map((s,i)=>{
          const medal   = s.pos===1?"#FEF3C7":s.pos===2?"#E2E8F0":s.pos===3?"#FED7AA":T.muteSoft;
          const medalFg = s.pos===1?"#A16207":s.pos===2?"#475569":s.pos===3?"#C2410C":T.fg3;
          return (
            <div key={s.id} style={{
              display:"grid",
              gridTemplateColumns: coachCol ? "28px auto 1fr 120px auto" : "28px auto 1fr auto",
              alignItems:"center", gap:12, padding:"12px 20px",
              borderBottom:i===items.length-1?"none":`1px solid ${T.borderSoft}` }}>
              <span style={{ width:24, height:24, borderRadius:999, background:medal, color:medalFg,
                display:"grid", placeItems:"center", fontFamily:T.ui, fontSize:11.5, fontWeight:700 }}>
                {s.pos}
              </span>
              <EPAvatar name={s.name} size={28}/>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:T.ui, fontSize:13, fontWeight:500, color:T.fg,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                <div style={{ fontFamily:T.ui, fontSize:11, color:T.fg4 }}>
                  {s.currentStreak ? `${s.currentStreak} ${t("rank.streak")}` : t(`avatar.${s.avatarStage}`).toLowerCase()}
                </div>
              </div>
              {coachCol && (
                <span style={{ fontFamily:T.ui, fontSize:12, color:T.fg3,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                  {coachName(s.coachId)}
                </span>
              )}
              <Num style={{ fontSize:14, fontWeight:600 }}>{s[xpKey].toLocaleString("pt-BR")}</Num>
            </div>
          );
        })}
      </Card>
    );
  }

  return (
    <div style={{ padding:"28px 32px", display:"flex", flexDirection:"column", gap:16 }}>
      {/* Semanal + Mensal lado a lado — alunos da empresa */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <RankCol title={t("rank.semanal")} subtitle={emp.name} items={weeklyRanked}  xpKey="weeklyXp"/>
        <RankCol title={t("rank.mensal")}  subtitle={emp.name} items={monthlyRanked} xpKey="monthlyXp"/>
      </div>
      {/* Geral — todos os alunos do sistema */}
      <RankCol title={t("rank.geral")} subtitle={t("rank.todos_alunos")} items={geralRanked} xpKey="totalXp" coachCol={true}/>
    </div>
  );
}

/* ── Router ──────────────────────────────────────────────────────────── */
function EPActiveScreen() {
  const ctx = useCEP(window.PanelCtx);
  switch(ctx.activeScreen) {
    case "visao_geral": return <EPVisaoGeralScreen/>;
    case "coaches":     return <EPCoachesScreen/>;
    case "alunos":      return <EPAlunosScreen/>;
    case "treinos":     return <EPQueueScreen mode="treino"/>;
    case "dietas":      return <EPQueueScreen mode="dieta"/>;
    case "arena":       return <EPArenaScreen/>;
    default:            return <EPVisaoGeralScreen/>;
  }
}

Object.assign(window, { EPActiveScreen, EPRiskPill, EPSubPill, EPAvatar });
