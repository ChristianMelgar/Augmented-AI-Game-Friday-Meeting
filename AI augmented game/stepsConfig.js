// ─── STEPS CONFIG ────────────────────────────────────────────────────────────

const STEPS = [
  {
    id:1, number:"01", title:"Project initiation",
    lede:"Before you touch a single data point — what do you already believe is true?",
    duration:"15 min",
    color:"#8F2433", iconColor:"#FFF3D2", icon:"hyp", x:180, y:310,
    situation:"You've just won the NordicFoods engagement. The project starts in one week. Before the fact-pack begins, you need a structured view on what's probably driving the network problem — and ideally something sharp to show the client at the first steering committee.",
    timingContext:"Week 0–1 of the engagement",
    deliverables:[
      {label:"Hypothesis"},
      {label:"Impact case"},
      {label:"Case for change"},
      {label:"Project approach & scope"},
      {label:"Governance & ways of working"},
      {label:"Project plan & mobilisation"},
      {label:"Workshop & engagement setup"},
    ],
    dataLabel:"Download: Phase 1 Data Pack",
    downloadFn:"phase1"
  },
  {
    id:2, number:"02", title:"Building the fact-pack",
    lede:"Data, interviews, documents. The heavy lifting that shapes everything downstream.",
    duration:"15 min",
    color:"#274866", iconColor:"#FFF3D2", icon:"data", x:530, y:175,
    situation:"Before the team can evaluate options or make recommendations, everyone needs to be working from the same picture. The fact-pack is the shared baseline — aligning the client and steering committee on how each site performs, what it costs to serve different markets, and what the stakeholder interviews reveal. Without this foundation any recommendation will be contested. With it, the conversation moves from debating the facts to deciding what to do.",
    timingContext:"Weeks 2–5 of the engagement",
    deliverables:[
      {label:"Fact-pack"},
      {label:"Data & analysis"},
      {label:"Stakeholder & qualitative insights"},
      {label:"Benchmarking & external perspectives"},
    ],
    dataLabel:"Download: Operations Data + Interview Excerpts",
    downloadFn:"phase2"
  },
  {
    id:3, number:"03", title:"Cracking the analysis",
    lede:"Generating options, sizing value, building the recommendation the CEO will back.",
    duration:"15 min",
    color:"#2F6F5E", iconColor:"#FFF3D2", icon:"model", x:880, y:310,
    situation:"You need to evaluate network scenarios for NordicFoods. Each scenario needs to be assessed on cost-to-serve, capex, service levels, sustainability impact, and implementation risk. You have the site data from the fact-pack. You need a clear recommendation with a business case the CFO will accept.",
    timingContext:"Weeks 5–8 of the engagement",
    deliverables:[
      {label:"Design criteria"},
      {label:"Scenario definition"},
      {label:"Scenario modelling & simulation"},
      {label:"Scenario evaluation"},
      {label:"Sensitivity & risk analysis"},
      {label:"Recommendation"},
      {label:"Business case"},
      {label:"Implementation & transition plan"},
    ],
    dataLabel:"Download: Scenario Framework + Site Reference Data",
    downloadFn:"phase3"
  },
  {
    id:4, number:"04", title:"Landing it with the client",
    lede:"The steering committee is in 10 days. One stakeholder is resistant. The politics are real.",
    duration:"15 min",
    color:"#B8872F", iconColor:"#FFF3D2", icon:"rec", x:1230, y:175,
    situation:"The NordicFoods steering committee is in 10 days. The COO is broadly aligned. The CFO wants a cash flow bridge. The Head of Commercial hasn't been closely involved and may push back on service level risk. You need a pre-read, a tight narrative, and a plan for the room.",
    timingContext:"Final 2 weeks of the engagement",
    deliverables:[
      {label:"Pre-read presentation"},
      {label:"Steer-co deck"},
      {label:"Aligning stakeholders & securing approval"},
    ],
    dataLabel:"Download: Stakeholder Map",
    downloadFn:"phase4"
  }
];
