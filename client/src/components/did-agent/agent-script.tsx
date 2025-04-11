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
  const didAgentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!didAgentRef.current) return;

    // Clear any existing content
    didAgentRef.current.innerHTML = '';

    // Create and inject the script element with the exact attributes
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://agent.d-id.com/v1/index.js';
    script.setAttribute('data-name', 'did-agent');
    script.setAttribute('data-mode', 'fabio');
    script.setAttribute('data-client-key', 'Z29vZ2xlLW9hdXRoMnwxMDc5MjM0NjY3NDY1MDUyMTM2OTE6WHJvRFFSYnBHMng2SXJGRDlIcjZD');
    script.setAttribute('data-agent-id', 'agt_YjpQXzSG');
    script.setAttribute('data-monitor', 'true');
    script.setAttribute('data-target', '#did-agent-container');

    // Create a target div for the agent
    const targetDiv = document.createElement('div');
    targetDiv.id = 'did-agent-container';
    targetDiv.style.width = '100%';
    targetDiv.style.height = '100%';

    // Add both elements to the container
    didAgentRef.current.appendChild(targetDiv);
    didAgentRef.current.appendChild(script);
  }, []);

  return (
    <div className={`${containerClassName}`}>
      <div 
        ref={didAgentRef}
        style={{ height, width }}
        className={`bg-card rounded-lg overflow-hidden ${className}`}
      />
    </div>
  );
}