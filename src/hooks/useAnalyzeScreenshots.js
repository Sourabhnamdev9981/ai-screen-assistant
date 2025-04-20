// frontend/src/hooks/useAnalyzeScreenshots.js
import { useState } from "react";

export default function useAnalyzeScreenshots() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [analyzeStatus, setAnalyzeStatus] = useState(""); // status for UI

  const analyze = async (screenshots) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setAnalyzeStatus("Sending screenshots for analysis...");

    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: screenshots }), // ✅ FIXED: now sending correct format
      });

      if (!res.ok) throw new Error("Failed to analyze screenshots");

      setAnalyzeStatus("Analyzing screenshots on the server...");
      const data = await res.json();

      setResult(data);
      setAnalyzeStatus("Analysis complete.");
    } catch (err) {
      console.error("Analyze error:", err);
      setError(err.message);
      setAnalyzeStatus("Error during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return { analyze, result, loading, error, analyzeStatus };
}
