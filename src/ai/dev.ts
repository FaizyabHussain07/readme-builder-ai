import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-repository-for-readme-content.ts';
import '@/ai/flows/suggest-readme-sections.ts';
import '@/ai/flows/generate-readme-from-prompt.ts';