'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import Navbar from '../components/Navbar';
import StyleCard from '../components/StyleCard';
import StylePreview from '../components/StylePreview';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewStyle, setPreviewStyle] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const favoriteIds = JSON.parse(localStorage.getItem('vibesync_favorites') || '[]');

      if (favoriteIds.length === 0 || !isSupabaseConfigured()) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('styles')
        .select('*')
        .in('id', favoriteIds);

      if (error) throw error;

      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh favorites when window regains focus
  useEffect(() => {
    const handleFocus = () => fetchFavorites();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

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
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Heart className="text-red-500 fill-red-500" size={48} />
            Your Favorites
          </h1>
          <p className="text-xl text-slate-600">
            {favorites.length > 0
              ? `You have ${favorites.length} favorite style${favorites.length !== 1 ? 's' : ''}`
              : 'Start favoriting styles to see them here'}
          </p>
        </motion.div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                onPreview={setPreviewStyle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              <Heart size={120} className="mx-auto text-slate-200 mb-6" />
              <h3 className="text-2xl font-bold text-slate-400 mb-4">
                No favorites yet
              </h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Explore styles and click the heart icon to save your favorites here.
              </p>
              <a
                href="/"
                className="inline-block px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Browse Styles
              </a>
            </motion.div>
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
    </>
  );
}