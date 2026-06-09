function CaseModal({ showCase, setShowCase }) {
  if (!showCase) return null;
  return (
    <div className="modal-backdrop case-modal-backdrop no-print" onClick={() => setShowCase(false)}>
      <div className="modal-content case-modal-content" onClick={e => e.stopPropagation()}>
        <button type="button" className="case-modal-close" onClick={() => setShowCase(false)} aria-label="Close case">×</button>
        <div className="mono-font case-modal-label">THE CASE</div>
        <h2 className="display-font case-modal-title">NordicFoods Group</h2>
        <div className="display-font case-modal-subtitle">Network 2030</div>
        <div className="case-modal-body">
          <p>NordicFoods is a fictional Nordic food manufacturer with €1.2B revenue, 4 production sites in Denmark, Sweden, Norway, and Poland. Two years after acquiring Polaris Food Group (Gdansk) for €183M, the combined footprint is sub-optimal: overlapping portfolios, mismatched capacity, and a site still running at 54% utilisation.</p>
          <p>Three pressures land at once: EBIT has fallen from €124M to €75M in two years, DACH logistics costs are eroding the growth margin, and the board is pushing for clarity on capital allocation. The CEO has publicly committed to a Network 2030 programme.</p>
          <div className="case-modal-ask">
            <div className="mono-font case-modal-ask-label">THE ASK:</div>
            <ul className="case-modal-ask-list">
              {[
                "Which sites do what?",
                "What do we keep/close/expand?",
                "Make vs outsource?",
                "How to phase the transition?"
              ].map((item) => (
                <li key={item} className="case-modal-ask-item">
                  <span className="case-modal-bullet"/>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="case-modal-stats">
            {[["Revenue","€1.2B"],["Sites","DK · SE · NO · PL"],["EBIT trend","€124M → €75M"],["Engagement","10 weeks"]].map(([l,v]) => (
              <div key={l} className="case-modal-stat">
                <div className="mono-font case-modal-stat-label">{l.toUpperCase()}</div>
                <div className="display-font case-modal-stat-value">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
