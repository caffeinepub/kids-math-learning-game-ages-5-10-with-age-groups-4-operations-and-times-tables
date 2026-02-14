import React, { ReactNode } from 'react';
import MainNav from '../nav/MainNav';
import SelectedAgeBadge from './SelectedAgeBadge';

interface KidLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export default function KidLayout({ children, showNav = true }: KidLayoutProps) {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background via-primary/8 to-secondary/8"
      style={{
        backgroundImage: 'url(/assets/generated/kids-bg.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'soft-light'
      }}
    >
      {showNav && <MainNav />}
      <SelectedAgeBadge />
      <main className="container mx-auto px-6 py-12">
        {children}
      </main>
      <footer className="py-8 text-center text-sm text-foreground">
        <p>© {new Date().getFullYear()} Built with ❤️ using{' '}
          <a 
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
