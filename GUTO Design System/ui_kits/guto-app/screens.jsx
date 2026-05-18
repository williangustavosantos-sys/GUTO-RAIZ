// GUTO UI Kit · Cyber-Luxury Glassmorphism v3.
// Pure arctic light mode. Executive charcoal headings. Geometric Inter body.
// Soft-blue ALL-CAPS subtitles. Cyan = single accent. Cristalline glass plates.
const { useState } = React;

// ---- design tokens (Cyber-Luxury) ----
const C = {
  charcoal: "#2D3748",
  executive: "#4A5568",
  softBlue: "#5A7CA8",
  arctic: "#F5F8FC",
  cyan: "#52e7ff",
  fontSans: '"Inter", "Montserrat", system-ui, sans-serif',
  fontMono: '"JetBrains Mono", monospace',
};

const TABS_5 = [
  { id: "guto", label: "GUTO", I: IconMessage },
  { id: "caminho", label: "CAMINHO", I: IconMapPin },
  { id: "evolucoes", label: "EVOLUÇÕES", I: IconTrending },
  { id: "missao", label: "MISSÃO", I: IconDumbbell },
  { id: "arena", label: "ARENA", I: IconSwords },
];

// Reusable "crystal" plate — glossy glass with chrome edge + arctic inner glow
const Crystal = ({ children, style }) => (
  <div style={{
    background: "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(245,250,255,0.62) 100%)",
    border: "1px solid rgba(255,255,255,0.94)",
    borderRadius: 18,
    padding: "14px 16px",
    backdropFilter: "blur(18px) saturate(1.2)",
    WebkitBackdropFilter: "blur(18px) saturate(1.2)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.96)," +
      "inset 0 -1px 0 rgba(193,212,232,0.45)," +
      "0 1px 2px rgba(90,124,168,0.10)," +
      "0 16px 32px rgba(90,124,168,0.10)," +
      "0 0 18px rgba(82,231,255,0.10) inset",
    ...style,
  }}>{children}</div>
);

// Title — executive charcoal, geometric sans, bold
const Title = ({ children, size = 22, style }) => (
  <h2 style={{
    margin: 0,
    fontFamily: C.fontSans,
    fontSize: size,
    fontWeight: 700,
    lineHeight: 1.18,
    letterSpacing: "-0.01em",
    color: C.charcoal,
    ...style,
  }}>{children}</h2>
);

// Subtitle — soft blue, ALL CAPS, medium, generous tracking
const Sub = ({ children, style }) => (
  <div style={{
    fontFamily: C.fontSans,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: C.softBlue,
    ...style,
  }}>{children}</div>
);

// Body — executive grey, geometric sans, generous line-height
const Body = ({ children, style }) => (
  <p style={{
    margin: 0,
    fontFamily: C.fontSans,
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.6,
    color: C.executive,
    ...style,
  }}>{children}</p>
);

// Glossy chrome header rail
const ChromeHeader = ({ children }) => (
  <div style={{
    position: "absolute", top: 44, left: 0, right: 0,
    padding: "16px 16px 14px",
    textAlign: "center",
    background: "linear-gradient(180deg, rgba(255,255,255,0.74) 0%, rgba(255,255,255,0) 100%)",
    borderBottom: "1px solid rgba(82,231,255,0.22)",
    zIndex: 5,
  }}>
    <div style={{
      fontFamily: C.fontSans,
      fontSize: 17, fontWeight: 800,
      letterSpacing: "0.04em",
      background: "linear-gradient(180deg, #ffffff 0%, #cfd9e6 50%, #6b7c95 100%)",
      WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
      filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.85)) drop-shadow(0 0 10px rgba(82,231,255,0.35))",
    }}>{children}</div>
  </div>
);

// Glossy executive CTA
const CtaLux = ({ children, disabled, onClick, style }) => (
  <button onClick={onClick} disabled={disabled} style={{
    height: 54, width: "100%",
    border: "none", borderRadius: 999,
    background: "linear-gradient(180deg, #7df0ff 0%, #52e7ff 50%, #1ec1de 100%)",
    color: C.charcoal,
    fontFamily: C.fontSans, fontSize: 12, fontWeight: 800,
    letterSpacing: "0.20em", textTransform: "uppercase",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(13,35,65,0.10), 0 6px 18px rgba(82,231,255,0.34), 0 14px 28px rgba(82,231,255,0.18)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    ...style,
  }}>{children}</button>
);

