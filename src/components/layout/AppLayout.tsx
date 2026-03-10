import { Outlet } from "react-router-dom";
import TopBanner from "./TopBanner";
import TopNav from "./TopNav";
import StatusBar from "./StatusBar";
import AppSidebar from "./AppSidebar";
import { useState } from "react";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <TopBanner />
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <StatusBar />
    </div>
  );
};

export default AppLayout;
