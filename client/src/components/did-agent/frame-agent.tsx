import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface FrameAgentProps {
  height?: string;
  width?: string;
  src?: string;
  className?: string;
  containerClassName?: string;
}

/**
 * FrameAgent component that loads the D-ID agent using an iframe.
 * This approach isolates the D-ID script to avoid React conflicts.
 */
export default function FrameAgent({
  height = '500px',
  width = '100%',
  src = '/direct-script.html',
  className = '',
  containerClassName = '',
}: FrameAgentProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const reloadIframe = () => {
    setLoading(true);
    setError(false);
    setIframeKey(Date.now());
  };

  return (
    <div className={`${containerClassName}`}>
      <Card className={`${className} relative overflow-hidden`}>
        <CardContent className="p-0">
          <iframe
            key={iframeKey}
            src={src}
            style={{ width, height, border: 'none' }}
            onLoad={handleLoad}
            onError={handleError}
            title="D-ID Virtual Consultant"
            allow="microphone; camera"
          />
          
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/90 z-10">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-muted-foreground">Loading virtual assistant...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/90 z-10">
              <div className="flex flex-col items-center max-w-md text-center p-6">
                <div className="bg-destructive/10 text-destructive rounded-lg p-6 mb-4">
                  <h3 className="font-bold text-lg mb-2">Unable to load virtual assistant</h3>
                  <p className="mb-4">The virtual assistant could not be loaded. This may be due to network issues or configuration problems.</p>
                  <Button onClick={reloadIframe} variant="destructive" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Try opening the <a href={src} target="_blank" className="text-primary hover:underline">standalone page</a> instead.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}