/**
 * Microsoft Clarity Service
 * Initializes and manages Clarity tracking
 */

declare global {
  interface Window {
    clarity?: (action: string, ...args: any[]) => void;
  }
}

const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID 
/**
 * Initialize Microsoft Clarity
 * This should be called early in your app lifecycle
 */
export const initializeClarity = () => {
  if (window.clarity) {
    console.log("Clarity is already initialized");
    return;
  }

  // The clarity script is already loaded in index.html
  console.log("Clarity service initialized with Project ID:", CLARITY_PROJECT_ID);
};

/**
 * Track custom events in Clarity
 * @param eventName - Name of the event
 * @param data - Optional event data
 */
export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  if (window.clarity) {
    window.clarity("event", eventName, data);
    console.log(`Clarity Event: ${eventName}`, data);
  }
};

/**
 * Identify a user in Clarity
 * @param userId - Unique user identifier
 * @param userEmail - Optional user email
 */
export const identifyUser = (userId: string, userEmail?: string) => {
  if (window.clarity) {
    window.clarity("identify", userId);
    if (userEmail) {
      window.clarity("metadata", "email", userEmail);
    }
    console.log("Clarity user identified:", userId);
  }
};

/**
 * Set custom metadata for the session
 * @param key - Metadata key
 * @param value - Metadata value
 */
export const setMetadata = (key: string, value: string | number | boolean) => {
  if (window.clarity) {
    window.clarity("metadata", key, String(value));
    console.log(`Clarity metadata set: ${key} = ${value}`);
  }
};

/**
 * Track page visits
 * @param pageName - Name of the page
 */
export const trackPageView = (pageName: string) => {
  if (window.clarity) {
    window.clarity("event", `page_view_${pageName}`);
    console.log("Clarity page view tracked:", pageName);
  }
};

/**
 * Track user actions (clicks, form submissions, etc.)
 * @param actionName - Name of the action
 * @param metadata - Optional metadata about the action
 */
export const trackUserAction = (actionName: string, metadata?: Record<string, any>) => {
  if (window.clarity) {
    window.clarity("event", `user_action_${actionName}`, metadata);
    console.log("Clarity user action tracked:", actionName, metadata);
  }
};

export default {
  initializeClarity,
  trackEvent,
  identifyUser,
  setMetadata,
  trackPageView,
  trackUserAction,
};
