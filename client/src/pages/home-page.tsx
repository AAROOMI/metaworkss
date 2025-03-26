import React from "react";
import Header from "@/components/layout/header";
import HeroSection from "@/components/landing/hero-section";
import FeaturesSection from "@/components/landing/features-section";
import AdminPreview from "@/components/landing/admin-preview";
import CompanyInfoSection from "@/components/landing/company-info-section";
import Footer from "@/components/landing/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Animated background lines */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            style={{
              position: "absolute",
              top: `${(i + 1) * 10}%`,
              left: 0,
              width: "100%",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(0, 183, 235, 0.2), transparent)",
              animation: `flow 15s linear infinite ${i * 2}s`,
              opacity: 0
            }}
            className="line"
          />
        ))}
      </div>
      
      <Header />
      <HeroSection />
      <FeaturesSection />
      <AdminPreview />
      <CompanyInfoSection />
      <Footer />
      
      <style jsx global>{`
        @keyframes flow {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(1000%);
            opacity: 0;
          }
        }
        
        body {
          background-color: #121212;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(0, 183, 235, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(78, 204, 163, 0.05) 0%, transparent 50%);
        }
      `}</style>
    </div>
  );
};