// Pure arctic backdrop with crystalline pillars + sparkle
const Capsule = ({ children }) => (
  <div style={{
    position: "absolute", inset: 0,
    background: "linear-gradient(180deg, #FFFFFF 0%, #F5F8FC 50%, #EBF1F8 100%)",
    overflow: "hidden",
  }}>
    <div style={{ position: "absolute", left: 18, top: 80, bottom: 80, width: 1.5, background: "linear-gradient(180deg, transparent, rgba(82,231,255,0.7), transparent)", filter: "drop-shadow(0 0 8px rgba(82,231,255,0.7))", borderRadius: 99 }}/>
    <div style={{ position: "absolute", right: 18, top: 80, bottom: 80, width: 1.5, background: "linear-gradient(180deg, transparent, rgba(82,231,255,0.7), transparent)", filter: "drop-shadow(0 0 8px rgba(82,231,255,0.7))", borderRadius: 99 }}/>
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: `
        radial-gradient(1px 1px at 14% 22%, rgba(90,124,168,0.42), transparent 60%),
        radial-gradient(1px 1px at 28% 64%, rgba(82,231,255,0.6), transparent 60%),
        radial-gradient(1px 1px at 42% 18%, rgba(90,124,168,0.32), transparent 60%),
        radial-gradient(1px 1px at 58% 78%, rgba(82,231,255,0.5), transparent 60%),
        radial-gradient(1.4px 1.4px at 84% 62%, rgba(82,231,255,0.52), transparent 60%),
        radial-gradient(1px 1px at 22% 86%, rgba(90,124,168,0.30), transparent 60%),
        radial-gradient(1.2px 1.2px at 64% 14%, rgba(82,231,255,0.42), transparent 60%),
        radial-gradient(1.4px 1.4px at 12% 50%, rgba(82,231,255,0.4), transparent 60%)`,
    }}/>
    {children}
  </div>
);

const ChromeNav = ({ active, onChange, tabs }) => (
  <div style={{
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: "10px 14px 18px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(228,237,247,0.78) 100%)",
    backdropFilter: "blur(16px) saturate(1.3)",
    borderTop: "1px solid rgba(255,255,255,0.94)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), 0 -8px 22px rgba(90,124,168,0.10)",
  }}>
    <nav style={{ display: "grid", gridTemplateColumns: `repeat(${tabs.length}, 1fr)`, gap: 4 }}>
      {tabs.map(({ id, label, I }) => {
        const a = active === id;
        return (
          <button key={id} onClick={() => onChange(id)} aria-label={label}
            style={{ border: "none", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 0", cursor: "pointer" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              display: "grid", placeItems: "center",
              background: a
                ? "radial-gradient(circle at 35% 30%, #d6f7ff 0%, #52e7ff 50%, #1ec1de 100%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(220,232,244,0.78) 100%)",
              boxShadow: a
                ? "0 0 14px rgba(82,231,255,0.7), 0 0 28px rgba(82,231,255,0.4), inset 0 -3px 6px rgba(13,35,65,0.18), inset 0 3px 6px rgba(255,255,255,0.7)"
                : "inset 1px 2px 4px rgba(152,163,179,0.30), inset -2px -3px 6px rgba(255,255,255,0.95), 0 1px 2px rgba(122,138,156,0.16)",
              color: a ? "#fff" : C.executive,
            }}>
              <I size={18} stroke={a ? 2.4 : 2} />
            </div>
            <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: a ? C.cyan : C.softBlue, textShadow: a ? "0 0 6px rgba(82,231,255,0.5)" : "none" }}>{label}</div>
          </button>
        );
      })}
    </nav>
  </div>
);

const FieldLux = ({ label, value, onChange, placeholder, type = "text" }) => (
  <Crystal style={{ padding: "12px 16px" }}>
    <Sub>{label}</Sub>
    <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
      style={{ marginTop: 4, width: "100%", border: "none", outline: "none", background: "transparent",
               fontFamily: C.fontSans, fontSize: 14, fontWeight: 600, color: C.charcoal }}/>
  </Crystal>
);

const ChipLux = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    height: 34, padding: "0 16px", borderRadius: 999, cursor: "pointer",
    background: active ? "linear-gradient(180deg, rgba(82,231,255,0.32) 0%, rgba(82,231,255,0.18) 100%)" : "rgba(255,255,255,0.62)",
    border: active ? "1px solid rgba(82,231,255,0.7)" : "1px solid rgba(193,212,232,0.7)",
    color: active ? C.charcoal : C.executive,
    fontFamily: C.fontSans, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
    boxShadow: active ? "0 0 12px rgba(82,231,255,0.32), inset 0 1px 0 rgba(255,255,255,0.85)" : "inset 0 1px 0 rgba(255,255,255,0.85), 0 1px 2px rgba(90,124,168,0.08)",
    backdropFilter: "blur(10px)",
  }}>{children}</button>
);

