// GUTO · Premium futurista — assets reais + alinhamento central perfeito.
const { useState, Fragment } = React;

const G = {
  charcoal: "#2D3748",
  exec: "#4A5568",
  soft: "#5A7CA8",
  cyan: "#52e7ff",
  font: '"Inter", "Montserrat", system-ui, sans-serif',
};

const A = {
  bg: "assets/fundo.jpg",
  logo: "assets/logo.png",
  body: "assets/body-xray.png",
  baby: "assets/guto-baby.webm",
  babySuper: "assets/guto-baby-super.webm",
  teen: "assets/guto-teen.webm",
  teenSuper: "assets/guto-teen-super.webm",
  adult: "assets/guto-adult.webm",
  adultSuper: "assets/guto-adult-super.webm",
  elit: "assets/guto-elit.webm",
  elitSuper: "assets/guto-elit-super.webm",
};

/* ---------- icons ---------- */
const SVG = ({ children, size = 22, stroke = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const IcChat = (p) => <SVG {...p}><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></SVG>;
const IcDumb = (p) => <SVG {...p}><path d="M6 6v12M3 9v6M18 6v12M21 9v6M6 12h12"/></SVG>;
const IcUtensils = (p) => <SVG {...p}><path d="M3 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V2M6 11v11M14 4v6a2 2 0 0 0 2 2h2v10M16 2v2"/></SVG>;
const IcSwords = (p) => <SVG {...p}><path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M14.5 6.5 18 3h3v3l-3.5 3.5M5 14l4 4M7 17l-3 3M3 19l2 2"/></SVG>;
const IcTrend = (p) => <SVG {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></SVG>;
const IcPin = (p) => <SVG {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></SVG>;
const IcSettings = (p) => <SVG {...p} stroke={1.6}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></SVG>;
const IcMic = (p) => <SVG {...p}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10a7 7 0 0 1-14 0"/><line x1="12" y1="19" x2="12" y2="22"/></SVG>;
const IcVolOn = (p) => <SVG {...p}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></SVG>;
const IcVolOff = (p) => <SVG {...p}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></SVG>;
const IcSend = (p) => <SVG {...p}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></SVG>;
const IcLock = (p) => <SVG {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></SVG>;
const IcCheck = (p) => <SVG {...p}><polyline points="20 6 9 17 4 12"/></SVG>;
const IcPlay = (p) => <SVG {...p}><polygon points="6 4 20 12 6 20" fill="currentColor"/></SVG>;

/* ---------- chrome — fundo real + pilares ciano ---------- */
const Capsule = ({ children }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#fff" }}>
    <img src={A.bg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", transform: "scale(1.05)", filter: "saturate(1.05) brightness(1.02)" }}/>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 22%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.45) 78%, rgba(220,232,244,0.85) 100%), radial-gradient(120% 60% at 50% 8%, rgba(82,231,255,0.16), transparent 60%)" }}/>
    <div style={{ position: "absolute", left: 18, top: 70, bottom: 120, width: 1.5, background: "linear-gradient(180deg, transparent, rgba(82,231,255,0.65), transparent)", boxShadow: "0 0 10px rgba(82,231,255,0.7)", borderRadius: 99 }}/>
    <div style={{ position: "absolute", right: 18, top: 70, bottom: 120, width: 1.5, background: "linear-gradient(180deg, transparent, rgba(82,231,255,0.65), transparent)", boxShadow: "0 0 10px rgba(82,231,255,0.7)", borderRadius: 99 }}/>
    {children}
  </div>
);

const Plate = ({ children, style, glow }) => (
  <div style={Object.assign({
    background: "linear-gradient(180deg, rgba(255,255,255,0.78), rgba(245,250,255,0.55))",
    border: glow ? `1px solid ${G.cyan}` : "1px solid rgba(255,255,255,0.94)",
    borderRadius: 22, padding: "16px 18px",
    backdropFilter: "blur(18px) saturate(1.2)",
    WebkitBackdropFilter: "blur(18px) saturate(1.2)",
    boxShadow: glow
      ? "inset 0 1px 0 rgba(255,255,255,0.96), 0 0 22px rgba(82,231,255,0.30), 0 12px 28px rgba(90,124,168,0.10)"
      : "inset 0 1px 0 rgba(255,255,255,0.96), inset 0 -1px 0 rgba(193,212,232,0.45), 0 12px 28px rgba(90,124,168,0.10)",
  }, style)}>{children}</div>
);

const Title = ({ children, size = 22, style }) => (
  <h2 style={Object.assign({ margin: 0, fontFamily: G.font, fontSize: size, fontWeight: 800, lineHeight: 1.15, letterSpacing: "0.06em", color: G.charcoal, textAlign: "center", textTransform: "uppercase" }, style)}>{children}</h2>
);
const Sub = ({ children, style }) => (
  <div style={Object.assign({ fontFamily: G.font, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: G.cyan, textShadow: "0 0 6px rgba(82,231,255,0.55)", textAlign: "center" }, style)}>{children}</div>
);
const Body = ({ children, style }) => (
  <p style={Object.assign({ margin: 0, fontFamily: G.font, fontSize: 13, fontWeight: 400, lineHeight: 1.55, color: G.exec, textAlign: "center" }, style)}>{children}</p>
);

const Header = ({ kicker, title }) => (
  <div style={{ position: "absolute", top: 56, left: 14, right: 14, zIndex: 5 }}>
    <div style={{
      position: "relative",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
      padding: "12px 14px",
      borderRadius: 18,
      background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(238,247,255,0.72))",
      border: "1px solid rgba(193,212,232,0.6)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 18px rgba(90,124,168,0.10)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    }}>
      {/* cyan accent line on top */}
      <div style={{ position: "absolute", left: "50%", top: -1, transform: "translateX(-50%)", width: "36%", height: 2, borderRadius: 2, background: "linear-gradient(90deg, transparent, #52e7ff, transparent)", boxShadow: "0 0 10px rgba(82,231,255,0.85)" }}/>
      {/* back button */}
      <button aria-label="Voltar" style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(193,212,232,0.7)", background: "rgba(255,255,255,0.85)", display: "grid", placeItems: "center", color: G.exec, cursor: "pointer" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      {/* title + kicker */}
      <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
        <h1 style={{ margin: 0, fontFamily: G.font, fontSize: 19, fontWeight: 900, lineHeight: 1, letterSpacing: "0.02em", color: "#0a1a2e", textTransform: "uppercase", textShadow: "0 1px 0 rgba(255,255,255,0.95)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h1>
        {kicker && <div style={{ marginTop: 4, fontFamily: "JetBrains Mono, monospace", fontSize: 9, fontWeight: 800, lineHeight: 1.1, letterSpacing: "0.26em", color: "#0d2341", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{kicker}</div>}
      </div>
      {/* gear */}
      <button aria-label="Configurações" style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(82,231,255,0.6)", background: "rgba(82,231,255,0.10)", color: "#0d2341", display: "grid", placeItems: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), 0 0 8px rgba(82,231,255,0.18)", cursor: "pointer" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
      </button>
    </div>
  </div>
);

const Cta = ({ children, disabled, ghost, style }) => (
  <button disabled={disabled} style={Object.assign({
    height: 54, width: "100%",
    border: ghost ? `1px solid ${G.cyan}` : "none",
    borderRadius: 999,
    background: ghost ? "rgba(255,255,255,0.6)" : "linear-gradient(180deg, #7df0ff 0%, #52e7ff 50%, #1ec1de 100%)",
    color: ghost ? G.cyan : G.charcoal,
    fontFamily: G.font, fontSize: 12, fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase",
    boxShadow: ghost ? "inset 0 1px 0 rgba(255,255,255,0.9), 0 0 12px rgba(82,231,255,0.20)" : "inset 0 1px 0 rgba(255,255,255,0.85), 0 6px 18px rgba(82,231,255,0.34)",
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  }, style)}>{children}</button>
);

const NAV = [
  { id: "guto", Ic: IcChat },
  { id: "treino", Ic: IcDumb },
  { id: "dieta", Ic: IcUtensils },
  { id: "arena", Ic: IcSwords },
  { id: "evo", Ic: IcTrend },
  { id: "perc", Ic: IcPin },
];

const BottomNav = ({ active, onChange }) => (
  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 14px 18px", background: "linear-gradient(180deg, rgba(255,255,255,0.45), rgba(228,237,247,0.82))", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", borderTop: "1px solid rgba(255,255,255,0.94)" }}>
    <nav style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, justifyItems: "center" }}>
      {NAV.map(({ id, Ic }) => {
        const a = active === id;
        return (
          <button key={id} onClick={() => onChange && onChange(id)} style={{
            width: "100%", height: 52, borderRadius: 14, border: "none", cursor: "pointer",
            background: a ? "linear-gradient(180deg, rgba(82,231,255,0.34), rgba(82,231,255,0.10))" : "rgba(255,255,255,0.7)",
            boxShadow: a ? "inset 0 1px 0 rgba(255,255,255,0.95), 0 0 14px rgba(82,231,255,0.45)" : "inset 1px 2px 4px rgba(152,163,179,0.20), inset -2px -3px 6px rgba(255,255,255,0.95)",
            color: a ? G.cyan : "rgba(82,231,255,0.7)",
            display: "grid", placeItems: "center",
          }}><Ic size={22} stroke={a ? 2.4 : 2}/></button>
        );
      })}
    </nav>
  </div>
);

/* ---------- Mascot real (webm) ---------- */
const Mascot = ({ src = A.baby, size = 200 }) => (
  <video src={src} autoPlay loop muted playsInline style={{ width: size, height: size * 1.15, objectFit: "contain", display: "block", filter: "drop-shadow(0 0 24px rgba(82,231,255,0.35))" }}/>
);

/* ---------- Countries & cities (curated) ---------- */
const COUNTRIES = [
  { name: "Brasil",          cities: ["São Paulo","Rio de Janeiro","Belo Horizonte","Brasília","Curitiba","Salvador","Fortaleza","Recife","Porto Alegre","Manaus","Outra cidade"] },
  { name: "Portugal",        cities: ["Lisboa","Porto","Braga","Coimbra","Faro","Funchal","Aveiro","Évora","Outra cidade"] },
  { name: "Itália",          cities: ["Roma","Milão","Nápoles","Turim","Florença","Bolonha","Veneza","Palermo","Outra cidade"] },
  { name: "Estados Unidos",  cities: ["New York","Los Angeles","Miami","Chicago","Houston","Boston","San Francisco","Outra cidade"] },
  { name: "Espanha",         cities: ["Madri","Barcelona","Valência","Sevilha","Bilbao","Málaga","Outra cidade"] },
  { name: "Argentina",       cities: ["Buenos Aires","Córdoba","Rosário","Mendoza","La Plata","Outra cidade"] },
  { name: "México",          cities: ["Cidade do México","Guadalajara","Monterrey","Cancún","Puebla","Outra cidade"] },
  { name: "França",          cities: ["Paris","Marselha","Lyon","Toulouse","Nice","Bordeaux","Outra cidade"] },
  { name: "Alemanha",        cities: ["Berlim","Munique","Hamburgo","Frankfurt","Colônia","Stuttgart","Outra cidade"] },
  { name: "Reino Unido",     cities: ["Londres","Manchester","Birmingham","Edimburgo","Liverpool","Outra cidade"] },
  { name: "Canadá",          cities: ["Toronto","Montreal","Vancouver","Calgary","Ottawa","Outra cidade"] },
  { name: "Japão",           cities: ["Tóquio","Osaka","Kyoto","Yokohama","Sapporo","Outra cidade"] },
  { name: "Austrália",       cities: ["Sydney","Melbourne","Brisbane","Perth","Adelaide","Outra cidade"] },
  { name: "Suíça",           cities: ["Zurique","Genebra","Berna","Basel","Lausanne","Outra cidade"] },
  { name: "Holanda",         cities: ["Amsterdã","Roterdã","Haia","Utrecht","Eindhoven","Outra cidade"] },
  { name: "Outro país",      cities: ["Outra cidade"] },
];

/* Common food restrictions/intolerances — single curated list */
const FOOD_TAGS = [
  "Lactose","Glúten","Amendoim","Frutos do mar","Ovo","Soja","Carne vermelha","Carne suína","Peixe","Frango","Trigo","Açúcar refinado","Mariscos","Castanhas","Pimenta","Cebola","Alho","Vegetariano","Vegano","Halal","Kosher",
];

/* ---------- Interactive Mascot — two stacked videos, tap to swap costume.
   JS-driven rAF crossfade (520ms) so it works in all preview environments. ---------- */
function InteractiveMascot({ size = 300, srcA = A.baby, srcB = A.babySuper }) {
  const wrapRef = React.useRef(null);
  const refA = React.useRef(null);
  const refB = React.useRef(null);
  const layerARef = React.useRef(null);
  const layerBRef = React.useRef(null);
  const busyRef = React.useRef(false);
  const altRef = React.useRef(false);
  const [react, setReact] = useState(false);

  // Keep both videos time-synced — when the visible one ticks, snap the hidden one.
  React.useEffect(() => {
    const a = refA.current, b = refB.current;
    if (!a || !b) return;
    const onA = () => { if (!altRef.current && isFinite(a.currentTime)) try { b.currentTime = a.currentTime; } catch (_) {} };
    const onB = () => { if ( altRef.current && isFinite(b.currentTime)) try { a.currentTime = b.currentTime; } catch (_) {} };
    a.addEventListener('timeupdate', onA);
    b.addEventListener('timeupdate', onB);
    return () => { a.removeEventListener('timeupdate', onA); b.removeEventListener('timeupdate', onB); };
  }, []);

  function rafFade(from, to, durMs) {
    return new Promise((resolve) => {
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / durMs);
        const e = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
        from.style.setProperty('opacity', String(1 - e), 'important');
        to  .style.setProperty('opacity', String(e),     'important');
        if (t < 1) requestAnimationFrame(tick); else resolve();
      }
      requestAnimationFrame(tick);
    });
  }

  async function onTap(e) {
    e.stopPropagation();
    if (busyRef.current) return;
    busyRef.current = true;
    setReact(true);
    await new Promise(r => setTimeout(r, 280));
    const lA = layerARef.current, lB = layerBRef.current;
    const a = refA.current, b = refB.current;
    if (!altRef.current) {
      try { b.currentTime = a.currentTime; } catch (_) {}
      const p = b.play(); if (p && p.catch) p.catch(() => {});
      await rafFade(lA, lB, 520);
      altRef.current = true;
    } else {
      try { a.currentTime = b.currentTime; } catch (_) {}
      const p = a.play(); if (p && p.catch) p.catch(() => {});
      await rafFade(lB, lA, 520);
      altRef.current = false;
    }
    await new Promise(r => setTimeout(r, 160));
    setReact(false);
    await new Promise(r => setTimeout(r, 220));
    busyRef.current = false;
  }

  const baseFilter = react
    ? "drop-shadow(0 0 36px rgba(82,231,255,1)) drop-shadow(0 0 72px rgba(82,231,255,0.7)) brightness(1.18) saturate(1.25)"
    : "drop-shadow(0 0 24px rgba(82,231,255,0.35))";

  return (
    <div
      ref={wrapRef}
      onClick={onTap}
      style={{
        position: "relative", width: size, height: size * 1.15,
        cursor: "pointer", zIndex: 10,
        transform: react ? "scale(1.06)" : "scale(1)",
        transition: "transform 480ms cubic-bezier(.22,.61,.36,1)",
      }}
    >
      {/* layer A — base */}
      <div ref={layerARef} style={{ position: "absolute", inset: 0, opacity: 1 }}>
        <video ref={refA} src={srcA} autoPlay loop muted playsInline
          style={{ width: size, height: size * 1.15, objectFit: "contain", display: "block", filter: baseFilter, transition: "filter 480ms ease" }}/>
      </div>
      {/* layer B — alt costume */}
      <div ref={layerBRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
        <video ref={refB} src={srcB} autoPlay loop muted playsInline
          style={{ width: size, height: size * 1.15, objectFit: "contain", display: "block", filter: baseFilter, transition: "filter 480ms ease" }}/>
      </div>
    </div>
  );
}

/* ============ 01 · AUTH — PACTO ============ */
function AuthScreen() {
  const [held, setHeld] = useState(0);
  const [pressing, setPressing] = useState(false);
  const [muted, setMuted] = useState(false);
  React.useEffect(() => {
    if (!pressing) { setHeld(0); return; }
    const t = setInterval(() => setHeld((h) => Math.min(100, h + 4)), 60);
    return () => clearInterval(t);
  }, [pressing]);
  const R = 96, C = 2 * Math.PI * R;
  const sealed = held >= 100;

  // Custom fingerprint icon (uploaded asset)
  const Fingerprint = ({ size = 120, sealed = false, pressing = false }) => (
    <img
      src="assets/digital.png"
      alt="Digital"
      width={size}
      height={size}
      style={{
        width: size, height: size, objectFit: "contain",
        filter: sealed
          ? "brightness(0) saturate(100%) invert(78%) sepia(58%) saturate(2654%) hue-rotate(141deg) brightness(101%) contrast(101%) drop-shadow(0 0 8px rgba(82,231,255,0.85))"
          : pressing
            ? "brightness(0) saturate(100%) invert(20%) sepia(18%) saturate(900%) hue-rotate(186deg) brightness(95%) contrast(92%) drop-shadow(0 0 6px rgba(82,231,255,0.55))"
            : "brightness(0) saturate(100%) invert(20%) sepia(18%) saturate(900%) hue-rotate(186deg) brightness(95%) contrast(92%)",
        transition: "filter .3s",
      }}
    />
  );

  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        {/* corner crosshairs */}
        {[["top:74px;left:18px","border-top:1px solid;border-left:1px solid"],
          ["top:74px;right:18px","border-top:1px solid;border-right:1px solid"],
          ["bottom:18px;left:18px","border-bottom:1px solid;border-left:1px solid"],
          ["bottom:18px;right:18px","border-bottom:1px solid;border-right:1px solid"]].map(([p, b], i) => {
          const st = { position: "absolute", width: 16, height: 16, borderColor: "rgba(82,231,255,0.7)" };
          p.split(";").forEach(s => { const [k, v] = s.split(":"); st[k.trim()] = v.trim(); });
          b.split(";").forEach(s => { const [k, v] = s.split(":"); st[k.trim().replace(/-./g, x => x[1].toUpperCase())] = v.trim(); });
          return <div key={i} style={st}/>;
        })}

        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", padding: "62px 22px 32px", gap: 18 }}>

          {/* TOP — kicker + impact headline */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 22, height: 1, background: "linear-gradient(90deg, transparent, rgba(82,231,255,0.85))" }}/>
              <Sub style={{ fontSize: 9, color: G.cyan, letterSpacing: "0.42em", textShadow: "0 0 6px rgba(82,231,255,0.55)" }}>P A C T O   I N I C I A L</Sub>
              <span style={{ width: 22, height: 1, background: "linear-gradient(270deg, transparent, rgba(82,231,255,0.85))" }}/>
            </div>

            <Title size={36} style={{ letterSpacing: "-0.01em", lineHeight: 1, fontWeight: 900, marginTop: 6 }}>Tem certeza?</Title>

            <Body style={{ color: G.charcoal, fontSize: 16, fontWeight: 700, letterSpacing: "0.02em", marginTop: 6 }}>Depois que apertar, o jogo fica sério.</Body>
          </div>

          {/* BIG FINGERPRINT */}
          <div style={{ position: "relative", width: 240, height: 240, display: "grid", placeItems: "center", marginTop: 4 }}>
            {/* outer halo rings */}
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                position: "absolute", width: 240 + i * 18, height: 240 + i * 18, borderRadius: "50%",
                border: "1px solid rgba(82,231,255,0.30)",
                opacity: pressing ? 0.95 - i * 0.20 : 0.55 - i * 0.12,
                boxShadow: "0 0 16px rgba(82,231,255,0.35)",
                transform: pressing ? `scale(${1 + i * 0.025})` : "scale(1)",
                transition: "transform .4s, opacity .4s",
              }}/>
            ))}

            <button
              onMouseDown={() => setPressing(true)}
              onMouseUp={() => setPressing(false)}
              onMouseLeave={() => setPressing(false)}
              onTouchStart={() => setPressing(true)}
              onTouchEnd={() => setPressing(false)}
              style={{ position: "relative", width: 240, height: 240, border: "none", background: "transparent", cursor: "pointer", padding: 0 }}
            >
              {/* tick dial + progress arc */}
              <svg viewBox="0 0 240 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                {Array.from({ length: 60 }).map((_, i) => {
                  const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
                  const r1 = 116, r2 = i % 5 === 0 ? 104 : 110;
                  return <line key={i} x1={120 + Math.cos(a) * r1} y1={120 + Math.sin(a) * r1} x2={120 + Math.cos(a) * r2} y2={120 + Math.sin(a) * r2} stroke="rgba(90,124,168,0.40)" strokeWidth={i % 5 === 0 ? 1.6 : 0.8}/>;
                })}
                <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(82,231,255,0.18)" strokeWidth="3"/>
                <circle cx="120" cy="120" r={R} fill="none" stroke="#52e7ff" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={C} strokeDashoffset={C * (1 - held / 100)}
                  transform="rotate(-90 120 120)"
                  style={{ filter: "drop-shadow(0 0 8px rgba(82,231,255,0.95))", transition: "stroke-dashoffset .15s linear" }}/>
              </svg>

              {/* inner glass dome with REAL fingerprint */}
              <div style={{
                position: "absolute", inset: 38, borderRadius: "50%",
                background: "radial-gradient(circle at 35% 28%, #ffffff 0%, #ecf5ff 45%, #c8d8ec 100%)",
                boxShadow: pressing || sealed
                  ? "0 0 48px rgba(82,231,255,0.95), inset 0 2px 10px rgba(255,255,255,0.98), inset 0 -10px 24px rgba(82,231,255,0.40)"
                  : "0 0 26px rgba(82,231,255,0.45), 0 18px 36px rgba(90,124,168,0.28), inset 0 2px 10px rgba(255,255,255,0.96)",
                display: "grid", placeItems: "center",
                transition: "box-shadow .3s",
                overflow: "hidden",
              }}>
                {/* scanning line */}
                {pressing && (
                  <div style={{
                    position: "absolute", left: 0, right: 0, top: `${held}%`,
                    height: 3, background: "linear-gradient(90deg, transparent, #52e7ff, transparent)",
                    boxShadow: "0 0 12px rgba(82,231,255,0.95)", zIndex: 2,
                  }}/>
                )}
                <Fingerprint size={140} color={sealed ? G.cyan : G.charcoal} glow={pressing || sealed}/>
              </div>

              {/* core glow */}
              <div style={{ position: "absolute", inset: "44%", borderRadius: "50%", background: G.cyan, filter: "blur(18px)", opacity: pressing ? 0.7 : 0.25, transition: "opacity .3s" }}/>
            </button>
          </div>

          {/* press-and-hold label */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", marginTop: -2 }}>
            <span style={{ width: 22, height: 1, background: "linear-gradient(90deg, transparent, rgba(82,231,255,0.7))" }}/>
            <Sub style={{ color: sealed ? G.cyan : G.soft, letterSpacing: "0.34em", fontSize: 10, whiteSpace: "nowrap", textShadow: sealed ? "0 0 8px rgba(82,231,255,0.6)" : "none" }}>
              {sealed ? "PACTO SELADO" : "PRESSIONE E SEGURE"}
            </Sub>
            <span style={{ width: 22, height: 1, background: "linear-gradient(270deg, transparent, rgba(82,231,255,0.7))" }}/>
          </div>

          {/* COMPROMISSO — pact-style quote with signature, no card */}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, maxWidth: 300, width: "100%", paddingBottom: 4 }}>
            <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, transparent, rgba(82,231,255,0.85), transparent)", boxShadow: "0 0 10px rgba(82,231,255,0.55)" }}/>
            <Body style={{ color: G.charcoal, fontSize: 15, fontWeight: 600, lineHeight: 1.5, fontStyle: "italic", letterSpacing: "0.01em", textAlign: "center" }}>
              "Eu assumo o compromisso comigo mesmo.<br/>Sem desculpa. Sem volta."
            </Body>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginTop: 2 }}>
              <span style={{ fontFamily: G.font, fontWeight: 900, fontSize: 16, color: G.cyan, letterSpacing: "0.18em", textShadow: "0 0 8px rgba(82,231,255,0.55)" }}>— WILL</span>
              <span style={{ width: 70, height: 1, background: "rgba(82,231,255,0.5)" }}/>
            </div>
          </div>
        </div>
      </Capsule>
    </div>
  );
}

