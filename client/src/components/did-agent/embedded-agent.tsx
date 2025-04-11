import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface EmbeddedAgentProps {
  height?: string;
  width?: string;
  className?: string;
  containerClassName?: string;
}

/**
 * EmbeddedAgent component that directly embeds the D-ID Agent script
 * with hardcoded credentials.
 */
export default function EmbeddedAgent({
  height = '400px',
  width = '100%',
  className = '',
  containerClassName = '',
}: EmbeddedAgentProps) {
  const agentContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    function initializeAgent() {
      try {
        if (!agentContainerRef.current) {
          throw new Error('Agent container not found');
        }

        // Create script with hardcoded credentials
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://agent.d-id.com/v1/index.js';
        script.dataset.name = 'did-agent';
        script.dataset.mode = 'fabio';
        script.dataset.clientKey = 'Z29vZ2xlLW9hdXRoMnwxMDc5MjM0NjY3NDY1MDUyMTM2OTE6WHJvRFFSYnBHMng2SXJGRDlIcjZD';
        script.dataset.agentId = 'agt_YjpQXzSG';
        script.dataset.monitor = 'true';
        
        // Only add the script if it doesn't already exist and component is still mounted
        if (isMounted && agentContainerRef.current && !agentContainerRef.current.querySelector('script')) {
          agentContainerRef.current.appendChild(script);
          
          // Log any script loading errors
          script.onerror = (err) => {
            console.error('Error loading D-ID agent script:', err);
            if (isMounted) {
              setError('Failed to load virtual agent');
              setLoading(false);
            }
          };
          
          script.onload = () => {
            console.log('D-ID agent script loaded successfully');
            if (isMounted) {
              setLoading(false);
            }
          };
        }
      } catch (error) {
        console.error('Error initializing D-ID agent:', error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Failed to initialize virtual agent');
          setLoading(false);
        }
      }
    }
    
    // Initialize agent and monitor for events
    initializeAgent();
    
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && data.source === 'did-agent') {
        console.log('D-ID Agent event:', data);
        if (data.type === 'ready' && isMounted) {
          setLoading(false);
        } else if (data.type === 'error' && isMounted) {
          setError(data.error || 'Unknown D-ID error');
          setLoading(false);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Cleanup function
    return () => {
      isMounted = false;
      window.removeEventListener('message', handleMessage);
      if (agentContainerRef.current) {
        const scriptElement = agentContainerRef.current.querySelector('script');
        if (scriptElement) {
          agentContainerRef.current.removeChild(scriptElement);
        }
      }
    };
  }, []);

  return (
    <div className={`${containerClassName}`}>
      <div 
        ref={agentContainerRef}
        style={{ height, width }}
        className={`bg-card rounded-lg overflow-hidden relative ${className}`}
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/90 z-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading virtual assistant...</p>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card p-4 z-10">
            <div className="bg-destructive/10 text-destructive rounded-lg p-4 max-w-md text-center">
              <p className="font-medium mb-2">Error loading virtual assistant</p>
              <p className="text-sm mb-4">{error}</p>
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}