import React, { useEffect } from 'react';
import { Helmet } from "react-helmet-async";

// This component creates a clean, minimal page with just the D-ID agent
export default function DIDAgentFullscreen() {
  useEffect(() => {
    // Navigate directly to the D-ID agent page
    window.location.href = 'https://studio.d-id.com/agents/share?id=agt_YjpQXzSG&utm_source=copy&key=WjI5dloyeGxMVzloZFhSb01ud3hNRGM1TWpNME5qWTNORFkxTURVeU1UTTJPVEU2V0hKdlJGRlNZbkJITW5nMlNYSkdSRGxJY2paRA==';
  }, []);

  return (
    <>
      <Helmet>
        <title>MetaWorks Security Consultant</title>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            background-color: #000;
          }
        `}</style>
      </Helmet>
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="text-white text-xl">Loading MetaWorks Consultant...</div>
      </div>
    </>
  );
}