import { motion } from "framer-motion";
import { Database, Shield, AlertTriangle, Cloud, Clock, ArrowRight } from "lucide-react";

const kpis = [
  { label: "Total Mapped Data Assets", value: "4,847", note: "across 9 source systems", icon: Database, color: "text-cme-blue", glow: "glow-blue" },
  { label: "CFTC-Reportable Lineage Chains", value: "312", note: "Part 17 + Part 16 coverage", icon: Shield, color: "text-cme-gold", glow: "glow-gold" },
  { label: "Active Anomalies", value: "7", note: "requires review before T+1 close", icon: AlertTriangle, color: "text-cme-amber", glow: "glow-amber" },
  { label: "Google Cloud Migration", value: "68%", note: "Clearing systems in flight", icon: Cloud, color: "text-cme-emerald", glow: "glow-emerald", isProgress: true },
  { label: "Last Full Audit Scan", value: "14 min ago", note: "All systems healthy", icon: Clock, color: "text-cme-emerald", glow: "glow-emerald", isBadge: true },
];

const activityFeed = [
  { time: "14:23 CT", text: "Settlement Price for E-mini S&P 500 (ES) propagated to 23 downstream reports", type: "blue" },
  { time: "14:18 CT", text: "CFTC Part 17 position report validated — 6,412 records traced", type: "gold" },
  { time: "14:12 CT", text: "BrokerTec U.S. Treasury repo rate feed: schema version bump detected", type: "amber" },
  { time: "14:05 CT", text: "Google Cloud unified data platform: 3 new pipeline registrations mapped", type: "emerald" },
  { time: "13:58 CT", text: "Snowflake cross-platform join validated — 12 curated datasets refreshed", type: "blue" },
  { time: "13:42 CT", text: "Interest rate ADV tracking at 38.2M contracts — revenue attribution updated", type: "gold" },
];

const topChains = [
  { from: "Globex MDP 3.0", via: "Matching Engine", to: "CFTC Part 17", queries: 847 },
  { from: "SPAN Margin", via: "Settlement Engine", to: "FCM Seg Report", queries: 623 },
  { from: "BrokerTec Repo", via: "Normalization", to: "SOFR Benchmark", queries: 512 },
  { from: "EBS FX Spot", via: "Price Engine", to: "FX Revenue", queries: 389 },
  { from: "Snowflake DW", via: "Analytics Views", to: "DataMine Export", queries: 341 },
];

const colorMap: Record<string, string> = {
  blue: "border-cme-blue bg-cme-blue/5",
  gold: "border-cme-gold bg-cme-gold/5",
  amber: "border-cme-amber bg-cme-amber/5",
  emerald: "border-cme-emerald bg-cme-emerald/5",
};

const OverviewPage = () => (
  <div className="p-6 space-y-6 animate-fade-in">
    <h1 className="text-lg font-semibold text-foreground">
      CME Group Finance Data Lineage — <span className="text-cme-blue">Live Platform Overview</span>
    </h1>

    {/* KPI Cards */}
    <div className="grid grid-cols-5 gap-3">
      {kpis.map((kpi, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`bg-card border border-border rounded-lg p-4 ${kpi.glow}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{kpi.label}</span>
          </div>
          {kpi.isProgress ? (
            <div className="mb-1">
              <span className="text-2xl font-bold text-cme-emerald font-mono">{kpi.value}</span>
              <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-cme-emerald rounded-full" style={{ width: "68%" }} />
              </div>
            </div>
          ) : kpi.isBadge ? (
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-cme-emerald/20 text-cme-emerald">{kpi.value}</span>
            </div>
          ) : (
            <span className={`text-2xl font-bold font-mono ${kpi.color}`}>{kpi.value}</span>
          )}
          <p className="text-[10px] text-muted-foreground mt-1">{kpi.note}</p>
        </motion.div>
      ))}
    </div>

    {/* Two columns */}
    <div className="grid grid-cols-2 gap-4">
      {/* Activity Feed */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Live Activity Feed</h2>
        <div className="space-y-2">
          {activityFeed.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className={`flex items-start gap-3 p-2 rounded border-l-2 ${colorMap[item.type]}`}
            >
              <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">{item.time}</span>
              <span className="text-[11px] text-secondary-foreground">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Queried Chains */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Top Queried Lineage Chains</h2>
        <div className="space-y-3">
          {topChains.map((chain, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="flex items-center gap-2"
            >
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-cme-blue/10 text-cme-blue border border-cme-blue/20">{chain.from}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-secondary text-secondary-foreground">{chain.via}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-cme-gold/10 text-cme-gold border border-cme-gold/20">{chain.to}</span>
              <span className="ml-auto text-[10px] font-mono text-muted-foreground">{chain.queries} queries</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default OverviewPage;
