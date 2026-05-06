"use client";

import Link from "next/link";
import { Play, ArrowRight, Shield, Zap, Target, Trophy, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-base-950">
      {/* Background styling for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-base-950 to-base-950 z-0" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full translate-y-1/3 -translate-x-1/4" />
      
      {/* Navbar */}
      <header className="w-full flex items-center justify-between p-8 z-10 sticky top-0 bg-base-950/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl border border-primary/20">
             <Shield className="w-7 h-7 text-primary" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">CHESS<span className="text-primary">FORGE</span></span>
        </div>
        <nav className="flex gap-8 items-center">
          <Link href="/login" className="text-sm font-black uppercase tracking-widest text-text-muted hover:text-white transition-colors">Log In</Link>
          <Link href="/dashboard" className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest bg-primary text-base-900 px-8 py-3 rounded-full hover:scale-105 transition-all shadow-glow-purple">
            Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 pb-32 pt-20">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-accent text-xs font-black uppercase tracking-widest mb-10 backdrop-blur-sm"
        >
          <Zap className="w-4 h-4 fill-accent" /> 
          <span>Master your repertoire in half the time</span>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-7xl md:text-9xl font-black tracking-tighter max-w-6xl text-white mb-10 leading-[0.9]"
        >
          Forge Lines. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">Master</span> the Board.
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-text-muted max-w-3xl mb-14 leading-relaxed font-medium"
        >
          The elite platform for serious chess players. Build your opening repertoire with active recall and gamified drills.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link href="/dashboard" className="group flex items-center gap-4 bg-white text-base-900 px-10 py-5 rounded-[24px] text-xl font-black hover:scale-105 transition-all duration-500 shadow-2xl">
            <Play className="w-6 h-6 fill-current" />
            START TRAINING
          </Link>
          <div className="flex items-center gap-4 px-6 py-4 rounded-[24px] bg-base-900/50 border border-white/5">
             <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                <Trophy className="w-5 h-5 text-accent" />
                <span className="text-sm font-black text-white">500+ XP</span>
             </div>
             <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-black text-white">DAILY STREAKS</span>
             </div>
          </div>
        </motion.div>

        {/* Board Demo Display */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-32 w-full max-w-6xl relative"
        >
           <div className="absolute inset-0 bg-primary/20 blur-[150px] rounded-full opacity-30" />
           <div className="relative glass-card rounded-[40px] p-8 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
              <div className="grid md:grid-cols-3 gap-8">
                 <div className="md:col-span-2 aspect-square md:aspect-video bg-base-950 rounded-[32px] border border-white/5 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1529692236671-f1f6e9460272?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                    <Target className="absolute w-24 h-24 text-primary opacity-20 animate-pulse" />
                    <span className="absolute text-2xl font-black uppercase tracking-widest text-primary/40">Drill Engine v2.0</span>
                 </div>
                 <div className="space-y-6 text-left">
                    <div className="h-2 w-1/3 bg-primary rounded-full" />
                    <h3 className="text-3xl font-black text-white">Master Every Variation.</h3>
                    <p className="text-text-muted font-medium">Our spaced-repetition algorithm ensures you never forget a critical line again.</p>
                    <ul className="space-y-4">
                       {[
                         { icon: Shield, text: "Defense Training" },
                         { icon: Zap, text: "Attack Drills" },
                         { icon: Target, text: "Precision Accuracy" }
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-white/70">
                            <item.icon className="w-5 h-5 text-primary" />
                            {item.text}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>
        </motion.div>
      </main>
    </div>
  );
}
