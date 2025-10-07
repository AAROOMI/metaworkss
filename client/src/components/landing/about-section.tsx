import React from "react";
import { Award, MapPin, Rocket, Users, Shield, Heart } from "lucide-react";

const achievements = [
  {
    icon: Award,
    title: "Misk Launchpad 7 Graduate",
    description: "Successfully graduated from Misk Launchpad's 7th cohort, accelerating our growth in Saudi Arabia's startup ecosystem"
  },
  {
    icon: Rocket,
    title: "Tech Champions 5",
    description: "Proud participant of Tech Champions 5 program, showcasing innovation in cybersecurity compliance solutions"
  },
  {
    icon: Heart,
    title: "MCIT Support",
    description: "Supported by the Ministry of Communication and Information Technology, advancing digital transformation in the Kingdom"
  },
  {
    icon: Award,
    title: "Code Tech Champions 5",
    description: "Recognized by Code Tech Champions 5 for our technical excellence and innovation in compliance automation"
  }
];

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "We prioritize the security and privacy of your data in everything we build"
  },
  {
    icon: Users,
    title: "Customer Success",
    description: "Your compliance success is our mission. We're committed to your journey"
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "Continuously evolving our platform with cutting-edge AI and automation"
  }
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            About Meta Works
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-300 mb-6">
            <MapPin className="w-5 h-5 text-primary" />
            <p className="text-xl">Born and Raised in Saudi Arabia</p>
          </div>
        </div>

        {/* Story Section */}
        <div className="backdrop-blur-sm bg-gradient-to-br from-primary/10 to-emerald-400/10 border border-primary/20 rounded-2xl p-8 md:p-12 mb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">Our Story</h3>
          <div className="max-w-4xl mx-auto space-y-4 text-gray-200 text-lg leading-relaxed">
            <p>
              Meta Works is a pioneering cybersecurity company proudly born and raised in the Kingdom of Saudi Arabia. 
              We are dedicated to simplifying cybersecurity compliance for organizations across the region and beyond.
            </p>
            <p>
              Our mission is to empower businesses to achieve and maintain compliance with regulatory frameworks 
              such as NCA ECC, SAMA, PDPL, and ISO 27001 through innovative, AI-powered automation. We believe 
              that compliance should not be a burden but an enabler of trust and growth.
            </p>
            <p>
              With the support of prestigious programs and institutions including Misk Launchpad 7, Tech Champions 5, 
              and the Ministry of Communication and Information Technology (MCIT), we've developed a world-class 
              platform that combines cutting-edge technology with deep regulatory expertise.
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="backdrop-blur-sm bg-card/30 border border-primary/20 rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center flex-shrink-0">
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-white">{achievement.title}</h4>
                    <p className="text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="backdrop-blur-sm bg-card/30 border border-primary/20 rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white">{value.title}</h4>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-gray-300 mb-6 text-lg">
            Join hundreds of organizations trusting Meta Works for their compliance needs
          </p>
          <a 
            href="/#contact" 
            className="inline-block py-3 px-8 rounded-lg font-medium text-center bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
