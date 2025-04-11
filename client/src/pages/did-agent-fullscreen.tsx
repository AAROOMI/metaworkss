import React from 'react';
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Headphones } from "lucide-react";

// D-ID Agent link
const DID_AGENT_URL = 'https://studio.d-id.com/agents/share?id=agt_YjpQXzSG&utm_source=copy&key=WjI5dloyeGxMVzloZFhSb01ud3hNRGM1TWpNME5qWTNORFkxTURVeU1UTTJPVEU2V0hKdlJGRlNZbkJITW5nMlNYSkdSRGxJY2paRA==';

// This component creates a launch page for the consultant
export default function DIDAgentFullscreen() {
  const openConsultant = () => {
    window.open(DID_AGENT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Helmet>
        <title>MetaWorks Security Consultant</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-background/80 p-4">
        <div className="max-w-3xl text-center mb-12">
          <div className="flex justify-center mb-6">
            <Headphones className="h-24 w-24 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">MetaWorks Security Consultant</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connect with our AI-powered security expert to get personalized guidance on cybersecurity compliance and best practices.
          </p>
          
          <Button 
            size="lg" 
            onClick={openConsultant}
            className="bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-600 text-white px-8 py-6 text-lg h-auto"
          >
            Launch Security Consultant
            <ArrowUpRight className="ml-2 h-5 w-5" />
          </Button>
          
          <p className="mt-8 text-sm text-muted-foreground">
            The consultant will open in a new browser tab and requires microphone access for the best experience.
          </p>
        </div>
      </div>
    </>
  );
}