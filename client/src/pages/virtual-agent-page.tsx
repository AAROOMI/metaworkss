import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from '@/hooks/use-toast';

const VirtualAgentPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    // Fetch the agent URL from our proxy API
    const fetchAgentUrl = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/did/share-url');
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.shareUrl) {
          throw new Error('No share URL returned from server');
        }
        
        setShareUrl(data.shareUrl);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching agent URL:', err);
        setError(err.message || 'Failed to load the virtual agent');
        toast({
          title: 'Error',
          description: 'Failed to load the virtual agent. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgentUrl();
  }, []);

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Helmet>
        <title>MetaWorks | Virtual Security Consultant</title>
      </Helmet>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Link href="/user-dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">MetaWorks Virtual Security Consultant</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Loading your virtual consultant...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="max-w-md p-6 bg-card rounded-lg shadow-lg text-center">
              <div className="mb-4 text-destructive">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Failed to load the Virtual Agent</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRetry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full w-full overflow-hidden">
            <iframe 
              src={shareUrl}
              className="w-full h-full border-0"
              allow="microphone; camera"
              title="MetaWorks Virtual Security Consultant"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualAgentPage;