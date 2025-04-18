import { auth } from '@/lib/firebase';
import { debugFirebaseAuth, validateFirebaseUser } from '@/utils/auth-debug';

// Function to get the current backend URL based on user preference
function getBackendUrl(): string {
  // Check if we're in the browser and if the user has selected local backend
  if (typeof window !== 'undefined') {
    const useLocalBackend = localStorage.getItem('appily-local-backend') === 'true';
    if (useLocalBackend) {
      return 'http://localhost:3000';
    }
  }
  
  // Default to production backend
  return 'https://appily-agent-678356251626.us-central1.run.app';
}

/**
 * Triggers the backend code generation process.
 * 
 * @param prompt - The user's prompt.
 * @param modelKey - The AI model to use.
 * @param projectId - The unique ID for this generation project.
 * @param enhancePrompt - Whether to enhance the prompt on the backend.
 * @returns The project ID used for the request.
 * @throws If authentication fails or the API call returns an error.
 */
export async function triggerGeneration(
  prompt: string,
  modelKey: string,
  projectId: string,
  enhancePrompt: boolean = true
): Promise<{ projectId: string; initialStatus: string }> {
  console.log(`Triggering generation for projectId: ${projectId}, enhancePrompt: ${enhancePrompt}`);
  const forceLog = (message: string, data?: unknown) => console.log(`[triggerGeneration] ${message}`, data);

  try {
    forceLog('Starting triggerGeneration function');

    // 1. Authentication Check
    if (!auth) {
      forceLog('Firebase auth not initialized');
      throw new Error('Authentication error: Firebase not initialized');
    }
    await auth.currentUser?.getIdToken(true).catch(e => {
      forceLog('Failed to force refresh token', e);
    }); // Force refresh
    await debugFirebaseAuth(auth);
    if (!auth.currentUser) {
      forceLog('No Firebase user found - you need to sign in');
      throw new Error('Authentication required: Please sign in');
    }
    const validation = await validateFirebaseUser(auth.currentUser);
    if (!validation.isValid || !validation.token) {
      forceLog(`Firebase user validation failed: ${validation.message}`);
      throw new Error(`Authentication error: ${validation.message}`);
    }
    const authToken = validation.token.trim();
    forceLog(`Successfully validated Firebase user with token (length: ${authToken.length})`);

    // 2. Prepare API Request
    const backendUrl = getBackendUrl();
    forceLog(`Sending request to: ${backendUrl}/generate`);

    const requestBody = JSON.stringify({
      newPrompt: prompt,
      modelKey,
      clientProjectId: projectId, // Send the existing projectId
      enhancePrompt,
    });

    const requestInit: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json'
      },
      body: requestBody,
    };
    forceLog('Request headers:', Object.entries(requestInit.headers || {}));
    forceLog('Request body:', requestBody);

    // 3. Make API Call
    forceLog('Making request...');
    const response = await fetch(`${backendUrl}/generate`, requestInit);
    forceLog(`Response received - Status: ${response.status}`);

    // 4. Handle Response
    if (!response.ok) {
      let errorBody = 'Unknown error';
      try {
        errorBody = await response.text();
        forceLog(`Error response body: ${errorBody}`);
      } catch (e) {
        forceLog('Could not read error response body');
      }
      throw new Error(`HTTP error ${response.status}: ${errorBody}`);
    }

    // Expecting JSON response like { projectId: string, status: string } from backend
    const result = await response.json();
    forceLog('API call successful, response:', result);
    
    // Validate the response structure
    if (!result.projectId || !result.status) {
      throw new Error('Invalid response from server. Missing projectId or status.');
    }
    
    // It's crucial that the backend returns the *same* projectId we sent
    if (result.projectId !== projectId) {
      console.warn(`Backend returned projectId ${result.projectId} which differs from client-sent ${projectId}. Using client ID.`);
      // Optionally throw an error here if this mismatch is critical
    }

    return { projectId: projectId, initialStatus: result.status }; // Return the ID and initial status

  } catch (error) {
    forceLog('Error in triggerGeneration:', error);
    // Re-throw the error to be handled by the calling component
    throw error instanceof Error ? error : new Error(String(error));
  }
}

/**
 * DEPRECATED: Streams a response using Server-Sent Events (SSE).
 * Use Firestore listeners (`useProjectUpdates`) instead.
 * 
 * @deprecated Use Firestore listeners instead of SSE.
 * @param onError - Callback function called when an error occurs
 */
export async function streamResponse(
  onError: (error: Error) => void
): Promise<void> {
  console.warn("DEPRECATED: streamResponse is called. Use triggerGeneration and Firestore listeners instead.");
  onError(new Error("streamResponse is deprecated. Please migrate to triggerGeneration and useProjectUpdates."));
  // Removed the internal forceLog definition and other unused code/stubs
}