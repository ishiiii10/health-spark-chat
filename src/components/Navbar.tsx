
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Navbar = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-health-500 fill-health-500" />
          <span className="text-xl font-bold">HealthSparkChat</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium hover:text-health-500 transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-health-500 transition-colors">How it Works</a>
          <a href="#about" className="text-sm font-medium hover:text-health-500 transition-colors">About</a>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:flex">Login</Button>
          <Button className="bg-health-500 hover:bg-health-600 text-white">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
