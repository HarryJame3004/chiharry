import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "../firebase";
import { useAppStore } from '@/store/useAppStore';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import type { DictWordData } from '../types/dictionary';
import {
  Flame,
  Clock,
  Zap,
  Trophy,
  LogOut,
  Search,
  BookOpen,
  AlertCircle,
  Loader2,
  Volume2,
  ShieldCheck
} from 'lucide-react';

export default function Dashboard() {
  const { isDarkMode, userProgress, setPage } = useAppStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // State xử lý riêng cho tính năng từ điển
  const [searchWord, setSearchWord] = useState('');
  const [dictResult, setDictResult] = useState<DictWordData | null>(null);
  const [dictLoading, setDictLoading] = useState(false);
  const [dictError, setDictError] = useState('');

  // ---------------------------------------------------------
  // HỆ THỐNG PHẢN HỒI ĐỘNG (DYNAMIC INTERACTION SYSTEM)
  // ---------------------------------------------------------
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Cấu hình Spring mượt mà tuyệt đối, tạo độ trễ quán tính như chất lỏng
  const springConfig = { damping: 30, stiffness: 90, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-400, 400], [25, -25]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-25, 25]), springConfig);

  // Ánh sáng động đuổi theo chuột phía sau tấm kính
  const spotlightX = useSpring(useTransform(mouseX, [-400, 400], [60, -60]), springConfig);
  const spotlightY = useSpring(useTransform(mouseY, [-400, 400], [60, -60]), springConfig);

  // Tự động lắng nghe và giữ trạng thái đăng nhập dù có refresh trang
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Hàm gọi API tra cứu từ điển ĐỨC - VIỆT thông minh
  const handleDictSearch = async () => {
    const cleanWord = searchWord.trim();
    if (!cleanWord) return;
    
    setDictLoading(true);
    setDictError('');
    setDictResult(null);

    const capitalizedWord = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1).toLowerCase();
    const searchTerms = [cleanWord, capitalizedWord, cleanWord.toLowerCase()];

    let extractText = "";
    let finalFoundWord = cleanWord;

    try {
      for (const term of searchTerms) {
        const url = `https://vi.wiktionary.org/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(term)}&explaintext=1&origin=*`;
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          const pages = data.query.pages;
          const pageId = Object.keys(pages)[0];
          
          if (pageId !== "-1" && pages[pageId].extract) {
            extractText = pages[pageId].extract;
            finalFoundWord = term; 
            break; 
          }
        }
      }

      if (!extractText || extractText.trim() === "") {
        throw new Error('Từ này chưa có trong kho dữ liệu Đức - Việt trực tuyến.');
      }

      let vietnameseDefinition = "";
      const lines = extractText.split('\n').map(l => l.trim());
      const germanSectionIdx = lines.findIndex(line => line.toLowerCase().includes('tiếng đức'));
      
      if (germanSectionIdx !== -1) {
        const targetLines = lines.slice(germanSectionIdx + 1)
          .filter(line => line && !line.startsWith('=') && !line.includes('Mục lục') && !line.includes('Cách phát âm'));
        
        vietnameseDefinition = targetLines.slice(0, 3).join('; ');
      } else {
        vietnameseDefinition = lines
          .filter(line => line && !line.startsWith('=') && !line.includes('Mục lục'))
          .slice(0, 2).join('; ');
      }

      if (!vietnameseDefinition || vietnameseDefinition.length < 3) {
        vietnameseDefinition = "Xem chi tiết nghĩa và các ví dụ ngữ cảnh tại hệ thống Wiktionary mở.";
      }

      const formattedResult: DictWordData = {
        word: finalFoundWord,
        meanings: [
          {
            partOfSpeech: "Từ điển Đức - Việt",
            definitions: [
              {
                definition: vietnameseDefinition,
                example: "Dữ liệu dịch nghĩa thời gian thực tự động chuẩn hóa."
              }
            ]
          }
        ]
      };

      setDictResult(formattedResult);
    } catch (err: any) {
      import('../types/dictionary').then((module) => {
        const lowerWord = cleanWord.toLowerCase();
        const localDict = (module as any).localDictionary;
        if (localDict && localDict[lowerWord]) {
          setDictResult(localDict[lowerWord]);
        } else {
          setDictError(err.message || 'Không tìm thấy dữ liệu từ điển.');
        }
      });
    } finally {
      setDictLoading(false);
    }
  };

  // Hàm phát âm tiếng Đức chuẩn sử dụng Web Speech API
  const playGermanAudio = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'de-DE'; 
      utterance.rate = 0.85;    

      const voices = window.speechSynthesis.getVoices();
      const germanVoice = voices.find(voice => voice.lang.startsWith('de-DE') && voice.name.includes('Google'));
      if (germanVoice) {
        utterance.voice = germanVoice;
      }

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Trình duyệt của bạn không hỗ trợ tính năng phát âm tự động.');
    }
  };

  // Xử lý di chuột tạo góc nghiêng 3D
  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = event.clientX - rect.left - width / 2;
    const mouseYFromCenter = event.clientY - rect.top - height / 2;
    mouseX.set(mouseXFromCenter);
    mouseY.set(mouseYFromCenter);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  // Hàm Đăng nhập Google
  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, "users", result.user.uid), {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        xp: 0,
        streak: 1,
        level: "A1",
        createdAt: new Date(),
      });
      alert(`Willkommen ${result.user.displayName} 🇩🇪`);
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  // Hàm Đăng xuất (Logout)
  const logout = async () => {
    try {
      await signOut(auth);
      setDictResult(null); 
      setSearchWord('');
      alert("Tschüss! Hẹn gặp lại bạn nhé! 👋");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#040408] z-[99999]">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/30 animate-[spin_4s_linear_infinite]"></div>
          <div className="absolute w-12 h-12 rounded-full border-4 border-transparent border-t-purple-500 border-b-cyan-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`fixed inset-0 w-full h-full flex flex-col justify-between items-center px-4 overflow-hidden select-none z-[9999] p-6 ${
          isDarkMode 
            ? 'bg-[#030307] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0a0a16] via-[#030307] to-[#010103]' 
            : 'bg-[#f4f5fa] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#e3e7ff] via-[#f4f5fa] to-[#ffffff]'
        }`}
        style={{ perspective: "1500px" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className={`absolute inset-0 opacity-[0.04] transition-all ${isDarkMode ? 'invert-0' : 'invert'}`} 
            style={{ 
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
              backgroundSize: '50px 50px',
              transform: 'perspective(500px) rotateX(60deg) translateY(-30%) scale(1.5)'
            }} 
          />

          <motion.div 
            style={{ x: spotlightX, y: spotlightY }}
            className="absolute top-[20%] left-[25%] w-[450px] h-[450px] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen"
          />
          <motion.div 
            style={{ x: spotlightY, y: spotlightX }}
            className="absolute bottom-[20%] right-[25%] w-[450px] h-[450px] bg-cyan-500/15 blur-[120px] rounded-full mix-blend-screen"
          />

          {[...Array(20)].map((_, i) => {
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const size = Math.random() * 5 + 3;
            return (
              <motion.div
                key={i}
                className={`absolute rounded-full ${isDarkMode ? 'bg-purple-400/40 shadow-[0_0_10px_#a855f7]' : 'bg-purple-600/30'}`}
                style={{
                  width: size,
                  height: size,
                  left: `${randomX}%`,
                  top: `${randomY}%`,
                }}
                animate={{
                  y: [0, -60, 0],
                  x: [0, Math.random() * 30 - 15, 0],
                  opacity: [0.1, 0.7, 0.1],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 max-w-md w-full">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`p-8 sm:p-10 rounded-[40px] border backdrop-blur-2xl shadow-[0_50px_100px_rgba(0,0,0,0.3)] flex flex-col items-center w-full relative transition-all duration-200 ease-out ${
              isDarkMode 
                ? 'bg-white/[0.01] border-white/[0.08] shadow-black/60' 
                : 'bg-white/40 border-gray-200/60 shadow-purple-900/5'
            }`}
          >
            <div className="absolute inset-0 rounded-[40px] p-[1px] bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 pointer-events-none" />

            <div className="relative w-40 h-40 mb-8 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-purple-500/40 p-2"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-double border-cyan-500/30"
              />
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(147,51,234,0.5)] cursor-pointer"
              >
                <span className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">🇩🇪</span>
              </motion.div>
            </div>

            <h1 
              className="text-4xl font-black tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 drop-shadow-md"
            >
              Chi Harry
            </h1>

            <p 
              className={`text-sm font-medium mb-8 tracking-wide px-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Hệ thống lõi ngôn ngữ đang sẵn sàng. Hãy kích hoạt cổng đăng nhập của bạn.
            </p>

            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(168,85,247,0.4)" }}
              whileTap={{ scale: 0.96 }}
              onClick={loginGoogle}
              className="w-full relative py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-bold tracking-wider text-sm shadow-lg overflow-hidden group flex items-center justify-center gap-3 border border-white/10"
            >
              <div className="absolute inset-y-0 w-1 bg-cyan-400 blur-sm top-0 bottom-0 left-0 animate-[laserScan_2s_infinite]" />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <ShieldCheck size={18} className="text-cyan-300 animate-pulse" />
              <span>ACCESS VIA GOOGLE</span>
            </motion.button>
          </motion.div>
        </div>

        <div 
          className={`text-[10px] font-mono tracking-[0.4em] uppercase font-bold flex flex-col items-center gap-1 opacity-40 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          <span>CORE SYS CONNECTED</span>
          <span className="text-purple-500 animate-pulse">cre: tran ngoc minh khoi</span>
        </div>

        <style>{`
          @keyframes laserScan {
            0% { left: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { left: 100%; opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div
        className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden ${
          isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'
        }`}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-black mb-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🇩🇪 Willkommen {currentUser.displayName || "bei Chi Harry"}
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Hôm nay bạn muốn học gì nào? Sẵn sàng chinh phục tiếng Đức nhé!
            </p>
            <button
              onClick={() => setPage('learn')}
              className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-md shadow-purple-500/25"
            >
              Start Learning
            </button>
          </div>

          <button
            onClick={logout}
            className={`self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:scale-105 active:scale-95 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
            }`}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Lernserie', value: `${userProgress.streak} Tage`, icon: Flame, color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-500/10' },
          { label: 'Gesamt XP', value: `${userProgress.totalXP}`, icon: Zap, color: 'from-purple-500 to-blue-500', bgColor: 'bg-purple-500/10' },
          { label: 'Lernzeit', value: `${Math.floor(userProgress.studyTime / 60)}h ${userProgress.studyTime % 60}m`, icon: Clock, color: 'from-cyan-500 to-teal-500', bgColor: 'bg-cyan-500/10' },
          { label: 'Level', value: `${userProgress.level}`, icon: Trophy, color: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-500/10' },
        ].map((stat, i) => (
          <div
            key={i}
            className={`relative p-5 rounded-2xl border backdrop-blur-sm overflow-hidden ${
              isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'
            }`}
          >
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-full ${stat.bgColor} blur-2xl opacity-50`} />
            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
              <stat.icon size={18} className="text-white" />
            </div>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
            <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className={`p-6 rounded-3xl border backdrop-blur-sm ${
        isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center gap-2.5 mb-4 text-purple-500 font-bold text-lg">
          <BookOpen className="w-5 h-5" />
          <h2>Wörterbuch (Từ điển Đức - Việt)</h2>
        </div>

        <div className="flex gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDictSearch()}
              placeholder="Nhập từ cần tra... (Ví dụ: Schule, Apfel, gehen)"
              className={`w-full pl-11 pr-4 py-3 rounded-2xl border outline-none text-sm transition-all ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 text-white focus:border-purple-500 focus:bg-white/10' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-400 focus:bg-white'
              }`}
            />
          </div>
          <button
            onClick={handleDictSearch}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-2xl text-sm transition-all shadow-md shadow-purple-500/20 active:scale-95"
          >
            Tra từ
          </button>
        </div>

        <div className="mt-4">
          <AnimatePresence mode="wait">
            {dictLoading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="flex items-center gap-2 text-sm text-gray-400 py-3"
              >
                <Loader2 className="w-4 h-4 animate-spin text-purple-500" /> Đang tìm kiếm trong kho từ điển...
              </motion.div>
            )}

            {dictError && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className={`flex items-center gap-2 text-sm p-3.5 rounded-2xl border ${
                  isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-100 text-red-600'
                }`}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {dictError}
              </motion.div>
            )}

            {dictResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={`border-t pt-4 mt-4 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <h4 className={`text-2xl font-black capitalize ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {dictResult.word}
                  </h4>
                  
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => playGermanAudio(dictResult.word)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isDarkMode 
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/25' 
                        : 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100'
                    }`}
                    title="Nghe phát âm tiếng Đức"
                  >
                    <Volume2 size={18} strokeWidth={2.5} />
                  </motion.button>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {dictResult.meanings.map((meaning, mIdx) => (
                    <div 
                      key={mIdx} 
                      className={`p-4 border-l-4 border-purple-500 rounded-r-2xl transition-all ${
                        isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50'
                      }`}
                    >
                      <span className="text-xs font-black text-purple-400 uppercase tracking-widest block mb-2">
                        [{meaning.partOfSpeech}]
                      </span>
                      {meaning.definitions.map((def, dIdx) => (
                        <div key={dIdx} className="text-sm mb-3 last:mb-0">
                          <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>• {def.definition}</p>
                          {def.example && (
                            <p className="text-xs text-gray-400 italic mt-1 ml-4 bg-purple-500/5 py-1 px-2.5 rounded-lg inline-block">
                              Bối cảnh: "{def.example}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}