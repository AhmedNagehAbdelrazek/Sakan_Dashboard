"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  error?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  error,
}: MultiSelectProps) {
  const [search, setSearch] = useState("");

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = useCallback(
    (value: string) => {
      if (selected.includes(value)) {
        onChange(selected.filter((v) => v !== value));
      } else {
        onChange([...selected, value]);
      }
    },
    [selected, onChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between font-normal",
            !selected.length && "text-muted-foreground",
            error && "border-destructive",
          )}
        >
          {selected.length
            ? `${selected.length} selected`
            : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        align="start"
        style={{ minWidth: "var(--radix-popover-trigger-width)" }}
      >
        <div className="p-2">
          <input
            autoFocus
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="p-2 text-sm text-muted-foreground">No results</p>
          ) : (
            filtered.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(opt.value)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  {opt.label}
                </label>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
