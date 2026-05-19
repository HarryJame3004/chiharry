import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { exercises } from '@/data/germanData';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, Zap, Clock } from 'lucide-react';

export default function Quiz() {
  const { isDarkMode, completeExercise, addXP, addQuizAttempt } = useAppStore();
  const [quizExercises, setQuizExercises] = useState<typeof exercises>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; userAnswer: string; correct: boolean }[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    if (quizStarted && !showResult && !quizFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer('');
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, showResult, quizFinished, currentIndex]);

  const startQuiz = () => {
    let filtered = selectedUnit === 'all' ? exercises : exercises.filter((e) => e.unit === selectedUnit);
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((e) => e.difficulty === selectedDifficulty);
    }
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuizExercises(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setQuizStarted(true);
    setQuizFinished(false);
    setShowResult(false);
    setSelectedAnswer(null);
    setTimeLeft(30);
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    const currentExercise = quizExercises[currentIndex];
    const isCorrect = answer === currentExercise.correctAnswer;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      addXP(10);
      completeExercise(currentExercise.id);
    }

    setAnswers((prev) => [
      ...prev,
      { questionId: currentExercise.id, userAnswer: answer, correct: isCorrect },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizExercises.length) {
      setCurrentIndex((prev) => prev + 1);
      setShowResult(false);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setQuizFinished(true);
      addQuizAttempt({
        id: `quiz-${Date.now()}`,
        quizId: 'mixed',
        score,
        total: quizExercises.length,
        answers,
        date: new Date().toISOString(),
        timeSpent: 0,
      });
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setScore(0);
    setAnswers([]);
    setCurrentIndex(0);
    setQuizExercises([]);
  };

  const currentExercise = quizExercises[currentIndex];

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quiz</h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Teste dein Wissen mit interaktiven Fragen</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-2xl border text-center ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-6">
            <Zap size={36} className="text-white" />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bereit für das Quiz?</h3>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {exercises.length} Fragen verfügbar • 10 zufällige Fragen
          </p>

          {/* Filters */}
          <div className="space-y-4 mb-6 text-left">
            <div>
              <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Einheit</label>
              <div className="flex flex-wrap gap-2">
                {['all', 1, 2, 3, 4].map((u) => (
                  <button
                    key={u}
                    onClick={() => setSelectedUnit(u as number | 'all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedUnit === u
                        ? 'bg-blue-500 text-white'
                        : isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {u === 'all' ? 'Alle' : `Einheit ${u}`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Schwierigkeit</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'easy', 'medium', 'hard'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                      selectedDifficulty === d
                        ? 'bg-purple-500 text-white'
                        : isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {d === 'all' ? 'Alle' : d === 'easy' ? 'Leicht' : d === 'medium' ? 'Mittel' : 'Schwer'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startQuiz}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            Quiz starten
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (quizFinished) {
    const percentage = Math.round((score / quizExercises.length) * 100);
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 rounded-2xl border text-center ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
        >
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
            percentage >= 80 ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
            percentage >= 50 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
            'bg-gradient-to-br from-red-500 to-pink-500'
          }`}>
            <Trophy size={40} className="text-white" />
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quiz beendet!</h3>
          <p className={`text-4xl font-bold mb-2 ${
            percentage >= 80 ? 'text-green-400' :
            percentage >= 50 ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {score}/{quizExercises.length}
          </p>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {percentage}% richtig
          </p>

          <div className="space-y-3 mb-6 text-left">
            {answers.map((ans, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl ${
                  ans.correct
                    ? isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-100'
                    : isDarkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-100'
                }`}
              >
                {ans.correct ? <CheckCircle size={18} className="text-green-400 mt-0.5" /> : <XCircle size={18} className="text-red-400 mt-0.5" />}
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{quizExercises[i]?.question}</p>
                  {!ans.correct && (
                    <p className="text-xs text-red-400 mt-1">Deine Antwort: {ans.userAnswer || '(keine)'}</p>
                  )}
                  <p className="text-xs text-green-400 mt-1">Richtig: {quizExercises[i]?.correctAnswer}</p>
                </div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetQuiz}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            <RotateCcw size={16} className="inline mr-2" />
            Nochmal versuchen
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress & Timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Frage {currentIndex + 1}/{quizExercises.length}
          </span>
          <div className={`w-24 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              animate={{ width: `${((currentIndex + 1) / quizExercises.length) * 100}%` }}
            />
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
          timeLeft <= 10 ? 'bg-red-500/20 text-red-400' : isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-600'
        }`}>
          <Clock size={14} />
          <span className="text-sm font-medium">{timeLeft}s</span>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className={`p-6 sm:p-8 rounded-2xl border ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
        >
          <div className="mb-6">
            <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
              {currentExercise.category}
            </span>
          </div>

          <h3 className={`text-lg sm:text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {currentExercise.question}
          </h3>
          <p className={`text-sm mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {currentExercise.questionVn}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {currentExercise.options?.map((option, i) => {
              let buttonClass = '';
              if (!showResult) {
                buttonClass = isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-purple-200';
              } else if (option === currentExercise.correctAnswer) {
                buttonClass = 'bg-green-500/10 border border-green-500/30';
              } else if (option === selectedAnswer && option !== currentExercise.correctAnswer) {
                buttonClass = 'bg-red-500/10 border border-red-500/30';
              } else {
                buttonClass = isDarkMode ? 'bg-white/5 border border-white/5 opacity-50' : 'bg-gray-50 border border-gray-100 opacity-50';
              }

              return (
                <motion.button
                  key={i}
                  whileHover={!showResult ? { scale: 1.01 } : {}}
                  whileTap={!showResult ? { scale: 0.99 } : {}}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${buttonClass}`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    showResult && option === currentExercise.correctAnswer
                      ? 'bg-green-500/20 text-green-400'
                      : showResult && option === selectedAnswer && option !== currentExercise.correctAnswer
                        ? 'bg-red-500/20 text-red-400'
                        : isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {showResult && option === currentExercise.correctAnswer ? (
                      <CheckCircle size={18} />
                    ) : showResult && option === selectedAnswer && option !== currentExercise.correctAnswer ? (
                      <XCircle size={18} />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{option}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6"
              >
                <div className={`p-4 rounded-xl ${
                  selectedAnswer === currentExercise.correctAnswer
                    ? isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-100'
                    : isDarkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-100'
                }`}>
                  <p className={`text-sm ${selectedAnswer === currentExercise.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedAnswer === currentExercise.correctAnswer ? 'Richtig!' : 'Falsch!'}
                  </p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{currentExercise.explanation}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  {currentIndex + 1 < quizExercises.length ? (
                    <>Nächste Frage <ChevronRight size={16} className="inline ml-1" /></>
                  ) : (
                    'Ergebnis anzeigen'
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
