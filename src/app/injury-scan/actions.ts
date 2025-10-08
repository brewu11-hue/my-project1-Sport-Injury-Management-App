'use server';

import { scanInjuryFromImage, ScanInjuryFromImageOutput } from '@/ai/flows/scan-injury-from-image';

export type ScanInjuryOutput = ScanInjuryFromImageOutput;

export async function scanInjury(imageDataUri: string): Promise<ScanInjuryOutput> {
    try {
        const result = await scanInjuryFromImage({ photoDataUri: imageDataUri });
        return result;
    } catch (error) {
        console.error("Failed to scan injury:", error);
        throw new Error("The AI model failed to analyze the injury. Please try again.");
    }
}
