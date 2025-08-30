'use client';

import React from 'react';
import { MobileNav } from '@/components/ui/mobile-nav';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, GraduationCap } from 'lucide-react';
import { LocalStorageService } from '@/lib/local-storage';

export function Header() {
  const userProfile = LocalStorageService.getUserProfile();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center space-x-4">
        <MobileNav />
        <div className="hidden md:flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">SınıfPlanım</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userProfile?.profileImage} alt={userProfile?.name} />
                <AvatarFallback>
                  {userProfile?.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'Ö'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">
                {userProfile?.name || 'Öğretmen'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {userProfile?.branch || 'Branş'}
              </p>
            </div>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Çıkış Yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}