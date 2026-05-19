import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { lessons, vocabularies, grammarPoints, exercises } from '@/data/germanData';
import {
  BookOpen,
  GraduationCap,
  Zap,
  Target,
  Flame,
  Clock,
  Award,
  Star,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  
  
  
} from 'recharts';

const weeklyData = [
  { day: 'Mo', lessons: 1, vocab: 10, xp: 120 },
  { day: 'Di', lessons: 2, vocab: 15, xp: 200 },
  { day: 'Mi', lessons: 0, vocab: 8, xp: 80 },
  { day: 'Do', lessons: 1, vocab: 20, xp: 250 },
  { day: 'Fr', lessons: 2, vocab: 12, xp: 180 },
  { day: 'Sa', lessons: 3, vocab: 25, xp: 300 },
  { day: 'So', lessons: 1, vocab: 10, xp: 150 },
];

const unitProgress = [
  { unit: 'E1', lessons: 1, vocab: 38, grammar: 6 },
  { unit: 'E2', lessons: 1, vocab: 41, grammar: 3 },
  { unit: 'E3', lessons: 1, vocab: 30, grammar: 2 },
  { unit: 'E4', lessons: 1, vocab: 27, grammar: 2 },
];

export default function Progress() {
  const { isDarkMode, userProgress, setPage } = useAppStore();

  const totalLessons = lessons.length;
  const completedLessons = userProgress.completedLessons.length;
  const totalVocab = vocabularies.length;
  const learnedVocab = userProgress.vocabLearned.length;
  const totalGrammar = grammarPoints.length;
  const learnedGrammar = userProgress.grammarLearned.length;
  const totalExercises = exercises.length;
  const completedExercises = userProgress.completedExercises.length;

  const stats = [
    {
      label: 'Lektionen',
      current: completedLessons,
      total: totalLessons,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      percent: Math.round((completedLessons / totalLessons) * 100),
    },
    {
      label: 'Wortschatz',
      current: learnedVocab,
      total: totalVocab,
      icon: GraduationCap,
      color: 'from-purple-500 to-pink-500',
      percent: Math.round((learnedVocab / totalVocab) * 100),
    },
    {
      label: 'Grammatik',
      current: learnedGrammar,
      total: totalGrammar,
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      percent: Math.round((learnedGrammar / totalGrammar) * 100),
    },
    {
      label: 'Übungen',
      current: completedExercises,
      total: totalExercises,
      icon: Target,
      color: 'from-green-500 to-teal-500',
      percent: Math.round((completedExercises / totalExercises) * 100),
    },
  ];

  const milestones = [
    { label: 'Erste Lektion', icon: Star, done: completedLessons >= 1 },
    { label: '100 XP', icon: Zap, done: userProgress.totalXP >= 100 },
    { label: '3-Tage-Serie', icon: Flame, done: userProgress.streak >= 3 },
    { label: '50 Vokabeln', icon: GraduationCap, done: learnedVocab >= 50 },
    { label: 'Alle Grammatik', icon: BookOpen, done: learnedGrammar >= totalGrammar },
    { label: 'Alle Übungen', icon: Target, done: completedExercises >= totalExercises },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Fortschritt</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dein Lernfortschritt auf einen Blick</p>
      </div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
          >
            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
              <stat.icon size={18} className="text-white" />
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.current}</span>
              <span className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>/ {stat.total}</span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.percent}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
              />
            </div>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.percent}% abgeschlossen</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
        >
          <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Wöchentliche Aktivität</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#ffffff10' : '#e5e7eb'} />
              <XAxis dataKey="day" stroke={isDarkMode ? '#666' : '#9ca3af'} fontSize={12} />
              <YAxis stroke={isDarkMode ? '#666' : '#9ca3af'} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1a1a2e' : '#fff',
                  border: isDarkMode ? '1px solid #ffffff20' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  color: isDarkMode ? '#fff' : '#000',
                }}
              />
              <Area type="monotone" dataKey="xp" stroke="#8b5cf6" strokeWidth={2} fill="url(#activityGradient)" name="XP" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Unit Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
        >
          <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Fortschritt pro Einheit</h3>
          <div className="space-y-4">
            {unitProgress.map((unit, i) => (
              <motion.div
                key={unit.unit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Einheit {i + 1}</span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{unit.vocab} Vokabeln</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${userProgress.completedLessons.includes(`l${i + 1}`) ? 100 : 0}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-dashed border-gray-200/20">
            <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Zeitstatistik</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <Clock size={16} className="text-blue-400 mb-1" />
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{Math.floor(userProgress.studyTime / 60)}h</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Gesamt</p>
              </div>
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <Flame size={16} className="text-orange-400 mb-1" />
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userProgress.streak}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Serie</p>
              </div>
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <Award size={16} className="text-purple-400 mb-1" />
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userProgress.level}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Level</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
      >
        <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Meilensteine</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {milestones.map((milestone, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl ${
                milestone.done
                  ? isDarkMode ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20' : 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100'
                  : isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className={`p-2.5 rounded-lg ${
                milestone.done ? 'bg-gradient-to-br from-purple-500 to-blue-500' : isDarkMode ? 'bg-white/10' : 'bg-gray-200'
              }`}>
                <milestone.icon size={18} className={milestone.done ? 'text-white' : isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
              </div>
              <p className={`text-xs text-center ${milestone.done ? (isDarkMode ? 'text-purple-300' : 'text-purple-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                {milestone.label}
              </p>
              {milestone.done && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center"
                >
                  <CheckCircle size={12} className="text-green-400" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid sm:grid-cols-3 gap-4"
      >
        {[
          { label: 'Weiterlernen', desc: 'Nächste Lektion', icon: BookOpen, page: 'learn' as const, color: 'from-blue-500 to-cyan-500' },
          { label: 'Vokabeln üben', desc: 'Flashcards', icon: GraduationCap, page: 'vocabulary' as const, color: 'from-purple-500 to-pink-500' },
          { label: 'Quiz starten', desc: 'Wissen testen', icon: Zap, page: 'quiz' as const, color: 'from-orange-500 to-red-500' },
        ].map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            onClick={() => setPage(action.page)}
            className={`flex items-center gap-4 p-5 rounded-2xl border text-left transition-all ${
              isDarkMode ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]' : 'bg-white border-gray-100 hover:shadow-lg'
            }`}
          >
            <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color}`}>
              <action.icon size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{action.label}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{action.desc}</p>
            </div>
            <ChevronRight size={16} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
