"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  Calendar as CalendarIcon,
  CalendarDays,
  Loader2,
  AlertTriangle,
  Timer,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

import { calculateNormalWorkdays } from "@/ai/flows/calculate-normal-workdays";
import { calculateOvertimeHours } from "@/ai/flows/calculate-overtime-hours";

interface CalculationResult {
  normalWorkdays: number;
  overtimeHours: number;
}

export default function WorkdayCalculator() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [result, setResult] = React.useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCalculate = async () => {
    if (!date?.from || !date?.to) {
      setError("Please select a valid date range.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const startYear = date.from.getFullYear();
      const endYear = date.to.getFullYear();
      const years = [];
      for (let y = startYear; y <= endYear; y++) {
        years.push(y);
      }

      const holidayPromises = years.map((year) =>
        fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/ID`).then(
          (res) => {
            if (!res.ok) throw new Error(`Failed to fetch holidays for ${year}`);
            return res.json();
          }
        )
      );

      const holidayArrays = await Promise.all(holidayPromises);
      const publicHolidays = holidayArrays.flat().map((holiday: any) => holiday.date);

      const startDateStr = format(date.from, "yyyy-MM-dd");
      const endDateStr = format(date.to, "yyyy-MM-dd");

      const [normalDaysResult, overtimeResult] = await Promise.all([
        calculateNormalWorkdays({
          startDate: startDateStr,
          endDate: endDateStr,
          publicHolidays: publicHolidays,
        }),
        calculateOvertimeHours({
          startDate: startDateStr,
          endDate: endDateStr,
          publicHolidays: publicHolidays,
          dailyThresholdHours: 9,
        }),
      ]);

      setResult({
        normalWorkdays: normalDaysResult.normalWorkdays,
        overtimeHours: overtimeResult.totalOvertimeHours,
      });
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline tracking-tight">
          Workday Calculator
        </CardTitle>
        <CardDescription>
          Calculate workdays and overtime based on Indonesian holidays.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2 text-center">
          <Label htmlFor="date" className="font-semibold">Select Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handleCalculate} disabled={isLoading || !date?.from || !date?.to} size="lg" className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Calculate
        </Button>
      </CardContent>

      <CardFooter className="flex min-h-[180px] flex-col items-center justify-center gap-4">
        {isLoading && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground transition-opacity duration-300">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-lg">Calculating...</span>
            </div>
        )}

        {error && (
          <Alert variant="destructive" className="w-full">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Calculation Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-center animate-in fade-in duration-500">
            <Card className="bg-secondary/50 p-6">
              <CardHeader className="p-0">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-5 w-5" />
                    <CardTitle className="text-lg font-medium">Normal Workdays</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <p className="text-5xl font-bold text-accent">{result.normalWorkdays}</p>
                <p className="text-sm text-muted-foreground">days</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/50 p-6">
              <CardHeader className="p-0">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Timer className="h-5 w-5" />
                    <CardTitle className="text-lg font-medium">Overtime</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <p className="text-5xl font-bold text-accent">{result.overtimeHours}</p>
                <p className="text-sm text-muted-foreground">hours</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
