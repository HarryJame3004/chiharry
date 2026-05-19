import { useAppStore } from '@/store/useAppStore';
import type { AppPage } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  BookText,
  HelpCircle,
  FileQuestion,
  BarChart3,
  Settings,
  X,
  Moon,
  Sun,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { page: AppPage; label: string; icon: typeof LayoutDashboard }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { page: 'learn', label: 'Lernen', icon: GraduationCap },
  { page: 'vocabulary', label: 'Wortschatz', icon: BookOpen },
  { page: 'grammar', label: 'Grammatik', icon: BookText },
  { page: 'quiz', label: 'Quiz', icon: HelpCircle },
  { page: 'mock-test', label: 'Probeklausur', icon: FileQuestion },
  { page: 'progress', label: 'Fortschritt', icon: BarChart3 },
  { page: 'settings', label: 'Einstellungen', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { currentPage, setPage, isDarkMode, toggleDarkMode, userProgress } = useAppStore();

  const handleNav = (page: AppPage) => {
    setPage(page);
    onClose();
  };

  const sidebarContent = (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-[#0f0f1a]' : 'bg-white'} border-r ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              DeutschLernen
            </h1>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>A1.1 Kurs</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10">
          <X size={18} />
        </button>
      </div>

      {/* User Card */}
      <div className={`mx-4 mb-4 p-4 rounded-2xl ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/20">
            DL
          </div>
          <div>
            <p className="font-semibold text-sm">Deutsch Lernen</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Level {userProgress.level} • {userProgress.totalXP} XP
            </p>
          </div>
        </div>
        <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((userProgress.totalXP % 500) / 500) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <p className={`text-xs mt-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {500 - (userProgress.totalXP % 500)} XP bis Level {userProgress.level + 1}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => handleNav(item.page)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/10 text-purple-300 border border-purple-500/20'
                    : 'bg-purple-50 text-purple-600 border border-purple-100'
                  : isDarkMode
                    ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-purple-400' : 'group-hover:text-purple-400 transition-colors'} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Dark Mode Toggle */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <button
          onClick={toggleDarkMode}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'
          }`}
        >
          {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-purple-500" />}
          <span className="text-sm font-medium">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
