import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { grammarPoints, verbConjugations } from '@/data/germanData';
import { ChevronDown, BookOpen, Lightbulb, Table, GraduationCap, CheckCircle } from 'lucide-react';

export default function Grammar() {
  const { isDarkMode, userProgress, learnGrammar } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'grammar' | 'verbs'>('grammar');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');

  const filteredGrammar = selectedUnit === 'all' 
    ? grammarPoints 
    : grammarPoints.filter((g) => g.unit === selectedUnit);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!userProgress.grammarLearned.includes(id)) {
        learnGrammar(id);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Grammatik</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alle Grammatikthemen von A1.1</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setActiveTab('grammar')}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'grammar'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              : isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Grammatikthemen
        </button>
        <button
          onClick={() => setActiveTab('verbs')}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'verbs'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              : isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Verbkonjugation
        </button>
      </div>

      {/* Unit Filter */}
      {activeTab === 'grammar' && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[1, 2, 3, 4].map((u) => (
            <button
              key={u}
              onClick={() => setSelectedUnit(selectedUnit === u ? 'all' : u)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedUnit === u
                  ? 'bg-blue-500 text-white'
                  : isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Einheit {u}
            </button>
          ))}
        </div>
      )}

      {activeTab === 'grammar' ? (
        <div className="space-y-3">
          {filteredGrammar.map((grammar, index) => {
            const isExpanded = expandedId === grammar.id;
            const isLearned = userProgress.grammarLearned.includes(grammar.id);

            return (
              <motion.div
                key={grammar.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl border overflow-hidden ${
                  isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'
                }`}
              >
                <button
                  onClick={() => toggleExpand(grammar.id)}
                  className={`w-full flex items-center gap-4 p-5 text-left transition-all ${
                    isExpanded ? (isDarkMode ? 'bg-white/5' : 'bg-gray-50') : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isLearned
                      ? 'bg-green-500/20'
                      : isDarkMode
                        ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
                        : 'bg-gradient-to-br from-purple-100 to-pink-100'
                  }`}>
                    {isLearned ? (
                      <CheckCircle size={20} className="text-green-400" />
                    ) : (
                      <BookOpen size={18} className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{grammar.title}</h3>
                    <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{grammar.titleVn}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      E{grammar.unit}
                    </span>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`p-5 pt-0 space-y-5 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                        {/* Explanation */}
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-100'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <GraduationCap size={16} className="text-purple-400" />
                            <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>Erklärung</h4>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{grammar.explanation}</p>
                          <p className={`text-sm mt-2 italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{grammar.explanationVn}</p>
                        </div>

                        {/* Tables */}
                        {grammar.tables && grammar.tables.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Table size={16} className="text-blue-400" />
                              <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>Übersicht</h4>
                            </div>
                            {grammar.tables.map((table, ti) => (
                              <div key={ti} className={`overflow-x-auto rounded-xl border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className={isDarkMode ? 'bg-white/5' : 'bg-gray-50'}>
                                      {table.headers.map((h, hi) => (
                                        <th key={hi} className={`px-4 py-3 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {table.rows.map((row, ri) => (
                                      <tr key={ri} className={`${ri % 2 === 0 ? (isDarkMode ? 'bg-white/[0.02]' : 'bg-white') : (isDarkMode ? 'bg-white/[0.04]' : 'bg-gray-50')} ${isDarkMode ? 'border-t border-white/5' : 'border-t border-gray-100'}`}>
                                        {row.map((cell, ci) => (
                                          <td key={ci} className={`px-4 py-3 ${ci === 0 ? `font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}` : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{cell}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Examples */}
                        <div>
                          <h4 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                            <BookOpen size={16} />
                            Beispiele
                          </h4>
                          <div className="space-y-2">
                            {grammar.examples.map((ex, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-3.5 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}
                              >
                                <p className="text-sm font-medium text-blue-400">{ex.german}</p>
                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{ex.vietnamese}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Tips */}
                        <div>
                          <h4 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                            <Lightbulb size={16} />
                            Merkhilfen
                          </h4>
                          <div className="space-y-2">
                            {grammar.tips.map((tip, i) => (
                              <div
                                key={i}
                                className={`flex items-start gap-2 p-3 rounded-xl ${isDarkMode ? 'bg-yellow-500/5 border border-yellow-500/10' : 'bg-yellow-50 border border-yellow-100'}`}
                              >
                                <span className="text-yellow-500 mt-0.5">•</span>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{tip}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Verb Conjugations */
        <div className="space-y-4">
          {verbConjugations.map((verb, index) => (
            <motion.div
              key={verb.infinitive}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-3 py-1.5 rounded-lg ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <span className={`font-bold text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>{verb.infinitive}</span>
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{verb.meaning}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {Object.entries(verb.conjugations).map(([pronoun, form]) => (
                  <div
                    key={pronoun}
                    className={`p-2.5 rounded-xl text-center ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}
                  >
                    <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{pronoun}</p>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{form}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
