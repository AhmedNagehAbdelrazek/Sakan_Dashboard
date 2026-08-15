import type { BroadcastInput, BroadcastResult } from "../types/broadcast.types";

export const broadcastService = {
  sendBroadcast: async (input: BroadcastInput): Promise<BroadcastResult> => {
    const response = await fetch("/api/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const payload = (await response.json()) as {
      status: string;
      data?: BroadcastResult;
      message?: string;
    };

    if (!response.ok || payload.status !== "success") {
      throw new Error(payload.message ?? "Broadcast failed");
    }

    return payload.data as BroadcastResult;
  },
};
