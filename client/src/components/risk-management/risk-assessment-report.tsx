import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Filter, Printer, RefreshCw } from "lucide-react";

// Define the risk assessment entry type
type RiskAssessmentEntry = {
  domain: string;
  subdomain: string;
  domainCode: string;
  controlCode: string;
  controlName: string;
  controlStatus: "Not Implemented" | "Partially Implemented" | "Implemented" | "Not Applicable";
  currentStatus: string;
  recommendation: string;
  managementResponse: string;
  targetDate: string;
  priority: "High" | "Medium" | "Low";
};

// Mock data for the risk assessment report
const riskAssessmentData: RiskAssessmentEntry[] = [
  {
    domain: "Cybersecurity Governance",
    subdomain: "Cybersecurity Strategy",
    domainCode: "1",
    controlCode: "1.1.1",
    controlName: "A cybersecurity strategy must be defined, documented, and approved",
    controlStatus: "Not Implemented",
    currentStatus: "During the review, it was noted that the organization has not defined a cybersecurity strategy.",
    recommendation: "It is recommended to define a cybersecurity strategy and get it approved by senior management.",
    managementResponse: "Agree",
    targetDate: "Q2 2025",
    priority: "High"
  },
  {
    domain: "Cybersecurity Governance",
    subdomain: "Cybersecurity Strategy",
    domainCode: "1",
    controlCode: "1.1.2",
    controlName: "A roadmap must be executed to implement the cybersecurity strategy",
    controlStatus: "Not Implemented",
    currentStatus: "During the review, it was noted that the organization has not defined a cybersecurity strategy.",
    recommendation: "It is recommended to define a cybersecurity strategy and then develop the implementation roadmap.",
    managementResponse: "Agree",
    targetDate: "Q2 2025",
    priority: "High"
  },
  {
    domain: "Cybersecurity Governance",
    subdomain: "Cybersecurity Management",
    domainCode: "1",
    controlCode: "1.2.1",
    controlName: "A cybersecurity function must be established",
    controlStatus: "Partially Implemented",
    currentStatus: "The organization has a cybersecurity function, but it lacks clear roles and responsibilities.",
    recommendation: "Define clear roles and responsibilities for the cybersecurity function.",
    managementResponse: "Agree",
    targetDate: "Q3 2025",
    priority: "High"
  },
  {
    domain: "Cybersecurity Governance",
    subdomain: "Cybersecurity Policies",
    domainCode: "1",
    controlCode: "1.3.1",
    controlName: "Cybersecurity policies must be established",
    controlStatus: "Partially Implemented",
    currentStatus: "Some cybersecurity policies exist but are outdated and incomplete.",
    recommendation: "Review and update cybersecurity policies to align with current standards.",
    managementResponse: "Agree",
    targetDate: "Q3 2025",
    priority: "Medium"
  },
  {
    domain: "Cybersecurity Defense",
    subdomain: "Asset Management",
    domainCode: "2",
    controlCode: "2.1.1",
    controlName: "Asset inventory must be maintained",
    controlStatus: "Implemented",
    currentStatus: "The organization maintains a comprehensive asset inventory.",
    recommendation: "Regularly review and update the asset inventory.",
    managementResponse: "Agree",
    targetDate: "Ongoing",
    priority: "Medium"
  },
  {
    domain: "Cybersecurity Defense",
    subdomain: "Identity and Access Management",
    domainCode: "2",
    controlCode: "2.2.1",
    controlName: "Identity and access management processes must be implemented",
    controlStatus: "Partially Implemented",
    currentStatus: "Basic identity management is in place, but access management processes are informal.",
    recommendation: "Formalize access management processes and implement regular access reviews.",
    managementResponse: "Agree",
    targetDate: "Q4 2025",
    priority: "Medium"
  },
  {
    domain: "Cybersecurity Defense",
    subdomain: "Information Systems Security",
    domainCode: "2",
    controlCode: "2.3.1",
    controlName: "Security controls must be implemented for information systems",
    controlStatus: "Partially Implemented",
    currentStatus: "Some security controls are implemented, but coverage is not comprehensive.",
    recommendation: "Implement additional security controls to ensure comprehensive coverage.",
    managementResponse: "Agree",
    targetDate: "Q1 2026",
    priority: "High"
  },
  {
    domain: "Cybersecurity Resilience",
    subdomain: "Vulnerability Management",
    domainCode: "3",
    controlCode: "3.2.1",
    controlName: "Vulnerability management process must be implemented",
    controlStatus: "Not Implemented",
    currentStatus: "No formal vulnerability management process exists.",
    recommendation: "Implement a formal vulnerability management process.",
    managementResponse: "Agree",
    targetDate: "Q3 2025",
    priority: "High"
  },
  {
    domain: "Third-Party and Cloud Computing Cybersecurity",
    subdomain: "Third-Party Service Management",
    domainCode: "4",
    controlCode: "4.1.1",
    controlName: "Third-party cybersecurity risks must be managed",
    controlStatus: "Not Implemented",
    currentStatus: "No formal third-party risk management process exists.",
    recommendation: "Implement a formal third-party risk management process.",
    managementResponse: "Agree",
    targetDate: "Q4 2025",
    priority: "Medium"
  },
  {
    domain: "Industrial Control Systems Cybersecurity",
    subdomain: "Industrial Control Systems Security",
    domainCode: "5",
    controlCode: "5.1.1",
    controlName: "ICS security controls must be implemented",
    controlStatus: "Not Applicable",
    currentStatus: "The organization does not use industrial control systems.",
    recommendation: "N/A",
    managementResponse: "N/A",
    targetDate: "N/A",
    priority: "Low"
  }
];

