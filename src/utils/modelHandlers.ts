import * as ort from 'onnxruntime-web';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// Configure ONNX Runtime WASM paths to use official CDN
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@latest/dist/';

// ============================================
// MODEL CONFIGURATION
// ============================================

const ONE_HAND_MODEL_PATH = '/models/one_hand_mudra.onnx';
const ONE_HAND_LABELS_PATH = '/models/one_hand_mudra_labels.json';
const ONE_HAND_API_ENDPOINT = 'https://prathvichavan-onehand-hand-gesture.hf.space/predict';
const TWO_HAND_API_ENDPOINT = 'https://prathvichavan-two-hand-mudra-api.hf.space/predict';

let oneHandSession: ort.InferenceSession | null = null;
let oneHandLabels: string[] = [];
let handLandmarker: HandLandmarker | null = null;
let isApiWarmed = false;
let lastWakeAttempt = 0;

export interface ClassificationResult {
  predictedMudra: string;
  confidence: number;
  mudraId: string;
}

export interface WakeUpResult {
  success: boolean;
  message: string;
  responseTime?: number;
  endpoint?: string;
}

// ============================================
// API WARMING
// ============================================

/**
 * Warms up the API by sending a health check request.
 * Railway apps go to sleep after inactivity, so this wakes them up.
 */
export async function warmUpApi(): Promise<boolean> {
  if (isApiWarmed) return true;
  
  try {
    console.log('🔥 Warming up API...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for cold start
    
    const response = await fetch(ONE_HAND_API_ENDPOINT.replace('/predict', '/health'), {
      method: 'GET',
      signal: controller.signal
    }).catch(() => {
      // If health endpoint doesn't exist, that's okay
      return null;
    });
    
    clearTimeout(timeoutId);
    isApiWarmed = true;
    console.log('✅ API warmed up successfully');
    return true;
  } catch (error) {
    console.warn('⚠️ API warm-up failed (this is okay):', error);
    // Still mark as warmed so we don't keep trying
    isApiWarmed = true;
    return false;
  }
}

/**
 * Wakes up the Hugging Face API by sending lightweight dummy requests.
 * Handles cases where the API may be in sleep mode due to inactivity.
 */
export async function wakeUpApi(): Promise<WakeUpResult> {
  // Rate limiting: don't allow wake attempts more than once every 30 seconds
  const now = Date.now();
  if (now - lastWakeAttempt < 30000) {
    return {
      success: false,
      message: 'Please wait before trying again (rate limited)'
    };
  }
  lastWakeAttempt = now;

  console.log('🔄 Attempting to wake up Hugging Face API...');
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout for wake
    
    // Try both endpoints in parallel
    const wakePromises = [
      // Try one-hand endpoint
      fetch(ONE_HAND_API_ENDPOINT.replace('/predict', '/health'), {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }).catch(() => {
        // If health endpoint fails, try a lightweight POST to predict
        return fetch(ONE_HAND_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ wake: true }), // Dummy payload
          signal: controller.signal
        });
      }),
      
      // Try two-hand endpoint
      fetch(TWO_HAND_API_ENDPOINT.replace('/predict', '/health'), {
        method: 'GET', 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }).catch(() => {
        // If health endpoint fails, try a lightweight POST to predict
        return fetch(TWO_HAND_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ wake: true }), // Dummy payload
          signal: controller.signal
        });
      })
    ];
    
    // Wait for at least one endpoint to respond
    const results = await Promise.allSettled(wakePromises);
    clearTimeout(timeoutId);
    
    const responseTime = Date.now() - startTime;
    const successfulResults = results.filter(r => r.status === 'fulfilled' && r.value?.ok);
    
    if (successfulResults.length > 0) {
      isApiWarmed = true;
      console.log(`✅ API wake-up successful (${responseTime}ms)`);
      return {
        success: true,
        message: `AI model is active and ready (${Math.round(responseTime / 1000)}s)`,
        responseTime,
        endpoint: successfulResults.length === 2 ? 'both' : 'one'
      };
    }
    
    // Check if any failed due to timeout
    const timeoutErrors = results.filter(r => 
      r.status === 'rejected' && 
      r.reason?.name === 'AbortError'
    );
    
    if (timeoutErrors.length > 0) {
      console.warn('⏱️ API wake-up timed out');
      return {
        success: false,
        message: 'The AI service is starting. Please try again in a few seconds.',
        responseTime
      };
    }
    
    console.warn('⚠️ API wake-up failed');
    return {
      success: false,
      message: 'Unable to reach AI service. Please check your connection.',
      responseTime
    };
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('❌ API wake-up error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        message: 'Wake request timed out. The service may be starting up.',
        responseTime
      };
    }
    
    return {
      success: false,
      message: 'Failed to wake AI service. Please try again later.',
      responseTime
    };
  }
}

