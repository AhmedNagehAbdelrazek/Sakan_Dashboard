"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateUserInput, User } from "../types/user.types";
import { userService } from "../services/userService";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => userService.listUsers(),
    retry: 1,
  });
}

export function useUserDetail(id: string | null) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userService.getUser(id as string),
    enabled: Boolean(id),
    retry: 1,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      userService.updateUser(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export type { User, UpdateUserInput };
