'use server';

/**
 * @fileOverview Generates a README.md content based on a custom user prompt.
 *
 * - generateReadmeFromPrompt - A function that generates the README content.
 * - GenerateReadmeFromPromptInput - The input type for the generateReadmeFrom-prompt function.
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
  prompt: `You are an expert AI assistant that generates professional, open-source-standard README.md files for GitHub repositories.

  Repository Name: {{{repoName}}}
  Repository Description: {{{repoDescription}}}

  Based on the following user prompt, generate the complete, well-structured README.md content.
  User Prompt: {{{prompt}}}

  The generated README must be comprehensive and include the following sections, populated with relevant information based on the prompt and repository context:
  1.  **Title and Badges**: Create a clear title. Add relevant badges (e.g., license, stars, forks, build status if applicable).
  2.  **Introduction/Description**: A detailed paragraph explaining what the project does.
  3.  **Features**: A bulleted list of key features.
  4.  **Tech Stack**: List the primary technologies, frameworks, and languages used.
  5.  **Installation Guide**: Step-by-step instructions on how to set up the project locally.
  6.  **Usage Instructions**: How to run and use the project after installation.
  7.  **Contributing Guidelines**: A brief section on how others can contribute.
  8.  **License**: State the project's license.

  Ensure the output is a single string of valid Markdown.`,
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
