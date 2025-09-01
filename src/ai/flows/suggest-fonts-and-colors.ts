'use server';
/**
 * @fileOverview This file defines a Genkit flow to suggest complementary font and color combinations for text overlays.
 *
 * - suggestFontsAndColors - A function that handles the suggestion process.
 * - SuggestFontsAndColorsInput - The input type for the suggestFontsAndColors function.
 * - SuggestFontsAndColorsOutput - The return type for the suggestFontsAndColors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFontsAndColorsInputSchema = z.object({
  textStyle: z
    .string()
    .describe('The desired style of the text, e.g., modern, classic, playful.'),
  videoTheme: z
    .string()
    .describe(
      'The theme of the video content, e.g., nature, urban, abstract.'
    ),
});
export type SuggestFontsAndColorsInput = z.infer<typeof SuggestFontsAndColorsInputSchema>;

const SuggestFontsAndColorsOutputSchema = z.object({
  suggestedFont: z.string().describe('The name of the suggested font.'),
  suggestedColor: z
    .string()
    .describe(
      'The hex code of the suggested color that complements the font and theme.'
    ),
});
export type SuggestFontsAndColorsOutput = z.infer<typeof SuggestFontsAndColorsOutputSchema>;

export async function suggestFontsAndColors(
  input: SuggestFontsAndColorsInput
): Promise<SuggestFontsAndColorsOutput> {
  return suggestFontsAndColorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFontsAndColorsPrompt',
  input: {schema: SuggestFontsAndColorsInputSchema},
  output: {schema: SuggestFontsAndColorsOutputSchema},
  prompt: `You are a design expert specializing in typography and color palettes.

  Based on the desired text style and video theme, suggest a font and a color that would work well together for creating visually appealing text overlays on videos.

  Text Style: {{{textStyle}}}
  Video Theme: {{{videoTheme}}}

  Consider the principles of design, such as contrast, balance, and readability, when making your suggestions. The color should be provided as a hex code.
  `,
});

const suggestFontsAndColorsFlow = ai.defineFlow(
  {
    name: 'suggestFontsAndColorsFlow',
    inputSchema: SuggestFontsAndColorsInputSchema,
    outputSchema: SuggestFontsAndColorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
