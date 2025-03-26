import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X, Plus, Upload } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Company info form schema
const companyFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  ceoName: z.string().min(2, "CEO name must be at least 2 characters"),
  cioName: z.string().min(2, "CIO name must be at least 2 characters"),
  ctoName: z.string().min(2, "CTO name must be at least 2 characters"),
  cisoName: z.string().min(2, "CISO name must be at least 2 characters"),
  cybersecurityStaff: z.array(z.string()),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function CompanyInfoForm() {
  const [staffMembers, setStaffMembers] = React.useState<string[]>(['', '']);
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "",
      ceoName: "",
      cioName: "",
      ctoName: "",
      cisoName: "",
      cybersecurityStaff: ['', ''],
    },
  });

  const onSubmit = (data: CompanyFormValues) => {
    // Filter out empty staff members
    data.cybersecurityStaff = data.cybersecurityStaff.filter(staff => staff.trim() !== '');
    console.log("Company form data:", data);
    // Here you would typically make an API call to save the company info
  };
  
  const addStaffMember = () => {
    const newStaffMembers = [...staffMembers, ''];
    setStaffMembers(newStaffMembers);
    form.setValue('cybersecurityStaff', newStaffMembers);
  };
  
  const removeStaffMember = (index: number) => {
    const newStaffMembers = staffMembers.filter((_, i) => i !== index);
    setStaffMembers(newStaffMembers);
    form.setValue('cybersecurityStaff', newStaffMembers);
  };
  
  const updateStaffMember = (index: number, value: string) => {
    const newStaffMembers = [...staffMembers];
    newStaffMembers[index] = value;
    setStaffMembers(newStaffMembers);
    form.setValue('cybersecurityStaff', newStaffMembers);
  };

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
      <CardHeader>
        <CardTitle>Company Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Logo Upload */}
            <div className="mb-6">
              <FormLabel className="block text-sm font-medium mb-2">Company Logo</FormLabel>
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-md bg-background border border-border flex items-center justify-center mr-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                  >
                    Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG or SVG (max. 2MB)</p>
                </div>
              </div>
            </div>
            
            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corporation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Executive Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ceoName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEO Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cioName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CIO Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Sarah Johnson" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ctoName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTO Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Michael Brown" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cisoName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CISO Name</FormLabel>
                    <FormControl>
                      <Input placeholder="David Chen" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Cybersecurity Staff */}
            <div className="mb-6">
              <FormLabel className="block text-sm font-medium mb-2">Cybersecurity Staff</FormLabel>
              <div className="space-y-2">
                {staffMembers.map((member, index) => (
                  <div key={index} className="flex items-center">
                    <Input
                      value={member}
                      onChange={(e) => updateStaffMember(index, e.target.value)}
                      placeholder="Staff Member Name"
                      className="flex-1 rounded-r-none"
                    />
                    <Button
                      type="button"
                      onClick={() => removeStaffMember(index)}
                      variant="destructive"
                      size="icon"
                      className="rounded-l-none h-10 w-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button
                type="button"
                onClick={addStaffMember}
                variant="ghost"
                className="mt-2 text-sm text-primary hover:bg-primary/10"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Another Staff Member
              </Button>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">Save Company Information</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
