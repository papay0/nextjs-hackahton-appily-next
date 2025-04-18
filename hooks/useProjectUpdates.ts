import { useEffect, useState, useRef } from 'react';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Assuming your firebase init is here
import { Log } from '@/types/logs'; // Assuming your Log type is here
import { Message } from '@/types/message'; // Import Message type
import { GenerateResponse } from '@/types/generation'; // Assuming your GenerateResponse type is here

// Define the structure of the project document in Firestore
interface ProjectMetadata {
  status: 'pending' | 'running' | 'complete' | 'error';
  startedAt?: Timestamp;
  updatedAt?: Timestamp;
  // Add other metadata fields if they exist in the main project doc
  [key: string]: unknown;
}

// Define the structure of a log document from Firestore before mapping
interface FirestoreLogDoc {
  level: Log['type'];
  message: string;
  createdAt: Timestamp; // Use createdAt as the primary ordering timestamp from FirestoreLogger
  timestamp: string; // ISO string timestamp also sent by logger
  data?: Log['data'];
}

// Define the structure of a chat message document from Firestore
interface FirestoreChatMessage {
  sender: 'human' | 'assistant';
  content: string;
  createdAt: Timestamp;
  timestamp: string;
  type?: 'status_update' | 'llm_text';
}

// Define the possible states for the initial check
export type InitialCheckStatus = 'checking' | 'exists' | 'not_found' | 'timed_out' | 'error';

