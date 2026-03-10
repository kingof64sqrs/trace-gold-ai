import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, Shield, DollarSign, Brain, Play } from "lucide-react";

const quickAccess = [
  "CME Globex MDP 3.0 Feed",
  "SOFR Futures Settlement",
  "CFTC Part 17 Report",
  "Market Data Revenue",
  "Google Cloud Clearing Pipeline",
  "Snowflake Data Warehouse",
];

interface ImpactNode {
  label: string;
  type: "regulatory" | "revenue" | "customer" | "analytics";
  ring: number;
}

const impactData: Record<string, { total: number; regReports: number; revAtRisk: string; timeToImpact: string; nodes: ImpactNode[] }> = {
  "CME Globex MDP 3.0 Feed": {
    total: 247,
    regReports: 4,
    revAtRisk: "$4.2B daily clearing revenue",
    timeToImpact: "< 15 minutes",
    nodes: [
      { label: "Trade Matching Engine", type: "analytics", ring: 1 },
      { label: "Market Data Normalization", type: "analytics", ring: 1 },
      { label: "Smart Stream on GCP", type: "analytics", ring: 1 },
      { label: "FedWatch API", type: "customer", ring: 1 },
      { label: "Settlement Prices", type: "revenue", ring: 2 },
      { label: "Position Reports", type: "regulatory", ring: 2 },
      { label: "CFTC Part 17", type: "regulatory", ring: 2 },
      { label: "Market Data Revenue ($710M)", type: "revenue", ring: 2 },
      { label: "CME DataMine", type: "customer", ring: 3 },
      { label: "Google Cloud Platform", type: "analytics", ring: 3 },
      { label: "Clearing Revenue ($4.99B)", type: "revenue", ring: 3 },
      { label: "FCM Seg Report", type: "regulatory", ring: 4 },
      { label: "Total Revenue ($6.13B)", type: "revenue", ring: 4 },
      { label: "Snowflake Analytics", type: "analytics", ring: 3 },
    ],
  },
};

// Default fallback for other assets
const defaultImpact = {
  total: 89,
  regReports: 2,
  revAtRisk: "$710M market data revenue",
  timeToImpact: "< 30 minutes",
  nodes: [
    { label: "Data Normalization", type: "analytics" as const, ring: 1 },
    { label: "Settlement Engine", type: "revenue" as const, ring: 1 },
    { label: "CFTC Part 17", type: "regulatory" as const, ring: 2 },
    { label: "Market Data Revenue", type: "revenue" as const, ring: 2 },
    { label: "DataMine Export", type: "customer" as const, ring: 3 },
  ],
};

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  regulatory: { bg: "bg-cme-gold/20", text: "text-cme-gold", border: "border-cme-gold/30" },
  revenue: { bg: "bg-cme-red/20", text: "text-cme-red", border: "border-cme-red/30" },
  customer: { bg: "bg-cme-amber/20", text: "text-cme-amber", border: "border-cme-amber/30" },
  analytics: { bg: "bg-cme-blue/20", text: "text-cme-blue", border: "border-cme-blue/30" },
};

const scenarios = ["Schema Version Change", "Feed Latency Spike", "Pipeline Downtime", "Google Cloud Migration Cutover"];

