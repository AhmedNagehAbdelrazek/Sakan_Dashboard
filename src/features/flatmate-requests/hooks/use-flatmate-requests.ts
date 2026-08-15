"use client";

import { useQuery } from "@tanstack/react-query";
import { flatmateRequestService } from "../services/flatmateRequestService";

export function useFlatmateRequests() {
  return useQuery({
    queryKey: ["flatmate-requests"],
    queryFn: () => flatmateRequestService.listFlatmateRequests(),
    retry: 1,
  });
}

export function useFlatmateRequestDetail(id: string | null) {
  return useQuery({
    queryKey: ["flatmate-requests", id],
    queryFn: () => flatmateRequestService.getFlatmateRequest(id as string),
    enabled: Boolean(id),
    retry: 1,
  });
}
