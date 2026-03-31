'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Sun, Moon, Copy, Sparkles, Download, 
  Palette, Type, Wand2, Code, Check, ChevronDown,
  Square, List, Upload, FileJson, FileCode
} from 'lucide-react';
import { MOCK_STYLES } from '@/lib/mockStyles';
import { downloadWPTheme } from '@/lib/wpThemeGenerator';
import Navbar from '../../components/Navbar';

// Font options
const FONT_OPTIONS = [
  'Inter', 'Poppins', 'Montserrat', 'Outfit', 'Sora', 'Space Grotesk',
  'Roboto', 'Open Sans', 'Lato', 'Nunito', 'Karla', 'Rubik',
  'Playfair Display', 'Cormorant Garamond', 'Libre Baskerville', 'Merriweather',
  'Bebas Neue', 'Oswald', 'Anton', 'Fira Code', 'JetBrains Mono'
];

// Animation options
const ANIMATION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'fade', label: 'Fade In' },
  { value: 'slide', label: 'Slide Up' },
  { value: 'zoom', label: 'Zoom In' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'flip', label: 'Flip' },
];

// List style options
const LIST_STYLE_OPTIONS = [
  { value: 'bullet', label: 'Bullet (•)' },
  { value: 'check', label: 'Checkmark (✓)' },
  { value: 'arrow', label: 'Arrow (→)' },
  { value: 'dash', label: 'Dash (—)' },
  { value: 'number', label: 'Numbered (1.)' },
];

// Gradient presets
const GRADIENT_PRESETS = [
  { colors: ['#ec4899', '#8b5cf6'], name: 'Pink Purple' },
  { colors: ['#3b82f6', '#1e40af'], name: 'Blue' },
  { colors: ['#10b981', '#059669'], name: 'Green' },
  { colors: ['#f97316', '#ea580c'], name: 'Orange' },
  { colors: ['#1e293b', '#0f172a'], name: 'Dark' },
  { colors: ['#06b6d4', '#0891b2'], name: 'Cyan' },
  { colors: ['#eab308', '#ca8a04'], name: 'Yellow' },
  { colors: ['#a855f7', '#7c3aed'], name: 'Purple' },
];

