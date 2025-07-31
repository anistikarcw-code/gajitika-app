'use server';

/**
 * @fileOverview A flow that calculates the number of normal workdays (Monday-Friday) within a date range, excluding public holidays.
 *
 * - calculateNormalWorkdays - A function that calculates the number of normal workdays.
 * - CalculateNormalWorkdaysInput - The input type for the calculateNormalWorkdays function.
 * - CalculateNormalWorkdaysOutput - The return type for the calculateNormalWorkdays function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateNormalWorkdaysInputSchema = z.object({
  startDate: z
    .string()
    .describe('The start date of the period to calculate, in ISO 8601 format (YYYY-MM-DD).'),
  endDate: z
    .string()
    .describe('The end date of the period to calculate, in ISO 8601 format (YYYY-MM-DD).'),
  publicHolidays: z
    .array(z.string())
    .describe(
      'An array of public holiday dates within the date range, in ISO 8601 format (YYYY-MM-DD).'
    ),
});
export type CalculateNormalWorkdaysInput = z.infer<typeof CalculateNormalWorkdaysInputSchema>;

const CalculateNormalWorkdaysOutputSchema = z.object({
  normalWorkdays: z
    .number()
    .describe(
      'The total number of normal workdays (Monday-Friday) within the specified date range, excluding public holidays.'
    ),
});
export type CalculateNormalWorkdaysOutput = z.infer<typeof CalculateNormalWorkdaysOutputSchema>;

export async function calculateNormalWorkdays(
  input: CalculateNormalWorkdaysInput
): Promise<CalculateNormalWorkdaysOutput> {
  return calculateNormalWorkdaysFlow(input);
}

const calculateNormalWorkdaysPrompt = ai.definePrompt({
  name: 'calculateNormalWorkdaysPrompt',
  input: {schema: CalculateNormalWorkdaysInputSchema},
  output: {schema: CalculateNormalWorkdaysOutputSchema},
  prompt: `You are a helpful assistant that calculates the number of normal workdays (Monday-Friday) between two dates, excluding public holidays.

  The start date is: {{{startDate}}}
  The end date is: {{{endDate}}}
  The public holidays are: {{#each publicHolidays}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Calculate the number of normal workdays between the start and end dates, excluding the public holidays.  Weekends are Saturday and Sunday and should not be included in the normal workdays count.

  Return only a valid JSON object with a single field called \"normalWorkdays\" which contains the integer number of normal workdays.
  `,
});

const calculateNormalWorkdaysFlow = ai.defineFlow(
  {
    name: 'calculateNormalWorkdaysFlow',
    inputSchema: CalculateNormalWorkdaysInputSchema,
    outputSchema: CalculateNormalWorkdaysOutputSchema,
  },
  async input => {
    const {output} = await calculateNormalWorkdaysPrompt(input);
    return output!;
  }
);
