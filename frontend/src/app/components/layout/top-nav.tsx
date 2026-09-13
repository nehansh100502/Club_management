// Top Navigation Bar

import { Link, useNavigate } from 'react-router';
import { User, LogOut, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../lib/auth-context';
import { useState, useEffect, useRef } from 'react';

interface TopNavProps {
  onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showUserMenu) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      if (showUserMenu && userMenuRef.current?.contains(target)) return;
      setShowUserMenu(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [showUserMenu]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              SC
            </div>
            <span className="hidden font-bold sm:inline-block">
              Student Club Management
            </span>
            <span className="font-bold sm:hidden">SCM</span>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="User menu"
                type="button"
                onClick={() => setShowUserMenu(prev => !prev)}
              >
                <User className="h-5 w-5" />
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md z-50">
                  <div className="border-b px-3 py-2 text-sm font-medium">
                    <div className="flex flex-col">
                      <span className="font-semibold">{user?.name}</span>
                      <span className="text-xs font-normal text-muted-foreground truncate">
                        {user?.email}
                      </span>
                      <span className="mt-1 inline-block text-xs font-medium text-primary capitalize">
                        {user?.role?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                    >
                      <Link 
                        to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                        className="w-full text-left"
                      >
                        Dashboard
                      </Link>
                    </button>
                    <div className="my-1 h-px bg-border" />
                    <button
                      type="button"
                      className="flex w-full items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        navigate('/');
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