/**
 * Tests if the API endpoint is reachable.
 * Returns true if API responds, false otherwise.
 */
export async function testApiConnection(): Promise<{ connected: boolean; message: string; responseTime?: number }> {
  try {
    console.log('🔍 Testing API connection...');
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Try the health endpoint first
    let response = await fetch(ONE_HAND_API_ENDPOINT.replace('/predict', '/health'), {
      method: 'GET',
      signal: controller.signal
    }).catch(async () => {
      // If health endpoint fails, try a HEAD request to predict endpoint
      return await fetch(ONE_HAND_API_ENDPOINT, {
        method: 'HEAD',
        signal: controller.signal
      });
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    if (response && (response.ok || response.status === 404 || response.status === 405)) {
      // 404/405 means the endpoint exists but doesn't support this method - that's fine
      console.log(`✅ API is reachable (${responseTime}ms)`);
      return { 
        connected: true, 
        message: `API is online (${responseTime}ms)`,
        responseTime 
      };
    }
    
    console.warn('⚠️ API returned unexpected status:', response?.status);
    return { 
      connected: false, 
      message: `API returned status ${response?.status}` 
    };
  } catch (error) {
    console.error('❌ API connection test failed:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { 
          connected: false, 
          message: 'Connection timeout - API is not responding' 
        };
      }
      
      if (!navigator.onLine) {
        return { 
          connected: false, 
          message: 'No internet connection' 
        };
      }
      
      return { 
        connected: false, 
        message: 'Cannot reach API - check your network connection' 
      };
    }
    
    return { 
      connected: false, 
      message: 'Connection test failed' 
    };
  }
}

// ============================================
// MEDIAPIPE INITIALIZATION
// ============================================

async function initializeMediaPipe(): Promise<void> {
  if (handLandmarker) return;

  try {
    console.log('Initializing MediaPipe Hand Landmarker...');
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );
    
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'IMAGE',
      numHands: 1,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    
    console.log('✅ MediaPipe initialized successfully');
  } catch (error) {
    console.error('Error initializing MediaPipe:', error);
    throw new Error('Failed to initialize hand detection');
  }
}

// ============================================
// MODEL LOADING
// ============================================

async function loadOneHandModel(): Promise<void> {
  if (oneHandSession) return;

  try {
    console.log('Loading one-hand mudra model...');
    oneHandSession = await ort.InferenceSession.create(ONE_HAND_MODEL_PATH);
    
    // Load labels
    const response = await fetch(ONE_HAND_LABELS_PATH);
    const labelsData = await response.json();
    oneHandLabels = labelsData.labels;
    
    console.log('One-hand mudra model loaded successfully');
    console.log('Model inputs:', oneHandSession.inputNames);
    console.log('Model outputs:', oneHandSession.outputNames);
    console.log('Number of classes:', oneHandLabels.length);
  } catch (error) {
    console.error('Error loading one-hand mudra model:', error);
    throw new Error('Failed to load classification model');
  }
}

// ============================================
// LANDMARK EXTRACTION (MATCH NOTEBOOK PIPELINE)
// ============================================

// Port of `normalize_landmarks` from your notebook
function normalizeLandmarks(landmarkArray: Float32Array): Float32Array {
  const numPoints = 21;

  // Capture original x and y values (before centering)
  const xVals: number[] = new Array(numPoints);
  const yVals: number[] = new Array(numPoints);
  for (let i = 0; i < numPoints; i++) {
    xVals[i] = landmarkArray[i * 3];
    yVals[i] = landmarkArray[i * 3 + 1];
  }

  // Compute mean of x and y using original values
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < numPoints; i++) {
    sumX += xVals[i];
    sumY += yVals[i];
  }
  const meanX = sumX / numPoints;
  const meanY = sumY / numPoints;

  // Center the hand (subtract mean from each point)
  for (let i = 0; i < numPoints; i++) {
    const centeredX = xVals[i] - meanX;
    const centeredY = yVals[i] - meanY;
    landmarkArray[i * 3] = centeredX;
    landmarkArray[i * 3 + 1] = centeredY;
  }

  // Scale normalization based on max distance from origin
  // IMPORTANT: uses original (un-centered) xVals/yVals, like in the notebook
  let scale = 0;
  for (let i = 0; i < numPoints; i++) {
    const dist = Math.hypot(xVals[i], yVals[i]);
    if (dist > scale) scale = dist;
  }
  if (scale === 0) scale = 1;

  for (let i = 0; i < numPoints; i++) {
    landmarkArray[i * 3] /= scale;
    landmarkArray[i * 3 + 1] /= scale;
  }

  return landmarkArray;
}

