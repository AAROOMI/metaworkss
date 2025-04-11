import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Loader2 } from 'lucide-react';

interface DirectAgentProps {
  height?: string;
  width?: string;
  className?: string;
  containerClassName?: string;
  onAgentReady?: () => void;
  onAgentError?: (error: string) => void;
}

export interface DirectAgentRef {
  reload: () => void;
}

/**
 * DirectAgent component that uses the exact D-ID Agent script structure
 * with direct integration as provided in the official example.
 * 
 * This version uses an iframe to ensure the script is loaded exactly as specified
 * in the documentation, which can help with compatibility.
 */
const DirectAgent = forwardRef<DirectAgentRef, DirectAgentProps>(({
  height = '400px',
  width = '100%',
  className = '',
  containerClassName = '',
  onAgentReady,
  onAgentError
}, ref) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(Date.now());
  
  // Create the reload function for the ref
  useImperativeHandle(ref, () => ({
    reload: () => {
      setIframeKey(Date.now());
      setLoading(true);
      setError(null);
    }
  }));

  // Generate HTML with the exact script format
  const generateAgentHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            background-color: transparent;
          }
        </style>
      </head>
      <body>
        <div id="did-agent" style="width:100%;height:100%;"></div>
        
        <script
          type="module"
          src="https://agent.d-id.com/v1/index.js"
          data-name="did-agent"
          data-mode="fabio"
          data-client-key="Z29vZ2xlLW9hdXRoMnwxMDc5MjM0NjY3NDY1MDUyMTM2OTE6WHJvRFFSYnBHMng2SXJGRDlIcjZD"
          data-agent-id="agt_YjpQXzSG"
          data-monitor="true">
        </script>
        
        <script>
          // Monitor for D-ID agent events
          window.addEventListener('message', (event) => {
            const data = event.data;
            if (data && data.source === 'did-agent') {
              // Forward the event to the parent window
              window.parent.postMessage(data, '*');
              
              if (data.type === 'ready') {
                console.log('D-ID Agent is ready');
              } else if (data.type === 'error') {
                console.error('D-ID Agent error:', data.error);
              }
            }
          });
        </script>
      </body>
      </html>
    `;
  };

  useEffect(() => {
    // Handle messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && data.source === 'did-agent') {
        if (data.type === 'ready') {
          setLoading(false);
          onAgentReady?.();
        } else if (data.type === 'error') {
          const errorMsg = data.error || 'Unknown D-ID error';
          setError(errorMsg);
          setLoading(false);
          onAgentError?.(errorMsg);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Add a timeout to detect loading issues
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('D-ID Agent loading timeout - still waiting');
      }
    }, 10000);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeout);
    };
  }, [loading, onAgentReady, onAgentError]);

  return (
    <div className={`${containerClassName}`}>
      <div 
        style={{ height, width }}
        className={`bg-card rounded-lg overflow-hidden relative ${className}`}
      >
        <iframe
          key={iframeKey}
          title="D-ID Virtual Agent"
          srcDoc={generateAgentHTML()}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          allow="camera; microphone; fullscreen; display-capture"
        />
        
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
                onClick={() => {
                  setIframeKey(Date.now());
                  setLoading(true);
                  setError(null);
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

DirectAgent.displayName = 'DirectAgent';

export default DirectAgent;