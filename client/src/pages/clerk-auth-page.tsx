import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClerkSignIn, ClerkSignUp } from "@/components/clerk/clerk-auth";
import metaworkKeylogoPath from "@assets/metawork keylogo.webp";
import metaworkBgPath from "@assets/metawork background.png";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ClerkAuthPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Auth Form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8">
        <Link href="/">
          <div className="flex items-center mb-8 cursor-pointer">
            <img
              src={metaworkKeylogoPath}
              alt="MetaWorks Logo"
              className="h-10 w-auto mr-2"
            />
            <h1 className="text-2xl font-bold text-primary">MetaWorks</h1>
          </div>
        </Link>

        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome to MetaWorks</h2>
          <p className="text-muted-foreground text-center mb-8">
            Your cybersecurity compliance companion
          </p>

          <Tabs defaultValue="sign-in" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in">
              <ClerkSignIn />
            </TabsContent>
            <TabsContent value="sign-up">
              <ClerkSignUp />
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              By using MetaWorks, you agree to our Terms of Service and Privacy Policy.
            </p>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image and Message */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-muted items-center justify-center relative"
        style={{
          backgroundImage: `url(${metaworkBgPath})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            One-Click Cybersecurity Solution
          </h2>
          <p className="text-lg mb-6">
            MetaWorks simplifies cybersecurity compliance, turning complex requirements into actionable steps for your organization.
          </p>
          <ul className="space-y-2 mb-8">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Automated compliance assessments</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>AI-powered policy generation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Risk management dashboard</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Virtual security consultant</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}