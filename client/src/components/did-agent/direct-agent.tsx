import React, { useEffect, useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface DirectAgentProps {
  fullPage?: boolean;
}

const DirectAgent: React.FC<DirectAgentProps> = ({ fullPage = false }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Clean up function to remove the script when component unmounts
    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const initializeDIDAgent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch credentials from our secure API
        const response = await fetch('/api/did/credentials');
        if (!response.ok) {
          throw new Error(`Server returned error: ${response.status}`);
        }

        const data = await response.json();
        if (!data.agentId || !data.clientKey) {
          throw new Error('Invalid credentials received from server');
        }

        // If there was a previous script, remove it
        if (scriptRef.current && document.body.contains(scriptRef.current)) {
          document.body.removeChild(scriptRef.current);
        }

        // Create a new script element with the credentials
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://agent.d-id.com/v1/index.js';
        script.setAttribute('data-name', 'did-agent');
        script.setAttribute('data-target', '#did-agent-container');
        script.setAttribute('data-mode', 'fabio');
        script.setAttribute('data-client-key', data.clientKey);
        script.setAttribute('data-agent-id', data.agentId);
        script.setAttribute('data-monitor', 'true');

        // Setup event listeners
        script.onload = () => {
          console.log('D-ID Agent script loaded successfully');
          setLoading(false);
        };

        script.onerror = (event) => {
          console.error('Error loading D-ID Agent script:', event);
          setError('Failed to load the D-ID agent. Please try again.');
          setLoading(false);
          toast({
            title: 'Error',
            description: 'Failed to load the virtual agent. Please try again.',
            variant: 'destructive',
          });
        };

        // Save script reference and append to document
        scriptRef.current = script;
        document.body.appendChild(script);

      } catch (err: any) {
        setError(err.message || 'Failed to initialize the D-ID agent');
        setLoading(false);
        console.error('Error initializing D-ID agent:', err);
        toast({
          title: 'Error',
          description: err.message || 'Failed to initialize the virtual agent',
          variant: 'destructive',
        });
      }
    };

    // Initialize the agent
    initializeDIDAgent();
  }, []);

  const handleRetry = () => {
    // Re-initialize the agent
    if (scriptRef.current && document.body.contains(scriptRef.current)) {
      document.body.removeChild(scriptRef.current);
      scriptRef.current = null;
    }
    setError(null);
    setLoading(true);
    
    // Use a small timeout to ensure DOM is updated
    setTimeout(() => {
      const event = new Event('retry-agent');
      window.dispatchEvent(event);
      window.location.reload();
    }, 100);
  };

  return (
    <div className={`relative ${fullPage ? 'h-full w-full' : 'h-[500px] w-full'}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading virtual consultant...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="max-w-md p-6 bg-card rounded-lg shadow-lg text-center">
            <div className="mb-4 text-destructive">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Failed to load the Virtual Agent</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      <div 
        id="did-agent-container" 
        ref={containerRef}
        className={`w-full ${fullPage ? 'h-full' : 'h-[500px]'} bg-black/20 rounded-lg overflow-hidden`}
      ></div>
    </div>
  );
};

export default DirectAgent;