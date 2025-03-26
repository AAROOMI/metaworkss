import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Check, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DocumentUpload from "./document-upload";

// Policy upload form schema
const policyUploadSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  type: z.string().min(1, "Please select a policy type"),
  content: z.string().optional(),
});

type PolicyUploadValues = z.infer<typeof policyUploadSchema>;

export default function PolicyUpload() {
  const [fileId, setFileId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<PolicyUploadValues>({
    resolver: zodResolver(policyUploadSchema),
    defaultValues: {
      title: "",
      type: "",
      content: "",
    },
  });

  // Create policy mutation
  const policyMutation = useMutation({
    mutationFn: async (data: PolicyUploadValues) => {
      const res = await apiRequest("POST", "/api/policies", data);
      return res.json();
    },
    onSuccess: async (policy) => {
      toast({
        title: "Policy created",
        description: "Your policy has been created successfully.",
      });
      
      // If a file was uploaded, attach it to the policy
      if (fileId) {
        try {
          await apiRequest("POST", `/api/policies/${policy.id}/attach-document`, { fileId });
          toast({
            title: "Document attached",
            description: "The document was attached to the policy.",
          });
        } catch (error) {
          toast({
            title: "Error attaching document",
            description: "The policy was created but we couldn't attach the document.",
            variant: "destructive",
          });
        }
      }
      
      // Reset the form
      form.reset();
      setFileId(null);
      
      // Invalidate policies query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/policies"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating policy",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PolicyUploadValues) => {
    policyMutation.mutate(data);
  };
  
  const handleDocumentUploaded = (uploadedFileId: number) => {
    setFileId(uploadedFileId);
    toast({
      title: "Document ready",
      description: "Document uploaded and ready to be attached to the policy.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Document Upload Component */}
      <DocumentUpload 
        onUploadComplete={handleDocumentUploaded}
        title="Policy Document Upload"
      />
      
      {/* Policy Details Form */}
      <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle>Policy Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {fileId && (
                <div className="bg-primary/10 border border-primary/20 rounded-md p-3 flex items-center">
                  <FileText className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium">Document uploaded and ready to attach</span>
                  <Check className="h-4 w-4 text-green-500 ml-auto" />
                </div>
              )}
            
              {/* Policy Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Information Security Policy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Policy Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a policy type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="information_security">Information Security Policy</SelectItem>
                        <SelectItem value="acceptable_use">Acceptable Use Policy</SelectItem>
                        <SelectItem value="data_protection">Data Protection Policy</SelectItem>
                        <SelectItem value="incident_response">Incident Response Plan</SelectItem>
                        <SelectItem value="business_continuity">Business Continuity Plan</SelectItem>
                        <SelectItem value="password">Password Policy</SelectItem>
                        <SelectItem value="remote_access">Remote Access Policy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Policy Content (Optional if document is uploaded) */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Content (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter policy text content here (optional if document is uploaded)"
                        className="min-h-[200px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={policyMutation.isPending}
                >
                  {policyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Policy"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
