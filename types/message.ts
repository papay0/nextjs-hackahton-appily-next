/**
 * Represents a chat message in the application.
 */
export interface Message {
  /** Unique identifier for the message */
  id: string;
  /** The role of the message sender (user or assistant) */
  role: "user" | "assistant";
  /** The content of the message */
  content: string;
  /** Timestamp when the message was created */
  timestamp: Date;
  /** Optional type for assistant messages (backend status or LLM text) */
  type?: 'status_update' | 'llm_text';
}
