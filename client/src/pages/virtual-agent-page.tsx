import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import DirectAgent from '@/components/did-agent/direct-agent';

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
      
      {/* Main Content - Use our new Direct Agent Component */}
      <div className="flex-1 overflow-hidden p-4">
        <DirectAgent fullPage={true} />
      </div>
    </div>
  );
};

export default VirtualAgentPage;