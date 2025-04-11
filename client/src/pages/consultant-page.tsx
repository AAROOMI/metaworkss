import React, { useEffect } from 'react';
import { Helmet } from "react-helmet-async";

export default function ConsultantPage() {
  useEffect(() => {
    // Create and append the script directly to the body
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://agent.d-id.com/v1/index.js';
    script.setAttribute('data-name', 'did-agent');
    script.setAttribute('data-mode', 'fabio');
    script.setAttribute('data-client-key', 'Z29vZ2xlLW9hdXRoMnwxMDc5MjM0NjY3NDY1MDUyMTM2OTE6WHJvRFFSYnBHMng2SXJGRDlIcjZD');
    script.setAttribute('data-agent-id', 'agt_YjpQXzSG');
    script.setAttribute('data-monitor', 'true');
    
    // Clean up any existing script tags to avoid duplicates
    const existingScripts = document.querySelectorAll('script[data-name="did-agent"]');
    existingScripts.forEach(existingScript => existingScript.remove());
    
    // Append the script to body
    document.body.appendChild(script);
    
    // Cleanup when component unmounts
    return () => {
      script.remove();
    };
  }, []);
  
  return (
    <>
      <Helmet>
        <title>MetaWorks | Security Consultant</title>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            background-color: #121212;
          }
        `}</style>
      </Helmet>
      {/* The page is intentionally blank to allow the D-ID agent to fill the entire viewport */}
    </>
  );
}