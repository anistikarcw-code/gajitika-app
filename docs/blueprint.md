# **App Name**: Workday Calculator

## Core Features:

- Date Range Input: Input start and end dates for the calculation period.
- Non-working Day Configuration: Determine the type and duration of each non-working day: Full day, Half Day. Apply appropriate multipliers for each type of overtime when calculating total time.
- Public Holiday Integration: Check a national holiday API, such as https://date.nager.at/api/v3/publicholidays/{year}/{countryCode}, for the date range in question. Factor in the official national holidays to overtime calculations, assuming weekends+holidays are billable by the hour.
- Normal Workday Calculation: Use a tool to intelligently compute total normal working days (Monday-Friday) excluding any holidays.
- Overtime Calculation: Use a tool to intelligently calculate total overtime hours, taking into account weekends, public holidays and the 9-hour daily threshold.
- Results Display: Display a clear breakdown of normal working days and overtime hours.

## Style Guidelines:

- Primary color: Vibrant blue (#4285F4) to represent productivity and clarity.
- Background color: Light gray (#F5F5F5) for a clean and professional look.
- Accent color: Green (#34A853) to highlight important information, like the calculated time, and indicate 'go'.
- Body and headline font: 'Inter', a sans-serif font providing a modern, neutral, readable feel.
- Use simple and intuitive icons to represent dates, overtime, and holidays.
- Maintain a clean and organized layout with clear sections for input, calculations, and results.
- Subtle animations to indicate loading or successful calculation.