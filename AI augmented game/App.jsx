function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const [activeStep, setActiveStep] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [tab, setTab] = useState("context");
  const [showCase, setShowCase] = useState(false);
  const [showCaseTip, setShowCaseTip] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showContextDrawer, setShowContextDrawer] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const confettiRef = useRef(null);

  // Team setup state
  const [setupDone, setSetupDone] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [guideText, setGuideText] = useState("Hover over each phase to learn more about the objective and key activities.");

  // Full-screen brainstorm overlay
  const [showMatrix, setShowMatrix] = useState(false);
  const [matrixStepId, setMatrixStepId] = useState(null);

  // Priority matrix state — keyed by step id
  const [matrixData, setMatrixData] = useState(initialMatrixData);
  const [matrixDragging, setMatrixDragging] = useState(null);
  const matrixRef = useRef(null);

  // Add-idea form state
  const [addHeadline, setAddHeadline] = useState("");
  const [addDesc, setAddDesc] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [hoverCardId, setHoverCardId] = useState(null);
  const [floatingToast, setFloatingToast] = useState(null);
  const [snappingCard, setSnappingCard] = useState(null);

  const getMatrix = (stepId) => matrixData[stepId] || { pool: [], placed: [] };
  const saveMatrix = (stepId, next) => setMatrixData(prev => ({ ...prev, [stepId]: next }));

  const matrixAddIdea = (stepId) => {
    const h = addHeadline.trim();
    if (!h) return;
    const m = getMatrix(stepId);
    const newId = Date.now()+"_"+Math.random();
    saveMatrix(stepId, { ...m, pool: [...m.pool, { id: newId, headline: h, desc: addDesc.trim() }] });
    setAddHeadline(""); setAddDesc(""); setShowAddForm(false);
    const toastId = Date.now();
    setFloatingToast({ id: toastId });
    setTimeout(() => setFloatingToast(t => t?.id === toastId ? null : t), 900);
  };
  const matrixRemoveFromPool = (stepId, id) => {
    const m = getMatrix(stepId);
    saveMatrix(stepId, { ...m, pool: m.pool.filter(c => c.id !== id) });
  };
  const matrixRemoveFromPlaced = (stepId, id) => {
    const m = getMatrix(stepId);
    const card = m.placed.find(c => c.id === id);
    if (!card) return;
    const { ix, iy, ...rest } = card;
    saveMatrix(stepId, { pool: [...m.pool, rest], placed: m.placed.filter(c => c.id !== id) });
  };
  const matrixHandleDrop = (e, stepId) => {
    e.preventDefault();
    if (!matrixDragging || !matrixRef.current) return;
    const rect = matrixRef.current.getBoundingClientRect();
    const ix = Math.max(0.04, Math.min(0.96, (e.clientX - rect.left) / rect.width));
    const iy = Math.max(0.04, Math.min(0.96, 1 - (e.clientY - rect.top) / rect.height));
    const m = getMatrix(stepId);
    let snappedId = null;
    if (matrixDragging.from === "pool") {
      const card = m.pool.find(c => c.id === matrixDragging.id);
      if (!card) return;
      snappedId = card.id;
      saveMatrix(stepId, { pool: m.pool.filter(c => c.id !== matrixDragging.id), placed: [...m.placed, { ...card, ix, iy }] });
    } else {
      snappedId = matrixDragging.id;
      saveMatrix(stepId, { ...m, placed: m.placed.map(c => c.id === matrixDragging.id ? { ...c, ix, iy } : c) });
    }
    setMatrixDragging(null);
    if (snappedId) {
      setSnappingCard(snappedId);
      setTimeout(() => setSnappingCard(null), 400);
    }
  };
  const matrixToggleStar = (stepId, cardId) => {
    const m = getMatrix(stepId);
    const card = m.placed.find(c => c.id === cardId);
    if (!card) return;
    const starredCount = m.placed.filter(c => c.starred).length;
    if (!card.starred && starredCount >= 3) return;
    saveMatrix(stepId, { ...m, placed: m.placed.map(c => c.id === cardId ? { ...c, starred: !c.starred } : c) });
  };

  const handleSetupConfirm = () => {
    setTheme("dark");
    setTeamName(teamName.trim() || "Team A");
    setSetupDone(true);
    setShowCaseTip(true);
  };

  const active = activeStep !== null ? STEPS.find(s => s.id === activeStep) : null;

  const markStepDone = (stepId) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playNote = (freq, start, dur) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine"; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };
      playNote(880, 0, 0.35);
      playNote(1109, 0.1, 0.35);
      playNote(1320, 0.2, 0.5);
    } catch(e) {}
    setCompletedSteps(prev => new Set([...prev, stepId]));
    const stepIdx = STEPS.findIndex(s => s.id === stepId);
    const nextStep = stepIdx < STEPS.length - 1 ? STEPS[stepIdx + 1] : null;
    setShowMatrix(false);
    if (nextStep) {
      setActiveStep(nextStep.id);
      setTab("context");
    } else {
      setActiveStep(null);
      setShowFinish(true);
    }
  };

  const exportPlaybook = () => {
    if (isExporting) return;
    if (typeof printPlaybookExport !== "function") {
      window.alert("Export module did not load. Hard-refresh the page (Ctrl+Shift+R) and try again.");
      return;
    }
    setIsExporting(true);
    printPlaybookExport(matrixData, teamName, STEPS)
      .catch(() => window.alert("Export failed. Please try again."))
      .finally(() => setIsExporting(false));
  };

  if (!setupDone) {
    return (
      <SetupScreen
        teamName={teamName}
        setTeamName={setTeamName}
        handleSetupConfirm={handleSetupConfirm}
      />
    );
  }

  return (
    <div style={{minHeight:"100vh", background:"#F5F1E8", display:"flex", flexDirection:"column"}}>

      <TopNav
        active={active}
        setActiveStep={setActiveStep}
        showCase={showCase}
        setShowCase={setShowCase}
        showCaseTip={showCaseTip}
        setShowCaseTip={setShowCaseTip}
        completedSteps={completedSteps}
        setShowFinish={setShowFinish}
        exportPlaybook={exportPlaybook}
        isExporting={isExporting}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {!active && (
        <Gameboard
          guideText={guideText}
          hoveredStep={hoveredStep}
          setHoveredStep={setHoveredStep}
          setGuideText={setGuideText}
          setActiveStep={setActiveStep}
          setTab={setTab}
          completedSteps={completedSteps}
          getMatrix={getMatrix}
          setMatrixStepId={setMatrixStepId}
          setShowMatrix={setShowMatrix}
          hoverCardId={hoverCardId}
          setHoverCardId={setHoverCardId}
        />
      )}

      {active && (
        <PhaseDetailPage
          active={active}
          tab={tab}
          setTab={setTab}
          setActiveStep={setActiveStep}
          getMatrix={getMatrix}
          setMatrixStepId={setMatrixStepId}
          setShowMatrix={setShowMatrix}
        />
      )}

      <BrainstormOverlay
        showMatrix={showMatrix}
        matrixStepId={matrixStepId}
        getMatrix={getMatrix}
        showContextDrawer={showContextDrawer}
        setShowContextDrawer={setShowContextDrawer}
        setShowMatrix={setShowMatrix}
        markStepDone={markStepDone}
        matrixRef={matrixRef}
        matrixDragging={matrixDragging}
        setMatrixDragging={setMatrixDragging}
        matrixHandleDrop={matrixHandleDrop}
        floatingToast={floatingToast}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        addHeadline={addHeadline}
        setAddHeadline={setAddHeadline}
        addDesc={addDesc}
        setAddDesc={setAddDesc}
        matrixAddIdea={matrixAddIdea}
        matrixRemoveFromPool={matrixRemoveFromPool}
        matrixRemoveFromPlaced={matrixRemoveFromPlaced}
        matrixToggleStar={matrixToggleStar}
        hoverCardId={hoverCardId}
        setHoverCardId={setHoverCardId}
        snappingCard={snappingCard}
      />

      <FinishScreen
        showFinish={showFinish}
        setShowFinish={setShowFinish}
        getMatrix={getMatrix}
        teamName={teamName}
        confettiRef={confettiRef}
        isExporting={isExporting}
        exportPlaybook={exportPlaybook}
      />

      <CaseModal showCase={showCase} setShowCase={setShowCase} />
    </div>
  );
}
