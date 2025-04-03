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
import NcaEccAssessmentPage from "@/pages/frameworks/nca-ecc-assessment-page";
import SamaPage from "@/pages/frameworks/sama-page";
import PdplPage from "@/pages/frameworks/pdpl-page";
import Iso27001Page from "@/pages/frameworks/iso-27001-page";
import RiskManagementPage from "@/pages/risk-management-page";
import PolicyManagementPage from "@/pages/policy-management-page";
import ClerkAuthPage from "@/pages/clerk-auth-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import ThemeProvider from "@/components/layout/theme-switch";
import CustomClerkProvider from "@/components/clerk/custom-clerk-provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/clerk-auth" component={ClerkAuthPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <ProtectedRoute path="/virtual-assistant" component={VirtualAssistantPage} />
      <ProtectedRoute path="/risk-management" component={RiskManagementPage} />
      <ProtectedRoute path="/policies" component={PolicyManagementPage} />
      <Route path="/did-agent" component={DIDAgentPage} />
      <Route path="/agent" component={DIDAgentPage} /> {/* Additional route for the agent page */}
      <Route path="/frameworks/nca-ecc" component={NcaEccPage} />
      <ProtectedRoute path="/frameworks/nca-ecc-assessment" component={NcaEccAssessmentPage} />
      <Route path="/frameworks/sama" component={SamaPage} />
      <Route path="/frameworks/pdpl" component={PdplPage} />
      <Route path="/frameworks/iso-27001" component={Iso27001Page} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    /* Temporarily disabling Clerk provider due to key configuration issues */
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
