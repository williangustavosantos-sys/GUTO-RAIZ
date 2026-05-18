// GUTO · COMANDO — Painel ADM. Dark cockpit shell + atomic primitives.
// Inverted from the white-room app: deep ink + cyan HUD instead of glass + cyan glow.

const { useState: useS, useEffect: useE, useMemo: useM } = React;

/* ============================================================================
   COCKPIT TOKENS
   ============================================================================ */
const C = {
  // surfaces
  ink:        "#060912",                     // page void
  panel:      "rgba(18, 26, 44, 0.78)",      // default plate
  panelDeep:  "rgba(10, 16, 30, 0.92)",      // recessed
  panelHi:    "rgba(28, 38, 60, 0.86)",      // raised / hover
  // text
  fg:         "#e8f4ff",                     // primary icy
  fg2:        "rgba(232,244,255,0.62)",      // body
  fg3:        "rgba(232,244,255,0.36)",      // muted
  fg4:        "rgba(232,244,255,0.18)",      // ghost
  // brand
  cyan:       "#52e7ff",
  cyanSoft:   "rgba(82,231,255,0.16)",
  cyanLine:   "rgba(82,231,255,0.22)",
  cyanGhost:  "rgba(82,231,255,0.08)",
  // status (low chroma — fits the cockpit, not candy)
  ok:         "#4ade80",
  okSoft:     "rgba(74,222,128,0.14)",
  warn:       "#f5b544",
  warnSoft:   "rgba(245,181,68,0.14)",
  bad:        "#f87171",
  badSoft:    "rgba(248,113,113,0.14)",
  // type
  mono:       '"JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, monospace',
  display:    '"Inter Tight", "SF Pro Display", system-ui, sans-serif',
};

/* ============================================================================
   PHONE — 390x844 mobile capsule, dark
   ============================================================================ */
function Phone({ children, label, sub }) {
  return (
    <div style={{
      width: 390, height: 844, position: "relative", overflow: "hidden",
      background: `
        radial-gradient(120% 80% at 70% -10%, rgba(82,231,255,0.10) 0%, rgba(82,231,255,0) 48%),
        radial-gradient(80% 60% at 8% 100%, rgba(82,231,255,0.05) 0%, rgba(82,231,255,0) 60%),
        linear-gradient(180deg, #050810 0%, #060912 60%, #050810 100%)
      `,
      borderRadius: 44, border: "1px solid rgba(82,231,255,0.14)",
      boxShadow: `
        0 30px 80px rgba(0,0,0,0.6),
        inset 0 0 0 1px rgba(82,231,255,0.04),
        inset 0 -1px 0 rgba(82,231,255,0.10)
      `,
      fontFamily: C.mono, color: C.fg,
    }}>
      {/* scan-line texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5,
        background: "repeating-linear-gradient(180deg, rgba(82,231,255,0.04) 0 1px, transparent 1px 3px)",
        mixBlendMode: "screen",
      }}/>
      {/* status bar */}
      <StatusBar label={label} sub={sub}/>
      {children}
    </div>
  );
}

function StatusBar({ label, sub }) {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 44, padding: "0 22px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      font: `800 11px/1 ${C.mono}`, color: C.fg2, letterSpacing: "0.08em",
      zIndex: 30,
    }}>
      <span>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          width: 6, height: 6, borderRadius: 999, background: C.cyan,
          boxShadow: `0 0 6px ${C.cyan}`,
        }}/>
        <span style={{ fontSize: 9, letterSpacing: "0.30em", color: C.fg3 }}>
          {label || "GUTO · COMANDO"}{sub ? ` · ${sub}` : ""}
        </span>
      </div>
      <span style={{ fontSize: 10 }}>•••</span>
    </div>
  );
}

/* ============================================================================
   ATOMS
   ============================================================================ */
