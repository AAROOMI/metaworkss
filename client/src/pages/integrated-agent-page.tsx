import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import FrameAgent from '@/components/did-agent/frame-agent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, RefreshCw, Shield, AlertTriangle } from 'lucide-react';

export default function IntegratedAgentPage() {
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Function to refresh the agent iframe
  const refreshAgent = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prevCount => prevCount + 1);
  };
  
  // Reset error state after a delay when retry count changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [retryCount]);
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <Helmet>
        <title>MetaWorks Virtual Consultant</title>
      </Helmet>

      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
          Virtual Cybersecurity Consultant
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with our AI-powered cybersecurity expert to receive personalized guidance
          and assistance with your compliance journey.
        </p>
      </header>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertTitle>Error Loading Consultant</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-8 overflow-hidden">
        <div className="h-[700px] relative">
          <FrameAgent 
            key={`integrated-agent-${retryCount}`}
            height="100%" 
            src={`/integrated-agent.html?v=${retryCount}`}
            onLoad={() => setLoading(false)}
            onError={(e) => {
              setError("Failed to load the virtual consultant. Please try refreshing.");
              setLoading(false);
            }}
          />
          
          {loading && (
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
              <h3 className="text-xl font-medium mb-2">Loading Virtual Consultant</h3>
              <p className="text-muted-foreground text-sm">Please wait while we connect you to our AI assistant...</p>
            </div>
          )}
        </div>
      </Card>
      
      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="default" onClick={refreshAgent} className="text-sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Consultant
        </Button>
        
        <Button variant="outline" asChild className="text-sm">
          <a href="/integrated-agent.html" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Window
          </a>
        </Button>
        
        <Button variant="outline" asChild className="text-sm">
          <a href="/frame-agent" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Try Other Versions
          </a>
        </Button>
      </div>
      
      <Alert className="mt-8">
        <AlertTitle>Having trouble with the virtual consultant?</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Make sure your browser is up to date (Chrome or Edge recommended)</li>
            <li>Try disabling ad blockers or other extensions that might interfere</li>
            <li>Use the "Refresh Consultant" button if the agent doesn't load</li>
            <li>Try the "Open in New Window" option for better performance</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}