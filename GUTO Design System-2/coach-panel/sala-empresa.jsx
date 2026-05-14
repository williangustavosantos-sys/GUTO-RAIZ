// GUTO Sala de Controle — Empresa Drawer (right-side overlay)
// Tabs: Resumo · Alunos · Coaches · Plano/Acesso · Logs

const { useState: useStE, useContext: useCtxE } = React;

const EMP_TABS = [
  { id:"resumo",   label:"RESUMO",    Icon:()=><IBuilding size={13}/> },
  { id:"alunos",   label:"ALUNOS",    Icon:()=><IUsers size={13}/>    },
  { id:"coaches",  label:"COACHES",   Icon:()=><IShield size={13}/>   },
  { id:"plano",    label:"PLANO",     Icon:()=><ILock size={13}/>     },
  { id:"logs",     label:"LOGS",      Icon:()=><ILog size={13}/>      },
];

function EmpResumo({ emp }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
      <Plate style={{ padding:"18px 20px", gridColumn:"1 / -1" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <Kicker cyan>STATUS</Kicker>
          <Pill tone={empresaStatusTone(emp.status)}>{empresaStatusLabel(emp.status)}</Pill>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          <Mini label="Plano" value={planLabel(emp.plan)}/>
          <Mini label="País"  value={emp.country}/>
          <Mini label="Criada em" value={emp.createdAt}/>
          <Mini label="Última atividade" value={relativeTime(emp.lastActivityAt)}/>
        </div>
      </Plate>

      <Plate style={{ padding:"18px 20px" }}>
        <Kicker cyan style={{ display:"block", marginBottom:14 }}>USO ATUAL</Kicker>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <UsageRow label="Alunos ativos"  value={emp.usage.students} max={emp.maxStudents}/>
          <UsageRow label="Coaches ativos" value={emp.usage.coaches}  max={emp.maxCoaches}/>
        </div>
      </Plate>

      <Plate style={{ padding:"18px 20px" }}>
        <Kicker cyan style={{ display:"block", marginBottom:14 }}>RESPONSÁVEL</Kicker>
        <DataRow label="Nome"   value={emp.responsible}/>
        <DataRow label="E-mail" value={emp.email}/>
        <DataRow label="País"   value={emp.country}/>
      </Plate>

      <Plate style={{ padding:"18px 20px", gridColumn:"1 / -1" }}>
        <Kicker cyan style={{ display:"block", marginBottom:12 }}>AÇÕES (SUPER ADMIN)</Kicker>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Btn cyan sm><ISave size={11}/>Editar empresa</Btn>
          {emp.status === "paused" || emp.status === "overdue"
            ? <Btn ghost sm><IPlay size={11}/>Ativar</Btn>
            : <Btn ghost sm><IPause size={11}/>Pausar</Btn>}
          <Btn ghost sm><IBolt size={11}/>Forçar sincronização</Btn>
          <Btn ghost sm><ICopy size={11}/>Copiar ID ({emp.id})</Btn>
          <Btn danger sm><ITrash size={11}/>Arquivar</Btn>
        </div>
      </Plate>
    </div>
  );
}

function UsageRow({ label, value, max }) {
  const pct = Math.min(100, max ? (value/max)*100 : 0);
  const tone = pct >= 95 ? T.bad : pct >= 80 ? T.warn : T.cyan;
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between",
        fontFamily:T.mono, fontSize:10, marginBottom:6 }}>
        <span style={{ color:T.fg3, letterSpacing:"0.16em", textTransform:"uppercase" }}>{label}</span>
        <span style={{ color:T.fg, fontWeight:900 }}>{value} / {max}</span>
      </div>
      <div style={{ height:6, background:"rgba(0,0,0,0.45)", borderRadius:99, overflow:"hidden",
        boxShadow:"inset 0 1px 3px rgba(0,0,0,0.6)" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:tone,
          boxShadow:`0 0 10px ${tone}`, transition:"width 200ms ease" }}/>
      </div>
    </div>
  );
}

