'use server';

/**
 * @fileOverview Analyzes a GitHub repository to generate README content.
 *
 * - analyzeRepositoryForReadmeContent - A function that analyzes the repository and returns content for a README file.
 * - AnalyzeRepositoryInput - The input type for the analyzeRepositoryForReadmeContent function.
 * - AnalyzeRepositoryOutput - The return type for the analyzeRepositoryForReadmeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeRepositoryInputSchema = z.object({
  repoName: z.string().describe('The name of the repository to analyze.'),
  repoDescription: z.string().describe('The description of the repository.'),
  fileStructure: z.string().describe('The file structure of the repository.'),
  programmingLanguages: z.string().describe('The programming languages used in the repository.'),
  dependencies: z.string().describe('The dependencies of the repository.'),
  licenseInfo: z.string().describe('The license information of the repository.'),
  customPrompt: z.string().optional().describe('Custom prompt to guide the AI in generating README content.'),
});
export type AnalyzeRepositoryInput = z.infer<typeof AnalyzeRepositoryInputSchema>;

const AnalyzeRepositoryOutputSchema = z.object({
  readmeContent: z.string().describe('The generated README content based on the repository analysis.'),
});
export type AnalyzeRepositoryOutput = z.infer<typeof AnalyzeRepositoryOutputSchema>;

export async function analyzeRepositoryForReadmeContent(
  input: AnalyzeRepositoryInput
): Promise<AnalyzeRepositoryOutput> {
  return analyzeRepositoryForReadmeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeRepositoryForReadmeContentPrompt',
  input: {schema: AnalyzeRepositoryInputSchema},
  output: {schema: AnalyzeRepositoryOutputSchema},
  prompt: `You are an AI expert in generating README.md files for GitHub repositories. Analyze the provided repository information and generate content for the README file, including a project description, how to get started, features, tech stack, usage, contributing guidelines, and license information.\n\nRepository Name: {{{repoName}}}\nRepository Description: {{{repoDescription}}}\nFile Structure: {{{fileStructure}}}\nProgramming Languages: {{{programmingLanguages}}}\nDependencies: {{{dependencies}}}\nLicense Information: {{{licenseInfo}}}\n\n{{#if customPrompt}}\nCustom Prompt: {{{customPrompt}}}\n{{/if}}\n\nBased on the above information, generate a comprehensive README.md content.`, // Changed from Handlebars to standard template literals
});

const analyzeRepositoryForReadmeContentFlow = ai.defineFlow(
  {
    name: 'analyzeRepositoryForReadmeContentFlow',
    inputSchema: AnalyzeRepositoryInputSchema,
    outputSchema: AnalyzeRepositoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
