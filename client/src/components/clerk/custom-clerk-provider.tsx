import { ClerkProvider } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { fetchClerkPublishableKey } from "@/lib/clerk";
import { Loader2 } from "lucide-react";

interface CustomClerkProviderProps {
  children: React.ReactNode;
}

export function CustomClerkProvider({ children }: CustomClerkProviderProps) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getKey = async () => {
      try {
        const fetchedKey = await fetchClerkPublishableKey();
        if (fetchedKey) {
          setKey(fetchedKey);
          setLoading(false);
        } else {
          console.error("Empty Clerk publishable key received");
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching Clerk publishable key:", err);
        setError(true);
        setLoading(false);
      }
    };
    
    getKey();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (error || !key) {
    console.warn("Missing Clerk Publishable Key. Using application without Clerk authentication.");
    return <>{children}</>;
  }

  // Add error boundary to handle Clerk initialization errors
  try {
    return (
      <ClerkProvider 
        publishableKey={key}
        appearance={{
          elements: {
            card: "bg-card",
            formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90"
          }
        }}
      >
        {children}
      </ClerkProvider>
    );
  } catch (err) {
    console.error("Error initializing ClerkProvider:", err);
    return <>{children}</>;
  }
}

export default CustomClerkProvider;