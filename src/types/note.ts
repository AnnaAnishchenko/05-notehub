export type NoteTag = "Todo" | "Personal" | "Work" | "Shopping" | "Meeting";

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag;
}
