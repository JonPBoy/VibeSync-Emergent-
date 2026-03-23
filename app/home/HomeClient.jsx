'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured, isDatabaseReady, setDatabaseReady } from '@/lib/supabase';
import { MOCK_STYLES, CATEGORIES } from '@/lib/mockStyles';
import StyleCard from '../components/StyleCard';
import StylePreview from '../components/StylePreview';

export default function HomeClient() {
  const [styles, setStyles] = useState([]);
  const [filteredStyles, setFilteredStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewStyle, setPreviewStyle] = useState(null);

  const categories = CATEGORIES;

  useEffect(() => {
    fetchStyles();
  }, []);

  useEffect(() => {
    filterStyles();
  }, [searchTerm, selectedCategory, styles]);

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
          // Supabase fetch succeeded, mark database as ready
          setDatabaseReady(true);
          dbStyles = data;
        }
        // If error (like table not found PGRST205), we silently ignore it
        // No console.error - this is intentional to keep console clean
      } catch {
        // Silently catch any network or parsing errors
        // Fall back to mock data
      }
    }
    
    // Merge database styles with mock styles (DB styles first, then mock)
    // Avoid duplicates by checking IDs
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