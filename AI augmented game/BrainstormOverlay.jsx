function BrainstormOverlay({
  showMatrix, matrixStepId, getMatrix, showContextDrawer, setShowContextDrawer,
  setShowMatrix, markStepDone, matrixRef, matrixDragging, setMatrixDragging,
  matrixHandleDrop, floatingToast, showAddForm, setShowAddForm,
  addHeadline, setAddHeadline, addDesc, setAddDesc, matrixAddIdea,
  matrixRemoveFromPool, matrixRemoveFromPlaced, matrixToggleStar,
  hoverCardId, setHoverCardId, snappingCard
}) {
  if (!showMatrix) return null;

  const sid = matrixStepId;
  const step = STEPS.find(s => s.id === sid);
  const m = getMatrix(sid);
  const accentColor = step ? step.color : "#6B2230";

  return (
    <div className="no-print scene-container" style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column"}}>
      <SceneBackground/>

      {/* Header */}
      <div style={{position:"relative",zIndex:2,padding:"18px 36px 14px 36px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(214,207,184,0.4)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",background:"rgba(255,253,248,0.72)"}}>
        <div>
          <div className="mono-font" style={{fontSize:"9px",letterSpacing:"2.5px",color:accentColor,marginBottom:"3px"}}>TEAM CAPTURE · {step ? step.title.toUpperCase() : ""}</div>
          <div className="display-font" style={{fontSize:"26px",fontWeight:400,letterSpacing:"-0.6px",color:"#1A1814"}}>Brainstorm Board</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <button onClick={() => setShowContextDrawer(v => !v)} style={{background:showContextDrawer?accentColor:"transparent",color:showContextDrawer?"#F5EFE3":"#1A1814",border:`1px solid ${showContextDrawer?accentColor:"#D6CFB8"}`,padding:"9px 18px",fontFamily:"JetBrains Mono, monospace",fontSize:"10px",letterSpacing:"1.5px",cursor:"pointer",borderRadius:"6px",fontWeight:700,display:"flex",alignItems:"center",gap:"7px",transition:"all 0.2s"}}><span style={{fontSize:"12px"}}>📋</span> SITUATION & DATA</button>
          <button onClick={() => setShowMatrix(false)} style={{background:"transparent",color:"#1A1814",border:"1px solid #D6CFB8",padding:"9px 20px",fontFamily:"JetBrains Mono, monospace",fontSize:"10px",letterSpacing:"1.5px",cursor:"pointer",borderRadius:"6px",fontWeight:700}}>← BACK</button>
          {(() => {
            const stepIdx = STEPS.findIndex(s => s.id === sid);
            const nextStep = stepIdx < STEPS.length - 1 ? STEPS[stepIdx + 1] : null;
            return (
              <button onClick={() => markStepDone(sid)} style={{background:accentColor,color:"#F5EFE3",border:"none",padding:"9px 22px",fontFamily:"JetBrains Mono, monospace",fontSize:"10px",letterSpacing:"1.5px",cursor:"pointer",borderRadius:"6px",fontWeight:700,display:"flex",alignItems:"center",gap:"8px",boxShadow:`0 4px 16px ${accentColor}44`}}>
                {nextStep ? <>CONTINUE <span style={{opacity:0.8}}>→ {nextStep.title}</span></> : "FINISH SESSION ✓"}
              </button>
            );
          })()}
        </div>
      </div>

      {/* Main body */}
      <div style={{flex:1,display:"flex",overflow:"hidden",position:"relative",zIndex:2}}>

        {/* Context drawer */}
        {showContextDrawer && step && (
          <div style={{position:"absolute",top:0,right:0,bottom:0,width:"360px",zIndex:10,background:"rgba(250,247,240,0.97)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",borderLeft:`1px solid ${accentColor}33`,boxShadow:"-8px 0 32px rgba(26,24,20,0.14)",display:"flex",flexDirection:"column",animation:"fadeUp 0.22s ease-out"}}>
            <div style={{padding:"20px 22px 16px 22px",borderBottom:`1px solid ${accentColor}22`,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div className="mono-font" style={{fontSize:"8px",letterSpacing:"2.5px",color:accentColor,marginBottom:"3px",fontWeight:700}}>PHASE {step.number} · CONTEXT</div>
                <div className="display-font" style={{fontSize:"18px",fontWeight:500,color:"#1A1814",lineHeight:1.2}}>{step.title}</div>
              </div>
              <button onClick={() => setShowContextDrawer(false)} style={{background:"none",border:"1px solid #D6CFB8",width:"28px",height:"28px",borderRadius:"4px",cursor:"pointer",color:"#6B655A",fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:"2px"}}>×</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"20px 22px",display:"flex",flexDirection:"column",gap:"16px"}}>
              <div>
                <div className="mono-font" style={{fontSize:"8px",letterSpacing:"2px",color:"#6B655A",marginBottom:"8px",fontWeight:600}}>CONTEXT</div>
                <p style={{fontSize:"13px",lineHeight:1.7,color:"#1A1814",margin:0}}>{step.situation}</p>
              </div>
              {step.deliverables && step.deliverables.length > 0 && (
                <div style={{borderTop:`1px solid ${accentColor}22`,paddingTop:"16px"}}>
                  <div className="mono-font" style={{fontSize:"8px",letterSpacing:"2px",color:"#6B655A",marginBottom:"10px",fontWeight:600}}>TYPICAL DELIVERABLES</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                    {step.deliverables.map((d,i) => (
                      <div key={i} style={{display:"flex",gap:"8px",alignItems:"center"}}>
                        <div style={{width:"4px",height:"4px",borderRadius:"50%",background:accentColor,flexShrink:0}}/>
                        <span style={{fontSize:"12px",fontWeight:600,color:"#1A1814"}}>{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{borderTop:`1px solid ${accentColor}22`,paddingTop:"16px"}}>
                <div className="mono-font" style={{fontSize:"8px",letterSpacing:"2px",color:"#6B655A",marginBottom:"10px",fontWeight:600}}>THE ASK</div>
                {[["1","SAVE TIME","Where does AI save us significant time in this phase — and what does it actually look like?",false],["2","WOW THE CLIENT","What could we deliver that we would previously have said was out of scope or too expensive?",true]].map(([num,label,q,isColor]) => (
                  <div key={num} style={{display:"flex",gap:"10px",alignItems:"flex-start",marginBottom:"10px"}}>
                    <div style={{width:"18px",height:"18px",borderRadius:"50%",background:isColor?accentColor:"#1A1814",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:"1px"}}>
                      <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:"7px",fontWeight:700,color:"#F5EFE3"}}>{num}</span>
                    </div>
                    <div>
                      <div className="mono-font" style={{fontSize:"7px",letterSpacing:"1.5px",color:isColor?accentColor:"#6B655A",marginBottom:"2px"}}>{label}</div>
                      <p className="display-font" style={{fontSize:"12px",fontWeight:500,lineHeight:1.4,margin:0,color:"#1A1814"}}>{q}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{borderTop:`1px solid ${accentColor}22`,paddingTop:"16px"}}>
                <div className="mono-font" style={{fontSize:"8px",letterSpacing:"2px",color:"#6B655A",marginBottom:"10px",fontWeight:600}}>MATERIALS & DATA</div>
                <button onClick={() => { if(step.downloadFn==="phase1")downloadPhase1Excel(); if(step.downloadFn==="phase2")downloadPhase2Excel(); if(step.downloadFn==="phase3")downloadPhase3Excel(); if(step.downloadFn==="phase4")downloadPhase4Excel(); }} style={{width:"100%",padding:"11px 16px",background:accentColor,color:"#F5EFE3",border:"none",borderRadius:"7px",fontFamily:"JetBrains Mono, monospace",fontSize:"10px",letterSpacing:"1.5px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.88"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>↓ {step.dataLabel}</button>
              </div>
            </div>
          </div>
        )}

        {/* Content panel */}
        <div style={{flex:1,display:"flex",flexDirection:"column",padding:"24px 32px",overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
            <div className="mono-font" style={{fontSize:"9px",letterSpacing:"2px",color:"#6B655A"}}>PRIORITISED BOARD</div>
            <div style={{display:"flex",alignItems:"center",gap:"8px",background:"rgba(255,253,248,0.85)",border:"1px solid rgba(200,151,58,0.35)",borderRadius:"20px",padding:"5px 12px",backdropFilter:"blur(8px)"}}>
              <span style={{fontSize:"11px",color:"#C8973A"}}>★</span>
              <span style={{fontSize:"10px",color:"#6B655A",lineHeight:1.35}}>Star up to 3 ideas you'd prioritise developing first</span>
            </div>
          </div>

          {/* Two-column row */}
          <div style={{flex:1,display:"flex",gap:"16px",minHeight:0}}>

            {/* LEFT — Idea pool */}
            <div style={{width:"480px",flexShrink:0,display:"flex",flexDirection:"column",background:"rgba(255,253,248,0.50)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",border:`1px solid ${accentColor}44`,borderRadius:"12px",padding:"16px 14px",overflow:"hidden",marginBottom:"32px",position:"relative"}}>
              {floatingToast && (
                <div style={{position:"absolute",top:"60px",left:"50%",transform:"translateX(-50%)",pointerEvents:"none",zIndex:20,animation:"floatUp 0.85s ease-out forwards",fontSize:"18px",fontWeight:700,color:accentColor,whiteSpace:"nowrap",textShadow:"0 2px 8px rgba(26,24,20,0.15)",fontFamily:"JetBrains Mono, monospace"}}>+1 💡</div>
              )}
              <div className="mono-font" style={{fontSize:"9px",letterSpacing:"2px",color:"#6B655A",marginBottom:"4px"}}>IDEA POOL</div>
              <div style={{fontSize:"12px",color:"#9A9590",marginBottom:"14px",lineHeight:1.4}}>Drag ideas onto the board to prioritise them</div>
              {!showAddForm ? (
                <button onClick={() => setShowAddForm(true)} style={{padding:"11px 0",background:accentColor,color:"#F5EFE3",border:"none",borderRadius:"7px",fontFamily:"JetBrains Mono, monospace",fontSize:"10px",letterSpacing:"1.5px",fontWeight:700,cursor:"pointer",marginBottom:"16px",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>⊕ ADD NEW IDEA</button>
              ) : (
                <div style={{background:"rgba(255,253,248,0.95)",border:`1.5px solid ${accentColor}66`,borderRadius:"10px",padding:"14px",marginBottom:"16px",display:"flex",flexDirection:"column",gap:"10px"}}>
                  <div>
                    <div className="mono-font" style={{fontSize:"8px",letterSpacing:"2px",color:"#6B655A",marginBottom:"5px"}}>HEADLINE *</div>
                    <input autoFocus value={addHeadline} onChange={e=>setAddHeadline(e.target.value)} onKeyDown={e=>e.key==="Enter"&&matrixAddIdea(sid)} placeholder="Short name for this idea…" style={{width:"100%",background:"#FAF6ED",border:"1px solid #D6CFB8",borderRadius:"5px",padding:"8px 10px",fontSize:"12px",color:"#1A1814",fontFamily:"Inter, sans-serif",outline:"none",boxSizing:"border-box"}}/>
                  </div>
                  <div>
                    <div className="mono-font" style={{fontSize:"8px",letterSpacing:"2px",color:"#6B655A",marginBottom:"5px"}}>DESCRIPTION (optional)</div>
                    <textarea value={addDesc} onChange={e=>setAddDesc(e.target.value)} placeholder="Describe the tool, process, or output…" style={{width:"100%",background:"#FAF6ED",border:"1px solid #D6CFB8",borderRadius:"5px",padding:"8px 10px",fontSize:"12px",color:"#1A1814",fontFamily:"Inter, sans-serif",outline:"none",resize:"none",minHeight:"64px",boxSizing:"border-box"}}/>
                  </div>
                  <div style={{display:"flex",gap:"8px"}}>
                    <button onClick={()=>matrixAddIdea(sid)} style={{flex:1,padding:"8px 0",background:accentColor,color:"#F5EFE3",border:"none",borderRadius:"5px",fontFamily:"JetBrains Mono, monospace",fontSize:"10px",letterSpacing:"1px",fontWeight:700,cursor:"pointer"}}>ADD IDEA</button>
                    <button onClick={()=>{setShowAddForm(false);setAddHeadline("");setAddDesc("");}} style={{padding:"8px 12px",background:"none",border:"1px solid #D6CFB8",borderRadius:"5px",fontFamily:"JetBrains Mono, monospace",fontSize:"10px",cursor:"pointer",color:"#6B655A"}}>CANCEL</button>
                  </div>
                </div>
              )}
              <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:"8px",minHeight:0}}>
                {m.pool.length === 0 && <div style={{fontSize:"12px",color:"#C4BFBA",fontStyle:"italic",lineHeight:1.6,marginTop:"8px"}}>No ideas yet. Add one above.</div>}
                {m.pool.map(card => (
                  <div key={card.id} draggable onDragStart={()=>setMatrixDragging({id:card.id,from:"pool"})} onDragEnd={()=>setMatrixDragging(null)} style={{background:"rgba(255,253,248,0.95)",border:`1px solid ${accentColor}44`,borderRadius:"8px",padding:"10px 12px",cursor:"grab",userSelect:"none",boxShadow:"0 2px 8px rgba(26,24,20,0.08)",display:"flex",alignItems:"flex-start",gap:"10px",flexShrink:0}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"12px",fontWeight:600,color:"#1A1814",lineHeight:1.3,marginBottom:"3px"}}>{card.headline}</div>
                      {card.desc && <div style={{fontSize:"11px",color:"#6B655A",lineHeight:1.4}}>{card.desc}</div>}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px",flexShrink:0}}>
                      <button onClick={()=>matrixRemoveFromPool(sid,card.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#C4BFBA",fontSize:"16px",padding:"0",lineHeight:1}}>×</button>
                      <span style={{color:"#C4BFBA",fontSize:"12px"}}>⠿</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Matrix */}
            <div style={{flex:1,position:"relative",minHeight:0}}>
              <div style={{position:"absolute",top:0,bottom:"32px",left:0,width:"28px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div className="mono-font" style={{fontSize:"11px",letterSpacing:"3px",color:"#1A1814",fontWeight:700,writingMode:"vertical-rl",transform:"rotate(180deg)"}}>IMPACT</div>
              </div>
              <div style={{position:"absolute",bottom:0,left:"28px",right:0,height:"28px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div className="mono-font" style={{fontSize:"11px",letterSpacing:"3px",color:"#1A1814",fontWeight:700}}>FEASIBILITY</div>
              </div>
              <div ref={matrixRef} onDragOver={e=>e.preventDefault()} onDrop={e=>matrixHandleDrop(e,sid)} style={{position:"absolute",top:0,left:"28px",right:0,bottom:"32px",background:"rgba(255,253,248,0.50)",border:`1px solid ${accentColor}44`,borderRadius:"12px",backgroundImage:`linear-gradient(rgba(214,207,184,0.18) 1px,transparent 1px),linear-gradient(90deg,rgba(214,207,184,0.18) 1px,transparent 1px)`,backgroundSize:"25% 25%",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)"}}>
                {[["High","top","left"],["Low","bottom","left"],["High","bottom","right"]].map(([label,v,h]) => (
                  <div key={label+v+h} style={{position:"absolute",[v]:"8px",[h]:"12px",fontSize:"9px",color:"rgba(107,98,88,0.4)",fontFamily:"JetBrains Mono,monospace",letterSpacing:"1px",pointerEvents:"none"}}>{label}</div>
                ))}
                {[...m.placed].sort((a,b)=>(a.starred?1:0)-(b.starred?1:0)).map(card => {
                  const isStarred = !!card.starred;
                  const starredCount = m.placed.filter(c=>c.starred).length;
                  const canStar = isStarred || starredCount < 3;
                  return (
                    <div key={card.id} draggable onDragStart={()=>setMatrixDragging({id:card.id,from:"matrix"})} onDragEnd={()=>setMatrixDragging(null)} onMouseEnter={()=>setHoverCardId(card.id)} onMouseLeave={()=>setHoverCardId(null)} style={{position:"absolute",left:`calc(${card.ix*100}% - 64px)`,top:`calc(${(1-card.iy)*100}% - 30px)`,width:"128px",background:isStarred?"rgba(255,251,235,0.99)":"rgba(255,253,248,0.97)",border:isStarred?"1.5px solid #C8973A":`1.5px solid ${accentColor}77`,borderRadius:"10px",padding:isStarred?"7px 10px 8px 10px":"8px 10px",boxShadow:isStarred?"0 6px 28px rgba(200,151,58,0.28),0 2px 8px rgba(26,24,20,0.12)":"0 3px 14px rgba(26,24,20,0.10)",cursor:"grab",userSelect:"none",zIndex:isStarred?4:2,transform:isStarred?"translateY(-2px)":"none",transition:"box-shadow 0.2s,border-color 0.2s",animation:snappingCard===card.id?"snapIn 0.38s cubic-bezier(0.36,0.07,0.19,0.97)":"none"}}>
                      <button onClick={e=>{e.stopPropagation();matrixToggleStar(sid,card.id);}} title={isStarred?"Remove star":canStar?"Star this idea":"Max 3 stars reached"} style={{position:"absolute",top:"5px",right:"6px",background:"none",border:"none",cursor:canStar?"pointer":"not-allowed",fontSize:"14px",lineHeight:1,padding:0,color:isStarred?"#C8973A":"#D6CFB8",opacity:!canStar?0.4:1,transition:"color 0.15s,transform 0.15s",transform:isStarred?"scale(1.1)":"scale(1)"}}>{isStarred?"★":"☆"}</button>
                      {isStarred && <div className="mono-font" style={{fontSize:"7px",letterSpacing:"1.5px",color:"#C8973A",marginBottom:"4px",fontWeight:700}}>TOP PICK</div>}
                      <div style={{fontSize:"11px",fontWeight:600,color:"#1A1814",lineHeight:1.3,marginBottom:"4px",paddingRight:"16px"}}>{card.headline}</div>
                      {hoverCardId===card.id&&card.desc&&(
                        <div style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",background:"#1A1814",color:"#F5EFE3",borderRadius:"6px",padding:"8px 12px",fontSize:"11px",lineHeight:1.5,width:"210px",zIndex:10,boxShadow:"0 4px 16px rgba(26,24,20,0.24)",pointerEvents:"none",whiteSpace:"normal"}}>
                          {card.desc}
                          <div style={{position:"absolute",bottom:"-5px",left:"50%",transform:"translateX(-50%)",width:"10px",height:"10px",background:"#1A1814",clipPath:"polygon(0 0,100% 0,50% 100%)"}}/>
                        </div>
                      )}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"2px"}}>
                        <span style={{fontSize:"10px",color:isStarred?"#C8973A66":"#C4BFBA"}}>⠿</span>
                        <button onClick={e=>{e.stopPropagation();matrixRemoveFromPlaced(sid,card.id);}} style={{background:"none",border:"none",cursor:"pointer",color:"#C4BFBA",fontSize:"14px",padding:"0",lineHeight:1}} title="Return to pool">×</button>
                      </div>
                    </div>
                  );
                })}
                {m.placed.length===0&&(
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
                    <div style={{textAlign:"center",opacity:0.35}}>
                      <div style={{fontSize:"32px",marginBottom:"8px"}}>⠿</div>
                      <div style={{fontSize:"13px",color:"#6B655A",fontFamily:"Inter,sans-serif",lineHeight:1.5}}>Drag cards from the pool<br/>to prioritise them here</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
