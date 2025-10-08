'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type Treatment = {
  id: string;
  date: Date;
  activity: string;
  notes: string;
};

export type Injury = {
  id: string;
  type: string;
  severity: number; // 1-10
  date: Date;
  treatments: Treatment[];
  recoveryHistory: { date: Date; severity: number }[];
};

type InjuryDataContextType = {
  injuries: Injury[];
  addInjury: (injury: Omit<Injury, 'id' | 'treatments' | 'recoveryHistory'>) => void;
  addTreatment: (injuryId: string, treatment: Omit<Treatment, 'id'>) => void;
  getInjuryById: (injuryId: string) => Injury | undefined;
};

const InjuryDataContext = createContext<InjuryDataContextType | undefined>(undefined);

const sampleInjuries: Injury[] = [
    {
        id: '1',
        type: 'Knee Sprain',
        severity: 7,
        date: new Date('2024-05-10'),
        treatments: [
            { id: 't1', date: new Date('2024-05-11'), activity: 'Icing', notes: 'Applied for 15 minutes.'},
            { id: 't2', date: new Date('2024-05-12'), activity: 'Physical Therapy', notes: 'Stretching exercises.'},
            { id: 't3', date: new Date('2024-05-15'), activity: 'Rest', notes: 'Avoided strenuous activity.'},
        ],
        recoveryHistory: [
          { date: new Date('2024-05-10'), severity: 7 },
          { date: new Date('2024-05-13'), severity: 6 },
          { date: new Date('2024-05-16'), severity: 5 },
          { date: new Date('2024-05-20'), severity: 4 },
        ]
    },
    {
        id: '2',
        type: 'Shoulder Strain',
        severity: 5,
        date: new Date('2024-06-15'),
        treatments: [
           { id: 't4', date: new Date('2024-06-16'), activity: 'Heat Pack', notes: 'Applied for 20 minutes.'},
        ],
        recoveryHistory: [
          { date: new Date('2024-06-15'), severity: 5 },
          { date: new Date('2024-06-18'), severity: 4 },
          { date: new Date('2024-06-22'), severity: 4 },
        ]
    }
];

export function InjuryDataProvider({ children }: { children: ReactNode }) {
  const [injuries, setInjuries] = useState<Injury[]>(sampleInjuries);

  const addInjury = useCallback((injury: Omit<Injury, 'id' | 'treatments' | 'recoveryHistory'>) => {
    const newInjury: Injury = {
      ...injury,
      id: new Date().toISOString(),
      treatments: [],
      recoveryHistory: [{ date: injury.date, severity: injury.severity }],
    };
    setInjuries((prev) => [newInjury, ...prev]);
  }, []);

  const addTreatment = useCallback((injuryId: string, treatment: Omit<Treatment, 'id'>) => {
    setInjuries((prev) =>
      prev.map((injury) => {
        if (injury.id === injuryId) {
          const updatedInjury = {
            ...injury,
            treatments: [
              { ...treatment, id: new Date().toISOString() },
              ...injury.treatments,
            ],
          };

          // If the new treatment changes severity, update it. For now, let's assume some activities reduce severity.
          // This is a simplified logic.
          const newSeverity = Math.max(1, injury.severity - 1);
          updatedInjury.severity = newSeverity;
          updatedInjury.recoveryHistory = [
            ...injury.recoveryHistory,
            { date: treatment.date, severity: newSeverity }
          ];
          
          return updatedInjury;
        }
        return injury;
      })
    );
  }, []);

  const getInjuryById = useCallback((injuryId: string) => {
    return injuries.find(injury => injury.id === injuryId);
  }, [injuries]);

  return (
    <InjuryDataContext.Provider value={{ injuries, addInjury, addTreatment, getInjuryById }}>
      {children}
    </InjuryDataContext.Provider>
  );
}

export function useInjuryData() {
  const context = useContext(InjuryDataContext);
  if (!context) {
    throw new Error('useInjuryData must be used within an InjuryDataProvider');
  }
  return context;
}
