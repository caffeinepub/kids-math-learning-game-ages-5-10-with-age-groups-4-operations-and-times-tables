import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import TimesTablesLearningView from './TimesTablesLearningView';
import TimesTablesPracticeView from './TimesTablesPracticeView';
import Mascot from '../../components/mascot/Mascot';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';

export default function TimesTablesPage() {
  const [activeTab, setActiveTab] = useState('learn');

  return (
    <PageShell maxWidth="6xl">
      <PageHeader
        title="Times Tables"
        subtitle="Learn and practice your multiplication tables!"
        emoji="📊"
        mascot={<Mascot state="idle" className="w-48 h-48" />}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 h-20 mb-10">
          <TabsTrigger value="learn" className="text-2xl">
            📖 Learn
          </TabsTrigger>
          <TabsTrigger value="practice" className="text-2xl">
            ✏️ Practice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learn">
          <TimesTablesLearningView />
        </TabsContent>

        <TabsContent value="practice">
          <TimesTablesPracticeView />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
