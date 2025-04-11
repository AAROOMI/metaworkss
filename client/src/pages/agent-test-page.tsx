import { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentScript from '@/components/did-agent/agent-script';
import EmbeddedAgent from '@/components/did-agent/embedded-agent';
import DirectAgent, { DirectAgentRef } from '@/components/did-agent/direct-agent';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function AgentTestPage() {
  const [activeTab, setActiveTab] = useState('direct');
  const [agentMessage, setAgentMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const directAgentRef = useRef<DirectAgentRef>(null);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!agentMessage.trim()) {
      toast({
        title: 'Message Required',
        description: 'Please enter a message to send to the agent',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/did-agent/talk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: agentMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message to agent');
      }

      const data = await response.json();
      console.log('Agent talk response:', data);
      
      toast({
        title: 'Message Sent',
        description: 'Agent is processing your message',
      });
      
      // Clear the input
      setAgentMessage('');
    } catch (error) {
      console.error('Error sending message to agent:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message to agent',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
        MetaWorks Virtual Cybersecurity Consultant
      </h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>D-ID Agent Implementation</CardTitle>
          <CardDescription>
            Try different implementations of our virtual cybersecurity consultant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="direct">Direct Implementation</TabsTrigger>
              <TabsTrigger value="embedded">Embedded Script</TabsTrigger>
              <TabsTrigger value="api">API Based</TabsTrigger>
            </TabsList>
            
            <TabsContent value="direct" className="h-[500px]">
              <DirectAgent 
                ref={directAgentRef}
                height="100%" 
                onAgentReady={() => {
                  toast({
                    title: 'Agent Ready',
                    description: 'The direct implementation agent is ready',
                  });
                }}
                onAgentError={(error) => {
                  toast({
                    title: 'Agent Error',
                    description: error,
                    variant: 'destructive',
                  });
                }}
              />
            </TabsContent>
            
            <TabsContent value="embedded" className="h-[500px]">
              <EmbeddedAgent height="100%" />
            </TabsContent>
            
            <TabsContent value="api" className="h-[500px]">
              <AgentScript height="100%" />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex w-full space-x-2">
            <Input
              placeholder="Type a message for the virtual consultant..."
              value={agentMessage}
              onChange={(e) => setAgentMessage(e.target.value)}
              disabled={isSending}
              className="flex-grow"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
          
          <div className="flex justify-end w-full">
            <Button 
              variant="outline" 
              onClick={() => {
                if (activeTab === 'direct' && directAgentRef.current) {
                  directAgentRef.current.reload();
                } else if (activeTab === 'embedded' || activeTab === 'api') {
                  window.location.reload();
                }
              }}
            >
              Reload Agent
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <div className="text-center text-muted-foreground text-sm">
        <p>Using D-ID agent with client key starting with {'"Z29vZ2xlLW9hdXRoMnwxMDc5M..."'} and agent ID {'"agt_YjpQXzSG"'}</p>
        <p className="mt-2">
          <a 
            href="/test-agent.html" 
            target="_blank" 
            className="text-primary hover:underline"
          >
            Open standalone test page
          </a>
        </p>
      </div>
    </div>
  );
}