import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Satellite, Cog, Shield, Star, Circle, AlertTriangle } from "lucide-react";
import AssetInspector from "@/components/lineage/AssetInspector";

interface NodeData {
  id: string;
  label: string;
  tier: "source" | "processing" | "regulatory" | "financial" | "analytics";
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  type: "realtime" | "compliance" | "migration" | "drift" | "broken";
}

const NODE_W = 170;
const NODE_H = 32;

const nodes: NodeData[] = [
  { id: "globex-mdp", label: "CME Globex MDP 3.0", tier: "source", x: 30, y: 40 },
  { id: "brokertec", label: "BrokerTec Fixed Income", tier: "source", x: 30, y: 110 },
  { id: "ebs", label: "EBS FX Feed", tier: "source", x: 30, y: 180 },
  { id: "clearport", label: "ClearPort OTC", tier: "source", x: 30, y: 250 },
  { id: "ext-reports", label: "Market Participant Reports", tier: "source", x: 30, y: 320 },
  { id: "snowflake", label: "Snowflake Data Warehouse", tier: "source", x: 30, y: 390 },
  { id: "matching", label: "Trade Matching Engine", tier: "processing", x: 280, y: 55 },
  { id: "span", label: "SPAN Margin Engine", tier: "processing", x: 280, y: 130 },
  { id: "settlement", label: "Settlement Price Engine", tier: "processing", x: 280, y: 205 },
  { id: "position-agg", label: "Position Aggregation", tier: "processing", x: 280, y: 280 },
  { id: "normalization", label: "Data Normalization", tier: "processing", x: 280, y: 355 },
  { id: "gcp", label: "Google Cloud Platform", tier: "processing", x: 280, y: 430 },
  { id: "cftc-17", label: "CFTC Part 17 Report", tier: "regulatory", x: 530, y: 55 },
  { id: "sdr", label: "CME SDR Repository", tier: "regulatory", x: 530, y: 130 },
  { id: "fcm-seg", label: "FCM Segregation Report", tier: "regulatory", x: 530, y: 205 },
  { id: "cm-capital", label: "Clearing Member Capital", tier: "regulatory", x: 530, y: 280 },
  { id: "clearing-rev", label: "Clearing Revenue ($4.99B)", tier: "financial", x: 780, y: 80 },
  { id: "mktdata-rev", label: "Market Data Revenue ($710M)", tier: "financial", x: 780, y: 180 },
  { id: "total-rev", label: "Total Revenue ($6.13B)", tier: "financial", x: 780, y: 280 },
  { id: "datamine", label: "CME DataMine", tier: "analytics", x: 530, y: 370 },
  { id: "fedwatch", label: "FedWatch API", tier: "analytics", x: 530, y: 440 },
];

const edges: Edge[] = [
  { from: "globex-mdp", to: "matching", type: "realtime" },
  { from: "globex-mdp", to: "normalization", type: "realtime" },
  { from: "brokertec", to: "settlement", type: "drift" },
  { from: "ebs", to: "normalization", type: "realtime" },
  { from: "clearport", to: "span", type: "realtime" },
  { from: "ext-reports", to: "position-agg", type: "realtime" },
  { from: "snowflake", to: "normalization", type: "realtime" },
  { from: "snowflake", to: "gcp", type: "migration" },
  { from: "matching", to: "span", type: "realtime" },
  { from: "matching", to: "cftc-17", type: "compliance" },
  { from: "span", to: "fcm-seg", type: "compliance" },
  { from: "span", to: "cm-capital", type: "compliance" },
  { from: "settlement", to: "clearing-rev", type: "compliance" },
  { from: "position-agg", to: "cftc-17", type: "compliance" },
  { from: "normalization", to: "mktdata-rev", type: "compliance" },
  { from: "normalization", to: "datamine", type: "realtime" },
  { from: "normalization", to: "gcp", type: "migration" },
  { from: "gcp", to: "fedwatch", type: "migration" },
  { from: "cftc-17", to: "total-rev", type: "compliance" },
  { from: "clearing-rev", to: "total-rev", type: "compliance" },
  { from: "mktdata-rev", to: "total-rev", type: "compliance" },
  { from: "sdr", to: "cm-capital", type: "compliance" },
  { from: "matching", to: "sdr", type: "compliance" },
];

const tierConfig = {
  source: { icon: Satellite, color: "bg-cme-blue/20 border-cme-blue text-cme-blue", shape: "rounded" },
  processing: { icon: Cog, color: "bg-cme-teal/20 border-cme-teal text-cme-teal", shape: "rounded-lg" },
  regulatory: { icon: Shield, color: "bg-cme-gold/20 border-cme-gold text-cme-gold animate-pulse-glow", shape: "rounded-lg" },
  financial: { icon: Star, color: "bg-cme-gold/20 border-cme-gold text-cme-gold glow-gold", shape: "rounded-full" },
  analytics: { icon: Circle, color: "bg-cme-cyan/20 border-cme-cyan text-cme-cyan", shape: "rounded-full" },
};

