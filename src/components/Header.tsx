'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Logo from './icons/Logo';
import { Button } from './ui/button';
import { Settings, LogOut, Github } from 'lucide-react';
import SettingsDialog from './SettingsDialog';
import { useState } from 'react';
import { useUser } from '@/firebase';
import { GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';

export default function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, loading } = useUser();
  const auth = useAuth();

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 mr-8">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-xl font-semibold tracking-tight">ReadmeAI Builder</h1>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          {loading ? (
             <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setIsSettingsOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin}>
              <Github className="mr-2 h-5 w-5" />
              Login with GitHub
            </Button>
          )}
        </div>
      </div>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </header>
  );
}
