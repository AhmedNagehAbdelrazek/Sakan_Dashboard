"use client";

import { useQuery } from "@tanstack/react-query";
import { activityService } from "../services/activityService";

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => activityService.listActivities(),
    retry: 1,
  });
}

export function useActivityDetail(id: string | null) {
  return useQuery({
    queryKey: ["activities", id],
    queryFn: () => activityService.getActivity(id as string),
    enabled: Boolean(id),
    retry: 1,
  });
}
