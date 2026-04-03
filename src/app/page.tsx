import Link from "next/link";
import { Play, ArrowRight, Shield, Zap, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-base-900">
      {/* Background styling for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-base-700/30 via-base-900 to-base-900 z-0" />
      
      {/* Navbar */}
      <header className="w-full flex items-center justify-between p-6 z-10 glass-nav">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl">
             <Shield className="w-7 h-7 text-primary" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">Opening<span className="text-primary text-opacity-90">Forge</span></span>
        </div>
        <nav className="flex gap-6 items-center">
          <Link href="/login" className="text-sm font-semibold text-text-muted hover:text-white transition-colors duration-200">Log In</Link>
          <Link href="/dashboard" className="text-sm font-bold bg-primary text-base-900 px-6 py-2.5 rounded-full hover:bg-primary-hover hover:scale-105 transition-all shadow-[0_0_15px_rgba(129,182,76,0.3)]">Get Started</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 mt-12 md:mt-0 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-base-800/80 border border-base-700 text-accent text-sm font-bold mb-8 shadow-sm backdrop-blur-sm">
          <Zap className="w-4 h-4" /> 
          <span>The fastest way to memorize openings</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter max-w-5xl text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-text-muted mb-8 drop-shadow-2xl leading-[1.1]">
          Forge Your Repertoire. <br className="hidden md:block" />
          Dominate the Board.
        </h1>
        
        <p className="text-lg md:text-2xl text-text-muted max-w-3xl mb-12 leading-relaxed font-medium">
          A minimalist, lightning-fast platform designed for serious players to build and master chess openings through active recall.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <Link href="/dashboard" className="group flex items-center gap-3 bg-white text-base-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            <Play className="w-5 h-5 fill-current group-hover:translate-x-1 transition-transform" />
            Start Training
          </Link>
          <Link href="#features" className="group flex items-center gap-2 bg-base-800 hover:bg-base-700 text-white border border-base-600 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300">
            Explore Features <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Floating Demo Board Placeholder */}
        <div className="mt-28 w-full max-w-5xl relative perspective-1000">
           <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full" />
           <div className="relative border border-base-700/50 bg-base-800/40 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl overflow-hidden hidden md:block transform hover:-translate-y-2 transition-transform duration-700 border-t-white/10">
             <div className="w-full h-[500px] flex flex-col items-center justify-center text-text-muted bg-base-900/80 rounded-2xl border border-base-700/50 relative overflow-hidden">
               <Target className="w-20 h-20 opacity-30 mb-6 animate-pulse" />
               <span className="text-2xl font-bold tracking-tight opacity-80">Interactive Board Interface</span>
               <span className="text-sm mt-2 opacity-50">Drill Module Initializing...</span>
             </div>
           </div>
        </div>
      </main>
    </div>
  );
}
