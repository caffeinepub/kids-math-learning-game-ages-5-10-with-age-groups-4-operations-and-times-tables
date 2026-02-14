import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { generateTimesTable, AVAILABLE_TABLES } from '../../game/timesTables';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TimesTablesLearningView() {
  const [selectedTable, setSelectedTable] = useState(2);
  const tableData = generateTimesTable(selectedTable);

  const handlePrevious = () => {
    const currentIndex = AVAILABLE_TABLES.indexOf(selectedTable);
    if (currentIndex > 0) {
      setSelectedTable(AVAILABLE_TABLES[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const currentIndex = AVAILABLE_TABLES.indexOf(selectedTable);
    if (currentIndex < AVAILABLE_TABLES.length - 1) {
      setSelectedTable(AVAILABLE_TABLES[currentIndex + 1]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center justify-center gap-6">
        <Button
          size="lg"
          variant="outline"
          onClick={handlePrevious}
          disabled={selectedTable === AVAILABLE_TABLES[0]}
          className="h-16 w-16"
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <div className="flex gap-3 flex-wrap justify-center">
          {AVAILABLE_TABLES.map((table) => (
            <Button
              key={table}
              size="lg"
              variant={selectedTable === table ? 'default' : 'outline'}
              onClick={() => setSelectedTable(table)}
              className="text-2xl w-16 h-16"
            >
              {table}
            </Button>
          ))}
        </div>

        <Button
          size="lg"
          variant="outline"
          onClick={handleNext}
          disabled={selectedTable === AVAILABLE_TABLES[AVAILABLE_TABLES.length - 1]}
          className="h-16 w-16"
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>

      <Card className="border-4 border-primary/20 shadow-kid">
        <CardHeader>
          <CardTitle className="text-4xl md:text-5xl text-center text-foreground">
            {selectedTable} Times Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tableData.rows.map((row) => (
              <div
                key={row.multiplier}
                className="bg-accent/10 rounded-2xl p-6 border-2 border-accent/30 hover:bg-accent/20 transition-colors"
              >
                <p className="text-3xl md:text-4xl font-bold text-center text-foreground">
                  {row.equation}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
