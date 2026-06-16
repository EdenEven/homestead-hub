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
import SchoolPrint from "./pages/SchoolPrint";
import SchoolhousePro from "./pages/SchoolhousePro";
import Features from "./pages/Features";
import About from "./pages/About";
import Partners from "./pages/Partners";
import MediaKit from "./pages/MediaKit";
<<<<<<< Updated upstream
import Film from "./pages/Film";
=======
import Events from "./pages/Events";
>>>>>>> Stashed changes

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
      <Route path="/schoolhouse/course/:id/print" component={SchoolPrint} />
      <Route path="/schoolhouse/pro" component={SchoolhousePro} />
      <Route path="/features" component={Features} />
      <Route path="/about" component={About} />
      <Route path="/partners" component={Partners} />
      <Route path="/media-kit" component={MediaKit} />
<<<<<<< Updated upstream
      <Route path="/film" component={Film} />
=======
      <Route path="/events" component={Events} />
>>>>>>> Stashed changes
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
