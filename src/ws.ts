import type { CitsEvent } from "./types";

export function startCitsWebSocket(
  onEvent: (event: CitsEvent) => void,
  url = "ws://localhost:8080"
): () => void {
  let socket: WebSocket | null = null;
  let reconnectTimer: number | null = null;
  let shouldReconnect = true;

  function clearReconnectTimer() {
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function scheduleReconnect() {
    if (!shouldReconnect || reconnectTimer !== null) return;

    console.log("[WS] Attempting to reconnect in 1 second...");
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, 1000);
  }

  function connect() {
    if (!shouldReconnect) return;
    if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) {
      return;
    }

    socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("[WS] Connected:", url);
      clearReconnectTimer();
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
      scheduleReconnect();
    };
  }

  // Initial connection
  connect();

  return () => {
    shouldReconnect = false;
    clearReconnectTimer();
    if (socket) {
      socket.close();
      socket = null;
    }
  };
}