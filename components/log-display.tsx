import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Log, ProgressData, FileOperationData, CommandData } from '@/types/logs';
import { FileCode, Terminal, AlertTriangle, Loader2 } from 'lucide-react';

interface LogDisplayProps {
  logs: Log[];
  isLoading: boolean;
  error?: string | null;
  className?: string;
}

// Progress bar component for displaying step progress
function ProgressBar({ progress }: { progress: ProgressData }) {
  const { step, totalSteps } = progress;
  const percentage = Math.round((step / totalSteps) * 100);
  
  return (
    <div className="pl-4 mt-1 w-full">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>Progress</span>
        <span>{percentage}% ({step}/{totalSteps})</span>
      </div>
      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// File operation component for displaying file operations
function FileOperation({ fileData }: { fileData: FileOperationData }) {
  const { filePath, operation } = fileData;
  
  // Get color based on operation type
  const getOperationColor = () => {
    switch (operation) {
      case 'create':
        return 'text-green-400';
      case 'edit':
        return 'text-blue-400';
      case 'delete':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };
  
  // Get operation label
  const getOperationLabel = () => {
    switch (operation) {
      case 'create':
        return 'Created';
      case 'edit':
        return 'Edited';
      case 'delete':
        return 'Deleted';
      default:
        return operation;
    }
  };
  
  return (
    <div className="pl-4 mt-1 flex items-start">
      <FileCode className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-slate-400" />
      <div>
        <span className={cn("text-xs font-medium", getOperationColor())}>
          {getOperationLabel()}
        </span>
        <span className="text-xs text-slate-400 ml-1">
          {filePath}
        </span>
      </div>
    </div>
  );
}

// Command execution component for displaying commands
function CommandExecution({ commandData }: { commandData: CommandData }) {
  const { command, cwd } = commandData;
  
  return (
    <div className="pl-4 mt-1 flex items-start">
      <Terminal className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-slate-400" />
      <div className="flex flex-col">
        <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded">
          $ {command}
        </span>
        {cwd && (
          <span className="text-xs text-slate-500 mt-0.5">
            in {cwd}
          </span>
        )}
      </div>
    </div>
  );
}

// Build error component for displaying build errors
function BuildError({ errorMessage }: { errorMessage: string | number | boolean }) {
  // Convert the error message to a string
  const errorString = String(errorMessage);
  
  return (
    <div className="pl-4 mt-1 flex items-start">
      <AlertTriangle className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-red-500" />
      <div className="flex flex-col">
        <span className="text-xs font-medium text-red-500">Build Error</span>
        <div className="text-xs font-mono bg-slate-800 text-red-300 px-2 py-1 rounded mt-1 whitespace-pre-wrap overflow-auto max-h-[200px]">
          {errorString}
        </div>
      </div>
    </div>
  );
}

export function LogDisplay({ logs, isLoading, error, className }: LogDisplayProps) {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const prevLogsLengthRef = useRef(0);
  
  // Handle scroll events to determine if we should auto-scroll
  const handleScroll = useCallback(() => {
    if (logContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
      // Consider "at bottom" if within 30px of the bottom
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 30;
      setShouldAutoScroll(isAtBottom);
    }
  }, []);
  
  // Add scroll event listener
  useEffect(() => {
    const container = logContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  
  // Auto-scroll to bottom only when shouldAutoScroll is true and logs have changed
  useEffect(() => {
    // Only auto-scroll if logs length has increased (new logs added)
    const hasNewLogs = logs.length > prevLogsLengthRef.current;
    prevLogsLengthRef.current = logs.length;
    
    if (shouldAutoScroll && hasNewLogs && logContainerRef.current) {
      // Use setTimeout to ensure this happens after render
      setTimeout(() => {
        if (logContainerRef.current) {
          logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [logs, shouldAutoScroll]);

  // Get log type color
  const getLogTypeColor = (type: string) => {
    // Handle undefined or null type
    if (!type) return 'text-slate-300';
    
    switch (type.toLowerCase()) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      case 'info':
        return 'text-blue-400';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-slate-900/80 border border-slate-700 rounded-md overflow-hidden",
        className
      )}
    >
      <div className="px-3 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center">
        {isLoading ? (
          <Loader2 className="h-3 w-3 text-blue-400 mr-2 animate-spin" />
        ) : (
          <div className={cn(
            "h-2 w-2 rounded-full mr-2",
            error ? "bg-red-500" : logs.length > 0 ? "bg-green-500" : "bg-slate-500"
          )}></div>
        )}
        <h3 className="text-sm font-medium text-slate-200">
          {isLoading ? "Loading Logs..." : error ? "Error Loading Logs" : "Live Logs"}
        </h3>
      </div>
      
      <div 
        ref={logContainerRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        {/* Display Error Message */}
        {error && (
          <div className="text-red-400 italic py-2 px-1 bg-red-900/30 rounded border border-red-700/50 text-center">
            Error: {error}
          </div>
        )}

        {/* Display Loading Message when loading and no error */}
        {isLoading && !error && logs.length === 0 && (
          <div className="text-slate-500 italic py-2 text-center flex items-center justify-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Waiting for logs...
          </div>
        )}
        
        {/* Display No Logs Message when not loading, no error, and logs are empty */}
        {!isLoading && !error && logs.length === 0 && (
          <div className="text-slate-500 italic py-2 text-center">No logs generated yet.</div>
        )}

        {/* Render logs if available */}
        {logs.length > 0 && 
          logs.map((log, index) => (
            <div 
              // Use log.id if available for a more stable key, fallback to index
              key={log.id || index} 
              className="log-entry py-1 border-b border-slate-800/50 last:border-0"
            >
              <div className="flex flex-col space-y-1">
                <div className="flex items-start">
                  <span className="text-slate-500 mr-2 whitespace-nowrap">
                    {/* Check if timestamp is a valid Date object before calling methods */}
                    {log.timestamp instanceof Date ? log.timestamp.toLocaleTimeString() : String(log.timestamp)}
                  </span>
                  <span className={cn("font-semibold mr-2", getLogTypeColor(log.type))}>
                    [{log.type}]
                  </span>
                  <span className="text-slate-300 break-words">{log.message}</span>
                </div>
                
                {/* Render progress bar if progress data is available */}
                {log.data?.progress && 
                 typeof log.data.progress === 'object' && 
                 log.data.progress !== null &&
                 'step' in log.data.progress && 
                 'totalSteps' in log.data.progress && (
                  <ProgressBar progress={log.data.progress as ProgressData} />
                )}
                
                {/* Render file operation if available */}
                {log.data?.file && 
                 typeof log.data.file === 'object' && 
                 log.data.file !== null &&
                 'filePath' in log.data.file && 
                 'operation' in log.data.file && (
                  <FileOperation fileData={log.data.file as FileOperationData} />
                )}
                
                {/* Alternative way to display file operations from message content */}
                {!log.data?.file && log.message && log.message.includes('file:') && (
                  <div className="pl-4 mt-1 flex items-center text-blue-400">
                    <FileCode size={14} className="mr-1" />
                    <span className="text-xs">
                      {log.message.replace(/^Edited file: /, '')}
                    </span>
                  </div>
                )}
                
                {/* Render command execution if available */}
                {log.data?.command && 
                 typeof log.data.command === 'object' && 
                 log.data.command !== null &&
                 'command' in log.data.command && (
                  <CommandExecution commandData={log.data.command as CommandData} />
                )}
                
                {/* Render build error if available */}
                {log.data?.buildError && (
                  <BuildError errorMessage={log.data.buildError} />
                )}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
