'use client';

import type { AssessInjuryRiskOutput } from '@/ai/flows/assess-injury-risk';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PreventionPlan from './prevention-plan';

type RiskAssessmentResultProps = {
  result: AssessInjuryRiskOutput;
  athleteProfile: string;
  onReset: () => void;
};

export default function RiskAssessmentResult({ result, athleteProfile, onReset }: RiskAssessmentResultProps) {
  const getBadgeVariant = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <span>Risk Assessment Result</span>
            <Badge variant={getBadgeVariant(result.riskLevel)} className="capitalize text-base px-4 py-1">
              {result.riskLevel} Risk
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground">Based on the provided profile, here is your estimated injury risk analysis.</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contributing Risk Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{result.riskFactors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recommendations to Reduce Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{result.recommendations}</p>
          </CardContent>
        </Card>
      </div>
      
      <PreventionPlan riskAssessment={result.riskFactors} athleteProfile={athleteProfile} />

      <div className="text-center">
        <Button variant="outline" onClick={onReset}>
          Start New Assessment
        </Button>
      </div>
    </div>
  );
}
