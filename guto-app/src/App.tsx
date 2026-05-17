import { useEffect, useState } from "react";
import "./App.css";

type Screen = "page1" | "transition1" | "page2" | "transition2" | "page3" | "page4" | "home";
type Tab = "guto" | "caminho" | "evolucao" | "missao";

export default function App() {
  const [screen, setScreen] = useState<Screen>("page1");
  const [tab, setTab] = useState<Tab>("guto");
  const [language, setLanguage] = useState<"pt" | "it" | "es" | "en">("pt");
  const [name, setName] = useState("WILLIAN");
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isPage1ReadyToTransition, setIsPage1ReadyToTransition] = useState(false);

  const playMetallic = (intensity = 1) => {
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.18);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(90, now);
    osc2.frequency.exponentialRampToValueAtTime(220, now + 0.2);

    filter.type = "highpass";
    filter.frequency.setValueAtTime(220, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09 * intensity, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.28);
    osc2.stop(now + 0.28);
    setTimeout(() => void ctx.close(), 380);
  };

  useEffect(() => {
    if (screen !== "page1") return;
    const timer = setTimeout(() => {
      setIsPage1ReadyToTransition(true);
      setScreen("transition1");
      playMetallic(0.8);
    }, 1500);
    return () => clearTimeout(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== "transition1") return;
    const timer = setTimeout(() => setScreen("page2"), 900);
    return () => clearTimeout(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== "transition2") return;
    const timer = setTimeout(() => setScreen("page3"), 700);
    return () => clearTimeout(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== "page4" || !isHolding) return;
    const start = performance.now();
    const duration = 1250;
    let raf = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setHoldProgress(progress);
      if (progress >= 1) {
        setIsHolding(false);
        setIsFlashing(true);
        if (navigator.vibrate) navigator.vibrate([80, 30, 80]);
        playMetallic(1.2);
        setTimeout(() => {
          setScreen("home");
          setIsFlashing(false);
          setHoldProgress(0);
        }, 280);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isHolding, screen]);

  const handleLanguageSelect = (selected: "pt" | "it" | "es" | "en") => {
    setLanguage(selected);
    setScreen("transition2");
    playMetallic(0.65);
  };

  const handleConfirmName = () => {
    if (!name.trim()) return;
    setNameConfirmed(true);
    if (navigator.vibrate) navigator.vibrate(80);
    playMetallic(1);
    setTimeout(() => setScreen("page4"), 720);
  };

  const displayName = name.trim() || "WILLIAN";

  return (
    <div className={`flow-root ${isFlashing ? "flash-active" : ""}`}>
      {(screen === "page1" || screen === "transition1") && (
        <div className={`p1-root ${screen === "transition1" ? "door-opening" : ""}`}>
          <div className="p1-noise" aria-hidden="true" />
          <div className="p1-geometry" aria-hidden="true" />
          <div className="p1-capsule" aria-hidden="true">
            <div className="p1-capsule-reflection" />
          </div>
          <div className={`p1-logo-wrap ${isPage1ReadyToTransition ? "p1-ready" : ""}`} data-ready={isPage1ReadyToTransition}>
            <div className="p1-logo-video-shell" aria-label="GUTO logo">
              <video className="p1-logo-video" autoPlay muted loop playsInline>
                <source src="/GUTO-LOGO.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          {screen === "transition1" && (
            <>
              <div className="door-slice door-left" />
              <div className="door-slice door-right" />
              <div className="door-light" />
            </>
          )}
        </div>
      )}

      {screen === "page2" && (
        <div className="app-screen glass-bg">
          <div className="capsule-frame" />
          <div className="language-stack">
            <button className="lang-card" onClick={() => handleLanguageSelect("pt")}><span>🇧🇷</span><span>Português</span></button>
            <button className="lang-card" onClick={() => handleLanguageSelect("it")}><span>🇮🇹</span><span>Italiano</span></button>
            <button className="lang-card" onClick={() => handleLanguageSelect("es")}><span>🇪🇸</span><span>Español</span></button>
            <button className="lang-card" onClick={() => handleLanguageSelect("en")}><span>🇺🇸</span><span>English</span></button>
          </div>
        </div>
      )}

      {screen === "transition2" && (
        <div className="app-screen glass-bg panel-rotate">
          <div className="capsule-frame" />
          <div className="language-stack ghost">
            <div className="lang-card"><span>🇧🇷</span><span>Português</span></div>
            <div className="lang-card"><span>🇮🇹</span><span>Italiano</span></div>
            <div className="lang-card"><span>🇪🇸</span><span>Español</span></div>
            <div className="lang-card"><span>🇺🇸</span><span>English</span></div>
          </div>
        </div>
      )}

      {screen === "page3" && (
        <div className={`app-screen glass-bg ${nameConfirmed ? "name-confirmed" : ""}`}>
          <div className="capsule-frame" />
          <p className="complete-label">Complete.</p>
          <div className="name-logo">
            <div className="name-main">GUTO &amp; {displayName}</div>
          </div>
          <div className="name-input-shell">
            <span className="icon-ok">◉</span>
            <input
              value={displayName}
              onChange={(event) => setName(event.target.value.toUpperCase().slice(0, 12))}
              className="name-input"
              aria-label="Nome da dupla"
            />
            <button className="name-confirm-btn" onClick={handleConfirmName} aria-label="Confirmar nome">✓</button>
          </div>
        </div>
      )}

      {screen === "page4" && (
        <div className="app-screen glass-bg">
          <div className="capsule-frame" />
          <div className="pacto-brand">GUTO &amp; {displayName}</div>
          <div className="pacto-copy">
            <p>Sem volta.</p>
            <span>A gente executa.</span>
          </div>
          <div className="page4-top-name">GUTO &amp; {displayName}</div>
          <div className="hold-ui">
            <button
              className={`hold-button ${isHolding ? "holding" : ""}`}
              onPointerDown={() => {
                setIsHolding(true);
                playMetallic(0.55);
              }}
              onPointerUp={() => {
                setIsHolding(false);
                setHoldProgress(0);
              }}
              onPointerLeave={() => {
                setIsHolding(false);
                setHoldProgress(0);
              }}
              aria-label="Pressione e segure"
            >
              <span
                className="hold-progress"
                style={{ transform: `scale(${0.55 + holdProgress * 0.45})`, opacity: 0.35 + holdProgress * 0.65 }}
              />
            </button>
          </div>
          <p className="hold-instruction">Segure para confirmar o acordo</p>
        </div>
      )}

      {screen === "home" && (
        <div className="app-screen glass-bg">
          <div className="capsule-frame" />
          {tab === "guto" && (
            <section className="tab-panel tab-guto-panel">
              <div className="home-brand">GUTO &amp; {displayName}</div>
              <div className="command-bubble">Estamos prontos. Sem distrações.</div>
              <div className="guto-avatar">
                <video autoPlay muted loop playsInline>
                  <source src="/GUTO-BABY.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="command-input">Falar com Guto.. <span>➤</span></div>
            </section>
          )}
          {tab === "caminho" && (
            <section className="tab-panel">
              <h2>CAMINHO DO GUTO</h2>
              <p>Cada evolução reflete o seu esforço.</p>
              <div className="path-track">
                <span>21</span><span>22</span><span>23</span><span>24</span><span>25</span>
              </div>
              <div className="path-card">+150 XP • +3 dias na sequência • +1 observação do Guto</div>
            </section>
          )}
          {tab === "evolucao" && (
            <section className="tab-panel">
              <h2>EVOLUÇÕES DO GUTO</h2>
              <p>Cada evolução reflete o seu esforço.</p>
              <div className="evolution-row">
                <div className="evo-card unlocked">BABY</div>
                <div className="evo-card">TEEN</div>
                <div className="evo-card">ADULT</div>
                <div className="evo-card">ELITE</div>
              </div>
            </section>
          )}
          {tab === "missao" && (
            <section className="tab-panel">
              <h2>MISSÃO</h2>
              <p>Peito e tríceps</p>
              <div className="mission-item">Supino inclinado • 4 séries • 10 reps • 1:30 descanso <button>Falar com Guto</button></div>
              <div className="mission-item">Supino reto • 4 séries • 8 reps • 1:30 descanso <button>Falar com Guto</button></div>
              <div className="mission-item">Tríceps corda • 4 séries • 12 reps • 1:30 descanso <button>Falar com Guto</button></div>
            </section>
          )}

          <div className="tabbar">
            <span className="lang-chip">{language.toUpperCase()}</span>
            <button className={tab === "guto" ? "active" : ""} onClick={() => setTab("guto")}>GUTO</button>
            <button className={tab === "caminho" ? "active" : ""} onClick={() => setTab("caminho")}>CAMINHO</button>
            <button className={tab === "evolucao" ? "active" : ""} onClick={() => setTab("evolucao")}>EVOLUÇÕES</button>
            <button className={tab === "missao" ? "active" : ""} onClick={() => setTab("missao")}>MISSÃO</button>
          </div>
        </div>
      )}

      {isFlashing && (
        <div className="flash-layer">
          <div className="flash-core" />
        </div>
      )}

    </div>
  );
}
