import { createRoot } from "react-dom/client";
import posthog from 'posthog-js';
import App from "./App.tsx";
import "./index.css";

// Initialize PostHog
posthog.init('phc_s3LGr7HWqZEZHejo6cTbLgo6kq4lilHOefPKt1iuhoP', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'always',
  capture_pageview: true,
  capture_pageleave: true,
  autocapture: true,
});

createRoot(document.getElementById("root")!).render(<App />);
