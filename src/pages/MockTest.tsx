import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { exercises } from '@/data/germanData';
import { Clock, AlertTriangle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';

interface TestQuestion {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  section: string;
}

export default function MockTest() {
  const { isDarkMode, addXP } = useAppStore();
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes
  const [showConfirm, setShowConfirm] = useState(false);

  const sections = [
    { id: 'hoeren', title: 'Hören', titleVn: 'Nghe', count: 10 },
    { id: 'lesen', title: 'Lesen', titleVn: 'Đọc', count: 10 },
    { id: 'grammatik', title: 'Grammatik & Wortschatz', titleVn: 'Ngữ pháp & Từ vựng', count: 15 },
    { id: 'schreiben', title: 'Schreiben', titleVn: 'Viết', count: 5 },
  ];

  const generateQuestions = useCallback(() => {
    const all: TestQuestion[] = [];

    // Hören - number listening
    const numbers = Object.entries({
      '13': 'dreizehn', '21': 'einundzwanzig', '35': 'fünfunddreißig',
      '42': 'zweiundvierzig', '56': 'sechsundfünfzig', '68': 'achtundsechzig',
      '77': 'siebenundsiebzig', '83': 'dreiundachtzig', '99': 'neunundneunzig', '100': 'hundert',
    });
    numbers.forEach(([num, word], i) => {
      all.push({
        id: `h-${i}`,
        type: 'multiple-choice',
        question: `Hören: Welche Zahl hören Sie? (${word})`,
        options: [String(Number(num) + 1), num, String(Number(num) - 1), String(Number(num) + 2)],
        correctAnswer: num,
        section: 'hoeren',
      });
    });

    // Lesen - reading comprehension
    const readingTexts = [
      { q: 'Ich heiße Anna. Ich komme aus Deutschland. Ich bin 20 Jahre alt.', questions: [
        { q: 'Wie heißt die Person?', options: ['Maria', 'Anna', 'Lisa', 'Sophie'], a: 'Anna' },
        { q: 'Woher kommt Anna?', options: ['Österreich', 'Deutschland', 'Schweiz', 'Frankreich'], a: 'Deutschland' },
      ]},
      { q: 'Ich wohne in Berlin. Ich studiere Medizin an der Universität.', questions: [
        { q: 'Wo wohnt die Person?', options: ['München', 'Hamburg', 'Berlin', 'Köln'], a: 'Berlin' },
        { q: 'Was studiert die Person?', options: ['BWL', 'Informatik', 'Medizin', 'Jura'], a: 'Medizin' },
      ]},
    ];
    readingTexts.forEach((text) => {
      text.questions.forEach((q, i) => {
        all.push({
          id: `l-${i}`,
          type: 'multiple-choice',
          question: `${text.q}\n\n${q.q}`,
          options: q.options,
          correctAnswer: q.a,
          section: 'lesen',
        });
      });
    });

    // Grammatik
    const grammarQs = exercises.slice(0, 15).map((e, i) => ({
      id: `g-${i}`,
      type: e.type,
      question: e.question,
      options: e.options,
      correctAnswer: e.correctAnswer,
      section: 'grammatik',
    }));
    all.push(...grammarQs);

    // Schreiben - fill in blank
    const writingQs = [
      { id: 's-0', q: 'Ich ___ (sein) Student.', a: 'bin' },
      { id: 's-1', q: 'Du ___ (wohnen) in Berlin.', a: 'wohnst' },
      { id: 's-2', q: 'Er ___ (trinken) Kaffee.', a: 'trinkt' },
      { id: 's-3', q: 'Wir ___ (lernen) Deutsch.', a: 'lernen' },
      { id: 's-4', q: 'Ich esse ___ (ein/einen) Salat.', a: 'einen' },
    ];
    writingQs.forEach((q) => {
      all.push({
        id: q.id,
        type: 'fill-blank',
        question: q.q,
        correctAnswer: q.a,
        section: 'schreiben',
      });
    });

    return all;
  }, []);

  const startTest = () => {
    const qs = generateQuestions();
    setQuestions(qs);
    setTestStarted(true);
    setTestFinished(false);
    setAnswers({});
    setTimeLeft(50 * 60);
    setCurrentSection(0);
    setCurrentQuestion(0);
  };

  useEffect(() => {
    if (testStarted && !testFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, testFinished]);

  const currentQ = questions.find((q) => q.section === sections[currentSection]?.id && 
    questions.filter((qq) => qq.section === sections[currentSection]?.id).indexOf(q) === currentQuestion);

  const finishTest = () => {
    setTestFinished(true);
    const score = Object.entries(answers).reduce((acc, [qId, ans]) => {
      const q = questions.find((qq) => qq.id === qId);
      return acc + (q?.correctAnswer === ans ? 1 : 0);
    }, 0);
    addXP(score * 5);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAnswer = (answer: string) => {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: answer }));
  };

  const nextQuestion = () => {
    const sectionQuestions = questions.filter((q) => q.section === sections[currentSection]?.id);
    if (currentQuestion + 1 < sectionQuestions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else if (currentSection + 1 < sections.length) {
      setCurrentSection((prev) => prev + 1);
      setCurrentQuestion(0);
    } else {
      setShowConfirm(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    } else if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      const prevSectionQuestions = questions.filter((q) => q.section === sections[currentSection - 1]?.id);
      setCurrentQuestion(prevSectionQuestions.length - 1);
    }
  };

  if (!testStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Probeklausur</h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Simuliere eine echte A1.1 Prüfung</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
        >
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {sections.map((section, i) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}
              >
                <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{section.title}</h4>
                <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{section.titleVn}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                  {section.count} Fragen
                </span>
              </motion.div>
            ))}
          </div>

          <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${isDarkMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-100'}`}>
            <AlertTriangle size={20} className="text-yellow-400 flex-shrink-0" />
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>Wichtige Hinweise</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Zeitlimit: 50 Minuten • Kein Zurückgehen möglich • Viel Erfolg!
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startTest}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            Probeklausur starten
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (testFinished) {
    const totalQuestions = questions.length;
    const correctAnswers = Object.entries(answers).reduce((acc, [qId, ans]) => {
      const q = questions.find((qq) => qq.id === qId);
      return acc + (q?.correctAnswer === ans ? 1 : 0);
    }, 0);
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 rounded-2xl border text-center ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
        >
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
            percentage >= 80 ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
            percentage >= 60 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
            'bg-gradient-to-br from-red-500 to-pink-500'
          }`}>
            <Trophy size={40} className="text-white" />
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Prüfung beendet!</h3>
          <p className={`text-4xl font-bold mb-2 ${
            percentage >= 80 ? 'text-green-400' :
            percentage >= 60 ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {correctAnswers}/{totalQuestions}
          </p>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {percentage}% • {percentage >= 80 ? 'Bestanden!' : 'Nicht bestanden'}
          </p>

          <div className="space-y-2 mb-6 text-left">
            {sections.map((section) => {
              const sectionQs = questions.filter((q) => q.section === section.id);
              const sectionCorrect = sectionQs.filter((q) => answers[q.id] === q.correctAnswer).length;
              return (
                <div key={section.id} className={`flex justify-between p-3 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{section.title}</span>
                  <span className={`text-sm font-medium ${sectionCorrect === sectionQs.length ? 'text-green-400' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {sectionCorrect}/{sectionQs.length}
                  </span>
                </div>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setTestStarted(false); setTestFinished(false); }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            <RotateCcw size={16} className="inline mr-2" />
            Neue Probeklausur
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const sectionQuestions = questions.filter((q) => q.section === sections[currentSection]?.id);
  const q = sectionQuestions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Abschnitt {currentSection + 1} von {sections.length}</p>
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{sections[currentSection]?.title}</h3>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            timeLeft < 300 ? 'bg-red-500/20 text-red-400' : isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            <Clock size={16} />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1 flex-wrap">
          {sectionQuestions.map((sq, i) => (
            <button
              key={sq.id}
              onClick={() => setCurrentQuestion(i)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                i === currentQuestion
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : answers[sq.id]
                    ? 'bg-green-500/20 text-green-400'
                    : isDarkMode ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        {q && (
          <motion.div
            key={`${currentSection}-${currentQuestion}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className={`p-6 sm:p-8 rounded-2xl border ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'}`}
          >
            <div className="mb-6">
              <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                Frage {currentQuestion + 1}/{sectionQuestions.length}
              </span>
            </div>

            <h3 className={`text-lg font-bold mb-6 whitespace-pre-line ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {q.question}
            </h3>

            {q.options ? (
              <div className="space-y-3">
                {q.options.map((option, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswer(option)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                      answers[q.id] === option
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30'
                        : isDarkMode ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      answers[q.id] === option
                        ? 'bg-purple-500/20 text-purple-400'
                        : isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{option}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Antwort eingeben..."
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none ${
                    isDarkMode ? 'bg-white/5 border border-white/10 focus:border-purple-500' : 'bg-gray-50 border border-gray-200 focus:border-purple-500'
                  }`}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={prevQuestion}
          disabled={currentSection === 0 && currentQuestion === 0}
          className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
            currentSection === 0 && currentQuestion === 0
              ? 'opacity-30 cursor-not-allowed'
              : isDarkMode ? 'bg-white/5 hover:bg-white/10 border border-white/10' : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          Zurück
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowConfirm(true)}
          className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
            isDarkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100'
          }`}
        >
          Abgeben
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextQuestion}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          {currentSection === sections.length - 1 && currentQuestion === sectionQuestions.length - 1 ? 'Abgeben' : 'Weiter'}
          <ChevronRight size={16} className="inline ml-1" />
        </motion.button>
      </div>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl max-w-md w-full ${isDarkMode ? 'bg-[#1a1a2e] border border-white/10' : 'bg-white border border-gray-100'}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={24} className="text-yellow-400" />
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Prüfung abgeben?</h3>
              </div>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Sie haben {Object.keys(answers).length} von {questions.length} Fragen beantwortet. Möchten Sie die Prüfung wirklich abgeben?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${isDarkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Weiter bearbeiten
                </button>
                <button
                  onClick={() => { setShowConfirm(false); finishTest(); }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium"
                >
                  Abgeben
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
