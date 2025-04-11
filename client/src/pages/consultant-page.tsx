import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function ConsultantPage() {
  const [_, navigate] = useLocation();

  useEffect(() => {
    // Open the consultant.html in a new window/tab
    window.open('/consultant.html', '_self');
    
    // Add a small delay before navigating back to prevent rapid navigation
    const timeout = setTimeout(() => {
      navigate('/user-dashboard');
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [navigate]);
  
  // This component won't render anything as it immediately redirects
  return null;
}