function EmpAlunos({ emp }) {
  const ctx = useCtxE(window.PanelCtx);
  const list = studentsForEmpresa(emp.id);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <Kicker cyan>{list.length} ALUNO{list.length===1?"":"S"} VINCULADO{list.length===1?"":"S"}</Kicker>
        <div style={{ display:"flex", gap:6 }}>
          <Btn ghost sm><IShield size={11}/>Vincular coach</Btn>
          <Btn cyan sm onClick={()=>ctx.setShowCreate({ kind:"aluno", empId:emp.id })}>
            <IPlus size={11}/>Aluno
          </Btn>
        </div>
      </div>
      {list.map(s => (
        <button key={s.id} onClick={()=>ctx.openStudent(s)}
          style={{
            display:"grid", gridTemplateColumns:"1fr auto auto auto auto",
            gap:14, alignItems:"center", padding:"12px 14px",
            background:"rgba(0,0,0,0.20)", border:`1px solid ${T.border}`,
            borderRadius:10, cursor:"pointer", textAlign:"left",
          }}>
          <div style={{ minWidth:0 }}>
            <div style={{ fontFamily:T.mono, fontSize:12, fontWeight:700, color:T.fg, marginBottom:2,
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
            <div style={{ fontFamily:T.mono, fontSize:9, color:T.fg3 }}>{coachName(s.coachId)}</div>
          </div>
          <RiskPill student={s}/>
          <span style={{ fontFamily:T.mono, fontSize:10, color:T.cyan, fontWeight:700 }}>{s.weeklyXp} XP</span>
          <span style={{
            padding:"4px 9px", borderRadius:6,
            border:`1px solid ${T.cyanLine}`, background:T.cyanSoft,
            fontFamily:T.mono, fontSize:8, fontWeight:900, letterSpacing:"0.20em",
            color:T.cyan, textTransform:"uppercase",
          }}>Abrir</span>
          <IChevR size={12} style={{ color:T.fg4 }}/>
        </button>
      ))}
      {!list.length && (
        <Plate style={{ padding:"32px 20px", textAlign:"center" }}>
          <div style={{ fontFamily:T.mono, fontSize:11, color:T.fg3 }}>
            Nenhum aluno vinculado a esta empresa.
          </div>
        </Plate>
      )}
    </div>
  );
}

function EmpCoaches({ emp }) {
  const ctx = useCtxE(window.PanelCtx);
  const list = coachesForEmpresa(emp.id);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <Kicker cyan>{list.length} COACH{list.length===1?"":"ES"} VINCULADO{list.length===1?"":"S"}</Kicker>
        <Btn cyan sm onClick={()=>ctx.setShowCreate({ kind:"coach", empId:emp.id })}>
          <IPlus size={11}/>Coach
        </Btn>
      </div>
      {list.map(c => {
        const studentsCount = MOCK_STUDENTS.filter(s => s.coachId === c.userId).length;
        return (
          <Plate key={c.userId} style={{ padding:"14px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, minWidth:0 }}>
                <div style={{
                  width:34, height:34, borderRadius:8,
                  background:T.cyanSoft, border:`1px solid ${T.cyanLine}`,
                  display:"grid", placeItems:"center", color:T.cyan, flexShrink:0,
                }}><IShield size={13}/></div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:T.mono, fontSize:12, fontWeight:700, color:T.fg }}>{c.name}</div>
                  <div style={{ fontFamily:T.mono, fontSize:9, color:T.fg3,
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.email}</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontFamily:T.mono, fontSize:10, color:T.fg3, letterSpacing:"0.10em" }}>
                  <span style={{ color:T.cyan, fontWeight:900 }}>{studentsCount}</span> alunos
                </span>
                <Pill tone={c.active ? "ok" : "mute"}>{c.active ? "ATIVO" : "PAUSADO"}</Pill>
                <Btn ghost sm>{c.active ? "Pausar" : "Ativar"}</Btn>
              </div>
            </div>
          </Plate>
        );
      })}
    </div>
  );
}

