import React from 'react';
import { HELP_TOPICS } from '../components/help/helpTopics';
import HelpVideoCard from '../components/help/HelpVideoCard';
import Mascot from '../components/mascot/Mascot';
import PageShell from '../components/layout/PageShell';
import PageHeader from '../components/layout/PageHeader';

export default function HelpPage() {
  return (
    <PageShell maxWidth="5xl">
      <PageHeader
        title="Help & Learning Videos"
        subtitle="Watch these videos to learn math concepts!"
        emoji="📚"
        mascot={<Mascot state="idle" className="w-48 h-48" />}
      />

      <div className="space-y-10">
        {HELP_TOPICS.map((topic) => (
          <HelpVideoCard key={topic.id} topic={topic} />
        ))}
      </div>
    </PageShell>
  );
}
