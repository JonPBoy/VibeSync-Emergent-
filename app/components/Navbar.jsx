'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Shuffle, Heart, Plus } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/randomizer', label: 'Randomizer', icon: Shuffle },
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/create', label: 'Create', icon: Plus },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <ul className="flex gap-2 py-3">
          {navItems.map((item) => {
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
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}