/* ============ 02 · TERMS ============ */
function TermsScreen() {
  const [a, setA] = useState(false), [b, setB] = useState(false);
  const cards = [
    { i: "🧠", t: "O GUTO é uma IA", d: "Assistente digital com IA. Ajuda com treino, dieta e rotina, mas não substitui avaliação médica, nutricional ou profissional presencial." },
    { i: "🛡", t: "Uso de dados", d: "Para gerar treinos, dietas e acompanhamento, o GUTO usa peso, altura, objetivo, limitações, restrições e histórico." },
    { i: "⚠", t: "Responsabilidade", d: "Se sentir dor, tontura, mal-estar ou tiver condição médica, interrompa o treino e procure um profissional." },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <div style={{ position: "absolute", inset: 0, padding: "60px 22px 24px", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <img src={A.logo} alt="GUTO" style={{ width: 84, height: "auto", filter: "drop-shadow(0 0 12px rgba(82,231,255,0.5))" }}/>
          <Title size={24}>Antes de começar</Title>
          <Body>Leia e confirme abaixo para continuar.</Body>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            {cards.map((c) => (
              <Plate key={c.t} style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14 }}>{c.i}</span>
                  <Sub style={{ fontSize: 9, letterSpacing: "0.20em" }}>{c.t.toUpperCase()}</Sub>
                </div>
                <Body style={{ fontSize: 12 }}>{c.d}</Body>
              </Plate>
            ))}
          </div>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            {[{ v: a, s: setA, t: "Aceito que o GUTO use meus dados para gerar treino, dieta e acompanhamento." }, { v: b, s: setB, t: "Aceito os Termos de Uso e a Política de Privacidade." }].map((x, i) => (
              <button key={i} onClick={() => x.s(!x.v)} style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "transparent", border: "none", textAlign: "left", cursor: "pointer", padding: 0 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: x.v ? `1.5px solid ${G.cyan}` : "1.5px solid rgba(90,124,168,0.4)", background: x.v ? G.cyan : "transparent", boxShadow: x.v ? "0 0 10px rgba(82,231,255,0.5)" : "none", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 2 }}>
                  {x.v && <IcCheck size={12} stroke={3}/>}
                </div>
                <Body style={{ fontSize: 12, flex: 1, textAlign: "left" }}>{x.t}</Body>
              </button>
            ))}
          </div>
          <div style={{ width: "100%", marginTop: 6 }}><Cta disabled={!(a && b)}>Concordo · Continuar</Cta></div>
        </div>
      </Capsule>
    </div>
  );
}

