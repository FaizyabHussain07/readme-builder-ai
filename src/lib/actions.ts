'use server';

import { generateReadmeFromPrompt, type GenerateReadmeFromPromptInput } from '@/ai/flows/generate-readme-from-prompt';
import { z } from 'zod';

const inputSchema = z.object({
  prompt: z.string(),
  repoName: z.string(),
  repoDescription: z.string(),
});

type GenerateReadmeResult = {
  readmeContent?: string;
  error?: string;
};

export async function generateReadmeAction(
  input: GenerateReadmeFromPromptInput
): Promise<GenerateReadmeResult> {
  const parsedInput = inputSchema.safeParse(input);

  if (!parsedInput.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await generateReadmeFromPrompt(parsedInput.data);
    return { readmeContent: result.readmeContent };
  } catch (e: any) {
    console.error('Error generating README:', e);
    // In a real app, you would have more robust error handling and logging
    return { error: 'Failed to generate README. Please check your API key and try again.' };
  }
}
