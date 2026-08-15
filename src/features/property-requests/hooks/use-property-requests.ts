"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertyRequestService } from "../services/propertyRequestService";
import type { PropertyRequestStatus } from "../types/propertyRequest.types";

export function usePropertyRequests() {
  return useQuery({
    queryKey: ["property-requests"],
    queryFn: () => propertyRequestService.listPropertyRequests(),
    retry: 1,
  });
}

export function usePropertyRequestDetail(id: string | null) {
  return useQuery({
    queryKey: ["property-requests", id],
    queryFn: () => propertyRequestService.getPropertyRequest(id as string),
    enabled: Boolean(id),
    retry: 1,
  });
}

export function usePropertyRequestStatusUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PropertyRequestStatus }) =>
      propertyRequestService.updatePropertyRequestStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["property-requests"] });
    },
  });
}
