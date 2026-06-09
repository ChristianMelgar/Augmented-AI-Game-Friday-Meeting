const PHASE_DATA_INTROS = {
  1: PHASE_1_INTRO,
  2: PHASE_2_INTRO,
  3: PHASE_3_INTRO,
  4: PHASE_4_INTRO,
};

function PhaseDetailPage({ active, tab, setTab, setActiveStep, getMatrix, setMatrixStepId, setShowMatrix }) {
  const panels = ["situation", "data", "capture"];
  const panelIdx = panels.indexOf(tab) === -1 ? 0 : panels.indexOf(tab);
  const goTo = (idx) => { setTab(panels[idx]); };

  const intro = PHASE_DATA_INTROS[active.id] || {};

  const cardHeader = (idx, label, icon) => (
    <div style={{display:"flex", alignItems:"center", gap:"9px", marginBottom: panelIdx===idx ? "16px" : "12px"}}>
      <div style={{
        width:"28px", height:"28px", borderRadius:"50%", flexShrink:0,
        background: panelIdx===idx ? active.color : "rgba(190,185,175,0.5)",
        display:"flex", alignItems:"center", justifyContent:"center"
      }}>
        <span style={{fontFamily:"JetBrains Mono, monospace", fontSize:"11px", fontWeight:700,
          color: panelIdx===idx ? "#F5EFE3" : "#9A9590"}}>{idx+1}</span>
      </div>
      {icon}
      <div className="mono-font" style={{
        fontSize:"9px", letterSpacing:"2px", fontWeight:700,
        color: panelIdx===idx ? active.color : "#C0BAB0",
        borderBottom: panelIdx===idx ? `2px solid ${active.color}` : "2px solid transparent",
        paddingBottom:"2px", whiteSpace:"nowrap"
      }}>{label}</div>
    </div>
  );

  const situationIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={panelIdx===0 ? "#3D3830" : "#C8C3B8"} strokeWidth="1.5"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={panelIdx===0 ? "#3D3830" : "#C8C3B8"} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  const dataIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="2" width="14" height="20" rx="2" stroke={panelIdx===1 ? "#3D3830" : "#C8C3B8"} strokeWidth="1.5"/>
      <line x1="8" y1="8" x2="16" y2="8" stroke={panelIdx===1 ? "#3D3830" : "#C8C3B8"} strokeWidth="1.2"/>
      <line x1="8" y1="12" x2="16" y2="12" stroke={panelIdx===1 ? "#3D3830" : "#C8C3B8"} strokeWidth="1.2"/>
      <line x1="8" y1="16" x2="12" y2="16" stroke={panelIdx===1 ? "#3D3830" : "#C8C3B8"} strokeWidth="1.2"/>
    </svg>
  );
  const captureIcon = (
    <svg width="18" height="16" viewBox="0 0 24 20" fill="none">
      <circle cx="8" cy="6" r="3.5" stroke={panelIdx===2 ? "#3D3830" : "#C8C3B8"} strokeWidth="1.4"/>
      <circle cx="17" cy="6" r="3" stroke={panelIdx===2 ? "#3D3830" : "#C8C3B8"} strokeWidth="1.3"/>
      <path d="M1 18c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" stroke={panelIdx===2 ? "#3D3830" : "#C8C3B8"} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M16 13c1.8.4 4 1.8 4 4" stroke={panelIdx===2 ? "#3D3830" : "#C8C3B8"} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );

  const cardDefs = [
    // Card 0 — Situation
    {
      label: "THE SITUATION",
      icon: situationIcon,
      activeContent: (
        <div style={{flex:1, display:"flex", flexDirection:"column", gap:"0px", overflowY:"auto", minHeight:0}}>

          {/* Section 1 — Context */}
          <p style={{fontSize:"13px", lineHeight:1.72, color:"#1A1814", margin:"0 0 14px 0"}}>
            {active.situation}
          </p>

          {/* Section 2 — Typical deliverables (only if defined) */}
          {active.deliverables && active.deliverables.length > 0 && (
            <div style={{borderTop:"1px solid rgba(214,207,184,0.55)", paddingTop:"12px", marginBottom:"14px"}}>
              <div className="mono-font" style={{fontSize:"7.5px", letterSpacing:"2px", color:"#6B655A", marginBottom:"10px"}}>TYPICAL DELIVERABLES THIS PHASE</div>
              <div style={{display:"flex", flexWrap:"wrap", gap:"7px"}}>
                {active.deliverables.map((d, i) => {
                  const icons = {
                    "Hypothesis":"🔍","Impact case":"💰","Case for change":"🔥",
                    "Project approach & scope":"🗺️","Governance & ways of working":"⚙️",
                    "Project plan & mobilisation":"📅","Workshop & engagement setup":"🎯",
                    "Fact-pack":"📦","Data & analysis":"📊","Stakeholder & qualitative insights":"💬",
                    "Benchmarking & external perspectives":"🌐",
                    "Design criteria":"✅","Scenario definition":"🔀","Scenario modelling & simulation":"🧮",
                    "Scenario evaluation":"⚖️","Sensitivity & risk analysis":"🛡️",
                    "Recommendation":"🎯","Business case":"💼","Implementation & transition plan":"🚀",
                    "Pre-read presentation":"📄","Steer-co deck":"🖥️",
                    "Aligning stakeholders & securing approval":"🤝",
                  };
                  const icon = icons[d.label] || "📋";
                  return (
                    <div key={i} style={{
                      display:"flex", alignItems:"center", gap:"6px",
                      padding:"5px 10px", borderRadius:"20px",
                      background:"rgba(255,255,255,0.6)",
                      border:`1px solid ${active.color}33`
                    }}>
                      <span style={{fontSize:"13px", lineHeight:1}}>{icon}</span>
                      <span style={{fontSize:"11px", fontWeight:600, color:"#1A1814"}}>{d.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3 — The Ask removed; questions live in Team Capture */}
        </div>
      ),
      inactiveTeaser: "The project situation and typical deliverables for this phase."
    },
    // Card 1 — Team capture (Priority Matrix launcher)
    {
      label: "TEAM CAPTURE",
      icon: captureIcon,
      activeContent: (() => {
        const m = getMatrix(active.id);
        const total = m.pool.length + m.placed.length;
        return (
          <div style={{flex:1, display:"flex", flexDirection:"column", gap:"10px"}}>

            {/* The two guiding questions */}
            <div style={{display:"flex", flexDirection:"column", gap:"6px"}}>
              <p style={{fontSize:"12px", color:"#5A5449", margin:"0 0 8px 0", lineHeight:1.6}}>
                You're now brainstorming AI use cases for the <strong>{active.title}</strong> phase. Ground your ideas in the typical deliverables and workflows of this stage, and explore where AI could improve quality, accelerate execution, or enable entirely new ways of working. Use the guiding questions below to structure your thinking.<br/><br/>
                Once you're ready, Launch the Brainstorm.
              </p>
              {[
                ["1","SAVE TIME","Where does AI save us significant time in this phase — and what does it actually look like?", false],
                ["2","WOW THE CLIENT","What could we deliver that we would previously have said was out of scope or too expensive?", true]
              ].map(([num, label, q, accent]) => (
                <div key={num} style={{display:"flex", gap:"8px", alignItems:"flex-start", padding:"9px 10px", background:"rgba(255,253,248,0.75)", borderRadius:"8px", border:`1px solid ${active.color}22`}}>
                  <div style={{width:"16px", height:"16px", borderRadius:"50%", background: accent ? active.color : "#1A1814", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", marginTop:"1px"}}>
                    <span style={{fontFamily:"JetBrains Mono, monospace", fontSize:"7px", fontWeight:700, color:"#F5EFE3"}}>{num}</span>
                  </div>
                  <div>
                    <div className="mono-font" style={{fontSize:"7px", letterSpacing:"1.5px", color: accent ? active.color : "#6B655A", marginBottom:"2px"}}>{label}</div>
                    <p className="display-font" style={{fontSize:"12px", fontWeight:500, lineHeight:1.35, margin:0, color:"#1A1814"}}>{q}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Launch button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMatrixStepId(active.id);
                setShowMatrix(true);
              }}
              style={{
                marginTop:"auto", padding:"14px 0", background:active.color, color:"#F5EFE3",
                border:"none", borderRadius:"8px", fontFamily:"JetBrains Mono, monospace",
                fontSize:"11px", letterSpacing:"2px", fontWeight:700, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                boxShadow:"0 4px 16px rgba(26,24,20,0.18)", transition:"opacity 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity="1"}
            >
              {total === 0 ? "⊕  LAUNCH BRAINSTORM" : "⊕  OPEN BRAINSTORM BOARD"}
            </button>
          </div>
        );
      })(),
      inactiveTeaser: "Add ideas as a team, then drag them onto the impact / feasibility matrix."
    },
    // Card 2 — Materials & Data
    {
      label: "MATERIALS & DATA",
      icon: dataIcon,
      activeContent: (
        <div style={{flex:1, display:"flex", flexDirection:"column", gap:"12px"}}>
          <p style={{fontSize:"14px", lineHeight:1.65, color:"#1A1814", margin:0}}>
            {intro.desc}
          </p>
          <div style={{flex:1}}>
            <div className="mono-font" style={{fontSize:"8px", letterSpacing:"2px", color:"#6B655A", marginBottom:"7px"}}>WHAT'S INCLUDED</div>
            <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
              {(intro.bullets || []).map((item, i) => (
                <div key={i} style={{display:"flex", gap:"8px", alignItems:"flex-start"}}>
                  <div style={{width:"4px", height:"4px", borderRadius:"50%", background:active.color,
                    flexShrink:0, marginTop:"7px"}}/>
                  <span style={{fontSize:"13px", lineHeight:1.5, color:"#3D3830"}}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (active.downloadFn === "phase1") downloadPhase1Excel();
              if (active.downloadFn === "phase2") downloadPhase2Excel();
              if (active.downloadFn === "phase3") downloadPhase3Excel();
              if (active.downloadFn === "phase4") downloadPhase4Excel();
            }}
            style={{
              alignSelf:"flex-start", padding:"9px 16px",
              background:active.color, color:"#F5EFE3",
              border:"none", borderRadius:"6px",
              fontFamily:"JetBrains Mono, monospace",
              fontSize:"10px", fontWeight:700, letterSpacing:"1px",
              cursor:"pointer", display:"flex", alignItems:"center", gap:"6px",
              boxShadow:"0 2px 10px rgba(26,24,20,0.18)"
            }}>
            ↓ {active.dataLabel}
          </button>
        </div>
      ),
      inactiveTeaser: "Data files and materials for this phase, with download."
    }
  ];

  return (
    <div className="fade-in no-print" style={{
      flex:1, position:"relative", overflow:"hidden", display:"flex", flexDirection:"column",
      maxHeight:"100vh", width:"100%",
      backgroundImage:'url(Office%20new%20year.png)',
      backgroundSize:"cover", backgroundPosition:"center top"
    }}>
      <div style={{position:"absolute",inset:0,background:"rgba(245,241,232,0.15)",pointerEvents:"none"}}/>

      {/* Phase icon */}
      <div style={{
        position:"absolute", top:"16px", right:"36px", zIndex:10,
        width:"68px", height:"68px", background:active.color, borderRadius:"12px",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"0 4px 20px rgba(26,24,20,0.28)"
      }}>
        <svg width="42" height="42" viewBox="-25 -25 50 50">{renderIcon(active.icon, active.color, active.iconColor)}</svg>
      </div>

      {/* Header — back button + title only, no phase metadata */}
      <div style={{position:"relative", zIndex:2, padding:"16px 36px 14px 36px"}}>
        <button onClick={() => setActiveStep(null)} style={{
          background:"none", border:"none", cursor:"pointer",
          color:"rgba(58,52,44,0.70)", fontSize:"11px",
          fontFamily:"JetBrains Mono, monospace", letterSpacing:"1.5px",
          padding:"0 0 12px 0", display:"flex", alignItems:"center", gap:"5px"
        }}>← BACK TO GAMEBOARD</button>
        <h2 className="display-font" style={{
          fontSize:"42px", fontWeight:400, lineHeight:1.0,
          margin:"0 0 4px 0", letterSpacing:"-1.2px", color:"#FFFFFF",
          textShadow:"0 1px 8px rgba(26,24,20,0.45)"
        }}>{active.title}</h2>
        <p className="display-font" style={{
          fontSize:"15px", fontStyle:"italic", color:"#FFFFFF",
          margin:0, lineHeight:1.35, textShadow:"0 1px 6px rgba(26,24,20,0.45)"
        }}>{active.lede}</p>
      </div>

      {/* ── CAROUSEL ── cards float centred vertically and horizontally */}
      {(() => {
        const GAP = 16;
        const ACT_W = 500;
        const ACT_H = 480;
        const INACT_W = 180;
        const INACT_H = 380;

        return (
          <div style={{
            position:"relative", zIndex:2,
            flex:1,
            overflow:"hidden"
          }}>
            {cardDefs.map((cd, idx) => {
              const isActive = panelIdx === idx;
              const relIdx = idx - panelIdx;

              let leftVal;
              if (relIdx === 0) {
                leftVal = `calc(50% - ${ACT_W/2}px)`;
              } else if (relIdx === -1) {
                leftVal = `calc(50% - ${ACT_W/2 + GAP + INACT_W}px)`;
              } else {
                leftVal = `calc(50% + ${ACT_W/2 + GAP}px)`;
              }

              const topVal = "50%";
              const translateY = isActive ? "-50%" : "-50%";

              const cardStyle = {
                position:"absolute",
                left: leftVal,
                top: topVal,
                transform: `translateY(${translateY})`,
                width: isActive ? `${ACT_W}px` : `${INACT_W}px`,
                height: isActive ? `${ACT_H}px` : `${INACT_H}px`,
                borderRadius:"14px",
                backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)",
                transition:"all 0.38s cubic-bezier(0.4,0,0.2,1)",
                display:"flex", flexDirection:"column",
                overflow:"hidden",
                background: isActive ? "rgba(255,253,248,0.92)" : "rgba(255,253,248,0.58)",
                border: isActive ? `1.5px solid ${active.color}44` : "1px solid rgba(214,207,184,0.35)",
                boxShadow: isActive ? "0 12px 40px rgba(26,24,20,0.16)" : "0 2px 10px rgba(26,24,20,0.06)",
                cursor: isActive ? "default" : "pointer",
                padding: isActive ? "22px 24px" : "18px 16px",
                opacity: Math.abs(relIdx) > 1 ? 0 : 1,
                pointerEvents: Math.abs(relIdx) > 1 ? "none" : "auto"
              };

              return (
                <div
                  key={idx}
                  style={cardStyle}
                  onClick={() => !isActive && goTo(idx)}
                >
                  {cardHeader(idx, cd.label, cd.icon)}
                  {isActive
                    ? cd.activeContent
                    : (
                      <div style={{flex:1, display:"flex", alignItems:"flex-start"}}>
                        <p style={{fontSize:"12px", lineHeight:1.55, color:"#A8A39A", margin:0, fontStyle:"italic"}}>
                          {cd.inactiveTeaser}
                        </p>
                      </div>
                    )
                  }
                  {!isActive && (
                    <div style={{marginTop:"auto", paddingTop:"10px"}}>
                      <div style={{
                        fontSize:"18px", color:"rgba(168,107,63,0.35)",
                        fontFamily:"sans-serif", textAlign:"center", lineHeight:1
                      }}>›</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Dot indicators */}
      <div style={{
        position:"relative", zIndex:2,
        display:"flex", justifyContent:"center", alignItems:"center", gap:"8px",
        padding:"10px 0 6px"
      }}>
        {panels.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i===panelIdx ? "20px" : "8px", height:"8px", borderRadius:"4px",
            background: i===panelIdx ? active.color : "rgba(26,24,20,0.20)",
            border:"none", cursor:"pointer", padding:0, transition:"all 0.25s ease"
          }}/>
        ))}
      </div>

      {/* Card arrow nav (left/right within cards) */}
      {panelIdx > 0 && (
        <button onClick={() => goTo(panelIdx - 1)} style={{
          position:"absolute", left:"8px", top:"54%", transform:"translateY(-50%)",
          zIndex:10, width:"38px", height:"38px", borderRadius:"50%",
          background:"rgba(255,253,248,0.88)", border:"1px solid rgba(214,207,184,0.5)",
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 2px 12px rgba(26,24,20,0.12)", fontSize:"19px", color:"#3D3830",
          fontFamily:"sans-serif"
        }}>‹</button>
      )}
      {panelIdx < panels.length - 1 && (
        <button onClick={() => goTo(panelIdx + 1)} style={{
          position:"absolute", right:"8px", top:"54%", transform:"translateY(-50%)",
          zIndex:10, width:"38px", height:"38px", borderRadius:"50%",
          background:"rgba(255,253,248,0.88)", border:"1px solid rgba(214,207,184,0.5)",
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 2px 12px rgba(26,24,20,0.12)", fontSize:"19px", color:"#3D3830",
          fontFamily:"sans-serif"
        }}>›</button>
      )}

      {/* ── Phase navigation — bottom right ── */}
      {(() => {
        const stepIdx = STEPS.findIndex(s => s.id === active.id);
        const prevStep = stepIdx > 0 ? STEPS[stepIdx - 1] : null;
        const nextStep = stepIdx < STEPS.length - 1 ? STEPS[stepIdx + 1] : null;
        return (
          <div style={{
            position:"absolute", bottom:"20px", right:"28px",
            zIndex:10, display:"flex", gap:"10px", alignItems:"center"
          }}>
            {prevStep && (
              <button
                onClick={() => { setActiveStep(prevStep.id); setTab("situation"); }}
                style={{
                  display:"flex", alignItems:"center", gap:"8px",
                  padding:"10px 16px 10px 12px",
                  background:"rgba(255,253,248,0.88)",
                  backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
                  border:"1px solid rgba(214,207,184,0.55)",
                  borderRadius:"8px", cursor:"pointer",
                  boxShadow:"0 2px 12px rgba(26,24,20,0.10)",
                  transition:"all 0.2s ease"
                }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,253,248,0.98)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(255,253,248,0.88)"}
              >
                <div style={{
                  width:"26px", height:"26px", borderRadius:"6px",
                  background:prevStep.color,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                }}>
                  <svg width="14" height="14" viewBox="-25 -25 50 50">{renderIcon(prevStep.icon, prevStep.color, prevStep.iconColor)}</svg>
                </div>
                <div>
                  <div className="mono-font" style={{fontSize:"8px", letterSpacing:"1.5px", color:"#8A8478", marginBottom:"1px"}}>← PREVIOUS PHASE</div>
                  <div style={{fontSize:"12px", fontWeight:500, color:"#1A1814", fontFamily:"Fraunces, serif", lineHeight:1.2}}>{prevStep.title}</div>
                </div>
              </button>
            )}
            {nextStep && (
              <button
                onClick={() => { setActiveStep(nextStep.id); setTab("situation"); }}
                style={{
                  display:"flex", alignItems:"center", gap:"8px",
                  padding:"10px 12px 10px 16px",
                  background:"rgba(255,253,248,0.88)",
                  backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
                  border:`1px solid ${nextStep.color}55`,
                  borderRadius:"8px", cursor:"pointer",
                  boxShadow:"0 2px 12px rgba(26,24,20,0.10)",
                  transition:"all 0.2s ease"
                }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,253,248,0.98)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(255,253,248,0.88)"}
              >
                <div>
                  <div className="mono-font" style={{fontSize:"8px", letterSpacing:"1.5px", color:nextStep.color, marginBottom:"1px"}}>NEXT PHASE →</div>
                  <div style={{fontSize:"12px", fontWeight:500, color:"#1A1814", fontFamily:"Fraunces, serif", lineHeight:1.2}}>{nextStep.title}</div>
                </div>
                <div style={{
                  width:"26px", height:"26px", borderRadius:"6px",
                  background:nextStep.color,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                }}>
                  <svg width="14" height="14" viewBox="-25 -25 50 50">{renderIcon(nextStep.icon, nextStep.color, nextStep.iconColor)}</svg>
                </div>
              </button>
            )}
          </div>
        );
      })()}

    </div>
  );
}
