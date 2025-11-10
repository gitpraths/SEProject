'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface BottomNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export interface BottomNavProps {
  items: BottomNavItem[];
}

export const BottomNav: React.FC<BottomNavProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav md:hidden" aria-label="Mobile navigation">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="w-6 h-6">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
