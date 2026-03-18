import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import MudraGallery from "./pages/MudraGallery";
import Classify from "./pages/Classify";
import Team from "./pages/Team";
import ModelResearch from "./pages/ModelResearch";
import MudraChallenge from "./pages/MudraChallenge";
import MyProgress from "./pages/MyProgress";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/model-research" element={<ModelResearch />} />
              <Route path="/mudra-gallery" element={<MudraGallery />} />
              <Route path="/classify" element={<Classify />} />
              <Route path="/mudra-challenge" element={<MudraChallenge />} />
              <Route path="/progress" element={<MyProgress />} />
              <Route path="/team" element={<Team />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
