"use client";

import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

function parseUtc(value: string): Date | undefined {
  if (!value) return undefined;
  const [datePart, timePart = "00:00"] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.replace("Z", "").split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hours, minutes));
}

// Shift a UTC Date so its local time components match the original UTC values.
// This lets us use date-fns format (which reads local time) to output UTC strings.
function toLocal(date: Date): Date {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
  );
}

function formatUtc(date: Date, fmt: string): string {
  return format(toLocal(date), fmt);
}

// Calendar fires onSelect with a local-midnight Date; lift it to UTC-midnight
function toUtcMidnight(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function DateTimePicker({ value, onChange, error }: DateTimePickerProps) {
  const date = useMemo(() => parseUtc(value), [value]);

  const handleDateSelect = useCallback(
    (day: Date | undefined) => {
      if (!day) return;
      const utcDay = toUtcMidnight(day);
      const time = date ? formatUtc(date, "HH:mm") : "00:00";
      onChange(formatUtc(utcDay, "yyyy-MM-dd") + "T" + time + ":00Z");
    },
    [date, onChange],
  );

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = e.target.value;
      const dayStr = date ? formatUtc(date, "yyyy-MM-dd") : formatUtc(new Date(), "yyyy-MM-dd");
      onChange(dayStr + "T" + time + ":00Z");
    },
    [date, onChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            error && "border-destructive",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatUtc(date, "PPP HH:mm") : <span>Pick date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          autoFocus
        />
        <div className="border-t p-3">
          <input
            type="time"
            value={date ? formatUtc(date, "HH:mm") : "00:00"}
            onChange={handleTimeChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
