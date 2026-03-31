'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseShareURL } from '@/lib/exportUtils';
import StylePreview from '../components/StylePreview';
import Link from 'next/link';

function ShareContent() {
  const searchParams = useSearchParams();
  const [style, setStyle] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const data = searchParams.get('style');
    if (data) {
      const parsed = parseShareURL(data);
      if (parsed) setStyle(parsed);
      else setError(true);
    } else {
      setError(true);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Share Link</h1>
          <p className="text-slate-500 mb-4">This style link is invalid or expired.</p>
          <Link href="/" className="text-violet-600 hover:underline">Browse all styles →</Link>
        </div>
      </div>
    );
  }

  if (!style) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Shared Style: {style.name}</h1>
          <p className="text-slate-500">Someone shared this style with you via VibeSync</p>
        </div>
        <StylePreview style={style} onClose={() => window.location.href = '/'} />
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" /></div>}>
      <ShareContent />
    </Suspense>
  );
}
