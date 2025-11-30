/**
 * User Behavior Tracking Service
 * Tracks mouse movements, clicks, hovers, scrolls, and link interactions
 * Integrates with Microsoft Clarity for comprehensive analytics
 */

import { trackEvent, setMetadata } from "./clarityService";

interface ClickData {
  x: number;
  y: number;
  element: string;
  elementId?: string;
  elementClass?: string;
  timestamp: number;
}

interface MouseMoveData {
  x: number;
  y: number;
  timestamp: number;
}

interface ScrollData {
  scrollX: number;
  scrollY: number;
  scrollPercentage: number;
  timestamp: number;
}

interface HoverData {
  element: string;
  elementId?: string;
  durationMs: number;
  timestamp: number;
}

let mouseTrackingActive = false;
let clicksRecorded = 0;
let hoverElements = new Map<string, number>();
let scrollEvents = 0;
let maxScrollDepth = 0;

/**
 * Initialize all behavior tracking
 */
export const initializeBehaviorTracking = () => {
  console.log("Initializing User Behavior Tracking...");
  
  trackClickEvents();
  trackMouseMovement();
  trackScrollBehavior();
  trackHoverBehavior();
  trackLinkClicks();
  trackFormInteractions();
  trackPageLeaveIntent();
  
  // Track session summary periodically
  setInterval(trackSessionSummary, 30000); // Every 30 seconds
  
  // Track final session data before page unload
  window.addEventListener("beforeunload", trackSessionSummary);
};

/**
 * Track all click events on the page
 */
const trackClickEvents = () => {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    clicksRecorded++;

    const clickData: ClickData = {
      x: event.clientX,
      y: event.clientY,
      element: target.tagName.toLowerCase(),
      elementId: target.id || undefined,
      elementClass: target.className || undefined,
      timestamp: Date.now(),
    };

    // Track in Clarity
    trackEvent("click_tracked", {
      position: `${clickData.x},${clickData.y}`,
      elementType: clickData.element,
      elementId: clickData.elementId,
      clickCount: clicksRecorded,
    });

    console.log("Click tracked:", clickData);
  });
};

/**
 * Track mouse movement across the page
 * Debounced to avoid excessive events
 */
const trackMouseMovement = () => {
  mouseTrackingActive = true;
  let lastTrackTime = 0;
  const THROTTLE_INTERVAL = 1000; // Track every 1 second

  document.addEventListener("mousemove", (event) => {
    const now = Date.now();
    
    if (now - lastTrackTime < THROTTLE_INTERVAL) {
      return;
    }

    lastTrackTime = now;

    const moveData: MouseMoveData = {
      x: event.clientX,
      y: event.clientY,
      timestamp: now,
    };

    // Store mouse position metadata
    setMetadata("last_mouse_x", moveData.x);
    setMetadata("last_mouse_y", moveData.y);

    console.log("Mouse movement tracked:", moveData);
  });
};

/**
 * Track scroll behavior including depth and percentage
 */
const trackScrollBehavior = () => {
  let lastScrollTime = 0;
  const THROTTLE_INTERVAL = 500;

  window.addEventListener("scroll", () => {
    const now = Date.now();
    
    if (now - lastScrollTime < THROTTLE_INTERVAL) {
      return;
    }

    lastScrollTime = now;
    scrollEvents++;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolledPercentage = scrollHeight > 0 
      ? (window.scrollY / scrollHeight) * 100 
      : 0;

    // Update max scroll depth
    if (scrolledPercentage > maxScrollDepth) {
      maxScrollDepth = scrolledPercentage;
      setMetadata("max_scroll_depth", Math.round(maxScrollDepth));
    }

    const scrollData: ScrollData = {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      scrollPercentage: Math.round(scrolledPercentage),
      timestamp: now,
    };

    trackEvent("scroll_tracked", {
      scrollPercentage: scrollData.scrollPercentage,
      scrollEvents: scrollEvents,
    });

    console.log("Scroll tracked:", scrollData);
  });
};

/**
 * Track hover behavior on interactive elements
 */
