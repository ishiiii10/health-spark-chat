
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const LandingHero = () => {
  return (
    <div className="relative overflow-hidden pt-24 md:pt-32 pb-16">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 h-64 w-64 bg-health-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/3 left-1/3 h-96 w-96 bg-accent rounded-full blur-3xl opacity-30"></div>
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 animate-in">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background">
            <span className="text-health-500">✨ Introducing HealthSparkChat</span>
          </div>
          
          <div className="space-y-4 max-w-[800px]">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Your Personal Health <span className="gradient-text">Assistant</span>
            </h1>
            <p className="text-xl text-muted-foreground md:px-10">
              Get instant, AI-powered health guidance for your questions and concerns. 
              Always available, always accurate.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-6">
            <Button size="lg" className="bg-health-500 hover:bg-health-600 text-white rounded-full">
              Try Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              Learn More
            </Button>
          </div>

          <div className="rounded-2xl overflow-hidden border bg-background shadow-xl w-full max-w-3xl mt-8">
            <div className="p-1 bg-gradient-to-r from-health-300 to-blue-300">
              <div className="bg-background p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-sm text-muted-foreground">preview@healthsparkchat.ai</div>
                </div>
                <div className="mt-6 space-y-4 pb-4 text-left">
                  <div className="bg-secondary rounded-lg p-4 max-w-[80%]">
                    <p className="text-sm">Hi, I'm experiencing headaches after working on my computer all day. What might be causing this?</p>
                  </div>
                  <div className="bg-health-100 rounded-lg p-4 ml-auto max-w-[80%]">
                    <p className="text-sm">That could be digital eye strain or tension headaches. Try taking regular breaks (every 20 minutes), adjusting your screen brightness, ensuring proper ergonomics, and staying hydrated. If headaches persist, consider consulting your doctor.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
