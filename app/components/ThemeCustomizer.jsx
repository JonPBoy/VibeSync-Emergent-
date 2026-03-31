'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCcw, Palette, Type, Layout, Zap, Square, MousePointer, Sparkles } from 'lucide-react';

// Font options
const FONT_OPTIONS = [
  'Inter, sans-serif',
  'Poppins, sans-serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Montserrat, sans-serif',
  'Playfair Display, serif',
  'Merriweather, serif',
  'Lora, serif',
  'Bebas Neue, sans-serif',
  'Oswald, sans-serif',
  'Fira Code, monospace',
  'JetBrains Mono, monospace',
];

// Border radius presets
const RADIUS_PRESETS = [
  { label: 'None', value: '0px' },
  { label: 'Subtle', value: '4px' },
  { label: 'Small', value: '6px' },
  { label: 'Medium', value: '8px' },
  { label: 'Large', value: '12px' },
  { label: 'XL', value: '16px' },
  { label: '2XL', value: '20px' },
  { label: 'Full', value: '9999px' },
];

// Shadow presets
const SHADOW_PRESETS = [
  { label: 'None', value: 'none' },
  { label: 'Subtle', value: '0 1px 2px rgba(0,0,0,0.05)' },
  { label: 'Small', value: '0 2px 4px rgba(0,0,0,0.1)' },
  { label: 'Medium', value: '0 4px 6px rgba(0,0,0,0.1)' },
  { label: 'Large', value: '0 8px 16px rgba(0,0,0,0.15)' },
  { label: 'XL', value: '0 12px 24px rgba(0,0,0,0.2)' },
  { label: 'Glow', value: '0 0 20px rgba(139,92,246,0.3)' },
  { label: 'Sharp', value: '4px 4px 0px rgba(0,0,0,0.2)' },
];

// Spacing presets
const SPACING_PRESETS = [
  { label: 'Compact', value: '4px' },
  { label: 'Tight', value: '8px' },
  { label: 'Normal', value: '16px' },
  { label: 'Relaxed', value: '24px' },
  { label: 'Loose', value: '32px' },
];

// Animation presets
const ANIMATION_PRESETS = [
  { label: 'None', value: 'none', duration: '0ms' },
  { label: 'Instant', value: 'ease', duration: '100ms' },
  { label: 'Fast', value: 'ease-out', duration: '150ms' },
  { label: 'Normal', value: 'ease-in-out', duration: '200ms' },
  { label: 'Smooth', value: 'ease-in-out', duration: '300ms' },
  { label: 'Slow', value: 'ease-in-out', duration: '500ms' },
];

// Border width presets
const BORDER_PRESETS = [
  { label: 'None', value: '0px' },
  { label: 'Hairline', value: '1px' },
  { label: 'Thin', value: '2px' },
  { label: 'Medium', value: '3px' },
  { label: 'Thick', value: '4px' },
];

// Button style presets
const BUTTON_STYLES = [
  { label: 'Normal', textTransform: 'none', fontWeight: '600' },
  { label: 'Uppercase', textTransform: 'uppercase', fontWeight: '600' },
  { label: 'Bold', textTransform: 'none', fontWeight: '700' },
  { label: 'Light', textTransform: 'none', fontWeight: '500' },
];

