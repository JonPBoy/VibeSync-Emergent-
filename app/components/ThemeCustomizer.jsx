'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCcw, ChevronUp, ChevronDown, Palette, Type, Layout, Zap, Square, MousePointer, Sparkles, Eye } from 'lucide-react';

// Font options organized by category - 100+ Google Fonts
const FONT_OPTIONS = {
  'Modern Sans': [
    'Inter', 'Poppins', 'Montserrat', 'Outfit', 'Sora', 'Space Grotesk', 
    'Manrope', 'Figtree', 'Lexend', 'Urbanist', 'Plus Jakarta Sans',
    'DM Sans', 'Work Sans', 'Albert Sans', 'Red Hat Display'
  ],
  'Classic Sans': [
    'Roboto', 'Open Sans', 'Lato', 'Nunito', 'Karla', 'Rubik',
    'Quicksand', 'Raleway', 'Source Sans 3', 'Josefin Sans', 'Mulish',
    'Barlow', 'Cabin', 'Catamaran', 'Maven Pro', 'Questrial', 'Varela Round'
  ],
  'Technical Sans': [
    'Exo 2', 'Titillium Web', 'Archivo', 'Overpass', 'Hind', 'Asap',
    'Signika', 'Comfortaa', 'Rajdhani', 'Chakra Petch', 'Jura', 'Oxanium'
  ],
  'Elegant Serif': [
    'Playfair Display', 'Cormorant Garamond', 'Libre Baskerville',
    'EB Garamond', 'Spectral', 'Fraunces', 'Bodoni Moda', 'Cormorant',
    'DM Serif Display', 'DM Serif Text', 'Libre Caslon Text'
  ],
  'Classic Serif': [
    'Merriweather', 'Lora', 'Crimson Text', 'Bitter', 'Vollkorn',
    'Noto Serif', 'PT Serif', 'Source Serif 4', 'Literata', 'Newsreader',
    'Cardo', 'Old Standard TT', 'Sorts Mill Goudy', 'Gilda Display'
  ],
  'Display & Impact': [
    'Bebas Neue', 'Oswald', 'Anton', 'Archivo Black', 'Alfa Slab One',
    'Righteous', 'Russo One', 'Teko', 'Fjalla One', 'Staatliches',
    'Passion One', 'Titan One', 'Fredoka', 'Lilita One', 'Abril Fatface'
  ],
  'Artistic & Unique': [
    'Cinzel', 'Cinzel Decorative', 'Marcellus', 'Philosopher', 'Yeseva One',
    'Poiret One', 'Julius Sans One', 'Syncopate', 'Forum', 'Oranienbaum'
  ],
  'Futuristic': [
    'Orbitron', 'Audiowide', 'Michroma', 'Electrolize', 'Major Mono Display',
    'Megrim', 'Share Tech Mono'
  ],
  'Handwritten': [
    'Pacifico', 'Dancing Script', 'Satisfy', 'Caveat', 'Indie Flower',
    'Patrick Hand', 'Kaushan Script', 'Sacramento', 'Great Vibes', 'Lobster',
    'Yellowtail', 'Rock Salt', 'Architects Daughter', 'Gloria Hallelujah',
    'Cookie', 'Courgette', 'Kalam', 'Neucha', 'Handlee'
  ],
  'Fun & Playful': [
    'Bungee', 'Luckiest Guy', 'Permanent Marker', 'Bangers', 'Comforter Brush',
    'Amatic SC', 'Shadows Into Light', 'Reenie Beanie', 'Just Another Hand'
  ],
  'Monospace': [
    'Fira Code', 'JetBrains Mono', 'Source Code Pro', 'IBM Plex Mono',
    'Roboto Mono', 'Space Mono', 'Ubuntu Mono', 'Inconsolata',
    'Anonymous Pro', 'Courier Prime', 'Overpass Mono', 'Red Hat Mono'
  ],
  'Retro & Pixel': [
    'Press Start 2P', 'VT323', 'Silkscreen', 'Pixelify Sans'
  ]
};

