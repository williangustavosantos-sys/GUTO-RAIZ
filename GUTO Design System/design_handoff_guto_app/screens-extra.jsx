// GUTO · Premium futurista — telas adicionais (splash, idioma, nome, login, admin, validação, pausado, convite, coach)
const { useState: useStateX, useEffect: useEffectX } = React;

const GX = {
  charcoal: "#2D3748",
  exec: "#4A5568",
  soft: "#5A7CA8",
  cyan: "#52e7ff",
  font: '"Inter", "Montserrat", system-ui, sans-serif',
};

const AX = {
  bg: "assets/fundo.jpg",
  logo: "assets/logo.png",
  baby: "assets/guto-baby.webm",
  flag_pt: "assets/idioma-portugues.svg",
  flag_en: "assets/idioma-english.svg",
  flag_es: "assets/idioma-espanol.svg",
  flag_it: "assets/idioma-italiano.svg",
};

const SVGX = ({ children, size = 22, stroke = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const IcCheck2 = (p) => <SVGX {...p}><polyline points="20 6 9 17 4 12"/></SVGX>;
const IcArrow = (p) => <SVGX {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></SVGX>;
const IcShield = (p) => <SVGX {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></SVGX>;
const IcUser = (p) => <SVGX {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></SVGX>;
const IcClock = (p) => <SVGX {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></SVGX>;
const IcZap = (p) => <SVGX {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></SVGX>;
const IcX = (p) => <SVGX {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></SVGX>;
const IcCam = (p) => <SVGX {...p}><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></SVGX>;

const CapsuleX = ({ children, dim }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#fff" }}>
    <img src={AX.bg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", transform: "scale(1.05)", filter: "saturate(1.05) brightness(1.02)" }}/>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 22%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.45) 78%, rgba(220,232,244,0.85) 100%), radial-gradient(120% 60% at 50% 8%, rgba(82,231,255,0.16), transparent 60%)" }}/>
    <div style={{ position: "absolute", left: 18, top: 70, bottom: 120, width: 1.5, background: "linear-gradient(180deg, transparent, rgba(82,231,255,0.65), transparent)", boxShadow: "0 0 10px rgba(82,231,255,0.7)", borderRadius: 99 }}/>
    <div style={{ position: "absolute", right: 18, top: 70, bottom: 120, width: 1.5, background: "linear-gradient(180deg, transparent, rgba(82,231,255,0.65), transparent)", boxShadow: "0 0 10px rgba(82,231,255,0.7)", borderRadius: 99 }}/>
    {children}
  </div>
);

const PlateX = ({ children, style, glow }) => (
  <div style={Object.assign({
    background: "linear-gradient(180deg, rgba(255,255,255,0.78), rgba(245,250,255,0.55))",
    border: glow ? `1px solid ${GX.cyan}` : "1px solid rgba(255,255,255,0.94)",
    borderRadius: 22, padding: "16px 18px",
    backdropFilter: "blur(18px) saturate(1.2)", WebkitBackdropFilter: "blur(18px) saturate(1.2)",
    boxShadow: glow ? "inset 0 1px 0 rgba(255,255,255,0.96), 0 0 22px rgba(82,231,255,0.30), 0 12px 28px rgba(90,124,168,0.10)"
                    : "inset 0 1px 0 rgba(255,255,255,0.96), inset 0 -1px 0 rgba(193,212,232,0.45), 0 12px 28px rgba(90,124,168,0.10)",
  }, style)}>{children}</div>
);

const TitleX = ({ children, size = 22, style }) => (
  <h2 style={Object.assign({ margin: 0, fontFamily: GX.font, fontSize: size, fontWeight: 800, lineHeight: 1.15, letterSpacing: "0.06em", color: GX.charcoal, textAlign: "center", textTransform: "uppercase" }, style)}>{children}</h2>
);
const SubX = ({ children, style }) => (
  <div style={Object.assign({ fontFamily: GX.font, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: GX.cyan, textShadow: "0 0 6px rgba(82,231,255,0.55)", textAlign: "center" }, style)}>{children}</div>
);
const BodyX = ({ children, style }) => (
  <p style={Object.assign({ margin: 0, fontFamily: GX.font, fontSize: 13, fontWeight: 400, lineHeight: 1.55, color: GX.exec, textAlign: "center" }, style)}>{children}</p>
);

const CtaX = ({ children, disabled, ghost, style, onClick }) => (
  <button onClick={onClick} disabled={disabled} style={Object.assign({
    height: 54, width: "100%",
    border: ghost ? `1px solid ${GX.cyan}` : "none", borderRadius: 999,
    background: ghost ? "rgba(255,255,255,0.6)" : "linear-gradient(180deg, #7df0ff 0%, #52e7ff 50%, #1ec1de 100%)",
    color: ghost ? GX.cyan : GX.charcoal,
    fontFamily: GX.font, fontSize: 12, fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase",
    boxShadow: ghost ? "inset 0 1px 0 rgba(255,255,255,0.9), 0 0 12px rgba(82,231,255,0.20)" : "inset 0 1px 0 rgba(255,255,255,0.85), 0 6px 18px rgba(82,231,255,0.34)",
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
  }, style)}>{children}</button>
);

const InputX = ({ placeholder, type = "text", value, onChange, label }) => (
  <div style={{ width: "100%" }}>
    {label && <div style={{ fontFamily: GX.font, fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: GX.soft, marginBottom: 6 }}>{label}</div>}
    <div style={{ height: 48, borderRadius: 999, border: `1px solid ${GX.cyan}`, background: "rgba(255,255,255,0.85)", boxShadow: "inset 2px 2px 8px rgba(152,163,179,0.22), inset -6px -6px 12px rgba(255,255,255,0.94)", padding: "0 18px", display: "flex", alignItems: "center" }}>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: GX.font, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: GX.charcoal }}/>
    </div>
  </div>
);

/* ============ 10 · SPLASH ============ */
function SplashScreen() {
  const [pulse, setPulse] = useStateX(0);
  useEffectX(() => {
    const t = setInterval(() => setPulse((p) => (p + 1) % 3), 600);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <CapsuleX>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
          <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{
                position: "absolute", width: 200 + i * 36, height: 200 + i * 36, borderRadius: "50%",
                border: "1px solid rgba(82,231,255,0.30)",
                boxShadow: "0 0 14px rgba(82,231,255,0.30)",
                opacity: 0.6 - i * 0.14,
              }}/>
            ))}
            <div style={{ position: "absolute", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(82,231,255,0.32), transparent 65%)", filter: "blur(10px)" }}/>
            <img src={AX.logo} alt="GUTO" style={{ position: "relative", width: 200, filter: "drop-shadow(0 0 22px rgba(82,231,255,0.85)) drop-shadow(0 0 4px rgba(255,255,255,0.9))" }}/>
          </div>
          <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, transparent, rgba(82,231,255,0.85), transparent)" }}/>
          <SubX style={{ fontSize: 9, color: GX.soft, letterSpacing: "0.42em" }}>I N I C I A L I Z A N D O</SubX>
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: "50%",
                background: pulse === i ? GX.cyan : "rgba(82,231,255,0.25)",
                boxShadow: pulse === i ? "0 0 10px rgba(82,231,255,0.85)" : "none",
                transition: "all .3s",
              }}/>
            ))}
          </div>
        </div>
      </CapsuleX>
    </div>
  );
}

