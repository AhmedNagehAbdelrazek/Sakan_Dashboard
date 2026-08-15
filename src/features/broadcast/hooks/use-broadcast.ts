"use client";

import { useMutation } from "@tanstack/react-query";
import { broadcastService } from "../services/broadcastService";
import type { BroadcastInput } from "../types/broadcast.types";

export function useBroadcast() {
  return useMutation({
    mutationFn: (input: BroadcastInput) => broadcastService.sendBroadcast(input),
  });
}
