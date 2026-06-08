'use server';
/**
 * @fileOverview An AI agent that generates real estate market trend reports.
 *
 * - aiMarketTrendReport - A function that handles the generation of market trend reports.
 * - AiMarketTrendReportInput - The input type for the aiMarketTrendReport function.
 * - AiMarketTrendReportOutput - The return type for the aiMarketTrendReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiMarketTrendReportInputSchema = z.object({
  region: z.string().optional().describe('The geographical region for which to generate the report (e.g., "San Francisco Bay Area", "Texas").'),
  propertyType: z.string().optional().describe('The type of property to focus on (e.g., "residential", "commercial", "luxury homes").'),
  timeframe: z.string().optional().describe('The timeframe for the report (e.g., "Q3 2024", "next 6 months").'),
});
export type AiMarketTrendReportInput = z.infer<typeof AiMarketTrendReportInputSchema>;

const AiMarketTrendReportOutputSchema = z.object({
  report: z.string().describe('A concise, AI-generated report summarizing current real estate market trends and forecasts.'),
});
export type AiMarketTrendReportOutput = z.infer<typeof AiMarketTrendReportOutputSchema>;

export async function aiMarketTrendReport(input: AiMarketTrendReportInput): Promise<AiMarketTrendReportOutput> {
  return aiMarketTrendReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMarketTrendReportPrompt',
  input: {schema: AiMarketTrendReportInputSchema},
  output: {schema: AiMarketTrendReportOutputSchema},
  prompt: `You are an expert real estate market analyst. Your task is to generate a concise, AI-generated report summarizing current real estate market trends and forecasts.

Focus on identifying impactful patterns and shifts, and provide actionable insights for investors.

Here are the details for the report:
{{#if region}}Region: {{{region}}}
{{/if}}{{#if propertyType}}Property Type: {{{propertyType}}}
{{/if}}{{#if timeframe}}Timeframe: {{{timeframe}}}
{{/if}}
Generate a report that includes:
1. A brief executive summary.
2. Key current market trends (e.g., interest rates, inventory levels, pricing changes).
3. Important market shifts (e.g., demographic changes, policy impacts, technological influences).
4. A forecast for the near future.
5. Potential opportunities or risks for investors.

The report should be professional, data-driven, and easy to understand for an investor.`,
});

const aiMarketTrendReportFlow = ai.defineFlow(
  {
    name: 'aiMarketTrendReportFlow',
    inputSchema: AiMarketTrendReportInputSchema,
    outputSchema: AiMarketTrendReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
