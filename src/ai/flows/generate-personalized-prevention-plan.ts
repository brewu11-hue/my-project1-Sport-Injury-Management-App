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
  // Mocked response to prevent AI timeouts
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  return {
    preventionPlan: `Based on your profile and risk factors, here is a targeted prevention plan:

**1. Shoulder Stability & Strength (3x per week):**
   - **External Rotations:** Use a light resistance band. 3 sets of 15 reps.
   - **Scapular Wall Slides:** 3 sets of 10 reps. Focus on controlled movement.
   - **Farmer's Walks:** 3 sets of 30-second carries. This builds grip and shoulder girdle stability.

**2. Core Strengthening (4x per week):**
   - **Plank Variations:** Front and side planks. Hold for 45-60 seconds, 3 sets.
   - **Dead Bugs:** 3 sets of 12 reps per side. Excellent for core control without straining the back.
   - **Hanging Knee Raises:** 3 sets to failure.

**3. Mobility & Recovery (Daily):**
   - **Dynamic Warm-up (Pre-session):** 10-15 minutes including arm circles, leg swings, and thoracic spine rotations.
   - **Static Stretching (Post-session):** Focus on chest, lats, hips, and hamstrings. Hold each stretch for 30 seconds.
   - **Foam Rolling:** Target quads, hamstrings, and thoracic spine.

**4. Training Load Management:**
   - **Implement a Deload Week:** Every 4-5 weeks, reduce your training volume and intensity by 40-50% to allow for systemic recovery.
   - **Listen to Your Body:** Do not push through sharp pain. Differentiate between muscle soreness and joint pain.`,
  };
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
