'use server';
/**
 * @fileOverview An AI agent that provides investment analysis for real estate properties.
 *
 * - analyzeInvestmentProperty - A function that handles the AI-powered investment analysis process.
 * - InvestmentAnalysisInput - The input type for the analyzeInvestmentProperty function.
 * - InvestmentAnalysisOutput - The return type for the analyzeInvestmentProperty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvestmentAnalysisInputSchema = z.object({
  address: z.string().describe('The full address of the property.'),
  price: z.number().describe('The asking price of the property.'),
  propertyType: z.string().describe('Type of property (e.g., single-family home, condo, multi-family).'),
  bedrooms: z.number().int().positive().describe('Number of bedrooms.'),
  bathrooms: z.number().positive().describe('Number of bathrooms.'),
  squareFootage: z.number().int().positive().describe('Total square footage of the property.'),
  yearBuilt: z.number().int().positive().describe('Year the property was built.'),
  description: z.string().describe('A detailed description of the property from the listing.'),
  neighborhoodFeatures: z.string().optional().describe('Key features or descriptions of the neighborhood (e.g., good schools, near public transport, up-and-coming area).'),
  estimatedRentalIncome: z.number().optional().describe('Estimated monthly rental income for the property.'),
  comparableSalesSummary: z.string().optional().describe('A summary of recent comparable sales data in the area, including prices and property types.'),
  marketTrendSummary: z.string().optional().describe('A summary of current local real estate market trends (e.g., seller\'s market, buyer\'s market, average price growth, inventory levels).'),
});
export type InvestmentAnalysisInput = z.infer<typeof InvestmentAnalysisInputSchema>;

const InvestmentAnalysisOutputSchema = z.object({
  overallSummary: z.string().describe('A concise overall summary of the investment potential of the property.'),
  opportunities: z.array(z.string()).describe('A list of potential opportunities or upsides for investing in this property.'),
  risks: z.array(z.string()).describe('A list of potential risks or downsides for investing in this property.'),
  keyInvestmentInsights: z.array(z.string()).describe('A list of key data-driven insights and metrics relevant to the investment decision.'),
  recommendation: z.string().describe('A brief investment recommendation or next steps (e.g., "Consider further due diligence", "Strong potential", "High risk").'),
});
export type InvestmentAnalysisOutput = z.infer<typeof InvestmentAnalysisOutputSchema>;

export async function analyzeInvestmentProperty(input: InvestmentAnalysisInput): Promise<InvestmentAnalysisOutput> {
  return aiInvestmentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'investmentAnalysisPrompt',
  input: {schema: InvestmentAnalysisInputSchema},
  output: {schema: InvestmentAnalysisOutputSchema},
  prompt: `You are an expert real estate investment analyst. Your task is to provide a comprehensive analysis of a given property, identifying its investment opportunities and risks, and offering key insights to help an investor make an informed decision.

Analyze the property details and market data provided below. Focus on identifying factors that make it a good or bad investment, potential for appreciation, rental income stability, market demand, and any red flags.

Property Details:
Address: {{{address}}}
Asking Price: ${{price}}
Property Type: {{{propertyType}}}
Bedrooms: {{{bedrooms}}}
Bathrooms: {{{bathrooms}}}
Square Footage: {{{squareFootage}}} sqft
Year Built: {{{yearBuilt}}}
Description: {{{description}}}

{{#if neighborhoodFeatures}}
Neighborhood Features: {{{neighborhoodFeatures}}}
{{/if}}

{{#if estimatedRentalIncome}}
Estimated Monthly Rental Income: ${{estimatedRentalIncome}}
{{/if}}

{{#if comparableSalesSummary}}
Comparable Sales Summary: {{{comparableSalesSummary}}}
{{/if}}

{{#if marketTrendSummary}}
Market Trend Summary: {{{marketTrendSummary}}}
{{/if}}

Based on this information, provide your analysis in JSON format, adhering strictly to the following schema:
{{jsonSchema output}}`,
});

const aiInvestmentAnalysisFlow = ai.defineFlow(
  {
    name: 'aiInvestmentAnalysisFlow',
    inputSchema: InvestmentAnalysisInputSchema,
    outputSchema: InvestmentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
