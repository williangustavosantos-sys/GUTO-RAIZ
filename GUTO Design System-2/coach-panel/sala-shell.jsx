// GUTO Sala de Controle — Shell (tokens, atoms, sidebar, header)
// Replaces panel-shell.jsx for the Sala de Controle entry point.

/* ── TOKENS ──────────────────────────────────────────────────────────────── */
const T = {
  ink:       "#04060f",
  bg:        "#080e1c",
  panel:     "rgba(15,22,42,0.86)",
  panelDp:   "rgba(8,12,26,0.92)",
  panelHi:   "rgba(22,32,58,0.90)",
  border:    "rgba(82,231,255,0.10)",
  borderHi:  "rgba(82,231,255,0.26)",
  fg:        "#e8f4ff",
  fg2:       "rgba(232,244,255,0.60)",
  fg3:       "rgba(232,244,255,0.38)",
  fg4:       "rgba(232,244,255,0.18)",
  cyan:      "#52e7ff",
  cyanSoft:  "rgba(82,231,255,0.14)",
  cyanLine:  "rgba(82,231,255,0.24)",
  ok:        "#4ade80",   okS: "rgba(74,222,128,0.13)",
  warn:      "#fbbf24",   warnS: "rgba(251,191,36,0.13)",
  bad:       "#f87171",   badS: "rgba(248,113,113,0.13)",
  mono: '"JetBrains Mono","SF Mono",Menlo,Monaco,Consolas,monospace',
};

/* ── ATOMS ───────────────────────────────────────────────────────────────── */
const Plate = ({ children, style={}, dp, hi, glow }) => (
  <div style={{
    background: dp ? T.panelDp : hi ? T.panelHi : T.panel,
    border: `1px solid ${glow ? T.cyanLine : T.border}`,
    borderRadius: 14,
    boxShadow: glow
      ? `0 0 28px rgba(82,231,255,0.15), inset 0 0 0 1px ${T.cyanLine}`
      : "0 4px 20px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
    ...style,
  }}>{children}</div>
);

const Kicker = ({ children, cyan, style={} }) => (
  <span style={{
    fontFamily: T.mono, fontSize: 9, fontWeight: 900,
    letterSpacing: "0.28em", textTransform: "uppercase",
    color: cyan ? T.cyan : T.fg3, ...style,
  }}>{children}</span>
);

const Label = ({ children, style={} }) => (
  <span style={{
    display: "block", fontFamily: T.mono, fontSize: 10, fontWeight: 900,
    letterSpacing: "0.22em", textTransform: "uppercase",
    color: T.fg3, marginBottom: 6, ...style,
  }}>{children}</span>
);

const Pill = ({ tone="neutral", children, style={} }) => {
  const map = {
    neutral: { bg:"rgba(232,244,255,0.06)", fg:T.fg2, bd:"rgba(232,244,255,0.10)" },
    cyan:    { bg:T.cyanSoft, fg:T.cyan, bd:T.cyanLine },
    ok:      { bg:T.okS,   fg:T.ok,   bd:"rgba(74,222,128,0.28)"  },
    warn:    { bg:T.warnS, fg:T.warn, bd:"rgba(251,191,36,0.28)"  },
    bad:     { bg:T.badS,  fg:T.bad,  bd:"rgba(248,113,113,0.28)" },
    mute:    { bg:"rgba(232,244,255,0.04)", fg:T.fg3, bd:"rgba(232,244,255,0.08)" },
  };
  const p = map[tone] ?? map.neutral;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      height:20, padding:"0 9px", borderRadius:999,
      background:p.bg, color:p.fg, border:`1px solid ${p.bd}`,
      fontFamily:T.mono, fontSize:9, fontWeight:900,
      letterSpacing:"0.18em", textTransform:"uppercase",
      ...style,
    }}>{children}</span>
  );
};

const Btn = ({ children, onClick, cyan, ghost, danger, sm, style={}, type }) => (
  <button onClick={onClick} type={type} style={{
    height: sm ? 34 : 40, padding: `0 ${sm ? 12 : 16}px`,
    borderRadius: 999, cursor:"pointer",
    background: cyan
      ? `linear-gradient(135deg,#7df0ff,#1ec5e0)`
      : ghost
        ? "transparent"
        : danger
          ? T.badS
          : "rgba(232,244,255,0.07)",
    color: cyan ? "#04131e" : danger ? T.bad : T.fg,
    border: cyan
      ? "1px solid transparent"
      : ghost
        ? `1px solid ${T.cyanLine}`
        : danger
          ? `1px solid rgba(248,113,113,0.30)`
          : `1px solid ${T.border}`,
    fontFamily: T.mono, fontSize: 10, fontWeight: 900,
    letterSpacing:"0.20em", textTransform:"uppercase",
    boxShadow: cyan ? "0 0 18px rgba(82,231,255,0.28)" : "none",
    transition: "all 160ms ease",
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7,
    flexShrink: 0,
    ...style,
  }}>{children}</button>
);

