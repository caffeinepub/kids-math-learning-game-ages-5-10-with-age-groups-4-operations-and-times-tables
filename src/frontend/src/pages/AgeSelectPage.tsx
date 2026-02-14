import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAgeGroup } from '../state/AgeGroupContext';
import { AGE_GROUPS } from '../state/ageGroup';
import Mascot from '../components/mascot/Mascot';
import PageShell from '../components/layout/PageShell';
import PageHeader from '../components/layout/PageHeader';

export default function AgeSelectPage() {
  const navigate = useNavigate();
  const { setSelectedAgeGroup } = useAgeGroup();

  const handleAgeGroupSelect = (key: 'fiveSix' | 'sevenEight' | 'nineTen') => {
    setSelectedAgeGroup(key);
    navigate({ to: '/activity-select' });
  };

  return (
    <PageShell maxWidth="5xl">
      <PageHeader
        title="How old are you?"
        subtitle="Pick your age group so we can give you the right challenges!"
        emoji="🎂"
        mascot={<Mascot state="idle" className="w-48 h-48" />}
      />

      <div className="grid md:grid-cols-3 gap-8">
        {AGE_GROUPS.map((group) => (
          <Card
            key={group.key}
            className="border-4 border-primary/20 shadow-kid hover:shadow-xl transition-all cursor-pointer hover:scale-105 bg-card"
            onClick={() => handleAgeGroupSelect(group.key)}
          >
            <CardHeader className="space-y-6">
              <div className="text-7xl text-center">{group.emoji}</div>
              <CardTitle className="text-3xl md:text-4xl text-center">{group.label}</CardTitle>
              <CardDescription className="text-xl md:text-2xl text-center font-normal">
                {group.ageRange}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg md:text-xl text-center font-normal">
                {group.description}
              </p>
              <Button 
                size="lg" 
                className="w-full text-xl md:text-2xl h-14"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAgeGroupSelect(group.key);
                }}
              >
                Choose {group.label}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