// List style options
const LIST_STYLES = [
  { value: 'disc', label: '● Disc' },
  { value: 'circle', label: '○ Circle' },
  { value: 'square', label: '■ Square' },
  { value: 'decimal', label: '1. Numbers' },
  { value: 'lower-alpha', label: 'a. Letters' },
  { value: 'lower-roman', label: 'i. Roman' },
  { value: 'none', label: 'None' },
];

// Number Stepper Component
const NumberStepper = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = 'px', small = false }) => {
  const numValue = parseFloat(value) || 0;
  
  const increment = () => onChange(Math.min(max, numValue + step) + unit);
  const decrement = () => onChange(Math.max(min, numValue - step) + unit);
  
  return (
    <div className={`flex items-center justify-between ${small ? 'py-1' : 'py-2'}`}>
      <label className={`text-slate-600 ${small ? 'text-xs' : 'text-sm'}`}>{label}</label>
      <div className="flex items-center gap-1">
        <button 
          onClick={decrement}
          className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg transition"
        >
          <ChevronDown size={14} />
        </button>
        <div className="w-16 text-center">
          <span className="text-sm font-medium">{numValue}</span>
          <span className="text-xs text-slate-400 ml-0.5">{unit}</span>
        </div>
        <button 
          onClick={increment}
          className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg transition"
        >
          <ChevronUp size={14} />
        </button>
      </div>
    </div>
  );
};

