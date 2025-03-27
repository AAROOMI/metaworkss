import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function DIDAgentPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">D-ID Virtual Consultant</CardTitle>
        </CardHeader>
        <div className="flex items-center justify-center p-6">
          <iframe 
            src="/simple-agent.html" 
            title="D-ID Agent" 
            className="w-full h-[600px] border rounded-lg overflow-hidden"
            allow="camera; microphone; autoplay; clipboard-write"
            allowFullScreen
          />
        </div>
      </Card>
    </div>
  );
}