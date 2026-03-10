import { motion } from "framer-motion";
import { X, ArrowUpRight, ArrowDownRight, Shield, Brain, Flag, FileText, Zap } from "lucide-react";

interface AssetInspectorProps {
  nodeId: string;
  node: { label: string; tier: string };
  onClose: () => void;
}

const tierLabels: Record<string, string> = {
  source: "Source Feed",
  processing: "Transformation",
  regulatory: "Regulatory Report",
  financial: "Revenue Output",
  analytics: "Analytics Asset",
};

const tierSystems: Record<string, string> = {
  source: "CME Globex | MDP 3.0",
  processing: "CME Clearing | Core Engine",
  regulatory: "CFTC Reporting | Compliance",
  financial: "Finance ERP | Revenue",
  analytics: "CME DataMine | Analytics",
};

const AssetInspector = ({ nodeId, node, onClose }: AssetInspectorProps) => (
  <motion.div
    initial={{ x: 400 }}
    animate={{ x: 0 }}
    exit={{ x: 400 }}
    className="absolute right-0 top-0 bottom-0 w-80 bg-card border-l border-border overflow-y-auto z-20"
  >
    <div className="p-4 border-b border-border">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{node.label}</h3>
          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{tierSystems[node.tier]}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-[9px] px-2 py-0.5 rounded bg-cme-blue/20 text-cme-blue border border-cme-blue/20">{tierLabels[node.tier]}</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-cme-emerald/20 text-cme-emerald">Healthy</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-secondary rounded"><X className="w-4 h-4 text-muted-foreground" /></button>
      </div>
    </div>

    <div className="p-4 space-y-4">
      {/* Details */}
      <section>
        <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Asset Details</h4>
        <div className="space-y-1.5 text-[11px]">
          {[
            ["Data Owner", "Clearing Risk Analytics"],
            ["Update Frequency", "Real-time (sub-second)"],
            ["Format", "FIX 5.0 SP2 / Protobuf"],
            ["Version", "v13.2.1"],
            ["GCP Status", "Migration in progress (68%)"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-muted-foreground">{k}</span>
              <span className="text-secondary-foreground font-mono text-[10px]">{v}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Upstream */}
      <section>
        <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2 flex items-center gap-1">
          <ArrowUpRight className="w-3 h-3" /> Upstream Dependencies
        </h4>
        <div className="space-y-1">
          {["CME Globex MDP 3.0", "Market Participant Reports", "Snowflake Raw Data Lake"].map((item) => (
            <div key={item} className="text-[10px] px-2 py-1 rounded bg-secondary text-secondary-foreground font-mono cursor-pointer hover:bg-secondary/80">{item}</div>
          ))}
        </div>
      </section>

      {/* Downstream */}
      <section>
        <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2 flex items-center gap-1">
          <ArrowDownRight className="w-3 h-3" /> Downstream Consumers <span className="text-cme-amber">(23)</span>
        </h4>
        <div className="space-y-1">
          {["CFTC Part 17 Report", "Settlement Price Engine", "FCM Segregation Report"].map((item) => (
            <div key={item} className="text-[10px] px-2 py-1 rounded bg-secondary text-secondary-foreground font-mono cursor-pointer hover:bg-secondary/80">{item}</div>
          ))}
        </div>
      </section>

      {/* Regulatory */}
      <section>
        <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2 flex items-center gap-1">
          <Shield className="w-3 h-3" /> Regulatory Coverage
        </h4>
        <div className="flex flex-wrap gap-1">
          {["CFTC Part 17", "CFTC Part 39", "Dodd-Frank Title VIII"].map((reg) => (
            <span key={reg} className="text-[9px] px-2 py-0.5 rounded bg-cme-gold/10 text-cme-gold border border-cme-gold/20">{reg}</span>
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* AI Commentary */}
      <section className="border border-cme-purple/30 rounded p-3 bg-cme-purple/5">
        <h4 className="text-[10px] uppercase tracking-wider font-semibold text-cme-purple mb-2 flex items-center gap-1">
          <Brain className="w-3 h-3" /> AI Commentary
        </h4>
        <p className="text-[10px] text-secondary-foreground leading-relaxed">
          This asset is a critical node in CME Group's data infrastructure. It feeds 23 downstream consumers including 3 CFTC-mandated regulatory reports. Any disruption would affect same-day position reporting and revenue attribution. Current health status is nominal with no detected anomalies.
        </p>
      </section>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: "Trace to Revenue", icon: Zap },
          { label: "Trace to CFTC", icon: Shield },
          { label: "Impact Analysis", icon: ArrowDownRight },
          { label: "Ask AI Agent", icon: Brain },
          { label: "Flag for Review", icon: Flag },
          { label: "Add to Audit", icon: FileText },
        ].map((action) => (
          <button key={action.label} className="flex items-center gap-1 px-2 py-1.5 text-[9px] font-medium bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
            <action.icon className="w-3 h-3" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  </motion.div>
);

export default AssetInspector;
