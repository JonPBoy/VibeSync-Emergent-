'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Type, Palette, Code, ChevronDown, Share2, Copy, Check, Sun, Moon, Sparkles, FolderPlus, Wand2, Zap } from 'lucide-react';
import { downloadWPTheme } from '@/lib/wpThemeGenerator';
import { generatePalette } from '@/lib/colorUtils';
import { generateTailwindConfig, generateSCSS, generateReactComponent, generateVueComponent, generateFigmaCSS, generateJSON, generateShareURL } from '@/lib/exportUtils';
import { addToHistory, getCollections, addToCollection, createCollection } from '@/lib/styleHistory';
import { generateAIInstructions } from '@/lib/mockStyles';

// Available fonts organized by category
const FONT_OPTIONS = {
  'Sans Serif': [
    'Inter, sans-serif',
    'Roboto, sans-serif',
    'Open Sans, sans-serif',
    'Lato, sans-serif',
    'Poppins, sans-serif',
    'Montserrat, sans-serif',
    'Nunito, sans-serif',
    'Work Sans, sans-serif',
    'DM Sans, sans-serif',
    'Plus Jakarta Sans, sans-serif',
  ],
  'Serif': [
    'Playfair Display, serif',
    'Merriweather, serif',
    'Lora, serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Libre Baskerville, serif',
    'Cormorant Garamond, serif',
    'Crimson Text, serif',
    'EB Garamond, serif',
    'Spectral, serif',
  ],
  'Display': [
    'Bebas Neue, sans-serif',
    'Oswald, sans-serif',
    'Anton, sans-serif',
    'Archivo Black, sans-serif',
    'Alfa Slab One, serif',
    'Righteous, cursive',
    'Bungee, cursive',
    'Russo One, sans-serif',
    'Teko, sans-serif',
    'Fjalla One, sans-serif',
  ],
  'Monospace': [
    'Fira Code, monospace',
    'JetBrains Mono, monospace',
    'Source Code Pro, monospace',
    'Courier New, monospace',
    'Monaco, monospace',
    'Consolas, monospace',
  ],
  'Handwriting': [
    'Pacifico, cursive',
    'Dancing Script, cursive',
    'Satisfy, cursive',
    'Caveat, cursive',
    'Indie Flower, cursive',
    'Patrick Hand, cursive',
  ],
};

// Typography content for each category
const TYPOGRAPHY_CONTENT = {
  minimal: {
    headline: "Less is More",
    tagline: "Embrace simplicity in design",
    description: "Clean lines and purposeful whitespace create breathing room for your content to shine. Every element serves a purpose.",
    features: ["Clean & focused layouts", "Purposeful whitespace", "Timeless aesthetics", "Enhanced readability"],
    quote: "Simplicity is the ultimate sophistication.",
  },
  bold: {
    headline: "Make a Statement",
    tagline: "Confidence in every pixel",
    description: "Bold design demands attention. Strong contrasts and powerful typography create unforgettable experiences that leave lasting impressions.",
    features: ["High-impact visuals", "Strong color contrast", "Attention-grabbing layouts", "Memorable branding"],
    quote: "Fortune favors the bold.",
  },
  gradient: {
    headline: "Smooth Transitions",
    tagline: "Where colors flow seamlessly",
    description: "Gradients add depth and dimension to your designs. Watch colors dance and blend to create stunning visual narratives that captivate users.",
    features: ["Dynamic color flows", "Modern aesthetics", "Depth & dimension", "Visual storytelling"],
    quote: "Life is a spectrum of colors.",
  },
  glassmorphism: {
    headline: "Beyond the Surface",
    tagline: "Transparency meets elegance",
    description: "Frosted glass effects create layers of depth and sophistication. See through the design while maintaining focus on what matters most.",
    features: ["Frosted glass effects", "Layered depth", "Modern transparency", "Elegant overlays"],
    quote: "Clarity through transparency.",
  },
  neumorphism: {
    headline: "Soft & Tactile",
    tagline: "Design you can almost touch",
    description: "Neumorphic design brings interfaces to life with subtle shadows and highlights. Elements appear to press in or pop out naturally.",
    features: ["Tactile interfaces", "Soft shadows", "3D depth effects", "Organic feel"],
    quote: "Touch the future of design.",
  },
  retro: {
    headline: "Vintage Vibes",
    tagline: "Nostalgia meets modern web",
    description: "Take a trip down memory lane with retro aesthetics. Classic design patterns reimagined for today's digital landscape.",
    features: ["Nostalgic aesthetics", "Classic typography", "Timeless appeal", "Distinctive character"],
    quote: "Everything old is new again.",
  },
  neon: {
    headline: "Electric Dreams",
    tagline: "Light up the digital night",
    description: "Neon glows illuminate dark interfaces with vibrant energy. Create cyberpunk vibes that pulse with electric intensity.",
    features: ["Glowing effects", "Cyberpunk aesthetics", "High energy vibes", "Night mode perfection"],
    quote: "Shine bright in the darkness.",
  },
  luxury: {
    headline: "Refined Excellence",
    tagline: "Where prestige meets perfection",
    description: "Luxury design speaks to those who appreciate the finer things. Gold accents, rich colors, and elegant typography convey premium quality.",
    features: ["Premium aesthetics", "Elegant typography", "Rich color palettes", "Exclusive feel"],
    quote: "Excellence is not an act, but a habit.",
  },
  playful: {
    headline: "Joy in Every Click",
    tagline: "Design that makes you smile",
    description: "Playful designs bring energy and delight to user experiences. Bright colors and friendly shapes create welcoming, fun interfaces.",
    features: ["Cheerful colors", "Friendly interfaces", "Engaging animations", "Delightful details"],
    quote: "We don't stop playing because we grow old.",
  },
  corporate: {
    headline: "Professional Trust",
    tagline: "Business-ready aesthetics",
    description: "Corporate design builds credibility and trust. Clean professional layouts communicate reliability and competence to your audience.",
    features: ["Professional layouts", "Trust-building design", "Clean hierarchy", "Brand consistency"],
    quote: "Professionalism is not a label you give yourself.",
  },
};

