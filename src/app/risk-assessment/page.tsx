'use client';

import { useActionState } from 'react';
import type { RiskAssessmentState } from './actions';
import { runInjuryRiskAssessment } from './actions';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RiskAssessmentForm from '@/components/risk-assessment/risk-assessment-form';
import RiskAssessmentResult from '@/components/risk-assessment/risk-assessment-result';

export default function RiskAssessmentPage() {
  const initialState: RiskAssessmentState = {
    data: null,
    input: { athleteProfile: '', trainingLoad: '', pastInjuries: '' },
  };

  const [state, formAction, isPending] = useActionState(runInjuryRiskAssessment, initialState);

  const handleReset = () => {
    // This is a bit of a trick to reset the form state.
    // A more robust solution might involve a key on the form component.
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">AI-Powered Injury Risk Assessment</CardTitle>
          <CardDescription>
            Fill out the form below to get an AI-driven analysis of potential injury risks based on your athletic profile. This tool provides insights, not medical advice.
          </CardDescription>
        </CardHeader>
      </Card>

      {!state.data ? (
        <RiskAssessmentForm
          formAction={formAction}
          isPending={isPending}
          initialState={state}
        />
      ) : (
        <RiskAssessmentResult
          result={state.data}
          athleteProfile={state.input.athleteProfile}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
