import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/AppLayout";
import OverviewPage from "@/pages/OverviewPage";
import LineageMapPage from "@/pages/LineageMapPage";
import RevenueTracingPage from "@/pages/RevenueTracingPage";
import RegulatoryAuditPage from "@/pages/RegulatoryAuditPage";
import AIDataAgentPage from "@/pages/AIDataAgentPage";
import ImpactConsolePage from "@/pages/ImpactConsolePage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/lineage" element={<LineageMapPage />} />
            <Route path="/revenue" element={<RevenueTracingPage />} />
            <Route path="/regulatory" element={<RegulatoryAuditPage />} />
            <Route path="/ai-agent" element={<AIDataAgentPage />} />
            <Route path="/impact" element={<ImpactConsolePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
