import React, { useEffect, useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw } from 'lucide-react';

interface DIDConsultantProps {
  className?: string;
  fullscreen?: boolean;
  title?: string;
  description?: string;
}

/**
 * DID Consultant Component
 * 
 * This component provides integration with D-ID's agent system
 * using our backend proxy to avoid CORS issues when accessing
 * their API directly.
 */
const DIDConsultant: React.FC<DIDConsultantProps> = ({
  className = '',
  fullscreen = false,
  title = 'Virtual Security Consultant',
  description = 'Get expert assistance with your security and compliance needs.'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agentConfig, setAgentConfig] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const didAgentRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const agentLoadedRef = useRef<boolean>(false);

  // Clean up function - remove any D-ID scripts when component unmounts
  useEffect(() => {
    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  // Fetch the configuration from our secure API
  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/did/config');
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        const config = await response.json();
        if (!config.scriptUrl || !config.agentConfig) {
          throw new Error('Invalid configuration received from server');
        }
        
        setAgentConfig(config);
        loadScript(config.scriptUrl, config.agentConfig);
      } catch (err: any) {
        console.error('Error getting D-ID config:', err);
        setError(err.message || 'Failed to get configuration');
        setLoading(false);
        toast({
          title: 'Configuration Error',
          description: 'Failed to get D-ID configuration. Please try again.',
          variant: 'destructive',
        });
      }
    }
    
    fetchConfig();
  }, []);

  // Load the D-ID script with the configuration
  const loadScript = (scriptUrl: string, config: any) => {
    try {
      // Remove any existing script
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }

      // Create the script element
      const script = document.createElement('script');
      script.type = 'module';
      script.src = scriptUrl;
      
      // Set all configuration attributes
      script.setAttribute('data-name', 'did-agent');
      script.setAttribute('data-target', '#did-agent-container');
      
      // Apply all config properties from the server
      Object.entries(config).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          script.setAttribute(`data-${key}`, value ? 'true' : 'false');
        } else {
          script.setAttribute(`data-${key}`, String(value));
        }
      });
      
      // Handle script events
      script.onload = () => {
        console.log('D-ID Agent script loaded successfully');
        agentLoadedRef.current = true;
        setLoading(false);
      };
      
      script.onerror = (e) => {
        console.error('Error loading D-ID Agent script:', e);
        setError('Failed to load the virtual consultant script. Please try again.');
        setLoading(false);
      };

      // Save reference and append to body
      scriptRef.current = script;
      document.body.appendChild(script);
    } catch (err: any) {
      console.error('Error setting up D-ID agent:', err);
      setError(err.message || 'Failed to initialize the virtual consultant');
      setLoading(false);
    }
  };

  // Handle retry button click
  const handleRetry = () => {
    if (agentConfig) {
      setError(null);
      setLoading(true);
      loadScript(agentConfig.scriptUrl, agentConfig.agentConfig);
    } else {
      // If we don't have config yet, reload the page
      window.location.reload();
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={`p-0 ${fullscreen ? 'h-[calc(100vh-140px)]' : 'h-[500px]'} relative`}>
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Loading your virtual consultant...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="max-w-md p-6 bg-card rounded-lg shadow-lg text-center">
              <div className="mb-4 text-destructive">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Failed to load Consultant</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRetry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* D-ID Agent Container */}
        <div 
          id="did-agent-container" 
          ref={didAgentRef}
          className="w-full h-full bg-black/10"
        ></div>
      </CardContent>
    </Card>
  );
};

export default DIDConsultant;