// Calculate relative luminance of a color
const getLuminance = (hexColor) => {
  // Handle rgba colors
  if (hexColor.startsWith('rgba')) {
    const match = hexColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const [, r, g, b] = match.map(Number);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }
  }
  
  // Handle hex colors
  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

// Get contrasting text color that ensures readability
const getContrastingColor = (bgColor, lightColor = '#ffffff', darkColor = '#1a1a1a') => {
  const luminance = getLuminance(bgColor);
  // Use dark text on light backgrounds, light text on dark backgrounds
  return luminance > 0.5 ? darkColor : lightColor;
};

// Ensure text color has sufficient contrast with background
const ensureContrast = (textColor, bgColor, minContrast = 0.4) => {
  const textLum = getLuminance(textColor);
  const bgLum = getLuminance(bgColor);
  const contrast = Math.abs(textLum - bgLum);
  
  if (contrast < minContrast) {
    // Not enough contrast, return a better alternative
    return bgLum > 0.5 ? '#1a1a1a' : '#ffffff';
  }
  return textColor;
};

// Get label color that contrasts with the color being labeled
const getLabelTextColor = (bgColor) => {
  return getContrastingColor(bgColor);
};

// List style options
const LIST_STYLES = [
  { id: 'disc', name: 'Bullet (●)', icon: '●' },
  { id: 'circle', name: 'Circle (○)', icon: '○' },
  { id: 'square', name: 'Square (■)', icon: '■' },
  { id: 'decimal', name: 'Numbers (1.)', icon: '1.' },
  { id: 'decimal-leading-zero', name: 'Numbers (01.)', icon: '01.' },
  { id: 'lower-alpha', name: 'Lowercase (a.)', icon: 'a.' },
  { id: 'upper-alpha', name: 'Uppercase (A.)', icon: 'A.' },
  { id: 'lower-roman', name: 'Roman (i.)', icon: 'i.' },
  { id: 'upper-roman', name: 'Roman (I.)', icon: 'I.' },
  { id: 'none', name: 'None', icon: '—' },
  { id: 'check', name: 'Checkmarks (✓)', icon: '✓' },
  { id: 'arrow', name: 'Arrows (→)', icon: '→' },
  { id: 'star', name: 'Stars (★)', icon: '★' },
  { id: 'diamond', name: 'Diamonds (◆)', icon: '◆' },
];