/* ============ 03 · CALIBRATION ============ */
function CalibrationScreen() {
  const [g, setG] = useState("M"), [obj, setObj] = useState("EMAGRECER"), [state, setState] = useState("PARADO"), [loc, setLoc] = useState("ACADEMIA");
  const [country, setCountry] = useState("Brasil");
  const [city, setCity] = useState("São Paulo");
  const [naoComo, setNaoComo] = useState(["Lactose"]);
  const citiesForCountry = (COUNTRIES.find(c => c.name === country) || {}).cities || [];
  const Chip = ({ on, onClick, children }) => (
    <button onClick={onClick} style={{
      height: 36, padding: "0 12px", borderRadius: 999, cursor: "pointer", width: "100%",
      border: on ? `1.5px solid ${G.cyan}` : "1px solid rgba(90,124,168,0.28)",
      background: on ? "rgba(82,231,255,0.18)" : "rgba(255,255,255,0.78)",
      color: G.charcoal, fontFamily: G.font, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
      boxShadow: on ? "0 0 12px rgba(82,231,255,0.38), inset 0 1px 0 rgba(255,255,255,0.9)" : "inset 0 1px 0 rgba(255,255,255,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>{children}</button>
  );
  const Field = ({ label, children }) => (
    <div style={{ width: "100%" }}>
      <Sub style={{ fontSize: 9, color: G.soft, marginBottom: 6, letterSpacing: "0.28em" }}>{label}</Sub>
      {children}
    </div>
  );
  const Stat = ({ label, value }) => (
    <Plate style={{ padding: "8px 10px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
      <Sub style={{ fontSize: 8, color: G.soft, letterSpacing: "0.24em" }}>{label}</Sub>
      <Title size={18} style={{ letterSpacing: "0" }}>{value}</Title>
    </Plate>
  );
  const ChipSm = ({ on, onClick, children }) => (
    <button onClick={onClick} style={{
      height: 28, padding: "0 6px", borderRadius: 999, cursor: "pointer", width: "100%",
      border: on ? `1.5px solid ${G.cyan}` : "1px solid rgba(90,124,168,0.28)",
      background: on ? "rgba(82,231,255,0.18)" : "rgba(255,255,255,0.78)",
      color: G.charcoal, fontFamily: G.font, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.10em",
      boxShadow: on ? "0 0 10px rgba(82,231,255,0.38)" : "inset 0 1px 0 rgba(255,255,255,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      minWidth: 0,
    }}>{children}</button>
  );
  const Lbl = ({ children, style }) => (
    <div style={Object.assign({ fontFamily: G.font, fontSize: 8, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: G.cyan, textShadow: "0 0 6px rgba(82,231,255,0.55)", marginBottom: 4, textAlign: "left" }, style)}>{children}</div>
  );
  const NumPlate = ({ label, value }) => (
    <div>
      <Lbl>{label}</Lbl>
      <div style={{ height: 30, borderRadius: 999, border: `1px solid ${G.cyan}`, background: "rgba(255,255,255,0.78)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), 0 0 8px rgba(82,231,255,0.18)", display: "grid", placeItems: "center", fontFamily: G.font, fontSize: 13, fontWeight: 800, color: G.charcoal }}>{value}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <div style={{ position: "absolute", top: 50, left: 0, right: 0, textAlign: "center", zIndex: 5 }}>
          <Title size={20} style={{ letterSpacing: "0.18em" }}>CALIBRAGEM INICIAL</Title>
        </div>
        <div style={{ position: "absolute", top: 84, bottom: 12, left: 0, right: 0, padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>

          {/* TOP — onde mora (país + cidade) + não como */}
          <Plate style={{ padding: "10px 12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <Lbl>PAÍS</Lbl>
                <Select value={country} onChange={(v) => { setCountry(v); const next = (COUNTRIES.find(c => c.name === v) || {}).cities || []; setCity(next[0] || ""); }} options={COUNTRIES.map(c => c.name)} placeholder="Selecionar país"/>
              </div>
              <div>
                <Lbl>CIDADE</Lbl>
                <Select value={city} onChange={setCity} options={citiesForCountry} placeholder="Selecionar cidade"/>
              </div>
            </div>
            <div style={{ height: 8 }}/>
            <Lbl>NÃO COMO <span style={{ color: G.soft, fontWeight: 600, letterSpacing: "0.18em" }}>(INTOLERÂNCIA, ALERGIA OU NÃO GOSTO)</span></Lbl>
            <div style={{ height: 28, borderRadius: 999, border: `1px solid ${G.cyan}`, background: "rgba(255,255,255,0.78)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), 0 0 8px rgba(82,231,255,0.18)", padding: "0 12px", display: "flex", alignItems: "center" }}>
              <input placeholder="Ex: lactose, amendoim, carne vermelha…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: G.font, fontSize: 11, color: G.charcoal }}/>
            </div>
          </Plate>

          {/* MID — gênero + idade · corpo · peso + altura */}
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "98px 1fr 98px", gap: 8, alignItems: "stretch", flexShrink: 0 }}>
            {/* esquerda */}
            <Plate style={{ padding: "10px 10px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {["FEMININO","MASCULINO"].map((x) => {
                  const on = g === x[0];
                  return (
                    <button key={x} onClick={() => setG(x[0])} style={{
                      height: 30, padding: "0 4px", borderRadius: 999, cursor: "pointer", width: "100%",
                      border: on ? `1.5px solid ${G.cyan}` : `1px solid ${G.cyan}`,
                      background: on ? "rgba(82,231,255,0.18)" : "rgba(255,255,255,0.78)",
                      color: G.charcoal, fontFamily: G.font, fontSize: 8.5, fontWeight: 800, letterSpacing: "0.10em",
                      boxShadow: on ? "0 0 10px rgba(82,231,255,0.4)" : "inset 0 1px 0 rgba(255,255,255,0.92)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0,
                    }}>{x}</button>
                  );
                })}
              </div>
              <div style={{ height: 1, background: "rgba(82,231,255,0.4)" }}/>
              <NumPlate label="IDADE" value="32"/>
            </Plate>
            {/* corpo central */}
            <div style={{ position: "relative", display: "grid", placeItems: "center", minHeight: 230 }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 55% at 50% 55%, rgba(82,231,255,0.32), transparent 72%)", filter: "blur(8px)" }}/>
              <div style={{ position: "absolute", left: "50%", bottom: 4, transform: "translateX(-50%)", width: 130, height: 10, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(82,231,255,0.6), transparent 70%)", filter: "blur(3px)" }}/>
              <img src={A.body} alt="" style={{ position: "relative", height: 226, width: "auto", objectFit: "contain", filter: "drop-shadow(0 0 14px rgba(82,231,255,0.65))" }}/>
            </div>
            {/* direita */}
            <Plate style={{ padding: "10px 10px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
              <NumPlate label="PESO (KG)" value="70"/>
              <div style={{ height: 1, background: "rgba(82,231,255,0.4)" }}/>
              <NumPlate label="ALTURA (CM)" value="170"/>
              <div style={{ height: 1, background: "rgba(82,231,255,0.4)" }}/>
              <NumPlate label="IMC" value="24,2"/>
            </Plate>
          </div>

          {/* BOTTOM stack */}
          <Plate style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div>
              <Lbl>ESTADO ATUAL:</Lbl>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5 }}>
                {["PARADO","VOLTANDO","TREINANDO"].map((x) => <ChipSm key={x} on={state===x} onClick={() => setState(x)}>{x}</ChipSm>)}
              </div>
            </div>
            <div>
              <Lbl>LIMITAÇÃO / PATOLOGIA</Lbl>
              <div style={{ height: 28, borderRadius: 999, border: `1px solid ${G.cyan}`, background: "rgba(255,255,255,0.78)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95)", padding: "0 12px", display: "flex", alignItems: "center" }}>
                <input placeholder="Detalhe sua limitação…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: G.font, fontSize: 11, color: G.charcoal }}/>
              </div>
            </div>
            <div>
              <Lbl>OBJETIVO</Lbl>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 5, marginBottom: 5 }}>
                {["EMAGRECER","HIPERTROFIA","CONDIC.","SAÚDE"].map((x) => <ChipSm key={x} on={obj===x} onClick={() => setObj(x)}>{x}</ChipSm>)}
              </div>
              <ChipSm on={obj==="CONSISTÊNCIA"} onClick={() => setObj("CONSISTÊNCIA")}>CONSISTÊNCIA</ChipSm>
            </div>
            <div>
              <Lbl>LOCAL PADRÃO DE TREINO</Lbl>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 }}>
                {["ACADEMIA","CASA","PARQUE","MISTO"].map((x) => <ChipSm key={x} on={loc===x} onClick={() => setLoc(x)}>{x}</ChipSm>)}
              </div>
            </div>
          </Plate>

          <button style={{
            height: 42, width: "100%", border: `1px solid ${G.cyan}`, borderRadius: 999,
            background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(214,243,255,0.65))",
            color: G.charcoal, fontFamily: G.font, fontSize: 11, fontWeight: 800, letterSpacing: "0.32em", textTransform: "uppercase",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.92), 0 0 14px rgba(82,231,255,0.32)",
            cursor: "pointer", marginTop: "auto",
          }}>CALIBRAR GUTO</button>
        </div>
      </Capsule>
    </div>
  );
}

