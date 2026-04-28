import type { CitsEvent } from "./types";

export function startCitsWebSocket(
  onEvent: (event: CitsEvent) => void,
  url = "ws://localhost:8080"
): () => void {
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("[WS] Connected:", url);
  };

  socket.onmessage = (message) => {
    try {
      const event = JSON.parse(message.data) as CitsEvent;
      onEvent(event);
    } catch (error) {
      console.error("[WS] Failed to parse message:", error, message.data);
    }
  };

  socket.onerror = (error) => {
    console.error("[WS] Error:", error);
  };

  socket.onclose = () => {
    console.log("[WS] Closed");
  };

  return () => {
    socket.close();
  };
}