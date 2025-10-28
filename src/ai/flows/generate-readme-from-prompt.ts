'use server';

/**
 * @fileOverview Generates a README.md content based on a custom user prompt.
 *
 * - generateReadmeFromPrompt - A function that generates the README content.
 * - GenerateReadmeFromPromptInput - The input type for the generateReadmeFromPrompt function.
 * - GenerateReadmeFromPromptOutput - The return type for the generateReadmeFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReadmeFromPromptInputSchema = z.object({
  prompt: z.string().describe('A custom prompt to guide the AI in generating the README content.'),
  repoDescription: z.string().describe('The description of the repository.'),
  repoName: z.string().describe('The name of the repository.'),
});
export type GenerateReadmeFromPromptInput = z.infer<typeof GenerateReadmeFromPromptInputSchema>;

const GenerateReadmeFromPromptOutputSchema = z.object({
  readmeContent: z.string().describe('The generated README.md content.'),
});
export type GenerateReadmeFromPromptOutput = z.infer<typeof GenerateReadmeFromPromptOutputSchema>;

export async function generateReadmeFromPrompt(input: GenerateReadmeFromPromptInput): Promise<GenerateReadmeFromPromptOutput> {
  return generateReadmeFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReadmeFromPrompt',
  input: {schema: GenerateReadmeFromPromptInputSchema},
  output: {schema: GenerateReadmeFromPromptOutputSchema},
  prompt: `You are an AI assistant that generates README.md content for GitHub repositories.

  Repository Name: {{{repoName}}}
  Repository Description: {{{repoDescription}}}

  Based on the following prompt, generate the README.md content:
  Prompt: {{{prompt}}}

  Include the following sections in the README:
  - Title
  - Description
  - Features
  - Tech Stack
  - Setup
  - Usage
  - Contributing
  - License`,
});

const generateReadmeFromPromptFlow = ai.defineFlow(
  {
    name: 'generateReadmeFromPromptFlow',
    inputSchema: GenerateReadmeFromPromptInputSchema,
    outputSchema: GenerateReadmeFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
