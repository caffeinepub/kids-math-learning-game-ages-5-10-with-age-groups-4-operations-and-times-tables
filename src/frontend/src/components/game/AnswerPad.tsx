import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Delete, Check } from 'lucide-react';

interface AnswerPadProps {
  onSubmit: (answer: number) => void;
  disabled?: boolean;
}

export default function AnswerPad({ onSubmit, disabled = false }: AnswerPadProps) {
  const [value, setValue] = useState('');

  const handleNumberClick = (num: string) => {
    if (disabled) return;
    setValue(prev => prev + num);
  };

  const handleClear = () => {
    setValue('');
  };

  const handleSubmit = () => {
    if (value && !disabled) {
      onSubmit(parseInt(value, 10));
      setValue('');
    }
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-3xl p-6 shadow-kid border-4 border-primary/20">
        <div className="bg-muted rounded-2xl p-6 mb-6 min-h-[80px] flex items-center justify-center">
          <span className="text-5xl font-bold text-foreground">
            {value || '?'}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {numbers.map((num) => (
            <Button
              key={num}
              onClick={() => handleNumberClick(num)}
              disabled={disabled}
              size="lg"
              variant="secondary"
              className="h-16 text-3xl font-bold rounded-2xl"
            >
              {num}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleClear}
            disabled={disabled}
            size="lg"
            variant="outline"
            className="h-16 text-xl font-bold rounded-2xl"
          >
            <Delete className="w-6 h-6 mr-2" />
            Clear
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={disabled || !value}
            size="lg"
            className="h-16 text-xl font-bold rounded-2xl bg-success hover:bg-success/90"
          >
            <Check className="w-6 h-6 mr-2" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