export default function StyleEditorPage() {
  const params = useParams();
  const router = useRouter();
  const [style, setStyle] = useState(null);
  const [activeTab, setActiveTab] = useState('colors');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef(null);

  // Extended style properties
  const [styleConfig, setStyleConfig] = useState({
    // Theme colors
    primaryColor: '#8B5CF6',
    secondaryColor: '#6366F1',
    accentColor: '#EC4899',
    backgroundColor: '#F8FAFC',
    // Card colors
    cardBackground: '#FFFFFF',
    cardText: '#1E293B',
    cardBorder: '#E2E8F0',
    // Typography
    h1Font: 'Inter',
    h1Color: '#1E293B',
    h2Font: 'Inter',
    h2Color: '#334155',
    h3Font: 'Inter',
    h3Color: '#475569',
    bodyFont: 'Inter',
    bodyColor: '#64748B',
    // List style
    listStyle: 'bullet',
    listColor: '#8B5CF6',
    // Gradient
    useGradient: true,
    gradientColors: ['#8B5CF6', '#6366F1'],
    // Gradient Text settings
    applyGradientText: false,
    gradientTextH1: true,
    gradientTextH2: false,
    gradientTextH3: false,
    gradientTextColor1: '#8B5CF6',
    gradientTextColor2: '#EC4899',
    // Effects
    animationStyle: 'fade',
    borderRadius: 12,
  });

  useEffect(() => {
    // Load style from mock data or localStorage
    const allStyles = [
      ...MOCK_STYLES,
      ...JSON.parse(localStorage.getItem('vibesync_custom_styles') || '[]')
    ];
    const foundStyle = allStyles.find(s => s.id === params.id);
    
    if (foundStyle) {
      setStyle(foundStyle);
      // Initialize config from style
      setStyleConfig(prev => ({
        ...prev,
        primaryColor: foundStyle.primaryColor || prev.primaryColor,
        secondaryColor: foundStyle.secondaryColor || prev.secondaryColor,
        accentColor: foundStyle.accentColor || prev.accentColor,
        backgroundColor: foundStyle.backgroundColor || prev.backgroundColor,
        h1Font: foundStyle.fontFamily?.split(',')[0] || prev.h1Font,
        h2Font: foundStyle.fontFamily?.split(',')[0] || prev.h2Font,
        h3Font: foundStyle.fontFamily?.split(',')[0] || prev.h3Font,
        bodyFont: foundStyle.fontFamily?.split(',')[0] || prev.bodyFont,
        borderRadius: parseInt(foundStyle.borderRadius) || prev.borderRadius,
        gradientColors: [foundStyle.primaryColor || '#8B5CF6', foundStyle.secondaryColor || '#6366F1'],
      }));
    }
  }, [params.id]);

  const updateConfig = (key, value) => {
    setStyleConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleCopyAI = () => {
    const aiPrompt = `Create a design with the following specifications:
    
Color Palette:
- Primary: ${styleConfig.primaryColor}
- Secondary: ${styleConfig.secondaryColor}
- Accent: ${styleConfig.accentColor}
- Background: ${styleConfig.backgroundColor}

Typography:
- Headings: ${styleConfig.h1Font}
- Body: ${styleConfig.bodyFont}

Style:
- Border Radius: ${styleConfig.borderRadius}px
- Animation: ${styleConfig.animationStyle}
- Use Gradient: ${styleConfig.useGradient ? 'Yes' : 'No'}

This style is called "${style?.name || 'Custom Style'}" and belongs to the ${style?.category || 'custom'} category.`;

    navigator.clipboard.writeText(aiPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!style) return;
    
    const updatedStyle = {
      ...style,
      primaryColor: styleConfig.primaryColor,
      secondaryColor: styleConfig.secondaryColor,
      accentColor: styleConfig.accentColor,
      backgroundColor: styleConfig.backgroundColor,
      fontFamily: `${styleConfig.h1Font}, sans-serif`,
      borderRadius: `${styleConfig.borderRadius}px`,
      gradientStyle: styleConfig.useGradient 
        ? `linear-gradient(135deg, ${styleConfig.gradientColors[0]} 0%, ${styleConfig.gradientColors[1]} 100%)`
        : styleConfig.primaryColor,
    };

    // Save to localStorage
    const customStyles = JSON.parse(localStorage.getItem('vibesync_custom_styles') || '[]');
    const existingIndex = customStyles.findIndex(s => s.id === style.id);
    
    if (existingIndex >= 0) {
      customStyles[existingIndex] = updatedStyle;
    } else {
      customStyles.push({ ...updatedStyle, id: `custom-${Date.now()}` });
    }
    
    localStorage.setItem('vibesync_custom_styles', JSON.stringify(customStyles));
    
    // Add to favorites
    const favorites = JSON.parse(localStorage.getItem('vibesync_favorites') || '[]');
    if (!favorites.includes(updatedStyle.id)) {
      favorites.push(updatedStyle.id);
      localStorage.setItem('vibesync_favorites', JSON.stringify(favorites));
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportWP = async () => {
    if (!style) return;
    setDownloading(true);
    try {
      const exportStyle = {
        ...style,
        primaryColor: styleConfig.primaryColor,
        secondaryColor: styleConfig.secondaryColor,
        accentColor: styleConfig.accentColor,
        backgroundColor: styleConfig.backgroundColor,
        fontFamily: `${styleConfig.h1Font}, sans-serif`,
        borderRadius: `${styleConfig.borderRadius}px`,
      };
      await downloadWPTheme(exportStyle);
    } catch (error) {
      console.error('Export failed:', error);
    }
    setDownloading(false);
  };

  const handleExportJSON = () => {
    const exportData = {
      name: style?.name || 'Custom Style',
      category: style?.category || 'custom',
      config: styleConfig,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${style?.name || 'style'}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result);
        if (data.config) {
          setStyleConfig(prev => ({ ...prev, ...data.config }));
        }
      } catch (error) {
        console.error('Import failed:', error);
      }
    };
    reader.readAsText(file);
  };

  const getGradientStyle = () => {
    if (styleConfig.useGradient) {
      return `linear-gradient(135deg, ${styleConfig.gradientColors[0]} 0%, ${styleConfig.gradientColors[1]} 100%)`;
    }
    return styleConfig.primaryColor;
  };

  const getListMarker = (index) => {
    switch (styleConfig.listStyle) {
      case 'check': return '✓';
      case 'arrow': return '→';
      case 'dash': return '—';
      case 'number': return `${index + 1}.`;
      default: return '•';
    }
  };

  if (!style) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500">Loading style...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{style.name}</h1>
              <p className="text-sm text-slate-500">{style.category} Style</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Light/Dark Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors border border-amber-200"
            >
              {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
              {isDarkMode ? 'Dark' : 'Light'}
            </button>
            
            {/* Copy AI */}
            <button
              onClick={handleCopyAI}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy AI'}
            </button>
            
            {/* Save */}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors"
            >
              {saved ? <Check size={16} /> : <Sparkles size={16} />}
              {saved ? 'Saved!' : 'Save'}
            </button>
            
            {/* Export WP */}
            <button
              onClick={handleExportWP}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              <Download size={16} />
              {downloading ? 'Exporting...' : 'Export WP'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-72 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)] flex flex-col sticky top-[73px] z-40">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {[
              { id: 'colors', icon: Palette, label: 'Colors' },
              { id: 'typography', icon: Type, label: 'Typography' },
              { id: 'effects', icon: Wand2, label: 'Effects' },
              { id: 'export', icon: Code, label: 'Exp' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-6">
                {/* Theme Colors */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <Palette size={16} className="text-violet-500" />
                    Theme Colors
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'primaryColor', label: 'Primary' },
                      { key: 'secondaryColor', label: 'Secondary' },
                      { key: 'accentColor', label: 'Accent' },
                      { key: 'backgroundColor', label: 'Background' },
                    ].map((color) => (
                      <div key={color.key}>
                        <label className="text-xs text-slate-500 mb-1 block">{color.label}</label>
                        <div className="relative">
                          <input
                            type="color"
                            value={styleConfig[color.key]}
                            onChange={(e) => updateConfig(color.key, e.target.value)}
                            className="w-full h-12 rounded-lg border border-slate-200 cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Colors */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <Square size={16} className="text-violet-500" />
                    Card Colors
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'cardBackground', label: 'Background' },
                      { key: 'cardText', label: 'Text' },
                      { key: 'cardBorder', label: 'Border' },
                    ].map((color) => (
                      <div key={color.key}>
                        <label className="text-xs text-slate-500 mb-1 block">{color.label}</label>
                        <input
                          type="color"
                          value={styleConfig[color.key]}
                          onChange={(e) => updateConfig(color.key, e.target.value)}
                          className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Background Gradient */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <Palette size={16} className="text-violet-500" />
                    Background Gradient
                  </h3>
                  <label className="flex items-center gap-2 mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={styleConfig.useGradient}
                      onChange={(e) => updateConfig('useGradient', e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-sm text-slate-600">Use Gradient Background</span>
                  </label>
                  
                  {styleConfig.useGradient && (
                    <div className="grid grid-cols-4 gap-2">
                      {GRADIENT_PRESETS.map((preset, i) => (
                        <button
                          key={i}
                          onClick={() => updateConfig('gradientColors', preset.colors)}
                          className={`h-12 rounded-lg border-2 transition-all ${
                            styleConfig.gradientColors[0] === preset.colors[0] && 
                            styleConfig.gradientColors[1] === preset.colors[1]
                              ? 'border-violet-600 scale-105'
                              : 'border-transparent hover:border-slate-300'
                          }`}
                          style={{
                            background: `linear-gradient(135deg, ${preset.colors[0]} 0%, ${preset.colors[1]} 100%)`
                          }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Typography Tab */}
            {activeTab === 'typography' && (
              <div className="space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                    <Type size={16} className="text-violet-500" />
                    Typography
                  </h3>
                  
                  {[
                    { key: 'h1', label: 'H1', fontKey: 'h1Font', colorKey: 'h1Color' },
                    { key: 'h2', label: 'H2', fontKey: 'h2Font', colorKey: 'h2Color' },
                    { key: 'h3', label: 'H3', fontKey: 'h3Font', colorKey: 'h3Color' },
                    { key: 'body', label: 'Body', fontKey: 'bodyFont', colorKey: 'bodyColor' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-2 mb-4">
                      <span className="w-10 text-sm font-bold text-slate-700">{item.label}</span>
                      <select
                        value={styleConfig[item.fontKey]}
                        onChange={(e) => updateConfig(item.fontKey, e.target.value)}
                        className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        style={{ fontFamily: styleConfig[item.fontKey] }}
                      >
                        {FONT_OPTIONS.map((font) => (
                          <option key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                          </option>
                        ))}
                      </select>
                      <div 
                        className="relative w-12 h-12 rounded-lg border-2 border-slate-200 overflow-hidden cursor-pointer hover:border-violet-400 transition-colors"
                        style={{ backgroundColor: styleConfig[item.colorKey] }}
                      >
                        <input
                          type="color"
                          value={styleConfig[item.colorKey]}
                          onChange={(e) => updateConfig(item.colorKey, e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* List Style */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <List size={16} className="text-violet-500" />
                    List Style
                  </h3>
                  <div className="flex items-center gap-3">
                    <select
                      value={styleConfig.listStyle}
                      onChange={(e) => updateConfig('listStyle', e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500"
                    >
                      {LIST_STYLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="text-center">
                      <span className="text-xs text-slate-400 block mb-1">Icon</span>
                      <div 
                        className="relative w-12 h-12 rounded-lg border-2 border-slate-200 overflow-hidden cursor-pointer hover:border-violet-400 transition-colors"
                        style={{ backgroundColor: styleConfig.listColor }}
                      >
                        <input
                          type="color"
                          value={styleConfig.listColor}
                          onChange={(e) => updateConfig('listColor', e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gradient Text */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <Sparkles size={16} className="text-violet-500" />
                    Gradient Text
                  </h3>
                  
                  {/* Main toggle */}
                  <label className="flex items-center gap-2 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={styleConfig.applyGradientText}
                      onChange={(e) => updateConfig('applyGradientText', e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-sm text-slate-600">Apply Gradient to Headings</span>
                  </label>
                  
                  {/* Gradient settings - only show when enabled */}
                  {styleConfig.applyGradientText && (
                    <div className="pl-6 space-y-3 border-l-2 border-violet-200">
                      {/* Which headings */}
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-slate-500">Apply to:</span>
                        {[
                          { key: 'gradientTextH1', label: 'H1 Heading' },
                          { key: 'gradientTextH2', label: 'H2 Heading' },
                          { key: 'gradientTextH3', label: 'H3 Heading' },
                        ].map((item) => (
                          <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={styleConfig[item.key]}
                              onChange={(e) => updateConfig(item.key, e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                            />
                            <span className="text-sm text-slate-600">{item.label}</span>
                          </label>
                        ))}
                      </div>
                      
                      {/* Gradient colors */}
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-slate-500">Gradient Colors:</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="relative w-10 h-10 rounded-lg border-2 border-slate-200 overflow-hidden cursor-pointer hover:border-violet-400 transition-colors"
                            style={{ backgroundColor: styleConfig.gradientTextColor1 }}
                          >
                            <input
                              type="color"
                              value={styleConfig.gradientTextColor1}
                              onChange={(e) => updateConfig('gradientTextColor1', e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          <span className="text-slate-400">→</span>
                          <div 
                            className="relative w-10 h-10 rounded-lg border-2 border-slate-200 overflow-hidden cursor-pointer hover:border-violet-400 transition-colors"
                            style={{ backgroundColor: styleConfig.gradientTextColor2 }}
                          >
                            <input
                              type="color"
                              value={styleConfig.gradientTextColor2}
                              onChange={(e) => updateConfig('gradientTextColor2', e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          {/* Preview */}
                          <div 
                            className="flex-1 h-10 rounded-lg"
                            style={{ 
                              background: `linear-gradient(90deg, ${styleConfig.gradientTextColor1}, ${styleConfig.gradientTextColor2})`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Effects Tab */}
            {activeTab === 'effects' && (
              <div className="space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                    <Wand2 size={16} className="text-violet-500" />
                    Effects & Animation
                  </h3>
                  
                  {/* Animation Style */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <span className="text-violet-500">▷</span>
                      Animation Style
                    </label>
                    <select
                      value={styleConfig.animationStyle}
                      onChange={(e) => updateConfig('animationStyle', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500"
                    >
                      {ANIMATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Border Radius */}
                  <div>
                    <label className="text-sm text-slate-600 mb-2 block">Border Radius</label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={styleConfig.borderRadius}
                      onChange={(e) => updateConfig('borderRadius', parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                    <p className="text-sm text-slate-500 mt-2">{styleConfig.borderRadius}px</p>
                  </div>
                </div>
              </div>
            )}

            {/* Export Tab */}
            {activeTab === 'export' && (
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                  <Code size={16} className="text-violet-500" />
                  Export Options
                </h3>
                
                {/* Export as JSON */}
                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-violet-600 font-medium hover:border-violet-300 hover:bg-violet-50 transition-all"
                >
                  <FileJson size={18} />
                  Export as JSON
                </button>
                
                {/* Import JSON */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-emerald-600 font-medium hover:bg-emerald-100 hover:border-emerald-300 transition-all"
                >
                  <Upload size={18} />
                  Import JSON
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
                
                {/* Spacer/Divider */}
                <div className="h-2" />
                
                {/* WordPress Theme */}
                <button
                  onClick={handleExportWP}
                  disabled={downloading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 text-white font-semibold rounded-xl transition-all disabled:opacity-50 hover:shadow-lg hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
                  }}
                >
                  <Download size={18} />
                  WordPress Theme (.zip)
                </button>
                
                {/* Copy AI Instructions */}
                <button
                  onClick={handleCopyAI}
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  }}
                >
                  {copied ? <Check size={18} /> : <Sparkles size={18} />}
                  {copied ? 'Copied!' : 'Copy AI Instructions'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            Live Preview
            <div className="ml-auto flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
            </div>
          </div>

          {/* Preview Area */}
          <div 
            className="rounded-2xl overflow-hidden shadow-xl"
            style={{ backgroundColor: isDarkMode ? '#1a1a2e' : styleConfig.backgroundColor }}
          >
            {/* Hero Section */}
            <div 
              className="px-8 py-16 text-center"
              style={{ background: getGradientStyle() }}
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold mb-4"
                style={{ 
                  fontFamily: styleConfig.h1Font,
                  ...(styleConfig.applyGradientText && styleConfig.gradientTextH1 ? {
                    background: `linear-gradient(135deg, ${styleConfig.gradientTextColor1} 0%, ${styleConfig.gradientTextColor2} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  } : {
                    color: '#ffffff',
                  })
                }}
              >
                {style.name}
              </motion.h1>
              <p 
                className="text-xl mb-6"
                style={{ 
                  fontFamily: styleConfig.h2Font,
                  ...(styleConfig.applyGradientText && styleConfig.gradientTextH2 ? {
                    background: `linear-gradient(135deg, ${styleConfig.gradientTextColor1} 0%, ${styleConfig.gradientTextColor2} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  } : {
                    color: 'rgba(255,255,255,0.9)',
                  })
                }}
              >
                A beautiful design style for your next project
              </p>
              <p 
                className="max-w-2xl mx-auto"
                style={{ 
                  fontFamily: styleConfig.bodyFont,
                  color: 'rgba(255,255,255,0.8)'
                }}
              >
                This preview demonstrates how your theme will look with various UI elements
                including headings, paragraphs, lists, and cards.
              </p>
            </div>

            {/* Content Section */}
            <div 
              className="px-8 py-12"
              style={{ background: getGradientStyle() }}
            >
              <h2 
                className="text-2xl font-semibold mb-6"
                style={{ 
                  fontFamily: styleConfig.h2Font,
                  ...(styleConfig.applyGradientText && styleConfig.gradientTextH2 ? {
                    background: `linear-gradient(135deg, ${styleConfig.gradientTextColor1} 0%, ${styleConfig.gradientTextColor2} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  } : {
                    color: styleConfig.accentColor,
                  })
                }}
              >
                Key Features
              </h2>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Responsive design for all devices',
                  'Customizable color palette',
                  'Multiple animation options',
                  'Export to various formats',
                ].map((item, i) => (
                  <li 
                    key={i}
                    className="flex items-center gap-3"
                    style={{ 
                      fontFamily: styleConfig.bodyFont,
                      color: 'rgba(255,255,255,0.85)'
                    }}
                  >
                    <span style={{ color: styleConfig.listColor }}>
                      {getListMarker(i)}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Cards */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[1, 2, 3].map((num) => (
                  <motion.div
                    key={num}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: num * 0.1 }}
                    className="p-6"
                    style={{
                      backgroundColor: isDarkMode ? '#252540' : styleConfig.cardBackground,
                      borderRadius: `${styleConfig.borderRadius}px`,
                      border: `1px solid ${isDarkMode ? '#3a3a5e' : styleConfig.cardBorder}`,
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg mb-4"
                      style={{ background: getGradientStyle() }}
                    />
                    <h3 
                      className="font-semibold mb-2"
                      style={{ 
                        fontFamily: styleConfig.h3Font,
                        color: isDarkMode ? '#ffffff' : styleConfig.cardText
                      }}
                    >
                      Feature {num}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ 
                        fontFamily: styleConfig.bodyFont,
                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : styleConfig.bodyColor
                      }}
                    >
                      A brief description of this amazing feature.
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
