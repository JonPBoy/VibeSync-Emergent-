'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Shuffle, Heart, Plus, GitCompare, Folder, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const mainNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/randomizer', label: 'Randomizer', icon: Shuffle },
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/create', label: 'Create', icon: Plus },
  ];

  const moreNavItems = [
    { href: '/compare', label: 'Compare', icon: GitCompare },
    { href: '/collections', label: 'Collections', icon: Folder },
    { href: '/history', label: 'History', icon: Clock },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <ul className="flex gap-2 py-3 items-center">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium hidden sm:inline">{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="relative">
            <button
              onClick={() => setShowMore(!showMore)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                moreNavItems.some(i => pathname === i.href)
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span className="font-medium">More</span>
              <ChevronDown size={16} className={`transition-transform ${showMore ? 'rotate-180' : ''}`} />
            </button>
            {showMore && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 py-2 min-w-[160px]">
                {moreNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMore(false)}
                      className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                        isActive ? 'bg-violet-50 text-violet-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}