/* ============ 11 · LANGUAGE — sem texto, só bandeiras premium ============ */
const FlagBR = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <defs>
      <radialGradient id="brG" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#21c074"/>
        <stop offset="100%" stopColor="#00833a"/>
      </radialGradient>
      <linearGradient id="brY" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffe26b"/>
        <stop offset="100%" stopColor="#f5b400"/>
      </linearGradient>
      <radialGradient id="brB" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#1c4fbf"/>
        <stop offset="100%" stopColor="#0a2a7a"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#brG)"/>
    <path d="M50 18 L82 50 L50 82 L18 50 Z" fill="url(#brY)"/>
    <circle cx="50" cy="50" r="16" fill="url(#brB)"/>
    <path d="M37 47 Q50 40 63 53" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    {[[44,46],[50,44],[56,46],[48,52],[52,52],[46,49],[54,50]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="0.9" fill="#fff"/>)}
  </svg>
);
const FlagUS = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <defs>
      <clipPath id="usC"><circle cx="50" cy="50" r="48"/></clipPath>
      <linearGradient id="usR" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e3253a"/>
        <stop offset="100%" stopColor="#a6071f"/>
      </linearGradient>
      <linearGradient id="usB" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1c3da6"/>
        <stop offset="100%" stopColor="#0a1c5e"/>
      </linearGradient>
    </defs>
    <g clipPath="url(#usC)">
      <rect width="100" height="100" fill="#fff"/>
      {[0,2,4,6,8,10,12].map(i => <rect key={i} y={2 + i * 7.5} width="100" height="7.5" fill="url(#usR)"/>)}
      <rect width="48" height="52" fill="url(#usB)"/>
      {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 6 }).map((_, c) => (
        <circle key={`${r}-${c}`} cx={5 + c * 7.5} cy={6 + r * 10} r="1.3" fill="#fff"/>
      )))}
      {Array.from({ length: 4 }).map((_, r) => Array.from({ length: 5 }).map((_, c) => (
        <circle key={`b${r}-${c}`} cx={8.5 + c * 7.5} cy={11 + r * 10} r="1.3" fill="#fff"/>
      )))}
    </g>
  </svg>
);
const FlagES = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <defs>
      <clipPath id="esC"><circle cx="50" cy="50" r="48"/></clipPath>
      <linearGradient id="esR" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d62336"/>
        <stop offset="100%" stopColor="#9b0a1d"/>
      </linearGradient>
      <linearGradient id="esY" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffd84a"/>
        <stop offset="100%" stopColor="#e6a900"/>
      </linearGradient>
    </defs>
    <g clipPath="url(#esC)">
      <rect width="100" height="25" fill="url(#esR)"/>
      <rect y="25" width="100" height="50" fill="url(#esY)"/>
      <rect y="75" width="100" height="25" fill="url(#esR)"/>
      <g transform="translate(34 50)">
        <rect x="-7" y="-9" width="14" height="18" rx="1.5" fill="#9b0a1d" stroke="#7a0517" strokeWidth="0.6"/>
        <path d="M-5 -7 L0 -3 L5 -7 L5 5 L-5 5 Z" fill="#e6a900"/>
        <rect x="-1.2" y="-3" width="2.4" height="8" fill="#9b0a1d"/>
      </g>
    </g>
  </svg>
);
const FlagIT = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <defs>
      <clipPath id="itC"><circle cx="50" cy="50" r="48"/></clipPath>
      <linearGradient id="itG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#21c074"/>
        <stop offset="100%" stopColor="#008a3c"/>
      </linearGradient>
      <linearGradient id="itR" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e63a3a"/>
        <stop offset="100%" stopColor="#a60a13"/>
      </linearGradient>
    </defs>
    <g clipPath="url(#itC)">
      <rect width="33.3" height="100" fill="url(#itG)"/>
      <rect x="33.3" width="33.4" height="100" fill="#fff"/>
      <rect x="66.7" width="33.3" height="100" fill="url(#itR)"/>
    </g>
  </svg>
);

