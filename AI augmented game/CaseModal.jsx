function CaseModal({ showCase, setShowCase }) {
  if (!showCase) return null;
  return (
    <div className="modal-backdrop no-print" onClick={() => setShowCase(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={() => setShowCase(false)} style={{position:"absolute",top:"24px",right:"24px",background:"none",border:"1px solid #D6CFB8",width:"32px",height:"32px",cursor:"pointer",color:"#6B655A",fontSize:"16px",borderRadius:"2px"}}>×</button>
        <div className="mono-font" style={{fontSize:"11px",letterSpacing:"2px",color:"#6B2230",marginBottom:"12px"}}>THE CASE</div>
        <h2 className="display-font" style={{fontSize:"38px",fontWeight:500,lineHeight:1.05,margin:"0 0 6px 0",letterSpacing:"-1px"}}>NordicFoods Group</h2>
        <div className="display-font" style={{fontSize:"18px",fontStyle:"italic",color:"#6B655A",marginBottom:"24px"}}>Network 2030</div>
        <div style={{fontSize:"14px",lineHeight:1.75,color:"#1A1814"}}>
          <p>NordicFoods is a fictional Nordic food manufacturer with €1.2B revenue, 4 production sites in Denmark, Sweden, Norway, and Poland. Two years after acquiring Polaris Food Group (Gdansk) for €183M, the combined footprint is sub-optimal: overlapping portfolios, mismatched capacity, and a site still running at 54% utilisation.</p>
          <p>Three pressures land at once: EBIT has fallen from €124M to €75M in two years, DACH logistics costs are eroding the growth margin, and the board is pushing for clarity on capital allocation. The CEO has publicly committed to a Network 2030 programme.</p>
          <div style={{
            marginTop:"16px", padding:"16px 18px 14px 18px",
            background:"#EDE7D6", borderLeft:"3px solid #6B2230",
            borderRadius:"0 2px 2px 0"
          }}>
            <div className="mono-font" style={{fontSize:"9px", letterSpacing:"2px", color:"#6B2230", fontWeight:600, marginBottom:"10px"}}>THE ASK:</div>
            <ul style={{margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:"8px"}}>
              {[
                "Which sites do what?",
                "What do we keep/close/expand?",
                "Make vs outsource?",
                "How to phase the transition?"
              ].map((item) => (
                <li key={item} style={{display:"flex", gap:"10px", alignItems:"flex-start", fontSize:"14px", lineHeight:1.5, color:"#1A1814"}}>
                  <span style={{
                    width:"5px", height:"5px", borderRadius:"50%",
                    background:"#6B2230", flexShrink:0, marginTop:"8px"
                  }}/>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{marginTop:"16px",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))",gap:"10px"}}>
            {[["Revenue","€1.2B"],["Sites","DK · SE · NO · PL"],["EBIT trend","€124M → €75M"],["Engagement","10 weeks"]].map(([l,v]) => (
              <div key={l} style={{padding:"12px 14px",background:"#F8F5EE",borderRadius:"2px"}}>
                <div className="mono-font" style={{fontSize:"9px",letterSpacing:"2px",color:"#6B655A",marginBottom:"4px"}}>{l.toUpperCase()}</div>
                <div className="display-font" style={{fontSize:"16px",fontWeight:500}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
