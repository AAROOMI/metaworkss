import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DIDAgentConfig {
  agentId: string;
  clientKey: string;
  scriptUrl: string;
  mode: string;
  monitor: boolean;
}

export default function SecuredDIDAgent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agentConfig, setAgentConfig] = useState<DIDAgentConfig | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const getAuthHeaders = async () => {
    // In production, you would get this from the Clerk SDK
    // For now, we'll just simulate an auth token if a user is logged in
    if (!user) {
      return {};
    }
    
    // In production, get the actual token from Clerk
    return {
      Authorization: `Bearer mock-token-for-${user.id}`
    };
  };

  const loadDIDAgent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get auth headers
      const headers = await getAuthHeaders();
      
      // Call the secure endpoint
      const response = await fetch('/api/did/secure-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ userId: user?.id })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to load D-ID agent configuration');
      }
      
      const config = await response.json();
      setAgentConfig(config);
      
      // Load the D-ID script dynamically
      await loadDIDScript(config);
      
    } catch (err) {
      console.error('Error loading D-ID agent:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast({
        title: 'Agent Load Error',
        description: 'Failed to load security consultant. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const loadDIDScript = async (config: DIDAgentConfig) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = config.scriptUrl;
        script.setAttribute('data-name', 'did-agent');
        script.setAttribute('data-mode', config.mode);
        script.setAttribute('data-client-key', config.clientKey);
        script.setAttribute('data-agent-id', config.agentId);
        script.setAttribute('data-monitor', config.monitor.toString());
        
        script.onload = () => {
          console.log('D-ID script loaded successfully');
          resolve();
        };
        
        script.onerror = (e) => {
          console.error('Error loading D-ID script:', e);
          reject(new Error('Failed to load D-ID agent script'));
        };
        
        document.body.appendChild(script);
      } catch (err) {
        reject(err);
      }
    });
  };
  
  useEffect(() => {
    if (user) {
      loadDIDAgent();
    }
    
    return () => {
      // Clean up D-ID script on unmount
      const didScript = document.querySelector('script[data-name="did-agent"]');
      if (didScript) {
        didScript.remove();
      }
    };
  }, [user]);
  
  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          Please sign in to access the security consultant.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading security consultant...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <Button onClick={loadDIDAgent} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-[500px] rounded-lg border bg-card shadow">
      <div className="flex items-center p-4 border-b">
        <Shield className="h-5 w-5 text-primary mr-2" />
        <h3 className="font-medium">Security Consultant</h3>
      </div>
      
      <div id="did-agent-container" className="p-4 min-h-[450px]">
        {/* D-ID agent will be rendered here by the script */}
        <div className="text-center text-muted-foreground">
          Ask me anything about cybersecurity compliance or risk management
        </div>
      </div>
    </div>
  );
}