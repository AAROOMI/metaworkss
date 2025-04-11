import { Helmet } from 'react-helmet-async';
import FrameAgent from '@/components/did-agent/frame-agent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, RefreshCw, Shield, AlertTriangle } from 'lucide-react';

export default function IntegratedAgentPage() {
  // Simple reload function
  const reloadAgent = () => {
    // Force reload the iframe by changing its src
    const iframe = document.getElementById('agent-frame') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = `/direct-agent.html?v=${Date.now()}`;
    }
  };
  
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
      
      <Card className="mb-8 overflow-hidden">
        <div className="h-[700px] relative">
          <iframe 
            id="agent-frame"
            src="/direct-agent.html"
            className="w-full h-full border-0"
            allow="camera; microphone; clipboard-write"
          ></iframe>
        </div>
      </Card>
      
      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="default" onClick={reloadAgent} className="text-sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Consultant
        </Button>
        
        <Button variant="outline" asChild className="text-sm">
          <a href="/direct-agent.html" target="_blank">
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
        <AlertTitle>Troubleshooting Tips</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Make sure your browser is up to date (Chrome or Edge recommended)</li>
            <li>Try disabling ad blockers or other extensions that might interfere</li>
            <li>Use the "Refresh Consultant" button if the agent doesn't respond</li>
            <li>Try the "Open in New Window" option for better performance</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}