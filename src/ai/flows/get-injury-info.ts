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
    prompt: `Provide information for the sports injury: "${input.injuryName}".
Please structure your response with the following headings on new lines: "Description:", "Common Causes:", and "General Treatment:".`,
    model: 'gemini-1.5-flash-latest',
    config: { temperature: 0.3 }
  });

  const text = llmResponse.text();

  const descriptionMatch = text.match(/Description:([\s\S]*?)Common Causes:/);
  const commonCausesMatch = text.match(/Common Causes:([\s\S]*?)General Treatment:/);
  const generalTreatmentMatch = text.match(/General Treatment:([\s\S]*)/);
  
  const description = descriptionMatch ? descriptionMatch[1].trim() : 'No description available.';
  const commonCauses = commonCausesMatch ? commonCausesMatch[1].trim() : 'No common causes available.';
  const generalTreatment = generalTreatmentMatch ? generalTreatmentMatch[1].trim() : 'No treatment advice available.';
  
  return {
    description,
    commonCauses,
    generalTreatment,
    disclaimer: "This information is for educational purposes only and is not a substitute for professional medical diagnosis or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
  };
}
