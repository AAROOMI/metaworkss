import React from 'react';
import PageHeader from "@/components/common/page-header";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AgentWidget from "@/components/did-agent/agent-widget";

export default function AgentTestPage() {
  const { toast } = useToast();
  const [hasKeys, setHasKeys] = React.useState(false);
  
  React.useEffect(() => {
    async function checkApiKeys() {
      try {
        const response = await fetch('/api/did-keys');
        const data = await response.json();
        setHasKeys(!!data.apiKey);
      } catch (error) {
        console.error("Error checking API keys:", error);
        setHasKeys(false);
      }
    }
    
    checkApiKeys();
  }, []);
  
  return (
    <div className="container py-6 space-y-6 max-w-5xl">
      <PageHeader 
        heading="AI Security Assistant" 
        description="Interact with your virtual cybersecurity consultant"
        icon={<Sparkles className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About the Agent</CardTitle>
              <CardDescription>
                Your virtual cybersecurity consultant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Capabilities</h3>
                <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                  <li>Explain cybersecurity concepts</li>
                  <li>Provide compliance guidance</li>
                  <li>Suggest security controls</li>
                  <li>Analyze policy requirements</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Powered by</h3>
                <p className="text-sm text-muted-foreground">
                  D-ID Realistic AI Avatar technology
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Connection Status</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-3 h-3 rounded-full ${hasKeys ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm">{hasKeys ? 'Connected' : 'Not Connected'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sample Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => document.dispatchEvent(new CustomEvent('agent-prompt', {
                    detail: "What is the NCA ECC framework?"
                  }))}
                >
                  What is the NCA ECC framework?
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => document.dispatchEvent(new CustomEvent('agent-prompt', {
                    detail: "Explain the key components of cybersecurity governance"
                  }))}
                >
                  Explain the key components of cybersecurity governance
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => document.dispatchEvent(new CustomEvent('agent-prompt', {
                    detail: "What are the best practices for password policies?"
                  }))}
                >
                  What are the best practices for password policies?
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 flex justify-center">
          {hasKeys ? (
            <AgentWidget initialMessage="Hello, I'm your MetaWorks virtual security assistant. I can help you understand cybersecurity frameworks, governance, and best practices. How can I assist you today?" />
          ) : (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>D-ID API Keys Required</CardTitle>
                <CardDescription>
                  The virtual agent requires D-ID API credentials to function
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To use the virtual security consultant, you need to configure the following environment variables:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code>DID_API_KEY</code> - Your D-ID API key</li>
                  <li><code>DID_AGENT_ID</code> - (Optional) Custom agent presenter ID</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  These can be set in your project's .env file or through environment variables.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}