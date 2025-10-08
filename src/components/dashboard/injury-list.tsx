'use client';

import { useState } from 'react';
import { useInjuryData } from '@/hooks/use-injury-data';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { AddInjuryDialog } from './add-injury-dialog';
import { Input } from '../ui/input';

type InjuryListProps = {
  selectedInjuryId: string | null;
  onSelectInjury: (id: string) => void;
};

export default function InjuryList({ selectedInjuryId, onSelectInjury }: InjuryListProps) {
  const { injuries } = useInjuryData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInjuries = injuries.filter((injury) =>
    injury.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Injury Log</CardTitle>
          <AddInjuryDialog>
            <Button size="sm" variant="ghost" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Injury
            </Button>
          </AddInjuryDialog>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for an injury..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-25rem)]">
          <div className="flex flex-col gap-2 p-4 pt-0">
            {filteredInjuries.length > 0 ? (
              filteredInjuries.map((injury) => (
              <button
                key={injury.id}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent/50',
                  selectedInjuryId === injury.id && 'bg-accent'
                )}
                onClick={() => onSelectInjury(injury.id)}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{injury.type}</div>
                    </div>
                    <div
                      className={cn(
                        'ml-auto text-xs',
                        selectedInjuryId === injury.id ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {format(injury.date, 'PPP')}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    Current Severity: {injury.severity}/10
                  </div>
                </div>
              </button>
            ))
            ) : (
              <div className="text-center text-muted-foreground p-8">
                No injuries found.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
