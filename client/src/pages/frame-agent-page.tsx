import { Helmet } from 'react-helmet-async';
import FrameAgent from '@/components/did-agent/frame-agent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function FrameAgentPage() {
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
      
      <Tabs defaultValue="frame" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="frame">Frame Integration</TabsTrigger>
          <TabsTrigger value="simple">Simple HTML</TabsTrigger>
          <TabsTrigger value="decorated">Decorated HTML</TabsTrigger>
        </TabsList>
        
        <TabsContent value="frame" className="h-[600px]">
          <FrameAgent 
            height="100%" 
            src="/direct-script.html"
          />
        </TabsContent>
        
        <TabsContent value="simple" className="h-[600px]">
          <FrameAgent 
            height="100%" 
            src="/direct-agent.html"
          />
        </TabsContent>
        
        <TabsContent value="decorated" className="h-[600px]">
          <FrameAgent 
            height="100%" 
            src="/agent-demo.html"
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center space-x-4">
        <Button variant="outline" asChild>
          <a href="/direct-script.html" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Direct Script
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/direct-agent.html" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Simple Agent
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/agent-demo.html" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Decorated Agent
          </a>
        </Button>
      </div>
    </div>
  );
}