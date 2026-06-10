function TopNav({ active, setActiveStep, showCase, setShowCase, showCaseTip, setShowCaseTip, completedSteps, setShowFinish, exportPlaybook, isExporting, theme, toggleTheme }) {
  return (
    <nav className="no-print topnav" style={{
      padding:"0 40px", display:"grid", gridTemplateColumns:"1fr auto 1fr",
      alignItems:"center", height:"64px", flexShrink:0, zIndex:10, position:"relative"
    }}>
      {/* Left: logo + title */}
      <div style={{display:"flex", alignItems:"center", gap:"12px", justifySelf:"start", minWidth:0}}>
        <div style={{
          width:"36px", height:"36px", borderRadius:"8px",
          border:"2px solid var(--nav-accent)", display:"flex", alignItems:"center",
          justifyContent:"center", flexShrink:0,
          background:"linear-gradient(135deg, rgba(168,107,63,0.08) 0%, rgba(168,107,63,0.02) 100%)"
        }}>
          <svg className="topnav-logo-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <line x1="5" y1="7" x2="11" y2="10.5" stroke="var(--nav-accent)" strokeWidth="1.1" strokeOpacity="0.45"/>
            <line x1="5" y1="12" x2="11" y2="12" stroke="var(--nav-accent)" strokeWidth="1.1" strokeOpacity="0.55"/>
            <line x1="5" y1="17" x2="11" y2="13.5" stroke="var(--nav-accent)" strokeWidth="1.1" strokeOpacity="0.45"/>
            <line x1="13" y1="10.5" x2="19" y2="8" stroke="var(--nav-accent)" strokeWidth="1.1" strokeOpacity="0.45"/>
            <line x1="13" y1="12" x2="19" y2="12" stroke="var(--nav-accent)" strokeWidth="1.1" strokeOpacity="0.55"/>
            <line x1="13" y1="13.5" x2="19" y2="16" stroke="var(--nav-accent)" strokeWidth="1.1" strokeOpacity="0.45"/>
            <circle cx="5" cy="7" r="1.6" fill="var(--nav-accent)"/>
            <circle cx="5" cy="12" r="1.6" fill="var(--nav-accent)"/>
            <circle cx="5" cy="17" r="1.6" fill="var(--nav-accent)"/>
            <circle cx="12" cy="12" r="2.4" fill="var(--nav-accent)"/>
            <circle cx="19" cy="8" r="1.6" fill="var(--nav-accent)"/>
            <circle cx="19" cy="12" r="1.6" fill="var(--nav-accent)"/>
            <circle cx="19" cy="16" r="1.6" fill="var(--nav-accent)"/>
            <path d="M12 5.5 L12.7 7.1 L14.4 7.3 L13.1 8.4 L13.5 10 L12 9.2 L10.5 10 L10.9 8.4 L9.6 7.3 L11.3 7.1 Z" fill="#C8973A" opacity="0.9"/>
          </svg>
        </div>
        <span className="mono-font topnav-title" style={{fontSize:"12px", letterSpacing:"2px", fontWeight:600}}>
          DCS Friday Meeting 
        </span>
      </div>

      {/* Centre nav — equal side columns keep this truly centred on the page */}
      <div style={{display:"flex", gap:"36px", alignItems:"center", justifySelf:"center"}}>
        {/* Case button with onboarding tip */}
        <div style={{position:"relative"}}>
          <button className="topnav-link" onClick={() => { setShowCase(true); setShowCaseTip(false); }}>
            Case
          </button>
          {showCaseTip && (
            <div style={{
              position:"absolute", top:"calc(100% + 14px)", left:"50%",
              transform:"translateX(-50%)",
              background:"#1A1814", color:"#F5EFE3",
              borderRadius:"8px", padding:"12px 16px",
              width:"220px", zIndex:100,
              boxShadow:"0 8px 28px rgba(26,24,20,0.22)",
              animation:"fadeUp 0.3s ease-out"
            }}>
              {/* Arrow */}
              <div style={{
                position:"absolute", top:"-6px", left:"50%",
                transform:"translateX(-50%)",
                width:"12px", height:"12px",
                background:"#1A1814",
                clipPath:"polygon(50% 0%, 0% 100%, 100% 100%)"
              }}/>
              <div className="mono-font" style={{fontSize:"8px", letterSpacing:"2px", color:"#C8973A", marginBottom:"6px"}}>START HERE</div>
              <p style={{fontSize:"12px", lineHeight:1.5, margin:"0 0 10px 0"}}>Read the case first — it gives context for the brainstorm in each phase.</p>
              <button
                onClick={() => setShowCaseTip(false)}
                style={{
                  background:"none", border:"1px solid rgba(255,255,255,0.3)",
                  color:"#F5EFE3", fontFamily:"JetBrains Mono, monospace",
                  fontSize:"9px", letterSpacing:"1.5px", cursor:"pointer",
                  padding:"5px 10px", borderRadius:"4px", width:"100%"
                }}
              >GOT IT ×</button>
            </div>
          )}
        </div>
        <button className={`topnav-link${!active ? " topnav-link--active" : ""}`} onClick={() => setActiveStep(null)}>
          The Gameboard
        </button>
      </div>

      {/* Right: theme + export */}
      <div style={{display:"flex", alignItems:"center", gap:"10px", justifySelf:"end"}}>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? "☀ Light" : "☾ Dark"}
        </button>
        {completedSteps.size === STEPS.length && (
          <button onClick={() => setShowFinish(true)} style={{
            background:"#C8973A", color:"#F5EFE3", border:"none",
            padding:"10px 20px", fontFamily:"JetBrains Mono, monospace",
            fontSize:"11px", letterSpacing:"1.5px", fontWeight:700,
            cursor:"pointer", borderRadius:"6px",
            display:"flex", alignItems:"center", gap:"7px",
            transition:"opacity 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity="1"}>
            🏁 Outcome
          </button>
        )}
        <button className="topnav-export" onClick={exportPlaybook} disabled={isExporting}>
          {isExporting ? "Preparing export…" : "Export Brainstorm"}
        </button>
      </div>
    </nav>
  );
}
