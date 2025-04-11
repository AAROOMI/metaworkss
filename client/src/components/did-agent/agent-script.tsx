import React, { useEffect, useRef } from 'react';

interface AgentScriptProps {
  height?: string;
  width?: string;
  className?: string;
  containerClassName?: string;
}

export default function AgentScript({
  height = '600px',
  width = '100%',
  className = '',
  containerClassName = '',
}: AgentScriptProps) {
  const agentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://agent.d-id.com/v1/index.js';
    script.dataset.name = 'did-agent';
    script.dataset.mode = 'fabio';
    
    // Set a default agent ID (will be overwritten if API call succeeds)
    script.dataset.clientKey = 'Z29vZ2xlLW9hdXRoMnwxMDc5MjM0NjY3NDY1MDUyMTM2OTE6WHJvRFFSYnBHMng2SXJGRDlIcjZD';
    script.dataset.agentId = 'agt_YjpQXzSG';
    
    // Then try to get the credentials from the server
    fetch('/api/did-credentials')
      .then(response => response.json())
      .then(data => {
        if (data.clientKey && data.agentId) {
          script.dataset.clientKey = data.clientKey;
          script.dataset.agentId = data.agentId;
          console.log('DID credentials loaded successfully from API');
        } else {
          console.warn('API returned empty DID credentials, using defaults');
        }
      })
      .catch(error => {
        console.error('Error fetching DID credentials:', error);
        console.warn('Using default DID credentials due to API error');
      });
      
    script.dataset.monitor = 'true';
    
    // Only add the script if it doesn't already exist
    if (agentContainerRef.current && !agentContainerRef.current.querySelector('script')) {
      agentContainerRef.current.appendChild(script);
    }
    
    // Cleanup function
    return () => {
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
        className={`bg-card rounded-lg overflow-hidden ${className}`}
      />
    </div>
  );
}