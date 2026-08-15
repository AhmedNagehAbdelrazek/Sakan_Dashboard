"use client";

import { useState, useCallback } from "react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DateRange {
  from: string;
  to: string;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

interface Preset {
  label: string;
  getValue: () => DateRange;
}

const presets: Preset[] = [
  {
    label: "Today",
    getValue: () => {
      const now = new Date();
      return {
        from: format(startOfDay(now), "yyyy-MM-dd"),
        to: format(endOfDay(now), "yyyy-MM-dd"),
      };
    },
  },
  {
    label: "Yesterday",
    getValue: () => {
      const yesterday = subDays(new Date(), 1);
      return {
        from: format(startOfDay(yesterday), "yyyy-MM-dd"),
        to: format(endOfDay(yesterday), "yyyy-MM-dd"),
      };
    },
  },
  {
    label: "Last 7 Days",
    getValue: () => {
      const today = new Date();
      return {
        from: format(startOfDay(subDays(today, 6)), "yyyy-MM-dd"),
        to: format(endOfDay(today), "yyyy-MM-dd"),
      };
    },
  },
  {
    label: "Last 30 Days",
    getValue: () => {
      const today = new Date();
      return {
        from: format(startOfDay(subDays(today, 29)), "yyyy-MM-dd"),
        to: format(endOfDay(today), "yyyy-MM-dd"),
      };
    },
  },
];

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value.from ? new Date(value.from) : undefined,
  );

  const handlePreset = useCallback(
    (preset: Preset) => {
      const range = preset.getValue();
      onChange(range);
      setSelectedDate(new Date(range.from));
      setOpen(false);
    },
    [onChange],
  );

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const from = format(startOfDay(date), "yyyy-MM-dd");
      const to = format(endOfDay(date), "yyyy-MM-dd");
      onChange({ from, to });
    }
  };

  const displayLabel =
    value.from && value.to
      ? `${format(new Date(value.from), "MMM d, yyyy")} - ${format(new Date(value.to), "MMM d, yyyy")}`
      : "Select date range";

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("w-[260px] justify-start text-left font-normal")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="truncate">{displayLabel}</span>
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="border-r p-2">
              <div className="flex flex-col gap-1">
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => handlePreset(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            <Calendar mode="single" selected={selectedDate} onSelect={handleCalendarSelect} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