/* ====== SCREENS ====== */

function LoginScreen() {
  const [u, setU] = useState(""); const [p, setP] = useState("");
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <ChromeHeader>GUTO &amp; Willian</ChromeHeader>
        <div style={{ position: "absolute", top: 110, left: 0, right: 0, bottom: 0, padding: "32px 28px 28px", display: "flex", flexDirection: "column", gap: 22 }}>
          <Sub style={{ textAlign: "center" }}>Clube · Acesso Restrito</Sub>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <FieldLux label="Usuário ou E-mail" placeholder="identidade" value={u} onChange={setU} />
            <FieldLux label="Senha" type="password" placeholder="••••••••" value={p} onChange={setP} />
          </div>
          <CtaLux>Entrar</CtaLux>
          <Body style={{ textAlign: "center", fontSize: 12 }}>Esqueci minha senha · <span style={{ color: C.charcoal, fontWeight: 600 }}>Solicitar convite</span></Body>
        </div>
      </Capsule>
    </div>
  );
}

function LanguageScreen() {
  const [pick, setPick] = useState("pt-BR");
  const langs = [
    { id: "pt-BR", name: "Português", sub: "Brasil", file: "idioma-portugues.svg" },
    { id: "en-US", name: "English", sub: "U.S.", file: "idioma-english.svg" },
    { id: "it-IT", name: "Italiano", sub: "Italia", file: "idioma-italiano.svg" },
    { id: "es-ES", name: "Español", sub: "España", file: "idioma-espanol.svg" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <ChromeHeader>Idioma</ChromeHeader>
        <div style={{ position: "absolute", top: 110, left: 0, right: 0, bottom: 0, padding: "20px 22px 28px", display: "flex", flexDirection: "column" }}>
          <Body style={{ textAlign: "center", marginBottom: 18 }}>Em qual idioma o GUTO deve falar contigo?</Body>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1, alignContent: "start" }}>
            {langs.map((l) => {
              const a = pick === l.id;
              return (
                <button key={l.id} onClick={() => setPick(l.id)} style={{
                  padding: 18, borderRadius: 20, cursor: "pointer",
                  background: a ? "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(214,247,255,0.6) 100%)" : "rgba(255,255,255,0.62)",
                  border: a ? "1.5px solid rgba(82,231,255,0.7)" : "1px solid rgba(193,212,232,0.7)",
                  boxShadow: a ? "0 0 22px rgba(82,231,255,0.36), inset 0 1px 0 rgba(255,255,255,0.95)" : "inset 0 1px 0 rgba(255,255,255,0.92), 0 8px 18px rgba(90,124,168,0.10)",
                  backdropFilter: "blur(18px)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                }}>
                  <img src={"../../assets/" + l.file} alt={l.name} style={{ width: 52, height: 52 }} />
                  <Title size={14}>{l.name}</Title>
                  <Sub>{l.sub}</Sub>
                </button>
              );
            })}
          </div>
          <CtaLux>Continuar</CtaLux>
        </div>
      </Capsule>
    </div>
  );
}

function CalibrationScreen() {
  const goals = ["Perder gordura", "Ganhar massa", "Mais força", "Mobilidade", "Performance", "Saúde"];
  const [picked, setPicked] = useState(new Set(["Perder gordura", "Mais força"]));
  const toggle = (g) => { const n = new Set(picked); n.has(g) ? n.delete(g) : n.add(g); setPicked(n); };
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <ChromeHeader>Calibragem</ChromeHeader>
        <div style={{ position: "absolute", top: 110, left: 0, right: 0, bottom: 0, padding: "20px 22px 28px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
            {[0,1,2,3,4,5].map((i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= 1 ? C.cyan : "rgba(90,124,168,0.16)", boxShadow: i <= 1 ? "0 0 8px rgba(82,231,255,0.5)" : "none" }}/>
            ))}
          </div>
          <Sub style={{ marginBottom: 6 }}>Etapa 02 de 06</Sub>
          <Title>Qual é o teu foco?</Title>
          <Body style={{ marginTop: 8, marginBottom: 18 }}>Escolhe até dois. Eu desenho o caminho a partir disso — sem firulas.</Body>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
            {goals.map((g) => <ChipLux key={g} active={picked.has(g)} onClick={() => toggle(g)}>{g}</ChipLux>)}
          </div>
          <div style={{ marginTop: "auto", marginBottom: 14 }}>
            <Crystal>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: "radial-gradient(circle at 35% 30%, #aaf3ff, #52e7ff 60%, #1ec1de)", boxShadow: "0 0 12px rgba(82,231,255,0.5)", flexShrink: 0 }}/>
                <div>
                  <Sub style={{ color: C.cyan, textShadow: "0 0 6px rgba(82,231,255,0.5)", marginBottom: 4 }}>GUTO</Sub>
                  <Body>Antes de eu te puxar, preciso entender o teu corpo. Sem desculpas — só dado.</Body>
                </div>
              </div>
            </Crystal>
          </div>
          <CtaLux disabled={picked.size === 0}>Próximo</CtaLux>
        </div>
      </Capsule>
    </div>
  );
}

