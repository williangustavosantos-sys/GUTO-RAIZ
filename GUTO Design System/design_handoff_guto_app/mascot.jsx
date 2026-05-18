// GUTO mascot — cute white robot with cyan core, big glass eyes.
// SVG-only placeholder for the production 3D/video avatar.
const Mascot = ({ size = 220 }) => (
  <svg viewBox="0 0 220 260" width={size} height={(size * 260) / 220} aria-hidden="true">
    <defs>
      <radialGradient id="m-body" cx="40%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="38%" stopColor="#f3f8fc"/>
        <stop offset="78%" stopColor="#cfdbe6"/>
        <stop offset="100%" stopColor="#9eafc1"/>
      </radialGradient>
      <radialGradient id="m-head" cx="36%" cy="28%" r="72%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="42%" stopColor="#f5f9fc"/>
        <stop offset="80%" stopColor="#c9d6e4"/>
        <stop offset="100%" stopColor="#94a7be"/>
      </radialGradient>
      <radialGradient id="m-eye" cx="36%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#d6f7ff"/>
        <stop offset="35%" stopColor="#52e7ff"/>
        <stop offset="70%" stopColor="#1a7fc4"/>
        <stop offset="100%" stopColor="#0a3a5e"/>
      </radialGradient>
      <radialGradient id="m-core" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#e6faff"/>
        <stop offset="40%" stopColor="#52e7ff"/>
        <stop offset="100%" stopColor="#0d6e85"/>
      </radialGradient>
      <filter id="m-glow"><feGaussianBlur stdDeviation="3"/></filter>
    </defs>

    {/* shadow / pedestal halo */}
    <ellipse cx="110" cy="248" rx="78" ry="8" fill="rgba(82,231,255,0.42)" filter="url(#m-glow)"/>
    <ellipse cx="110" cy="248" rx="48" ry="4" fill="rgba(255,255,255,0.7)"/>

    {/* body */}
    <ellipse cx="110" cy="178" rx="64" ry="58" fill="url(#m-body)"/>
    <ellipse cx="86" cy="156" rx="22" ry="18" fill="rgba(255,255,255,0.85)"/>

    {/* arms */}
    <ellipse cx="48" cy="178" rx="14" ry="22" fill="url(#m-body)" transform="rotate(-12 48 178)"/>
    <ellipse cx="172" cy="178" rx="14" ry="22" fill="url(#m-body)" transform="rotate(12 172 178)"/>

    {/* core orb */}
    <circle cx="110" cy="186" r="18" fill="url(#m-core)"/>
    <circle cx="110" cy="186" r="26" fill="none" stroke="rgba(82,231,255,0.45)" strokeWidth="1.2"/>
    <circle cx="105" cy="180" r="5" fill="rgba(255,255,255,0.85)"/>

    {/* head */}
    <ellipse cx="110" cy="86" rx="62" ry="58" fill="url(#m-head)"/>
    <ellipse cx="84" cy="62" rx="22" ry="14" fill="rgba(255,255,255,0.92)"/>

    {/* eyes */}
    <circle cx="86" cy="92" r="14" fill="url(#m-eye)"/>
    <circle cx="134" cy="92" r="14" fill="url(#m-eye)"/>
    <circle cx="82" cy="88" r="4.5" fill="#ffffff"/>
    <circle cx="130" cy="88" r="4.5" fill="#ffffff"/>
    <circle cx="89" cy="98" r="1.8" fill="#ffffff" opacity="0.85"/>
    <circle cx="137" cy="98" r="1.8" fill="#ffffff" opacity="0.85"/>

    {/* smile */}
    <path d="M 96 116 Q 110 124 124 116" stroke="rgba(13,35,65,0.42)" strokeWidth="2" fill="none" strokeLinecap="round"/>

    {/* legs / feet */}
    <ellipse cx="86" cy="232" rx="16" ry="8" fill="url(#m-body)"/>
    <ellipse cx="134" cy="232" rx="16" ry="8" fill="url(#m-body)"/>
  </svg>
);