const Plate = ({ children, style = {}, deep, raised, glow }) => (
  <div style={{
    background: deep ? C.panelDeep : raised ? C.panelHi : C.panel,
    border: `1px solid ${glow ? C.cyanLine : "rgba(82,231,255,0.10)"}`,
    borderRadius: 14,
    boxShadow: glow
      ? `0 0 0 1px ${C.cyanLine} inset, 0 0 24px rgba(82,231,255,0.18), 0 8px 24px rgba(0,0,0,0.4)`
      : "0 8px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.02) inset",
    backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
    ...style,
  }}>{children}</div>
);

const Kicker = ({ children, color, style = {} }) => (
  <span style={{
    font: `900 9px/1 ${C.mono}`, letterSpacing: "0.30em", textTransform: "uppercase",
    color: color || C.fg3, ...style,
  }}>{children}</span>
);

const Title = ({ children, size = 18, style = {} }) => (
  <div style={{
    font: `900 ${size}px/1.1 ${C.mono}`, color: C.fg, letterSpacing: "-0.01em",
    ...style,
  }}>{children}</div>
);

const Body = ({ children, soft, style = {} }) => (
  <div style={{
    font: `500 12px/1.4 ${C.mono}`, color: soft ? C.fg2 : C.fg, ...style,
  }}>{children}</div>
);

const Cta = ({ children, ghost, danger, style = {}, full = true }) => (
  <button style={{
    height: 44, width: full ? "100%" : "auto", padding: full ? 0 : "0 18px",
    borderRadius: 999, cursor: "pointer",
    border: ghost ? `1px solid ${C.cyanLine}` : "none",
    background: ghost
      ? "transparent"
      : danger
        ? `linear-gradient(180deg, ${C.bad}, #c84545)`
        : `linear-gradient(180deg, #7df0ff, #1ec1de)`,
    color: ghost ? C.cyan : danger ? "#fff" : "#04131e",
    font: `900 11px/1 ${C.mono}`, letterSpacing: "0.22em", textTransform: "uppercase",
    boxShadow: ghost ? "none" : danger
      ? "0 0 18px rgba(248,113,113,0.30)"
      : "0 0 22px rgba(82,231,255,0.32), inset 0 1px 0 rgba(255,255,255,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    ...style,
  }}>{children}</button>
);

const Input = ({ label, value, placeholder, type = "text", suffix }) => (
  <div>
    {label && <Kicker style={{ display: "block", marginBottom: 8 }}>{label}</Kicker>}
    <div style={{
      height: 44, padding: "0 14px", borderRadius: 10,
      background: "rgba(0,0,0,0.32)",
      border: "1px solid rgba(82,231,255,0.12)",
      boxShadow: "inset 0 2px 6px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.02)",
      display: "flex", alignItems: "center", gap: 8,
      font: `500 13px/1 ${C.mono}`, color: value ? C.fg : C.fg3,
    }}>
      <span style={{ flex: 1 }}>{value || placeholder}</span>
      {suffix}
    </div>
  </div>
);

const Pill = ({ tone = "neutral", children, style = {} }) => {
  const map = {
    neutral: { bg: "rgba(232,244,255,0.06)", fg: C.fg2, border: "rgba(232,244,255,0.10)" },
    cyan:    { bg: C.cyanSoft, fg: C.cyan, border: C.cyanLine },
    ok:      { bg: C.okSoft, fg: C.ok, border: "rgba(74,222,128,0.30)" },
    warn:    { bg: C.warnSoft, fg: C.warn, border: "rgba(245,181,68,0.30)" },
    bad:     { bg: C.badSoft, fg: C.bad, border: "rgba(248,113,113,0.30)" },
  };
  const p = map[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      height: 22, padding: "0 10px", borderRadius: 999,
      background: p.bg, color: p.fg, border: `1px solid ${p.border}`,
      font: `900 9px/1 ${C.mono}`, letterSpacing: "0.20em", textTransform: "uppercase",
      ...style,
    }}>{children}</span>
  );
};

