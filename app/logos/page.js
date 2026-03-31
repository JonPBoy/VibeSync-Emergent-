'use client';

import { useState } from 'react';
import { Check, Star } from 'lucide-react';

// Logo 1: Gradient Wave - Modern flowing design representing style harmony
const Logo1 = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="50%" stopColor="#D946EF" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="22" fill="url(#grad1)" />
    <path d="M12 28C16 20 20 32 24 24C28 16 32 28 36 20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 24C16 16 20 28 24 20C28 12 32 24 36 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
  </svg>
);

// Logo 2: Prism Split - Represents color/style splitting and remixing
const Logo2 = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad2a" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
      <linearGradient id="grad2b" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D946EF" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id="grad2c" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#14B8A6" />
      </linearGradient>
    </defs>
    <path d="M24 4L6 40H18L24 28L30 40H42L24 4Z" fill="url(#grad2a)" />
    <path d="M24 28L18 40H24V28Z" fill="url(#grad2b)" />
    <path d="M24 28V40H30L24 28Z" fill="url(#grad2c)" />
    <circle cx="24" cy="16" r="4" fill="white" opacity="0.9" />
  </svg>
);

// Logo 3: Sync Circles - Overlapping circles representing style synchronization
const Logo3 = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="20" r="12" fill="#8B5CF6" opacity="0.9" />
    <circle cx="30" cy="20" r="12" fill="#D946EF" opacity="0.7" />
    <circle cx="24" cy="30" r="12" fill="#06B6D4" opacity="0.8" />
    <path d="M24 18L24 26M20 22H28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Logo 4: Abstract V - Stylized "V" for Vibe with gradient
const Logo4 = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#grad4)" />
    <path d="M14 14L24 34L34 14" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 14L24 24L29 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    <circle cx="24" cy="34" r="3" fill="white" />
  </svg>
);

// Logo 5: Pulse Ring - Dynamic rings representing sync/vibration (MY FAVORITE)
const Logo5 = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="50%" stopColor="#D946EF" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="22" stroke="url(#grad5)" strokeWidth="3" fill="none" />
    <circle cx="24" cy="24" r="15" stroke="url(#grad5)" strokeWidth="2.5" fill="none" opacity="0.7" />
    <circle cx="24" cy="24" r="8" fill="url(#grad5)" />
    <path d="M20 24H28M24 20V28" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const logos = [
  {
    id: 1,
    name: 'Gradient Wave',
    description: 'Flowing waves represent style harmony and creative flow. The smooth curves symbolize the seamless blending of design elements.',
    component: Logo1,
    concept: 'Fluidity & Creativity'
  },
  {
    id: 2,
    name: 'Prism Split',
    description: 'A prism splitting light into colors - perfect metaphor for breaking down and remixing design styles into new combinations.',
    component: Logo2,
    concept: 'Transformation & Remix'
  },
  {
    id: 3,
    name: 'Sync Circles',
    description: 'Overlapping circles in brand colors represent the synchronization and harmony of multiple design elements coming together.',
    component: Logo3,
    concept: 'Unity & Balance'
  },
  {
    id: 4,
    name: 'Abstract V',
    description: 'A bold stylized "V" for Vibe, with layered depth suggesting the multiple layers of design styles available.',
    component: Logo4,
    concept: 'Bold & Modern'
  },
  {
    id: 5,
    name: 'Pulse Ring',
    description: 'Concentric rings pulsing outward from a center point - represents the "sync" aspect and the energy/vibe radiating from great design.',
    component: Logo5,
    concept: 'Energy & Resonance',
    recommended: true
  },
];

