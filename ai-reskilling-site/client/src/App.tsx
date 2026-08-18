import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import JobCurriculum from "./pages/JobCurriculum";
import IndustryCurriculum from "./pages/IndustryCurriculum";
import Subsidy from "./pages/Subsidy";

// Base path for all routes (production path prefix)
export const BASE = "/services/ai-training/ai-reskilling";

function Router() {
  return (
    <Switch>
      {/* Home — both dev and production paths */}
      <Route path="/" component={Home} />
      <Route path={`${BASE}/`} component={Home} />
      {/* Curriculum pages — dev paths */}
      <Route path="/curriculum-job" component={JobCurriculum} />
      <Route path="/curriculum-industry" component={IndustryCurriculum} />
      <Route path="/subsidy" component={Subsidy} />
      {/* Curriculum pages — production paths */}
      <Route path={`${BASE}/curriculum-job/`} component={JobCurriculum} />
      <Route path={`${BASE}/curriculum-industry/`} component={IndustryCurriculum} />
      <Route path={`${BASE}/subsidy/`} component={Subsidy} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
