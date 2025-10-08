'use client';

import { useState } from 'react';
import type { AssessInjuryRiskOutput } from '@/ai/flows/assess-injury-risk';
import type { RiskAssessmentState } from './actions';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RiskAssessmentForm from '@/components/risk-assessment/risk-assessment-form';
import RiskAssessmentResult from '@/components/risk-assessment/risk-assessment-result';

export default function RiskAssessmentPage() {
  const [assessmentResult, setAssessmentResult] = useState<RiskAssessmentState | null>(null);

  const handleReset = () => {
    setAssessmentResult(null);
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

      {!assessmentResult?.data ? (
        <RiskAssessmentForm setAssessmentResult={setAssessmentResult} />
      ) : (
        <RiskAssessmentResult
          result={assessmentResult.data}
          athleteProfile={assessmentResult.input.athleteProfile}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
