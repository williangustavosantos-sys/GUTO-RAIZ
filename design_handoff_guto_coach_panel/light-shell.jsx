// GUTO Sala de Controle — Light theme shell (tokens, atoms, sidebar, header)
// Premium, readable, organized. Inter for UI. JetBrains Mono only for numbers/IDs.

/* ── TOKENS ──────────────────────────────────────────────────────────────── */
const T = {
  // Content backgrounds — warm off-white, not sterile
  bg:           "#F0F2F5",
  bgAlt:        "#E8EBF0",
  surface:      "#FFFFFF",
  surfaceAlt:   "#F7F8FA",
  surfaceHover: "#F2F4F7",

  // Sidebar — deep navy, brand atmosphere
  sidebar:         "#0B1120",
  sidebarBorder:   "rgba(255,255,255,0.07)",
  sidebarHover:    "rgba(255,255,255,0.06)",
  sidebarActive:   "rgba(82,231,255,0.13)",
  sidebarActiveBd: "rgba(82,231,255,0.60)",
  sidebarFg:       "rgba(255,255,255,0.72)",
  sidebarFgActive: "#FFFFFF",
  sidebarFgMuted:  "rgba(255,255,255,0.32)",
  sidebarFgGroup:  "rgba(255,255,255,0.28)",

  // Text — slate ramp (content area)
  fg:   "#0F172A",
  fg2:  "#334155",
  fg3:  "#64748B",
  fg4:  "#94A3B8",
  fg5:  "#CBD5E1",

  // Borders
  border:        "#DDE1E8",
  borderStrong:  "#C8CDD6",
  borderSoft:    "#EAECF0",

  // Brand cyan — in content area use darker for a11y
  brand:        "#0E7490",
  brandStrong:  "#0891B2",
  brandDeep:    "#155E75",
  brandSoft:    "#ECFEFF",
  brandSoft2:   "#CFFAFE",
  brandLine:    "#A5F3FC",
  cyan:         "#52e7ff",   // full brand cyan (used in sidebar)
  cyanGlow:     "rgba(82,231,255,0.18)",

  // Status
  ok:     "#15803D", okSoft:"#DCFCE7", okLine:"#BBF7D0",
  warn:   "#B45309", warnSoft:"#FEF3C7", warnLine:"#FDE68A",
  bad:    "#B91C1C", badSoft:"#FEE2E2", badLine:"#FECACA",
  info:   "#1D4ED8", infoSoft:"#DBEAFE", infoLine:"#BFDBFE",
  mute:   "#475569", muteSoft:"#F1F5F9", muteLine:"#E2E8F0",

  // Type
  ui:   '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, monospace',

  // Shadows — slightly richer on the warm bg
  shadow1: "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
  shadow2: "0 4px 12px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.05)",
  shadow3: "0 12px 32px rgba(15,23,42,0.10), 0 4px 12px rgba(15,23,42,0.07)",
  shadowFloat: "0 24px 60px rgba(15,23,42,0.20), 0 8px 24px rgba(15,23,42,0.10)",
};

/* ── ATOMS ───────────────────────────────────────────────────────────────── */
const Card = ({ children, style={}, padded, hoverable, accent }) => (
  <div style={{
    background: T.surface,
    border: `1px solid ${accent ? T.brandLine : T.border}`,
    borderRadius: 12,
    boxShadow: accent ? "0 1px 2px rgba(8,145,178,0.06)" : T.shadow1,
    padding: padded ? "20px 22px" : 0,
    transition: hoverable ? "border-color 140ms ease, box-shadow 140ms ease" : undefined,
    ...style,
  }}>{children}</div>
);

const SectionHeader = ({ title, subtitle, action, style={} }) => (
  <div style={{
    display:"flex", alignItems:"center", justifyContent:"space-between",
    marginBottom:14, gap:16, ...style,
  }}>
    <div style={{ minWidth:0 }}>
      <div style={{ fontFamily:T.ui, fontSize:14, fontWeight:600, color:T.fg, letterSpacing:"-0.005em" }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg3, marginTop:2 }}>
          {subtitle}
        </div>
      )}
    </div>
    {action}
  </div>
);

