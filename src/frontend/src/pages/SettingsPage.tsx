import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAgeGroup } from '../state/AgeGroupContext';
import { AGE_GROUPS } from '../state/ageGroup';
import Mascot from '../components/mascot/Mascot';
import PageShell from '../components/layout/PageShell';
import PageHeader from '../components/layout/PageHeader';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { selectedAgeGroup, setSelectedAgeGroup } = useAgeGroup();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <PageShell maxWidth="5xl">
      <PageHeader
        title="Settings"
        subtitle="Change your preferences here!"
        emoji="⚙️"
        mascot={<Mascot state="idle" className="w-48 h-48" />}
      />

      <div className="space-y-8">
        <Card className="border-4 border-primary/20 shadow-kid">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl text-foreground">Your Age Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {AGE_GROUPS.map((group) => (
                <Button
                  key={group.key}
                  size="lg"
                  variant={selectedAgeGroup === group.key ? 'default' : 'outline'}
                  onClick={() => setSelectedAgeGroup(group.key)}
                  className="h-auto py-8 flex flex-col gap-3"
                >
                  <span className="text-5xl">{group.emoji}</span>
                  <span className="text-xl md:text-2xl font-bold">{group.label}</span>
                  <span className="text-base md:text-lg">{group.ageRange}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 border-accent/20 shadow-kid">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl text-foreground">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xl md:text-2xl text-foreground">
              {isAuthenticated 
                ? 'You are logged in! Your progress is saved to the cloud.' 
                : 'Log in to save your progress across devices!'}
            </p>
            <Button
              onClick={handleAuth}
              disabled={disabled}
              size="lg"
              variant={isAuthenticated ? 'outline' : 'default'}
              className="text-xl md:text-2xl h-14 px-8"
            >
              {disabled ? 'Loading...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate({ to: '/' })}
            className="text-xl md:text-2xl h-14 px-8"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