// Slider Component
const SliderInput = ({ label, value, onChange, min, max, step = 1, unit = '', showValue = true }) => {
  const numValue = parseFloat(value) || min;
  
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm text-slate-600">{label}</label>
        {showValue && (
          <span className="text-sm font-medium text-violet-600">{numValue}{unit}</span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={numValue}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
      />
    </div>
  );
};

// Font Selector Component
const FontSelector = ({ label, value, onChange, showPreview = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const fontName = value?.split(',')[0] || 'Inter';
  
  return (
    <div className="py-2">
      <label className="text-sm text-slate-600 block mb-1">{label}</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-left bg-white border border-slate-200 rounded-lg hover:border-violet-400 transition flex items-center justify-between"
          style={{ fontFamily: value }}
        >
          <span className="text-sm">{fontName}</span>
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {Object.entries(FONT_OPTIONS).map(([category, fonts]) => (
              <div key={category}>
                <div className="px-3 py-1 text-xs font-semibold text-slate-400 bg-slate-50 sticky top-0">
                  {category}
                </div>
                {fonts.map((font) => (
                  <button
                    key={font}
                    onClick={() => {
                      onChange(`${font}, ${category === 'Monospace' ? 'monospace' : category === 'Serif' ? 'serif' : 'sans-serif'}`);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-violet-50 transition ${
                      fontName === font ? 'bg-violet-100 text-violet-700' : ''
                    }`}
                    style={{ fontFamily: `${font}, ${category === 'Monospace' ? 'monospace' : category === 'Serif' ? 'serif' : 'sans-serif'}` }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Color Input Component
const ColorInput = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <label className="text-sm text-slate-600">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg cursor-pointer border-2 border-slate-200 hover:border-violet-400 transition"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 px-2 py-1 text-xs font-mono border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
      />
    </div>
  </div>
);

export default function ThemeCustomizer({ style, onClose, onSave }) {
  const [customStyle, setCustomStyle] = useState({
    ...style,
    // Typography defaults
    h1Font: style.h1Font || style.fontFamily || 'Inter, sans-serif',
    h2Font: style.h2Font || style.fontFamily || 'Inter, sans-serif',
    h3Font: style.h3Font || style.fontFamily || 'Inter, sans-serif',
    bodyFont: style.bodyFont || style.fontFamily || 'Inter, sans-serif',
    h1Size: style.h1Size || 48,
    h2Size: style.h2Size || 36,
    h3Size: style.h3Size || 24,
    bodySize: style.bodySize || 16,
    h1Weight: style.h1Weight || 700,
    h2Weight: style.h2Weight || 600,
    h3Weight: style.h3Weight || 600,
    bodyWeight: style.bodyWeight || 400,
    lineHeight: style.lineHeight || 1.6,
    letterSpacing: style.letterSpacing || 0,
    listStyle: style.listStyle || 'disc',
    // Layout defaults
    borderRadius: parseInt(style.borderRadius) || 8,
    spacing: parseInt(style.spacing) || 16,
    cardPadding: parseInt(style.cardPadding) || 24,
    borderWidth: parseInt(style.borderWidth) || 1,
    // Effects
    shadowIntensity: style.shadowIntensity || 'medium',
    // Interactive
    transitionSpeed: style.transitionSpeed || 200,
    hoverScale: style.hoverScale || 1.02,
    buttonTextTransform: style.buttonTextTransform || 'none',
  });
  
  const [themeName, setThemeName] = useState(`${style.name} Custom`);
  const [activeSection, setActiveSection] = useState('typography');

  const updateStyle = (key, value) => {
    setCustomStyle(prev => ({ ...prev, [key]: value }));
  };

  const resetToOriginal = () => {
    setCustomStyle({ ...style });
    setThemeName(`${style.name} Custom`);
  };

  // Generate shadow based on intensity
  const getShadow = (intensity) => {
    const shadows = {
      none: 'none',
      subtle: '0 1px 3px rgba(0,0,0,0.08)',
      light: '0 2px 6px rgba(0,0,0,0.1)',
      medium: '0 4px 12px rgba(0,0,0,0.12)',
      strong: '0 8px 24px rgba(0,0,0,0.16)',
      heavy: '0 12px 32px rgba(0,0,0,0.2)',
    };
    return shadows[intensity] || shadows.medium;
  };

  const handleSave = () => {
    const newStyle = {
      ...customStyle,
      id: `custom-${Date.now()}`,
      name: themeName,
      category: 'custom',
      originalStyleId: style.id,
      borderRadius: `${customStyle.borderRadius}px`,
      spacing: `${customStyle.spacing}px`,
      cardPadding: `${customStyle.cardPadding}px`,
      borderWidth: `${customStyle.borderWidth}px`,
      shadowStyle: getShadow(customStyle.shadowIntensity),
      fontFamily: customStyle.bodyFont,
    };
    
    // Save to localStorage
    const customStyles = JSON.parse(localStorage.getItem('vibesync_custom_styles') || '[]');
    customStyles.push(newStyle);
    localStorage.setItem('vibesync_custom_styles', JSON.stringify(customStyles));
    
    // Auto-add to favorites
    const favorites = JSON.parse(localStorage.getItem('vibesync_favorites') || '[]');
    if (!favorites.includes(newStyle.id)) {
      favorites.push(newStyle.id);
      localStorage.setItem('vibesync_favorites', JSON.stringify(favorites));
    }
    
    window.dispatchEvent(new Event('storage'));
    onSave(newStyle);
    onClose();
  };

  const sections = [
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'effects', label: 'Effects', icon: Sparkles },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-fuchsia-50">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl"
                style={{ background: customStyle.gradientStyle || `linear-gradient(135deg, ${customStyle.primaryColor}, ${customStyle.secondaryColor})` }}
              />
              <div>
                <input
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  className="text-lg font-bold text-slate-900 bg-transparent border-b-2 border-transparent hover:border-violet-300 focus:border-violet-500 outline-none transition-colors"
                  placeholder="Theme Name"
                />
                <p className="text-xs text-slate-500">Based on: {style.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetToOriginal}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-1 p-2 bg-slate-50 border-b border-slate-200">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeSection === section.id
                      ? 'bg-white text-violet-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  <Icon size={16} />
                  {section.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Controls Panel */}
            <div className="w-1/2 p-4 overflow-y-auto border-r border-slate-100">
              
              {activeSection === 'typography' && (
                <div className="space-y-4">
                  {/* H1 Settings */}
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-violet-600 text-white text-xs font-bold rounded flex items-center justify-center">H1</span>
                      Heading 1
                    </h4>
                    <FontSelector 
                      label="Font Family" 
                      value={customStyle.h1Font} 
                      onChange={(v) => updateStyle('h1Font', v)} 
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <NumberStepper 
                        label="Size" 
                        value={customStyle.h1Size} 
                        onChange={(v) => updateStyle('h1Size', parseInt(v))} 
                        min={24} max={96} step={2} unit="px" small 
                      />
                      <NumberStepper 
                        label="Weight" 
                        value={customStyle.h1Weight} 
                        onChange={(v) => updateStyle('h1Weight', parseInt(v))} 
                        min={300} max={900} step={100} unit="" small 
                      />
                    </div>
                  </div>

                  {/* H2 Settings */}
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-violet-500 text-white text-xs font-bold rounded flex items-center justify-center">H2</span>
                      Heading 2
                    </h4>
                    <FontSelector 
                      label="Font Family" 
                      value={customStyle.h2Font} 
                      onChange={(v) => updateStyle('h2Font', v)} 
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <NumberStepper 
                        label="Size" 
                        value={customStyle.h2Size} 
                        onChange={(v) => updateStyle('h2Size', parseInt(v))} 
                        min={18} max={72} step={2} unit="px" small 
                      />
                      <NumberStepper 
                        label="Weight" 
                        value={customStyle.h2Weight} 
                        onChange={(v) => updateStyle('h2Weight', parseInt(v))} 
                        min={300} max={900} step={100} unit="" small 
                      />
                    </div>
                  </div>

                  {/* H3 Settings */}
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-violet-400 text-white text-xs font-bold rounded flex items-center justify-center">H3</span>
                      Heading 3
                    </h4>
                    <FontSelector 
                      label="Font Family" 
                      value={customStyle.h3Font} 
                      onChange={(v) => updateStyle('h3Font', v)} 
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <NumberStepper 
                        label="Size" 
                        value={customStyle.h3Size} 
                        onChange={(v) => updateStyle('h3Size', parseInt(v))} 
                        min={14} max={48} step={1} unit="px" small 
                      />
                      <NumberStepper 
                        label="Weight" 
                        value={customStyle.h3Weight} 
                        onChange={(v) => updateStyle('h3Weight', parseInt(v))} 
                        min={300} max={900} step={100} unit="" small 
                      />
                    </div>
                  </div>

                  {/* Body Text Settings */}
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-500 text-white text-xs font-bold rounded flex items-center justify-center">P</span>
                      Body Text
                    </h4>
                    <FontSelector 
                      label="Font Family" 
                      value={customStyle.bodyFont} 
                      onChange={(v) => updateStyle('bodyFont', v)} 
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <NumberStepper 
                        label="Size" 
                        value={customStyle.bodySize} 
                        onChange={(v) => updateStyle('bodySize', parseInt(v))} 
                        min={12} max={24} step={1} unit="px" small 
                      />
                      <NumberStepper 
                        label="Weight" 
                        value={customStyle.bodyWeight} 
                        onChange={(v) => updateStyle('bodyWeight', parseInt(v))} 
                        min={300} max={700} step={100} unit="" small 
                      />
                    </div>
                    <SliderInput 
                      label="Line Height" 
                      value={customStyle.lineHeight} 
                      onChange={(v) => updateStyle('lineHeight', v)} 
                      min={1} max={2.5} step={0.1} 
                    />
                  </div>

                  {/* List Style */}
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-2">List Style</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {LIST_STYLES.map((ls) => (
                        <button
                          key={ls.value}
                          onClick={() => updateStyle('listStyle', ls.value)}
                          className={`px-2 py-2 text-xs rounded-lg transition ${
                            customStyle.listStyle === ls.value
                              ? 'bg-violet-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-400'
                          }`}
                        >
                          {ls.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'colors' && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-3">Brand Colors</h4>
                    <ColorInput label="Primary" value={customStyle.primaryColor} onChange={(v) => updateStyle('primaryColor', v)} />
                    <ColorInput label="Secondary" value={customStyle.secondaryColor} onChange={(v) => updateStyle('secondaryColor', v)} />
                    <ColorInput label="Accent" value={customStyle.accentColor} onChange={(v) => updateStyle('accentColor', v)} />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-3">Background & Text</h4>
                    <ColorInput label="Background" value={customStyle.backgroundColor} onChange={(v) => updateStyle('backgroundColor', v)} />
                    <ColorInput label="Text Color" value={customStyle.textColor} onChange={(v) => updateStyle('textColor', v)} />
                  </div>
                </div>
              )}

              {activeSection === 'layout' && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-3">Border Radius</h4>
                    <SliderInput 
                      label="Corner Radius" 
                      value={customStyle.borderRadius} 
                      onChange={(v) => updateStyle('borderRadius', v)} 
                      min={0} max={32} step={1} unit="px"
                    />
                    <div className="flex justify-between mt-2">
                      {[0, 4, 8, 12, 16, 24, 9999].map((r) => (
                        <button
                          key={r}
                          onClick={() => updateStyle('borderRadius', r)}
                          className={`w-10 h-10 border-2 transition ${
                            customStyle.borderRadius === r ? 'border-violet-600 bg-violet-50' : 'border-slate-200 hover:border-violet-400'
                          }`}
                          style={{ borderRadius: r === 9999 ? '50%' : `${r}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-3">Spacing</h4>
                    <NumberStepper 
                      label="Base Spacing" 
                      value={customStyle.spacing} 
                      onChange={(v) => updateStyle('spacing', parseInt(v))} 
                      min={4} max={48} step={4} unit="px" 
                    />
                    <NumberStepper 
                      label="Card Padding" 
                      value={customStyle.cardPadding} 
                      onChange={(v) => updateStyle('cardPadding', parseInt(v))} 
                      min={8} max={48} step={4} unit="px" 
                    />
                    <NumberStepper 
                      label="Border Width" 
                      value={customStyle.borderWidth} 
                      onChange={(v) => updateStyle('borderWidth', parseInt(v))} 
                      min={0} max={4} step={1} unit="px" 
                    />
                  </div>
                </div>
              )}

              {activeSection === 'effects' && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-3">Shadows</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {['none', 'subtle', 'light', 'medium', 'strong', 'heavy'].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStyle('shadowIntensity', s)}
                          className={`p-3 rounded-lg transition capitalize ${
                            customStyle.shadowIntensity === s
                              ? 'bg-violet-600 text-white'
                              : 'bg-white text-slate-600 hover:bg-violet-50'
                          }`}
                          style={{ boxShadow: getShadow(s) }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-3">Animations</h4>
                    <SliderInput 
                      label="Transition Speed" 
                      value={customStyle.transitionSpeed} 
                      onChange={(v) => updateStyle('transitionSpeed', v)} 
                      min={0} max={500} step={50} unit="ms"
                    />
                    <SliderInput 
                      label="Hover Scale" 
                      value={customStyle.hoverScale} 
                      onChange={(v) => updateStyle('hoverScale', v)} 
                      min={1} max={1.15} step={0.01}
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-3">Button Style</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'none', label: 'Normal' },
                        { value: 'uppercase', label: 'UPPERCASE' },
                        { value: 'capitalize', label: 'Capitalize' },
                        { value: 'lowercase', label: 'lowercase' },
                      ].map((bs) => (
                        <button
                          key={bs.value}
                          onClick={() => updateStyle('buttonTextTransform', bs.value)}
                          className={`px-3 py-2 text-sm rounded-lg transition ${
                            customStyle.buttonTextTransform === bs.value
                              ? 'bg-violet-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-400'
                          }`}
                          style={{ textTransform: bs.value }}
                        >
                          {bs.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Preview */}
            <div className="w-1/2 p-4 bg-slate-100 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <Eye size={16} className="text-violet-600" />
                <h3 className="font-semibold text-slate-800">Live Preview</h3>
              </div>
              
              <div
                className="rounded-xl p-6 min-h-[400px]"
                style={{ 
                  backgroundColor: customStyle.backgroundColor,
                  transition: `all ${customStyle.transitionSpeed}ms ease`
                }}
              >
                {/* Typography Preview */}
                <h1 style={{
                  fontFamily: customStyle.h1Font,
                  fontSize: `${customStyle.h1Size}px`,
                  fontWeight: customStyle.h1Weight,
                  color: customStyle.primaryColor,
                  lineHeight: customStyle.lineHeight,
                  marginBottom: `${customStyle.spacing}px`,
                }}>
                  Heading One
                </h1>
                
                <h2 style={{
                  fontFamily: customStyle.h2Font,
                  fontSize: `${customStyle.h2Size}px`,
                  fontWeight: customStyle.h2Weight,
                  color: customStyle.secondaryColor,
                  lineHeight: customStyle.lineHeight,
                  marginBottom: `${customStyle.spacing}px`,
                }}>
                  Heading Two
                </h2>
                
                <h3 style={{
                  fontFamily: customStyle.h3Font,
                  fontSize: `${customStyle.h3Size}px`,
                  fontWeight: customStyle.h3Weight,
                  color: customStyle.textColor,
                  lineHeight: customStyle.lineHeight,
                  marginBottom: `${customStyle.spacing}px`,
                }}>
                  Heading Three
                </h3>
                
                <p style={{
                  fontFamily: customStyle.bodyFont,
                  fontSize: `${customStyle.bodySize}px`,
                  fontWeight: customStyle.bodyWeight,
                  color: customStyle.textColor,
                  lineHeight: customStyle.lineHeight,
                  marginBottom: `${customStyle.spacing}px`,
                }}>
                  This is body text that shows how paragraphs will look with your chosen typography settings. Good readability is essential for user experience.
                </p>

                {/* List Preview */}
                <ul style={{
                  listStyleType: customStyle.listStyle,
                  fontFamily: customStyle.bodyFont,
                  fontSize: `${customStyle.bodySize}px`,
                  color: customStyle.textColor,
                  paddingLeft: '20px',
                  marginBottom: `${customStyle.spacing}px`,
                }}>
                  <li>First list item</li>
                  <li>Second list item</li>
                  <li>Third list item</li>
                </ul>

                {/* Card Preview */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: `${customStyle.borderRadius}px`,
                    padding: `${customStyle.cardPadding}px`,
                    border: `${customStyle.borderWidth}px solid ${customStyle.primaryColor}20`,
                    boxShadow: getShadow(customStyle.shadowIntensity),
                    transition: `all ${customStyle.transitionSpeed}ms ease`,
                  }}
                  className="hover:scale-[1.02]"
                >
                  <h4 style={{
                    fontFamily: customStyle.h3Font,
                    fontSize: `${customStyle.h3Size * 0.8}px`,
                    fontWeight: customStyle.h3Weight,
                    color: customStyle.primaryColor,
                    marginBottom: `${customStyle.spacing / 2}px`,
                  }}>
                    Card Title
                  </h4>
                  <p style={{
                    fontFamily: customStyle.bodyFont,
                    fontSize: `${customStyle.bodySize}px`,
                    color: customStyle.textColor,
                    marginBottom: `${customStyle.spacing}px`,
                  }}>
                    Card content with your styling applied.
                  </p>
                  <div className="flex gap-2">
                    <button style={{
                      background: `linear-gradient(135deg, ${customStyle.primaryColor}, ${customStyle.secondaryColor})`,
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: `${customStyle.borderRadius}px`,
                      fontFamily: customStyle.bodyFont,
                      fontSize: `${customStyle.bodySize}px`,
                      fontWeight: 600,
                      textTransform: customStyle.buttonTextTransform,
                      transition: `all ${customStyle.transitionSpeed}ms ease`,
                    }}>
                      Primary
                    </button>
                    <button style={{
                      background: 'transparent',
                      color: customStyle.primaryColor,
                      padding: '8px 16px',
                      borderRadius: `${customStyle.borderRadius}px`,
                      border: `2px solid ${customStyle.primaryColor}`,
                      fontFamily: customStyle.bodyFont,
                      fontSize: `${customStyle.bodySize}px`,
                      fontWeight: 600,
                      textTransform: customStyle.buttonTextTransform,
                    }}>
                      Secondary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Custom theme will be automatically added to your favorites
            </p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!themeName.trim()}
                className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                <Save size={16} />
                Save Theme
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
