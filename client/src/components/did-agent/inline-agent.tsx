import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface InlineAgentProps {
  height?: string;
  width?: string;
  className?: string;
  containerClassName?: string;
}

/**
 * InlineAgent component uses the exact script tag inline as provided in the example.
 * This is the most direct implementation to ensure compatibility with D-ID requirements.
 */
export default function InlineAgent({
  height = '400px',
  width = '100%',
  className = '',
  containerClassName = '',
}: InlineAgentProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const agentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if agent loaded properly after a timeout
    const checkAgentLoaded = setTimeout(() => {
      if (agentRef.current) {
        // Check if the agent div has any child elements (indicating the agent loaded)
        if (agentRef.current.childElementCount > 0) {
          setLoading(false);
        } else {
          setError('Agent failed to load. Please try refreshing the page.');
          setLoading(false);
        }
      }
    }, 10000); // 10 seconds timeout

    // Handle D-ID agent messages
    const handleAgentMessages = (event: MessageEvent) => {
      const data = event.data;
      if (data && data.source === 'did-agent') {
        console.log('D-ID Agent event:', data);
        if (data.type === 'ready') {
          setLoading(false);
        } else if (data.type === 'error') {
          setError(data.error || 'Unknown D-ID error');
          setLoading(false);
        }
      }
    };

    window.addEventListener('message', handleAgentMessages);

    return () => {
      clearTimeout(checkAgentLoaded);
      window.removeEventListener('message', handleAgentMessages);
    };
  }, []);

  return (
    <div className={`${containerClassName}`}>
      <div 
        style={{ height, width, position: 'relative' }}
        className={`bg-card rounded-lg overflow-hidden ${className}`}
      >
        {/* This div will contain the D-ID agent */}
        <div id="did-agent" ref={agentRef} style={{ width: '100%', height: '100%' }}></div>
        
        {/* Inline script to load D-ID agent */}
        <script
          type="module"
          src="https://agent.d-id.com/v1/index.js"
          data-name="did-agent"
          data-mode="fabio" 
          data-client-key="Z29vZ2xlLW9hdXRoMnwxMDc5MjM0NjY3NDY1MDUyMTM2OTE6WHJvRFFSYnBHMng2SXJGRDlIcjZD"
          data-agent-id="agt_YjpQXzSG"
          data-monitor="true"
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