const ImpactConsolePage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [simulationActive, setSimulationActive] = useState(false);

  const impact = selected ? (impactData[selected] || defaultImpact) : null;

  return (
    <div className="h-full flex flex-col animate-fade-in p-6">
      {/* Search */}
      <div className="mb-4">
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-3 max-w-2xl">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search any CME data asset, pipeline, or report..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {quickAccess.map((item) => (
            <button
              key={item}
              onClick={() => setSelected(item)}
              className={`text-[10px] px-3 py-1.5 rounded border font-mono transition-colors ${
                selected === item
                  ? "bg-cme-blue/20 text-cme-blue border-cme-blue/30"
                  : "bg-card text-muted-foreground border-border hover:text-secondary-foreground hover:bg-secondary/50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && impact && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex-1 flex gap-6 overflow-hidden"
          >
            {/* Radial Impact Visualization */}
            <div className="flex-1 relative flex items-center justify-center">
              {/* Rings */}
              {[1, 2, 3, 4].map((ring) => (
                <div
                  key={ring}
                  className="absolute rounded-full border border-border/30"
                  style={{ width: ring * 160, height: ring * 160 }}
                />
              ))}

              {/* Center node */}
              <div className="absolute z-10 bg-cme-blue/20 border-2 border-cme-blue rounded-lg px-3 py-2 glow-blue">
                <span className="text-[10px] font-mono font-semibold text-cme-blue">{selected}</span>
              </div>

              {/* Impact nodes */}
              {impact.nodes.map((node, i) => {
                const angle = (i / impact.nodes.length) * Math.PI * 2 - Math.PI / 2;
                const radius = node.ring * 80;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const tc = typeColors[node.type];

                return (
                  <motion.div
                    key={node.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: simulationActive ? (node.ring <= 2 ? 1 : 0.5) : 1,
                      scale: 1,
                      ...(simulationActive ? {
                        boxShadow: node.type === "regulatory" || node.type === "revenue"
                          ? "0 0 12px 2px hsl(0 84% 60% / 0.3)"
                          : "0 0 8px 2px hsl(38 92% 50% / 0.2)"
                      } : {}),
                    }}
                    transition={{ delay: simulationActive ? node.ring * 0.3 : i * 0.05 }}
                    className={`absolute ${tc.bg} border ${tc.border} rounded px-2 py-1 z-10`}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                  >
                    <span className={`text-[8px] font-mono font-medium ${tc.text} whitespace-nowrap`}>{node.label}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Impact Summary */}
            <div className="w-80 space-y-4 overflow-y-auto">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Impact Summary</h3>
                <div className="space-y-3">
                  {[
                    { icon: Zap, label: "Total assets in blast radius", value: String(impact.total), color: "text-cme-blue" },
                    { icon: Shield, label: "Regulatory reports affected", value: String(impact.regReports), color: "text-cme-gold" },
                    { icon: DollarSign, label: "Revenue at risk", value: impact.revAtRisk, color: "text-cme-red" },
                    { icon: Zap, label: "Time to impact", value: impact.timeToImpact, color: "text-cme-amber" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-2">
                      <item.icon className={`w-3.5 h-3.5 mt-0.5 ${item.color}`} />
                      <div>
                        <div className="text-[10px] text-muted-foreground">{item.label}</div>
                        <div className={`text-[11px] font-mono font-semibold ${item.color}`}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="border border-cme-purple/30 rounded-lg p-4 bg-cme-purple/5">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-cme-purple" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-cme-purple">AI Recommendation</span>
                </div>
                <p className="text-[10px] text-secondary-foreground leading-relaxed">
                  A disruption to {selected} would affect {impact.total} downstream assets across {impact.regReports} regulatory report types and an estimated {impact.revAtRisk} in attribution. CME Group's disaster recovery supports a 15-minute RTO for this feed. Before any schema change or maintenance window, 12 critical downstream assets require snapshot freezing.
                </p>
              </div>

              {/* Scenario Simulation */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Run Scenario</h3>
                <div className="space-y-1.5">
                  {scenarios.map((scenario) => (
                    <button
                      key={scenario}
                      onClick={() => { setSimulationActive(true); setTimeout(() => setSimulationActive(false), 3000); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-medium bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                    >
                      <Play className="w-3 h-3 text-cme-amber" />
                      {scenario}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Regulatory", color: "bg-cme-gold" },
                    { label: "Revenue", color: "bg-cme-red" },
                    { label: "Customer-facing", color: "bg-cme-amber" },
                    { label: "Internal Analytics", color: "bg-cme-blue" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-[9px] text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Zap className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Select a data asset above to analyze its impact radius</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpactConsolePage;