// Glass capsule background — vertical cyan scan pillars + sparkle field.
const Capsule = ({ children, height = "100%" }) => (
  <div style={{ position: "relative", width: "100%", height, overflow: "hidden" }}>
    {/* pillar light (left) */}
    <div style={{
      position: "absolute", left: 22, top: 12, bottom: 12, width: 2,
      background: "linear-gradient(180deg, transparent, rgba(82,231,255,0.85) 18%, rgba(82,231,255,0.55) 80%, transparent)",
      filter: "blur(0.4px) drop-shadow(0 0 6px rgba(82,231,255,0.7))",
      borderRadius: 99,
    }}/>
    <div style={{
      position: "absolute", right: 22, top: 12, bottom: 12, width: 2,
      background: "linear-gradient(180deg, transparent, rgba(82,231,255,0.85) 18%, rgba(82,231,255,0.55) 80%, transparent)",
      filter: "blur(0.4px) drop-shadow(0 0 6px rgba(82,231,255,0.7))",
      borderRadius: 99,
    }}/>
    {/* particle field */}
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `
        radial-gradient(1px 1px at 14% 22%, rgba(255,255,255,0.9), transparent 60%),
        radial-gradient(1px 1px at 28% 64%, rgba(82,231,255,0.85), transparent 60%),
        radial-gradient(1px 1px at 42% 18%, rgba(255,255,255,0.7), transparent 60%),
        radial-gradient(1px 1px at 58% 78%, rgba(82,231,255,0.7), transparent 60%),
        radial-gradient(1px 1px at 72% 36%, rgba(255,255,255,0.85), transparent 60%),
        radial-gradient(1.4px 1.4px at 84% 62%, rgba(82,231,255,0.9), transparent 60%),
        radial-gradient(1px 1px at 22% 86%, rgba(255,255,255,0.7), transparent 60%),
        radial-gradient(1.2px 1.2px at 64% 14%, rgba(82,231,255,0.7), transparent 60%),
        radial-gradient(1px 1px at 90% 28%, rgba(255,255,255,0.6), transparent 60%),
        radial-gradient(1.4px 1.4px at 12% 50%, rgba(82,231,255,0.6), transparent 60%)`,
      pointerEvents: "none",
    }}/>
    {/* faint cyan haze top */}
    <div style={{
      position: "absolute", left: 0, right: 0, top: 0, height: 80,
      background: "linear-gradient(180deg, rgba(82,231,255,0.08), transparent)",
      pointerEvents: "none",
    }}/>
    {children}
  </div>
);

// Chrome rail bottom nav — cyan glowing orb on active.
const ChromeNav = ({ active, onChange, tabs }) => (
  <div style={{
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: "10px 14px 18px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(220,232,244,0.62) 50%, rgba(180,196,214,0.54) 100%)",
    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    borderTop: "1px solid rgba(255,255,255,0.85)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), 0 -8px 18px rgba(122,138,156,0.10)",
  }}>
    <nav style={{
      display: "grid", gridTemplateColumns: `repeat(${tabs.length}, 1fr)`, gap: 4,
    }}>
      {tabs.map(({ id, label, I }) => {
        const isActive = active === id;
        return (
          <button key={id} type="button" onClick={() => onChange(id)} aria-label={label}
            style={{
              border: "none", background: "transparent",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: "4px 0", cursor: "pointer",
            }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              display: "grid", placeItems: "center",
              background: isActive
                ? "radial-gradient(circle at 35% 30%, #d6f7ff 0%, #52e7ff 50%, #1ec1de 100%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(220,232,244,0.7) 100%)",
              boxShadow: isActive
                ? "0 0 14px rgba(82,231,255,0.7), 0 0 30px rgba(82,231,255,0.42), inset 0 -4px 8px rgba(13,35,65,0.18), inset 0 4px 8px rgba(255,255,255,0.7)"
                : "inset 1px 2px 4px rgba(152,163,179,0.32), inset -2px -3px 6px rgba(255,255,255,0.92), 0 1px 2px rgba(122,138,156,0.18)",
              color: isActive ? "#ffffff" : "rgba(13,35,65,0.62)",
            }}>
              <I size={18} stroke={isActive ? 2.4 : 2} />
            </div>
            <div style={{
              font: "900 8px/1 var(--guto-font-tech)",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: isActive ? "var(--guto-cyan)" : "rgba(13,35,65,0.55)",
              textShadow: isActive ? "0 0 6px rgba(82,231,255,0.55)" : "none",
            }}>{label}</div>
          </button>
        );
      })}
    </nav>
  </div>
);

