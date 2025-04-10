import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Sliders,
  BarChart4,
  ListChecks,
  Plus,
  Filter,
  Settings,
  ChevronDown,
} from "lucide-react";
import RiskAssessmentReport from "@/components/risk-management/risk-assessment-report";

// For demo purposes, we'll use this as a placeholder for other tabs
const ComingSoonCard = ({ title, description }: { title: string; description: string }) => (
  <Card className="backdrop-blur-sm bg-card/50 border-primary/10 p-12">
    <div className="text-center">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
      <h3 className="mt-4 text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground mt-2">
        {description}
      </p>
      <div className="flex justify-center mt-6">
        <Button>Coming Soon</Button>
      </div>
    </div>
  </Card>
);

export default function RiskManagementPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("assessment");
  
  return (
    <>
      <Helmet>
        <title>Risk Management | MetaWorks</title>
      </Helmet>
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-primary">Risk Management</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Configure</span>
              </Button>
              <Link href="/risk-assessment">
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>New Assessment</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-red-500/10 border-red-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-500 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  High Risks
                </CardTitle>
                <CardDescription>Critical issues needing attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">+3 from last assessment</div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-500 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Medium Risks
                </CardTitle>
                <CardDescription>Issues requiring planned resolution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <div className="text-sm text-muted-foreground">-2 from last assessment</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-500/10 border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-500 flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Remediated
                </CardTitle>
                <CardDescription>Issues that have been addressed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">18</div>
                <div className="text-sm text-muted-foreground">+5 since last month</div>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/10 border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-primary flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2" />
                  Overall Score
                </CardTitle>
                <CardDescription>NCA ECC compliance score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">43%</div>
                <div className="text-sm text-muted-foreground">+8% from baseline</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="assessment" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-6">
              <TabsTrigger value="assessment" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                Risk Assessment
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Risk Tracking
              </TabsTrigger>
              <TabsTrigger value="mitigation" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Mitigation Plans
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <BarChart4 className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assessment">
              <RiskAssessmentReport />
            </TabsContent>
            
            <TabsContent value="tracking">
              <ComingSoonCard 
                title="Risk Tracking System"
                description="This module will allow you to track individual risks, assign ownership, set deadlines, and monitor progress on remediation activities."
              />
            </TabsContent>
            
            <TabsContent value="mitigation">
              <ComingSoonCard 
                title="Mitigation Planning"
                description="Create detailed mitigation plans, document remediation steps, assign resources, and set timelines for addressing identified risks."
              />
            </TabsContent>
            
            <TabsContent value="reports">
              <ComingSoonCard 
                title="Compliance Reporting"
                description="Generate customized reports for different stakeholders, including executive summaries, detailed technical reports, and audit-ready documentation."
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}