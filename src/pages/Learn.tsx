import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { lessons } from '@/data/germanData';
import { CheckCircle, Lock, ChevronRight, BookOpen, GraduationCap, MessageCircle, HelpCircle, Play } from 'lucide-react';

export default function Learn() {
  const { isDarkMode, userProgress, completeLesson,  addXP } = useAppStore();
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleLesson = (id: string) => {
    setExpandedLesson(expandedLesson === id ? null : id);
    setActiveSection(null);
  };

  const handleCompleteLesson = (lessonId: string) => {
    completeLesson(lessonId);
    addXP(50);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Lerneinheiten</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Wähle eine Lektion und beginne zu lernen</p>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, index) => {
          const isCompleted = userProgress.completedLessons.includes(lesson.id);
          const isExpanded = expandedLesson === lesson.id;
          const isLocked = lesson.isLocked;

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl border overflow-hidden ${
                isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'
              }`}
            >
              {/* Lesson Header */}
              <button
                onClick={() => !isLocked && toggleLesson(lesson.id)}
                className={`w-full flex items-center gap-4 p-5 text-left transition-all ${
                  isExpanded ? (isDarkMode ? 'bg-white/5' : 'bg-gray-50') : ''
                } ${!isLocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-green-500/20'
                    : isDarkMode
                      ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
                      : 'bg-gradient-to-br from-purple-100 to-blue-100'
                }`}>
                  {isCompleted ? (
                    <CheckCircle size={24} className="text-green-400" />
                  ) : isLocked ? (
                    <Lock size={20} className="text-gray-500" />
                  ) : (
                    <span className={`text-lg font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>{lesson.unit}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{lesson.title}</h3>
                  <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{lesson.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      {lesson.vocabulary.length} Vokabeln
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      {lesson.grammar.length} Grammatik
                    </span>
                  </div>
                </div>

                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isLocked ? <Lock size={18} className="text-gray-500" /> : <ChevronRight size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />}
                </motion.div>
              </button>

              {/* Lesson Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={`p-5 pt-0 space-y-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                      {lesson.sections.map((section) => (
                        <div key={section.id}>
                          <button
                            onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                              isDarkMode
                                ? 'bg-white/5 hover:bg-white/10 border border-white/5'
                                : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${
                              section.type === 'vocabulary' ? 'bg-blue-500/20 text-blue-400' :
                              section.type === 'grammar' ? 'bg-purple-500/20 text-purple-400' :
                              section.type === 'dialogue' ? 'bg-green-500/20 text-green-400' :
                              section.type === 'exercise' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {section.type === 'vocabulary' && <BookOpen size={16} />}
                              {section.type === 'grammar' && <GraduationCap size={16} />}
                              {section.type === 'dialogue' && <MessageCircle size={16} />}
                              {section.type === 'exercise' && <HelpCircle size={16} />}
                              {section.type === 'intro' && <Play size={16} />}
                              {section.type === 'summary' && <CheckCircle size={16} />}
                              {section.type === 'listening' && <MessageCircle size={16} />}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{section.title}</p>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{section.titleVn}</p>
                            </div>
                            <ChevronRight size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                          </button>

                          <AnimatePresence>
                            {activeSection === section.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className={`p-4 mt-1 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{section.content}</p>
                                  {section.contentVn && (
                                    <p className={`text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{section.contentVn}</p>
                                  )}
                                  {section.examples && section.examples.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                      {section.examples.map((ex, i) => (
                                        <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
                                          <p className="text-sm font-medium text-blue-400">{ex.german}</p>
                                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ex.vietnamese}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}

                      {/* Complete Button */}
                      {!isCompleted && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCompleteLesson(lesson.id)}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm mt-4 hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
                        >
                          Lektion abschließen (+50 XP)
                        </motion.button>
                      )}

                      {isCompleted && (
                        <div className={`flex items-center justify-center gap-2 py-3 mt-4 rounded-xl ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                          <CheckCircle size={18} className="text-green-400" />
                          <span className="text-sm font-medium text-green-400">Abgeschlossen</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
