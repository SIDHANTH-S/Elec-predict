import * as React from "react";
import { format, addYears, subYears, addDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangePickerProps {
  className?: string;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

type DatePreset = {
  name: string;
  getValue: () => DateRange;
};

export function DateRangePicker({
  className,
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<Date>(dateRange?.from ?? new Date());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  
  const handleYearChange = (year: string) => {
    const newDate = new Date(date);
    newDate.setFullYear(parseInt(year));
    setDate(newDate);
  };

  const handlePreviousYear = () => {
    setDate(prevDate => subYears(prevDate, 1));
  };

  const handleNextYear = () => {
    setDate(prevDate => addYears(prevDate, 1));
  };
  
  const datePresets: DatePreset[] = React.useMemo(() => [
    {
      name: "Today",
      getValue: () => {
        const today = new Date();
        return { from: today, to: today };
      },
    },
    {
      name: "Last 7 days",
      getValue: () => {
        const today = new Date();
        return { from: addDays(today, -6), to: today };
      },
    },
    {
      name: "Last 30 days",
      getValue: () => {
        const today = new Date();
        return { from: addDays(today, -29), to: today };
      },
    },
    {
      name: "This month",
      getValue: () => {
        const today = new Date();
        return { from: startOfMonth(today), to: endOfMonth(today) };
      },
    },
    {
      name: "This year",
      getValue: () => {
        const today = new Date();
        return { from: startOfYear(today), to: endOfYear(today) };
      },
    },
  ], []);

  const handlePresetClick = (preset: DatePreset) => {
    const range = preset.getValue();
    onDateRangeChange(range);
    setDate(range.from);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal bg-white/80 border-border hover:bg-white/90 transition-all duration-300",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 glass-panel" align="start">
          <div className="flex flex-col sm:flex-row">
            <div className="p-3 border-b sm:border-b-0 sm:border-r border-gray-200">
              <p className="mb-2 text-sm font-medium">Quick select</p>
              <div className="flex flex-col space-y-1">
                {datePresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="ghost"
                    size="sm"
                    className="justify-start font-normal hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between p-3 border-b">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handlePreviousYear}
                  className="hover:bg-muted rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Year</span>
                </Button>
                
                <Select value={date.getFullYear().toString()} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder={date.getFullYear().toString()} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleNextYear}
                  className="hover:bg-muted rounded-full"
                  disabled={date.getFullYear() >= currentYear}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Year</span>
                </Button>
              </div>
              
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date}
                month={date}
                onMonthChange={setDate}
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
