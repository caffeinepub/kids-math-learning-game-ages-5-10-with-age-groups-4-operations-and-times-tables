import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { FrontendDifficulty, DIFFICULTY_OPTIONS } from '../../game/difficulty';

interface DifficultySelectorProps {
  value: FrontendDifficulty;
  onChange: (difficulty: FrontendDifficulty) => void;
  className?: string;
}

export default function DifficultySelector({ value, onChange, className = '' }: DifficultySelectorProps) {
  return (
    <Card className={`border-4 border-primary/20 shadow-kid ${className}`}>
      <CardContent className="pt-8">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 text-foreground">
          Choose Your Difficulty
        </h3>
        <RadioGroup value={value} onValueChange={(v) => onChange(v as FrontendDifficulty)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DIFFICULTY_OPTIONS.map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={option.value}
                  className="flex flex-col items-center justify-center rounded-3xl border-4 border-muted bg-background p-6 hover:bg-accent hover:border-accent cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:scale-105"
                >
                  <span className="text-5xl mb-2">{option.emoji}</span>
                  <span className="text-xl md:text-2xl font-bold text-foreground mb-1">
                    {option.label}
                  </span>
                  <span className="text-sm md:text-base text-muted-foreground text-center">
                    {option.description}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
