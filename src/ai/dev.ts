import { config } from 'dotenv';
config();

import '@/ai/flows/generate-personalized-prevention-plan.ts';
import '@/ai/flows/assess-injury-risk.ts';
import '@/ai/flows/scan-injury-from-image.ts';
import '@/ai/flows/get-injury-info.ts';