export default function StylePreview({ style, onClose }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [downloading, setDownloading] = useState(false);
  const [selectedFont, setSelectedFont] = useState(style.fontFamily);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  
  // Individual typography settings
  const [h1Font, setH1Font] = useState(style.fontFamily);
  const [h2Font, setH2Font] = useState(style.fontFamily);
  const [h3Font, setH3Font] = useState(style.fontFamily);
  const [paragraphFont, setParagraphFont] = useState(style.fontFamily);
  const [listStyle, setListStyle] = useState('disc');
  const [showH1Dropdown, setShowH1Dropdown] = useState(false);
  const [showH2Dropdown, setShowH2Dropdown] = useState(false);
  const [showH3Dropdown, setShowH3Dropdown] = useState(false);
  const [showParagraphDropdown, setShowParagraphDropdown] = useState(false);
  const [showListStyleDropdown, setShowListStyleDropdown] = useState(false);

  // New features state
  const [darkMode, setDarkMode] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedAI, setCopiedAI] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showCollections, setShowCollections] = useState(false);
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showAIInstructions, setShowAIInstructions] = useState(false);

  // Color palette
  const palette = generatePalette(style.primaryColor);

  // Copy AI instructions handler
  const handleCopyAIInstructions = () => {
    const instructions = generateAIInstructions(style, true);
    navigator.clipboard.writeText(instructions);
    setCopiedAI(true);
    setTimeout(() => setCopiedAI(false), 2000);
  };

  // Update selected fonts when style changes
  useEffect(() => {
    setSelectedFont(style.fontFamily);
    setH1Font(style.fontFamily);
    setH2Font(style.fontFamily);
    setH3Font(style.fontFamily);
    setParagraphFont(style.fontFamily);
    addToHistory(style);
    setCollections(getCollections());
  }, [style]);

  // Generate share URL
  useEffect(() => {
    setShareUrl(generateShareURL(style));
  }, [style]);

  if (!style) return null;

  const content = TYPOGRAPHY_CONTENT[style.category] || TYPOGRAPHY_CONTENT.minimal;
  
  // Compute colors based on dark mode toggle
  const getPreviewColors = () => {
    const isDarkBg = getLuminance(style.backgroundColor) < 0.5;
    
    if (darkMode) {
      // Dark mode - show dark version of theme
      if (!isDarkBg) {
        // Light theme -> convert to dark preview
        return {
          bgColor: '#0a0a0a',
          primaryTextColor: style.primaryColor,
          secondaryTextColor: style.secondaryColor,
          accentTextColor: style.accentColor,
          bodyTextColor: '#e5e5e5',
          cardBg: '#1a1a1a',
        };
      }
      // Already dark theme
      return {
        bgColor: style.backgroundColor,
        primaryTextColor: ensureContrast(style.primaryColor, style.backgroundColor),
        secondaryTextColor: ensureContrast(style.secondaryColor, style.backgroundColor),
        accentTextColor: ensureContrast(style.accentColor, style.backgroundColor),
        bodyTextColor: ensureContrast(style.textColor, style.backgroundColor),
        cardBg: '#1a1a1a',
      };
    } else {
      // Light mode
      if (isDarkBg) {
        // Dark theme -> show lighter version
        return {
          bgColor: '#fafafa',
          primaryTextColor: ensureContrast(style.primaryColor, '#fafafa'),
          secondaryTextColor: ensureContrast(style.secondaryColor, '#fafafa'),
          accentTextColor: ensureContrast(style.accentColor, '#fafafa'),
          bodyTextColor: '#1a1a1a',
          cardBg: '#ffffff',
        };
      }
      // Already light theme
      return {
        bgColor: style.backgroundColor,
        primaryTextColor: ensureContrast(style.primaryColor, style.backgroundColor),
        secondaryTextColor: ensureContrast(style.secondaryColor, style.backgroundColor),
        accentTextColor: ensureContrast(style.accentColor, style.backgroundColor),
        bodyTextColor: ensureContrast(style.textColor, style.backgroundColor),
        cardBg: '#ffffff',
      };
    }
  };

  const previewColors = getPreviewColors();
  const { bgColor, primaryTextColor, secondaryTextColor, accentTextColor, bodyTextColor, cardBg } = previewColors;

  const cssVariables = `/* ${style.name} - Generated by VibeSync */
:root {
  --primary-color: ${style.primaryColor};
  --secondary-color: ${style.secondaryColor};
  --accent-color: ${style.accentColor};
  --background-color: ${style.backgroundColor};
  --text-color: ${style.textColor};
  --font-family: ${selectedFont};
  --font-h1: ${h1Font};
  --font-h2: ${h2Font};
  --font-h3: ${h3Font};
  --font-paragraph: ${paragraphFont};
  --border-radius: ${style.borderRadius};
  --shadow-style: ${style.shadowStyle};
  --gradient-style: ${style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`};
}

/* Typography */
h1 { font-family: var(--font-h1); font-size: 3rem; font-weight: 700; line-height: 1.2; }
h2 { font-family: var(--font-h2); font-size: 2.25rem; font-weight: 600; line-height: 1.3; }
h3 { font-family: var(--font-h3); font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
p { font-family: var(--font-paragraph); font-size: 1rem; line-height: 1.6; }
.lead { font-family: var(--font-paragraph); font-size: 1.25rem; line-height: 1.5; }
ul, ol { list-style-type: ${listStyle.includes('check') || listStyle.includes('arrow') || listStyle.includes('star') || listStyle.includes('diamond') ? 'none' : listStyle}; }

/* Apply to your project */
body {
  font-family: var(--font-family);
  background-color: var(--background-color);
  color: var(--text-color);
}

.button-primary {
  background: var(--gradient-style);
  color: white;
  padding: 12px 24px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-style);
}

