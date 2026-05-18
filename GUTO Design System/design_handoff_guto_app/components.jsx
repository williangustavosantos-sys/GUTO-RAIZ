// GUTO UI Kit · Shared atomic components.
// Every component below is a hi-fi recreation of a production GUTO surface.

const { useState, useRef, useEffect } = React;

/* -------------------------------------------------------------------------
   ICONS — inline Lucide SVGs (stroke 2, currentColor)
   ------------------------------------------------------------------------- */
const Icon = ({ d, size = 22, stroke = 2, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {d}
  </svg>
);
const IconMessage = (p) => <Icon d={<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"/>} {...p}/>;
const IconDumbbell = (p) => <Icon d={<g><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/></g>} {...p}/>;
const IconUtensils = (p) => <Icon d={<g><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></g>} {...p}/>;
const IconSwords = (p) => <Icon d={<g><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" y1="14" x2="9" y2="18"/><line x1="7" y1="17" x2="4" y2="20"/><line x1="3" y1="19" x2="5" y2="21"/></g>} {...p}/>;
const IconTrending = (p) => <Icon d={<g><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></g>} {...p}/>;
const IconMapPin = (p) => <Icon d={<g><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></g>} {...p}/>;
const IconSend = (p) => <Icon d={<g><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></g>} {...p}/>;
const IconMic = (p) => <Icon d={<g><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10a7 7 0 0 1-14 0"/><line x1="12" y1="19" x2="12" y2="22"/></g>} {...p}/>;
const IconArrow = (p) => <Icon d={<g><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></g>} {...p}/>;
const IconCheck = (p) => <Icon d={<polyline points="20 6 9 17 4 12"/>} {...p}/>;
const IconSettings = (p) => <Icon d={<g><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/><circle cx="12" cy="12" r="3"/></g>} {...p}/>;

/* -------------------------------------------------------------------------
   PRIMARY CTA — pill button, cyan fill, navy text
   ------------------------------------------------------------------------- */
function Cta({ children, onClick, disabled, full = true, style }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        height: 52, width: full ? "100%" : "auto",
        padding: full ? 0 : "0 28px",
        borderRadius: 999,
        background: "var(--guto-cyan)", color: "var(--guto-navy)",
        font: '900 11px/1 var(--guto-font-tech)',
        letterSpacing: "0.20em", textTransform: "uppercase",
        border: "none", boxShadow: "0 4px 20px rgba(82,231,255,0.30)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "transform 160ms ease",
        display: "grid", placeItems: "center",
        ...style,
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.96)"}
      onMouseUp={(e) => e.currentTarget.style.transform = ""}
      onMouseLeave={(e) => e.currentTarget.style.transform = ""}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------
   FIELD — debossed input slot
   ------------------------------------------------------------------------- */
function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="field-deboss">
      <div className="label">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------
   CHIP — uppercase pill, three states
   ------------------------------------------------------------------------- */
function Chip({ children, active, onClick, tone = "default" }) {
  const palette = active
    ? { bg: "rgba(82,231,255,0.18)", border: "rgba(82,231,255,0.6)", color: "#0d2341", glow: "0 0 14px rgba(82,231,255,0.22)" }
    : tone === "dark"
    ? { bg: "rgba(13,35,65,0.06)", border: "rgba(13,35,65,0.10)", color: "rgba(13,35,65,0.68)", glow: "none" }
    : { bg: "rgba(255,255,255,0.4)", border: "rgba(210,239,255,0.45)", color: "rgba(13,35,65,0.62)", glow: "none" };
  return (
    <button type="button" onClick={onClick}
      style={{
        height: 32, padding: "0 14px",
        borderRadius: 999,
        border: `1px solid ${palette.border}`,
        background: palette.bg, color: palette.color,
        font: '900 10px/1 var(--guto-font-tech)',
        letterSpacing: "0.18em", textTransform: "uppercase",
        boxShadow: palette.glow,
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}>
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------
   GUTO MARK — the cyan logo, used in headers and portals
   ------------------------------------------------------------------------- */
function GutoMark({ width = 140 }) {
  return (
    <img src="../../assets/logo_guto.png" alt="GUTO"
      style={{ width, height: "auto", display: "block",
               filter: "drop-shadow(0 4px 8px rgba(13,35,65,0.10)) drop-shadow(0 0 8px rgba(82,231,255,0.22))" }} />
  );
}

/* -------------------------------------------------------------------------
   AVATAR ORB — placeholder for the GUTO video avatar
   ------------------------------------------------------------------------- */
function AvatarOrb({ size = 220 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "radial-gradient(circle at 35% 28%, #d6f7ff 0%, #52e7ff 38%, #1ec1de 70%, #0d6e85 100%)",
      boxShadow: "0 0 35px rgba(103,196,255,0.42), 0 0 80px rgba(82,231,255,0.34), inset 0 -16px 30px rgba(13,35,65,0.30), inset 0 12px 30px rgba(255,255,255,0.50)",
      position: "relative",
    }}>
      <div style={{
        position: "absolute", top: "20%", left: "30%", width: "14%", height: "10%",
        borderRadius: "50%", background: "rgba(255,255,255,0.7)", filter: "blur(2px)"
      }} />
    </div>
  );
}

/* -------------------------------------------------------------------------
   BOTTOM NAV — 6 tabs, sticky bottom
   ------------------------------------------------------------------------- */
function BottomNav({ active, onChange }) {
  const tabs = [
    { id: "guto", label: "GUTO", I: IconMessage },
    { id: "missao", label: "TREINO", I: IconDumbbell },
    { id: "dieta", label: "DIETA", I: IconUtensils },
    { id: "arena", label: "ARENA", I: IconSwords },
    { id: "evo", label: "EVO.", I: IconTrending },
    { id: "perc", label: "PERC.", I: IconMapPin },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      padding: "10px 0 18px",
      background: "rgba(255,255,255,0.4)",
      backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)",
      borderTop: "1px solid rgba(193,204,218,0.4)",
    }}>
      <nav style={{
        margin: "0 auto", width: "91.54%", maxWidth: 400,
        display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
        gap: 4,
      }}>
        {tabs.map(({ id, label, I }) => {
          const isActive = active === id;
          return (
            <button key={id} type="button" onClick={() => onChange(id)}
              aria-label={label}
              style={{
                position: "relative", height: 56, borderRadius: 16,
                border: "none",
                background: isActive
                  ? "radial-gradient(circle, rgba(82,231,255,0.20) 0%, rgba(255,255,255,0) 62%), rgba(255,255,255,0.6)"
                  : "rgba(255,255,255,0.6)",
                boxShadow: "inset 2px 2px 8px rgba(152,163,179,0.22), inset -6px -6px 12px rgba(255,255,255,0.94)",
                color: isActive ? "var(--guto-cyan)" : "rgba(82,231,255,0.86)",
                display: "grid", placeItems: "center",
                cursor: "pointer",
                transition: "transform 160ms ease",
              }}>
              <I size={22} stroke={isActive ? 2.4 : 2} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* -------------------------------------------------------------------------
   TOP STRIP — frosted bar with logo + partner name
   ------------------------------------------------------------------------- */
function TopStrip({ partner }) {
  return (
    <div style={{
      position: "absolute", top: 44, left: 0, right: 0,
      height: 60, padding: "0 16px",
      background: "rgba(255,255,255,0.4)",
      backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      zIndex: 5,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <GutoMark width={94} />
        <span style={{
          width: 18, height: 18, borderRadius: 999,
          background: "rgba(255,255,255,0.2)",
          boxShadow: "inset 2px 3px 7px rgba(121,136,156,0.14), inset -3px -4px 8px rgba(255,255,255,0.84), 0 0 0 1px rgba(82,231,255,0.24)",
          display: "grid", placeItems: "center",
          font: "900 12px/1 var(--guto-font-tech)",
          color: "var(--guto-cyan)",
          textShadow: "0 0 8px rgba(82,231,255,0.6)",
          marginLeft: 6,
        }}>&</span>
        <span style={{
          font: '900 14px/1 var(--guto-font-tech)',
          color: "var(--guto-cyan)",
          marginLeft: 6,
          textShadow: "0 0 7px rgba(82,231,255,0.62), 0 1px 0 rgba(255,255,255,0.86)",
        }}>{partner}</span>
      </div>
      <button style={{
        width: 36, height: 36, borderRadius: 999,
        background: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.74)",
        boxShadow: "inset 2px 3px 8px rgba(121,136,156,0.13), inset -4px -5px 10px rgba(255,255,255,0.82)",
        color: "rgba(13,35,65,0.48)",
        display: "grid", placeItems: "center", cursor: "pointer",
      }} aria-label="Settings">
        <IconSettings size={16} />
      </button>
    </div>
  );
}

Object.assign(window, {
  Icon, IconMessage, IconDumbbell, IconUtensils, IconSwords, IconTrending,
  IconMapPin, IconSend, IconMic, IconArrow, IconCheck, IconSettings,
  Cta, Field, Chip, GutoMark, AvatarOrb, BottomNav, TopStrip,
});
