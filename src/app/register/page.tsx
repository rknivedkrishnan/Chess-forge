"use client";

import { ShieldCheck, ShieldAlert, ArrowRight, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { register } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);

    try {
      const res = await register(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-base-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background styling for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-base-950 to-base-950 z-0" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 w-full max-w-[440px]"
      >
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="flex flex-col items-center group">
            <div className="bg-primary/20 p-4 rounded-3xl mb-4 border border-primary/20 group-hover:scale-110 transition-transform duration-500">
               <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Forge Account</h1>
          </Link>
          <p className="text-text-muted mt-2 font-medium">Join the elite training platform.</p>
        </div>

        <div className="glass-card p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          
          {error && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3"
            >
              <ShieldAlert className="w-5 h-5 flex-shrink-0" /> {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3"
            >
              <ShieldCheck className="w-5 h-5 flex-shrink-0" /> Account created! Redirecting...
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Display Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-base-900/50 border border-white/5 rounded-[20px] pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-base-600 font-bold"
                  placeholder="The Prodigy"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-base-900/50 border border-white/5 rounded-[20px] pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-base-600 font-bold"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-base-900/50 border border-white/5 rounded-[20px] pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-base-600 font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || success}
              className="w-full bg-primary text-base-900 font-black text-lg py-5 rounded-[24px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-3"
            >
              {isLoading ? "FORGING ACCOUNT..." : "SIGN UP"}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
        
        <p className="text-center text-text-muted mt-10 text-sm font-bold">
          ALREADY A MEMBER? <Link href="/login" className="text-primary hover:text-primary-hover transition-colors ml-1 uppercase tracking-wider">Log In</Link>
        </p>
      </motion.div>
    </div>
  );
}
