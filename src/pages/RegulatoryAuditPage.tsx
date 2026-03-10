import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ChevronRight, ChevronDown, Download, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const regulations = [
  { label: "CFTC Part 17", desc: "Large Trader Position Reporting", items: ["Daily Position Reports", "Trader Account Mapping", "Position Limits Monitoring"] },
  { label: "CFTC Part 16", desc: "Daily Trade Reports", items: ["Trade Register", "Volume Reports", "Open Interest"] },
  { label: "Dodd-Frank Title VIII", desc: "SIFMU Requirements", items: ["Risk Management", "Recovery & Resolution", "Governance Standards"] },
  { label: "CFTC Part 39", desc: "DCO Core Principles", items: ["Margin Requirements", "Default Management", "Financial Resources"] },
  { label: "CFTC Part 190", desc: "FCM Bankruptcy Protections", items: ["Segregation Reports", "Customer Fund Protection"] },
  { label: "Federal Reserve Board", desc: "Oversight Requirements", items: ["Capital Adequacy", "Liquidity Standards"] },
];

const complianceMatrix = [
  { field: "Initial Margin per Clearing Member", source: "CME Clearing SPAN", steps: 3, owner: "Clearing Risk Analytics", validated: "Today 06:42 CT", status: "verified", audit: "AUD-2024-CME-00847" },
  { field: "Daily Settlement Price — ES Futures", source: "Settlement Engine", steps: 5, owner: "Market Operations", validated: "Today 14:18 CT", status: "verified", audit: "AUD-2024-CME-00851" },
  { field: "Large Trader Position (Part 17)", source: "Position Aggregation", steps: 4, owner: "Regulatory Reporting", validated: "Today 14:23 CT", status: "pending", audit: "AUD-2024-CME-00852" },
  { field: "FCM Segregated Funds Balance", source: "Finance ERP", steps: 2, owner: "Treasury Operations", validated: "Today 12:00 CT", status: "verified", audit: "AUD-2024-CME-00843" },
  { field: "Repo Rate — U.S. Treasury", source: "BrokerTec Stream", steps: 3, owner: "Fixed Income Ops", validated: "Today 06:00 CT", status: "gap", audit: "—" },
  { field: "Cross-Platform Data Validation", source: "Snowflake DW", steps: 2, owner: "Data Engineering", validated: "Today 13:42 CT", status: "verified", audit: "AUD-2024-CME-00849" },
];

const auditTimeline = [
  { time: "14:23 CT", event: "Validation Run", asset: "CFTC Part 17 Position Report", trigger: "Automated", result: "94% Complete", color: "text-cme-blue" },
  { time: "14:18 CT", event: "Validation Run", asset: "ES Settlement Price Lineage", trigger: "Automated", result: "Passed", color: "text-cme-emerald" },
  { time: "12:00 CT", event: "Manual Override", asset: "FCM Seg Fund Calculation", trigger: "J. Williams (Treasury)", result: "Approved", color: "text-cme-gold" },
  { time: "06:42 CT", event: "Schema Change Detected", asset: "BrokerTec Repo Rate Feed", trigger: "System", result: "Review Required", color: "text-cme-amber" },
  { time: "06:00 CT", event: "AI Reconciliation", asset: "Overnight SOFR Benchmark", trigger: "AI Agent", result: "Reconciled", color: "text-cme-purple" },
];

const reportingStatus = [
  { label: "CFTC Part 17 Position Report", deadline: "9:00 PM CT", status: "In Progress", pct: 94, color: "bg-cme-blue" },
  { label: "Large Trader Report", deadline: "10:00 PM CT", status: "Pending Upstream", pct: 72, color: "bg-cme-amber" },
  { label: "FCM Segregation Report", deadline: "8:00 AM (T+1)", status: "Scheduled", pct: 0, color: "bg-secondary" },
];

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  verified: { icon: CheckCircle, color: "text-cme-emerald", bg: "bg-cme-emerald/10" },
  pending: { icon: Clock, color: "text-cme-amber", bg: "bg-cme-amber/10" },
  gap: { icon: XCircle, color: "text-cme-red", bg: "bg-cme-red/10 animate-breathe" },
};