async function extractHandLandmarks(imageFile: File): Promise<Float32Array> {
  // Initialize MediaPipe if not already done
  await initializeMediaPipe();
  
  if (!handLandmarker) {
    throw new Error('Hand landmarker not initialized');
  }

  // Load image
  const img = await loadImageFromFile(imageFile);
  
  // Detect hand landmarks
  console.log('🖐️ Detecting hand landmarks...');
  const results = handLandmarker.detect(img);
  
  if (!results.landmarks || results.landmarks.length === 0) {
    throw new Error('No hand detected in the image. Please ensure your hand is clearly visible.');
  }
  
  // Use the first detected hand
  const landmarks = results.landmarks[0];
  const handednessInfo: any = results.handedness?.[0]?.[0];
  console.log('Handedness info:', handednessInfo);

  const isLeftHand =
    handednessInfo &&
    (handednessInfo.categoryName === 'Left' ||
      handednessInfo.category_name === 'Left' ||
      handednessInfo.displayName === 'Left');
  
  console.log('Is left hand:', isLeftHand);

  // Convert landmarks to flat array [x1, y1, z1, x2, y2, z2, ...]
  const landmarkArray = new Float32Array(21 * 3);
  for (let i = 0; i < 21; i++) {
    let x = landmarks[i].x;
    const y = landmarks[i].y;
    const z = landmarks[i].z ?? 0;

    // Mirror x for left hand to match training pipeline
    if (isLeftHand) {
      x = -x;
    }

    landmarkArray[i * 3] = x;
    landmarkArray[i * 3 + 1] = y;
    landmarkArray[i * 3 + 2] = z;
  }

  // Apply the same normalization as in the notebook
  const normalized = normalizeLandmarks(landmarkArray);

  return normalized;
}

// ============================================
// LABEL MAPPING
// ============================================

/**
 * Maps API label names to mudra IDs in the database.
 * Some labels have spelling differences between the API and the database.
 */
const API_LABEL_TO_MUDRA_ID: Record<string, string> = {
  // One-hand mudras (lowercase)
  'musti': 'mushti',
  'mrgasirsa': 'mrigashirsha',
  'padmakosa': 'padmakosha',
  'sarpashirsa': 'sarpashirsha',
  'sikhara': 'shikhara',
  'sukatunda': 'shukatunda',
  'tamracuda': 'tamrachuda',
  'trisula': 'trishula',
  // Two-hand mudras (capitalized - API returns these with capital first letter)
  'Puspaputa': 'Puspaputa',
  'Nagabandha': 'Nagabamdha',
  'Khatva': 'Katva',
  'Shivalinga': 'Sivalinga',
  'Swastika': 'Svastika',
};

/**
 * Normalizes API label to match mudra database ID
 */
function normalizeMudraId(apiLabel: string): string {
  // First check if there's a direct mapping (case-insensitive)
  const direct = API_LABEL_TO_MUDRA_ID[apiLabel];
  if (direct) return direct;

  // Try lowercase mapping
  const lower = apiLabel.toLowerCase();
  if (API_LABEL_TO_MUDRA_ID[lower]) return API_LABEL_TO_MUDRA_ID[lower];

  // Try capitalized mapping
  const capitalized = apiLabel.charAt(0).toUpperCase() + apiLabel.slice(1).toLowerCase();
  if (API_LABEL_TO_MUDRA_ID[capitalized]) return API_LABEL_TO_MUDRA_ID[capitalized];

  // If the label matches a one-hand mudra in the database (case-insensitive), return the correct ID
  // (import oneHandMudras at the top if not already)
  try {
    // Dynamically import to avoid circular dependency
    // @ts-ignore
    const { oneHandMudras } = require('@/data/mudras');
    const found = oneHandMudras.find((m: any) => m.id.toLowerCase() === lower);
    if (found) return found.id;
  } catch {}

  // For two-hand mudras, keep the original case (API returns capitalized)
  if (apiLabel[0] === apiLabel[0].toUpperCase()) {
    return apiLabel;
  }

  // Default to capitalized for one-hand mudras (to match DB)
  return capitalized;
}

