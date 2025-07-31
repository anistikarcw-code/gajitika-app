'use server';
/**
 * @fileOverview Flow for calculating overtime hours within a specified date range, considering weekends, public holidays, and a 9-hour daily threshold.
 *
 * - calculateOvertimeHours - Function to calculate the total overtime hours.
 * - CalculateOvertimeHoursInput - Input type for the calculateOvertimeHours function.
 * - CalculateOvertimeHoursOutput - Return type for the calculateOvertimeHours function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateOvertimeHoursInputSchema = z.object({
  startDate: z.string().describe('The start date of the period (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date of the period (YYYY-MM-DD).'),
  publicHolidays: z.array(z.string()).describe('Array of public holiday dates (YYYY-MM-DD).'),
  dailyThresholdHours: z.number().default(9).describe('The number of hours after which overtime is calculated. Defaults to 9 hours.'),
});
export type CalculateOvertimeHoursInput = z.infer<typeof CalculateOvertimeHoursInputSchema>;

const CalculateOvertimeHoursOutputSchema = z.object({
  totalOvertimeHours: z.number().describe('The total number of overtime hours calculated.'),
});
export type CalculateOvertimeHoursOutput = z.infer<typeof CalculateOvertimeHoursOutputSchema>;

export async function calculateOvertimeHours(input: CalculateOvertimeHoursInput): Promise<CalculateOvertimeHoursOutput> {
  return calculateOvertimeHoursFlow(input);
}

const calculateOvertimeHoursPrompt = ai.definePrompt({
  name: 'calculateOvertimeHoursPrompt',
  input: {schema: CalculateOvertimeHoursInputSchema},
  output: {schema: CalculateOvertimeHoursOutputSchema},
  prompt: `You are an expert in labor law and time management.

  Given the start date: {{{startDate}}}, end date: {{{endDate}}}, a list of public holidays: {{#each publicHolidays}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}, and a daily threshold of {{{dailyThresholdHours}}} hours, calculate the total number of overtime hours.

  Consider that overtime hours are calculated for weekends, public holidays and any hours worked beyond the daily threshold.

  Return the total overtime hours.
  `,
});

const calculateOvertimeHoursFlow = ai.defineFlow(
  {
    name: 'calculateOvertimeHoursFlow',
    inputSchema: CalculateOvertimeHoursInputSchema,
    outputSchema: CalculateOvertimeHoursOutputSchema,
  },
  async input => {
    const {output} = await calculateOvertimeHoursPrompt(input);
    return output!;
  }
);