function EmpPlano({ emp }) {
  const PLANS = [
    { id:"start",  name:"START",  pStudents:25, pCoaches:2, price:"R$ 99/mês"  },
    { id:"pro",    name:"PRO",    pStudents:60, pCoaches:5, price:"R$ 299/mês" },
    { id:"custom", name:"CUSTOM", pStudents:"∞", pCoaches:"∞", price:"sob consulta" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <Plate style={{ padding:"18px 20px" }}>
        <Kicker cyan style={{ display:"block", marginBottom:14 }}>PLANO ATUAL</Kicker>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {PLANS.map(p => (
            <div key={p.id} style={{
              padding:"14px", borderRadius:12,
              background: p.id === emp.plan ? T.cyanSoft : "rgba(0,0,0,0.20)",
              border: p.id === emp.plan ? `1px solid ${T.cyanLine}` : `1px solid ${T.border}`,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <span style={{ fontFamily:T.mono, fontSize:13, fontWeight:900,
                  color: p.id === emp.plan ? T.cyan : T.fg, letterSpacing:"0.18em" }}>{p.name}</span>
                {p.id === emp.plan && <Pill tone="cyan">EM USO</Pill>}
              </div>
              <div style={{ fontFamily:T.mono, fontSize:11, color:T.fg2, marginBottom:6 }}>{p.price}</div>
              <div style={{ fontFamily:T.mono, fontSize:9, color:T.fg3, lineHeight:1.6 }}>
                até {p.pStudents} alunos<br/>até {p.pCoaches} coaches
              </div>
            </div>
          ))}
        </div>
      </Plate>

      <Plate style={{ padding:"18px 20px" }}>
        <Kicker cyan style={{ display:"block", marginBottom:14 }}>LIMITES OPERACIONAIS</Kicker>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Field label="Limite de alunos">
            <TextInput value={emp.maxStudents} onChange={()=>{}}/>
          </Field>
          <Field label="Limite de coaches">
            <TextInput value={emp.maxCoaches} onChange={()=>{}}/>
          </Field>
        </div>
      </Plate>

      <Plate style={{ padding:"18px 20px" }}>
        <Kicker cyan style={{ display:"block", marginBottom:8 }}>ACESSO</Kicker>
        <p style={{ fontFamily:T.mono, fontSize:10, color:T.fg3, lineHeight:1.6, marginBottom:14 }}>
          No MVP a empresa é uma entidade operacional. Não tem painel próprio nem login. O super admin controla.
        </p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Btn ghost sm><ICopy size={11}/>Copiar ID</Btn>
          {emp.status === "paused" || emp.status === "overdue"
            ? <Btn cyan sm><IPlay size={11}/>Reativar empresa</Btn>
            : <Btn ghost sm><IPause size={11}/>Pausar empresa</Btn>}
        </div>
      </Plate>
    </div>
  );
}

function EmpLogs({ emp }) {
  const items = MOCK_LOGS.slice(0, 6);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <Kicker cyan style={{ display:"block", marginBottom:6 }}>EVENTOS DESTA EMPRESA</Kicker>
      {items.map(log=>(
        <Plate key={log.id} dp style={{ padding:"12px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}>
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:T.mono, fontSize:11, fontWeight:900, color:T.fg,
                letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:2 }}>{log.action}</div>
              <div style={{ fontFamily:T.mono, fontSize:9, color:T.fg3 }}>
                {log.actorRole} · {log.actorUserId}
              </div>
            </div>
            <span style={{ fontFamily:T.mono, fontSize:9, color:T.fg4, whiteSpace:"nowrap" }}>
              {new Date(log.timestamp).toLocaleString("pt-BR")}
            </span>
          </div>
        </Plate>
      ))}
    </div>
  );
}

function EmpresaDrawer() {
  const ctx = useCtxE(window.PanelCtx);
  const [tab, setTab] = useStE("resumo");
  if (!ctx.empresa) return null;
  const e = ctx.empresa;

  return (
    <>
      <div onClick={ctx.closeEmpresa} style={{
        position:"fixed", inset:0, background:"rgba(2,5,13,0.72)",
        backdropFilter:"blur(2px)", zIndex:60, animation:"fadeIn 200ms ease",
      }}/>
      <aside style={{
        position:"fixed", top:0, right:0, bottom:0,
        width:"min(960px, 96vw)",
        background:T.ink, borderLeft:`1px solid ${T.cyanLine}`,
        boxShadow:"-30px 0 60px rgba(0,0,0,0.6), inset 1px 0 0 rgba(82,231,255,0.18)",
        zIndex:61, display:"flex", flexDirection:"column",
        animation:"slideInRight 220ms ease",
      }}>
        {/* Title bar */}
        <div style={{
          padding:"18px 28px", borderBottom:`1px solid ${T.border}`,
          background: "linear-gradient(180deg, rgba(82,231,255,0.06) 0%, rgba(82,231,255,0) 100%)",
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, minWidth:0 }}>
              <div style={{
                width:42, height:42, borderRadius:10,
                background:T.cyanSoft, border:`1px solid ${T.cyanLine}`,
                display:"grid", placeItems:"center", color:T.cyan, flexShrink:0,
                boxShadow:"0 0 14px rgba(82,231,255,0.20)",
              }}><IBuilding size={18}/></div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:T.mono, fontSize:8, fontWeight:900, color:T.cyan,
                  letterSpacing:"0.32em", textTransform:"uppercase", marginBottom:3 }}>
                  EMPRESA / {e.id}
                </div>
                <div style={{ fontFamily:T.mono, fontSize:18, fontWeight:900, color:T.fg }}>
                  {e.name}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
              <Pill tone={empresaStatusTone(e.status)}>{empresaStatusLabel(e.status)}</Pill>
              <Pill tone="neutral">{planLabel(e.plan)}</Pill>
              <button onClick={ctx.closeEmpresa} style={{
                width:34, height:34, borderRadius:8,
                background:"rgba(232,244,255,0.06)", border:`1px solid ${T.border}`,
                color:T.fg2, cursor:"pointer", display:"grid", placeItems:"center",
              }}><IX size={14}/></button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display:"flex", padding:"0 28px",
          borderBottom:`1px solid ${T.border}`, gap:24,
        }}>
          {EMP_TABS.map(({ id, label, Icon })=>{
            const active = tab===id;
            return (
              <button key={id} onClick={()=>setTab(id)} style={{
                background:"none", border:"none", cursor:"pointer",
                padding:"14px 0", color: active ? T.cyan : T.fg3,
                fontFamily:T.mono, fontSize:10, fontWeight:900,
                letterSpacing:"0.22em", textTransform:"uppercase",
                borderBottom: active ? `2px solid ${T.cyan}` : "2px solid transparent",
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
      </aside>
    </>
  );
}

/* ── Create flows ────────────────────────────────────────────────────────── */
function CreateModal() {
  const ctx = useCtxE(window.PanelCtx);
  if (!ctx.showCreate) return null;
  const cfg = typeof ctx.showCreate === "string" ? { kind:ctx.showCreate } : ctx.showCreate;
  return (
    <>
      <div onClick={()=>ctx.setShowCreate(null)} style={{
        position:"fixed", inset:0, background:"rgba(2,5,13,0.78)",
        backdropFilter:"blur(2px)", zIndex:70, animation:"fadeIn 180ms ease",
      }}/>
      <div style={{
        position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:"min(620px,94vw)", maxHeight:"90vh", overflowY:"auto",
        background:T.ink, borderRadius:18,
        border:`1px solid ${T.cyanLine}`,
        boxShadow:"0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(82,231,255,0.12)",
        zIndex:71, animation:"popIn 220ms ease",
      }}>
        {cfg.kind === "empresa" && <CreateEmpresa onClose={()=>ctx.setShowCreate(null)}/>}
        {cfg.kind === "aluno"   && <CreateAluno  empId={cfg.empId} onClose={()=>ctx.setShowCreate(null)}/>}
        {cfg.kind === "coach"   && <CreateCoach  empId={cfg.empId} onClose={()=>ctx.setShowCreate(null)}/>}
      </div>
    </>
  );
}

function ModalShell({ kicker, title, subtitle, onClose, children, primary, primaryLabel="Criar" }) {
  return (
    <>
      <div style={{
        padding:"20px 28px", borderBottom:`1px solid ${T.border}`,
        background:"linear-gradient(180deg, rgba(82,231,255,0.08) 0%, rgba(82,231,255,0) 100%)",
        display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16,
      }}>
        <div>
          <div style={{ fontFamily:T.mono, fontSize:8, fontWeight:900, color:T.cyan,
            letterSpacing:"0.32em", textTransform:"uppercase", marginBottom:5 }}>{kicker}</div>
          <div style={{ fontFamily:T.mono, fontSize:18, fontWeight:900, color:T.fg }}>{title}</div>
          {subtitle && <div style={{ fontFamily:T.mono, fontSize:10, color:T.fg3, marginTop:4 }}>{subtitle}</div>}
        </div>
        <button onClick={onClose} style={{
          width:34, height:34, borderRadius:8,
          background:"rgba(232,244,255,0.06)", border:`1px solid ${T.border}`,
          color:T.fg2, cursor:"pointer", display:"grid", placeItems:"center",
        }}><IX size={14}/></button>
      </div>
      <div style={{ padding:"22px 28px" }}>{children}</div>
      <div style={{
        padding:"16px 28px", borderTop:`1px solid ${T.border}`,
        display:"flex", justifyContent:"flex-end", gap:8,
        background:"rgba(0,0,0,0.30)",
      }}>
        <Btn ghost sm onClick={onClose}>Cancelar</Btn>
        <Btn cyan sm onClick={primary || onClose}><ICheck size={11}/>{primaryLabel}</Btn>
      </div>
    </>
  );
}

function CreateEmpresa({ onClose }) {
  const [f, setF] = useStE({
    name:"", responsible:"", email:"", country:"BR",
    plan:"start", maxStudents:25, maxCoaches:2, status:"trial",
  });
  const set = (k,v)=>setF(s=>({...s, [k]:v}));
  return (
    <ModalShell kicker="SUPER ADMIN / NOVA" title="Criar empresa"
      subtitle="Cadastra um novo cliente operacional." onClose={onClose}>
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
            <option value="start">START</option>
            <option value="pro">PRO</option>
            <option value="custom">CUSTOM</option>
          </SelectInput>
        </Field>
        <Field label="Limite de alunos">
          <TextInput type="number" value={f.maxStudents} onChange={v=>set("maxStudents",v)}/>
        </Field>
        <Field label="Limite de coaches">
          <TextInput type="number" value={f.maxCoaches} onChange={v=>set("maxCoaches",v)}/>
        </Field>
        <Field label="Status inicial" span={2}>
          <div style={{ display:"flex", gap:6 }}>
            {[["trial","Teste"],["active","Ativa"],["paused","Pausada"]].map(([k,l])=>(
              <button key={k} onClick={()=>set("status",k)} style={{
                flex:1, height:38, borderRadius:8,
                border: f.status===k ? `1px solid ${T.cyan}` : `1px solid ${T.border}`,
                background: f.status===k ? T.cyanSoft : "transparent",
                color: f.status===k ? T.cyan : T.fg3,
                fontFamily:T.mono, fontSize:9, fontWeight:900, letterSpacing:"0.20em",
                textTransform:"uppercase", cursor:"pointer",
              }}>{l}</button>
            ))}
          </div>
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
    <ModalShell kicker="SUPER ADMIN / NOVO" title="Criar aluno"
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
        <Field label="Status de acesso" span={2}>
          <div style={{ display:"flex", gap:6 }}>
            {[["convite","Aguardando convite"],["ativo","Ativo"],["pausado","Pausado"]].map(([k,l])=>(
              <button key={k} onClick={()=>set("access",k)} style={{
                flex:1, height:38, borderRadius:8,
                border: f.access===k ? `1px solid ${T.cyan}` : `1px solid ${T.border}`,
                background: f.access===k ? T.cyanSoft : "transparent",
                color: f.access===k ? T.cyan : T.fg3,
                fontFamily:T.mono, fontSize:9, fontWeight:900, letterSpacing:"0.20em",
                textTransform:"uppercase", cursor:"pointer",
              }}>{l}</button>
            ))}
          </div>
        </Field>
        <Field span={2} hint="Um link único é gerado e enviado por e-mail. Expira em 72h.">
          <Btn ghost sm style={{ width:"fit-content" }}><ICopy size={11}/>Gerar convite</Btn>
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
    <ModalShell kicker="SUPER ADMIN / NOVO" title="Criar coach"
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
              Ajustar treino / dieta dos alunos atribuídos
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
          <div style={{ display:"flex", gap:6 }}>
            {[["ativo","Ativo"],["pausado","Pausado"]].map(([k,l])=>(
              <button key={k} onClick={()=>set("status",k)} style={{
                flex:1, height:38, borderRadius:8,
                border: f.status===k ? `1px solid ${T.cyan}` : `1px solid ${T.border}`,
                background: f.status===k ? T.cyanSoft : "transparent",
                color: f.status===k ? T.cyan : T.fg3,
                fontFamily:T.mono, fontSize:9, fontWeight:900, letterSpacing:"0.20em",
                textTransform:"uppercase", cursor:"pointer",
              }}>{l}</button>
            ))}
          </div>
        </Field>
      </div>
    </ModalShell>
  );
}

function PermToggle({ on, onClick, disabled, children }) {
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      display:"flex", alignItems:"center", gap:12,
      padding:"10px 14px", borderRadius:10,
      background: disabled ? "rgba(0,0,0,0.20)" : on ? T.cyanSoft : "rgba(0,0,0,0.30)",
      border: `1px solid ${on && !disabled ? T.cyanLine : T.border}`,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.55 : 1,
      textAlign:"left",
    }}>
      <span style={{
        width:18, height:18, borderRadius:5, flexShrink:0,
        background: on && !disabled ? T.cyan : "transparent",
        border:`1px solid ${on && !disabled ? T.cyan : T.fg4}`,
        display:"grid", placeItems:"center",
        color:"#04131e",
      }}>{on && !disabled ? <ICheck size={11} sw={3}/> : null}</span>
      <span style={{ fontFamily:T.mono, fontSize:11, color: on && !disabled ? T.fg : T.fg2 }}>
        {children}
      </span>
    </button>
  );
}

Object.assign(window, { EmpresaDrawer, CreateModal });
