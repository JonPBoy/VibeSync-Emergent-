'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Lock, Unlock, Download, Save, Palette, Type, Square, Sparkles, ChevronDown, Check, Heart } from 'lucide-react';
import { MOCK_STYLES } from '@/lib/mockStyles';
import { downloadWPTheme } from '@/lib/wpThemeGenerator';
import Navbar from '../components/Navbar';

// Font options
const FONT_OPTIONS = [
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Poppins, sans-serif',
  'Montserrat, sans-serif',
  'Playfair Display, serif',
  'Merriweather, serif',
  'Lora, serif',
  'Bebas Neue, sans-serif',
  'Oswald, sans-serif',
  'Fira Code, monospace',
  'JetBrains Mono, monospace',
  'Pacifico, cursive',
  'Dancing Script, cursive',
];

// Border radius options
const RADIUS_OPTIONS = ['0px', '4px', '8px', '12px', '16px', '20px', '24px', '50px', '100px'];

// Shadow options
const SHADOW_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Subtle', value: '0 2px 4px rgba(0,0,0,0.1)' },
  { label: 'Medium', value: '0 4px 12px rgba(0,0,0,0.15)' },
  { label: 'Strong', value: '0 8px 24px rgba(0,0,0,0.2)' },
  { label: 'Floating', value: '0 12px 40px rgba(0,0,0,0.25)' },
  { label: 'Neon Glow', value: '0 0 20px rgba(139,92,246,0.5)' },
  { label: 'Neumorphic', value: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff' },
];

