'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2, RefreshCw } from 'lucide-react';
import { MOCK_STYLES } from '@/lib/mockStyles';
import Navbar from '../components/Navbar';
import StyleCard from '../components/StyleCard';
import StylePreview from '../components/StylePreview';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewStyle, setPreviewStyle] = useState(null);

  const fetchFavorites = () => {
    try {
      // Get favorite IDs from localStorage
      const favoriteIds = JSON.parse(localStorage.getItem('vibesync_favorites') || '[]');
      
      // Get custom styles from localStorage
      const customStyles = JSON.parse(localStorage.getItem('vibesync_custom_styles') || '[]');
      
      // Combine mock styles and custom styles
      const allStyles = [...MOCK_STYLES, ...customStyles];
      
      // Filter to get only favorited styles
      const favoritedStyles = allStyles.filter(style => favoriteIds.includes(style.id));
      
      setFavorites(favoritedStyles);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Refresh favorites when window regains focus
  useEffect(() => {
    const handleFocus = () => fetchFavorites();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Listen for storage changes (when favorites are updated in other tabs/components)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'vibesync_favorites' || e.key === 'vibesync_custom_styles') {
        fetchFavorites();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const removeFromFavorites = (styleId) => {
    const favoriteIds = JSON.parse(localStorage.getItem('vibesync_favorites') || '[]');
    const updated = favoriteIds.filter(id => id !== styleId);
    localStorage.setItem('vibesync_favorites', JSON.stringify(updated));
    
    // Also remove from custom styles if it's a custom style
    const customStyles = JSON.parse(localStorage.getItem('vibesync_custom_styles') || '[]');
    const updatedCustom = customStyles.filter(style => style.id !== styleId);
    localStorage.setItem('vibesync_custom_styles', JSON.stringify(updatedCustom));
    
    fetchFavorites();
  };

  const clearAllFavorites = () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      localStorage.setItem('vibesync_favorites', '[]');
      localStorage.setItem('vibesync_custom_styles', '[]');
      fetchFavorites();
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Heart className="w-16 h-16 text-violet-600 animate-pulse mx-auto mb-4" />
              <p className="text-slate-600">Loading favorites...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

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
            <Heart className="text-red-500 fill-red-500" size={40} />
            Your Favorites
          </h1>
          <p className="text-lg text-slate-600">
            {favorites.length > 0
              ? `You have ${favorites.length} favorite style${favorites.length !== 1 ? 's' : ''}`
              : 'Start favoriting styles to see them here'}
          </p>
        </motion.div>

        {/* Actions Bar */}
        {favorites.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={fetchFavorites}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={clearAllFavorites}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((style) => (
              <motion.div
                key={style.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                <StyleCard
                  style={style}
                  onPreview={setPreviewStyle}
                />
                {/* Custom badge for user-created styles */}
                {style.category === 'custom' && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold rounded-full">
                    Custom
                  </div>
                )}
                {/* Quick remove button */}
                <button
                  onClick={() => removeFromFavorites(style.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove from favorites"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              <Heart size={100} className="mx-auto text-slate-200 mb-6" />
              <h3 className="text-2xl font-bold text-slate-400 mb-4">
                No favorites yet
              </h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Explore styles on the home page and click the heart icon to save your favorites. 
                You can also create custom styles in the Randomizer!
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Browse Styles
                </a>
                <a
                  href="/randomizer"
                  className="inline-block px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Create Custom Style
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Preview Modal */}
        {previewStyle && (
          <StylePreview
            style={previewStyle}
            onClose={() => setPreviewStyle(null)}
          />
        )}
      </div>
    </>
  );
}
