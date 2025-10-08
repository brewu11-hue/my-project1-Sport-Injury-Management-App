'use server';

/**
 * @fileOverview An AI agent that provides information about a specific sports injury.
 *
 * - getInjuryInfo - A function that returns information about a given injury.
 * - GetInjuryInfoInput - The input type for the getInjuryInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetInjuryInfoInputSchema = z.object({
  injuryName: z.string().describe('The name of the sports injury to look up.'),
});
export type GetInjuryInfoInput = z.infer<typeof GetInjuryInfoInputSchema>;

export type GetInjuryInfoOutput = {
    description: string;
    commonCauses: string;
    generalTreatment: string;
    disclaimer: string;
};

export async function getInjuryInfo(input: GetInjuryInfoInput): Promise<GetInjuryInfoOutput> {
  const llmResponse = await ai.generate({
    prompt: `For the sports injury "${input.injuryName}", provide the following information, with each section separated by ':::':
1. A detailed description.
2. A list of common causes.
3. General treatment advice.
`,
    model: 'gemini-1.5-flash-latest',
  });

  const text = llmResponse.text();
  const parts = text.split(':::');
  
  const description = parts[0]?.trim() || 'No description available.';
  const commonCauses = parts[1]?.trim() || 'No common causes available.';
  const generalTreatment = parts[2]?.trim() || 'No treatment advice available.';

  return {
    description,
    commonCauses,
    generalTreatment,
    disclaimer: "This information is for educational purposes only and is not a substitute for professional medical diagnosis or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
  };
}
