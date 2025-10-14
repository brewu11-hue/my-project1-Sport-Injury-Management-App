'use client';

import { useFormStatus } from 'react-dom';
import type { RiskAssessmentState } from '@/app/risk-assessment/actions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Assessing...
        </>
      ) : (
        'Assess My Risk'
      )}
    </Button>
  );
}

type RiskAssessmentFormProps = {
    formAction: (payload: FormData) => void;
    isPending: boolean;
    initialState: RiskAssessmentState;
}

export default function RiskAssessmentForm({ formAction, isPending, initialState }: RiskAssessmentFormProps) {
  
  return (
    <form action={formAction}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="athlete-profile">Athlete Profile</Label>
            <Textarea
              id="athlete-profile"
              name="athleteProfile"
              placeholder="e.g., 25-year-old male, competitive marathon runner, 5 years of experience."
              rows={3}
              defaultValue={initialState.input.athleteProfile}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="training-load">Current Training Load</Label>
            <Textarea
              id="training-load"
              name="trainingLoad"
              placeholder="e.g., Running 50 miles/week, including 2 interval sessions and 1 long run. 2 strength training sessions per week."
              rows={4}
              defaultValue={initialState.input.trainingLoad}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="past-injuries">Past Injuries</Label>
            <Textarea
              id="past-injuries"
              name="pastInjuries"
              placeholder="e.g., History of shin splints 2 years ago, fully recovered. Mild patellar tendonitis in right knee last year."
              rows={3}
              defaultValue={initialState.input.pastInjuries}
            />
          </div>
          {initialState.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{initialState.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
