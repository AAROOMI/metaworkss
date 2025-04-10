import { useState } from "react";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface Risk {
  id?: number;
  title: string;
  description: string;
  cause?: string;
  category: string;
  owner?: string;
  likelihood: string;
  impact: string;
  inherentRiskLevel: string;
  existingControls?: string;
  controlEffectiveness?: string;
  residualRiskLevel?: string;
  mitigationActions?: string;
  targetDate?: string;
  isAccepted: boolean;
  companyId?: number;
}

interface RiskEntryFormProps {
  onSuccess?: () => void;
  initialData?: Risk;
  companyId?: number;
}

const riskSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  cause: z.string().optional(),
  category: z.string().min(1, { message: "Please select a category" }),
  owner: z.string().optional(),
  likelihood: z.string().min(1, { message: "Please select likelihood" }),
  impact: z.string().min(1, { message: "Please select impact" }),
  inherentRiskLevel: z.string().min(1, { message: "Please select inherent risk level" }),
  existingControls: z.string().optional(),
  controlEffectiveness: z.string().optional(),
  residualRiskLevel: z.string().optional(),
  mitigationActions: z.string().optional(),
  targetDate: z.string().optional(),
  isAccepted: z.boolean().default(false),
  companyId: z.number().optional(),
});

export type RiskFormValues = z.infer<typeof riskSchema>;

