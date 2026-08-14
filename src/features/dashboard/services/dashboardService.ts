import { apiEnvelopeSchema } from "../schemas/dashboard.schema";

export async function fetchWidget(source: string): Promise<unknown> {
  const response = await fetch(source);
  if (!response.ok) {
    throw new Error(`Widget request failed (${response.status})`);
  }

  const payload: unknown = await response.json();
  const envelope = apiEnvelopeSchema.safeParse(payload);

  if (!envelope.success) {
    throw new Error("Invalid widget data envelope");
  }

  if (envelope.data.status !== "success") {
    throw new Error(envelope.data.message ?? "Widget request failed");
  }

  return envelope.data.data;
}
