"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n/client";

export interface EntityFilterOption {
  value: string;
  labelKey: string;
}

export interface EntityFilterField {
  key: string;
  placeholderKey: string;
  options: EntityFilterOption[];
  value: string;
  onValueChange: (value: string) => void;
}

interface EntityToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholderKey: string;
  filters?: EntityFilterField[];
  onAddClick?: () => void;
  addLabelKey?: string;
}

export function EntityToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholderKey,
  filters = [],
  onAddClick,
  addLabelKey,
}: EntityToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[200px] flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t(searchPlaceholderKey)}
          className="pl-8"
          aria-label={t(searchPlaceholderKey)}
        />
      </div>
      {filters.map((filter) => (
        <Select key={filter.key} value={filter.value} onValueChange={filter.onValueChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t(filter.placeholderKey)} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {onAddClick && addLabelKey && (
        <Button onClick={onAddClick}>
          <Plus />
          {t(addLabelKey)}
        </Button>
      )}
    </div>
  );
}
