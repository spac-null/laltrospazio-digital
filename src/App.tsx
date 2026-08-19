import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouteMeta } from "@/components/site/RouteMeta";
import Home from "./pages/Home";
import Visit from "./pages/Visit";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import OurApproach from "./pages/OurApproach";
import WorkWithUs from "./pages/WorkWithUs";
import Organisation from "./pages/Organisation";
import History from "./pages/History";
import ResearchEvidence from "./pages/ResearchEvidence";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteMeta />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visita" element={<Visit />} />
          <Route path="/eventi" element={<Events />} />
          <Route path="/eventi/:slug" element={<EventDetail />} />
          <Route path="/approccio" element={<OurApproach />} />
          <Route path="/lavora-con-noi" element={<WorkWithUs />} />
          <Route path="/organizzazione" element={<Organisation />} />
          <Route path="/storia" element={<History />} />
          <Route path="/ricerca" element={<ResearchEvidence />} />
          <Route path="/contatti" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
