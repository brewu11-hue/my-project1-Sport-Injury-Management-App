'use server';

/**
 * @fileOverview An AI agent that assesses the risk of sport injury.
 *
 * - assessInjuryRisk - A function that assesses the risk of injury based on user profile, training load and past injuries.
 * - AssessInjuryRiskInput - The input type for the assessInjuryRisk function.
 * - AssessInjuryRiskOutput - The return type for the assessInjuryRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessInjuryRiskInputSchema = z.object({
  athleteProfile: z.string().describe('Detailed profile of the athlete including age, sport, experience level, etc.'),
  trainingLoad: z.string().describe('Current training load including frequency, intensity, duration, and type of exercises.'),
  pastInjuries: z.string().describe('History of past injuries, including type, severity, and recovery time.'),
});
export type AssessInjuryRiskInput = z.infer<typeof AssessInjuryRiskInputSchema>;

const AssessInjuryRiskOutputSchema = z.object({
  riskLevel: z.enum(['low', 'medium', 'high']).describe('The overall risk level of injury.'),
  riskFactors: z.string().describe('A detailed explanation of the factors contributing to the risk level.'),
  recommendations: z.string().describe('Specific recommendations to reduce the risk of injury.'),
});
export type AssessInjuryRiskOutput = z.infer<typeof AssessInjuryRiskOutputSchema>;

export async function assessInjuryRisk(input: AssessInjuryRiskInput): Promise<AssessInjuryRiskOutput> {
  return assessInjuryRiskFlow(input);
}

const assessInjuryRiskPrompt = ai.definePrompt({
  name: 'assessInjuryRiskPrompt',
  input: {schema: AssessInjuryRiskInputSchema},
  output: {schema: AssessInjuryRiskOutputSchema},
  prompt: `You are an expert in sports medicine and injury prevention. Your task is to assess the risk of injury for an athlete based on their profile, training load, and past injuries. Provide a risk level (low, medium, or high), explain the contributing risk factors, and offer specific recommendations to reduce the risk.

Athlete Profile: {{{athleteProfile}}}
Training Load: {{{trainingLoad}}}
Past Injuries: {{{pastInjuries}}}`,
});

const assessInjuryRiskFlow = ai.defineFlow(
  {
    name: 'assessInjuryRiskFlow',
    inputSchema: AssessInjuryRiskInputSchema,
    outputSchema: AssessInjuryRiskOutputSchema,
  },
  async input => {
    const {output} = await assessInjuryRiskPrompt(input);
    return output!;
  }
);
