import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/dashboard/sidebar";
import ComplianceScore from "@/components/dashboard/compliance-score";
import RiskHeatmap from "@/components/dashboard/risk-heatmap";
import { Link } from "wouter";
import { Shield, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.username}
              </span>
            </div>
          </div>
          
          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="backdrop-blur-sm bg-primary/5 border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-primary" />
                  Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ComplianceScore score={78} />
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-primary/5 border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                  Risk Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Medium</div>
                <p className="text-xs text-muted-foreground mt-1">
                  5 critical issues need attention
                </p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-primary/5 border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">63/80</div>
                <p className="text-xs text-muted-foreground mt-1">
                  NCA ECC controls implemented
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Risk Heatmap */}
            <Card className="md:col-span-2 backdrop-blur-sm bg-card/50 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Risk Heatmap</CardTitle>
                <Link href="/risk-management">
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-xs text-muted-foreground"
                  >
                    View Full Risk Management →
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <RiskHeatmap />
              </CardContent>
            </Card>
            
            {/* Pending Tasks */}
            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Pending Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Update firewall rules</p>
                      <p className="text-xs text-muted-foreground">Due in 2 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Review access controls</p>
                      <p className="text-xs text-muted-foreground">Due in 5 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Update data privacy policy</p>
                      <p className="text-xs text-muted-foreground">Due in 7 days</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View All Tasks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* NCA ECC Framework */}
          <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
            <CardHeader>
              <CardTitle>NCA ECC Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="domain1">
                <TabsList className="w-full grid grid-cols-5">
                  <TabsTrigger value="domain1">Governance</TabsTrigger>
                  <TabsTrigger value="domain2">Defense</TabsTrigger>
                  <TabsTrigger value="domain3">Resilience</TabsTrigger>
                  <TabsTrigger value="domain4">Risk</TabsTrigger>
                  <TabsTrigger value="domain5">Compliance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="domain1">
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        control: "1-1",
                        name: "Cybersecurity Strategy",
                        status: "Compliant"
                      },
                      {
                        control: "1-2",
                        name: "Policies & Procedures",
                        status: "Partially Compliant"
                      },
                      {
                        control: "1-3",
                        name: "Security Roles",
                        status: "Compliant"
                      },
                      {
                        control: "1-4",
                        name: "Training & Awareness",
                        status: "Non-Compliant"
                      },
                      {
                        control: "1-5",
                        name: "Review & Updates",
                        status: "Partially Compliant"
                      }
                    ].map(item => (
                      <div key={item.control} className="rounded-lg border p-3 flex items-center justify-between bg-background/60">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            item.status === "Compliant" ? "bg-green-500" : 
                            item.status === "Partially Compliant" ? "bg-amber-500" : "bg-red-500"
                          }`}></div>
                          <div>
                            <div className="text-xs text-muted-foreground">ECC {item.control}</div>
                            <div className="font-medium">{item.name}</div>
                          </div>
                        </div>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="domain2">
                  <div className="p-4 text-center text-muted-foreground">
                    Defense domain controls for network security, access management, and encryption
                  </div>
                </TabsContent>
                
                <TabsContent value="domain3">
                  <div className="p-4 text-center text-muted-foreground">
                    Resilience domain controls for backup, incident response, and business continuity
                  </div>
                </TabsContent>
                
                <TabsContent value="domain4">
                  <div className="p-4 text-center text-muted-foreground">
                    Risk domain controls for assessment, management, and third-party security
                  </div>
                </TabsContent>
                
                <TabsContent value="domain5">
                  <div className="p-4 text-center text-muted-foreground">
                    Compliance domain controls for monitoring, auditing, and reporting
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
