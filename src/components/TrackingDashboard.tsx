import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSessionStats } from "@/services/userBehaviorTracking";

export const TrackingDashboard = () => {
  const [stats, setStats] = useState({
    clicksRecorded: 0,
    scrollEvents: 0,
    maxScrollDepth: 0,
    timeOnPageSeconds: 0,
    hoveredElements: 0,
    mostHoveredElement: undefined as any,
  });

  const updateStats = () => {
    const currentStats = getSessionStats();
    setStats(currentStats);
  };

  useEffect(() => {
    // Update stats every 2 seconds
    const interval = setInterval(updateStats, 2000);
    updateStats(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Behavior Tracking Dashboard</CardTitle>
          <CardDescription>Real-time analytics for your HCI Phase 2 Project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Clicks Card */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.clicksRecorded}</div>
                <p className="text-xs text-gray-500 mt-1">tracked click events</p>
              </CardContent>
            </Card>

            {/* Scroll Events Card */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Scroll Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.scrollEvents}</div>
                <p className="text-xs text-gray-500 mt-1">scroll interactions</p>
              </CardContent>
            </Card>

            {/* Max Scroll Depth Card */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Max Scroll Depth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{stats.maxScrollDepth}%</div>
                <p className="text-xs text-gray-500 mt-1">page scrolled</p>
              </CardContent>
            </Card>

            {/* Time on Page Card */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Time on Page</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {Math.floor(stats.timeOnPageSeconds / 60)}:{String(stats.timeOnPageSeconds % 60).padStart(2, "0")}
                </div>
                <p className="text-xs text-gray-500 mt-1">minutes:seconds</p>
              </CardContent>
            </Card>

            {/* Hovered Elements Card */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Hovered Elements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pink-600">{stats.hoveredElements}</div>
                <p className="text-xs text-gray-500 mt-1">interactive elements</p>
              </CardContent>
            </Card>

            {/* Most Hovered Card */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Most Hovered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold text-teal-600 truncate">
                  {stats.mostHoveredElement ? stats.mostHoveredElement[0] : "N/A"}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.mostHoveredElement 
                    ? `${Math.round(stats.mostHoveredElement[1] / 1000)}s hover time`
                    : "no hovers yet"
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={updateStats}
            className="mt-6"
            variant="outline"
          >
            Refresh Stats
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How to View Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>1. Real-time Dashboard:</strong>
            <p className="text-gray-600 ml-4 mt-1">This dashboard shows live tracking data. Interact with the app to see updates.</p>
          </div>
          <div>
            <strong>2. Microsoft Clarity Dashboard:</strong>
            <p className="text-gray-600 ml-4 mt-1">
              Visit <a href="https://clarity.microsoft.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">clarity.microsoft.com</a> to view:
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4 mt-2 space-y-1">
              <li><strong>Session Recordings:</strong> Watch actual user interactions</li>
              <li><strong>Heatmaps:</strong> See which areas get the most attention</li>
              <li><strong>Click Maps:</strong> Identify where users click most</li>
              <li><strong>Scroll Depth:</strong> Analyze how far users scroll</li>
              <li><strong>Custom Events:</strong> View all tracked events in detail</li>
            </ul>
          </div>
          <div>
            <strong>3. Browser Console:</strong>
            <p className="text-gray-600 ml-4 mt-1">
              Open DevTools (F12) → Console tab to see detailed logs of all tracked interactions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingDashboard;
