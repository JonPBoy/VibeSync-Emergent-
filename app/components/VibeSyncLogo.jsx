// Pulse Ring Logo - VibeSync Brand Logo
// Concentric rings representing sync and harmony, with energy radiating outward

export default function VibeSyncLogo({ size = 32, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="vibeSyncGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" stroke="url(#vibeSyncGrad)" strokeWidth="3" fill="none" />
      <circle cx="24" cy="24" r="15" stroke="url(#vibeSyncGrad)" strokeWidth="2.5" fill="none" opacity="0.7" />
      <circle cx="24" cy="24" r="8" fill="url(#vibeSyncGrad)" />
      <path d="M20 24H28M24 20V28" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Small variant for tight spaces
export function VibeSyncLogoSmall({ size = 24 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="vibeSyncGradSm" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="20" stroke="url(#vibeSyncGradSm)" strokeWidth="4" fill="none" />
      <circle cx="24" cy="24" r="10" fill="url(#vibeSyncGradSm)" />
      <path d="M20 24H28M24 20V28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
