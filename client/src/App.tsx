import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import Investors from "@/pages/Investors";
import Campaigns from "@/pages/Campaigns";
import CampaignDetails from "@/pages/CampaignDetails";
import Inbox from "@/pages/Inbox";
import Settings from "@/pages/Settings";

function Router() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated (handled by useAuth internals usually, but we can enforce)
  if (!isAuthenticated) {
    // In a real app with useAuth, the hook handles the redirect or we show a landing page
    // For now assuming useAuth handles the flow or we just render the protected routes 
    // and let the API 401s handle the redirect logic via the queryClient setup
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/investors" component={Investors} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/campaigns/:id" component={CampaignDetails} />
      <Route path="/inbox" component={Inbox} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
