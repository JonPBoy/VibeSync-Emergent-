'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Lock, Unlock, Download, Heart, Palette, Type, Square, Sparkles, ChevronDown, Check, Wand2, Dices, Sun, Moon } from 'lucide-react';
import { MOCK_STYLES, generateRandomTheme } from '@/lib/mockStyles';
import { downloadWPTheme } from '@/lib/wpThemeGenerator';
import Navbar from '../components/Navbar';

// Pre-defined particle positions to avoid hydration mismatch (no Math.random during render)
const PARTICLE_CONFIGS = [
  { x: -150, y: -120, delay: 0.1, repeatDelay: 0.2 },
  { x: 180, y: -80, delay: 0.2, repeatDelay: 0.3 },
  { x: -100, y: 150, delay: 0.15, repeatDelay: 0.25 },
  { x: 120, y: 100, delay: 0.3, repeatDelay: 0.15 },
  { x: -180, y: 50, delay: 0.05, repeatDelay: 0.4 },
  { x: 80, y: -150, delay: 0.25, repeatDelay: 0.1 },
  { x: -50, y: 180, delay: 0.4, repeatDelay: 0.35 },
  { x: 160, y: -30, delay: 0.35, repeatDelay: 0.2 },
  { x: -120, y: -180, delay: 0.1, repeatDelay: 0.45 },
  { x: 40, y: 160, delay: 0.45, repeatDelay: 0.15 },
  { x: -160, y: -50, delay: 0.2, repeatDelay: 0.3 },
  { x: 100, y: -100, delay: 0.3, repeatDelay: 0.25 },
];

