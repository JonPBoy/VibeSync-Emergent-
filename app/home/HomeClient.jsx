'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured, isDatabaseReady, setDatabaseReady } from '@/lib/supabase';
import StyleCard from '../components/StyleCard';
import StylePreview from '../components/StylePreview';

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
    name: 'Forest Whisper',
    category: 'minimal',
    primaryColor: '#2d5016',
    secondaryColor: '#519872',
    accentColor: '#a7c957',
    backgroundColor: '#f5f9f0',
    textColor: '#1b2a0f',
    fontFamily: 'Lato, sans-serif',
    borderRadius: '6px',
    shadowStyle: '0 2px 8px rgba(45,80,22,0.15)',
    gradientStyle: 'linear-gradient(135deg, #2d5016 0%, #519872 100%)',
    animationName: 'fadeIn',
  },
  {
    id: '5',
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
    id: '6',
    name: 'Corporate Blue',
    category: 'corporate',
    primaryColor: '#004e89',
    secondaryColor: '#1a659e',
    accentColor: '#5fa8d3',
    backgroundColor: '#ffffff',
    textColor: '#1c2541',
    fontFamily: 'Roboto, sans-serif',
    borderRadius: '8px',
    shadowStyle: '0 4px 12px rgba(0,78,137,0.15)',
    gradientStyle: 'linear-gradient(135deg, #004e89 0%, #1a659e 100%)',
    animationName: 'slideIn',
  },
  {
    id: '7',
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
  {
    id: '8',
    name: 'Glass Morphism',
    category: 'glassmorphism',
    primaryColor: '#ffffff',
    secondaryColor: '#f0f0f0',
    accentColor: '#6366f1',
    backgroundColor: '#e0e7ff',
    textColor: '#1e293b',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '16px',
    shadowStyle: '0 8px 32px rgba(99,102,241,0.1)',
    gradientStyle: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.8) 100%)',
    animationName: 'fadeIn',
  },
  {
    id: '9',
    name: 'Luxury Gold',
    category: 'luxury',
    primaryColor: '#d4af37',
    secondaryColor: '#aa8f3b',
    accentColor: '#ffd700',
    backgroundColor: '#1a1814',
    textColor: '#f5f5dc',
    fontFamily: 'Playfair Display, serif',
    borderRadius: '12px',
    shadowStyle: '0 8px 24px rgba(212,175,55,0.3)',
    gradientStyle: 'linear-gradient(135deg, #d4af37 0%, #aa8f3b 50%, #ffd700 100%)',
    animationName: 'shimmer',
  },
  {
    id: '10',
    name: 'Candy Pop',
    category: 'playful',
    primaryColor: '#ff6ec7',
    secondaryColor: '#ff9ff3',
    accentColor: '#ffc6ff',
    backgroundColor: '#fff0f9',
    textColor: '#4a154b',
    fontFamily: 'Quicksand, sans-serif',
    borderRadius: '24px',
    shadowStyle: '0 12px 24px rgba(255,110,199,0.25)',
    gradientStyle: 'linear-gradient(135deg, #ff6ec7 0%, #ff9ff3 50%, #ffc6ff 100%)',
    animationName: 'wiggle',
  },
];

export default function HomeClient() {
  const [styles, setStyles] = useState([]);
  const [filteredStyles, setFilteredStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewStyle, setPreviewStyle] = useState(null);

  const categories = [
    'all',
    'minimal',
    'bold',
    'gradient',
    'glassmorphism',
    'neumorphism',
    'retro',
    'neon',
    'luxury',
    'playful',
    'corporate',
  ];

  useEffect(() => {
    fetchStyles();
  }, []);

  useEffect(() => {
    filterStyles();
  }, [searchTerm, selectedCategory, styles]);

  const fetchStyles = async () => {
    // Use mock data directly to avoid any network errors
    setStyles(MOCK_STYLES);
    setLoading(false);
  };

  const filterStyles = () => {
    let filtered = styles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((style) => style.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((style) =>
        style.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStyles(filtered);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Sparkles className="w-16 h-16 text-violet-600 animate-pulse mx-auto mb-4" />
            <p className="text-slate-600">Loading styles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Discover Your Perfect Style
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Browse our curated collection of design styles. Favorite, remix, and export as WordPress themes.
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search styles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all capitalize ${
                selectedCategory === category
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-center mb-6">
        <p className="text-slate-600">
          Showing <span className="font-bold text-slate-900">{filteredStyles.length}</span> style
          {filteredStyles.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Styles Grid */}
      {filteredStyles.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredStyles.map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                onPreview={setPreviewStyle}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-20">
          <div className="text-slate-300 mb-4">
            <Sparkles size={64} className="mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-slate-400 mb-2">No styles found</h3>
          <p className="text-slate-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Preview Modal */}
      {previewStyle && (
        <StylePreview
          style={previewStyle}
          onClose={() => setPreviewStyle(null)}
        />
      )}
    </div>
  );
}