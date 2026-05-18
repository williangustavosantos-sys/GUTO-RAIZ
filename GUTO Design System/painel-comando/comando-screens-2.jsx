// GUTO · COMANDO — screens 09-13 (operações + sistema) + micro-estados

/* ============================================================================
   09 · CONVITES
   ============================================================================ */
function ScrConvites() {
  const invites = [
    { c:"GT-IN-7F2A", coach:"L.M.", who:"convite enviado",        s:"PENDENTE", t:"2h" },
    { c:"GT-IN-7E91", coach:"P.S.", who:"resgatado · GT-1284",    s:"USADO",    t:"5h" },
    { c:"GT-IN-7D44", coach:"R.A.", who:"link público",           s:"PENDENTE", t:"1d" },
    { c:"GT-IN-7C18", coach:"L.M.", who:"expirou sem uso",        s:"EXPIRADO", t:"3d" },
    { c:"GT-IN-7B02", coach:"P.S.", who:"resgatado · GT-1281",    s:"USADO",    t:"5d" },
  ];
  return (
    <Phone label="OPS" sub="CONVITES">
      <Header title="Convites · 47" sub="L I N K · D E · A C E S S O"
        action={<div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(82,231,255,0.08)", border: `1px solid ${C.cyanLine}`, color: C.cyan, display: "grid", placeItems: "center" }}><IPlus size={16}/></div>}
      />
      <div style={{ position: "absolute", top: 108, bottom: 80, left: 0, right: 0, padding: "16px 18px 24px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* generator */}
        <Plate style={{ padding: 14, position: "relative" }} glow>
          <HUDCorners/>
          <Kicker color={C.cyan}>GERAR · NOVO</Kicker>
          <Title size={16} style={{ marginTop: 6 }}>Link único de acesso</Title>
          <div style={{ marginTop: 12, height: 48, padding: "0 14px", borderRadius: 10, background: "rgba(0,0,0,0.42)", border: `1px solid ${C.cyanLine}`, display: "flex", alignItems: "center", gap: 10, font: `700 11px/1 ${C.mono}`, color: C.cyan, letterSpacing: "0.04em", boxShadow: `inset 0 0 8px ${C.cyanGhost}` }}>
            <ILink size={14} stroke={2}/>
            <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>guto.app/convite/IN-7F2A-MARC</span>
            <ICopy size={14} style={{ color: C.fg2 }}/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
            <div>
              <Kicker style={{ color: C.fg3 }}>COACH</Kicker>
              <div style={{ marginTop: 6, padding: "8px 10px", borderRadius: 8, background: "rgba(0,0,0,0.32)", border: "1px solid rgba(82,231,255,0.10)", font: `700 11px/1 ${C.mono}`, color: C.fg, display: "flex", justifyContent: "space-between" }}>
                <span>L.M. · Lucas</span><IChevR size={12} style={{ color: C.fg3 }}/>
              </div>
            </div>
            <div>
              <Kicker style={{ color: C.fg3 }}>VALIDADE</Kicker>
              <div style={{ marginTop: 6, padding: "8px 10px", borderRadius: 8, background: "rgba(0,0,0,0.32)", border: "1px solid rgba(82,231,255,0.10)", font: `700 11px/1 ${C.mono}`, color: C.fg, display: "flex", justifyContent: "space-between" }}>
                <span>7 dias</span><IChevR size={12} style={{ color: C.fg3 }}/>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}><Cta>Gerar convite <IArrow size={14}/></Cta></div>
        </Plate>

        {/* list */}
        <Plate style={{ padding: 0, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${C.cyanGhost}` }}>
            <Kicker color={C.cyan}>HISTÓRICO</Kicker>
            <Kicker style={{ color: C.fg3 }}>{invites.length} ÍTENS</Kicker>
          </div>
          {invites.map((iv, i) => {
            const tone = iv.s === "USADO" ? "ok" : iv.s === "PENDENTE" ? "cyan" : "bad";
            return (
              <div key={iv.c} style={{
                display: "grid", gridTemplateColumns: "1fr auto", padding: "10px 14px",
                gap: 6, alignItems: "center",
                borderBottom: i < invites.length - 1 ? `1px solid rgba(82,231,255,0.04)` : "none",
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Kicker style={{ color: C.cyan }}>{iv.c}</Kicker>
                    <Kicker style={{ color: C.fg4 }}>· {iv.coach}</Kicker>
                  </div>
                  <Body style={{ fontSize: 11, marginTop: 4, color: C.fg2 }}>{iv.who}</Body>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <Pill tone={tone}>{iv.s}</Pill>
                  <Kicker style={{ color: C.fg4 }}>{iv.t}</Kicker>
                </div>
              </div>
            );
          })}
        </Plate>
      </div>
      <CockpitNav active="ops"/>
    </Phone>
  );
}

/* ============================================================================
   10 · COACHES
   ============================================================================ */
function ScrCoaches() {
  const coaches = [
    { i:"L.M.", n:"Lucas Moraes",     s:"ATIVO", a:312, freq:"94%", tone:"ok"   },
    { i:"P.S.", n:"Paulo Sant'Ana",   s:"ATIVO", a:284, freq:"91%", tone:"ok"   },
    { i:"R.A.", n:"Renata Albuquerque",s:"ATIVO", a:241, freq:"88%", tone:"ok"   },
    { i:"T.B.", n:"Thaís Bernardes",  s:"FÉRIAS",a:198, freq:"—",   tone:"warn" },
    { i:"M.G.", n:"Matheus Guedes",   s:"ATIVO", a:177, freq:"86%", tone:"ok"   },
    { i:"D.C.", n:"Daniela Castro",   s:"NOVO",  a:24,  freq:"82%", tone:"cyan" },
  ];
  return (
    <Phone label="OPS" sub="COACHES">
      <Header title="Coaches · 23" sub="E Q U I P E"
        action={<div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(82,231,255,0.08)", border: `1px solid ${C.cyanLine}`, color: C.cyan, display: "grid", placeItems: "center" }}><IPlus size={16}/></div>}
      />
      <div style={{ position: "absolute", top: 108, bottom: 80, left: 0, right: 0, padding: "16px 18px 24px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 12 }}>
        <Plate style={{ padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { k:"ATIVOS",  v:"19", c: C.ok },
            { k:"FÉRIAS",  v:"2",  c: C.warn },
            { k:"NOVOS",   v:"2",  c: C.cyan },
          ].map(m => (
            <div key={m.k}>
              <Kicker style={{ color: C.fg3 }}>{m.k}</Kicker>
              <div style={{ font: `900 22px/1 ${C.mono}`, color: m.c, marginTop: 6 }}>{m.v}</div>
            </div>
          ))}
        </Plate>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minHeight: 0, overflow: "hidden" }}>
          {coaches.map(c => (
            <Plate key={c.i} style={{ padding: 12, display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 12, alignItems: "center" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: "rgba(82,231,255,0.10)", border: `1px solid ${C.cyanLine}`,
                display: "grid", placeItems: "center",
                font: `900 11px/1 ${C.mono}`, color: C.cyan, letterSpacing: "0.10em",
              }}>{c.i}</div>
              <div style={{ minWidth: 0 }}>
                <Body style={{ fontSize: 12, color: C.fg }}>{c.n}</Body>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <Pill tone={c.tone} style={{ height: 18, fontSize: 8 }}>{c.s}</Pill>
                  <Pill style={{ height: 18, fontSize: 8 }}>{c.a} alunos</Pill>
                  <Pill style={{ height: 18, fontSize: 8 }}>{c.freq}</Pill>
                </div>
              </div>
              <IChevR size={14} style={{ color: C.fg3 }}/>
            </Plate>
          ))}
        </div>
      </div>
      <CockpitNav active="ops"/>
    </Phone>
  );
}

/* ============================================================================
   11 · PAGAMENTOS
   ============================================================================ */
function ScrPagamentos() {
  const txs = [
    { d:"09/05", who:"Marina Caldas",     v:"R$ 540", s:"OK",   tone:"ok"  },
    { d:"09/05", who:"Rafael Diniz",      v:"R$ 540", s:"OK",   tone:"ok"  },
    { d:"08/05", who:"Henrique Paiva",    v:"R$ 180", s:"FAIL", tone:"bad" },
    { d:"08/05", who:"Sophia Albuquerque",v:"R$ 180", s:"FAIL", tone:"bad" },
    { d:"08/05", who:"Larissa Couto",     v:"R$ 540", s:"OK",   tone:"ok"  },
    { d:"07/05", who:"Caio Sampaio",      v:"R$ 180", s:"OK",   tone:"ok"  },
    { d:"07/05", who:"Beatriz Oliveira",  v:"R$ 180", s:"PEND", tone:"warn"},
  ];
  return (
    <Phone label="OPS" sub="FINANCEIRO">
      <Header title="Pagamentos" sub="0 9 · 0 5 · M E S"
        action={<Pill tone="cyan">EXPORTAR</Pill>}
      />
      <div style={{ position: "absolute", top: 108, bottom: 80, left: 0, right: 0, padding: "16px 18px 24px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 12 }}>
        <Plate style={{ padding: 16, position: "relative" }} glow>
          <HUDCorners/>
          <Kicker color={C.cyan}>RECEITA · MAIO</Kicker>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
            <span style={{ font: `900 30px/1 ${C.mono}`, color: C.fg, letterSpacing: "-0.02em" }}>R$ 184.320</span>
            <span style={{ font: `900 11px/1 ${C.mono}`, color: C.ok }}>+12.4%</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 14 }}>
            {[
              { k:"OK",     v:"1.218", c: C.ok   },
              { k:"PEND",   v:"32",    c: C.warn },
              { k:"FALHOU", v:"47",    c: C.bad  },
            ].map(m => (
              <div key={m.k} style={{ padding: 10, borderRadius: 8, background: "rgba(0,0,0,0.32)", border: `1px solid ${C.cyanGhost}` }}>
                <Kicker style={{ color: C.fg3 }}>{m.k}</Kicker>
                <div style={{ font: `900 18px/1 ${C.mono}`, color: m.c, marginTop: 6 }}>{m.v}</div>
              </div>
            ))}
          </div>
        </Plate>

        <Plate style={{ padding: 0, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "50px 1fr 70px 50px",
            gap: 6, padding: "10px 12px",
            background: "rgba(82,231,255,0.06)", borderBottom: `1px solid ${C.cyanGhost}`,
            font: `900 8px/1 ${C.mono}`, letterSpacing: "0.20em", color: C.fg3,
          }}>
            <span>DATA</span><span>ALUNO</span><span style={{ textAlign:"right" }}>VALOR</span><span style={{ textAlign:"center" }}>STATUS</span>
          </div>
          {txs.map((t, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "50px 1fr 70px 50px",
              gap: 6, padding: "10px 12px", alignItems: "center",
              borderBottom: i < txs.length - 1 ? `1px solid rgba(82,231,255,0.04)` : "none",
            }}>
              <span style={{ font: `700 10px/1 ${C.mono}`, color: C.fg3 }}>{t.d}</span>
              <span style={{ font: `600 11px/1 ${C.mono}`, color: C.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.who}</span>
              <span style={{ font: `700 11px/1 ${C.mono}`, color: C.fg, textAlign:"right" }}>{t.v}</span>
              <Pill tone={t.tone} style={{ height: 18, fontSize: 8, padding: "0 6px", justifySelf: "center" }}>{t.s}</Pill>
            </div>
          ))}
        </Plate>
      </div>
      <CockpitNav active="ops"/>
    </Phone>
  );
}

/* ============================================================================
   12 · LOGS / AUDITORIA
   ============================================================================ */
function ScrLogs() {
  const lines = [
    { t:"09:14:32", lv:"INFO",  m:"admin@guto · login OK · 187.45.x.x",      tone:"ok"   },
    { t:"09:14:11", lv:"WARN",  m:"GT-1280 · cobrança falhou · stripe.402",  tone:"warn" },
    { t:"09:13:54", lv:"INFO",  m:"GT-1284 · validação rosto · ok",          tone:"ok"   },
    { t:"09:13:22", lv:"INFO",  m:"L.M. · enviou IN-7F2A · marc@…",          tone:"ok"   },
    { t:"09:11:08", lv:"ERROR", m:"webhook stripe · 5xx · retry 1/3",        tone:"bad"  },
    { t:"09:10:41", lv:"INFO",  m:"GT-1281 · pacto renovado · 90D",          tone:"ok"   },
    { t:"09:08:19", lv:"WARN",  m:"GT-1278 · ausência · 3 dias",             tone:"warn" },
    { t:"09:07:02", lv:"INFO",  m:"R.A. · login OK · 200.156.x.x",           tone:"ok"   },
    { t:"09:05:48", lv:"INFO",  m:"GT-1283 · evolução TEEN→ADULT",           tone:"cyan" },
    { t:"09:03:11", lv:"ERROR", m:"GT-1275 · cobrança falhou · timeout",     tone:"bad"  },
    { t:"09:01:00", lv:"INFO",  m:"sistema · backup diário · ok",            tone:"ok"   },
  ];
  return (
    <Phone label="LOGS" sub="AO VIVO">
      <Header title="Auditoria · ao vivo" sub="0 9 · 0 5 · S T R E A M"
        action={<Pill tone="ok"><Dot tone="ok" size={5}/> STREAM</Pill>}
      />
      <div style={{ position: "absolute", top: 108, bottom: 80, left: 0, right: 0, padding: "12px 16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, overflow: "hidden" }}>
          <Pill tone="cyan">TUDO · 4.2K</Pill>
          <Pill tone="ok">INFO</Pill>
          <Pill tone="warn">WARN</Pill>
          <Pill tone="bad">ERROR</Pill>
        </div>

        <div style={{
          flex: 1, minHeight: 0, borderRadius: 10,
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(82,231,255,0.10)",
          boxShadow: "inset 0 0 32px rgba(0,0,0,0.6)",
          padding: "12px 12px 6px",
          fontFamily: C.mono,
          overflow: "hidden",
        }}>
          {lines.map((l, i) => {
            const c = l.tone === "ok" ? C.ok : l.tone === "warn" ? C.warn : l.tone === "bad" ? C.bad : C.cyan;
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "70px 56px 1fr",
                gap: 8, padding: "5px 0",
                borderBottom: "1px dashed rgba(82,231,255,0.04)",
                font: `500 10px/1.4 ${C.mono}`,
                opacity: i === 0 ? 1 : 0.85 - i * 0.03,
              }}>
                <span style={{ color: C.fg4 }}>{l.t}</span>
                <span style={{
                  color: c, font: `900 9px/1.4 ${C.mono}`,
                  letterSpacing: "0.15em",
                  textShadow: `0 0 6px ${c}66`,
                }}>{l.lv}</span>
                <span style={{ color: C.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <span style={{ color: c }}>›</span> {l.m}
                </span>
              </div>
            );
          })}
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6, color: C.cyan, font: `700 10px/1 ${C.mono}` }}>
            <span style={{ width: 6, height: 12, background: C.cyan, animation: "blink 1s infinite" }}/>
            <span style={{ color: C.fg3 }}>aguardando…</span>
          </div>
        </div>
      </div>
      <CockpitNav active="logs"/>
    </Phone>
  );
}

/* ============================================================================
   13 · CONFIGURAÇÕES
   ============================================================================ */
function ScrConfig() {
  const sections = [
    { k:"CONTA", items:[
      { l:"OPERADOR",        v:"williangustavo@guto.app", chev:true },
      { l:"NÍVEL",           v:"ADMIN · N1",              chev:false },
      { l:"IDIOMA",          v:"PT-BR",                   chev:true },
    ]},
    { k:"SEGURANÇA", items:[
      { l:"2FA",             v:"ATIVO",  toggle:true, on:true },
      { l:"BIOMETRIA",       v:"ATIVO",  toggle:true, on:true },
      { l:"SESSÕES ATIVAS",  v:"3",      chev:true },
      { l:"CHAVE DE ACESSO", v:"alterada há 12d",       chev:true },
    ]},
    { k:"ALERTAS", items:[
      { l:"PAGAMENTOS FALHOS", v:"ATIVO", toggle:true, on:true  },
      { l:"AUSÊNCIAS",         v:"ATIVO", toggle:true, on:true  },
      { l:"NOVOS CONVITES",    v:"OFF",   toggle:true, on:false },
    ]},
    { k:"SISTEMA", items:[
      { l:"VERSÃO",          v:"v 2.4.1",        chev:false },
      { l:"REGIÃO",          v:"SP-01",          chev:false },
      { l:"EXPORTAR DADOS",  v:"",               chev:true },
    ]},
  ];
  return (
    <Phone label="AJUSTES">
      <Header title="Ajustes" sub="C O N T A · S E G U R A N Ç A"/>
      <div style={{ position: "absolute", top: 108, bottom: 80, left: 0, right: 0, padding: "14px 18px 24px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 12 }}>
        {sections.map(sec => (
          <div key={sec.k}>
            <Kicker color={C.cyan} style={{ marginLeft: 4, marginBottom: 6, display: "block" }}>{sec.k}</Kicker>
            <Plate style={{ padding: 0, overflow: "hidden" }}>
              {sec.items.map((it, i, arr) => (
                <div key={it.l} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px",
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.cyanGhost}` : "none",
                }}>
                  <Kicker style={{ color: C.fg2 }}>{it.l}</Kicker>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {it.toggle ? (
                      <div style={{
                        width: 32, height: 18, borderRadius: 999, padding: 2,
                        background: it.on ? C.cyanSoft : "rgba(0,0,0,0.4)",
                        border: `1px solid ${it.on ? C.cyanLine : "rgba(232,244,255,0.10)"}`,
                        display: "flex", alignItems: "center",
                      }}>
                        <span style={{
                          width: 12, height: 12, borderRadius: 999,
                          background: it.on ? C.cyan : C.fg3,
                          boxShadow: it.on ? `0 0 6px ${C.cyan}` : "none",
                          marginLeft: it.on ? "auto" : 0,
                        }}/>
                      </div>
                    ) : (
                      <span style={{ font: `700 10px/1 ${C.mono}`, color: C.fg }}>{it.v}</span>
                    )}
                    {it.chev && <IChevR size={12} style={{ color: C.fg3 }}/>}
                  </div>
                </div>
              ))}
            </Plate>
          </div>
        ))}

        <Cta ghost danger style={{ marginTop: "auto" }}>Encerrar sessão</Cta>
      </div>
      <CockpitNav active="set"/>
    </Phone>
  );
}

