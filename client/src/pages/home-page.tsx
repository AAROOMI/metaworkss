import React from "react";
import Header from "@/components/layout/header";
import HeroSection from "@/components/landing/hero-section";
import FeaturesSection from "@/components/landing/features-section";
import AdminPreview from "@/components/landing/admin-preview";
import CompanyInfoSection from "@/components/landing/company-info-section";
import ComplianceLogos from "@/components/landing/compliance-logos";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Shield, Lock } from "lucide-react";
import backgroundImage from "/attached_assets/metawork background.png";

export default function HomePage() {
  const handleClerkAdminAccess = () => {
    window.location.href = '/clerk-auth';
  };

  return (
    <div className="min-h-screen text-foreground relative">
      {/* Background image */}
      <div 
        className="fixed top-0 left-0 right-0 bottom-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 -z-10" />
      
      {/* Clerk Admin Direct Access Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-end gap-2">
          <div className="bg-black/60 backdrop-blur-sm p-2 rounded-lg text-xs text-white">
            Admin Access
          </div>
          <Button 
            onClick={handleClerkAdminAccess}
            className="rounded-full h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-700 hover:from-indigo-600 hover:to-purple-800 shadow-lg shadow-indigo-500/20 flex items-center justify-center"
          >
            <Lock className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      <Header />
      <HeroSection />
      <ComplianceLogos />
      <FeaturesSection />
      <AdminPreview />
      <CompanyInfoSection />
      <Footer />
      
      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />
    </div>
  );
};