export default function LogoShowcase() {
  const [selectedLogo, setSelectedLogo] = useState(5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">VibeSync Logo Concepts</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Five unique logo designs for VibeSync - each capturing a different aspect of the app's mission to help users discover, remix, and export beautiful design styles.
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {logos.map((logo) => {
            const LogoComponent = logo.component;
            return (
              <div
                key={logo.id}
                onClick={() => setSelectedLogo(logo.id)}
                className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  selectedLogo === logo.id
                    ? 'bg-white/10 ring-2 ring-violet-500 scale-105'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {logo.recommended && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={12} fill="white" />
                    Recommended
                  </div>
                )}
                
                {selectedLogo === logo.id && (
                  <div className="absolute top-3 left-3 bg-violet-500 rounded-full p-1">
                    <Check size={14} className="text-white" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  {/* Logo Display */}
                  <div className="mb-4 p-4 bg-white/10 rounded-xl">
                    <LogoComponent size={64} />
                  </div>
                  
                  {/* Logo with Text */}
                  <div className="flex items-center gap-2 mb-3">
                    <LogoComponent size={32} />
                    <span className="text-xl font-bold text-white">VibeSync</span>
                  </div>
                  
                  {/* Info */}
                  <h3 className="text-lg font-semibold text-white mb-1">{logo.name}</h3>
                  <span className="text-xs text-violet-400 font-medium mb-2">{logo.concept}</span>
                  <p className="text-sm text-slate-400">{logo.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Logo Preview */}
        <div className="bg-white/5 rounded-3xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Selected Logo Preview</h2>
          
          {(() => {
            const selected = logos.find(l => l.id === selectedLogo);
            const LogoComponent = selected.component;
            
            return (
              <div className="space-y-8">
                {/* Large Preview */}
                <div className="flex flex-wrap justify-center gap-8">
                  {/* On Dark */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400 mb-2">On Dark</span>
                    <div className="bg-slate-900 p-8 rounded-2xl flex items-center gap-4">
                      <LogoComponent size={48} />
                      <div>
                        <span className="text-2xl font-bold text-white">VibeSync</span>
                        <p className="text-sm text-slate-400">Visual Inspiration Library</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* On Light */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400 mb-2">On Light</span>
                    <div className="bg-white p-8 rounded-2xl flex items-center gap-4">
                      <LogoComponent size={48} />
                      <div>
                        <span className="text-2xl font-bold text-slate-900">VibeSync</span>
                        <p className="text-sm text-slate-500">Visual Inspiration Library</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Size Variations */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-400 mb-4">Size Variations</span>
                  <div className="flex items-end gap-6 bg-white/5 p-6 rounded-xl">
                    <div className="flex flex-col items-center">
                      <LogoComponent size={16} />
                      <span className="text-[10px] text-slate-500 mt-1">16px</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <LogoComponent size={24} />
                      <span className="text-[10px] text-slate-500 mt-1">24px</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <LogoComponent size={32} />
                      <span className="text-[10px] text-slate-500 mt-1">32px</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <LogoComponent size={48} />
                      <span className="text-[10px] text-slate-500 mt-1">48px</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <LogoComponent size={64} />
                      <span className="text-[10px] text-slate-500 mt-1">64px</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <LogoComponent size={96} />
                      <span className="text-[10px] text-slate-500 mt-1">96px</span>
                    </div>
                  </div>
                </div>

                {/* My Recommendation */}
                <div className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 p-6 rounded-xl border border-violet-500/30">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3 rounded-xl">
                      <Star size={24} className="text-white" fill="white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">My Recommendation: Pulse Ring (#5)</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        The <strong>Pulse Ring</strong> logo best captures the essence of VibeSync because:
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Visual "Sync":</strong> The concentric rings represent synchronization and harmony - core to the app's purpose</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>"Vibe" Energy:</strong> The pulsing effect conveys energy and movement, like sound waves or good vibes radiating outward</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Scalability:</strong> Works beautifully at all sizes from favicon (16px) to hero image</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Versatility:</strong> The gradient works on both light and dark backgrounds</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Memorable:</strong> Simple, distinctive shape that's easy to recognize</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Back link */}
        <div className="text-center mt-8">
          <a href="/" className="text-violet-400 hover:text-violet-300 transition">
            ← Back to VibeSync
          </a>
        </div>
      </div>
    </div>
  );
}
