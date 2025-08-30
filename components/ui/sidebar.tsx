'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart3,
  FileText,
  StickyNote,
  Settings,
  GraduationCap
} from 'lucide-react';

const navigation = [
  {
    name: 'Ana Sayfa',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Sınıflarım',
    href: '/siniflarim',
    icon: Users,
  },
  {
    name: 'Günlük Takip',
    href: '/gunluk-takip',
    icon: ClipboardCheck,
  },
  {
    name: 'Raporlar',
    href: '/raporlar',
    icon: BarChart3,
  },
  {
    name: 'Planlarım',
    href: '/planlarim',
    icon: FileText,
  },
  {
    name: 'Notlarım',
    href: '/notlarim',
    icon: StickyNote,
  },
  {
    name: 'Ayarlar',
    href: '/ayarlar',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">SınıfPlanım</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn(
                'mr-3 h-5 w-5',
                isActive ? 'text-blue-600' : 'text-gray-400'
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}