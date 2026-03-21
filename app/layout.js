import './globals.css';

export const metadata = {
  title: 'VibeSync - Visual Inspiration Library',
  description: 'Browse, remix, and export beautiful design styles',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">VibeSync</h1>
                  <p className="text-sm text-violet-100">Visual Inspiration Library</p>
                </div>
              </div>
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