function ChatScreen() {
  const [active, setActive] = useState("guto");
  const [msg, setMsg] = useState("");
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <ChromeHeader>GUTO &amp; Willian</ChromeHeader>
        <div style={{ position: "absolute", top: 116, left: 0, right: 0, bottom: 100, display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 22px 0" }}>
          <Crystal style={{ maxWidth: 250, padding: "12px 18px", textAlign: "center" }}>
            <Body style={{ color: C.charcoal, fontWeight: 500 }}>Estamos prontos. Sem distrações.</Body>
          </Crystal>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", marginTop: 12, position: "relative" }}>
            <div style={{ position: "absolute", bottom: 32, width: 220, height: 220, background: "radial-gradient(circle, rgba(82,231,255,0.22) 0%, transparent 70%)" }}/>
            <div><Mascot size={180} /><Pedestal /></div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 92, left: 16, right: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.94)", borderRadius: 999, padding: "8px 8px 8px 18px", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 14px rgba(90,124,168,0.12), 0 0 14px rgba(82,231,255,0.16)", border: "1px solid rgba(255,255,255,0.94)" }}>
            <button style={{ width: 32, height: 32, borderRadius: 999, border: "none", background: "rgba(90,124,168,0.10)", color: C.executive, display: "grid", placeItems: "center", cursor: "pointer" }}><IconMic size={14}/></button>
            <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Falar com Guto…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: C.fontSans, fontSize: 13, color: C.charcoal, padding: "8px 0" }}/>
            <button style={{ width: 36, height: 36, borderRadius: 999, border: "none", background: "linear-gradient(180deg, #7df0ff, #1ec1de)", color: "#fff", boxShadow: "0 0 14px rgba(82,231,255,0.5)", display: "grid", placeItems: "center", cursor: "pointer" }}><IconSend size={14}/></button>
          </div>
        </div>
        <ChromeNav active={active} onChange={setActive} tabs={TABS_5} />
      </Capsule>
    </div>
  );
}

function EvolutionsScreen() {
  const [active, setActive] = useState("evolucoes");
  const stages = ["BABY", "TEEN", "PRO", "ELITE"];
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <ChromeHeader>Evoluções do GUTO</ChromeHeader>
        <div style={{ position: "absolute", top: 110, left: 0, right: 0, bottom: 100, padding: "12px 22px 0", display: "flex", flexDirection: "column", gap: 12 }}>
          <Crystal style={{ alignSelf: "center", padding: "10px 16px" }}>
            <Body style={{ fontSize: 12, color: C.charcoal }}>Cada evolução reflete o seu esforço.</Body>
          </Crystal>
          <Crystal style={{ alignSelf: "center", padding: "8px 18px" }}>
            <Sub style={{ color: C.charcoal }}>Abril 2024 ▸</Sub>
          </Crystal>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, alignItems: "end" }}>
            {stages.map((name, i) => {
              const current = i === 0;
              return (
                <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ height: 90 + i * 8, width: "100%", display: "grid", placeItems: "end center", opacity: current ? 1 : 0.42, filter: current ? "none" : "grayscale(0.6)" }}>
                    {current ? <Mascot size={70}/> : <div style={{ width: 38 + i * 4, height: 70 + i * 8, borderRadius: "40% 40% 30% 30%", background: "linear-gradient(180deg, rgba(74,85,104,0.55), rgba(45,55,72,0.7))", boxShadow: "0 0 14px rgba(82,231,255,0.18)" }}/>}
                  </div>
                  <div style={{
                    width: "100%", padding: "6px 4px", borderRadius: 12,
                    background: current ? "linear-gradient(180deg, #7df0ff, #1ec1de)" : "rgba(255,255,255,0.7)",
                    border: current ? "none" : "1px solid rgba(193,212,232,0.7)",
                    color: current ? C.charcoal : C.executive,
                    fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textAlign: "center",
                    boxShadow: current ? "0 0 12px rgba(82,231,255,0.5)" : "inset 0 1px 0 rgba(255,255,255,0.92)",
                  }}>{current ? name : "🔒"}</div>
                </div>
              );
            })}
          </div>
          <Crystal>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.78)", border: "1px solid rgba(82,231,255,0.55)", boxShadow: "0 0 14px rgba(82,231,255,0.32), inset 0 1px 0 rgba(255,255,255,0.95)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Sub style={{ fontSize: 7, color: C.softBlue }}>XP TOTAL</Sub>
                <Title size={15} style={{ marginTop: 2 }}>1.250</Title>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <Sub>Próxima · <span style={{ color: C.cyan, textShadow: "0 0 6px rgba(82,231,255,0.5)" }}>TEEN</span></Sub>
                  <Title size={13}>58%</Title>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: "rgba(90,124,168,0.14)", overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(45,55,72,0.10)" }}>
                  <div style={{ height: "100%", width: "58%", background: "linear-gradient(90deg, #7df0ff, #1ec1de)", boxShadow: "0 0 8px rgba(82,231,255,0.7)" }}/>
                </div>
                <Body style={{ fontSize: 11, marginTop: 6 }}>Você já é mais forte do que ontem.</Body>
              </div>
            </div>
          </Crystal>
        </div>
        <ChromeNav active={active} onChange={setActive} tabs={TABS_5} />
      </Capsule>
    </div>
  );
}

