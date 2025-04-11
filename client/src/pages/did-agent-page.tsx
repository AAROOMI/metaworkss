import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import DIDConsultant from '@/components/did-agent/did-consultant';

const DIDAgentPage = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Helmet>
        <title>MetaWorks | Security Consultant</title>
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
          <h1 className="text-xl font-semibold">MetaWorks Security Consultant</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Security Assistant</h2>
            <p className="text-muted-foreground mb-6">
              Meet your personal cybersecurity consultant. Ask questions about security best practices, 
              compliance frameworks, or get assistance with any security-related tasks.
            </p>
          </div>
          
          {/* Direct D-ID Agent Integration */}
          <DIDConsultant 
            title="Interactive Security Consultant" 
            description="Ask me any questions about your security program, compliance requirements, or best practices."
          />
          
          {/* Additional Information and Resources */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-md border">
              <h3 className="text-lg font-semibold mb-2">Recent Compliance Updates</h3>
              <ul className="space-y-2">
                <li className="text-sm">NCA ECC 2.0 compliance framework updates</li>
                <li className="text-sm">New SAMA cybersecurity regulations</li>
                <li className="text-sm">ISO 27001:2022 transition guidance</li>
                <li className="text-sm">PDPL implementation best practices</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-md border">
              <h3 className="text-lg font-semibold mb-2">Topics You Can Discuss</h3>
              <ul className="space-y-2">
                <li className="text-sm">Security policy development guidance</li>
                <li className="text-sm">Risk management best practices</li>
                <li className="text-sm">Compliance gap remediation</li>
                <li className="text-sm">Security awareness training recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DIDAgentPage;