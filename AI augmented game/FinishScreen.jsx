function FinishScreen({ showFinish, setShowFinish, getMatrix, teamName, confettiRef, isExporting, exportPlaybook }) {
  if (!showFinish) return null;

  const allStarred = STEPS.flatMap(step => {
    const m = getMatrix(step.id);
    return m.placed.filter(c => c.starred).map(c => ({...c, step}));
  });
  const newIdeas = STEPS.reduce((sum, step) => {
    const m = getMatrix(step.id);
    const allIdeas = [...m.pool, ...m.placed];
    return sum + allIdeas.filter(c => !c.id.startsWith('pre_')).length;
  }, 0);

  return (
    <div className="scene-container" style={{
      position:"fixed", inset:0, zIndex:300,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      animation:"fadeUp 0.5s ease-out"
    }}>
      <SceneBackground variant="finish"/>

      {/* Confetti canvas */}
      <canvas ref={el => {
        if (!el || confettiRef.current) return;
        confettiRef.current = true;
        const ctx2d = el.getContext("2d");
        el.width = window.innerWidth; el.height = window.innerHeight;
        const pieces = Array.from({length: 160}, () => ({
          x: Math.random() * el.width,
          y: -20 - Math.random() * el.height * 0.5,
          w: 6 + Math.random() * 8, h: 10 + Math.random() * 6,
          r: Math.random() * Math.PI * 2,
          dr: (Math.random() - 0.5) * 0.12,
          vx: (Math.random() - 0.5) * 2.5,
          vy: 1.8 + Math.random() * 2.5,
          color: ["#C8973A","#6B2230","#3A4148","#5A7370","#A86B3F","#F5C842","#8B4F6E","#4A7C5A"][Math.floor(Math.random()*8)],
          opacity: 0.85 + Math.random() * 0.15
        }));
        let frame;
        const draw = () => {
          ctx2d.clearRect(0, 0, el.width, el.height);
          pieces.forEach(p => {
            ctx2d.save();
            ctx2d.globalAlpha = p.opacity;
            ctx2d.translate(p.x, p.y);
            ctx2d.rotate(p.r);
            ctx2d.fillStyle = p.color;
            ctx2d.fillRect(-p.w/2, -p.h/2, p.w, p.h);
            ctx2d.restore();
            p.x += p.vx; p.y += p.vy; p.r += p.dr;
            p.vx += (Math.random()-0.5) * 0.1;
            p.vy *= 0.999;
            p.opacity -= 0.0015;
            if (p.y > el.height + 20) { p.y = -20; p.x = Math.random() * el.width; p.opacity = 0.9; }
          });
          frame = requestAnimationFrame(draw);
        };
        draw();
        setTimeout(() => { cancelAnimationFrame(frame); ctx2d.clearRect(0,0,el.width,el.height); confettiRef.current = null; }, 8000);
      }} style={{position:"absolute", inset:0, pointerEvents:"none", zIndex:1}}/>

      {/* Content card */}
      <div style={{
        position:"relative", zIndex:2,
        background:"rgba(245,241,232,0.97)",
        borderRadius:"16px", padding:"52px 56px",
        maxWidth:"640px", width:"90%",
        boxShadow:"0 24px 80px rgba(26,24,20,0.4)",
        textAlign:"center",
        animation:"fadeUp 0.6s ease-out"
      }}>
        <div style={{fontSize:"48px", marginBottom:"16px"}}>🏁</div>

        <div className="mono-font" style={{fontSize:"10px", letterSpacing:"3px", color:"#C8973A", marginBottom:"10px"}}>SESSION COMPLETE</div>
        <h1 className="display-font" style={{fontSize:"38px", fontWeight:500, margin:"0 0 6px 0", letterSpacing:"-0.8px", color:"#1A1814"}}>
          Well played, {teamName}!
        </h1>
        <p style={{fontSize:"14px", color:"#6B655A", margin:"0 0 32px 0", lineHeight:1.6}}>
          You've explored AI opportunities across all four phases of a real consulting engagement.
        </p>

        <div style={{display:"flex", gap:"12px", marginBottom:"32px"}}>
          {[["PHASES DONE", `${STEPS.length}/${STEPS.length}`],["NEW IDEAS ADDED", newIdeas],["TOP PICKS", allStarred.length]].map(([label, val]) => (
            <div key={label} style={{flex:1, background:"#F0EBE0", borderRadius:"10px", padding:"16px 12px"}}>
              <div className="mono-font" style={{fontSize:"8px", letterSpacing:"2px", color:"#6B655A", marginBottom:"6px"}}>{label}</div>
              <div className="display-font" style={{fontSize:"32px", fontWeight:500, color:"#1A1814"}}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{display:"flex", gap:"12px"}}>
          <button disabled={isExporting} onClick={() => {
            setShowFinish(false);
            confettiRef.current = null;
            setTimeout(() => exportPlaybook(), 100);
          }} style={{
            flex:1, padding:"14px 0", background:"#1A1814", color:"#F5EFE3",
            border:"none", borderRadius:"8px", fontFamily:"JetBrains Mono, monospace",
            fontSize:"11px", letterSpacing:"2px", fontWeight:700,
            cursor:isExporting?"wait":"pointer", opacity:isExporting?0.7:1
          }}>{isExporting ? "PREPARING EXPORT…" : "EXPORT BRAINSTORM"}</button>
          <button onClick={() => { setShowFinish(false); confettiRef.current = null; }} style={{
            padding:"14px 20px", background:"transparent", color:"#1A1814",
            border:"1px solid #D6CFB8", borderRadius:"8px",
            fontFamily:"JetBrains Mono, monospace", fontSize:"11px",
            letterSpacing:"1.5px", cursor:"pointer"
          }}>BACK TO BOARD</button>
        </div>
      </div>
    </div>
  );
}
