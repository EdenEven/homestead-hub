import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomesteadAIChat from "./components/HomesteadAIChat";
import Home from "./pages/Home";
import SkillsHub from "./pages/SkillsHub";
import SkillDetail from "./pages/SkillDetail";
import Community from "./pages/Community";
import BarterTrade from "./pages/BarterTrade";
import LandAccess from "./pages/LandAccess";
import MapExplorer from "./pages/MapExplorer";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/skills" component={SkillsHub} />
      <Route path="/skills/:slug" component={SkillDetail} />
      <Route path="/community" component={Community} />
      <Route path="/barter" component={BarterTrade} />
      <Route path="/land-access" component={LandAccess} />
      <Route path="/map" component={MapExplorer} />
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
          <HomesteadAIChat />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
