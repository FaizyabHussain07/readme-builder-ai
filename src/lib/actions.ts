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
    // In a real app, you might want to fetch the API key from a secure store
    // or have the user provide it. For now, we assume it's in the environment.
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const storedKey = await getApiKeyFromLocalStorage();
      if(!storedKey) {
        return { error: 'API key not found. Please set it in the settings.' };
      }
    }
    
    const result = await generateReadmeFromPrompt(parsedInput.data);
    return { readmeContent: result.readmeContent };
  } catch (e: any) {
    console.error('Error generating README:', e);
    // In a real app, you would have more robust error handling and logging
    return { error: 'Failed to generate README. Please check your API key and try again.' };
  }
}

// This is a placeholder for a more secure way to get the API key.
// In a real app, you would not be able to access localStorage from a server action.
// This is a workaround for the current app structure.
async function getApiKeyFromLocalStorage() {
  return null;
}
