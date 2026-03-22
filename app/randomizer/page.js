'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Lock, Unlock, Download } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_STYLES } from '@/lib/mockStyles';
import { downloadWPTheme } from '@/lib/wpThemeGenerator';
import Navbar from '../components/Navbar';

export default function RandomizerPage() {
  const [styles, setStyles] = useState([]);
  const [currentStyle, setCurrentStyle] = useState(null);
  const [locks, setLocks] = useState({
    colors: false,
    typography: false,
    radius: false,
    shadow: false,
    animation: false,
  });
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    // Use mock data directly and generate initial random style
    setStyles(MOCK_STYLES);
    generateRandomStyle(MOCK_STYLES);
  };

  const generateRandomStyle = (sourceStyles = styles) => {
    if (sourceStyles.length === 0) return;

    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const newStyle = {
      id: `random-${Date.now()}`,
      name: 'Custom Random Mix',
      category: 'randomized',
    };

    // Colors
    if (!locks.colors || !currentStyle) {
      const colorSource = getRandomItem(sourceStyles);
      newStyle.primaryColor = colorSource.primaryColor;
      newStyle.secondaryColor = colorSource.secondaryColor;
      newStyle.accentColor = colorSource.accentColor;
      newStyle.backgroundColor = colorSource.backgroundColor;
      newStyle.textColor = colorSource.textColor;
      newStyle.gradientStyle = colorSource.gradientStyle;
    } else {
      newStyle.primaryColor = currentStyle.primaryColor;
      newStyle.secondaryColor = currentStyle.secondaryColor;
      newStyle.accentColor = currentStyle.accentColor;
      newStyle.backgroundColor = currentStyle.backgroundColor;
      newStyle.textColor = currentStyle.textColor;
      newStyle.gradientStyle = currentStyle.gradientStyle;
    }

    // Typography
    if (!locks.typography || !currentStyle) {
      const typoSource = getRandomItem(sourceStyles);
      newStyle.fontFamily = typoSource.fontFamily;
    } else {
      newStyle.fontFamily = currentStyle.fontFamily;
    }

    // Border Radius
    if (!locks.radius || !currentStyle) {
      const radiusSource = getRandomItem(sourceStyles);
      newStyle.borderRadius = radiusSource.borderRadius;
    } else {
      newStyle.borderRadius = currentStyle.borderRadius;
    }

    // Shadow
    if (!locks.shadow || !currentStyle) {
      const shadowSource = getRandomItem(sourceStyles);
      newStyle.shadowStyle = shadowSource.shadowStyle;
    } else {
      newStyle.shadowStyle = currentStyle.shadowStyle;
    }

    // Animation
    if (!locks.animation || !currentStyle) {
      const animSource = getRandomItem(sourceStyles);
      newStyle.animationName = animSource.animationName;
    } else {
      newStyle.animationName = currentStyle.animationName;
    }

    setCurrentStyle(newStyle);
  };

  const toggleLock = (lockName) => {
    setLocks((prev) => ({ ...prev, [lockName]: !prev[lockName] }));
  };

  const handleDownload = async () => {
    if (!currentStyle) return;

    try {
      setDownloading(true);
      await downloadWPTheme(currentStyle);
      setTimeout(() => setDownloading(false), 1000);
    } catch (error) {
      console.error('Failed to download theme:', error);
      alert('Failed to download theme. Please try again.');
      setDownloading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Shuffle className="text-violet-600" size={48} />
            Style Randomizer
          </h1>
          <p className="text-xl text-slate-600">
            Mix and match design properties to create unique styles
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Lock Properties</h2>
              <p className="text-sm text-slate-600 mb-6">
                Lock properties you want to keep when generating new random styles
              </p>

              <div className="space-y-3">
                {[
                  { key: 'colors', label: 'Colors & Gradients' },
                  { key: 'typography', label: 'Typography' },
                  { key: 'radius', label: 'Border Radius' },
                  { key: 'shadow', label: 'Shadow Style' },
                  { key: 'animation', label: 'Animation' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => toggleLock(item.key)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      locks[item.key]
                        ? 'bg-violet-50 border-violet-600 text-violet-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    {locks[item.key] ? (
                      <Lock size={20} className="text-violet-600" />
                    ) : (
                      <Unlock size={20} className="text-slate-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => generateRandomStyle()}
              disabled={styles.length === 0}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 text-white font-bold text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shuffle size={24} />
              Generate Random Mix
            </button>

            <button
              onClick={handleDownload}
              disabled={!currentStyle || downloading}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 text-violet-700 font-bold bg-violet-100 rounded-xl hover:bg-violet-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} />
              {downloading ? 'Generating...' : 'Download as WP Theme'}
            </button>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Live Preview</h2>
            {currentStyle ? (
              <motion.div
                key={currentStyle.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Visual Preview */}
                <div
                  className="rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center text-center"
                  style={{
                    background:
                      currentStyle.gradientStyle ||
                      `linear-gradient(135deg, ${currentStyle.primaryColor}, ${currentStyle.secondaryColor})`,
                    fontFamily: currentStyle.fontFamily,
                  }}
                >
                  <h3 className="text-3xl font-bold mb-4" style={{ color: '#ffffff' }}>
                    Your Random Style
                  </h3>
                  <p className="text-lg mb-6" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    A unique combination just for you
                  </p>
                  <button
                    className="px-6 py-3 font-semibold text-white"
                    style={{
                      backgroundColor: currentStyle.accentColor,
                      borderRadius: currentStyle.borderRadius,
                      boxShadow: currentStyle.shadowStyle,
                    }}
                  >
                    Sample Button
                  </button>
                </div>

                {/* Properties Display */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Font Family</span>
                    <span className="text-sm font-bold text-slate-900">
                      {currentStyle.fontFamily}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Border Radius</span>
                    <span className="text-sm font-bold text-slate-900">
                      {currentStyle.borderRadius}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600 block mb-2">
                      Color Palette
                    </span>
                    <div className="flex gap-2">
                      {[
                        currentStyle.primaryColor,
                        currentStyle.secondaryColor,
                        currentStyle.accentColor,
                      ].map((color, idx) => (
                        <div key={idx} className="flex-1 text-center">
                          <div
                            className="h-12 rounded-lg border-2 border-white shadow-sm mb-1"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs text-slate-600 font-mono">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-slate-400">
                <div className="text-center">
                  <Shuffle size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Click Generate to create a random style</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}