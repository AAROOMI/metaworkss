import React from "react";
import { Check, Sparkles } from "lucide-react";

const pricingPlans = [
  {
    name: "Basic",
    price: "Contact Us",
    description: "Perfect for small organizations starting their compliance journey",
    features: [
      "Up to 50 users",
      "NCA ECC Framework assessment",
      "Basic risk assessment",
      "Policy template library",
      "Email support",
      "Quarterly compliance reports",
      "Document storage (10GB)"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Standard",
    price: "Contact Us",
    description: "Ideal for growing organizations with advanced compliance needs",
    features: [
      "Up to 200 users",
      "All frameworks (NCA ECC, SAMA, PDPL, ISO 27001)",
      "Advanced risk management",
      "AI-powered policy generation",
      "Priority support (24/7)",
      "Monthly compliance reports",
      "Document storage (50GB)",
      "Virtual compliance consultant",
      "Integration with security tools"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Premium",
    price: "Contact Us",
    description: "Enterprise-grade solution with dedicated support",
    features: [
      "Unlimited users",
      "All Standard features",
      "Dedicated account manager",
      "Custom framework support",
      "White-label reports",
      "Advanced analytics & BI",
      "Unlimited document storage",
      "On-premise deployment option",
      "Custom integrations",
      "SLA guarantee (99.9% uptime)"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the perfect plan for your organization's compliance needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`relative backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-primary/20 to-emerald-400/20 border-2 border-primary shadow-xl shadow-primary/30' 
                  : 'bg-card/30 border border-primary/20 hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-emerald-400 text-white text-sm font-semibold">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <div className="text-3xl font-bold text-primary mb-2">{plan.price}</div>
                <p className="text-gray-400">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mr-3 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/#demo"
                className={`block w-full py-3 px-6 rounded-lg font-medium text-center transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg hover:shadow-xl'
                    : 'border border-primary/50 bg-background/30 text-primary hover:bg-primary/10'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="text-center space-y-4">
          <p className="text-gray-300 text-lg mb-6">
            Not sure which plan is right for you?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/#demo" 
              className="inline-block py-3 px-8 rounded-lg font-medium text-center bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Book a Demo
            </a>
            <a 
              href="/#contact" 
              className="inline-block py-3 px-8 rounded-lg font-medium text-center border border-primary/50 bg-background/30 text-primary shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-primary/10"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
