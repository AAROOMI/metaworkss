import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download } from "lucide-react";

export default function NcaEccPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary">NCA Essential Cybersecurity Controls</h1>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 border border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20 mr-4">
                <div className="text-xl font-bold text-primary">NCA</div>
              </div>
              <h2 className="text-2xl font-semibold">ECC Framework</h2>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <a href="/ecc-en.pdf" download>
                Download Framework
              </a>
            </Button>
          </div>

          <div className="prose prose-invert max-w-none mt-6">
            <p>
              The NCA Essential Cybersecurity Controls (ECC) framework is a set of cybersecurity controls issued by the National Cybersecurity Authority of Saudi Arabia. It aims to help organizations in Saudi Arabia establish a minimum level of cybersecurity capabilities to protect their information, technology assets, and online services from common cybersecurity threats.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Five main domains covering cybersecurity governance, defense, resilience, third-party risk management, and cloud security</li>
              <li>Implementation guidelines for organizations of different maturity levels</li>
              <li>Alignment with international standards and frameworks</li>
              <li>Mandatory for government entities in Saudi Arabia</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6">How MetaWorks Helps</h3>
            <p>
              MetaWorks provides automated compliance assessment, gap analysis, and remediation guidance specifically tailored to the NCA ECC Framework. Our platform helps you:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Assess your current compliance status against all ECC requirements</li>
              <li>Generate detailed gap analysis reports</li>
              <li>Develop customized policies aligned with ECC requirements</li>
              <li>Create and track remediation tasks</li>
              <li>Prepare documentation for compliance audits</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button className="flex items-center gap-2" asChild>
            <Link href="/dashboard">
              <FileText className="h-4 w-4 mr-2" />
              Start ECC Assessment
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}