// Animation options
const ANIMATION_OPTIONS = ['fadeIn', 'slideUp', 'slideIn', 'pulse', 'bounce', 'glow', 'shimmer', 'wiggle'];

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
  const [locks, setLocks] = useState({
    colors: false,
    typography: false,
    radius: false,
    shadow: false,
    animation: false,
  });
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [showFontDropdown, setShowFontDropdown] = useState(false);

  useEffect(() => {
    setStyles(MOCK_STYLES);
    generateRandomStyle(MOCK_STYLES);
  }, []);

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
    setSaved(false);
  };

  const toggleLock = (lockName) => {
    setLocks((prev) => ({ ...prev, [lockName]: !prev[lockName] }));
  };

  const updateStyle = (key, value) => {
    if (!currentStyle) return;
    
    const updatedStyle = { ...currentStyle, [key]: value };
    
    // Update gradient when colors change
    if (['primaryColor', 'secondaryColor'].includes(key)) {
      updatedStyle.gradientStyle = `linear-gradient(135deg, ${updatedStyle.primaryColor} 0%, ${updatedStyle.secondaryColor} 100%)`;
    }
    
    setCurrentStyle(updatedStyle);
    setSaved(false);
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

  const saveToFavorites = () => {
    if (!currentStyle) return;

    // Create a unique ID for the custom style
    const customStyle = {
      ...currentStyle,
      id: `custom-${Date.now()}`,
      name: `Custom Style ${new Date().toLocaleDateString()}`,
      category: 'custom',
    };

    // Get existing custom styles
    const customStyles = JSON.parse(localStorage.getItem('vibesync_custom_styles') || '[]');
    customStyles.push(customStyle);
    localStorage.setItem('vibesync_custom_styles', JSON.stringify(customStyles));

    // Add to favorites
    const favorites = JSON.parse(localStorage.getItem('vibesync_favorites') || '[]');
    if (!favorites.includes(customStyle.id)) {
      favorites.push(customStyle.id);
      localStorage.setItem('vibesync_favorites', JSON.stringify(favorites));
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Color Picker Component
  const ColorInput = ({ label, colorKey, value }) => (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-slate-600 w-24">{label}</label>
      <div className="flex-1 flex items-center gap-2">
        <input
          type="color"
          value={value?.startsWith('#') ? value : '#000000'}
          onChange={(e) => updateStyle(colorKey, e.target.value)}
          className="w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => updateStyle(colorKey, e.target.value)}
          className="flex-1 px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-3 flex items-center justify-center gap-3">
            <Shuffle className="text-violet-600" size={40} />
            Style Randomizer
          </h1>
          <p className="text-lg text-slate-600">
            Mix, match, and customize every aspect of your design
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-2 space-y-4">
            {/* Lock Properties */}
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Lock size={18} />
                Lock Properties
              </h2>
              <div className="space-y-2">
                {[
                  { key: 'colors', label: 'Colors', icon: Palette },
                  { key: 'typography', label: 'Font', icon: Type },
                  { key: 'radius', label: 'Radius', icon: Square },
                  { key: 'shadow', label: 'Shadow', icon: Sparkles },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => toggleLock(item.key)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-sm ${
                      locks[item.key]
                        ? 'bg-violet-50 border-violet-500 text-violet-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <item.icon size={16} />
                      {item.label}
                    </span>
                    {locks[item.key] ? <Lock size={16} /> : <Unlock size={16} className="text-slate-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={() => generateRandomStyle()}
              disabled={styles.length === 0}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Shuffle size={20} />
              Generate Random Style
            </button>

            {/* Customization Panel */}
            {currentStyle && (
              <div className="bg-white rounded-2xl p-5 shadow-lg space-y-5">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Palette size={18} />
                  Customize Style
                </h2>

                {/* Colors */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Colors</h3>
                  <ColorInput label="Primary" colorKey="primaryColor" value={currentStyle.primaryColor} />
                  <ColorInput label="Secondary" colorKey="secondaryColor" value={currentStyle.secondaryColor} />
                  <ColorInput label="Accent" colorKey="accentColor" value={currentStyle.accentColor} />
                  <ColorInput label="Background" colorKey="backgroundColor" value={currentStyle.backgroundColor} />
                  <ColorInput label="Text" colorKey="textColor" value={currentStyle.textColor} />
                </div>

                {/* Font Family */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Font Family</h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowFontDropdown(!showFontDropdown)}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-violet-500 transition-colors"
                      style={{ fontFamily: currentStyle.fontFamily }}
                    >
                      <span className="truncate">{currentStyle.fontFamily?.split(',')[0]}</span>
                      <ChevronDown size={16} className={`transition-transform ${showFontDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showFontDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                        {FONT_OPTIONS.map((font) => (
                          <button
                            key={font}
                            onClick={() => {
                              updateStyle('fontFamily', font);
                              setShowFontDropdown(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-violet-50 transition-colors flex items-center justify-between ${
                              currentStyle.fontFamily === font ? 'bg-violet-100 text-violet-700' : ''
                            }`}
                            style={{ fontFamily: font }}
                          >
                            {font.split(',')[0]}
                            {currentStyle.fontFamily === font && <Check size={16} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Border Radius */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Border Radius</h3>
                  <div className="flex flex-wrap gap-2">
                    {RADIUS_OPTIONS.map((radius) => (
                      <button
                        key={radius}
                        onClick={() => updateStyle('borderRadius', radius)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          currentStyle.borderRadius === radius
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {radius}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shadow Style */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Shadow</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {SHADOW_OPTIONS.map((shadow) => (
                      <button
                        key={shadow.label}
                        onClick={() => updateStyle('shadowStyle', shadow.value)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          currentStyle.shadowStyle === shadow.value
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {shadow.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={saveToFavorites}
                disabled={!currentStyle}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-xl transition-all ${
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                } disabled:opacity-50`}
              >
                {saved ? <Check size={18} /> : <Heart size={18} />}
                {saved ? 'Saved!' : 'Save to Favorites'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!currentStyle || downloading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold text-violet-700 bg-violet-100 rounded-xl hover:bg-violet-200 transition-all disabled:opacity-50"
              >
                <Download size={18} />
                {downloading ? 'Generating...' : 'Export WP'}
              </button>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Live Preview</h2>
              {currentStyle ? (
                <motion.div
                  key={currentStyle.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Hero Preview */}
                  <div
                    className="rounded-2xl p-8 min-h-[350px]"
                    style={{
                      background: currentStyle.gradientStyle || `linear-gradient(135deg, ${currentStyle.primaryColor}, ${currentStyle.secondaryColor})`,
                      fontFamily: currentStyle.fontFamily,
                    }}
                  >
                    <div className="max-w-lg mx-auto text-center">
                      <h3 
                        className="text-4xl font-bold mb-4" 
                        style={{ color: '#ffffff' }}
                      >
                        Your Custom Style
                      </h3>
                      <p 
                        className="text-lg mb-6" 
                        style={{ color: 'rgba(255,255,255,0.9)' }}
                      >
                        A unique design crafted just for you. Customize every detail to match your vision.
                      </p>
                      <div className="flex gap-4 justify-center flex-wrap">
                        <button
                          className="px-6 py-3 font-semibold transition-transform hover:scale-105"
                          style={{
                            backgroundColor: currentStyle.accentColor,
                            color: getContrastColor(currentStyle.accentColor),
                            borderRadius: currentStyle.borderRadius,
                            boxShadow: currentStyle.shadowStyle,
                          }}
                        >
                          Primary Action
                        </button>
                        <button
                          className="px-6 py-3 font-semibold transition-transform hover:scale-105"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: '#ffffff',
                            borderRadius: currentStyle.borderRadius,
                            border: '2px solid rgba(255,255,255,0.3)',
                          }}
                        >
                          Secondary
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Preview */}
                  <div
                    className="p-6"
                    style={{
                      backgroundColor: currentStyle.backgroundColor,
                      borderRadius: currentStyle.borderRadius,
                      fontFamily: currentStyle.fontFamily,
                    }}
                  >
                    <h4 
                      className="text-2xl font-bold mb-3"
                      style={{ color: currentStyle.primaryColor }}
                    >
                      Card Component
                    </h4>
                    <p 
                      className="mb-4"
                      style={{ color: currentStyle.textColor }}
                    >
                      This is how your content will look with the selected typography and colors. Notice how the font family and colors work together.
                    </p>
                    <div className="flex gap-3">
                      <span
                        className="px-3 py-1 text-sm font-medium"
                        style={{
                          backgroundColor: currentStyle.primaryColor,
                          color: getContrastColor(currentStyle.primaryColor),
                          borderRadius: currentStyle.borderRadius,
                        }}
                      >
                        Tag One
                      </span>
                      <span
                        className="px-3 py-1 text-sm font-medium"
                        style={{
                          backgroundColor: currentStyle.secondaryColor,
                          color: getContrastColor(currentStyle.secondaryColor),
                          borderRadius: currentStyle.borderRadius,
                        }}
                      >
                        Tag Two
                      </span>
                      <span
                        className="px-3 py-1 text-sm font-medium"
                        style={{
                          backgroundColor: currentStyle.accentColor,
                          color: getContrastColor(currentStyle.accentColor),
                          borderRadius: currentStyle.borderRadius,
                        }}
                      >
                        Tag Three
                      </span>
                    </div>
                  </div>

                  {/* Style Properties */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs font-medium text-slate-500 block mb-1">Font Family</span>
                      <span className="text-sm font-semibold text-slate-900 truncate block" style={{ fontFamily: currentStyle.fontFamily }}>
                        {currentStyle.fontFamily?.split(',')[0]}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs font-medium text-slate-500 block mb-1">Border Radius</span>
                      <span className="text-sm font-semibold text-slate-900">{currentStyle.borderRadius}</span>
                    </div>
                    <div className="col-span-2 p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs font-medium text-slate-500 block mb-2">Color Palette</span>
                      <div className="flex gap-2">
                        {[
                          { color: currentStyle.primaryColor, label: 'Primary' },
                          { color: currentStyle.secondaryColor, label: 'Secondary' },
                          { color: currentStyle.accentColor, label: 'Accent' },
                          { color: currentStyle.backgroundColor, label: 'Background' },
                          { color: currentStyle.textColor, label: 'Text' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex-1 text-center">
                            <div
                              className="h-10 rounded-lg border-2 border-white shadow-sm mb-1"
                              style={{ backgroundColor: item.color }}
                              title={item.color}
                            />
                            <span className="text-xs text-slate-500">{item.label}</span>
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
      </div>
    </>
  );
}
