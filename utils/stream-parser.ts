import { GenerateResponse } from "@/types/generation";
import { Log, LogMessage, StreamData, StreamParseResult, FileOperationData } from "@/types/logs";

/**
 * Parses Server-Sent Events (SSE) data from a stream chunk
 * 
 * @param chunk - The raw text chunk from the stream
 * @returns Object containing parsed logs, final data, and end status
 */
export function parseStreamData(chunk: string): StreamParseResult {
  const result: StreamParseResult = {
    logs: [],
    data: null,
    isEnd: false
  };
  
  // Check for logsComplete event
  if (chunk.includes('event: logsComplete')) {
    // This indicates logging is complete but not the entire response
    // We don't set isEnd=true here as we're waiting for the complete event
  }
  
  // Check for complete event (final successful response)
  if (chunk.includes('event: complete')) {
    result.isEnd = true;
    
    // Extract the data from the complete event
    const completeMatch = chunk.match(/event: complete\s*\ndata: (\{.*?\})(\n|$)/);
    if (completeMatch) {
      try {
        const completeData = JSON.parse(completeMatch[1]);
        if (completeData.response) {
          result.data = completeData.response as GenerateResponse;
        }
      } catch (error) {
        console.warn('Error parsing complete event data:', completeMatch[1], error);
      }
    }
  }
  
  // Check for error event
  if (chunk.includes('event: error')) {
    result.isEnd = true;
    
    // Extract the error data
    const errorMatch = chunk.match(/event: error\s*\ndata: (\{.*?\})(\n|$)/);
    if (errorMatch) {
      try {
        const errorData = JSON.parse(errorMatch[1]);
        if (errorData.error) {
          // Create a minimal error response
          result.data = {
            error: errorData.error,
            projectId: 'error',
            projectDir: '',
            deployUrl: '',
            generationSummary: {
              success: false,
              totalDurationMs: 0,
              fileCount: 0,
              attempts: 0,
              inputTokens: 0,
              outputTokens: 0,
              inputCost: 0,
              outputCost: 0,
              totalCost: 0,
              modelKey: 'unknown',
              hasActualLintErrors: false,
              timings: { total: 0 },
              outputTokensPerSecond: 0,
              lintError: '',
              buildError: ''
            }
          } as GenerateResponse;
        }
      } catch (error) {
        console.warn('Error parsing error event data:', errorMatch[1], error);
      }
    }
  }
  
  // For backward compatibility, also check for end event
  if (chunk.includes('event: end')) {
    result.isEnd = true;
    
    // Extract the final data payload that comes after the end event
    const parts = chunk.split('event: end');
    if (parts.length > 1) {
      const afterEndEvent = parts[1];
      const finalDataMatch = afterEndEvent.match(/data: (\{.*?\})(\n|$)/);
      if (finalDataMatch) {
        try {
          const finalData = JSON.parse(finalDataMatch[1]);
          // Check if this is the generation result data
          if ('projectDir' in finalData || 'deployUrl' in finalData || 'projectId' in finalData) {
            result.data = finalData as unknown as GenerateResponse;
          }
        } catch (error) {
          console.warn('Error parsing final data payload:', finalDataMatch[1], error);
        }
      }
    }
  }
  
  // Extract all complete SSE data messages
  // Each SSE message starts with 'data: ' and may be followed by an event
  // Using a more robust regex to handle various JSON formats
  const dataRegex = /data: (\{.*?\})(\n|$)/g;
  let match;
  
  while ((match = dataRegex.exec(chunk)) !== null) {
    try {
      // Extract and parse the JSON data
      const jsonStr = match[1].trim();
      console.debug('Processing SSE data chunk:', jsonStr);
      const streamData = JSON.parse(jsonStr) as StreamData;
      
      // Process log messages - simply pass them through without any duplicate checking
      if (streamData.logs) {
        const logMessage = streamData.logs;
        
        // Create a log entry for the UI
        const logEntry = {
          type: logMessage.level,
          message: logMessage.message,
          timestamp: new Date(logMessage.timestamp || Date.now()),
          data: logMessage.data || {} // Ensure data is always at least an empty object
        };
        
        // Add to results
        result.logs.push(logEntry);
      }
      
      // If there's an event field, process it as well
      if (streamData.event) {
        console.debug('Processing event:', streamData.event);
        // Handle specific events if needed
      }
      
      // Process file operations from message content if not in data
      if (streamData.logs?.message && 
          streamData.logs.message.includes('file:') && 
          (!streamData.logs.data || !streamData.logs.data.file)) {
        
        const message = streamData.logs.message;
        const fileMatch = message.match(/file:\s*(.+)/);
        if (fileMatch && fileMatch[1]) {
          const filePath = fileMatch[1].trim();
          let operation = 'edit';
          
          if (message.toLowerCase().includes('created')) {
            operation = 'create';
          } else if (message.toLowerCase().includes('deleted')) {
            operation = 'delete';
          }
          
          // Add file operation data
          const logEntry: Log = {
            type: streamData.logs.level,
            message: message,
            timestamp: new Date(streamData.logs.timestamp || Date.now()),
            data: {
              ...(streamData.logs.data || {}),
              file: {
                filePath,
                operation
              } as FileOperationData
            }
          };
          
          // Add to results
          result.logs.push(logEntry);
        }
      }
      
          // We no longer need to process regular data messages for final response
      // as the final response will come through the complete event
    } catch (error) {
      console.warn('Error parsing SSE data:', match[0], error);
    }
  }
  
  return result;
}
