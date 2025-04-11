import React from 'react';

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
  return (
    <div className={`${containerClassName}`}>
      <div className={`bg-card rounded-lg overflow-hidden ${className}`} style={{ height, width }}>
        <script
          type="module"
          src="https://agent.d-id.com/v1/index.js"
          data-name="did-agent"
          data-mode="fabio"
          data-client-key="Z29vZ2xlLW9hdXRoMnwxMDc5MjM0NjY3NDY1MDUyMTM2OTE6WHJvRFFSYnBHMng2SXJGRDlIcjZD"
          data-agent-id="agt_YjpQXzSG"
          data-monitor="true">
        </script>
      </div>
    </div>
  );
}