// Generate summary statistics
const generateSummaryStats = (data: RiskAssessmentEntry[]) => {
  const applicableEntries = data.filter(entry => entry.controlStatus !== "Not Applicable");
  
  const domainStats: Record<string, { 
    total: number; 
    notImplemented: number; 
    partiallyImplemented: number; 
    implemented: number;
  }> = {};
  
  applicableEntries.forEach(entry => {
    if (!domainStats[entry.domain]) {
      domainStats[entry.domain] = { total: 0, notImplemented: 0, partiallyImplemented: 0, implemented: 0 };
    }
    
    domainStats[entry.domain].total++;
    
    if (entry.controlStatus === "Not Implemented") {
      domainStats[entry.domain].notImplemented++;
    } else if (entry.controlStatus === "Partially Implemented") {
      domainStats[entry.domain].partiallyImplemented++;
    } else if (entry.controlStatus === "Implemented") {
      domainStats[entry.domain].implemented++;
    }
  });
  
  return {
    total: applicableEntries.length,
    notImplemented: applicableEntries.filter(e => e.controlStatus === "Not Implemented").length,
    partiallyImplemented: applicableEntries.filter(e => e.controlStatus === "Partially Implemented").length,
    implemented: applicableEntries.filter(e => e.controlStatus === "Implemented").length,
    notApplicable: data.filter(e => e.controlStatus === "Not Applicable").length,
    domainStats
  };
};

// Generate chart data
const generateChartData = (stats: ReturnType<typeof generateSummaryStats>) => {
  // For pie chart
  const pieData = [
    { name: "Not Implemented", value: stats.notImplemented, color: "#f87171" },
    { name: "Partially Implemented", value: stats.partiallyImplemented, color: "#facc15" },
    { name: "Implemented", value: stats.implemented, color: "#4ade80" }
  ];
  
  // For bar chart
  const barData = Object.entries(stats.domainStats).map(([domain, data]) => ({
    name: domain,
    "Not Implemented": data.notImplemented,
    "Partially Implemented": data.partiallyImplemented,
    "Implemented": data.implemented
  }));
  
  return { pieData, barData };
};

// Status badge component
const StatusBadge = ({ status }: { status: RiskAssessmentEntry["controlStatus"] }) => {
  const variants = {
    "Not Implemented": "bg-red-500/20 text-red-500 border-red-500/20",
    "Partially Implemented": "bg-amber-500/20 text-amber-500 border-amber-500/20",
    "Implemented": "bg-green-500/20 text-green-500 border-green-500/20",
    "Not Applicable": "bg-gray-500/20 text-gray-400 border-gray-400/20"
  };
  
  return (
    <Badge className={`${variants[status]} border`}>
      {status}
    </Badge>
  );
};