const SearchBox = ({ value, onChange, placeholder }) => (
  <div style={{ position:"relative", flex:1, maxWidth:340 }}>
    <svg style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:T.fg3, pointerEvents:"none" }}
         viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder ?? "Buscar…"}
      style={{
        width:"100%", height:38, paddingLeft:36, paddingRight:14,
        background:"rgba(0,0,0,0.30)",
        border:`1px solid ${T.border}`,
        borderRadius:10,
        boxShadow:"inset 0 2px 6px rgba(0,0,0,0.45)",
        fontFamily:T.mono, fontSize:12, color:T.fg,
        outline:"none",
      }}
    />
  </div>
);

const DataRow = ({ label, value }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
    borderBottom:`1px solid ${T.border}`, padding:"10px 0",
    fontFamily:T.mono, fontSize:11 }}>
    <span style={{ color:T.fg3 }}>{label}</span>
    <span style={{ color:T.fg, fontWeight:700, textAlign:"right", maxWidth:"60%" }}>{value}</span>
  </div>
);

const SectionTitle = ({ children, action }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
    marginBottom:14 }}>
    <Kicker cyan>{children}</Kicker>
    {action}
  </div>
);

const Field = ({ label, hint, children, span }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6, gridColumn: span ? `span ${span}` : "auto" }}>
    <Label>{label}</Label>
    {children}
    {hint && <span style={{ fontFamily:T.mono, fontSize:9, color:T.fg4, lineHeight:1.5 }}>{hint}</span>}
  </div>
);

const TextInput = ({ value, onChange, placeholder, type="text" }) => (
  <input type={type} value={value ?? ""} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder}
    style={{
      height:40, padding:"0 14px",
      background:"rgba(0,0,0,0.35)",
      border:`1px solid ${T.border}`,
      borderRadius:10,
      boxShadow:"inset 0 2px 6px rgba(0,0,0,0.45)",
      color:T.fg, fontFamily:T.mono, fontSize:12, outline:"none",
    }}
  />
);

const SelectInput = ({ value, onChange, children }) => (
  <select value={value ?? ""} onChange={e=>onChange?.(e.target.value)}
    style={{
      height:40, padding:"0 12px",
      background:"rgba(0,0,0,0.35)",
      border:`1px solid ${T.border}`,
      borderRadius:10,
      boxShadow:"inset 0 2px 6px rgba(0,0,0,0.45)",
      color:T.fg, fontFamily:T.mono, fontSize:12, outline:"none",
    }}>{children}</select>
);

