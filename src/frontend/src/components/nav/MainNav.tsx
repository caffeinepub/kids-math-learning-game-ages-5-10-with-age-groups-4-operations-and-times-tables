import React from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '../ui/button';
import { Home, BookOpen, HelpCircle, Trophy, Settings } from 'lucide-react';

export default function MainNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/times-tables', label: 'Times Tables', icon: BookOpen },
    { path: '/help', label: 'Help', icon: HelpCircle },
    { path: '/progress', label: 'Progress', icon: Trophy },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b-4 border-primary/20 sticky top-0 z-50 shadow-kid">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            🎓 Math Adventure
          </h1>
          <div className="flex gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate({ to: item.path })}
                  variant={isActive ? 'default' : 'ghost'}
                  size="lg"
                  className="hidden md:flex gap-2 text-foreground"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
