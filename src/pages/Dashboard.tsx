import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "../firebase";
import { useAppStore } from '@/store/useAppStore';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  Flame,
  Clock,
  Zap,
  Trophy,
  LogOut,
} from 'lucide-react';

export default function Dashboard() {
  const { isDarkMode, userProgress, setPage } = useAppStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Khởi tạo các Hook của Framer Motion cho hiệu ứng 3D Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const xTransformPurple = useTransform(mouseX, [-300, 300], [30, -30]);
  const yTransformPurple = useTransform(mouseY, [-300, 300], [30, -30]);

  const xTransformCyan = useTransform(mouseX, [-300, 300], [-40, 40]);
  const yTransformCyan = useTransform(mouseY, [-300, 300], [-40, 40]);

  // Tự động lắng nghe và giữ trạng thái đăng nhập dù có refresh trang
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
      alert("Tschüss! Hẹn gặp lại bạn nhé! 👋");
    } catch (error) {
      console.log(error);
    }
  };

  // 1. Màn hình Loading khi đang check trạng thái Firebase
  if (loading) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#09090e] z-[99999]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  // 2. GIAO DIỆN CHÀO MỪNG 3D (KHI CHƯA ĐĂNG NHẬP)
  if (!currentUser) {
    return (
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`fixed inset-0 w-full h-full flex flex-col justify-between items-center px-4 overflow-hidden select-none z-[9999] ${
          isDarkMode ? 'bg-[#09090e]' : 'bg-[#f4f4fa]'
        }`}
      >
        {/* Nền cầu phát sáng 3D */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -50, 30, 0],
              scale: [1, 1.15, 0.9, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{ x: xTransformPurple, y: yTransformPurple }}
            className="absolute top-[15%] left-[20%] w-96 h-96 bg-purple-600/25 blur-[100px] rounded-full"
          />
          <motion.div 
            animate={{
              x: [0, -30, 50, 0],
              y: [0, 40, -40, 0],
              scale: [1, 0.85, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{ x: xTransformCyan, y: yTransformCyan }}
            className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] bg-cyan-500/20 blur-[120px] rounded-full"
          />

          {/* Các hạt nhỏ lơ lửng */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-purple-500/20'}`}
              style={{
                width: Math.random() * 6 + 4,
                height: Math.random() * 6 + 4,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -80, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: Math.random() * 6 + 6,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Card Login 3D */}
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 max-w-lg w-full">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`p-10 rounded-[36px] border backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col items-center w-full transition-all duration-150 ease-out ${
              isDarkMode 
                ? 'bg-white/[0.02] border-white/10 shadow-black/40' 
                : 'bg-white/60 border-gray-200/50 shadow-purple-900/5'
            }`}
          >
            <motion.div 
              style={{ transformStyle: "preserve-3d", translateZ: 50 }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              whileHover={{ scale: 1.1, rotateZ: 10 }}
              className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 flex items-center justify-center text-6xl shadow-[0_20px_50px_rgba(139,92,246,0.4)] mb-8 cursor-grab active:cursor-grabbing"
            >
              <span className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]">🇩🇪</span>
            </motion.div>

            <motion.h1 
              style={{ translateZ: 40 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-500 drop-shadow-sm"
            >
              Chi Harry
            </motion.h1>

            <motion.p 
              style={{ translateZ: 30 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-lg font-medium mb-10 max-w-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Chào mừng đến với web học tiếng Đức hiện đại ✨
            </motion.p>

            <motion.button
              style={{ translateZ: 60 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.05, boxShadow: "0_20px_40px_rgba(147,51,234,0.4)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={loginGoogle}
              className="relative w-full sm:w-72 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-bold tracking-wide shadow-lg overflow-hidden group"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full" style={{ animation: 'shimmer 1.5s infinite' }} />
              <span className="flex items-center justify-center gap-3">
                Login with Google
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Dòng chữ nhỏ Cre */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8, duration: 1 }}
          className={`pb-6 text-xs font-mono tracking-[0.3em] uppercase font-bold ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            cre: tran ngoc minh khoi
          </motion.span>
        </motion.div>

        <style>{`
          @keyframes shimmer {
            100% { transform: translateX(300%) skewX(-12deg); }
          }
        `}</style>
      </div>
    );
  }

  // 3. GIAO DIỆN HỌC TẬP CHÍNH (HIỂN THỊ TÊN USER KÈM NÚT LOGOUT)
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Thẻ Welcome chính có cá nhân hóa tên User */}
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

          {/* Nút Đăng xuất được bố trí gọn gàng, tinh tế */}
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

      {/* Grid thống kê chỉ số học tập */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Lernserie',
            value: `${userProgress.streak} Tage`,
            icon: Flame,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-500/10',
          },
          {
            label: 'Gesamt XP',
            value: `${userProgress.totalXP}`,
            icon: Zap,
            color: 'from-purple-500 to-blue-500',
            bgColor: 'bg-purple-500/10',
          },
          {
            label: 'Lernzeit',
            value: `${Math.floor(userProgress.studyTime / 60)}h ${userProgress.studyTime % 60}m`,
            icon: Clock,
            color: 'from-cyan-500 to-teal-500',
            bgColor: 'bg-cyan-500/10',
          },
          {
            label: 'Level',
            value: `${userProgress.level}`,
            icon: Trophy,
            color: 'from-yellow-500 to-amber-500',
            bgColor: 'bg-yellow-500/10',
          },
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
    </motion.div>
  );
}