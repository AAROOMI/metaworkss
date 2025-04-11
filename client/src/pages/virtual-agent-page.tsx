import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import DIDConsultant from '@/components/did-agent/did-consultant';

const VirtualAgentPage = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Helmet>
        <title>MetaWorks | Virtual Security Consultant</title>
      </Helmet>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Link href="/user-dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">MetaWorks Virtual Security Consultant</h1>
        </div>
      </div>
      
      {/* Main Content - Use our improved DID Consultant Component */}
      <div className="flex-1 overflow-hidden p-4">
        <DIDConsultant 
          fullscreen={true}
          title="Full-Featured Security Consultant" 
          description="Your personal AI-powered security advisor, ready to help with compliance, risk assessment, and best practices."
        />
      </div>
    </div>
  );
};

export default VirtualAgentPage;