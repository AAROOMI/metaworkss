import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Policy upload form schema
const policyUploadSchema = z.object({
  policyType: z.string().min(1, "Please select a policy type"),
});

type PolicyUploadValues = z.infer<typeof policyUploadSchema>;

export default function PolicyUpload() {
  const form = useForm<PolicyUploadValues>({
    resolver: zodResolver(policyUploadSchema),
    defaultValues: {
      policyType: "",
    },
  });

  const onSubmit = (data: PolicyUploadValues) => {
    console.log("Policy upload data:", data);
    // Here you would typically handle the file upload and policy type
  };

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
      <CardHeader>
        <CardTitle>Policy Document Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel>Upload Policy Document</FormLabel>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/20 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-1 text-sm text-muted-foreground">Drag and drop your document here, or click to browse</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  Select Document
                </Button>
                <p className="mt-1 text-xs text-muted-foreground">DOCX, PDF (max. 10MB)</p>
              </div>
            </FormItem>
            
            <FormField
              control={form.control}
              name="policyType"
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
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit">Process Document</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
