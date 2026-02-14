import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { HelpTopic } from './helpTopics';
import { PlayCircle } from 'lucide-react';

interface HelpVideoCardProps {
  topic: HelpTopic;
}

export default function HelpVideoCard({ topic }: HelpVideoCardProps) {
  const [videoError, setVideoError] = useState(false);

  return (
    <Card className="border-4 border-primary/20 shadow-kid">
      <CardHeader>
        <CardTitle className="text-3xl flex items-center gap-3">
          <span className="text-4xl">{topic.emoji}</span>
          {topic.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!videoError ? (
          <div className="relative rounded-2xl overflow-hidden bg-muted">
            <video
              controls
              className="w-full"
              onError={() => setVideoError(true)}
            >
              <source src={topic.videoFile} type="video/mp4" />
              Your browser does not support video playback.
            </video>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <PlayCircle className="w-16 h-16 text-primary/50" />
            </div>
          </div>
        ) : (
          <div className="bg-accent/10 rounded-2xl p-6 border-2 border-accent/30">
            <p className="text-xl leading-relaxed text-foreground">
              {topic.fallbackText}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
