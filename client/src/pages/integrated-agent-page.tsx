import { Helmet } from 'react-helmet-async';
import FrameAgent from '@/components/did-agent/frame-agent';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function IntegratedAgentPage() {
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
      
      <div className="h-[700px] rounded-lg overflow-hidden border border-border mb-8">
        <FrameAgent 
          height="100%" 
          src="/integrated-agent.html"
        />
      </div>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" asChild className="text-sm">
          <a href="/integrated-agent.html" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Window
          </a>
        </Button>
        <Button variant="outline" asChild className="text-sm">
          <a href="/frame-agent" className="flex items-center">
            Try Other Versions
          </a>
        </Button>
      </div>
    </div>
  );
}