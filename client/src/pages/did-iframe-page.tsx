import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DIDIframePage() {
  const [iframeKey, setIframeKey] = useState(Date.now());

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <Helmet>
        <title>MetaWorks Virtual Consultant</title>
      </Helmet>

      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
          Virtual Cybersecurity Consultant
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with our AI-powered cybersecurity expert to receive personalized guidance
          and assistance with your compliance journey.
        </p>
      </header>

      <Card className="mb-8">
        <CardHeader className="border-b">
          <CardTitle>D-ID Virtual Assistant</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex justify-center">
          <iframe
            key={iframeKey}
            src="/direct-agent.html"
            style={{ width: '100%', height: '600px', border: 'none' }}
            title="D-ID Virtual Assistant"
            allow="microphone; camera"
          />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => setIframeKey(Date.now())} 
          className="mx-2"
        >
          Reload Assistant
        </Button>
        <Button asChild className="mx-2">
          <a href="/direct-agent.html" target="_blank">
            Open in Full Page
          </a>
        </Button>
      </div>
    </div>
  );
}