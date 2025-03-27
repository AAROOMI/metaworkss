import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import AdminPage from "@/pages/admin-page";
import VirtualAssistantPage from "@/pages/virtual-assistant-page";
import DIDAgentPage from "@/pages/did-agent-page";
import NcaEccPage from "@/pages/frameworks/nca-ecc-page";
import SamaPage from "@/pages/frameworks/sama-page";
import PdplPage from "@/pages/frameworks/pdpl-page";
import Iso27001Page from "@/pages/frameworks/iso-27001-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import ThemeProvider from "@/components/layout/theme-switch";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <ProtectedRoute path="/virtual-assistant" component={VirtualAssistantPage} />
      <Route path="/did-agent" component={DIDAgentPage} />
      <Route path="/frameworks/nca-ecc" component={NcaEccPage} />
      <Route path="/frameworks/sama" component={SamaPage} />
      <Route path="/frameworks/pdpl" component={PdplPage} />
      <Route path="/frameworks/iso-27001" component={Iso27001Page} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HelmetProvider>
          <ThemeProvider>
            <Router />
            <Toaster />
          </ThemeProvider>
        </HelmetProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