const RegulatoryAuditPage = () => {
  const [selectedReg, setSelectedReg] = useState("CFTC Part 17");
  const [expandedRegs, setExpandedRegs] = useState<Set<string>>(new Set(["CFTC Part 17"]));

  const toggleReg = (label: string) => {
    const next = new Set(expandedRegs);
    next.has(label) ? next.delete(label) : next.add(label);
    setExpandedRegs(next);
    setSelectedReg(label);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Warning Banner */}
      <div className="h-8 bg-cme-amber/10 border-b border-cme-amber/30 flex items-center justify-center gap-2 shrink-0">
        <AlertTriangle className="w-3.5 h-3.5 text-cme-amber" />
        <span className="text-[10px] font-medium text-cme-amber uppercase tracking-wide">
          Regulatory Sensitive — CFTC Part 17, Part 16, Dodd-Frank Title VIII reporting lineage. Authorized personnel only.
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Regulation Navigator */}
        <div className="w-56 border-r border-border bg-card overflow-y-auto shrink-0">
          <div className="p-3 border-b border-border">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Regulations</span>
          </div>
          {regulations.map((reg) => (
            <div key={reg.label}>
              <button onClick={() => toggleReg(reg.label)} className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] hover:bg-secondary/50 transition-colors ${selectedReg === reg.label ? "bg-secondary" : ""}`}>
                {expandedRegs.has(reg.label) ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                <Shield className="w-3 h-3 text-cme-gold" />
                <div className="text-left">
                  <div className="text-secondary-foreground font-medium">{reg.label}</div>
                  <div className="text-[9px] text-muted-foreground">{reg.desc}</div>
                </div>
              </button>
              {expandedRegs.has(reg.label) && reg.items.map((item, i) => (
                <div key={i} className="px-8 py-1 text-[10px] text-muted-foreground hover:text-secondary-foreground cursor-pointer">{item}</div>
              ))}
            </div>
          ))}
        </div>

        {/* Center: Compliance Matrix */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Lineage Compliance Matrix — <span className="text-cme-gold">{selectedReg}</span></h2>
            <button className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium bg-cme-gold/20 text-cme-gold border border-cme-gold/30 rounded hover:bg-cme-gold/30 transition-colors">
              <Download className="w-3 h-3" /> Export Audit Package
            </button>
          </div>

          <div className="border border-border rounded overflow-hidden">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-secondary">
                  {["Reportable Data Field", "Source System", "Steps", "Data Owner", "Last Validated", "Status", "Audit Trail"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complianceMatrix.map((row, i) => {
                  const sc = statusConfig[row.status];
                  const Icon = sc.icon;
                  return (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-t border-border hover:bg-secondary/30"
                    >
                      <td className="px-3 py-2 text-secondary-foreground font-medium">{row.field}</td>
                      <td className="px-3 py-2 font-mono text-muted-foreground">{row.source}</td>
                      <td className="px-3 py-2 text-center text-muted-foreground">{row.steps}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.owner}</td>
                      <td className="px-3 py-2 font-mono text-muted-foreground">{row.validated}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                          <Icon className="w-3 h-3" />
                          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-muted-foreground">{row.audit}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Reporting Status */}
          <div className="mt-6 border border-border rounded p-4">
            <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">CFTC Daily Reporting Status</h3>
            <div className="space-y-3">
              {reportingStatus.map((report) => (
                <div key={report.label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-secondary-foreground">{report.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono">Due: {report.deadline}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-medium ${
                        report.status === "In Progress" ? "bg-cme-blue/20 text-cme-blue" :
                        report.status === "Pending Upstream" ? "bg-cme-amber/20 text-cme-amber" :
                        "bg-secondary text-muted-foreground"
                      }`}>{report.status}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${report.color} rounded-full transition-all`} style={{ width: `${report.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Audit Timeline */}
        <div className="w-64 border-l border-border bg-card overflow-y-auto shrink-0 p-3">
          <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Audit Timeline</h3>
          <div className="space-y-3">
            {auditTimeline.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="border-l-2 border-border pl-3"
              >
                <div className="font-mono text-[9px] text-muted-foreground">{event.time}</div>
                <div className={`text-[10px] font-medium ${event.color}`}>{event.event}</div>
                <div className="text-[10px] text-secondary-foreground">{event.asset}</div>
                <div className="text-[9px] text-muted-foreground">By: {event.trigger} — {event.result}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatoryAuditPage;
