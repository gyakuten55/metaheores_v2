import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BASE } from "./lib/paths";
import Home from "./pages/Home";
import JobCurriculum from "./pages/JobCurriculum";
import IndustryCurriculum from "./pages/IndustryCurriculum";
import Subsidy from "./pages/Subsidy";

function Router() {
  return (
    // BASE is "" in dev and "/services/ai-training/reskilling" in production,
    // so every route below is written relative to the site root.
    <WouterRouter base={BASE}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/curriculum-job" component={JobCurriculum} />
        <Route path="/curriculum-job/" component={JobCurriculum} />
        <Route path="/curriculum-industry" component={IndustryCurriculum} />
        <Route path="/curriculum-industry/" component={IndustryCurriculum} />
        <Route path="/subsidy" component={Subsidy} />
        <Route path="/subsidy/" component={Subsidy} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
