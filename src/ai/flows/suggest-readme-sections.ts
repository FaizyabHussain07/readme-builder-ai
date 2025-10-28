'use server';

/**
 * @fileOverview A flow to suggest README sections based on repository analysis.
 *
 * - suggestReadmeSections - A function that suggests README sections.
 * - SuggestReadmeSectionsInput - The input type for the suggestReadmeSections function.
 * - SuggestReadmeSectionsOutput - The return type for the suggestReadmeSections function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestReadmeSectionsInputSchema = z.object({
  repoAnalysis: z
    .string()
    .describe('The analysis of the repository contents.'),
});
export type SuggestReadmeSectionsInput = z.infer<
  typeof SuggestReadmeSectionsInputSchema
>;

const SuggestReadmeSectionsOutputSchema = z.object({
  sections: z
    .array(z.string())
    .describe('The suggested sections for the README.'),
});
export type SuggestReadmeSectionsOutput = z.infer<
  typeof SuggestReadmeSectionsOutputSchema
>;

export async function suggestReadmeSections(
  input: SuggestReadmeSectionsInput
): Promise<SuggestReadmeSectionsOutput> {
  return suggestReadmeSectionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReadmeSectionsPrompt',
  input: {schema: SuggestReadmeSectionsInputSchema},
  output: {schema: SuggestReadmeSectionsOutputSchema},
  prompt: `Based on the following repository analysis, suggest relevant sections for a README file.  The response should be an array of strings, where each string is a section title.  Example sections include "Features", "Installation", "Usage", "Contributing", "License", etc.  Only suggest sections relevant to the repository.

Repository Analysis: {{{repoAnalysis}}} `,
});

const suggestReadmeSectionsFlow = ai.defineFlow(
  {
    name: 'suggestReadmeSectionsFlow',
    inputSchema: SuggestReadmeSectionsInputSchema,
    outputSchema: SuggestReadmeSectionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
