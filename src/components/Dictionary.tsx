import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { DictWordData } from '../types/dictionary';

export default function Dictionary() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<DictWordData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!word.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/de/${word.trim().toLowerCase()}`);
      if (!response.ok) throw new Error('Không tìm thấy từ này trong hệ thống.');
      const data = await response.json();
      setResult(data[0]);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối từ điển.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-teal-50 rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3 text-teal-800 font-bold text-base">
        <BookOpen className="w-5 h-5 text-teal-500" />
        <h3>Từ điển Đức - Anh</h3>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Tra từ... (vd: Schule, Apfel)"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 focus:border-teal-400 rounded-xl outline-none text-sm transition-all bg-gray-50/50 focus:bg-white"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
        >
          Tra
        </button>
      </div>

      {/* Kết quả hiển thị đi kèm Animation mượt */}
      <div className="mt-3">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-sm text-gray-500 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-teal-500" /> Đang tra cứu dữ liệu...
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </motion.div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-t border-gray-100 pt-3 mt-3">
              <h4 className="text-lg font-bold text-gray-800 capitalize mb-2">{result.word}</h4>
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {result.meanings.map((meaning, mIdx) => (
                  <div key={mIdx} className="p-3 bg-teal-50/30 border-l-4 border-teal-500 rounded-r-xl">
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">
                      [{meaning.partOfSpeech}]
                    </span>
                    {meaning.definitions.map((def, dIdx) => (
                      <div key={dIdx} className="text-sm text-gray-600 mb-1.5 last:mb-0">
                        <p className="font-medium text-gray-700">• {def.definition}</p>
                        {def.example && <p className="text-xs text-gray-400 italic mt-0.5 ml-3">Bối cảnh: "{def.example}"</p>}
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
  );
}