import type { DictWordData } from '../types/dictionary';

interface DictionaryProps {
  dictResult: DictWordData | null;
  dictLoading: boolean;
  dictError: string;
  isDarkMode: boolean;
  playGermanAudio: (text: string) => void;
}

export default function Dictionary({
  dictResult,
  dictLoading,
  dictError,
  isDarkMode,
  playGermanAudio
}: DictionaryProps) {
  if (dictLoading) {
    return <div className="text-sm text-gray-400 py-2">Đang tra cứu từ điển...</div>;
  }

  if (dictError) {
    return (
      <div className={`p-3 rounded-xl border text-sm ${
        isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-100 text-red-600'
      }`}>
        {dictError}
      </div>
    );
  }

  if (!dictResult) return null;

  return (
    <div className="pt-2">
      <div className="flex items-center gap-3">
        <h4 className={`text-xl font-bold capitalize ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {dictResult.word}
        </h4>
        <button 
          onClick={() => playGermanAudio(dictResult.word)}
          className="px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-semibold hover:bg-purple-500/20 transition-colors"
        >
          🔊 Nghe phát âm
        </button>
      </div>
      
      <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {dictResult.meanings.map((meaning, mIdx) => (
          <div 
            key={mIdx} 
            className={`p-3.5 border-l-4 border-purple-500 rounded-r-xl ${
              isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50'
            }`}
          >
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">
              [{meaning.partOfSpeech}]
            </span>
            {meaning.definitions.map((def, dIdx) => (
              <div key={dIdx} className="text-sm">
                <p className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>• {def.definition}</p>
                {def.example && (
                  <p className="text-xs text-gray-400 italic mt-0.5 ml-3">
                    Ví dụ: "{def.example}"
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}