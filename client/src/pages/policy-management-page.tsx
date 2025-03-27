import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, FileText, Plus, Download, Filter, Settings, Calendar, Clock, Check, X, Pencil, Trash2, Upload } from "lucide-react";

// Mock data for policies
const policies = [
  {
    id: 1,
    name: "Information Security Policy",
    description: "This policy establishes guidelines for information security management within the organization.",
    category: "Security",
    version: "1.2",
    status: "Active",
    lastUpdated: "2025-01-15",
    reviewDate: "2025-07-15",
    author: "John Smith",
    approver: "Sarah Johnson"
  },
  {
    id: 2,
    name: "Data Protection Policy",
    description: "Guidelines for handling and protecting sensitive data in compliance with regulations.",
    category: "Data",
    version: "2.1",
    status: "Active",
    lastUpdated: "2025-02-20",
    reviewDate: "2025-08-20",
    author: "Emma Davis",
    approver: "Michael Brown"
  },
  {
    id: 3,
    name: "Access Control Policy",
    description: "Rules and procedures for granting, controlling, and monitoring access to systems and data.",
    category: "Security",
    version: "1.3",
    status: "Under Review",
    lastUpdated: "2025-03-05",
    reviewDate: "2025-03-30",
    author: "Robert Wilson",
    approver: "Pending"
  },
  {
    id: 4,
    name: "Incident Response Policy",
    description: "Procedures for responding to and reporting security incidents.",
    category: "Security",
    version: "1.0",
    status: "Draft",
    lastUpdated: "2025-03-15",
    reviewDate: "N/A",
    author: "Lisa Taylor",
    approver: "Pending"
  },
  {
    id: 5,
    name: "Acceptable Use Policy",
    description: "Guidelines for appropriate use of the organization's IT resources.",
    category: "Compliance",
    version: "2.0",
    status: "Active",
    lastUpdated: "2024-12-10",
    reviewDate: "2025-06-10",
    author: "David Clark",
    approver: "James Miller"
  }
];

// PolicyForm component for adding/editing policies
function PolicyForm({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Policy Name</Label>
          <Input id="name" placeholder="Enter policy name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" placeholder="e.g., Security, Data, Compliance" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Enter policy description" rows={4} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input id="version" placeholder="e.g., 1.0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" placeholder="Enter author name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="approver">Approver</Label>
          <Input id="approver" placeholder="Enter approver name" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Input id="status" placeholder="e.g., Draft, Active, Under Review" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reviewDate">Next Review Date</Label>
          <Input id="reviewDate" type="date" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="document">Upload Policy Document</Label>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Supported file types: PDF, DOCX, XLSX (Max size: 10MB)
        </p>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button>Save Policy</Button>
      </div>
    </div>
  );
}

export default function PolicyManagementPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  
  // Filter policies based on active tab
  const filteredPolicies = activeTab === "all" 
    ? policies 
    : activeTab === "active" 
      ? policies.filter(p => p.status === "Active")
      : activeTab === "draft" 
        ? policies.filter(p => p.status === "Draft")
        : policies.filter(p => p.status === "Under Review");
  
  return (
    <>
      <Helmet>
        <title>Policy Management | MetaWorks</title>
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
              <h1 className="text-3xl font-bold text-primary">Policy Management</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Dialog open={showAddPolicy} onOpenChange={setShowAddPolicy}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Add Policy</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Add New Policy</DialogTitle>
                    <DialogDescription>
                      Create a new policy document for your organization
                    </DialogDescription>
                  </DialogHeader>
                  <PolicyForm onCancel={() => setShowAddPolicy(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Policy Documents</CardTitle>
                  <CardDescription>
                    Manage your organization's policies and compliance documents
                  </CardDescription>
                </div>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="review">Under Review</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Policy Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Review Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPolicies.map(policy => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            {policy.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {policy.description.length > 80 
                              ? policy.description.substring(0, 80) + "..."
                              : policy.description}
                          </div>
                        </TableCell>
                        <TableCell>{policy.category}</TableCell>
                        <TableCell>{policy.version}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              policy.status === "Active" ? "bg-green-500/20 text-green-500 border-green-500/20" : 
                              policy.status === "Draft" ? "bg-blue-500/20 text-blue-500 border-blue-500/20" : 
                              "bg-amber-500/20 text-amber-500 border-amber-500/20"
                            } border`}
                          >
                            {policy.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            {policy.lastUpdated}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            {policy.reviewDate}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredPolicies.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No policies found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredPolicies.length} of {policies.length} policies
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Policy Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Active Policies</span>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/20 border">
                      3 / 5
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Up-to-date Policies</span>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/20 border">
                      4 / 5
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Review Required</span>
                    <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20 border">
                      1
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending Approval</span>
                    <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/20 border">
                      2
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded-full bg-green-500/20 text-green-500">
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Acceptable Use Policy approved</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded-full bg-blue-500/20 text-blue-500">
                      <Pencil className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Access Control Policy updated</p>
                      <p className="text-xs text-muted-foreground">5 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded-full bg-amber-500/20 text-amber-500">
                      <Clock className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Data Protection Policy due for review</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Policy Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-2 rounded-md hover:bg-primary/5 cursor-pointer transition-colors">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span>Information Security Policy Template</span>
                  </div>
                  <div className="flex items-center p-2 rounded-md hover:bg-primary/5 cursor-pointer transition-colors">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span>Data Protection Policy Template</span>
                  </div>
                  <div className="flex items-center p-2 rounded-md hover:bg-primary/5 cursor-pointer transition-colors">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span>Access Control Policy Template</span>
                  </div>
                  <div className="flex items-center p-2 rounded-md hover:bg-primary/5 cursor-pointer transition-colors">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span>Incident Response Policy Template</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View All Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}