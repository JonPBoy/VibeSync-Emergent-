'use client';

import { useState, useEffect } from 'react';
import { Heart, Copy, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

// Get contrasting color for text
const getContrastColor = (hexColor) => {
  if (!hexColor || hexColor.startsWith('rgba')) return '#ffffff';
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return '#ffffff';
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
};

export default function StyleCard({ style, onPreview }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('vibesync_favorites') || '[]');
    setIsFavorite(favorites.includes(style.id));
  }, [style.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('vibesync_favorites') || '[]');
    
    if (favorites.includes(style.id)) {
      const updated = favorites.filter(id => id !== style.id);
      localStorage.setItem('vibesync_favorites', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      favorites.push(style.id);
      localStorage.setItem('vibesync_favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      
      // If it's a custom style from randomizer, make sure it's saved
      if (style.category === 'custom' || style.category === 'randomized') {
        const customStyles = JSON.parse(localStorage.getItem('vibesync_custom_styles') || '[]');
        if (!customStyles.find(s => s.id === style.id)) {
          customStyles.push(style);
          localStorage.setItem('vibesync_custom_styles', JSON.stringify(customStyles));
        }
      }
    }
    
    // Dispatch storage event for other components to react
    window.dispatchEvent(new Event('storage'));
  };

  const copyCSS = (e) => {
    e.stopPropagation();
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
  --gradient-style: ${style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`};
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
        className="h-40 relative cursor-pointer"
        onClick={() => onPreview(style)}
        style={{
          background: style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-24 h-24 flex items-center justify-center font-bold text-2xl transition-transform hover:scale-110"
            style={{
              fontFamily: style.fontFamily,
              borderRadius: style.borderRadius,
              backgroundColor: style.accentColor,
              color: getContrastColor(style.accentColor),
              boxShadow: style.shadowStyle,
            }}
          >
            Aa
          </div>
        </div>
        {/* Category badge */}
        {style.category === 'custom' && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold rounded-full">
            Custom
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-violet-600 bg-violet-100 rounded-full mb-2 capitalize">
              {style.category}
            </span>
            <h3 className="text-lg font-bold text-slate-900 truncate">{style.name}</h3>
          </div>
          <button
            onClick={toggleFavorite}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0 ml-2"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={20}
              className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-400'}`}
            />
          </button>
        </div>

        {/* Color Swatches */}
        <div className="flex gap-2 mb-3">
          {[
            { color: style.primaryColor, label: 'Primary' },
            { color: style.secondaryColor, label: 'Secondary' },
            { color: style.accentColor, label: 'Accent' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="w-8 h-8 rounded-lg border-2 border-slate-200 cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: item.color }}
              title={`${item.label}: ${item.color}`}
            />
          ))}
          <div className="flex-1 text-right">
            <span 
              className="text-xs text-slate-500 truncate block"
              style={{ fontFamily: style.fontFamily }}
            >
              {style.fontFamily?.split(',')[0]}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={copyCSS}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              copied 
                ? 'bg-green-100 text-green-700' 
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
            }`}
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