// Dice Rolling Animation Component
const DiceRollAnimation = ({ isRolling, onComplete }) => {
  const [diceValues, setDiceValues] = useState([1, 2, 3]);
  
  useEffect(() => {
    if (isRolling) {
      // Rapidly change dice values during roll
      const interval = setInterval(() => {
        setDiceValues([
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ]);
      }, 80);
      
      // Stop after animation
      setTimeout(() => {
        clearInterval(interval);
        onComplete();
      }, 1500);
      
      return () => clearInterval(interval);
    }
  }, [isRolling, onComplete]);

  const diceFaces = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
  };

  const DiceFace = ({ value, delay, color }) => (
    <motion.div
      initial={{ rotateX: 0, rotateY: 0, scale: 0.5 }}
      animate={isRolling ? {
        rotateX: [0, 360, 720, 1080],
        rotateY: [0, 360, 720, 1080],
        scale: [0.5, 1.2, 1],
      } : { rotateX: 0, rotateY: 0, scale: 1 }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
      className="w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-2xl relative"
      style={{ 
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-2 gap-1">
        {[0, 1, 2].map(row => 
          [0, 1, 2].map(col => {
            const hasDot = diceFaces[value]?.some(([r, c]) => r === row && c === col);
            return (
              <div key={`${row}-${col}`} className="flex items-center justify-center">
                {hasDot && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white shadow-inner"
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isRolling && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="flex gap-4 md:gap-6 justify-center mb-8"
            >
              <DiceFace value={diceValues[0]} delay={0} color="#8B5CF6" />
              <DiceFace value={diceValues[1]} delay={0.1} color="#D946EF" />
              <DiceFace value={diceValues[2]} delay={0.2} color="#06B6D4" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Rolling the dice...
              </h2>
              <p className="text-white/60">Creating something beautiful</p>
            </motion.div>
            
            {/* Sparkle particles - using pre-defined positions to avoid hydration mismatch */}
            {PARTICLE_CONFIGS.map((config, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 0,
                  scale: 0 
                }}
                animate={{ 
                  x: config.x, 
                  y: config.y, 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: config.delay,
                  repeat: Infinity,
                  repeatDelay: config.repeatDelay
                }}
                style={{
                  left: '50%',
                  top: '50%',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Expanded Font options organized by category
const FONT_OPTIONS = {
  'Modern Sans': [
    'Inter, sans-serif', 'Poppins, sans-serif', 'Montserrat, sans-serif', 
    'Outfit, sans-serif', 'Sora, sans-serif', 'Space Grotesk, sans-serif',
    'Plus Jakarta Sans, sans-serif', 'Lexend, sans-serif', 'Urbanist, sans-serif',
    'Manrope, sans-serif', 'Figtree, sans-serif', 'Albert Sans, sans-serif'
  ],
  'Classic Sans': [
    'Roboto, sans-serif', 'Open Sans, sans-serif', 'Lato, sans-serif',
    'Nunito, sans-serif', 'Karla, sans-serif', 'Rubik, sans-serif',
    'Quicksand, sans-serif', 'Raleway, sans-serif', 'Barlow, sans-serif'
  ],
  'Elegant Serif': [
    'Playfair Display, serif', 'Cormorant Garamond, serif', 'Libre Baskerville, serif',
    'DM Serif Display, serif', 'Fraunces, serif', 'Bodoni Moda, serif'
  ],
  'Classic Serif': [
    'Merriweather, serif', 'Lora, serif', 'Crimson Text, serif',
    'Source Serif 4, serif', 'Literata, serif', 'PT Serif, serif'
  ],
  'Display & Bold': [
    'Bebas Neue, sans-serif', 'Oswald, sans-serif', 'Anton, sans-serif',
    'Archivo Black, sans-serif', 'Righteous, sans-serif', 'Staatliches, sans-serif',
    'Teko, sans-serif', 'Fjalla One, sans-serif'
  ],
  'Handwritten': [
    'Pacifico, cursive', 'Dancing Script, cursive', 'Caveat, cursive',
    'Satisfy, cursive', 'Lobster, cursive', 'Kaushan Script, cursive'
  ],
  'Monospace': [
    'Fira Code, monospace', 'JetBrains Mono, monospace', 'Source Code Pro, monospace',
    'IBM Plex Mono, monospace', 'Space Mono, monospace'
  ]
};

// Border radius options
const RADIUS_OPTIONS = ['0px', '4px', '8px', '12px', '16px', '24px', '50px'];

// Shadow options
const SHADOW_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Subtle', value: '0 2px 4px rgba(0,0,0,0.1)' },
  { label: 'Medium', value: '0 4px 12px rgba(0,0,0,0.15)' },
  { label: 'Strong', value: '0 8px 24px rgba(0,0,0,0.2)' },
  { label: 'Glow', value: '0 0 20px rgba(139,92,246,0.5)' },
];

// Get contrasting color for text
const getContrastColor = (hexColor) => {
  if (!hexColor || hexColor.startsWith('rgba')) return '#ffffff';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
};

export default function RandomizerPage() {
  const [styles, setStyles] = useState([]);
  const [currentStyle, setCurrentStyle] = useState(null);
  const [darkModeStyle, setDarkModeStyle] = useState(null); // Separate dark mode style
  const [locks, setLocks] = useState({
    colors: false,
    typography: false,
    radius: false,
    shadow: false,
  });
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [activePanel, setActivePanel] = useState('colors');
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setStyles(MOCK_STYLES);
    // Generate initial theme only after mount to avoid hydration mismatch
    const initialTheme = generateRandomTheme();
    setCurrentStyle(initialTheme);
    // Generate dark mode variant
    const darkTheme = {
      ...initialTheme,
      backgroundColor: '#1a1a2e',
      textColor: '#ffffff',
      cardBackground: '#252540',
      cardText: '#e2e8f0',
    };
    setDarkModeStyle(darkTheme);
  }, []);

  // Dice roll handler with animation
  const handleDiceRoll = () => {
    setIsRollingDice(true);
  };

  const onDiceRollComplete = () => {
    // Reset all locks for a completely fresh theme
    setLocks({
      colors: false,
      typography: false,
      radius: false,
      shadow: false,
    });
    
    // Generate completely new theme
    const newTheme = generateRandomTheme();
    setCurrentStyle(newTheme);
    // Generate dark mode variant
    setDarkModeStyle({
      ...newTheme,
      backgroundColor: '#1a1a2e',
      textColor: '#ffffff',
      cardBackground: '#252540',
      cardText: '#e2e8f0',
    });
    setSaved(false);
    
    // Small delay before hiding animation
    setTimeout(() => {
      setIsRollingDice(false);
    }, 300);
  };

  const handleGenerateNewTheme = () => {
    const newTheme = generateRandomTheme();
    
    if (currentStyle) {
      if (locks.colors) {
        newTheme.primaryColor = currentStyle.primaryColor;
        newTheme.secondaryColor = currentStyle.secondaryColor;
        newTheme.accentColor = currentStyle.accentColor;
        newTheme.backgroundColor = currentStyle.backgroundColor;
        newTheme.textColor = currentStyle.textColor;
        newTheme.gradientStyle = currentStyle.gradientStyle;
      }
      if (locks.typography) {
        newTheme.fontFamily = currentStyle.fontFamily;
      }
      if (locks.radius) {
        newTheme.borderRadius = currentStyle.borderRadius;
      }
      if (locks.shadow) {
        newTheme.shadowStyle = currentStyle.shadowStyle;
      }
    }
    
    setCurrentStyle(newTheme);
    // Update dark mode variant with same colors but dark background
    setDarkModeStyle({
      ...newTheme,
      backgroundColor: '#1a1a2e',
      textColor: '#ffffff',
      cardBackground: '#252540',
      cardText: '#e2e8f0',
    });
    setSaved(false);
  };

  const toggleLock = (lockName) => {
    setLocks((prev) => ({ ...prev, [lockName]: !prev[lockName] }));
  };

  const updateStyle = (key, value) => {
    if (isDarkMode) {
      // Update dark mode style
      if (!darkModeStyle) return;
      const updatedStyle = { ...darkModeStyle, [key]: value };
      if (['primaryColor', 'secondaryColor'].includes(key)) {
        updatedStyle.gradientStyle = `linear-gradient(135deg, ${updatedStyle.primaryColor} 0%, ${updatedStyle.secondaryColor} 100%)`;
      }
      setDarkModeStyle(updatedStyle);
    } else {
      // Update light mode style
      if (!currentStyle) return;
      const updatedStyle = { ...currentStyle, [key]: value };
      if (['primaryColor', 'secondaryColor'].includes(key)) {
        updatedStyle.gradientStyle = `linear-gradient(135deg, ${updatedStyle.primaryColor} 0%, ${updatedStyle.secondaryColor} 100%)`;
      }
      setCurrentStyle(updatedStyle);
    }
    setSaved(false);
  };

  // Get the active style based on mode
  const activeStyle = isDarkMode ? darkModeStyle : currentStyle;

  const handleDownload = async () => {
    if (!currentStyle) return;
    try {
      setDownloading(true);
      await downloadWPTheme(currentStyle);
      setTimeout(() => setDownloading(false), 1000);
    } catch (error) {
      console.error('Failed to download theme:', error);
      setDownloading(false);
    }
  };

  const saveToFavorites = () => {
    if (!currentStyle || !darkModeStyle) return;
    // Generate unique ID with timestamp + random suffix
    const uniqueId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const customStyle = {
      ...currentStyle,
      id: uniqueId,
      name: `Custom Style ${new Date().toLocaleDateString()}`,
      category: 'custom',
      // Include dark mode settings
      darkMode: {
        backgroundColor: darkModeStyle.backgroundColor,
        textColor: darkModeStyle.textColor,
        cardBackground: darkModeStyle.cardBackground || '#252540',
        cardText: darkModeStyle.cardText || '#e2e8f0',
      }
    };
    const customStyles = JSON.parse(localStorage.getItem('vibesync_custom_styles') || '[]');
    customStyles.push(customStyle);
    localStorage.setItem('vibesync_custom_styles', JSON.stringify(customStyles));
    const favorites = JSON.parse(localStorage.getItem('vibesync_favorites') || '[]');
    if (!favorites.includes(customStyle.id)) {
      favorites.push(customStyle.id);
      localStorage.setItem('vibesync_favorites', JSON.stringify(favorites));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Lock button component - compact pill style
  const LockPill = ({ lockKey, icon: Icon, label }) => (
    <button
      onClick={() => toggleLock(lockKey)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        locks[lockKey]
          ? 'bg-violet-600 text-white shadow-md'
          : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-sm'
      }`}
    >
      <Icon size={12} />
      <span>{label}</span>
      {locks[lockKey] ? <Lock size={10} /> : <Unlock size={10} className="opacity-40" />}
    </button>
  );

  return (
    <>
      <Navbar />
      
      {/* Dice Roll Animation Overlay */}
      <DiceRollAnimation isRolling={isRollingDice} onComplete={onDiceRollComplete} />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-violet-50 to-fuchsia-50">
        <div className="container mx-auto px-4 py-6">
          
          {/* Loading State - Show placeholder until client hydration completes */}
          {!isMounted || !currentStyle ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4"
                >
                  <Dices size={64} className="text-violet-600" />
                </motion.div>
                <p className="text-slate-500 font-medium">Preparing your style studio...</p>
              </div>
            </div>
          ) : (
          <>
          {/* Preview Section - TOP */}
            <motion.div
              key={currentStyle.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              {/* Hero Preview Card */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  background: activeStyle?.gradientStyle || `linear-gradient(135deg, ${activeStyle?.primaryColor}, ${activeStyle?.secondaryColor})`,
                  fontFamily: activeStyle?.fontFamily,
                }}
              >
                {/* Top Controls Row - Generate & Roll Dice centered at very top */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                  {/* Regular Generate */}
                  <button
                    onClick={handleGenerateNewTheme}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm text-violet-700 font-bold rounded-full hover:bg-white hover:shadow-lg transition-all border border-white/50"
                  >
                    <Wand2 size={18} />
                    Generate
                  </button>
                  
                  {/* DICE ROLL BUTTON - The Star! */}
                  <motion.button
                    onClick={handleDiceRoll}
                    whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex items-center gap-2 px-6 py-2.5 font-bold rounded-full overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 50%, #06B6D4 100%)',
                      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                    }}
                  >
                    {/* Animated background shimmer */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                    
                    {/* Dice icon with wiggle */}
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Dices size={20} className="text-white" />
                    </motion.div>
                    
                    <span className="relative text-white font-bold">Roll Dice!</span>
                    
                    {/* Sparkle effects */}
                    <motion.span
                      className="absolute top-1 right-2 text-yellow-300 text-xs"
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                  </motion.button>
                </div>

                {/* Lock Pills - Second row below buttons */}
                <div className="absolute top-20 left-4 flex flex-wrap gap-2 z-10">
                  <LockPill lockKey="colors" icon={Palette} label="Colors" />
                  <LockPill lockKey="typography" icon={Type} label="Font" />
                  <LockPill lockKey="radius" icon={Square} label="Radius" />
                  <LockPill lockKey="shadow" icon={Sparkles} label="Shadow" />
                  
                  {/* Day/Night Toggle */}
                  <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full p-0.5 shadow-sm">
                    <button
                      onClick={() => setIsDarkMode(false)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        !isDarkMode
                          ? 'bg-amber-400 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Sun size={12} />
                      Day
                    </button>
                    <button
                      onClick={() => setIsDarkMode(true)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isDarkMode
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Moon size={12} />
                      Night
                    </button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="px-8 pt-32 pb-16 md:px-16 md:pt-36 md:pb-20" style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'transparent' }}>
                  <div className="max-w-3xl mx-auto text-center">
                    <h1 
                      className="text-4xl md:text-6xl font-bold mb-4" 
                      style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                    >
                      {activeStyle?.name || 'Your Custom Style'}
                    </h1>
                    <p 
                      className="text-lg md:text-xl mb-8 max-w-xl mx-auto" 
                      style={{ color: 'rgba(255,255,255,0.9)' }}
                    >
                      A unique design crafted with curated color palettes and font pairings
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                      <button
                        className="px-8 py-3 font-semibold text-lg transition-transform hover:scale-105"
                        style={{
                          backgroundColor: activeStyle?.accentColor,
                          color: getContrastColor(activeStyle?.accentColor),
                          borderRadius: activeStyle?.borderRadius,
                          boxShadow: activeStyle?.shadowStyle,
                        }}
                      >
                        Primary Action
                      </button>
                      <button
                        className="px-8 py-3 font-semibold text-lg transition-transform hover:scale-105"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: '#ffffff',
                          borderRadius: activeStyle?.borderRadius,
                          border: '2px solid rgba(255,255,255,0.4)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        Secondary
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Preview Strip */}
                <div 
                  className="px-6 py-6"
                  style={{ backgroundColor: isDarkMode ? darkModeStyle?.backgroundColor : currentStyle?.backgroundColor }}
                >
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {/* Mini Cards */}
                    {[
                      { title: 'Card Title', desc: 'Preview card component' },
                      { title: 'Feature', desc: 'Highlight key features' },
                      { title: 'Pricing', desc: 'Show your plans' },
                    ].map((card, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-48 p-4 transition-transform hover:scale-105"
                        style={{
                          backgroundColor: isDarkMode ? (darkModeStyle?.cardBackground || '#252540') : 'white',
                          borderRadius: activeStyle?.borderRadius,
                          boxShadow: activeStyle?.shadowStyle,
                        }}
                      >
                        <h4 
                          className="font-bold mb-1"
                          style={{ color: activeStyle?.primaryColor, fontFamily: activeStyle?.fontFamily }}
                        >
                          {card.title}
                        </h4>
                        <p 
                          className="text-sm"
                          style={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : activeStyle?.textColor, fontFamily: activeStyle?.fontFamily }}
                        >
                          {card.desc}
                        </p>
                      </div>
                    ))}
                    
                    {/* Color Swatches */}
                    <div className="flex-shrink-0 flex items-center gap-2 px-4">
                      {[
                        activeStyle?.primaryColor,
                        activeStyle?.secondaryColor,
                        activeStyle?.accentColor,
                      ].map((color, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          {/* Controls Section - Compact Horizontal Layout */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <span className="text-sm font-semibold text-slate-400 mr-2">Customize:</span>
              {[
                { id: 'colors', label: 'Colors', icon: Palette },
                { id: 'typography', label: 'Font', icon: Type },
                { id: 'layout', label: 'Layout', icon: Square },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePanel(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activePanel === tab.id
                      ? 'bg-violet-100 text-violet-700'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
              
              {/* Spacer */}
              <div className="flex-1" />
              
              {/* Action Buttons */}
              <button
                onClick={saveToFavorites}
                disabled={!currentStyle}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                {saved ? <Check size={16} /> : <Heart size={16} />}
                {saved ? 'Saved!' : 'Save'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!currentStyle || downloading}
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-all disabled:opacity-50"
              >
                <Download size={16} />
                {downloading ? '...' : 'Export'}
              </button>
            </div>

            {/* Panel Content */}
            {activeStyle && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {activePanel === 'colors' && (
                  <>
                    {[
                      { key: 'primaryColor', label: 'Primary' },
                      { key: 'secondaryColor', label: 'Secondary' },
                      { key: 'accentColor', label: 'Accent' },
                      { key: 'backgroundColor', label: 'Background' },
                    ].map((color) => (
                      <div key={color.key} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                        <input
                          type="color"
                          value={activeStyle[color.key]?.startsWith('#') ? activeStyle[color.key] : '#000000'}
                          onChange={(e) => updateStyle(color.key, e.target.value)}
                          className="w-10 h-10 rounded-lg border-2 border-white shadow-sm cursor-pointer"
                        />
                        <div className="flex-1">
                          <label className="text-xs font-medium text-slate-500">
                            {color.label} {isDarkMode && <span className="text-indigo-500">(Dark)</span>}
                          </label>
                          <input
                            type="text"
                            value={activeStyle[color.key] || ''}
                            onChange={(e) => updateStyle(color.key, e.target.value)}
                            className="w-full text-sm font-mono text-slate-700 bg-transparent outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {activePanel === 'typography' && (
                  <div className="col-span-full">
                    <div className="relative">
                      <button
                        onClick={() => setShowFontDropdown(!showFontDropdown)}
                        className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-violet-400 transition-colors"
                        style={{ fontFamily: activeStyle.fontFamily }}
                      >
                        <span className="text-lg">{activeStyle.fontFamily?.split(',')[0]}</span>
                        <ChevronDown size={16} className={`transition-transform ${showFontDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showFontDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto">
                          {Object.entries(FONT_OPTIONS).map(([category, fonts]) => (
                            <div key={category}>
                              <div className="px-4 py-2 text-xs font-bold text-slate-400 bg-slate-50 sticky top-0 uppercase tracking-wide">
                                {category}
                              </div>
                              {fonts.map((font) => (
                                <button
                                  key={font}
                                  onClick={() => {
                                    updateStyle('fontFamily', font);
                                    setShowFontDropdown(false);
                                  }}
                                  className={`w-full px-4 py-2 text-left hover:bg-violet-50 transition-colors flex items-center justify-between ${
                                    activeStyle.fontFamily === font ? 'bg-violet-100 text-violet-700' : ''
                                  }`}
                                  style={{ fontFamily: font }}
                                >
                                  {font.split(',')[0]}
                                  {activeStyle.fontFamily === font && <Check size={16} />}
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activePanel === 'layout' && (
                  <>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-slate-500 mb-2 block">Border Radius</label>
                      <div className="flex flex-wrap gap-2">
                        {RADIUS_OPTIONS.map((radius) => (
                          <button
                            key={radius}
                            onClick={() => updateStyle('borderRadius', radius)}
                            className={`px-3 py-2 text-sm font-medium transition-all ${
                              activeStyle?.borderRadius === radius
                                ? 'bg-violet-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            style={{ borderRadius: radius }}
                          >
                            {radius}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-slate-500 mb-2 block">Shadow</label>
                      <div className="flex flex-wrap gap-2">
                        {SHADOW_OPTIONS.map((shadow) => (
                          <button
                            key={shadow.label}
                            onClick={() => updateStyle('shadowStyle', shadow.value)}
                            className={`px-3 py-2 text-sm font-medium transition-all ${
                              activeStyle?.shadowStyle === shadow.value
                                ? 'bg-violet-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            style={{ borderRadius: '8px', boxShadow: shadow.value !== 'none' ? shadow.value : 'none' }}
                          >
                            {shadow.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Style Properties - Compact Footer */}
            {activeStyle && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isDarkMode ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                    {isDarkMode ? '🌙 Dark' : '☀️ Light'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Font:</span>
                  <span className="font-medium" style={{ fontFamily: activeStyle.fontFamily }}>
                    {activeStyle.fontFamily?.split(',')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Radius:</span>
                  <span className="font-medium">{activeStyle.borderRadius}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">Palette:</span>
                  {[activeStyle.primaryColor, activeStyle.secondaryColor, activeStyle.accentColor].map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            )}
          </div>
          </>
          )}
        </div>
      </div>
    </>
  );
}
