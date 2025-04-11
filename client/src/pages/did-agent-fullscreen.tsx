import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize, Minimize, RefreshCw } from 'lucide-react';
import { Link } from 'wouter';

const DIDAgentFullscreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const agentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeAgent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch credentials from API
        const response = await fetch('/api/did/credentials');
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        if (!data.clientKey || !data.agentId) {
          throw new Error('Missing D-ID credentials');
        }

        // Create script element with proper attributes
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://agent.d-id.com/v1/index.js';
        
        // Set required attributes
        script.setAttribute('data-name', 'did-agent');
        script.setAttribute('data-target', '#agent-container');
        script.setAttribute('data-mode', 'fabio');
        script.setAttribute('data-client-key', data.clientKey);
        script.setAttribute('data-agent-id', data.agentId);
        script.setAttribute('data-monitor', 'true');
        
        // Handle success
        script.onload = () => {
          console.log('D-ID Agent script loaded successfully');
          setLoading(false);
        };
        
        // Handle errors
        script.onerror = (e) => {
          console.error('Error loading D-ID Agent script:', e);
          setError('Failed to load the virtual consultant. Please try again.');
          setLoading(false);
        };

        // Add script to document
        document.body.appendChild(script);

        // Clean up on unmount
        return () => {
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
        };
      } catch (err: any) {
        console.error('Error initializing D-ID agent:', err);
        setError(err.message || 'Failed to load the virtual consultant');
        setLoading(false);
      }
    };

    initializeAgent();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

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
          className="w-full h-full"
        ></div>
      </div>
    </div>
  );
};

export default DIDAgentFullscreen;