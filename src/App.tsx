import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import CaseView from "./pages/CaseView";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Upgrade from "./pages/Upgrade";
import Contracts from "./pages/Contracts";
import Crash from "./pages/Crash";
import Support from "./pages/Support";
import Deposit from "./pages/Deposit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/case/:id" element={<CaseView />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/crash" element={<Crash />} />
            <Route path="/support" element={<Support />} />
            <Route path="/deposit" element={<Deposit />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
