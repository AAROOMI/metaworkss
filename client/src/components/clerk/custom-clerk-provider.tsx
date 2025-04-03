import { ClerkProvider } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { fetchClerkPublishableKey } from "@/lib/clerk";

interface CustomClerkProviderProps {
  children: React.ReactNode;
}

export function CustomClerkProvider({ children }: CustomClerkProviderProps) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClerkPublishableKey()
      .then(fetchedKey => {
        setKey(fetchedKey);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!key) {
    console.warn("Missing Clerk Publishable Key. User authentication might not work correctly.");
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={key}>{children}</ClerkProvider>;
}

export default CustomClerkProvider;