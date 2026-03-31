'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getHistory, clearHistory } from '@/lib/styleHistory';
import StyleCard from '../components/StyleCard';
import StylePreview from '../components/StylePreview';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    if (confirm('Clear all history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full hover:bg-white/50 transition">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Recently Viewed</h1>
              <p className="text-slate-600">Your style browsing history</p>
            </div>
          </div>
          {history.length > 0 && (
            <button onClick={handleClear} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
              <Trash2 size={18} /> Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <Clock size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 mb-2">No history yet</p>
            <Link href="/" className="text-violet-600 hover:underline">Start browsing styles</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {history.map((style, index) => (
              <motion.div key={`${style.id}-${index}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <div className="relative">
                  <StyleCard style={style} onPreview={() => setSelectedStyle(style)} />
                  <span className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                    {formatTime(style.viewedAt)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedStyle && <StylePreview style={selectedStyle} onClose={() => setSelectedStyle(null)} />}
    </div>
  );
}