/* ============ 04 · CHAT ============ */
function ChatScreen() {
  const [tab, setTab] = useState("guto");
  const [voiceOn, setVoiceOn] = useState(true);
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <Header title="GUTO & WILLLLL" kicker="Chat principal"/>

        {/* Volume / voice toggle — fica abaixo do header, lado direito */}
        <button
          onClick={() => setVoiceOn(v => !v)}
          title={voiceOn ? "Desligar voz do Guto" : "Ligar voz do Guto"}
          style={{
            position: "absolute", top: 130, right: 22, zIndex: 7,
            width: 44, height: 44, borderRadius: "50%", cursor: "pointer",
            border: `1px solid ${voiceOn ? G.cyan : "rgba(90,124,168,0.45)"}`,
            background: voiceOn ? "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(214,243,255,0.78))" : "rgba(255,255,255,0.78)",
            color: voiceOn ? G.charcoal : G.soft,
            display: "grid", placeItems: "center",
            boxShadow: voiceOn
              ? "inset 0 1px 0 rgba(255,255,255,0.95), 0 0 14px rgba(82,231,255,0.55)"
              : "inset 0 1px 0 rgba(255,255,255,0.85), 0 4px 10px rgba(90,124,168,0.18)",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          }}
        >
          {voiceOn ? <IcVolOn size={18} stroke={2}/> : <IcVolOff size={18} stroke={2}/>}
          {voiceOn && <span style={{ position: "absolute", inset: -2, borderRadius: "50%", border: "1px solid rgba(82,231,255,0.45)", animation: "none" }}/>}
          <span style={{
            position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)",
            fontFamily: G.font, fontSize: 7.5, fontWeight: 800, letterSpacing: "0.22em",
            color: voiceOn ? G.cyan : G.soft, textShadow: voiceOn ? "0 0 6px rgba(82,231,255,0.55)" : "none",
            textTransform: "uppercase", whiteSpace: "nowrap",
          }}>{voiceOn ? "VOZ ON" : "VOZ OFF"}</span>
        </button>

        {/* HUD circle with GUTO big in the center */}
        <div style={{ position: "absolute", top: 130, bottom: 230, left: 0, right: 0, display: "grid", placeItems: "center" }}>
          <div style={{ position: "relative", width: 320, height: 320, display: "grid", placeItems: "center" }}>
            {/* outer halo rings */}
            {[0,1,2,3].map((i) => (
              <div key={i} style={{
                position: "absolute", width: 240 + i * 28, height: 240 + i * 28, borderRadius: "50%",
                border: "1px solid rgba(82,231,255,0.30)",
                boxShadow: "0 0 14px rgba(82,231,255,0.25)",
                opacity: 0.65 - i * 0.13,
              }}/>
            ))}
            {/* tick dial */}
            <svg viewBox="0 0 320 320" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              {Array.from({ length: 60 }).map((_, i) => {
                const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
                const r1 = 152, r2 = i % 5 === 0 ? 142 : 148;
                return <line key={i} x1={160 + Math.cos(a) * r1} y1={160 + Math.sin(a) * r1} x2={160 + Math.cos(a) * r2} y2={160 + Math.sin(a) * r2} stroke="rgba(82,231,255,0.45)" strokeWidth={i % 5 === 0 ? 1.4 : 0.7}/>;
              })}
            </svg>
            {/* core glow */}
            <div style={{ position: "absolute", width: 230, height: 230, borderRadius: "50%", background: "radial-gradient(circle, rgba(82,231,255,0.42), transparent 65%)", filter: "blur(14px)" }}/>
            {/* GUTO mascot — BIG — INTERATIVO (tap troca de roupa) */}
            <InteractiveMascot size={300} srcA={A.baby} srcB={A.babySuper}/>
            {/* base platform shadow */}
            <div style={{ position: "absolute", bottom: -8, width: 180, height: 18, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(82,231,255,0.55), transparent 70%)", filter: "blur(6px)" }}/>
          </div>
        </div>

        {/* Chat bubble (slightly overlapping GUTO with translucent feel) */}
        <div style={{ position: "absolute", bottom: 156, left: 22, right: 22, zIndex: 6 }}>
          <Plate glow style={{ padding: "14px 18px", background: "linear-gradient(180deg, rgba(255,255,255,0.78), rgba(236,247,255,0.68))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
            <Body style={{ color: G.charcoal, fontWeight: 600, fontSize: 13 }}>Finalmente, WILLLLL. Tava te esperando. Já organizei nosso plano. Estamos juntos — bora começar?</Body>
          </Plate>
        </div>

        {/* Input */}
        <div style={{ position: "absolute", bottom: 96, left: 22, right: 22, zIndex: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.94)", borderRadius: 999, padding: "6px 6px 6px 14px", border: `1px solid ${G.cyan}`, boxShadow: "0 0 14px rgba(82,231,255,0.25)" }}>
            <button style={{ width: 30, height: 30, borderRadius: 999, border: "none", background: "transparent", color: G.cyan, display: "grid", placeItems: "center", cursor: "pointer" }}><IcMic size={16}/></button>
            <input placeholder="Falar com Guto…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: G.font, fontSize: 13, color: G.charcoal, padding: "8px 0", textAlign: "center" }}/>
            <button style={{ width: 36, height: 36, borderRadius: 999, border: "none", background: G.cyan, color: "#fff", display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 0 10px rgba(82,231,255,0.6)" }}><IcSend size={16}/></button>
          </div>
        </div>
        <BottomNav active={tab} onChange={setTab}/>
      </Capsule>
    </div>
  );
}

/* ============ 05 · PERCURSO ============ */
function PercursoScreen() {
  const [tab, setTab] = useState("perc");
  const days = [{ n: "06", l: "alert" }, { n: "07", l: "alert" }, { n: "08", l: "active" }, { n: "09", l: "lock" }, { n: "10", l: "lock" }];
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <Header title="PERCURSO" kicker="Maio de 2026"/>
        <div style={{ position: "absolute", top: 130, bottom: 92, left: 0, right: 0, padding: "0 22px", display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch" }}>
          <Plate style={{ padding: "14px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {days.map((d) => {
                const a = d.l === "active";
                return (
                  <div key={d.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{
                      width: a ? 56 : 44, height: a ? 56 : 44, borderRadius: "50%",
                      background: a ? "linear-gradient(180deg, #ffffff, #e8f5ff)" : "rgba(255,255,255,0.78)",
                      border: a ? `1.5px solid ${G.cyan}` : "1px solid rgba(193,212,232,0.7)",
                      boxShadow: a ? "0 0 18px rgba(82,231,255,0.55)" : "inset 0 1px 0 rgba(255,255,255,0.92)",
                      display: "grid", placeItems: "center",
                      fontFamily: G.font, fontSize: a ? 18 : 13, fontWeight: 800, color: a ? G.charcoal : G.exec,
                      opacity: d.l === "lock" ? 0.55 : 1,
                    }}>{d.n}</div>
                    {d.l === "alert" && <span style={{ color: G.soft, fontSize: 11 }}>!</span>}
                    {d.l === "lock" && <IcLock size={11} stroke={1.5}/>}
                    {a && <span style={{ width: 6, height: 6, background: G.cyan, borderRadius: 99, boxShadow: "0 0 6px rgba(82,231,255,0.7)" }}/>}
                  </div>
                );
              })}
            </div>
          </Plate>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(82,231,255,0.6), transparent)" }}/>
            <Mascot src={A.baby} size={170}/>
            <div style={{ padding: "6px 18px", borderRadius: 999, background: "rgba(255,255,255,0.85)", border: `1px solid ${G.cyan}`, color: G.charcoal, fontFamily: G.font, fontSize: 9, fontWeight: 800, letterSpacing: "0.24em", boxShadow: "0 0 12px rgba(82,231,255,0.45)" }}>DESBLOQUEADO</div>
          </div>
          <Plate>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(193,212,232,0.45)", display: "grid", placeItems: "center", fontFamily: G.font, fontSize: 13, fontWeight: 800, color: G.charcoal }}>08</div>
                <Title size={15} style={{ textAlign: "left" }}>Força total</Title>
              </div>
              <Sub>0 XP</Sub>
            </div>
            <Body style={{ fontSize: 12, textAlign: "left" }}>✓ Treino realizado: Força total</Body>
            <Body style={{ fontSize: 12, textAlign: "left" }}>⚡ 0 XP hoje</Body>
            <Body style={{ fontSize: 12, textAlign: "left" }}>🔥 Sequência ainda zerada</Body>
            <div style={{ marginTop: 8, height: 6, borderRadius: 99, background: "rgba(193,212,232,0.4)", overflow: "hidden" }}>
              <div style={{ width: "16%", height: "100%", background: "linear-gradient(90deg, #7df0ff, #1ec1de)", boxShadow: "0 0 6px rgba(82,231,255,0.7)" }}/>
            </div>
            <Body style={{ fontSize: 11, marginTop: 8, fontStyle: "italic" }}>"Você já é mais forte do que ontem. O melhor ainda está por vir."</Body>
          </Plate>
        </div>
        <BottomNav active={tab} onChange={setTab}/>
      </Capsule>
    </div>
  );
}

/* ============ 06 · EVOLUÇÕES ============ */
function EvolutionsScreen() {
  const [tab, setTab] = useState("evo");
  const levels = [
    { name: "Baby",  state: "ATIVO", desc: "Forma liberada. Nitidez total no presente.", src: A.baby },
    { name: "Teen",  state: "LOCK",  desc: "Bloqueado até 1.500 XP.", src: A.teen },
    { name: "Adult", state: "LOCK",  desc: "Bloqueado até 5.000 XP.", src: A.adult },
    { name: "Elit",  state: "LOCK",  desc: "Bloqueado até 12.000 XP.", src: A.elit },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <Header title="EVOLUÇÕES" kicker="Cada evolução reflete seu esforço"/>
        <div style={{ position: "absolute", top: 138, bottom: 92, left: 0, right: 0, padding: "0 22px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {levels.map((lv) => {
            const a = lv.state === "ATIVO";
            return (
              <Plate key={lv.name} glow={a} style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 80, height: 80, borderRadius: 16, background: a ? "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(214,243,255,0.65))" : "linear-gradient(180deg, rgba(232,240,250,0.85), rgba(214,225,238,0.7))", border: a ? `1px solid ${G.cyan}` : "1px solid rgba(193,212,232,0.7)", display: "grid", placeItems: "center", flexShrink: 0, overflow: "hidden", filter: a ? "none" : "grayscale(0.8) opacity(0.5)" }}>
                    <Mascot src={lv.src} size={70}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Sub style={{ fontSize: 9, color: G.soft, textAlign: "left" }}>NÍVEL</Sub>
                    <Title size={20} style={{ textAlign: "left", fontWeight: 700, letterSpacing: "0", marginTop: 2 }}>{lv.name}</Title>
                    <Body style={{ fontSize: 11, marginTop: 4, textAlign: "left" }}>{lv.desc}</Body>
                  </div>
                  <div>
                    {a ? <Sub>ATIVO</Sub> : <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(193,212,232,0.7)", display: "grid", placeItems: "center", color: G.exec }}><IcLock size={12}/></div>}
                  </div>
                </div>
              </Plate>
            );
          })}
          <Plate>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                <svg viewBox="0 0 80 80" width="80" height="80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(193,212,232,0.5)" strokeWidth="6"/>
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#52e7ff" strokeWidth="6" strokeLinecap="round" strokeDasharray="48 214" transform="rotate(-90 40 40)"/>
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
                  <div><Sub style={{ fontSize: 8, color: G.soft }}>XP</Sub><Title size={18}>100</Title></div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <Body style={{ fontSize: 12, textAlign: "left" }}>A evolução não é automática.</Body>
                <Title size={14} style={{ fontWeight: 700, marginTop: 4, textAlign: "left" }}>É construída todos os dias.</Title>
                <div style={{ height: 6, marginTop: 8, borderRadius: 99, background: "rgba(193,212,232,0.45)", overflow: "hidden" }}>
                  <div style={{ width: "32%", height: "100%", background: "linear-gradient(90deg, #7df0ff, #1ec1de)" }}/>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <Sub style={{ fontSize: 8, color: G.soft }}>PRÓXIMA</Sub>
                  <Sub style={{ fontSize: 8, color: G.soft }}>1.500 XP</Sub>
                </div>
              </div>
            </div>
          </Plate>
        </div>
        <BottomNav active={tab} onChange={setTab}/>
      </Capsule>
    </div>
  );
}

/* ============ 07 · TREINO ============ */
function TreinoScreen() {
  const [tab, setTab] = useState("treino");
  const ex = [
    { name: "CAMINHADA NA ESTEIRA", tag: "AQUECIMENTO", sets: "1", reps: "6 min", rest: "30s", obs: "Aumente a inclinação só se estiver sem dor.", group: "AQUECIMENTO" },
    { name: "SUPINO RETO", tag: "PEITO", sets: "4", reps: "8–10", rest: "75s", obs: "Carga forte, execução limpa.", group: "PARTE PRINCIPAL" },
    { name: "REMADA BAIXA", tag: "COSTAS", sets: "4", reps: "10", rest: "75s", obs: "Tronco firme.", group: "PARTE PRINCIPAL" },
  ];
  let last = "";
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <Header title="FORÇA TOTAL" kicker="Treino · Sexta 08/05"/>
        <div style={{ position: "absolute", top: 130, bottom: 92, left: 0, right: 0, padding: "0 22px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* GUTO ONLINE — live training CTA */}
          <button style={{
            position: "relative", width: "100%", height: 56, borderRadius: 18, cursor: "pointer",
            border: `1.5px solid ${G.cyan}`,
            background: "linear-gradient(135deg, rgba(125,240,255,0.22) 0%, rgba(82,231,255,0.32) 50%, rgba(30,193,222,0.22) 100%)",
            backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), 0 0 24px rgba(82,231,255,0.55), 0 8px 22px rgba(82,231,255,0.30)",
            display: "flex", alignItems: "center", gap: 14, padding: "0 16px",
            overflow: "hidden",
          }}>
            {/* Pulsing dot + live ring */}
            <span style={{ position: "relative", width: 14, height: 14, flexShrink: 0 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: G.cyan, boxShadow: "0 0 12px rgba(82,231,255,1)" }}/>
              <span style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `1.5px solid ${G.cyan}`, opacity: 0.7, animation: "guto-live-pulse 1.8s ease-out infinite" }}/>
            </span>
            <div style={{ flex: 1, textAlign: "left", lineHeight: 1.1 }}>
              <div style={{ fontFamily: G.font, fontSize: 13, fontWeight: 900, color: G.charcoal, letterSpacing: "0.16em" }}>GUTO ONLINE</div>
              <div style={{ marginTop: 4, fontFamily: G.font, fontSize: 9, fontWeight: 700, color: G.cyan, letterSpacing: "0.30em", textTransform: "uppercase", textShadow: "0 0 6px rgba(82,231,255,0.5)" }}>Comece o treino ao vivo</div>
            </div>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(180deg, #7df0ff 0%, #52e7ff 50%, #1ec1de 100%)", display: "grid", placeItems: "center", color: G.charcoal, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), 0 0 14px rgba(82,231,255,0.6)", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20"/></svg>
            </span>
            <style>{`
              @keyframes guto-live-pulse {
                0%   { transform: scale(1);   opacity: 0.7; }
                70%  { transform: scale(2.2); opacity: 0; }
                100% { transform: scale(2.2); opacity: 0; }
              }
            `}</style>
          </button>
          <Plate style={{ padding: "10px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <Sub style={{ fontSize: 9, color: G.soft }}>PROGRESSO</Sub>
              <button style={{ width: 36, height: 36, borderRadius: "50%", background: G.cyan, border: "none", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 0 12px rgba(82,231,255,0.55)" }}><IcPlay size={14}/></button>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: "rgba(193,212,232,0.45)", overflow: "hidden" }}>
              <div style={{ width: "8%", height: "100%", background: "linear-gradient(90deg, #7df0ff, #1ec1de)" }}/>
            </div>
          </Plate>
            const showH = e.group !== last; last = e.group;
            return (
              <Fragment key={i}>
                {showH && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
                    <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(82,231,255,0.55), transparent)" }}/>
                    <Sub style={{ letterSpacing: "0.30em" }}>{e.group}</Sub>
                    <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(82,231,255,0.55), transparent)" }}/>
                  </div>
                )}
                <Plate>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <button style={{ width: 28, height: 28, borderRadius: "50%", border: "1.5px solid rgba(193,212,232,0.7)", background: "rgba(255,255,255,0.85)", color: G.exec, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}><SVG size={14}><circle cx="12" cy="12" r="10"/></SVG></button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Title size={13} style={{ textAlign: "left" }}>{e.name}</Title>
                      <span style={{ display: "inline-block", marginTop: 6, padding: "3px 10px", background: "rgba(193,212,232,0.4)", borderRadius: 99, fontFamily: G.font, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: G.exec }}>{e.tag}</span>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
                        <div style={{ textAlign: "center" }}><Title size={18}>{e.sets}</Title><Sub style={{ fontSize: 8, color: G.soft, marginTop: 2 }}>SÉRIES</Sub></div>
                        <div style={{ textAlign: "center", borderLeft: "1px solid rgba(193,212,232,0.5)", borderRight: "1px solid rgba(193,212,232,0.5)" }}><Title size={18}>{e.reps}</Title><Sub style={{ fontSize: 8, color: G.soft, marginTop: 2 }}>REPS</Sub></div>
                        <div style={{ textAlign: "center" }}><Title size={18}>{e.rest}</Title><Sub style={{ fontSize: 8, color: G.soft, marginTop: 2 }}>DESCANSO</Sub></div>
                      </div>
                      <Body style={{ fontSize: 11, marginTop: 8, textAlign: "left" }}><span style={{ color: G.soft, fontWeight: 600 }}>OBS: </span>{e.obs}</Body>
                    </div>
                  </div>
                </Plate>
              </Fragment>
            );
          })}
          <Cta ghost>Validar treino</Cta>
        </div>
        <BottomNav active={tab} onChange={setTab}/>
      </Capsule>
    </div>
  );
}

