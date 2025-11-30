import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/services/clarityService";

/**
 * Hook to automatically track page views with Clarity
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track the page view whenever the route changes
    const pageName = location.pathname.replace(/\//g, "_") || "home";
    trackPageView(pageName);
  }, [location.pathname]);
};

export default usePageTracking;
