'use server';

/**
 * @fileOverview An AI agent that provides information about a specific sports injury.
 *
 * - getInjuryInfo - A function that returns information about a given injury.
 * - GetInjuryInfoInput - The input type for the getInjuryInfo function.
 * - GetInjuryInfoOutput - The return type for the getInjuryInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetInjuryInfoInputSchema = z.object({
  injuryName: z.string().describe('The name of the sports injury to look up.'),
});
export type GetInjuryInfoInput = z.infer<typeof GetInjuryInfoInputSchema>;

const GetInjuryInfoOutputSchema = z.object({
  description: z.string().describe('A detailed description of the injury.'),
  commonCauses: z.string().describe('Common causes or mechanisms of the injury.'),
  generalTreatment: z.string().describe('General advice on treatment and recovery. This can include R.I.C.E., stretching, strengthening exercises, etc.'),
  disclaimer: z.string().describe('A standard disclaimer that this information is not a substitute for professional medical advice.'),
});
export type GetInjuryInfoOutput = z.infer<typeof GetInjuryInfoOutputSchema>;

export async function getInjuryInfo(input: GetInjuryInfoInput): Promise<GetInjuryInfoOutput> {
  return getInjuryInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getInjuryInfoPrompt',
  input: {schema: GetInjuryInfoInputSchema},
  output: {schema: GetInjuryInfoOutputSchema},
  prompt: `You are an expert in sports medicine. For the injury named "{{injuryName}}", provide the following information:
- A detailed description of what the injury is.
- A list of common causes for the injury.
- General treatment advice.
- Finally, include this exact disclaimer: "This information is for educational purposes only and is not a substitute for professional medical diagnosis or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
`,
});

const getInjuryInfoFlow = ai.defineFlow(
  {
    name: 'getInjuryInfoFlow',
    inputSchema: GetInjuryInfoInputSchema,
    outputSchema: GetInjuryInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
