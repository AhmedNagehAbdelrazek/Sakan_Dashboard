"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertyService } from "../services/propertyService";
import type { PropertyState } from "../types/property.types";

export function useProperties(state: PropertyState | "all" = "all") {
  return useQuery({
    queryKey: ["properties", state],
    queryFn: () => propertyService.listProperties(state),
    retry: 1,
  });
}

export function usePropertyActions() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ["properties"] });

  const approve = useMutation({
    mutationFn: (id: string) => propertyService.approveProperty(id),
    onSuccess: invalidate,
  });

  const decline = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      propertyService.declineProperty(id, reason),
    onSuccess: invalidate,
  });

  const reopen = useMutation({
    mutationFn: (id: string) => propertyService.reopenProperty(id),
    onSuccess: invalidate,
  });

  return { approve, decline, reopen };
}
