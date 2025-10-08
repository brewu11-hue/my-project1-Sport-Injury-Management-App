'use client';

import { Injury } from '@/hooks/use-injury-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import TreatmentLog from './treatment-log';
import { Activity } from 'lucide-react';

type InjuryDetailsProps = {
  injury: Injury | null;
};

export default function InjuryDetails({ injury }: InjuryDetailsProps) {
  if (!injury) {
    return (
      <Card className="flex h-full items-center justify-center">
        <CardContent className="text-center text-muted-foreground p-6">
          <Activity className="mx-auto h-12 w-12 mb-4" />
          <p className="font-semibold">Select an injury</p>
          <p>Choose an injury from the log to see its details and track recovery.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{injury.type}</CardTitle>
        <CardDescription>
          Injured on {format(injury.date, 'MMMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Current Severity</h3>
          <div className="flex items-center gap-2">
             <span className="text-4xl font-bold text-primary">{injury.severity}</span>
             <span className="text-muted-foreground">/ 10</span>
          </div>
        </div>
        <TreatmentLog injury={injury} />
      </CardContent>
    </Card>
  );
}
