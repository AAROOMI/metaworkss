import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  Clock, 
  Filter, 
  HelpCircle,
  Info,
  Plus, 
  RefreshCw, 
  Search,
  Upload,
  XCircle
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/use-auth";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import RiskEntryForm, { Risk } from "@/components/risks/risk-entry-form";
import RiskBulkImport from "@/components/risks/risk-bulk-import";

export default function RiskManagementPage() {
  const { user } = useAuth();
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch risks
  const { data: risks, isLoading, isError, refetch } = useQuery<Risk[]>({
    queryKey: ['/api/risks'],
    throwOnError: false,
  });
  
  // Filter risks based on search term and active tab
  const filteredRisks = risks?.filter(risk => {
    const matchesSearch = searchTerm === "" || 
      risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
      (activeTab === "high" && risk.inherentRiskLevel === "High") ||
      (activeTab === "medium" && risk.inherentRiskLevel === "Medium") ||
      (activeTab === "low" && risk.inherentRiskLevel === "Low") ||
      (activeTab === "accepted" && risk.isAccepted);
      
    return matchesSearch && matchesTab;
  });
  
  const riskLevelColor = (level?: string) => {
    switch (level) {
      case "High": return "text-destructive";
      case "Medium": return "text-amber-500";
      case "Low": return "text-green-500";
      default: return "text-gray-500";
    }
  };
  
  const handleRiskClick = (risk: Risk) => {
    setSelectedRisk(risk);
    setIsEditDialogOpen(true);
  };
  
  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch();
  };
  
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedRisk(null);
    refetch();
  };
  
  const handleImportSuccess = () => {
    setIsImportDialogOpen(false);
    refetch();
  };
  
  // Calculate risk statistics
  const totalRisks = risks?.length || 0;
  const highRisks = risks?.filter(r => r.inherentRiskLevel === "High").length || 0;
  const mediumRisks = risks?.filter(r => r.inherentRiskLevel === "Medium").length || 0;
  const lowRisks = risks?.filter(r => r.inherentRiskLevel === "Low").length || 0;
  const acceptedRisks = risks?.filter(r => r.isAccepted).length || 0;
  
  return (
    <>
      <Helmet>
        <title>Risk Management | MetaWorks</title>
      </Helmet>
      
      <div className="flex flex-col h-full gap-4 p-4 md:p-6">
        <PageHeader
          title="Risk Management"
          description="Identify, assess and manage cybersecurity risks"
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImportDialogOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Bulk Import
              </Button>
              <Button
                size="sm"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Risk
              </Button>
            </div>
          }
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="py-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                Total Risks
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-4xl font-bold">
                {isLoading ? <Skeleton className="h-10 w-16" /> : totalRisks}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {totalRisks === 0 ? "No risks identified yet" : 
                `${acceptedRisks} accepted, ${totalRisks - acceptedRisks} open`}
              </p>
            </CardContent>
            {!isLoading && (
              <CardFooter className="pt-0 pb-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm px-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add new risk
                </Button>
              </CardFooter>
            )}
          </Card>
          
          <TooltipProvider>
            <Card className={cn("bg-card/50 backdrop-blur border", {
              "border-red-200 dark:border-red-800": highRisks > 0,
              "border": highRisks === 0
            })}>
              <CardHeader className="py-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="p-2 bg-red-100 dark:bg-red-950 rounded-full">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                  High Risks
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-4xl font-bold text-destructive">
                  {isLoading ? <Skeleton className="h-10 w-16" /> : highRisks}
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground mt-1 cursor-help">
                      {highRisks === 0 ? "No high risks identified" : 
                      `${highRisks} high risk ${highRisks === 1 ? 'item requires' : 'items require'} immediate attention`}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="start">
                    <p>High risks may cause severe impact to the organization and require immediate mitigation</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
              {!isLoading && highRisks > 0 && (
                <CardFooter className="pt-0 pb-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-sm px-0 text-destructive hover:text-destructive"
                    onClick={() => setActiveTab("high")}
                  >
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    View high risks
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TooltipProvider>
          
          <TooltipProvider>
            <Card className={cn("bg-card/50 backdrop-blur border", {
              "border-amber-200 dark:border-amber-800": mediumRisks > 0,
              "border": mediumRisks === 0
            })}>
              <CardHeader className="py-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="p-2 bg-amber-100 dark:bg-amber-950 rounded-full">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  </div>
                  Medium Risks
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-4xl font-bold text-amber-500">
                  {isLoading ? <Skeleton className="h-10 w-16" /> : mediumRisks}
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground mt-1 cursor-help">
                      {mediumRisks === 0 ? "No medium risks identified" : 
                      `${mediumRisks} medium risk ${mediumRisks === 1 ? 'item needs' : 'items need'} attention`}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="start">
                    <p>Medium risks have moderate impact and should be addressed with planned controls</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
              {!isLoading && mediumRisks > 0 && (
                <CardFooter className="pt-0 pb-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-sm px-0 text-amber-500 hover:text-amber-600"
                    onClick={() => setActiveTab("medium")}
                  >
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    View medium risks
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TooltipProvider>
          
          <TooltipProvider>
            <Card className={cn("bg-card/50 backdrop-blur border", {
              "border-green-200 dark:border-green-800": lowRisks > 0,
              "border": lowRisks === 0
            })}>
              <CardHeader className="py-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="p-2 bg-green-100 dark:bg-green-950 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  Low Risks
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-4xl font-bold text-green-500">
                  {isLoading ? <Skeleton className="h-10 w-16" /> : lowRisks}
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground mt-1 cursor-help">
                      {lowRisks === 0 ? "No low risks identified" : 
                      `${lowRisks} low risk ${lowRisks === 1 ? 'item' : 'items'} with minimal impact`}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="start">
                    <p>Low risks have minimal impact and can be addressed through routine procedures</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
              {!isLoading && lowRisks > 0 && (
                <CardFooter className="pt-0 pb-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-sm px-0 text-green-500 hover:text-green-600"
                    onClick={() => setActiveTab("low")}
                  >
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    View low risks
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TooltipProvider>
        </div>
        
        <Card className="flex-1 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Risk Register</CardTitle>
                <CardDescription>View and manage all identified risks</CardDescription>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search risks..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                  {searchTerm && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setSearchTerm("")}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => setActiveTab("all")}>
                              All Risks
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveTab("high")}>
                              <span className="text-destructive font-medium mr-2">●</span>
                              High Risks
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveTab("medium")}>
                              <span className="text-amber-500 font-medium mr-2">●</span>
                              Medium Risks
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveTab("low")}>
                              <span className="text-green-500 font-medium mr-2">●</span>
                              Low Risks
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setActiveTab("accepted")}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Accepted Risks
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filter risks by category</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSearchTerm("");
                          setActiveTab("all");
                          refetch();
                        }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset filters and refresh</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="high" className="text-destructive">High</TabsTrigger>
                <TabsTrigger value="medium" className="text-amber-500">Medium</TabsTrigger>
                <TabsTrigger value="low" className="text-green-500">Low</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="m-0">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Likelihood</TableHead>
                        <TableHead>Impact</TableHead>
                        <TableHead>Inherent Risk</TableHead>
                        <TableHead>Residual Risk</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(5).fill(0).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell colSpan={7}>
                              <Skeleton className="h-10 w-full" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : isError ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-destructive">
                            <AlertCircle className="mx-auto h-6 w-6 mb-2" />
                            <p>Failed to load risks. Please try again.</p>
                          </TableCell>
                        </TableRow>
                      ) : filteredRisks?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12">
                            <div className="max-w-md mx-auto space-y-4">
                              {risks?.length === 0 ? (
                                <>
                                  <div className="flex justify-center">
                                    <div className="p-4 bg-muted rounded-full">
                                      <AlertCircle className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                  </div>
                                  <h3 className="text-lg font-medium">No risks in your register yet</h3>
                                  <p className="text-muted-foreground">
                                    Begin by adding risks to your register to track and manage your cybersecurity risk exposure.
                                  </p>
                                  <div className="flex justify-center pt-4">
                                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Your First Risk
                                    </Button>
                                  </div>
                                  <div className="pt-2">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setIsImportDialogOpen(true)}
                                      className="text-sm"
                                    >
                                      <Upload className="h-4 w-4 mr-2" />
                                      Or Import Risks in Bulk
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex justify-center">
                                    <div className="p-4 bg-muted rounded-full">
                                      <Search className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                  </div>
                                  <h3 className="text-lg font-medium">No matching risks found</h3>
                                  <p className="text-muted-foreground">
                                    Try adjusting your search or filter criteria to find what you're looking for.
                                  </p>
                                  <div className="flex justify-center pt-2">
                                    <Button 
                                      variant="outline"
                                      onClick={() => {
                                        setSearchTerm("");
                                        setActiveTab("all");
                                      }}
                                    >
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Reset Filters
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRisks?.map((risk) => (
                          <TableRow 
                            key={risk.id} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleRiskClick(risk)}
                          >
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="cursor-help">
                                      <div className="font-medium">{risk.title}</div>
                                      <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                                        {risk.description}
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-md">
                                    <div className="space-y-2">
                                      <p className="font-bold">{risk.title}</p>
                                      <p>{risk.description}</p>
                                      {risk.cause && (
                                        <div>
                                          <span className="font-semibold">Cause: </span>
                                          <span>{risk.cause}</span>
                                        </div>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="whitespace-nowrap">{risk.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="cursor-help">
                                    {risk.likelihood}
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Likelihood of this risk occurring</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="cursor-help">
                                    {risk.impact}
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Potential impact if this risk materializes</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="cursor-help">
                                    <span className={cn("font-semibold rounded-full px-2 py-1", {
                                      "bg-red-100 dark:bg-red-950 text-destructive": risk.inherentRiskLevel === "High",
                                      "bg-amber-100 dark:bg-amber-950 text-amber-500": risk.inherentRiskLevel === "Medium",
                                      "bg-green-100 dark:bg-green-950 text-green-500": risk.inherentRiskLevel === "Low"
                                    })}>
                                      {risk.inherentRiskLevel}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Inherent risk before controls are applied</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="cursor-help">
                                    <span className={cn("font-semibold rounded-full px-2 py-1", {
                                      "bg-red-100 dark:bg-red-950 text-destructive": risk.residualRiskLevel === "High",
                                      "bg-amber-100 dark:bg-amber-950 text-amber-500": risk.residualRiskLevel === "Medium",
                                      "bg-green-100 dark:bg-green-950 text-green-500": risk.residualRiskLevel === "Low",
                                      "bg-gray-100 dark:bg-gray-800 text-gray-500": !risk.residualRiskLevel
                                    })}>
                                      {risk.residualRiskLevel || 'Not assessed'}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Remaining risk after controls are applied</p>
                                    {risk.existingControls && (
                                      <div className="mt-2">
                                        <span className="font-semibold">Controls: </span>
                                        <span>{risk.existingControls}</span>
                                      </div>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    {risk.isAccepted ? (
                                      <Badge variant="outline" className="border-green-500 text-green-500">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Accepted
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Open
                                      </Badge>
                                    )}
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {risk.isAccepted ? (
                                      <p>Risk has been officially accepted by management</p>
                                    ) : (
                                      <>
                                        <p>Risk requires mitigation action</p>
                                        {risk.mitigationActions && (
                                          <div className="mt-2">
                                            <span className="font-semibold">Action plan: </span>
                                            <span>{risk.mitigationActions}</span>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="high" className="m-0">
                <div className="border rounded-md">
                  <Table>
                    {/* Same table structure as the "all" tab */}
                    {/* This is just a different filter of the same data */}
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="medium" className="m-0">
                <div className="border rounded-md">
                  <Table>
                    {/* Same table structure as the "all" tab */}
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="low" className="m-0">
                <div className="border rounded-md">
                  <Table>
                    {/* Same table structure as the "all" tab */}
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="accepted" className="m-0">
                <div className="border rounded-md">
                  <Table>
                    {/* Same table structure as the "all" tab */}
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Create Risk Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Risk</DialogTitle>
            <DialogDescription>
              Enter the details of the new risk to add to the register
            </DialogDescription>
          </DialogHeader>
          <RiskEntryForm 
            onSuccess={handleCreateSuccess} 
            companyId={1} // Replace with actual company ID
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Risk Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Risk</DialogTitle>
            <DialogDescription>
              Update the details of this risk
            </DialogDescription>
          </DialogHeader>
          {selectedRisk && (
            <RiskEntryForm 
              initialData={selectedRisk}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Bulk Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Import Risks</DialogTitle>
            <DialogDescription>
              Import multiple risks at once using JSON or file upload
            </DialogDescription>
          </DialogHeader>
          <RiskBulkImport 
            onSuccess={handleImportSuccess}
            companyId={1} // Replace with actual company ID
          />
        </DialogContent>
      </Dialog>
    </>
  );
}