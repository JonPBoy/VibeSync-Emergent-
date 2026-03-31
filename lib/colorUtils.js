// Color utility functions for palette generation

export const hexToHsl = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

export const hslToHex = (h, s, l) => {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const generatePalette = (baseColor) => {
  const hsl = hexToHsl(baseColor);
  return {
    primary: baseColor,
    secondary: hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
    accent: hslToHex((hsl.h + 180) % 360, Math.min(hsl.s + 20, 100), hsl.l),
    background: hslToHex(hsl.h, Math.max(hsl.s - 60, 5), 97),
    text: hslToHex(hsl.h, Math.max(hsl.s - 50, 10), 15),
    complementary: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
    triadic1: hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    triadic2: hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
    analogous1: hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
    analogous2: hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
    lighter: hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 95)),
    darker: hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 10)),
  };
};

export const MOOD_TAGS = ['Energetic', 'Calm', 'Professional', 'Playful', 'Elegant', 'Modern', 'Vintage', 'Bold', 'Subtle', 'Warm', 'Cool', 'Natural'];
export const INDUSTRY_TAGS = ['Tech', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Food', 'Fashion', 'Travel', 'Real Estate', 'Entertainment', 'Sports', 'Art'];