// Kicker: tiny ALL CAPS micro-eyebrow used sparingly — only for the smallest contextual labels.
const Kicker = ({ children, style={}, brand }) => (
  <span style={{
    fontFamily:T.ui, fontSize:10.5, fontWeight:600,
    letterSpacing:"0.10em", textTransform:"uppercase",
    color: brand ? T.brand : T.fg4, ...style,
  }}>{children}</span>
);

const Label = ({ children, style={} }) => (
  <span style={{
    display:"block", fontFamily:T.ui, fontSize:12.5, fontWeight:500,
    color:T.fg2, marginBottom:6, ...style,
  }}>{children}</span>
);

const Pill = ({ tone="mute", children, style={}, dot }) => {
  const map = {
    mute:    { bg:T.muteSoft, fg:T.mute, bd:T.muteLine },
    brand:   { bg:T.brandSoft, fg:T.brand, bd:T.brandLine },
    ok:      { bg:T.okSoft, fg:T.ok, bd:T.okLine },
    warn:    { bg:T.warnSoft, fg:T.warn, bd:T.warnLine },
    bad:     { bg:T.badSoft, fg:T.bad, bd:T.badLine },
    info:    { bg:T.infoSoft, fg:T.info, bd:T.infoLine },
    neutral: { bg:T.muteSoft, fg:T.mute, bd:T.muteLine },
  };
  const p = map[tone] ?? map.mute;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:6,
      height:22, padding:"0 9px", borderRadius:999,
      background:p.bg, color:p.fg, border:`1px solid ${p.bd}`,
      fontFamily:T.ui, fontSize:11.5, fontWeight:600,
      letterSpacing:"0", textTransform:"none",
      whiteSpace:"nowrap",
      ...style,
    }}>
      {dot && <span style={{
        width:6, height:6, borderRadius:999, background:p.fg,
      }}/>}
      {children}
    </span>
  );
};

const Btn = ({ children, onClick, primary, ghost, danger, sm, type, style={} }) => {
  const h = sm ? 32 : 38;
  let bg, fg, bd, sh;
  if (primary) {
    bg = T.brandStrong; fg = "#FFFFFF"; bd = T.brandStrong;
    sh = "0 1px 2px rgba(8,145,178,0.25)";
  } else if (danger) {
    bg = T.surface; fg = T.bad; bd = T.badLine; sh = "none";
  } else if (ghost) {
    bg = "transparent"; fg = T.fg2; bd = "transparent"; sh = "none";
  } else {
    bg = T.surface; fg = T.fg; bd = T.borderStrong; sh = T.shadow1;
  }
  return (
    <button onClick={onClick} type={type} style={{
      height: h, padding: `0 ${sm ? 12 : 14}px`,
      borderRadius: 8, cursor:"pointer",
      background: bg, color: fg, border: `1px solid ${bd}`,
      fontFamily:T.ui, fontSize: sm ? 12.5 : 13.5, fontWeight: 500,
      letterSpacing:"-0.005em",
      boxShadow: sh,
      transition: "all 140ms ease",
      display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6,
      flexShrink: 0,
      ...style,
    }}>{children}</button>
  );
};

const TextInput = React.forwardRef(({ value, onChange, placeholder, type="text", style={} }, ref) => (
  <input ref={ref} type={type} value={value ?? ""}
    onChange={e=>onChange?.(e.target.value)} placeholder={placeholder}
    style={{
      height:38, padding:"0 12px",
      background:T.surface,
      border:`1px solid ${T.borderStrong}`,
      borderRadius:8,
      color:T.fg, fontFamily:T.ui, fontSize:13.5, outline:"none",
      width:"100%",
      ...style,
    }}
  />
));

