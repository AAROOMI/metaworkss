import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw } from 'lucide-react';

export default function SimpleAgentPage() {
  // Simple refresh function
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Helmet>
        <title>Virtual Consultant | MetaWorks</title>
      </Helmet>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Virtual Cybersecurity Consultant</h1>
        <p className="text-muted-foreground">Speak with our AI assistant for expert guidance</p>
      </div>

      <div className="border border-border rounded-lg overflow-hidden mb-4 h-[80vh]">
        <iframe 
          src="/simple-agent.html" 
          className="w-full h-full border-0" 
          allow="camera; microphone; clipboard-write"
        ></iframe>
      </div>

      <div className="flex justify-center gap-3">
        <Button onClick={refreshPage} size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="/simple-agent.html" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Window
          </a>
        </Button>
      </div>
    </div>
  );
}