/* ============ 08 · DIETA ============ */
function DietaScreen() {
  const [tab, setTab] = useState("dieta");
  const meals = [
    { t: "07:30", n: "CAFÉ DA MANHÃ", k: 404, i: "☕" },
    { t: "10:30", n: "LANCHE DA MANHÃ", k: 211, i: "🍎" },
    { t: "13:00", n: "ALMOÇO", k: 527, i: "🍽" },
    { t: "16:30", n: "LANCHE DA TARDE", k: 193, i: "🥜" },
    { t: "20:00", n: "JANTAR", k: 421, i: "🌙" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <Header title="DIETA DA SEMANA" kicker="08/05 — 14/05/2026"/>
        <div style={{ position: "absolute", top: 138, bottom: 92, left: 0, right: 0, padding: "0 22px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          <Plate>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ color: G.cyan, fontSize: 18 }}>🔥</span>
                <Title size={28}>1756</Title>
                <Sub style={{ fontSize: 9, color: G.soft }}>kcal/dia</Sub>
              </div>
              <span style={{ padding: "6px 14px", borderRadius: 999, border: `1px solid ${G.cyan}`, background: "rgba(82,231,255,0.12)", color: G.charcoal, fontFamily: G.font, fontSize: 9, fontWeight: 800, letterSpacing: "0.20em" }}>EMAGRECER</span>
            </div>
            <div style={{ height: 1, background: "rgba(193,212,232,0.5)", margin: "12px 0" }}/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 14, color: G.cyan }}>⚡</div><Title size={18}>152g</Title><Sub style={{ fontSize: 8, color: G.soft, marginTop: 2 }}>PROTEÍNA</Sub></div>
              <div style={{ textAlign: "center", borderLeft: "1px solid rgba(193,212,232,0.5)", borderRight: "1px solid rgba(193,212,232,0.5)" }}><div style={{ fontSize: 14, color: G.cyan }}>🌾</div><Title size={18}>143g</Title><Sub style={{ fontSize: 8, color: G.soft, marginTop: 2 }}>CARBO</Sub></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 14, color: G.cyan }}>💧</div><Title size={18}>64g</Title><Sub style={{ fontSize: 8, color: G.soft, marginTop: 2 }}>GORDURA</Sub></div>
            </div>
          </Plate>
          {meals.map((m) => (
            <Plate key={m.t} style={{ padding: "10px 14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "32px 56px 1fr auto auto", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 22, textAlign: "center" }}>{m.i}</span>
                <Sub style={{ fontSize: 11 }}>{m.t}</Sub>
                <Title size={12} style={{ textAlign: "left" }}>{m.n}</Title>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}><Title size={14}>{m.k}</Title><Sub style={{ fontSize: 9, color: G.soft }}>kcal</Sub></div>
                <span style={{ color: G.cyan }}>▾</span>
              </div>
            </Plate>
          ))}
          <Cta ghost>↻ Regenerar dieta</Cta>
        </div>
        <BottomNav active={tab} onChange={setTab}/>
      </Capsule>
    </div>
  );
}