const trackHoverBehavior = () => {
  const selectAllInteractive = document.querySelectorAll(
    "button, a, input, [role='button'], [role='link'], .interactive, .hover-target"
  );

  selectAllInteractive.forEach((element) => {
    const htmlElement = element as HTMLElement;
    let hoverStartTime = 0;

    htmlElement.addEventListener("mouseenter", () => {
      hoverStartTime = Date.now();
      
      const elementId = htmlElement.id || htmlElement.className || htmlElement.tagName;
      trackEvent("hover_start", {
        element: elementId,
        tagName: htmlElement.tagName.toLowerCase(),
      });
    });

    htmlElement.addEventListener("mouseleave", () => {
      if (hoverStartTime === 0) return;

      const durationMs = Date.now() - hoverStartTime;
      const elementId = htmlElement.id || htmlElement.className || htmlElement.tagName;

      const hoverData: HoverData = {
        element: elementId,
        elementId: htmlElement.id,
        durationMs,
        timestamp: Date.now(),
      };

      trackEvent("hover_tracked", {
        element: elementId,
        durationMs,
        tagName: htmlElement.tagName.toLowerCase(),
      });

      hoverElements.set(elementId, (hoverElements.get(elementId) || 0) + durationMs);
      
      console.log("Hover tracked:", hoverData);
    });
  });

  // Re-attach listeners to dynamically added elements
  const observer = new MutationObserver(() => {
    const newInteractive = document.querySelectorAll(
      "button, a, input, [role='button'], [role='link'], .interactive"
    );
    
    newInteractive.forEach((element) => {
      // Only attach if not already attached
      if (!(element as any)._hoverTracked) {
        (element as any)._hoverTracked = true;
        const htmlElement = element as HTMLElement;
        let hoverStartTime = 0;

        htmlElement.addEventListener("mouseenter", () => {
          hoverStartTime = Date.now();
        });

        htmlElement.addEventListener("mouseleave", () => {
          if (hoverStartTime === 0) return;
          const durationMs = Date.now() - hoverStartTime;
          const elementId = htmlElement.id || htmlElement.className;
          trackEvent("hover_tracked", { element: elementId, durationMs });
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

/**
 * Track clicks on internal links
 */
const trackLinkClicks = () => {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLAnchorElement;
    
    if (target.tagName === "A") {
      const href = target.getAttribute("href");
      const linkText = target.textContent?.trim() || "Unknown";

      trackEvent("link_clicked", {
        href,
        linkText,
        position: `${event.clientX},${event.clientY}`,
        isExternal: href?.startsWith("http") && !href.includes(window.location.hostname),
      });

      console.log("Link click tracked:", { href, linkText });
    }
  });
};

/**
 * Track form interactions (focus, blur, input)
 */
const trackFormInteractions = () => {
  const formElements = document.querySelectorAll("input, textarea, select");

  formElements.forEach((element) => {
    const htmlElement = element as HTMLInputElement;

    htmlElement.addEventListener("focus", () => {
      trackEvent("form_field_focused", {
        fieldName: htmlElement.name || htmlElement.id,
        fieldType: htmlElement.type,
      });
    });

    htmlElement.addEventListener("blur", () => {
      trackEvent("form_field_blurred", {
        fieldName: htmlElement.name || htmlElement.id,
        fieldType: htmlElement.type,
      });
    });

    htmlElement.addEventListener("change", () => {
      trackEvent("form_field_changed", {
        fieldName: htmlElement.name || htmlElement.id,
        fieldType: htmlElement.type,
      });
    });
  });

  // Track form submissions
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      trackEvent("form_submitted", {
        formId: form.id,
        formName: form.name,
        formAction: form.action,
      });
      console.log("Form submission tracked");
    });
  });
};

/**
 * Track page leave intent (mouse leaving viewport)
 */
const trackPageLeaveIntent = () => {
  document.addEventListener("mouseleave", () => {
    trackEvent("page_leave_intent", {
      timestamp: Date.now(),
    });
    console.log("Page leave intent tracked");
  });

  // Also track when user presses ESC key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      trackEvent("escape_key_pressed", {
        timestamp: Date.now(),
      });
    }
  });
};

/**
 * Track session summary (periodic tracking)
 */
const trackSessionSummary = () => {
  const summary = {
    totalClicks: clicksRecorded,
    totalScrollEvents: scrollEvents,
    maxScrollDepth: Math.round(maxScrollDepth),
    timeOnPage: Math.round((Date.now() - sessionStartTime) / 1000),
    mouseTrackingActive,
    hoveredElements: hoverElements.size,
  };

  trackEvent("session_summary", summary);
  setMetadata("session_clicks", clicksRecorded);
  setMetadata("session_scroll_depth", Math.round(maxScrollDepth));

  console.log("Session summary:", summary);
};

// Track session start time
const sessionStartTime = Date.now();

/**
 * Get current session statistics
 */
export const getSessionStats = () => {
  return {
    clicksRecorded,
    scrollEvents,
    maxScrollDepth: Math.round(maxScrollDepth),
    timeOnPageSeconds: Math.round((Date.now() - sessionStartTime) / 1000),
    hoveredElements: hoverElements.size,
    mostHoveredElement: Array.from(hoverElements.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0],
  };
};

export default {
  initializeBehaviorTracking,
  getSessionStats,
};
