// GUTO · COMANDO — screens 01-08 (auth, dashboard, alunos)

const useS1 = React.useState;

/* ============================================================================
   01 · LOGIN
   ============================================================================ */
function ScrLogin() {
  return (
    <Phone label="ACESSO RESTRITO" sub="N1">
      <div style={{ position: "absolute", inset: 0, padding: "80px 24px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        {/* portal halo */}
        <div style={{ position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(82,231,255,0.18), transparent 60%)", filter: "blur(20px)", pointerEvents: "none" }}/>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 20, position: "relative" }}>
          <img src="assets/logo.png" alt="GUTO" style={{ width: 130, filter: "drop-shadow(0 0 24px rgba(82,231,255,0.55)) brightness(1.4) contrast(1.1)" }}/>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            <span style={{ width: 24, height: 1, background: C.cyanLine }}/>
            <Kicker color={C.cyan} style={{ letterSpacing: "0.40em" }}>C O M A N D O</Kicker>
            <span style={{ width: 24, height: 1, background: C.cyanLine }}/>
          </div>
          <Body soft style={{ fontSize: 10, color: C.fg3, letterSpacing: "0.30em" }}>P A I N E L · D E · C O N T R O L E</Body>
        </div>

        {/* mode selector */}
        <Plate style={{ width: "100%", padding: 4, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginTop: 8 }}>
          {[
            { id: "admin", label: "ADMIN", I: IShield, on: true },
            { id: "coach", label: "COACH", I: IUser, on: false },
          ].map(t => (
            <div key={t.id} style={{
              height: 40, borderRadius: 10,
              background: t.on ? "linear-gradient(180deg, #7df0ff, #1ec1de)" : "transparent",
              color: t.on ? "#04131e" : C.fg2,
              boxShadow: t.on ? "0 0 16px rgba(82,231,255,0.4)" : "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              font: `900 10px/1 ${C.mono}`, letterSpacing: "0.22em",
            }}>
              <t.I size={12} stroke={2.2}/>{t.label}
            </div>
          ))}
        </Plate>

        <Plate style={{ width: "100%", padding: 18, display: "flex", flexDirection: "column", gap: 14, position: "relative" }} glow>
          <HUDCorners/>
          <Input label="OPERADOR" value="williangustavo@guto.app"/>
          <Input label="CHAVE DE ACESSO" placeholder="••••••••••••" suffix={<IEye size={14} style={{ color: C.fg3 }}/>}/>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
            <Kicker style={{ color: C.fg3 }}>BIOMETRIA</Kicker>
            <div style={{
              width: 32, height: 18, borderRadius: 999, padding: 2,
              background: C.cyanSoft, border: `1px solid ${C.cyanLine}`, display: "flex", alignItems: "center",
            }}>
              <span style={{ width: 14, height: 14, borderRadius: 999, background: C.cyan, marginLeft: "auto", boxShadow: `0 0 8px ${C.cyan}` }}/>
            </div>
          </div>
          <Cta>Acessar comando <IArrow size={14}/></Cta>
        </Plate>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <Dot tone="cyan" size={5}/>
          <Kicker style={{ color: C.fg3, letterSpacing: "0.30em" }}>SESSÃO · TLS · 1.3 · OK</Kicker>
        </div>
        <Body soft style={{ fontSize: 9, color: C.fg4, letterSpacing: "0.20em" }}>NÓ-SP-01 · 192.168.1.1</Body>
      </div>
    </Phone>
  );
}

/* ============================================================================
   02 · 2FA
   ============================================================================ */
function Scr2FA() {
  const code = ["7", "2", "9", "•", "•", "•"];
  return (
    <Phone label="VERIFICAÇÃO" sub="2FA">
      <Header title="Verificação" sub="2 · F A · O T P" back/>
      <div style={{ position: "absolute", inset: 0, padding: "120px 24px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <Kicker color={C.cyan}>SEGUNDO FATOR</Kicker>
          <Title size={22} style={{ marginTop: 8, lineHeight: 1.2 }}>Código de 6 dígitos do<br/>seu autenticador.</Title>
          <Body soft style={{ marginTop: 8, color: C.fg2 }}>O código expira em <span style={{ color: C.cyan }}>00:42</span>. Se não chegar, gere um novo abaixo.</Body>
        </div>

        <Plate style={{ padding: "28px 18px", display: "flex", flexDirection: "column", gap: 18, position: "relative" }} glow>
          <HUDCorners/>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
            {code.map((d, i) => (
              <div key={i} style={{
                height: 56, borderRadius: 10,
                background: i < 3 ? "rgba(82,231,255,0.08)" : "rgba(0,0,0,0.32)",
                border: `1px solid ${i === 3 ? C.cyan : i < 3 ? C.cyanLine : "rgba(82,231,255,0.10)"}`,
                boxShadow: i === 3 ? `0 0 14px ${C.cyanLine}, inset 0 0 12px ${C.cyanGhost}` : "inset 0 2px 6px rgba(0,0,0,0.5)",
                display: "grid", placeItems: "center",
                font: `900 22px/1 ${C.mono}`, color: i < 3 ? C.cyan : C.fg3,
              }}>{d}</div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Kicker style={{ color: C.fg3 }}>DISPOSITIVO</Kicker>
            <Kicker style={{ color: C.fg }}>iPhone 15 · macOS</Kicker>
          </div>
        </Plate>

        {/* keypad */}
        <Plate style={{ padding: 12, marginTop: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {["1","2","3","4","5","6","7","8","9","",0,"⌫"].map((k, i) => (
              <div key={i} style={{
                height: 48, borderRadius: 10,
                background: k === "" ? "transparent" : "rgba(82,231,255,0.04)",
                border: k === "" ? "none" : `1px solid ${C.cyanGhost}`,
                display: "grid", placeItems: "center",
                font: `800 18px/1 ${C.mono}`, color: C.fg,
              }}>{k}</div>
            ))}
          </div>
        </Plate>
      </div>
    </Phone>
  );
}

/* ============================================================================
   03 · DASHBOARD
   ============================================================================ */
function ScrDashboard() {
  const metrics = [
    { k: "ALUNOS · ATIVOS",  v: "1.284", d: "+42",  tone: "ok"   },
    { k: "PAUSADOS",         v: "118",    d: "+8",   tone: "warn" },
    { k: "VENCIDOS",         v: "47",     d: "−3",   tone: "bad"  },
    { k: "COACHES",          v: "23",     d: "+2",   tone: "cyan" },
  ];
  const feed = [
    { t: "00:42", k: "TREINO VALIDADO", w: "Marina C. · Peito · 7º",      tone: "ok"  },
    { t: "00:38", k: "PACTO RENOVADO",  w: "Rafael D. · 90 dias",         tone: "cyan"},
    { t: "00:34", k: "AUSÊNCIA",        w: "Beatriz O. · 3 dias",         tone: "warn"},
    { t: "00:31", k: "PAGAMENTO",       w: "Henrique P. · falhou",        tone: "bad" },
    { t: "00:27", k: "EVOLUÇÃO",        w: "Caio S. · TEEN → ADULT",      tone: "cyan"},
    { t: "00:21", k: "CONVITE",         w: "Coach Lucas · gerou link",    tone: "ok"  },
  ];
  return (
    <Phone label="VISÃO" sub="GERAL">
      <Header title="Painel central" sub="V I S Ã O · 0 9 / 0 5"
        action={<div style={{ display: "flex", alignItems: "center", gap: 6, height: 28, padding: "0 10px", borderRadius: 999, background: C.okSoft, border: `1px solid rgba(74,222,128,0.30)` }}>
          <Dot tone="ok" size={5}/><Kicker style={{ color: C.ok }}>SISTEMA · OK</Kicker>
        </div>}
      />
      <div style={{ position: "absolute", top: 108, bottom: 80, left: 0, right: 0, padding: "16px 18px 24px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* metrics grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {metrics.map(m => (
            <Plate key={m.k} style={{ padding: "12px 14px", position: "relative" }}>
              <Kicker style={{ color: C.fg3 }}>{m.k}</Kicker>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
                <span style={{ font: `900 26px/1 ${C.mono}`, color: m.tone === "bad" ? C.bad : m.tone === "warn" ? C.warn : C.fg, letterSpacing: "-0.02em" }}>{m.v}</span>
                <span style={{ font: `900 10px/1 ${C.mono}`, color: m.d.startsWith("−") ? C.bad : C.ok }}>{m.d}</span>
              </div>
              {/* mini sparkline */}
              <svg viewBox="0 0 80 18" style={{ position: "absolute", right: 10, bottom: 10, width: 60, height: 14, opacity: 0.7 }}>
                <polyline points="0,12 12,8 24,10 36,6 48,9 60,4 72,7 80,3" fill="none"
                  stroke={m.tone === "bad" ? C.bad : m.tone === "warn" ? C.warn : C.cyan}
                  strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </Plate>
          ))}
        </div>

        {/* big chart */}
        <Plate style={{ padding: 14, position: "relative" }} glow>
          <HUDCorners/>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Kicker color={C.cyan}>EXECUÇÃO · 30 DIAS</Kicker>
              <Title size={16} style={{ marginTop: 6 }}>87.4% <span style={{ color: C.fg3, fontSize: 11, fontWeight: 500 }}>frequência média</span></Title>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["7D","30D","90D"].map((p, i) => (
                <Pill key={p} tone={i === 1 ? "cyan" : "neutral"}>{p}</Pill>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 280 70" style={{ width: "100%", height: 70, marginTop: 10, display: "block" }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.cyan} stopOpacity="0.35"/>
                <stop offset="100%" stopColor={C.cyan} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {[14, 28, 42, 56].map(y => <line key={y} x1="0" x2="280" y1={y} y2={y} stroke={C.cyanGhost} strokeDasharray="2 4"/>)}
            <path d="M0,48 L20,40 L40,46 L60,32 L80,38 L100,28 L120,34 L140,22 L160,30 L180,18 L200,26 L220,14 L240,22 L260,16 L280,12 L280,70 L0,70 Z" fill="url(#g1)"/>
            <path d="M0,48 L20,40 L40,46 L60,32 L80,38 L100,28 L120,34 L140,22 L160,30 L180,18 L200,26 L220,14 L240,22 L260,16 L280,12" fill="none" stroke={C.cyan} strokeWidth="1.6" strokeLinecap="round"/>
            <circle cx="280" cy="12" r="3" fill={C.cyan}/>
            <circle cx="280" cy="12" r="6" fill="none" stroke={C.cyan} strokeOpacity="0.5"/>
          </svg>
        </Plate>

        {/* live feed */}
        <Plate style={{ padding: 14, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Kicker color={C.cyan}>FEED · TEMPO REAL</Kicker>
            <Pill><Dot tone="cyan" size={5}/> AO VIVO</Pill>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
            {feed.map((row, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "44px 1fr auto", alignItems: "center", gap: 8,
                padding: "8px 10px", borderRadius: 8,
                background: i === 0 ? "rgba(82,231,255,0.06)" : "transparent",
                borderLeft: `2px solid ${row.tone === "ok" ? C.ok : row.tone === "warn" ? C.warn : row.tone === "bad" ? C.bad : C.cyan}`,
              }}>
                <span style={{ font: `800 10px/1 ${C.mono}`, color: C.fg3 }}>{row.t}</span>
                <div style={{ minWidth: 0 }}>
                  <Kicker style={{ color: row.tone === "ok" ? C.ok : row.tone === "warn" ? C.warn : row.tone === "bad" ? C.bad : C.cyan }}>{row.k}</Kicker>
                  <Body style={{ fontSize: 11, marginTop: 2, color: C.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.w}</Body>
                </div>
                <IChevR size={12} style={{ color: C.fg4 }}/>
              </div>
            ))}
          </div>
        </Plate>
      </div>
      <CockpitNav active="dash"/>
    </Phone>
  );
}

/* ============================================================================
   04 · LISTA DE ALUNOS — tabela densa
   ============================================================================ */
const studentRows = [
  { id:"GT-1284", name:"Marina Caldas",     coach:"L.M.", status:"ok",   xp:"L.4", evo:"ADULT", cycle:"d-12", pay:"OK"  },
  { id:"GT-1283", name:"Rafael Diniz",      coach:"P.S.", status:"ok",   xp:"L.7", evo:"ELITE", cycle:"d-04", pay:"OK"  },
  { id:"GT-1282", name:"Beatriz Oliveira",  coach:"L.M.", status:"warn", xp:"L.2", evo:"TEEN",  cycle:"d-21", pay:"OK"  },
  { id:"GT-1281", name:"Caio Sampaio",      coach:"R.A.", status:"ok",   xp:"L.3", evo:"ADULT", cycle:"d-08", pay:"OK"  },
  { id:"GT-1280", name:"Henrique Paiva",    coach:"P.S.", status:"bad",  xp:"L.1", evo:"BABY",  cycle:"d+02", pay:"FAIL"},
  { id:"GT-1279", name:"Júlia Reis",        coach:"R.A.", status:"ok",   xp:"L.5", evo:"ADULT", cycle:"d-15", pay:"OK"  },
  { id:"GT-1278", name:"Diego Vasconcelos", coach:"L.M.", status:"warn", xp:"L.2", evo:"TEEN",  cycle:"d-28", pay:"OK"  },
  { id:"GT-1277", name:"Larissa Couto",     coach:"P.S.", status:"ok",   xp:"L.6", evo:"ELITE", cycle:"d-02", pay:"OK"  },
  { id:"GT-1276", name:"Tiago Mendes",      coach:"R.A.", status:"ok",   xp:"L.4", evo:"ADULT", cycle:"d-19", pay:"OK"  },
  { id:"GT-1275", name:"Sophia Albuquerque",coach:"L.M.", status:"bad",  xp:"L.0", evo:"BABY",  cycle:"d+05", pay:"FAIL"},
  { id:"GT-1274", name:"Felipe Andrade",    coach:"P.S.", status:"ok",   xp:"L.3", evo:"ADULT", cycle:"d-11", pay:"OK"  },
  { id:"GT-1273", name:"Yasmin Bittencourt",coach:"R.A.", status:"ok",   xp:"L.5", evo:"ELITE", cycle:"d-06", pay:"OK"  },
];

function Row({ r, hover }) {
  const tones = { ok: C.ok, warn: C.warn, bad: C.bad };
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "12px 60px 1fr 32px 36px 38px 38px 36px",
      gap: 6, alignItems: "center",
      padding: "9px 10px",
      borderBottom: `1px solid rgba(82,231,255,0.06)`,
      background: hover ? "rgba(82,231,255,0.06)" : "transparent",
      borderLeft: hover ? `2px solid ${C.cyan}` : "2px solid transparent",
      font: `600 10px/1 ${C.mono}`,
    }}>
      <Dot tone={r.status} size={6}/>
      <span style={{ color: C.fg3, fontSize: 9 }}>{r.id}</span>
      <span style={{ color: C.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
      <span style={{ color: C.fg2, fontSize: 9, textAlign: "center" }}>{r.coach}</span>
      <span style={{ color: C.cyan, fontSize: 9, textAlign: "center" }}>{r.xp}</span>
      <span style={{ color: C.fg2, fontSize: 8, textAlign: "center" }}>{r.evo}</span>
      <span style={{ color: r.cycle.startsWith("d+") ? C.bad : C.fg2, fontSize: 9, textAlign: "right" }}>{r.cycle}</span>
      <span style={{
        textAlign: "center", color: r.pay === "OK" ? C.ok : C.bad, fontSize: 9,
      }}>{r.pay}</span>
    </div>
  );
}

function ScrAlunos({ filterOpen, hoverId }) {
  return (
    <Phone label="ALUNOS" sub={`${studentRows.length}+ na fila`}>
      <Header title="Alunos · 1.449" sub="L I S T A · D E N S A"
        action={<div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "rgba(82,231,255,0.08)", border: `1px solid ${C.cyanLine}`,
          color: C.cyan, display: "grid", placeItems: "center",
        }}><IPlus size={16}/></div>}
      />
      <div style={{ position: "absolute", top: 108, bottom: 80, left: 0, right: 0, display: "flex", flexDirection: "column" }}>
        {/* search + chips */}
        <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{
            height: 40, padding: "0 12px", borderRadius: 10,
            background: "rgba(0,0,0,0.32)", border: "1px solid rgba(82,231,255,0.10)",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.5)",
          }}>
            <ISearch size={14} style={{ color: C.fg3 }}/>
            <span style={{ flex: 1, font: `500 12px/1 ${C.mono}`, color: C.fg3 }}>Nome, ID, CPF, e-mail…</span>
            <Kicker style={{ color: C.fg4 }}>⌘K</Kicker>
          </div>
          <div style={{ display: "flex", gap: 6, overflow: "hidden" }}>
            <Pill tone="cyan">TODOS · 1.449</Pill>
            <Pill tone="ok">ATIVOS · 1.284</Pill>
            <Pill tone="warn">PAUSADOS · 118</Pill>
            <Pill tone="bad">VENC · 47</Pill>
          </div>
        </div>

        {/* filter sheet */}
        {filterOpen && (
          <Plate style={{ margin: "0 18px", padding: 14, display: "flex", flexDirection: "column", gap: 12, position: "relative" }} glow>
            <HUDCorners/>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Kicker color={C.cyan}>FILTROS · AVANÇADOS</Kicker>
              <Kicker style={{ color: C.fg3 }}>3 ATIVOS</Kicker>
            </div>
            <div>
              <Kicker style={{ color: C.fg3 }}>COACH</Kicker>
              <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                {["L.M.", "P.S.", "R.A.", "T.B."].map((c, i) => <Pill key={c} tone={i < 2 ? "cyan" : "neutral"}>{c}</Pill>)}
              </div>
            </div>
            <div>
              <Kicker style={{ color: C.fg3 }}>EVOLUÇÃO</Kicker>
              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                {["BABY","TEEN","ADULT","ELITE"].map((e, i) => <Pill key={e} tone={i === 2 ? "cyan" : "neutral"}>{e}</Pill>)}
              </div>
            </div>
            <div>
              <Kicker style={{ color: C.fg3 }}>FREQUÊNCIA · MÍN.</Kicker>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: "rgba(0,0,0,0.4)", position: "relative" }}>
                  <div style={{ position: "absolute", inset: "0 30% 0 0", background: `linear-gradient(90deg, ${C.cyan}, ${C.cyan})`, borderRadius: 999, boxShadow: `0 0 8px ${C.cyanLine}` }}/>
                  <div style={{ position: "absolute", left: "70%", top: -5, width: 16, height: 16, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 10px ${C.cyan}`, transform: "translateX(-50%)" }}/>
                </div>
                <span style={{ font: `900 12px/1 ${C.mono}`, color: C.cyan }}>70%</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
              <Cta ghost>Limpar</Cta>
              <Cta>Aplicar · 247</Cta>
            </div>
          </Plate>
        )}

        {/* table */}
        <div style={{ flex: 1, minHeight: 0, margin: "10px 14px 0", borderRadius: 12, border: "1px solid rgba(82,231,255,0.10)", background: "rgba(8,12,22,0.6)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* table head */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "12px 60px 1fr 32px 36px 38px 38px 36px",
            gap: 6, alignItems: "center",
            padding: "10px 10px",
            background: "rgba(82,231,255,0.06)",
            borderBottom: `1px solid ${C.cyanGhost}`,
            font: `900 8px/1 ${C.mono}`, letterSpacing: "0.20em", color: C.fg3,
          }}>
            <span/>
            <span>ID</span>
            <span>ALUNO</span>
            <span style={{ textAlign: "center" }}>CCH</span>
            <span style={{ textAlign: "center" }}>XP</span>
            <span style={{ textAlign: "center" }}>EVO</span>
            <span style={{ textAlign: "right" }}>CICLO</span>
            <span style={{ textAlign: "center" }}>PG</span>
          </div>
          {/* rows */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            {studentRows.map(r => <Row key={r.id} r={r} hover={hoverId === r.id}/>)}
          </div>
          {/* footer */}
          <div style={{ padding: "8px 12px", borderTop: `1px solid ${C.cyanGhost}`, display: "flex", justifyContent: "space-between" }}>
            <Kicker style={{ color: C.fg3 }}>1—12 / 1.449</Kicker>
            <Kicker color={C.cyan}>CARREGAR +</Kicker>
          </div>
        </div>
      </div>
      <CockpitNav active="alunos"/>
    </Phone>
  );
}

/* ============================================================================
   05 · DETALHE DO ALUNO
   ============================================================================ */
function ScrAlunoDetalhe() {
  return (
    <Phone label="ALUNO" sub="GT-1284">
      <Header title="Marina Caldas" sub="G T - 1 2 8 4" back
        action={<div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "rgba(232,244,255,0.04)", border: "1px solid rgba(232,244,255,0.10)",
          color: C.fg2, display: "grid", placeItems: "center",
        }}><IDots size={16}/></div>}
      />
      <div style={{ position: "absolute", top: 108, bottom: 80, left: 0, right: 0, padding: "16px 18px 24px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* identity card */}
        <Plate style={{ padding: 16, position: "relative" }} glow>
          <HUDCorners/>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{
              width: 64, height: 64, borderRadius: 14,
              background: `radial-gradient(circle at 35% 28%, #d6f7ff 0%, #52e7ff 38%, #1ec1de 70%, #0d6e85 100%)`,
              boxShadow: `0 0 18px ${C.cyanGhost}, inset 0 -8px 16px rgba(13,35,65,0.4)`,
              border: `1px solid ${C.cyanLine}`,
              flex: "none", position: "relative",
            }}>
              <span style={{ position: "absolute", bottom: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: C.ok, border: "2px solid #050810", boxShadow: `0 0 6px ${C.ok}` }}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Kicker color={C.cyan}>IDENTIDADE</Kicker>
              <Title size={18} style={{ marginTop: 6 }}>Marina Caldas</Title>
              <Body soft style={{ fontSize: 11, marginTop: 4 }}>marina.caldas@email.com</Body>
              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                <Pill tone="ok"><Dot tone="ok" size={4}/> ATIVO</Pill>
                <Pill tone="cyan">PT-BR</Pill>
                <Pill>32 ANOS</Pill>
              </div>
            </div>
          </div>
        </Plate>

        {/* metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { k: "XP TOTAL",     v: "12.840", sub: "L.4 · ADULT", tone: C.cyan },
            { k: "FREQ · 30D",   v: "92%",    sub: "26/28 · OK",  tone: C.ok   },
            { k: "COACH",        v: "L.M.",   sub: "Lucas Moraes",tone: C.fg   },
            { k: "CICLO",        v: "d-12",   sub: "renova 21/05",tone: C.fg2  },
          ].map(m => (
            <Plate key={m.k} style={{ padding: "10px 12px" }}>
              <Kicker style={{ color: C.fg3 }}>{m.k}</Kicker>
              <div style={{ font: `900 20px/1 ${C.mono}`, color: m.tone, marginTop: 8 }}>{m.v}</div>
              <Kicker style={{ color: C.fg3, marginTop: 6 }}>{m.sub}</Kicker>
            </Plate>
          ))}
        </div>

        {/* tabs */}
        <Plate style={{ padding: 4, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
          {["GERAL","TREINO","DIETA","EVO","PAGTO"].map((t, i) => (
            <div key={t} style={{
              height: 32, borderRadius: 8,
              background: i === 0 ? "rgba(82,231,255,0.10)" : "transparent",
              border: i === 0 ? `1px solid ${C.cyanLine}` : "1px solid transparent",
              color: i === 0 ? C.cyan : C.fg3,
              display: "grid", placeItems: "center",
              font: `900 9px/1 ${C.mono}`, letterSpacing: "0.20em",
            }}>{t}</div>
          ))}
        </Plate>

        {/* info rows */}
        <Plate style={{ padding: 0, flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {[
            { k: "DOCUMENTO",     v: "•••.•••.•••-12"        },
            { k: "TELEFONE",      v: "+55 11 9•••• ••32"     },
            { k: "ENTRADA",       v: "11 / 02 / 2026"        },
            { k: "ÚLT. SESSÃO",   v: "ontem · 19:42"         },
            { k: "PACTO",         v: "TRIMESTRAL · R$ 540"   },
            { k: "AVATAR",        v: "PADRÃO · AZUL"         },
          ].map((r, i, arr) => (
            <div key={r.k} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 14px",
              borderBottom: i < arr.length - 1 ? `1px solid ${C.cyanGhost}` : "none",
            }}>
              <Kicker style={{ color: C.fg3 }}>{r.k}</Kicker>
              <span style={{ font: `700 11px/1 ${C.mono}`, color: C.fg, letterSpacing: "0.04em" }}>{r.v}</span>
            </div>
          ))}
        </Plate>
      </div>
      <CockpitNav active="alunos"/>
    </Phone>
  );
}

/* ============================================================================
   06 · TREINOS DO ALUNO
   ============================================================================ */
function ScrAlunoTreinos() {
  const sessions = [
    { d:"08/05", n:"Peito + Tríceps",    s:"OK",  dur:"1h12", v:"+220" },
    { d:"06/05", n:"Costas + Bíceps",    s:"OK",  dur:"1h08", v:"+210" },
    { d:"04/05", n:"Pernas",             s:"OK",  dur:"1h22", v:"+260" },
    { d:"02/05", n:"Ombros + Core",      s:"PARCIAL",dur:"0h41", v:"+90"  },
    { d:"30/04", n:"Peito + Tríceps",    s:"OK",  dur:"1h05", v:"+200" },
    { d:"28/04", n:"Cardio · Esteira",   s:"OK",  dur:"0h35", v:"+80"  },
    { d:"26/04", n:"—",                  s:"FALTA",  dur:"—",  v:"−40" },
    { d:"24/04", n:"Costas + Bíceps",    s:"OK",  dur:"1h14", v:"+220" },
  ];
  return (
    <Phone label="ALUNO" sub="TREINOS">
      <Header title="Treinos · Marina" sub="H I S T Ó R I C O · 4 5 D" back/>
      <div style={{ position: "absolute", top: 108, bottom: 80, left: 0, right: 0, padding: "16px 18px 24px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* heatmap */}
        <Plate style={{ padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Kicker color={C.cyan}>HEATMAP · 7×6</Kicker>
            <Kicker style={{ color: C.fg3 }}>26 / 28 · 92%</Kicker>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginTop: 10 }}>
            {Array.from({ length: 42 }).map((_, i) => {
              const v = [0, 0.2, 0.4, 0.7, 0.9, 1][Math.floor((Math.sin(i * 1.7) + 1) * 3) % 6];
              return <div key={i} style={{
                aspectRatio: "1 / 1", borderRadius: 4,
                background: v === 0 ? "rgba(232,244,255,0.04)" : `rgba(82,231,255,${0.18 + v * 0.6})`,
                boxShadow: v > 0.6 ? `0 0 6px ${C.cyanLine}` : "none",
                border: v === 0 ? "1px solid rgba(232,244,255,0.04)" : "none",
              }}/>;
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <Kicker style={{ color: C.fg4 }}>− FREQ.</Kicker>
            <div style={{ display: "flex", gap: 3 }}>
              {[0.1, 0.3, 0.5, 0.75, 0.95].map(v => (
                <div key={v} style={{ width: 12, height: 8, borderRadius: 2, background: `rgba(82,231,255,${v})` }}/>
              ))}
            </div>
            <Kicker style={{ color: C.fg4 }}>+ FREQ.</Kicker>
          </div>
        </Plate>

        {/* sessions table */}
        <Plate style={{ padding: 0, flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "60px 1fr 70px 50px 50px",
            gap: 6, padding: "10px 12px",
            background: "rgba(82,231,255,0.06)", borderBottom: `1px solid ${C.cyanGhost}`,
            font: `900 8px/1 ${C.mono}`, letterSpacing: "0.20em", color: C.fg3,
          }}>
            <span>DATA</span><span>SESSÃO</span><span>STATUS</span><span style={{ textAlign:"right" }}>DUR</span><span style={{ textAlign:"right" }}>XP</span>
          </div>
          {sessions.map((s, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "60px 1fr 70px 50px 50px",
              gap: 6, padding: "10px 12px", alignItems: "center",
              borderBottom: i < sessions.length - 1 ? `1px solid rgba(82,231,255,0.04)` : "none",
              font: `600 11px/1 ${C.mono}`,
            }}>
              <span style={{ color: C.fg3, fontSize: 10 }}>{s.d}</span>
              <span style={{ color: C.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.n}</span>
              <Pill tone={s.s === "OK" ? "ok" : s.s === "PARCIAL" ? "warn" : "bad"} style={{ height: 18, fontSize: 8, padding: "0 6px" }}>{s.s}</Pill>
              <span style={{ color: C.fg2, textAlign:"right", fontSize: 10 }}>{s.dur}</span>
              <span style={{ color: s.v.startsWith("−") ? C.bad : C.cyan, textAlign:"right", fontSize: 10 }}>{s.v}</span>
            </div>
          ))}
        </Plate>
      </div>
      <CockpitNav active="alunos"/>
    </Phone>
  );
}

/* ============================================================================
   07 · DIETA DO ALUNO
   ============================================================================ */
function ScrAlunoDieta() {
  return (
    <Phone label="ALUNO" sub="DIETA">
      <Header title="Dieta · Marina" sub="0 9 · 0 5 · S E G U N D A" back/>
      <div style={{ position: "absolute", top: 108, bottom: 80, left: 0, right: 0, padding: "16px 18px 24px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* macros */}
        <Plate style={{ padding: 14, position: "relative" }} glow>
          <HUDCorners/>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <Kicker color={C.cyan}>CONSUMO HOJE</Kicker>
              <Title size={26} style={{ marginTop: 6 }}>1 842 <span style={{ fontSize: 12, color: C.fg3, fontWeight: 500 }}>/ 2 200 kcal</span></Title>
            </div>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", position: "relative",
              background: `conic-gradient(${C.cyan} 0 75%, rgba(82,231,255,0.10) 75% 100%)`,
              display: "grid", placeItems: "center",
            }}>
              <div style={{ position: "absolute", inset: 6, borderRadius: "50%", background: "#0b1320", display: "grid", placeItems: "center" }}>
                <span style={{ font: `900 14px/1 ${C.mono}`, color: C.cyan }}>83%</span>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 14 }}>
            {[
              { k:"PROT", v:"148g", t:"180g", c: C.cyan,  pct: 0.82 },
              { k:"CARB", v:"212g", t:"260g", c: "#a5e8ff", pct: 0.81 },
              { k:"GORD", v:"62g",  t:"70g",  c: "#7fd8ee", pct: 0.88 },
            ].map(m => (
              <div key={m.k}>
                <Kicker style={{ color: C.fg3 }}>{m.k}</Kicker>
                <div style={{ font: `900 14px/1 ${C.mono}`, color: m.c, marginTop: 6 }}>{m.v}</div>
                <div style={{ font: `500 9px/1 ${C.mono}`, color: C.fg4, marginTop: 4 }}>de {m.t}</div>
                <div style={{ height: 3, marginTop: 6, borderRadius: 999, background: "rgba(82,231,255,0.10)", overflow: "hidden" }}>
                  <div style={{ width: `${m.pct * 100}%`, height: "100%", background: m.c, boxShadow: `0 0 6px ${m.c}` }}/>
                </div>
              </div>
            ))}
          </div>
        </Plate>

        {/* meals */}
        <Plate style={{ padding: 0, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${C.cyanGhost}` }}>
            <Kicker color={C.cyan}>REGISTROS · 4</Kicker>
            <Kicker style={{ color: C.fg3 }}>ÚLT · 19:48</Kicker>
          </div>
          {[
            { t:"07:30", n:"Café · Ovos + aveia",     k:"420 kcal", ok:true  },
            { t:"12:15", n:"Almoço · Frango + arroz", k:"680 kcal", ok:true  },
            { t:"15:40", n:"Lanche · Whey + banana",  k:"320 kcal", ok:true  },
            { t:"19:48", n:"Jantar · Salmão + batata",k:"422 kcal", ok:true  },
            { t:"—",     n:"Ceia · não registrada",   k:"—",        ok:false },
          ].map((m, i, arr) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "44px 1fr auto",
              alignItems: "center", gap: 10,
              padding: "12px 14px",
              borderBottom: i < arr.length - 1 ? `1px solid rgba(82,231,255,0.04)` : "none",
              opacity: m.ok ? 1 : 0.4,
            }}>
              <span style={{ font: `800 10px/1 ${C.mono}`, color: m.ok ? C.cyan : C.fg4 }}>{m.t}</span>
              <span style={{ font: `600 12px/1.3 ${C.mono}`, color: C.fg }}>{m.n}</span>
              <span style={{ font: `700 10px/1 ${C.mono}`, color: m.ok ? C.fg2 : C.fg4 }}>{m.k}</span>
            </div>
          ))}
        </Plate>
      </div>
      <CockpitNav active="alunos"/>
    </Phone>
  );
}

/* ============================================================================
   08 · EVOLUÇÃO / XP
   ============================================================================ */
function ScrAlunoEvo() {
  return (
    <Phone label="ALUNO" sub="EVO">
      <Header title="Evolução · Marina" sub="L . 4 · A D U L T" back/>
      <div style={{ position: "absolute", top: 108, bottom: 80, left: 0, right: 0, padding: "16px 18px 24px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* avatar + level */}
        <Plate style={{ padding: 18, position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }} glow>
          <HUDCorners/>
          <div style={{ position: "relative", width: 140, height: 140, display: "grid", placeItems: "center" }}>
            <svg viewBox="0 0 140 140" style={{ position: "absolute", inset: 0 }}>
              <circle cx="70" cy="70" r="62" fill="none" stroke={C.cyanGhost} strokeWidth="2"/>
              <circle cx="70" cy="70" r="62" fill="none" stroke={C.cyan} strokeWidth="3" strokeLinecap="round"
                strokeDasharray="389" strokeDashoffset="105" transform="rotate(-90 70 70)"
                style={{ filter: `drop-shadow(0 0 6px ${C.cyan})` }}/>
            </svg>
            <div style={{
              width: 100, height: 100, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 28%, #d6f7ff 0%, #52e7ff 38%, #1ec1de 70%, #0d6e85 100%)`,
              boxShadow: `0 0 30px ${C.cyanLine}, inset 0 -10px 20px rgba(13,35,65,0.45)`,
            }}/>
            <div style={{ position: "absolute", bottom: -4, padding: "2px 10px", borderRadius: 999, background: "#050810", border: `1px solid ${C.cyanLine}`, font: `900 9px/1 ${C.mono}`, color: C.cyan, letterSpacing: "0.30em" }}>L · 4</div>
          </div>
          <Kicker style={{ marginTop: 18, color: C.fg3 }}>FASE ATUAL</Kicker>
          <Title size={20} style={{ marginTop: 6, letterSpacing: "0.06em" }}>ADULT</Title>
          <Body soft style={{ fontSize: 11, marginTop: 8, textAlign: "center", maxWidth: 240 }}>Faltam <span style={{ color: C.cyan }}>2 160 XP</span> para alcançar ELITE.</Body>
        </Plate>

        {/* stages timeline */}
        <Plate style={{ padding: 14 }}>
          <Kicker color={C.cyan}>PERCURSO</Kicker>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: 12, position: "relative" }}>
            <div style={{ position: "absolute", top: 12, left: "12%", right: "12%", height: 2, background: `linear-gradient(90deg, ${C.cyan} 0%, ${C.cyan} 75%, ${C.cyanGhost} 75%, ${C.cyanGhost} 100%)`, borderRadius: 999 }}/>
            {[
              { n:"BABY",  on: true,  d:"L.0—1" },
              { n:"TEEN",  on: true,  d:"L.2—3" },
              { n:"ADULT", on: true,  d:"L.4—5", curr: true },
              { n:"ELITE", on: false, d:"L.6+"  },
            ].map(s => (
              <div key={s.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: s.curr ? C.cyan : s.on ? "rgba(82,231,255,0.20)" : "rgba(0,0,0,0.4)",
                  border: `1px solid ${s.on ? C.cyan : C.fg4}`,
                  boxShadow: s.curr ? `0 0 12px ${C.cyan}` : "none",
                  display: "grid", placeItems: "center",
                  font: `900 9px/1 ${C.mono}`, color: s.curr ? "#04131e" : s.on ? C.cyan : C.fg4,
                }}>{s.on ? "✓" : "·"}</div>
                <Kicker style={{ color: s.on ? C.fg : C.fg4, fontSize: 9 }}>{s.n}</Kicker>
                <Kicker style={{ color: C.fg4, fontSize: 8 }}>{s.d}</Kicker>
              </div>
            ))}
          </div>
        </Plate>

        {/* xp recent */}
        <Plate style={{ padding: 0, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${C.cyanGhost}` }}>
            <Kicker color={C.cyan}>XP · ÚLTIMOS GANHOS</Kicker>
            <Kicker style={{ color: C.fg3 }}>+ 1 060 · 7 D</Kicker>
          </div>
          {[
            { d:"08/05", k:"TREINO COMPLETO",  v:"+220" },
            { d:"06/05", k:"FREQUÊNCIA · 3X",  v:"+150" },
            { d:"04/05", k:"PERNAS · DESAFIO", v:"+260" },
            { d:"02/05", k:"VALIDAÇÃO PARCIAL",v:"+90"  },
            { d:"30/04", k:"TREINO COMPLETO",  v:"+200" },
            { d:"28/04", k:"CARDIO · 35MIN",   v:"+140" },
          ].map((r, i, arr) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "60px 1fr 70px",
              alignItems: "center", padding: "10px 14px",
              borderBottom: i < arr.length - 1 ? `1px solid rgba(82,231,255,0.04)` : "none",
            }}>
              <Kicker style={{ color: C.fg3 }}>{r.d}</Kicker>
              <span style={{ font: `600 11px/1 ${C.mono}`, color: C.fg }}>{r.k}</span>
              <span style={{ font: `900 11px/1 ${C.mono}`, color: C.cyan, textAlign: "right", textShadow: `0 0 6px ${C.cyanLine}` }}>{r.v}</span>
            </div>
          ))}
        </Plate>
      </div>
      <CockpitNav active="alunos"/>
    </Phone>
  );
}

Object.assign(window, { ScrLogin, Scr2FA, ScrDashboard, ScrAlunos, ScrAlunoDetalhe, ScrAlunoTreinos, ScrAlunoDieta, ScrAlunoEvo });
