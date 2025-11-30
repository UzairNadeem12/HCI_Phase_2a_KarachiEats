/**
 * Tracking Report Generator
 * Generates comprehensive tracking reports for HCI Phase 2 analysis
 */

import { getSessionStats } from "./userBehaviorTracking";

export interface TrackingReport {
  timestamp: string;
  sessionId: string;
  pageUrl: string;
  duration: number;
  metrics: {
    totalClicks: number;
    totalScrollEvents: number;
    maxScrollDepth: number;
    timeOnPageSeconds: number;
    uniqueHoveredElements: number;
  };
  generatedAt: string;
}

/**
 * Generate a tracking report for the current session
 */
export const generateTrackingReport = (): TrackingReport => {
  const stats = getSessionStats();
  
  const report: TrackingReport = {
    timestamp: new Date().toISOString(),
    sessionId: generateSessionId(),
    pageUrl: window.location.href,
    duration: stats.timeOnPageSeconds,
    metrics: {
      totalClicks: stats.clicksRecorded,
      totalScrollEvents: stats.scrollEvents,
      maxScrollDepth: stats.maxScrollDepth,
      timeOnPageSeconds: stats.timeOnPageSeconds,
      uniqueHoveredElements: stats.hoveredElements,
    },
    generatedAt: new Date().toLocaleString(),
  };

  return report;
};

/**
 * Generate a unique session ID
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Export report as JSON
 */
export const exportReportAsJSON = () => {
  const report = generateTrackingReport();
  const dataStr = JSON.stringify(report, null, 2);
  downloadFile(dataStr, "tracking-report.json");
};

/**
 * Export report as CSV
 */
export const exportReportAsCSV = () => {
  const report = generateTrackingReport();
  
  const csv = `Tracking Report - ${report.timestamp}
Session ID,${report.sessionId}
Page URL,${report.pageUrl}
Duration (seconds),${report.duration}
Total Clicks,${report.metrics.totalClicks}
Total Scroll Events,${report.metrics.totalScrollEvents}
Max Scroll Depth (%),${report.metrics.maxScrollDepth}
Unique Hovered Elements,${report.metrics.uniqueHoveredElements}
Generated At,${report.generatedAt}`;

  downloadFile(csv, "tracking-report.csv");
};

/**
 * Helper function to download files
 */
const downloadFile = (content: string, filename: string) => {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Print report to console for debugging
 */
export const printReportToConsole = () => {
  const report = generateTrackingReport();
  console.log("%c📊 User Behavior Tracking Report", "font-size: 16px; font-weight: bold; color: #0066cc;");
  console.table(report.metrics);
  console.log("Full Report:", report);
};

export default {
  generateTrackingReport,
  exportReportAsJSON,
  exportReportAsCSV,
  printReportToConsole,
};
