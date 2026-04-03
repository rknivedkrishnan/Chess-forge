"use client";

import { signIn } from "next-auth/react";
import { Shield, Zap, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid credentials. Try test@example.com / password");
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-base-900 flex flex-col justify-center items-center p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-base-900 to-base-900 z-0" />
      
      <div className="z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/20 p-3 rounded-2xl mb-4">
             <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-text-muted mt-2">Log in to continue forging your repertoire</p>
        </div>

        <div className="bg-base-800/80 backdrop-blur-xl border border-base-700 p-8 rounded-3xl shadow-2xl">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-base-900 border border-base-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-base-600 font-medium"
                placeholder="test@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-base-900 border border-base-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-base-600 font-medium"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary text-base-900 font-bold text-lg py-3.5 rounded-xl hover:bg-primary-hover transition-all shadow-[0_0_15px_rgba(129,182,76,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "Authenticating..." : "Log In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-base-700/50">
            <button 
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 bg-base-900 border border-base-600 text-white font-medium py-3 rounded-xl hover:bg-base-700 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Continue with Google
            </button>
          </div>
        </div>
        
        <p className="text-center text-text-muted mt-8 text-sm">
          Don't have an account? <Link href="/register" className="text-primary hover:underline font-semibold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
