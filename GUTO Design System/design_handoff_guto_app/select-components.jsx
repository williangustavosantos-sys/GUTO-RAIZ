// GUTO — Select & MultiPick (premium dropdown components, JSX)
// Used by CalibrationScreen and Settings screens.

/* ---------- Select (single, dropdown panel) ---------- */
function Select({ value, onChange, options, placeholder = "Selecionar…", disabled = false }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(v => !v)}
        style={{
          width: "100%", height: 30, padding: "0 10px 0 12px", borderRadius: 999,
          border: `1px solid ${disabled ? "rgba(90,124,168,0.28)" : "#52e7ff"}`,
          background: disabled ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.78)",
          boxShadow: disabled ? "none" : "inset 0 1px 0 rgba(255,255,255,0.95), 0 0 8px rgba(82,231,255,0.18)",
          color: value ? "#2D3748" : "rgba(13,35,65,0.42)",
          fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.02em",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.55 : 1,
          textAlign: "left",
        }}
      >
        <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {value || placeholder}
        </span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 220ms ease", color: "#52e7ff", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: 36, left: 0, right: 0, zIndex: 100,
          background: "rgba(255,255,255,0.96)",
          border: "1px solid #52e7ff",
          borderRadius: 14,
          boxShadow: "0 12px 28px rgba(40,60,90,0.22), 0 0 20px rgba(82,231,255,0.25), inset 0 1px 0 rgba(255,255,255,0.95)",
          backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          maxHeight: 220, overflowY: "auto", padding: 4,
        }}>
          {options.map((opt) => {
            const on = opt === value;
            return (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                  width: "100%", padding: "8px 10px", border: "none", borderRadius: 8,
                  background: on ? "rgba(82,231,255,0.16)" : "transparent",
                  color: "#2D3748", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: on ? 800 : 600,
                  letterSpacing: "0.01em", textAlign: "left", cursor: "pointer",
                }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = "rgba(82,231,255,0.08)"; }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{opt}</span>
                {on && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52e7ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, filter: "drop-shadow(0 0 4px rgba(82,231,255,0.6))" }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- MultiPick (chips with dropdown) ---------- */
function MultiPick({ values, onChange, options, placeholder = "Selecionar…" }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const toggle = (v) => {
    if (values.includes(v)) onChange(values.filter(x => x !== v));
    else onChange([...values, v]);
  };
  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", minHeight: 30, padding: "5px 8px 5px 12px", borderRadius: 16,
          border: "1px solid #52e7ff",
          background: "rgba(255,255,255,0.78)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), 0 0 8px rgba(82,231,255,0.18)",
          display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4,
          cursor: "pointer", textAlign: "left",
        }}
      >
        {values.length === 0 && (
          <span style={{ flex: 1, color: "rgba(13,35,65,0.42)", fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700 }}>
            {placeholder}
          </span>
        )}
        {values.map((v) => (
          <span key={v} onClick={(e) => { e.stopPropagation(); toggle(v); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "2px 7px 2px 9px", borderRadius: 999,
              background: "rgba(82,231,255,0.22)",
              border: "1px solid rgba(82,231,255,0.7)",
              color: "#0d2341", fontFamily: "Inter, sans-serif", fontSize: 9.5, fontWeight: 800, letterSpacing: "0.04em",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
              whiteSpace: "nowrap",
            }}>
            {v}
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: -2 }}>
              <path d="M6 6 18 18M18 6 6 18"/>
            </svg>
          </span>
        ))}
        <span style={{ marginLeft: "auto", display: "grid", placeItems: "center", color: "#52e7ff" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 220ms ease" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 100,
          background: "rgba(255,255,255,0.96)",
          border: "1px solid #52e7ff",
          borderRadius: 14,
          boxShadow: "0 12px 28px rgba(40,60,90,0.22), 0 0 20px rgba(82,231,255,0.25), inset 0 1px 0 rgba(255,255,255,0.95)",
          backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          maxHeight: 220, overflowY: "auto", padding: 4,
        }}>
          {options.map((opt) => {
            const on = values.includes(opt);
            return (
              <button key={opt} type="button" onClick={() => toggle(opt)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                  width: "100%", padding: "7px 10px", border: "none", borderRadius: 8,
                  background: on ? "rgba(82,231,255,0.16)" : "transparent",
                  color: "#2D3748", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: on ? 800 : 600,
                  letterSpacing: "0.01em", textAlign: "left", cursor: "pointer",
                }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = "rgba(82,231,255,0.08)"; }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{opt}</span>
                <span style={{
                  width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                  border: on ? "1px solid #52e7ff" : "1px solid rgba(90,124,168,0.45)",
                  background: on ? "#52e7ff" : "transparent",
                  boxShadow: on ? "0 0 6px rgba(82,231,255,0.55)" : "none",
                  display: "grid", placeItems: "center",
                }}>
                  {on && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0d2341" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Select, MultiPick });
