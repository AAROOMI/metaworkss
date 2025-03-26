import React, { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import UserForm from "@/components/admin/user-form";
import UserList from "@/components/admin/user-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyInfoForm from "@/components/company/company-info-form";
import PolicyUpload from "@/components/company/policy-upload";
import PolicyList from "@/components/company/policy-list";

export default function AdminPage() {
  const [showUserForm, setShowUserForm] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Admin Control Panel</h1>
          </div>
          
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="company">Company Information</TabsTrigger>
              <TabsTrigger value="policies">Policy Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4">
              {showUserForm ? (
                <UserForm onCancel={() => setShowUserForm(false)} />
              ) : (
                <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>User Management</CardTitle>
                    <button 
                      onClick={() => setShowUserForm(true)} 
                      className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Add New User
                    </button>
                  </CardHeader>
                  <CardContent>
                    <UserList />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="company" className="space-y-4">
              <CompanyInfoForm />
            </TabsContent>
            
            <TabsContent value="policies" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PolicyUpload />
                <PolicyList />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
