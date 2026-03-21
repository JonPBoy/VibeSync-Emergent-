-- VibeSync Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create styles table
CREATE TABLE IF NOT EXISTS public.styles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  "primaryColor" TEXT NOT NULL,
  "secondaryColor" TEXT NOT NULL,
  "accentColor" TEXT NOT NULL,
  "backgroundColor" TEXT NOT NULL,
  "textColor" TEXT NOT NULL,
  "fontFamily" TEXT NOT NULL,
  "borderRadius" TEXT NOT NULL,
  "shadowStyle" TEXT NOT NULL,
  "gradientStyle" TEXT,
  "animationName" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.styles
  FOR SELECT
  USING (true);

-- Create policy to allow public insert access
CREATE POLICY "Allow public insert access" ON public.styles
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public update access
CREATE POLICY "Allow public update access" ON public.styles
  FOR UPDATE
  USING (true);

-- Create policy to allow public delete access
CREATE POLICY "Allow public delete access" ON public.styles
  FOR DELETE
  USING (true);

-- Insert sample styles
INSERT INTO public.styles (name, category, "primaryColor", "secondaryColor", "accentColor", "backgroundColor", "textColor", "fontFamily", "borderRadius", "shadowStyle", "gradientStyle", "animationName") VALUES
('Midnight Elegance', 'minimal', '#1a1a2e', '#16213e', '#0f3460', '#f5f5f5', '#1a1a2e', 'Inter, sans-serif', '8px', '0 4px 6px rgba(0,0,0,0.1)', 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 'fadeIn'),
('Ocean Breeze', 'gradient', '#0077be', '#00a8e8', '#00ff9f', '#f0f9ff', '#1e3a5f', 'Poppins, sans-serif', '16px', '0 8px 16px rgba(0,119,190,0.2)', 'linear-gradient(135deg, #0077be 0%, #00a8e8 50%, #00ff9f 100%)', 'slideUp'),
('Sunset Glow', 'bold', '#ff6b6b', '#ee5a6f', '#feca57', '#fff5f5', '#2d3436', 'Montserrat, sans-serif', '12px', '0 10px 20px rgba(255,107,107,0.3)', 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #feca57 100%)', 'pulse'),
('Forest Whisper', 'minimal', '#2d5016', '#519872', '#a7c957', '#f5f9f0', '#1b2a0f', 'Lato, sans-serif', '6px', '0 2px 8px rgba(45,80,22,0.15)', 'linear-gradient(135deg, #2d5016 0%, #519872 100%)', 'fadeIn'),
('Neon Dreams', 'neon', '#ff006e', '#8338ec', '#3a86ff', '#0d1b2a', '#ffffff', 'Rajdhani, sans-serif', '4px', '0 0 20px rgba(255,0,110,0.5), 0 0 40px rgba(131,56,236,0.3)', 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)', 'glow'),
('Corporate Blue', 'corporate', '#004e89', '#1a659e', '#5fa8d3', '#ffffff', '#1c2541', 'Roboto, sans-serif', '8px', '0 4px 12px rgba(0,78,137,0.15)', 'linear-gradient(135deg, #004e89 0%, #1a659e 100%)', 'slideIn'),
('Retro Vibes', 'retro', '#ff9f1c', '#ff6f59', '#ffbf69', '#fcf5e5', '#4a4a4a', 'Courier New, monospace', '20px', '8px 8px 0 rgba(0,0,0,0.2)', 'linear-gradient(135deg, #ff9f1c 0%, #ff6f59 100%)', 'bounce'),
('Glass Morphism', 'glassmorphism', '#ffffff', '#f0f0f0', '#6366f1', '#e0e7ff', '#1e293b', 'Inter, sans-serif', '16px', '0 8px 32px rgba(99,102,241,0.1)', 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.8) 100%)', 'fadeIn'),
('Luxury Gold', 'luxury', '#d4af37', '#aa8f3b', '#ffd700', '#1a1814', '#f5f5dc', 'Playfair Display, serif', '12px', '0 8px 24px rgba(212,175,55,0.3)', 'linear-gradient(135deg, #d4af37 0%, #aa8f3b 50%, #ffd700 100%)', 'shimmer'),
('Candy Pop', 'playful', '#ff6ec7', '#ff9ff3', '#ffc6ff', '#fff0f9', '#4a154b', 'Quicksand, sans-serif', '24px', '0 12px 24px rgba(255,110,199,0.25)', 'linear-gradient(135deg, #ff6ec7 0%, #ff9ff3 50%, #ffc6ff 100%)', 'wiggle');