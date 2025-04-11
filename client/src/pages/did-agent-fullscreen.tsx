import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize, Minimize, RefreshCw } from 'lucide-react';
import { Link } from 'wouter';

const DIDAgentFullscreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [agentConfig, setAgentConfig] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const agentContainerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // Fetch configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch configuration from API
        const response = await fetch('/api/did/config');
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const config = await response.json();
        if (!config.scriptUrl || !config.agentConfig) {
          throw new Error('Invalid D-ID configuration');
        }

        setAgentConfig(config);
        loadScript(config.scriptUrl, config.agentConfig);
      } catch (err: any) {
        console.error('Error getting D-ID config:', err);
        setError(err.message || 'Failed to get configuration');
        setLoading(false);
      }
    };

    fetchConfig();
    
    // Clean up on unmount
    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  // Load script with configuration
  const loadScript = (scriptUrl: string, config: any) => {
    try {
      // Remove any existing script
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }

      // Create script element
      const script = document.createElement('script');
      script.type = 'module';
      script.src = scriptUrl;
      
      // Set target
      script.setAttribute('data-name', 'did-agent');
      script.setAttribute('data-target', '#agent-container');
      
      // Apply all config properties
      Object.entries(config).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          script.setAttribute(`data-${key}`, value ? 'true' : 'false');
        } else {
          script.setAttribute(`data-${key}`, String(value));
        }
      });
      
      // Handle events
      script.onload = () => {
        console.log('D-ID Agent script loaded successfully');
        setLoading(false);
      };
      
      script.onerror = (e) => {
        console.error('Error loading D-ID Agent script:', e);
        setError('Failed to load the virtual consultant. Please try again.');
        setLoading(false);
      };

      // Add to document
      scriptRef.current = script;
      document.body.appendChild(script);
    } catch (err: any) {
      console.error('Error setting up D-ID agent:', err);
      setError(err.message || 'Failed to initialize the virtual consultant');
      setLoading(false);
    }
  };

  // Handle retry button
  const handleRetry = () => {
    if (agentConfig) {
      setError(null);
      setLoading(true);
      loadScript(agentConfig.scriptUrl, agentConfig.agentConfig);
    } else {
      window.location.reload();
    }
  };

  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col h-screen bg-background">
      <Helmet>
        <title>MetaWorks | Security Consultant</title>
      </Helmet>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Link href="/user-dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">MetaWorks Security Consultant</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize className="h-4 w-4 mr-2" />
            ) : (
              <Maximize className="h-4 w-4 mr-2" />
            )}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Loading your virtual consultant...</p>
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
              <h2 className="text-xl font-semibold mb-2">Failed to load the Virtual Consultant</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRetry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        <div 
          id="agent-container" 
          ref={agentContainerRef}
          className="w-full h-full bg-black/10"
        ></div>
      </div>
    </div>
  );
};

export default DIDAgentFullscreen;