// Chrome glow header — "GUTO & Willian" lockup.
const ChromeHeader = ({ children }) => (
  <div style={{
    position: "absolute", top: 44, left: 0, right: 0,
    padding: "16px 16px 12px",
    textAlign: "center",
    borderBottom: "1px solid rgba(82,231,255,0.32)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0))",
    zIndex: 5,
  }}>
    <div style={{
      font: "900 18px/1 var(--guto-font-display)",
      letterSpacing: "0.04em",
      background: "linear-gradient(180deg, #ffffff 0%, #b9d4e9 50%, #5d7896 100%)",
      WebkitBackgroundClip: "text", backgroundClip: "text",
      color: "transparent",
      textShadow: "0 0 8px rgba(82,231,255,0.32)",
      filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.7)) drop-shadow(0 0 12px rgba(82,231,255,0.32))",
    }}>{children}</div>
  </div>
);

// Pedestal — chrome ring under the mascot.
const Pedestal = () => (
  <div style={{ position: "relative", width: 220, height: 36, margin: "-14px auto 0" }}>
    <div style={{
      position: "absolute", inset: 0,
      borderRadius: "50%",
      background: "radial-gradient(ellipse at center, rgba(82,231,255,0.6) 0%, rgba(82,231,255,0.1) 50%, transparent 70%)",
      filter: "blur(2px)",
    }}/>
    <div style={{
      position: "absolute", left: 24, right: 24, top: 10, height: 14,
      borderRadius: "50%",
      background: "linear-gradient(180deg, #ffffff 0%, #c4d4e4 50%, #7e93ab 100%)",
      boxShadow: "0 4px 10px rgba(82,231,255,0.42), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -2px 4px rgba(13,35,65,0.22)",
    }}/>
    <div style={{
      position: "absolute", left: 40, right: 40, top: 18, height: 8,
      borderRadius: "50%",
      background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(180,196,214,0.62) 100%)",
      boxShadow: "0 2px 6px rgba(82,231,255,0.5)",
    }}/>
  </div>
);

// Frosted speech bubble used by the mascot.
const Bubble = ({ children }) => (
  <div style={{
    position: "relative",
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(255,255,255,0.94)",
    borderRadius: 22,
    padding: "12px 18px",
    boxShadow: "0 4px 14px rgba(82,231,255,0.22), inset 0 1px 0 rgba(255,255,255,0.94)",
    backdropFilter: "blur(10px)",
    font: "500 13px/1.45 var(--guto-font-tech)",
    color: "var(--guto-navy)",
    maxWidth: 240, margin: "0 auto",
  }}>
    {children}
    <div style={{
      position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%) rotate(45deg)",
      width: 14, height: 14,
      background: "rgba(255,255,255,0.78)",
      borderRight: "1px solid rgba(255,255,255,0.94)",
      borderBottom: "1px solid rgba(255,255,255,0.94)",
    }}/>
  </div>
);

Object.assign(window, { Mascot, Capsule, ChromeNav, ChromeHeader, Pedestal, Bubble });