.card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-style);
  padding: 24px;
}`;

  const handleExportWPTheme = async () => {
    try {
      setDownloading(true);
      // Pass the modified style with selected font
      const modifiedStyle = { ...style, fontFamily: selectedFont };
      await downloadWPTheme(modifiedStyle);
      setTimeout(() => setDownloading(false), 1000);
    } catch (error) {
      console.error('Failed to export WordPress theme:', error);
      alert('Failed to export theme. Please try again.');
      setDownloading(false);
    }
  };

  const FontSelector = () => (
    <div className="relative">
      <button
        onClick={() => setShowFontDropdown(!showFontDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:border-violet-500 transition-colors text-sm"
        style={{ fontFamily: selectedFont }}
      >
        <Type size={16} className="text-slate-500" />
        <span className="max-w-[200px] truncate">{selectedFont.split(',')[0]}</span>
        <ChevronDown size={16} className={`text-slate-500 transition-transform ${showFontDropdown ? 'rotate-180' : ''}`} />
      </button>
      
      {showFontDropdown && (
        <div className="absolute top-full left-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50">
          {Object.entries(FONT_OPTIONS).map(([category, fonts]) => (
            <div key={category}>
              <div className="px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0">
                {category}
              </div>
              {fonts.map((font) => (
                <button
                  key={font}
                  onClick={() => {
                    setSelectedFont(font);
                    setShowFontDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-violet-50 transition-colors ${
                    selectedFont === font ? 'bg-violet-100 text-violet-700' : 'text-slate-700'
                  }`}
                  style={{ fontFamily: font }}
                >
                  {font.split(',')[0]}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Individual font selector component
  const IndividualFontSelector = ({ label, value, onChange, isOpen, setIsOpen, closeOthers }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        <button
          onClick={() => {
            closeOthers();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-violet-400 transition-colors text-sm min-w-[180px] justify-between"
          style={{ fontFamily: value }}
        >
          <span className="truncate">{value.split(',')[0]}</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50">
            {Object.entries(FONT_OPTIONS).map(([category, fonts]) => (
              <div key={category}>
                <div className="px-3 py-1.5 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0">
                  {category}
                </div>
                {fonts.map((font) => (
                  <button
                    key={font}
                    onClick={() => {
                      onChange(font);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left hover:bg-violet-50 transition-colors text-sm ${
                      value === font ? 'bg-violet-100 text-violet-700' : 'text-slate-700'
                    }`}
                    style={{ fontFamily: font }}
                  >
                    {font.split(',')[0]}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // List style selector component
  const ListStyleSelector = () => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-slate-700">List Style</span>
      <div className="relative">
        <button
          onClick={() => {
            setShowH1Dropdown(false);
            setShowH2Dropdown(false);
            setShowH3Dropdown(false);
            setShowParagraphDropdown(false);
            setShowListStyleDropdown(!showListStyleDropdown);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-violet-400 transition-colors text-sm min-w-[180px] justify-between"
        >
          <span className="flex items-center gap-2">
            <span className="w-5 text-center">{LIST_STYLES.find(s => s.id === listStyle)?.icon}</span>
            <span>{LIST_STYLES.find(s => s.id === listStyle)?.name}</span>
          </span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform flex-shrink-0 ${showListStyleDropdown ? 'rotate-180' : ''}`} />
        </button>
        
        {showListStyleDropdown && (
          <div className="absolute top-full right-0 mt-1 w-56 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50">
            {LIST_STYLES.map((listOption) => (
              <button
                key={listOption.id}
                onClick={() => {
                  setListStyle(listOption.id);
                  setShowListStyleDropdown(false);
                }}
                className={`w-full px-3 py-2 text-left hover:bg-violet-50 transition-colors text-sm flex items-center gap-3 ${
                  listStyle === listOption.id ? 'bg-violet-100 text-violet-700' : 'text-slate-700'
                }`}
              >
                <span className="w-5 text-center font-mono">{listOption.icon}</span>
                <span>{listOption.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Close all dropdowns helper
  const closeAllDropdowns = () => {
    setShowH1Dropdown(false);
    setShowH2Dropdown(false);
    setShowH3Dropdown(false);
    setShowParagraphDropdown(false);
    setShowListStyleDropdown(false);
  };

  // Get list item marker based on style
  const getListMarker = (index) => {
    switch (listStyle) {
      case 'check': return '✓';
      case 'arrow': return '→';
      case 'star': return '★';
      case 'diamond': return '◆';
      case 'decimal': return `${index + 1}.`;
      case 'decimal-leading-zero': return `${String(index + 1).padStart(2, '0')}.`;
      case 'lower-alpha': return `${String.fromCharCode(97 + index)}.`;
      case 'upper-alpha': return `${String.fromCharCode(65 + index)}.`;
      case 'lower-roman': return ['i', 'ii', 'iii', 'iv'][index] + '.';
      case 'upper-roman': return ['I', 'II', 'III', 'IV'][index] + '.';
      case 'circle': return '○';
      case 'square': return '■';
      case 'none': return '';
      default: return '●';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (showFontDropdown) {
            setShowFontDropdown(false);
          } else {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{style.name}</h2>
              <p className="text-sm text-slate-500 mt-1 capitalize">{style.category} style</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'text-violet-600 border-b-2 border-violet-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Palette size={18} />
              Preview UI
            </button>
            <button
              onClick={() => setActiveTab('typography')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'typography'
                  ? 'text-violet-600 border-b-2 border-violet-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Type size={18} />
              Typography
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'css'
                  ? 'text-violet-600 border-b-2 border-violet-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Code size={18} />
              Get CSS
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'preview' ? (
              <div
                className="rounded-2xl p-8 min-h-[400px] transition-colors duration-300"
                style={{
                  background: darkMode 
                    ? `linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)`
                    : (style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`),
                  fontFamily: selectedFont,
                }}
              >
                {/* Mock Landing Page Hero */}
                <div className="max-w-3xl mx-auto text-center">
                  <h1 className="text-5xl font-bold mb-6" style={{ color: darkMode ? style.primaryColor : '#ffffff' }}>
                    Welcome to Your Site
                  </h1>
                  <p className="text-xl mb-8" style={{ color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)' }}>
                    Experience the perfect blend of design and functionality with this beautiful style.
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <button
                      className="px-8 py-4 font-semibold transition-transform hover:scale-105"
                      style={{
                        background: darkMode 
                          ? (style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`)
                          : style.accentColor,
                        color: darkMode ? '#ffffff' : getContrastingColor(style.accentColor),
                        borderRadius: style.borderRadius,
                        boxShadow: style.shadowStyle,
                      }}
                    >
                      Get Started
                    </button>
                    <button
                      className="px-8 py-4 font-semibold transition-transform hover:scale-105"
                      style={{
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                        color: darkMode ? style.primaryColor : '#ffffff',
                        borderRadius: style.borderRadius,
                        border: darkMode ? `2px solid ${style.primaryColor}` : '2px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      Learn More
                    </button>
                  </div>

                  {/* Feature Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-6 transition-transform hover:scale-105"
                        style={{
                          backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: style.borderRadius,
                          border: darkMode ? `1px solid ${style.primaryColor}30` : '1px solid rgba(255,255,255,0.2)',
                        }}
                      >
                        <div
                          className="w-12 h-12 mx-auto mb-4"
                          style={{
                            background: style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`,
                            borderRadius: style.borderRadius,
                          }}
                        />
                        <h3 className="text-lg font-semibold mb-2" style={{ color: darkMode ? style.primaryColor : '#ffffff' }}>
                          Feature {i}
                        </h3>
                        <p className="text-sm" style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.8)' }}>
                          Amazing feature description
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeTab === 'typography' ? (
              <div>
                {/* Typography Controls */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Type size={18} className="text-violet-600" />
                    Typography Settings
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">Customize fonts for each text element individually</p>
                  
                  <div className="bg-white rounded-lg p-4 space-y-1">
                    <IndividualFontSelector
                      label="H1 - Headlines"
                      value={h1Font}
                      onChange={setH1Font}
                      isOpen={showH1Dropdown}
                      setIsOpen={setShowH1Dropdown}
                      closeOthers={() => { setShowH2Dropdown(false); setShowH3Dropdown(false); setShowParagraphDropdown(false); setShowListStyleDropdown(false); }}
                    />
                    <IndividualFontSelector
                      label="H2 - Subheadlines"
                      value={h2Font}
                      onChange={setH2Font}
                      isOpen={showH2Dropdown}
                      setIsOpen={setShowH2Dropdown}
                      closeOthers={() => { setShowH1Dropdown(false); setShowH3Dropdown(false); setShowParagraphDropdown(false); setShowListStyleDropdown(false); }}
                    />
                    <IndividualFontSelector
                      label="H3 - Section Titles"
                      value={h3Font}
                      onChange={setH3Font}
                      isOpen={showH3Dropdown}
                      setIsOpen={setShowH3Dropdown}
                      closeOthers={() => { setShowH1Dropdown(false); setShowH2Dropdown(false); setShowParagraphDropdown(false); setShowListStyleDropdown(false); }}
                    />
                    <IndividualFontSelector
                      label="Paragraph & Body"
                      value={paragraphFont}
                      onChange={setParagraphFont}
                      isOpen={showParagraphDropdown}
                      setIsOpen={setShowParagraphDropdown}
                      closeOthers={() => { setShowH1Dropdown(false); setShowH2Dropdown(false); setShowH3Dropdown(false); setShowListStyleDropdown(false); }}
                    />
                    <ListStyleSelector />
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        const font = h1Font;
                        setH2Font(font);
                        setH3Font(font);
                        setParagraphFont(font);
                      }}
                      className="text-xs px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
                    >
                      Apply H1 font to all
                    </button>
                    <button
                      onClick={() => {
                        setH1Font(style.fontFamily);
                        setH2Font(style.fontFamily);
                        setH3Font(style.fontFamily);
                        setParagraphFont(style.fontFamily);
                        setListStyle('disc');
                      }}
                      className="text-xs px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Reset to default
                    </button>
                  </div>
                </div>

                {/* Typography Preview */}
                <div
                  className="rounded-2xl p-8 min-h-[500px]"
                  style={{
                    backgroundColor: bgColor,
                  }}
                >
                  <div className="max-w-3xl mx-auto">
                    {/* H1 - Main Headline */}
                    <div className="mb-8">
                      <span 
                        className="text-xs font-mono px-2 py-1 rounded mb-2 inline-block"
                        style={{ 
                          backgroundColor: style.primaryColor, 
                          color: getLabelTextColor(style.primaryColor) 
                        }}
                      >
                        H1 - Headline • {h1Font.split(',')[0]}
                      </span>
                      <h1 
                        className="text-5xl font-bold leading-tight"
                        style={{ color: primaryTextColor, fontFamily: h1Font }}
                      >
                        {content.headline}
                      </h1>
                    </div>

                    {/* H2 - Subheadline */}
                    <div className="mb-8">
                      <span 
                        className="text-xs font-mono px-2 py-1 rounded mb-2 inline-block"
                        style={{ 
                          backgroundColor: style.secondaryColor, 
                          color: getLabelTextColor(style.secondaryColor) 
                        }}
                      >
                        H2 - Subheadline • {h2Font.split(',')[0]}
                      </span>
                      <h2 
                        className="text-3xl font-semibold leading-snug"
                        style={{ color: secondaryTextColor, fontFamily: h2Font }}
                      >
                        {content.tagline}
                      </h2>
                    </div>

                    {/* Lead Paragraph */}
                    <div className="mb-8">
                      <span 
                        className="text-xs font-mono px-2 py-1 rounded mb-2 inline-block"
                        style={{ 
                          backgroundColor: style.accentColor, 
                          color: getLabelTextColor(style.accentColor) 
                        }}
                      >
                        Lead Paragraph • {paragraphFont.split(',')[0]}
                      </span>
                      <p 
                        className="text-xl leading-relaxed"
                        style={{ color: bodyTextColor, fontFamily: paragraphFont }}
                      >
                        {content.description}
                      </p>
                    </div>

                    {/* H3 with List Items */}
                    <div className="mb-8">
                      <span 
                        className="text-xs font-mono px-2 py-1 rounded mb-2 inline-block"
                        style={{ 
                          backgroundColor: style.primaryColor, 
                          color: getLabelTextColor(style.primaryColor) 
                        }}
                      >
                        H3 + List • {h3Font.split(',')[0]} • Style: {LIST_STYLES.find(s => s.id === listStyle)?.name}
                      </span>
                      <h3 
                        className="text-2xl font-semibold mb-4"
                        style={{ color: primaryTextColor, fontFamily: h3Font }}
                      >
                        Key Features
                      </h3>
                      <ul className="space-y-3">
                        {content.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3" style={{ fontFamily: paragraphFont }}>
                            {listStyle !== 'none' && (
                              <span 
                                className="flex-shrink-0 mt-0.5 min-w-[20px] text-center"
                                style={{ color: style.accentColor }}
                              >
                                {getListMarker(index)}
                              </span>
                            )}
                            <span style={{ color: bodyTextColor }}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Numbered List Example */}
                    <div className="mb-8">
                      <span 
                        className="text-xs font-mono px-2 py-1 rounded mb-2 inline-block"
                        style={{ 
                          backgroundColor: style.secondaryColor, 
                          color: getLabelTextColor(style.secondaryColor) 
                        }}
                      >
                        Ordered List Preview
                      </span>
                      <ol className="space-y-2 mt-2">
                        {['First step in the process', 'Second important item', 'Third and final point'].map((item, index) => (
                          <li key={index} className="flex items-start gap-3" style={{ fontFamily: paragraphFont }}>
                            {listStyle !== 'none' && (
                              <span 
                                className="flex-shrink-0 mt-0.5 min-w-[20px] text-center font-medium"
                                style={{ color: style.accentColor }}
                              >
                                {getListMarker(index)}
                              </span>
                            )}
                            <span style={{ color: bodyTextColor }}>{item}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Regular Paragraph */}
                    <div className="mb-8">
                      <span 
                        className="text-xs font-mono px-2 py-1 rounded mb-2 inline-block"
                        style={{ 
                          backgroundColor: style.secondaryColor, 
                          color: getLabelTextColor(style.secondaryColor) 
                        }}
                      >
                        Body Text • {paragraphFont.split(',')[0]}
                      </span>
                      <p 
                        className="text-base leading-relaxed"
                        style={{ color: bodyTextColor, fontFamily: paragraphFont }}
                      >
                        Typography is the art and technique of arranging type to make written language 
                        legible, readable, and appealing when displayed. The arrangement of type involves 
                        selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing, 
                        as well as adjusting the space between pairs of letters.
                      </p>
                    </div>

                    {/* Blockquote */}
                    <div className="mb-8">
                      <span 
                        className="text-xs font-mono px-2 py-1 rounded mb-2 inline-block"
                        style={{ 
                          backgroundColor: style.accentColor, 
                          color: getLabelTextColor(style.accentColor) 
                        }}
                      >
                        Blockquote
                      </span>
                      <blockquote 
                        className="text-xl italic pl-6 py-4"
                        style={{ 
                          borderLeft: `4px solid ${style.accentColor}`,
                          color: primaryTextColor,
                          fontFamily: h2Font,
                        }}
                      >
                        "{content.quote}"
                      </blockquote>
                    </div>

                    {/* Small Text & Caption */}
                    <div className="mb-8">
                      <span 
                        className="text-xs font-mono px-2 py-1 rounded mb-2 inline-block"
                        style={{ 
                          backgroundColor: style.primaryColor, 
                          color: getLabelTextColor(style.primaryColor) 
                        }}
                      >
                        Caption & Small Text
                      </span>
                      <p 
                        className="text-sm opacity-70"
                        style={{ color: bodyTextColor, fontFamily: paragraphFont }}
                      >
                        This is caption text, perfect for image descriptions, footnotes, and metadata. 
                        Current fonts - H1: {h1Font.split(',')[0]}, H2: {h2Font.split(',')[0]}, H3: {h3Font.split(',')[0]}, Body: {paragraphFont.split(',')[0]}
                      </p>
                    </div>

                    {/* Button Examples */}
                    <div>
                      <span 
                        className="text-xs font-mono px-2 py-1 rounded mb-2 inline-block"
                        style={{ 
                          backgroundColor: style.secondaryColor, 
                          color: getLabelTextColor(style.secondaryColor) 
                        }}
                      >
                        Button Typography
                      </span>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <button
                          className="px-6 py-3 font-semibold transition-transform hover:scale-105"
                          style={{
                            background: style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`,
                            color: '#ffffff',
                            borderRadius: style.borderRadius,
                            boxShadow: style.shadowStyle,
                            fontFamily: paragraphFont,
                          }}
                        >
                          Primary Button
                        </button>
                        <button
                          className="px-6 py-3 font-semibold transition-transform hover:scale-105"
                          style={{
                            backgroundColor: 'transparent',
                            color: primaryTextColor,
                            borderRadius: style.borderRadius,
                            border: `2px solid ${style.primaryColor}`,
                            fontFamily: paragraphFont,
                          }}
                        >
                          Secondary Button
                        </button>
                        <button
                          className="px-6 py-3 font-medium transition-transform hover:scale-105 underline"
                          style={{
                            backgroundColor: 'transparent',
                            color: accentTextColor,
                            fontFamily: paragraphFont,
                          }}
                        >
                          Text Link →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-violet-50 rounded-xl">
                    <h4 className="text-sm font-semibold text-violet-700 mb-2">🎨 Auto Contrast</h4>
                    <p className="text-xs text-violet-600">
                      Text colors automatically adjust for readability against the background.
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <h4 className="text-sm font-semibold text-emerald-700 mb-2">📋 Export Ready</h4>
                    <p className="text-xs text-emerald-600">
                      Your custom typography settings will be included in CSS and WordPress exports.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Export Format Tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {['CSS', 'Tailwind', 'SCSS', 'React', 'Vue', 'Figma', 'JSON'].map(format => (
                    <button
                      key={format}
                      onClick={() => setShowExportMenu(format)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition ${showExportMenu === format ? 'bg-violet-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                    >
                      {format}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-600">
                    {showExportMenu || 'CSS'} code for your project:
                  </p>
                  <button
                    onClick={() => {
                      const code = showExportMenu === 'Tailwind' ? generateTailwindConfig(style) :
                        showExportMenu === 'SCSS' ? generateSCSS(style) :
                        showExportMenu === 'React' ? generateReactComponent(style) :
                        showExportMenu === 'Vue' ? generateVueComponent(style) :
                        showExportMenu === 'Figma' ? generateFigmaCSS(style) :
                        showExportMenu === 'JSON' ? generateJSON(style) : cssVariables;
                      navigator.clipboard.writeText(code);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy All'}
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto text-sm font-mono max-h-80">
                  {showExportMenu === 'Tailwind' ? generateTailwindConfig(style) :
                    showExportMenu === 'SCSS' ? generateSCSS(style) :
                    showExportMenu === 'React' ? generateReactComponent(style) :
                    showExportMenu === 'Vue' ? generateVueComponent(style) :
                    showExportMenu === 'Figma' ? generateFigmaCSS(style) :
                    showExportMenu === 'JSON' ? generateJSON(style) : cssVariables}
                </pre>

                {/* Color Palette Generator */}
                <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl">
                  <button onClick={() => setShowPalette(!showPalette)} className="flex items-center gap-2 text-violet-700 font-semibold mb-3">
                    <Sparkles size={18} />
                    AI Color Palette
                    <ChevronDown size={16} className={`transition-transform ${showPalette ? 'rotate-180' : ''}`} />
                  </button>
                  {showPalette && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {Object.entries(palette).map(([name, color]) => (
                        <div key={name} className="text-center">
                          <div className="w-full h-12 rounded-lg border mb-1 cursor-pointer hover:scale-105 transition" style={{ backgroundColor: color }} onClick={() => navigator.clipboard.writeText(color)} title={`Click to copy ${color}`} />
                          <p className="text-xs text-slate-600 capitalize">{name.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-xs text-slate-400">{color}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* PROMINENT: Copy AI Instructions Button */}
            <button
              onClick={handleCopyAIInstructions}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all group"
            >
              <Wand2 size={22} className="group-hover:rotate-12 transition-transform" />
              {copiedAI ? 'Copied to Clipboard! ✓' : 'Copy AI Instructions'}
              <span className="text-xs opacity-80 font-normal">for Bolt, Lovable, Cursor</span>
            </button>

            {/* Show AI Instructions Preview */}
            <button 
              onClick={() => setShowAIInstructions(!showAIInstructions)}
              className="w-full text-center text-sm text-slate-500 hover:text-violet-600 transition"
            >
              {showAIInstructions ? 'Hide' : 'Preview'} AI Instructions
            </button>

            {showAIInstructions && (
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono max-h-48 overflow-y-auto whitespace-pre-wrap">
                {generateAIInstructions(style, true)}
              </div>
            )}

            {/* Quick Actions Row */}
            <div className="flex gap-2">
              <button onClick={() => setDarkMode(!darkMode)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition text-sm">
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                {darkMode ? 'Light' : 'Dark'} Preview
              </button>
              <button onClick={() => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition text-sm">
                <Share2 size={16} />
                {copied ? 'Link Copied!' : 'Share Style'}
              </button>
              <button onClick={() => setShowCollections(!showCollections)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition text-sm">
                <FolderPlus size={16} />
                Add to Collection
              </button>
            </div>

            {/* Collections Dropdown */}
            {showCollections && (
              <div className="p-3 bg-white rounded-lg border">
                <p className="text-sm font-medium mb-2">Add to Collection</p>
                <div className="space-y-1 max-h-32 overflow-y-auto mb-2">
                  {collections.length === 0 ? (
                    <p className="text-xs text-slate-400">No collections yet</p>
                  ) : (
                    collections.map(col => (
                      <button key={col.id} onClick={() => { addToCollection(col.id, style); setShowCollections(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-violet-50 rounded-lg">
                        {col.name} ({col.styles.length})
                      </button>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newCollectionName} onChange={e => setNewCollectionName(e.target.value)} placeholder="New collection..." className="flex-1 px-2 py-1 text-sm border rounded" />
                  <button onClick={() => { if (newCollectionName.trim()) { const col = createCollection(newCollectionName); addToCollection(col.id, style); setNewCollectionName(''); setCollections(getCollections()); } }} className="px-3 py-1 text-sm bg-violet-600 text-white rounded">Add</button>
                </div>
              </div>
            )}

            {/* Export Button */}
            <button
              onClick={handleExportWPTheme}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} />
              {downloading ? 'Generating...' : 'Export as WordPress Theme'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
