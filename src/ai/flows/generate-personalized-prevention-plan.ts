'use server';
/**
 * @fileOverview Generates a personalized injury prevention plan based on a risk assessment.
 *
 * - generatePersonalizedPreventionPlan - A function that generates the prevention plan.
 * - PersonalizedPreventionPlanInput - The input type for the generatePersonalizedPreventionPlan function.
 * - PersonalizedPreventionPlanOutput - The return type for the generatePersonalizedPreventionPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedPreventionPlanInputSchema = z.object({
  athleteProfile: z
    .string()
    .describe('The athlete profile including training load, past injuries, and other relevant factors.'),
  riskAssessment: z.string().describe('The risk assessment for the athlete.'),
});
export type PersonalizedPreventionPlanInput = z.infer<
  typeof PersonalizedPreventionPlanInputSchema
>;

const PersonalizedPreventionPlanOutputSchema = z.object({
  preventionPlan: z.string().describe('The personalized injury prevention plan.'),
});
export type PersonalizedPreventionPlanOutput = z.infer<
  typeof PersonalizedPreventionPlanOutputSchema
>;

export async function generatePersonalizedPreventionPlan(
  input: PersonalizedPreventionPlanInput
): Promise<PersonalizedPreventionPlanOutput> {
  return generatePersonalizedPreventionPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedPreventionPlanPrompt',
  input: {schema: PersonalizedPreventionPlanInputSchema},
  output: {schema: PersonalizedPreventionPlanOutputSchema},
  prompt: `You are an expert sports medicine professional. Generate a personalized injury prevention plan for an athlete based on their profile and risk assessment.

Athlete Profile: {{{athleteProfile}}}
Risk Assessment: {{{riskAssessment}}}

Prevention Plan:`,
});

const generatePersonalizedPreventionPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedPreventionPlanFlow',
    inputSchema: PersonalizedPreventionPlanInputSchema,
    outputSchema: PersonalizedPreventionPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