/* ── ICONS ───────────────────────────────────────────────────────────────── */
const SI = ({ d, size=16, sw=1.9 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const IZap      = p=><SI d={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/>} {...p}/>;
const IUsers    = p=><SI d={<g><circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8"/><path d="M22 21a7 7 0 0 0-5-6.7"/></g>} {...p}/>;
const IDumbbell = p=><SI d={<g><path d="M14.4 14.4 9.6 9.6"/><path d="M18.6 21.5a2 2 0 1 1-2.8-2.8M14 19.4l5.4-5.4M5.4 2.5a2 2 0 1 1 2.8 2.8M10 4.6 4.6 10M21.5 21.5l-1.4-1.4M3.9 3.9 2.5 2.5M6.4 12.8a2 2 0 1 1-2.8-2.8M5.3 7.4a2 2 0 1 1-2.8-2.8"/></g>} {...p}/>;
const IFork     = p=><SI d={<g><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7"/></g>} {...p}/>;
const ITrend    = p=><SI d={<g><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></g>} {...p}/>;
const IShield   = p=><SI d={<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/>} {...p}/>;
const IBuilding = p=><SI d={<g><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></g>} {...p}/>;
const ILog      = p=><SI d={<g><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/></g>} {...p}/>;
const IChevL    = p=><SI d={<polyline points="15 18 9 12 15 6"/>} {...p}/>;
const IChevR    = p=><SI d={<polyline points="9 6 15 12 9 18"/>} {...p}/>;
const IPlus     = p=><SI d={<g><path d="M12 5v14"/><path d="M5 12h14"/></g>} {...p}/>;
const IX        = p=><SI d={<g><path d="M18 6 6 18"/><path d="m6 6 12 12"/></g>} {...p}/>;
const ICopy     = p=><SI d={<g><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></g>} {...p}/>;
const ICheck    = p=><SI d={<polyline points="20 6 9 17 4 12"/>} {...p}/>;
const ILock     = p=><SI d={<g><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></g>} {...p}/>;
const ICalib    = p=><SI d={<g><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2 2"/><path d="M16.2 7.8 19 5"/></g>} {...p}/>;
const IHist     = p=><SI d={<g><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></g>} {...p}/>;
const IMenu     = p=><SI d={<g><path d="M3 12h18M3 6h18M3 18h18"/></g>} {...p}/>;
const ITrash    = p=><SI d={<g><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></g>} {...p}/>;
const ISave     = p=><SI d={<g><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></g>} {...p}/>;
const IGavel    = p=><SI d={<g><path d="m14 13-7.5 7.5a2.12 2.12 0 0 1-3-3L11 10"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/></g>} {...p}/>;
const IPlay     = p=><SI d={<polygon points="6 4 20 12 6 20 6 4"/>} {...p}/>;
const IPause    = p=><SI d={<g><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></g>} {...p}/>;
const IBolt     = p=><SI d={<polyline points="8 4 12 4 10 12 14 12 8 22 10 14 6 14 8 4"/>} {...p}/>;
const ISignal   = p=><SI d={<g><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></g>} {...p}/>;
const IGlobe    = p=><SI d={<g><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18"/><path d="M12 3a13 13 0 0 0 0 18"/></g>} {...p}/>;

/* ── SIDEBAR ─────────────────────────────────────────────────────────────── */
const NAV = [
  { id:"hoje",        label:"HOJE",         Icon:IZap      },
  { id:"empresas",    label:"EMPRESAS",     Icon:IBuilding },
  { id:"alunos",      label:"ALUNOS",       Icon:IUsers    },
  { id:"coaches",     label:"COACHES",      Icon:IShield   },
  { id:"treinos",     label:"TREINOS",      Icon:IDumbbell },
  { id:"dietas",      label:"DIETAS",       Icon:IFork     },
  { id:"aprovacoes",  label:"APROVAÇÕES",   Icon:IGavel    },
  { id:"arena",       label:"ARENA",        Icon:ITrend    },
  { id:"logs",        label:"LOGS",         Icon:ILog      },
];

function Sidebar({ collapsed, onToggle }) {
  const ctx = React.useContext(window.PanelCtx);
  const pendingTotal = SYS_TELEMETRY.pendingTotal;
  return (
    <aside style={{
      width: collapsed ? 64 : 232, flexShrink:0,
      height:"100vh", display:"flex", flexDirection:"column",
      background:"linear-gradient(180deg,rgba(4,7,16,0.98) 0%, rgba(4,7,16,0.94) 100%)",
      borderRight:`1px solid ${T.border}`,
      transition:"width 200ms ease",
      overflow:"hidden",
    }}>
      {/* Brand strip */}
      <div style={{
        height:72, display:"flex", alignItems:"center",
        padding: collapsed ? "0 0 0 18px" : "14px 16px 12px",
        borderBottom:`1px solid ${T.border}`,
        gap:10, flexShrink:0,
        background: "radial-gradient(120% 100% at 50% 0%, rgba(82,231,255,0.08) 0%, rgba(82,231,255,0) 70%)",
      }}>
        {!collapsed ? (
          <div style={{ display:"flex", flexDirection:"column", gap:4, flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <img src="logo_guto.png" alt="GUTO"
                style={{ height:20, objectFit:"contain", filter:"brightness(1.15)" }}/>
              <button onClick={onToggle} style={{
                marginLeft:"auto", background:"none", border:"none",
                cursor:"pointer", color:T.fg3, padding:4,
                display:"flex", alignItems:"center",
              }}><IChevL size={15}/></button>
            </div>
            <div style={{ fontFamily:T.mono, fontSize:9, fontWeight:900, color:T.cyan,
              letterSpacing:"0.32em", textTransform:"uppercase",
              textShadow:"0 0 8px rgba(82,231,255,0.5)",
            }}>SALA DE CONTROLE</div>
          </div>
        ) : (
          <div style={{ width:28, height:28, borderRadius:8,
            background:T.cyanSoft, border:`1px solid ${T.cyanLine}`,
            display:"grid", placeItems:"center", color:T.cyan,
            boxShadow:"0 0 14px rgba(82,231,255,0.30)" }}>
            <IShield size={14}/>
          </div>
        )}
      </div>

      {/* Hierarchy stamp */}
      {!collapsed && (
        <div style={{ padding:"10px 16px 6px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontFamily:T.mono, fontSize:8, fontWeight:900, color:T.fg4,
            letterSpacing:"0.30em", textTransform:"uppercase", marginBottom:6 }}>
            HIERARQUIA
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:2,
            fontFamily:T.mono, fontSize:9, color:T.fg3, letterSpacing:"0.10em" }}>
            <span style={{ color:T.cyan, fontWeight:900 }}>SUPER ADMIN</span>
            <span>↳ Empresas</span>
            <span style={{ paddingLeft:12 }}>↳ Coaches</span>
            <span style={{ paddingLeft:24 }}>↳ Alunos</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex:1, overflowY:"auto", padding:"10px 0" }}>
        {NAV.map(({ id, label, Icon }) => {
          const active = ctx.activeScreen === id;
          const badge = id === "aprovacoes" && pendingTotal > 0 ? pendingTotal : null;
          return (
            <button key={id} onClick={() => ctx.setActiveScreen(id)}
              title={collapsed ? label : undefined}
              style={{
                width:"100%", height:40,
                display:"flex", alignItems:"center",
                gap:12, padding: collapsed ? "0 0 0 20px" : "0 16px",
                background: active ? T.cyanSoft : "transparent",
                borderRight: active ? `2px solid ${T.cyan}` : "2px solid transparent",
                border: "none", cursor:"pointer",
                color: active ? T.cyan : T.fg3,
                fontFamily:T.mono, fontSize:10, fontWeight:900,
                letterSpacing:"0.22em", textTransform:"uppercase",
                transition:"all 140ms ease",
                textAlign:"left", position:"relative",
              }}>
              <Icon size={15} sw={active ? 2.2 : 1.8}/>
              {!collapsed && <span style={{ flex:1 }}>{label}</span>}
              {!collapsed && badge && (
                <span style={{
                  background:T.warnS, color:T.warn,
                  border:`1px solid rgba(251,191,36,0.30)`,
                  borderRadius:999, padding:"1px 7px",
                  fontSize:9, fontWeight:900, letterSpacing:"0.04em",
                }}>{badge}</span>
              )}
              {collapsed && badge && (
                <span style={{
                  position:"absolute", top:6, right:8,
                  width:6, height:6, borderRadius:999,
                  background:T.warn, boxShadow:`0 0 6px ${T.warn}`,
                }}/>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / system stamp */}
      {!collapsed ? (
        <div style={{
          borderTop:`1px solid ${T.border}`,
          padding:"12px 16px",
          flexShrink:0,
          background: "rgba(0,0,0,0.30)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:8, height:8, borderRadius:999, background:T.ok,
              boxShadow:`0 0 8px ${T.ok}`, animation:"pulse 1.6s ease-in-out infinite" }}/>
            <div style={{ fontFamily:T.mono, fontSize:10, fontWeight:900, color:T.fg2 }}>
              admin@guto.fit
            </div>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <Pill tone="cyan">SUPER ADMIN</Pill>
          </div>
          <div style={{ marginTop:10, display:"grid", gridTemplateColumns:"1fr 1fr", gap:4,
            fontFamily:T.mono, fontSize:8, color:T.fg4, letterSpacing:"0.18em",
            textTransform:"uppercase" }}>
            <span>BUILD</span><span style={{ color:T.fg3, textAlign:"right" }}>{SYS_TELEMETRY.build}</span>
            <span>REGIÃO</span><span style={{ color:T.fg3, textAlign:"right" }}>{SYS_TELEMETRY.region}</span>
            <span>UPTIME</span><span style={{ color:T.ok, textAlign:"right" }}>{SYS_TELEMETRY.uptimePct}%</span>
          </div>
        </div>
      ) : (
        <button onClick={onToggle} style={{
          background:"none", border:"none", cursor:"pointer",
          color:T.fg3, padding:"14px 0", display:"flex",
          justifyContent:"center",
        }}><IChevR size={15}/></button>
      )}
    </aside>
  );
}

/* ── HEADER ──────────────────────────────────────────────────────────────── */
const SCREEN_TITLES = {
  hoje:        { t:"Hoje",        sub:"Visão geral operacional · super admin" },
  empresas:    { t:"Empresas",    sub:"Cadastros / clientes B2B · operadores" },
  alunos:      { t:"Alunos",      sub:"Todos os alunos · todas as empresas" },
  coaches:     { t:"Coaches",     sub:"Operadores limitados · permissões" },
  treinos:     { t:"Treinos",     sub:"Fila editorial · ordenada por urgência" },
  dietas:      { t:"Dietas",      sub:"Fila editorial · ordenada por urgência" },
  aprovacoes:  { t:"Aprovações",  sub:"Itens pendentes para o catálogo GUTO" },
  arena:       { t:"Arena",       sub:"Ranking competitivo · todos os alunos" },
  logs:        { t:"Logs",        sub:"Auditoria do sistema · super admin" },
};

function Header() {
  const ctx = React.useContext(window.PanelCtx);
  const meta = SCREEN_TITLES[ctx.activeScreen] ?? { t:ctx.activeScreen, sub:"" };
  const cta = headerCta(ctx);
  return (
    <header style={{
      height:64, flexShrink:0,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 24px",
      background:"linear-gradient(180deg, rgba(8,14,28,0.96) 0%, rgba(8,14,28,0.84) 100%)",
      borderBottom:`1px solid ${T.border}`,
      backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)",
      position:"sticky", top:0, zIndex:20,
      gap:24,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:16, minWidth:0 }}>
        <div>
          <div style={{ fontFamily:T.mono, fontSize:8, fontWeight:900, color:T.cyan,
            letterSpacing:"0.34em", textTransform:"uppercase", marginBottom:3,
            textShadow:"0 0 8px rgba(82,231,255,0.4)" }}>
            SALA DE CONTROLE / {ctx.activeScreen.toUpperCase()}
          </div>
          <div style={{ fontFamily:T.mono, fontSize:18, fontWeight:900, color:T.fg, letterSpacing:"-0.01em", lineHeight:1 }}>
            {meta.t}
          </div>
        </div>
        <div style={{ height:36, width:1, background:T.border }}/>
        <div style={{ fontFamily:T.mono, fontSize:10, color:T.fg3, letterSpacing:"0.10em", maxWidth:340 }}>
          {meta.sub}
        </div>
      </div>

      {/* Telemetry strip */}
      <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <TelemetryStamp icon={<ISignal size={10}/>} label="SYS" value="ONLINE" tone="ok"/>
        <TelemetryStamp icon={<IGlobe size={10}/>}  label="EMPRESAS" value={`${MOCK_EMPRESAS.length}`}/>
        <TelemetryStamp icon={<IUsers size={10}/>}  label="ALUNOS"   value={`${MOCK_STUDENTS.length}`}/>
        <TelemetryStamp icon={<IGavel size={10}/>}  label="PEND."    value={`${SYS_TELEMETRY.pendingTotal}`} tone={SYS_TELEMETRY.pendingTotal>0?"warn":"ok"}/>
        {cta && <div style={{ width:1, height:24, background:T.border, margin:"0 4px" }}/>}
        {cta}
      </div>
    </header>
  );
}

function TelemetryStamp({ icon, label, value, tone="neutral" }) {
  const c = tone === "ok" ? T.ok : tone === "warn" ? T.warn : tone === "bad" ? T.bad : T.cyan;
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:8,
      padding:"6px 10px", borderRadius:8,
      background:"rgba(0,0,0,0.35)",
      border:`1px solid ${T.border}`,
    }}>
      <span style={{ color:c, display:"flex" }}>{icon}</span>
      <span style={{ fontFamily:T.mono, fontSize:8, fontWeight:900, color:T.fg4,
        letterSpacing:"0.22em", textTransform:"uppercase" }}>{label}</span>
      <span style={{ fontFamily:T.mono, fontSize:10, fontWeight:900, color:c, letterSpacing:"0.04em" }}>
        {value}
      </span>
    </div>
  );
}

function headerCta(ctx) {
  if (ctx.activeScreen === "empresas") return <Btn cyan sm onClick={()=>ctx.setShowCreate("empresa")}><IPlus size={12}/>Empresa</Btn>;
  if (ctx.activeScreen === "coaches")  return <Btn cyan sm onClick={()=>ctx.setShowCreate("coach")}><IPlus size={12}/>Coach</Btn>;
  if (ctx.activeScreen === "alunos")   return <Btn cyan sm onClick={()=>ctx.setShowCreate("aluno")}><IPlus size={12}/>Aluno</Btn>;
  return null;
}

Object.assign(window, {
  T, Plate, Kicker, Label, Pill, Btn, SearchBox, DataRow, SectionTitle, Field, TextInput, SelectInput,
  SI, IZap, IUsers, IDumbbell, IFork, ITrend, IShield, IBuilding, ILog,
  IChevL, IChevR, IPlus, IX, ICopy, ICheck, ILock, ICalib, IHist, IMenu, ITrash, ISave,
  IGavel, IPlay, IPause, IBolt, ISignal, IGlobe,
  Sidebar, Header,
});
