'use client';

import Link from 'next/link';
import { Injury, useInjuryData } from '@/hooks/use-injury-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import TreatmentLog from './treatment-log';
import { Activity, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Timestamp } from 'firebase/firestore';

type InjuryDetailsProps = {
  injury: Injury | null;
};

export default function InjuryDetails({ injury }: InjuryDetailsProps) {
  const { updateInjurySeverity } = useInjuryData();
  
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
  
  const injuryDate = injury.date instanceof Timestamp ? injury.date.toDate() : injury.date;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{injury.type}</CardTitle>
        <CardDescription>
          Injured on {format(injuryDate, 'MMMM d, yyyy')}
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
        <TreatmentLog injury={injury} updateSeverity={updateInjurySeverity} />
      </CardContent>
      <CardFooter>
          <Button asChild variant="outline">
              <Link href={`/injury-intel?injury=${encodeURIComponent(injury.type)}`}>
                  <Info className="mr-2"/>
                  Get AI Insights on {injury.type}
              </Link>
          </Button>
      </CardFooter>
    </Card>
  );
}
