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
      
      <div className="text-center mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <h3 className="text-yellow-500 font-medium mb-2">Try Different Implementations</h3>
        <p className="text-sm text-muted-foreground">
          We've created multiple implementations of the D-ID virtual agent. If one doesn't work, try another using the tabs below or the standalone links.
        </p>
      </div>
      
      <Tabs defaultValue="legacy" className="mb-8">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="legacy">Legacy Agent</TabsTrigger>
          <TabsTrigger value="pure">Pure Agent</TabsTrigger>
          <TabsTrigger value="basic">Basic Agent</TabsTrigger>
          <TabsTrigger value="direct">Direct Script</TabsTrigger>
          <TabsTrigger value="simple">Simple HTML</TabsTrigger>
          <TabsTrigger value="decorated">Decorated HTML</TabsTrigger>
        </TabsList>
        
        <TabsContent value="legacy" className="h-[600px]">
          <FrameAgent 
            height="100%" 
            src="/legacy-agent.html"
          />
        </TabsContent>
        
        <TabsContent value="pure" className="h-[600px]">
          <FrameAgent 
            height="100%" 
            src="/pure-agent.html"
          />
        </TabsContent>
        
        <TabsContent value="basic" className="h-[600px]">
          <FrameAgent 
            height="100%" 
            src="/basic-agent.html"
          />
        </TabsContent>
        
        <TabsContent value="direct" className="h-[600px]">
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
      
      <h3 className="text-xl font-medium mb-4 text-center">Standalone Testing Pages</h3>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <Button variant="outline" asChild className="text-xs">
          <a href="/legacy-agent.html" target="_blank">
            <ExternalLink className="mr-2 h-3 w-3" />
            Legacy Agent
          </a>
        </Button>
        <Button variant="outline" asChild className="text-xs">
          <a href="/pure-agent.html" target="_blank">
            <ExternalLink className="mr-2 h-3 w-3" />
            Pure Agent
          </a>
        </Button>
        <Button variant="outline" asChild className="text-xs">
          <a href="/basic-agent.html" target="_blank">
            <ExternalLink className="mr-2 h-3 w-3" />
            Basic Agent
          </a>
        </Button>
        <Button variant="outline" asChild className="text-xs">
          <a href="/direct-script.html" target="_blank">
            <ExternalLink className="mr-2 h-3 w-3" />
            Direct Script
          </a>
        </Button>
        <Button variant="outline" asChild className="text-xs">
          <a href="/direct-agent.html" target="_blank">
            <ExternalLink className="mr-2 h-3 w-3" />
            Simple Agent
          </a>
        </Button>
        <Button variant="outline" asChild className="text-xs">
          <a href="/agent-demo.html" target="_blank">
            <ExternalLink className="mr-2 h-3 w-3" />
            Decorated Agent
          </a>
        </Button>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Using D-ID agent with client key starting with <code className="bg-muted p-1 rounded">Z29vZ2xlLW9hdXRo</code> and agent ID <code className="bg-muted p-1 rounded">agt_YjpQXzSG</code></p>
      </div>
    </div>
  );
}