function CaminhoScreen() {
  const [active, setActive] = useState("caminho");
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 44 }}>
      <Capsule>
        <ChromeHeader>Caminho do GUTO</ChromeHeader>
        <div style={{ position: "absolute", top: 110, left: 0, right: 0, bottom: 100, padding: "12px 22px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          <Crystal style={{ alignSelf: "center", padding: "10px 16px" }}>
            <Body style={{ fontSize: 12, color: C.charcoal }}>Cada evolução reflete o seu esforço.</Body>
          </Crystal>
          <Crystal style={{ alignSelf: "center", padding: "8px 16px" }}>
            <Sub style={{ color: C.charcoal }}>Abril 2024 ▸</Sub>
          </Crystal>
          <div style={{ position: "relative", flex: 1, minHeight: 170 }}>
            {[
              { n: 21, x: 4, y: 50 }, { n: 22, x: 22, y: 12 },
              { n: 23, x: 6, y: 92, done: true }, { n: 24, x: 78, y: 14, lock: true },
              { n: 25, x: 88, y: 50 },
            ].map((b, i) => (
              <div key={i} style={{
                position: "absolute", left: b.x + "%", top: b.y + "%",
                width: 42, height: 42, borderRadius: "50%",
                display: "grid", placeItems: "center",
                background: b.done ? "rgba(82,231,255,0.22)" : "rgba(255,255,255,0.78)",
                border: "1px solid rgba(82,231,255,0.55)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), 0 0 12px rgba(82,231,255,0.22)",
                fontFamily: C.fontSans, fontSize: 13, fontWeight: 700, color: C.charcoal,
                backdropFilter: "blur(8px)",
              }}>{b.n}</div>
            ))}
            <div style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)", textAlign: "center" }}>
              <Mascot size={140}/>
              <Pedestal/>
              <div style={{ marginTop: 4, padding: "5px 12px", borderRadius: 999, background: "linear-gradient(180deg, #7df0ff, #1ec1de)", color: C.charcoal, fontFamily: C.fontSans, fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", boxShadow: "0 0 12px rgba(82,231,255,0.5)", display: "inline-block" }}>BABY · DESBLOQUEADO</div>
            </div>
          </div>
          <Crystal>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(180deg, rgba(82,231,255,0.32), rgba(82,231,255,0.16))", border: "1px solid rgba(82,231,255,0.6)", display: "grid", placeItems: "center", fontFamily: C.fontSans, fontSize: 14, fontWeight: 700, color: C.charcoal, flexShrink: 0 }}>23</div>
              <div style={{ flex: 1 }}>
                <Title size={13}>Terça-feira</Title>
                <Body style={{ fontSize: 11, marginTop: 4 }}>✓ Treino: Peito e tríceps · +150 XP · 3 dias na sequência</Body>
              </div>
              <div style={{ alignSelf: "center", fontFamily: C.fontSans, fontSize: 12, fontWeight: 700, color: C.cyan, textShadow: "0 0 6px rgba(82,231,255,0.5)" }}>+150 XP</div>
            </div>
          </Crystal>
        </div>
        <ChromeNav active={active} onChange={setActive} tabs={TABS_5} />
      </Capsule>
    </div>
  );
}

Object.assign(window, { LoginScreen, LanguageScreen, CalibrationScreen, ChatScreen, EvolutionsScreen, CaminhoScreen });