/* ============================================================================
   MICRO-ESTADOS
   ============================================================================ */
function ScrPauseModal() {
  return (
    <Phone label="ALUNO" sub="GT-1284">
      {/* dimmed background of student detail */}
      <div style={{ position: "absolute", inset: 0, paddingTop: 44, opacity: 0.34, filter: "blur(2px)" }}>
        <div style={{ height: 64, borderBottom: `1px solid ${C.cyanGhost}` }}/>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ height: 96, borderRadius: 14, background: C.panel }}/>
          <div style={{ height: 64, borderRadius: 14, background: C.panel }}/>
          <div style={{ height: 64, borderRadius: 14, background: C.panel }}/>
        </div>
      </div>
      {/* dim overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(4,8,16,0.74)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}/>
      {/* modal */}
      <div style={{ position: "absolute", left: 18, right: 18, top: "50%", transform: "translateY(-50%)" }}>
        <Plate style={{ padding: 22, position: "relative" }} glow>
          <HUDCorners size={14}/>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.warnSoft, border: `1px solid ${C.warn}`, display: "grid", placeItems: "center", margin: "0 auto", boxShadow: `0 0 16px rgba(245,181,68,0.30)` }}>
            <IPause size={24} style={{ color: C.warn }}/>
          </div>
          <Kicker style={{ display: "block", textAlign: "center", color: C.warn, marginTop: 14 }}>AÇÃO · CRÍTICA</Kicker>
          <Title size={18} style={{ marginTop: 8, textAlign: "center" }}>Pausar acesso de<br/>Marina Caldas?</Title>
          <Body soft style={{ marginTop: 10, textAlign: "center", color: C.fg2, fontSize: 11 }}>
            O aluno perde acesso imediato ao app e o ciclo é congelado. A operação fica registrada no log.
          </Body>
          <div style={{ marginTop: 14, padding: 10, borderRadius: 8, background: "rgba(0,0,0,0.4)", border: `1px solid ${C.cyanGhost}` }}>
            <Kicker style={{ color: C.fg3 }}>MOTIVO</Kicker>
            <Body style={{ fontSize: 11, marginTop: 6, color: C.fg }}>Inadimplência · ciclo d+02</Body>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
            <Cta ghost>Cancelar</Cta>
            <Cta danger>Pausar acesso</Cta>
          </div>
        </Plate>
      </div>
    </Phone>
  );
}

function ScrAlunosFiltro() {
  return <ScrAlunos filterOpen hoverId={null}/>;
}
function ScrAlunosHover() {
  return <ScrAlunos filterOpen={false} hoverId="GT-1280"/>;
}

Object.assign(window, { ScrConvites, ScrCoaches, ScrPagamentos, ScrLogs, ScrConfig, ScrPauseModal, ScrAlunosFiltro, ScrAlunosHover });
