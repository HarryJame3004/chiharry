import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import {
  Moon,
  Sun,
  Bell,
  Clock,
  Volume2,
  RotateCcw,
  Award,
  Globe,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export default function Settings() {
  const { isDarkMode, toggleDarkMode, userProgress, dailyGoal, setDailyGoal, resetProgress } = useAppStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [studyReminder, setStudyReminder] = useState(true);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Einstellungen</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Passe dein Lernerlebnis an</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/20">
            DL
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Deutsch Lernen</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Level {userProgress.level} &bull; {userProgress.totalXP} XP
            </p>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
            <Award size={14} className="text-purple-400" />
            <span className="text-xs font-medium text-purple-400">A1.1</span>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
      >
        <div className={`px-6 py-3 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Erscheinungsbild</h3>
        </div>
        <div className="flex items-center gap-4 px-6 py-4">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
            {isDarkMode ? <Sun size={18} className="text-gray-400" /> : <Moon size={18} className="text-gray-500" />}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Dunkles Erscheinungsbild aktivieren</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-12 h-7 rounded-full transition-all relative ${
              isDarkMode ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-200'
            }`}
          >
            <motion.div
              animate={{ x: isDarkMode ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
            />
          </button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
      >
        <div className={`px-6 py-3 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Benachrichtigungen</h3>
        </div>
        <div className="divide-y divide-gray-200/5">
          {[
            { icon: Bell, label: 'Push-Benachrichtigungen', desc: 'Erinnerungen und Updates', val: notifications, set: () => setNotifications(!notifications) },
            { icon: Clock, label: 'Lernerinnerung', desc: 'Tägliche Lern-Erinnerung', val: studyReminder, set: () => setStudyReminder(!studyReminder) },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                <item.icon size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
              </div>
              <button
                onClick={item.set}
                className={`w-12 h-7 rounded-full transition-all relative ${
                  item.val ? 'bg-gradient-to-r from-purple-500 to-blue-500' : isDarkMode ? 'bg-white/10' : 'bg-gray-200'
                }`}
              >
                <motion.div
                  animate={{ x: item.val ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Audio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
      >
        <div className={`px-6 py-3 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Audio</h3>
        </div>
        <div className="flex items-center gap-4 px-6 py-4">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
            <Volume2 size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Soundeffekte</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Audio-Feedback aktivieren</p>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-12 h-7 rounded-full transition-all relative ${
              soundEnabled ? 'bg-gradient-to-r from-purple-500 to-blue-500' : isDarkMode ? 'bg-white/10' : 'bg-gray-200'
            }`}
          >
            <motion.div
              animate={{ x: soundEnabled ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
            />
          </button>
        </div>
      </motion.div>

      {/* Daily Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
      >
        <div className={`px-6 py-3 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lernziele</h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              <Award size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tägliches Ziel</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{dailyGoal} Minuten pro Tag</p>
            </div>
            <div className="flex gap-1">
              {[10, 15, 20, 30, 45, 60].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setDailyGoal(opt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    dailyGoal === opt
                      ? 'bg-purple-500 text-white'
                      : isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
      >
        <div className={`px-6 py-3 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Daten</h3>
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full flex items-center gap-4 px-6 py-4 text-left"
        >
          <div className={`p-2 rounded-lg bg-red-500/10`}>
            <RotateCcw size={18} className="text-red-400" />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium text-red-400`}>Fortschritt zurücksetzen</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Alle Daten löschen</p>
          </div>
          <ChevronRight size={16} className="text-red-400" />
        </button>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
      >
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-3">
          <Globe size={20} className="text-white" />
        </div>
        <h3 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>DeutschLernen A1.1</h3>
        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Version 1.0 &bull; Basierend auf VGU A1.1 Lehrmaterial</p>
      </motion.div>

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-6 rounded-2xl max-w-md w-full ${isDarkMode ? 'bg-[#1a1a2e] border border-white/10' : 'bg-white border border-gray-100'}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-yellow-400" />
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Fortschritt zurücksetzen?</h3>
            </div>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Lernfortschritte, XP und Erfolge werden gelöscht.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${isDarkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Abbrechen
              </button>
              <button
                onClick={() => { resetProgress(); setShowResetConfirm(false); }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Zurücksetzen
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