const edgeColors: Record<string, string> = {
  realtime: "#0891ff",
  compliance: "#d4a843",
  migration: "#10b981",
  drift: "#f59e0b",
  broken: "#ef4444",
};

const alerts = [
  { type: "amber" as const, text: "BrokerTec U.S. Treasury repo rate schema bump detected — affects 3 downstream settlement feeds." },
  { type: "red" as const, text: "CFTC Part 17 large trader report — 2 position records missing upstream linkage." },
  { type: "emerald" as const, text: "Google Cloud migration: CME Clearing margin engine pipeline registered 4 new data assets." },
];

const alertColorMap: Record<string, string> = {
  amber: "border-cme-amber bg-cme-amber/5",
  red: "border-cme-red bg-cme-red/5",
  emerald: "border-cme-emerald bg-cme-emerald/5",
};

const CANVAS_W = 980;
const CANVAS_H = 500;

const LineageMapPage = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const connectedNodes = hoveredNode
    ? new Set([
        hoveredNode,
        ...edges.filter(e => e.from === hoveredNode || e.to === hoveredNode).flatMap(e => [e.from, e.to]),
      ])
    : null;

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Context Bar */}
      <div className="h-8 bg-card/80 border-b border-border flex items-center px-4 gap-4 shrink-0">
        <span className="font-mono text-[10px] text-muted-foreground">
          Viewing: Full Enterprise Lineage | <span className="text-cme-blue">4,847 nodes</span> | 11,203 edges | Last refreshed: 14 min ago | Google Cloud migration: 68%
        </span>
      </div>

      <div className="flex-1 overflow-auto relative">
        {/* Fixed-size canvas so SVG and HTML align */}
        <div className="relative" style={{ width: CANVAS_W, height: CANVAS_H, minWidth: CANVAS_W, minHeight: CANVAS_H, margin: "16px auto" }}>
          {/* SVG edges layer */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={CANVAS_W}
            height={CANVAS_H}
          >
            <defs>
              {Object.entries(edgeColors).map(([type, color]) => (
                <marker key={type} id={`arrow-${type}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill={color} opacity="0.7" />
                </marker>
              ))}
            </defs>
            {edges.map((edge, i) => {
              const from = nodeMap.get(edge.from)!;
              const to = nodeMap.get(edge.to)!;
              const dimmed = connectedNodes && (!connectedNodes.has(edge.from) || !connectedNodes.has(edge.to));
              const x1 = from.x + NODE_W;
              const y1 = from.y + NODE_H / 2;
              const x2 = to.x;
              const y2 = to.y + NODE_H / 2;
              const cx1 = x1 + (x2 - x1) * 0.4;
              const cx2 = x1 + (x2 - x1) * 0.6;
              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke={edgeColors[edge.type]}
                  strokeWidth={edge.type === "realtime" ? 1.8 : 1.3}
                  strokeDasharray={edge.type === "migration" ? "6 4" : edge.type === "drift" ? "4 3" : "none"}
                  opacity={dimmed ? 0.08 : 0.55}
                  markerEnd={`url(#arrow-${edge.type})`}
                  className="transition-opacity duration-200"
                />
              );
            })}
          </svg>

          {/* HTML nodes layer */}
          {nodes.map((node) => {
            const config = tierConfig[node.tier];
            const Icon = config.icon;
            const dimmed = connectedNodes && !connectedNodes.has(node.id);
            return (
              <button
                key={node.id}
                className={`absolute flex items-center gap-1.5 px-2.5 border text-[9px] font-mono font-medium ${config.shape} ${config.color} transition-all duration-200 hover:scale-105 cursor-pointer ${dimmed ? "opacity-10" : "opacity-100"}`}
                style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
                onClick={() => setSelectedNode(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span className="truncate">{node.label}</span>
              </button>
            );
          })}
        </div>

        {/* Alerts overlay */}
        <div className="absolute top-3 right-3 w-72 space-y-2 z-10">
          {alerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className={`p-2 border-l-2 rounded text-[10px] ${alertColorMap[alert.type]}`}
            >
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              {alert.text}
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-card/90 border border-border rounded p-2 flex flex-wrap gap-3 z-10">
          {[
            { label: "Real-time Flow", color: "#0891ff" },
            { label: "Compliance", color: "#d4a843" },
            { label: "Cloud Migration", color: "#10b981" },
            { label: "Schema Drift", color: "#f59e0b" },
            { label: "Broken", color: "#ef4444" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div className="w-4 h-0.5 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-[9px] text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Minimap */}
        <div className="absolute bottom-3 right-3 w-28 h-16 bg-card/80 border border-border rounded overflow-hidden z-10">
          <svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} preserveAspectRatio="xMidYMid meet">
            {nodes.map((node) => (
              <rect key={node.id} x={node.x} y={node.y} width={12} height={5} fill={edgeColors.realtime} opacity={0.5} rx={1} />
            ))}
          </svg>
        </div>
      </div>

      {/* Inspector */}
      <AnimatePresence>
        {selectedNode && (
          <AssetInspector
            nodeId={selectedNode}
            node={nodes.find(n => n.id === selectedNode)!}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LineageMapPage;
