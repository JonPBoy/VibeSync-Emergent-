'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Lock, Unlock, Download } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { downloadWPTheme } from '@/lib/wpThemeGenerator';
import Navbar from '../components/Navbar';

// Mock data for demo/fallback
const MOCK_STYLES = [
  {
    id: '1',
    name: 'Midnight Elegance',
    category: 'minimal',
    primaryColor: '#1a1a2e',
    secondaryColor: '#16213e',
    accentColor: '#0f3460',
    backgroundColor: '#f5f5f5',
    textColor: '#1a1a2e',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px',
    shadowStyle: '0 4px 6px rgba(0,0,0,0.1)',
    gradientStyle: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    animationName: 'fadeIn',
  },
  {
    id: '2',
    name: 'Ocean Breeze',
    category: 'gradient',
    primaryColor: '#0077be',
    secondaryColor: '#00a8e8',
    accentColor: '#00ff9f',
    backgroundColor: '#f0f9ff',
    textColor: '#1e3a5f',
    fontFamily: 'Poppins, sans-serif',
    borderRadius: '16px',
    shadowStyle: '0 8px 16px rgba(0,119,190,0.2)',
    gradientStyle: 'linear-gradient(135deg, #0077be 0%, #00a8e8 50%, #00ff9f 100%)',
    animationName: 'slideUp',
  },
  {
    id: '3',
    name: 'Sunset Glow',
    category: 'bold',
    primaryColor: '#ff6b6b',
    secondaryColor: '#ee5a6f',
    accentColor: '#feca57',
    backgroundColor: '#fff5f5',
    textColor: '#2d3436',
    fontFamily: 'Montserrat, sans-serif',
    borderRadius: '12px',
    shadowStyle: '0 10px 20px rgba(255,107,107,0.3)',
    gradientStyle: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #feca57 100%)',
    animationName: 'pulse',
  },
  {
    id: '4',
    name: 'Neon Dreams',
    category: 'neon',
    primaryColor: '#ff006e',
    secondaryColor: '#8338ec',
    accentColor: '#3a86ff',
    backgroundColor: '#0d1b2a',
    textColor: '#ffffff',
    fontFamily: 'Rajdhani, sans-serif',
    borderRadius: '4px',
    shadowStyle: '0 0 20px rgba(255,0,110,0.5), 0 0 40px rgba(131,56,236,0.3)',
    gradientStyle: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
    animationName: 'glow',
  },
  {
    id: '5',
    name: 'Retro Vibes',
    category: 'retro',
    primaryColor: '#ff9f1c',
    secondaryColor: '#ff6f59',
    accentColor: '#ffbf69',
    backgroundColor: '#fcf5e5',
    textColor: '#4a4a4a',
    fontFamily: 'Courier New, monospace',
    borderRadius: '20px',
    shadowStyle: '8px 8px 0 rgba(0,0,0,0.2)',
    gradientStyle: 'linear-gradient(135deg, #ff9f1c 0%, #ff6f59 100%)',
    animationName: 'bounce',
  },
];

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
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured. Using mock data.');
        setStyles(MOCK_STYLES);
        generateRandomStyle(MOCK_STYLES);
        return;
      }

      const { data, error } = await supabase.from('styles').select('*');

      if (error) {
        console.warn('Database error, using mock data:', error);
        setStyles(MOCK_STYLES);
        generateRandomStyle(MOCK_STYLES);
        return;
      }

      const stylesData = data && data.length > 0 ? data : MOCK_STYLES;
      setStyles(stylesData);
      if (stylesData.length > 0) {
        generateRandomStyle(stylesData);
      }
    } catch (error) {
      console.error('Error fetching styles, using mock data:', error);
      setStyles(MOCK_STYLES);
      generateRandomStyle(MOCK_STYLES);
    }
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

  if (!isSupabaseConfigured()) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-yellow-900 mb-4">⚠️ Database Not Connected</h2>
            <p className="text-yellow-800">
              The randomizer requires Supabase to be configured. Please run the setup script first.
            </p>
          </div>
        </div>
      </>
    );
  }

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