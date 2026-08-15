"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "../services/applicationService";
import type { RejectApplicationInput } from "../types/application.types";

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: () => applicationService.listApplications(),
    retry: 1,
  });
}

export function useApplicationDetail(id: string | null) {
  return useQuery({
    queryKey: ["applications", id],
    queryFn: () => applicationService.getApplication(id as string),
    enabled: Boolean(id),
    retry: 1,
  });
}

export function useApplicationActions() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ["applications"] });

  const approve = useMutation({
    mutationFn: (id: string) => applicationService.approveApplication(id),
    onSuccess: invalidate,
  });

  const reject = useMutation({
    mutationFn: ({ id, input }: { id: string; input: RejectApplicationInput }) =>
      applicationService.rejectApplication(id, input),
    onSuccess: invalidate,
  });

  const complete = useMutation({
    mutationFn: (id: string) => applicationService.completeApplication(id),
    onSuccess: invalidate,
  });

  return { approve, reject, complete };
}
