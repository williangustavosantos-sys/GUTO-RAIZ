// GUTO Sala de Controle — Light theme: Empresa drawer + Student drawer + Create modals

const { useState: useStE, useContext: useCtxE } = React;

/* ── Drawer shell ────────────────────────────────────────────────────────── */
function DrawerShell({ children, onClose, width=900, zBase=60 }) {
  return (
    <>
      <div onClick={onClose} style={{
        position:"fixed", inset:0, background:"rgba(15,23,42,0.32)",
        zIndex:zBase, animation:"fadeIn 200ms ease",
      }}/>
      <aside style={{
        position:"fixed", top:0, right:0, bottom:0,
        width:`min(${width}px, 96vw)`,
        background:T.bg,
        borderLeft:`1px solid ${T.border}`,
        boxShadow:T.shadowFloat,
        zIndex:zBase+1, display:"flex", flexDirection:"column",
        animation:"slideInRight 220ms cubic-bezier(0.16,1,0.3,1)",
      }}>{children}</aside>
    </>
  );
}

/* ── EMPRESA DRAWER ──────────────────────────────────────────────────────── */
const EMP_TABS = [
  { id:"resumo",   label:"Resumo",  Icon:()=><IBuilding size={14}/> },
  { id:"coaches",  label:"Coaches", Icon:()=><IShield size={14}/>   },
  { id:"alunos",   label:"Alunos",  Icon:()=><IUsers size={14}/>    },
  { id:"plano",    label:"Plano",   Icon:()=><ILock size={14}/>     },
  { id:"logs",     label:"Logs",    Icon:()=><ILog size={14}/>      },
];

function EmpResumo({ emp }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
      <Card padded style={{ gridColumn:"1 / -1" }}>
        <SectionHeader title="Visão geral"
          action={<Pill tone={mapEmpTone(emp.status)} dot>{empresaStatusPrettyLabel(emp.status)}</Pill>}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginTop:6 }}>
          <Mini label="Plano" value={planPretty(emp.plan)}/>
          <Mini label="País"  value={emp.country}/>
          <Mini label="Criada em"        value={emp.createdAt}/>
          <Mini label="Última atividade" value={relativeTime(emp.lastActivityAt)}/>
        </div>
      </Card>

      <Card padded>
        <SectionHeader title="Uso atual"/>
        <div style={{ display:"flex", flexDirection:"column", gap:16, marginTop:4 }}>
          <UsageRow label="Alunos ativos"  value={emp.usage.students} max={emp.maxStudents}/>
          <UsageRow label="Coaches ativos" value={emp.usage.coaches}  max={emp.maxCoaches}/>
        </div>
      </Card>

      <Card padded>
        <SectionHeader title="Responsável"/>
        <DataRow label="Nome"   value={emp.responsible}/>
        <DataRow label="E-mail" value={emp.email}/>
        <DataRow label="País"   value={emp.country}/>
      </Card>

      <Card padded style={{ gridColumn:"1 / -1" }}>
        <SectionHeader title="Ações" subtitle="Apenas o super admin pode executar."/>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
          <Btn primary sm><ISave size={13}/>Editar empresa</Btn>
          {emp.status === "paused" || emp.status === "overdue"
            ? <Btn sm><IPlay size={13}/>Ativar</Btn>
            : <Btn sm><IPause size={13}/>Pausar</Btn>}
          <Btn sm><IBolt size={13}/>Forçar sincronização</Btn>
          <Btn sm><ICopy size={13}/>Copiar ID</Btn>
          <div style={{ flex:1 }}/>
          <Btn danger sm><ITrash size={13}/>Arquivar</Btn>
        </div>
      </Card>
    </div>
  );
}

function UsageRow({ label, value, max }) {
  const pct = Math.min(100, max ? (value/max)*100 : 0);
  const tone = pct >= 95 ? T.bad : pct >= 80 ? T.warn : T.brand;
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontFamily:T.ui, fontSize:13, color:T.fg2 }}>{label}</span>
        <span><Num c={T.fg}>{value}</Num> <span style={{ fontFamily:T.ui, fontSize:12, color:T.fg4 }}>/ {max}</span></span>
      </div>
      <div style={{ height:6, background:T.muteSoft, borderRadius:99, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:tone, transition:"width 200ms" }}/>
      </div>
    </div>
  );
}

function EmpAlunos({ emp }) {
  const ctx = useCtxE(window.PanelCtx);
  const list = studentsForEmpresa(emp.id);
  return (
    <Card>
      <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.borderSoft}`,
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <SectionHeader style={{ marginBottom:0 }}
          title={`${list.length} aluno${list.length===1?"":"s"} vinculado${list.length===1?"":"s"}`}
          action={
            <div style={{ display:"flex", gap:6 }}>
              <Btn sm><IShield size={13}/>Vincular coach</Btn>
              <Btn primary sm onClick={()=>ctx.setShowCreate({ kind:"aluno", empId:emp.id })}><IPlus size={13}/>Aluno</Btn>
            </div>
          }/>
      </div>
      {list.map((s,i) => (
        <button key={s.id} onClick={()=>ctx.openStudent(s)}
          style={{
            width:"100%",
            display:"grid", gridTemplateColumns:"auto 1fr auto auto auto auto",
            alignItems:"center", gap:12, padding:"12px 18px",
            background:T.surface, border:"none",
            borderBottom: i===list.length-1 ? "none" : `1px solid ${T.borderSoft}`,
            cursor:"pointer", textAlign:"left",
            transition:"background 120ms ease",
          }}
          onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
          onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
          <Avatar name={s.name}/>
          <div style={{ minWidth:0 }}>
            <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg }}>{s.name}</div>
            <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, marginTop:2 }}>{coachName(s.coachId)}</div>
          </div>
          <RiskPill student={s}/>
          <Num c={T.fg2}>{s.weeklyXp} XP</Num>
          <SubPill status={s.subscriptionStatus}/>
          <IChevR size={14} style={{ color:T.fg4 }}/>
        </button>
      ))}
      {!list.length && (
        <div style={{ padding:"48px 24px", textAlign:"center" }}>
          <div style={{ fontFamily:T.ui, fontSize:13.5, color:T.fg3 }}>
            Nenhum aluno vinculado a esta empresa ainda.
          </div>
        </div>
      )}
    </Card>
  );
}

function EmpCoaches({ emp }) {
  const ctx = useCtxE(window.PanelCtx);
  const list = coachesForEmpresa(emp.id);
  const [selectedCoach, setSelectedCoach] = useStE(null);

  // If a coach is selected, show their students
  if (selectedCoach) {
    const students = MOCK_STUDENTS.filter(s => s.coachId === selectedCoach.userId);
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {/* Back breadcrumb */}
        <button onClick={()=>setSelectedCoach(null)} style={{
          display:"inline-flex", alignItems:"center", gap:8,
          background:"none", border:"none", cursor:"pointer",
          fontFamily:T.ui, fontSize:13, fontWeight:500, color:T.brand,
          padding:"4px 0",
        }}>
          <IChevL size={15}/> Coaches
        </button>

        {/* Coach identity card */}
        <Card style={{ padding:"16px 20px",
          background:`linear-gradient(135deg,${T.brandSoft} 0%,${T.surface} 60%)`,
          border:`1px solid ${T.brandLine}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <Avatar name={selectedCoach.name} size={42}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:T.ui, fontSize:16, fontWeight:600, color:T.fg,
                letterSpacing:"-0.01em" }}>{selectedCoach.name}</div>
              <div style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3, marginTop:2 }}>
                {selectedCoach.email}
              </div>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <Pill tone={selectedCoach.active?"ok":"mute"} dot>
                {selectedCoach.active?"Ativo":"Pausado"}
              </Pill>
              <div style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3 }}>
                <Num c={T.fg}>{students.length}</Num> alunos
              </div>
            </div>
          </div>
        </Card>

        {/* Students of this coach */}
        <Card>
          <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.borderSoft}` }}>
            <SectionHeader style={{ marginBottom:0 }}
              title={`Alunos de ${selectedCoach.name}`}
              subtitle={`${students.length} aluno${students.length===1?"":"s"} atribuído${students.length===1?"":"s"}`}/>
          </div>
          {students.map((s,i) => (
            <button key={s.id} onClick={()=>ctx.openStudent(s)}
              style={{
                width:"100%",
                display:"grid", gridTemplateColumns:"auto 1fr auto auto auto auto",
                alignItems:"center", gap:12, padding:"12px 18px",
                background:T.surface, border:"none",
                borderBottom: i===students.length-1 ? "none" : `1px solid ${T.borderSoft}`,
                cursor:"pointer", textAlign:"left",
                transition:"background 120ms ease",
              }}
              onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
              onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
              <Avatar name={s.name}/>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, marginTop:2,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.email}</div>
              </div>
              <RiskPill student={s}/>
              <Num c={T.fg2}>{s.weeklyXp} XP</Num>
              <SubPill status={s.subscriptionStatus}/>
              <IChevR size={14} style={{ color:T.fg4 }}/>
            </button>
          ))}
          {!students.length && (
            <div style={{ padding:"48px 24px", textAlign:"center" }}>
              <div style={{ fontFamily:T.ui, fontSize:13.5, color:T.fg3 }}>
                Nenhum aluno atribuído a este coach.
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Default: list of coaches
  return (
    <Card>
      <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.borderSoft}` }}>
        <SectionHeader style={{ marginBottom:0 }}
          title={`${list.length} coach${list.length===1?"":"es"} vinculado${list.length===1?"":"s"}`}
          action={<Btn primary sm onClick={()=>ctx.setShowCreate({ kind:"coach", empId:emp.id })}><IPlus size={13}/>Coach</Btn>}/>
      </div>
      {list.map((c,i) => {
        const studentsCount = MOCK_STUDENTS.filter(s => s.coachId === c.userId).length;
        return (
          <button key={c.userId}
            onClick={()=>setSelectedCoach(c)}
            style={{
              width:"100%",
              display:"grid", gridTemplateColumns:"auto 1fr auto auto auto auto",
              alignItems:"center", gap:12, padding:"14px 18px",
              background:T.surface, border:"none",
              borderBottom: i===list.length-1 ? "none" : `1px solid ${T.borderSoft}`,
              cursor:"pointer", textAlign:"left",
              transition:"background 120ms ease",
            }}
            onMouseEnter={ev=>ev.currentTarget.style.background=T.surfaceHover}
            onMouseLeave={ev=>ev.currentTarget.style.background=T.surface}>
            <Avatar name={c.name}/>
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg }}>{c.name}</div>
              <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, marginTop:2,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.email}</div>
            </div>
            <span style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3, whiteSpace:"nowrap" }}>
              <Num c={T.fg}>{studentsCount}</Num> alunos
            </span>
            <Pill tone={c.active ? "ok" : "mute"} dot>{c.active ? "Ativo" : "Pausado"}</Pill>
            {/* Ver alunos CTA */}
            <div style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"6px 12px", borderRadius:8,
              background:T.brandSoft, color:T.brand,
              border:`1px solid ${T.brandLine}`,
              fontFamily:T.ui, fontSize:12.5, fontWeight:600,
            }}>
              Ver alunos <IChevR size={13}/>
            </div>
            <span/>{/* spacer */}
          </button>
        );
      })}
      {!list.length && (
        <div style={{ padding:"48px 24px", textAlign:"center" }}>
          <div style={{ fontFamily:T.ui, fontSize:13.5, color:T.fg3 }}>
            Nenhum coach vinculado a esta empresa ainda.
          </div>
        </div>
      )}
    </Card>
  );
}

