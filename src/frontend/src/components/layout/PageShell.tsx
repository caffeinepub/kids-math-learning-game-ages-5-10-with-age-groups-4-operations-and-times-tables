import React, { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
}

export default function PageShell({ children, maxWidth = '4xl' }: PageShellProps) {
  const maxWidthClass = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
  }[maxWidth];

  return (
    <div className={`${maxWidthClass} mx-auto space-y-12`}>
      {children}
    </div>
  );
}