function LanguageScreen() {
  const [sel, setSel] = useStateX("pt-BR");
  const langs = [
    { c: "pt-BR", F: FlagBR, name: "Português", sub: "Brasil" },
    { c: "en-US", F: FlagUS, name: "English",   sub: "United States" },
    { c: "it-IT", F: FlagIT, name: "Italiano",  sub: "Italia" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <CapsuleX>
        {/* corner ticks for cinematic feel */}
        {[
          { top: 70, left: 18, b: "borderTop borderLeft" },
          { top: 70, right: 18, b: "borderTop borderRight" },
          { bottom: 28, left: 18, b: "borderBottom borderLeft" },
          { bottom: 28, right: 18, b: "borderBottom borderRight" },
        ].map((p, i) => {
          const st = { position: "absolute", width: 16, height: 16, ...p };
          delete st.b;
          if (p.b.includes("borderTop")) st.borderTop = "1px solid rgba(82,231,255,0.7)";
          if (p.b.includes("borderBottom")) st.borderBottom = "1px solid rgba(82,231,255,0.7)";
          if (p.b.includes("borderLeft")) st.borderLeft = "1px solid rgba(82,231,255,0.7)";
          if (p.b.includes("borderRight")) st.borderRight = "1px solid rgba(82,231,255,0.7)";
          return <div key={i} style={st}/>;
        })}

        <div style={{ position: "absolute", inset: 0, padding: "60px 24px 36px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
          {/* logo orb */}
          <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
            <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(82,231,255,0.30), transparent 65%)", filter: "blur(10px)" }}/>
            <img src={AX.logo} alt="GUTO" style={{ position: "relative", width: 110, filter: "drop-shadow(0 0 16px rgba(82,231,255,0.7))" }}/>
          </div>

          {/* vertical flag list — 3 languages */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
            {langs.map((l) => {
              const on = sel === l.c;
              const F = l.F;
              return (
                <button key={l.c} onClick={() => setSel(l.c)} aria-label={l.c} style={{
                  position: "relative",
                  display: "flex", alignItems: "center", gap: 16,
                  width: "100%", padding: "14px 16px 14px 14px",
                  borderRadius: 20,
                  border: on ? "1.5px solid rgba(82,231,255,0.75)" : "1px solid rgba(193,212,232,0.65)",
                  background: on
                    ? "linear-gradient(135deg, rgba(82,231,255,0.14), rgba(255,255,255,0.75))"
                    : "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                  boxShadow: on
                    ? "0 0 18px rgba(82,231,255,0.22), inset 0 1px 0 rgba(255,255,255,0.92), 0 8px 20px rgba(90,124,168,0.12)"
                    : "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 12px rgba(90,124,168,0.08)",
                  cursor: "pointer", transition: "all 300ms ease", textAlign: "left",
                }}>
                  {/* flag medallion */}
                  <div style={{ position: "relative", width: 62, height: 62, flexShrink: 0 }}>
                    {on && <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "radial-gradient(circle, rgba(82,231,255,0.45), transparent 70%)", filter: "blur(6px)" }}/>}
                    <svg viewBox="0 0 120 120" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                      {Array.from({ length: 36 }).map((_, i) => {
                        const a = (i / 36) * Math.PI * 2 - Math.PI / 2;
                        const r1 = 58, r2 = i % 3 === 0 ? 52 : 55;
                        return <line key={i}
                          x1={60 + Math.cos(a) * r1} y1={60 + Math.sin(a) * r1}
                          x2={60 + Math.cos(a) * r2} y2={60 + Math.sin(a) * r2}
                          stroke={on ? "rgba(82,231,255,0.85)" : "rgba(90,124,168,0.28)"}
                          strokeWidth={i % 3 === 0 ? 1.2 : 0.6}/>;
                      })}
                      <circle cx="60" cy="60" r="50" fill="none" stroke={on ? "#52e7ff" : "rgba(193,212,232,0.6)"} strokeWidth={on ? 1.6 : 1} style={on ? { filter: "drop-shadow(0 0 6px rgba(82,231,255,0.85))" } : {}}/>
                    </svg>
                    <div style={{ position: "absolute", inset: "14%", borderRadius: "50%", background: "linear-gradient(180deg,rgba(255,255,255,0.95),rgba(214,228,244,0.7))", boxShadow: on ? "0 0 18px rgba(82,231,255,0.4), inset 0 2px 4px rgba(255,255,255,0.95)" : "inset 0 2px 4px rgba(255,255,255,0.95), 0 6px 16px rgba(90,124,168,0.15)", padding: 3, display: "grid", placeItems: "center" }}>
                      <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden" }}><F/></div>
                      <div style={{ position: "absolute", top: "10%", left: "14%", width: "52%", height: "28%", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(255,255,255,0.55),transparent 70%)", pointerEvents: "none" }}/>
                    </div>
                  </div>
                  {/* text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: "800 16px/1.2 'Inter',sans-serif", color: on ? "#0d2341" : "#2D3748", letterSpacing: "-0.01em" }}>{l.name}</div>
                    <div style={{ marginTop: 3, font: "600 11px/1 'JetBrains Mono',monospace", letterSpacing: "0.12em", color: on ? "rgba(82,231,255,0.9)" : "rgba(90,124,168,0.8)", textTransform: "uppercase" }}>{l.sub}</div>
                  </div>
                  {/* selected indicator */}
                  {on && (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(180deg,#7df0ff,#52e7ff)", display: "grid", placeItems: "center", flexShrink: 0, boxShadow: "0 0 12px rgba(82,231,255,0.7)" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0d2341" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                  {!on && (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(193,212,232,0.7)", display: "grid", placeItems: "center", flexShrink: 0, background: "rgba(255,255,255,0.5)" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(90,124,168,0.55)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* continue arrow — minimal, no copy */}
          <button aria-label="Continuar" style={{
            position: "relative", width: 64, height: 64, borderRadius: "50%",
            border: `1px solid ${GX.cyan}`,
            background: "linear-gradient(180deg, #7df0ff 0%, #52e7ff 50%, #1ec1de 100%)",
            color: GX.charcoal, cursor: "pointer", display: "grid", placeItems: "center",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.92), 0 0 22px rgba(82,231,255,0.55), 0 10px 22px rgba(82,231,255,0.30)",
          }}>
            <IcArrow size={24} stroke={2.4}/>
            <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "1px solid rgba(82,231,255,0.4)" }}/>
          </button>
        </div>
      </CapsuleX>
    </div>
  );
}

/* ============ 12 · NAME — minimal: logo + input + frase ============ */
function NameScreen() {
  const [name, setName] = useStateX("");
  const sealed = name.trim().length >= 2;
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <CapsuleX>
        <div style={{ position: "absolute", inset: 0, padding: "60px 28px 36px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 44 }}>

          {/* GUTO logo */}
          <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
            <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(82,231,255,0.32), transparent 65%)", filter: "blur(12px)" }}/>
            <img src={AX.logo} alt="GUTO" style={{ position: "relative", width: 160, filter: "drop-shadow(0 0 18px rgba(82,231,255,0.75))" }}/>
          </div>

          {/* Input — GUTO & ___ */}
          <div style={{ width: "100%" }}>
            <div style={{ height: 60, borderRadius: 999, border: `1px solid ${GX.cyan}`, background: "rgba(255,255,255,0.92)", boxShadow: "inset 2px 2px 8px rgba(152,163,179,0.22), inset -6px -6px 12px rgba(255,255,255,0.94), 0 0 16px rgba(82,231,255,0.28)", padding: "0 6px 0 22px", display: "flex", alignItems: "center", gap: 10 }}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" maxLength={16} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: GX.font, fontSize: 18, fontWeight: 700, letterSpacing: "0.06em", color: GX.charcoal, textAlign: "center" }}/>
              <button disabled={!sealed} style={{ width: 48, height: 48, borderRadius: 999, background: sealed ? "linear-gradient(180deg, #7df0ff 0%, #52e7ff 50%, #1ec1de 100%)" : "rgba(193,212,232,0.6)", border: "none", color: GX.charcoal, display: "grid", placeItems: "center", cursor: sealed ? "pointer" : "not-allowed", boxShadow: sealed ? "inset 0 1px 0 rgba(255,255,255,0.9), 0 0 14px rgba(82,231,255,0.65)" : "none" }}>
                <IcArrow size={18} stroke={2.4}/>
              </button>
            </div>
          </div>

          {/* closing line */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, rgba(82,231,255,0.85), transparent)", boxShadow: "0 0 8px rgba(82,231,255,0.6)" }}/>
            <BodyX style={{ fontSize: 16, lineHeight: 1.4, color: GX.charcoal, fontWeight: 700, fontStyle: "italic", textAlign: "center", letterSpacing: "0.01em", textShadow: "0 1px 0 rgba(255,255,255,0.7)", maxWidth: 280 }}>"A partir de agora, esse nome anda comigo."</BodyX>
          </div>
        </div>
      </CapsuleX>
    </div>
  );
}

/* ============ 13 · LOGIN ============ */
function LoginScreen() {
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <CapsuleX>
        <div style={{ position: "absolute", inset: 0, padding: "60px 22px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 12 }}>
            <img src={AX.logo} alt="GUTO" style={{ width: 130, filter: "drop-shadow(0 0 16px rgba(82,231,255,0.7))" }}/>
          </div>
          <PlateX style={{ width: "100%", padding: "20px 18px", display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
            <InputX label="E-MAIL" placeholder="seu@email.com"/>
            <InputX label="SENHA" type="password" placeholder="••••••••"/>
            <CtaX>Entrar <IcArrow size={14}/></CtaX>
          </PlateX>
          <div style={{ width: "100%", marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(82,231,255,0.45), transparent)" }}/>
            <SubX style={{ fontSize: 8, color: GX.soft, letterSpacing: "0.30em" }}>OU</SubX>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(82,231,255,0.45), transparent)" }}/>
          </div>
          <CtaX ghost>Tenho um convite</CtaX>
          <div style={{ marginTop: "auto", textAlign: "center" }}>
            <BodyX style={{ fontSize: 10, color: GX.soft, fontStyle: "italic" }}>Precisa de convite? Fale com seu coach.</BodyX>
          </div>
        </div>
      </CapsuleX>
    </div>
  );
}

/* ============ 14 · ADMIN LOGIN ============ */
function AdminLoginScreen() {
  const [mode, setMode] = useStateX("admin");
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <CapsuleX>
        <div style={{ position: "absolute", inset: 0, padding: "60px 22px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 6 }}>
            <img src={AX.logo} alt="GUTO" style={{ width: 130, filter: "drop-shadow(0 0 16px rgba(82,231,255,0.7))" }}/>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
              <IcShield size={12} stroke={2}/>
              <SubX style={{ fontSize: 9, color: GX.soft, letterSpacing: "0.40em" }}>P A I N E L   D E   C O N T R O L E</SubX>
            </div>
          </div>
          <PlateX style={{ width: "100%", padding: 4, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {["coach", "admin"].map((m) => (
              <button key={m} onClick={() => setMode(m)} style={{
                height: 38, borderRadius: 999, border: "none", cursor: "pointer",
                background: mode === m ? "linear-gradient(180deg, #7df0ff, #1ec1de)" : "transparent",
                color: mode === m ? GX.charcoal : GX.exec,
                fontFamily: GX.font, fontSize: 10, fontWeight: 800, letterSpacing: "0.20em",
                boxShadow: mode === m ? "0 0 12px rgba(82,231,255,0.4)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                textTransform: "uppercase",
              }}>{m === "coach" ? <IcUser size={12}/> : <IcShield size={12}/>}{m}</button>
            ))}
          </PlateX>
          <PlateX style={{ width: "100%", padding: "20px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
            <InputX label="E-MAIL" placeholder="admin@guto.app"/>
            <InputX label="SENHA" type="password" placeholder="••••••••"/>
            <CtaX>Acessar painel <IcArrow size={14}/></CtaX>
          </PlateX>
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: GX.cyan, boxShadow: "0 0 6px rgba(82,231,255,0.7)" }}/>
            <SubX style={{ fontSize: 8, color: GX.soft, letterSpacing: "0.30em" }}>S E S S Ã O   S E G U R A</SubX>
          </div>
        </div>
      </CapsuleX>
    </div>
  );
}

/* ============ 15 · WORKOUT VALIDATION ============ */
function ValidationScreen() {
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <CapsuleX dim>
        <div style={{ position: "absolute", top: 60, left: 0, right: 0, padding: "0 22px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 5 }}>
          <SubX style={{ fontSize: 9, color: GX.soft, letterSpacing: "0.30em", textAlign: "left" }}>GUTO · VALIDATION</SubX>
          <button style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(193,212,232,0.7)", background: "rgba(255,255,255,0.7)", color: GX.exec, display: "grid", placeItems: "center", cursor: "pointer" }}><IcX size={14}/></button>
        </div>

        <div style={{ position: "absolute", inset: 0, paddingTop: 110, paddingBottom: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
          <SubX style={{ fontSize: 9, color: GX.soft }}>P O S I C I O N E   O   R O S T O</SubX>
          <div style={{ position: "relative", width: 260, height: 260, display: "grid", placeItems: "center" }}>
            <svg viewBox="0 0 260 260" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <circle cx="130" cy="130" r="124" fill="none" stroke="rgba(82,231,255,0.18)" strokeWidth="2"/>
              <circle cx="130" cy="130" r="124" fill="none" stroke="#52e7ff" strokeWidth="3" strokeLinecap="round" strokeDasharray="780 780" strokeDashoffset="430" transform="rotate(-90 130 130)" style={{ filter: "drop-shadow(0 0 8px rgba(82,231,255,0.85))" }}/>
            </svg>
            {[0, 1, 2, 3].map((i) => {
              const pos = ["top", "right", "bottom", "left"][i];
              return (
                <div key={i} style={{
                  position: "absolute",
                  [pos]: -10,
                  left: pos === "top" || pos === "bottom" ? "50%" : pos === "left" ? -10 : "auto",
                  transform: pos === "top" || pos === "bottom" ? "translateX(-50%)" : "none",
                  width: pos === "top" || pos === "bottom" ? 4 : 16,
                  height: pos === "top" || pos === "bottom" ? 16 : 4,
                  background: GX.cyan, borderRadius: 99,
                  boxShadow: "0 0 10px rgba(82,231,255,0.85)",
                }}/>
              );
            })}
            <div style={{ width: 220, height: 220, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 50% 40%, rgba(82,231,255,0.18), rgba(255,255,255,0.4) 60%, rgba(193,212,232,0.5) 100%)", display: "grid", placeItems: "center", boxShadow: "inset 0 0 30px rgba(82,231,255,0.25)" }}>
              <IcCam size={48} stroke={1.4}/>
            </div>
          </div>
          <BodyX style={{ fontSize: 11, color: GX.charcoal, fontStyle: "italic" }}>Encaixe o rosto no círculo</BodyX>

          <PlateX style={{ width: "calc(100% - 44px)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ textAlign: "left" }}>
              <SubX style={{ fontSize: 8, color: GX.soft, letterSpacing: "0.24em", textAlign: "left" }}>FRASE DE VALIDAÇÃO</SubX>
              <TitleX size={14} style={{ textAlign: "left", marginTop: 4, letterSpacing: "0.10em" }}>"TREINO FEITO, GUTO"</TitleX>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${GX.cyan}`, background: "rgba(82,231,255,0.15)", display: "grid", placeItems: "center", color: GX.charcoal }}><IcZap size={16}/></div>
          </PlateX>

          <div style={{ width: "calc(100% - 44px)" }}>
            <CtaX>Estou pronto</CtaX>
          </div>
        </div>
      </CapsuleX>
    </div>
  );
}

/* ============ 16 · ACESSO PAUSADO ============ */
function PausedScreen() {
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <CapsuleX dim>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: "0 28px" }}>
          <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
            <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(82,231,255,0.18), transparent 65%)", filter: "blur(10px)" }}/>
            <div style={{ position: "relative", width: 110, height: 110, borderRadius: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(232,240,250,0.7))", border: "1px solid rgba(193,212,232,0.7)", boxShadow: "inset 2px 2px 8px rgba(152,163,179,0.22), inset -6px -6px 12px rgba(255,255,255,0.94), 0 0 22px rgba(82,231,255,0.20)", display: "grid", placeItems: "center", color: GX.exec }}>
              <IcClock size={44} stroke={1.4}/>
            </div>
          </div>
          <img src={AX.logo} alt="GUTO" style={{ width: 90, opacity: 0.55, filter: "grayscale(0.4)" }}/>
          <div style={{ width: 46, height: 1, background: GX.cyan, boxShadow: "0 0 8px rgba(82,231,255,0.7)" }}/>
          <SubX style={{ fontSize: 10, color: GX.charcoal, letterSpacing: "0.34em" }}>A C E S S O   P A U S A D O</SubX>
          <BodyX style={{ fontSize: 12, maxWidth: 280, color: GX.exec }}>Seu ciclo atual no GUTO encerrou ou está aguardando ativação. A gente continua daqui quando você renovar.</BodyX>
          <div style={{ width: "100%", maxWidth: 280, marginTop: 6, display: "flex", flexDirection: "column", gap: 10 }}>
            <CtaX>Tentar novamente</CtaX>
            <button style={{ background: "transparent", border: "none", fontFamily: GX.font, fontSize: 9, fontWeight: 800, letterSpacing: "0.30em", textTransform: "uppercase", color: GX.soft, cursor: "pointer", textDecoration: "underline" }}>Sair da conta</button>
          </div>
          <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, textAlign: "center" }}>
            <SubX style={{ fontSize: 8, color: GX.soft, letterSpacing: "0.30em" }}>Fale com seu coach para reativar</SubX>
          </div>
        </div>
      </CapsuleX>
    </div>
  );
}

/* ============ 17 · CONVITE / INVITE ============ */
function InviteScreen() {
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <CapsuleX>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: "0 28px" }}>
          <img src={AX.logo} alt="GUTO" style={{ width: 130, filter: "drop-shadow(0 0 16px rgba(82,231,255,0.7))" }}/>
          <SubX style={{ fontSize: 9, color: GX.soft, letterSpacing: "0.40em" }}>C O N V I T E   D E T E C T A D O</SubX>
          <div style={{ position: "relative", width: 90, height: 90, display: "grid", placeItems: "center" }}>
            <svg viewBox="0 0 90 90" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(82,231,255,0.18)" strokeWidth="3"/>
              <circle cx="45" cy="45" r="40" fill="none" stroke="#52e7ff" strokeWidth="3" strokeLinecap="round" strokeDasharray="170 251" transform="rotate(-90 45 45)" style={{ filter: "drop-shadow(0 0 6px rgba(82,231,255,0.85))" }}>
                <animate attributeName="stroke-dashoffset" values="0;-251" dur="1.4s" repeatCount="indefinite"/>
              </circle>
            </svg>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(214,243,255,0.65))", border: `1px solid ${GX.cyan}`, display: "grid", placeItems: "center", boxShadow: "0 0 12px rgba(82,231,255,0.45)" }}>
              <IcCheck2 size={16} stroke={3}/>
            </div>
          </div>
          <PlateX glow style={{ width: "100%", maxWidth: 300, padding: "14px 16px" }}>
            <SubX style={{ fontSize: 8, color: GX.soft, letterSpacing: "0.24em" }}>TOKEN</SubX>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, fontWeight: 700, color: GX.charcoal, textAlign: "center", marginTop: 6, letterSpacing: "0.10em" }}>GTV-7K2-N4ZX-9P</div>
          </PlateX>
          <BodyX style={{ fontSize: 12, maxWidth: 280, color: GX.exec, fontStyle: "italic" }}>Validando convite. Em segundos você está dentro.</BodyX>
        </div>
      </CapsuleX>
    </div>
  );
}

/* ============ 18 · COACH (mobile preview) ============ */
function CoachScreen() {
  const [tab, setTab] = useStateX("alunos");
  const students = [
    { n: "RAFAEL VIEIRA",  s: "ATIVO",   xp: 420, st: "BABY"  },
    { n: "ANA CARDOSO",    s: "ATIVO",   xp: 1240, st: "TEEN" },
    { n: "BRUNO LIMA",     s: "PAUSADO", xp: 0,   st: "BABY"  },
    { n: "LARISSA DUARTE", s: "ATIVO",   xp: 880, st: "BABY"  },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <CapsuleX>
        <div style={{ position: "absolute", top: 56, left: 22, right: 22, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={AX.logo} alt="GUTO" style={{ height: 28, filter: "drop-shadow(0 0 10px rgba(82,231,255,0.55))" }}/>
            <span style={{ fontFamily: GX.font, fontSize: 9, fontWeight: 800, letterSpacing: "0.30em", color: GX.soft }}>COACH</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 99, background: "rgba(82,231,255,0.15)", border: `1px solid ${GX.cyan}` }}>
            <IcShield size={10}/>
            <span style={{ fontFamily: GX.font, fontSize: 8, fontWeight: 800, letterSpacing: "0.20em", color: GX.charcoal }}>TIME PRO</span>
          </div>
        </div>

        <div style={{ position: "absolute", top: 100, bottom: 22, left: 22, right: 22, display: "flex", flexDirection: "column", gap: 10 }}>
          <PlateX style={{ padding: "14px 16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[["ALUNOS", "12"], ["XP/SEM", "4.8K"], ["ATIVOS", "9"]].map(([l, v]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <TitleX size={20} style={{ color: GX.charcoal }}>{v}</TitleX>
                  <SubX style={{ fontSize: 8, color: GX.soft, marginTop: 2 }}>{l}</SubX>
                </div>
              ))}
            </div>
          </PlateX>

          <PlateX style={{ padding: 4, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            {[["alunos", "ALUNOS"], ["arena", "ARENA"], ["log", "LOG"]].map(([id, lbl]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                height: 32, borderRadius: 999, border: "none", cursor: "pointer",
                background: tab === id ? "linear-gradient(180deg, #7df0ff, #1ec1de)" : "transparent",
                color: tab === id ? GX.charcoal : GX.exec,
                fontFamily: GX.font, fontSize: 9, fontWeight: 800, letterSpacing: "0.20em",
                boxShadow: tab === id ? "0 0 10px rgba(82,231,255,0.4)" : "none",
              }}>{lbl}</button>
            ))}
          </PlateX>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
            {students.map((st, i) => (
              <PlateX key={i} style={{ padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(214,243,255,0.65))", border: `1px solid ${GX.cyan}`, display: "grid", placeItems: "center", color: GX.charcoal, flexShrink: 0 }}>
                    <IcUser size={14}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <TitleX size={12} style={{ textAlign: "left", letterSpacing: "0.06em" }}>{st.n}</TitleX>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                      <span style={{ padding: "2px 7px", borderRadius: 99, background: st.s === "ATIVO" ? "rgba(82,231,255,0.18)" : "rgba(193,212,232,0.5)", color: st.s === "ATIVO" ? GX.charcoal : GX.exec, fontFamily: GX.font, fontSize: 7.5, fontWeight: 800, letterSpacing: "0.20em" }}>{st.s}</span>
                      <span style={{ fontFamily: GX.font, fontSize: 7.5, fontWeight: 800, letterSpacing: "0.20em", color: GX.soft }}>{st.st}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <TitleX size={14} style={{ color: GX.cyan, textShadow: "0 0 4px rgba(82,231,255,0.4)" }}>{st.xp}</TitleX>
                    <SubX style={{ fontSize: 7, color: GX.soft }}>XP</SubX>
                  </div>
                </div>
              </PlateX>
            ))}
          </div>

          <CtaX ghost>+ Adicionar aluno</CtaX>
        </div>
      </CapsuleX>
    </div>
  );
}

/* ============ 19 · CADASTRAR SENHA ============ */
function CadastrarSenhaScreen() {
  const [pw, setPw] = useStateX("");
  const [pw2, setPw2] = useStateX("");
  const match = pw.length >= 6 && pw === pw2;
  const mismatch = pw2.length > 0 && pw !== pw2;

  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <CapsuleX>
        <div style={{ position: "absolute", inset: 0, padding: "60px 22px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 12 }}>
            <img src={AX.logo} alt="GUTO" style={{ width: 130, filter: "drop-shadow(0 0 16px rgba(82,231,255,0.7))" }}/>
          </div>
          <PlateX style={{ width: "100%", padding: "20px 18px", display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
            <TitleX size={18} style={{ textAlign: "center", marginBottom: 2 }}>Cadastre sua senha</TitleX>
            <InputX
              label="SENHA"
              type="password"
              placeholder="••••••••"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            <InputX
              label="CONFIRMAR SENHA"
              type="password"
              placeholder="••••••••"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
            />
            {mismatch && (
              <BodyX style={{ fontSize: 11, color: "#9d2b2b", textAlign: "center", fontWeight: 700, margin: "-4px 0" }}>
                As senhas não coincidem.
              </BodyX>
            )}
            <CtaX disabled={!match}>Selar acesso <IcArrow size={14}/></CtaX>
          </PlateX>
          <div style={{ marginTop: "auto", textAlign: "center" }}>
            <BodyX style={{ fontSize: 10, color: GX.soft, fontStyle: "italic" }}>Criptografada. Nem o GUTO vê.</BodyX>
          </div>
        </div>
      </CapsuleX>
    </div>
  );
}

Object.assign(window, { SplashScreen, LanguageScreen, NameScreen, LoginScreen, CadastrarSenhaScreen, AdminLoginScreen, ValidationScreen, PausedScreen, InviteScreen, CoachScreen });
