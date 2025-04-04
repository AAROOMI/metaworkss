import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function DIDAgentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agentReady, setAgentReady] = useState(false);
  const didAgentContainerRef = useRef<HTMLDivElement>(null);

  // Load DID agent script on component mount
  useEffect(() => {
    setIsLoading(true);
    setAgentReady(false);
    
    const loadDIDAgent = () => {
      try {
        // If using iframe method (keeping as fallback option)
        if (window.location.hostname === 'localhost' || process.env.NODE_ENV === 'development') {
          setAgentReady(true);
          setIsLoading(false);
          return;
        }
        
        // Load D-ID agent directly
        const didScript = document.createElement('script');
        didScript.type = 'module';
        didScript.src = 'https://agent.d-id.com/v1/index.js';
        didScript.dataset.name = 'did-agent';
        didScript.dataset.mode = 'fabio';
        didScript.dataset.clientKey = 'Z29vZ2xlLW9hdXRoMnwxMDc5MjM0NjY3NDY1MDUyMTM2OTE6WHJvRFFSYnBHMng2SXJGRDlIcjZD';
        didScript.dataset.agentId = 'agt_YjpQXzSG';
        didScript.dataset.monitor = 'true';
        
        // Set up event handlers
        didScript.onload = () => {
          console.log('D-ID Agent script loaded successfully');
          setIsLoading(false);
          setAgentReady(true);
        };
        
        didScript.onerror = (error) => {
          console.error('Error loading D-ID Agent script:', error);
          setError('Failed to load virtual consultant. Please try again later.');
          setIsLoading(false);
        };
        
        // Add script to container
        if (didAgentContainerRef.current) {
          // Clear any previous content
          didAgentContainerRef.current.innerHTML = '';
          didAgentContainerRef.current.appendChild(didScript);
        }
      } catch (error) {
        console.error('Error initializing D-ID agent:', error);
        setError('Failed to initialize virtual consultant. Please try again later.');
        setIsLoading(false);
      }
    };
    
    loadDIDAgent();
    
    // Cleanup function
    return () => {
      if (didAgentContainerRef.current) {
        didAgentContainerRef.current.innerHTML = '';
      }
    };
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
          
          <div className="flex items-center justify-center p-2 relative">
            <div 
              ref={didAgentContainerRef}
              className="w-full h-[600px] border rounded-lg overflow-hidden bg-black"
              style={{ opacity: agentReady ? 1 : 0.3 }}
            >
              {/* DID Agent script will be loaded here */}
              <div id="did-agent" style={{ width: '100%', height: '100%' }}></div>
            </div>
            
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