/* ============ 09 · ARENA ============ */
function ArenaScreen() {
  const [tab, setTab] = useState("arena");
  const [seg, setSeg] = useState("SEMANA");
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <Header title="ARENA" kicker="Aqui o GUTO não evolui escondido."/>
        <div style={{ position: "absolute", top: 134, bottom: 92, left: 0, right: 0, padding: "0 22px", display: "flex", flexDirection: "column", gap: 12 }}>
          <Plate style={{ padding: 4, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            {["SEMANA","MÊS","INDIVIDUAL"].map((s) => (
              <button key={s} onClick={() => setSeg(s)} style={{
                height: 38, borderRadius: 999, border: "none", cursor: "pointer",
                background: seg === s ? "linear-gradient(180deg, #7df0ff, #1ec1de)" : "transparent",
                color: seg === s ? G.charcoal : G.exec,
                fontFamily: G.font, fontSize: 10, fontWeight: 800, letterSpacing: "0.20em",
                boxShadow: seg === s ? "0 0 12px rgba(82,231,255,0.4)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{s}</button>
            ))}
          </Plate>
          <div style={{ textAlign: "center" }}>
            <Body style={{ fontSize: 12, color: G.charcoal, fontWeight: 600 }}>TODO MUNDO TEM CHANCE DE VIRAR O JOGO.</Body>
            <Body style={{ fontSize: 11, marginTop: 2 }}>Reinicia segunda-feira</Body>
          </div>
          <Plate glow>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(180deg, #ffe89c, #f4c447)", display: "grid", placeItems: "center", boxShadow: "0 4px 10px rgba(244,196,71,0.45)", fontSize: 22 }}>🏆</div>
              <div style={{ flex: 1 }}>
                <Title size={18} style={{ fontWeight: 900, textAlign: "left" }}>WILLLLL</Title>
                <Sub style={{ fontSize: 9, color: G.soft, textAlign: "left" }}>DUPLA COM GUTO</Sub>
              </div>
              <div style={{ textAlign: "right" }}>
                <Title size={20} style={{ color: G.cyan, textShadow: "0 0 6px rgba(82,231,255,0.4)" }}>0</Title>
                <Sub>XP</Sub>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid rgba(193,212,232,0.4)" }}>
              <Sub style={{ fontSize: 9, color: G.soft }}>BABY</Sub>
              <Sub style={{ fontSize: 9, color: G.soft }}>0 TREINOS VALIDADOS</Sub>
            </div>
            <Body style={{ fontSize: 11, color: G.cyan, fontWeight: 700, marginTop: 4 }}>↗ PRECISA REAGIR</Body>
          </Plate>
          <Plate style={{ background: "rgba(255,255,255,0.45)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: 0.6 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(193,212,232,0.5)" }}/>
              <div style={{ flex: 1 }}>
                <Body style={{ fontSize: 13, fontWeight: 700, color: G.exec, textAlign: "left" }}>Aguardando concorrentes…</Body>
                <Body style={{ fontSize: 11, textAlign: "left" }}>Convide outra dupla pra arena.</Body>
              </div>
            </div>
          </Plate>
          <Cta ghost>+ Convidar dupla</Cta>
        </div>
        <BottomNav active={tab} onChange={setTab}/>
      </Capsule>
    </div>
  );
}

Object.assign(window, { AuthScreen, TermsScreen, CalibrationScreen, ChatScreen, PercursoScreen, EvolutionsScreen, TreinoScreen, DietaScreen, ArenaScreen });
