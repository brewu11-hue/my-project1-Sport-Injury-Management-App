'use server';
/**
 * @fileOverview An AI agent that analyzes an image of a potential injury.
 *
 * - scanInjuryFromImage - A function that takes an image and returns an analysis.
 * - ScanInjuryFromImageInput - The input type for the scanInjuryFromImage function.
 * - ScanInjuryFromImageOutput - The return type for the scanInjuryFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanInjuryFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a potential injury, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanInjuryFromImageInput = z.infer<typeof ScanInjuryFromImageInputSchema>;

const ScanInjuryFromImageOutputSchema = z.object({
  potentialInjury: z.string().describe('The name of the potential injury identified (e.g., "Ankle Sprain", "Bruise", "Cut"). If no injury is apparent, state "No apparent injury".'),
  observations: z.string().describe('Detailed observations from the image, such as signs of swelling, discoloration, redness, or broken skin.'),
  disclaimer: z.string().describe('A disclaimer stating that this is not a medical diagnosis and a healthcare professional should be consulted.'),
});
export type ScanInjuryFromImageOutput = z.infer<typeof ScanInjuryFromImageOutputSchema>;

export async function scanInjuryFromImage(input: ScanInjuryFromImageInput): Promise<ScanInjuryFromImageOutput> {
  return scanInjuryFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanInjuryFromImagePrompt',
  input: {schema: ScanInjuryFromImageInputSchema},
  output: {schema: ScanInjuryFromImageOutputSchema},
  prompt: `You are a helpful assistant with expertise in analyzing images for signs of common physical injuries. You are NOT a medical doctor and cannot provide a diagnosis.

Analyze the following image of a potential injury. Based ONLY on the visual information in the image, identify a potential injury, describe your key observations, and provide a clear disclaimer.

- **Potential Injury**: Identify the most likely type of injury visible (e.g., "Possible Knee Bruise," "Suspected Wrist Sprain," "Minor Abrasion"). Be conservative. If the image is unclear or shows no obvious injury, state "Unclear" or "No apparent injury".
- **Observations**: Describe what you see in the image that leads to your assessment. Mention things like discoloration (bruising), swelling, redness, cuts, or abrasions.
- **Disclaimer**: Always include the following disclaimer: "This is an AI-powered visual assessment and not a medical diagnosis. Please consult with a qualified healthcare professional for any health concerns or before making any decisions related to your health."

Image to analyze: {{media url=photoDataUri}}`,
});

const scanInjuryFromImageFlow = ai.defineFlow(
  {
    name: 'scanInjuryFromImageFlow',
    inputSchema: ScanInjuryFromImageInputSchema,
    outputSchema: ScanInjuryFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
