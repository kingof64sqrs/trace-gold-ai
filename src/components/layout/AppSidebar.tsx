import { ChevronRight, ChevronDown, Database, PanelLeftClose, PanelLeft } from "lucide-react";
import { useState } from "react";

interface TreeNode {
  label: string;
  icon?: string;
  children?: TreeNode[];
}

const systemTree: TreeNode[] = [
  { label: "CME Globex", children: [
    { label: "Futures Order Flow" },
    { label: "Options Order Flow" },
    { label: "MDP 3.0 Market Data" },
    { label: "Trade Matching Engine" },
  ]},
  { label: "BrokerTec", children: [
    { label: "U.S. Treasuries" },
    { label: "EU Gov Bonds" },
    { label: "Repo Rate Feed" },
    { label: "Stream 2.0" },
  ]},
  { label: "EBS", children: [
    { label: "FX Spot" },
    { label: "NDF" },
    { label: "FX Forwards" },
  ]},
  { label: "CME Clearing", children: [
    { label: "SPAN Margin Engine" },
    { label: "Settlement Prices" },
    { label: "Guarantee Fund" },
    { label: "ClearPort OTC" },
  ]},
  { label: "CME DataMine", children: [
    { label: "Historical Warehouse" },
    { label: "FedWatch API" },
  ]},
  { label: "Google Cloud Platform", children: [
    { label: "Unified Data Platform" },
    { label: "Analytics Layer" },
    { label: "Smart Stream" },
  ]},
  { label: "CFTC Reporting Layer", children: [
    { label: "Part 17 Reports" },
    { label: "Part 16 Reports" },
    { label: "SDR Repository" },
  ]},
  { label: "Finance ERP" },
  { label: "Market Data Revenue System" },
  { label: "Snowflake Data Warehouse", children: [
    { label: "Raw Data Lake" },
    { label: "Curated Datasets" },
    { label: "Analytics Views" },
    { label: "Cross-Platform Joins" },
  ]},
];

const TreeItem = ({ node, depth = 0 }: { node: TreeNode; depth?: number }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <button
        onClick={() => hasChildren && setOpen(!open)}
        className="w-full flex items-center gap-1.5 px-2 py-1 text-[11px] text-secondary-foreground hover:bg-secondary/50 rounded transition-colors"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren ? (
          open ? <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
        ) : (
          <div className="w-3 h-3 shrink-0" />
        )}
        <Database className="w-3 h-3 text-cme-blue shrink-0" />
        <span className="truncate">{node.label}</span>
      </button>
      {open && hasChildren && node.children!.map((child, i) => (
        <TreeItem key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
};

const AppSidebar = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => {
  return (
    <div className={`${open ? "w-56" : "w-10"} bg-card border-r border-border shrink-0 flex flex-col transition-all duration-200 overflow-hidden`}>
      <div className="flex items-center justify-between p-2 border-b border-border">
        {open && <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Data Sources</span>}
        <button onClick={onToggle} className="p-1 rounded hover:bg-secondary/50">
          {open ? <PanelLeftClose className="w-3.5 h-3.5 text-muted-foreground" /> : <PanelLeft className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
      </div>
      {open && (
        <div className="flex-1 overflow-y-auto py-1">
          {systemTree.map((node, i) => (
            <TreeItem key={i} node={node} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppSidebar;
