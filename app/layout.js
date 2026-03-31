import './globals.css';
import Link from 'next/link';
import VibeSyncLogo from './components/VibeSyncLogo';

export const metadata = {
  title: 'VibeSync - Visual Inspiration Library',
  description: 'Browse, remix, and export beautiful design styles',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts - Sans Serif */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600;700&family=Lato:wght@400;700&family=Poppins:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Nunito:wght@400;600;700&family=Work+Sans:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        {/* Google Fonts - Serif */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Lora:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Crimson+Text:wght@400;600;700&family=EB+Garamond:wght@400;500;600;700&family=Spectral:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        {/* Google Fonts - Display */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;500;600;700&family=Anton&family=Archivo+Black&family=Alfa+Slab+One&family=Righteous&family=Bungee&family=Russo+One&family=Teko:wght@400;500;600;700&family=Fjalla+One&display=swap" 
          rel="stylesheet" 
        />
        {/* Google Fonts - Monospace */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        {/* Google Fonts - Handwriting */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Pacifico&family=Dancing+Script:wght@400;500;600;700&family=Satisfy&family=Caveat:wght@400;500;600;700&family=Indie+Flower&family=Patrick+Hand&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3">
              <Link href="/" className="flex items-center gap-3 w-fit hover:opacity-90 transition-opacity">
                <VibeSyncLogo size={40} />
                <div>
                  <h1 className="text-xl font-bold leading-tight">VibeSync</h1>
                  <p className="text-xs text-violet-200">Visual Inspiration Library</p>
                </div>
              </Link>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-slate-900 text-slate-300 py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; 2025 VibeSync. Crafted with ❤️ for designers.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}