const SelectInput = ({ value, onChange, children, style={} }) => (
  <select value={value ?? ""} onChange={e=>onChange?.(e.target.value)}
    style={{
      height:38, padding:"0 10px",
      background:T.surface,
      border:`1px solid ${T.borderStrong}`,
      borderRadius:8,
      color:T.fg, fontFamily:T.ui, fontSize:13.5, outline:"none",
      cursor:"pointer",
      ...style,
    }}>{children}</select>
);

const SearchBox = ({ value, onChange, placeholder }) => (
  <div style={{ position:"relative", flex:1, maxWidth:340 }}>
    <svg style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:T.fg4, pointerEvents:"none" }}
         viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder ?? "Buscar…"}
      style={{
        width:"100%", height:38, paddingLeft:34, paddingRight:12,
        background:T.surface,
        border:`1px solid ${T.borderStrong}`,
        borderRadius:8,
        fontFamily:T.ui, fontSize:13.5, color:T.fg,
        outline:"none",
      }}
    />
  </div>
);

const DataRow = ({ label, value }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
    borderBottom:`1px solid ${T.borderSoft}`, padding:"11px 0",
    fontFamily:T.ui, fontSize:13.5 }}>
    <span style={{ color:T.fg3 }}>{label}</span>
    <span style={{ color:T.fg, fontWeight:500, textAlign:"right", maxWidth:"60%" }}>{value}</span>
  </div>
);

const Field = ({ label, hint, children, span }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6, gridColumn: span ? `span ${span}` : "auto" }}>
    <Label>{label}</Label>
    {children}
    {hint && <span style={{ fontFamily:T.ui, fontSize:12, color:T.fg4, lineHeight:1.5 }}>{hint}</span>}
  </div>
);

// Mono cell for tabular numeric data
const Num = ({ children, style={}, c }) => (
  <span style={{
    fontFamily:T.mono, fontSize:13, fontWeight:500,
    color:c ?? T.fg, fontVariantNumeric:"tabular-nums",
    ...style,
  }}>{children}</span>
);

