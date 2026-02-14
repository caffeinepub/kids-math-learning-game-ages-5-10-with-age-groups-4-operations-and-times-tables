import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  mascot?: ReactNode;
  emoji?: string;
}

export default function PageHeader({ title, subtitle, mascot, emoji }: PageHeaderProps) {
  return (
    <div className="text-center space-y-8">
      {mascot && (
        <div className="flex justify-center">
          {mascot}
        </div>
      )}
      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground">
          {title} {emoji}
        </h1>
        {subtitle && (
          <p className="text-2xl md:text-3xl text-muted-foreground font-normal">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
