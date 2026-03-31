'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Save, Settings, Palette, Type, Square, Sparkles, Lock, Unlock, ChevronDown, Check, Sun, Moon, Download, Heart } from 'lucide-react';
import { downloadWPTheme } from '@/lib/wpThemeGenerator';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

// Font options organized by category
const FONT_OPTIONS = {
  'Modern Sans': [
    'Inter, sans-serif', 'Poppins, sans-serif', 'Montserrat, sans-serif', 
    'Outfit, sans-serif', 'Sora, sans-serif', 'Space Grotesk, sans-serif',
  ],
  'Classic Sans': [
    'Roboto, sans-serif', 'Open Sans, sans-serif', 'Lato, sans-serif',
    'Nunito, sans-serif', 'Karla, sans-serif', 'Rubik, sans-serif',
  ],
  'Elegant Serif': [
    'Playfair Display, serif', 'Cormorant Garamond, serif', 'Libre Baskerville, serif',
    'DM Serif Display, serif', 'Fraunces, serif', 'Bodoni Moda, serif',
  ],
  'Display & Bold': [
    'Bebas Neue, sans-serif', 'Oswald, sans-serif', 'Anton, sans-serif',
    'Archivo Black, sans-serif', 'Righteous, sans-serif',
  ],
};

const RADIUS_OPTIONS = ['0px', '4px', '8px', '12px', '16px', '24px', 'full'];
const SHADOW_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Soft', value: '0 2px 8px rgba(0,0,0,0.08)' },
  { label: 'Medium', value: '0 4px 12px rgba(0,0,0,0.15)' },
  { label: 'Strong', value: '0 8px 24px rgba(0,0,0,0.2)' },
];

// B&W Wireframe base style
const WIREFRAME_STYLE = {
  id: 'new-skin',
  name: 'Your New Skin',
  category: 'minimal',
  primaryColor: '#1a1a1a',
  secondaryColor: '#333333',
  accentColor: '#666666',
  backgroundColor: '#ffffff',
  textColor: '#1a1a1a',
  fontFamily: 'Inter, sans-serif',
  borderRadius: '8px',
  shadowStyle: '0 2px 8px rgba(0,0,0,0.08)',
  gradientStyle: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
};

