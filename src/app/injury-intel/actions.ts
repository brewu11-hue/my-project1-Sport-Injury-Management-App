'use server';

import { getInjuryInfo, GetInjuryInfoInput, GetInjuryInfoOutput } from '@/ai/flows/get-injury-info';
import { z } from 'zod';

const GetInjuryInfoSchema = z.object({
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

    const validatedFields = GetInjuryInfoSchema.safeParse(rawFormData);
    if (!validatedFields.success) {
        return {
            data: null,
            input: rawFormData,
            error: validatedFields.error.flatten().fieldErrors.injuryName?.[0] || 'Invalid input.',
        };
    }

    try {
        const result = await getInjuryInfo(validatedFields.data);
        return {
            data: result,
            input: validatedFields.data,
            error: undefined,
        };
    } catch (error) {
        console.error("Failed to get injury info:", error);
        return {
            data: null,
            input: validatedFields.data,
            error: 'The AI model failed to retrieve information. Please try again.',
        }
    }
}
