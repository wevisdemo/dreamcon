export interface Writer {
  id: string;
  event_id: string;
  created_at: Date;
  expired_at: Date;
}

export type CreateWriterDBPayload = Omit<Writer, "id">;

export interface CreateWritePayload {
  event_id: string;
}
