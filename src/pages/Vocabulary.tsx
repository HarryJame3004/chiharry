import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { vocabularies } from '@/data/germanData';
import { Heart, Volume2, RotateCcw, BookOpen, Filter } from 'lucide-react';

const categories = [...new Set(vocabularies.map((v) => v.category))];
const units = [...new Set(vocabularies.map((v) => v.unit))];

export default function Vocabulary() {
  const { isDarkMode, toggleFavorite, flashcardState, flipCard, markKnown, markUnknown, resetFlashcards, learnVocab } = useAppStore();
  const [viewMode, setViewMode] = useState<'list' | 'flashcard'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredVocab = useMemo(() => {
    return vocabularies.filter((v) => {
      const matchCategory = selectedCategory === 'all' || v.category === selectedCategory;
      const matchUnit = selectedUnit === 'all' || v.unit === selectedUnit;
      const matchSearch = searchTerm === '' ||
        v.german.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vietnamese.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchUnit && matchSearch;
    });
  }, [selectedCategory, selectedUnit, searchTerm]);

  const currentCard = flashcardState.cards[flashcardState.currentIndex];
  const isFlashcardDone = flashcardState.currentIndex >= flashcardState.cards.length;

  const handleFlip = () => flipCard();
  const handleKnown = () => {
    if (currentCard) learnVocab(currentCard.id);
    markKnown();
  };
  const handleUnknown = () => markUnknown();

  const handleResetFlashcards = () => {
    const unit = selectedUnit !== 'all' ? selectedUnit : undefined;
    const category = selectedCategory !== 'all' ? selectedCategory : undefined;
    resetFlashcards(unit, category);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Wortschatz</h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{filteredVocab.length} Vokabeln</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Liste
          </button>
          <button
            onClick={() => setViewMode('flashcard')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'flashcard'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Karteikarten
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Vokabeln suchen..."
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none ${
              isDarkMode ? 'bg-white/5 border border-white/10 focus:border-purple-500' : 'bg-gray-50 border border-gray-200 focus:border-purple-500'
            }`}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${
              isDarkMode ? 'bg-white/5 hover:bg-white/10 border border-white/10' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Filter size={16} />
            Filter
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === 'all' ? 'bg-purple-500 text-white' : isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Alle Kategorien
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat ? 'bg-purple-500 text-white' : isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => setSelectedUnit('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedUnit === 'all' ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Alle Einheiten
                </button>
                {units.map((u) => (
                  <button
                    key={u}
                    onClick={() => setSelectedUnit(u)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedUnit === u ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Einheit {u}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredVocab.map((vocab, i) => (
              <motion.div
                key={vocab.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`p-5 rounded-2xl border transition-all ${
                  isDarkMode
                    ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-purple-500/30'
                    : 'bg-white border-gray-100 hover:shadow-lg hover:border-purple-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {vocab.article && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        vocab.article === 'der' ? 'bg-blue-500/20 text-blue-400' :
                        vocab.article === 'die' ? 'bg-pink-500/20 text-pink-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {vocab.article}
                      </span>
                    )}
                    <button
                      onClick={() => toggleFavorite(vocab.id)}
                      className="transition-colors"
                    >
                      <Heart
                        size={16}
                        className={vocab.isFavorite ? 'text-red-400 fill-red-400' : isDarkMode ? 'text-gray-600' : 'text-gray-300'}
                      />
                    </button>
                  </div>
                  <button className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                    <Volume2 size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                  </button>
                </div>

                <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{vocab.german}</h3>
                <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{vocab.ipa}</p>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{vocab.vietnamese}</p>
                {vocab.plural && (
                  <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Plural: <span className="font-medium">{vocab.plural}</span>
                  </p>
                )}

                <div className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p className="text-xs text-blue-400">{vocab.example}</p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{vocab.exampleVn}</p>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    {vocab.category}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    E{vocab.unit}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Flashcard Mode */
        <div className="max-w-lg mx-auto">
          {isFlashcardDone ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-8 rounded-2xl border text-center ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                <BookOpen size={32} className="text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Runde beendet!</h3>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Bekannt: {flashcardState.known.length} | Unbekannt: {flashcardState.unknown.length}
              </p>
              <button
                onClick={handleResetFlashcards}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
              >
                <RotateCcw size={16} className="inline mr-2" />
                Nochmal lernen
              </button>
            </motion.div>
          ) : currentCard ? (
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Karte {flashcardState.currentIndex + 1} / {flashcardState.cards.length}
                </span>
                <div className={`w-32 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    animate={{ width: `${((flashcardState.currentIndex + 1) / flashcardState.cards.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Flashcard */}
              <motion.div
                className="relative cursor-pointer"
                onClick={handleFlip}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ rotateY: flashcardState.isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className={`w-full aspect-[4/3] rounded-2xl border p-8 flex flex-col items-center justify-center text-center ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20'
                      : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100'
                  }`}
                >
                  {/* Front */}
                  <div
                    style={{ backfaceVisibility: 'hidden' }}
                    className={`absolute inset-0 flex flex-col items-center justify-center p-8 ${flashcardState.isFlipped ? 'opacity-0' : 'opacity-100'}`}
                  >
                    {currentCard.article && (
                      <span className={`text-sm font-bold px-3 py-1 rounded-full mb-4 ${
                        currentCard.article === 'der' ? 'bg-blue-500/20 text-blue-400' :
                        currentCard.article === 'die' ? 'bg-pink-500/20 text-pink-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {currentCard.article}
                      </span>
                    )}
                    <h3 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {currentCard.german}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{currentCard.ipa}</p>
                    <p className={`text-xs mt-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Tippen zum Aufdecken</p>
                  </div>

                  {/* Back */}
                  <div
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    className={`absolute inset-0 flex flex-col items-center justify-center p-8 ${flashcardState.isFlipped ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <p className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                      {currentCard.vietnamese}
                    </p>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{currentCard.example}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{currentCard.exampleVn}</p>
                    {currentCard.plural && (
                      <p className={`text-xs mt-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Plural: {currentCard.plural}
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUnknown}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                    isDarkMode
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                      : 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100'
                  }`}
                >
                  Noch lernen
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleKnown}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                    isDarkMode
                      ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
                      : 'bg-green-50 text-green-500 hover:bg-green-100 border border-green-100'
                  }`}
                >
                  Gewusst!
                </motion.button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
