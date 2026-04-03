import { BookOpen, GraduationCap, Target, Settings, Shield } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-base-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-base-800 border-r border-base-700 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-base-700">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition">
               <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white drop-shadow-sm">Opening<span className="text-primary text-opacity-90">Forge</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs font-bold text-text-muted mb-4 uppercase tracking-wider pl-3 mt-4">Menu</div>
          
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl text-text-main font-semibold hover:bg-base-700 transition group">
            <BookOpen className="w-5 h-5 text-text-muted group-hover:text-white transition" />
            My Repertoires
          </Link>
          
          <Link href="/dashboard/learn" className="flex items-center gap-3 px-3 py-3 rounded-xl text-text-main font-semibold hover:bg-base-700 transition group">
            <GraduationCap className="w-5 h-5 text-text-muted group-hover:text-white transition" />
            Learn Mode
          </Link>

          <Link href="/dashboard/practice" className="flex items-center gap-3 px-3 py-3 rounded-xl text-text-main font-semibold hover:bg-base-700 transition group">
            <Target className="w-5 h-5 text-text-muted group-hover:text-white transition" />
            Practice Mode
          </Link>
        </nav>

        <div className="p-4 border-t border-base-700">
           <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-text-muted font-semibold hover:bg-base-700 hover:text-white transition group">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-base-700/10 via-base-900 to-base-900 z-0 pointer-events-none" />
        <div className="z-10 flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
