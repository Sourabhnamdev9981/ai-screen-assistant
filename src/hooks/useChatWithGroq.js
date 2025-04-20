import { useState } from 'react';

export default function useChatWithGroq() {
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [chatResponse, setChatResponse] = useState(null);

  const sendPromptToGroq = async (prompt) => {
    setChatLoading(true);
    setChatError(null);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      setChatResponse(data.response);
    } catch (err) {
      setChatError("Failed to fetch AI response");
    } finally {
      setChatLoading(false);
    }
  };

  return {
    chatResponse,
    chatLoading,
    chatError,
    sendPromptToGroq
  };
}
