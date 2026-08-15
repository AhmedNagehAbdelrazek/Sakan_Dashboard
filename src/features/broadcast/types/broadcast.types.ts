export interface BroadcastInput {
  title: string;
  body?: string;
  type?: string;
}

export interface BroadcastResult {
  message: string;
  recipients: number;
}
