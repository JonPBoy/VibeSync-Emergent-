'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Shuffle } from 'lucide-react';
import Link from 'next/link';
import { MOCK_STYLES } from '@/lib/mockStyles';

export default function ComparePage() {
  const [slots, setSlots] = useState([null, null, null]);
  const [showPicker, setShowPicker] = useState(null);
  const [search, setSearch] = useState('');

  const filteredStyles = MOCK_STYLES.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 50);

  const addStyle = (style, index) => {
    const newSlots = [...slots];
    newSlots[index] = style;
    setSlots(newSlots);
    setShowPicker(null);
    setSearch('');
  };

  const removeStyle = (index) => {
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
  };

  const randomFill = () => {
    const shuffled = [...MOCK_STYLES].sort(() => Math.random() - 0.5);
    setSlots([shuffled[0], shuffled[1], shuffled[2]]);
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
              <h1 className="text-3xl font-bold text-slate-900">Compare Styles</h1>
              <p className="text-slate-600">Side-by-side comparison of up to 3 styles</p>
            </div>
          </div>
          <button onClick={randomFill} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition">
            <Shuffle size={18} /> Random Fill
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {slots.map((style, index) => (
            <div key={index} className="relative">
              {style ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <button onClick={() => removeStyle(index)} className="absolute top-3 right-3 z-10 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
                    <X size={16} />
                  </button>
                  <div className="h-48 relative" style={{ background: style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})` }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white text-2xl font-bold" style={{ borderRadius: style.borderRadius }}>Aa</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{style.name}</h3>
                    <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-full">{style.category}</span>
                    <div className="mt-4 space-y-2">
                      <div className="flex gap-1">
                        {[style.primaryColor, style.secondaryColor, style.accentColor, style.backgroundColor, style.textColor].map((c, i) => (
                          <div key={i} className="w-8 h-8 rounded-lg border" style={{ backgroundColor: c }} title={c} />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">Font: {style.fontFamily.split(',')[0]}</p>
                      <p className="text-xs text-slate-500">Radius: {style.borderRadius}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <button onClick={() => setShowPicker(index)} className="w-full h-80 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-violet-500 hover:bg-violet-50 transition">
                  <Plus size={32} className="text-slate-400" />
                  <span className="text-slate-500">Add Style {index + 1}</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {slots.filter(Boolean).length > 1 && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Comparison Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Property</th>
                    {slots.filter(Boolean).map((s, i) => <th key={i} className="text-left py-2 px-3">{s.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {['category', 'primaryColor', 'secondaryColor', 'accentColor', 'backgroundColor', 'textColor', 'fontFamily', 'borderRadius'].map(prop => (
                    <tr key={prop} className="border-b">
                      <td className="py-2 px-3 font-medium capitalize">{prop.replace(/([A-Z])/g, ' $1')}</td>
                      {slots.filter(Boolean).map((s, i) => (
                        <td key={i} className="py-2 px-3">
                          {prop.includes('Color') ? (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded border" style={{ backgroundColor: s[prop] }} />
                              <span className="text-xs">{s[prop]}</span>
                            </div>
                          ) : prop === 'fontFamily' ? s[prop].split(',')[0] : s[prop]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showPicker !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowPicker(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search styles..." className="w-full px-4 py-2 border rounded-lg" autoFocus />
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {filteredStyles.map(style => (
                <button key={style.id} onClick={() => addStyle(style, showPicker)} className="text-left p-3 rounded-xl hover:bg-slate-50 border transition">
                  <div className="h-16 rounded-lg mb-2" style={{ background: style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})` }} />
                  <p className="font-medium text-sm truncate">{style.name}</p>
                  <p className="text-xs text-slate-500">{style.category}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
