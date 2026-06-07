import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomesteadAIChat from "./components/HomesteadAIChat";
import WelcomeModal from "./components/WelcomeModal";
import CommoditiesTicker from "./components/CommoditiesTicker";
import WeatherAlertTicker from "./components/WeatherAlertTicker";
import { AnnouncementBar, AnnouncementAdminPanel } from "./components/AnnouncementBar";
import { NotificationToast } from "./components/NotificationToast";
import { PushNotificationPrompt } from "./components/PushNotificationPrompt";
import Home from "./pages/Home";
import SkillsHub from "./pages/SkillsHub";
import SkillDetail from "./pages/SkillDetail";
import Community from "./pages/Community";
import BarterTrade from "./pages/BarterTrade";
import LandAccess from "./pages/LandAccess";
import MapExplorer from "./pages/MapExplorer";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Schoolhouse from "./pages/Schoolhouse";
import SchoolCourse from "./pages/SchoolCourse";
import SchoolBuilder from "./pages/SchoolBuilder";
import SchoolStudents from "./pages/SchoolStudents";
import SchoolGradebook from "./pages/SchoolGradebook";
import SchoolAICreator from "./pages/SchoolAICreator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/skills" component={SkillsHub} />
      <Route path="/skills/:slug" component={SkillDetail} />
      <Route path="/community" component={Community} />
      <Route path="/barter" component={BarterTrade} />
      <Route path="/land-access" component={LandAccess} />
      <Route path="/map" component={MapExplorer} />
      <Route path="/profile" component={Profile} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/schoolhouse" component={Schoolhouse} />
      <Route path="/schoolhouse/course/:id" component={SchoolCourse} />
      <Route path="/schoolhouse/builder" component={SchoolBuilder} />
      <Route path="/schoolhouse/students" component={SchoolStudents} />
      <Route path="/schoolhouse/gradebook" component={SchoolGradebook} />
      <Route path="/schoolhouse/ai-creator" component={SchoolAICreator} />
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
          <AnnouncementBar />
          <CommoditiesTicker />
          <WeatherAlertTicker />
          <Router />
          <HomesteadAIChat />
          <WelcomeModal />
          <NotificationToast />
          <PushNotificationPrompt />
          <AnnouncementAdminPanel />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
