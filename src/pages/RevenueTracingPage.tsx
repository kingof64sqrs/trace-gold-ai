import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronDown, DollarSign, ArrowRight, Brain, Search } from "lucide-react";

interface RevenueNode {
  label: string;
  value?: string;
  children?: RevenueNode[];
}

const revenueTree: RevenueNode[] = [
  { label: "Total Revenue", value: "$6.13B", children: [
    { label: "Clearing & Transaction Fees", value: "$4.99B", children: [
      { label: "Interest Rates", value: "$2.01B", children: [
        { label: "Treasury Futures" },
        { label: "SOFR Futures" },
        { label: "Eurodollar Legacy" },
      ]},
      { label: "Equity Index", value: "$1.12B", children: [
        { label: "E-mini S&P 500" },
        { label: "Micro E-mini Nasdaq" },
        { label: "Russell 2000" },
      ]},
      { label: "Energy", value: "$0.89B", children: [
        { label: "WTI Crude Oil" },
        { label: "Natural Gas (Henry Hub)" },
      ]},
      { label: "Agricultural", value: "$0.42B", children: [
        { label: "Corn" },
        { label: "Wheat" },
        { label: "Soybean" },
      ]},
      { label: "FX (EBS-sourced)", value: "$0.28B" },
      { label: "Metals (COMEX)", value: "$0.19B", children: [
        { label: "Gold" },
        { label: "Silver" },
        { label: "Copper" },
      ]},
      { label: "Cryptocurrency", value: "$0.08B", children: [
        { label: "Bitcoin Futures" },
        { label: "Ether Futures" },
      ]},
    ]},
    { label: "Other Revenue", value: "$1.14B", children: [
      { label: "Market Data", value: "$710M" },
      { label: "BrokerTec Revenue", value: "$180M" },
      { label: "Optimization Services", value: "$150M" },
      { label: "Other", value: "$100M" },
    ]},
  ]},
];

const lineageFlowExample = [
  { label: "Rate Futures Trade Execution", system: "CME Globex", color: "text-cme-blue" },
  { label: "Globex Matching Engine", system: "Processing", color: "text-cme-teal" },
  { label: "CME Clearing Novation", system: "CME Clearing", color: "text-cme-teal" },
  { label: "Rate Per Contract Calc", system: "Fee Engine", color: "text-cme-teal" },
  { label: "Fee Aggregation", system: "Finance", color: "text-cme-gold" },
  { label: "Finance ERP", system: "Revenue", color: "text-cme-gold" },
  { label: "Revenue Recognition", system: "Output", color: "text-cme-gold" },
  { label: "$2.01B — Income Statement", system: "Financial", color: "text-cme-gold" },
];

const TreeBranch = ({ node, depth = 0, onSelect }: { node: RevenueNode; depth?: number; onSelect: (label: string) => void }) => {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <button
        onClick={() => { hasChildren ? setOpen(!open) : onSelect(node.label); onSelect(node.label); }}
        className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] hover:bg-secondary/50 rounded transition-colors"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren ? (
          open ? <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
        ) : (
          <DollarSign className="w-3 h-3 text-cme-gold shrink-0" />
        )}
        <span className="text-secondary-foreground">{node.label}</span>
        {node.value && <span className="ml-auto font-mono text-[10px] text-cme-gold">{node.value}</span>}
      </button>
      {open && hasChildren && node.children!.map((child, i) => (
        <TreeBranch key={i} node={child} depth={depth + 1} onSelect={onSelect} />
      ))}
    </div>
  );
};

const RevenueTracingPage = () => {
  const [selected, setSelected] = useState("Interest Rates");

  return (
    <div className="h-full flex animate-fade-in">
      {/* Left: Revenue Tree */}
      <div className="w-80 border-r border-border bg-card overflow-y-auto">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 bg-secondary rounded px-2 py-1.5">
            <Search className="w-3 h-3 text-muted-foreground" />
            <input className="bg-transparent text-[11px] text-foreground outline-none flex-1 placeholder:text-muted-foreground" placeholder="Search revenue line..." />
          </div>
          <div className="flex gap-1 mt-2">
            {["FY2024", "Q4 2024", "FY2025E"].map((period) => (
              <button key={period} className={`text-[9px] px-2 py-0.5 rounded font-mono ${period === "FY2024" ? "bg-cme-blue/20 text-cme-blue border border-cme-blue/20" : "text-muted-foreground hover:bg-secondary"}`}>
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="py-1">
          {revenueTree.map((node, i) => (
            <TreeBranch key={i} node={node} onSelect={setSelected} />
          ))}
        </div>
      </div>

      {/* Right: Lineage Flow */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-sm font-semibold text-foreground mb-1">Revenue Lineage: <span className="text-cme-gold">{selected}</span></h2>
        <p className="text-[10px] text-muted-foreground mb-6">Tracing from source trade event to revenue recognition on income statement</p>

        {/* Flow */}
        <div className="space-y-1">
          {lineageFlowExample.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 flex flex-col items-center">
                <div className={`w-2.5 h-2.5 rounded-full border-2 ${i === lineageFlowExample.length - 1 ? "border-cme-gold bg-cme-gold/30 glow-gold" : "border-cme-blue bg-cme-blue/20"}`} />
                {i < lineageFlowExample.length - 1 && <div className="w-px h-6 bg-border" />}
              </div>
              <div className="flex-1 bg-card border border-border rounded px-3 py-2 flex items-center justify-between">
                <div>
                  <span className={`text-[11px] font-medium ${step.color}`}>{step.label}</span>
                  <span className="text-[9px] text-muted-foreground ml-2 font-mono">{step.system}</span>
                </div>
                {i < lineageFlowExample.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Commentary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 border border-cme-purple/30 rounded-lg p-4 bg-cme-purple/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-cme-purple" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-cme-purple">AI Revenue Intelligence</span>
          </div>
          <p className="text-[11px] text-secondary-foreground leading-relaxed">
            Interest rate revenue is the largest contributor at approximately 40% of total clearing fees ($2.01B). The primary upstream dependency is the CME Globex MDP 3.0 rate feed, which feeds the SOFR and Treasury matching engines. Schema version 13, deployed in late 2023, introduced a new field for cross-margining efficiency that now flows into 6 downstream revenue attribution calculations. Any disruption to this feed would affect same-day revenue reporting. Snowflake data warehouse provides cross-platform validation for these revenue calculations.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RevenueTracingPage;