/* ── ICONS ───────────────────────────────────────────────────────────────── */
const SI = ({ d, size=18, sw=1.75 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const IZap      = p=><SI d={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/>} {...p}/>;
const IUsers    = p=><SI d={<g><circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8"/><path d="M22 21a7 7 0 0 0-5-6.7"/></g>} {...p}/>;
const IUser     = p=><SI d={<g><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></g>} {...p}/>;
const IDumbbell = p=><SI d={<g><path d="M14.4 14.4 9.6 9.6"/><path d="M18.6 21.5a2 2 0 1 1-2.8-2.8M14 19.4l5.4-5.4M5.4 2.5a2 2 0 1 1 2.8 2.8M10 4.6 4.6 10M21.5 21.5l-1.4-1.4M3.9 3.9 2.5 2.5M6.4 12.8a2 2 0 1 1-2.8-2.8M5.3 7.4a2 2 0 1 1-2.8-2.8"/></g>} {...p}/>;
const IFork     = p=><SI d={<g><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7"/></g>} {...p}/>;
const ITrend    = p=><SI d={<g><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></g>} {...p}/>;
const IShield   = p=><SI d={<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/>} {...p}/>;
const IBuilding = p=><SI d={<g><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></g>} {...p}/>;
const ILog      = p=><SI d={<g><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/></g>} {...p}/>;
const IChevL    = p=><SI d={<polyline points="15 18 9 12 15 6"/>} {...p}/>;
const IChevR    = p=><SI d={<polyline points="9 6 15 12 9 18"/>} {...p}/>;
const IChevD    = p=><SI d={<polyline points="6 9 12 15 18 9"/>} {...p}/>;
const IPlus     = p=><SI d={<g><path d="M12 5v14"/><path d="M5 12h14"/></g>} {...p}/>;
const IX        = p=><SI d={<g><path d="M18 6 6 18"/><path d="m6 6 12 12"/></g>} {...p}/>;
const ICopy     = p=><SI d={<g><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></g>} {...p}/>;
const ICheck    = p=><SI d={<polyline points="20 6 9 17 4 12"/>} {...p}/>;
const ILock     = p=><SI d={<g><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></g>} {...p}/>;
const ICalib    = p=><SI d={<g><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2 2"/></g>} {...p}/>;
const IHist     = p=><SI d={<g><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></g>} {...p}/>;
const IMenu     = p=><SI d={<g><path d="M3 12h18M3 6h18M3 18h18"/></g>} {...p}/>;
const ITrash    = p=><SI d={<g><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></g>} {...p}/>;
const ISave     = p=><SI d={<g><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></g>} {...p}/>;
const IGavel    = p=><SI d={<g><path d="m14 13-7.5 7.5a2.12 2.12 0 0 1-3-3L11 10"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/></g>} {...p}/>;
const IPlay     = p=><SI d={<polygon points="6 4 20 12 6 20 6 4"/>} {...p}/>;
const IPause    = p=><SI d={<g><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></g>} {...p}/>;
const IBolt     = p=><SI d={<polyline points="8 4 12 4 10 12 14 12 8 22 10 14 6 14 8 4"/>} {...p}/>;
const ISearch   = p=><SI d={<g><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></g>} {...p}/>;
const IBell     = p=><SI d={<g><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></g>} {...p}/>;
const IDots     = p=><SI d={<g><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></g>} {...p}/>;
const IFilter   = p=><SI d={<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>} {...p}/>;
const IExternal = p=><SI d={<g><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></g>} {...p}/>;

/* ── SIDEBAR ─────────────────────────────────────────────────────────────── */
// Nav definitions use translation keys; labels resolved at render via t()
const SUPER_NAV = [
  { lk:"nav.ops",       items:[
    { id:"hoje",       lk:"nav.hoje",       Icon:IZap      },
    { id:"aprovacoes", lk:"nav.aprovacoes", Icon:IGavel, badgeKey:"pending" },
  ]},
  { lk:"nav.cadastros", items:[
    { id:"empresas",   lk:"nav.empresas",   Icon:IBuilding },
    { id:"coaches",    lk:"nav.coaches",    Icon:IShield   },
    { id:"alunos",     lk:"nav.alunos",     Icon:IUsers    },
  ]},
  { lk:"nav.conteudo",  items:[
    { id:"treinos",    lk:"nav.treinos",    Icon:IDumbbell },
    { id:"dietas",     lk:"nav.dietas",     Icon:IFork     },
  ]},
  { lk:"nav.analise",   items:[
    { id:"arena",      lk:"nav.arena",      Icon:ITrend    },
    { id:"logs",       lk:"nav.logs",       Icon:ILog      },
  ]},
];

const EMPRESA_NAV = [
  { lk:"nav.minha_empresa", items:[
    { id:"visao_geral", lk:"nav.visao_geral", Icon:IZap      },
    { id:"coaches",     lk:"nav.coaches",     Icon:IShield   },
    { id:"alunos",      lk:"nav.alunos",      Icon:IUsers    },
  ]},
  { lk:"nav.conteudo", items:[
    { id:"treinos",     lk:"nav.treinos",     Icon:IDumbbell },
    { id:"dietas",      lk:"nav.dietas",      Icon:IFork     },
  ]},
  { lk:"nav.analise",  items:[
    { id:"arena",       lk:"nav.arena",       Icon:ITrend    },
  ]},
];

const COACH_NAV = [
  { lk:"nav.ops", items:[
    { id:"inicio",      lk:"nav.inicio",      Icon:IZap      },
    { id:"meus_alunos", lk:"nav.meus_alunos", Icon:IUsers    },
  ]},
  { lk:"nav.conteudo", items:[
    { id:"treinos",     lk:"nav.treinos",     Icon:IDumbbell },
    { id:"dietas",      lk:"nav.dietas",      Icon:IFork     },
  ]},
  { lk:"nav.analise",  items:[
    { id:"arena",       lk:"nav.arena",       Icon:ITrend    },
  ]},
];

function Sidebar({ collapsed, onToggle, navGroups }) {
  const ctx = React.useContext(window.PanelCtx);
  const pendingTotal = SYS_TELEMETRY.pendingTotal;
  const groups = navGroups || SUPER_NAV;

  return (
    <aside style={{
      width: collapsed ? 64 : 248, flexShrink:0,
      height:"100vh", display:"flex", flexDirection:"column",
      background: T.sidebar,
      borderRight:"none",
      transition:"width 200ms ease",
      overflow:"hidden",
      boxShadow:"2px 0 16px rgba(0,0,0,0.18)",
      position:"relative", zIndex:10,
    }}>
      {/* Brand row */}
      <div style={{
        height:66, display:"flex", alignItems:"center",
        padding: collapsed ? "0 0 0 17px" : "0 16px 0 18px",
        borderBottom:`1px solid ${T.sidebarBorder}`,
        gap:12, flexShrink:0,
      }}>
        {!collapsed ? (
          <>
            {/* Logo mark */}
            <div style={{
              width:32, height:32, borderRadius:9,
              background:"linear-gradient(135deg, #52e7ff 0%, #0891B2 100%)",
              display:"grid", placeItems:"center", color:"#04131e",
              boxShadow:"0 0 18px rgba(82,231,255,0.35)",
              flexShrink:0,
            }}><IShield size={16} sw={2.4}/></div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:T.ui, fontSize:15, fontWeight:700, color:"#FFFFFF",
                letterSpacing:"-0.01em", lineHeight:1.15 }}>GUTO</div>
              <div style={{ fontFamily:T.ui, fontSize:10.5, color:T.sidebarFgMuted,
                lineHeight:1.2, marginTop:1, letterSpacing:"0.04em" }}>
                Sala de Controle
              </div>
            </div>
            <button onClick={onToggle} style={{
              background:"none", border:"none", cursor:"pointer",
              color:T.sidebarFgMuted, padding:5,
              display:"flex", alignItems:"center", borderRadius:6,
              transition:"color 120ms",
            }}
            onMouseEnter={e=>e.currentTarget.style.color=T.sidebarFg}
            onMouseLeave={e=>e.currentTarget.style.color=T.sidebarFgMuted}>
              <IChevL size={15}/>
            </button>
          </>
        ) : (
          <div style={{
            width:32, height:32, borderRadius:9,
            background:"linear-gradient(135deg, #52e7ff 0%, #0891B2 100%)",
            display:"grid", placeItems:"center", color:"#04131e",
            boxShadow:"0 0 18px rgba(82,231,255,0.35)",
          }}><IShield size={16} sw={2.4}/></div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:"auto", padding:"12px 0",
        scrollbarWidth:"none" }}>
        <style>{`nav::-webkit-scrollbar{display:none}`}</style>
        {groups.map((group, gi) => (
          <div key={gi} style={{ marginBottom:6 }}>
            {!collapsed && (
              <div style={{
                padding:"10px 20px 4px",
                fontFamily:T.ui, fontSize:10, fontWeight:600,
                letterSpacing:"0.12em", textTransform:"uppercase",
                color:T.sidebarFgGroup,
              }}>{t(group.lk)}</div>
            )}
            {group.items.map(({ id, lk, Icon, badgeKey }) => {
              const active = ctx.activeScreen === id;
              const badge = badgeKey === "pending" && pendingTotal > 0 ? pendingTotal : null;
              return (
                <button key={id} onClick={() => ctx.setActiveScreen(id)}
                  title={collapsed ? label : undefined}
                  style={{
                    width: collapsed ? "100%" : "calc(100% - 12px)",
                    margin: collapsed ? "0" : "1px 6px",
                    height:38,
                    display:"flex", alignItems:"center",
                    gap:11, padding: collapsed ? "0 0 0 18px" : "0 12px",
                    background: active ? T.sidebarActive : "transparent",
                    border:"none",
                    borderLeft: active && !collapsed ? `2px solid ${T.cyan}` : "2px solid transparent",
                    cursor:"pointer",
                    borderRadius: collapsed ? 0 : 8,
                    color: active ? T.sidebarFgActive : T.sidebarFg,
                    fontFamily:T.ui, fontSize:13.5, fontWeight: active ? 600 : 400,
                    textAlign:"left", position:"relative",
                    transition:"background 120ms ease, color 120ms ease",
                    letterSpacing: active ? "-0.005em" : "0",
                  }}
                  onMouseEnter={e=>{ if(!active) e.currentTarget.style.background=T.sidebarHover; }}
                  onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}>
                  <span style={{ opacity: active ? 1 : 0.7 }}>
                    <Icon size={16} sw={active ? 2 : 1.7}/>
                  </span>
                  {!collapsed && <span style={{ flex:1 }}>{t(lk)}</span>}
                  {!collapsed && badge && (
                    <span style={{
                      background:"#B45309", color:"#fff",
                      borderRadius:999, padding:"1px 7px",
                      fontFamily:T.ui, fontSize:11, fontWeight:600,
                    }}>{badge}</span>
                  )}
                  {collapsed && badge && (
                    <span style={{
                      position:"absolute", top:8, right:10,
                      width:7, height:7, borderRadius:999,
                      background:"#F59E0B", boxShadow:"0 0 6px #F59E0B",
                    }}/>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        borderTop:`1px solid ${T.sidebarBorder}`,
        padding: collapsed ? "12px 0" : "12px 14px",
        flexShrink:0,
      }}>
        {!collapsed ? (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:34, height:34, borderRadius:999,
              background:"rgba(82,231,255,0.15)",
              display:"grid", placeItems:"center",
              fontFamily:T.ui, fontSize:12, fontWeight:700,
              color:T.cyan,
              flexShrink:0,
            }}>AD</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:T.ui, fontSize:13, fontWeight:600,
                color:T.sidebarFgActive,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                Admin
              </div>
              <div style={{ fontFamily:T.ui, fontSize:11, color:T.sidebarFgMuted,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                admin@guto.fit
              </div>
            </div>
            <span style={{
              fontFamily:T.ui, fontSize:10, fontWeight:600,
              letterSpacing:"0.10em", textTransform:"uppercase",
              color:T.cyan, opacity:0.85,
            }}>Super</span>
          </div>
        ) : (
          <button onClick={onToggle} style={{
            width:"100%", background:"none", border:"none", cursor:"pointer",
            color:T.sidebarFgMuted, padding:"6px 0",
            display:"flex", justifyContent:"center",
          }}><IChevR size={15}/></button>
        )}
      </div>
    </aside>
  );
}

/* ── HEADER ──────────────────────────────────────────────────────────────── */
const SCREEN_KEYS = {
  hoje:        { tk:"screen.hoje.t",        sk:"screen.hoje.s"        },
  empresas:    { tk:"screen.empresas.t",    sk:"screen.empresas.s"    },
  alunos:      { tk:"screen.alunos.t",      sk:"screen.alunos.s"      },
  coaches:     { tk:"screen.coaches.t",     sk:"screen.coaches.s"     },
  treinos:     { tk:"screen.treinos.t",     sk:"screen.treinos.s"     },
  dietas:      { tk:"screen.dietas.t",      sk:"screen.dietas.s"      },
  aprovacoes:  { tk:"screen.aprovacoes.t",  sk:"screen.aprovacoes.s"  },
  arena:       { tk:"screen.arena.t",       sk:"screen.arena.s"       },
  logs:        { tk:"screen.logs.t",        sk:"screen.logs.s"        },
  visao_geral: { tk:"screen.visao_geral.t", sk:"screen.visao_geral.s" },
  inicio:      { tk:"screen.hoje.t",        sk:"screen.hoje.s"        },
  meus_alunos: { tk:"screen.meus_alunos.t", sk:"screen.meus_alunos.s" },
};

function LangSwitcher({ inHeader }) {
  const [lang, setLangState] = React.useState(getLang());
  function switchTo(l) { setLang(l); setLangState(l); window.location.reload(); }
  return (
    <div style={{ display:"flex", gap:3 }}>
      {["pt","en","it"].map(l => (
        <button key={l} onClick={()=>switchTo(l)} style={{
          height:26, padding:"0 8px", borderRadius:6, cursor:"pointer",
          background: lang===l ? T.brandSoft : "transparent",
          border:`1px solid ${lang===l ? T.brandLine : T.border}`,
          color: lang===l ? T.brand : T.fg4,
          fontFamily:T.ui, fontSize:11, fontWeight: lang===l ? 600 : 400,
          textTransform:"uppercase",
        }}>{l}</button>
      ))}
    </div>
  );
}

function Header({ portalLabel }) {
  const ctx = React.useContext(window.PanelCtx);
  const keys = SCREEN_KEYS[ctx.activeScreen] ?? { tk:ctx.activeScreen, sk:"" };
  const cta = headerCta(ctx);
  return (
    <header style={{
      height:62, flexShrink:0,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 28px",
      background:T.surface,
      borderBottom:`1px solid ${T.border}`,
      boxShadow:"0 1px 0 rgba(15,23,42,0.04)",
      position:"sticky", top:0, zIndex:20,
      gap:24,
    }}>
      <div style={{ minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
          <div style={{ fontFamily:T.ui, fontSize:18, fontWeight:600, color:T.fg,
            letterSpacing:"-0.015em", lineHeight:1.1 }}>
            {t(keys.tk)}
          </div>
          <div style={{ fontFamily:T.ui, fontSize:13, color:T.fg4 }}>
            {t(keys.sk)}
          </div>
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        <LangSwitcher inHeader/>
        <div style={{ width:1, height:20, background:T.border, margin:"0 4px" }}/>
        <div style={{ display:"flex", gap:6 }}>
          <Pill tone="ok" dot style={{ fontSize:12 }}>{t("misc.sys_online")}</Pill>
          {SYS_TELEMETRY.pendingTotal > 0 && (
            <Pill tone="warn" dot style={{ fontSize:12 }}>
              {SYS_TELEMETRY.pendingTotal} {t("misc.pendentes")}
            </Pill>
          )}
        </div>
        <button style={iconBtn()} title="Notificações"><IBell size={16}/></button>
        {cta}
      </div>
    </header>
  );
}

function iconBtn() {
  return {
    width:36, height:36, borderRadius:8, cursor:"pointer",
    background:T.surface, border:`1px solid ${T.border}`,
    color:T.fg2, display:"grid", placeItems:"center",
  };
}

function headerCta(ctx) {
  if (ctx.activeScreen === "empresas") return <Btn primary sm onClick={()=>ctx.setShowCreate("empresa")}><IPlus size={14}/>{t("btn.nova_empresa")}</Btn>;
  if (ctx.activeScreen === "coaches")  return <Btn primary sm onClick={()=>ctx.setShowCreate("coach")}><IPlus size={14}/>{t("btn.novo_coach")}</Btn>;
  if (ctx.activeScreen === "alunos")   return <Btn primary sm onClick={()=>ctx.setShowCreate("aluno")}><IPlus size={14}/>{t("btn.novo_aluno")}</Btn>;
  return null;
}

Object.assign(window, {
  T, Card, SectionHeader, Kicker, Label, Pill, Btn, TextInput, SelectInput, SearchBox,
  DataRow, Field, Num, LangSwitcher,
  SUPER_NAV, EMPRESA_NAV, COACH_NAV,
  SI, IZap, IUsers, IUser, IDumbbell, IFork, ITrend, IShield, IBuilding, ILog,
  IChevL, IChevR, IChevD, IPlus, IX, ICopy, ICheck, ILock, ICalib, IHist, IMenu, ITrash, ISave,
  IGavel, IPlay, IPause, IBolt, ISearch, IBell, IDots, IFilter, IExternal,
  Sidebar, Header, iconBtn,
});
