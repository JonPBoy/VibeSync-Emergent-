'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function CreatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'minimal',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    accentColor: '#ec4899',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '12px',
    shadowStyle: '0 4px 6px rgba(0,0,0,0.1)',
    gradientStyle: '',
    animationName: 'fadeIn',
  });

  const categories = [
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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Cannot save style.');
      return;
    }

    if (!formData.name.trim()) {
      alert('Please enter a style name');
      return;
    }

    try {
      setSaving(true);

      // Auto-generate gradient if not provided
      const finalData = {
        ...formData,
        gradientStyle:
          formData.gradientStyle ||
          `linear-gradient(135deg, ${formData.primaryColor} 0%, ${formData.secondaryColor} 100%)`,
      };

      const { error } = await supabase.from('styles').insert([finalData]);

      if (error) throw error;

      alert('Style created successfully! 🎉');
      router.push('/');
    } catch (error) {
      console.error('Error creating style:', error);
      alert('Failed to create style. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
            <Sparkles className="text-violet-600" size={48} />
            Create Your Style
          </h1>
          <p className="text-xl text-slate-600">
            Design a unique style and see it come to life in real-time
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Style Properties</h2>

                {/* Name */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Style Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Ocean Sunset"
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                    required
                  />
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all capitalize"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="capitalize">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Colors */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Colors</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'primaryColor', label: 'Primary' },
                      { key: 'secondaryColor', label: 'Secondary' },
                      { key: 'accentColor', label: 'Accent' },
                      { key: 'backgroundColor', label: 'Background' },
                      { key: 'textColor', label: 'Text' },
                    ].map((color) => (
                      <div key={color.key}>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          {color.label}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={formData[color.key]}
                            onChange={(e) => handleChange(color.key, e.target.value)}
                            className="w-16 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData[color.key]}
                            onChange={(e) => handleChange(color.key, e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-violet-500 outline-none text-sm font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Font Family
                  </label>
                  <input
                    type="text"
                    value={formData.fontFamily}
                    onChange={(e) => handleChange('fontFamily', e.target.value)}
                    placeholder="e.g., Inter, sans-serif"
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  />
                </div>

                {/* Border Radius */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Border Radius
                  </label>
                  <input
                    type="text"
                    value={formData.borderRadius}
                    onChange={(e) => handleChange('borderRadius', e.target.value)}
                    placeholder="e.g., 12px"
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  />
                </div>

                {/* Shadow */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Shadow Style
                  </label>
                  <input
                    type="text"
                    value={formData.shadowStyle}
                    onChange={(e) => handleChange('shadowStyle', e.target.value)}
                    placeholder="e.g., 0 4px 6px rgba(0,0,0,0.1)"
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  />
                </div>

                {/* Gradient (Optional) */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Custom Gradient (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.gradientStyle}
                    onChange={(e) => handleChange('gradientStyle', e.target.value)}
                    placeholder="e.g., linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Leave empty to auto-generate from primary and secondary colors
                  </p>
                </div>

                {/* Animation */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Animation Name
                  </label>
                  <input
                    type="text"
                    value={formData.animationName}
                    onChange={(e) => handleChange('animationName', e.target.value)}
                    placeholder="e.g., fadeIn, slideUp"
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving || !isSupabaseConfigured()}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 text-white font-bold text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={24} />
                  {saving ? 'Creating...' : 'Create Style'}
                </button>

                {!isSupabaseConfigured() && (
                  <p className="text-sm text-red-600 mt-2 text-center">
                    ⚠️ Supabase not configured. Please setup database first.
                  </p>
                )}
              </div>
            </div>

            {/* Live Preview */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Live Preview</h2>
                <motion.div
                  key={JSON.stringify(formData)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Hero Preview */}
                  <div
                    className="rounded-2xl p-8 min-h-[350px] flex flex-col items-center justify-center text-center"
                    style={{
                      background:
                        formData.gradientStyle ||
                        `linear-gradient(135deg, ${formData.primaryColor} 0%, ${formData.secondaryColor} 100%)`,
                      fontFamily: formData.fontFamily,
                    }}
                  >
                    <h3 className="text-3xl font-bold mb-4" style={{ color: '#ffffff' }}>
                      {formData.name || 'Your Style Name'}
                    </h3>
                    <p className="text-lg mb-6" style={{ color: 'rgba(255,255,255,0.9)' }}>
                      This is how your style will look
                    </p>
                    <button
                      className="px-6 py-3 font-semibold text-white"
                      style={{
                        backgroundColor: formData.accentColor,
                        borderRadius: formData.borderRadius,
                        boxShadow: formData.shadowStyle,
                      }}
                    >
                      Sample Button
                    </button>
                  </div>

                  {/* Card Preview */}
                  <div
                    className="p-6"
                    style={{
                      backgroundColor: formData.backgroundColor,
                      borderRadius: formData.borderRadius,
                      boxShadow: formData.shadowStyle,
                      fontFamily: formData.fontFamily,
                    }}
                  >
                    <h4
                      className="text-xl font-bold mb-2"
                      style={{ color: formData.primaryColor }}
                    >
                      Card Title
                    </h4>
                    <p className="mb-4" style={{ color: formData.textColor }}>
                      This is sample text content showing how your text color looks on the
                      background.
                    </p>
                    <button
                      className="px-4 py-2 font-medium text-white"
                      style={{
                        backgroundColor: formData.accentColor,
                        borderRadius: formData.borderRadius,
                      }}
                    >
                      Action
                    </button>
                  </div>

                  {/* Color Swatches */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Color Palette</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { color: formData.primaryColor, label: 'Primary' },
                        { color: formData.secondaryColor, label: 'Secondary' },
                        { color: formData.accentColor, label: 'Accent' },
                        { color: formData.backgroundColor, label: 'BG' },
                        { color: formData.textColor, label: 'Text' },
                      ].map((item, idx) => (
                        <div key={idx} className="text-center">
                          <div
                            className="h-16 rounded-lg border-2 border-slate-200 mb-1"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs text-slate-600 font-medium">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
