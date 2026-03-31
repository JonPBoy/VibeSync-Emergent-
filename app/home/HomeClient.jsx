'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Filter, X, Zap, Briefcase, Palette } from 'lucide-react';
import { supabase, isSupabaseConfigured, isDatabaseReady, setDatabaseReady } from '@/lib/supabase';
import { MOCK_STYLES, CATEGORIES } from '@/lib/mockStyles';
import { MOOD_TAGS, INDUSTRY_TAGS } from '@/lib/colorUtils';
import StyleCard from '../components/StyleCard';
import StylePreview from '../components/StylePreview';

// Map styles to mood/industry tags based on category and colors
const getStyleTags = (style) => {
  const tags = { moods: [], industries: [] };
  const cat = style.category?.toLowerCase() || '';
  
  // Mood tags based on category
  if (cat === 'bold' || cat === 'neon') tags.moods.push('Energetic', 'Bold');
  if (cat === 'minimal') tags.moods.push('Calm', 'Subtle', 'Modern');
  if (cat === 'luxury') tags.moods.push('Elegant', 'Professional');
  if (cat === 'playful') tags.moods.push('Playful', 'Warm');
  if (cat === 'retro') tags.moods.push('Vintage', 'Warm');
  if (cat === 'gradient' || cat === 'glassmorphism') tags.moods.push('Modern', 'Cool');
  if (cat === 'corporate') tags.moods.push('Professional', 'Subtle');
  if (cat === 'neumorphism') tags.moods.push('Calm', 'Modern');
  if (cat === 'dark') tags.moods.push('Modern', 'Bold', 'Cool', 'Elegant');
  
  // Industry tags based on category
  if (cat === 'corporate') tags.industries.push('Finance', 'Real Estate', 'Tech');
  if (cat === 'luxury') tags.industries.push('Fashion', 'Art', 'Entertainment');
  if (cat === 'playful') tags.industries.push('Education', 'Food', 'Entertainment');
  if (cat === 'minimal') tags.industries.push('Tech', 'Healthcare', 'E-commerce');
  if (cat === 'bold' || cat === 'neon') tags.industries.push('Sports', 'Entertainment', 'Tech');
  if (cat === 'gradient') tags.industries.push('Tech', 'Art', 'Fashion');
  if (cat === 'dark') tags.industries.push('Tech', 'Entertainment', 'Art', 'Fashion');
  
  return tags;
};

export default function HomeClient() {
  const [styles, setStyles] = useState([]);
  const [filteredStyles, setFilteredStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewStyle, setPreviewStyle] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);

  const categories = CATEGORIES;

  useEffect(() => {
    fetchStyles();
  }, []);

  useEffect(() => {
    filterStyles();
  }, [searchTerm, selectedCategory, styles, selectedMoods, selectedIndustries]);

  const fetchStyles = async () => {
    let dbStyles = [];
    
    // Try to fetch from Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('styles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setDatabaseReady(true);
          dbStyles = data;
        }
      } catch {
        // Silently catch errors
      }
    }
    
    const dbIds = new Set(dbStyles.map(s => s.id));
    const uniqueMockStyles = MOCK_STYLES.filter(s => !dbIds.has(s.id));
    const combinedStyles = [...dbStyles, ...uniqueMockStyles];
    
    setStyles(combinedStyles);
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

    // Filter by mood tags
    if (selectedMoods.length > 0) {
      filtered = filtered.filter((style) => {
        const tags = getStyleTags(style);
        return selectedMoods.some(mood => tags.moods.includes(mood));
      });
    }

    // Filter by industry tags
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((style) => {
        const tags = getStyleTags(style);
        return selectedIndustries.some(ind => tags.industries.includes(ind));
      });
    }

    setFilteredStyles(filtered);
  };

  const toggleMood = (mood) => {
    setSelectedMoods(prev => prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]);
  };

  const toggleIndustry = (ind) => {
    setSelectedIndustries(prev => prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]);
  };

  const clearAllFilters = () => {
    setSelectedMoods([]);
    setSelectedIndustries([]);
    setSelectedCategory('all');
    setSearchTerm('');
  };

  const activeFilterCount = selectedMoods.length + selectedIndustries.length + (selectedCategory !== 'all' ? 1 : 0);

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

        {/* Filter Toggle & Category */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
              showFilters || activeFilterCount > 0 ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Filter size={18} />
            Advanced {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
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

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 max-w-4xl mx-auto overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Advanced Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearAllFilters} className="text-sm text-violet-600 hover:underline flex items-center gap-1">
                    <X size={14} /> Clear all
                  </button>
                )}
              </div>

              {/* Mood Tags */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-amber-500" />
                  <span className="font-medium text-sm">Mood / Vibe</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {MOOD_TAGS.map(mood => (
                    <button
                      key={mood}
                      onClick={() => toggleMood(mood)}
                      className={`px-3 py-1.5 rounded-full text-sm transition ${
                        selectedMoods.includes(mood)
                          ? 'bg-amber-500 text-white'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry Tags */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={16} className="text-blue-500" />
                  <span className="font-medium text-sm">Industry</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRY_TAGS.map(ind => (
                    <button
                      key={ind}
                      onClick={() => toggleIndustry(ind)}
                      className={`px-3 py-1.5 rounded-full text-sm transition ${
                        selectedIndustries.includes(ind)
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="text-center mb-6">
        <p className="text-slate-600">
          Showing <span className="font-bold text-slate-900">{filteredStyles.length}</span> style
          {filteredStyles.length !== 1 ? 's' : ''}
          {activeFilterCount > 0 && <span className="text-violet-600"> (filtered)</span>}
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