
import React from 'react';
import Navbar from '@/components/Navbar';
import LandingHero from '@/components/LandingHero';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <LandingHero />
        
        <section id="chat-demo" className="py-20 px-4">
          <div className="container">
            <div className="text-center space-y-4 mb-10">
              <h2 className="text-3xl font-bold">Try the AI Health Assistant</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ask our AI about common health concerns, wellness tips, or medical information. Get answers instantly.
              </p>
            </div>
            
            <ChatInterface />
          </div>
        </section>
        
        <section id="features" className="py-20 px-4 bg-secondary/50">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold">How HealthSparkChat Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powered by advanced AI to provide reliable health information when you need it most.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Instant Answers",
                  description: "Get immediate responses to your health questions, available 24/7.",
                  icon: "⚡"
                },
                {
                  title: "Medical Knowledge",
                  description: "Access information vetted by healthcare professionals.",
                  icon: "🧠"
                },
                {
                  title: "Private & Secure",
                  description: "Your health conversations stay private and protected.",
                  icon: "🔒"
                }
              ].map((feature, i) => (
                <div key={i} className="glass-panel p-6 text-center space-y-3">
                  <div className="text-4xl mx-auto">{feature.icon}</div>
                  <h3 className="font-bold text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-health-500 fill-health-500" />
              <span className="font-bold">HealthSparkChat</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HealthSparkChat. All rights reserved.
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-health-500 transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-health-500 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-health-500 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
