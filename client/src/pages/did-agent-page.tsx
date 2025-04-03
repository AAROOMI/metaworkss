import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function DIDAgentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agentReady, setAgentReady] = useState(false);

  useEffect(() => {
    // Check if D-ID keys are available
    async function checkDIDKeys() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/did-keys');
        const data = await response.json();
        
        if (!data.clientKey || !data.agentId) {
          setError('Missing D-ID API credentials. Please contact support.');
        } else {
          setAgentReady(true);
        }
      } catch (error) {
        console.error('Error checking D-ID keys:', error);
        setError('Failed to connect to D-ID service. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    checkDIDKeys();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">MetaWorks Virtual Cybersecurity Consultant</CardTitle>
          <CardDescription className="text-center">
            Ask questions about cybersecurity compliance, risk management, and security policies
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Virtual Consultant Error</AlertTitle>
              <AlertDescription>
                {error}
                <div className="mt-4">
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center justify-center p-2">
            <iframe 
              src="/simple-agent.html" 
              title="MetaWorks Virtual Consultant" 
              className="w-full h-[600px] border rounded-lg overflow-hidden"
              allow="camera; microphone; autoplay; clipboard-write"
              allowFullScreen
              style={{ opacity: agentReady ? 1 : 0 }}
              onLoad={() => setIsLoading(false)}
            />
            
            {isLoading && (
              <div className="absolute flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-center text-muted-foreground">Loading your virtual consultant...</p>
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Virtual consultant powered by D-ID AI technology.</p>
            <p>Your conversation is private and used only to provide assistance.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}