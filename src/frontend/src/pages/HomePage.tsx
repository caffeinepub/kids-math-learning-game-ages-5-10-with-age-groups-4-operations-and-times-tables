import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import Mascot from '../components/mascot/Mascot';
import PageShell from '../components/layout/PageShell';
import PageHeader from '../components/layout/PageHeader';
import { useAgeGroup } from '../state/AgeGroupContext';
import { Calculator, BookOpen, HelpCircle, Trophy } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { selectedAgeGroup } = useAgeGroup();

  const handlePlayClick = () => {
    if (selectedAgeGroup) {
      navigate({ to: '/activity-select' });
    } else {
      navigate({ to: '/age-select' });
    }
  };

  const menuItems = [
    {
      title: 'Play Math Games',
      description: 'Practice addition, subtraction, multiplication, and division!',
      icon: Calculator,
      color: 'bg-primary',
      onClick: handlePlayClick
    },
    {
      title: 'Times Tables',
      description: 'Learn and practice your times tables!',
      icon: BookOpen,
      color: 'bg-accent',
      onClick: () => {
        if (selectedAgeGroup) {
          navigate({ to: '/times-tables' });
        } else {
          navigate({ to: '/age-select' });
        }
      }
    },
    {
      title: 'Help & Videos',
      description: 'Watch helpful videos to learn math!',
      icon: HelpCircle,
      color: 'bg-secondary',
      onClick: () => navigate({ to: '/help' })
    },
    {
      title: 'My Progress',
      description: 'See your stars and achievements!',
      icon: Trophy,
      color: 'bg-warning',
      onClick: () => navigate({ to: '/progress' })
    }
  ];

  return (
    <PageShell maxWidth="6xl">
      <PageHeader
        title="Welcome to Math Adventure!"
        subtitle="Let's make math fun and exciting!"
        emoji="🎉"
        mascot={<Mascot state="idle" className="w-56 h-56" />}
      />

      <div className="grid md:grid-cols-2 gap-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card 
              key={item.title}
              className="border-4 border-primary/20 shadow-kid hover:shadow-xl transition-all cursor-pointer hover:scale-105"
              onClick={item.onClick}
            >
              <CardHeader className="space-y-6">
                <div className={`${item.color} w-20 h-20 rounded-3xl flex items-center justify-center`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl md:text-4xl text-foreground">{item.title}</CardTitle>
                <CardDescription className="text-xl md:text-2xl text-foreground">{item.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {!selectedAgeGroup && (
        <Card className="border-4 border-warning/40 shadow-kid bg-card">
          <CardContent className="pt-8">
            <div className="flex items-center gap-6">
              <span className="text-5xl">👋</span>
              <div className="flex-1">
                <p className="text-2xl font-bold mb-3 text-foreground">First time here?</p>
                <p className="text-xl text-foreground mb-6">
                  Let's pick your age group to get started!
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate({ to: '/age-select' })}
                  className="text-2xl h-14 px-8"
                >
                  Choose Age Group
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
