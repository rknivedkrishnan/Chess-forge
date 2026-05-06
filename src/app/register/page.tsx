"use client";

import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { register } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-base-900 flex flex-col justify-center items-center p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-base-900 to-base-900 z-0" />
      
      <div className="z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/20 p-3 rounded-2xl mb-4">
             <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
          <p className="text-text-muted mt-2">Join OpeningForge and start building your repertoire</p>
        </div>

        <div className="bg-base-800/80 backdrop-blur-xl border border-base-700 p-8 rounded-3xl shadow-2xl">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> {error}
            </div>
          )}

          {success && (
            <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Account created! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Display Name (Optional)</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-base-900 border border-base-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-base-600 font-medium"
                placeholder="Grandmaster"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-base-900 border border-base-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-base-600 font-medium"
                placeholder="your@email.com"
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
              disabled={isLoading || success}
              className="w-full bg-primary text-base-900 font-bold text-lg py-3.5 rounded-xl hover:bg-primary-hover transition-all shadow-[0_0_15px_rgba(129,182,76,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-base-700/50 text-center">
            <p className="text-sm text-text-muted">
              Already have an account? <Link href="/login" className="text-primary hover:underline font-semibold">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