export default function ThemeCustomizer({ style, onClose, onSave }) {
  const [customStyle, setCustomStyle] = useState({
    ...style,
    // Additional UI/UX properties with defaults
    spacing: style.spacing || '16px',
    borderWidth: style.borderWidth || '1px',
    transitionDuration: style.transitionDuration || '200ms',
    transitionEasing: style.transitionEasing || 'ease-in-out',
    buttonTextTransform: style.buttonTextTransform || 'none',
    buttonFontWeight: style.buttonFontWeight || '600',
    lineHeight: style.lineHeight || '1.6',
    letterSpacing: style.letterSpacing || '0',
    inputBorderColor: style.inputBorderColor || '#e2e8f0',
    inputFocusColor: style.inputFocusColor || style.primaryColor,
    hoverScale: style.hoverScale || '1.02',
    cardPadding: style.cardPadding || '24px',
  });
  
  const [themeName, setThemeName] = useState(`${style.name} Custom`);
  const [activeSection, setActiveSection] = useState('colors');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(JSON.stringify(customStyle) !== JSON.stringify(style));
  }, [customStyle, style]);

  const updateStyle = (key, value) => {
    setCustomStyle(prev => ({ ...prev, [key]: value }));
  };

  const resetToOriginal = () => {
    setCustomStyle({ ...style });
    setThemeName(`${style.name} Custom`);
  };

  const handleSave = () => {
    const newStyle = {
      ...customStyle,
      id: `custom-${Date.now()}`,
      name: themeName,
      category: 'custom',
      originalStyleId: style.id,
    };
    
    // Save to localStorage custom styles
    const customStyles = JSON.parse(localStorage.getItem('vibesync_custom_styles') || '[]');
    customStyles.push(newStyle);
    localStorage.setItem('vibesync_custom_styles', JSON.stringify(customStyles));
    
    // Auto-add to favorites
    const favorites = JSON.parse(localStorage.getItem('vibesync_favorites') || '[]');
    if (!favorites.includes(newStyle.id)) {
      favorites.push(newStyle.id);
      localStorage.setItem('vibesync_favorites', JSON.stringify(favorites));
    }
    
    // Dispatch storage event for other components
    window.dispatchEvent(new Event('storage'));
    
    onSave(newStyle);
    onClose();
  };

  const sections = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'effects', label: 'Effects', icon: Sparkles },
    { id: 'interactive', label: 'Interactive', icon: MousePointer },
  ];

  // Color input component
  const ColorInput = ({ label, colorKey }) => (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm text-slate-600">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={customStyle[colorKey]}
          onChange={(e) => updateStyle(colorKey, e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-2 border-slate-200"
        />
        <input
          type="text"
          value={customStyle[colorKey]}
          onChange={(e) => updateStyle(colorKey, e.target.value)}
          className="w-20 px-2 py-1 text-xs font-mono border border-slate-200 rounded"
        />
      </div>
    </div>
  );

  // Select input component
  const SelectInput = ({ label, value, options, onChange }) => (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 text-sm border border-slate-200 rounded bg-white min-w-[120px]"
      >
        {options.map((opt) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt.split(',')[0] : opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  // Preset buttons component
  const PresetButtons = ({ presets, currentValue, onChange, getStyle }) => (
    <div className="flex flex-wrap gap-1 mt-1">
      {presets.map((preset) => (
        <button
          key={preset.label}
          onClick={() => onChange(preset.value)}
          className={`px-2 py-1 text-xs rounded transition ${
            currentValue === preset.value
              ? 'bg-violet-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          style={getStyle ? getStyle(preset) : {}}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );

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
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
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
                <p className="text-xs text-slate-500">Customizing: {style.name}</p>
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeSection === section.id
                      ? 'bg-white text-violet-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  <Icon size={14} />
                  {section.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Controls Panel */}
            <div className="w-1/2 p-4 overflow-y-auto border-r border-slate-200">
              {activeSection === 'colors' && (
                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-800 mb-3">Color Palette</h3>
                  <ColorInput label="Primary" colorKey="primaryColor" />
                  <ColorInput label="Secondary" colorKey="secondaryColor" />
                  <ColorInput label="Accent" colorKey="accentColor" />
                  <ColorInput label="Background" colorKey="backgroundColor" />
                  <ColorInput label="Text" colorKey="textColor" />
                  <div className="border-t border-slate-100 my-3" />
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Form Colors</h4>
                  <ColorInput label="Input Border" colorKey="inputBorderColor" />
                  <ColorInput label="Focus Ring" colorKey="inputFocusColor" />
                </div>
              )}

              {activeSection === 'typography' && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-800 mb-3">Typography</h3>
                  <SelectInput
                    label="Primary Font"
                    value={customStyle.fontFamily}
                    options={FONT_OPTIONS}
                    onChange={(v) => updateStyle('fontFamily', v)}
                  />
                  <div className="py-2">
                    <label className="text-sm text-slate-600 block mb-1">Line Height</label>
                    <input
                      type="range"
                      min="1"
                      max="2"
                      step="0.1"
                      value={customStyle.lineHeight}
                      onChange={(e) => updateStyle('lineHeight', e.target.value)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Tight (1.0)</span>
                      <span className="font-medium text-violet-600">{customStyle.lineHeight}</span>
                      <span>Loose (2.0)</span>
                    </div>
                  </div>
                  <div className="py-2">
                    <label className="text-sm text-slate-600 block mb-1">Letter Spacing</label>
                    <input
                      type="range"
                      min="-0.05"
                      max="0.2"
                      step="0.01"
                      value={customStyle.letterSpacing}
                      onChange={(e) => updateStyle('letterSpacing', e.target.value)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Tight</span>
                      <span className="font-medium text-violet-600">{customStyle.letterSpacing}em</span>
                      <span>Wide</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'layout' && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-800 mb-3">Layout & Spacing</h3>
                  
                  <div className="py-2">
                    <label className="text-sm text-slate-600">Border Radius</label>
                    <PresetButtons
                      presets={RADIUS_PRESETS}
                      currentValue={customStyle.borderRadius}
                      onChange={(v) => updateStyle('borderRadius', v)}
                      getStyle={(p) => ({ borderRadius: p.value })}
                    />
                  </div>

                  <div className="py-2">
                    <label className="text-sm text-slate-600">Base Spacing</label>
                    <PresetButtons
                      presets={SPACING_PRESETS}
                      currentValue={customStyle.spacing}
                      onChange={(v) => updateStyle('spacing', v)}
                    />
                  </div>

                  <div className="py-2">
                    <label className="text-sm text-slate-600">Card Padding</label>
                    <PresetButtons
                      presets={[
                        { label: '12px', value: '12px' },
                        { label: '16px', value: '16px' },
                        { label: '20px', value: '20px' },
                        { label: '24px', value: '24px' },
                        { label: '32px', value: '32px' },
                      ]}
                      currentValue={customStyle.cardPadding}
                      onChange={(v) => updateStyle('cardPadding', v)}
                    />
                  </div>

                  <div className="py-2">
                    <label className="text-sm text-slate-600">Border Width</label>
                    <PresetButtons
                      presets={BORDER_PRESETS}
                      currentValue={customStyle.borderWidth}
                      onChange={(v) => updateStyle('borderWidth', v)}
                    />
                  </div>
                </div>
              )}

              {activeSection === 'effects' && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-800 mb-3">Visual Effects</h3>
                  
                  <div className="py-2">
                    <label className="text-sm text-slate-600">Shadow Style</label>
                    <PresetButtons
                      presets={SHADOW_PRESETS}
                      currentValue={customStyle.shadowStyle}
                      onChange={(v) => updateStyle('shadowStyle', v)}
                    />
                  </div>

                  <div className="py-2">
                    <label className="text-sm text-slate-600 block mb-1">Gradient Direction</label>
                    <div className="flex gap-2 flex-wrap">
                      {['135deg', '90deg', '180deg', '45deg', '0deg', '270deg'].map((deg) => (
                        <button
                          key={deg}
                          onClick={() => updateStyle('gradientStyle', `linear-gradient(${deg}, ${customStyle.primaryColor}, ${customStyle.secondaryColor})`)}
                          className="w-10 h-10 rounded-lg border-2 border-slate-200 hover:border-violet-400 transition"
                          style={{ background: `linear-gradient(${deg}, ${customStyle.primaryColor}, ${customStyle.secondaryColor})` }}
                          title={deg}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'interactive' && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-800 mb-3">Interactive Elements</h3>
                  
                  <div className="py-2">
                    <label className="text-sm text-slate-600">Animation Speed</label>
                    <PresetButtons
                      presets={ANIMATION_PRESETS}
                      currentValue={customStyle.transitionDuration}
                      onChange={(v) => {
                        const preset = ANIMATION_PRESETS.find(p => p.duration === v);
                        updateStyle('transitionDuration', v);
                        if (preset) updateStyle('transitionEasing', preset.value);
                      }}
                    />
                  </div>

                  <div className="py-2">
                    <label className="text-sm text-slate-600">Hover Scale</label>
                    <PresetButtons
                      presets={[
                        { label: 'None', value: '1' },
                        { label: 'Subtle', value: '1.02' },
                        { label: 'Medium', value: '1.05' },
                        { label: 'Large', value: '1.1' },
                      ]}
                      currentValue={customStyle.hoverScale}
                      onChange={(v) => updateStyle('hoverScale', v)}
                    />
                  </div>

                  <div className="py-2">
                    <label className="text-sm text-slate-600">Button Style</label>
                    <div className="flex gap-2 mt-1">
                      {BUTTON_STYLES.map((bs) => (
                        <button
                          key={bs.label}
                          onClick={() => {
                            updateStyle('buttonTextTransform', bs.textTransform);
                            updateStyle('buttonFontWeight', bs.fontWeight);
                          }}
                          className={`px-3 py-1.5 text-xs rounded transition ${
                            customStyle.buttonTextTransform === bs.textTransform && customStyle.buttonFontWeight === bs.fontWeight
                              ? 'bg-violet-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          style={{ textTransform: bs.textTransform, fontWeight: bs.fontWeight }}
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
            <div className="w-1/2 p-4 bg-slate-50 overflow-y-auto">
              <h3 className="font-semibold text-slate-800 mb-3">Live Preview</h3>
              <div
                className="rounded-xl p-4 min-h-[300px]"
                style={{ backgroundColor: customStyle.backgroundColor }}
              >
                {/* Preview Card */}
                <div
                  className="mb-4 transition-all"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: customStyle.borderRadius,
                    boxShadow: customStyle.shadowStyle,
                    padding: customStyle.cardPadding,
                    border: `${customStyle.borderWidth} solid ${customStyle.inputBorderColor}`,
                    transition: `all ${customStyle.transitionDuration} ${customStyle.transitionEasing}`,
                  }}
                >
                  <h4
                    style={{
                      color: customStyle.primaryColor,
                      fontFamily: customStyle.fontFamily,
                      lineHeight: customStyle.lineHeight,
                      letterSpacing: `${customStyle.letterSpacing}em`,
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: customStyle.spacing,
                    }}
                  >
                    Card Title
                  </h4>
                  <p
                    style={{
                      color: customStyle.textColor,
                      fontFamily: customStyle.fontFamily,
                      lineHeight: customStyle.lineHeight,
                      letterSpacing: `${customStyle.letterSpacing}em`,
                      fontSize: '14px',
                      marginBottom: customStyle.spacing,
                    }}
                  >
                    This is how your text will look with the current typography settings.
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 text-white text-sm transition-transform hover:scale-105"
                      style={{
                        background: customStyle.gradientStyle || `linear-gradient(135deg, ${customStyle.primaryColor}, ${customStyle.secondaryColor})`,
                        borderRadius: customStyle.borderRadius,
                        textTransform: customStyle.buttonTextTransform,
                        fontWeight: customStyle.buttonFontWeight,
                        fontFamily: customStyle.fontFamily,
                        transition: `all ${customStyle.transitionDuration} ${customStyle.transitionEasing}`,
                      }}
                    >
                      Primary
                    </button>
                    <button
                      className="px-4 py-2 text-sm"
                      style={{
                        borderRadius: customStyle.borderRadius,
                        border: `2px solid ${customStyle.primaryColor}`,
                        color: customStyle.primaryColor,
                        textTransform: customStyle.buttonTextTransform,
                        fontWeight: customStyle.buttonFontWeight,
                        fontFamily: customStyle.fontFamily,
                        backgroundColor: 'transparent',
                      }}
                    >
                      Secondary
                    </button>
                  </div>
                </div>

                {/* Preview Input */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Input field preview"
                    className="w-full px-3 py-2 outline-none transition-all"
                    style={{
                      borderRadius: customStyle.borderRadius,
                      border: `${customStyle.borderWidth} solid ${customStyle.inputBorderColor}`,
                      fontFamily: customStyle.fontFamily,
                      fontSize: '14px',
                    }}
                    onFocus={(e) => e.target.style.borderColor = customStyle.inputFocusColor}
                    onBlur={(e) => e.target.style.borderColor = customStyle.inputBorderColor}
                  />
                </div>

                {/* Color Swatches */}
                <div className="flex gap-2">
                  {['primaryColor', 'secondaryColor', 'accentColor'].map((key) => (
                    <div
                      key={key}
                      className="w-8 h-8"
                      style={{
                        backgroundColor: customStyle[key],
                        borderRadius: customStyle.borderRadius,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {hasChanges ? '• Unsaved changes' : 'No changes'}
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
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                <Save size={16} />
                Save & Add to Favorites
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
