function SetupScreen({ teamName, setTeamName, handleSetupConfirm }) {
  return (
    <div className="scene-container" style={{
      position:"fixed", inset:0, zIndex:100,
      display:"flex", alignItems:"center", justifyContent:"center", padding:"24px"
    }}>
      <SceneBackground/>
      {/* Tint so the form card stays readable over the scene */}
      <div style={{ position:"absolute", inset:0, background:"rgba(26,24,20,0.42)", pointerEvents:"none" }}/>
      <div style={{
        position:"relative", zIndex:1,
        background:"rgba(245,241,232,0.97)", maxWidth:"480px", width:"100%",
        borderRadius:"8px", padding:"48px",
        boxShadow:"0 24px 64px rgba(26,24,20,0.35)",
        animation:"fadeUp 0.3s ease-out"
      }}>
        <div className="mono-font" style={{fontSize:"11px", letterSpacing:"2px", color:"#6B2230", marginBottom:"12px"}}>IM_ Opsstrat · DSC Friday Meeting</div>
        <h2 className="display-font" style={{fontSize:"36px", fontWeight:500, lineHeight:1.1, margin:"0 0 8px 0", letterSpacing:"-0.8px"}}>The Augmented Consultant Game</h2>
        <p style={{fontSize:"14px", color:"#6B655A", margin:"0 0 36px 0", lineHeight:1.5}}>Name your team to get the party started.</p>

        <div style={{marginBottom:"36px"}}>
          <div className="mono-font" style={{fontSize:"10px", letterSpacing:"2px", color:"#6B655A", marginBottom:"12px"}}>TEAM NAME</div>
          <input
            autoFocus
            type="text"
            placeholder="e.g. AI Caramba" //Excel-erators
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSetupConfirm(); }}
            style={{
              width:"100%", padding:"12px 16px", border:"1px solid #D6CFB8",
              background:"#fff", fontFamily:"Inter, sans-serif", fontSize:"16px",
              color:"#1A1814", borderRadius:"2px", outline:"none",
              transition:"border-color 0.2s", boxSizing:"border-box"
            }}
            onFocus={e => e.target.style.borderColor="#1A1814"}
            onBlur={e => e.target.style.borderColor="#D6CFB8"}
          />
        </div>

        <button onClick={handleSetupConfirm} style={{
          width:"100%", padding:"14px", background:"#1A1814", color:"#F5F1E8",
          border:"none", fontFamily:"JetBrains Mono, monospace", fontSize:"12px",
          letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer",
          borderRadius:"2px", transition:"background 0.2s"
        }}>
          Start the session →
        </button>
      </div>
    </div>
  );
}

