"use client";

import { useChessStore } from "@/store/useChessStore";
import { CourseCard } from "@/components/CourseCard";
import { CreateCourseModal } from "@/components/CreateCourseModal";
import { Search, Filter, Plus, Globe, Trophy, Flame } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CoursesDashboard() {
  const { groups, chapters, setActiveChapter, xp, streakCount, linesMastered } = useChessStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCourseClick = (groupId: string) => {
    const groupChapters = chapters.filter(c => c.groupId === groupId);
    if (groupChapters.length > 0) {
      setActiveChapter(groupChapters[0].id, "train");
      router.push("/dashboard/practice");
    }
  };

  const calculateProgress = (groupId: string) => {
    const groupChapters = chapters.filter(c => c.groupId === groupId);
    if (groupChapters.length === 0) return 0;
    const masteredCount = groupChapters.filter(c => linesMastered.includes(c.id)).length;
    return Math.round((masteredCount / groupChapters.length) * 100);
  };

  return (
    <div className="min-h-screen bg-base-900 pb-20 relative">
      {/* Top Gamification Bar */}
      <div className="sticky top-0 z-50 bg-base-900/80 backdrop-blur-md border-b border-white/5 px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-black text-white tracking-tighter">chessreps.com</Link>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
             <Trophy className="w-4 h-4 text-accent" />
             <span className="text-xs font-black">{xp}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
             <Flame className="w-4 h-4 text-orange-500" />
             <span className="text-xs font-black">{streakCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <Link href="/login" className="px-4 py-1.5 text-sm font-bold text-text-muted hover:text-white transition">Sign In</Link>
           <Link href="/register" className="px-5 py-1.5 bg-primary text-base-900 text-sm font-black rounded-full hover:scale-105 transition-transform shadow-glow-purple">
             Start for free
           </Link>
        </div>
      </div>

      {/* Purple Progress Bar (Decorative) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-1/3 h-2 bg-primary rounded-full blur-sm opacity-50" />

      {/* Premium Header */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 text-center">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-black text-white mb-4 tracking-tighter"
        >
          Chess Opening Courses
        </motion.h1>
        <motion.p 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-text-muted text-xl font-medium"
        >
          Join 500,000+ players already improving their game
        </motion.p>
      </div>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-base-800 border border-white/5 rounded-xl text-sm font-bold text-white hover:bg-base-700 transition">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
            <input 
              placeholder="Search openings..."
              className="pl-11 pr-4 py-2.5 bg-base-800 border border-white/5 rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-base-800 border border-white/5 rounded-xl text-sm font-bold text-white hover:bg-base-700 transition"
          >
            <Plus className="w-4 h-4" /> Create a Course
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-xl text-sm font-black text-primary hover:bg-primary/20 transition">
             <Globe className="w-4 h-4" /> Community Courses
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {groups.length === 0 ? (
          <div className="bg-base-800 rounded-3xl p-16 text-center border border-white/5 glass">
             <Plus className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
             <p className="text-text-muted font-bold text-lg max-w-md mx-auto">
               Your repertoire is empty. Start by importing a course or creating your own winning lines.
             </p>
             <button className="mt-8 px-8 py-3 bg-base-700 hover:bg-base-600 text-white font-black rounded-2xl transition">
               Get Started
             </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {groups.map((group, idx) => (
              <CourseCard 
                key={group.id}
                title={group.title}
                description={idx === 0 ? "If you click this, you're gonna make a lot of enemies. People hate London players because the opening is so solid and Black can do pretty much nothing to counter." : "A comprehensive guide to mastering this opening and gaining a clear advantage."}
                lineCount={group.chapterIds.length}
                progress={calculateProgress(group.id)}
                isNew={idx === 0}
                onClick={() => handleCourseClick(group.id)}
                fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
              />
            ))}
          </div>
        )}
      </div>

      <CreateCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
