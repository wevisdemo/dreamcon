export interface Writer {
  id: string;
  event_id: string;
  is_permanent?: boolean;
  created_at: Date;
  expired_at?: Date;
}

export type CreateWriterDBPayload = Omit<Writer, 'id'>;

export interface CreateWritePayload {
  event_id: string;
  is_permanent?: boolean;
}
