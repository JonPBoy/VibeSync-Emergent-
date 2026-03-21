'use client';

import { useState, useEffect } from 'react';
import { Heart, Copy, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StyleCard({ style, onPreview }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('vibesync_favorites') || '[]');
    setIsFavorite(favorites.includes(style.id));
  }, [style.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('vibesync_favorites') || '[]');
    if (favorites.includes(style.id)) {
      const updated = favorites.filter(id => id !== style.id);
      localStorage.setItem('vibesync_favorites', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      favorites.push(style.id);
      localStorage.setItem('vibesync_favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const copyCSS = () => {
    const css = `/* ${style.name} */
:root {
  --primary-color: ${style.primaryColor};
  --secondary-color: ${style.secondaryColor};
  --accent-color: ${style.accentColor};
  --background-color: ${style.backgroundColor};
  --text-color: ${style.textColor};
  --font-family: ${style.fontFamily};
  --border-radius: ${style.borderRadius};
  --shadow-style: ${style.shadowStyle};
}`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      {/* Visual Preview */}
      <div
        className="h-40 relative"
        style={{
          background: style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-24 h-24 flex items-center justify-center text-white font-bold text-2xl"
            style={{
              fontFamily: style.fontFamily,
              borderRadius: style.borderRadius,
              backgroundColor: style.accentColor,
              boxShadow: style.shadowStyle,
            }}
          >
            Aa
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-violet-600 bg-violet-100 rounded-full mb-2">
              {style.category}
            </span>
            <h3 className="text-lg font-bold text-slate-900">{style.name}</h3>
          </div>
          <button
            onClick={toggleFavorite}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={20}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}
            />
          </button>
        </div>

        {/* Color Swatches */}
        <div className="flex gap-2 mb-3">
          {[style.primaryColor, style.secondaryColor, style.accentColor].map((color, idx) => (
            <div
              key={idx}
              className="w-8 h-8 rounded-lg border-2 border-slate-200"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={copyCSS}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Copy size={16} />
            {copied ? 'Copied!' : 'Copy CSS'}
          </button>
          <button
            onClick={() => onPreview(style)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Eye size={16} />
            Preview
          </button>
        </div>
      </div>
    </motion.div>
  );
}