export default function CreatePage() {
  const router = useRouter();
  const [currentStyle, setCurrentStyle] = useState(null);
  const [darkModeStyle, setDarkModeStyle] = useState(null);
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
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Initialize with the B&W wireframe style
    setCurrentStyle({ ...WIREFRAME_STYLE });
    setDarkModeStyle({
      ...WIREFRAME_STYLE,
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff',
      primaryColor: '#ffffff',
      secondaryColor: '#e5e5e5',
      accentColor: '#999999',
      gradientStyle: 'linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)',
    });
  }, []);

  const handleCustomize = () => {
    if (!currentStyle) return;
    const tempStyle = {
      ...currentStyle,
      id: `custom-${Date.now()}`,
      name: currentStyle.name || 'Your New Skin',
      category: 'custom',
      darkMode: darkModeStyle ? {
        backgroundColor: darkModeStyle.backgroundColor,
        textColor: darkModeStyle.textColor,
      } : null,
    };
    const customStyles = JSON.parse(localStorage.getItem('vibesync_custom_styles') || '[]');
    customStyles.push(tempStyle);
    localStorage.setItem('vibesync_custom_styles', JSON.stringify(customStyles));
    router.push(`/style/${tempStyle.id}`);
  };

  const toggleLock = (lockName) => {
    setLocks((prev) => ({ ...prev, [lockName]: !prev[lockName] }));
  };

  const updateStyle = (key, value) => {
    if (isDarkMode && darkModeStyle) {
      const updatedStyle = { ...darkModeStyle, [key]: value };
      if (['primaryColor', 'secondaryColor'].includes(key)) {
        updatedStyle.gradientStyle = `linear-gradient(135deg, ${updatedStyle.primaryColor} 0%, ${updatedStyle.secondaryColor} 100%)`;
      }
      setDarkModeStyle(updatedStyle);
    } else if (currentStyle) {
      const updatedStyle = { ...currentStyle, [key]: value };
      if (['primaryColor', 'secondaryColor'].includes(key)) {
        updatedStyle.gradientStyle = `linear-gradient(135deg, ${updatedStyle.primaryColor} 0%, ${updatedStyle.secondaryColor} 100%)`;
      }
      setCurrentStyle(updatedStyle);
    }
    setSaved(false);
  };

  const activeStyle = isDarkMode ? darkModeStyle : currentStyle;

  const saveToFavorites = () => {
    if (!currentStyle) return;
    const uniqueId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const customStyle = {
      ...currentStyle,
      id: uniqueId,
      name: currentStyle.name || 'Your New Skin',
      category: 'custom',
      darkMode: darkModeStyle ? {
        backgroundColor: darkModeStyle.backgroundColor,
        textColor: darkModeStyle.textColor,
      } : null,
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

  const handleExport = async () => {
    if (!currentStyle) return;
    setDownloading(true);
    try {
      await downloadWPTheme(currentStyle);
    } catch (error) {
      console.error('Export failed:', error);
    }
    setDownloading(false);
  };

  // Lock Pill Component
  const LockPill = ({ lockKey, icon: Icon, label }) => (
    <button
      onClick={() => toggleLock(lockKey)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        locks[lockKey]
          ? 'bg-slate-800 text-white'
          : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white'
      }`}
    >
      {locks[lockKey] ? <Lock size={12} /> : <Unlock size={12} />}
      <Icon size={12} />
      {label}
    </button>
  );

  const getContrastColor = (hexColor) => {
    if (!hexColor || hexColor.startsWith('rgba')) return '#ffffff';
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
  };

  if (!isMounted || !currentStyle) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Preparing your canvas...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Your Style</h1>
          <p className="text-slate-600">Start from a clean slate and build your perfect design</p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Preview Section */}
          <motion.div
            key={currentStyle?.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            {/* Hero Preview Card */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-200"
              style={{
                background: activeStyle?.gradientStyle || `linear-gradient(135deg, ${activeStyle?.primaryColor}, ${activeStyle?.secondaryColor})`,
                fontFamily: activeStyle?.fontFamily,
              }}
            >
              {/* Top Controls Row */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {/* Customize Button */}
                <button
                  onClick={handleCustomize}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm text-slate-800 font-bold rounded-full hover:bg-white hover:shadow-lg transition-all border border-slate-300"
                >
                  <Settings size={18} />
                  Customize
                </button>
                
                {/* Save Button */}
                <button
                  onClick={saveToFavorites}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white font-bold rounded-full hover:bg-slate-900 hover:shadow-lg transition-all"
                >
                  {saved ? <Check size={18} /> : <Heart size={18} />}
                  {saved ? 'Saved!' : 'Save'}
                </button>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  disabled={downloading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 text-white font-bold rounded-full hover:bg-slate-700 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Download size={18} />
                  {downloading ? 'Exporting...' : 'Export'}
                </button>
              </div>

              {/* Lock Pills Row */}
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
                      !isDarkMode ? 'bg-amber-400 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Sun size={12} />
                    Day
                  </button>
                  <button
                    onClick={() => setIsDarkMode(true)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isDarkMode ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
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
                  {/* Editable Name */}
                  <input
                    type="text"
                    value={currentStyle.name}
                    onChange={(e) => updateStyle('name', e.target.value)}
                    className="text-4xl md:text-6xl font-bold mb-4 bg-transparent text-center w-full outline-none focus:ring-2 focus:ring-white/30 rounded-lg px-4"
                    style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                    placeholder="Your New Skin"
                  />
                  <p 
                    className="text-lg md:text-xl mb-8 max-w-xl mx-auto" 
                    style={{ color: 'rgba(255,255,255,0.9)' }}
                  >
                    A clean wireframe style ready for your customization
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
                  {[
                    { title: 'Card Title', desc: 'Preview card component' },
                    { title: 'Feature', desc: 'Highlight key features' },
                    { title: 'Pricing', desc: 'Show your plans' },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-48 p-4 transition-transform hover:scale-105"
                      style={{
                        backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8',
                        borderRadius: activeStyle?.borderRadius,
                        boxShadow: activeStyle?.shadowStyle,
                        border: '1px solid',
                        borderColor: isDarkMode ? '#3a3a3a' : '#e5e5e5',
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
                        style={{ color: isDarkMode ? '#999999' : '#666666', fontFamily: activeStyle?.fontFamily }}
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
                        className="w-10 h-10 rounded-full border-2 shadow-md"
                        style={{ backgroundColor: color, borderColor: isDarkMode ? '#3a3a3a' : '#ffffff' }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Controls Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            {/* Panel Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 pb-4">
              {[
                { id: 'colors', icon: Palette, label: 'Colors' },
                { id: 'typography', icon: Type, label: 'Typography' },
                { id: 'layout', icon: Square, label: 'Layout' },
              ].map((panel) => (
                <button
                  key={panel.id}
                  onClick={() => setActivePanel(panel.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activePanel === panel.id
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <panel.icon size={16} />
                  {panel.label}
                </button>
              ))}
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
                            {color.label} {isDarkMode && <span className="text-slate-400">(Dark)</span>}
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
                        className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-400 transition-colors"
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
                                  className={`w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center justify-between ${
                                    activeStyle.fontFamily === font ? 'bg-slate-100 text-slate-900' : ''
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
                              activeStyle.borderRadius === radius
                                ? 'bg-slate-800 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            style={{ borderRadius: radius === 'full' ? '9999px' : radius }}
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
                              activeStyle.shadowStyle === shadow.value
                                ? 'bg-slate-800 text-white'
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

            {/* Footer Info */}
            {activeStyle && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-amber-100 text-amber-700'}`}>
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
        </div>
      </div>
    </>
  );
}
