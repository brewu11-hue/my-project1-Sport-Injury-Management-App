'use client';

import { useState } from 'react';
import { runPreventionPlanGeneration } from '@/app/risk-assessment/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type PreventionPlanProps = {
  riskAssessment: string;
  athleteProfile: string;
};

export default function PreventionPlan({ riskAssessment, athleteProfile }: PreventionPlanProps) {
  const [plan, setPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setError(null);
    const result = await runPreventionPlanGeneration({ riskAssessment, athleteProfile });
    if (result.success) {
      setPlan(result.plan);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Prevention Plan</CardTitle>
        <CardDescription>
          Generate an AI-powered prevention plan with specific exercises, stretches, and recovery protocols based on your risk assessment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!plan && (
          <div className="flex flex-col items-center justify-center text-center p-6 bg-muted/50 rounded-lg">
            <p className="mb-4 text-muted-foreground">Ready to take the next step in injury prevention?</p>
            <Button onClick={handleGeneratePlan} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                'Generate My Plan'
              )}
            </Button>
          </div>
        )}
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        {plan && (
          <div>
            <h4 className="font-semibold mb-2">Your Custom Plan:</h4>
            <p className="whitespace-pre-wrap p-4 bg-muted/50 rounded-md">{plan}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
