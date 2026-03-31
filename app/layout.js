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
        {/* Google Fonts Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Sans Serif Fonts - Modern & Clean */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500;700;900&family=Open+Sans:wght@300;400;600;700;800&family=Lato:wght@300;400;700;900&family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700;800;900&family=Nunito:wght@300;400;600;700;800&family=Work+Sans:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Sora:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Figtree:wght@300;400;500;600;700;800&family=Lexend:wght@300;400;500;600;700;800&family=Urbanist:wght@300;400;500;600;700;800&family=Karla:wght@300;400;500;600;700;800&family=Rubik:wght@300;400;500;600;700;800&family=Quicksand:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700;800&family=Source+Sans+3:wght@300;400;500;600;700;800&family=Josefin+Sans:wght@300;400;500;600;700&family=Mulish:wght@300;400;500;600;700;800&family=Barlow:wght@300;400;500;600;700;800&family=Exo+2:wght@300;400;500;600;700;800&family=Titillium+Web:wght@300;400;600;700&family=Archivo:wght@300;400;500;600;700;800&family=Cabin:wght@400;500;600;700&family=Catamaran:wght@300;400;500;600;700;800&family=Maven+Pro:wght@400;500;600;700;800&family=Questrial&family=Varela+Round&family=Comfortaa:wght@300;400;500;600;700&family=Overpass:wght@300;400;500;600;700;800&family=Hind:wght@300;400;500;600;700&family=Asap:wght@400;500;600;700&family=Signika:wght@300;400;500;600;700&family=Red+Hat+Display:wght@300;400;500;600;700;800&family=Albert+Sans:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Serif Fonts - Elegant & Classic */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&family=Lora:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Crimson+Text:wght@400;600;700&family=EB+Garamond:wght@400;500;600;700;800&family=Spectral:wght@300;400;500;600;700;800&family=Bitter:wght@300;400;500;600;700;800&family=Vollkorn:wght@400;500;600;700;800;900&family=Noto+Serif:wght@400;500;600;700&family=PT+Serif:wght@400;700&family=Source+Serif+4:wght@300;400;500;600;700;800&family=Fraunces:wght@300;400;500;600;700;800;900&family=Cardo:wght@400;700&family=Literata:wght@300;400;500;600;700;800&family=Newsreader:wght@300;400;500;600;700;800&family=DM+Serif+Display&family=DM+Serif+Text&family=Abril+Fatface&family=Bodoni+Moda:wght@400;500;600;700;800;900&family=Cormorant:wght@300;400;500;600;700&family=Libre+Caslon+Text:wght@400;700&family=Old+Standard+TT:wght@400;700&family=Coustard:wght@400;900&family=Sorts+Mill+Goudy&family=Gilda+Display&family=Oranienbaum&family=Forum&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Display Fonts - Bold & Impactful */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@300;400;500;600;700&family=Anton&family=Archivo+Black&family=Alfa+Slab+One&family=Righteous&family=Bungee&family=Russo+One&family=Teko:wght@300;400;500;600;700&family=Fjalla+One&family=Black+Ops+One&family=Bowlby+One+SC&family=Passion+One:wght@400;700;900&family=Staatliches&family=Monoton&family=Ultra&family=Bungee+Shade&family=Titan+One&family=Fredoka:wght@300;400;500;600;700&family=Lilita+One&family=Luckiest+Guy&family=Permanent+Marker&family=Bangers&family=Lobster&family=Pacifico&family=Comforter+Brush&family=Amatic+SC:wght@400;700&family=Shadows+Into+Light&family=Kaushan+Script&family=Sacramento&family=Great+Vibes&family=Yellowtail&family=Rock+Salt&family=Architects+Daughter&family=Handlee&family=Reenie+Beanie&family=Homemade+Apple&family=Just+Another+Hand&family=Caveat:wght@400;500;600;700&family=Patrick+Hand&family=Indie+Flower&family=Gloria+Hallelujah&family=Satisfy&family=Cookie&family=Courgette&family=Kalam:wght@300;400;700&family=Neucha&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Monospace & Technical Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700;800&family=Source+Code+Pro:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&family=Ubuntu+Mono:wght@400;700&family=Inconsolata:wght@300;400;500;600;700;800&family=Anonymous+Pro:wght@400;700&family=Courier+Prime:wght@400;700&family=Overpass+Mono:wght@300;400;500;600;700&family=Red+Hat+Mono:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />

        {/* Unique & Artistic Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cinzel+Decorative:wght@400;700;900&family=Marcellus&family=Philosopher:wght@400;700&family=Yeseva+One&family=Poiret+One&family=Julius+Sans+One&family=Syncopate:wght@400;700&family=Major+Mono+Display&family=Megrim&family=Orbitron:wght@400;500;600;700;800;900&family=Audiowide&family=Michroma&family=Electrolize&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&family=Chakra+Petch:wght@300;400;500;600;700&family=Jura:wght@300;400;500;600;700&family=Oxanium:wght@300;400;500;600;700;800&family=Press+Start+2P&family=VT323&family=Silkscreen:wght@400;700&family=Pixelify+Sans:wght@400;500;600;700&display=swap" 
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