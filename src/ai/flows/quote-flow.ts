'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {googleAI} from '@genkit-ai/google-genai';

const inputSchema = z.string();

const outputSchema = z.object({
  quote: z.string(),
  author: z.string(),
  videoUrl: z.string().optional(),
});
export type GetQuoteOutput = z.infer<typeof outputSchema>;

export async function getQuote(topic: string): Promise<GetQuoteOutput | null> {
  return quoteFlow(topic);
}

const quoteFlow = ai.defineFlow(
  {
    name: 'quoteFlow',
    inputSchema,
    outputSchema,
  },
  async (topic) => {
    const llmResponse = await ai.generate({
      prompt: `Generate a famous quote about ${topic}.`,
      model: 'googleai/gemini-1.5-flash',
      output: {
        schema: z.object({
          quote: z.string(),
          author: z.string(),
        }),
      },
    });

    const quote = llmResponse.output;
    if (!quote) {
      return null;
    }
    const {operation} = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: `A cinematic video representing the quote "${quote.quote}" by ${quote.author}.`,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });
    if (!operation) {
      return {
        ...quote,
        videoUrl: '',
      };
    }
    let result = await ai.checkOperation(operation);
    while (!result.done) {
      // This is a long-running operation. In a real app, you would want to
      // stream the progress to the user.
      await new Promise((resolve) => setTimeout(resolve, 5000));
      result = await ai.checkOperation(operation);
    }
    const video = result.output?.message?.content.find((p) => !!p.media);
    if (video?.media?.url) {
      return {
        ...quote,
        videoUrl: `${video.media.url}&key=${process.env.GEMINI_API_KEY}`,
      };
    } else {
      return {
        ...quote,
        videoUrl: '',
      };
    }
  }
);
