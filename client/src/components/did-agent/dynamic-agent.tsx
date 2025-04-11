import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

interface DynamicAgentProps {
  height?: string;
  width?: string;
  className?: string;
}

type AgentStatus = 'loading' | 'ready' | 'error';

interface DIDCredentials {
  agentId: string;
  clientKey: string;
}

const DynamicAgent = ({ height = '500px', width = '100%', className = '' }: DynamicAgentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<AgentStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [credentials, setCredentials] = useState<DIDCredentials | null>(null);
  const didInstanceDivId = 'dynamic-did-agent';

  const fetchCredentials = async () => {
    try {
      setStatus('loading');
      setErrorMessage('');
      
      const response = await fetch('/api/did-agent/credentials');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch D-ID credentials');
      }
      
      const data = await response.json();
      setCredentials(data);
      return data;
    } catch (error) {
      console.error('Error fetching D-ID credentials:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      setStatus('error');
      return null;
    }
  };

  const initializeAgent = async () => {
    try {
      // First ensure we have credentials
      const creds = credentials || await fetchCredentials();
      if (!creds) return;
      
      // Remove any existing script to avoid conflicts
      const existingScript = document.getElementById('did-script');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Create the container element if it doesn't exist
      if (!document.getElementById(didInstanceDivId) && containerRef.current) {
        const agentDiv = document.createElement('div');
        agentDiv.id = didInstanceDivId;
        agentDiv.style.width = '100%';
        agentDiv.style.height = '100%';
        containerRef.current.appendChild(agentDiv);
      }
      
      // Create and add the D-ID script with our credentials
      const script = document.createElement('script');
      script.id = 'did-script';
      script.type = 'module';
      script.src = 'https://agent.d-id.com/v1/index.js';
      script.setAttribute('data-name', didInstanceDivId);
      script.setAttribute('data-client-key', creds.clientKey);
      script.setAttribute('data-agent-id', creds.agentId);
      script.setAttribute('data-monitor', 'true');
      
      // Add the script to the document
      document.body.appendChild(script);
      console.log('D-ID script added to document');
      
      // Listen for messages from the D-ID agent
      const messageHandler = (event: MessageEvent) => {
        const data = event.data;
        if (data && data.source === didInstanceDivId) {
          console.log('D-ID agent event:', data);
          
          if (data.type === 'ready') {
            setStatus('ready');
          } else if (data.type === 'error') {
            setErrorMessage(data.error || 'Unknown D-ID agent error');
            setStatus('error');
          }
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      // Return cleanup function
      return () => {
        window.removeEventListener('message', messageHandler);
      };
    } catch (error) {
      console.error('Error initializing D-ID agent:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error initializing agent');
      setStatus('error');
    }
  };

  const handleRetry = () => {
    initializeAgent();
  };

  useEffect(() => {
    // Initial setup
    const setup = async () => {
      await fetchCredentials();
    };
    
    setup();
  }, []);

  useEffect(() => {
    // Initialize agent when credentials are available
    if (credentials) {
      let cleanupFn: (() => void) | undefined;
      
      // Initialize and get cleanup function
      // Initialize agent
      initializeAgent().then(cleanup => {
        cleanupFn = cleanup;
      });
      
      // Return cleanup function for useEffect
      return () => {
        if (cleanupFn) cleanupFn();
      };
    }
  }, [credentials]);

  return (
    <Card className={`relative overflow-hidden ${className}`} style={{ height, width }}>
      <div 
        ref={containerRef} 
        className="w-full h-full"
      />
      
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-center text-muted-foreground">Loading virtual consultant...</p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <Alert variant="destructive" className="mb-4 max-w-md">
            <AlertTitle>Failed to load virtual consultant</AlertTitle>
            <AlertDescription>{errorMessage || 'An unknown error occurred'}</AlertDescription>
          </Alert>
          <div className="flex gap-2 mb-4">
            <Button onClick={handleRetry} variant="default">Retry</Button>
            <Button onClick={() => window.location.href = '/integrated-agent'} variant="outline">
              Try Integrated Version
            </Button>
          </div>
          <Alert className="mb-4 max-w-md">
            <AlertTitle className="text-sm font-medium">Troubleshooting Tips</AlertTitle>
            <AlertDescription className="text-xs">
              <ul className="list-disc pl-4 space-y-1 mt-2">
                <li>Check if your browser supports modern JavaScript features</li>
                <li>Ensure you have a stable internet connection</li>
                <li>Try disabling browser extensions that might block scripts</li>
                <li>Try a different browser (Chrome or Edge recommended)</li>
              </ul>
            </AlertDescription>
          </Alert>
          <p className="text-xs text-muted-foreground mt-2">
            Still having issues? Try our <a href="/frame-agent" className="underline">alternative implementations</a>
          </p>
        </div>
      )}
      
      {status === 'ready' && (
        <div className="absolute bottom-2 right-2 flex items-center justify-center bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
          <span className="text-xs text-muted-foreground">Virtual consultant ready</span>
        </div>
      )}
    </Card>
  );
};

export default DynamicAgent;