// ============================================
// CLASSIFICATION FUNCTIONS
// ============================================

/**
 * Check if the browser has network connectivity
 */
function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Wait for network to come back online
 */
async function waitForNetwork(timeoutMs: number = 10000): Promise<boolean> {
  if (isOnline()) return true;
  
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      window.removeEventListener('online', onlineHandler);
      resolve(false);
    }, timeoutMs);
    
    const onlineHandler = () => {
      clearTimeout(timeout);
      window.removeEventListener('online', onlineHandler);
      resolve(true);
    };
    
    window.addEventListener('online', onlineHandler);
  });
}

/**
 * Classifies a single-hand mudra from an uploaded image using API endpoint.
 */
export async function classifyOneHandMudra(imageFile: File): Promise<ClassificationResult> {
  // Check network connectivity before starting
  if (!isOnline()) {
    console.warn('⚠️ No network connection detected, waiting...');
    const isBack = await waitForNetwork(10000);
    if (!isBack) {
      throw new Error('No network connection. Please check your internet connection and try again.');
    }
    console.log('✅ Network connection restored');
  }
  
  const maxRetries = 5;
  const baseRetryDelay = 3000; // 3 seconds base delay
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log('====================================');
      console.log(`🔮 ONE-HAND MUDRA CLASSIFIER (Attempt ${attempt}/${maxRetries})`);
      console.log('====================================');
      console.log('📁 Image file:', imageFile.name);
      console.log('📊 File size:', (imageFile.size / 1024).toFixed(2), 'KB');
      
      // Create FormData to send image to API
      const formData = new FormData();
      formData.append('file', imageFile);
      
      console.log('🌐 Sending request to API...');
      
      // Add timeout to fetch - longer timeout for first attempt (cold start)
      const controller = new AbortController();
      const timeout = attempt === 1 ? 45000 : 20000; // 45s for first attempt, 20s for retries
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(ONE_HAND_API_ENDPOINT, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📦 API response:', result);
      
      // Extract prediction data from API response
      const predictedLabel = result.predicted_class || result.prediction || result.class;
      const confidence = result.confidence || result.probability || 0;
      
      if (!predictedLabel) {
        throw new Error('Invalid API response: missing prediction');
      }
      
      console.log('✅ Classification complete!');
      console.log('🎯 Predicted mudra:', predictedLabel);
      console.log('📈 Confidence:', (confidence * 100).toFixed(2) + '%');
      console.log('====================================');
      
      // Normalize API label to match database mudra IDs
      const mudraId = normalizeMudraId(predictedLabel);
      console.log('🔄 Normalized mudra ID:', mudraId);
      
      return {
        mudraId,
        predictedMudra: predictedLabel,
        confidence
      };
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error);
      
      // Check if it's a network error
      const isNetworkError = error instanceof TypeError && 
        (error.message.includes('fetch') || error.message.includes('network'));
      
      // If network is down or unstable, wait longer for it to stabilize
      if (!isOnline() || isNetworkError) {
        console.warn('⚠️ Network issue detected, waiting for connection to stabilize...');
        
        // Wait for network to come back
        const isBack = await waitForNetwork(15000);
        
        if (!isBack && attempt === maxRetries) {
          throw new Error('Unable to reach the API. If you just switched networks, please wait 30 seconds and try again.');
        }
        
        if (isBack) {
          console.log('✅ Network is back, waiting for connection to stabilize...');
          // Wait extra time for network to fully stabilize after switching
          await new Promise(resolve => setTimeout(resolve, 5000));
          console.log('🔄 Connection stabilized, retrying...');
          continue; // Retry after network stabilizes
        }
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error('The API is taking too long to respond. It might be waking up from sleep. Please try again in a moment.');
          }
          if (isNetworkError) {
            throw new Error('Network connection error. If you just changed networks, please wait 30 seconds for the connection to stabilize, then try again.');
          }
          throw new Error(`Classification failed: ${error.message}. The API may be starting up or temporarily unavailable.`);
        }
        throw new Error('Failed to classify mudra after multiple attempts. If you switched networks, please wait 30 seconds and try again.');
      }
      
      // Progressive backoff: longer waits for later retries
      const waitTime = baseRetryDelay * attempt;
      console.log(`⏳ Retrying in ${waitTime}ms... (Attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  // This should never be reached, but TypeScript needs it
  throw new Error('Classification failed after all retries');
}

/**
 * ============================================================================
 * TWO-HAND MUDRA CLASSIFICATION
 * ============================================================================
 * 
 * Classifies two-hand mudras using the API endpoint
 */
export async function classifyTwoHandMudra(imageFile: File): Promise<ClassificationResult> {
  // Check network connectivity before starting
  if (!isOnline()) {
    console.warn('⚠️ No network connection detected, waiting...');
    const isBack = await waitForNetwork(10000);
    if (!isBack) {
      throw new Error('No network connection. Please check your internet connection and try again.');
    }
    console.log('✅ Network connection restored');
  }
  
  const maxRetries = 5;
  const baseRetryDelay = 3000; // 3 seconds base delay
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log('====================================');
      console.log(`🔮 TWO-HAND MUDRA CLASSIFIER (Attempt ${attempt}/${maxRetries})`);
      console.log('====================================');
      console.log('📁 Image file:', imageFile.name);
      console.log('📊 File size:', (imageFile.size / 1024).toFixed(2), 'KB');
      
      // Create FormData to send image to API
      const formData = new FormData();
      formData.append('file', imageFile);
      
      console.log('🌐 Sending request to two-hand API...');
      
      // Add timeout to fetch - longer timeout for first attempt (cold start)
      const controller = new AbortController();
      const timeout = attempt === 1 ? 45000 : 20000; // 45s for first attempt, 20s for retries
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(TWO_HAND_API_ENDPOINT, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📦 API response:', result);
      
      // Extract prediction data from API response
      const predictedLabel = result.predicted_class || result.prediction || result.class;
      const confidence = result.confidence || result.probability || 0;
      
      if (!predictedLabel) {
        throw new Error('Invalid API response: missing prediction');
      }
      
      console.log('✅ Classification complete!');
      console.log('🎯 Predicted mudra:', predictedLabel);
      console.log('📈 Confidence:', (confidence * 100).toFixed(2) + '%');
      console.log('====================================');
      
      // Normalize API label to match database mudra IDs
      const mudraId = normalizeMudraId(predictedLabel);
      console.log('🔄 Normalized mudra ID:', mudraId);
      
      return {
        mudraId,
        predictedMudra: predictedLabel,
        confidence
      };
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error);
      
      // Check if it's a network error
      const isNetworkError = error instanceof TypeError && 
        (error.message.includes('fetch') || error.message.includes('network'));
      
      // If network is down or unstable, wait longer for it to stabilize
      if (!isOnline() || isNetworkError) {
        console.warn('⚠️ Network issue detected, waiting for connection to stabilize...');
        
        // Wait for network to come back
        const isBack = await waitForNetwork(15000);
        
        if (!isBack && attempt === maxRetries) {
          throw new Error('Unable to reach the API. If you just switched networks, please wait 30 seconds and try again.');
        }
        
        if (isBack) {
          console.log('✅ Network is back, waiting for connection to stabilize...');
          // Wait extra time for network to fully stabilize after switching
          await new Promise(resolve => setTimeout(resolve, 5000));
          console.log('🔄 Connection stabilized, retrying...');
          continue; // Retry after network stabilizes
        }
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error('The API is taking too long to respond. It might be waking up from sleep. Please try again in a moment.');
          }
          if (isNetworkError) {
            throw new Error('Network connection error. If you just changed networks, please wait 30 seconds for the connection to stabilize, then try again.');
          }
          throw new Error(`Classification failed: ${error.message}. The API may be starting up or temporarily unavailable.`);
        }
        throw new Error('Failed to classify mudra after multiple attempts. If you switched networks, please wait 30 seconds and try again.');
      }
      
      // Progressive backoff: longer waits for later retries
      const waitTime = baseRetryDelay * attempt;
      console.log(`⏳ Retrying in ${waitTime}ms... (Attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  // This should never be reached, but TypeScript needs it
  throw new Error('Classification failed after all retries');
}

/**
 * Helper function to load image from File object
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
