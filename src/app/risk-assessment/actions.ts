'use server';

import { assessInjuryRisk, AssessInjuryRiskInput, AssessInjuryRiskOutput } from '@/ai/flows/assess-injury-risk';
import { generatePersonalizedPreventionPlan, PersonalizedPreventionPlanInput } from '@/ai/flows/generate-personalized-prevention-plan.ts';
import { z } from 'zod';

const AthleteProfileSchema = z.object({
  athleteProfile: z.string().min(10, 'Please provide a more detailed profile.'),
  trainingLoad: z.string().min(10, 'Please provide more details about your training load.'),
  pastInjuries: z.string().min(10, 'Please provide more details about your past injuries.'),
});

export type RiskAssessmentState = {
  data: AssessInjuryRiskOutput | null;
  input: AssessInjuryRiskInput;
  error?: string;
};

export async function runInjuryRiskAssessment(
  prevState: RiskAssessmentState,
  formData: FormData
): Promise<RiskAssessmentState> {
  const rawFormData = {
    athleteProfile: formData.get('athleteProfile'),
    trainingLoad: formData.get('trainingLoad'),
    pastInjuries: formData.get('pastInjuries'),
  };

  const validatedFields = AthleteProfileSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    return {
      data: null,
      input: rawFormData as AssessInjuryRiskInput,
      error: validatedFields.error.flatten().fieldErrors.athleteProfile?.[0] || 'Invalid input.',
    };
  }

  try {
    const result = await assessInjuryRisk(validatedFields.data);
    return {
      data: result,
      input: validatedFields.data,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      input: validatedFields.data,
      error: 'Failed to run assessment. Please try again.',
    };
  }
}

export async function runPreventionPlanGeneration(input: PersonalizedPreventionPlanInput) {
    try {
        const result = await generatePersonalizedPreventionPlan(input);
        return { success: true, plan: result.preventionPlan };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to generate prevention plan.' };
    }
}