export function useProjectUpdates(projectId: string | null) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [projectMetadata, setProjectMetadata] = useState<ProjectMetadata | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(!!projectId);
  const [error, setError] = useState<Error | null>(null);
  const [initialCheckStatus, setInitialCheckStatus] = useState<InitialCheckStatus>('checking');
  const [initialCheckError, setInitialCheckError] = useState<Error | null>(null);

  // Use refs to manage async operations and state within callbacks/timeouts
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeCallbacksRef = useRef<(() => void)[]>([]);
  const isMountedRef = useRef(true);
  const currentProjectIdRef = useRef<string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    currentProjectIdRef.current = projectId;

    if (!projectId) {
      setLoading(false);
      setLogs([]);
      setChatMessages([]);
      setProjectMetadata(null);
      setResult(null);
      setError(null);
      setInitialCheckStatus('checking'); // Reset status when projectId is null
      setInitialCheckError(null);
      return;
    }

    // Reset state for the new projectId check
    console.log(`Starting updates for projectId: ${projectId}`);
    setLoading(true);
    setError(null);
    setInitialCheckStatus('checking');
    setInitialCheckError(null);
    setLogs([]);
    setChatMessages([]);
    setProjectMetadata(null);
    setResult(null);

    const performInitialCheckAndListen = async () => {
      if (!isMountedRef.current || !projectId || currentProjectIdRef.current !== projectId) return;

      const projectDocRef = doc(db, `projects/${projectId}`);

      try {
        // 1. Initial Get Doc
        console.log(`Performing initial getDoc for projectId: ${projectId}`);
        const docSnap = await getDoc(projectDocRef);

        if (!isMountedRef.current || currentProjectIdRef.current !== projectId) return;

        if (docSnap.exists()) {
          console.log(`Initial check: Project ${projectId} exists.`);
          if (isMountedRef.current && currentProjectIdRef.current === projectId) {
            setInitialCheckStatus('exists');
            setProjectMetadata(docSnap.data() as ProjectMetadata);
            setLoading(false);
          }
        } else {
          console.log(`Initial check: Project ${projectId} does not exist. Setting up listener and timeout.`);
          if (isMountedRef.current && currentProjectIdRef.current === projectId) {
            setInitialCheckStatus('not_found');
            setLoading(true);
          }

          // Start timeout only if it doesn't exist initially
          timeoutRef.current = setTimeout(() => {
            // Check status again inside timeout to prevent race conditions
            setInitialCheckStatus((currentStatus) => {
              if (isMountedRef.current && currentProjectIdRef.current === projectId && currentStatus === 'not_found') {
                console.warn(`Timeout waiting for project ${projectId} to be created.`);
                const timeoutError = new Error(`Timeout: Project ${projectId} creation took too long.`);
                if (isMountedRef.current && currentProjectIdRef.current === projectId) {
                  setError(timeoutError);
                  setLoading(false);
                }
                return 'timed_out';
              }
              return currentStatus; // No change if status is not 'not_found' anymore
            });
          }, 60000); // 60 second timeout
        }

        // 2. Setup Listeners (only after getDoc)
        console.log(`Setting up listeners after initial check for ${projectId}`);

        // Project Listener
        const unsubscribeProject = onSnapshot(
          projectDocRef,
          (snapshot) => {
            if (!isMountedRef.current || currentProjectIdRef.current !== projectId) return;

            // Clear timeout if it exists and we received an update
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }

            if (snapshot.exists()) {
              const data = snapshot.data() as ProjectMetadata;
              console.log("Project metadata update:", data);
              if (isMountedRef.current && currentProjectIdRef.current === projectId) {
                setProjectMetadata(data);
                // If it was previously 'not_found' or 'checking', it now 'exists'
                setInitialCheckStatus((prevStatus) => 
                  prevStatus === 'not_found' || prevStatus === 'checking' ? 'exists' : prevStatus
                );
                // If we just found the doc after 'not_found', loading is now false
                // If it existed initially ('exists'), loading should already be false
                setLoading((prevLoading) => initialCheckStatus === 'not_found' ? false : prevLoading);
                if (isMountedRef.current && currentProjectIdRef.current === projectId) {
                  setError(null);
                }
              }
            } else {
              console.warn(`Listener update: Project document projects/${projectId} does not exist.`);
              if (isMountedRef.current && currentProjectIdRef.current === projectId) {
                setProjectMetadata(null);
                // Determine the correct error/status based on initial check
                setInitialCheckStatus((prevStatus) => {
                  if (prevStatus === 'exists') {
                    // It existed before, now it's gone (deleted)
                    if (isMountedRef.current && currentProjectIdRef.current === projectId) {
                      setError(new Error(`Project ${projectId} was deleted.`));
                      setLoading(false);
                    }
                    return 'not_found'; // Or a new 'deleted' status?
                  } else if (prevStatus === 'timed_out') {
                    // Keep the timed_out status and error
                    if (isMountedRef.current && currentProjectIdRef.current === projectId) {
                      setLoading(false);
                    }
                    return 'timed_out';
                  } else {
                    // Still 'not_found' or 'checking', keep waiting (unless timeout hits)
                    // Don't set error here, wait for timeout or explicit error
                    return prevStatus;
                  }
                });
              }
            }
          },
          (err) => {
            if (!isMountedRef.current || currentProjectIdRef.current !== projectId) return;
            console.error(`Error listening to project doc (${projectId}):`, err);
            const listenerError = err instanceof Error ? err : new Error(String(err));
            if (isMountedRef.current && currentProjectIdRef.current === projectId) {
              setError(listenerError);
              setLoading(false);
              setInitialCheckStatus('error'); // Listener error is a definitive error state
            }
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }
        );
        unsubscribeCallbacksRef.current.push(unsubscribeProject);

        // Logs Listener
        const logsQuery = query(
          collection(db, `projects/${projectId}/logs`),
          orderBy('createdAt', 'asc')
        );
        const unsubscribeLogs = onSnapshot(
          logsQuery,
          (snapshot) => {
            if (!isMountedRef.current || currentProjectIdRef.current !== projectId) return;
            const newLogs: Log[] = snapshot.docs.map((doc) => {
              const data = doc.data() as FirestoreLogDoc;
              return {
                id: doc.id,
                type: data.level,
                message: data.message,
                timestamp: data.createdAt ? data.createdAt.toDate() : new Date(data.timestamp),
                data: data.data,
              };
            });
            console.log(`Received ${newLogs.length} logs for ${projectId}`);
            if (isMountedRef.current && currentProjectIdRef.current === projectId) {
              setLogs(newLogs);
            }
          },
          (err) => {
            if (!isMountedRef.current || currentProjectIdRef.current !== projectId) return;
            console.error(`Error listening to logs collection (${projectId}):`, err);
            // Optionally set a general error, but maybe project listener error is enough
            // if (isMountedRef.current && currentProjectIdRef.current === projectId) { 
            //   setError(err instanceof Error ? err : new Error(String(err))); 
            // }
          }
        );
        unsubscribeCallbacksRef.current.push(unsubscribeLogs);

        // Chat Listener
        try {
          const chatQuery = query(
            collection(db, `projects/${projectId}/chat`),
            orderBy('createdAt', 'asc')
          );
          const unsubscribeChat = onSnapshot(
            chatQuery,
            (snapshot) => {
              if (!isMountedRef.current || currentProjectIdRef.current !== projectId) return;
              const newChatMessages: Message[] = snapshot.docs.map((doc) => {
                const data = doc.data() as FirestoreChatMessage;
                return {
                  id: doc.id,
                  role: data.sender === 'human' ? 'user' : 'assistant',
                  content: data.content,
                  timestamp: data.createdAt.toDate(), // Use Firestore timestamp for display order
                  type: data.type,
                };
              });
              console.log(`Received ${newChatMessages.length} chat messages for ${projectId}`);
              if (isMountedRef.current && currentProjectIdRef.current === projectId) {
                setChatMessages(newChatMessages);
              }
            },
            (err) => {
              if (!isMountedRef.current || currentProjectIdRef.current !== projectId) return;
              console.error(`Error listening to chat collection (${projectId}):`, err);
              // Decide if chat listener errors should set the main error state
              // setError(err instanceof Error ? err : new Error(String(err))); 
            }
          );
          unsubscribeCallbacksRef.current.push(unsubscribeChat);
        } catch (e) {
          console.error("Failed to create chat listener:", e);
          // Optionally handle setup error
          // if (isMountedRef.current && currentProjectIdRef.current === projectId) { ... }
        }

        // Result Listener
        const resultDocRef = doc(db, `projects/${projectId}/result/data`);
        const unsubscribeResult = onSnapshot(
          resultDocRef,
          (snapshot) => {
            if (!isMountedRef.current || currentProjectIdRef.current !== projectId) return;
            if (snapshot.exists()) {
              const data = snapshot.data() as GenerateResponse;
              console.log("Project result update:", data);
              if (isMountedRef.current && currentProjectIdRef.current === projectId) {
                setResult(data);
              }
            } else {
              console.log(`Result document projects/${projectId}/result/data does not exist yet.`);
            }
          },
          (err) => {
            if (!isMountedRef.current || currentProjectIdRef.current !== projectId) return;
            console.error(`Error listening to result document (${projectId}):`, err);
            // Decide if result listener errors should set the main error state
            // setError(err instanceof Error ? err : new Error(String(err))); 
          }
        );
        unsubscribeCallbacksRef.current.push(unsubscribeResult);
      } catch (err) {
        if (!isMountedRef.current || currentProjectIdRef.current !== projectId) return;
        console.error(`Error performing initial check and setup listeners for projectId: ${projectId}`, err);
        const setupError = err instanceof Error ? err : new Error(String(err));
        if (isMountedRef.current && currentProjectIdRef.current === projectId) {
          setError(setupError);
          setLoading(false);
          setInitialCheckStatus('error'); // Setup error is a definitive error state
        }
      }
    };

    performInitialCheckAndListen();

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      unsubscribeCallbacksRef.current.forEach((unsubscribe) => unsubscribe());
    };
  }, [projectId]);

  return {
    logs,
    chatMessages,
    projectMetadata,
    result,
    loading,
    error,
    initialCheckStatus,
    initialCheckError,
    projectStatus: projectMetadata?.status ?? null,
  };
}
