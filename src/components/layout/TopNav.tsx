import { NavLink, useLocation } from "react-router-dom";
import { Globe, Bell, User } from "lucide-react";

const tabs = [
  { label: "Overview", path: "/" },
  { label: "Lineage Map", path: "/lineage" },
  { label: "Revenue Tracing", path: "/revenue" },
  { label: "Regulatory Audit", path: "/regulatory" },
  { label: "AI Data Agent", path: "/ai-agent" },
  { label: "Impact Console", path: "/impact" },
];

const TopNav = () => {
  const now = new Date();
  const tradeDate = now.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="h-12 bg-card border-b border-border flex items-center px-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-8">
        <Globe className="w-5 h-5 text-cme-blue" />
        <span className="font-semibold text-sm tracking-wide text-foreground">CME Group</span>
      </div>

      {/* Tabs */}
      <nav className="flex items-center gap-1 flex-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === "/"}
            className={({ isActive }) =>
              `px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                isActive
                  ? "bg-secondary text-cme-blue border border-cme-blue/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-[11px] text-muted-foreground">
          Trade Date: {tradeDate}
        </span>
        <div className="relative">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cme-amber text-[9px] font-bold flex items-center justify-center text-background">4</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <span className="text-[11px] text-muted-foreground">Finance Data Office</span>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
