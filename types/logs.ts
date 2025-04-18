import { GenerateResponse } from "./generation";

/**
 * Log levels supported by the backend
 */
export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

/**
 * Progress data structure for logs
 */
export interface ProgressData {
  step: number;
  totalSteps: number;
}

/**
 * File operation data structure for logs
 */
export interface FileOperationData {
  filePath: string;
  operation: 'create' | 'edit' | 'delete';
}

/**
 * Command data structure for logs
 */
export interface CommandData {
  command: string;
  cwd?: string;
}

/**
 * Log data structure - can contain various data types
 */
export type LogData = {
  progress?: ProgressData;
  file?: FileOperationData;
  command?: CommandData;
  buildError?: string; // Build error details
  // Add other specific data types here as needed
  // fileCount?: number;
  // duration?: number;
} | Record<string, string | number | boolean | null>; // Allow simple key-value pairs

/**
 * Log message format from the backend
 */
export interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: LogData;
}

/**
 * Log interface for UI display
 */
export interface Log {
  id?: string; // Add optional ID for mapping from Firestore
  type: string; // Maps to level in LogMessage
  message: string;
  timestamp: Date; // Changed from string to Date
  data?: LogData;
}

/**
 * Stream data format from the backend
 */
export interface StreamData {
  logs?: LogMessage;
  event?: string;
  data?: any; // For event data
  // Other fields that might be in the stream
}

/**
 * Result of parsing a stream chunk
 */
export interface StreamParseResult {
  logs: Log[];
  data: GenerateResponse | null;
  isEnd: boolean;
}
