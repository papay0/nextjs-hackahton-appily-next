"use client"

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import WaitlistForm from "@/components/WaitlistForm";
import { AppilyLogo } from "@/components/appily-logo";
import { InteractivePhone } from "@/components/InteractivePhone";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { AnimatedBackground } from "@/components/ui/animated-background";
import { GlowEffects } from "@/components/ui/glow-effects";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

export default function Home() {
  const [interactiveLabel, setInteractiveLabel] = useState("Interact with me, tap on an app");
  const isDev = process.env.NODE_ENV === 'development';


  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-background via-background/95 to-blue-950/5">
      {/* Animated background components */}
      <AnimatedBackground particleCount={30} />
      <GlowEffects />
      
      {/* Navbar */}
      <header className="container z-10 flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="relative size-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-center shadow-sm border border-blue-400/30 dark:border-blue-500/20">
            <AppilyLogo width={24} height={24} />
          </div>
          <span className="font-medium">Appily</span>
        </div>
        
        <div className="flex items-center gap-3">
          {isDev && (
            <Link href="/home">
              <Button variant="outline" size="sm" className="mr-2 border-blue-500/50 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
                DEV: Home
              </Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section - Waitlist focused */}
        <section id="waitlist" className="container flex flex-col items-center justify-center text-center pt-20 md:pt-28 pb-16 max-w-4xl mx-auto flex-1">
          <motion.div 
            className="flex items-center mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-7 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
              <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span>Coming Soon!</span>
            </div>
          </motion.div>
          
          <AnimatedGradientText className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            What do you want to build?
          </AnimatedGradientText>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            An app to build apps. Create, edit, and publish directly from your phone!
          </motion.p>
          
          {/* Waitlist Signup - Primary CTA */}
          <motion.div 
            className="w-full max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.h2 
              className="text-xl md:text-2xl font-semibold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >Join our waitlist for early access</motion.h2>
            <WaitlistForm />
            <motion.p 
              className="text-sm text-muted-foreground mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              Be the first to get access when we launch. No spam, ever.
            </motion.p>
          </motion.div>
        </section>

        {/* Feature Highlights - Two columns */}
        <section id="features" className="container py-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              className="bg-background/50 backdrop-blur border rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Create Apps in Minutes</h3>
              <p className="text-muted-foreground">
                Transform your ideas into apps with just a few taps on your phone. No desktop required.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-background/50 backdrop-blur border rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/>
                  <path d="M10 4h4"/>
                  <path d="M12 17v.01"/>
                  <path d="M9 21h6"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Publish to Appily Store</h3>
              <p className="text-muted-foreground">
                Share your creations instantly to the Appily Store, all from within the app on your iOS or Android device.
              </p>
            </motion.div>
          </div>
        </section>

        {/* App Store Preview with iPhone */}
        <section id="experience" className="container pb-20">
          <motion.div 
            className="relative overflow-hidden rounded-3xl border bg-background/50 backdrop-blur p-8 md:p-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-500/5"></div>
            
            {/* Light effects */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-sky-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="relative z-20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <AnimatedGradientText className="text-2xl md:text-3xl font-bold mb-4">
                  Coming soon to your device
                </AnimatedGradientText>
                <motion.p 
                  className="text-muted-foreground mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  Build, deploy, and access apps entirely within Appily. The Appily Store lives in your pocket — create apps from your phone, for your phone.
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <Button 
                    className="w-full sm:w-auto h-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      // Properly scroll to the waitlist section with smooth behavior
                      const waitlistSection = document.getElementById('waitlist');
                      if (waitlistSection) {
                        waitlistSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    Join Waitlist
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Interactive Phone */}
              <motion.div 
                className="relative mt-16 md:mt-0 flex flex-col items-center justify-center z-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                {/* Glow effects - position behind phone */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-sky-500/20 to-blue-500/30 rounded-[2.5rem] blur-xl opacity-40 animate-pulse"></div>
                <div className="absolute inset-0 border-2 border-blue-500/20 dark:border-blue-400/20 rounded-[2.5rem] animate-[ping_3s_ease-in-out_infinite]"></div>
                <div className="absolute -inset-4 border border-blue-500/10 dark:border-blue-400/10 rounded-[3rem] animate-[ping_4s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }}></div>
                
                {/* Interactive label - positioned with flexbox */}
                <div className="mb-12 mt-5 md:mt-0 md:mb-6 z-30">
                  <div className="bg-blue-100 dark:bg-blue-900/50 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 font-medium text-sm whitespace-nowrap">
                    <span className="wave-text font-semibold">{interactiveLabel}</span>
                    <span>👇</span>
                  </div>
                </div>
                
                {/* Interactive Phone Component */}
                <InteractivePhone onScreenChange={setInteractiveLabel} />
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="py-8 border-t w-full">
        <motion.div 
          className="container flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative size-6 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-center shadow-sm border border-blue-400/30 dark:border-blue-500/20">
              <AppilyLogo width={18} height={18} />
            </div>
            <span className="text-sm font-medium">Appily</span>
          </motion.div>
          <motion.div 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            © {new Date().getFullYear()} Appily. All rights reserved.
          </motion.div>
        </motion.div>
      </footer>
    </div>
  );
}