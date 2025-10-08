'use client';

import { useState, useMemo } from 'react';
import { InjuryDataProvider, useInjuryData, Injury } from '@/hooks/use-injury-data';
import InjuryList from '@/components/dashboard/injury-list';
import InjuryDetails from '@/components/dashboard/injury-details';
import RecoveryProgressChart from '@/components/dashboard/recovery-progress-chart';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

function DashboardContent() {
  const { injuries } = useInjuryData();
  const [selectedInjuryId, setSelectedInjuryId] = useState<string | null>(null);

  const selectedInjury = useMemo(() => {
    if (!selectedInjuryId) return null;
    return injuries.find((i) => i.id === selectedInjuryId) || null;
  }, [injuries, selectedInjuryId]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <InjuryList
          selectedInjuryId={selectedInjuryId}
          onSelectInjury={(id) => setSelectedInjuryId(id)}
        />
      </div>
      <div className="lg:col-span-3 grid auto-rows-max gap-6">
        <InjuryDetails injury={selectedInjury} />
        <Card>
          <CardHeader>
            <CardTitle>Recovery Progress</CardTitle>
            <CardDescription>
              Severity of active injuries over time. Lower is better.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecoveryProgressChart injuries={injuries} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <InjuryDataProvider>
      <DashboardContent />
    </InjuryDataProvider>
  );
}
