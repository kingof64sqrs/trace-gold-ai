const StatusBar = () => {
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <div className="h-6 bg-cme-navy border-t border-border flex items-center justify-center gap-6 shrink-0">
      {[
        `Trade Date: ${today}`,
        "ADV Today: 26.5M contracts",
        "CFTC Part 17 Submission: 9:00 PM CT",
        "Google Cloud Migration: 68%",
        "Active Lineage Alerts: 4",
        "Last Scan: 14 min ago",
      ].map((item, i) => (
        <span key={i} className="font-mono text-[10px] text-muted-foreground">
          {item}
        </span>
      ))}
    </div>
  );
};

export default StatusBar;