const Dot = ({ tone = "ok", size = 6 }) => {
  const map = { ok: C.ok, warn: C.warn, bad: C.bad, cyan: C.cyan, mute: C.fg4 };
  const c = map[tone];
  return <span style={{
    display: "inline-block", width: size, height: size, borderRadius: 999,
    background: c, boxShadow: `0 0 6px ${c}`, flex: "none",
  }}/>;
};

/* ============================================================================
   ICONS — minimal stroke set used across the panel
   ============================================================================ */
const I = ({ d, size = 16, stroke = 1.8, ...r }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...r}>{d}</svg>
);
const IShield = (p) => <I d={<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/>} {...p}/>;
const IUser = (p) => <I d={<g><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></g>} {...p}/>;
const IUsers = (p) => <I d={<g><circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8"/><path d="M22 21a7 7 0 0 0-5-6.7"/></g>} {...p}/>;
const ISearch = (p) => <I d={<g><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></g>} {...p}/>;
const IFilter = (p) => <I d={<path d="M3 5h18l-7 9v6l-4-2v-4Z"/>} {...p}/>;
const IPlus = (p) => <I d={<g><path d="M12 5v14"/><path d="M5 12h14"/></g>} {...p}/>;
const IArrow = (p) => <I d={<g><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></g>} {...p}/>;
const IBack = (p) => <I d={<g><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></g>} {...p}/>;
const ISettings = (p) => <I d={<g><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></g>} {...p}/>;
const IDots = (p) => <I d={<g><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></g>} {...p}/>;
const IDumbbell = (p) => <I d={<g><path d="M14.4 14.4 9.6 9.6"/><path d="M18.6 21.5a2 2 0 1 1-2.8-2.8M14 19.4l5.4-5.4M5.4 2.5a2 2 0 1 1 2.8 2.8M10 4.6 4.6 10M21.5 21.5l-1.4-1.4M3.9 3.9 2.5 2.5M6.4 12.8a2 2 0 1 1-2.8-2.8M5.3 7.4a2 2 0 1 1-2.8-2.8"/></g>} {...p}/>;
const IUtensils = (p) => <I d={<g><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7"/></g>} {...p}/>;
const ITrend = (p) => <I d={<g><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></g>} {...p}/>;
const IZap = (p) => <I d={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/>} {...p}/>;
const IClock = (p) => <I d={<g><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>} {...p}/>;
const ICard = (p) => <I d={<g><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11h18"/></g>} {...p}/>;
const ILink = (p) => <I d={<g><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></g>} {...p}/>;
const ILog = (p) => <I d={<g><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/></g>} {...p}/>;
const ICopy = (p) => <I d={<g><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></g>} {...p}/>;
const IEye = (p) => <I d={<g><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></g>} {...p}/>;
const IPause = (p) => <I d={<g><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></g>} {...p}/>;
const IX = (p) => <I d={<g><path d="M18 6 6 18"/><path d="m6 6 12 12"/></g>} {...p}/>;
const ICheck = (p) => <I d={<polyline points="20 6 9 17 4 12"/>} {...p}/>;
const IChevR = (p) => <I d={<polyline points="9 6 15 12 9 18"/>} {...p}/>;

/* ============================================================================
   HEADER + BOTTOM NAV (cockpit chrome)
   ============================================================================ */
function Header({ title, sub, back, action }) {
  return (
    <div style={{
      position: "absolute", top: 44, left: 0, right: 0, height: 64, padding: "0 18px",
      display: "flex", alignItems: "center", gap: 12,
      borderBottom: `1px solid ${C.cyanGhost}`,
      background: "linear-gradient(180deg, rgba(82,231,255,0.04), transparent)",
      zIndex: 20,
    }}>
      {back ? (
        <button style={{
          width: 36, height: 36, borderRadius: 10, cursor: "pointer",
          background: "rgba(82,231,255,0.06)", border: `1px solid ${C.cyanGhost}`,
          color: C.fg, display: "grid", placeItems: "center",
        }}><IBack size={16}/></button>
      ) : (
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "rgba(82,231,255,0.08)", border: `1px solid ${C.cyanLine}`,
          display: "grid", placeItems: "center", color: C.cyan,
          boxShadow: `0 0 14px ${C.cyanGhost}, inset 0 0 8px rgba(82,231,255,0.12)`,
        }}><IShield size={15}/></div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Kicker color={C.cyan}>{sub || "G U T O · C O M A N D O"}</Kicker>
        <div style={{ font: `900 16px/1.1 ${C.mono}`, marginTop: 4, letterSpacing: "-0.01em" }}>
          {title}
        </div>
      </div>
      {action}
    </div>
  );
}

function CockpitNav({ active }) {
  const tabs = [
    { id: "dash",  label: "VISÃO",   I: ITrend },
    { id: "alunos",label: "ALUNOS",  I: IUsers },
    { id: "ops",   label: "OPS",     I: IZap },
    { id: "logs",  label: "LOGS",    I: ILog },
    { id: "set",   label: "AJUSTES", I: ISettings },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      padding: "10px 14px max(env(safe-area-inset-bottom), 14px)",
      background: "linear-gradient(180deg, rgba(6,9,18,0) 0%, rgba(6,9,18,0.94) 40%)",
      borderTop: `1px solid ${C.cyanGhost}`,
      zIndex: 20,
    }}>
      <nav style={{
        display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4,
        background: "rgba(10,16,30,0.7)",
        borderRadius: 16, padding: 4,
        border: "1px solid rgba(82,231,255,0.08)",
      }}>
        {tabs.map(({ id, label, I: Ic }) => {
          const on = active === id;
          return (
            <div key={id} style={{
              height: 52, borderRadius: 12,
              background: on ? "rgba(82,231,255,0.10)" : "transparent",
              border: on ? `1px solid ${C.cyanLine}` : "1px solid transparent",
              boxShadow: on ? `0 0 16px rgba(82,231,255,0.18), inset 0 0 14px rgba(82,231,255,0.08)` : "none",
              color: on ? C.cyan : C.fg3,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
            }}>
              <Ic size={18} stroke={on ? 2.2 : 1.8}/>
              <span style={{ font: `900 8px/1 ${C.mono}`, letterSpacing: "0.20em" }}>{label}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

/* ============================================================================
   HUD CORNERS — decorative bracket on key plates
   ============================================================================ */
const HUDCorners = ({ color = C.cyanLine, size = 10 }) => (
  <>
    {[
      { top: -1, left: -1, br: `${size}px 0 0 0` },
      { top: -1, right: -1, br: `0 ${size}px 0 0` },
      { bottom: -1, left: -1, br: `0 0 0 ${size}px` },
      { bottom: -1, right: -1, br: `0 0 ${size}px 0` },
    ].map((s, i) => (
      <span key={i} style={{
        position: "absolute", width: size, height: size,
        borderTop: i < 2 ? `1px solid ${color}` : "none",
        borderBottom: i >= 2 ? `1px solid ${color}` : "none",
        borderLeft: i % 2 === 0 ? `1px solid ${color}` : "none",
        borderRight: i % 2 === 1 ? `1px solid ${color}` : "none",
        ...s, borderRadius: s.br,
      }}/>
    ))}
  </>
);

Object.assign(window, {
  C, Phone, StatusBar, Plate, Kicker, Title, Body, Cta, Input, Pill, Dot,
  Header, CockpitNav, HUDCorners,
  IShield, IUser, IUsers, ISearch, IFilter, IPlus, IArrow, IBack, ISettings, IDots,
  IDumbbell, IUtensils, ITrend, IZap, IClock, ICard, ILink, ILog, ICopy, IEye, IPause, IX, ICheck, IChevR,
});