export default function RiskAssessmentReport() {
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  
  // Filter data based on selected filters
  const filteredData = riskAssessmentData.filter(entry => {
    if (selectedDomain && entry.domain !== selectedDomain) return false;
    if (selectedPriority && entry.priority !== selectedPriority) return false;
    return true;
  });
  
  // Generate statistics and chart data
  const stats = generateSummaryStats(filteredData);
  const { pieData, barData } = generateChartData(stats);
  
  // Get unique domains for filter
  const uniqueDomains = Array.from(new Set(riskAssessmentData.map(e => e.domain)));
  
  // Calculate compliance score
  const complianceScore = Math.round(
    ((stats.implemented + stats.partiallyImplemented * 0.5) / stats.total) * 100
  );
  
  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">NCA ECC Risk Assessment Report</CardTitle>
              <CardDescription>
                Comprehensive analysis of compliance with Essential Cybersecurity Controls
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
              <Select value={selectedDomain || ""} onValueChange={(value) => setSelectedDomain(value || null)}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Domains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Domains</SelectItem>
                  {uniqueDomains.map(domain => (
                    <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedPriority || ""} onValueChange={(value) => setSelectedPriority(value || null)}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="Low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Report</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Overall Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">{complianceScore}%</div>
                        <Progress value={complianceScore} className="h-2 w-[150px]" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Based on {stats.total} applicable controls
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Implementation Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Status Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Implemented</span>
                          <span className="text-sm text-green-500 font-medium">
                            {stats.implemented} / {stats.total}
                          </span>
                        </div>
                        <Progress value={(stats.implemented / stats.total) * 100} className="h-2 bg-muted" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Partially Implemented</span>
                          <span className="text-sm text-amber-500 font-medium">
                            {stats.partiallyImplemented} / {stats.total}
                          </span>
                        </div>
                        <Progress value={(stats.partiallyImplemented / stats.total) * 100} className="h-2 bg-muted" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Not Implemented</span>
                          <span className="text-sm text-red-500 font-medium">
                            {stats.notImplemented} / {stats.total}
                          </span>
                        </div>
                        <Progress value={(stats.notImplemented / stats.total) * 100} className="h-2 bg-muted" />
                      </div>
                      
                      {stats.notApplicable > 0 && (
                        <div className="text-sm text-muted-foreground mt-2">
                          * {stats.notApplicable} controls marked as Not Applicable
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Domain Compliance Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Not Implemented" stackId="a" fill="#f87171" />
                        <Bar dataKey="Partially Implemented" stackId="a" fill="#facc15" />
                        <Bar dataKey="Implemented" stackId="a" fill="#4ade80" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">High Priority Findings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Control</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Recommendation</TableHead>
                        <TableHead>Target Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.filter(entry => entry.priority === "High").map(entry => (
                        <TableRow key={entry.controlCode}>
                          <TableCell className="font-medium">
                            {entry.controlCode}: {entry.controlName}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={entry.controlStatus} />
                          </TableCell>
                          <TableCell>{entry.recommendation}</TableCell>
                          <TableCell>{entry.targetDate}</TableCell>
                        </TableRow>
                      ))}
                      {filteredData.filter(entry => entry.priority === "High").length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            No high priority findings found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="detailed" className="py-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Domain</TableHead>
                          <TableHead className="whitespace-nowrap">Subdomain</TableHead>
                          <TableHead className="whitespace-nowrap">Control Code</TableHead>
                          <TableHead className="whitespace-nowrap">Control Name</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="whitespace-nowrap">Current Status</TableHead>
                          <TableHead className="whitespace-nowrap">Recommendation</TableHead>
                          <TableHead className="whitespace-nowrap">Management Response</TableHead>
                          <TableHead className="whitespace-nowrap">Target Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map(entry => (
                          <TableRow key={entry.controlCode}>
                            <TableCell className="font-medium">{entry.domain}</TableCell>
                            <TableCell>{entry.subdomain}</TableCell>
                            <TableCell>{entry.controlCode}</TableCell>
                            <TableCell>{entry.controlName}</TableCell>
                            <TableCell>
                              <StatusBadge status={entry.controlStatus} />
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={entry.currentStatus}>
                              {entry.currentStatus}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={entry.recommendation}>
                              {entry.recommendation}
                            </TableCell>
                            <TableCell>{entry.managementResponse}</TableCell>
                            <TableCell>{entry.targetDate}</TableCell>
                          </TableRow>
                        ))}
                        {filteredData.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                              No findings match the current filters
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}