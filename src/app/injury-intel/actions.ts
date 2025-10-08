'use server';

import { getInjuryInfo, GetInjuryInfoInput, type GetInjuryInfoOutput } from '@/ai/flows/get-injury-info';
import { z } from 'zod';

const GetInjuryInfoActionSchema = z.object({
    injuryName: z.string().min(2, 'Please enter a valid injury name.'),
});

export type SearchState = {
    data: GetInjuryInfoOutput | null;
    error?: string;
    input: GetInjuryInfoInput;
}

export async function searchInjuryInfo(prevState: SearchState, formData: FormData): Promise<SearchState> {
    const rawFormData = {
        injuryName: formData.get('injuryName') as string,
    }

    // Always start with null data for a new submission
    const newState: SearchState = {
        data: null,
        input: rawFormData,
    };

    const validatedFields = GetInjuryInfoActionSchema.safeParse(rawFormData);
    if (!validatedFields.success) {
        newState.error = validatedFields.error.flatten().fieldErrors.injuryName?.[0] || 'Invalid input.';
        return newState;
    }
    
    newState.input = validatedFields.data;

    try {
        const result = await getInjuryInfo(validatedFields.data);
        newState.data = result;
        return newState;
    } catch (error) {
        console.error("Failed to get injury info:", error);
        newState.error = 'The AI model failed to retrieve information. Please try again.';
        return newState;
    }
}
