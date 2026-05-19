import { useState } from 'react';
import type { ReactNode } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Sidebar from './Sidebar';
import { Menu, Search, Bell, Flame, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }: { children: ReactNode }) {
  const { isDarkMode, userProgress, searchQuery, setSearchQuery, currentPage } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const pageNames: Record<string, string> = {
    dashboard: 'Dashboard',
    learn: 'Lernen',
    vocabulary: 'Wortschatz',
    grammar: 'Grammatik',
    quiz: 'Quiz',
    'mock-test': 'Probeklausur',
    progress: 'Fortschritt',
    settings: 'Einstellungen',
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0a0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Mobile Header */}
      <div className={`lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40 backdrop-blur-xl border-b ${isDarkMode ? 'bg-[#0a0a0f]/80 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/10">
          <Menu size={20} />
        </button>
        <h1 className="font-bold text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          DeutschLernen
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-orange-400">
            <Flame size={16} />
            <span className="text-sm font-bold">{userProgress.streak}</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className={`flex-1 min-h-screen ${isDarkMode ? 'bg-[#0a0a0f]' : 'bg-gray-50'}`}>
          {/* Desktop Header */}
          <header className={`hidden lg:flex items-center justify-between px-8 py-4 sticky top-0 z-30 backdrop-blur-xl border-b ${isDarkMode ? 'bg-[#0a0a0f]/80 border-white/10' : 'bg-white/80 border-gray-200'}`}>
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">{pageNames[currentPage]}</h2>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Search */}
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Suchen..."
                      className={`w-full px-4 py-2 rounded-xl text-sm outline-none ${isDarkMode ? 'bg-white/10 border border-white/20 focus:border-purple-500' : 'bg-gray-100 border border-gray-200 focus:border-purple-500'}`}
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <Search size={18} />
              </button>

              {/* Stats */}
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                  <Flame size={16} className="text-orange-400" />
                  <span className="text-sm font-bold text-orange-400">{userProgress.streak}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <Zap size={16} className="text-purple-400" />
                  <span className="text-sm font-bold text-purple-400">{userProgress.totalXP} XP</span>
                </div>
                <button className={`p-2 rounded-lg transition-colors relative ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold cursor-pointer">
                DL
              </div>
            </div>
          </header>

          {/* Page Content */}
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 lg:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