function EmpPlano({ emp }) {
  const PLANS = [
    { id:"start",  name:"Start",  pStudents:25, pCoaches:2, price:"R$ 99/mês"  },
    { id:"pro",    name:"Pro",    pStudents:60, pCoaches:5, price:"R$ 299/mês" },
    { id:"custom", name:"Custom", pStudents:"∞", pCoaches:"∞", price:"sob consulta" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Card padded>
        <SectionHeader title="Plano atual"/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:6 }}>
          {PLANS.map(p => {
            const active = p.id === emp.plan;
            return (
              <div key={p.id} style={{
                padding:"14px", borderRadius:10,
                background: active ? T.brandSoft : T.surfaceAlt,
                border: active ? `1px solid ${T.brandLine}` : `1px solid ${T.borderSoft}`,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <span style={{ fontFamily:T.ui, fontSize:14, fontWeight:600,
                    color: active ? T.brandDeep : T.fg }}>{p.name}</span>
                  {active && <Pill tone="brand">Em uso</Pill>}
                </div>
                <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg2, marginBottom:8 }}>{p.price}</div>
                <div style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3, lineHeight:1.55 }}>
                  até {p.pStudents} alunos<br/>até {p.pCoaches} coaches
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card padded>
        <SectionHeader title="Limites operacionais"/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Field label="Limite de alunos">
            <TextInput value={emp.maxStudents} onChange={()=>{}}/>
          </Field>
          <Field label="Limite de coaches">
            <TextInput value={emp.maxCoaches} onChange={()=>{}}/>
          </Field>
        </div>
      </Card>

      <Card padded>
        <SectionHeader title="Acesso"
          subtitle="No MVP a empresa é uma entidade operacional — não tem login próprio. O super admin controla."/>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
          <Btn sm><ICopy size={13}/>Copiar ID ({emp.id})</Btn>
          {emp.status === "paused" || emp.status === "overdue"
            ? <Btn primary sm><IPlay size={13}/>Reativar empresa</Btn>
            : <Btn sm><IPause size={13}/>Pausar empresa</Btn>}
        </div>
      </Card>
    </div>
  );
}

function EmpLogs({ emp }) {
  const items = MOCK_LOGS.slice(0, 6);
  return (
    <Card>
      <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.borderSoft}` }}>
        <SectionHeader style={{ marginBottom:0 }} title="Eventos desta empresa"/>
      </div>
      {items.map((log,i)=>(
        <div key={log.id} style={{
          padding:"12px 18px",
          borderBottom: i===items.length-1 ? "none" : `1px solid ${T.borderSoft}`,
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", gap:12 }}>
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:T.ui, fontSize:13.5, fontWeight:500, color:T.fg, marginBottom:2 }}>
                {prettyAction(log.action)}
              </div>
              <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg3 }}>
                {log.actorRole} · <span style={{ fontFamily:T.mono, fontSize:11.5 }}>{log.actorUserId}</span>
              </div>
            </div>
            <span style={{ fontFamily:T.ui, fontSize:12, color:T.fg3, whiteSpace:"nowrap" }}>
              {new Date(log.timestamp).toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
      ))}
    </Card>
  );
}

function EmpresaDrawer() {
  const ctx = useCtxE(window.PanelCtx);
  const [tab, setTab] = useStE("resumo");
  if (!ctx.empresa) return null;
  const e = ctx.empresa;

  return (
    <DrawerShell onClose={ctx.closeEmpresa}>
      {/* Title bar */}
      <div style={{
        padding:"18px 28px", borderBottom:`1px solid ${T.border}`,
        background:T.surface,
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:18,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, minWidth:0 }}>
          <div style={{
            width:42, height:42, borderRadius:10,
            background:T.brandSoft, color:T.brand,
            display:"grid", placeItems:"center", flexShrink:0,
            border:`1px solid ${T.brandLine}`,
          }}><IBuilding size={18}/></div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontFamily:T.ui, fontSize:11.5, fontWeight:500, color:T.fg4, letterSpacing:"0.04em" }}>
              Empresa · <span style={{ fontFamily:T.mono, fontSize:11 }}>{e.id}</span>
            </div>
            <div style={{ fontFamily:T.ui, fontSize:20, fontWeight:600, color:T.fg, letterSpacing:"-0.015em", marginTop:2 }}>
              {e.name}
            </div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <Pill tone={mapEmpTone(e.status)} dot>{empresaStatusPrettyLabel(e.status)}</Pill>
          <Pill tone="mute">{planPretty(e.plan)}</Pill>
          <button onClick={ctx.closeEmpresa} style={iconBtn()}><IX size={15}/></button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display:"flex", padding:"0 28px",
        borderBottom:`1px solid ${T.border}`,
        background:T.surface, gap:0,
      }}>
        {EMP_TABS.map(({ id, label, Icon })=>{
          const active = tab===id;
          return (
            <button key={id} onClick={()=>setTab(id)} style={{
              background:"none", border:"none", cursor:"pointer",
              padding:"12px 14px", color: active ? T.brandDeep : T.fg3,
              fontFamily:T.ui, fontSize:13, fontWeight: active ? 600 : 500,
              borderBottom: active ? `2px solid ${T.brandStrong}` : "2px solid transparent",
              marginBottom:-1, display:"flex", alignItems:"center", gap:7,
            }}><Icon/>{label}</button>
          );
        })}
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"22px 28px" }}>
        {tab==="resumo"  && <EmpResumo emp={e}/>}
        {tab==="alunos"  && <EmpAlunos emp={e}/>}
        {tab==="coaches" && <EmpCoaches emp={e}/>}
        {tab==="plano"   && <EmpPlano emp={e}/>}
        {tab==="logs"    && <EmpLogs emp={e}/>}
      </div>
    </DrawerShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STUDENT DRAWER
══════════════════════════════════════════════════════════════════════════ */
const DETAIL_TABS = [
  { id:"resumo",      label:"Resumo",     Icon: ()=><IUser size={14}/>     },
  { id:"calibragem",  label:"Calibragem", Icon: ()=><ICalib size={14}/>    },
  { id:"treino",      label:"Treino",     Icon: ()=><IDumbbell size={14}/> },
  { id:"dieta",       label:"Dieta",      Icon: ()=><IFork size={14}/>     },
  { id:"historico",   label:"Histórico",  Icon: ()=><IHist size={14}/>     },
  { id:"acesso",      label:"Acesso",     Icon: ()=><ILock size={14}/>     },
];

function StuResumo({ student }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
      <Card padded>
        <SectionHeader title="Perfil"/>
        <DataRow label="Status"        value={<SubPill status={student.subscriptionStatus}/>}/>
        <DataRow label="Email"         value={student.email}/>
        <DataRow label="Telefone"      value={student.phone}/>
        <DataRow label="Sexo / Idade"  value={`${student.sex === "M" ? "Masc." : "Fem."} · ${student.age} anos`}/>
        <DataRow label="Coach"         value={coachName(student.coachId)}/>
        <DataRow label="Arena"         value={student.visibleInArena ? "Visível" : "Oculto"}/>
        <DataRow label="Plano expira"  value={formatDate(student.subscriptionEndsAt)}/>
      </Card>
      <Card padded>
        <SectionHeader title="Evolução"/>
        <DataRow label="XP semanal"   value={<Num c={T.brand} style={{ fontWeight:600 }}>{student.weeklyXp} XP</Num>}/>
        <DataRow label="XP mensal"    value={<Num>{student.monthlyXp} XP</Num>}/>
        <DataRow label="XP total"     value={<Num>{student.totalXp.toLocaleString("pt-BR")} XP</Num>}/>
        <DataRow label="Sequência"    value={<Num>{student.currentStreak} dias</Num>}/>
        <DataRow label="Validações"   value={<Num>{student.validationsTotal}</Num>}/>
        <DataRow label="Avatar"       value={<Pill tone="brand">{(avatarLabel(student.avatarStage)||"").toLowerCase().replace(/^./,c=>c.toUpperCase())}</Pill>}/>
      </Card>

      <Card padded style={{ gridColumn:"1 / -1" }}>
        <SectionHeader title="Reset Arena / XP" subtitle="Ações irreversíveis. Use com cuidado."/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginTop:6 }}>
          {["Resetar semana","Resetar mês","Resetar XP total","Resetar validações"].map(label=>(
            <Btn key={label} danger sm onClick={()=>{}}>{label}</Btn>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StuCalibragem({ student }) {
  const c = {
    objetivo:"Hipertrofia", local:"Academia completa",
    diasSemana:4, peso:"82 kg", altura:"178 cm",
    experiencia:"Intermediário", lesoes:"Nenhuma",
    dieta:"Ganho de massa", restricoes:"Lactose",
  };
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
      <Card padded>
        <SectionHeader title="Corpo"/>
        <DataRow label="Peso atual"   value={c.peso}/>
        <DataRow label="Altura"       value={c.altura}/>
        <DataRow label="Experiência"  value={c.experiencia}/>
        <DataRow label="Lesões"       value={c.lesoes}/>
      </Card>
      <Card padded>
        <SectionHeader title="Treino"/>
        <DataRow label="Objetivo"      value={c.objetivo}/>
        <DataRow label="Local"         value={c.local}/>
        <DataRow label="Dias / semana" value={`${c.diasSemana}x`}/>
      </Card>
      <Card padded>
        <SectionHeader title="Dieta"/>
        <DataRow label="Protocolo"    value={c.dieta}/>
        <DataRow label="Restrições"   value={c.restricoes}/>
      </Card>
      <Card padded style={{ display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", gap:12 }}>
        <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg3, textAlign:"center", maxWidth:240 }}>
          Dados coletados no onboarding e atualizados via chat com o GUTO.
        </div>
        <Btn sm><ISave size={13}/>Editar calibragem</Btn>
      </Card>
    </div>
  );
}

function StuTreino({ student }) {
  const [subtab, setSubtab] = useStE("oficial");
  const mock = {
    title:"Peito + Tríceps", focus:"Hipertrofia", source:"coach_manual",
    locked:false, location:"Academia", day:"Terça-feira",
    duration:60, difficulty:"Intermediário",
    exercises:[
      { id:1, name:"Supino reto com barra",       sets:4, reps:"8-10", load:"80 kg", rest:"90s", obs:"" },
      { id:2, name:"Crucifixo inclinado",          sets:3, reps:"12",   load:"20 kg", rest:"60s", obs:"" },
      { id:3, name:"Supino inclinado halteres",    sets:3, reps:"10",   load:"28 kg", rest:"75s", obs:"" },
      { id:4, name:"Tríceps testa",                sets:3, reps:"12",   load:"30 kg", rest:"60s", obs:"" },
      { id:5, name:"Mergulho no paralelo",         sets:3, reps:"15",   load:"corpo", rest:"60s", obs:"Pegada neutra" },
    ],
  };
  const [workout, setWorkout] = useStE(mock);
  const [editingId, setEditingId] = useStE(null); // which exercise row is being edited
  const [addingEx, setAddingEx] = useStE(false);
  const [newEx, setNewEx] = useStE({ name:"", sets:"3", reps:"12", load:"", rest:"60s", obs:"" });
  const [saved, setSaved] = useStE(false);
  const [generating, setGenerating] = useStE(false);
  const [gutoSuggestion, setGutoSuggestion] = useStE(null);

  function updateEx(id, field, val) {
    setWorkout(w => ({ ...w, exercises: w.exercises.map(e => e.id===id ? {...e, [field]:val} : e) }));
  }
  function deleteEx(id) {
    setWorkout(w => ({ ...w, exercises: w.exercises.filter(e => e.id!==id) }));
    if (editingId===id) setEditingId(null);
  }
  function moveEx(id, dir) {
    setWorkout(w => {
      const arr = [...w.exercises];
      const i = arr.findIndex(e=>e.id===id);
      const j = i + dir;
      if (j<0 || j>=arr.length) return w;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...w, exercises: arr };
    });
  }
  function addEx() {
    if (!newEx.name.trim()) return;
    setWorkout(w => ({
      ...w,
      exercises: [...w.exercises, { ...newEx, id: Date.now(), sets:Number(newEx.sets)||3 }],
    }));
    setNewEx({ name:"", sets:"3", reps:"12", load:"", rest:"60s" });
    setAddingEx(false);
  }
  function saveWorkout() {
    setSaved(true);
    setTimeout(()=>setSaved(false), 2500);
  }
  async function generateWithGuto() {
    setGenerating(true);
    setGutoSuggestion(null);
    try {
      const prompt = `Você é um coach de academia. Sugira um treino de hipertrofia para o aluno com os seguintes dados: objetivo: ${workout.focus}, local: ${workout.location}, duração: ${workout.duration} minutos. Retorne APENAS um JSON com a estrutura: {"title": "Nome do Treino", "exercises": [{"name": "Nome", "sets": 4, "reps": "8-12", "load": "estimativa", "rest": "60s"}]}. Máximo 6 exercícios.`;
      const resp = await window.claude.complete(prompt);
      const jsonMatch = resp.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        if (data.exercises) {
          setGutoSuggestion(data);
        }
      }
    } catch(e) {}
    setGenerating(false);
  }
  function applySuggestion() {
    if (!gutoSuggestion) return;
    setWorkout(w => ({
      ...w,
      title: gutoSuggestion.title || w.title,
      exercises: gutoSuggestion.exercises.map((e,i) => ({ ...e, id: Date.now()+i })),
    }));
    setGutoSuggestion(null);
  }

  const [generatingWeek, setGeneratingWeek] = useStE(false);
  const [gutoWeekSuggestion, setGutoWeekSuggestion] = useStE(null);

  async function generateWeekWithGuto() {
    setGeneratingWeek(true);
    setGutoWeekSuggestion(null);
    try {
      const prompt = `Você é um coach de academia. Crie um plano de treino semanal de hipertrofia para um aluno intermediário. Retorne APENAS um JSON com a estrutura: {"days":[{"day":"Seg","title":"Peito + Tríceps","exercises":[{"name":"Supino reto","sets":4,"reps":"8-10","load":"80 kg","rest":"90s"}]}]}. Inclua 4-5 dias de treino e 2-3 de descanso (exercises vazio). Máximo 6 exercícios por dia.`;
      const resp = await window.claude.complete(prompt);
      const jsonMatch = resp.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        if (data.days) setGutoWeekSuggestion(data);
      }
    } catch(e) {}
    setGeneratingWeek(false);
  }

  function applyWeekSuggestion() {
    if (!gutoWeekSuggestion) return;
    const DAYS = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
    const LABELS = ["Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado","Domingo"];
    const newPlan = DAYS.map((d, i) => {
      const found = gutoWeekSuggestion.days.find(dd=>dd.day===d) || { title:"", exercises:[] };
      return {
        day:d, label:LABELS[i],
        title: found.title || "",
        exercises: (found.exercises||[]).map((e,j)=>({ ...e, id:Date.now()+i*100+j })),
      };
    });
    setWeekPlan(newPlan);
    setGutoWeekSuggestion(null);
  }

  const WEEK_INIT = [
    { day:"Seg", label:"Segunda-feira", title:"Peito + Tríceps",  exercises:[
      {id:1001,name:"Supino reto com barra",    sets:4,reps:"8-10",load:"80 kg",rest:"90s"},
      {id:1002,name:"Crucifixo inclinado",      sets:3,reps:"12",  load:"20 kg",rest:"60s"},
      {id:1003,name:"Supino inclinado halteres",sets:3,reps:"10",  load:"28 kg",rest:"75s"},
      {id:1004,name:"Tríceps testa",            sets:3,reps:"12",  load:"30 kg",rest:"60s"},
      {id:1005,name:"Mergulho no paralelo",     sets:3,reps:"15",  load:"corpo",rest:"60s"},
    ]},
    { day:"Ter", label:"Terça-feira",   title:"Costas + Bíceps",  exercises:[
      {id:2001,name:"Puxada frontal na polia",  sets:4,reps:"10",  load:"60 kg",rest:"90s"},
      {id:2002,name:"Remada cavalete",          sets:3,reps:"12",  load:"70 kg",rest:"75s"},
      {id:2003,name:"Pulldown neutro",          sets:3,reps:"12",  load:"55 kg",rest:"60s"},
      {id:2004,name:"Rosca direta com barra",   sets:3,reps:"10",  load:"35 kg",rest:"60s"},
      {id:2005,name:"Rosca martelo",            sets:3,reps:"12",  load:"14 kg",rest:"60s"},
    ]},
    { day:"Qua", label:"Quarta-feira",  title:"Pernas",           exercises:[
      {id:3001,name:"Agachamento livre",        sets:4,reps:"8-10",load:"80 kg",rest:"120s"},
      {id:3002,name:"Leg press 45°",            sets:3,reps:"12",  load:"140 kg",rest:"90s"},
      {id:3003,name:"Cadeira extensora",        sets:3,reps:"15",  load:"50 kg",rest:"60s"},
      {id:3004,name:"Mesa flexora",             sets:3,reps:"12",  load:"40 kg",rest:"60s"},
      {id:3005,name:"Panturrilha no Smith",     sets:4,reps:"15",  load:"60 kg",rest:"45s"},
      {id:3006,name:"Stiff halteres",           sets:3,reps:"12",  load:"28 kg",rest:"75s"},
    ]},
    { day:"Qui", label:"Quinta-feira",  title:"",                 exercises:[] },
    { day:"Sex", label:"Sexta-feira",   title:"Ombro + Abdômen",  exercises:[
      {id:5001,name:"Desenvolvimento com barra",sets:4,reps:"10",  load:"40 kg",rest:"90s"},
      {id:5002,name:"Elevação lateral",         sets:3,reps:"15",  load:"10 kg",rest:"60s"},
      {id:5003,name:"Face pull na polia",       sets:3,reps:"15",  load:"20 kg",rest:"60s"},
      {id:5004,name:"Abdominal supra",          sets:4,reps:"20",  load:"peso",rest:"45s"},
    ]},
    { day:"Sáb", label:"Sábado",        title:"",                 exercises:[] },
    { day:"Dom", label:"Domingo",       title:"",                 exercises:[] },
  ];
  const [weekPlan, setWeekPlan] = useStE(WEEK_INIT);
  const [expandedDay, setExpandedDay] = useStE(null);
  const [editingDayEx, setEditingDayEx] = useStE(null);
  const [addingExDay, setAddingExDay] = useStE(null);
  const [newExDay, setNewExDay] = useStE({name:"",sets:"3",reps:"12",load:"",rest:"60s",obs:""});
  const [weekSaved, setWeekSaved] = useStE(false);

  function updateDayEx(dayIdx, exId, field, val) {
    setWeekPlan(wp=>wp.map((d,i)=>i!==dayIdx ? d : {
      ...d, exercises: d.exercises.map(e=>e.id===exId ? {...e,[field]:val} : e)
    }));
  }
  function deleteDayEx(dayIdx, exId) {
    setWeekPlan(wp=>wp.map((d,i)=>i!==dayIdx ? d : {
      ...d, exercises: d.exercises.filter(e=>e.id!==exId)
    }));
    if(editingDayEx?.exId===exId) setEditingDayEx(null);
  }
  function moveDayEx(dayIdx, exId, dir) {
    setWeekPlan(wp=>wp.map((d,i)=>{
      if(i!==dayIdx) return d;
      const arr=[...d.exercises]; const j=arr.findIndex(e=>e.id===exId); const k=j+dir;
      if(k<0||k>=arr.length) return d;
      [arr[j],arr[k]]=[arr[k],arr[j]];
      return {...d,exercises:arr};
    }));
  }
  function addDayEx(dayIdx) {
    if(!newExDay.name.trim()) return;
    setWeekPlan(wp=>wp.map((d,i)=>i!==dayIdx ? d : {
      ...d,
      exercises:[...d.exercises,{...newExDay,id:Date.now(),sets:Number(newExDay.sets)||3}]
    }));
    setNewExDay({name:"",sets:"3",reps:"12",load:"",rest:"60s"});
    setAddingExDay(null);
  }
  function toggleRestDay(dayIdx) {
    setWeekPlan(wp=>wp.map((d,i)=>i!==dayIdx ? d : {
      ...d, title: d.title ? "" : "Descanso", exercises:[]
    }));
  }
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Subtab switcher */}
      <div style={{ display:"flex", gap:6, padding:4, background:T.muteSoft, borderRadius:10, width:"fit-content" }}>
        {[["oficial","Treino oficial"],["semana","Plano semanal"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSubtab(k)} style={{
            height:32, padding:"0 14px", borderRadius:8, cursor:"pointer", border:"none",
            background: subtab===k ? T.surface : "transparent",
            color: subtab===k ? T.fg : T.fg3,
            fontFamily:T.ui, fontSize:13, fontWeight: subtab===k ? 600 : 500,
            boxShadow: subtab===k ? T.shadow1 : "none",
          }}>{l}</button>
        ))}
      </div>

      {subtab === "oficial" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {/* Header toolbar */}
          <Card style={{ padding:"14px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
                <input value={workout.title} onChange={e=>setWorkout(w=>({...w,title:e.target.value}))}
                  style={{
                    fontFamily:T.ui, fontSize:16, fontWeight:600, color:T.fg,
                    background:"none", border:"none", outline:"none",
                    borderBottom:`2px solid ${T.border}`, paddingBottom:2,
                    minWidth:160, letterSpacing:"-0.01em",
                  }}/>
                <Pill tone="brand">Coach</Pill>
                {workout.locked && <Pill tone="warn" dot><ILock size={10}/>Bloqueado</Pill>}
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                {/* Novo treino — começa do zero */}
                <Btn sm onClick={()=>{
                  if (workout.exercises.length === 0 ||
                      window.confirm("Criar novo treino? Os exercícios atuais serão apagados.")) {
                    setWorkout(w=>({...w, title:"Novo treino", exercises:[], locked:false}));
                    setEditingId(null); setAddingEx(false); setGutoSuggestion(null);
                  }
                }}>
                  <IPlus size={13}/>Novo treino
                </Btn>
                <Btn sm onClick={()=>setWorkout(w=>({...w,locked:!w.locked}))}>
                  {workout.locked ? <><ILock size={13}/>Desbloquear</> : <><ICheck size={13}/>Bloquear</>}
                </Btn>
                <Btn sm onClick={generateWithGuto} style={{ opacity: generating ? 0.7 : 1 }}>
                  {generating
                    ? <><Spinner size={13}/>Gerando…</>
                    : <><IBolt size={13}/>Gerar com GUTO</>}
                </Btn>
                <Btn primary sm onClick={saveWorkout}>
                  <ISave size={13}/>{saved ? "Salvo ✓" : "Salvar"}
                </Btn>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginTop:12 }}>
              {/* Editable meta fields */}
              <MetaInput label="Foco / Objetivo" value={workout.focus}
                onChange={v=>setWorkout(w=>({...w,focus:v}))}
                options={["Hipertrofia","Emagrecimento","Resistência","Força","Mobilidade","Condicionamento"]}/>
              <MetaInput label="Dia principal" value={workout.day}
                onChange={v=>setWorkout(w=>({...w,day:v}))}
                options={["Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado","Domingo"]}/>
              <MetaInput label="Local" value={workout.location}
                onChange={v=>setWorkout(w=>({...w,location:v}))}
                options={["Academia","Casa","Ar livre","Box","Piscina"]}/>
              <MetaInput label="Duração (min)" value={String(workout.duration)}
                onChange={v=>setWorkout(w=>({...w,duration:Number(v)||w.duration}))}
                options={["30","45","60","75","90","120"]}/>
              <MetaInput label="Dificuldade" value={workout.difficulty}
                onChange={v=>setWorkout(w=>({...w,difficulty:v}))}
                options={["Iniciante","Intermediário","Avançado","Elite"]}/>
            </div>
          </Card>

          {/* GUTO suggestion banner */}
          {gutoSuggestion && (
            <Card style={{ padding:"14px 18px",
              background:`linear-gradient(135deg,${T.brandSoft} 0%,${T.surface} 70%)`,
              border:`1px solid ${T.brandLine}` }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                <div style={{ width:36, height:36, borderRadius:8, background:T.surface,
                  border:`1px solid ${T.brandLine}`, display:"grid", placeItems:"center",
                  color:T.brand, flexShrink:0 }}><IBolt size={16}/></div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:T.ui, fontSize:14, fontWeight:600, color:T.fg, marginBottom:4 }}>
                    GUTO sugeriu: {gutoSuggestion.title}
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                    {gutoSuggestion.exercises.map((e,i)=>(
                      <span key={i} style={{ fontFamily:T.ui, fontSize:12, color:T.fg2,
                        background:T.surface, border:`1px solid ${T.borderSoft}`,
                        borderRadius:6, padding:"3px 8px" }}>{e.name}</span>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <Btn primary sm onClick={applySuggestion}><ICheck size={13}/>Aplicar sugestão</Btn>
                    <Btn ghost sm onClick={()=>setGutoSuggestion(null)}><IX size={13}/>Descartar</Btn>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Exercise list */}
          <Card>
            <div style={{
              display:"grid", gridTemplateColumns:"28px 1.4fr 62px 72px 72px 62px 1fr 72px",
              padding:"10px 16px", gap:10,
              fontFamily:T.ui, fontSize:11, fontWeight:600, letterSpacing:"0.04em",
              color:T.fg4, borderBottom:`1px solid ${T.borderSoft}`,
              background:T.surfaceAlt,
            }}>
              <span>#</span><span>Exercício</span>
              <span>Séries</span><span>Reps</span><span>Carga</span><span>Desc.</span>
              <span>Observação</span><span></span>
            </div>

            {workout.exercises.map((ex,i)=>{
              const active = editingId === ex.id;
              return (
                <div key={ex.id} style={{
                  display:"grid", gridTemplateColumns:"28px 1.4fr 62px 72px 72px 62px 1fr 72px",
                  alignItems:"center", gap:10, padding:"8px 16px",
                  borderBottom: i===workout.exercises.length-1 ? "none" : `1px solid ${T.borderSoft}`,
                  background: active ? `${T.brandSoft}` : T.surface,
                  transition:"background 120ms",
                }}
                onMouseEnter={e=>{ if(!active) e.currentTarget.style.background=T.surfaceHover; }}
                onMouseLeave={e=>{ if(!active) e.currentTarget.style.background=T.surface; }}>
                  <Num c={T.fg4}>{String(i+1).padStart(2,"0")}</Num>

                  {/* Name */}
                  <input value={ex.name}
                    onChange={e=>updateEx(ex.id,"name",e.target.value)}
                    onFocus={()=>setEditingId(ex.id)}
                    onBlur={()=>setEditingId(null)}
                    style={{ fontFamily:T.ui, fontSize:13, fontWeight:500, color:T.fg,
                      background:"none", border:"none", outline:"none",
                      borderBottom:`1.5px solid ${active ? T.brandLine : "transparent"}`,
                      width:"100%", paddingBottom:1, cursor:"text", transition:"border-color 120ms" }}/>

                  {/* Séries / Reps / Carga / Desc */}
                  {["sets","reps","load","rest"].map(field=>(
                    <input key={field} value={ex[field]??''}
                      onChange={e=>updateEx(ex.id,field,e.target.value)}
                      onFocus={()=>setEditingId(ex.id)}
                      onBlur={()=>setEditingId(null)}
                      style={{ fontFamily:T.mono, fontSize:12, color:T.fg,
                        background:"none", border:"none", outline:"none",
                        borderBottom:`1.5px solid ${active ? T.brandLine : "transparent"}`,
                        width:"100%", textAlign:"center", paddingBottom:1,
                        cursor:"text", transition:"border-color 120ms" }}/>
                  ))}

                  {/* Observação */}
                  <input value={ex.obs??''}
                    onChange={e=>updateEx(ex.id,"obs",e.target.value)}
                    onFocus={()=>setEditingId(ex.id)}
                    onBlur={()=>setEditingId(null)}
                    placeholder="Observação…"
                    style={{ fontFamily:T.ui, fontSize:12, color:T.fg2,
                      background:"none", border:"none", outline:"none",
                      borderBottom:`1.5px solid ${active ? T.brandLine : "transparent"}`,
                      width:"100%", paddingBottom:1, cursor:"text",
                      transition:"border-color 120ms" }}/>

                  {/* Actions */}
                  <div style={{ display:"flex", gap:3, justifyContent:"flex-end" }}>
                    <button onClick={()=>moveEx(ex.id,-1)} disabled={i===0} title="Subir" style={{
                      width:22, height:22, borderRadius:4, border:`1px solid ${T.border}`,
                      background:"transparent", color:T.fg4, cursor:"pointer",
                      display:"grid", placeItems:"center", opacity:i===0?0.2:1,
                    }}><IChevL size={11}/></button>
                    <button onClick={()=>moveEx(ex.id,1)} disabled={i===workout.exercises.length-1} title="Descer" style={{
                      width:22, height:22, borderRadius:4, border:`1px solid ${T.border}`,
                      background:"transparent", color:T.fg4, cursor:"pointer",
                      display:"grid", placeItems:"center",
                      opacity:i===workout.exercises.length-1?0.2:1,
                    }}><IChevR size={11}/></button>
                    <button onClick={()=>deleteEx(ex.id)} title="Excluir" style={{
                      width:22, height:22, borderRadius:4, border:`1px solid ${T.badLine}`,
                      background:T.badSoft, color:T.bad, cursor:"pointer",
                      display:"grid", placeItems:"center",
                    }}><ITrash size={11}/></button>
                  </div>
                </div>
              );
            })}

            {/* Add exercise row */}
            {addingEx ? (
              <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.borderSoft}`,
                background:T.brandSoft }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 62px 72px 72px 62px 1fr auto",
                  gap:8, alignItems:"center" }}>
                  <input autoFocus value={newEx.name} onChange={e=>setNewEx(n=>({...n,name:e.target.value}))}
                    placeholder="Nome do exercício…"
                    style={{ fontFamily:T.ui, fontSize:13, padding:"6px 10px",
                      border:`1px solid ${T.brandLine}`, borderRadius:7,
                      background:T.surface, outline:"none", color:T.fg }}/>
                  {["sets","reps","load","rest"].map(f=>(
                    <input key={f} value={newEx[f]} onChange={e=>setNewEx(n=>({...n,[f]:e.target.value}))}
                      placeholder={f}
                      style={{ fontFamily:T.mono, fontSize:12, padding:"6px 8px",
                        border:`1px solid ${T.brandLine}`, borderRadius:7,
                        background:T.surface, outline:"none", color:T.fg,
                        textAlign:"center" }}/>
                  ))}
                  <input value={newEx.obs??''} onChange={e=>setNewEx(n=>({...n,obs:e.target.value}))}
                    placeholder="Observação…"
                    style={{ fontFamily:T.ui, fontSize:12, padding:"6px 10px",
                      border:`1px solid ${T.brandLine}`, borderRadius:7,
                      background:T.surface, outline:"none", color:T.fg }}/>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn primary sm onClick={addEx}><IPlus size={13}/>Add</Btn>
                    <Btn ghost sm onClick={()=>setAddingEx(false)}><IX size={13}/></Btn>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding:"10px 16px", borderTop:`1px solid ${T.borderSoft}` }}>
                <Btn sm onClick={()=>setAddingEx(true)}><IPlus size={13}/>Adicionar exercício</Btn>
              </div>
            )}
          </Card>
        </div>
      )}

      {subtab === "semana" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {/* Info banner */}
          <Card style={{ padding:"12px 16px",
            background:`linear-gradient(135deg,${T.brandSoft} 0%,${T.surface} 60%)`,
            border:`1px solid ${T.brandLine}` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
              <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg3 }}>
                Cada dia tem sua própria lista de exercícios. No app o aluno só vê o treino do dia atual.
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <Btn sm onClick={generateWeekWithGuto} style={{ opacity: generatingWeek ? 0.7 : 1 }}>
                  {generatingWeek
                    ? <><Spinner size={13}/>Gerando semana…</>
                    : <><IBolt size={13}/>Gerar semana com GUTO</>}
                </Btn>
                <Btn primary sm onClick={()=>{ setWeekSaved(true); setTimeout(()=>setWeekSaved(false),2500); }}>
                  <ISave size={13}/>{weekSaved ? "Salvo ✓" : "Salvar plano"}
                </Btn>
              </div>
            </div>
          </Card>

          {/* GUTO week suggestion */}
          {gutoWeekSuggestion && (
            <Card style={{ padding:"14px 18px",
              background:`linear-gradient(135deg,${T.brandSoft} 0%,${T.surface} 70%)`,
              border:`1px solid ${T.brandLine}` }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                <div style={{ width:36, height:36, borderRadius:8, background:T.surface,
                  border:`1px solid ${T.brandLine}`, display:"grid", placeItems:"center",
                  color:T.brand, flexShrink:0 }}><IBolt size={16}/></div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:T.ui, fontSize:14, fontWeight:600, color:T.fg, marginBottom:6 }}>
                    GUTO criou um plano para a semana inteira
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                    {gutoWeekSuggestion.days.filter(d=>d.title).map((d,i)=>(
                      <span key={i} style={{ fontFamily:T.ui, fontSize:12, color:T.fg2,
                        background:T.surface, border:`1px solid ${T.borderSoft}`,
                        borderRadius:6, padding:"3px 8px" }}>
                        {d.day}: {d.title} ({(d.exercises||[]).length} ex.)
                      </span>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <Btn primary sm onClick={applyWeekSuggestion}><ICheck size={13}/>Aplicar semana</Btn>
                    <Btn ghost sm onClick={()=>setGutoWeekSuggestion(null)}><IX size={13}/>Descartar</Btn>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {weekPlan.map((day, dayIdx) => {
            const isExpanded = expandedDay === dayIdx;
            const hasWorkout = !!day.title && day.title !== "";
            const isRestDay = !hasWorkout;

            return (
              <Card key={day.day}>
                {/* Day header */}
                <div style={{
                  display:"flex", alignItems:"center", gap:12, padding:"12px 18px",
                  borderBottom: isExpanded ? `1px solid ${T.borderSoft}` : "none",
                  cursor:"pointer",
                  background: isExpanded ? T.brandSoft : T.surface,
                  borderRadius: isExpanded ? "12px 12px 0 0" : 12,
                  transition:"background 120ms",
                }} onClick={()=>setExpandedDay(isExpanded ? null : dayIdx)}>
                  {/* Day badge */}
                  <div style={{
                    width:42, height:42, borderRadius:10, flexShrink:0,
                    background: hasWorkout ? T.brandSoft : T.muteSoft,
                    color: hasWorkout ? T.brand : T.fg4,
                    border:`1px solid ${hasWorkout ? T.brandLine : T.borderSoft}`,
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  }}>
                    <span style={{ fontFamily:T.ui, fontSize:11, fontWeight:700, lineHeight:1 }}>{day.day}</span>
                    <span style={{ fontFamily:T.ui, fontSize:9, color: hasWorkout ? T.brand : T.fg4,
                      marginTop:1 }}>{day.label.slice(0,3)}</span>
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    {isExpanded ? (
                      <input value={day.title}
                        onChange={e=>setWeekPlan(wp=>wp.map((d,i)=>i===dayIdx?{...d,title:e.target.value}:d))}
                        onClick={e=>e.stopPropagation()}
                        placeholder="Nome do treino deste dia…"
                        style={{ fontFamily:T.ui, fontSize:14, fontWeight:600, color:T.fg,
                          background:"none", border:"none", outline:"none",
                          borderBottom:`2px solid ${T.brandLine}`, paddingBottom:2,
                          width:"100%" }}/>
                    ) : (
                      <>
                        <div style={{ fontFamily:T.ui, fontSize:14, fontWeight:600,
                          color: hasWorkout ? T.fg : T.fg4 }}>
                          {day.title || "Descanso"}
                        </div>
                        {hasWorkout && (
                          <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg4, marginTop:2 }}>
                            {day.exercises.length} exercício{day.exercises.length!==1?"s":""}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div style={{ display:"flex", gap:6, flexShrink:0 }}
                    onClick={e=>e.stopPropagation()}>
                    <Btn ghost sm onClick={()=>toggleRestDay(dayIdx)}>
                      {hasWorkout ? "Marcar descanso" : "Adicionar treino"}
                    </Btn>
                    <div style={{
                      width:28, height:28, borderRadius:6,
                      background: isExpanded ? T.brandSoft : T.muteSoft,
                      border:`1px solid ${isExpanded ? T.brandLine : T.borderSoft}`,
                      display:"grid", placeItems:"center", color: isExpanded ? T.brand : T.fg4,
                    }}
                    onClick={()=>setExpandedDay(isExpanded ? null : dayIdx)}>
                      <IChevD size={14} style={{ transform: isExpanded ? "rotate(180deg)":"rotate(0deg)",
                        transition:"transform 200ms" }}/>
                    </div>
                  </div>
                </div>

                {/* Expanded: exercise list for this day */}
                {isExpanded && hasWorkout && (
                  <div>
                    {/* Exercise table header */}
                    <div style={{
                      display:"grid", gridTemplateColumns:"28px 1.2fr 62px 72px 72px 62px 1fr 72px",
                      padding:"8px 18px", gap:10,
                      fontFamily:T.ui, fontSize:10.5, fontWeight:600,
                      letterSpacing:"0.04em", color:T.fg4,
                      background:T.surfaceAlt,
                      borderBottom:`1px solid ${T.borderSoft}`,
                    }}>
                      <span>#</span><span>Exercício</span>
                      <span>Séries</span><span>Reps</span><span>Carga</span><span>Desc.</span>
                      <span>Observação</span><span></span>
                    </div>

                    {day.exercises.map((ex, exIdx) => {
                      const isEditingEx = editingDayEx?.dayIdx===dayIdx && editingDayEx?.exId===ex.id;
                      return (
                        <div key={ex.id} style={{
                          display:"grid", gridTemplateColumns:"28px 1.2fr 62px 72px 72px 62px 1fr 68px",
                          alignItems:"center", gap:10, padding:"9px 18px",
                          borderBottom: exIdx===day.exercises.length-1 ? "none" : `1px solid ${T.borderSoft}`,
                          background: isEditingEx ? T.brandSoft : T.surface,
                          transition:"background 120ms",
                        }}>
                          <Num c={T.fg4}>{String(exIdx+1).padStart(2,"0")}</Num>

                          <input value={ex.name}
                            onChange={e=>updateDayEx(dayIdx,ex.id,"name",e.target.value)}
                            onFocus={()=>setEditingDayEx({dayIdx,exId:ex.id})}
                            onBlur={()=>setEditingDayEx(null)}
                            style={{ fontFamily:T.ui, fontSize:13, fontWeight:500, color:T.fg,
                              background:"none", border:"none", outline:"none",
                              borderBottom:`1.5px solid ${isEditingEx?T.brandLine:"transparent"}`,
                              width:"100%", paddingBottom:1, cursor:"text" }}/>

                          {["sets","reps","load","rest"].map(field=>(
                            <input key={field} value={ex[field]??''}
                              onChange={e=>updateDayEx(dayIdx,ex.id,field,e.target.value)}
                              onFocus={()=>setEditingDayEx({dayIdx,exId:ex.id})}
                              onBlur={()=>setEditingDayEx(null)}
                              style={{ fontFamily:T.mono, fontSize:12, color:T.fg,
                                background:"none", border:"none", outline:"none",
                                borderBottom:`1.5px solid ${isEditingEx?T.brandLine:"transparent"}`,
                                width:"100%", textAlign:"center", paddingBottom:1, cursor:"text" }}/>
                          ))}

                          <input value={ex.obs??''}
                            onChange={e=>updateDayEx(dayIdx,ex.id,"obs",e.target.value)}
                            onFocus={()=>setEditingDayEx({dayIdx,exId:ex.id})}
                            onBlur={()=>setEditingDayEx(null)}
                            placeholder="Observação…"
                            style={{ fontFamily:T.ui, fontSize:12, color:T.fg2,
                              background:"none", border:"none", outline:"none",
                              borderBottom:`1.5px solid ${isEditingEx?T.brandLine:"transparent"}`,
                              width:"100%", paddingBottom:1, cursor:"text" }}/>

                          <div style={{ display:"flex", gap:3, justifyContent:"flex-end" }}>
                            <button onClick={()=>moveDayEx(dayIdx,ex.id,-1)} disabled={exIdx===0}
                              style={{ width:22,height:22,borderRadius:4,border:`1px solid ${T.border}`,
                                background:"transparent",color:T.fg4,cursor:"pointer",
                                display:"grid",placeItems:"center",opacity:exIdx===0?0.2:1 }}>
                              <IChevL size={11}/>
                            </button>
                            <button onClick={()=>moveDayEx(dayIdx,ex.id,1)}
                              disabled={exIdx===day.exercises.length-1}
                              style={{ width:22,height:22,borderRadius:4,border:`1px solid ${T.border}`,
                                background:"transparent",color:T.fg4,cursor:"pointer",
                                display:"grid",placeItems:"center",
                                opacity:exIdx===day.exercises.length-1?0.2:1 }}>
                              <IChevR size={11}/>
                            </button>
                            <button onClick={()=>deleteDayEx(dayIdx,ex.id)}
                              style={{ width:22,height:22,borderRadius:4,border:`1px solid ${T.badLine}`,
                                background:T.badSoft,color:T.bad,cursor:"pointer",
                                display:"grid",placeItems:"center" }}>
                              <ITrash size={10}/>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add exercise to this day */}
                    {addingExDay === dayIdx ? (
                      <div style={{ padding:"10px 18px", background:T.brandSoft,
                        borderTop:`1px solid ${T.borderSoft}` }}>
                        <div style={{ display:"grid",
                          gridTemplateColumns:"1fr 62px 72px 72px 62px 1fr auto",
                          gap:8, alignItems:"center" }}>
                          <input autoFocus value={newExDay.name}
                            onChange={e=>setNewExDay(n=>({...n,name:e.target.value}))}
                            placeholder="Nome do exercício…"
                            style={{ fontFamily:T.ui, fontSize:13, padding:"5px 9px",
                              border:`1px solid ${T.brandLine}`, borderRadius:7,
                              background:T.surface, outline:"none", color:T.fg }}/>
                          {["sets","reps","load","rest"].map(f=>(
                            <input key={f} value={newExDay[f]}
                              onChange={e=>setNewExDay(n=>({...n,[f]:e.target.value}))}
                              placeholder={f}
                              style={{ fontFamily:T.mono, fontSize:12, padding:"5px 6px",
                                border:`1px solid ${T.brandLine}`, borderRadius:7,
                                background:T.surface, outline:"none", color:T.fg,
                                textAlign:"center" }}/>
                          ))}
                          <input value={newExDay.obs??''}
                            onChange={e=>setNewExDay(n=>({...n,obs:e.target.value}))}
                            placeholder="Observação…"
                            style={{ fontFamily:T.ui, fontSize:12, padding:"5px 9px",
                              border:`1px solid ${T.brandLine}`, borderRadius:7,
                              background:T.surface, outline:"none", color:T.fg }}/>
                          <div style={{ display:"flex", gap:5 }}>
                            <Btn primary sm onClick={()=>addDayEx(dayIdx)}>
                              <IPlus size={12}/>Add
                            </Btn>
                            <Btn ghost sm onClick={()=>setAddingExDay(null)}>
                              <IX size={12}/>
                            </Btn>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding:"8px 18px",
                        borderTop:`1px solid ${T.borderSoft}` }}>
                        <Btn ghost sm onClick={()=>setAddingExDay(dayIdx)}>
                          <IPlus size={12}/>Adicionar exercício
                        </Btn>
                      </div>
                    )}
                  </div>
                )}

                {/* Expanded rest day placeholder */}
                {isExpanded && !hasWorkout && (
                  <div style={{ padding:"24px 18px", textAlign:"center" }}>
                    <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg4, marginBottom:12 }}>
                      Dia de descanso. Clique em "Adicionar treino" para criar exercícios.
                    </div>
                    <Btn sm onClick={()=>{ toggleRestDay(dayIdx); }}>
                      <IPlus size={13}/>Criar treino para {day.label}
                    </Btn>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── MetaInput: editable dropdown field ─────────────────────────────────── */
function MetaInput({ label, value, onChange, options=[] }) {
  const [open, setOpen] = useStE(false);
  const [editVal, setEditVal] = useStE(value);
  return (
    <div style={{ background:T.surfaceAlt, borderRadius:8,
      padding:"8px 10px", border:`1px solid ${T.borderSoft}`,
      position:"relative" }}>
      <div style={{ fontFamily:T.ui, fontSize:11, color:T.fg4, marginBottom:4 }}>{label}</div>
      <input value={editVal}
        onChange={e=>{ setEditVal(e.target.value); onChange(e.target.value); }}
        onFocus={()=>setOpen(true)}
        onBlur={()=>setTimeout(()=>setOpen(false),150)}
        style={{ fontFamily:T.ui, fontSize:13, color:T.fg, fontWeight:500,
          background:"none", border:"none", outline:"none",
          borderBottom:`1px solid ${open ? T.brandLine : "transparent"}`,
          width:"100%", paddingBottom:1, cursor:"text" }}/>
      {open && options.length > 0 && (
        <div style={{ position:"absolute", top:"100%", left:0, right:0,
          background:T.surface, border:`1px solid ${T.borderStrong}`,
          borderRadius:8, boxShadow:T.shadow2, zIndex:90,
          overflow:"hidden", marginTop:2 }}>
          {options.map(opt=>(
            <button key={opt} onMouseDown={()=>{ setEditVal(opt); onChange(opt); setOpen(false); }}
              style={{ width:"100%", padding:"8px 12px", border:"none",
                background:"transparent", cursor:"pointer", textAlign:"left",
                fontFamily:T.ui, fontSize:13, color:T.fg,
                borderBottom:`1px solid ${T.borderSoft}` }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Spinner({ size=14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation:"spin 0.8s linear infinite", display:"block" }}
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <path d="M12 2a10 10 0 1 0 10 10" opacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10"/>
    </svg>
  );
}

function StuDieta({ student }) {
  const INIT_MEALS = [
    { id:1, name:"Café da manhã", kcal:480, items:[
      {id:101,name:"Ovos mexidos (3)",       kcal:210, p:18, c:2,  f:14},
      {id:102,name:"Pão integral (2 fatias)",kcal:160, p:6,  c:30, f:2},
      {id:103,name:"Banana",                 kcal:110, p:1,  c:28, f:0},
    ]},
    { id:2, name:"Almoço", kcal:720, items:[
      {id:201,name:"Frango grelhado 150g",   kcal:248, p:46, c:0,  f:5},
      {id:202,name:"Arroz integral 150g",    kcal:210, p:4,  c:44, f:2},
      {id:203,name:"Salada verde",           kcal:30,  p:2,  c:5,  f:0},
    ]},
    { id:3, name:"Pré-treino", kcal:280, items:[
      {id:301,name:"Whey protein 30g",       kcal:120, p:24, c:4,  f:2},
      {id:302,name:"Batata doce 100g",       kcal:160, p:1,  c:38, f:0},
    ]},
    { id:4, name:"Jantar", kcal:540, items:[
      {id:401,name:"Salmão 180g",            kcal:320, p:38, c:0,  f:18},
      {id:402,name:"Brócolis 120g",          kcal:50,  p:4,  c:8,  f:0},
      {id:403,name:"Arroz integral 100g",    kcal:170, p:3,  c:36, f:1},
    ]},
  ];
  const [meals, setMeals] = useStE(INIT_MEALS);
  const [saved, setSaved] = useStE(false);
  const [generating, setGenerating] = useStE(false);
  const [gutoSuggestion, setGutoSuggestion] = useStE(null);
  const [addingMeal, setAddingMeal] = useStE(false);
  const [newMealName, setNewMealName] = useStE("");
  const [addingFoodTo, setAddingFoodTo] = useStE(null); // mealId
  const [newFood, setNewFood] = useStE({name:"",kcal:"",p:"",c:"",f:""});
  const [expandedMeal, setExpandedMeal] = useStE(null); // mealId with macros shown

  const totals = React.useMemo(() => ({
    kcal: meals.reduce((a,m)=>a+m.items.reduce((b,i)=>b+(i.kcal||0),0),0),
    p:    meals.reduce((a,m)=>a+m.items.reduce((b,i)=>b+(i.p||0),0),0),
    c:    meals.reduce((a,m)=>a+m.items.reduce((b,i)=>b+(i.c||0),0),0),
    f:    meals.reduce((a,m)=>a+m.items.reduce((b,i)=>b+(i.f||0),0),0),
  }), [meals]);

  function deleteFood(mealId, foodId) {
    setMeals(ms=>ms.map(m=>m.id===mealId
      ? {...m, items:m.items.filter(i=>i.id!==foodId)}
      : m));
  }
  function deleteMeal(mealId) {
    setMeals(ms=>ms.filter(m=>m.id!==mealId));
  }
  function addMeal() {
    if (!newMealName.trim()) return;
    setMeals(ms=>[...ms, { id:Date.now(), name:newMealName, kcal:0, items:[] }]);
    setNewMealName("");
    setAddingMeal(false);
  }
  function addFood(mealId) {
    if (!newFood.name.trim()) return;
    const food = {
      id: Date.now(),
      name: newFood.name,
      kcal: Number(newFood.kcal)||0,
      p: Number(newFood.p)||0,
      c: Number(newFood.c)||0,
      f: Number(newFood.f)||0,
    };
    setMeals(ms=>ms.map(m=>m.id===mealId ? {...m, items:[...m.items,food]} : m));
    setNewFood({name:"",kcal:"",p:"",c:"",f:""});
    setAddingFoodTo(null);
  }
  function updateFoodName(mealId, foodId, val) {
    setMeals(ms=>ms.map(m=>m.id===mealId
      ? {...m, items:m.items.map(i=>i.id===foodId?{...i,name:val}:i)}
      : m));
  }

  async function generateDiet() {
    setGenerating(true);
    setGutoSuggestion(null);
    try {
      const prompt = `Você é um nutricionista esportivo. Crie um plano alimentar de hipertrofia com ${totals.kcal > 0 ? totals.kcal : 2200} kcal por dia. Retorne APENAS um JSON com a estrutura: {"meals":[{"name":"Café da manhã","items":[{"name":"Ovos mexidos (3)","kcal":210,"p":18,"c":2,"f":14}]}]}. Inclua 4 refeições com 2-4 alimentos cada.`;
      const resp = await window.claude.complete(prompt);
      const jsonMatch = resp.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        if (data.meals) setGutoSuggestion(data);
      }
    } catch(e) {}
    setGenerating(false);
  }
  function applySuggestion() {
    if (!gutoSuggestion) return;
    const newMeals = gutoSuggestion.meals.map((m,i)=>({
      id: Date.now()+i,
      name: m.name,
      kcal: (m.items||[]).reduce((a,f)=>a+(f.kcal||0),0),
      items: (m.items||[]).map((f,j)=>({ id:Date.now()+i*100+j, ...f })),
    }));
    setMeals(newMeals);
    setGutoSuggestion(null);
  }

  const MacroBar = ({ label, value, total, color }) => {
    const pct = total > 0 ? Math.round((value/total)*100) : 0;
    return (
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <span style={{ fontFamily:T.ui, fontSize:11.5, color:T.fg3 }}>{label}</span>
          <span style={{ fontFamily:T.mono, fontSize:11.5, color:T.fg, fontWeight:600 }}>
            {value}g <span style={{ color:T.fg4, fontWeight:400 }}>({pct}%)</span>
          </span>
        </div>
        <div style={{ height:4, background:T.muteSoft, borderRadius:99, overflow:"hidden" }}>
          <div style={{ width:`${pct}%`, height:"100%", background:color, transition:"width 300ms" }}/>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

      {/* Summary strip */}
      <Card style={{ padding:"16px 18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap", marginBottom:14 }}>
          <div>
            <div style={{ fontFamily:T.ui, fontSize:11, fontWeight:600, color:T.fg4,
              letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:2 }}>Total diário</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
              <Num c={T.brand} style={{ fontSize:30, fontWeight:700 }}>{totals.kcal}</Num>
              <span style={{ fontFamily:T.ui, fontSize:14, color:T.fg3 }}>kcal</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:14, flex:1, minWidth:200 }}>
            {[
              {label:"Proteína", val:totals.p,   color:"#3B82F6"},
              {label:"Carboidrato", val:totals.c, color:"#F59E0B"},
              {label:"Gordura",  val:totals.f,   color:"#EF4444"},
            ].map(m=>(
              <div key={m.label} style={{ flex:1, textAlign:"center",
                background:T.surfaceAlt, borderRadius:8, padding:"8px 10px",
                border:`1px solid ${T.borderSoft}` }}>
                <div style={{ fontFamily:T.mono, fontSize:15, fontWeight:700, color:m.color }}>{m.val}g</div>
                <div style={{ fontFamily:T.ui, fontSize:11, color:T.fg4 }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:6, flexShrink:0 }}>
            <Btn sm onClick={generateDiet} style={{ opacity: generating ? 0.7 : 1 }}>
              {generating ? <><Spinner size={13}/>Gerando…</> : <><IBolt size={13}/>Gerar com GUTO</>}
            </Btn>
            <Btn primary sm onClick={()=>{ setSaved(true); setTimeout(()=>setSaved(false),2500); }}>
              <ISave size={13}/>{saved ? "Salvo ✓" : "Salvar"}
            </Btn>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <MacroBar label="Proteína"    value={totals.p} total={totals.p+totals.c+totals.f} color="#3B82F6"/>
          <MacroBar label="Carboidrato" value={totals.c} total={totals.p+totals.c+totals.f} color="#F59E0B"/>
          <MacroBar label="Gordura"     value={totals.f} total={totals.p+totals.c+totals.f} color="#EF4444"/>
        </div>
      </Card>

      {/* GUTO suggestion */}
      {gutoSuggestion && (
        <Card style={{ padding:"14px 18px",
          background:`linear-gradient(135deg,${T.brandSoft} 0%,${T.surface} 70%)`,
          border:`1px solid ${T.brandLine}` }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:T.surface,
              border:`1px solid ${T.brandLine}`, display:"grid", placeItems:"center",
              color:T.brand, flexShrink:0 }}><IBolt size={16}/></div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:T.ui, fontSize:14, fontWeight:600, color:T.fg, marginBottom:6 }}>
                GUTO gerou um novo plano alimentar
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                {gutoSuggestion.meals.map((m,i)=>(
                  <span key={i} style={{ fontFamily:T.ui, fontSize:12, color:T.fg2,
                    background:T.surface, border:`1px solid ${T.borderSoft}`,
                    borderRadius:6, padding:"3px 8px" }}>{m.name}</span>
                ))}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <Btn primary sm onClick={applySuggestion}><ICheck size={13}/>Aplicar</Btn>
                <Btn ghost sm onClick={()=>setGutoSuggestion(null)}><IX size={13}/>Descartar</Btn>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Meal cards */}
      {meals.map(meal=>{
        const mealTotal = meal.items.reduce((a,i)=>a+(i.kcal||0),0);
        const isExpanded = expandedMeal === meal.id;
        return (
          <Card key={meal.id}>
            {/* Meal header */}
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 18px",
              borderBottom:`1px solid ${T.borderSoft}` }}>
              <input value={meal.name}
                onChange={e=>setMeals(ms=>ms.map(m=>m.id===meal.id?{...m,name:e.target.value}:m))}
                style={{ fontFamily:T.ui, fontSize:14, fontWeight:600, color:T.fg,
                  background:"none", border:"none", outline:"none",
                  borderBottom:`2px solid ${T.border}`, paddingBottom:1,
                  flex:1, minWidth:100 }}/>
              <Num c={T.brand} style={{ fontWeight:700, fontSize:14 }}>{mealTotal} kcal</Num>
              <button onClick={()=>setExpandedMeal(isExpanded?null:meal.id)}
                style={{ height:28, padding:"0 10px", borderRadius:6, cursor:"pointer",
                  border:`1px solid ${T.border}`, background:"transparent",
                  fontFamily:T.ui, fontSize:12, color:T.fg3 }}>
                {isExpanded ? "▲ Macros" : "▼ Macros"}
              </button>
              <button onClick={()=>deleteMeal(meal.id)}
                style={{ width:28, height:28, borderRadius:6, border:`1px solid ${T.badLine}`,
                  background:T.badSoft, color:T.bad, cursor:"pointer",
                  display:"grid", placeItems:"center" }}>
                <ITrash size={12}/>
              </button>
            </div>

            {/* Macro breakdown */}
            {isExpanded && (
              <div style={{ padding:"10px 18px", background:T.surfaceAlt,
                borderBottom:`1px solid ${T.borderSoft}`,
                display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                {[
                  {label:"Proteína",    val:meal.items.reduce((a,i)=>a+(i.p||0),0), color:"#3B82F6"},
                  {label:"Carboidrato", val:meal.items.reduce((a,i)=>a+(i.c||0),0), color:"#F59E0B"},
                  {label:"Gordura",     val:meal.items.reduce((a,i)=>a+(i.f||0),0), color:"#EF4444"},
                ].map(m=>(
                  <div key={m.label} style={{ textAlign:"center", padding:"6px 0" }}>
                    <Num c={m.color} style={{ fontSize:15, fontWeight:700 }}>{m.val}g</Num>
                    <div style={{ fontFamily:T.ui, fontSize:11, color:T.fg4 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Food items */}
            {meal.items.map((food,j)=>(
              <div key={food.id} style={{
                display:"grid", gridTemplateColumns:"1fr 60px 60px 60px 60px 32px",
                alignItems:"center", gap:10, padding:"9px 18px",
                borderBottom: j===meal.items.length-1&&!addingFoodTo ? "none" : `1px solid ${T.borderSoft}`,
              }}>
                <input value={food.name}
                  onChange={e=>updateFoodName(meal.id,food.id,e.target.value)}
                  style={{ fontFamily:T.ui, fontSize:13, color:T.fg,
                    background:"none", border:"none", outline:"none",
                    borderBottom:`1px solid transparent`,
                    width:"100%" }}
                  onFocus={e=>e.target.style.borderBottomColor=T.brandLine}
                  onBlur={e=>e.target.style.borderBottomColor="transparent"}/>
                <Num c={T.fg2} style={{ fontSize:12, textAlign:"center" }}>{food.kcal}</Num>
                <Num c="#3B82F6" style={{ fontSize:12, textAlign:"center" }}>{food.p}g P</Num>
                <Num c="#F59E0B" style={{ fontSize:12, textAlign:"center" }}>{food.c}g C</Num>
                <Num c="#EF4444" style={{ fontSize:12, textAlign:"center" }}>{food.f}g G</Num>
                <button onClick={()=>deleteFood(meal.id,food.id)}
                  style={{ width:26, height:26, borderRadius:5, border:`1px solid ${T.badLine}`,
                    background:T.badSoft, color:T.bad, cursor:"pointer",
                    display:"grid", placeItems:"center" }}>
                  <ITrash size={11}/>
                </button>
              </div>
            ))}

            {/* Add food inline form */}
            {addingFoodTo === meal.id ? (
              <div style={{ padding:"10px 18px", background:T.brandSoft,
                borderTop:`1px solid ${T.borderSoft}` }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 60px 50px 50px 50px auto",
                  gap:8, alignItems:"center" }}>
                  <input autoFocus value={newFood.name}
                    onChange={e=>setNewFood(f=>({...f,name:e.target.value}))}
                    placeholder="Alimento…"
                    style={{ fontFamily:T.ui, fontSize:13, padding:"5px 9px",
                      border:`1px solid ${T.brandLine}`, borderRadius:6,
                      background:T.surface, outline:"none", color:T.fg }}/>
                  {[["kcal","Kcal"],["p","Prot"],["c","Carb"],["f","Gord"]].map(([field,ph])=>(
                    <input key={field} value={newFood[field]}
                      onChange={e=>setNewFood(f=>({...f,[field]:e.target.value}))}
                      placeholder={ph}
                      type="number" min="0"
                      style={{ fontFamily:T.mono, fontSize:12, padding:"5px 6px",
                        border:`1px solid ${T.brandLine}`, borderRadius:6,
                        background:T.surface, outline:"none", color:T.fg,
                        textAlign:"center" }}/>
                  ))}
                  <div style={{ display:"flex", gap:5 }}>
                    <Btn primary sm onClick={()=>addFood(meal.id)}><IPlus size={12}/>Add</Btn>
                    <Btn ghost sm onClick={()=>setAddingFoodTo(null)}><IX size={12}/></Btn>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding:"8px 18px" }}>
                <Btn ghost sm onClick={()=>setAddingFoodTo(meal.id)}>
                  <IPlus size={12}/>Adicionar alimento
                </Btn>
              </div>
            )}
          </Card>
        );
      })}

      {/* Add meal */}
      {addingMeal ? (
        <Card style={{ padding:"12px 16px" }}>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input autoFocus value={newMealName} onChange={e=>setNewMealName(e.target.value)}
              placeholder="Nome da refeição (ex: Lanche da tarde)…"
              style={{ flex:1, fontFamily:T.ui, fontSize:13.5, padding:"7px 12px",
                border:`1px solid ${T.brandLine}`, borderRadius:8,
                background:T.surface, outline:"none", color:T.fg }}/>
            <Btn primary sm onClick={addMeal}><IPlus size={13}/>Criar refeição</Btn>
            <Btn ghost sm onClick={()=>{ setAddingMeal(false); setNewMealName(""); }}><IX size={13}/></Btn>
          </div>
        </Card>
      ) : (
        <button onClick={()=>setAddingMeal(true)} style={{
          width:"100%", height:44, borderRadius:10, cursor:"pointer",
          background:T.surface, border:`2px dashed ${T.borderStrong}`,
          color:T.fg3, fontFamily:T.ui, fontSize:13, fontWeight:500,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          transition:"border-color 140ms, color 140ms",
        }}
        onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.brand; e.currentTarget.style.color=T.brand; }}
        onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.borderStrong; e.currentTarget.style.color=T.fg3; }}>
          <IPlus size={15}/>Nova refeição
        </button>
      )}
    </div>
  );
}

function StuHistorico({ student }) {
  const entries = [
    { date:"2026-05-09", label:"Peito + Tríceps",  xp:120, status:"ok" },
    { date:"2026-05-08", label:"Costas + Bíceps",  xp:110, status:"ok" },
    { date:"2026-05-07", label:"Pernas",            xp:130, status:"ok" },
    { date:"2026-05-05", label:"Ombro + Abdômen",  xp:100, status:"ok" },
    { date:"2026-05-04", label:"Cardio leve",       xp:60,  status:"ok" },
    { date:"2026-05-01", label:"Peito + Tríceps",  xp:120, status:"ok" },
    { date:"2026-04-30", label:"Costas",            xp:110, status:"ok" },
    { date:"2026-04-28", label:"Ausência",          xp:0,   status:"bad" },
  ];
  return (
    <Card>
      {entries.map((e,i)=>(
        <div key={i} style={{
          display:"grid", gridTemplateColumns:"auto 90px 1fr auto",
          alignItems:"center", gap:14, padding:"12px 18px",
          borderBottom: i===entries.length-1 ? "none" : `1px solid ${T.borderSoft}`,
        }}>
          <span style={{
            width:8, height:8, borderRadius:999,
            background: e.status==="ok" ? T.ok : T.bad,
          }}/>
          <Num c={T.fg3}>
            {new Date(e.date).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}
          </Num>
          <span style={{ fontFamily:T.ui, fontSize:13.5, color:T.fg, fontWeight:500 }}>{e.label}</span>
          {e.xp > 0
            ? <Num c={T.brand} style={{ fontWeight:600 }}>+{e.xp} XP</Num>
            : <span style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg4 }}>—</span>}
        </div>
      ))}
    </Card>
  );
}

function StuAcesso({ student }) {
  const [active, setActive] = useStE(student.active);
  const [showPwForm, setShowPwForm] = useStE(false);
  const [newPw, setNewPw] = useStE("");
  const [confirmPw, setConfirmPw] = useStE("");
  const [pwSaved, setPwSaved] = useStE(false);

  function savePw() {
    if (!newPw || newPw !== confirmPw) return;
    setPwSaved(true);
    setShowPwForm(false);
    setNewPw(""); setConfirmPw("");
    setTimeout(()=>setPwSaved(false), 3000);
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* ── Acesso ── */}
      <Card padded>
        <SectionHeader title="Status de acesso"/>
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          gap:14, padding:"14px 16px", borderRadius:10, flexWrap:"wrap",
          background: active ? T.okSoft : T.badSoft,
          border:`1px solid ${active ? T.okLine : T.badLine}`,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{
              width:36, height:36, borderRadius:999,
              background: active ? T.ok : T.bad,
              display:"grid", placeItems:"center", color:"#fff", flexShrink:0,
            }}>{active ? <ICheck size={16} sw={2.5}/> : <ILock size={16} sw={2}/>}</span>
            <div>
              <div style={{ fontFamily:T.ui, fontSize:14, fontWeight:600,
                color: active ? T.ok : T.bad }}>
                {active ? "Acesso liberado" : "Acesso bloqueado"}
              </div>
              <div style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3, marginTop:2 }}>
                {active
                  ? "O aluno consegue entrar no app e usar todos os recursos."
                  : "O aluno não consegue fazer login. Todos os dados são preservados."}
              </div>
            </div>
          </div>
          <Btn danger={active} primary={!active} onClick={()=>setActive(v=>!v)}>
            {active ? <><ILock size={14}/>Bloquear acesso</> : <><ICheck size={14}/>Liberar acesso</>}
          </Btn>
        </div>
      </Card>

      {/* ── Alterar senha ── */}
      <Card padded>
        <SectionHeader title="Senha"
          subtitle="O super admin pode redefinir a senha do aluno."
          action={!showPwForm && (
            <Btn sm onClick={()=>setShowPwForm(true)}>
              Alterar senha
            </Btn>
          )}/>

        {pwSaved && (
          <div style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"10px 14px", borderRadius:8,
            background:T.okSoft, border:`1px solid ${T.okLine}`,
            fontFamily:T.ui, fontSize:13, color:T.ok, fontWeight:500,
            marginBottom:12,
          }}>
            <ICheck size={14} sw={2.5}/> Senha alterada com sucesso.
          </div>
        )}

        {showPwForm && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Field label="Nova senha">
              <TextInput type="password" value={newPw} onChange={setNewPw}
                placeholder="Mínimo 8 caracteres"/>
            </Field>
            <Field label="Confirmar nova senha">
              <TextInput type="password" value={confirmPw} onChange={setConfirmPw}
                placeholder="Repita a senha"/>
            </Field>
            {confirmPw && newPw !== confirmPw && (
              <div style={{ fontFamily:T.ui, fontSize:12.5, color:T.bad }}>
                As senhas não coincidem.
              </div>
            )}
            <div style={{ display:"flex", gap:8, marginTop:4 }}>
              <Btn primary sm onClick={savePw}
                style={{ opacity: (!newPw || newPw !== confirmPw) ? 0.5 : 1 }}>
                <ISave size={13}/>Salvar nova senha
              </Btn>
              <Btn ghost sm onClick={()=>{ setShowPwForm(false); setNewPw(""); setConfirmPw(""); }}>
                Cancelar
              </Btn>
            </div>
          </div>
        )}

        {!showPwForm && !pwSaved && (
          <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg3 }}>
            A senha atual do aluno é privada. Clique em "Alterar senha" para redefinir.
          </div>
        )}
      </Card>

      {/* ── Link de convite ── */}
      <Card padded>
        <SectionHeader title="Link de acesso / convite"/>
        <div style={{
          display:"flex", alignItems:"center", gap:10,
          background:T.surfaceAlt, border:`1px solid ${T.borderSoft}`,
          borderRadius:8, padding:"8px 12px", marginBottom:10,
        }}>
          <span style={{ fontFamily:T.mono, fontSize:12.5, color:T.fg2, flex:1,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            https://guto.fit/convite/abc123xyz{student.id}
          </span>
          <Btn sm onClick={()=>navigator.clipboard?.writeText?.(`https://guto.fit/convite/abc123xyz${student.id}`)}>
            <ICopy size={13}/>Copiar
          </Btn>
        </div>
        <Btn ghost sm>Regenerar convite</Btn>
        <div style={{ fontFamily:T.ui, fontSize:12, color:T.fg4, marginTop:8 }}>
          O link expira em 72 horas após ser gerado.
        </div>
      </Card>

      {/* ── Assinatura ── */}
      <Card padded>
        <SectionHeader title="Assinatura"/>
        <DataRow label="Status"     value={<SubPill status={student.subscriptionStatus}/>}/>
        <DataRow label="Expira em"  value={formatDate(student.subscriptionEndsAt)}/>
        <DataRow label="Arena"      value={student.visibleInArena ? "Visível" : "Oculto"}/>
        <div style={{ marginTop:12, display:"flex", gap:8 }}>
          <Btn sm>{student.visibleInArena ? "Ocultar da Arena" : "Mostrar na Arena"}</Btn>
        </div>
      </Card>

      {/* ── Zona de perigo ── */}
      <Card style={{
        padding:"16px 20px",
        border:`1px solid ${T.badLine}`,
        background:T.badSoft,
      }}>
        <div style={{ fontFamily:T.ui, fontSize:13, fontWeight:600, color:T.bad,
          marginBottom:10 }}>Zona de perigo</div>
        <div style={{ fontFamily:T.ui, fontSize:12.5, color:T.fg3, marginBottom:14 }}>
          Ações irreversíveis. O aluno será notificado.
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Btn danger sm onClick={()=>{}}>
            <ITrash size={13}/>Excluir conta
          </Btn>
          <Btn danger sm onClick={()=>{}}>
            Forçar logout em todos os dispositivos
          </Btn>
        </div>
      </Card>
    </div>
  );
}

function StudentDrawer() {
  const ctx = useCtxE(window.PanelCtx);
  if (!ctx.selectedStudent) return null;
  const s = ctx.selectedStudent;
  const tab = ctx.detailTab;

  return (
    <DrawerShell onClose={ctx.closeStudent} width={820} zBase={70}>
      {/* ── Header ── */}
      <div style={{
        padding:"18px 28px 0", borderBottom:`1px solid ${T.border}`,
        background:T.surface,
      }}>
        {/* Top row: identity + close */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between",
          gap:18, marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, minWidth:0 }}>
            <Avatar name={s.name} size={52}/>
            <div style={{ minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <Pill tone="brand">Aluno</Pill>
                <span style={{ fontFamily:T.mono, fontSize:11, color:T.fg4 }}>{s.id}</span>
                <RiskPill student={s}/>
              </div>
              <div style={{ fontFamily:T.ui, fontSize:22, fontWeight:700, color:T.fg,
                letterSpacing:"-0.02em", lineHeight:1.1 }}>{s.name}</div>
            </div>
          </div>
          <button onClick={ctx.closeStudent} style={iconBtn()}><IX size={15}/></button>
        </div>

        {/* Info strip */}
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          gap:0, marginBottom:0,
          borderTop:`1px solid ${T.borderSoft}`,
          borderRadius:"0 0 0 0",
        }}>
          {[
            { label:"E-mail",   value:s.email,   copyable:true },
            { label:"Telefone", value:s.phone,   copyable:true },
            { label:"Coach",    value:coachName(s.coachId), copyable:false },
            { label:"XP / sem", value:`${s.weeklyXp} XP`, copyable:false, accent:true },
          ].map((item, i) => (
            <div key={i} style={{
              padding:"10px 14px",
              borderRight: i < 3 ? `1px solid ${T.borderSoft}` : "none",
              display:"flex", flexDirection:"column", gap:3,
            }}>
              <span style={{ fontFamily:T.ui, fontSize:11, fontWeight:600, color:T.fg4,
                letterSpacing:"0.04em", textTransform:"uppercase" }}>{item.label}</span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{
                  fontFamily: item.accent ? T.mono : T.ui,
                  fontSize:13, fontWeight: item.accent ? 600 : 500,
                  color: item.accent ? T.brand : T.fg,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                  maxWidth:150,
                }}>{item.value}</span>
                {item.copyable && (
                  <button onClick={()=>navigator.clipboard?.writeText?.(item.value)}
                    style={{ background:"none", border:"none", cursor:"pointer",
                      color:T.fg4, padding:2, display:"flex", alignItems:"center",
                      flexShrink:0 }}
                    title="Copiar">
                    <ICopy size={12}/>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:0, overflowX:"auto", marginTop:2 }}>
          {DETAIL_TABS.map(({ id, label, Icon }) => {
            const active = tab===id;
            return (
              <button key={id} onClick={()=>ctx.setDetailTab(id)} style={{
                background:"none", border:"none", cursor:"pointer",
                padding:"12px 14px", color: active ? T.brandDeep : T.fg3,
                fontFamily:T.ui, fontSize:13, fontWeight: active ? 600 : 500,
                borderBottom: active ? `2px solid ${T.brandStrong}` : "2px solid transparent",
                marginBottom:-1, display:"flex", alignItems:"center", gap:7,
                whiteSpace:"nowrap",
              }}><Icon/>{label}</button>
            );
          })}
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"22px 28px" }}>
        {tab==="resumo"     && <StuResumo student={s}/>}
        {tab==="calibragem" && <StuCalibragem student={s}/>}
        {tab==="treino"     && <StuTreino student={s}/>}
        {tab==="dieta"      && <StuDieta student={s}/>}
        {tab==="historico"  && <StuHistorico student={s}/>}
        {tab==="acesso"     && <StuAcesso student={s}/>}
      </div>
    </DrawerShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CREATE MODALS
══════════════════════════════════════════════════════════════════════════ */
function CreateModal() {
  const ctx = useCtxE(window.PanelCtx);
  if (!ctx.showCreate) return null;
  const cfg = typeof ctx.showCreate === "string" ? { kind:ctx.showCreate } : ctx.showCreate;
  return (
    <>
      <div onClick={()=>ctx.setShowCreate(null)} style={{
        position:"fixed", inset:0, background:"rgba(15,23,42,0.40)",
        zIndex:70, animation:"fadeIn 180ms ease",
      }}/>
      <div style={{
        position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:"min(640px,94vw)", maxHeight:"90vh", overflowY:"auto",
        background:T.surface, borderRadius:14,
        border:`1px solid ${T.border}`,
        boxShadow:T.shadowFloat,
        zIndex:71, animation:"popIn 220ms ease",
      }}>
        {cfg.kind === "empresa" && <CreateEmpresa onClose={()=>ctx.setShowCreate(null)}/>}
        {cfg.kind === "aluno"   && <CreateAluno  empId={cfg.empId} onClose={()=>ctx.setShowCreate(null)}/>}
        {cfg.kind === "coach"   && <CreateCoach  empId={cfg.empId} onClose={()=>ctx.setShowCreate(null)}/>}
      </div>
    </>
  );
}

function ModalShell({ title, subtitle, onClose, children, primary, primaryLabel="Criar" }) {
  return (
    <>
      <div style={{
        padding:"20px 24px",
        borderBottom:`1px solid ${T.borderSoft}`,
        display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:14,
      }}>
        <div>
          <div style={{ fontFamily:T.ui, fontSize:18, fontWeight:600, color:T.fg, letterSpacing:"-0.01em" }}>
            {title}
          </div>
          {subtitle && <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg3, marginTop:4 }}>{subtitle}</div>}
        </div>
        <button onClick={onClose} style={iconBtn()}><IX size={15}/></button>
      </div>
      <div style={{ padding:"20px 24px" }}>{children}</div>
      <div style={{
        padding:"14px 24px", borderTop:`1px solid ${T.borderSoft}`,
        display:"flex", justifyContent:"flex-end", gap:8,
        background:T.surfaceAlt, borderRadius:"0 0 14px 14px",
      }}>
        <Btn ghost sm onClick={onClose}>Cancelar</Btn>
        <Btn primary sm onClick={primary || onClose}><ICheck size={13}/>{primaryLabel}</Btn>
      </div>
    </>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div style={{ display:"inline-flex", gap:4, padding:4,
      background:T.muteSoft, borderRadius:8, width:"100%" }}>
      {options.map(([k,l])=>(
        <button key={k} onClick={()=>onChange(k)} style={{
          flex:1, height:32, borderRadius:6, cursor:"pointer", border:"none",
          background: value===k ? T.surface : "transparent",
          color: value===k ? T.fg : T.fg3,
          fontFamily:T.ui, fontSize:13, fontWeight: value===k ? 600 : 500,
          boxShadow: value===k ? T.shadow1 : "none",
        }}>{l}</button>
      ))}
    </div>
  );
}

function CreateEmpresa({ onClose }) {
  const [f, setF] = useStE({
    name:"", responsible:"", email:"", country:"BR",
    plan:"start", maxStudents:25, maxCoaches:2, status:"trial",
  });
  const set = (k,v)=>setF(s=>({...s, [k]:v}));
  return (
    <ModalShell title="Criar empresa" subtitle="Cadastra um novo cliente operacional."
      onClose={onClose}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Field label="Nome da empresa" span={2}>
          <TextInput value={f.name} onChange={v=>set("name",v)} placeholder="Studio Vértice"/>
        </Field>
        <Field label="Responsável">
          <TextInput value={f.responsible} onChange={v=>set("responsible",v)} placeholder="Carolina Souza"/>
        </Field>
        <Field label="E-mail do responsável">
          <TextInput type="email" value={f.email} onChange={v=>set("email",v)} placeholder="caro@studio.fit"/>
        </Field>
        <Field label="País">
          <SelectInput value={f.country} onChange={v=>set("country",v)}>
            <option value="BR">Brasil</option>
            <option value="IT">Itália</option>
            <option value="PT">Portugal</option>
            <option value="ES">Espanha</option>
          </SelectInput>
        </Field>
        <Field label="Plano">
          <SelectInput value={f.plan} onChange={v=>set("plan",v)}>
            <option value="start">Start</option>
            <option value="pro">Pro</option>
            <option value="custom">Custom</option>
          </SelectInput>
        </Field>
        <Field label="Limite de alunos">
          <TextInput type="number" value={f.maxStudents} onChange={v=>set("maxStudents",v)}/>
        </Field>
        <Field label="Limite de coaches">
          <TextInput type="number" value={f.maxCoaches} onChange={v=>set("maxCoaches",v)}/>
        </Field>
        <Field label="Status inicial" span={2}>
          <Segmented value={f.status} onChange={v=>set("status",v)}
            options={[["trial","Teste"],["active","Ativa"],["paused","Pausada"]]}/>
        </Field>
      </div>
    </ModalShell>
  );
}

function CreateAluno({ empId, onClose }) {
  const [f, setF] = useStE({
    name:"", email:"", phone:"", empresaId:empId ?? "",
    coachId:"", access:"convite",
  });
  const set = (k,v)=>setF(s=>({...s, [k]:v}));
  const empCoaches = f.empresaId ? coachesForEmpresa(f.empresaId) : MOCK_COACHES;
  return (
    <ModalShell title="Criar aluno"
      subtitle={empId ? "Vinculado à empresa selecionada." : "Selecione empresa e coach responsável."}
      onClose={onClose}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Field label="Nome" span={2}>
          <TextInput value={f.name} onChange={v=>set("name",v)} placeholder="Marina Lopes"/>
        </Field>
        <Field label="E-mail">
          <TextInput type="email" value={f.email} onChange={v=>set("email",v)} placeholder="marina@email.com"/>
        </Field>
        <Field label="Telefone">
          <TextInput value={f.phone} onChange={v=>set("phone",v)} placeholder="+55 11 ..."/>
        </Field>
        <Field label="Empresa">
          <SelectInput value={f.empresaId} onChange={v=>{ set("empresaId",v); set("coachId",""); }}>
            <option value="">— Selecionar —</option>
            {MOCK_EMPRESAS.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
          </SelectInput>
        </Field>
        <Field label="Coach responsável">
          <SelectInput value={f.coachId} onChange={v=>set("coachId",v)}>
            <option value="">— Atribuir depois —</option>
            {empCoaches.map(c=><option key={c.userId} value={c.userId}>{c.name}</option>)}
          </SelectInput>
        </Field>
        <Field label="Status de acesso" span={2}
          hint="Um link único é gerado por e-mail e expira em 72 horas.">
          <Segmented value={f.access} onChange={v=>set("access",v)}
            options={[["convite","Convite"],["ativo","Ativo"],["pausado","Pausado"]]}/>
        </Field>
      </div>
    </ModalShell>
  );
}

function CreateCoach({ empId, onClose }) {
  const [f, setF] = useStE({
    name:"", email:"", phone:"", empresaId:empId ?? "",
    permAdjust:true, permSuggest:true,
    status:"ativo",
  });
  const set = (k,v)=>setF(s=>({...s, [k]:v}));
  return (
    <ModalShell title="Criar coach"
      subtitle="Operador limitado. Vê apenas seus alunos. Não aprova catálogo."
      onClose={onClose} primaryLabel="Criar e gerar acesso">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Field label="Nome" span={2}>
          <TextInput value={f.name} onChange={v=>set("name",v)} placeholder="Diego Marques"/>
        </Field>
        <Field label="E-mail">
          <TextInput type="email" value={f.email} onChange={v=>set("email",v)} placeholder="diego@empresa.fit"/>
        </Field>
        <Field label="Telefone">
          <TextInput value={f.phone} onChange={v=>set("phone",v)} placeholder="+55 11 ..."/>
        </Field>
        <Field label="Empresa" span={2}>
          <SelectInput value={f.empresaId} onChange={v=>set("empresaId",v)}>
            <option value="">— Selecionar —</option>
            {MOCK_EMPRESAS.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
          </SelectInput>
        </Field>
        <Field label="Permissões" span={2}>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <PermToggle on={f.permAdjust} onClick={()=>set("permAdjust", !f.permAdjust)}>
              Ajustar treino e dieta dos alunos atribuídos
            </PermToggle>
            <PermToggle on={f.permSuggest} onClick={()=>set("permSuggest", !f.permSuggest)}>
              Sugerir exercícios e alimentos para o catálogo
            </PermToggle>
            <PermToggle on={false} disabled>
              Aprovar exercícios / alimentos <span style={{ color:T.fg4 }}>(restrito ao super admin)</span>
            </PermToggle>
            <PermToggle on={false} disabled>
              Criar / pausar empresa <span style={{ color:T.fg4 }}>(restrito ao super admin)</span>
            </PermToggle>
          </div>
        </Field>
        <Field label="Status" span={2}>
          <Segmented value={f.status} onChange={v=>set("status",v)}
            options={[["ativo","Ativo"],["pausado","Pausado"]]}/>
        </Field>
      </div>
    </ModalShell>
  );
}

function PermToggle({ on, onClick, disabled, children }) {
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      display:"flex", alignItems:"center", gap:10,
      padding:"10px 12px", borderRadius:8,
      background: disabled ? T.surfaceAlt : on ? T.brandSoft : T.surface,
      border: `1px solid ${on && !disabled ? T.brandLine : T.border}`,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.65 : 1,
      textAlign:"left", width:"100%",
    }}>
      <span style={{
        width:18, height:18, borderRadius:5, flexShrink:0,
        background: on && !disabled ? T.brandStrong : T.surface,
        border:`1px solid ${on && !disabled ? T.brandStrong : T.borderStrong}`,
        display:"grid", placeItems:"center", color:"#fff",
      }}>{on && !disabled ? <ICheck size={11} sw={3}/> : null}</span>
      <span style={{ fontFamily:T.ui, fontSize:13, color: T.fg2 }}>{children}</span>
    </button>
  );
}

Object.assign(window, { EmpresaDrawer, StudentDrawer, CreateModal, DrawerShell });