export default function RiskEntryForm({ onSuccess, initialData, companyId }: RiskEntryFormProps) {
  const [targetDateString, setTargetDateString] = useState<string | undefined>(initialData?.targetDate);
  const [step, setStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  
  const defaultValues: Partial<RiskFormValues> = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    cause: initialData?.cause || "",
    category: initialData?.category || "",
    owner: initialData?.owner || "",
    likelihood: initialData?.likelihood || "",
    impact: initialData?.impact || "",
    inherentRiskLevel: initialData?.inherentRiskLevel || "",
    existingControls: initialData?.existingControls || "",
    controlEffectiveness: initialData?.controlEffectiveness || "",
    residualRiskLevel: initialData?.residualRiskLevel || "",
    mitigationActions: initialData?.mitigationActions || "",
    targetDate: initialData?.targetDate || "",
    isAccepted: initialData?.isAccepted || false,
    companyId: companyId || initialData?.companyId,
  };
  
  const form = useForm<RiskFormValues>({
    resolver: zodResolver(riskSchema),
    defaultValues,
  });
  
  const saveRiskMutation = useMutation({
    mutationFn: async (values: RiskFormValues) => {
      const response = await apiRequest("POST", "/api/risks", {
        ...values,
        id: initialData?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Risk Updated" : "Risk Created",
        description: `The risk has been ${initialData ? "updated" : "created"} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/risks'] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: initialData ? "Error Updating Risk" : "Error Creating Risk",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
  
  function onSubmit(values: RiskFormValues) {
    setIsSaving(true);
    saveRiskMutation.mutate(values);
  }

  // Define the different form steps
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className="text-lg font-medium">Step 1: Risk Identification</h3>
              <p className="text-sm text-muted-foreground">Start by defining the basic information about this risk.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Title <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Missing IT Strategy" {...field} />
                    </FormControl>
                    <FormDescription>Provide a clear, concise title for this risk</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Category <span className="text-destructive">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Strategic">Strategic</SelectItem>
                        <SelectItem value="Operational">Operational</SelectItem>
                        <SelectItem value="Compliance">Compliance</SelectItem>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Categorize this risk for better organization</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Description <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide a detailed description of the risk"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Describe the risk in detail, including its potential impact</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cause"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Root Cause</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What causes this risk to occur?"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>Identify the underlying factors that give rise to this risk</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Owner</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., IT Department, CISO, CFO" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>Who is responsible for managing this risk?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className="text-lg font-medium">Step 2: Risk Assessment</h3>
              <p className="text-sm text-muted-foreground">Evaluate the likelihood and impact of this risk.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="likelihood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Likelihood <span className="text-destructive">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select likelihood" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Very Likely">Very Likely</SelectItem>
                        <SelectItem value="Likely">Likely</SelectItem>
                        <SelectItem value="Possible">Possible</SelectItem>
                        <SelectItem value="Unlikely">Unlikely</SelectItem>
                        <SelectItem value="Very Unlikely">Very Unlikely</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>How likely is this risk to occur?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="impact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impact <span className="text-destructive">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select impact" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Catastrophic">Catastrophic</SelectItem>
                        <SelectItem value="Major">Major</SelectItem>
                        <SelectItem value="Serious">Serious</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Minor">Minor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>What would be the severity if this risk occurs?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="inherentRiskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inherent Risk Level <span className="text-destructive">*</span></FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The overall risk level before any controls are applied</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className="text-lg font-medium">Step 3: Risk Mitigation</h3>
              <p className="text-sm text-muted-foreground">Define existing controls and mitigation plans.</p>
            </div>
            
            <FormField
              control={form.control}
              name="existingControls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Existing Controls</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What controls are already in place to address this risk?"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>List any current measures that help manage this risk</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="controlEffectiveness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Control Effectiveness</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select effectiveness" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Effective">Effective</SelectItem>
                      <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>How well do the existing controls work?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="residualRiskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Residual Risk Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The risk level after controls are applied</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mitigationActions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mitigation Actions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What additional actions can be taken to mitigate this risk?"
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>Describe the steps that should be taken to reduce this risk</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="targetDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Target Date for Mitigation</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), 'MMMM d, yyyy')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          const formattedDate = date ? format(date, 'yyyy-MM-dd') : undefined;
                          field.onChange(formattedDate);
                          setTargetDateString(formattedDate);
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>When should mitigation actions be completed by?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Risk Accepted</FormLabel>
                    <FormDescription>
                      Check this if the organization has formally accepted this risk
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Progress Steps */}
        <div className="w-full mb-8">
          <div className="flex justify-between mb-2">
            <div 
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border border-primary text-sm font-medium", 
                step === 1 ? "bg-primary text-primary-foreground" : "text-primary"
              )}
            >
              1
            </div>
            <div className={cn("flex-1 h-0.5 mx-2", step >= 2 ? "bg-primary" : "bg-muted")} />
            <div 
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border border-primary text-sm font-medium", 
                step === 2 ? "bg-primary text-primary-foreground" : step > 2 ? "text-primary" : "text-muted-foreground border-muted"
              )}
            >
              2
            </div>
            <div className={cn("flex-1 h-0.5 mx-2", step >= 3 ? "bg-primary" : "bg-muted")} />
            <div 
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border text-sm font-medium", 
                step === 3 ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-muted"
              )}
            >
              3
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <span className={step === 1 ? "text-primary font-medium" : "text-muted-foreground"}>Risk Identification</span>
            <span className={step === 2 ? "text-primary font-medium" : "text-muted-foreground"}>Risk Assessment</span>
            <span className={step === 3 ? "text-primary font-medium" : "text-muted-foreground"}>Risk Mitigation</span>
          </div>
        </div>
        
        {/* Step Content */}
        {renderStepContent()}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep(step - 1)}
            >
              Previous
            </Button>
          ) : (
            <div>{/* Empty div for spacing */}</div>
          )}
          
          {step < 3 ? (
            <Button 
              type="button" 
              onClick={() => {
                // Validate current step before proceeding
                const fieldsToValidate = step === 1 
                  ? ['title', 'description', 'category'] 
                  : ['likelihood', 'impact', 'inherentRiskLevel'];
                
                // Validate fields and advance to next step
                form.trigger(fieldsToValidate[0] as any).then(() => {
                  const hasErrors = fieldsToValidate.some(
                    field => form.formState.errors[field as keyof typeof form.formState.errors]
                  );
                  
                  if (!hasErrors) {
                    setStep(step + 1);
                  }
                });
                // Form validation is handled in the Promise above
              }}
            >
              Continue
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={saveRiskMutation.isPending || isSaving}
              className="bg-primary"
            >
              {saveRiskMutation.isPending || isSaving ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                initialData ? "Update Risk" : "Add Risk"
              )}
            </Button>
          )}
        </div>

      </form>
    </Form>
  );
}