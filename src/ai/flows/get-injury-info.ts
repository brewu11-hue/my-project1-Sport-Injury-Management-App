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
  // Mocked response to bypass AI timeout issues for now.
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  return {
    description: `This is a sample description for "${input.injuryName}". A real description from the AI would detail the nature of the injury, affecting the muscles, ligaments, and tendons.`,
    commonCauses: `This section would normally list common causes for "${input.injuryName}", such as overuse, improper technique, or sudden trauma. For now, this is placeholder text.`,
    generalTreatment: `General treatment advice for "${input.injuryName}" would appear here. This typically includes rest, ice, compression, and elevation (R.I.C.E.), followed by physical therapy.`,
    disclaimer: "This information is for educational purposes only and is not a substitute for professional medical diagnosis or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
  };
}
