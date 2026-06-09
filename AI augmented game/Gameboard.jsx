// Nudge path, stations, START/END down within the SVG viewBox (increase to move further down)
const GAMEBOARD_Y_OFFSET = 40;

function Gameboard({
  guideText, hoveredStep, setHoveredStep, setGuideText,
  setActiveStep, setTab, completedSteps,
  getMatrix, setMatrixStepId, setShowMatrix,
  hoverCardId, setHoverCardId
}) {
  return (
    <div className="fade-in no-print" style={{flex:1, display:"flex", flexDirection:"column"}}>

      {/* Landscape gameboard */}
      <div style={{flex:1, position:"relative", minHeight:"560px", maxHeight:"100vh", width:"100%", overflow:"hidden"}}>
        {/* Background image */}
        <div style={{
          position:"absolute", inset:0,
          maxHeight:"100vh", width:"100%",
          backgroundImage:'url(Office%20new%20year.png)',
          backgroundSize:"cover", backgroundPosition:"center top",
          backgroundRepeat:"no-repeat"
        }}/>
        {/* Subtle overlay to make tiles readable */}
        <div style={{position:"absolute", inset:0, background:"rgba(245,241,232,0.18)"}}/>

        {/* Hero title — overlaid top-left inside landscape */}
        <div style={{
          position:"absolute", top:"28px", left:"52px", zIndex:3, maxWidth:"280px"
        }}>
          <h1 className="display-font" style={{
          fontSize:"38px", fontWeight:400, lineHeight:1.05,
          margin:"0 0 6px 0", letterSpacing:"-1.2px", color:"#ffffff",  // 👈 changed
          textShadow:"0 1px 8px rgba(245,241,232,0.7)"
        }}>The Augmented Consultant Game</h1>
        <div style={{width:"36px", height:"2px", background:"#A86B3F", marginBottom:"8px"}}></div>
        <p style={{fontSize:"12px", color:"#ffffff", margin:0, lineHeight:1.5,  // 👈 changed
          textShadow:"0 1px 4px rgba(245,241,232,0.8)"}}>
          A step-by-step gameboard for brainstorming and applying AI across a real operations engagement.
        </p>
        </div>

        {/* SVG gameboard overlay */}
        <svg viewBox="0 0 1440 560" style={{
          position:"absolute", inset:0, width:"100%", height:"100%"
        }} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6B2230"/>
              <stop offset="33%" stopColor="#3A4148"/>
              <stop offset="66%" stopColor="#5A7370"/>
              <stop offset="100%" stopColor="#A86B3F"/>
            </linearGradient>
            <filter id="sh">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
              <feOffset dx="0" dy="3" result="b"/>
              <feComponentTransfer><feFuncA type="linear" slope="0.25"/></feComponentTransfer>
              <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="sh2">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="0" dy="1" result="b"/>
              <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
              <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <g transform={`translate(0, ${GAMEBOARD_Y_OFFSET})`}>

          {/* START marker */}
          <g transform="translate(62,320)">
            <circle r="30" fill="rgba(245,241,232,0.9)" stroke="#1A1814" strokeWidth="1.5" filter="url(#sh2)"/>
            <text textAnchor="middle" dy="4" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="700" fill="#1A1814">START🧭</text>
          </g>

          {/* END marker — flag on mountain */}
          <g transform="translate(1378,190)">
          <circle r="30" fill="#1A1814" filter="url(#sh2)"/>
          <text
            textAnchor="middle"
            fontSize="9"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
            fill="#F5F1E8"
          >
            <tspan x="0" dy="-2">END OF</tspan>
            <tspan x="0" dy="10"> FY YEAR🎉</tspan>
          </text>
            </g>

          {/* Dashed path */}
          <path d={buildPath(STEPS)} fill="none" stroke="rgba(245,241,232,0.6)" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 5"/>
          <path d={buildPath(STEPS)} fill="none" stroke="url(#pg)" strokeWidth="2" strokeLinecap="round" strokeDasharray="8 5" className="path-flow" opacity="0.85"/>

          {/* Station tiles */}
          {STEPS.map(step => {
            const half = 44;
            return (
              <g key={step.id} className="station"
                 transform={`translate(${step.x},${step.y})`}
                 onClick={() => { setActiveStep(step.id); setTab("context"); }}
                 onMouseEnter={() => { setHoveredStep(step.id); setGuideText(step.lede); }}
                 onMouseLeave={() => { setHoveredStep(null); setGuideText("Hover over each phase to learn more about the objective and key activities."); }}>

                {/* Translucent rounded square behind tile (halo) */}
                <rect x={-half-10} y={-half-10} width={108} height={108}
                  rx="18" fill="rgba(245,241,232,0.22)"
                  opacity={hoveredStep===step.id ? 0.85 : 0.55}
                  style={{transition:"opacity 0.3s ease"}}/>

                {/* Outer glow ring on hover */}
                <rect className="station-ring" x={-half-7} y={-half-7} width={102} height={102}
                  rx="15" fill="none" stroke="rgba(245,241,232,0.9)" strokeWidth="2"
                  opacity={hoveredStep===step.id ? 0.9 : 0}/>

                {/* Main tile */}
                <rect className="station-tile" x={-half} y={-half} width={88} height={88}
                  rx="12" fill={step.color} filter="url(#sh)"/>

                {/* Icon */}
                {renderIcon(step.icon, step.color, step.iconColor)}

                {/* Number badge — green checkmark when completed */}
                <g transform={`translate(${half-4},${-half+4})`}>
                  {completedSteps.has(step.id) ? (<>
                    <circle r="13" fill="#5A7A3A" stroke="#4A6A2A" strokeWidth="1.5" filter="url(#sh2)"
                      style={completedSteps.size === STEPS.length ? {animation:"checkPulse 1.4s ease-in-out infinite", transformOrigin:"center", transformBox:"fill-box"} : {}}/>
                    <path d="M -6 0 L -1 5 L 7 -5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={completedSteps.size === STEPS.length ? {animation:"checkPulse 1.4s ease-in-out infinite", transformOrigin:"center", transformBox:"fill-box"} : {}}/>
                  </>) : (<>
                    <circle r="13" fill="#F5EFE3" stroke={step.color} strokeWidth="1.5" filter="url(#sh2)"/>
                    <text textAnchor="middle" dy="3" fontSize="10"
                      fontFamily="JetBrains Mono, monospace" fontWeight="700" fill={step.color}>{step.number}</text>
                  </>)}
                </g>

                {/* Title — white on hover; icon inside tile unchanged */}
                <text y={half+18} textAnchor="middle" fontSize="13"
                  fontFamily="Fraunces, serif" fontWeight="500"
                  fill={hoveredStep===step.id ? "#FFFFFF" : "#1A1814"}
                  style={{paintOrder:"stroke", transition:"fill 0.25s ease"}}
                  stroke={hoveredStep===step.id ? "rgba(26,24,20,0.35)" : "rgba(245,241,232,0.6)"}
                  strokeWidth="3">{step.title}</text>

                {/* Duration — bottom inside the coloured tile */}
                <text y={half - 10} textAnchor="middle" fontSize="8"
                  fontFamily="JetBrains Mono, monospace" fill="#FFFFFF"
                  fontWeight="600" letterSpacing="0.5">{step.duration.toUpperCase()}</text>
              </g>
            );
          })}

          </g>
        </svg>

        {/* ── STARRED IDEA CHIPS — overlaid per station ── */}
        {STEPS.map(step => {
          const m = getMatrix(step.id);
          const starred = m.placed.filter(c => c.starred);
          if (starred.length === 0) return null;
          const pctX = (step.x / 1440) * 100;
          const chipOffsetY = step.y === 175 ? 78 : 62;
          const pctY = ((step.y + chipOffsetY + GAMEBOARD_Y_OFFSET) / 560) * 100;
          const chipWidthPct = (88 / 1440) * 100;
          return (
            <div key={step.id} style={{
              position:"absolute",
              left:`${pctX}%`,
              top:`${pctY}%`,
              transform:"translateX(-50%)",
              display:"flex", flexDirection:"column", gap:"5px",
              zIndex:4, pointerEvents:"auto",
              width:`${chipWidthPct}%`
            }}>
              {starred.map(card => (
                <div
                  key={card.id}
                  className="starred-chip"
                  onClick={() => {
                    setMatrixStepId(step.id); setShowMatrix(true);
                  }}
                  title={card.desc || card.headline}
                  style={{
                    background: step.color + "CC",
                    borderRadius:"6px",
                    padding:"5px 8px 5px 8px",
                    display:"flex", alignItems:"center", gap:"5px",
                    cursor:"pointer",
                    boxShadow:"0 2px 8px rgba(26,24,20,0.18)",
                    transition:"background 0.2s, transform 0.15s",
                    userSelect:"none"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = step.color + "EE"; e.currentTarget.style.transform = "scale(1.03)"; setHoverCardId(card.id + "_board"); }}
                  onMouseLeave={e => { e.currentTarget.style.background = step.color + "CC"; e.currentTarget.style.transform = "scale(1)"; setHoverCardId(null); }}
                >
                  <span style={{fontSize:"11px", color:"#F5C842", flexShrink:0, lineHeight:1}}>★</span>
                  <span style={{
                    fontSize:"10px", fontWeight:600, color:"#F5EFE3",
                    lineHeight:1.25, overflow:"hidden",
                    display:"-webkit-box", WebkitLineClamp:2,
                    WebkitBoxOrient:"vertical"
                  }}>{card.headline}</span>
                  {hoverCardId === card.id + "_board" && card.desc && (
                    <div style={{
                      position:"absolute", bottom:"calc(100% + 6px)", left:"50%",
                      transform:"translateX(-50%)",
                      background:"#1A1814", color:"#F5EFE3",
                      borderRadius:"6px", padding:"7px 10px",
                      fontSize:"11px", lineHeight:1.45,
                      width:"180px", zIndex:20,
                      boxShadow:"0 4px 16px rgba(26,24,20,0.28)",
                      pointerEvents:"none", whiteSpace:"normal",
                      fontFamily:"Inter, sans-serif"
                    }}>
                      {card.desc}
                      <div style={{position:"absolute",bottom:"-5px",left:"50%",transform:"translateX(-50%)",width:"10px",height:"10px",background:"#1A1814",clipPath:"polygon(0 0,100% 0,50% 100%)"}}/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}

        {/* ── GUIDE BAR — floating inside landscape, bottom-centre ── */}
        <div style={{
          position:"absolute", bottom:"24px",
          left:"50%", transform:"translateX(-50%)",
          background:"rgba(255,253,248,0.85)",
          backdropFilter:"blur(14px)",
          WebkitBackdropFilter:"blur(14px)",
          border:"1px solid rgba(214,207,184,0.55)",
          borderRadius:"12px",
          padding:"12px 22px",
          display:"flex", alignItems:"center", gap:"12px",
          boxShadow:"0 4px 24px rgba(26,24,20,0.12)",
          minWidth:"380px", maxWidth:"600px",
          zIndex:5
        }}>
          <div style={{
            width:"32px", height:"32px", borderRadius:"50%",
            background:"rgba(245,241,232,0.9)",
            border:"1px solid rgba(168,107,63,0.4)",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#A86B3F" strokeWidth="1.5"/>
              <line x1="12" y1="3" x2="12" y2="21" stroke="#A86B3F" strokeWidth="1.2"/>
              <line x1="3" y1="12" x2="21" y2="12" stroke="#A86B3F" strokeWidth="1.2"/>
              <polygon points="12,5 13.5,11 12,10.5 10.5,11" fill="#A86B3F"/>
            </svg>
          </div>
          <div>
            <span style={{fontFamily:"Inter, sans-serif", fontSize:"14px", fontWeight:600, color:"#1A1814", marginRight:"10px"}}>Guide your journey.</span>
            <span style={{fontFamily:"Inter, sans-serif", fontSize:"13px", color:"#5A5449", lineHeight:1.4}}>{guideText}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
