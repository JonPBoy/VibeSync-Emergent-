// Export utilities for various formats

export const generateTailwindConfig = (style) => `// tailwind.config.js - ${style.name}
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${style.primaryColor}',
        secondary: '${style.secondaryColor}',
        accent: '${style.accentColor}',
        background: '${style.backgroundColor}',
        foreground: '${style.textColor}',
      },
      fontFamily: {
        sans: ['${style.fontFamily.split(',')[0]}', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '${style.borderRadius}',
      },
      boxShadow: {
        DEFAULT: '${style.shadowStyle}',
      },
    },
  },
}`;

export const generateSCSS = (style) => `// _variables.scss - ${style.name}
$primary: ${style.primaryColor};
$secondary: ${style.secondaryColor};
$accent: ${style.accentColor};
$background: ${style.backgroundColor};
$text: ${style.textColor};
$font-family: ${style.fontFamily};
$border-radius: ${style.borderRadius};
$shadow: ${style.shadowStyle};
$gradient: ${style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`};

@mixin button-primary {
  background: $gradient;
  color: white;
  padding: 12px 24px;
  border-radius: $border-radius;
  box-shadow: $shadow;
}

@mixin card {
  background: white;
  border-radius: $border-radius;
  box-shadow: $shadow;
  padding: 24px;
}`;

export const generateReactComponent = (style) => `// Button.jsx - ${style.name} Theme
import React from 'react';

const theme = {
  primary: '${style.primaryColor}',
  secondary: '${style.secondaryColor}',
  accent: '${style.accentColor}',
  background: '${style.backgroundColor}',
  text: '${style.textColor}',
  font: '${style.fontFamily}',
  radius: '${style.borderRadius}',
  shadow: '${style.shadowStyle}',
  gradient: '${style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`}',
};

export const Button = ({ children, variant = 'primary', ...props }) => {
  const styles = {
    primary: {
      background: theme.gradient,
      color: 'white',
      padding: '12px 24px',
      borderRadius: theme.radius,
      boxShadow: theme.shadow,
      border: 'none',
      fontFamily: theme.font,
      cursor: 'pointer',
    },
    secondary: {
      background: 'transparent',
      color: theme.primary,
      padding: '12px 24px',
      borderRadius: theme.radius,
      border: \`2px solid \${theme.primary}\`,
      fontFamily: theme.font,
      cursor: 'pointer',
    },
  };
  return <button style={styles[variant]} {...props}>{children}</button>;
};

export const Card = ({ children }) => (
  <div style={{
    background: 'white',
    borderRadius: theme.radius,
    boxShadow: theme.shadow,
    padding: '24px',
    fontFamily: theme.font,
  }}>{children}</div>
);

export default { Button, Card, theme };`;

export const generateVueComponent = (style) => `<!-- ThemeComponents.vue - ${style.name} -->
<template>
  <button :class="['btn', variant]" v-bind="$attrs"><slot /></button>
</template>

<script setup>
defineProps({ variant: { type: String, default: 'primary' } });
</script>

<style scoped>
:root {
  --primary: ${style.primaryColor};
  --secondary: ${style.secondaryColor};
  --accent: ${style.accentColor};
  --bg: ${style.backgroundColor};
  --text: ${style.textColor};
  --font: ${style.fontFamily};
  --radius: ${style.borderRadius};
  --shadow: ${style.shadowStyle};
  --gradient: ${style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`};
}
.btn {
  padding: 12px 24px;
  border-radius: var(--radius);
  font-family: var(--font);
  cursor: pointer;
  transition: transform 0.2s;
}
.btn:hover { transform: scale(1.02); }
.btn.primary {
  background: var(--gradient);
  color: white;
  border: none;
  box-shadow: var(--shadow);
}
.btn.secondary {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}
</style>`;

export const generateFigmaCSS = (style) => `/* Figma CSS - ${style.name} */
/* Primary Button */
background: ${style.gradientStyle || `linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor})`};
border-radius: ${style.borderRadius};
box-shadow: ${style.shadowStyle};

/* Text Styles */
font-family: ${style.fontFamily};
color: ${style.textColor};

/* Color Tokens */
--primary: ${style.primaryColor};
--secondary: ${style.secondaryColor};
--accent: ${style.accentColor};
--background: ${style.backgroundColor};
--text: ${style.textColor};`;

export const generateJSON = (style) => JSON.stringify({
  name: style.name,
  category: style.category,
  colors: {
    primary: style.primaryColor,
    secondary: style.secondaryColor,
    accent: style.accentColor,
    background: style.backgroundColor,
    text: style.textColor,
  },
  typography: { fontFamily: style.fontFamily },
  effects: {
    borderRadius: style.borderRadius,
    boxShadow: style.shadowStyle,
    gradient: style.gradientStyle,
  },
}, null, 2);

export const generateShareURL = (style) => {
  const data = btoa(JSON.stringify({
    n: style.name,
    c: style.category,
    p: style.primaryColor,
    s: style.secondaryColor,
    a: style.accentColor,
    b: style.backgroundColor,
    t: style.textColor,
    f: style.fontFamily,
    r: style.borderRadius,
    sh: style.shadowStyle,
    g: style.gradientStyle,
  }));
  return `${typeof window !== 'undefined' ? window.location.origin : ''}/share?style=${data}`;
};

export const parseShareURL = (data) => {
  try {
    const parsed = JSON.parse(atob(data));
    return {
      id: `shared-${Date.now()}`,
      name: parsed.n,
      category: parsed.c,
      primaryColor: parsed.p,
      secondaryColor: parsed.s,
      accentColor: parsed.a,
      backgroundColor: parsed.b,
      textColor: parsed.t,
      fontFamily: parsed.f,
      borderRadius: parsed.r,
      shadowStyle: parsed.sh,
      gradientStyle: parsed.g,
    };
  } catch { return null; }
};
